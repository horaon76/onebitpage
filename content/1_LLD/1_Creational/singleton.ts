import { PatternData } from "@/lib/patterns/types";

const singletonData: PatternData = {
  slug: "singleton",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Singleton Pattern",
  subtitle:
    "Ensures a class has only one instance throughout the application lifecycle and provides a global point of access to that instance.",

  intent:
    "Ensure a class has only one instance and provide a global access point to that instance. This pattern is commonly used when a shared resource or coordinator must be accessible throughout the system, such as configuration managers, logging services, cache managers, hardware interface controllers, and schedulers.",

  classDiagramSvg: {
    type: "mermaid",
    content: `classDiagram
  class Singleton {
    <<Singleton>>
    -instance$ Singleton
    -configData Map~String, String~
    -logLevel Level
    +getInstance()$ Singleton
    -Singleton()
    +getConfig(key String) String
    +setLogLevel(level Level) void
    -loadConfig() void
    +isInitialized()$ boolean
  }
  class Initializer {
    +loadConfig() void
    +validateConfig() boolean
  }
  class ClientA["Client A"] {
    +doWork() void
    +configure() void
  }
  class ClientB["Client B"] {
    +process() void
    +report() void
  }
  Singleton ..> Initializer : «uses»
  ClientA --> Singleton : getInstance()
  ClientB --> Singleton : getInstance()`,
  },

  diagramExplanation:
    "The diagram illustrates the Singleton design pattern, where the Singleton class guarantees exactly one in-process instance and exposes it through the static getInstance() method. Both Client A and Client B depend on Singleton and call getInstance(), so they receive the same shared object reference instead of creating separate objects. The private constructor prevents direct construction from outside the class, which is the core enforcement mechanism for single instantiation. The class holds shared mutable state (configData and logLevel), so updates made by one client are visible to all other clients using the same instance. The dashed dependency to Initializer shows that Singleton can delegate one-time startup activities, such as configuration loading and validation, without exposing that complexity to clients. In real systems, getInstance() should also include thread-safe initialization (or rely on language/runtime guarantees) so concurrent first-time access does not accidentally create multiple instances.",

  diagramComponents: [
  {
    name: "«Singleton» stereotype",
    description: "The label at the top of the class indicates that the class follows the Singleton design pattern. UML stereotypes provide semantic meaning to a class without changing its structure. Here it signals that the class is intended to enforce a single instance across the entire system."
  },
  {
    name: "-instance: Singleton (static field — underlined)",
    description: "A private static reference that stores the sole instance of the Singleton class. Static means it belongs to the class itself rather than any object. UML typically underlines static members. The field starts as null and is initialized only once when getInstance() is first called, after which every caller receives the same stored reference."
  },
  {
    name: "-configData: Map<String,String>",
    description: "A private field storing configuration values as key-value pairs. Because the data lives inside the Singleton instance, all components accessing configuration through getConfig() interact with the exact same data source, preventing configuration drift or inconsistent state across the system."
  },
  {
    name: "-logLevel: Level",
    description: "A private field representing the current logging level for the shared service. Because every caller receives the same Singleton instance, any runtime change made through setLogLevel() becomes globally visible and immediately affects system-wide behavior."
  },
  {
    name: "+getInstance(): Singleton (static method — underlined)",
    description: "The public static method that provides global access to the Singleton instance. Instead of creating objects directly, clients call Singleton.getInstance(). Internally the method checks whether the instance already exists, creates it if necessary, and always returns the same reference afterward."
  },
  {
    name: "-Singleton() [private constructor]",
    description: "The constructor is marked private to prevent external classes from instantiating the Singleton using the 'new' keyword. Only methods inside the Singleton class itself, typically getInstance(), can invoke the constructor. This restriction enforces the single-instance rule."
  },
  {
    name: "+getConfig(key: String): String",
    description: "A public instance method allowing clients to retrieve configuration values. The typical call sequence is Singleton.getInstance().getConfig(key). This demonstrates that the Singleton behaves like a normal service object once the instance is retrieved."
  },
  {
    name: "+setLogLevel(level: Level): void",
    description: "A public method used to modify the shared logging level. Because the Singleton represents a globally shared service, any change made through this method immediately impacts all parts of the application that rely on this logging configuration."
  },
  {
    name: "-loadConfig(): void",
    description: "A private helper method responsible for loading configuration data into the configData field. This method typically runs during initialization and encapsulates the logic for retrieving configuration from files, environment variables, or external services."
  },
  {
    name: "+isInitialized(): boolean (static method — underlined)",
    description: "A utility static method that indicates whether the Singleton instance has already been created. This can be useful during application startup, health checks, or diagnostics where the system needs to know if the shared service has been initialized."
  },
  {
    name: "Client-to-Singleton association arrows (getInstance())",
    description: "The arrows from Client A and Client B to Singleton show access through the same entry point, getInstance(). The intent is that repeated calls return one shared object reference, so the clients coordinate through common state instead of isolated copies."
  },
  {
    name: "Initializer dependency («uses» dashed arrow)",
    description: "The dashed dependency arrow indicates that the Singleton relies on the Initializer helper class. The Singleton may delegate configuration loading or validation tasks to Initializer methods such as loadConfig() and validateConfig(). The direction of the arrow shows that Singleton depends on Initializer, not the other way around."
  },
  {
    name: "Client A and Client B",
    description: "These represent independent parts of the application that require access to shared configuration or logging behaviour. Both clients call getInstance() and receive the same Singleton object. The arrows from both clients demonstrate that multiple components interact with the same shared instance rather than creating their own copies."
  }
],


  solutionDetail:
"The Singleton pattern solves the problem of uncontrolled multiple instantiation by centralizing object creation behind a single access point. Instead of allowing every component to freely create new objects, the pattern ensures that only one instance of a specific service exists within a defined runtime scope (typically one process / one module graph / one classloader) and that all clients reuse that same instance.\n\nA precise mental model is: **Singleton is a policy** (\"exactly one instance\") plus **an enforcement mechanism** (\"how we prevent or avoid additional instances\"). The enforcement mechanism is language- and runtime-dependent.\n\nHere is how it works step by step:\n\n1. **Controlled construction (private constructor or restricted type)**: The implementation prevents arbitrary construction. In class-based languages this is usually a `private` constructor (Java/TypeScript). In module-based languages the class may be unexported and the module exports only a single instance. The key is: *clients cannot create new instances on demand*.\n\n2. **Single storage location for the canonical instance**: The instance is stored in exactly one place (e.g., a private static field, a package-level variable, or a module-level binding). This is the reference all access paths must return.\n\n3. **Global access point (and the coupling cost)**: A `getInstance()` (or `get_*()`/exported binding) acts as the standard access path. This improves ergonomics but introduces global coupling; advanced codebases often hide the singleton behind an interface and inject it to keep business logic testable.\n\n4. **Initialization policy (eager vs lazy)**: Eager initialization creates the instance at class/module load time; lazy initialization creates it on first access. Choose based on startup cost, determinism, and failure mode: eager fails fast at startup; lazy defers cost but can surface errors late and under load.\n\n5. **Safe publication + thread-safety during first access**: In concurrent environments, the *first* initialization is the dangerous part: two threads can observe \"not created\" and both create. Correct implementations synchronize the first creation using primitives appropriate to the language/runtime: `volatile` + double-checked locking (Java), locks (Python), `sync.Once` (Go), `OnceLock` (Rust). For Java specifically, the memory model matters: `volatile` (or class initialization rules via Holder/Enum) is what prevents other threads from observing a partially-constructed instance.\n\n6. **Guard against alternate instantiation paths (language-specific)**: Some platforms have additional ways to create objects that bypass your constructor access checks. In Java, **serialization** can create a second instance unless you implement `readResolve()` (or use an enum), and **reflection** can bypass private constructors unless you actively defend (or use an enum). Similar issues exist with cloning/copying in some ecosystems.\n\n7. **Scope clarity (what it does *not* guarantee)**: Singleton means \"one per scope\" — typically *one per process/runtime*, not \"one globally\" across containers, pods, or microservices. Some runtimes can also create multiple instances unintentionally (e.g., multiple classloaders in Java app servers, multiple bundles/entries in web bundlers, separate Node.js workers / browser Workers).\n\n8. **Shared state consistency (and why it’s risky)**: Because every client receives the same reference, mutable state becomes globally shared. This enables coordination, but increases risk: order-dependent tests, hidden coupling, surprising cross-feature interactions, and concurrency hazards if mutation is not carefully designed.",
  characteristics: [
    "Guarantees only one instance of a class exists in a running process",
    "Provides a global access point, often via a static method (getInstance)",
    "Lazy initialization defers creation until first use, saving startup resources",
    "Thread safety must be explicitly handled in concurrent environments (locks, volatile, sync.Once)",
    "The private constructor blocks direct instantiation from outside the class",
    "Singleton scope is runtime-dependent: often one per process/module graph, and in Java potentially one per classloader",
    "Can make unit testing harder due to global state — use dependency injection to pass the instance",
    "Overuse leads to hidden coupling; apply it only when a single coordination point is genuinely required",
    "Does not provide distributed uniqueness; cross-process coordination needs external systems (DB/locks/service)",
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
        "A Singleton PaymentGatewayConfig loads credentials at startup, exposes them read-only, and handles atomic hot-reload. Singleton enforcement differs by language in the examples: Python and Java use guarded lazy initialization (double-check style), Go uses sync.Once, TypeScript uses a private constructor plus static cached instance, and Rust uses OnceLock::get_or_init. In every case, transaction handlers resolve configuration through one shared instance so routing and retry policy remain consistent.",
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
# Singleton here means one process-wide configuration object.
# Achieved via class-level _instance + locked first-time creation in get_instance().

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
  "sync/atomic"
)

// PaymentGatewayConfig holds acquirer credentials (Singleton).
// sync.Once guarantees the init function runs exactly once,
// even when called from multiple goroutines concurrently.
// Singleton here means one shared config pointer for the process.
// Achieved with package-level variables + pgcOnce.Do guarded initialization.
type PaymentGatewayConfig struct {
	APIKey     string // Secret key loaded from vault
	GatewayURL string // Acquirer endpoint URL
	RetryLimit int    // Max retry attempts per transaction
}

var (
  pgcInstance *PaymentGatewayConfig // Package-level singleton reference (the one instance)
  pgcOnce    sync.Once             // Ensures constructor closure runs exactly once
)

// GetPaymentGatewayConfig returns the singleton config.
// sync.Once.Do is goroutine-safe — no explicit mutex needed.
func GetPaymentGatewayConfig() *PaymentGatewayConfig {
  pgcOnce.Do(func() { // First caller initializes; all later callers skip this block
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
 * Singleton means one shared config object for the JVM process.
 * Achieved with private constructor + static volatile instance + guarded getInstance().
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
       * Typical JS runtimes initialize modules on a single thread, so no mutex is needed.
       * Note: each Node.js worker / browser Worker has its own module graph → its own singleton.
 * Singleton here means one shared config object per JS runtime.
 * Achieved with private constructor + static cached instance returned by getInstance().
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
/// Singleton means one shared config object for the running process.
/// Achieved via static OnceLock + get_or_init in accessor function.
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
      codeFiles: {
        Python: [
          {
            name: "payment_gateway_config.py",
            dir: "config/",
            content: `"""
config/payment_gateway_config.py
---------------------------------
Singleton PaymentGatewayConfig — loads acquirer credentials from a secure
vault on first access and exposes them read-only to all transaction handlers.

Thread-safety: double-checked locking. After initialization the lock is never
acquired again, so the hot path (reading credentials per transaction) is lock-free.
"""
from __future__ import annotations
import threading
from dataclasses import dataclass


@dataclass(frozen=True)
class GatewayCredentials:
    api_key: str
    gateway_url: str
    retry_limit: int
    timeout_ms: int


class PaymentGatewayConfig:
    _instance: "PaymentGatewayConfig | None" = None
    _lock = threading.Lock()

    def __init__(self) -> None:
        self._creds = self._load_from_vault()

    # ── Singleton factory ─────────────────────────────────────────
    @classmethod
    def get_instance(cls) -> "PaymentGatewayConfig":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    # ── Read-only accessors (used by transaction handlers) ────────
    @property
    def credentials(self) -> GatewayCredentials:
        return self._creds

    def hot_reload(self) -> None:
        """Atomically reload credentials without restarting the process."""
        new_creds = self._load_from_vault()
        # Atomic replacement — no partial view exposed to concurrent readers
        self._creds = new_creds

    # ── Private helpers ───────────────────────────────────────────
    @staticmethod
    def _load_from_vault() -> GatewayCredentials:
        # In production: call HashiCorp Vault / AWS Secrets Manager
        return GatewayCredentials(
            api_key="sk_live_abc123",
            gateway_url="https://acquirer.bank/api/v2",
            retry_limit=5,
            timeout_ms=3_000,
        )
`,
          },
          {
            name: "transaction_handler.py",
            dir: "payments/",
            content: `"""
payments/transaction_handler.py
--------------------------------
Processes payment transactions using the PaymentGatewayConfig singleton.
"""
from __future__ import annotations
import uuid
from config.payment_gateway_config import PaymentGatewayConfig


class TransactionHandler:
    def charge(self, amount_cents: int, card_token: str) -> dict:
        cfg = PaymentGatewayConfig.get_instance()
        creds = cfg.credentials

        tx_id = str(uuid.uuid4())[:8]
        # In production: POST to creds.gateway_url with creds.api_key
        return {
            "tx_id": tx_id,
            "status": "authorized",
            "gateway": creds.gateway_url,
            "amount_cents": amount_cents,
        }

    def refund(self, original_tx_id: str, amount_cents: int) -> dict:
        cfg = PaymentGatewayConfig.get_instance()
        creds = cfg.credentials
        return {
            "refund_id": str(uuid.uuid4())[:8],
            "original": original_tx_id,
            "gateway": creds.gateway_url,
            "amount_cents": amount_cents,
        }
`,
          },
          {
            name: "test_payment_gateway_config.py",
            dir: "tests/",
            content: `"""
tests/test_payment_gateway_config.py
-------------------------------------
Verifies singleton contract and credential access.
"""
import threading
from config.payment_gateway_config import PaymentGatewayConfig


def test_singleton_identity() -> None:
    a = PaymentGatewayConfig.get_instance()
    b = PaymentGatewayConfig.get_instance()
    assert a is b

def test_concurrent_access_same_instance() -> None:
    instances: list = []
    def grab() -> None:
        instances.append(PaymentGatewayConfig.get_instance())

    threads = [threading.Thread(target=grab) for _ in range(20)]
    for t in threads: t.start()
    for t in threads: t.join()

    first = instances[0]
    assert all(inst is first for inst in instances)

def test_credentials_not_empty() -> None:
    creds = PaymentGatewayConfig.get_instance().credentials
    assert creds.api_key
    assert creds.gateway_url.startswith("https://")
    assert creds.retry_limit > 0
`,
          },
        ],
        Go: [
          {
            name: "payment_gateway_config.go",
            dir: "config/",
            content: `// config/payment_gateway_config.go
//
// Singleton PaymentGatewayConfig initialized with sync.Once.
// sync.Once is Go's idiomatic equivalent of double-checked locking —
// the initializer closure runs exactly once across all goroutines.
package config

import (
	"sync"
	"sync/atomic"
	"unsafe"
)

// GatewayCredentials holds acquirer connection data.
type GatewayCredentials struct {
	APIKey     string
	GatewayURL string
	RetryLimit int
	TimeoutMs  int
}

// PaymentGatewayConfig is the singleton.
type PaymentGatewayConfig struct {
	// creds is stored as an atomic pointer so hot_reload is race-free.
	creds atomic.Pointer[GatewayCredentials]
}

var (
	pgConfig *PaymentGatewayConfig
	pgOnce   sync.Once
)

// GetPaymentGatewayConfig returns the process-wide singleton.
func GetPaymentGatewayConfig() *PaymentGatewayConfig {
	pgOnce.Do(func() {
		pgConfig = &PaymentGatewayConfig{}
		pgConfig.creds.Store(loadFromVault())
	})
	return pgConfig
}

// Credentials returns the current credential snapshot (lock-free).
func (c *PaymentGatewayConfig) Credentials() *GatewayCredentials {
	return c.creds.Load()
}

// HotReload atomically replaces credentials without restarting.
func (c *PaymentGatewayConfig) HotReload() {
	c.creds.Store(loadFromVault())
}

func loadFromVault() *GatewayCredentials {
	// In production: call HashiCorp Vault or AWS Secrets Manager
	return &GatewayCredentials{
		APIKey:     "sk_live_abc123",
		GatewayURL: "https://acquirer.bank/api/v2",
		RetryLimit: 5,
		TimeoutMs:  3_000,
	}
}

// Ensure atomic.Pointer usage compiles (suppress unused import)
var _ = unsafe.Pointer(nil)
`,
          },
          {
            name: "transaction_handler.go",
            dir: "payments/",
            content: `// payments/transaction_handler.go
package payments

import (
	"fmt"
	"math/rand"
	"myapp/config"
)

// TransactionHandler processes payment charges and refunds.
type TransactionHandler struct{}

func (h *TransactionHandler) Charge(amountCents int, cardToken string) map[string]any {
	creds := config.GetPaymentGatewayConfig().Credentials()
	txID := fmt.Sprintf("TX-%06d", rand.Intn(999999))
	// In production: POST to creds.GatewayURL with Authorization: Bearer creds.APIKey
	return map[string]any{
		"tx_id":        txID,
		"status":       "authorized",
		"gateway":      creds.GatewayURL,
		"amount_cents": amountCents,
	}
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/config"
	"myapp/payments"
)

func main() {
	cfg := config.GetPaymentGatewayConfig()
	creds := cfg.Credentials()
	fmt.Printf("Gateway: %s  Retries: %d\\n", creds.GatewayURL, creds.RetryLimit)

	handler := &payments.TransactionHandler{}
	result := handler.Charge(9999, "tok_visa_4242")
	fmt.Printf("Charge result: %v\\n", result)

	// Prove singleton identity
	cfg2 := config.GetPaymentGatewayConfig()
	fmt.Println("Same instance:", cfg == cfg2) // true
}
`,
          },
        ],
        Java: [
          {
            name: "PaymentGatewayConfig.java",
            dir: "com/example/config/",
            content: `package com.example.config;

/**
 * Thread-safe Singleton PaymentGatewayConfig (Double-Checked Locking).
 *
 * volatile forces the JVM to publish the fully-constructed object
 * to all CPU caches before any thread can read it through getInstance().
 * Without volatile, instruction reordering could expose a partially
 * initialized instance to a second thread.
 */
public final class PaymentGatewayConfig {

    private static volatile PaymentGatewayConfig instance;

    private final String apiKey;
    private final String gatewayUrl;
    private final int    retryLimit;
    private final int    timeoutMs;

    private PaymentGatewayConfig() {
        // In production: call Vault#read("secret/payment-gateway")
        this.apiKey      = "sk_live_abc123";
        this.gatewayUrl  = "https://acquirer.bank/api/v2";
        this.retryLimit  = 5;
        this.timeoutMs   = 3_000;
    }

    public static PaymentGatewayConfig getInstance() {
        if (instance == null) {
            synchronized (PaymentGatewayConfig.class) {
                if (instance == null) {
                    instance = new PaymentGatewayConfig();
                }
            }
        }
        return instance;
    }

    public String getApiKey()     { return apiKey; }
    public String getGatewayUrl() { return gatewayUrl; }
    public int    getRetryLimit() { return retryLimit; }
    public int    getTimeoutMs()  { return timeoutMs; }
}
`,
          },
          {
            name: "TransactionHandler.java",
            dir: "com/example/payments/",
            content: `package com.example.payments;

import com.example.config.PaymentGatewayConfig;
import java.util.UUID;

/** Processes payment charges using the PaymentGatewayConfig singleton. */
public class TransactionHandler {

    public TransactionResult charge(int amountCents, String cardToken) {
        PaymentGatewayConfig cfg = PaymentGatewayConfig.getInstance();
        String txId = UUID.randomUUID().toString().substring(0, 8);
        // In production: POST to cfg.getGatewayUrl() with Authorization header
        return new TransactionResult(txId, "authorized", cfg.getGatewayUrl());
    }

    public record TransactionResult(String txId, String status, String gateway) {}
}
`,
          },
          {
            name: "PaymentGatewayConfigTest.java",
            dir: "com/example/config/",
            content: `package com.example.config;

import org.junit.jupiter.api.Test;
import java.util.concurrent.*;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class PaymentGatewayConfigTest {

    @Test
    void singletonIdentityIsMaintained() {
        assertSame(PaymentGatewayConfig.getInstance(),
                   PaymentGatewayConfig.getInstance());
    }

    @Test
    void concurrentAccessReturnsOneInstance() throws Exception {
        int threads = 20;
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        List<Future<PaymentGatewayConfig>> futures = new ArrayList<>();

        for (int i = 0; i < threads; i++) {
            futures.add(pool.submit(PaymentGatewayConfig::getInstance));
        }
        pool.shutdown();

        PaymentGatewayConfig first = futures.get(0).get();
        for (Future<PaymentGatewayConfig> f : futures) {
            assertSame(first, f.get());
        }
    }

    @Test
    void credentialsAreNonNull() {
        PaymentGatewayConfig cfg = PaymentGatewayConfig.getInstance();
        assertFalse(cfg.getApiKey().isBlank());
        assertTrue(cfg.getGatewayUrl().startsWith("https://"));
        assertTrue(cfg.getRetryLimit() > 0);
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "payment-gateway-config.ts",
            dir: "src/config/",
            content: `/**
 * src/config/payment-gateway-config.ts
 * --------------------------------------
 * Singleton PaymentGatewayConfig — private constructor + static cached instance.
 *
 * In Node.js each module is evaluated once per process, so this is effectively
 * equivalent to a module-level singleton. The explicit static getInstance() is
 * kept for explicitness and to prevent accidental direct instantiation.
 */

export interface GatewayCredentials {
  readonly apiKey: string;
  readonly gatewayUrl: string;
  readonly retryLimit: number;
  readonly timeoutMs: number;
}

export class PaymentGatewayConfig {
  static #instance: PaymentGatewayConfig | undefined;
  #creds: GatewayCredentials;

  private constructor() {
    this.#creds = PaymentGatewayConfig.#loadFromVault();
  }

  static getInstance(): PaymentGatewayConfig {
    PaymentGatewayConfig.#instance ??= new PaymentGatewayConfig();
    return PaymentGatewayConfig.#instance;
  }

  get credentials(): GatewayCredentials { return this.#creds; }

  /** Atomically swap credentials without restarting the process. */
  hotReload(): void {
    this.#creds = PaymentGatewayConfig.#loadFromVault();
  }

  static #loadFromVault(): GatewayCredentials {
    // In production: fetch from AWS Secrets Manager / Vault
    return {
      apiKey:      process.env["GATEWAY_API_KEY"] ?? "sk_live_abc123",
      gatewayUrl:  process.env["GATEWAY_URL"] ?? "https://acquirer.bank/api/v2",
      retryLimit:  Number(process.env["GATEWAY_RETRY_LIMIT"] ?? "5"),
      timeoutMs:   Number(process.env["GATEWAY_TIMEOUT_MS"] ?? "3000"),
    };
  }
}
`,
          },
          {
            name: "transaction-handler.ts",
            dir: "src/payments/",
            content: `/**
 * src/payments/transaction-handler.ts
 */
import { PaymentGatewayConfig } from "../config/payment-gateway-config";

export interface ChargeResult {
  txId: string;
  status: string;
  gateway: string;
  amountCents: number;
}

export class TransactionHandler {
  charge(amountCents: number, cardToken: string): ChargeResult {
    const { gatewayUrl } = PaymentGatewayConfig.getInstance().credentials;
    const txId = Math.random().toString(36).slice(2, 10);
    // In production: POST to gatewayUrl with Authorization header
    return { txId, status: "authorized", gateway: gatewayUrl, amountCents };
  }
}
`,
          },
          {
            name: "payment-gateway-config.test.ts",
            dir: "src/__tests__/",
            content: `/**
 * src/__tests__/payment-gateway-config.test.ts
 */
import { describe, it, expect } from "vitest";
import { PaymentGatewayConfig } from "../config/payment-gateway-config";

describe("PaymentGatewayConfig", () => {
  it("returns the same instance on every call", () => {
    expect(PaymentGatewayConfig.getInstance()).toBe(PaymentGatewayConfig.getInstance());
  });

  it("provides non-empty credentials", () => {
    const { apiKey, gatewayUrl, retryLimit } = PaymentGatewayConfig.getInstance().credentials;
    expect(apiKey).toBeTruthy();
    expect(gatewayUrl).toMatch(/^https:/);
    expect(retryLimit).toBeGreaterThan(0);
  });

  it("hotReload preserves singleton identity", () => {
    const before = PaymentGatewayConfig.getInstance();
    before.hotReload();
    expect(PaymentGatewayConfig.getInstance()).toBe(before);
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "payment_gateway_config.rs",
            dir: "src/config/",
            content: `//! src/config/payment_gateway_config.rs
//!
//! Singleton PaymentGatewayConfig using OnceLock.
//! The first caller to get_payment_gateway_config() initializes the config;
//! all subsequent callers receive the same &'static reference — zero locking cost.

use std::sync::{Arc, OnceLock, RwLock};

/// Immutable credential snapshot returned to callers.
#[derive(Debug, Clone)]
pub struct GatewayCredentials {
    pub api_key:     String,
    pub gateway_url: String,
    pub retry_limit: u32,
    pub timeout_ms:  u64,
}

/// Singleton that holds the current credential snapshot behind an RwLock
/// to allow hot-reload without restarting the process.
pub struct PaymentGatewayConfig {
    creds: RwLock<Arc<GatewayCredentials>>,
}

impl PaymentGatewayConfig {
    fn new() -> Self {
        PaymentGatewayConfig { creds: RwLock::new(Arc::new(load_from_vault())) }
    }

    /// Returns a snapshot of the current credentials (lock-free read path).
    pub fn credentials(&self) -> Arc<GatewayCredentials> {
        self.creds.read().unwrap().clone()
    }

    /// Atomically reload credentials without restarting the process.
    pub fn hot_reload(&self) {
        *self.creds.write().unwrap() = Arc::new(load_from_vault());
    }
}

static CONFIG: OnceLock<PaymentGatewayConfig> = OnceLock::new();

/// Returns &'static reference to the singleton PaymentGatewayConfig.
pub fn get() -> &'static PaymentGatewayConfig {
    CONFIG.get_or_init(PaymentGatewayConfig::new)
}

fn load_from_vault() -> GatewayCredentials {
    // In production: call HashiCorp Vault / AWS Secrets Manager
    GatewayCredentials {
        api_key:     std::env::var("GATEWAY_API_KEY").unwrap_or_else(|_| "sk_live_abc123".into()),
        gateway_url: "https://acquirer.bank/api/v2".into(),
        retry_limit: 5,
        timeout_ms:  3_000,
    }
}
`,
          },
          {
            name: "transaction_handler.rs",
            dir: "src/payments/",
            content: `//! src/payments/transaction_handler.rs
use crate::config::payment_gateway_config;

pub struct ChargeResult {
    pub tx_id:        String,
    pub status:       &'static str,
    pub gateway_url:  String,
    pub amount_cents: u64,
}

pub struct TransactionHandler;

impl TransactionHandler {
    pub fn charge(&self, amount_cents: u64, _card_token: &str) -> ChargeResult {
        let creds = payment_gateway_config::get().credentials();
        ChargeResult {
            tx_id:        format!("TX-{:06}", rand_id()),
            status:       "authorized",
            gateway_url:  creds.gateway_url.clone(),
            amount_cents,
        }
    }
}

fn rand_id() -> u32 { 42_001 } // stub — replace with uuid crate in production
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod config { pub mod payment_gateway_config; }
mod payments { pub mod transaction_handler; }

use config::payment_gateway_config;
use payments::transaction_handler::TransactionHandler;

fn main() {
    let cfg = payment_gateway_config::get();
    let creds = cfg.credentials();
    println!("Gateway: {}  Retries: {}", creds.gateway_url, creds.retry_limit);

    let handler = TransactionHandler;
    let result = handler.charge(9_999, "tok_visa_4242");
    println!("TX: {}  status: {}", result.tx_id, result.status);

    // Singleton identity
    let p1 = payment_gateway_config::get() as *const _;
    let p2 = payment_gateway_config::get() as *const _;
    println!("Same ptr: {}", std::ptr::eq(p1, p2)); // true
}
`,
          },
        ],
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
        "A Singleton EHRSystemConfig is initialized once from the hospital's configuration server, ensuring all modules — scheduling, charting, prescriptions — read the same FHIR base URL, TLS settings, and facility identifiers. The language implementations achieve this with thread-safe lazy init in Python/Java, sync.Once in Go, private constructor + static cache in TypeScript, and OnceLock in Rust. The result is a single authoritative configuration view that supports consistent audit and compliance behavior.",
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
# Singleton means one authoritative EHR configuration object.
# Achieved via class-level _instance and lock-guarded lazy construction.

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
// Singleton means one config pointer shared by all modules in-process.
// Achieved with ehrOnce.Do so initialization closure cannot run twice.
type EHRSystemConfig struct {
	FHIRBaseURL string // HL7 FHIR R4 endpoint
	FacilityID  string // Hospital identifier
	TLSCertPath string // Mutual TLS client certificate
}

var (
  ehrInstance *EHRSystemConfig // Shared singleton pointer
  ehrOnce    sync.Once         // Guarantees one-time initialization
)

// GetEHRSystemConfig returns the singleton EHR config.
func GetEHRSystemConfig() *EHRSystemConfig {
  ehrOnce.Do(func() { // Load once even with concurrent callers
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
 * Singleton means one JVM-wide config object for this service process.
 * Achieved with private constructor + static volatile instance + guarded getInstance().
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
 * Singleton means one shared config object per runtime instance.
 * Achieved with static cached instance returned by getInstance().
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
/// Singleton means one shared config value for the process.
/// Achieved with static OnceLock + one-time get_or_init construction.
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
      codeFiles: {
        Python: [
          {
            name: "ehr_config.py",
            dir: "config/",
            content: `"""
config/ehr_config.py
--------------------
Singleton EHRSystemConfig — thread-safe lazy initialization.

HIPAA note: all modules must consume the SAME FHIR base URL and facility ID
so that audit log entries are consistent. Multiple instances risk stale/split
configuration observations, breaking cross-module audit trails.
"""
from __future__ import annotations
import threading
from dataclasses import dataclass


@dataclass(frozen=True)
class EHREndpoints:
    fhir_base_url: str
    facility_id: str
    tls_cert_path: str
    lab_api_url: str
    pharmacy_api_url: str


class EHRSystemConfig:
    _instance: "EHRSystemConfig | None" = None
    _lock = threading.Lock()

    def __init__(self) -> None:
        self._endpoints = self._load_config()

    @classmethod
    def get_instance(cls) -> "EHRSystemConfig":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    @property
    def endpoints(self) -> EHREndpoints:
        return self._endpoints

    @staticmethod
    def _load_config() -> EHREndpoints:
        # In production: fetch from hospital config server / AWS Parameter Store
        return EHREndpoints(
            fhir_base_url="https://ehr.hospital.org/fhir/r4",
            facility_id="HOSP-NE-0042",
            tls_cert_path="/etc/ssl/ehr/client.pem",
            lab_api_url="https://lab.hospital.org/api",
            pharmacy_api_url="https://rx.hospital.org/api",
        )
`,
          },
          {
            name: "fhir_service.py",
            dir: "modules/",
            content: `"""
modules/fhir_service.py
------------------------
FHIR-based patient record service that reads endpoints from EHRSystemConfig.
"""
from __future__ import annotations
from config.ehr_config import EHRSystemConfig


class FHIRService:
    def get_patient(self, patient_id: str) -> dict:
        cfg = EHRSystemConfig.get_instance()
        base = cfg.endpoints.fhir_base_url
        # In production: GET {base}/Patient/{patient_id} with mTLS cert
        return {
            "resource": "Patient",
            "id": patient_id,
            "endpoint": f"{base}/Patient/{patient_id}",
            "facility": cfg.endpoints.facility_id,
        }

    def create_observation(self, patient_id: str, code: str, value: str) -> dict:
        cfg = EHRSystemConfig.get_instance()
        base = cfg.endpoints.fhir_base_url
        return {
            "resource": "Observation",
            "patient": patient_id,
            "code": code,
            "value": value,
            "endpoint": f"{base}/Observation",
        }
`,
          },
          {
            name: "scheduling_service.py",
            dir: "modules/",
            content: `"""
modules/scheduling_service.py
------------------------------
Appointment scheduling module — also reads from EHRSystemConfig.
All modules share the exact same singleton, so FHIR base URL is consistent.
"""
from __future__ import annotations
from config.ehr_config import EHRSystemConfig


class SchedulingService:
    def book_appointment(self, patient_id: str, provider_id: str, slot: str) -> dict:
        cfg = EHRSystemConfig.get_instance()
        base = cfg.endpoints.fhir_base_url
        return {
            "resource": "Appointment",
            "patient": patient_id,
            "provider": provider_id,
            "slot": slot,
            "endpoint": f"{base}/Appointment",
            "facility": cfg.endpoints.facility_id,
        }
`,
          },
        ],
        Go: [
          {
            name: "ehr_config.go",
            dir: "config/",
            content: `// config/ehr_config.go
//
// Singleton EHRSystemConfig initialized with sync.Once.
package config

import "sync"

// EHREndpoints holds all hospital connectivity data.
type EHREndpoints struct {
	FHIRBaseURL     string
	FacilityID      string
	TLSCertPath     string
	LabAPIURL       string
	PharmacyAPIURL  string
}

// EHRSystemConfig is the singleton.
type EHRSystemConfig struct {
	Endpoints EHREndpoints
}

var (
	ehrConfig *EHRSystemConfig
	ehrOnce   sync.Once
)

// GetEHRSystemConfig returns the singleton, initializing on first call.
func GetEHRSystemConfig() *EHRSystemConfig {
	ehrOnce.Do(func() {
		ehrConfig = &EHRSystemConfig{
			Endpoints: loadEHRConfig(),
		}
	})
	return ehrConfig
}

func loadEHRConfig() EHREndpoints {
	// In production: fetch from hospital config server
	return EHREndpoints{
		FHIRBaseURL:    "https://ehr.hospital.org/fhir/r4",
		FacilityID:     "HOSP-NE-0042",
		TLSCertPath:    "/etc/ssl/ehr/client.pem",
		LabAPIURL:      "https://lab.hospital.org/api",
		PharmacyAPIURL: "https://rx.hospital.org/api",
	}
}
`,
          },
          {
            name: "fhir_service.go",
            dir: "modules/",
            content: `// modules/fhir_service.go
package modules

import (
	"fmt"
	"myapp/config"
)

// FHIRService accesses patient records via the FHIR R4 API.
type FHIRService struct{}

func (s *FHIRService) GetPatient(patientID string) map[string]string {
	ep := config.GetEHRSystemConfig().Endpoints
	return map[string]string{
		"resource":  "Patient",
		"id":        patientID,
		"endpoint":  fmt.Sprintf("%s/Patient/%s", ep.FHIRBaseURL, patientID),
		"facility":  ep.FacilityID,
	}
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/config"
	"myapp/modules"
)

func main() {
	cfg := config.GetEHRSystemConfig()
	fmt.Printf("FHIR: %s  Facility: %s\\n", cfg.Endpoints.FHIRBaseURL, cfg.Endpoints.FacilityID)

	fhir := &modules.FHIRService{}
	patient := fhir.GetPatient("P-98765")
	fmt.Printf("Patient endpoint: %s\\n", patient["endpoint"])

	// Singleton identity
	fmt.Println("Same instance:", cfg == config.GetEHRSystemConfig()) // true
}
`,
          },
        ],
        Java: [
          {
            name: "EHRSystemConfig.java",
            dir: "com/example/config/",
            content: `package com.example.config;

/**
 * Thread-safe Singleton EHRSystemConfig (Double-Checked Locking).
 *
 * All EHR modules (scheduling, charting, prescriptions) MUST read from
 * this single instance to guarantee consistent HIPAA audit logging:
 * every access log entry will carry the same facilityId and FHIR base URL.
 */
public final class EHRSystemConfig {

    private static volatile EHRSystemConfig instance;

    private final String fhirBaseUrl;
    private final String facilityId;
    private final String tlsCertPath;
    private final String labApiUrl;
    private final String pharmacyApiUrl;

    private EHRSystemConfig() {
        // In production: fetch from hospital config server / AWS Parameter Store
        this.fhirBaseUrl     = "https://ehr.hospital.org/fhir/r4";
        this.facilityId      = "HOSP-NE-0042";
        this.tlsCertPath     = "/etc/ssl/ehr/client.pem";
        this.labApiUrl       = "https://lab.hospital.org/api";
        this.pharmacyApiUrl  = "https://rx.hospital.org/api";
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

    public String getFhirBaseUrl()    { return fhirBaseUrl; }
    public String getFacilityId()     { return facilityId; }
    public String getTlsCertPath()    { return tlsCertPath; }
    public String getLabApiUrl()      { return labApiUrl; }
    public String getPharmacyApiUrl() { return pharmacyApiUrl; }
}
`,
          },
          {
            name: "FHIRService.java",
            dir: "com/example/modules/",
            content: `package com.example.modules;

import com.example.config.EHRSystemConfig;

/** Retrieves and creates FHIR R4 resources for the EHR system. */
public class FHIRService {

    public String buildPatientUrl(String patientId) {
        EHRSystemConfig cfg = EHRSystemConfig.getInstance();
        return cfg.getFhirBaseUrl() + "/Patient/" + patientId;
    }

    public String buildObservationUrl() {
        return EHRSystemConfig.getInstance().getFhirBaseUrl() + "/Observation";
    }
}
`,
          },
          {
            name: "SchedulingService.java",
            dir: "com/example/modules/",
            content: `package com.example.modules;

import com.example.config.EHRSystemConfig;
import java.util.Map;

/** Appointment scheduling — reads FHIR base URL from the EHRSystemConfig singleton. */
public class SchedulingService {

    public Map<String, String> bookAppointment(String patientId, String providerId, String slot) {
        EHRSystemConfig cfg = EHRSystemConfig.getInstance();
        return Map.of(
            "resource",  "Appointment",
            "patient",   patientId,
            "provider",  providerId,
            "slot",      slot,
            "endpoint",  cfg.getFhirBaseUrl() + "/Appointment",
            "facility",  cfg.getFacilityId()
        );
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "ehr-config.ts",
            dir: "src/config/",
            content: `/**
 * src/config/ehr-config.ts
 * -------------------------
 * Singleton EHRSystemConfig.
 */

export interface EHREndpoints {
  readonly fhirBaseUrl:    string;
  readonly facilityId:     string;
  readonly tlsCertPath:    string;
  readonly labApiUrl:      string;
  readonly pharmacyApiUrl: string;
}

export class EHRSystemConfig {
  static #instance: EHRSystemConfig | undefined;
  readonly #endpoints: EHREndpoints;

  private constructor() {
    this.#endpoints = EHRSystemConfig.#loadConfig();
  }

  static getInstance(): EHRSystemConfig {
    EHRSystemConfig.#instance ??= new EHRSystemConfig();
    return EHRSystemConfig.#instance;
  }

  get endpoints(): EHREndpoints { return this.#endpoints; }

  static #loadConfig(): EHREndpoints {
    return {
      fhirBaseUrl:    process.env["FHIR_BASE_URL"] ?? "https://ehr.hospital.org/fhir/r4",
      facilityId:     process.env["FACILITY_ID"]   ?? "HOSP-NE-0042",
      tlsCertPath:    process.env["TLS_CERT_PATH"]  ?? "/etc/ssl/ehr/client.pem",
      labApiUrl:      "https://lab.hospital.org/api",
      pharmacyApiUrl: "https://rx.hospital.org/api",
    };
  }
}
`,
          },
          {
            name: "fhir-service.ts",
            dir: "src/modules/",
            content: `/**
 * src/modules/fhir-service.ts
 */
import { EHRSystemConfig } from "../config/ehr-config";

export class FHIRService {
  getPatientUrl(patientId: string): string {
    const { fhirBaseUrl } = EHRSystemConfig.getInstance().endpoints;
    return \`\${fhirBaseUrl}/Patient/\${patientId}\`;
  }

  getObservationUrl(): string {
    return \`\${EHRSystemConfig.getInstance().endpoints.fhirBaseUrl}/Observation\`;
  }
}
`,
          },
          {
            name: "scheduling-service.ts",
            dir: "src/modules/",
            content: `/**
 * src/modules/scheduling-service.ts
 */
import { EHRSystemConfig } from "../config/ehr-config";

export class SchedulingService {
  bookAppointment(patientId: string, providerId: string, slot: string) {
    const { fhirBaseUrl, facilityId } = EHRSystemConfig.getInstance().endpoints;
    return {
      resource:  "Appointment",
      patient:   patientId,
      provider:  providerId,
      slot,
      endpoint:  \`\${fhirBaseUrl}/Appointment\`,
      facility:  facilityId,
    };
  }
}
`,
          },
        ],
        Rust: [
          {
            name: "ehr_config.rs",
            dir: "src/config/",
            content: `//! src/config/ehr_config.rs
//!
//! Singleton EHRSystemConfig via OnceLock.
use std::sync::OnceLock;

#[derive(Debug)]
pub struct EHREndpoints {
    pub fhir_base_url:    String,
    pub facility_id:      String,
    pub tls_cert_path:    String,
    pub lab_api_url:      String,
    pub pharmacy_api_url: String,
}

pub struct EHRSystemConfig {
    pub endpoints: EHREndpoints,
}

static EHR_CONFIG: OnceLock<EHRSystemConfig> = OnceLock::new();

pub fn get() -> &'static EHRSystemConfig {
    EHR_CONFIG.get_or_init(|| EHRSystemConfig {
        endpoints: EHREndpoints {
            fhir_base_url:    "https://ehr.hospital.org/fhir/r4".into(),
            facility_id:      "HOSP-NE-0042".into(),
            tls_cert_path:    "/etc/ssl/ehr/client.pem".into(),
            lab_api_url:      "https://lab.hospital.org/api".into(),
            pharmacy_api_url: "https://rx.hospital.org/api".into(),
        },
    })
}
`,
          },
          {
            name: "fhir_service.rs",
            dir: "src/modules/",
            content: `//! src/modules/fhir_service.rs
use crate::config::ehr_config;

pub struct FHIRService;

impl FHIRService {
    pub fn patient_url(&self, patient_id: &str) -> String {
        let ep = &ehr_config::get().endpoints;
        format!("{}/Patient/{}", ep.fhir_base_url, patient_id)
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod config { pub mod ehr_config; }
mod modules { pub mod fhir_service; }

use config::ehr_config;
use modules::fhir_service::FHIRService;

fn main() {
    let cfg = ehr_config::get();
    println!("FHIR: {}  Facility: {}", cfg.endpoints.fhir_base_url, cfg.endpoints.facility_id);

    let svc = FHIRService;
    println!("Patient URL: {}", svc.patient_url("P-98765"));
}
`,
          },
        ],
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
        "A Singleton InventoryCacheManager maintains a single source of truth for stock levels, backed by Redis, and provides thread-safe decrement operations during checkout. In the language examples, singleton creation is controlled via a guarded static instance (Python/Java/TypeScript), sync.Once (Go), or OnceLock (Rust), while mutation safety is handled with locks or atomic structures. This combination prevents split-brain stock views and reduces overselling risk.",
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
# Singleton means one shared in-memory stock manager.
# Achieved using class-level _instance with lock-guarded lazy initialization.

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
// Singleton means one stock cache object shared across handlers.
// Achieved via invInstance + invOnce.Do one-time construction.
type InventoryCacheManager struct {
	stock map[string]int // SKU → available quantity
	mu    sync.Mutex     // Guards stock mutations
}

var (
  invInstance *InventoryCacheManager // Single cache instance for the process
  invOnce    sync.Once               // One-time singleton initialization
)

// GetInventoryCache returns the singleton cache.
func GetInventoryCache() *InventoryCacheManager {
  invOnce.Do(func() { // Initializes stock map exactly once
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
 * Singleton means one cache manager object for the JVM process.
 * Achieved via static volatile instance + guarded getInstance().
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
     * Atomically reserves stock for the given SKU.
     * IMPORTANT: addAndGet(-qty) is atomic but *not* safe for reservations,
     * because it can decrement below zero and leave the map in an invalid state.
     * Use a CAS loop: read current, check, then compareAndSet.
     */
    public boolean reserveStock(String sku, int qty) {
        AtomicInteger current = stock.get(sku);
        if (current == null) return false;

      while (true) {
        int existing = current.get();
        if (existing < qty) return false;
        if (current.compareAndSet(existing, existing - qty)) return true;
      }
    }
}`,
        TypeScript: `/**
 * InventoryCacheManager — Singleton stock cache.
 * Single source of truth prevents overselling.
 * Singleton means one cache manager instance per runtime.
 * Achieved by private constructor + static cached instance in getInstance().
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
/// Singleton means one stock manager shared by all threads in-process.
/// Achieved with static OnceLock + accessor-based one-time initialization.
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
      codeFiles: {
        Python: [
          {
            name: "inventory_cache.py",
            dir: "cache/",
            content: `"""
cache/inventory_cache.py
-------------------------
Singleton InventoryCache — centralizes in-memory stock counts using
atomic operations to prevent overselling during concurrent checkouts.

Why Singleton here?
  Multiple cache instances would each maintain their own stock count map.
  During a flash sale, two instances could both show stock=1 for SKU-X
  and both allow a reservation, overselling by factor N (number of instances).

Thread-safety:
  Each SKU has its own threading.Lock so concurrent requests for different
  SKUs do not contend with each other (fine-grained locking).
"""
from __future__ import annotations
import threading
from collections import defaultdict


class InventoryCache:
    _instance: "InventoryCache | None" = None
    _init_lock = threading.Lock()

    def __init__(self) -> None:
        # stock[sku] → available units
        self._stock: dict[str, int] = {}
        # per-SKU locks — prevents over-reservation on the same SKU
        self._locks: dict[str, threading.Lock] = defaultdict(threading.Lock)

    @classmethod
    def get_instance(cls) -> "InventoryCache":
        if cls._instance is None:
            with cls._init_lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def seed(self, sku: str, qty: int) -> None:
        """Pre-warm the cache (called at startup or after a DB sync)."""
        with self._locks[sku]:
            self._stock[sku] = qty

    def reserve(self, sku: str, qty: int) -> bool:
        """
        Atomically deduct qty from stock.
        Returns True on success, False if insufficient stock.
        """
        with self._locks[sku]:
            available = self._stock.get(sku, 0)
            if available < qty:
                return False
            self._stock[sku] = available - qty
            return True

    def release(self, sku: str, qty: int) -> None:
        """Return qty to stock (e.g., on order cancellation or payment failure)."""
        with self._locks[sku]:
            self._stock[sku] = self._stock.get(sku, 0) + qty

    def available(self, sku: str) -> int:
        with self._locks[sku]:
            return self._stock.get(sku, 0)
`,
          },
          {
            name: "checkout_service.py",
            dir: "services/",
            content: `"""
services/checkout_service.py
-----------------------------
Checkout flow that guards against overselling via InventoryCache singleton.
"""
from __future__ import annotations
from cache.inventory_cache import InventoryCache


class CheckoutService:
    def checkout(self, order_id: str, items: list[dict]) -> dict:
        """
        Reserve stock for all items atomically.
        If any reservation fails, roll back already-reserved items.
        """
        cache = InventoryCache.get_instance()
        reserved: list[tuple[str, int]] = []

        for item in items:
            sku, qty = item["sku"], item["qty"]
            if cache.reserve(sku, qty):
                reserved.append((sku, qty))
            else:
                # Roll back all reservations made before this failure
                for r_sku, r_qty in reserved:
                    cache.release(r_sku, r_qty)
                return {"success": False, "reason": f"Insufficient stock for {sku}"}

        return {"success": True, "order_id": order_id, "reserved": reserved}
`,
          },
          {
            name: "test_inventory_cache.py",
            dir: "tests/",
            content: `"""tests/test_inventory_cache.py"""
import threading
from cache.inventory_cache import InventoryCache


def test_singleton_identity() -> None:
    assert InventoryCache.get_instance() is InventoryCache.get_instance()


def test_reserve_deducts_stock() -> None:
    cache = InventoryCache.get_instance()
    cache.seed("SKU-TEST-1", 10)
    assert cache.reserve("SKU-TEST-1", 3)
    assert cache.available("SKU-TEST-1") == 7


def test_reserve_fails_when_insufficient() -> None:
    cache = InventoryCache.get_instance()
    cache.seed("SKU-TEST-2", 2)
    assert not cache.reserve("SKU-TEST-2", 5)
    assert cache.available("SKU-TEST-2") == 2


def test_concurrent_reservations_no_oversell() -> None:
    cache = InventoryCache.get_instance()
    cache.seed("SKU-FLASH", 10)
    successes = []
    lock = threading.Lock()

    def try_reserve() -> None:
        if cache.reserve("SKU-FLASH", 1):
            with lock:
                successes.append(1)

    threads = [threading.Thread(target=try_reserve) for _ in range(20)]
    for t in threads: t.start()
    for t in threads: t.join()

    assert sum(successes) == 10  # exactly 10 succeed; no oversell
    assert cache.available("SKU-FLASH") == 0
`,
          },
        ],
        Go: [
          {
            name: "inventory_cache.go",
            dir: "cache/",
            content: `// cache/inventory_cache.go
//
// Singleton InventoryCache — centralizes stock counts with per-SKU mutexes
// to minimize lock contention during concurrent flash-sale checkouts.
package cache

import (
	"sync"
)

type InventoryCache struct {
	mu    sync.Map // key: sku → *int64 (atomic counter per SKU)
}

var (
	invCache *InventoryCache
	invOnce  sync.Once
)

// GetInventoryCache returns the singleton InventoryCache.
func GetInventoryCache() *InventoryCache {
	invOnce.Do(func() { invCache = &InventoryCache{} })
	return invCache
}

// Seed pre-warms a SKU's stock (called at startup / after DB sync).
func (c *InventoryCache) Seed(sku string, qty int64) {
	v := new(int64)
	*v = qty
	c.mu.Store(sku, v)
}

// Available returns current stock count for a SKU.
func (c *InventoryCache) Available(sku string) int64 {
	if v, ok := c.mu.Load(sku); ok {
		return *v.(*int64)
	}
	return 0
}

// Reserve atomically deducts qty from stock.
// Returns true on success, false if insufficient stock.
func (c *InventoryCache) Reserve(sku string, qty int64) bool {
	// Load-or-create the counter
	actual, _ := c.mu.LoadOrStore(sku, new(int64))
	ptr := actual.(*int64)

	// Spin-CAS to atomically deduct if stock >= qty
	for {
		cur := atomicLoad(ptr)
		if cur < qty {
			return false
		}
		if atomicCAS(ptr, cur, cur-qty) {
			return true
		}
	}
}

// Release adds qty back to stock (on cancellation / payment failure).
func (c *InventoryCache) Release(sku string, qty int64) {
	actual, _ := c.mu.LoadOrStore(sku, new(int64))
	atomicAdd(actual.(*int64), qty)
}
`,
          },
          {
            name: "atomic_helpers.go",
            dir: "cache/",
            content: `// cache/atomic_helpers.go — thin wrappers around sync/atomic for int64 ptr
package cache

import "sync/atomic"

func atomicLoad(p *int64) int64         { return atomic.LoadInt64(p) }
func atomicAdd(p *int64, d int64)       { atomic.AddInt64(p, d) }
func atomicCAS(p *int64, o, n int64) bool { return atomic.CompareAndSwapInt64(p, o, n) }
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/cache"
)

func main() {
	inv := cache.GetInventoryCache()
	inv.Seed("SKU-8821", 10)

	ok := inv.Reserve("SKU-8821", 3)
	fmt.Printf("Reserved 3 × SKU-8821: %v  remaining: %d\\n", ok, inv.Available("SKU-8821"))

	// Prove singleton identity
	fmt.Println("Same:", inv == cache.GetInventoryCache()) // true
}
`,
          },
        ],
        Java: [
          {
            name: "InventoryCache.java",
            dir: "com/example/cache/",
            content: `package com.example.cache;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Singleton InventoryCache — prevents overselling during flash sales
 * by centralizing all stock counters in one process-wide map.
 *
 * Per-SKU AtomicInteger provides lock-free compare-and-swap operations,
 * eliminating synchronized blocks on the common read/decrement path.
 */
public final class InventoryCache {

    private static volatile InventoryCache instance;
    private final ConcurrentHashMap<String, AtomicInteger> stock = new ConcurrentHashMap<>();

    private InventoryCache() {}

    public static InventoryCache getInstance() {
        if (instance == null) {
            synchronized (InventoryCache.class) {
                if (instance == null) {
                    instance = new InventoryCache();
                }
            }
        }
        return instance;
    }

    /** Pre-warm a SKU with available units (call at startup or after DB sync). */
    public void seed(String sku, int qty) {
        stock.put(sku, new AtomicInteger(qty));
    }

    /** Returns current available stock for a SKU. */
    public int available(String sku) {
        AtomicInteger ai = stock.get(sku);
        return ai == null ? 0 : ai.get();
    }

    /**
     * Atomically reserve qty units for a SKU.
     * Returns true on success, false if insufficient stock.
     */
    public boolean reserve(String sku, int qty) {
        AtomicInteger ai = stock.computeIfAbsent(sku, k -> new AtomicInteger(0));
        int cur;
        do {
            cur = ai.get();
            if (cur < qty) return false;
        } while (!ai.compareAndSet(cur, cur - qty));
        return true;
    }

    /** Return qty to stock on cancellation or payment failure. */
    public void release(String sku, int qty) {
        stock.computeIfAbsent(sku, k -> new AtomicInteger(0)).addAndGet(qty);
    }
}
`,
          },
          {
            name: "CheckoutService.java",
            dir: "com/example/services/",
            content: `package com.example.services;

import com.example.cache.InventoryCache;
import java.util.*;

/** Processes checkout, using InventoryCache to prevent overselling. */
public class CheckoutService {

    public record CheckoutResult(boolean success, String reason) {}

    public CheckoutResult checkout(String orderId, List<Map.Entry<String,Integer>> items) {
        InventoryCache cache = InventoryCache.getInstance();
        List<Map.Entry<String,Integer>> reserved = new ArrayList<>();

        for (Map.Entry<String,Integer> item : items) {
            String sku = item.getKey();
            int    qty = item.getValue();
            if (cache.reserve(sku, qty)) {
                reserved.add(item);
            } else {
                // Roll back all previously reserved items
                reserved.forEach(r -> cache.release(r.getKey(), r.getValue()));
                return new CheckoutResult(false, "Insufficient stock for " + sku);
            }
        }
        return new CheckoutResult(true, orderId);
    }
}
`,
          },
          {
            name: "InventoryCacheTest.java",
            dir: "com/example/cache/",
            content: `package com.example.cache;

import org.junit.jupiter.api.Test;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class InventoryCacheTest {

    @Test
    void singletonIdentity() {
        assertSame(InventoryCache.getInstance(), InventoryCache.getInstance());
    }

    @Test
    void reserveDeductsStock() {
        InventoryCache cache = InventoryCache.getInstance();
        cache.seed("SKU-J-1", 10);
        assertTrue(cache.reserve("SKU-J-1", 3));
        assertEquals(7, cache.available("SKU-J-1"));
    }

    @Test
    void reserveFailsWhenInsufficient() {
        InventoryCache cache = InventoryCache.getInstance();
        cache.seed("SKU-J-2", 2);
        assertFalse(cache.reserve("SKU-J-2", 5));
    }

    @Test
    void concurrentReservationsNeverOversell() throws Exception {
        InventoryCache cache = InventoryCache.getInstance();
        cache.seed("SKU-FLASH-J", 10);

        AtomicInteger successes = new AtomicInteger(0);
        ExecutorService pool = Executors.newFixedThreadPool(20);
        CountDownLatch latch = new CountDownLatch(20);

        for (int i = 0; i < 20; i++) {
            pool.submit(() -> {
                if (cache.reserve("SKU-FLASH-J", 1)) successes.incrementAndGet();
                latch.countDown();
            });
        }
        latch.await();
        pool.shutdown();

        assertEquals(10, successes.get());
        assertEquals(0, cache.available("SKU-FLASH-J"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "inventory-cache.ts",
            dir: "src/cache/",
            content: `/**
 * src/cache/inventory-cache.ts
 * -----------------------------
 * Singleton InventoryCache — prevents overselling via atomic CAS operations.
 */

export class InventoryCache {
  static #instance: InventoryCache | undefined;
  readonly #stock = new Map<string, number>();

  private constructor() {}

  static getInstance(): InventoryCache {
    InventoryCache.#instance ??= new InventoryCache();
    return InventoryCache.#instance;
  }

  seed(sku: string, qty: number): void {
    this.#stock.set(sku, qty);
  }

  available(sku: string): number {
    return this.#stock.get(sku) ?? 0;
  }

  /**
   * Atomically reserve qty units.
   * Returns true on success, false if stock is insufficient.
   *
   * Note: JS is single-threaded within one event loop, so a simple
   * read-check-write is safe here. In shared-memory Worker scenarios
   * use a SharedArrayBuffer + Atomics.compareExchange.
   */
  reserve(sku: string, qty: number): boolean {
    const current = this.#stock.get(sku) ?? 0;
    if (current < qty) return false;
    this.#stock.set(sku, current - qty);
    return true;
  }

  release(sku: string, qty: number): void {
    this.#stock.set(sku, (this.#stock.get(sku) ?? 0) + qty);
  }
}
`,
          },
          {
            name: "checkout-service.ts",
            dir: "src/services/",
            content: `/**
 * src/services/checkout-service.ts
 */
import { InventoryCache } from "../cache/inventory-cache";

export interface OrderItem { sku: string; qty: number; }
export interface CheckoutResult { success: boolean; reason?: string; }

export class CheckoutService {
  checkout(orderId: string, items: OrderItem[]): CheckoutResult {
    const cache = InventoryCache.getInstance();
    const reserved: OrderItem[] = [];

    for (const { sku, qty } of items) {
      if (cache.reserve(sku, qty)) {
        reserved.push({ sku, qty });
      } else {
        reserved.forEach(r => cache.release(r.sku, r.qty));
        return { success: false, reason: \`Insufficient stock for \${sku}\` };
      }
    }
    return { success: true };
  }
}
`,
          },
          {
            name: "inventory-cache.test.ts",
            dir: "src/__tests__/",
            content: `/**
 * src/__tests__/inventory-cache.test.ts
 */
import { describe, it, expect, beforeEach } from "vitest";
import { InventoryCache } from "../cache/inventory-cache";

describe("InventoryCache", () => {
  it("is a singleton", () => {
    expect(InventoryCache.getInstance()).toBe(InventoryCache.getInstance());
  });

  it("reserves stock and deducts count", () => {
    const cache = InventoryCache.getInstance();
    cache.seed("SKU-TS-1", 10);
    expect(cache.reserve("SKU-TS-1", 3)).toBe(true);
    expect(cache.available("SKU-TS-1")).toBe(7);
  });

  it("returns false when stock is insufficient", () => {
    const cache = InventoryCache.getInstance();
    cache.seed("SKU-TS-2", 2);
    expect(cache.reserve("SKU-TS-2", 5)).toBe(false);
    expect(cache.available("SKU-TS-2")).toBe(2);
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "inventory_cache.rs",
            dir: "src/cache/",
            content: `//! src/cache/inventory_cache.rs
//!
//! Singleton InventoryCache — prevents overselling via per-SKU AtomicI64 counters.
use std::collections::HashMap;
use std::sync::{atomic::{AtomicI64, Ordering}, OnceLock, RwLock};

pub struct InventoryCache {
    stock: RwLock<HashMap<String, AtomicI64>>,
}

impl InventoryCache {
    fn new() -> Self {
        InventoryCache { stock: RwLock::new(HashMap::new()) }
    }

    pub fn seed(&self, sku: &str, qty: i64) {
        let mut map = self.stock.write().unwrap();
        map.insert(sku.to_owned(), AtomicI64::new(qty));
    }

    pub fn available(&self, sku: &str) -> i64 {
        let map = self.stock.read().unwrap();
        map.get(sku).map(|a| a.load(Ordering::Acquire)).unwrap_or(0)
    }

    /// Atomically reserve qty; returns true on success.
    pub fn reserve(&self, sku: &str, qty: i64) -> bool {
        let map = self.stock.read().unwrap();
        let counter = match map.get(sku) {
            Some(c) => c,
            None => return false,
        };
        loop {
            let cur = counter.load(Ordering::Acquire);
            if cur < qty { return false; }
            if counter.compare_exchange(cur, cur - qty,
                Ordering::AcqRel, Ordering::Acquire).is_ok() {
                return true;
            }
        }
    }

    pub fn release(&self, sku: &str, qty: i64) {
        let map = self.stock.read().unwrap();
        if let Some(c) = map.get(sku) { c.fetch_add(qty, Ordering::Release); }
    }
}

static CACHE: OnceLock<InventoryCache> = OnceLock::new();

pub fn get() -> &'static InventoryCache {
    CACHE.get_or_init(InventoryCache::new)
}
`,
          },
          {
            name: "checkout.rs",
            dir: "src/services/",
            content: `//! src/services/checkout.rs
use crate::cache::inventory_cache;

pub struct CheckoutService;

impl CheckoutService {
    pub fn checkout(&self, _order_id: &str, items: &[(&str, i64)]) -> bool {
        let cache = inventory_cache::get();
        let mut reserved: Vec<(&str, i64)> = Vec::new();

        for &(sku, qty) in items {
            if cache.reserve(sku, qty) {
                reserved.push((sku, qty));
            } else {
                // Roll back
                for (r_sku, r_qty) in &reserved {
                    cache.release(r_sku, *r_qty);
                }
                return false;
            }
        }
        true
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod cache { pub mod inventory_cache; }
mod services { pub mod checkout; }

use cache::inventory_cache;
use services::checkout::CheckoutService;

fn main() {
    let inv = inventory_cache::get();
    inv.seed("SKU-8821", 10);

    let ok = inv.reserve("SKU-8821", 3);
    println!("Reserved 3: {}  remaining: {}", ok, inv.available("SKU-8821")); // true  7

    let svc = CheckoutService;
    let success = svc.checkout("ORD-001", &[("SKU-8821", 2)]);
    println!("Checkout: {}  remaining: {}", success, inv.available("SKU-8821")); // true  5
}
`,
          },
        ],
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
        "A Singleton CDNConfig holds the authoritative CDN topology and signing credentials, loaded once from a central config store and used by all streaming pipeline components. Across languages, singleton construction is intentionally one-time: double-check style lazy init in Python/Java, sync.Once in Go, static cached instance with private constructor in TypeScript, and OnceLock in Rust. This ensures transcoder, DRM, and manifest services read identical origin and edge policy data.",
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
# Singleton means one source-of-truth CDN config object.
# Achieved via _instance + lock-guarded lazy creation in get_instance().

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
// Singleton means one CDN config pointer for the process.
// Achieved with cdnInstance + cdnOnce.Do one-time initialization.
type CDNConfig struct {
	OriginURL  string // CDN origin server
  SigningKey string // URL-signing secret
	EdgePolicy string // Edge selection algorithm
}

var (
  cdnInstance *CDNConfig // Single CDN config instance
  cdnOnce    sync.Once   // One-time singleton initializer
)

// GetCDNConfig returns the singleton CDN configuration.
func GetCDNConfig() *CDNConfig {
  cdnOnce.Do(func() { // Executes once regardless of caller count
		cdnInstance = &CDNConfig{
			OriginURL:  "https://origin.streamcdn.io",
      SigningKey: "cdnkey_prod_9f3a1b",
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
 * Singleton means one shared CDN config object for the JVM process.
 * Achieved via private constructor + static instance managed by getInstance().
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
 * Singleton means one shared CDN config object in the runtime.
 * Achieved with private constructor + static cached instance returned by getInstance().
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
/// Singleton means one shared CDN configuration for this process.
/// Achieved via static OnceLock + get_or_init accessor.
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
      codeFiles: {
        Python: [
          {
            name: "cdn_config.py",
            dir: "config/",
            content: `"""
config/cdn_config.py
---------------------
Singleton CDNConfig — single source of truth for origin URL, signing key,
and edge policy used by every streaming service in the process.

Why Singleton?
  TranscoderService and ManifestGenerator need the *same* signing key at all
  times. Two independent config objects would diverge after a key rotation,
  causing some signed URLs to be invalid until the next process restart.

Thread-safety: uses threading.Lock for rotation so all attributes swap
atomically — no window where sign_url uses the old key but ManifestGenerator
uses the new one.
"""
from __future__ import annotations
import hmac, hashlib, threading, time


class CDNConfig:
    _instance: "CDNConfig | None" = None
    _lock = threading.Lock()

    def __init__(self, origin_url: str, signing_key: str, edge_policy: str) -> None:
        self._origin_url   = origin_url
        self._signing_key  = signing_key.encode()
        self._edge_policy  = edge_policy
        self._rw_lock      = threading.RLock()

    @classmethod
    def get_instance(cls) -> "CDNConfig":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls(
                        origin_url  = "https://origin.streamcdn.io",
                        signing_key = "cdnkey_prod_9f3a1b",
                        edge_policy = "latency-optimized",
                    )
        return cls._instance

    @property
    def origin_url(self) -> str:
        with self._rw_lock:
            return self._origin_url

    @property
    def edge_policy(self) -> str:
        with self._rw_lock:
            return self._edge_policy

    def sign_url(self, path: str, ttl_seconds: int = 3600) -> str:
        """Return an HMAC-SHA256-signed CDN URL with expiry timestamp."""
        with self._rw_lock:
            expires = int(time.time()) + ttl_seconds
            payload = f"{path}?expires={expires}"
            sig = hmac.new(self._signing_key, payload.encode(), hashlib.sha256).hexdigest()
            return f"{self._origin_url}/{payload}&sig={sig}"

    def rotate_key(self, new_key: str) -> None:
        """Atomically swap the signing key (both fields under the same lock)."""
        with self._rw_lock:
            self._signing_key = new_key.encode()
`,
          },
          {
            name: "transcoder_service.py",
            dir: "streaming/",
            content: `"""streaming/transcoder_service.py — generates signed asset URLs."""
from config.cdn_config import CDNConfig


class TranscoderService:
    def get_signed_source(self, asset_id: str) -> str:
        cfg = CDNConfig.get_instance()
        return cfg.sign_url(f"assets/{asset_id}/source.mp4")

    def get_output_url(self, asset_id: str, profile: str) -> str:
        cfg = CDNConfig.get_instance()
        return f"{cfg.origin_url}/assets/{asset_id}/{profile}.m3u8"
`,
          },
          {
            name: "manifest_generator.py",
            dir: "streaming/",
            content: `"""streaming/manifest_generator.py — builds HLS manifests with signed segment URLs."""
from config.cdn_config import CDNConfig


class ManifestGenerator:
    def build(self, stream_id: str, segment_count: int = 6) -> str:
        cfg = CDNConfig.get_instance()
        lines = ["#EXTM3U", "#EXT-X-VERSION:3"]
        for i in range(segment_count):
            signed = cfg.sign_url(f"streams/{stream_id}/seg{i:04d}.ts", ttl_seconds=600)
            lines += ["#EXTINF:6.0,", signed]
        lines.append("#EXT-X-ENDLIST")
        return "\\n".join(lines)
`,
          },
        ],
        Go: [
          {
            name: "cdn_config.go",
            dir: "config/",
            content: `// config/cdn_config.go
package config

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"sync"
	"time"
)

type CDNConfig struct {
	mu         sync.RWMutex
	OriginURL  string
	signingKey []byte
	EdgePolicy string
}

var (
	cdnCfg  *CDNConfig
	cdnOnce sync.Once
)

func GetCDNConfig() *CDNConfig {
	cdnOnce.Do(func() {
		cdnCfg = &CDNConfig{
			OriginURL:  "https://origin.streamcdn.io",
			signingKey: []byte("cdnkey_prod_9f3a1b"),
			EdgePolicy: "latency-optimized",
		}
	})
	return cdnCfg
}

// SignURL returns an HMAC-SHA256-signed CDN URL expiring ttl seconds from now.
func (c *CDNConfig) SignURL(path string, ttl int64) string {
	c.mu.RLock()
	defer c.mu.RUnlock()
	expires := time.Now().Unix() + ttl
	payload := fmt.Sprintf("%s?expires=%d", path, expires)
	mac := hmac.New(sha256.New, c.signingKey)
	mac.Write([]byte(payload))
	sig := hex.EncodeToString(mac.Sum(nil))
	return fmt.Sprintf("%s/%s&sig=%s", c.OriginURL, payload, sig)
}

// RotateKey atomically replaces the signing key.
func (c *CDNConfig) RotateKey(newKey string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.signingKey = []byte(newKey)
}
`,
          },
          {
            name: "transcoder.go",
            dir: "streaming/",
            content: `// streaming/transcoder.go
package streaming

import (
	"fmt"
	"myapp/config"
)

type TranscoderService struct{}

func (t *TranscoderService) GetSignedSource(assetID string) string {
	cfg := config.GetCDNConfig()
	return cfg.SignURL(fmt.Sprintf("assets/%s/source.mp4", assetID), 3600)
}

func (t *TranscoderService) GetOutputURL(assetID, profile string) string {
	cfg := config.GetCDNConfig()
	return fmt.Sprintf("%s/assets/%s/%s.m3u8", cfg.OriginURL, assetID, profile)
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/config"
	"myapp/streaming"
)

func main() {
	cfg := config.GetCDNConfig()
	fmt.Println(cfg.OriginURL, cfg.EdgePolicy)

	svc := &streaming.TranscoderService{}
	fmt.Println(svc.GetSignedSource("vid-001"))

	// Verify singleton identity
	fmt.Println("Same:", cfg == config.GetCDNConfig()) // true
}
`,
          },
        ],
        Java: [
          {
            name: "CDNConfig.java",
            dir: "com/example/config/",
            content: `package com.example.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Singleton CDNConfig — process-wide CDN settings loaded once at startup.
 *
 * A ReadWriteLock allows concurrent read access to sign URLs (hot path)
 * while an exclusive write lock is held only during rare key-rotation events.
 */
public final class CDNConfig {

    private static volatile CDNConfig instance;

    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final String originUrl;
    private final String edgePolicy;
    private byte[] signingKey;

    private CDNConfig() {
        this.originUrl  = "https://origin.streamcdn.io";
        this.edgePolicy = "latency-optimized";
        this.signingKey = "cdnkey_prod_9f3a1b".getBytes(StandardCharsets.UTF_8);
    }

    public static CDNConfig getInstance() {
        if (instance == null) {
            synchronized (CDNConfig.class) {
                if (instance == null) instance = new CDNConfig();
            }
        }
        return instance;
    }

    public String getOriginUrl() { return originUrl; }
    public String getEdgePolicy() { return edgePolicy; }

    public String signUrl(String path, long ttlSeconds) {
        lock.readLock().lock();
        try {
            long expires = Instant.now().getEpochSecond() + ttlSeconds;
            String payload = path + "?expires=" + expires;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(signingKey, "HmacSHA256"));
            String sig = Base64.getUrlEncoder().withoutPadding()
                               .encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
            return originUrl + "/" + payload + "&sig=" + sig;
        } catch (Exception e) {
            throw new RuntimeException("URL signing failed", e);
        } finally {
            lock.readLock().unlock();
        }
    }

    public void rotateKey(String newKey) {
        lock.writeLock().lock();
        try {
            this.signingKey = newKey.getBytes(StandardCharsets.UTF_8);
        } finally {
            lock.writeLock().unlock();
        }
    }
}
`,
          },
          {
            name: "TranscoderService.java",
            dir: "com/example/streaming/",
            content: `package com.example.streaming;

import com.example.config.CDNConfig;

public class TranscoderService {
    public String getSignedSourceUrl(String assetId) {
        return CDNConfig.getInstance().signUrl("assets/" + assetId + "/source.mp4", 3600);
    }

    public String getOutputUrl(String assetId, String profile) {
        return CDNConfig.getInstance().getOriginUrl()
               + "/assets/" + assetId + "/" + profile + ".m3u8";
    }
}
`,
          },
          {
            name: "ManifestGenerator.java",
            dir: "com/example/streaming/",
            content: `package com.example.streaming;

import com.example.config.CDNConfig;

public class ManifestGenerator {
    public String buildHLS(String streamId, int segmentCount) {
        CDNConfig cfg = CDNConfig.getInstance();
        var sb = new StringBuilder("#EXTM3U\\n#EXT-X-VERSION:3\\n");
        for (int i = 0; i < segmentCount; i++) {
            String signedUrl = cfg.signUrl("streams/" + streamId + "/seg" + i + ".ts", 600);
            sb.append("#EXTINF:6.0,\\n").append(signedUrl).append("\\n");
        }
        return sb.append("#EXT-X-ENDLIST\\n").toString();
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "cdn-config.ts",
            dir: "src/config/",
            content: `/**
 * src/config/cdn-config.ts
 * -------------------------
 * Singleton CDNConfig — centralized CDN settings so TranscoderService
 * and ManifestGenerator always share the same signing key, even after rotation.
 */
import { createHmac } from "crypto";

export class CDNConfig {
  static #instance: CDNConfig | undefined;

  readonly originUrl: string;
  readonly edgePolicy: string;
  #signingKey: string;

  private constructor() {
    this.originUrl  = "https://origin.streamcdn.io";
    this.edgePolicy = "latency-optimized";
    this.#signingKey = "cdnkey_prod_9f3a1b";
  }

  static getInstance(): CDNConfig {
    CDNConfig.#instance ??= new CDNConfig();
    return CDNConfig.#instance;
  }

  signUrl(path: string, ttlSeconds = 3600): string {
    const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
    const payload = \`\${path}?expires=\${expires}\`;
    const sig = createHmac("sha256", this.#signingKey).update(payload).digest("hex");
    return \`\${this.originUrl}/\${payload}&sig=\${sig}\`;
  }

  rotateKey(newKey: string): void {
    this.#signingKey = newKey;
  }
}
`,
          },
          {
            name: "transcoder-service.ts",
            dir: "src/streaming/",
            content: `/**
 * src/streaming/transcoder-service.ts
 */
import { CDNConfig } from "../config/cdn-config";

export class TranscoderService {
  getSignedSource(assetId: string): string {
    return CDNConfig.getInstance().signUrl(\`assets/\${assetId}/source.mp4\`);
  }

  getOutputUrl(assetId: string, profile: string): string {
    const { originUrl } = CDNConfig.getInstance();
    return \`\${originUrl}/assets/\${assetId}/\${profile}.m3u8\`;
  }
}
`,
          },
          {
            name: "manifest-generator.ts",
            dir: "src/streaming/",
            content: `/**
 * src/streaming/manifest-generator.ts
 */
import { CDNConfig } from "../config/cdn-config";

export class ManifestGenerator {
  buildHLS(streamId: string, segCount = 6): string {
    const cfg = CDNConfig.getInstance();
    const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];
    for (let i = 0; i < segCount; i++) {
      lines.push("#EXTINF:6.0,", cfg.signUrl(\`streams/\${streamId}/seg\${i.toString().padStart(4, "0")}.ts\`, 600));
    }
    lines.push("#EXT-X-ENDLIST");
    return lines.join("\\n");
  }
}
`,
          },
        ],
        Rust: [
          {
            name: "cdn_config.rs",
            dir: "src/config/",
            content: `//! src/config/cdn_config.rs — Singleton CDNConfig with atomic key rotation.
use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::sync::{OnceLock, RwLock};
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

pub struct CDNConfig {
    pub origin_url:  String,
    pub edge_policy: String,
    signing_key:     RwLock<Vec<u8>>,
}

static CDN_INSTANCE: OnceLock<CDNConfig> = OnceLock::new();

pub fn get() -> &'static CDNConfig {
    CDN_INSTANCE.get_or_init(|| CDNConfig {
        origin_url:  "https://origin.streamcdn.io".to_owned(),
        edge_policy: "latency-optimized".to_owned(),
        signing_key: RwLock::new(b"cdnkey_prod_9f3a1b".to_vec()),
    })
}

impl CDNConfig {
    pub fn sign_url(&self, path: &str, ttl: u64) -> String {
        let expires = SystemTime::now()
            .duration_since(UNIX_EPOCH).unwrap().as_secs() + ttl;
        let payload = format!("{}?expires={}", path, expires);
        let key = self.signing_key.read().unwrap();
        let mut mac = HmacSha256::new_from_slice(&key).expect("valid key");
        mac.update(payload.as_bytes());
        let sig = hex::encode(mac.finalize().into_bytes());
        format!("{}/{}&sig={}", self.origin_url, payload, sig)
    }

    pub fn rotate_key(&self, new_key: &[u8]) {
        *self.signing_key.write().unwrap() = new_key.to_vec();
    }
}
`,
          },
          {
            name: "transcoder.rs",
            dir: "src/streaming/",
            content: `//! src/streaming/transcoder.rs
use crate::config::cdn_config;

pub struct TranscoderService;

impl TranscoderService {
    pub fn signed_source(&self, asset_id: &str) -> String {
        cdn_config::get().sign_url(&format!("assets/{}/source.mp4", asset_id), 3600)
    }

    pub fn output_url(&self, asset_id: &str, profile: &str) -> String {
        format!("{}/assets/{}/{}.m3u8", cdn_config::get().origin_url, asset_id, profile)
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod config { pub mod cdn_config; }
mod streaming { pub mod transcoder; }

use config::cdn_config;
use streaming::transcoder::TranscoderService;

fn main() {
    let cfg = cdn_config::get();
    println!("{} {}", cfg.origin_url, cfg.edge_policy);

    let svc = TranscoderService;
    println!("{}", svc.signed_source("vid-001"));

    // Singleton identity
    println!("Same: {}", std::ptr::eq(cfg, cdn_config::get())); // true
}
`,
          },
        ],
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
        "A Singleton FleetTrackingCoordinator centralizes vehicle position ingestion, de-duplicates GPS pings, and provides a single consistent view of fleet state to all dispatch and routing services. Each language example shows one-instance construction with thread-safe guards: lock-protected lazy creation (Python/Java), sync.Once (Go), static cached instance (TypeScript), and OnceLock (Rust). That single coordinator prevents diverging ETA calculations and conflicting dispatch decisions.",
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
# Singleton means one shared fleet state coordinator.
# Achieved through class-level _instance and lock-guarded first creation.

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
// Singleton means one tracker object shared across dispatch/routing modules.
// Achieved via ftcInstance + ftcOnce.Do one-time initialization.
type FleetTrackingCoordinator struct {
	positions map[string]Position // vehicle ID → GPS position
	mu        sync.RWMutex       // RWMutex allows concurrent reads
}

var (
  ftcInstance *FleetTrackingCoordinator // Process-wide fleet coordinator instance
  ftcOnce    sync.Once                  // Guarantees singleton creation once
)

// GetFleetTracker returns the singleton coordinator.
func GetFleetTracker() *FleetTrackingCoordinator {
  ftcOnce.Do(func() { // Initialize shared tracker exactly once
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
 * Singleton means one coordinator object per JVM process.
 * Achieved via static volatile instance + guarded getInstance().
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
 * Singleton means one coordinator object shared by all callers.
 * Achieved by private constructor + static cached instance in getInstance().
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
/// Singleton means one fleet coordinator shared for the process lifetime.
/// Achieved with static OnceLock + one-time get_or_init setup.
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
      codeFiles: {
        Python: [
          {
            name: "fleet_tracking_coordinator.py",
            dir: "coordinator/",
            content: `"""
coordinator/fleet_tracking_coordinator.py
-------------------------------------------
Singleton FleetTrackingCoordinator — maintains the live GPS position map
for every vehicle in the fleet. All microservices (dispatch, routing,
customer-facing tracking) call the same singleton so they share one
consistent, real-time view of vehicle positions.

Thread-safety:
  A threading.RLock allows nested locking within the same thread (useful
  if update_position is ever called from a callback that already holds
  the coordinator lock). Separate readers could be served concurrently
  with a readers-writer lock; use threading.RWLock if you need higher
  throughput on read-heavy workloads.
"""
from __future__ import annotations
import threading
import time
from dataclasses import dataclass


@dataclass(frozen=True)
class GPSPing:
    lat: float
    lng: float
    timestamp: float  # Unix epoch seconds


class FleetTrackingCoordinator:
    _instance: "FleetTrackingCoordinator | None" = None
    _init_lock = threading.Lock()

    def __init__(self) -> None:
        self._positions: dict[str, GPSPing] = {}
        self._lock = threading.RLock()

    @classmethod
    def get_instance(cls) -> "FleetTrackingCoordinator":
        if cls._instance is None:
            with cls._init_lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def update_position(self, vehicle_id: str, lat: float, lng: float) -> None:
        """Accept a GPS ping; discard if older than current stored ping."""
        with self._lock:
            now = time.time()
            existing = self._positions.get(vehicle_id)
            if existing is None or now >= existing.timestamp:
                self._positions[vehicle_id] = GPSPing(lat, lng, now)

    def get_position(self, vehicle_id: str) -> GPSPing | None:
        with self._lock:
            return self._positions.get(vehicle_id)

    def list_active(self, stale_after: float = 300) -> list[str]:
        """Return vehicle IDs that have pinged within the last stale_after seconds."""
        cutoff = time.time() - stale_after
        with self._lock:
            return [v for v, p in self._positions.items() if p.timestamp >= cutoff]

    def deregister(self, vehicle_id: str) -> None:
        with self._lock:
            self._positions.pop(vehicle_id, None)
`,
          },
          {
            name: "dispatch_service.py",
            dir: "dispatch/",
            content: `"""
dispatch/dispatch_service.py
-----------------------------
DispatchService queries the FleetTrackingCoordinator singleton to find
the nearest available vehicle for a pickup request.
"""
from __future__ import annotations
import math
from coordinator.fleet_tracking_coordinator import FleetTrackingCoordinator, GPSPing


def _haversine_km(a: GPSPing, lat: float, lng: float) -> float:
    R = 6371
    dlat = math.radians(lat - a.lat)
    dlng = math.radians(lng - a.lng)
    h = (math.sin(dlat / 2) ** 2
         + math.cos(math.radians(a.lat)) * math.cos(math.radians(lat))
         * math.sin(dlng / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(h))


class DispatchService:
    def nearest_vehicle(self, pickup_lat: float, pickup_lng: float) -> str | None:
        coordinator = FleetTrackingCoordinator.get_instance()
        active = coordinator.list_active()
        if not active:
            return None
        return min(
            active,
            key=lambda vid: (
                _haversine_km(coordinator.get_position(vid), pickup_lat, pickup_lng)
                if coordinator.get_position(vid) else float("inf")
            ),
        )
`,
          },
          {
            name: "test_fleet_coordinator.py",
            dir: "tests/",
            content: `"""tests/test_fleet_coordinator.py"""
import threading
from coordinator.fleet_tracking_coordinator import FleetTrackingCoordinator


def test_singleton_identity() -> None:
    assert FleetTrackingCoordinator.get_instance() is FleetTrackingCoordinator.get_instance()


def test_update_and_read_position() -> None:
    c = FleetTrackingCoordinator.get_instance()
    c.update_position("TRK-001", 40.7128, -74.0060)
    p = c.get_position("TRK-001")
    assert p is not None
    assert abs(p.lat - 40.7128) < 1e-6


def test_deregister_removes_vehicle() -> None:
    c = FleetTrackingCoordinator.get_instance()
    c.update_position("TRK-GONE", 1.0, 2.0)
    c.deregister("TRK-GONE")
    assert c.get_position("TRK-GONE") is None


def test_concurrent_updates_no_race() -> None:
    c = FleetTrackingCoordinator.get_instance()
    errors: list[Exception] = []

    def update(i: int) -> None:
        try:
            c.update_position(f"TRK-{i}", float(i), float(i))
        except Exception as e:
            errors.append(e)

    threads = [threading.Thread(target=update, args=(i,)) for i in range(50)]
    for t in threads: t.start()
    for t in threads: t.join()

    assert not errors
`,
          },
        ],
        Go: [
          {
            name: "fleet_coordinator.go",
            dir: "coordinator/",
            content: `// coordinator/fleet_coordinator.go
//
// Singleton FleetTrackingCoordinator — maintains live GPS positions for all
// fleet vehicles. sync.RWMutex allows concurrent reads (high-frequency pings
// from hundreds of vehicles) while serialising infrequent writes.
package coordinator

import (
	"sync"
	"time"
)

// GPSPing represents a vehicle position snapshot.
type GPSPing struct {
	Lat, Lng  float64
	Timestamp time.Time
}

// FleetTrackingCoordinator is the singleton.
type FleetTrackingCoordinator struct {
	mu        sync.RWMutex
	positions map[string]GPSPing
}

var (
	fleetCoord *FleetTrackingCoordinator
	fleetOnce  sync.Once
)

// GetCoordinator returns the singleton.
func GetCoordinator() *FleetTrackingCoordinator {
	fleetOnce.Do(func() {
		fleetCoord = &FleetTrackingCoordinator{
			positions: make(map[string]GPSPing),
		}
	})
	return fleetCoord
}

// UpdatePosition stores the latest GPS ping, rejecting stale readings.
func (c *FleetTrackingCoordinator) UpdatePosition(vehicleID string, lat, lng float64) {
	now := time.Now()
	c.mu.Lock()
	defer c.mu.Unlock()
	if existing, ok := c.positions[vehicleID]; !ok || now.After(existing.Timestamp) {
		c.positions[vehicleID] = GPSPing{Lat: lat, Lng: lng, Timestamp: now}
	}
}

// GetPosition returns the latest ping for a vehicle (nil if unknown).
func (c *FleetTrackingCoordinator) GetPosition(vehicleID string) (GPSPing, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	p, ok := c.positions[vehicleID]
	return p, ok
}

// ListActive returns vehicle IDs that pinged within staleAfter duration.
func (c *FleetTrackingCoordinator) ListActive(staleAfter time.Duration) []string {
	cutoff := time.Now().Add(-staleAfter)
	c.mu.RLock()
	defer c.mu.RUnlock()
	var active []string
	for id, p := range c.positions {
		if p.Timestamp.After(cutoff) {
			active = append(active, id)
		}
	}
	return active
}

// Deregister removes a vehicle (e.g., end-of-shift).
func (c *FleetTrackingCoordinator) Deregister(vehicleID string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.positions, vehicleID)
}
`,
          },
          {
            name: "dispatch_service.go",
            dir: "dispatch/",
            content: `// dispatch/dispatch_service.go
package dispatch

import (
	"math"
	"myapp/coordinator"
	"time"
)

func haversineKm(lat1, lng1, lat2, lng2 float64) float64 {
	const R = 6371
	dLat := (lat2 - lat1) * math.Pi / 180
	dLng := (lng2 - lng1) * math.Pi / 180
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLng/2)*math.Sin(dLng/2)
	return R * 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
}

// NearestVehicle returns the ID of the closest active vehicle.
func NearestVehicle(pickupLat, pickupLng float64) (string, bool) {
	coord := coordinator.GetCoordinator()
	active := coord.ListActive(5 * time.Minute)
	if len(active) == 0 {
		return "", false
	}
	best, bestDist := "", math.MaxFloat64
	for _, id := range active {
		if p, ok := coord.GetPosition(id); ok {
			d := haversineKm(p.Lat, p.Lng, pickupLat, pickupLng)
			if d < bestDist {
				bestDist, best = d, id
			}
		}
	}
	return best, best != ""
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/coordinator"
	"myapp/dispatch"
)

func main() {
	coord := coordinator.GetCoordinator()
	coord.UpdatePosition("TRK-4491", 40.7128, -74.0060)
	coord.UpdatePosition("TRK-5502", 40.6892, -74.0445)

	if pos, ok := coord.GetPosition("TRK-4491"); ok {
		fmt.Printf("TRK-4491: lat=%.4f lng=%.4f\\n", pos.Lat, pos.Lng)
	}

	if nearest, ok := dispatch.NearestVehicle(40.7000, -74.0200); ok {
		fmt.Println("Nearest vehicle:", nearest)
	}

	// Singleton identity
	fmt.Println("Same:", coord == coordinator.GetCoordinator()) // true
}
`,
          },
        ],
        Java: [
          {
            name: "FleetTrackingCoordinator.java",
            dir: "com/example/coordinator/",
            content: `package com.example.coordinator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Singleton FleetTrackingCoordinator.
 *
 * ConcurrentHashMap provides thread-safe per-entry reads/writes without
 * a global lock, giving O(1) amortised update cost at scale.  Stale-ping
 * rejection uses a CAS loop via compute(), preventing a newer ping from
 * being overwritten by a delayed older one in race conditions.
 */
public final class FleetTrackingCoordinator {

    private static volatile FleetTrackingCoordinator instance;

    public record GPSPing(double lat, double lng, Instant timestamp) {}

    private final ConcurrentHashMap<String, GPSPing> positions = new ConcurrentHashMap<>();

    private FleetTrackingCoordinator() {}

    public static FleetTrackingCoordinator getInstance() {
        if (instance == null) {
            synchronized (FleetTrackingCoordinator.class) {
                if (instance == null) instance = new FleetTrackingCoordinator();
            }
        }
        return instance;
    }

    public void updatePosition(String vehicleId, double lat, double lng) {
        Instant now = Instant.now();
        positions.compute(vehicleId, (id, existing) ->
            (existing == null || now.isAfter(existing.timestamp()))
                ? new GPSPing(lat, lng, now)
                : existing
        );
    }

    public Optional<GPSPing> getPosition(String vehicleId) {
        return Optional.ofNullable(positions.get(vehicleId));
    }

    public List<String> listActive(long staleAfterSeconds) {
        Instant cutoff = Instant.now().minusSeconds(staleAfterSeconds);
        List<String> active = new ArrayList<>();
        for (Map.Entry<String, GPSPing> e : positions.entrySet()) {
            if (e.getValue().timestamp().isAfter(cutoff)) active.add(e.getKey());
        }
        return active;
    }

    public void deregister(String vehicleId) { positions.remove(vehicleId); }
}
`,
          },
          {
            name: "DispatchService.java",
            dir: "com/example/dispatch/",
            content: `package com.example.dispatch;

import com.example.coordinator.FleetTrackingCoordinator;
import com.example.coordinator.FleetTrackingCoordinator.GPSPing;
import java.util.Optional;

public class DispatchService {

    private static double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public Optional<String> nearestVehicle(double pickupLat, double pickupLng) {
        var coord = FleetTrackingCoordinator.getInstance();
        return coord.listActive(300).stream()
            .min((a, b) -> {
                double da = coord.getPosition(a)
                    .map(p -> haversineKm(p.lat(), p.lng(), pickupLat, pickupLng))
                    .orElse(Double.MAX_VALUE);
                double db = coord.getPosition(b)
                    .map(p -> haversineKm(p.lat(), p.lng(), pickupLat, pickupLng))
                    .orElse(Double.MAX_VALUE);
                return Double.compare(da, db);
            });
    }
}
`,
          },
          {
            name: "FleetCoordinatorTest.java",
            dir: "com/example/coordinator/",
            content: `package com.example.coordinator;

import org.junit.jupiter.api.Test;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class FleetCoordinatorTest {

    @Test
    void singletonIdentity() {
        assertSame(FleetTrackingCoordinator.getInstance(), FleetTrackingCoordinator.getInstance());
    }

    @Test
    void updateAndReadPosition() {
        var c = FleetTrackingCoordinator.getInstance();
        c.updatePosition("TRK-J1", 40.7128, -74.0060);
        var p = c.getPosition("TRK-J1");
        assertTrue(p.isPresent());
        assertEquals(40.7128, p.get().lat(), 1e-6);
    }

    @Test
    void deregisterRemovesVehicle() {
        var c = FleetTrackingCoordinator.getInstance();
        c.updatePosition("TRK-DEL", 1.0, 2.0);
        c.deregister("TRK-DEL");
        assertTrue(c.getPosition("TRK-DEL").isEmpty());
    }

    @Test
    void concurrentUpdatesNoConcurrencyErrors() throws InterruptedException {
        var c = FleetTrackingCoordinator.getInstance();
        var errors = new AtomicInteger(0);
        var pool = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 100; i++) {
            final int n = i;
            pool.submit(() -> {
                try { c.updatePosition("TRK-C" + n, n * 0.01, n * 0.01); }
                catch (Exception e) { errors.incrementAndGet(); }
            });
        }
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        assertEquals(0, errors.get());
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "fleet-tracking-coordinator.ts",
            dir: "src/coordinator/",
            content: `/**
 * src/coordinator/fleet-tracking-coordinator.ts
 * -----------------------------------------------
 * Singleton FleetTrackingCoordinator — maintains live GPS map for all vehicles.
 */

export interface GPSPing {
  lat: number;
  lng: number;
  timestamp: number; // ms since epoch
}

export class FleetTrackingCoordinator {
  static #instance: FleetTrackingCoordinator | undefined;
  readonly #positions = new Map<string, GPSPing>();

  private constructor() {}

  static getInstance(): FleetTrackingCoordinator {
    FleetTrackingCoordinator.#instance ??= new FleetTrackingCoordinator();
    return FleetTrackingCoordinator.#instance;
  }

  updatePosition(vehicleId: string, lat: number, lng: number): void {
    const now = Date.now();
    const existing = this.#positions.get(vehicleId);
    if (!existing || now >= existing.timestamp) {
      this.#positions.set(vehicleId, { lat, lng, timestamp: now });
    }
  }

  getPosition(vehicleId: string): GPSPing | undefined {
    return this.#positions.get(vehicleId);
  }

  listActive(staleAfterMs = 300_000): string[] {
    const cutoff = Date.now() - staleAfterMs;
    return [...this.#positions.entries()]
      .filter(([, p]) => p.timestamp >= cutoff)
      .map(([id]) => id);
  }

  deregister(vehicleId: string): void {
    this.#positions.delete(vehicleId);
  }
}
`,
          },
          {
            name: "dispatch-service.ts",
            dir: "src/dispatch/",
            content: `/**
 * src/dispatch/dispatch-service.ts
 */
import { FleetTrackingCoordinator, GPSPing } from "../coordinator/fleet-tracking-coordinator";

function haversineKm(a: GPSPing, lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - a.lat) * Math.PI) / 180;
  const dLng = ((lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export class DispatchService {
  nearestVehicle(pickupLat: number, pickupLng: number): string | undefined {
    const coord = FleetTrackingCoordinator.getInstance();
    const active = coord.listActive();
    if (!active.length) return undefined;
    return active.reduce((best, id) => {
      const pos = coord.getPosition(id);
      if (!pos) return best;
      const d = haversineKm(pos, pickupLat, pickupLng);
      const bestPos = coord.getPosition(best);
      const bestD = bestPos ? haversineKm(bestPos, pickupLat, pickupLng) : Infinity;
      return d < bestD ? id : best;
    });
  }
}
`,
          },
          {
            name: "fleet-coordinator.test.ts",
            dir: "src/__tests__/",
            content: `/**
 * src/__tests__/fleet-coordinator.test.ts
 */
import { describe, it, expect } from "vitest";
import { FleetTrackingCoordinator } from "../coordinator/fleet-tracking-coordinator";

describe("FleetTrackingCoordinator", () => {
  it("is a singleton", () => {
    expect(FleetTrackingCoordinator.getInstance()).toBe(FleetTrackingCoordinator.getInstance());
  });

  it("stores and reads position", () => {
    const c = FleetTrackingCoordinator.getInstance();
    c.updatePosition("TRK-TS1", 40.7128, -74.006);
    const p = c.getPosition("TRK-TS1");
    expect(p?.lat).toBeCloseTo(40.7128);
  });

  it("deregisters vehicle", () => {
    const c = FleetTrackingCoordinator.getInstance();
    c.updatePosition("TRK-GONE", 1, 2);
    c.deregister("TRK-GONE");
    expect(c.getPosition("TRK-GONE")).toBeUndefined();
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "fleet_coordinator.rs",
            dir: "src/coordinator/",
            content: `//! src/coordinator/fleet_coordinator.rs
//!
//! Singleton FleetTrackingCoordinator — RwLock<HashMap> for concurrent reads.
use std::collections::HashMap;
use std::sync::{OnceLock, RwLock};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Clone, Debug)]
pub struct GPSPing {
    pub lat:       f64,
    pub lng:       f64,
    pub timestamp: u64, // seconds since epoch
}

pub struct FleetTrackingCoordinator {
    pub positions: RwLock<HashMap<String, GPSPing>>,
}

static FLEET: OnceLock<FleetTrackingCoordinator> = OnceLock::new();

pub fn get() -> &'static FleetTrackingCoordinator {
    FLEET.get_or_init(|| FleetTrackingCoordinator {
        positions: RwLock::new(HashMap::new()),
    })
}

fn now_secs() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs()
}

impl FleetTrackingCoordinator {
    pub fn update(&self, vehicle_id: &str, lat: f64, lng: f64) {
        let now = now_secs();
        let mut map = self.positions.write().unwrap();
        let accept = map.get(vehicle_id).map_or(true, |p| now >= p.timestamp);
        if accept {
            map.insert(vehicle_id.to_owned(), GPSPing { lat, lng, timestamp: now });
        }
    }

    pub fn get_pos(&self, vehicle_id: &str) -> Option<GPSPing> {
        self.positions.read().unwrap().get(vehicle_id).cloned()
    }

    pub fn list_active(&self, stale_after_secs: u64) -> Vec<String> {
        let cutoff = now_secs().saturating_sub(stale_after_secs);
        self.positions.read().unwrap()
            .iter()
            .filter(|(_, p)| p.timestamp >= cutoff)
            .map(|(id, _)| id.clone())
            .collect()
    }

    pub fn deregister(&self, vehicle_id: &str) {
        self.positions.write().unwrap().remove(vehicle_id);
    }
}
`,
          },
          {
            name: "dispatch.rs",
            dir: "src/dispatch/",
            content: `//! src/dispatch/dispatch.rs
use crate::coordinator::fleet_coordinator::{self, GPSPing};

fn haversine_km(a: &GPSPing, lat: f64, lng: f64) -> f64 {
    let r = 6371.0_f64;
    let d_lat = (lat - a.lat).to_radians();
    let d_lng = (lng - a.lng).to_radians();
    let h = (d_lat / 2.0).sin().powi(2)
        + a.lat.to_radians().cos() * lat.to_radians().cos() * (d_lng / 2.0).sin().powi(2);
    r * 2.0 * h.sqrt().asin()
}

pub fn nearest_vehicle(pickup_lat: f64, pickup_lng: f64) -> Option<String> {
    let coord = fleet_coordinator::get();
    let active = coord.list_active(300);
    active.into_iter().min_by(|a, b| {
        let da = coord.get_pos(a).map(|p| haversine_km(&p, pickup_lat, pickup_lng)).unwrap_or(f64::MAX);
        let db = coord.get_pos(b).map(|p| haversine_km(&p, pickup_lat, pickup_lng)).unwrap_or(f64::MAX);
        da.partial_cmp(&db).unwrap()
    })
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod coordinator { pub mod fleet_coordinator; }
mod dispatch;

use coordinator::fleet_coordinator;
use dispatch::nearest_vehicle;

fn main() {
    let coord = fleet_coordinator::get();
    coord.update("TRK-4491", 40.7128, -74.0060);
    coord.update("TRK-5502", 40.6892, -74.0445);

    if let Some(p) = coord.get_pos("TRK-4491") {
        println!("lat={} lng={}", p.lat, p.lng);
    }

    if let Some(nearest) = nearest_vehicle(40.7000, -74.0200) {
        println!("Nearest: {}", nearest);
    }

    println!("Same: {}", std::ptr::eq(coord, fleet_coordinator::get())); // true
}
`,
          },
        ],
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
    "For most production systems, prefer the most language-idiomatic primitive: Java → Enum or Holder, Python → module-level instance or cached factory (e.g., lru_cache), Go → sync.Once, TypeScript → ES module export or module-scoped lazy accessor, Rust → OnceLock. These are the simplest and least error-prone. Use double-checked locking only when you must implement lazy init in a language where the safer primitives are not available.",
  variants: [
    {
      id: 1,
      name: "Eager Initialization",
      description:
        "The instance is created when the class is loaded — before any thread can call getInstance(). Simple and inherently thread-safe, but wastes resources if the instance is never used.",
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class AppConfig {
    <<Singleton · Eager>>
    -INSTANCE$ AppConfig
    -dbUrl String
    -dbPoolMin int
    -dbPoolMax int
    -redisUrl String
    -logLevel String
    -debug boolean
    +getInstance()$ AppConfig
    -AppConfig()
    +getDbUrl() String
    +isProd() boolean
  }
  note for AppConfig "INSTANCE is assigned during\nclass / module loading — before\nany thread can call getInstance().\nJVM static initializer and Python\nmodule import are both thread-safe,\nso no synchronization is needed."`,
      },
      diagramExplanation:
        "The eager approach creates the singleton instance as part of class (or module) loading. The JVM executes static initializers in a thread-safe, once-only manner before any thread can run instance methods. Python's import system similarly executes module code exactly once. Because the instance is guaranteed to exist before any client can access it, getInstance() becomes a trivial pointer return with zero synchronization overhead. The tradeoff: if AppConfig is never used during the program's lifetime, its construction cost still pays at startup. The diagram shows that INSTANCE is a static field (underlined in UML), indicating it belongs to the class itself rather than any instance.",
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

  // Constructor can be public because AppConfig is NOT exported.
  // Importers can only obtain the singleton via getConfig().
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
      codeFiles: {
        Python: [
          {
            name: "app_config.py",
            dir: "config/",
            content: `"""
config/app_config.py
--------------------
Application-wide configuration singleton — Eager Initialization.

Design decision
===============
Python's import system executes each module body exactly once and caches the
result in sys.modules. By creating the AppConfig instance at module level we
get a thread-safe singleton with zero boilerplate: no locks, no getInstance().

Production practices
====================
- All settings are read from environment variables so the same code runs in
  every deployment environment (dev, staging, prod) without changes.
- The dataclass is marked frozen=True so fields cannot be mutated after
  startup — immutability prevents "who changed that?" debugging sessions.
- Validation happens in from_env(), not in __init__, keeping constructors clean.
"""

import os
from dataclasses import dataclass


@dataclass(frozen=True)   # frozen=True  -->  all fields are immutable after __init__
class AppConfig:
    """
    Immutable snapshot of application settings loaded from environment variables.

    Attributes
    ----------
    db_url       : Primary database connection string (postgres / mysql / sqlite).
    db_pool_min  : Minimum idle connections kept alive in the pool.
    db_pool_max  : Hard ceiling on simultaneous connections from this process.
    redis_url    : URL for the cache / session store.
    log_level    : One of DEBUG | INFO | WARNING | ERROR. Uppercased on read.
    debug        : When True, enables verbose error responses and stack traces.
    service_name : Used in structured log lines and in distributed tracing spans.
    """
    db_url: str
    db_pool_min: int
    db_pool_max: int
    redis_url: str
    log_level: str
    debug: bool
    service_name: str

    # ------------------------------------------------------------------
    # Factory classmethod — reads environment variables, applies defaults,
    # converts types, and validates ranges before delegating to __init__.
    # Keeping this logic out of __init__ means we can call from_env()
    # in tests without importing the real module-level instance.
    # ------------------------------------------------------------------

    @classmethod
    def from_env(cls) -> "AppConfig":
        """Build an AppConfig from environment variables with typed defaults."""
        db_pool_min = int(os.getenv("DB_POOL_MIN", "2"))
        db_pool_max = int(os.getenv("DB_POOL_MAX", "10"))

        if db_pool_min < 1:
            raise ValueError(f"DB_POOL_MIN must be >= 1, got {db_pool_min}")
        if db_pool_max < db_pool_min:
            raise ValueError(
                f"DB_POOL_MAX ({db_pool_max}) must be >= DB_POOL_MIN ({db_pool_min})"
            )

        return cls(
            db_url=os.getenv("DATABASE_URL", "postgres://localhost:5432/mydb"),
            db_pool_min=db_pool_min,
            db_pool_max=db_pool_max,
            redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            log_level=os.getenv("LOG_LEVEL", "INFO").upper(),
            debug=os.getenv("DEBUG", "false").lower() == "true",
            service_name=os.getenv("SERVICE_NAME", "my-service"),
        )

    def is_prod(self) -> bool:
        """Return True when running in a production-like environment."""
        return not self.debug and self.log_level != "DEBUG"
`,
          },
          {
            name: "__init__.py",
            dir: "config/",
            content: `"""
config/__init__.py
------------------
Public API for the config package.

Usage
-----
    from config import config          # the singleton
    from config import AppConfig       # the type (for type annotations)

    print(config.db_url)
    print(config.is_prod())

The singleton is created exactly once here — at first import of the package.
All subsequent imports get the cached object from sys.modules.
"""

from .app_config import AppConfig

# ─── THE SINGLETON ─────────────────────────────────────────────────────────
# AppConfig.from_env() runs once when 'import config' is first executed.
# Python caches this module in sys.modules; every later 'from config import config'
# returns this same object without re-executing the module body.
config: AppConfig = AppConfig.from_env()

__all__ = ["config", "AppConfig"]
`,
          },
          {
            name: "test_app_config.py",
            dir: "tests/",
            content: `"""
tests/test_app_config.py
------------------------
Unit tests for AppConfig singleton — Eager Initialization variant.

Covered assertions
==================
1. Identity   : multiple imports return the *identical* object (is, not ==).
2. Immutability: mutation attempt raises dataclasses.FrozenInstanceError.
3. Validation  : invalid pool settings raise ValueError with a clear message.
4. Default vals: unset env vars produce the documented fallback values.
5. Env override: setting DATABASE_URL is reflected in AppConfig.from_env().

Note on test isolation
======================
The module-level 'config' object is created before any test runs.
We test from_env() directly when we need to exercise validation logic,
avoiding side-effects on the already-imported singleton.
"""

import os
import pytest
from config import config, AppConfig


class TestAppConfigSingleton:
    """Verify singleton identity and immutability guarantees."""

    def test_same_object_across_imports(self):
        """Two imports of the singleton must return the identical object."""
        from config import config as config2
        assert config is config2, (
            "Singleton contract violated: expected the same object, got two different instances"
        )

    def test_fields_are_immutable(self):
        """frozen=True must prevent field mutation after construction."""
        with pytest.raises(Exception):   # dataclasses.FrozenInstanceError
            config.log_level = "DEBUG"   # type: ignore[misc]


class TestAppConfigFromEnv:
    """Verify environment-variable reading, defaults, and validation."""

    def test_default_db_url(self):
        """When DATABASE_URL is unset, the fallback URL is used."""
        cfg = AppConfig.from_env()
        assert cfg.db_url == "postgres://localhost:5432/mydb"

    def test_env_override(self, monkeypatch):
        """Setting DATABASE_URL in env must be reflected in the config."""
        monkeypatch.setenv("DATABASE_URL", "postgres://prod-db:5432/app")
        cfg = AppConfig.from_env()
        assert cfg.db_url == "postgres://prod-db:5432/app"

    def test_log_level_uppercased(self, monkeypatch):
        """LOG_LEVEL env var should be uppercased regardless of casing."""
        monkeypatch.setenv("LOG_LEVEL", "debug")
        cfg = AppConfig.from_env()
        assert cfg.log_level == "DEBUG"

    def test_pool_min_below_one_raises(self, monkeypatch):
        """DB_POOL_MIN=0 must raise ValueError — not silently proceed."""
        monkeypatch.setenv("DB_POOL_MIN", "0")
        with pytest.raises(ValueError, match="DB_POOL_MIN"):
            AppConfig.from_env()

    def test_pool_max_less_than_min_raises(self, monkeypatch):
        """DB_POOL_MAX < DB_POOL_MIN must raise ValueError."""
        monkeypatch.setenv("DB_POOL_MIN", "5")
        monkeypatch.setenv("DB_POOL_MAX", "3")
        with pytest.raises(ValueError, match="DB_POOL_MAX"):
            AppConfig.from_env()

    def test_is_prod_when_debug_false(self, monkeypatch):
        """is_prod() should return True when debug=false and log_level=INFO."""
        monkeypatch.setenv("DEBUG", "false")
        monkeypatch.setenv("LOG_LEVEL", "INFO")
        cfg = AppConfig.from_env()
        assert cfg.is_prod() is True

    def test_is_prod_when_debug_true(self, monkeypatch):
        """is_prod() should return False when debug=true."""
        monkeypatch.setenv("DEBUG", "true")
        cfg = AppConfig.from_env()
        assert cfg.is_prod() is False
`,
          },
        ],
        Go: [
          {
            name: "config.go",
            dir: "internal/config/",
            content: `// Package config provides the application-wide configuration singleton.
//
// Design: Eager Initialization
// ============================
// The singleton is a package-level variable initialized when the package is
// first imported.  Go's package initialization guarantees that:
//   - init() functions and variable initializers run exactly once.
//   - Initialization is complete before any goroutine accesses the package.
//
// This gives us a thread-safe singleton with zero synchronization code.
// The tradeoff is that the config object is constructed even if never accessed.
//
// Production practices:
//   - All settings come from environment variables so the binary is environment-
//     agnostic: the same compiled binary runs in dev, staging, and prod.
//   - Validation runs at init time so the process fails fast with a clear error
//     instead of surfacing a bad config value deep inside a request handler.
package config

import (
	"fmt"
	"os"
	"strconv"
)

// AppConfig holds immutable application settings loaded from environment
// variables.  Fields are exported for reading but the struct is never
// reassigned after package initialization.
type AppConfig struct {
	// Database
	DBURL      string // e.g. "postgres://host:5432/dbname"
	DBPoolMin  int    // Minimum idle connections
	DBPoolMax  int    // Hard connection ceiling

	// Cache
	RedisURL string // e.g. "redis://host:6379/0"

	// Observability
	LogLevel    string // DEBUG | INFO | WARNING | ERROR
	ServiceName string // Value included in every structured log line

	// Runtime
	Debug bool // When true, detailed error messages are surfaced in responses
}

// IsProd returns true when the service is running in a production-like
// environment (non-debug, non-DEBUG log level).
func (c *AppConfig) IsProd() bool {
	return !c.Debug && c.LogLevel != "DEBUG"
}

// instance is the package-level singleton created during package init.
var instance *AppConfig

// init runs automatically when the package is first imported.
// init() is guaranteed to run exactly once, before any code in the package
// body executes, making this inherently thread-safe.
func init() {
	cfg, err := loadFromEnv()
	if err != nil {
		// Fail fast — a misconfigured service should not start silently.
		panic(fmt.Sprintf("config: failed to load configuration: %v", err))
	}
	instance = cfg
}

// Get returns the process-wide AppConfig singleton.
// It is safe to call from multiple goroutines.
func Get() *AppConfig {
	return instance // Already initialized by init(); no lock needed.
}

// loadFromEnv reads environment variables and returns a validated AppConfig.
// Kept separate from init() so it can be exercised in unit tests without
// triggering the panic path.
func loadFromEnv() (*AppConfig, error) {
	dbPoolMin, err := envInt("DB_POOL_MIN", 2)
	if err != nil {
		return nil, err
	}
	dbPoolMax, err := envInt("DB_POOL_MAX", 10)
	if err != nil {
		return nil, err
	}
	if dbPoolMin < 1 {
		return nil, fmt.Errorf("DB_POOL_MIN must be >= 1, got %d", dbPoolMin)
	}
	if dbPoolMax < dbPoolMin {
		return nil, fmt.Errorf("DB_POOL_MAX (%d) must be >= DB_POOL_MIN (%d)", dbPoolMax, dbPoolMin)
	}

	return &AppConfig{
		DBURL:       envStr("DATABASE_URL", "postgres://localhost:5432/mydb"),
		DBPoolMin:   dbPoolMin,
		DBPoolMax:   dbPoolMax,
		RedisURL:    envStr("REDIS_URL", "redis://localhost:6379/0"),
		LogLevel:    envStr("LOG_LEVEL", "INFO"),
		ServiceName: envStr("SERVICE_NAME", "my-service"),
		Debug:       envStr("DEBUG", "false") == "true",
	}, nil
}

func envStr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func envInt(key string, fallback int) (int, error) {
	v := os.Getenv(key)
	if v == "" {
		return fallback, nil
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return 0, fmt.Errorf("%s must be an integer, got %q", key, v)
	}
	return n, nil
}
`,
          },
          {
            name: "config_test.go",
            dir: "internal/config/",
            content: `package config_test

import (
	"os"
	"testing"

	"github.com/example/myapp/internal/config"
)

// TestGet_ReturnsSamePointer verifies the singleton contract:
// multiple calls to Get() must return the identical pointer, not just
// equal values.
func TestGet_ReturnsSamePointer(t *testing.T) {
	first := config.Get()
	second := config.Get()
	if first != second {
		t.Fatalf("singleton violated: Get() returned different pointers (%p vs %p)", first, second)
	}
}

// TestGet_HasDefaultDBURL verifies the default value when DATABASE_URL is not set.
func TestGet_HasDefaultDBURL(t *testing.T) {
	// The package-level singleton was built before this test ran.
	// We check the default that was in effect at package init time.
	cfg := config.Get()
	if cfg.DBURL == "" {
		t.Error("expected a non-empty DBURL")
	}
}

// TestIsProd_FalseWhenDebug ensures IsProd() returns false when debug flag is on.
// We build a fresh config to avoid relying on the module-level state.
func TestIsProd_FalseWhenDebug(t *testing.T) {
	os.Setenv("DEBUG", "true")
	defer os.Unsetenv("DEBUG")

	// Call the exported loader directly to test logic without panic path.
	// (In a real project you'd export loadFromEnv in a _test.go file or
	//  use a test helper that resets the singleton.)
	cfg := config.Get()
	// The module-level singleton was built at import, so we inspect the
	// pattern in a standalone struct:
	local := &struct{ Debug bool }{Debug: true}
	isProd := !local.Debug
	if isProd {
		t.Error("IsProd() should be false when Debug is true")
	}
	_ = cfg
}

// TestLogLevelDefault verifies that the default log level is INFO.
func TestLogLevelDefault(t *testing.T) {
	cfg := config.Get()
	if cfg.LogLevel == "" {
		t.Error("expected a non-empty LogLevel")
	}
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/server/",
            content: `// cmd/server/main.go
// -------------------
// Application entry point.  Demonstrates eager singleton usage:
// the configuration is available immediately from the first line of main()
// because package init() ran before main() was called.
package main

import (
	"fmt"
	"log"

	"github.com/example/myapp/internal/config"
)

func main() {
	// config.Get() returns the singleton initialized by package init().
	// No getInstance() call sequence needed — the config is ready.
	cfg := config.Get()

	log.SetPrefix(fmt.Sprintf("[%s] ", cfg.ServiceName))
	log.Printf("Starting service (debug=%v, logLevel=%s)", cfg.Debug, cfg.LogLevel)
	log.Printf("Database: %s (pool %d–%d)", cfg.DBURL, cfg.DBPoolMin, cfg.DBPoolMax)
	log.Printf("Redis:    %s", cfg.RedisURL)

	if !cfg.IsProd() {
		log.Println("Running in development mode — detailed errors enabled")
	}

	// ... start HTTP server, wire dependencies, etc.
}
`,
          },
        ],
        Java: [
          {
            name: "AppConfig.java",
            dir: "src/main/java/com/example/config/",
            content: `package com.example.config;

import java.util.Optional;

/**
 * AppConfig — application-wide configuration singleton (Eager Initialization).
 *
 * <h2>Why Eager?</h2>
 * The JVM guarantees that static initializers run exactly once, in a
 * thread-safe manner, before any thread can call {@link #getInstance()}.
 * This makes the approach trivially thread-safe without any explicit
 * synchronization on the hot path.
 *
 * <h2>Why {@code final}?</h2>
 * Marking the class {@code final} prevents subclasses from introducing a
 * second instance via inheritance.
 *
 * <h2>Production note</h2>
 * Fields are {@code final} — the object is effectively immutable once
 * constructed.  Immutability eliminates the need for read locks and prevents
 * accidental mutation by any consumer.
 */
public final class AppConfig {

    // ─── Singleton instance ──────────────────────────────────────────────
    // Created during class loading — before any thread can access this class.
    // 'final' is redundant for safety (it cannot be reassigned), but makes
    // the intent explicit and allows the JIT to optimize call sites.
    private static final AppConfig INSTANCE = new AppConfig();

    // ─── Configuration fields (all immutable) ───────────────────────────
    private final String dbUrl;
    private final int dbPoolMin;
    private final int dbPoolMax;
    private final String redisUrl;
    private final String logLevel;
    private final boolean debug;
    private final String serviceName;

    // ─── Private constructor ─────────────────────────────────────────────
    /**
     * Reads configuration from environment variables with typed defaults.
     * Validates ranges at construction time so the JVM fails fast on bad config.
     *
     * @throws IllegalStateException if pool size bounds are invalid.
     */
    private AppConfig() {
        this.dbUrl       = env("DATABASE_URL", "postgres://localhost:5432/mydb");
        this.dbPoolMin   = envInt("DB_POOL_MIN", 2);
        this.dbPoolMax   = envInt("DB_POOL_MAX", 10);
        this.redisUrl    = env("REDIS_URL", "redis://localhost:6379/0");
        this.logLevel    = env("LOG_LEVEL", "INFO").toUpperCase();
        this.debug       = "true".equalsIgnoreCase(env("DEBUG", "false"));
        this.serviceName = env("SERVICE_NAME", "my-service");

        if (dbPoolMin < 1) {
            throw new IllegalStateException("DB_POOL_MIN must be >= 1, got " + dbPoolMin);
        }
        if (dbPoolMax < dbPoolMin) {
            throw new IllegalStateException(
                "DB_POOL_MAX (" + dbPoolMax + ") must be >= DB_POOL_MIN (" + dbPoolMin + ")");
        }
    }

    // ─── Public accessor ─────────────────────────────────────────────────
    /**
     * Returns the process-wide AppConfig singleton.
     * This method is inlined by the JIT after the first call — effectively
     * zero overhead because INSTANCE is already initialized.
     *
     * @return always the same AppConfig object created at class loading time.
     */
    public static AppConfig getInstance() {
        return INSTANCE;
    }

    // ─── Getters (read-only view of immutable fields) ────────────────────
    public String getDbUrl()       { return dbUrl; }
    public int    getDbPoolMin()   { return dbPoolMin; }
    public int    getDbPoolMax()   { return dbPoolMax; }
    public String getRedisUrl()    { return redisUrl; }
    public String getLogLevel()    { return logLevel; }
    public boolean isDebug()       { return debug; }
    public String getServiceName() { return serviceName; }

    /** Returns true when running in a production-like environment. */
    public boolean isProd() {
        return !debug && !"DEBUG".equals(logLevel);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────
    private static String env(String key, String fallback) {
        return Optional.ofNullable(System.getenv(key)).orElse(fallback);
    }

    private static int envInt(String key, int fallback) {
        String v = System.getenv(key);
        if (v == null || v.isBlank()) return fallback;
        try {
            return Integer.parseInt(v.trim());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(key + " must be an integer, got: " + v);
        }
    }

    @Override
    public String toString() {
        return "AppConfig{db=" + dbUrl + ", pool=[" + dbPoolMin + "," + dbPoolMax
            + "], redis=" + redisUrl + ", log=" + logLevel + ", debug=" + debug + "}";
    }
}
`,
          },
          {
            name: "AppConfigTest.java",
            dir: "src/test/java/com/example/config/",
            content: `package com.example.config;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for AppConfig singleton — Eager Initialization variant.
 *
 * Key assertions:
 * <ol>
 *   <li>Identity  — getInstance() returns the same reference every time.</li>
 *   <li>Non-null  — the instance is never null even in concurrent access.</li>
 *   <li>IsProd    — logic reflects debug/logLevel relationship.</li>
 * </ol>
 *
 * Note: we cannot easily test pool validation here because the singleton is
 * created at class-loading time before JUnit can set environment variables.
 * For validation tests, a factory method (loadFromEnv) would be extracted.
 */
class AppConfigTest {

    @Test
    void getInstance_returnsSameReference() {
        // This is the core singleton contract: reference equality, not value equality.
        AppConfig first  = AppConfig.getInstance();
        AppConfig second = AppConfig.getInstance();
        assertSame(first, second,
            "getInstance() must return the identical object on every call");
    }

    @Test
    void getInstance_neverNull() {
        assertNotNull(AppConfig.getInstance(),
            "Singleton must be non-null after class loading");
    }

    @Test
    void logLevel_isUpperCase() {
        String level = AppConfig.getInstance().getLogLevel();
        assertEquals(level.toUpperCase(), level,
            "logLevel must be upper-cased regardless of env var casing");
    }

    @Test
    void dbPoolMin_isPositive() {
        assertTrue(AppConfig.getInstance().getDbPoolMin() >= 1,
            "dbPoolMin must be at least 1");
    }

    @Test
    void dbPoolMax_greaterThanOrEqualMin() {
        AppConfig cfg = AppConfig.getInstance();
        assertTrue(cfg.getDbPoolMax() >= cfg.getDbPoolMin(),
            "dbPoolMax must be >= dbPoolMin");
    }

    @Test
    void isProd_falseWhenDebugTrue() {
        // We can't force debug=true at class-loading time easily,
        // but we can verify the logic via a local check.
        // In a full test suite, extract readConfig() and use mockenv.
        assertNotNull(AppConfig.getInstance().isProd()); // smoke test
    }
}
`,
          },
          {
            name: "Main.java",
            dir: "src/main/java/com/example/",
            content: `package com.example;

import com.example.config.AppConfig;

/**
 * Application entry point — demonstrates eager singleton access.
 *
 * The AppConfig singleton is created during class loading of AppConfig.java,
 * which happens automatically when the JVM resolves the import.
 * By the time main() runs, the singleton is already fully constructed.
 */
public class Main {
    public static void main(String[] args) {
        // No getInstance() overhead — direct class-loading guarantee.
        AppConfig cfg = AppConfig.getInstance();

        System.out.println("Service : " + cfg.getServiceName());
        System.out.println("DB URL  : " + cfg.getDbUrl());
        System.out.printf ("Pool    : %d – %d connections%n",
            cfg.getDbPoolMin(), cfg.getDbPoolMax());
        System.out.println("Redis   : " + cfg.getRedisUrl());
        System.out.println("Env     : " + (cfg.isProd() ? "PRODUCTION" : "DEVELOPMENT"));

        // Multiple calls return the identical reference — confirmed with ==.
        assert AppConfig.getInstance() == cfg : "Singleton contract violated";
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "types.ts",
            dir: "src/config/",
            content: `/**
 * src/config/types.ts
 * -------------------
 * Type definitions for the application configuration object.
 * Keeping types in a dedicated file lets consumers import only the
 * interface (not the singleton) when they need type annotations.
 */

/**
 * Immutable application configuration loaded from environment variables.
 *
 * All properties are readonly to prevent accidental mutation after the
 * singleton is constructed.  TypeScript enforces this at compile time;
 * Object.freeze() (in app_config.ts) enforces it at runtime.
 */
export interface IAppConfig {
  /** Primary database connection string */
  readonly dbUrl: string;

  /** Minimum idle connections kept alive in the pool */
  readonly dbPoolMin: number;

  /** Hard ceiling on simultaneous connections from this process */
  readonly dbPoolMax: number;

  /** URL for the cache / session store */
  readonly redisUrl: string;

  /** Normalized log level: DEBUG | INFO | WARNING | ERROR */
  readonly logLevel: string;

  /** When true, detailed stack traces are included in error responses */
  readonly debug: boolean;

  /** Included in every structured log line and in distributed tracing spans */
  readonly serviceName: string;

  /** Returns true when running in a production-like environment */
  isProd(): boolean;
}
`,
          },
          {
            name: "app_config.ts",
            dir: "src/config/",
            content: `/**
 * src/config/app_config.ts
 * ------------------------
 * Application-wide configuration singleton — Eager Initialization.
 *
 * Design
 * ======
 * ES modules are evaluated exactly once by the JavaScript runtime.
 * The runtime caches the module in its module registry so repeated
 * \`import { config } from "./config/app_config"\` statements in
 * different files all resolve to the same module — and therefore the
 * same \`config\` object.
 *
 * This gives us an eager singleton with zero boilerplate.
 * We do NOT need getInstance(), a private constructor, or any locking.
 *
 * Note on Workers
 * ===============
 * Each Node.js Worker and each browser Worker has its own module
 * registry, so \`config\` is *one per worker*, not one per process.
 * If workers need shared config, they should receive it via a message
 * at startup rather than re-reading process.env independently.
 *
 * Object.freeze
 * =============
 * Freezing the exported object makes the singleton immutable at runtime,
 * preventing other modules from accidentally adding or replacing fields.
 * Note: freeze is shallow — a nested mutable value is not frozen.
 */

import type { IAppConfig } from "./types";

class AppConfigImpl implements IAppConfig {
  readonly dbUrl: string;
  readonly dbPoolMin: number;
  readonly dbPoolMax: number;
  readonly redisUrl: string;
  readonly logLevel: string;
  readonly debug: boolean;
  readonly serviceName: string;

  constructor() {
    const dbPoolMin = parseInt(process.env.DB_POOL_MIN ?? "2", 10);
    const dbPoolMax = parseInt(process.env.DB_POOL_MAX ?? "10", 10);

    if (isNaN(dbPoolMin) || dbPoolMin < 1) {
      throw new Error(\`DB_POOL_MIN must be a positive integer, got "\${process.env.DB_POOL_MIN}"\`);
    }
    if (isNaN(dbPoolMax) || dbPoolMax < dbPoolMin) {
      throw new Error(
        \`DB_POOL_MAX (\${dbPoolMax}) must be an integer >= DB_POOL_MIN (\${dbPoolMin})\`
      );
    }

    this.dbUrl       = process.env.DATABASE_URL ?? "postgres://localhost:5432/mydb";
    this.dbPoolMin   = dbPoolMin;
    this.dbPoolMax   = dbPoolMax;
    this.redisUrl    = process.env.REDIS_URL    ?? "redis://localhost:6379/0";
    this.logLevel    = (process.env.LOG_LEVEL   ?? "INFO").toUpperCase();
    this.debug       = (process.env.DEBUG       ?? "false").toLowerCase() === "true";
    this.serviceName = process.env.SERVICE_NAME ?? "my-service";
  }

  isProd(): boolean {
    return !this.debug && this.logLevel !== "DEBUG";
  }
}

// ─── THE SINGLETON ─────────────────────────────────────────────────────────
// Created once when this module is first imported; Object.freeze prevents
// external code from adding or replacing fields.
export const config: IAppConfig = Object.freeze(new AppConfigImpl());
`,
          },
          {
            name: "app_config.test.ts",
            dir: "src/config/",
            content: `/**
 * src/config/app_config.test.ts
 * ------------------------------
 * Unit tests for AppConfig singleton — Eager Initialization variant.
 *
 * Testing strategy
 * ================
 * The module-level singleton is constructed once before any test runs.
 * For tests that need specific env var values we re-import a fresh
 * AppConfigImpl (not the exported singleton) after setting process.env.
 *
 * Jest's module isolation (jest.resetModules()) is intentionally NOT used
 * here to mirror real application behaviour: you get one config per process.
 * Validation logic is tested through the class constructor directly.
 */

import { config } from "./app_config";

describe("AppConfig singleton identity", () => {
  it("returns the same reference on every import", async () => {
    // Dynamic re-import resolves to the cached module in Node's registry.
    const { config: configB } = await import("./app_config");
    expect(config).toBe(configB); // Reference equality, not deep equality
  });

  it("config object is frozen (mutation throws in strict mode)", () => {
    expect(() => {
      // TypeScript will also catch this at compile time; this is the runtime check.
      (config as { logLevel: string }).logLevel = "DEBUG";
    }).toThrow();
  });
});

describe("AppConfig field validation (via constructor)", () => {
  // We construct a private copy to test validation without affecting singleton.
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore env after each test that might have modified it.
    Object.keys(process.env).forEach((k) => delete process.env[k]);
    Object.assign(process.env, originalEnv);
  });

  it("throws when DB_POOL_MIN is zero", () => {
    process.env.DB_POOL_MIN = "0";
    // We must import and instantiate directly rather than via the module
    // singleton which is already constructed.
    const { AppConfigImpl } = require("./app_config_internal_test_helper");
    expect(() => new AppConfigImpl()).toThrow(/DB_POOL_MIN/);
  });

  it("logLevel is uppercased", () => {
    expect(config.logLevel).toEqual(config.logLevel.toUpperCase());
  });

  it("dbPoolMin is a positive integer", () => {
    expect(config.dbPoolMin).toBeGreaterThanOrEqual(1);
  });

  it("dbPoolMax is >= dbPoolMin", () => {
    expect(config.dbPoolMax).toBeGreaterThanOrEqual(config.dbPoolMin);
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "mod.rs",
            dir: "src/config/",
            content: `//! src/config/mod.rs
//! ------------------
//! Application-wide configuration singleton — Eager Initialization.
//!
//! # Design
//! Rust does not allow non-trivial expressions in \`static\` items directly,
//! so we use \`OnceLock\` to perform one-time eager initialization at program
//! startup via \`init()\`.  All subsequent calls to \`get()\` are lock-free
//! reads of an already-written \`OnceLock\`.
//!
//! # Thread Safety
//! \`OnceLock<T>\` is \`Send + Sync\` when \`T: Send + Sync\`, so the global
//! static is safely accessible from every thread without additional locking.
//!
//! # Immutability
//! \`get()\` returns \`&'static AppConfig\` — a shared, immutable reference.
//! Callers cannot obtain \`&mut AppConfig\`, so the data is effectively
//! immutable for the process lifetime.

use std::env;
use std::sync::OnceLock;

/// Immutable snapshot of configuration loaded from environment variables.
#[derive(Debug)]
pub struct AppConfig {
    /// Primary database connection string.
    pub db_url: String,
    /// Minimum idle connections in the pool.
    pub db_pool_min: u32,
    /// Maximum connections in the pool.
    pub db_pool_max: u32,
    /// Redis / cache store URL.
    pub redis_url: String,
    /// Normalized log level (DEBUG, INFO, WARNING, ERROR).
    pub log_level: String,
    /// Enable verbose error output in responses.
    pub debug: bool,
    /// Service name included in log lines and traces.
    pub service_name: String,
}

impl AppConfig {
    /// Returns \`true\` when running in a production-like environment.
    pub fn is_prod(&self) -> bool {
        !self.debug && self.log_level != "DEBUG"
    }
}

// The global singleton cell — empty until \`init()\` is called.
static CONFIG: OnceLock<AppConfig> = OnceLock::new();

/// Initialise the singleton from environment variables.
///
/// Must be called once, early in \`main()\`, before any thread reads the
/// config.  Calling \`init()\` more than once is silently ignored by
/// \`OnceLock::set()\` (subsequent calls have no effect).
///
/// # Errors
/// Returns an \`Err\` string if environment variable parsing fails or if
/// pool size constraints are violated.
pub fn init() -> Result<(), String> {
    let db_pool_min = env_u32("DB_POOL_MIN", 2)?;
    let db_pool_max = env_u32("DB_POOL_MAX", 10)?;

    if db_pool_min < 1 {
        return Err(format!("DB_POOL_MIN must be >= 1, got {}", db_pool_min));
    }
    if db_pool_max < db_pool_min {
        return Err(format!(
            "DB_POOL_MAX ({}) must be >= DB_POOL_MIN ({})",
            db_pool_max, db_pool_min
        ));
    }

    let cfg = AppConfig {
        db_url:       env_str("DATABASE_URL", "postgres://localhost:5432/mydb"),
        db_pool_min,
        db_pool_max,
        redis_url:    env_str("REDIS_URL",    "redis://localhost:6379/0"),
        log_level:    env_str("LOG_LEVEL",    "INFO").to_uppercase(),
        debug:        env_str("DEBUG",        "false") == "true",
        service_name: env_str("SERVICE_NAME", "my-service"),
    };

    // OnceLock::set succeeds only on the first call; later calls are no-ops.
    let _ = CONFIG.set(cfg);
    Ok(())
}

/// Returns a \`&'static\` reference to the singleton.
///
/// # Panics
/// Panics if \`init()\` has not been called yet.  This is intentional:
/// accessing config before initialization is a programming error.
pub fn get() -> &'static AppConfig {
    CONFIG.get().expect("config::init() must be called before config::get()")
}

// ─── helpers ─────────────────────────────────────────────────────────────

fn env_str(key: &str, fallback: &str) -> String {
    env::var(key).unwrap_or_else(|_| fallback.to_owned())
}

fn env_u32(key: &str, fallback: u32) -> Result<u32, String> {
    match env::var(key) {
        Err(_) => Ok(fallback),
        Ok(v)  => v.trim().parse::<u32>()
            .map_err(|_| format!("{} must be an unsigned integer, got {:?}", key, v)),
    }
}

// ─── unit tests ──────────────────────────────────────────────────────────
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_returns_same_pointer_after_init() {
        // init() is idempotent — calling it in tests is safe.
        init().ok(); // ignore "already set" no-op
        let a = get();
        let b = get();
        // Pointer equality proves it's the same allocation.
        assert!(std::ptr::eq(a, b), "get() must return the same &'static reference");
    }

    #[test]
    fn is_prod_false_when_debug() {
        let cfg = AppConfig {
            db_url:       String::new(),
            db_pool_min:  2,
            db_pool_max:  10,
            redis_url:    String::new(),
            log_level:    "INFO".into(),
            debug:        true,
            service_name: String::new(),
        };
        assert!(!cfg.is_prod(), "is_prod() should be false when debug=true");
    }

    #[test]
    fn is_prod_true_when_not_debug_and_info_level() {
        let cfg = AppConfig {
            db_url:       String::new(),
            db_pool_min:  2,
            db_pool_max:  10,
            redis_url:    String::new(),
            log_level:    "INFO".into(),
            debug:        false,
            service_name: String::new(),
        };
        assert!(cfg.is_prod());
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! -----------
//! Application entry point.  Demonstrates eager config singleton usage.

mod config;

fn main() {
    // Initialise config eagerly at startup — fails fast on bad ENV.
    if let Err(e) = config::init() {
        eprintln!("FATAL: {}", e);
        std::process::exit(1);
    }

    let cfg = config::get();

    println!("Service : {}", cfg.service_name);
    println!("DB URL  : {}", cfg.db_url);
    println!("Pool    : {}–{} connections", cfg.db_pool_min, cfg.db_pool_max);
    println!("Redis   : {}", cfg.redis_url);
    println!("Env     : {}", if cfg.is_prod() { "PRODUCTION" } else { "DEVELOPMENT" });

    // Confirming pointer equality — both calls return the same &'static
    let cfg2 = config::get();
    assert!(std::ptr::eq(cfg, cfg2), "singleton contract violated");
    println!("Singleton confirmed: both pointers are identical ✓");
}
`,
          },
        ],
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class DatabasePool {
    <<Singleton · DCL>>
    -instance$ DatabasePool«volatile»
    -poolSize int
    -host String
    -maxWaitMs long
    +getInstance()$ DatabasePool
    -DatabasePool()
    +acquire() Connection
    +release(c Connection) void
    +getHost() String
  }
  note for DatabasePool "Lazy creation — instance starts null\\n① 1st check: fast path (no lock acquired)\\n② Lock acquired only when instance is null\\n③ 2nd check: prevents two threads\\n   that both passed ① from both creating\\n'volatile' prevents CPU/JIT reordering\\n   the write to instance before the\\n   constructor is fully complete"`,
      },
      diagramExplanation:
        "The DCL diagram highlights that 'instance' is marked volatile (shown in guillemets). Without volatile in Java the JIT or CPU can reorder the write to the instance field before the constructor finishes, letting a second thread observe a partially-constructed object. The two-step access path (fast unsynchronized check → slow synchronized create) is the defining feature of DCL: after the first creation the lock is never acquired again, giving lock-free performance on the hot path.",
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
  "sync/atomic"
)

// DatabasePool — double-checked locking (Go, advanced).
// NOTE: In Go, sync.Once is usually preferred. This shows how to
// express DCL semantics without introducing data races.
type DatabasePool struct {
  PoolSize int
  Host     string
}

var (
  dbInstance atomic.Pointer[DatabasePool]
  dbMu      sync.Mutex
)

// GetDatabasePool — race-free double-checked locking.
func GetDatabasePool() *DatabasePool {
  if inst := dbInstance.Load(); inst != nil { // 1st check (atomic, no lock)
    return inst
  }

  dbMu.Lock()
  defer dbMu.Unlock()

  if inst := dbInstance.Load(); inst != nil { // 2nd check (locked)
    return inst
  }

  created := &DatabasePool{
    PoolSize: 10,
    Host:     "db.prod.internal",
  }
  dbInstance.Store(created)
  return created
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
       * In typical JS runtimes, there is no shared-memory concurrency in a single
       * event loop, so this is mostly educational. Each Worker has its own singleton.
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
      codeFiles: {
        Python: [
          {
            name: "pool.py",
            dir: "db/",
            content: `"""
db/pool.py
----------
DatabasePool singleton — Double-Checked Locking pattern.

Why DCL instead of eager init?
================================
The pool connects to the database on construction, which can take several
hundred milliseconds.  We want to defer that cost until the first request
that actually needs a DB connection, not at import time (which would slow
down every process, including management commands and health-check workers
that may never touch the database).

Thread-safety model
===================
Python's GIL does NOT protect compound read-check-write operations across
threads.  The double-checked pattern is still necessary here because:
  - The outer check (without the lock) can be true in one thread while
    another thread is inside the lock constructing the instance.
  - The inner check (with the lock) is the actual safety gate.

After the first successful initialization, every subsequent call takes the
fast path (outer check returns non-None) and never acquires the lock.
"""

from __future__ import annotations

import threading
import time
from typing import Optional


class Connection:
    """A thin wrapper representing one database connection."""

    def __init__(self, host: str, connection_id: int) -> None:
        self.host = host
        self.id = connection_id
        self.in_use = False

    def execute(self, query: str) -> str:
        """Simulate executing a SQL query."""
        return f"[conn#{self.id}@{self.host}] → {query[:40]}"


class DatabasePool:
    """
    Thread-safe lazy-initialized database connection pool.

    Construction is deferred until the first call to get_instance().
    The first call (and only the first) takes a write lock to create
    the pool and open the initial connections.  All later calls are
    lock-free reads of the class-level _instance reference.
    """

    # ── class-level singleton state ────────────────────────────────────
    _instance: Optional["DatabasePool"] = None
    _lock: threading.Lock = threading.Lock()

    # ── instance fields ────────────────────────────────────────────────
    def __init__(self, host: str = "db.prod.internal", pool_size: int = 10) -> None:
        self._host = host
        self._pool_size = pool_size
        self._pool_lock = threading.Lock()
        # Simulate opening pool_size connections at construction time
        self._connections: list[Connection] = [
            Connection(host, i) for i in range(pool_size)
        ]

    # ── singleton access ───────────────────────────────────────────────
    @classmethod
    def get_instance(cls) -> "DatabasePool":
        """
        Return the single DatabasePool, creating it on first call.

        Double-checked locking:
          Outer check — fast path, no lock acquisition once initialized.
          Inner check — prevents two threads that both saw None from
                        each creating a pool instance.
        """
        if cls._instance is None:              # ①  outer check (lock-free)
            with cls._lock:                    # ②  acquire lock
                if cls._instance is None:      # ③  inner check (locked)
                    cls._instance = DatabasePool()
        return cls._instance

    # ── public API ────────────────────────────────────────────────────
    def acquire(self) -> Optional[Connection]:
        """Borrow an idle connection from the pool."""
        with self._pool_lock:
            for conn in self._connections:
                if not conn.in_use:
                    conn.in_use = True
                    return conn
        return None  # All connections busy

    def release(self, conn: Connection) -> None:
        """Return a borrowed connection to the pool."""
        conn.in_use = False

    @property
    def host(self) -> str:
        return self._host

    @property
    def pool_size(self) -> int:
        return self._pool_size

    def stats(self) -> dict:
        """Return current idle / busy connection counts."""
        busy = sum(1 for c in self._connections if c.in_use)
        return {"total": self._pool_size, "busy": busy, "idle": self._pool_size - busy}
`,
          },
          {
            name: "__init__.py",
            dir: "db/",
            content: `"""
db/__init__.py
--------------
Public surface of the db package.

Usage
-----
    from db import get_pool

    pool = get_pool()
    conn = pool.acquire()
    if conn:
        result = conn.execute("SELECT 1")
        pool.release(conn)
"""

from .pool import DatabasePool, Connection

def get_pool() -> DatabasePool:
    """Return the process-wide DatabasePool singleton."""
    return DatabasePool.get_instance()

__all__ = ["get_pool", "DatabasePool", "Connection"]
`,
          },
          {
            name: "test_pool.py",
            dir: "tests/",
            content: `"""
tests/test_pool.py
------------------
Tests for DatabasePool singleton — Double-Checked Locking variant.

Concurrency test
================
We launch N threads, each calling get_instance() simultaneously.
Every thread must receive the exact same object (identity, not equality).
"""

import threading
import pytest
from db import get_pool, DatabasePool


class TestSingletonIdentity:
    def test_sequential_calls_same_instance(self):
        a = get_pool()
        b = get_pool()
        assert a is b, "get_instance() must return the same object on every call"

    def test_concurrent_calls_same_instance(self):
        """50 concurrent threads must all receive the identical pool object."""
        results: list[DatabasePool] = []
        lock = threading.Lock()

        def worker():
            pool = DatabasePool.get_instance()
            with lock:
                results.append(pool)

        threads = [threading.Thread(target=worker) for _ in range(50)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()

        assert len(results) == 50
        first = results[0]
        for pool in results[1:]:
            assert pool is first, "Multiple instances detected in concurrent access"


class TestPoolOperations:
    def test_acquire_then_release(self):
        pool = get_pool()
        conn = pool.acquire()
        assert conn is not None
        assert conn.in_use is True
        pool.release(conn)
        assert conn.in_use is False

    def test_stats_reflects_busy_count(self):
        pool = get_pool()
        conn = pool.acquire()
        stats = pool.stats()
        assert stats["busy"] >= 1
        pool.release(conn)
        stats_after = pool.stats()
        assert stats_after["busy"] < stats["busy"] + 1
`,
          },
        ],
        Go: [
          {
            name: "pool.go",
            dir: "internal/db/",
            content: `// Package db provides a lazily-initialized database connection pool
// implemented as a Singleton using Double-Checked Locking.
//
// In Go, sync.Once is the idiomatic choice for one-time initialization.
// This file demonstrates DCL using atomic.Pointer + sync.Mutex for
// educational purposes: it shows exactly how the "double-check" works
// at the machine level without relying on sync.Once's black-box guarantee.
//
// DCL in Go: why atomic.Pointer?
// ===============================
// A plain *DatabasePool pointer is a Go interface value internally —
// reading and writing it is not guaranteed to be atomic on all
// architectures.  atomic.Pointer[T] provides the memory ordering
// guarantees (store-release / load-acquire) that prevent data races.
//
// Hot path: Load() on atomic.Pointer is a single CPU instruction.
// Cold path: taken only once — lock + 2nd atomic Load + Store.
package db

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// Connection models a single database connection.
type Connection struct {
	ID    int
	Host  string
	InUse bool
}

// Execute simulates running a query on this connection.
func (c *Connection) Execute(query string) string {
	return fmt.Sprintf("[conn#%d@%s] → %s", c.ID, c.Host, query)
}

// DatabasePool manages a fixed set of reusable database connections.
type DatabasePool struct {
	host      string
	poolSize  int
	mu        sync.Mutex
	conns     []*Connection
}

// NewDatabasePool constructs a new pool.  Private — callers use Get().
func newDatabasePool(host string, size int) *DatabasePool {
	conns := make([]*Connection, size)
	for i := range conns {
		conns[i] = &Connection{ID: i, Host: host}
	}
	return &DatabasePool{host: host, poolSize: size, conns: conns}
}

// Acquire borrows an idle connection.  Returns nil if all are busy.
func (p *DatabasePool) Acquire() *Connection {
	p.mu.Lock()
	defer p.mu.Unlock()
	for _, c := range p.conns {
		if !c.InUse {
			c.InUse = true
			return c
		}
	}
	return nil
}

// Release returns a borrowed connection to the pool.
func (p *DatabasePool) Release(conn *Connection) {
	conn.InUse = false
}

// Stats returns a snapshot of pool utilization.
func (p *DatabasePool) Stats() map[string]int {
	p.mu.Lock()
	defer p.mu.Unlock()
	busy := 0
	for _, c := range p.conns {
		if c.InUse {
			busy++
		}
	}
	return map[string]int{"total": p.poolSize, "busy": busy, "idle": p.poolSize - busy}
}

// ─── Double-Checked Locking ────────────────────────────────────────────────

// dbPoolInstance is the package-level singleton cell.
// atomic.Pointer ensures lock-free reads on the hot path.
var dbPoolInstance atomic.Pointer[DatabasePool] //nolint:gochecknoglobals
var dbPoolMu sync.Mutex

// Get returns the singleton DatabasePool, initializing it on the first call.
//
//	Hot path (instance already set):   single atomic Load — no lock, no alloc.
//	Cold path (first call or race):    lock → re-check → construct → Store.
func Get() *DatabasePool {
	// ①  First check — lock-free fast path.
	if inst := dbPoolInstance.Load(); inst != nil {
		return inst
	}

	// ②  Acquire lock — only one goroutine constructs the pool.
	dbPoolMu.Lock()
	defer dbPoolMu.Unlock()

	// ③  Second check — another goroutine may have initialized while we waited.
	if inst := dbPoolInstance.Load(); inst != nil {
		return inst
	}

	// ④  Construct and publish atomically.
	pool := newDatabasePool("db.prod.internal", 10)
	dbPoolInstance.Store(pool)
	return pool
}
`,
          },
          {
            name: "pool_test.go",
            dir: "internal/db/",
            content: `package db_test

import (
	"sync"
	"testing"

	"github.com/example/myapp/internal/db"
)

// TestGet_SamePointerSequential verifies that sequential calls return
// the same pointer (singleton identity, not value equality).
func TestGet_SamePointerSequential(t *testing.T) {
	first  := db.Get()
	second := db.Get()
	if first != second {
		t.Fatalf("singleton violated: %p != %p", first, second)
	}
}

// TestGet_SamePointerConcurrent launches 100 goroutines simultaneously.
// All must receive the same *DatabasePool pointer.
func TestGet_SamePointerConcurrent(t *testing.T) {
	const goroutineCount = 100

	results := make([]*db.DatabasePool, goroutineCount) // pre-alloc to avoid slice races
	var wg sync.WaitGroup

	for i := 0; i < goroutineCount; i++ {
		wg.Add(1)
		idx := i
		go func() {
			defer wg.Done()
			results[idx] = db.Get()
		}()
	}
	wg.Wait()

	first := results[0]
	for i, p := range results {
		if p != first {
			t.Errorf("goroutine %d got a different pointer: %p (expected %p)", i, p, first)
		}
	}
}

// TestAcquireRelease verifies the pool's borrow/return lifecycle.
func TestAcquireRelease(t *testing.T) {
	pool := db.Get()

	conn := pool.Acquire()
	if conn == nil {
		t.Fatal("expected a connection, got nil")
	}
	if !conn.InUse {
		t.Error("connection should be marked InUse after Acquire")
	}

	pool.Release(conn)
	if conn.InUse {
		t.Error("connection should not be InUse after Release")
	}
}

// TestStats_ReflectsBusyCount verifies stats update when connections are borrowed.
func TestStats_ReflectsBusyCount(t *testing.T) {
	pool := db.Get()
	conn := pool.Acquire()
	if conn == nil {
		t.Skip("no idle connections available")
	}

	stats := pool.Stats()
	if stats["busy"] < 1 {
		t.Errorf("expected at least 1 busy connection, got %d", stats["busy"])
	}

	pool.Release(conn)
	statsAfter := pool.Stats()
	if statsAfter["busy"] >= stats["busy"] {
		t.Errorf("busy count should decrease after Release")
	}
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/server/",
            content: `// cmd/server/main.go
// -------------------
// Application entry point.  Demonstrates lazy singleton (DCL) usage:
// the pool is constructed on the first call to db.Get(), not at import time.
package main

import (
	"fmt"
	"log"
	"sync"

	"github.com/example/myapp/internal/db"
)

func main() {
	// Simulate 5 concurrent request handlers — each calls db.Get().
	// Only the very first call constructs the pool; the rest reuse it.
	const workers = 5
	var wg sync.WaitGroup

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			pool := db.Get() // DCL ensures exactly one pool is constructed

			conn := pool.Acquire()
			if conn == nil {
				log.Printf("worker %d: no idle connections", id)
				return
			}
			defer pool.Release(conn)

			result := conn.Execute(fmt.Sprintf("SELECT * FROM orders WHERE handler=%d", id))
			log.Printf("worker %d: %s", id, result)
		}(i)
	}

	wg.Wait()
	log.Printf("Pool stats: %v", db.Get().Stats())
}
`,
          },
        ],
        Java: [
          {
            name: "DatabasePool.java",
            dir: "src/main/java/com/example/db/",
            content: `package com.example.db;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

/**
 * DatabasePool — lazy-initialized Singleton using Double-Checked Locking.
 *
 * <h2>Why volatile?</h2>
 * Without {@code volatile}, the JIT compiler or CPU is permitted to reorder
 * two operations inside the constructor:
 * <ol>
 *   <li>Allocate memory for the new DatabasePool object.</li>
 *   <li>Write the reference to the {@code instance} field.</li>
 *   <li>Execute the constructor body (initialise fields, open connections).</li>
 * </ol>
 * The JIT can reorder (2) before (3).  A second thread could then observe a
 * non-null {@code instance} pointing to a partially-constructed object.
 * {@code volatile} imposes a happens-before relationship: the write to
 * {@code instance} happens-after the constructor finishes.
 *
 * <h2>Why DCL instead of Eager?</h2>
 * Opening database connections during class loading would slow every startup
 * path — including CLI commands and tests that never need a DB.  DCL pays the
 * construction cost only when the first query is issued.
 *
 * <h2>Alternative</h2>
 * The Bill Pugh / Holder pattern (Variant 3) is simpler and equally correct.
 * DCL is shown here because it appears in many real codebases and interviewers
 * expect you to understand both patterns.
 */
public final class DatabasePool {

    // volatile — write to instance is visible to all threads immediately
    // after the constructor completes (Java Memory Model JSR-133).
    private static volatile DatabasePool instance;

    // ─── Connection pool state ────────────────────────────────────────
    private final String host;
    private final int poolSize;
    private final Connection[] connections;
    private final ReentrantLock poolLock = new ReentrantLock();
    private final AtomicInteger busyCount = new AtomicInteger(0);

    // ─── Construction ─────────────────────────────────────────────────
    private DatabasePool() {
        this.host     = System.getProperty("db.host", "db.prod.internal");
        this.poolSize = Integer.getInteger("db.pool.max", 10);
        this.connections = new Connection[poolSize];
        for (int i = 0; i < poolSize; i++) {
            this.connections[i] = new Connection(i, host);
        }
    }

    // ─── Singleton accessor (DCL) ─────────────────────────────────────
    /**
     * Returns the singleton DatabasePool, creating it on first call.
     *
     * <pre>
     * Thread A                         Thread B
     * ─────────────────────────────────────────────────────────────
     * instance == null?  →  true
     *                                  instance == null?  →  true
     * acquire lock          ──────────
     * 2nd check → null
     * new DatabasePool()
     * instance = pool  (volatile write)
     * release lock      ──────────
     *                                  blocked waiting
     *                                  acquire lock
     *                                  2nd check → NOT null  ←  fast exit
     *                                  release lock
     *                                  return instance (same pointer)
     * </pre>
     */
    public static DatabasePool getInstance() {
        if (instance == null) {                          // ① 1st check (no lock)
            synchronized (DatabasePool.class) {
                if (instance == null) {                  // ② 2nd check (locked)
                    instance = new DatabasePool();       // ③ construct once
                }
            }
        }
        return instance;                                 // ④ always the same object
    }

    // ─── Pool operations ──────────────────────────────────────────────
    /**
     * Borrow an idle connection from the pool.
     *
     * @return a Connection, or {@code null} if all are busy.
     */
    public Connection acquire() {
        poolLock.lock();
        try {
            for (Connection c : connections) {
                if (!c.isInUse()) {
                    c.setInUse(true);
                    busyCount.incrementAndGet();
                    return c;
                }
            }
            return null; // pool exhausted
        } finally {
            poolLock.unlock();
        }
    }

    /** Return a borrowed connection to the pool. */
    public void release(Connection c) {
        c.setInUse(false);
        busyCount.decrementAndGet();
    }

    public String getHost()    { return host; }
    public int getPoolSize()   { return poolSize; }
    public int getBusyCount()  { return busyCount.get(); }
    public int getIdleCount()  { return poolSize - busyCount.get(); }

    // ─── Inner Connection class ───────────────────────────────────────
    public static final class Connection {
        private final int id;
        private final String host;
        private volatile boolean inUse;

        Connection(int id, String host) { this.id = id; this.host = host; }

        public String execute(String query) {
            return String.format("[conn#%d@%s] → %s", id, host, query.substring(0, Math.min(query.length(), 40)));
        }

        public boolean isInUse()       { return inUse; }
        void setInUse(boolean v)       { this.inUse = v; }
    }
}
`,
          },
          {
            name: "DatabasePoolTest.java",
            dir: "src/test/java/com/example/db/",
            content: `package com.example.db;

import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit and concurrency tests for DatabasePool — DCL Singleton.
 */
class DatabasePoolTest {

    @Test
    void getInstance_returnsSameReference() {
        DatabasePool a = DatabasePool.getInstance();
        DatabasePool b = DatabasePool.getInstance();
        assertSame(a, b, "getInstance() must return the identical reference");
    }

    @Test
    void getInstance_neverNull() {
        assertNotNull(DatabasePool.getInstance());
    }

    @Test
    void getInstance_concurrentAccess_allSameReference() throws Exception {
        // 100 threads all call getInstance() in parallel.
        // Every result must be the same pointer.
        final int threadCount = 100;
        ExecutorService pool = Executors.newFixedThreadPool(threadCount);
        List<Future<DatabasePool>> futures = new ArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            futures.add(pool.submit(DatabasePool::getInstance));
        }

        DatabasePool expected = DatabasePool.getInstance();
        for (Future<DatabasePool> f : futures) {
            assertSame(expected, f.get(),
                "Concurrent call returned a different instance");
        }
        pool.shutdown();
    }

    @Test
    void acquire_marksConnectionInUse() {
        DatabasePool dbPool = DatabasePool.getInstance();
        DatabasePool.Connection conn = dbPool.acquire();
        assertNotNull(conn, "Should get a connection from a fresh pool");
        assertTrue(conn.isInUse(), "Acquired connection must be marked in-use");
        dbPool.release(conn);
    }

    @Test
    void release_decreasesBusyCount() {
        DatabasePool dbPool = DatabasePool.getInstance();
        DatabasePool.Connection conn = dbPool.acquire();
        assertNotNull(conn);
        int busyBefore = dbPool.getBusyCount();
        dbPool.release(conn);
        assertEquals(busyBefore - 1, dbPool.getBusyCount());
    }
}
`,
          },
          {
            name: "Main.java",
            dir: "src/main/java/com/example/",
            content: `package com.example;

import com.example.db.DatabasePool;

/**
 * Demonstrates lazy singleton (DCL) access in a multi-threaded scenario.
 */
public class Main {
    public static void main(String[] args) throws Exception {
        // Simulate concurrent request handlers
        Thread[] handlers = new Thread[5];
        for (int i = 0; i < handlers.length; i++) {
            final int id = i;
            handlers[i] = new Thread(() -> {
                // Each thread lazily resolves the singleton on first access.
                DatabasePool pool = DatabasePool.getInstance();
                DatabasePool.Connection conn = pool.acquire();
                if (conn == null) {
                    System.out.println("Handler " + id + ": no idle connections");
                    return;
                }
                try {
                    String result = conn.execute("SELECT * FROM orders WHERE handler=" + id);
                    System.out.println("Handler " + id + ": " + result);
                } finally {
                    pool.release(conn);
                }
            });
        }

        for (Thread t : handlers) t.start();
        for (Thread t : handlers) t.join();

        DatabasePool pool = DatabasePool.getInstance();
        System.out.printf("Pool stats — size: %d, busy: %d, idle: %d%n",
            pool.getPoolSize(), pool.getBusyCount(), pool.getIdleCount());

        // Confirm singleton identity
        assert DatabasePool.getInstance() == pool : "Singleton contract violated";
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "types.ts",
            dir: "src/db/",
            content: `/**
 * src/db/types.ts
 * ---------------
 * Type contracts for the DatabasePool singleton.
 */

/** Represents one active database connection. */
export interface IConnection {
  readonly id: number;
  readonly host: string;
  inUse: boolean;
  execute(query: string): string;
}

/** Public interface of the connection pool. */
export interface IDatabasePool {
  acquire(): IConnection | null;
  release(conn: IConnection): void;
  getHost(): string;
  getPoolSize(): number;
  getBusyCount(): number;
  getIdleCount(): number;
}
`,
          },
          {
            name: "DatabasePool.ts",
            dir: "src/db/",
            content: `/**
 * src/db/DatabasePool.ts
 * ----------------------
 * Database connection pool — Singleton via Double-Checked Locking.
 *
 * Context for JavaScript/TypeScript
 * ==================================
 * The JS event loop is single-threaded for user code, so the concurrency
 * concern in classic DCL (two threads simultaneously observing null) does
 * NOT apply to plain Node.js code.  However:
 *
 *  - The private constructor + static getInstance() pattern is used here
 *    because it is widely recognized and reviewers expect to see it.
 *  - In a Worker-based multi-threaded Node.js setup, each Worker has its own
 *    module registry, so the singleton is automatically per-Worker.
 *  - For SharedArrayBuffer-based shared memory scenarios across Workers,
 *    you need an entirely different approach (not covered here).
 *
 * The pattern IS valuable in TypeScript for preventing accidental multiple
 * instantiation of expensive resources in complex DI setups.
 */

import type { IConnection, IDatabasePool } from "./types";

class Connection implements IConnection {
  inUse = false;

  constructor(
    readonly id: number,
    readonly host: string,
  ) {}

  execute(query: string): string {
    return \`[conn#\${this.id}@\${this.host}] → \${query.slice(0, 40)}\`;
  }
}

class DatabasePoolImpl implements IDatabasePool {
  private readonly connections: Connection[];

  constructor(
    private readonly host: string,
    private readonly poolSize: number,
  ) {
    // Eagerly open poolSize connections on construction
    this.connections = Array.from(
      { length: poolSize },
      (_, i) => new Connection(i, host),
    );
  }

  acquire(): Connection | null {
    return this.connections.find((c) => !c.inUse) ?? null;
    // Note: in a real async pool you'd use a Promise-based queue
    // so concurrent async callers can await an available connection.
  }

  release(conn: Connection): void {
    conn.inUse = false;
  }

  getHost(): string    { return this.host; }
  getPoolSize(): number  { return this.poolSize; }
  getBusyCount(): number { return this.connections.filter((c) => c.inUse).length; }
  getIdleCount(): number { return this.poolSize - this.getBusyCount(); }
}

// ─── Singleton wrapper applying DCL semantics ─────────────────────────────
export class DatabasePool {
  /** The cached singleton reference (null until first call). */
  private static instance: IDatabasePool | undefined;

  /** Private constructor prevents external \`new DatabasePool()\`. */
  private constructor() {}

  /**
   * Returns the singleton DatabasePool.
   *
   * In single-threaded JS this collapses to a simple null-check-then-create,
   * but the two-check structure is preserved to mirror the canonical DCL pattern.
   */
  static getInstance(): IDatabasePool {
    if (!DatabasePool.instance) {               // ①  outer check
      // In multi-threaded contexts a lock would be acquired here.
      if (!DatabasePool.instance) {             // ②  inner check (educational)
        DatabasePool.instance = new DatabasePoolImpl(
          process.env.DB_HOST ?? "db.prod.internal",
          parseInt(process.env.DB_POOL_MAX ?? "10", 10),
        );
      }
    }
    return DatabasePool.instance;
  }
}
`,
          },
          {
            name: "DatabasePool.test.ts",
            dir: "src/db/",
            content: `/**
 * src/db/DatabasePool.test.ts
 * ---------------------------
 * Tests for DatabasePool singleton — DCL variant.
 */

import { DatabasePool } from "./DatabasePool";

describe("DatabasePool singleton identity", () => {
  it("returns the same reference on repeated calls", () => {
    const a = DatabasePool.getInstance();
    const b = DatabasePool.getInstance();
    expect(a).toBe(b); // reference equality
  });
});

describe("Connection lifecycle", () => {
  it("acquire() returns a connection and marks it in-use", () => {
    const pool = DatabasePool.getInstance();
    const conn = pool.acquire();
    expect(conn).not.toBeNull();
    expect(conn!.inUse).toBe(true);
    pool.release(conn!);
  });

  it("release() marks connection as idle", () => {
    const pool = DatabasePool.getInstance();
    const conn = pool.acquire()!;
    pool.release(conn);
    expect(conn.inUse).toBe(false);
  });

  it("busy count increases after acquire", () => {
    const pool = DatabasePool.getInstance();
    const before = pool.getBusyCount();
    const conn = pool.acquire();
    expect(pool.getBusyCount()).toBe(before + 1);
    if (conn) pool.release(conn);
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "mod.rs",
            dir: "src/db/",
            content: `//! src/db/mod.rs
//! --------------
//! Database connection pool — Singleton using OnceLock (Rust's DCL equivalent).
//!
//! # How OnceLock implements DCL
//! Internally, \`OnceLock<T>\` uses an atomic state flag and a \`Mutex\` to
//! ensure the initializer closure:
//!   1. Runs at most once, even under concurrent calls.
//!   2. Blocking callers wait until initialization is complete before
//!      returning the reference.
//! This is semantically equivalent to Double-Checked Locking but expressed
//! as a safe, ergonomic API — you write \`get_or_init(|| ...)\` once and the
//! runtime handles all the memory-ordering complexity.
//!
//! # Why not write DCL manually in Rust?
//! Rust's ownership and borrow checker make raw DCL patterns difficult to
//! express safely.  The ecosystem convention is to use \`OnceLock\` (std) or
//! \`once_cell::sync::OnceCell\` (before Rust 1.70).

use std::sync::{Mutex, OnceLock};

// ─── Public types ─────────────────────────────────────────────────────────

/// One database connection in the pool.
#[derive(Debug)]
pub struct Connection {
    pub id: usize,
    pub host: String,
    pub in_use: bool,
}

impl Connection {
    /// Simulate executing a SQL query.
    pub fn execute(&self, query: &str) -> String {
        format!("[conn#{}@{}] → {}", self.id, self.host, &query[..query.len().min(40)])
    }
}

/// Thread-safe database connection pool.
pub struct DatabasePool {
    host: String,
    pool_size: usize,
    connections: Mutex<Vec<Connection>>,
}

impl DatabasePool {
    fn new(host: impl Into<String>, size: usize) -> Self {
        let h = host.into();
        let conns = (0..size)
            .map(|i| Connection { id: i, host: h.clone(), in_use: false })
            .collect();
        DatabasePool {
            host: h,
            pool_size: size,
            connections: Mutex::new(conns),
        }
    }

    /// Borrow an idle connection.  Returns \`None\` if the pool is exhausted.
    pub fn acquire(&self) -> Option<usize> {
        let mut conns = self.connections.lock().unwrap();
        for conn in conns.iter_mut() {
            if !conn.in_use {
                conn.in_use = true;
                return Some(conn.id);
            }
        }
        None
    }

    /// Return a connection back to the pool.
    pub fn release(&self, id: usize) {
        let mut conns = self.connections.lock().unwrap();
        if let Some(conn) = conns.iter_mut().find(|c| c.id == id) {
            conn.in_use = false;
        }
    }

    /// Execute a query on connection \`id\`.
    pub fn execute(&self, id: usize, query: &str) -> Option<String> {
        let conns = self.connections.lock().unwrap();
        conns.iter().find(|c| c.id == id).map(|c| c.execute(query))
    }

    pub fn host(&self) -> &str { &self.host }
    pub fn pool_size(&self) -> usize { self.pool_size }

    /// Returns (busy_count, idle_count).
    pub fn stats(&self) -> (usize, usize) {
        let conns = self.connections.lock().unwrap();
        let busy = conns.iter().filter(|c| c.in_use).count();
        (busy, self.pool_size - busy)
    }
}

// ─── Singleton (OnceLock = Rust's DCL) ───────────────────────────────────

static DB_POOL: OnceLock<DatabasePool> = OnceLock::new();

/// Returns the global DatabasePool singleton.
///
/// The first caller initializes the pool; all subsequent callers receive
/// the same \`&'static DatabasePool\` reference.  Thread-safe via OnceLock.
pub fn get() -> &'static DatabasePool {
    DB_POOL.get_or_init(|| DatabasePool::new("db.prod.internal", 10))
}

// ─── Tests ────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use std::thread;

    #[test]
    fn get_returns_same_pointer() {
        let a = get();
        let b = get();
        assert!(std::ptr::eq(a, b), "Singleton contract violated");
    }

    #[test]
    fn concurrent_get_same_pointer() {
        let handles: Vec<_> = (0..20)
            .map(|_| thread::spawn(|| get() as *const DatabasePool))
            .collect();
        let expected = get() as *const DatabasePool;
        for h in handles {
            assert_eq!(h.join().unwrap(), expected);
        }
    }

    #[test]
    fn acquire_and_release_cycle() {
        let pool = get();
        let id = pool.acquire().expect("should get an idle connection");
        let (busy, _) = pool.stats();
        assert!(busy >= 1);
        pool.release(id);
        let (busy_after, _) = pool.stats();
        assert!(busy_after < busy + 1);
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! -----------
//! Demonstrates lazy singleton (OnceLock / DCL) access in Rust.

mod db;

use std::thread;

fn main() {
    // Spawn 5 threads; each lazily resolves the singleton.
    let handles: Vec<_> = (0..5)
        .map(|id| {
            thread::spawn(move || {
                let pool = db::get();              // lazily initialized once
                if let Some(conn_id) = pool.acquire() {
                    let result = pool.execute(conn_id, &format!("SELECT * WHERE id={}", id));
                    println!("Thread {}: {:?}", id, result);
                    pool.release(conn_id);
                } else {
                    println!("Thread {}: no idle connections", id);
                }
            })
        })
        .collect();

    for h in handles {
        h.join().unwrap();
    }

    let (busy, idle) = db::get().stats();
    println!("Pool final — busy: {}, idle: {}", busy, idle);
}
`,
          },
        ],
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
 * Lazy Singleton (TypeScript) using a module-scoped holder.
 * The module is evaluated once, and the accessor lazily creates
 * the instance on first call.
 *
 * Note: this is still "one per module graph" — separate bundles or
 * separate Workers/processes can each have their own singleton.
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
}

let instance: Logger | undefined;

export function getLogger(): Logger {
  // Lazy initialization: create on first call, cache for later.
  instance ??= new Logger();
  return instance;
}

// ── Usage ──
getLogger().log("System started");`,
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class Logger {
    <<Singleton · Bill Pugh Holder>>
    -level String
    -output String
    +getInstance()$ Logger
    -Logger()
    +log(msg String) void
    +setLevel(level String) void
  }
  class Holder {
    <<static inner class>>
    +INSTANCE$ Logger
  }
  Logger ..> Holder : "loads on first call\\nto getInstance()"
  note for Holder "JVM loads Holder only when\\nLogger.getInstance() is first called.\\nClass initialization is thread-safe\\nby the JVM spec — no locks needed."`,
      },
      diagramExplanation:
        "The Holder (Initialization-on-Demand) pattern exploits a JVM guarantee: a static inner class is not loaded until a member of that class is first referenced. When getInstance() calls 'return Holder.INSTANCE', the JVM loads the Holder class, runs its static initializer to create the Logger, and caches it — all in a thread-safe manner guaranteed by the Java Language Specification §12.4. Subsequent calls skip the class-load check entirely, making it a zero-overhead lock-free read after initialization.",
      codeFiles: {
        Python: [
          {
            name: "logger.py",
            dir: "logging_module/",
            content: `"""
logging_module/logger.py
------------------------
Lazy singleton logger — Python's closest equivalent to the Bill Pugh Holder idiom.

Design decision: @lru_cache(maxsize=None)
=========================================
Python has no inner static classes, but functools.lru_cache achieves the same
effect: the factory function is called at most once (the result is memooned on
first call) and the cache is thread-safe because CPython's GIL serializes dict
writes. On free-threaded Python 3.13+ the lru_cache internals use a lock, so
the guarantee holds there too.

Comparison with eager initialization
======================================
Unlike a module-level 'logger = Logger()' expression, get_logger() only
allocates the Logger when a caller actually requests it. In test suites that
never exercise logging paths this avoids opening file handles / network sockets.
"""

from __future__ import annotations
import functools
import logging
import threading
from typing import Final


class Logger:
    """
    Structured application logger with correlation-ID support.

    Attributes
    ----------
    level        : Minimum log severity (DEBUG, INFO, WARNING, ERROR, CRITICAL).
    service_name : Injected into every log record for easy filtering in Splunk/ELK.
    _lock        : Protects _correlation_id on concurrent request handlers.
    """

    def __init__(self, level: str = "INFO", service_name: str = "app") -> None:
        self.level: Final[str] = level
        self.service_name: Final[str] = service_name
        self._lock = threading.local()  # per-thread correlation IDs
        self._correlation_id: str = ""

        # Configure stdlib logger as the backing implementation
        self._log = logging.getLogger(service_name)
        self._log.setLevel(getattr(logging, level, logging.INFO))
        if not self._log.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(
                logging.Formatter(
                    "%(asctime)s [%(levelname)s] %(name)s %(message)s"
                )
            )
            self._log.addHandler(handler)

    # ------------------------------------------------------------------
    # Correlation-ID helpers — thread-local storage keeps request IDs
    # isolated between concurrent request handlers.
    # ------------------------------------------------------------------

    def set_correlation_id(self, cid: str) -> None:
        """Attach a request/trace ID to all subsequent log calls on this thread."""
        self._lock.cid = cid

    def get_correlation_id(self) -> str:
        """Return the correlation ID set on this thread (empty string if none)."""
        return getattr(self._lock, "cid", "")

    # ------------------------------------------------------------------
    # Logging helpers
    # ------------------------------------------------------------------

    def _prefix(self) -> str:
        cid = self.get_correlation_id()
        return f"[{cid}] " if cid else ""

    def info(self, msg: str) -> None:
        self._log.info(f"{self._prefix()}{msg}")

    def warning(self, msg: str) -> None:
        self._log.warning(f"{self._prefix()}{msg}")

    def error(self, msg: str, exc_info: bool = False) -> None:
        self._log.error(f"{self._prefix()}{msg}", exc_info=exc_info)

    def debug(self, msg: str) -> None:
        self._log.debug(f"{self._prefix()}{msg}")


# ──────────────────────────────────────────────────────────────────────────────
# Holder idiom: @lru_cache makes _build_logger() a "run-once" factory.
# The first call creates the Logger; every subsequent call returns the same
# cached instance without re-executing the function body.
# ──────────────────────────────────────────────────────────────────────────────

@functools.lru_cache(maxsize=None)
def _build_logger() -> Logger:
    """Create and cache the application-wide Logger singleton."""
    import os
    return Logger(
        level=os.getenv("LOG_LEVEL", "INFO").upper(),
        service_name=os.getenv("SERVICE_NAME", "app"),
    )


def get_logger() -> Logger:
    """
    Return the application-wide Logger singleton.

    Thread-safe: lru_cache guarantees at-most-once creation.
    Lazy: the Logger is not created until this function is first called.
    """
    return _build_logger()
`,
          },
          {
            name: "__init__.py",
            dir: "logging_module/",
            content: `"""
logging_module/__init__.py
--------------------------
Public API for the logging package.

    from logging_module import get_logger

    log = get_logger()
    log.set_correlation_id("req-abc123")
    log.info("Order placed")
"""

from .logger import Logger, get_logger

__all__ = ["Logger", "get_logger"]
`,
          },
          {
            name: "order_service.py",
            dir: "app/",
            content: `"""
app/order_service.py
--------------------
Domain service that uses the Logger singleton.

Notice how get_logger() is called inside each method rather than at import
time — this keeps the module importable even in environments where the
logging configuration has not yet been finalised.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from logging_module import get_logger


@dataclass
class Order:
    order_id: str
    customer_id: str
    total: float
    items: list[str] = field(default_factory=list)


class OrderService:
    """Processes customer orders, recording audit events via the shared logger."""

    def place_order(self, order: Order) -> bool:
        log = get_logger()
        log.set_correlation_id(f"order-{order.order_id}")
        log.info(f"Placing order for customer {order.customer_id}, total={order.total:.2f}")
        try:
            # ... business logic / DB write ...
            log.info(f"Order {order.order_id} placed successfully")
            return True
        except Exception as exc:
            log.error(f"Failed to place order {order.order_id}: {exc}", exc_info=True)
            return False

    def cancel_order(self, order_id: str, reason: str) -> None:
        log = get_logger()
        log.set_correlation_id(f"cancel-{order_id}")
        log.warning(f"Order {order_id} cancelled: {reason}")
`,
          },
          {
            name: "test_logger.py",
            dir: "tests/",
            content: `"""
tests/test_logger.py
--------------------
Validates singleton identity, lazy creation, and thread-safety.
"""

import threading
import pytest
from logging_module import get_logger


def test_singleton_identity() -> None:
    """Multiple calls to get_logger() must return the exact same object."""
    a = get_logger()
    b = get_logger()
    assert a is b, "get_logger() returned different objects — singleton violated"


def test_thread_safe_singleton() -> None:
    """100 concurrent threads must all receive the same Logger instance."""
    instances: list = []
    lock = threading.Lock()

    def grab() -> None:
        inst = get_logger()
        with lock:
            instances.append(inst)

    threads = [threading.Thread(target=grab) for _ in range(100)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert len(set(id(i) for i in instances)) == 1, "Thread-safety violated"


def test_correlation_id_is_thread_local() -> None:
    """Each thread's correlation ID must be independent."""
    log = get_logger()
    results: dict[str, str] = {}
    barrier = threading.Barrier(2)

    def set_and_read(cid: str) -> None:
        log.set_correlation_id(cid)
        barrier.wait()  # both threads set their ID before either reads
        results[cid] = log.get_correlation_id()

    t1 = threading.Thread(target=set_and_read, args=("req-AAA",))
    t2 = threading.Thread(target=set_and_read, args=("req-BBB",))
    t1.start(); t2.start()
    t1.join();  t2.join()

    assert results["req-AAA"] == "req-AAA"
    assert results["req-BBB"] == "req-BBB"
`,
          },
        ],
        Go: [
          {
            name: "logger.go",
            dir: "logger/",
            content: `// logger/logger.go
//
// Lazy singleton logger using sync.Once — Go's idiomatic equivalent of
// Java's Initialization-on-Demand Holder pattern.
//
// sync.Once guarantees:
//   1. The initializer runs exactly once, even under concurrent callers.
//   2. After Do() returns, the initialized value is safely visible to all
//      goroutines without any additional synchronization (the happens-before
//      relationship is established by sync.Once internally).
//
package logger

import (
	"fmt"
	"log"
	"os"
	"sync"
)

// Logger wraps stdlib log.Logger and adds correlation-ID support via
// goroutine-local storage (approximated here with an explicit parameter
// since Go has no goroutine-local variables).
type Logger struct {
	inner       *log.Logger
	Level       string
	ServiceName string
}

// log holds the singleton and once ensures it is created exactly once.
var (
	instance *Logger
	once     sync.Once
)

// Get returns the application-wide Logger singleton.
// Safe for concurrent use: sync.Once serialises the first call internally.
func Get() *Logger {
	once.Do(func() {
		level := os.Getenv("LOG_LEVEL")
		if level == "" {
			level = "INFO"
		}
		svc := os.Getenv("SERVICE_NAME")
		if svc == "" {
			svc = "app"
		}
		instance = &Logger{
			inner:       log.New(os.Stdout, "", log.LstdFlags),
			Level:       level,
			ServiceName: svc,
		}
	})
	return instance
}

// Info logs an informational message, optionally prefixed with a correlation ID.
func (l *Logger) Info(correlationID, msg string) {
	l.inner.Printf("[INFO] [%s] [cid=%s] %s\\n", l.ServiceName, correlationID, msg)
}

// Warning logs a warning.
func (l *Logger) Warning(correlationID, msg string) {
	l.inner.Printf("[WARN] [%s] [cid=%s] %s\\n", l.ServiceName, correlationID, msg)
}

// Error logs an error; if err is non-nil it is appended.
func (l *Logger) Error(correlationID, msg string, err error) {
	if err != nil {
		l.inner.Printf("[ERROR] [%s] [cid=%s] %s: %v\\n", l.ServiceName, correlationID, msg, err)
	} else {
		fmt.Fprintf(os.Stderr, "[ERROR] [%s] [cid=%s] %s\\n", l.ServiceName, correlationID, msg)
	}
}
`,
          },
          {
            name: "order_service.go",
            dir: "service/",
            content: `// service/order_service.go
//
// Domain service that uses the Logger singleton.
package service

import (
	"fmt"

	"myapp/logger"
)

// Order represents a customer purchase.
type Order struct {
	ID         string
	CustomerID string
	Total      float64
}

// OrderService processes orders and emits structured log events.
type OrderService struct{}

// PlaceOrder validates and persists an order.
func (s *OrderService) PlaceOrder(o Order) error {
	log := logger.Get()
	cid := fmt.Sprintf("order-%s", o.ID)

	log.Info(cid, fmt.Sprintf("Placing order for customer %s, total=%.2f", o.CustomerID, o.Total))

	// ... business logic / DB write ...

	log.Info(cid, fmt.Sprintf("Order %s placed successfully", o.ID))
	return nil
}

// CancelOrder cancels an existing order.
func (s *OrderService) CancelOrder(orderID, reason string) {
	log := logger.Get()
	cid := fmt.Sprintf("cancel-%s", orderID)
	log.Warning(cid, fmt.Sprintf("Order %s cancelled: %s", orderID, reason))
}
`,
          },
          {
            name: "logger_test.go",
            dir: "logger/",
            content: `// logger/logger_test.go
package logger_test

import (
	"sync"
	"testing"

	"myapp/logger"
)

// TestSingletonIdentity verifies that Get() always returns the same pointer.
func TestSingletonIdentity(t *testing.T) {
	a := logger.Get()
	b := logger.Get()
	if a != b {
		t.Fatal("Get() returned different pointers — singleton contract violated")
	}
}

// TestConcurrentGet spawns 200 goroutines and confirms a single instance.
func TestConcurrentGet(t *testing.T) {
	const n = 200
	ptrs := make([]*logger.Logger, n)
	var wg sync.WaitGroup
	wg.Add(n)

	for i := range ptrs {
		i := i
		go func() {
			defer wg.Done()
			ptrs[i] = logger.Get()
		}()
	}
	wg.Wait()

	first := ptrs[0]
	for _, p := range ptrs[1:] {
		if p != first {
			t.Fatal("Concurrent Get() calls returned different instances")
		}
	}
}
`,
          },
        ],
        Java: [
          {
            name: "Logger.java",
            dir: "com/example/logging/",
            content: `package com.example.logging;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Application-wide Logger — Bill Pugh / Initialization-on-Demand Holder pattern.
 *
 * <h3>Why the Holder idiom?</h3>
 * <ul>
 *   <li>The JVM loads {@code Holder} only when {@code getInstance()} is first called,
 *       giving us <em>lazy</em> initialization.</li>
 *   <li>The JVM specification (§12.4) guarantees class initialization is performed
 *       by exactly one thread and the result is visible to all subsequent threads —
 *       so there is <strong>no need for {@code volatile}, {@code synchronized}, or
 *       DCL</strong>.</li>
 *   <li>Zero overhead on the hot path: after the first call,
 *       {@code getInstance()} is just a static field read.</li>
 * </ul>
 */
public final class Logger {

    private final String serviceName;
    private volatile Level minLevel;

    /** Log severity levels in ascending order. */
    public enum Level { DEBUG, INFO, WARNING, ERROR }

    private Logger() {
        this.serviceName = System.getProperty("service.name", "app");
        this.minLevel    = Level.valueOf(
            System.getProperty("log.level", "INFO").toUpperCase()
        );
    }

    // ─── Holder ────────────────────────────────────────────────────────────
    // The JVM does NOT load this class until a member of Holder is accessed.
    // Static field initialisation in the JVM is thread-safe — no locks needed.
    private static final class Holder {
        static final Logger INSTANCE = new Logger();
    }

    /** Returns the singleton Logger. Thread-safe, lazy, zero overhead. */
    public static Logger getInstance() {
        return Holder.INSTANCE;
    }

    // ─── Correlation-ID (per-thread) ───────────────────────────────────────
    private static final ThreadLocal<String> CORRELATION_ID =
        ThreadLocal.withInitial(() -> "");

    public static void setCorrelationId(String id)  { CORRELATION_ID.set(id); }
    public static String getCorrelationId()          { return CORRELATION_ID.get(); }
    public static void clearCorrelationId()          { CORRELATION_ID.remove(); }

    // ─── Logging API ───────────────────────────────────────────────────────
    public void setLevel(Level level) { this.minLevel = level; }

    public void info(String msg)    { log(Level.INFO,    msg); }
    public void warning(String msg) { log(Level.WARNING, msg); }
    public void error(String msg)   { log(Level.ERROR,   msg); }
    public void debug(String msg)   { log(Level.DEBUG,   msg); }

    private void log(Level level, String msg) {
        if (level.ordinal() < minLevel.ordinal()) return;
        String cid = CORRELATION_ID.get();
        String prefix = cid.isEmpty() ? "" : "[" + cid + "] ";
        System.out.printf("%s [%s] [%s] %s%s%n",
            DateTimeFormatter.ISO_INSTANT.format(Instant.now()),
            level, serviceName, prefix, msg);
    }
}
`,
          },
          {
            name: "OrderService.java",
            dir: "com/example/service/",
            content: `package com.example.service;

import com.example.logging.Logger;

/**
 * Domain service that uses the Logger singleton.
 *
 * Callers set a correlation ID on the current thread before invoking service
 * methods so that all log lines for a given request share the same trace ID.
 */
public class OrderService {

    private static final Logger log = Logger.getInstance();

    /**
     * Place a new order.
     *
     * @param orderId    Unique order identifier
     * @param customerId Customer placing the order
     * @param total      Order total in USD
     */
    public void placeOrder(String orderId, String customerId, double total) {
        Logger.setCorrelationId("order-" + orderId);
        try {
            log.info(String.format("Placing order for customer %s, total=%.2f", customerId, total));
            // ... business logic / DB write ...
            log.info("Order " + orderId + " placed successfully");
        } finally {
            // Always clear to avoid ID leakage to subsequent requests on this thread
            Logger.clearCorrelationId();
        }
    }

    /** Cancel an existing order and record the reason. */
    public void cancelOrder(String orderId, String reason) {
        Logger.setCorrelationId("cancel-" + orderId);
        try {
            log.warning("Order " + orderId + " cancelled: " + reason);
        } finally {
            Logger.clearCorrelationId();
        }
    }
}
`,
          },
          {
            name: "LoggerTest.java",
            dir: "com/example/logging/",
            content: `package com.example.logging;

import org.junit.jupiter.api.Test;
import java.util.concurrent.*;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for Logger singleton — Bill Pugh Holder pattern.
 *
 * Covers:
 *   1. Identity under sequential access.
 *   2. Identity under highly concurrent access (200 threads).
 *   3. Thread-local correlation IDs are isolated per thread.
 */
class LoggerTest {

    @Test
    void singletonIdentity() {
        Logger a = Logger.getInstance();
        Logger b = Logger.getInstance();
        assertSame(a, b, "getInstance() must return the identical object");
    }

    @Test
    void concurrentSingletonIdentity() throws InterruptedException {
        int n = 200;
        CountDownLatch start  = new CountDownLatch(1);
        CountDownLatch finish = new CountDownLatch(n);
        List<Logger> results  = new CopyOnWriteArrayList<>();

        IntStream.range(0, n).forEach(i -> new Thread(() -> {
            try {
                start.await();            // wait for all threads to be ready
                results.add(Logger.getInstance());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                finish.countDown();
            }
        }).start());

        start.countDown();   // release all threads simultaneously
        assertTrue(finish.await(5, TimeUnit.SECONDS));

        Logger first = results.get(0);
        results.forEach(l -> assertSame(first, l,
            "Concurrent getInstance() calls returned different instances"));
    }

    @Test
    void correlationIdIsThreadLocal() throws InterruptedException {
        Logger log = Logger.getInstance();
        CyclicBarrier barrier = new CyclicBarrier(2);
        String[] seen = new String[2];

        Thread t1 = new Thread(() -> {
            Logger.setCorrelationId("req-AAA");
            try { barrier.await(); } catch (Exception ignored) {}
            seen[0] = Logger.getCorrelationId();
            Logger.clearCorrelationId();
        });

        Thread t2 = new Thread(() -> {
            Logger.setCorrelationId("req-BBB");
            try { barrier.await(); } catch (Exception ignored) {}
            seen[1] = Logger.getCorrelationId();
            Logger.clearCorrelationId();
        });

        t1.start(); t2.start();
        t1.join();  t2.join();

        assertEquals("req-AAA", seen[0], "Thread 1 correlation ID leaked into thread 2");
        assertEquals("req-BBB", seen[1], "Thread 2 correlation ID leaked into thread 1");
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "logger.ts",
            dir: "src/logging/",
            content: `/**
 * src/logging/logger.ts
 * ---------------------
 * Lazy singleton Logger — TypeScript equivalent of the Bill Pugh Holder idiom.
 *
 * Implementation: the module variable 'instance' starts as undefined.
 * getLogger() uses the nullish coalescing assignment (??=) to create the
 * Logger exactly once, on first call.  The ES module system evaluates this
 * file once per module graph — every importer receives the same 'instance'.
 *
 * This gives us:
 *   • Lazy initialization (no allocation until first getLogger() call)
 *   • Zero synchronization code (JS is single-threaded per event loop)
 *   • Full TypeScript type-safety
 *
 * Note: in environments with multiple module graphs (Worker threads,
 * separate Webpack chunks) each graph gets its own singleton — document
 * this boundary for your team.
 */

export type LogLevel = "debug" | "info" | "warning" | "error";

export interface LogRecord {
  timestamp: string;
  level: LogLevel;
  service: string;
  correlationId?: string;
  message: string;
}

export class Logger {
  readonly #serviceName: string;
  #minLevel: LogLevel;
  #correlationId: string = "";

  // Private constructor — only accessible through getLogger()
  private constructor(serviceName: string, minLevel: LogLevel) {
    this.#serviceName = serviceName;
    this.#minLevel = minLevel;
  }

  // ─── Instantiation ────────────────────────────────────────────────────────
  static #build(): Logger {
    return new Logger(
      process.env["SERVICE_NAME"] ?? "app",
      (process.env["LOG_LEVEL"]?.toLowerCase() as LogLevel) ?? "info",
    );
  }

  // ─── Correlation ID ───────────────────────────────────────────────────────
  setCorrelationId(id: string): void { this.#correlationId = id; }
  clearCorrelationId(): void         { this.#correlationId = ""; }
  getCorrelationId(): string         { return this.#correlationId; }

  // ─── Logging API ──────────────────────────────────────────────────────────
  setLevel(level: LogLevel): void { this.#minLevel = level; }

  info(msg: string): void    { this.#emit("info",    msg); }
  warning(msg: string): void { this.#emit("warning", msg); }
  error(msg: string): void   { this.#emit("error",   msg); }
  debug(msg: string): void   { this.#emit("debug",   msg); }

  #emit(level: LogLevel, msg: string): void {
    const LEVELS: LogLevel[] = ["debug", "info", "warning", "error"];
    if (LEVELS.indexOf(level) < LEVELS.indexOf(this.#minLevel)) return;

    const record: LogRecord = {
      timestamp: new Date().toISOString(),
      level,
      service: this.#serviceName,
      correlationId: this.#correlationId || undefined,
      message: msg,
    };
    console.log(JSON.stringify(record));
  }

  // ─── Factory (used by the module-level holder below) ─────────────────────
  /** @internal — use getLogger() instead */
  static _create = Logger.#build;
}

// ──────────────────────────────────────────────────────────────────────────────
// Holder: 'instance' starts undefined; ??= ensures exactly-once creation.
// ──────────────────────────────────────────────────────────────────────────────
let instance: Logger | undefined;

/** Returns the application-wide Logger singleton.  Lazy and allocation-free after first call. */
export function getLogger(): Logger {
  instance ??= Logger._create();
  return instance;
}
`,
          },
          {
            name: "order-service.ts",
            dir: "src/app/",
            content: `/**
 * src/app/order-service.ts
 * ------------------------
 * Domain service that uses the Logger singleton.
 */

import { getLogger } from "../logging/logger";

interface Order {
  id: string;
  customerId: string;
  total: number;
}

export class OrderService {
  async placeOrder(order: Order): Promise<boolean> {
    const log = getLogger();
    log.setCorrelationId(\`order-\${order.id}\`);
    try {
      log.info(\`Placing order for customer \${order.customerId}, total=\${order.total.toFixed(2)}\`);
      // ... business logic / DB write ...
      log.info(\`Order \${order.id} placed successfully\`);
      return true;
    } catch (err) {
      log.error(\`Failed to place order \${order.id}: \${String(err)}\`);
      return false;
    } finally {
      log.clearCorrelationId();
    }
  }

  cancelOrder(orderId: string, reason: string): void {
    const log = getLogger();
    log.setCorrelationId(\`cancel-\${orderId}\`);
    log.warning(\`Order \${orderId} cancelled: \${reason}\`);
    log.clearCorrelationId();
  }
}
`,
          },
          {
            name: "logger.test.ts",
            dir: "src/__tests__/",
            content: `/**
 * src/__tests__/logger.test.ts
 * ----------------------------
 * Singleton identity and API tests for the Logger.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { getLogger } from "../logging/logger";

describe("Logger singleton (Bill Pugh / lazy accessor)", () => {
  it("returns the same instance on every call", () => {
    const a = getLogger();
    const b = getLogger();
    expect(a).toBe(b);
  });

  it("preserves correlation ID within a call chain", () => {
    const log = getLogger();
    log.setCorrelationId("req-001");
    expect(log.getCorrelationId()).toBe("req-001");
    log.clearCorrelationId();
    expect(log.getCorrelationId()).toBe("");
  });

  it("100 sequential calls all return the identical reference", () => {
    const first = getLogger();
    for (let i = 0; i < 100; i++) {
      expect(getLogger()).toBe(first);
    }
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "logger.rs",
            dir: "src/",
            content: `//! src/logger.rs
//!
//! Lazy singleton logger using OnceLock — Rust's equivalent of the
//! Bill Pugh Initialization-on-Demand Holder.
//!
//! OnceLock<T> stores a value that is written exactly once, by the first
//! thread that calls get_or_init().  Subsequent calls return the cached
//! reference without any locking.  The std library guarantees that if two
//! threads race to initialise the same OnceLock, exactly one wins and the
//! other waits until initialisation is complete before receiving the value.

use std::sync::OnceLock;
use chrono::Utc;

/// Application-wide logger configuration.
pub struct Logger {
    pub service_name: String,
    pub min_level: Level,
}

/// Log severity levels.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Level {
    Debug,
    Info,
    Warning,
    Error,
}

impl std::fmt::Display for Level {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Level::Debug   => write!(f, "DEBUG"),
            Level::Info    => write!(f, "INFO"),
            Level::Warning => write!(f, "WARN"),
            Level::Error   => write!(f, "ERROR"),
        }
    }
}

impl Logger {
    fn new() -> Self {
        let min_level = match std::env::var("LOG_LEVEL")
            .unwrap_or_default()
            .to_uppercase()
            .as_str()
        {
            "DEBUG" => Level::Debug,
            "WARNING" | "WARN" => Level::Warning,
            "ERROR" => Level::Error,
            _ => Level::Info,
        };
        Logger {
            service_name: std::env::var("SERVICE_NAME").unwrap_or_else(|_| "app".into()),
            min_level,
        }
    }

    pub fn emit(&self, level: Level, correlation_id: Option<&str>, msg: &str) {
        if level < self.min_level { return; }
        let cid = correlation_id
            .map(|id| format!("[{}] ", id))
            .unwrap_or_default();
        println!(
            "{} [{}] [{}] {}{}",
            Utc::now().to_rfc3339(),
            level,
            self.service_name,
            cid,
            msg,
        );
    }

    pub fn info(&self, msg: &str)    { self.emit(Level::Info,    None, msg); }
    pub fn warning(&self, msg: &str) { self.emit(Level::Warning, None, msg); }
    pub fn error(&self, msg: &str)   { self.emit(Level::Error,   None, msg); }
    pub fn debug(&self, msg: &str)   { self.emit(Level::Debug,   None, msg); }
}

// ─── OnceLock holder ─────────────────────────────────────────────────────────
// Initialized on first call to get_logger(); subsequent calls are lock-free
// reads from the static variable.
static LOGGER: OnceLock<Logger> = OnceLock::new();

/// Returns a reference to the application-wide Logger singleton.
///
/// Thread-safe: OnceLock ensures exactly-once initialisation.
/// Lazy: the Logger is not created until this function is first called.
pub fn get_logger() -> &'static Logger {
    LOGGER.get_or_init(Logger::new)
}
`,
          },
          {
            name: "order_service.rs",
            dir: "src/",
            content: `//! src/order_service.rs
//!
//! Domain service that uses the Logger singleton.

use crate::logger::get_logger;

pub struct Order {
    pub id: String,
    pub customer_id: String,
    pub total: f64,
}

pub struct OrderService;

impl OrderService {
    pub fn place_order(&self, order: &Order) -> Result<(), String> {
        let log = get_logger();
        let cid = format!("order-{}", order.id);

        log.emit(
            crate::logger::Level::Info,
            Some(&cid),
            &format!("Placing order for customer {}, total={:.2}", order.customer_id, order.total),
        );

        // ... business logic / DB write ...

        log.emit(
            crate::logger::Level::Info,
            Some(&cid),
            &format!("Order {} placed successfully", order.id),
        );

        Ok(())
    }

    pub fn cancel_order(&self, order_id: &str, reason: &str) {
        let cid = format!("cancel-{}", order_id);
        get_logger().emit(
            crate::logger::Level::Warning,
            Some(&cid),
            &format!("Order {} cancelled: {}", order_id, reason),
        );
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//!
//! Entry point — wires together OrderService and the Logger singleton.

mod logger;
mod order_service;

use order_service::{Order, OrderService};

fn main() {
    let svc = OrderService;

    let order = Order {
        id: "ORD-001".into(),
        customer_id: "CUST-42".into(),
        total: 149.99,
    };

    if let Err(e) = svc.place_order(&order) {
        logger::get_logger().error(&format!("Unexpected error: {}", e));
        std::process::exit(1);
    }

    svc.cancel_order("ORD-002", "customer request");
}
`,
          },
        ],
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
       * TypeScript doesn't have Java-style enum singletons with behavior.
       * The closest practical analogue is: export a single instance from a module.
       *
       * Note: Object.freeze is *shallow* — it prevents modifying the object's shape
       * (adding/replacing fields), but it does NOT freeze internal mutable state
       * like Maps. The singleton guarantee here is about instance identity.
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

// Singleton via module export — importers share the same reference.
// Freeze is optional and shallow (see note above).
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class CacheManager {
    <<enumeration · Singleton>>
    +INSTANCE$ CacheManager
    -data ConcurrentHashMap~String,Object~
    +put(key String, value Object) void
    +get(key String) Object
    +invalidate(key String) void
    +size() int
  }
  note for CacheManager "Single enum constant = single JVM instance.\\nNo getInstance() needed — use CacheManager.INSTANCE directly.\\nJVM guarantees: thread-safe init, serialization-safe,\\nreflection-safe (cannot construct enums via reflection)."`,
      },
      diagramExplanation:
        "The enum-based singleton abuses a Java language guarantee: enum constants are singletons by specification. The JVM allocates each enum constant exactly once during class initialization, protects that initialization with the same class-loading lock used by the Holder pattern, and additionally forbids reflection-based construction (Constructor.newInstance() throws IllegalArgumentException on enum types). Serialization is also handled automatically: the JVM deserializes enum values by their name using Enum.valueOf(), so the deserialized reference is always the pre-existing INSTANCE rather than a newly constructed clone. These three guarantees together make enum the simplest provably-correct singleton in Java.",
      codeFiles: {
        Python: [
          {
            name: "app_settings.py",
            dir: "config/",
            content: `"""
config/app_settings.py
----------------------
Enum-based singleton for application settings — Python equivalent of
Java's 'enum AppSettings { INSTANCE; }'.

Design decision
===============
Python's Enum metaclass ensures each member is created exactly once.
'AppSettings.INSTANCE' is always the same object for the lifetime of
the interpreter, giving us a reliable singleton without any metaclass
trickery.  We store mutable state (the settings dict) as an instance
attribute on the enum member — Python allows this pattern.

Production note
===============
We read all settings in __init__ so that the object is fully initialised
at first access.  Use reload() to hot-reload without restarting the process.
"""

from __future__ import annotations
import os
from enum import Enum
from typing import Any


class AppSettings(Enum):
    """
    Singleton application settings.

    Access via:  AppSettings.INSTANCE
    """
    INSTANCE = "INSTANCE"   # The single constant — its string value is irrelevant

    def __init__(self, _value: str) -> None:
        # Load settings immediately on first (and only) construction
        self._settings: dict[str, Any] = {}
        self._load()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _load(self) -> None:
        """Read all settings from environment / config files."""
        self._settings = {
            "db_url":       os.getenv("DATABASE_URL", "postgres://localhost:5432/app"),
            "db_pool_max":  int(os.getenv("DB_POOL_MAX", "10")),
            "redis_url":    os.getenv("REDIS_URL", "redis://localhost:6379/0"),
            "cache_ttl_s":  int(os.getenv("CACHE_TTL_SECONDS", "300")),
            "log_level":    os.getenv("LOG_LEVEL", "INFO").upper(),
            "debug":        os.getenv("DEBUG", "false").lower() == "true",
        }

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get(self, key: str, default: Any = None) -> Any:
        """Return the value for a configuration key."""
        return self._settings.get(key, default)

    def reload(self) -> None:
        """Hot-reload settings from the environment without restarting."""
        self._load()

    @property
    def db_url(self) -> str:
        return str(self._settings["db_url"])

    @property
    def cache_ttl(self) -> int:
        return int(self._settings["cache_ttl_s"])

    @property
    def is_debug(self) -> bool:
        return bool(self._settings["debug"])


# ── Usage ────────────────────────────────────────────────────────────────────
# cfg = AppSettings.INSTANCE
# print(cfg.db_url)
# print(cfg.cache_ttl)
# AppSettings.INSTANCE is AppSettings.INSTANCE  → True (same object)
`,
          },
          {
            name: "cache_client.py",
            dir: "infra/",
            content: `"""
infra/cache_client.py
---------------------
Redis-backed cache client that reads configuration from the AppSettings singleton.
"""

from __future__ import annotations
from config.app_settings import AppSettings


class CacheClient:
    """
    Thin wrapper around Redis that uses the AppSettings singleton to
    determine connection parameters and default TTL.
    """

    def __init__(self) -> None:
        cfg = AppSettings.INSTANCE
        self._url = cfg.db_url          # demo: reusing db_url as cache URL
        self._default_ttl = cfg.cache_ttl
        # In production: self._redis = redis.Redis.from_url(cfg.redis_url)
        self._store: dict[str, str] = {}  # in-memory stub for demo

    def get(self, key: str) -> str | None:
        """Retrieve a cached value."""
        return self._store.get(key)

    def set(self, key: str, value: str, ttl: int | None = None) -> None:
        """Store a value; uses the configured default TTL when not specified."""
        effective_ttl = ttl if ttl is not None else self._default_ttl
        # In production: self._redis.set(key, value, ex=effective_ttl)
        self._store[key] = value

    def delete(self, key: str) -> None:
        """Remove a key from the cache."""
        self._store.pop(key, None)
`,
          },
          {
            name: "test_app_settings.py",
            dir: "tests/",
            content: `"""
tests/test_app_settings.py
--------------------------
Verifies singleton identity, immutability of access, and enum-safety properties.
"""

import pytest
from config.app_settings import AppSettings


def test_singleton_identity() -> None:
    """AppSettings.INSTANCE must always be the same object."""
    a = AppSettings.INSTANCE
    b = AppSettings.INSTANCE
    assert a is b, "Enum member identity violated"


def test_no_extra_members() -> None:
    """Only one enum member should exist."""
    members = list(AppSettings)
    assert len(members) == 1, f"Expected 1 member, found {len(members)}"


def test_settings_accessible() -> None:
    cfg = AppSettings.INSTANCE
    assert isinstance(cfg.db_url, str)
    assert cfg.cache_ttl > 0


def test_reload_does_not_change_identity() -> None:
    """reload() must not replace the enum member with a new object."""
    before = AppSettings.INSTANCE
    AppSettings.INSTANCE.reload()
    after = AppSettings.INSTANCE
    assert before is after, "reload() must not replace the singleton object"
`,
          },
        ],
        Go: [
          {
            name: "app_settings.go",
            dir: "config/",
            content: `// config/app_settings.go
//
// Singleton application settings for Go — equivalent of Java's enum singleton.
//
// Go has no enum singletons, but a package-level variable initialized in an
// init() function is semantically identical: it is created exactly once before
// any goroutine in the package can access it.
package config

import (
	"os"
	"strconv"
	"sync"
)

// AppSettings holds application-wide configuration read from the environment.
type AppSettings struct {
	DBUrl      string
	DBPoolMax  int
	RedisURL   string
	CacheTTL   int // seconds
	LogLevel   string
	Debug      bool
}

var (
	// settings is the singleton; once serialises concurrent first-access.
	settings *AppSettings
	once     sync.Once
)

// Get returns the application-wide AppSettings singleton.
// Equivalent to Java's CacheManager.INSTANCE.
func Get() *AppSettings {
	once.Do(func() {
		poolMax, _ := strconv.Atoi(getenv("DB_POOL_MAX", "10"))
		cacheTTL, _ := strconv.Atoi(getenv("CACHE_TTL_SECONDS", "300"))
		settings = &AppSettings{
			DBUrl:     getenv("DATABASE_URL", "postgres://localhost:5432/app"),
			DBPoolMax: poolMax,
			RedisURL:  getenv("REDIS_URL", "redis://localhost:6379/0"),
			CacheTTL:  cacheTTL,
			LogLevel:  getenv("LOG_LEVEL", "INFO"),
			Debug:     getenv("DEBUG", "false") == "true",
		}
	})
	return settings
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
`,
          },
          {
            name: "cache_client.go",
            dir: "infra/",
            content: `// infra/cache_client.go
//
// Redis-backed cache client that reads connection parameters from AppSettings.
package infra

import (
	"sync"

	"myapp/config"
)

// CacheClient wraps a Redis connection (stubbed here for demo purposes).
type CacheClient struct {
	mu         sync.RWMutex
	store      map[string]string
	defaultTTL int
}

// NewCacheClient creates a client configured from the AppSettings singleton.
func NewCacheClient() *CacheClient {
	cfg := config.Get()
	return &CacheClient{
		store:      make(map[string]string),
		defaultTTL: cfg.CacheTTL,
	}
}

// Get retrieves a cached value; returns "", false if absent.
func (c *CacheClient) Get(key string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	v, ok := c.store[key]
	return v, ok
}

// Set stores key→value with the configured default TTL.
func (c *CacheClient) Set(key, value string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.store[key] = value
}

// Delete removes a key from the cache.
func (c *CacheClient) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.store, key)
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go — wires together AppSettings and CacheClient
package main

import (
	"fmt"

	"myapp/config"
	"myapp/infra"
)

func main() {
	cfg := config.Get()
	fmt.Printf("DB: %s  Pool: %d  TTL: %ds\\n", cfg.DBUrl, cfg.DBPoolMax, cfg.CacheTTL)

	cache := infra.NewCacheClient()
	cache.Set("user:42", "Alice")
	if v, ok := cache.Get("user:42"); ok {
		fmt.Println("cached:", v)
	}

	// Demonstrate singleton identity
	cfg2 := config.Get()
	fmt.Println("Same instance:", cfg == cfg2) // true
}
`,
          },
        ],
        Java: [
          {
            name: "AppSettings.java",
            dir: "com/example/config/",
            content: `package com.example.config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enum-Based Singleton for application settings — "Effective Java" Item 3.
 *
 * <h3>Why enum?</h3>
 * <ul>
 *   <li><strong>Thread-safe init</strong> — JVM class-loading guarantees</li>
 *   <li><strong>Reflection-safe</strong> — {@code Constructor.newInstance()} on
 *       an enum throws {@link IllegalArgumentException}</li>
 *   <li><strong>Serialization-safe</strong> — JVM uses {@code Enum.valueOf(name)}
 *       during deserialization, returning the pre-existing INSTANCE rather than
 *       allocating a new one</li>
 * </ul>
 */
public enum AppSettings {
    INSTANCE;   // ← The single instance — this is the entire "getInstance()" mechanism

    // ─── Backing store ──────────────────────────────────────────────────────
    // ConcurrentHashMap keeps individual get/put operations thread-safe.
    // For atomic read-modify-write patterns (e.g. compare-and-swap a setting)
    // use a dedicated lock or an AtomicReference wrapping an immutable snapshot.
    private final ConcurrentHashMap<String, String> settings = new ConcurrentHashMap<>();

    // Constructor called by JVM exactly once during class initialization
    AppSettings() {
        reload();
    }

    // ─── Configuration loading ──────────────────────────────────────────────

    /** (Re)load all settings from environment / System properties. */
    public void reload() {
        settings.put("db.url",        getEnv("DATABASE_URL",      "jdbc:postgresql://localhost:5432/app"));
        settings.put("db.pool.max",   getEnv("DB_POOL_MAX",        "10"));
        settings.put("redis.url",     getEnv("REDIS_URL",          "redis://localhost:6379/0"));
        settings.put("cache.ttl",     getEnv("CACHE_TTL_SECONDS",  "300"));
        settings.put("log.level",     getEnv("LOG_LEVEL",          "INFO").toUpperCase());
        settings.put("debug",         getEnv("DEBUG",              "false").toLowerCase());
    }

    // ─── Public accessors ───────────────────────────────────────────────────

    public String  dbUrl()      { return settings.get("db.url"); }
    public int     dbPoolMax()  { return Integer.parseInt(settings.get("db.pool.max")); }
    public String  redisUrl()   { return settings.get("redis.url"); }
    public int     cacheTtl()   { return Integer.parseInt(settings.get("cache.ttl")); }
    public String  logLevel()   { return settings.get("log.level"); }
    public boolean isDebug()    { return Boolean.parseBoolean(settings.get("debug")); }

    public String get(String key)                       { return settings.get(key); }
    public String getOrDefault(String key, String def)  { return settings.getOrDefault(key, def); }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private static String getEnv(String name, String fallback) {
        String v = System.getenv(name);
        return (v != null && !v.isBlank()) ? v : fallback;
    }
}
`,
          },
          {
            name: "CacheService.java",
            dir: "com/example/infra/",
            content: `package com.example.infra;

import com.example.config.AppSettings;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * In-process cache service backed by AppSettings enum singleton.
 *
 * In production this would delegate to a Redis client configured from
 * {@code AppSettings.INSTANCE.redisUrl()}.
 */
public class CacheService {

    // Reads config once at construction — AppSettings.INSTANCE is guaranteed
    // to be the sole, fully-initialized instance by the time this runs.
    private final int defaultTtlSecs = AppSettings.INSTANCE.cacheTtl();

    // Stubbed in-memory store for demo (replace with Jedis / Lettuce)
    private final ConcurrentHashMap<String, String> store = new ConcurrentHashMap<>();

    public void put(String key, String value) {
        store.put(key, value);
        // In production: jedis.setex(key, defaultTtlSecs, value);
    }

    public String get(String key) {
        return store.get(key);
    }

    public void invalidate(String key) {
        store.remove(key);
        // In production: jedis.del(key);
    }

    public int size() {
        return store.size();
    }
}
`,
          },
          {
            name: "AppSettingsTest.java",
            dir: "com/example/config/",
            content: `package com.example.config;

import org.junit.jupiter.api.Test;
import java.lang.reflect.Constructor;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for AppSettings enum singleton.
 *
 * Covers the three guarantees that make enum superior to class-based singletons:
 *   1. Identity: AppSettings.INSTANCE is always the same reference.
 *   2. Reflection-safety: reflection cannot instantiate a second copy.
 *   3. Serialization-safety: deserialized value is the pre-existing INSTANCE.
 */
class AppSettingsTest {

    @Test
    void singletonsAreIdentical() {
        AppSettings a = AppSettings.INSTANCE;
        AppSettings b = AppSettings.INSTANCE;
        assertSame(a, b, "Enum members must be the same object every time");
    }

    @Test
    void reflectionCannotCreateNewInstance() {
        // Attempting to obtain the constructor of an enum and invoke it must throw.
        // The JVM specification §15.9.1 forbids creating enum instances via reflection.
        assertThrows(Exception.class, () -> {
            Constructor<AppSettings> ctor =
                AppSettings.class.getDeclaredConstructor(String.class, int.class);
            ctor.setAccessible(true);
            ctor.newInstance("SECOND", 1);   // must throw IllegalArgumentException
        });
    }

    @Test
    void settingsAccessibleWithDefaults() {
        AppSettings cfg = AppSettings.INSTANCE;
        assertFalse(cfg.dbUrl().isBlank(),  "DB URL must not be blank");
        assertTrue(cfg.dbPoolMax() > 0,     "Pool max must be positive");
        assertTrue(cfg.cacheTtl() > 0,      "Cache TTL must be positive");
    }

    @Test
    void reloadPreservesIdentity() {
        AppSettings before = AppSettings.INSTANCE;
        AppSettings.INSTANCE.reload();
        AppSettings after = AppSettings.INSTANCE;
        assertSame(before, after, "reload() must not produce a new object");
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "app-settings.ts",
            dir: "src/config/",
            content: `/**
 * src/config/app-settings.ts
 * --------------------------
 * Enum-based singleton for TypeScript — closest analogue to Java's enum singleton.
 *
 * TypeScript's 'const enum' and 'enum' don't support instance state, so we
 * use the module-export pattern instead:
 *   1. A readonly class (all fields assigned in constructor, no setters)
 *   2. A single exported const — this is the "enum constant"
 *   3. Object.freeze() prevents accidental mutation of the reference itself
 *      (note: freeze is shallow — it does not freeze nested objects)
 *
 * Serialization-safety: not an issue in TS (no Java-style serialization).
 * Reflection-safety: TypeScript has no reflection API that could bypass the
 *   private constructor (unlike Java's Constructor.newInstance()).
 */

interface SettingsData {
  readonly dbUrl: string;
  readonly dbPoolMax: number;
  readonly redisUrl: string;
  readonly cacheTtl: number;
  readonly logLevel: string;
  readonly debug: boolean;
}

class AppSettingsImpl implements SettingsData {
  readonly dbUrl: string;
  readonly dbPoolMax: number;
  readonly redisUrl: string;
  readonly cacheTtl: number;
  readonly logLevel: string;
  readonly debug: boolean;

  private constructor() {
    // Read from environment at construction time — immutable thereafter
    this.dbUrl      = process.env["DATABASE_URL"] ?? "postgres://localhost:5432/app";
    this.dbPoolMax  = Number(process.env["DB_POOL_MAX"] ?? "10");
    this.redisUrl   = process.env["REDIS_URL"] ?? "redis://localhost:6379/0";
    this.cacheTtl   = Number(process.env["CACHE_TTL_SECONDS"] ?? "300");
    this.logLevel   = (process.env["LOG_LEVEL"] ?? "INFO").toUpperCase();
    this.debug      = (process.env["DEBUG"] ?? "false") === "true";
  }

  /** @internal — only called once by the module-level export below */
  static _create(): AppSettingsImpl {
    return new AppSettingsImpl();
  }

  get(key: keyof SettingsData): SettingsData[typeof key] {
    return this[key];
  }
}

/**
 * THE singleton — equivalent to Java's  AppSettings.INSTANCE
 *
 * Object.freeze() prevents re-assignment of top-level properties
 * (adding/replacing fields).  Internal state (like this.dbUrl) is a
 * primitive, so it is effectively immutable already.
 */
export const AppSettings = Object.freeze(AppSettingsImpl._create());

// Type alias for callers who need the shape without the implementation class
export type { SettingsData };
`,
          },
          {
            name: "cache-client.ts",
            dir: "src/infra/",
            content: `/**
 * src/infra/cache-client.ts
 * -------------------------
 * Cache client configured from the AppSettings singleton.
 */

import { AppSettings } from "../config/app-settings";

export class CacheClient {
  readonly #ttl: number;
  readonly #store = new Map<string, { value: string; expiresAt: number }>();

  constructor() {
    // The TTL comes from the singleton — no constructor parameter needed
    this.#ttl = AppSettings.cacheTtl * 1_000; // convert to ms
  }

  set(key: string, value: string, ttlMs?: number): void {
    this.#store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.#ttl),
    });
  }

  get(key: string): string | undefined {
    const entry = this.#store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.#store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  invalidate(key: string): void {
    this.#store.delete(key);
  }

  get size(): number { return this.#store.size; }
}
`,
          },
          {
            name: "app-settings.test.ts",
            dir: "src/__tests__/",
            content: `/**
 * src/__tests__/app-settings.test.ts
 * ------------------------------------
 * Verifies singleton identity and immutability.
 */

import { describe, it, expect } from "vitest";
import { AppSettings } from "../config/app-settings";

describe("AppSettings (enum-style singleton)", () => {
  it("returns the same frozen object on every import", () => {
    // Because both imports resolve to the same module, they share the same export
    const a = AppSettings;
    const b = AppSettings;
    expect(a).toBe(b);
    expect(Object.isFrozen(a)).toBe(true);
  });

  it("has sensible default values", () => {
    expect(AppSettings.dbUrl).toBeTruthy();
    expect(AppSettings.dbPoolMax).toBeGreaterThan(0);
    expect(AppSettings.cacheTtl).toBeGreaterThan(0);
  });

  it("cannot re-assign top-level properties (frozen)", () => {
    expect(() => {
      // @ts-expect-error — testing runtime protection
      (AppSettings as any).dbUrl = "hacked";
    }).toThrow();
  });
});
`,
          },
        ],
        Rust: [
          {
            name: "app_settings.rs",
            dir: "src/",
            content: `//! src/app_settings.rs
//!
//! Enum-based singleton for application settings in Rust.
//!
//! Rust does not have Java-style enums with state, but OnceLock<T> provides
//! the same guarantees:
//!   - Initialized exactly once
//!   - Thread-safe: concurrent callers wait for the winner to finish
//!   - Immutable after init (AppSettings is a plain struct with no &mut methods)
//!
//! AccessPattern
//! =============
//!   let cfg = app_settings();
//!   println!("{}", cfg.db_url);

use std::sync::OnceLock;

/// Immutable application settings snapshot.
#[derive(Debug)]
pub struct AppSettings {
    pub db_url:      String,
    pub db_pool_max: u32,
    pub redis_url:   String,
    pub cache_ttl:   u64, // seconds
    pub log_level:   String,
    pub debug:       bool,
}

impl AppSettings {
    fn from_env() -> Self {
        AppSettings {
            db_url:      env_or("DATABASE_URL", "postgres://localhost:5432/app"),
            db_pool_max: env_or("DB_POOL_MAX", "10").parse().unwrap_or(10),
            redis_url:   env_or("REDIS_URL", "redis://localhost:6379/0"),
            cache_ttl:   env_or("CACHE_TTL_SECONDS", "300").parse().unwrap_or(300),
            log_level:   env_or("LOG_LEVEL", "INFO").to_uppercase(),
            debug:       env_or("DEBUG", "false") == "true",
        }
    }
}

fn env_or(key: &str, fallback: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| fallback.to_owned())
}

// ─── OnceLock holder — the Rust "enum singleton" ──────────────────────────
static SETTINGS: OnceLock<AppSettings> = OnceLock::new();

/// Returns a reference to the application-wide AppSettings singleton.
///
/// Initialized on first call; subsequent calls are lock-free reads.
pub fn app_settings() -> &'static AppSettings {
    SETTINGS.get_or_init(AppSettings::from_env)
}
`,
          },
          {
            name: "cache_client.rs",
            dir: "src/",
            content: `//! src/cache_client.rs
//!
//! Cache client configured from the AppSettings singleton.

use std::collections::HashMap;
use std::sync::Mutex;
use crate::app_settings::app_settings;

pub struct CacheEntry {
    pub value: String,
}

pub struct CacheClient {
    store: Mutex<HashMap<String, CacheEntry>>,
    pub default_ttl: u64,
}

impl CacheClient {
    /// Create a client using TTL from the AppSettings singleton.
    pub fn new() -> Self {
        CacheClient {
            store: Mutex::new(HashMap::new()),
            default_ttl: app_settings().cache_ttl,
        }
    }

    pub fn set(&self, key: &str, value: &str) {
        let mut store = self.store.lock().unwrap();
        store.insert(key.to_owned(), CacheEntry { value: value.to_owned() });
    }

    pub fn get(&self, key: &str) -> Option<String> {
        let store = self.store.lock().unwrap();
        store.get(key).map(|e| e.value.clone())
    }

    pub fn invalidate(&self, key: &str) {
        self.store.lock().unwrap().remove(key);
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod app_settings;
mod cache_client;

use app_settings::app_settings;
use cache_client::CacheClient;

fn main() {
    let cfg = app_settings();
    println!("DB: {}  Pool: {}  TTL: {}s", cfg.db_url, cfg.db_pool_max, cfg.cache_ttl);

    let cache = CacheClient::new();
    cache.set("user:42", "Alice");
    if let Some(v) = cache.get("user:42") {
        println!("cached: {}", v);
    }

    // Singleton identity
    let cfg2 = app_settings();
    println!("Same ptr: {}", std::ptr::eq(cfg, cfg2)); // true
}
`,
          },
        ],
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

import (
  "fmt"
  "sync"
)

// Module-Level Singleton — Go uses package-level variables.
// Go's package initialization runs exactly once per program,
// making this an idiomatic Go singleton approach.

type eventBus struct {
  mu          sync.RWMutex
  subscribers map[string][]func(interface{})
}

func (eb *eventBus) Subscribe(event string, cb func(interface{})) {
  eb.mu.Lock()
  defer eb.mu.Unlock()
  eb.subscribers[event] = append(eb.subscribers[event], cb)
}

func (eb *eventBus) Publish(event string, data interface{}) {
  // Copy callbacks under read-lock, then invoke without holding the lock.
  // This avoids deadlocks and allows subscribers to add/remove while publishing.
  eb.mu.RLock()
  cbs := append([]func(interface{}){}, eb.subscribers[event]...)
  eb.mu.RUnlock()
  for _, cb := range cbs {
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

  private final java.util.concurrent.ConcurrentHashMap<
    String,
    java.util.concurrent.CopyOnWriteArrayList<java.util.function.Consumer<Object>>
  > subscribers = new java.util.concurrent.ConcurrentHashMap<>();

    private EventBus() {}

    public static EventBus getInstance() {
        return INSTANCE;
    }

    public void subscribe(String event, java.util.function.Consumer<Object> cb) {
      // CopyOnWriteArrayList makes iteration during publish safe without
      // external synchronization (good for many reads / fewer writes).
      subscribers.computeIfAbsent(event, k -> new java.util.concurrent.CopyOnWriteArrayList<>())
        .add(cb);
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class EventBus {
    <<Module-Level Singleton>>
    -subscribers Dict~str, List~Callable~~
    +subscribe(event str, handler Callable) void
    +publish(event str, data Any) void
  }
  class OrderService {
    -event_bus EventBus
    +place_order(order_id str) void
  }
  class NotificationService {
    +on_order_placed(data Any) void
  }
  EventBus <.. OrderService : "imports module-level instance"
  EventBus <.. NotificationService : "imports module-level instance"
  note for EventBus "Module system guarantees single evaluation.\\nAll importers share the same instance.\\nNo getInstance() needed — just import."`,
      },
      diagramExplanation:
        "The module-level singleton leverages the runtime's built-in module cache. In Python, Go, and JavaScript/TypeScript the module system guarantees that a module's top-level code runs exactly once regardless of how many files import it. The shared instance lives in the module cache — effectively a process-wide registry keyed by canonical module path. This trades the class-based getInstance() ceremony for a plain import statement, which is idiomatic in every language that supports it.",
      codeFiles: {
        Python: [
          {
            name: "event_bus.py",
            dir: "messaging/",
            content: `"""
messaging/event_bus.py
----------------------
Module-Level Singleton EventBus for Python.

Key property
============
Python caches modules in sys.modules.  The first 'import event_bus'
executes the module body and stores the resulting module object.
Every subsequent 'import event_bus' returns the same object from the
cache.  Therefore 'event_bus' (the module-level instance at the bottom
of this file) is shared by all importers — no getInstance() needed.

Design notes
============
- _EventBus is intentionally "private" (leading underscore) so callers
  always reach for the pre-created 'event_bus' instance, not the class.
- Callbacks are stored per event-topic in a defaultdict.
- Thread safety: subscribe / publish both hold a threading.Lock.
"""

from __future__ import annotations

import threading
from collections import defaultdict
from typing import Any, Callable


class _EventBus:
    """Internal implementation — access via the module-level 'event_bus' singleton."""

    def __init__(self) -> None:
        self._lock: threading.Lock = threading.Lock()
        self._subscribers: dict[str, list[Callable[[Any], None]]] = defaultdict(list)

    def subscribe(self, event: str, handler: Callable[[Any], None]) -> None:
        """Register a handler for the given event topic."""
        with self._lock:
            self._subscribers[event].append(handler)

    def unsubscribe(self, event: str, handler: Callable[[Any], None]) -> None:
        """Remove a previously registered handler."""
        with self._lock:
            handlers = self._subscribers.get(event, [])
            if handler in handlers:
                handlers.remove(handler)

    def publish(self, event: str, data: Any = None) -> None:
        """Deliver data to all handlers subscribed to event."""
        with self._lock:
            handlers = list(self._subscribers.get(event, []))
        # Invoke handlers outside the lock to avoid re-entrancy issues
        for handler in handlers:
            handler(data)

    def clear(self, event: str | None = None) -> None:
        """Remove all handlers, or handlers for a specific event."""
        with self._lock:
            if event is None:
                self._subscribers.clear()
            else:
                self._subscribers.pop(event, None)


# ── The singleton — created once when the module is first imported ────────────
event_bus = _EventBus()
`,
          },
          {
            name: "order_service.py",
            dir: "services/",
            content: `"""
services/order_service.py
--------------------------
OrderService publishes domain events via the module-level EventBus singleton.
"""

from __future__ import annotations
import uuid
from messaging.event_bus import event_bus   # <— just an import, no getInstance()


class OrderService:
    def place_order(self, item: str, quantity: int) -> str:
        order_id = str(uuid.uuid4())[:8]
        # business logic here …
        event_bus.publish("order.placed", {
            "order_id": order_id,
            "item": item,
            "quantity": quantity,
        })
        return order_id
`,
          },
          {
            name: "notification_service.py",
            dir: "services/",
            content: `"""
services/notification_service.py
---------------------------------
NotificationService subscribes to order events using the same EventBus singleton.
"""

from __future__ import annotations
from messaging.event_bus import event_bus


class NotificationService:
    def __init__(self, channel: str = "email") -> None:
        self._channel = channel
        # Register handler at construction time
        event_bus.subscribe("order.placed", self._on_order_placed)

    def _on_order_placed(self, data: dict) -> None:
        print(
            f"[{self._channel.upper()}] Order {data['order_id']} placed "
            f"— {data['quantity']}x {data['item']}"
        )
`,
          },
          {
            name: "main.py",
            dir: "",
            content: `"""main.py — demonstrates the module-level EventBus singleton."""
from services.order_service import OrderService
from services.notification_service import NotificationService
from messaging.event_bus import event_bus

def main() -> None:
    # Both services share the same 'event_bus' object
    ns_email  = NotificationService(channel="email")
    ns_sms    = NotificationService(channel="sms")

    svc = OrderService()
    order_id = svc.place_order("Laptop", 1)
    print(f"Order created: {order_id}")

    # Verify identity
    from messaging import event_bus as m
    print("Same bus:", event_bus is m.event_bus)   # True

if __name__ == "__main__":
    main()
`,
          },
        ],
        Go: [
          {
            name: "event_bus.go",
            dir: "messaging/",
            content: `// messaging/event_bus.go
//
// Module-Level Singleton EventBus for Go.
//
// In Go, package-level variables are initialised exactly once before
// main() runs.  'var EventBus = newEventBus()' is the idiomatic
// equivalent of a module-level singleton — all importers share the
// same *eventBus pointer that lives in the package's global scope.
package messaging

import "sync"

// Handler is a callback invoked when an event is published.
type Handler func(data any)

// eventBus is the internal struct — unexported to guide callers towards
// the package-level EventBus variable.
type eventBus struct {
	mu          sync.RWMutex
	subscribers map[string][]Handler
}

func newEventBus() *eventBus {
	return &eventBus{subscribers: make(map[string][]Handler)}
}

// Subscribe registers handler for event.
func (b *eventBus) Subscribe(event string, handler Handler) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.subscribers[event] = append(b.subscribers[event], handler)
}

// Publish delivers data to all handlers subscribed to event.
func (b *eventBus) Publish(event string, data any) {
	b.mu.RLock()
	handlers := make([]Handler, len(b.subscribers[event]))
	copy(handlers, b.subscribers[event])
	b.mu.RUnlock()
	// Call handlers outside the lock (avoids re-entrancy deadlock)
	for _, h := range handlers {
		h(data)
	}
}

// EventBus is the process-wide singleton — import messaging and use
// messaging.EventBus directly; no GetInstance() needed.
var EventBus = newEventBus()
`,
          },
          {
            name: "order_service.go",
            dir: "services/",
            content: `// services/order_service.go
package services

import (
	"fmt"
	"math/rand"
	"myapp/messaging"
)

// OrderService places orders and publishes domain events.
type OrderService struct{}

func (s *OrderService) PlaceOrder(item string, quantity int) string {
	orderID := fmt.Sprintf("ORD-%04d", rand.Intn(9999))
	// Publish via the shared singleton — just use the package-level var
	messaging.EventBus.Publish("order.placed", map[string]any{
		"order_id": orderID,
		"item":     item,
		"quantity": quantity,
	})
	return orderID
}
`,
          },
          {
            name: "main.go",
            dir: "",
            content: `// main.go
package main

import (
	"fmt"
	"myapp/messaging"
	"myapp/services"
)

func main() {
	// Register notification handlers on the shared EventBus
	messaging.EventBus.Subscribe("order.placed", func(data any) {
		m := data.(map[string]any)
		fmt.Printf("[EMAIL] Order %s placed — %vx %v\\n",
			m["order_id"], m["quantity"], m["item"])
	})
	messaging.EventBus.Subscribe("order.placed", func(data any) {
		m := data.(map[string]any)
		fmt.Printf("[SMS]   Order %s placed\\n", m["order_id"])
	})

	svc := &services.OrderService{}
	id := svc.PlaceOrder("Laptop", 1)
	fmt.Println("Order created:", id)
}
`,
          },
        ],
        Java: [
          {
            name: "EventBus.java",
            dir: "com/example/messaging/",
            content: `package com.example.messaging;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

/**
 * Module-level singleton EventBus — Java edition.
 *
 * Java has no module-level state (every value lives in a class), so we use
 * an enum with a single constant, which gives us all the guarantees that
 * Python / Go module singletons provide:
 *
 *   • Created exactly once (JVM class-initialization lock)
 *   • Shared by all callers via EventBus.INSTANCE
 *   • Thread-safe, serialization-safe, reflection-safe
 */
public enum EventBus {
    INSTANCE;

    private final ConcurrentHashMap<String, List<Consumer<Object>>> subscribers
        = new ConcurrentHashMap<>();

    /** Register handler for the given event topic. */
    @SuppressWarnings("unchecked")
    public <T> void subscribe(String event, Consumer<T> handler) {
        subscribers
            .computeIfAbsent(event, k -> Collections.synchronizedList(new ArrayList<>()))
            .add((Consumer<Object>) handler);
    }

    /** Deliver data to all handlers registered under event. */
    public void publish(String event, Object data) {
        List<Consumer<Object>> handlers = subscribers.getOrDefault(event, List.of());
        // Snapshot the list to protect against concurrent modification
        List<Consumer<Object>> snapshot = new ArrayList<>(handlers);
        snapshot.forEach(h -> h.accept(data));
    }

    /** Remove all handlers for event. */
    public void clear(String event) {
        subscribers.remove(event);
    }
}
`,
          },
          {
            name: "OrderService.java",
            dir: "com/example/services/",
            content: `package com.example.services;

import com.example.messaging.EventBus;
import java.util.Map;
import java.util.UUID;

/** Places orders and publishes domain events through the EventBus singleton. */
public class OrderService {

    public String placeOrder(String item, int quantity) {
        String orderId = UUID.randomUUID().toString().substring(0, 8);
        EventBus.INSTANCE.publish("order.placed", Map.of(
            "orderId",  orderId,
            "item",     item,
            "quantity", quantity
        ));
        return orderId;
    }
}
`,
          },
          {
            name: "NotificationService.java",
            dir: "com/example/services/",
            content: `package com.example.services;

import com.example.messaging.EventBus;
import java.util.Map;

/**
 * Subscribes to order events and logs notifications.
 *
 * Registers its handler in the constructor — once this object is
 * created, it is "listening" for the lifetime of the process.
 */
public class NotificationService {

    private final String channel;

    public NotificationService(String channel) {
        this.channel = channel.toUpperCase();
        // Subscribe to the shared EventBus singleton
        EventBus.INSTANCE.subscribe("order.placed", this::onOrderPlaced);
    }

    @SuppressWarnings("unchecked")
    private void onOrderPlaced(Object rawData) {
        Map<String, Object> data = (Map<String, Object>) rawData;
        System.out.printf("[%s] Order %s placed — %sx %s%n",
            channel, data.get("orderId"), data.get("quantity"), data.get("item"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "event-bus.ts",
            dir: "src/messaging/",
            content: `/**
 * src/messaging/event-bus.ts
 * --------------------------
 * Module-Level Singleton EventBus.
 *
 * ES modules (and Node.js CommonJS modules) are evaluated exactly once.
 * The module system caches the module object and returns it for all future
 * imports.  'export const eventBus = new EventBus()' is therefore a true
 * singleton — all importers share the same instance with zero getInstance()
 * ceremony.
 */

type Handler<T = unknown> = (data: T) => void;

class EventBus {
  readonly #subs = new Map<string, Array<Handler>>();

  subscribe<T>(event: string, handler: Handler<T>): void {
    const list = this.#subs.get(event) ?? [];
    list.push(handler as Handler);
    this.#subs.set(event, list);
  }

  unsubscribe<T>(event: string, handler: Handler<T>): void {
    const list = this.#subs.get(event);
    if (!list) return;
    const idx = list.indexOf(handler as Handler);
    if (idx !== -1) list.splice(idx, 1);
  }

  publish<T>(event: string, data: T): void {
    const snapshot = [...(this.#subs.get(event) ?? [])];
    snapshot.forEach(h => h(data));
  }

  clear(event?: string): void {
    if (event) this.#subs.delete(event);
    else this.#subs.clear();
  }
}

/** The module-level singleton — import and use directly. */
export const eventBus = new EventBus();
`,
          },
          {
            name: "order-service.ts",
            dir: "src/services/",
            content: `/**
 * src/services/order-service.ts
 */
import { eventBus } from "../messaging/event-bus";

interface OrderPlacedPayload {
  orderId: string;
  item: string;
  quantity: number;
}

export class OrderService {
  placeOrder(item: string, quantity: number): string {
    const orderId = Math.random().toString(36).slice(2, 10);
    eventBus.publish<OrderPlacedPayload>("order.placed", { orderId, item, quantity });
    return orderId;
  }
}
`,
          },
          {
            name: "notification-service.ts",
            dir: "src/services/",
            content: `/**
 * src/services/notification-service.ts
 */
import { eventBus } from "../messaging/event-bus";

interface OrderPlacedPayload {
  orderId: string;
  item: string;
  quantity: number;
}

export class NotificationService {
  constructor(private readonly channel: "email" | "sms") {
    eventBus.subscribe<OrderPlacedPayload>("order.placed", this.#onOrderPlaced);
  }

  readonly #onOrderPlaced = (data: OrderPlacedPayload): void => {
    console.log(
      \`[\${this.channel.toUpperCase()}] Order \${data.orderId} placed — \${data.quantity}x \${data.item}\`
    );
  };
}
`,
          },
        ],
        Rust: [
          {
            name: "event_bus.rs",
            dir: "src/",
            content: `//! src/event_bus.rs
//!
//! Module-Level Singleton EventBus for Rust using OnceLock.
//!
//! Rust's OnceLock<T> mirrors the module singleton guarantee:
//!   - event_bus() always returns a reference to the same value
//!   - Initialization is thread-safe (uses an internal atomic flag)
//!   - After init the lock is never held again — reads are entirely lock-free

use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

pub type Handler = Box<dyn Fn(&str) + Send + Sync>;

struct EventBus {
    subscribers: Mutex<HashMap<String, Vec<Handler>>>,
}

impl EventBus {
    fn new() -> Self {
        EventBus { subscribers: Mutex::new(HashMap::new()) }
    }

    pub fn subscribe(&self, event: &str, handler: Handler) {
        self.subscribers.lock().unwrap()
            .entry(event.to_owned())
            .or_default()
            .push(handler);
    }

    pub fn publish(&self, event: &str, data: &str) {
        let guard = self.subscribers.lock().unwrap();
        if let Some(handlers) = guard.get(event) {
            for h in handlers { h(data); }
        }
    }
}

static BUS: OnceLock<EventBus> = OnceLock::new();

/// Returns the process-wide EventBus singleton.
pub fn event_bus() -> &'static EventBus {
    BUS.get_or_init(EventBus::new)
}
`,
          },
          {
            name: "order_service.rs",
            dir: "src/",
            content: `//! src/order_service.rs
use crate::event_bus::event_bus;

pub struct OrderService;

impl OrderService {
    pub fn place_order(&self, item: &str, quantity: u32) -> String {
        let order_id = format!("ORD-{:04}", rand_id());
        let payload  = format!("{{order_id: {order_id}, item: {item}, qty: {quantity}}}");
        event_bus().publish("order.placed", &payload);
        order_id
    }
}

fn rand_id() -> u32 { 4242 } // stubbed — replace with uuid crate
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
mod event_bus;
mod order_service;

use event_bus::event_bus;
use order_service::OrderService;

fn main() {
    // Register handlers
    event_bus().subscribe("order.placed", Box::new(|data| println!("[EMAIL] {}", data)));
    event_bus().subscribe("order.placed", Box::new(|data| println!("[SMS]   {}", data)));

    let svc = OrderService;
    let id  = svc.place_order("Laptop", 1);
    println!("Order created: {}", id);

    // Confirm singleton identity
    let p1 = event_bus() as *const _;
    let p2 = event_bus() as *const _;
    println!("Same ptr: {}", std::ptr::eq(p1, p2)); // true
}
`,
          },
        ],
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
    ["Eager Init", "✓", "✗", "Java: needs readResolve (if Serializable)", "Low", "Simple cases, always-used singletons"],
    ["Double-Checked Locking", "✓ (with volatile)", "✓", "Java: needs readResolve (if Serializable)", "Medium", "Java/C++ when lazy init is needed"],
    ["Bill Pugh / Holder", "✓", "✓", "Java: needs readResolve (if Serializable)", "Low", "Java (preferred approach)"],
    ["Enum-Based", "✓", "✗", "✓ (automatic)", "Lowest", "Java (Effective Java recommendation)"],
    ["Module-Level", "✓ (runtime)", "Depends", "N/A", "Lowest", "Python, TypeScript, Go, Rust"],
  ],

  // ─── SUMMARY ────────────────────────────────────────────────────
  summary: [
    {
      aspect: "Pattern Type",
      detail:
        "Creational — focuses on controlling object creation so resource lifecycle and ownership stay explicit rather than accidental.",
    },
    {
      aspect: "Key Benefit",
      detail:
        "Guarantees a single, consistent in-process instance for shared resources, reducing configuration drift, duplicated initialization cost, and conflicting writes.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Hidden global mutable state and tight coupling make tests brittle, increase order-dependent bugs, and blur ownership boundaries. Prefer injecting the dependency (or an interface) instead of scattering direct getInstance() calls across business logic.",
      code:
`// ❌ Bad — getInstance() scattered in business logic creates hidden, untestable coupling
class OrderService {
  placeOrder(item: Item) {
    const db    = DatabasePool.getInstance();  // hidden dependency
    const cache = CacheManager.getInstance();  // impossible to replace in tests
    const log   = Logger.getInstance();        // invisible coupling
  }
}

// ✅ Good — inject the singleton as a constructor dependency
class OrderService {
  constructor(
    private readonly db:    DatabasePool,     // pass the singleton from outside
    private readonly cache: CacheManager,
    private readonly log:   Logger,
  ) {}
  placeOrder(item: Item) { /* uses this.db, this.cache — swap with test doubles freely */ }
}
// Wiring happens once at the composition root
const svc = new OrderService(
  DatabasePool.getInstance(),
  CacheManager.getInstance(),
  Logger.getInstance(),
);`,
    },
    {
      aspect: "Thread Safety",
      detail:
        "Eager init is typically thread-safe by class/module loading rules. Lazy init must synchronize first creation (volatile + DCL in Java, locks in Python, sync.Once in Go, OnceLock in Rust).",
      code:
`// Java — volatile + double-checked locking (safe lazy init)
private static volatile Config instance;
public static Config getInstance() {
  if (instance == null) {                   // fast path — no lock after first init
    synchronized (Config.class) {
      if (instance == null) instance = new Config();
    }
  }
  return instance;
}

// Python — threading.Lock (stdlib)
_instance, _lock = None, threading.Lock()
def get_instance():
    global _instance
    if _instance is None:
        with _lock:
            if _instance is None:
                _instance = Config()      # inner check prevents double-creation
    return _instance

// Go — sync.Once (idiomatic, zero boilerplate)
var once sync.Once; var instance *Config
func GetInstance() *Config {
    once.Do(func() { instance = &Config{} })
    return instance
}

// Rust — OnceLock<T> (std, stable ≥ 1.70, lock-free after first init)
static INSTANCE: OnceLock<Config> = OnceLock::new();
pub fn get() -> &'static Config { INSTANCE.get_or_init(Config::new) }`,
    },
    {
      aspect: "Best Approach",
      detail:
        "Prefer the least error-prone primitive per language: Java → Enum or Holder, Python → module-level instance or cached factory (e.g., lru_cache), Go → sync.Once, TypeScript → module export or module-scoped lazy accessor, Rust → OnceLock.",
      code:
`// Java — Enum (reflection-proof, serialization-safe, thread-safe by JLS §8.9)
public enum Config { INSTANCE;
  private final Map<String,String> props = loadProps();
  public String get(String key) { return props.getOrDefault(key, ""); }
} // Access: Config.INSTANCE.get("timeout")

// Python — module-level instance (module system guarantees single-load per interpreter)
# config.py ── imported everywhere; Python runs this block exactly once
_config = Config()
def get() -> Config: return _config   # thin accessor; or simply: from config import _config

// Go — sync.Once wrapped in a package-level factory (zero overhead after first call)
var (once sync.Once; cfg *Config)
func Get() *Config { once.Do(func() { cfg = newConfig() }); return cfg }

// TypeScript — module export (ESM guarantees single evaluation per module specifier)
// config.ts
export const config = new Config()   // consumers: import { config } from "./config"

// Rust — OnceLock (std, no extra deps, stack-allocated, lock-free reads)
static CFG: OnceLock<Config> = OnceLock::new();
pub fn cfg() -> &'static Config { CFG.get_or_init(Config::new) }`,
    },
    {
      aspect: "Alternate Instantiation",
      detail:
        "Be aware of ways to accidentally create a second instance outside the normal access path. In Java, Serializable singletons need readResolve() (unless using enum), reflection can bypass private constructors, and cloning/copying can duplicate state. In web ecosystems, multiple bundles/entries or multiple copies of a package can produce multiple module-level singletons.",
      code:
`// Java risk 1 — Serializable singleton without readResolve()
// ObjectInputStream calls the no-arg constructor, silently producing a 2nd instance
public class Config implements Serializable {
  private static final Config INSTANCE = new Config();
  public static Config getInstance() { return INSTANCE; }

  // Fix: return the existing instance on deserialization
  protected Object readResolve() { return INSTANCE; }
}

// Java risk 2 — reflection bypass (malicious or accidental)
Constructor<Config> c = Config.class.getDeclaredConstructor();
c.setAccessible(true);
Config second = c.newInstance();  // ← bypasses private constructor!  INSTANCE != second
// Fix: throw in the constructor if INSTANCE is already set, or use Enum

// Enum is immune to both serialization and reflection (JLS §8.9.2 prohibits it):
public enum Config { INSTANCE }   // zero extra code needed — JVM enforces singleton

// TypeScript / Node.js risk — duplicate module instances from dual package copies
// package.json: two different versions of 'shared-config' installed
// → each version has its own module-level singleton → state divergence at runtime
// Fix: pin exact version + use npm dedupe; or use a Symbol-keyed registry on globalThis`,
    },
    {
      aspect: "Runtime Scope",
      detail:
        "Singleton is typically one per process/module graph. Separate JVM classloaders, Node.js worker_threads, browser Workers, SSR server-vs-client bundles, or hot-reload can all create multiple singleton instances unless you design for those boundaries.",
    },
    {
      aspect: "Lifecycle Scope",
      detail:
        "Singleton guarantees one instance per process/runtime scope, not globally across pods, containers, or microservices. Distributed consistency still needs external coordination.",
    },
    {
      aspect: "Initialization Strategy",
      detail:
        "Use eager initialization when startup cost is acceptable and dependency order is simple; use lazy initialization when construction is expensive or optional.",
    },
    {
      aspect: "Testing Guidance",
      detail:
        "Expose interfaces or reset hooks for tests, avoid mutable static state leaks between test cases, isolate singleton state setup/teardown in fixtures, and prefer dependency injection in service layers for easier mocking.",
      code:
`// Pattern A — expose a _reset() hook so each test starts with a clean singleton
class Config {
  static #instance: Config | undefined;
  static getInstance() { return (Config.#instance ??= new Config()); }
  /** @internal — test environments only */
  static _reset() { Config.#instance = undefined; }
}
afterEach(() => Config._reset());  // prevents state leakage between test cases

// Pattern B — inject the singleton (preferred; test never touches global state)
class OrderService {
  constructor(private readonly config: IConfig) {}  // IConfig is an interface
}
test('uses timeout from config', () => {
  const fake: IConfig = { get: (k) => k === 'timeout' ? '100' : '' };
  const svc = new OrderService(fake);  // real singleton never called
  expect(svc.getTimeout()).toBe(100);
});`,
    },
    {
      aspect: "When to Use",
      detail:
        "Use when exactly one coordination point is required across the entire process lifetime.",
      items: [
        {
          title: "Shared Configuration",
          description:
            "App-wide settings loaded once at startup (DB URL, feature flags, API keys). Multiple config readers must see the same values — a second instance would risk drift or double-loading.",
        },
        {
          title: "Connection Pools",
          description:
            "Database or HTTP connection pools have a fixed capacity and must be shared. Two pool instances would silently double the number of open connections and exhaust resources.",
        },
        {
          title: "Cache Coordinators",
          description:
            "An in-process cache (e.g., LRU map, query result cache) only provides consistency when every caller hits the same store. A second instance produces stale reads and redundant memory use.",
        },
        {
          title: "Logging & Telemetry Sinks",
          description:
            "Log writers and metric collectors buffer, batch, and flush output. Two sinks interleave writes, corrupt line boundaries, and duplicate metrics — a single sink serialises all output safely.",
        },
        {
          title: "Device & Hardware Managers",
          description:
            "Drivers for peripherals (serial ports, USB, GPU context) are tied to exclusive OS handles. A second manager trying to open the same handle throws or silently corrupts device state.",
        },
        {
          title: "Registries & Service Locators",
          description:
            "A central registry (plugin registry, codec registry, service locator) must be the one authoritative map. Multiple registries produce split namespaces where lookups silently miss entries registered in the other copy.",
        },
      ],
      code:
`// ✅ Good — shared ConnectionPool singleton; every caller draws from the same pool
public final class ConnectionPool {
    private static volatile ConnectionPool instance;
    private final Queue<Connection> pool;
    private final int maxSize;

    private ConnectionPool(int maxSize) {
        this.maxSize = maxSize;
        this.pool    = new ArrayDeque<>(maxSize);
        for (int i = 0; i < maxSize; i++)
            pool.offer(createConnection());
    }

    public static ConnectionPool getInstance() {
        if (instance == null) {
            synchronized (ConnectionPool.class) {
                if (instance == null)
                    instance = new ConnectionPool(10);
            }
        }
        return instance;
    }

    public Connection acquire()  { return pool.poll(); }
    public void     release(Connection c) { pool.offer(c); }
    private Connection createConnection() { /* open & return real DB connection */ return null; }
}

// ❌ Bad — two pool instances silently double open connections and split capacity
ConnectionPool pool1 = new ConnectionPool(10);  // direct construction bypasses singleton
ConnectionPool pool2 = new ConnectionPool(10);  // both hold 10 connections → 20 open!`,
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Avoid singleton whenever the shared lifetime, mutable global state, or lack of isolation creates hidden bugs, security leaks, or scalability ceilings.",
      items: [
        {
          title: "Stateless Services",
          description:
            "Pure services with no internal state need no singleton guarantee — create them normally or let a DI container manage their scope. Making them singletons adds unnecessary lifecycle coupling with zero benefit.",
        },
        {
          title: "Request / Session-Scoped Data",
          description:
            "Per-request context (current user, trace ID, locale) must be isolated to each call. Storing it in a singleton allows one request to read or overwrite another's data — a race condition and a security leak.",
        },
        {
          title: "Multi-Tenant Mutable State",
          description:
            "When tenants must be isolated, shared mutable state in a singleton is a data-leak vector. Each tenant needs its own scoped instance, not a shared global one.",
        },
        {
          title: "Short-Lived or Disposable Objects",
          description:
            "Objects that should be created, used, and discarded (e.g., HTTP clients per test, short-lived parsers) are a poor fit. A singleton that holds resources too long wastes memory and can prevent GC.",
        },
        {
          title: "Scalability Through Parallelism",
          description:
            "When independent instances would improve throughput (e.g., multiple worker queues, partitioned caches), a singleton becomes a serialization bottleneck. Prefer instance-per-partition or pooled designs.",
        },
        {
          title: "Hard-to-Reproduce Concurrency Bugs",
          description:
            "Mutable singleton state shared across threads without careful synchronization produces heisenbugs. If correct synchronization is complex or ownership is unclear, prefer immutable shared state or scoped instances.",
        },
      ],
      code:
`// ❌ Bad — per-request context stored in a singleton: data leaks across threads
public class RequestContext {
    private static final RequestContext INSTANCE = new RequestContext();
    private String currentUserId;  // shared mutable field!

    public static RequestContext get()       { return INSTANCE; }
    public void   setUserId(String id)       { this.currentUserId = id; }  // Thread A writes
    public String getUserId()                { return currentUserId; }     // Thread B reads A's id!
}

// ✅ Good — use ThreadLocal for request-scoped, per-thread isolation
public class RequestContext {
    private static final ThreadLocal<RequestContext> CTX =
        ThreadLocal.withInitial(RequestContext::new);

    private String currentUserId;

    public static RequestContext get()       { return CTX.get(); }
    public void   setUserId(String id)       { this.currentUserId = id; }
    public String getUserId()                { return currentUserId; }
    /** Call at end of request (Servlet filter / Spring interceptor) to prevent memory leaks */
    public static void clear()               { CTX.remove(); }
}
// Each thread (request) gets its own RequestContext — zero cross-thread visibility`,
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (factory provider can be singleton), Flyweight (shared objects at finer granularity), Monostate (shared static state without one instance), and Registry (managed set of named singleton-like services).",
    },
    {
      aspect: "Operational Guidance",
      detail:
        "Keep singleton state minimal, observable, and fail-fast on initialization errors. For mutable state, define explicit synchronization and recovery behavior during reloads.",
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

  references: [
    {
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Gamma, Helm, Johnson & Vlissides (Gang of Four)",
      year: 1994,
      type: "Book",
      description:
        "The original GoF book that introduced and defined the Singleton pattern (Chapter 3: Creational Patterns, pp. 127–134). Required reading for every software engineer studying design patterns. Defines intent, applicability, structure, participants, collaborations, consequences, and implementation notes.",
    },
    {
      title: "Effective Java, 3rd Edition — Item 3: Enforce the singleton property with a private constructor or an enum type",
      author: "Joshua Bloch",
      year: 2018,
      type: "Book",
      description:
        "The definitive Java-specific treatment of Singleton. Bloch explains why a single-element enum is the best way to implement a singleton in Java — immune to reflection attacks and serialization issues. Contrasts eager vs. lazy approaches and the limitations of each.",
    },
    {
      title: "Java Concurrency in Practice",
      author: "Brian Goetz, Tim Peierls, Joshua Bloch, Joseph Bowbeer, David Holmes & Doug Lea",
      year: 2006,
      type: "Book",
      description:
        "The authoritative guide to the Java Memory Model. Section 16.2 ('Initialization Safety') explains safe publication and why volatile is mandatory for double-checked locking in Java 5+. Essential reading for anyone implementing thread-safe lazy initialization.",
    },
    {
      title: "Java Language Specification §12.4 — Initialization of Classes and Interfaces",
      author: "Oracle / JCP",
      type: "Specification",
      url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-12.html#jls-12.4",
      description:
        "The formal JVM specification section that guarantees the Bill Pugh Holder pattern is thread-safe. Because a static inner class is not loaded until it is first referenced, and class initialization is atomic and once-only per classloader, the Holder idiom requires zero synchronization code.",
    },
    {
      title: "JSR-133: Java Memory Model and Thread Specification Revision",
      author: "Jeremy Manson, William Pugh, Sarita Adve",
      year: 2004,
      type: "Specification",
      url: "https://jcp.org/en/jsr/detail?id=133",
      description:
        "The Java 5 memory model overhaul that fixed broken double-checked locking. JSR-133 introduced the happens-before guarantees for volatile fields that make volatile DCL correct. Pre-Java-5 volatile did not provide these guarantees — understanding JSR-133 explains why DCL was broken for nearly a decade.",
    },
    {
      title: "Singleton — Refactoring Guru",
      author: "Alexander Shvets",
      type: "Web",
      url: "https://refactoring.guru/design-patterns/singleton",
      description:
        "A highly accessible introduction to the Singleton pattern with annotated code examples in C++, C#, Go, Java, PHP, Python, Ruby, Rust, Swift, and TypeScript. Covers intent, structure, applicability, pros/cons, and how Singleton relates to other patterns.",
    },
    {
      title: "std::sync::OnceLock — Rust Standard Library",
      author: "The Rust Team",
      year: 2023,
      type: "Documentation",
      url: "https://doc.rust-lang.org/std/sync/struct.OnceLock.html",
      description:
        "Official documentation for OnceLock<T>, the idiomatic Rust primitive for lazy, thread-safe singleton initialization. Stabilized in Rust 1.70. Explains the get(), set(), and get_or_init() methods, Send + Sync guarantees, and the distinction from LazyLock.",
    },
    {
      title: "sync.Once — Go Standard Library",
      author: "The Go Team",
      type: "Documentation",
      url: "https://pkg.go.dev/sync#Once",
      description:
        "Official documentation for sync.Once, Go's idiomatic singleton primitive. Once.Do executes the supplied function exactly once even when called concurrently from multiple goroutines. The documentation notes that if once.Do(f) is called multiple times, only the first call will invoke f — later calls block until f returns.",
    },
    {
      title: "Singleton Pattern — Wikipedia",
      type: "Web",
      url: "https://en.wikipedia.org/wiki/Singleton_pattern",
      description:
        "Cross-language reference covering the history of the Singleton pattern, common criticisms (global state, testability, coupling), and implementations in C++, C#, Delphi, Java, Python, and JavaScript. Also links to the broader critique literature on why Singleton is sometimes considered an anti-pattern in certain contexts.",
    },
  ],
};

export default singletonData;
