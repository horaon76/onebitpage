import { PatternData } from "@/lib/patterns/types";

const builderData: PatternData = {
  slug: "builder",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Builder Pattern",
  subtitle:
    "Separate the construction of a complex object from its representation, allowing the same construction process to create different representations.",

  intent:
    "Encapsulate the construction logic for complex objects behind a step-by-step interface so that client code can configure only the parts it needs. This avoids telescoping constructors (constructors with 10+ parameters), eliminates invalid intermediate states, and produces immutable result objects. The Builder is essential in systems where an object's configuration is highly variable — orders with dozens of optional fields, infrastructure resource descriptors, or document layouts.",

  classDiagramSvg: `<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-label { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-arr); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="b-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Director -->
  <rect x="10" y="10" width="160" height="60" class="s-box s-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="s-title s-diagram-title">Director</text>
  <line x1="10" y1="33" x2="170" y2="33" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">-builder: Builder</text>
  <text x="20" y="62" class="s-member s-diagram-member">+construct(): void</text>
  <!-- Builder interface -->
  <rect x="220" y="10" width="280" height="80" class="s-box s-diagram-box"/>
  <text x="360" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Builder</text>
  <line x1="220" y1="33" x2="500" y2="33" class="s-diagram-line"/>
  <text x="230" y="48" class="s-member s-diagram-member">+buildStepA(): Builder</text>
  <text x="230" y="62" class="s-member s-diagram-member">+buildStepB(): Builder</text>
  <text x="230" y="76" class="s-member s-diagram-member">+build(): Product</text>
  <!-- ConcreteBuilder -->
  <rect x="220" y="130" width="280" height="80" class="s-box s-diagram-box"/>
  <text x="360" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteBuilder</text>
  <line x1="220" y1="153" x2="500" y2="153" class="s-diagram-line"/>
  <text x="230" y="168" class="s-member s-diagram-member">-product: Product</text>
  <text x="230" y="182" class="s-member s-diagram-member">+buildStepA(): Builder</text>
  <text x="230" y="196" class="s-member s-diagram-member">+build(): Product</text>
  <!-- Product -->
  <rect x="280" y="240" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="370" y="263" text-anchor="middle" class="s-title s-diagram-title">Product</text>
  <!-- Arrows -->
  <line x1="170" y1="40" x2="220" y2="40" class="s-arr s-diagram-arrow"/>
  <line x1="360" y1="130" x2="360" y2="90" class="s-arr s-diagram-arrow"/>
  <line x1="370" y1="210" x2="370" y2="240" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Director orchestrates the building process by calling builder steps in a specific order. The Builder interface declares the step-by-step methods (buildStepA, buildStepB) and a final build() method that returns the Product. The ConcreteBuilder implements these steps, accumulating parts in an internal product reference. When build() is called, it validates the configuration and returns the fully constructed, immutable Product. The Director is optional — client code can drive the builder directly via method chaining.",

  diagramComponents: [
    {
      name: "Director",
      description:
        "Defines the order in which to call building steps. It works with the Builder interface, so it can construct different representations using different ConcreteBuilder implementations. The Director is optional — clients can drive the builder directly.",
    },
    {
      name: "Builder (interface)",
      description:
        "Declares the construction steps (buildStepA, buildStepB) and the final build() method. Each step returns the Builder itself to enable method chaining (fluent API). The interface defines what can be configured, not how.",
    },
    {
      name: "ConcreteBuilder",
      description:
        "Implements the Builder interface. Holds a private product reference and assembles it step by step. The build() method validates the configuration, constructs the final Product, and resets the builder for reuse.",
    },
    {
      name: "Product",
      description:
        "The complex object being constructed. Typically immutable after creation — all fields are set during building and cannot be changed afterward. May have many fields, most of which are optional.",
    },
  ],

  solutionDetail:
    "**The Problem:** Complex objects often have many optional parameters. A constructor with 10+ parameters is unreadable, error-prone (swapping two booleans), and forces callers to pass null/default for unused fields. Overloaded constructors explode combinatorially.\n\n**The Builder Solution:** Replace the mega-constructor with a step-by-step builder. Each step sets one aspect of the configuration and returns the builder itself (method chaining). The final build() call validates the configuration and returns an immutable product.\n\n**How It Works:**\n\n1. **Create a builder**: The client creates a ConcreteBuilder, optionally passing required fields to the constructor.\n\n2. **Chain configuration calls**: The client calls builder methods like .withTimeout(30).withRetry(3).withAuth(token). Each method sets one field and returns `this`.\n\n3. **Validate and build**: The build() method checks that required fields are set, validates field combinations (e.g., limit orders need a price), and returns the immutable Product.\n\n4. **Director (optional)**: A Director encapsulates common build sequences — e.g., a 'buildStandardOrder' method that calls the right steps in the right order. This avoids duplicating builder chains across clients.\n\n**Why It Shines:** The Builder pattern is indispensable for objects with many optional parameters, conditional assembly, or when the construction sequence matters. It produces readable, self-documenting code and catches configuration errors at build time rather than at runtime.",

  characteristics: [
    "Eliminates 'telescoping constructor' anti-pattern — no constructor with 10+ optional parameters",
    "Enables fluent API with method chaining for readable, self-documenting configuration",
    "The build() method validates completeness and returns an immutable object",
    "A Director can reuse the same builder steps in different sequences to create variants",
    "Separates construction logic from the product's representation",
    "Overkill for simple objects with few parameters — use only when construction complexity warrants it",
    "Can be combined with Abstract Factory to build products from different families step by step",
  ],

  useCases: [
    {
      id: 1,
      title: "Complex Trading Order",
      domain: "Fintech",
      description:
        "A trading platform constructs orders with 15+ optional fields: order type, limit price, stop price, time-in-force, bracket orders, and regulatory tags.",
      whySingleton:
        "Builder lets traders configure only relevant fields. Limit orders set price; market orders skip it. build() validates required combinations.",
      code: `const order = new OrderBuilder("AAPL", "BUY", 100)
  .limit(150.25)
  .timeInForce("GTC")
  .leiCode("LEI-123456")
  .build();`,
    },
    {
      id: 2,
      title: "HTTP Request Builder",
      domain: "Backend Infrastructure",
      description:
        "An HTTP client constructs requests with method, URL, headers, query params, body, timeout, retry policy, and auth tokens — most optional per request.",
      whySingleton:
        "Builder provides a fluent API that reads like a sentence: get(url).header(...).timeout(30).retry(3).build(). Invalid combos (GET with body) are caught at build time.",
      code: `const req = HttpRequest.get("/api/users")
  .header("Authorization", "Bearer tok")
  .timeout(5000)
  .retry(3)
  .build();`,
    },
    {
      id: 3,
      title: "SQL Query Builder",
      domain: "Database / ORM",
      description:
        "A query builder assembles SELECT, FROM, WHERE, JOIN, ORDER BY, and LIMIT clauses. Different queries use different combinations of clauses.",
      whySingleton:
        "Builder composes SQL safely, preventing injection and ensuring clause ordering. Complex queries build incrementally instead of via string concatenation.",
      code: `const query = new QueryBuilder()
  .select("name", "email")
  .from("users")
  .where("active = ?", true)
  .orderBy("name")
  .limit(50)
  .build();`,
    },
    {
      id: 4,
      title: "UI Component Configuration",
      domain: "Frontend / Design Systems",
      description:
        "A modal dialog builder configures title, body, buttons, size, animation, backdrop behavior, and accessibility attributes — most optional.",
      whySingleton:
        "Builder produces a validated, immutable ModalConfig. Missing title? build() throws. Fluent API is more readable than a 12-property config object.",
      code: `const modal = ModalBuilder.create("Confirm Delete")
  .body("This action cannot be undone.")
  .primaryButton("Delete", onDelete)
  .size("md")
  .closable(true)
  .build();`,
    },
    {
      id: 5,
      title: "Cloud Infrastructure Resource",
      domain: "DevOps / IaC",
      description:
        "An infrastructure-as-code tool builds VM definitions with CPU, memory, disk, networking, tags, security groups, and user-data scripts.",
      whySingleton:
        "Builder lets engineers specify only deviations from defaults. build() validates constraints (e.g., GPU instances need specific AMIs).",
      code: `const vm = VMBuilder.create("web-server")
  .cpu(4).memory("16GB")
  .disk("100GB", "ssd")
  .securityGroup("sg-web")
  .tag("env", "prod")
  .build();`,
    },
    {
      id: 6,
      title: "Email Message Composition",
      domain: "Communication Platform",
      description:
        "An email service builds messages with to, cc, bcc, subject, HTML body, plain text fallback, attachments, reply-to, and tracking headers.",
      whySingleton:
        "Builder ensures required fields (to, subject) are set before build(). Attachments, cc, and tracking are added only when needed.",
      code: `const email = new EmailBuilder()
  .to("user@example.com")
  .subject("Welcome!")
  .htmlBody("<h1>Hello</h1>")
  .attachment("guide.pdf", pdfBytes)
  .trackOpens(true)
  .build();`,
    },
    {
      id: 7,
      title: "Test Data / Fixture Builder",
      domain: "Testing / DevOps",
      description:
        "Integration tests need complex domain objects (users, orders, invoices) with realistic defaults that can be selectively overridden per test case.",
      whySingleton:
        "Builder produces valid test objects with sensible defaults. Each test overrides only the fields relevant to its scenario, keeping tests focused.",
      code: `const user = UserFixture.builder()
  .withName("Jane Doe")
  .withRole("admin")
  .withVerified(true)
  .build(); // other fields use realistic defaults`,
    },
    {
      id: 8,
      title: "Report Generator",
      domain: "SaaS / Analytics",
      description:
        "An analytics dashboard generates reports with configurable date range, metrics, dimensions, filters, sorting, and export format (PDF/CSV/JSON).",
      whySingleton:
        "Builder lets analysts compose reports incrementally. The Director stores common report templates (daily sales, weekly KPIs) as reusable builder sequences.",
      code: `const report = ReportBuilder.create()
  .dateRange("2025-01-01", "2025-12-31")
  .metrics("revenue", "orders")
  .groupBy("month")
  .filter("region", "US")
  .format("PDF")
  .build();`,
    },
    {
      id: 9,
      title: "Notification Configuration",
      domain: "Mobile / Push",
      description:
        "A push notification has title, body, image, action buttons, deep link, priority, TTL, channel, and platform-specific overrides (iOS badge, Android channel ID).",
      whySingleton:
        "Builder handles platform differences: iOS gets badge count, Android gets channel ID. build() validates platform-specific constraints.",
      code: `const push = PushNotification.builder()
  .title("New Message")
  .body("You have 3 unread messages")
  .deepLink("/inbox")
  .priority("high")
  .iosBadge(3)
  .androidChannel("messages")
  .build();`,
    },
    {
      id: 10,
      title: "Machine Learning Pipeline",
      domain: "Data Science / ML",
      description:
        "An ML pipeline specifies data source, preprocessing steps, model architecture, hyperparameters, evaluation metrics, and deployment target.",
      whySingleton:
        "Builder composes the pipeline step by step. build() validates that preprocessing is compatible with the model type and deployment target.",
      code: `const pipeline = MLPipeline.builder()
  .dataSource("s3://data/train.csv")
  .preprocess("normalize", "tokenize")
  .model("transformer", { layers: 6 })
  .evalMetric("f1")
  .deployTo("sagemaker")
  .build();`,
    },
    {
      id: 11,
      title: "Medical Prescription",
      domain: "Healthcare",
      description:
        "An e-prescribing system builds prescriptions with drug, dosage, frequency, duration, refills, pharmacy, insurance, and contraindication warnings.",
      whySingleton:
        "Builder enforces medical validation: controlled substances need DEA number, pediatric doses are capped, and drug interactions are checked at build().",
      code: `const rx = PrescriptionBuilder.create()
  .drug("Amoxicillin", "500mg")
  .frequency("3x/day")
  .duration("10 days")
  .refills(2)
  .pharmacy("CVS #4412")
  .build(); // validates drug interactions`,
    },
    {
      id: 12,
      title: "Game Character Creator",
      domain: "Gaming",
      description:
        "An RPG character creator sets class, race, stats, equipment, skills, and appearance — with complex dependencies between choices.",
      whySingleton:
        "Builder validates stat allocations against class limits, ensures equipment is class-compatible, and produces an immutable Character object.",
      code: `const hero = CharacterBuilder.create("Warrior")
  .race("Elf")
  .stats({ str: 16, dex: 14, con: 12 })
  .equip("Longsword", "Chain Mail")
  .skill("Power Strike")
  .build(); // validates class/race combos`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Complex Transaction Order Builder",
      domain: "Fintech",
      problem:
        "A trading platform submits orders with dozens of optional fields — order type (market/limit/stop), time-in-force, fill-or-kill flags, trailing stop percentages, and regulatory tags (MiFID client ID, LEI codes). A single constructor would have 15+ parameters, most of which are null.",
      solution:
        "A TransactionOrderBuilder uses method chaining to set only the relevant fields. The build() method validates that required combinations are present (e.g., limit price required for limit orders) and returns an immutable TransactionOrder.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-e1); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="b-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">TransactionOrderBuilder</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">+limit(price): Builder</text>
  <text x="130" y="58" class="s-member s-diagram-member">+stop(price): Builder</text>
  <text x="130" y="70" class="s-member s-diagram-member">+timeInForce(tif): Builder</text>
  <text x="130" y="82" class="s-member s-diagram-member">+lei(code): Builder</text>
  <text x="130" y="94" class="s-member s-diagram-member">+build(): TransactionOrder</text>
  <rect x="140" y="130" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="152" text-anchor="middle" class="s-title s-diagram-title">TransactionOrder</text>
  <line x1="230" y1="100" x2="230" y2="130" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class TransactionOrder:
    symbol: str
    side: str
    quantity: int
    order_type: str
    limit_price: Optional[float] = None
    stop_price: Optional[float] = None
    time_in_force: str = "DAY"
    lei_code: Optional[str] = None

class TransactionOrderBuilder:
    def __init__(self, symbol: str, side: str, quantity: int):
        self._symbol = symbol
        self._side = side
        self._qty = quantity
        self._order_type = "MARKET"
        self._limit: Optional[float] = None
        self._stop: Optional[float] = None
        self._tif = "DAY"
        self._lei: Optional[str] = None

    def limit(self, price: float) -> "TransactionOrderBuilder":
        self._order_type = "LIMIT"
        self._limit = price
        return self

    def stop(self, price: float) -> "TransactionOrderBuilder":
        self._stop = price
        return self

    def time_in_force(self, tif: str) -> "TransactionOrderBuilder":
        self._tif = tif
        return self

    def lei(self, code: str) -> "TransactionOrderBuilder":
        self._lei = code
        return self

    def build(self) -> TransactionOrder:
        if self._order_type == "LIMIT" and self._limit is None:
            raise ValueError("Limit orders require a price")
        return TransactionOrder(
            symbol=self._symbol, side=self._side, quantity=self._qty,
            order_type=self._order_type, limit_price=self._limit,
            stop_price=self._stop, time_in_force=self._tif,
            lei_code=self._lei
        )

# ── Usage ──
order = (TransactionOrderBuilder("AAPL", "BUY", 100)
    .limit(150.25)
    .time_in_force("GTC")
    .lei("LEI-549300EXAMPLE")
    .build())
print(order)`,
        Go: `package main

import (
	"errors"
	"fmt"
)

type TransactionOrder struct {
	Symbol      string
	Side        string
	Quantity    int
	OrderType   string
	LimitPrice  *float64
	StopPrice   *float64
	TimeInForce string
	LEICode     string
}

type OrderBuilder struct {
	order TransactionOrder
}

func NewOrderBuilder(symbol, side string, qty int) *OrderBuilder {
	return &OrderBuilder{order: TransactionOrder{
		Symbol: symbol, Side: side, Quantity: qty,
		OrderType: "MARKET", TimeInForce: "DAY",
	}}
}

func (b *OrderBuilder) Limit(price float64) *OrderBuilder {
	b.order.OrderType = "LIMIT"
	b.order.LimitPrice = &price
	return b
}

func (b *OrderBuilder) Stop(price float64) *OrderBuilder {
	b.order.StopPrice = &price
	return b
}

func (b *OrderBuilder) TimeInForce(tif string) *OrderBuilder {
	b.order.TimeInForce = tif
	return b
}

func (b *OrderBuilder) LEI(code string) *OrderBuilder {
	b.order.LEICode = code
	return b
}

func (b *OrderBuilder) Build() (TransactionOrder, error) {
	if b.order.OrderType == "LIMIT" && b.order.LimitPrice == nil {
		return TransactionOrder{}, errors.New("limit orders require a price")
	}
	return b.order, nil
}

func main() {
	order, _ := NewOrderBuilder("AAPL", "BUY", 100).
		Limit(150.25).
		TimeInForce("GTC").
		LEI("LEI-549300EXAMPLE").
		Build()
	fmt.Printf("%+v\\n", order)
}`,
        Java: `public final class TransactionOrder {
    private final String symbol, side, orderType, timeInForce, leiCode;
    private final int quantity;
    private final Double limitPrice, stopPrice;

    private TransactionOrder(Builder b) {
        this.symbol = b.symbol; this.side = b.side;
        this.quantity = b.quantity; this.orderType = b.orderType;
        this.limitPrice = b.limitPrice; this.stopPrice = b.stopPrice;
        this.timeInForce = b.timeInForce; this.leiCode = b.leiCode;
    }

    public static class Builder {
        private final String symbol, side;
        private final int quantity;
        private String orderType = "MARKET", timeInForce = "DAY", leiCode;
        private Double limitPrice, stopPrice;

        public Builder(String symbol, String side, int quantity) {
            this.symbol = symbol; this.side = side; this.quantity = quantity;
        }

        public Builder limit(double price) {
            this.orderType = "LIMIT"; this.limitPrice = price; return this;
        }
        public Builder stop(double price) { this.stopPrice = price; return this; }
        public Builder timeInForce(String tif) { this.timeInForce = tif; return this; }
        public Builder lei(String code) { this.leiCode = code; return this; }

        public TransactionOrder build() {
            if ("LIMIT".equals(orderType) && limitPrice == null)
                throw new IllegalStateException("Limit orders require a price");
            return new TransactionOrder(this);
        }
    }
}

// Usage:
// var order = new TransactionOrder.Builder("AAPL", "BUY", 100)
//     .limit(150.25).timeInForce("GTC").lei("LEI-549300").build();`,
        TypeScript: `interface TransactionOrder {
  readonly symbol: string;
  readonly side: string;
  readonly quantity: number;
  readonly orderType: string;
  readonly limitPrice?: number;
  readonly stopPrice?: number;
  readonly timeInForce: string;
  readonly leiCode?: string;
}

class TransactionOrderBuilder {
  private _orderType = "MARKET";
  private _limitPrice?: number;
  private _stopPrice?: number;
  private _tif = "DAY";
  private _lei?: string;

  constructor(
    private readonly _symbol: string,
    private readonly _side: string,
    private readonly _qty: number,
  ) {}

  limit(price: number): this { this._orderType = "LIMIT"; this._limitPrice = price; return this; }
  stop(price: number): this { this._stopPrice = price; return this; }
  timeInForce(tif: string): this { this._tif = tif; return this; }
  lei(code: string): this { this._lei = code; return this; }

  build(): TransactionOrder {
    if (this._orderType === "LIMIT" && this._limitPrice == null) {
      throw new Error("Limit orders require a price");
    }
    return {
      symbol: this._symbol, side: this._side, quantity: this._qty,
      orderType: this._orderType, limitPrice: this._limitPrice,
      stopPrice: this._stopPrice, timeInForce: this._tif, leiCode: this._lei,
    };
  }
}

// ── Usage ──
const order = new TransactionOrderBuilder("AAPL", "BUY", 100)
  .limit(150.25)
  .timeInForce("GTC")
  .lei("LEI-549300EXAMPLE")
  .build();
console.log(order);`,
        Rust: `#[derive(Debug)]
struct TransactionOrder {
    symbol: String,
    side: String,
    quantity: u32,
    order_type: String,
    limit_price: Option<f64>,
    stop_price: Option<f64>,
    time_in_force: String,
    lei_code: Option<String>,
}

struct OrderBuilder {
    symbol: String, side: String, quantity: u32,
    order_type: String, limit_price: Option<f64>,
    stop_price: Option<f64>, time_in_force: String,
    lei_code: Option<String>,
}

impl OrderBuilder {
    fn new(symbol: &str, side: &str, qty: u32) -> Self {
        Self {
            symbol: symbol.into(), side: side.into(), quantity: qty,
            order_type: "MARKET".into(), limit_price: None,
            stop_price: None, time_in_force: "DAY".into(), lei_code: None,
        }
    }

    fn limit(mut self, price: f64) -> Self {
        self.order_type = "LIMIT".into();
        self.limit_price = Some(price);
        self
    }

    fn time_in_force(mut self, tif: &str) -> Self { self.time_in_force = tif.into(); self }
    fn lei(mut self, code: &str) -> Self { self.lei_code = Some(code.into()); self }

    fn build(self) -> Result<TransactionOrder, String> {
        if self.order_type == "LIMIT" && self.limit_price.is_none() {
            return Err("Limit orders require a price".into());
        }
        Ok(TransactionOrder {
            symbol: self.symbol, side: self.side, quantity: self.quantity,
            order_type: self.order_type, limit_price: self.limit_price,
            stop_price: self.stop_price, time_in_force: self.time_in_force,
            lei_code: self.lei_code,
        })
    }
}

fn main() {
    let order = OrderBuilder::new("AAPL", "BUY", 100)
        .limit(150.25)
        .time_in_force("GTC")
        .lei("LEI-549300EXAMPLE")
        .build()
        .unwrap();
    println!("{:?}", order);
}`,
      },
      considerations: [
        "Validate field combinations in build() — limit orders need a price, stop-loss needs a trigger",
        "Consider separate builders per order type if the field sets are very different",
        "In regulated systems, LEI and MiFID fields may become required based on jurisdiction — make the builder configurable",
        "Thread safety: builders are typically single-use and not shared across threads",
        "Consider returning a Result/Optional from build() instead of throwing to play nicely with FP-style code",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Patient Record Builder",
      domain: "Healthcare",
      problem:
        "An EHR system creates patient records with demographics, insurance, emergency contacts, allergies, medications, and clinical notes. A patient might have zero allergies or twenty. Insurance may be primary + secondary + dental. Building all combinations via constructors is impossible.",
      solution:
        "A PatientRecordBuilder allows incremental construction: required fields (name, DOB, MRN) are set in the constructor, optional fields are added via chaining. build() validates HIPAA requirements.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-e2); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="b-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">PatientRecordBuilder</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">+insurance(ins): Builder</text>
  <text x="130" y="58" class="s-member s-diagram-member">+allergy(a): Builder</text>
  <text x="130" y="70" class="s-member s-diagram-member">+medication(m): Builder</text>
  <text x="130" y="82" class="s-member s-diagram-member">+emergencyContact(c): Builder</text>
  <text x="130" y="94" class="s-member s-diagram-member">+build(): PatientRecord</text>
  <rect x="140" y="130" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="152" text-anchor="middle" class="s-title s-diagram-title">PatientRecord</text>
  <line x1="230" y1="100" x2="230" y2="130" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass, field
from typing import List, Optional

@dataclass(frozen=True)
class PatientRecord:
    name: str
    dob: str
    mrn: str
    insurance: Optional[str] = None
    allergies: tuple = ()
    medications: tuple = ()
    emergency_contact: Optional[str] = None

class PatientRecordBuilder:
    def __init__(self, name: str, dob: str, mrn: str):
        self._name = name
        self._dob = dob
        self._mrn = mrn
        self._insurance: Optional[str] = None
        self._allergies: List[str] = []
        self._meds: List[str] = []
        self._emergency: Optional[str] = None

    def insurance(self, ins: str): self._insurance = ins; return self
    def allergy(self, a: str): self._allergies.append(a); return self
    def medication(self, m: str): self._meds.append(m); return self
    def emergency_contact(self, c: str): self._emergency = c; return self

    def build(self) -> PatientRecord:
        return PatientRecord(
            name=self._name, dob=self._dob, mrn=self._mrn,
            insurance=self._insurance,
            allergies=tuple(self._allergies),
            medications=tuple(self._meds),
            emergency_contact=self._emergency,
        )

# ── Usage ──
record = (PatientRecordBuilder("Jane Smith", "1990-05-15", "MRN-001234")
    .insurance("BlueCross PPO")
    .allergy("Penicillin").allergy("Sulfa")
    .medication("Lisinopril 10mg")
    .emergency_contact("John Smith: 555-0123")
    .build())
print(record)`,
        Go: `package main

import "fmt"

type PatientRecord struct {
	Name, DOB, MRN    string
	Insurance          string
	Allergies          []string
	Medications        []string
	EmergencyContact   string
}

type PatientRecordBuilder struct {
	record PatientRecord
}

func NewPatientRecordBuilder(name, dob, mrn string) *PatientRecordBuilder {
	return &PatientRecordBuilder{record: PatientRecord{Name: name, DOB: dob, MRN: mrn}}
}

func (b *PatientRecordBuilder) Insurance(ins string) *PatientRecordBuilder {
	b.record.Insurance = ins; return b
}
func (b *PatientRecordBuilder) Allergy(a string) *PatientRecordBuilder {
	b.record.Allergies = append(b.record.Allergies, a); return b
}
func (b *PatientRecordBuilder) Medication(m string) *PatientRecordBuilder {
	b.record.Medications = append(b.record.Medications, m); return b
}
func (b *PatientRecordBuilder) EmergencyContact(c string) *PatientRecordBuilder {
	b.record.EmergencyContact = c; return b
}
func (b *PatientRecordBuilder) Build() PatientRecord { return b.record }

func main() {
	record := NewPatientRecordBuilder("Jane Smith", "1990-05-15", "MRN-001234").
		Insurance("BlueCross PPO").
		Allergy("Penicillin").Allergy("Sulfa").
		Medication("Lisinopril 10mg").
		EmergencyContact("John Smith: 555-0123").
		Build()
	fmt.Printf("%+v\\n", record)
}`,
        Java: `import java.util.*;

public final class PatientRecord {
    private final String name, dob, mrn, insurance, emergencyContact;
    private final List<String> allergies, medications;

    private PatientRecord(Builder b) {
        this.name = b.name; this.dob = b.dob; this.mrn = b.mrn;
        this.insurance = b.insurance;
        this.allergies = List.copyOf(b.allergies);
        this.medications = List.copyOf(b.medications);
        this.emergencyContact = b.emergencyContact;
    }

    public static class Builder {
        private final String name, dob, mrn;
        private String insurance, emergencyContact;
        private final List<String> allergies = new ArrayList<>();
        private final List<String> medications = new ArrayList<>();

        public Builder(String name, String dob, String mrn) {
            this.name = name; this.dob = dob; this.mrn = mrn;
        }
        public Builder insurance(String ins) { this.insurance = ins; return this; }
        public Builder allergy(String a) { allergies.add(a); return this; }
        public Builder medication(String m) { medications.add(m); return this; }
        public Builder emergencyContact(String c) { this.emergencyContact = c; return this; }
        public PatientRecord build() { return new PatientRecord(this); }
    }
}`,
        TypeScript: `interface PatientRecord {
  readonly name: string;
  readonly dob: string;
  readonly mrn: string;
  readonly insurance?: string;
  readonly allergies: readonly string[];
  readonly medications: readonly string[];
  readonly emergencyContact?: string;
}

class PatientRecordBuilder {
  private _insurance?: string;
  private _allergies: string[] = [];
  private _meds: string[] = [];
  private _emergency?: string;

  constructor(
    private readonly _name: string,
    private readonly _dob: string,
    private readonly _mrn: string,
  ) {}

  insurance(ins: string): this { this._insurance = ins; return this; }
  allergy(a: string): this { this._allergies.push(a); return this; }
  medication(m: string): this { this._meds.push(m); return this; }
  emergencyContact(c: string): this { this._emergency = c; return this; }

  build(): PatientRecord {
    return {
      name: this._name, dob: this._dob, mrn: this._mrn,
      insurance: this._insurance,
      allergies: Object.freeze([...this._allergies]),
      medications: Object.freeze([...this._meds]),
      emergencyContact: this._emergency,
    };
  }
}

// ── Usage ──
const record = new PatientRecordBuilder("Jane Smith", "1990-05-15", "MRN-001234")
  .insurance("BlueCross PPO")
  .allergy("Penicillin").allergy("Sulfa")
  .medication("Lisinopril 10mg")
  .emergencyContact("John Smith: 555-0123")
  .build();
console.log(record);`,
        Rust: `#[derive(Debug)]
struct PatientRecord {
    name: String, dob: String, mrn: String,
    insurance: Option<String>,
    allergies: Vec<String>,
    medications: Vec<String>,
    emergency_contact: Option<String>,
}

struct PatientRecordBuilder {
    name: String, dob: String, mrn: String,
    insurance: Option<String>,
    allergies: Vec<String>,
    medications: Vec<String>,
    emergency_contact: Option<String>,
}

impl PatientRecordBuilder {
    fn new(name: &str, dob: &str, mrn: &str) -> Self {
        Self {
            name: name.into(), dob: dob.into(), mrn: mrn.into(),
            insurance: None, allergies: vec![], medications: vec![],
            emergency_contact: None,
        }
    }
    fn insurance(mut self, ins: &str) -> Self { self.insurance = Some(ins.into()); self }
    fn allergy(mut self, a: &str) -> Self { self.allergies.push(a.into()); self }
    fn medication(mut self, m: &str) -> Self { self.medications.push(m.into()); self }
    fn emergency_contact(mut self, c: &str) -> Self { self.emergency_contact = Some(c.into()); self }

    fn build(self) -> PatientRecord {
        PatientRecord {
            name: self.name, dob: self.dob, mrn: self.mrn,
            insurance: self.insurance, allergies: self.allergies,
            medications: self.medications, emergency_contact: self.emergency_contact,
        }
    }
}

fn main() {
    let record = PatientRecordBuilder::new("Jane Smith", "1990-05-15", "MRN-001234")
        .insurance("BlueCross PPO")
        .allergy("Penicillin").allergy("Sulfa")
        .medication("Lisinopril 10mg")
        .emergency_contact("John Smith: 555-0123")
        .build();
    println!("{:?}", record);
}`,
      },
      considerations: [
        "HIPAA requires certain fields — build() should validate that mandatory elements are present",
        "Allergies and medications are lists — the builder should support additive chaining (allergy().allergy())",
        "Consider a Director that pre-fills admission templates: 'Emergency Admission' vs 'Scheduled Surgery' with different required fields",
        "The final PatientRecord should be immutable to prevent accidental modifications after creation",
        "Audit logging should capture who built the record and when — consider a metadata step in the builder",
      ],
    },
    {
      id: 3,
      title: "DevOps — Infrastructure Resource Builder",
      domain: "DevOps / Cloud",
      problem:
        "A cloud deployment tool creates VM definitions with CPU count, memory, disk type, disk size, network config, security groups, user-data scripts, tags, and IAM roles. Each cloud provider (AWS, GCP, Azure) has different required fields and validation rules.",
      solution:
        "A VMBuilder with a fluent API lets engineers specify only deviations from sensible defaults. build() validates provider-specific constraints (e.g., GPU instances need specific machine images).",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-e3); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="b-e3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="90" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">VMBuilder</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">+cpu(n): Builder</text>
  <text x="130" y="58" class="s-member s-diagram-member">+memory(gb): Builder</text>
  <text x="130" y="70" class="s-member s-diagram-member">+disk(size, type): Builder</text>
  <text x="130" y="82" class="s-member s-diagram-member">+securityGroup(sg): Builder</text>
  <text x="130" y="94" class="s-member s-diagram-member">+build(): VMDefinition</text>
  <rect x="140" y="130" width="180" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="152" text-anchor="middle" class="s-title s-diagram-title">VMDefinition</text>
  <line x1="230" y1="100" x2="230" y2="130" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass(frozen=True)
class VMDefinition:
    name: str
    cpu: int = 2
    memory_gb: int = 4
    disk_gb: int = 50
    disk_type: str = "ssd"
    security_groups: tuple = ()
    tags: dict = field(default_factory=dict)

class VMBuilder:
    def __init__(self, name: str):
        self._name = name
        self._cpu = 2
        self._mem = 4
        self._disk = 50
        self._disk_type = "ssd"
        self._sgs: List[str] = []
        self._tags: Dict[str, str] = {}

    def cpu(self, n: int): self._cpu = n; return self
    def memory(self, gb: int): self._mem = gb; return self
    def disk(self, gb: int, dtype: str = "ssd"):
        self._disk = gb; self._disk_type = dtype; return self
    def security_group(self, sg: str): self._sgs.append(sg); return self
    def tag(self, key: str, val: str): self._tags[key] = val; return self

    def build(self) -> VMDefinition:
        if self._cpu < 1: raise ValueError("CPU must be >= 1")
        return VMDefinition(
            name=self._name, cpu=self._cpu, memory_gb=self._mem,
            disk_gb=self._disk, disk_type=self._disk_type,
            security_groups=tuple(self._sgs), tags=dict(self._tags),
        )

# ── Usage ──
vm = (VMBuilder("web-server")
    .cpu(4).memory(16)
    .disk(100, "ssd")
    .security_group("sg-web").security_group("sg-monitoring")
    .tag("env", "production").tag("team", "platform")
    .build())
print(vm)`,
        Go: `package main

import "fmt"

type VMDefinition struct {
	Name, DiskType    string
	CPU, MemoryGB     int
	DiskGB            int
	SecurityGroups    []string
	Tags              map[string]string
}

type VMBuilder struct{ vm VMDefinition }

func NewVMBuilder(name string) *VMBuilder {
	return &VMBuilder{vm: VMDefinition{
		Name: name, CPU: 2, MemoryGB: 4, DiskGB: 50,
		DiskType: "ssd", Tags: map[string]string{},
	}}
}

func (b *VMBuilder) CPU(n int) *VMBuilder       { b.vm.CPU = n; return b }
func (b *VMBuilder) Memory(gb int) *VMBuilder    { b.vm.MemoryGB = gb; return b }
func (b *VMBuilder) Disk(gb int, t string) *VMBuilder {
	b.vm.DiskGB = gb; b.vm.DiskType = t; return b
}
func (b *VMBuilder) SecurityGroup(sg string) *VMBuilder {
	b.vm.SecurityGroups = append(b.vm.SecurityGroups, sg); return b
}
func (b *VMBuilder) Tag(k, v string) *VMBuilder { b.vm.Tags[k] = v; return b }
func (b *VMBuilder) Build() VMDefinition         { return b.vm }

func main() {
	vm := NewVMBuilder("web-server").
		CPU(4).Memory(16).
		Disk(100, "ssd").
		SecurityGroup("sg-web").
		Tag("env", "production").
		Build()
	fmt.Printf("%+v\\n", vm)
}`,
        Java: `import java.util.*;

public final class VMDefinition {
    private final String name, diskType;
    private final int cpu, memoryGB, diskGB;
    private final List<String> securityGroups;
    private final Map<String, String> tags;

    private VMDefinition(Builder b) {
        this.name = b.name; this.cpu = b.cpu; this.memoryGB = b.memoryGB;
        this.diskGB = b.diskGB; this.diskType = b.diskType;
        this.securityGroups = List.copyOf(b.securityGroups);
        this.tags = Map.copyOf(b.tags);
    }

    public static class Builder {
        private final String name;
        private int cpu = 2, memoryGB = 4, diskGB = 50;
        private String diskType = "ssd";
        private final List<String> securityGroups = new ArrayList<>();
        private final Map<String, String> tags = new HashMap<>();

        public Builder(String name) { this.name = name; }
        public Builder cpu(int n) { this.cpu = n; return this; }
        public Builder memory(int gb) { this.memoryGB = gb; return this; }
        public Builder disk(int gb, String type) { this.diskGB = gb; this.diskType = type; return this; }
        public Builder securityGroup(String sg) { securityGroups.add(sg); return this; }
        public Builder tag(String k, String v) { tags.put(k, v); return this; }
        public VMDefinition build() { return new VMDefinition(this); }
    }
}`,
        TypeScript: `interface VMDefinition {
  readonly name: string;
  readonly cpu: number;
  readonly memoryGB: number;
  readonly diskGB: number;
  readonly diskType: string;
  readonly securityGroups: readonly string[];
  readonly tags: Readonly<Record<string, string>>;
}

class VMBuilder {
  private _cpu = 2;
  private _mem = 4;
  private _diskGB = 50;
  private _diskType = "ssd";
  private _sgs: string[] = [];
  private _tags: Record<string, string> = {};

  constructor(private readonly _name: string) {}

  cpu(n: number): this { this._cpu = n; return this; }
  memory(gb: number): this { this._mem = gb; return this; }
  disk(gb: number, type = "ssd"): this { this._diskGB = gb; this._diskType = type; return this; }
  securityGroup(sg: string): this { this._sgs.push(sg); return this; }
  tag(k: string, v: string): this { this._tags[k] = v; return this; }

  build(): VMDefinition {
    return {
      name: this._name, cpu: this._cpu, memoryGB: this._mem,
      diskGB: this._diskGB, diskType: this._diskType,
      securityGroups: Object.freeze([...this._sgs]),
      tags: Object.freeze({ ...this._tags }),
    };
  }
}

// ── Usage ──
const vm = new VMBuilder("web-server")
  .cpu(4).memory(16)
  .disk(100, "ssd")
  .securityGroup("sg-web")
  .tag("env", "production")
  .build();
console.log(vm);`,
        Rust: `use std::collections::HashMap;

#[derive(Debug)]
struct VMDefinition {
    name: String, cpu: u32, memory_gb: u32,
    disk_gb: u32, disk_type: String,
    security_groups: Vec<String>,
    tags: HashMap<String, String>,
}

struct VMBuilder {
    name: String, cpu: u32, memory_gb: u32,
    disk_gb: u32, disk_type: String,
    security_groups: Vec<String>,
    tags: HashMap<String, String>,
}

impl VMBuilder {
    fn new(name: &str) -> Self {
        Self {
            name: name.into(), cpu: 2, memory_gb: 4,
            disk_gb: 50, disk_type: "ssd".into(),
            security_groups: vec![], tags: HashMap::new(),
        }
    }
    fn cpu(mut self, n: u32) -> Self { self.cpu = n; self }
    fn memory(mut self, gb: u32) -> Self { self.memory_gb = gb; self }
    fn disk(mut self, gb: u32, t: &str) -> Self { self.disk_gb = gb; self.disk_type = t.into(); self }
    fn security_group(mut self, sg: &str) -> Self { self.security_groups.push(sg.into()); self }
    fn tag(mut self, k: &str, v: &str) -> Self { self.tags.insert(k.into(), v.into()); self }

    fn build(self) -> VMDefinition {
        VMDefinition {
            name: self.name, cpu: self.cpu, memory_gb: self.memory_gb,
            disk_gb: self.disk_gb, disk_type: self.disk_type,
            security_groups: self.security_groups, tags: self.tags,
        }
    }
}

fn main() {
    let vm = VMBuilder::new("web-server")
        .cpu(4).memory(16).disk(100, "ssd")
        .security_group("sg-web")
        .tag("env", "production")
        .build();
    println!("{:?}", vm);
}`,
      },
      considerations: [
        "Default values should be sensible for the most common configuration — override only what differs",
        "Provider-specific validation belongs in build(): AWS instance types have fixed CPU/memory combos",
        "Tags are additive — the builder should merge tags, not replace them",
        "Consider a Director that pre-builds common configurations: 'micro', 'small', 'large', 'gpu'",
        "Immutable VMDefinition prevents accidental drift between planning and deployment",
      ],
    },
    {
      id: 4,
      title: "E-Commerce — Shopping Cart & Checkout Builder",
      domain: "E-Commerce",
      problem:
        "A checkout system must assemble an order from cart items, shipping address, billing address, payment method, discount codes, gift wrapping options, and delivery instructions. Different checkout flows (express, guest, subscription) need different subsets.",
      solution:
        "A CheckoutBuilder lets each flow configure only its relevant fields. Express checkout uses saved addresses; guest checkout requires all fields. build() validates the complete order.",
      classDiagramSvg: `<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-e4); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="b-e4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="80" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">CheckoutBuilder</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">+shippingAddress(a): Builder</text>
  <text x="130" y="58" class="s-member s-diagram-member">+paymentMethod(p): Builder</text>
  <text x="130" y="70" class="s-member s-diagram-member">+discountCode(c): Builder</text>
  <text x="130" y="82" class="s-member s-diagram-member">+build(): Order</text>
  <rect x="160" y="120" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="142" text-anchor="middle" class="s-title s-diagram-title">Order</text>
  <line x1="230" y1="90" x2="230" y2="120" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass, field
from typing import List, Optional

@dataclass(frozen=True)
class Order:
    items: tuple
    shipping_address: str
    payment_method: str
    billing_address: Optional[str] = None
    discount_code: Optional[str] = None
    gift_wrap: bool = False

class CheckoutBuilder:
    def __init__(self, items: list):
        self._items = tuple(items)
        self._shipping: Optional[str] = None
        self._billing: Optional[str] = None
        self._payment: Optional[str] = None
        self._discount: Optional[str] = None
        self._gift = False

    def shipping_address(self, a: str): self._shipping = a; return self
    def billing_address(self, a: str): self._billing = a; return self
    def payment_method(self, p: str): self._payment = p; return self
    def discount_code(self, c: str): self._discount = c; return self
    def gift_wrap(self): self._gift = True; return self

    def build(self) -> Order:
        if not self._shipping: raise ValueError("Shipping address required")
        if not self._payment: raise ValueError("Payment method required")
        return Order(
            items=self._items, shipping_address=self._shipping,
            payment_method=self._payment,
            billing_address=self._billing or self._shipping,
            discount_code=self._discount, gift_wrap=self._gift,
        )

# ── Usage ──
order = (CheckoutBuilder(["Widget x2", "Gadget x1"])
    .shipping_address("123 Main St")
    .payment_method("Visa *4242")
    .discount_code("SAVE10")
    .gift_wrap()
    .build())
print(order)`,
        Go: `package main

import (
	"errors"
	"fmt"
)

type Order struct {
	Items           []string
	ShippingAddress string
	PaymentMethod   string
	BillingAddress  string
	DiscountCode    string
	GiftWrap        bool
}

type CheckoutBuilder struct{ order Order }

func NewCheckoutBuilder(items []string) *CheckoutBuilder {
	return &CheckoutBuilder{order: Order{Items: items}}
}
func (b *CheckoutBuilder) ShippingAddress(a string) *CheckoutBuilder { b.order.ShippingAddress = a; return b }
func (b *CheckoutBuilder) PaymentMethod(p string) *CheckoutBuilder   { b.order.PaymentMethod = p; return b }
func (b *CheckoutBuilder) DiscountCode(c string) *CheckoutBuilder    { b.order.DiscountCode = c; return b }
func (b *CheckoutBuilder) GiftWrap() *CheckoutBuilder                { b.order.GiftWrap = true; return b }

func (b *CheckoutBuilder) Build() (Order, error) {
	if b.order.ShippingAddress == "" { return Order{}, errors.New("shipping required") }
	if b.order.PaymentMethod == "" { return Order{}, errors.New("payment required") }
	return b.order, nil
}

func main() {
	order, _ := NewCheckoutBuilder([]string{"Widget x2"}).
		ShippingAddress("123 Main St").
		PaymentMethod("Visa *4242").
		DiscountCode("SAVE10").
		GiftWrap().
		Build()
	fmt.Printf("%+v\\n", order)
}`,
        Java: `import java.util.List;

public final class Order {
    private final List<String> items;
    private final String shippingAddress, paymentMethod, billingAddress, discountCode;
    private final boolean giftWrap;

    private Order(Builder b) {
        this.items = List.copyOf(b.items);
        this.shippingAddress = b.shippingAddress;
        this.paymentMethod = b.paymentMethod;
        this.billingAddress = b.billingAddress != null ? b.billingAddress : b.shippingAddress;
        this.discountCode = b.discountCode;
        this.giftWrap = b.giftWrap;
    }

    public static class Builder {
        private final List<String> items;
        private String shippingAddress, paymentMethod, billingAddress, discountCode;
        private boolean giftWrap;

        public Builder(List<String> items) { this.items = items; }
        public Builder shippingAddress(String a) { this.shippingAddress = a; return this; }
        public Builder paymentMethod(String p) { this.paymentMethod = p; return this; }
        public Builder discountCode(String c) { this.discountCode = c; return this; }
        public Builder giftWrap() { this.giftWrap = true; return this; }

        public Order build() {
            if (shippingAddress == null) throw new IllegalStateException("Shipping required");
            if (paymentMethod == null) throw new IllegalStateException("Payment required");
            return new Order(this);
        }
    }
}`,
        TypeScript: `interface Order {
  readonly items: readonly string[];
  readonly shippingAddress: string;
  readonly paymentMethod: string;
  readonly billingAddress: string;
  readonly discountCode?: string;
  readonly giftWrap: boolean;
}

class CheckoutBuilder {
  private _shipping?: string;
  private _billing?: string;
  private _payment?: string;
  private _discount?: string;
  private _gift = false;

  constructor(private readonly _items: string[]) {}

  shippingAddress(a: string): this { this._shipping = a; return this; }
  billingAddress(a: string): this { this._billing = a; return this; }
  paymentMethod(p: string): this { this._payment = p; return this; }
  discountCode(c: string): this { this._discount = c; return this; }
  giftWrap(): this { this._gift = true; return this; }

  build(): Order {
    if (!this._shipping) throw new Error("Shipping address required");
    if (!this._payment) throw new Error("Payment method required");
    return {
      items: Object.freeze([...this._items]),
      shippingAddress: this._shipping,
      paymentMethod: this._payment,
      billingAddress: this._billing ?? this._shipping,
      discountCode: this._discount,
      giftWrap: this._gift,
    };
  }
}

// ── Usage ──
const order = new CheckoutBuilder(["Widget x2", "Gadget x1"])
  .shippingAddress("123 Main St")
  .paymentMethod("Visa *4242")
  .discountCode("SAVE10")
  .giftWrap()
  .build();`,
        Rust: `#[derive(Debug)]
struct Order {
    items: Vec<String>,
    shipping_address: String,
    payment_method: String,
    billing_address: String,
    discount_code: Option<String>,
    gift_wrap: bool,
}

struct CheckoutBuilder {
    items: Vec<String>,
    shipping: Option<String>,
    billing: Option<String>,
    payment: Option<String>,
    discount: Option<String>,
    gift_wrap: bool,
}

impl CheckoutBuilder {
    fn new(items: Vec<String>) -> Self {
        Self { items, shipping: None, billing: None, payment: None, discount: None, gift_wrap: false }
    }
    fn shipping_address(mut self, a: &str) -> Self { self.shipping = Some(a.into()); self }
    fn payment_method(mut self, p: &str) -> Self { self.payment = Some(p.into()); self }
    fn discount_code(mut self, c: &str) -> Self { self.discount = Some(c.into()); self }
    fn gift_wrap(mut self) -> Self { self.gift_wrap = true; self }

    fn build(self) -> Result<Order, String> {
        let ship = self.shipping.ok_or("Shipping required")?;
        let pay = self.payment.ok_or("Payment required")?;
        Ok(Order {
            items: self.items, shipping_address: ship.clone(),
            payment_method: pay, billing_address: self.billing.unwrap_or(ship),
            discount_code: self.discount, gift_wrap: self.gift_wrap,
        })
    }
}

fn main() {
    let order = CheckoutBuilder::new(vec!["Widget x2".into()])
        .shipping_address("123 Main St")
        .payment_method("Visa *4242")
        .discount_code("SAVE10")
        .gift_wrap()
        .build().unwrap();
    println!("{:?}", order);
}`,
      },
      considerations: [
        "Express checkout should pre-fill from saved customer data — the Director pattern manages this",
        "Discount code validation should happen in build(), not during chaining, to avoid partial state",
        "Multiple payment methods (split payment) need additive chaining similar to cart items",
        "Consider immutable intermediate steps — each builder method returns a new builder instance (persistent builder)",
        "Subscription orders reuse the same builder configuration monthly — store the builder, not the order",
      ],
    },
    {
      id: 5,
      title: "Gaming — Game Level Builder",
      domain: "Gaming",
      problem:
        "A level editor constructs game levels with terrain type, enemy spawners, item pickups, lighting, music tracks, weather effects, and win conditions. Each combination produces a unique gameplay experience.",
      solution:
        "A LevelBuilder lets designers compose levels incrementally. A Director stores preset level templates (tutorial, boss fight, endless mode) that designers can further customize.",
      classDiagramSvg: `<svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#b-e5); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="b-e5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="120" y="10" width="220" height="80" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">LevelBuilder</text>
  <line x1="120" y1="32" x2="340" y2="32" class="s-diagram-line"/>
  <text x="130" y="46" class="s-member s-diagram-member">+terrain(t): Builder</text>
  <text x="130" y="58" class="s-member s-diagram-member">+addEnemy(e): Builder</text>
  <text x="130" y="70" class="s-member s-diagram-member">+weather(w): Builder</text>
  <text x="130" y="82" class="s-member s-diagram-member">+build(): GameLevel</text>
  <rect x="160" y="120" width="140" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="142" text-anchor="middle" class="s-title s-diagram-title">GameLevel</text>
  <line x1="230" y1="90" x2="230" y2="120" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

@dataclass(frozen=True)
class GameLevel:
    name: str
    terrain: str
    enemies: tuple
    weather: str
    music: str

class LevelBuilder:
    def __init__(self, name: str):
        self._name = name
        self._terrain = "grassland"
        self._enemies = []
        self._weather = "clear"
        self._music = "ambient"

    def terrain(self, t: str): self._terrain = t; return self
    def add_enemy(self, e: str): self._enemies.append(e); return self
    def weather(self, w: str): self._weather = w; return self
    def music(self, m: str): self._music = m; return self

    def build(self) -> GameLevel:
        return GameLevel(
            name=self._name,
            terrain=self._terrain,
            enemies=tuple(self._enemies),
            weather=self._weather,
            music=self._music,
        )

# Director: preset templates
class LevelDirector:
    @staticmethod
    def tutorial_level() -> GameLevel:
        return (LevelBuilder("Tutorial")
            .terrain("meadow")
            .add_enemy("slime")
            .weather("sunny")
            .music("peaceful")
            .build())

    @staticmethod
    def boss_level(boss_name: str) -> GameLevel:
        return (LevelBuilder(f"Boss: {boss_name}")
            .terrain("volcano")
            .add_enemy(boss_name)
            .add_enemy("minion").add_enemy("minion")
            .weather("storm")
            .music("epic_battle")
            .build())

# ── Usage ──
tutorial = LevelDirector.tutorial_level()
boss = LevelDirector.boss_level("Dragon King")
print(tutorial)
print(boss)`,
        Go: `package main

import "fmt"

type GameLevel struct {
	Name    string
	Terrain string
	Enemies []string
	Weather string
	Music   string
}

type LevelBuilder struct{ level GameLevel }

func NewLevelBuilder(name string) *LevelBuilder {
	return &LevelBuilder{level: GameLevel{
		Name: name, Terrain: "grassland", Weather: "clear", Music: "ambient",
	}}
}
func (b *LevelBuilder) Terrain(t string) *LevelBuilder   { b.level.Terrain = t; return b }
func (b *LevelBuilder) AddEnemy(e string) *LevelBuilder   { b.level.Enemies = append(b.level.Enemies, e); return b }
func (b *LevelBuilder) Weather(w string) *LevelBuilder    { b.level.Weather = w; return b }
func (b *LevelBuilder) Music(m string) *LevelBuilder      { b.level.Music = m; return b }
func (b *LevelBuilder) Build() GameLevel                   { return b.level }

func main() {
	boss := NewLevelBuilder("Boss: Dragon King").
		Terrain("volcano").
		AddEnemy("Dragon King").AddEnemy("minion").
		Weather("storm").Music("epic_battle").
		Build()
	fmt.Printf("%+v\\n", boss)
}`,
        Java: `import java.util.*;

public final class GameLevel {
    public final String name, terrain, weather, music;
    public final List<String> enemies;

    private GameLevel(Builder b) {
        this.name = b.name; this.terrain = b.terrain;
        this.weather = b.weather; this.music = b.music;
        this.enemies = List.copyOf(b.enemies);
    }

    public static class Builder {
        private final String name;
        private String terrain = "grassland", weather = "clear", music = "ambient";
        private final List<String> enemies = new ArrayList<>();

        public Builder(String name) { this.name = name; }
        public Builder terrain(String t) { this.terrain = t; return this; }
        public Builder addEnemy(String e) { enemies.add(e); return this; }
        public Builder weather(String w) { this.weather = w; return this; }
        public Builder music(String m) { this.music = m; return this; }
        public GameLevel build() { return new GameLevel(this); }
    }
}`,
        TypeScript: `interface GameLevel {
  readonly name: string;
  readonly terrain: string;
  readonly enemies: readonly string[];
  readonly weather: string;
  readonly music: string;
}

class LevelBuilder {
  private _terrain = "grassland";
  private _enemies: string[] = [];
  private _weather = "clear";
  private _music = "ambient";

  constructor(private readonly _name: string) {}

  terrain(t: string): this { this._terrain = t; return this; }
  addEnemy(e: string): this { this._enemies.push(e); return this; }
  weather(w: string): this { this._weather = w; return this; }
  music(m: string): this { this._music = m; return this; }

  build(): GameLevel {
    return {
      name: this._name, terrain: this._terrain,
      enemies: Object.freeze([...this._enemies]),
      weather: this._weather, music: this._music,
    };
  }
}

// Director
class LevelDirector {
  static bossLevel(boss: string): GameLevel {
    return new LevelBuilder(\`Boss: \${boss}\`)
      .terrain("volcano")
      .addEnemy(boss).addEnemy("minion").addEnemy("minion")
      .weather("storm").music("epic_battle")
      .build();
  }
}

// ── Usage ──
const boss = LevelDirector.bossLevel("Dragon King");
console.log(boss);`,
        Rust: `#[derive(Debug)]
struct GameLevel {
    name: String, terrain: String,
    enemies: Vec<String>, weather: String, music: String,
}

struct LevelBuilder {
    name: String, terrain: String,
    enemies: Vec<String>, weather: String, music: String,
}

impl LevelBuilder {
    fn new(name: &str) -> Self {
        Self {
            name: name.into(), terrain: "grassland".into(),
            enemies: vec![], weather: "clear".into(), music: "ambient".into(),
        }
    }
    fn terrain(mut self, t: &str) -> Self { self.terrain = t.into(); self }
    fn add_enemy(mut self, e: &str) -> Self { self.enemies.push(e.into()); self }
    fn weather(mut self, w: &str) -> Self { self.weather = w.into(); self }
    fn music(mut self, m: &str) -> Self { self.music = m.into(); self }

    fn build(self) -> GameLevel {
        GameLevel {
            name: self.name, terrain: self.terrain,
            enemies: self.enemies, weather: self.weather, music: self.music,
        }
    }
}

fn main() {
    let boss = LevelBuilder::new("Boss: Dragon King")
        .terrain("volcano")
        .add_enemy("Dragon King").add_enemy("minion")
        .weather("storm").music("epic_battle")
        .build();
    println!("{:?}", boss);
}`,
      },
      considerations: [
        "The Director stores reusable level templates — tutorial, boss fight, endless mode — as named builder sequences",
        "Enemy difficulty scaling can be applied as a post-build transformation or as a builder config",
        "Level validation in build() should ensure spawn points exist for each enemy type",
        "Serialization: consider making the builder itself serializable so level designers can save/load configurations",
        "Nested builders (terrain builder, lighting builder) can compose for very complex levels",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "For most projects, start with the Fluent Builder (method chaining) — it's the most readable and commonly expected. Use the Step Builder when construction order matters. Use the Director when you have reusable construction sequences. Closures/functional builders shine in FP-heavy codebases.",

  variants: [
    {
      id: 1,
      name: "Fluent Builder (Method Chaining)",
      description:
        "The most common approach: each setter method returns `this` (or a new builder in immutable variants), enabling chained calls. The final build() validates and produces the product. Simple, readable, and idiomatic in most languages.",
      code: {
        Python: `class QueryBuilder:
    def __init__(self):
        self._table = ""
        self._columns = ["*"]
        self._wheres = []
        self._limit = None

    def table(self, t: str): self._table = t; return self
    def select(self, *cols): self._columns = list(cols); return self
    def where(self, cond: str): self._wheres.append(cond); return self
    def limit(self, n: int): self._limit = n; return self

    def build(self) -> str:
        sql = f"SELECT {', '.join(self._columns)} FROM {self._table}"
        if self._wheres: sql += " WHERE " + " AND ".join(self._wheres)
        if self._limit: sql += f" LIMIT {self._limit}"
        return sql

# ── Usage ──
query = (QueryBuilder()
    .table("users")
    .select("name", "email")
    .where("active = true")
    .limit(50)
    .build())
print(query)`,
        Go: `package main

import (
	"fmt"
	"strings"
)

type QueryBuilder struct {
	table   string
	columns []string
	wheres  []string
	limit   int
}

func NewQueryBuilder() *QueryBuilder {
	return &QueryBuilder{columns: []string{"*"}}
}
func (q *QueryBuilder) Table(t string) *QueryBuilder          { q.table = t; return q }
func (q *QueryBuilder) Select(cols ...string) *QueryBuilder   { q.columns = cols; return q }
func (q *QueryBuilder) Where(cond string) *QueryBuilder       { q.wheres = append(q.wheres, cond); return q }
func (q *QueryBuilder) Limit(n int) *QueryBuilder             { q.limit = n; return q }

func (q *QueryBuilder) Build() string {
	sql := fmt.Sprintf("SELECT %s FROM %s", strings.Join(q.columns, ", "), q.table)
	if len(q.wheres) > 0 { sql += " WHERE " + strings.Join(q.wheres, " AND ") }
	if q.limit > 0 { sql += fmt.Sprintf(" LIMIT %d", q.limit) }
	return sql
}

func main() {
	query := NewQueryBuilder().
		Table("users").
		Select("name", "email").
		Where("active = true").
		Limit(50).
		Build()
	fmt.Println(query)
}`,
        Java: `class QueryBuilder {
    private String table = "";
    private String[] columns = {"*"};
    private final java.util.List<String> wheres = new java.util.ArrayList<>();
    private int limit = -1;

    QueryBuilder table(String t) { this.table = t; return this; }
    QueryBuilder select(String... cols) { this.columns = cols; return this; }
    QueryBuilder where(String cond) { wheres.add(cond); return this; }
    QueryBuilder limit(int n) { this.limit = n; return this; }

    String build() {
        var sql = "SELECT " + String.join(", ", columns) + " FROM " + table;
        if (!wheres.isEmpty()) sql += " WHERE " + String.join(" AND ", wheres);
        if (limit > 0) sql += " LIMIT " + limit;
        return sql;
    }
}`,
        TypeScript: `class QueryBuilder {
  private _table = "";
  private _cols: string[] = ["*"];
  private _wheres: string[] = [];
  private _limit?: number;

  table(t: string): this { this._table = t; return this; }
  select(...cols: string[]): this { this._cols = cols; return this; }
  where(cond: string): this { this._wheres.push(cond); return this; }
  limit(n: number): this { this._limit = n; return this; }

  build(): string {
    let sql = \`SELECT \${this._cols.join(", ")} FROM \${this._table}\`;
    if (this._wheres.length) sql += \` WHERE \${this._wheres.join(" AND ")}\`;
    if (this._limit) sql += \` LIMIT \${this._limit}\`;
    return sql;
  }
}

const q = new QueryBuilder()
  .table("users").select("name", "email")
  .where("active = true").limit(50).build();`,
        Rust: `struct QueryBuilder {
    table: String, columns: Vec<String>,
    wheres: Vec<String>, limit: Option<usize>,
}

impl QueryBuilder {
    fn new() -> Self {
        Self { table: String::new(), columns: vec!["*".into()], wheres: vec![], limit: None }
    }
    fn table(mut self, t: &str) -> Self { self.table = t.into(); self }
    fn select(mut self, cols: &[&str]) -> Self { self.columns = cols.iter().map(|s| s.to_string()).collect(); self }
    fn where_clause(mut self, c: &str) -> Self { self.wheres.push(c.into()); self }
    fn limit(mut self, n: usize) -> Self { self.limit = Some(n); self }

    fn build(self) -> String {
        let mut sql = format!("SELECT {} FROM {}", self.columns.join(", "), self.table);
        if !self.wheres.is_empty() { sql += &format!(" WHERE {}", self.wheres.join(" AND ")); }
        if let Some(n) = self.limit { sql += &format!(" LIMIT {}", n); }
        sql
    }
}

fn main() {
    let q = QueryBuilder::new()
        .table("users").select(&["name", "email"])
        .where_clause("active = true").limit(50)
        .build();
    println!("{}", q);
}`,
      },
      pros: [
        "Readable, self-documenting code — reads like a sentence",
        "IDE autocomplete guides the developer through available options",
        "Easy to learn and widely expected by developers",
      ],
      cons: [
        "No ordering enforcement — steps can be called in any order",
        "Optional steps may be missed — build() must validate completeness",
        "Mutable builder state can cause issues if the builder is accidentally reused",
      ],
    },
    {
      id: 2,
      name: "Step Builder (Wizard Pattern)",
      description:
        "Each build step returns a different interface, guiding the caller through a required sequence. Step 1 returns an interface with only step 2 methods, step 2 returns step 3, etc. Compile-time enforcement of step order.",
      code: {
        Python: `class ConnectionStep1:
    def __init__(self): self._host = ""; self._port = 0; self._db = ""
    def host(self, h: str):
        self._host = h
        return ConnectionStep2(self)

class ConnectionStep2:
    def __init__(self, prev): self._prev = prev
    def port(self, p: int):
        self._prev._port = p
        return ConnectionStep3(self._prev)

class ConnectionStep3:
    def __init__(self, prev): self._prev = prev
    def database(self, db: str):
        self._prev._db = db
        return self
    def build(self):
        p = self._prev
        return f"{p._host}:{p._port}/{p._db}"

# ── Usage — compiler guides the order ──
conn = ConnectionStep1().host("localhost").port(5432).database("mydb").build()
print(conn)`,
        Go: `package main

import "fmt"

type HostStep struct{ host string }
type PortStep struct{ host string; port int }
type DBStep struct{ host string; port int; db string }

func Start() *HostStep { return &HostStep{} }
func (s *HostStep) Host(h string) *PortStep { return &PortStep{host: h} }
func (s *PortStep) Port(p int) *DBStep { return &DBStep{host: s.host, port: p} }
func (s *DBStep) Database(db string) string {
	return fmt.Sprintf("%s:%d/%s", s.host, s.port, db)
}

func main() {
	conn := Start().Host("localhost").Port(5432).Database("mydb")
	fmt.Println(conn)
}`,
        Java: `interface HostStep { PortStep host(String h); }
interface PortStep { DBStep port(int p); }
interface DBStep { String database(String db); }

class ConnectionBuilder implements HostStep, PortStep, DBStep {
    private String host; private int port;

    static HostStep create() { return new ConnectionBuilder(); }
    public PortStep host(String h) { this.host = h; return this; }
    public DBStep port(int p) { this.port = p; return this; }
    public String database(String db) { return host + ":" + port + "/" + db; }
}

// Usage: ConnectionBuilder.create().host("localhost").port(5432).database("mydb");`,
        TypeScript: `interface HostStep { host(h: string): PortStep; }
interface PortStep { port(p: number): DBStep; }
interface DBStep { database(db: string): string; }

class ConnectionBuilder implements HostStep, PortStep, DBStep {
  private _host = ""; private _port = 0;
  static create(): HostStep { return new ConnectionBuilder(); }
  host(h: string): PortStep { this._host = h; return this; }
  port(p: number): DBStep { this._port = p; return this; }
  database(db: string): string { return \`\${this._host}:\${this._port}/\${db}\`; }
}

const conn = ConnectionBuilder.create()
  .host("localhost").port(5432).database("mydb");`,
        Rust: `struct HostStep;
struct PortStep { host: String }
struct DBStep { host: String, port: u16 }

impl HostStep {
    fn host(self, h: &str) -> PortStep { PortStep { host: h.into() } }
}
impl PortStep {
    fn port(self, p: u16) -> DBStep { DBStep { host: self.host, port: p } }
}
impl DBStep {
    fn database(self, db: &str) -> String { format!("{}:{}/{}", self.host, self.port, db) }
}

fn main() {
    let conn = HostStep.host("localhost").port(5432).database("mydb");
    println!("{}", conn);
}`,
      },
      pros: [
        "Compile-time enforcement of step ordering — impossible to skip required steps",
        "IDE shows only valid next steps at each point",
        "Self-documenting — the type system is the documentation",
      ],
      cons: [
        "More boilerplate — one interface per step",
        "Cannot go back to a previous step without starting over",
        "Harder to add optional steps mid-sequence",
      ],
    },
    {
      id: 3,
      name: "Director + Builder Separation",
      description:
        "The Director class encapsulates common build sequences. Multiple Directors can reuse the same Builder interface to produce different product configurations. Useful when several standard configurations are needed alongside custom builds.",
      code: {
        Python: `class PizzaBuilder:
    def __init__(self): self._size="M"; self._toppings=[]; self._crust="thin"
    def size(self, s): self._size = s; return self
    def topping(self, t): self._toppings.append(t); return self
    def crust(self, c): self._crust = c; return self
    def build(self): return f"{self._size} {self._crust} pizza: {', '.join(self._toppings)}"

class PizzaDirector:
    @staticmethod
    def margherita():
        return PizzaBuilder().size("M").crust("thin").topping("mozzarella").topping("basil").build()

    @staticmethod
    def meat_lovers():
        return PizzaBuilder().size("L").crust("thick").topping("pepperoni").topping("sausage").topping("bacon").build()

# ── Usage ──
print(PizzaDirector.margherita())
print(PizzaDirector.meat_lovers())`,
        Go: `package main

import "fmt"

type PizzaBuilder struct {
	size, crust string
	toppings    []string
}

func NewPizzaBuilder() *PizzaBuilder { return &PizzaBuilder{size: "M", crust: "thin"} }
func (b *PizzaBuilder) Size(s string) *PizzaBuilder   { b.size = s; return b }
func (b *PizzaBuilder) Crust(c string) *PizzaBuilder   { b.crust = c; return b }
func (b *PizzaBuilder) Topping(t string) *PizzaBuilder { b.toppings = append(b.toppings, t); return b }
func (b *PizzaBuilder) Build() string {
	return fmt.Sprintf("%s %s pizza: %v", b.size, b.crust, b.toppings)
}

func Margherita() string {
	return NewPizzaBuilder().Size("M").Crust("thin").Topping("mozzarella").Topping("basil").Build()
}

func main() { fmt.Println(Margherita()) }`,
        Java: `class PizzaDirector {
    static String margherita() {
        return new PizzaBuilder().size("M").crust("thin")
            .topping("mozzarella").topping("basil").build();
    }
    static String meatLovers() {
        return new PizzaBuilder().size("L").crust("thick")
            .topping("pepperoni").topping("sausage").build();
    }
}`,
        TypeScript: `class PizzaDirector {
  static margherita(): string {
    return new PizzaBuilder().size("M").crust("thin")
      .topping("mozzarella").topping("basil").build();
  }
  static meatLovers(): string {
    return new PizzaBuilder().size("L").crust("thick")
      .topping("pepperoni").topping("sausage").topping("bacon").build();
  }
}

console.log(PizzaDirector.margherita());`,
        Rust: `fn margherita() -> String {
    PizzaBuilder::new()
        .size("M").crust("thin")
        .topping("mozzarella").topping("basil")
        .build()
}

fn meat_lovers() -> String {
    PizzaBuilder::new()
        .size("L").crust("thick")
        .topping("pepperoni").topping("sausage").topping("bacon")
        .build()
}

fn main() {
    println!("{}", margherita());
    println!("{}", meat_lovers());
}`,
      },
      pros: [
        "Encapsulates common configurations — DRY principle",
        "Client code can still use the builder directly for custom builds",
        "Director methods serve as documentation of standard configurations",
      ],
      cons: [
        "Extra class/module when only one configuration is needed",
        "Director must be kept in sync with builder changes",
        "Can become a dumping ground for too many preset configurations",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Order Enforcement", "Boilerplate", "Flexibility", "Best For",
  ],
  comparisonRows: [
    ["Fluent Builder", "Runtime (build())", "Low", "High", "Most applications, APIs"],
    ["Step Builder", "Compile-time", "High", "Low", "Safety-critical sequences"],
    ["Director + Builder", "Director controls", "Medium", "Medium", "Reusable presets + custom builds"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Creational" },
    {
      aspect: "Key Benefit",
      detail:
        "Eliminates telescoping constructors and produces readable, step-by-step object assembly with validation at build time",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Using Builder for simple objects with 2-3 fields — the overhead isn't justified. Reserve it for genuinely complex construction.",
    },
    {
      aspect: "vs. Factory Method",
      detail:
        "Factory Method creates objects in one step; Builder constructs them incrementally with many optional configurations",
    },
    {
      aspect: "Thread Safety",
      detail:
        "Builders are typically single-use, not shared across threads. If reuse is needed, create new builder instances.",
    },
    {
      aspect: "When to Use",
      detail:
        "Objects with many optional parameters, conditional assembly, validation at construction time, or when a Director can encode standard configurations",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Simple objects with few fields, when a constructor or factory method suffices, or when the construction sequence is trivial",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (can use Builder for complex products), Composite (builders often build tree structures), Fluent Interface (technique used by builders)",
    },
  ],

  antiPatterns: [
    {
      name: "Builder for Simple Objects",
      description:
        "Creating a builder for a class with 2-3 required fields and no optional ones. The builder adds boilerplate without benefit — a simple constructor is clearer.",
      betterAlternative:
        "Use a plain constructor or named parameters (in languages that support them). Reserve Builder for objects with 5+ optional fields or complex validation.",
    },
    {
      name: "Mutable Product After Build",
      description:
        "The build() method returns a mutable object that callers can modify after construction. This defeats the purpose of controlled construction and invites bugs.",
      betterAlternative:
        "Make the Product immutable (frozen dataclass, final fields, readonly properties). All configuration happens through the builder, not after build().",
    },
    {
      name: "Reusable Builder Without Reset",
      description:
        "Reusing a builder instance to create multiple products without resetting state. The second product inherits leftover state from the first, causing subtle bugs.",
      betterAlternative:
        "Either create a new builder for each product, or implement a reset() method that clears all state. Document the intended usage clearly.",
    },
    {
      name: "No Validation in build()",
      description:
        "The build() method blindly constructs the product without checking invariants. Invalid objects are created and fail at runtime instead of at construction time.",
      betterAlternative:
        "Always validate in build(): check required fields are set, validate field combinations, and throw/return errors for invalid configurations.",
    },
    {
      name: "Builder Doing Too Much",
      description:
        "A builder that not only constructs the object but also persists it, sends notifications, or triggers side effects. This violates SRP.",
      betterAlternative:
        "Builder's sole responsibility is construction. Persistence, notification, and side effects belong in separate services that receive the built product.",
    },
  ],
};

export default builderData;
