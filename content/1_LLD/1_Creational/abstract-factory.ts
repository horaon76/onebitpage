import { PatternData } from "@/lib/patterns/types";

const abstractFactoryData: PatternData = {
  slug: "abstract-factory",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Abstract Factory Pattern",
  subtitle:
    "Provide an interface for creating families of related or dependent objects without specifying their concrete classes.",

  intent:
    "The Abstract Factory pattern creates entire families of related objects that are designed to work together, without coupling client code to any concrete class. When a system must be configured with one of several product families — for example, UI widgets for different operating systems, or compliance documents for different regulatory regions — Abstract Factory ensures consistency within a family and makes it easy to swap the entire family at once.",

  classDiagramSvg: `<svg viewBox="0 0 520 310" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-arr); }
    .s-dash { stroke-dasharray:6,3; }
  </style>
  <defs>
    <marker id="af-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker>
  </defs>
  <!-- AbstractFactory -->
  <rect x="145" y="8" width="230" height="60" class="s-box s-diagram-box"/>
  <text x="260" y="26" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; AbstractFactory</text>
  <line x1="145" y1="30" x2="375" y2="30" class="s-diagram-line"/>
  <text x="155" y="44" class="s-member s-diagram-member">+createProductA(): ProductA</text>
  <text x="155" y="58" class="s-member s-diagram-member">+createProductB(): ProductB</text>
  <!-- ConcreteFactory1 -->
  <rect x="10" y="100" width="210" height="52" class="s-box s-diagram-box"/>
  <text x="115" y="118" text-anchor="middle" class="s-title s-diagram-title">ConcreteFactory1</text>
  <line x1="10" y1="122" x2="220" y2="122" class="s-diagram-line"/>
  <text x="20" y="136" class="s-member s-diagram-member">+createProductA(): ProductA1</text>
  <text x="20" y="148" class="s-member s-diagram-member">+createProductB(): ProductB1</text>
  <!-- ConcreteFactory2 -->
  <rect x="300" y="100" width="210" height="52" class="s-box s-diagram-box"/>
  <text x="405" y="118" text-anchor="middle" class="s-title s-diagram-title">ConcreteFactory2</text>
  <line x1="300" y1="122" x2="510" y2="122" class="s-diagram-line"/>
  <text x="310" y="136" class="s-member s-diagram-member">+createProductA(): ProductA2</text>
  <text x="310" y="148" class="s-member s-diagram-member">+createProductB(): ProductB2</text>
  <!-- Inheritance arrows -->
  <line x1="115" y1="100" x2="210" y2="68" class="s-arr s-diagram-arrow"/>
  <line x1="405" y1="100" x2="320" y2="68" class="s-arr s-diagram-arrow"/>
  <!-- AbstractProductA -->
  <rect x="10" y="190" width="200" height="36" class="s-box s-diagram-box"/>
  <text x="110" y="208" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; ProductA</text>
  <line x1="10" y1="212" x2="210" y2="212" class="s-diagram-line"/>
  <text x="20" y="222" class="s-member s-diagram-member">+operationA(): string</text>
  <!-- AbstractProductB -->
  <rect x="310" y="190" width="200" height="36" class="s-box s-diagram-box"/>
  <text x="410" y="208" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; ProductB</text>
  <line x1="310" y1="212" x2="510" y2="212" class="s-diagram-line"/>
  <text x="320" y="222" class="s-member s-diagram-member">+operationB(): string</text>
  <!-- Concrete products -->
  <rect x="10" y="256" width="90" height="28" class="s-box s-diagram-box"/>
  <text x="55" y="274" text-anchor="middle" class="s-title s-diagram-title">ProductA1</text>
  <rect x="120" y="256" width="90" height="28" class="s-box s-diagram-box"/>
  <text x="165" y="274" text-anchor="middle" class="s-title s-diagram-title">ProductA2</text>
  <rect x="310" y="256" width="90" height="28" class="s-box s-diagram-box"/>
  <text x="355" y="274" text-anchor="middle" class="s-title s-diagram-title">ProductB1</text>
  <rect x="420" y="256" width="90" height="28" class="s-box s-diagram-box"/>
  <text x="465" y="274" text-anchor="middle" class="s-title s-diagram-title">ProductB2</text>
  <!-- Product inheritance -->
  <line x1="55" y1="256" x2="80" y2="226" class="s-arr s-diagram-arrow"/>
  <line x1="165" y1="256" x2="140" y2="226" class="s-arr s-diagram-arrow"/>
  <line x1="355" y1="256" x2="380" y2="226" class="s-arr s-diagram-arrow"/>
  <line x1="465" y1="256" x2="440" y2="226" class="s-arr s-diagram-arrow"/>
  <!-- Creates arrows -->
  <line x1="65" y1="152" x2="65" y2="190" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="455" y1="152" x2="455" y2="190" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Abstract Factory declares creation methods for each product type in a family (createProductA, createProductB). Each Concrete Factory implements those methods to produce compatible products — Factory1 creates ProductA1 + ProductB1, Factory2 creates ProductA2 + ProductB2. The client works exclusively through the abstract interfaces, so swapping the entire family requires changing only which concrete factory is injected. The dashed arrows show creation dependencies: each factory knows how to instantiate its own family's concrete products.",

  diagramComponents: [
    {
      name: "AbstractFactory (interface)",
      description:
        "Declares creation methods for each product type in the family. Client code depends only on this interface, never on concrete factories.",
    },
    {
      name: "ConcreteFactory1 / ConcreteFactory2",
      description:
        "Each implements the AbstractFactory interface, producing a consistent set of products. Factory1 produces family-1 products; Factory2 produces family-2 products.",
    },
    {
      name: "AbstractProductA / AbstractProductB",
      description:
        "Interfaces for each product type. All concrete products within a type share this interface, enabling polymorphic usage.",
    },
    {
      name: "ProductA1, ProductA2, ProductB1, ProductB2",
      description:
        "Concrete product implementations. Products within the same family (e.g., A1 + B1) are designed to work together and must not be mixed with another family.",
    },
    {
      name: "createProductA() / createProductB()",
      description:
        "Factory methods declared in AbstractFactory. Each concrete factory overrides them to return the family-specific concrete product.",
    },
  ],

  solutionDetail:
    "**The Problem:** A system must work with multiple families of related objects — for example, UI components for macOS vs. Windows, or compliance documents for different regulatory regions. If client code creates objects directly via `new ConcreteProductA1()`, it becomes tightly coupled to one family and cannot switch families without modifying every creation site.\n\n**The Abstract Factory Solution:** Define an AbstractFactory interface with a creation method for each product type. Each ConcreteFactory implements the full interface, producing all products for one family. The client receives a factory object and calls its methods — it never touches concrete product classes. Swapping the entire family means injecting a different factory.\n\n**Why It Works:** The pattern enforces that products from the same family are always used together. You cannot accidentally create a macOS button with a Windows scrollbar, or mix a US compliance form with an EU audit report. This consistency guarantee is the key differentiator from individual Factory Methods.\n\n**The Trade-off:** Adding a new product type (e.g., createProductC) requires changing every factory — the AbstractFactory interface and all concrete implementations. This is the main cost. Adding a new family (a new ConcreteFactory) is easy. Therefore, the pattern works best when the set of product types is stable but the number of families may grow.\n\n**When It Shines:** Cross-platform UI toolkits, multi-region compliance systems, database abstraction layers that must produce compatible connections + statements + result sets, and theming systems where all visual components must match.",

  characteristics: [
    "Guarantees that products from one family are used together — prevents mixing incompatible components",
    "Adding a new product family is straightforward: implement one new ConcreteFactory",
    "Adding a new product type requires changing every factory — a structural trade-off",
    "Client code depends only on abstract interfaces, maximizing testability and flexibility",
    "Often combined with Singleton (one factory per family) and Factory Method (each create method is a factory method)",
    "Promotes the Dependency Inversion Principle — high-level modules depend on abstractions, not concrete products",
    "The factory itself is typically injected via dependency injection or selected by a configuration parameter",
  ],

  useCases: [
    {
      id: 1,
      title: "Cross-Platform UI Toolkit",
      domain: "Desktop Software",
      description:
        "A GUI framework must render buttons, checkboxes, and scrollbars that match the host OS — macOS Aqua, Windows Fluent, or Linux GTK.",
      whySingleton:
        "Abstract Factory ensures all UI widgets come from the same platform family, preventing visual inconsistencies like a macOS button next to a Windows scrollbar.",
      code: `interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}
class MacOSFactory implements UIFactory {
  createButton() { return new AquaButton(); }
  createCheckbox() { return new AquaCheckbox(); }
}
// Client code works with UIFactory — never sees Aqua or Fluent classes
const factory: UIFactory = new MacOSFactory();
const btn = factory.createButton();`,
    },
    {
      id: 2,
      title: "Multi-Region Compliance Documents",
      domain: "Fintech",
      description:
        "A global platform produces KYC forms, audit reports, and tax certificates that differ by regulatory region (US SEC, EU MiFID, APAC MAS).",
      whySingleton:
        "Each region factory produces the complete set of compliant documents, guaranteeing you never mix a US KYC form with an EU audit report.",
      code: `interface ComplianceFactory {
  createKYCForm(): KYCForm;
  createAuditReport(): AuditReport;
}
class USComplianceFactory implements ComplianceFactory {
  createKYCForm() { return new USKYCForm(); }      // W-9 based
  createAuditReport() { return new SOXAuditReport(); } // SOX compliant
}
class EUComplianceFactory implements ComplianceFactory {
  createKYCForm() { return new EUKYCForm(); }      // GDPR compliant
  createAuditReport() { return new MiFIDAuditReport(); }
}`,
    },
    {
      id: 3,
      title: "Database Abstraction Layer",
      domain: "Backend Infrastructure",
      description:
        "An ORM creates connections, prepared statements, and result sets that must all be from the same database vendor (PostgreSQL, MySQL, SQLite).",
      whySingleton:
        "Abstract Factory ensures connection, statement, and result-set objects are vendor-compatible — preventing a PostgreSQL connection from executing a MySQL-specific statement.",
      code: `interface DBFactory {
  createConnection(): Connection;
  createStatement(): PreparedStatement;
  createResultSet(): ResultSet;
}
class PostgresFactory implements DBFactory {
  createConnection() { return new PGConnection(); }
  createStatement() { return new PGPreparedStatement(); }
  createResultSet() { return new PGResultSet(); }
}
// Swap to MySQL by injecting new MySQLFactory() — zero code changes`,
    },
    {
      id: 4,
      title: "Platform-Specific Medical Devices",
      domain: "Healthcare",
      description:
        "A telemedicine app integrates blood pressure monitors and pulse oximeters across iOS HealthKit, Android Health Connect, and desktop USB.",
      whySingleton:
        "Each platform factory produces device interfaces that use the correct SDK, ensuring iOS Bluetooth calls are never mixed with Android Health Connect APIs.",
      code: `interface MedicalDeviceFactory {
  createBPMonitor(): BloodPressureMonitor;
  createOximeter(): PulseOximeter;
}
class IOSDeviceFactory implements MedicalDeviceFactory {
  createBPMonitor() { return new HealthKitBP(); }  // uses CoreBluetooth
  createOximeter() { return new HealthKitOx(); }
}
class AndroidDeviceFactory implements MedicalDeviceFactory {
  createBPMonitor() { return new HealthConnectBP(); }
  createOximeter() { return new HealthConnectOx(); }
}`,
    },
    {
      id: 5,
      title: "Game Rendering Engine",
      domain: "Gaming",
      description:
        "A game engine supports DirectX, Vulkan, and Metal backends. Each needs compatible textures, shaders, and render pipelines.",
      whySingleton:
        "The rendering factory produces GPU resources that are all compatible with the selected graphics API, preventing cross-API resource leaks.",
      code: `interface RenderFactory {
  createTexture(path: string): Texture;
  createShader(src: string): Shader;
  createPipeline(): RenderPipeline;
}
class VulkanFactory implements RenderFactory {
  createTexture(p) { return new VkTexture(p); }
  createShader(s) { return new VkShader(s); }
  createPipeline() { return new VkPipeline(); }
}
// Metal, DirectX — same interface, different GPU implementations`,
    },
    {
      id: 6,
      title: "Theme System",
      domain: "Frontend / Design Systems",
      description:
        "A design system supports light, dark, and high-contrast themes. Each theme has buttons, inputs, cards, and modals with matching colors and styles.",
      whySingleton:
        "A ThemeFactory produces all visual components for one theme, ensuring consistent styling across the entire UI.",
      code: `interface ThemeFactory {
  createButton(): ThemedButton;
  createInput(): ThemedInput;
  createCard(): ThemedCard;
}
class DarkThemeFactory implements ThemeFactory {
  createButton() { return new DarkButton(); }  // #1a1a2e bg
  createInput() { return new DarkInput(); }
  createCard() { return new DarkCard(); }
}
// Switch theme: inject LightThemeFactory — all components update together`,
    },
    {
      id: 7,
      title: "Cloud Provider Abstraction",
      domain: "Cloud Infrastructure",
      description:
        "A multi-cloud deployment tool creates VMs, storage buckets, and DNS records across AWS, GCP, and Azure, each with different APIs.",
      whySingleton:
        "Each cloud factory produces resources that work with the same provider SDK, preventing AWS EC2 instances from being paired with GCP storage.",
      code: `interface CloudFactory {
  createVM(spec: VMSpec): VirtualMachine;
  createStorage(name: string): StorageBucket;
  createDNS(domain: string): DNSRecord;
}
class AWSFactory implements CloudFactory {
  createVM(spec) { return new EC2Instance(spec); }
  createStorage(n) { return new S3Bucket(n); }
  createDNS(d) { return new Route53Record(d); }
}
// Deploy to GCP: inject new GCPFactory() — same orchestration code`,
    },
    {
      id: 8,
      title: "Payment Suite per Region",
      domain: "E-Commerce",
      description:
        "An e-commerce platform needs region-specific payment methods, tax calculators, and invoice generators (US, EU, APAC).",
      whySingleton:
        "The regional factory ensures the payment processor, tax engine, and invoice template all comply with the same jurisdiction's rules.",
      code: `interface PaymentSuiteFactory {
  createProcessor(): PaymentProcessor;
  createTaxCalc(): TaxCalculator;
  createInvoice(): InvoiceGenerator;
}
class USPaymentFactory implements PaymentSuiteFactory {
  createProcessor() { return new StripeProcessor(); }
  createTaxCalc() { return new USSalesTax(); }      // state-level rules
  createInvoice() { return new USInvoice(); }        // IRS format
}
class EUPaymentFactory implements PaymentSuiteFactory {
  createProcessor() { return new AdyenProcessor(); }
  createTaxCalc() { return new EUVAT(); }            // VAT rules
  createInvoice() { return new EUInvoice(); }
}`,
    },
    {
      id: 9,
      title: "Document Format Suite",
      domain: "SaaS / Productivity",
      description:
        "A document editor exports to PDF, HTML, or DOCX. Each format requires a compatible renderer, font embedder, and image converter.",
      whySingleton:
        "The format factory ensures all export components use the same output specification, preventing format-specific artifacts.",
      code: `interface ExportFactory {
  createRenderer(): DocRenderer;
  createFontEmbed(): FontEmbedder;
  createImageConv(): ImageConverter;
}
class PDFExportFactory implements ExportFactory {
  createRenderer() { return new PDFRenderer(); }
  createFontEmbed() { return new PDFFontEmbedder(); }  // subset embedding
  createImageConv() { return new PDFImageConverter(); } // CMYK support
}
// HTML export: inject HTMLExportFactory — uses web fonts + SVG images`,
    },
    {
      id: 10,
      title: "Vehicle Family in Manufacturing",
      domain: "Automotive",
      description:
        "A car manufacturer produces sedan, SUV, and truck families where engine, chassis, and interior must match the vehicle type.",
      whySingleton:
        "Each vehicle factory produces compatible components — a truck engine paired with a sedan chassis would be a safety catastrophe.",
      code: `interface VehicleFactory {
  createEngine(): Engine;
  createChassis(): Chassis;
  createInterior(): Interior;
}
class SUVFactory implements VehicleFactory {
  createEngine() { return new V6Engine(); }        // 3.5L V6
  createChassis() { return new SUVChassis(); }     // body-on-frame
  createInterior() { return new SUVInterior(); }   // elevated seating
}
// Sedan, Truck — same interface, matched components per vehicle type`,
    },
    {
      id: 11,
      title: "Notification Suite per Channel",
      domain: "Communication Platform",
      description:
        "A notification system sends messages via email, SMS, or Slack. Each channel needs a matching formatter, sender, and delivery tracker.",
      whySingleton:
        "The channel factory ensures the formatter produces content in the right format for the sender, and tracking uses the correct delivery API.",
      code: `interface NotificationFactory {
  createFormatter(): MessageFormatter;
  createSender(): MessageSender;
  createTracker(): DeliveryTracker;
}
class EmailFactory implements NotificationFactory {
  createFormatter() { return new HTMLFormatter(); }    // rich HTML
  createSender() { return new SMTPSender(); }          // via SMTP
  createTracker() { return new EmailOpenTracker(); }   // pixel tracking
}
class SlackFactory implements NotificationFactory {
  createFormatter() { return new MarkdownFormatter(); }
  createSender() { return new SlackWebhookSender(); }
  createTracker() { return new SlackReadTracker(); }
}`,
    },
    {
      id: 12,
      title: "Test Double Suite",
      domain: "Testing / DevOps",
      description:
        "Integration tests need mock repositories, fake HTTP clients, and stub caches that work together consistently.",
      whySingleton:
        "A TestDoubleFactory produces compatible fakes — a mock repository that returns data the stub cache can handle, with fake HTTP that matches expected contracts.",
      code: `interface TestDoubleFactory {
  createRepo(): Repository;
  createHttpClient(): HttpClient;
  createCache(): CacheStore;
}
class InMemoryTestFactory implements TestDoubleFactory {
  createRepo() { return new InMemoryRepo(); }       // Map-based store
  createHttpClient() { return new FakeHttpClient(); } // canned responses
  createCache() { return new InMemoryCache(); }      // simple Map<K,V>
}
// Production: inject RealFactory with Postgres + Axios + Redis`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Cross-Region Compliance Factory",
      domain: "Fintech",
      problem:
        "A global fintech platform must produce compliance documents — KYC verification forms and transaction audit reports — that differ structurally by regulatory region (US SEC, EU MiFID). Mixing a US KYC form with an EU audit report in the same customer file triggers regulatory violations.",
      solution:
        "An AbstractComplianceFactory declares methods to create a KYC form and an audit report. USComplianceFactory and EUComplianceFactory each produce the region-correct set of documents, guaranteeing they are always used together.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-e1); }
  </style>
  <defs><marker id="af-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="8" width="260" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">ComplianceFactory</text>
  <line x1="130" y1="28" x2="390" y2="28" class="s-diagram-line"/>
  <text x="140" y="42" class="s-member s-diagram-member">+createKYCForm(): KYCForm</text>
  <text x="140" y="54" class="s-member s-diagram-member">+createAuditReport(): AuditReport</text>
  <rect x="10" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="100" y="112" text-anchor="middle" class="s-title s-diagram-title">USComplianceFactory</text>
  <rect x="330" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="420" y="112" text-anchor="middle" class="s-title s-diagram-title">EUComplianceFactory</text>
  <line x1="100" y1="90" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="420" y1="90" x2="330" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="60" y="156" width="140" height="28" class="s-box s-diagram-box"/>
  <text x="130" y="174" text-anchor="middle" class="s-title s-diagram-title">KYCForm</text>
  <rect x="320" y="156" width="140" height="28" class="s-box s-diagram-box"/>
  <text x="390" y="174" text-anchor="middle" class="s-title s-diagram-title">AuditReport</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Abstract Factory — Compliance Documents

class KYCForm(ABC):
    @abstractmethod
    def render(self, customer_id: str) -> str: ...

class AuditReport(ABC):
    @abstractmethod
    def render(self, tx_id: str) -> str: ...

class USKYCForm(KYCForm):
    def render(self, customer_id: str) -> str:
        return f"US SEC KYC (W-9) for {customer_id}"

class USAuditReport(AuditReport):
    def render(self, tx_id: str) -> str:
        return f"US SOX audit report for tx {tx_id}"

class EUKYCForm(KYCForm):
    def render(self, customer_id: str) -> str:
        return f"EU MiFID KYC (GDPR-compliant) for {customer_id}"

class EUAuditReport(AuditReport):
    def render(self, tx_id: str) -> str:
        return f"EU MiFID II audit report for tx {tx_id}"

class ComplianceFactory(ABC):
    @abstractmethod
    def create_kyc_form(self) -> KYCForm: ...
    @abstractmethod
    def create_audit_report(self) -> AuditReport: ...

class USComplianceFactory(ComplianceFactory):
    def create_kyc_form(self) -> KYCForm: return USKYCForm()
    def create_audit_report(self) -> AuditReport: return USAuditReport()

class EUComplianceFactory(ComplianceFactory):
    def create_kyc_form(self) -> KYCForm: return EUKYCForm()
    def create_audit_report(self) -> AuditReport: return EUAuditReport()

# ── Usage ──
factory: ComplianceFactory = EUComplianceFactory()
print(factory.create_kyc_form().render("CUST-4421"))
print(factory.create_audit_report().render("TX-88210"))`,
        Go: `package main

import "fmt"

type KYCForm interface{ Render(customerID string) string }
type AuditReport interface{ Render(txID string) string }

type EUKYCForm struct{}
func (e EUKYCForm) Render(id string) string {
	return fmt.Sprintf("EU MiFID KYC for %s", id)
}
type EUAuditReport struct{}
func (e EUAuditReport) Render(tx string) string {
	return fmt.Sprintf("EU MiFID II audit for tx %s", tx)
}
type USKYCForm struct{}
func (u USKYCForm) Render(id string) string {
	return fmt.Sprintf("US SEC KYC (W-9) for %s", id)
}
type USAuditReport struct{}
func (u USAuditReport) Render(tx string) string {
	return fmt.Sprintf("US SOX audit for tx %s", tx)
}

type ComplianceFactory interface {
	CreateKYCForm() KYCForm
	CreateAuditReport() AuditReport
}

type EUComplianceFactory struct{}
func (f EUComplianceFactory) CreateKYCForm() KYCForm       { return EUKYCForm{} }
func (f EUComplianceFactory) CreateAuditReport() AuditReport { return EUAuditReport{} }

type USComplianceFactory struct{}
func (f USComplianceFactory) CreateKYCForm() KYCForm       { return USKYCForm{} }
func (f USComplianceFactory) CreateAuditReport() AuditReport { return USAuditReport{} }

func main() {
	var factory ComplianceFactory = EUComplianceFactory{}
	fmt.Println(factory.CreateKYCForm().Render("CUST-4421"))
	fmt.Println(factory.CreateAuditReport().Render("TX-88210"))
}`,
        Java: `interface KYCForm { String render(String customerId); }
interface AuditReport { String render(String txId); }

class USKYCForm implements KYCForm {
    public String render(String id) { return "US SEC KYC (W-9) for " + id; }
}
class USAuditReport implements AuditReport {
    public String render(String tx) { return "US SOX audit for tx " + tx; }
}
class EUKYCForm implements KYCForm {
    public String render(String id) { return "EU MiFID KYC for " + id; }
}
class EUAuditReport implements AuditReport {
    public String render(String tx) { return "EU MiFID II audit for tx " + tx; }
}

interface ComplianceFactory {
    KYCForm createKYCForm();
    AuditReport createAuditReport();
}

class USComplianceFactory implements ComplianceFactory {
    public KYCForm createKYCForm() { return new USKYCForm(); }
    public AuditReport createAuditReport() { return new USAuditReport(); }
}
class EUComplianceFactory implements ComplianceFactory {
    public KYCForm createKYCForm() { return new EUKYCForm(); }
    public AuditReport createAuditReport() { return new EUAuditReport(); }
}`,
        TypeScript: `interface KYCForm { render(customerId: string): string; }
interface AuditReport { render(txId: string): string; }

class USKYCForm implements KYCForm {
  render(id: string) { return \`US SEC KYC (W-9) for \${id}\`; }
}
class USAuditReport implements AuditReport {
  render(tx: string) { return \`US SOX audit for tx \${tx}\`; }
}
class EUKYCForm implements KYCForm {
  render(id: string) { return \`EU MiFID KYC (GDPR-compliant) for \${id}\`; }
}
class EUAuditReport implements AuditReport {
  render(tx: string) { return \`EU MiFID II audit for tx \${tx}\`; }
}

interface ComplianceFactory {
  createKYCForm(): KYCForm;
  createAuditReport(): AuditReport;
}

class EUComplianceFactory implements ComplianceFactory {
  createKYCForm(): KYCForm { return new EUKYCForm(); }
  createAuditReport(): AuditReport { return new EUAuditReport(); }
}

// ── Usage ──
const factory: ComplianceFactory = new EUComplianceFactory();
console.log(factory.createKYCForm().render("CUST-4421"));
console.log(factory.createAuditReport().render("TX-88210"));`,
        Rust: `trait KYCForm { fn render(&self, customer_id: &str) -> String; }
trait AuditReport { fn render(&self, tx_id: &str) -> String; }

struct USKYCForm;
impl KYCForm for USKYCForm {
    fn render(&self, id: &str) -> String { format!("US SEC KYC (W-9) for {}", id) }
}
struct USAuditReport;
impl AuditReport for USAuditReport {
    fn render(&self, tx: &str) -> String { format!("US SOX audit for tx {}", tx) }
}
struct EUKYCForm;
impl KYCForm for EUKYCForm {
    fn render(&self, id: &str) -> String { format!("EU MiFID KYC for {}", id) }
}
struct EUAuditReport;
impl AuditReport for EUAuditReport {
    fn render(&self, tx: &str) -> String { format!("EU MiFID II audit for tx {}", tx) }
}

trait ComplianceFactory {
    fn create_kyc_form(&self) -> Box<dyn KYCForm>;
    fn create_audit_report(&self) -> Box<dyn AuditReport>;
}

struct EUComplianceFactory;
impl ComplianceFactory for EUComplianceFactory {
    fn create_kyc_form(&self) -> Box<dyn KYCForm> { Box::new(EUKYCForm) }
    fn create_audit_report(&self) -> Box<dyn AuditReport> { Box::new(EUAuditReport) }
}

fn main() {
    let factory: Box<dyn ComplianceFactory> = Box::new(EUComplianceFactory);
    println!("{}", factory.create_kyc_form().render("CUST-4421"));
    println!("{}", factory.create_audit_report().render("TX-88210"));
}`,
      },
      considerations: [
        "Each regulatory region has strict requirements — validate output against the standard's schema (SEC, MiFID, MAS)",
        "New regions (e.g., APAC MAS) require one new factory class, not changes to existing factories",
        "Cross-region customers may need documents from multiple factories — aggregate at a higher level, not inside the factory",
        "Version the document templates so old compliance reports can be re-generated in their original format",
        "Consider combining with Singleton so each region has exactly one factory instance",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Platform-Specific Medical Devices",
      domain: "Healthcare",
      problem:
        "A telemedicine app integrates with medical devices (blood pressure monitors, pulse oximeters) across iOS HealthKit, Android Health Connect, and desktop USB. Each platform uses different APIs and data formats. Mixing iOS Bluetooth calls with Android Health Connect APIs crashes the app.",
      solution:
        "A MedicalDeviceFactory creates platform-matched peripherals. IOSDeviceFactory uses HealthKit, AndroidDeviceFactory uses Health Connect — ensuring all device interfaces on a platform are compatible.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-e2); }
  </style>
  <defs><marker id="af-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="8" width="260" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">MedicalDeviceFactory</text>
  <line x1="130" y1="28" x2="390" y2="28" class="s-diagram-line"/>
  <text x="140" y="42" class="s-member s-diagram-member">+createBPMonitor(): BPMonitor</text>
  <text x="140" y="54" class="s-member s-diagram-member">+createOximeter(): PulseOximeter</text>
  <rect x="10" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="100" y="112" text-anchor="middle" class="s-title s-diagram-title">IOSDeviceFactory</text>
  <rect x="330" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="420" y="112" text-anchor="middle" class="s-title s-diagram-title">AndroidDeviceFactory</text>
  <line x1="100" y1="90" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="420" y1="90" x2="330" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="50" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="130" y="174" text-anchor="middle" class="s-title s-diagram-title">BPMonitor</text>
  <rect x="310" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="390" y="174" text-anchor="middle" class="s-title s-diagram-title">PulseOximeter</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Abstract Factory — Medical Devices

class BloodPressureMonitor(ABC):
    @abstractmethod
    def read_systolic(self) -> str: ...

class PulseOximeter(ABC):
    @abstractmethod
    def read_spo2(self) -> str: ...

class IOSBloodPressure(BloodPressureMonitor):
    def read_systolic(self) -> str:
        return "HealthKit BLE: systolic 120 mmHg"

class IOSPulseOximeter(PulseOximeter):
    def read_spo2(self) -> str:
        return "HealthKit BLE: SpO2 98%"

class AndroidBloodPressure(BloodPressureMonitor):
    def read_systolic(self) -> str:
        return "Health Connect: systolic 118 mmHg"

class AndroidPulseOximeter(PulseOximeter):
    def read_spo2(self) -> str:
        return "Health Connect: SpO2 97%"

class MedicalDeviceFactory(ABC):
    @abstractmethod
    def create_bp_monitor(self) -> BloodPressureMonitor: ...
    @abstractmethod
    def create_oximeter(self) -> PulseOximeter: ...

class IOSDeviceFactory(MedicalDeviceFactory):
    def create_bp_monitor(self): return IOSBloodPressure()
    def create_oximeter(self): return IOSPulseOximeter()

class AndroidDeviceFactory(MedicalDeviceFactory):
    def create_bp_monitor(self): return AndroidBloodPressure()
    def create_oximeter(self): return AndroidPulseOximeter()

# ── Usage ──
factory: MedicalDeviceFactory = IOSDeviceFactory()
print(factory.create_bp_monitor().read_systolic())
print(factory.create_oximeter().read_spo2())`,
        Go: `package main

import "fmt"

type BloodPressureMonitor interface{ ReadSystolic() string }
type PulseOximeter interface{ ReadSpO2() string }

type IOSBloodPressure struct{}
func (i IOSBloodPressure) ReadSystolic() string { return "HealthKit BLE: systolic 120 mmHg" }
type IOSPulseOximeter struct{}
func (i IOSPulseOximeter) ReadSpO2() string { return "HealthKit BLE: SpO2 98%" }

type AndroidBloodPressure struct{}
func (a AndroidBloodPressure) ReadSystolic() string { return "Health Connect: systolic 118 mmHg" }
type AndroidPulseOximeter struct{}
func (a AndroidPulseOximeter) ReadSpO2() string { return "Health Connect: SpO2 97%" }

type MedicalDeviceFactory interface {
	CreateBPMonitor() BloodPressureMonitor
	CreateOximeter() PulseOximeter
}

type IOSDeviceFactory struct{}
func (f IOSDeviceFactory) CreateBPMonitor() BloodPressureMonitor { return IOSBloodPressure{} }
func (f IOSDeviceFactory) CreateOximeter() PulseOximeter         { return IOSPulseOximeter{} }

type AndroidDeviceFactory struct{}
func (f AndroidDeviceFactory) CreateBPMonitor() BloodPressureMonitor { return AndroidBloodPressure{} }
func (f AndroidDeviceFactory) CreateOximeter() PulseOximeter         { return AndroidPulseOximeter{} }

func main() {
	var factory MedicalDeviceFactory = IOSDeviceFactory{}
	fmt.Println(factory.CreateBPMonitor().ReadSystolic())
	fmt.Println(factory.CreateOximeter().ReadSpO2())
}`,
        Java: `interface BloodPressureMonitor { String readSystolic(); }
interface PulseOximeter { String readSpO2(); }

class IOSBloodPressure implements BloodPressureMonitor {
    public String readSystolic() { return "HealthKit BLE: systolic 120 mmHg"; }
}
class IOSPulseOximeter implements PulseOximeter {
    public String readSpO2() { return "HealthKit BLE: SpO2 98%"; }
}
class AndroidBloodPressure implements BloodPressureMonitor {
    public String readSystolic() { return "Health Connect: systolic 118 mmHg"; }
}
class AndroidPulseOximeter implements PulseOximeter {
    public String readSpO2() { return "Health Connect: SpO2 97%"; }
}

interface MedicalDeviceFactory {
    BloodPressureMonitor createBPMonitor();
    PulseOximeter createOximeter();
}

class IOSDeviceFactory implements MedicalDeviceFactory {
    public BloodPressureMonitor createBPMonitor() { return new IOSBloodPressure(); }
    public PulseOximeter createOximeter() { return new IOSPulseOximeter(); }
}
class AndroidDeviceFactory implements MedicalDeviceFactory {
    public BloodPressureMonitor createBPMonitor() { return new AndroidBloodPressure(); }
    public PulseOximeter createOximeter() { return new AndroidPulseOximeter(); }
}`,
        TypeScript: `interface BloodPressureMonitor { readSystolic(): string; }
interface PulseOximeter { readSpO2(): string; }

class IOSBloodPressure implements BloodPressureMonitor {
  readSystolic() { return "HealthKit BLE: systolic 120 mmHg"; }
}
class IOSPulseOximeter implements PulseOximeter {
  readSpO2() { return "HealthKit BLE: SpO2 98%"; }
}
class AndroidBloodPressure implements BloodPressureMonitor {
  readSystolic() { return "Health Connect: systolic 118 mmHg"; }
}
class AndroidPulseOximeter implements PulseOximeter {
  readSpO2() { return "Health Connect: SpO2 97%"; }
}

interface MedicalDeviceFactory {
  createBPMonitor(): BloodPressureMonitor;
  createOximeter(): PulseOximeter;
}

class IOSDeviceFactory implements MedicalDeviceFactory {
  createBPMonitor() { return new IOSBloodPressure(); }
  createOximeter() { return new IOSPulseOximeter(); }
}

// ── Usage ──
const factory: MedicalDeviceFactory = new IOSDeviceFactory();
console.log(factory.createBPMonitor().readSystolic());
console.log(factory.createOximeter().readSpO2());`,
        Rust: `trait BloodPressureMonitor { fn read_systolic(&self) -> String; }
trait PulseOximeter { fn read_spo2(&self) -> String; }

struct IOSBloodPressure;
impl BloodPressureMonitor for IOSBloodPressure {
    fn read_systolic(&self) -> String { "HealthKit BLE: systolic 120 mmHg".into() }
}
struct IOSPulseOximeter;
impl PulseOximeter for IOSPulseOximeter {
    fn read_spo2(&self) -> String { "HealthKit BLE: SpO2 98%".into() }
}
struct AndroidBloodPressure;
impl BloodPressureMonitor for AndroidBloodPressure {
    fn read_systolic(&self) -> String { "Health Connect: systolic 118 mmHg".into() }
}
struct AndroidPulseOximeter;
impl PulseOximeter for AndroidPulseOximeter {
    fn read_spo2(&self) -> String { "Health Connect: SpO2 97%".into() }
}

trait MedicalDeviceFactory {
    fn create_bp_monitor(&self) -> Box<dyn BloodPressureMonitor>;
    fn create_oximeter(&self) -> Box<dyn PulseOximeter>;
}

struct IOSDeviceFactory;
impl MedicalDeviceFactory for IOSDeviceFactory {
    fn create_bp_monitor(&self) -> Box<dyn BloodPressureMonitor> { Box::new(IOSBloodPressure) }
    fn create_oximeter(&self) -> Box<dyn PulseOximeter> { Box::new(IOSPulseOximeter) }
}

fn main() {
    let factory: Box<dyn MedicalDeviceFactory> = Box::new(IOSDeviceFactory);
    println!("{}", factory.create_bp_monitor().read_systolic());
    println!("{}", factory.create_oximeter().read_spo2());
}`,
      },
      considerations: [
        "Each platform SDK has different initialization requirements — factory creation should handle SDK setup",
        "HealthKit requires user permission prompts — the iOS factory must handle authorization flows before device creation",
        "Data formats differ per platform — products should normalize output to a common DTO for the application layer",
        "Adding a desktop USB factory only requires implementing the MedicalDeviceFactory interface, no changes to existing code",
        "Device connections can fail — each product should implement a retry/reconnect strategy specific to its platform",
      ],
    },
    {
      id: 3,
      title: "E-Commerce — Cross-Platform UI Toolkit",
      domain: "E-Commerce",
      problem:
        "An e-commerce admin panel must run on macOS, Windows, and Linux with native-looking UI components. Buttons, text inputs, and dropdown menus must match the host OS style. Mixing a macOS Aqua button with a Windows Fluent dropdown looks broken and confuses users.",
      solution:
        "A UIFactory creates platform-specific widgets. MacOSFactory produces Aqua-styled components, WindowsFactory produces Fluent-styled components — the app code works with abstract Widget interfaces.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-e3); }
  </style>
  <defs><marker id="af-e3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="8" width="260" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">UIFactory</text>
  <line x1="130" y1="28" x2="390" y2="28" class="s-diagram-line"/>
  <text x="140" y="42" class="s-member s-diagram-member">+createButton(): Button</text>
  <text x="140" y="54" class="s-member s-diagram-member">+createTextInput(): TextInput</text>
  <rect x="10" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="100" y="112" text-anchor="middle" class="s-title s-diagram-title">MacOSFactory</text>
  <rect x="330" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="420" y="112" text-anchor="middle" class="s-title s-diagram-title">WindowsFactory</text>
  <line x1="100" y1="90" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="420" y1="90" x2="330" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="60" y="156" width="140" height="28" class="s-box s-diagram-box"/>
  <text x="130" y="174" text-anchor="middle" class="s-title s-diagram-title">Button</text>
  <rect x="320" y="156" width="140" height="28" class="s-box s-diagram-box"/>
  <text x="390" y="174" text-anchor="middle" class="s-title s-diagram-title">TextInput</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Abstract Factory — Cross-Platform UI

class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class TextInput(ABC):
    @abstractmethod
    def render(self) -> str: ...

class MacOSButton(Button):
    def render(self) -> str: return "Rendering macOS Aqua button"

class MacOSTextInput(TextInput):
    def render(self) -> str: return "Rendering macOS rounded text field"

class WindowsButton(Button):
    def render(self) -> str: return "Rendering Windows Fluent button"

class WindowsTextInput(TextInput):
    def render(self) -> str: return "Rendering Windows Fluent text box"

class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_text_input(self) -> TextInput: ...

class MacOSFactory(UIFactory):
    def create_button(self): return MacOSButton()
    def create_text_input(self): return MacOSTextInput()

class WindowsFactory(UIFactory):
    def create_button(self): return WindowsButton()
    def create_text_input(self): return WindowsTextInput()

# ── Usage ──
import platform
factory: UIFactory = MacOSFactory() if platform.system() == "Darwin" else WindowsFactory()
print(factory.create_button().render())
print(factory.create_text_input().render())`,
        Go: `package main

import (
	"fmt"
	"runtime"
)

type Button interface{ Render() string }
type TextInput interface{ Render() string }

type MacOSButton struct{}
func (m MacOSButton) Render() string { return "macOS Aqua button" }
type MacOSTextInput struct{}
func (m MacOSTextInput) Render() string { return "macOS rounded text field" }

type WindowsButton struct{}
func (w WindowsButton) Render() string { return "Windows Fluent button" }
type WindowsTextInput struct{}
func (w WindowsTextInput) Render() string { return "Windows Fluent text box" }

type UIFactory interface {
	CreateButton() Button
	CreateTextInput() TextInput
}

type MacOSFactory struct{}
func (f MacOSFactory) CreateButton() Button     { return MacOSButton{} }
func (f MacOSFactory) CreateTextInput() TextInput { return MacOSTextInput{} }

type WindowsFactory struct{}
func (f WindowsFactory) CreateButton() Button     { return WindowsButton{} }
func (f WindowsFactory) CreateTextInput() TextInput { return WindowsTextInput{} }

func main() {
	var factory UIFactory
	if runtime.GOOS == "darwin" {
		factory = MacOSFactory{}
	} else {
		factory = WindowsFactory{}
	}
	fmt.Println(factory.CreateButton().Render())
	fmt.Println(factory.CreateTextInput().Render())
}`,
        Java: `interface Button { String render(); }
interface TextInput { String render(); }

class MacOSButton implements Button {
    public String render() { return "macOS Aqua button"; }
}
class MacOSTextInput implements TextInput {
    public String render() { return "macOS rounded text field"; }
}
class WindowsButton implements Button {
    public String render() { return "Windows Fluent button"; }
}
class WindowsTextInput implements TextInput {
    public String render() { return "Windows Fluent text box"; }
}

interface UIFactory {
    Button createButton();
    TextInput createTextInput();
}

class MacOSFactory implements UIFactory {
    public Button createButton() { return new MacOSButton(); }
    public TextInput createTextInput() { return new MacOSTextInput(); }
}
class WindowsFactory implements UIFactory {
    public Button createButton() { return new WindowsButton(); }
    public TextInput createTextInput() { return new WindowsTextInput(); }
}`,
        TypeScript: `interface Button { render(): string; }
interface TextInput { render(): string; }

class MacOSButton implements Button {
  render() { return "macOS Aqua button"; }
}
class MacOSTextInput implements TextInput {
  render() { return "macOS rounded text field"; }
}
class WindowsButton implements Button {
  render() { return "Windows Fluent button"; }
}
class WindowsTextInput implements TextInput {
  render() { return "Windows Fluent text box"; }
}

interface UIFactory {
  createButton(): Button;
  createTextInput(): TextInput;
}

class MacOSFactory implements UIFactory {
  createButton() { return new MacOSButton(); }
  createTextInput() { return new MacOSTextInput(); }
}
class WindowsFactory implements UIFactory {
  createButton() { return new WindowsButton(); }
  createTextInput() { return new WindowsTextInput(); }
}

// ── Usage ──
const isMac = navigator.platform.includes("Mac");
const factory: UIFactory = isMac ? new MacOSFactory() : new WindowsFactory();
console.log(factory.createButton().render());`,
        Rust: `trait Button { fn render(&self) -> String; }
trait TextInput { fn render(&self) -> String; }

struct MacOSButton;
impl Button for MacOSButton {
    fn render(&self) -> String { "macOS Aqua button".into() }
}
struct MacOSTextInput;
impl TextInput for MacOSTextInput {
    fn render(&self) -> String { "macOS rounded text field".into() }
}
struct WindowsButton;
impl Button for WindowsButton {
    fn render(&self) -> String { "Windows Fluent button".into() }
}
struct WindowsTextInput;
impl TextInput for WindowsTextInput {
    fn render(&self) -> String { "Windows Fluent text box".into() }
}

trait UIFactory {
    fn create_button(&self) -> Box<dyn Button>;
    fn create_text_input(&self) -> Box<dyn TextInput>;
}

struct MacOSFactory;
impl UIFactory for MacOSFactory {
    fn create_button(&self) -> Box<dyn Button> { Box::new(MacOSButton) }
    fn create_text_input(&self) -> Box<dyn TextInput> { Box::new(MacOSTextInput) }
}

fn main() {
    let factory: Box<dyn UIFactory> = Box::new(MacOSFactory);
    println!("{}", factory.create_button().render());
    println!("{}", factory.create_text_input().render());
}`,
      },
      considerations: [
        "Platform detection should happen once at startup — inject the factory globally via dependency injection or context",
        "Each platform may have accessibility requirements (VoiceOver for macOS, Narrator for Windows) — products should embed platform-specific ARIA hints",
        "Adding a Linux GTK factory only requires implementing UIFactory — existing macOS and Windows code is untouched",
        "Widgets may need platform-specific event handling (gestures on macOS, keyboard shortcuts on Windows)",
        "Theme overrides within a platform (light/dark) can be handled via factory configuration or decorator",
      ],
    },
    {
      id: 4,
      title: "Media Streaming — Codec Family Factory",
      domain: "Media Streaming",
      problem:
        "A streaming platform must transcode content using compatible codec families — H.264 video + AAC audio + WebVTT subtitles for web, or HEVC + Opus + SRT for apps. Mixing H.264 video with an Opus audio codec causes container format errors and playback failures.",
      solution:
        "A CodecFamilyFactory creates a set of compatible codecs. WebCodecFactory produces H.264 + AAC + WebVTT; AppCodecFactory produces HEVC + Opus + SRT. The transcoding pipeline works through abstract interfaces.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-e4); }
  </style>
  <defs><marker id="af-e4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="8" width="280" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">CodecFamilyFactory</text>
  <line x1="120" y1="28" x2="400" y2="28" class="s-diagram-line"/>
  <text x="130" y="42" class="s-member s-diagram-member">+createVideoCodec(): VideoCodec</text>
  <text x="130" y="54" class="s-member s-diagram-member">+createAudioCodec(): AudioCodec</text>
  <rect x="10" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="100" y="112" text-anchor="middle" class="s-title s-diagram-title">WebCodecFactory</text>
  <rect x="330" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="420" y="112" text-anchor="middle" class="s-title s-diagram-title">AppCodecFactory</text>
  <line x1="100" y1="90" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="420" y1="90" x2="330" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="50" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="130" y="174" text-anchor="middle" class="s-title s-diagram-title">VideoCodec</text>
  <rect x="310" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="390" y="174" text-anchor="middle" class="s-title s-diagram-title">AudioCodec</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Abstract Factory — Codec Family

class VideoCodec(ABC):
    @abstractmethod
    def encode(self, source: str) -> str: ...

class AudioCodec(ABC):
    @abstractmethod
    def encode(self, source: str) -> str: ...

class H264Codec(VideoCodec):
    def encode(self, source: str) -> str:
        return f"H.264 encoding {source} for web delivery"

class AACCodec(AudioCodec):
    def encode(self, source: str) -> str:
        return f"AAC encoding {source} at 128kbps"

class HEVCCodec(VideoCodec):
    def encode(self, source: str) -> str:
        return f"HEVC encoding {source} for app delivery"

class OpusCodec(AudioCodec):
    def encode(self, source: str) -> str:
        return f"Opus encoding {source} at 96kbps"

class CodecFamilyFactory(ABC):
    @abstractmethod
    def create_video_codec(self) -> VideoCodec: ...
    @abstractmethod
    def create_audio_codec(self) -> AudioCodec: ...

class WebCodecFactory(CodecFamilyFactory):
    def create_video_codec(self): return H264Codec()
    def create_audio_codec(self): return AACCodec()

class AppCodecFactory(CodecFamilyFactory):
    def create_video_codec(self): return HEVCCodec()
    def create_audio_codec(self): return OpusCodec()

# ── Usage ──
factory: CodecFamilyFactory = WebCodecFactory()
print(factory.create_video_codec().encode("movie.raw"))
print(factory.create_audio_codec().encode("audio.raw"))`,
        Go: `package main

import "fmt"

type VideoCodec interface{ Encode(source string) string }
type AudioCodec interface{ Encode(source string) string }

type H264Codec struct{}
func (h H264Codec) Encode(s string) string { return fmt.Sprintf("H.264 encoding %s for web", s) }
type AACCodec struct{}
func (a AACCodec) Encode(s string) string { return fmt.Sprintf("AAC encoding %s at 128kbps", s) }

type HEVCCodec struct{}
func (h HEVCCodec) Encode(s string) string { return fmt.Sprintf("HEVC encoding %s for app", s) }
type OpusCodec struct{}
func (o OpusCodec) Encode(s string) string { return fmt.Sprintf("Opus encoding %s at 96kbps", s) }

type CodecFamilyFactory interface {
	CreateVideoCodec() VideoCodec
	CreateAudioCodec() AudioCodec
}

type WebCodecFactory struct{}
func (f WebCodecFactory) CreateVideoCodec() VideoCodec { return H264Codec{} }
func (f WebCodecFactory) CreateAudioCodec() AudioCodec { return AACCodec{} }

type AppCodecFactory struct{}
func (f AppCodecFactory) CreateVideoCodec() VideoCodec { return HEVCCodec{} }
func (f AppCodecFactory) CreateAudioCodec() AudioCodec { return OpusCodec{} }

func main() {
	var factory CodecFamilyFactory = WebCodecFactory{}
	fmt.Println(factory.CreateVideoCodec().Encode("movie.raw"))
	fmt.Println(factory.CreateAudioCodec().Encode("audio.raw"))
}`,
        Java: `interface VideoCodec { String encode(String source); }
interface AudioCodec { String encode(String source); }

class H264Codec implements VideoCodec {
    public String encode(String s) { return "H.264 encoding " + s + " for web"; }
}
class AACCodec implements AudioCodec {
    public String encode(String s) { return "AAC encoding " + s + " at 128kbps"; }
}
class HEVCCodec implements VideoCodec {
    public String encode(String s) { return "HEVC encoding " + s + " for app"; }
}
class OpusCodec implements AudioCodec {
    public String encode(String s) { return "Opus encoding " + s + " at 96kbps"; }
}

interface CodecFamilyFactory {
    VideoCodec createVideoCodec();
    AudioCodec createAudioCodec();
}

class WebCodecFactory implements CodecFamilyFactory {
    public VideoCodec createVideoCodec() { return new H264Codec(); }
    public AudioCodec createAudioCodec() { return new AACCodec(); }
}
class AppCodecFactory implements CodecFamilyFactory {
    public VideoCodec createVideoCodec() { return new HEVCCodec(); }
    public AudioCodec createAudioCodec() { return new OpusCodec(); }
}`,
        TypeScript: `interface VideoCodec { encode(source: string): string; }
interface AudioCodec { encode(source: string): string; }

class H264Codec implements VideoCodec {
  encode(s: string) { return \`H.264 encoding \${s} for web\`; }
}
class AACCodec implements AudioCodec {
  encode(s: string) { return \`AAC encoding \${s} at 128kbps\`; }
}
class HEVCCodec implements VideoCodec {
  encode(s: string) { return \`HEVC encoding \${s} for app\`; }
}
class OpusCodec implements AudioCodec {
  encode(s: string) { return \`Opus encoding \${s} at 96kbps\`; }
}

interface CodecFamilyFactory {
  createVideoCodec(): VideoCodec;
  createAudioCodec(): AudioCodec;
}

class WebCodecFactory implements CodecFamilyFactory {
  createVideoCodec() { return new H264Codec(); }
  createAudioCodec() { return new AACCodec(); }
}

// ── Usage ──
const factory: CodecFamilyFactory = new WebCodecFactory();
console.log(factory.createVideoCodec().encode("movie.raw"));
console.log(factory.createAudioCodec().encode("audio.raw"));`,
        Rust: `trait VideoCodec { fn encode(&self, source: &str) -> String; }
trait AudioCodec { fn encode(&self, source: &str) -> String; }

struct H264Codec;
impl VideoCodec for H264Codec {
    fn encode(&self, s: &str) -> String { format!("H.264 encoding {} for web", s) }
}
struct AACCodec;
impl AudioCodec for AACCodec {
    fn encode(&self, s: &str) -> String { format!("AAC encoding {} at 128kbps", s) }
}
struct HEVCCodec;
impl VideoCodec for HEVCCodec {
    fn encode(&self, s: &str) -> String { format!("HEVC encoding {} for app", s) }
}
struct OpusCodec;
impl AudioCodec for OpusCodec {
    fn encode(&self, s: &str) -> String { format!("Opus encoding {} at 96kbps", s) }
}

trait CodecFamilyFactory {
    fn create_video_codec(&self) -> Box<dyn VideoCodec>;
    fn create_audio_codec(&self) -> Box<dyn AudioCodec>;
}

struct WebCodecFactory;
impl CodecFamilyFactory for WebCodecFactory {
    fn create_video_codec(&self) -> Box<dyn VideoCodec> { Box::new(H264Codec) }
    fn create_audio_codec(&self) -> Box<dyn AudioCodec> { Box::new(AACCodec) }
}

fn main() {
    let factory: Box<dyn CodecFamilyFactory> = Box::new(WebCodecFactory);
    println!("{}", factory.create_video_codec().encode("movie.raw"));
    println!("{}", factory.create_audio_codec().encode("audio.raw"));
}`,
      },
      considerations: [
        "Container formats (MP4, WebM, MKV) must match the codec family — consider including container selection in the factory",
        "Hardware acceleration availability varies per codec — the factory should check GPU capabilities at creation time",
        "DRM requirements differ per delivery target — web needs Widevine, apps may need FairPlay — wrap as a decorator post-factory",
        "Bitrate profiles should be passed as config to the factory, not hardcoded in concrete codecs",
        "Adding a 4K HDR family requires one new factory, not changes to existing web or app factories",
      ],
    },
    {
      id: 5,
      title: "Logistics — Multi-Carrier Shipment Suite",
      domain: "Logistics",
      problem:
        "A logistics platform manages shipments across carriers where each carrier requires a compatible set of objects: a manifest generator, a tracking client, and a customs declaration builder. Using a FedEx manifest with a DHL tracking client would produce invalid data and API errors.",
      solution:
        "A CarrierFactory creates the complete carrier-specific suite. FedExFactory produces FedEx manifests + FedEx tracking + FedEx customs. DHLFactory does the same for DHL — the dispatch service works through abstract interfaces.",
      classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#af-e5); }
  </style>
  <defs><marker id="af-e5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="8" width="280" height="52" class="s-box s-diagram-box"/>
  <text x="260" y="24" text-anchor="middle" class="s-title s-diagram-title">CarrierFactory</text>
  <line x1="120" y1="28" x2="400" y2="28" class="s-diagram-line"/>
  <text x="130" y="42" class="s-member s-diagram-member">+createManifest(): Manifest</text>
  <text x="130" y="54" class="s-member s-diagram-member">+createTracker(): Tracker</text>
  <rect x="10" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="100" y="112" text-anchor="middle" class="s-title s-diagram-title">FedExFactory</text>
  <rect x="330" y="90" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="420" y="112" text-anchor="middle" class="s-title s-diagram-title">DHLFactory</text>
  <line x1="100" y1="90" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="420" y1="90" x2="330" y2="60" class="s-arr s-diagram-arrow"/>
  <rect x="50" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="130" y="174" text-anchor="middle" class="s-title s-diagram-title">Manifest</text>
  <rect x="310" y="156" width="160" height="28" class="s-box s-diagram-box"/>
  <text x="390" y="174" text-anchor="middle" class="s-title s-diagram-title">Tracker</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# Abstract Factory — Carrier Suite

class Manifest(ABC):
    @abstractmethod
    def generate(self, shipment_id: str) -> str: ...

class Tracker(ABC):
    @abstractmethod
    def track(self, tracking_id: str) -> str: ...

class FedExManifest(Manifest):
    def generate(self, sid: str) -> str:
        return f"FedEx manifest for {sid}: air waybill generated"

class FedExTracker(Tracker):
    def track(self, tid: str) -> str:
        return f"FedEx tracking {tid}: in transit, Memphis hub"

class DHLManifest(Manifest):
    def generate(self, sid: str) -> str:
        return f"DHL manifest for {sid}: express waybill generated"

class DHLTracker(Tracker):
    def track(self, tid: str) -> str:
        return f"DHL tracking {tid}: customs clearance, Leipzig"

class CarrierFactory(ABC):
    @abstractmethod
    def create_manifest(self) -> Manifest: ...
    @abstractmethod
    def create_tracker(self) -> Tracker: ...

class FedExFactory(CarrierFactory):
    def create_manifest(self): return FedExManifest()
    def create_tracker(self): return FedExTracker()

class DHLFactory(CarrierFactory):
    def create_manifest(self): return DHLManifest()
    def create_tracker(self): return DHLTracker()

# ── Usage ──
factory: CarrierFactory = FedExFactory()
print(factory.create_manifest().generate("SHP-2024-001"))
print(factory.create_tracker().track("FX-7712839"))`,
        Go: `package main

import "fmt"

type Manifest interface{ Generate(shipmentID string) string }
type Tracker interface{ Track(trackingID string) string }

type FedExManifest struct{}
func (f FedExManifest) Generate(sid string) string {
	return fmt.Sprintf("FedEx manifest for %s: air waybill", sid)
}
type FedExTracker struct{}
func (f FedExTracker) Track(tid string) string {
	return fmt.Sprintf("FedEx tracking %s: in transit", tid)
}

type DHLManifest struct{}
func (d DHLManifest) Generate(sid string) string {
	return fmt.Sprintf("DHL manifest for %s: express waybill", sid)
}
type DHLTracker struct{}
func (d DHLTracker) Track(tid string) string {
	return fmt.Sprintf("DHL tracking %s: customs clearance", tid)
}

type CarrierFactory interface {
	CreateManifest() Manifest
	CreateTracker() Tracker
}

type FedExFactory struct{}
func (f FedExFactory) CreateManifest() Manifest { return FedExManifest{} }
func (f FedExFactory) CreateTracker() Tracker   { return FedExTracker{} }

type DHLFactory struct{}
func (d DHLFactory) CreateManifest() Manifest { return DHLManifest{} }
func (d DHLFactory) CreateTracker() Tracker   { return DHLTracker{} }

func main() {
	var factory CarrierFactory = FedExFactory{}
	fmt.Println(factory.CreateManifest().Generate("SHP-2024-001"))
	fmt.Println(factory.CreateTracker().Track("FX-7712839"))
}`,
        Java: `interface Manifest { String generate(String shipmentId); }
interface Tracker { String track(String trackingId); }

class FedExManifest implements Manifest {
    public String generate(String sid) { return "FedEx manifest for " + sid + ": air waybill"; }
}
class FedExTracker implements Tracker {
    public String track(String tid) { return "FedEx tracking " + tid + ": in transit"; }
}
class DHLManifest implements Manifest {
    public String generate(String sid) { return "DHL manifest for " + sid + ": express waybill"; }
}
class DHLTracker implements Tracker {
    public String track(String tid) { return "DHL tracking " + tid + ": customs clearance"; }
}

interface CarrierFactory {
    Manifest createManifest();
    Tracker createTracker();
}

class FedExFactory implements CarrierFactory {
    public Manifest createManifest() { return new FedExManifest(); }
    public Tracker createTracker() { return new FedExTracker(); }
}
class DHLFactory implements CarrierFactory {
    public Manifest createManifest() { return new DHLManifest(); }
    public Tracker createTracker() { return new DHLTracker(); }
}`,
        TypeScript: `interface Manifest { generate(shipmentId: string): string; }
interface Tracker { track(trackingId: string): string; }

class FedExManifest implements Manifest {
  generate(sid: string) { return \`FedEx manifest for \${sid}: air waybill\`; }
}
class FedExTracker implements Tracker {
  track(tid: string) { return \`FedEx tracking \${tid}: in transit\`; }
}
class DHLManifest implements Manifest {
  generate(sid: string) { return \`DHL manifest for \${sid}: express waybill\`; }
}
class DHLTracker implements Tracker {
  track(tid: string) { return \`DHL tracking \${tid}: customs clearance\`; }
}

interface CarrierFactory {
  createManifest(): Manifest;
  createTracker(): Tracker;
}

class FedExFactory implements CarrierFactory {
  createManifest() { return new FedExManifest(); }
  createTracker() { return new FedExTracker(); }
}

// ── Usage ──
const factory: CarrierFactory = new FedExFactory();
console.log(factory.createManifest().generate("SHP-2024-001"));
console.log(factory.createTracker().track("FX-7712839"));`,
        Rust: `trait Manifest { fn generate(&self, shipment_id: &str) -> String; }
trait Tracker { fn track(&self, tracking_id: &str) -> String; }

struct FedExManifest;
impl Manifest for FedExManifest {
    fn generate(&self, sid: &str) -> String { format!("FedEx manifest for {}: air waybill", sid) }
}
struct FedExTracker;
impl Tracker for FedExTracker {
    fn track(&self, tid: &str) -> String { format!("FedEx tracking {}: in transit", tid) }
}
struct DHLManifest;
impl Manifest for DHLManifest {
    fn generate(&self, sid: &str) -> String { format!("DHL manifest for {}: express waybill", sid) }
}
struct DHLTracker;
impl Tracker for DHLTracker {
    fn track(&self, tid: &str) -> String { format!("DHL tracking {}: customs clearance", tid) }
}

trait CarrierFactory {
    fn create_manifest(&self) -> Box<dyn Manifest>;
    fn create_tracker(&self) -> Box<dyn Tracker>;
}

struct FedExFactory;
impl CarrierFactory for FedExFactory {
    fn create_manifest(&self) -> Box<dyn Manifest> { Box::new(FedExManifest) }
    fn create_tracker(&self) -> Box<dyn Tracker> { Box::new(FedExTracker) }
}

fn main() {
    let factory: Box<dyn CarrierFactory> = Box::new(FedExFactory);
    println!("{}", factory.create_manifest().generate("SHP-2024-001"));
    println!("{}", factory.create_tracker().track("FX-7712839"));
}`,
      },
      considerations: [
        "Carrier API rate limits differ — the factory should inject carrier-specific rate limiters into the products",
        "International shipments need customs declarations — consider adding createCustomsBuilder() to the factory interface",
        "Multi-leg shipments may cross carriers — handle at the orchestration layer, not inside a single factory",
        "Tracking webhook URLs differ per carrier — the tracker product should register its own webhook endpoint",
        "Label formats (PDF, ZPL, thermal) vary per carrier — the manifest product should handle format conversion internally",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "For most projects, start with the Classic Interface-Based approach — it directly models families of products and is easy to understand. Use the Registry-Based approach when you need to add families at runtime (plugins). Use the Functional approach in FP-heavy codebases. The Parameterized approach works for simple cases with few families.",

  variants: [
    {
      id: 1,
      name: "Classic Interface-Based",
      description:
        "The textbook GoF approach: an abstract factory interface declares creation methods for each product type. Each concrete factory implements the interface to produce one family of products. This is the most common and most readable approach.",
      code: {
        Python: `from abc import ABC, abstractmethod

class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: ...

class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...
    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...

class DarkButton(Button):
    def render(self) -> str: return "Dark theme button"
class DarkCheckbox(Checkbox):
    def render(self) -> str: return "Dark theme checkbox"

class DarkFactory(GUIFactory):
    def create_button(self) -> Button: return DarkButton()
    def create_checkbox(self) -> Checkbox: return DarkCheckbox()

# ── Usage ──
factory: GUIFactory = DarkFactory()
print(factory.create_button().render())`,
        Go: `package main

import "fmt"

type Button interface{ Render() string }
type Checkbox interface{ Render() string }

type GUIFactory interface {
	CreateButton() Button
	CreateCheckbox() Checkbox
}

type DarkButton struct{}
func (d DarkButton) Render() string { return "Dark theme button" }
type DarkCheckbox struct{}
func (d DarkCheckbox) Render() string { return "Dark theme checkbox" }

type DarkFactory struct{}
func (d DarkFactory) CreateButton() Button { return DarkButton{} }
func (d DarkFactory) CreateCheckbox() Checkbox { return DarkCheckbox{} }

func main() {
	var factory GUIFactory = DarkFactory{}
	fmt.Println(factory.CreateButton().Render())
}`,
        Java: `interface Button { String render(); }
interface Checkbox { String render(); }

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class DarkButton implements Button {
    public String render() { return "Dark theme button"; }
}
class DarkCheckbox implements Checkbox {
    public String render() { return "Dark theme checkbox"; }
}

class DarkFactory implements GUIFactory {
    public Button createButton() { return new DarkButton(); }
    public Checkbox createCheckbox() { return new DarkCheckbox(); }
}`,
        TypeScript: `interface Button { render(): string; }
interface Checkbox { render(): string; }

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class DarkButton implements Button {
  render() { return "Dark theme button"; }
}
class DarkCheckbox implements Checkbox {
  render() { return "Dark theme checkbox"; }
}

class DarkFactory implements GUIFactory {
  createButton() { return new DarkButton(); }
  createCheckbox() { return new DarkCheckbox(); }
}

// ── Usage ──
const factory: GUIFactory = new DarkFactory();
console.log(factory.createButton().render());`,
        Rust: `trait Button { fn render(&self) -> String; }
trait Checkbox { fn render(&self) -> String; }

trait GUIFactory {
    fn create_button(&self) -> Box<dyn Button>;
    fn create_checkbox(&self) -> Box<dyn Checkbox>;
}

struct DarkButton;
impl Button for DarkButton {
    fn render(&self) -> String { "Dark theme button".into() }
}
struct DarkCheckbox;
impl Checkbox for DarkCheckbox {
    fn render(&self) -> String { "Dark theme checkbox".into() }
}

struct DarkFactory;
impl GUIFactory for DarkFactory {
    fn create_button(&self) -> Box<dyn Button> { Box::new(DarkButton) }
    fn create_checkbox(&self) -> Box<dyn Checkbox> { Box::new(DarkCheckbox) }
}

fn main() {
    let factory: Box<dyn GUIFactory> = Box::new(DarkFactory);
    println!("{}", factory.create_button().render());
}`,
      },
      pros: [
        "Clear contract — the interface defines exactly which products a family must provide",
        "Adding a new family is one class implementing the full interface",
        "Compile-time safety — the compiler ensures all products are implemented",
      ],
      cons: [
        "Adding a new product type requires changing the interface and ALL factories",
        "Class count grows as families × product types",
        "Can feel heavyweight for simple cases with only 2 product types",
      ],
    },
    {
      id: 2,
      name: "Parameterized Factory",
      description:
        "A single factory class takes a family-selector parameter and internally routes to the correct product set. Simpler than the interface approach but couples family selection logic into one class.",
      code: {
        Python: `from enum import Enum

class Theme(Enum):
    DARK = "dark"
    LIGHT = "light"

def create_button(theme: Theme) -> str:
    return {"dark": "Dark button", "light": "Light button"}[theme.value]

def create_checkbox(theme: Theme) -> str:
    return {"dark": "Dark checkbox", "light": "Light checkbox"}[theme.value]

# ── Usage ──
theme = Theme.DARK
print(create_button(theme))
print(create_checkbox(theme))`,
        Go: `package main

import "fmt"

func CreateButton(theme string) string {
	if theme == "dark" { return "Dark button" }
	return "Light button"
}

func CreateCheckbox(theme string) string {
	if theme == "dark" { return "Dark checkbox" }
	return "Light checkbox"
}

func main() {
	theme := "dark"
	fmt.Println(CreateButton(theme))
	fmt.Println(CreateCheckbox(theme))
}`,
        Java: `enum Theme { DARK, LIGHT }

class ParameterizedUIFactory {
    static String createButton(Theme t) {
        return switch (t) {
            case DARK -> "Dark button";
            case LIGHT -> "Light button";
        };
    }
    static String createCheckbox(Theme t) {
        return switch (t) {
            case DARK -> "Dark checkbox";
            case LIGHT -> "Light checkbox";
        };
    }
}`,
        TypeScript: `type Theme = "dark" | "light";

function createButton(theme: Theme): string {
  return theme === "dark" ? "Dark button" : "Light button";
}

function createCheckbox(theme: Theme): string {
  return theme === "dark" ? "Dark checkbox" : "Light checkbox";
}

// ── Usage ──
const theme: Theme = "dark";
console.log(createButton(theme));
console.log(createCheckbox(theme));`,
        Rust: `enum Theme { Dark, Light }

fn create_button(theme: &Theme) -> &str {
    match theme {
        Theme::Dark => "Dark button",
        Theme::Light => "Light button",
    }
}

fn create_checkbox(theme: &Theme) -> &str {
    match theme {
        Theme::Dark => "Dark checkbox",
        Theme::Light => "Light checkbox",
    }
}

fn main() {
    let theme = Theme::Dark;
    println!("{}", create_button(&theme));
    println!("{}", create_checkbox(&theme));
}`,
      },
      pros: [
        "Very simple — no interface hierarchies needed",
        "Easy to understand and quick to implement",
        "Works well when product creation is trivial (just value selection)",
      ],
      cons: [
        "Violates OCP — adding a new family requires changing every create function",
        "No compile-time guarantee that families are complete and consistent",
        "Products are typically simple values, not rich objects — limited for complex scenarios",
      ],
    },
    {
      id: 3,
      name: "Registry-Based Factory",
      description:
        "Families are registered at runtime into a central registry. The factory looks up the requested family by key and delegates to the registered creator functions. New families can be added without modifying existing code — ideal for plugin architectures.",
      code: {
        Python: `from typing import Dict, Callable, Tuple

# Registry maps family name → tuple of creator functions
WidgetCreators = Tuple[Callable[[], str], Callable[[], str]]
_registry: Dict[str, WidgetCreators] = {}

def register_family(name: str, btn_fn: Callable, chk_fn: Callable):
    _registry[name] = (btn_fn, chk_fn)

def create_widgets(family: str) -> Tuple[str, str]:
    btn_fn, chk_fn = _registry[family]
    return btn_fn(), chk_fn()

register_family("dark", lambda: "Dark Btn", lambda: "Dark Chk")
register_family("light", lambda: "Light Btn", lambda: "Light Chk")

# ── Usage ──
btn, chk = create_widgets("dark")
print(btn, chk)`,
        Go: `package main

import "fmt"

type WidgetCreators struct {
	ButtonFn   func() string
	CheckboxFn func() string
}

var registry = map[string]WidgetCreators{}

func Register(name string, creators WidgetCreators) {
	registry[name] = creators
}

func CreateWidgets(family string) (string, string) {
	c := registry[family]
	return c.ButtonFn(), c.CheckboxFn()
}

func main() {
	Register("dark", WidgetCreators{
		ButtonFn: func() string { return "Dark Btn" },
		CheckboxFn: func() string { return "Dark Chk" },
	})
	btn, chk := CreateWidgets("dark")
	fmt.Println(btn, chk)
}`,
        Java: `import java.util.*;
import java.util.function.Supplier;

class WidgetRegistry {
    record Creators(Supplier<String> button, Supplier<String> checkbox) {}

    private static final Map<String, Creators> reg = new HashMap<>();

    static void register(String family, Creators c) { reg.put(family, c); }

    static String createButton(String family) { return reg.get(family).button().get(); }
    static String createCheckbox(String family) { return reg.get(family).checkbox().get(); }

    public static void main(String[] args) {
        register("dark", new Creators(() -> "Dark Btn", () -> "Dark Chk"));
        System.out.println(createButton("dark"));
    }
}`,
        TypeScript: `type WidgetCreators = {
  button: () => string;
  checkbox: () => string;
};

const registry = new Map<string, WidgetCreators>();

function registerFamily(name: string, creators: WidgetCreators) {
  registry.set(name, creators);
}

function createWidgets(family: string) {
  const c = registry.get(family)!;
  return { button: c.button(), checkbox: c.checkbox() };
}

registerFamily("dark", {
  button: () => "Dark Btn",
  checkbox: () => "Dark Chk",
});

// ── Usage ──
const { button, checkbox } = createWidgets("dark");
console.log(button, checkbox);`,
        Rust: `use std::collections::HashMap;

type CreatorFn = fn() -> String;

struct WidgetCreators {
    button: CreatorFn,
    checkbox: CreatorFn,
}

fn main() {
    let mut registry: HashMap<&str, WidgetCreators> = HashMap::new();
    registry.insert("dark", WidgetCreators {
        button: || "Dark Btn".into(),
        checkbox: || "Dark Chk".into(),
    });

    let creators = &registry["dark"];
    println!("{} {}", (creators.button)(), (creators.checkbox)());
}`,
      },
      pros: [
        "Fully OCP-compliant — new families are registered without touching existing code",
        "Ideal for plugin/extension architectures where families are discovered at runtime",
        "Decouples family definition from factory lookup logic",
      ],
      cons: [
        "No compile-time guarantee that all product types are registered — runtime errors if a creator is missing",
        "Slightly more complex than the classic interface approach",
        "Debugging is harder when factories are registered dynamically across multiple modules",
      ],
    },
    {
      id: 4,
      name: "Functional Composition",
      description:
        "Instead of factory classes, families are represented as tuples/records of creator functions. The factory is just a function that returns a bundle of creation functions. Lightweight and idiomatic in FP-friendly languages.",
      code: {
        Python: `from dataclasses import dataclass
from typing import Callable

@dataclass
class UIKit:
    create_button: Callable[[], str]
    create_checkbox: Callable[[], str]

dark_kit = UIKit(
    create_button=lambda: "Dark themed button",
    create_checkbox=lambda: "Dark themed checkbox",
)

light_kit = UIKit(
    create_button=lambda: "Light themed button",
    create_checkbox=lambda: "Light themed checkbox",
)

def render_ui(kit: UIKit):
    print(kit.create_button())
    print(kit.create_checkbox())

# ── Usage ──
render_ui(dark_kit)`,
        Go: `package main

import "fmt"

type UIKit struct {
	CreateButton   func() string
	CreateCheckbox func() string
}

func DarkKit() UIKit {
	return UIKit{
		CreateButton:   func() string { return "Dark button" },
		CreateCheckbox: func() string { return "Dark checkbox" },
	}
}

func LightKit() UIKit {
	return UIKit{
		CreateButton:   func() string { return "Light button" },
		CreateCheckbox: func() string { return "Light checkbox" },
	}
}

func main() {
	kit := DarkKit()
	fmt.Println(kit.CreateButton())
	fmt.Println(kit.CreateCheckbox())
}`,
        Java: `import java.util.function.Supplier;

record UIKit(Supplier<String> createButton, Supplier<String> createCheckbox) {}

class FunctionalFactory {
    static UIKit darkKit() {
        return new UIKit(() -> "Dark button", () -> "Dark checkbox");
    }

    static UIKit lightKit() {
        return new UIKit(() -> "Light button", () -> "Light checkbox");
    }

    public static void main(String[] args) {
        var kit = darkKit();
        System.out.println(kit.createButton().get());
    }
}`,
        TypeScript: `interface UIKit {
  createButton: () => string;
  createCheckbox: () => string;
}

const darkKit: UIKit = {
  createButton: () => "Dark button",
  createCheckbox: () => "Dark checkbox",
};

const lightKit: UIKit = {
  createButton: () => "Light button",
  createCheckbox: () => "Light checkbox",
};

// ── Usage ──
function renderUI(kit: UIKit) {
  console.log(kit.createButton());
  console.log(kit.createCheckbox());
}
renderUI(darkKit);`,
        Rust: `struct UIKit {
    create_button: fn() -> String,
    create_checkbox: fn() -> String,
}

fn dark_kit() -> UIKit {
    UIKit {
        create_button: || "Dark button".into(),
        create_checkbox: || "Dark checkbox".into(),
    }
}

fn light_kit() -> UIKit {
    UIKit {
        create_button: || "Light button".into(),
        create_checkbox: || "Light checkbox".into(),
    }
}

fn main() {
    let kit = dark_kit();
    println!("{}", (kit.create_button)());
    println!("{}", (kit.create_checkbox)());
}`,
      },
      pros: [
        "Minimal boilerplate — no classes or interfaces needed",
        "Easy to compose and test — functions are the simplest unit",
        "Natural fit for FP-heavy codebases (JS/TS, Rust closures, Go functions)",
      ],
      cons: [
        "No inheritance — can't share logic between families via base class methods",
        "Harder to enforce completeness — easy to forget a creator function in the bundle",
        "IDE support weaker — less discoverable than class hierarchies in autocomplete",
      ],
    },
    {
      id: 5,
      name: "Abstract Factory + DI Container",
      description:
        "The concrete factory to use is resolved via a dependency injection container. The DI configuration (module, provider) maps the abstract factory interface to a concrete implementation based on environment, profile, or feature flag.",
      code: {
        Python: `from abc import ABC, abstractmethod

class AbstractDBFactory(ABC):
    @abstractmethod
    def create_connection(self) -> str: ...
    @abstractmethod
    def create_query_builder(self) -> str: ...

class PostgresFactory(AbstractDBFactory):
    def create_connection(self) -> str: return "PG connection pool"
    def create_query_builder(self) -> str: return "PG query builder"

class SQLiteFactory(AbstractDBFactory):
    def create_connection(self) -> str: return "SQLite file connection"
    def create_query_builder(self) -> str: return "SQLite query builder"

# Simulated DI container
class Container:
    _bindings: dict = {}

    @classmethod
    def bind(cls, interface, impl_cls):
        cls._bindings[interface] = impl_cls

    @classmethod
    def resolve(cls, interface):
        return cls._bindings[interface]()

# Configuration phase
Container.bind(AbstractDBFactory, PostgresFactory)

# ── Usage ──
factory = Container.resolve(AbstractDBFactory)
print(factory.create_connection())`,
        Go: `package main

import "fmt"

type DBFactory interface {
	CreateConnection() string
	CreateQueryBuilder() string
}

type PostgresFactory struct{}
func (p PostgresFactory) CreateConnection() string   { return "PG connection pool" }
func (p PostgresFactory) CreateQueryBuilder() string  { return "PG query builder" }

// DI: resolved at startup via config
func NewDBFactory(driver string) DBFactory {
	switch driver {
	case "postgres":
		return PostgresFactory{}
	default:
		panic("unsupported driver")
	}
}

func main() {
	factory := NewDBFactory("postgres")
	fmt.Println(factory.CreateConnection())
}`,
        Java: `// With Spring-style DI
interface DBFactory {
    String createConnection();
    String createQueryBuilder();
}

class PostgresFactory implements DBFactory {
    public String createConnection() { return "PG connection pool"; }
    public String createQueryBuilder() { return "PG query builder"; }
}

// @Configuration
// @Bean DBFactory dbFactory() { return new PostgresFactory(); }
// Client just @Autowired DBFactory factory;`,
        TypeScript: `interface DBFactory {
  createConnection(): string;
  createQueryBuilder(): string;
}

class PostgresFactory implements DBFactory {
  createConnection() { return "PG connection pool"; }
  createQueryBuilder() { return "PG query builder"; }
}

// Simulated DI container
const container = new Map<string, () => unknown>();
container.set("DBFactory", () => new PostgresFactory());

// ── Usage ──
const factory = container.get("DBFactory")!() as DBFactory;
console.log(factory.createConnection());`,
        Rust: `trait DBFactory {
    fn create_connection(&self) -> String;
    fn create_query_builder(&self) -> String;
}

struct PostgresFactory;
impl DBFactory for PostgresFactory {
    fn create_connection(&self) -> String { "PG connection pool".into() }
    fn create_query_builder(&self) -> String { "PG query builder".into() }
}

// DI: resolved at startup
fn resolve_factory(driver: &str) -> Box<dyn DBFactory> {
    match driver {
        "postgres" => Box::new(PostgresFactory),
        _ => panic!("unsupported driver"),
    }
}

fn main() {
    let factory = resolve_factory("postgres");
    println!("{}", factory.create_connection());
}`,
      },
      pros: [
        "Factory selection is configured externally — app code never knows the concrete factory",
        "Easy to swap families per environment (test/staging/production) via config",
        "DI container handles lifecycle (singleton factory, scoped factory, etc.)",
      ],
      cons: [
        "Requires a DI framework/container — not suitable for minimal projects",
        "Configuration can become complex with many families and environments",
        "Harder to trace which factory is active at runtime — adds indirection",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "OCP-Compliant", "Complexity", "Family Consistency", "Best For",
  ],
  comparisonRows: [
    ["Classic Interface-Based", "✓ (new family = new class)", "Medium", "✓ (compile-time)", "Standard applications, clear contracts"],
    ["Parameterized", "✗ (modify switch per family)", "Low", "Manual (same param)", "Simple apps, few families"],
    ["Registry-Based", "✓ (register at runtime)", "Medium", "Runtime check", "Plugin architectures, extensions"],
    ["Functional Composition", "✓ (new function bundle)", "Low", "Structural (record shape)", "FP-heavy codebases"],
    ["DI Container Integration", "✓ (config-driven)", "Medium-High", "✓ (container enforces)", "Enterprise apps with DI frameworks"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Creational" },
    {
      aspect: "Key Benefit",
      detail:
        "Guarantees families of related objects are used together — swapping an entire family requires changing only the factory instance",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Adding a new product type (e.g., createProductC) requires modifying the factory interface and ALL concrete factories",
    },
    {
      aspect: "vs. Factory Method",
      detail:
        "Factory Method creates one product; Abstract Factory creates a family of related products that must be compatible",
    },
    {
      aspect: "Thread Safety",
      detail:
        "The factory itself is typically stateless and thread-safe. Products it creates may need their own thread-safety guarantees.",
    },
    {
      aspect: "When to Use",
      detail:
        "When a system must work with multiple families of related products and you need to ensure family consistency",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When products are independent (no family constraint), when there's only one family, or when factory overhead isn't justified",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Factory Method (each create method is a factory method), Singleton (one factory per family), Prototype (alternative when products should be cloned), Builder (can be used alongside for complex product construction)",
    },
  ],

  antiPatterns: [
    {
      name: "Incomplete Factory",
      description:
        "A concrete factory that implements only some creation methods and returns null or throws for others. This silently breaks the family consistency guarantee.",
      betterAlternative:
        "Every concrete factory must implement ALL creation methods. If a product doesn't apply to a family, use a Null Object that implements the interface with no-op behavior.",
    },
    {
      name: "Cross-Family Mixing",
      description:
        "Using products from different factories in the same context — e.g., creating a macOS button from one factory and a Windows checkbox from another.",
      betterAlternative:
        "Select one factory at startup and use it for all products in a given scope. Pass the factory via dependency injection to enforce single-family usage.",
    },
    {
      name: "God Factory",
      description:
        "One factory that produces dozens of unrelated product types — buttons, database connections, serializers, loggers — all in one interface.",
      betterAlternative:
        "Split into focused factories: UIFactory for widgets, DBFactory for database objects, etc. Each factory should produce one cohesive family.",
    },
    {
      name: "Concrete Factory Leakage",
      description:
        "Client code imports and directly instantiates concrete factories instead of receiving them through DI or configuration.",
      betterAlternative:
        "Client code should depend only on the AbstractFactory interface. Inject the concrete factory via DI, configuration, or a factory-of-factories.",
    },
    {
      name: "Product Type Explosion",
      description:
        "Continuously adding new product types to the factory interface (createProductD, createProductE, ...) forcing changes to all concrete factories.",
      betterAlternative:
        "If product types change frequently, consider a different pattern (Prototype for cloning, Builder for step-by-step construction). Abstract Factory works best with a stable set of product types.",
    },
    {
      name: "Singleton Factory Abuse",
      description:
        "Making every factory a Singleton even when different scopes need different families — e.g., one module needs the dark theme and another needs the light theme.",
      betterAlternative:
        "Use Singleton only when the entire application uses one family. For scoped families, inject the factory per scope via DI.",
    },
  ],
};

export default abstractFactoryData;
