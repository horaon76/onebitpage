import { PatternData } from "@/lib/patterns/types";

const decoratorData: PatternData = {
  slug: "decorator",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Decorator Pattern",
  subtitle:
    "Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.",

  intent:
    "Wrap an object inside another object that adds behavior before or after delegating to the original. Unlike inheritance (which is static and applies to the entire class), decoration is per-instance and can be stacked at runtime — enabling combinatorial flexibility without an explosion of subclasses.",

  classDiagramSvg: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#d-arr); }
  </style>
  <defs>
    <marker id="d-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Component Interface -->
  <rect x="170" y="5" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="260" y="23" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Component</text>
  <line x1="170" y1="28" x2="350" y2="28" class="s-diagram-line"/>
  <text x="180" y="47" class="s-member s-diagram-member">+operation(): Result</text>
  <!-- ConcreteComponent -->
  <rect x="10" y="100" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="95" y="118" text-anchor="middle" class="s-title s-diagram-title">ConcreteComponent</text>
  <line x1="10" y1="123" x2="180" y2="123" class="s-diagram-line"/>
  <text x="20" y="142" class="s-member s-diagram-member">+operation(): Result</text>
  <!-- BaseDecorator -->
  <rect x="240" y="100" width="200" height="65" class="s-box s-diagram-box"/>
  <text x="340" y="118" text-anchor="middle" class="s-title s-diagram-title">BaseDecorator</text>
  <line x1="240" y1="123" x2="440" y2="123" class="s-diagram-line"/>
  <text x="250" y="142" class="s-member s-diagram-member">-wrapped: Component</text>
  <text x="250" y="156" class="s-member s-diagram-member">+operation(): Result</text>
  <!-- ConcreteDecoratorA -->
  <rect x="210" y="200" width="150" height="45" class="s-box s-diagram-box"/>
  <text x="285" y="218" text-anchor="middle" class="s-title s-diagram-title">DecoratorA</text>
  <line x1="210" y1="223" x2="360" y2="223" class="s-diagram-line"/>
  <text x="220" y="238" class="s-member s-diagram-member">+operation()</text>
  <!-- ConcreteDecoratorB -->
  <rect x="370" y="200" width="150" height="45" class="s-box s-diagram-box"/>
  <text x="445" y="218" text-anchor="middle" class="s-title s-diagram-title">DecoratorB</text>
  <line x1="370" y1="223" x2="520" y2="223" class="s-diagram-line"/>
  <text x="380" y="238" class="s-member s-diagram-member">+operation()</text>
  <!-- Arrows -->
  <line x1="95" y1="100" x2="220" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="340" y1="100" x2="300" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="285" y1="200" x2="320" y2="165" class="s-arr s-diagram-arrow"/>
  <line x1="445" y1="200" x2="380" y2="165" class="s-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "The Component interface defines the contract (operation()). ConcreteComponent provides the base implementation. BaseDecorator also implements Component but holds a reference to another Component — it delegates operation() to the wrapped object. Concrete decorators (DecoratorA, DecoratorB) extend BaseDecorator and add behavior before or after the delegated call. Because every decorator is itself a Component, decorators can be stacked: DecoratorB(DecoratorA(ConcreteComponent)).",

  diagramComponents: [
    {
      name: "Component (interface)",
      description:
        "The common interface for both the real object and its decorators. Defines operation() that all participants implement. The client depends only on this interface.",
    },
    {
      name: "ConcreteComponent",
      description:
        "The base object that provides the default implementation of operation(). This is the object being wrapped. It knows nothing about decorators.",
    },
    {
      name: "BaseDecorator",
      description:
        "An abstract class that implements Component and holds a reference to a wrapped Component. Its operation() delegates to the wrapped object. Concrete decorators extend this.",
    },
    {
      name: "ConcreteDecorators (A, B)",
      description:
        "Each concrete decorator adds specific behavior (logging, caching, encryption) before or after calling super.operation(). Multiple decorators can be stacked in any order.",
    },
  ],

  solutionDetail:
    "**The Problem:** You have a class whose behavior you want to extend in multiple independent dimensions. Using inheritance would lead to a combinatorial explosion of subclasses — LoggingEncryptedCompressedStream, EncryptedCompressedStream, LoggingCompressedStream, etc.\n\n**The Decorator Solution:** Wrap the object in thin layers that each add one concern. Each wrapper implements the same interface and delegates to the wrapped object, adding its own behavior before or after.\n\n**How It Works:**\n\n1. **Define the Component interface**: The common contract for both the real object and decorators.\n\n2. **Implement ConcreteComponent**: The object that does the real work.\n\n3. **Create a BaseDecorator**: Implements Component, wraps a Component reference, delegates by default.\n\n4. **Build Concrete Decorators**: Each overrides operation(), adds its specific behavior, and calls super/wrapped.operation().\n\n5. **Stack at runtime**: `new Logging(new Encryption(new Compression(stream)))` — each layer adds one concern.\n\n**Why It Shines:** Decorator is the go-to pattern for cross-cutting concerns — logging, caching, retry, authentication, compression. It respects the Open/Closed Principle (extend without modifying) and composes in any combination at runtime.",

  characteristics: [
    "Same interface as the wrapped object — transparent to the client",
    "Stacking: apply multiple decorators in any order for combinatorial flexibility",
    "Runtime composition: unlike inheritance, decoration is decided at runtime, per-instance",
    "Each decorator has exactly one responsibility (SRP) — logging decorator only logs, caching decorator only caches",
    "Recursive composition: a decorator wraps a Component, and itself is a Component",
    "I/O streams are the textbook example — Java's InputStream/OutputStream hierarchy uses decorators extensively",
    "Heavyweight decorator chains can impact performance and make debugging stack traces harder",
  ],

  useCases: [
    {
      id: 1,
      title: "HTTP Middleware Stack",
      domain: "Backend / API",
      description:
        "An HTTP handler processes requests. Decorators add authentication, logging, rate limiting, and CORS headers — each as an independent layer wrapping the handler.",
      whySingleton:
        "Each middleware is a decorator that wraps a Handler. Stack them: RateLimit(Auth(Logging(appHandler))). Add/remove concerns without touching the handler.",
      code: `class LoggingHandler implements Handler {
  handle(req: Request): Response {
    console.log(\`→ \${req.method} \${req.path}\`);
    const resp = this.inner.handle(req);
    console.log(\`← \${resp.status}\`);
    return resp;
  }
}`,
    },
    {
      id: 2,
      title: "Data Stream Compression + Encryption",
      domain: "Data Engineering",
      description:
        "A file writer outputs bytes. Decorators add compression (gzip) and encryption (AES) as independent layers. Order matters: compress-then-encrypt or encrypt-then-compress.",
      whySingleton:
        "EncryptionDecorator and CompressionDecorator both implement OutputStream. Stack them based on requirements without changing either implementation.",
      code: `class GzipDecorator implements OutputStream {
  write(data: Buffer): void {
    this.inner.write(gzip(data));
  }
}`,
    },
    {
      id: 3,
      title: "API Response Caching",
      domain: "Backend / Performance",
      description:
        "A data service fetches results from a database. A caching decorator wraps it, returning cached results for repeated queries and delegating cache misses to the real service.",
      whySingleton:
        "CachingDecorator implements the same DataService interface. The caller doesn't know caching exists — it's transparent.",
      code: `class CachingService implements DataService {
  get(key: string): Data {
    if (this.cache.has(key)) return this.cache.get(key)!;
    const data = this.inner.get(key);
    this.cache.set(key, data);
    return data;
  }
}`,
    },
    {
      id: 4,
      title: "UI Component Styling",
      domain: "Frontend",
      description:
        "A base Button component renders a clickable element. Decorators add border, shadow, tooltip, or animation — each as a wrapper that adds visual behavior.",
      whySingleton:
        "Each visual enhancement is a decorator wrapping a UIComponent. Combine them freely: Tooltip(Shadow(Border(Button))).",
      code: `class BorderDecorator implements UIComponent {
  render(): string {
    return \`<div class="border">\${this.inner.render()}</div>\`;
  }
}`,
    },
    {
      id: 5,
      title: "Notification Channel Decoration",
      domain: "Communication Platform",
      description:
        "A notification service sends messages. Decorators add SMS, email, Slack, and push notification delivery — each decorator forwards to the next after sending through its channel.",
      whySingleton:
        "Stack notification channels: Slack(Email(SMS(baseNotifier))). Every send() triggers all channels in the chain.",
      code: `class SlackDecorator implements Notifier {
  send(msg: string): void {
    this.slackApi.post(this.channel, msg);
    this.inner.send(msg);
  }
}`,
    },
    {
      id: 6,
      title: "Retry + Timeout on API Calls",
      domain: "Microservices / Resilience",
      description:
        "An HTTP client makes requests. A RetryDecorator retries failed requests with exponential backoff. A TimeoutDecorator aborts requests exceeding a deadline. Stack both for resilience.",
      whySingleton:
        "Timeout(Retry(httpClient)): retry decorator catches errors and retries, timeout decorator wraps each attempt with a deadline.",
      code: `class RetryDecorator implements HttpClient {
  request(url: string): Response {
    for (let i = 0; i < this.maxRetries; i++) {
      try { return this.inner.request(url); }
      catch { await sleep(2 ** i * 100); }
    }
    throw new Error("Max retries exceeded");
  }
}`,
    },
    {
      id: 7,
      title: "Access Control Wrapper",
      domain: "Enterprise / Security",
      description:
        "A document repository retrieves files. An AccessControlDecorator checks user permissions before delegating to the real repository.",
      whySingleton:
        "AccessControlDecorator implements Repository and checks authorization before every get/put/delete call.",
      code: `class AccessControlRepo implements Repository {
  get(id: string, user: User): Document {
    if (!this.acl.canRead(user, id))
      throw new ForbiddenError();
    return this.inner.get(id, user);
  }
}`,
    },
    {
      id: 8,
      title: "Logging Database Queries",
      domain: "Backend / Observability",
      description:
        "A database connection executes queries. A LoggingDecorator wraps it, logging every query, execution time, and row count for observability.",
      whySingleton:
        "LoggingDecorator implements DbConnection. In production, wrap the real connection; in tests, use the unwrapped version.",
      code: `class LoggingDb implements DbConnection {
  query(sql: string): Result {
    const start = Date.now();
    const result = this.inner.query(sql);
    console.log(\`\${sql} → \${result.rows} rows (\${Date.now()-start}ms)\`);
    return result;
  }
}`,
    },
    {
      id: 9,
      title: "Request/Response Transformation",
      domain: "API Gateway",
      description:
        "An API gateway routes requests. Decorators add header injection, response compression, request signing, and payload sanitization — each as an independent transformation layer.",
      whySingleton:
        "Each transformation is a decorator wrapping the gateway handler. Enable/disable transformations via configuration.",
      code: `class HeaderInjector implements GatewayHandler {
  handle(req: Request): Response {
    req.headers["X-Request-Id"] = uuid();
    return this.inner.handle(req);
  }
}`,
    },
    {
      id: 10,
      title: "Metrics Collection",
      domain: "Observability / SRE",
      description:
        "A service handles business operations. A MetricsDecorator wraps it, emitting counters, histograms, and error rates for every operation without touching business code.",
      whySingleton:
        "MetricsDecorator implements the same service interface. Enable metrics globally by wrapping services at the composition root.",
      code: `class MetricsService implements OrderService {
  placeOrder(order: Order): Confirmation {
    this.metrics.increment("orders.attempted");
    const result = this.inner.placeOrder(order);
    this.metrics.increment("orders.succeeded");
    return result;
  }
}`,
    },
    {
      id: 11,
      title: "Input Validation Layer",
      domain: "Backend / Forms",
      description:
        "A form processor accepts user input. Decorators add XSS sanitization, length validation, and type checking — each as an independent validation layer.",
      whySingleton:
        "Sanitize(Validate(TypeCheck(processor))): each decorator validates or sanitizes before the inner processor handles the data.",
      code: `class XSSSanitizer implements FormProcessor {
  process(input: FormData): Result {
    const clean = sanitizeHTML(input);
    return this.inner.process(clean);
  }
}`,
    },
    {
      id: 12,
      title: "Feature Flag Wrapper",
      domain: "Product Engineering",
      description:
        "A feature service provides functionality. A feature-flag decorator checks if the feature is enabled before delegating, returning a default/fallback otherwise.",
      whySingleton:
        "FeatureFlagDecorator wraps any service. If the flag is off, it returns a no-op or fallback — enabling gradual rollouts without code changes.",
      code: `class FeatureFlagDecorator implements SearchService {
  search(query: string): Results {
    if (!this.flags.isEnabled("new-search"))
      return this.fallback.search(query);
    return this.inner.search(query);
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Transaction Processing Pipeline",
      domain: "Fintech",
      problem:
        "A payment processor needs optional logging, fraud detection, and encryption on transactions. Different merchants need different combinations. Subclassing would create 2³ = 8 classes.",
      solution:
        "Each concern is a decorator around the base TransactionProcessor. Stack combinations per-merchant at configuration time.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#d-e1); }
  </style>
  <defs><marker id="d-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="5" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="23" text-anchor="middle" class="s-title s-diagram-title">TransactionProcessor</text>
  <line x1="130" y1="28" x2="330" y2="28" class="s-diagram-line"/>
  <text x="140" y="45" class="s-member s-diagram-member">+process(txn): Receipt</text>
  <rect x="10" y="80" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="75" y="103" text-anchor="middle" class="s-title s-diagram-title">BaseProcessor</text>
  <rect x="160" y="80" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="225" y="103" text-anchor="middle" class="s-title s-diagram-title">FraudDecorator</text>
  <rect x="310" y="80" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="380" y="103" text-anchor="middle" class="s-title s-diagram-title">EncryptDecorator</text>
  <rect x="160" y="135" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="225" y="158" text-anchor="middle" class="s-title s-diagram-title">LogDecorator</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Transaction:
    id: str
    amount: float
    card_hash: str

@dataclass
class Receipt:
    txn_id: str
    status: str

class TransactionProcessor(ABC):
    @abstractmethod
    def process(self, txn: Transaction) -> Receipt: ...

class BaseProcessor(TransactionProcessor):
    def process(self, txn: Transaction) -> Receipt:
        return Receipt(txn_id=txn.id, status="approved")

class ProcessorDecorator(TransactionProcessor):
    def __init__(self, inner: TransactionProcessor):
        self._inner = inner
    def process(self, txn: Transaction) -> Receipt:
        return self._inner.process(txn)

class FraudDecorator(ProcessorDecorator):
    def process(self, txn: Transaction) -> Receipt:
        if txn.amount > 10000:
            return Receipt(txn_id=txn.id, status="flagged")
        return self._inner.process(txn)

class EncryptDecorator(ProcessorDecorator):
    def process(self, txn: Transaction) -> Receipt:
        txn.card_hash = f"***{txn.card_hash[-4:]}"
        return self._inner.process(txn)

class LogDecorator(ProcessorDecorator):
    def process(self, txn: Transaction) -> Receipt:
        print(f"Processing txn {txn.id}")
        result = self._inner.process(txn)
        print(f"Result: {result.status}")
        return result

# ── Stack decorators ──
processor = LogDecorator(FraudDecorator(EncryptDecorator(BaseProcessor())))
receipt = processor.process(Transaction("T1", 500.0, "4111111111111234"))
print(receipt)`,
        Go: `package main

import "fmt"

type Transaction struct{ ID string; Amount float64; CardHash string }
type Receipt struct{ TxnID, Status string }

type Processor interface { Process(txn Transaction) Receipt }

type BaseProcessor struct{}
func (b *BaseProcessor) Process(txn Transaction) Receipt {
	return Receipt{TxnID: txn.ID, Status: "approved"}
}

type FraudDecorator struct{ inner Processor }
func (f *FraudDecorator) Process(txn Transaction) Receipt {
	if txn.Amount > 10000 { return Receipt{TxnID: txn.ID, Status: "flagged"} }
	return f.inner.Process(txn)
}

type LogDecorator struct{ inner Processor }
func (l *LogDecorator) Process(txn Transaction) Receipt {
	fmt.Printf("Processing %s\\n", txn.ID)
	r := l.inner.Process(txn)
	fmt.Printf("Result: %s\\n", r.Status)
	return r
}

func main() {
	var p Processor = &LogDecorator{inner: &FraudDecorator{inner: &BaseProcessor{}}}
	receipt := p.Process(Transaction{ID: "T1", Amount: 500, CardHash: "1234"})
	fmt.Println(receipt)
}`,
        Java: `interface TransactionProcessor {
    Receipt process(Transaction txn);
}

record Transaction(String id, double amount, String cardHash) {}
record Receipt(String txnId, String status) {}

class BaseProcessor implements TransactionProcessor {
    public Receipt process(Transaction txn) {
        return new Receipt(txn.id(), "approved");
    }
}

abstract class ProcessorDecorator implements TransactionProcessor {
    protected final TransactionProcessor inner;
    ProcessorDecorator(TransactionProcessor inner) { this.inner = inner; }
}

class FraudDecorator extends ProcessorDecorator {
    FraudDecorator(TransactionProcessor inner) { super(inner); }
    public Receipt process(Transaction txn) {
        if (txn.amount() > 10000) return new Receipt(txn.id(), "flagged");
        return inner.process(txn);
    }
}

class LogDecorator extends ProcessorDecorator {
    LogDecorator(TransactionProcessor inner) { super(inner); }
    public Receipt process(Transaction txn) {
        System.out.println("Processing " + txn.id());
        var r = inner.process(txn);
        System.out.println("Result: " + r.status());
        return r;
    }
}`,
        TypeScript: `interface TransactionProcessor {
  process(txn: { id: string; amount: number; cardHash: string }): { txnId: string; status: string };
}

class BaseProcessor implements TransactionProcessor {
  process(txn: { id: string; amount: number; cardHash: string }) {
    return { txnId: txn.id, status: "approved" };
  }
}

class FraudDecorator implements TransactionProcessor {
  constructor(private inner: TransactionProcessor) {}
  process(txn: { id: string; amount: number; cardHash: string }) {
    if (txn.amount > 10000) return { txnId: txn.id, status: "flagged" };
    return this.inner.process(txn);
  }
}

class LogDecorator implements TransactionProcessor {
  constructor(private inner: TransactionProcessor) {}
  process(txn: { id: string; amount: number; cardHash: string }) {
    console.log(\`Processing \${txn.id}\`);
    const result = this.inner.process(txn);
    console.log(\`Result: \${result.status}\`);
    return result;
  }
}

// Stack
const processor: TransactionProcessor =
  new LogDecorator(new FraudDecorator(new BaseProcessor()));
console.log(processor.process({ id: "T1", amount: 500, cardHash: "1234" }));`,
        Rust: `trait Processor { fn process(&self, id: &str, amount: f64) -> String; }

struct Base;
impl Processor for Base {
    fn process(&self, id: &str, _amount: f64) -> String { format!("{}: approved", id) }
}

struct FraudCheck<T: Processor> { inner: T }
impl<T: Processor> Processor for FraudCheck<T> {
    fn process(&self, id: &str, amount: f64) -> String {
        if amount > 10000.0 { return format!("{}: flagged", id); }
        self.inner.process(id, amount)
    }
}

struct Logger<T: Processor> { inner: T }
impl<T: Processor> Processor for Logger<T> {
    fn process(&self, id: &str, amount: f64) -> String {
        println!("Processing {}", id);
        let r = self.inner.process(id, amount);
        println!("Result: {}", r);
        r
    }
}

fn main() {
    let p = Logger { inner: FraudCheck { inner: Base } };
    println!("{}", p.process("T1", 500.0));
}`,
      },
      considerations: [
        "Decorator order matters: fraud check should run before logging to avoid logging flagged transactions",
        "Each decorator is independently testable — mock the inner processor",
        "Configuration file can specify which decorators to apply per merchant",
        "Performance: deep decorator chains add overhead per transaction",
        "Consider circuit breaker decorator for external fraud detection services",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Patient Data Access Layers",
      domain: "Healthcare",
      problem:
        "A patient record service needs optional HIPAA audit logging, field-level encryption of PHI, and access control checks. Different hospital departments need different combinations.",
      solution:
        "Each compliance requirement is a decorator. Radiology might need all three; cafeteria ordering needs none. Stack decorators per department.",
      classDiagramSvg: `<svg viewBox="0 0 460 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="10" width="200" height="45" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">PatientRecordService</text>
  <line x1="130" y1="33" x2="330" y2="33" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">+getRecord(id): PatientRecord</text>
  <rect x="10" y="80" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="75" y="103" text-anchor="middle" class="s-title s-diagram-title">AuditDecorator</text>
  <rect x="160" y="80" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="103" text-anchor="middle" class="s-title s-diagram-title">EncryptDecorator</text>
  <rect x="320" y="80" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="385" y="103" text-anchor="middle" class="s-title s-diagram-title">ACLDecorator</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass, field

@dataclass
class PatientRecord:
    id: str
    name: str
    ssn: str
    diagnosis: str

class PatientService(ABC):
    @abstractmethod
    def get_record(self, patient_id: str) -> PatientRecord: ...

class RealPatientService(PatientService):
    def get_record(self, patient_id: str) -> PatientRecord:
        return PatientRecord(patient_id, "Jane Doe", "123-45-6789", "Flu")

class AuditDecorator(PatientService):
    def __init__(self, inner: PatientService):
        self._inner = inner

    def get_record(self, patient_id: str) -> PatientRecord:
        print(f"[AUDIT] Access to patient {patient_id}")
        record = self._inner.get_record(patient_id)
        print(f"[AUDIT] Record retrieved for {patient_id}")
        return record

class PHIEncryptDecorator(PatientService):
    def __init__(self, inner: PatientService):
        self._inner = inner

    def get_record(self, patient_id: str) -> PatientRecord:
        record = self._inner.get_record(patient_id)
        record.ssn = f"***-**-{record.ssn[-4:]}"
        return record

# ── Radiology department: audit + encryption ──
service = AuditDecorator(PHIEncryptDecorator(RealPatientService()))
print(service.get_record("P001"))`,
        Go: `package main

import "fmt"

type PatientRecord struct{ ID, Name, SSN, Diagnosis string }
type PatientService interface {
	GetRecord(id string) PatientRecord
}

type RealService struct{}
func (r *RealService) GetRecord(id string) PatientRecord {
	return PatientRecord{id, "Jane Doe", "123-45-6789", "Flu"}
}

type AuditDecorator struct{ inner PatientService }
func (a *AuditDecorator) GetRecord(id string) PatientRecord {
	fmt.Printf("[AUDIT] Access: %s\\n", id)
	return a.inner.GetRecord(id)
}

type EncryptDecorator struct{ inner PatientService }
func (e *EncryptDecorator) GetRecord(id string) PatientRecord {
	rec := e.inner.GetRecord(id)
	rec.SSN = "***-**-" + rec.SSN[len(rec.SSN)-4:]
	return rec
}

func main() {
	var svc PatientService = &AuditDecorator{inner: &EncryptDecorator{inner: &RealService{}}}
	fmt.Println(svc.GetRecord("P001"))
}`,
        Java: `interface PatientService {
    PatientRecord getRecord(String id);
}

record PatientRecord(String id, String name, String ssn, String diagnosis) {}

class AuditDecorator implements PatientService {
    private final PatientService inner;
    AuditDecorator(PatientService inner) { this.inner = inner; }

    public PatientRecord getRecord(String id) {
        System.out.println("[AUDIT] Access: " + id);
        return inner.getRecord(id);
    }
}

class EncryptDecorator implements PatientService {
    private final PatientService inner;
    EncryptDecorator(PatientService inner) { this.inner = inner; }

    public PatientRecord getRecord(String id) {
        var rec = inner.getRecord(id);
        return new PatientRecord(rec.id(), rec.name(),
            "***-**-" + rec.ssn().substring(rec.ssn().length()-4), rec.diagnosis());
    }
}`,
        TypeScript: `interface PatientRecord { id: string; name: string; ssn: string; diagnosis: string; }
interface PatientService { getRecord(id: string): PatientRecord; }

class RealPatientService implements PatientService {
  getRecord(id: string): PatientRecord {
    return { id, name: "Jane Doe", ssn: "123-45-6789", diagnosis: "Flu" };
  }
}

class AuditDecorator implements PatientService {
  constructor(private inner: PatientService) {}
  getRecord(id: string): PatientRecord {
    console.log(\`[AUDIT] Access: \${id}\`);
    return this.inner.getRecord(id);
  }
}

class EncryptDecorator implements PatientService {
  constructor(private inner: PatientService) {}
  getRecord(id: string): PatientRecord {
    const rec = this.inner.getRecord(id);
    return { ...rec, ssn: \`***-**-\${rec.ssn.slice(-4)}\` };
  }
}

const service: PatientService =
  new AuditDecorator(new EncryptDecorator(new RealPatientService()));
console.log(service.getRecord("P001"));`,
        Rust: `trait PatientService { fn get_record(&self, id: &str) -> PatientRecord; }

#[derive(Debug, Clone)]
struct PatientRecord { id: String, name: String, ssn: String }

struct RealService;
impl PatientService for RealService {
    fn get_record(&self, id: &str) -> PatientRecord {
        PatientRecord { id: id.into(), name: "Jane Doe".into(), ssn: "123-45-6789".into() }
    }
}

struct AuditDecorator<T: PatientService> { inner: T }
impl<T: PatientService> PatientService for AuditDecorator<T> {
    fn get_record(&self, id: &str) -> PatientRecord {
        println!("[AUDIT] Access: {}", id);
        self.inner.get_record(id)
    }
}

struct EncryptDecorator<T: PatientService> { inner: T }
impl<T: PatientService> PatientService for EncryptDecorator<T> {
    fn get_record(&self, id: &str) -> PatientRecord {
        let mut rec = self.inner.get_record(id);
        let last4 = &rec.ssn[rec.ssn.len()-4..];
        rec.ssn = format!("***-**-{}", last4);
        rec
    }
}

fn main() {
    let svc = AuditDecorator { inner: EncryptDecorator { inner: RealService } };
    println!("{:?}", svc.get_record("P001"));
}`,
      },
      considerations: [
        "HIPAA compliance: audit decorator must log before AND after access",
        "Encryption decorator should mask PHI fields (SSN, DOB) based on user role",
        "Access control checks should be the outermost decorator (fail fast)",
        "Decorator stacking per department can be configured via dependency injection",
        "Test each decorator independently with mock inner services",
      ],
    },
    {
      id: 3,
      title: "DevOps — CI/CD Pipeline Step Decoration",
      domain: "DevOps / CI-CD",
      problem:
        "A CI/CD pipeline has steps (build, test, deploy). Each step needs optional retry logic, timeout enforcement, notification, and metrics emission. Different steps need different combinations.",
      solution:
        "Each cross-cutting concern is a decorator wrapping a PipelineStep. Configuration specifies which decorators to apply to each step.",
      classDiagramSvg: `<svg viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="80" y="10" width="180" height="45" class="s-box s-diagram-box"/>
  <text x="170" y="28" text-anchor="middle" class="s-title s-diagram-title">PipelineStep</text>
  <line x1="80" y1="33" x2="260" y2="33" class="s-diagram-line"/>
  <text x="90" y="48" class="s-member s-diagram-member">+execute(ctx): StepResult</text>
  <rect x="10" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="60" y="103" text-anchor="middle" class="s-title s-diagram-title">RetryDeco</text>
  <rect x="120" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="170" y="103" text-anchor="middle" class="s-title s-diagram-title">TimeoutDeco</text>
  <rect x="230" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="280" y="103" text-anchor="middle" class="s-title s-diagram-title">NotifyDeco</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
import time

class PipelineStep(ABC):
    @abstractmethod
    def execute(self, context: dict) -> dict: ...

class BuildStep(PipelineStep):
    def execute(self, context: dict) -> dict:
        return {"status": "success", "artifact": "app.jar"}

class RetryDecorator(PipelineStep):
    def __init__(self, inner: PipelineStep, max_retries: int = 3):
        self._inner = inner
        self._max = max_retries

    def execute(self, context: dict) -> dict:
        for attempt in range(self._max):
            try:
                return self._inner.execute(context)
            except Exception as e:
                print(f"Retry {attempt + 1}: {e}")
                time.sleep(2 ** attempt)
        raise RuntimeError("Max retries exceeded")

class NotifyDecorator(PipelineStep):
    def __init__(self, inner: PipelineStep, channel: str = "#ci"):
        self._inner = inner
        self._channel = channel

    def execute(self, context: dict) -> dict:
        result = self._inner.execute(context)
        print(f"[Slack {self._channel}] Step completed: {result['status']}")
        return result

# ── Stack ──
step = NotifyDecorator(RetryDecorator(BuildStep(), max_retries=3))
print(step.execute({}))`,
        Go: `package main

import (
	"fmt"
	"time"
)

type StepResult struct{ Status, Artifact string }
type PipelineStep interface { Execute(ctx map[string]string) StepResult }

type BuildStep struct{}
func (b *BuildStep) Execute(ctx map[string]string) StepResult {
	return StepResult{Status: "success", Artifact: "app.jar"}
}

type RetryDecorator struct{ inner PipelineStep; max int }
func (r *RetryDecorator) Execute(ctx map[string]string) StepResult {
	var result StepResult
	for i := 0; i < r.max; i++ {
		result = r.inner.Execute(ctx)
		if result.Status == "success" { return result }
		time.Sleep(time.Duration(1<<i) * time.Second)
	}
	return result
}

type NotifyDecorator struct{ inner PipelineStep; channel string }
func (n *NotifyDecorator) Execute(ctx map[string]string) StepResult {
	result := n.inner.Execute(ctx)
	fmt.Printf("[%s] Step: %s\\n", n.channel, result.Status)
	return result
}

func main() {
	var step PipelineStep = &NotifyDecorator{
		inner:   &RetryDecorator{inner: &BuildStep{}, max: 3},
		channel: "#ci",
	}
	fmt.Println(step.Execute(nil))
}`,
        Java: `interface PipelineStep {
    StepResult execute(Map<String, String> ctx);
}
record StepResult(String status, String artifact) {}

class BuildStep implements PipelineStep {
    public StepResult execute(Map<String, String> ctx) {
        return new StepResult("success", "app.jar");
    }
}

class RetryDecorator implements PipelineStep {
    private final PipelineStep inner;
    private final int maxRetries;
    RetryDecorator(PipelineStep inner, int max) { this.inner = inner; this.maxRetries = max; }

    public StepResult execute(Map<String, String> ctx) {
        for (int i = 0; i < maxRetries; i++) {
            try { return inner.execute(ctx); }
            catch (Exception e) { Thread.sleep((long) Math.pow(2, i) * 1000); }
        }
        throw new RuntimeException("Max retries exceeded");
    }
}`,
        TypeScript: `interface PipelineStep {
  execute(ctx: Record<string, string>): { status: string; artifact?: string };
}

class BuildStep implements PipelineStep {
  execute() { return { status: "success", artifact: "app.jar" }; }
}

class RetryDecorator implements PipelineStep {
  constructor(private inner: PipelineStep, private maxRetries = 3) {}
  execute(ctx: Record<string, string>) {
    for (let i = 0; i < this.maxRetries; i++) {
      try { return this.inner.execute(ctx); }
      catch { /* wait 2^i seconds */ }
    }
    throw new Error("Max retries exceeded");
  }
}

class NotifyDecorator implements PipelineStep {
  constructor(private inner: PipelineStep, private channel = "#ci") {}
  execute(ctx: Record<string, string>) {
    const result = this.inner.execute(ctx);
    console.log(\`[\${this.channel}] \${result.status}\`);
    return result;
  }
}

const step: PipelineStep = new NotifyDecorator(new RetryDecorator(new BuildStep()));
console.log(step.execute({}));`,
        Rust: `use std::collections::HashMap;

trait PipelineStep { fn execute(&self, ctx: &HashMap<String, String>) -> String; }

struct BuildStep;
impl PipelineStep for BuildStep {
    fn execute(&self, _ctx: &HashMap<String, String>) -> String { "success".into() }
}

struct RetryDecorator<T: PipelineStep> { inner: T, max: usize }
impl<T: PipelineStep> PipelineStep for RetryDecorator<T> {
    fn execute(&self, ctx: &HashMap<String, String>) -> String {
        for _ in 0..self.max {
            let r = self.inner.execute(ctx);
            if r == "success" { return r; }
        }
        "failed".into()
    }
}

struct NotifyDecorator<T: PipelineStep> { inner: T, channel: String }
impl<T: PipelineStep> PipelineStep for NotifyDecorator<T> {
    fn execute(&self, ctx: &HashMap<String, String>) -> String {
        let r = self.inner.execute(ctx);
        println!("[{}] {}", self.channel, r);
        r
    }
}

fn main() {
    let step = NotifyDecorator {
        inner: RetryDecorator { inner: BuildStep, max: 3 },
        channel: "#ci".into(),
    };
    println!("{}", step.execute(&HashMap::new()));
}`,
      },
      considerations: [
        "Retry decorator should support exponential backoff and jitter",
        "Timeout decorator should cancel the step if it exceeds the deadline",
        "Notification decorator should send failure alerts with context",
        "Metrics decorator emits step duration, success rate, and retry count",
        "Config-driven: YAML pipeline definitions map to decorator chains",
      ],
    },
    {
      id: 4,
      title: "E-Commerce — Shopping Cart Price Modifiers",
      domain: "E-Commerce",
      problem:
        "A shopping cart calculates order totals. Different promotions (percentage discount, BOGO, loyalty points, free shipping) can be combined. Hard-coding combinations would be unmaintainable.",
      solution:
        "Each pricing rule is a decorator wrapping the base PriceCalculator. Stack active promotions for the current order.",
      classDiagramSvg: `<svg viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="80" y="10" width="180" height="45" class="s-box s-diagram-box"/>
  <text x="170" y="28" text-anchor="middle" class="s-title s-diagram-title">PriceCalculator</text>
  <line x1="80" y1="33" x2="260" y2="33" class="s-diagram-line"/>
  <text x="90" y="48" class="s-member s-diagram-member">+calculate(cart): Money</text>
  <rect x="10" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="60" y="103" text-anchor="middle" class="s-title s-diagram-title">DiscountDeco</text>
  <rect x="120" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="170" y="103" text-anchor="middle" class="s-title s-diagram-title">LoyaltyDeco</text>
  <rect x="230" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="280" y="103" text-anchor="middle" class="s-title s-diagram-title">FreeShipDeco</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class PriceCalculator(ABC):
    @abstractmethod
    def calculate(self, cart_items: list) -> float: ...

class BasePriceCalc(PriceCalculator):
    def calculate(self, cart_items: list) -> float:
        return sum(item["price"] * item["qty"] for item in cart_items)

class DiscountDecorator(PriceCalculator):
    def __init__(self, inner: PriceCalculator, pct: float):
        self._inner = inner
        self._pct = pct

    def calculate(self, cart_items: list) -> float:
        total = self._inner.calculate(cart_items)
        return total * (1 - self._pct / 100)

class FreeShippingDecorator(PriceCalculator):
    def __init__(self, inner: PriceCalculator, threshold: float = 50.0):
        self._inner = inner
        self._threshold = threshold

    def calculate(self, cart_items: list) -> float:
        total = self._inner.calculate(cart_items)
        if total >= self._threshold:
            print("Free shipping applied!")
        return total

# ── Stack promotions ──
calc = FreeShippingDecorator(DiscountDecorator(BasePriceCalc(), pct=10))
items = [{"price": 25.0, "qty": 3}]
print(f"Total: \${calc.calculate(items):.2f}")`,
        Go: `package main

import "fmt"

type PriceCalc interface { Calculate(items []Item) float64 }
type Item struct{ Price float64; Qty int }

type BaseCalc struct{}
func (b *BaseCalc) Calculate(items []Item) float64 {
	total := 0.0
	for _, i := range items { total += i.Price * float64(i.Qty) }
	return total
}

type DiscountDeco struct{ inner PriceCalc; pct float64 }
func (d *DiscountDeco) Calculate(items []Item) float64 {
	return d.inner.Calculate(items) * (1 - d.pct/100)
}

type FreeShipDeco struct{ inner PriceCalc; threshold float64 }
func (f *FreeShipDeco) Calculate(items []Item) float64 {
	total := f.inner.Calculate(items)
	if total >= f.threshold { fmt.Println("Free shipping!") }
	return total
}

func main() {
	var calc PriceCalc = &FreeShipDeco{
		inner: &DiscountDeco{inner: &BaseCalc{}, pct: 10},
		threshold: 50,
	}
	fmt.Printf("Total: $%.2f\\n", calc.Calculate([]Item{{25, 3}}))
}`,
        Java: `interface PriceCalculator { double calculate(List<Item> items); }
record Item(double price, int qty) {}

class BaseCalc implements PriceCalculator {
    public double calculate(List<Item> items) {
        return items.stream().mapToDouble(i -> i.price() * i.qty()).sum();
    }
}

class DiscountDecorator implements PriceCalculator {
    private final PriceCalculator inner;
    private final double pct;
    DiscountDecorator(PriceCalculator inner, double pct) { this.inner = inner; this.pct = pct; }
    public double calculate(List<Item> items) { return inner.calculate(items) * (1 - pct/100); }
}

class FreeShippingDecorator implements PriceCalculator {
    private final PriceCalculator inner;
    FreeShippingDecorator(PriceCalculator inner) { this.inner = inner; }
    public double calculate(List<Item> items) {
        double total = inner.calculate(items);
        if (total >= 50) System.out.println("Free shipping!");
        return total;
    }
}`,
        TypeScript: `interface PriceCalculator {
  calculate(items: { price: number; qty: number }[]): number;
}

class BaseCalc implements PriceCalculator {
  calculate(items: { price: number; qty: number }[]): number {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}

class DiscountDecorator implements PriceCalculator {
  constructor(private inner: PriceCalculator, private pct: number) {}
  calculate(items: { price: number; qty: number }[]): number {
    return this.inner.calculate(items) * (1 - this.pct / 100);
  }
}

class FreeShippingDecorator implements PriceCalculator {
  constructor(private inner: PriceCalculator, private threshold = 50) {}
  calculate(items: { price: number; qty: number }[]): number {
    const total = this.inner.calculate(items);
    if (total >= this.threshold) console.log("Free shipping!");
    return total;
  }
}

const calc: PriceCalculator =
  new FreeShippingDecorator(new DiscountDecorator(new BaseCalc(), 10));
console.log(\`Total: $\${calc.calculate([{ price: 25, qty: 3 }]).toFixed(2)}\`);`,
        Rust: `trait PriceCalc { fn calculate(&self, items: &[(f64, u32)]) -> f64; }

struct BaseCalc;
impl PriceCalc for BaseCalc {
    fn calculate(&self, items: &[(f64, u32)]) -> f64 {
        items.iter().map(|(p, q)| p * *q as f64).sum()
    }
}

struct DiscountDeco<T: PriceCalc> { inner: T, pct: f64 }
impl<T: PriceCalc> PriceCalc for DiscountDeco<T> {
    fn calculate(&self, items: &[(f64, u32)]) -> f64 {
        self.inner.calculate(items) * (1.0 - self.pct / 100.0)
    }
}

fn main() {
    let calc = DiscountDeco { inner: BaseCalc, pct: 10.0 };
    println!("Total: \${:.2}", calc.calculate(&[(25.0, 3)]));
}`,
      },
      considerations: [
        "Promotion order matters: percentage discount before or after loyalty points?",
        "Business rules may prohibit certain decorator combinations",
        "Price should never go below zero — add a floor check",
        "Decorator configuration should come from the promotion engine, not hard-coded",
        "Consider immutable price snapshots for audit trails",
      ],
    },
    {
      id: 5,
      title: "Gaming — Character Buff/Debuff System",
      domain: "Gaming",
      problem:
        "A game character has base stats (attack, defense, speed). Buffs and debuffs modify stats dynamically: a fire enchantment adds +10 attack, a curse reduces defense by 20%. Effects stack and expire.",
      solution:
        "Each buff/debuff is a decorator wrapping CharacterStats. Active effects are stacked; expired effects are removed from the chain.",
      classDiagramSvg: `<svg viewBox="0 0 340 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="80" y="10" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="170" y="28" text-anchor="middle" class="s-title s-diagram-title">CharacterStats</text>
  <line x1="80" y1="33" x2="260" y2="33" class="s-diagram-line"/>
  <text x="90" y="48" class="s-member s-diagram-member">+attack(): int +defense(): int</text>
  <rect x="10" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="60" y="103" text-anchor="middle" class="s-title s-diagram-title">BaseStats</text>
  <rect x="120" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="170" y="103" text-anchor="middle" class="s-title s-diagram-title">FireBuff</text>
  <rect x="230" y="80" width="100" height="36" class="s-box s-diagram-box"/>
  <text x="280" y="103" text-anchor="middle" class="s-title s-diagram-title">CurseDebuff</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class CharacterStats(ABC):
    @abstractmethod
    def attack(self) -> int: ...
    @abstractmethod
    def defense(self) -> int: ...
    @abstractmethod
    def speed(self) -> int: ...

class BaseStats(CharacterStats):
    def __init__(self, atk: int, dfn: int, spd: int):
        self._atk, self._dfn, self._spd = atk, dfn, spd
    def attack(self) -> int: return self._atk
    def defense(self) -> int: return self._dfn
    def speed(self) -> int: return self._spd

class StatModifier(CharacterStats):
    def __init__(self, inner: CharacterStats):
        self._inner = inner
    def attack(self) -> int: return self._inner.attack()
    def defense(self) -> int: return self._inner.defense()
    def speed(self) -> int: return self._inner.speed()

class FireEnchantment(StatModifier):
    def attack(self) -> int: return self._inner.attack() + 10
    def speed(self) -> int: return self._inner.speed() + 5

class CurseDebuff(StatModifier):
    def defense(self) -> int: return int(self._inner.defense() * 0.8)

# ── Stack buffs ──
stats: CharacterStats = CurseDebuff(FireEnchantment(BaseStats(50, 40, 30)))
print(f"ATK={stats.attack()} DEF={stats.defense()} SPD={stats.speed()}")
# ATK=60 DEF=32 SPD=35`,
        Go: `package main

import "fmt"

type CharacterStats interface {
	Attack() int
	Defense() int
	Speed() int
}

type BaseStats struct{ Atk, Def, Spd int }
func (b *BaseStats) Attack() int  { return b.Atk }
func (b *BaseStats) Defense() int { return b.Def }
func (b *BaseStats) Speed() int   { return b.Spd }

type FireBuff struct{ inner CharacterStats }
func (f *FireBuff) Attack() int  { return f.inner.Attack() + 10 }
func (f *FireBuff) Defense() int { return f.inner.Defense() }
func (f *FireBuff) Speed() int   { return f.inner.Speed() + 5 }

type CurseDebuff struct{ inner CharacterStats }
func (c *CurseDebuff) Attack() int  { return c.inner.Attack() }
func (c *CurseDebuff) Defense() int { return int(float64(c.inner.Defense()) * 0.8) }
func (c *CurseDebuff) Speed() int   { return c.inner.Speed() }

func main() {
	var stats CharacterStats = &CurseDebuff{inner: &FireBuff{inner: &BaseStats{50, 40, 30}}}
	fmt.Printf("ATK=%d DEF=%d SPD=%d\\n", stats.Attack(), stats.Defense(), stats.Speed())
}`,
        Java: `interface CharacterStats { int attack(); int defense(); int speed(); }

record BaseStats(int atk, int def, int spd) implements CharacterStats {
    public int attack() { return atk; }
    public int defense() { return def; }
    public int speed() { return spd; }
}

class FireBuff implements CharacterStats {
    private final CharacterStats inner;
    FireBuff(CharacterStats inner) { this.inner = inner; }
    public int attack() { return inner.attack() + 10; }
    public int defense() { return inner.defense(); }
    public int speed() { return inner.speed() + 5; }
}

class CurseDebuff implements CharacterStats {
    private final CharacterStats inner;
    CurseDebuff(CharacterStats inner) { this.inner = inner; }
    public int attack() { return inner.attack(); }
    public int defense() { return (int)(inner.defense() * 0.8); }
    public int speed() { return inner.speed(); }
}`,
        TypeScript: `interface CharacterStats { attack(): number; defense(): number; speed(): number; }

class BaseStats implements CharacterStats {
  constructor(private atk: number, private def: number, private spd: number) {}
  attack() { return this.atk; }
  defense() { return this.def; }
  speed() { return this.spd; }
}

class FireBuff implements CharacterStats {
  constructor(private inner: CharacterStats) {}
  attack() { return this.inner.attack() + 10; }
  defense() { return this.inner.defense(); }
  speed() { return this.inner.speed() + 5; }
}

class CurseDebuff implements CharacterStats {
  constructor(private inner: CharacterStats) {}
  attack() { return this.inner.attack(); }
  defense() { return Math.floor(this.inner.defense() * 0.8); }
  speed() { return this.inner.speed(); }
}

const stats: CharacterStats = new CurseDebuff(new FireBuff(new BaseStats(50, 40, 30)));
console.log(\`ATK=\${stats.attack()} DEF=\${stats.defense()} SPD=\${stats.speed()}\`);`,
        Rust: `trait Stats { fn attack(&self) -> i32; fn defense(&self) -> i32; fn speed(&self) -> i32; }

struct Base { atk: i32, def: i32, spd: i32 }
impl Stats for Base {
    fn attack(&self) -> i32 { self.atk }
    fn defense(&self) -> i32 { self.def }
    fn speed(&self) -> i32 { self.spd }
}

struct FireBuff<T: Stats> { inner: T }
impl<T: Stats> Stats for FireBuff<T> {
    fn attack(&self) -> i32 { self.inner.attack() + 10 }
    fn defense(&self) -> i32 { self.inner.defense() }
    fn speed(&self) -> i32 { self.inner.speed() + 5 }
}

struct Curse<T: Stats> { inner: T }
impl<T: Stats> Stats for Curse<T> {
    fn attack(&self) -> i32 { self.inner.attack() }
    fn defense(&self) -> i32 { (self.inner.defense() as f64 * 0.8) as i32 }
    fn speed(&self) -> i32 { self.inner.speed() }
}

fn main() {
    let s = Curse { inner: FireBuff { inner: Base { atk: 50, def: 40, spd: 30 } } };
    println!("ATK={} DEF={} SPD={}", s.attack(), s.defense(), s.speed());
}`,
      },
      considerations: [
        "Buff expiration: decorators need a mechanism to remove themselves from the chain",
        "Stack ordering matters: additive buffs before multiplicative debuffs produce different results",
        "Performance: real-time games need fast stat calculation — deep chains may need caching",
        "Visual indicators: each buff decorator can also provide an icon/color for the UI",
        "Consider a buff manager that maintains the decorator chain and handles expiration",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "The classic OOP Decorator with a base decorator class is the standard approach. It's clear, well-understood, and works in all OO languages. Use functional composition when decorating single-method interfaces or middleware pipelines.",

  variants: [
    {
      id: 1,
      name: "Classic OOP Decorator",
      description:
        "A base decorator class implements the component interface and delegates to the wrapped component. Concrete decorators extend the base and override specific methods to add behavior.",
      code: {
        Python: `class BaseDecorator(Component):
    def __init__(self, wrapped: Component):
        self._wrapped = wrapped
    def operation(self) -> str:
        return self._wrapped.operation()

class LoggingDecorator(BaseDecorator):
    def operation(self) -> str:
        print("Before")
        result = self._wrapped.operation()
        print("After")
        return result`,
        Go: `type Decorator struct{ inner Component }
func (d *Decorator) Operation() string { return d.inner.Operation() }

type LoggingDecorator struct{ inner Component }
func (l *LoggingDecorator) Operation() string {
	fmt.Println("Before")
	r := l.inner.Operation()
	fmt.Println("After")
	return r
}`,
        Java: `abstract class BaseDecorator implements Component {
    protected final Component wrapped;
    BaseDecorator(Component wrapped) { this.wrapped = wrapped; }
    public String operation() { return wrapped.operation(); }
}

class LoggingDecorator extends BaseDecorator {
    LoggingDecorator(Component w) { super(w); }
    public String operation() {
        System.out.println("Before");
        return super.operation();
    }
}`,
        TypeScript: `class BaseDecorator implements Component {
  constructor(protected wrapped: Component) {}
  operation(): string { return this.wrapped.operation(); }
}

class LoggingDecorator extends BaseDecorator {
  operation(): string {
    console.log("Before");
    const result = this.wrapped.operation();
    console.log("After");
    return result;
  }
}`,
        Rust: `struct LoggingDecorator<T: Component> { inner: T }
impl<T: Component> Component for LoggingDecorator<T> {
    fn operation(&self) -> String {
        println!("Before");
        let r = self.inner.operation();
        println!("After");
        r
    }
}`,
      },
      pros: [
        "Well-understood and documented — most developers recognize it immediately",
        "Clear class hierarchy shows the decorator chain",
        "IDE support: autocomplete, refactoring tools work out of the box",
      ],
      cons: [
        "Verbose — each decorator needs a full class",
        "Wide interfaces: decorator must implement all methods even if it only modifies one",
        "Deep inheritance chains can make debugging harder",
      ],
    },
    {
      id: 2,
      name: "Functional Composition",
      description:
        "For single-method interfaces, use higher-order functions that wrap the original function. Each wrapper adds behavior before/after the call. Common in middleware stacks (Express.js, Redux).",
      code: {
        Python: `from typing import Callable

Handler = Callable[[str], str]

def with_logging(handler: Handler) -> Handler:
    def wrapper(request: str) -> str:
        print(f"→ {request}")
        result = handler(request)
        print(f"← {result}")
        return result
    return wrapper

def with_auth(handler: Handler) -> Handler:
    def wrapper(request: str) -> str:
        if "token" not in request:
            return "401 Unauthorized"
        return handler(request)
    return wrapper

# Stack decorators
app = with_logging(with_auth(lambda req: f"200 OK: {req}"))
print(app("token:ABC"))`,
        Go: `type Handler func(string) string

func withLogging(h Handler) Handler {
	return func(req string) string {
		fmt.Println("→", req)
		res := h(req)
		fmt.Println("←", res)
		return res
	}
}

func withAuth(h Handler) Handler {
	return func(req string) string {
		if !strings.Contains(req, "token") { return "401" }
		return h(req)
	}
}`,
        Java: `// Java: use UnaryOperator as a functional decorator
Function<String, String> app = s -> "200 OK: " + s;
app = withLogging(withAuth(app));

static Function<String, String> withLogging(Function<String, String> h) {
    return req -> { System.out.println("→ " + req); return h.apply(req); };
}`,
        TypeScript: `type Handler = (req: string) => string;

const withLogging = (h: Handler): Handler => (req) => {
  console.log(\`→ \${req}\`);
  const res = h(req);
  console.log(\`← \${res}\`);
  return res;
};

const withAuth = (h: Handler): Handler => (req) =>
  req.includes("token") ? h(req) : "401";

const app = withLogging(withAuth((req) => \`200 OK: \${req}\`));`,
        Rust: `fn with_logging(handler: impl Fn(&str) -> String + 'static) -> Box<dyn Fn(&str) -> String> {
    Box::new(move |req| {
        println!("→ {}", req);
        let res = handler(req);
        println!("← {}", res);
        res
    })
}`,
      },
      pros: [
        "Minimal boilerplate — just functions wrapping functions",
        "Natural fit for middleware stacks in web frameworks",
        "Easy to compose: pipe(), compose(), or reduce() to build chains",
      ],
      cons: [
        "Only works for single-method interfaces",
        "Debugging: anonymous function chains make stack traces harder to read",
        "Sharing state between decorators requires closures or external state",
      ],
    },
    {
      id: 3,
      name: "Proxy-Based Decorator (Dynamic)",
      description:
        "Use language-level proxies or reflection to intercept method calls dynamically. No need to implement every method — undecorated methods pass through automatically. Works in JavaScript (Proxy), Python (__getattr__), Java (InvocationHandler).",
      code: {
        Python: `class DynamicDecorator:
    def __init__(self, wrapped, before=None, after=None):
        self._wrapped = wrapped
        self._before = before or (lambda *a: None)
        self._after = after or (lambda r: r)

    def __getattr__(self, name):
        attr = getattr(self._wrapped, name)
        if callable(attr):
            def wrapper(*args, **kwargs):
                self._before(name, *args)
                result = attr(*args, **kwargs)
                return self._after(result)
            return wrapper
        return attr

# Usage: automatically decorates ALL methods
logged = DynamicDecorator(service, before=lambda m, *a: print(f"Call: {m}"))`,
        Go: `// Go: no built-in proxy — use code generation or interface embedding
// struct embedding delegates unoverridden methods automatically
type LoggingMiddleware struct {
	Service // embedded interface — all methods pass through
}
func (l *LoggingMiddleware) SpecificMethod() {
	fmt.Println("intercepted")
	l.Service.SpecificMethod()
}`,
        Java: `import java.lang.reflect.*;

Object proxy = Proxy.newProxyInstance(
    service.getClass().getClassLoader(),
    service.getClass().getInterfaces(),
    (Object p, Method method, Object[] args) -> {
        System.out.println("Before: " + method.getName());
        Object result = method.invoke(service, args);
        System.out.println("After: " + method.getName());
        return result;
    }
);`,
        TypeScript: `function createLoggingProxy<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop) {
      const value = Reflect.get(obj, prop);
      if (typeof value === "function") {
        return (...args: any[]) => {
          console.log(\`Call: \${String(prop)}\`);
          return value.apply(obj, args);
        };
      }
      return value;
    },
  });
}

const logged = createLoggingProxy(service);
logged.anyMethod(); // automatically logged`,
        Rust: `// Rust: no built-in dynamic proxy
// Use macro-based code generation for similar effects
// Or use trait objects with blanket implementations
// Example with a trait:
trait Logged: Service {
    fn log_call(&self, method: &str) { println!("Call: {}", method); }
}`,
      },
      pros: [
        "Automatic — decorates all methods without implementing each one",
        "Dynamic — add/remove decoration at runtime",
        "Less code than traditional decorator for wide interfaces",
      ],
      cons: [
        "Type safety: proxies may bypass compile-time type checking",
        "Performance: reflection adds overhead per method call",
        "Harder to debug — proxy interception is invisible in code",
        "Not available in all languages (Rust, Go lack dynamic proxies)",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Interface Width", "Boilerplate", "Type Safety", "Best For",
  ],
  comparisonRows: [
    ["Classic OOP", "Any", "Medium-High", "Full", "Standard cross-cutting concerns"],
    ["Functional", "Single-method", "Minimal", "Full", "Middleware stacks, pipelines"],
    ["Proxy-Based", "Any (auto)", "Minimal", "Lower", "Wide interfaces, AOP-style decoration"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Structural" },
    {
      aspect: "Key Benefit",
      detail:
        "Add responsibilities to objects dynamically without subclassing — enables combinatorial flexibility for cross-cutting concerns",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Deep decorator chains with no visibility — debugging 10 nested wrappers is painful. Keep chains shallow and log each decorator.",
    },
    {
      aspect: "vs. Adapter",
      detail:
        "Decorator preserves the same interface and adds behavior; Adapter changes the interface to make incompatible classes work together",
    },
    {
      aspect: "vs. Proxy",
      detail:
        "Decorator adds new behavior; Proxy controls access to the same behavior (lazy loading, caching, security)",
    },
    {
      aspect: "When to Use",
      detail:
        "Cross-cutting concerns (logging, caching, retry, auth), optional features, runtime-configurable behavior, I/O streams",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When configuration suffices — if a boolean flag can enable/disable the behavior, a decorator may be over-engineering",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Composite (tree structure vs. linear chain), Strategy (swap whole algorithms vs. layering concerns), Chain of Responsibility (similar chaining but for handling requests)",
    },
  ],

  antiPatterns: [
    {
      name: "Decorator Explosion",
      description:
        "Creating too many tiny decorators (one per log message, one per metric) that individually do almost nothing. The overhead of managing and debugging the chain exceeds the benefit.",
      betterAlternative:
        "Combine closely related concerns into one decorator. A single ObservabilityDecorator that logs, emits metrics, and traces is better than three separate decorators.",
    },
    {
      name: "Order-Dependent Stacking Without Documentation",
      description:
        "Decorators that produce different results depending on stacking order, but the required order isn't documented. New developers stack them wrong and get subtle bugs.",
      betterAlternative:
        "Document the required stacking order. Better yet, use a builder or factory method that constructs the chain in the correct order.",
    },
    {
      name: "State Mutation in Decorators",
      description:
        "Decorators that modify the wrapped object's state rather than just adding behavior. This creates hidden side effects that are hard to reason about.",
      betterAlternative:
        "Decorators should add behavior (before/after logic), not mutate the wrapped object. If state changes are needed, make them explicit in the return value.",
    },
    {
      name: "Decorating Instead of Composing",
      description:
        "Using decorators when the behaviors aren't truly cross-cutting — they're core business logic that should be composed through normal class collaboration.",
      betterAlternative:
        "Use decorator for infrastructure concerns (logging, caching, auth). Use composition, Strategy, or Template Method for business logic variation.",
    },
    {
      name: "Identity Crisis Decorator",
      description:
        "The decorated object's identity changes — instanceof checks fail, equality comparisons break, and the client can't unwrap to the original object.",
      betterAlternative:
        "Implement proper equality delegation. Consider providing an unwrap() method if clients need access to the inner object.",
    },
  ],
};

export default decoratorData;
