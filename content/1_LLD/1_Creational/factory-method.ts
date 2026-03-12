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

  classDiagramSvg: {
    type: "mermaid",
    content: `classDiagram
  class Creator {
    <<abstract>>
    +factoryMethod()* Product
    +someOperation() result
  }
  class ConcreteCreatorA {
    +factoryMethod() ConcreteProductA
  }
  class ConcreteCreatorB {
    +factoryMethod() ConcreteProductB
  }
  class Product {
    <<interface>>
    +execute() void
  }
  class ConcreteProductA {
    +execute() void
  }
  class ConcreteProductB {
    +execute() void
  }
  Creator <|-- ConcreteCreatorA
  Creator <|-- ConcreteCreatorB
  Product <|.. ConcreteProductA
  Product <|.. ConcreteProductB
  Creator ..> Product : uses
  ConcreteCreatorA ..> ConcreteProductA : creates
  ConcreteCreatorB ..> ConcreteProductB : creates`,
  },

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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class ProcessorFactory {
    <<abstract>>
    +createProcessor()* PaymentProcessor
    +processPayment(amount, currency) string
  }
  class StripeFactory {
    +createProcessor() StripeProcessor
  }
  class PayPalFactory {
    +createProcessor() PayPalProcessor
  }
  class WireTransferFactory {
    +createProcessor() WireTransferProcessor
  }
  class PaymentProcessor {
    <<interface>>
    +charge(amountCents, currency) string
  }
  class StripeProcessor {
    +charge(amountCents, currency) string
  }
  class PayPalProcessor {
    +charge(amountCents, currency) string
  }
  class WireTransferProcessor {
    +charge(amountCents, currency) string
  }
  ProcessorFactory <|-- StripeFactory
  ProcessorFactory <|-- PayPalFactory
  ProcessorFactory <|-- WireTransferFactory
  PaymentProcessor <|.. StripeProcessor
  PaymentProcessor <|.. PayPalProcessor
  PaymentProcessor <|.. WireTransferProcessor
  ProcessorFactory ..> PaymentProcessor : uses
  StripeFactory ..> StripeProcessor : creates
  PayPalFactory ..> PayPalProcessor : creates
  WireTransferFactory ..> WireTransferProcessor : creates
  class CheckoutService {
    -factory: ProcessorFactory
    +checkout(cartId, amount, currency) Receipt
    +refund(txId, amount, currency) Refund
  }
  CheckoutService --> ProcessorFactory : uses`,
      },
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

class WireTransferFactory(ProcessorFactory):
    def create_processor(self) -> PaymentProcessor:
        return WireTransferProcessor()

class CheckoutService:
    """
    Consumer — orchestrates payments using an injected ProcessorFactory.
    Knows nothing about Stripe, PayPal, or Wire — works purely through
    the abstract factory and processor interfaces.
    Swapping the factory at startup changes the payment provider without
    touching any checkout logic (Open/Closed Principle in action).
    """
    def __init__(self, factory: ProcessorFactory) -> None:
        self._factory = factory  # injected — never instantiates processors directly

    def checkout(self, cart_id: str, amount_cents: int, currency: str) -> dict:
        """Delegate payment to whichever processor the factory provides."""
        result = self._factory.process_payment(amount_cents, currency)
        return {"cart_id": cart_id, "result": result, "status": "charged"}

    def refund(self, tx_id: str, amount_cents: int, currency: str) -> dict:
        """Route a refund through the same processor family as the original charge."""
        result = self._factory.process_payment(amount_cents, currency)
        return {"tx_id": tx_id, "refund": result, "status": "refunded"}

# ── Usage ──
# Swap factory to change provider — CheckoutService never changes
stripe_svc = CheckoutService(StripeFactory())
print(stripe_svc.checkout("CART-001", 5000, "USD"))
paypal_svc = CheckoutService(PayPalFactory())
print(paypal_svc.checkout("CART-002", 3000, "EUR"))`,
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

// CheckoutService — Consumer: orchestrates payments via an injected ProcessorFactory.
// Knows nothing about Stripe or PayPal — swapping the factory changes the provider.
type CheckoutService struct {
	factory ProcessorFactory
}

func NewCheckoutService(f ProcessorFactory) *CheckoutService {
	return &CheckoutService{factory: f}
}

func (cs *CheckoutService) Checkout(cartID string, amount int, currency string) string {
	processor := cs.factory.CreateProcessor()
	return fmt.Sprintf("cart=%s -> %s", cartID, processor.Charge(amount, currency))
}

func (cs *CheckoutService) Refund(txID string, amount int, currency string) string {
	processor := cs.factory.CreateProcessor()
	return fmt.Sprintf("refund tx=%s -> %s", txID, processor.Charge(amount, currency))
}

func main() {
	// Swap factory to change provider — CheckoutService never changes
	svc := NewCheckoutService(StripeFactory{})
	fmt.Println(svc.Checkout("CART-001", 5000, "USD"))
	fmt.Println(svc.Refund("TX-001", 1500, "USD"))
	svc2 := NewCheckoutService(PayPalFactory{})
	fmt.Println(svc2.Checkout("CART-002", 3000, "EUR"))
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
}

/**
 * CheckoutService — Consumer: orchestrates payments using an injected ProcessorFactory.
 * Knows nothing about Stripe or PayPal — swapping the factory changes the payment provider
 * without any modification to this class (Open/Closed Principle).
 */
class CheckoutService {
    private final ProcessorFactory factory;

    CheckoutService(ProcessorFactory factory) { this.factory = factory; }

    String checkout(String cartId, int amountCents, String currency) {
        String result = factory.processPayment(amountCents, currency);
        return "cart=" + cartId + " -> " + result + " [charged]";
    }

    String refund(String txId, int amountCents, String currency) {
        String result = factory.processPayment(amountCents, currency);
        return "refund tx=" + txId + " -> " + result + " [refunded]";
    }

    public static void main(String[] args) {
        // Swap factory to change provider — CheckoutService never changes
        CheckoutService svc = new CheckoutService(new StripeFactory());
        System.out.println(svc.checkout("CART-001", 5000, "USD"));
        CheckoutService svc2 = new CheckoutService(new PayPalFactory());
        System.out.println(svc2.checkout("CART-002", 3000, "EUR"));
    }
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

/**
 * CheckoutService — Consumer: orchestrates payments using an injected ProcessorFactory.
 * Knows nothing about Stripe or PayPal — swapping the factory changes the provider
 * without any modification to this class (Open/Closed Principle).
 */
class CheckoutService {
  constructor(private factory: ProcessorFactory) {}

  checkout(cartId: string, amountCents: number, currency: string) {
    const result = this.factory.processPayment(amountCents, currency);
    return { cartId, result, status: "charged" };
  }

  refund(txId: string, amountCents: number, currency: string) {
    const result = this.factory.processPayment(amountCents, currency);
    return { txId, result, status: "refunded" };
  }
}

// ── Usage ──
// Swap factory to change provider — CheckoutService never changes
const stripeSvc = new CheckoutService(new StripeFactory());
console.log(stripeSvc.checkout("CART-001", 5000, "USD"));
const paypalSvc = new CheckoutService(new PayPalFactory());
console.log(paypalSvc.checkout("CART-002", 3000, "EUR"));`,
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

/// CheckoutService — Consumer: orchestrates payments via an injected factory.
/// Knows nothing about StripeProcessor or PayPalProcessor — works purely
/// through traits. Swapping the factory boxed value changes the provider.
struct CheckoutService {
    factory: Box<dyn ProcessorFactory>,
}

impl CheckoutService {
    fn new(factory: Box<dyn ProcessorFactory>) -> Self {
        CheckoutService { factory }
    }

    fn checkout(&self, cart_id: &str, amount_cents: u64, currency: &str) -> String {
        let processor = self.factory.create_processor();
        format!("cart={} -> {}", cart_id, processor.charge(amount_cents, currency))
    }

    fn refund(&self, tx_id: &str, amount_cents: u64, currency: &str) -> String {
        let processor = self.factory.create_processor();
        format!("refund tx={} -> {}", tx_id, processor.charge(amount_cents, currency))
    }
}

fn main() {
    // Swap factory to change provider — CheckoutService never changes
    let svc = CheckoutService::new(Box::new(StripeFactory));
    println!("{}", svc.checkout("CART-001", 5000, "USD"));
    let svc2 = CheckoutService::new(Box::new(PayPalFactory));
    println!("{}", svc2.checkout("CART-002", 3000, "EUR"));
}`,
      },
      considerations: [
        "Use feature flags or config to select the factory at startup — avoid hard-coding factory selection in business logic",
        "Each processor needs its own error-handling strategy (Stripe retries, PayPal redirects) — encapsulate these in the product",
        "Idempotency keys must be generated per processor type to avoid duplicate charges during retries",
        "Consider a fallback factory chain for payment failures (Stripe → PayPal → Wire)",
        "Processor credentials should be injected into the factory, not hard-coded in the product",
      ],
      codeFiles: {
        Python: [
          {
            name: "payment_processor.py",
            dir: "payments/",
            content: `"""
payments/payment_processor.py
------------------------------
Product interface and concrete implementations for payment processing.
Each processor encapsulates the full lifecycle of a payment: auth, capture,
refund, and void. Concrete classes depend only on their own SDK — no shared
coupling between Stripe, PayPal, and Wire code paths.
"""
from __future__ import annotations
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ChargeResult:
    tx_id: str
    status: str          # "authorized" | "declined" | "error"
    gateway: str
    amount_cents: int
    currency: str
    error_code: Optional[str] = None


@dataclass
class RefundResult:
    refund_id: str
    original_tx_id: str
    status: str
    amount_cents: int


class PaymentProcessor(ABC):
    """Product interface — all processors implement the same charging contract."""

    @abstractmethod
    def charge(self, amount_cents: int, currency: str, token: str) -> ChargeResult:
        """Authorize and capture a payment."""
        ...

    @abstractmethod
    def refund(self, original_tx_id: str, amount_cents: int) -> RefundResult:
        """Refund a previously captured transaction."""
        ...

    @abstractmethod
    def supports_currency(self, currency: str) -> bool:
        """Whether this processor can handle the given currency code."""
        ...


class StripeProcessor(PaymentProcessor):
    """Stripe card-tokenization processor (Stripe SDK v5+)."""

    _SUPPORTED = {"USD", "EUR", "GBP", "JPY", "AUD"}

    def __init__(self, api_key: str, idempotency_prefix: str = "stripe") -> None:
        self._api_key = api_key
        self._prefix = idempotency_prefix

    def charge(self, amount_cents: int, currency: str, token: str) -> ChargeResult:
        idem_key = f"{self._prefix}-{uuid.uuid4()}"
        # In production: stripe.PaymentIntent.create(...)
        return ChargeResult(
            tx_id=f"pi_{uuid.uuid4().hex[:16]}",
            status="authorized",
            gateway="https://api.stripe.com/v1",
            amount_cents=amount_cents,
            currency=currency,
        )

    def refund(self, original_tx_id: str, amount_cents: int) -> RefundResult:
        return RefundResult(
            refund_id=f"re_{uuid.uuid4().hex[:10]}",
            original_tx_id=original_tx_id,
            status="succeeded",
            amount_cents=amount_cents,
        )

    def supports_currency(self, currency: str) -> bool:
        return currency.upper() in self._SUPPORTED


class PayPalProcessor(PaymentProcessor):
    """PayPal wallet redirect processor (PayPal REST API v2)."""

    _SUPPORTED = {"USD", "EUR", "GBP", "CAD", "AUD", "MXN"}

    def __init__(self, client_id: str, client_secret: str) -> None:
        self._client_id = client_id
        self._secret = client_secret

    def charge(self, amount_cents: int, currency: str, token: str) -> ChargeResult:
        # In production: POST /v2/checkout/orders + capture
        return ChargeResult(
            tx_id=f"PAYID-{uuid.uuid4().hex[:12].upper()}",
            status="authorized",
            gateway="https://api.paypal.com/v2",
            amount_cents=amount_cents,
            currency=currency,
        )

    def refund(self, original_tx_id: str, amount_cents: int) -> RefundResult:
        return RefundResult(
            refund_id=f"REF-{uuid.uuid4().hex[:10].upper()}",
            original_tx_id=original_tx_id,
            status="completed",
            amount_cents=amount_cents,
        )

    def supports_currency(self, currency: str) -> bool:
        return currency.upper() in self._SUPPORTED


class WireTransferProcessor(PaymentProcessor):
    """SWIFT wire transfer for high-value B2B payments."""

    def charge(self, amount_cents: int, currency: str, token: str) -> ChargeResult:
        # token represents the beneficiary BIC/IBAN reference
        return ChargeResult(
            tx_id=f"WIRE-{uuid.uuid4().hex[:8].upper()}",
            status="authorized",
            gateway="SWIFT",
            amount_cents=amount_cents,
            currency=currency,
        )

    def refund(self, original_tx_id: str, amount_cents: int) -> RefundResult:
        # Wire refunds require manual banker intervention → always "pending"
        return RefundResult(
            refund_id=f"WREF-{uuid.uuid4().hex[:8].upper()}",
            original_tx_id=original_tx_id,
            status="pending",
            amount_cents=amount_cents,
        )

    def supports_currency(self, currency: str) -> bool:
        # SWIFT supports all ISO 4217 currencies
        return len(currency) == 3 and currency.isalpha()
`,
          },
          {
            name: "processor_factory.py",
            dir: "payments/",
            content: `"""
payments/processor_factory.py
------------------------------
Creator abstract class and concrete factory subclasses.
The checkout service depends only on ProcessorFactory — it never imports
a concrete processor class directly, keeping the creation layer swappable.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Optional

from payments.payment_processor import (
    PaymentProcessor,
    StripeProcessor,
    PayPalProcessor,
    WireTransferProcessor,
)


class ProcessorFactory(ABC):
    """
    Creator — declares the factory method and provides the template operation.
    Subclasses control which PaymentProcessor is created; this base class
    controls the surrounding checkout workflow.
    """

    # ── Factory method — overridden by each subclass ──────────────
    @abstractmethod
    def create_processor(self) -> PaymentProcessor:
        """Return a fully configured PaymentProcessor for this payment type."""
        ...

    # ── Template operation — uses the factory method ──────────────
    def process_payment(
        self,
        amount_cents: int,
        currency: str,
        payment_token: str,
    ) -> dict:
        """
        Validate, create the processor, and execute the charge.
        The checkout service calls this method; it never touches a
        concrete processor class.
        """
        processor = self.create_processor()

        if not processor.supports_currency(currency):
            raise ValueError(
                f"{type(processor).__name__} does not support {currency}"
            )

        result = processor.charge(amount_cents, currency, payment_token)

        return {
            "tx_id": result.tx_id,
            "status": result.status,
            "gateway": result.gateway,
            "amount": f"{amount_cents / 100:.2f} {currency}",
        }


class StripeProcessorFactory(ProcessorFactory):
    """Creates a StripeProcessor with credentials from the secret store."""

    def __init__(self, api_key: str) -> None:
        self._api_key = api_key

    def create_processor(self) -> PaymentProcessor:
        return StripeProcessor(api_key=self._api_key)


class PayPalProcessorFactory(ProcessorFactory):
    """Creates a PayPalProcessor with OAuth credentials."""

    def __init__(self, client_id: str, client_secret: str) -> None:
        self._client_id = client_id
        self._secret = client_secret

    def create_processor(self) -> PaymentProcessor:
        return PayPalProcessor(
            client_id=self._client_id,
            client_secret=self._secret,
        )


class WireTransferFactory(ProcessorFactory):
    """Creates a WireTransferProcessor — no credentials needed (bank-side auth)."""

    def create_processor(self) -> PaymentProcessor:
        return WireTransferProcessor()


# ── Factory selector (used at the application boundary) ──────────

_FACTORY_MAP = {
    "stripe": lambda cfg: StripeProcessorFactory(cfg["stripe_api_key"]),
    "paypal": lambda cfg: PayPalProcessorFactory(
        cfg["paypal_client_id"], cfg["paypal_secret"]
    ),
    "wire": lambda cfg: WireTransferFactory(),
}


def get_factory(payment_method: str, config: dict) -> ProcessorFactory:
    """
    Application-level factory selector — maps a payment method string (from
    checkout request) to the correct factory instance.
    """
    creator = _FACTORY_MAP.get(payment_method.lower())
    if creator is None:
        raise ValueError(f"Unsupported payment method: {payment_method}")
    return creator(config)
`,
          },
          {
            name: "checkout_service.py",
            dir: "checkout/",
            content: `"""
checkout/checkout_service.py
------------------------------
CheckoutService uses ProcessorFactory — never a concrete processor class.
Adding a new payment method (e.g., crypto) requires only a new factory
subclass and a new entry in the config map. This file never changes.
"""
from __future__ import annotations
from payments.processor_factory import get_factory


class CheckoutService:
    def __init__(self, config: dict) -> None:
        self._config = config

    def checkout(
        self,
        amount_cents: int,
        currency: str,
        payment_method: str,
        payment_token: str,
    ) -> dict:
        factory = get_factory(payment_method, self._config)
        return factory.process_payment(amount_cents, currency, payment_token)


# ── Entry point ───────────────────────────────────────────────────
if __name__ == "__main__":
    config = {
        "stripe_api_key": "sk_live_abc123",
        "paypal_client_id": "AZ_abc",
        "paypal_secret": "secret_xyz",
    }
    svc = CheckoutService(config)

    print(svc.checkout(4999, "USD", "stripe", "tok_visa_4242"))
    print(svc.checkout(9900, "EUR", "paypal", "EC-token"))
    print(svc.checkout(250_000_00, "USD", "wire", "BIC:DEUTDEDB"))
`,
          },
          {
            name: "test_processor_factory.py",
            dir: "tests/",
            content: `"""
tests/test_processor_factory.py
--------------------------------
Unit tests for the Factory Method — verify the factory contract: correct
product type, currency validation, and result structure.
"""
import pytest
from payments.processor_factory import (
    StripeProcessorFactory,
    PayPalProcessorFactory,
    WireTransferFactory,
    get_factory,
)
from payments.payment_processor import (
    StripeProcessor,
    PayPalProcessor,
    WireTransferProcessor,
)


class TestFactoryProductTypes:
    def test_stripe_factory_creates_stripe_processor(self):
        factory = StripeProcessorFactory(api_key="sk_test_abc")
        assert isinstance(factory.create_processor(), StripeProcessor)

    def test_paypal_factory_creates_paypal_processor(self):
        factory = PayPalProcessorFactory("cid", "secret")
        assert isinstance(factory.create_processor(), PayPalProcessor)

    def test_wire_factory_creates_wire_processor(self):
        factory = WireTransferFactory()
        assert isinstance(factory.create_processor(), WireTransferProcessor)


class TestProcessPayment:
    def test_stripe_payment_returns_tx_id(self):
        factory = StripeProcessorFactory("sk_test_abc")
        result = factory.process_payment(5000, "USD", "tok_visa")
        assert "tx_id" in result
        assert result["status"] == "authorized"

    def test_unsupported_currency_raises(self):
        factory = StripeProcessorFactory("sk_test_abc")
        with pytest.raises(ValueError, match="does not support"):
            factory.process_payment(1000, "XYZ", "tok_visa")


class TestFactorySelector:
    _config = {
        "stripe_api_key": "sk_test_abc",
        "paypal_client_id": "cid",
        "paypal_secret": "secret",
    }

    def test_get_factory_stripe(self):
        f = get_factory("stripe", self._config)
        assert isinstance(f, StripeProcessorFactory)

    def test_get_factory_unknown_raises(self):
        with pytest.raises(ValueError, match="Unsupported"):
            get_factory("bitcoin", self._config)
`,
          },
        ],
        Go: [
          {
            name: "processor.go",
            dir: "payments/",
            content: `// payments/processor.go
// Product interface and concrete implementations for payment processing.
// Each processor encapsulates its own SDK dependency and error handling.
package payments

import (
	"fmt"
	"strings"
	"time"
)

// ChargeResult is the uniform response from every processor's Charge call.
type ChargeResult struct {
	TxID        string
	Status      string // "authorized" | "declined" | "error"
	Gateway     string
	AmountCents int
	Currency    string
}

// RefundResult is the uniform response from every processor's Refund call.
type RefundResult struct {
	RefundID      string
	OriginalTxID  string
	Status        string
	AmountCents   int
}

// PaymentProcessor is the Product interface — implemented by every processor.
type PaymentProcessor interface {
	Charge(amountCents int, currency, token string) (ChargeResult, error)
	Refund(originalTxID string, amountCents int) (RefundResult, error)
	SupportsCurrency(currency string) bool
}

// ─── StripeProcessor ─────────────────────────────────────────────

type StripeProcessor struct {
	apiKey           string
	idempotencyPrefix string
}

var stripeSupportedCurrencies = map[string]bool{
	"USD": true, "EUR": true, "GBP": true, "JPY": true, "AUD": true,
}

func (s *StripeProcessor) Charge(amountCents int, currency, token string) (ChargeResult, error) {
	txID := fmt.Sprintf("pi_%d", time.Now().UnixNano())
	return ChargeResult{
		TxID:        txID,
		Status:      "authorized",
		Gateway:     "https://api.stripe.com/v1",
		AmountCents: amountCents,
		Currency:    currency,
	}, nil
}

func (s *StripeProcessor) Refund(originalTxID string, amountCents int) (RefundResult, error) {
	return RefundResult{
		RefundID:     fmt.Sprintf("re_%d", time.Now().UnixNano()),
		OriginalTxID: originalTxID,
		Status:       "succeeded",
		AmountCents:  amountCents,
	}, nil
}

func (s *StripeProcessor) SupportsCurrency(currency string) bool {
	return stripeSupportedCurrencies[strings.ToUpper(currency)]
}

// ─── PayPalProcessor ─────────────────────────────────────────────

type PayPalProcessor struct {
	clientID string
	secret   string
}

var paypalSupportedCurrencies = map[string]bool{
	"USD": true, "EUR": true, "GBP": true, "CAD": true, "AUD": true,
}

func (p *PayPalProcessor) Charge(amountCents int, currency, token string) (ChargeResult, error) {
	txID := fmt.Sprintf("PAYID-%d", time.Now().UnixNano())
	return ChargeResult{
		TxID:        txID,
		Status:      "authorized",
		Gateway:     "https://api.paypal.com/v2",
		AmountCents: amountCents,
		Currency:    currency,
	}, nil
}

func (p *PayPalProcessor) Refund(originalTxID string, amountCents int) (RefundResult, error) {
	return RefundResult{
		RefundID:     fmt.Sprintf("REF-%d", time.Now().UnixNano()),
		OriginalTxID: originalTxID,
		Status:       "completed",
		AmountCents:  amountCents,
	}, nil
}

func (p *PayPalProcessor) SupportsCurrency(currency string) bool {
	return paypalSupportedCurrencies[strings.ToUpper(currency)]
}

// ─── WireTransferProcessor ───────────────────────────────────────

type WireTransferProcessor struct{}

func (w *WireTransferProcessor) Charge(amountCents int, currency, token string) (ChargeResult, error) {
	return ChargeResult{
		TxID:        fmt.Sprintf("WIRE-%d", time.Now().UnixNano()),
		Status:      "authorized",
		Gateway:     "SWIFT",
		AmountCents: amountCents,
		Currency:    currency,
	}, nil
}

func (w *WireTransferProcessor) Refund(originalTxID string, amountCents int) (RefundResult, error) {
	return RefundResult{
		RefundID:     fmt.Sprintf("WREF-%d", time.Now().UnixNano()),
		OriginalTxID: originalTxID,
		Status:       "pending", // wire refunds require manual bank action
		AmountCents:  amountCents,
	}, nil
}

func (w *WireTransferProcessor) SupportsCurrency(currency string) bool {
	// SWIFT handles all ISO 4217 currency codes
	return len(currency) == 3
}
`,
          },
          {
            name: "factory.go",
            dir: "payments/",
            content: `// payments/factory.go
// Creator interface and concrete factories for payment processors.
// The checkout layer depends only on ProcessorFactory — never on a
// concrete processor type directly.
package payments

import (
	"fmt"
	"strings"
)

// ProcessorFactory is the Creator interface — declares the factory method
// and the template ProcessPayment operation.
type ProcessorFactory interface {
	CreateProcessor() PaymentProcessor
	ProcessPayment(amountCents int, currency, token string) (map[string]string, error)
}

// baseFactory provides the template ProcessPayment method.
// Concrete factories embed this and override CreateProcessor.
type baseFactory struct{}

func (b baseFactory) ProcessPayment(
	factory ProcessorFactory,
	amountCents int,
	currency, token string,
) (map[string]string, error) {
	proc := factory.CreateProcessor()
	if !proc.SupportsCurrency(currency) {
		return nil, fmt.Errorf("processor does not support currency %s", currency)
	}
	result, err := proc.Charge(amountCents, currency, token)
	if err != nil {
		return nil, fmt.Errorf("charge failed: %w", err)
	}
	return map[string]string{
		"tx_id":   result.TxID,
		"status":  result.Status,
		"gateway": result.Gateway,
		"amount":  fmt.Sprintf("%.2f %s", float64(amountCents)/100, currency),
	}, nil
}

// ─── StripeProcessorFactory ──────────────────────────────────────

type StripeProcessorFactory struct {
	apiKey string
}

func NewStripeFactory(apiKey string) *StripeProcessorFactory {
	return &StripeProcessorFactory{apiKey: apiKey}
}

func (f *StripeProcessorFactory) CreateProcessor() PaymentProcessor {
	return &StripeProcessor{apiKey: f.apiKey, idempotencyPrefix: "stripe"}
}

func (f *StripeProcessorFactory) ProcessPayment(
	amountCents int, currency, token string,
) (map[string]string, error) {
	return baseFactory{}.ProcessPayment(f, amountCents, currency, token)
}

// ─── PayPalProcessorFactory ──────────────────────────────────────

type PayPalProcessorFactory struct {
	clientID string
	secret   string
}

func NewPayPalFactory(clientID, secret string) *PayPalProcessorFactory {
	return &PayPalProcessorFactory{clientID: clientID, secret: secret}
}

func (f *PayPalProcessorFactory) CreateProcessor() PaymentProcessor {
	return &PayPalProcessor{clientID: f.clientID, secret: f.secret}
}

func (f *PayPalProcessorFactory) ProcessPayment(
	amountCents int, currency, token string,
) (map[string]string, error) {
	return baseFactory{}.ProcessPayment(f, amountCents, currency, token)
}

// ─── WireTransferFactory ─────────────────────────────────────────

type WireTransferFactory struct{}

func (f *WireTransferFactory) CreateProcessor() PaymentProcessor {
	return &WireTransferProcessor{}
}

func (f *WireTransferFactory) ProcessPayment(
	amountCents int, currency, token string,
) (map[string]string, error) {
	return baseFactory{}.ProcessPayment(f, amountCents, currency, token)
}

// ─── Factory selector ────────────────────────────────────────────

type Config struct {
	StripeAPIKey     string
	PayPalClientID   string
	PayPalSecret     string
}

// GetFactory maps a payment method string to the correct factory.
func GetFactory(method string, cfg Config) (ProcessorFactory, error) {
	switch strings.ToLower(method) {
	case "stripe":
		return NewStripeFactory(cfg.StripeAPIKey), nil
	case "paypal":
		return NewPayPalFactory(cfg.PayPalClientID, cfg.PayPalSecret), nil
	case "wire":
		return &WireTransferFactory{}, nil
	default:
		return nil, fmt.Errorf("unsupported payment method: %s", method)
	}
}
`,
          },
          {
            name: "checkout_service.go",
            dir: "services/",
            content: `// services/checkout_service.go
// CheckoutService — Consumer. Depends only on payments.ProcessorFactory.
// Never imports StripeProcessorFactory, PayPalProcessorFactory, or WireTransferFactory.
package services

import "github.com/example/fintech/payments"

// CheckoutService orchestrates payment checkout via an injected ProcessorFactory.
type CheckoutService struct {
	factory payments.ProcessorFactory
}

func NewCheckoutService(f payments.ProcessorFactory) *CheckoutService {
	return &CheckoutService{factory: f}
}

func (cs *CheckoutService) Checkout(cartID string, amountCents int, currency, token string) (map[string]string, error) {
	return cs.factory.ProcessPayment(amountCents, currency, token)
}

type CheckoutOrder struct {
	CartID      string
	AmountCents int
	Currency    string
	Token       string
}

type CheckoutResult struct {
	CartID string
	Result map[string]string
	Err    error
}

func (cs *CheckoutService) CheckoutBatch(orders []CheckoutOrder) []CheckoutResult {
	results := make([]CheckoutResult, 0, len(orders))
	for _, o := range orders {
		res, err := cs.Checkout(o.CartID, o.AmountCents, o.Currency, o.Token)
		results = append(results, CheckoutResult{CartID: o.CartID, Result: res, Err: err})
	}
	return results
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/checkout/",
            content: `// cmd/checkout/main.go
// Wires the Stripe factory into CheckoutService and runs a batch of orders.
package main

import (
	"fmt"
	"log"

	"github.com/example/fintech/payments"
	"github.com/example/fintech/services"
)

func main() {
	cfg := payments.Config{
		StripeAPIKey:   "sk_live_abc123",
		PayPalClientID: "AZ_clientid",
		PayPalSecret:   "secret_xyz",
	}

	// Swap factory here to change the payment provider — CheckoutService is unchanged.
	factory, err := payments.GetFactory("stripe", cfg)
	if err != nil {
		log.Fatalf("factory error: %v", err)
	}

	svc := services.NewCheckoutService(factory)

	results := svc.CheckoutBatch([]services.CheckoutOrder{
		{CartID: "cart-01", AmountCents: 4999,      Currency: "USD", Token: "tok_visa_4242"},
		{CartID: "cart-02", AmountCents: 9900,      Currency: "USD", Token: "tok_visa_5678"},
		{CartID: "cart-03", AmountCents: 25_000_00, Currency: "USD", Token: "tok_wire_bic"},
	})

	for _, r := range results {
		if r.Err != nil {
			log.Printf("[%s] error: %v", r.CartID, r.Err)
		} else {
			fmt.Printf("[%s] tx=%s status=%s\\n", r.CartID, r.Result["tx_id"], r.Result["status"])
		}
	}
}
`,
          },
        ],
        Java: [
          {
            name: "PaymentProcessor.java",
            dir: "src/main/java/com/fintech/payments/",
            content: `package com.fintech.payments;

/**
 * Product interface — all payment processors implement this contract.
 * The checkout service and factory creator depend only on this type.
 * Concrete processor classes (Stripe, PayPal, Wire) are invisible to callers.
 */
public interface PaymentProcessor {

    /**
     * Authorize and capture a payment.
     *
     * @param amountCents amount in the smallest currency unit (cents, pence, etc.)
     * @param currency    ISO 4217 currency code (e.g. "USD")
     * @param token       payment token (card token, wallet redirect token, IBAN ref)
     * @return ChargeResult with transaction ID, status, and gateway details
     */
    ChargeResult charge(int amountCents, String currency, String token);

    /**
     * Refund a previously captured transaction.
     *
     * @param originalTxId the transaction ID returned by charge()
     * @param amountCents  amount to refund (may be partial)
     * @return RefundResult with refund ID and status
     */
    RefundResult refund(String originalTxId, int amountCents);

    /** Returns true if this processor can handle the given ISO 4217 currency code. */
    boolean supportsCurrency(String currency);
}
`,
          },
          {
            name: "StripeProcessor.java",
            dir: "src/main/java/com/fintech/payments/",
            content: `package com.fintech.payments;

import java.util.Set;
import java.util.UUID;

/**
 * Stripe card-tokenization processor.
 * Implements PaymentProcessor using the Stripe REST API.
 * Credentials are passed in by the factory — never hard-coded here.
 */
public class StripeProcessor implements PaymentProcessor {

    private static final Set<String> SUPPORTED =
        Set.of("USD", "EUR", "GBP", "JPY", "AUD");

    private final String apiKey;

    StripeProcessor(String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    public ChargeResult charge(int amountCents, String currency, String token) {
        // Production: stripe.paymentIntents.create({ amount, currency, payment_method: token })
        String txId = "pi_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        return new ChargeResult(txId, "authorized", "https://api.stripe.com/v1",
                                amountCents, currency);
    }

    @Override
    public RefundResult refund(String originalTxId, int amountCents) {
        return new RefundResult("re_" + UUID.randomUUID().toString().substring(0, 10),
                                originalTxId, "succeeded", amountCents);
    }

    @Override
    public boolean supportsCurrency(String currency) {
        return SUPPORTED.contains(currency.toUpperCase());
    }
}
`,
          },
          {
            name: "ProcessorFactory.java",
            dir: "src/main/java/com/fintech/payments/",
            content: `package com.fintech.payments;

import java.util.Map;

/**
 * Creator (abstract) — declares the factory method and the template
 * processPayment() operation. Concrete subclasses override createProcessor()
 * to return the appropriate PaymentProcessor implementation.
 *
 * <p>Design decisions:</p>
 * <ul>
 *   <li>processPayment() is final — the workflow is defined here, only the
 *       product type varies.</li>
 *   <li>createProcessor() is protected — only the factory hierarchy uses it.</li>
 * </ul>
 */
public abstract class ProcessorFactory {

    /** Factory method — subclasses decide which PaymentProcessor to create. */
    protected abstract PaymentProcessor createProcessor();

    /**
     * Template operation — validates currency, creates processor, executes charge.
     * Callers never touch a concrete PaymentProcessor directly.
     */
    public final Map<String, String> processPayment(
            int amountCents, String currency, String token) {

        PaymentProcessor processor = createProcessor();

        if (!processor.supportsCurrency(currency)) {
            throw new UnsupportedOperationException(
                processor.getClass().getSimpleName() +
                " does not support currency: " + currency);
        }

        ChargeResult result = processor.charge(amountCents, currency, token);

        return Map.of(
            "tx_id",   result.txId(),
            "status",  result.status(),
            "gateway", result.gateway(),
            "amount",  String.format("%.2f %s", amountCents / 100.0, currency)
        );
    }
}
`,
          },
          {
            name: "StripeProcessorFactory.java",
            dir: "src/main/java/com/fintech/payments/",
            content: `package com.fintech.payments;

/**
 * Concrete Creator for Stripe.
 * Knows how to configure and instantiate a StripeProcessor.
 * The checkout service never sees this class — it uses ProcessorFactory.
 */
public class StripeProcessorFactory extends ProcessorFactory {

    private final String apiKey;

    public StripeProcessorFactory(String apiKey) {
        this.apiKey = apiKey;
    }

    @Override
    protected PaymentProcessor createProcessor() {
        return new StripeProcessor(apiKey);
    }
}
`,
          },
          {
            name: "CheckoutService.java",
            dir: "src/main/java/com/fintech/checkout/",
            content: `package com.fintech.checkout;

import com.fintech.payments.ProcessorFactory;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

/**
 * CheckoutService — Consumer. Depends only on ProcessorFactory.
 * Never imports StripeProcessorFactory, PayPalProcessorFactory, or WireTransferFactory.
 * Swap the factory at the call site to switch payment providers.
 */
public class CheckoutService {

    private final ProcessorFactory factory;

    public CheckoutService(ProcessorFactory factory) {
        this.factory = factory;
    }

    /**
     * Process a single checkout.
     * @param cartId      cart or order identifier
     * @param amountCents charge amount in smallest currency unit
     * @param currency    ISO 4217 currency code
     * @param token       payment token (card token, EC token, BIC, etc.)
     */
    public Map<String, String> checkout(
            String cartId, int amountCents, String currency, String token) {
        return factory.processPayment(amountCents, currency, token);
    }

    public record CheckoutRequest(
            String cartId, int amountCents, String currency, String token) {}

    public record CheckoutResponse(
            String cartId, Map<String, String> result) {}

    /** Process multiple carts in sequence; never throws — failures surfaced per-cart. */
    public List<CheckoutResponse> checkoutBatch(List<CheckoutRequest> orders) {
        List<CheckoutResponse> results = new ArrayList<>();
        for (CheckoutRequest o : orders) {
            try {
                results.add(new CheckoutResponse(
                    o.cartId(),
                    checkout(o.cartId(), o.amountCents(), o.currency(), o.token())
                ));
            } catch (Exception e) {
                results.add(new CheckoutResponse(o.cartId(), Map.of("error", e.getMessage())));
            }
        }
        return results;
    }
}
`,
          },
          {
            name: "CheckoutServiceTest.java",
            dir: "src/test/java/com/fintech/payments/",
            content: `package com.fintech.payments;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests the Factory Method contract: correct product type, currency guard,
 * and template operation result shape.
 */
class CheckoutServiceTest {

    @Test
    void stripeFactory_createProcessor_returnsStripeProcessor() {
        ProcessorFactory factory = new StripeProcessorFactory("sk_test_abc");
        // Access product type via reflection (or expose in tests via package-private)
        assertTrue(factory.createProcessor() instanceof StripeProcessor);
    }

    @Test
    void processPayment_validCurrency_returnsAuthorized() {
        ProcessorFactory factory = new StripeProcessorFactory("sk_test_abc");
        var result = factory.processPayment(5000, "USD", "tok_visa");
        assertEquals("authorized", result.get("status"));
        assertTrue(result.containsKey("tx_id"));
    }

    @Test
    void processPayment_unsupportedCurrency_throws() {
        ProcessorFactory factory = new StripeProcessorFactory("sk_test_abc");
        assertThrows(UnsupportedOperationException.class, () ->
            factory.processPayment(1000, "XYZ", "tok_visa"));
    }

    @Test
    void multipleFactories_independentProcessors() {
        ProcessorFactory stripe = new StripeProcessorFactory("sk_test");
        ProcessorFactory paypal = new PayPalProcessorFactory("cid", "secret");

        var r1 = stripe.processPayment(5000, "USD", "tok_visa");
        var r2 = paypal.processPayment(3000, "EUR", "EC-token");

        // Products are different — tx IDs have different prefixes
        assertTrue(r1.get("tx_id").startsWith("pi_"));
        assertTrue(r2.get("tx_id").startsWith("PAYID-"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "payment-processor.ts",
            dir: "src/payments/",
            content: `/**
 * src/payments/payment-processor.ts
 * -----------------------------------
 * Product interface and concrete implementations.
 * The factory and checkout layers depend only on PaymentProcessor — never
 * on StripeProcessor, PayPalProcessor, or WireTransferProcessor directly.
 */

export interface ChargeResult {
  readonly txId: string;
  readonly status: "authorized" | "declined" | "error";
  readonly gateway: string;
  readonly amountCents: number;
  readonly currency: string;
}

export interface RefundResult {
  readonly refundId: string;
  readonly originalTxId: string;
  readonly status: "succeeded" | "completed" | "pending" | "failed";
  readonly amountCents: number;
}

export interface PaymentProcessor {
  charge(amountCents: number, currency: string, token: string): Promise<ChargeResult>;
  refund(originalTxId: string, amountCents: number): Promise<RefundResult>;
  supportsCurrency(currency: string): boolean;
}

// ─── StripeProcessor ────────────────────────────────────────────

const STRIPE_CURRENCIES = new Set(["USD", "EUR", "GBP", "JPY", "AUD"]);

export class StripeProcessor implements PaymentProcessor {
  constructor(private readonly apiKey: string) {}

  async charge(amountCents: number, currency: string, token: string): Promise<ChargeResult> {
    // Production: await stripe.paymentIntents.create({ amount: amountCents, currency, payment_method: token })
    const txId = \`pi_\${Math.random().toString(36).slice(2, 18)}\`;
    return { txId, status: "authorized", gateway: "https://api.stripe.com/v1", amountCents, currency };
  }

  async refund(originalTxId: string, amountCents: number): Promise<RefundResult> {
    return {
      refundId: \`re_\${Math.random().toString(36).slice(2, 12)}\`,
      originalTxId,
      status: "succeeded",
      amountCents,
    };
  }

  supportsCurrency(currency: string): boolean {
    return STRIPE_CURRENCIES.has(currency.toUpperCase());
  }
}

// ─── PayPalProcessor ────────────────────────────────────────────

const PAYPAL_CURRENCIES = new Set(["USD", "EUR", "GBP", "CAD", "AUD", "MXN"]);

export class PayPalProcessor implements PaymentProcessor {
  constructor(private readonly clientId: string, private readonly secret: string) {}

  async charge(amountCents: number, currency: string, token: string): Promise<ChargeResult> {
    const txId = \`PAYID-\${Date.now().toString(36).toUpperCase()}\`;
    return { txId, status: "authorized", gateway: "https://api.paypal.com/v2", amountCents, currency };
  }

  async refund(originalTxId: string, amountCents: number): Promise<RefundResult> {
    return {
      refundId: \`REF-\${Math.random().toString(36).slice(2, 12).toUpperCase()}\`,
      originalTxId,
      status: "completed",
      amountCents,
    };
  }

  supportsCurrency(currency: string): boolean {
    return PAYPAL_CURRENCIES.has(currency.toUpperCase());
  }
}

// ─── WireTransferProcessor ──────────────────────────────────────

export class WireTransferProcessor implements PaymentProcessor {
  async charge(amountCents: number, currency: string, token: string): Promise<ChargeResult> {
    return {
      txId: \`WIRE-\${Date.now().toString(36).toUpperCase()}\`,
      status: "authorized",
      gateway: "SWIFT",
      amountCents,
      currency,
    };
  }

  async refund(originalTxId: string, amountCents: number): Promise<RefundResult> {
    return {
      refundId: \`WREF-\${Math.random().toString(36).slice(2, 12).toUpperCase()}\`,
      originalTxId,
      status: "pending", // wire refunds require manual bank intervention
      amountCents,
    };
  }

  supportsCurrency(currency: string): boolean {
    return currency.length === 3 && /^[A-Z]+$/i.test(currency);
  }
}
`,
          },
          {
            name: "processor-factory.ts",
            dir: "src/payments/",
            content: `/**
 * src/payments/processor-factory.ts
 * ------------------------------------
 * Creator abstract class and concrete factory subclasses.
 * The checkout service programs to ProcessorFactory — never to its subclasses.
 */
import {
  PaymentProcessor,
  StripeProcessor,
  PayPalProcessor,
  WireTransferProcessor,
  ChargeResult,
} from "./payment-processor";

export interface PaymentResult {
  txId: string;
  status: string;
  gateway: string;
  amount: string;
}

export abstract class ProcessorFactory {
  /** Factory method — subclasses return the correct processor. */
  abstract createProcessor(): PaymentProcessor;

  /** Template operation — validates, creates, charges. */
  async processPayment(
    amountCents: number,
    currency: string,
    token: string,
  ): Promise<PaymentResult> {
    const processor = this.createProcessor();

    if (!processor.supportsCurrency(currency)) {
      throw new Error(\`\${processor.constructor.name} does not support \${currency}\`);
    }

    const result = await processor.charge(amountCents, currency, token);
    return {
      txId: result.txId,
      status: result.status,
      gateway: result.gateway,
      amount: \`\${(amountCents / 100).toFixed(2)} \${currency}\`,
    };
  }
}

// ─── Concrete Factories ─────────────────────────────────────────

export class StripeProcessorFactory extends ProcessorFactory {
  constructor(private readonly apiKey: string) {
    super();
  }

  createProcessor(): PaymentProcessor {
    return new StripeProcessor(this.apiKey);
  }
}

export class PayPalProcessorFactory extends ProcessorFactory {
  constructor(
    private readonly clientId: string,
    private readonly secret: string,
  ) {
    super();
  }

  createProcessor(): PaymentProcessor {
    return new PayPalProcessor(this.clientId, this.secret);
  }
}

export class WireTransferFactory extends ProcessorFactory {
  createProcessor(): PaymentProcessor {
    return new WireTransferProcessor();
  }
}

// ─── Factory selector ────────────────────────────────────────────

interface FactoryConfig {
  stripeApiKey: string;
  paypalClientId: string;
  paypalSecret: string;
}

export function getFactory(method: string, config: FactoryConfig): ProcessorFactory {
  switch (method.toLowerCase()) {
    case "stripe":
      return new StripeProcessorFactory(config.stripeApiKey);
    case "paypal":
      return new PayPalProcessorFactory(config.paypalClientId, config.paypalSecret);
    case "wire":
      return new WireTransferFactory();
    default:
      throw new Error(\`Unsupported payment method: \${method}\`);
  }
}
`,
          },
          {
            name: "checkout.ts",
            dir: "src/",
            content: `/**
 * src/checkout.ts
 * ----------------
 * CheckoutService — Consumer. Depends only on ProcessorFactory.
 * Never imports StripeProcessorFactory, PayPalProcessorFactory, or WireTransferFactory.
 * Swap the factory at the callsite to change the payment provider.
 */
import { getFactory, ProcessorConfig } from "./payments/processor-factory";
import type { ProcessorFactory } from "./payments/payment-processor";

export class CheckoutService {
  constructor(private readonly factory: ProcessorFactory) {}

  /** Process a single checkout. */
  async checkout(
    cartId: string,
    amountCents: number,
    currency: string,
    token: string,
  ): Promise<{ cartId: string; txId: string; status: string }> {
    const r = await this.factory.processPayment(amountCents, currency, token);
    return { cartId, txId: r.txId, status: r.status };
  }

  /** Process multiple carts using the same injected factory. */
  async checkoutBatch(
    orders: Array<{ cartId: string; amountCents: number; currency: string; token: string }>,
  ): Promise<Array<{ cartId: string; txId: string; status: string }>> {
    return Promise.all(
      orders.map(o => this.checkout(o.cartId, o.amountCents, o.currency, o.token)),
    );
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────────────────
const config: ProcessorConfig = {
  stripeApiKey: "sk_live_abc123",
  paypalClientId: "AZ_clientid",
  paypalSecret: "secret_xyz",
};

// Swap factory here to change providers — CheckoutService code is unchanged.
const svc = new CheckoutService(getFactory("stripe", config));

svc.checkoutBatch([
  { cartId: "cart-01", amountCents: 4999,       currency: "USD", token: "tok_visa_4242" },
  { cartId: "cart-02", amountCents: 9900,       currency: "USD", token: "tok_visa_5678" },
  { cartId: "cart-03", amountCents: 250_000_00, currency: "USD", token: "tok_wire_bic"  },
]).then(results =>
  results.forEach(r =>
    console.log("[" + r.cartId + "] tx=" + r.txId + " status=" + r.status),
  ),
).catch(console.error);
`,
          },
        ],
        Rust: [
          {
            name: "processor.rs",
            dir: "src/",
            content: `//! src/processor.rs
//! Product trait and concrete payment processor implementations.
//! The factory and checkout modules depend only on dyn PaymentProcessor.

use std::fmt;

#[derive(Debug, Clone)]
pub struct ChargeResult {
    pub tx_id: String,
    pub status: String,
    pub gateway: String,
    pub amount_cents: u64,
    pub currency: String,
}

#[derive(Debug, Clone)]
pub struct RefundResult {
    pub refund_id: String,
    pub original_tx_id: String,
    pub status: String,
    pub amount_cents: u64,
}

/// Product trait — every payment processor implements this.
pub trait PaymentProcessor: fmt::Debug {
    fn charge(&self, amount_cents: u64, currency: &str, token: &str)
        -> Result<ChargeResult, String>;

    fn refund(&self, original_tx_id: &str, amount_cents: u64)
        -> Result<RefundResult, String>;

    fn supports_currency(&self, currency: &str) -> bool;
}

// ─── StripeProcessor ──────────────────────────────────────────

#[derive(Debug)]
pub struct StripeProcessor {
    api_key: String,
}

impl StripeProcessor {
    pub fn new(api_key: impl Into<String>) -> Self {
        Self { api_key: api_key.into() }
    }
}

impl PaymentProcessor for StripeProcessor {
    fn charge(&self, amount_cents: u64, currency: &str, token: &str)
        -> Result<ChargeResult, String>
    {
        Ok(ChargeResult {
            tx_id: format!("pi_{:x}", amount_cents ^ 0xdeadbeef),
            status: "authorized".into(),
            gateway: "https://api.stripe.com/v1".into(),
            amount_cents,
            currency: currency.to_uppercase(),
        })
    }

    fn refund(&self, original_tx_id: &str, amount_cents: u64)
        -> Result<RefundResult, String>
    {
        Ok(RefundResult {
            refund_id: format!("re_{:x}", amount_cents),
            original_tx_id: original_tx_id.to_string(),
            status: "succeeded".into(),
            amount_cents,
        })
    }

    fn supports_currency(&self, currency: &str) -> bool {
        matches!(currency.to_uppercase().as_str(), "USD" | "EUR" | "GBP" | "JPY" | "AUD")
    }
}

// ─── WireTransferProcessor ────────────────────────────────────

#[derive(Debug)]
pub struct WireTransferProcessor;

impl PaymentProcessor for WireTransferProcessor {
    fn charge(&self, amount_cents: u64, currency: &str, token: &str)
        -> Result<ChargeResult, String>
    {
        Ok(ChargeResult {
            tx_id: format!("WIRE-{:X}", amount_cents),
            status: "authorized".into(),
            gateway: "SWIFT".into(),
            amount_cents,
            currency: currency.to_uppercase(),
        })
    }

    fn refund(&self, original_tx_id: &str, amount_cents: u64)
        -> Result<RefundResult, String>
    {
        Ok(RefundResult {
            refund_id: format!("WREF-{:X}", amount_cents),
            original_tx_id: original_tx_id.to_string(),
            status: "pending".into(), // requires manual bank action
            amount_cents,
        })
    }

    fn supports_currency(&self, currency: &str) -> bool {
        currency.len() == 3 && currency.chars().all(|c| c.is_ascii_alphabetic())
    }
}
`,
          },
          {
            name: "factory.rs",
            dir: "src/",
            content: `//! src/factory.rs
//! Creator trait and concrete payment processor factories.
//! ProcessorFactory is the only type checkout code depends on.

use crate::processor::{
    ChargeResult, PaymentProcessor, StripeProcessor, WireTransferProcessor,
};
use std::collections::HashMap;

/// Creator trait — declares the factory method and template operation.
pub trait ProcessorFactory {
    fn create_processor(&self) -> Box<dyn PaymentProcessor>;

    /// Template operation: validates, creates, charges.
    fn process_payment(
        &self,
        amount_cents: u64,
        currency: &str,
        token: &str,
    ) -> Result<HashMap<String, String>, String> {
        let processor = self.create_processor();

        if !processor.supports_currency(currency) {
            return Err(format!("Processor does not support currency {}", currency));
        }

        let result = processor.charge(amount_cents, currency, token)?;

        let mut map = HashMap::new();
        map.insert("tx_id".into(), result.tx_id);
        map.insert("status".into(), result.status);
        map.insert("gateway".into(), result.gateway);
        map.insert(
            "amount".into(),
            format!("{:.2} {}", amount_cents as f64 / 100.0, currency),
        );
        Ok(map)
    }
}

// ─── StripeProcessorFactory ─────────────────────────────────

pub struct StripeProcessorFactory {
    api_key: String,
}

impl StripeProcessorFactory {
    pub fn new(api_key: impl Into<String>) -> Self {
        Self { api_key: api_key.into() }
    }
}

impl ProcessorFactory for StripeProcessorFactory {
    fn create_processor(&self) -> Box<dyn PaymentProcessor> {
        Box::new(StripeProcessor::new(self.api_key.clone()))
    }
}

// ─── WireTransferFactory ────────────────────────────────────

pub struct WireTransferFactory;

impl ProcessorFactory for WireTransferFactory {
    fn create_processor(&self) -> Box<dyn PaymentProcessor> {
        Box::new(WireTransferProcessor)
    }
}

// ─── Factory selector ───────────────────────────────────────

pub struct FactoryConfig {
    pub stripe_api_key: String,
}

pub fn get_factory(method: &str, config: &FactoryConfig) -> Result<Box<dyn ProcessorFactory>, String> {
    match method.to_lowercase().as_str() {
        "stripe" => Ok(Box::new(StripeProcessorFactory::new(config.stripe_api_key.clone()))),
        "wire"   => Ok(Box::new(WireTransferFactory)),
        other    => Err(format!("Unsupported payment method: {}", other)),
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! CheckoutService — Consumer that depends only on ProcessorFactory.
mod processor;
mod factory;

use std::collections::HashMap;
use factory::{get_factory, FactoryConfig, ProcessorFactory};

// ─── Consumer ───────────────────────────────────────────────────────────
// CheckoutService depends only on ProcessorFactory — never on StripeProcessor,
// PayPalProcessor, or WireTransferProcessor. Swap factory to change providers.
struct CheckoutService {
    factory: Box<dyn ProcessorFactory>,
}

impl CheckoutService {
    fn new(factory: Box<dyn ProcessorFactory>) -> Self {
        Self { factory }
    }

    fn checkout(
        &self, cart_id: &str, amount_cents: u64, currency: &str, token: &str,
    ) -> Result<HashMap<String, String>, String> {
        self.factory.process_payment(amount_cents, currency, token)
    }

    fn checkout_batch<'a>(
        &self,
        orders: &[(&'a str, u64, &str, &str)],
    ) -> Vec<(&'a str, Result<HashMap<String, String>, String>)> {
        orders.iter().map(|(id, amt, cur, tok)| {
            (*id, self.checkout(id, *amt, cur, tok))
        }).collect()
    }
}

fn main() {
    let config = FactoryConfig { stripe_api_key: "sk_live_abc123".into() };

    // Swap factory here to change providers — CheckoutService code is unchanged.
    let factory = get_factory("stripe", &config).expect("factory error");
    let svc = CheckoutService::new(factory);

    let orders = vec![
        ("cart-01", 4_999u64,      "USD", "tok_visa_4242"),
        ("cart-02", 9_900u64,      "USD", "tok_visa_5678"),
        ("cart-03", 250_000_00u64, "USD", "BIC:DEUTDEDB"),
    ];

    for (cart, result) in svc.checkout_batch(&orders) {
        match result {
            Ok(r)  => println!("[{}] tx={} status={}", cart, r["tx_id"], r["status"]),
            Err(e) => eprintln!("[{}] error: {}", cart, e),
        }
    }
}
`,
          },
        ],
      },
    },
    {
      id: 2,
      title: "Healthcare — Medical Report Generator",
      domain: "Healthcare",
      problem:
        "A hospital information system generates reports for lab results, radiology imaging, and pathology analysis. Each report type has a different structure, required fields, and regulatory format (HL7 CDA for labs, DICOM SR for radiology). Embedding all report-creation logic in one class violates single responsibility.",
      solution:
        "A MedicalReportFactory declares createReport(). Subclasses LabReportFactory, RadiologyReportFactory, and PathologyReportFactory each produce the correct report type with its required sections and compliance format.",
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class ReportFactory {
    <<abstract>>
    +createReport()* MedicalReport
    +generateForPatient(patientId) string
  }
  class LabReportFactory {
    +createReport() LabReport
  }
  class RadiologyReportFactory {
    +createReport() RadiologyReport
  }
  class PathologyReportFactory {
    +createReport() PathologyReport
  }
  class MedicalReport {
    <<interface>>
    +generate(patientId) string
  }
  class LabReport {
    +generate(patientId) string
  }
  class RadiologyReport {
    +generate(patientId) string
  }
  class PathologyReport {
    +generate(patientId) string
  }
  ReportFactory <|-- LabReportFactory
  ReportFactory <|-- RadiologyReportFactory
  ReportFactory <|-- PathologyReportFactory
  MedicalReport <|.. LabReport
  MedicalReport <|.. RadiologyReport
  MedicalReport <|.. PathologyReport
  ReportFactory ..> MedicalReport : uses
  LabReportFactory ..> LabReport : creates
  RadiologyReportFactory ..> RadiologyReport : creates
  PathologyReportFactory ..> PathologyReport : creates
  class DiagnosticService {
    -factory: ReportFactory
    +generateReport(patientId, visitId) string
    +generateBatch(patientIds) list
  }
  DiagnosticService --> ReportFactory : uses`,
      },
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

class PathologyReportFactory(ReportFactory):
    def create_report(self) -> MedicalReport:
        return PathologyReport()

class DiagnosticService:
    """
    Consumer — generates clinical reports using an injected ReportFactory.
    The service drives the diagnostic workflow but is fully decoupled from
    the specific report format (HL7, DICOM, CAP) chosen by the factory.
    A new report type (e.g. GenomicsReport) requires no change here.
    """
    def __init__(self, factory: ReportFactory) -> None:
        self._factory = factory

    def generate_report(self, patient_id: str, visit_id: str) -> str:
        """Create and render a report for a single patient visit."""
        report = self._factory.create_report()
        rendered = report.generate(patient_id)
        return f"[visit={visit_id}] {rendered}"

    def generate_batch(self, patient_ids: list[str]) -> list[str]:
        """Generate reports for a list of patients in one batch job."""
        return [self._factory.create_report().generate(pid) for pid in patient_ids]

# ── Usage ──
# Swap factory to switch report type — DiagnosticService is unchanged
lab_svc = DiagnosticService(LabReportFactory())
print(lab_svc.generate_report("PAT-00291", "VISIT-0042"))
rad_svc = DiagnosticService(RadiologyReportFactory())
print(rad_svc.generate_batch(["PAT-001", "PAT-002"]))`,
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

// DiagnosticService — Consumer: generates reports via an injected ReportFactory.
// Knows nothing about LabReport or RadiologyReport — factory selection drives format.
type DiagnosticService struct {
	factory ReportFactory
}

func NewDiagnosticService(f ReportFactory) *DiagnosticService {
	return &DiagnosticService{factory: f}
}

func (ds *DiagnosticService) GenerateReport(patientID string) string {
	report := ds.factory.CreateReport()
	return report.Generate(patientID)
}

func (ds *DiagnosticService) GenerateBatch(patientIDs []string) []string {
	results := make([]string, 0, len(patientIDs))
	for _, id := range patientIDs {
		results = append(results, ds.GenerateReport(id))
	}
	return results
}

func main() {
	// Swap factory to change report type — DiagnosticService is unchanged
	ds := NewDiagnosticService(RadiologyReportFactory{})
	fmt.Println(ds.GenerateReport("PAT-00291"))
	ds2 := NewDiagnosticService(LabReportFactory{})
	fmt.Println(ds2.GenerateReport("PAT-00292"))
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
}

/**
 * DiagnosticService — Consumer: generates medical reports via an injected ReportFactory.
 * Decoupled from LabReport and RadiologyReport — switching the factory switches the format
 * without modifying this class or any downstream clinical workflow code.
 */
class DiagnosticService {
    private final ReportFactory factory;

    DiagnosticService(ReportFactory factory) { this.factory = factory; }

    String generateReport(String patientId) {
        return factory.createReport().generate(patientId);
    }

    java.util.List<String> generateBatch(java.util.List<String> patientIds) {
        java.util.List<String> results = new java.util.ArrayList<>();
        for (String id : patientIds) results.add(generateReport(id));
        return results;
    }

    public static void main(String[] args) {
        // Swap factory to change report format — DiagnosticService is unchanged
        DiagnosticService svc = new DiagnosticService(new RadiologyReportFactory());
        System.out.println(svc.generateReport("PAT-00291"));
        DiagnosticService svc2 = new DiagnosticService(new LabReportFactory());
        System.out.println(svc2.generateReport("PAT-00292"));
    }
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

/**
 * DiagnosticService — Consumer: generates medical reports via an injected ReportFactory.
 * Decoupled from LabReport and RadiologyReport — the factory drives the output format;
 * this service handles patient routing, batching, and audit logging for any report type.
 */
class DiagnosticService {
  constructor(private factory: ReportFactory) {}

  generateReport(patientId: string): string {
    return this.factory.createReport().generate(patientId);
  }

  generateBatch(patientIds: string[]): string[] {
    return patientIds.map(id => this.generateReport(id));
  }
}

// ── Usage ──
// Swap factory to change report format — DiagnosticService is unchanged
const labSvc = new DiagnosticService(new RadiologyReportFactory());
console.log(labSvc.generateReport("PAT-00291"));`,
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

/// DiagnosticService — Consumer: generates medical reports via an injected factory.
/// Fully decoupled from LabReport and RadiologyReport — the factory trait object
/// determines the format; swapping it changes clinical output without code changes.
struct DiagnosticService {
    factory: Box<dyn ReportFactory>,
}

impl DiagnosticService {
    fn new(factory: Box<dyn ReportFactory>) -> Self {
        DiagnosticService { factory }
    }

    fn generate_report(&self, patient_id: &str) -> String {
        self.factory.create_report().generate(patient_id)
    }

    fn generate_batch(&self, patient_ids: &[&str]) -> Vec<String> {
        patient_ids.iter().map(|id| self.generate_report(id)).collect()
    }
}

fn main() {
    // Swap factory to change report type — DiagnosticService is unchanged
    let ds = DiagnosticService::new(Box::new(RadiologyReportFactory));
    println!("{}", ds.generate_report("PAT-00291"));
    let ds2 = DiagnosticService::new(Box::new(LabReportFactory));
    println!("{}", ds2.generate_report("PAT-00292"));
}`,
      },
      considerations: [
        "Each report format has strict regulatory requirements — validate output against the standard's schema (HL7 CDA, DICOM SR)",
        "Template sections vary by report type — use the factory method to also inject section builders for headers, footers, and signatures",
        "Reports may need digital signatures for legal compliance — consider a decorator or post-processing step after factory creation",
        "Version the report templates so old reports can be re-generated in their original format even after updates",
        "Logging and audit trails are required — each factory should log which report type was created and for which patient",
      ],
      codeFiles: {
        Python: [
          {
            name: "medical_report.py",
            dir: "reports/",
            content: `"""
reports/medical_report.py
--------------------------
Product interface and concrete report implementations.
Each MedicalReport subclass encapsulates a specific regulatory format:
HL7 CDA (lab), DICOM SR (radiology), CAP Synoptic (pathology).
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@dataclass
class ReportSection:
    title: str
    content: str


@dataclass
class ReportMetadata:
    patient_id: str
    clinician_id: str
    facility_id: str
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())


class MedicalReport(ABC):
    """Product interface — all reports implement generate() with the same contract."""

    @abstractmethod
    def generate(self, meta: ReportMetadata) -> dict:
        """
        Generate the report document.

        Returns a dict with at least:
          - format: regulatory format identifier
          - patient_id: patient reference
          - sections: list of {title, content}
          - compliant: bool
        """
        ...

    @abstractmethod
    def validate(self, report: dict) -> List[str]:
        """Return a list of validation errors (empty list = valid)."""
        ...


class LabReport(MedicalReport):
    """HL7 CDA-formatted laboratory results report."""

    _REQUIRED_SECTIONS = ["Patient Demographics", "Test Orders", "Results", "Interpretation"]

    def generate(self, meta: ReportMetadata) -> dict:
        return {
            "format": "HL7-CDA-R2",
            "patient_id": meta.patient_id,
            "clinician": meta.clinician_id,
            "timestamp": meta.timestamp,
            "sections": [
                ReportSection("Patient Demographics", f"MRN: {meta.patient_id}"),
                ReportSection("Test Orders", "CBC, BMP, Lipid Panel, HbA1c"),
                ReportSection("Results", "WBC: 7.2 K/μL | Glucose: 94 mg/dL | LDL: 112 mg/dL"),
                ReportSection("Interpretation", "All values within reference range."),
            ],
            "compliant": True,
        }

    def validate(self, report: dict) -> List[str]:
        errors = []
        for section_title in self._REQUIRED_SECTIONS:
            if not any(s.title == section_title for s in report.get("sections", [])):
                errors.append(f"Missing required section: {section_title}")
        return errors


class RadiologyReport(MedicalReport):
    """DICOM SR-based radiology imaging report."""

    def generate(self, meta: ReportMetadata) -> dict:
        return {
            "format": "DICOM-SR",
            "patient_id": meta.patient_id,
            "modality": "CT",
            "body_part": "CHEST",
            "timestamp": meta.timestamp,
            "sections": [
                ReportSection("Clinical History", "Persistent cough, rule out PE."),
                ReportSection("Technique", "CT chest with IV contrast, 1.25mm slices."),
                ReportSection("Findings", "No pulmonary emboli. Mild bilateral basal atelectasis."),
                ReportSection("Impression", "No acute cardiopulmonary disease."),
            ],
            "compliant": True,
        }

    def validate(self, report: dict) -> List[str]:
        required = ["Clinical History", "Technique", "Findings", "Impression"]
        return [
            f"Missing: {s}" for s in required
            if not any(sec.title == s for sec in report.get("sections", []))
        ]


class PathologyReport(MedicalReport):
    """CAP Synoptic pathology report for surgical specimens."""

    def generate(self, meta: ReportMetadata) -> dict:
        return {
            "format": "CAP-Synoptic",
            "patient_id": meta.patient_id,
            "specimen_type": "Excisional biopsy",
            "timestamp": meta.timestamp,
            "sections": [
                ReportSection("Specimen", "Right axillary lymph node, excisional biopsy."),
                ReportSection("Diagnosis", "Reactive lymph node hyperplasia. No malignancy."),
                ReportSection("Synoptic Data", "Size: 1.8cm | Margins: free | Grade: N/A"),
                ReportSection("Ancillary Studies", "IHC: CD20+, CD3+, BCL2−"),
            ],
            "compliant": True,
        }

    def validate(self, report: dict) -> List[str]:
        if not report.get("specimen_type"):
            return ["Missing specimen type"]
        return []
`,
          },
          {
            name: "report_factory.py",
            dir: "reports/",
            content: `"""
reports/report_factory.py
--------------------------
Abstract Creator and concrete factory subclasses for medical reports.
The report service depends only on ReportFactory — adding a new report
type (e.g., Cardiology) requires only a new factory subclass,
no changes to existing service code.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from reports.medical_report import MedicalReport, ReportMetadata, LabReport, RadiologyReport, PathologyReport


class ReportFactory(ABC):
    """
    Creator — declares createReport() and the template generate_and_validate()
    operation. Concrete factories specialise for each regulatory format.
    """

    @abstractmethod
    def create_report(self) -> MedicalReport:
        """Factory method — subclass decides which report type to create."""
        ...

    def generate_and_validate(self, patient_id: str, clinician_id: str, facility_id: str) -> dict:
        """
        Template operation: create the report, generate content, validate compliance.
        Returns the report dict augmented with a 'validation_errors' key.
        """
        meta = ReportMetadata(
            patient_id=patient_id,
            clinician_id=clinician_id,
            facility_id=facility_id,
        )
        report_obj = self.create_report()
        report = report_obj.generate(meta)
        errors = report_obj.validate(report)

        report["validation_errors"] = errors
        report["compliant"] = len(errors) == 0
        return report


class LabReportFactory(ReportFactory):
    """Creates HL7 CDA lab reports."""
    def create_report(self) -> MedicalReport:
        return LabReport()


class RadiologyReportFactory(ReportFactory):
    """Creates DICOM SR radiology reports."""
    def create_report(self) -> MedicalReport:
        return RadiologyReport()


class PathologyReportFactory(ReportFactory):
    """Creates CAP Synoptic pathology reports."""
    def create_report(self) -> MedicalReport:
        return PathologyReport()


# ── Factory selector — maps report type string to factory instance ──

_FACTORY_MAP = {
    "lab": LabReportFactory,
    "radiology": RadiologyReportFactory,
    "pathology": PathologyReportFactory,
}


def get_report_factory(report_type: str) -> ReportFactory:
    factory_cls = _FACTORY_MAP.get(report_type.lower())
    if not factory_cls:
        raise ValueError(f"Unknown report type: {report_type}")
    return factory_cls()
`,
          },
          {
            name: "report_service.py",
            dir: "services/",
            content: `"""
services/report_service.py
---------------------------
ReportService depends only on ReportFactory — it never imports a
concrete report class. When a new report type is added, only
report_factory.py changes; this service stays frozen.
"""
from reports.report_factory import get_report_factory


class ReportService:
    def generate(
        self,
        report_type: str,
        patient_id: str,
        clinician_id: str = "DR-001",
        facility_id: str = "FAC-GENERAL",
    ) -> dict:
        factory = get_report_factory(report_type)
        return factory.generate_and_validate(patient_id, clinician_id, facility_id)


# ── Entry point ────────────────────────────────────────────────────
if __name__ == "__main__":
    svc = ReportService()

    for rtype in ["lab", "radiology", "pathology"]:
        report = svc.generate(rtype, patient_id="PAT-00291")
        print(f"[{report['format']}] patient={report['patient_id']} "
              f"sections={len(report['sections'])} "
              f"compliant={report['compliant']}")
`,
          },
          {
            name: "test_report_factory.py",
            dir: "tests/",
            content: `"""
tests/test_report_factory.py
------------------------------
Verifies factory contract: correct report type, required sections, compliance.
"""
import pytest
from reports.report_factory import (
    LabReportFactory, RadiologyReportFactory, PathologyReportFactory, get_report_factory,
)
from reports.medical_report import LabReport, RadiologyReport, PathologyReport


class TestFactoryProductTypes:
    def test_lab_factory_creates_lab_report(self):
        assert isinstance(LabReportFactory().create_report(), LabReport)

    def test_radiology_factory_creates_radiology_report(self):
        assert isinstance(RadiologyReportFactory().create_report(), RadiologyReport)

    def test_pathology_factory_creates_pathology_report(self):
        assert isinstance(PathologyReportFactory().create_report(), PathologyReport)


class TestGenerateAndValidate:
    def test_lab_report_is_compliant(self):
        result = LabReportFactory().generate_and_validate("PAT-001", "DR-001", "FAC-001")
        assert result["compliant"] is True
        assert len(result["validation_errors"]) == 0

    def test_radiology_report_has_four_sections(self):
        result = RadiologyReportFactory().generate_and_validate("PAT-002", "DR-002", "FAC-001")
        assert len(result["sections"]) == 4

    def test_format_identifiers_are_distinct(self):
        lab = LabReportFactory().generate_and_validate("PAT-001", "DR-001", "FAC-001")
        rad = RadiologyReportFactory().generate_and_validate("PAT-001", "DR-001", "FAC-001")
        assert lab["format"] != rad["format"]


class TestFactorySelector:
    def test_get_factory_lab(self):
        assert isinstance(get_report_factory("lab"), LabReportFactory)

    def test_get_factory_unknown_raises(self):
        with pytest.raises(ValueError, match="Unknown report type"):
            get_report_factory("dental")
`,
          },
        ],
        Go: [
          {
            name: "report.go",
            dir: "reports/",
            content: `// reports/report.go
// Product interface and concrete report implementations.
// Each type encapsulates its own regulatory format.
package reports

import "time"

// ReportMeta holds patient and encounter context for report generation.
type ReportMeta struct {
	PatientID   string
	ClinicianID string
	FacilityID  string
	Timestamp   string
}

func NewMeta(patientID, clinicianID, facilityID string) ReportMeta {
	return ReportMeta{
		PatientID:   patientID,
		ClinicianID: clinicianID,
		FacilityID:  facilityID,
		Timestamp:   time.Now().UTC().Format(time.RFC3339),
	}
}

// Section represents one logical block within a clinical document.
type Section struct {
	Title   string
	Content string
}

// Report is the product type — the generated clinical document.
type Report struct {
	Format   string
	PatientID string
	Sections []Section
	Compliant bool
}

// MedicalReport is the Product interface.
type MedicalReport interface {
	Generate(meta ReportMeta) Report
	Validate(r Report) []string
}

// ─── LabReport ────────────────────────────────────────────────

type LabReport struct{}

func (l LabReport) Generate(meta ReportMeta) Report {
	return Report{
		Format:    "HL7-CDA-R2",
		PatientID: meta.PatientID,
		Sections: []Section{
			{"Patient Demographics", "MRN: " + meta.PatientID},
			{"Test Orders", "CBC, BMP, Lipid Panel, HbA1c"},
			{"Results", "WBC: 7.2 K/μL | Glucose 94 mg/dL"},
			{"Interpretation", "All values within reference range."},
		},
		Compliant: true,
	}
}

func (l LabReport) Validate(r Report) []string {
	required := []string{"Patient Demographics", "Test Orders", "Results", "Interpretation"}
	idx := make(map[string]bool, len(r.Sections))
	for _, s := range r.Sections {
		idx[s.Title] = true
	}
	var errs []string
	for _, title := range required {
		if !idx[title] {
			errs = append(errs, "Missing section: "+title)
		}
	}
	return errs
}

// ─── RadiologyReport ──────────────────────────────────────────

type RadiologyReport struct{}

func (r RadiologyReport) Generate(meta ReportMeta) Report {
	return Report{
		Format:    "DICOM-SR",
		PatientID: meta.PatientID,
		Sections: []Section{
			{"Clinical History", "Persistent cough, rule out PE."},
			{"Technique", "CT chest with IV contrast, 1.25mm slices."},
			{"Findings", "No pulmonary emboli. Mild bilateral basal atelectasis."},
			{"Impression", "No acute cardiopulmonary disease."},
		},
		Compliant: true,
	}
}

func (r RadiologyReport) Validate(rep Report) []string { return nil }
`,
          },
          {
            name: "factory.go",
            dir: "reports/",
            content: `// reports/factory.go
// Creator interface and concrete factories for clinical document generation.
package reports

import "fmt"

// ReportFactory is the Creator interface.
type ReportFactory interface {
	CreateReport() MedicalReport
	GenerateAndValidate(patientID, clinicianID, facilityID string) (Report, []string)
}

// baseFactory provides the shared GenerateAndValidate template.
type baseFactory struct{}

func (b baseFactory) generateAndValidate(
	f ReportFactory,
	patientID, clinicianID, facilityID string,
) (Report, []string) {
	meta := NewMeta(patientID, clinicianID, facilityID)
	reportDoc := f.CreateReport()
	result := reportDoc.Generate(meta)
	errors := reportDoc.Validate(result)
	result.Compliant = len(errors) == 0
	return result, errors
}

// ─── LabReportFactory ─────────────────────────────────────────

type LabReportFactory struct{ baseFactory }

func (f *LabReportFactory) CreateReport() MedicalReport { return LabReport{} }

func (f *LabReportFactory) GenerateAndValidate(pid, cid, fid string) (Report, []string) {
	return f.generateAndValidate(f, pid, cid, fid)
}

// ─── RadiologyReportFactory ───────────────────────────────────

type RadiologyReportFactory struct{ baseFactory }

func (f *RadiologyReportFactory) CreateReport() MedicalReport { return RadiologyReport{} }

func (f *RadiologyReportFactory) GenerateAndValidate(pid, cid, fid string) (Report, []string) {
	return f.generateAndValidate(f, pid, cid, fid)
}

// ─── Factory selector ─────────────────────────────────────────

func GetReportFactory(reportType string) (ReportFactory, error) {
	switch reportType {
	case "lab":
		return &LabReportFactory{}, nil
	case "radiology":
		return &RadiologyReportFactory{}, nil
	default:
		return nil, fmt.Errorf("unknown report type: %s", reportType)
	}
}
`,
          },
          {
            name: "diagnostic_service.go",
            dir: "services/",
            content: `// services/diagnostic_service.go
// DiagnosticService — Consumer. Depends only on reports.ReportFactory.
// Never imports LabReportFactory, RadiologyReportFactory, or PathologyReportFactory.
package services

import "github.com/example/healthcare/reports"

// DiagnosticService generates patient reports via an injected ReportFactory.
type DiagnosticService struct {
	factory reports.ReportFactory
}

func NewDiagnosticService(f reports.ReportFactory) *DiagnosticService {
	return &DiagnosticService{factory: f}
}

func (ds *DiagnosticService) Generate(meta reports.ReportMeta) (reports.ReportResult, error) {
	result := ds.factory.GenerateAndValidate(meta)
	return result, nil
}

func (ds *DiagnosticService) GenerateBatch(patients []reports.ReportMeta) []reports.ReportResult {
	results := make([]reports.ReportResult, 0, len(patients))
	for _, m := range patients {
		r, _ := ds.Generate(m)
		results = append(results, r)
	}
	return results
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/reports/",
            content: `// cmd/reports/main.go
// Wires the lab report factory into DiagnosticService and generates reports.
package main

import (
	"fmt"
	"log"

	"github.com/example/healthcare/reports"
	"github.com/example/healthcare/services"
)

func main() {
	// Swap factory here to change report type — DiagnosticService is unchanged.
	factory, err := reports.GetReportFactory("lab")
	if err != nil {
		log.Fatalf("factory error: %v", err)
	}

	svc := services.NewDiagnosticService(factory)

	visits := []services.PatientVisit{
		{PatientID: "PAT-00291", VisitID: "DR-002", FacilityID: "FAC-GEN"},
		{PatientID: "PAT-00292", VisitID: "DR-003", FacilityID: "FAC-GEN"},
	}

	for _, r := range svc.GenerateBatch(visits) {
		fmt.Printf("[%s] patient=%s sections=%d compliant=%v\\n",
			r.Doc.Format, r.Doc.PatientID, len(r.Doc.Sections), r.Doc.Compliant)
	}
}
`,
          },
        ],
        Java: [
          {
            name: "MedicalReport.java",
            dir: "src/main/java/com/hospital/reports/",
            content: `package com.hospital.reports;

import java.util.List;

/**
 * Product interface — all medical report types implement this contract.
 * Regulatory formats (HL7, DICOM, CAP) are hidden behind this interface.
 */
public interface MedicalReport {

    /**
     * Generate the full report document for a patient encounter.
     * @param meta Patient and encounter context
     * @return ReportDocument with sections, format ID, and compliance flag
     */
    ReportDocument generate(ReportMeta meta);

    /**
     * Validate the generated document against its format's requirements.
     * @param doc The document returned by generate()
     * @return List of validation error messages; empty list means compliant.
     */
    List<String> validate(ReportDocument doc);
}
`,
          },
          {
            name: "LabReport.java",
            dir: "src/main/java/com/hospital/reports/",
            content: `package com.hospital.reports;

import java.util.ArrayList;
import java.util.List;

/**
 * HL7 CDA R2 laboratory results report.
 * Implements the MedicalReport product interface for lab contexts.
 */
public class LabReport implements MedicalReport {

    private static final List<String> REQUIRED_SECTIONS =
        List.of("Patient Demographics", "Test Orders", "Results", "Interpretation");

    @Override
    public ReportDocument generate(ReportMeta meta) {
        return ReportDocument.builder()
            .format("HL7-CDA-R2")
            .patientId(meta.getPatientId())
            .clinician(meta.getClinicianId())
            .addSection("Patient Demographics", "MRN: " + meta.getPatientId())
            .addSection("Test Orders", "CBC, BMP, Lipid Panel, HbA1c")
            .addSection("Results", "WBC: 7.2 K/μL | Glucose: 94 mg/dL | LDL: 112 mg/dL")
            .addSection("Interpretation", "All values within reference range.")
            .build();
    }

    @Override
    public List<String> validate(ReportDocument doc) {
        var errors = new ArrayList<String>();
        var sectionTitles = doc.getSectionTitles();
        for (var required : REQUIRED_SECTIONS) {
            if (!sectionTitles.contains(required)) {
                errors.add("Missing required section: " + required);
            }
        }
        return errors;
    }
}
`,
          },
          {
            name: "ReportFactory.java",
            dir: "src/main/java/com/hospital/reports/",
            content: `package com.hospital.reports;

import java.util.List;
import java.util.Map;

/**
 * Creator (abstract) — declares the factory method and the template
 * generateAndValidate() operation.
 *
 * <p>New report types add a subclass here; the service layer never changes.</p>
 */
public abstract class ReportFactory {

    /** Factory method — subclasses return the appropriate MedicalReport type. */
    protected abstract MedicalReport createReport();

    /**
     * Template operation: creates, generates, validates.
     * The report service calls this — it never calls createReport() directly.
     */
    public final ReportResult generateAndValidate(ReportMeta meta) {
        MedicalReport report = createReport();
        ReportDocument doc   = report.generate(meta);
        List<String>   errs  = report.validate(doc);
        doc.setCompliant(errs.isEmpty());
        return new ReportResult(doc, errs);
    }
}
`,
          },
          {
            name: "LabReportFactory.java",
            dir: "src/main/java/com/hospital/reports/",
            content: `package com.hospital.reports;

/**
 * Concrete Creator for HL7 CDA lab reports.
 * Knows how to construct and configure a LabReport product.
 */
public class LabReportFactory extends ReportFactory {

    @Override
    protected MedicalReport createReport() {
        return new LabReport();
    }
}
`,
          },
          {
            name: "DiagnosticService.java",
            dir: "src/main/java/com/hospital/diagnostics/",
            content: `package com.hospital.diagnostics;

import com.hospital.reports.ReportFactory;
import com.hospital.reports.ReportMeta;
import com.hospital.reports.ReportResult;
import java.util.List;
import java.util.ArrayList;

/**
 * DiagnosticService — Consumer. Depends only on ReportFactory.
 * Never imports LabReportFactory, RadiologyReportFactory, or PathologyReportFactory.
 * Swap the factory at the call site to change report type.
 */
public class DiagnosticService {

    private final ReportFactory factory;

    public DiagnosticService(ReportFactory factory) {
        this.factory = factory;
    }

    /**
     * Generate and validate a medical report for a single patient encounter.
     * @param meta patient, clinician, and facility context
     * @return ReportResult containing the document and any compliance errors
     */
    public ReportResult generate(ReportMeta meta) {
        return factory.generateAndValidate(meta);
    }

    /** Generate reports for multiple patient encounters using the same factory. */
    public List<ReportResult> generateBatch(List<ReportMeta> patients) {
        List<ReportResult> results = new ArrayList<>();
        for (ReportMeta m : patients) {
            results.add(generate(m));
        }
        return results;
    }
}
`,
          },
          {
            name: "ReportFactoryTest.java",
            dir: "src/test/java/com/hospital/reports/",
            content: `package com.hospital.reports;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

class ReportFactoryTest {

    private static final ReportMeta META = new ReportMeta("PAT-001", "DR-001", "FAC-GEN");

    @Test
    void labFactory_createReport_returnsLabReport() {
        assertTrue(new LabReportFactory().createReport() instanceof LabReport);
    }

    @Test
    void labFactory_generate_compliant() {
        var result = new LabReportFactory().generateAndValidate(META);
        assertTrue(result.document().isCompliant());
        assertTrue(result.validationErrors().isEmpty());
    }

    @Test
    void labReport_hasFourSections() {
        var result = new LabReportFactory().generateAndValidate(META);
        assertEquals(4, result.document().getSectionCount());
    }

    @Test
    void radiologyFormat_distinctFromLab() {
        var lab = new LabReportFactory().generateAndValidate(META);
        var rad = new RadiologyReportFactory().generateAndValidate(META);
        assertNotEquals(lab.document().getFormat(), rad.document().getFormat());
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "medical-report.ts",
            dir: "src/reports/",
            content: `/**
 * src/reports/medical-report.ts
 * --------------------------------
 * Product interface and concrete medical report implementations.
 * Each class encapsulates a specific regulatory format.
 */

export interface ReportSection {
  readonly title: string;
  readonly content: string;
}

export interface ReportMeta {
  patientId: string;
  clinicianId: string;
  facilityId: string;
  timestamp?: string;
}

export interface ReportDocument {
  format: string;
  patientId: string;
  sections: ReportSection[];
  compliant: boolean;
  validationErrors?: string[];
}

export interface MedicalReport {
  generate(meta: ReportMeta): ReportDocument;
  validate(doc: ReportDocument): string[];
}

// ─── LabReport ─────────────────────────────────────────────────

const LAB_REQUIRED_SECTIONS = ["Patient Demographics", "Test Orders", "Results", "Interpretation"];

export class LabReport implements MedicalReport {
  generate(meta: ReportMeta): ReportDocument {
    return {
      format: "HL7-CDA-R2",
      patientId: meta.patientId,
      compliant: true,
      sections: [
        { title: "Patient Demographics", content: \`MRN: \${meta.patientId}\` },
        { title: "Test Orders",          content: "CBC, BMP, Lipid Panel, HbA1c" },
        { title: "Results",              content: "WBC: 7.2 K/μL | Glucose: 94 mg/dL" },
        { title: "Interpretation",       content: "All values within reference range." },
      ],
    };
  }

  validate(doc: ReportDocument): string[] {
    const titles = new Set(doc.sections.map(s => s.title));
    return LAB_REQUIRED_SECTIONS
      .filter(r => !titles.has(r))
      .map(r => \`Missing required section: \${r}\`);
  }
}

// ─── RadiologyReport ───────────────────────────────────────────

export class RadiologyReport implements MedicalReport {
  generate(meta: ReportMeta): ReportDocument {
    return {
      format: "DICOM-SR",
      patientId: meta.patientId,
      compliant: true,
      sections: [
        { title: "Clinical History", content: "Persistent cough, rule out PE." },
        { title: "Technique",        content: "CT chest with IV contrast, 1.25mm slices." },
        { title: "Findings",         content: "No pulmonary emboli. Mild bilateral basal atelectasis." },
        { title: "Impression",       content: "No acute cardiopulmonary disease." },
      ],
    };
  }

  validate(doc: ReportDocument): string[] { return []; }
}

// ─── PathologyReport ───────────────────────────────────────────

export class PathologyReport implements MedicalReport {
  generate(meta: ReportMeta): ReportDocument {
    return {
      format: "CAP-Synoptic",
      patientId: meta.patientId,
      compliant: true,
      sections: [
        { title: "Specimen",         content: "Right axillary lymph node, excisional biopsy." },
        { title: "Diagnosis",        content: "Reactive hyperplasia. No malignancy." },
        { title: "Synoptic Data",    content: "Size: 1.8cm | Margins: free | Grade: N/A" },
        { title: "Ancillary Studies", content: "IHC: CD20+, CD3+, BCL2−" },
      ],
    };
  }

  validate(doc: ReportDocument): string[] { return []; }
}
`,
          },
          {
            name: "report-factory.ts",
            dir: "src/reports/",
            content: `/**
 * src/reports/report-factory.ts
 * --------------------------------
 * Creator abstract class and concrete report factories.
 * The service layer depends only on ReportFactory.
 */
import { MedicalReport, ReportDocument, ReportMeta, LabReport, RadiologyReport, PathologyReport } from "./medical-report";

export abstract class ReportFactory {
  /** Factory method — subclasses return the correct report implementation. */
  abstract createReport(): MedicalReport;

  /** Template operation: generate + validate in one call. */
  generateAndValidate(meta: ReportMeta): ReportDocument {
    const report    = this.createReport();
    const doc       = report.generate(meta);
    const errors    = report.validate(doc);
    doc.compliant         = errors.length === 0;
    doc.validationErrors  = errors;
    return doc;
  }
}

// ─── Concrete Factories ─────────────────────────────────────────

export class LabReportFactory extends ReportFactory {
  createReport(): MedicalReport { return new LabReport(); }
}

export class RadiologyReportFactory extends ReportFactory {
  createReport(): MedicalReport { return new RadiologyReport(); }
}

export class PathologyReportFactory extends ReportFactory {
  createReport(): MedicalReport { return new PathologyReport(); }
}

// ─── Factory selector ────────────────────────────────────────────

type ReportType = "lab" | "radiology" | "pathology";

const FACTORY_MAP: Record<ReportType, () => ReportFactory> = {
  lab:        () => new LabReportFactory(),
  radiology:  () => new RadiologyReportFactory(),
  pathology:  () => new PathologyReportFactory(),
};

export function getReportFactory(type: string): ReportFactory {
  const creator = FACTORY_MAP[type as ReportType];
  if (!creator) throw new Error(\`Unknown report type: \${type}\`);
  return creator();
}
`,
          },
          {
            name: "report-service.ts",
            dir: "src/",
            content: `/**
 * src/report-service.ts
 * ----------------------
 * DiagnosticService — Consumer. Depends only on ReportFactory.
 * Never imports LabReportFactory, RadiologyReportFactory, or PathologyReportFactory.
 * Swap the factory at the callsite to change report type.
 */
import { getReportFactory, ReportFactory } from "./reports/report-factory";

export class DiagnosticService {
  constructor(private readonly factory: ReportFactory) {}

  /** Generate and validate a report for a single patient encounter. */
  generate(meta: { patientId: string; clinicianId: string; facilityId: string }) {
    return this.factory.generateAndValidate(meta);
  }

  /** Generate reports for multiple patient encounters using the same factory. */
  generateBatch(
    patients: Array<{ patientId: string; clinicianId: string; facilityId: string }>,
  ) {
    return patients.map(m => this.generate(m));
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────────────────
// Swap factory here to switch report type — DiagnosticService code is unchanged.
const svc = new DiagnosticService(getReportFactory("lab"));

const results = svc.generateBatch([
  { patientId: "PAT-00291", clinicianId: "DR-002", facilityId: "FAC-GEN" },
  { patientId: "PAT-00292", clinicianId: "DR-003", facilityId: "FAC-GEN" },
]);

results.forEach(r =>
  console.log("[" + r.doc.format + "] patient=" + r.doc.patientId + " compliant=" + r.doc.compliant),
);
`,
          },
        ],
        Rust: [
          {
            name: "report.rs",
            dir: "src/",
            content: `//! src/report.rs
//! Product trait and concrete medical report implementations.

#[derive(Debug, Clone)]
pub struct Section {
    pub title: String,
    pub content: String,
}

#[derive(Debug)]
pub struct ReportMeta {
    pub patient_id: String,
    pub clinician_id: String,
    pub facility_id: String,
}

#[derive(Debug)]
pub struct ReportDocument {
    pub format: String,
    pub patient_id: String,
    pub sections: Vec<Section>,
    pub compliant: bool,
}

/// Product trait — all report types implement this.
pub trait MedicalReport {
    fn generate(&self, meta: &ReportMeta) -> ReportDocument;
    fn validate(&self, doc: &ReportDocument) -> Vec<String>;
}

// ─── LabReport ─────────────────────────────────────────────────

pub struct LabReport;

impl MedicalReport for LabReport {
    fn generate(&self, meta: &ReportMeta) -> ReportDocument {
        ReportDocument {
            format: "HL7-CDA-R2".into(),
            patient_id: meta.patient_id.clone(),
            compliant: true,
            sections: vec![
                Section { title: "Patient Demographics".into(), content: format!("MRN: {}", meta.patient_id) },
                Section { title: "Test Orders".into(), content: "CBC, BMP, Lipid Panel".into() },
                Section { title: "Results".into(), content: "WBC: 7.2 K/μL | Glucose: 94 mg/dL".into() },
                Section { title: "Interpretation".into(), content: "All values within reference range.".into() },
            ],
        }
    }

    fn validate(&self, doc: &ReportDocument) -> Vec<String> {
        let required = ["Patient Demographics", "Test Orders", "Results", "Interpretation"];
        let titles: Vec<_> = doc.sections.iter().map(|s| s.title.as_str()).collect();
        required.iter()
            .filter(|&&r| !titles.contains(&r))
            .map(|&r| format!("Missing section: {}", r))
            .collect()
    }
}

// ─── RadiologyReport ───────────────────────────────────────────

pub struct RadiologyReport;

impl MedicalReport for RadiologyReport {
    fn generate(&self, meta: &ReportMeta) -> ReportDocument {
        ReportDocument {
            format: "DICOM-SR".into(),
            patient_id: meta.patient_id.clone(),
            compliant: true,
            sections: vec![
                Section { title: "Clinical History".into(), content: "Persistent cough.".into() },
                Section { title: "Technique".into(), content: "CT chest with IV contrast.".into() },
                Section { title: "Findings".into(), content: "No pulmonary emboli.".into() },
                Section { title: "Impression".into(), content: "No acute cardiopulmonary disease.".into() },
            ],
        }
    }

    fn validate(&self, _doc: &ReportDocument) -> Vec<String> { vec![] }
}
`,
          },
          {
            name: "factory.rs",
            dir: "src/",
            content: `//! src/factory.rs
//! Creator trait and concrete report factories.

use crate::report::{LabReport, MedicalReport, RadiologyReport, ReportDocument, ReportMeta};

/// Creator trait — factory method + template operation.
pub trait ReportFactory {
    fn create_report(&self) -> Box<dyn MedicalReport>;

    fn generate_and_validate(
        &self,
        patient_id: &str,
        clinician_id: &str,
        facility_id: &str,
    ) -> (ReportDocument, Vec<String>) {
        let meta = ReportMeta {
            patient_id: patient_id.to_string(),
            clinician_id: clinician_id.to_string(),
            facility_id: facility_id.to_string(),
        };
        let report = self.create_report();
        let mut doc = report.generate(&meta);
        let errors = report.validate(&doc);
        doc.compliant = errors.is_empty();
        (doc, errors)
    }
}

pub struct LabReportFactory;
impl ReportFactory for LabReportFactory {
    fn create_report(&self) -> Box<dyn MedicalReport> { Box::new(LabReport) }
}

pub struct RadiologyReportFactory;
impl ReportFactory for RadiologyReportFactory {
    fn create_report(&self) -> Box<dyn MedicalReport> { Box::new(RadiologyReport) }
}

pub fn get_factory(report_type: &str) -> Result<Box<dyn ReportFactory>, String> {
    match report_type {
        "lab"       => Ok(Box::new(LabReportFactory)),
        "radiology" => Ok(Box::new(RadiologyReportFactory)),
        other       => Err(format!("Unknown report type: {}", other)),
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! DiagnosticService — Consumer that depends only on ReportFactory.
mod report;
mod factory;

use report::ReportDocument;
use factory::{get_factory, ReportFactory};

// ─── Consumer ───────────────────────────────────────────────────────────
// DiagnosticService depends only on ReportFactory — never on LabReportFactory,
// RadiologyReportFactory, or PathologyReportFactory. Swap factory to change type.
struct DiagnosticService {
    factory: Box<dyn ReportFactory>,
}

impl DiagnosticService {
    fn new(factory: Box<dyn ReportFactory>) -> Self {
        Self { factory }
    }

    fn generate(
        &self, patient_id: &str, clinician_id: &str, facility_id: &str,
    ) -> (ReportDocument, Vec<String>) {
        self.factory.generate_and_validate(patient_id, clinician_id, facility_id)
    }

    fn generate_batch(
        &self,
        visits: &[(&str, &str, &str)],
    ) -> Vec<(ReportDocument, Vec<String>)> {
        visits.iter().map(|(p, c, f)| self.generate(p, c, f)).collect()
    }
}

fn main() {
    // Swap factory here to change report type — DiagnosticService code is unchanged.
    let factory = get_factory("lab").expect("factory error");
    let svc = DiagnosticService::new(factory);

    let visits = vec![
        ("PAT-00291", "DR-002", "FAC-GEN"),
        ("PAT-00292", "DR-003", "FAC-GEN"),
    ];

    for (doc, errors) in svc.generate_batch(&visits) {
        println!("[{}] patient={} sections={} compliant={}",
            doc.format, doc.patient_id, doc.sections.len(), doc.compliant);
        if !errors.is_empty() {
            eprintln!("  Validation errors: {:?}", errors);
        }
    }
}
`,
          },
        ],
      },
    },
    {
      id: 3,
      title: "E-Commerce — Notification Channel Factory",
      domain: "E-Commerce",
      problem:
        "An e-commerce platform sends order confirmations, shipping updates, and promotional alerts through email, SMS, and push notifications. Each channel has a different API, payload format, and rate-limiting policy. Mixing channel logic into the notification service creates a maintenance nightmare.",
      solution:
        "A NotificationChannelFactory factory method returns the correct NotificationChannel implementation. Campaign configurations specify the channel type; the dispatcher calls the factory without knowing which concrete channel is used.",
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class ChannelFactory {
    <<abstract>>
    +createChannel()* NotificationChannel
    +dispatch(to, message) string
  }
  class EmailChannelFactory {
    +createChannel() EmailChannel
  }
  class SMSChannelFactory {
    +createChannel() SMSChannel
  }
  class PushChannelFactory {
    +createChannel() PushChannel
  }
  class NotificationChannel {
    <<interface>>
    +send(recipient, message) string
  }
  class EmailChannel {
    +send(recipient, message) string
  }
  class SMSChannel {
    +send(recipient, message) string
  }
  class PushChannel {
    +send(recipient, message) string
  }
  ChannelFactory <|-- EmailChannelFactory
  ChannelFactory <|-- SMSChannelFactory
  ChannelFactory <|-- PushChannelFactory
  NotificationChannel <|.. EmailChannel
  NotificationChannel <|.. SMSChannel
  NotificationChannel <|.. PushChannel
  ChannelFactory ..> NotificationChannel : uses
  EmailChannelFactory ..> EmailChannel : creates
  SMSChannelFactory ..> SMSChannel : creates
  PushChannelFactory ..> PushChannel : creates
  class CampaignDispatcher {
    -factory: ChannelFactory
    +send(recipient, message) string
    +broadcast(recipients, message) list
  }
  CampaignDispatcher --> ChannelFactory : uses`,
      },
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

class CampaignDispatcher:
    """
    Consumer — sends marketing campaigns using an injected ChannelFactory.
    Knows only the NotificationChannel interface and the ChannelFactory contract;
    never imports EmailChannel, SMSChannel, or PushChannel directly.
    Adding a new channel (e.g. WhatsApp) means a new factory subclass only —
    CampaignDispatcher requires zero modifications.
    """
    def __init__(self, factory: ChannelFactory) -> None:
        self._factory = factory

    def send(self, recipient: str, message: str) -> str:
        """Dispatch a single notification through the configured channel."""
        channel = self._factory.create_channel()
        return channel.send(recipient, message)

    def broadcast(self, recipients: list[str], message: str) -> list[str]:
        """Deliver the same message to multiple recipients via one channel type."""
        channel = self._factory.create_channel()
        return [channel.send(r, message) for r in recipients]

# ── Usage ──
# Swap factory to change channel — CampaignDispatcher never changes
sms_svc = CampaignDispatcher(SMSChannelFactory())
print(sms_svc.send("+1555123456", "Your order #ORD-7821 has shipped"))
print(sms_svc.broadcast(["+1555000001", "+1555000002"], "Flash sale: 30% off now!"))`,
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

// CampaignDispatcher — Consumer: sends messages via an injected ChannelFactory.
// Knows nothing about Email or SMS — swapping the factory changes the channel.
type CampaignDispatcher struct {
	factory ChannelFactory
}

func NewCampaignDispatcher(f ChannelFactory) *CampaignDispatcher {
	return &CampaignDispatcher{factory: f}
}

func (cd *CampaignDispatcher) Send(recipient, message string) string {
	ch := cd.factory.CreateChannel()
	return ch.Send(recipient, message)
}

func (cd *CampaignDispatcher) Broadcast(recipients []string, message string) []string {
	results := make([]string, 0, len(recipients))
	for _, r := range recipients {
		results = append(results, cd.Send(r, message))
	}
	return results
}

func main() {
	// Swap factory to change channel — CampaignDispatcher never changes
	disp := NewCampaignDispatcher(SMSChannelFactory{})
	fmt.Println(disp.Send("+1555123456", "Your order shipped"))
	disp2 := NewCampaignDispatcher(EmailChannelFactory{})
	fmt.Println(disp2.Send("user@example.com", "Welcome!"))
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
}

/**
 * CampaignDispatcher — Consumer: dispatches messages via an injected ChannelFactory.
 * Completely decoupled from Email and SMS implementation details — the factory
 * determines the delivery channel; this class only orchestrates the send logic.
 */
class CampaignDispatcher {
    private final ChannelFactory factory;

    CampaignDispatcher(ChannelFactory factory) { this.factory = factory; }

    String send(String recipient, String message) {
        return factory.createChannel().send(recipient, message);
    }

    java.util.List<String> broadcast(java.util.List<String> recipients, String message) {
        java.util.List<String> results = new java.util.ArrayList<>();
        for (String r : recipients) results.add(send(r, message));
        return results;
    }

    public static void main(String[] args) {
        // Swap factory to change channel — CampaignDispatcher never changes
        CampaignDispatcher disp = new CampaignDispatcher(new SMSChannelFactory());
        System.out.println(disp.send("+1555123456", "Your order shipped"));
        CampaignDispatcher disp2 = new CampaignDispatcher(new EmailChannelFactory());
        System.out.println(disp2.send("user@example.com", "Welcome!"));
    }
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

/**
 * CampaignDispatcher — Consumer: dispatches messages via an injected ChannelFactory.
 * Completely decoupled from Email and SMS details — the factory determines the channel;
 * this class handles recipient mapping, batching, and delivery confirmation.
 */
class CampaignDispatcher {
  constructor(private factory: ChannelFactory) {}

  send(recipient: string, message: string): string {
    return this.factory.createChannel().send(recipient, message);
  }

  broadcast(recipients: string[], message: string): string[] {
    return recipients.map(r => this.send(r, message));
  }
}

// ── Usage ──
// Swap factory to change channel — CampaignDispatcher never changes
const smsDisp = new CampaignDispatcher(new SMSChannelFactory());
console.log(smsDisp.send("+1555123456", "Your order #ORD-7821 has shipped"));`,
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

/// CampaignDispatcher — Consumer: sends messages via an injected channel factory.
/// Agnostic to EmailChannel and SMSChannel; the boxed factory trait object decides
/// delivery mechanism — swap it at runtime without touching dispatcher logic.
struct CampaignDispatcher {
    factory: Box<dyn ChannelFactory>,
}

impl CampaignDispatcher {
    fn new(factory: Box<dyn ChannelFactory>) -> Self {
        CampaignDispatcher { factory }
    }

    fn send(&self, recipient: &str, message: &str) -> String {
        self.factory.create_channel().send(recipient, message)
    }

    fn broadcast(&self, recipients: &[&str], message: &str) -> Vec<String> {
        recipients.iter().map(|r| self.send(r, message)).collect()
    }
}

fn main() {
    // Swap factory to change channel — CampaignDispatcher never changes
    let disp = CampaignDispatcher::new(Box::new(SMSChannelFactory));
    println!("{}", disp.send("+1555123456", "Your order shipped"));
    let disp2 = CampaignDispatcher::new(Box::new(EmailChannelFactory));
    println!("{}", disp2.send("user@example.com", "Welcome!"));
}`,
      },
      considerations: [
        "Each channel has different rate limits — the factory can inject rate-limiter middleware specific to the channel type",
        "Message payloads differ per channel (HTML for email, 160-char for SMS) — products handle their own formatting constraints",
        "Add a fallback factory chain: if push delivery fails, retry via SMS or email",
        "Channel preferences are per-user — load the user's preferred factory from their profile settings",
        "Internationalization: the factory can inject locale-specific templates alongside the channel product",
      ],
      codeFiles: {
        Python: [
          {
            name: "notification_channel.py",
            dir: "notifications/",
            content: `"""
notifications/notification_channel.py
---------------------------------------
Product interface and concrete notification channel implementations.
Each channel encapsulates its own delivery SDK, payload constraints,
and rate-limiting behaviour.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class DeliveryResult:
    message_id: str
    channel: str
    recipient: str
    status: str          # "sent" | "queued" | "failed"
    provider: str
    error: Optional[str] = None


class NotificationChannel(ABC):
    """Product interface — every channel implements send() uniformly."""

    @abstractmethod
    def send(self, recipient: str, subject: str, body: str) -> DeliveryResult:
        """
        Send a notification.

        :param recipient: Email address, E.164 phone number, or device token.
        :param subject:   Short subject line (ignored for push/SMS).
        :param body:      Message body (channels apply their own character limits).
        """
        ...

    @abstractmethod
    def max_body_length(self) -> int:
        """Maximum body characters supported by this channel."""
        ...

    def truncated_body(self, body: str) -> str:
        """Truncate body to channel maximum (adds ellipsis if cut)."""
        limit = self.max_body_length()
        if len(body) <= limit:
            return body
        return body[: limit - 1] + "…"


class EmailChannel(NotificationChannel):
    """Amazon SES email delivery."""

    def __init__(self, from_address: str, ses_region: str = "us-east-1") -> None:
        self._from = from_address
        self._region = ses_region

    def send(self, recipient: str, subject: str, body: str) -> DeliveryResult:
        safe_body = self.truncated_body(body)
        # Production: boto3.client('ses').send_email(...)
        import uuid
        return DeliveryResult(
            message_id=f"ses-{uuid.uuid4().hex[:12]}",
            channel="email",
            recipient=recipient,
            status="sent",
            provider=f"AWS SES ({self._region})",
        )

    def max_body_length(self) -> int:
        return 100_000  # SES limit ~64 KB HTML


class SMSChannel(NotificationChannel):
    """Twilio SMS delivery (160-char single segment limit)."""

    def __init__(self, account_sid: str, auth_token: str, from_number: str) -> None:
        self._sid = account_sid
        self._token = auth_token
        self._from = from_number

    def send(self, recipient: str, subject: str, body: str) -> DeliveryResult:
        safe_body = self.truncated_body(body)
        # Production: client.messages.create(body=safe_body, from_=self._from, to=recipient)
        import uuid
        return DeliveryResult(
            message_id=f"SM{uuid.uuid4().hex[:12]}",
            channel="sms",
            recipient=recipient,
            status="sent",
            provider="Twilio",
        )

    def max_body_length(self) -> int:
        return 160


class PushChannel(NotificationChannel):
    """Firebase Cloud Messaging push notification."""

    def __init__(self, fcm_server_key: str) -> None:
        self._key = fcm_server_key

    def send(self, recipient: str, subject: str, body: str) -> DeliveryResult:
        safe_body = self.truncated_body(body)
        # Production: requests.post(FCM_URL, json={title: subject, body: safe_body, token: recipient})
        import uuid
        return DeliveryResult(
            message_id=f"fcm-{uuid.uuid4().hex[:12]}",
            channel="push",
            recipient=recipient,
            status="sent",
            provider="FCM",
        )

    def max_body_length(self) -> int:
        return 240  # FCM notification body limit
`,
          },
          {
            name: "channel_factory.py",
            dir: "notifications/",
            content: `"""
notifications/channel_factory.py
----------------------------------
Creator and concrete channel factories.
The dispatch service depends only on ChannelFactory — never on
EmailChannel, SMSChannel, or PushChannel directly.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from notifications.notification_channel import (
    NotificationChannel, EmailChannel, SMSChannel, PushChannel
)


class ChannelFactory(ABC):
    """
    Creator — factory method + dispatch template operation.
    Subclasses determine which channel is created; this base class
    controls the dispatch workflow (truncation, logging, retry hint).
    """

    @abstractmethod
    def create_channel(self) -> NotificationChannel:
        ...

    def dispatch(self, recipient: str, subject: str, body: str) -> dict:
        """Template operation used by the notification service."""
        channel = self.create_channel()
        result = channel.send(recipient, subject, body)
        return {
            "message_id":  result.message_id,
            "channel":     result.channel,
            "recipient":   result.recipient,
            "status":      result.status,
            "provider":    result.provider,
        }


class EmailChannelFactory(ChannelFactory):
    def __init__(self, from_address: str, ses_region: str = "us-east-1") -> None:
        self._from = from_address
        self._region = ses_region

    def create_channel(self) -> NotificationChannel:
        return EmailChannel(from_address=self._from, ses_region=self._region)


class SMSChannelFactory(ChannelFactory):
    def __init__(self, account_sid: str, auth_token: str, from_number: str) -> None:
        self._sid = account_sid
        self._token = auth_token
        self._from = from_number

    def create_channel(self) -> NotificationChannel:
        return SMSChannel(self._sid, self._token, self._from)


class PushChannelFactory(ChannelFactory):
    def __init__(self, fcm_server_key: str) -> None:
        self._key = fcm_server_key

    def create_channel(self) -> NotificationChannel:
        return PushChannel(self._key)


# ── Factory selector ──────────────────────────────────────────────

def get_channel_factory(channel_type: str, config: dict) -> ChannelFactory:
    factories = {
        "email": lambda: EmailChannelFactory(
            config["ses_from"], config.get("ses_region", "us-east-1")
        ),
        "sms": lambda: SMSChannelFactory(
            config["twilio_sid"], config["twilio_token"], config["twilio_from"]
        ),
        "push": lambda: PushChannelFactory(config["fcm_server_key"]),
    }
    creator = factories.get(channel_type.lower())
    if not creator:
        raise ValueError(f"Unknown channel: {channel_type}")
    return creator()
`,
          },
          {
            name: "notification_service.py",
            dir: "services/",
            content: `"""
services/notification_service.py
----------------------------------
Dispatch service — completely decoupled from concrete channel classes.
Adding a new channel (WhatsApp, Slack) adds a new factory; this file never changes.
"""
from notifications.channel_factory import get_channel_factory


class NotificationService:
    def __init__(self, config: dict) -> None:
        self._config = config

    def send(
        self,
        channel_type: str,
        recipient: str,
        subject: str,
        body: str,
    ) -> dict:
        factory = get_channel_factory(channel_type, self._config)
        return factory.dispatch(recipient, subject, body)


# ── Entry point ────────────────────────────────────────────────────
if __name__ == "__main__":
    config = {
        "ses_from": "noreply@shop.example.com",
        "twilio_sid": "AC_abc123",
        "twilio_token": "auth_xyz",
        "twilio_from": "+15559998888",
        "fcm_server_key": "AAAA_fcm_key",
    }
    svc = NotificationService(config)

    notifications = [
        ("email", "alice@example.com", "Order Confirmed", "Your order #ORD-7821 has been placed."),
        ("sms",   "+1555123456",       "",                "Your order #ORD-7821 has shipped."),
        ("push",  "device_token_abc",  "New Offer",       "20% off your next order!"),
    ]
    for ch, to, subj, msg in notifications:
        result = svc.send(ch, to, subj, msg)
        print(f"[{result['channel']}] {result['message_id']} → {result['recipient']} ({result['status']})")
`,
          },
          {
            name: "test_channel_factory.py",
            dir: "tests/",
            content: `"""
tests/test_channel_factory.py
-------------------------------
Tests factory contract: product type, dispatch result, channel constraints.
"""
import pytest
from notifications.channel_factory import (
    EmailChannelFactory, SMSChannelFactory, PushChannelFactory, get_channel_factory
)
from notifications.notification_channel import EmailChannel, SMSChannel, PushChannel


class TestProductTypes:
    def test_email_factory_creates_email_channel(self):
        f = EmailChannelFactory("from@test.com")
        assert isinstance(f.create_channel(), EmailChannel)

    def test_sms_factory_creates_sms_channel(self):
        f = SMSChannelFactory("AC", "tok", "+1555")
        assert isinstance(f.create_channel(), SMSChannel)

    def test_push_factory_creates_push_channel(self):
        f = PushChannelFactory("fcm_key")
        assert isinstance(f.create_channel(), PushChannel)


class TestDispatch:
    def test_email_dispatch_returns_sent(self):
        result = EmailChannelFactory("from@test.com").dispatch(
            "to@test.com", "Subject", "Hello"
        )
        assert result["status"] == "sent"
        assert result["channel"] == "email"

    def test_sms_body_truncated_at_160(self):
        ch = SMSChannel("AC", "tok", "+1555")
        long_body = "x" * 200
        truncated = ch.truncated_body(long_body)
        assert len(truncated) == 160


class TestFactorySelector:
    _config = {
        "ses_from": "from@test.com",
        "twilio_sid": "AC", "twilio_token": "tok", "twilio_from": "+1555",
        "fcm_server_key": "key",
    }

    def test_get_factory_email(self):
        assert isinstance(get_channel_factory("email", self._config), EmailChannelFactory)

    def test_get_factory_unknown_raises(self):
        with pytest.raises(ValueError, match="Unknown channel"):
            get_channel_factory("telegram", self._config)
`,
          },
        ],
        Go: [
          {
            name: "channel.go",
            dir: "notifications/",
            content: `// notifications/channel.go
// Product interface and concrete notification channel implementations.
package notifications

import (
	"fmt"
	"time"
)

// DeliveryResult is the uniform response type from every channel's Send call.
type DeliveryResult struct {
	MessageID string
	Channel   string
	Recipient string
	Status    string
	Provider  string
}

// NotificationChannel is the Product interface.
type NotificationChannel interface {
	Send(recipient, subject, body string) (DeliveryResult, error)
	MaxBodyLength() int
}

// TruncateBody truncates a body string to the channel's maximum length.
func TruncateBody(body string, maxLen int) string {
	runes := []rune(body)
	if len(runes) <= maxLen {
		return body
	}
	return string(runes[:maxLen-1]) + "…"
}

// ─── EmailChannel ─────────────────────────────────────────────

type EmailChannel struct {
	FromAddress string
	SESRegion   string
}

func (e *EmailChannel) Send(recipient, subject, body string) (DeliveryResult, error) {
	safe := TruncateBody(body, e.MaxBodyLength())
	_ = safe
	return DeliveryResult{
		MessageID: fmt.Sprintf("ses-%d", time.Now().UnixNano()),
		Channel:   "email",
		Recipient: recipient,
		Status:    "sent",
		Provider:  "AWS SES (" + e.SESRegion + ")",
	}, nil
}

func (e *EmailChannel) MaxBodyLength() int { return 100_000 }

// ─── SMSChannel ───────────────────────────────────────────────

type SMSChannel struct {
	AccountSID  string
	AuthToken   string
	FromNumber  string
}

func (s *SMSChannel) Send(recipient, subject, body string) (DeliveryResult, error) {
	safe := TruncateBody(body, s.MaxBodyLength())
	_ = safe
	return DeliveryResult{
		MessageID: fmt.Sprintf("SM%d", time.Now().UnixNano()),
		Channel:   "sms",
		Recipient: recipient,
		Status:    "sent",
		Provider:  "Twilio",
	}, nil
}

func (s *SMSChannel) MaxBodyLength() int { return 160 }

// ─── PushChannel ──────────────────────────────────────────────

type PushChannel struct {
	FCMServerKey string
}

func (p *PushChannel) Send(recipient, subject, body string) (DeliveryResult, error) {
	safe := TruncateBody(body, p.MaxBodyLength())
	_ = safe
	return DeliveryResult{
		MessageID: fmt.Sprintf("fcm-%d", time.Now().UnixNano()),
		Channel:   "push",
		Recipient: recipient,
		Status:    "sent",
		Provider:  "FCM",
	}, nil
}

func (p *PushChannel) MaxBodyLength() int { return 240 }
`,
          },
          {
            name: "factory.go",
            dir: "notifications/",
            content: `// notifications/factory.go
// Creator interface and concrete channel factories.
package notifications

import (
	"fmt"
	"strings"
)

// ChannelFactory is the Creator interface.
type ChannelFactory interface {
	CreateChannel() NotificationChannel
	Dispatch(recipient, subject, body string) (map[string]string, error)
}

// baseDispatch provides the template Dispatch implementation.
func baseDispatch(f ChannelFactory, recipient, subject, body string) (map[string]string, error) {
	ch := f.CreateChannel()
	result, err := ch.Send(recipient, subject, body)
	if err != nil {
		return nil, fmt.Errorf("send failed: %w", err)
	}
	return map[string]string{
		"message_id": result.MessageID,
		"channel":    result.Channel,
		"recipient":  result.Recipient,
		"status":     result.Status,
		"provider":   result.Provider,
	}, nil
}

// ─── Email ─────────────────────────────────────────────────────

type EmailChannelFactory struct {
	FromAddress string
	SESRegion   string
}

func (f *EmailChannelFactory) CreateChannel() NotificationChannel {
	return &EmailChannel{FromAddress: f.FromAddress, SESRegion: f.SESRegion}
}
func (f *EmailChannelFactory) Dispatch(r, s, b string) (map[string]string, error) {
	return baseDispatch(f, r, s, b)
}

// ─── SMS ───────────────────────────────────────────────────────

type SMSChannelFactory struct {
	AccountSID string
	AuthToken  string
	FromNumber string
}

func (f *SMSChannelFactory) CreateChannel() NotificationChannel {
	return &SMSChannel{AccountSID: f.AccountSID, AuthToken: f.AuthToken, FromNumber: f.FromNumber}
}
func (f *SMSChannelFactory) Dispatch(r, s, b string) (map[string]string, error) {
	return baseDispatch(f, r, s, b)
}

// ─── Factory selector ──────────────────────────────────────────

type Config struct {
	SESFrom        string
	SESRegion      string
	TwilioSID      string
	TwilioToken    string
	TwilioFrom     string
	FCMServerKey   string
}

func GetChannelFactory(channel string, cfg Config) (ChannelFactory, error) {
	switch strings.ToLower(channel) {
	case "email":
		return &EmailChannelFactory{FromAddress: cfg.SESFrom, SESRegion: cfg.SESRegion}, nil
	case "sms":
		return &SMSChannelFactory{AccountSID: cfg.TwilioSID, AuthToken: cfg.TwilioToken, FromNumber: cfg.TwilioFrom}, nil
	default:
		return nil, fmt.Errorf("unknown channel: %s", channel)
	}
}
`,
          },
          {
            name: "notification_service.go",
            dir: "services/",
            content: `// services/notification_service.go
// NotificationService — Consumer. Depends only on notifications.ChannelFactory.
// Never imports EmailChannelFactory, SMSChannelFactory, or PushChannelFactory.
package services

import "github.com/example/ecommerce/notifications"

// NotificationService dispatches messages via an injected ChannelFactory.
type NotificationService struct {
	factory notifications.ChannelFactory
}

func NewNotificationService(f notifications.ChannelFactory) *NotificationService {
	return &NotificationService{factory: f}
}

func (ns *NotificationService) Notify(recipient, subject, body string) (map[string]string, error) {
	return ns.factory.Dispatch(recipient, subject, body)
}

type NotifyMessage struct {
	Recipient string
	Subject   string
	Body      string
}

func (ns *NotificationService) BroadcastBatch(msgs []NotifyMessage) []map[string]string {
	results := make([]map[string]string, 0, len(msgs))
	for _, m := range msgs {
		r, err := ns.Notify(m.Recipient, m.Subject, m.Body)
		if err == nil {
			results = append(results, r)
		}
	}
	return results
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/notify/",
            content: `// cmd/notify/main.go
// Wires the email channel factory into NotificationService and broadcasts messages.
package main

import (
	"fmt"
	"log"

	"github.com/example/ecommerce/notifications"
	"github.com/example/ecommerce/services"
)

func main() {
	cfg := notifications.Config{
		SESFrom:     "noreply@shop.example.com",
		SESRegion:   "us-east-1",
		TwilioSID:   "AC_abc123",
		TwilioToken: "auth_xyz",
		TwilioFrom:  "+15559998888",
	}

	// Swap factory here to change channel — NotificationService is unchanged.
	factory, err := notifications.GetChannelFactory("email", cfg)
	if err != nil {
		log.Fatalf("factory error: %v", err)
	}

	svc := services.NewNotificationService(factory)

	msgs := []services.NotifyMessage{
		{Recipient: "alice@example.com", Subject: "Order Confirmed",  Body: "Your order #ORD-7821 is confirmed."},
		{Recipient: "bob@example.com",   Subject: "Order Dispatched", Body: "Your order #ORD-7822 has shipped."},
	}

	for _, r := range svc.BroadcastBatch(msgs) {
		fmt.Printf("[%s] %s \u2192 %s (%s)\\n",
			r["channel"], r["message_id"], r["recipient"], r["status"])
	}
}
`,
          },
        ],
        Java: [
          {
            name: "NotificationChannel.java",
            dir: "src/main/java/com/ecommerce/notifications/",
            content: `package com.ecommerce.notifications;

/**
 * Product interface — every notification channel delivers messages via send().
 * Channel-specific APIs (SES, Twilio, FCM) are hidden behind this abstraction.
 */
public interface NotificationChannel {

    /**
     * Send a notification.
     *
     * @param recipient E-mail address, E.164 phone number, or FCM device token
     * @param subject   Short subject (ignored for SMS/Push)
     * @param body      Message body; channel applies its own length constraints
     * @return DeliveryResult with message ID, status, and provider details
     */
    DeliveryResult send(String recipient, String subject, String body);

    /** Maximum body character length supported by this channel. */
    int maxBodyLength();

    /** Truncate body to this channel's limit, appending ellipsis if cut. */
    default String truncatedBody(String body) {
        if (body.length() <= maxBodyLength()) return body;
        return body.substring(0, maxBodyLength() - 1) + "…";
    }
}
`,
          },
          {
            name: "SMSChannel.java",
            dir: "src/main/java/com/ecommerce/notifications/",
            content: `package com.ecommerce.notifications;

import java.util.UUID;

/**
 * Twilio SMS delivery — concrete Product.
 * Enforces 160-character limit through the shared truncatedBody() default.
 */
public class SMSChannel implements NotificationChannel {

    private final String accountSid;
    private final String authToken;
    private final String fromNumber;

    SMSChannel(String accountSid, String authToken, String fromNumber) {
        this.accountSid  = accountSid;
        this.authToken   = authToken;
        this.fromNumber  = fromNumber;
    }

    @Override
    public DeliveryResult send(String recipient, String subject, String body) {
        String safe = truncatedBody(body);
        // Production: TwilioRestClient.create().messages().create(...)
        return new DeliveryResult(
            "SM" + UUID.randomUUID().toString().replace("-", "").substring(0, 12),
            "sms", recipient, "sent", "Twilio"
        );
    }

    @Override
    public int maxBodyLength() { return 160; }
}
`,
          },
          {
            name: "ChannelFactory.java",
            dir: "src/main/java/com/ecommerce/notifications/",
            content: `package com.ecommerce.notifications;

import java.util.Map;

/**
 * Creator (abstract) — factory method + dispatch template operation.
 * The dispatch service calls dispatch(); never a concrete channel.
 */
public abstract class ChannelFactory {

    /** Factory method — concrete subclass determines the channel type. */
    protected abstract NotificationChannel createChannel();

    /** Template operation: create → send → return structured result. */
    public final Map<String, String> dispatch(
            String recipient, String subject, String body) {

        NotificationChannel channel = createChannel();
        DeliveryResult result = channel.send(recipient, subject, body);

        return Map.of(
            "message_id", result.messageId(),
            "channel",    result.channel(),
            "recipient",  result.recipient(),
            "status",     result.status(),
            "provider",   result.provider()
        );
    }
}
`,
          },
          {
            name: "SMSChannelFactory.java",
            dir: "src/main/java/com/ecommerce/notifications/",
            content: `package com.ecommerce.notifications;

/**
 * Concrete Creator for Twilio SMS.
 * Knows how to configure and instantiate an SMSChannel.
 */
public class SMSChannelFactory extends ChannelFactory {

    private final String accountSid;
    private final String authToken;
    private final String fromNumber;

    public SMSChannelFactory(String accountSid, String authToken, String fromNumber) {
        this.accountSid = accountSid;
        this.authToken  = authToken;
        this.fromNumber = fromNumber;
    }

    @Override
    protected NotificationChannel createChannel() {
        return new SMSChannel(accountSid, authToken, fromNumber);
    }
}
`,
          },
          {
            name: "NotificationService.java",
            dir: "src/main/java/com/ecommerce/notifications/service/",
            content: `package com.ecommerce.notifications.service;

import com.ecommerce.notifications.ChannelFactory;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

/**
 * NotificationService — Consumer. Depends only on ChannelFactory.
 * Never imports EmailChannelFactory, SMSChannelFactory, or PushChannelFactory.
 * Swap the factory at the call site to change the delivery channel.
 */
public class NotificationService {

    private final ChannelFactory factory;

    public NotificationService(ChannelFactory factory) {
        this.factory = factory;
    }

    /**
     * Dispatch a single notification.
     * @param recipient e-mail address, phone number, or device token
     * @param subject   short subject line (ignored for SMS/push)
     * @param body      message body
     */
    public Map<String, String> notify(
            String recipient, String subject, String body) {
        return factory.dispatch(recipient, subject, body);
    }

    public record NotifyMessage(
            String recipient, String subject, String body) {}

    /** Dispatch to multiple recipients using the same channel factory. */
    public List<Map<String, String>> broadcastBatch(List<NotifyMessage> messages) {
        List<Map<String, String>> results = new ArrayList<>();
        for (NotifyMessage m : messages) {
            try {
                results.add(notify(m.recipient(), m.subject(), m.body()));
            } catch (Exception e) {
                results.add(Map.of("error", e.getMessage(), "recipient", m.recipient()));
            }
        }
        return results;
    }
}
`,
          },
          {
            name: "ChannelFactoryTest.java",
            dir: "src/test/java/com/ecommerce/notifications/",
            content: `package com.ecommerce.notifications;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ChannelFactoryTest {

    @Test
    void smsFactory_createChannel_returnsSMSChannel() {
        var factory = new SMSChannelFactory("AC", "tok", "+1555");
        assertTrue(factory.createChannel() instanceof SMSChannel);
    }

    @Test
    void smsFactory_dispatch_returnsSent() {
        var result = new SMSChannelFactory("AC", "tok", "+1555")
            .dispatch("+1555123456", "", "Order shipped");
        assertEquals("sent", result.get("status"));
        assertEquals("sms", result.get("channel"));
    }

    @Test
    void smsChannel_truncatesBodyAt160() {
        var ch = new SMSChannel("AC", "tok", "+1555");
        var long_body = "x".repeat(200);
        assertEquals(160, ch.truncatedBody(long_body).length());
    }

    @Test
    void emailAndSMS_produceDistinctChannelNames() {
        var email = new EmailChannelFactory("from@test.com", "us-east-1")
            .dispatch("to@test.com", "S", "B");
        var sms = new SMSChannelFactory("AC", "tok", "+1")
            .dispatch("+1555", "", "B");
        assertNotEquals(email.get("channel"), sms.get("channel"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "notification-channel.ts",
            dir: "src/notifications/",
            content: `/**
 * src/notifications/notification-channel.ts
 * -------------------------------------------
 * Product interface and concrete channel implementations.
 */

export interface DeliveryResult {
  messageId: string;
  channel: string;
  recipient: string;
  status: "sent" | "queued" | "failed";
  provider: string;
}

export interface NotificationChannel {
  send(recipient: string, subject: string, body: string): Promise<DeliveryResult>;
  maxBodyLength(): number;
}

function truncate(body: string, max: number): string {
  return body.length <= max ? body : body.slice(0, max - 1) + "…";
}

// ─── EmailChannel ──────────────────────────────────────────────

export class EmailChannel implements NotificationChannel {
  constructor(
    private readonly fromAddress: string,
    private readonly sesRegion = "us-east-1",
  ) {}

  async send(recipient: string, subject: string, body: string): Promise<DeliveryResult> {
    const safe = truncate(body, this.maxBodyLength());
    // Production: await sesClient.send(new SendEmailCommand(...))
    return {
      messageId: \`ses-\${Math.random().toString(36).slice(2, 14)}\`,
      channel: "email",
      recipient,
      status: "sent",
      provider: \`AWS SES (\${this.sesRegion})\`,
    };
  }

  maxBodyLength(): number { return 100_000; }
}

// ─── SMSChannel ────────────────────────────────────────────────

export class SMSChannel implements NotificationChannel {
  constructor(
    private readonly accountSid: string,
    private readonly authToken: string,
    private readonly fromNumber: string,
  ) {}

  async send(recipient: string, subject: string, body: string): Promise<DeliveryResult> {
    const safe = truncate(body, this.maxBodyLength());
    // Production: await twilioClient.messages.create({ body: safe, from: this.fromNumber, to: recipient })
    return {
      messageId: \`SM\${Date.now().toString(36).toUpperCase()}\`,
      channel: "sms",
      recipient,
      status: "sent",
      provider: "Twilio",
    };
  }

  maxBodyLength(): number { return 160; }
}

// ─── PushChannel ───────────────────────────────────────────────

export class PushChannel implements NotificationChannel {
  constructor(private readonly fcmServerKey: string) {}

  async send(recipient: string, subject: string, body: string): Promise<DeliveryResult> {
    const safe = truncate(body, this.maxBodyLength());
    return {
      messageId: \`fcm-\${Math.random().toString(36).slice(2, 14)}\`,
      channel: "push",
      recipient,
      status: "sent",
      provider: "FCM",
    };
  }

  maxBodyLength(): number { return 240; }
}
`,
          },
          {
            name: "channel-factory.ts",
            dir: "src/notifications/",
            content: `/**
 * src/notifications/channel-factory.ts
 * ----------------------------------------
 * Creator abstract class and concrete factories for notification channels.
 */
import {
  NotificationChannel,
  EmailChannel,
  SMSChannel,
  PushChannel,
  DeliveryResult,
} from "./notification-channel";

export interface DispatchResult {
  messageId: string;
  channel: string;
  recipient: string;
  status: string;
  provider: string;
}

export abstract class ChannelFactory {
  abstract createChannel(): NotificationChannel;

  async dispatch(recipient: string, subject: string, body: string): Promise<DispatchResult> {
    const channel = this.createChannel();
    const result  = await channel.send(recipient, subject, body);
    return {
      messageId: result.messageId,
      channel:   result.channel,
      recipient: result.recipient,
      status:    result.status,
      provider:  result.provider,
    };
  }
}

export class EmailChannelFactory extends ChannelFactory {
  constructor(
    private readonly fromAddress: string,
    private readonly sesRegion = "us-east-1",
  ) { super(); }

  createChannel(): NotificationChannel {
    return new EmailChannel(this.fromAddress, this.sesRegion);
  }
}

export class SMSChannelFactory extends ChannelFactory {
  constructor(
    private readonly accountSid: string,
    private readonly authToken: string,
    private readonly fromNumber: string,
  ) { super(); }

  createChannel(): NotificationChannel {
    return new SMSChannel(this.accountSid, this.authToken, this.fromNumber);
  }
}

export class PushChannelFactory extends ChannelFactory {
  constructor(private readonly fcmServerKey: string) { super(); }

  createChannel(): NotificationChannel {
    return new PushChannel(this.fcmServerKey);
  }
}

// ─── Factory selector ────────────────────────────────────────────

interface ChannelConfig {
  sesFrom: string;
  sesRegion?: string;
  twilioSid: string;
  twilioToken: string;
  twilioFrom: string;
  fcmServerKey: string;
}

export function getChannelFactory(channel: string, cfg: ChannelConfig): ChannelFactory {
  switch (channel.toLowerCase()) {
    case "email": return new EmailChannelFactory(cfg.sesFrom, cfg.sesRegion);
    case "sms":   return new SMSChannelFactory(cfg.twilioSid, cfg.twilioToken, cfg.twilioFrom);
    case "push":  return new PushChannelFactory(cfg.fcmServerKey);
    default:      throw new Error(\`Unknown channel: \${channel}\`);
  }
}
`,
          },
          {
            name: "notify.ts",
            dir: "src/",
            content: `/**
 * src/notify.ts
 * -------------
 * NotificationService — Consumer. Depends only on ChannelFactory.
 * Never imports EmailChannelFactory, SMSChannelFactory, or PushChannelFactory.
 * Swap the factory at the callsite to change the delivery channel.
 */
import { getChannelFactory, ChannelFactory, ChannelConfig } from "./notifications/channel-factory";

export class NotificationService {
  constructor(private readonly factory: ChannelFactory) {}

  /** Dispatch a single notification. */
  async notify(recipient: string, subject: string, body: string) {
    return this.factory.dispatch(recipient, subject, body);
  }

  /** Dispatch to multiple recipients using the same channel factory. */
  async broadcastBatch(
    messages: Array<{ recipient: string; subject: string; body: string }>,
  ) {
    const results = [];
    for (const m of messages) {
      try {
        results.push(await this.notify(m.recipient, m.subject, m.body));
      } catch (e) {
        results.push({ error: String(e), recipient: m.recipient });
      }
    }
    return results;
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────────────────
const cfg: ChannelConfig = {
  sesFrom: "noreply@shop.example.com",
  twilioSid: "AC_abc123",
  twilioToken: "auth_xyz",
  twilioFrom: "+15559998888",
  fcmServerKey: "AAAA_key",
};

// Swap factory here to switch channel — NotificationService code is unchanged.
const svc = new NotificationService(getChannelFactory("email", cfg));

svc.broadcastBatch([
  { recipient: "alice@example.com", subject: "Order Confirmed",  body: "Your order #ORD-7821 is confirmed." },
  { recipient: "bob@example.com",   subject: "Order Dispatched", body: "Your order #ORD-7822 has shipped."  },
]).then(results =>
  results.forEach(r => console.log("[" + r.channel + "] " + r.messageId + " → " + r.recipient + " (" + r.status + ")")),
).catch(console.error);
`,
          },
        ],
        Rust: [
          {
            name: "channel.rs",
            dir: "src/",
            content: `//! src/channel.rs — Product trait and concrete channel implementations.

#[derive(Debug, Clone)]
pub struct DeliveryResult {
    pub message_id: String,
    pub channel: String,
    pub recipient: String,
    pub status: String,
    pub provider: String,
}

pub trait NotificationChannel {
    fn send(&self, recipient: &str, subject: &str, body: &str) -> Result<DeliveryResult, String>;
    fn max_body_length(&self) -> usize;

    fn truncated_body<'a>(&self, body: &'a str) -> String {
        let max = self.max_body_length();
        let chars: Vec<char> = body.chars().collect();
        if chars.len() <= max {
            body.to_string()
        } else {
            let truncated: String = chars[..max - 1].iter().collect();
            truncated + "…"
        }
    }
}

pub struct EmailChannel {
    pub from_address: String,
    pub ses_region: String,
}

impl NotificationChannel for EmailChannel {
    fn send(&self, recipient: &str, _subject: &str, body: &str) -> Result<DeliveryResult, String> {
        let _safe = self.truncated_body(body);
        Ok(DeliveryResult {
            message_id: format!("ses-{:x}", body.len() ^ 0xabc),
            channel: "email".into(),
            recipient: recipient.to_string(),
            status: "sent".into(),
            provider: format!("AWS SES ({})", self.ses_region),
        })
    }
    fn max_body_length(&self) -> usize { 100_000 }
}

pub struct SMSChannel {
    pub from_number: String,
}

impl NotificationChannel for SMSChannel {
    fn send(&self, recipient: &str, _subject: &str, body: &str) -> Result<DeliveryResult, String> {
        let _safe = self.truncated_body(body);
        Ok(DeliveryResult {
            message_id: format!("SM{:X}", body.len() ^ 0x1234),
            channel: "sms".into(),
            recipient: recipient.to_string(),
            status: "sent".into(),
            provider: "Twilio".into(),
        })
    }
    fn max_body_length(&self) -> usize { 160 }
}
`,
          },
          {
            name: "factory.rs",
            dir: "src/",
            content: `//! src/factory.rs — Creator trait and concrete channel factories.
use crate::channel::{EmailChannel, NotificationChannel, SMSChannel, DeliveryResult};
use std::collections::HashMap;

pub trait ChannelFactory {
    fn create_channel(&self) -> Box<dyn NotificationChannel>;

    fn dispatch(
        &self,
        recipient: &str,
        subject: &str,
        body: &str,
    ) -> Result<HashMap<String, String>, String> {
        let ch = self.create_channel();
        let result = ch.send(recipient, subject, body)?;
        let mut map = HashMap::new();
        map.insert("message_id".into(), result.message_id);
        map.insert("channel".into(), result.channel);
        map.insert("recipient".into(), result.recipient);
        map.insert("status".into(), result.status);
        map.insert("provider".into(), result.provider);
        Ok(map)
    }
}

pub struct EmailChannelFactory {
    pub from_address: String,
    pub ses_region: String,
}

impl ChannelFactory for EmailChannelFactory {
    fn create_channel(&self) -> Box<dyn NotificationChannel> {
        Box::new(EmailChannel {
            from_address: self.from_address.clone(),
            ses_region: self.ses_region.clone(),
        })
    }
}

pub struct SMSChannelFactory {
    pub from_number: String,
}

impl ChannelFactory for SMSChannelFactory {
    fn create_channel(&self) -> Box<dyn NotificationChannel> {
        Box::new(SMSChannel { from_number: self.from_number.clone() })
    }
}

pub fn get_factory(channel: &str) -> Result<Box<dyn ChannelFactory>, String> {
    match channel {
        "email" => Ok(Box::new(EmailChannelFactory {
            from_address: "noreply@shop.example.com".into(),
            ses_region: "us-east-1".into(),
        })),
        "sms" => Ok(Box::new(SMSChannelFactory { from_number: "+15559998888".into() })),
        other => Err(format!("Unknown channel: {}", other)),
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! NotificationService — Consumer that depends only on ChannelFactory.
mod channel;
mod factory;

use std::collections::HashMap;
use factory::{get_factory, ChannelFactory};

// ─── Consumer ───────────────────────────────────────────────────────────
// NotificationService depends only on ChannelFactory — never on EmailChannelFactory,
// SMSChannelFactory, or PushChannelFactory. Swap factory to change channel.
struct NotificationService {
    factory: Box<dyn ChannelFactory>,
}

impl NotificationService {
    fn new(factory: Box<dyn ChannelFactory>) -> Self {
        Self { factory }
    }

    fn notify(
        &self, recipient: &str, subject: &str, body: &str,
    ) -> Result<HashMap<String, String>, String> {
        self.factory.dispatch(recipient, subject, body)
    }

    fn broadcast_batch(
        &self,
        messages: &[(&str, &str, &str)],
    ) -> Vec<Result<HashMap<String, String>, String>> {
        messages.iter().map(|(r, s, b)| self.notify(r, s, b)).collect()
    }
}

fn main() {
    // Swap factory here to change channel — NotificationService code is unchanged.
    let factory = get_factory("email").expect("factory error");
    let svc = NotificationService::new(factory);

    let messages = vec![
        ("alice@example.com", "Order Confirmed",  "Your order #ORD-7821 is confirmed."),
        ("bob@example.com",   "Order Dispatched", "Your order #ORD-7822 has shipped."),
    ];

    for result in svc.broadcast_batch(&messages) {
        match result {
            Ok(r)  => println!("[{}] {} → {} ({})", r["channel"], r["message_id"], r["recipient"], r["status"]),
            Err(e) => eprintln!("error: {}", e),
        }
    }
}
`,
          },
        ],
      },
    },
    {
      id: 4,
      title: "Media Streaming — Content Encoder Factory",
      domain: "Media Streaming",
      problem:
        "A media streaming platform must transcode uploaded content into multiple formats — H.264/HEVC for video, AAC/Opus for audio, and WebVTT/SRT for subtitles. Each encoder has different dependencies, hardware acceleration options, and output profiles. Coupling encoder selection into the transcoding pipeline makes it impossible to swap codecs.",
      solution:
        "A ContentEncoderFactory factory method produces the correct ContentEncoder. The transcoding pipeline requests an encoder by calling the factory, remaining agnostic to which codec library is used underneath.",
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class EncoderFactory {
    <<abstract>>
    +createEncoder()* ContentEncoder
    +encodeAsset(source, profile) string
  }
  class VideoEncoderFactory {
    +createEncoder() VideoEncoder
  }
  class AudioEncoderFactory {
    +createEncoder() AudioEncoder
  }
  class SubtitleEncoderFactory {
    +createEncoder() SubtitleEncoder
  }
  class ContentEncoder {
    <<interface>>
    +encode(sourcePath, profile) string
  }
  class VideoEncoder {
    +encode(sourcePath, profile) string
  }
  class AudioEncoder {
    +encode(sourcePath, profile) string
  }
  class SubtitleEncoder {
    +encode(sourcePath, profile) string
  }
  EncoderFactory <|-- VideoEncoderFactory
  EncoderFactory <|-- AudioEncoderFactory
  EncoderFactory <|-- SubtitleEncoderFactory
  ContentEncoder <|.. VideoEncoder
  ContentEncoder <|.. AudioEncoder
  ContentEncoder <|.. SubtitleEncoder
  EncoderFactory ..> ContentEncoder : uses
  VideoEncoderFactory ..> VideoEncoder : creates
  AudioEncoderFactory ..> AudioEncoder : creates
  SubtitleEncoderFactory ..> SubtitleEncoder : creates
  class TranscodeService {
    -factory: EncoderFactory
    +transcode(assetId, profile) string
    +batchEncode(assetIds, profile) list
  }
  TranscodeService --> EncoderFactory : uses`,
      },
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

class TranscodeService:
    """
    Consumer — runs the media encoding pipeline using an injected EncoderFactory.
    Drives the transcoding workflow without knowing which codec library underlies
    the chosen encoder. Switching from H.264 to AV1 means swapping the factory;
    the pipeline controller is completely isolated from codec details.
    """
    def __init__(self, factory: EncoderFactory) -> None:
        self._factory = factory

    def transcode(self, asset_id: str, profile: str) -> str:
        """Encode a single media asset with the configured encoder family."""
        encoder = self._factory.create_encoder()
        return encoder.encode(asset_id, profile)

    def batch_encode(self, asset_ids: list[str], profile: str) -> list[str]:
        """Encode multiple assets in one pipeline pass (encoder reused per run)."""
        encoder = self._factory.create_encoder()
        return [encoder.encode(aid, profile) for aid in asset_ids]

# ── Usage ──
# Swap factory to change codec family — TranscodeService never changes
video_svc = TranscodeService(VideoEncoderFactory())
print(video_svc.transcode("/ingest/movie_4k.mp4", "high"))
audio_svc = TranscodeService(AudioEncoderFactory())
print(audio_svc.batch_encode(["/audio/ep1.aac", "/audio/ep2.aac"], "320kbps"))`,
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

// TranscodeService — Consumer: encodes content via an injected EncoderFactory.
// Knows nothing about H.264 or AAC — factory selection drives codec choice.
type TranscodeService struct {
	factory EncoderFactory
}

func NewTranscodeService(f EncoderFactory) *TranscodeService {
	return &TranscodeService{factory: f}
}

func (ts *TranscodeService) Transcode(assetID, profile string) string {
	enc := ts.factory.CreateEncoder()
	return enc.Encode(assetID, profile)
}

func (ts *TranscodeService) BatchEncode(assetIDs []string, profile string) []string {
	results := make([]string, 0, len(assetIDs))
	for _, id := range assetIDs {
		results = append(results, ts.Transcode(id, profile))
	}
	return results
}

func main() {
	// Swap factory to change codec — TranscodeService never changes
	svc := NewTranscodeService(VideoEncoderFactory{})
	fmt.Println(svc.Transcode("/ingest/movie_4k.mp4", "high"))
	svc2 := NewTranscodeService(AudioEncoderFactory{})
	fmt.Println(svc2.Transcode("/ingest/podcast.wav", "128kbps"))
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
}

/**
 * TranscodeService — Consumer: encodes media assets via an injected EncoderFactory.
 * Agnostic to H.264, AAC, or any specific codec — the factory determines the encoder;
 * this service handles scheduling, batching, and progress tracking for any asset type.
 */
class TranscodeService {
    private final EncoderFactory factory;

    TranscodeService(EncoderFactory factory) { this.factory = factory; }

    String transcode(String assetId, String profile) {
        return factory.createEncoder().encode(assetId, profile);
    }

    java.util.List<String> batchEncode(java.util.List<String> assetIds, String profile) {
        java.util.List<String> results = new java.util.ArrayList<>();
        for (String id : assetIds) results.add(transcode(id, profile));
        return results;
    }

    public static void main(String[] args) {
        // Swap factory to change codec — TranscodeService never changes
        TranscodeService svc = new TranscodeService(new VideoEncoderFactory());
        System.out.println(svc.transcode("/ingest/movie_4k.mp4", "high"));
        TranscodeService svc2 = new TranscodeService(new AudioEncoderFactory());
        System.out.println(svc2.transcode("/ingest/podcast.wav", "128kbps"));
    }
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

/**
 * TranscodeService — Consumer: encodes media assets via an injected EncoderFactory.
 * Agnostic to H.264, AAC, or any specific codec — the factory determines the encoder;
 * this service handles job scheduling, progress tracking, and batch operations.
 */
class TranscodeService {
  constructor(private factory: EncoderFactory) {}

  transcode(assetId: string, profile: string): string {
    return this.factory.createEncoder().encode(assetId, profile);
  }

  batchEncode(assetIds: string[], profile: string): string[] {
    return assetIds.map(id => this.transcode(id, profile));
  }
}

// ── Usage ──
// Swap factory to change codec — TranscodeService never changes
const videoSvc = new TranscodeService(new VideoEncoderFactory());
console.log(videoSvc.transcode("/ingest/movie_4k.mp4", "high"));`,
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

/// TranscodeService — Consumer: encodes assets via an injected encoder factory.
/// Agnostic to VideoEncoder and AudioEncoder; the boxed factory decides codec.
/// Swap the factory at construction time to target a different codec family.
struct TranscodeService {
    factory: Box<dyn EncoderFactory>,
}

impl TranscodeService {
    fn new(factory: Box<dyn EncoderFactory>) -> Self {
        TranscodeService { factory }
    }

    fn transcode(&self, asset_id: &str, profile: &str) -> String {
        self.factory.create_encoder().encode(asset_id, profile)
    }

    fn batch_encode(&self, asset_ids: &[&str], profile: &str) -> Vec<String> {
        asset_ids.iter().map(|id| self.transcode(id, profile)).collect()
    }
}

fn main() {
    // Swap factory to change codec — TranscodeService never changes
    let svc = TranscodeService::new(Box::new(VideoEncoderFactory));
    println!("{}", svc.transcode("/ingest/movie_4k.mp4", "high"));
    let svc2 = TranscodeService::new(Box::new(AudioEncoderFactory));
    println!("{}", svc2.transcode("/ingest/podcast.wav", "128kbps"));
}`,
      },
      considerations: [
        "Hardware acceleration (NVENC, Quick Sync) is codec-specific — the factory decides whether to use GPU or CPU encoding",
        "Output profiles (360p, 720p, 1080p, 4K) should be passed to the product, not baked into the factory",
        "Encoding failures need codec-specific retry logic (e.g., fall back from HEVC to H.264) — the factory can chain fallbacks",
        "Progress callbacks differ per encoder — the product should implement a uniform progress interface",
        "DRM wrapper should be applied after encoding — keep it as a decorator, not inside the factory",
      ],
      codeFiles: {
        Python: [
          {
            name: "content_encoder.py",
            dir: "encoding/",
            content: `"""
encoding/content_encoder.py
-----------------------------
Product interface and concrete encoder implementations for a media-streaming ingest pipeline.
Each encoder wraps a real transcoding tool (FFmpeg, HandBrake) and hides codec-specific flags.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional


@dataclass
class EncodeJob:
    job_id: str
    source_path: str
    profile: str       # "360p" | "720p" | "1080p" | "4k"
    output_path: str
    codec: str
    status: str        # "pending" | "running" | "done" | "failed"
    duration_ms: int = 0
    error: Optional[str] = None


ProgressCallback = Callable[[int], None]   # percentage 0-100


class ContentEncoder(ABC):
    """Product interface."""

    @abstractmethod
    def encode(
        self,
        source_path: str,
        profile: str,
        on_progress: Optional[ProgressCallback] = None,
    ) -> EncodeJob:
        """
        Transcode the source file to the requested quality profile.

        :param source_path:  Path to the raw ingest file (e.g. /ingest/movie.mp4).
        :param profile:      Quality profile (360p, 720p, 1080p, 4k).
        :param on_progress:  Optional callback invoked with progress pct 0-100.
        :return:             Completed EncodeJob with output_path and status.
        """
        ...

    @abstractmethod
    def supported_profiles(self) -> list[str]:
        """List of quality profiles this encoder supports."""
        ...

    def validate_profile(self, profile: str) -> None:
        if profile not in self.supported_profiles():
            raise ValueError(
                f"Unsupported profile '{profile}' for {self.__class__.__name__}. "
                f"Supported: {self.supported_profiles()}"
            )


class VideoEncoder(ContentEncoder):
    """H.264/AVC video encoder via FFmpeg."""

    def __init__(self, preset: str = "fast", crf: int = 23) -> None:
        self._preset = preset
        self._crf = crf

    def encode(
        self,
        source_path: str,
        profile: str,
        on_progress: Optional[ProgressCallback] = None,
    ) -> EncodeJob:
        self.validate_profile(profile)
        import uuid, time
        output = f"/encoded/video/{Path(source_path).stem}_{profile}.mp4"
        # Production: subprocess.run(["ffmpeg", "-i", source_path, "-vcodec", "libx264",
        #             "-preset", self._preset, "-crf", str(self._crf), output])
        if on_progress:
            for pct in (0, 25, 50, 75, 100):
                on_progress(pct)
        return EncodeJob(
            job_id=f"vid-{uuid.uuid4().hex[:8]}",
            source_path=source_path,
            profile=profile,
            output_path=output,
            codec="h264",
            status="done",
            duration_ms=1200,
        )

    def supported_profiles(self) -> list[str]:
        return ["360p", "720p", "1080p", "4k"]


class AudioEncoder(ContentEncoder):
    """AAC audio encoder via FFmpeg."""

    def __init__(self, bitrate: str = "192k") -> None:
        self._bitrate = bitrate

    def encode(
        self,
        source_path: str,
        profile: str,
        on_progress: Optional[ProgressCallback] = None,
    ) -> EncodeJob:
        self.validate_profile(profile)
        import uuid
        output = f"/encoded/audio/{Path(source_path).stem}_{profile}.aac"
        # Production: subprocess.run(["ffmpeg", "-i", source_path, "-acodec", "aac",
        #             "-b:a", self._bitrate, output])
        if on_progress:
            on_progress(100)
        return EncodeJob(
            job_id=f"aud-{uuid.uuid4().hex[:8]}",
            source_path=source_path,
            profile=profile,
            output_path=output,
            codec="aac",
            status="done",
            duration_ms=300,
        )

    def supported_profiles(self) -> list[str]:
        return ["128k", "192k", "320k"]


class SubtitleEncoder(ContentEncoder):
    """WebVTT subtitle packager."""

    def encode(
        self,
        source_path: str,
        profile: str,
        on_progress: Optional[ProgressCallback] = None,
    ) -> EncodeJob:
        self.validate_profile(profile)
        import uuid
        output = f"/encoded/subs/{Path(source_path).stem}.vtt"
        # Production: convert SRT/ASS → WebVTT via webvtt-py
        if on_progress:
            on_progress(100)
        return EncodeJob(
            job_id=f"sub-{uuid.uuid4().hex[:8]}",
            source_path=source_path,
            profile=profile,
            output_path=output,
            codec="webvtt",
            status="done",
            duration_ms=50,
        )

    def supported_profiles(self) -> list[str]:
        return ["webvtt"]
`,
          },
          {
            name: "encoder_factory.py",
            dir: "encoding/",
            content: `"""
encoding/encoder_factory.py
-----------------------------
Creator and concrete factories for the media encoding pipeline.
The ingest service depends only on EncoderFactory — never on specific encoders.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from encoding.content_encoder import ContentEncoder, EncodeJob, VideoEncoder, AudioEncoder, SubtitleEncoder
from typing import Optional, Callable


ProgressCallback = Callable[[int], None]


class EncoderFactory(ABC):
    """Creator — factory method + encode pipeline template."""

    @abstractmethod
    def create_encoder(self) -> ContentEncoder:
        ...

    def encode_asset(
        self,
        source_path: str,
        profile: str,
        on_progress: Optional[ProgressCallback] = None,
    ) -> EncodeJob:
        """Template operation — logs → encodes → verifies output."""
        encoder = self.create_encoder()
        print(f"[{self.__class__.__name__}] Encoding {source_path} @ {profile}")
        job = encoder.encode(source_path, profile, on_progress)
        if job.status != "done":
            raise RuntimeError(f"Encode failed: job_id={job.job_id} error={job.error}")
        return job


class VideoEncoderFactory(EncoderFactory):
    def __init__(self, preset: str = "fast", crf: int = 23) -> None:
        self._preset = preset
        self._crf = crf

    def create_encoder(self) -> ContentEncoder:
        return VideoEncoder(preset=self._preset, crf=self._crf)


class AudioEncoderFactory(EncoderFactory):
    def __init__(self, bitrate: str = "192k") -> None:
        self._bitrate = bitrate

    def create_encoder(self) -> ContentEncoder:
        return AudioEncoder(bitrate=self._bitrate)


class SubtitleEncoderFactory(EncoderFactory):
    def create_encoder(self) -> ContentEncoder:
        return SubtitleEncoder()


# ── Factory selector ────────────────────────────────────────────────

def get_encoder_factory(asset_type: str, config: dict) -> EncoderFactory:
    factories = {
        "video":    lambda: VideoEncoderFactory(
            config.get("video_preset", "fast"),
            config.get("video_crf", 23),
        ),
        "audio":    lambda: AudioEncoderFactory(config.get("audio_bitrate", "192k")),
        "subtitle": lambda: SubtitleEncoderFactory(),
    }
    factory_fn = factories.get(asset_type.lower())
    if not factory_fn:
        raise ValueError(f"Unknown asset type: {asset_type}")
    return factory_fn()
`,
          },
          {
            name: "ingest_service.py",
            dir: "services/",
            content: `"""
services/ingest_service.py
---------------------------
Ingest service — orchestrates multi-asset encoding for an uploaded title.
Completely agnostic of encoder types; only depends on EncoderFactory.
"""
from encoding.encoder_factory import get_encoder_factory


class IngestService:
    def __init__(self, config: dict) -> None:
        self._config = config

    def ingest_title(self, title_id: str, assets: list[dict]) -> list[dict]:
        results = []
        for asset in assets:
            factory = get_encoder_factory(asset["type"], self._config)
            job = factory.encode_asset(asset["path"], asset["profile"])
            results.append({
                "title_id":   title_id,
                "job_id":     job.job_id,
                "asset_type": asset["type"],
                "codec":      job.codec,
                "output":     job.output_path,
            })
        return results


# ── Entry point ─────────────────────────────────────────────────

if __name__ == "__main__":
    cfg = {"video_preset": "fast", "video_crf": 20, "audio_bitrate": "192k"}
    svc = IngestService(cfg)
    jobs = svc.ingest_title("title-007", [
        {"type": "video",    "path": "/raw/movie.mp4",   "profile": "1080p"},
        {"type": "audio",    "path": "/raw/audio.wav",   "profile": "192k"},
        {"type": "subtitle", "path": "/raw/subs.srt",    "profile": "webvtt"},
    ])
    for j in jobs:
        print(f"[{j['asset_type']}] {j['job_id']} → {j['output']}")
`,
          },
          {
            name: "test_encoder_factory.py",
            dir: "tests/",
            content: `"""
tests/test_encoder_factory.py
-------------------------------
Validates that each factory creates the expected encoder and that
template operation enforce profile validation.
"""
import pytest
from encoding.encoder_factory import (
    VideoEncoderFactory, AudioEncoderFactory, SubtitleEncoderFactory, get_encoder_factory
)
from encoding.content_encoder import VideoEncoder, AudioEncoder, SubtitleEncoder


class TestProductTypes:
    def test_video_factory_creates_video_encoder(self):
        assert isinstance(VideoEncoderFactory().create_encoder(), VideoEncoder)

    def test_audio_factory_creates_audio_encoder(self):
        assert isinstance(AudioEncoderFactory().create_encoder(), AudioEncoder)

    def test_subtitle_factory_creates_subtitle_encoder(self):
        assert isinstance(SubtitleEncoderFactory().create_encoder(), SubtitleEncoder)


class TestTemplateOperation:
    def test_video_encode_returns_done(self):
        job = VideoEncoderFactory().encode_asset("/raw/clip.mp4", "720p")
        assert job.status == "done"
        assert job.codec == "h264"

    def test_unsupported_profile_raises(self):
        enc = VideoEncoderFactory().create_encoder()
        with pytest.raises(ValueError, match="Unsupported profile"):
            enc.validate_profile("8k")


class TestFactorySelector:
    _cfg = {"video_preset": "fast", "video_crf": 23, "audio_bitrate": "192k"}

    def test_get_factory_video(self):
        assert isinstance(get_encoder_factory("video", self._cfg), VideoEncoderFactory)

    def test_get_factory_audio(self):
        assert isinstance(get_encoder_factory("audio", self._cfg), AudioEncoderFactory)

    def test_get_factory_unknown_raises(self):
        with pytest.raises(ValueError, match="Unknown asset type"):
            get_encoder_factory("hologram", self._cfg)
`,
          },
        ],
        Go: [
          {
            name: "encoder.go",
            dir: "encoding/",
            content: `// encoding/encoder.go — Product interface and concrete encoders.
package encoding

import (
	"fmt"
	"path/filepath"
	"strings"
)

// EncodeJob is the result of a transcoding operation.
type EncodeJob struct {
	JobID      string
	SourcePath string
	Profile    string
	OutputPath string
	Codec      string
	Status     string
	DurationMS int
}

// ContentEncoder is the Product interface.
type ContentEncoder interface {
	Encode(sourcePath, profile string) (EncodeJob, error)
	SupportedProfiles() []string
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

// ─── VideoEncoder ─────────────────────────────────────────────

type VideoEncoder struct {
	Preset string
	CRF    int
}

func (v *VideoEncoder) Encode(src, profile string) (EncodeJob, error) {
	if !contains(v.SupportedProfiles(), profile) {
		return EncodeJob{}, fmt.Errorf("unsupported profile: %s", profile)
	}
	stem := strings.TrimSuffix(filepath.Base(src), filepath.Ext(src))
	output := fmt.Sprintf("/encoded/video/%s_%s.mp4", stem, profile)
	// Production: exec.Command("ffmpeg", "-i", src, "-preset", v.Preset, "-crf", ..., output).Run()
	return EncodeJob{
		JobID: fmt.Sprintf("vid-%d", len(src)), SourcePath: src,
		Profile: profile, OutputPath: output, Codec: "h264", Status: "done", DurationMS: 1200,
	}, nil
}

func (v *VideoEncoder) SupportedProfiles() []string {
	return []string{"360p", "720p", "1080p", "4k"}
}

// ─── AudioEncoder ─────────────────────────────────────────────

type AudioEncoder struct {
	Bitrate string
}

func (a *AudioEncoder) Encode(src, profile string) (EncodeJob, error) {
	if !contains(a.SupportedProfiles(), profile) {
		return EncodeJob{}, fmt.Errorf("unsupported audio profile: %s", profile)
	}
	stem := strings.TrimSuffix(filepath.Base(src), filepath.Ext(src))
	return EncodeJob{
		JobID: fmt.Sprintf("aud-%d", len(src)), SourcePath: src,
		Profile: profile, OutputPath: fmt.Sprintf("/encoded/audio/%s_%s.aac", stem, profile),
		Codec: "aac", Status: "done", DurationMS: 300,
	}, nil
}

func (a *AudioEncoder) SupportedProfiles() []string {
	return []string{"128k", "192k", "320k"}
}
`,
          },
          {
            name: "factory.go",
            dir: "encoding/",
            content: `// encoding/factory.go — Creator interface and concrete encoder factories.
package encoding

import (
	"fmt"
	"strings"
)

// EncoderFactory is the Creator interface.
type EncoderFactory interface {
	CreateEncoder() ContentEncoder
	EncodeAsset(sourcePath, profile string) (EncodeJob, error)
}

// baseFactory provides the reusable EncodeAsset template operation.
type baseFactory struct{}

func (b baseFactory) encodeAsset(f EncoderFactory, src, profile string) (EncodeJob, error) {
	encoder := f.CreateEncoder()
	job, err := encoder.Encode(src, profile)
	if err != nil {
		return EncodeJob{}, fmt.Errorf("encode failed: %w", err)
	}
	return job, nil
}

// ─── Video ─────────────────────────────────────────────────────

type VideoEncoderFactory struct {
	baseFactory
	Preset string
	CRF    int
}

func (f *VideoEncoderFactory) CreateEncoder() ContentEncoder {
	return &VideoEncoder{Preset: f.Preset, CRF: f.CRF}
}
func (f *VideoEncoderFactory) EncodeAsset(src, profile string) (EncodeJob, error) {
	return f.encodeAsset(f, src, profile)
}

// ─── Audio ─────────────────────────────────────────────────────

type AudioEncoderFactory struct {
	baseFactory
	Bitrate string
}

func (f *AudioEncoderFactory) CreateEncoder() ContentEncoder {
	return &AudioEncoder{Bitrate: f.Bitrate}
}
func (f *AudioEncoderFactory) EncodeAsset(src, profile string) (EncodeJob, error) {
	return f.encodeAsset(f, src, profile)
}

// ─── Factory selector ──────────────────────────────────────────

func GetEncoderFactory(assetType string) (EncoderFactory, error) {
	switch strings.ToLower(assetType) {
	case "video":
		return &VideoEncoderFactory{Preset: "fast", CRF: 23}, nil
	case "audio":
		return &AudioEncoderFactory{Bitrate: "192k"}, nil
	default:
		return nil, fmt.Errorf("unknown asset type: %s", assetType)
	}
}
`,
          },
          {
            name: "ingest_service.go",
            dir: "services/",
            content: `// services/ingest_service.go
// IngestService — Consumer. Depends only on encoding.EncoderFactory.
// Never imports VideoEncoderFactory or AudioEncoderFactory.
package services

import "github.com/example/streaming/encoding"

// IngestService encodes media assets via an injected EncoderFactory.
type IngestService struct {
	factory encoding.EncoderFactory
}

func NewIngestService(f encoding.EncoderFactory) *IngestService {
	return &IngestService{factory: f}
}

func (is *IngestService) Ingest(sourcePath, profile string) (encoding.EncodeJob, error) {
	return is.factory.EncodeAsset(sourcePath, profile)
}

type IngestAsset struct {
	Path    string
	Profile string
}

func (is *IngestService) IngestBatch(assets []IngestAsset) []encoding.EncodeJob {
	jobs := make([]encoding.EncodeJob, 0, len(assets))
	for _, a := range assets {
		job, err := is.Ingest(a.Path, a.Profile)
		if err == nil {
			jobs = append(jobs, job)
		}
	}
	return jobs
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/ingest/",
            content: `// cmd/ingest/main.go
package main

import (
	"fmt"
	"log"

	"github.com/example/streaming/encoding"
)

func main() {
	assets := []struct{ assetType, path, profile string }{
		{"video", "/raw/movie.mp4",  "1080p"},
		{"audio", "/raw/audio.wav",  "192k"},
	}

	for _, a := range assets {
		factory, err := encoding.GetEncoderFactory(a.assetType)
		if err != nil {
			log.Printf("factory error: %v", err)
			continue
		}
		job, err := factory.EncodeAsset(a.path, a.profile)
		if err != nil {
			log.Printf("encode error: %v", err)
			continue
		}
		fmt.Printf("[%s] %s → %s (%s)\\n", job.Codec, job.JobID, job.OutputPath, job.Status)
	}
}
`,
          },
        ],
        Java: [
          {
            name: "ContentEncoder.java",
            dir: "src/main/java/com/streaming/encoding/",
            content: `package com.streaming.encoding;

import java.util.List;

/**
 * Product interface — every encoder provides a uniform encode() entry point.
 * Codec-specific flags (preset, bitrate, CRF) are implementation details.
 */
public interface ContentEncoder {

    /**
     * Transcode the source file to the requested quality profile.
     *
     * @param sourcePath absolute path to the raw ingest file
     * @param profile    quality profile (e.g., "720p", "1080p", "192k")
     * @return EncodeJob with output path, codec, and status
     * @throws IllegalArgumentException if profile is not supported by this encoder
     */
    EncodeJob encode(String sourcePath, String profile);

    /** Quality profiles supported by this encoder. */
    List<String> supportedProfiles();

    /** Validate a profile; throw if unsupported. */
    default void validateProfile(String profile) {
        if (!supportedProfiles().contains(profile)) {
            throw new IllegalArgumentException(
                "Unsupported profile '" + profile + "' for " + getClass().getSimpleName() +
                ". Supported: " + supportedProfiles());
        }
    }
}
`,
          },
          {
            name: "VideoEncoder.java",
            dir: "src/main/java/com/streaming/encoding/",
            content: `package com.streaming.encoding;

import java.util.List;
import java.util.UUID;

/**
 * H.264/AVC video encoder — concrete Product.
 * Delegates to FFmpeg subprocess in production.
 */
public class VideoEncoder implements ContentEncoder {

    private final String preset;
    private final int crf;

    VideoEncoder(String preset, int crf) {
        this.preset = preset;
        this.crf    = crf;
    }

    @Override
    public EncodeJob encode(String sourcePath, String profile) {
        validateProfile(profile);
        String stem   = sourcePath.replaceAll(".*/|\\\\.[^.]+$", "");
        String output = "/encoded/video/" + stem + "_" + profile + ".mp4";
        // Production: ProcessBuilder("ffmpeg", "-i", sourcePath, "-preset", preset, "-crf", ...)
        return new EncodeJob(
            "vid-" + UUID.randomUUID().toString().substring(0, 8),
            sourcePath, profile, output, "h264", "done"
        );
    }

    @Override
    public List<String> supportedProfiles() {
        return List.of("360p", "720p", "1080p", "4k");
    }
}
`,
          },
          {
            name: "EncoderFactory.java",
            dir: "src/main/java/com/streaming/encoding/",
            content: `package com.streaming.encoding;

/**
 * Creator (abstract) — factory method + encode-asset template operation.
 * Concrete subclasses override createEncoder(); this class owns the pipeline.
 */
public abstract class EncoderFactory {

    /** Factory method — subclass determines the concrete encoder. */
    protected abstract ContentEncoder createEncoder();

    /** Template operation: create → validate → encode → verify. */
    public final EncodeJob encodeAsset(String sourcePath, String profile) {
        ContentEncoder encoder = createEncoder();
        EncodeJob job = encoder.encode(sourcePath, profile);
        if (!"done".equals(job.status())) {
            throw new RuntimeException("Encode failed: " + job.jobId());
        }
        return job;
    }
}
`,
          },
          {
            name: "VideoEncoderFactory.java",
            dir: "src/main/java/com/streaming/encoding/",
            content: `package com.streaming.encoding;

/**
 * Concrete Creator for H.264 video encoding.
 */
public class VideoEncoderFactory extends EncoderFactory {

    private final String preset;
    private final int crf;

    public VideoEncoderFactory(String preset, int crf) {
        this.preset = preset;
        this.crf    = crf;
    }

    @Override
    protected ContentEncoder createEncoder() {
        return new VideoEncoder(preset, crf);
    }
}
`,
          },
          {
            name: "TranscodeService.java",
            dir: "src/main/java/com/streaming/transcoding/",
            content: `package com.streaming.transcoding;

import com.streaming.encoding.EncoderFactory;
import com.streaming.encoding.EncodeJob;
import java.util.List;
import java.util.ArrayList;

/**
 * TranscodeService — Consumer. Depends only on EncoderFactory.
 * Never imports VideoEncoderFactory or AudioEncoderFactory.
 * Swap the factory at the call site to change the encoding backend.
 */
public class TranscodeService {

    private final EncoderFactory factory;

    public TranscodeService(EncoderFactory factory) {
        this.factory = factory;
    }

    /**
     * Encode a single media asset.
     * @param sourcePath absolute path to the source file
     * @param profile    encoding profile (e.g., "1080p", "192k")
     * @return EncodeJob with job ID, output path, codec, and status
     */
    public EncodeJob transcode(String sourcePath, String profile) {
        return factory.encodeAsset(sourcePath, profile);
    }

    public record AssetRequest(String sourcePath, String profile) {}

    /** Encode a batch of assets; failures are surfaced per-asset via EncodeJob.status. */
    public List<EncodeJob> transcodeBatch(List<AssetRequest> assets) {
        List<EncodeJob> jobs = new ArrayList<>();
        for (AssetRequest a : assets) {
            try {
                jobs.add(transcode(a.sourcePath(), a.profile()));
            } catch (Exception e) {
                jobs.add(EncodeJob.failed(a.sourcePath(), e.getMessage()));
            }
        }
        return jobs;
    }
}
`,
          },
          {
            name: "EncoderFactoryTest.java",
            dir: "src/test/java/com/streaming/encoding/",
            content: `package com.streaming.encoding;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class EncoderFactoryTest {

    @Test
    void videoFactory_createEncoder_returnsVideoEncoder() {
        var f = new VideoEncoderFactory("fast", 23);
        assertInstanceOf(VideoEncoder.class, f.createEncoder());
    }

    @Test
    void videoFactory_encodeAsset_returns1080p() {
        var job = new VideoEncoderFactory("fast", 23)
            .encodeAsset("/raw/movie.mp4", "1080p");
        assertEquals("done", job.status());
        assertEquals("h264", job.codec());
        assertTrue(job.outputPath().contains("1080p"));
    }

    @Test
    void unsupportedProfile_throwsIllegalArgumentException() {
        var enc = new VideoEncoderFactory("fast", 23).createEncoder();
        assertThrows(IllegalArgumentException.class, () -> enc.encode("/raw/f.mp4", "8k"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "content-encoder.ts",
            dir: "src/encoding/",
            content: `/**
 * src/encoding/content-encoder.ts
 * ----------------------------------
 * Product interface and concrete encoder implementations.
 */

export interface EncodeJob {
  jobId: string;
  sourcePath: string;
  profile: string;
  outputPath: string;
  codec: string;
  status: "done" | "failed";
  durationMs: number;
}

export interface ContentEncoder {
  encode(sourcePath: string, profile: string, onProgress?: (pct: number) => void): Promise<EncodeJob>;
  supportedProfiles(): string[];
}

function validateProfile(encoder: ContentEncoder, profile: string): void {
  if (!encoder.supportedProfiles().includes(profile)) {
    throw new Error(
      \`Unsupported profile '\${profile}'. Supported: \${encoder.supportedProfiles().join(", ")}\`
    );
  }
}

// ─── VideoEncoder ─────────────────────────────────────────────

export class VideoEncoder implements ContentEncoder {
  constructor(private readonly preset = "fast", private readonly crf = 23) {}

  async encode(sourcePath: string, profile: string, onProgress?: (pct: number) => void): Promise<EncodeJob> {
    validateProfile(this, profile);
    const stem   = sourcePath.split("/").pop()?.replace(/\\.[^.]+$/, "") ?? "output";
    const output = \`/encoded/video/\${stem}_\${profile}.mp4\`;
    // Production: await execa("ffmpeg", ["-i", sourcePath, "-preset", this.preset, ...])
    onProgress?.(100);
    return { jobId: \`vid-\${Date.now().toString(36)}\`, sourcePath, profile, outputPath: output, codec: "h264", status: "done", durationMs: 1200 };
  }

  supportedProfiles(): string[] { return ["360p", "720p", "1080p", "4k"]; }
}

// ─── AudioEncoder ─────────────────────────────────────────────

export class AudioEncoder implements ContentEncoder {
  constructor(private readonly bitrate = "192k") {}

  async encode(sourcePath: string, profile: string, onProgress?: (pct: number) => void): Promise<EncodeJob> {
    validateProfile(this, profile);
    const stem   = sourcePath.split("/").pop()?.replace(/\\.[^.]+$/, "") ?? "output";
    const output = \`/encoded/audio/\${stem}_\${profile}.aac\`;
    onProgress?.(100);
    return { jobId: \`aud-\${Date.now().toString(36)}\`, sourcePath, profile, outputPath: output, codec: "aac", status: "done", durationMs: 300 };
  }

  supportedProfiles(): string[] { return ["128k", "192k", "320k"]; }
}
`,
          },
          {
            name: "encoder-factory.ts",
            dir: "src/encoding/",
            content: `/**
 * src/encoding/encoder-factory.ts
 * ----------------------------------
 * Creator and concrete factories for the encoding pipeline.
 */
import { ContentEncoder, EncodeJob, VideoEncoder, AudioEncoder } from "./content-encoder";

export abstract class EncoderFactory {
  abstract createEncoder(): ContentEncoder;

  async encodeAsset(sourcePath: string, profile: string): Promise<EncodeJob> {
    const encoder = this.createEncoder();
    const job = await encoder.encode(sourcePath, profile);
    if (job.status !== "done") {
      throw new Error(\`Encode failed: \${job.jobId}\`);
    }
    return job;
  }
}

export class VideoEncoderFactory extends EncoderFactory {
  constructor(private readonly preset = "fast", private readonly crf = 23) { super(); }
  createEncoder(): ContentEncoder { return new VideoEncoder(this.preset, this.crf); }
}

export class AudioEncoderFactory extends EncoderFactory {
  constructor(private readonly bitrate = "192k") { super(); }
  createEncoder(): ContentEncoder { return new AudioEncoder(this.bitrate); }
}

// ─── Factory selector ─────────────────────────────────────────

export function getEncoderFactory(assetType: string): EncoderFactory {
  switch (assetType.toLowerCase()) {
    case "video": return new VideoEncoderFactory();
    case "audio": return new AudioEncoderFactory();
    default:      throw new Error(\`Unknown asset type: \${assetType}\`);
  }
}
`,
          },
          {
            name: "ingest.ts",
            dir: "src/",
            content: `/**
 * src/ingest.ts
 * -------------
 * IngestService — Consumer. Depends only on EncoderFactory.
 * Never imports VideoEncoderFactory or AudioEncoderFactory.
 * Swap the factory at the callsite to change the encoding backend.
 */
import { getEncoderFactory, EncoderFactory } from "./encoding/encoder-factory";

export class IngestService {
  constructor(private readonly factory: EncoderFactory) {}

  /** Encode a single media asset. */
  async ingest(sourcePath: string, profile: string) {
    return this.factory.encodeAsset(sourcePath, profile);
  }

  /** Encode a batch of assets; status field surfaces per-asset failures. */
  async ingestBatch(assets: Array<{ path: string; profile: string }>) {
    const jobs = [];
    for (const a of assets) {
      try {
        jobs.push(await this.ingest(a.path, a.profile));
      } catch (e) {
        jobs.push({ jobId: "failed", outputPath: a.path, codec: "n/a", status: "error" });
      }
    }
    return jobs;
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────────────────
// Swap factory here to switch codec — IngestService code is unchanged.
const svc = new IngestService(getEncoderFactory("video"));

svc.ingestBatch([
  { path: "/raw/movie.mp4", profile: "1080p" },
  { path: "/raw/promo.mp4", profile: "720p"  },
  { path: "/raw/clip.mp4",  profile: "480p"  },
]).then(jobs =>
  jobs.forEach(j => console.log("[" + j.codec + "] " + j.jobId + " → " + j.outputPath + " (" + j.status + ")")),
).catch(console.error);
`,
          },
        ],
        Rust: [
          {
            name: "encoder.rs",
            dir: "src/",
            content: `//! src/encoder.rs — Product trait and concrete encoder implementations.
use std::fmt;

#[derive(Debug, Clone)]
pub struct EncodeJob {
    pub job_id: String,
    pub source_path: String,
    pub profile: String,
    pub output_path: String,
    pub codec: String,
    pub status: String,
    pub duration_ms: u32,
}

pub trait ContentEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> Result<EncodeJob, String>;
    fn supported_profiles(&self) -> &[&str];

    fn validate_profile(&self, profile: &str) -> Result<(), String> {
        if !self.supported_profiles().contains(&profile) {
            return Err(format!(
                "Unsupported profile '{}'. Supported: {:?}",
                profile, self.supported_profiles()
            ));
        }
        Ok(())
    }
}

pub struct VideoEncoder {
    pub preset: String,
    pub crf: u8,
}

impl ContentEncoder for VideoEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> Result<EncodeJob, String> {
        self.validate_profile(profile)?;
        let stem = std::path::Path::new(source_path)
            .file_stem().and_then(|s| s.to_str()).unwrap_or("output");
        Ok(EncodeJob {
            job_id: format!("vid-{}", source_path.len()),
            source_path: source_path.to_string(),
            profile: profile.to_string(),
            output_path: format!("/encoded/video/{}_{}.mp4", stem, profile),
            codec: "h264".to_string(),
            status: "done".to_string(),
            duration_ms: 1200,
        })
    }
    fn supported_profiles(&self) -> &[&str] { &["360p", "720p", "1080p", "4k"] }
}

pub struct AudioEncoder {
    pub bitrate: String,
}

impl ContentEncoder for AudioEncoder {
    fn encode(&self, source_path: &str, profile: &str) -> Result<EncodeJob, String> {
        self.validate_profile(profile)?;
        Ok(EncodeJob {
            job_id: format!("aud-{}", source_path.len()),
            source_path: source_path.to_string(),
            profile: profile.to_string(),
            output_path: format!("/encoded/audio/output_{}.aac", profile),
            codec: "aac".to_string(),
            status: "done".to_string(),
            duration_ms: 300,
        })
    }
    fn supported_profiles(&self) -> &[&str] { &["128k", "192k", "320k"] }
}
`,
          },
          {
            name: "factory.rs",
            dir: "src/",
            content: `//! src/factory.rs — Creator trait and concrete encoder factories.
use crate::encoder::{AudioEncoder, ContentEncoder, EncodeJob, VideoEncoder};

pub trait EncoderFactory {
    fn create_encoder(&self) -> Box<dyn ContentEncoder>;

    fn encode_asset(&self, source_path: &str, profile: &str) -> Result<EncodeJob, String> {
        let encoder = self.create_encoder();
        let job = encoder.encode(source_path, profile)?;
        if job.status != "done" {
            return Err(format!("Encode failed: {}", job.job_id));
        }
        Ok(job)
    }
}

pub struct VideoEncoderFactory { pub preset: String, pub crf: u8 }

impl EncoderFactory for VideoEncoderFactory {
    fn create_encoder(&self) -> Box<dyn ContentEncoder> {
        Box::new(VideoEncoder { preset: self.preset.clone(), crf: self.crf })
    }
}

pub struct AudioEncoderFactory { pub bitrate: String }

impl EncoderFactory for AudioEncoderFactory {
    fn create_encoder(&self) -> Box<dyn ContentEncoder> {
        Box::new(AudioEncoder { bitrate: self.bitrate.clone() })
    }
}

pub fn get_encoder_factory(asset_type: &str) -> Result<Box<dyn EncoderFactory>, String> {
    match asset_type {
        "video" => Ok(Box::new(VideoEncoderFactory { preset: "fast".into(), crf: 23 })),
        "audio" => Ok(Box::new(AudioEncoderFactory { bitrate: "192k".into() })),
        other   => Err(format!("Unknown asset type: {}", other)),
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! IngestService — Consumer that depends only on EncoderFactory.
mod encoder;
mod factory;

use encoder::EncodeJob;
use factory::{get_encoder_factory, EncoderFactory};

// ─── Consumer ───────────────────────────────────────────────────────────
// IngestService depends only on EncoderFactory — never on VideoEncoderFactory
// or AudioEncoderFactory. Swap factory to change the encoding backend.
struct IngestService {
    factory: Box<dyn EncoderFactory>,
}

impl IngestService {
    fn new(factory: Box<dyn EncoderFactory>) -> Self {
        Self { factory }
    }

    fn ingest(
        &self, source_path: &str, profile: &str,
    ) -> Result<EncodeJob, String> {
        self.factory.encode_asset(source_path, profile)
    }

    fn ingest_batch(
        &self,
        assets: &[(&str, &str)],
    ) -> Vec<Result<EncodeJob, String>> {
        assets.iter().map(|(path, profile)| self.ingest(path, profile)).collect()
    }
}

fn main() {
    // Swap factory here to change codec — IngestService code is unchanged.
    let factory = get_encoder_factory("video").expect("factory error");
    let svc = IngestService::new(factory);

    let assets = vec![
        ("/raw/movie.mp4",  "1080p"),
        ("/raw/promo.mp4",  "720p"),
        ("/raw/clip.mp4",   "480p"),
    ];

    for result in svc.ingest_batch(&assets) {
        match result {
            Ok(j)  => println!("[{}] {} → {} ({})", j.codec, j.job_id, j.output_path, j.status),
            Err(e) => eprintln!("error: {}", e),
        }
    }
}
`,
          },
        ],
      },
    },
    {
      id: 5,
      title: "Logistics — Shipment Handler Creator",
      domain: "Logistics",
      problem:
        "A logistics platform routes parcels through different carriers depending on delivery speed, weight, and destination. Air freight has customs declarations, sea freight requires container manifests, and ground shipping needs route optimization. A monolithic shipment handler becomes untestable and brittle.",
      solution:
        "A ShipmentHandlerFactory factory method creates the correct ShipmentHandler. The dispatch service selects the factory based on shipment attributes; each handler encapsulates its carrier-specific logic.",
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class ShipmentFactory {
    <<abstract>>
    +createHandler()* ShipmentHandler
    +bookShipment(trackingId, weightKg) string
  }
  class AirFreightFactory {
    +createHandler() AirFreightHandler
  }
  class SeaFreightFactory {
    +createHandler() SeaFreightHandler
  }
  class GroundShipmentFactory {
    +createHandler() GroundShipmentHandler
  }
  class ShipmentHandler {
    <<interface>>
    +process(trackingId, weightKg) string
  }
  class AirFreightHandler {
    +process(trackingId, weightKg) string
  }
  class SeaFreightHandler {
    +process(trackingId, weightKg) string
  }
  class GroundShipmentHandler {
    +process(trackingId, weightKg) string
  }
  ShipmentFactory <|-- AirFreightFactory
  ShipmentFactory <|-- SeaFreightFactory
  ShipmentFactory <|-- GroundShipmentFactory
  ShipmentHandler <|.. AirFreightHandler
  ShipmentHandler <|.. SeaFreightHandler
  ShipmentHandler <|.. GroundShipmentHandler
  ShipmentFactory ..> ShipmentHandler : uses
  AirFreightFactory ..> AirFreightHandler : creates
  SeaFreightFactory ..> SeaFreightHandler : creates
  GroundShipmentFactory ..> GroundShipmentHandler : creates
  class ShipmentService {
    -factory: ShipmentFactory
    +book(trackingId, weightKg) string
    +getStatus(trackingId) string
  }
  ShipmentService --> ShipmentFactory : uses`,
      },
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

class ShipmentService:
    """
    Consumer — books and tracks shipments using an injected ShipmentFactory.
    Depends only on ShipmentFactory and ShipmentHandler interfaces; never imports
    AirFreightHandler, SeaFreightHandler, or GroundShipmentHandler directly.
    Carrier selection (air, sea, ground) is driven entirely by which factory is
    passed in — the service logic is carrier-agnostic.
    """
    def __init__(self, factory: ShipmentFactory) -> None:
        self._factory = factory

    def book(self, tracking_id: str, weight_kg: float) -> str:
        """Book a shipment using the carrier encapsulated in the factory."""
        handler = self._factory.create_handler()
        return handler.process(tracking_id, weight_kg)

    def book_batch(self, shipments: list[tuple[str, float]]) -> list[str]:
        """Process multiple shipments through the same carrier in one job."""
        handler = self._factory.create_handler()
        return [handler.process(tid, wkg) for tid, wkg in shipments]

# ── Usage ──
# Swap factory to change carrier — ShipmentService never changes
air_svc = ShipmentService(AirFreightFactory())
print(air_svc.book("SHP-99201", 24.5))
sea_svc = ShipmentService(SeaFreightFactory())
print(sea_svc.book_batch([("SHP-99202", 1200.0), ("SHP-99203", 850.0)]))`,
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

// ShipmentService — Consumer: books shipments via an injected ShipmentFactory.
// Knows nothing about AirFreight or SeaFreight — factory drives carrier logic.
type ShipmentService struct {
	factory ShipmentFactory
}

func NewShipmentService(f ShipmentFactory) *ShipmentService {
	return &ShipmentService{factory: f}
}

func (ss *ShipmentService) Book(trackingID string, weightKg float64) string {
	handler := ss.factory.CreateHandler()
	return handler.Process(trackingID, weightKg)
}

func (ss *ShipmentService) BookBatch(shipments []struct {
	ID     string
	Weight float64
}) []string {
	results := make([]string, 0, len(shipments))
	for _, s := range shipments {
		results = append(results, ss.Book(s.ID, s.Weight))
	}
	return results
}

func main() {
	// Swap factory to change carrier — ShipmentService never changes
	svc := NewShipmentService(AirFreightFactory{})
	fmt.Println(svc.Book("SHP-99201", 24.5))
	svc2 := NewShipmentService(SeaFreightFactory{})
	fmt.Println(svc2.Book("SHP-99202", 800.0))
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
}

/**
 * ShipmentService — Consumer: books shipments via an injected ShipmentFactory.
 * Fully decoupled from air and sea freight logic — swapping the factory changes
 * the carrier and customs workflow without any modification to this class.
 */
class ShipmentService {
    private final ShipmentFactory factory;

    ShipmentService(ShipmentFactory factory) { this.factory = factory; }

    String book(String trackingId, double weightKg) {
        return factory.createHandler().process(trackingId, weightKg);
    }

    java.util.List<String> bookBatch(java.util.List<double[]> shipments) {
        java.util.List<String> results = new java.util.ArrayList<>();
        int i = 0;
        for (double[] s : shipments) results.add(book("SHP-" + (99200 + ++i), s[0]));
        return results;
    }

    public static void main(String[] args) {
        // Swap factory to change carrier — ShipmentService never changes
        ShipmentService svc = new ShipmentService(new AirFreightFactory());
        System.out.println(svc.book("SHP-99201", 24.5));
        ShipmentService svc2 = new ShipmentService(new SeaFreightFactory());
        System.out.println(svc2.book("SHP-99202", 800.0));
    }
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

/**
 * ShipmentService — Consumer: books shipments via an injected ShipmentFactory.
 * Fully decoupled from air and sea freight logic — swapping the factory changes the
 * carrier and associated customs/manifest workflow without touching this class.
 */
class ShipmentService {
  constructor(private factory: ShipmentFactory) {}

  book(trackingId: string, weightKg: number): string {
    return this.factory.createHandler().process(trackingId, weightKg);
  }

  bookBatch(shipments: Array<{ id: string; weight: number }>): string[] {
    return shipments.map(s => this.book(s.id, s.weight));
  }
}

// ── Usage ──
// Swap factory to change carrier — ShipmentService never changes
const airSvc = new ShipmentService(new AirFreightFactory());
console.log(airSvc.book("SHP-99201", 24.5));`,
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

/// ShipmentService — Consumer: books shipments via an injected factory.
/// Decoupled from AirFreightHandler and SeaFreightHandler; the boxed factory
/// determines carrier logic — swap it to switch carriers without code changes.
struct ShipmentService {
    factory: Box<dyn ShipmentFactory>,
}

impl ShipmentService {
    fn new(factory: Box<dyn ShipmentFactory>) -> Self {
        ShipmentService { factory }
    }

    fn book(&self, tracking_id: &str, weight_kg: f64) -> String {
        self.factory.create_handler().process(tracking_id, weight_kg)
    }

    fn book_batch(&self, shipments: &[(&str, f64)]) -> Vec<String> {
        shipments.iter().map(|(id, w)| self.book(id, *w)).collect()
    }
}

fn main() {
    // Swap factory to change carrier — ShipmentService never changes
    let svc = ShipmentService::new(Box::new(AirFreightFactory));
    println!("{}", svc.book("SHP-99201", 24.5));
    let svc2 = ShipmentService::new(Box::new(SeaFreightFactory));
    println!("{}", svc2.book("SHP-99202", 800.0));
}`,
      },
      considerations: [
        "Carrier APIs have different SLAs and retry policies — the handler should encapsulate retries and circuit breaking",
        "Customs declarations for air freight require additional data (HS codes, value declarations) — pass a ShipmentDetails DTO to process()",
        "Weight thresholds determine carrier eligibility — validate before factory selection, not inside the product",
        "Multi-leg shipments (air + ground last mile) may need a composite handler built from multiple factories",
        "Tracking number formats differ per carrier — the factory should also produce carrier-specific tracking ID generators",
      ],
      codeFiles: {
        Python: [
          {
            name: "shipment_handler.py",
            dir: "logistics/",
            content: `"""
logistics/shipment_handler.py
-------------------------------
Product interface and concrete carrier-specific shipment handler implementations.
Each handler encapsulates carrier API calls, retry logic, and tracking ID formats.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
import re


@dataclass
class ShipmentDetails:
    """DTO passed to the factory for carrier eligibility and customs validation."""
    origin_country: str
    destination_country: str
    weight_kg: float
    declared_value_usd: float
    hs_code: Optional[str] = None     # Required for international air shipments


@dataclass
class ShipmentResult:
    shipment_id: str
    tracking_number: str
    carrier: str
    estimated_days: int
    status: str
    label_url: Optional[str] = None


class ShipmentHandler(ABC):
    """Product interface — uniform entry point across all carriers."""

    @abstractmethod
    def process(self, shipment_id: str, details: ShipmentDetails) -> ShipmentResult:
        """Book, label, and confirm a shipment with the carrier."""
        ...

    @abstractmethod
    def generate_tracking_id(self, shipment_id: str) -> str:
        """Return a carrier-formatted tracking number."""
        ...

    @abstractmethod
    def estimated_transit_days(self, details: ShipmentDetails) -> int:
        """Return estimated delivery days based on origin/destination."""
        ...


class AirFreightHandler(ShipmentHandler):
    """FedEx International Priority / DHL Express integration."""

    def __init__(self, api_key: str, account_number: str) -> None:
        self._api_key = api_key
        self._account = account_number

    def process(self, shipment_id: str, details: ShipmentDetails) -> ShipmentResult:
        if not details.hs_code:
            raise ValueError("Air freight requires HS code for customs declaration")
        tracking = self.generate_tracking_id(shipment_id)
        # Production: FedEx API call, PDF label generation
        return ShipmentResult(
            shipment_id=shipment_id,
            tracking_number=tracking,
            carrier="FedEx International Priority",
            estimated_days=self.estimated_transit_days(details),
            status="booked",
            label_url=f"https://labels.fedex.com/{tracking}.pdf",
        )

    def generate_tracking_id(self, shipment_id: str) -> str:
        # FedEx 22-digit format
        return f"7489{abs(hash(shipment_id)) % 10**18:018d}"

    def estimated_transit_days(self, details: ShipmentDetails) -> int:
        return 1 if details.origin_country == details.destination_country else 3


class SeaFreightHandler(ShipmentHandler):
    """Maersk / MSC container shipment integration."""

    def __init__(self, api_key: str, port_of_loading: str) -> None:
        self._api_key = api_key
        self._pol = port_of_loading

    def process(self, shipment_id: str, details: ShipmentDetails) -> ShipmentResult:
        tracking = self.generate_tracking_id(shipment_id)
        # Production: booking API → container manifest → bill of lading
        return ShipmentResult(
            shipment_id=shipment_id,
            tracking_number=tracking,
            carrier="Maersk Line",
            estimated_days=self.estimated_transit_days(details),
            status="booked",
        )

    def generate_tracking_id(self, shipment_id: str) -> str:
        # BL (Bill of Lading) format: MAEU + 9 digits
        return f"MAEU{abs(hash(shipment_id)) % 10**9:09d}"

    def estimated_transit_days(self, details: ShipmentDetails) -> int:
        return 28  # Typical trans-oceanic transit


class GroundShipmentHandler(ShipmentHandler):
    """UPS Ground / FedEx Ground domestic handler."""

    def __init__(self, account_number: str, service_class: str = "ground") -> None:
        self._account = account_number
        self._service = service_class

    def process(self, shipment_id: str, details: ShipmentDetails) -> ShipmentResult:
        tracking = self.generate_tracking_id(shipment_id)
        return ShipmentResult(
            shipment_id=shipment_id,
            tracking_number=tracking,
            carrier="UPS Ground",
            estimated_days=self.estimated_transit_days(details),
            status="booked",
            label_url=f"https://wwwapps.ups.com/WebTracking/track?{tracking}",
        )

    def generate_tracking_id(self, shipment_id: str) -> str:
        return f"1Z{abs(hash(shipment_id)) % 10**16:016d}"

    def estimated_transit_days(self, details: ShipmentDetails) -> int:
        return 5  # Domestic ground estimate
`,
          },
          {
            name: "shipment_factory.py",
            dir: "logistics/",
            content: `"""
logistics/shipment_factory.py
-------------------------------
Creator and concrete factories for the logistics routing engine.
Carrier eligibility is validated here; product creation is kept in concrete subclasses.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from logistics.shipment_handler import (
    ShipmentHandler, ShipmentDetails, ShipmentResult,
    AirFreightHandler, SeaFreightHandler, GroundShipmentHandler,
)


class ShipmentFactory(ABC):
    """Creator — factory method + book_shipment template operation."""

    @abstractmethod
    def _create_handler(self) -> ShipmentHandler:
        ...

    def book_shipment(self, shipment_id: str, details: ShipmentDetails) -> ShipmentResult:
        """Template operation — validates eligibility, creates handler, books."""
        self._validate_eligibility(details)
        handler = self._create_handler()
        result = handler.process(shipment_id, details)
        print(
            f"[{self.__class__.__name__}] booked {result.tracking_number}"
            f" via {result.carrier} ({result.estimated_days}d)"
        )
        return result

    def _validate_eligibility(self, details: ShipmentDetails) -> None:
        """Override in subclass for carrier-specific weight/destination rules."""
        pass


class AirFreightFactory(ShipmentFactory):
    MAX_WEIGHT_KG = 250.0

    def __init__(self, api_key: str, account_number: str) -> None:
        self._api_key = api_key
        self._account = account_number

    def _create_handler(self) -> ShipmentHandler:
        return AirFreightHandler(self._api_key, self._account)

    def _validate_eligibility(self, details: ShipmentDetails) -> None:
        if details.weight_kg > self.MAX_WEIGHT_KG:
            raise ValueError(
                f"Air freight: weight {details.weight_kg}kg exceeds limit {self.MAX_WEIGHT_KG}kg"
            )


class SeaFreightFactory(ShipmentFactory):
    MIN_WEIGHT_KG = 100.0

    def __init__(self, api_key: str, port: str) -> None:
        self._api_key = api_key
        self._port = port

    def _create_handler(self) -> ShipmentHandler:
        return SeaFreightHandler(self._api_key, self._port)


class GroundShipmentFactory(ShipmentFactory):
    def __init__(self, account_number: str) -> None:
        self._account = account_number

    def _create_handler(self) -> ShipmentHandler:
        return GroundShipmentHandler(self._account)


# ── Factory selector ────────────────────────────────────────────────────────

def get_shipment_factory(mode: str, config: dict) -> ShipmentFactory:
    factories = {
        "air":    lambda: AirFreightFactory(config["fedex_api_key"], config["fedex_account"]),
        "sea":    lambda: SeaFreightFactory(config["maersk_api_key"], config.get("port", "USLAX")),
        "ground": lambda: GroundShipmentFactory(config["ups_account"]),
    }
    factory_fn = factories.get(mode.lower())
    if not factory_fn:
        raise ValueError(f"Unknown shipment mode: {mode}")
    return factory_fn()
`,
          },
          {
            name: "dispatch_service.py",
            dir: "services/",
            content: `"""
services/dispatch_service.py
-----------------------------
Dispatch service — orchestrates parcel routing via factory-selected carriers.
Completely decoupled from concrete handler classes.
"""
from logistics.shipment_factory import get_shipment_factory
from logistics.shipment_handler import ShipmentDetails


class DispatchService:
    def __init__(self, config: dict) -> None:
        self._config = config

    def dispatch(self, mode: str, shipment_id: str, details: ShipmentDetails) -> dict:
        factory = get_shipment_factory(mode, self._config)
        result  = factory.book_shipment(shipment_id, details)
        return {
            "shipment_id":     result.shipment_id,
            "tracking_number": result.tracking_number,
            "carrier":         result.carrier,
            "estimated_days":  result.estimated_days,
            "status":          result.status,
        }


if __name__ == "__main__":
    config = {
        "fedex_api_key": "FEDEX_KEY",
        "fedex_account": "ACC-001",
        "maersk_api_key": "MAERSK_KEY",
        "ups_account": "UPS-ACC-042",
    }
    svc = DispatchService(config)

    shipments = [
        ("air",    "SHP-001", ShipmentDetails("US", "DE", 15.0, 500.0, "8471300000")),
        ("sea",    "SHP-002", ShipmentDetails("CN", "US", 850.0, 12000.0)),
        ("ground", "SHP-003", ShipmentDetails("US", "US", 5.0, 80.0)),
    ]
    for mode, sid, details in shipments:
        r = svc.dispatch(mode, sid, details)
        print(f"[{mode}] {r['tracking_number']} via {r['carrier']} ({r['estimated_days']}d)")
`,
          },
          {
            name: "test_shipment_factory.py",
            dir: "tests/",
            content: `"""
tests/test_shipment_factory.py
-------------------------------
Validates factory contracts, eligibility guards, and product type fidelity.
"""
import pytest
from logistics.shipment_factory import (
    AirFreightFactory, SeaFreightFactory, GroundShipmentFactory, get_shipment_factory
)
from logistics.shipment_handler import (
    AirFreightHandler, SeaFreightHandler, GroundShipmentHandler, ShipmentDetails
)

_cfg = {
    "fedex_api_key": "KEY", "fedex_account": "ACC",
    "maersk_api_key": "MKEY", "ups_account": "UPS",
}

class TestProductTypes:
    def test_air_factory_creates_air_handler(self):
        assert isinstance(AirFreightFactory("k", "a")._create_handler(), AirFreightHandler)

    def test_sea_factory_creates_sea_handler(self):
        assert isinstance(SeaFreightFactory("k", "LAX")._create_handler(), SeaFreightHandler)

    def test_ground_factory_creates_ground_handler(self):
        assert isinstance(GroundShipmentFactory("acc")._create_handler(), GroundShipmentHandler)


class TestEligibilityValidation:
    def test_air_rejects_overweight(self):
        details = ShipmentDetails("US", "DE", 300.0, 5000.0, "8471300000")
        with pytest.raises(ValueError, match="exceeds limit"):
            AirFreightFactory("k", "a").book_shipment("SHP-1", details)

    def test_air_requires_hs_code(self):
        details = ShipmentDetails("US", "DE", 10.0, 200.0)   # no hs_code
        with pytest.raises(ValueError, match="HS code"):
            AirFreightFactory("k", "a").book_shipment("SHP-2", details)

    def test_ground_books_successfully(self):
        details = ShipmentDetails("US", "US", 5.0, 80.0)
        result = GroundShipmentFactory("acc").book_shipment("SHP-3", details)
        assert result.status == "booked"


class TestFactorySelector:
    def test_get_factory_air(self):
        assert isinstance(get_shipment_factory("air", _cfg), AirFreightFactory)

    def test_get_factory_unknown_raises(self):
        with pytest.raises(ValueError, match="Unknown shipment mode"):
            get_shipment_factory("drone", _cfg)
`,
          },
        ],
        Go: [
          {
            name: "handler.go",
            dir: "logistics/",
            content: `// logistics/handler.go — Product interface and concrete shipment handlers.
package logistics

import "fmt"

// ShipmentDetails is the DTO for carrier eligibility check and customs data.
type ShipmentDetails struct {
	OriginCountry      string
	DestinationCountry string
	WeightKG           float64
	DeclaredValueUSD   float64
	HSCode             string // Required for international air freight
}

// ShipmentResult is the uniform booking response.
type ShipmentResult struct {
	ShipmentID     string
	TrackingNumber string
	Carrier        string
	EstimatedDays  int
	Status         string
	LabelURL       string
}

// ShipmentHandler is the Product interface.
type ShipmentHandler interface {
	Process(shipmentID string, details ShipmentDetails) (ShipmentResult, error)
	GenerateTrackingID(shipmentID string) string
	EstimatedTransitDays(details ShipmentDetails) int
}

// ─── AirFreightHandler ────────────────────────────────────────

type AirFreightHandler struct {
	APIKey        string
	AccountNumber string
}

func (h *AirFreightHandler) Process(id string, d ShipmentDetails) (ShipmentResult, error) {
	if d.HSCode == "" {
		return ShipmentResult{}, fmt.Errorf("air freight requires an HS code for customs")
	}
	tracking := h.GenerateTrackingID(id)
	return ShipmentResult{
		ShipmentID: id, TrackingNumber: tracking, Carrier: "FedEx International Priority",
		EstimatedDays: h.EstimatedTransitDays(d), Status: "booked",
		LabelURL: fmt.Sprintf("https://labels.fedex.com/%s.pdf", tracking),
	}, nil
}
func (h *AirFreightHandler) GenerateTrackingID(id string) string {
	return fmt.Sprintf("7489%018d", len(id)*123456789)
}
func (h *AirFreightHandler) EstimatedTransitDays(d ShipmentDetails) int {
	if d.OriginCountry == d.DestinationCountry { return 1 }
	return 3
}

// ─── GroundShipmentHandler ────────────────────────────────────

type GroundShipmentHandler struct {
	AccountNumber string
}

func (h *GroundShipmentHandler) Process(id string, d ShipmentDetails) (ShipmentResult, error) {
	tracking := h.GenerateTrackingID(id)
	return ShipmentResult{
		ShipmentID: id, TrackingNumber: tracking, Carrier: "UPS Ground",
		EstimatedDays: h.EstimatedTransitDays(d), Status: "booked",
	}, nil
}
func (h *GroundShipmentHandler) GenerateTrackingID(id string) string {
	return fmt.Sprintf("1Z%016d", len(id)*9876543210)
}
func (h *GroundShipmentHandler) EstimatedTransitDays(_ ShipmentDetails) int { return 5 }
`,
          },
          {
            name: "factory.go",
            dir: "logistics/",
            content: `// logistics/factory.go — Creator interface and concrete shipment factories.
package logistics

import (
	"fmt"
	"strings"
)

// ShipmentFactory is the Creator interface.
type ShipmentFactory interface {
	CreateHandler() ShipmentHandler
	BookShipment(shipmentID string, details ShipmentDetails) (ShipmentResult, error)
}

// baseFactory provides the reusable BookShipment template.
type baseFactory struct{}

func (b baseFactory) bookShipment(
	f ShipmentFactory, id string, d ShipmentDetails,
) (ShipmentResult, error) {
	handler := f.CreateHandler()
	return handler.Process(id, d)
}

// ─── AirFreightFactory ────────────────────────────────────────

type AirFreightFactory struct {
	baseFactory
	APIKey  string
	Account string
}

func (f *AirFreightFactory) CreateHandler() ShipmentHandler {
	return &AirFreightHandler{APIKey: f.APIKey, AccountNumber: f.Account}
}
func (f *AirFreightFactory) BookShipment(id string, d ShipmentDetails) (ShipmentResult, error) {
	if d.WeightKG > 250.0 {
		return ShipmentResult{}, fmt.Errorf("air freight: weight %.1fkg exceeds 250kg limit", d.WeightKG)
	}
	return f.bookShipment(f, id, d)
}

// ─── GroundShipmentFactory ────────────────────────────────────

type GroundShipmentFactory struct {
	baseFactory
	Account string
}

func (f *GroundShipmentFactory) CreateHandler() ShipmentHandler {
	return &GroundShipmentHandler{AccountNumber: f.Account}
}
func (f *GroundShipmentFactory) BookShipment(id string, d ShipmentDetails) (ShipmentResult, error) {
	return f.bookShipment(f, id, d)
}

// ─── Factory selector ─────────────────────────────────────────

func GetShipmentFactory(mode string) (ShipmentFactory, error) {
	switch strings.ToLower(mode) {
	case "air":
		return &AirFreightFactory{APIKey: "FEDEX_KEY", Account: "ACC-001"}, nil
	case "ground":
		return &GroundShipmentFactory{Account: "UPS-042"}, nil
	default:
		return nil, fmt.Errorf("unknown shipment mode: %s", mode)
	}
}
`,
          },
          {
            name: "dispatch_service.go",
            dir: "services/",
            content: `// services/dispatch_service.go
// DispatchService — Consumer. Depends only on logistics.ShipmentFactory.
// Never imports AirFreightFactory or GroundShipmentFactory.
package services

import "github.com/example/logistics"

// DispatchService books shipments via an injected ShipmentFactory.
type DispatchService struct {
	factory logistics.ShipmentFactory
}

func NewDispatchService(f logistics.ShipmentFactory) *DispatchService {
	return &DispatchService{factory: f}
}

func (ds *DispatchService) Dispatch(id string, details logistics.ShipmentDetails) (logistics.ShipmentResult, error) {
	return ds.factory.BookShipment(id, details)
}

type ShipOrder struct {
	ID      string
	Details logistics.ShipmentDetails
}

func (ds *DispatchService) DispatchBatch(orders []ShipOrder) []logistics.ShipmentResult {
	results := make([]logistics.ShipmentResult, 0, len(orders))
	for _, o := range orders {
		r, err := ds.Dispatch(o.ID, o.Details)
		if err == nil {
			results = append(results, r)
		}
	}
	return results
}
`,
          },
          {
            name: "main.go",
            dir: "cmd/dispatch/",
            content: `// cmd/dispatch/main.go
// Wires the air freight factory into DispatchService and books a batch of shipments.
package main

import (
	"fmt"
	"log"

	"github.com/example/logistics"
	logsvc "github.com/example/logistics/services"
)

func main() {
	// Swap factory here to change carrier — DispatchService is unchanged.
	factory, err := logistics.GetShipmentFactory("air")
	if err != nil {
		log.Fatalf("factory error: %v", err)
	}

	svc := logsvc.NewDispatchService(factory)

	for _, r := range svc.DispatchBatch([]logsvc.ShipOrder{
		{ID: "SHP-001", Details: logistics.ShipmentDetails{OriginCountry: "US", DestinationCountry: "DE", WeightKG: 15, DeclaredValueUSD: 500, HSCode: "8471300000"}},
		{ID: "SHP-002", Details: logistics.ShipmentDetails{OriginCountry: "US", DestinationCountry: "GB", WeightKG: 3, DeclaredValueUSD: 120, HSCode: "9503000090"}},
	}) {
		fmt.Printf("[%s] %s via %s (%dd)\\n", r.ShipmentID, r.TrackingNumber, r.Carrier, r.EstimatedDays)
	}
}
`,
          },
        ],
        Java: [
          {
            name: "ShipmentHandler.java",
            dir: "src/main/java/com/logistics/",
            content: `package com.logistics;

/**
 * Product interface — each carrier implements process() uniformly.
 * Carrier-specific API clients, retry logic, and label generation live
 * inside the concrete product, not in the factory.
 */
public interface ShipmentHandler {

    /**
     * Book, label, and confirm a shipment.
     *
     * @param shipmentId internal shipment identifier
     * @param details    DTO with weight, origin, destination, and HS code for customs
     * @return ShipmentResult with tracking number, carrier, and estimated transit days
     */
    ShipmentResult process(String shipmentId, ShipmentDetails details);

    /** Generate a carrier-formatted tracking ID for the given shipment. */
    String generateTrackingId(String shipmentId);

    /** Estimated delivery days based on origin/destination pair. */
    int estimatedTransitDays(ShipmentDetails details);
}
`,
          },
          {
            name: "AirFreightHandler.java",
            dir: "src/main/java/com/logistics/",
            content: `package com.logistics;

/**
 * FedEx International Priority — concrete Product.
 * Enforces HS-code requirement for customs declarations.
 */
public class AirFreightHandler implements ShipmentHandler {

    private final String apiKey;
    private final String accountNumber;

    AirFreightHandler(String apiKey, String accountNumber) {
        this.apiKey         = apiKey;
        this.accountNumber  = accountNumber;
    }

    @Override
    public ShipmentResult process(String shipmentId, ShipmentDetails details) {
        if (details.hsCode() == null || details.hsCode().isBlank()) {
            throw new IllegalArgumentException(
                "Air freight requires an HS code for customs declaration");
        }
        String tracking = generateTrackingId(shipmentId);
        // Production: FedExClient.bookShipment(...)
        return new ShipmentResult(
            shipmentId, tracking, "FedEx International Priority",
            estimatedTransitDays(details), "booked",
            "https://labels.fedex.com/" + tracking + ".pdf"
        );
    }

    @Override
    public String generateTrackingId(String shipmentId) {
        return "7489" + String.format("%018d", (long) Math.abs(shipmentId.hashCode()) * 123L);
    }

    @Override
    public int estimatedTransitDays(ShipmentDetails details) {
        return details.originCountry().equals(details.destinationCountry()) ? 1 : 3;
    }
}
`,
          },
          {
            name: "ShipmentFactory.java",
            dir: "src/main/java/com/logistics/",
            content: `package com.logistics;

/**
 * Creator (abstract) — factory method + bookShipment template operation.
 * Carrier eligibility validation is delegated to concrete subclasses via
 * the protected validateEligibility() hook.
 */
public abstract class ShipmentFactory {

    /** Factory method — subclass decides which handler to instantiate. */
    protected abstract ShipmentHandler createHandler();

    /** Optional eligibility hook — subclass overrides for carrier-specific rules. */
    protected void validateEligibility(ShipmentDetails details) {
        // No-op by default; subclasses override
    }

    /** Template operation — validate → create → process → return. */
    public final ShipmentResult bookShipment(String shipmentId, ShipmentDetails details) {
        validateEligibility(details);
        ShipmentHandler handler = createHandler();
        return handler.process(shipmentId, details);
    }
}
`,
          },
          {
            name: "AirFreightFactory.java",
            dir: "src/main/java/com/logistics/",
            content: `package com.logistics;

/**
 * Concrete Creator for FedEx air freight.
 * Enforces 250 kg weight limit before handler creation.
 */
public class AirFreightFactory extends ShipmentFactory {

    private static final double MAX_WEIGHT_KG = 250.0;

    private final String apiKey;
    private final String accountNumber;

    public AirFreightFactory(String apiKey, String accountNumber) {
        this.apiKey        = apiKey;
        this.accountNumber = accountNumber;
    }

    @Override
    protected ShipmentHandler createHandler() {
        return new AirFreightHandler(apiKey, accountNumber);
    }

    @Override
    protected void validateEligibility(ShipmentDetails details) {
        if (details.weightKg() > MAX_WEIGHT_KG) {
            throw new IllegalArgumentException(
                String.format("Air freight: %.1f kg exceeds %.1f kg limit",
                    details.weightKg(), MAX_WEIGHT_KG));
        }
    }
}
`,
          },
          {
            name: "DispatchService.java",
            dir: "src/main/java/com/logistics/service/",
            content: `package com.logistics.service;

import com.logistics.ShipmentFactory;
import com.logistics.ShipmentDetails;
import com.logistics.ShipmentResult;
import java.util.List;
import java.util.ArrayList;

/**
 * DispatchService — Consumer. Depends only on ShipmentFactory.
 * Never imports AirFreightFactory or GroundShipmentFactory.
 * Swap the factory at the call site to change the carrier.
 */
public class DispatchService {

    private final ShipmentFactory factory;

    public DispatchService(ShipmentFactory factory) {
        this.factory = factory;
    }

    /**
     * Book a single shipment.
     * @param shipmentId internal shipment identifier
     * @param details    weight, route, declared value, and HS code
     * @return ShipmentResult with tracking number, carrier, and estimated days
     */
    public ShipmentResult dispatch(String shipmentId, ShipmentDetails details) {
        return factory.bookShipment(shipmentId, details);
    }

    public record ShipOrder(String shipmentId, ShipmentDetails details) {}

    /** Book multiple shipments via the same carrier factory. */
    public List<ShipmentResult> dispatchBatch(List<ShipOrder> orders) {
        List<ShipmentResult> results = new ArrayList<>();
        for (ShipOrder o : orders) {
            try {
                results.add(dispatch(o.shipmentId(), o.details()));
            } catch (Exception e) {
                results.add(ShipmentResult.failed(o.shipmentId(), e.getMessage()));
            }
        }
        return results;
    }
}
`,
          },
          {
            name: "ShipmentFactoryTest.java",
            dir: "src/test/java/com/logistics/",
            content: `package com.logistics;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ShipmentFactoryTest {

    @Test
    void airFactory_createHandler_returnsAirFreightHandler() {
        var f = new AirFreightFactory("key", "acc");
        assertInstanceOf(AirFreightHandler.class, f.createHandler());
    }

    @Test
    void airFactory_bookShipment_returnsBooked() {
        var details = new ShipmentDetails("US", "DE", 15.0, 500.0, "8471300000");
        var result  = new AirFreightFactory("key", "acc").bookShipment("SHP-1", details);
        assertEquals("booked", result.status());
        assertEquals("FedEx International Priority", result.carrier());
    }

    @Test
    void airFactory_rejectsOverweightShipment() {
        var details = new ShipmentDetails("US", "DE", 300.0, 5000.0, "8471300000");
        assertThrows(IllegalArgumentException.class,
            () -> new AirFreightFactory("key", "acc").bookShipment("SHP-2", details));
    }

    @Test
    void airHandler_rejectsMissingHSCode() {
        var details = new ShipmentDetails("US", "DE", 10.0, 200.0, null);
        assertThrows(IllegalArgumentException.class,
            () -> new AirFreightFactory("key", "acc").bookShipment("SHP-3", details));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "shipment-handler.ts",
            dir: "src/logistics/",
            content: `/**
 * src/logistics/shipment-handler.ts
 * ------------------------------------
 * Product interface and concrete carrier shipment handlers.
 */

export interface ShipmentDetails {
  originCountry: string;
  destinationCountry: string;
  weightKg: number;
  declaredValueUsd: number;
  hsCode?: string; // Required for international air freight
}

export interface ShipmentResult {
  shipmentId: string;
  trackingNumber: string;
  carrier: string;
  estimatedDays: number;
  status: "booked" | "failed";
  labelUrl?: string;
}

export interface ShipmentHandler {
  process(shipmentId: string, details: ShipmentDetails): Promise<ShipmentResult>;
  generateTrackingId(shipmentId: string): string;
  estimatedTransitDays(details: ShipmentDetails): number;
}

// ─── AirFreightHandler ──────────────────────────────────────────

export class AirFreightHandler implements ShipmentHandler {
  constructor(private readonly apiKey: string, private readonly account: string) {}

  async process(shipmentId: string, details: ShipmentDetails): Promise<ShipmentResult> {
    if (!details.hsCode) {
      throw new Error("Air freight requires an HS code for customs declaration");
    }
    const tracking = this.generateTrackingId(shipmentId);
    // Production: await fedexClient.bookShipment({ ... })
    return {
      shipmentId, trackingNumber: tracking,
      carrier: "FedEx International Priority",
      estimatedDays: this.estimatedTransitDays(details),
      status: "booked",
      labelUrl: \`https://labels.fedex.com/\${tracking}.pdf\`,
    };
  }

  generateTrackingId(shipmentId: string): string {
    return \`7489\${Math.abs(hashCode(shipmentId)) % 10 ** 15}\`.padEnd(22, "0");
  }

  estimatedTransitDays(details: ShipmentDetails): number {
    return details.originCountry === details.destinationCountry ? 1 : 3;
  }
}

// ─── GroundShipmentHandler ─────────────────────────────────────

export class GroundShipmentHandler implements ShipmentHandler {
  constructor(private readonly account: string) {}

  async process(shipmentId: string, details: ShipmentDetails): Promise<ShipmentResult> {
    const tracking = this.generateTrackingId(shipmentId);
    return {
      shipmentId, trackingNumber: tracking,
      carrier: "UPS Ground",
      estimatedDays: this.estimatedTransitDays(details),
      status: "booked",
    };
  }

  generateTrackingId(shipmentId: string): string {
    return \`1Z\${Math.abs(hashCode(shipmentId)) % 10 ** 14}\`.padEnd(18, "0");
  }

  estimatedTransitDays(_details: ShipmentDetails): number { return 5; }
}

function hashCode(s: string): number {
  return s.split("").reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
}
`,
          },
          {
            name: "shipment-factory.ts",
            dir: "src/logistics/",
            content: `/**
 * src/logistics/shipment-factory.ts
 * ------------------------------------
 * Creator abstract class and concrete shipment factories.
 */
import {
  ShipmentHandler, ShipmentDetails, ShipmentResult,
  AirFreightHandler, GroundShipmentHandler,
} from "./shipment-handler";

export abstract class ShipmentFactory {
  abstract createHandler(): ShipmentHandler;

  protected validateEligibility(_details: ShipmentDetails): void {
    // Subclasses override
  }

  async bookShipment(shipmentId: string, details: ShipmentDetails): Promise<ShipmentResult> {
    this.validateEligibility(details);
    const handler = this.createHandler();
    return handler.process(shipmentId, details);
  }
}

export class AirFreightFactory extends ShipmentFactory {
  private static readonly MAX_WEIGHT = 250;

  constructor(private readonly apiKey: string, private readonly account: string) { super(); }

  createHandler(): ShipmentHandler {
    return new AirFreightHandler(this.apiKey, this.account);
  }

  protected validateEligibility(details: ShipmentDetails): void {
    if (details.weightKg > AirFreightFactory.MAX_WEIGHT) {
      throw new Error(\`Air freight: \${details.weightKg}kg exceeds \${AirFreightFactory.MAX_WEIGHT}kg limit\`);
    }
  }
}

export class GroundShipmentFactory extends ShipmentFactory {
  constructor(private readonly account: string) { super(); }

  createHandler(): ShipmentHandler {
    return new GroundShipmentHandler(this.account);
  }
}

export function getShipmentFactory(mode: string): ShipmentFactory {
  switch (mode.toLowerCase()) {
    case "air":    return new AirFreightFactory("FEDEX_KEY", "ACC-001");
    case "ground": return new GroundShipmentFactory("UPS-042");
    default:       throw new Error(\`Unknown shipment mode: \${mode}\`);
  }
}
`,
          },
          {
            name: "dispatch.ts",
            dir: "src/",
            content: `/**
 * src/dispatch.ts
 * ---------------
 * DispatchService — Consumer. Depends only on ShipmentFactory.
 * Never imports AirFreightFactory or GroundShipmentFactory.
 * Swap the factory at the callsite to change the carrier.
 */
import { getShipmentFactory, ShipmentFactory } from "./logistics/shipment-factory";
import type { ShipmentDetails } from "./logistics/shipment-handler";

export class DispatchService {
  constructor(private readonly factory: ShipmentFactory) {}

  /** Book a single shipment via the injected carrier factory. */
  async dispatch(shipmentId: string, details: ShipmentDetails) {
    return this.factory.bookShipment(shipmentId, details);
  }

  /** Book multiple shipments via the same carrier factory. */
  async dispatchBatch(orders: Array<{ id: string; details: ShipmentDetails }>) {
    const results = [];
    for (const o of orders) {
      try {
        results.push(await this.dispatch(o.id, o.details));
      } catch (e) {
        results.push({ trackingNumber: "FAILED", carrier: "n/a", estimatedDays: 0 });
      }
    }
    return results;
  }
}

// ─── Demo ────────────────────────────────────────────────────────────────────────────────
// Swap factory here to switch carrier — DispatchService code is unchanged.
const svc = new DispatchService(getShipmentFactory("air"));

svc.dispatchBatch([
  { id: "SHP-001", details: { originCountry: "US", destinationCountry: "DE", weightKg: 15, declaredValueUsd: 500, hsCode: "8471300000" } },
  { id: "SHP-002", details: { originCountry: "US", destinationCountry: "GB", weightKg: 3,  declaredValueUsd: 120, hsCode: "9503000090" } },
]).then(results =>
  results.forEach(r => console.log("[" + r.carrier + "] " + r.trackingNumber + " (" + r.estimatedDays + "d)")),
).catch(console.error);
`,
          },
        ],
        Rust: [
          {
            name: "handler.rs",
            dir: "src/",
            content: `//! src/handler.rs — Product trait and concrete shipment handler implementations.

#[derive(Debug, Clone)]
pub struct ShipmentDetails {
    pub origin_country: String,
    pub destination_country: String,
    pub weight_kg: f64,
    pub declared_value_usd: f64,
    pub hs_code: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ShipmentResult {
    pub shipment_id: String,
    pub tracking_number: String,
    pub carrier: String,
    pub estimated_days: u32,
    pub status: String,
}

pub trait ShipmentHandler {
    fn process(&self, shipment_id: &str, details: &ShipmentDetails) -> Result<ShipmentResult, String>;
    fn generate_tracking_id(&self, shipment_id: &str) -> String;
    fn estimated_transit_days(&self, details: &ShipmentDetails) -> u32;
}

pub struct AirFreightHandler {
    pub api_key: String,
    pub account: String,
}

impl ShipmentHandler for AirFreightHandler {
    fn process(&self, id: &str, details: &ShipmentDetails) -> Result<ShipmentResult, String> {
        if details.hs_code.is_none() {
            return Err("Air freight requires an HS code for customs".into());
        }
        let tracking = self.generate_tracking_id(id);
        Ok(ShipmentResult {
            shipment_id: id.to_string(), tracking_number: tracking,
            carrier: "FedEx International Priority".into(),
            estimated_days: self.estimated_transit_days(details),
            status: "booked".into(),
        })
    }
    fn generate_tracking_id(&self, id: &str) -> String { format!("7489{:018}", id.len() * 123456789) }
    fn estimated_transit_days(&self, d: &ShipmentDetails) -> u32 {
        if d.origin_country == d.destination_country { 1 } else { 3 }
    }
}

pub struct GroundShipmentHandler { pub account: String }

impl ShipmentHandler for GroundShipmentHandler {
    fn process(&self, id: &str, details: &ShipmentDetails) -> Result<ShipmentResult, String> {
        Ok(ShipmentResult {
            shipment_id: id.to_string(),
            tracking_number: self.generate_tracking_id(id),
            carrier: "UPS Ground".into(),
            estimated_days: self.estimated_transit_days(details),
            status: "booked".into(),
        })
    }
    fn generate_tracking_id(&self, id: &str) -> String { format!("1Z{:016}", id.len() * 9876543) }
    fn estimated_transit_days(&self, _: &ShipmentDetails) -> u32 { 5 }
}
`,
          },
          {
            name: "factory.rs",
            dir: "src/",
            content: `//! src/factory.rs — Creator trait and concrete shipment factories.
use crate::handler::{AirFreightHandler, GroundShipmentHandler, ShipmentDetails, ShipmentHandler, ShipmentResult};

pub trait ShipmentFactory {
    fn create_handler(&self) -> Box<dyn ShipmentHandler>;

    fn validate_eligibility(&self, _details: &ShipmentDetails) -> Result<(), String> { Ok(()) }

    fn book_shipment(&self, shipment_id: &str, details: &ShipmentDetails) -> Result<ShipmentResult, String> {
        self.validate_eligibility(details)?;
        let handler = self.create_handler();
        handler.process(shipment_id, details)
    }
}

pub struct AirFreightFactory { pub api_key: String, pub account: String }

impl ShipmentFactory for AirFreightFactory {
    fn create_handler(&self) -> Box<dyn ShipmentHandler> {
        Box::new(AirFreightHandler { api_key: self.api_key.clone(), account: self.account.clone() })
    }
    fn validate_eligibility(&self, d: &ShipmentDetails) -> Result<(), String> {
        if d.weight_kg > 250.0 {
            Err(format!("Air freight: {:.1}kg exceeds 250kg limit", d.weight_kg))
        } else {
            Ok(())
        }
    }
}

pub struct GroundShipmentFactory { pub account: String }

impl ShipmentFactory for GroundShipmentFactory {
    fn create_handler(&self) -> Box<dyn ShipmentHandler> {
        Box::new(GroundShipmentHandler { account: self.account.clone() })
    }
}

pub fn get_factory(mode: &str) -> Result<Box<dyn ShipmentFactory>, String> {
    match mode {
        "air"    => Ok(Box::new(AirFreightFactory { api_key: "FEDEX_KEY".into(), account: "ACC-001".into() })),
        "ground" => Ok(Box::new(GroundShipmentFactory { account: "UPS-042".into() })),
        other    => Err(format!("Unknown shipment mode: {}", other)),
    }
}
`,
          },
          {
            name: "main.rs",
            dir: "src/",
            content: `//! src/main.rs
//! DispatchService — Consumer that depends only on ShipmentFactory.
mod handler;
mod factory;

use handler::{ShipmentDetails, ShipmentResult};
use factory::{get_factory, ShipmentFactory};

// ─── Consumer ───────────────────────────────────────────────────────────
// DispatchService depends only on ShipmentFactory — never on AirFreightFactory
// or GroundShipmentFactory. Swap factory to change the carrier.
struct DispatchService {
    factory: Box<dyn ShipmentFactory>,
}

impl DispatchService {
    fn new(factory: Box<dyn ShipmentFactory>) -> Self {
        Self { factory }
    }

    fn dispatch(
        &self, shipment_id: &str, details: &ShipmentDetails,
    ) -> Result<ShipmentResult, String> {
        self.factory.book_shipment(shipment_id, details)
    }

    fn dispatch_batch(
        &self,
        orders: &[(&str, ShipmentDetails)],
    ) -> Vec<Result<ShipmentResult, String>> {
        orders.iter().map(|(id, d)| self.dispatch(id, d)).collect()
    }
}

fn main() {
    // Swap factory here to change carrier — DispatchService code is unchanged.
    let factory = get_factory("air").expect("factory error");
    let svc = DispatchService::new(factory);

    let orders = vec![
        ("SHP-001", ShipmentDetails { origin_country: "US".into(), destination_country: "DE".into(), weight_kg: 15.0, declared_value_usd: 500.0, hs_code: Some("8471300000".into()) }),
        ("SHP-002", ShipmentDetails { origin_country: "US".into(), destination_country: "GB".into(), weight_kg: 3.0,  declared_value_usd: 120.0, hs_code: Some("9503000090".into()) }),
    ];

    for result in svc.dispatch_batch(&orders) {
        match result {
            Ok(r)  => println!("[{}] {} via {} ({}d)", r.shipment_id, r.tracking_number, r.carrier, r.estimated_days),
            Err(e) => eprintln!("error: {}", e),
        }
    }
}
`,
          },
        ],
      },
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class NotificationCreator {
    <<abstract>>
    +createNotification(kwargs)* Notification
    +notify(kwargs) string
  }
  class EmailCreator {
    -fromAddress: string
    +createNotification(to, subject, body) EmailNotification
  }
  class SMSCreator {
    +createNotification(to, body) SMSNotification
  }
  class PushCreator {
    +createNotification(token, title, body) PushNotification
  }
  class Notification {
    <<interface>>
    +render() string
  }
  class EmailNotification {
    -from: string
    -to: string
    -subject: string
    -body: string
    +render() string
  }
  class SMSNotification {
    -to: string
    -body: string
    +render() string
  }
  class PushNotification {
    -deviceToken: string
    -title: string
    -body: string
    +render() string
  }
  NotificationCreator <|-- EmailCreator
  NotificationCreator <|-- SMSCreator
  NotificationCreator <|-- PushCreator
  Notification <|.. EmailNotification
  Notification <|.. SMSNotification
  Notification <|.. PushNotification
  NotificationCreator ..> Notification : uses
  EmailCreator ..> EmailNotification : creates
  SMSCreator ..> SMSNotification : creates
  PushCreator ..> PushNotification : creates`,
      },
      diagramExplanation:
        "The Creator hierarchy mirrors the Product hierarchy exactly. NotificationCreator declares the factory method and owns the notify() template operation. Each concrete Creator (EmailCreator, SMSCreator) instantiates its paired product. Client code works with NotificationCreator references and never sees concrete types.",
      codeFiles: {
        Python: [
          {
            name: "notification.py",
            dir: "classic/",
            content: `from abc import ABC, abstractmethod
from dataclasses import dataclass


class Notification(ABC):
    """Product interface."""
    @abstractmethod
    def render(self) -> str: ...


class EmailNotification(Notification):
    def __init__(self, from_addr: str, to: str, subject: str, body: str) -> None:
        self._from = from_addr
        self._to, self._subject, self._body = to, subject, body

    def render(self) -> str:
        return f"FROM: {self._from}\\nTO: {self._to}\\nSUBJ: {self._subject}\\n\\n{self._body}"


class SMSNotification(Notification):
    MAX_LEN = 160

    def __init__(self, to: str, body: str) -> None:
        self._to = to
        self._body = body[: self.MAX_LEN]

    def render(self) -> str:
        return f"SMS → {self._to}: {self._body}"


class PushNotification(Notification):
    def __init__(self, device_token: str, title: str, body: str) -> None:
        self._token, self._title, self._body = device_token, title, body

    def render(self) -> str:
        return f"PUSH → {self._token} | {self._title}: {self._body}"
`,
          },
          {
            name: "creator.py",
            dir: "classic/",
            content: `from abc import ABC, abstractmethod
from classic.notification import Notification, EmailNotification, SMSNotification, PushNotification


class NotificationCreator(ABC):
    """
    Creator — factory method + notify template operation.
    Subclasses override create_notification(); this class owns the workflow.
    """

    @abstractmethod
    def create_notification(self, **kwargs) -> Notification:
        """Factory method — subclass decides which Notification to create."""
        ...

    def notify(self, **kwargs) -> str:
        """Template operation: create → render → dispatch."""
        notification = self.create_notification(**kwargs)
        rendered = notification.render()
        print(f"[{self.__class__.__name__}] Dispatching: {rendered[:80]}...")
        return rendered


class EmailCreator(NotificationCreator):
    def __init__(self, from_address: str = "noreply@example.com") -> None:
        self._from = from_address

    def create_notification(self, to: str, subject: str, body: str) -> Notification:
        return EmailNotification(self._from, to, subject, body)


class SMSCreator(NotificationCreator):
    def create_notification(self, to: str, body: str) -> Notification:  # type: ignore[override]
        return SMSNotification(to, body)


class PushCreator(NotificationCreator):
    def create_notification(self, device_token: str, title: str, body: str) -> Notification:  # type: ignore[override]
        return PushNotification(device_token, title, body)


if __name__ == "__main__":
    for creator, kwargs in [
        (EmailCreator(), dict(to="alice@test.com", subject="Welcome", body="Hello Alice!")),
        (SMSCreator(),   dict(to="+15551234567", body="Your code: 4821")),
        (PushCreator(),  dict(device_token="tok_abc", title="New offer", body="20% off")),
    ]:
        creator.notify(**kwargs)
`,
          },
        ],
        Java: [
          {
            name: "NotificationCreator.java",
            dir: "src/main/java/com/patterns/classic/",
            content: `package com.patterns.classic;

/**
 * Abstract Creator — declares the factory method and owns the notify() template.
 * Subclasses override createNotification(); this class never instantiates products.
 *
 * This is the canonical GoF Factory Method: Creator uses the product it creates
 * through the Notification interface, never through concrete types.
 */
public abstract class NotificationCreator {

    /**
     * Factory method — concrete subclass decides which product to create.
     * @param request DTO encapsulating all creation parameters
     */
    protected abstract Notification createNotification(NotificationRequest request);

    /** Template operation — all notification workflow lives here. */
    public final String notify(NotificationRequest request) {
        Notification n = createNotification(request);
        String rendered = n.render();
        System.out.printf("[%s] %s%n",
            getClass().getSimpleName(),
            rendered.substring(0, Math.min(80, rendered.length())));
        return rendered;
    }
}
`,
          },
          {
            name: "EmailCreator.java",
            dir: "src/main/java/com/patterns/classic/",
            content: `package com.patterns.classic;

/** Concrete Creator — produces EmailNotification instances. */
public class EmailCreator extends NotificationCreator {

    private final String fromAddress;

    public EmailCreator(String fromAddress) {
        this.fromAddress = fromAddress;
    }

    @Override
    protected Notification createNotification(NotificationRequest request) {
        return new EmailNotification(fromAddress, request.to(), request.subject(), request.body());
    }
}
`,
          },
          {
            name: "NotificationCreatorTest.java",
            dir: "src/test/java/com/patterns/classic/",
            content: `package com.patterns.classic;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class NotificationCreatorTest {

    @Test
    void emailCreator_createNotification_returnsEmailNotification() {
        var creator = new EmailCreator("from@test.com");
        assertInstanceOf(EmailNotification.class,
            creator.createNotification(new NotificationRequest("to@test.com", "S", "B")));
    }

    @Test
    void emailCreator_notify_rendersWithSubject() {
        var result = new EmailCreator("from@test.com")
            .notify(new NotificationRequest("to@test.com", "Hello", "World"));
        assertTrue(result.contains("Hello"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "notification-creator.ts",
            dir: "src/classic/",
            content: `/**
 * Classic (Abstract Subclass) Factory Method variant.
 * NotificationCreator is the abstract Creator; Email/SMS/PushCreator are concrete Creators.
 */

export interface Notification {
  render(): string;
}

export interface NotificationRequest {
  to: string;
  subject?: string;
  body: string;
}

export abstract class NotificationCreator {
  protected abstract createNotification(req: NotificationRequest): Notification;

  notify(req: NotificationRequest): string {
    const n = this.createNotification(req);
    const rendered = n.render();
    console.log(\`[\${this.constructor.name}] \${rendered.slice(0, 80)}\`);
    return rendered;
  }
}

class EmailNotification implements Notification {
  constructor(private from: string, private to: string, private subject: string, private body: string) {}
  render(): string { return \`FROM: \${this.from}\\nTO: \${this.to}\\nSUBJ: \${this.subject}\\n\\n\${this.body}\`; }
}

class SMSNotification implements Notification {
  constructor(private to: string, private body: string) {}
  render(): string { return \`SMS → \${this.to}: \${this.body.slice(0, 160)}\`; }
}

export class EmailCreator extends NotificationCreator {
  constructor(private readonly fromAddress = "noreply@example.com") { super(); }
  protected createNotification(req: NotificationRequest): Notification {
    return new EmailNotification(this.fromAddress, req.to, req.subject ?? "", req.body);
  }
}

export class SMSCreator extends NotificationCreator {
  protected createNotification(req: NotificationRequest): Notification {
    return new SMSNotification(req.to, req.body);
  }
}
`,
          },
        ],
        Go: [
          {
            name: "creator.go",
            dir: "classic/",
            content: `// classic/creator.go — Classic (Abstract Subclass) Factory Method in Go.
// Go doesn't have abstract classes; we simulate with interfaces + embedding.
package classic

import "fmt"

type Notification interface {
	Render() string
}

type NotificationRequest struct {
	To      string
	Subject string
	Body    string
}

// NotificationCreator is the Creator interface.
// Notify() is the template operation; CreateNotification() is the factory method.
type NotificationCreator interface {
	CreateNotification(req NotificationRequest) Notification
	Notify(req NotificationRequest) string
}

// baseCreator provides the Notify template — concrete types embed this.
type baseCreator struct{}

func baseNotify(c NotificationCreator, req NotificationRequest) string {
	n := c.CreateNotification(req)
	rendered := n.Render()
	fmt.Printf("Dispatching: %.80s\n", rendered)
	return rendered
}

// ─── Email ────────────────────────────────────────────────────────────────

type EmailCreator struct {
	baseCreator
	FromAddress string
}

func (e EmailCreator) CreateNotification(req NotificationRequest) Notification {
	return &emailNotification{from: e.FromAddress, to: req.To, subject: req.Subject, body: req.Body}
}

func (e EmailCreator) Notify(req NotificationRequest) string {
	return baseNotify(e, req)
}

type emailNotification struct{ from, to, subject, body string }

func (n *emailNotification) Render() string {
	return fmt.Sprintf("FROM: %s\nTO: %s\nSUBJ: %s\n\n%s", n.from, n.to, n.subject, n.body)
}
`,
          },
        ],
        Rust: [
          {
            name: "classic.rs",
            dir: "src/",
            content: `//! Classic (Abstract Subclass) Factory Method — Rust implementation.
//! Rust traits serve as both Product interface and Creator interface.

pub trait Notification {
    fn render(&self) -> String;
}

pub struct NotificationRequest {
    pub to: String,
    pub subject: String,
    pub body: String,
}

pub trait NotificationCreator {
    fn create_notification(&self, req: &NotificationRequest) -> Box<dyn Notification>;

    /// Template operation — calls factory method, renders, dispatches.
    fn notify(&self, req: &NotificationRequest) -> String {
        let n = self.create_notification(req);
        let rendered = n.render();
        println!("Dispatching: {:.80}", rendered);
        rendered
    }
}

// ─── Email ─────────────────────────────────────────────────────────────────

struct EmailNotification {
    from: String,
    to: String,
    subject: String,
    body: String,
}

impl Notification for EmailNotification {
    fn render(&self) -> String {
        format!("FROM: {}\nTO: {}\nSUBJ: {}\n\n{}", self.from, self.to, self.subject, self.body)
    }
}

pub struct EmailCreator {
    pub from_address: String,
}

impl NotificationCreator for EmailCreator {
    fn create_notification(&self, req: &NotificationRequest) -> Box<dyn Notification> {
        Box::new(EmailNotification {
            from: self.from_address.clone(),
            to: req.to.clone(),
            subject: req.subject.clone(),
            body: req.body.clone(),
        })
    }
}
`,
          },
        ],
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class ChannelFactory {
    -_defaults: Map~string, type~
    +create_channel(type, kwargs)$ Channel
  }
  class Channel {
    <<interface>>
    +send(message) string
  }
  class EmailChannel {
    -smtp_host: string
    +send(message) string
  }
  class SMSChannel {
    -provider: string
    +send(message) string
  }
  class PushChannel {
    -platform: string
    +send(message) string
  }
  ChannelFactory ..> Channel : creates
  Channel <|.. EmailChannel
  Channel <|.. SMSChannel
  Channel <|.. PushChannel`,
      },
      diagramExplanation:
        "A single ChannelFactory class owns the switch/match dispatch. There is no Creator hierarchy — the type parameter replaces subclassing. This collapses the two-level hierarchy into one class, trading subclass flexibility for simplicity.",
      codeFiles: {
        Python: [
          {
            name: "parameterized_factory.py",
            dir: "parameterized/",
            content: `from __future__ import annotations
from abc import ABC, abstractmethod


class Channel(ABC):
    @abstractmethod
    def send(self, message: str) -> str: ...


class EmailChannel(Channel):
    def __init__(self, smtp_host: str = "smtp.example.com") -> None:
        self._host = smtp_host

    def send(self, message: str) -> str:
        return f"[EMAIL via {self._host}] {message}"


class SMSChannel(Channel):
    def __init__(self, provider: str = "twilio") -> None:
        self._provider = provider

    def send(self, message: str) -> str:
        return f"[SMS via {self._provider}] {message}"


class PushChannel(Channel):
    def __init__(self, platform: str = "fcm") -> None:
        self._platform = platform

    def send(self, message: str) -> str:
        return f"[PUSH via {self._platform}] {message}"


class ChannelFactory:
    """
    Parameterized Factory Method — type parameter drives creation.
    No subclass hierarchy; all logic lives in one factory method.
    """

    _defaults: dict[str, type[Channel]] = {
        "email": EmailChannel,
        "sms": SMSChannel,
        "push": PushChannel,
    }

    @classmethod
    def create_channel(cls, channel_type: str, **kwargs) -> Channel:
        cls_type = cls._defaults.get(channel_type.lower())
        if cls_type is None:
            raise ValueError(
                f"Unknown channel '{channel_type}'. "
                f"Available: {list(cls._defaults)}"
            )
        return cls_type(**kwargs)


if __name__ == "__main__":
    for ch_type in ("email", "sms", "push"):
        ch = ChannelFactory.create_channel(ch_type)
        print(ch.send(f"Test message via {ch_type}"))
`,
          },
        ],
        Java: [
          {
            name: "ChannelFactory.java",
            dir: "src/main/java/com/patterns/parameterized/",
            content: `package com.patterns.parameterized;

import java.util.Map;
import java.util.function.Supplier;

/**
 * Parameterized Factory Method.
 * A single static method creates different Channel implementations based on a string key.
 * This pattern is ideal when the number of variants is known and stable.
 */
public final class ChannelFactory {

    private static final Map<String, Supplier<Channel>> REGISTRY = Map.of(
        "email", EmailChannel::new,
        "sms",   SMSChannel::new,
        "push",  PushChannel::new
    );

    private ChannelFactory() {}

    public static Channel createChannel(String type) {
        var factory = REGISTRY.get(type.toLowerCase());
        if (factory == null) {
            throw new IllegalArgumentException(
                "Unknown channel type: '" + type + "'. Available: " + REGISTRY.keySet()
            );
        }
        return factory.get();
    }

    public static void main(String[] args) {
        for (var type : new String[]{"email", "sms", "push"}) {
            Channel ch = createChannel(type);
            System.out.println(ch.send("Test via " + type));
        }
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "parameterized-factory.ts",
            dir: "src/parameterized/",
            content: `/**
 * Parameterized Factory Method — one factory function with a type discriminant.
 */

export interface Channel {
  send(message: string): string;
}

type ChannelType = "email" | "sms" | "push";

class EmailChannel implements Channel {
  send(msg: string): string { return \`[EMAIL] \${msg}\`; }
}
class SMSChannel implements Channel {
  send(msg: string): string { return \`[SMS] \${msg}\`; }
}
class PushChannel implements Channel {
  send(msg: string): string { return \`[PUSH] \${msg}\`; }
}

const channelFactories: Record<ChannelType, () => Channel> = {
  email: () => new EmailChannel(),
  sms:   () => new SMSChannel(),
  push:  () => new PushChannel(),
};

export function createChannel(type: ChannelType): Channel {
  const factory = channelFactories[type];
  return factory();
}

// Usage
const types: ChannelType[] = ["email", "sms", "push"];
for (const t of types) {
  console.log(createChannel(t).send(\`Test via \${t}\`));
}
`,
          },
        ],
        Go: [
          {
            name: "parameterized.go",
            dir: "parameterized/",
            content: `// parameterized/parameterized.go — Parameterized Factory Method.
package parameterized

import (
	"fmt"
	"strings"
)

type Channel interface {
	Send(message string) string
}

type emailChannel struct {
	smtpHost string
}

func (e *emailChannel) Send(msg string) string {
	return fmt.Sprintf("[EMAIL via %s] %s", e.smtpHost, msg)
}

type smsChannel struct {
	provider string
}

func (s *smsChannel) Send(msg string) string {
	return fmt.Sprintf("[SMS via %s] %s", s.provider, msg)
}

// CreateChannel is the parameterized factory function.
func CreateChannel(channelType string) (Channel, error) {
	switch strings.ToLower(channelType) {
	case "email":
		return &emailChannel{smtpHost: "smtp.example.com"}, nil
	case "sms":
		return &smsChannel{provider: "twilio"}, nil
	default:
		return nil, fmt.Errorf("unknown channel type: %q", channelType)
	}
}
`,
          },
        ],
        Rust: [
          {
            name: "parameterized.rs",
            dir: "src/",
            content: `//! Parameterized Factory Method in Rust.

pub trait Channel {
    fn send(&self, message: &str) -> String;
}

struct EmailChannel;
struct SmsChannel;

impl Channel for EmailChannel {
    fn send(&self, msg: &str) -> String {
        format!("[EMAIL] {}", msg)
    }
}

impl Channel for SmsChannel {
    fn send(&self, msg: &str) -> String {
        format!("[SMS] {}", msg)
    }
}

/// Parameterized factory function — type string drives creation.
pub fn create_channel(kind: &str) -> Result<Box<dyn Channel>, String> {
    match kind {
        "email" => Ok(Box::new(EmailChannel)),
        "sms"   => Ok(Box::new(SmsChannel)),
        other   => Err(format!("Unknown channel type: {}", other)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_email_channel() {
        let ch = create_channel("email").unwrap();
        assert!(ch.send("hello").contains("[EMAIL]"));
    }

    #[test]
    fn unknown_type_returns_err() {
        assert!(create_channel("fax").is_err());
    }
}
`,
          },
        ],
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class Color {
    -r: int
    -g: int
    -b: int
    -a: float
    -Color(r,g,b,a)
    +fromHex(hex)$  Color
    +fromRGB(r,g,b)$ Color
    +fromHSL(h,s,l)$ Color
    +fromName(name)$ Color
    +toHex() string
    +withAlpha(a) Color
  }`,
      },
      diagramExplanation:
        "Static factory methods live inside the class they produce. The private constructor prevents direct instantiation; all creation flows through named static methods. Each method communicates intent (fromHex, fromHSL) far better than overloaded constructors.",
      codeFiles: {
        Python: [
          {
            name: "color.py",
            dir: "static_factory/",
            content: `from __future__ import annotations
import re


class Color:
    """
    Immutable RGB color with static factory methods.

    Static factory methods are preferrable to constructors when:
    - Multiple creation paths exist with the same parameter types
    - The name should convey intent (fromHex is clearer than Color(0xFF, 0x88, 0x00))
    - Instances may be cached or derived without full construction
    """

    _CSS_NAMES: dict[str, tuple[int, int, int]] = {
        "red": (255, 0, 0),
        "green": (0, 128, 0),
        "blue": (0, 0, 255),
        "white": (255, 255, 255),
        "black": (0, 0, 0),
    }

    def __init__(self, r: int, g: int, b: int, a: float = 1.0) -> None:
        if not (0 <= r <= 255 and 0 <= g <= 255 and 0 <= b <= 255):
            raise ValueError(f"RGB values must be 0-255, got ({r}, {g}, {b})")
        if not (0.0 <= a <= 1.0):
            raise ValueError(f"Alpha must be 0.0-1.0, got {a}")
        self.r, self.g, self.b, self.a = r, g, b, a

    # ─── Static factory methods (the pattern) ──────────────────────────────

    @classmethod
    def from_hex(cls, hex_color: str) -> "Color":
        """Parse #RRGGBB or #RRGGBBAA."""
        h = hex_color.lstrip("#")
        if len(h) == 6:
            return cls(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
        if len(h) == 8:
            return cls(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), int(h[6:8], 16) / 255)
        raise ValueError(f"Invalid hex color: {hex_color!r}")

    @classmethod
    def from_rgb(cls, r: int, g: int, b: int) -> "Color":
        return cls(r, g, b)

    @classmethod
    def from_hsl(cls, h: float, s: float, l: float) -> "Color":
        """Convert HSL (0-360, 0-1, 0-1) to RGB."""
        c = (1 - abs(2 * l - 1)) * s
        x = c * (1 - abs((h / 60) % 2 - 1))
        m = l - c / 2
        if h < 60:    r1, g1, b1 = c, x, 0.0
        elif h < 120: r1, g1, b1 = x, c, 0.0
        elif h < 180: r1, g1, b1 = 0.0, c, x
        elif h < 240: r1, g1, b1 = 0.0, x, c
        elif h < 300: r1, g1, b1 = x, 0.0, c
        else:         r1, g1, b1 = c, 0.0, x
        return cls(round((r1 + m) * 255), round((g1 + m) * 255), round((b1 + m) * 255))

    @classmethod
    def from_name(cls, name: str) -> "Color":
        rgb = cls._CSS_NAMES.get(name.lower())
        if rgb is None:
            raise ValueError(f"Unknown color name: {name!r}")
        return cls(*rgb)

    # ─── Mutations return new instances (immutability) ──────────────────────

    def with_alpha(self, alpha: float) -> "Color":
        return Color(self.r, self.g, self.b, alpha)

    def to_hex(self) -> str:
        return f"#{self.r:02X}{self.g:02X}{self.b:02X}"

    def __repr__(self) -> str:
        return f"Color(r={self.r}, g={self.g}, b={self.b}, a={self.a})"


if __name__ == "__main__":
    print(Color.from_hex("#FF8800"))
    print(Color.from_hsl(210, 1.0, 0.5))
    print(Color.from_name("blue").with_alpha(0.5))
`,
          },
        ],
        Java: [
          {
            name: "Color.java",
            dir: "src/main/java/com/patterns/staticfactory/",
            content: `package com.patterns.staticfactory;

import java.util.Map;
import java.util.Objects;

/**
 * Immutable Color value-object demonstrating the Static Factory Method pattern.
 *
 * Advantages over constructors:
 * - Named methods communicate intent (fromHex vs new Color(255, 136, 0))
 * - Can return cached instances (e.g., Color.BLACK)
 * - Can return subtypes
 * - Constructor failures can be signalled with Optional or null instead of exceptions
 *
 * See: Effective Java, Item 1 (Bloch, 2018)
 */
public final class Color {

    private static final Map<String, Color> CSS_NAMES = Map.of(
        "red",   new Color(255, 0, 0),
        "green", new Color(0, 128, 0),
        "blue",  new Color(0, 0, 255),
        "white", new Color(255, 255, 255),
        "black", new Color(0, 0, 0)
    );

    // Pre-built constants — static factory allows caching
    public static final Color BLACK = CSS_NAMES.get("black");
    public static final Color WHITE = CSS_NAMES.get("white");

    private final int r, g, b;
    private final float alpha;

    /** Private constructor — all creation goes through static factories. */
    private Color(int r, int g, int b) {
        this(r, g, b, 1.0f);
    }

    private Color(int r, int g, int b, float alpha) {
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
            throw new IllegalArgumentException("RGB must be 0-255");
        if (alpha < 0f || alpha > 1f)
            throw new IllegalArgumentException("Alpha must be 0.0-1.0");
        this.r = r; this.g = g; this.b = b; this.alpha = alpha;
    }

    // ─── Static factory methods ──────────────────────────────────────────

    /** Parse #RRGGBB or #RRGGBBAA hex strings. */
    public static Color fromHex(String hex) {
        String h = hex.startsWith("#") ? hex.substring(1) : hex;
        return switch (h.length()) {
            case 6 -> new Color(
                Integer.parseInt(h, 0, 2, 16),
                Integer.parseInt(h, 2, 4, 16),
                Integer.parseInt(h, 4, 6, 16));
            case 8 -> new Color(
                Integer.parseInt(h, 0, 2, 16),
                Integer.parseInt(h, 2, 4, 16),
                Integer.parseInt(h, 4, 6, 16),
                Integer.parseInt(h, 6, 8, 16) / 255f);
            default -> throw new IllegalArgumentException("Invalid hex: " + hex);
        };
    }

    public static Color fromRGB(int r, int g, int b) { return new Color(r, g, b); }

    public static Color fromName(String name) {
        Color c = CSS_NAMES.get(name.toLowerCase());
        if (c == null) throw new IllegalArgumentException("Unknown color: " + name);
        return c;
    }

    // ─── Derived instances (immutable mutation) ──────────────────────────

    public Color withAlpha(float a) { return new Color(r, g, b, a); }

    public String toHex() { return String.format("#%02X%02X%02X", r, g, b); }

    public int getR() { return r; }
    public int getG() { return g; }
    public int getB() { return b; }

    @Override
    public boolean equals(Object o) {
        return o instanceof Color c && r == c.r && g == c.g && b == c.b && alpha == c.alpha;
    }
    @Override public int hashCode() { return Objects.hash(r, g, b, alpha); }
    @Override public String toString() { return String.format("Color(r=%d,g=%d,b=%d,a=%.2f)", r, g, b, alpha); }
}
`,
          },
          {
            name: "ColorTest.java",
            dir: "src/test/java/com/patterns/staticfactory/",
            content: `package com.patterns.staticfactory;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ColorTest {

    @Test
    void fromHex_parsesCorrectly() {
        var c = Color.fromHex("#FF8800");
        assertEquals(255, c.getR());
        assertEquals(136, c.getG());
        assertEquals(0,   c.getB());
    }

    @Test
    void fromName_blue() {
        assertEquals(Color.fromRGB(0, 0, 255), Color.fromName("blue"));
    }

    @Test
    void withAlpha_doesNotMutateOriginal() {
        var c = Color.fromName("red");
        var c2 = c.withAlpha(0.5f);
        assertNotSame(c, c2);
        assertEquals("#FF0000", c.toHex());
    }

    @Test
    void fromHex_invalidThrows() {
        assertThrows(IllegalArgumentException.class, () -> Color.fromHex("#ZZZ"));
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "color.ts",
            dir: "src/static-factory/",
            content: `/**
 * Static Factory Method — named static methods on the Color class.
 */

const CSS_NAMES: Record<string, [number, number, number]> = {
  red:   [255, 0, 0],
  green: [0, 128, 0],
  blue:  [0, 0, 255],
  white: [255, 255, 255],
  black: [0, 0, 0],
};

export class Color {
  private constructor(
    readonly r: number,
    readonly g: number,
    readonly b: number,
    readonly a = 1.0,
  ) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
      throw new RangeError("RGB values must be 0-255");
  }

  static fromHex(hex: string): Color {
    const h = hex.replace("#", "");
    if (h.length !== 6 && h.length !== 8) throw new Error(\`Invalid hex: \${hex}\`);
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return new Color(r, g, b, a);
  }

  static fromRGB(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  static fromName(name: string): Color {
    const rgb = CSS_NAMES[name.toLowerCase()];
    if (!rgb) throw new Error(\`Unknown color: \${name}\`);
    return new Color(...rgb);
  }

  withAlpha(a: number): Color { return new Color(this.r, this.g, this.b, a); }

  toHex(): string {
    return "#" + [this.r, this.g, this.b].map((v) => v.toString(16).padStart(2, "0").toUpperCase()).join("");
  }

  toString(): string { return \`Color(r=\${this.r},g=\${this.g},b=\${this.b},a=\${this.a})\`; }
}

// Usage
console.log(Color.fromHex("#FF8800").toString());
console.log(Color.fromName("blue").withAlpha(0.5).toHex());
`,
          },
        ],
        Go: [
          {
            name: "color.go",
            dir: "staticfactory/",
            content: `// staticfactory/color.go — Static Factory Method in Go.
// Go lacks static methods; package-level functions serve the same purpose.
package staticfactory

import (
	"fmt"
	"strconv"
	"strings"
)

// Color is an immutable RGB color value.
type Color struct {
	R, G, B uint8
	A        float32
}

var cssNames = map[string]Color{
	"red":   {255, 0, 0, 1},
	"green": {0, 128, 0, 1},
	"blue":  {0, 0, 255, 1},
	"white": {255, 255, 255, 1},
	"black": {0, 0, 0, 1},
}

// FromHex parses a #RRGGBB hex string into a Color.
func FromHex(hex string) (Color, error) {
	h := strings.TrimPrefix(hex, "#")
	if len(h) != 6 {
		return Color{}, fmt.Errorf("invalid hex color %q", hex)
	}
	parse := func(s string) (uint8, error) {
		v, err := strconv.ParseUint(s, 16, 8)
		return uint8(v), err
	}
	r, err := parse(h[0:2])
	if err != nil { return Color{}, err }
	g, _ := parse(h[2:4])
	b, _ := parse(h[4:6])
	return Color{r, g, b, 1.0}, nil
}

// FromRGB constructs a Color from component values.
func FromRGB(r, g, b uint8) Color { return Color{r, g, b, 1.0} }

// FromName looks up a CSS color name.
func FromName(name string) (Color, error) {
	c, ok := cssNames[strings.ToLower(name)]
	if !ok {
		return Color{}, fmt.Errorf("unknown color %q", name)
	}
	return c, nil
}

// WithAlpha returns a new Color with the given alpha (0.0-1.0).
func (c Color) WithAlpha(a float32) Color { c.A = a; return c }

// ToHex returns the #RRGGBB hex string.
func (c Color) ToHex() string { return fmt.Sprintf("#%02X%02X%02X", c.R, c.G, c.B) }
`,
          },
        ],
        Rust: [
          {
            name: "color.rs",
            dir: "src/",
            content: `//! Static Factory Method in Rust — named constructors on the Color type.

#[derive(Debug, Clone, PartialEq)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: f32,
}

impl Color {
    // ─── Static factory methods (named constructors) ─────────────────────

    pub fn from_hex(hex: &str) -> Result<Self, String> {
        let h = hex.trim_start_matches('#');
        if h.len() != 6 {
            return Err(format!("Invalid hex color: {}", hex));
        }
        let r = u8::from_str_radix(&h[0..2], 16).map_err(|e| e.to_string())?;
        let g = u8::from_str_radix(&h[2..4], 16).map_err(|e| e.to_string())?;
        let b = u8::from_str_radix(&h[4..6], 16).map_err(|e| e.to_string())?;
        Ok(Self { r, g, b, a: 1.0 })
    }

    pub fn from_rgb(r: u8, g: u8, b: u8) -> Self {
        Self { r, g, b, a: 1.0 }
    }

    pub fn from_name(name: &str) -> Result<Self, String> {
        match name.to_lowercase().as_str() {
            "red"   => Ok(Self::from_rgb(255, 0, 0)),
            "green" => Ok(Self::from_rgb(0, 128, 0)),
            "blue"  => Ok(Self::from_rgb(0, 0, 255)),
            "white" => Ok(Self::from_rgb(255, 255, 255)),
            "black" => Ok(Self::from_rgb(0, 0, 0)),
            other   => Err(format!("Unknown color name: {}", other)),
        }
    }

    pub fn with_alpha(self, a: f32) -> Self { Self { a, ..self } }

    pub fn to_hex(&self) -> String {
        format!("#{:02X}{:02X}{:02X}", self.r, self.g, self.b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn from_hex_parses() {
        let c = Color::from_hex("#FF8800").unwrap();
        assert_eq!(c.r, 255);
        assert_eq!(c.g, 136);
    }

    #[test]
    fn from_name_blue() {
        let c = Color::from_name("blue").unwrap();
        assert_eq!(c.b, 255);
    }

    #[test]
    fn to_hex_roundtrip() {
        let c = Color::from_rgb(0, 128, 255);
        assert_eq!(c.to_hex(), "#0080FF");
    }
}
`,
          },
        ],
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class SerializerRegistry {
    -registry: Map~string, Supplier~
    +register(key, factory) SerializerRegistry
    +create(key) Serializer
    +available() string[]
    +defaults()$ SerializerRegistry
  }
  class Serializer {
    <<interface>>
    +serialize(data) string
    +deserialize(raw) dict
  }
  class JsonSerializer {
    +serialize(data) string
    +deserialize(raw) dict
  }
  class XmlSerializer {
    +serialize(data) string
    +deserialize(raw) dict
  }
  class CsvSerializer {
    +serialize(data) string
    +deserialize(raw) dict
  }
  SerializerRegistry ..> Serializer : creates
  Serializer <|.. JsonSerializer
  Serializer <|.. XmlSerializer
  Serializer <|.. CsvSerializer`,
      },
      diagramExplanation:
        "The Registry holds a map of string keys to creator lambdas. New serializer types are added by calling register() — the registry and existing serializers need no modification. This perfectly satisfies the Open/Closed Principle.",
      codeFiles: {
        Python: [
          {
            name: "serializer_registry.py",
            dir: "registry/",
            content: `from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Callable


class Serializer(ABC):
    @abstractmethod
    def serialize(self, data: dict) -> str: ...

    @abstractmethod
    def deserialize(self, raw: str) -> dict: ...


class JsonSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        import json
        return json.dumps(data)

    def deserialize(self, raw: str) -> dict:
        import json
        return json.loads(raw)


class XmlSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        pairs = "".join(f"<{k}>{v}</{k}>" for k, v in data.items())
        return f"<root>{pairs}</root>"

    def deserialize(self, raw: str) -> dict:
        import re
        return dict(re.findall(r"<(\w+)>(.*?)</\\1>", raw))


class CsvSerializer(Serializer):
    def serialize(self, data: dict) -> str:
        keys = ",".join(data.keys())
        vals = ",".join(str(v) for v in data.values())
        return f"{keys}\\n{vals}"

    def deserialize(self, raw: str) -> dict:
        lines = raw.strip().split("\\n")
        return dict(zip(lines[0].split(","), lines[1].split(",")))


FactoryFn = Callable[[], Serializer]


class SerializerRegistry:
    """
    Registry-Based Factory Method.

    Maintains a map of keys → factory callables.
    New serializers are added via register() without touching existing code.
    """

    def __init__(self) -> None:
        self._registry: dict[str, FactoryFn] = {}

    def register(self, key: str, factory: FactoryFn) -> "SerializerRegistry":
        """Fluent registration — returns self for chaining."""
        self._registry[key.lower()] = factory
        return self

    def create(self, key: str) -> Serializer:
        factory = self._registry.get(key.lower())
        if factory is None:
            raise KeyError(
                f"No serializer registered for '{key}'. "
                f"Available: {self.available()}"
            )
        return factory()

    def available(self) -> list[str]:
        return sorted(self._registry.keys())

    @classmethod
    def defaults(cls) -> "SerializerRegistry":
        """Create a pre-populated registry with the built-in serializers."""
        return (
            cls()
            .register("json", JsonSerializer)
            .register("xml", XmlSerializer)
            .register("csv", CsvSerializer)
        )


if __name__ == "__main__":
    registry = SerializerRegistry.defaults()
    data = {"name": "Alice", "role": "engineer"}

    for fmt in registry.available():
        s = registry.create(fmt)
        serialized = s.serialize(data)
        print(f"[{fmt}] {serialized}")
`,
          },
        ],
        Java: [
          {
            name: "SerializerRegistry.java",
            dir: "src/main/java/com/patterns/registry/",
            content: `package com.patterns.registry;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Registry-Based Factory Method.
 *
 * The registry maps string keys to Supplier<Serializer> lambdas.
 * Adding a new format only requires a register() call — no switch or if/else needed.
 * Thread-safe via ConcurrentHashMap.
 */
public final class SerializerRegistry {

    private final Map<String, Supplier<Serializer>> registry = new ConcurrentHashMap<>();

    public SerializerRegistry register(String key, Supplier<Serializer> factory) {
        registry.put(key.toLowerCase(), factory);
        return this;  // fluent API
    }

    public Serializer create(String key) {
        var factory = registry.get(key.toLowerCase());
        if (factory == null) {
            throw new IllegalArgumentException(
                "No serializer for '" + key + "'. Available: " + available()
            );
        }
        return factory.get();
    }

    public List<String> available() {
        return registry.keySet().stream().sorted().toList();
    }

    /** Pre-populated registry with the three built-in serializers. */
    public static SerializerRegistry defaults() {
        return new SerializerRegistry()
            .register("json", JsonSerializer::new)
            .register("xml",  XmlSerializer::new)
            .register("csv",  CsvSerializer::new);
    }
}
`,
          },
          {
            name: "SerializerRegistryTest.java",
            dir: "src/test/java/com/patterns/registry/",
            content: `package com.patterns.registry;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import static org.junit.jupiter.api.Assertions.*;

class SerializerRegistryTest {

    private final SerializerRegistry registry = SerializerRegistry.defaults();

    @ParameterizedTest
    @ValueSource(strings = {"json", "xml", "csv"})
    void defaults_createsBuiltinTypes(String format) {
        assertNotNull(registry.create(format));
    }

    @Test
    void create_unknownKey_throws() {
        assertThrows(IllegalArgumentException.class, () -> registry.create("yaml"));
    }

    @Test
    void register_customSerializer_isAvailable() {
        registry.register("custom", () -> data -> "custom:" + data);
        assertEquals("custom:" + Map.of("k", "v"), registry.create("custom").serialize(Map.of("k", "v")));
    }

    @Test
    void available_isSorted() {
        var avail = SerializerRegistry.defaults().available();
        assertEquals(List.of("csv", "json", "xml"), avail);
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "serializer-registry.ts",
            dir: "src/registry/",
            content: `/**
 * Registry-Based Factory Method in TypeScript.
 */

export interface Serializer {
  serialize(data: Record<string, unknown>): string;
  deserialize(raw: string): Record<string, unknown>;
}

type SerializerFactory = () => Serializer;

export class SerializerRegistry {
  private readonly registry = new Map<string, SerializerFactory>();

  register(key: string, factory: SerializerFactory): this {
    this.registry.set(key.toLowerCase(), factory);
    return this;
  }

  create(key: string): Serializer {
    const factory = this.registry.get(key.toLowerCase());
    if (!factory) throw new Error(\`No serializer for '\${key}'. Available: \${this.available().join(", ")}\`);
    return factory();
  }

  available(): string[] {
    return [...this.registry.keys()].sort();
  }

  static defaults(): SerializerRegistry {
    return new SerializerRegistry()
      .register("json", () => ({
        serialize: (d) => JSON.stringify(d),
        deserialize: (r) => JSON.parse(r),
      }))
      .register("csv", () => ({
        serialize: (d) => {
          const keys = Object.keys(d).join(",");
          const vals = Object.values(d).join(",");
          return \`\${keys}\n\${vals}\`;
        },
        deserialize: (r) => {
          const [k, v] = r.split("\n").map((l) => l.split(","));
          return Object.fromEntries(k.map((key, i) => [key, v[i]]));
        },
      }));
  }
}

// Usage
const registry = SerializerRegistry.defaults();
const data = { name: "Alice", role: "engineer" };
for (const fmt of registry.available()) {
  console.log(\`[\${fmt}]\`, registry.create(fmt).serialize(data));
}
`,
          },
        ],
        Go: [
          {
            name: "registry.go",
            dir: "registry/",
            content: `// registry/registry.go — Registry-Based Factory Method in Go.
package registry

import (
	"encoding/json"
	"fmt"
	"sort"
)

type Serializer interface {
	Serialize(data map[string]string) (string, error)
}

type FactoryFn func() Serializer

// SerializerRegistry maps string keys to factory functions.
type SerializerRegistry struct {
	registry map[string]FactoryFn
}

func New() *SerializerRegistry {
	return &SerializerRegistry{registry: make(map[string]FactoryFn)}
}

func (r *SerializerRegistry) Register(key string, fn FactoryFn) *SerializerRegistry {
	r.registry[key] = fn
	return r
}

func (r *SerializerRegistry) Create(key string) (Serializer, error) {
	fn, ok := r.registry[key]
	if !ok {
		return nil, fmt.Errorf("no serializer for %q", key)
	}
	return fn(), nil
}

func (r *SerializerRegistry) Available() []string {
	keys := make([]string, 0, len(r.registry))
	for k := range r.registry { keys = append(keys, k) }
	sort.Strings(keys)
	return keys
}

// Defaults returns a pre-populated registry.
func Defaults() *SerializerRegistry {
	return New().
		Register("json", func() Serializer { return &jsonSerializer{} }).
		Register("csv",  func() Serializer { return &csvSerializer{} })
}

// ─── Implementations ────────────────────────────────────────────────────────

type jsonSerializer struct{}

func (*jsonSerializer) Serialize(data map[string]string) (string, error) {
	b, err := json.Marshal(data)
	return string(b), err
}

type csvSerializer struct{}

func (*csvSerializer) Serialize(data map[string]string) (string, error) {
	var keys, vals []byte
	first := true
	for k, v := range data {
		if !first { keys = append(keys, ','); vals = append(vals, ',') }
		keys = append(keys, k...); vals = append(vals, v...)
		first = false
	}
	return string(keys) + "\\n" + string(vals), nil
}
`,
          },
        ],
        Rust: [
          {
            name: "registry.rs",
            dir: "src/",
            content: `//! Registry-Based Factory Method in Rust.
//! A HashMap maps string keys to boxed factory closures.

use std::collections::HashMap;

pub trait Serializer {
    fn serialize(&self, data: &[(&str, &str)]) -> String;
}

type FactoryFn = Box<dyn Fn() -> Box<dyn Serializer> + Send + Sync>;

pub struct SerializerRegistry {
    map: HashMap<String, FactoryFn>,
}

impl SerializerRegistry {
    pub fn new() -> Self {
        Self { map: HashMap::new() }
    }

    pub fn register<F>(mut self, key: &str, factory: F) -> Self
    where
        F: Fn() -> Box<dyn Serializer> + Send + Sync + 'static,
    {
        self.map.insert(key.to_lowercase(), Box::new(factory));
        self
    }

    pub fn create(&self, key: &str) -> Result<Box<dyn Serializer>, String> {
        self.map
            .get(&key.to_lowercase())
            .map(|f| f())
            .ok_or_else(|| format!("No serializer for '{}'", key))
    }

    pub fn defaults() -> Self {
        Self::new()
            .register("json", || Box::new(JsonSerializer))
            .register("csv",  || Box::new(CsvSerializer))
    }
}

struct JsonSerializer;
impl Serializer for JsonSerializer {
    fn serialize(&self, data: &[(&str, &str)]) -> String {
        let pairs: Vec<String> = data.iter().map(|(k, v)| format!("\"{k}\":\"{v}\"")).collect();
        format!("{{{}}}", pairs.join(","))
    }
}

struct CsvSerializer;
impl Serializer for CsvSerializer {
    fn serialize(&self, data: &[(&str, &str)]) -> String {
        let keys: Vec<&str> = data.iter().map(|(k, _)| *k).collect();
        let vals: Vec<&str> = data.iter().map(|(_, v)| *v).collect();
        format!("{}\n{}", keys.join(","), vals.join(","))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn json_serializer_output() {
        let r = SerializerRegistry::defaults();
        let s = r.create("json").unwrap();
        let out = s.serialize(&[("name", "Alice")]);
        assert!(out.contains("Alice"));
    }

    #[test]
    fn unknown_key_returns_err() {
        let r = SerializerRegistry::defaults();
        assert!(r.create("yaml").is_err());
    }
}
`,
          },
        ],
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
      classDiagramSvg: {
        type: "mermaid",
        content: `classDiagram
  class LoggerFactory {
    <<type alias>>
    () Logger
  }
  class Logger {
    <<interface>>
    +log(message) void
  }
  class ConsoleLogger {
    -prefix: string
    +log(message) void
  }
  class CloudLogger {
    -url: string
    +log(message) void
  }
  class FileLogger {
    -path: string
    +log(message) void
  }
  LoggerFactory ..> Logger : produces
  Logger <|.. ConsoleLogger
  Logger <|.. CloudLogger
  Logger <|.. FileLogger`,
      },
      diagramExplanation:
        "There is no Creator class — the factory IS a function (a first-class value). LoggerFactory is a type alias for a callable that returns a Logger. Factory selection becomes function composition: pass different factory functions to the same consumer.",
      codeFiles: {
        Python: [
          {
            name: "functional_factory.py",
            dir: "functional/",
            content: `from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Callable
from dataclasses import dataclass
import datetime


class Logger(ABC):
    @abstractmethod
    def log(self, message: str) -> None: ...


# ─── Concrete Loggers ──────────────────────────────────────────────────────

class ConsoleLogger(Logger):
    def __init__(self, prefix: str = "LOG") -> None:
        self._prefix = prefix

    def log(self, message: str) -> None:
        ts = datetime.datetime.utcnow().isoformat()
        print(f"[{self._prefix}][{ts}] {message}")


class FileLogger(Logger):
    def __init__(self, path: str) -> None:
        self._path = path

    def log(self, message: str) -> None:
        ts = datetime.datetime.utcnow().isoformat()
        with open(self._path, "a") as f:
            f.write(f"[{ts}] {message}\\n")


class CloudLogger(Logger):
    def __init__(self, service_url: str, api_key: str) -> None:
        self._url = service_url
        self._key = api_key

    def log(self, message: str) -> None:
        # In real code: httpx.post(self._url, json={"msg": message}, headers={"X-API-Key": self._key})
        print(f"[CLOUD → {self._url}] {message}")


# ─── Factory type & closures ───────────────────────────────────────────────

# The factory IS just a type alias for a callable.
LoggerFactory = Callable[[], Logger]


def console_logger_factory(prefix: str = "APP") -> LoggerFactory:
    """Returns a factory closure — captures prefix via closure."""
    return lambda: ConsoleLogger(prefix)


def file_logger_factory(path: str) -> LoggerFactory:
    return lambda: FileLogger(path)


def cloud_logger_factory(url: str, api_key: str) -> LoggerFactory:
    return lambda: CloudLogger(url, api_key)


# ─── Consumer — depends only on the factory type ───────────────────────────

def create_and_log(factory: LoggerFactory, message: str) -> None:
    """
    Depends on the factory callable, not on any concrete Logger class.
    Testing: pass a lambda that returns a mock — no subclassing required.
    """
    logger = factory()
    logger.log(message)


if __name__ == "__main__":
    # Swap factories without touching create_and_log
    create_and_log(console_logger_factory("API"),  "Service started")
    create_and_log(console_logger_factory("AUDIT"), "User login: alice")

    # Cloud factory — configuration via closure
    cloud = cloud_logger_factory("https://logs.example.com", "secret")
    create_and_log(cloud, "Payment processed")

    # Inline factory — trivial to compose at the call site
    silent_factory: LoggerFactory = lambda: type(
        "NullLogger", (Logger,), {"log": lambda self, m: None}
    )()
    create_and_log(silent_factory, "This is silenced")
`,
          },
        ],
        Java: [
          {
            name: "FunctionalFactory.java",
            dir: "src/main/java/com/patterns/functional/",
            content: `package com.patterns.functional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.function.Supplier;

/**
 * Functional Factory Method — the factory IS a Supplier<Logger>.
 *
 * Java's Supplier<T> makes a natural factory type.
 * No Creator class hierarchy required; factory selection is just
 * variable assignment or method argument passing.
 *
 * See: Effective Java, Item 5 (Prefer dependency injection to hardwiring resources)
 */
public final class FunctionalFactory {

    // ─── Logger interface ──────────────────────────────────────────────────

    public interface Logger {
        void log(String message);
    }

    // ─── Concrete loggers ──────────────────────────────────────────────────

    public static class ConsoleLogger implements Logger {
        private final String prefix;
        public ConsoleLogger(String prefix) { this.prefix = prefix; }
        @Override public void log(String msg) {
            System.out.printf("[%s][%s] %s%n", prefix, Instant.now(), msg);
        }
    }

    public static class FileLogger implements Logger {
        private final Path path;
        public FileLogger(Path path) { this.path = path; }
        @Override public void log(String msg) {
            try {
                Files.writeString(path, "[" + Instant.now() + "] " + msg + "\n",
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // ─── Factory builders (return Supplier<Logger>) ────────────────────────

    public static Supplier<Logger> consoleLoggerFactory(String prefix) {
        return () -> new ConsoleLogger(prefix);
    }

    public static Supplier<Logger> fileLoggerFactory(Path path) {
        return () -> new FileLogger(path);
    }

    // ─── Consumer — depends only on Supplier<Logger> ──────────────────────

    public static void createAndLog(Supplier<Logger> factory, String message) {
        Logger logger = factory.get();
        logger.log(message);
    }

    public static void main(String[] args) {
        createAndLog(consoleLoggerFactory("API"),   "Server started");
        createAndLog(consoleLoggerFactory("AUDIT"), "User login");

        // Inline lambda factory — no class needed
        Supplier<Logger> noopFactory = () -> msg -> {};  // silent logger
        createAndLog(noopFactory, "This is silenced");
    }
}
`,
          },
        ],
        TypeScript: [
          {
            name: "functional-factory.ts",
            dir: "src/functional/",
            content: `/**
 * Functional Factory Method — the factory is a plain function reference.
 * No class hierarchy; factory selection = assigning/passing functions.
 */

export interface Logger {
  log(message: string): void;
}

// ─── Factory type ─────────────────────────────────────────────────────────

export type LoggerFactory = () => Logger;

// ─── Concrete loggers ─────────────────────────────────────────────────────

class ConsoleLogger implements Logger {
  constructor(private readonly prefix: string) {}
  log(msg: string): void { console.log(\`[\${this.prefix}][\${new Date().toISOString()}] \${msg}\`); }
}

class CloudLogger implements Logger {
  constructor(private readonly url: string) {}
  log(msg: string): void { console.log(\`[CLOUD → \${this.url}] \${msg}\`); }
}

// ─── Factory builders (closures) ──────────────────────────────────────────

export const consoleLoggerFactory = (prefix: string): LoggerFactory =>
  () => new ConsoleLogger(prefix);

export const cloudLoggerFactory = (url: string): LoggerFactory =>
  () => new CloudLogger(url);

// ─── Consumer — only depends on LoggerFactory ─────────────────────────────

export function createAndLog(factory: LoggerFactory, message: string): void {
  const logger = factory();
  logger.log(message);
}

// Usage
createAndLog(consoleLoggerFactory("APP"),   "Application started");
createAndLog(cloudLoggerFactory("https://logs.example.com"), "User login");

// Testing — pass a mock factory inline, no subclassing
const messages: string[] = [];
const captureFactory: LoggerFactory = () => ({ log: (m) => messages.push(m) });
createAndLog(captureFactory, "captured");
console.log("Captured:", messages);
`,
          },
        ],
        Go: [
          {
            name: "functional.go",
            dir: "functional/",
            content: `// functional/functional.go — Functional Factory Method in Go.
// In Go, a function type IS the factory type — no creator struct needed.
package functional

import (
	"fmt"
	"time"
)

type Logger interface {
	Log(message string)
}

// LoggerFactory is a function type — the factory itself.
type LoggerFactory func() Logger

// ─── Concrete loggers ────────────────────────────────────────────────────

type consoleLogger struct{ prefix string }

func (l *consoleLogger) Log(msg string) {
	fmt.Printf("[%s][%s] %s\n", l.prefix, time.Now().Format(time.RFC3339), msg)
}

type cloudLogger struct{ url string }

func (l *cloudLogger) Log(msg string) {
	fmt.Printf("[CLOUD → %s] %s\n", l.url, msg)
}

// ─── Factory builder functions ────────────────────────────────────────────

// ConsoleLoggerFactory returns a LoggerFactory closure.
func ConsoleLoggerFactory(prefix string) LoggerFactory {
	return func() Logger { return &consoleLogger{prefix: prefix} }
}

func CloudLoggerFactory(url string) LoggerFactory {
	return func() Logger { return &cloudLogger{url: url} }
}

// ─── Consumer ────────────────────────────────────────────────────────────

func CreateAndLog(factory LoggerFactory, message string) {
	logger := factory()
	logger.Log(message)
}
`,
          },
        ],
        Rust: [
          {
            name: "functional.rs",
            dir: "src/",
            content: `//! Functional Factory Method in Rust.
//! A factory is a Fn() -> Box<dyn Logger> — a closure or function pointer.

pub trait Logger {
    fn log(&self, message: &str);
}

/// The factory type is an ordinary Fn trait object.
pub type LoggerFactory = Box<dyn Fn() -> Box<dyn Logger>>;

// ─── Concrete loggers ─────────────────────────────────────────────────────

pub struct ConsoleLogger {
    prefix: String,
}

impl Logger for ConsoleLogger {
    fn log(&self, msg: &str) {
        println!("[{}] {}", self.prefix, msg);
    }
}

pub struct CloudLogger {
    url: String,
}

impl Logger for CloudLogger {
    fn log(&self, msg: &str) {
        println!("[CLOUD → {}] {}", self.url, msg);
    }
}

// ─── Factory builders (return closures) ───────────────────────────────────

pub fn console_logger_factory(prefix: &str) -> LoggerFactory {
    let p = prefix.to_string();
    Box::new(move || Box::new(ConsoleLogger { prefix: p.clone() }) as Box<dyn Logger>)
}

pub fn cloud_logger_factory(url: &str) -> LoggerFactory {
    let u = url.to_string();
    Box::new(move || Box::new(CloudLogger { url: u.clone() }) as Box<dyn Logger>)
}

// ─── Consumer — depends only on the LoggerFactory type ────────────────────

pub fn create_and_log(factory: &LoggerFactory, message: &str) {
    let logger = factory();
    logger.log(message);
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::{Arc, Mutex};

    #[test]
    fn console_factory_produces_logger() {
        let factory = console_logger_factory("TEST");
        let logger = factory();
        logger.log("hello");  // should not panic
    }

    #[test]
    fn custom_factory_captures_messages() {
        let captured: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(vec![]));
        let cap = captured.clone();
        let factory: LoggerFactory = Box::new(move || {
            let c = cap.clone();
            Box::new(CaptureLogger(c)) as Box<dyn Logger>
        });
        create_and_log(&factory, "test message");
        assert_eq!(captured.lock().unwrap()[0], "test message");
    }

    struct CaptureLogger(Arc<Mutex<Vec<String>>>);
    impl Logger for CaptureLogger {
        fn log(&self, msg: &str) { self.0.lock().unwrap().push(msg.to_string()); }
    }
}
`,
          },
        ],
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
    {
      aspect: "Pattern Type",
      detail:
        "Creational — defines an interface for creating an object but lets subclasses (or configuration) decide which class to instantiate.",
    },
    {
      aspect: "Key Benefit",
      detail:
        "Decouples object creation from usage. New product types require only a new factory subclass (or registry entry), not changes to any existing client or creator code.",
      code:
`// ❌ Bad — client hard-codes concrete types; adding CryptoProcessor means touching this file
class PaymentService {
  process(type: string, amount: number) {
    if (type === "stripe")  return new StripeProcessor().charge(amount);
    if (type === "paypal")  return new PayPalProcessor().charge(amount);
    // … edit here every time a new processor is added
  }
}

// ✅ Good — client depends on the abstract factory; new processors need zero changes here
class PaymentService {
  constructor(private readonly factory: PaymentProcessorFactory) {}
  process(amount: number) {
    const processor = this.factory.createProcessor();  // ← factory decides the type
    return processor.charge(amount);
  }
}`,
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Over-engineering with factories when a simple constructor or static factory method would suffice. Every concrete product type adds a class pair (Creator + Product). Ask: will there genuinely be multiple product variants?",
      code:
`// ❌ Over-engineered — only ONE log format will ever exist; a factory adds zero value
abstract class LogFormatterCreator {
  abstract createFormatter(): LogFormatter;
  format(msg: string) { return this.createFormatter().format(msg); }
}
class JsonFormatterCreator extends LogFormatterCreator {
  createFormatter() { return new JsonFormatter(); }
}

// ✅ Simple — just use the class directly; no pattern needed for a single type
class Logger {
  private formatter = new JsonFormatter();
  format(msg: string) { return this.formatter.format(msg); }
}`,
    },
    {
      aspect: "Thread Safety",
      detail:
        "The factory method itself is usually stateless and therefore safe to call from multiple threads. If the factory maintains internal state (e.g., a registry map), protect writes with a mutex/lock. Products created by the factory may still need their own concurrency guarantees.",
      code:
`// Java — thread-safe registry-based factory using ConcurrentHashMap
public final class ProcessorFactory {
    // ConcurrentHashMap: safe concurrent reads, atomic computeIfAbsent
    private static final Map<String, Supplier<Processor>> REGISTRY =
        new ConcurrentHashMap<>();

    public static void register(String key, Supplier<Processor> fn) {
        REGISTRY.put(key, fn);  // atomic put; safe from multiple threads
    }

    public static Processor create(String key) {
        var fn = REGISTRY.get(key);  // lock-free read after first put
        if (fn == null) throw new IllegalArgumentException("Unknown: " + key);
        return fn.get();  // each call creates a fresh, independently-safe instance
    }
}`,
    },
    {
      aspect: "Best Approach",
      detail:
        "Match the variant to your context: Classic (abstract subclass) for frameworks, Parameterized for simple apps with a fixed set of types, Registry for plugin/extensible systems, Functional (closure) for FP-friendly languages or dependency injection.",
      code:
`// Classic — framework wires in the right factory subclass at startup
interface ReportCreator { createReport(): Report; }
class PdfReportCreator  implements ReportCreator { createReport() { return new PdfReport(); } }
class XlsxReportCreator implements ReportCreator { createReport() { return new XlsxReport(); } }

// Parameterized — small app; type known at call site
function createReport(type: "pdf" | "xlsx"): Report {
  return type === "pdf" ? new PdfReport() : new XlsxReport();
}

// Registry — plugin system; new formats added without touching existing code
const registry = new Map<string, () => Report>();
registry.set("pdf",  () => new PdfReport());
registry.set("xlsx", () => new XlsxReport());
// consumer:
const report = registry.get(userChoice)?.();

// Functional — DI / FP; factory is just a Supplier<Report>
type ReportFactory = () => Report;
function generateAndSave(factory: ReportFactory, path: string) {
  const report = factory();
  report.save(path);
}
generateAndSave(() => new PdfReport(), "/tmp/report.pdf");`,
    },
    {
      aspect: "When to Use",
      detail:
        "Apply Factory Method when object creation must be deferred to subclasses or configuration, when the exact type is not known at compile time, or when creation logic is complex enough to warrant encapsulation.",
      items: [
        {
          title: "Framework Extensibility",
          description:
            "Frameworks (ORMs, UI toolkits, report generators) define the algorithm and defer product creation to subclasses. Application code provides the factory subclass; the framework never needs to change.",
        },
        {
          title: "Plugin / Extensible Architectures",
          description:
            "When third-party modules must contribute new product types at runtime without modifying the core system. A Registry-Based Factory Method lets plugins register their factories under a key.",
        },
        {
          title: "Complex Creation Logic",
          description:
            "When constructing a product involves non-trivial steps — reading config, establishing connections, composing sub-objects — a factory method encapsulates that complexity and keeps client code clean.",
        },
        {
          title: "Testing and Dependency Injection",
          description:
            "Injecting a factory (rather than instantiating products inline) lets tests pass a mock factory that returns test doubles — no subclassing or monkey-patching required.",
        },
        {
          title: "Cross-Platform / Multi-Channel Products",
          description:
            "When the same logical product (notification, renderer, payment processor) has different concrete implementations per platform, environment, or configuration, a factory method isolates the selection logic.",
        },
        {
          title: "Open/Closed Compliance",
          description:
            "When you expect frequent additions of new product types and want to guarantee that existing creators and clients are never modified — only new factory subclasses or registry entries are added.",
        },
      ],
      code:
`// ✅ Framework use case — ReportGenerator owns the algorithm; subclass picks the product
abstract class ReportGenerator {
  // Template method — never changes
  generateAndDeliver(config: ReportConfig): void {
    const report = this.createReport(config);      // ← factory method called here
    report.render();
    report.validate();
    this.deliver(report, config.destination);
  }

  // Factory method — subclass decides the concrete type
  protected abstract createReport(config: ReportConfig): Report;

  private deliver(report: Report, dest: string): void { /* send via email / S3 / FTP */ }
}

// Application wire-up: subclass provides the product type — framework unchanged
class PdfReportGenerator extends ReportGenerator {
  protected createReport(config: ReportConfig): Report {
    return new PdfReport(config.locale, config.pageSize);
  }
}

class XlsxReportGenerator extends ReportGenerator {
  protected createReport(config: ReportConfig): Report {
    return new XlsxReport(config.locale, config.sheetLimit);
  }
}`,
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Avoid Factory Method when the overhead of a creator hierarchy outweighs the benefit — primarily when there is only one product type, creation is trivial, or types are fixed and will never grow.",
      items: [
        {
          title: "Single Product Type",
          description:
            "When there is only one implementation and no realistic expectation of alternatives, a factory hierarchy adds boilerplate with zero benefit. Use a constructor or static factory method directly.",
        },
        {
          title: "Trivial Construction",
          description:
            "If creating an object is just `new Foo()` with no conditional logic or configuration, a factory method is unnecessary indirection. Don't add abstractions that carry no complexity.",
        },
        {
          title: "Stable, Closed Type Sets",
          description:
            "When the set of product types is small, fixed, and will never grow (e.g., a boolean flag, an enum with two values), a simple switch or ternary is more readable than a factory hierarchy.",
        },
        {
          title: "Performance-Critical Inner Loops",
          description:
            "In tight loops processing millions of objects per second, virtual dispatch through factory methods may add measurable overhead. Profile first; consider inlining or struct-of-arrays layouts.",
        },
        {
          title: "When DI Already Handles It",
          description:
            "If a dependency injection container (Spring, Dagger, Wire) is already managing object creation and lifecycle, adding manual factory methods is redundant and creates a parallel, inconsistent system.",
        },
        {
          title: "Stateless Services",
          description:
            "Pure, stateless services with no configuration or variant behavior don't need factories. Create them directly or let the DI container manage them as singletons.",
        },
      ],
      code:
`// ❌ Over-abstracted — fixed two-type enum; factory adds no value
abstract class ThemeCreator {
  abstract createTheme(): Theme;
}
class LightThemeCreator extends ThemeCreator { createTheme() { return new LightTheme(); } }
class DarkThemeCreator  extends ThemeCreator { createTheme() { return new DarkTheme();  } }
// 4 classes, 2 files, zero extensibility benefit

// ✅ Simple switch is clear and complete — no abstraction needed
function createTheme(mode: "light" | "dark"): Theme {
  return mode === "dark" ? new DarkTheme() : new LightTheme();
}

// ❌ Factory when DI already handles it — manual factory duplicates Spring's lifecycle
@Component
class OrderProcessorFactory {
  @Autowired private StripeProcessor stripeProcessor;
  @Autowired private PayPalProcessor paypalProcessor;
  public Processor create(String type) { ... }
}

// ✅ Let Spring inject the right implementation directly via qualifier or condition
@Service @ConditionalOnProperty(name="payment.provider", havingValue="stripe")
class StripeOrderService implements OrderService { ... }`,
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (creates families of related products; Factory Method is often used inside), Template Method (factory method is the hook point in a template method), Prototype (alternative when cloning is cheaper than subclassing), Strategy (factory methods can select and return strategies).",
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

  references: [
    {
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Gamma, Helm, Johnson & Vlissides (Gang of Four)",
      year: 1994,
      type: "Book",
      description:
        "The original GoF book that introduced Factory Method (Chapter 3: Creational Patterns, pp. 107–116). Defines intent ('Define an interface for creating an object, but let subclasses decide which class to instantiate'), applicability, structure, participants, collaborations, consequences, and implementation notes. The foundation for all modern treatments of the pattern.",
    },
    {
      title: "Effective Java, 3rd Edition — Item 1: Consider static factory methods instead of constructors",
      author: "Joshua Bloch",
      year: 2018,
      type: "Book",
      description:
        "Bloch explains the five advantages of static factory methods over public constructors: they have names, they need not create a new object on each invocation, they can return a subtype, the returned class can vary by call, and the class of the returned object need not exist when the factory is written. The standard reference for Item 1 of effective API design.",
    },
    {
      title: "Patterns Hatching: Design Patterns Applied",
      author: "John Vlissides",
      year: 1998,
      type: "Book",
      description:
        "Vlissides (one of the original GoF) examines practical application of design patterns including Factory Method. Essential for understanding intent vs. implementation, and when the pattern adds value vs. when it over-complicates code.",
    },
    {
      title: "Head First Design Patterns, 2nd Edition — Chapter 4: The Factory Pattern",
      author: "Eric Freeman & Elisabeth Robson",
      year: 2020,
      type: "Book",
      description:
        "An accessible deep-dive into Factory Method and Abstract Factory, illustrating the 'Dependency Inversion Principle' and why depending on abstractions (not concrete classes) is the motivating force behind both patterns. Includes the pizza factory walk-through that has become the canonical teaching example.",
    },
    {
      title: "Factory Method — Refactoring Guru",
      author: "Alexander Shvets",
      type: "Web",
      url: "https://refactoring.guru/design-patterns/factory-method",
      description:
        "A thorough illustrated reference covering Factory Method intent, structure, applicability, pros/cons, and code examples in C++, C#, Go, Java, PHP, Python, Ruby, Rust, Swift, and TypeScript. The structure diagram clearly shows the Creator/Product/ConcreteCreator/ConcreteProduct four-class shape of the pattern.",
    },
    {
      title: "Calendar.getInstance() — Java SE Documentation",
      author: "Oracle",
      type: "Documentation",
      url: "https://docs.oracle.com/en/java/docs/api/java.base/java/util/Calendar.html#getInstance()",
      description:
        "The canonical Factory Method in the Java standard library. Calendar.getInstance() returns a subclass appropriate to the current locale (GregorianCalendar, BuddhistCalendar, JapaneseImperialCalendar), demonstrating the pattern in production code used by billions of JVM applications.",
    },
    {
      title: "Iterator — Java SE Documentation (java.util.Collection.iterator())",
      author: "Oracle",
      type: "Documentation",
      url: "https://docs.oracle.com/en/java/docs/api/java.base/java/util/Collection.html#iterator()",
      description:
        "Collection.iterator() is a Factory Method: the Collection interface declares the factory, and each concrete collection (ArrayList, LinkedList, TreeSet) provides its own concrete iterator. A real-world factory method that ships in every Java runtime.",
    },
    {
      title: "Dependency Inversion Principle (DIP) — Robert C. Martin",
      author: "Robert C. Martin",
      year: 1996,
      type: "Article",
      description:
        "The fifth of the SOLID principles: high-level modules should not depend on low-level modules; both should depend on abstractions. Factory Method is one of the structural ways to achieve DIP — the client depends on the Creator abstraction, not on any ConcreteProduct. The DIP is the formal justification for why Factory Method patterns improve maintainability.",
    },
  ],
};

export default factoryMethodData;
