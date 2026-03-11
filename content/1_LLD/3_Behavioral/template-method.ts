import { PatternData } from "@/lib/patterns/types";

const templateMethodData: PatternData = {
  slug: "template-method",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Template Method Pattern",
  subtitle:
    "Define the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the algorithm's overall structure.",

  intent:
    "Many processes follow the same high-level sequence but differ in their details. A trade settlement pipeline always validates, calculates fees, executes, confirms, and notifies — but fee calculation differs for equities vs. bonds. An ETL pipeline always extracts, transforms, and loads — but the source and destination vary.\n\nWithout a pattern, you either duplicate the entire pipeline for each variant (copy-paste bugs) or litter the code with if/else chains. The Template Method pattern pulls the invariant algorithm into a base class method (the 'template method') and declares abstract or hook methods for the parts that vary.\n\nSubclasses fill in the details without altering the flow. This is the Hollywood Principle: 'Don't call us, we'll call you.' The base class calls subclass methods — not the other way around.",

  classDiagramSvg: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .t-box { rx:6; }
    .t-title { font: bold 11px 'JetBrains Mono', monospace; }
    .t-member { font: 10px 'JetBrains Mono', monospace; }
    .t-arr { stroke-width:1.2; fill:none; marker-end:url(#t-arr); }
    .t-dash { stroke-dasharray: 5,3; }
    .t-ital { font-style: italic; }
  </style>
  <defs>
    <marker id="t-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="t-arrow-head"/>
    </marker>
  </defs>
  <!-- AbstractClass -->
  <rect x="140" y="10" width="240" height="90" class="t-box t-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="t-title t-diagram-title">AbstractClass</text>
  <line x1="140" y1="32" x2="380" y2="32" class="t-diagram-line"/>
  <text x="150" y="48" class="t-member t-diagram-member">+templateMethod(): void</text>
  <text x="150" y="63" class="t-member t-diagram-member t-ital">#step1()*</text>
  <text x="150" y="78" class="t-member t-diagram-member t-ital">#step2()*</text>
  <text x="150" y="93" class="t-member t-diagram-member">#hook(): void  {default}</text>
  <!-- ConcreteClassA -->
  <rect x="40" y="150" width="180" height="65" class="t-box t-diagram-box"/>
  <text x="130" y="168" text-anchor="middle" class="t-title t-diagram-title">ConcreteClassA</text>
  <line x1="40" y1="172" x2="220" y2="172" class="t-diagram-line"/>
  <text x="50" y="188" class="t-member t-diagram-member">#step1()</text>
  <text x="50" y="203" class="t-member t-diagram-member">#step2()</text>
  <!-- ConcreteClassB -->
  <rect x="300" y="150" width="180" height="65" class="t-box t-diagram-box"/>
  <text x="390" y="168" text-anchor="middle" class="t-title t-diagram-title">ConcreteClassB</text>
  <line x1="300" y1="172" x2="480" y2="172" class="t-diagram-line"/>
  <text x="310" y="188" class="t-member t-diagram-member">#step1()</text>
  <text x="310" y="203" class="t-member t-diagram-member">#step2() + hook()</text>
  <!-- Arrows -->
  <line x1="130" y1="150" x2="220" y2="100" class="t-arr t-diagram-arrow t-dash"/>
  <line x1="390" y1="150" x2="300" y2="100" class="t-arr t-diagram-arrow t-dash"/>
</svg>`,

  diagramExplanation:
    "The AbstractClass defines templateMethod(), which calls step1(), step2(), and hook() in a fixed order. step1() and step2() are abstract — subclasses must implement them. hook() has a default (often no-op) implementation that subclasses may optionally override. ConcreteClassA and ConcreteClassB provide their own implementations of the abstract steps, customizing the algorithm without changing its structure.",

  diagramComponents: [
    {
      name: "AbstractClass",
      description:
        "Defines the template method that controls the algorithm's sequence. Contains the invariant steps as concrete methods and declares abstract/hook methods for the variable parts.",
    },
    {
      name: "templateMethod()",
      description:
        "The method that orchestrates the algorithm. Calls abstract steps and hooks in a fixed order. Usually declared final (or non-overridable) to prevent subclasses from altering the flow.",
    },
    {
      name: "Abstract Steps (step1, step2)",
      description:
        "Pure virtual methods that subclasses must implement. These are the extension points where each variant provides its specific behavior.",
    },
    {
      name: "Hook Methods",
      description:
        "Optional extension points with a default implementation (often empty). Subclasses can override hooks to inject additional behavior at specific points in the algorithm without being forced to.",
    },
    {
      name: "ConcreteClass A/B",
      description:
        "Subclasses that implement the abstract steps. Each provides its own variant of the algorithm's variable parts while inheriting the fixed structure from the base class.",
    },
  ],

  solutionDetail:
    "**The Problem:** Multiple processes share the same high-level flow but differ in specific steps. Copy-pasting the entire flow leads to duplication; using conditionals leads to tangled code.\n\n**The Template Method Solution:** Extract the invariant algorithm into a base class method and make the variable steps abstract.\n\n**How It Works:**\n\n1. **Define the template method**: The base class declares a method that calls a sequence of steps in a fixed order. This method is usually `final` to prevent subclasses from altering the flow.\n\n2. **Identify invariant vs. variable steps**: Shared logic stays in concrete methods of the base class. Steps that differ across variants become abstract methods.\n\n3. **Add hook methods**: For optional customization points, provide methods with default implementations (often empty no-ops) that subclasses may override.\n\n4. **Subclass and specialize**: Each variant creates a subclass that implements the abstract steps and optionally overrides hooks.\n\n**Key Insight:** The base class controls the flow (inversion of control). Subclasses fill in the details. This enforces consistency — every variant follows the same sequence — while allowing flexibility in the specifics.",

  characteristics: [
    "Inversion of control — the base class calls subclass methods, not vice versa (Hollywood Principle)",
    "Code reuse — common algorithm structure lives in one place",
    "Open/Closed Principle — new variants are added by subclassing, not by modifying existing code",
    "Hook methods provide optional extension points with sensible defaults",
    "Fixed algorithm structure — the sequence of steps cannot be changed by subclasses",
    "Can lead to deep inheritance hierarchies if overused",
    "Easier to understand than Strategy when the number of variable steps is small",
  ],

  useCases: [
    {
      id: 1,
      title: "Trade Settlement Pipeline",
      domain: "Fintech",
      description:
        "Settlements for equities, bonds, and derivatives follow the same flow: validate → calculate fees → execute → confirm → notify. Fee calculation and execution differ by asset class.",
      whySingleton:
        "The base TradeSettlement class defines the pipeline as a template method. EquitySettlement, BondSettlement, and DerivativeSettlement override fee and execution steps. The flow is guaranteed consistent.",
      code: `abstract class TradeSettlement {
  final settle(trade: Trade) {          // template method
    this.validate(trade);
    const fees = this.calculateFees(trade);    // abstract
    const result = this.executeSettlement(trade, fees); // abstract
    this.generateConfirmation(trade, result);  // abstract
    this.notifyParties(trade);          // concrete
    this.postSettlementHook(trade);     // hook
  }
}`,
    },
    {
      id: 2,
      title: "ETL Pipeline",
      domain: "Data Engineering",
      description:
        "ETL processes always extract, transform, validate, and load. The source (API, file, database) and destination (warehouse, lake) vary but the pipeline flow is the same.",
      whySingleton:
        "An abstract ETLPipeline defines the template method. Subclasses like APIToWarehouse and FileToLake override extract(), transform(), and load() while the base handles orchestration and error handling.",
      code: `abstract class ETLPipeline {
  run() {
    const raw = this.extract();
    const cleaned = this.transform(raw);
    this.validate(cleaned);
    this.load(cleaned);
    this.postLoadHook();
  }
}`,
    },
    {
      id: 3,
      title: "Report Generation",
      domain: "Enterprise / SaaS",
      description:
        "Reports (PDF, Excel, HTML) all follow: fetch data → format header → render body → add footer. The rendering logic differs by output format.",
      whySingleton:
        "An AbstractReportGenerator template method controls the flow. PDFReport, ExcelReport, and HTMLReport override format-specific rendering. New formats require only a new subclass.",
      code: `abstract class ReportGenerator {
  generate(data: Data) {
    const rows = this.fetchData(data);
    this.renderHeader();
    this.renderBody(rows);
    this.renderFooter();
    return this.export();
  }
}`,
    },
    {
      id: 4,
      title: "Authentication Flow",
      domain: "Security / Identity",
      description:
        "Authentication always follows: receive credentials → validate format → authenticate → create session → audit log. The authentication step differs for password, OAuth, SAML, and MFA.",
      whySingleton:
        "An AbstractAuthenticator template method enforces the sequence. PasswordAuth, OAuthAuth, and SAMLAuth override the authenticate() step. The audit and session logic is shared and cannot be bypassed.",
      code: `abstract class Authenticator {
  login(credentials: Credentials) {
    this.validateFormat(credentials);
    const user = this.authenticate(credentials); // abstract
    this.createSession(user);
    this.auditLog(user);
  }
}`,
    },
    {
      id: 5,
      title: "Test Framework Lifecycle",
      domain: "Testing / DevTools",
      description:
        "Test frameworks run: setUp → runTest → tearDown for each test. setUp and tearDown are hooks that test classes override to configure and clean up resources.",
      whySingleton:
        "The base TestCase class defines the lifecycle as a template method. Subclasses override setUp() and tearDown() hooks. The framework controls execution order and error handling.",
      code: `abstract class TestCase {
  run() {
    this.setUp();        // hook
    try { this.runTest(); }
    finally { this.tearDown(); }  // hook
  }
}`,
    },
    {
      id: 6,
      title: "Data Import/Export",
      domain: "Enterprise Integration",
      description:
        "Importing data from different sources (CSV, XML, JSON, API) follows: open source → read records → validate → map to domain model → persist. Only the reading and mapping differ.",
      whySingleton:
        "An AbstractDataImporter template method handles the workflow. CSVImporter, XMLImporter, and APIImporter override readRecords() and mapToDomain(). Validation and persistence are shared.",
      code: `abstract class DataImporter {
  importData(source: string) {
    this.open(source);
    const records = this.readRecords();
    const valid = this.validate(records);
    const entities = this.mapToDomain(valid);
    this.persist(entities);
    this.close();
  }
}`,
    },
    {
      id: 7,
      title: "Game AI Turn Processing",
      domain: "Game Development",
      description:
        "AI entities in a game all follow: perceive environment → evaluate options → decide action → execute action. The evaluation and decision logic differ by AI type (aggressive, defensive, balanced).",
      whySingleton:
        "An AbstractAI template method controls the turn. AggressiveAI, DefensiveAI override evaluateOptions() and decideAction(). The perception and execution framework is shared.",
      code: `abstract class GameAI {
  processTurn() {
    const state = this.perceive();
    const options = this.evaluateOptions(state);
    const action = this.decideAction(options);
    this.executeAction(action);
  }
}`,
    },
    {
      id: 8,
      title: "Compiler Pipeline",
      domain: "Programming Languages",
      description:
        "Compilers follow: lex → parse → analyze → optimize → generate code. Different target architectures override the code generation and optimization phases.",
      whySingleton:
        "An AbstractCompiler defines the pipeline as a template method. X86Compiler, ARMCompiler override optimize() and generateCode(). Lexing, parsing, and analysis are shared.",
      code: `abstract class Compiler {
  compile(source: string) {
    const tokens = this.lex(source);
    const ast = this.parse(tokens);
    this.analyze(ast);
    this.optimize(ast);
    return this.generateCode(ast);
  }
}`,
    },
    {
      id: 9,
      title: "Order Processing Workflow",
      domain: "E-commerce",
      description:
        "Order processing follows: validate order → check inventory → calculate pricing → process payment → fulfill → notify customer. Fulfillment differs for digital vs. physical goods.",
      whySingleton:
        "An AbstractOrderProcessor template method manages the flow. DigitalOrderProcessor and PhysicalOrderProcessor override the fulfillment step. Payment processing and notification are shared.",
      code: `abstract class OrderProcessor {
  process(order: Order) {
    this.validate(order);
    this.checkInventory(order);
    this.calculatePricing(order);
    this.processPayment(order);
    this.fulfill(order);    // abstract
    this.notifyCustomer(order);
  }
}`,
    },
    {
      id: 10,
      title: "Document Parsing",
      domain: "Content Management",
      description:
        "Document parsers for PDF, DOCX, and Markdown all follow: open file → extract text → identify structure → build AST → render output. Extraction and structure identification differ by format.",
      whySingleton:
        "An AbstractDocumentParser template method enforces the flow. PDFParser, DOCXParser, and MarkdownParser override extractText() and identifyStructure().",
      code: `abstract class DocumentParser {
  parse(file: File) {
    this.open(file);
    const text = this.extractText();
    const structure = this.identifyStructure(text);
    const ast = this.buildAST(structure);
    return this.render(ast);
  }
}`,
    },
    {
      id: 11,
      title: "CI/CD Pipeline Stages",
      domain: "DevOps",
      description:
        "CI/CD pipelines follow: checkout → build → test → deploy. Build and deploy steps differ by technology stack (Node.js, Java, Python) but the pipeline structure is the same.",
      whySingleton:
        "An AbstractPipeline template method manages the stages. NodePipeline, JavaPipeline override build() and deploy(). Checkout and test execution logic are shared.",
      code: `abstract class CIPipeline {
  run() {
    this.checkout();
    this.build();       // abstract
    this.runTests();
    this.deploy();      // abstract
    this.notifyHook();  // hook
  }
}`,
    },
    {
      id: 12,
      title: "Notification Delivery",
      domain: "Communication Platform",
      description:
        "Notifications follow: compose message → validate recipient → format for channel → deliver → track delivery. Formatting and delivery differ by channel (email, SMS, push, Slack).",
      whySingleton:
        "An AbstractNotifier template method controls delivery. EmailNotifier, SMSNotifier, and PushNotifier override formatMessage() and deliver(). Validation and tracking are shared.",
      code: `abstract class Notifier {
  send(message: Message, recipient: Recipient) {
    this.compose(message);
    this.validateRecipient(recipient);
    const formatted = this.formatMessage(message);
    this.deliver(formatted, recipient);
    this.trackDelivery(recipient);
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Trade Settlement Pipeline",
      domain: "Fintech",
      problem:
        "A brokerage processes settlements for equities, bonds, and derivatives. Each follows the same flow — validate, calculate fees, execute, confirm, notify — but fee calculations, settlement execution, and confirmation formats differ by asset class. Duplicating the pipeline per asset leads to inconsistency.",
      solution:
        "An abstract TradeSettlement class defines the pipeline as a template method. Subclasses override calculateFees(), executeSettlement(), and generateConfirmation() while the base class enforces the flow and handles shared steps like validation and notification.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .te-box { rx:6; }
    .te-title { font: bold 10px 'JetBrains Mono', monospace; }
    .te-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="120" y="5" width="240" height="70" class="te-box te-diagram-box"/>
  <text x="240" y="20" text-anchor="middle" class="te-title te-diagram-title">TradeSettlement</text>
  <line x1="120" y1="24" x2="360" y2="24" class="te-diagram-line"/>
  <text x="128" y="38" class="te-member te-diagram-member">+settle(trade): Result</text>
  <text x="128" y="50" class="te-member te-diagram-member">#calculateFees(trade)*</text>
  <text x="128" y="62" class="te-member te-diagram-member">#executeSettlement(trade)*</text>
  <text x="128" y="74" class="te-member te-diagram-member">#postSettlementHook()</text>
  <rect x="20" y="120" width="160" height="50" class="te-box te-diagram-box"/>
  <text x="100" y="138" text-anchor="middle" class="te-title te-diagram-title">EquitySettlement</text>
  <line x1="20" y1="142" x2="180" y2="142" class="te-diagram-line"/>
  <text x="28" y="158" class="te-member te-diagram-member">#calculateFees() #execute()</text>
  <rect x="290" y="120" width="160" height="50" class="te-box te-diagram-box"/>
  <text x="370" y="138" text-anchor="middle" class="te-title te-diagram-title">BondSettlement</text>
  <line x1="290" y1="142" x2="450" y2="142" class="te-diagram-line"/>
  <text x="298" y="158" class="te-member te-diagram-member">#calculateFees() #execute()</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Trade:
    trade_id: str
    asset_type: str
    symbol: str
    quantity: int
    price: float
    counterparty: str

class TradeSettlement(ABC):
    """Template: defines the settlement pipeline."""
    def settle(self, trade: Trade) -> dict:
        self.validate(trade)
        fees = self.calculate_fees(trade)
        result = self.execute_settlement(trade, fees)
        confirmation = self.generate_confirmation(trade, result)
        self.notify_parties(trade, confirmation)
        self.post_settlement_hook(trade)
        return result

    def validate(self, trade: Trade):
        if trade.quantity <= 0 or trade.price <= 0:
            raise ValueError("Invalid trade.")
        print(f"[{trade.trade_id}] Validation passed.")

    @abstractmethod
    def calculate_fees(self, trade: Trade) -> float: ...
    @abstractmethod
    def execute_settlement(self, trade: Trade, fees: float) -> dict: ...
    @abstractmethod
    def generate_confirmation(self, trade: Trade, result: dict) -> str: ...

    def notify_parties(self, trade: Trade, conf: str):
        print(f"[{trade.trade_id}] Notified {trade.counterparty}.")

    def post_settlement_hook(self, trade: Trade):
        pass  # hook — optional override

class EquitySettlement(TradeSettlement):
    def calculate_fees(self, t):
        fee = t.quantity * t.price * 0.001
        print(f"[{t.trade_id}] Equity fee: \${fee:.2f}")
        return fee

    def execute_settlement(self, t, fees):
        net = t.quantity * t.price - fees
        return {"net_amount": net}

    def generate_confirmation(self, t, result):
        return f"EQUITY CONFIRM: {t.symbol} x{t.quantity} @ \${t.price}"

class BondSettlement(TradeSettlement):
    def calculate_fees(self, t):
        return t.quantity * t.price * 0.0005

    def execute_settlement(self, t, fees):
        accrued = t.quantity * t.price * 0.02
        return {"net_amount": t.quantity * t.price + accrued - fees}

    def generate_confirmation(self, t, result):
        return f"BOND CONFIRM: {t.symbol} x{t.quantity}"

    def post_settlement_hook(self, t):
        print(f"[{t.trade_id}] Updating coupon schedule.")

eq = Trade("EQ-001", "equity", "AAPL", 100, 175.50, "Goldman Sachs")
EquitySettlement().settle(eq)`,
        Go: `package main

import "fmt"

type Trade struct {
	TradeID, Symbol, Counterparty string
	Quantity int
	Price    float64
}

type SettlementSteps interface {
	CalculateFees(t Trade) float64
	ExecuteSettlement(t Trade, fees float64) map[string]interface{}
	GenerateConfirmation(t Trade, result map[string]interface{}) string
	PostSettlementHook(t Trade)
}

// Template function — controls the algorithm
func Settle(s SettlementSteps, t Trade) map[string]interface{} {
	if t.Quantity <= 0 || t.Price <= 0 {
		panic("Invalid trade.")
	}
	fmt.Printf("[%s] Validation passed.\\n", t.TradeID)
	fees := s.CalculateFees(t)
	result := s.ExecuteSettlement(t, fees)
	conf := s.GenerateConfirmation(t, result)
	fmt.Printf("[%s] Confirmation: %s\\n", t.TradeID, conf)
	s.PostSettlementHook(t)
	return result
}

type EquitySettlement struct{}
func (e EquitySettlement) CalculateFees(t Trade) float64 {
	return float64(t.Quantity) * t.Price * 0.001
}
func (e EquitySettlement) ExecuteSettlement(t Trade, fees float64) map[string]interface{} {
	return map[string]interface{}{"net": float64(t.Quantity)*t.Price - fees}
}
func (e EquitySettlement) GenerateConfirmation(t Trade, r map[string]interface{}) string {
	return fmt.Sprintf("EQUITY: %s x%d", t.Symbol, t.Quantity)
}
func (e EquitySettlement) PostSettlementHook(t Trade) {}

func main() {
	eq := Trade{"EQ-001", "AAPL", "Goldman", 100, 175.50}
	Settle(EquitySettlement{}, eq)
}`,
        Java: `abstract class TradeSettlement {
    // Template method — final to prevent override
    public final Map<String, Object> settle(Trade trade) {
        validate(trade);
        double fees = calculateFees(trade);
        Map<String, Object> result = executeSettlement(trade, fees);
        String conf = generateConfirmation(trade, result);
        notifyParties(trade, conf);
        postSettlementHook(trade);
        return result;
    }

    private void validate(Trade t) {
        if (t.quantity <= 0 || t.price <= 0)
            throw new IllegalArgumentException("Invalid trade.");
    }

    protected abstract double calculateFees(Trade t);
    protected abstract Map<String, Object> executeSettlement(Trade t, double fees);
    protected abstract String generateConfirmation(Trade t, Map<String, Object> r);

    protected void notifyParties(Trade t, String conf) {
        System.out.printf("[%s] Notified %s.%n", t.tradeId, t.counterparty);
    }
    protected void postSettlementHook(Trade t) { /* no-op */ }
}

class EquitySettlement extends TradeSettlement {
    protected double calculateFees(Trade t) {
        return t.quantity * t.price * 0.001;
    }
    protected Map<String, Object> executeSettlement(Trade t, double fees) {
        return Map.of("net", t.quantity * t.price - fees);
    }
    protected String generateConfirmation(Trade t, Map<String, Object> r) {
        return String.format("EQUITY: %s x%d", t.symbol, t.quantity);
    }
}`,
        TypeScript: `interface Trade {
  tradeId: string; symbol: string; quantity: number;
  price: number; counterparty: string;
}

abstract class TradeSettlement {
  // Template method
  settle(trade: Trade): Record<string, any> {
    this.validate(trade);
    const fees = this.calculateFees(trade);
    const result = this.executeSettlement(trade, fees);
    this.generateConfirmation(trade, result);
    this.notifyParties(trade);
    this.postSettlementHook(trade);
    return result;
  }

  private validate(t: Trade) {
    if (t.quantity <= 0 || t.price <= 0) throw new Error("Invalid trade.");
  }

  protected abstract calculateFees(t: Trade): number;
  protected abstract executeSettlement(t: Trade, fees: number): Record<string, any>;
  protected abstract generateConfirmation(t: Trade, r: Record<string, any>): string;

  protected notifyParties(t: Trade) {
    console.log(\`[\${t.tradeId}] Notified \${t.counterparty}.\`);
  }
  protected postSettlementHook(t: Trade) { /* hook */ }
}

class EquitySettlement extends TradeSettlement {
  protected calculateFees(t: Trade) { return t.quantity * t.price * 0.001; }
  protected executeSettlement(t: Trade, fees: number) {
    return { net: t.quantity * t.price - fees };
  }
  protected generateConfirmation(t: Trade, r: Record<string, any>) {
    return \`EQUITY: \${t.symbol} x\${t.quantity}\`;
  }
}

new EquitySettlement().settle({
  tradeId: "EQ-001", symbol: "AAPL", quantity: 100, price: 175.50, counterparty: "Goldman"
});`,
        Rust: `trait SettlementSteps {
    fn calculate_fees(&self, trade: &Trade) -> f64;
    fn execute_settlement(&self, trade: &Trade, fees: f64) -> Settlement;
    fn generate_confirmation(&self, trade: &Trade, result: &Settlement) -> String;
    fn post_settlement_hook(&self, _trade: &Trade) {}

    // Template method
    fn settle(&self, trade: &Trade) -> Settlement {
        assert!(trade.quantity > 0 && trade.price > 0.0);
        let fees = self.calculate_fees(trade);
        let result = self.execute_settlement(trade, fees);
        let conf = self.generate_confirmation(trade, &result);
        println!("[{}] {}", trade.trade_id, conf);
        self.post_settlement_hook(trade);
        result
    }
}

struct Trade { trade_id: String, symbol: String, quantity: i32, price: f64 }
struct Settlement { net_amount: f64 }

struct EquitySettlement;
impl SettlementSteps for EquitySettlement {
    fn calculate_fees(&self, t: &Trade) -> f64 { t.quantity as f64 * t.price * 0.001 }
    fn execute_settlement(&self, t: &Trade, fees: f64) -> Settlement {
        Settlement { net_amount: t.quantity as f64 * t.price - fees }
    }
    fn generate_confirmation(&self, t: &Trade, _r: &Settlement) -> String {
        format!("EQUITY: {} x{}", t.symbol, t.quantity)
    }
}`,
      },
      considerations: [
        "The template method is final/non-overridable to enforce the algorithm structure",
        "Shared validation and notification are concrete methods in the base class",
        "Asset-specific fee calculation and execution are abstract methods",
        "post_settlement_hook is a hook with a no-op default — BondSettlement overrides it for coupon schedule updates",
        "Adding a new asset class (e.g., DerivativeSettlement) requires only a new subclass",
      ],
    },
    {
      id: 2,
      title: "Clinical Data Pipeline",
      domain: "Healthcare",
      problem:
        "A hospital processes clinical data from multiple sources — HL7 feeds, FHIR APIs, and CSV lab imports. Each follows the same pipeline: connect → extract → validate → transform to internal format → load into EHR. The connection, extraction, and transformation differ by source, leading to duplicated pipeline code.",
      solution:
        "An abstract ClinicalDataPipeline defines the template method. HL7Pipeline, FHIRPipeline, and CSVLabPipeline override the variable steps. Error handling and audit logging are shared in the base class.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .te-box { rx:6; }
    .te-title { font: bold 10px 'JetBrains Mono', monospace; }
    .te-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="100" y="5" width="260" height="70" class="te-box te-diagram-box"/>
  <text x="230" y="20" text-anchor="middle" class="te-title te-diagram-title">ClinicalDataPipeline</text>
  <line x1="100" y1="24" x2="360" y2="24" class="te-diagram-line"/>
  <text x="108" y="38" class="te-member te-diagram-member">+run(): Result</text>
  <text x="108" y="50" class="te-member te-diagram-member">#connect()*  #extract()*</text>
  <text x="108" y="62" class="te-member te-diagram-member">#transform()*  #validate()</text>
  <rect x="10" y="120" width="140" height="45" class="te-box te-diagram-box"/>
  <text x="80" y="138" text-anchor="middle" class="te-title te-diagram-title">HL7Pipeline</text>
  <rect x="170" y="120" width="140" height="45" class="te-box te-diagram-box"/>
  <text x="240" y="138" text-anchor="middle" class="te-title te-diagram-title">FHIRPipeline</text>
  <rect x="330" y="120" width="140" height="45" class="te-box te-diagram-box"/>
  <text x="400" y="138" text-anchor="middle" class="te-title te-diagram-title">CSVLabPipeline</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class ClinicalRecord:
    patient_id: str
    record_type: str
    data: dict

class ClinicalDataPipeline(ABC):
    """Template: clinical data ingestion pipeline."""
    def run(self, source: str) -> list[ClinicalRecord]:
        self.connect(source)
        raw = self.extract()
        validated = self.validate(raw)
        records = self.transform(validated)
        self.load(records)
        self.audit_log(source, len(records))
        self.post_load_hook(records)
        return records

    @abstractmethod
    def connect(self, source: str): ...
    @abstractmethod
    def extract(self) -> list[dict]: ...
    @abstractmethod
    def transform(self, data: list[dict]) -> list[ClinicalRecord]: ...

    def validate(self, data: list[dict]) -> list[dict]:
        return [d for d in data if "patient_id" in d]

    def load(self, records: list[ClinicalRecord]):
        for r in records:
            print(f"Loaded: {r.patient_id} - {r.record_type}")

    def audit_log(self, source: str, count: int):
        print(f"AUDIT: Ingested {count} records from {source}")

    def post_load_hook(self, records: list[ClinicalRecord]):
        pass  # hook

class FHIRPipeline(ClinicalDataPipeline):
    def connect(self, source):
        print(f"Connecting to FHIR endpoint: {source}")
        self.endpoint = source

    def extract(self):
        return [{"patient_id": "P-001", "resourceType": "Observation", "value": "120/80"}]

    def transform(self, data):
        return [ClinicalRecord(d["patient_id"], d["resourceType"], d) for d in data]

FHIRPipeline().run("https://fhir.hospital.org/api")`,
        Go: `package main

import "fmt"

type ClinicalRecord struct {
	PatientID, RecordType string
	Data                  map[string]string
}

type PipelineSteps interface {
	Connect(source string)
	Extract() []map[string]string
	Transform(data []map[string]string) []ClinicalRecord
	PostLoadHook(records []ClinicalRecord)
}

func RunPipeline(s PipelineSteps, source string) []ClinicalRecord {
	s.Connect(source)
	raw := s.Extract()
	// validate
	valid := make([]map[string]string, 0)
	for _, d := range raw {
		if _, ok := d["patient_id"]; ok { valid = append(valid, d) }
	}
	records := s.Transform(valid)
	for _, r := range records {
		fmt.Printf("Loaded: %s - %s\\n", r.PatientID, r.RecordType)
	}
	s.PostLoadHook(records)
	return records
}

type FHIRPipeline struct{ Endpoint string }
func (f *FHIRPipeline) Connect(source string) { f.Endpoint = source }
func (f *FHIRPipeline) Extract() []map[string]string {
	return []map[string]string{{"patient_id": "P-001", "type": "Observation"}}
}
func (f *FHIRPipeline) Transform(data []map[string]string) []ClinicalRecord {
	out := make([]ClinicalRecord, len(data))
	for i, d := range data { out[i] = ClinicalRecord{d["patient_id"], d["type"], d} }
	return out
}
func (f *FHIRPipeline) PostLoadHook(records []ClinicalRecord) {}

func main() { RunPipeline(&FHIRPipeline{}, "https://fhir.hospital.org/api") }`,
        Java: `abstract class ClinicalDataPipeline {
    public final List<ClinicalRecord> run(String source) {
        connect(source);
        List<Map<String, String>> raw = extract();
        List<Map<String, String>> valid = validate(raw);
        List<ClinicalRecord> records = transform(valid);
        load(records);
        auditLog(source, records.size());
        postLoadHook(records);
        return records;
    }

    protected abstract void connect(String source);
    protected abstract List<Map<String, String>> extract();
    protected abstract List<ClinicalRecord> transform(List<Map<String, String>> data);

    protected List<Map<String, String>> validate(List<Map<String, String>> data) {
        return data.stream().filter(d -> d.containsKey("patient_id")).toList();
    }
    protected void load(List<ClinicalRecord> records) {
        records.forEach(r -> System.out.printf("Loaded: %s%n", r.patientId()));
    }
    protected void auditLog(String source, int count) {
        System.out.printf("AUDIT: %d records from %s%n", count, source);
    }
    protected void postLoadHook(List<ClinicalRecord> records) { }
}

class FHIRPipeline extends ClinicalDataPipeline {
    private String endpoint;
    protected void connect(String source) { this.endpoint = source; }
    protected List<Map<String, String>> extract() {
        return List.of(Map.of("patient_id", "P-001", "type", "Observation"));
    }
    protected List<ClinicalRecord> transform(List<Map<String, String>> data) {
        return data.stream().map(d -> new ClinicalRecord(d.get("patient_id"), d.get("type"))).toList();
    }
}`,
        TypeScript: `interface ClinicalRecord {
  patientId: string;
  recordType: string;
  data: Record<string, string>;
}

abstract class ClinicalDataPipeline {
  run(source: string): ClinicalRecord[] {
    this.connect(source);
    const raw = this.extract();
    const valid = this.validate(raw);
    const records = this.transform(valid);
    this.load(records);
    this.postLoadHook(records);
    return records;
  }

  protected abstract connect(source: string): void;
  protected abstract extract(): Record<string, string>[];
  protected abstract transform(data: Record<string, string>[]): ClinicalRecord[];

  protected validate(data: Record<string, string>[]) {
    return data.filter(d => "patientId" in d);
  }
  protected load(records: ClinicalRecord[]) {
    records.forEach(r => console.log(\`Loaded: \${r.patientId}\`));
  }
  protected postLoadHook(records: ClinicalRecord[]) {}
}

class FHIRPipeline extends ClinicalDataPipeline {
  private endpoint = "";
  protected connect(source: string) { this.endpoint = source; }
  protected extract() {
    return [{ patientId: "P-001", type: "Observation", value: "120/80" }];
  }
  protected transform(data: Record<string, string>[]) {
    return data.map(d => ({ patientId: d.patientId, recordType: d.type, data: d }));
  }
}

new FHIRPipeline().run("https://fhir.hospital.org/api");`,
        Rust: `trait PipelineSteps {
    fn connect(&mut self, source: &str);
    fn extract(&self) -> Vec<std::collections::HashMap<String, String>>;
    fn transform(&self, data: Vec<std::collections::HashMap<String, String>>) -> Vec<ClinicalRecord>;
    fn post_load_hook(&self, _records: &[ClinicalRecord]) {}

    fn run(&mut self, source: &str) -> Vec<ClinicalRecord> {
        self.connect(source);
        let raw = self.extract();
        let valid: Vec<_> = raw.into_iter().filter(|d| d.contains_key("patient_id")).collect();
        let records = self.transform(valid);
        for r in &records { println!("Loaded: {} - {}", r.patient_id, r.record_type); }
        self.post_load_hook(&records);
        records
    }
}

struct ClinicalRecord { patient_id: String, record_type: String }

struct FHIRPipeline { endpoint: String }
impl PipelineSteps for FHIRPipeline {
    fn connect(&mut self, source: &str) { self.endpoint = source.to_string(); }
    fn extract(&self) -> Vec<std::collections::HashMap<String, String>> {
        let mut m = std::collections::HashMap::new();
        m.insert("patient_id".into(), "P-001".into());
        m.insert("type".into(), "Observation".into());
        vec![m]
    }
    fn transform(&self, data: Vec<std::collections::HashMap<String, String>>) -> Vec<ClinicalRecord> {
        data.into_iter().map(|d| ClinicalRecord {
            patient_id: d["patient_id"].clone(),
            record_type: d["type"].clone(),
        }).collect()
    }
}`,
      },
      considerations: [
        "Validation is a shared concrete method — all pipelines validate for patient_id presence",
        "Hook method post_load_hook allows subclasses to add post-processing without altering the pipeline",
        "Audit logging is invariant — every pipeline logs source and record count identically",
        "Error handling should be added in the template method for production use",
      ],
    },
    {
      id: 3,
      title: "Report Generation Framework",
      domain: "Enterprise SaaS",
      problem:
        "A business intelligence platform generates reports in PDF, Excel, and HTML. Each format requires different rendering but the data fetching, header/footer, and export flow are identical. Copy-pasting the pipeline for each format leads to divergent behavior.",
      solution:
        "An abstract ReportGenerator defines the template method. PDFReport, ExcelReport, and HTMLReport override renderHeader(), renderBody(), and exportFile(). Data fetching and quality checks are shared.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .te-box { rx:6; }
    .te-title { font: bold 10px 'JetBrains Mono', monospace; }
    .te-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="5" width="220" height="65" class="te-box te-diagram-box"/>
  <text x="240" y="20" text-anchor="middle" class="te-title te-diagram-title">ReportGenerator</text>
  <line x1="130" y1="24" x2="350" y2="24" class="te-diagram-line"/>
  <text x="138" y="38" class="te-member te-diagram-member">+generate(query): File</text>
  <text x="138" y="50" class="te-member te-diagram-member">#renderHeader()* #renderBody()*</text>
  <text x="138" y="62" class="te-member te-diagram-member">#exportFile()* #postExportHook()</text>
  <rect x="10" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="75" y="145" text-anchor="middle" class="te-title te-diagram-title">PDFReport</text>
  <rect x="170" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="235" y="145" text-anchor="middle" class="te-title te-diagram-title">ExcelReport</text>
  <rect x="330" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="395" y="145" text-anchor="middle" class="te-title te-diagram-title">HTMLReport</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class ReportGenerator(ABC):
    def generate(self, query: str) -> str:
        data = self.fetch_data(query)
        self.validate_data(data)
        header = self.render_header(data)
        body = self.render_body(data)
        footer = self.render_footer(data)
        output = self.export_file(header, body, footer)
        self.post_export_hook(output)
        return output

    def fetch_data(self, query: str) -> list[dict]:
        print(f"Fetching data for: {query}")
        return [{"metric": "Revenue", "value": 1_250_000}]

    def validate_data(self, data: list[dict]):
        if not data: raise ValueError("No data returned.")

    @abstractmethod
    def render_header(self, data: list[dict]) -> str: ...
    @abstractmethod
    def render_body(self, data: list[dict]) -> str: ...
    @abstractmethod
    def export_file(self, header: str, body: str, footer: str) -> str: ...

    def render_footer(self, data: list[dict]) -> str:
        return f"Generated | {len(data)} records"

    def post_export_hook(self, output: str):
        pass

class PDFReport(ReportGenerator):
    def render_header(self, data): return "=== PDF REPORT ==="
    def render_body(self, data):
        return "\\n".join(f"{d['metric']}: {d['value']}" for d in data)
    def export_file(self, h, b, f): return f"{h}\\n{b}\\n{f}"

class HTMLReport(ReportGenerator):
    def render_header(self, data): return "<html><body><h1>Report</h1>"
    def render_body(self, data):
        rows = "".join(f"<tr><td>{d['metric']}</td><td>{d['value']}</td></tr>" for d in data)
        return f"<table>{rows}</table>"
    def export_file(self, h, b, f): return f"{h}{b}<footer>{f}</footer></body></html>"

print(PDFReport().generate("Q4 Revenue"))`,
        Go: `package main

import "fmt"

type ReportSteps interface {
	RenderHeader(data []map[string]interface{}) string
	RenderBody(data []map[string]interface{}) string
	ExportFile(header, body, footer string) string
	PostExportHook(output string)
}

func GenerateReport(s ReportSteps, query string) string {
	data := []map[string]interface{}{{"metric": "Revenue", "value": 1250000}}
	fmt.Printf("Fetching: %s\\n", query)
	header := s.RenderHeader(data)
	body := s.RenderBody(data)
	footer := fmt.Sprintf("Generated | %d records", len(data))
	output := s.ExportFile(header, body, footer)
	s.PostExportHook(output)
	return output
}

type PDFReport struct{}
func (p PDFReport) RenderHeader(d []map[string]interface{}) string { return "=== PDF ===" }
func (p PDFReport) RenderBody(d []map[string]interface{}) string {
	return fmt.Sprintf("%v: %v", d[0]["metric"], d[0]["value"])
}
func (p PDFReport) ExportFile(h, b, f string) string { return h + "\\n" + b + "\\n" + f }
func (p PDFReport) PostExportHook(output string) {}

func main() { fmt.Println(GenerateReport(PDFReport{}, "Q4 Revenue")) }`,
        Java: `abstract class ReportGenerator {
    public final String generate(String query) {
        List<Map<String, Object>> data = fetchData(query);
        validateData(data);
        String header = renderHeader(data);
        String body = renderBody(data);
        String footer = renderFooter(data);
        String output = exportFile(header, body, footer);
        postExportHook(output);
        return output;
    }

    private List<Map<String, Object>> fetchData(String query) {
        return List.of(Map.of("metric", "Revenue", "value", 1_250_000));
    }
    private void validateData(List<Map<String, Object>> data) {
        if (data.isEmpty()) throw new IllegalStateException("No data.");
    }

    protected abstract String renderHeader(List<Map<String, Object>> data);
    protected abstract String renderBody(List<Map<String, Object>> data);
    protected abstract String exportFile(String header, String body, String footer);

    protected String renderFooter(List<Map<String, Object>> data) {
        return "Generated | " + data.size() + " records";
    }
    protected void postExportHook(String output) { }
}

class PDFReport extends ReportGenerator {
    protected String renderHeader(List<Map<String, Object>> d) { return "=== PDF ==="; }
    protected String renderBody(List<Map<String, Object>> d) {
        return d.stream().map(m -> m.get("metric") + ": " + m.get("value")).collect(Collectors.joining("\\n"));
    }
    protected String exportFile(String h, String b, String f) { return h + "\\n" + b + "\\n" + f; }
}`,
        TypeScript: `abstract class ReportGenerator {
  generate(query: string): string {
    const data = this.fetchData(query);
    this.validateData(data);
    const header = this.renderHeader(data);
    const body = this.renderBody(data);
    const footer = this.renderFooter(data);
    const output = this.exportFile(header, body, footer);
    this.postExportHook(output);
    return output;
  }

  private fetchData(query: string): Record<string, unknown>[] {
    return [{ metric: "Revenue", value: 1_250_000 }];
  }
  private validateData(data: Record<string, unknown>[]) {
    if (!data.length) throw new Error("No data.");
  }

  protected abstract renderHeader(data: Record<string, unknown>[]): string;
  protected abstract renderBody(data: Record<string, unknown>[]): string;
  protected abstract exportFile(h: string, b: string, f: string): string;

  protected renderFooter(data: Record<string, unknown>[]) {
    return \`Generated | \${data.length} records\`;
  }
  protected postExportHook(output: string) {}
}

class PDFReport extends ReportGenerator {
  protected renderHeader() { return "=== PDF ==="; }
  protected renderBody(d: Record<string, unknown>[]) {
    return d.map(r => \`\${r.metric}: \${r.value}\`).join("\\n");
  }
  protected exportFile(h: string, b: string, f: string) {
    return \`\${h}\\n\${b}\\n\${f}\`;
  }
}

console.log(new PDFReport().generate("Q4 Revenue"));`,
        Rust: `trait ReportSteps {
    fn render_header(&self, data: &[(&str, i64)]) -> String;
    fn render_body(&self, data: &[(&str, i64)]) -> String;
    fn export_file(&self, header: &str, body: &str, footer: &str) -> String;
    fn post_export_hook(&self, _output: &str) {}

    fn generate(&self, query: &str) -> String {
        let data = vec![("Revenue", 1_250_000i64)];
        println!("Fetching: {}", query);
        let header = self.render_header(&data);
        let body = self.render_body(&data);
        let footer = format!("Generated | {} records", data.len());
        let output = self.export_file(&header, &body, &footer);
        self.post_export_hook(&output);
        output
    }
}

struct PDFReport;
impl ReportSteps for PDFReport {
    fn render_header(&self, _d: &[(&str, i64)]) -> String { "=== PDF ===".into() }
    fn render_body(&self, d: &[(&str, i64)]) -> String {
        d.iter().map(|(m, v)| format!("{}: {}", m, v)).collect::<Vec<_>>().join("\\n")
    }
    fn export_file(&self, h: &str, b: &str, f: &str) -> String {
        format!("{}\\n{}\\n{}", h, b, f)
    }
}

fn main() { println!("{}", PDFReport.generate("Q4 Revenue")); }`,
      },
      considerations: [
        "Data fetching and validation are invariant — shared in the base class",
        "renderFooter has a sensible default that subclasses may override",
        "postExportHook allows optional post-processing (e.g., upload to S3, send email)",
        "Adding a new format (CSV, Markdown) requires only a new subclass",
      ],
    },
    {
      id: 4,
      title: "Authentication Workflow",
      domain: "Security / Identity",
      problem:
        "A platform supports multiple authentication methods: password, OAuth, SAML, and MFA. Each follows the same sequence — validate input, authenticate, create session, audit — but the core authentication step is completely different for each method. Adding new auth methods keeps growing the if/else chain.",
      solution:
        "An abstract Authenticator defines the template method. PasswordAuth, OAuthAuth, and SAMLAuth override the authenticate() step. Session creation and audit logging are shared and mandatory.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .te-box { rx:6; }
    .te-title { font: bold 10px 'JetBrains Mono', monospace; }
    .te-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="5" width="220" height="65" class="te-box te-diagram-box"/>
  <text x="240" y="20" text-anchor="middle" class="te-title te-diagram-title">Authenticator</text>
  <line x1="130" y1="24" x2="350" y2="24" class="te-diagram-line"/>
  <text x="138" y="38" class="te-member te-diagram-member">+login(creds): Session</text>
  <text x="138" y="50" class="te-member te-diagram-member">#authenticate(creds)*</text>
  <text x="138" y="62" class="te-member te-diagram-member">#createSession() #auditLog()</text>
  <rect x="10" y="120" width="140" height="40" class="te-box te-diagram-box"/>
  <text x="80" y="145" text-anchor="middle" class="te-title te-diagram-title">PasswordAuth</text>
  <rect x="170" y="120" width="140" height="40" class="te-box te-diagram-box"/>
  <text x="240" y="145" text-anchor="middle" class="te-title te-diagram-title">OAuthAuth</text>
  <rect x="330" y="120" width="140" height="40" class="te-box te-diagram-box"/>
  <text x="400" y="145" text-anchor="middle" class="te-title te-diagram-title">SAMLAuth</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
import hashlib, secrets

@dataclass
class Session:
    user_id: str
    token: str
    created_at: str

class Authenticator(ABC):
    """Template: authentication workflow."""
    def login(self, credentials: dict) -> Session:
        self.validate_input(credentials)
        user = self.authenticate(credentials)
        session = self.create_session(user)
        self.audit_log(user, "LOGIN_SUCCESS")
        self.post_login_hook(user, session)
        return session

    def validate_input(self, creds: dict):
        if not creds: raise ValueError("Empty credentials.")

    @abstractmethod
    def authenticate(self, credentials: dict) -> dict: ...

    def create_session(self, user: dict) -> Session:
        return Session(user["id"], secrets.token_hex(32), datetime.now().isoformat())

    def audit_log(self, user: dict, event: str):
        print(f"AUDIT [{event}]: user={user['id']}")

    def post_login_hook(self, user: dict, session: Session):
        pass

class PasswordAuth(Authenticator):
    USERS = {"alice": {"id": "U-001", "hash": hashlib.sha256(b"secret").hexdigest()}}

    def authenticate(self, creds):
        user = self.USERS.get(creds.get("username"))
        if not user: raise ValueError("User not found.")
        if hashlib.sha256(creds["password"].encode()).hexdigest() != user["hash"]:
            raise ValueError("Wrong password.")
        return user

class OAuthAuth(Authenticator):
    def authenticate(self, creds):
        token = creds.get("oauth_token")
        if not token: raise ValueError("Missing OAuth token.")
        print(f"Validating OAuth token with provider...")
        return {"id": "U-OAUTH-001", "provider": "google"}

    def post_login_hook(self, user, session):
        print(f"OAuth: Linked provider={user.get('provider')}")

session = PasswordAuth().login({"username": "alice", "password": "secret"})
print(f"Session: {session.token[:16]}...")`,
        Go: `package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

type Session struct{ UserID, Token string }

type AuthSteps interface {
	Authenticate(creds map[string]string) (map[string]string, error)
	PostLoginHook(user map[string]string, session Session)
}

func Login(a AuthSteps, creds map[string]string) (*Session, error) {
	if len(creds) == 0 { return nil, fmt.Errorf("empty credentials") }
	user, err := a.Authenticate(creds)
	if err != nil { return nil, err }
	token := make([]byte, 32)
	rand.Read(token)
	session := Session{user["id"], hex.EncodeToString(token)}
	fmt.Printf("AUDIT [LOGIN]: user=%s\\n", user["id"])
	a.PostLoginHook(user, session)
	return &session, nil
}

type PasswordAuth struct{}
func (p PasswordAuth) Authenticate(creds map[string]string) (map[string]string, error) {
	if creds["username"] == "alice" && creds["password"] == "secret" {
		return map[string]string{"id": "U-001"}, nil
	}
	return nil, fmt.Errorf("auth failed")
}
func (p PasswordAuth) PostLoginHook(user map[string]string, s Session) {}

func main() {
	session, _ := Login(PasswordAuth{}, map[string]string{"username": "alice", "password": "secret"})
	fmt.Printf("Session: %s...\\n", session.Token[:16])
}`,
        Java: `abstract class Authenticator {
    public final Session login(Map<String, String> credentials) {
        validateInput(credentials);
        Map<String, String> user = authenticate(credentials);
        Session session = createSession(user);
        auditLog(user.get("id"), "LOGIN_SUCCESS");
        postLoginHook(user, session);
        return session;
    }

    private void validateInput(Map<String, String> creds) {
        if (creds == null || creds.isEmpty())
            throw new IllegalArgumentException("Empty credentials.");
    }

    protected abstract Map<String, String> authenticate(Map<String, String> credentials);

    private Session createSession(Map<String, String> user) {
        return new Session(user.get("id"), UUID.randomUUID().toString());
    }

    private void auditLog(String userId, String event) {
        System.out.printf("AUDIT [%s]: user=%s%n", event, userId);
    }

    protected void postLoginHook(Map<String, String> user, Session session) { }
}

class PasswordAuth extends Authenticator {
    protected Map<String, String> authenticate(Map<String, String> creds) {
        if ("alice".equals(creds.get("username")) && "secret".equals(creds.get("password")))
            return Map.of("id", "U-001");
        throw new RuntimeException("Auth failed.");
    }
}`,
        TypeScript: `interface Session { userId: string; token: string; }

abstract class Authenticator {
  login(credentials: Record<string, string>): Session {
    this.validateInput(credentials);
    const user = this.authenticate(credentials);
    const session = this.createSession(user);
    this.auditLog(user.id, "LOGIN_SUCCESS");
    this.postLoginHook(user, session);
    return session;
  }

  private validateInput(creds: Record<string, string>) {
    if (!Object.keys(creds).length) throw new Error("Empty credentials.");
  }

  protected abstract authenticate(creds: Record<string, string>): { id: string; [k: string]: string };

  private createSession(user: { id: string }): Session {
    return { userId: user.id, token: crypto.randomUUID() };
  }

  private auditLog(userId: string, event: string) {
    console.log(\`AUDIT [\${event}]: user=\${userId}\`);
  }

  protected postLoginHook(user: { id: string }, session: Session) {}
}

class PasswordAuth extends Authenticator {
  protected authenticate(creds: Record<string, string>) {
    if (creds.username === "alice" && creds.password === "secret")
      return { id: "U-001" };
    throw new Error("Auth failed.");
  }
}

const session = new PasswordAuth().login({ username: "alice", password: "secret" });
console.log(\`Session: \${session.token.slice(0, 8)}...\`);`,
        Rust: `use std::collections::HashMap;

struct Session { user_id: String, token: String }

trait AuthSteps {
    fn authenticate(&self, creds: &HashMap<String, String>) -> Result<HashMap<String, String>, String>;
    fn post_login_hook(&self, _user: &HashMap<String, String>, _session: &Session) {}

    fn login(&self, creds: &HashMap<String, String>) -> Result<Session, String> {
        if creds.is_empty() { return Err("Empty credentials.".into()); }
        let user = self.authenticate(creds)?;
        let session = Session {
            user_id: user["id"].clone(),
            token: format!("{:x}", rand::random::<u128>()),
        };
        println!("AUDIT [LOGIN]: user={}", user["id"]);
        self.post_login_hook(&user, &session);
        Ok(session)
    }
}

struct PasswordAuth;
impl AuthSteps for PasswordAuth {
    fn authenticate(&self, creds: &HashMap<String, String>) -> Result<HashMap<String, String>, String> {
        if creds.get("username").map(|u| u == "alice").unwrap_or(false)
            && creds.get("password").map(|p| p == "secret").unwrap_or(false) {
            let mut user = HashMap::new();
            user.insert("id".into(), "U-001".into());
            Ok(user)
        } else { Err("Auth failed.".into()) }
    }
}`,
      },
      considerations: [
        "Session creation and audit logging are invariant — shared across all auth methods",
        "The authenticate() step is the sole abstract method — each auth type implements it differently",
        "post_login_hook allows OAuth providers to link provider info without altering the flow",
        "The template method ensures audit logging cannot be bypassed by any auth implementation",
      ],
    },
    {
      id: 5,
      title: "Game Entity Update Loop",
      domain: "Game Development",
      problem:
        "A game engine updates entities each frame: process input, update physics, check collisions, render. Different entity types (Player, NPC, Projectile) have different input handling and rendering but share physics and collision logic. Duplicating the update loop per entity type leads to bugs.",
      solution:
        "An abstract GameEntity defines the update loop as a template method. Player, NPC, and Projectile override processInput() and render() while the base class handles physics and collision.",
      classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .te-box { rx:6; }
    .te-title { font: bold 10px 'JetBrains Mono', monospace; }
    .te-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="5" width="220" height="65" class="te-box te-diagram-box"/>
  <text x="240" y="20" text-anchor="middle" class="te-title te-diagram-title">GameEntity</text>
  <line x1="130" y1="24" x2="350" y2="24" class="te-diagram-line"/>
  <text x="138" y="38" class="te-member te-diagram-member">+update(dt): void</text>
  <text x="138" y="50" class="te-member te-diagram-member">#processInput()* #render()*</text>
  <text x="138" y="62" class="te-member te-diagram-member">#updatePhysics() #checkCollision()</text>
  <rect x="10" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="75" y="145" text-anchor="middle" class="te-title te-diagram-title">Player</text>
  <rect x="170" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="235" y="145" text-anchor="middle" class="te-title te-diagram-title">NPC</text>
  <rect x="330" y="120" width="130" height="40" class="te-box te-diagram-box"/>
  <text x="395" y="145" text-anchor="middle" class="te-title te-diagram-title">Projectile</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Vector2:
    x: float = 0.0
    y: float = 0.0

class GameEntity(ABC):
    def __init__(self, name: str):
        self.name = name
        self.position = Vector2()
        self.velocity = Vector2()
        self.alive = True

    def update(self, dt: float):
        """Template method — fixed update loop."""
        self.process_input(dt)
        self.update_physics(dt)
        self.check_collisions()
        self.render()
        self.post_update_hook(dt)

    @abstractmethod
    def process_input(self, dt: float): ...

    def update_physics(self, dt: float):
        self.position.x += self.velocity.x * dt
        self.position.y += self.velocity.y * dt

    def check_collisions(self):
        if self.position.x < 0 or self.position.x > 800:
            self.alive = False

    @abstractmethod
    def render(self): ...

    def post_update_hook(self, dt: float):
        pass

class Player(GameEntity):
    def process_input(self, dt):
        self.velocity.x = 100  # simplified: move right

    def render(self):
        print(f"[Player] {self.name} at ({self.position.x:.1f}, {self.position.y:.1f})")

class NPC(GameEntity):
    def process_input(self, dt):
        self.velocity.x = 50  # AI movement

    def render(self):
        print(f"[NPC] {self.name} at ({self.position.x:.1f}, {self.position.y:.1f})")

player = Player("Hero")
npc = NPC("Guard")
for _ in range(3):
    player.update(0.016)
    npc.update(0.016)`,
        Go: `package main

import "fmt"

type Vector2 struct{ X, Y float64 }

type EntitySteps interface {
	ProcessInput(dt float64, vel *Vector2)
	Render(name string, pos Vector2)
	PostUpdateHook(dt float64)
}

type GameEntity struct {
	Name     string
	Position Vector2
	Velocity Vector2
}

func (e *GameEntity) Update(dt float64, steps EntitySteps) {
	steps.ProcessInput(dt, &e.Velocity)
	e.Position.X += e.Velocity.X * dt
	e.Position.Y += e.Velocity.Y * dt
	steps.Render(e.Name, e.Position)
	steps.PostUpdateHook(dt)
}

type PlayerSteps struct{}
func (p PlayerSteps) ProcessInput(dt float64, v *Vector2) { v.X = 100 }
func (p PlayerSteps) Render(name string, pos Vector2) {
	fmt.Printf("[Player] %s at (%.1f, %.1f)\\n", name, pos.X, pos.Y)
}
func (p PlayerSteps) PostUpdateHook(dt float64) {}

func main() {
	player := &GameEntity{Name: "Hero"}
	for i := 0; i < 3; i++ { player.Update(0.016, PlayerSteps{}) }
}`,
        Java: `abstract class GameEntity {
    String name;
    double posX, posY, velX, velY;

    GameEntity(String name) { this.name = name; }

    public final void update(double dt) {
        processInput(dt);
        updatePhysics(dt);
        checkCollisions();
        render();
        postUpdateHook(dt);
    }

    protected abstract void processInput(double dt);
    protected abstract void render();

    private void updatePhysics(double dt) {
        posX += velX * dt;
        posY += velY * dt;
    }

    private void checkCollisions() {
        if (posX < 0 || posX > 800) System.out.println(name + " out of bounds!");
    }

    protected void postUpdateHook(double dt) { }
}

class Player extends GameEntity {
    Player(String name) { super(name); }
    protected void processInput(double dt) { velX = 100; }
    protected void render() {
        System.out.printf("[Player] %s at (%.1f, %.1f)%n", name, posX, posY);
    }
}`,
        TypeScript: `abstract class GameEntity {
  protected posX = 0; protected posY = 0;
  protected velX = 0; protected velY = 0;

  constructor(protected name: string) {}

  update(dt: number) {
    this.processInput(dt);
    this.updatePhysics(dt);
    this.checkCollisions();
    this.render();
    this.postUpdateHook(dt);
  }

  protected abstract processInput(dt: number): void;
  protected abstract render(): void;

  private updatePhysics(dt: number) {
    this.posX += this.velX * dt;
    this.posY += this.velY * dt;
  }

  private checkCollisions() {
    if (this.posX < 0 || this.posX > 800)
      console.log(\`\${this.name} out of bounds!\`);
  }

  protected postUpdateHook(dt: number) {}
}

class Player extends GameEntity {
  protected processInput(dt: number) { this.velX = 100; }
  protected render() {
    console.log(\`[Player] \${this.name} at (\${this.posX.toFixed(1)}, \${this.posY.toFixed(1)})\`);
  }
}

const player = new Player("Hero");
for (let i = 0; i < 3; i++) player.update(0.016);`,
        Rust: `trait EntitySteps {
    fn process_input(&self, dt: f64) -> (f64, f64); // returns velocity
    fn render(&self, name: &str, pos: (f64, f64));
    fn post_update_hook(&self, _dt: f64) {}
}

struct GameEntity { name: String, pos: (f64, f64), vel: (f64, f64) }

impl GameEntity {
    fn update(&mut self, dt: f64, steps: &dyn EntitySteps) {
        self.vel = steps.process_input(dt);
        self.pos.0 += self.vel.0 * dt;
        self.pos.1 += self.vel.1 * dt;
        if self.pos.0 < 0.0 || self.pos.0 > 800.0 {
            println!("{} out of bounds!", self.name);
        }
        steps.render(&self.name, self.pos);
        steps.post_update_hook(dt);
    }
}

struct PlayerSteps;
impl EntitySteps for PlayerSteps {
    fn process_input(&self, _dt: f64) -> (f64, f64) { (100.0, 0.0) }
    fn render(&self, name: &str, pos: (f64, f64)) {
        println!("[Player] {} at ({:.1}, {:.1})", name, pos.0, pos.1);
    }
}

fn main() {
    let mut player = GameEntity { name: "Hero".into(), pos: (0.0, 0.0), vel: (0.0, 0.0) };
    for _ in 0..3 { player.update(0.016, &PlayerSteps); }
}`,
      },
      considerations: [
        "Physics and collision detection are invariant — shared across all entity types",
        "processInput is abstract — Player reads keyboard input, NPC uses AI, Projectile follows trajectory",
        "post_update_hook allows entities to add custom logic (e.g., NPC decision-making)",
        "The fixed update order (input → physics → collision → render) prevents frame-dependent bugs",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Classic Inheritance",
      description:
        "The traditional approach: an abstract base class defines the template method as a concrete final method. Abstract methods are the extension points. Subclasses inherit and override. Best when the number of variants is moderate and the algorithm is well-defined.",
      code: {
        Python: `from abc import ABC, abstractmethod

class DataProcessor(ABC):
    def process(self, data: list) -> list:
        """Template method — final algorithm structure."""
        validated = self.validate(data)
        transformed = self.transform(validated)
        result = self.format_output(transformed)
        self.post_process_hook(result)
        return result

    @abstractmethod
    def validate(self, data: list) -> list: ...
    @abstractmethod
    def transform(self, data: list) -> list: ...
    @abstractmethod
    def format_output(self, data: list) -> list: ...
    def post_process_hook(self, result: list): pass  # hook

class CSVProcessor(DataProcessor):
    def validate(self, data): return [d for d in data if d.strip()]
    def transform(self, data): return [d.upper() for d in data]
    def format_output(self, data): return [f"ROW: {d}" for d in data]

print(CSVProcessor().process(["hello", "", "world"]))`,
        Go: `type ProcessorSteps interface {
	Validate(data []string) []string
	Transform(data []string) []string
	FormatOutput(data []string) []string
	PostProcessHook(result []string)
}

func Process(s ProcessorSteps, data []string) []string {
	validated := s.Validate(data)
	transformed := s.Transform(validated)
	result := s.FormatOutput(transformed)
	s.PostProcessHook(result)
	return result
}`,
        Java: `abstract class DataProcessor {
    public final List<String> process(List<String> data) {
        List<String> validated = validate(data);
        List<String> transformed = transform(validated);
        List<String> result = formatOutput(transformed);
        postProcessHook(result);
        return result;
    }

    protected abstract List<String> validate(List<String> data);
    protected abstract List<String> transform(List<String> data);
    protected abstract List<String> formatOutput(List<String> data);
    protected void postProcessHook(List<String> result) { }
}`,
        TypeScript: `abstract class DataProcessor {
  process(data: string[]): string[] {
    const validated = this.validate(data);
    const transformed = this.transform(validated);
    const result = this.formatOutput(transformed);
    this.postProcessHook(result);
    return result;
  }

  protected abstract validate(data: string[]): string[];
  protected abstract transform(data: string[]): string[];
  protected abstract formatOutput(data: string[]): string[];
  protected postProcessHook(result: string[]) {}
}`,
        Rust: `trait ProcessorSteps {
    fn validate(&self, data: Vec<String>) -> Vec<String>;
    fn transform(&self, data: Vec<String>) -> Vec<String>;
    fn format_output(&self, data: Vec<String>) -> Vec<String>;
    fn post_process_hook(&self, _result: &[String]) {}

    fn process(&self, data: Vec<String>) -> Vec<String> {
        let validated = self.validate(data);
        let transformed = self.transform(validated);
        let result = self.format_output(transformed);
        self.post_process_hook(&result);
        result
    }
}`,
      },
      pros: [
        "Clear algorithm structure — easy to follow the flow",
        "Compile-time enforcement of required steps via abstract methods",
        "Hook methods provide optional extension points with defaults",
      ],
      cons: [
        "Can lead to deep inheritance hierarchies with many subclasses",
        "Adding new steps to the template method may break existing subclasses",
        "Tight coupling between base class and subclasses",
      ],
    },
    {
      id: 2,
      name: "Strategy Composition (Functional)",
      description:
        "Instead of inheritance, pass the variable steps as functions or strategy objects. The template 'method' is a plain function that accepts step functions as parameters. Avoids inheritance hierarchies entirely. Best for languages with first-class functions.",
      code: {
        Python: `from typing import Callable

def process_pipeline(
    data: list[str],
    validate: Callable[[list[str]], list[str]],
    transform: Callable[[list[str]], list[str]],
    format_output: Callable[[list[str]], list[str]],
    post_hook: Callable[[list[str]], None] = lambda _: None,
) -> list[str]:
    """Template function — algorithm structure via composition."""
    validated = validate(data)
    transformed = transform(validated)
    result = format_output(transformed)
    post_hook(result)
    return result

# Define steps as lambdas or functions
result = process_pipeline(
    data=["hello", "", "world"],
    validate=lambda d: [x for x in d if x.strip()],
    transform=lambda d: [x.upper() for x in d],
    format_output=lambda d: [f"ROW: {x}" for x in d],
)
print(result)`,
        Go: `type Steps struct {
	Validate     func([]string) []string
	Transform    func([]string) []string
	FormatOutput func([]string) []string
	PostHook     func([]string)
}

func ProcessPipeline(data []string, s Steps) []string {
	validated := s.Validate(data)
	transformed := s.Transform(validated)
	result := s.FormatOutput(transformed)
	if s.PostHook != nil { s.PostHook(result) }
	return result
}`,
        Java: `// Using functional interfaces
@FunctionalInterface
interface StepFn { List<String> apply(List<String> data); }

class PipelineRunner {
    static List<String> run(List<String> data, StepFn validate, StepFn transform, StepFn format) {
        return format.apply(transform.apply(validate.apply(data)));
    }
}

// Usage
var result = PipelineRunner.run(
    List.of("hello", "", "world"),
    d -> d.stream().filter(s -> !s.isEmpty()).toList(),
    d -> d.stream().map(String::toUpperCase).toList(),
    d -> d.stream().map(s -> "ROW: " + s).toList()
);`,
        TypeScript: `type StepFn = (data: string[]) => string[];

function processPipeline(
  data: string[],
  validate: StepFn,
  transform: StepFn,
  formatOutput: StepFn,
  postHook?: (result: string[]) => void,
): string[] {
  const validated = validate(data);
  const transformed = transform(validated);
  const result = formatOutput(transformed);
  postHook?.(result);
  return result;
}

const result = processPipeline(
  ["hello", "", "world"],
  d => d.filter(Boolean),
  d => d.map(s => s.toUpperCase()),
  d => d.map(s => \`ROW: \${s}\`),
);`,
        Rust: `fn process_pipeline(
    data: Vec<String>,
    validate: impl Fn(Vec<String>) -> Vec<String>,
    transform: impl Fn(Vec<String>) -> Vec<String>,
    format_output: impl Fn(Vec<String>) -> Vec<String>,
) -> Vec<String> {
    let validated = validate(data);
    let transformed = transform(validated);
    format_output(transformed)
}

fn main() {
    let result = process_pipeline(
        vec!["hello".into(), "".into(), "world".into()],
        |d| d.into_iter().filter(|s| !s.is_empty()).collect(),
        |d| d.into_iter().map(|s| s.to_uppercase()).collect(),
        |d| d.into_iter().map(|s| format!("ROW: {}", s)).collect(),
    );
    println!("{:?}", result);
}`,
      },
      pros: [
        "No inheritance required — avoids class hierarchy explosion",
        "Steps are composable and reusable across different pipelines",
        "Easy to test — each step function is independently testable",
      ],
      cons: [
        "Less discoverable than abstract classes — no single base class to inspect",
        "No compile-time enforcement that all steps are provided (unless using types)",
        "Can become unwieldy with many parameters for complex algorithms",
      ],
    },
    {
      id: 3,
      name: "Builder-Configured Template",
      description:
        "Use a builder to configure which steps to include in the pipeline. The template method reads the configured steps and executes them in order. Best when the algorithm steps are optional and the configuration is determined at runtime.",
      code: {
        Python: `from typing import Callable

class PipelineBuilder:
    def __init__(self):
        self._steps: list[tuple[str, Callable]] = []

    def add_step(self, name: str, fn: Callable) -> "PipelineBuilder":
        self._steps.append((name, fn))
        return self

    def build(self) -> "Pipeline":
        return Pipeline(list(self._steps))

class Pipeline:
    def __init__(self, steps: list[tuple[str, Callable]]):
        self._steps = steps

    def run(self, data):
        result = data
        for name, fn in self._steps:
            print(f"Running step: {name}")
            result = fn(result)
        return result

pipeline = (
    PipelineBuilder()
    .add_step("validate", lambda d: [x for x in d if x.strip()])
    .add_step("transform", lambda d: [x.upper() for x in d])
    .add_step("format", lambda d: [f"ROW: {x}" for x in d])
    .build()
)
print(pipeline.run(["hello", "", "world"]))`,
        Go: `type Step struct {
	Name string
	Fn   func([]string) []string
}

type Pipeline struct{ Steps []Step }

func (p *Pipeline) Run(data []string) []string {
	result := data
	for _, s := range p.Steps {
		fmt.Printf("Running: %s\\n", s.Name)
		result = s.Fn(result)
	}
	return result
}

type PipelineBuilder struct{ steps []Step }
func (b *PipelineBuilder) Add(name string, fn func([]string) []string) *PipelineBuilder {
	b.steps = append(b.steps, Step{name, fn})
	return b
}
func (b *PipelineBuilder) Build() *Pipeline { return &Pipeline{b.steps} }`,
        Java: `class PipelineBuilder {
    private final List<Map.Entry<String, Function<List<String>, List<String>>>> steps = new ArrayList<>();

    PipelineBuilder addStep(String name, Function<List<String>, List<String>> fn) {
        steps.add(Map.entry(name, fn));
        return this;
    }

    Pipeline build() { return new Pipeline(steps); }
}

class Pipeline {
    private final List<Map.Entry<String, Function<List<String>, List<String>>>> steps;
    Pipeline(List<Map.Entry<String, Function<List<String>, List<String>>>> steps) { this.steps = steps; }

    List<String> run(List<String> data) {
        var result = data;
        for (var step : steps) { result = step.getValue().apply(result); }
        return result;
    }
}`,
        TypeScript: `type StepFn = (data: string[]) => string[];

class PipelineBuilder {
  private steps: Array<{ name: string; fn: StepFn }> = [];

  addStep(name: string, fn: StepFn): this {
    this.steps.push({ name, fn });
    return this;
  }

  build() {
    const steps = [...this.steps];
    return {
      run(data: string[]) {
        return steps.reduce((result, { name, fn }) => {
          console.log(\`Running: \${name}\`);
          return fn(result);
        }, data);
      },
    };
  }
}

const pipeline = new PipelineBuilder()
  .addStep("validate", d => d.filter(Boolean))
  .addStep("transform", d => d.map(s => s.toUpperCase()))
  .addStep("format", d => d.map(s => \`ROW: \${s}\`))
  .build();

console.log(pipeline.run(["hello", "", "world"]));`,
        Rust: `struct Pipeline {
    steps: Vec<(&'static str, Box<dyn Fn(Vec<String>) -> Vec<String>>)>,
}

impl Pipeline {
    fn new() -> Self { Self { steps: vec![] } }

    fn add_step(mut self, name: &'static str, f: impl Fn(Vec<String>) -> Vec<String> + 'static) -> Self {
        self.steps.push((name, Box::new(f)));
        self
    }

    fn run(&self, data: Vec<String>) -> Vec<String> {
        let mut result = data;
        for (name, f) in &self.steps {
            println!("Running: {}", name);
            result = f(result);
        }
        result
    }
}

fn main() {
    let pipeline = Pipeline::new()
        .add_step("validate", |d| d.into_iter().filter(|s| !s.is_empty()).collect())
        .add_step("transform", |d| d.into_iter().map(|s| s.to_uppercase()).collect())
        .add_step("format", |d| d.into_iter().map(|s| format!("ROW: {}", s)).collect());
    println!("{:?}", pipeline.run(vec!["hello".into(), "".into(), "world".into()]));
}`,
      },
      pros: [
        "Steps are optional and configurable at runtime",
        "Easy to add, remove, or reorder steps without changing the pipeline class",
        "Combines well with plugins and dynamic configuration",
      ],
      cons: [
        "Less type-safe — missing a critical step may not be caught at compile time",
        "Order-dependent bugs are possible if steps are added in the wrong sequence",
        "More complex setup compared to simple abstract class inheritance",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Extension Mechanism", "Step Enforcement", "Flexibility", "Best For",
  ],
  comparisonRows: [
    ["Classic Inheritance", "Subclassing", "Compile-time (abstract)", "Medium", "Well-defined algorithms with few variants"],
    ["Strategy Composition", "Function parameters", "Type signatures", "High", "Functional languages, composable steps"],
    ["Builder-Configured", "Runtime step config", "Runtime only", "Very High", "Plugin architectures, dynamic pipelines"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Behavioral" },
    {
      aspect: "Key Benefit",
      detail:
        "Enforces a consistent algorithm structure across variants while allowing specific steps to be customized. Eliminates duplicate pipeline code and guarantees that invariant steps (validation, logging, cleanup) cannot be skipped.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Creating too many subclasses for minor variations. If the only difference between variants is a single step, consider Strategy pattern or passing a function instead of creating a new subclass.",
    },
    {
      aspect: "vs. Strategy Pattern",
      detail:
        "Template Method uses inheritance to vary *parts* of an algorithm. Strategy uses composition to vary the *entire* algorithm. Template Method controls the flow; Strategy delegates the entire behavior.",
    },
    {
      aspect: "vs. Factory Method",
      detail:
        "Factory Method is a special case of Template Method where the variable step is object creation. Template Method is more general — any step in any algorithm.",
    },
    {
      aspect: "When to Use",
      detail:
        "Multiple processes share the same high-level flow but differ in details. ETL pipelines, test frameworks, report generators, settlement workflows, authentication flows, compiler pipelines.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When the algorithm has no fixed structure or when most steps vary. When composition (Strategy) is simpler than inheritance. When deep class hierarchies become unwieldy.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Strategy (composition alternative), Factory Method (creation-specific template method), Hook methods overlap with Observer for notification extension points",
    },
  ],

  antiPatterns: [
    {
      name: "Leaky Template Method",
      description:
        "The template method is not marked final/non-overridable, allowing subclasses to override the entire algorithm and bypass invariant steps like validation and logging.",
      betterAlternative:
        "Always mark the template method as final (Java), or document it as non-overridable. In Python, name it clearly and document the contract. The whole point is that the algorithm structure is fixed.",
    },
    {
      name: "Too Many Abstract Methods",
      description:
        "The base class has 10+ abstract methods, forcing every subclass to implement all of them even when most steps are the same across variants.",
      betterAlternative:
        "Provide sensible defaults for most steps (make them hooks) and keep only the truly variable steps abstract. Or split into smaller templates.",
    },
    {
      name: "Deep Inheritance Chains",
      description:
        "Three or more levels of inheritance (AbstractProcessor → SpecializedProcessor → ConcreteProcessor), making it hard to trace which method is called at each level.",
      betterAlternative:
        "Keep the hierarchy to two levels (abstract + concrete). If you need more variation, prefer composition (inject strategy objects for variable steps).",
    },
    {
      name: "Calling Super Manually",
      description:
        "Subclasses must remember to call super().step() in their overrides, and forgetting breaks the algorithm. This is fragile and error-prone.",
      betterAlternative:
        "Design the template method so subclasses only override abstract/hook methods — they never need to call super. The base class's template method calls everything in the right order.",
    },
  ],
};

export default templateMethodData;
