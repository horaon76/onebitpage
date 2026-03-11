import { PatternData } from "@/lib/patterns/types";

const factoryMethodData: PatternData = {
  slug: "factory-method",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Factory Method Pattern",
  subtitle:
    "Define an interface for creating an object, but let subclasses decide which class to instantiate.",

  intent:
    "The Factory Method pattern defines an interface for creating an object but lets subclasses decide which class to instantiate. It promotes loose coupling by eliminating the need to bind application-specific classes into the creation code, deferring instantiation to specialized factory subclasses. This is essential when a class cannot anticipate the exact type of object it needs, or when you want to localize the knowledge of which class to instantiate.",

  classDiagramSvg: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-arr); }
    .s-dash { stroke-dasharray:6,3; }
  </style>
  <defs>
    <marker id="fm-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker>
    <marker id="fm-tri" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L0,10 L10,5 z" fill="none" class="s-diagram-arrow" stroke-width="1"/></marker>
  </defs>
  <!-- Creator (abstract) -->
  <rect x="140" y="10" width="240" height="60" class="s-box s-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;abstract&gt;&gt; Creator</text>
  <line x1="140" y1="32" x2="380" y2="32" class="s-diagram-line"/>
  <text x="150" y="46" class="s-member s-diagram-member">+factoryMethod(): Product</text>
  <text x="150" y="58" class="s-member s-diagram-member">+someOperation(): void</text>
  <!-- ConcreteCreatorA -->
  <rect x="20" y="110" width="200" height="44" class="s-box s-diagram-box"/>
  <text x="120" y="128" text-anchor="middle" class="s-title s-diagram-title">ConcreteCreatorA</text>
  <line x1="20" y1="132" x2="220" y2="132" class="s-diagram-line"/>
  <text x="30" y="146" class="s-member s-diagram-member">+factoryMethod(): Product</text>
  <!-- ConcreteCreatorB -->
  <rect x="300" y="110" width="200" height="44" class="s-box s-diagram-box"/>
  <text x="400" y="128" text-anchor="middle" class="s-title s-diagram-title">ConcreteCreatorB</text>
  <line x1="300" y1="132" x2="500" y2="132" class="s-diagram-line"/>
  <text x="310" y="146" class="s-member s-diagram-member">+factoryMethod(): Product</text>
  <!-- Inheritance arrows -->
  <line x1="120" y1="110" x2="220" y2="70" class="s-arr s-diagram-arrow"/>
  <line x1="400" y1="110" x2="310" y2="70" class="s-arr s-diagram-arrow"/>
  <!-- Product interface -->
  <rect x="170" y="198" width="180" height="44" class="s-box s-diagram-box"/>
  <text x="260" y="216" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Product</text>
  <line x1="170" y1="220" x2="350" y2="220" class="s-diagram-line"/>
  <text x="180" y="234" class="s-member s-diagram-member">+execute(): void</text>
  <!-- creates arrow -->
  <line x1="260" y1="70" x2="260" y2="198" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Creator declares the factory method that returns new product objects. Its subclasses override the factory method to produce different types of products. The client code (someOperation) calls the factory method to get a Product without knowing which concrete class was instantiated. This decouples the creation logic from the usage logic — new product types require only a new ConcreteCreator subclass, not changes to existing client code.",

  diagramComponents: [
    {
      name: "Creator (Abstract)",
      description:
        "Declares the factoryMethod() that returns a Product. May also define default behavior in someOperation() that uses the product.",
    },
    {
      name: "ConcreteCreatorA / B",
      description:
        "Override factoryMethod() to instantiate and return a specific product type. Each creator is responsible for exactly one product variant.",
    },
    {
      name: "Product (Interface)",
      description:
        "Defines the interface that all concrete products must implement. The creator and client code depend only on this abstraction.",
    },
    {
      name: "ConcreteProducts",
      description:
        "Implement the Product interface with specific behavior. Created by their corresponding ConcreteCreator.",
    },
    {
      name: "factoryMethod()",
      description:
        "The core of the pattern — a method declared in the Creator but overridden in subclasses to produce different products.",
    },
    {
      name: "someOperation()",
      description:
        "Client-facing method in the Creator that calls factoryMethod() internally. The caller never sees which concrete product is used.",
    },
    {
      name: "Dashed Arrow (creates)",
      description:
        "Indicates a dependency relationship — the Creator depends on the Product interface, not on concrete products.",
    },
  ],

  solutionDetail:
    "**The Problem:** Client code needs to create objects, but the exact class depends on runtime conditions — configuration, user input, or environment. Hard-coding `new ConcreteClass()` throughout the codebase creates tight coupling and makes adding new types a cross-cutting change.\n\n**The Factory Method Solution:** Define an abstract Creator class with a `factoryMethod()` that returns the Product interface. Each ConcreteCreator overrides this method to instantiate a specific product. Client code calls `creator.someOperation()`, which internally calls `factoryMethod()` — the client never knows which concrete product was created.\n\n**Why It Works:** The pattern leverages polymorphism to defer instantiation. When you need a new product type, you add a new ConcreteCreator subclass and a new ConcreteProduct — no existing code changes. This directly satisfies the Open/Closed Principle.\n\n**The Trade-off:** Each new product type requires a parallel creator class, which can lead to class proliferation. For simple cases, a parameterized factory (passing a type enum) or a simple map/registry may be more practical than a full class hierarchy.\n\n**When It Shines:** The Factory Method is most powerful when object creation is complex (multi-step initialization, external resource acquisition), when different environments need different implementations (test vs. production), or when frameworks need to let user code define the objects they create (plugin architectures).",

  characteristics: [
    "Decouples client code from concrete product classes — client depends only on the Product interface",
    "Each new product type requires only a new creator subclass — follows Open/Closed Principle",
    "Useful when the creation logic is complex or depends on runtime configuration",
    "Can be combined with a registry or configuration to select creators dynamically",
    "Provides a hook for subclasses — a framework can define the workflow while letting apps customize the objects",
    "Adds indirection; avoid when a simple constructor or map suffices",
    "Often the 'virtual constructor' referred to in the GoF book",
  ],

  // ─── USE CASES ────────────────────────────────────────────────
  useCases: [
    {
      id: 1,
      title: "Payment Processor Selection",
      domain: "Fintech",
      description:
        "A checkout service must support Stripe, PayPal, and wire transfers. Each processor has different APIs, auth flows, and settlement timelines.",
      whySingleton:
        "Factory Method lets a PaymentProcessorFactory return the correct processor based on payment type, keeping checkout logic processor-agnostic.",
    },
    {
      id: 2,
      title: "Database Driver Instantiation",
      domain: "Backend Infrastructure",
      description:
        "An ORM needs to support PostgreSQL, MySQL, and SQLite. Each driver has different connection parameters, query dialects, and pooling strategies.",
      whySingleton:
        "A DatabaseDriverFactory returns the correct driver based on a config string, isolating dialect-specific code from the query engine.",
    },
    {
      id: 3,
      title: "Medical Report Generation",
      domain: "Healthcare",
      description:
        "A hospital system generates lab reports (HL7 CDA), radiology reports (DICOM SR), and pathology reports (CAP Synoptic) — each with different regulatory formats.",
      whySingleton:
        "A ReportFactory lets the system produce the correct report type without coupling the report service to format-specific rendering.",
    },
    {
      id: 4,
      title: "Notification Channel Dispatch",
      domain: "E-Commerce",
      description:
        "Order confirmations and shipping alerts are sent via email, SMS, and push. Each channel has different APIs, rate limits, and payload formats.",
      whySingleton:
        "A NotificationChannelFactory creates the correct channel — the dispatch service works with a uniform interface regardless of channel.",
    },
    {
      id: 5,
      title: "Shipping Carrier Integration",
      domain: "Logistics",
      description:
        "Parcels route through air, sea, and ground carriers with different manifests, customs forms, and tracking APIs.",
      whySingleton:
        "A ShipmentHandlerFactory returns carrier-specific handlers. Routing logic selects the factory; handlers encapsulate their carrier's rules.",
    },
    {
      id: 6,
      title: "Content Encoder Pipeline",
      domain: "Media & Streaming",
      description:
        "Uploaded content must be transcoded to H.264, AAC, or WebVTT. Each codec has different dependencies and hardware acceleration options.",
      whySingleton:
        "An EncoderFactory produces the right encoder — the pipeline orchestrator doesn't need to know which codec library is used.",
    },
    {
      id: 7,
      title: "Authentication Provider",
      domain: "Identity & Access",
      description:
        "Login supports OAuth (Google, GitHub), SAML (enterprise SSO), and username/password. Each has different token flows and validation logic.",
      whySingleton:
        "An AuthProviderFactory creates the correct authentication handler based on the login request type.",
    },
    {
      id: 8,
      title: "Document Export Format",
      domain: "SaaS / Productivity",
      description:
        "A document editor exports to PDF, DOCX, and HTML. Each format has different rendering engines, font embedding, and layout rules.",
      whySingleton:
        "An ExportFactory creates the correct exporter — the export dialog doesn't know about format-specific rendering details.",
    },
    {
      id: 9,
      title: "Cloud Storage Provider",
      domain: "Cloud Infrastructure",
      description:
        "An app stores files on S3, GCS, or Azure Blob. Each provider has different SDKs, authentication, and API semantics.",
      whySingleton:
        "A StorageFactory produces the correct provider adapter — the file service calls upload/download on a uniform interface.",
    },
    {
      id: 10,
      title: "Vehicle Type in Ride-Sharing",
      domain: "Transportation",
      description:
        "A ride-sharing app offers Economy, SUV, and Luxury tiers. Each vehicle type has different fare calculations, matching rules, and driver requirements.",
      whySingleton:
        "A VehicleFactory creates the correct vehicle handler for fare calculation and matching without coupling the booking flow to specific vehicle logic.",
    },
    {
      id: 11,
      title: "Game Character Creation",
      domain: "Gaming",
      description:
        "An RPG game creates Warrior, Mage, and Archer characters. Each class has different stats, abilities, and equipment slots.",
      whySingleton:
        "A CharacterFactory creates the correct character with pre-configured abilities — the game loop uses the Character interface uniformly.",
    },
    {
      id: 12,
      title: "Test Data Generator",
      domain: "DevOps / Testing",
      description:
        "Integration tests need realistic test data — user profiles, orders, transactions — that conform to schema constraints and business rules.",
      whySingleton:
        "A TestDataFactory produces domain-specific generators. Adding a new entity type means adding a new factory, not modifying the test framework.",
    },
  ],

  // ─── EXAMPLES ─────────────────────────────────────────────────
  examples: [
    {
      id: 1,
      title: "Fintech — Payment Processor Creator",
      domain: "Fintech",
      problem:
        "A fintech checkout service must support multiple payment processors — Stripe for card payments, PayPal for wallet transactions, and wire transfers for high-value B2B orders. Hard-coding processor selection into checkout logic makes adding new processors (e.g., crypto) a risky, cross-cutting change.",
      solution:
        "A PaymentProcessorFactory declares the factory method. Each subclass — StripeProcessorFactory, PayPalProcessorFactory, WireTransferFactory — instantiates the corresponding processor. The checkout service depends only on the abstract factory and product interfaces.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-e1); }
  </style>
  <defs><marker id="fm-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="150" y="8" width="220" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">ProcessorFactory</text>
  <line x1="150" y1="28" x2="370" y2="28" class="s-diagram-line"/>
  <text x="160" y="42" class="s-member s-diagram-member">+createProcessor(): PaymentProcessor</text>
  <rect x="5" y="90" width="160" height="36" class="s-box s-diagram-box"/>
  <text x="85" y="112" text-anchor="middle" class="s-title s-diagram-title">StripeFactory</text>
  <rect x="180" y="90" width="160" height="36" class="s-box s-diagram-box"/>
  <text x="260" y="112" text-anchor="middle" class="s-title s-diagram-title">PayPalFactory</text>
  <rect x="355" y="90" width="160" height="36" class="s-box s-diagram-box"/>
  <text x="435" y="112" text-anchor="middle" class="s-title s-diagram-title">WireTransferFactory</text>
  <line x1="85" y1="90" x2="210" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="260" y1="90" x2="260" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="435" y1="90" x2="320" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="130" y="155" width="260" height="36" class="s-box s-diagram-box"/>
  <text x="260" y="177" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; PaymentProcessor</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Factory Method — Payment Processor Creator
# Each factory subclass creates a specific processor type.

class PaymentProcessor(ABC):
    """Product interface — all processors implement charge()."""
    @abstractmethod
    def charge(self, amount_cents: int, currency: str) -> str: ...

class StripeProcessor(PaymentProcessor):
    def charge(self, amount_cents: int, currency: str) -> str:
        return f"Stripe charged {amount_cents} {currency} via card tokenization"

class PayPalProcessor(PaymentProcessor):
    def charge(self, amount_cents: int, currency: str) -> str:
        return f"PayPal charged {amount_cents} {currency} via wallet redirect"

class WireTransferProcessor(PaymentProcessor):
    def charge(self, amount_cents: int, currency: str) -> str:
        return f"Wire transferred {amount_cents} {currency} via SWIFT"

class ProcessorFactory(ABC):
    """Creator — declares the factory method."""
    @abstractmethod
    def create_processor(self) -> PaymentProcessor: ...

    def process_payment(self, amount: int, currency: str) -> str:
        """Template using the factory method."""
        processor = self.create_processor()
        return processor.charge(amount, currency)

class StripeFactory(ProcessorFactory):
    def create_processor(self) -> PaymentProcessor:
        return StripeProcessor()

class PayPalFactory(ProcessorFactory):
    def create_processor(self) -> PaymentProcessor:
        return PayPalProcessor()

# ── Usage ──
factory: ProcessorFactory = StripeFactory()
print(factory.process_payment(5000, "USD"))`,
        Go: `package main

import "fmt"

// PaymentProcessor — Product interface
type PaymentProcessor interface {
	Charge(amountCents int, currency string) string
}

type StripeProcessor struct{}
func (s StripeProcessor) Charge(amountCents int, currency string) string {
	return fmt.Sprintf("Stripe charged %d %s via card tokenization", amountCents, currency)
}

type PayPalProcessor struct{}
func (p PayPalProcessor) Charge(amountCents int, currency string) string {
	return fmt.Sprintf("PayPal charged %d %s via wallet redirect", amountCents, currency)
}

// ProcessorFactory — Creator interface
type ProcessorFactory interface {
	CreateProcessor() PaymentProcessor
}

type StripeFactory struct{}
func (sf StripeFactory) CreateProcessor() PaymentProcessor { return StripeProcessor{} }

type PayPalFactory struct{}
func (pf PayPalFactory) CreateProcessor() PaymentProcessor { return PayPalProcessor{} }

func checkout(factory ProcessorFactory, amount int, currency string) {
	processor := factory.CreateProcessor()
	fmt.Println(processor.Charge(amount, currency))
}

func main() {
	checkout(StripeFactory{}, 5000, "USD")
	checkout(PayPalFactory{}, 3000, "EUR")
}`,
        Java: `/**
 * Factory Method — Payment Processor Creator.
 * Each factory subclass creates a specific processor.
 */
interface PaymentProcessor {
    String charge(int amountCents, String currency);
}

class StripeProcessor implements PaymentProcessor {
    public String charge(int amountCents, String currency) {
        return "Stripe charged " + amountCents + " " + currency + " via card tokenization";
    }
}

class PayPalProcessor implements PaymentProcessor {
    public String charge(int amountCents, String currency) {
        return "PayPal charged " + amountCents + " " + currency + " via wallet redirect";
    }
}

abstract class ProcessorFactory {
    abstract PaymentProcessor createProcessor();

    /** Template method that uses the factory method. */
    String processPayment(int amount, String currency) {
        PaymentProcessor p = createProcessor();
        return p.charge(amount, currency);
    }
}

class StripeFactory extends ProcessorFactory {
    PaymentProcessor createProcessor() { return new StripeProcessor(); }
}

class PayPalFactory extends ProcessorFactory {
    PaymentProcessor createProcessor() { return new PayPalProcessor(); }
}`,
        TypeScript: `/**
 * Factory Method — Payment Processor Creator.
 * Subclass factories create specific processors.
 */
interface PaymentProcessor {
  charge(amountCents: number, currency: string): string;
}

class StripeProcessor implements PaymentProcessor {
  charge(amountCents: number, currency: string): string {
    return \`Stripe charged \${amountCents} \${currency} via card tokenization\`;
  }
}

class PayPalProcessor implements PaymentProcessor {
  charge(amountCents: number, currency: string): string {
    return \`PayPal charged \${amountCents} \${currency} via wallet redirect\`;
  }
}

abstract class ProcessorFactory {
  abstract createProcessor(): PaymentProcessor;

  /** Template method using the factory method. */
  processPayment(amount: number, currency: string): string {
    const processor = this.createProcessor();
    return processor.charge(amount, currency);
  }
}

class StripeFactory extends ProcessorFactory {
  createProcessor(): PaymentProcessor { return new StripeProcessor(); }
}

// ── Usage ──
const factory: ProcessorFactory = new StripeFactory();
console.log(factory.processPayment(5000, "USD"));`,
        Rust: `trait PaymentProcessor {
    fn charge(&self, amount_cents: u64, currency: &str) -> String;
}

struct StripeProcessor;
impl PaymentProcessor for StripeProcessor {
    fn charge(&self, amount_cents: u64, currency: &str) -> String {
        format!("Stripe charged {} {} via card tokenization", amount_cents, currency)
    }
}

struct PayPalProcessor;
impl PaymentProcessor for PayPalProcessor {
    fn charge(&self, amount_cents: u64, currency: &str) -> String {
        format!("PayPal charged {} {} via wallet redirect", amount_cents, currency)
    }
}

/// Creator trait — declares the factory method
trait ProcessorFactory {
    fn create_processor(&self) -> Box<dyn PaymentProcessor>;

    fn process_payment(&self, amount: u64, currency: &str) -> String {
        self.create_processor().charge(amount, currency)
    }
}

struct StripeFactory;
impl ProcessorFactory for StripeFactory {
    fn create_processor(&self) -> Box<dyn PaymentProcessor> {
        Box::new(StripeProcessor)
    }
}

fn main() {
    let factory: Box<dyn ProcessorFactory> = Box::new(StripeFactory);
    println!("{}", factory.process_payment(5000, "USD"));
}`,
      },
      considerations: [
        "Use feature flags or config to select the factory at startup — avoid hard-coding factory selection in business logic",
        "Each processor needs its own error-handling strategy (Stripe retries, PayPal redirects) — encapsulate these in the product",
        "Idempotency keys must be generated per processor type to avoid duplicate charges during retries",
        "Consider a fallback factory chain for payment failures (Stripe → PayPal → Wire)",
        "Processor credentials should be injected into the factory, not hard-coded in the product",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Medical Report Generator",
      domain: "Healthcare",
      problem:
        "A hospital information system generates reports for lab results, radiology imaging, and pathology analysis. Each report type has a different structure, required fields, and regulatory format (HL7 CDA for labs, DICOM SR for radiology). Embedding all report-creation logic in one class violates single responsibility.",
      solution:
        "A MedicalReportFactory declares createReport(). Subclasses LabReportFactory, RadiologyReportFactory, and PathologyReportFactory each produce the correct report type with its required sections and compliance format.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-e2); }
  </style>
  <defs><marker id="fm-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="8" width="220" height="52" class="s-box s-diagram-box"/>
  <text x="240" y="24" text-anchor="middle" class="s-title s-diagram-title">ReportFactory</text>
  <line x1="130" y1="28" x2="350" y2="28" class="s-diagram-line"/>
  <text x="140" y="42" class="s-member s-diagram-member">+createReport(): MedicalReport</text>
  <rect x="5" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="80" y="114" text-anchor="middle" class="s-title s-diagram-title">LabReportFactory</text>
  <rect x="165" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="240" y="114" text-anchor="middle" class="s-title s-diagram-title">RadiologyFactory</text>
  <rect x="325" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="400" y="114" text-anchor="middle" class="s-title s-diagram-title">PathologyFactory</text>
  <line x1="80" y1="92" x2="190" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="240" y1="92" x2="240" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="400" y1="92" x2="300" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="110" y="158" width="260" height="36" class="s-box s-diagram-box"/>
  <text x="240" y="180" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; MedicalReport</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Factory Method — Medical Report Generator

class MedicalReport(ABC):
    @abstractmethod
    def generate(self, patient_id: str) -> str: ...

class LabReport(MedicalReport):
    def generate(self, patient_id: str) -> str:
        return f"HL7 CDA Lab Report for {patient_id}: CBC, BMP, Lipid Panel"

class RadiologyReport(MedicalReport):
    def generate(self, patient_id: str) -> str:
        return f"DICOM SR Radiology Report for {patient_id}: CT Chest Findings"

class PathologyReport(MedicalReport):
    def generate(self, patient_id: str) -> str:
        return f"CAP Synoptic Pathology Report for {patient_id}: Biopsy Results"

class ReportFactory(ABC):
    @abstractmethod
    def create_report(self) -> MedicalReport: ...

class LabReportFactory(ReportFactory):
    def create_report(self) -> MedicalReport:
        return LabReport()

class RadiologyReportFactory(ReportFactory):
    def create_report(self) -> MedicalReport:
        return RadiologyReport()

# ── Usage ──
report = RadiologyReportFactory().create_report()
print(report.generate("PAT-00291"))`,
        Go: `package main

import "fmt"

// MedicalReport — Product interface
type MedicalReport interface {
	Generate(patientID string) string
}

type LabReport struct{}
func (l LabReport) Generate(patientID string) string {
	return fmt.Sprintf("HL7 CDA Lab Report for %s: CBC, BMP, Lipid Panel", patientID)
}

type RadiologyReport struct{}
func (r RadiologyReport) Generate(patientID string) string {
	return fmt.Sprintf("DICOM SR Radiology for %s: CT Chest Findings", patientID)
}

// ReportFactory — Creator interface
type ReportFactory interface {
	CreateReport() MedicalReport
}

type LabReportFactory struct{}
func (lf LabReportFactory) CreateReport() MedicalReport { return LabReport{} }

type RadiologyReportFactory struct{}
func (rf RadiologyReportFactory) CreateReport() MedicalReport { return RadiologyReport{} }

func main() {
	var factory ReportFactory = RadiologyReportFactory{}
	report := factory.CreateReport()
	fmt.Println(report.Generate("PAT-00291"))
}`,
        Java: `/**
 * Factory Method — Medical Report Generator.
 * Each factory produces a report matching a regulatory format.
 */
interface MedicalReport {
    String generate(String patientId);
}

class LabReport implements MedicalReport {
    public String generate(String patientId) {
        return "HL7 CDA Lab Report for " + patientId + ": CBC, BMP, Lipid Panel";
    }
}

class RadiologyReport implements MedicalReport {
    public String generate(String patientId) {
        return "DICOM SR Radiology Report for " + patientId + ": CT Chest Findings";
    }
}

abstract class ReportFactory {
    abstract MedicalReport createReport();
}

class LabReportFactory extends ReportFactory {
    MedicalReport createReport() { return new LabReport(); }
}

class RadiologyReportFactory extends ReportFactory {
    MedicalReport createReport() { return new RadiologyReport(); }
}`,
        TypeScript: `interface MedicalReport {
  generate(patientId: string): string;
}

class LabReport implements MedicalReport {
  generate(patientId: string): string {
    return \`HL7 CDA Lab Report for \${patientId}: CBC, BMP, Lipid Panel\`;
  }
}

class RadiologyReport implements MedicalReport {
  generate(patientId: string): string {
    return \`DICOM SR Radiology Report for \${patientId}: CT Chest Findings\`;
  }
}

abstract class ReportFactory {
  abstract createReport(): MedicalReport;
}

class RadiologyReportFactory extends ReportFactory {
  createReport(): MedicalReport {
    return new RadiologyReport();
  }
}

// ── Usage ──
const report = new RadiologyReportFactory().createReport();
console.log(report.generate("PAT-00291"));`,
        Rust: `trait MedicalReport {
    fn generate(&self, patient_id: &str) -> String;
}

struct LabReport;
impl MedicalReport for LabReport {
    fn generate(&self, patient_id: &str) -> String {
        format!("HL7 CDA Lab Report for {}: CBC, BMP, Lipid Panel", patient_id)
    }
}

struct RadiologyReport;
impl MedicalReport for RadiologyReport {
    fn generate(&self, patient_id: &str) -> String {
        format!("DICOM SR Radiology Report for {}: CT Chest Findings", patient_id)
    }
}

trait ReportFactory {
    fn create_report(&self) -> Box<dyn MedicalReport>;
}

struct RadiologyReportFactory;
impl ReportFactory for RadiologyReportFactory {
    fn create_report(&self) -> Box<dyn MedicalReport> {
        Box::new(RadiologyReport)
    }
}

fn main() {
    let factory: Box<dyn ReportFactory> = Box::new(RadiologyReportFactory);
    println!("{}", factory.create_report().generate("PAT-00291"));
}`,
      },
      considerations: [
        "Each report format has strict regulatory requirements — validate output against the standard's schema (HL7 CDA, DICOM SR)",
        "Template sections vary by report type — use the factory method to also inject section builders for headers, footers, and signatures",
        "Reports may need digital signatures for legal compliance — consider a decorator or post-processing step after factory creation",
        "Version the report templates so old reports can be re-generated in their original format even after updates",
        "Logging and audit trails are required — each factory should log which report type was created and for which patient",
      ],
    },
    {
      id: 3,
      title: "E-Commerce — Notification Channel Factory",
      domain: "E-Commerce",
      problem:
        "An e-commerce platform sends order confirmations, shipping updates, and promotional alerts through email, SMS, and push notifications. Each channel has a different API, payload format, and rate-limiting policy. Mixing channel logic into the notification service creates a maintenance nightmare.",
      solution:
        "A NotificationChannelFactory factory method returns the correct NotificationChannel implementation. Campaign configurations specify the channel type; the dispatcher calls the factory without knowing which concrete channel is used.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-e3); }
  </style>
  <defs><marker id="fm-e3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="8" width="220" height="52" class="s-box s-diagram-box"/>
  <text x="240" y="24" text-anchor="middle" class="s-title s-diagram-title">ChannelFactory</text>
  <line x1="130" y1="28" x2="350" y2="28" class="s-diagram-line"/>
  <text x="140" y="42" class="s-member s-diagram-member">+createChannel(): NotificationChannel</text>
  <rect x="5" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="80" y="114" text-anchor="middle" class="s-title s-diagram-title">EmailFactory</text>
  <rect x="165" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="240" y="114" text-anchor="middle" class="s-title s-diagram-title">SMSFactory</text>
  <rect x="325" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="400" y="114" text-anchor="middle" class="s-title s-diagram-title">PushFactory</text>
  <line x1="80" y1="92" x2="190" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="240" y1="92" x2="240" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="400" y1="92" x2="300" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="100" y="158" width="280" height="36" class="s-box s-diagram-box"/>
  <text x="240" y="180" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; NotificationChannel</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Factory Method — Notification Channel

class NotificationChannel(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> str: ...

class EmailChannel(NotificationChannel):
    def send(self, recipient: str, message: str) -> str:
        return f"Email sent to {recipient} via SES: {message[:50]}"

class SMSChannel(NotificationChannel):
    def send(self, recipient: str, message: str) -> str:
        return f"SMS sent to {recipient} via Twilio: {message[:30]}"

class PushChannel(NotificationChannel):
    def send(self, recipient: str, message: str) -> str:
        return f"Push sent to {recipient} via FCM: {message[:40]}"

class ChannelFactory(ABC):
    @abstractmethod
    def create_channel(self) -> NotificationChannel: ...

class EmailChannelFactory(ChannelFactory):
    def create_channel(self) -> NotificationChannel:
        return EmailChannel()

class SMSChannelFactory(ChannelFactory):
    def create_channel(self) -> NotificationChannel:
        return SMSChannel()

# ── Usage ──
channel = SMSChannelFactory().create_channel()
print(channel.send("+1555123456", "Your order #ORD-7821 has shipped"))`,
        Go: `package main

import "fmt"

type NotificationChannel interface {
	Send(recipient, message string) string
}

type EmailChannel struct{}
func (e EmailChannel) Send(recipient, message string) string {
	return fmt.Sprintf("Email sent to %s via SES: %s", recipient, message)
}

type SMSChannel struct{}
func (s SMSChannel) Send(recipient, message string) string {
	return fmt.Sprintf("SMS sent to %s via Twilio: %s", recipient, message)
}

type ChannelFactory interface {
	CreateChannel() NotificationChannel
}

type EmailChannelFactory struct{}
func (ef EmailChannelFactory) CreateChannel() NotificationChannel { return EmailChannel{} }

type SMSChannelFactory struct{}
func (sf SMSChannelFactory) CreateChannel() NotificationChannel { return SMSChannel{} }

func dispatch(factory ChannelFactory, to, msg string) {
	ch := factory.CreateChannel()
	fmt.Println(ch.Send(to, msg))
}

func main() {
	dispatch(SMSChannelFactory{}, "+1555123456", "Your order shipped")
}`,
        Java: `interface NotificationChannel {
    String send(String recipient, String message);
}

class EmailChannel implements NotificationChannel {
    public String send(String recipient, String message) {
        return "Email sent to " + recipient + " via SES: " + message;
    }
}

class SMSChannel implements NotificationChannel {
    public String send(String recipient, String message) {
        return "SMS sent to " + recipient + " via Twilio: " + message;
    }
}

abstract class ChannelFactory {
    abstract NotificationChannel createChannel();
}

class SMSChannelFactory extends ChannelFactory {
    NotificationChannel createChannel() { return new SMSChannel(); }
}

class EmailChannelFactory extends ChannelFactory {
    NotificationChannel createChannel() { return new EmailChannel(); }
}`,
        TypeScript: `interface NotificationChannel {
  send(recipient: string, message: string): string;
}

class EmailChannel implements NotificationChannel {
  send(recipient: string, message: string): string {
    return \`Email sent to \${recipient} via SES: \${message}\`;
  }
}

class SMSChannel implements NotificationChannel {
  send(recipient: string, message: string): string {
    return \`SMS sent to \${recipient} via Twilio: \${message}\`;
  }
}

abstract class ChannelFactory {
  abstract createChannel(): NotificationChannel;
}

class SMSChannelFactory extends ChannelFactory {
  createChannel(): NotificationChannel {
    return new SMSChannel();
  }
}

// ── Usage ──
const ch = new SMSChannelFactory().createChannel();
console.log(ch.send("+1555123456", "Your order #ORD-7821 has shipped"));`,
        Rust: `trait NotificationChannel {
    fn send(&self, recipient: &str, message: &str) -> String;
}

struct EmailChannel;
impl NotificationChannel for EmailChannel {
    fn send(&self, recipient: &str, message: &str) -> String {
        format!("Email sent to {} via SES: {}", recipient, message)
    }
}

struct SMSChannel;
impl NotificationChannel for SMSChannel {
    fn send(&self, recipient: &str, message: &str) -> String {
        format!("SMS sent to {} via Twilio: {}", recipient, message)
    }
}

trait ChannelFactory {
    fn create_channel(&self) -> Box<dyn NotificationChannel>;
}

struct SMSChannelFactory;
impl ChannelFactory for SMSChannelFactory {
    fn create_channel(&self) -> Box<dyn NotificationChannel> {
        Box::new(SMSChannel)
    }
}

fn main() {
    let factory: Box<dyn ChannelFactory> = Box::new(SMSChannelFactory);
    let ch = factory.create_channel();
    println!("{}", ch.send("+1555123456", "Your order shipped"));
}`,
      },
      considerations: [
        "Each channel has different rate limits — the factory can inject rate-limiter middleware specific to the channel type",
        "Message payloads differ per channel (HTML for email, 160-char for SMS) — products handle their own formatting constraints",
        "Add a fallback factory chain: if push delivery fails, retry via SMS or email",
        "Channel preferences are per-user — load the user's preferred factory from their profile settings",
        "Internationalization: the factory can inject locale-specific templates alongside the channel product",
      ],
    },
    {
      id: 4,
      title: "Media Streaming — Content Encoder Factory",
      domain: "Media Streaming",
      problem:
        "A media streaming platform must transcode uploaded content into multiple formats — H.264/HEVC for video, AAC/Opus for audio, and WebVTT/SRT for subtitles. Each encoder has different dependencies, hardware acceleration options, and output profiles. Coupling encoder selection into the transcoding pipeline makes it impossible to swap codecs.",
      solution:
        "A ContentEncoderFactory factory method produces the correct ContentEncoder. The transcoding pipeline requests an encoder by calling the factory, remaining agnostic to which codec library is used underneath.",
      classDiagramSvg: `<svg viewBox="0 0 490 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:490px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-e4); }
  </style>
  <defs><marker id="fm-e4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="135" y="8" width="220" height="52" class="s-box s-diagram-box"/>
  <text x="245" y="24" text-anchor="middle" class="s-title s-diagram-title">EncoderFactory</text>
  <line x1="135" y1="28" x2="355" y2="28" class="s-diagram-line"/>
  <text x="145" y="42" class="s-member s-diagram-member">+createEncoder(): ContentEncoder</text>
  <rect x="5" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="80" y="114" text-anchor="middle" class="s-title s-diagram-title">VideoEncoderFactory</text>
  <rect x="170" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="245" y="114" text-anchor="middle" class="s-title s-diagram-title">AudioEncoderFactory</text>
  <rect x="335" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="410" y="114" text-anchor="middle" class="s-title s-diagram-title">SubtitleEncoderFactory</text>
  <line x1="80" y1="92" x2="195" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="245" y1="92" x2="245" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="410" y1="92" x2="305" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="105" y="158" width="280" height="36" class="s-box s-diagram-box"/>
  <text x="245" y="180" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; ContentEncoder</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Factory Method — Content Encoder

class ContentEncoder(ABC):
    @abstractmethod
    def encode(self, source_path: str, profile: str) -> str: ...

class VideoEncoder(ContentEncoder):
    def encode(self, source_path: str, profile: str) -> str:
        return f"H.264 encoding {source_path} at {profile} profile"

class AudioEncoder(ContentEncoder):
    def encode(self, source_path: str, profile: str) -> str:
        return f"AAC encoding {source_path} at {profile} bitrate"

class SubtitleEncoder(ContentEncoder):
    def encode(self, source_path: str, profile: str) -> str:
        return f"WebVTT converting {source_path} with {profile} timing"

class EncoderFactory(ABC):
    @abstractmethod
    def create_encoder(self) -> ContentEncoder: ...

class VideoEncoderFactory(EncoderFactory):
    def create_encoder(self) -> ContentEncoder:
        return VideoEncoder()

class AudioEncoderFactory(EncoderFactory):
    def create_encoder(self) -> ContentEncoder:
        return AudioEncoder()

# ── Usage ──
encoder = VideoEncoderFactory().create_encoder()
print(encoder.encode("/ingest/movie_4k.mp4", "high"))`,
        Go: `package main

import "fmt"

type ContentEncoder interface {
	Encode(sourcePath, profile string) string
}

type VideoEncoder struct{}
func (v VideoEncoder) Encode(sourcePath, profile string) string {
	return fmt.Sprintf("H.264 encoding %s at %s profile", sourcePath, profile)
}

type AudioEncoder struct{}
func (a AudioEncoder) Encode(sourcePath, profile string) string {
	return fmt.Sprintf("AAC encoding %s at %s bitrate", sourcePath, profile)
}

type EncoderFactory interface {
	CreateEncoder() ContentEncoder
}

type VideoEncoderFactory struct{}
func (vf VideoEncoderFactory) CreateEncoder() ContentEncoder { return VideoEncoder{} }

type AudioEncoderFactory struct{}
func (af AudioEncoderFactory) CreateEncoder() ContentEncoder { return AudioEncoder{} }

func transcode(factory EncoderFactory, src, profile string) {
	enc := factory.CreateEncoder()
	fmt.Println(enc.Encode(src, profile))
}

func main() {
	transcode(VideoEncoderFactory{}, "/ingest/movie_4k.mp4", "high")
}`,
        Java: `interface ContentEncoder {
    String encode(String sourcePath, String profile);
}

class VideoEncoder implements ContentEncoder {
    public String encode(String sourcePath, String profile) {
        return "H.264 encoding " + sourcePath + " at " + profile + " profile";
    }
}

class AudioEncoder implements ContentEncoder {
    public String encode(String sourcePath, String profile) {
        return "AAC encoding " + sourcePath + " at " + profile + " bitrate";
    }
}

abstract class EncoderFactory {
    abstract ContentEncoder createEncoder();
}

class VideoEncoderFactory extends EncoderFactory {
    ContentEncoder createEncoder() { return new VideoEncoder(); }
}

class AudioEncoderFactory extends EncoderFactory {
    ContentEncoder createEncoder() { return new AudioEncoder(); }
}`,
        TypeScript: `interface ContentEncoder {
  encode(sourcePath: string, profile: string): string;
}

class VideoEncoder implements ContentEncoder {
  encode(sourcePath: string, profile: string): string {
    return \`H.264 encoding \${sourcePath} at \${profile} profile\`;
  }
}

class AudioEncoder implements ContentEncoder {
  encode(sourcePath: string, profile: string): string {
    return \`AAC encoding \${sourcePath} at \${profile} bitrate\`;
  }
}

abstract class EncoderFactory {
  abstract createEncoder(): ContentEncoder;
}

class VideoEncoderFactory extends EncoderFactory {
  createEncoder(): ContentEncoder {
    return new VideoEncoder();
  }
}

// ── Usage ──
const enc = new VideoEncoderFactory().createEncoder();
console.log(enc.encode("/ingest/movie_4k.mp4", "high"));`,
        Rust: `trait ContentEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> String;
}

struct VideoEncoder;
impl ContentEncoder for VideoEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> String {
        format!("H.264 encoding {} at {} profile", source_path, profile)
    }
}

struct AudioEncoder;
impl ContentEncoder for AudioEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> String {
        format!("AAC encoding {} at {} bitrate", source_path, profile)
    }
}

trait EncoderFactory {
    fn create_encoder(&self) -> Box<dyn ContentEncoder>;
}

struct VideoEncoderFactory;
impl EncoderFactory for VideoEncoderFactory {
    fn create_encoder(&self) -> Box<dyn ContentEncoder> {
        Box::new(VideoEncoder)
    }
}

fn main() {
    let factory: Box<dyn EncoderFactory> = Box::new(VideoEncoderFactory);
    println!("{}", factory.create_encoder().encode("/ingest/movie_4k.mp4", "high"));
}`,
      },
      considerations: [
        "Hardware acceleration (NVENC, Quick Sync) is codec-specific — the factory decides whether to use GPU or CPU encoding",
        "Output profiles (360p, 720p, 1080p, 4K) should be passed to the product, not baked into the factory",
        "Encoding failures need codec-specific retry logic (e.g., fall back from HEVC to H.264) — the factory can chain fallbacks",
        "Progress callbacks differ per encoder — the product should implement a uniform progress interface",
        "DRM wrapper should be applied after encoding — keep it as a decorator, not inside the factory",
      ],
    },
    {
      id: 5,
      title: "Logistics — Shipment Handler Creator",
      domain: "Logistics",
      problem:
        "A logistics platform routes parcels through different carriers depending on delivery speed, weight, and destination. Air freight has customs declarations, sea freight requires container manifests, and ground shipping needs route optimization. A monolithic shipment handler becomes untestable and brittle.",
      solution:
        "A ShipmentHandlerFactory factory method creates the correct ShipmentHandler. The dispatch service selects the factory based on shipment attributes; each handler encapsulates its carrier-specific logic.",
      classDiagramSvg: `<svg viewBox="0 0 490 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:490px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fm-e5); }
  </style>
  <defs><marker id="fm-e5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="135" y="8" width="220" height="52" class="s-box s-diagram-box"/>
  <text x="245" y="24" text-anchor="middle" class="s-title s-diagram-title">ShipmentFactory</text>
  <line x1="135" y1="28" x2="355" y2="28" class="s-diagram-line"/>
  <text x="145" y="42" class="s-member s-diagram-member">+createHandler(): ShipmentHandler</text>
  <rect x="5" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="80" y="114" text-anchor="middle" class="s-title s-diagram-title">AirFreightFactory</text>
  <rect x="170" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="245" y="114" text-anchor="middle" class="s-title s-diagram-title">SeaFreightFactory</text>
  <rect x="335" y="92" width="150" height="36" class="s-box s-diagram-box"/>
  <text x="410" y="114" text-anchor="middle" class="s-title s-diagram-title">GroundFactory</text>
  <line x1="80" y1="92" x2="195" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="245" y1="92" x2="245" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="410" y1="92" x2="305" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="110" y="158" width="270" height="36" class="s-box s-diagram-box"/>
  <text x="245" y="180" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; ShipmentHandler</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Factory Method — Shipment Handler Creator

class ShipmentHandler(ABC):
    @abstractmethod
    def process(self, tracking_id: str, weight_kg: float) -> str: ...

class AirFreightHandler(ShipmentHandler):
    def process(self, tracking_id: str, weight_kg: float) -> str:
        return f"Air freight {tracking_id}: {weight_kg}kg, customs declaration filed"

class SeaFreightHandler(ShipmentHandler):
    def process(self, tracking_id: str, weight_kg: float) -> str:
        return f"Sea freight {tracking_id}: {weight_kg}kg, container manifest created"

class GroundShipmentHandler(ShipmentHandler):
    def process(self, tracking_id: str, weight_kg: float) -> str:
        return f"Ground shipment {tracking_id}: {weight_kg}kg, route optimized"

class ShipmentFactory(ABC):
    @abstractmethod
    def create_handler(self) -> ShipmentHandler: ...

class AirFreightFactory(ShipmentFactory):
    def create_handler(self) -> ShipmentHandler:
        return AirFreightHandler()

class SeaFreightFactory(ShipmentFactory):
    def create_handler(self) -> ShipmentHandler:
        return SeaFreightHandler()

# ── Usage ──
handler = AirFreightFactory().create_handler()
print(handler.process("SHP-99201", 24.5))`,
        Go: `package main

import "fmt"

type ShipmentHandler interface {
	Process(trackingID string, weightKg float64) string
}

type AirFreightHandler struct{}
func (a AirFreightHandler) Process(trackingID string, weightKg float64) string {
	return fmt.Sprintf("Air freight %s: %.1fkg, customs declaration filed", trackingID, weightKg)
}

type SeaFreightHandler struct{}
func (s SeaFreightHandler) Process(trackingID string, weightKg float64) string {
	return fmt.Sprintf("Sea freight %s: %.1fkg, container manifest created", trackingID, weightKg)
}

type ShipmentFactory interface {
	CreateHandler() ShipmentHandler
}

type AirFreightFactory struct{}
func (af AirFreightFactory) CreateHandler() ShipmentHandler { return AirFreightHandler{} }

type SeaFreightFactory struct{}
func (sf SeaFreightFactory) CreateHandler() ShipmentHandler { return SeaFreightHandler{} }

func main() {
	var factory ShipmentFactory = AirFreightFactory{}
	fmt.Println(factory.CreateHandler().Process("SHP-99201", 24.5))
}`,
        Java: `interface ShipmentHandler {
    String process(String trackingId, double weightKg);
}

class AirFreightHandler implements ShipmentHandler {
    public String process(String trackingId, double weightKg) {
        return "Air freight " + trackingId + ": " + weightKg + "kg, customs declaration filed";
    }
}

class SeaFreightHandler implements ShipmentHandler {
    public String process(String trackingId, double weightKg) {
        return "Sea freight " + trackingId + ": " + weightKg + "kg, container manifest created";
    }
}

abstract class ShipmentFactory {
    abstract ShipmentHandler createHandler();
}

class AirFreightFactory extends ShipmentFactory {
    ShipmentHandler createHandler() { return new AirFreightHandler(); }
}

class SeaFreightFactory extends ShipmentFactory {
    ShipmentHandler createHandler() { return new SeaFreightHandler(); }
}`,
        TypeScript: `interface ShipmentHandler {
  process(trackingId: string, weightKg: number): string;
}

class AirFreightHandler implements ShipmentHandler {
  process(trackingId: string, weightKg: number): string {
    return \`Air freight \${trackingId}: \${weightKg}kg, customs declaration filed\`;
  }
}

class SeaFreightHandler implements ShipmentHandler {
  process(trackingId: string, weightKg: number): string {
    return \`Sea freight \${trackingId}: \${weightKg}kg, container manifest created\`;
  }
}

abstract class ShipmentFactory {
  abstract createHandler(): ShipmentHandler;
}

class AirFreightFactory extends ShipmentFactory {
  createHandler(): ShipmentHandler {
    return new AirFreightHandler();
  }
}

// ── Usage ──
const handler = new AirFreightFactory().createHandler();
console.log(handler.process("SHP-99201", 24.5));`,
        Rust: `trait ShipmentHandler {
    fn process(&self, tracking_id: &str, weight_kg: f64) -> String;
}

struct AirFreightHandler;
impl ShipmentHandler for AirFreightHandler {
    fn process(&self, tracking_id: &str, weight_kg: f64) -> String {
        format!("Air freight {}: {:.1}kg, customs declaration filed", tracking_id, weight_kg)
    }
}

struct SeaFreightHandler;
impl ShipmentHandler for SeaFreightHandler {
    fn process(&self, tracking_id: &str, weight_kg: f64) -> String {
        format!("Sea freight {}: {:.1}kg, container manifest created", tracking_id, weight_kg)
    }
}

trait ShipmentFactory {
    fn create_handler(&self) -> Box<dyn ShipmentHandler>;
}

struct AirFreightFactory;
impl ShipmentFactory for AirFreightFactory {
    fn create_handler(&self) -> Box<dyn ShipmentHandler> {
        Box::new(AirFreightHandler)
    }
}

fn main() {
    let factory: Box<dyn ShipmentFactory> = Box::new(AirFreightFactory);
    println!("{}", factory.create_handler().process("SHP-99201", 24.5));
}`,
      },
      considerations: [
        "Carrier APIs have different SLAs and retry policies — the handler should encapsulate retries and circuit breaking",
        "Customs declarations for air freight require additional data (HS codes, value declarations) — pass a ShipmentDetails DTO to process()",
        "Weight thresholds determine carrier eligibility — validate before factory selection, not inside the product",
        "Multi-leg shipments (air + ground last mile) may need a composite handler built from multiple factories",
        "Tracking number formats differ per carrier — the factory should also produce carrier-specific tracking ID generators",
      ],
    },
  ],

  // ─── VARIANTS (Ways to Implement Factory Method) ──────────────
  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "For most applications, start with a Parameterized Factory or Registry-Based Factory — they're simpler and avoid class proliferation. Use the Classic (abstract subclass) approach when creation logic is complex or when you need a framework with pluggable object creation. Use Functional Factories in languages that favor first-class functions.",
  variants: [
    {
      id: 1,
      name: "Classic (Abstract Subclass)",
      description:
        "The textbook GoF approach: an abstract Creator class declares the factory method; each ConcreteCreator subclass overrides it to produce a specific product. Best when creation involves multi-step initialization or when a framework needs subclass hooks.",
      code: {
        Python: `from abc import ABC, abstractmethod

class Notification(ABC):
    @abstractmethod
    def render(self) -> str: ...

class EmailNotification(Notification):
    def render(self) -> str:
        return "Rendering email template with HTML"

class SMSNotification(Notification):
    def render(self) -> str:
        return "Rendering SMS template (160 chars max)"

class NotificationCreator(ABC):
    @abstractmethod
    def create_notification(self) -> Notification: ...

    def notify(self, user: str) -> str:
        n = self.create_notification()
        return f"Sending to {user}: {n.render()}"

class EmailCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return EmailNotification()

class SMSCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return SMSNotification()

# ── Usage ──
creator: NotificationCreator = EmailCreator()
print(creator.notify("alice@example.com"))`,
        Go: `package main

import "fmt"

type Notification interface {
	Render() string
}

type EmailNotification struct{}
func (e EmailNotification) Render() string { return "Rendering email HTML" }

type SMSNotification struct{}
func (s SMSNotification) Render() string { return "Rendering SMS (160 chars)" }

type NotificationCreator interface {
	CreateNotification() Notification
}

type EmailCreator struct{}
func (ec EmailCreator) CreateNotification() Notification {
	return EmailNotification{}
}

type SMSCreator struct{}
func (sc SMSCreator) CreateNotification() Notification {
	return SMSNotification{}
}

func notify(creator NotificationCreator, user string) {
	n := creator.CreateNotification()
	fmt.Printf("Sending to %s: %s\\n", user, n.Render())
}

func main() {
	notify(EmailCreator{}, "alice@example.com")
	notify(SMSCreator{}, "+1555999888")
}`,
        Java: `interface Notification {
    String render();
}

class EmailNotification implements Notification {
    public String render() { return "Rendering email HTML"; }
}

class SMSNotification implements Notification {
    public String render() { return "Rendering SMS (160 chars max)"; }
}

abstract class NotificationCreator {
    abstract Notification createNotification();

    String notify(String user) {
        Notification n = createNotification();
        return "Sending to " + user + ": " + n.render();
    }
}

class EmailCreator extends NotificationCreator {
    Notification createNotification() { return new EmailNotification(); }
}

class SMSCreator extends NotificationCreator {
    Notification createNotification() { return new SMSNotification(); }
}`,
        TypeScript: `interface Notification {
  render(): string;
}

class EmailNotification implements Notification {
  render(): string { return "Rendering email HTML"; }
}

class SMSNotification implements Notification {
  render(): string { return "Rendering SMS (160 chars max)"; }
}

abstract class NotificationCreator {
  abstract createNotification(): Notification;

  notify(user: string): string {
    const n = this.createNotification();
    return \`Sending to \${user}: \${n.render()}\`;
  }
}

class EmailCreator extends NotificationCreator {
  createNotification(): Notification { return new EmailNotification(); }
}

// ── Usage ──
const creator: NotificationCreator = new EmailCreator();
console.log(creator.notify("alice@example.com"));`,
        Rust: `trait Notification {
    fn render(&self) -> String;
}

struct EmailNotification;
impl Notification for EmailNotification {
    fn render(&self) -> String { "Rendering email HTML".into() }
}

struct SMSNotification;
impl Notification for SMSNotification {
    fn render(&self) -> String { "Rendering SMS (160 chars)".into() }
}

trait NotificationCreator {
    fn create_notification(&self) -> Box<dyn Notification>;

    fn notify(&self, user: &str) -> String {
        let n = self.create_notification();
        format!("Sending to {}: {}", user, n.render())
    }
}

struct EmailCreator;
impl NotificationCreator for EmailCreator {
    fn create_notification(&self) -> Box<dyn Notification> {
        Box::new(EmailNotification)
    }
}

fn main() {
    let creator: Box<dyn NotificationCreator> = Box::new(EmailCreator);
    println!("{}", creator.notify("alice@example.com"));
}`,
      },
      pros: [
        "True polymorphic dispatch — the client never sees concrete types",
        "Each creator can have complex, multi-step initialization logic",
        "Framework can define the workflow; subclasses customize the objects",
      ],
      cons: [
        "Class proliferation — every new product needs a parallel creator class",
        "Overkill for simple creation with no complex initialization",
        "Hierarchy can become rigid if products evolve independently from creators",
      ],
    },
    {
      id: 2,
      name: "Parameterized Factory Method",
      description:
        "A single factory method takes a type parameter (enum, string, or config) and uses a switch/match to instantiate the correct product. Simpler than the class hierarchy approach but violates OCP if you modify the switch for every new type.",
      code: {
        Python: `from abc import ABC, abstractmethod
from enum import Enum

class ChannelType(Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"

class Channel(ABC):
    @abstractmethod
    def send(self, msg: str) -> str: ...

class EmailChannel(Channel):
    def send(self, msg: str) -> str:
        return f"Email: {msg}"

class SMSChannel(Channel):
    def send(self, msg: str) -> str:
        return f"SMS: {msg}"

class PushChannel(Channel):
    def send(self, msg: str) -> str:
        return f"Push: {msg}"

def create_channel(channel_type: ChannelType) -> Channel:
    """Parameterized factory method."""
    factories = {
        ChannelType.EMAIL: EmailChannel,
        ChannelType.SMS: SMSChannel,
        ChannelType.PUSH: PushChannel,
    }
    cls = factories.get(channel_type)
    if not cls:
        raise ValueError(f"Unknown channel: {channel_type}")
    return cls()

# ── Usage ──
ch = create_channel(ChannelType.SMS)
print(ch.send("Order shipped"))`,
        Go: `package main

import "fmt"

type Channel interface {
	Send(msg string) string
}

type EmailCh struct{}
func (e EmailCh) Send(msg string) string { return "Email: " + msg }

type SMSCh struct{}
func (s SMSCh) Send(msg string) string { return "SMS: " + msg }

type PushCh struct{}
func (p PushCh) Send(msg string) string { return "Push: " + msg }

// Parameterized factory
func CreateChannel(chType string) (Channel, error) {
	switch chType {
	case "email":
		return EmailCh{}, nil
	case "sms":
		return SMSCh{}, nil
	case "push":
		return PushCh{}, nil
	default:
		return nil, fmt.Errorf("unknown channel: %s", chType)
	}
}

func main() {
	ch, _ := CreateChannel("sms")
	fmt.Println(ch.Send("Order shipped"))
}`,
        Java: `enum ChannelType { EMAIL, SMS, PUSH }

interface Channel {
    String send(String msg);
}

class EmailCh implements Channel {
    public String send(String msg) { return "Email: " + msg; }
}
class SMSCh implements Channel {
    public String send(String msg) { return "SMS: " + msg; }
}

class ChannelFactory {
    /** Parameterized factory method. */
    static Channel create(ChannelType type) {
        return switch (type) {
            case EMAIL -> new EmailCh();
            case SMS   -> new SMSCh();
            default -> throw new IllegalArgumentException("Unknown: " + type);
        };
    }
}`,
        TypeScript: `type ChannelType = "email" | "sms" | "push";

interface Channel {
  send(msg: string): string;
}

class EmailCh implements Channel {
  send(msg: string): string { return \`Email: \${msg}\`; }
}
class SMSCh implements Channel {
  send(msg: string): string { return \`SMS: \${msg}\`; }
}
class PushCh implements Channel {
  send(msg: string): string { return \`Push: \${msg}\`; }
}

function createChannel(type: ChannelType): Channel {
  const map: Record<ChannelType, () => Channel> = {
    email: () => new EmailCh(),
    sms: () => new SMSCh(),
    push: () => new PushCh(),
  };
  return map[type]();
}

// ── Usage ──
console.log(createChannel("sms").send("Order shipped"));`,
        Rust: `trait Channel {
    fn send(&self, msg: &str) -> String;
}

struct EmailCh;
impl Channel for EmailCh {
    fn send(&self, msg: &str) -> String { format!("Email: {}", msg) }
}

struct SMSCh;
impl Channel for SMSCh {
    fn send(&self, msg: &str) -> String { format!("SMS: {}", msg) }
}

fn create_channel(ch_type: &str) -> Box<dyn Channel> {
    match ch_type {
        "email" => Box::new(EmailCh),
        "sms"   => Box::new(SMSCh),
        _       => panic!("Unknown channel: {}", ch_type),
    }
}

fn main() {
    let ch = create_channel("sms");
    println!("{}", ch.send("Order shipped"));
}`,
      },
      pros: [
        "Simple — one factory function, no class hierarchy needed",
        "Easy to understand and quick to implement",
        "Works well when the creation logic per type is trivial (just instantiation)",
      ],
      cons: [
        "Violates Open/Closed — adding a new type requires modifying the switch/match",
        "The switch can grow unwieldy with many product types",
        "No hook for complex multi-step initialization per type",
      ],
    },
    {
      id: 3,
      name: "Static Factory Method",
      description:
        "Named static methods on a class that return instances. Common in Java (e.g., Integer.valueOf(), Optional.of()). Not a true GoF Factory Method (no subclassing) but widely used for readable, self-documenting instantiation with validation.",
      code: {
        Python: `class Color:
    """Static factory methods for creating Color instances."""
    def __init__(self, r: int, g: int, b: int):
        self.r, self.g, self.b = r, g, b

    @staticmethod
    def from_hex(hex_str: str) -> "Color":
        h = hex_str.lstrip("#")
        return Color(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

    @staticmethod
    def red() -> "Color":
        return Color(255, 0, 0)

    @staticmethod
    def blue() -> "Color":
        return Color(0, 0, 255)

    def __repr__(self):
        return f"Color({self.r}, {self.g}, {self.b})"

# ── Usage ──
c1 = Color.from_hex("#FF8800")
c2 = Color.red()
print(c1, c2)`,
        Go: `package main

import "fmt"

type Color struct{ R, G, B uint8 }

// Static factory: named constructors
func NewColorFromHex(hex string) Color {
	// Simplified hex parsing
	return Color{0xFF, 0x88, 0x00}
}

func Red() Color  { return Color{255, 0, 0} }
func Blue() Color { return Color{0, 0, 255} }

func main() {
	c1 := NewColorFromHex("#FF8800")
	c2 := Red()
	fmt.Println(c1, c2)
}`,
        Java: `public final class Color {
    private final int r, g, b;

    private Color(int r, int g, int b) {
        this.r = r; this.g = g; this.b = b;
    }

    /** Static factory — readable name, can return cached instances. */
    public static Color fromHex(String hex) {
        int r = Integer.parseInt(hex.substring(1, 3), 16);
        int g = Integer.parseInt(hex.substring(3, 5), 16);
        int b = Integer.parseInt(hex.substring(5, 7), 16);
        return new Color(r, g, b);
    }

    public static Color red()  { return new Color(255, 0, 0); }
    public static Color blue() { return new Color(0, 0, 255); }

    @Override
    public String toString() { return "Color(" + r + "," + g + "," + b + ")"; }
}`,
        TypeScript: `class Color {
  private constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
  ) {}

  static fromHex(hex: string): Color {
    const h = hex.replace("#", "");
    return new Color(
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    );
  }

  static red(): Color  { return new Color(255, 0, 0); }
  static blue(): Color { return new Color(0, 0, 255); }

  toString(): string { return \`Color(\${this.r},\${this.g},\${this.b})\`; }
}

// ── Usage ──
console.log(Color.fromHex("#FF8800").toString());
console.log(Color.red().toString());`,
        Rust: `struct Color { r: u8, g: u8, b: u8 }

impl Color {
    /// Static factory methods (associated functions in Rust)
    fn from_hex(hex: &str) -> Self {
        let h = hex.trim_start_matches('#');
        Color {
            r: u8::from_str_radix(&h[0..2], 16).unwrap(),
            g: u8::from_str_radix(&h[2..4], 16).unwrap(),
            b: u8::from_str_radix(&h[4..6], 16).unwrap(),
        }
    }

    fn red() -> Self  { Color { r: 255, g: 0, b: 0 } }
    fn blue() -> Self { Color { r: 0, g: 0, b: 255 } }
}

fn main() {
    let c = Color::from_hex("#FF8800");
    println!("Color({},{},{})", c.r, c.g, c.b);
}`,
      },
      pros: [
        "Descriptive names — from_hex(), of(), valueOf() are more readable than constructors",
        "Can return cached instances (flyweight), subtype instances, or null/Optional",
        "Private constructor prevents uncontrolled instantiation",
      ],
      cons: [
        "Not a true Factory Method (no subclass override, no polymorphism)",
        "Cannot be overridden in subclasses — less flexible for frameworks",
        "Can hide complexity if the static method does too much work",
      ],
    },
    {
      id: 4,
      name: "Registry-Based Factory",
      description:
        "A factory that maintains a registry (map/dictionary) of type keys to creator functions. New types are registered at runtime without modifying the factory class. Combines the simplicity of parameterized factories with the extensibility of the class hierarchy approach.",
      code: {
        Python: `from abc import ABC, abstractmethod
from typing import Dict, Type

class Serializer(ABC):
    @abstractmethod
    def serialize(self, data: dict) -> str: ...

class JSONSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        import json
        return json.dumps(data)

class XMLSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        pairs = "".join(f"<{k}>{v}</{k}>" for k, v in data.items())
        return f"<root>{pairs}</root>"

# Registry-based factory
class SerializerFactory:
    _registry: Dict[str, Type[Serializer]] = {}

    @classmethod
    def register(cls, fmt: str, serializer_cls: Type[Serializer]):
        cls._registry[fmt] = serializer_cls

    @classmethod
    def create(cls, fmt: str) -> Serializer:
        if fmt not in cls._registry:
            raise ValueError(f"Unknown format: {fmt}")
        return cls._registry[fmt]()

# Register at module load time (or via plugin discovery)
SerializerFactory.register("json", JSONSerializer)
SerializerFactory.register("xml", XMLSerializer)

# ── Usage ──
s = SerializerFactory.create("json")
print(s.serialize({"name": "Alice", "role": "admin"}))`,
        Go: `package main

import (
	"encoding/json"
	"fmt"
)

type Serializer interface {
	Serialize(data map[string]string) string
}

type JSONSerializer struct{}
func (j JSONSerializer) Serialize(data map[string]string) string {
	b, _ := json.Marshal(data)
	return string(b)
}

type XMLSerializer struct{}
func (x XMLSerializer) Serialize(data map[string]string) string {
	return "<root>...</root>"
}

// Registry-based factory
type SerializerCreator func() Serializer

var registry = map[string]SerializerCreator{}

func Register(fmt string, creator SerializerCreator) {
	registry[fmt] = creator
}

func Create(fmt string) Serializer {
	creator, ok := registry[fmt]
	if !ok {
		panic("Unknown format: " + fmt)
	}
	return creator()
}

func init() {
	Register("json", func() Serializer { return JSONSerializer{} })
	Register("xml", func() Serializer { return XMLSerializer{} })
}

func main() {
	s := Create("json")
	fmt.Println(s.Serialize(map[string]string{"name": "Alice"}))
}`,
        Java: `import java.util.*;
import java.util.function.Supplier;

interface Serializer {
    String serialize(Map<String, String> data);
}

class JSONSerializer implements Serializer {
    public String serialize(Map<String, String> data) {
        return data.toString(); // simplified
    }
}

class XMLSerializer implements Serializer {
    public String serialize(Map<String, String> data) {
        return "<root>...</root>";
    }
}

/** Registry-based factory. */
class SerializerFactory {
    private static final Map<String, Supplier<Serializer>> registry
        = new HashMap<>();

    static void register(String fmt, Supplier<Serializer> creator) {
        registry.put(fmt, creator);
    }

    static Serializer create(String fmt) {
        Supplier<Serializer> creator = registry.get(fmt);
        if (creator == null) throw new IllegalArgumentException(fmt);
        return creator.get();
    }

    static {
        register("json", JSONSerializer::new);
        register("xml", XMLSerializer::new);
    }
}`,
        TypeScript: `interface Serializer {
  serialize(data: Record<string, string>): string;
}

class JSONSerializer implements Serializer {
  serialize(data: Record<string, string>): string {
    return JSON.stringify(data);
  }
}

class XMLSerializer implements Serializer {
  serialize(data: Record<string, string>): string {
    const pairs = Object.entries(data)
      .map(([k, v]) => \`<\${k}>\${v}</\${k}>\`)
      .join("");
    return \`<root>\${pairs}</root>\`;
  }
}

// Registry-based factory
const registry = new Map<string, () => Serializer>();

function register(fmt: string, creator: () => Serializer) {
  registry.set(fmt, creator);
}

function createSerializer(fmt: string): Serializer {
  const creator = registry.get(fmt);
  if (!creator) throw new Error(\`Unknown format: \${fmt}\`);
  return creator();
}

register("json", () => new JSONSerializer());
register("xml", () => new XMLSerializer());

// ── Usage ──
console.log(createSerializer("json").serialize({ name: "Alice" }));`,
        Rust: `use std::collections::HashMap;

trait Serializer {
    fn serialize(&self, data: &[(&str, &str)]) -> String;
}

struct JSONSerializer;
impl Serializer for JSONSerializer {
    fn serialize(&self, data: &[(&str, &str)]) -> String {
        let pairs: Vec<String> = data.iter()
            .map(|(k, v)| format!("\\\"{}\\\":\\\"{}\\\"", k, v))
            .collect();
        format!("{{{}}}", pairs.join(","))
    }
}

type Creator = fn() -> Box<dyn Serializer>;

fn create_registry() -> HashMap<&'static str, Creator> {
    let mut m: HashMap<&str, Creator> = HashMap::new();
    m.insert("json", || Box::new(JSONSerializer));
    m
}

fn main() {
    let registry = create_registry();
    let creator = registry.get("json").unwrap();
    let s = creator();
    println!("{}", s.serialize(&[("name", "Alice")]));
}`,
      },
      pros: [
        "Open/Closed compliant — add new types by registering, not modifying factory code",
        "Supports plugin architectures where types are discovered at runtime",
        "Simpler than a full class hierarchy — no parallel creator classes",
      ],
      cons: [
        "Type safety relies on convention — a typo in the key silently fails at runtime",
        "Registration order can matter if there are dependencies between types",
        "Harder to see all available types at a glance compared to a sealed class hierarchy",
      ],
    },
    {
      id: 5,
      name: "Functional Factory (Lambda/Closure)",
      description:
        "Instead of defining creator classes, pass factory functions (lambdas, closures, or function references) directly. The function IS the factory. Most natural in languages with first-class functions (Python, TypeScript, Go, Rust).",
      code: {
        Python: `from typing import Callable

class Logger:
    def __init__(self, prefix: str, dest: str):
        self.prefix = prefix
        self.dest = dest

    def log(self, msg: str) -> str:
        return f"[{self.prefix}] → {self.dest}: {msg}"

# Factory functions (closures that capture config)
def console_logger_factory() -> Logger:
    return Logger("CONSOLE", "stdout")

def file_logger_factory() -> Logger:
    return Logger("FILE", "/var/log/app.log")

def cloud_logger_factory() -> Logger:
    return Logger("CLOUD", "cloudwatch://prod")

def create_and_log(factory: Callable[[], Logger], msg: str):
    """Client code accepts any factory function."""
    logger = factory()
    print(logger.log(msg))

# ── Usage ──
create_and_log(console_logger_factory, "App started")
create_and_log(cloud_logger_factory, "User login")`,
        Go: `package main

import "fmt"

type Logger struct {
	Prefix, Dest string
}

func (l Logger) Log(msg string) string {
	return fmt.Sprintf("[%s] → %s: %s", l.Prefix, l.Dest, msg)
}

// Factory functions
func ConsoleLogger() Logger { return Logger{"CONSOLE", "stdout"} }
func FileLogger() Logger    { return Logger{"FILE", "/var/log/app.log"} }
func CloudLogger() Logger   { return Logger{"CLOUD", "cloudwatch://prod"} }

func createAndLog(factory func() Logger, msg string) {
	logger := factory()
	fmt.Println(logger.Log(msg))
}

func main() {
	createAndLog(ConsoleLogger, "App started")
	createAndLog(CloudLogger, "User login")
}`,
        Java: `import java.util.function.Supplier;

class Logger {
    private final String prefix, dest;

    Logger(String prefix, String dest) {
        this.prefix = prefix;
        this.dest = dest;
    }

    String log(String msg) {
        return "[" + prefix + "] → " + dest + ": " + msg;
    }
}

class App {
    // Functional factories using Supplier<Logger>
    static final Supplier<Logger> consoleFactory =
        () -> new Logger("CONSOLE", "stdout");
    static final Supplier<Logger> cloudFactory =
        () -> new Logger("CLOUD", "cloudwatch://prod");

    static void createAndLog(Supplier<Logger> factory, String msg) {
        Logger logger = factory.get();
        System.out.println(logger.log(msg));
    }

    public static void main(String[] args) {
        createAndLog(consoleFactory, "App started");
        createAndLog(cloudFactory, "User login");
    }
}`,
        TypeScript: `class Logger {
  constructor(
    private prefix: string,
    private dest: string,
  ) {}

  log(msg: string): string {
    return \`[\${this.prefix}] → \${this.dest}: \${msg}\`;
  }
}

// Functional factories — functions that return Logger instances
const consoleLoggerFactory = () => new Logger("CONSOLE", "stdout");
const fileLoggerFactory = () => new Logger("FILE", "/var/log/app.log");
const cloudLoggerFactory = () => new Logger("CLOUD", "cloudwatch://prod");

function createAndLog(factory: () => Logger, msg: string) {
  const logger = factory();
  console.log(logger.log(msg));
}

// ── Usage ──
createAndLog(consoleLoggerFactory, "App started");
createAndLog(cloudLoggerFactory, "User login");`,
        Rust: `struct Logger {
    prefix: String,
    dest: String,
}

impl Logger {
    fn log(&self, msg: &str) -> String {
        format!("[{}] → {}: {}", self.prefix, self.dest, msg)
    }
}

// Functional factories — closures that create Logger instances
fn console_factory() -> Logger {
    Logger { prefix: "CONSOLE".into(), dest: "stdout".into() }
}

fn cloud_factory() -> Logger {
    Logger { prefix: "CLOUD".into(), dest: "cloudwatch://prod".into() }
}

fn create_and_log(factory: fn() -> Logger, msg: &str) {
    let logger = factory();
    println!("{}", logger.log(msg));
}

fn main() {
    create_and_log(console_factory, "App started");
    create_and_log(cloud_factory, "User login");
}`,
      },
      pros: [
        "Minimal boilerplate — no creator classes, just functions",
        "Easy to compose, curry, and pass as arguments",
        "Ideal for languages with first-class functions (JS/TS, Python, Go, Rust)",
      ],
      cons: [
        "Loses the ability to hold shared state in the creator (no creator instance)",
        "Harder to enforce a contract — any function matching the signature works (no type hierarchy)",
        "Less discoverable — IDE autocomplete doesn't suggest available factories as easily as subclasses",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "OCP-Compliant", "Complexity", "Type Safety", "Best For",
  ],
  comparisonRows: [
    ["Classic (Abstract Subclass)", "✓", "Medium-High", "✓ (compile-time)", "Frameworks, complex creation logic"],
    ["Parameterized", "✗ (modify switch)", "Low", "Partial (runtime key)", "Simple apps, few product types"],
    ["Static Factory Method", "N/A", "Low", "✓", "Value objects, named constructors"],
    ["Registry-Based", "✓", "Medium", "Partial (runtime key)", "Plugins, extensible systems"],
    ["Functional Factory", "✓", "Low", "✓ (type signature)", "FP-friendly langs, simple products"],
  ],

  // ─── SUMMARY ────────────────────────────────────────────────────
  summary: [
    { aspect: "Pattern Type", detail: "Creational" },
    {
      aspect: "Key Benefit",
      detail:
        "Decouples object creation from usage — new product types require only a new factory subclass, not changes to client code",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Over-engineering with factories when a simple constructor or configuration map would suffice; every new type adds a class pair",
    },
    {
      aspect: "Thread Safety",
      detail:
        "Factory Method itself has no threading concerns — but the products it creates may need their own thread-safety guarantees",
    },
    {
      aspect: "Best Approach",
      detail:
        "Classic for frameworks | Parameterized for simple apps | Registry for plugins | Functional for FP-friendly code",
    },
    {
      aspect: "When to Use",
      detail:
        "When a class can't anticipate the type of objects it needs, when creation logic is complex, or when you need a pluggable framework",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When there's only one product type, when object creation is trivial (just a constructor call), or when products rarely change",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (families of related products), Template Method (factory method is a specialization), Prototype (alternative when cloning is cheaper than subclassing), Strategy (factory methods can return strategies)",
    },
  ],

  // ─── ANTI-PATTERNS ──────────────────────────────────────────────
  antiPatterns: [
    {
      name: "God Factory",
      description:
        "One massive factory method with a switch statement handling dozens of unrelated product types — payments, notifications, reports, serializers — all in one class.",
      betterAlternative:
        "Split into separate factory hierarchies per domain (PaymentFactory, NotificationFactory). Each factory should create one family of related products.",
    },
    {
      name: "Concrete Creator Dependency",
      description:
        "Client code depends on concrete factory classes (StripeFactory) instead of the abstract ProcessorFactory interface. This defeats the entire purpose of the pattern.",
      betterAlternative:
        "Always program to the Creator interface. Inject the concrete factory via dependency injection or configuration.",
    },
    {
      name: "Factory That Returns null",
      description:
        "The factory method returns null for unknown types instead of throwing an exception or returning a Null Object. Callers get NullPointerExceptions far from the creation site.",
      betterAlternative:
        "Throw a descriptive exception (IllegalArgumentException) or return a Null Object that implements the Product interface with no-op behavior.",
    },
    {
      name: "Factory Inside Product",
      description:
        "The product class contains a static factory method that creates itself AND related products, conflating creation responsibility with business logic.",
      betterAlternative:
        "Keep factory logic in a separate Creator class. Products should focus on their behavior, not on how they are created.",
    },
    {
      name: "Over-Abstraction for One Type",
      description:
        "Creating an abstract Creator, ConcreteCreator, Product interface, and ConcreteProduct for a single type that will never have variants. Massive boilerplate for no benefit.",
      betterAlternative:
        "Use a simple constructor or static factory method. Apply the Factory Method pattern only when you genuinely expect multiple product types.",
    },
    {
      name: "Ignoring Dependency Injection",
      description:
        "Using Factory Method everywhere to create objects, ignoring the DI framework's built-in scoping and lifecycle management. This creates a parallel, hand-rolled DI system.",
      betterAlternative:
        "Use the DI container for object creation and lifecycle. Reserve Factory Method for cases where the DI container can't handle the creation logic (runtime type selection).",
    },
  ],
};

export default factoryMethodData;
