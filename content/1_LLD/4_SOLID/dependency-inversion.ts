import { PatternData } from "@/lib/patterns/types";

const dependencyInversionData: PatternData = {
  slug: "dependency-inversion",
  categorySlug: "solid",
  categoryLabel: "SOLID",
  title: "Dependency Inversion Principle (DIP)",
  subtitle:
    "High-level modules should not depend on low-level modules — both should depend on abstractions. Abstractions should not depend on details.",

  intent:
    "In traditional layered architectures, high-level business logic depends directly on low-level infrastructure — databases, APIs, file I/O, message brokers. When the database changes from Postgres to DynamoDB, the business logic must be rewritten. When the email provider changes, the order service breaks.\n\nThe Dependency Inversion Principle flips this relationship: the high-level module defines an abstract interface (port), and the low-level module implements it (adapter). The core business logic becomes portable, testable, and immune to infrastructure changes.\n\nDIP is the foundational principle behind Dependency Injection, Repository Pattern, Strategy Pattern, Hexagonal Architecture, and Clean Architecture. It establishes a clean boundary between 'what' (policy/business rules) and 'how' (mechanism/infrastructure).",

  classDiagramSvg: `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
  <style>
    .dip-box { rx:6; }
    .dip-title { font: bold 11px 'JetBrains Mono', monospace; }
    .dip-member { font: 10px 'JetBrains Mono', monospace; }
    .dip-arr { stroke-width:1.2; fill:none; marker-end:url(#dip-arr); }
    .dip-dash { stroke-dasharray:6,3; }
    .dip-stereo { font: italic 9px 'JetBrains Mono', monospace; }
  </style>
  <defs>
    <marker id="dip-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- OrderService (high-level) -->
  <rect x="160" y="10" width="200" height="60" class="dip-box s-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="dip-title s-diagram-title">OrderService</text>
  <line x1="160" y1="32" x2="360" y2="32" class="s-diagram-line"/>
  <text x="168" y="48" class="dip-member s-diagram-member">-repo: OrderRepository</text>
  <text x="168" y="60" class="dip-member s-diagram-member">+placeOrder(order): string</text>
  <!-- OrderRepository interface -->
  <rect x="30" y="100" width="200" height="55" class="dip-box s-diagram-box"/>
  <text x="130" y="116" text-anchor="middle" class="dip-stereo s-diagram-member">«interface»</text>
  <text x="130" y="128" text-anchor="middle" class="dip-title s-diagram-title">OrderRepository</text>
  <line x1="30" y1="132" x2="230" y2="132" class="s-diagram-line"/>
  <text x="38" y="148" class="dip-member s-diagram-member">+save(order): void</text>
  <!-- Notifier interface -->
  <rect x="290" y="100" width="200" height="55" class="dip-box s-diagram-box"/>
  <text x="390" y="116" text-anchor="middle" class="dip-stereo s-diagram-member">«interface»</text>
  <text x="390" y="128" text-anchor="middle" class="dip-title s-diagram-title">Notifier</text>
  <line x1="290" y1="132" x2="490" y2="132" class="s-diagram-line"/>
  <text x="298" y="148" class="dip-member s-diagram-member">+notify(userId, msg): void</text>
  <!-- PostgresOrderRepo -->
  <rect x="10" y="200" width="180" height="45" class="dip-box s-diagram-box"/>
  <text x="100" y="218" text-anchor="middle" class="dip-title s-diagram-title">PostgresOrderRepo</text>
  <line x1="10" y1="222" x2="190" y2="222" class="s-diagram-line"/>
  <text x="18" y="238" class="dip-member s-diagram-member">+save(order): void</text>
  <!-- EmailNotifier -->
  <rect x="270" y="200" width="150" height="45" class="dip-box s-diagram-box"/>
  <text x="345" y="218" text-anchor="middle" class="dip-title s-diagram-title">EmailNotifier</text>
  <line x1="270" y1="222" x2="420" y2="222" class="s-diagram-line"/>
  <text x="278" y="238" class="dip-member s-diagram-member">+notify(userId, msg): void</text>
  <!-- Arrows -->
  <line x1="220" y1="70" x2="150" y2="100" class="dip-arr dip-dash s-diagram-arrow"/>
  <line x1="300" y1="70" x2="370" y2="100" class="dip-arr dip-dash s-diagram-arrow"/>
  <line x1="100" y1="200" x2="120" y2="155" class="dip-arr s-diagram-arrow"/>
  <line x1="345" y1="200" x2="380" y2="155" class="dip-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "OrderService (high-level business logic) depends on abstractions — OrderRepository and Notifier interfaces — not on concrete classes. PostgresOrderRepo and EmailNotifier (low-level infrastructure) implement those abstractions. The dependency arrows point upward: concrete adapters depend on the abstractions owned by the high-level module. This inversion means business logic is immune to infrastructure changes.",

  diagramComponents: [
    {
      name: "OrderService",
      description:
        "High-level module containing business logic. It depends only on abstract interfaces (OrderRepository, Notifier), never on concrete infrastructure classes. It can be tested with mock implementations.",
    },
    {
      name: "OrderRepository",
      description:
        "An abstraction (port) owned by the high-level module. Defines what persistence operations the business logic needs, without specifying how storage works.",
    },
    {
      name: "Notifier",
      description:
        "An abstraction (port) for sending notifications. The business logic declares it needs to notify users — the implementation decides whether to use email, SMS, or push.",
    },
    {
      name: "PostgresOrderRepo",
      description:
        "A low-level adapter implementing OrderRepository using PostgreSQL. Can be swapped for DynamoDB, MongoDB, or an in-memory implementation without touching OrderService.",
    },
    {
      name: "EmailNotifier",
      description:
        "A low-level adapter implementing Notifier using email. Can be replaced with SNSNotifier or a test stub without modifying business logic.",
    },
  ],

  solutionDetail:
    "**The Problem:** High-level business logic directly instantiates low-level infrastructure classes — PostgresDatabase, KafkaPublisher, StripeSettlement. This tight coupling means changing the database requires rewriting business logic. Unit tests need real infrastructure running.\n\n**The DIP Solution:** Invert the dependency direction using abstractions.\n\n**How It Works:**\n\n1. **Define abstractions (ports)**: The high-level module declares interfaces for what it needs — TradeRepository, EventPublisher, SettlementGateway. These are owned by the domain layer.\n\n2. **Implement adapters**: Low-level modules implement the interfaces — PostgresTradeRepo, KafkaEventPublisher, ACHSettlementGateway. They depend on the abstraction, not vice versa.\n\n3. **Inject dependencies**: At the composition root (main function, DI container), wire concrete implementations to abstractions. The business logic receives its dependencies, it doesn't create them.\n\n4. **Test with fakes**: Inject in-memory or mock implementations for fast, isolated unit tests. No real database, no real message broker.\n\n**Key Insight:** The high-level module *owns* the interface. It defines what it needs. The low-level module adapts to that interface. This is the inversion — traditionally the high-level module adapted to whatever the low-level module provided.",

  characteristics: [
    "Abstraction ownership — the high-level module defines and owns the interfaces",
    "Inversion of control — the framework or composition root decides which implementation to inject",
    "Plug-and-play infrastructure — swap Postgres for DynamoDB, email for SMS, without touching business logic",
    "Testability — inject in-memory or mock implementations for fast unit tests without real infrastructure",
    "Layered boundaries — enforces clean architecture boundaries (domain → ports → adapters)",
    "Compile-time safety — interfaces catch type mismatches before runtime",
    "Composition root — a single place where all dependencies are wired together",
  ],

  useCases: [
    {
      id: 1,
      title: "Trade Execution Service",
      domain: "Fintech",
      description:
        "A trade service depends on TradeRepository, EventPublisher, and SettlementGateway abstractions instead of directly using PostgresDatabase, KafkaPublisher, and StripeSettlement.",
      whySingleton:
        "Changing from Postgres to DynamoDB shouldn't require rewriting trade execution logic. Unit tests should run in milliseconds with in-memory implementations, not require a running database cluster.",
      code: `interface TradeRepository { save(trade): void; findById(id): Trade }
interface EventPublisher { publish(event, payload): void }
interface SettlementGateway { settle(trade): SettlementId }
class TradeService {
  constructor(repo: TradeRepository, pub: EventPublisher, stl: SettlementGateway) {}
  executeTrade(trade) { this.repo.save(trade); this.pub.publish(...); this.stl.settle(trade) }
}`,
    },
    {
      id: 2,
      title: "Patient Notification System",
      domain: "Healthcare",
      description:
        "A patient notification service depends on PatientRepository, NotificationChannel, and TemplateRenderer abstractions. Email, SMS, and push implementations are injected at runtime.",
      whySingleton:
        "HIPAA compliance may require changing notification providers. Test environments shouldn't send real SMS messages. Swapping from Twilio to AWS SNS should be a configuration change, not a code change.",
      code: `interface PatientRepository { findById(id): Patient }
interface NotificationChannel { send(to, subject, body): boolean }
interface TemplateRenderer { render(template, ctx): string }
class NotificationService {
  constructor(repo: PatientRepository, channels: Map<string, NotificationChannel>, renderer: TemplateRenderer) {}
}`,
    },
    {
      id: 3,
      title: "Content Management System",
      domain: "Media / Publishing",
      description:
        "A CMS article service depends on ContentStore, MediaStore, and SearchIndex abstractions. The same business logic works with S3, CloudFront, and Elasticsearch or with local filesystem and SQLite.",
      whySingleton:
        "Developers use local filesystem storage; production uses S3. The search index may migrate from Elasticsearch to OpenSearch. Business logic for publishing articles shouldn't change with infrastructure decisions.",
      code: `interface ContentStore { save(article): void; load(id): Article }
interface MediaStore { upload(file): URL; delete(url): void }
interface SearchIndex { index(article): void; search(query): Result[] }
class ArticleService {
  constructor(content: ContentStore, media: MediaStore, search: SearchIndex) {}
  publish(article) { this.content.save(article); this.search.index(article) }
}`,
    },
    {
      id: 4,
      title: "Order Fulfillment Pipeline",
      domain: "E-commerce",
      description:
        "An order fulfillment service depends on InventoryService, PaymentGateway, ShippingProvider, and NotificationService abstractions. Each can be swapped independently.",
      whySingleton:
        "Black Friday may require switching to a backup payment gateway. New shipping providers are added quarterly. The inventory system is migrating from monolith to microservice. Each concern changes at its own pace.",
      code: `interface InventoryService { reserve(items): ReservationId }
interface PaymentGateway { charge(amount, method): ChargeId }
interface ShippingProvider { createShipment(order): TrackingNumber }
class FulfillmentService {
  constructor(inv: InventoryService, pay: PaymentGateway, ship: ShippingProvider) {}
  fulfill(order) { this.inv.reserve(...); this.pay.charge(...); this.ship.createShipment(order) }
}`,
    },
    {
      id: 5,
      title: "Authentication Service",
      domain: "Identity / Security",
      description:
        "An auth service depends on UserStore, PasswordHasher, TokenGenerator, and SessionStore abstractions. bcrypt can be swapped for Argon2, JWT for opaque tokens, Redis for Memcached.",
      whySingleton:
        "Security policy may mandate switching from bcrypt to Argon2. Token format may change from JWT to opaque. Session storage may migrate from Redis to DynamoDB. Each security component evolves independently.",
      code: `interface UserStore { findByEmail(email): User }
interface PasswordHasher { hash(pass): string; verify(pass, hash): boolean }
interface TokenGenerator { generate(user): Token }
interface SessionStore { save(session): void; find(id): Session }
class AuthService {
  constructor(users: UserStore, hasher: PasswordHasher, tokens: TokenGenerator) {}
  login(email, password) { /* validate and issue token */ }
}`,
    },
    {
      id: 6,
      title: "Report Generation Engine",
      domain: "Business Intelligence",
      description:
        "A report engine depends on DataSource, Aggregator, Formatter, and Deliverer abstractions. SQL databases, REST APIs, and CSV files all implement DataSource.",
      whySingleton:
        "Data sources change when migrating analytics databases. Output format changes for different stakeholders (PDF, Excel, HTML). Delivery method changes from email to Slack. The report logic stays the same.",
      code: `interface DataSource { fetch(query): RawData }
interface Aggregator { aggregate(data): Summary }
interface Formatter { format(summary, type): Buffer }
interface Deliverer { deliver(formatted, recipients): void }
class ReportEngine {
  constructor(src: DataSource, agg: Aggregator, fmt: Formatter, del: Deliverer) {}
  generate(query, recipients) { /* orchestrate pipeline */ }
}`,
    },
    {
      id: 7,
      title: "ML Model Serving",
      domain: "Machine Learning / AI",
      description:
        "An ML inference service depends on ModelLoader, FeatureStore, and PredictionLogger abstractions. The model backend (TensorFlow, PyTorch, ONNX) is swappable without changing serving logic.",
      whySingleton:
        "Models are retrained in different frameworks. Feature stores migrate from Redis to Feast. Prediction logging changes from files to streaming. The serving logic — load model, fetch features, predict, log — remains constant.",
      code: `interface ModelLoader { load(modelId): Model }
interface FeatureStore { getFeatures(entityId): Features }
interface PredictionLogger { log(input, output, latency): void }
class InferenceService {
  constructor(loader: ModelLoader, features: FeatureStore, logger: PredictionLogger) {}
  predict(entityId) { /* load, fetch, infer, log */ }
}`,
    },
    {
      id: 8,
      title: "Data Pipeline / ETL",
      domain: "Data Engineering",
      description:
        "An ETL pipeline depends on Extractor, Transformer, Validator, and Loader abstractions. Different source and destination systems are just different adapter implementations.",
      whySingleton:
        "Sources change from MySQL to Kafka streams. Destinations change from data warehouse to data lake. Transformation rules evolve with business requirements. The pipeline orchestration logic stays stable.",
      code: `interface Extractor { extract(config): RawData }
interface Transformer { transform(raw): CleanData }
interface Validator { validate(data): ValidationResult }
interface Loader { load(data, destination): void }
class ETLPipeline {
  constructor(ext: Extractor, trans: Transformer, val: Validator, load: Loader) {}
  run(config) { /* extract → transform → validate → load */ }
}`,
    },
    {
      id: 9,
      title: "Messaging / Chat System",
      domain: "Communication Platform",
      description:
        "A chat service depends on MessageStore, PresenceTracker, PushNotifier, and MediaUploader abstractions. Infrastructure decisions don't affect chat business logic.",
      whySingleton:
        "Message storage may move from Cassandra to ScyllaDB. Presence tracking may switch from Redis pub/sub to WebSocket rooms. Push notification providers change with mobile platform updates.",
      code: `interface MessageStore { save(msg): void; getHistory(channelId): Message[] }
interface PresenceTracker { setOnline(userId): void; isOnline(userId): boolean }
interface PushNotifier { push(userId, payload): void }
class ChatService {
  constructor(store: MessageStore, presence: PresenceTracker, push: PushNotifier) {}
  sendMessage(from, to, text) { /* save, check presence, push if offline */ }
}`,
    },
    {
      id: 10,
      title: "CI/CD Deployment Service",
      domain: "DevOps",
      description:
        "A deployment service depends on ArtifactStore, InfraProvider, HealthChecker, and RollbackStrategy abstractions. Deploying to Kubernetes vs ECS vs bare-metal is an adapter swap.",
      whySingleton:
        "Infrastructure may migrate from ECS to Kubernetes. Artifact storage may change from S3 to Artifactory. Health check strategies differ per environment. The deployment orchestration logic remains the same.",
      code: `interface ArtifactStore { fetch(version): Artifact }
interface InfraProvider { deploy(artifact, env): DeploymentId }
interface HealthChecker { check(deploymentId): HealthStatus }
interface RollbackStrategy { rollback(deploymentId): void }
class DeploymentService {
  constructor(store: ArtifactStore, infra: InfraProvider, health: HealthChecker) {}
  deploy(version, env) { /* fetch → deploy → health check → rollback if unhealthy */ }
}`,
    },
    {
      id: 11,
      title: "Compliance / Audit System",
      domain: "Regulatory / Legal",
      description:
        "A compliance engine depends on RuleRepository, TransactionFetcher, AlertDispatcher, and ReportFiler abstractions. Regulatory rule sources and filing destinations are pluggable.",
      whySingleton:
        "Compliance rules come from different regulatory bodies with different APIs. Alert destinations change between internal dashboards and external regulators. Filing formats change per jurisdiction.",
      code: `interface RuleRepository { getRules(jurisdiction): Rule[] }
interface TransactionFetcher { fetch(dateRange): Transaction[] }
interface AlertDispatcher { dispatch(alert): void }
interface ReportFiler { file(report, jurisdiction): FilingId }
class ComplianceEngine {
  constructor(rules: RuleRepository, txns: TransactionFetcher, alerts: AlertDispatcher) {}
  runAudit(dateRange) { /* fetch → evaluate → alert → file */ }
}`,
    },
    {
      id: 12,
      title: "Game Engine Systems",
      domain: "Gaming / Simulation",
      description:
        "A game engine depends on Renderer, PhysicsEngine, AudioSystem, and InputHandler abstractions. The same game logic runs with OpenGL, Vulkan, or a test renderer.",
      whySingleton:
        "Rendering backends change per platform (OpenGL on mobile, Vulkan on desktop). Physics engines may be swapped for accuracy vs performance. Audio systems differ per platform. Game logic stays platform-independent.",
      code: `interface Renderer { draw(scene): void; resize(w, h): void }
interface PhysicsEngine { step(dt): void; addBody(body): void }
interface AudioSystem { play(sound): void; setVolume(level): void }
interface InputHandler { poll(): InputEvent[] }
class GameLoop {
  constructor(renderer: Renderer, physics: PhysicsEngine, audio: AudioSystem) {}
  tick(dt) { this.physics.step(dt); /* update logic */; this.renderer.draw(scene) }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Trade Execution Service",
      domain: "Fintech",
      problem:
        "A trade execution service directly instantiates PostgresTradeRepo, KafkaEventPublisher, and ACHSettlementGateway — making it impossible to unit-test without live infrastructure and tightly coupling business logic to specific vendors.",
      solution:
        "Depend on TradeRepository, EventPublisher, and SettlementGateway abstractions. Inject concrete implementations (Postgres, Kafka, ACH) at the composition root. In-memory fakes enable fast, isolated unit tests.",
      classDiagramSvg: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="160" y="5" width="160" height="35" rx="6" class="s-diagram-box"/>
  <text x="240" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">TradeExecutionService</text>
  <rect x="5" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="75" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» TradeRepo</text>
  <rect x="165" y="80" width="150" height="30" rx="6" class="s-diagram-box"/>
  <text x="240" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» EventPublisher</text>
  <rect x="335" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="405" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Settlement</text>
  <rect x="5" y="140" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="75" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">PostgresTradeRepo</text>
  <rect x="165" y="140" width="150" height="30" rx="6" class="s-diagram-box"/>
  <text x="240" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">KafkaEventPublisher</text>
  <rect x="335" y="140" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="405" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">ACHSettlement</text>
  <line x1="200" y1="40" x2="75" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="240" y1="40" x2="240" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="280" y1="40" x2="405" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="75" y1="140" x2="75" y2="110" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="240" y1="140" x2="240" y2="110" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="405" y1="140" x2="405" y2="110" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Abstractions should be owned by the high-level trade module, not the infrastructure layer",
        "In-memory fakes enable sub-second test suites for critical financial logic",
        "New settlement providers (wire, crypto) are added without touching execution logic",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Trade:
    id: str
    symbol: str
    quantity: int
    price: float
    side: str  # "BUY" or "SELL"
    status: str = "PENDING"
    executed_at: Optional[datetime] = None


# ✅ Abstractions (ports) — owned by the domain
class TradeRepository(ABC):
    @abstractmethod
    def save(self, trade: Trade) -> None: ...
    @abstractmethod
    def find_by_id(self, trade_id: str) -> Optional[Trade]: ...


class EventPublisher(ABC):
    @abstractmethod
    def publish(self, event_type: str, payload: dict) -> None: ...


class SettlementGateway(ABC):
    @abstractmethod
    def initiate_settlement(self, trade: Trade) -> str: ...


# ✅ High-level service — depends only on abstractions
class TradeService:
    def __init__(
        self,
        repo: TradeRepository,
        publisher: EventPublisher,
        settlement: SettlementGateway,
    ):
        self.repo = repo
        self.publisher = publisher
        self.settlement = settlement

    def execute_trade(self, trade: Trade) -> str:
        if trade.quantity <= 0:
            raise ValueError("Quantity must be positive")
        trade.status = "EXECUTED"
        trade.executed_at = datetime.now()
        self.repo.save(trade)
        self.publisher.publish("trade.executed", {
            "trade_id": trade.id, "symbol": trade.symbol,
            "quantity": trade.quantity, "price": trade.price,
        })
        return self.settlement.initiate_settlement(trade)


# ✅ Concrete adapters
class PostgresTradeRepo(TradeRepository):
    def __init__(self):
        self.storage: dict[str, Trade] = {}

    def save(self, trade: Trade) -> None:
        self.storage[trade.id] = trade
        print(f"[Postgres] Saved trade {trade.id}")

    def find_by_id(self, trade_id: str) -> Optional[Trade]:
        return self.storage.get(trade_id)


class KafkaEventPublisher(EventPublisher):
    def publish(self, event_type: str, payload: dict) -> None:
        print(f"[Kafka] Published {event_type}: {payload}")


class ACHSettlementGateway(SettlementGateway):
    def initiate_settlement(self, trade: Trade) -> str:
        settlement_id = f"STL-{trade.id}"
        total = trade.quantity * trade.price
        print(f"[ACH] Initiated \${total:.2f} settlement: {settlement_id}")
        return settlement_id


# ✅ In-memory fakes for testing
class InMemoryTradeRepo(TradeRepository):
    def __init__(self):
        self.trades: dict[str, Trade] = {}
    def save(self, trade: Trade) -> None:
        self.trades[trade.id] = trade
    def find_by_id(self, trade_id: str) -> Optional[Trade]:
        return self.trades.get(trade_id)


class FakePublisher(EventPublisher):
    def __init__(self):
        self.events: list[tuple[str, dict]] = []
    def publish(self, event_type: str, payload: dict) -> None:
        self.events.append((event_type, payload))


class FakeSettlement(SettlementGateway):
    def initiate_settlement(self, trade: Trade) -> str:
        return f"FAKE-STL-{trade.id}"


# Composition root — production
service = TradeService(PostgresTradeRepo(), KafkaEventPublisher(), ACHSettlementGateway())
trade = Trade(id="T-001", symbol="AAPL", quantity=100, price=150.0, side="BUY")
service.execute_trade(trade)

# Composition root — testing
test_repo = InMemoryTradeRepo()
test_pub = FakePublisher()
test_svc = TradeService(test_repo, test_pub, FakeSettlement())
test_svc.execute_trade(Trade(id="T-TEST", symbol="GOOG", quantity=10, price=140.0, side="BUY"))
assert "T-TEST" in test_repo.trades
assert len(test_pub.events) == 1
print("Tests passed!")`,
        Go: `package main

import "fmt"

// Abstractions (ports)
type TradeRepository interface {
	Save(trade Trade)
	FindByID(id string) *Trade
}

type EventPublisher interface {
	Publish(eventType string, payload map[string]interface{})
}

type SettlementGateway interface {
	InitiateSettlement(trade Trade) string
}

type Trade struct {
	ID, Symbol, Side, Status string
	Quantity                 int
	Price                    float64
}

// High-level service depends on abstractions
type TradeService struct {
	Repo       TradeRepository
	Publisher  EventPublisher
	Settlement SettlementGateway
}

func (s *TradeService) ExecuteTrade(trade *Trade) string {
	trade.Status = "EXECUTED"
	s.Repo.Save(*trade)
	s.Publisher.Publish("trade.executed", map[string]interface{}{
		"trade_id": trade.ID, "symbol": trade.Symbol,
	})
	return s.Settlement.InitiateSettlement(*trade)
}

// Concrete adapters
type InMemoryRepo struct{ Trades map[string]Trade }

func (r *InMemoryRepo) Save(t Trade)             { r.Trades[t.ID] = t }
func (r *InMemoryRepo) FindByID(id string) *Trade {
	t, ok := r.Trades[id]
	if !ok { return nil }
	return &t
}

type ConsolePublisher struct{}

func (p *ConsolePublisher) Publish(e string, payload map[string]interface{}) {
	fmt.Printf("[Event] %s: %v\\n", e, payload)
}

type FakeSettlement struct{}

func (s *FakeSettlement) InitiateSettlement(t Trade) string {
	return fmt.Sprintf("STL-%s", t.ID)
}

func main() {
	svc := &TradeService{
		Repo:       &InMemoryRepo{Trades: make(map[string]Trade)},
		Publisher:  &ConsolePublisher{},
		Settlement: &FakeSettlement{},
	}
	trade := &Trade{ID: "T-001", Symbol: "AAPL", Quantity: 100, Price: 150.0, Side: "BUY"}
	stlID := svc.ExecuteTrade(trade)
	fmt.Println("Settlement:", stlID)
}`,
        Java: `import java.util.*;

// Abstractions (ports)
interface TradeRepository {
    void save(Trade trade);
    Trade findById(String id);
}

interface EventPublisher {
    void publish(String eventType, Map<String, Object> payload);
}

interface SettlementGateway {
    String initiateSettlement(Trade trade);
}

class Trade {
    String id, symbol, side, status;
    int quantity;
    double price;

    Trade(String id, String symbol, int quantity, double price, String side) {
        this.id = id; this.symbol = symbol; this.quantity = quantity;
        this.price = price; this.side = side; this.status = "PENDING";
    }
}

// High-level service — depends only on abstractions
class TradeService {
    private final TradeRepository repo;
    private final EventPublisher publisher;
    private final SettlementGateway settlement;

    TradeService(TradeRepository repo, EventPublisher publisher, SettlementGateway settlement) {
        this.repo = repo;
        this.publisher = publisher;
        this.settlement = settlement;
    }

    String executeTrade(Trade trade) {
        trade.status = "EXECUTED";
        repo.save(trade);
        publisher.publish("trade.executed", Map.of("trade_id", trade.id, "symbol", trade.symbol));
        return settlement.initiateSettlement(trade);
    }
}

// Concrete adapters
class InMemoryTradeRepo implements TradeRepository {
    Map<String, Trade> trades = new HashMap<>();
    public void save(Trade t) { trades.put(t.id, t); }
    public Trade findById(String id) { return trades.get(id); }
}

class ConsolePublisher implements EventPublisher {
    public void publish(String e, Map<String, Object> p) {
        System.out.printf("[Event] %s: %s%n", e, p);
    }
}

class FakeSettlement implements SettlementGateway {
    public String initiateSettlement(Trade t) { return "STL-" + t.id; }
}

// Composition root
public class Main {
    public static void main(String[] args) {
        TradeService svc = new TradeService(
            new InMemoryTradeRepo(), new ConsolePublisher(), new FakeSettlement()
        );
        svc.executeTrade(new Trade("T-001", "AAPL", 100, 150.0, "BUY"));
    }
}`,
        TypeScript: `// Abstractions (ports)
interface TradeRepository {
  save(trade: Trade): void;
  findById(id: string): Trade | undefined;
}

interface EventPublisher {
  publish(eventType: string, payload: Record<string, unknown>): void;
}

interface SettlementGateway {
  initiateSettlement(trade: Trade): string;
}

interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  side: "BUY" | "SELL";
  status: string;
}

// High-level service — depends only on abstractions
class TradeService {
  constructor(
    private repo: TradeRepository,
    private publisher: EventPublisher,
    private settlement: SettlementGateway,
  ) {}

  executeTrade(trade: Trade): string {
    trade.status = "EXECUTED";
    this.repo.save(trade);
    this.publisher.publish("trade.executed", {
      tradeId: trade.id, symbol: trade.symbol,
    });
    return this.settlement.initiateSettlement(trade);
  }
}

// In-memory adapter (for testing)
class InMemoryTradeRepo implements TradeRepository {
  trades = new Map<string, Trade>();
  save(t: Trade) { this.trades.set(t.id, t); }
  findById(id: string) { return this.trades.get(id); }
}

class ConsolePublisher implements EventPublisher {
  events: Array<{ type: string; payload: Record<string, unknown> }> = [];
  publish(type: string, payload: Record<string, unknown>) {
    this.events.push({ type, payload });
    console.log(\`[Event] \${type}:\`, payload);
  }
}

class StubSettlement implements SettlementGateway {
  initiateSettlement(trade: Trade) { return \`STL-\${trade.id}\`; }
}

// Composition root
const svc = new TradeService(
  new InMemoryTradeRepo(),
  new ConsolePublisher(),
  new StubSettlement(),
);
svc.executeTrade({
  id: "T-001", symbol: "AAPL", quantity: 100, price: 150, side: "BUY", status: "PENDING",
});`,
        Rust: `use std::collections::HashMap;

trait TradeRepository {
    fn save(&mut self, trade: &Trade);
    fn find_by_id(&self, id: &str) -> Option<&Trade>;
}

trait EventPublisher {
    fn publish(&self, event_type: &str, trade_id: &str);
}

trait SettlementGateway {
    fn initiate_settlement(&self, trade: &Trade) -> String;
}

#[derive(Clone)]
struct Trade {
    id: String,
    symbol: String,
    quantity: i32,
    price: f64,
    side: String,
    status: String,
}

// High-level service
struct TradeService<R: TradeRepository, P: EventPublisher, S: SettlementGateway> {
    repo: R,
    publisher: P,
    settlement: S,
}

impl<R: TradeRepository, P: EventPublisher, S: SettlementGateway> TradeService<R, P, S> {
    fn execute_trade(&mut self, trade: &mut Trade) -> String {
        trade.status = "EXECUTED".to_string();
        self.repo.save(trade);
        self.publisher.publish("trade.executed", &trade.id);
        self.settlement.initiate_settlement(trade)
    }
}

// Concrete adapters
struct InMemoryRepo { trades: HashMap<String, Trade> }

impl TradeRepository for InMemoryRepo {
    fn save(&mut self, trade: &Trade) {
        self.trades.insert(trade.id.clone(), trade.clone());
    }
    fn find_by_id(&self, id: &str) -> Option<&Trade> { self.trades.get(id) }
}

struct ConsolePublisher;
impl EventPublisher for ConsolePublisher {
    fn publish(&self, event_type: &str, trade_id: &str) {
        println!("[Event] {}: {}", event_type, trade_id);
    }
}

struct FakeSettlement;
impl SettlementGateway for FakeSettlement {
    fn initiate_settlement(&self, trade: &Trade) -> String {
        format!("STL-{}", trade.id)
    }
}

fn main() {
    let mut svc = TradeService {
        repo: InMemoryRepo { trades: HashMap::new() },
        publisher: ConsolePublisher,
        settlement: FakeSettlement,
    };
    let mut trade = Trade {
        id: "T-001".into(), symbol: "AAPL".into(), quantity: 100,
        price: 150.0, side: "BUY".into(), status: "PENDING".into(),
    };
    let stl = svc.execute_trade(&mut trade);
    println!("Settlement: {}", stl);
}`,
      },
    },
    {
      id: 2,
      title: "Healthcare — Patient Notification System",
      domain: "Healthcare",
      problem:
        "A patient notification service directly calls SMTP email APIs and Twilio SMS APIs, making it untestable without live services and impossible to add new channels (push, in-app) without modifying core notification logic.",
      solution:
        "Depend on PatientRepository, NotificationChannel, and TemplateRenderer abstractions. Inject email, SMS, and in-memory implementations at the composition root. New channels implement the same contract.",
      classDiagramSvg: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="140" y="5" width="200" height="35" rx="6" class="s-diagram-box"/>
  <text x="240" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">PatientNotificationService</text>
  <rect x="5" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="75" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» PatientRepo</text>
  <rect x="165" y="80" width="150" height="30" rx="6" class="s-diagram-box"/>
  <text x="240" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Channel</text>
  <rect x="335" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="405" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Renderer</text>
  <rect x="80" y="140" width="110" height="30" rx="6" class="s-diagram-box"/>
  <text x="135" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">EmailChannel</text>
  <rect x="210" y="140" width="110" height="30" rx="6" class="s-diagram-box"/>
  <text x="265" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">SMSChannel</text>
  <line x1="200" y1="40" x2="75" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="240" y1="40" x2="240" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="280" y1="40" x2="405" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="135" y1="140" x2="200" y2="110" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="265" y1="140" x2="260" y2="110" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "HIPAA-compliant logging can be injected as a cross-cutting concern via the same abstraction pattern",
        "Channel selection can be driven by patient preferences stored in the repository",
        "Template rendering abstraction enables A/B testing notification content",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class Patient:
    id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    preferred_channel: str


# ✅ Abstractions
class PatientRepository(ABC):
    @abstractmethod
    def find_by_id(self, patient_id: str) -> Optional[Patient]: ...


class NotificationChannel(ABC):
    @abstractmethod
    def send(self, recipient: str, subject: str, body: str) -> bool: ...


class TemplateRenderer(ABC):
    @abstractmethod
    def render(self, template_name: str, context: dict) -> str: ...


# ✅ High-level service — depends on abstractions
class PatientNotificationService:
    def __init__(
        self,
        patient_repo: PatientRepository,
        channels: dict[str, NotificationChannel],
        renderer: TemplateRenderer,
    ):
        self.patient_repo = patient_repo
        self.channels = channels
        self.renderer = renderer

    def notify_patient(self, patient_id: str, template: str, context: dict) -> bool:
        patient = self.patient_repo.find_by_id(patient_id)
        if not patient:
            raise ValueError(f"Patient {patient_id} not found")
        body = self.renderer.render(template, {**context, "patient_name": patient.name})
        channel = self.channels.get(patient.preferred_channel)
        if not channel:
            raise ValueError(f"No channel: {patient.preferred_channel}")
        recipient = patient.email if patient.preferred_channel == "email" else patient.phone
        return channel.send(recipient or "", f"Health Update: {template}", body)


# ✅ Concrete adapters
class InMemoryPatientRepo(PatientRepository):
    def __init__(self, patients: list[Patient]):
        self._patients = {p.id: p for p in patients}
    def find_by_id(self, patient_id: str) -> Optional[Patient]:
        return self._patients.get(patient_id)


class ConsoleEmailChannel(NotificationChannel):
    def __init__(self):
        self.sent: list[dict] = []
    def send(self, recipient: str, subject: str, body: str) -> bool:
        self.sent.append({"to": recipient, "subject": subject})
        print(f"[Email] To: {recipient} | Subject: {subject}")
        return True


class SimpleRenderer(TemplateRenderer):
    def render(self, template_name: str, context: dict) -> str:
        return f"Dear {context.get('patient_name', 'Patient')}, appointment on {context.get('date', 'TBD')}."


# Composition root
patients = [Patient("P-001", "Jane Doe", "jane@example.com", None, "email")]
email_ch = ConsoleEmailChannel()
service = PatientNotificationService(
    InMemoryPatientRepo(patients), {"email": email_ch}, SimpleRenderer(),
)
service.notify_patient("P-001", "appointment_reminder", {"date": "2024-02-15"})`,
        Go: `package main

import "fmt"

// Abstractions
type PatientRepository interface {
	FindByID(id string) *Patient
}

type NotificationChannel interface {
	Send(recipient, subject, body string) bool
}

type Patient struct {
	ID, Name, Email, Phone, PreferredChannel string
}

// High-level service
type PatientNotificationService struct {
	Repo     PatientRepository
	Channels map[string]NotificationChannel
}

func (s *PatientNotificationService) Notify(patientID, subject, body string) bool {
	patient := s.Repo.FindByID(patientID)
	if patient == nil { return false }
	ch, ok := s.Channels[patient.PreferredChannel]
	if !ok { return false }
	recipient := patient.Email
	if patient.PreferredChannel == "sms" { recipient = patient.Phone }
	return ch.Send(recipient, subject, body)
}

// Adapters
type InMemoryRepo struct{ Patients map[string]*Patient }
func (r *InMemoryRepo) FindByID(id string) *Patient { return r.Patients[id] }

type ConsoleEmail struct{}
func (c *ConsoleEmail) Send(to, subject, body string) bool {
	fmt.Printf("[Email] To:%s Subject:%s\\n", to, subject)
	return true
}

func main() {
	repo := &InMemoryRepo{Patients: map[string]*Patient{
		"P-001": {ID: "P-001", Name: "Jane", Email: "jane@ex.com", PreferredChannel: "email"},
	}}
	svc := &PatientNotificationService{
		Repo: repo, Channels: map[string]NotificationChannel{"email": &ConsoleEmail{}},
	}
	svc.Notify("P-001", "Appointment", "Your appointment is tomorrow.")
}`,
        Java: `import java.util.*;

interface PatientRepository {
    Patient findById(String id);
}

interface NotificationChannel {
    boolean send(String recipient, String subject, String body);
}

class Patient {
    String id, name, email, phone, preferredChannel;
    Patient(String id, String name, String email, String phone, String ch) {
        this.id = id; this.name = name; this.email = email;
        this.phone = phone; this.preferredChannel = ch;
    }
}

class PatientNotificationService {
    private final PatientRepository repo;
    private final Map<String, NotificationChannel> channels;

    PatientNotificationService(PatientRepository repo, Map<String, NotificationChannel> channels) {
        this.repo = repo; this.channels = channels;
    }

    boolean notify(String patientId, String subject, String body) {
        Patient p = repo.findById(patientId);
        if (p == null) return false;
        NotificationChannel ch = channels.get(p.preferredChannel);
        if (ch == null) return false;
        String recipient = "email".equals(p.preferredChannel) ? p.email : p.phone;
        return ch.send(recipient, subject, body);
    }
}

class InMemoryPatientRepo implements PatientRepository {
    Map<String, Patient> patients = new HashMap<>();
    public Patient findById(String id) { return patients.get(id); }
}

class ConsoleEmail implements NotificationChannel {
    public boolean send(String to, String subject, String body) {
        System.out.printf("[Email] To:%s Subject:%s%n", to, subject);
        return true;
    }
}`,
        TypeScript: `interface PatientRepository {
  findById(id: string): Patient | undefined;
}

interface NotificationChannel {
  send(recipient: string, subject: string, body: string): boolean;
}

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  preferredChannel: "email" | "sms";
}

class PatientNotificationService {
  constructor(
    private repo: PatientRepository,
    private channels: Map<string, NotificationChannel>,
  ) {}

  notify(patientId: string, subject: string, body: string): boolean {
    const patient = this.repo.findById(patientId);
    if (!patient) return false;
    const ch = this.channels.get(patient.preferredChannel);
    if (!ch) return false;
    const recipient = patient.preferredChannel === "email" ? patient.email : patient.phone;
    if (!recipient) return false;
    return ch.send(recipient, subject, body);
  }
}

class InMemoryPatientRepo implements PatientRepository {
  private patients = new Map<string, Patient>();
  add(p: Patient) { this.patients.set(p.id, p); }
  findById(id: string) { return this.patients.get(id); }
}

class ConsoleEmail implements NotificationChannel {
  send(to: string, subject: string, body: string) {
    console.log(\`[Email] To:\${to} Subject:\${subject}\`);
    return true;
  }
}

const repo = new InMemoryPatientRepo();
repo.add({ id: "P-001", name: "Jane", email: "jane@ex.com", preferredChannel: "email" });
const channels = new Map<string, NotificationChannel>([["email", new ConsoleEmail()]]);
const svc = new PatientNotificationService(repo, channels);
svc.notify("P-001", "Appointment", "Tomorrow at 10am");`,
        Rust: `use std::collections::HashMap;

trait PatientRepository {
    fn find_by_id(&self, id: &str) -> Option<&Patient>;
}

trait NotificationChannel {
    fn send(&self, recipient: &str, subject: &str, body: &str) -> bool;
}

struct Patient {
    id: String,
    name: String,
    email: Option<String>,
    phone: Option<String>,
    preferred_channel: String,
}

struct PatientNotificationService<R: PatientRepository> {
    repo: R,
    channels: HashMap<String, Box<dyn NotificationChannel>>,
}

impl<R: PatientRepository> PatientNotificationService<R> {
    fn notify(&self, patient_id: &str, subject: &str, body: &str) -> bool {
        let patient = match self.repo.find_by_id(patient_id) {
            Some(p) => p,
            None => return false,
        };
        let channel = match self.channels.get(&patient.preferred_channel) {
            Some(ch) => ch,
            None => return false,
        };
        let recipient = if patient.preferred_channel == "email" {
            patient.email.as_deref()
        } else {
            patient.phone.as_deref()
        };
        match recipient {
            Some(r) => channel.send(r, subject, body),
            None => false,
        }
    }
}

struct InMemoryRepo { patients: HashMap<String, Patient> }
impl PatientRepository for InMemoryRepo {
    fn find_by_id(&self, id: &str) -> Option<&Patient> { self.patients.get(id) }
}

struct ConsoleEmail;
impl NotificationChannel for ConsoleEmail {
    fn send(&self, to: &str, subject: &str, _body: &str) -> bool {
        println!("[Email] To:{} Subject:{}", to, subject);
        true
    }
}

fn main() {
    let mut patients = HashMap::new();
    patients.insert("P-001".into(), Patient {
        id: "P-001".into(), name: "Jane".into(),
        email: Some("jane@ex.com".into()), phone: None,
        preferred_channel: "email".into(),
    });
    let mut channels: HashMap<String, Box<dyn NotificationChannel>> = HashMap::new();
    channels.insert("email".into(), Box::new(ConsoleEmail));
    let svc = PatientNotificationService {
        repo: InMemoryRepo { patients }, channels,
    };
    svc.notify("P-001", "Appointment", "Tomorrow at 10am");
}`,
      },
    },
    {
      id: 3,
      title: "E-commerce — Order Fulfillment Pipeline",
      domain: "E-commerce",
      problem:
        "An order fulfillment service hard-codes calls to a specific inventory API, Stripe payment, and FedEx shipping — making regional customization impossible and tightly coupling business orchestration to vendor SDKs.",
      solution:
        "Depend on InventoryService, PaymentGateway, and ShippingProvider abstractions. Swap implementations independently: mock payment in staging, region-specific shipping providers in production.",
      classDiagramSvg: `<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">
  <rect x="140" y="5" width="200" height="35" rx="6" class="s-diagram-box"/>
  <text x="240" y="27" text-anchor="middle" font-size="10" font-weight="bold" class="s-diagram-title">OrderFulfillmentService</text>
  <rect x="5" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="75" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Inventory</text>
  <rect x="165" y="80" width="150" height="30" rx="6" class="s-diagram-box"/>
  <text x="240" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Payment</text>
  <rect x="335" y="80" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="405" y="100" text-anchor="middle" font-size="9" font-weight="bold" class="s-diagram-title">«interface» Shipping</text>
  <rect x="5" y="140" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="75" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">WarehouseInventory</text>
  <rect x="165" y="140" width="150" height="30" rx="6" class="s-diagram-box"/>
  <text x="240" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">StripePayment</text>
  <rect x="335" y="140" width="140" height="30" rx="6" class="s-diagram-box"/>
  <text x="405" y="160" text-anchor="middle" font-size="9" class="s-diagram-title">FedExShipping</text>
  <line x1="200" y1="40" x2="75" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="240" y1="40" x2="240" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="280" y1="40" x2="405" y2="80" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="75" y1="140" x2="75" y2="110" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="240" y1="140" x2="240" y2="110" stroke="currentColor" stroke-dasharray="4"/>
  <line x1="405" y1="140" x2="405" y2="110" stroke="currentColor" stroke-dasharray="4"/>
</svg>`,
      considerations: [
        "Each abstraction is owned by the domain layer, not the infrastructure adapters",
        "Mock payment gateway in staging prevents accidental real charges",
        "Regional shipping providers are swapped via configuration, not code changes",
      ],
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Order:
    id: str
    items: list[dict]
    total: float
    shipping_address: str


# ✅ Abstractions
class InventoryService(ABC):
    @abstractmethod
    def reserve(self, items: list[dict]) -> str: ...
    @abstractmethod
    def release(self, reservation_id: str) -> None: ...


class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, amount: float, method: str) -> str: ...
    @abstractmethod
    def refund(self, charge_id: str) -> None: ...


class ShippingProvider(ABC):
    @abstractmethod
    def create_shipment(self, order: Order) -> str: ...


# ✅ High-level service
class FulfillmentService:
    def __init__(
        self,
        inventory: InventoryService,
        payment: PaymentGateway,
        shipping: ShippingProvider,
    ):
        self.inventory = inventory
        self.payment = payment
        self.shipping = shipping

    def fulfill(self, order: Order, payment_method: str) -> dict:
        reservation_id = self.inventory.reserve(order.items)
        try:
            charge_id = self.payment.charge(order.total, payment_method)
        except Exception:
            self.inventory.release(reservation_id)
            raise
        tracking = self.shipping.create_shipment(order)
        return {
            "order_id": order.id,
            "reservation": reservation_id,
            "charge": charge_id,
            "tracking": tracking,
        }


# ✅ Concrete adapters
class InMemoryInventory(InventoryService):
    def __init__(self):
        self.reservations: dict[str, list] = {}
        self._counter = 0
    def reserve(self, items):
        self._counter += 1
        rid = f"RES-{self._counter:04d}"
        self.reservations[rid] = items
        print(f"[Inventory] Reserved: {rid}")
        return rid
    def release(self, reservation_id):
        self.reservations.pop(reservation_id, None)
        print(f"[Inventory] Released: {reservation_id}")


class StripeGateway(PaymentGateway):
    def charge(self, amount, method):
        charge_id = f"CH-{abs(hash((amount, method))) % 10000:04d}"
        print(f"[Stripe] Charged \${amount:.2f} via {method}: {charge_id}")
        return charge_id
    def refund(self, charge_id):
        print(f"[Stripe] Refunded: {charge_id}")


class FedExShipping(ShippingProvider):
    def create_shipment(self, order):
        tracking = f"FDX-{order.id}"
        print(f"[FedEx] Shipment created: {tracking}")
        return tracking


# Composition root
service = FulfillmentService(InMemoryInventory(), StripeGateway(), FedExShipping())
order = Order("ORD-001", [{"sku": "W-100", "qty": 2}], 59.98, "123 Main St")
result = service.fulfill(order, "credit_card")
print(result)`,
        Go: `package main

import "fmt"

type InventoryService interface {
	Reserve(items []map[string]interface{}) string
	Release(reservationID string)
}

type PaymentGateway interface {
	Charge(amount float64, method string) string
}

type ShippingProvider interface {
	CreateShipment(orderID, address string) string
}

type FulfillmentService struct {
	Inventory InventoryService
	Payment   PaymentGateway
	Shipping  ShippingProvider
}

func (f *FulfillmentService) Fulfill(orderID string, items []map[string]interface{}, total float64, address, method string) map[string]string {
	resID := f.Inventory.Reserve(items)
	chargeID := f.Payment.Charge(total, method)
	tracking := f.Shipping.CreateShipment(orderID, address)
	return map[string]string{"reservation": resID, "charge": chargeID, "tracking": tracking}
}

type InMemoryInventory struct{ counter int }
func (i *InMemoryInventory) Reserve(items []map[string]interface{}) string {
	i.counter++
	return fmt.Sprintf("RES-%04d", i.counter)
}
func (i *InMemoryInventory) Release(id string) {}

type FakePayment struct{}
func (p *FakePayment) Charge(amount float64, method string) string {
	return fmt.Sprintf("CH-%.0f", amount*100)
}

type FakeShipping struct{}
func (s *FakeShipping) CreateShipment(orderID, addr string) string {
	return "TRK-" + orderID
}

func main() {
	svc := &FulfillmentService{&InMemoryInventory{}, &FakePayment{}, &FakeShipping{}}
	result := svc.Fulfill("ORD-001", nil, 59.98, "123 Main St", "card")
	fmt.Println(result)
}`,
        Java: `import java.util.*;

interface InventoryService {
    String reserve(List<Map<String, Object>> items);
    void release(String reservationId);
}

interface PaymentGateway {
    String charge(double amount, String method);
    void refund(String chargeId);
}

interface ShippingProvider {
    String createShipment(String orderId, String address);
}

class FulfillmentService {
    private final InventoryService inventory;
    private final PaymentGateway payment;
    private final ShippingProvider shipping;

    FulfillmentService(InventoryService inv, PaymentGateway pay, ShippingProvider ship) {
        this.inventory = inv; this.payment = pay; this.shipping = ship;
    }

    Map<String, String> fulfill(String orderId, List<Map<String, Object>> items,
                                 double total, String address, String method) {
        String resId = inventory.reserve(items);
        String chargeId = payment.charge(total, method);
        String tracking = shipping.createShipment(orderId, address);
        return Map.of("reservation", resId, "charge", chargeId, "tracking", tracking);
    }
}

class InMemoryInventory implements InventoryService {
    private int counter = 0;
    public String reserve(List<Map<String, Object>> items) {
        return String.format("RES-%04d", ++counter);
    }
    public void release(String id) {}
}

class FakePayment implements PaymentGateway {
    public String charge(double amount, String method) { return "CH-" + (int)(amount * 100); }
    public void refund(String id) {}
}

class FakeShipping implements ShippingProvider {
    public String createShipment(String orderId, String addr) { return "TRK-" + orderId; }
}`,
        TypeScript: `interface InventoryService {
  reserve(items: Array<{ sku: string; qty: number }>): string;
  release(reservationId: string): void;
}

interface PaymentGateway {
  charge(amount: number, method: string): string;
  refund(chargeId: string): void;
}

interface ShippingProvider {
  createShipment(orderId: string, address: string): string;
}

class FulfillmentService {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentGateway,
    private shipping: ShippingProvider,
  ) {}

  fulfill(orderId: string, items: Array<{ sku: string; qty: number }>,
          total: number, address: string, method: string) {
    const resId = this.inventory.reserve(items);
    let chargeId: string;
    try {
      chargeId = this.payment.charge(total, method);
    } catch {
      this.inventory.release(resId);
      throw new Error("Payment failed");
    }
    const tracking = this.shipping.createShipment(orderId, address);
    return { reservation: resId, charge: chargeId, tracking };
  }
}

class InMemoryInventory implements InventoryService {
  private counter = 0;
  private reservations = new Map<string, unknown>();
  reserve(items: Array<{ sku: string; qty: number }>) {
    const id = \`RES-\${String(++this.counter).padStart(4, "0")}\`;
    this.reservations.set(id, items);
    return id;
  }
  release(id: string) { this.reservations.delete(id); }
}

class FakePayment implements PaymentGateway {
  charge(amount: number, method: string) { return \`CH-\${Math.round(amount * 100)}\`; }
  refund(id: string) {}
}

class FakeShipping implements ShippingProvider {
  createShipment(orderId: string, address: string) { return \`TRK-\${orderId}\`; }
}

const svc = new FulfillmentService(
  new InMemoryInventory(), new FakePayment(), new FakeShipping(),
);
console.log(svc.fulfill("ORD-001", [{ sku: "W-100", qty: 2 }], 59.98, "123 Main St", "card"));`,
        Rust: `trait InventoryService {
    fn reserve(&mut self, items: &[(&str, u32)]) -> String;
    fn release(&mut self, reservation_id: &str);
}

trait PaymentGateway {
    fn charge(&self, amount: f64, method: &str) -> String;
}

trait ShippingProvider {
    fn create_shipment(&self, order_id: &str, address: &str) -> String;
}

struct FulfillmentService<I: InventoryService, P: PaymentGateway, S: ShippingProvider> {
    inventory: I,
    payment: P,
    shipping: S,
}

impl<I: InventoryService, P: PaymentGateway, S: ShippingProvider> FulfillmentService<I, P, S> {
    fn fulfill(&mut self, order_id: &str, items: &[(&str, u32)],
               total: f64, address: &str, method: &str) -> (String, String, String) {
        let res_id = self.inventory.reserve(items);
        let charge_id = self.payment.charge(total, method);
        let tracking = self.shipping.create_shipment(order_id, address);
        (res_id, charge_id, tracking)
    }
}

struct InMemoryInventory { counter: u32 }
impl InventoryService for InMemoryInventory {
    fn reserve(&mut self, _items: &[(&str, u32)]) -> String {
        self.counter += 1;
        format!("RES-{:04}", self.counter)
    }
    fn release(&mut self, _id: &str) {}
}

struct FakePayment;
impl PaymentGateway for FakePayment {
    fn charge(&self, amount: f64, _method: &str) -> String {
        format!("CH-{}", (amount * 100.0) as i64)
    }
}

struct FakeShipping;
impl ShippingProvider for FakeShipping {
    fn create_shipment(&self, order_id: &str, _addr: &str) -> String {
        format!("TRK-{}", order_id)
    }
}

fn main() {
    let mut svc = FulfillmentService {
        inventory: InMemoryInventory { counter: 0 },
        payment: FakePayment,
        shipping: FakeShipping,
    };
    let result = svc.fulfill("ORD-001", &[("W-100", 2)], 59.98, "123 Main St", "card");
    println!("{:?}", result);
}`,
      },
    },
  ],

  variants: [
    {
      id: 1,
      name: "Constructor Injection",
      description:
        "Dependencies are passed through the constructor at object creation time. This is the most common and recommended DIP implementation. The object declares its dependencies upfront, making them explicit and immutable. The composition root (or DI container) wires everything together.",
      code: {
        Python: `from abc import ABC, abstractmethod


class Logger(ABC):
    @abstractmethod
    def log(self, message: str) -> None: ...


class ConsoleLogger(Logger):
    def log(self, message: str):
        print(f"[LOG] {message}")


class FileLogger(Logger):
    def __init__(self, path: str):
        self.path = path

    def log(self, message: str):
        with open(self.path, "a") as f:
            f.write(message + "\\n")


# Constructor injection — dependencies are explicit and immutable
class OrderService:
    def __init__(self, logger: Logger):
        self._logger = logger

    def place_order(self, order_id: str):
        self._logger.log(f"Order placed: {order_id}")
        return order_id


# Composition root decides which implementation to use
service = OrderService(ConsoleLogger())
service.place_order("ORD-001")

# Swap for file logging — zero changes to OrderService
file_service = OrderService(FileLogger("/tmp/orders.log"))
file_service.place_order("ORD-002")`,
        Go: `type Logger interface { Log(msg string) }

type ConsoleLogger struct{}
func (l *ConsoleLogger) Log(msg string) { fmt.Println("[LOG]", msg) }

// Constructor injection via struct initialization
type OrderService struct { Logger Logger }

func (s *OrderService) PlaceOrder(orderID string) string {
	s.Logger.Log("Order placed: " + orderID)
	return orderID
}

func main() {
	svc := &OrderService{Logger: &ConsoleLogger{}}
	svc.PlaceOrder("ORD-001")
}`,
        Java: `interface Logger { void log(String message); }

class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println("[LOG] " + msg); }
}

// Constructor injection
class OrderService {
    private final Logger logger;

    OrderService(Logger logger) { this.logger = logger; }

    String placeOrder(String orderId) {
        logger.log("Order placed: " + orderId);
        return orderId;
    }
}

// Composition root
Logger logger = new ConsoleLogger();
OrderService service = new OrderService(logger);
service.placeOrder("ORD-001");`,
        TypeScript: `interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(\`[LOG] \${message}\`); }
}

// Constructor injection
class OrderService {
  constructor(private logger: Logger) {}

  placeOrder(orderId: string): string {
    this.logger.log(\`Order placed: \${orderId}\`);
    return orderId;
  }
}

const service = new OrderService(new ConsoleLogger());
service.placeOrder("ORD-001");`,
        Rust: `trait Logger { fn log(&self, message: &str); }

struct ConsoleLogger;
impl Logger for ConsoleLogger {
    fn log(&self, msg: &str) { println!("[LOG] {}", msg); }
}

// Constructor injection via generic type parameter
struct OrderService<L: Logger> { logger: L }

impl<L: Logger> OrderService<L> {
    fn place_order(&self, order_id: &str) -> String {
        self.logger.log(&format!("Order placed: {}", order_id));
        order_id.to_string()
    }
}

fn main() {
    let svc = OrderService { logger: ConsoleLogger };
    svc.place_order("ORD-001");
}`,
      },
      pros: [
        "Dependencies are explicit — visible in the constructor signature",
        "Immutable after construction — the object is always in a valid state",
        "Easy to test — pass mocks via constructor",
      ],
      cons: [
        "Constructor can grow large with many dependencies (may indicate SRP violation)",
        "All dependencies must be available at construction time",
        "Can lead to deep constructor chains without a DI container",
      ],
    },
    {
      id: 2,
      name: "Service Locator / Registry",
      description:
        "Instead of injecting dependencies directly, the class looks up its dependencies from a central registry (service locator). This inverts the dependency on concrete classes but trades constructor visibility for runtime lookup. Often considered an anti-pattern compared to constructor injection, but useful in plugin architectures.",
      code: {
        Python: `class ServiceLocator:
    _services: dict[type, object] = {}

    @classmethod
    def register(cls, interface: type, implementation: object):
        cls._services[interface] = implementation

    @classmethod
    def get(cls, interface: type):
        svc = cls._services.get(interface)
        if not svc:
            raise ValueError(f"No implementation registered for {interface.__name__}")
        return svc


class Logger:
    def log(self, msg: str): ...

class ConsoleLogger(Logger):
    def log(self, msg: str):
        print(f"[LOG] {msg}")


class OrderService:
    def place_order(self, order_id: str):
        logger = ServiceLocator.get(Logger)
        logger.log(f"Order placed: {order_id}")
        return order_id


# Register implementations
ServiceLocator.register(Logger, ConsoleLogger())

# OrderService discovers its dependency at runtime
service = OrderService()
service.place_order("ORD-001")`,
        Go: `var registry = map[string]interface{}{}

func Register(name string, svc interface{}) { registry[name] = svc }
func Get(name string) interface{} { return registry[name] }

type Logger interface { Log(msg string) }
type ConsoleLogger struct{}
func (l *ConsoleLogger) Log(msg string) { fmt.Println("[LOG]", msg) }

func init() {
	Register("logger", &ConsoleLogger{})
}

type OrderService struct{}
func (s *OrderService) PlaceOrder(orderID string) {
	logger := Get("logger").(Logger)
	logger.Log("Order placed: " + orderID)
}`,
        Java: `class ServiceLocator {
    private static final Map<Class<?>, Object> services = new HashMap<>();

    static <T> void register(Class<T> iface, T impl) { services.put(iface, impl); }

    @SuppressWarnings("unchecked")
    static <T> T get(Class<T> iface) { return (T) services.get(iface); }
}

interface Logger { void log(String msg); }
class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println("[LOG] " + msg); }
}

class OrderService {
    String placeOrder(String orderId) {
        ServiceLocator.get(Logger.class).log("Order placed: " + orderId);
        return orderId;
    }
}

// Registration
ServiceLocator.register(Logger.class, new ConsoleLogger());
new OrderService().placeOrder("ORD-001");`,
        TypeScript: `class ServiceLocator {
  private static services = new Map<string, unknown>();

  static register<T>(key: string, impl: T) { this.services.set(key, impl); }
  static get<T>(key: string): T { return this.services.get(key) as T; }
}

interface Logger { log(msg: string): void; }
class ConsoleLogger implements Logger {
  log(msg: string) { console.log(\`[LOG] \${msg}\`); }
}

ServiceLocator.register<Logger>("logger", new ConsoleLogger());

class OrderService {
  placeOrder(orderId: string) {
    const logger = ServiceLocator.get<Logger>("logger");
    logger.log(\`Order placed: \${orderId}\`);
    return orderId;
  }
}`,
        Rust: `use std::any::{Any, TypeId};
use std::collections::HashMap;

struct ServiceLocator {
    services: HashMap<TypeId, Box<dyn Any>>,
}

impl ServiceLocator {
    fn new() -> Self { Self { services: HashMap::new() } }
    fn register<T: 'static>(&mut self, svc: T) {
        self.services.insert(TypeId::of::<T>(), Box::new(svc));
    }
    fn get<T: 'static>(&self) -> Option<&T> {
        self.services.get(&TypeId::of::<T>()).and_then(|b| b.downcast_ref())
    }
}

// Note: In Rust, constructor injection with generics is strongly preferred
// Service Locator is shown for completeness but is not idiomatic`,
      },
      pros: [
        "Simple setup in small applications or plugin systems",
        "No need to thread dependencies through constructors",
        "Easy to swap implementations globally",
      ],
      cons: [
        "Hidden dependencies — not visible in the API surface",
        "Runtime failures instead of compile-time errors when a service isn't registered",
        "Harder to test — must set up the locator before each test",
      ],
    },
    {
      id: 3,
      name: "Module / Function-Level DIP",
      description:
        "In functional or module-oriented codebases, DIP is applied by passing functions (strategies) or modules as dependencies rather than class instances. Higher-order functions accept their dependencies as parameters. This is natural in functional programming and avoids class hierarchies entirely.",
      code: {
        Python: `from typing import Callable


# Dependencies are functions, not classes
def console_log(msg: str) -> None:
    print(f"[LOG] {msg}")


def file_log(path: str) -> Callable[[str], None]:
    def log(msg: str) -> None:
        with open(path, "a") as f:
            f.write(msg + "\\n")
    return log


# Higher-order function — accepts logger as a dependency
def place_order(order_id: str, log: Callable[[str], None]) -> str:
    log(f"Order placed: {order_id}")
    return order_id


# Inject different implementations
place_order("ORD-001", console_log)
place_order("ORD-002", file_log("/tmp/orders.log"))

# For testing — inject a capturing function
captured: list[str] = []
place_order("ORD-003", lambda msg: captured.append(msg))
assert len(captured) == 1`,
        Go: `type LogFunc func(string)

func ConsoleLog(msg string) { fmt.Println("[LOG]", msg) }

// Function-level DIP — logger is a parameter
func PlaceOrder(orderID string, log LogFunc) string {
	log("Order placed: " + orderID)
	return orderID
}

func main() {
	PlaceOrder("ORD-001", ConsoleLog)

	// Inject for testing
	var captured []string
	PlaceOrder("ORD-002", func(msg string) { captured = append(captured, msg) })
	fmt.Println("Captured:", captured)
}`,
        Java: `import java.util.function.Consumer;
import java.util.ArrayList;

class Orders {
    static String placeOrder(String orderId, Consumer<String> log) {
        log.accept("Order placed: " + orderId);
        return orderId;
    }

    public static void main(String[] args) {
        placeOrder("ORD-001", msg -> System.out.println("[LOG] " + msg));

        // Test
        var captured = new ArrayList<String>();
        placeOrder("ORD-002", captured::add);
        assert captured.size() == 1;
    }
}`,
        TypeScript: `type LogFn = (msg: string) => void;

const consoleLog: LogFn = (msg) => console.log(\`[LOG] \${msg}\`);

// Function-level DIP
function placeOrder(orderId: string, log: LogFn): string {
  log(\`Order placed: \${orderId}\`);
  return orderId;
}

placeOrder("ORD-001", consoleLog);

// Testing — inject a capturing function
const captured: string[] = [];
placeOrder("ORD-002", (msg) => captured.push(msg));
console.assert(captured.length === 1);`,
        Rust: `fn console_log(msg: &str) { println!("[LOG] {}", msg); }

// Function-level DIP
fn place_order(order_id: &str, log: impl Fn(&str)) -> String {
    log(&format!("Order placed: {}", order_id));
    order_id.to_string()
}

fn main() {
    place_order("ORD-001", console_log);

    // Test — inject a closure
    let mut captured = Vec::new();
    place_order("ORD-002", |msg| captured.push(msg.to_string()));
    assert_eq!(captured.len(), 1);
}`,
      },
      pros: [
        "Minimal boilerplate — no interfaces or classes needed",
        "Natural fit for functional programming and scripting languages",
        "Easy to test — pass lambdas or closures directly",
      ],
      cons: [
        "Harder to express complex dependency contracts (multiple methods)",
        "No type-level documentation of what a dependency should do",
        "Function signatures can become unwieldy with many parameters",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Dependency Visibility", "Type Safety", "Testability", "Best For",
  ],
  comparisonRows: [
    ["Constructor Injection", "Explicit (constructor)", "Compile-time", "Excellent", "Most applications — recommended default"],
    ["Service Locator", "Hidden (runtime lookup)", "Runtime", "Moderate (setup needed)", "Plugin architectures, legacy migration"],
    ["Function-Level DIP", "Explicit (parameters)", "Compile-time", "Excellent", "Functional codebases, simple dependencies"],
  ],

  summary: [
    { aspect: "Principle Type", detail: "SOLID — D" },
    {
      aspect: "Key Benefit",
      detail:
        "Business logic depends on abstractions, not infrastructure. Swapping databases, message brokers, payment gateways, or notification channels is a configuration change, not a code change. Unit tests run in milliseconds with in-memory fakes.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Abstracting everything: not every dependency needs an interface. If a utility function (string formatting, math) will never be swapped or mocked, a direct dependency is fine. Abstract at the architectural boundary, not at every function call.",
    },
    {
      aspect: "vs. Dependency Injection",
      detail:
        "DIP is the principle (depend on abstractions). DI is the technique (pass dependencies from outside). DI implements DIP. You can have DI without DIP (injecting concrete classes) and DIP without DI (using service locator), but they're strongest together.",
    },
    {
      aspect: "vs. Open/Closed Principle",
      detail:
        "OCP says modules should be open for extension, closed for modification. DIP enables OCP: by depending on abstractions, you extend behavior by adding new implementations rather than modifying existing code.",
    },
    {
      aspect: "When to Apply",
      detail:
        "At architectural boundaries: database access, external APIs, message brokers, file storage, notification channels. When you need testability with fast, isolated unit tests. When infrastructure decisions might change over the lifetime of the project.",
    },
    {
      aspect: "When NOT to Over-Apply",
      detail:
        "For utility code that will never be swapped (string manipulation, math). For internal implementation details that have no architectural significance. For simple scripts or prototypes where the overhead of abstractions isn't justified.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Repository Pattern, Strategy Pattern, Hexagonal Architecture (Ports & Adapters), Clean Architecture. All of these are concrete applications of DIP — they define abstractions at boundaries and inject implementations.",
    },
  ],

  antiPatterns: [
    {
      name: "Direct Infrastructure Coupling",
      description:
        "High-level business logic directly instantiates low-level classes: new PostgresDatabase(), new KafkaPublisher(). Changing infrastructure requires rewriting business logic. Unit tests need real infrastructure running.",
      betterAlternative:
        "Define abstractions (interfaces) for infrastructure operations. Inject implementations at the composition root. Use in-memory fakes for testing.",
    },
    {
      name: "Leaky Abstraction",
      description:
        "The abstraction exposes infrastructure-specific details — e.g., a Repository interface with a method like executeSQLQuery(sql: string). The interface is nominally abstract but semantically coupled to SQL.",
      betterAlternative:
        "Design abstractions from the domain's perspective: save(entity), findById(id), findByStatus(status). The interface should express what the business needs, not how storage works.",
    },
    {
      name: "Abstraction for Everything",
      description:
        "Creating interfaces for every single dependency, including utility functions like string formatting or math operations that will never be swapped or mocked.",
      betterAlternative:
        "Apply DIP at architectural boundaries (persistence, external APIs, messaging). Keep simple utilities as direct dependencies. The cost of abstraction should be justified by the benefit.",
    },
    {
      name: "New-ing Up Dependencies Inside Methods",
      description:
        "Instead of receiving dependencies via constructor, methods create their own: def process(self): logger = FileLogger('/tmp/log'). The dependency is hidden and can't be swapped.",
      betterAlternative:
        "Accept dependencies in the constructor (or as function parameters). Let the composition root decide which implementation to use. This makes dependencies explicit and testable.",
    },
  ],
};

export default dependencyInversionData;
