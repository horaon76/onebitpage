import { PatternData } from "@/lib/patterns/types";

const singletonData: PatternData = {
  slug: "singleton",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Singleton Pattern",
  subtitle:
    "Ensures a class has only one instance throughout the application lifecycle and provides a global point of access to that instance.",

  intent:
    "Restrict a class to a single instance and provide a well-known access point to it. This is critical in systems where exactly one object is needed to coordinate actions across the system — such as a centralized configuration, a connection pool, or a hardware interface controller.",

  classDiagramSvg: `<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-label { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="s-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Singleton class box -->
  <rect x="160" y="10" width="200" height="125" class="s-box s-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="s-title s-diagram-title">Singleton</text>
  <line x1="160" y1="33" x2="360" y2="33" class="s-diagram-line"/>
  <text x="170" y="48" class="s-member s-diagram-member">-instance: Singleton</text>
  <text x="170" y="62" class="s-member s-diagram-member">-data: ConfigData</text>
  <line x1="160" y1="68" x2="360" y2="68" class="s-diagram-line"/>
  <text x="170" y="82" class="s-member s-diagram-member">-Singleton()</text>
  <text x="170" y="96" class="s-member s-diagram-member">+getInstance(): Singleton</text>
  <text x="170" y="110" class="s-member s-diagram-member">+operation(): void</text>
  <text x="170" y="124" class="s-member s-diagram-member">-initialize(): void</text>
  <!-- Self arrow (returns single instance) -->
  <path d="M360,52 Q410,52 410,76 Q410,100 360,100" class="s-arr s-diagram-arrow"/>
  <text x="414" y="72" class="s-label s-diagram-label">returns</text>
  <text x="414" y="83" class="s-label s-diagram-label">single</text>
  <text x="414" y="94" class="s-label s-diagram-label">instance</text>
  <!-- Initializer box -->
  <rect x="340" y="165" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="420" y="183" text-anchor="middle" class="s-title s-diagram-title">Initializer</text>
  <line x1="340" y1="188" x2="500" y2="188" class="s-diagram-line"/>
  <text x="350" y="203" class="s-member s-diagram-member">+loadConfig(): void</text>
  <!-- Dashed arrow from Singleton to Initializer -->
  <line x1="340" y1="135" x2="400" y2="165" class="s-arr s-diagram-arrow s-dash"/>
  <text x="385" y="148" class="s-label s-diagram-label">creates &amp;</text>
  <text x="385" y="158" class="s-label s-diagram-label">initializes</text>
  <!-- Client A box -->
  <rect x="10" y="185" width="120" height="42" class="s-box s-diagram-box"/>
  <text x="70" y="203" text-anchor="middle" class="s-title s-diagram-title">Client A</text>
  <line x1="10" y1="207" x2="130" y2="207" class="s-diagram-line"/>
  <text x="20" y="220" class="s-member s-diagram-member">+doWork(): void</text>
  <!-- Client B box -->
  <rect x="10" y="237" width="120" height="42" class="s-box s-diagram-box"/>
  <text x="70" y="255" text-anchor="middle" class="s-title s-diagram-title">Client B</text>
  <line x1="10" y1="259" x2="130" y2="259" class="s-diagram-line"/>
  <text x="20" y="272" class="s-member s-diagram-member">+process(): void</text>
  <!-- Arrows from clients to Singleton -->
  <line x1="130" y1="195" x2="210" y2="135" class="s-arr s-diagram-arrow"/>
  <line x1="130" y1="250" x2="200" y2="135" class="s-arr s-diagram-arrow"/>
  <text x="122" y="166" class="s-label s-diagram-label">getInstance()</text>
  <!-- "same object" label between client arrows -->
  <text x="140" y="230" class="s-label s-diagram-label">same instance</text>
</svg>`,

  diagramExplanation:
    "The class diagram shows how the Singleton pattern restricts instantiation. The Singleton class holds a private static reference (-instance) to itself. Its constructor is private (-Singleton()), preventing any external code from calling 'new'. The only way to obtain the instance is through the public +getInstance() method, which checks if the instance already exists — if not, it creates it once (triggering the Initializer to load configuration/resources), then caches it. On every subsequent call, getInstance() returns the same cached object. Client A and Client B both call getInstance() and receive the exact same object reference — guaranteeing consistency. The Initializer represents the one-time setup logic (loading config, connecting to databases, etc.) that runs only during the first creation.",

  diagramComponents: [
    {
      name: "Singleton (class box)",
      description: "The core class that enforces a single instance. Contains a private static 'instance' field, a private constructor, and a public static getInstance() method. The private constructor blocks external creation via 'new'."
    },
    {
      name: "-instance: Singleton (field)",
      description: "A private static field holding the sole reference to the created object. Initially null/nil, it gets assigned during the first getInstance() call and is reused for all subsequent calls."
    },
    {
      name: "-Singleton() (constructor)",
      description: "The private constructor. By making it private, no external code can create a second instance. Only getInstance() — inside the same class — can invoke it."
    },
    {
      name: "+getInstance(): Singleton (method)",
      description: "The public static access point. Checks if 'instance' is null; if so, creates it (once). Returns the cached instance on every call. This is where thread-safety mechanisms (locks, volatile, etc.) are applied."
    },
    {
      name: "-initialize(): void (method)",
      description: "Called once during first creation. Loads configuration, opens connections, or performs expensive one-time setup. This ensures the instance is fully ready before being returned to any caller."
    },
    {
      name: "Initializer (box)",
      description: "Represents the one-time initialization logic — loading from a vault, reading environment variables, connecting to a database. The dashed arrow indicates this is a creation-time dependency, not a runtime one."
    },
    {
      name: "Self-referencing arrow",
      description: "The arrow from getInstance() looping back to the instance field shows that the method returns the same object stored in the private field — the defining characteristic of Singleton."
    },
    {
      name: "Client A / Client B (boxes)",
      description: "Any classes or modules that need the shared resource. They all call getInstance() and receive the same object reference. Neither can create their own instance."
    },
    {
      name: "getInstance() arrows (Client → Singleton)",
      description: "Both clients invoke getInstance(). The 'same instance' label confirms both arrows resolve to the identical object, ensuring consistency across the entire application."
    },
  ],

  solutionDetail:
    "The Singleton pattern solves the problem of uncontrolled multiple instantiation by centralizing object creation behind a single access point. Here is how it works step by step:\n\n1. **Private constructor**: The class declares its constructor as private (or protected), making it impossible for any external code to call 'new Singleton()'. This is the enforcement mechanism.\n\n2. **Static instance field**: A private static field (-instance) holds the sole reference. Before the first call, this is null. After creation, it permanently points to the one and only instance.\n\n3. **Static factory method (getInstance)**: This is the only public entry point. On the first call, it detects that 'instance' is null, creates the object via the private constructor, stores it in the static field, runs the Initializer to load resources, and returns it. On every subsequent call, it simply returns the cached reference — no new object, no re-initialization.\n\n4. **One-time initialization**: The initialize() method (or its equivalent) runs exactly once during creation. This is where expensive operations happen — loading configuration from a vault, establishing database connections, warming caches. Because the Singleton guarantees single creation, these operations are never repeated.\n\n5. **Thread safety**: In concurrent environments, two threads might both see 'instance == null' simultaneously. Without protection, both would create separate objects — defeating the pattern. Solutions include: synchronized/lock around creation (double-checked locking), language-level guarantees (Java class loading, Go sync.Once, Rust OnceLock), or eager initialization (create at class-load time).\n\n6. **Shared state consistency**: Because all clients receive the same reference, they all read and write to the same object. This eliminates configuration drift (where different parts of the system use different settings), prevents resource duplication (multiple connection pools competing for the same limited connections), and ensures coordinated behavior (a single fleet tracker maintaining one consistent view).",

  characteristics: [
    "Guarantees only one instance of a class exists in a running process",
    "Provides a global access point, often via a static method (getInstance)",
    "Lazy initialization defers creation until first use, saving startup resources",
    "Thread safety must be explicitly handled in concurrent environments (locks, volatile, sync.Once)",
    "The private constructor blocks direct instantiation from outside the class",
    "Can make unit testing harder due to global state — use dependency injection to pass the instance",
    "Overuse leads to hidden coupling; apply it only when a single coordination point is genuinely required",
  ],

  // ─── USE CASES ──────────────────────────────────────────────────
  useCases: [
    {
      id: 1,
      title: "Database Connection Pool",
      domain: "Backend Infrastructure",
      description: "A connection pool manages a fixed set of reusable database connections. Creating multiple pools would exhaust database connection limits and cause connection leaks.",
      whySingleton: "One pool coordinates all connection borrowing/returning across the application, enforcing max-connection limits and connection reuse.",
    },
    {
      id: 2,
      title: "Application Configuration Manager",
      domain: "All Applications",
      description: "A centralized configuration object loads settings from environment variables, config files, or remote stores at startup and makes them available to every module.",
      whySingleton: "Multiple config instances could load different values at different times, causing inconsistent behavior. A single instance guarantees uniform settings.",
    },
    {
      id: 3,
      title: "Logging Service",
      domain: "Cross-Cutting Concern",
      description: "A logger aggregates log output from all parts of the system, handling formatting, log level filtering, rotation, and output routing (console, file, remote).",
      whySingleton: "Multiple loggers would produce interleaved output, inconsistent formatting, and duplicate log entries. One instance provides ordered, unified logging.",
    },
    {
      id: 4,
      title: "Thread Pool / Task Scheduler",
      domain: "Concurrency",
      description: "A thread pool manages a bounded set of worker threads that execute submitted tasks. Multiple pools would over-subscribe CPU cores and waste memory.",
      whySingleton: "One scheduler decides task priority, enforces concurrency limits, and prevents resource over-allocation across the entire process.",
    },
    {
      id: 5,
      title: "Cache Manager (In-Memory)",
      domain: "Performance",
      description: "An in-memory cache stores frequently accessed data (API responses, computed results, DB query results) to avoid repeated expensive lookups.",
      whySingleton: "Multiple caches would store duplicate data, waste memory, and return stale results when one cache is invalidated but others are not.",
    },
    {
      id: 6,
      title: "Device / Hardware Interface Manager",
      domain: "IoT / Embedded",
      description: "A hardware manager controls access to a physical device — printer, sensor, serial port, or GPU. The device typically accepts one connection at a time.",
      whySingleton: "The physical device is already a singleton in the real world. Multiple manager instances would cause contention, corrupted data, or device locks.",
    },
    {
      id: 7,
      title: "Feature Flag / Toggle Service",
      domain: "Product Engineering",
      description: "A feature flag service loads toggle states from a remote dashboard and evaluates whether features are enabled for specific users or segments.",
      whySingleton: "All code paths must evaluate the same flag values. Multiple instances could cache different flag states, causing inconsistent user experiences.",
    },
    {
      id: 8,
      title: "Metrics / Telemetry Collector",
      domain: "Observability",
      description: "A metrics collector aggregates counters, histograms, and gauges from all application components and periodically flushes them to a monitoring backend (Prometheus, Datadog).",
      whySingleton: "Multiple collectors would produce fragmented metrics, double-counting, and inconsistent dashboard readings.",
    },
    {
      id: 9,
      title: "API Rate Limiter",
      domain: "API Gateway",
      description: "A rate limiter tracks request counts per client/IP within a time window (e.g., 100 requests/minute) and rejects excess requests.",
      whySingleton: "Multiple rate limiter instances would each maintain separate counters, allowing clients to exceed the intended limit by round-robining across instances.",
    },
    {
      id: 10,
      title: "Service Registry / Discovery Client",
      domain: "Microservices",
      description: "A service registry client maintains a local cache of available service endpoints, periodically syncing with a discovery server (Consul, Eureka, etcd).",
      whySingleton: "One registry client ensures all outbound calls reference the same service map. Multiple instances would independently sync, causing routing inconsistencies.",
    },
    {
      id: 11,
      title: "Audit / Compliance Logger",
      domain: "Regulated Industries",
      description: "An audit logger records every security-relevant action (login, data access, permission change) in a tamper-evident log for compliance.",
      whySingleton: "HIPAA, SOX, PCI-DSS require sequential, complete audit trails. Multiple loggers risk missing events or producing unordered records.",
    },
    {
      id: 12,
      title: "Event Bus / Message Dispatcher",
      domain: "Event-Driven Architecture",
      description: "An in-process event bus lets components publish and subscribe to events (order.placed, user.registered) without direct coupling.",
      whySingleton: "All publishers and subscribers must interact with the same bus. Separate bus instances would create isolated channels where events are lost.",
    },
  ],

  // ─── EXAMPLES ───────────────────────────────────────────────────
  examples: [
    {
      id: 1,
      title: "Fintech — Payment Gateway Configuration Manager",
      domain: "Fintech",
      problem:
        "A payment processing platform connects to multiple acquirers (Visa, Mastercard, local banks). Gateway credentials, retry policies, and routing rules must be loaded once from a secure vault and shared across all transaction handlers. Creating multiple config instances risks stale credentials and race conditions during hot-reload.",
      solution:
        "A Singleton PaymentGatewayConfig loads credentials at startup, exposes them read-only, and handles atomic hot-reload. Every transaction handler references the same instance.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-label { font: 8px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr2); }
  </style>
  <defs><marker id="s-arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="100" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">PaymentGatewayConfig</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">-instance: PaymentGatewayConfig</text>
  <text x="130" y="58" class="s-member s-diagram-member">-apiKey, gatewayUrl, retryLimit</text>
  <line x1="120" y1="64" x2="340" y2="64" class="s-diagram-line"/>
  <text x="130" y="78" class="s-member s-diagram-member">+getInstance(): PaymentGatewayConfig</text>
  <text x="130" y="90" class="s-member s-diagram-member">-loadFromVault(): void</text>
  <text x="130" y="102" class="s-member s-diagram-member">+getGatewayUrl(): string</text>
  <rect x="5" y="132" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="75" y="154" text-anchor="middle" class="s-title s-diagram-title">TransactionHandler</text>
  <rect x="315" y="132" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="385" y="154" text-anchor="middle" class="s-title s-diagram-title">RefundProcessor</text>
  <line x1="75" y1="132" x2="200" y2="110" class="s-arr s-diagram-arrow"/>
  <line x1="385" y1="132" x2="280" y2="110" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import threading

# PaymentGatewayConfig — Singleton using double-checked locking
# Only one config object exists; all transaction handlers share it.

class PaymentGatewayConfig:
    _instance = None          # Class-level reference to the single instance
    _lock = threading.Lock()  # Lock for thread-safe instantiation

    def __init__(self):
        # Private-by-convention constructor — only called once
        self.api_key: str = ""
        self.retry_limit: int = 3
        self.gateway_url: str = ""

    @classmethod
    def get_instance(cls) -> "PaymentGatewayConfig":
        """Return the single instance, creating it on first call."""
        # First check — fast path, no lock needed if already created
        if cls._instance is None:
            with cls._lock:
                # Second check — prevents race between two threads
                # that both passed the first check
                if cls._instance is None:
                    cls._instance = cls()
                    cls._instance._load_from_vault()
        return cls._instance

    def _load_from_vault(self):
        """Simulate loading secrets from a secure vault at startup."""
        self.api_key = "sk_live_abc123"
        self.gateway_url = "https://acquirer.bank/api/v2"
        self.retry_limit = 5

# ── Usage ──
# Both handlers receive the exact same config object
config = PaymentGatewayConfig.get_instance()
print(config.gateway_url, config.retry_limit)

same_config = PaymentGatewayConfig.get_instance()
assert config is same_config  # True — proves singleton`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// PaymentGatewayConfig holds acquirer credentials (Singleton).
// sync.Once guarantees the init function runs exactly once,
// even when called from multiple goroutines concurrently.
type PaymentGatewayConfig struct {
	APIKey     string // Secret key loaded from vault
	GatewayURL string // Acquirer endpoint URL
	RetryLimit int    // Max retry attempts per transaction
}

var (
	pgcInstance *PaymentGatewayConfig // Package-level singleton reference
	pgcOnce    sync.Once             // Ensures initializer runs once
)

// GetPaymentGatewayConfig returns the singleton config.
// sync.Once.Do is goroutine-safe — no explicit mutex needed.
func GetPaymentGatewayConfig() *PaymentGatewayConfig {
	pgcOnce.Do(func() {
		// This closure executes exactly once, on first call
		pgcInstance = &PaymentGatewayConfig{
			APIKey:     "sk_live_abc123",
			GatewayURL: "https://acquirer.bank/api/v2",
			RetryLimit: 5,
		}
	})
	return pgcInstance
}

func main() {
	cfg := GetPaymentGatewayConfig()
	fmt.Println(cfg.GatewayURL, cfg.RetryLimit)

	// Calling again returns the same pointer
	cfg2 := GetPaymentGatewayConfig()
	fmt.Println(cfg == cfg2) // true — same instance
}`,
        Java: `/**
 * PaymentGatewayConfig — thread-safe Singleton via double-checked locking.
 * "volatile" ensures the instance reference is visible across threads
 * immediately after assignment (prevents instruction reordering).
 */
public final class PaymentGatewayConfig {
    // volatile — publishes the fully-constructed object to all threads
    private static volatile PaymentGatewayConfig instance;

    private String apiKey;      // Secret key from vault
    private String gatewayUrl;  // Acquirer endpoint
    private int retryLimit;     // Max retries per transaction

    // Private constructor — prevents external instantiation
    private PaymentGatewayConfig() {
        this.apiKey = "sk_live_abc123";
        this.gatewayUrl = "https://acquirer.bank/api/v2";
        this.retryLimit = 5;
    }

    /**
     * Double-checked locking:
     * 1. First null-check is lock-free (fast path).
     * 2. synchronized block ensures only one thread creates.
     * 3. Second null-check inside lock prevents duplicate creation.
     */
    public static PaymentGatewayConfig getInstance() {
        if (instance == null) {                           // 1st check (no lock)
            synchronized (PaymentGatewayConfig.class) {   // acquire lock
                if (instance == null) {                   // 2nd check (locked)
                    instance = new PaymentGatewayConfig();
                }
            }
        }
        return instance;
    }

    // Read-only accessors
    public String getGatewayUrl() { return gatewayUrl; }
    public int getRetryLimit()    { return retryLimit; }

    // ── Usage ──
    // PaymentGatewayConfig cfg = PaymentGatewayConfig.getInstance();
    // System.out.println(cfg.getGatewayUrl());
}`,
        TypeScript: `/**
 * PaymentGatewayConfig — Singleton in TypeScript.
 * The private constructor prevents "new PaymentGatewayConfig()".
 * Since JS is single-threaded, no mutex is needed.
 */
class PaymentGatewayConfig {
  // Static field holds the single instance (initially undefined)
  private static instance: PaymentGatewayConfig;

  // Fields are readonly — set once in constructor, never mutated
  readonly apiKey: string;
  readonly gatewayUrl: string;
  readonly retryLimit: number;

  // Private constructor — only callable from within the class
  private constructor() {
    this.apiKey = "sk_live_abc123";
    this.gatewayUrl = "https://acquirer.bank/api/v2";
    this.retryLimit = 5;
  }

  /**
   * getInstance() — creates the instance on first call,
   * returns the cached instance on subsequent calls.
   */
  static getInstance(): PaymentGatewayConfig {
    if (!PaymentGatewayConfig.instance) {
      PaymentGatewayConfig.instance = new PaymentGatewayConfig();
    }
    return PaymentGatewayConfig.instance;
  }
}

// ── Usage ──
const cfg = PaymentGatewayConfig.getInstance();
console.log(cfg.gatewayUrl, cfg.retryLimit);

const cfg2 = PaymentGatewayConfig.getInstance();
console.log(cfg === cfg2); // true — same reference`,
        Rust: `use std::sync::OnceLock;

/// PaymentGatewayConfig — Singleton using OnceLock (std, Rust 1.70+).
/// OnceLock guarantees the initializer runs exactly once,
/// and all subsequent calls return &'static reference.
struct PaymentGatewayConfig {
    api_key: String,      // Secret key from vault
    gateway_url: String,  // Acquirer endpoint URL
    retry_limit: u32,     // Max retries per transaction
}

// Global static — OnceLock<T> is Send + Sync, so safe across threads
static CONFIG: OnceLock<PaymentGatewayConfig> = OnceLock::new();

/// Returns &'static reference to the singleton config.
/// get_or_init runs the closure exactly once; concurrent callers block
/// until initialization is complete, then all receive the same reference.
fn get_payment_gateway_config() -> &'static PaymentGatewayConfig {
    CONFIG.get_or_init(|| PaymentGatewayConfig {
        api_key: "sk_live_abc123".into(),
        gateway_url: "https://acquirer.bank/api/v2".into(),
        retry_limit: 5,
    })
}

fn main() {
    let cfg = get_payment_gateway_config();
    println!("{} {}", cfg.gateway_url, cfg.retry_limit);

    // Second call returns the same reference
    let cfg2 = get_payment_gateway_config();
    assert!(std::ptr::eq(cfg, cfg2)); // true — same address
}`,
      },
      considerations: [
        "Credentials should be loaded from a secure vault (e.g., HashiCorp Vault, AWS Secrets Manager), not hard-coded",
        "Hot-reload of credentials requires atomic swap — replace the internal state, not the singleton reference",
        "Consider circuit-breaker integration: if the vault is unreachable at startup, fail fast with a clear error",
        "In microservice architectures, each service process has its own singleton — for cross-service config, use a shared config service",
        "Thread safety is critical during hot-reload; read-write locks allow concurrent reads while blocking during updates",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Electronic Health Record (EHR) System Configuration",
      domain: "Healthcare",
      problem:
        "A hospital's EHR system must connect to HL7 FHIR endpoints, lab integrations, and pharmacy systems using a unified configuration. Multiple configuration instances could serve different versions of endpoint URLs, violating HIPAA audit requirements for consistent access logging.",
      solution:
        "A Singleton EHRSystemConfig is initialized once from the hospital's configuration server, ensuring all modules — scheduling, charting, prescriptions — read the same FHIR base URL, TLS settings, and facility identifiers.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr3); }
  </style>
  <defs><marker id="s-arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">EHRSystemConfig</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">-fhirBaseUrl, facilityId, tlsCertPath</text>
  <line x1="120" y1="52" x2="340" y2="52" class="s-diagram-line"/>
  <text x="130" y="66" class="s-member s-diagram-member">+getInstance(): EHRSystemConfig</text>
  <text x="130" y="78" class="s-member s-diagram-member">-loadConfig(): void</text>
  <text x="130" y="90" class="s-member s-diagram-member">+getFhirBaseUrl(): string</text>
  <rect x="5" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="55" y="148" text-anchor="middle" class="s-title s-diagram-title">Scheduling</text>
  <rect x="180" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="148" text-anchor="middle" class="s-title s-diagram-title">Charting</text>
  <rect x="355" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="405" y="148" text-anchor="middle" class="s-title s-diagram-title">Prescriptions</text>
  <line x1="55" y1="126" x2="190" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="230" y1="126" x2="230" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="405" y1="126" x2="280" y2="100" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import threading

# EHRSystemConfig — Singleton for hospital-wide FHIR configuration.
# All modules (scheduling, charting, prescriptions) share one config.

class EHRSystemConfig:
    _instance = None          # Class-level singleton reference
    _lock = threading.Lock()  # Thread-safety lock

    def __init__(self):
        # Fields initialized with defaults; overwritten by _load_config
        self.fhir_base_url: str = ""
        self.facility_id: str = ""
        self.tls_cert_path: str = ""

    @classmethod
    def get_instance(cls) -> "EHRSystemConfig":
        """Thread-safe lazy initialization with double-checked locking."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
                    cls._instance._load_config()
        return cls._instance

    def _load_config(self):
        """Load configuration from the hospital config server."""
        self.fhir_base_url = "https://ehr.hospital.org/fhir/r4"
        self.facility_id = "HOSP-NE-0042"
        self.tls_cert_path = "/etc/ssl/ehr/client.pem"

# ── Usage ──
cfg = EHRSystemConfig.get_instance()
print(cfg.fhir_base_url, cfg.facility_id)`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// EHRSystemConfig stores hospital FHIR connection settings.
// sync.Once ensures initialization happens exactly once.
type EHRSystemConfig struct {
	FHIRBaseURL string // HL7 FHIR R4 endpoint
	FacilityID  string // Hospital identifier
	TLSCertPath string // Mutual TLS client certificate
}

var (
	ehrInstance *EHRSystemConfig
	ehrOnce    sync.Once
)

// GetEHRSystemConfig returns the singleton EHR config.
func GetEHRSystemConfig() *EHRSystemConfig {
	ehrOnce.Do(func() {
		ehrInstance = &EHRSystemConfig{
			FHIRBaseURL: "https://ehr.hospital.org/fhir/r4",
			FacilityID:  "HOSP-NE-0042",
			TLSCertPath: "/etc/ssl/ehr/client.pem",
		}
	})
	return ehrInstance
}

func main() {
	cfg := GetEHRSystemConfig()
	fmt.Println(cfg.FHIRBaseURL, cfg.FacilityID)
}`,
        Java: `/**
 * EHRSystemConfig — Singleton for hospital FHIR configuration.
 * Thread-safe via double-checked locking + volatile.
 * All hospital modules share one immutable config instance.
 */
public final class EHRSystemConfig {
    private static volatile EHRSystemConfig instance;

    private final String fhirBaseUrl;  // HL7 FHIR R4 endpoint
    private final String facilityId;   // Hospital facility ID
    private final String tlsCertPath;  // Client TLS certificate path

    // Private constructor — enforces single instance
    private EHRSystemConfig() {
        this.fhirBaseUrl = "https://ehr.hospital.org/fhir/r4";
        this.facilityId = "HOSP-NE-0042";
        this.tlsCertPath = "/etc/ssl/ehr/client.pem";
    }

    public static EHRSystemConfig getInstance() {
        if (instance == null) {
            synchronized (EHRSystemConfig.class) {
                if (instance == null) {
                    instance = new EHRSystemConfig();
                }
            }
        }
        return instance;
    }

    public String getFhirBaseUrl() { return fhirBaseUrl; }
    public String getFacilityId()  { return facilityId; }
}`,
        TypeScript: `/**
 * EHRSystemConfig — Singleton for hospital FHIR settings.
 * Private constructor blocks external instantiation.
 */
class EHRSystemConfig {
  private static instance: EHRSystemConfig;

  readonly fhirBaseUrl: string;  // HL7 FHIR R4 endpoint
  readonly facilityId: string;   // Hospital facility code
  readonly tlsCertPath: string;  // Client certificate path

  private constructor() {
    this.fhirBaseUrl = "https://ehr.hospital.org/fhir/r4";
    this.facilityId = "HOSP-NE-0042";
    this.tlsCertPath = "/etc/ssl/ehr/client.pem";
  }

  static getInstance(): EHRSystemConfig {
    if (!EHRSystemConfig.instance) {
      EHRSystemConfig.instance = new EHRSystemConfig();
    }
    return EHRSystemConfig.instance;
  }
}

// ── Usage ──
const ehrCfg = EHRSystemConfig.getInstance();
console.log(ehrCfg.fhirBaseUrl, ehrCfg.facilityId);`,
        Rust: `use std::sync::OnceLock;

/// EHRSystemConfig — Singleton for hospital FHIR settings.
/// OnceLock provides thread-safe lazy initialization.
struct EHRSystemConfig {
    fhir_base_url: String,  // HL7 FHIR R4 endpoint
    facility_id: String,    // Hospital facility code
    tls_cert_path: String,  // Mutual TLS cert path
}

static EHR_CONFIG: OnceLock<EHRSystemConfig> = OnceLock::new();

/// Returns &'static reference; initializer runs once.
fn get_ehr_config() -> &'static EHRSystemConfig {
    EHR_CONFIG.get_or_init(|| EHRSystemConfig {
        fhir_base_url: "https://ehr.hospital.org/fhir/r4".into(),
        facility_id: "HOSP-NE-0042".into(),
        tls_cert_path: "/etc/ssl/ehr/client.pem".into(),
    })
}

fn main() {
    let cfg = get_ehr_config();
    println!("{} {}", cfg.fhir_base_url, cfg.facility_id);
}`,
      },
      considerations: [
        "HIPAA compliance requires consistent audit logging — a single config source ensures uniform logging across modules",
        "TLS certificates should be rotated periodically; the singleton can expose a reload method that atomically swaps cert paths",
        "Facility ID changes are rare but happen during hospital mergers — design the singleton to support controlled re-initialization",
        "In multi-tenant hospital systems, each tenant may need its own config — consider a per-tenant singleton registry",
        "Health check endpoints should verify the singleton is initialized and FHIR endpoint is reachable",
      ],
    },
    {
      id: 3,
      title: "E-Commerce — Inventory Cache Manager",
      domain: "E-Commerce",
      problem:
        "An e-commerce platform with millions of SKUs needs a centralized in-memory cache for inventory counts. Multiple cache instances would cause overselling during flash sales because each instance could hold stale stock counts independently.",
      solution:
        "A Singleton InventoryCacheManager maintains a single source of truth for stock levels, backed by Redis, and provides thread-safe decrement operations during checkout.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr4); }
  </style>
  <defs><marker id="s-arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="110" y="10" width="240" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">InventoryCacheManager</text>
  <line x1="110" y1="32" x2="350" y2="32" class="s-diagram-line"/>
  <text x="120" y="46" class="s-member s-diagram-member">-stock: Map&lt;SKU, count&gt;</text>
  <line x1="110" y1="52" x2="350" y2="52" class="s-diagram-line"/>
  <text x="120" y="66" class="s-member s-diagram-member">+getInstance(): InventoryCacheManager</text>
  <text x="120" y="78" class="s-member s-diagram-member">+reserveStock(sku, qty): boolean</text>
  <text x="120" y="90" class="s-member s-diagram-member">-warmCache(): void</text>
  <rect x="5" y="126" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="70" y="148" text-anchor="middle" class="s-title s-diagram-title">CheckoutService</text>
  <rect x="325" y="126" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="390" y="148" text-anchor="middle" class="s-title s-diagram-title">CartService</text>
  <line x1="70" y1="126" x2="200" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="390" y1="126" x2="280" y2="100" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import threading
from typing import Dict

# InventoryCacheManager — Singleton for centralized stock levels.
# One source of truth prevents overselling during flash sales.

class InventoryCacheManager:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        # Internal stock map: SKU → available quantity
        self._stock: Dict[str, int] = {}

    @classmethod
    def get_instance(cls) -> "InventoryCacheManager":
        """Lazy singleton with double-checked locking."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
                    cls._instance._warm_cache()
        return cls._instance

    def _warm_cache(self):
        """Pre-load stock counts from Redis/database at startup."""
        self._stock = {"SKU-8821": 150, "SKU-4410": 42, "SKU-7763": 0}

    def reserve_stock(self, sku: str, qty: int) -> bool:
        """
        Atomically reserve qty units of a SKU.
        Returns True if sufficient stock; False otherwise.
        Lock ensures no two threads decrement below zero.
        """
        with self._lock:
            if self._stock.get(sku, 0) >= qty:
                self._stock[sku] -= qty
                return True
            return False

# ── Usage ──
cache = InventoryCacheManager.get_instance()
print(cache.reserve_stock("SKU-8821", 2))   # True
print(cache.reserve_stock("SKU-7763", 1))   # False — out of stock`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// InventoryCacheManager — Singleton for centralized stock.
type InventoryCacheManager struct {
	stock map[string]int // SKU → available quantity
	mu    sync.Mutex     // Guards stock mutations
}

var (
	invInstance *InventoryCacheManager
	invOnce    sync.Once
)

// GetInventoryCache returns the singleton cache.
func GetInventoryCache() *InventoryCacheManager {
	invOnce.Do(func() {
		invInstance = &InventoryCacheManager{
			stock: map[string]int{
				"SKU-8821": 150,
				"SKU-4410": 42,
			},
		}
	})
	return invInstance
}

// ReserveStock atomically decrements qty for sku.
// Returns true if enough stock was available.
func (ic *InventoryCacheManager) ReserveStock(sku string, qty int) bool {
	ic.mu.Lock()
	defer ic.mu.Unlock()
	if ic.stock[sku] >= qty {
		ic.stock[sku] -= qty
		return true
	}
	return false
}

func main() {
	cache := GetInventoryCache()
	fmt.Println(cache.ReserveStock("SKU-8821", 2)) // true
}`,
        Java: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * InventoryCacheManager — Singleton for centralized stock cache.
 * Uses ConcurrentHashMap + AtomicInteger for lock-free reads
 * and atomic decrements during checkout.
 */
public final class InventoryCacheManager {
    private static volatile InventoryCacheManager instance;

    // ConcurrentHashMap allows many threads to read simultaneously
    private final ConcurrentHashMap<String, AtomicInteger> stock
        = new ConcurrentHashMap<>();

    private InventoryCacheManager() {
        // Warm cache from database/Redis
        stock.put("SKU-8821", new AtomicInteger(150));
        stock.put("SKU-4410", new AtomicInteger(42));
    }

    public static InventoryCacheManager getInstance() {
        if (instance == null) {
            synchronized (InventoryCacheManager.class) {
                if (instance == null)
                    instance = new InventoryCacheManager();
            }
        }
        return instance;
    }

    /**
     * Atomically decrements stock for the given SKU.
     * addAndGet(-qty) is atomic; if result >= 0 the reserve succeeded.
     */
    public boolean reserveStock(String sku, int qty) {
        AtomicInteger current = stock.get(sku);
        if (current == null) return false;
        return current.addAndGet(-qty) >= 0;
    }
}`,
        TypeScript: `/**
 * InventoryCacheManager — Singleton stock cache.
 * Single source of truth prevents overselling.
 */
class InventoryCacheManager {
  private static instance: InventoryCacheManager;
  private stock: Map<string, number>;  // SKU → available qty

  private constructor() {
    // Warm cache from Redis/DB
    this.stock = new Map([
      ["SKU-8821", 150],
      ["SKU-4410", 42],
    ]);
  }

  static getInstance(): InventoryCacheManager {
    if (!InventoryCacheManager.instance) {
      InventoryCacheManager.instance = new InventoryCacheManager();
    }
    return InventoryCacheManager.instance;
  }

  /**
   * Reserve qty units. Returns true if enough stock,
   * false otherwise (no mutation on failure).
   */
  reserveStock(sku: string, qty: number): boolean {
    const current = this.stock.get(sku) ?? 0;
    if (current >= qty) {
      this.stock.set(sku, current - qty);
      return true;
    }
    return false;
  }
}

// ── Usage ──
const cache = InventoryCacheManager.getInstance();
console.log(cache.reserveStock("SKU-8821", 2)); // true`,
        Rust: `use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

/// InventoryCacheManager — Singleton stock cache.
/// Mutex<HashMap> ensures thread-safe stock mutations.
struct InventoryCacheManager {
    stock: Mutex<HashMap<String, i32>>,
}

static INV_CACHE: OnceLock<InventoryCacheManager> = OnceLock::new();

/// Returns singleton reference to the inventory cache.
fn get_inventory_cache() -> &'static InventoryCacheManager {
    INV_CACHE.get_or_init(|| {
        let mut s = HashMap::new();
        s.insert("SKU-8821".into(), 150);
        s.insert("SKU-4410".into(), 42);
        InventoryCacheManager { stock: Mutex::new(s) }
    })
}

/// Atomically reserves qty of sku. Returns true on success.
fn reserve_stock(sku: &str, qty: i32) -> bool {
    let cache = get_inventory_cache();
    let mut stock = cache.stock.lock().unwrap();
    if let Some(v) = stock.get_mut(sku) {
        if *v >= qty {
            *v -= qty;
            return true;
        }
    }
    false
}

fn main() {
    println!("{}", reserve_stock("SKU-8821", 2)); // true
}`,
      },
      considerations: [
        "The in-memory cache should be backed by Redis or a database for persistence across restarts",
        "During flash sales, consider pre-warming the cache and setting higher capacity thresholds",
        "AtomicInteger (Java) or Mutex (Rust/Go) prevents race conditions during concurrent checkout",
        "Cache invalidation must be handled carefully — stale counts lead to overselling or unnecessary rejections",
        "Consider eventual consistency: allow slight over-reservation and reconcile asynchronously for extreme scale",
      ],
    },
    {
      id: 4,
      title: "Media Streaming — CDN Configuration",
      domain: "Media",
      problem:
        "A streaming service delivers content through multiple CDN edge nodes. Each microservice (transcoder, DRM licenser, manifest generator) must reference the same CDN origin URL, signing keys, and edge-selection policy. Divergent configs cause broken playback and cache-miss storms.",
      solution:
        "A Singleton CDNConfig holds the authoritative CDN topology and signing credentials, loaded once from a central config store and used by all streaming pipeline components.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr5); }
  </style>
  <defs><marker id="s-arr5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="10" width="200" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">CDNConfig</text>
  <line x1="130" y1="32" x2="330" y2="32" class="s-diagram-line"/>
  <text x="140" y="46" class="s-member s-diagram-member">-originUrl, signingKey, edgePolicy</text>
  <line x1="130" y1="52" x2="330" y2="52" class="s-diagram-line"/>
  <text x="140" y="66" class="s-member s-diagram-member">+getInstance(): CDNConfig</text>
  <text x="140" y="78" class="s-member s-diagram-member">+getOriginUrl(): string</text>
  <text x="140" y="90" class="s-member s-diagram-member">+getEdgePolicy(): string</text>
  <rect x="5" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="55" y="148" text-anchor="middle" class="s-title s-diagram-title">Transcoder</text>
  <rect x="180" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="148" text-anchor="middle" class="s-title s-diagram-title">DRMLicenser</text>
  <rect x="355" y="126" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="405" y="148" text-anchor="middle" class="s-title s-diagram-title">ManifestGen</text>
  <line x1="55" y1="126" x2="195" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="230" y1="126" x2="230" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="405" y1="126" x2="280" y2="100" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import threading

# CDNConfig — Singleton for CDN topology and signing credentials.
# All streaming pipeline components share one authoritative config.

class CDNConfig:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.origin_url: str = ""    # CDN origin server URL
        self.signing_key: str = ""   # URL signing secret
        self.edge_policy: str = ""   # Edge selection policy

    @classmethod
    def get_instance(cls) -> "CDNConfig":
        """Lazy singleton — created on first access."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
                    cls._instance._load()
        return cls._instance

    def _load(self):
        """Load CDN config from a central configuration store."""
        self.origin_url = "https://origin.streamcdn.io"
        self.signing_key = "cdnkey_prod_9f3a1b"
        self.edge_policy = "latency-optimized"

# ── Usage ──
cdn = CDNConfig.get_instance()
print(cdn.origin_url, cdn.edge_policy)`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// CDNConfig holds CDN origin and edge-selection settings.
type CDNConfig struct {
	OriginURL  string // CDN origin server
	SigningKey  string // URL-signing secret
	EdgePolicy string // Edge selection algorithm
}

var (
	cdnInstance *CDNConfig
	cdnOnce    sync.Once
)

// GetCDNConfig returns the singleton CDN configuration.
func GetCDNConfig() *CDNConfig {
	cdnOnce.Do(func() {
		cdnInstance = &CDNConfig{
			OriginURL:  "https://origin.streamcdn.io",
			SigningKey:  "cdnkey_prod_9f3a1b",
			EdgePolicy: "latency-optimized",
		}
	})
	return cdnInstance
}

func main() {
	cfg := GetCDNConfig()
	fmt.Println(cfg.OriginURL, cfg.EdgePolicy)
}`,
        Java: `/**
 * CDNConfig — Singleton for CDN topology.
 * Immutable after construction — all fields are final.
 */
public final class CDNConfig {
    private static volatile CDNConfig instance;

    private final String originUrl;   // CDN origin
    private final String signingKey;  // URL signing key
    private final String edgePolicy;  // Edge selection policy

    private CDNConfig() {
        this.originUrl = "https://origin.streamcdn.io";
        this.signingKey = "cdnkey_prod_9f3a1b";
        this.edgePolicy = "latency-optimized";
    }

    public static CDNConfig getInstance() {
        if (instance == null) {
            synchronized (CDNConfig.class) {
                if (instance == null)
                    instance = new CDNConfig();
            }
        }
        return instance;
    }

    public String getOriginUrl()  { return originUrl; }
    public String getEdgePolicy() { return edgePolicy; }
}`,
        TypeScript: `/**
 * CDNConfig — Singleton for CDN origin and edge config.
 */
class CDNConfig {
  private static instance: CDNConfig;

  readonly originUrl: string;   // CDN origin server
  readonly signingKey: string;  // URL signing secret
  readonly edgePolicy: string;  // Edge selection policy

  private constructor() {
    this.originUrl = "https://origin.streamcdn.io";
    this.signingKey = "cdnkey_prod_9f3a1b";
    this.edgePolicy = "latency-optimized";
  }

  static getInstance(): CDNConfig {
    if (!CDNConfig.instance) {
      CDNConfig.instance = new CDNConfig();
    }
    return CDNConfig.instance;
  }
}

// ── Usage ──
const cdn = CDNConfig.getInstance();
console.log(cdn.originUrl, cdn.edgePolicy);`,
        Rust: `use std::sync::OnceLock;

/// CDNConfig — Singleton for CDN topology settings.
struct CDNConfig {
    origin_url: String,   // CDN origin server URL
    signing_key: String,  // URL signing secret
    edge_policy: String,  // Edge selection algorithm
}

static CDN_CFG: OnceLock<CDNConfig> = OnceLock::new();

/// Returns singleton CDN config reference.
fn get_cdn_config() -> &'static CDNConfig {
    CDN_CFG.get_or_init(|| CDNConfig {
        origin_url: "https://origin.streamcdn.io".into(),
        signing_key: "cdnkey_prod_9f3a1b".into(),
        edge_policy: "latency-optimized".into(),
    })
}

fn main() {
    let cfg = get_cdn_config();
    println!("{} {}", cfg.origin_url, cfg.edge_policy);
}`,
      },
      considerations: [
        "Signing keys must be rotated regularly — the singleton should support atomic key rotation",
        "Edge policy changes (e.g., switching from latency-optimized to cost-optimized) require all services to update simultaneously",
        "Consider exposing a health-check method that validates the origin URL is reachable",
        "In multi-region deployments, each region may need a different config — use a per-region singleton registry",
        "CDN config changes should be propagated via a pub/sub mechanism to avoid polling overhead",
      ],
    },
    {
      id: 5,
      title: "Logistics — Fleet Tracking Coordinator",
      domain: "Logistics",
      problem:
        "A logistics company tracks thousands of delivery vehicles in real time. Multiple tracking coordinator instances would produce duplicate GPS event processing, conflicting ETAs, and inconsistent driver assignments across dispatching modules.",
      solution:
        "A Singleton FleetTrackingCoordinator centralizes vehicle position ingestion, de-duplicates GPS pings, and provides a single consistent view of fleet state to all dispatch and routing services.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#s-arr6); }
  </style>
  <defs><marker id="s-arr6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="100" y="10" width="260" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">FleetTrackingCoordinator</text>
  <line x1="100" y1="32" x2="360" y2="32" class="s-diagram-line"/>
  <text x="110" y="46" class="s-member s-diagram-member">-positions: Map&lt;vehicleId, GeoPos&gt;</text>
  <line x1="100" y1="52" x2="360" y2="52" class="s-diagram-line"/>
  <text x="110" y="66" class="s-member s-diagram-member">+getInstance(): FleetTrackingCoordinator</text>
  <text x="110" y="78" class="s-member s-diagram-member">+updatePosition(id, lat, lng): void</text>
  <text x="110" y="90" class="s-member s-diagram-member">+getPosition(id): GeoPosition</text>
  <rect x="5" y="126" width="120" height="36" class="s-box s-diagram-box"/>
  <text x="65" y="148" text-anchor="middle" class="s-title s-diagram-title">DispatchService</text>
  <rect x="335" y="126" width="120" height="36" class="s-box s-diagram-box"/>
  <text x="395" y="148" text-anchor="middle" class="s-title s-diagram-title">RoutingEngine</text>
  <line x1="65" y1="126" x2="195" y2="100" class="s-arr s-diagram-arrow"/>
  <line x1="395" y1="126" x2="290" y2="100" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import threading
from typing import Dict, Tuple

# FleetTrackingCoordinator — Singleton for real-time vehicle tracking.
# Centralizes GPS data to prevent duplicate processing.

class FleetTrackingCoordinator:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        # Map of vehicle ID → (latitude, longitude)
        self._positions: Dict[str, Tuple[float, float]] = {}

    @classmethod
    def get_instance(cls) -> "FleetTrackingCoordinator":
        """Thread-safe lazy initialization."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def update_position(self, vehicle_id: str, lat: float, lng: float):
        """Record a GPS ping for a vehicle (thread-safe)."""
        with self._lock:
            self._positions[vehicle_id] = (lat, lng)

    def get_position(self, vehicle_id: str) -> Tuple[float, float]:
        """Retrieve last-known position. Returns (0,0) if unknown."""
        return self._positions.get(vehicle_id, (0.0, 0.0))

# ── Usage ──
tracker = FleetTrackingCoordinator.get_instance()
tracker.update_position("TRK-4491", 40.7128, -74.0060)
print(tracker.get_position("TRK-4491"))  # (40.7128, -74.006)`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// Position represents GPS coordinates.
type Position struct{ Lat, Lng float64 }

// FleetTrackingCoordinator — Singleton for vehicle tracking.
type FleetTrackingCoordinator struct {
	positions map[string]Position // vehicle ID → GPS position
	mu        sync.RWMutex       // RWMutex allows concurrent reads
}

var (
	ftcInstance *FleetTrackingCoordinator
	ftcOnce    sync.Once
)

// GetFleetTracker returns the singleton coordinator.
func GetFleetTracker() *FleetTrackingCoordinator {
	ftcOnce.Do(func() {
		ftcInstance = &FleetTrackingCoordinator{
			positions: make(map[string]Position),
		}
	})
	return ftcInstance
}

// UpdatePosition records a GPS ping (write-lock).
func (f *FleetTrackingCoordinator) UpdatePosition(id string, lat, lng float64) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.positions[id] = Position{lat, lng}
}

// GetPosition reads the latest position (read-lock).
func (f *FleetTrackingCoordinator) GetPosition(id string) Position {
	f.mu.RLock()
	defer f.mu.RUnlock()
	return f.positions[id]
}

func main() {
	ft := GetFleetTracker()
	ft.UpdatePosition("TRK-4491", 40.7128, -74.0060)
	fmt.Println(ft.GetPosition("TRK-4491"))
}`,
        Java: `import java.util.concurrent.ConcurrentHashMap;

/**
 * FleetTrackingCoordinator — Singleton for real-time fleet tracking.
 * ConcurrentHashMap provides lock-free reads for high-throughput GPS ingestion.
 */
public final class FleetTrackingCoordinator {
    private static volatile FleetTrackingCoordinator instance;

    // GeoPosition — immutable record for GPS coordinates (Java 16+)
    public record GeoPosition(double lat, double lng) {}

    // ConcurrentHashMap: thread-safe without global lock
    private final ConcurrentHashMap<String, GeoPosition> positions
        = new ConcurrentHashMap<>();

    private FleetTrackingCoordinator() {}

    public static FleetTrackingCoordinator getInstance() {
        if (instance == null) {
            synchronized (FleetTrackingCoordinator.class) {
                if (instance == null)
                    instance = new FleetTrackingCoordinator();
            }
        }
        return instance;
    }

    /** Record a GPS ping for a vehicle. */
    public void updatePosition(String vehicleId, double lat, double lng) {
        positions.put(vehicleId, new GeoPosition(lat, lng));
    }

    /** Retrieve last-known position. */
    public GeoPosition getPosition(String vehicleId) {
        return positions.getOrDefault(vehicleId, new GeoPosition(0, 0));
    }
}`,
        TypeScript: `/**
 * FleetTrackingCoordinator — Singleton for real-time vehicle tracking.
 * Single instance prevents duplicate GPS event processing.
 */
class FleetTrackingCoordinator {
  private static instance: FleetTrackingCoordinator;
  private positions = new Map<string, { lat: number; lng: number }>();

  private constructor() {}

  static getInstance(): FleetTrackingCoordinator {
    if (!FleetTrackingCoordinator.instance) {
      FleetTrackingCoordinator.instance = new FleetTrackingCoordinator();
    }
    return FleetTrackingCoordinator.instance;
  }

  /** Record a GPS ping for a vehicle. */
  updatePosition(vehicleId: string, lat: number, lng: number): void {
    this.positions.set(vehicleId, { lat, lng });
  }

  /** Retrieve last-known position. Returns {0,0} if unknown. */
  getPosition(vehicleId: string) {
    return this.positions.get(vehicleId) ?? { lat: 0, lng: 0 };
  }
}

// ── Usage ──
const tracker = FleetTrackingCoordinator.getInstance();
tracker.updatePosition("TRK-4491", 40.7128, -74.006);
console.log(tracker.getPosition("TRK-4491"));`,
        Rust: `use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

/// FleetTrackingCoordinator — Singleton for fleet GPS tracking.
/// Mutex<HashMap> ensures thread-safe position updates.
struct FleetTrackingCoordinator {
    positions: Mutex<HashMap<String, (f64, f64)>>,
}

static FLEET: OnceLock<FleetTrackingCoordinator> = OnceLock::new();

/// Returns singleton fleet tracker reference.
fn get_fleet_tracker() -> &'static FleetTrackingCoordinator {
    FLEET.get_or_init(|| FleetTrackingCoordinator {
        positions: Mutex::new(HashMap::new()),
    })
}

fn main() {
    let ft = get_fleet_tracker();

    // Update position (acquires lock)
    ft.positions.lock().unwrap()
        .insert("TRK-4491".into(), (40.7128, -74.006));

    // Read position (acquires lock)
    let pos = ft.positions.lock().unwrap();
    if let Some(p) = pos.get("TRK-4491") {
        println!("lat={} lng={}", p.0, p.1);
    }
}`,
      },
      considerations: [
        "GPS pings arrive at very high frequency — use a read-write lock (RWMutex) to allow concurrent reads while limiting writes",
        "Consider batching position updates to reduce lock contention under extreme load",
        "De-duplication logic should ignore stale pings (older timestamps than the currently stored one)",
        "For thousands of vehicles, partition the map by region or fleet zone to reduce contention",
        "The singleton should expose a cleanup method to remove vehicles that have gone offline (no pings in N minutes)",
      ],
    },
  ],

  // ─── VARIANTS (Ways to Create Singleton) ─────────────────────────
  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "For most production systems, use Enum-based (Java), module-level (Python), sync.Once (Go), OnceLock (Rust), or ES module (TypeScript). These are the simplest and least error-prone. Use double-checked locking only when you need lazy initialization in a language that requires it.",
  variants: [
    {
      id: 1,
      name: "Eager Initialization",
      description:
        "The instance is created when the class is loaded — before any thread can call getInstance(). Simple and inherently thread-safe, but wastes resources if the instance is never used.",
      code: {
        Python: `# Eager Initialization — instance created at module load time

class AppConfig:
    \"\"\"
    Singleton via eager initialization.
    _instance is assigned as soon as the module is imported.
    \"\"\"
    def __init__(self):
        self.db_url = "postgres://localhost:5432/mydb"
        self.debug = False

    def __repr__(self):
        return f"AppConfig(db_url={self.db_url})"

# Instance created immediately when module is loaded
_instance = AppConfig()

def get_config() -> AppConfig:
    \"\"\"Always returns the same pre-created instance.\"\"\"
    return _instance

# ── Usage ──
cfg = get_config()
print(cfg)  # AppConfig(db_url=postgres://localhost:5432/mydb)`,
        Go: `package main

import "fmt"

// AppConfig — eager singleton via init() function.
// init() runs once when the package is loaded.
type AppConfig struct {
	DBURL string
	Debug bool
}

// Package-level variable — initialized eagerly
var appConfig = &AppConfig{
	DBURL: "postgres://localhost:5432/mydb",
	Debug: false,
}

// GetConfig returns the singleton (already created).
func GetConfig() *AppConfig {
	return appConfig
}

func main() {
	cfg := GetConfig()
	fmt.Println(cfg.DBURL) // postgres://localhost:5432/mydb
}`,
        Java: `/**
 * Eager Initialization — instance created when class is loaded.
 * The JVM guarantees that static initializers run exactly once,
 * in a thread-safe manner, before any thread accesses the class.
 */
public final class AppConfig {
    // Eagerly initialized — created at class loading time
    private static final AppConfig INSTANCE = new AppConfig();

    private final String dbUrl;
    private final boolean debug;

    private AppConfig() {
        this.dbUrl = "postgres://localhost:5432/mydb";
        this.debug = false;
    }

    /** Returns pre-created instance. No synchronization needed. */
    public static AppConfig getInstance() {
        return INSTANCE;
    }

    public String getDbUrl() { return dbUrl; }
}`,
        TypeScript: `/**
 * Eager Initialization — instance created at module evaluation.
 * ES modules are evaluated once, so this is naturally a singleton.
 */
class AppConfig {
  readonly dbUrl: string;
  readonly debug: boolean;

  // Constructor is public here since we control instantiation
  constructor() {
    this.dbUrl = "postgres://localhost:5432/mydb";
    this.debug = false;
  }
}

// Created immediately when the module is imported
const instance = new AppConfig();

/** Returns the singleton instance. */
export function getConfig(): AppConfig {
  return instance;
}

// ── Usage ──
const cfg = getConfig();
console.log(cfg.dbUrl);`,
        Rust: `use std::sync::OnceLock;

/// Eager-like initialization using lazy_static or OnceLock.
/// Rust doesn't support non-trivial static constructors,
/// so we approximate "eager" via OnceLock called at startup.
struct AppConfig {
    db_url: String,
    debug: bool,
}

static APP_CONFIG: OnceLock<AppConfig> = OnceLock::new();

/// Initialize at program start — call this from main().
fn init_config() {
    APP_CONFIG.get_or_init(|| AppConfig {
        db_url: "postgres://localhost:5432/mydb".into(),
        debug: false,
    });
}

fn get_config() -> &'static AppConfig {
    APP_CONFIG.get().expect("Config not initialized — call init_config()")
}

fn main() {
    init_config(); // Eager: initialize immediately at startup
    let cfg = get_config();
    println!("{}", cfg.db_url);
}`,
      },
      pros: [
        "Simplest implementation — no synchronization code needed",
        "Inherently thread-safe (class loading is thread-safe in Java; module loading is thread-safe in Python)",
        "No overhead from locks on every access",
      ],
      cons: [
        "Wastes resources if the singleton is never used during the program's lifetime",
        "No control over initialization order when multiple singletons depend on each other",
        "Cannot pass runtime parameters to the constructor",
      ],
    },
    {
      id: 2,
      name: "Double-Checked Locking",
      description:
        "Combines lazy initialization with minimal locking. The first check avoids acquiring the lock on every call; the second check (inside the lock) prevents duplicate creation. Requires volatile/atomic in languages with memory reordering.",
      code: {
        Python: `import threading

# Double-Checked Locking — lazy init with minimal lock contention.
# After the instance is created, no thread acquires the lock again.

class DatabasePool:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.pool_size = 10
        self.host = "db.prod.internal"

    @classmethod
    def get_instance(cls) -> "DatabasePool":
        # 1st check: fast path — no lock if already initialized
        if cls._instance is None:
            with cls._lock:
                # 2nd check: prevents race between threads
                # that both passed the 1st check
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

# ── Usage ──
pool = DatabasePool.get_instance()
print(pool.host, pool.pool_size)`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// DatabasePool — double-checked locking (manual implementation).
// Note: in Go, sync.Once is preferred. This shows the pattern.
type DatabasePool struct {
	PoolSize int
	Host     string
}

var (
	dbInstance *DatabasePool
	dbMu      sync.Mutex
)

// GetDatabasePool — manual double-checked locking.
func GetDatabasePool() *DatabasePool {
	if dbInstance == nil { // 1st check (no lock)
		dbMu.Lock()
		defer dbMu.Unlock()
		if dbInstance == nil { // 2nd check (locked)
			dbInstance = &DatabasePool{
				PoolSize: 10,
				Host:     "db.prod.internal",
			}
		}
	}
	return dbInstance
}

func main() {
	pool := GetDatabasePool()
	fmt.Println(pool.Host, pool.PoolSize)
}`,
        Java: `/**
 * Double-Checked Locking — the classic Java approach.
 * "volatile" is ESSENTIAL to prevent the JVM from reordering
 * the instance's constructor and the assignment to the field.
 */
public final class DatabasePool {
    // volatile ensures all threads see the fully-constructed object
    private static volatile DatabasePool instance;

    private final int poolSize;
    private final String host;

    private DatabasePool() {
        this.poolSize = 10;
        this.host = "db.prod.internal";
    }

    public static DatabasePool getInstance() {
        if (instance == null) {             // 1st check — fast path
            synchronized (DatabasePool.class) {
                if (instance == null) {     // 2nd check — safe
                    instance = new DatabasePool();
                }
            }
        }
        return instance;
    }

    public String getHost() { return host; }
    public int getPoolSize() { return poolSize; }
}`,
        TypeScript: `/**
 * Double-Checked Locking — TypeScript version.
 * Since JS is single-threaded, there's no real concurrency concern.
 * This pattern is shown for completeness / educational purposes.
 */
class DatabasePool {
  private static instance: DatabasePool;

  readonly poolSize: number;
  readonly host: string;

  private constructor() {
    this.poolSize = 10;
    this.host = "db.prod.internal";
  }

  static getInstance(): DatabasePool {
    // In single-threaded JS, the first check is sufficient
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }
}

// ── Usage ──
const pool = DatabasePool.getInstance();
console.log(pool.host, pool.poolSize);`,
        Rust: `use std::sync::{Mutex, OnceLock};

/// Double-checked locking in Rust using OnceLock.
/// OnceLock internally implements double-checked locking,
/// so you get the pattern "for free" without writing it manually.
struct DatabasePool {
    pool_size: usize,
    host: String,
}

static DB_POOL: OnceLock<DatabasePool> = OnceLock::new();

fn get_database_pool() -> &'static DatabasePool {
    // OnceLock::get_or_init handles all synchronization
    DB_POOL.get_or_init(|| DatabasePool {
        pool_size: 10,
        host: "db.prod.internal".into(),
    })
}

fn main() {
    let pool = get_database_pool();
    println!("{} {}", pool.host, pool.pool_size);
}`,
      },
      pros: [
        "Lazy initialization — instance created only when first needed",
        "After creation, no lock is acquired — zero overhead on subsequent calls",
        "Fine-grained control over initialization logic",
      ],
      cons: [
        "Requires volatile/atomic memory semantics — easy to get wrong in Java/C++",
        "More complex than eager or enum-based approaches",
        "In languages with a GIL (Python) or single-threaded runtime (JS), the extra complexity is unnecessary",
      ],
    },
    {
      id: 3,
      name: "Bill Pugh / Initialization-on-Demand Holder (Java)",
      description:
        "Leverages the JVM's class loading mechanism: an inner static holder class is not loaded until it's referenced. This gives lazy initialization without any synchronization code, because class loading is inherently thread-safe in the JVM.",
      code: {
        Python: `# Python equivalent: use a module-level function with a nested function.
# Python's import system acts as the "class loader" — modules are
# only executed once, even when imported from multiple threads.

class Logger:
    def __init__(self):
        self.level = "INFO"
        self.output = "stdout"

    def log(self, msg: str):
        print(f"[{self.level}] {msg}")

def _create_logger():
    \"\"\"Inner function that creates the singleton once.\"\"\"
    return Logger()

# Module-level: executed once when the module is first imported
_logger = _create_logger()

def get_logger() -> Logger:
    \"\"\"Returns the singleton logger instance.\"\"\"
    return _logger

# ── Usage ──
log = get_logger()
log.log("System started")`,
        Go: `package main

import (
	"fmt"
	"sync"
)

// In Go, the "Bill Pugh" idiom maps to sync.Once:
// the initializer is deferred until first call and runs exactly once.

type Logger struct {
	Level  string
	Output string
}

var (
	loggerInstance *Logger
	loggerOnce    sync.Once
)

func GetLogger() *Logger {
	loggerOnce.Do(func() {
		loggerInstance = &Logger{
			Level:  "INFO",
			Output: "stdout",
		}
	})
	return loggerInstance
}

func main() {
	log := GetLogger()
	fmt.Printf("[%s] System started\\n", log.Level)
}`,
        Java: `/**
 * Bill Pugh Singleton — Initialization-on-Demand Holder pattern.
 * The inner static class is not loaded until getInstance() is called.
 * Class loading is inherently thread-safe in the JVM — no locks needed.
 *
 * This is considered the BEST way to implement Singleton in Java.
 */
public final class Logger {
    private final String level;
    private final String output;

    private Logger() {
        this.level = "INFO";
        this.output = "stdout";
    }

    /**
     * Static inner class — loaded by JVM only when first referenced.
     * The JVM guarantees thread-safe class initialization.
     */
    private static class Holder {
        static final Logger INSTANCE = new Logger();
    }

    /** Triggers loading of Holder → creates instance exactly once. */
    public static Logger getInstance() {
        return Holder.INSTANCE;
    }

    public void log(String msg) {
        System.out.printf("[%s] %s%n", level, msg);
    }
}`,
        TypeScript: `/**
 * In TypeScript/JavaScript, the module system provides
 * the same guarantee as Java's class loading:
 * a module is evaluated exactly once.
 */

class Logger {
  readonly level: string;
  readonly output: string;

  private constructor() {
    this.level = "INFO";
    this.output = "stdout";
  }

  log(msg: string): void {
    console.log(\`[\${this.level}] \${msg}\`);
  }

  // Holder-like: the instance is created inside a static block
  // which runs once when the class is first used
  private static readonly _instance = new Logger();

  static getInstance(): Logger {
    return Logger._instance;
  }
}

// ── Usage ──
Logger.getInstance().log("System started");`,
        Rust: `use std::sync::OnceLock;

/// In Rust, OnceLock provides the same deferred initialization
/// guarantee as Java's holder pattern.
struct Logger {
    level: String,
    output: String,
}

impl Logger {
    fn log(&self, msg: &str) {
        println!("[{}] {}", self.level, msg);
    }
}

static LOGGER: OnceLock<Logger> = OnceLock::new();

fn get_logger() -> &'static Logger {
    LOGGER.get_or_init(|| Logger {
        level: "INFO".into(),
        output: "stdout".into(),
    })
}

fn main() {
    get_logger().log("System started");
}`,
      },
      pros: [
        "Lazy initialization without any synchronization code",
        "Thread-safe by virtue of the JVM's class loading guarantee",
        "Considered the idiomatic and best approach in Java",
        "Zero performance overhead — no volatile, no synchronized",
      ],
      cons: [
        "Java-specific idiom — doesn't translate directly to other languages",
        "Cannot accept runtime parameters during initialization (same as eager)",
        "Slightly less obvious to developers unfamiliar with class loading semantics",
      ],
    },
    {
      id: 4,
      name: "Enum-Based Singleton (Java)",
      description:
        "Uses a Java enum with a single constant. The JVM guarantees exactly one instance, handles serialization, and prevents reflection-based attacks. Joshua Bloch (Effective Java) calls this 'the best way to implement a singleton in Java'.",
      code: {
        Python: `from enum import Enum

# Python's Enum can simulate Java's enum singleton pattern.
# Each enum member is instantiated exactly once.

class CacheManager(Enum):
    INSTANCE = "INSTANCE"

    def __init__(self, _):
        self._data = {}

    def put(self, key: str, value):
        self._data[key] = value

    def get(self, key: str):
        return self._data.get(key)

# ── Usage ──
cache = CacheManager.INSTANCE
cache.put("user:42", {"name": "Alice"})
print(cache.get("user:42"))

# CacheManager.INSTANCE is CacheManager.INSTANCE → True
print(cache is CacheManager.INSTANCE)  # True`,
        Go: `package main

import "fmt"

// Go doesn't have enums, but we can achieve the same effect
// with a package-level unexported struct and exported variable.

type cacheManager struct {
	data map[string]interface{}
}

func (c *cacheManager) Put(key string, val interface{}) {
	c.data[key] = val
}

func (c *cacheManager) Get(key string) interface{} {
	return c.data[key]
}

// CacheManager is the singleton — package-level, unexported type
var CacheManager = &cacheManager{
	data: make(map[string]interface{}),
}

func main() {
	CacheManager.Put("user:42", "Alice")
	fmt.Println(CacheManager.Get("user:42"))
}`,
        Java: `/**
 * Enum-Based Singleton — the simplest, most robust approach in Java.
 * 
 * Advantages over all other methods:
 * 1. JVM guarantees exactly one instance per enum constant
 * 2. Serialization-safe — no special readResolve() needed
 * 3. Reflection-safe — cannot create enum instances via reflection
 * 4. Thread-safe — enum constants are initialized once, safely
 */
public enum CacheManager {
    INSTANCE;  // The single instance

    private final java.util.Map<String, Object> data
        = new java.util.concurrent.ConcurrentHashMap<>();

    /** Store a key-value pair in the cache. */
    public void put(String key, Object value) {
        data.put(key, value);
    }

    /** Retrieve a value by key. */
    public Object get(String key) {
        return data.get(key);
    }
}

// ── Usage ──
// CacheManager.INSTANCE.put("user:42", "Alice");
// CacheManager.INSTANCE.get("user:42");`,
        TypeScript: `/**
 * TypeScript doesn't have Java-style enums with behavior,
 * but we can use a const object + Object.freeze for immutability.
 */
class CacheManagerImpl {
  private data = new Map<string, unknown>();

  put(key: string, value: unknown): void {
    this.data.set(key, value);
  }

  get(key: string): unknown {
    return this.data.get(key);
  }
}

// Singleton via frozen module export — cannot be reassigned
export const CacheManager = Object.freeze(new CacheManagerImpl());

// ── Usage ──
CacheManager.put("user:42", { name: "Alice" });
console.log(CacheManager.get("user:42"));`,
        Rust: `use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

/// Rust doesn't have Java-style enums with data,
/// but OnceLock<T> serves the same purpose:
/// exactly one instance, lazily and thread-safely created.

struct CacheManager {
    data: Mutex<HashMap<String, String>>,
}

static CACHE: OnceLock<CacheManager> = OnceLock::new();

fn cache() -> &'static CacheManager {
    CACHE.get_or_init(|| CacheManager {
        data: Mutex::new(HashMap::new()),
    })
}

fn main() {
    cache().data.lock().unwrap()
        .insert("user:42".into(), "Alice".into());

    let data = cache().data.lock().unwrap();
    println!("{:?}", data.get("user:42"));
}`,
      },
      pros: [
        "Serialization-safe without custom readResolve()",
        "Reflection-safe — JVM prevents instantiating enum via reflection",
        "Simplest possible code — just declare an enum with one constant",
        "Joshua Bloch recommends this as the preferred approach in Java",
      ],
      cons: [
        "Java-only idiom — no direct equivalent in most other languages",
        "Cannot extend another class (enums implicitly extend java.lang.Enum)",
        "Eager initialization only — the enum constant is created at class loading",
        "Unfamiliar syntax for developers used to class-based singletons",
      ],
    },
    {
      id: 5,
      name: "Module / Global-Level Singleton",
      description:
        "In languages with module systems (Python, JavaScript/TypeScript, Rust), simply export a single instance from a module. The language runtime guarantees the module is evaluated exactly once. This is the simplest and most idiomatic approach for these languages.",
      code: {
        Python: `# Module-Level Singleton — the Pythonic way.
# Python's import system guarantees a module is executed once.
# sys.modules caches the module object, so all imports get the same instance.

class _EventBus:
    \"\"\"Private class — users interact via the module-level instance.\"\"\"
    def __init__(self):
        self._subscribers: dict[str, list] = {}

    def subscribe(self, event: str, callback):
        \"\"\"Register a callback for an event type.\"\"\"
        self._subscribers.setdefault(event, []).append(callback)

    def publish(self, event: str, data=None):
        \"\"\"Notify all subscribers of an event.\"\"\"
        for cb in self._subscribers.get(event, []):
            cb(data)

# THE singleton — created once when module is imported
event_bus = _EventBus()

# ── Usage (from another module) ──
# from event_bus_module import event_bus
# event_bus.subscribe("order.placed", handle_order)
# event_bus.publish("order.placed", {"id": 42})`,
        Go: `package main

import "fmt"

// Module-Level Singleton — Go uses package-level variables.
// Go's package initialization runs exactly once per program,
// making this the idiomatic Go singleton approach.

type eventBus struct {
	subscribers map[string][]func(interface{})
}

func (eb *eventBus) Subscribe(event string, cb func(interface{})) {
	eb.subscribers[event] = append(eb.subscribers[event], cb)
}

func (eb *eventBus) Publish(event string, data interface{}) {
	for _, cb := range eb.subscribers[event] {
		cb(data)
	}
}

// Package-level singleton — initialized once at package load
var EventBus = &eventBus{
	subscribers: make(map[string][]func(interface{})),
}

func main() {
	EventBus.Subscribe("order.placed", func(data interface{}) {
		fmt.Println("Order received:", data)
	})
	EventBus.Publish("order.placed", map[string]int{"id": 42})
}`,
        Java: `/**
 * Java doesn't have "module-level singletons" like Python/JS,
 * but you can approximate it with a utility class + static field.
 * The closest Java idiom is the Enum-Based or Holder approach.
 */
public final class EventBus {
    // Eager module-level equivalent
    private static final EventBus INSTANCE = new EventBus();

    private final java.util.Map<String, java.util.List<java.util.function.Consumer<Object>>>
        subscribers = new java.util.concurrent.ConcurrentHashMap<>();

    private EventBus() {}

    public static EventBus getInstance() {
        return INSTANCE;
    }

    public void subscribe(String event, java.util.function.Consumer<Object> cb) {
        subscribers.computeIfAbsent(event, k -> 
            java.util.Collections.synchronizedList(new java.util.ArrayList<>())
        ).add(cb);
    }

    public void publish(String event, Object data) {
        var subs = subscribers.get(event);
        if (subs != null) subs.forEach(cb -> cb.accept(data));
    }
}`,
        TypeScript: `/**
 * Module-Level Singleton — the most idiomatic approach in TypeScript.
 * ES modules are evaluated exactly once by the runtime.
 * All importers receive the SAME object reference.
 */

type Callback = (data: unknown) => void;

class EventBus {
  private subscribers = new Map<string, Callback[]>();

  /** Register a callback for an event type. */
  subscribe(event: string, cb: Callback): void {
    const list = this.subscribers.get(event) ?? [];
    list.push(cb);
    this.subscribers.set(event, list);
  }

  /** Notify all subscribers of an event. */
  publish(event: string, data?: unknown): void {
    (this.subscribers.get(event) ?? []).forEach(cb => cb(data));
  }
}

// THE singleton — created once when module is evaluated
export const eventBus = new EventBus();

// ── Usage (from another module) ──
// import { eventBus } from "./eventBus";
// eventBus.subscribe("order.placed", handleOrder);
// eventBus.publish("order.placed", { id: 42 });`,
        Rust: `use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

/// Module-Level Singleton in Rust.
/// Rust requires static items to be thread-safe (Send + Sync).
/// OnceLock makes this ergonomic and safe.

type Callback = Box<dyn Fn(&str) + Send + Sync>;

struct EventBus {
    subscribers: Mutex<HashMap<String, Vec<Callback>>>,
}

static EVENT_BUS: OnceLock<EventBus> = OnceLock::new();

fn event_bus() -> &'static EventBus {
    EVENT_BUS.get_or_init(|| EventBus {
        subscribers: Mutex::new(HashMap::new()),
    })
}

fn main() {
    // Subscribe
    {
        let mut subs = event_bus().subscribers.lock().unwrap();
        subs.entry("order.placed".into())
            .or_default()
            .push(Box::new(|data| println!("Order: {}", data)));
    }

    // Publish
    {
        let subs = event_bus().subscribers.lock().unwrap();
        if let Some(cbs) = subs.get("order.placed") {
            for cb in cbs { cb("id=42"); }
        }
    }
}`,
      },
      pros: [
        "Simplest possible implementation — just export an instance",
        "Language runtime guarantees single evaluation (Python, JS, Go)",
        "No boilerplate — no getInstance(), no locks, no volatile",
        "Most idiomatic approach for Python, TypeScript, and Go",
      ],
      cons: [
        "Not truly lazy in all runtimes — module may be evaluated at import time",
        "Harder to mock in tests (but can be mitigated with dependency injection)",
        "Not applicable in Java (no module-level instances)",
        "In bundlers (Webpack), code splitting may create separate module instances if misconfigured",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Thread-Safe", "Lazy", "Serialization-Safe", "Complexity", "Recommended For",
  ],
  comparisonRows: [
    ["Eager Init", "✓", "✗", "Needs readResolve", "Low", "Simple cases, always-used singletons"],
    ["Double-Checked Locking", "✓ (with volatile)", "✓", "Needs readResolve", "Medium", "Java/C++ when lazy init is needed"],
    ["Bill Pugh / Holder", "✓", "✓", "Needs readResolve", "Low", "Java (preferred approach)"],
    ["Enum-Based", "✓", "✗", "✓ (automatic)", "Lowest", "Java (Effective Java recommendation)"],
    ["Module-Level", "✓ (runtime)", "At import", "N/A", "Lowest", "Python, TypeScript, Go, Rust"],
  ],

  // ─── SUMMARY ────────────────────────────────────────────────────
  summary: [
    { aspect: "Pattern Type", detail: "Creational" },
    {
      aspect: "Key Benefit",
      detail:
        "Guarantees a single, consistent instance for shared resources — eliminates configuration drift and resource duplication",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Hidden global state makes testing difficult; use dependency injection to pass the instance rather than calling getInstance() everywhere",
    },
    {
      aspect: "Thread Safety",
      detail:
        "Eager init is inherently safe; lazy init requires synchronization (volatile + DCL in Java, Lock in Python, sync.Once in Go, OnceLock in Rust)",
    },
    {
      aspect: "Best Approach",
      detail:
        "Java → Enum or Bill Pugh Holder | Python → module-level instance | Go → sync.Once | TypeScript → module export | Rust → OnceLock",
    },
    {
      aspect: "When to Use",
      detail:
        "Shared configuration, connection pools, caches, logging, metrics collectors, device managers — anything where multiple instances cause inconsistency",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Stateless services, request-scoped data, anything where per-instance isolation is important (e.g., user sessions)",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (often implemented as Singleton), Flyweight (shared instance pool), Monostate (alternative with instance-like API), Registry (multiple named singletons)",
    },
  ],

  // ─── ANTI-PATTERNS ──────────────────────────────────────────────
  antiPatterns: [
    {
      name: "God Object Singleton",
      description:
        "Stuffing too many responsibilities into a single Singleton class — config, logging, DB access, caching, email — turning it into a bloated, untestable 'god object' that everything depends on.",
      betterAlternative:
        "Split responsibilities into separate Singletons or, better yet, use dependency injection with single-instance scope. Each concern gets its own focused class.",
    },
    {
      name: "Singleton as Global Mutable State",
      description:
        "Using Singleton primarily to share mutable state across unrelated parts of the system. Any module can mutate the singleton, leading to unpredictable side effects, race conditions, and impossible-to-debug failures.",
      betterAlternative:
        "Make singleton immutable after initialization (readonly fields). For mutable shared state, use an explicitly-passed state container with controlled mutation APIs.",
    },
    {
      name: "Tight Coupling via getInstance()",
      description:
        "Calling getInstance() directly inside business logic scatters hard dependencies throughout the codebase. Every class that calls getInstance() is coupled to the concrete Singleton, making it impossible to substitute mocks in tests.",
      betterAlternative:
        "Inject the singleton via constructor parameters or dependency injection framework. Classes depend on an interface, not the concrete Singleton class.",
    },
    {
      name: "Singleton in Multi-Tenant / Multi-Classloader Environments",
      description:
        "Assuming 'one JVM = one instance.' In application servers, OSGi, or plugin architectures, each classloader gets its own copy of static fields — silently creating multiple 'singletons.'",
      betterAlternative:
        "Use the container's built-in scoping (e.g., Spring @Scope('singleton'), CDI @ApplicationScoped) instead of hand-rolled static singletons.",
    },
    {
      name: "Lazy Singleton Without Thread Safety",
      description:
        "Implementing lazy initialization without any synchronization. Under high concurrency, multiple threads create separate instances, defeating the entire purpose of the pattern.",
      betterAlternative:
        "Use double-checked locking with volatile (Java), sync.Once (Go), OnceLock (Rust), or simply use eager initialization if laziness is not critical.",
    },
    {
      name: "Singleton for Request-Scoped Data",
      description:
        "Using a Singleton to hold user session data, request context, or per-request state. Since the singleton is shared across all requests, one user's data leaks into another's — a critical security vulnerability.",
      betterAlternative:
        "Use request-scoped or thread-local storage for per-request data. Reserve Singleton for truly application-wide, immutable resources.",
    },
  ],
};

export default singletonData;
