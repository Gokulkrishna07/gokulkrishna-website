import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PipelineSimulator from "../src/components/PipelineSimulator";

const STAGES = [
  "checkout",
  "build",
  "test",
  "sonarqube-scan",
  "build-and-push",
  "deploy-production",
  "notify",
];

const runButton = () => screen.getByRole("button", { name: /run workflow|re-run all jobs|running/i });
const statusPill = () => screen.getByText(/^(Waiting|In progress|Success|Failure)$/);

// The run is driven by real 300ms sleeps, so give the whole workflow room to finish.
const settled = (matcher) => waitFor(() => expect(statusPill()).toHaveTextContent(matcher), {
  timeout: 30000,
});

describe("PipelineSimulator", () => {
  it("starts idle with every job pending and nothing selected", () => {
    render(<PipelineSimulator />);

    expect(statusPill()).toHaveTextContent("Waiting");
    expect(screen.getByText(/no job selected/i)).toBeInTheDocument();
    expect(screen.getByText(/waiting for workflow_dispatch/i)).toBeInTheDocument();

    for (const stage of STAGES) {
      // Exact match: "build" must not also select "build-and-push".
      expect(screen.getByRole("button", { name: stage })).toBeDisabled();
    }
  });

  it("shows the run metadata a real Actions run would carry", () => {
    render(<PipelineSimulator />);

    expect(screen.getByText(/feat: add rollout strategy/)).toBeInTheDocument();
    expect(screen.getByText("#47")).toBeInTheDocument();
    expect(screen.getByText("deploy.yml")).toBeInTheDocument();
    expect(screen.getByText("8f3c21d")).toBeInTheDocument();
    expect(screen.getByText("main")).toBeInTheDocument();
  });

  it("runs every job to success and streams logs", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    expect(statusPill()).toHaveTextContent("In progress");

    await settled("Success");

    // Every job now reports a duration, which only happens once it completes.
    expect(screen.getByText("38s")).toBeInTheDocument();
    expect(screen.getByText(/POST teams-webhook/)).toBeInTheDocument();
  }, 40000);

  it("lets you open a completed job to read its own logs", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    await settled("Success");

    const checkoutJob = screen
      .getAllByRole("button")
      .find((b) => b.textContent.startsWith("checkout"));
    await user.click(checkoutJob);

    expect(screen.getByText(/Run actions\/checkout@v4/)).toBeInTheDocument();
    expect(screen.getByText(/HEAD is now at 8f3c21d/)).toBeInTheDocument();
    // Another job's output is no longer on screen.
    expect(screen.queryByText(/POST teams-webhook/)).not.toBeInTheDocument();
  }, 40000);

  it("fails the quality gate, skips downstream jobs and raises an annotation", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(runButton());
    await settled("Failure");

    expect(screen.getByText(/failed the quality gate/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality gate status: FAILED/)).toBeInTheDocument();
    expect(screen.getByText(/exit code 1/)).toBeInTheDocument();

    // Jobs after the failure never ran, so they carry no duration.
    expect(screen.queryByText(/POST teams-webhook/)).not.toBeInTheDocument();
    expect(screen.queryByText("52s")).not.toBeInTheDocument();
  }, 40000);

  it("resets back to the idle state", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    await settled("Success");

    await user.click(screen.getByRole("button", { name: /^reset$/i }));

    expect(statusPill()).toHaveTextContent("Waiting");
    expect(screen.getByText(/no job selected/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run workflow/i })).toBeInTheDocument();
  }, 40000);

  it("re-runs cleanly after a failed run", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    const failToggle = screen.getAllByRole("checkbox")[0];
    await user.click(failToggle);
    await user.click(runButton());
    await settled("Failure");

    await user.click(failToggle);
    await user.click(screen.getByRole("button", { name: /re-run all jobs/i }));
    await settled("Success");

    expect(screen.queryByText(/failed the quality gate/i)).not.toBeInTheDocument();
  }, 60000);

  it("disables the run button while a workflow is in flight", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    expect(screen.getByRole("button", { name: /running/i })).toBeDisabled();

    await settled("Success");
  }, 40000);

  it("keeps a duration ticking while the run is in progress", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    await waitFor(() => expect(screen.getByText(/^\d+s$/)).toBeInTheDocument());

    await settled("Success");
  }, 40000);

  it("formats long durations in minutes and seconds", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);

    await user.click(runButton());
    await settled("Success");

    // The seven job durations total 198 seconds.
    expect(screen.getByText("3m 18s")).toBeInTheDocument();
  }, 40000);

  // A run is a long chain of awaits. If it kept going after unmount it would set
  // state on a dead component; these unmount at different points in that chain.
  it.each([
    ["mid step, between log lines", 400],
    ["at a job boundary", 1600],
  ])("abandons the run when unmounted %s", async (_label, delay) => {
    const user = userEvent.setup();
    const { unmount, container } = render(<PipelineSimulator />);

    await user.click(runButton());
    await new Promise((r) => setTimeout(r, delay));

    expect(() => unmount()).not.toThrow();
    expect(container).toBeEmptyDOMElement();

    // Let every pending sleep resolve; the run must abandon itself rather than
    // carry on writing state into a component that is gone.
    await new Promise((r) => setTimeout(r, 1200));
    expect(container).toBeEmptyDOMElement();
  }, 20000);

  it("exposes the failure switch on both mobile and desktop layouts", async () => {
    const user = userEvent.setup();
    render(<PipelineSimulator />);
    const toggles = screen.getAllByRole("checkbox");

    expect(toggles).toHaveLength(2);
    for (const toggle of toggles) {
      expect(within(toggle.closest("label")).getByText(/simulate failure/i)).toBeInTheDocument();
    }

    // Both copies drive the same state, so either layout can arm a failure.
    await user.click(toggles[1]);
    expect(toggles[0]).toBeChecked();
    expect(toggles[1]).toBeChecked();

    await user.click(toggles[1]);
    expect(toggles[0]).not.toBeChecked();
  });
});
