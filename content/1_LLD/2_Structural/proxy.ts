import { PatternData } from "@/lib/patterns/types";

const proxyData: PatternData = {
  slug: "proxy",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Proxy Pattern",
  subtitle:
    "Provide a surrogate or placeholder for another object to control access, add caching, enforce security, or defer expensive initialization.",

  intent:
    "Sometimes you need to control how and when an object is accessed — add logging before every call, check permissions, cache results, or delay creation until the object is truly needed. The Proxy pattern introduces an intermediary that implements the same interface as the real object. Clients use the proxy without knowing it, and the proxy decides when (or whether) to delegate to the real object. Unlike Decorator (which adds behaviour), Proxy controls access.",

  classDiagramSvg: `<svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#px-arr); }
    .s-dash { stroke-dasharray: 5,3; }
    .s-ital { font-style: italic; }
  </style>
  <defs>
    <marker id="px-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Subject interface -->
  <rect x="155" y="10" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="240" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="240" y="42" text-anchor="middle" class="s-title s-diagram-title">Subject</text>
  <line x1="155" y1="45" x2="325" y2="45" class="s-diagram-line"/>
  <text x="165" y="58" class="s-member s-diagram-member s-ital">+request(): Response</text>
  <!-- Client -->
  <rect x="10" y="20" width="100" height="35" class="s-box s-diagram-box"/>
  <text x="60" y="42" text-anchor="middle" class="s-title s-diagram-title">Client</text>
  <!-- RealSubject -->
  <rect x="40" y="130" width="170" height="75" class="s-box s-diagram-box"/>
  <text x="125" y="148" text-anchor="middle" class="s-title s-diagram-title">RealSubject</text>
  <line x1="40" y1="152" x2="210" y2="152" class="s-diagram-line"/>
  <text x="50" y="168" class="s-member s-diagram-member">-heavyData: Data</text>
  <text x="50" y="182" class="s-member s-diagram-member">+request(): Response</text>
  <text x="50" y="196" class="s-member s-diagram-member">+expensiveOp(): void</text>
  <!-- Proxy -->
  <rect x="270" y="130" width="190" height="75" class="s-box s-diagram-box"/>
  <text x="365" y="148" text-anchor="middle" class="s-title s-diagram-title">Proxy</text>
  <line x1="270" y1="152" x2="460" y2="152" class="s-diagram-line"/>
  <text x="280" y="168" class="s-member s-diagram-member">-realSubject: RealSubject?</text>
  <text x="280" y="182" class="s-member s-diagram-member">-cache: Map&lt;K,V&gt;</text>
  <text x="280" y="196" class="s-member s-diagram-member">+request(): Response</text>
  <!-- Arrows -->
  <line x1="110" y1="38" x2="155" y2="38" class="s-arr s-diagram-arrow"/>
  <line x1="125" y1="130" x2="200" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="365" y1="130" x2="290" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="270" y1="170" x2="210" y2="170" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Client depends on the Subject interface. Both RealSubject and Proxy implement Subject. The Proxy holds a lazy reference to RealSubject, creating it only when first needed. On each request(), the Proxy can check permissions, return cached data, log the call, or delegate to the RealSubject. The Client is unaware whether it's talking to the real object or the proxy.",

  diagramComponents: [
    {
      name: "Subject (Interface)",
      description:
        "Defines the common interface that both the RealSubject and the Proxy implement. The Client programs to this interface, making the proxy transparently substitutable.",
    },
    {
      name: "RealSubject",
      description:
        "The actual object that does the real work — accessing a database, making network calls, or performing expensive computation. It's the object the Proxy controls access to.",
    },
    {
      name: "Proxy",
      description:
        "Implements the same interface as RealSubject. Holds an optional reference to the real subject and adds control logic (lazy init, caching, access checks, logging) before/after delegating to the real object.",
    },
  ],

  solutionDetail:
    "**The Problem:** A resource-intensive object shouldn't always be created upfront — it might be a large image, a database connection, or a remote service. You also need to add cross-cutting concerns (caching, logging, access control) without modifying the real object.\n\n**The Proxy Solution:** Introduce a class that implements the same interface as the real object but adds control logic.\n\n**How It Works:**\n\n1. **Define the Subject interface**: Both the real and proxy classes will implement this.\n\n2. **Implement the RealSubject**: The actual object with all its expensive or sensitive operations.\n\n3. **Implement the Proxy**: It holds a reference (often lazy) to the RealSubject and adds control logic:\n   - **Virtual Proxy**: Creates the real object only when first accessed (lazy init)\n   - **Protection Proxy**: Checks permissions before delegating\n   - **Caching Proxy**: Returns cached results for repeated calls\n   - **Logging Proxy**: Records all access for auditing\n   - **Remote Proxy**: Represents a remote object locally (RPC stubs)\n\n4. **Inject the Proxy**: Give clients the proxy instead of the real object. Since both implement the same interface, no client code changes.\n\n**Key Insight:** Proxy and Decorator look structurally identical — both wrap an object. The difference is intent: Decorator adds new behaviour, Proxy controls access. A caching proxy doesn't add new features; it optimizes access to existing ones.",

  characteristics: [
    "Same interface as the real subject — clients can't tell the difference",
    "Controls access to the real object (lazy, cached, protected, logged)",
    "Can defer creation of expensive objects until first use (virtual proxy)",
    "Structural pattern — the proxy wraps the real subject transparently",
    "Often combined with DI: inject the proxy instead of the real implementation",
    "Remote proxy enables location transparency — local object represents remote one",
    "The real subject remains unmodified — all control logic lives in the proxy",
  ],

  useCases: [
    {
      id: 1,
      title: "Image Lazy Loading",
      domain: "Web / UI",
      description:
        "A document viewer loads pages with large images. Creating all image objects upfront wastes memory for pages the user may never scroll to.",
      whySingleton:
        "A VirtualProxy implements the Image interface but only loads the actual image data when render() is called for the first time.",
      code: `class ImageProxy implements Image {
  private real?: RealImage;
  render(): void {
    if (!this.real) this.real = new RealImage(this.path);
    this.real.render();
  }
}`,
    },
    {
      id: 2,
      title: "Database Connection Pool Guard",
      domain: "Backend Infrastructure",
      description:
        "Database connections are expensive to create and limited in number. Giving raw connections to application code risks leaks and overuse.",
      whySingleton:
        "A ConnectionProxy manages checkout/release lifecycle and enforces timeouts, while the application code just uses the Connection interface.",
      code: `class ConnectionProxy implements Connection {
  query(sql: string): Result {
    const conn = this.pool.checkout();
    try { return conn.query(sql); }
    finally { this.pool.release(conn); }
  }
}`,
    },
    {
      id: 3,
      title: "API Rate Limiter",
      domain: "SaaS / Platform",
      description:
        "Downstream API calls from internal services must respect rate limits. Every service that calls the API implements its own throttling logic.",
      whySingleton:
        "A RateLimitProxy wraps the API client, tracks call counts per window, and blocks or queues requests that exceed the limit.",
      code: `class RateLimitProxy implements ApiClient {
  request(endpoint: string): Response {
    if (this.limiter.isExceeded()) throw new TooManyRequests();
    this.limiter.increment();
    return this.realClient.request(endpoint);
  }
}`,
    },
    {
      id: 4,
      title: "RBAC Protection Proxy",
      domain: "Enterprise Security",
      description:
        "Sensitive operations (delete user, export data, modify config) should only be executed by users with the correct role.",
      whySingleton:
        "A ProtectionProxy checks the caller's role before delegating to the real service, keeping authorization logic separate from business logic.",
      code: `class AdminProxy implements UserService {
  deleteUser(id: string): void {
    if (this.ctx.role !== "ADMIN") throw new Forbidden();
    this.realService.deleteUser(id);
  }
}`,
    },
    {
      id: 5,
      title: "Caching Proxy for Report Generation",
      domain: "Business Intelligence",
      description:
        "A report generation service takes 30 seconds per run. Multiple users request the same report within minutes of each other.",
      whySingleton:
        "A CachingProxy stores generated reports keyed by parameters. Subsequent identical requests return the cached PDF instantly.",
      code: `class ReportCacheProxy implements ReportService {
  generate(params: ReportParams): PDF {
    const key = hash(params);
    if (this.cache.has(key)) return this.cache.get(key)!;
    const pdf = this.realService.generate(params);
    this.cache.set(key, pdf, { ttl: 300 });
    return pdf;
  }
}`,
    },
    {
      id: 6,
      title: "gRPC Remote Proxy",
      domain: "Distributed Systems",
      description:
        "Microservices communicate over gRPC. Client code should call remote services as if they were local objects, without managing channels and serialization.",
      whySingleton:
        "A RemoteProxy implements the service interface locally but serializes arguments and sends them over gRPC, deserializing the response.",
      code: `class InventoryProxy implements InventoryService {
  checkStock(sku: string): number {
    const req = serialize({ sku });
    const resp = this.grpcChannel.call("CheckStock", req);
    return deserialize(resp).quantity;
  }
}`,
    },
    {
      id: 7,
      title: "Logging / Audit Proxy",
      domain: "Compliance / Finance",
      description:
        "Every database write operation must be logged with who, what, and when for SOX compliance. Modifying every repository class is impractical.",
      whySingleton:
        "A LoggingProxy wraps each repository, logs the operation details before/after delegating, without changing any repository code.",
      code: `class AuditProxy implements Repository {
  save(entity: Entity): void {
    this.logger.log(\`SAVE \${entity.id} by \${this.ctx.user}\`);
    this.realRepo.save(entity);
    this.logger.log(\`SAVED \${entity.id}\`);
  }
}`,
    },
    {
      id: 8,
      title: "Smart Reference for Large Objects",
      domain: "CAD / Engineering",
      description:
        "A CAD application references thousands of 3D model objects. Loading all models into memory floods RAM. Most are viewed as thumbnails only.",
      whySingleton:
        "A SmartProxy loads only metadata initially and loads the full 3D mesh data on demand when the user enters detail view.",
      code: `class ModelProxy implements Model3D {
  private mesh?: MeshData;
  getVertices(): Float32Array {
    if (!this.mesh) this.mesh = loadFromDisk(this.path);
    return this.mesh.vertices;
  }
  getThumbnail(): Image { return this.metadata.thumbnail; }
}`,
    },
    {
      id: 9,
      title: "Circuit Breaker Proxy",
      domain: "Microservices",
      description:
        "A downstream service is intermittently failing. Continuing to send requests wastes resources and degrades the caller's response time.",
      whySingleton:
        "A CircuitBreakerProxy tracks failure rates and 'opens' the circuit after a threshold, returning fast-fail responses until the service recovers.",
      code: `class CircuitBreakerProxy implements Service {
  call(req: Request): Response {
    if (this.state === "OPEN") throw new ServiceUnavailable();
    try {
      const resp = this.realService.call(req);
      this.onSuccess();
      return resp;
    } catch (e) { this.onFailure(); throw e; }
  }
}`,
    },
    {
      id: 10,
      title: "Copy-on-Write Proxy",
      domain: "Systems / OS",
      description:
        "Multiple processes share a read-only memory page. Only when one process tries to write should a private copy be created.",
      whySingleton:
        "A CopyOnWriteProxy shares the underlying data among readers. On the first write, it duplicates the data and switches to the private copy.",
      code: `class COWProxy<T> implements DataPage<T> {
  private owned = false;
  write(offset: number, value: T): void {
    if (!this.owned) {
      this.data = [...this.data];
      this.owned = true;
    }
    this.data[offset] = value;
  }
}`,
    },
    {
      id: 11,
      title: "Firewall / Network Proxy",
      domain: "Networking",
      description:
        "Internal services should only access whitelisted external URLs. Direct outbound HTTP is too permissive.",
      whySingleton:
        "A FirewallProxy implements the HttpClient interface and checks each request URL against a whitelist before forwarding.",
      code: `class FirewallProxy implements HttpClient {
  fetch(url: string): Response {
    if (!this.whitelist.allows(url)) throw new Blocked(url);
    return this.realClient.fetch(url);
  }
}`,
    },
    {
      id: 12,
      title: "Synchronization Proxy",
      domain: "Concurrent Systems",
      description:
        "A shared resource is accessed from multiple threads. Adding locking to every access site is error-prone and inconsistent.",
      whySingleton:
        "A SyncProxy wraps the resource, acquiring a lock before every method and releasing it after, providing thread-safe access transparently.",
      code: `class SyncProxy<T extends Service> implements Service {
  execute(cmd: Command): Result {
    this.mutex.lock();
    try { return this.realService.execute(cmd); }
    finally { this.mutex.unlock(); }
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Caching Proxy — API Response Cache",
      domain: "Web Backend",
      problem:
        "An API endpoint calls a slow external service (30s). Multiple clients request the same data within seconds. Without caching, each request hits the slow service independently.",
      solution:
        "A CachingProxy sits between the controller and the real service. It checks a TTL-based cache before delegating, storing results for subsequent requests.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="120" height="40" class="s-box s-diagram-box"/>
  <text x="70" y="34" text-anchor="middle" class="s-title s-diagram-title">DataService</text>
  <rect x="10" y="90" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="75" y="108" text-anchor="middle" class="s-title s-diagram-title">RealDataService</text>
  <line x1="10" y1="112" x2="140" y2="112" class="s-diagram-line"/>
  <text x="18" y="126" class="s-member s-diagram-member">+fetch(key): Data</text>
  <rect x="200" y="90" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="290" y="108" text-anchor="middle" class="s-title s-diagram-title">CachingProxy</text>
  <line x1="200" y1="112" x2="380" y2="112" class="s-diagram-line"/>
  <text x="210" y="126" class="s-member s-diagram-member">-cache: Map&lt;string, Data&gt;</text>
  <text x="210" y="138" class="s-member s-diagram-member">+fetch(key): Data</text>
</svg>`,
      code: {
        Python: `from time import time
from typing import Any

class DataService:
    def fetch(self, key: str) -> Any:
        raise NotImplementedError

class RealDataService(DataService):
    def fetch(self, key: str) -> dict:
        # Simulates a slow external call
        import time; time.sleep(0.01)
        return {"key": key, "value": 42, "source": "real"}

class CachingProxy(DataService):
    def __init__(self, real: DataService, ttl: int = 60):
        self._real = real
        self._ttl = ttl
        self._cache: dict[str, tuple[Any, float]] = {}

    def fetch(self, key: str) -> Any:
        if key in self._cache:
            data, ts = self._cache[key]
            if time() - ts < self._ttl:
                return {**data, "cached": True}
        data = self._real.fetch(key)
        self._cache[key] = (data, time())
        return data

# ── Usage ──
real = RealDataService()
proxy = CachingProxy(real, ttl=300)
print(proxy.fetch("user-42"))   # hits real service
print(proxy.fetch("user-42"))   # returns cached`,
        Go: `package main

import (
	"fmt"
	"sync"
	"time"
)

type DataService interface{ Fetch(key string) map[string]string }

type RealDataService struct{}
func (r RealDataService) Fetch(key string) map[string]string {
	time.Sleep(10 * time.Millisecond)
	return map[string]string{"key": key, "value": "42", "source": "real"}
}

type cacheEntry struct {
	data map[string]string
	ts   time.Time
}

type CachingProxy struct {
	real  DataService
	ttl   time.Duration
	mu    sync.RWMutex
	cache map[string]cacheEntry
}

func NewCachingProxy(real DataService, ttl time.Duration) *CachingProxy {
	return &CachingProxy{real: real, ttl: ttl, cache: make(map[string]cacheEntry)}
}

func (p *CachingProxy) Fetch(key string) map[string]string {
	p.mu.RLock()
	if e, ok := p.cache[key]; ok && time.Since(e.ts) < p.ttl {
		p.mu.RUnlock()
		e.data["cached"] = "true"
		return e.data
	}
	p.mu.RUnlock()
	data := p.real.Fetch(key)
	p.mu.Lock()
	p.cache[key] = cacheEntry{data, time.Now()}
	p.mu.Unlock()
	return data
}

func main() {
	proxy := NewCachingProxy(RealDataService{}, 5*time.Minute)
	fmt.Println(proxy.Fetch("user-42"))
	fmt.Println(proxy.Fetch("user-42"))
}`,
        Java: `import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

interface DataService { Map<String, String> fetch(String key); }

class RealDataService implements DataService {
    public Map<String, String> fetch(String key) {
        try { Thread.sleep(10); } catch (InterruptedException ignored) {}
        return Map.of("key", key, "value", "42", "source", "real");
    }
}

class CachingProxy implements DataService {
    private final DataService real;
    private final long ttlMs;
    private final Map<String, Map.Entry<Map<String, String>, Long>> cache = new ConcurrentHashMap<>();

    CachingProxy(DataService real, long ttlMs) { this.real = real; this.ttlMs = ttlMs; }

    public Map<String, String> fetch(String key) {
        var entry = cache.get(key);
        if (entry != null && System.currentTimeMillis() - entry.getValue() < ttlMs) {
            return entry.getKey();
        }
        var data = real.fetch(key);
        cache.put(key, Map.entry(data, System.currentTimeMillis()));
        return data;
    }
}`,
        TypeScript: `interface DataService { fetch(key: string): Record<string, unknown>; }

class RealDataService implements DataService {
  fetch(key: string) {
    return { key, value: 42, source: "real" };
  }
}

class CachingProxy implements DataService {
  private cache = new Map<string, { data: Record<string, unknown>; ts: number }>();

  constructor(private real: DataService, private ttlMs = 60_000) {}

  fetch(key: string): Record<string, unknown> {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.ts < this.ttlMs) {
      return { ...entry.data, cached: true };
    }
    const data = this.real.fetch(key);
    this.cache.set(key, { data, ts: Date.now() });
    return data;
  }
}

// ── Usage ──
const proxy = new CachingProxy(new RealDataService(), 300_000);
console.log(proxy.fetch("user-42"));
console.log(proxy.fetch("user-42")); // cached`,
        Rust: `use std::collections::HashMap;
use std::time::{Duration, Instant};

trait DataService { fn fetch(&self, key: &str) -> HashMap<String, String>; }

struct RealDataService;
impl DataService for RealDataService {
    fn fetch(&self, key: &str) -> HashMap<String, String> {
        std::thread::sleep(Duration::from_millis(10));
        HashMap::from([("key".into(), key.into()), ("value".into(), "42".into())])
    }
}

struct CachingProxy {
    real: Box<dyn DataService>,
    ttl: Duration,
    cache: HashMap<String, (HashMap<String, String>, Instant)>,
}

impl CachingProxy {
    fn new(real: Box<dyn DataService>, ttl: Duration) -> Self {
        Self { real, ttl, cache: HashMap::new() }
    }
}

impl DataService for CachingProxy {
    fn fetch(&self, key: &str) -> HashMap<String, String> {
        // Note: production code would use interior mutability
        if let Some((data, ts)) = self.cache.get(key) {
            if ts.elapsed() < self.ttl {
                let mut d = data.clone();
                d.insert("cached".into(), "true".into());
                return d;
            }
        }
        self.real.fetch(key)
    }
}

fn main() {
    let real = Box::new(RealDataService);
    let proxy = CachingProxy::new(real, Duration::from_secs(300));
    println!("{:?}", proxy.fetch("user-42"));
}`,
      },
      considerations: [
        "Thread safety — ConcurrentHashMap, RwLock, or sync.RWMutex for concurrent access",
        "Cache invalidation strategy — TTL, LRU, event-based, or manual purge",
        "Memory bounds — cap cache size to prevent OOM",
        "Stale-while-revalidate for high-traffic endpoints",
        "Consider distributed cache (Redis) for multi-instance deployments",
      ],
    },
    {
      id: 2,
      title: "Virtual Proxy — Lazy Image Loading",
      domain: "UI / Desktop Application",
      problem:
        "A document viewer displays pages with large images. Loading all images upfront takes 10+ seconds and consumes hundreds of MB of RAM for a 100-page document.",
      solution:
        "An ImageProxy implements the Image interface and loads the actual image data only when the page becomes visible (render is called for the first time).",
      classDiagramSvg: `<svg viewBox="0 0 380 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:380px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="120" y="10" width="140" height="40" class="s-box s-diagram-box"/>
  <text x="190" y="34" text-anchor="middle" class="s-title s-diagram-title">Image</text>
  <rect x="10" y="90" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="80" y="108" text-anchor="middle" class="s-title s-diagram-title">RealImage</text>
  <line x1="10" y1="112" x2="150" y2="112" class="s-diagram-line"/>
  <text x="18" y="126" class="s-member s-diagram-member">-bitmap: byte[]</text>
  <text x="18" y="138" class="s-member s-diagram-member">+render(): void</text>
  <rect x="200" y="90" width="160" height="55" class="s-box s-diagram-box"/>
  <text x="280" y="108" text-anchor="middle" class="s-title s-diagram-title">ImageProxy</text>
  <line x1="200" y1="112" x2="360" y2="112" class="s-diagram-line"/>
  <text x="210" y="126" class="s-member s-diagram-member">-real: RealImage?</text>
  <text x="210" y="138" class="s-member s-diagram-member">+render(): void</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class Image(ABC):
    @abstractmethod
    def render(self) -> str: ...

class RealImage(Image):
    def __init__(self, path: str):
        self._path = path
        self._data = self._load()

    def _load(self) -> bytes:
        print(f"Loading {self._path} from disk...")
        return b"<bitmap data>"

    def render(self) -> str:
        return f"Rendering {self._path} ({len(self._data)} bytes)"

class ImageProxy(Image):
    def __init__(self, path: str):
        self._path = path
        self._real: RealImage | None = None

    def render(self) -> str:
        if self._real is None:
            self._real = RealImage(self._path)
        return self._real.render()

# ── Usage ──
images = [ImageProxy(f"/img/page_{i}.png") for i in range(100)]
# Only page 0 is loaded
print(images[0].render())`,
        Go: `package main

import "fmt"

type Image interface{ Render() string }

type RealImage struct{ path string; data []byte }
func NewRealImage(path string) *RealImage {
	fmt.Printf("Loading %s\\n", path)
	return &RealImage{path: path, data: []byte("<bitmap>")}
}
func (r *RealImage) Render() string { return fmt.Sprintf("Render %s", r.path) }

type ImageProxy struct{ path string; real *RealImage }
func (p *ImageProxy) Render() string {
	if p.real == nil { p.real = NewRealImage(p.path) }
	return p.real.Render()
}

func main() {
	imgs := make([]Image, 100)
	for i := range imgs { imgs[i] = &ImageProxy{path: fmt.Sprintf("/img/page_%d.png", i)} }
	fmt.Println(imgs[0].Render())
}`,
        Java: `interface Image { String render(); }

class RealImage implements Image {
    private final String path;
    private final byte[] data;

    RealImage(String path) {
        this.path = path;
        System.out.println("Loading " + path);
        this.data = new byte[1024];
    }

    public String render() { return "Rendering " + path; }
}

class ImageProxy implements Image {
    private final String path;
    private RealImage real;

    ImageProxy(String path) { this.path = path; }

    public String render() {
        if (real == null) real = new RealImage(path);
        return real.render();
    }
}`,
        TypeScript: `interface Image { render(): string; }

class RealImage implements Image {
  private data: Uint8Array;
  constructor(private path: string) {
    console.log(\`Loading \${path}\`);
    this.data = new Uint8Array(1024);
  }
  render() { return \`Rendering \${this.path}\`; }
}

class ImageProxy implements Image {
  private real?: RealImage;
  constructor(private path: string) {}

  render(): string {
    if (!this.real) this.real = new RealImage(this.path);
    return this.real.render();
  }
}

// ── Usage ──
const images: Image[] = Array.from({ length: 100 }, (_, i) =>
  new ImageProxy(\`/img/page_\${i}.png\`)
);
console.log(images[0].render()); // Only page 0 loads`,
        Rust: `trait Image { fn render(&mut self) -> String; }

struct RealImage { path: String, data: Vec<u8> }
impl RealImage {
    fn new(path: &str) -> Self {
        println!("Loading {}", path);
        Self { path: path.into(), data: vec![0u8; 1024] }
    }
}
impl Image for RealImage { fn render(&mut self) -> String { format!("Render {}", self.path) } }

struct ImageProxy { path: String, real: Option<RealImage> }
impl ImageProxy {
    fn new(path: &str) -> Self { Self { path: path.into(), real: None } }
}
impl Image for ImageProxy {
    fn render(&mut self) -> String {
        if self.real.is_none() { self.real = Some(RealImage::new(&self.path)); }
        self.real.as_mut().unwrap().render()
    }
}

fn main() {
    let mut imgs: Vec<Box<dyn Image>> = (0..100)
        .map(|i| Box::new(ImageProxy::new(&format!("/img/page_{}.png", i))) as Box<dyn Image>)
        .collect();
    println!("{}", imgs[0].render());
}`,
      },
      considerations: [
        "Thread safety if render() can be called from multiple threads — use Once/sync.Once",
        "Memory management — consider releasing the real image when it goes off-screen",
        "Placeholder rendering — show a loading spinner while the real image loads",
        "Prefetching — load the next page's images while the current page is viewed",
        "Error handling — what if the image file doesn't exist?",
      ],
    },
    {
      id: 3,
      title: "Protection Proxy — Access Control",
      domain: "Enterprise / Security",
      problem:
        "An admin service exposes deleteUser(), resetPassword(), and exportData(). These should only be called by users with the ADMIN role. Scattering role checks across all methods violates SRP.",
      solution:
        "A ProtectionProxy wraps the AdminService, checking the caller's role before delegating. Non-admin calls are rejected with Forbidden.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="120" y="10" width="160" height="40" class="s-box s-diagram-box"/>
  <text x="200" y="34" text-anchor="middle" class="s-title s-diagram-title">AdminService</text>
  <rect x="10" y="90" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="95" y="108" text-anchor="middle" class="s-title s-diagram-title">RealAdminService</text>
  <line x1="10" y1="112" x2="180" y2="112" class="s-diagram-line"/>
  <text x="18" y="126" class="s-member s-diagram-member">+deleteUser(id): void</text>
  <text x="18" y="138" class="s-member s-diagram-member">+exportData(): Blob</text>
  <rect x="230" y="90" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="108" text-anchor="middle" class="s-title s-diagram-title">ProtectionProxy</text>
  <line x1="230" y1="112" x2="410" y2="112" class="s-diagram-line"/>
  <text x="238" y="126" class="s-member s-diagram-member">-ctx: SecurityContext</text>
  <text x="238" y="138" class="s-member s-diagram-member">+deleteUser(id): void</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

class Forbidden(Exception):
    pass

@dataclass
class SecurityContext:
    user_id: str
    role: str

class AdminService:
    def delete_user(self, user_id: str) -> str: ...
    def export_data(self) -> bytes: ...

class RealAdminService(AdminService):
    def delete_user(self, user_id: str) -> str:
        return f"Deleted {user_id}"
    def export_data(self) -> bytes:
        return b"<all data>"

class ProtectionProxy(AdminService):
    def __init__(self, real: AdminService, ctx: SecurityContext):
        self._real = real
        self._ctx = ctx

    def _check_admin(self) -> None:
        if self._ctx.role != "ADMIN":
            raise Forbidden(f"User {self._ctx.user_id} is not an admin")

    def delete_user(self, user_id: str) -> str:
        self._check_admin()
        return self._real.delete_user(user_id)

    def export_data(self) -> bytes:
        self._check_admin()
        return self._real.export_data()

# ── Usage ──
admin_ctx = SecurityContext("user-1", "ADMIN")
proxy = ProtectionProxy(RealAdminService(), admin_ctx)
print(proxy.delete_user("user-99"))

viewer_ctx = SecurityContext("user-2", "VIEWER")
proxy2 = ProtectionProxy(RealAdminService(), viewer_ctx)
try:
    proxy2.delete_user("user-99")
except Forbidden as e:
    print(e)`,
        Go: `package main

import (
	"errors"
	"fmt"
)

type AdminService interface {
	DeleteUser(id string) (string, error)
	ExportData() ([]byte, error)
}

type RealAdminService struct{}
func (r RealAdminService) DeleteUser(id string) (string, error) { return "Deleted " + id, nil }
func (r RealAdminService) ExportData() ([]byte, error) { return []byte("data"), nil }

type SecurityContext struct{ UserID, Role string }

type ProtectionProxy struct {
	real AdminService
	ctx  SecurityContext
}

func (p *ProtectionProxy) checkAdmin() error {
	if p.ctx.Role != "ADMIN" { return errors.New("forbidden") }
	return nil
}
func (p *ProtectionProxy) DeleteUser(id string) (string, error) {
	if err := p.checkAdmin(); err != nil { return "", err }
	return p.real.DeleteUser(id)
}
func (p *ProtectionProxy) ExportData() ([]byte, error) {
	if err := p.checkAdmin(); err != nil { return nil, err }
	return p.real.ExportData()
}

func main() {
	proxy := &ProtectionProxy{real: RealAdminService{}, ctx: SecurityContext{"u1", "ADMIN"}}
	fmt.Println(proxy.DeleteUser("u99"))
}`,
        Java: `class ProtectionProxy implements AdminService {
    private final AdminService real;
    private final SecurityContext ctx;

    ProtectionProxy(AdminService real, SecurityContext ctx) {
        this.real = real;
        this.ctx = ctx;
    }

    private void checkAdmin() {
        if (!"ADMIN".equals(ctx.role()))
            throw new SecurityException("Forbidden: " + ctx.userId());
    }

    public String deleteUser(String id) { checkAdmin(); return real.deleteUser(id); }
    public byte[] exportData() { checkAdmin(); return real.exportData(); }
}

record SecurityContext(String userId, String role) {}

interface AdminService {
    String deleteUser(String id);
    byte[] exportData();
}

class RealAdminService implements AdminService {
    public String deleteUser(String id) { return "Deleted " + id; }
    public byte[] exportData() { return "data".getBytes(); }
}`,
        TypeScript: `interface AdminService {
  deleteUser(id: string): string;
  exportData(): Uint8Array;
}

class RealAdminService implements AdminService {
  deleteUser(id: string) { return \`Deleted \${id}\`; }
  exportData() { return new Uint8Array([1, 2, 3]); }
}

class ProtectionProxy implements AdminService {
  constructor(private real: AdminService, private ctx: { role: string }) {}

  private checkAdmin() {
    if (this.ctx.role !== "ADMIN") throw new Error("Forbidden");
  }

  deleteUser(id: string): string { this.checkAdmin(); return this.real.deleteUser(id); }
  exportData(): Uint8Array { this.checkAdmin(); return this.real.exportData(); }
}

// ── Usage ──
const proxy = new ProtectionProxy(new RealAdminService(), { role: "ADMIN" });
console.log(proxy.deleteUser("user-99"));`,
        Rust: `trait AdminService {
    fn delete_user(&self, id: &str) -> Result<String, String>;
    fn export_data(&self) -> Result<Vec<u8>, String>;
}

struct RealAdminService;
impl AdminService for RealAdminService {
    fn delete_user(&self, id: &str) -> Result<String, String> { Ok(format!("Deleted {}", id)) }
    fn export_data(&self) -> Result<Vec<u8>, String> { Ok(vec![1, 2, 3]) }
}

struct ProtectionProxy { real: Box<dyn AdminService>, role: String }
impl AdminService for ProtectionProxy {
    fn delete_user(&self, id: &str) -> Result<String, String> {
        if self.role != "ADMIN" { return Err("Forbidden".into()); }
        self.real.delete_user(id)
    }
    fn export_data(&self) -> Result<Vec<u8>, String> {
        if self.role != "ADMIN" { return Err("Forbidden".into()); }
        self.real.export_data()
    }
}

fn main() {
    let proxy = ProtectionProxy { real: Box::new(RealAdminService), role: "ADMIN".into() };
    println!("{:?}", proxy.delete_user("user-99"));
}`,
      },
      considerations: [
        "Log denied attempts for security monitoring",
        "Support fine-grained permissions (per-method) not just role checks",
        "Consider using annotations/decorators instead for simpler cases",
        "Ensure the proxy can't be bypassed by accessing the real service directly (DI helps)",
        "Performance impact should be negligible — role checks are O(1)",
      ],
    },
    {
      id: 4,
      title: "Remote Proxy — Local API for Remote Service",
      domain: "Distributed Systems",
      problem:
        "Application code needs to call a remote inventory service. Directly using HTTP/gRPC client code in business logic couples it to transport details (URLs, serialization, headers).",
      solution:
        "A RemoteProxy implements the InventoryService interface locally but translates method calls into network requests internally.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="120" y="10" width="160" height="40" class="s-box s-diagram-box"/>
  <text x="200" y="34" text-anchor="middle" class="s-title s-diagram-title">InventoryService</text>
  <rect x="10" y="90" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="95" y="108" text-anchor="middle" class="s-title s-diagram-title">LocalInventory</text>
  <line x1="10" y1="112" x2="180" y2="112" class="s-diagram-line"/>
  <text x="18" y="126" class="s-member s-diagram-member">+checkStock(sku): int</text>
  <rect x="230" y="90" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="108" text-anchor="middle" class="s-title s-diagram-title">RemoteProxy</text>
  <line x1="230" y1="112" x2="410" y2="112" class="s-diagram-line"/>
  <text x="238" y="126" class="s-member s-diagram-member">-baseUrl: string</text>
  <text x="238" y="138" class="s-member s-diagram-member">+checkStock(sku): int</text>
</svg>`,
      code: {
        Python: `import json, urllib.request
from abc import ABC, abstractmethod

class InventoryService(ABC):
    @abstractmethod
    def check_stock(self, sku: str) -> int: ...

class RemoteInventoryProxy(InventoryService):
    def __init__(self, base_url: str):
        self._url = base_url

    def check_stock(self, sku: str) -> int:
        url = f"{self._url}/stock/{sku}"
        with urllib.request.urlopen(url) as resp:
            data = json.loads(resp.read())
        return data["quantity"]

# ── Usage (business logic doesn't know it's remote) ──
inventory: InventoryService = RemoteInventoryProxy("https://inventory.internal")
qty = inventory.check_stock("SKU-A100")
print(f"Stock: {qty}")`,
        Go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type InventoryService interface{ CheckStock(sku string) (int, error) }

type RemoteProxy struct{ baseURL string }

func (r *RemoteProxy) CheckStock(sku string) (int, error) {
	resp, err := http.Get(r.baseURL + "/stock/" + sku)
	if err != nil { return 0, err }
	defer resp.Body.Close()
	var result struct{ Quantity int }
	json.NewDecoder(resp.Body).Decode(&result)
	return result.Quantity, nil
}

func main() {
	var svc InventoryService = &RemoteProxy{baseURL: "https://inventory.internal"}
	qty, _ := svc.CheckStock("SKU-A100")
	fmt.Println("Stock:", qty)
}`,
        Java: `import java.net.http.*;
import java.net.URI;

interface InventoryService { int checkStock(String sku); }

class RemoteInventoryProxy implements InventoryService {
    private final String baseUrl;
    private final HttpClient client = HttpClient.newHttpClient();

    RemoteInventoryProxy(String baseUrl) { this.baseUrl = baseUrl; }

    public int checkStock(String sku) {
        try {
            var req = HttpRequest.newBuilder(URI.create(baseUrl + "/stock/" + sku)).build();
            var resp = client.send(req, HttpResponse.BodyHandlers.ofString());
            return Integer.parseInt(resp.body().trim());
        } catch (Exception e) { throw new RuntimeException(e); }
    }
}`,
        TypeScript: `interface InventoryService { checkStock(sku: string): Promise<number>; }

class RemoteInventoryProxy implements InventoryService {
  constructor(private baseUrl: string) {}

  async checkStock(sku: string): Promise<number> {
    const resp = await fetch(\`\${this.baseUrl}/stock/\${sku}\`);
    const data = await resp.json();
    return data.quantity;
  }
}

// ── Usage ──
const inventory: InventoryService = new RemoteInventoryProxy("https://inventory.internal");
inventory.checkStock("SKU-A100").then(qty => console.log("Stock:", qty));`,
        Rust: `trait InventoryService {
    fn check_stock(&self, sku: &str) -> Result<u32, String>;
}

struct RemoteProxy { base_url: String }

impl InventoryService for RemoteProxy {
    fn check_stock(&self, sku: &str) -> Result<u32, String> {
        let url = format!("{}/stock/{}", self.base_url, sku);
        // In production use reqwest
        Ok(42) // simplified
    }
}

fn main() {
    let svc: Box<dyn InventoryService> = Box::new(RemoteProxy {
        base_url: "https://inventory.internal".into(),
    });
    println!("Stock: {:?}", svc.check_stock("SKU-A100"));
}`,
      },
      considerations: [
        "Network failures — add retries with exponential backoff",
        "Timeout configuration to prevent hanging on slow responses",
        "Connection pooling for HTTP/gRPC clients within the proxy",
        "Combine with caching proxy for frequently accessed data",
        "Service discovery integration to resolve base URLs dynamically",
      ],
    },
    {
      id: 5,
      title: "Logging Proxy — Audit Trail",
      domain: "Finance / Compliance",
      problem:
        "SOX compliance requires auditing every write to the financial database — who changed what and when. Adding logging to every repository method would clutter the code and risk missing a method.",
      solution:
        "A LoggingProxy wraps each repository, logging before and after every mutation method, without modifying the repository code.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="120" y="10" width="160" height="40" class="s-box s-diagram-box"/>
  <text x="200" y="34" text-anchor="middle" class="s-title s-diagram-title">Repository</text>
  <rect x="10" y="90" width="160" height="55" class="s-box s-diagram-box"/>
  <text x="90" y="108" text-anchor="middle" class="s-title s-diagram-title">RealRepository</text>
  <line x1="10" y1="112" x2="170" y2="112" class="s-diagram-line"/>
  <text x="18" y="126" class="s-member s-diagram-member">+save(entity): void</text>
  <text x="18" y="138" class="s-member s-diagram-member">+delete(id): void</text>
  <rect x="220" y="90" width="190" height="55" class="s-box s-diagram-box"/>
  <text x="315" y="108" text-anchor="middle" class="s-title s-diagram-title">LoggingProxy</text>
  <line x1="220" y1="112" x2="410" y2="112" class="s-diagram-line"/>
  <text x="228" y="126" class="s-member s-diagram-member">-logger: AuditLogger</text>
  <text x="228" y="138" class="s-member s-diagram-member">+save(entity): void</text>
</svg>`,
      code: {
        Python: `import datetime

class AuditLogger:
    def log(self, action: str, entity_id: str, user: str) -> None:
        ts = datetime.datetime.now().isoformat()
        print(f"[AUDIT {ts}] {action} entity={entity_id} by={user}")

class Repository:
    def save(self, entity: dict) -> None: ...
    def delete(self, entity_id: str) -> None: ...

class RealRepository(Repository):
    def save(self, entity: dict) -> None:
        print(f"Saved {entity['id']} to DB")
    def delete(self, entity_id: str) -> None:
        print(f"Deleted {entity_id} from DB")

class LoggingProxy(Repository):
    def __init__(self, real: Repository, logger: AuditLogger, user: str):
        self._real = real
        self._logger = logger
        self._user = user

    def save(self, entity: dict) -> None:
        self._logger.log("SAVE", entity["id"], self._user)
        self._real.save(entity)
        self._logger.log("SAVED", entity["id"], self._user)

    def delete(self, entity_id: str) -> None:
        self._logger.log("DELETE", entity_id, self._user)
        self._real.delete(entity_id)
        self._logger.log("DELETED", entity_id, self._user)

# ── Usage ──
repo = LoggingProxy(RealRepository(), AuditLogger(), "admin@corp.com")
repo.save({"id": "TXN-001", "amount": 5000})
repo.delete("TXN-002")`,
        Go: `package main

import (
	"fmt"
	"time"
)

type Repository interface {
	Save(entity map[string]string) error
	Delete(id string) error
}

type RealRepository struct{}
func (r RealRepository) Save(e map[string]string) error { fmt.Println("Saved", e["id"]); return nil }
func (r RealRepository) Delete(id string) error { fmt.Println("Deleted", id); return nil }

type LoggingProxy struct{ real Repository; user string }
func (p *LoggingProxy) Save(e map[string]string) error {
	fmt.Printf("[AUDIT %s] SAVE %s by %s\\n", time.Now().Format(time.RFC3339), e["id"], p.user)
	return p.real.Save(e)
}
func (p *LoggingProxy) Delete(id string) error {
	fmt.Printf("[AUDIT %s] DELETE %s by %s\\n", time.Now().Format(time.RFC3339), id, p.user)
	return p.real.Delete(id)
}

func main() {
	repo := &LoggingProxy{real: RealRepository{}, user: "admin@corp.com"}
	repo.Save(map[string]string{"id": "TXN-001"})
}`,
        Java: `import java.time.Instant;

interface Repository {
    void save(String entityId, String data);
    void delete(String entityId);
}

class RealRepository implements Repository {
    public void save(String entityId, String data) { System.out.println("Saved " + entityId); }
    public void delete(String entityId) { System.out.println("Deleted " + entityId); }
}

class LoggingProxy implements Repository {
    private final Repository real;
    private final String user;

    LoggingProxy(Repository real, String user) { this.real = real; this.user = user; }

    public void save(String entityId, String data) {
        System.out.printf("[AUDIT %s] SAVE %s by %s%n", Instant.now(), entityId, user);
        real.save(entityId, data);
    }
    public void delete(String entityId) {
        System.out.printf("[AUDIT %s] DELETE %s by %s%n", Instant.now(), entityId, user);
        real.delete(entityId);
    }
}`,
        TypeScript: `interface Repository {
  save(entity: { id: string }): void;
  delete(id: string): void;
}

class RealRepository implements Repository {
  save(entity: { id: string }) { console.log(\`Saved \${entity.id}\`); }
  delete(id: string) { console.log(\`Deleted \${id}\`); }
}

class LoggingProxy implements Repository {
  constructor(private real: Repository, private user: string) {}

  save(entity: { id: string }): void {
    console.log(\`[AUDIT \${new Date().toISOString()}] SAVE \${entity.id} by \${this.user}\`);
    this.real.save(entity);
  }

  delete(id: string): void {
    console.log(\`[AUDIT \${new Date().toISOString()}] DELETE \${id} by \${this.user}\`);
    this.real.delete(id);
  }
}

// ── Usage ──
const repo: Repository = new LoggingProxy(new RealRepository(), "admin@corp.com");
repo.save({ id: "TXN-001" });
repo.delete("TXN-002");`,
        Rust: `use std::time::SystemTime;

trait Repository {
    fn save(&self, entity_id: &str, data: &str);
    fn delete(&self, entity_id: &str);
}

struct RealRepository;
impl Repository for RealRepository {
    fn save(&self, id: &str, _data: &str) { println!("Saved {}", id); }
    fn delete(&self, id: &str) { println!("Deleted {}", id); }
}

struct LoggingProxy { real: Box<dyn Repository>, user: String }
impl Repository for LoggingProxy {
    fn save(&self, id: &str, data: &str) {
        println!("[AUDIT {:?}] SAVE {} by {}", SystemTime::now(), id, self.user);
        self.real.save(id, data);
    }
    fn delete(&self, id: &str) {
        println!("[AUDIT {:?}] DELETE {} by {}", SystemTime::now(), id, self.user);
        self.real.delete(id);
    }
}

fn main() {
    let repo: Box<dyn Repository> = Box::new(LoggingProxy {
        real: Box::new(RealRepository),
        user: "admin@corp.com".into(),
    });
    repo.save("TXN-001", "{}");
}`,
      },
      considerations: [
        "Async logging to avoid blocking the business operation",
        "Structured logging (JSON) for log aggregation tools (ELK, Splunk)",
        "Don't log sensitive data (PII, passwords) — redact or mask fields",
        "Consider dynamic proxy (Java Proxy, Python __getattr__) to auto-wrap all methods",
        "Combine with protection proxy for comprehensive security (check + log)",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Start with the Virtual Proxy (lazy init) if your goal is to defer expensive creation. For caching, logging, or access control, use the corresponding specialized proxy. Use Dynamic Proxy when you need to auto-wrap many methods.",

  variants: [
    {
      id: 1,
      name: "Virtual (Lazy) Proxy",
      description:
        "Defers creation of the real object until first use. Ideal for expensive resources that may never be needed.",
      code: {
        Python: `class VirtualProxy:
    def __init__(self, factory):
        self._factory = factory
        self._real = None

    def request(self):
        if self._real is None:
            self._real = self._factory()
        return self._real.request()`,
        Go: `type VirtualProxy struct {
	factory func() RealService
	real    *RealService
	once    sync.Once
}

func (p *VirtualProxy) Request() string {
	p.once.Do(func() { r := p.factory(); p.real = &r })
	return p.real.Request()
}`,
        Java: `class VirtualProxy implements Service {
    private final Supplier<Service> factory;
    private Service real;

    VirtualProxy(Supplier<Service> factory) { this.factory = factory; }

    public String request() {
        if (real == null) real = factory.get();
        return real.request();
    }
}`,
        TypeScript: `class VirtualProxy implements Service {
  private real?: RealService;
  constructor(private factory: () => RealService) {}

  request(): string {
    if (!this.real) this.real = this.factory();
    return this.real.request();
  }
}`,
        Rust: `struct VirtualProxy<F: Fn() -> RealService> {
    factory: F,
    real: Option<RealService>,
}

impl<F: Fn() -> RealService> Service for VirtualProxy<F> {
    fn request(&mut self) -> String {
        if self.real.is_none() { self.real = Some((self.factory)()); }
        self.real.as_ref().unwrap().request()
    }
}`,
      },
      pros: [
        "Saves memory and startup time by deferring creation",
        "Transparent — same interface as the real object",
        "Works well with dependency injection frameworks",
      ],
      cons: [
        "First access has a latency spike (cold start)",
        "Thread safety requires synchronization (sync.Once, volatile, etc.)",
        "Can hide dependency problems that would be caught at startup",
      ],
    },
    {
      id: 2,
      name: "Caching Proxy",
      description:
        "Stores results of expensive operations and returns cached data for repeated identical requests within a TTL window.",
      code: {
        Python: `class CachingProxy:
    def __init__(self, real, ttl=60):
        self._real = real
        self._cache = {}
        self._ttl = ttl

    def request(self, key):
        if key in self._cache:
            data, ts = self._cache[key]
            if time.time() - ts < self._ttl:
                return data
        result = self._real.request(key)
        self._cache[key] = (result, time.time())
        return result`,
        Go: `func (p *CachingProxy) Request(key string) string {
	p.mu.RLock()
	if e, ok := p.cache[key]; ok && time.Since(e.ts) < p.ttl {
		p.mu.RUnlock()
		return e.data
	}
	p.mu.RUnlock()
	result := p.real.Request(key)
	p.mu.Lock()
	p.cache[key] = entry{result, time.Now()}
	p.mu.Unlock()
	return result
}`,
        Java: `public String request(String key) {
    var entry = cache.get(key);
    if (entry != null && !entry.isExpired(ttlMs)) return entry.data();
    var result = real.request(key);
    cache.put(key, new CacheEntry(result));
    return result;
}`,
        TypeScript: `request(key: string): string {
  const entry = this.cache.get(key);
  if (entry && Date.now() - entry.ts < this.ttlMs) return entry.data;
  const result = this.real.request(key);
  this.cache.set(key, { data: result, ts: Date.now() });
  return result;
}`,
        Rust: `fn request(&mut self, key: &str) -> String {
    if let Some((data, ts)) = self.cache.get(key) {
        if ts.elapsed() < self.ttl { return data.clone(); }
    }
    let result = self.real.request(key);
    self.cache.insert(key.to_string(), (result.clone(), Instant::now()));
    result
}`,
      },
      pros: [
        "Dramatically reduces latency for repeated requests",
        "Reduces load on expensive downstream services",
        "TTL-based expiry keeps data reasonably fresh",
      ],
      cons: [
        "Stale data risk — choose TTL carefully",
        "Memory growth — needs eviction strategy (LRU, max size)",
        "Cache invalidation is notoriously hard to get right",
      ],
    },
    {
      id: 3,
      name: "Dynamic Proxy (Reflection-based)",
      description:
        "Uses language reflection to auto-generate a proxy for any interface at runtime. Avoids writing a separate proxy class for each service.",
      code: {
        Python: `class DynamicProxy:
    def __init__(self, real, before=None, after=None):
        self._real = real
        self._before = before or (lambda *a: None)
        self._after = after or (lambda *a: None)

    def __getattr__(self, name):
        attr = getattr(self._real, name)
        if callable(attr):
            def wrapper(*args, **kwargs):
                self._before(name, args)
                result = attr(*args, **kwargs)
                self._after(name, result)
                return result
            return wrapper
        return attr

# ── Usage ──
proxy = DynamicProxy(real_service,
    before=lambda name, args: print(f"Calling {name}"),
    after=lambda name, result: print(f"{name} -> {result}"))`,
        Go: `// Go doesn't have runtime proxies, but you can use code generation
// or the reflect package for a similar effect.
// In practice, Go developers write explicit proxy structs.`,
        Java: `import java.lang.reflect.*;

Service proxy = (Service) Proxy.newProxyInstance(
    Service.class.getClassLoader(),
    new Class[]{Service.class},
    (Object p, Method method, Object[] args) -> {
        System.out.println("Before: " + method.getName());
        Object result = method.invoke(realService, args);
        System.out.println("After: " + method.getName());
        return result;
    }
);`,
        TypeScript: `function createProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop) {
      const val = Reflect.get(obj, prop);
      if (typeof val === "function") {
        return (...args: unknown[]) => {
          console.log(\`Before: \${String(prop)}\`);
          const result = val.apply(obj, args);
          console.log(\`After: \${String(prop)}\`);
          return result;
        };
      }
      return val;
    },
  });
}`,
        Rust: `// Rust doesn't have runtime reflection proxies.
// Use macros or trait blanket implementations instead.
// proc_macro can generate proxy structs at compile time.`,
      },
      pros: [
        "One proxy handles any interface — no per-service proxy classes",
        "Perfect for cross-cutting concerns (logging, timing, security)",
        "Great for frameworks (Spring AOP, Python decorators)",
      ],
      cons: [
        "Harder to debug — stack traces are less clear",
        "Performance overhead from reflection",
        "Not available in all languages (Go, Rust lack runtime reflection)",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Purpose", "Object Created", "Thread Safety", "Best For",
  ],
  comparisonRows: [
    ["Virtual Proxy", "Lazy init", "On first use", "Needs sync.Once/volatile", "Expensive to create objects"],
    ["Caching Proxy", "Cache results", "Immediately", "Needs RWMutex/ConcurrentMap", "Repeated identical requests"],
    ["Protection Proxy", "Access control", "Immediately", "Stateless — inherently safe", "Role-based security"],
    ["Remote Proxy", "Location transparency", "Immediately", "Per-connection", "RPC / microservices"],
    ["Dynamic Proxy", "Auto-wrap any interface", "At proxy creation", "Depends on handler", "Cross-cutting concerns"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Structural" },
    {
      aspect: "Key Benefit",
      detail:
        "Controls access to the real object transparently — clients use the same interface and don't know they're talking to a proxy",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Overusing proxies creates an 'onion' of wrappers that's hard to debug. Limit proxy layers and ensure each adds clear value.",
    },
    {
      aspect: "vs. Decorator",
      detail:
        "Structurally identical — both wrap an object. Decorator adds new behaviour (e.g., compression); Proxy controls access (e.g., caching, auth).",
    },
    {
      aspect: "vs. Adapter",
      detail:
        "Adapter changes the interface to match what the client expects. Proxy keeps the same interface but adds control logic.",
    },
    {
      aspect: "When to Use",
      detail:
        "Lazy loading, caching, access control, logging, remote access, or any cross-cutting concern that shouldn't contaminate the real object.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When the real object is cheap to create and access, or when you'd end up with proxies inside proxies. A single method call doesn't justify a whole proxy class.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Decorator (adds behaviour), Adapter (translates interface), Facade (simplifies subsystem), Flyweight (shares instances to save memory)",
    },
  ],

  antiPatterns: [
    {
      name: "Proxy Onion",
      description:
        "Wrapping a proxy in another proxy in another proxy — CachingProxy → LoggingProxy → ProtectionProxy → RealService. Debugging becomes a nightmare as you trace through 4 layers.",
      betterAlternative:
        "Combine multiple concerns into a single proxy class, or use a dynamic proxy with a chain of handlers (middleware pattern).",
    },
    {
      name: "Transparent Inconsistency",
      description:
        "The proxy doesn't fully implement the subject interface — some methods delegate but others throw NotImplemented. Clients can't truly substitute the proxy for the real object.",
      betterAlternative:
        "Implement ALL interface methods, even if some just delegate directly. The whole point of Proxy is transparent substitution.",
    },
    {
      name: "Proxy Doing Business Logic",
      description:
        "The proxy adds transformation, calculation, or domain rules instead of just controlling access. It becomes an invisible service layer that's hard to find.",
      betterAlternative:
        "Keep proxy logic to access control: caching, auth checks, logging, lazy init. Business logic belongs in the real subject or a domain service.",
    },
    {
      name: "Unbounded Cache Proxy",
      description:
        "A caching proxy stores every result forever without TTL or size limits. Over time it consumes all available memory and serves stale data.",
      betterAlternative:
        "Always set TTL and max cache size. Use LRU eviction. Consider cache invalidation via events or versioning.",
    },
    {
      name: "Ignoring Thread Safety",
      description:
        "A virtual proxy's lazy initialization isn't synchronized. Two threads create two RealSubject instances, wasting resources or causing bugs.",
      betterAlternative:
        "Use sync.Once (Go), volatile + double-checked locking (Java), threading.Lock (Python), or std::sync::Once (Rust) for thread-safe lazy init.",
    },
  ],
};

export default proxyData;
