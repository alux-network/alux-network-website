const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const dropdownTrigger = document.querySelector(".nav-dropdown-trigger");
const navDropdown = document.querySelector(".nav-dropdown");
const langButtons = document.querySelectorAll(".lang-button");
const langDropdown = document.querySelector(".lang-dropdown");
const langSwitch = document.querySelector(".lang-switch");
const cookieBanner = document.querySelector(".cookie-banner");
const cookieAccept = document.querySelector(".cookie-accept");
const pageContent = document.querySelector("#page-content");
const currentPage = document.body.dataset.page || "home";
const memoryStore = {};
let staticRoadmapHTML = null;
const mobileQuery = window.matchMedia("(max-width: 960px)");

const ui = {
  en: {
    languageLabel: "Language",
    nav: {
      home: "Home",
      vs: "For AI Agents",
      learn: "Learn",
      blog: "Blog",
      learnAlux: "ALUX VS Others",
      learnPcc: "Runtime Lab",
      team: "Team",
      roadmap: "Roadmap",
      cta: "Contact Us"
    },
    footer: {
      copyright: "Copyright © 2026 Foundation ALUX"
    },
    cookie: {
      title: "This site uses cookies.",
      text: "Cookies may be used to improve the site experience.",
      button: "Accept"
    }
  }
};

// Language names are autonyms, not translated product copy.
const visibleLanguageNames = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  ja: "日本語",
  ar: "العربية"
};

const supportedLanguages = new Set(["en", "zh", "ko", "ja", "ar"]);

const homeHeroActions = {
  en: [
    { label: "Read the Thesis →", href: "alux-vs-others.html", variant: "primary" },
    { label: "Start Building →", href: "https://github.com/alux-network", variant: "secondary" }
  ]
};

const homeFaqItems = {
  en: [
    ["Is ALUX just another faster L1?", "No. Faster L1s accelerate the same abstraction: one-shot state updates. ALUX is a decentralized concurrent runtime for services that wait, resume, coordinate, and carry authority across time. Its GLVM architecture is designed to extend that logical execution model across blockchain nodes, cloud servers, and personal devices."],
    ["What becomes possible on ALUX that ordinary smart contracts cannot do?", "A transaction can suspend across block boundaries, preserve its execution context, and resume when the awaited input arrives. Replay and commit mechanisms let validators reproduce the same outcome and finalize bounded work atomically."],
    ["Why is ALUX built for AI agents?", "Agents need more than wallets. They need scoped access to tools and services, context across multi-step work, and async coordination. In ALUX, a process cannot forge arbitrary channel references; it can act only through references it created or was explicitly passed."],
    ["What is a capability in ALUX?", "In the current runtime, a capability is an unforgeable channel reference that can be held, passed, and attenuated. General-purpose expiry, revocation, and usage quotas remain planned until they are implemented and tested."],
    ["How does ALUX keep Long Transactions deterministic?", "ReplayTrie records the non-deterministic COMM choices that affect execution, enabling bit-exact deterministic replay inside the ALUX runtime so validators can reproduce the same execution outcome."],
    ["Can existing smart contract developers use it?", "ALUX exposes a growing set of eth_* JSON-RPC methods and runs EVM and Solidity workloads through its EVM path. Compatibility depends on the RPC methods and EVM features currently implemented; Tolang is available for concurrency-native services."],
    ["What is ALUX's OpenClaw?", "OpenClaw is the endgame: an open capability layer for the agent world, where agents discover, request, delegate, and combine what they are allowed to do. The internet connected information; blockchains connected assets; agent networks must connect capability."],
    ["How is ALUX different from agent frameworks like LangGraph or Temporal?", "LangGraph and Temporal are application frameworks for coordinating workflows you control. ALUX is a public runtime designed for work across trust boundaries: validators can reproduce recorded COMM choices, processes act through explicit channel capabilities, and cross-block execution can preserve context through defined replay and commit paths."]
  ]
};

const pageData = {
  home: {
    metaTitle: "Home | ALUX Network",
    metaDescription: "ALUX is composability middleware for decentralized services: a capability runtime where agents, apps, and workflows coordinate across trust boundaries.",
    hero: {
      eyebrow: "",
      title: "ALUX",
      loop: "A Service-Native Public Chain\nfor Composable\nDecentralized Services",
      text: "ALUX unifies execution, permissions, commit logic, and consensus into a composable runtime, enabling decentralized services to persist over time, carry scoped authority, and coordinate across systems."
    },
    sections: [
      {
        type: "architecture",
        eyebrow: "ALUX GLVM Architecture",
        title: "Many machines.<br>One logical virtual machine.",
        text: "GLVM is ALUX's target layered architecture for decentralized services: physical infrastructure below, the concurrent runtime in the middle, and world operating systems above.",
        architecture: {
          world: {
            label: "Layer 3",
            title: "World Operating System",
            items: [
              "Service/Agent<br>Registration & Finding",
              "Service/Agent Orchestration",
              "Programmable Capability"
            ]
          },
          runtime: {
            label: "Layer 2",
            title: "ALUX — Decentralized Concurrent Runtime",
            vm: "Unified World VM",
            controls: ["Sharding", "Concurrency Control", "Capability Management"],
            tvms: ["TVM", "TVM", "TVM"],
            caption: "TVM abstraction — each TVM is abstracted into the Unified World VM above."
          },
          infrastructure: {
            label: "Layer 1",
            title: "Physical Infrastructure",
            groups: [
              ["Blockchain", "Blockchain Nodes"],
              ["Cloud", "Cloud Servers"],
              ["Personal Devices", "Laptops / Phones"]
            ]
          }
        }
      },
      {
        id: "home-agent-runtime",
        type: "removed"
      },
      {
        type: "capabilityMap",
        eyebrow: "Capability Map",
        title: "ALUX Runtime Capability Map",
        mapKicker: "",
        mapTitle: "ALUX Capability Map",
        mapIntro: "Drag modules into ALUX Runtime to reveal their public-chain role.\nDouble-click any card for the deeper note.",
        text: "Drag modules into ALUX Runtime to reveal their public-chain role.\nDouble-click any card for the deeper note.",
        guideSteps: ["Drag into ALUX Runtime", "Double-click for detail"],
        comboLabel: "Runtime Connection",
        comboTitle: "Connect a module to ALUX",
        comboDefault: "Drop a module onto ALUX Runtime to see how it becomes part of the public-chain service runtime.",
        inspectorLabel: "Module Trace",
        inspectorTitle: "Open a module",
        inspectorDefault: "Double-click a card to flip it into a short note on what it does, why it matters, and where it touches real services.",
        featuredClusterIds: ["execution", "authority", "data", "transaction", "consensus", "build"],
        core: {
          label: "ALUX Public Chain",
          title: "ALUX Runtime",
          text: "A service-native public chain where TVM execution, capability authority, verifiable state, and BlockGit finality compose into one runtime.",
          items: ["Public Chain", "Composable Runtime", "Service Primitives"],
          detailTitle: "A public chain for live services",
          detailTechnical: "ALUX treats execution, authority, state, and finality as one runtime surface rather than separate application patches.",
          detailBusiness: "Teams can build services that keep running, hold limited authority, and settle against verifiable public-chain records.",
          runtimeLabel: "ALUX Public Chain",
          runtimeTitle: "ALUX Runtime\nforms\u00A0the\u00A0public\u00A0chain",
          runtimeTechnical: "TVM execution, OCAP authority, verifiable state, cross-block commit logic, and BlockGit finality meet in one runtime.",
          runtimeBusiness: "That is the public-chain layer for services that must keep running, carry scoped authority, and settle with verifiable finality."
        },
        clusters: [
          {
            id: "execution",
            label: "Tuple-Space Virtual Machine",
            title: "TVM Bytecode VM",
            text: "The Tuple-Space Virtual Machine executes bytecode processes that fork, wait, resume, and communicate through typed channels.",
            items: ["Bytecode VM", "Tuple Space", "Typed Channels", "Wait / Resume"],
            detailTitle: "Services pause and resume",
            detailTechnical: "TVM bytecode processes communicate through typed tuple-space channels. They can wait on input, resume later, and keep their execution context.",
            detailBusiness: "Agents, reservations, approvals, and workflows can run as live services instead of one-shot transactions.",
            runtimeLabel: "Tuple-Space Virtual Machine",
          runtimeTitle: "TVM runs bytecode services",
          runtimeTechnical: "Tolang compiles into TVM bytecode. Processes fork, wait, resume, and communicate through typed tuple-space channels without shared memory.",
          runtimeBusiness: "This lets ALUX run live services rather than only one-shot transactions."
          },
          {
            id: "authority",
            label: "Capability Control",
            title: "OCAP Authority",
            text: "Unforgeable references make authority explicit: a process can use only capabilities it created or was passed, and those capabilities can be scoped, attenuated, and constrained by runtime rules.",
            items: ["Namespaces", "Delegation", "Attenuation", "Lifecycle Types"],
            detailTitle: "Scoped authority",
            detailTechnical: "OCAP represents authority as unforgeable channel references. A process can use only references it created or was explicitly passed; capabilities can then be attenuated and constrained by channel usage and lifecycle rules.",
            detailBusiness: "Each task receives only the capabilities it needs; authority unrelated to the task never enters its execution context.",
            runtimeLabel: "Capability Control",
            runtimeTitle: "Capabilities become\nprotocol\u00A0objects",
          runtimeTechnical: "OCAP channel references are unforgeable. Each process starts only with capabilities explicitly introduced into its environment; namespaces, attenuation, and lifecycle rules narrow what each holder can do.",
          runtimeBusiness: "Prompt injection may influence a process, but it cannot invoke capabilities that were never passed into that process."
          },
          {
            id: "transaction",
            label: "Transaction Layer",
            title: "Cross-Block ACID",
            text: "Segments and commit points let service work suspend across block boundaries, then settle atomically with replay and isolation evidence.",
            items: ["Segments", "Commit Points", "ReplayTrie", "Isolation"],
            detailTitle: "Work crosses blocks",
            detailTechnical: "Segments preserve progress. ReplayTrie, isolation, rollback, and commit points bound how suspended work resumes and settles.",
            detailBusiness: "A service can wait for delivery, approval, oracle data, or an agent action, then complete settlement with a verifiable audit trail.",
            runtimeLabel: "Transaction Layer",
          runtimeTitle: "Services cross block boundaries",
          runtimeTechnical: "Segments, ReplayTrie, isolation, and commit points let work suspend, resume, and settle atomically after a bounded checkpoint.",
          runtimeBusiness: "Long-running workflows can wait for real-world inputs and still reach verifiable public-chain finality."
          },
          {
            id: "framework",
            label: "Service Orchestration",
            title: "Segments + Fringe",
            text: "Framework services turn execution traces into partitions, route replay, and build fringes without blocking live work.",
            items: ["Segment Pool", "Fringe Builder", "Dependency DAG", "Actor Services"]
          },
          {
            id: "consensus",
            label: "Consensus Layer",
            title: "BlockGit Finality",
            text: "BlockGit finalizes concurrent blocks as DAG fringes; weak links and block merge keep finality coherent without a single queue.",
            items: ["DAG Blocks", "Weak Links", "Block Merge", "Fringes"],
            detailTitle: "Parallel work finalizes",
            detailTechnical: "BlockGit arranges concurrent blocks as DAG fringes. Strong and weak links plus merge rules decide which effects become final.",
            detailBusiness: "The network keeps service progress concurrent without forcing every workflow into one global queue.",
            runtimeLabel: "Consensus Layer",
            runtimeTitle: "BlockGit finalizes\nconcurrent\u00A0work",
          runtimeTechnical: "Validators produce DAG blocks. Strong and weak links plus block merge decide which effects become part of the next coherent fringe.",
          runtimeBusiness: "The network can keep progress concurrent without forcing everything through one sequential queue."
          },
          {
            id: "build",
            label: "Build Surface",
            title: "Tolang + TSAC",
            text: "Tolang compiles to TVM bytecode, while TSAC adapters route Ethereum-facing contracts into the tuple-space runtime.",
            items: ["Tolang", "TSAC", "Solidity Entry", "EVM Adapters"],
            detailTitle: "Clear path for builders",
            detailTechnical: "Tolang targets TVM directly. TSAC adapts Solidity and EVM-facing calls into tuple-space execution.",
            detailBusiness: "Teams can start from familiar Web3 tooling, then move toward ALUX-native service composition.",
            runtimeLabel: "Build Surface",
          runtimeTitle: "Contracts get a runtime path",
          runtimeTechnical: "Tolang targets TVM directly, while TSAC adapts EVM-facing calls into tuple-space execution through isolated adapters.",
          runtimeBusiness: "Builders can start from familiar Web3 tooling and grow into ALUX-native service composition."
          },
          {
            id: "node",
            label: "Node Network",
            title: "Full Node + RPC",
            text: "The node layer exposes RPC, P2P, storage context, and static service surfaces around the runtime.",
            items: ["eth_* RPC", "P2P Gossip", "Storage Context", "Static Site"]
          },
          {
            id: "data",
            label: "State Layer",
            title: "Verifiable State",
            text: "Versioned tuple-space resources are committed through trie-backed storage, so replay, block merge, and finalized state share verifiable views.",
            items: ["Tuple-Space State", "Versioned Reads", "Merkle Trie", "Atomic Commit"],
            detailTitle: "Auditable state",
            detailTechnical: "Versioned tuple-space resources commit into trie-backed storage, so execution, replay, merge, and finality read the same verifiable view.",
            detailBusiness: "Services keep durable public-chain memory that validators can reconstruct and audit.",
            runtimeLabel: "State Layer",
          runtimeTitle: "Replay keeps state verifiable",
          runtimeTechnical: "Versioned tuple-space resources commit through trie-backed storage, so execution, replay, block merge, and finality read the same verifiable views.",
          runtimeBusiness: "Services get durable public-chain memory that validators can reconstruct and audit."
          },
          {
            id: "proof",
            label: "Validator Proof",
            title: "Replay + Trace",
            text: "Branch identifiers and replay logs let validators reproduce non-deterministic COMM events deterministically.",
            items: ["BranchId", "COMM Events", "Replay Log", "Deterministic Replay"]
          },
          {
            id: "tooling",
            label: "Developer Tooling",
            title: "LSP + Playground",
            text: "Compiler diagnostics, expand, format, and playground runs make service logic visible before it reaches a live node.",
            items: ["Diagnostics", "Expand", "Compiler Format", "Run / Simulate"]
          }
        ],
        combinations: [
          {
            nodes: ["execution", "authority"],
            label: "Autonomous Service",
            title: "Long-lived agents with scoped authority",
            technical: "A process can wait, resume, and delegate only the capabilities it was explicitly given.",
            business: "Replaces shared API keys with explicitly passed, attenuated authority; budget and time-window policy remain product-layer targets."
          },
          {
            nodes: ["execution", "transaction"],
            label: "Workflow Primitive",
            title: "Cross-block service workflows",
            technical: "Wait/resume execution combines with commit points, isolation, rollback, and ReplayTrie evidence.",
            business: "Supports reservations, escrow, settlement, supply-chain handoffs, and other workflows that cannot finish in one block."
          },
          {
            nodes: ["authority", "build"],
            label: "Capability App Direction",
            title: "Programmable permission services",
            technical: "Tolang and TSAC expose channel-based authority that can be passed and attenuated; richer audit and market policy belong to the product layer.",
            business: "Provides a foundation for scoped data access, agent actions, enterprise approvals, and reusable service rights."
          },
          {
            nodes: ["transaction", "consensus"],
            label: "Concurrent Finality",
            title: "More work, bounded conflicts",
            technical: "BlockGit DAG finality and block merge select a coherent result while long transactions remain replayable and verifiable.",
            business: "Makes high-throughput service execution practical without forcing every workflow into a synchronous queue."
          },
          {
            nodes: ["transaction", "framework"],
            label: "Cross-Block Scheduler",
            title: "Services keep moving across block boundaries",
            technical: "Segments, partitions, and fringe building preserve partial progress while replay keeps validation deterministic.",
            business: "Lets service work pause for real-world inputs, resume later, and still settle against a verifiable public-chain record."
          },
          {
            nodes: ["data", "node"],
            label: "Public Service Backbone",
            title: "Verifiable state with standard access",
            technical: "Typed KV, trie state, RPC, P2P, and storage context create a public backend for persistent services.",
            business: "Lets teams ship service infrastructure without private servers becoming the trust anchor."
          },
          {
            nodes: ["execution", "proof"],
            label: "Verifiable Async",
            title: "Asynchronous work validators can replay",
            technical: "COMM events, BranchId, and replay logs turn concurrent execution into deterministic validation evidence.",
            business: "AI/API workflows can run asynchronously while producing replay evidence that validators can reproduce."
          },
          {
            nodes: ["build", "node"],
            label: "Ethereum Entry",
            title: "Ethereum-facing entry into the service runtime",
            technical: "Implemented eth_* RPC methods, Solidity entry points, and TSAC adapters route supported EVM workloads into ALUX services.",
            business: "Lets builders evaluate familiar EVM tooling where the current RPC and EVM surface is supported."
          },
          {
            nodes: ["framework", "consensus"],
            label: "Block Production Loop",
            title: "Execution evidence becomes finalizable work",
            technical: "Framework services collect sealed segments, build candidate blocks, and hand coherent fringes to BlockGit.",
            business: "Connects live service execution to validator economics without turning every service into a single monolithic transaction."
          },
          {
            nodes: ["build", "tooling"],
            label: "Builder Loop",
            title: "From source to runnable services",
            technical: "Tolang compiler APIs, LSP diagnostics, expand, format, playground runs, and TSAC adapters shorten the loop from source to runtime behavior.",
            business: "Makes ALUX easier to evaluate: teams can inspect, test, and iterate on service logic before wiring a full production node."
          }
        ],
        outcome: {
          label: "ALUX OpenClaw",
          title: "Open Capability Layer",
          text: "The OpenClaw direction is to make scoped capabilities discoverable, delegated, composable, and auditable across agents, apps, and organizations.",
          items: ["Discover", "Delegate", "Compose", "Audit"],
          runtimeLabel: "ALUX OpenClaw",
          runtimeTitle: "OpenClaw is the capability surface",
          runtimeTechnical: "The current OCAP foundation supplies unforgeable references, explicit passing, and attenuation; discovery and broader audit policy remain product-layer work.",
          runtimeBusiness: "This is the product-facing direction for programmable authority in decentralized services."
        }
      },
      {
        id: "home-core-capabilities",
        type: "removed"
      },
      {
        id: "home-composability-middleware",
        type: "removed"
      },
      {
        id: "home-how-it-works",
        type: "removed"
      },
      {
        type: "cards",
        eyebrow: "Use Cases",
        title: "What You Can Build\non ALUX",
        text: "Start with familiar EVM tooling, then build public-chain services that stay alive across blocks, coordinate with external systems, and carry explicit authority.",
        items: [
          ["Bookings, Approvals, and Escrow", "Build workflows that pause for inventory, a signature, or payment, then resume and settle without restarting the service."],
          ["Concurrent EVM Applications", "Run isolated EVM applications concurrently and coordinate shared resources through TVM and TSAC."],
          ["Cross-System Service Workflows", "Connect on-chain logic with verified HTTPS inputs today, while broader database and external-system adapters remain part of the target architecture."],
          ["Capability-Native Applications", "Pass task-specific, unforgeable capabilities between services instead of letting identity carry unrelated ambient authority into every task."]
        ],
        demos: [
          { type: "workflow", label: "reservation.tox", status: "WAITING", steps: ["Request", "Wait", "Resume", "Settle"] },
          { type: "parallel", label: "EVM workload", status: "3 INSTANCES", lanes: ["EVM 01", "EVM 02", "EVM 03"], core: "TVM / TSAC" },
          { type: "systems", label: "service commit", status: "TARGET MODEL", nodes: ["CHAIN", "API", "DATABASE"], footer: "Target: settle together" },
          { type: "capability", label: "capability", status: "DELEGATED", rows: [["namespace", "orders/write"], ["holder", "service-b"], ["rights", "scoped"]] }
        ],
        cta: {
          eyebrow: "Build past the one-shot transaction",
          title: "Explore a service that can wait, resume, coordinate, and settle.",
          text: "Use Runtime Lab to inspect current execution primitives and the target composition model.",
          label: "Open Runtime Lab"
        }
      },
      {
        type: "removed"
      },
      {
        type: "removed"
      },
      {
        type: "faq",
        eyebrow: "Frequently Asked Questions",
        title: "FAQ",
        hint: "Click a question to view the answer",
        faqOrder: [0, 1, 7, 3, 5, 2, 4, 6],
        items: homeFaqItems.en
      },
      {
        type: "links",
        eyebrow: "Learn More",
        title: "Channels",
        items: [
          ["GitHub", "https://github.com/alux-network"],
          ["Medium", "https://medium.com/@alux_network"],
          ["X", "https://x.com/alux_network"],
          ["Discord", "https://discord.gg/ZJfd9zmnTzdd"],
          ["Instagram", "https://www.instagram.com/alux_network/"],
          ["YouTube", "https://www.youtube.com/channel/UCWkSM8Qi2oMzTzIJTK1VOvA"],
          ["LinkedIn", "https://www.linkedin.com/company/foundation-alux/"]
        ]
      }
    ]
  },
  aluxVsOthers: {
    metaTitle: "ALUX VS Others | ALUX Network",
    metaDescription: "How ALUX extends short VM calls into replayable long transactions, with EVM compatibility today and broader cross-runtime composition on the roadmap.",
    brandLetters: ["a", "l", "u", "x", ".", "n", "e", "t", "w", "o", "r", "k"],
    title: "ALUX Network - A Distributed Runtime<br>to Unify Web 2 &amp; 3",
    article: {
      kicker: "ALUX Network",
      title: "A Distributed Runtime to Unify Web 2 & 3",
      text: "Blockchains are essentially state transition machines. ALUX expands the model from short, isolated VM calls into replayable long transactions: cross-block execution and verifiable Web 2 I/O today, with cross-runtime and cross-shard composition as the broader architecture.",
      summaryLabel: "Core difference",
      summaryAria: "Article summary",
      summary: [
        ["Most chains", "Short, isolated VM calls"],
        ["ALUX", "Replayable long transactions"],
        ["Execution", "Parallel and concurrent today; composite is the target model"],
        ["Transaction semantics", "ACID-style semantics for long transactions"]
      ],
      navLabel: "In this article",
      navTitle: "In this article",
      nav: [
        { label: "The Problem", id: "problem" },
        { label: "Long Transactions", id: "universal" },
        { label: "Execution Model", id: "execution" },
        { label: "Composite & Compatibility", id: "compatibility" }
      ],
      stateTransitionLabels: [
        "Common Web 2 workflow transitions",
        "ALUX Runtime",
        "ALUX target execution model"
      ],
      figureOneCaption: "Figure 1. ALUX extends the Web3 execution model from short updates toward replayable long transactions.",
      figureTwoCaption: "Figure 2. ALUX supports parallel and concurrent state transitions today and models composite transitions as the target architecture.",
      figureThreeCaption: "Figure 3. The composite-transition architecture connects on-chain work with Web 2 services; cross-shard composition remains on the roadmap.",
      figures: {
        stateTakeaway: "<strong>Takeaway:</strong> many chains center on short state updates; ALUX adds replayable long transactions.",
        typesTakeaway: "<strong>Takeaway:</strong> parallelism advances independent work, concurrency enables wait and resume, and composition defines how related effects should settle together.",
        compositeTakeaway: "<strong>Takeaway:</strong> ALUX supports cross-block execution and replayable Web 2 I/O today; cross-shard composition remains planned."
      },
      problemTitle: "The Problem We Are Solving",
      problemText: "Many blockchain VMs focus on short, ordered state updates. ALUX extends that model for workflows that need to wait, resume, coordinate, or cross block boundaries.",
      universalTitle: "ALUX as a Distributed Runtime for Long Transactions",
      universalText: "Instead of treating every transaction as a short isolated state update, ALUX models execution as a runtime that can coordinate parallel, concurrent, and composite transitions.",
      executionTitle: "Execution Model",
      compatibilityTitle: "Composite Transitions and Compatibility",
      closingText: "In short, ALUX does not force every workflow into a short transaction. It makes long transactions that cross blocks and connect to Web 2 replayable today, while cross-shard and broader cross-runtime composition remain part of the architecture and roadmap."
    },
    diagrams: {
      state: {
        aria: "State transition model diagram",
        web2Title: "Web 2 state transitions",
        web3Title: "ALUX target execution model",
        otherTitle: "Other blockchain projects",
        runtimeTitle: "ALUX Runtime",
        shortLabel: "Short transitions",
        longLabel: "Long transitions",
        longDetail: "Composite transitions",
        unsupportedLabel: "short, bounded transitions",
        supportedLabel: "long-transaction model"
      },
      types: {
        aria: "Parallel, concurrent, and composite transition diagram",
        items: [
          {
            label: "Parallel",
            title: "Parallel execution",
            text: "Independent VM instances run side by side when their state does not conflict."
          },
          {
            label: "Concurrent",
            title: "Coroutine execution",
            text: "A transaction can pause, wait, resume, and interleave with other live work."
          },
          {
            label: "Composite",
            title: "Composite transition",
            text: "One workflow can coordinate several execution contexts or external systems; cross-shard composition is planned."
          }
        ]
      },
      composite: {
        aria: "Composite transaction runtime diagram",
        shardOne: "Shard 1",
        shardTwo: "Shard 2",
        web2Service: "Web2 service",
        txA: "TX 2.a",
        txB: "TX 2.b",
        txC: "TX 2.c",
        txD: "TX 2.d",
        crossShardTx: "Cross-shard TX",
        httpGet: "HTTP GET",
        acidGuarantee: "Target ACID boundary",
        request: "request",
        response: "response"
      }
    },
    what: {
      eyebrow: "What is ALUX?",
      title: "ALUX is composability middleware for decentralized services.",
      text: "ALUX is the layer between execution, permissions, commit logic, and consensus. It lets smart contracts and agents pause, wait, resume, coordinate, and carry scoped authority across trust boundaries.",
      items: [
        ["Not a faster database", "Most chains optimize ordered state updates. ALUX gives decentralized services a runtime that stays alive across time."],
        ["A concurrent runtime", "Processes can interleave, suspend, resume, and coordinate through tuple-space messaging instead of forcing every workflow into one block."],
        ["A capability layer", "OCAP-style references make authority explicit and unforgeable, so processes can pass and attenuate what they are allowed to do."]
      ]
    },
    problem: {
      heading: "The Problem We Are Solving:",
      bullets: [
        "Blockchains are essentially state transition machines.",
        "Many current blockchain VMs focus on a narrower class of short, ordered transitions."
      ]
    },
    universal: {
      heading: "ALUX as a Distributed Runtime for Long Transactions:",
      text: "ALUX models parallel, concurrent, and composite transition patterns beyond one-shot state updates."
    },
    execution: [
      {
        shortLabel: "Parallel",
        heading: "Parallel Execution:",
        text: "Isolated <span class=\"alux-vs-accent\">EVM</span> instances can run in parallel today. WASM belongs to the planned heterogeneous-VM direction."
      },
      {
        shortLabel: "Concurrent",
        heading: "Concurrent Execution:",
        text: "ALUX allows TXs to execute as <span class=\"alux-vs-accent\">coroutines</span>, which can be suspended, awakened, and interleaved with each other. Nondeterministically executed, but deterministically replayed."
      }
    ],
    composite: {
      shortLabel: "Composite",
      heading: "Composite Transitions:",
      text: "TXs can span block heights and coordinate on-chain work with replayable HTTPS effects while preserving isolation and <span class=\"alux-vs-accent\">atomic settlement</span> inside the ALUX transaction boundary. Cross-shard composition remains part of the architecture and roadmap."
    },
    compatibility: {
      heading: "Compatibility:",
      text: "ALUX exposes an <span class=\"alux-vs-accent\">EVM</span> path today through its sandbox and Ethereum JSON-RPC. WASM and broader heterogeneous-VM composition are planned; the current baseline does not ship them."
    }
  },
  parallelConcurrentComposable: {
    metaTitle: "ALUX Runtime Lab | ALUX Network",
    metaDescription: "A visual guide to ALUX's current parallel and message-driven execution, plus its target model for atomic composition across system boundaries.",
    hero: {
      eyebrow: "Learn / Runtime Lab",
      title: "Runtime Lab",
      subtitle: "Parallel / Concurrent / Composable",
      text: "ALUX supports replayable long transactions: independent tasks run together and transactions coordinate through messages. The booking scenario illustrates the target model for settling related cross-system effects as one atomic result.",
      visual: {
        src: "assets/parallel-concurrent-composable/alux-runtime.webp?v=20260708-heroimg1",
        alt: "A premium technical illustration of the ALUX runtime connecting nodes, cloud services, devices, agents, capability tokens, and commit rails."
      },
      hotspots: {
        parallel: "Open parallel lanes",
        concurrent: "Open message-driven concurrency",
        composable: "Open composable workflow"
      },
      signals: [
        ["Positioning", "Decentralized concurrent runtime"],
        ["Execution", "Run, interact, wait, settle"],
        ["Boundary", "Capability-scoped workflows"]
      ]
    },
    intro: {
      eyebrow: "The simple difference",
      title: "Three words, three very different runtime jobs",
      text: "Parallel runs independent transactions at the same time. Concurrency lets transactions interact through channels: one transaction can wait for a matching message from another, then continue. Composability binds state transitions from different systems into one auditable atomic transition.",
      claim: "In the current ALUX runtime, independent work can run in parallel, transactions coordinate through messages, and execution can resume across blocks. Atomic composition across independent systems remains an architecture target."
    },
    factLabels: {
      what: "What it means",
      how: "How ALUX does it",
      enables: "What it enables"
    },
    lab: {
      eyebrow: "Try the whole runtime",
      title: "Model one atomic booking",
      text: "Use four actions to explore the target composition model: start reservation and payment checks, leave a room-availability wait, deliver the hotel's matching message, then model a joint confirmation.",
      playLabel: "Play it in order",
      scoreLabel: "State",
      checkpoint: "Booking confirmed",
      checkpointWaiting: "Awaiting both",
      matchLabel: "Message matched",
      lanes: ["Reservation state", "Hotel message", "Payment state", "Booking confirmation"],
      steps: [
        { state: "parallel", label: "01", title: "Start both checks", text: "Reservation and payment checks advance independently." },
        { state: "paused", label: "02", title: "Wait for a room", text: "The reservation leaves an availability condition in the channel." },
        { state: "resumed", label: "03", title: "Hotel replies", text: "The matching message activates the booking continuation." },
        { state: "settled", label: "04", title: "Confirm together", text: "Room hold and payment authorization commit as one result." }
      ],
      actions: {
        parallel: "1. Start both checks",
        pause: "2. Wait for a room",
        resume: "3. Send hotel reply",
        settle: "4. Confirm booking",
        reset: "Reset"
      },
      messages: {
        idle: "Start with step 1. Reservation and payment are managed separately inside the same runtime.",
        parallel: "Parallel: reservation and payment checks advance at the same time without sharing state.",
        paused: "Concurrent wait: the reservation leaves a room-availability condition in the channel; payment work can keep moving.",
        resumed: "Message matched: the hotel replies with availability. ALUX activates the booking continuation; if several matches were possible, ReplayTrie fixes the chosen one.",
        settled: "Composition target: the room hold and payment authorization close together as one all-or-nothing booking result."
      },
      benefits: [
        { state: "parallel", label: "Parallel", title: "Two checks run together", text: "Independent work does not wait behind one global queue." },
        { state: "paused", label: "Concurrent", title: "The booking waits for the hotel", text: "The dependency lives in a channel instead of blocking the runtime." },
        { state: "resumed", label: "Message match", title: "The reply creates the next step", text: "The COMM creates the continuation; ReplayTrie records the choice only when the match is non-deterministic." },
        { state: "settled", label: "Composable", title: "Room and payment confirm together", text: "The target is one all-or-nothing result with reproducible settlement evidence." }
      ]
    },
    modes: [
      {
        id: "parallel",
        label: "Parallel",
        title: "Flight, hotel, transfer, and insurance<br>search at the same time",
        cue: "Four travel searches finish independently",
        image: "assets/parallel-concurrent-composable/parallel.svg?v=20260710-independent5",
        alt: "Multiple isolated execution rails moving forward at the same time.",
        what: "Parallel execution means independent jobs run at the same time. A travel agent can search flights, rooms, transfers, and insurance without making one search wait behind another.",
        how: "Parallel execution is native to ALUX's process calculus: transactions share no memory, and any interaction is confined to tuple-space channels. Independent transactions therefore advance in separate TVM lanes, while Block Merge resolves state overlap at commit time.",
        enables: "More independent work finishes in the same amount of time. But parallelism alone cannot make those jobs exchange messages or let a long transaction wait and continue.",
        conclusion: "Parallelism finds several answers at once. It does not make those jobs interact."
      },
      {
        id: "concurrent",
        label: "Concurrent",
        title: "A booking waits for availability<br>and continues when the reply arrives",
        cue: "The booking waits; a hotel agent replies; the next step begins",
        image: "assets/parallel-concurrent-composable/concurrent.svg?v=20260710-channelmatch5",
        alt: "Two transactions interact through a tuple-space channel: one waits for a matching message, the other sends it, and the waiting continuation resumes while unrelated work keeps moving.",
        what: "Concurrency begins when jobs interact. A booking can leave a waiting condition in a channel, and a hotel service can satisfy it later by sending the matching availability message.",
        how: "The waiting consume is stored as a resource in tuple space. A produce from another transaction matches it, triggering a COMM event that spawns the continuation and moves the Execution Context from Inactive back to Running. If more than one match is possible, ReplayTrie records the chosen COMM for deterministic replay.",
        enables: "A travel agent can keep one long transaction alive across blocks: it waits for room availability, an API response, or a user decision, then continues without blocking unrelated work.",
        conclusion: "Concurrency turns a reply into the next step: the match creates a new continuation instead of merely restarting a stopped lane."
      },
      {
        id: "composable",
        label: "Composable",
        title: "The room and payment<br>confirm together",
        cue: "The booking confirms only when reservation and payment both succeed",
        image: "assets/parallel-concurrent-composable/composable.svg?v=20260710-bookingatomic3",
        alt: "A room reservation and payment authorization arrive from different systems. Only after both are ready does one booking confirmation leave the atomic boundary.",
        what: "Composition is not ordinary bundling. The target in this example is to commit the room hold and payment authorization together, or commit neither one.",
        how: "The current runtime provides tuple-space coordination, scoped OCAP references, cross-block continuation, ReplayTrie, and Block Merge. End-to-end atomic composition across independent external systems remains a design target built from those primitives.",
        enables: "The intended result is to avoid a half-finished booking such as money charged without a room, or a room held without payment.",
        conclusion: "The target composition model gives different systems one all-or-nothing result; concurrency carries the messages that lead up to that shared commit."
      }
    ],
    foundations: {
      eyebrow: "Runtime path",
      title: "What keeps a service alive",
      text: "A long-running service stays coherent because every step can run, interact, carry explicit authority, replay deterministically, and settle along one verifiable public-chain path.",
      items: [
        ["Run", "TVM process lifecycle", "A process can fork, wait in one block, and resume in a later block without restarting its local execution context."],
        ["Interact", "Tuple space + COMM", "A waiting consume meets another transaction's produce. The match activates the continuation while unrelated work keeps moving."],
        ["Authorize", "OCAP boundaries", "Unforgeable capability references are passed explicitly, so each step receives only the authority it needs; identity does not automatically bring unrelated authority into scope."],
        ["Replay", "ReplayTrie", "Only the non-deterministic COMM choices that matter are recorded, so validators can reproduce the same execution."],
        ["Settle", "BlockGit + Block Merge", "Concurrent work enters verified fringes, where overlaps are classified as accepted, rejected, or undecided before finality."]
      ]
    },
    glvmBridge: {
      eyebrow: "Next layer",
      title: "One logical runtime across many environments",
      text: "Runtime Lab shows current parallel and message-driven execution, then illustrates the target atomic composition model. GLVM describes the broader architecture for extending that logical model across blockchain nodes, cloud services, and personal devices.",
      label: "Explore GLVM",
      href: "glvm.html"
    },
    close: {
      eyebrow: "Why it matters",
      title: "Not faster blocks. Long-running services.",
      text: "Parallelism handles independent execution. Concurrency handles message-driven interaction and wait/resume. ALUX implements those runtime foundations today and is building toward atomic composition across system boundaries.",
      points: [
        ["Only parallel", "More throughput, but no transaction dependency or message matching."],
        ["Only concurrent", "Transactions can interact and wait, but cross-system effects may still settle separately."],
        ["Only composable", "An atomic boundary exists, but without interaction and waiting it cannot carry long-running dependencies."]
      ],
      links: [
        ["Back to ALUX VS Others", "alux-vs-others.html"],
        ["For AI Agents", "for-ai-agents.html"]
      ]
    }
  },
  team: {
    metaTitle: "Team",
    metaDescription: "Team page content.",
    hero: {
      eyebrow: "Team",
      title: "Team",
      loop: "Team",
      text: "Lead Developers."
    },
    sections: [
      {
        type: "paragraph",
        eyebrow: "About",
        title: "Lead Developers",
        text: "Lead Developers."
      },
      {
        type: "cards",
        eyebrow: "Lead Developers",
        title: "Profiles",
        items: [
          ["Frank He (Atticbee)", "Frank He is a blockchain researcher and entrepreneur. His research includes concurrent virtual machine design and implementation. Prior to ConcurSys, he has been working for more than 15 years as a senior quantitative analyst/developer for Bloomberg, Lehman Brothers and Barclays Capital, building highly scalable risk computation systems. GitHub: github.com/atticbee | X: twitter.com/atticbeeus"],
          ["Tomislav Grospić", "I thrive on thinking outside the box, completely immersing myself in every project. I'm fueled by the innovative spirit of those who push the boundaries of technology and make it a force for good. My first attempt at a cardboard calculator at 5 might not have crunched numbers, but it sparked a lifelong fascination with computation. By 10, that fascination evolved into serious fun with assembly language programming on the C64c. For over a decade, I delved into the world of electronics. The past two decades have seen me become a polyglot programmer, fluent in languages ranging from JavaScript to the esoteric elegance of Haskell. Now, I'm on a mission to unlock the potential of concurrency with process calculus, aiming to revolutionize the ever-evolving blockchain landscape. GitHub: github.com/tgrospic | X: twitter.com/grospic | LinkedIn: linkedin.com/in/tgrospic"],
          ["Tom Yi", "Tom Yi is a blockchain developer, focusing on consensus protocol research. Previously he has been working in the IPC industry for about ten years, responsible for system architecture design, and application development of various platforms, including: DApp, Android&iOS app, cloud service, website and desktop applicaton. His main development languages including C#, Java, Html, JS, OC, TS, C, C++, Solidity and Rust. GitHub: github.com/tom-yi-alux"],
          ["Ben Li", "Ben Li, a seasoned blockchain developer since 2017, specializes in system and application design and development for Blockchain, Blockchain-based platforms, and DApps. With extensive experience in Linux kernel and application development, he is proficient in C, C++, Assembler, Solidity, Rust, Go, Python, and Java. GitHub: github.com/benli5510"]
        ]
      }
    ]
  },
  roadmap: {
    metaTitle: "Roadmap | ALUX Network",
    metaDescription: "ALUX Network development roadmap: quarterly milestones for the TVM runtime, BlockGit consensus, the Tolang toolchain, and EVM compatibility from 2023 through 2026.",
    hero: { hidden: true },
    sections: []
  }
};

const glvmPageEn = {
  metaTitle: "GLVM | ALUX Network",
  metaDescription: "Explore the Global Logical Virtual Machine: ALUX's architecture for connecting TVMs across blockchain, cloud, and personal devices into one verifiable logical execution layer.",
  hero: {
    eyebrow: "Learn / GLVM",
    title: "GLVM",
    fullName: "Global Logical Virtual Machine",
    tagline: "Many machines. One logical world.",
    text: "GLVM is designed to coordinate TVMs across blockchain, cloud, and personal devices as one verifiable logical machine.",
    visual: {
      poster: "assets/glvm/20260712_GLVM_全局逻辑主视觉_4K.webp",
      video: "assets/glvm/20260712_GLVM_全局逻辑动效_1080P.mp4",
      alt: "A transparent global logical computer connecting blockchain validators, cloud servers, and personal devices through visible execution rails."
    },
    signals: [
      ["Logical scope", "Chain · Cloud · Device"],
      ["Execution engine", "TVM"],
      ["Proof path", "Replay · Merge · Commit"]
    ]
  },
  definition: {
    eyebrow: "The relationship",
    title: "TVM is the engine. GLVM is the system.",
    text: "GLVM is not a second bytecode VM and it is not a crate in the current repository. It is the global architecture designed to abstract many physical TVMs into one logical execution world.",
    comparison: [
      {
        label: "TVM",
        title: "Tuple-space Virtual Machine",
        text: "The concrete ALUX execution engine. It runs Tolang bytecode, coordinates independent processes through channels and COMM events, and records the non-deterministic choices needed for deterministic replay.",
        note: "Runs inside each execution environment"
      },
      {
        label: "GLVM",
        title: "Global Logical Virtual Machine",
        text: "The system architecture designed to make TVMs on chain, in the cloud, and on personal devices behave like parts of one global computer, with a common model for orchestration, capability, and verifiable state.",
        note: "Target: unify many environments into one logical world"
      }
    ],
    axis: [
      ["Where collaboration happens", "GLVM"],
      ["What can be used — and where it must stop", "Programmable capability"]
    ]
  },
  architecture: {
    eyebrow: "Three-layer architecture",
    title: "From real machines to one logical world",
    text: "Select a layer to see what each target layer contributes. The lower layers ground execution in real machines; the upper layer is designed to turn that execution into discoverable, orchestrated, permissioned services.",
    layers: [
      {
        id: "world",
        index: "03",
        label: "Layer 3",
        title: "World Operating System",
        text: "The target agent-facing service layer: registration and finding, orchestration, and programmable capability. This is where services are designed to become discoverable and collaboration rules become explicit.",
        items: ["Service / agent discovery", "Orchestration", "Programmable capability"],
        status: "Architecture target"
      },
      {
        id: "runtime",
        index: "02",
        label: "Layer 2",
        title: "ALUX decentralized concurrent runtime",
        text: "The target logical coordination layer. VM abstraction, concurrency control, capability management, replay, and shared commit semantics are designed to make multiple TVMs look like one Unified World VM.",
        items: ["Unified World VM", "Concurrency control", "Capability management"],
        status: "Core available · system expanding"
      },
      {
        id: "physical",
        index: "01",
        label: "Layer 1",
        title: "Physical infrastructure",
        text: "The machines that do the work: blockchain validators, cloud servers, and personal devices. In the target architecture, each environment runs a TVM and exposes only the capabilities it has been given.",
        items: ["Blockchain TVM", "Cloud TVM", "Personal-device TVM"],
        status: "Mixed deployment target"
      }
    ]
  },
  journey: {
    eyebrow: "One task, three substrates",
    title: "Trust, speed, and locality decide where work runs",
    text: "Imagine a cross-company equipment repair. Escrow must be verifiable, diagnosis needs fast compute, and the device owner must approve access locally. GLVM describes one workflow across all three environments without turning them into one unsafe shared machine.",
    routeLabel: "Choose a requirement",
    routes: [
      {
        id: "trust",
        label: "Needs trust",
        title: "On-chain TVM + EVM",
        text: "Hold the warranty escrow and record the approval path where independent validators can verify it.",
        status: "EVM today"
      },
      {
        id: "speed",
        label: "Needs speed",
        title: "Cloud TVM",
        text: "Run the heavy diagnostic workload near elastic compute while keeping its authority narrow and explicit.",
        status: "GLVM architecture path"
      },
      {
        id: "locality",
        label: "Needs locality",
        title: "Personal-device TVM",
        text: "Read local sensor data and request the owner’s confirmation without exporting every private input.",
        status: "GLVM architecture path"
      }
    ],
    playLabel: "Follow the execution",
    actions: { play: "Run the workflow", reset: "Reset" },
    railLabels: ["Replay", "Commit"],
    steps: [
      { id: "authorize", label: "01", title: "Scoped capability", text: "The repair agent receives only the rights required for this job." },
      { id: "dispatch", label: "02", title: "Dispatch", text: "Subtasks are described for chain, cloud, and device execution environments." },
      { id: "wait", label: "03", title: "Wait / suspend", text: "When a reply is missing, the TVM preserves the execution context instead of blocking the whole machine." },
      { id: "match", label: "04", title: "COMM match", text: "A produced result meets the waiting continuation on a channel; the workflow resumes." },
      { id: "replay", label: "05", title: "Replay proof", text: "ReplayTrie records the choices needed for another validator to reproduce the run." },
      { id: "commit", label: "06", title: "Merge / commit", text: "BlockGit and Block Merge turn concurrent work into a verifiable state transition." }
    ],
    messages: [
      "Ready. Start the workflow to see the logical machine move.",
      "Authority is scoped before work begins.",
      "Three execution paths receive their own bounded task.",
      "The workflow is suspended safely while it waits.",
      "A matching message wakes the continuation.",
      "Replay evidence makes the path reproducible.",
      "Concurrent results converge into a verified commit."
    ]
  },
  stack: {
    eyebrow: "Under the glass",
    title: "What GLVM is built from",
    text: "GLVM is a system architecture, not a second bytecode VM. The map below ties that architecture to mechanisms in the current ALUX codebase and clearly marks what is still planned.",
    items: [
      { status: "Current", label: "Language", title: "Tolang → tolangc → .tox", text: "Tolang describes concurrent processes; the compiler lowers source into TVM executable bytecode." },
      { status: "Current", label: "Runtime", title: "TVM · Tuple space · COMM", text: "Independent processes exchange data and continuations through typed channels instead of sharing memory." },
      { status: "Today", label: "Guest VM", title: "EVM through TSAC", text: "EVM runs in an isolated sandbox; global storage and calls are coordinated through tuple-space adapter contracts." },
      { status: "Planned", label: "Guest VM", title: "WASM", text: "WASM belongs to the heterogeneous-VM direction, but it is not shipped in the current baseline." },
      { status: "Current", label: "Durability", title: "ExeContext · ReplayTrie · cross-block resume", text: "A task can wait across blocks, resume from a preserved branch, and remain reproducible." },
      { status: "Current", label: "Agreement", title: "BlockGit · Fringe · Block Merge", text: "A block DAG with deterministic rotating leaders and merge rules finalizes concurrent work without a permanent leader." }
    ]
  },
  status: {
    eyebrow: "Reality check",
    title: "The core is running.<br>The system is still expanding.",
    text: "GLVM is the system-level destination. The current ALUX codebase already supplies its hardest execution primitives, while cross-substrate productization and the full World OS remain active architecture work.",
    groups: [
      {
        tone: "built",
        label: "Current engine",
        items: ["Concurrent TVM execution", "EVM through TSAC", "Cross-block suspend / resume", "OCAP and deterministic replay", "BlockGit DAG + merge"]
      },
      {
        tone: "designed",
        label: "Designed / expanding",
        items: ["VM abstraction across chain, cloud, and device", "Richer per-operation policy gates", "Session-type collaboration protocols", "Production scale hardening"]
      },
      {
        tone: "planned",
        label: "Planned",
        items: ["WASM guest VM", "Cross-shard execution", "Complete agent and World OS layer"]
      }
    ]
  },
  close: {
    eyebrow: "Next / Runtime Lab",
    title: "See what GLVM builds on today.",
    text: "GLVM describes the logical execution architecture ALUX is building. Runtime Lab shows the core mechanisms in the current ALUX engine that support parallel execution, concurrency, and composability.",
    links: [["Open Runtime Lab", "runtime-lab.html"], ["For AI Agents", "for-ai-agents.html"]]
  }
};

const pages = {
  home: { en: pageData.home },
  vs: {},
  aluxVsOthers: { en: pageData.aluxVsOthers },
  parallelConcurrentComposable: { en: pageData.parallelConcurrentComposable },
  glvm: { en: glvmPageEn },
  team: { en: pageData.team },
  roadmap: { en: pageData.roadmap }
};

// Language selector badges remain fixed autonyms; all product UI copy comes from the generated catalog.
const visibleLanguageButtonLabels = {
  en: "EN",
  zh: "中",
  ko: "한",
  ja: "日",
  ar: "AR"
};

function clonePlainValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function mergeAluxVsDiagrams(baseDiagrams = {}, overrideDiagrams = {}) {
  return {
    ...baseDiagrams,
    ...overrideDiagrams,
    state: {
      ...(baseDiagrams.state || {}),
      ...((overrideDiagrams && overrideDiagrams.state) || {})
    },
    types: {
      ...(baseDiagrams.types || {}),
      ...((overrideDiagrams && overrideDiagrams.types) || {}),
      items: (overrideDiagrams && overrideDiagrams.types && overrideDiagrams.types.items)
        || (baseDiagrams.types && baseDiagrams.types.items)
        || []
    },
    composite: {
      ...(baseDiagrams.composite || {}),
      ...((overrideDiagrams && overrideDiagrams.composite) || {})
    }
  };
}

function setPathValue(target, path, value) {
  const parts = path.split(".");
  let cursor = target;

  parts.slice(0, -1).forEach((part, index) => {
    if (cursor[part] === undefined) {
      const nextPart = parts[index + 1];
      cursor[part] = Number.isInteger(Number(nextPart)) ? [] : {};
    }

    cursor = cursor[part];
  });

  cursor[parts[parts.length - 1]] = value;
}

function applyTranslationEntries(target, entries, prefix) {
  if (!target || !entries) return 0;
  let applied = 0;

  Object.entries(entries).forEach(([key, value]) => {
    if (!key.startsWith(prefix) || typeof value !== "string") return;
    setPathValue(target, key.slice(prefix.length), value);
    applied += 1;
  });

  return applied;
}

function getGeneratedI18nEntries(lang) {
  const bundle = window.ALUX_SITE_I18N || window.ALUX_HOME_I18N;
  if (!bundle || !bundle.entries) return null;
  return bundle.entries[lang] || null;
}

function getTextNodes(root) {
  if (!root || !document.createTreeWalker || typeof NodeFilter === "undefined") return [];
  const nodes = [];
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return node.nodeValue.trim()
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  return nodes;
}

function applyStaticTextTranslations(root, lang, prefix) {
  const entries = getGeneratedI18nEntries(lang);
  if (!entries) return;

  getTextNodes(root).forEach((node, index) => {
    const translated = entries[`${prefix}${index}`];
    if (typeof translated !== "string") return;

    const leading = node.nodeValue.match(/^\s*/)[0];
    const trailing = node.nodeValue.match(/\s*$/)[0];
    node.nodeValue = `${leading}${translated}${trailing}`;
  });
}

function prepareRoadmapQuarterLabels(root) {
  root.querySelectorAll(".roadmap-milestone-time[data-quarter]").forEach((node) => {
    const localizedLabel = node.textContent.trim();
    const spoken = document.createElement("span");
    spoken.className = "sr-only";
    spoken.textContent = localizedLabel;

    const visible = document.createElement("bdi");
    visible.className = "roadmap-quarter-visible";
    visible.dir = "ltr";
    visible.setAttribute("aria-hidden", "true");
    visible.textContent = node.dataset.quarter;

    node.replaceChildren(spoken, visible);
  });
}

function restoreHashScroll() {
  if (!window.location || !window.location.hash) return;

  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  setTimeout(() => {
    const top = target.getBoundingClientRect().top + window.pageYOffset - 104;
    const scrollTarget = Math.max(0, top);
    const scroller = document.scrollingElement || document.documentElement;

    if (scroller && typeof scroller.scrollTo === "function") {
      scroller.scrollTo({ top: scrollTarget, behavior: "smooth" });
    } else if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  }, 80);
}

function initCapabilityMindmaps() {
  document.querySelectorAll(".capability-mindmap-viewport").forEach((viewport) => {
    const canvas = viewport.querySelector(".capability-mindmap-canvas");
    if (!canvas || viewport.dataset.mindmapReady === "true") return;
    viewport.dataset.mindmapReady = "true";

    const nodes = new Map(
      [...canvas.querySelectorAll("[data-node-id]")].map((node) => [node.dataset.nodeId, node])
    );
    const links = [...canvas.querySelectorAll("[data-link-from][data-link-to]")];
    const lineSvg = canvas.querySelector(".capability-mindmap-lines");
    const composer = viewport.querySelector(".capability-composer");
    const comboTemplates = new Map(
      [...viewport.querySelectorAll("[data-combo-key]")].map((template) => [
        decodeURIComponent(template.dataset.comboKey || ""),
        template
      ])
    );
    const coreNode = nodes.get("core");
    const nodeStates = [];

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const decodeData = (value = "") => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value || "";
      }
    };
    const decodeItems = (value = "") => {
      try {
        return JSON.parse(decodeData(value));
      } catch {
        return [];
      }
    };
    const canvasCoordinateScale = () => {
      const canvasRect = canvas.getBoundingClientRect();
      return {
        x: canvasRect.width ? (canvas.clientWidth || canvasRect.width) / canvasRect.width : 1,
        y: canvasRect.height ? (canvas.clientHeight || canvasRect.height) / canvasRect.height : 1
      };
    };
    const canvasPoint = (node) => {
      const canvasRect = canvas.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const scale = canvasCoordinateScale();
      return {
        x: (nodeRect.left - canvasRect.left + nodeRect.width / 2) * scale.x,
        y: (nodeRect.top - canvasRect.top + nodeRect.height / 2) * scale.y
      };
    };

    const updateLinks = () => {
      const canvasWidth = canvas.clientWidth || 1040;
      const canvasHeight = canvas.clientHeight || 740;
      if (lineSvg) {
        lineSvg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
      }

      links.forEach((path) => {
        const from = nodes.get(path.dataset.linkFrom);
        const to = nodes.get(path.dataset.linkTo);
        if (!from || !to) return;

        const a = canvasPoint(from);
        const b = canvasPoint(to);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const bend = Math.min(92, Math.max(42, Math.hypot(dx, dy) * 0.28));
        const c1x = a.x + dx * 0.34 + (dy > 0 ? 8 : -8);
        const c1y = a.y + dy * 0.34 - bend * Math.sign(dx || 1) * 0.08;
        const c2x = a.x + dx * 0.68 - (dy > 0 ? 8 : -8);
        const c2y = a.y + dy * 0.68 + bend * Math.sign(dx || 1) * 0.08;
        path.setAttribute("d", `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      });
    };

    const setText = (selector, value, root = viewport) => {
      const target = root.querySelector(selector);
      if (target) target.textContent = value || "";
    };

    const setList = (selector, items, root = viewport) => {
      const target = root.querySelector(selector);
      if (!target) return;
      target.innerHTML = "";
      (items || []).slice(0, 4).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        target.appendChild(li);
      });
    };

    const setFlipped = (node, flipped) => {
      const wasExpanded = node.classList.contains("is-expanded");
      if (flipped) {
        pinExpandedNodeSlot(node);
        node.classList.add("is-expanded");
        requestAnimationFrame(() => constrainExpandedNodeSlot(node));
      } else {
        node.classList.remove("is-expanded");
        if (wasExpanded) clearNodePosition(node);
      }
      node.setAttribute("aria-pressed", flipped ? "true" : "false");
      node.setAttribute("aria-expanded", flipped ? "true" : "false");
      const front = node.querySelector(".capability-card-face--front");
      const back = node.querySelector(".capability-card-face--back");
      front?.setAttribute("aria-hidden", flipped ? "true" : "false");
      back?.setAttribute("aria-hidden", flipped ? "false" : "true");
    };

    const toggleFlip = (node) => {
      const shouldFlip = !node.classList.contains("is-expanded");
      nodes.forEach((item) => {
        if (item !== node) setFlipped(item, false);
      });
      setFlipped(node, shouldFlip);
      requestAnimationFrame(updateLinks);
    };

    const collapseExpandedNodes = () => {
      nodes.forEach((item) => setFlipped(item, false));
    };

    const setFusingNodes = (...activeNodes) => {
      nodes.forEach((item) => item.classList.remove("is-fusing"));
      activeNodes.filter(Boolean).forEach((item) => item.classList.add("is-fusing"));
    };

    const resetComposerPosition = () => {
      if (!composer) return;
      composer.style.removeProperty("left");
      composer.style.removeProperty("top");
    };

    const scheduleLayoutRefresh = () => {
      requestAnimationFrame(() => {
        nodeStates.forEach((state) => state.captureHome());
        updateLinks();
      });
    };

    const clearMindmapState = ({ resetLayout = true } = {}) => {
      collapseExpandedNodes();
      setFusingNodes();
      composer?.classList.remove("is-active", "is-runtime-drop");
      resetComposerPosition();
      nodes.forEach((item) => item.classList.remove("is-active"));
      if (resetLayout) {
        nodeStates.forEach((state) => state.resetLayoutPosition());
        scheduleLayoutRefresh();
        return;
      }
      requestAnimationFrame(updateLinks);
    };

    const isStatusDotClick = (event, element) => {
      const rect = element?.getBoundingClientRect?.();
      if (!rect) return false;
      const y = event.clientY - rect.top;
      const x = event.clientX - rect.left;
      const dotSize = 58;
      const isRtl = document.documentElement.dir === "rtl";
      return y >= 0 && y <= dotSize && (isRtl ? x <= dotSize : x >= rect.width - dotSize);
    };

    const pairKey = (a, b) => [a, b].filter(Boolean).sort().join("+");
    const preferredRuntimePartners = {
      execution: ["transaction", "authority", "proof"],
      authority: ["execution", "build"],
      transaction: ["framework", "consensus", "execution"],
      framework: ["transaction", "consensus"],
      consensus: ["transaction", "framework"],
      build: ["node", "authority", "tooling"],
      node: ["build", "data"],
      data: ["node"],
      proof: ["execution"],
      tooling: ["build"]
    };
    const findRuntimeTemplate = (nodeId) => {
      const preferred = preferredRuntimePartners[nodeId] || [];
      for (const partner of preferred) {
        const template = comboTemplates.get(pairKey(nodeId, partner));
        if (template) return template;
      }

      for (const [key, template] of comboTemplates) {
        if (key.split("+").includes(nodeId)) return template;
      }

      return null;
    };
    const positionComposer = (activeNodes = []) => {
      if (!composer || activeNodes.length < 2) return;
      const points = activeNodes.map(canvasPoint);
      const x = (points[0].x + points[1].x) / 2;
      const y = (points[0].y + points[1].y) / 2;
      const width = composer.offsetWidth || 320;
      const height = composer.offsetHeight || 156;
      const left = clamp(x, width / 2 + 12, canvas.clientWidth - width / 2 - 12);
      const top = clamp(y - 64, height / 2 + 12, canvas.clientHeight - height / 2 - 12);
      composer.style.left = `${left.toFixed(1)}px`;
      composer.style.top = `${top.toFixed(1)}px`;
    };

    const showCombination = (key, activeNodes = []) => {
      const template = comboTemplates.get(key);
      if (!template || !composer) {
        setFusingNodes();
        return false;
      }

      setFusingNodes(...activeNodes);
      composer.classList.remove("is-runtime-drop");
      setText("[data-composer-label]", decodeData(template.dataset.comboLabel), composer);
      setText("[data-composer-title]", decodeData(template.dataset.comboTitle), composer);
      setText("[data-composer-technical]", decodeData(template.dataset.comboTechnical), composer);
      setText("[data-composer-business]", decodeData(template.dataset.comboBusiness), composer);
      positionComposer(activeNodes);
      composer.classList.add("is-active");
      return true;
    };

    const findRuntimeTarget = (node) => {
      const nodeId = node?.dataset?.nodeId;
      if (!coreNode || !nodeId || node === coreNode) return null;

      const nodeRect = node.getBoundingClientRect();
      const coreRect = coreNode.getBoundingClientRect();
      const pad = 8;
      const centerX = nodeRect.left + nodeRect.width / 2;
      const centerY = nodeRect.top + nodeRect.height / 2;
      const centerInsideCore =
        centerX >= coreRect.left - pad &&
        centerX <= coreRect.right + pad &&
        centerY >= coreRect.top - pad &&
        centerY <= coreRect.bottom + pad;

      return centerInsideCore ? coreNode : null;
    };

    const positionRuntimeComposer = (node) => {
      if (!composer || !coreNode) return;

      const width = composer.offsetWidth || 420;
      const height = composer.offsetHeight || 210;
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;

      composer.style.left = `${clamp(centerX, width / 2 + 14, canvas.clientWidth - width / 2 - 14).toFixed(1)}px`;
      composer.style.top = `${clamp(centerY, height / 2 + 14, canvas.clientHeight - height / 2 - 14).toFixed(1)}px`;
    };

    const showRuntimeConnection = (node) => {
      if (!composer || !coreNode || node === coreNode) {
        setFusingNodes();
        return false;
      }

      collapseExpandedNodes();
      {
        const label = decodeData(node.dataset.nodeLabel) || "Runtime Module";
        const title = decodeData(node.dataset.nodeTitle) || "ALUX module";
        const detail = decodeData(node.dataset.nodeDetail);
        const runtimeLabel = decodeData(node.dataset.runtimeLabel) || label;
        const runtimeTitle = decodeData(node.dataset.runtimeTitle) || title;
        const runtimeTechnical = decodeData(node.dataset.runtimeTechnical) || detail;
        const runtimeBusiness = decodeData(node.dataset.runtimeBusiness);

        setFusingNodes(node, coreNode);
        setText("[data-composer-label]", runtimeLabel, composer);
        setText("[data-composer-title]", runtimeTitle, composer);
        setText("[data-composer-technical]", runtimeTechnical, composer);
        setText("[data-composer-business]", runtimeBusiness, composer);
        positionRuntimeComposer(node);
        composer.classList.add("is-active", "is-runtime-drop");
        return true;
      }
    };

    const updateCombinationFor = (node) => {
      const runtimeTarget = findRuntimeTarget(node);
      if (!runtimeTarget) {
        setFusingNodes();
        composer?.classList.remove("is-active", "is-runtime-drop");
        return false;
      }

      return showRuntimeConnection(node);
    };

    const getNodePosition = (node) => {
      const rect = node.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const scale = canvasCoordinateScale();
      return {
        left: (rect.left - canvasRect.left) * scale.x,
        top: (rect.top - canvasRect.top) * scale.y
      };
    };

    const setNodePosition = (node, left, top) => {
      node.style.setProperty("left", `${left.toFixed(1)}px`, "important");
      node.style.setProperty("top", `${top.toFixed(1)}px`, "important");
      node.style.setProperty("right", "auto", "important");
      node.style.setProperty("bottom", "auto", "important");
    };

    const clearNodePosition = (node) => {
      node.style.removeProperty("left");
      node.style.removeProperty("top");
      node.style.removeProperty("right");
      node.style.removeProperty("bottom");
      node.style.removeProperty("width");
      node.style.removeProperty("max-width");
      node.style.removeProperty("transform");
    };

    const constrainExpandedNodeSlot = (node) => {
      if (!node || node === coreNode || !node.classList.contains("is-expanded")) return;

      const rect = node.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const scale = canvasCoordinateScale();
      const backFace = node.querySelector(".capability-card-face--back");
      const backRect = backFace?.getBoundingClientRect?.();
      const top = (rect.top - canvasRect.top) * scale.y;
      const backHeight = (backRect?.height || rect.height) * scale.y;
      const canvasHeight = canvas.clientHeight || canvasRect.height * scale.y;
      const maxTop = Math.max(0, canvasHeight - backHeight - 2);
      if (top > maxTop) {
        node.style.setProperty("top", `${maxTop.toFixed(1)}px`, "important");
      }
    };

    const pinExpandedNodeSlot = (node) => {
      if (!node || node === coreNode) {
        clearNodePosition(node);
        return;
      }

      const rect = node.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const scale = canvasCoordinateScale();
      const width = rect.width * scale.x;
      const left = (rect.left - canvasRect.left) * scale.x;
      let top = (rect.top - canvasRect.top) * scale.y;
      const backFace = node.querySelector(".capability-card-face--back");
      const backRect = backFace?.getBoundingClientRect?.();
      const backHeight = (backRect?.height || rect.height) * scale.y;
      const canvasHeight = canvas.clientHeight || canvasRect.height * scale.y;
      const maxTop = Math.max(0, canvasHeight - backHeight - 2);
      top = Math.min(top, maxTop);

      node.style.setProperty("left", `${left.toFixed(1)}px`, "important");
      node.style.setProperty("top", `${top.toFixed(1)}px`, "important");
      node.style.setProperty("right", "auto", "important");
      node.style.setProperty("bottom", "auto", "important");
      node.style.setProperty("width", `${width.toFixed(1)}px`, "important");
      node.style.setProperty("max-width", `${width.toFixed(1)}px`, "important");
      node.style.setProperty("transform", "none", "important");
    };

    const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    nodes.forEach((node) => {
      let dragging = false;
      let moved = false;
      let startLeft = 0;
      let startTop = 0;
      let startX = 0;
      let startY = 0;
      let homeLeft = null;
      let homeTop = null;
      let returnFrame = 0;
      let keyReturnTimer = 0;
      let lastOpenTapAt = 0;
      let clickHandledFlip = false;
      let suppressNextClick = false;

      const activate = () => {
        viewport.querySelectorAll("[data-node-id].is-active").forEach((activeNode) => {
          if (activeNode !== node) activeNode.classList.remove("is-active");
        });
        node.classList.add("is-active");
      };

      const captureHome = () => {
        const position = getNodePosition(node);
        homeLeft = position.left;
        homeTop = position.top;
        node.dataset.homeCenterX = (homeLeft + node.offsetWidth / 2).toFixed(1);
        node.dataset.homeCenterY = (homeTop + node.offsetHeight / 2).toFixed(1);
      };

      const cancelReturn = () => {
        window.clearTimeout(keyReturnTimer);
        keyReturnTimer = 0;
        if (returnFrame) {
          cancelAnimationFrame(returnFrame);
          returnFrame = 0;
        }
        node.classList.remove("is-returning");
      };

      const springHome = () => {
        if (homeLeft === null || homeTop === null) captureHome();
        cancelReturn();

        const from = getNodePosition(node);
        const dx = homeLeft - from.left;
        const dy = homeTop - from.top;
        const settleHome = () => {
          clearNodePosition(node);
          requestAnimationFrame(() => {
            captureHome();
            updateLinks();
          });
        };

        if (Math.abs(dx) + Math.abs(dy) < 0.8 || motionQuery?.matches) {
          settleHome();
          return;
        }

        const startedAt = performance.now();
        const isExpandedReturn = node.classList.contains("is-expanded");
        const duration = isExpandedReturn ? 120 : 380;
        node.classList.add("is-returning");

        const tick = (now) => {
          const t = Math.min(1, (now - startedAt) / duration);
          const eased = isExpandedReturn
            ? 1 - Math.pow(1 - t, 4)
            : 1 - Math.exp(-7 * t) * Math.cos(t * Math.PI * 2.2);
          setNodePosition(node, from.left + dx * eased, from.top + dy * eased);
          updateLinks();

          if (t < 1) {
            returnFrame = requestAnimationFrame(tick);
            return;
          }

          returnFrame = 0;
          clearNodePosition(node);
          node.classList.remove("is-returning");
          requestAnimationFrame(() => {
            captureHome();
            updateLinks();
          });
        };

        returnFrame = requestAnimationFrame(tick);
      };

      const resetLayoutPosition = () => {
        dragging = false;
        moved = false;
        lastOpenTapAt = 0;
        clickHandledFlip = false;
        cancelReturn();
        clearNodePosition(node);
        node.classList.remove("is-dragging", "is-returning", "is-fusing", "is-active");
      };

      nodeStates.push({ resetLayoutPosition, captureHome });

      node.querySelectorAll(".capability-card-close-dot").forEach((dot) => {
        dot.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          suppressNextClick = true;
          clearMindmapState();
          updateLinks();
        });
      });

      node.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (isStatusDotClick(event, node)) {
          event.preventDefault();
          event.stopPropagation();
          suppressNextClick = true;
          clearMindmapState();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        cancelReturn();
        const rect = node.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const scale = canvasCoordinateScale();
        dragging = true;
        moved = false;
        startLeft = (rect.left - canvasRect.left) * scale.x;
        startTop = (rect.top - canvasRect.top) * scale.y;
        startX = event.clientX;
        startY = event.clientY;
        activate();
        node.classList.add("is-dragging");
        node.setPointerCapture?.(event.pointerId);
      });

      node.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        event.preventDefault();
        const pointerDx = event.clientX - startX;
        const pointerDy = event.clientY - startY;
        const scale = canvasCoordinateScale();
        const dx = pointerDx * scale.x;
        const dy = pointerDy * scale.y;
        moved = moved || Math.abs(pointerDx) + Math.abs(pointerDy) > 5;
        const maxLeft = Math.max(0, canvas.clientWidth - node.offsetWidth);
        const maxTop = Math.max(0, canvas.clientHeight - node.offsetHeight);
        setNodePosition(node, clamp(startLeft + dx, 0, maxLeft), clamp(startTop + dy, 0, maxTop));
        updateLinks();
        updateCombinationFor(node);
      });

      const stopDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        node.classList.remove("is-dragging");
        if (event && event.pointerId !== undefined) node.releasePointerCapture?.(event.pointerId);
        updateCombinationFor(node);
        if (moved) springHome();
      };

      node.addEventListener("pointerup", stopDrag);
      node.addEventListener("pointercancel", stopDrag);
      node.addEventListener("click", (event) => {
        if (suppressNextClick) {
          event.preventDefault();
          event.stopPropagation();
          suppressNextClick = false;
          return;
        }
        if (moved) return;
        if (isStatusDotClick(event, node)) {
          event.preventDefault();
          event.stopPropagation();
          clearMindmapState();
          return;
        }
        activate();
        const now = Date.now();
        const isSecondClick = event.detail === 2 || (now - lastOpenTapAt > 0 && now - lastOpenTapAt < 340);
        if (isSecondClick) {
          clickHandledFlip = true;
          lastOpenTapAt = 0;
          toggleFlip(node);
          return;
        }
        lastOpenTapAt = now;
      });
      node.addEventListener("dblclick", (event) => {
        event.preventDefault();
        activate();
        if (clickHandledFlip) {
          clickHandledFlip = false;
          return;
        }
        toggleFlip(node);
      });
      node.addEventListener("keydown", (event) => {
        const step = event.shiftKey ? 28 : 10;
        let dx = 0;
        let dy = 0;
        if (event.key === "ArrowLeft") dx = -step;
        else if (event.key === "ArrowRight") dx = step;
        else if (event.key === "ArrowUp") dy = -step;
        else if (event.key === "ArrowDown") dy = step;
        else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
          toggleFlip(node);
          return;
        } else {
          return;
        }

        event.preventDefault();
        const maxLeft = Math.max(0, canvas.clientWidth - node.offsetWidth);
        const maxTop = Math.max(0, canvas.clientHeight - node.offsetHeight);
        cancelReturn();
        setNodePosition(node, clamp(node.offsetLeft + dx, 0, maxLeft), clamp(node.offsetTop + dy, 0, maxTop));
        activate();
        updateLinks();
        updateCombinationFor(node);
        keyReturnTimer = window.setTimeout(springHome, 280);
      });
    });

    const refreshLayout = () => {
      nodeStates.forEach((state) => state.resetLayoutPosition());
      scheduleLayoutRefresh();
    };

    composer?.addEventListener("click", (event) => {
      if (!isStatusDotClick(event, composer)) return;
      event.preventDefault();
      event.stopPropagation();
      clearMindmapState();
    });

    const closeOnEmptyClick = (event) => {
      if (event.target.closest("[data-node-id], .capability-composer")) return;
      clearMindmapState();
    };

    viewport.addEventListener("click", closeOnEmptyClick);
    viewport.closest(".capability-map-section")?.addEventListener("click", closeOnEmptyClick);
    document.addEventListener("click", (event) => {
      if (viewport.contains(event.target)) return;
      if (event.target.closest("[data-node-id], .capability-composer")) return;
      clearMindmapState();
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      clearMindmapState();
    });

    window.addEventListener("resize", () => requestAnimationFrame(refreshLayout));
    requestAnimationFrame(() => {
      nodeStates.forEach((state) => state.captureHome());
      updateLinks();
      requestAnimationFrame(updateLinks);
    });
    window.setTimeout(updateLinks, 260);
    document.fonts?.ready?.then(() => requestAnimationFrame(updateLinks));
  });
}

function applyGeneratedSiteI18n() {
  const bundle = window.ALUX_SITE_I18N || window.ALUX_HOME_I18N;
  if (!bundle || !bundle.entries) return;

  Object.entries(bundle.entries).forEach(([lang, entries]) => {
    if (lang === "en" || !supportedLanguages.has(lang)) return;

    [
      "home",
      "vs",
      "aluxVsOthers",
      "parallelConcurrentComposable",
      "glvm",
      "team",
      "roadmap"
    ].forEach((pageKey) => {
      const pageSet = pages[pageKey];
      if (!pageSet || !pageSet.en) return;

      const translatedPage = clonePlainValue(pageSet.en);
      const applied = applyTranslationEntries(translatedPage, entries, `${pageKey}.`);
      if (applied) pageSet[lang] = translatedPage;
    });

    [
      [ui, "ui"],
      [inlineUiLabels, "inlineUiLabels"],
      [capabilityFlowLabels, "capabilityFlowLabels"]
    ].forEach(([target, prefix]) => {
      const translated = clonePlainValue(target.en);
      const applied = applyTranslationEntries(translated, entries, `${prefix}.`);
      if (applied) target[lang] = translated;
    });

    const heroActions = clonePlainValue(homeHeroActions.en);
    const actionCount = applyTranslationEntries(heroActions, entries, "homeHeroActions.");
    if (actionCount) homeHeroActions[lang] = heroActions;
  });
}

function getStoredValue(key) {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) return value;
  } catch (error) {}

  try {
    const value = sessionStorage.getItem(key);
    if (value !== null) return value;
  } catch (error) {}

  return memoryStore[key] ?? null;
}

function setStoredValue(key, value) {
  memoryStore[key] = value;

  try {
    localStorage.setItem(key, value);
  } catch (error) {}

  try {
    sessionStorage.setItem(key, value);
  } catch (error) {}
}

function detectLanguage() {
  const saved = getStoredValue("alux-lang");
  if (saved && supportedLanguages.has(saved)) return saved;
  const locale = (navigator.language || "").toLowerCase();
  if (locale.startsWith("zh")) return "zh";
  if (locale.startsWith("ko")) return "ko";
  if (locale.startsWith("ja")) return "ja";
  if (locale.startsWith("ar")) return "ar";
  return "en";
}

const forAiAgentsPage = {
  metaTitle: "For AI Agents | ALUX Network",
  metaDescription: "How ALUX gives production AI agents cross-block continuity, tuple-space coordination, OCAP authority, and an EVM path through TSAC.",
  hero: {
    hidden: true
  },
  sections: [
    {
      type: "agentPrinciple",
      showDemands: false,
      eyebrow: "For AI Agents",
      title: "<span class=\"title-line\">The Runtime Platform for</span><span class=\"title-line\">Persistent AI Agents</span>",
      text: "AI agents stop being simple calls once they enter production. They wait for APIs and people, coordinate with other agents, carry scoped authority, and need a record of what happened. ALUX gives that work a decentralized service runtime.",
      statement: "The capability runtime for production AI agents.",
      signals: [
        {
          label: "Execution model",
          value: "Cross-block continuity",
          text: "Work can suspend at a seam and resume in a later block."
        },
        {
          label: "Authority model",
          value: "Unforgeable OCAP",
          text: "A process uses only references it created or was explicitly passed."
        },
        {
          label: "Coordination model",
          value: "Tuple-space channels",
          text: "Produce and consume operations let concurrent processes wait and match."
        },
        {
          label: "EVM path",
          value: "TSAC into TVM",
          text: "EVM sandboxes reach shared resources through adapter contracts."
        }
      ],
      visual: {
        label: "Agent + ALUX",
        title: "One lifecycle, not a brittle call chain",
        stages: [
          ["Intent", "A user, app, or agent starts with scoped purpose."],
          ["Capability", "The runtime passes explicit authority instead of raw credentials."],
          ["Concurrent work", "Subtasks branch across agents, services, and systems."],
          ["Wait / resume", "Execution can pause for APIs, people, timers, or payments."],
          ["Replay", "Non-deterministic matches leave a record validators can reproduce."]
        ]
      },
      demands: [
        {
          title: "Persistent lifecycle",
          text: "Unfinished execution can cross block boundaries without discarding its context."
        },
        {
          title: "Capability-native rights",
          text: "Each task receives explicit, unforgeable capability references instead of inheriting ambient authority from a broad identity."
        },
        {
          title: "Async collaboration",
          text: "Processes coordinate by waiting and matching in tuple-space channels."
        },
        {
          title: "Bit-exact replay",
          text: "Non-deterministic communication choices are recorded for bit-exact deterministic replay inside the ALUX runtime."
        }
      ],
      footnote: ""
    },
    {
      type: "agentInfrastructure",
      eyebrow: "",
      title: "<span class=\"title-line\">Three Layers of </span><span class=\"title-line\">Agent Infrastructure</span>",
      text: "Once agent work can actually stay alive, ALUX gives it three platform layers: permissions, coordination, and accountability.",
      figure: {
        label: "ALUX",
        title: "Agent Service Runtime",
        text: "A runtime where agents wait, collaborate, carry rights, and remain accountable."
      },
      items: [
        {
          kicker: "Rights",
          title: "Capability Rights Infrastructure",
          text: "Authority is carried by unforgeable channel references: what a process may access, invoke, pass onward, or attenuate.",
          points: [
            "OCAP-native capability control",
            "Delegation and attenuation",
            "A foundation for scoped tool access"
          ]
        },
        {
          kicker: "Collaboration",
          title: "Agent Coordination Infrastructure",
          text: "Agent work is collaborative. ALUX supports multi-agent concurrency, async coordination, and workflows that continue across time.",
          points: [
            "Tuple space messaging for async coordination",
            "Cross-block wait and resume",
            "Composable services and shared tasks"
          ]
        },
        {
          kicker: "Accountability",
          title: "Reproducible Execution Evidence",
          text: "ReplayTrie records non-deterministic COMM choices for bit-exact deterministic replay inside the ALUX runtime; committed state transitions provide a foundation for higher-level audit and governance.",
          points: [
            "Validator-reproducible execution outcomes",
            "Committed capability and state transitions",
            "A foundation for governance and safety layers"
          ]
        }
      ],
      outro: "ALUX is not just AI on-chain. It is infrastructure for agent permissions, coordination, and traceable accountability."
    },
    {
      type: "agentWorkflow",
      eyebrow: "",
      title: "<span class=\"title-line\">How Agent Work </span><span class=\"title-line\">Lives on ALUX</span>",
      text: "An agent workflow does not need to collapse into one bounded call. It can enter with capability scope, branch into concurrent work, suspend at external waits, resume in a later block, and leave an accountable record.",
      steps: [
        {
          step: "01",
          label: "Scoped Intent",
          mini: "Scoped request enters the runtime",
          title: "Scoped intent enters",
          text: "Work starts with a request, delegated capability, or user intent. The runtime begins with explicit scope and context.",
          points: [
            "Capabilities are passed, never forged",
            "Scope defines purpose and boundaries"
          ]
        },
        {
          step: "02",
          label: "Concurrent Work",
          mini: "Tasks fan out and coordinate",
          title: "Concurrent branches",
          text: "Subtasks fan out across agents and services instead of squeezing through one linear path.",
          points: [
            "Tuple space enables async coordination",
            "Concurrency fits multi-step agent work"
          ]
        },
        {
          step: "03",
          label: "Wait for the World",
          mini: "Execution pauses for the world",
          title: "External wait",
          text: "Execution can pause for APIs, people, timers, payments, or other real-world events.",
          points: [
            "Waiting suspends cleanly",
            "Wait state stays in the runtime"
          ]
        },
        {
          step: "04",
          label: "Cross-Block Resume",
          mini: "Later blocks continue the work",
          title: "Cross-block resume",
          text: "When the world responds, the workflow continues in a later block with state, memory, and permissions intact.",
          points: [
            "Continuity survives long tasks",
            "Execution history stays intact"
          ]
        },
        {
          step: "05",
          label: "Accountable Record",
          mini: "The trail remains public",
          title: "Durable record",
          text: "Recorded COMM choices and committed state transitions remain reproducible to validators and available to higher-level audit systems.",
          points: [
            "Validators reproduce the same recorded execution outcome",
            "A foundation for governance and trust layers"
          ]
        }
      ],
      closing: "ALUX gives agent work a full lifecycle: scoped entry, concurrent execution, external waiting, cross-block continuation, and durable record."
    },
    {
      type: "agentContrast",
      eyebrow: "",
      title: "<span class=\"title-line\">Inside the ALUX Runtime</span>",
      text: "ALUX brings persistent execution, concurrent coordination, explicit authority, and EVM compatibility together in one runtime layer.",
      statement: "Four core mechanisms make long-running agent work native to the platform.",
      features: [
        {
          kind: "continuity",
          index: "01",
          title: "Cross-Block Continuity",
          text: "A transaction can suspend at a seam and resume in a later block when its dependencies resolve.",
          flow: ["Block N", "Suspend", "Block N+1"]
        },
        {
          kind: "authority",
          index: "02",
          title: "OCAP-Native Authority",
          text: "A process can use only references it created or was explicitly passed; arbitrary authority cannot be forged by an opcode.",
          flow: ["Creator", "Capability", "Process"]
        },
        {
          kind: "coordination",
          index: "03",
          title: "Tuple-Space Coordination",
          text: "Processes communicate through produce and consume channels. Unmatched work waits; non-deterministic matches are recorded for replay.",
          flow: ["Produce", "Tuple Space", "Consume"]
        },
        {
          kind: "adapter",
          index: "04",
          title: "EVM Through TSAC",
          text: "EVM sandboxes keep sequential execution while SLOAD, SSTORE, and CALL reach shared resources through Tuple-space Adapter Contracts.",
          flow: ["EVM", "TSAC", "TVM"]
        }
      ],
      closing: "Together, they keep continuity, coordination, and authority inside the runtime instead of rebuilding them in application code."
    },
    {
      type: "agentMachine",
      eyebrow: "RISC Agent Machine",
      title: "<span class=\"title-line\">Agents Need More</span><span class=\"title-line\">Than a Brain</span>",
      text: "Production-grade agents need a body, a brain, an immune system, and a social layer. Intelligence is only one part of the machine; the runtime must keep work alive, contain risk, and connect work across organizations.",
      statement: "Production-grade agents must be RISC. ALUX builds the machine.",
      specLabel: "RISC specification",
      visual: {
        src: "assets/for-ai-agent/agent-runtime-robot-ai.png",
        alt: "Line illustration of a production agent runtime machine",
        label: "ALUX runtime machine",
        tags: [
          "Runtime body",
          "Safety immune system",
          "Coordination layer"
        ]
      },
      systems: [
        {
          letter: "R",
          title: "Robust",
          role: "Body",
          keywords: ["cross-block", "durability", "replay", "reproducibility"],
          text: "Cross-block context preservation and deterministic replay keep long-running work reproducible as it resumes."
        },
        {
          letter: "I",
          title: "Intelligent",
          role: "Brain",
          keywords: ["LLM loop", "memory", "tools", "orchestration"],
          text: "Reasoning loops, memory, tool use, and task orchestration are where most agent frameworks compete today."
        },
        {
          letter: "S",
          title: "Secure",
          role: "Immune System",
          keywords: ["object capability", "policy", "rollback", "audit"],
          text: "Object capabilities, lifecycle constraints, rollback paths, and replay evidence limit which effects a process can attempt and make committed outcomes easier to examine."
        },
        {
          letter: "C",
          title: "Connected",
          role: "Social",
          keywords: ["cross-company delegation", "neutral ground", "session types"],
          text: "Designed session-type protocols give agents from different organizations a path to work together without remaining in private silos."
        }
      ]
    }
  ]
};

pages.vs.en = forAiAgentsPage;

const teamPageEn = {
  metaTitle: "Team | ALUX Network",
  metaDescription: "Meet the lead developers building ALUX's concurrent runtime, language, consensus, and blockchain systems stack.",
  hero: { hidden: true },
  sections: [
    {
      type: "teamGrid",
      eyebrow: "Lead Developers",
      title: "People building the runtime",
      stackLabel: "Team Stack",
      stackTags: ["TVM", "Tolang", "Rust", "OCAP", "BlockGit", "ACID"],
      items: [
        {
          name: "Frank He",
          handle: "Atticbee",
          role: "Founder / Concurrent Systems Architect",
          portrait: "frank",
          featured: true,
          bio: [
            "Frank is a concurrent systems architect. Before ALUX, he spent nearly 20 years at Lehman Brothers, Barclays Capital, and Bloomberg as a senior quant and derivatives engineer, building Wall Street-grade risk systems that had to stay correct under concurrency — across time zones, organizations, and milliseconds.",
            "That career left him with one conviction: the synchronous execution model has reached its end. ALUX is his answer. He led the design of its core stack:"
          ],
          highlights: [
            ["TVM tuple-space virtual machine", "Processes interact concurrently through channels; pattern matching is scheduling; capability credentials are authorization."],
            ["Tolang concurrent programming language", "Tolang encodes channel descriptors and behavioral types so some misuse can be caught early, while the runtime enforces lifecycle constraints."],
            ["OCAP object-capability security model", "A channel reference is unforgeable and transferable; scope and lifecycle rules limit authority without relying on address-based access alone."],
            ["BlockGit DAG consensus protocol", "Validators produce DAG blocks concurrently. BlockGit uses rotating leader selection for finality, while Block Merge resolves overlapping work."],
            ["Decentralized ACID transaction layer", "Segments, rollback, isolation rules, and commit points preserve ACID semantics for long-running and cross-block work."]
          ],
          closing: [
            "Virtual machine, language, and consensus interlock into one system where concurrent execution and composability finally hold together — a protocol layer built for an open, composable economy of AI agents."
          ],
          links: [
            ["GitHub", "https://github.com/atticbee"],
            ["X", "https://twitter.com/atticbeeus"]
          ],
          signals: ["Tuple Space", "Capability Security", "Risk Systems"]
        },
        {
          name: "Tomislav Grospić",
          role: "Concurrency Engineer",
          portrait: "tomislav",
          bio: [
            "Tomislav's path into computing started early: a cardboard calculator at five, assembly on a C64c by ten. A decade in electronics and two more as a polyglot programmer — from JavaScript to Haskell — taught him to think from the metal up.",
            "At ALUX he works where theory meets the runtime: using process calculus to make concurrency a first-class citizen, not an afterthought."
          ],
          links: [
            ["GitHub", "https://github.com/tgrospic"],
            ["X", "https://twitter.com/grospic"],
            ["LinkedIn", "https://linkedin.com/in/tgrospic"]
          ],
          signals: ["Process Calculus", "Haskell", "Electronics"]
        },
        {
          name: "Tom Yi",
          role: "Consensus Protocol Researcher",
          portrait: "tom",
          bio: [
            "Tom is a blockchain developer focused on consensus protocol research — at ALUX, that means BlockGit, the DAG consensus design that lets validators produce blocks concurrently without a permanent leader.",
            "Before ALUX he spent about ten years in the IPC industry, owning system architecture and shipping across DApps, mobile, cloud, web, and desktop — a range that now spans a dozen languages, from C and C++ to Solidity and Rust."
          ],
          links: [
            ["GitHub", "https://github.com/tom-yi-alux"]
          ],
          signals: ["Consensus", "System Architecture", "DApps"]
        },
        {
          name: "Ben Li",
          role: "Blockchain / Systems Developer",
          portrait: "ben",
          bio: [
            "Ben has been building blockchain systems since 2017 — chains, platforms, and DApps — with deep roots in the Linux kernel and low-level development.",
            "That systems background, from C and assembler up through Rust, Go, and Solidity, is the foundation his ALUX work stands on."
          ],
          links: [
            ["GitHub", "https://github.com/benli5510"]
          ],
          signals: ["Linux Kernel", "Blockchain Systems", "DApps"]
        }
      ]
    }
  ]
};

pageData.team = teamPageEn;
pages.team.en = teamPageEn;

function renderHero(hero, lang) {
  if (!hero || hero.hidden) return "";
  const renderHeroCopy = (value = "") => escapeAttribute(value).split(/\n+/).join("<br>");
  const loop = hero.loop ? `<p class="hero-loop">${renderHeroCopy(hero.loop)}</p>` : "";
  const text = hero.text ? `<p class="hero-text">${renderHeroCopy(hero.text)}</p>` : "";
  const eyebrow = hero.eyebrow ? `<p class="eyebrow">${renderHeroCopy(hero.eyebrow)}</p>` : "";
  const title = currentPage === "home"
    ? hero.title.replace(/^ALUX\b/, '<span class="hero-home-brand">ALUX</span>')
    : hero.title;
  if (currentPage === "home") {
    const actions = (homeHeroActions[lang] || homeHeroActions.en)
      .map(({ label, href, variant }) => `<a class="button ${variant}" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>${label}</a>`)
      .join("");

    return `<section class="hero hero-home fade-in"><div class="hero-home-unified"><div class="lego-skyline" aria-hidden="true"><div class="sky-orb orb-sun"></div><div class="sky-orb orb-moon"></div><div class="lego-cloud cloud-a"></div><div class="lego-cloud cloud-b"></div><div class="floating-island island-a"><span class="stone-base"></span><span class="brick-tower tower-red"></span><span class="brick-tower tower-blue"></span><span class="brick-bridge bridge-a"></span></div><div class="floating-island island-b"><span class="stone-base"></span><span class="brick-tower tower-yellow"></span><span class="brick-tower tower-green"></span><span class="brick-bridge bridge-b"></span></div><div class="floating-island island-c"><span class="stone-base"></span><span class="brick-tower tower-purple"></span><span class="brick-tower tower-orange"></span></div><div class="loose-brick loose-a"></div><div class="loose-brick loose-b"></div><div class="loose-brick loose-c"></div></div><div class="hero-copy hero-home-copy">${eyebrow}<h1>${title}</h1>${loop}${text}<div class="hero-actions home-hero-actions">${actions}</div></div></div></section>`;
  }

  return `<section class="hero hero-simple fade-in"><div class="hero-copy">${eyebrow}<h1>${title}</h1>${text}</div></section>`;
}

function splitHtmlParagraphs(text) {
  if (!text) return [];
  return text
    .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
    .map((part) => part.trim())
    .filter(Boolean);
}

const externalProjectNameReplacements = {
  en: [
    [/\bEthereum\b/gi, "state-first systems"],
    [/\bSolana\b/gi, "high-throughput state systems"],
    [/\bSui\s*\/\s*Aptos\b/gi, "object-state systems"],
    [/\bSui\b/gi, "object-state systems"],
    [/\bAptos\b/gi, "object-state systems"],
    [/\bMonad\b/gi, "parallel-execution systems"],
    [/\bMetaMask\b/gi, "standard wallet tooling"],
    [/\bHardhat\b/gi, "standard developer tooling"],
    [/\bOpenAI\b/gi, "frontier AI systems"],
    [/\bDeFi\b/g, "programmable finance"],
    [/\bBitcoin\b/gi, "scarce digital money"],
    [/\bBTC\b/g, "external market data"]
  ]
};

function sanitizeExternalProjectNames(value = "", lang = "en") {
  if (lang !== "en") return String(value);
  const replacements = externalProjectNameReplacements.en;
  return replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    String(value)
  );
}

function escapeAttribute(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeRenderedExternalProjectNames(root, lang) {
  getTextNodes(root).forEach((node) => {
    node.nodeValue = sanitizeExternalProjectNames(node.nodeValue, lang);
  });
}

const LOCALIZED_UNBREAKABLE_PHRASES = /JSON-RPC|Tuple-space|Web (?:2(?:\.0)?|3)|跨底座产品化|服务原生公链|有边界的权限|原地重启|真正需要的权限|旨在(?=把多个物理环境中的 TVM)|这些(?=执行转化为)|具体机制(?=，并明确标出)/g;

function protectLocalizedTechnicalTokens(root, lang) {
  if (lang === "en") return;

  getTextNodes(root).forEach((node) => {
    if (node.parentElement?.closest(".technical-token")) return;

    const value = node.nodeValue;
    const matches = [...value.matchAll(LOCALIZED_UNBREAKABLE_PHRASES)];
    if (!matches.length) return;

    const fragment = document.createDocumentFragment();
    let cursor = 0;

    matches.forEach((match) => {
      const start = match.index ?? 0;
      fragment.append(value.slice(cursor, start));

      const protectedToken = document.createElement(lang === "ar" ? "bdi" : "span");
      protectedToken.className = "technical-token";
      if (lang === "ar") protectedToken.dir = "ltr";
      protectedToken.textContent = match[0];
      fragment.append(protectedToken);
      cursor = start + match[0].length;
    });

    fragment.append(value.slice(cursor));
    node.replaceWith(fragment);
  });
}

const ARABIC_TECHNICAL_RUN = /\([^()\n]*[A-Za-z0-9][^()\n]*\)|[A-Za-z0-9]+(?:[+./:_-][A-Za-z0-9]+)*(?:[ \u00A0]+[A-Za-z0-9]+(?:[+./:_-][A-Za-z0-9]+)*)*/g;

function isolateArabicTechnicalRuns(root, lang) {
  if (lang !== "ar") return;

  root.querySelectorAll(".roadmap-bullet-list li, .agent-difference-node").forEach((scope) => {
    getTextNodes(scope).forEach((node) => {
      if (node.parentElement?.closest("bdi, [dir='ltr']")) return;

      const value = node.nodeValue;
      const matches = [...value.matchAll(ARABIC_TECHNICAL_RUN)];
      if (!matches.length) return;

      const fragment = document.createDocumentFragment();
      let cursor = 0;

      matches.forEach((match) => {
        const start = match.index ?? 0;
        fragment.append(value.slice(cursor, start));

        const isolated = document.createElement("bdi");
        isolated.dir = "ltr";
        isolated.textContent = match[0];
        fragment.append(isolated);
        cursor = start + match[0].length;
      });

      fragment.append(value.slice(cursor));
      node.replaceWith(fragment);
    });
  });
}

const inlineUiLabels = {
  en: {
    databaseFirstChains: "Database-first chains",
    databaseFirstNote: "Best at storing, updating, and synchronizing decentralized state.",
    bottomLine: "Bottom Line",
    modelShift: "Model Shift",
    serviceStack: "Service Stack",
    processTags: ["Most chains", "ALUX", "Runtime", "Consensus", "Language"],
    pastEra: "Past Era",
    nextEra: "Next Era",
    machine: "Physical Machine",
    tvm: "TVM",
    coreThesis: "Core Thesis",
    point: "Point",
    thesisTags: ["Agents", "Blockchains", "Web3", "ALUX"],
    whatAgentsNeed: "What Agents Need",
    whyItMatters: "Why It Matters",
    constraint: "Constraint",
    capability: "Capability",
    before: "Before",
    after: "After",
    shift: "Shift",
    runtimeNodes: ["Agents", "Messages", "Memory", "Resume"]
  }
};

const capabilityFlowLabels = {
  en: {
    closed: "Closed authority",
    open: "Open capability layer",
    today: "Today",
    openClaw: "OpenClaw",
    apiKeys: "API keys",
    platformAcls: "Platform ACLs",
    privateIntegrations: "Private integrations",
    namespace: "Namespace",
    delegation: "Delegation",
    expiry: "Expiry",
    budget: "Budget",
    agents: "Agents",
    apps: "Apps",
    organizations: "Organizations"
  }
};

applyGeneratedSiteI18n();

function getInlineUiLabels() {
  const lang = document.documentElement.lang || "en";
  return inlineUiLabels[lang] || inlineUiLabels.en;
}

function getCapabilityFlowLabels() {
  const lang = document.documentElement.lang || "en";
  return capabilityFlowLabels[lang] || capabilityFlowLabels.en;
}

function getHomeShowcaseKey(index) {
  const showcaseKeys = {
    3: "agents",
    4: "middleware",
    5: "process",
    6: "use-cases"
  };
  return showcaseKeys[index] || "feature";
}

function renderHomeShowcasePanel(section, index) {
  const labels = getInlineUiLabels();
  const showcaseKey = getHomeShowcaseKey(index);
  const introText = section.text ? `<p class="showcase-intro">${section.text}</p>` : "";
  const showcaseTitle = escapeAttribute(section.title || "").split(/\n+/).join("<br>");
  const headingClass = section.text
    ? "section-heading showcase-panel-heading showcase-panel-heading--split"
    : "section-heading showcase-panel-heading";
  const processGrid = index === 5;
  const useCaseGrid = index === 6;

  if (processGrid) {
    const processTags = labels.processTags;
    const renderProcessCards = (items, startIndex) => items.map(([title, text], itemIndex) => {
      const absoluteIndex = startIndex + itemIndex;
      return `<article class="showcase-card showcase-card--process-card showcase-card--process-${absoluteIndex + 1}"><div class="showcase-card-top"><span class="showcase-chip showcase-chip--semantic">${processTags[absoluteIndex]}</span><h3>${title}</h3></div><p>${text}</p></article>`;
    }).join("");

    return `<section class="section fade-in showcase-panel-section showcase-panel-section--${showcaseKey}"><div class="content-card showcase-panel showcase-panel--${showcaseKey}"><div class="${headingClass}"><p class="eyebrow">${section.eyebrow}</p><h2>${showcaseTitle}</h2>${introText}</div><div class="process-board"><div class="process-group"><span class="process-group-label">${labels.modelShift}</span><div class="showcase-grid showcase-grid--process-model">${renderProcessCards(section.items.slice(0, 2), 0)}</div></div><div class="process-group"><span class="process-group-label">${labels.serviceStack}</span><div class="showcase-grid showcase-grid--process-stack">${renderProcessCards(section.items.slice(2), 2)}</div></div></div></div></section>`;
  }

  if (useCaseGrid) {
    const renderDemoHead = (demo) => `<div class="showcase-demo-head"><span>${demo.label}</span><strong>${demo.status}</strong></div>`;
    const renderUseCaseDemo = (demo = {}) => {
      if (demo.type === "workflow") {
        return `<div class="showcase-demo showcase-demo--workflow">${renderDemoHead(demo)}<div class="showcase-demo-steps">${demo.steps.map((step, stepIndex) => `<span class="${stepIndex === 1 ? "is-active" : ""}">${step}</span>`).join("")}</div><div class="showcase-demo-progress"><span></span></div></div>`;
      }
      if (demo.type === "parallel") {
        return `<div class="showcase-demo showcase-demo--parallel">${renderDemoHead(demo)}<div class="showcase-demo-lanes">${demo.lanes.map((lane, laneIndex) => `<div><span>${lane}</span><i style="--lane-progress:${72 - laneIndex * 14}%"></i></div>`).join("")}</div><strong class="showcase-demo-runtime">${demo.core}</strong></div>`;
      }
      if (demo.type === "systems") {
        return `<div class="showcase-demo showcase-demo--systems">${renderDemoHead(demo)}<div class="showcase-demo-system-nodes">${demo.nodes.map((node) => `<span>${node}</span>`).join("")}</div><strong class="showcase-demo-footer">${demo.footer}</strong></div>`;
      }
      if (demo.type === "capability") {
        return `<div class="showcase-demo showcase-demo--capability">${renderDemoHead(demo)}<div class="showcase-demo-capability-rows">${demo.rows.map(([label, value]) => `<div><span>${label}</span><code>${value}</code></div>`).join("")}</div></div>`;
      }
      return "";
    };
    const useCaseCards = section.items.map(([title, text], itemIndex) => `<article class="showcase-card showcase-card--use-case showcase-card--${itemIndex + 1}"><div class="showcase-use-case-copy"><div class="showcase-card-top"><span class="showcase-chip">${String(itemIndex + 1).padStart(2, "0")}</span><h3>${title}</h3></div><p>${text}</p></div>${renderUseCaseDemo(section.demos?.[itemIndex])}</article>`).join("");
    const cta = section.cta ? `<div class="showcase-use-cases-cta"><div><span>${section.cta.eyebrow}</span><h3>${section.cta.title}</h3><p>${section.cta.text}</p></div><a href="runtime-lab.html">${section.cta.label}<span aria-hidden="true">→</span></a></div>` : "";
    return `<section class="section fade-in showcase-panel-section showcase-panel-section--${showcaseKey}"><div class="content-card showcase-panel showcase-panel--${showcaseKey}"><div class="${headingClass}"><p class="eyebrow">${section.eyebrow}</p><h2>${showcaseTitle}</h2>${introText}</div><div class="showcase-grid showcase-grid--use-cases">${useCaseCards}</div>${cta}</div></section>`;
  }

  const gridClass = processGrid
    ? "showcase-grid showcase-grid--process"
    : "showcase-grid showcase-grid--feature";

  return `<section class="section fade-in showcase-panel-section showcase-panel-section--${showcaseKey}"><div class="content-card showcase-panel showcase-panel--${showcaseKey}"><div class="${headingClass}"><p class="eyebrow">${section.eyebrow}</p><h2>${showcaseTitle}</h2>${introText}</div><div class="${gridClass}">${section.items.map(([title, text], itemIndex) => `<article class="showcase-card showcase-card--${itemIndex + 1}"><div class="showcase-card-top"><span class="showcase-chip">${String(itemIndex + 1).padStart(2, "0")}</span><h3>${title}</h3></div><p>${text}</p></article>`).join("")}</div></div></section>`;
}

function renderHomeComparePanel(section) {
  const labels = getInlineUiLabels();
  const intro = section.text ? `<p class="compare-spotlight-intro">${section.text}</p>` : "";
  const databaseCards = (section.databaseCards || []).map(([label, title, text], index) => `<article class="compare-stage-item compare-stage-item--${index + 1}"><div class="compare-stage-item-top"><span class="compare-stage-item-chip">${label}</span><p class="compare-stage-item-title">${title}</p></div><p class="compare-stage-item-copy">${text}</p></article>`).join("");
  const aluxPoints = section.aluxCard && section.aluxCard.points && section.aluxCard.points.length
    ? `<ul class="compare-stage-points">${section.aluxCard.points.map((point) => `<li>${point}</li>`).join("")}</ul>`
    : "";
  const aluxOverline = section.aluxCard && section.aluxCard.overline
    ? `<p class="compare-stage-highlight-overline">${section.aluxCard.overline}</p>`
    : "";
  const aluxSubtitle = section.aluxCard && section.aluxCard.subtitle
    ? `<p class="compare-stage-highlight-subtitle">${section.aluxCard.subtitle}</p>`
    : "";
  const bottomLine = section.bottomLine
    ? `<div class="compare-stage-footer"><span class="compare-stage-footer-label">${labels.bottomLine}</span><p>${section.bottomLine}</p></div>`
    : "";

  return `<section class="section fade-in showcase-panel-section compare-showcase-section"><div class="content-card compare-stage"><div class="section-heading compare-stage-heading"><div class="compare-stage-title"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div>${intro}</div><div class="compare-stage-shell"><aside class="compare-stage-context"><span class="compare-stage-context-label">${labels.databaseFirstChains}</span><div class="compare-stage-list">${databaseCards}</div><p class="compare-stage-context-note">${labels.databaseFirstNote}</p></aside><article class="compare-stage-highlight"><div class="compare-stage-highlight-head"><span class="compare-stage-highlight-chip">${section.aluxCard.label}</span><span class="compare-stage-highlight-kicker">${section.aluxCard.kicker}</span></div>${aluxOverline}<h3>${section.aluxCard.title}</h3>${aluxSubtitle}<p class="compare-stage-highlight-copy">${section.aluxCard.text}</p>${aluxPoints}</article></div>${bottomLine}</div></section>`;
}

function renderHomeCapabilityMapSection(section) {
  const clusters = section.clusters || [];
  const core = section.core || {};
  const outcome = section.outcome || {};
  const showOutcomeNode = section.showOutcomeNode === true;
  const fallbackIds = ["execution", "authority", "transaction", "framework", "consensus", "build", "node", "data", "proof", "tooling"];
  const attr = (value = "") => encodeURIComponent(String(value));
  const escapeAttr = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]
    ));
  const renderInlineCopy = (value = "") => escapeAttr(value).split(/\n+/).join("<br>");
  const comboKey = (nodes = []) => nodes.slice().sort().join("+");
  const renderItems = (items = [], limit = 4) => items.slice(0, limit).map((item) => `<li>${item}</li>`).join("");
  const renderBackFace = ({
    title = "",
    text = "",
    detailTitle = "",
    detailTechnical = "",
    detailBusiness = ""
  }) => {
    const backTitle = detailTitle || title;
    const copyBlocks = [
      detailTechnical || text,
      detailBusiness
    ].filter(Boolean).map((copy, index) => (
      `<p class="capability-card-back-copy${index ? " capability-card-back-impact" : ""}">${renderInlineCopy(copy)}</p>`
    )).join("");

    return `<div class="capability-card-face capability-card-face--back" aria-hidden="true"><button type="button" class="capability-card-close-dot" aria-label="Close"></button><h3>${renderInlineCopy(backTitle)}</h3>${copyBlocks}</div>`;
  };
  const featuredClusterIds = new Set(section.featuredClusterIds || ["execution", "authority", "transaction", "consensus", "build"]);
  const nodeData = clusters.map((cluster, index) => {
    const id = cluster?.id || fallbackIds[index] || `module-${index + 1}`;
    return [id, cluster, `capability-mindmap-node--${id}`];
  }).filter(([id]) => featuredClusterIds.has(id));
  const renderNode = ([id, cluster, className]) => {
    if (!cluster) return "";
    const frontItems = renderItems(cluster.items);
    return `<article class="capability-mindmap-node ${className}" data-capability-node data-node-id="${id}" data-node-label="${attr(cluster.label)}" data-node-title="${attr(cluster.title)}" data-node-detail="${attr(cluster.text)}" data-node-items="${attr(JSON.stringify(cluster.items || []))}" data-runtime-label="${attr(cluster.runtimeLabel || cluster.label)}" data-runtime-title="${attr(cluster.runtimeTitle || cluster.title)}" data-runtime-technical="${attr(cluster.runtimeTechnical || cluster.text)}" data-runtime-business="${attr(cluster.runtimeBusiness || "")}" aria-pressed="false" aria-expanded="false" tabindex="0"><div class="capability-card-shell"><div class="capability-card-face capability-card-face--front"><span class="capability-mindmap-label">${cluster.label}</span><h3>${cluster.title}</h3>${frontItems ? `<ul>${frontItems}</ul>` : ""}</div>${renderBackFace(cluster)}</div></article>`;
  };
  const guideSteps = section.guideSteps || ["Drag to ALUX Runtime", "Double-click to See Why"];
  const guide = guideSteps.map((step) => `<span>${escapeAttr(step)}</span>`).join("");
  const mapIntro = section.mapIntro || section.text || "";
  const note = `<div class="capability-map-note">${guide}</div>`;
  const renderFrontCopy = (value = "") => renderInlineCopy(value)
    .replace(/capability authority/g, "capability&nbsp;authority")
    .replace(/BlockGit finality/g, "BlockGit&nbsp;finality")
    .replace(/one runtime/g, "one&nbsp;runtime");
  const coreText = core.text ? `<p>${renderFrontCopy(core.text)}</p>` : "";
  const coreItems = core.items || ["Public Chain", "Composable Runtime", "Service Primitives"];
  const outcomeItems = outcome.items || ["Discover", "Delegate", "Compose", "Audit"];
  const outcomeChips = outcomeItems.map((item) => `<li>${item}</li>`).join("");
  const linkPaths = [
    ...nodeData.map(([id]) => `<path class="capability-mindmap-line capability-mindmap-line--${id}" data-link-from="core" data-link-to="${id}" />`),
    ...(showOutcomeNode ? [`<path class="capability-mindmap-line capability-mindmap-line--outcome" data-link-from="core" data-link-to="outcome" />`] : [])
  ].join("");
  const comboTemplates = (section.combinations || []).map((combo) => `<template data-combo-key="${attr(comboKey(combo.nodes || []))}" data-combo-label="${attr(combo.label)}" data-combo-title="${attr(combo.title)}" data-combo-technical="${attr(combo.technical)}" data-combo-business="${attr(combo.business)}"></template>`).join("");
  const comboLabel = section.comboLabel || "Runtime Connection";
  const comboTitle = section.comboTitle || "Connect a module to ALUX";
  const comboDefault = section.comboDefault || "Drag a capability card into ALUX Runtime to reveal its role inside the public chain.";
  const inspectorDefault = section.inspectorDefault || "Double-click a module for detail, or drag it into ALUX Runtime to connect it.";
  const ariaLabel = [
    section.mapKicker,
    section.mapTitle || section.title || section.eyebrow || "Capability Map",
    mapIntro
  ].filter(Boolean).join(". ");
  const headingTitle = section.mapTitle || section.title || section.eyebrow || "Capability Map";
  const headingKicker = Object.prototype.hasOwnProperty.call(section, "mapKicker")
    ? section.mapKicker
    : section.eyebrow;
  const headingKickerHtml = headingKicker && headingKicker !== headingTitle
    ? `<p class="capability-map-kicker">${escapeAttr(headingKicker)}</p>`
    : "";
  const headingIntro = mapIntro
    ? `<p class="capability-map-intro">${renderInlineCopy(mapIntro)}</p>`
    : "";
  const headingBlock = `<div class="capability-map-title-block">${headingKickerHtml}<h2>${escapeAttr(headingTitle)}</h2>${headingIntro}${note}</div>`;
  const coreBack = renderBackFace({
    title: core.runtimeTitle || core.detailTitle || core.title || "ALUX Runtime",
    detailTechnical: core.runtimeTechnical || core.detailTechnical || core.text,
    detailBusiness: core.runtimeBusiness || core.detailBusiness || ""
  });
  const coreFront = `<article class="capability-mindmap-core" data-capability-node data-node-id="core" data-node-label="${attr(core.label)}" data-node-title="${attr(core.title || "ALUX Runtime")}" data-node-detail="${attr(core.text)}" data-node-items="${attr(JSON.stringify(coreItems))}" data-runtime-label="${attr(core.runtimeLabel || core.label)}" data-runtime-title="${attr(core.runtimeTitle || core.title || "ALUX Runtime")}" data-runtime-technical="${attr(core.runtimeTechnical || core.text)}" data-runtime-business="${attr(core.runtimeBusiness || "")}" aria-pressed="false" aria-expanded="false" tabindex="0"><div class="capability-card-shell"><div class="capability-card-face capability-card-face--front"><span class="capability-mindmap-label">${core.label || ""}</span><strong>${core.title || "ALUX Runtime"}</strong>${coreText}</div>${coreBack}</div></article>`;
  const outcomeFront = showOutcomeNode
    ? `<article class="capability-mindmap-outcome" data-capability-node data-node-id="outcome" data-node-label="${attr(outcome.label)}" data-node-title="${attr(outcome.title)}" data-node-detail="${attr(outcome.text)}" data-node-items="${attr(JSON.stringify(outcomeItems))}" data-runtime-label="${attr(outcome.runtimeLabel || outcome.label)}" data-runtime-title="${attr(outcome.runtimeTitle || outcome.title)}" data-runtime-technical="${attr(outcome.runtimeTechnical || outcome.text)}" data-runtime-business="${attr(outcome.runtimeBusiness || "")}" aria-pressed="false" aria-expanded="false" tabindex="0"><div class="capability-card-shell"><div class="capability-card-face capability-card-face--front"><span class="capability-mindmap-label">${outcome.label || ""}</span><h3>${outcome.title || ""}</h3>${outcomeChips ? `<ul>${outcomeChips}</ul>` : ""}</div>${renderBackFace({ ...outcome, items: outcomeItems })}</div></article>`
    : "";

  return `<section class="section fade-in capability-map-section"><article class="content-card capability-map-panel"><div class="capability-map-heading">${headingBlock}</div><div class="capability-map-body"><div class="capability-mindmap-viewport" tabindex="0" role="group" aria-label="${escapeAttr(ariaLabel)}"><div class="capability-combination-templates" hidden>${comboTemplates}</div><div class="capability-mindmap-canvas"><svg class="capability-mindmap-lines" viewBox="0 0 1040 740" preserveAspectRatio="none" aria-hidden="true">${linkPaths}</svg><div class="capability-composer" aria-live="polite"><span data-composer-label>${comboLabel}</span><strong data-composer-title>${comboTitle}</strong><p data-composer-technical>${comboDefault}</p><p data-composer-business>${inspectorDefault}</p></div>${nodeData.map(renderNode).join("")}${coreFront}${outcomeFront}</div></div></div></article></section>`;
}

function renderHomeArchitectureSection(section) {
  const architecture = section.architecture || {};
  const world = architecture.world || {};
  const runtime = architecture.runtime || {};
  const infrastructure = architecture.infrastructure || {};
  const labels = getInlineUiLabels();
  const stripBreaks = (value = "") => String(value).replace(/<br\s*\/?>/gi, " ");
  const renderInfrastructureIcon = (kind) => {
    const icons = {
      blockchain: `<svg viewBox="0 0 96 64" role="presentation" focusable="false"><path class="architecture-icon-link" d="M24 35H72M36 22l12 13 12-13"/><g transform="translate(12 27)"><path class="architecture-icon-top" d="M0 7 12 0l12 7-12 7Z"/><path class="architecture-icon-front" d="m0 7 12 7v13L0 20Z"/><path class="architecture-icon-side" d="m24 7-12 7v13l12-7Z"/></g><g transform="translate(36 10)"><path class="architecture-icon-top" d="M0 7 12 0l12 7-12 7Z"/><path class="architecture-icon-front" d="m0 7 12 7v13L0 20Z"/><path class="architecture-icon-side" d="m24 7-12 7v13l12-7Z"/></g><g transform="translate(60 27)"><path class="architecture-icon-top" d="M0 7 12 0l12 7-12 7Z"/><path class="architecture-icon-front" d="m0 7 12 7v13L0 20Z"/><path class="architecture-icon-side" d="m24 7-12 7v13l12-7Z"/></g></svg>`,
      cloud: `<svg viewBox="0 0 96 64" role="presentation" focusable="false"><g transform="translate(10 7)"><rect class="architecture-icon-shadow" x="9" y="8" width="62" height="43" rx="11"/><rect class="architecture-icon-server" x="6" y="3" width="62" height="18" rx="7"/><path class="architecture-icon-highlight" d="M16 8h35"/><circle class="architecture-icon-signal" cx="58" cy="12" r="2.8"/><rect class="architecture-icon-server architecture-icon-server--lower" x="6" y="27" width="62" height="18" rx="7"/><path class="architecture-icon-highlight" d="M16 32h35"/><circle class="architecture-icon-signal" cx="58" cy="36" r="2.8"/><path class="architecture-icon-foot" d="M25 47h24l5 6H20Z"/></g></svg>`,
      devices: `<svg viewBox="0 0 96 64" role="presentation" focusable="false"><g transform="translate(8 6)"><rect class="architecture-icon-screen" x="4" y="3" width="54" height="37" rx="7"/><rect class="architecture-icon-screen-inner" x="9" y="8" width="44" height="27" rx="4"/><path class="architecture-icon-base" d="M0 42h62l-7 8H8Z"/><path class="architecture-icon-highlight" d="M17 46h28"/><rect class="architecture-icon-phone" x="61" y="13" width="19" height="37" rx="6"/><rect class="architecture-icon-screen-inner" x="65" y="18" width="11" height="23" rx="3"/><circle class="architecture-icon-signal" cx="70.5" cy="45.5" r="1.8"/></g></svg>`
    };
    return `<span class="architecture-infra-icon architecture-infra-icon--${kind}" aria-hidden="true">${icons[kind] || icons.cloud}</span>`;
  };
  const overviewCards = [
    {
      key: "world",
      label: world.label,
      title: world.title,
      text: (world.items || []).map(stripBreaks).join(" / ")
    },
    {
      key: "runtime",
      label: runtime.label,
      title: runtime.title,
      text: [runtime.vm, ...(runtime.controls || [])].map(stripBreaks).join(" / ")
    },
    {
      key: "infra",
      label: infrastructure.label,
      title: infrastructure.title,
      text: (infrastructure.groups || []).map(([title]) => stripBreaks(title)).join(" / ")
    }
  ].map((item) => `<article class="architecture-overview-card architecture-overview-card--${item.key}"><span>${item.label}</span><h3>${item.title}</h3><p>${item.text}</p></article>`).join("");
  const worldItems = (world.items || []).map((item) => `<article class="architecture-box architecture-box--world">${item}</article>`).join("");
  const runtimeLanes = (runtime.controls || []).map((item, index) => `<article class="architecture-runtime-lane"><article class="architecture-box architecture-box--control">${item}</article><span class="architecture-runtime-lane-link" aria-hidden="true"></span><article class="architecture-tvm-node"><strong>${runtime.tvms?.[index] || labels.tvm}</strong><span></span></article></article>`).join("");
  const infraGroups = (infrastructure.groups || []).map(([title, label], groupIndex) => {
    const kind = ["blockchain", "cloud", "devices"][groupIndex] || "cloud";
    const machine = (machineIndex) => `<article class="architecture-machine" aria-label="${escapeAttribute(`${labels.machine} ${machineIndex + 1}`)}"><span aria-hidden="true">${String(machineIndex + 1).padStart(2, "0")}</span><small>${labels.tvm}</small></article>`;
    const moreMachines = `<span class="architecture-machine-more" aria-hidden="true"><i></i><i></i><i></i></span>`;
    return `<article class="architecture-infra-group architecture-infra-group--${kind}"><div class="architecture-infra-heading">${renderInfrastructureIcon(kind)}<div class="architecture-infra-copy"><span>${title}</span><h4>${label}</h4></div></div><div class="architecture-machine-row">${machine(0)}${machine(1)}${machine(2)}${moreMachines}</div></article>`;
  }).join("");
  const introParagraphs = splitHtmlParagraphs(section.text);
  const renderIntroParagraph = (paragraph, index) => {
    if (index !== 0) return `<p>${paragraph}</p>`;
    const semanticLines = String(paragraph).match(/^(.+?[:：])\s*(.+)$/);
    if (!semanticLines) return `<p>${paragraph}</p>`;
    return `<p class="home-architecture-definition"><span class="architecture-intro-line architecture-intro-line--definition">${semanticLines[1]}</span><span class="architecture-intro-line architecture-intro-line--layers">${semanticLines[2]}</span></p>`;
  };
  const introDensityClass = introParagraphs.length > 2 ? " home-architecture-intro--dense" : "";
  const introTitle = String(section.title || "")
    .split(/<br\s*\/?\s*>/i)
    .filter(Boolean)
    .map((line) => `<span>${line}</span>`)
    .join("");
  const introCopy = `<div class="home-architecture-copy">${introParagraphs.map(renderIntroParagraph).join("")}</div>`;
  const intro = `<div class="home-architecture-head"><div class="home-architecture-intro${introDensityClass}"><h2>${introTitle}</h2>${introCopy}</div><div class="architecture-overview" aria-label="Architecture layers overview">${overviewCards}</div></div>`;

  return `<section class="section fade-in home-architecture-section"><article class="content-card home-architecture-panel">${intro}<div class="architecture-diagram" aria-label="ALUX layered architecture"><section class="architecture-diagram-layer architecture-diagram-layer--world"><h3><span>${world.label} :</span> ${world.title}</h3><svg class="architecture-lines architecture-lines--world" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path d="M190 208 V244 H810 V208" /></svg><div class="architecture-world-row">${worldItems}</div></section><div class="architecture-layer-flow architecture-layer-flow--violet" aria-hidden="true"></div><section class="architecture-diagram-layer architecture-diagram-layer--runtime"><h3><span>${runtime.label} :</span> ${runtime.title}</h3><article class="architecture-world-vm">${runtime.vm}</article><svg class="architecture-runtime-branches" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="M500 0 L150 100" /><path d="M500 0 V100" /><path d="M500 0 L850 100" /></svg><div class="architecture-runtime-lanes">${runtimeLanes}</div><p class="architecture-caption">${runtime.caption}</p></section><div class="architecture-layer-flow architecture-layer-flow--green" aria-hidden="true"></div><section class="architecture-diagram-layer architecture-diagram-layer--infra"><h3><span>${infrastructure.label} :</span> ${infrastructure.title}</h3><svg class="architecture-infra-branches" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path d="M500 0 V14 M166.667 14 H833.333 M166.667 14 V40 M500 14 V40 M833.333 14 V40" /></svg><div class="architecture-infra-grid">${infraGroups}</div></section></div></article></section>`;
}

function renderHomeManifestoSection(section) {
  const labels = getInlineUiLabels();
  const paragraphs = splitHtmlParagraphs(section.text);
  const isCapabilityFlow = /OpenClaw/i.test(section.text || "")
    && !/Our Thesis/i.test(`${section.eyebrow || ""} ${section.title || ""}`);
  const isThesis = paragraphs.length >= 5 && !isCapabilityFlow;

  if (isThesis) {
    const coreItems = paragraphs.slice(0, -1);
    const closing = paragraphs[paragraphs.length - 1] || "";
    const tags = labels.thesisTags;

    return `<section class="section fade-in manifesto-section manifesto-section--thesis"><article class="content-card manifesto-panel manifesto-panel--thesis-board"><div class="section-heading manifesto-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><div class="thesis-board">${coreItems.map((item, index) => `<article class="thesis-statement thesis-statement--${index + 1}"><div class="thesis-statement-head"><span class="thesis-statement-tag">${tags[index] || `${labels.point} ${index + 1}`}</span><span class="thesis-statement-index">${String(index + 1).padStart(2, "0")}</span></div><p>${item}</p></article>`).join("")}<article class="thesis-core-banner"><span class="thesis-core-label">${labels.coreThesis}</span><p>${closing}</p></article></div></article></section>`;
  }

  if (isCapabilityFlow) {
    const flowLabels = getCapabilityFlowLabels();
    const [lead = "", permission = "", claim = "", ...closingParts] = paragraphs;
    const closing = closingParts.join("<br><br>");
    const closedNodes = [flowLabels.apiKeys, flowLabels.platformAcls, flowLabels.privateIntegrations]
      .map((item) => `<span class="capability-flow-node">${item}</span>`)
      .join("");
    const capabilityNodes = [flowLabels.namespace, flowLabels.delegation, flowLabels.expiry, flowLabels.budget]
      .map((item) => `<span>${item}</span>`)
      .join("");
    const openNodes = [flowLabels.agents, flowLabels.apps, flowLabels.organizations]
      .map((item) => `<span class="capability-flow-node">${item}</span>`)
      .join("");

    return `<section class="section fade-in manifesto-section manifesto-section--capability"><article class="content-card manifesto-panel manifesto-panel--capability-flow"><div class="capability-flow-copy"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2>${lead ? `<p class="capability-flow-lead">${lead}</p>` : ""}</div><div class="capability-flow-visual" aria-label="${flowLabels.open}"><div class="capability-flow-column capability-flow-column--closed"><span class="capability-flow-label">${flowLabels.closed}</span>${closedNodes}</div><div class="capability-flow-bridge" aria-hidden="true"></div><div class="capability-flow-core"><span class="capability-flow-core-kicker">ALUX</span><h3>${labels.capability}</h3><div class="capability-flow-core-grid">${capabilityNodes}</div></div><div class="capability-flow-bridge" aria-hidden="true"></div><div class="capability-flow-column capability-flow-column--open"><span class="capability-flow-label">${flowLabels.openClaw}</span>${openNodes}</div></div><div class="capability-flow-notes"><article class="capability-flow-note"><span>${labels.shift}</span><p>${permission}</p></article><article class="capability-flow-note capability-flow-note--claim"><span>${flowLabels.open}</span><p>${claim}</p></article><article class="capability-flow-note capability-flow-note--closing"><span>${flowLabels.openClaw}</span><p>${closing}</p></article></div></article></section>`;
  }

  const lead = paragraphs[0] || "";
  const narrative = paragraphs.slice(1, 3);
  const claim = paragraphs[3] || "";
  const closing = paragraphs[4] || "";

  return `<section class="section fade-in manifesto-section manifesto-section--vision"><article class="content-card manifesto-panel manifesto-panel--vision-essay"><div class="section-heading manifesto-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><div class="manifesto-essay">${lead ? `<p class="manifesto-essay-lead">${lead}</p>` : ""}${narrative.map((item) => `<p class="manifesto-essay-body">${item}</p>`).join("")}${claim ? `<p class="manifesto-essay-claim">${claim}</p>` : ""}${closing ? `<p class="manifesto-essay-final">${closing}</p>` : ""}</div></article></section>`;
}

function renderAgentPrincipleSection(section) {
  const labels = getInlineUiLabels();
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : "";
  const visual = section.visual
    ? `<aside class="agent-principle-visual" aria-label="${section.visual.label}"><div class="agent-principle-visual-head"><span>${section.visual.label}</span><h3>${section.visual.title}</h3></div><div class="agent-lifecycle-mini">${section.visual.stages.map(([label, text], index) => `<article class="agent-lifecycle-mini-step agent-lifecycle-mini-step--${index + 1}"><span>${String(index + 1).padStart(2, "0")}</span><div><h4>${label}</h4><p>${text}</p></div></article>`).join("")}</div></aside>`
    : "";
  const signals = section.signals && section.signals.length
    ? `<div class="agent-principle-signal-grid">${section.signals.map((signal, index) => `<article class="agent-principle-signal agent-principle-signal--${index + 1}"><span>${signal.label}</span><strong>${signal.value}</strong><p>${signal.text}</p></article>`).join("")}</div>`
    : "";
  const claim = section.statement
    ? `<p class="agent-principle-claim">${section.statement}</p>`
    : "";
  const demands = section.showDemands !== false && section.demands && section.demands.length
    ? `<div class="agent-principle-demand-group"><span class="agent-principle-demand-label">${labels.whatAgentsNeed}</span><div class="agent-principle-demand-grid">${section.demands.map((item, index) => {
        const demand = typeof item === "string" ? { title: item, text: "" } : item;
        return `<article class="agent-principle-demand-card${index === 0 ? " agent-principle-demand-card--lead" : ""}"><span class="agent-principle-demand-card-tag">${String(index + 1).padStart(2, "0")}</span><h3>${demand.title}</h3>${demand.text ? `<p>${demand.text}</p>` : ""}</article>`;
      }).join("")}</div></div>`
    : "";
  const footnote = section.footnote
    ? `<div class="agent-principle-footnote"><p>${section.footnote}</p></div>`
    : "";
  const board = demands || footnote
    ? `<div class="agent-principle-board">${demands}${footnote}</div>`
    : "";

  return `<section class="section fade-in agent-principle-section" id="agent-overview"><div class="agent-principle-hero"><div class="section-heading agent-principle-heading">${eyebrow}<h1 class="agent-principle-title">${section.title}</h1><p class="agent-principle-intro">${section.text}</p>${claim}</div>${visual}</div>${signals}${board}</section>`;
}

function renderAgentMachineStatement(value) {
  const text = String(value || "").trim();
  const sentences = text.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g);
  if (!sentences || sentences.length < 2) return text;
  return sentences
    .map((sentence) => `<span class="agent-machine-statement-line">${sentence.trim()}</span>`)
    .join("\n");
}

function renderAgentMachineSection(section) {
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : "";
  const intro = section.text ? `<p class="agent-machine-intro">${section.text}</p>` : "";
  const statement = section.statement ? `<p class="agent-machine-statement">${renderAgentMachineStatement(section.statement)}</p>` : "";
  const summary = intro || statement ? `<div class="agent-machine-summary">${intro}${statement}</div>` : "";
  const specLabel = section.specLabel ? `<div class="agent-machine-spec-row"><p class="agent-machine-spec-label">${section.specLabel}</p></div>` : "";
  const systems = Array.isArray(section.systems)
    ? section.systems.map((item) => {
        const key = String(item.letter || "").toLowerCase();
        const keywords = Array.isArray(item.keywords) && item.keywords.length
          ? `<p class="agent-machine-keywords">${item.keywords.join(" · ")}</p>`
          : "";
        return `<article class="agent-machine-system agent-machine-system--${key}"><span class="agent-machine-letter">${item.letter}</span><div><h3>${item.title} <em>/ ${item.role}</em></h3>${keywords}<p>${item.text}</p></div></article>`;
      }).join("")
    : "";
  const visualNodes = Array.isArray(section.systems)
    ? section.systems.map((item) => {
        const key = String(item.letter || "").toLowerCase();
        return `<span class="agent-machine-node agent-machine-node--${key}" aria-hidden="true">${item.letter}</span>`;
      }).join("")
    : "";
  const visual = section.visual
    ? `<div class="agent-machine-visual"><figure class="agent-machine-figure"><div class="agent-machine-core"><div class="agent-machine-orbit" aria-hidden="true"></div><img src="${section.visual.src}" alt="${section.visual.alt || ""}" loading="lazy">${visualNodes}</div><figcaption>${section.visual.label || ""}</figcaption></figure></div>`
    : "";

  return `<section class="section fade-in agent-machine-section" id="agent-machine"><div class="agent-machine-panel"><div class="agent-machine-copy"><div class="section-heading agent-machine-heading">${eyebrow}<h2>${section.title}</h2>${summary}</div></div>${specLabel}<div class="agent-machine-map">${systems}${visual}</div></div></section>`;
}

function renderAgentWorkflowSection(section) {
  const labels = getInlineUiLabels();
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : "";
  const intro = section.text ? `<p class="agent-workflow-intro">${section.text}</p>` : "";
  const map = section.steps && section.steps.length
    ? `<div class="agent-workflow-map" aria-label="Agent workflow lifecycle"><div class="agent-workflow-track" aria-hidden="true"></div>${section.steps.map((step, index) => `<article class="agent-workflow-stage agent-workflow-stage--${index + 1}"><span class="agent-workflow-dot"><span>${step.step || String(index + 1).padStart(2, "0")}</span></span><div class="agent-workflow-stage-copy"><h3>${step.label || step.title}</h3>${step.mini ? `<p>${step.mini}</p>` : ""}</div></article>`).join("")}</div>`
    : "";
  const steps = section.steps && section.steps.length
    ? `<div class="agent-workflow-detail-grid">${section.steps.map((step, index) => {
        const points = step.points && step.points.length
          ? `<ul class="agent-workflow-points">${step.points.map((point) => `<li>${point}</li>`).join("")}</ul>`
          : "";

        return `<article class="agent-workflow-detail agent-workflow-detail--${index + 1}"><div class="agent-workflow-detail-head"><span class="agent-workflow-step">${step.step || String(index + 1).padStart(2, "0")}</span><h3>${step.title}</h3></div><p>${step.text}</p>${points}</article>`;
      }).join("")}</div>`
    : "";
  const closing = section.closing
    ? `<div class="agent-workflow-close"><p>${section.closing}</p></div>`
    : "";

  return `<section class="section fade-in agent-workflow-section" id="agent-workflow"><div class="section-heading agent-workflow-heading">${eyebrow}<h2>${section.title}</h2>${intro}</div>${map}${steps}${closing}</section>`;
}

function renderAgentContrastSection(section) {
  const labels = getInlineUiLabels();
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : "";
  const intro = section.text ? `<p class="agent-contrast-intro">${section.text}</p>` : "";
  const headingClass = "section-heading agent-contrast-heading";
  if (Array.isArray(section.features) && section.features.length) {
    const features = section.features.map((feature, index) => {
      const flow = Array.isArray(feature.flow)
        ? feature.flow.map((label, flowIndex) => `<span class="agent-difference-node agent-difference-node--${flowIndex + 1}">${label}</span>`).join('<span class="agent-difference-link" aria-hidden="true"></span>')
        : "";
      const kind = escapeAttribute(feature.kind || `feature-${index + 1}`);
      return `<article class="agent-difference-card agent-difference-card--${kind}"><div class="agent-difference-card-head"><span class="agent-difference-index">${feature.index || String(index + 1).padStart(2, "0")}</span><h3>${feature.title}</h3></div><div class="agent-difference-flow" aria-hidden="true">${flow}</div><p>${feature.text}</p></article>`;
    }).join("");
    const statement = section.statement ? `<p class="agent-difference-statement">${section.statement}</p>` : "";
    const closing = section.closing ? `<p class="agent-difference-closing">${section.closing}</p>` : "";

    return `<section class="section fade-in agent-contrast-section agent-difference-section" id="agent-contrast"><div class="${headingClass}">${eyebrow}<h2>${section.title}</h2>${intro}${statement}</div><div class="agent-difference-grid">${features}</div>${closing}</section>`;
  }
  const rows = section.left.items.map((leftItem, index) => {
    const rightItem = section.right.items[index];
    if (!rightItem) return "";

    return `<article class="agent-pair-row"><div class="agent-pair-card agent-pair-card--current"><div class="agent-pair-head"><h3>${leftItem[0]}</h3></div><p>${leftItem[1]}</p></div><div class="agent-pair-arrow" aria-hidden="true"><span></span></div><div class="agent-pair-card agent-pair-card--future"><div class="agent-pair-head"><h3>${rightItem[0]}</h3></div><p>${rightItem[1]}</p></div></article>`;
  }).join("");

  const runtimeNodes = labels.runtimeNodes;
  const visual = `<div class="agent-visual-compare"><article class="agent-visual-card agent-visual-card--current"><div class="agent-visual-card-head"><span class="agent-visual-chip">${section.left.chip || labels.before}</span><p class="eyebrow">${section.left.eyebrow}</p><h3>${section.left.title}</h3><p>${section.left.text}</p></div><div class="agent-visual-serial" aria-hidden="true"><span class="agent-serial-step">Tx 01</span><span class="agent-serial-step">Tx 02</span><span class="agent-serial-step">Tx 03</span></div></article><div class="agent-visual-divider" aria-hidden="true"><span class="agent-visual-divider-line"></span><span class="agent-visual-divider-line"></span></div><article class="agent-visual-card agent-visual-card--future"><div class="agent-visual-card-head"><span class="agent-visual-chip">${section.right.chip || labels.after}</span><p class="eyebrow">${section.right.eyebrow}</p><h3>${section.right.title}</h3><p>${section.right.text}</p></div><div class="agent-visual-runtime" aria-hidden="true"><span class="agent-runtime-node agent-runtime-node--a">${runtimeNodes[0]}</span><span class="agent-runtime-node agent-runtime-node--b">${runtimeNodes[1]}</span><span class="agent-runtime-node agent-runtime-node--c">${runtimeNodes[2]}</span><span class="agent-runtime-node agent-runtime-node--d">${runtimeNodes[3]}</span></div></article></div>`;
  const closing = section.closing
    ? `<div class="agent-bottom-line agent-bottom-line--footer"><div class="agent-bottom-inner"><div class="agent-bottom-track"><span class="agent-bottom-pill agent-bottom-pill--current">${section.closing.before}</span><span class="agent-bottom-arrow" aria-hidden="true"></span><span class="agent-bottom-pill agent-bottom-pill--future">${section.closing.after}</span></div><p>${section.closing.text}</p></div></div>`
    : "";

  return `<section class="section fade-in agent-contrast-section" id="agent-contrast"><div class="${headingClass}">${eyebrow}<h2>${section.title}</h2>${intro}</div><div class="agent-thesis-banner"><p>${section.statement}</p></div>${visual}<div class="agent-pair-list">${rows}</div>${closing}</section>`;
}

function renderAgentLimitsSection(section) {
  const labels = getInlineUiLabels();
  const bottomLine = section.bottomLine
    ? `<div class="agent-bottom-line agent-bottom-line--compact"><div class="agent-bottom-inner"><span class="agent-bottom-label">${labels.bottomLine}</span><div class="agent-bottom-track"><span class="agent-bottom-pill agent-bottom-pill--current">${section.bottomLine.before}</span><span class="agent-bottom-arrow" aria-hidden="true"></span><span class="agent-bottom-pill agent-bottom-pill--future">${section.bottomLine.after}</span></div><p>${section.bottomLine.text}</p></div></div>`
    : "";

  return `<section class="section fade-in agent-limits-section"><div class="section-heading agent-limits-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2><p class="agent-limits-intro">${section.text}</p></div>${bottomLine}<div class="agent-limits-grid">${section.items.map(([title, text], index) => `<article class="agent-limit-card"><div class="agent-limit-head"><span class="agent-limit-chip">0${index + 1}</span><h3>${title}</h3></div><p>${text}</p></article>`).join("")}</div><div class="agent-limits-note">${section.note}</div></section>`;
}

function renderAgentInfrastructureSection(section) {
  const eyebrow = section.eyebrow ? `<p class="eyebrow">${section.eyebrow}</p>` : "";
  const figure = section.figure
    ? `<div class="agent-infra-figure"><div class="agent-infra-diagram">${section.items.map((item, index) => `<span class="agent-infra-orbit agent-infra-orbit--${index + 1}">${item.kicker || item.title}</span>`).join("")}<div class="agent-infra-core"><div class="agent-infra-core-copy"><span class="agent-infra-core-label">${section.figure.label}</span><h3>${section.figure.title}</h3><p>${section.figure.text}</p></div></div></div></div>`
    : "";
  const cards = section.items.map((item, index) => {
    const entry = Array.isArray(item)
      ? { title: item[0], text: item[1], points: item[2] || [] }
      : item;
    const points = entry.points && entry.points.length
      ? `<ul class="agent-infra-points">${entry.points.map((point) => `<li>${point}</li>`).join("")}</ul>`
      : "";

    return `<article class="agent-infra-card agent-infra-card--${index + 1}"><div class="agent-infra-head"><span class="agent-infra-chip">${entry.kicker || `0${index + 1}`}</span><h3>${entry.title}</h3></div><p>${entry.text}</p>${points}</article>`;
  }).join("");

  return `<section class="section fade-in agent-infra-section" id="agent-infrastructure"><div class="section-heading agent-infra-heading">${eyebrow}<h2>${section.title}</h2><p class="agent-infra-intro">${section.text}</p></div>${figure}<div class="agent-infra-grid">${cards}</div><div class="agent-infra-outro">${section.outro}</div></section>`;
}

// Team LEGO-style minifig avatars.
// Design spec, geometry constants, color rules, and the guide for adding a
// new team member: assets/team/README.md (read it before editing).
// Per-member colors are CSS variables in styles.css (search "--lego-skin").
// Finalized static exports live in assets/team/*.svg — re-export after changes.
function renderTeamPortrait(member, index) {
  const portraitKey = member.portrait || "default";
  const initials = member.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const LEGO_YELLOW = "var(--lego-skin)";
  const INK = "#26364a";
  const CREAM = "#fffaf3";
  const LAPTOP_LID = "#34404e";
  const LAPTOP_BASE = "#4a5768";
  const legoBrick = (x, y, w, h, fill, opacity) => {
    const studW = 8;
    const gap = 4;
    const count = Math.max(1, Math.floor((w - gap) / (studW + gap)));
    let sx = x + (w - (count * studW + (count - 1) * gap)) / 2;
    let studs = "";
    for (let i = 0; i < count; i += 1) {
      studs += `<rect x="${sx}" y="${y - 4}" width="${studW}" height="4.5" rx="1.4" fill="${fill}" opacity="${opacity}" />`;
      sx += studW + gap;
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="${fill}" opacity="${opacity}" />${studs}`;
  };
  const lidPrints = {
    frank: `<g fill="var(--lego-print)" opacity="0.95"><rect x="98" y="108" width="11" height="6.5" rx="1.5" /><rect x="111" y="108" width="11" height="6.5" rx="1.5" /><rect x="104.5" y="116.5" width="11" height="6.5" rx="1.5" /></g>`,
    tomislav: `<text x="110" y="117" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="10.5" font-weight="700" fill="var(--lego-print)">C64</text>`,
    tom: `<g stroke="var(--lego-print)" stroke-width="1.6" fill="none" opacity="0.95"><path d="M105 113.5 L115 108.5 M105 113.5 L115 118.5" /></g><g fill="var(--lego-print)" opacity="0.95"><circle cx="105" cy="113.5" r="2.6" /><circle cx="115" cy="108.5" r="2.6" /><circle cx="115" cy="118.5" r="2.6" /></g>`,
    ben: `<text x="102" y="117" font-family="'IBM Plex Mono', monospace" font-size="10.5" font-weight="700" fill="var(--lego-print)">&gt;_</text>`
  };
  const preLaptop = "";
  const headAccessories = {
    frank: `
      <path d="M87 55 C88 42 98 37 110 37 C122 37 132 42 133 55 L133 57 C127 50.5 93 50.5 87 57 Z" fill="#1f1a15" />
      <g fill="none" stroke="${INK}" stroke-width="1.9"><rect x="92.5" y="60" width="16" height="9.5" rx="2" /><rect x="111.5" y="60" width="16" height="9.5" rx="2" /><path d="M108.5 64 L111.5 64 M92.5 63 L87 61.5 M127.5 63 L133 61.5" /></g>`,
    tomislav: `
      <path d="M92 67 C92 87 128 87 128 67 L128 71 C128 84 120 88.5 110 88.5 C100 88.5 92 84 92 71 Z" fill="#8e9299" />
      <path d="M100 71.5 C104 68.5 116 68.5 120 71.5 C116 74.5 104 74.5 100 71.5 Z" fill="#8e9299" />
      <path d="M106 77.5 C108 79 112 79 114 77.5" stroke="#4a4640" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M96 58 L106 58 M114 58 L124 58" stroke="#3a352e" stroke-width="2.8" stroke-linecap="round" />
      <circle cx="110" cy="29.5" r="6.2" fill="#3b342b" />
      <g stroke="#57503f" stroke-width="1.2" stroke-linecap="round" opacity="0.9"><path d="M106.5 27 L108 29.5 M111 25.5 L111.5 28.5 M114 28.5 L112.5 30.5 M107 32 L109 31.5" /></g>
      <path d="M84 57 C81.5 26.5 138.5 26.5 136 57 L136 59 L84 59 Z" fill="#23201c" />
      <rect x="84" y="55" width="52" height="7" rx="3.5" fill="#332e27" />
      <g stroke="${CREAM}" stroke-width="1.4" stroke-linecap="round" opacity="0.75"><path d="M93 41.5 L96.6 45.1 M96.6 41.5 L93 45.1" /><path d="M108.2 36.5 L111.8 40.1 M111.8 36.5 L108.2 40.1" /><path d="M123.4 41.5 L127 45.1 M127 41.5 L123.4 45.1" /></g>
      <rect x="84.5" y="61" width="7" height="15" rx="3.5" fill="#23201c" />
      <rect x="128.5" y="61" width="7" height="15" rx="3.5" fill="#23201c" />`,
    tom: `
      <path d="M87.5 73.5 C85.5 70 85 66 85.8 59 C85.5 35 134.5 35 134.2 59 C135 66 134.5 70 132.5 73.5 L130 63 C127.5 56 122.5 57.5 117 54.5 C110.5 51.5 102.5 53 97 55 C94 56 91.5 57.5 90 63 Z" fill="#3d4348" />
      <path d="M97 52 L99.5 47 M107 51 L109.5 46 M117 52 L119.5 47 M92 54 L94 49.5 M126 54 L128 49.5" stroke="#666e76" stroke-width="1.4" fill="none" stroke-linecap="round" />`,
    ben: `
      <path d="M90 47 L95 36 L99 42 L104 33 L109 41 L113 32 L118 40 L123 35 L127 45 L128 50 L91 50 Z" fill="#181a1e" />
      <path d="M87 55 C88 44 98 41 110 41 C122 41 132 44 133 55 L133 58 C127 51 93 51 87 58 Z" fill="#181a1e" />
      <g fill="none" stroke="${INK}" stroke-width="1.6"><circle cx="101" cy="65" r="6.8" /><circle cx="119" cy="65" r="6.8" /><path d="M107.8 65 L112.2 65 M94.2 63.5 L88 61.5 M125.8 63.5 L132 61.5" /></g>
      <path d="M105 77.5 L115 77.5" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none" />`
  };
  const smiles = {
    frank: `<path d="M98 73.5 C102 80.5 118 80.5 122 73.5" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" />`,
    tom: `<path d="M103 77 C106 79.5 114 79.5 117 77" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" />`
  };
  const smile = smiles[portraitKey] || "";

  const figure = `
    ${legoBrick(30, 70, 28, 13, "var(--portrait-a)", 0.45)}
    ${legoBrick(164, 116, 26, 12, "var(--portrait-b)", 0.5)}
    ${legoBrick(34, 190, 152, 14, "#a67951", 0.9)}
    <rect x="85" y="142" width="50" height="11" rx="2" fill="var(--lego-hip)" />
    <rect x="87" y="153" width="22" height="37" rx="2" fill="var(--lego-legs)" />
    <rect x="111" y="153" width="22" height="37" rx="2" fill="var(--lego-legs)" />
    <path d="M83 96 L137 96 L143 142 L77 142 Z" fill="var(--lego-torso)" />
    <rect x="101" y="88" width="18" height="8" fill="${LEGO_YELLOW}" />
    ${preLaptop}
    <rect x="85" y="128" width="50" height="6" rx="2.5" fill="var(--lego-laptop-dark)" />
    <path d="M93 102 L127 102 C129.5 102 131 103.5 131 106 L132.5 128 L87.5 128 L89 106 C89 103.5 90.5 102 93 102 Z" fill="var(--lego-laptop)" />
    <rect x="88" y="126.5" width="44" height="3" rx="1.5" fill="var(--lego-laptop-dark)" />
    ${lidPrints[portraitKey] || ""}
    <path d="M84 98 C75 103 73 113 75 124 L87 128 C85 118 86 107 91 102 Z" fill="var(--lego-torso)" />
    <path d="M136 98 C145 103 147 113 145 124 L133 128 C135 118 134 107 129 102 Z" fill="var(--lego-torso)" />
    <circle cx="87" cy="130" r="7.5" fill="${LEGO_YELLOW}" />
    <circle cx="133" cy="130" r="7.5" fill="${LEGO_YELLOW}" />
    <rect x="87" y="48" width="46" height="40" rx="10" fill="${LEGO_YELLOW}" />
    <circle cx="101" cy="65" r="2.7" fill="${INK}" /><circle cx="119" cy="65" r="2.7" fill="${INK}" />
    ${smile}
    ${headAccessories[portraitKey] || ""}`;

  return `<div class="team-portrait-wrap team-portrait-wrap--${portraitKey}"><svg class="team-portrait team-portrait--${portraitKey}" viewBox="0 0 220 220" role="img" aria-label="LEGO-style minifigure portrait for ${member.name}"><rect class="portrait-bg" x="10" y="10" width="200" height="200" rx="42" /><circle class="portrait-halo portrait-halo--one" cx="68" cy="62" r="50" /><circle class="portrait-halo portrait-halo--two" cx="154" cy="154" r="48" />${figure}</svg><span class="team-portrait-initials">${initials}</span></div>`;
}

function renderTeamLinks(member) {
  if (!member.links || !member.links.length) return "";
  return `<div class="team-links">${member.links.map(([label, href]) => `<a href="${href}" target="_blank" rel="noreferrer">${label}</a>`).join("")}</div>`;
}

function renderTeamMemberCard(member, index) {
  const handle = member.handle ? `<span class="team-handle">@${member.handle}</span>` : "";
  const signals = member.signals && member.signals.length
    ? `<div class="team-signal-list">${member.signals.map((signal) => `<span>${signal}</span>`).join("")}</div>`
    : "";
  const bio = member.bio && member.bio.length
    ? `<div class="team-bio">${member.bio.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>`
    : "";
  const highlights = member.highlights && member.highlights.length
    ? `<div class="team-highlight-list">${member.highlights.map(([title, text]) => `<div class="team-highlight-row"><h4>${title}</h4><p>${text}</p></div>`).join("")}</div>`
    : "";
  const closing = member.closing && member.closing.length
    ? `<div class="team-bio team-bio--closing">${member.closing.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>`
    : "";
  const cardClass = member.featured
    ? "team-member-card team-member-card--featured"
    : `team-member-card team-member-card--${index + 1}`;

  return `<article class="${cardClass}"><div class="team-member-visual">${renderTeamPortrait(member, index)}${signals}</div><div class="team-member-copy"><div class="team-member-head"><div><h3>${member.name}</h3>${handle}</div><p>${member.role}</p></div>${bio}${highlights}${closing}${renderTeamLinks(member)}</div></article>`;
}

function renderTeamStackRail(section) {
  if (!section.stackTags || !section.stackTags.length) return "";
  const label = section.stackLabel || "Team Stack";
  const tags = section.stackTags.map((tag) => `<span>${tag}</span>`).join("");

  return `<div class="team-stack-rail" aria-label="${label}"><span class="team-stack-label">${label}</span><div class="team-stack-tags">${tags}</div></div>`;
}

function renderTeamGridSection(section) {
  const stackRail = renderTeamStackRail(section);
  const cards = section.items.map((member, index) => renderTeamMemberCard(member, index)).join("");

  return `<section class="section fade-in team-grid-section">${stackRail}<div class="team-grid">${cards}</div></section>`;
}

function renderAluxVsNativeFigure(caption, className, ariaLabel, body, note = "") {
  const label = ariaLabel ? ` role="img" aria-label="${ariaLabel}"` : "";
  const figcaption = caption ? `<figcaption>${caption}</figcaption>` : "";
  const figureNote = note ? `<p class="alux-vs-figure-note">${note}</p>` : "";
  return `<figure class="alux-vs-native-figure ${className}"><div class="alux-vs-native-surface"${label}>${body}</div>${figcaption}${figureNote}</figure>`;
}

function renderStateTransitionDiagram(diagrams, caption, note) {
  const state = (diagrams && diagrams.state) || {};
  const body = `
    <div class="alux-vs-original-image alux-vs-original-image--state">
      <img src="assets/alux-vs-others/state-transitions-page-crop-transparent.png" alt="" width="2070" height="910" loading="lazy">
    </div>
  `;
  return renderAluxVsNativeFigure(caption, "alux-vs-native-figure--state", state.aria, body, note);
}

function renderTransitionTypesDiagram(diagrams, caption, note) {
  const types = (diagrams && diagrams.types) || {};
  return renderAluxVsNativeFigure(caption, "alux-vs-native-figure--types", types.aria, `<div class="alux-vs-original-image alux-vs-original-image--types"><img src="assets/alux-vs-others/transition-types-transparent.png" alt="" width="3634" height="1353" loading="lazy"></div>`, note);
}

function renderCompositeRuntimeDiagram(diagrams, caption, note) {
  const composite = (diagrams && diagrams.composite) || {};
  const body = `
    <div class="alux-vs-original-image alux-vs-original-image--composite">
      <img src="assets/alux-vs-others/composite-transitions-transparent.png" alt="" width="1570" height="1762" loading="lazy">
    </div>
  `;
  return renderAluxVsNativeFigure(caption, "alux-vs-native-figure--composite", composite.aria, body, note);
}

function renderAluxVsOthersCapability(block, index) {
  const labels = ["Parallel", "Concurrent", "Composite"];
  const label = block.shortLabel || block.label || labels[index] || block.heading.replace(/:$/, "");
  return `<article class="alux-vs-capability alux-vs-capability--${index + 1}"><span>${label}</span><div><h3>${block.heading.replace(/:$/, "")}</h3><p>${block.text}</p></div></article>`;
}

function renderGlvmPage(page) {
  const heroSignals = (page.hero.signals || [])
    .map(([label, value]) => `<div class="glvm-signal"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  const comparison = (page.definition.comparison || [])
    .map((item) => `
      <article class="glvm-comparison-card glvm-comparison-card--${item.label.toLowerCase()}">
        <div class="glvm-comparison-heading"><span>${item.label}</span><h3>${item.title}</h3></div>
        <p>${item.text}</p>
        <strong>${item.note}</strong>
      </article>
    `)
    .join("");
  const axes = (page.definition.axis || [])
    .map(([label, value]) => `<div class="glvm-axis-row"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  const layers = Array.isArray(page.architecture.layers) ? page.architecture.layers : [];
  const activeLayer = layers.find((layer) => layer.id === "runtime") || layers[0] || {};
  const layerButtons = layers
    .map((layer) => `
      <button class="glvm-layer glvm-layer--${escapeAttribute(layer.id)}${layer.id === activeLayer.id ? " is-active" : ""}" type="button" data-glvm-layer="${escapeAttribute(layer.id)}" data-layer-title="${escapeAttribute(layer.title)}" data-layer-text="${escapeAttribute(layer.text)}" data-layer-status="${escapeAttribute(layer.status)}" aria-pressed="${layer.id === activeLayer.id ? "true" : "false"}">
        <span class="glvm-layer-index">${layer.index}</span>
        <span class="glvm-layer-label">${layer.label}</span>
        <strong>${layer.title}</strong>
        <span class="glvm-layer-status">${layer.status}</span>
        <span class="glvm-layer-items">${(layer.items || []).map((item) => `<i>${item}</i>`).join("")}</span>
      </button>
    `)
    .join("");
  const layerInspectorItems = (activeLayer.items || []).map((item) => `<li>${item}</li>`).join("");

  const journey = page.journey || {};
  const railLabels = Array.isArray(journey.railLabels) ? journey.railLabels : ["Replay", "Commit"];
  const routes = Array.isArray(journey.routes) ? journey.routes : [];
  const activeRoute = routes[0] || {};
  const routeButtons = routes
    .map((route, index) => `
      <button class="glvm-route-button${index === 0 ? " is-active" : ""}" type="button" data-glvm-route="${escapeAttribute(route.id)}" data-route-title="${escapeAttribute(route.title)}" data-route-text="${escapeAttribute(route.text)}" data-route-status="${escapeAttribute(route.status)}" aria-pressed="${index === 0 ? "true" : "false"}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${route.label}</strong>
      </button>
    `)
    .join("");
  const routeNodes = routes
    .map((route) => `
      <div class="glvm-substrate glvm-substrate--${escapeAttribute(route.id)}${route.id === activeRoute.id ? " is-active" : ""}" data-glvm-route-node="${escapeAttribute(route.id)}">
        <span class="glvm-substrate-icon" aria-hidden="true"></span>
        <strong>${route.title}</strong>
        <small>${route.status}</small>
      </div>
    `)
    .join("");
  const journeySteps = (journey.steps || [])
    .map((step, index) => `
      <article class="glvm-journey-step${index === 0 ? " is-current" : ""}" data-glvm-step-card="${index + 1}">
        <span>${step.label}</span><h3>${step.title}</h3><p>${step.text}</p>
      </article>
    `)
    .join("");
  const journeyMessages = escapeAttribute(JSON.stringify(journey.messages || []));

  const stackGlyphs = [
    `<svg viewBox="0 0 120 72" aria-hidden="true"><path class="glvm-glyph-flow" d="M31 36h20m18 0h20"/><path d="M20 23l-8 13 8 13M32 23l8 13-8 13"/><circle class="glvm-glyph-pulse" cx="60" cy="36" r="12"/><rect x="90" y="22" width="20" height="28" rx="4"/><path d="M95 31h10M95 37h10M95 43h7"/></svg>`,
    `<svg viewBox="0 0 120 72" aria-hidden="true"><path class="glvm-glyph-flow" d="M18 18l32 18-32 18M70 36h32"/><circle cx="16" cy="18" r="5"/><circle cx="16" cy="54" r="5"/><rect class="glvm-glyph-pulse" x="49" y="25" width="22" height="22" rx="6"/><circle cx="104" cy="36" r="6"/></svg>`,
    `<svg viewBox="0 0 120 72" aria-hidden="true"><rect x="9" y="9" width="102" height="54" rx="13"/><path class="glvm-glyph-flow" d="M25 36h22m27 0h21"/><path d="M60 20l15 9v17l-15 9-15-9V29zM45 29l15 9 15-9M60 38v17"/><circle class="glvm-glyph-pulse" cx="99" cy="36" r="5"/></svg>`,
    `<svg class="is-planned" viewBox="0 0 120 72" aria-hidden="true"><rect x="9" y="9" width="102" height="54" rx="13"/><path class="glvm-glyph-flow" d="M22 36h24m28 0h24"/><path d="M60 19l16 9v18l-16 9-16-9V28zM44 28l16 10 16-10M60 38v17"/><circle cx="101" cy="36" r="5"/></svg>`,
    `<svg viewBox="0 0 120 72" aria-hidden="true"><path class="glvm-glyph-flow" d="M21 48C9 23 34 11 55 21c17 8 13 27 30 30 10 2 18-3 23-11"/><path d="M20 39l1 10 10-2M101 34l7 6-6 7"/><circle cx="55" cy="21" r="6"/><circle class="glvm-glyph-pulse" cx="85" cy="51" r="6"/></svg>`,
    `<svg viewBox="0 0 120 72" aria-hidden="true"><path class="glvm-glyph-flow" d="M16 18l31 18-31 18M47 36l28-18m-28 18 28 18M75 18l29 18-29 18"/><circle cx="16" cy="18" r="5"/><circle cx="16" cy="54" r="5"/><circle cx="47" cy="36" r="6"/><circle cx="75" cy="18" r="5"/><circle cx="75" cy="54" r="5"/><rect class="glvm-glyph-pulse" x="98" y="29" width="13" height="14" rx="3"/></svg>`
  ];

  const stackItems = (page.stack.items || [])
    .map((item, index) => `
      <li class="glvm-stack-item" data-stack-index="${index}" data-stack-state="${index === 3 ? "planned" : "current"}" data-stack-status="${escapeAttribute(item.status.toLowerCase())}">
        <span class="glvm-stack-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="glvm-stack-label"><span>${item.label}</span><strong>${item.status}</strong></div>
        <div class="glvm-stack-glyph">${stackGlyphs[index] || stackGlyphs[0]}</div>
        <div class="glvm-stack-copy"><h3>${item.title}</h3><p>${item.text}</p></div>
      </li>
    `)
    .join("");
  const stackFlow = (page.stack.items || [])
    .map((item, index) => `
      <button type="button" class="glvm-stack-flow-node" data-stack-index="${index}" data-flow-state="${index === 3 ? "planned" : "current"}" data-flow-status="${escapeAttribute(item.status.toLowerCase())}" aria-pressed="${index === 0 ? "true" : "false"}" aria-label="${escapeAttribute(`${item.label}: ${item.title}`)}">
        <span>${String(index + 1).padStart(2, "0")}</span><strong>${item.label}</strong><small>${item.status}</small>
      </button>
    `)
    .join("");
  const statusGroups = (page.status.groups || [])
    .map((group) => `
      <article class="glvm-status-group glvm-status-group--${escapeAttribute(group.tone)}">
        <h3><span aria-hidden="true"></span>${group.label}</h3>
        <ul>${(group.items || []).map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `)
    .join("");
  const statusSummary = (page.status.groups || [])
    .map((group) => `
      <div class="glvm-status-summary-item glvm-status-summary-item--${escapeAttribute(group.tone)}" aria-label="${escapeAttribute(`${group.label}: ${(group.items || []).length}`)}">
        <span>${String((group.items || []).length).padStart(2, "0")}</span>
        <small>${group.label}</small>
      </div>
    `)
    .join("");
  const closeLinks = page.close && Array.isArray(page.close.links)
    ? page.close.links
      .slice(0, 2)
      .map(([label, href], index) => `
        <a class="glvm-next-link glvm-next-link--${index === 0 ? "primary" : "secondary"}" href="${escapeAttribute(href)}">
          <span class="glvm-next-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <span class="glvm-next-label">${label}</span>
          <span class="glvm-next-arrow" aria-hidden="true"></span>
        </a>
      `)
      .join("")
    : "";
  const closeSection = page.close && closeLinks ? `
    <section class="glvm-next fade-in" aria-labelledby="glvm-next-title">
      <div class="glvm-next-copy">
        <p class="eyebrow">${page.close.eyebrow}</p>
        <h2 id="glvm-next-title">${page.close.title}</h2>
      </div>
      <nav class="glvm-next-links" aria-labelledby="glvm-next-title">${closeLinks}</nav>
    </section>
  ` : "";
  return `
    <article class="glvm-page" data-glvm-root data-glvm-step="0">
      <header class="glvm-hero fade-in">
        <div class="glvm-hero-copy">
          <p class="eyebrow">${page.hero.eyebrow}</p>
          <h1>${page.hero.title}</h1>
          <p class="glvm-full-name">${page.hero.fullName}</p>
          <p class="glvm-tagline">${page.hero.tagline}</p>
          <p class="glvm-hero-text">${page.hero.text}</p>
        </div>
        <figure class="glvm-hero-visual">
          <div class="glvm-hero-media">
            <img src="${escapeAttribute(page.hero.visual.poster)}" alt="" aria-hidden="true" class="glvm-hero-poster">
            <video muted loop autoplay playsinline preload="metadata" poster="${escapeAttribute(page.hero.visual.poster)}" aria-label="${escapeAttribute(page.hero.visual.alt)}" data-glvm-video>
              <source src="${escapeAttribute(page.hero.visual.video)}" type="video/mp4">
            </video>
            <div class="glvm-hero-overlay" aria-hidden="true"><span></span><span></span><span></span></div>
          </div>
        </figure>
        <div class="glvm-hero-signals">${heroSignals}</div>
      </header>

      <section class="glvm-definition fade-in">
        <div class="section-heading glvm-section-heading">
          <p class="eyebrow">${page.definition.eyebrow}</p>
          <h2>${page.definition.title}</h2>
          <p>${page.definition.text}</p>
        </div>
        <div class="glvm-comparison">${comparison}</div>
        <div class="glvm-axis">${axes}</div>
      </section>

      <section class="glvm-architecture fade-in">
        <div class="section-heading glvm-section-heading">
          <p class="eyebrow">${page.architecture.eyebrow}</p>
          <h2>${page.architecture.title}</h2>
          <p>${page.architecture.text}</p>
        </div>
        <div class="glvm-architecture-stage">
          <div class="glvm-layer-stack" role="group" aria-label="${escapeAttribute(page.architecture.title)}">${layerButtons}</div>
          <aside class="glvm-layer-inspector" aria-live="polite">
            <span data-glvm-layer-status>${activeLayer.status || ""}</span>
            <h3 data-glvm-layer-title>${activeLayer.title || ""}</h3>
            <p data-glvm-layer-text>${activeLayer.text || ""}</p>
            <ul data-glvm-layer-items>${layerInspectorItems}</ul>
          </aside>
        </div>
      </section>

      <section class="glvm-journey fade-in">
        <div class="section-heading glvm-section-heading">
          <p class="eyebrow">${journey.eyebrow}</p>
          <h2>${journey.title}</h2>
          <p>${journey.text}</p>
        </div>
        <div class="glvm-route-toolbar"><span>${journey.routeLabel}</span><div>${routeButtons}</div></div>
        <div class="glvm-journey-board" data-glvm-journey data-journey-messages="${journeyMessages}">
          <div class="glvm-route-map" aria-hidden="true">
            <div class="glvm-route-lines"><span></span><span></span><span></span></div>
            ${routeNodes}
            <div class="glvm-route-core"><span>GLVM</span><strong>TVM × N</strong><i></i></div>
            <div class="glvm-route-packet glvm-route-packet--one"></div>
            <div class="glvm-route-packet glvm-route-packet--two"></div>
            <div class="glvm-route-packet glvm-route-packet--three"></div>
            <div class="glvm-commit-rail"><span>${railLabels[0]}</span><i></i><span>${railLabels[1]}</span></div>
          </div>
          <div class="glvm-route-detail" aria-live="polite">
            <span data-glvm-route-status>${activeRoute.status || ""}</span>
            <h3 data-glvm-route-title>${activeRoute.title || ""}</h3>
            <p data-glvm-route-text>${activeRoute.text || ""}</p>
          </div>
          <div class="glvm-journey-control">
            <div><span>${journey.playLabel}</span><strong data-glvm-progress>0 / ${journey.steps.length}</strong></div>
            <div><button type="button" data-glvm-action="play">${journey.actions.play}</button><button type="button" data-glvm-action="reset">${journey.actions.reset}</button></div>
            <p data-glvm-message aria-live="polite">${(journey.messages || [""])[0]}</p>
          </div>
          <div class="glvm-journey-steps">${journeySteps}</div>
        </div>
      </section>

      <section class="glvm-stack fade-in">
        <div class="section-heading glvm-section-heading">
          <p class="eyebrow">${page.stack.eyebrow}</p>
          <h2>${page.stack.title}</h2>
          <p>${page.stack.text}</p>
        </div>
        <div class="glvm-stack-flow" aria-label="${escapeAttribute(page.stack.title)}">${stackFlow}</div>
        <ol class="glvm-stack-list">${stackItems}</ol>
      </section>

      <section class="glvm-status fade-in">
        <div class="section-heading glvm-section-heading">
          <p class="eyebrow">${page.status.eyebrow}</p>
          <h2>${page.status.title}</h2>
          <div class="glvm-status-intro">
            <p>${page.status.text}</p>
            <div class="glvm-status-summary" aria-hidden="true">${statusSummary}</div>
          </div>
        </div>
        <div class="glvm-status-grid">${statusGroups}</div>
      </section>

      ${closeSection}
    </article>
  `;
}

function renderParallelConcurrentComposablePage(page) {
  const modes = Array.isArray(page.modes) ? page.modes : [];
  const activeMode = modes[0] || {};
  const factLabels = {
    what: "What it means",
    how: "How ALUX does it",
    enables: "What it enables",
    ...(page.factLabels || {})
  };
  const heroSignals = (page.hero.signals || [])
    .map(([label, value]) => `<div class="pcc-signal"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  const modeButtons = modes
    .map((mode, index) => `<button class="pcc-mode-button${index === 0 ? " is-active" : ""}" type="button" data-pcc-mode="${escapeAttribute(mode.id)}" aria-pressed="${index === 0 ? "true" : "false"}"><span>${String(index + 1).padStart(2, "0")}</span> ${mode.label}</button>`)
    .join("");
  const visuals = modes
    .map((mode, index) => `
      <figure class="pcc-mode-visual${index === 0 ? " is-active" : ""}" data-pcc-visual="${escapeAttribute(mode.id)}" aria-hidden="${index === 0 ? "false" : "true"}">
        <div class="pcc-image-frame">
          <img src="${escapeAttribute(mode.image)}" alt="${escapeAttribute(mode.alt)}" loading="${index === 0 ? "eager" : "lazy"}" data-pcc-image>
          <span class="pcc-image-fallback">${mode.alt}</span>
        </div>
        <figcaption class="pcc-mode-cue"><span>${mode.label}</span><strong>${mode.cue || mode.conclusion || ""}</strong></figcaption>
        <div class="pcc-mode-impact"><span>${factLabels.enables}</span><p>${mode.enables}</p><strong>${mode.conclusion}</strong></div>
      </figure>
    `)
    .join("");
  const panels = modes
    .map((mode, index) => `
      <article class="pcc-mode-panel${index === 0 ? " is-active" : ""}" data-pcc-panel="${escapeAttribute(mode.id)}" aria-hidden="${index === 0 ? "false" : "true"}">
        <p class="pcc-mode-kicker">${mode.label}</p>
        <h3>${mode.title}</h3>
        <dl class="pcc-mode-facts">
          <div><dt>${factLabels.what}</dt><dd>${mode.what}</dd></div>
          <div><dt>${factLabels.how}</dt><dd>${mode.how}</dd></div>
          <div class="pcc-mode-fact--transfer"><dt>${factLabels.enables}</dt><dd>${mode.enables}</dd></div>
        </dl>
        <p class="pcc-mode-conclusion pcc-mode-conclusion--transfer">${mode.conclusion}</p>
      </article>
    `)
    .join("");
  const lab = page.lab || {};
  const labLanes = (lab.lanes || [])
    .map((lane, index) => `
      <div class="pcc-lab-lane pcc-lab-lane--${index + 1}">
        <span class="pcc-lab-lane-label">${lane}</span>
        <span class="pcc-lab-rail" aria-hidden="true"></span>
        <span class="pcc-lab-pod pcc-lab-pod--${index + 1}" aria-hidden="true"><span class="pcc-lab-pod-icon"></span></span>
      </div>
    `)
    .join("");
  const labMessages = lab.messages || {};
  const labSteps = (lab.steps || [])
    .map((item) => `<article class="pcc-lab-step" data-pcc-step="${escapeAttribute(item.state || "")}"><span>${item.label}</span><strong>${item.title}</strong><p>${item.text}</p></article>`)
    .join("");
  const labBenefits = (lab.benefits || [])
    .map((item) => `<article class="pcc-lab-benefit" data-pcc-benefit="${escapeAttribute(item.state || "")}"><span>${item.label}</span><strong>${item.title}</strong><p>${item.text}</p></article>`)
    .join("");
  const checkpointWaiting = lab.checkpointWaiting || "Checkpoint";
  const checkpointDone = lab.checkpoint || checkpointWaiting;
  const foundations = page.foundations.items
    .map((item, index) => {
      const [kicker, title, text] = item.length > 2
        ? item
        : [String(index + 1).padStart(2, "0"), item[0], item[1]];
      return `<article class="pcc-foundation-item"><span>${kicker}</span><h3>${title}</h3><p>${text}</p></article>`;
    })
    .join("");
  const glvmBridge = page.glvmBridge ? `
    <section class="pcc-glvm-bridge fade-in">
      <div class="pcc-glvm-bridge-copy">
        <p class="eyebrow">${page.glvmBridge.eyebrow}</p>
        <h2>${page.glvmBridge.title}</h2>
        <p>${page.glvmBridge.text}</p>
      </div>
      <a class="button secondary pcc-glvm-bridge-link" href="${escapeAttribute(page.glvmBridge.href || "glvm.html")}">${page.glvmBridge.label}<span aria-hidden="true">→</span></a>
    </section>
  ` : "";
  const closeLinks = page.close.links
    .map(([label, href], index) => `<a class="button ${index === 0 ? "primary" : "secondary"}" href="${href}">${label}</a>`)
    .join("");
  const closePoints = (page.close.points || [])
    .map(([label, text]) => `<article class="pcc-close-point"><span>${label}</span><p>${text}</p></article>`)
    .join("");
  const introClaim = page.intro.claim ? `<p class="pcc-intro-claim">${page.intro.claim}</p>` : "";

  return `
    <article class="pcc-page" data-pcc-root data-pcc-active="${escapeAttribute(activeMode.id || "")}">
      <header class="pcc-hero fade-in">
        <div class="pcc-hero-copy">
          <p class="eyebrow">${page.hero.eyebrow}</p>
          <h1>${page.hero.title}</h1>
          <p class="pcc-hero-subtitle">${page.hero.subtitle}</p>
          <p class="pcc-hero-text">${page.hero.text}</p>
          <div class="pcc-hero-signals" aria-label="Runtime signals">${heroSignals}</div>
        </div>
        <figure class="pcc-hero-visual">
          <div class="pcc-image-frame pcc-image-frame--hero">
            <img src="${escapeAttribute(page.hero.visual.src)}" alt="${escapeAttribute(page.hero.visual.alt)}" loading="eager" fetchpriority="high" data-pcc-image>
            <span class="pcc-image-fallback">${page.hero.visual.alt}</span>
          </div>
        </figure>
      </header>

      <section class="pcc-intro-section fade-in">
        <div class="section-heading pcc-section-heading">
          <p class="eyebrow">${page.intro.eyebrow}</p>
          <h2>${page.intro.title}</h2>
          <p>${page.intro.text}</p>
          ${introClaim}
        </div>
      </section>

      <section class="pcc-mode-section fade-in" aria-label="${escapeAttribute(page.intro.title)}">
        <div class="pcc-mode-toolbar" aria-label="Runtime mode selector">${modeButtons}</div>
        <div class="pcc-mode-stage">
          <div class="pcc-mode-visuals">${visuals}</div>
          <div class="pcc-mode-copy" aria-live="polite">${panels}</div>
        </div>
      </section>

      <section class="pcc-lab-section fade-in">
        <div class="section-heading pcc-section-heading">
          <p class="eyebrow">${lab.eyebrow}</p>
          <h2>${lab.title}</h2>
          <p>${lab.text}</p>
        </div>
        <div class="pcc-lab-board" data-pcc-lab data-lab-state="idle" data-msg-idle="${escapeAttribute(labMessages.idle || "")}" data-msg-parallel="${escapeAttribute(labMessages.parallel || "")}" data-msg-paused="${escapeAttribute(labMessages.paused || "")}" data-msg-resumed="${escapeAttribute(labMessages.resumed || "")}" data-msg-settled="${escapeAttribute(labMessages.settled || "")}">
          <div class="pcc-lab-steps">${labSteps}</div>
          <div class="pcc-lab-runtime" aria-hidden="true">
            <div class="pcc-lab-lanes">${labLanes}<div class="pcc-lab-event" aria-hidden="true"><span>${lab.matchLabel || "Message matched"}</span></div></div>
            <div class="pcc-lab-checkpoint" data-pcc-lab-checkpoint data-checkpoint-idle="${escapeAttribute(checkpointWaiting)}" data-checkpoint-settled="${escapeAttribute(checkpointDone)}"><span>${checkpointWaiting}</span></div>
          </div>
          <div class="pcc-lab-side">
            <div class="pcc-lab-status">
              <span>${lab.scoreLabel}</span>
              <strong data-pcc-lab-score>0 / 4</strong>
            </div>
            ${lab.playLabel ? `<p class="pcc-lab-play-label">${lab.playLabel}</p>` : ""}
            <div class="pcc-lab-controls">
              <button type="button" data-pcc-action="parallel">${lab.actions.parallel}</button>
              <button type="button" data-pcc-action="pause" disabled>${lab.actions.pause}</button>
              <button type="button" data-pcc-action="resume" disabled>${lab.actions.resume}</button>
              <button type="button" data-pcc-action="settle" disabled>${lab.actions.settle}</button>
              <button type="button" data-pcc-action="reset">${lab.actions.reset}</button>
            </div>
            <p class="pcc-lab-message" data-pcc-lab-message>${labMessages.idle || ""}</p>
          </div>
          <div class="pcc-lab-benefits">${labBenefits}</div>
        </div>
      </section>

      <section class="pcc-foundation-section fade-in">
        <div class="section-heading pcc-section-heading">
          <p class="eyebrow">${page.foundations.eyebrow}</p>
          <h2>${page.foundations.title}</h2>
          <p>${page.foundations.text}</p>
        </div>
        <div class="pcc-foundation-grid">${foundations}</div>
      </section>

      ${glvmBridge}

      <section class="pcc-close-section fade-in">
        <div class="pcc-close-copy">
          <p class="eyebrow">${page.close.eyebrow || ""}</p>
          <h2>${page.close.title}</h2>
          <p>${page.close.text}</p>
        </div>
        <div class="pcc-close-points">${closePoints}</div>
        <div class="hero-actions pcc-close-actions">${closeLinks}</div>
      </section>
    </article>
  `;
}

function renderAluxVsOthersPage(page) {
  const sourceArticle = pageData.aluxVsOthers.article;
  const defaultArticle = {
    kicker: sourceArticle.kicker,
    title: sourceArticle.title,
    intro: sourceArticle.text,
    summaryAria: sourceArticle.summaryAria,
    summaryLabel: sourceArticle.summaryLabel,
    summary: sourceArticle.summary,
    navTitle: sourceArticle.navTitle || sourceArticle.navLabel,
    nav: sourceArticle.nav,
    sections: {
      problemTitle: sourceArticle.problemTitle,
      problemText: sourceArticle.problemText,
      universalTitle: sourceArticle.universalTitle,
      universalText: sourceArticle.universalText,
      executionTitle: sourceArticle.executionTitle,
      compatibilityTitle: sourceArticle.compatibilityTitle,
      closingText: sourceArticle.closingText
    },
    figures: {
      stateLabels: sourceArticle.stateTransitionLabels,
      stateCaption: sourceArticle.figureOneCaption,
      typesCaption: sourceArticle.figureTwoCaption,
      compositeCaption: sourceArticle.figureThreeCaption,
      ...sourceArticle.figures
    }
  };
  const article = {
    ...defaultArticle,
    ...(page.article || {}),
    intro: (page.article && (page.article.intro || page.article.text)) || defaultArticle.intro,
    navTitle: (page.article && (page.article.navTitle || page.article.navLabel)) || defaultArticle.navTitle,
    sections: {
      ...defaultArticle.sections,
      problemTitle: page.article && page.article.problemTitle ? page.article.problemTitle : defaultArticle.sections.problemTitle,
      problemText: page.article && page.article.problemText ? page.article.problemText : defaultArticle.sections.problemText,
      universalTitle: page.article && page.article.universalTitle ? page.article.universalTitle : defaultArticle.sections.universalTitle,
      universalText: page.article && page.article.universalText ? page.article.universalText : defaultArticle.sections.universalText,
      executionTitle: page.article && page.article.executionTitle ? page.article.executionTitle : defaultArticle.sections.executionTitle,
      compatibilityTitle: page.article && page.article.compatibilityTitle ? page.article.compatibilityTitle : defaultArticle.sections.compatibilityTitle,
      closingText: page.article && page.article.closingText ? page.article.closingText : defaultArticle.sections.closingText,
      ...((page.article && page.article.sections) || {})
    },
    figures: {
      ...defaultArticle.figures,
      stateLabels: page.article && page.article.stateTransitionLabels ? page.article.stateTransitionLabels : defaultArticle.figures.stateLabels,
      stateCaption: page.article && page.article.figureOneCaption ? page.article.figureOneCaption : defaultArticle.figures.stateCaption,
      typesCaption: page.article && page.article.figureTwoCaption ? page.article.figureTwoCaption : defaultArticle.figures.typesCaption,
      compositeCaption: page.article && page.article.figureThreeCaption ? page.article.figureThreeCaption : defaultArticle.figures.compositeCaption,
      ...((page.article && page.article.figures) || {})
    },
    nav: (page.article && page.article.nav) || defaultArticle.nav,
    summary: (page.article && page.article.summary) || defaultArticle.summary
  };
  const diagrams = mergeAluxVsDiagrams(pageData.aluxVsOthers.diagrams, page.diagrams);
  const normalizeNavItem = (item) => Array.isArray(item)
    ? item
    : [item.label, item.id];
  const problemBullets = page.problem.bullets.map((item) => `<li>${item}</li>`).join("");
  const capabilityCards = [...page.execution, page.composite]
    .map((block, index) => renderAluxVsOthersCapability(block, index))
    .join("");
  const articleSummary = article.summary
    .map(([term, description]) => `<div><dt>${term}</dt><dd>${description}</dd></div>`)
    .join("");
  const articleNav = article.nav
    .map((item) => normalizeNavItem(item))
    .filter(([label, id]) => label && id && id !== "roadmap")
    .map(([label, id]) => `<a href="#${id}">${label}</a>`)
    .join("");
  const articleTitle = article.title;
  return `
    <article class="alux-vs-page alux-vs-article">
      <header class="alux-vs-article-header fade-in">
        <div class="alux-vs-article-lede">
          <h1>${articleTitle}</h1>
          <p>${article.intro}</p>
        </div>
        <aside class="alux-vs-article-summary" aria-label="${article.summaryAria}">
          <span>${article.summaryLabel}</span>
          <dl>${articleSummary}</dl>
        </aside>
      </header>

      <div class="alux-vs-article-layout">
        <aside class="alux-vs-article-nav" aria-label="${article.navTitle}">
          <span>${article.navTitle}</span>
          ${articleNav}
        </aside>

        <div class="alux-vs-article-body">
          <section class="alux-vs-article-section fade-in" id="problem">
            <h2>${article.sections.problemTitle}</h2>
            <p>${article.sections.problemText}</p>
            <ul>${problemBullets}</ul>
            ${renderStateTransitionDiagram(diagrams, article.figures.stateCaption, article.figures.stateTakeaway)}
          </section>

          <section class="alux-vs-article-section fade-in" id="universal">
            <h2>${article.sections.universalTitle}</h2>
            <p>${page.universal.text}</p>
            <p>${article.sections.universalText}</p>
            ${renderTransitionTypesDiagram(diagrams, article.figures.typesCaption, article.figures.typesTakeaway)}
          </section>

          <section class="alux-vs-article-section fade-in" id="execution">
            <h2>${article.sections.executionTitle}</h2>
            <div class="alux-vs-capability-grid">${capabilityCards}</div>
          </section>

          <section class="alux-vs-article-section fade-in" id="compatibility">
            <h2>${article.sections.compatibilityTitle}</h2>
            <p>${page.composite.text}</p>
            <p>${page.compatibility.text}</p>
            ${renderCompositeRuntimeDiagram(diagrams, article.figures.compositeCaption, article.figures.compositeTakeaway)}
            ${article.sections.closingText ? `<p class="alux-vs-article-close">${article.sections.closingText}</p>` : ""}
          </section>
        </div>
      </div>
    </article>
  `;
}

const socialChannelIcons = {
  GitHub: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7a11.3 11.3 0 0 0-3.57 22c.57.1.78-.25.78-.55V20c-3.18.69-3.85-1.35-3.85-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.54-.29-5.22-1.27-5.22-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.11 1.17a10.8 10.8 0 0 1 5.67 0c2.16-1.48 3.11-1.17 3.11-1.17.62 1.58.23 2.74.11 3.03.74.8 1.18 1.82 1.18 3.07 0 4.4-2.68 5.36-5.23 5.65.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.3 11.3 0 0 0 12 .7Z"/></svg>`,
  Medium: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="5" fill="currentColor"/><ellipse cx="15.5" cy="12" rx="2.8" ry="5" fill="currentColor"/><ellipse cx="21" cy="12" rx="1.2" ry="4.4" fill="currentColor"/></svg>`,
  X: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>`,
  Discord: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 6.2A14 14 0 0 1 10 5l.45.9a11 11 0 0 1 3.1 0L14 5a14 14 0 0 1 3 1.2c1.4 2.1 2.1 4.4 2 6.8-1.5 1.9-3.3 3-5.2 3.6l-.8-1.1c.9-.3 1.6-.7 2.2-1.2-2.1 1-4.3 1-6.4 0 .6.5 1.3.9 2.2 1.2l-.8 1.1C8.3 16 6.5 14.9 5 13c-.1-2.4.6-4.7 2-6.8Z"/><circle class="social-icon-cutout" cx="9.3" cy="11.2" r="1.25"/><circle class="social-icon-cutout" cx="14.7" cy="11.2" r="1.25"/></svg>`,
  Instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.7" r="1.25" fill="currentColor"/></svg>`,
  YouTube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 8.1a3 3 0 0 0-2.1-2.12C18.05 5.5 12 5.5 12 5.5s-6.05 0-7.9.48A3 3 0 0 0 2 8.1 31 31 0 0 0 1.5 12 31 31 0 0 0 2 15.9a3 3 0 0 0 2.1 2.12c1.85.48 7.9.48 7.9.48s6.05 0 7.9-.48A3 3 0 0 0 22 15.9a31 31 0 0 0 .5-3.9 31 31 0 0 0-.5-3.9Z"/><path class="social-icon-cutout" d="m10 15.5 5.2-3.5L10 8.5v7Z"/></svg>`,
  LinkedIn: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.86 9h2.96v11.45H3.86V9Zm5.49 0h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9Z"/></svg>`
};

function renderSocialChannelIcon(label) {
  return socialChannelIcons[label] || `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15"/></svg>`;
}

function renderSection(section, index = -1) {
  if (currentPage === "team" && section.type === "teamGrid") {
    return renderTeamGridSection(section);
  }
  if (currentPage === "vs" && section.type === "agentPrinciple") {
    return renderAgentPrincipleSection(section);
  }
  if (currentPage === "vs" && section.type === "agentMachine") {
    return renderAgentMachineSection(section);
  }
  if (currentPage === "vs" && section.type === "agentWorkflow") {
    return renderAgentWorkflowSection(section);
  }
  if (currentPage === "vs" && section.type === "agentContrast") {
    return renderAgentContrastSection(section);
  }
  if (currentPage === "vs" && section.type === "agentLimits") {
    return renderAgentLimitsSection(section);
  }
  if (currentPage === "vs" && section.type === "agentInfrastructure") {
    return renderAgentInfrastructureSection(section);
  }
  if (section.type === "split") {
    return `<section class="section intro-grid fade-in"><article class="content-card"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2><p>${section.text}</p></article><article class="content-card"><p class="eyebrow">${section.asideTitle}</p><h2>${section.asideTitle}</h2><p>${section.asideText}</p><div class="hero-actions">${section.actions.map(([label, href]) => `<a class="button primary" href="${href}">${label}</a>`).join("")}</div></article></section>`;
  }
  if (currentPage === "home" && section.type === "architecture") {
    return renderHomeArchitectureSection(section);
  }
  if (currentPage === "home" && section.type === "capabilityMap") {
    return renderHomeCapabilityMapSection(section);
  }
  if (section.type === "cards") {
    const introText = section.text ? `<p class="hero-text" style="margin-top:-8px;margin-bottom:24px;">${section.text}</p>` : "";
    if (currentPage === "home" && index === 1) {
      return `<section class="section fade-in problem-panel-section"><div class="content-card problem-panel"><div class="section-heading problem-panel-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2>${introText}</div><div class="problem-panel-grid">${section.items.map(([title, text], itemIndex) => `<article class="problem-column"><div class="problem-column-top"><span class="problem-kicker">${String(itemIndex + 1).padStart(2, "0")}</span><h3>${title}</h3></div><p>${text}</p></article>`).join("")}</div></div></section>`;
    }
    if (currentPage === "home" && [3, 4, 5, 6].includes(index)) {
      return renderHomeShowcasePanel(section, index);
    }
    return `<section class="section fade-in"><div class="section-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2>${introText}</div><div class="card-grid">${section.items.map(([title, text]) => `<article class="info-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>`;
  }
  if (section.type === "compare") {
    if (currentPage === "home" && index === 2) {
      return renderHomeComparePanel(section);
    }
    return `<section class="section compare-section fade-in"><div class="section-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><div class="compare-grid"><article class="compare-card"><h3>${section.left[0]}</h3><p>${section.left[1]}</p></article><article class="compare-card"><h3>${section.right[0]}</h3><p>${section.right[1]}</p></article></div><div class="content-card reasons-card"><h3>${section.title}</h3><ul class="bullet-list">${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul></div></section>`;
  }
  if (section.type === "faq") {
    const faqHintByLang = {
      en: "Click a question to view the answer",
      zh: "\u70b9\u51fb\u95ee\u9898\u67e5\u770b\u7b54\u6848",
      ko: "\uc9c8\ubb38\uc744 \ud074\ub9ad\ud574 \ub2f5\ubcc0 \ubcf4\uae30",
      ja: "\u8cea\u554f\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u56de\u7b54\u3092\u8868\u793a",
      ar: "\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0633\u0624\u0627\u0644 \u0644\u0639\u0631\u0636 \u0627\u0644\u0625\u062c\u0627\u0628\u0629"
    };
    const lang = document.documentElement.lang || "en";
    const faqOrder = section.faqOrder || section.items.map((_, itemIndex) => itemIndex);
    const faqItems = faqOrder.map((itemIndex) => section.items[itemIndex]).filter(Boolean);
    const faqHint = faqHintByLang[lang] || section.hint || faqHintByLang.en;
    return `<section class="section faq-section fade-in"><div class="section-heading faq-heading"><div class="faq-heading-title"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><p class="faq-hint">${faqHint}</p></div><div class="faq-list">${faqItems.map(([q, a], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary><span class="faq-question-text">${q}</span><span class="faq-toggle-icon" aria-hidden="true"></span></summary><div class="faq-body">${a}</div></details>`).join("")}</div></section>`;
  }
  if (section.type === "links") {
    const orderedItems = currentPage === "home"
      ? [...section.items].sort(([, hrefA], [, hrefB]) => Number(hrefA.includes("medium.com")) - Number(hrefB.includes("medium.com")))
      : section.items;
    return `<section class="section community-section fade-in"><div class="community-card"><div class="community-copy"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2></div><div class="social-links">${orderedItems.map(([label, href]) => `<a class="social-link" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}><span class="social-link-main"><span class="social-link-icon" aria-hidden="true">${renderSocialChannelIcon(label)}</span><span class="social-link-label">${label}</span></span><span class="social-link-arrow" aria-hidden="true">→</span></a>`).join("")}</div></div></section>`;
  }
  if (section.type === "paragraph") {
    if (currentPage === "home" && [7, 8].includes(index)) {
      return renderHomeManifestoSection(section);
    }
    return `<section class="section fade-in"><article class="content-card article-card"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2><p>${section.text}</p></article></section>`;
  }
  if (section.type === "timeline") {
    const introText = section.text ? `<p class="section-copy">${section.text}</p>` : "";
    return `<section class="section fade-in"><div class="section-heading"><p class="eyebrow">${section.eyebrow}</p><h2>${section.title}</h2>${introText}</div><div class="timeline">${section.items.map(([title, text]) => `<article class="timeline-item"><div class="timeline-dot"></div><div class="timeline-card"><h3>${title}</h3><p>${text}</p></div></article>`).join("")}</div></section>`;
  }
  return "";
}

function orderHomeSections(sections = []) {
  const hiddenHomeSectionIds = new Set(["open-capability-layer", "our-thesis", "home-how-it-works"]);
  const visibleSections = sections
    .map((section, index) => ({ ...section, __renderIndex: index }))
    .filter((section) => section.type !== "removed" && !hiddenHomeSectionIds.has(section.id));
  const capabilityMap = visibleSections.find((section) => section.type === "capabilityMap");
  if (!capabilityMap) return visibleSections;
  return [
    capabilityMap,
    ...visibleSections.filter((section) => section !== capabilityMap)
  ];
}

function setupGlvmPage() {
  if (!pageContent) return;
  const root = pageContent.querySelector("[data-glvm-root]");
  if (!root) return;

  if (Array.isArray(window.__glvmTimers)) {
    window.__glvmTimers.forEach((timer) => window.clearTimeout(timer));
  }
  const timers = [];
  window.__glvmTimers = timers;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layerButtons = Array.from(root.querySelectorAll("[data-glvm-layer]"));
  const layerTitle = root.querySelector("[data-glvm-layer-title]");
  const layerText = root.querySelector("[data-glvm-layer-text]");
  const layerStatus = root.querySelector("[data-glvm-layer-status]");
  const layerItems = root.querySelector("[data-glvm-layer-items]");

  const activateLayer = (button, focus = false) => {
    if (!button) return;
    layerButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    root.dataset.glvmActiveLayer = button.dataset.glvmLayer || "";
    if (layerTitle) layerTitle.textContent = button.dataset.layerTitle || "";
    if (layerText) layerText.textContent = button.dataset.layerText || "";
    if (layerStatus) layerStatus.textContent = button.dataset.layerStatus || "";
    if (layerItems) {
      const labels = Array.from(button.querySelectorAll(".glvm-layer-items i")).map((item) => item.textContent || "");
      layerItems.innerHTML = labels.map((label) => `<li>${label}</li>`).join("");
    }
    if (focus) button.focus();
  };

  layerButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateLayer(button));
    button.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowDown: (index + 1) % layerButtons.length,
        ArrowRight: (index + 1) % layerButtons.length,
        ArrowUp: (index - 1 + layerButtons.length) % layerButtons.length,
        ArrowLeft: (index - 1 + layerButtons.length) % layerButtons.length,
        Home: 0,
        End: layerButtons.length - 1
      };
      if (!(event.key in keyMap)) return;
      event.preventDefault();
      activateLayer(layerButtons[keyMap[event.key]], true);
    });
  });

  const routeButtons = Array.from(root.querySelectorAll("[data-glvm-route]"));
  const routeNodes = Array.from(root.querySelectorAll("[data-glvm-route-node]"));
  const routeTitle = root.querySelector("[data-glvm-route-title]");
  const routeText = root.querySelector("[data-glvm-route-text]");
  const routeStatus = root.querySelector("[data-glvm-route-status]");

  const activateRoute = (button, focus = false) => {
    if (!button) return;
    const id = button.dataset.glvmRoute || "";
    root.dataset.glvmActiveRoute = id;
    routeButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    routeNodes.forEach((node) => node.classList.toggle("is-active", node.dataset.glvmRouteNode === id));
    if (routeTitle) routeTitle.textContent = button.dataset.routeTitle || "";
    if (routeText) routeText.textContent = button.dataset.routeText || "";
    if (routeStatus) routeStatus.textContent = button.dataset.routeStatus || "";
    if (focus) button.focus();
  };

  routeButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateRoute(button));
    button.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowRight: (index + 1) % routeButtons.length,
        ArrowDown: (index + 1) % routeButtons.length,
        ArrowLeft: (index - 1 + routeButtons.length) % routeButtons.length,
        ArrowUp: (index - 1 + routeButtons.length) % routeButtons.length,
        Home: 0,
        End: routeButtons.length - 1
      };
      if (!(event.key in keyMap)) return;
      event.preventDefault();
      activateRoute(routeButtons[keyMap[event.key]], true);
    });
  });

  const journey = root.querySelector("[data-glvm-journey]");
  const stepCards = Array.from(root.querySelectorAll("[data-glvm-step-card]"));
  const progress = root.querySelector("[data-glvm-progress]");
  const message = root.querySelector("[data-glvm-message]");
  const playButton = root.querySelector('[data-glvm-action="play"]');
  const resetButton = root.querySelector('[data-glvm-action="reset"]');
  let messages = [];
  try {
    messages = JSON.parse(journey?.dataset.journeyMessages || "[]");
  } catch (_) {
    messages = [];
  }

  const clearJourneyTimers = () => {
    while (timers.length) window.clearTimeout(timers.pop());
  };
  const setJourneyStep = (step) => {
    const normalized = Math.max(0, Math.min(stepCards.length, Number(step) || 0));
    root.dataset.glvmStep = String(normalized);
    stepCards.forEach((card, index) => {
      const rank = index + 1;
      card.classList.toggle("is-complete", normalized >= rank);
      card.classList.toggle("is-current", normalized === rank || (normalized === 0 && rank === 1));
    });
    if (progress) progress.textContent = `${normalized} / ${stepCards.length}`;
    if (message) message.textContent = messages[normalized] || messages[0] || "";
    if (playButton) playButton.disabled = normalized > 0 && normalized < stepCards.length;
  };

  playButton?.addEventListener("click", () => {
    clearJourneyTimers();
    setJourneyStep(0);
    if (reduceMotion) {
      setJourneyStep(stepCards.length);
      if (playButton) playButton.disabled = false;
      return;
    }
    stepCards.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setJourneyStep(index + 1);
        if (index === stepCards.length - 1 && playButton) playButton.disabled = false;
      }, 260 + index * 860);
      timers.push(timer);
    });
  });
  resetButton?.addEventListener("click", () => {
    clearJourneyTimers();
    setJourneyStep(0);
    if (playButton) playButton.disabled = false;
  });

  const stackFlowNodes = Array.from(root.querySelectorAll(".glvm-stack-flow-node"));
  const stackCards = Array.from(root.querySelectorAll(".glvm-stack-item"));
  const activateStack = (index, focus = false) => {
    const normalized = Math.max(0, Math.min(stackCards.length - 1, Number(index) || 0));
    stackFlowNodes.forEach((node, nodeIndex) => {
      const active = nodeIndex === normalized;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
      if (active && focus) node.focus();
    });
    stackCards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === normalized));
  };
  stackFlowNodes.forEach((node, index) => {
    node.addEventListener("click", () => activateStack(index));
    node.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowRight: (index + 1) % stackFlowNodes.length,
        ArrowDown: (index + 1) % stackFlowNodes.length,
        ArrowLeft: (index - 1 + stackFlowNodes.length) % stackFlowNodes.length,
        ArrowUp: (index - 1 + stackFlowNodes.length) % stackFlowNodes.length,
        Home: 0,
        End: stackFlowNodes.length - 1
      };
      if (!(event.key in keyMap)) return;
      event.preventDefault();
      activateStack(keyMap[event.key], true);
    });
  });
  stackCards.forEach((card, index) => card.addEventListener("pointerenter", () => activateStack(index)));

  const video = root.querySelector("[data-glvm-video]");
  if (video) {
    const media = video.closest(".glvm-hero-media");
    video.addEventListener("error", () => media?.classList.add("is-video-missing"), { once: true });
    if (reduceMotion) {
      video.pause();
      video.removeAttribute("autoplay");
    } else {
      const attempt = video.play();
      if (attempt && typeof attempt.catch === "function") attempt.catch(() => media?.classList.add("is-video-missing"));
    }
  }

  const initialLayer = layerButtons.find((button) => button.classList.contains("is-active")) || layerButtons[0];
  const initialRoute = routeButtons.find((button) => button.classList.contains("is-active")) || routeButtons[0];
  activateLayer(initialLayer);
  activateRoute(initialRoute);
  activateStack(0);
  setJourneyStep(0);
}

function setupParallelConcurrentComposablePage() {
  if (!pageContent) return;
  const root = pageContent.querySelector("[data-pcc-root]");
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll("[data-pcc-mode]"));
  const panels = Array.from(root.querySelectorAll("[data-pcc-panel]"));
  const visuals = Array.from(root.querySelectorAll("[data-pcc-visual]"));
  const lab = root.querySelector("[data-pcc-lab]");
  const labScore = root.querySelector("[data-pcc-lab-score]");
  const labMessage = root.querySelector("[data-pcc-lab-message]");
  const labCheckpoint = root.querySelector("[data-pcc-lab-checkpoint]");
  const actionControls = Array.from(root.querySelectorAll("[data-pcc-action]"));
  const benefitCards = Array.from(root.querySelectorAll("[data-pcc-benefit]"));
  const stepCards = Array.from(root.querySelectorAll("[data-pcc-step]"));
  const stateRank = { idle: 0, parallel: 1, paused: 2, resumed: 3, settled: 4 };
  const actionState = { parallel: "parallel", pause: "paused", resume: "resumed", settle: "settled" };
  const actionMode = { parallel: "parallel", pause: "concurrent", resume: "concurrent", settle: "composable" };
  let checkpointTimer = null;

  const activate = (id, focusButton = false) => {
    root.dataset.pccActive = id;
    buttons.forEach((button) => {
      const isActive = button.dataset.pccMode === id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      if (isActive && focusButton) button.focus();
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.pccPanel === id;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });
    visuals.forEach((visual) => {
      const isActive = visual.dataset.pccVisual === id;
      visual.classList.toggle("is-active", isActive);
      visual.setAttribute("aria-hidden", String(!isActive));
    });
  };

  const setLabState = (state, options = {}) => {
    const normalizedState = stateRank[state] === undefined ? "idle" : state;
    if (checkpointTimer) {
      window.clearTimeout(checkpointTimer);
      checkpointTimer = null;
    }
    root.dataset.labState = normalizedState;
    if (lab) lab.dataset.labState = normalizedState;
    if (labScore) labScore.textContent = `${stateRank[normalizedState]} / 4`;
    if (labMessage && lab) {
      const key = normalizedState;
      labMessage.textContent = lab.dataset[`msg${key.charAt(0).toUpperCase()}${key.slice(1)}`] || lab.dataset.msgIdle || "";
    }
    if (labCheckpoint) {
      const isSettled = normalizedState === "settled";
      const applyCheckpointState = () => {
        const checkpointLabel = isSettled ? labCheckpoint.dataset.checkpointSettled : labCheckpoint.dataset.checkpointIdle;
        const checkpointText = labCheckpoint.querySelector("span");
        if (checkpointText) checkpointText.textContent = checkpointLabel || "";
        labCheckpoint.classList.toggle("is-verified", isSettled);
      };
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isSettled && !reduceMotion) {
        labCheckpoint.classList.remove("is-verified");
        checkpointTimer = window.setTimeout(applyCheckpointState, 720);
      } else {
        applyCheckpointState();
      }
    }
    stepCards.forEach((card) => {
      const cardState = card.dataset.pccStep;
      const cardRank = stateRank[cardState] || 0;
      const isActive = stateRank[normalizedState] > 0 && cardRank <= stateRank[normalizedState];
      const isCurrent = cardRank === stateRank[normalizedState];
      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-current", isCurrent);
      if (isCurrent) card.setAttribute("aria-current", "step");
      else card.removeAttribute("aria-current");
    });
    benefitCards.forEach((card) => {
      const cardState = card.dataset.pccBenefit;
      const isActive = stateRank[normalizedState] > 0 && stateRank[cardState] <= stateRank[normalizedState];
      const isCurrent = stateRank[normalizedState] > 0 && stateRank[cardState] === stateRank[normalizedState];
      card.classList.toggle("is-active", isActive);
      card.classList.toggle("is-current", isCurrent);
      if (isCurrent) card.setAttribute("aria-current", "step");
      else card.removeAttribute("aria-current");
    });

    actionControls.forEach((control) => {
      const action = control.dataset.pccAction;
      if (action === "reset") {
        control.disabled = false;
        return;
      }
      if (action === "parallel") control.disabled = stateRank[normalizedState] >= 1;
      if (action === "pause") control.disabled = stateRank[normalizedState] < 1 || stateRank[normalizedState] >= 2;
      if (action === "resume") control.disabled = stateRank[normalizedState] < 2 || stateRank[normalizedState] >= 3;
      if (action === "settle") control.disabled = stateRank[normalizedState] < 3 || stateRank[normalizedState] >= 4;
    });

    if (options.activateMode !== false) {
      const nextMode = options.mode || actionMode[options.action];
      if (nextMode) activate(nextMode, options.focusMode || false);
    }
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const id = button.dataset.pccMode;
      activate(id);
    });
    button.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowRight: (index + 1) % buttons.length,
        ArrowDown: (index + 1) % buttons.length,
        ArrowLeft: (index - 1 + buttons.length) % buttons.length,
        ArrowUp: (index - 1 + buttons.length) % buttons.length,
        Home: 0,
        End: buttons.length - 1
      };
      if (!(event.key in keyMap)) return;
      event.preventDefault();
      const next = buttons[keyMap[event.key]];
      if (next) {
        activate(next.dataset.pccMode, true);
      }
    });
  });

  actionControls.forEach((control) => {
    control.addEventListener("click", () => {
      const action = control.dataset.pccAction;
      if (action === "reset") {
        setLabState("idle", { activateMode: false });
        activate("parallel");
        return;
      }
      const targetMode = control.dataset.pccTargetMode || actionMode[action];
      setLabState(actionState[action], { action, mode: targetMode });
    });
  });

  root.querySelectorAll("[data-pcc-image]").forEach((image) => {
    image.addEventListener("error", () => {
      const frame = image.closest(".pcc-image-frame");
      if (frame) frame.classList.add("is-missing");
    }, { once: true });
  });

  setLabState("idle", { activateMode: false });
}

function updateActiveNavigation() {
  const activeHrefByPage = {
    home: "index.html",
    vs: "for-ai-agents.html",
    aluxVsOthers: "alux-vs-others.html",
    parallelConcurrentComposable: "runtime-lab.html",
    glvm: "glvm.html",
    team: "team.html",
    roadmap: "roadmap.html"
  };
  const activeHref = activeHrefByPage[currentPage];
  const learnPages = new Set(["aluxVsOthers", "parallelConcurrentComposable", "glvm"]);

  document.querySelectorAll(".site-nav a").forEach((anchor) => {
    const isActive = anchor.getAttribute("href") === activeHref;
    anchor.classList.toggle("active-link", isActive);
    if (isActive) {
      anchor.setAttribute("aria-current", "page");
    } else {
      anchor.removeAttribute("aria-current");
    }
  });

  if (dropdownTrigger) {
    dropdownTrigger.classList.toggle("active-link", learnPages.has(currentPage));
  }
}

function renderPage(lang) {
  const chrome = ui[lang] || ui.en;
  const visibleChrome = chrome;
  let page = (pages[currentPage] && pages[currentPage][lang]) || (pages[currentPage] && pages[currentPage].en);
  const isStaticRoadmap = currentPage === "roadmap" && pageContent && pageContent.dataset.static === "true";
  if (!page || !pageContent) return;

  if (currentPage === "home") {
    page = (pages.home && pages.home[lang]) || pageData.home;
  }

  if (currentPage === "vs") {
    page = (pages.vs && pages.vs[lang]) || forAiAgentsPage;
  }
  if (currentPage === "roadmap" && !isStaticRoadmap) {
    const timelineSection = page.sections.find((section) => section.type === "timeline");
    const updatedSection = page.sections.find((section) => section.type === "paragraph");
    page = {
      ...page,
      hero: { hidden: true },
      sections: timelineSection
        ? [
            {
              ...timelineSection,
              text: timelineSection.text || (updatedSection ? updatedSection.text : "")
            }
          ]
        : page.sections
    };
  }
  const orderedSections = currentPage === "aluxVsOthers" || currentPage === "parallelConcurrentComposable" || currentPage === "glvm"
    ? []
    : currentPage === "vs"
    ? [...page.sections].sort((a, b) => {
        const order = ["agentPrinciple", "agentMachine", "agentWorkflow", "agentInfrastructure", "agentContrast"];
        const aIndex = order.indexOf(a.type);
        const bIndex = order.indexOf(b.type);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      })
    : currentPage === "home"
    ? orderHomeSections(page.sections)
    : page.sections;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = sanitizeExternalProjectNames(page.metaTitle, lang);

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", sanitizeExternalProjectNames(page.metaDescription, lang));

  document.querySelectorAll("[data-nav]").forEach((node) => {
    node.textContent = visibleChrome.nav[node.dataset.nav] || ui.en.nav[node.dataset.nav] || node.textContent;
  });
  updateActiveNavigation();

  document.querySelectorAll("[data-lang-label]").forEach((node) => {
    node.textContent = visibleChrome.languageLabel || ui.en.languageLabel;
  });

  document.querySelectorAll("[data-lang-current]").forEach((node) => {
    node.textContent = visibleLanguageNames[lang] || visibleLanguageNames.en;
  });

  document.querySelectorAll("[data-footer='copyright']").forEach((node) => {
    node.textContent = chrome.footer.copyright;
  });

  document.querySelectorAll("[data-cookie='title']").forEach((node) => {
    node.textContent = chrome.cookie.title;
  });
  document.querySelectorAll("[data-cookie='text']").forEach((node) => {
    node.textContent = chrome.cookie.text;
  });
  document.querySelectorAll("[data-cookie='button']").forEach((node) => {
    node.textContent = chrome.cookie.button;
  });

  if (currentPage === "aluxVsOthers") {
    pageContent.innerHTML = renderAluxVsOthersPage(page);
  } else if (currentPage === "parallelConcurrentComposable") {
    pageContent.innerHTML = renderParallelConcurrentComposablePage(page);
  } else if (currentPage === "glvm") {
    pageContent.innerHTML = renderGlvmPage(page);
  } else if (!isStaticRoadmap) {
    pageContent.innerHTML = renderHero(page.hero, lang) + orderedSections.map((section, index) => renderSection(section, section.__renderIndex ?? index)).join("");
  }

  if (isStaticRoadmap) {
    if (staticRoadmapHTML === null) staticRoadmapHTML = pageContent.innerHTML;
    pageContent.innerHTML = staticRoadmapHTML;
    applyStaticTextTranslations(pageContent, lang, "roadmapStatic.");
    prepareRoadmapQuarterLabels(pageContent);
    if (lang === "en") {
      pageContent.querySelectorAll(".roadmap-bullet-list li").forEach((node) => {
        node.innerHTML = node.innerHTML.replace(/\((Completed|Planned|In Progress|WIP)\)/g, "<strong>($1)</strong>");
      });
    }
  }

  sanitizeRenderedExternalProjectNames(pageContent, lang);
  protectLocalizedTechnicalTokens(pageContent, lang);
  isolateArabicTechnicalRuns(pageContent, lang);
  initCapabilityMindmaps();
  setupParallelConcurrentComposablePage();
  setupGlvmPage();

  langButtons.forEach((button) => {
    button.textContent = visibleLanguageButtonLabels[button.dataset.lang] || (button.dataset.lang || "").toUpperCase();
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  restoreHashScroll();
}

function initMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initDropdown() {
  if (!navDropdown || !dropdownTrigger) return;

  const openDropdown = () => {
    navDropdown.classList.add("open");
    dropdownTrigger.setAttribute("aria-expanded", "true");
  };

  const closeDropdown = () => {
    navDropdown.classList.remove("open");
    dropdownTrigger.setAttribute("aria-expanded", "false");
  };

  navDropdown.addEventListener("mouseenter", () => {
    if (!mobileQuery.matches) openDropdown();
  });

  navDropdown.addEventListener("mouseleave", () => {
    if (!mobileQuery.matches) closeDropdown();
  });

  dropdownTrigger.addEventListener("click", (event) => {
    if (!mobileQuery.matches) {
      event.preventDefault();
      openDropdown();
      return;
    }

    const isOpen = navDropdown.classList.toggle("open");
    dropdownTrigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (mobileQuery.matches && !navDropdown.contains(event.target)) {
      closeDropdown();
    }
  });
}

function initLanguage() {
  const initial = detectLanguage();
  renderPage(initial);

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      setStoredValue("alux-lang", lang);
      renderPage(lang);
      if (langDropdown && langSwitch) {
        langDropdown.classList.remove("open");
        langSwitch.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function initLanguageDropdown() {
  if (!langDropdown || !langSwitch) return;

  langSwitch.addEventListener("click", () => {
    const isOpen = langDropdown.classList.toggle("open");
    langSwitch.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!langDropdown.contains(event.target)) {
      langDropdown.classList.remove("open");
      langSwitch.setAttribute("aria-expanded", "false");
    }
  });
}

function initCookieBanner() {
  if (!cookieBanner || !cookieAccept) return;
  if (getStoredValue("alux-cookie-accepted") !== "true") {
    cookieBanner.hidden = false;
  }
  cookieAccept.addEventListener("click", () => {
    setStoredValue("alux-cookie-accepted", "true");
    cookieBanner.hidden = true;
    cookieBanner.style.display = "none";
    cookieBanner.remove();
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
}

initMenu();
initDropdown();
initLanguage();
initLanguageDropdown();
initCookieBanner();
setTimeout(initReveal, 0);
