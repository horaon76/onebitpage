import { PatternData } from "@/lib/patterns/types";

const interfaceSegregationData: PatternData = {
  slug: "interface-segregation",
  categorySlug: "solid",
  categoryLabel: "SOLID",
  title: "Interface Segregation Principle (ISP)",
  subtitle:
    "No client should be forced to depend on methods it does not use — prefer many small, focused interfaces over one fat interface.",

  intent:
    "When a single interface accumulates responsibilities over time, every implementer must provide a body for methods it doesn't care about — often as a no-op or by throwing UnsupportedOperationException. This creates fragile hierarchies where a change to an unused method ripples to unrelated classes.\n\nThe Interface Segregation Principle states that interfaces should be small, cohesive, and role-specific. Clients depend only on the slice of behavior they actually use. A printer shouldn't need to implement fax(). A read-only repository shouldn't need to implement delete().\n\nISP is about designing interfaces from the *client's* perspective: what does each consumer actually need? This leads to composable systems where classes implement exactly the capabilities they support, and clients declare exactly the capabilities they require.",

  classDiagramSvg: `<svg viewBox="0 0 520 240" xmlns="http://www.w3.org/2000/svg">
  <style>
    .isp-box { rx:6; }
    .isp-title { font: bold 11px 'JetBrains Mono', monospace; }
    .isp-member { font: 10px 'JetBrains Mono', monospace; }
    .isp-arr { stroke-width:1.2; fill:none; marker-end:url(#isp-arr); }
    .isp-note { font: italic 9px 'JetBrains Mono', monospace; }
    .isp-stereo { font: italic 9px 'JetBrains Mono', monospace; }
  </style>
  <defs>
    <marker id="isp-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Printable interface -->
  <rect x="10" y="10" width="140" height="55" class="isp-box s-diagram-box"/>
  <text x="80" y="26" text-anchor="middle" class="isp-stereo s-diagram-member">«interface»</text>
  <text x="80" y="38" text-anchor="middle" class="isp-title s-diagram-title">Printable</text>
  <line x1="10" y1="42" x2="150" y2="42" class="s-diagram-line"/>
  <text x="18" y="58" class="isp-member s-diagram-member">+print(): void</text>
  <!-- Scannable interface -->
  <rect x="190" y="10" width="140" height="55" class="isp-box s-diagram-box"/>
  <text x="260" y="26" text-anchor="middle" class="isp-stereo s-diagram-member">«interface»</text>
  <text x="260" y="38" text-anchor="middle" class="isp-title s-diagram-title">Scannable</text>
  <line x1="190" y1="42" x2="330" y2="42" class="s-diagram-line"/>
  <text x="198" y="58" class="isp-member s-diagram-member">+scan(): void</text>
  <!-- Faxable interface -->
  <rect x="370" y="10" width="140" height="55" class="isp-box s-diagram-box"/>
  <text x="440" y="26" text-anchor="middle" class="isp-stereo s-diagram-member">«interface»</text>
  <text x="440" y="38" text-anchor="middle" class="isp-title s-diagram-title">Faxable</text>
  <line x1="370" y1="42" x2="510" y2="42" class="s-diagram-line"/>
  <text x="378" y="58" class="isp-member s-diagram-member">+fax(): void</text>
  <!-- MultiFunctionPrinter -->
  <rect x="140" y="120" width="240" height="55" class="isp-box s-diagram-box"/>
  <text x="260" y="138" text-anchor="middle" class="isp-title s-diagram-title">MultiFunctionPrinter</text>
  <line x1="140" y1="142" x2="380" y2="142" class="s-diagram-line"/>
  <text x="148" y="158" class="isp-member s-diagram-member">+print() +scan() +fax()</text>
  <!-- SimplePrinter -->
  <rect x="10" y="190" width="140" height="45" class="isp-box s-diagram-box"/>
  <text x="80" y="208" text-anchor="middle" class="isp-title s-diagram-title">SimplePrinter</text>
  <line x1="10" y1="212" x2="150" y2="212" class="s-diagram-line"/>
  <text x="18" y="228" class="isp-member s-diagram-member">+print(): void</text>
  <!-- Arrows: implements -->
  <line x1="200" y1="120" x2="100" y2="65" class="isp-arr s-diagram-arrow"/>
  <line x1="260" y1="120" x2="260" y2="65" class="isp-arr s-diagram-arrow"/>
  <line x1="320" y1="120" x2="420" y2="65" class="isp-arr s-diagram-arrow"/>
  <line x1="80" y1="190" x2="80" y2="65" class="isp-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "Three focused interfaces — Printable, Scannable, Faxable — each declare a single capability. MultiFunctionPrinter implements all three because it supports all operations. SimplePrinter implements only Printable — it is never forced to stub scan() or fax(). Clients that only need printing accept Printable, remaining decoupled from scanning and faxing concerns.",

  diagramComponents: [
    {
      name: "Printable",
      description:
        "A focused interface declaring only the print() capability. Clients that need printing depend on this interface alone.",
    },
    {
      name: "Scannable",
      description:
        "A focused interface declaring only the scan() capability. Only scanning clients depend on it.",
    },
    {
      name: "Faxable",
      description:
        "A focused interface declaring only the fax() capability. Faxing clients depend on it without being coupled to printing or scanning.",
    },
    {
      name: "MultiFunctionPrinter",
      description:
        "Implements all three interfaces because it genuinely supports printing, scanning, and faxing. Composes capabilities through multiple interface implementation.",
    },
    {
      name: "SimplePrinter",
      description:
        "Implements only Printable. Never forced to provide empty stubs for scan() or fax(). This is the ISP benefit — implement only what you support.",
    },
  ],

  solutionDetail:
    "**The Problem:** A single fat interface forces every implementer to provide all methods, even irrelevant ones. A read-only data consumer must implement write(). A simple printer must implement fax(). This creates coupling, fragility, and confusing no-op stubs.\n\n**The ISP Solution:** Split fat interfaces into small, role-specific interfaces.\n\n**How It Works:**\n\n1. **Identify client groups**: Different clients use different subsets of the interface. Each subset is a candidate for its own interface.\n\n2. **Extract role interfaces**: Create a separate interface for each cohesive group of methods — Readable, Writable, Deletable rather than one Repository interface.\n\n3. **Compose on the implementer**: Classes implement multiple role interfaces if they support multiple capabilities. A ReadWriteRepository implements both Readable and Writable.\n\n4. **Depend on the narrowest interface**: Client code declares dependencies on only the interface it actually uses. A report generator depends on Readable, not the full Repository.\n\n**Key Insight:** ISP designs interfaces from the *client's* perspective, not the implementer's. Ask \"what does this consumer need?\" not \"what can this class do?\"",

  characteristics: [
    "Role interfaces — each interface represents one capability or role",
    "Client-specific — interfaces designed from the consumer's perspective",
    "High cohesion — methods in an interface are always used together",
    "Composability — classes implement multiple small interfaces to combine capabilities",
    "Decoupling — changes to one interface don't affect clients of other interfaces",
    "Testability — small interfaces are trivial to mock and test in isolation",
    "No empty stubs — implementers never provide no-op methods for unsupported operations",
  ],

  useCases: [
    {
      id: 1,
      title: "Payment Gateway Interfaces",
      domain: "Fintech",
      description:
        "A payment platform splits Chargeable, Refundable, Invoiceable, ReceiptSender, and PayoutScheduler into separate interfaces instead of one fat PaymentProcessor.",
      whySingleton:
        "A simple card charger only processes payments — it shouldn't implement refund(), generateInvoice(), or schedulePayout(). Each payment capability is a separate concern with different clients.",
      code: `interface Chargeable { processPayment(amount, currency): TxId }
interface Refundable { refund(txId, amount): RefundId }
interface Invoiceable { generateInvoice(txId): Invoice }
class CardCharger implements Chargeable { /* only charge */ }
class FullService implements Chargeable, Refundable, Invoiceable { /* all */ }`,
    },
    {
      id: 2,
      title: "Clinical Workflow Systems",
      domain: "Healthcare",
      description:
        "A hospital splits AdmissionService, PrescriptionService, LabOrderService, RadiologyService, and DischargeService into separate interfaces instead of one ClinicalSystem.",
      whySingleton:
        "A lab system only handles test orders — forcing it to implement admitPatient() or prescribeMedication() is nonsensical and error-prone. Each workflow has distinct clients.",
      code: `interface AdmissionService { admitPatient(p, ward): AdmissionId }
interface LabOrderService { orderLabTest(patientId, test): OrderId }
interface PrescriptionService { prescribe(patientId, med, dosage): RxId }
class LabSystem implements LabOrderService { /* lab only */ }
class AdmissionDesk implements AdmissionService, DischargeService { /* admit + discharge */ }`,
    },
    {
      id: 3,
      title: "Repository Read/Write Separation",
      domain: "Backend / Data Access",
      description:
        "A data layer separates Readable, Writable, and Deletable interfaces. Read-only consumers (reports, dashboards) depend only on Readable.",
      whySingleton:
        "A reporting module that only reads data shouldn't depend on write() or delete() methods. Splitting interfaces prevents accidental mutations and simplifies security auditing.",
      code: `interface Readable<T> { findById(id): T; findAll(): T[] }
interface Writable<T> { save(entity: T): void }
interface Deletable { delete(id): void }
class ReadOnlyDashboard { constructor(repo: Readable<Order>) {} }
class FullRepository implements Readable<Order>, Writable<Order>, Deletable { ... }`,
    },
    {
      id: 4,
      title: "Cloud Storage Operations",
      domain: "Infrastructure / Cloud",
      description:
        "Cloud storage interfaces are split into Uploadable, Downloadable, Listable, and Deletable. A CDN cache only implements Downloadable.",
      whySingleton:
        "A CDN cache serves files — it shouldn't need upload() or delete() methods. Edge nodes depend only on Downloadable, remaining decoupled from write operations.",
      code: `interface Uploadable { upload(key, data): URL }
interface Downloadable { download(key): Buffer }
interface Listable { list(prefix): Key[] }
interface Deletable { delete(key): void }
class CDNCache implements Downloadable { /* read-only edge */ }
class S3Storage implements Uploadable, Downloadable, Listable, Deletable { /* full access */ }`,
    },
    {
      id: 5,
      title: "Notification Channel Capabilities",
      domain: "Communication Platform",
      description:
        "Notification channels split into Sendable, Schedulable, Trackable, and Batchable. A simple webhook implements only Sendable.",
      whySingleton:
        "A webhook fires and forgets — it can't schedule or batch. Forcing it to implement schedule() or getBatchStatus() adds complexity with no value. Each channel declares its actual capabilities.",
      code: `interface Sendable { send(msg): DeliveryId }
interface Schedulable { schedule(msg, at): ScheduleId }
interface Trackable { getStatus(deliveryId): Status }
interface Batchable { sendBatch(msgs): DeliveryId[] }
class WebhookChannel implements Sendable { /* fire-and-forget */ }
class EmailChannel implements Sendable, Schedulable, Trackable, Batchable { /* full */ }`,
    },
    {
      id: 6,
      title: "User Permission Interfaces",
      domain: "Identity / Access Management",
      description:
        "A user system separates Authenticatable, Authorizable, ProfileEditable, and AuditLoggable instead of one fat UserService interface.",
      whySingleton:
        "An API gateway only authenticates — it doesn't need profile editing methods. A profile page only edits — it doesn't need authentication internals. Each security concern has distinct consumers.",
      code: `interface Authenticatable { authenticate(credentials): Token }
interface Authorizable { authorize(token, resource): boolean }
interface ProfileEditable { updateProfile(userId, data): void }
class APIGateway { constructor(auth: Authenticatable) {} }
class ProfilePage { constructor(editor: ProfileEditable) {} }`,
    },
    {
      id: 7,
      title: "Document Processing Pipeline",
      domain: "Content Management",
      description:
        "Document operations split into Parseable, Renderable, Searchable, and Exportable. A search indexer implements only Parseable and Searchable.",
      whySingleton:
        "A search indexer parses and indexes content — it doesn't render PDFs or export files. Splitting prevents the indexer from accumulating rendering dependencies it never uses.",
      code: `interface Parseable { parse(raw): Document }
interface Renderable { render(doc): Buffer }
interface Searchable { index(doc): void; search(query): Result[] }
interface Exportable { export(doc, format): Buffer }
class SearchIndexer implements Parseable, Searchable { /* parse + index */ }
class PDFEngine implements Renderable, Exportable { /* render + export */ }`,
    },
    {
      id: 8,
      title: "IoT Device Capabilities",
      domain: "IoT / Smart Home",
      description:
        "Smart home devices implement only their actual capabilities: Switchable, Dimmable, ColorChangeable, TemperatureReadable instead of one SmartDevice interface.",
      whySingleton:
        "A simple smart plug can be switched on/off but can't dim or change color. A temperature sensor reads temperature but can't be switched. Each device declares exactly what it can do.",
      code: `interface Switchable { turnOn(): void; turnOff(): void }
interface Dimmable { setBrightness(level: number): void }
interface ColorChangeable { setColor(hex: string): void }
interface TemperatureReadable { readTemp(): number }
class SmartPlug implements Switchable { /* on/off only */ }
class SmartBulb implements Switchable, Dimmable, ColorChangeable { /* full control */ }`,
    },
    {
      id: 9,
      title: "Logging Sink Interfaces",
      domain: "Observability / DevOps",
      description:
        "Logging sinks are split into LogWriter, LogQueryable, LogRotatable, and AlertConfigurable. A console sink implements only LogWriter.",
      whySingleton:
        "Console output can't be queried or rotated. Forcing a console logger to implement rotate() or query() makes no sense. Each sink declares only what it actually supports.",
      code: `interface LogWriter { write(entry: LogEntry): void }
interface LogQueryable { query(filter): LogEntry[] }
interface LogRotatable { rotate(maxAge): void }
interface AlertConfigurable { setAlert(pattern, threshold): void }
class ConsoleLogger implements LogWriter { /* write only */ }
class ElasticSink implements LogWriter, LogQueryable, AlertConfigurable { /* queryable */ }`,
    },
    {
      id: 10,
      title: "E-commerce Cart Operations",
      domain: "E-commerce",
      description:
        "Shopping cart interfaces split into CartReadable, CartModifiable, CartCheckout, and CartSaveable. A cart preview widget depends only on CartReadable.",
      whySingleton:
        "A cart preview in the navbar only reads item count and total — it shouldn't depend on addItem() or checkout(). Narrow interfaces prevent UI components from accidentally triggering mutations.",
      code: `interface CartReadable { getItems(): Item[]; getTotal(): Money }
interface CartModifiable { addItem(item): void; removeItem(id): void }
interface CartCheckout { checkout(payment): OrderId }
interface CartSaveable { saveForLater(): void; restore(): void }
class CartPreview { constructor(cart: CartReadable) {} }
class CartPage { constructor(cart: CartReadable & CartModifiable & CartCheckout) {} }`,
    },
    {
      id: 11,
      title: "CI/CD Plugin Interfaces",
      domain: "DevOps / Build Systems",
      description:
        "CI/CD plugins implement focused interfaces: Compilable, Testable, Deployable, Notifiable instead of one massive BuildPlugin interface.",
      whySingleton:
        "A Slack notification plugin shouldn't implement compile() or deploy(). A Go compiler plugin doesn't send notifications. Each pipeline step depends only on the interface it orchestrates.",
      code: `interface Compilable { compile(src): Artifact }
interface Testable { test(artifact): TestResult }
interface Deployable { deploy(artifact, env): DeployResult }
interface Notifiable { notify(event, channel): void }
class GoCompiler implements Compilable { /* compile only */ }
class SlackNotifier implements Notifiable { /* notify only */ }
class FullPlugin implements Compilable, Testable, Deployable { /* multi-stage */ }`,
    },
    {
      id: 12,
      title: "Analytics Event Interfaces",
      domain: "Data / Analytics",
      description:
        "Analytics operations split into EventTrackable, Queryable, Exportable, and Configurable. A lightweight frontend tracker implements only EventTrackable.",
      whySingleton:
        "A browser tracker sends events — it can't query or export data server-side. The dashboard depends on Queryable. The ETL job depends on Exportable. Each consumer uses its own slice.",
      code: `interface EventTrackable { track(event: string, props: object): void }
interface Queryable { query(sql: string): ResultSet }
interface Exportable { export(dateRange, format): Buffer }
interface Configurable { configure(settings): void }
class BrowserTracker implements EventTrackable { /* track only */ }
class AnalyticsDashboard { constructor(source: Queryable) {} }`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Payment Gateway Interfaces",
      domain: "Fintech",
      problem:
        "A monolithic PaymentProcessor interface forces every gateway to implement charge, refund, and invoice methods — even simple card chargers that only need to process one-time charges.",
      solution:
        "Split into Chargeable, Refundable, and Invoiceable interfaces. CardCharger implements only Chargeable. FullPaymentService composes all three. Client code depends only on the narrow interface it actually requires.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="140" height="35" rx="6" class="s-diagram-box"/>
  <text x="75" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Chargeable</text>
  <rect x="160" y="5" width="140" height="35" rx="6" class="s-diagram-box"/>
  <text x="230" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Refundable</text>
  <rect x="315" y="5" width="140" height="35" rx="6" class="s-diagram-box"/>
  <text x="385" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Invoiceable</text>
  <rect x="30" y="100" width="120" height="35" rx="6" class="s-diagram-box"/>
  <text x="90" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">CardCharger</text>
  <rect x="200" y="100" width="160" height="35" rx="6" class="s-diagram-box"/>
  <text x="280" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">FullPaymentService</text>
  <line x1="90" y1="100" x2="75" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="260" y1="100" x2="75" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="280" y1="100" x2="230" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="300" y1="100" x2="385" y2="40" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Each interface should represent a single payment capability",
        "Composition allows mix-and-match gateway configurations",
        "Adding a new capability (e.g., Subscribable) requires no changes to existing implementers",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod


# ❌ BEFORE: Fat interface — every implementer must provide everything
class FatPaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> str: ...
    @abstractmethod
    def refund(self, transaction_id: str) -> str: ...
    @abstractmethod
    def generate_invoice(self, transaction_id: str) -> str: ...
    @abstractmethod
    def send_receipt(self, transaction_id: str, email: str) -> None: ...
    @abstractmethod
    def schedule_payout(self, merchant_id: str, amount: float) -> str: ...


# ✅ AFTER: Segregated interfaces
class Chargeable(ABC):
    @abstractmethod
    def process_payment(self, amount: float, currency: str) -> str: ...


class Refundable(ABC):
    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> str: ...


class Invoiceable(ABC):
    @abstractmethod
    def generate_invoice(self, transaction_id: str) -> dict: ...


# Simple card charger — only implements Chargeable
class CardCharger(Chargeable):
    def process_payment(self, amount: float, currency: str) -> str:
        tx_id = f"TXN-{id(self)}-{amount}"
        print(f"Charged \${amount:.2f} {currency}")
        return tx_id


# Full-featured processor — implements all relevant interfaces
class FullPaymentService(Chargeable, Refundable, Invoiceable):
    def __init__(self):
        self.transactions: dict[str, float] = {}

    def process_payment(self, amount: float, currency: str) -> str:
        tx_id = f"TXN-{id(self)}-{amount}"
        self.transactions[tx_id] = amount
        return tx_id

    def refund(self, transaction_id: str, amount: float) -> str:
        return f"REF-{transaction_id}"

    def generate_invoice(self, transaction_id: str) -> dict:
        return {"tx": transaction_id, "amount": self.transactions.get(transaction_id, 0)}


# Client code depends ONLY on the interface it needs
def charge_customer(processor: Chargeable, amount: float):
    tx_id = processor.process_payment(amount, "USD")
    print(f"Charge complete: {tx_id}")


def issue_refund(processor: Refundable, tx_id: str, amount: float):
    ref_id = processor.refund(tx_id, amount)
    print(f"Refund issued: {ref_id}")


card = CardCharger()
charge_customer(card, 49.99)

full = FullPaymentService()
charge_customer(full, 149.99)
issue_refund(full, "TXN-123", 149.99)`,
        Go: `package main

import "fmt"

// Segregated interfaces
type Chargeable interface {
	ProcessPayment(amount float64, currency string) string
}

type Refundable interface {
	Refund(transactionID string, amount float64) string
}

type Invoiceable interface {
	GenerateInvoice(transactionID string) map[string]interface{}
}

// Simple implementation — only Chargeable
type CardCharger struct{}

func (c *CardCharger) ProcessPayment(amount float64, currency string) string {
	txID := fmt.Sprintf("TXN-CARD-%.0f", amount*100)
	fmt.Printf("Charged $%.2f %s\\n", amount, currency)
	return txID
}

// Full service — implements multiple interfaces
type FullPaymentService struct {
	Transactions map[string]float64
}

func (f *FullPaymentService) ProcessPayment(amount float64, currency string) string {
	txID := fmt.Sprintf("TXN-FULL-%.0f", amount*100)
	f.Transactions[txID] = amount
	return txID
}

func (f *FullPaymentService) Refund(txID string, amount float64) string {
	return fmt.Sprintf("REF-%s", txID)
}

func (f *FullPaymentService) GenerateInvoice(txID string) map[string]interface{} {
	return map[string]interface{}{"tx": txID, "amount": f.Transactions[txID]}
}

// Client depends only on Chargeable
func ChargeCustomer(p Chargeable, amount float64) {
	txID := p.ProcessPayment(amount, "USD")
	fmt.Printf("Charge complete: %s\\n", txID)
}

func main() {
	card := &CardCharger{}
	ChargeCustomer(card, 49.99)

	full := &FullPaymentService{Transactions: make(map[string]float64)}
	ChargeCustomer(full, 149.99)
}`,
        Java: `// Segregated interfaces
interface Chargeable {
    String processPayment(double amount, String currency);
}

interface Refundable {
    String refund(String transactionId, double amount);
}

interface Invoiceable {
    Map<String, Object> generateInvoice(String transactionId);
}

// Simple card charger — only Chargeable
class CardCharger implements Chargeable {
    public String processPayment(double amount, String currency) {
        String txId = "TXN-CARD-" + (int)(amount * 100);
        System.out.printf("Charged $%.2f %s%n", amount, currency);
        return txId;
    }
}

// Full service — implements what it actually supports
class FullPaymentService implements Chargeable, Refundable, Invoiceable {
    private Map<String, Double> transactions = new HashMap<>();

    public String processPayment(double amount, String currency) {
        String txId = "TXN-FULL-" + (int)(amount * 100);
        transactions.put(txId, amount);
        return txId;
    }

    public String refund(String txId, double amount) {
        return "REF-" + txId;
    }

    public Map<String, Object> generateInvoice(String txId) {
        return Map.of("tx", txId, "amount", transactions.getOrDefault(txId, 0.0));
    }
}

// Client depends only on what it needs
class ChargeService {
    void chargeCustomer(Chargeable processor, double amount) {
        String txId = processor.processPayment(amount, "USD");
        System.out.println("Charge complete: " + txId);
    }
}`,
        TypeScript: `// Segregated interfaces
interface Chargeable {
  processPayment(amount: number, currency: string): string;
}

interface Refundable {
  refund(transactionId: string, amount: number): string;
}

interface Invoiceable {
  generateInvoice(transactionId: string): Record<string, unknown>;
}

// Simple charger — only Chargeable
class CardCharger implements Chargeable {
  processPayment(amount: number, currency: string): string {
    const txId = \`TXN-CARD-\${Math.round(amount * 100)}\`;
    console.log(\`Charged $\${amount.toFixed(2)} \${currency}\`);
    return txId;
  }
}

// Full service — composes multiple interfaces
class FullPaymentService implements Chargeable, Refundable, Invoiceable {
  private transactions = new Map<string, number>();

  processPayment(amount: number, currency: string): string {
    const txId = \`TXN-FULL-\${Math.round(amount * 100)}\`;
    this.transactions.set(txId, amount);
    return txId;
  }

  refund(transactionId: string, amount: number): string {
    return \`REF-\${transactionId}\`;
  }

  generateInvoice(transactionId: string): Record<string, unknown> {
    return {
      tx: transactionId,
      amount: this.transactions.get(transactionId) ?? 0,
    };
  }
}

// Client depends only on Chargeable
function chargeCustomer(processor: Chargeable, amount: number) {
  const txId = processor.processPayment(amount, "USD");
  console.log(\`Charge complete: \${txId}\`);
}

const card = new CardCharger();
chargeCustomer(card, 49.99);

const full = new FullPaymentService();
chargeCustomer(full, 149.99);`,
        Rust: `trait Chargeable {
    fn process_payment(&mut self, amount: f64, currency: &str) -> String;
}

trait Refundable {
    fn refund(&self, transaction_id: &str, amount: f64) -> String;
}

struct CardCharger;

impl Chargeable for CardCharger {
    fn process_payment(&mut self, amount: f64, currency: &str) -> String {
        let tx_id = format!("TXN-CARD-{}", (amount * 100.0) as i64);
        println!("Charged \${:.2} {}", amount, currency);
        tx_id
    }
}

struct FullPaymentService {
    transactions: std::collections::HashMap<String, f64>,
}

impl Chargeable for FullPaymentService {
    fn process_payment(&mut self, amount: f64, currency: &str) -> String {
        let tx_id = format!("TXN-FULL-{}", (amount * 100.0) as i64);
        self.transactions.insert(tx_id.clone(), amount);
        tx_id
    }
}

impl Refundable for FullPaymentService {
    fn refund(&self, transaction_id: &str, _amount: f64) -> String {
        format!("REF-{}", transaction_id)
    }
}

fn charge_customer(processor: &mut dyn Chargeable, amount: f64) {
    let tx_id = processor.process_payment(amount, "USD");
    println!("Charge complete: {}", tx_id);
}

fn main() {
    let mut card = CardCharger;
    charge_customer(&mut card, 49.99);

    let mut full = FullPaymentService {
        transactions: std::collections::HashMap::new(),
    };
    charge_customer(&mut full, 149.99);
}`,
      },
    },
    {
      id: 2,
      title: "Healthcare — Clinical Workflow Interfaces",
      domain: "Healthcare",
      problem:
        "A ClinicalSystem interface bundles admission, lab-order, prescription, and discharge operations — forcing every module (e.g., pharmacy) to depend on admission methods it never uses.",
      solution:
        "Split into AdmissionService, LabOrderService, PrescriptionService, and DischargeService interfaces. Each subsystem implements only the interfaces matching its clinical role.",
      classDiagramSvg: `<svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="110" height="35" rx="6" class="s-diagram-box"/>
  <text x="60" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">AdmissionService</text>
  <rect x="125" y="5" width="110" height="35" rx="6" class="s-diagram-box"/>
  <text x="180" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">LabOrderService</text>
  <rect x="245" y="5" width="120" height="35" rx="6" class="s-diagram-box"/>
  <text x="305" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">PrescriptionService</text>
  <rect x="375" y="5" width="120" height="35" rx="6" class="s-diagram-box"/>
  <text x="435" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">DischargeService</text>
  <rect x="60" y="100" width="140" height="35" rx="6" class="s-diagram-box"/>
  <text x="130" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">WardModule</text>
  <rect x="270" y="100" width="140" height="35" rx="6" class="s-diagram-box"/>
  <text x="340" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">LabModule</text>
  <line x1="130" y1="100" x2="60" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="130" y1="100" x2="435" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="340" y1="100" x2="180" y2="40" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Clinical interfaces should mirror actual departmental boundaries",
        "Regulatory audits benefit from narrow, single-purpose service contracts",
        "New workflows (e.g., telehealth) can implement a subset of existing interfaces",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Patient:
    id: str
    name: str


# ✅ Segregated interfaces
class AdmissionService(ABC):
    @abstractmethod
    def admit_patient(self, patient: Patient, ward: str) -> str: ...


class PrescriptionService(ABC):
    @abstractmethod
    def prescribe(self, patient_id: str, medication: str, dosage: str) -> str: ...


class LabOrderService(ABC):
    @abstractmethod
    def order_lab_test(self, patient_id: str, test_name: str) -> str: ...


class DischargeService(ABC):
    @abstractmethod
    def discharge_patient(self, patient_id: str, summary: str) -> str: ...


# Lab system — only LabOrderService
class HospitalLabSystem(LabOrderService):
    def __init__(self):
        self.orders: list[dict] = []

    def order_lab_test(self, patient_id: str, test_name: str) -> str:
        order_id = f"LAB-{len(self.orders)+1:04d}"
        self.orders.append({
            "order_id": order_id,
            "patient_id": patient_id,
            "test": test_name,
            "ordered_at": datetime.now().isoformat(),
        })
        print(f"Lab order {order_id}: {test_name} for patient {patient_id}")
        return order_id


# Admission desk — AdmissionService + DischargeService
class AdmissionDesk(AdmissionService, DischargeService):
    def __init__(self):
        self.admitted: dict[str, str] = {}

    def admit_patient(self, patient: Patient, ward: str) -> str:
        admission_id = f"ADM-{patient.id}"
        self.admitted[patient.id] = ward
        print(f"Admitted {patient.name} to {ward}")
        return admission_id

    def discharge_patient(self, patient_id: str, summary: str) -> str:
        ward = self.admitted.pop(patient_id, "unknown")
        print(f"Discharged {patient_id} from {ward}: {summary}")
        return f"DIS-{patient_id}"


# Pharmacy — only PrescriptionService
class PharmacySystem(PrescriptionService):
    def prescribe(self, patient_id: str, medication: str, dosage: str) -> str:
        rx_id = f"RX-{patient_id}-{medication[:3].upper()}"
        print(f"Prescribed {medication} {dosage} for patient {patient_id}")
        return rx_id


# Client code — depends on exactly the interface it needs
def run_lab_workflow(lab: LabOrderService, patient_id: str):
    lab.order_lab_test(patient_id, "CBC")
    lab.order_lab_test(patient_id, "BMP")


def run_admission(desk: AdmissionService, patient: Patient):
    desk.admit_patient(patient, "Ward-3A")


lab = HospitalLabSystem()
run_lab_workflow(lab, "P-12345")

desk = AdmissionDesk()
run_admission(desk, Patient("P-12345", "Jane Doe"))`,
        Go: `package main

import "fmt"

type AdmissionService interface {
	AdmitPatient(patientID, ward string) string
}

type LabOrderService interface {
	OrderLabTest(patientID, testName string) string
}

type DischargeService interface {
	DischargePatient(patientID, summary string) string
}

type HospitalLabSystem struct {
	OrderCount int
}

func (l *HospitalLabSystem) OrderLabTest(patientID, testName string) string {
	l.OrderCount++
	orderID := fmt.Sprintf("LAB-%04d", l.OrderCount)
	fmt.Printf("Lab order %s: %s for %s\\n", orderID, testName, patientID)
	return orderID
}

type AdmissionDesk struct {
	Admitted map[string]string
}

func (a *AdmissionDesk) AdmitPatient(patientID, ward string) string {
	a.Admitted[patientID] = ward
	fmt.Printf("Admitted %s to %s\\n", patientID, ward)
	return "ADM-" + patientID
}

func (a *AdmissionDesk) DischargePatient(patientID, summary string) string {
	delete(a.Admitted, patientID)
	return "DIS-" + patientID
}

func RunLabWorkflow(lab LabOrderService, patientID string) {
	lab.OrderLabTest(patientID, "CBC")
	lab.OrderLabTest(patientID, "BMP")
}

func main() {
	lab := &HospitalLabSystem{}
	RunLabWorkflow(lab, "P-12345")

	desk := &AdmissionDesk{Admitted: make(map[string]string)}
	desk.AdmitPatient("P-12345", "Ward-3A")
}`,
        Java: `interface AdmissionService {
    String admitPatient(String patientId, String ward);
}

interface LabOrderService {
    String orderLabTest(String patientId, String testName);
}

interface DischargeService {
    String dischargePatient(String patientId, String summary);
}

class HospitalLabSystem implements LabOrderService {
    private int orderCount = 0;

    public String orderLabTest(String patientId, String testName) {
        String orderId = String.format("LAB-%04d", ++orderCount);
        System.out.printf("Lab order %s: %s for %s%n", orderId, testName, patientId);
        return orderId;
    }
}

class AdmissionDesk implements AdmissionService, DischargeService {
    private Map<String, String> admitted = new HashMap<>();

    public String admitPatient(String patientId, String ward) {
        admitted.put(patientId, ward);
        System.out.printf("Admitted %s to %s%n", patientId, ward);
        return "ADM-" + patientId;
    }

    public String dischargePatient(String patientId, String summary) {
        admitted.remove(patientId);
        return "DIS-" + patientId;
    }
}

// Client uses only what it needs
class LabWorkflow {
    void runTests(LabOrderService lab, String patientId) {
        lab.orderLabTest(patientId, "CBC");
        lab.orderLabTest(patientId, "BMP");
    }
}`,
        TypeScript: `interface AdmissionService {
  admitPatient(patientId: string, ward: string): string;
}

interface LabOrderService {
  orderLabTest(patientId: string, testName: string): string;
}

interface DischargeService {
  dischargePatient(patientId: string, summary: string): string;
}

class HospitalLabSystem implements LabOrderService {
  private orderCount = 0;

  orderLabTest(patientId: string, testName: string): string {
    const orderId = \`LAB-\${String(++this.orderCount).padStart(4, "0")}\`;
    console.log(\`Lab order \${orderId}: \${testName} for \${patientId}\`);
    return orderId;
  }
}

class AdmissionDesk implements AdmissionService, DischargeService {
  private admitted = new Map<string, string>();

  admitPatient(patientId: string, ward: string): string {
    this.admitted.set(patientId, ward);
    console.log(\`Admitted \${patientId} to \${ward}\`);
    return \`ADM-\${patientId}\`;
  }

  dischargePatient(patientId: string, summary: string): string {
    this.admitted.delete(patientId);
    return \`DIS-\${patientId}\`;
  }
}

function runLabWorkflow(lab: LabOrderService, patientId: string) {
  lab.orderLabTest(patientId, "CBC");
  lab.orderLabTest(patientId, "BMP");
}

const lab = new HospitalLabSystem();
runLabWorkflow(lab, "P-12345");`,
        Rust: `trait LabOrderService {
    fn order_lab_test(&mut self, patient_id: &str, test_name: &str) -> String;
}

trait AdmissionService {
    fn admit_patient(&mut self, patient_id: &str, ward: &str) -> String;
}

trait DischargeService {
    fn discharge_patient(&mut self, patient_id: &str, summary: &str) -> String;
}

struct HospitalLabSystem { order_count: u32 }

impl LabOrderService for HospitalLabSystem {
    fn order_lab_test(&mut self, patient_id: &str, test_name: &str) -> String {
        self.order_count += 1;
        let id = format!("LAB-{:04}", self.order_count);
        println!("Lab order {}: {} for {}", id, test_name, patient_id);
        id
    }
}

struct AdmissionDesk {
    admitted: std::collections::HashMap<String, String>,
}

impl AdmissionService for AdmissionDesk {
    fn admit_patient(&mut self, patient_id: &str, ward: &str) -> String {
        self.admitted.insert(patient_id.to_string(), ward.to_string());
        format!("ADM-{}", patient_id)
    }
}

impl DischargeService for AdmissionDesk {
    fn discharge_patient(&mut self, patient_id: &str, _summary: &str) -> String {
        self.admitted.remove(patient_id);
        format!("DIS-{}", patient_id)
    }
}

fn run_lab_workflow(lab: &mut dyn LabOrderService, patient_id: &str) {
    lab.order_lab_test(patient_id, "CBC");
    lab.order_lab_test(patient_id, "BMP");
}

fn main() {
    let mut lab = HospitalLabSystem { order_count: 0 };
    run_lab_workflow(&mut lab, "P-12345");
}`,
      },
    },
    {
      id: 3,
      title: "E-commerce — Repository Read/Write Separation",
      domain: "E-commerce",
      problem:
        "A generic Repository interface forces read-only dashboards to depend on write and delete methods they never invoke, complicating permission models and increasing coupling.",
      solution:
        "Split into Readable, Writable, and Deletable interfaces. The analytics dashboard depends only on Readable; the admin panel composes all three.",
      classDiagramSvg: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="130" height="35" rx="6" class="s-diagram-box"/>
  <text x="70" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Readable</text>
  <rect x="145" y="5" width="130" height="35" rx="6" class="s-diagram-box"/>
  <text x="210" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Writable</text>
  <rect x="285" y="5" width="130" height="35" rx="6" class="s-diagram-box"/>
  <text x="350" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">«interface» Deletable</text>
  <rect x="20" y="100" width="130" height="35" rx="6" class="s-diagram-box"/>
  <text x="85" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">DashboardRepo</text>
  <rect x="220" y="100" width="130" height="35" rx="6" class="s-diagram-box"/>
  <text x="285" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">AdminRepo</text>
  <line x1="85" y1="100" x2="70" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="265" y1="100" x2="70" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="285" y1="100" x2="210" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="305" y1="100" x2="350" y2="40" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Read-only interfaces simplify caching and horizontal scaling",
        "Write interfaces can encapsulate transactional boundaries",
        "CQRS naturally follows from this segregation pattern",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class Product:
    id: str
    name: str
    price: float
    stock: int


# ✅ Segregated repository interfaces
class Readable(ABC):
    @abstractmethod
    def find_by_id(self, id: str) -> Optional[Product]: ...
    @abstractmethod
    def find_all(self) -> list[Product]: ...


class Writable(ABC):
    @abstractmethod
    def save(self, product: Product) -> None: ...


class Deletable(ABC):
    @abstractmethod
    def delete(self, id: str) -> bool: ...


# Full repository — implements all interfaces
class ProductRepository(Readable, Writable, Deletable):
    def __init__(self):
        self._store: dict[str, Product] = {}

    def find_by_id(self, id: str) -> Optional[Product]:
        return self._store.get(id)

    def find_all(self) -> list[Product]:
        return list(self._store.values())

    def save(self, product: Product) -> None:
        self._store[product.id] = product
        print(f"Saved: {product.name}")

    def delete(self, id: str) -> bool:
        if id in self._store:
            del self._store[id]
            return True
        return False


# Read-only dashboard — depends only on Readable
class DashboardService:
    def __init__(self, repo: Readable):
        self.repo = repo

    def get_inventory_summary(self) -> dict:
        products = self.repo.find_all()
        return {
            "total_products": len(products),
            "total_value": sum(p.price * p.stock for p in products),
            "low_stock": [p.name for p in products if p.stock < 10],
        }


# Admin service — depends on Writable + Deletable
class AdminService:
    def __init__(self, writer: Writable, deleter: Deletable):
        self.writer = writer
        self.deleter = deleter

    def update_price(self, product: Product, new_price: float):
        product.price = new_price
        self.writer.save(product)

    def remove_product(self, product_id: str):
        self.deleter.delete(product_id)


repo = ProductRepository()
repo.save(Product("P1", "Widget", 29.99, 100))
repo.save(Product("P2", "Gadget", 49.99, 5))

dashboard = DashboardService(repo)  # Only Readable
print(dashboard.get_inventory_summary())

admin = AdminService(repo, repo)  # Writable + Deletable
admin.remove_product("P2")`,
        Go: `package main

import "fmt"

type Product struct {
	ID    string
	Name  string
	Price float64
	Stock int
}

// Segregated interfaces
type Readable interface {
	FindByID(id string) *Product
	FindAll() []Product
}

type Writable interface {
	Save(product Product)
}

type Deletable interface {
	Delete(id string) bool
}

// Full repository
type ProductRepo struct {
	store map[string]Product
}

func (r *ProductRepo) FindByID(id string) *Product {
	p, ok := r.store[id]
	if !ok { return nil }
	return &p
}

func (r *ProductRepo) FindAll() []Product {
	result := make([]Product, 0, len(r.store))
	for _, p := range r.store { result = append(result, p) }
	return result
}

func (r *ProductRepo) Save(p Product) { r.store[p.ID] = p }
func (r *ProductRepo) Delete(id string) bool {
	_, ok := r.store[id]
	delete(r.store, id)
	return ok
}

// Dashboard — only Readable
func GetInventorySummary(repo Readable) {
	products := repo.FindAll()
	fmt.Printf("Total products: %d\\n", len(products))
}

func main() {
	repo := &ProductRepo{store: make(map[string]Product)}
	repo.Save(Product{"P1", "Widget", 29.99, 100})
	GetInventorySummary(repo)
}`,
        Java: `interface Readable<T> {
    T findById(String id);
    List<T> findAll();
}

interface Writable<T> {
    void save(T entity);
}

interface Deletable {
    boolean delete(String id);
}

class Product {
    String id, name;
    double price;
    int stock;

    Product(String id, String name, double price, int stock) {
        this.id = id; this.name = name; this.price = price; this.stock = stock;
    }
}

class ProductRepository implements Readable<Product>, Writable<Product>, Deletable {
    private Map<String, Product> store = new HashMap<>();

    public Product findById(String id) { return store.get(id); }
    public List<Product> findAll() { return new ArrayList<>(store.values()); }
    public void save(Product p) { store.put(p.id, p); }
    public boolean delete(String id) { return store.remove(id) != null; }
}

// Dashboard — only Readable
class DashboardService {
    private final Readable<Product> repo;
    DashboardService(Readable<Product> repo) { this.repo = repo; }

    int getProductCount() { return repo.findAll().size(); }
}`,
        TypeScript: `interface Readable<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
}

interface Writable<T> {
  save(entity: T): void;
}

interface Deletable {
  delete(id: string): boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

class ProductRepository implements Readable<Product>, Writable<Product>, Deletable {
  private store = new Map<string, Product>();

  findById(id: string) { return this.store.get(id); }
  findAll() { return [...this.store.values()]; }
  save(p: Product) { this.store.set(p.id, p); }
  delete(id: string) { return this.store.delete(id); }
}

// Dashboard — only Readable
class DashboardService {
  constructor(private repo: Readable<Product>) {}

  getInventorySummary() {
    const products = this.repo.findAll();
    return {
      total: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
      lowStock: products.filter(p => p.stock < 10).map(p => p.name),
    };
  }
}

const repo = new ProductRepository();
repo.save({ id: "P1", name: "Widget", price: 29.99, stock: 100 });
repo.save({ id: "P2", name: "Gadget", price: 49.99, stock: 5 });

const dashboard = new DashboardService(repo);
console.log(dashboard.getInventorySummary());`,
        Rust: `use std::collections::HashMap;

#[derive(Clone)]
struct Product {
    id: String,
    name: String,
    price: f64,
    stock: i32,
}

trait Readable {
    fn find_by_id(&self, id: &str) -> Option<&Product>;
    fn find_all(&self) -> Vec<&Product>;
}

trait Writable {
    fn save(&mut self, product: Product);
}

trait Deletable {
    fn delete(&mut self, id: &str) -> bool;
}

struct ProductRepo {
    store: HashMap<String, Product>,
}

impl Readable for ProductRepo {
    fn find_by_id(&self, id: &str) -> Option<&Product> { self.store.get(id) }
    fn find_all(&self) -> Vec<&Product> { self.store.values().collect() }
}

impl Writable for ProductRepo {
    fn save(&mut self, p: Product) { self.store.insert(p.id.clone(), p); }
}

impl Deletable for ProductRepo {
    fn delete(&mut self, id: &str) -> bool { self.store.remove(id).is_some() }
}

// Dashboard — only Readable
fn get_summary(repo: &dyn Readable) {
    let products = repo.find_all();
    println!("Total products: {}", products.len());
    let total_value: f64 = products.iter().map(|p| p.price * p.stock as f64).sum();
    println!("Total value: {:.2}", total_value);
}

fn main() {
    let mut repo = ProductRepo { store: HashMap::new() };
    repo.save(Product { id: "P1".into(), name: "Widget".into(), price: 29.99, stock: 100 });
    get_summary(&repo);
}`,
      },
    },
    {
      id: 4,
      title: "IoT — Smart Device Capability Interfaces",
      domain: "IoT",
      problem:
        "A monolithic SmartDevice interface requires every device — including a basic on/off switch — to stub out dimming, color-change, and temperature-reporting methods it cannot physically support.",
      solution:
        "Split into Switchable, Dimmable, ColorChangeable, and TemperatureReadable. Each device implements only the capability interfaces matching its actual hardware.",
      classDiagramSvg: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="110" height="35" rx="6" class="s-diagram-box"/>
  <text x="60" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">Switchable</text>
  <rect x="125" y="5" width="110" height="35" rx="6" class="s-diagram-box"/>
  <text x="180" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">Dimmable</text>
  <rect x="245" y="5" width="120" height="35" rx="6" class="s-diagram-box"/>
  <text x="305" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">ColorChangeable</text>
  <rect x="375" y="5" width="100" height="35" rx="6" class="s-diagram-box"/>
  <text x="425" y="27" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">TempReadable</text>
  <rect x="30" y="100" width="100" height="35" rx="6" class="s-diagram-box"/>
  <text x="80" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">BasicSwitch</text>
  <rect x="180" y="100" width="110" height="35" rx="6" class="s-diagram-box"/>
  <text x="235" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">SmartBulb</text>
  <rect x="340" y="100" width="120" height="35" rx="6" class="s-diagram-box"/>
  <text x="400" y="122" text-anchor="middle" font-size="10" class="s-diagram-title">Thermostat</text>
  <line x1="80" y1="100" x2="60" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="220" y1="100" x2="60" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="235" y1="100" x2="180" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="250" y1="100" x2="305" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="400" y1="100" x2="60" y2="40" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="400" y1="100" x2="425" y2="40" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Capability interfaces map directly to hardware feature flags",
        "New capabilities (e.g., MotionDetectable) are additive — no existing devices change",
        "Clients query supported interfaces at runtime for adaptive UIs",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod


# ✅ Segregated capability interfaces
class Switchable(ABC):
    @abstractmethod
    def turn_on(self) -> None: ...
    @abstractmethod
    def turn_off(self) -> None: ...


class Dimmable(ABC):
    @abstractmethod
    def set_brightness(self, level: int) -> None: ...


class ColorChangeable(ABC):
    @abstractmethod
    def set_color(self, hex_color: str) -> None: ...


class TemperatureReadable(ABC):
    @abstractmethod
    def read_temperature(self) -> float: ...


# Smart plug — only Switchable
class SmartPlug(Switchable):
    def __init__(self, name: str):
        self.name = name
        self.is_on = False

    def turn_on(self):
        self.is_on = True
        print(f"{self.name}: ON")

    def turn_off(self):
        self.is_on = False
        print(f"{self.name}: OFF")


# Smart bulb — Switchable + Dimmable + ColorChangeable
class SmartBulb(Switchable, Dimmable, ColorChangeable):
    def __init__(self, name: str):
        self.name = name
        self.is_on = False
        self.brightness = 100
        self.color = "#FFFFFF"

    def turn_on(self):
        self.is_on = True
        print(f"{self.name}: ON at {self.brightness}% [{self.color}]")

    def turn_off(self):
        self.is_on = False
        print(f"{self.name}: OFF")

    def set_brightness(self, level: int):
        self.brightness = max(0, min(100, level))
        print(f"{self.name}: brightness = {self.brightness}%")

    def set_color(self, hex_color: str):
        self.color = hex_color
        print(f"{self.name}: color = {hex_color}")


# Temperature sensor — only TemperatureReadable
class TemperatureSensor(TemperatureReadable):
    def __init__(self, location: str, temp: float):
        self.location = location
        self._temp = temp

    def read_temperature(self) -> float:
        print(f"{self.location}: {self._temp}°C")
        return self._temp


# Client code — uses narrow interfaces
def dim_lights(lights: list[Dimmable], level: int):
    for light in lights:
        light.set_brightness(level)


def get_temps(sensors: list[TemperatureReadable]) -> list[float]:
    return [s.read_temperature() for s in sensors]


plug = SmartPlug("Desk Lamp")
plug.turn_on()

bulb = SmartBulb("Living Room")
bulb.turn_on()
dim_lights([bulb], 50)

sensor = TemperatureSensor("Kitchen", 22.5)
get_temps([sensor])`,
        Go: `package main

import "fmt"

type Switchable interface {
	TurnOn()
	TurnOff()
}

type Dimmable interface {
	SetBrightness(level int)
}

type TemperatureReadable interface {
	ReadTemperature() float64
}

type SmartPlug struct {
	Name string
	IsOn bool
}

func (p *SmartPlug) TurnOn()  { p.IsOn = true; fmt.Printf("%s: ON\\n", p.Name) }
func (p *SmartPlug) TurnOff() { p.IsOn = false; fmt.Printf("%s: OFF\\n", p.Name) }

type SmartBulb struct {
	Name       string
	IsOn       bool
	Brightness int
}

func (b *SmartBulb) TurnOn()               { b.IsOn = true; fmt.Printf("%s: ON\\n", b.Name) }
func (b *SmartBulb) TurnOff()              { b.IsOn = false; fmt.Printf("%s: OFF\\n", b.Name) }
func (b *SmartBulb) SetBrightness(level int) { b.Brightness = level; fmt.Printf("%s: %d%%\\n", b.Name, level) }

type TempSensor struct {
	Location string
	Temp     float64
}

func (t *TempSensor) ReadTemperature() float64 {
	fmt.Printf("%s: %.1f°C\\n", t.Location, t.Temp)
	return t.Temp
}

func DimLights(lights []Dimmable, level int) {
	for _, l := range lights { l.SetBrightness(level) }
}

func main() {
	plug := &SmartPlug{Name: "Desk Lamp"}
	plug.TurnOn()

	bulb := &SmartBulb{Name: "Living Room", Brightness: 100}
	bulb.TurnOn()
	DimLights([]Dimmable{bulb}, 50)
}`,
        Java: `interface Switchable {
    void turnOn();
    void turnOff();
}

interface Dimmable {
    void setBrightness(int level);
}

interface ColorChangeable {
    void setColor(String hex);
}

interface TemperatureReadable {
    double readTemperature();
}

class SmartPlug implements Switchable {
    private final String name;
    private boolean isOn;

    SmartPlug(String name) { this.name = name; }

    public void turnOn()  { isOn = true;  System.out.println(name + ": ON"); }
    public void turnOff() { isOn = false; System.out.println(name + ": OFF"); }
}

class SmartBulb implements Switchable, Dimmable, ColorChangeable {
    private final String name;
    private boolean isOn;
    private int brightness = 100;
    private String color = "#FFFFFF";

    SmartBulb(String name) { this.name = name; }

    public void turnOn()  { isOn = true;  System.out.println(name + ": ON"); }
    public void turnOff() { isOn = false; System.out.println(name + ": OFF"); }
    public void setBrightness(int level) {
        brightness = Math.max(0, Math.min(100, level));
        System.out.println(name + ": " + brightness + "%");
    }
    public void setColor(String hex) {
        color = hex;
        System.out.println(name + ": color=" + hex);
    }
}

class TempSensor implements TemperatureReadable {
    private final String location;
    private final double temp;

    TempSensor(String location, double temp) {
        this.location = location; this.temp = temp;
    }

    public double readTemperature() {
        System.out.printf("%s: %.1f°C%n", location, temp);
        return temp;
    }
}`,
        TypeScript: `interface Switchable {
  turnOn(): void;
  turnOff(): void;
}

interface Dimmable {
  setBrightness(level: number): void;
}

interface ColorChangeable {
  setColor(hex: string): void;
}

interface TemperatureReadable {
  readTemperature(): number;
}

class SmartPlug implements Switchable {
  private isOn = false;
  constructor(private name: string) {}

  turnOn() { this.isOn = true; console.log(\`\${this.name}: ON\`); }
  turnOff() { this.isOn = false; console.log(\`\${this.name}: OFF\`); }
}

class SmartBulb implements Switchable, Dimmable, ColorChangeable {
  private isOn = false;
  private brightness = 100;
  private color = "#FFFFFF";
  constructor(private name: string) {}

  turnOn() { this.isOn = true; console.log(\`\${this.name}: ON\`); }
  turnOff() { this.isOn = false; console.log(\`\${this.name}: OFF\`); }
  setBrightness(level: number) {
    this.brightness = Math.max(0, Math.min(100, level));
    console.log(\`\${this.name}: \${this.brightness}%\`);
  }
  setColor(hex: string) {
    this.color = hex;
    console.log(\`\${this.name}: color=\${hex}\`);
  }
}

class TempSensor implements TemperatureReadable {
  constructor(private location: string, private temp: number) {}

  readTemperature(): number {
    console.log(\`\${this.location}: \${this.temp}°C\`);
    return this.temp;
  }
}

function dimLights(lights: Dimmable[], level: number) {
  lights.forEach(l => l.setBrightness(level));
}

const plug = new SmartPlug("Desk Lamp");
plug.turnOn();

const bulb = new SmartBulb("Living Room");
bulb.turnOn();
dimLights([bulb], 50);`,
        Rust: `trait Switchable {
    fn turn_on(&mut self);
    fn turn_off(&mut self);
}

trait Dimmable {
    fn set_brightness(&mut self, level: u8);
}

trait TemperatureReadable {
    fn read_temperature(&self) -> f64;
}

struct SmartPlug { name: String, is_on: bool }

impl Switchable for SmartPlug {
    fn turn_on(&mut self)  { self.is_on = true;  println!("{}: ON", self.name); }
    fn turn_off(&mut self) { self.is_on = false; println!("{}: OFF", self.name); }
}

struct SmartBulb { name: String, is_on: bool, brightness: u8 }

impl Switchable for SmartBulb {
    fn turn_on(&mut self)  { self.is_on = true;  println!("{}: ON", self.name); }
    fn turn_off(&mut self) { self.is_on = false; println!("{}: OFF", self.name); }
}

impl Dimmable for SmartBulb {
    fn set_brightness(&mut self, level: u8) {
        self.brightness = level.min(100);
        println!("{}: {}%", self.name, self.brightness);
    }
}

struct TempSensor { location: String, temp: f64 }

impl TemperatureReadable for TempSensor {
    fn read_temperature(&self) -> f64 {
        println!("{}: {:.1}°C", self.location, self.temp);
        self.temp
    }
}

fn dim_lights(lights: &mut [&mut dyn Dimmable], level: u8) {
    for light in lights.iter_mut() { light.set_brightness(level); }
}

fn main() {
    let mut plug = SmartPlug { name: "Desk Lamp".into(), is_on: false };
    plug.turn_on();

    let mut bulb = SmartBulb { name: "Living Room".into(), is_on: false, brightness: 100 };
    bulb.turn_on();
    dim_lights(&mut [&mut bulb], 50);
}`,
      },
    },
  ],

  variants: [
    {
      id: 1,
      name: "Role-Based Interfaces",
      description:
        "Each interface represents a role or capability — Printable, Scannable, Faxable. Classes compose their capabilities by implementing multiple role interfaces. This is the classic ISP approach and works naturally in languages that support multiple interface implementation (Java, Go, TypeScript, Rust traits).",
      code: {
        Python: `from abc import ABC, abstractmethod


class Printable(ABC):
    @abstractmethod
    def print_doc(self, doc: str) -> None: ...


class Scannable(ABC):
    @abstractmethod
    def scan(self) -> str: ...


class Faxable(ABC):
    @abstractmethod
    def fax(self, doc: str, number: str) -> None: ...


class SimplePrinter(Printable):
    """Only printing — no scanning or faxing forced."""
    def print_doc(self, doc: str):
        print(f"Printing: {doc}")


class MultiFunctionDevice(Printable, Scannable, Faxable):
    """Implements all three — genuinely supports all."""
    def print_doc(self, doc: str):
        print(f"MFD printing: {doc}")

    def scan(self) -> str:
        return "scanned-document"

    def fax(self, doc: str, number: str):
        print(f"Faxing '{doc}' to {number}")


def print_job(printer: Printable, doc: str):
    printer.print_doc(doc)


print_job(SimplePrinter(), "Hello")
print_job(MultiFunctionDevice(), "Report")`,
        Go: `type Printable interface { PrintDoc(doc string) }
type Scannable interface { Scan() string }
type Faxable  interface { Fax(doc, number string) }

type SimplePrinter struct{}
func (p *SimplePrinter) PrintDoc(doc string) {
	fmt.Println("Printing:", doc)
}

// MultiFunctionDevice composes all three
type MultiFunctionDevice struct{}
func (m *MultiFunctionDevice) PrintDoc(doc string) { fmt.Println("MFD:", doc) }
func (m *MultiFunctionDevice) Scan() string        { return "scanned" }
func (m *MultiFunctionDevice) Fax(doc, num string)  { fmt.Printf("Faxing %s to %s\\n", doc, num) }`,
        Java: `interface Printable { void printDoc(String doc); }
interface Scannable { String scan(); }
interface Faxable  { void fax(String doc, String number); }

class SimplePrinter implements Printable {
    public void printDoc(String doc) { System.out.println("Printing: " + doc); }
}

class MultiFunctionDevice implements Printable, Scannable, Faxable {
    public void printDoc(String doc) { System.out.println("MFD: " + doc); }
    public String scan() { return "scanned"; }
    public void fax(String doc, String number) {
        System.out.printf("Faxing %s to %s%n", doc, number);
    }
}`,
        TypeScript: `interface Printable { printDoc(doc: string): void; }
interface Scannable { scan(): string; }
interface Faxable  { fax(doc: string, number: string): void; }

class SimplePrinter implements Printable {
  printDoc(doc: string) { console.log("Printing:", doc); }
}

class MultiFunctionDevice implements Printable, Scannable, Faxable {
  printDoc(doc: string) { console.log("MFD:", doc); }
  scan() { return "scanned"; }
  fax(doc: string, number: string) { console.log(\`Faxing \${doc} to \${number}\`); }
}

function printJob(printer: Printable, doc: string) { printer.printDoc(doc); }
printJob(new SimplePrinter(), "Hello");
printJob(new MultiFunctionDevice(), "Report");`,
        Rust: `trait Printable { fn print_doc(&self, doc: &str); }
trait Scannable { fn scan(&self) -> String; }
trait Faxable  { fn fax(&self, doc: &str, number: &str); }

struct SimplePrinter;
impl Printable for SimplePrinter {
    fn print_doc(&self, doc: &str) { println!("Printing: {}", doc); }
}

struct MultiFunctionDevice;
impl Printable for MultiFunctionDevice {
    fn print_doc(&self, doc: &str) { println!("MFD: {}", doc); }
}
impl Scannable for MultiFunctionDevice {
    fn scan(&self) -> String { "scanned".into() }
}
impl Faxable for MultiFunctionDevice {
    fn fax(&self, doc: &str, number: &str) { println!("Faxing {} to {}", doc, number); }
}`,
      },
      pros: [
        "Natural fit for OOP languages — cleanly maps capabilities to interfaces",
        "Compile-time safety — a client depending on Printable can't accidentally call scan()",
        "Discoverable — reading the interface list tells you exactly what a class can do",
      ],
      cons: [
        "Can lead to interface explosion if taken to the extreme (one method per interface)",
        "Requires discipline to group methods by client need, not by implementer convenience",
        "May require adapter or composition patterns to bridge between interface slices",
      ],
    },
    {
      id: 2,
      name: "Protocol / Structural Typing",
      description:
        "In languages with structural typing (Go, TypeScript, Python Protocols), ISP happens naturally: clients declare the shape they need, and any object matching that shape satisfies the dependency. No explicit 'implements' keyword needed — the compiler verifies structural compatibility.",
      code: {
        Python: `from typing import Protocol, runtime_checkable


@runtime_checkable
class HasPrice(Protocol):
    @property
    def price(self) -> float: ...


@runtime_checkable
class HasWeight(Protocol):
    @property
    def weight(self) -> float: ...


class Product:
    def __init__(self, name: str, price: float, weight: float):
        self.name = name
        self.price = price
        self.weight = weight


# Client depends on HasPrice — doesn't care about weight
def calculate_total(items: list[HasPrice]) -> float:
    return sum(item.price for item in items)


# Client depends on HasWeight — doesn't care about price
def calculate_shipping(items: list[HasWeight], rate_per_kg: float) -> float:
    return sum(item.weight * rate_per_kg for item in items)


products = [Product("A", 10.0, 0.5), Product("B", 20.0, 1.5)]
print(f"Total: \${calculate_total(products):.2f}")
print(f"Shipping: \${calculate_shipping(products, 5.0):.2f}")` ,
        Go: `// Go interfaces are structurally typed — ISP is idiomatic
type HasPrice interface { Price() float64 }
type HasWeight interface { Weight() float64 }

type Product struct {
	name   string
	price  float64
	weight float64
}

func (p Product) Price() float64  { return p.price }
func (p Product) Weight() float64 { return p.weight }

func CalculateTotal(items []HasPrice) float64 {
	total := 0.0
	for _, item := range items { total += item.Price() }
	return total
}

func CalculateShipping(items []HasWeight, rate float64) float64 {
	total := 0.0
	for _, item := range items { total += item.Weight() * rate }
	return total
}`,
        Java: `// Java uses nominal typing — must explicitly implement
interface HasPrice { double getPrice(); }
interface HasWeight { double getWeight(); }

class Product implements HasPrice, HasWeight {
    private final String name;
    private final double price, weight;

    Product(String name, double price, double weight) {
        this.name = name; this.price = price; this.weight = weight;
    }

    public double getPrice()  { return price; }
    public double getWeight() { return weight; }
}

double totalPrice(List<HasPrice> items) {
    return items.stream().mapToDouble(HasPrice::getPrice).sum();
}`,
        TypeScript: `// TypeScript uses structural typing — ISP is natural
interface HasPrice { price: number; }
interface HasWeight { weight: number; }

const product = { name: "Widget", price: 10, weight: 0.5 };

function calculateTotal(items: HasPrice[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function calculateShipping(items: HasWeight[], rate: number): number {
  return items.reduce((sum, item) => sum + item.weight * rate, 0);
}

// product satisfies both HasPrice and HasWeight structurally
console.log(calculateTotal([product]));
console.log(calculateShipping([product], 5.0));`,
        Rust: `trait HasPrice { fn price(&self) -> f64; }
trait HasWeight { fn weight(&self) -> f64; }

struct Product { name: String, price: f64, weight: f64 }

impl HasPrice for Product { fn price(&self) -> f64 { self.price } }
impl HasWeight for Product { fn weight(&self) -> f64 { self.weight } }

fn total_price(items: &[&dyn HasPrice]) -> f64 {
    items.iter().map(|i| i.price()).sum()
}

fn shipping_cost(items: &[&dyn HasWeight], rate: f64) -> f64 {
    items.iter().map(|i| i.weight() * rate).sum()
}`,
      },
      pros: [
        "Zero boilerplate — no explicit 'implements' declarations needed",
        "Interfaces emerge from client needs, not upfront design",
        "Easy to add new client-specific interfaces without modifying existing code",
      ],
      cons: [
        "Less discoverable — harder to see all capabilities of a type at a glance",
        "Refactoring risk — renaming a method breaks structural compatibility silently",
        "Not available in nominally typed languages like Java (must use explicit interfaces)",
      ],
    },
    {
      id: 3,
      name: "Adapter Composition",
      description:
        "When you can't modify a fat interface (e.g., a third-party library), create thin adapter classes that expose only the subset of methods each client needs. The adapter wraps the fat implementation and delegates to the relevant methods, shielding clients from the full interface.",
      code: {
        Python: `# Third-party library with a fat interface (can't modify)
class ThirdPartyDatabase:
    def query(self, sql: str) -> list:
        return [{"id": 1, "name": "Item"}]

    def execute(self, sql: str) -> int:
        return 1  # affected rows

    def backup(self) -> str:
        return "backup-001"

    def restore(self, backup_id: str) -> None:
        print(f"Restored from {backup_id}")

    def get_stats(self) -> dict:
        return {"connections": 5, "queries": 100}


# Thin adapter — only reading
class ReadOnlyAdapter:
    def __init__(self, db: ThirdPartyDatabase):
        self._db = db

    def query(self, sql: str) -> list:
        return self._db.query(sql)


# Thin adapter — only admin operations
class AdminAdapter:
    def __init__(self, db: ThirdPartyDatabase):
        self._db = db

    def backup(self) -> str:
        return self._db.backup()

    def restore(self, backup_id: str) -> None:
        self._db.restore(backup_id)

    def get_stats(self) -> dict:
        return self._db.get_stats()


# Clients depend on thin adapters
def generate_report(reader: ReadOnlyAdapter):
    data = reader.query("SELECT * FROM orders")
    print(f"Report: {len(data)} rows")


def daily_backup(admin: AdminAdapter):
    backup_id = admin.backup()
    print(f"Backup created: {backup_id}")


db = ThirdPartyDatabase()
generate_report(ReadOnlyAdapter(db))
daily_backup(AdminAdapter(db))`,
        Go: `type ThirdPartyDB struct{}
func (db *ThirdPartyDB) Query(sql string) []map[string]interface{} { return nil }
func (db *ThirdPartyDB) Execute(sql string) int { return 0 }
func (db *ThirdPartyDB) Backup() string { return "bk-1" }
func (db *ThirdPartyDB) Restore(id string) {}

// Thin adapter
type ReadOnly struct { db *ThirdPartyDB }
func (r *ReadOnly) Query(sql string) []map[string]interface{} { return r.db.Query(sql) }

type Admin struct { db *ThirdPartyDB }
func (a *Admin) Backup() string { return a.db.Backup() }`,
        Java: `// Adapter wrapping a fat third-party class
class ReadOnlyAdapter {
    private final ThirdPartyDatabase db;
    ReadOnlyAdapter(ThirdPartyDatabase db) { this.db = db; }
    List<Map<String, Object>> query(String sql) { return db.query(sql); }
}

class AdminAdapter {
    private final ThirdPartyDatabase db;
    AdminAdapter(ThirdPartyDatabase db) { this.db = db; }
    String backup() { return db.backup(); }
    void restore(String id) { db.restore(id); }
}`,
        TypeScript: `class ThirdPartyDatabase {
  query(sql: string): Record<string, unknown>[] { return []; }
  execute(sql: string): number { return 0; }
  backup(): string { return "bk-1"; }
  restore(id: string): void {}
  getStats(): Record<string, number> { return {}; }
}

// Thin adapter — only reading
class ReadOnlyAdapter {
  constructor(private db: ThirdPartyDatabase) {}
  query(sql: string) { return this.db.query(sql); }
}

// Thin adapter — only admin
class AdminAdapter {
  constructor(private db: ThirdPartyDatabase) {}
  backup() { return this.db.backup(); }
  restore(id: string) { this.db.restore(id); }
}

const db = new ThirdPartyDatabase();
const reader = new ReadOnlyAdapter(db);
const admin = new AdminAdapter(db);`,
        Rust: `struct ThirdPartyDB;

impl ThirdPartyDB {
    fn query(&self, _sql: &str) -> Vec<String> { vec![] }
    fn execute(&self, _sql: &str) -> usize { 0 }
    fn backup(&self) -> String { "bk-1".into() }
    fn restore(&self, _id: &str) {}
}

// Thin adapter exposing only read operations
struct ReadOnlyAdapter<'a> { db: &'a ThirdPartyDB }

impl<'a> ReadOnlyAdapter<'a> {
    fn query(&self, sql: &str) -> Vec<String> { self.db.query(sql) }
}

struct AdminAdapter<'a> { db: &'a ThirdPartyDB }

impl<'a> AdminAdapter<'a> {
    fn backup(&self) -> String { self.db.backup() }
    fn restore(&self, id: &str) { self.db.restore(id) }
}`,
      },
      pros: [
        "Works with third-party code you can't modify",
        "Each adapter is a natural ISP boundary — clients see only what they need",
        "Adapters can add validation, logging, or caching without touching the original",
      ],
      cons: [
        "Extra classes to maintain — one adapter per client profile",
        "Adapters may become stale if the underlying API changes",
        "Slight runtime overhead from delegation (negligible in practice)",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Modification Required", "Type Safety", "Discoverability", "Best For",
  ],
  comparisonRows: [
    ["Role Interfaces", "Define upfront", "Compile-time", "Excellent (explicit)", "Greenfield projects, OOP languages"],
    ["Structural Typing", "None (implicit)", "Compile-time", "Moderate (implicit)", "Go, TypeScript, Python Protocols"],
    ["Adapter Composition", "Wrapper classes", "Runtime-safe", "Good (adapter names)", "Third-party / legacy code you can't modify"],
  ],

  summary: [
    { aspect: "Principle Type", detail: "SOLID — I" },
    {
      aspect: "Key Benefit",
      detail:
        "Clients depend only on the methods they use. No empty stubs, no unwanted coupling, no accidental dependency on irrelevant operations. Changes to one interface don't affect unrelated clients.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Interface explosion: splitting every method into its own interface. Group methods that are *always used together by the same client* into one interface. ISP doesn't mean one-method-per-interface.",
    },
    {
      aspect: "vs. Single Responsibility",
      detail:
        "SRP focuses on classes having one reason to change (implementation cohesion). ISP focuses on interfaces being small and client-specific (contract cohesion). They complement each other: SRP for implementation, ISP for API surface.",
    },
    {
      aspect: "vs. Liskov Substitution",
      detail:
        "LSP ensures substitutability of implementations. ISP ensures clients aren't forced to depend on methods they don't use. Both reduce coupling — LSP at the subtype level, ISP at the interface level.",
    },
    {
      aspect: "When to Apply",
      detail:
        "When implementers have empty or throwing stubs. When different clients use different subsets of an interface. When changing one method forces recompilation of unrelated consumers. When testing requires mocking methods the test doesn't care about.",
    },
    {
      aspect: "When NOT to Over-Apply",
      detail:
        "When all methods in an interface are genuinely always used together by every client. When the interface is small already (2-3 cohesive methods). When splitting would create excessive indirection for no real benefit.",
    },
    {
      aspect: "Related Principles",
      detail:
        "SRP (implementation-level ISP), DIP (depend on abstractions — ISP refines which abstractions), OCP (small interfaces are easier to extend without modification). ISP is the interface-level counterpart of SRP.",
    },
  ],

  antiPatterns: [
    {
      name: "Fat Interface",
      description:
        "A single interface with 10+ methods covering multiple unrelated concerns. Every implementer must provide all methods, even if most are irrelevant. Adding a method ripples to all implementers.",
      betterAlternative:
        "Identify client groups and split into focused role interfaces. Each client depends only on the methods it uses.",
    },
    {
      name: "Empty Stub Implementation",
      description:
        "Implementers provide no-op methods (return null, empty collection, or throw UnsupportedOperationException) for interface methods they don't support.",
      betterAlternative:
        "If a class can't meaningfully implement a method, the interface is too broad. Split it so the class only implements interfaces matching its actual capabilities.",
    },
    {
      name: "Interface Explosion",
      description:
        "Over-applying ISP by creating one interface per method, resulting in dozens of single-method interfaces that are hard to discover and compose.",
      betterAlternative:
        "Group methods that are always used together by the same client into one interface. ISP means 'client-specific', not 'one-method-per-interface'.",
    },
    {
      name: "Marker Interface Abuse",
      description:
        "Creating empty interfaces (no methods) just to tag classes, then using instanceof/type checks at runtime to determine capabilities.",
      betterAlternative:
        "Give interfaces meaningful methods. Use capability interfaces (HasPrice, Printable) with actual behavior rather than empty markers with runtime checks.",
    },
  ],
};

export default interfaceSegregationData;
