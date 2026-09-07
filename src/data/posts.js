// Add a post by setting status: "published", a date, and blocks in `content`.
// Block types: { type: "p" | "h2" | "verdict", text } and { type: "list", items: [] }.
// `embed` renders the original LinkedIn carousel; `link` adds a "read the original" footer link.
// Anything left as "draft" shows on the listing as an upcoming topic and is not clickable.

// activityId drives the "read the original" link; ugcPostId drives the embedded carousel.
// They are different ids on LinkedIn — take the embed id from the share dialog's iframe.
const linkedin = (activityId, ugcPostId) => ({
  link: `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`,
  embed: `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcPostId}?collapsed=1`,
});

export const POSTS = [
  {
    slug: "what-is-llmops",
    title: "What is LLMOps",
    summary:
      "Everyone uses AI. Far fewer people know what runs underneath it — prompt versioning, vector databases, RAG, guardrails and token level observability. This is the engineering layer that turns a model into a product.",
    tags: ["LLMOps", "RAG", "Kubernetes"],
    status: "published",
    date: "10 Aug 2026",
    ...linkedin("7492437092828925953", "7491108304853590016"),
    content: [
      {
        type: "p",
        text: "Everyone uses AI now. Very few people know what happens behind the box they type into. The model is the part everyone talks about, and it is rarely the part that breaks.",
      },
      {
        type: "p",
        text: "LLMOps is the engineering discipline around the model — the work that turns a impressive demo into something that survives real users, real traffic and a real invoice.",
      },

      { type: "h2", text: "The prompt is an artifact now" },
      {
        type: "p",
        text: "In a notebook a prompt is a string you edit until the output looks right. In production it is a deployed artifact: it has versions, it has a rollback, and changing it changes behaviour for every user at once.",
      },
      {
        type: "p",
        text: "Teams that treat prompts casually find out the hard way. Someone tweaks wording on a Friday, quality quietly shifts, and there is no diff to point at because the change never went through code review.",
      },
      {
        type: "verdict",
        text: "If you cannot answer 'which prompt version produced this output', you do not have LLMOps yet.",
      },

      { type: "h2", text: "Retrieval is where the real engineering lives" },
      {
        type: "p",
        text: "RAG sounds simple — look things up, put them in the context, ask the model. The retrieval half is where the difficulty actually sits: how documents are chunked, which embedding model was used, how the vector store is indexed, and what happens when the source data changes.",
      },
      {
        type: "p",
        text: "Re-embedding a corpus because you switched embedding models is a migration, not a config change. Vector databases like Pinecone, Qdrant and Weaviate make storage easy and none of them make that decision for you.",
      },

      { type: "h2", text: "Guardrails are not optional" },
      {
        type: "p",
        text: "A model will confidently produce something wrong, something unsafe, or something that leaks context it should never have seen. Guardrails are the input validation and output filtering that sit either side of the call, plus the policy about what the model is allowed to reach at all.",
      },

      { type: "h2", text: "Observability, but token shaped" },
      {
        type: "p",
        text: "Normal monitoring asks whether the service responded and how fast. An LLM service can return a perfect 200 and still be failing: answers drift, hallucination rates climb, cost per request quietly doubles because a retrieval step started returning more context.",
      },
      {
        type: "list",
        items: [
          "Latency, including time to first token, not just total duration.",
          "Cost per request, tracked per feature — token spend is a production metric, not a finance report.",
          "Quality signals: evaluations, user feedback, and the rate at which people retry or abandon.",
          "Retrieval health — how often the context actually contained the answer.",
        ],
      },

      { type: "h2", text: "Why this is its own discipline" },
      {
        type: "p",
        text: "DevOps ships code. MLOps ships code plus data plus a trained model. LLMOps usually ships none of those — the model belongs to someone else — and instead ships prompts, retrieval pipelines, guardrails and evaluation. The failure modes are different enough to need their own tooling and their own on call instincts.",
      },
      {
        type: "verdict",
        text: "The model is a dependency. Everything around it is the product, and everything around it is yours to operate.",
      },
    ],
  },

  {
    slug: "hidden-engineering-behind-spotify-recommendations",
    title: "The hidden engineering behind Spotify recommendations",
    summary:
      "Every time you skip a song you are labelling training data. What that tap sets off — streaming events, feature pipelines, model registries, a fifty millisecond response — and why the hard part starts after launch.",
    tags: ["MLOps", "Kubernetes", "Prometheus", "Docker"],
    status: "published",
    date: "9 Aug 2026",
    ...linkedin("7492074716732547073", "7491074448796815360"),
    content: [
      {
        type: "p",
        text: "Every time you skip a song on Spotify you are labelling training data. The skip is the strongest negative signal the system gets, and it is more honest than anything you would tell a survey.",
      },
      {
        type: "p",
        text: "That single tap travels through a pipeline most people never think about, and the whole loop has a name: MLOps. It is the discipline of keeping machine learning models reliable once they are actually in production, rather than merely accurate in a notebook.",
      },

      { type: "h2", text: "What happens after the tap" },
      {
        type: "list",
        items: [
          "The event is streamed and stored, alongside millions like it.",
          "Raw activity is turned into features — the shape a model can actually learn from.",
          "A model is trained, and every run is tracked so results can be reproduced.",
          "The chosen version is registered, packaged into a container, and rolled out on Kubernetes.",
          "It serves a recommendation back to your phone in under fifty milliseconds.",
        ],
      },
      {
        type: "p",
        text: "Nothing in that list is exotic on its own. The difficulty is that it has to run continuously, without a human deciding when each stage happens.",
      },

      { type: "h2", text: "Models decay quietly" },
      {
        type: "p",
        text: "This is the part engineers underestimate. A model does not fail like code fails. There is no exception, no failing test, no red build — the recommendations simply get worse, slowly, while every dashboard stays green.",
      },
      {
        type: "list",
        items: [
          "Data drift: the input distribution moves. New users, new markets, new listening habits.",
          "Concept drift: the relationship between input and outcome changes. What a skip meant last year is not what it means now.",
          "Model drift: the model itself becomes stale relative to the world it is predicting.",
        ],
      },
      {
        type: "p",
        text: "This is why monitoring in MLOps is not the same job as monitoring a web service, and why tools built specifically to watch model behaviour exist alongside the usual metrics stack.",
      },

      { type: "h2", text: "Why this is harder than DevOps" },
      {
        type: "p",
        text: "DevOps ships code. A bad commit breaks it, and the commit tells you exactly what changed and when. MLOps ships code plus data plus a trained model — and it breaks when the world shifts, with no commit at all.",
      },
      {
        type: "verdict",
        text: "Same discipline, harder problem: the thing that broke your system may be something nobody on your team did.",
      },
      {
        type: "p",
        text: "It is already running behind the products you use without noticing — Netflix, Amazon, YouTube, Instagram, Uber, Maps. The recommendation feels effortless precisely because the engineering behind it never stops running.",
      },
    ],
  },

  {
    slug: "seven-ops-behind-the-apps-you-use",
    title: "The hidden tech behind the apps you use every day",
    summary:
      "A commit becomes a container, lands on Kubernetes and reaches you in under a second. That is one discipline out of seven — DevOps, GitOps, MLOps, LLMOps, AIOps, AgentOps and Platform Engineering, and what each one is actually for.",
    tags: ["DevOps", "GitOps", "Kubernetes", "CI/CD"],
    status: "published",
    date: "8 Aug 2026",
    ...linkedin("7491712305169289216", "7491066756283752449"),
    content: [
      {
        type: "p",
        text: "Every time you open Netflix, hit play on Spotify, or type a prompt into ChatGPT, you are standing on top of engineering work you never see. A commit travels through CI/CD, gets packaged into a container, lands on Kubernetes and reaches you, usually in under a second.",
      },
      {
        type: "p",
        text: "That is one discipline. There are at least seven now, and they exist because each one solves a problem the previous one could not.",
      },

      { type: "h2", text: "DevOps" },
      {
        type: "p",
        text: "The original: get code from a developer to a user quickly and safely, and stop treating build and run as two separate teams. Everything below assumes this already works.",
      },

      { type: "h2", text: "GitOps" },
      {
        type: "p",
        text: "Makes Git the single source of truth for infrastructure, not just code. The cluster is expected to match what is committed, and if it drifts, it is reconciled back. The real test is whether you could rebuild the environment from a commit — and know it.",
      },

      { type: "h2", text: "MLOps" },
      {
        type: "p",
        text: "Why your Discover Weekly feels personal. Feature stores, retraining schedules and model registries running quietly behind the recommendation, plus the monitoring that catches a model getting worse without ever throwing an error.",
      },

      { type: "h2", text: "LLMOps" },
      {
        type: "p",
        text: "The newer layer, and the one changing fastest. Prompt versioning, RAG pipelines, guardrails, and observability measured in tokens and cost rather than requests and CPU.",
      },

      { type: "h2", text: "AIOps" },
      {
        type: "p",
        text: "Points machine learning back at the operations problem: collapse thousands of alerts into a single root cause, so the person who gets paged receives one useful signal instead of a wall of symptoms.",
      },

      { type: "h2", text: "AgentOps" },
      {
        type: "p",
        text: "The one nobody had a name for two years ago. Governing autonomous coding agents — deciding what they are allowed to touch, what runs without asking, and who approves the merge. It is access control and change management for a contributor that never sleeps and does not read the room.",
      },

      { type: "h2", text: "Platform Engineering" },
      {
        type: "p",
        text: "The discipline that stitches the rest into one paved road a developer can actually use. Its measure of success is boring and specific: how long it takes a new engineer to ship something safely on their first day.",
      },

      { type: "h2", text: "Where this is going" },
      {
        type: "p",
        text: "Each of these appeared when the previous approach stopped scaling, not because anyone wanted another name ending in Ops. My guess is that AgentOps and Platform Engineering matter most over the next five years — one because autonomous tooling is arriving faster than the governance around it, the other because none of the rest is useful if developers cannot reach it.",
      },
      {
        type: "verdict",
        text: "Which one do you think defines the next five years? That is the argument worth having.",
      },
    ],
  },

  {
    slug: "kubernetes-request-flow",
    title: "The Kubernetes request flow, end to end",
    summary:
      "The complete journey from DNS to your application — load balancer, Ingress, Service, Pod, container — and the point at each hop where things usually go wrong.",
    tags: ["Kubernetes", "Nginx", "Docker"],
    status: "published",
    date: "7 Aug 2026",
    ...linkedin("7491349911486197760", "7491019015054602240"),
    content: [
      {
        type: "p",
        text: "Understanding how a request flows through Kubernetes is one of the most useful things you can hold in your head. Almost every production incident I have debugged came down to knowing which hop was lying.",
      },
      {
        type: "p",
        text: "Here is the whole journey, from a browser to your code, and what tends to break at each step.",
      },

      { type: "h2", text: "DNS" },
      {
        type: "p",
        text: "The name resolves to an address. Nothing has touched your cluster yet, which is exactly why this is worth checking first — a surprising share of 'the cluster is down' turns out to be a record pointing somewhere it should not.",
      },

      { type: "h2", text: "Load balancer" },
      {
        type: "p",
        text: "The cloud load balancer takes the connection and hands it to a node. It is also usually where TLS terminates and where the first set of access logs you can trust lives.",
      },

      { type: "h2", text: "Ingress" },
      {
        type: "p",
        text: "The ingress controller reads the host and path and decides which Service should receive the request. This is the first hop that knows anything about your application, and the first place a misconfigured rule sends traffic somewhere plausible but wrong.",
      },

      { type: "h2", text: "Service" },
      {
        type: "p",
        text: "The Service is a stable name in front of a moving set of Pods. It selects them by label, and that is the detail worth internalising: if the labels do not match, the Service has no endpoints and the request fails without a single Pod ever being unhealthy.",
      },
      {
        type: "verdict",
        text: "When traffic vanishes with no errors in your application logs, check the Service endpoints before you check your code.",
      },

      { type: "h2", text: "Pod" },
      {
        type: "p",
        text: "The Pod is the unit Kubernetes actually schedules. It gets an IP, it can be evicted, and it is expected to be replaceable — which is what makes rolling deploys and self healing possible in the first place.",
      },

      { type: "h2", text: "Container and application" },
      {
        type: "p",
        text: "Inside the Pod, the container runtime starts your image and your process listens on a port. Readiness probes decide whether this instance is allowed to receive traffic yet, and getting them wrong is how a deploy takes down a healthy service — traffic arrives before the application is ready to answer.",
      },

      { type: "h2", text: "Why it is worth memorising" },
      {
        type: "p",
        text: "Debugging Kubernetes is mostly the process of walking this chain and finding the first link where reality stops matching expectation. Once you can name every hop, an outage stops being a mystery and becomes a list you work through in order.",
      },
    ],
  },

  {
    slug: "no-perfect-devops-stack",
    title: "There is no perfect DevOps stack",
    summary:
      "Six comparisons every team argues about — Actions vs Jenkins, Terraform vs Pulumi, Compose vs Kubernetes, Prometheus vs Datadog, NGINX vs Traefik, ECS vs EKS — and the question that actually settles each one.",
    tags: ["GitHub Actions", "Terraform", "Kubernetes", "Prometheus"],
    status: "published",
    date: "6 Aug 2026",
    ...linkedin("7491010485568294912", "7491010484360409088"),
    content: [
      {
        type: "p",
        text: "There is no such thing as the perfect DevOps stack. There is only the one that fits your team and your use case. Every tool below has real strengths, real trade-offs, and a set of situations where it is the wrong answer.",
      },
      {
        type: "p",
        text: "So this is not a scoreboard. It is six comparisons I keep running into, and the question I actually ask to settle each one.",
      },

      { type: "h2", text: "GitHub Actions vs Jenkins" },
      {
        type: "p",
        text: "Actions lives next to your code. Pipelines are YAML in the repo, the marketplace covers most of what you need, and there is no build server to patch at midnight. You pay in minutes, and heavy or private workloads push you toward self hosted runners anyway.",
      },
      {
        type: "p",
        text: "Jenkins gives you the whole plane. Any environment, any plugin, any strange legacy build that refuses to fit a hosted runner. The cost is that you own it — upgrades, plugin drift, and the security patching that comes with a server holding all your build secrets.",
      },
      {
        type: "verdict",
        text: "Ask: do you want your pipelines to be someone else's operational problem? If yes, Actions. If you need control more than convenience, Jenkins.",
      },

      { type: "h2", text: "Terraform vs Pulumi" },
      {
        type: "p",
        text: "Terraform is deliberately boring, and that is the feature. HCL is declarative, the registry is enormous, and the state model is understood by anyone you are likely to hire. A config stays readable to whoever is reviewing it at 2am.",
      },
      {
        type: "p",
        text: "Pulumi lets you write infrastructure in a real language — loops, abstractions, unit tests, your existing tooling. That is genuine power when your infrastructure needs logic, and a genuine risk the day someone discovers inheritance.",
      },
      {
        type: "verdict",
        text: "Ask: does your infrastructure need programming, or just description? Most of the time it is description.",
      },

      { type: "h2", text: "Docker Compose vs Kubernetes" },
      {
        type: "p",
        text: "These are not really competitors. Compose is one file and one host. It is the fastest way to get a working local environment, and it is honest about what it is not — no scheduler, no self healing, no rollout strategy.",
      },
      {
        type: "p",
        text: "Kubernetes gives you scheduling, self healing, rolling deploys and horizontal scale. It also gives you a distributed system to operate, which is a job in itself. Running it for a single container application is a decision you regret twice: once during setup, and again during the first upgrade.",
      },
      {
        type: "verdict",
        text: "Ask: what happens when a node dies? If the answer can be 'we notice in the morning', you do not need Kubernetes yet.",
      },

      { type: "h2", text: "Prometheus vs Datadog" },
      {
        type: "p",
        text: "Prometheus costs nothing to license and a great deal to run well. Pull based scraping and PromQL are excellent, but retention, high availability and long term storage all become your problem, usually via Thanos or Mimir.",
      },
      {
        type: "p",
        text: "Datadog gives you metrics, logs and traces in one place on day one. The trade is the invoice, which grows with hosts and custom metrics and has a habit of surprising teams who never set a cardinality budget.",
      },
      {
        type: "verdict",
        text: "Ask: is engineering time or budget the scarcer resource this year? That single question usually decides it.",
      },

      { type: "h2", text: "NGINX vs Traefik" },
      {
        type: "p",
        text: "NGINX is the one that has already survived whatever you are about to throw at it. Enormous throughput, a config surface you can tune precisely, and behaviour that does not change while you are not looking.",
      },
      {
        type: "p",
        text: "Traefik was built for environments where services appear and disappear. It discovers them from labels or CRDs, handles certificates automatically, and reconfigures itself without a reload. In a static environment that machinery buys you very little.",
      },
      {
        type: "verdict",
        text: "Ask: how often does your routing table change? Rarely means NGINX. Constantly means Traefik.",
      },

      { type: "h2", text: "ECS vs EKS" },
      {
        type: "p",
        text: "ECS has fewer moving parts. It fits naturally into IAM and load balancers, and with Fargate you stop thinking about nodes entirely. The cost is that the deployment knowledge you build does not travel outside AWS.",
      },
      {
        type: "p",
        text: "EKS gives you the Kubernetes ecosystem — Helm, operators, manifests that still mean something on another cloud — plus a control plane bill and the operational surface that comes with it.",
      },
      {
        type: "verdict",
        text: "Ask: are you buying portability, or paying for portability you will never use?",
      },

      { type: "h2", text: "How to actually choose" },
      { type: "p", text: "Every one of these arguments collapses into the same four questions:" },
      {
        type: "list",
        items: [
          "What does your team already know? A tool nobody can debug under pressure is not the simpler option, whatever the benchmark says.",
          "What scale are you at today, not the scale in the pitch deck? Most teams choose for an imagined future and pay for it in the present.",
          "How much operational budget do you have? Self hosted is only cheaper if your time is free.",
          "Who maintains this in two years? Choose the thing that survives you leaving.",
        ],
      },
      {
        type: "p",
        text: "Pick the tool your team can operate on their worst day, not the one that wins the benchmark on their best.",
      },
    ],
  },
];

export const getPost = (slug) => POSTS.find((post) => post.slug === slug);
