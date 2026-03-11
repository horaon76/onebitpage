import { PatternData } from "@/lib/patterns/types";

const strategyData: PatternData = {
  slug: "strategy",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Strategy Pattern",
  subtitle:
    "Define a family of algorithms, encapsulate each one, and make them interchangeable so the algorithm can vary independently from clients that use it.",

  intent:
    "Many operations can be performed in multiple ways — sorting can use quicksort, mergesort, or heapsort; payment can go through credit card, PayPal, or crypto; compression can use gzip, brotli, or zstd. Hard-coding one algorithm creates rigid code. Using if/else chains to switch between algorithms violates the Open/Closed Principle and bloats the class.\n\nThe Strategy pattern extracts each algorithm into its own class that implements a common interface. The context object holds a reference to a Strategy and delegates the work to it. Swapping strategies is a one-line change — no conditionals, no subclassing, no modifying the context.\n\nThis is one of the most frequently used patterns in modern software — from sorting comparators and middleware pipelines to pricing engines and authentication providers.",

  classDiagramSvg: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#st-arr); }
    .s-dash { stroke-dasharray: 5,3; }
    .s-ital { font-style: italic; }
  </style>
  <defs>
    <marker id="st-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Context -->
  <rect x="10" y="10" width="180" height="70" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">Context</text>
  <line x1="10" y1="32" x2="190" y2="32" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">-strategy: Strategy</text>
  <text x="20" y="63" class="s-member s-diagram-member">+setStrategy(s): void</text>
  <text x="20" y="78" class="s-member s-diagram-member">+execute(): Result</text>
  <!-- Strategy Interface -->
  <rect x="260" y="10" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="360" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="360" y="42" text-anchor="middle" class="s-title s-diagram-title">Strategy</text>
  <line x1="260" y1="45" x2="460" y2="45" class="s-diagram-line"/>
  <text x="270" y="60" class="s-member s-diagram-member s-ital">+execute(data): Result</text>
  <!-- ConcreteStrategyA -->
  <rect x="220" y="120" width="110" height="45" class="s-box s-diagram-box"/>
  <text x="275" y="138" text-anchor="middle" class="s-title s-diagram-title">StrategyA</text>
  <line x1="220" y1="142" x2="330" y2="142" class="s-diagram-line"/>
  <text x="228" y="158" class="s-member s-diagram-member">+execute()</text>
  <!-- ConcreteStrategyB -->
  <rect x="360" y="120" width="110" height="45" class="s-box s-diagram-box"/>
  <text x="415" y="138" text-anchor="middle" class="s-title s-diagram-title">StrategyB</text>
  <line x1="360" y1="142" x2="470" y2="142" class="s-diagram-line"/>
  <text x="368" y="158" class="s-member s-diagram-member">+execute()</text>
  <!-- Arrows -->
  <line x1="190" y1="37" x2="260" y2="37" class="s-arr s-diagram-arrow"/>
  <line x1="275" y1="120" x2="330" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="415" y1="120" x2="400" y2="65" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Context holds a reference to a Strategy interface and delegates execution to it. Concrete strategies (StrategyA, StrategyB) each implement the algorithm differently. The client sets the desired strategy on the Context, then calls execute(). Swapping strategies changes behaviour without modifying the Context.",

  diagramComponents: [
    {
      name: "Context",
      description:
        "Holds a reference to a Strategy and delegates work to it via execute(). Provides setStrategy() to swap algorithms at runtime. The Context doesn't know which concrete strategy it's using — it depends only on the interface.",
    },
    {
      name: "Strategy (Interface)",
      description:
        "Declares the execute(data) method that all concrete strategies must implement. This common interface allows the Context to work with any strategy interchangeably.",
    },
    {
      name: "ConcreteStrategy",
      description:
        "Implements the Strategy interface with a specific algorithm. Each concrete strategy encapsulates one variant (e.g., QuickSort vs. MergeSort, CreditCard vs. PayPal). New strategies can be added without modifying existing code.",
    },
  ],

  solutionDetail:
    "**The Problem:** A class needs to use one of several algorithms, and the choice may change at runtime. Embedding all algorithms in the class via if/else or switch violates SRP and OCP.\n\n**The Strategy Solution:** Extract each algorithm into its own class implementing a shared interface. The Context holds a Strategy reference and delegates to it.\n\n**How It Works:**\n\n1. **Define the Strategy interface**: Declares the method signature that all algorithms share (e.g., `sort(data)`, `compress(bytes)`, `calculatePrice(order)`).\n\n2. **Implement ConcreteStrategies**: Each encapsulates one algorithm. QuickSortStrategy, MergeSortStrategy, etc.\n\n3. **Context holds Strategy**: The context stores a reference to the current strategy. Its main method delegates to `strategy.execute()`.\n\n4. **Client configures**: The client selects a strategy (based on config, user input, or runtime conditions) and passes it to the Context.\n\n**Key Insight:** Strategy is the OOP equivalent of passing functions as arguments. In languages with first-class functions, a strategy can simply be a function — no class needed. The pattern shines when strategies have state or complex setup.",

  characteristics: [
    "Family of interchangeable algorithms behind a common interface",
    "Context delegates to the strategy — doesn't implement the algorithm itself",
    "Strategies can be swapped at runtime via setStrategy()",
    "Eliminates conditional logic (if/else, switch) for algorithm selection",
    "Each strategy is independently testable and reusable",
    "New strategies can be added without modifying existing code (OCP)",
    "In functional languages, strategies are often just functions or lambdas",
  ],

  useCases: [
    {
      id: 1,
      title: "Sorting Algorithm Selection",
      domain: "Algorithms / Libraries",
      description:
        "A collection library supports multiple sorting algorithms. The caller picks the best one based on data characteristics (small/large, nearly sorted, etc.).",
      whySingleton:
        "Each sorting algorithm (QuickSort, MergeSort, InsertionSort) is a Strategy. The Sorter context delegates to whichever is selected.",
      code: `interface SortStrategy { sort(arr: number[]): number[]; }
class QuickSort implements SortStrategy { sort(arr) { /* quicksort */ } }
class MergeSort implements SortStrategy { sort(arr) { /* mergesort */ } }
const sorter = new Sorter(new QuickSort());
sorter.sort(data);`,
    },
    {
      id: 2,
      title: "Payment Processing",
      domain: "E-Commerce",
      description:
        "An online store accepts multiple payment methods. Each has different validation, processing, and confirmation logic.",
      whySingleton:
        "CreditCard, PayPal, and Crypto each implement PaymentStrategy. The checkout flow delegates to the selected method without knowing the details.",
      code: `interface PaymentStrategy { pay(amount: number): Receipt; }
class CreditCard implements PaymentStrategy { pay(amt) { /* charge card */ } }
class PayPal implements PaymentStrategy { pay(amt) { /* PayPal API */ } }
checkout.setPayment(new CreditCard(cardInfo));
checkout.processPayment(99.99);`,
    },
    {
      id: 3,
      title: "Compression Algorithm",
      domain: "Backend / Infrastructure",
      description:
        "A file service supports multiple compression formats. The algorithm depends on content type, network bandwidth, or client capability.",
      whySingleton:
        "GzipStrategy, BrotliStrategy, ZstdStrategy each implement CompressionStrategy. The FileService delegates compression to whichever is configured.",
      code: `interface CompressionStrategy { compress(data: Buffer): Buffer; }
class GzipStrategy implements CompressionStrategy {
  compress(data) { return gzip(data); }
}
fileService.setCompression(new BrotliStrategy());
fileService.save(fileData);`,
    },
    {
      id: 4,
      title: "Route Navigation",
      domain: "Maps / Travel",
      description:
        "A navigation app calculates routes using different strategies: fastest, shortest, least tolls, scenic. The user picks the strategy.",
      whySingleton:
        "Each routing algorithm is a RouteStrategy. The Navigator context delegates pathfinding to the selected strategy without changing its own code.",
      code: `interface RouteStrategy { calculate(from: Point, to: Point): Route; }
class FastestRoute implements RouteStrategy { calculate(f, t) { /* Dijkstra */ } }
class ScenicRoute implements RouteStrategy { calculate(f, t) { /* prefer parks */ } }
navigator.setStrategy(new ScenicRoute());`,
    },
    {
      id: 5,
      title: "Authentication Strategy",
      domain: "Security / IAM",
      description:
        "An API gateway supports multiple authentication methods: JWT, OAuth2, API key, mTLS. The method depends on the client type.",
      whySingleton:
        "Each auth method is an AuthStrategy. The gateway middleware delegates token validation to the configured strategy.",
      code: `interface AuthStrategy { authenticate(req: Request): User | null; }
class JWTAuth implements AuthStrategy {
  authenticate(req) { return verifyJWT(req.headers.authorization); }
}
gateway.setAuth(new JWTAuth());`,
    },
    {
      id: 6,
      title: "Pricing / Discount Rules",
      domain: "E-Commerce / SaaS",
      description:
        "A pricing engine applies different discount strategies: percentage off, fixed amount, buy-one-get-one, tiered volume pricing. The strategy varies by promotion.",
      whySingleton:
        "Each discount rule is a PricingStrategy. The cart applies the active promotion's strategy to calculate the final price.",
      code: `interface PricingStrategy { apply(price: number, qty: number): number; }
class PercentOff implements PricingStrategy {
  constructor(private pct: number) {}
  apply(price, qty) { return price * qty * (1 - this.pct); }
}`,
    },
    {
      id: 7,
      title: "Text Rendering / Formatting",
      domain: "Document Processing",
      description:
        "A report generator outputs to multiple formats: HTML, PDF, Markdown, plain text. The rendering strategy changes based on the output target.",
      whySingleton:
        "Each format is a RenderStrategy. The ReportGenerator delegates output formatting without knowing the specific format.",
      code: `interface RenderStrategy { render(doc: Document): string; }
class MarkdownRender implements RenderStrategy {
  render(doc) { return \`# \${doc.title}\n\n\${doc.body}\`; }
}
generator.setRenderer(new HTMLRender());`,
    },
    {
      id: 8,
      title: "Caching Eviction Policy",
      domain: "Infrastructure",
      description:
        "A cache needs an eviction policy when it reaches capacity. Different policies suit different workloads: LRU, LFU, FIFO, TTL-based.",
      whySingleton:
        "Each eviction policy is an EvictionStrategy. The Cache delegates the decision of which item to evict to the selected strategy.",
      code: `interface EvictionStrategy { evict(entries: CacheEntry[]): string; }
class LRUEviction implements EvictionStrategy {
  evict(entries) { return entries.sort((a,b) => a.lastAccess - b.lastAccess)[0].key; }
}
cache.setEviction(new LRUEviction());`,
    },
    {
      id: 9,
      title: "Notification Channel Selection",
      domain: "Communication",
      description:
        "A notification service can send via email, SMS, push notification, or Slack. The channel is chosen based on user preferences and message priority.",
      whySingleton:
        "Each channel is a NotificationStrategy. The NotificationService delegates delivery to the user's preferred channel.",
      code: `interface NotifyStrategy { send(user: User, msg: string): void; }
class EmailNotify implements NotifyStrategy {
  send(user, msg) { sendEmail(user.email, msg); }
}
class SlackNotify implements NotifyStrategy {
  send(user, msg) { postToSlack(user.slackId, msg); }
}`,
    },
    {
      id: 10,
      title: "Retry / Backoff Strategy",
      domain: "Microservices / Resilience",
      description:
        "A service client retries failed requests. The delay between retries varies: constant, linear, exponential, jitter-based. The strategy depends on the failure mode.",
      whySingleton:
        "Each backoff algorithm is a RetryStrategy. The HTTPClient delegates delay calculation to the configured strategy between retries.",
      code: `interface RetryStrategy { delay(attempt: number): number; }
class ExponentialBackoff implements RetryStrategy {
  delay(attempt) { return Math.min(1000 * 2 ** attempt, 30000); }
}
client.setRetry(new ExponentialBackoff());`,
    },
    {
      id: 11,
      title: "Tax Calculation by Region",
      domain: "Finance / Compliance",
      description:
        "Tax rules vary by jurisdiction. US sales tax, EU VAT, and Canadian GST/PST each have different calculation logic. The strategy is selected by the customer's location.",
      whySingleton:
        "Each tax regime is a TaxStrategy. The InvoiceService delegates tax calculation to the region-appropriate strategy.",
      code: `interface TaxStrategy { calculate(subtotal: number): number; }
class USStateTax implements TaxStrategy {
  constructor(private rate: number) {}
  calculate(subtotal) { return subtotal * this.rate; }
}
invoice.setTaxStrategy(new EUVATStrategy(0.20));`,
    },
    {
      id: 12,
      title: "Search Ranking Algorithm",
      domain: "Search / ML",
      description:
        "A search engine ranks results using different algorithms: TF-IDF, BM25, vector similarity, PageRank. The ranking strategy can be A/B tested by swapping implementations.",
      whySingleton:
        "Each ranking algorithm is a RankStrategy. The SearchEngine delegates scoring to the active strategy, enabling easy A/B testing.",
      code: `interface RankStrategy { score(query: string, doc: Document): number; }
class BM25Strategy implements RankStrategy {
  score(query, doc) { return bm25(query, doc.content, doc.stats); }
}
searchEngine.setRanker(new BM25Strategy());`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Payment Processing — Multi-Method Checkout",
      domain: "E-Commerce",
      problem:
        "An online store must accept credit cards, PayPal, and cryptocurrency. Each payment method has different validation, API calls, and confirmation flows. Adding a new method shouldn't require modifying the checkout logic.",
      solution:
        "Each payment method implements a PaymentStrategy interface. The Checkout context holds the selected strategy and delegates payment processing to it.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="s-title s-diagram-title">Checkout</text>
  <line x1="10" y1="32" x2="180" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-strategy: PaymentStrategy</text>
  <text x="18" y="60" class="s-member s-diagram-member">+pay(amount): Receipt</text>
  <rect x="230" y="10" width="180" height="40" class="s-box s-diagram-box"/>
  <text x="320" y="34" text-anchor="middle" class="s-title s-diagram-title">PaymentStrategy</text>
  <rect x="140" y="90" width="120" height="40" class="s-box s-diagram-box"/>
  <text x="200" y="114" text-anchor="middle" class="s-title s-diagram-title">CreditCard</text>
  <rect x="290" y="90" width="120" height="40" class="s-box s-diagram-box"/>
  <text x="350" y="114" text-anchor="middle" class="s-title s-diagram-title">PayPal</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Receipt:
    transaction_id: str
    amount: float
    method: str

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> Receipt: ...

    @abstractmethod
    def validate(self) -> bool: ...

class CreditCardPayment(PaymentStrategy):
    def __init__(self, card_number: str, cvv: str, expiry: str):
        self.card_number = card_number
        self.cvv = cvv
        self.expiry = expiry

    def validate(self) -> bool:
        return len(self.card_number) == 16 and len(self.cvv) == 3

    def pay(self, amount: float) -> Receipt:
        if not self.validate():
            raise ValueError("Invalid card")
        # Call payment gateway API
        return Receipt(f"CC-{self.card_number[-4:]}", amount, "credit_card")

class PayPalPayment(PaymentStrategy):
    def __init__(self, email: str):
        self.email = email

    def validate(self) -> bool:
        return "@" in self.email

    def pay(self, amount: float) -> Receipt:
        if not self.validate():
            raise ValueError("Invalid PayPal email")
        return Receipt(f"PP-{self.email}", amount, "paypal")

class CryptoPayment(PaymentStrategy):
    def __init__(self, wallet_address: str, coin: str = "BTC"):
        self.wallet_address = wallet_address
        self.coin = coin

    def validate(self) -> bool:
        return len(self.wallet_address) >= 26

    def pay(self, amount: float) -> Receipt:
        if not self.validate():
            raise ValueError("Invalid wallet address")
        return Receipt(f"CRYPTO-{self.wallet_address[:8]}", amount, self.coin)

class Checkout:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy

    def process(self, amount: float) -> Receipt:
        print(f"Processing \${amount:.2f}...")
        receipt = self._strategy.pay(amount)
        print(f"Paid via {receipt.method}: {receipt.transaction_id}")
        return receipt

# ── Usage ──
checkout = Checkout(CreditCardPayment("4111111111111111", "123", "12/25"))
checkout.process(99.99)

checkout.set_strategy(PayPalPayment("user@example.com"))
checkout.process(49.99)

checkout.set_strategy(CryptoPayment("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"))
checkout.process(199.99)`,
        Go: `package main

import "fmt"

type Receipt struct {
	TxID   string
	Amount float64
	Method string
}

type PaymentStrategy interface {
	Pay(amount float64) Receipt
	Validate() bool
}

type CreditCard struct{ Number, CVV string }
func (c *CreditCard) Validate() bool { return len(c.Number) == 16 }
func (c *CreditCard) Pay(amount float64) Receipt {
	return Receipt{fmt.Sprintf("CC-%s", c.Number[12:]), amount, "credit_card"}
}

type PayPal struct{ Email string }
func (p *PayPal) Validate() bool { return true }
func (p *PayPal) Pay(amount float64) Receipt {
	return Receipt{fmt.Sprintf("PP-%s", p.Email), amount, "paypal"}
}

type Checkout struct{ Strategy PaymentStrategy }
func (co *Checkout) Process(amount float64) Receipt {
	fmt.Printf("Processing $%.2f...\\n", amount)
	r := co.Strategy.Pay(amount)
	fmt.Printf("Paid via %s: %s\\n", r.Method, r.TxID)
	return r
}

func main() {
	co := &Checkout{Strategy: &CreditCard{"4111111111111111", "123"}}
	co.Process(99.99)
	co.Strategy = &PayPal{"user@example.com"}
	co.Process(49.99)
}`,
        Java: `interface PaymentStrategy {
    Receipt pay(double amount);
    boolean validate();
}

record Receipt(String txId, double amount, String method) {}

class CreditCardPayment implements PaymentStrategy {
    private final String number, cvv;
    CreditCardPayment(String num, String cvv) { this.number = num; this.cvv = cvv; }
    public boolean validate() { return number.length() == 16; }
    public Receipt pay(double amount) {
        return new Receipt("CC-" + number.substring(12), amount, "credit_card");
    }
}

class PayPalPayment implements PaymentStrategy {
    private final String email;
    PayPalPayment(String email) { this.email = email; }
    public boolean validate() { return email.contains("@"); }
    public Receipt pay(double amount) {
        return new Receipt("PP-" + email, amount, "paypal");
    }
}

class Checkout {
    private PaymentStrategy strategy;
    Checkout(PaymentStrategy s) { this.strategy = s; }
    void setStrategy(PaymentStrategy s) { this.strategy = s; }
    Receipt process(double amount) {
        var receipt = strategy.pay(amount);
        System.out.printf("Paid via %s: %s%n", receipt.method(), receipt.txId());
        return receipt;
    }
}`,
        TypeScript: `interface PaymentStrategy {
  pay(amount: number): Receipt;
  validate(): boolean;
}

interface Receipt { txId: string; amount: number; method: string; }

class CreditCardPayment implements PaymentStrategy {
  constructor(private number: string, private cvv: string) {}
  validate() { return this.number.length === 16; }
  pay(amount: number): Receipt {
    return { txId: \`CC-\${this.number.slice(-4)}\`, amount, method: "credit_card" };
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}
  validate() { return this.email.includes("@"); }
  pay(amount: number): Receipt {
    return { txId: \`PP-\${this.email}\`, amount, method: "paypal" };
  }
}

class Checkout {
  constructor(private strategy: PaymentStrategy) {}
  setStrategy(s: PaymentStrategy) { this.strategy = s; }
  process(amount: number): Receipt {
    const receipt = this.strategy.pay(amount);
    console.log(\`Paid via \${receipt.method}: \${receipt.txId}\`);
    return receipt;
  }
}

// ── Usage ──
const checkout = new Checkout(new CreditCardPayment("4111111111111111", "123"));
checkout.process(99.99);
checkout.setStrategy(new PayPalPayment("user@example.com"));
checkout.process(49.99);`,
        Rust: `trait PaymentStrategy {
    fn pay(&self, amount: f64) -> Receipt;
    fn validate(&self) -> bool;
}

struct Receipt { tx_id: String, amount: f64, method: String }

struct CreditCard { number: String, cvv: String }
impl PaymentStrategy for CreditCard {
    fn validate(&self) -> bool { self.number.len() == 16 }
    fn pay(&self, amount: f64) -> Receipt {
        Receipt { tx_id: format!("CC-{}", &self.number[12..]), amount, method: "credit_card".into() }
    }
}

struct PayPal { email: String }
impl PaymentStrategy for PayPal {
    fn validate(&self) -> bool { self.email.contains('@') }
    fn pay(&self, amount: f64) -> Receipt {
        Receipt { tx_id: format!("PP-{}", self.email), amount, method: "paypal".into() }
    }
}

struct Checkout { strategy: Box<dyn PaymentStrategy> }
impl Checkout {
    fn process(&self, amount: f64) -> Receipt {
        let r = self.strategy.pay(amount);
        println!("Paid via {}: {}", r.method, r.tx_id);
        r
    }
}

fn main() {
    let co = Checkout { strategy: Box::new(CreditCard { number: "4111111111111111".into(), cvv: "123".into() }) };
    co.process(99.99);
}`,
      },
      considerations: [
        "Payment strategy selection may come from user input or configuration",
        "Each strategy may need different constructor parameters (card vs email vs wallet)",
        "Use Factory to create the right strategy from a payment method string",
        "Thread safety: strategies should be stateless or use per-request instances",
        "Consider retry strategies for transient payment gateway failures",
      ],
    },
    {
      id: 2,
      title: "Sorting — Adaptive Algorithm Selection",
      domain: "Algorithms",
      problem:
        "A data processing library must support multiple sorting algorithms. Small arrays perform better with insertion sort, nearly-sorted data benefits from Timsort, and large random arrays suit quicksort. The caller should pick the strategy based on data characteristics.",
      solution:
        "Each sorting algorithm implements SortStrategy. The Sorter context delegates to the selected strategy.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="160" height="55" class="s-box s-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="s-title s-diagram-title">Sorter</text>
  <line x1="10" y1="32" x2="170" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-strategy: SortStrategy</text>
  <text x="18" y="60" class="s-member s-diagram-member">+sort(arr): arr</text>
  <rect x="220" y="10" width="190" height="40" class="s-box s-diagram-box"/>
  <text x="315" y="34" text-anchor="middle" class="s-title s-diagram-title">SortStrategy</text>
  <rect x="220" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="265" y="102" text-anchor="middle" class="s-title s-diagram-title">QuickSort</text>
  <rect x="330" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="375" y="102" text-anchor="middle" class="s-title s-diagram-title">MergeSort</text>
</svg>`,
      code: {
        Python: `from typing import Protocol, TypeVar

T = TypeVar("T")

class SortStrategy(Protocol):
    def sort(self, arr: list[int]) -> list[int]: ...

class QuickSort:
    def sort(self, arr: list[int]) -> list[int]:
        if len(arr) <= 1:
            return arr
        pivot = arr[len(arr) // 2]
        left = [x for x in arr if x < pivot]
        mid = [x for x in arr if x == pivot]
        right = [x for x in arr if x > pivot]
        return self.sort(left) + mid + self.sort(right)

class InsertionSort:
    def sort(self, arr: list[int]) -> list[int]:
        result = arr.copy()
        for i in range(1, len(result)):
            key = result[i]
            j = i - 1
            while j >= 0 and result[j] > key:
                result[j + 1] = result[j]
                j -= 1
            result[j + 1] = key
        return result

class Sorter:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy

    def sort(self, arr: list[int]) -> list[int]:
        return self._strategy.sort(arr)

# ── Adaptive selection ──
data = [5, 2, 8, 1, 9, 3]
sorter = Sorter(InsertionSort() if len(data) < 20 else QuickSort())
print(sorter.sort(data))`,
        Go: `package main

import (
	"fmt"
	"sort"
)

type SortStrategy interface{ Sort(arr []int) []int }

type QuickSort struct{}
func (q *QuickSort) Sort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	sort.Ints(result) // stdlib quicksort
	return result
}

type InsertionSort struct{}
func (i *InsertionSort) Sort(arr []int) []int {
	result := make([]int, len(arr))
	copy(result, arr)
	for j := 1; j < len(result); j++ {
		key := result[j]
		k := j - 1
		for k >= 0 && result[k] > key { result[k+1] = result[k]; k-- }
		result[k+1] = key
	}
	return result
}

type Sorter struct{ Strategy SortStrategy }
func (s *Sorter) Sort(arr []int) []int { return s.Strategy.Sort(arr) }

func main() {
	data := []int{5, 2, 8, 1, 9}
	s := &Sorter{Strategy: &InsertionSort{}}
	fmt.Println(s.Sort(data))
}`,
        Java: `import java.util.*;

interface SortStrategy { int[] sort(int[] arr); }

class QuickSort implements SortStrategy {
    public int[] sort(int[] arr) {
        int[] result = arr.clone();
        Arrays.sort(result);
        return result;
    }
}

class InsertionSort implements SortStrategy {
    public int[] sort(int[] arr) {
        int[] r = arr.clone();
        for (int i = 1; i < r.length; i++) {
            int key = r[i], j = i - 1;
            while (j >= 0 && r[j] > key) { r[j + 1] = r[j]; j--; }
            r[j + 1] = key;
        }
        return r;
    }
}

class Sorter {
    private SortStrategy strategy;
    Sorter(SortStrategy s) { this.strategy = s; }
    int[] sort(int[] arr) { return strategy.sort(arr); }
}`,
        TypeScript: `interface SortStrategy { sort(arr: number[]): number[]; }

class QuickSort implements SortStrategy {
  sort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const mid = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...this.sort(left), ...mid, ...this.sort(right)];
  }
}

class InsertionSort implements SortStrategy {
  sort(arr: number[]): number[] {
    const r = [...arr];
    for (let i = 1; i < r.length; i++) {
      const key = r[i];
      let j = i - 1;
      while (j >= 0 && r[j] > key) { r[j + 1] = r[j]; j--; }
      r[j + 1] = key;
    }
    return r;
  }
}

// ── Adaptive ──
const data = [5, 2, 8, 1, 9];
const strategy = data.length < 20 ? new InsertionSort() : new QuickSort();
console.log(strategy.sort(data));`,
        Rust: `trait SortStrategy { fn sort(&self, arr: &mut Vec<i32>); }

struct QuickSort;
impl SortStrategy for QuickSort {
    fn sort(&self, arr: &mut Vec<i32>) { arr.sort(); }
}

struct InsertionSort;
impl SortStrategy for InsertionSort {
    fn sort(&self, arr: &mut Vec<i32>) {
        for i in 1..arr.len() {
            let key = arr[i];
            let mut j = i as isize - 1;
            while j >= 0 && arr[j as usize] > key {
                arr[(j + 1) as usize] = arr[j as usize];
                j -= 1;
            }
            arr[(j + 1) as usize] = key;
        }
    }
}

fn main() {
    let mut data = vec![5, 2, 8, 1, 9];
    let strategy: Box<dyn SortStrategy> = if data.len() < 20 {
        Box::new(InsertionSort)
    } else {
        Box::new(QuickSort)
    };
    strategy.sort(&mut data);
    println!("{:?}", data);
}`,
      },
      considerations: [
        "Adaptive strategy selection based on input size, pre-sortedness, or data types",
        "Comparator function can itself be a strategy for custom ordering",
        "Stability guarantees vary by algorithm — document which are stable",
        "Memory allocation: in-place vs. out-of-place strategies",
        "Benchmark before choosing — asymptotic complexity isn't the full story",
      ],
    },
    {
      id: 3,
      title: "Compression — Multi-Format File Service",
      domain: "Backend / Infrastructure",
      problem:
        "A file storage service must support multiple compression algorithms. API clients can request gzip, brotli, or zstd based on their capabilities. Adding new algorithms shouldn't modify the service.",
      solution:
        "Each compression algorithm implements CompressionStrategy. The FileService holds the active strategy and delegates compression/decompression to it.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">FileService</text>
  <line x1="10" y1="32" x2="190" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-compressor: Compressor</text>
  <text x="18" y="60" class="s-member s-diagram-member">+save(data): void</text>
  <rect x="240" y="10" width="170" height="40" class="s-box s-diagram-box"/>
  <text x="325" y="34" text-anchor="middle" class="s-title s-diagram-title">CompressionStrategy</text>
  <rect x="220" y="80" width="80" height="35" class="s-box s-diagram-box"/>
  <text x="260" y="102" text-anchor="middle" class="s-title s-diagram-title">Gzip</text>
  <rect x="320" y="80" width="80" height="35" class="s-box s-diagram-box"/>
  <text x="360" y="102" text-anchor="middle" class="s-title s-diagram-title">Brotli</text>
</svg>`,
      code: {
        Python: `import gzip
import zlib
from abc import ABC, abstractmethod

class CompressionStrategy(ABC):
    @abstractmethod
    def compress(self, data: bytes) -> bytes: ...

    @abstractmethod
    def decompress(self, data: bytes) -> bytes: ...

    @property
    @abstractmethod
    def extension(self) -> str: ...

class GzipCompression(CompressionStrategy):
    def compress(self, data: bytes) -> bytes:
        return gzip.compress(data)
    def decompress(self, data: bytes) -> bytes:
        return gzip.decompress(data)
    @property
    def extension(self) -> str: return ".gz"

class ZlibCompression(CompressionStrategy):
    def compress(self, data: bytes) -> bytes:
        return zlib.compress(data, level=9)
    def decompress(self, data: bytes) -> bytes:
        return zlib.decompress(data)
    @property
    def extension(self) -> str: return ".zlib"

class NoCompression(CompressionStrategy):
    def compress(self, data: bytes) -> bytes: return data
    def decompress(self, data: bytes) -> bytes: return data
    @property
    def extension(self) -> str: return ""

class FileService:
    def __init__(self, strategy: CompressionStrategy):
        self._strategy = strategy

    def save(self, filename: str, data: bytes) -> str:
        compressed = self._strategy.compress(data)
        out_name = filename + self._strategy.extension
        ratio = len(compressed) / len(data) * 100
        print(f"Saved {out_name}: {len(data)}B → {len(compressed)}B ({ratio:.0f}%)")
        return out_name

# ── Usage ──
svc = FileService(GzipCompression())
svc.save("report.json", b'{"data": "x" * 10000}')

svc = FileService(NoCompression())
svc.save("tiny.txt", b"hello")`,
        Go: `package main

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
)

type CompressionStrategy interface {
	Compress(data []byte) ([]byte, error)
	Extension() string
}

type GzipCompression struct{}
func (g *GzipCompression) Extension() string { return ".gz" }
func (g *GzipCompression) Compress(data []byte) ([]byte, error) {
	var buf bytes.Buffer
	w := gzip.NewWriter(&buf)
	w.Write(data)
	w.Close()
	return buf.Bytes(), nil
}

type NoCompression struct{}
func (n *NoCompression) Extension() string       { return "" }
func (n *NoCompression) Compress(data []byte) ([]byte, error) { return data, nil }

type FileService struct{ Strategy CompressionStrategy }
func (f *FileService) Save(name string, data []byte) {
	compressed, _ := f.Strategy.Compress(data)
	fmt.Printf("Saved %s%s: %d → %d bytes\\n", name, f.Strategy.Extension(), len(data), len(compressed))
}

func main() {
	svc := &FileService{Strategy: &GzipCompression{}}
	svc.Save("report.json", []byte("hello world repeated many times"))
}`,
        Java: `import java.io.*;
import java.util.zip.*;

interface CompressionStrategy {
    byte[] compress(byte[] data) throws IOException;
    String extension();
}

class GzipCompression implements CompressionStrategy {
    public String extension() { return ".gz"; }
    public byte[] compress(byte[] data) throws IOException {
        var bos = new ByteArrayOutputStream();
        try (var gos = new GZIPOutputStream(bos)) { gos.write(data); }
        return bos.toByteArray();
    }
}

class NoCompression implements CompressionStrategy {
    public String extension() { return ""; }
    public byte[] compress(byte[] data) { return data; }
}

class FileService {
    private CompressionStrategy strategy;
    FileService(CompressionStrategy s) { this.strategy = s; }
    void save(String name, byte[] data) throws IOException {
        byte[] compressed = strategy.compress(data);
        System.out.printf("Saved %s%s: %d → %d bytes%n", name, strategy.extension(), data.length, compressed.length);
    }
}`,
        TypeScript: `interface CompressionStrategy {
  compress(data: Buffer): Buffer;
  extension: string;
}

class GzipCompression implements CompressionStrategy {
  extension = ".gz";
  compress(data: Buffer): Buffer {
    // In Node.js: return zlib.gzipSync(data);
    return data; // placeholder
  }
}

class NoCompression implements CompressionStrategy {
  extension = "";
  compress(data: Buffer): Buffer { return data; }
}

class FileService {
  constructor(private strategy: CompressionStrategy) {}

  save(filename: string, data: Buffer): string {
    const compressed = this.strategy.compress(data);
    const outName = filename + this.strategy.extension;
    console.log(\`Saved \${outName}: \${data.length} → \${compressed.length} bytes\`);
    return outName;
  }
}

const svc = new FileService(new GzipCompression());
svc.save("report.json", Buffer.from("hello world"));`,
        Rust: `use std::io::Write;
use flate2::write::GzEncoder;
use flate2::Compression;

trait CompressionStrategy {
    fn compress(&self, data: &[u8]) -> Vec<u8>;
    fn extension(&self) -> &str;
}

struct GzipCompression;
impl CompressionStrategy for GzipCompression {
    fn extension(&self) -> &str { ".gz" }
    fn compress(&self, data: &[u8]) -> Vec<u8> {
        let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
        encoder.write_all(data).unwrap();
        encoder.finish().unwrap()
    }
}

struct NoCompression;
impl CompressionStrategy for NoCompression {
    fn extension(&self) -> &str { "" }
    fn compress(&self, data: &[u8]) -> Vec<u8> { data.to_vec() }
}

struct FileService { strategy: Box<dyn CompressionStrategy> }
impl FileService {
    fn save(&self, name: &str, data: &[u8]) {
        let compressed = self.strategy.compress(data);
        println!("Saved {}{}: {} → {} bytes", name, self.strategy.extension(), data.len(), compressed.len());
    }
}

fn main() {
    let svc = FileService { strategy: Box::new(GzipCompression) };
    svc.save("report.json", b"hello world");
}`,
      },
      considerations: [
        "Content-type detection to auto-select optimal compression",
        "Compression level as strategy parameter (speed vs. ratio tradeoff)",
        "Streaming compression for large files — strategies must support incremental processing",
        "Thread safety for concurrent compression requests",
        "Decompression strategy must match what was used for compression",
      ],
    },
    {
      id: 4,
      title: "Navigation — Multi-Mode Route Planning",
      domain: "Maps / Travel",
      problem:
        "A navigation app must calculate routes optimized for different criteria: fastest time, shortest distance, fewest tolls, or most scenic. Users switch modes without restarting navigation.",
      solution:
        "Each routing criterion is a RouteStrategy. The Navigator delegates path calculation to the active strategy and re-routes when the user switches modes.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="s-title s-diagram-title">Navigator</text>
  <line x1="10" y1="32" x2="180" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-strategy: RouteStrategy</text>
  <text x="18" y="60" class="s-member s-diagram-member">+navigate(from, to)</text>
  <rect x="230" y="10" width="180" height="40" class="s-box s-diagram-box"/>
  <text x="320" y="34" text-anchor="middle" class="s-title s-diagram-title">RouteStrategy</text>
  <rect x="220" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="265" y="102" text-anchor="middle" class="s-title s-diagram-title">Fastest</text>
  <rect x="330" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="375" y="102" text-anchor="middle" class="s-title s-diagram-title">Scenic</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

@dataclass
class Point:
    lat: float
    lng: float

@dataclass
class Route:
    points: list[Point]
    distance_km: float
    duration_min: float
    tolls: float

class RouteStrategy:
    def calculate(self, start: Point, end: Point) -> Route: ...

class FastestRoute(RouteStrategy):
    def calculate(self, start: Point, end: Point) -> Route:
        # Use Dijkstra with time weights
        return Route([start, end], 45.2, 32, 5.50)

class ShortestRoute(RouteStrategy):
    def calculate(self, start: Point, end: Point) -> Route:
        return Route([start, end], 38.1, 48, 0)

class ScenicRoute(RouteStrategy):
    def calculate(self, start: Point, end: Point) -> Route:
        return Route([start, end], 62.3, 55, 0)

class Navigator:
    def __init__(self, strategy: RouteStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: RouteStrategy) -> None:
        self._strategy = strategy

    def navigate(self, start: Point, end: Point) -> Route:
        route = self._strategy.calculate(start, end)
        print(f"Route: {route.distance_km}km, {route.duration_min}min, tolls: \${route.tolls}")
        return route

nav = Navigator(FastestRoute())
nav.navigate(Point(37.77, -122.42), Point(37.33, -121.89))
nav.set_strategy(ScenicRoute())
nav.navigate(Point(37.77, -122.42), Point(37.33, -121.89))`,
        Go: `package main

import "fmt"

type Point struct{ Lat, Lng float64 }
type Route struct{ DistKm, DurMin, Tolls float64 }

type RouteStrategy interface {
	Calculate(start, end Point) Route
}

type FastestRoute struct{}
func (f *FastestRoute) Calculate(s, e Point) Route {
	return Route{45.2, 32, 5.50}
}

type ScenicRoute struct{}
func (sc *ScenicRoute) Calculate(s, e Point) Route {
	return Route{62.3, 55, 0}
}

type Navigator struct{ Strategy RouteStrategy }
func (n *Navigator) Navigate(s, e Point) Route {
	r := n.Strategy.Calculate(s, e)
	fmt.Printf("Route: %.1fkm, %.0fmin, tolls: $%.2f\\n", r.DistKm, r.DurMin, r.Tolls)
	return r
}

func main() {
	nav := &Navigator{Strategy: &FastestRoute{}}
	nav.Navigate(Point{37.77, -122.42}, Point{37.33, -121.89})
	nav.Strategy = &ScenicRoute{}
	nav.Navigate(Point{37.77, -122.42}, Point{37.33, -121.89})
}`,
        Java: `record Point(double lat, double lng) {}
record Route(double distKm, double durMin, double tolls) {}

interface RouteStrategy { Route calculate(Point start, Point end); }

class FastestRoute implements RouteStrategy {
    public Route calculate(Point s, Point e) { return new Route(45.2, 32, 5.50); }
}
class ScenicRoute implements RouteStrategy {
    public Route calculate(Point s, Point e) { return new Route(62.3, 55, 0); }
}

class Navigator {
    private RouteStrategy strategy;
    Navigator(RouteStrategy s) { this.strategy = s; }
    void setStrategy(RouteStrategy s) { this.strategy = s; }
    Route navigate(Point s, Point e) {
        var r = strategy.calculate(s, e);
        System.out.printf("Route: %.1fkm, %.0fmin, tolls: $%.2f%n", r.distKm(), r.durMin(), r.tolls());
        return r;
    }
}`,
        TypeScript: `interface Point { lat: number; lng: number; }
interface Route { distKm: number; durMin: number; tolls: number; }
interface RouteStrategy { calculate(start: Point, end: Point): Route; }

class FastestRoute implements RouteStrategy {
  calculate(s: Point, e: Point): Route { return { distKm: 45.2, durMin: 32, tolls: 5.50 }; }
}

class ScenicRoute implements RouteStrategy {
  calculate(s: Point, e: Point): Route { return { distKm: 62.3, durMin: 55, tolls: 0 }; }
}

class Navigator {
  constructor(private strategy: RouteStrategy) {}
  setStrategy(s: RouteStrategy) { this.strategy = s; }
  navigate(start: Point, end: Point): Route {
    const r = this.strategy.calculate(start, end);
    console.log(\`Route: \${r.distKm}km, \${r.durMin}min, tolls: $\${r.tolls}\`);
    return r;
  }
}

const nav = new Navigator(new FastestRoute());
nav.navigate({ lat: 37.77, lng: -122.42 }, { lat: 37.33, lng: -121.89 });`,
        Rust: `struct Point { lat: f64, lng: f64 }
struct Route { dist_km: f64, dur_min: f64, tolls: f64 }

trait RouteStrategy { fn calculate(&self, start: &Point, end: &Point) -> Route; }

struct FastestRoute;
impl RouteStrategy for FastestRoute {
    fn calculate(&self, _s: &Point, _e: &Point) -> Route {
        Route { dist_km: 45.2, dur_min: 32.0, tolls: 5.50 }
    }
}

struct ScenicRoute;
impl RouteStrategy for ScenicRoute {
    fn calculate(&self, _s: &Point, _e: &Point) -> Route {
        Route { dist_km: 62.3, dur_min: 55.0, tolls: 0.0 }
    }
}

fn navigate(strategy: &dyn RouteStrategy, s: &Point, e: &Point) {
    let r = strategy.calculate(s, e);
    println!("Route: {:.1}km, {:.0}min, tolls: \${:.2}", r.dist_km, r.dur_min, r.tolls);
}

fn main() {
    let s = Point { lat: 37.77, lng: -122.42 };
    let e = Point { lat: 37.33, lng: -121.89 };
    navigate(&FastestRoute, &s, &e);
    navigate(&ScenicRoute, &s, &e);
}`,
      },
      considerations: [
        "Strategies may need access to external services (traffic API, toll databases)",
        "Caching routes for repeated origin-destination pairs",
        "Combining strategies: weight multiple criteria (70% speed, 30% scenic)",
        "Real-time re-routing when traffic changes mid-trip",
        "Strategy selection UI should preview route statistics before committing",
      ],
    },
    {
      id: 5,
      title: "Pricing Engine — Dynamic Discount Strategies",
      domain: "E-Commerce / SaaS",
      problem:
        "An e-commerce platform runs multiple promotions simultaneously: percentage discounts, fixed amount off, buy-one-get-one, tiered volume pricing. The active promotion changes based on campaigns, and the cart must apply the correct discount strategy.",
      solution:
        "Each discount rule implements PricingStrategy. The Cart holds the active strategy and delegates price calculation to it.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">Cart</text>
  <line x1="10" y1="32" x2="190" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-pricing: PricingStrategy</text>
  <text x="18" y="60" class="s-member s-diagram-member">+total(): number</text>
  <rect x="240" y="10" width="170" height="40" class="s-box s-diagram-box"/>
  <text x="325" y="34" text-anchor="middle" class="s-title s-diagram-title">PricingStrategy</text>
  <rect x="220" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="265" y="102" text-anchor="middle" class="s-title s-diagram-title">PercentOff</text>
  <rect x="330" y="80" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="375" y="102" text-anchor="middle" class="s-title s-diagram-title">TieredVol</text>
</svg>`,
      code: {
        Python: `class PricingStrategy:
    def calculate(self, base_price: float, quantity: int) -> float: ...

class NoDiscount(PricingStrategy):
    def calculate(self, base_price: float, quantity: int) -> float:
        return base_price * quantity

class PercentOff(PricingStrategy):
    def __init__(self, percent: float):
        self.percent = percent
    def calculate(self, base_price: float, quantity: int) -> float:
        return base_price * quantity * (1 - self.percent)

class BuyOneGetOne(PricingStrategy):
    def calculate(self, base_price: float, quantity: int) -> float:
        paid = (quantity + 1) // 2
        return base_price * paid

class TieredVolume(PricingStrategy):
    def __init__(self, tiers: list[tuple[int, float]]):
        self.tiers = sorted(tiers, reverse=True)  # [(qty, discount)]
    def calculate(self, base_price: float, quantity: int) -> float:
        for min_qty, discount in self.tiers:
            if quantity >= min_qty:
                return base_price * quantity * (1 - discount)
        return base_price * quantity

class Cart:
    def __init__(self, pricing: PricingStrategy):
        self._pricing = pricing
        self._items: list[tuple[str, float, int]] = []

    def add(self, name: str, price: float, qty: int) -> None:
        self._items.append((name, price, qty))

    def total(self) -> float:
        return sum(self._pricing.calculate(p, q) for _, p, q in self._items)

# ── Usage ──
cart = Cart(PercentOff(0.20))
cart.add("Widget", 25.00, 3)
print(f"Total: \${cart.total():.2f}")  # $60.00

cart = Cart(BuyOneGetOne())
cart.add("Widget", 25.00, 3)
print(f"Total: \${cart.total():.2f}")  # $50.00`,
        Go: `package main

import "fmt"

type PricingStrategy interface {
	Calculate(basePrice float64, qty int) float64
}

type PercentOff struct{ Percent float64 }
func (p *PercentOff) Calculate(base float64, qty int) float64 {
	return base * float64(qty) * (1 - p.Percent)
}

type BuyOneGetOne struct{}
func (b *BuyOneGetOne) Calculate(base float64, qty int) float64 {
	paid := (qty + 1) / 2
	return base * float64(paid)
}

type Item struct{ Name string; Price float64; Qty int }
type Cart struct {
	Pricing PricingStrategy
	Items   []Item
}
func (c *Cart) Total() float64 {
	total := 0.0
	for _, item := range c.Items {
		total += c.Pricing.Calculate(item.Price, item.Qty)
	}
	return total
}

func main() {
	cart := &Cart{Pricing: &PercentOff{0.20}, Items: []Item{{"Widget", 25.0, 3}}}
	fmt.Printf("Total: $%.2f\\n", cart.Total())
}`,
        Java: `interface PricingStrategy { double calculate(double basePrice, int qty); }

class PercentOff implements PricingStrategy {
    double pct;
    PercentOff(double pct) { this.pct = pct; }
    public double calculate(double base, int qty) { return base * qty * (1 - pct); }
}

class BuyOneGetOne implements PricingStrategy {
    public double calculate(double base, int qty) { return base * ((qty + 1) / 2); }
}

class Cart {
    PricingStrategy pricing;
    record Item(String name, double price, int qty) {}
    List<Item> items = new ArrayList<>();
    Cart(PricingStrategy p) { this.pricing = p; }
    double total() { return items.stream().mapToDouble(i -> pricing.calculate(i.price, i.qty)).sum(); }
}`,
        TypeScript: `interface PricingStrategy { calculate(basePrice: number, qty: number): number; }

class PercentOff implements PricingStrategy {
  constructor(private pct: number) {}
  calculate(base: number, qty: number) { return base * qty * (1 - this.pct); }
}

class BuyOneGetOne implements PricingStrategy {
  calculate(base: number, qty: number) { return base * Math.ceil(qty / 2); }
}

class Cart {
  private items: { name: string; price: number; qty: number }[] = [];
  constructor(private pricing: PricingStrategy) {}
  add(name: string, price: number, qty: number) { this.items.push({ name, price, qty }); }
  total() { return this.items.reduce((s, i) => s + this.pricing.calculate(i.price, i.qty), 0); }
}

const cart = new Cart(new PercentOff(0.20));
cart.add("Widget", 25, 3);
console.log(\`Total: $\${cart.total().toFixed(2)}\`);`,
        Rust: `trait PricingStrategy { fn calculate(&self, base_price: f64, qty: usize) -> f64; }

struct PercentOff { pct: f64 }
impl PricingStrategy for PercentOff {
    fn calculate(&self, base: f64, qty: usize) -> f64 { base * qty as f64 * (1.0 - self.pct) }
}

struct BuyOneGetOne;
impl PricingStrategy for BuyOneGetOne {
    fn calculate(&self, base: f64, qty: usize) -> f64 { base * ((qty + 1) / 2) as f64 }
}

struct Cart {
    pricing: Box<dyn PricingStrategy>,
    items: Vec<(String, f64, usize)>,
}
impl Cart {
    fn total(&self) -> f64 {
        self.items.iter().map(|(_, p, q)| self.pricing.calculate(*p, *q)).sum()
    }
}

fn main() {
    let cart = Cart {
        pricing: Box::new(PercentOff { pct: 0.20 }),
        items: vec![("Widget".into(), 25.0, 3)],
    };
    println!("Total: \${:.2}", cart.total());
}`,
      },
      considerations: [
        "Stacking multiple discounts — should strategies compose or be mutually exclusive?",
        "Minimum price floors to prevent negative totals",
        "Time-based promotions: strategy selection based on date ranges",
        "A/B testing different pricing strategies for conversion optimization",
        "Audit logging of which strategy was applied for each transaction",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Use Classic Strategy (interface + classes) when strategies have state or complex setup. Use Functional Strategy (lambdas/functions) for simple, stateless algorithms. Use Strategy Map for configuration-driven selection.",

  variants: [
    {
      id: 1,
      name: "Classic Strategy (Class-based)",
      description:
        "Each strategy is a class implementing a shared interface. The Context holds a Strategy reference. Best when strategies have state, configuration, or complex initialization.",
      code: {
        Python: `class Strategy:
    def execute(self, data: list[int]) -> list[int]: ...

class BubbleSort(Strategy):
    def execute(self, data: list[int]) -> list[int]:
        arr = data.copy()
        for i in range(len(arr)):
            for j in range(len(arr) - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr

class Context:
    def __init__(self, strategy: Strategy):
        self._strategy = strategy
    def set_strategy(self, strategy: Strategy) -> None:
        self._strategy = strategy
    def execute(self, data: list[int]) -> list[int]:
        return self._strategy.execute(data)`,
        Go: `type Strategy interface { Execute(data []int) []int }

type BubbleSort struct{}
func (b *BubbleSort) Execute(data []int) []int {
	arr := make([]int, len(data))
	copy(arr, data)
	for i := 0; i < len(arr); i++ {
		for j := 0; j < len(arr)-i-1; j++ {
			if arr[j] > arr[j+1] { arr[j], arr[j+1] = arr[j+1], arr[j] }
		}
	}
	return arr
}

type Context struct{ Strategy Strategy }
func (c *Context) Execute(data []int) []int { return c.Strategy.Execute(data) }`,
        Java: `interface Strategy { int[] execute(int[] data); }

class BubbleSort implements Strategy {
    public int[] execute(int[] data) {
        int[] arr = data.clone();
        for (int i = 0; i < arr.length; i++)
            for (int j = 0; j < arr.length - i - 1; j++)
                if (arr[j] > arr[j+1]) { int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; }
        return arr;
    }
}

class Context {
    private Strategy strategy;
    Context(Strategy s) { this.strategy = s; }
    int[] execute(int[] data) { return strategy.execute(data); }
}`,
        TypeScript: `interface Strategy { execute(data: number[]): number[]; }

class BubbleSort implements Strategy {
  execute(data: number[]): number[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++)
      for (let j = 0; j < arr.length - i - 1; j++)
        if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    return arr;
  }
}

class Context {
  constructor(private strategy: Strategy) {}
  setStrategy(s: Strategy) { this.strategy = s; }
  execute(data: number[]) { return this.strategy.execute(data); }
}`,
        Rust: `trait Strategy { fn execute(&self, data: &[i32]) -> Vec<i32>; }

struct BubbleSort;
impl Strategy for BubbleSort {
    fn execute(&self, data: &[i32]) -> Vec<i32> {
        let mut arr = data.to_vec();
        let n = arr.len();
        for i in 0..n {
            for j in 0..n - i - 1 {
                if arr[j] > arr[j + 1] { arr.swap(j, j + 1); }
            }
        }
        arr
    }
}`,
      },
      pros: [
        "Strategies can have state and configuration (thresholds, API keys, etc.)",
        "Easy to test — each strategy is independently instantiable",
        "Clear, explicit structure — good for complex algorithms",
      ],
      cons: [
        "Verbose for simple, stateless strategies",
        "Many small classes can clutter the codebase",
        "Overhead of interface + class for trivial algorithms",
      ],
    },
    {
      id: 2,
      name: "Functional Strategy (Lambda-based)",
      description:
        "Strategies are plain functions or lambdas passed to the context. No classes needed. Best for simple, stateless algorithms in languages with first-class functions.",
      code: {
        Python: `from typing import Callable

SortFn = Callable[[list[int]], list[int]]

def bubble_sort(data: list[int]) -> list[int]:
    arr = data.copy()
    for i in range(len(arr)):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

class Sorter:
    def __init__(self, strategy: SortFn):
        self._strategy = strategy
    def sort(self, data: list[int]) -> list[int]:
        return self._strategy(data)

# Strategy is just a function
sorter = Sorter(sorted)  # built-in sort
sorter = Sorter(bubble_sort)  # custom
sorter = Sorter(lambda d: list(reversed(sorted(d))))  # inline lambda`,
        Go: `package main

type SortFn func([]int) []int

type Sorter struct{ strategy SortFn }
func (s *Sorter) Sort(data []int) []int { return s.strategy(data) }

func main() {
	s := &Sorter{strategy: func(data []int) []int {
		// inline sort
		result := make([]int, len(data))
		copy(result, data)
		sort.Ints(result)
		return result
	}}
	s.Sort([]int{3, 1, 2})
}`,
        Java: `import java.util.*;
import java.util.function.UnaryOperator;

class Sorter {
    private UnaryOperator<int[]> strategy;
    Sorter(UnaryOperator<int[]> s) { this.strategy = s; }
    int[] sort(int[] data) { return strategy.apply(data); }
}

// ── Usage ──
var sorter = new Sorter(arr -> {
    int[] r = arr.clone();
    Arrays.sort(r);
    return r;
});`,
        TypeScript: `type SortFn = (data: number[]) => number[];

class Sorter {
  constructor(private strategy: SortFn) {}
  sort(data: number[]) { return this.strategy(data); }
}

// Strategies are just functions
const ascending: SortFn = (d) => [...d].sort((a, b) => a - b);
const descending: SortFn = (d) => [...d].sort((a, b) => b - a);

const sorter = new Sorter(ascending);
console.log(sorter.sort([3, 1, 2]));  // [1, 2, 3]`,
        Rust: `fn bubble_sort(data: &[i32]) -> Vec<i32> {
    let mut arr = data.to_vec();
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - i - 1 {
            if arr[j] > arr[j + 1] { arr.swap(j, j + 1); }
        }
    }
    arr
}

struct Sorter { strategy: fn(&[i32]) -> Vec<i32> }
impl Sorter {
    fn sort(&self, data: &[i32]) -> Vec<i32> { (self.strategy)(data) }
}

fn main() {
    let s = Sorter { strategy: bubble_sort };
    println!("{:?}", s.sort(&[3, 1, 2]));
}`,
      },
      pros: [
        "Minimal boilerplate — no interface or class declarations",
        "Natural in functional languages (JS, Python, Kotlin)",
        "Inline lambdas for one-off strategies",
      ],
      cons: [
        "No type name — harder to identify which strategy is active at runtime",
        "Difficult to add configuration or state to a lambda",
        "Less discoverable — no explicit strategy classes to browse",
      ],
    },
    {
      id: 3,
      name: "Strategy Map (Configuration-Driven)",
      description:
        "Strategies are registered in a map keyed by name/enum. The context looks up the strategy by key at runtime, often from configuration or user input. Combines class-based strategies with dynamic selection.",
      code: {
        Python: `from typing import Callable

SortFn = Callable[[list[int]], list[int]]

strategies: dict[str, SortFn] = {}

def register(name: str):
    def decorator(fn: SortFn) -> SortFn:
        strategies[name] = fn
        return fn
    return decorator

@register("bubble")
def bubble_sort(data: list[int]) -> list[int]:
    arr = data.copy()
    for i in range(len(arr)):
        for j in range(len(arr) - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

@register("builtin")
def builtin_sort(data: list[int]) -> list[int]:
    return sorted(data)

# Select from config
algo = "bubble"
result = strategies[algo]([3, 1, 2])`,
        Go: `package main

var strategies = map[string]func([]int) []int{}

func init() {
	strategies["builtin"] = func(data []int) []int {
		r := make([]int, len(data))
		copy(r, data)
		sort.Ints(r)
		return r
	}
}

func Sort(name string, data []int) []int {
	if fn, ok := strategies[name]; ok { return fn(data) }
	panic("unknown strategy: " + name)
}`,
        Java: `import java.util.*;
import java.util.function.UnaryOperator;

class StrategyRegistry {
    private static final Map<String, UnaryOperator<int[]>> strategies = new HashMap<>();
    static {
        strategies.put("builtin", arr -> { int[] r = arr.clone(); Arrays.sort(r); return r; });
    }
    static int[] sort(String name, int[] data) {
        return Optional.ofNullable(strategies.get(name))
            .orElseThrow(() -> new IllegalArgumentException("Unknown: " + name))
            .apply(data);
    }
}`,
        TypeScript: `type SortFn = (data: number[]) => number[];

const strategies = new Map<string, SortFn>();

strategies.set("ascending", (d) => [...d].sort((a, b) => a - b));
strategies.set("descending", (d) => [...d].sort((a, b) => b - a));

function sort(name: string, data: number[]): number[] {
  const fn = strategies.get(name);
  if (!fn) throw new Error(\`Unknown strategy: \${name}\`);
  return fn(data);
}

// Select from config or user input
const algo = "ascending";
console.log(sort(algo, [3, 1, 2]));`,
        Rust: `use std::collections::HashMap;

type SortFn = fn(&[i32]) -> Vec<i32>;

fn ascending(data: &[i32]) -> Vec<i32> { let mut v = data.to_vec(); v.sort(); v }
fn descending(data: &[i32]) -> Vec<i32> { let mut v = data.to_vec(); v.sort_by(|a, b| b.cmp(a)); v }

fn main() {
    let mut strategies: HashMap<&str, SortFn> = HashMap::new();
    strategies.insert("ascending", ascending);
    strategies.insert("descending", descending);
    let algo = "ascending";
    let result = strategies[algo](&[3, 1, 2]);
    println!("{:?}", result);
}`,
      },
      pros: [
        "Strategy selection from config files, environment variables, or user input",
        "Easy to discover available strategies — list the map keys",
        "Plugin-friendly — third parties register strategies by name",
      ],
      cons: [
        "Runtime errors for unknown strategy names (no compile-time safety)",
        "Strategy map must be maintained and kept in sync with implementations",
        "Harder to pass strategy-specific configuration",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Boilerplate", "Statefulness", "Discoverability", "Best For",
  ],
  comparisonRows: [
    ["Class-based", "Medium", "Full state support", "High (explicit classes)", "Complex, stateful algorithms"],
    ["Functional", "Minimal", "Stateless (closures for state)", "Low", "Simple, one-liner algorithms"],
    ["Strategy Map", "Medium", "Varies", "High (list keys)", "Config-driven selection"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Behavioral" },
    {
      aspect: "Key Benefit",
      detail:
        "Eliminates conditional algorithm selection (if/else, switch) by encapsulating each variant behind a common interface. New algorithms added without modifying existing code.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Over-engineering simple choices into full Strategy classes. If the algorithm is a one-liner with no state, a plain function or lambda is sufficient.",
    },
    {
      aspect: "vs. State Pattern",
      detail:
        "Strategy lets the client choose the algorithm externally. State pattern transitions between strategies internally based on the object's current state. Strategy is set; State is automatic.",
    },
    {
      aspect: "vs. Template Method",
      detail:
        "Template Method uses inheritance — subclasses override steps. Strategy uses composition — algorithms are injected as objects. Strategy is more flexible (swap at runtime).",
    },
    {
      aspect: "When to Use",
      detail:
        "Multiple algorithms for the same task. Runtime algorithm selection. Eliminating if/else chains for algorithm choice. Sorting, pricing, compression, routing, authentication, validation.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When there's only one algorithm and no foreseeable variation. When the algorithm is trivial and a simple function suffices without the interface overhead.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "State (similar structure, different intent), Template Method (inheritance-based alternative), Factory (creates the right strategy), Decorator (wraps strategies with cross-cutting concerns)",
    },
  ],

  antiPatterns: [
    {
      name: "Strategy Explosion",
      description:
        "Creating dozens of tiny strategy classes for trivial variations (add 5%, add 10%, add 15%) instead of parameterizing a single strategy.",
      betterAlternative:
        "Use a parameterized strategy: PercentDiscount(pct) instead of FivePercentOff, TenPercentOff, FifteenPercentOff.",
    },
    {
      name: "Leaking Strategy Selection Into Context",
      description:
        "The Context contains if/else logic to select the strategy, defeating the purpose. The conditional just moved from algorithm execution to strategy selection.",
      betterAlternative:
        "Move strategy selection to a factory, configuration, or dependency injection container. The Context should receive its strategy, not choose it.",
    },
    {
      name: "Strategy Knows Context Internals",
      description:
        "Strategies reach into the Context's internal state to get data, creating tight coupling between strategy and context.",
      betterAlternative:
        "Pass all needed data through the execute() method parameters. Strategies should be independent of the Context's internal structure.",
    },
    {
      name: "Stateful Singleton Strategy",
      description:
        "Using a single shared strategy instance across threads when the strategy has mutable state, causing race conditions.",
      betterAlternative:
        "Make strategies stateless (preferred), or create per-request instances, or use thread-local storage.",
    },
    {
      name: "Ignoring the Functional Alternative",
      description:
        "Creating full interface + class hierarchies in languages with first-class functions, when a simple function type would suffice.",
      betterAlternative:
        "In TypeScript/Python/Kotlin, use function types for stateless strategies. Reserve classes for strategies with configuration, dependencies, or complex initialization.",
    },
  ],
};

export default strategyData;
