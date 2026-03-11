import { PatternData } from "@/lib/patterns/types";

const singleResponsibilityData: PatternData = {
  slug: "single-responsibility",
  categorySlug: "solid",
  categoryLabel: "SOLID",
  title: "Single Responsibility Principle (SRP)",
  subtitle:
    "A class should have only one reason to change — meaning it should encapsulate exactly one responsibility.",

  intent:
    "When a class handles multiple concerns — business logic and persistence, validation and notification, data processing and formatting — changes in one concern risk breaking the other. A change to audit requirements shouldn't risk breaking transfer logic. A change to email templates shouldn't touch payment processing.\n\nThe Single Responsibility Principle states that a class should be responsible to one, and only one, actor (stakeholder). It changes only when the requirements of that stakeholder change. This leads to smaller, focused classes that are easier to understand, test, and maintain.\n\nSRP applies at every level: methods, classes, modules, and even microservices. The goal is high cohesion within a unit and low coupling between units.",

  classDiagramSvg: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .sr-box { rx:6; }
    .sr-title { font: bold 11px 'JetBrains Mono', monospace; }
    .sr-member { font: 10px 'JetBrains Mono', monospace; }
    .sr-arr { stroke-width:1.2; fill:none; marker-end:url(#sr-arr); }
    .sr-note { font: italic 9px 'JetBrains Mono', monospace; }
  </style>
  <defs>
    <marker id="sr-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Invoice -->
  <rect x="180" y="10" width="160" height="55" class="sr-box s-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="sr-title s-diagram-title">Invoice</text>
  <line x1="180" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="188" y="48" class="sr-member s-diagram-member">-items: List</text>
  <text x="188" y="60" class="sr-member s-diagram-member">+calculateTotal(): Money</text>
  <!-- InvoicePrinter -->
  <rect x="10" y="120" width="160" height="45" class="sr-box s-diagram-box"/>
  <text x="90" y="138" text-anchor="middle" class="sr-title s-diagram-title">InvoicePrinter</text>
  <line x1="10" y1="142" x2="170" y2="142" class="s-diagram-line"/>
  <text x="18" y="158" class="sr-member s-diagram-member">+print(invoice): void</text>
  <!-- InvoiceRepository -->
  <rect x="190" y="120" width="170" height="45" class="sr-box s-diagram-box"/>
  <text x="275" y="138" text-anchor="middle" class="sr-title s-diagram-title">InvoiceRepository</text>
  <line x1="190" y1="142" x2="360" y2="142" class="s-diagram-line"/>
  <text x="198" y="158" class="sr-member s-diagram-member">+save(invoice): void</text>
  <!-- InvoiceNotifier -->
  <rect x="380" y="120" width="130" height="45" class="sr-box s-diagram-box"/>
  <text x="445" y="138" text-anchor="middle" class="sr-title s-diagram-title">InvoiceNotifier</text>
  <line x1="380" y1="142" x2="510" y2="142" class="s-diagram-line"/>
  <text x="388" y="158" class="sr-member s-diagram-member">+notify(invoice): void</text>
  <!-- Arrows -->
  <line x1="90" y1="120" x2="210" y2="65" class="sr-arr s-diagram-arrow"/>
  <line x1="275" y1="120" x2="260" y2="65" class="sr-arr s-diagram-arrow"/>
  <line x1="445" y1="120" x2="310" y2="65" class="sr-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "Each class has exactly one responsibility. Invoice handles calculation logic. InvoicePrinter handles formatting and output. InvoiceRepository handles persistence. InvoiceNotifier handles delivery. They all depend on Invoice (using it), but Invoice doesn't depend on any of them. Each changes independently for its own reason.",

  diagramComponents: [
    {
      name: "Invoice",
      description:
        "Holds invoice data and calculates the total. Its only reason to change is if the calculation rules change. It does not format, persist, or send itself.",
    },
    {
      name: "InvoicePrinter",
      description:
        "Formats and prints an invoice. Changes only when the output format requirements change (PDF layout, locale, etc.).",
    },
    {
      name: "InvoiceRepository",
      description:
        "Persists invoice data to a database. Changes only when storage requirements change (new database, schema migration).",
    },
    {
      name: "InvoiceNotifier",
      description:
        "Sends notifications about the invoice. Changes only when notification channels change (email, SMS, Slack).",
    },
  ],

  solutionDetail:
    "**The Problem:** A single class handles multiple concerns — calculation, formatting, persistence, and notification. When audit requirements change, the same class that handles business logic must be modified, risking regressions.\n\n**The SRP Solution:** Split each concern into its own class.\n\n**How It Works:**\n\n1. **Identify responsibilities**: List every reason the class might change. Each reason corresponds to a different stakeholder or concern.\n\n2. **Extract classes**: Create a separate class for each responsibility — TransactionValidator, TransactionExecutor, AuditLogger, NotificationService.\n\n3. **Compose with an orchestrator**: A thin orchestrator class wires the single-responsibility classes together. The orchestrator delegates; it doesn't contain business logic.\n\n4. **Depend on abstractions**: Each single-responsibility class can implement an interface, making it injectable and testable.\n\n**Key Insight:** SRP doesn't mean a class does only one \"thing\" — it means a class has only one *reason to change*. A class can have multiple methods as long as they all change for the same reason (same stakeholder).",

  characteristics: [
    "One reason to change — if a class changes for multiple unrelated reasons, it violates SRP",
    "High cohesion within a class, low coupling between classes",
    "Easier testing — focused classes need fewer test cases and simpler test setups",
    "More classes but each is simpler and easier to understand",
    "Applies at every level — methods, classes, modules, microservices",
    "Judgment required — over-splitting leads to excessive indirection; balance is key",
    "The 'reason to change' often maps to a stakeholder or business policy area",
  ],

  useCases: [
    {
      id: 1,
      title: "Transaction Processing",
      domain: "Fintech",
      description:
        "A payment system separates validation, execution, audit logging, and notification into individual classes instead of one monolithic TransactionService.",
      whySingleton:
        "Each responsibility has a different reason to change: validation rules change with regulations, execution logic changes with banking APIs, audit changes with compliance requirements, notifications change with communication channels.",
      code: `class TransactionValidator { validate(from, to, amount) { ... } }
class TransactionExecutor { execute(from, to, amount) { ... } }
class AuditLogger { log(event: string) { ... } }
class NotificationService { notify(email, msg) { ... } }
class TransferOrchestrator { // composes all four }`,
    },
    {
      id: 2,
      title: "Patient Record Management",
      domain: "Healthcare",
      description:
        "A hospital system splits patient data CRUD, appointment scheduling, insurance verification, and medical history formatting into separate services.",
      whySingleton:
        "Insurance API changes shouldn't affect appointment scheduling. Patient data schema changes shouldn't break the formatting module. Each concern evolves independently with different stakeholders.",
      code: `class PatientRepository { save(p), find(id) }
class AppointmentScheduler { schedule(patient, doctor, time) }
class InsuranceVerifier { verify(patient): boolean }
class MedicalHistoryFormatter { format(patient, records): string }`,
    },
    {
      id: 3,
      title: "Order Processing Pipeline",
      domain: "E-commerce",
      description:
        "An e-commerce platform separates order validation, inventory management, payment processing, and shipping into independent services.",
      whySingleton:
        "Shipping providers change frequently. Payment gateways have their own release cycles. Inventory logic is affected by warehouse changes. Keeping them separate prevents cascading modifications.",
      code: `class OrderValidator { validate(order) }
class InventoryService { reserve(items), release(items) }
class PaymentGateway { charge(amount, method) }
class ShippingService { ship(order, address) }`,
    },
    {
      id: 4,
      title: "Log Management",
      domain: "Infrastructure / DevOps",
      description:
        "Instead of a single Logger class that formats, timestamps, filters, and writes logs, each concern is a separate component connected in a pipeline.",
      whySingleton:
        "Log format changes when adopting structured logging. Destinations change when migrating from file to cloud. Filtering changes with security policies. Each concern has its own lifecycle.",
      code: `class LogFormatter { format(level, message): string }
class LogFilter { shouldLog(level): boolean }
class LogWriter { write(formatted: string) }
class Logger { // composes the above }`,
    },
    {
      id: 5,
      title: "Report Generation",
      domain: "Business Intelligence",
      description:
        "A reporting module separates data fetching, aggregation, formatting, and delivery. DataSource fetches, Aggregator computes, Formatter renders, Deliverer sends.",
      whySingleton:
        "Data sources change with database migrations. Aggregation logic changes with new KPIs. Output format changes for new stakeholders. Email delivery changes with infrastructure. Each is independent.",
      code: `class DataSource { fetch(query): RawData }
class Aggregator { aggregate(data): Summary }
class ReportFormatter { format(summary): string }
class ReportDeliverer { deliver(report, recipients) }`,
    },
    {
      id: 6,
      title: "User Registration",
      domain: "SaaS Platform",
      description:
        "User registration splits into input validation, account creation, welcome email, and analytics tracking — each as its own module.",
      whySingleton:
        "Validation rules change with security policy. Account creation changes with database schema. Welcome emails change with marketing. Analytics changes with product decisions. Zero overlap.",
      code: `class InputValidator { validate(email, password) }
class AccountCreator { create(userData): Account }
class WelcomeEmailer { sendWelcome(account) }
class AnalyticsTracker { trackSignup(account) }`,
    },
    {
      id: 7,
      title: "API Request Handling",
      domain: "Backend / Microservices",
      description:
        "An API handler separates request parsing, authentication, authorization, business logic, and response formatting into middleware and services.",
      whySingleton:
        "Auth changes independently from business logic. Response format changes for new API versions. Parsing changes with new content types. Each middleware handles one concern.",
      code: `class RequestParser { parse(raw): Request }
class AuthMiddleware { authenticate(req): User }
class AuthzMiddleware { authorize(user, resource): boolean }
class BusinessHandler { handle(req): Result }
class ResponseFormatter { format(result): Response }`,
    },
    {
      id: 8,
      title: "Data Pipeline ETL",
      domain: "Data Engineering",
      description:
        "An ETL pipeline separates extraction, transformation, validation, and loading into individual components that can be tested and replaced independently.",
      whySingleton:
        "Extraction changes when data sources change. Transformation rules change with business requirements. Validation changes with data quality standards. Loading changes with destination systems.",
      code: `class Extractor { extract(source): RawData }
class Transformer { transform(raw): CleanData }
class Validator { validate(data): ValidData }
class Loader { load(data, destination) }`,
    },
    {
      id: 9,
      title: "Notification System",
      domain: "Communication Platform",
      description:
        "A notification system separates message composition, recipient resolution, channel selection, delivery, and delivery tracking into individual services.",
      whySingleton:
        "Message templates change with marketing. Recipient rules change with business logic. Channel preferences change per user. Delivery mechanisms change with providers. Tracking changes with analytics.",
      code: `class MessageComposer { compose(template, data): Message }
class RecipientResolver { resolve(criteria): Recipient[] }
class ChannelSelector { select(recipient): Channel }
class DeliveryService { deliver(message, channel, recipient) }
class DeliveryTracker { track(deliveryId) }`,
    },
    {
      id: 10,
      title: "File Upload Processing",
      domain: "Content / Media Platform",
      description:
        "File upload handling separates validation (size, type, virus scan), storage (S3, GCS), metadata extraction, and thumbnail generation into independent classes.",
      whySingleton:
        "File size limits change with billing tiers. Storage backend changes with infrastructure decisions. Metadata requirements change with content features. Thumbnail specs change with UI needs.",
      code: `class FileValidator { validate(file): boolean }
class FileStorage { store(file): URL }
class MetadataExtractor { extract(file): Metadata }
class ThumbnailGenerator { generate(file): Thumbnail }`,
    },
    {
      id: 11,
      title: "Compliance Monitoring",
      domain: "Regulatory / Legal",
      description:
        "A compliance system separates rule evaluation, risk scoring, alert generation, and report filing into independent components.",
      whySingleton:
        "Compliance rules change with regulations. Risk models change with the risk team. Alert routing changes with operations. Filing formats change with regulatory bodies. Each has its own cadence.",
      code: `class RuleEvaluator { evaluate(transaction): Violations[] }
class RiskScorer { score(violations): RiskLevel }
class AlertGenerator { generateAlert(risk, details) }
class ComplianceFiler { fileReport(violations) }`,
    },
    {
      id: 12,
      title: "CI/CD Pipeline Steps",
      domain: "DevOps",
      description:
        "Each CI/CD pipeline step — compile, lint, test, build artifact, deploy, notify — is its own class. The pipeline orchestrator composes them without mixing concerns.",
      whySingleton:
        "Build tool changes with tech stack. Test runner changes with test framework. Deployment changes with infrastructure. Notification changes with team tools. Each step is independently versioned.",
      code: `class Compiler { compile(src): Artifacts }
class Linter { lint(src): LintResult }
class TestRunner { runTests(src): TestResult }
class Deployer { deploy(artifacts, env) }
class PipelineNotifier { notify(result, channel) }`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Transaction Processing (Before/After)",
      domain: "Fintech",
      problem:
        "A single TransactionService class validates input, executes the transfer, logs the audit trail, sends notifications, and generates reports. Changing audit requirements means modifying the same class that handles transfer logic, risking regressions in critical financial operations.",
      solution:
        "Split into TransactionValidator, TransactionExecutor, AuditLogger, NotificationService, and a TransferOrchestrator that composes them. Each class has one reason to change. The orchestrator delegates; it contains no business logic.",
      classDiagramSvg: `<svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .sr-box { rx:6; }
    .sr-title { font: bold 10px 'JetBrains Mono', monospace; }
    .sr-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="160" y="5" width="180" height="50" class="sr-box s-diagram-box"/>
  <text x="250" y="22" text-anchor="middle" class="sr-title s-diagram-title">TransferOrchestrator</text>
  <line x1="160" y1="26" x2="340" y2="26" class="s-diagram-line"/>
  <text x="168" y="42" class="sr-member s-diagram-member">+transfer(from, to, amount)</text>
  <rect x="10" y="100" width="110" height="40" class="sr-box s-diagram-box"/>
  <text x="65" y="118" text-anchor="middle" class="sr-title s-diagram-title">Validator</text>
  <rect x="130" y="100" width="110" height="40" class="sr-box s-diagram-box"/>
  <text x="185" y="118" text-anchor="middle" class="sr-title s-diagram-title">Executor</text>
  <rect x="250" y="100" width="110" height="40" class="sr-box s-diagram-box"/>
  <text x="305" y="118" text-anchor="middle" class="sr-title s-diagram-title">AuditLogger</text>
  <rect x="370" y="100" width="120" height="40" class="sr-box s-diagram-box"/>
  <text x="430" y="118" text-anchor="middle" class="sr-title s-diagram-title">Notifier</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass
from typing import Protocol

@dataclass
class Account:
    id: str
    email: str
    balance: float

class TransactionValidator:
    """Changes only when validation rules change."""
    def validate(self, from_acc: Account, to_acc: Account, amount: float):
        if amount <= 0: raise ValueError("Amount must be positive.")
        if from_acc.balance < amount: raise ValueError(f"Insufficient funds in {from_acc.id}.")

class TransactionExecutor:
    """Changes only when transfer logic changes."""
    def execute(self, from_acc: Account, to_acc: Account, amount: float):
        from_acc.balance -= amount
        to_acc.balance += amount
        return {"from": from_acc.id, "to": to_acc.id, "amount": amount}

class AuditLogger:
    """Changes only when audit requirements change."""
    def log(self, event: dict):
        print(f"AUDIT: {event}")

class NotificationService:
    """Changes only when notification channels change."""
    def notify(self, email: str, message: str):
        print(f"EMAIL to {email}: {message}")

class TransferOrchestrator:
    def __init__(self):
        self.validator = TransactionValidator()
        self.executor = TransactionExecutor()
        self.logger = AuditLogger()
        self.notifier = NotificationService()

    def transfer(self, from_acc: Account, to_acc: Account, amount: float):
        self.validator.validate(from_acc, to_acc, amount)
        result = self.executor.execute(from_acc, to_acc, amount)
        self.logger.log(result)
        self.notifier.notify(from_acc.email, f"Sent \${amount}")
        self.notifier.notify(to_acc.email, f"Received \${amount}")

alice = Account("ACC-001", "alice@bank.com", 1000.0)
bob = Account("ACC-002", "bob@bank.com", 500.0)
TransferOrchestrator().transfer(alice, bob, 200.0)`,
        Go: `package main

import "fmt"

type Account struct { ID, Email string; Balance float64 }

type TransactionValidator struct{}
func (v TransactionValidator) Validate(from, to *Account, amount float64) error {
	if amount <= 0 { return fmt.Errorf("amount must be positive") }
	if from.Balance < amount { return fmt.Errorf("insufficient funds") }
	return nil
}

type TransactionExecutor struct{}
func (e TransactionExecutor) Execute(from, to *Account, amount float64) {
	from.Balance -= amount
	to.Balance += amount
}

type AuditLogger struct{}
func (l AuditLogger) Log(msg string) { fmt.Printf("AUDIT: %s\\n", msg) }

type NotificationService struct{}
func (n NotificationService) Notify(email, message string) {
	fmt.Printf("EMAIL to %s: %s\\n", email, message)
}

func Transfer(from, to *Account, amount float64) error {
	if err := (TransactionValidator{}).Validate(from, to, amount); err != nil { return err }
	TransactionExecutor{}.Execute(from, to, amount)
	AuditLogger{}.Log(fmt.Sprintf("%.2f from %s to %s", amount, from.ID, to.ID))
	n := NotificationService{}
	n.Notify(from.Email, fmt.Sprintf("Sent $%.2f", amount))
	n.Notify(to.Email, fmt.Sprintf("Received $%.2f", amount))
	return nil
}

func main() {
	alice := &Account{"ACC-001", "alice@bank.com", 1000}
	bob := &Account{"ACC-002", "bob@bank.com", 500}
	Transfer(alice, bob, 200)
}`,
        Java: `class TransactionValidator {
    void validate(Account from, Account to, double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive.");
        if (from.getBalance() < amount) throw new IllegalArgumentException("Insufficient funds.");
    }
}

class TransactionExecutor {
    void execute(Account from, Account to, double amount) {
        from.debit(amount);
        to.credit(amount);
    }
}

class AuditLogger {
    void log(String event) { System.out.println("AUDIT: " + event); }
}

class NotificationService {
    void notify(String email, String message) {
        System.out.printf("EMAIL to %s: %s%n", email, message);
    }
}

class TransferOrchestrator {
    private final TransactionValidator validator = new TransactionValidator();
    private final TransactionExecutor executor = new TransactionExecutor();
    private final AuditLogger logger = new AuditLogger();
    private final NotificationService notifier = new NotificationService();

    void transfer(Account from, Account to, double amount) {
        validator.validate(from, to, amount);
        executor.execute(from, to, amount);
        logger.log(String.format("Transferred %.2f from %s to %s", amount, from.getId(), to.getId()));
        notifier.notify(from.getEmail(), String.format("Sent $%.2f", amount));
        notifier.notify(to.getEmail(), String.format("Received $%.2f", amount));
    }
}`,
        TypeScript: `class Account {
  constructor(public readonly id: string, public readonly email: string, public balance: number) {}
}

class TransactionValidator {
  validate(from: Account, to: Account, amount: number) {
    if (amount <= 0) throw new Error("Amount must be positive.");
    if (from.balance < amount) throw new Error("Insufficient funds.");
  }
}

class TransactionExecutor {
  execute(from: Account, to: Account, amount: number) {
    from.balance -= amount;
    to.balance += amount;
  }
}

class AuditLogger {
  log(event: string) { console.log(\`AUDIT: \${event}\`); }
}

class NotificationService {
  notify(email: string, message: string) { console.log(\`EMAIL to \${email}: \${message}\`); }
}

class TransferOrchestrator {
  private validator = new TransactionValidator();
  private executor = new TransactionExecutor();
  private logger = new AuditLogger();
  private notifier = new NotificationService();

  transfer(from: Account, to: Account, amount: number) {
    this.validator.validate(from, to, amount);
    this.executor.execute(from, to, amount);
    this.logger.log(\`Transferred \${amount} from \${from.id} to \${to.id}\`);
    this.notifier.notify(from.email, \`Sent $\${amount}\`);
    this.notifier.notify(to.email, \`Received $\${amount}\`);
  }
}`,
        Rust: `struct Account { id: String, email: String, balance: f64 }

struct TransactionValidator;
impl TransactionValidator {
    fn validate(&self, from: &Account, _to: &Account, amount: f64) -> Result<(), String> {
        if amount <= 0.0 { return Err("Amount must be positive.".into()); }
        if from.balance < amount { return Err("Insufficient funds.".into()); }
        Ok(())
    }
}

struct TransactionExecutor;
impl TransactionExecutor {
    fn execute(&self, from: &mut Account, to: &mut Account, amount: f64) {
        from.balance -= amount;
        to.balance += amount;
    }
}

struct AuditLogger;
impl AuditLogger {
    fn log(&self, event: &str) { println!("AUDIT: {}", event); }
}

struct NotificationService;
impl NotificationService {
    fn notify(&self, email: &str, msg: &str) { println!("EMAIL to {}: {}", email, msg); }
}

fn transfer(from: &mut Account, to: &mut Account, amount: f64) {
    TransactionValidator.validate(&TransactionValidator, from, to, amount).unwrap();
    TransactionExecutor.execute(&TransactionExecutor, from, to, amount);
    AuditLogger.log(&AuditLogger, &format!("{:.2} from {} to {}", amount, from.id, to.id));
    NotificationService.notify(&NotificationService, &from.email, &format!("Sent \${:.2}", amount));
    NotificationService.notify(&NotificationService, &to.email, &format!("Received \${:.2}", amount));
}

fn main() {
    let mut alice = Account { id: "ACC-001".into(), email: "alice@bank.com".into(), balance: 1000.0 };
    let mut bob = Account { id: "ACC-002".into(), email: "bob@bank.com".into(), balance: 500.0 };
    transfer(&mut alice, &mut bob, 200.0);
}`,
      },
      considerations: [
        "Each class has exactly one reason to change — matching one stakeholder or policy area",
        "The orchestrator contains no business logic — it only delegates and coordinates",
        "Each component is independently testable with no external dependencies",
        "New responsibilities (e.g., fraud detection) are added as new classes, not modifications",
      ],
    },
    {
      id: 2,
      title: "Patient Record Management",
      domain: "Healthcare",
      problem:
        "A PatientService class handles CRUD, appointment scheduling, insurance verification, and history formatting — all in one class. When the insurance API changes, developers risk breaking appointment logic.",
      solution:
        "Split into PatientRepository, AppointmentScheduler, InsuranceVerifier, and MedicalHistoryFormatter. Each class handles a single concern and changes independently.",
      classDiagramSvg: `<svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    .sr-box { rx:6; }
    .sr-title { font: bold 10px 'JetBrains Mono', monospace; }
    .sr-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="110" height="50" class="sr-box s-diagram-box"/>
  <text x="65" y="28" text-anchor="middle" class="sr-title s-diagram-title">PatientRepo</text>
  <line x1="10" y1="32" x2="120" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="sr-member s-diagram-member">save() find()</text>
  <rect x="130" y="10" width="130" height="50" class="sr-box s-diagram-box"/>
  <text x="195" y="28" text-anchor="middle" class="sr-title s-diagram-title">AppointmentSched</text>
  <line x1="130" y1="32" x2="260" y2="32" class="s-diagram-line"/>
  <text x="138" y="48" class="sr-member s-diagram-member">schedule()</text>
  <rect x="270" y="10" width="110" height="50" class="sr-box s-diagram-box"/>
  <text x="325" y="28" text-anchor="middle" class="sr-title s-diagram-title">InsuranceVerify</text>
  <line x1="270" y1="32" x2="380" y2="32" class="s-diagram-line"/>
  <text x="278" y="48" class="sr-member s-diagram-member">verify()</text>
  <rect x="390" y="10" width="100" height="50" class="sr-box s-diagram-box"/>
  <text x="440" y="28" text-anchor="middle" class="sr-title s-diagram-title">HistoryFmt</text>
  <line x1="390" y1="32" x2="490" y2="32" class="s-diagram-line"/>
  <text x="398" y="48" class="sr-member s-diagram-member">format()</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Patient:
    patient_id: str
    name: str
    dob: str
    insurance_id: Optional[str] = None

class PatientRepository:
    def __init__(self):
        self._store: dict[str, Patient] = {}
    def save(self, patient: Patient):
        self._store[patient.patient_id] = patient
        print(f"Saved patient {patient.patient_id}.")
    def find(self, patient_id: str) -> Optional[Patient]:
        return self._store.get(patient_id)

class AppointmentScheduler:
    def schedule(self, patient: Patient, doctor: str, time: datetime):
        print(f"Appointment: {patient.name} with Dr. {doctor} at {time:%Y-%m-%d %H:%M}.")

class InsuranceVerifier:
    def verify(self, patient: Patient) -> bool:
        if not patient.insurance_id:
            print(f"{patient.name}: No insurance on file.")
            return False
        print(f"{patient.name}: Insurance {patient.insurance_id} verified.")
        return True

class MedicalHistoryFormatter:
    def format_summary(self, patient: Patient, records: list[str]) -> str:
        header = f"=== Medical History: {patient.name} ===\\n"
        body = "\\n".join(f"  - {r}" for r in records)
        return header + body

repo = PatientRepository()
patient = Patient("P-001", "Jane Doe", "1985-03-15", "INS-5678")
repo.save(patient)
AppointmentScheduler().schedule(patient, "Smith", datetime(2024, 6, 15, 10, 30))
InsuranceVerifier().verify(patient)
print(MedicalHistoryFormatter().format_summary(patient, ["2024-01 Flu", "2024-03 Checkup"]))`,
        Go: `package main

import "fmt"

type Patient struct { ID, Name, InsuranceID string }

type PatientRepository struct { store map[string]Patient }
func NewPatientRepository() *PatientRepository {
	return &PatientRepository{store: make(map[string]Patient)}
}
func (r *PatientRepository) Save(p Patient) {
	r.store[p.ID] = p
	fmt.Printf("Saved patient %s.\\n", p.ID)
}

type AppointmentScheduler struct{}
func (s AppointmentScheduler) Schedule(p Patient, doctor, time string) {
	fmt.Printf("Appointment: %s with Dr. %s at %s.\\n", p.Name, doctor, time)
}

type InsuranceVerifier struct{}
func (v InsuranceVerifier) Verify(p Patient) bool {
	if p.InsuranceID == "" {
		fmt.Printf("%s: No insurance.\\n", p.Name)
		return false
	}
	fmt.Printf("%s: Insurance %s verified.\\n", p.Name, p.InsuranceID)
	return true
}

func main() {
	repo := NewPatientRepository()
	p := Patient{"P-001", "Jane Doe", "INS-5678"}
	repo.Save(p)
	AppointmentScheduler{}.Schedule(p, "Smith", "2024-06-15")
	InsuranceVerifier{}.Verify(p)
}`,
        Java: `class PatientRepository {
    private final Map<String, Patient> store = new HashMap<>();
    void save(Patient p) {
        store.put(p.getId(), p);
        System.out.printf("Saved patient %s.%n", p.getId());
    }
    Patient find(String id) { return store.get(id); }
}

class AppointmentScheduler {
    void schedule(Patient p, String doctor, String time) {
        System.out.printf("Appointment: %s with Dr. %s at %s.%n", p.getName(), doctor, time);
    }
}

class InsuranceVerifier {
    boolean verify(Patient p) {
        if (p.getInsuranceId() == null) return false;
        System.out.printf("%s: Insurance %s verified.%n", p.getName(), p.getInsuranceId());
        return true;
    }
}`,
        TypeScript: `interface Patient { patientId: string; name: string; insuranceId?: string; }

class PatientRepository {
  private store = new Map<string, Patient>();
  save(p: Patient) { this.store.set(p.patientId, p); }
  find(id: string) { return this.store.get(id); }
}

class AppointmentScheduler {
  schedule(p: Patient, doctor: string, time: string) {
    console.log(\`Appointment: \${p.name} with Dr. \${doctor} at \${time}.\`);
  }
}

class InsuranceVerifier {
  verify(p: Patient): boolean {
    if (!p.insuranceId) { console.log(\`\${p.name}: No insurance.\`); return false; }
    console.log(\`\${p.name}: Insurance \${p.insuranceId} verified.\`);
    return true;
  }
}`,
        Rust: `struct Patient { id: String, name: String, insurance_id: Option<String> }

struct PatientRepository { store: std::collections::HashMap<String, Patient> }
impl PatientRepository {
    fn new() -> Self { Self { store: std::collections::HashMap::new() } }
    fn save(&mut self, p: Patient) {
        println!("Saved patient {}.", p.id);
        self.store.insert(p.id.clone(), p);
    }
}

struct AppointmentScheduler;
impl AppointmentScheduler {
    fn schedule(&self, p: &Patient, doctor: &str, time: &str) {
        println!("Appointment: {} with Dr. {} at {}.", p.name, doctor, time);
    }
}

struct InsuranceVerifier;
impl InsuranceVerifier {
    fn verify(&self, p: &Patient) -> bool {
        match &p.insurance_id {
            Some(id) => { println!("{}: Insurance {} verified.", p.name, id); true }
            None => { println!("{}: No insurance.", p.name); false }
        }
    }
}

fn main() {
    let mut repo = PatientRepository::new();
    let p = Patient { id: "P-001".into(), name: "Jane Doe".into(), insurance_id: Some("INS-5678".into()) };
    InsuranceVerifier.verify(&p);
    AppointmentScheduler.schedule(&AppointmentScheduler, &p, "Smith", "2024-06-15");
    repo.save(p);
}`,
      },
      considerations: [
        "PatientRepository changes only when storage requirements change",
        "InsuranceVerifier changes only when the insurance API changes",
        "AppointmentScheduler changes only when scheduling rules change",
        "Each class can be tested with mocks independent of the others",
      ],
    },
    {
      id: 3,
      title: "Notification System Decomposition",
      domain: "Communication Platform",
      problem:
        "A monolithic NotificationManager handles template rendering, recipient resolution, channel selection, delivery, and delivery tracking. Any change to the email provider requires touching the same class that handles SMS routing.",
      solution:
        "Decompose into TemplateRenderer, RecipientResolver, ChannelRouter, DeliveryService, and DeliveryTracker. The NotificationOrchestrator coordinates them.",
      classDiagramSvg: `<svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .sr-box { rx:6; }
    .sr-title { font: bold 10px 'JetBrains Mono', monospace; }
    .sr-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="150" y="5" width="200" height="40" class="sr-box s-diagram-box"/>
  <text x="250" y="30" text-anchor="middle" class="sr-title s-diagram-title">NotificationOrchestrator</text>
  <rect x="10" y="80" width="90" height="40" class="sr-box s-diagram-box"/>
  <text x="55" y="104" text-anchor="middle" class="sr-title s-diagram-title">Renderer</text>
  <rect x="110" y="80" width="90" height="40" class="sr-box s-diagram-box"/>
  <text x="155" y="104" text-anchor="middle" class="sr-title s-diagram-title">Resolver</text>
  <rect x="210" y="80" width="90" height="40" class="sr-box s-diagram-box"/>
  <text x="255" y="104" text-anchor="middle" class="sr-title s-diagram-title">Router</text>
  <rect x="310" y="80" width="90" height="40" class="sr-box s-diagram-box"/>
  <text x="355" y="104" text-anchor="middle" class="sr-title s-diagram-title">Delivery</text>
  <rect x="410" y="80" width="90" height="40" class="sr-box s-diagram-box"/>
  <text x="455" y="104" text-anchor="middle" class="sr-title s-diagram-title">Tracker</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

@dataclass
class Notification:
    template: str
    data: dict
    recipient_criteria: dict

class TemplateRenderer:
    def render(self, template: str, data: dict) -> str:
        return f"[{template}] " + ", ".join(f"{k}={v}" for k, v in data.items())

class RecipientResolver:
    def resolve(self, criteria: dict) -> list[str]:
        return criteria.get("emails", [])

class ChannelRouter:
    def route(self, recipient: str) -> str:
        return "email" if "@" in recipient else "sms"

class DeliveryService:
    def deliver(self, channel: str, recipient: str, message: str):
        print(f"[{channel.upper()}] to {recipient}: {message}")

class DeliveryTracker:
    def track(self, recipient: str, status: str):
        print(f"TRACK: {recipient} -> {status}")

class NotificationOrchestrator:
    def __init__(self):
        self.renderer = TemplateRenderer()
        self.resolver = RecipientResolver()
        self.router = ChannelRouter()
        self.delivery = DeliveryService()
        self.tracker = DeliveryTracker()

    def send(self, notification: Notification):
        message = self.renderer.render(notification.template, notification.data)
        recipients = self.resolver.resolve(notification.recipient_criteria)
        for r in recipients:
            channel = self.router.route(r)
            self.delivery.deliver(channel, r, message)
            self.tracker.track(r, "SENT")

NotificationOrchestrator().send(
    Notification("welcome", {"user": "Alice"}, {"emails": ["alice@co.com"]})
)`,
        Go: `package main

import "fmt"

type TemplateRenderer struct{}
func (r TemplateRenderer) Render(t string, data map[string]string) string {
	return fmt.Sprintf("[%s] user=%s", t, data["user"])
}

type RecipientResolver struct{}
func (r RecipientResolver) Resolve(emails []string) []string { return emails }

type DeliveryService struct{}
func (d DeliveryService) Deliver(channel, recipient, message string) {
	fmt.Printf("[%s] to %s: %s\\n", channel, recipient, message)
}

func SendNotification(template string, data map[string]string, emails []string) {
	msg := TemplateRenderer{}.Render(template, data)
	recipients := RecipientResolver{}.Resolve(emails)
	for _, r := range recipients {
		DeliveryService{}.Deliver("EMAIL", r, msg)
	}
}

func main() {
	SendNotification("welcome", map[string]string{"user": "Alice"}, []string{"alice@co.com"})
}`,
        Java: `class TemplateRenderer {
    String render(String template, Map<String, String> data) {
        return "[" + template + "] " + data.toString();
    }
}

class DeliveryService {
    void deliver(String channel, String recipient, String message) {
        System.out.printf("[%s] to %s: %s%n", channel, recipient, message);
    }
}

class NotificationOrchestrator {
    private final TemplateRenderer renderer = new TemplateRenderer();
    private final DeliveryService delivery = new DeliveryService();

    void send(String template, Map<String, String> data, List<String> recipients) {
        String message = renderer.render(template, data);
        for (String r : recipients) {
            delivery.deliver("EMAIL", r, message);
        }
    }
}`,
        TypeScript: `class TemplateRenderer {
  render(template: string, data: Record<string, string>): string {
    return \`[\${template}] \${Object.entries(data).map(([k, v]) => \`\${k}=\${v}\`).join(", ")}\`;
  }
}

class RecipientResolver {
  resolve(criteria: { emails: string[] }): string[] { return criteria.emails; }
}

class DeliveryService {
  deliver(channel: string, recipient: string, message: string) {
    console.log(\`[\${channel}] to \${recipient}: \${message}\`);
  }
}

class NotificationOrchestrator {
  private renderer = new TemplateRenderer();
  private resolver = new RecipientResolver();
  private delivery = new DeliveryService();

  send(template: string, data: Record<string, string>, criteria: { emails: string[] }) {
    const message = this.renderer.render(template, data);
    for (const r of this.resolver.resolve(criteria)) {
      this.delivery.deliver("EMAIL", r, message);
    }
  }
}`,
        Rust: `struct TemplateRenderer;
impl TemplateRenderer {
    fn render(&self, template: &str, user: &str) -> String {
        format!("[{}] user={}", template, user)
    }
}

struct DeliveryService;
impl DeliveryService {
    fn deliver(&self, channel: &str, recipient: &str, message: &str) {
        println!("[{}] to {}: {}", channel, recipient, message);
    }
}

fn send_notification(template: &str, user: &str, recipients: &[&str]) {
    let msg = TemplateRenderer.render(&TemplateRenderer, template, user);
    for r in recipients {
        DeliveryService.deliver(&DeliveryService, "EMAIL", r, &msg);
    }
}

fn main() {
    send_notification("welcome", "Alice", &["alice@co.com"]);
}`,
      },
      considerations: [
        "TemplateRenderer changes only when message format requirements change",
        "DeliveryService changes only when delivery providers change",
        "RecipientResolver changes only when recipient selection logic changes",
        "Each service is independently deployable in a microservices architecture",
      ],
    },
    {
      id: 4,
      title: "API Middleware Pipeline",
      domain: "Backend / Microservices",
      problem:
        "A single RequestHandler class parses the request, authenticates the user, authorizes access, runs business logic, formats the response, and logs the request. Any change to authentication risks breaking the response formatting.",
      solution:
        "Each concern becomes a middleware or service: RequestParser, AuthMiddleware, AuthzMiddleware, BusinessHandler, ResponseFormatter, RequestLogger. The pipeline chains them in order.",
      classDiagramSvg: `<svg viewBox="0 0 500 100" xmlns="http://www.w3.org/2000/svg">
  <style>
    .sr-box { rx:6; }
    .sr-title { font: bold 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="5" y="20" width="75" height="35" class="sr-box s-diagram-box"/>
  <text x="42" y="42" text-anchor="middle" class="sr-title s-diagram-title">Parse</text>
  <rect x="90" y="20" width="75" height="35" class="sr-box s-diagram-box"/>
  <text x="128" y="42" text-anchor="middle" class="sr-title s-diagram-title">AuthN</text>
  <rect x="175" y="20" width="75" height="35" class="sr-box s-diagram-box"/>
  <text x="213" y="42" text-anchor="middle" class="sr-title s-diagram-title">AuthZ</text>
  <rect x="260" y="20" width="75" height="35" class="sr-box s-diagram-box"/>
  <text x="298" y="42" text-anchor="middle" class="sr-title s-diagram-title">Handler</text>
  <rect x="345" y="20" width="75" height="35" class="sr-box s-diagram-box"/>
  <text x="383" y="42" text-anchor="middle" class="sr-title s-diagram-title">Format</text>
  <rect x="430" y="20" width="65" height="35" class="sr-box s-diagram-box"/>
  <text x="463" y="42" text-anchor="middle" class="sr-title s-diagram-title">Log</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass
from typing import Callable, Optional

@dataclass
class Request:
    path: str
    method: str
    headers: dict
    body: Optional[str] = None

@dataclass
class Response:
    status: int
    body: str

class RequestParser:
    def parse(self, raw: dict) -> Request:
        return Request(raw["path"], raw["method"], raw.get("headers", {}), raw.get("body"))

class AuthMiddleware:
    def authenticate(self, req: Request) -> str:
        token = req.headers.get("Authorization", "")
        if not token: raise PermissionError("No auth token.")
        return "user-123"  # resolved user ID

class AuthzMiddleware:
    PERMISSIONS = {"user-123": ["/api/orders", "/api/profile"]}
    def authorize(self, user_id: str, path: str):
        if path not in self.PERMISSIONS.get(user_id, []):
            raise PermissionError(f"Access denied to {path}")

class ResponseFormatter:
    def format(self, data: dict, status: int = 200) -> Response:
        import json
        return Response(status, json.dumps(data))

class RequestLogger:
    def log(self, req: Request, resp: Response):
        print(f"LOG: {req.method} {req.path} -> {resp.status}")

# Each class has one responsibility and one reason to change`,
        Go: `package main

import "fmt"

type Request struct{ Path, Method string; Headers map[string]string }
type Response struct{ Status int; Body string }

type AuthMiddleware struct{}
func (a AuthMiddleware) Authenticate(r Request) (string, error) {
	if _, ok := r.Headers["Authorization"]; !ok {
		return "", fmt.Errorf("no auth token")
	}
	return "user-123", nil
}

type AuthzMiddleware struct{ Permissions map[string][]string }
func (a AuthzMiddleware) Authorize(userID, path string) error {
	for _, p := range a.Permissions[userID] {
		if p == path { return nil }
	}
	return fmt.Errorf("access denied")
}

type RequestLogger struct{}
func (l RequestLogger) Log(r Request, resp Response) {
	fmt.Printf("LOG: %s %s -> %d\\n", r.Method, r.Path, resp.Status)
}`,
        Java: `class AuthMiddleware {
    String authenticate(Request req) {
        String token = req.getHeader("Authorization");
        if (token == null) throw new SecurityException("No auth token.");
        return "user-123";
    }
}

class AuthzMiddleware {
    void authorize(String userId, String path) {
        // check permissions
    }
}

class ResponseFormatter {
    Response format(Map<String, Object> data, int status) {
        return new Response(status, data.toString());
    }
}

class RequestLogger {
    void log(Request req, Response resp) {
        System.out.printf("LOG: %s %s -> %d%n", req.getMethod(), req.getPath(), resp.getStatus());
    }
}`,
        TypeScript: `interface Request { path: string; method: string; headers: Record<string, string>; }
interface Response { status: number; body: string; }

class AuthMiddleware {
  authenticate(req: Request): string {
    if (!req.headers["Authorization"]) throw new Error("No auth token.");
    return "user-123";
  }
}

class AuthzMiddleware {
  private perms: Record<string, string[]> = { "user-123": ["/api/orders"] };
  authorize(userId: string, path: string) {
    if (!this.perms[userId]?.includes(path)) throw new Error("Access denied.");
  }
}

class ResponseFormatter {
  format(data: Record<string, unknown>, status = 200): Response {
    return { status, body: JSON.stringify(data) };
  }
}

class RequestLogger {
  log(req: Request, resp: Response) {
    console.log(\`LOG: \${req.method} \${req.path} -> \${resp.status}\`);
  }
}`,
        Rust: `struct Request { path: String, method: String, auth_token: Option<String> }
struct Response { status: u16, body: String }

struct AuthMiddleware;
impl AuthMiddleware {
    fn authenticate(&self, req: &Request) -> Result<String, String> {
        req.auth_token.as_ref().map(|_| "user-123".to_string())
            .ok_or("No auth token.".to_string())
    }
}

struct RequestLogger;
impl RequestLogger {
    fn log(&self, req: &Request, resp: &Response) {
        println!("LOG: {} {} -> {}", req.method, req.path, resp.status);
    }
}`,
      },
      considerations: [
        "Middleware architecture naturally enforces SRP — each middleware handles one concern",
        "Authentication changes don't affect response formatting",
        "Logging changes don't affect authorization",
        "The pipeline order is explicit and configurable",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Class Decomposition",
      description:
        "The classic approach: split a large class into multiple smaller classes, each handling one responsibility. An orchestrator or facade composes them. Best when responsibilities are clearly separable and rarely share state.",
      code: {
        Python: `# Each class has exactly one job
class Validator:
    def validate(self, data: dict) -> bool:
        return all(k in data for k in ["name", "email"])

class Persister:
    def save(self, data: dict):
        print(f"Saved: {data['name']}")

class Notifier:
    def notify(self, email: str, msg: str):
        print(f"Notified {email}: {msg}")

class RegistrationService:
    """Orchestrator — delegates to single-responsibility classes."""
    def __init__(self):
        self.validator = Validator()
        self.persister = Persister()
        self.notifier = Notifier()

    def register(self, data: dict):
        self.validator.validate(data)
        self.persister.save(data)
        self.notifier.notify(data["email"], "Welcome!")

RegistrationService().register({"name": "Alice", "email": "alice@co.com"})`,
        Go: `type Validator struct{}
func (v Validator) Validate(data map[string]string) error {
	if data["name"] == "" || data["email"] == "" { return fmt.Errorf("missing fields") }
	return nil
}

type Persister struct{}
func (p Persister) Save(data map[string]string) { fmt.Println("Saved:", data["name"]) }

type Notifier struct{}
func (n Notifier) Notify(email, msg string) { fmt.Printf("Notified %s: %s\n", email, msg) }

func Register(data map[string]string) {
	Validator{}.Validate(data)
	Persister{}.Save(data)
	Notifier{}.Notify(data["email"], "Welcome!")
}`,
        Java: `class Validator {
    void validate(Map<String, String> data) {
        if (!data.containsKey("name")) throw new IllegalArgumentException("Missing name");
    }
}
class Persister {
    void save(Map<String, String> data) { System.out.println("Saved: " + data.get("name")); }
}
class Notifier {
    void notify(String email, String msg) { System.out.printf("Notified %s: %s%n", email, msg); }
}
class RegistrationService {
    void register(Map<String, String> data) {
        new Validator().validate(data);
        new Persister().save(data);
        new Notifier().notify(data.get("email"), "Welcome!");
    }
}`,
        TypeScript: `class Validator {
  validate(data: Record<string, string>) {
    if (!data.name || !data.email) throw new Error("Missing fields");
  }
}
class Persister {
  save(data: Record<string, string>) { console.log(\`Saved: \${data.name}\`); }
}
class Notifier {
  notify(email: string, msg: string) { console.log(\`Notified \${email}: \${msg}\`); }
}

class RegistrationService {
  private validator = new Validator();
  private persister = new Persister();
  private notifier = new Notifier();

  register(data: Record<string, string>) {
    this.validator.validate(data);
    this.persister.save(data);
    this.notifier.notify(data.email, "Welcome!");
  }
}`,
        Rust: `struct Validator;
impl Validator {
    fn validate(&self, data: &std::collections::HashMap<String, String>) -> Result<(), String> {
        if !data.contains_key("name") { return Err("Missing name".into()); }
        Ok(())
    }
}
struct Persister;
impl Persister {
    fn save(&self, data: &std::collections::HashMap<String, String>) {
        println!("Saved: {}", data["name"]);
    }
}
struct Notifier;
impl Notifier {
    fn notify(&self, email: &str, msg: &str) { println!("Notified {}: {}", email, msg); }
}`,
      },
      pros: [
        "Clear responsibility boundaries — easy to reason about each class",
        "Each class is independently testable with minimal setup",
        "Changes in one concern cannot affect another",
      ],
      cons: [
        "More classes to manage — can feel like over-engineering for small codebases",
        "Orchestrator adds an extra layer of indirection",
        "Shared state between responsibilities requires careful coordination",
      ],
    },
    {
      id: 2,
      name: "Module / Namespace Separation",
      description:
        "Instead of splitting a class, separate responsibilities into modules or namespaces. Functions within each module handle one concern. Best for functional-style codebases and smaller projects.",
      code: {
        Python: `# validation.py
def validate_registration(data: dict) -> bool:
    return "name" in data and "email" in data

# persistence.py
def save_user(data: dict):
    print(f"Saved: {data['name']}")

# notification.py
def send_welcome(email: str):
    print(f"Welcome email to {email}")

# registration.py (orchestrator)
from validation import validate_registration
from persistence import save_user
from notification import send_welcome

def register(data: dict):
    if validate_registration(data):
        save_user(data)
        send_welcome(data["email"])`,
        Go: `// validation/validation.go
package validation

func ValidateRegistration(data map[string]string) error { /* ... */ return nil }

// persistence/persistence.go
package persistence

func SaveUser(data map[string]string) { /* ... */ }

// notification/notification.go
package notification

func SendWelcome(email string) { /* ... */ }

// registration/registration.go — imports and composes the above
package registration

import (
    "validation"
    "persistence"
    "notification"
)

func Register(data map[string]string) {
    validation.ValidateRegistration(data)
    persistence.SaveUser(data)
    notification.SendWelcome(data["email"])
}`,
        Java: `// Separate packages for each concern
// com.app.validation.RegistrationValidator
// com.app.persistence.UserRepository
// com.app.notification.WelcomeNotifier
// com.app.registration.RegistrationService (orchestrates)`,
        TypeScript: `// validation.ts
export function validateRegistration(data: Record<string, string>): boolean {
  return !!data.name && !!data.email;
}

// persistence.ts
export function saveUser(data: Record<string, string>) {
  console.log(\`Saved: \${data.name}\`);
}

// notification.ts
export function sendWelcome(email: string) {
  console.log(\`Welcome email to \${email}\`);
}

// registration.ts
import { validateRegistration } from "./validation";
import { saveUser } from "./persistence";
import { sendWelcome } from "./notification";

export function register(data: Record<string, string>) {
  if (validateRegistration(data)) { saveUser(data); sendWelcome(data.email); }
}`,
        Rust: `// mod validation;
// mod persistence;
// mod notification;

mod validation {
    pub fn validate(data: &std::collections::HashMap<String, String>) -> bool {
        data.contains_key("name") && data.contains_key("email")
    }
}

mod persistence {
    pub fn save_user(data: &std::collections::HashMap<String, String>) {
        println!("Saved: {}", data["name"]);
    }
}

mod notification {
    pub fn send_welcome(email: &str) { println!("Welcome to {}", email); }
}`,
      },
      pros: [
        "Lightweight — no extra classes or interfaces needed",
        "Natural fit for functional programming styles",
        "Easy to navigate with clear folder/module structure",
      ],
      cons: [
        "Less enforceable boundaries — functions can be imported and misused",
        "No interface-based polymorphism for swapping implementations",
        "Harder to mock in tests without dependency injection",
      ],
    },
    {
      id: 3,
      name: "Event-Driven Decoupling",
      description:
        "Instead of direct calls, emit events when something happens. Listeners handle cross-cutting concerns independently. The core class emits events; it doesn't know who handles them. Best for decoupling concerns that are triggered by the same business event.",
      code: {
        Python: `from typing import Callable

class EventBus:
    def __init__(self):
        self._listeners: dict[str, list[Callable]] = {}

    def subscribe(self, event: str, listener: Callable):
        self._listeners.setdefault(event, []).append(listener)

    def emit(self, event: str, data: dict):
        for listener in self._listeners.get(event, []):
            listener(data)

bus = EventBus()

# Each handler has ONE responsibility
def audit_handler(data): print(f"AUDIT: {data}")
def notification_handler(data): print(f"EMAIL: Transfer of \${data['amount']}")
def analytics_handler(data): print(f"ANALYTICS: {data['from']} -> {data['to']}")

bus.subscribe("transfer.completed", audit_handler)
bus.subscribe("transfer.completed", notification_handler)
bus.subscribe("transfer.completed", analytics_handler)

# Core class — only handles transfers, emits event
class TransferService:
    def __init__(self, bus: EventBus):
        self.bus = bus
    def transfer(self, from_id: str, to_id: str, amount: float):
        print(f"Transferring \${amount}")
        self.bus.emit("transfer.completed", {"from": from_id, "to": to_id, "amount": amount})

TransferService(bus).transfer("ACC-1", "ACC-2", 500)`,
        Go: `type EventBus struct {
	listeners map[string][]func(map[string]interface{})
}
func NewEventBus() *EventBus {
	return &EventBus{listeners: make(map[string][]func(map[string]interface{}))}
}
func (b *EventBus) Subscribe(event string, fn func(map[string]interface{})) {
	b.listeners[event] = append(b.listeners[event], fn)
}
func (b *EventBus) Emit(event string, data map[string]interface{}) {
	for _, fn := range b.listeners[event] { fn(data) }
}`,
        Java: `class EventBus {
    Map<String, List<Consumer<Map<String, Object>>>> listeners = new HashMap<>();
    void subscribe(String event, Consumer<Map<String, Object>> listener) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(listener);
    }
    void emit(String event, Map<String, Object> data) {
        listeners.getOrDefault(event, List.of()).forEach(l -> l.accept(data));
    }
}`,
        TypeScript: `class EventBus {
  private listeners = new Map<string, Array<(data: Record<string, unknown>) => void>>();

  subscribe(event: string, fn: (data: Record<string, unknown>) => void) {
    const list = this.listeners.get(event) ?? [];
    list.push(fn);
    this.listeners.set(event, list);
  }

  emit(event: string, data: Record<string, unknown>) {
    for (const fn of this.listeners.get(event) ?? []) fn(data);
  }
}

const bus = new EventBus();
bus.subscribe("transfer", (d) => console.log(\`AUDIT: \${JSON.stringify(d)}\`));
bus.subscribe("transfer", (d) => console.log(\`EMAIL: Transfer of $\${d.amount}\`));`,
        Rust: `use std::collections::HashMap;

struct EventBus {
    listeners: HashMap<String, Vec<Box<dyn Fn(&HashMap<String, String>)>>>,
}

impl EventBus {
    fn new() -> Self { Self { listeners: HashMap::new() } }
    fn subscribe(&mut self, event: &str, f: impl Fn(&HashMap<String, String>) + 'static) {
        self.listeners.entry(event.into()).or_default().push(Box::new(f));
    }
    fn emit(&self, event: &str, data: &HashMap<String, String>) {
        if let Some(listeners) = self.listeners.get(event) {
            for f in listeners { f(data); }
        }
    }
}`,
      },
      pros: [
        "Complete decoupling — the emitter doesn't know about handlers",
        "New cross-cutting concerns (audit, analytics) are added by subscribing, not modifying",
        "Natural fit for distributed systems and microservices",
      ],
      cons: [
        "Harder to trace execution flow — events are indirect",
        "Ordering guarantees between handlers may be unclear",
        "Error handling in event handlers requires careful design",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Decoupling Level", "Complexity", "Testability", "Best For",
  ],
  comparisonRows: [
    ["Class Decomposition", "High (via interfaces)", "Medium", "Excellent", "Most applications — clear, OOP-friendly"],
    ["Module Separation", "Medium (import-based)", "Low", "Good", "Functional codebases, small projects"],
    ["Event-Driven", "Very High (async)", "High", "Good (with mocks)", "Cross-cutting concerns, distributed systems"],
  ],

  summary: [
    { aspect: "Principle Type", detail: "SOLID — S" },
    {
      aspect: "Key Benefit",
      detail:
        "Each class has one reason to change, mapping to one stakeholder or business concern. This reduces blast radius of changes, simplifies testing, and makes code easier to understand and maintain.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Over-splitting: creating a separate class for every single method. SRP means one *reason to change*, not one *method*. A class can have multiple methods if they all change for the same reason.",
    },
    {
      aspect: "vs. Interface Segregation",
      detail:
        "SRP focuses on classes having one reason to change. ISP focuses on interfaces being small and client-specific. They complement each other: SRP for implementation cohesion, ISP for interface cohesion.",
    },
    {
      aspect: "vs. God Object Anti-Pattern",
      detail:
        "The God Object is the direct violation of SRP — one class that does everything. Applying SRP breaks the God Object into focused, composable classes.",
    },
    {
      aspect: "When to Apply",
      detail:
        "When a class has multiple reasons to change (different stakeholders). When testing requires complex setup with many mocks. When changes in one area frequently break another. When the class is hard to name because it does too many things.",
    },
    {
      aspect: "When NOT to Over-Apply",
      detail:
        "Simple CRUD operations where splitting into 5 classes adds indirection without benefit. Early-stage prototypes where the boundaries aren't clear yet. When cohesion within the class is genuinely high.",
    },
    {
      aspect: "Related Principles",
      detail:
        "ISP (interface-level SRP), DIP (depend on abstractions for replacement), OCP (extend without modifying). SRP is the foundation that makes the other principles practical.",
    },
  ],

  antiPatterns: [
    {
      name: "God Class",
      description:
        "A single class that handles validation, business logic, persistence, notification, formatting, and logging — the direct violation of SRP.",
      betterAlternative:
        "Identify each responsibility and extract it into its own class. Use an orchestrator to compose them.",
    },
    {
      name: "Nano Classes",
      description:
        "Over-applying SRP by creating a separate class for every single method, leading to hundreds of tiny classes with excessive indirection.",
      betterAlternative:
        "SRP means one *reason to change*, not one *method*. Group methods that change for the same reason into one class. Use judgment.",
    },
    {
      name: "Shared Mutable State",
      description:
        "Splitting a class into separate classes that still share mutable state (e.g., passing a reference to the same object graph), undermining the decoupling.",
      betterAlternative:
        "Use immutable data transfer objects (DTOs) between responsibilities. Each class receives data, processes it, and returns new data.",
    },
    {
      name: "Orchestrator That Does Business Logic",
      description:
        "The orchestrator class that composes single-responsibility classes starts accumulating its own business logic, becoming a new God Class.",
      betterAlternative:
        "Keep the orchestrator thin — it only delegates and coordinates. Any business logic should be in the composed classes.",
    },
  ],
};

export default singleResponsibilityData;
