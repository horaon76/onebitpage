import { PatternData } from "@/lib/patterns/types";

const openClosedData: PatternData = {
  slug: "open-closed",
  categorySlug: "solid",
  categoryLabel: "SOLID",
  title: "Open-Closed Principle (OCP)",
  subtitle:
    "Software entities should be open for extension but closed for modification — add new behavior without changing existing code.",

  intent:
    "When you need to add new behavior (a new payment method, a new alert rule, a new export format), the worst approach is modifying existing code. Every modification risks introducing bugs in already-tested logic. Each change triggers re-testing, re-reviewing, and re-deploying code that was previously stable.\n\nThe Open-Closed Principle states that software entities (classes, modules, functions) should be **open for extension** (you can add new behavior) but **closed for modification** (you don't change existing source code to do it).\n\nThis is achieved through abstraction: define stable interfaces, then add new behavior by implementing those interfaces. The existing code that depends on the abstraction doesn't change — it simply works with the new implementation through polymorphism.\n\nOCP doesn't mean code is never modified — it means the structure anticipates extension, so that the most common kinds of changes don't require modifying existing code.",

  classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .oc-box { rx:6; }
    .oc-title { font: bold 11px 'JetBrains Mono', monospace; }
    .oc-member { font: 10px 'JetBrains Mono', monospace; }
    .oc-arr { stroke-width:1.2; fill:none; stroke-dasharray:5,3; }
    .oc-note { font: italic 9px 'JetBrains Mono', monospace; }
  </style>
  <defs>
    <marker id="oc-tri" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
      <path d="M0,0 L0,8 L10,4 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Interface -->
  <rect x="150" y="10" width="180" height="50" class="oc-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="240" y="28" text-anchor="middle" class="oc-note s-diagram-title">&#171;interface&#187;</text>
  <text x="240" y="42" text-anchor="middle" class="oc-title s-diagram-title">PaymentMethod</text>
  <text x="240" y="55" text-anchor="middle" class="oc-member s-diagram-member">+charge(amount): Receipt</text>
  <!-- Implementations -->
  <rect x="10" y="120" width="110" height="40" class="oc-box s-diagram-box"/>
  <text x="65" y="145" text-anchor="middle" class="oc-title s-diagram-title">CreditCard</text>
  <rect x="130" y="120" width="100" height="40" class="oc-box s-diagram-box"/>
  <text x="180" y="145" text-anchor="middle" class="oc-title s-diagram-title">PayPal</text>
  <rect x="240" y="120" width="100" height="40" class="oc-box s-diagram-box"/>
  <text x="290" y="145" text-anchor="middle" class="oc-title s-diagram-title">Crypto</text>
  <rect x="350" y="120" width="120" height="40" class="oc-box s-diagram-box"/>
  <text x="410" y="145" text-anchor="middle" class="oc-title s-diagram-title">BankTransfer</text>
  <!-- Arrows -->
  <line x1="65" y1="120" x2="200" y2="60" class="oc-arr s-diagram-arrow" marker-end="url(#oc-tri)"/>
  <line x1="180" y1="120" x2="220" y2="60" class="oc-arr s-diagram-arrow" marker-end="url(#oc-tri)"/>
  <line x1="290" y1="120" x2="260" y2="60" class="oc-arr s-diagram-arrow" marker-end="url(#oc-tri)"/>
  <line x1="410" y1="120" x2="300" y2="60" class="oc-arr s-diagram-arrow" marker-end="url(#oc-tri)"/>
  <!-- Note -->
  <text x="240" y="190" text-anchor="middle" class="oc-note s-diagram-member">New payment method = new class, no changes to existing code</text>
</svg>`,

  diagramExplanation:
    "The PaymentMethod interface is the stable abstraction (closed for modification). CreditCard, PayPal, Crypto, and BankTransfer are extensions (open for extension). Adding a new payment method means creating a new class that implements the interface — no existing code changes. The PaymentProcessor depends only on the abstract PaymentMethod, so it works with any implementation without modification.",

  diagramComponents: [
    {
      name: "PaymentMethod (Interface)",
      description:
        "Defines the stable contract: charge(amount) → Receipt. This interface is closed for modification — once published, it doesn't change. All payment processing code depends on this abstraction.",
    },
    {
      name: "CreditCard / PayPal / Crypto",
      description:
        "Concrete implementations of PaymentMethod. Each encapsulates the details of one payment type. New payment types are added by creating new implementations, not modifying existing ones.",
    },
    {
      name: "PaymentProcessor (not shown)",
      description:
        "The consumer that depends on PaymentMethod. Because it depends on the interface, it works with any implementation without code changes — this is the 'closed for modification' part.",
    },
  ],

  solutionDetail:
    "**The Problem:** When adding a new payment type, you modify an existing class — adding another case to an if-else chain or switch statement. Each modification risks breaking existing, tested behavior.\n\n**The OCP Solution:** Define a stable interface (PaymentMethod) and implement each variant as its own class.\n\n**How It Works:**\n\n1. **Identify the axis of change**: What kinds of changes are most likely? New payment methods? New alert rules? New export formats? This is the extension point.\n\n2. **Define an abstraction**: Create an interface or abstract class that captures the common behavior. This is the stable part (closed for modification).\n\n3. **Implement extensions**: Each variant implements the interface. New variants are added without modifying existing code.\n\n4. **Depend on the abstraction**: Consumers use the interface, not concrete classes. They work with any implementation through polymorphism.\n\n5. **Register or inject**: New implementations are registered in a factory, injected via DI, or loaded from configuration.\n\n**Key Insight:** OCP requires anticipating the dimension of change. You can't make code open to every possible extension — you choose which axis (payment methods, rules, formats) to make extensible based on domain knowledge.",

  characteristics: [
    "New behavior is added by creating new types, not modifying existing code",
    "Existing code doesn't need to be retested when new implementations are added",
    "Interfaces or abstract classes define the stable extension point",
    "Polymorphism (inheritance or composition) enables the extension mechanism",
    "Switch statements and if-else chains over type codes are a common OCP violation",
    "Not all code needs to be OCP-compliant — choose extension points strategically",
    'Plugin architectures are OCP at the system level — "extend without recompile"',
  ],

  useCases: [
    {
      id: 1,
      title: "Payment Processing",
      domain: "Fintech",
      description:
        "A payment system supports credit cards, PayPal, crypto, and bank transfers through a common PaymentMethod interface. Adding a new payment type requires zero changes to existing code.",
      whySingleton:
        "Payment methods change frequently. Visa, Apple Pay, crypto wallets — each has its own protocol. OCP ensures that adding Stripe doesn't risk breaking the existing PayPal integration.",
      code: `interface PaymentMethod { charge(amount: number): Receipt; }
class CreditCard implements PaymentMethod { charge(amount) { /* Visa API */ } }
class PayPal implements PaymentMethod { charge(amount) { /* PayPal API */ } }
// NEW: class ApplePay implements PaymentMethod { charge(amount) { /* Apple Pay */ } }`,
    },
    {
      id: 2,
      title: "Clinical Alert Rules",
      domain: "Healthcare",
      description:
        "A patient monitoring system evaluates vital signs against configurable alert rules. Each rule implements an AlertRule interface. New medical conditions are handled by adding new rule classes.",
      whySingleton:
        "Clinical rules evolve with medical knowledge. New conditions (sepsis, ARDS) need new rules. Modifying a shared rules class risks breaking tachycardia detection that's already been validated.",
      code: `interface AlertRule { evaluate(vitals: Vitals): Alert | null; }
class TachycardiaRule implements AlertRule { evaluate(v) { if (v.hr > 100) return alert; } }
class HypertensionRule implements AlertRule { evaluate(v) { if (v.systolic > 140) return alert; } }
// NEW: class SepsisRule implements AlertRule { evaluate(v) { /* complex criteria */ } }`,
    },
    {
      id: 3,
      title: "Export Formatters",
      domain: "Business Intelligence",
      description:
        "A reporting system exports data in multiple formats — CSV, PDF, Excel, JSON. Each format implements an Exporter interface. New formats are added without modifying the report engine.",
      whySingleton:
        "Export format requirements change with customer needs. Adding XML or Parquet shouldn't touch the CSV or PDF exporter. OCP isolates each format.",
      code: `interface Exporter { export(data: ReportData): Buffer; }
class CsvExporter implements Exporter { export(data) { /* CSV logic */ } }
class PdfExporter implements Exporter { export(data) { /* PDF logic */ } }
// NEW: class ParquetExporter implements Exporter { ... }`,
    },
    {
      id: 4,
      title: "Discount Strategies",
      domain: "E-commerce",
      description:
        "An e-commerce system calculates discounts using a DiscountStrategy interface. Seasonal sales, member discounts, and coupon codes are each their own strategy.",
      whySingleton:
        "Marketing creates new promotions constantly. Each promotion is a new DiscountStrategy implementation. The checkout flow doesn't change when a new promotion is launched.",
      code: `interface DiscountStrategy { apply(order: Order): number; }
class SeasonalDiscount implements DiscountStrategy { apply(o) { return o.total * 0.15; } }
class MemberDiscount implements DiscountStrategy { apply(o) { return o.total * 0.10; } }
// NEW: class FlashSale implements DiscountStrategy { ... }`,
    },
    {
      id: 5,
      title: "Logging Sinks",
      domain: "Infrastructure / DevOps",
      description:
        "A logging framework supports multiple sinks — console, file, cloud, database. Each sink implements a LogSink interface. New sinks are plugged in without modifying the logger.",
      whySingleton:
        "Infrastructure evolves: from file logs to Splunk to Datadog. Each migration adds a new sink. The logger core and existing sinks remain untouched.",
      code: `interface LogSink { write(entry: LogEntry): void; }
class ConsoleSink implements LogSink { write(e) { console.log(e); } }
class FileSink implements LogSink { write(e) { fs.appendFile(path, e); } }
// NEW: class DatadogSink implements LogSink { ... }`,
    },
    {
      id: 6,
      title: "Validation Rules",
      domain: "SaaS Platform",
      description:
        "A form validation system applies rules via a ValidationRule interface. Each field type has its own validators. New validation rules don't modify existing ones.",
      whySingleton:
        "Validation requirements evolve with business rules and regulations. Adding phone number validation shouldn't risk breaking email validation. Each rule is self-contained.",
      code: `interface ValidationRule { validate(value: string): string | null; }
class RequiredRule implements ValidationRule { validate(v) { return v ? null : "Required"; } }
class EmailRule implements ValidationRule { validate(v) { return v.includes("@") ? null : "Invalid email"; } }
// NEW: class PhoneRule implements ValidationRule { ... }`,
    },
    {
      id: 7,
      title: "Authentication Providers",
      domain: "Identity / Security",
      description:
        "An auth system supports multiple providers — local password, OAuth2, SAML, LDAP. Each implements an AuthProvider interface. New providers are added without changing the auth flow.",
      whySingleton:
        "Enterprise customers request new SSO providers. Adding SAML shouldn't touch the existing OAuth2 implementation. The login flow works with any AuthProvider.",
      code: `interface AuthProvider { authenticate(credentials): User; }
class LocalAuth implements AuthProvider { authenticate(c) { /* password check */ } }
class OAuth2Provider implements AuthProvider { authenticate(c) { /* OAuth2 flow */ } }
// NEW: class SAMLProvider implements AuthProvider { ... }`,
    },
    {
      id: 8,
      title: "Data Serialization",
      domain: "Data Engineering",
      description:
        "A data pipeline serializes data to multiple formats — JSON, Avro, Protobuf. Each format implements a Serializer interface. New formats are added without modifying the pipeline.",
      whySingleton:
        "Storage and transport format requirements change. Moving from JSON to Protobuf shouldn't require modifying the pipeline orchestration, only registering a new serializer.",
      code: `interface Serializer<T> { serialize(data: T): Buffer; deserialize(buf: Buffer): T; }
class JsonSerializer implements Serializer { serialize(d) { return JSON.stringify(d); } }
class ProtobufSerializer implements Serializer { serialize(d) { /* protobuf */ } }`,
    },
    {
      id: 9,
      title: "Notification Channels",
      domain: "Communication Platform",
      description:
        "A notification system delivers via email, SMS, push, and Slack. Each channel implements a NotificationChannel interface. New channels don't modify existing delivery logic.",
      whySingleton:
        "Communication channels proliferate: Teams, Discord, WhatsApp. Each is a new NotificationChannel. The notification orchestrator routes to channels without modification.",
      code: `interface NotificationChannel { send(recipient, message): void; }
class EmailChannel implements NotificationChannel { send(r, m) { /* SMTP */ } }
class SlackChannel implements NotificationChannel { send(r, m) { /* Slack API */ } }
// NEW: class TeamsChannel implements NotificationChannel { ... }`,
    },
    {
      id: 10,
      title: "Tax Calculation",
      domain: "Fintech / Compliance",
      description:
        "A tax system calculates taxes per jurisdiction. Each jurisdiction implements a TaxCalculator interface. New tax regions are added without modifying the checkout or invoice system.",
      whySingleton:
        "Tax laws change per country and per state. Each jurisdiction's rules are encapsulated in their own class. The invoice system is closed for modification — it uses the TaxCalculator interface.",
      code: `interface TaxCalculator { calculate(amount, items): TaxResult; }
class USTaxCalculator implements TaxCalculator { calculate(a, i) { /* US sales tax */ } }
class EUVatCalculator implements TaxCalculator { calculate(a, i) { /* EU VAT */ } }
// NEW: class IndiaGSTCalculator implements TaxCalculator { ... }`,
    },
    {
      id: 11,
      title: "Middleware Pipeline",
      domain: "Backend / Microservices",
      description:
        "An HTTP framework uses middleware functions that implement a Middleware interface. New middleware (rate limiting, compression, CORS) is added without modifying the pipeline engine.",
      whySingleton:
        "Middleware requirements evolve independently. Adding rate limiting shouldn't require modifying the existing CORS middleware or the pipeline engine. Each middleware is a plugin.",
      code: `interface Middleware { handle(req, res, next): void; }
class CorsMiddleware implements Middleware { handle(r, s, n) { /* set headers */ n(); } }
class AuthMiddleware implements Middleware { handle(r, s, n) { /* verify token */ n(); } }
// NEW: class RateLimitMiddleware implements Middleware { ... }`,
    },
    {
      id: 12,
      title: "Report Generators",
      domain: "Enterprise / Business",
      description:
        "A reporting system generates reports (sales, inventory, financial) via a ReportGenerator interface. New report types are added by implementing the interface, not modifying the reporting engine.",
      whySingleton:
        "Business users request new report types regularly. Each report has its own data queries, aggregations, and formatting. The reporting scheduler and delivery system remain unchanged.",
      code: `interface ReportGenerator { generate(params): Report; }
class SalesReport implements ReportGenerator { generate(p) { /* sales logic */ } }
class InventoryReport implements ReportGenerator { generate(p) { /* inventory logic */ } }
// NEW: class FinancialReport implements ReportGenerator { ... }`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Payment Processing System",
      domain: "Fintech",
      problem:
        "A PaymentProcessor uses an if-else chain to handle credit cards, PayPal, and bank transfers. Adding crypto requires modifying the PaymentProcessor class, risking bugs in existing payment paths and triggering a full re-test.",
      solution:
        "Define a PaymentMethod interface with a charge() method. Each payment type implements this interface. PaymentProcessor depends on the interface, not on concrete types. Adding a new payment type means adding a new class and registering it — zero changes to existing code.",
      classDiagramSvg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .oc-box { rx:6; }
    .oc-title { font: bold 10px 'JetBrains Mono', monospace; }
    .oc-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="150" y="5" width="200" height="50" class="oc-box s-diagram-box"/>
  <text x="250" y="22" text-anchor="middle" class="oc-title s-diagram-title">PaymentProcessor</text>
  <line x1="150" y1="26" x2="350" y2="26" class="s-diagram-line"/>
  <text x="158" y="42" class="oc-member s-diagram-member">+process(method, amount)</text>
  <rect x="155" y="75" width="190" height="35" class="oc-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="250" y="97" text-anchor="middle" class="oc-title s-diagram-title">PaymentMethod</text>
  <rect x="10" y="140" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="65" y="162" text-anchor="middle" class="oc-title s-diagram-title">CreditCard</text>
  <rect x="130" y="140" width="100" height="35" class="oc-box s-diagram-box"/>
  <text x="180" y="162" text-anchor="middle" class="oc-title s-diagram-title">PayPal</text>
  <rect x="240" y="140" width="100" height="35" class="oc-box s-diagram-box"/>
  <text x="290" y="162" text-anchor="middle" class="oc-title s-diagram-title">Crypto</text>
  <rect x="350" y="140" width="140" height="35" class="oc-box s-diagram-box"/>
  <text x="420" y="162" text-anchor="middle" class="oc-title s-diagram-title">BankTransfer</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Receipt:
    method: str
    amount: float
    transaction_id: str

class PaymentMethod(ABC):
    """Stable interface — closed for modification."""
    @abstractmethod
    def charge(self, amount: float) -> Receipt: ...

    @abstractmethod
    def name(self) -> str: ...

class CreditCard(PaymentMethod):
    def __init__(self, number: str, expiry: str):
        self._number = number
        self._expiry = expiry

    def name(self) -> str:
        return "CreditCard"

    def charge(self, amount: float) -> Receipt:
        print(f"Charging \${amount:.2f} to card ending in {self._number[-4:]}")
        return Receipt("CreditCard", amount, f"CC-{id(self)}")

class PayPal(PaymentMethod):
    def __init__(self, email: str):
        self._email = email

    def name(self) -> str:
        return "PayPal"

    def charge(self, amount: float) -> Receipt:
        print(f"Charging \${amount:.2f} via PayPal ({self._email})")
        return Receipt("PayPal", amount, f"PP-{id(self)}")

class Crypto(PaymentMethod):
    def __init__(self, wallet_address: str):
        self._wallet = wallet_address

    def name(self) -> str:
        return "Crypto"

    def charge(self, amount: float) -> Receipt:
        print(f"Sending \${amount:.2f} to wallet {self._wallet[:8]}...")
        return Receipt("Crypto", amount, f"CR-{id(self)}")

class PaymentProcessor:
    """Closed for modification — works with ANY PaymentMethod."""
    def process(self, method: PaymentMethod, amount: float) -> Receipt:
        print(f"Processing \${amount:.2f} via {method.name()}...")
        receipt = method.charge(amount)
        print(f"Success: txn {receipt.transaction_id}")
        return receipt

processor = PaymentProcessor()
processor.process(CreditCard("4111111111111111", "12/26"), 99.99)
processor.process(PayPal("user@paypal.com"), 49.99)
processor.process(Crypto("0xABCDEF1234567890"), 150.00)

# Adding Apple Pay: create a new class, zero changes to PaymentProcessor
# class ApplePay(PaymentMethod): ...`,
        Go: `package main

import "fmt"

type Receipt struct{ Method string; Amount float64; TxnID string }

type PaymentMethod interface {
	Name() string
	Charge(amount float64) Receipt
}

type CreditCard struct{ Number, Expiry string }
func (c CreditCard) Name() string { return "CreditCard" }
func (c CreditCard) Charge(amount float64) Receipt {
	fmt.Printf("Charging $%.2f to card ending in %s\\n", amount, c.Number[len(c.Number)-4:])
	return Receipt{"CreditCard", amount, "CC-001"}
}

type PayPal struct{ Email string }
func (p PayPal) Name() string { return "PayPal" }
func (p PayPal) Charge(amount float64) Receipt {
	fmt.Printf("Charging $%.2f via PayPal (%s)\\n", amount, p.Email)
	return Receipt{"PayPal", amount, "PP-001"}
}

type Crypto struct{ Wallet string }
func (c Crypto) Name() string { return "Crypto" }
func (c Crypto) Charge(amount float64) Receipt {
	fmt.Printf("Sending $%.2f to wallet %s...\\n", amount, c.Wallet[:8])
	return Receipt{"Crypto", amount, "CR-001"}
}

func Process(m PaymentMethod, amount float64) Receipt {
	fmt.Printf("Processing $%.2f via %s...\\n", amount, m.Name())
	return m.Charge(amount)
}

func main() {
	Process(CreditCard{"4111111111111111", "12/26"}, 99.99)
	Process(PayPal{"user@paypal.com"}, 49.99)
	Process(Crypto{"0xABCDEF1234567890"}, 150.00)
}`,
        Java: `interface PaymentMethod {
    String name();
    Receipt charge(double amount);
}

record Receipt(String method, double amount, String txnId) {}

class CreditCard implements PaymentMethod {
    private final String number, expiry;
    CreditCard(String number, String expiry) { this.number = number; this.expiry = expiry; }
    public String name() { return "CreditCard"; }
    public Receipt charge(double amount) {
        System.out.printf("Charging $%.2f to card ending in %s%n", amount, number.substring(number.length()-4));
        return new Receipt("CreditCard", amount, "CC-001");
    }
}

class PayPal implements PaymentMethod {
    private final String email;
    PayPal(String email) { this.email = email; }
    public String name() { return "PayPal"; }
    public Receipt charge(double amount) {
        System.out.printf("Charging $%.2f via PayPal (%s)%n", amount, email);
        return new Receipt("PayPal", amount, "PP-001");
    }
}

class PaymentProcessor {
    Receipt process(PaymentMethod method, double amount) {
        System.out.printf("Processing $%.2f via %s...%n", amount, method.name());
        return method.charge(amount);
    }
}`,
        TypeScript: `interface PaymentMethod {
  name(): string;
  charge(amount: number): Receipt;
}

interface Receipt { method: string; amount: number; txnId: string; }

class CreditCard implements PaymentMethod {
  constructor(private number: string, private expiry: string) {}
  name() { return "CreditCard"; }
  charge(amount: number): Receipt {
    console.log(\`Charging $\${amount.toFixed(2)} to card ending in \${this.number.slice(-4)}\`);
    return { method: "CreditCard", amount, txnId: "CC-001" };
  }
}

class PayPal implements PaymentMethod {
  constructor(private email: string) {}
  name() { return "PayPal"; }
  charge(amount: number): Receipt {
    console.log(\`Charging $\${amount.toFixed(2)} via PayPal (\${this.email})\`);
    return { method: "PayPal", amount, txnId: "PP-001" };
  }
}

class Crypto implements PaymentMethod {
  constructor(private wallet: string) {}
  name() { return "Crypto"; }
  charge(amount: number): Receipt {
    console.log(\`Sending $\${amount.toFixed(2)} to wallet \${this.wallet.slice(0, 8)}...\`);
    return { method: "Crypto", amount, txnId: "CR-001" };
  }
}

class PaymentProcessor {
  process(method: PaymentMethod, amount: number): Receipt {
    console.log(\`Processing $\${amount.toFixed(2)} via \${method.name()}...\`);
    return method.charge(amount);
  }
}`,
        Rust: `struct Receipt { method: String, amount: f64, txn_id: String }

trait PaymentMethod {
    fn name(&self) -> &str;
    fn charge(&self, amount: f64) -> Receipt;
}

struct CreditCard { number: String, expiry: String }
impl PaymentMethod for CreditCard {
    fn name(&self) -> &str { "CreditCard" }
    fn charge(&self, amount: f64) -> Receipt {
        println!("Charging \${:.2} to card ending in {}", amount, &self.number[self.number.len()-4..]);
        Receipt { method: "CreditCard".into(), amount, txn_id: "CC-001".into() }
    }
}

struct PayPal { email: String }
impl PaymentMethod for PayPal {
    fn name(&self) -> &str { "PayPal" }
    fn charge(&self, amount: f64) -> Receipt {
        println!("Charging \${:.2} via PayPal ({})", amount, self.email);
        Receipt { method: "PayPal".into(), amount, txn_id: "PP-001".into() }
    }
}

fn process(method: &dyn PaymentMethod, amount: f64) -> Receipt {
    println!("Processing \${:.2} via {}...", amount, method.name());
    method.charge(amount)
}

fn main() {
    process(&CreditCard { number: "4111111111111111".into(), expiry: "12/26".into() }, 99.99);
    process(&PayPal { email: "user@paypal.com".into() }, 49.99);
}`,
      },
      considerations: [
        "PaymentProcessor never changes when new payment types are added",
        "Each PaymentMethod implementation is independently testable",
        "The interface is the stable contract — it's the 'closed' part",
        "Registration (factory, DI) connects new implementations at runtime",
      ],
    },
    {
      id: 2,
      title: "Clinical Alert Rules Engine",
      domain: "Healthcare",
      problem:
        "A VitalSignMonitor uses a giant switch statement to check for tachycardia, hypertension, and fever. Adding a new alert (e.g., hypoxia) requires modifying the monitor class, risking bugs in existing alert detection that has already been clinically validated.",
      solution:
        "Define an AlertRule interface with an evaluate() method. Each clinical condition is its own rule class. The monitor iterates over registered rules. New conditions are added by implementing AlertRule and registering it.",
      classDiagramSvg: `<svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg">
  <style>
    .oc-box { rx:6; }
    .oc-title { font: bold 10px 'JetBrains Mono', monospace; }
    .oc-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="175" y="5" width="150" height="45" class="oc-box s-diagram-box"/>
  <text x="250" y="22" text-anchor="middle" class="oc-title s-diagram-title">VitalSignMonitor</text>
  <line x1="175" y1="26" x2="325" y2="26" class="s-diagram-line"/>
  <text x="183" y="42" class="oc-member s-diagram-member">+evaluate(vitals, rules)</text>
  <rect x="160" y="70" width="180" height="35" class="oc-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="250" y="92" text-anchor="middle" class="oc-title s-diagram-title">AlertRule</text>
  <rect x="10" y="130" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="65" y="152" text-anchor="middle" class="oc-title s-diagram-title">Tachycardia</text>
  <rect x="130" y="130" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="185" y="152" text-anchor="middle" class="oc-title s-diagram-title">Hypertension</text>
  <rect x="250" y="130" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="295" y="152" text-anchor="middle" class="oc-title s-diagram-title">Fever</text>
  <rect x="350" y="130" width="100" height="35" class="oc-box s-diagram-box"/>
  <text x="400" y="152" text-anchor="middle" class="oc-title s-diagram-title">Hypoxia</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional

@dataclass
class Vitals:
    heart_rate: int
    systolic_bp: int
    temperature: float
    spo2: int  # blood oxygen %

@dataclass
class Alert:
    severity: str  # CRITICAL, WARNING, INFO
    condition: str
    message: str

class AlertRule(ABC):
    @abstractmethod
    def evaluate(self, vitals: Vitals) -> Optional[Alert]: ...

class TachycardiaRule(AlertRule):
    def evaluate(self, vitals: Vitals) -> Optional[Alert]:
        if vitals.heart_rate > 100:
            return Alert("WARNING", "Tachycardia", f"HR={vitals.heart_rate} bpm (>100)")
        return None

class HypertensionRule(AlertRule):
    def evaluate(self, vitals: Vitals) -> Optional[Alert]:
        if vitals.systolic_bp > 140:
            return Alert("WARNING", "Hypertension", f"BP={vitals.systolic_bp} mmHg (>140)")
        return None

class FeverRule(AlertRule):
    def evaluate(self, vitals: Vitals) -> Optional[Alert]:
        if vitals.temperature > 38.5:
            return Alert("WARNING", "Fever", f"Temp={vitals.temperature}°C (>38.5)")
        return None

class HypoxiaRule(AlertRule):
    """NEW rule — no changes to existing code."""
    def evaluate(self, vitals: Vitals) -> Optional[Alert]:
        if vitals.spo2 < 90:
            return Alert("CRITICAL", "Hypoxia", f"SpO2={vitals.spo2}% (<90)")
        return None

class VitalSignMonitor:
    """Closed for modification — evaluates any AlertRule."""
    def evaluate(self, vitals: Vitals, rules: list[AlertRule]) -> list[Alert]:
        alerts = []
        for rule in rules:
            alert = rule.evaluate(vitals)
            if alert:
                alerts.append(alert)
        return alerts

rules = [TachycardiaRule(), HypertensionRule(), FeverRule(), HypoxiaRule()]
vitals = Vitals(heart_rate=115, systolic_bp=150, temperature=39.1, spo2=88)
monitor = VitalSignMonitor()
for alert in monitor.evaluate(vitals, rules):
    print(f"[{alert.severity}] {alert.condition}: {alert.message}")`,
        Go: `package main

import "fmt"

type Vitals struct{ HR, SystolicBP, SpO2 int; Temp float64 }
type Alert struct{ Severity, Condition, Message string }

type AlertRule interface { Evaluate(v Vitals) *Alert }

type TachycardiaRule struct{}
func (r TachycardiaRule) Evaluate(v Vitals) *Alert {
	if v.HR > 100 { return &Alert{"WARNING", "Tachycardia", fmt.Sprintf("HR=%d", v.HR)} }
	return nil
}

type HypertensionRule struct{}
func (r HypertensionRule) Evaluate(v Vitals) *Alert {
	if v.SystolicBP > 140 { return &Alert{"WARNING", "Hypertension", fmt.Sprintf("BP=%d", v.SystolicBP)} }
	return nil
}

type HypoxiaRule struct{}
func (r HypoxiaRule) Evaluate(v Vitals) *Alert {
	if v.SpO2 < 90 { return &Alert{"CRITICAL", "Hypoxia", fmt.Sprintf("SpO2=%d%%", v.SpO2)} }
	return nil
}

func EvaluateAll(vitals Vitals, rules []AlertRule) []*Alert {
	var alerts []*Alert
	for _, r := range rules { if a := r.Evaluate(vitals); a != nil { alerts = append(alerts, a) } }
	return alerts
}

func main() {
	rules := []AlertRule{TachycardiaRule{}, HypertensionRule{}, HypoxiaRule{}}
	for _, a := range EvaluateAll(Vitals{115, 150, 88, 39.1}, rules) {
		fmt.Printf("[%s] %s: %s\\n", a.Severity, a.Condition, a.Message)
	}
}`,
        Java: `interface AlertRule { Alert evaluate(Vitals vitals); }
record Vitals(int hr, int systolicBp, double temp, int spO2) {}
record Alert(String severity, String condition, String message) {}

class TachycardiaRule implements AlertRule {
    public Alert evaluate(Vitals v) {
        return v.hr() > 100 ? new Alert("WARNING", "Tachycardia", "HR=" + v.hr()) : null;
    }
}

class HypertensionRule implements AlertRule {
    public Alert evaluate(Vitals v) {
        return v.systolicBp() > 140 ? new Alert("WARNING", "Hypertension", "BP=" + v.systolicBp()) : null;
    }
}

class HypoxiaRule implements AlertRule {
    public Alert evaluate(Vitals v) {
        return v.spO2() < 90 ? new Alert("CRITICAL", "Hypoxia", "SpO2=" + v.spO2() + "%") : null;
    }
}

class VitalSignMonitor {
    List<Alert> evaluate(Vitals vitals, List<AlertRule> rules) {
        return rules.stream()
            .map(r -> r.evaluate(vitals))
            .filter(Objects::nonNull)
            .toList();
    }
}`,
        TypeScript: `interface Vitals { hr: number; systolicBp: number; temp: number; spO2: number; }
interface Alert { severity: string; condition: string; message: string; }
interface AlertRule { evaluate(v: Vitals): Alert | null; }

class TachycardiaRule implements AlertRule {
  evaluate(v: Vitals) { return v.hr > 100 ? { severity: "WARNING", condition: "Tachycardia", message: \`HR=\${v.hr}\` } : null; }
}

class HypertensionRule implements AlertRule {
  evaluate(v: Vitals) { return v.systolicBp > 140 ? { severity: "WARNING", condition: "Hypertension", message: \`BP=\${v.systolicBp}\` } : null; }
}

class HypoxiaRule implements AlertRule {
  evaluate(v: Vitals) { return v.spO2 < 90 ? { severity: "CRITICAL", condition: "Hypoxia", message: \`SpO2=\${v.spO2}%\` } : null; }
}

class VitalSignMonitor {
  evaluate(vitals: Vitals, rules: AlertRule[]): Alert[] {
    return rules.map(r => r.evaluate(vitals)).filter((a): a is Alert => a !== null);
  }
}`,
        Rust: `struct Vitals { hr: u32, systolic_bp: u32, temp: f64, spo2: u32 }
struct Alert { severity: String, condition: String, message: String }

trait AlertRule { fn evaluate(&self, v: &Vitals) -> Option<Alert>; }

struct TachycardiaRule;
impl AlertRule for TachycardiaRule {
    fn evaluate(&self, v: &Vitals) -> Option<Alert> {
        if v.hr > 100 { Some(Alert { severity: "WARNING".into(), condition: "Tachycardia".into(), message: format!("HR={}", v.hr) }) }
        else { None }
    }
}

struct HypoxiaRule;
impl AlertRule for HypoxiaRule {
    fn evaluate(&self, v: &Vitals) -> Option<Alert> {
        if v.spo2 < 90 { Some(Alert { severity: "CRITICAL".into(), condition: "Hypoxia".into(), message: format!("SpO2={}%", v.spo2) }) }
        else { None }
    }
}

fn evaluate_all(vitals: &Vitals, rules: &[&dyn AlertRule]) -> Vec<Alert> {
    rules.iter().filter_map(|r| r.evaluate(vitals)).collect()
}

fn main() {
    let rules: Vec<&dyn AlertRule> = vec![&TachycardiaRule, &HypoxiaRule];
    let vitals = Vitals { hr: 115, systolic_bp: 150, temp: 39.1, spo2: 88 };
    for a in evaluate_all(&vitals, &rules) {
        println!("[{}] {}: {}", a.severity, a.condition, a.message);
    }
}`,
      },
      considerations: [
        "VitalSignMonitor never changes when new clinical conditions are added",
        "Each rule is independently validated and tested",
        "Rules can be loaded from configuration or registered at runtime",
        "The rule interface is the stable contract — it's the 'closed' part",
      ],
    },
    {
      id: 3,
      title: "Export Format System",
      domain: "Business Intelligence",
      problem:
        "A ReportExporter has a switch statement for CSV, PDF, and Excel. Each new format (JSON, XML, Parquet) requires modifying the exporter, risking bugs in existing format logic.",
      solution:
        "Define an Exporter interface with an export() method. Each format is its own class. The report system asks the factory for the right exporter. New formats are added by implementing the interface.",
      classDiagramSvg: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .oc-box { rx:6; }
    .oc-title { font: bold 10px 'JetBrains Mono', monospace; }
  </style>
  <rect x="175" y="5" width="150" height="35" class="oc-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="250" y="28" text-anchor="middle" class="oc-title s-diagram-title">Exporter</text>
  <rect x="10" y="70" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="55" y="92" text-anchor="middle" class="oc-title s-diagram-title">CsvExporter</text>
  <rect x="110" y="70" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="155" y="92" text-anchor="middle" class="oc-title s-diagram-title">PdfExporter</text>
  <rect x="210" y="70" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="255" y="92" text-anchor="middle" class="oc-title s-diagram-title">ExcelExporter</text>
  <rect x="310" y="70" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="355" y="92" text-anchor="middle" class="oc-title s-diagram-title">JsonExporter</text>
  <rect x="410" y="70" width="90" height="35" class="oc-box s-diagram-box"/>
  <text x="455" y="92" text-anchor="middle" class="oc-title s-diagram-title">ParquetExp</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from typing import Any

class Exporter(ABC):
    @abstractmethod
    def export(self, data: list[dict]) -> bytes: ...

    @abstractmethod
    def content_type(self) -> str: ...

class CsvExporter(Exporter):
    def export(self, data: list[dict]) -> bytes:
        if not data: return b""
        headers = ",".join(data[0].keys())
        rows = "\\n".join(",".join(str(v) for v in row.values()) for row in data)
        return f"{headers}\\n{rows}".encode()
    def content_type(self) -> str:
        return "text/csv"

class JsonExporter(Exporter):
    def export(self, data: list[dict]) -> bytes:
        import json
        return json.dumps(data, indent=2).encode()
    def content_type(self) -> str:
        return "application/json"

class ExporterFactory:
    _exporters: dict[str, type[Exporter]] = {}
    @classmethod
    def register(cls, fmt: str, exporter: type[Exporter]):
        cls._exporters[fmt] = exporter
    @classmethod
    def create(cls, fmt: str) -> Exporter:
        return cls._exporters[fmt]()

ExporterFactory.register("csv", CsvExporter)
ExporterFactory.register("json", JsonExporter)

data = [{"name": "Alice", "revenue": 50000}, {"name": "Bob", "revenue": 30000}]
exporter = ExporterFactory.create("json")
print(exporter.export(data).decode())`,
        Go: `package main

import (
	"encoding/csv"
	"encoding/json"
	"bytes"
	"fmt"
)

type Exporter interface { Export(data []map[string]string) []byte }

type CsvExporter struct{}
func (e CsvExporter) Export(data []map[string]string) []byte {
	var buf bytes.Buffer
	w := csv.NewWriter(&buf)
	if len(data) > 0 {
		keys := make([]string, 0)
		for k := range data[0] { keys = append(keys, k) }
		w.Write(keys)
		for _, row := range data {
			vals := make([]string, len(keys))
			for i, k := range keys { vals[i] = row[k] }
			w.Write(vals)
		}
	}
	w.Flush()
	return buf.Bytes()
}

type JsonExporter struct{}
func (e JsonExporter) Export(data []map[string]string) []byte {
	b, _ := json.MarshalIndent(data, "", "  ")
	return b
}

func main() {
	data := []map[string]string{{"name": "Alice", "revenue": "50000"}}
	exp := JsonExporter{}
	fmt.Println(string(exp.Export(data)))
}`,
        Java: `interface Exporter {
    byte[] export(List<Map<String, Object>> data);
    String contentType();
}

class CsvExporter implements Exporter {
    public byte[] export(List<Map<String, Object>> data) {
        StringBuilder sb = new StringBuilder();
        if (!data.isEmpty()) {
            sb.append(String.join(",", data.get(0).keySet())).append("\\n");
            for (var row : data) {
                sb.append(row.values().stream().map(Object::toString).collect(Collectors.joining(","))).append("\\n");
            }
        }
        return sb.toString().getBytes();
    }
    public String contentType() { return "text/csv"; }
}

class JsonExporter implements Exporter {
    public byte[] export(List<Map<String, Object>> data) {
        return new ObjectMapper().writeValueAsBytes(data);
    }
    public String contentType() { return "application/json"; }
}`,
        TypeScript: `interface Exporter {
  export(data: Record<string, unknown>[]): string;
  contentType(): string;
}

class CsvExporter implements Exporter {
  export(data: Record<string, unknown>[]): string {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(r => Object.values(r).join(",")).join("\\n");
    return \`\${headers}\\n\${rows}\`;
  }
  contentType() { return "text/csv"; }
}

class JsonExporter implements Exporter {
  export(data: Record<string, unknown>[]): string {
    return JSON.stringify(data, null, 2);
  }
  contentType() { return "application/json"; }
}

const registry = new Map<string, () => Exporter>();
registry.set("csv", () => new CsvExporter());
registry.set("json", () => new JsonExporter());

const exporter = registry.get("json")!();
console.log(exporter.export([{ name: "Alice", revenue: 50000 }]));`,
        Rust: `trait Exporter {
    fn export(&self, data: &[std::collections::HashMap<String, String>]) -> String;
}

struct CsvExporter;
impl Exporter for CsvExporter {
    fn export(&self, data: &[std::collections::HashMap<String, String>]) -> String {
        if data.is_empty() { return String::new(); }
        let keys: Vec<&String> = data[0].keys().collect();
        let header = keys.iter().map(|k| k.as_str()).collect::<Vec<_>>().join(",");
        let rows: Vec<String> = data.iter().map(|row| {
            keys.iter().map(|k| row.get(*k).unwrap_or(&String::new()).as_str()).collect::<Vec<_>>().join(",")
        }).collect();
        format!("{}\\n{}", header, rows.join("\\n"))
    }
}

struct JsonExporter;
impl Exporter for JsonExporter {
    fn export(&self, data: &[std::collections::HashMap<String, String>]) -> String {
        format!("{:?}", data)  // simplified
    }
}`,
      },
      considerations: [
        "The factory/registry pattern connects new exporters without modifying existing code",
        "Each exporter handles one format — independently tested and maintained",
        "Content type and export logic are co-located in the same class (SRP)",
        "Adding Parquet means one new class + one factory registration line",
      ],
    },
    {
      id: 4,
      title: "Discount Strategy System",
      domain: "E-commerce",
      problem:
        "A monolithic calculateDiscount() function uses nested if-else statements to handle seasonal sales, member discounts, coupon codes, and flash sales. Every new promotion requires modifying this function.",
      solution:
        "Define a DiscountStrategy interface. Each promotion type is its own strategy. The checkout service applies strategies without knowing their implementation details. New promotions are added as new classes.",
      classDiagramSvg: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .oc-box { rx:6; }
    .oc-title { font: bold 10px 'JetBrains Mono', monospace; }
  </style>
  <rect x="155" y="5" width="190" height="35" class="oc-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="250" y="28" text-anchor="middle" class="oc-title s-diagram-title">DiscountStrategy</text>
  <rect x="10" y="70" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="65" y="92" text-anchor="middle" class="oc-title s-diagram-title">Seasonal</text>
  <rect x="130" y="70" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="185" y="92" text-anchor="middle" class="oc-title s-diagram-title">Member</text>
  <rect x="250" y="70" width="110" height="35" class="oc-box s-diagram-box"/>
  <text x="305" y="92" text-anchor="middle" class="oc-title s-diagram-title">Coupon</text>
  <rect x="370" y="70" width="120" height="35" class="oc-box s-diagram-box"/>
  <text x="430" y="92" text-anchor="middle" class="oc-title s-diagram-title">FlashSale</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Order:
    items: list[dict]
    total: float
    member_tier: str = "none"

class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, order: Order) -> float:
        """Return the discount amount."""
        ...

class SeasonalDiscount(DiscountStrategy):
    def __init__(self, rate: float = 0.15):
        self.rate = rate
    def apply(self, order: Order) -> float:
        return order.total * self.rate

class MemberDiscount(DiscountStrategy):
    RATES = {"gold": 0.10, "silver": 0.05, "none": 0.0}
    def apply(self, order: Order) -> float:
        return order.total * self.RATES.get(order.member_tier, 0.0)

class CouponDiscount(DiscountStrategy):
    def __init__(self, code: str, flat_amount: float):
        self.code = code
        self.amount = flat_amount
    def apply(self, order: Order) -> float:
        return min(self.amount, order.total)

class CheckoutService:
    def calculate_total(self, order: Order, discounts: list[DiscountStrategy]) -> float:
        total_discount = sum(d.apply(order) for d in discounts)
        return max(0, order.total - total_discount)

order = Order(items=[{"name": "Laptop"}], total=1000.0, member_tier="gold")
discounts = [SeasonalDiscount(0.15), MemberDiscount()]
final = CheckoutService().calculate_total(order, discounts)
print(f"Final: \${final:.2f}")  # 1000 - 150 - 100 = 750`,
        Go: `package main

import "fmt"

type Order struct { Total float64; MemberTier string }

type DiscountStrategy interface { Apply(o Order) float64 }

type SeasonalDiscount struct{ Rate float64 }
func (d SeasonalDiscount) Apply(o Order) float64 { return o.Total * d.Rate }

type MemberDiscount struct{}
func (d MemberDiscount) Apply(o Order) float64 {
	rates := map[string]float64{"gold": 0.10, "silver": 0.05}
	return o.Total * rates[o.MemberTier]
}

func CalculateTotal(o Order, discounts []DiscountStrategy) float64 {
	total := o.Total
	for _, d := range discounts { total -= d.Apply(o) }
	if total < 0 { total = 0 }
	return total
}

func main() {
	o := Order{1000.0, "gold"}
	fmt.Printf("Final: $%.2f\\n", CalculateTotal(o, []DiscountStrategy{SeasonalDiscount{0.15}, MemberDiscount{}}))
}`,
        Java: `interface DiscountStrategy { double apply(Order order); }

class SeasonalDiscount implements DiscountStrategy {
    private final double rate;
    SeasonalDiscount(double rate) { this.rate = rate; }
    public double apply(Order order) { return order.getTotal() * rate; }
}

class MemberDiscount implements DiscountStrategy {
    public double apply(Order order) {
        return switch (order.getMemberTier()) {
            case "gold" -> order.getTotal() * 0.10;
            case "silver" -> order.getTotal() * 0.05;
            default -> 0;
        };
    }
}

class CheckoutService {
    double calculateTotal(Order order, List<DiscountStrategy> discounts) {
        double totalDiscount = discounts.stream().mapToDouble(d -> d.apply(order)).sum();
        return Math.max(0, order.getTotal() - totalDiscount);
    }
}`,
        TypeScript: `interface DiscountStrategy { apply(order: { total: number; memberTier: string }): number; }

class SeasonalDiscount implements DiscountStrategy {
  constructor(private rate: number) {}
  apply(order: { total: number }) { return order.total * this.rate; }
}

class MemberDiscount implements DiscountStrategy {
  private rates: Record<string, number> = { gold: 0.10, silver: 0.05 };
  apply(order: { total: number; memberTier: string }) {
    return order.total * (this.rates[order.memberTier] ?? 0);
  }
}

class CheckoutService {
  calculateTotal(order: { total: number; memberTier: string }, discounts: DiscountStrategy[]): number {
    const totalDiscount = discounts.reduce((sum, d) => sum + d.apply(order), 0);
    return Math.max(0, order.total - totalDiscount);
  }
}`,
        Rust: `struct Order { total: f64, member_tier: String }

trait DiscountStrategy { fn apply(&self, order: &Order) -> f64; }

struct SeasonalDiscount { rate: f64 }
impl DiscountStrategy for SeasonalDiscount {
    fn apply(&self, order: &Order) -> f64 { order.total * self.rate }
}

struct MemberDiscount;
impl DiscountStrategy for MemberDiscount {
    fn apply(&self, order: &Order) -> f64 {
        match order.member_tier.as_str() {
            "gold" => order.total * 0.10,
            "silver" => order.total * 0.05,
            _ => 0.0,
        }
    }
}

fn calculate_total(order: &Order, discounts: &[&dyn DiscountStrategy]) -> f64 {
    let total_discount: f64 = discounts.iter().map(|d| d.apply(order)).sum();
    (order.total - total_discount).max(0.0)
}`,
      },
      considerations: [
        "New promotions are new classes — marketing can launch without modifying checkout",
        "Discount strategies compose — apply multiple discounts by passing a list",
        "CheckoutService is closed for modification — it processes any DiscountStrategy",
        "Strategies can be loaded from a database or configuration file at runtime",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Interface-Based Polymorphism",
      description:
        "The classic OCP approach: define an interface, implement it for each variant. Consumers depend on the interface and work with any implementation through polymorphism. New variants require zero changes to existing code.",
      code: {
        Python: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, radius: float): self.radius = radius
    def area(self) -> float: return 3.14159 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, w: float, h: float): self.w, self.h = w, h
    def area(self) -> float: return self.w * self.h

# NEW — no changes to existing code
class Triangle(Shape):
    def __init__(self, b: float, h: float): self.b, self.h = b, h
    def area(self) -> float: return 0.5 * self.b * self.h

def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)

print(total_area([Circle(5), Rectangle(3, 4), Triangle(6, 8)]))`,
        Go: `type Shape interface { Area() float64 }

type Circle struct{ Radius float64 }
func (c Circle) Area() float64 { return 3.14159 * c.Radius * c.Radius }

type Rectangle struct{ W, H float64 }
func (r Rectangle) Area() float64 { return r.W * r.H }

func TotalArea(shapes []Shape) float64 {
	sum := 0.0
	for _, s := range shapes { sum += s.Area() }
	return sum
}`,
        Java: `interface Shape { double area(); }
record Circle(double radius) implements Shape { public double area() { return Math.PI * radius * radius; } }
record Rectangle(double w, double h) implements Shape { public double area() { return w * h; } }
// NEW: record Triangle(double b, double h) implements Shape { public double area() { return 0.5 * b * h; } }`,
        TypeScript: `interface Shape { area(): number; }
class Circle implements Shape {
  constructor(private radius: number) {}
  area() { return Math.PI * this.radius ** 2; }
}
class Rectangle implements Shape {
  constructor(private w: number, private h: number) {}
  area() { return this.w * this.h; }
}
function totalArea(shapes: Shape[]): number { return shapes.reduce((sum, s) => sum + s.area(), 0); }`,
        Rust: `trait Shape { fn area(&self) -> f64; }
struct Circle { radius: f64 }
impl Shape for Circle { fn area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius } }
struct Rectangle { w: f64, h: f64 }
impl Shape for Rectangle { fn area(&self) -> f64 { self.w * self.h } }
fn total_area(shapes: &[&dyn Shape]) -> f64 { shapes.iter().map(|s| s.area()).sum() }`,
      },
      pros: [
        "Pure polymorphism — no conditionals on type",
        "Each implementation is independently testable",
        "Strong type safety — compiler enforces the contract",
      ],
      cons: [
        "Requires anticipating the abstraction — must design the interface up front",
        "Adding methods to the interface can break all implementations",
        "May feel heavyweight for simple cases with only 2-3 variants",
      ],
    },
    {
      id: 2,
      name: "Plugin / Registry Pattern",
      description:
        "Implementations are registered at runtime rather than being hardcoded. A registry (map or service locator) holds implementations keyed by identifier. New implementations are registered without modifying existing code — true 'open without recompile'.",
      code: {
        Python: `from typing import Callable, Any

# Plugin registry
_plugins: dict[str, Callable[..., Any]] = {}

def register(name: str):
    def decorator(fn: Callable):
        _plugins[name] = fn
        return fn
    return decorator

def execute(name: str, *args, **kwargs):
    return _plugins[name](*args, **kwargs)

@register("greet")
def greet_english(name: str) -> str:
    return f"Hello, {name}!"

@register("greet_es")
def greet_spanish(name: str) -> str:
    return f"¡Hola, {name}!"

# NEW: just register, nothing else changes
@register("greet_fr")
def greet_french(name: str) -> str:
    return f"Bonjour, {name}!"

for key in ["greet", "greet_es", "greet_fr"]:
    print(execute(key, "World"))`,
        Go: `var registry = map[string]func(string) string{}

func Register(name string, fn func(string) string) { registry[name] = fn }
func Execute(name, arg string) string { return registry[name](arg) }

func init() {
	Register("greet", func(name string) string { return "Hello, " + name + "!" })
	Register("greet_es", func(name string) string { return "¡Hola, " + name + "!" })
}`,
        Java: `class PluginRegistry {
    private static final Map<String, Function<String, String>> plugins = new HashMap<>();
    static void register(String name, Function<String, String> fn) { plugins.put(name, fn); }
    static String execute(String name, String arg) { return plugins.get(name).apply(arg); }
}`,
        TypeScript: `const registry = new Map<string, (...args: unknown[]) => unknown>();
function register(name: string, fn: (...args: unknown[]) => unknown) { registry.set(name, fn); }
function execute(name: string, ...args: unknown[]) { return registry.get(name)!(...args); }

register("greet", (name: unknown) => \`Hello, \${name}!\`);
register("greet_es", (name: unknown) => \`¡Hola, \${name}!\`);
// NEW: register("greet_fr", (name) => \`Bonjour, \${name}!\`);`,
        Rust: `use std::collections::HashMap;

type Plugin = Box<dyn Fn(&str) -> String>;

struct Registry { plugins: HashMap<String, Plugin> }
impl Registry {
    fn new() -> Self { Self { plugins: HashMap::new() } }
    fn register(&mut self, name: &str, f: impl Fn(&str) -> String + 'static) {
        self.plugins.insert(name.to_string(), Box::new(f));
    }
    fn execute(&self, name: &str, arg: &str) -> String {
        (self.plugins[name])(arg)
    }
}`,
      },
      pros: [
        "True runtime extension — add behavior without recompilation",
        "Decoupled — the registrant and the consumer never reference each other",
        "Natural fit for plugin architectures and micro-frontends",
      ],
      cons: [
        "Loses compile-time type safety — errors surface at runtime",
        "More complex debugging — registration order and lifecycle matter",
        "Requires a discovery mechanism (scanning, config, or explicit registration)",
      ],
    },
    {
      id: 3,
      name: "Decorator / Wrapper Chain",
      description:
        "Extend behavior by wrapping existing functionality with decorators. Each decorator adds behavior before or after the wrapped function. OCP is satisfied because existing behavior is not modified — only wrapped.",
      code: {
        Python: `from functools import wraps

def log_calls(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print(f"CALL: {fn.__name__}({args}, {kwargs})")
        result = fn(*args, **kwargs)
        print(f"RETURN: {result}")
        return result
    return wrapper

def validate_positive(fn):
    @wraps(fn)
    def wrapper(amount: float, *args, **kwargs):
        if amount <= 0: raise ValueError("Amount must be positive.")
        return fn(amount, *args, **kwargs)
    return wrapper

@log_calls
@validate_positive
def charge(amount: float) -> str:
    return f"Charged \${amount:.2f}"

# charge() is extended WITHOUT modification
charge(99.99)`,
        Go: `type ChargeFunc func(float64) string

func WithLogging(fn ChargeFunc) ChargeFunc {
	return func(amount float64) string {
		fmt.Printf("CALL: charge(%.2f)\\n", amount)
		result := fn(amount)
		fmt.Printf("RETURN: %s\\n", result)
		return result
	}
}

func WithValidation(fn ChargeFunc) ChargeFunc {
	return func(amount float64) string {
		if amount <= 0 { panic("amount must be positive") }
		return fn(amount)
	}
}

func charge(amount float64) string { return fmt.Sprintf("Charged $%.2f", amount) }

// Compose: fn = WithLogging(WithValidation(charge))`,
        Java: `interface Charger { String charge(double amount); }

class BasicCharger implements Charger {
    public String charge(double amount) { return String.format("Charged $%.2f", amount); }
}

class LoggingCharger implements Charger {
    private final Charger delegate;
    LoggingCharger(Charger delegate) { this.delegate = delegate; }
    public String charge(double amount) {
        System.out.printf("CALL: charge(%.2f)%n", amount);
        String result = delegate.charge(amount);
        System.out.println("RETURN: " + result);
        return result;
    }
}`,
        TypeScript: `type ChargeFn = (amount: number) => string;

function withLogging(fn: ChargeFn): ChargeFn {
  return (amount) => {
    console.log(\`CALL: charge(\${amount})\`);
    const result = fn(amount);
    console.log(\`RETURN: \${result}\`);
    return result;
  };
}

function withValidation(fn: ChargeFn): ChargeFn {
  return (amount) => {
    if (amount <= 0) throw new Error("Amount must be positive.");
    return fn(amount);
  };
}

const charge: ChargeFn = (amount) => \`Charged $\${amount.toFixed(2)}\`;
const enhanced = withLogging(withValidation(charge));
enhanced(99.99);`,
        Rust: `fn charge(amount: f64) -> String { format!("Charged \${:.2}", amount) }

fn with_logging(f: impl Fn(f64) -> String) -> impl Fn(f64) -> String {
    move |amount| {
        println!("CALL: charge({:.2})", amount);
        let result = f(amount);
        println!("RETURN: {}", result);
        result
    }
}

fn with_validation(f: impl Fn(f64) -> String) -> impl Fn(f64) -> String {
    move |amount| {
        if amount <= 0.0 { panic!("Amount must be positive."); }
        f(amount)
    }
}

fn main() {
    let enhanced = with_logging(with_validation(charge));
    enhanced(99.99);
}`,
      },
      pros: [
        "Existing functions are never modified — only wrapped",
        "Decorators compose naturally — stack them in any order",
        "Works with functions, classes, or objects — very flexible",
      ],
      cons: [
        "Deep decorator chains can be hard to debug",
        "Order of decoration matters and may not be obvious",
        "Performance overhead from multiple layers of wrapping",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Extension Mechanism", "Type Safety", "Runtime Flexibility", "Best For",
  ],
  comparisonRows: [
    ["Interface Polymorphism", "New class implementing interface", "Strong (compile-time)", "Medium", "Domain models with clear abstractions"],
    ["Plugin / Registry", "Register function/class at runtime", "Weak (runtime)", "High", "Plugin systems, user-extensible platforms"],
    ["Decorator / Wrapper", "Wrap existing behavior", "Medium", "High", "Cross-cutting concerns (logging, validation, caching)"],
  ],

  summary: [
    { aspect: "Principle Type", detail: "SOLID — O" },
    {
      aspect: "Key Benefit",
      detail:
        "New behavior is added without modifying existing code. This reduces regression risk, eliminates re-testing of stable code, and enables parallel development — teams can add features independently.",
    },
    {
      aspect: "Core Mechanism",
      detail:
        "Abstraction. Define stable interfaces (closed for modification). Implement new behavior by creating new types that satisfy the interface (open for extension). Polymorphism connects them.",
    },
    {
      aspect: "Common Violation",
      detail:
        "Switch statements or if-else chains that check type codes. Adding a new type requires modifying the switch — violating OCP. Replace with polymorphism.",
    },
    {
      aspect: "vs. Strategy Pattern",
      detail:
        "Strategy pattern is a specific implementation of OCP. The context class (closed) delegates to strategy interface implementations (open). OCP is the principle; Strategy is one way to achieve it.",
    },
    {
      aspect: "Judgment Required",
      detail:
        "You can't make code open to every possible extension. Choose extension points based on domain knowledge — where change is most likely. Over-abstraction is worse than a well-placed if-else.",
    },
    {
      aspect: "Related Principles",
      detail:
        "SRP (each extension has one reason to change), LSP (extensions must be substitutable), DIP (depend on abstractions to enable extension). OCP is the central organizing principle.",
    },
  ],

  antiPatterns: [
    {
      name: "Type Code Switch",
      description:
        'A switch/if-else chain that selects behavior based on a type field: `if (type == "credit") ... else if (type == "paypal") ...`. Every new type requires modifying this code.',
      betterAlternative:
        "Replace the type code with a polymorphic interface. Each type becomes a class. The switch is replaced by a method call on the interface.",
    },
    {
      name: "Premature Abstraction",
      description:
        "Creating interfaces for everything 'just in case'. Over-abstraction when there's only one implementation leads to unnecessary complexity.",
      betterAlternative:
        "Apply OCP where change is most likely (based on domain knowledge). Start concrete, abstract when the second or third variant appears.",
    },
    {
      name: "Leaky Abstraction",
      description:
        "An interface that exposes implementation details (e.g., PaymentMethod.getSQLQuery()). New implementations are forced to pretend they have SQL, violating substitutability.",
      betterAlternative:
        "Keep interfaces at the right level of abstraction. charge(amount) is good. getSQLQuery() leaks the persistence mechanism.",
    },
    {
      name: "Modification Through Configuration",
      description:
        "Claiming OCP compliance because behavior changes via config, but the code that reads the config is a giant conditional that must be modified for each new option.",
      betterAlternative:
        "Use a registry pattern: config maps to a class name or factory. The code that reads config doesn't contain conditionals — it looks up and instantiates.",
    },
  ],
};

export default openClosedData;
