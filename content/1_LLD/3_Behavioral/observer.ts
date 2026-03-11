import { PatternData } from "@/lib/patterns/types";

const observerData: PatternData = {
  slug: "observer",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Observer Pattern",
  subtitle:
    "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",

  intent:
    "Many systems need to propagate changes — when a stock price updates, every dashboard widget, alert system, and logging service must know. When a user changes their profile, the avatar, sidebar, and email service must react. Hard-coding these dependencies creates a tangled web of direct calls that violates the Open/Closed Principle.\n\nThe Observer pattern decouples the source of change (Subject) from the consumers of change (Observers). The Subject maintains a list of observers and notifies all of them when its state changes. Observers subscribe and unsubscribe dynamically. The Subject doesn't know what its observers do — it just calls their update() method.\n\nThis is the foundation of event-driven programming, reactive streams, and the publish-subscribe pattern that underpins modern UI frameworks (React, Angular, Vue), message brokers (Kafka, RabbitMQ), and real-time systems.",

  classDiagramSvg: `<svg viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#obs-arr); }
    .s-dash { stroke-dasharray: 5,3; }
    .s-ital { font-style: italic; }
  </style>
  <defs>
    <marker id="obs-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Subject -->
  <rect x="10" y="10" width="200" height="85" class="s-box s-diagram-box"/>
  <text x="110" y="28" text-anchor="middle" class="s-title s-diagram-title">Subject</text>
  <line x1="10" y1="32" x2="210" y2="32" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">-observers: Observer[]</text>
  <text x="20" y="63" class="s-member s-diagram-member">-state: T</text>
  <text x="20" y="78" class="s-member s-diagram-member">+subscribe(o): void</text>
  <text x="20" y="93" class="s-member s-diagram-member">+notify(): void</text>
  <!-- Observer Interface -->
  <rect x="280" y="10" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="380" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="380" y="42" text-anchor="middle" class="s-title s-diagram-title">Observer</text>
  <line x1="280" y1="45" x2="480" y2="45" class="s-diagram-line"/>
  <text x="290" y="60" class="s-member s-diagram-member s-ital">+update(state: T): void</text>
  <!-- ConcreteObserverA -->
  <rect x="250" y="120" width="100" height="45" class="s-box s-diagram-box"/>
  <text x="300" y="138" text-anchor="middle" class="s-title s-diagram-title">ObserverA</text>
  <line x1="250" y1="142" x2="350" y2="142" class="s-diagram-line"/>
  <text x="258" y="158" class="s-member s-diagram-member">+update()</text>
  <!-- ConcreteObserverB -->
  <rect x="380" y="120" width="100" height="45" class="s-box s-diagram-box"/>
  <text x="430" y="138" text-anchor="middle" class="s-title s-diagram-title">ObserverB</text>
  <line x1="380" y1="142" x2="480" y2="142" class="s-diagram-line"/>
  <text x="388" y="158" class="s-member s-diagram-member">+update()</text>
  <!-- Arrows -->
  <line x1="210" y1="37" x2="280" y2="37" class="s-arr s-diagram-arrow"/>
  <line x1="300" y1="120" x2="350" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="430" y1="120" x2="415" y2="65" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Subject holds a list of Observer references and a state. When state changes, it calls notify(), which iterates through observers and calls update() on each. ConcreteObservers implement the Observer interface and react to updates. The Subject doesn't know what the observers do — it just pushes state to them.",

  diagramComponents: [
    {
      name: "Subject",
      description:
        "Maintains a list of observers and provides subscribe/unsubscribe/notify methods. When its state changes, it iterates through all registered observers and calls update(). The Subject is decoupled from concrete observer implementations.",
    },
    {
      name: "Observer (Interface)",
      description:
        "Declares the update(state) method that all concrete observers must implement. This is the contract that allows the Subject to notify any observer without knowing its type.",
    },
    {
      name: "ConcreteObserver",
      description:
        "Implements the Observer interface with specific reaction logic. Examples: LoggingObserver writes to a log, UIObserver re-renders a widget, AlertObserver sends an email. Each observer decides independently how to handle the state change.",
    },
  ],

  solutionDetail:
    "**The Problem:** Multiple objects need to react when another object's state changes. Direct coupling between the source and all consumers creates a rigid, hard-to-maintain dependency web.\n\n**The Observer Solution:** The Subject maintains a dynamic list of observers. It exposes subscribe(observer) and unsubscribe(observer). When state changes, it calls notify(), which iterates the list and calls update(newState) on each observer.\n\n**How It Works:**\n\n1. **Subject stores observers**: An internal list holds all registered Observer references.\n\n2. **Observers subscribe**: Each observer calls subject.subscribe(this) to register interest.\n\n3. **State changes trigger notify**: When the Subject's state changes (via setState or a domain method), it calls notify().\n\n4. **notify() broadcasts**: It iterates the observer list and calls observer.update(state) on each.\n\n5. **Observers react independently**: Each observer handles the update in its own way — log it, display it, send an alert, etc.\n\n**Key Insight:** The Subject and Observers are loosely coupled. The Subject knows observers only through the Observer interface. New observer types can be added without modifying the Subject.",

  characteristics: [
    "One-to-many dependency — one Subject, many Observers",
    "Loose coupling — Subject depends only on the Observer interface, not concrete classes",
    "Dynamic subscription — observers can subscribe and unsubscribe at runtime",
    "Broadcast communication — all observers receive the same notification",
    "Push model: Subject sends state to observers; Pull model: observers query Subject",
    "Foundation of event-driven architecture, reactive programming, and pub/sub",
    "Potential for memory leaks if observers don't unsubscribe (lapsed listener problem)",
  ],

  useCases: [
    {
      id: 1,
      title: "Event Emitter / DOM Events",
      domain: "Frontend / UI",
      description:
        "UI elements emit events (click, hover, keypress) and multiple handlers subscribe. Adding new handlers doesn't modify the element.",
      whySingleton:
        "The DOM element is the Subject. Event listeners are Observers. addEventListener/removeEventListener is the subscribe/unsubscribe mechanism.",
      code: `class EventEmitter {
  private listeners = new Map<string, Function[]>();
  on(event: string, fn: Function) { /* subscribe */ }
  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(fn => fn(data));
  }
}`,
    },
    {
      id: 2,
      title: "Stock Price Ticker",
      domain: "Finance",
      description:
        "A stock feed broadcasts price updates. Multiple systems — dashboards, alert engines, trading bots — need to react to each price change independently.",
      whySingleton:
        "StockFeed is the Subject. Each consumer (Dashboard, AlertEngine, TradingBot) is an Observer that subscribes by ticker symbol.",
      code: `class StockFeed {
  observers: Map<string, Observer[]> = new Map();
  onPrice(ticker: string, price: number) {
    this.observers.get(ticker)?.forEach(o => o.update(price));
  }
}`,
    },
    {
      id: 3,
      title: "Weather Station Broadcasting",
      domain: "IoT / Monitoring",
      description:
        "A weather station periodically reads temperature, humidity, and pressure. Multiple displays and logging services need the updated readings.",
      whySingleton:
        "WeatherStation is the Subject. DisplayPanel and Logger are Observers. When new readings arrive, all observers are notified with the latest data.",
      code: `class WeatherStation {
  observers: Observer[] = [];
  setReadings(temp: number, humidity: number) {
    this.observers.forEach(o => o.update({ temp, humidity }));
  }
}`,
    },
    {
      id: 4,
      title: "Chat Room Notifications",
      domain: "Messaging",
      description:
        "When a message is posted to a chat room, all connected users (observers) receive the message. Users can join and leave the room dynamically.",
      whySingleton:
        "ChatRoom is the Subject. Each connected User is an Observer. Posting a message calls notify() which pushes the message to all participants.",
      code: `class ChatRoom {
  members: User[] = [];
  post(msg: Message) {
    this.members.forEach(u => u.onMessage(msg));
  }
  join(user: User) { this.members.push(user); }
}`,
    },
    {
      id: 5,
      title: "Reactive Data Binding (MVVM)",
      domain: "Frontend Frameworks",
      description:
        "In MVVM frameworks, model properties are observable. When a property changes, all bound UI elements re-render automatically.",
      whySingleton:
        "Each observable property is a Subject. Bound UI components are Observers. Setting the property triggers re-render of all bound views.",
      code: `class Observable<T> {
  private watchers: ((val: T) => void)[] = [];
  set value(v: T) { this._val = v; this.watchers.forEach(w => w(v)); }
  watch(fn: (val: T) => void) { this.watchers.push(fn); }
}`,
    },
    {
      id: 6,
      title: "Audit / Logging System",
      domain: "Enterprise",
      description:
        "Business operations (user login, payment, order) need to be logged to multiple destinations: file, database, monitoring service. Each destination subscribes as an observer.",
      whySingleton:
        "The AuditBus is the Subject. FileLogger, DBLogger, and MetricsCollector are Observers. New log destinations are added without modifying business code.",
      code: `class AuditBus {
  loggers: AuditObserver[] = [];
  record(event: AuditEvent) {
    this.loggers.forEach(l => l.onAuditEvent(event));
  }
}`,
    },
    {
      id: 7,
      title: "Progress Bar Updates",
      domain: "Desktop / CLI",
      description:
        "A long-running task reports progress. Multiple UI elements (progress bar, status text, estimated time) need to update as progress changes.",
      whySingleton:
        "The Task is the Subject. ProgressBar, StatusLabel, and ETACalculator are Observers that each render progress differently.",
      code: `class Task {
  observers: ProgressObserver[] = [];
  reportProgress(pct: number) {
    this.observers.forEach(o => o.onProgress(pct));
  }
}`,
    },
    {
      id: 8,
      title: "Configuration Hot Reload",
      domain: "Backend / DevOps",
      description:
        "Application configuration changes at runtime (feature flags, rate limits). All components using those config values must be notified to apply the new settings.",
      whySingleton:
        "ConfigStore is the Subject. Services and components are Observers. When config is updated, all subscribers receive the new config values.",
      code: `class ConfigStore {
  subscribers: ConfigObserver[] = [];
  update(key: string, value: any) {
    this.config[key] = value;
    this.subscribers.forEach(s => s.onConfigChange(key, value));
  }
}`,
    },
    {
      id: 9,
      title: "Form Validation Feedback",
      domain: "Web Application",
      description:
        "A form field emits validation events. Error messages, submit button state, and analytics all observe the validation state changes.",
      whySingleton:
        "Each FormField is a Subject. The ErrorDisplay, SubmitButton, and AnalyticsTracker observe validation state changes.",
      code: `class FormField {
  observers: ValidationObserver[] = [];
  validate() {
    const errors = this.rules.flatMap(r => r(this.value));
    this.observers.forEach(o => o.onValidation(this.name, errors));
  }
}`,
    },
    {
      id: 10,
      title: "Game Entity State Changes",
      domain: "Game Development",
      description:
        "A game entity (player, enemy) changes state (health, position, status). Multiple systems — HUD, AI, physics, audio — need to react to these changes.",
      whySingleton:
        "The Entity is the Subject. HUDDisplay, AIController, SoundEngine are Observers. Changing entity state broadcasts to all interested systems.",
      code: `class Entity {
  observers: EntityObserver[] = [];
  takeDamage(amount: number) {
    this.health -= amount;
    this.observers.forEach(o => o.onStateChange(this));
  }
}`,
    },
    {
      id: 11,
      title: "Database Change Notifications",
      domain: "Data Layer",
      description:
        "When a database record changes, caches, search indices, and event streams must be updated. Each subscribes to change events on the data layer.",
      whySingleton:
        "The Repository is the Subject. CacheInvalidator, SearchIndexer, and EventPublisher are Observers notified on every write.",
      code: `class Repository {
  observers: ChangeObserver[] = [];
  save(entity: Entity) {
    this.db.save(entity);
    this.observers.forEach(o => o.onChange("save", entity));
  }
}`,
    },
    {
      id: 12,
      title: "Circuit Breaker State Monitoring",
      domain: "Microservices / SRE",
      description:
        "A circuit breaker transitions between Closed, Open, and Half-Open states. Dashboards, alerting systems, and load balancers must react to state transitions.",
      whySingleton:
        "The CircuitBreaker is the Subject. Dashboard, AlertService, and LoadBalancer observe state transitions to adjust routing and trigger alerts.",
      code: `class CircuitBreaker {
  observers: CBObserver[] = [];
  trip() {
    this.state = "OPEN";
    this.observers.forEach(o => o.onStateChange("OPEN"));
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Event Emitter — TypeSafe Pub/Sub",
      domain: "Core Library",
      problem:
        "A system needs a generic event emitter where multiple handlers can subscribe to named events and react independently when events are emitted. Handlers must be removable to prevent memory leaks.",
      solution:
        "Implement a Subject class with subscribe/unsubscribe/notify. Each event type has its own list of handlers. Emitting an event triggers all registered handlers for that event type.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="110" y="28" text-anchor="middle" class="s-title s-diagram-title">EventEmitter</text>
  <line x1="10" y1="32" x2="210" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-listeners: Map</text>
  <text x="18" y="62" class="s-member s-diagram-member">+on(event, handler)</text>
  <text x="18" y="76" class="s-member s-diagram-member">+emit(event, data)</text>
  <rect x="260" y="10" width="150" height="50" class="s-box s-diagram-box"/>
  <text x="335" y="28" text-anchor="middle" class="s-title s-diagram-title">Handler</text>
  <line x1="260" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="268" y="48" class="s-member s-diagram-member">+handle(data): void</text>
</svg>`,
      code: {
        Python: `from typing import Any, Callable

class EventEmitter:
    def __init__(self):
        self._listeners: dict[str, list[Callable]] = {}

    def on(self, event: str, handler: Callable) -> Callable:
        self._listeners.setdefault(event, []).append(handler)
        return handler

    def off(self, event: str, handler: Callable) -> None:
        if event in self._listeners:
            self._listeners[event].remove(handler)

    def emit(self, event: str, *args: Any) -> None:
        for handler in self._listeners.get(event, []):
            handler(*args)

# ── Usage ──
emitter = EventEmitter()

def on_login(user: str):
    print(f"[LOG] {user} logged in")

def on_login_metrics(user: str):
    print(f"[METRIC] login count += 1 for {user}")

emitter.on("login", on_login)
emitter.on("login", on_login_metrics)
emitter.emit("login", "alice")
# [LOG] alice logged in
# [METRIC] login count += 1 for alice
emitter.off("login", on_login)
emitter.emit("login", "bob")
# [METRIC] login count += 1 for bob`,
        Go: `package main

import "fmt"

type Handler func(data interface{})

type EventEmitter struct {
	listeners map[string][]Handler
}

func NewEmitter() *EventEmitter {
	return &EventEmitter{listeners: make(map[string][]Handler)}
}

func (e *EventEmitter) On(event string, h Handler) {
	e.listeners[event] = append(e.listeners[event], h)
}

func (e *EventEmitter) Emit(event string, data interface{}) {
	for _, h := range e.listeners[event] {
		h(data)
	}
}

func main() {
	em := NewEmitter()
	em.On("login", func(data interface{}) {
		fmt.Printf("[LOG] %s logged in\\n", data)
	})
	em.On("login", func(data interface{}) {
		fmt.Printf("[METRIC] login for %s\\n", data)
	})
	em.Emit("login", "alice")
}`,
        Java: `import java.util.*;
import java.util.function.Consumer;

class EventEmitter {
    private final Map<String, List<Consumer<Object>>> listeners = new HashMap<>();

    void on(String event, Consumer<Object> handler) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(handler);
    }

    void off(String event, Consumer<Object> handler) {
        var list = listeners.get(event);
        if (list != null) list.remove(handler);
    }

    void emit(String event, Object data) {
        var list = listeners.get(event);
        if (list != null) list.forEach(h -> h.accept(data));
    }

    public static void main(String[] args) {
        var emitter = new EventEmitter();
        Consumer<Object> logger = user -> System.out.println("[LOG] " + user + " logged in");
        emitter.on("login", logger);
        emitter.on("login", user -> System.out.println("[METRIC] login for " + user));
        emitter.emit("login", "alice");
    }
}`,
        TypeScript: `type Handler<T = unknown> = (data: T) => void;

class EventEmitter {
  private listeners = new Map<string, Handler[]>();

  on<T>(event: string, handler: Handler<T>): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push(handler as Handler);
    this.listeners.set(event, list);
    return () => this.off(event, handler as Handler);  // unsubscribe fn
  }

  off(event: string, handler: Handler): void {
    const list = this.listeners.get(event);
    if (list) this.listeners.set(event, list.filter(h => h !== handler));
  }

  emit<T>(event: string, data: T): void {
    this.listeners.get(event)?.forEach(h => (h as Handler<T>)(data));
  }
}

// ── Usage ──
const emitter = new EventEmitter();
const unsub = emitter.on<string>("login", user => console.log(\`[LOG] \${user} logged in\`));
emitter.on<string>("login", user => console.log(\`[METRIC] login for \${user}\`));
emitter.emit("login", "alice");
unsub();  // clean unsubscribe
emitter.emit("login", "bob");`,
        Rust: `use std::collections::HashMap;

type Handler = Box<dyn Fn(&str)>;

struct EventEmitter {
    listeners: HashMap<String, Vec<Handler>>,
}

impl EventEmitter {
    fn new() -> Self { Self { listeners: HashMap::new() } }

    fn on(&mut self, event: &str, handler: Handler) {
        self.listeners.entry(event.to_string()).or_default().push(handler);
    }

    fn emit(&self, event: &str, data: &str) {
        if let Some(handlers) = self.listeners.get(event) {
            for h in handlers { h(data); }
        }
    }
}

fn main() {
    let mut em = EventEmitter::new();
    em.on("login", Box::new(|user| println!("[LOG] {} logged in", user)));
    em.on("login", Box::new(|user| println!("[METRIC] login for {}", user)));
    em.emit("login", "alice");
}`,
      },
      considerations: [
        "Return unsubscribe function from on() to prevent lapsed listener leaks",
        "Consider weak references for observers to allow garbage collection",
        "Thread safety: synchronize listener list or use concurrent data structures",
        "Error handling: should one observer's error prevent others from being notified?",
        "Consider once() for single-fire listeners",
      ],
    },
    {
      id: 2,
      title: "Stock Price Ticker — Real-Time Feeds",
      domain: "Finance",
      problem:
        "A stock exchange broadcasts price updates for thousands of tickers. Multiple consumers — trading dashboards, alert engines, and analytics — need to react to price changes in real time without coupling to the feed implementation.",
      solution:
        "StockFeed is the Subject. Different consumer classes implement the PriceObserver interface. Consumers subscribe by ticker symbol and receive only relevant updates.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="190" height="70" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">StockFeed</text>
  <line x1="10" y1="32" x2="200" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-subs: Map&lt;ticker, Observer[]&gt;</text>
  <text x="18" y="62" class="s-member s-diagram-member">+subscribe(ticker, obs)</text>
  <text x="18" y="76" class="s-member s-diagram-member">+onPrice(ticker, price)</text>
  <rect x="250" y="10" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="330" y="28" text-anchor="middle" class="s-title s-diagram-title">PriceObserver</text>
  <line x1="250" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="258" y="48" class="s-member s-diagram-member">+onPriceUpdate(ticker, price)</text>
</svg>`,
      code: {
        Python: `from typing import Protocol

class PriceObserver(Protocol):
    def on_price_update(self, ticker: str, price: float) -> None: ...

class StockFeed:
    def __init__(self):
        self._subs: dict[str, list[PriceObserver]] = {}

    def subscribe(self, ticker: str, observer: PriceObserver) -> None:
        self._subs.setdefault(ticker, []).append(observer)

    def on_price(self, ticker: str, price: float) -> None:
        for obs in self._subs.get(ticker, []):
            obs.on_price_update(ticker, price)

class Dashboard:
    def on_price_update(self, ticker: str, price: float) -> None:
        print(f"[DASHBOARD] {ticker}: \${price:.2f}")

class AlertEngine:
    def __init__(self, threshold: float):
        self.threshold = threshold
    def on_price_update(self, ticker: str, price: float) -> None:
        if price > self.threshold:
            print(f"[ALERT] {ticker} above \${self.threshold}!")

# ── Usage ──
feed = StockFeed()
feed.subscribe("AAPL", Dashboard())
feed.subscribe("AAPL", AlertEngine(200))
feed.on_price("AAPL", 215.50)
# [DASHBOARD] AAPL: $215.50
# [ALERT] AAPL above $200!`,
        Go: `package main

import "fmt"

type PriceObserver interface {
	OnPriceUpdate(ticker string, price float64)
}

type StockFeed struct {
	subs map[string][]PriceObserver
}
func NewStockFeed() *StockFeed { return &StockFeed{subs: make(map[string][]PriceObserver)} }
func (f *StockFeed) Subscribe(ticker string, o PriceObserver) {
	f.subs[ticker] = append(f.subs[ticker], o)
}
func (f *StockFeed) OnPrice(ticker string, price float64) {
	for _, o := range f.subs[ticker] { o.OnPriceUpdate(ticker, price) }
}

type Dashboard struct{}
func (d *Dashboard) OnPriceUpdate(t string, p float64) {
	fmt.Printf("[DASH] %s: $%.2f\\n", t, p)
}

type AlertEngine struct{ Threshold float64 }
func (a *AlertEngine) OnPriceUpdate(t string, p float64) {
	if p > a.Threshold { fmt.Printf("[ALERT] %s above $%.0f!\\n", t, a.Threshold) }
}

func main() {
	feed := NewStockFeed()
	feed.Subscribe("AAPL", &Dashboard{})
	feed.Subscribe("AAPL", &AlertEngine{200})
	feed.OnPrice("AAPL", 215.50)
}`,
        Java: `import java.util.*;

interface PriceObserver { void onPriceUpdate(String ticker, double price); }

class StockFeed {
    private final Map<String, List<PriceObserver>> subs = new HashMap<>();
    void subscribe(String ticker, PriceObserver o) {
        subs.computeIfAbsent(ticker, k -> new ArrayList<>()).add(o);
    }
    void onPrice(String ticker, double price) {
        subs.getOrDefault(ticker, List.of()).forEach(o -> o.onPriceUpdate(ticker, price));
    }
}

class Dashboard implements PriceObserver {
    public void onPriceUpdate(String t, double p) {
        System.out.printf("[DASH] %s: $%.2f%n", t, p);
    }
}

class AlertEngine implements PriceObserver {
    double threshold;
    AlertEngine(double t) { this.threshold = t; }
    public void onPriceUpdate(String t, double p) {
        if (p > threshold) System.out.printf("[ALERT] %s above $%.0f!%n", t, threshold);
    }
}`,
        TypeScript: `interface PriceObserver {
  onPriceUpdate(ticker: string, price: number): void;
}

class StockFeed {
  private subs = new Map<string, PriceObserver[]>();

  subscribe(ticker: string, observer: PriceObserver) {
    const list = this.subs.get(ticker) ?? [];
    list.push(observer);
    this.subs.set(ticker, list);
  }

  onPrice(ticker: string, price: number) {
    this.subs.get(ticker)?.forEach(o => o.onPriceUpdate(ticker, price));
  }
}

class Dashboard implements PriceObserver {
  onPriceUpdate(ticker: string, price: number) {
    console.log(\`[DASH] \${ticker}: $\${price.toFixed(2)}\`);
  }
}

class AlertEngine implements PriceObserver {
  constructor(private threshold: number) {}
  onPriceUpdate(ticker: string, price: number) {
    if (price > this.threshold) console.log(\`[ALERT] \${ticker} above $\${this.threshold}\`);
  }
}

const feed = new StockFeed();
feed.subscribe("AAPL", new Dashboard());
feed.subscribe("AAPL", new AlertEngine(200));
feed.onPrice("AAPL", 215.50);`,
        Rust: `use std::collections::HashMap;

trait PriceObserver {
    fn on_price_update(&self, ticker: &str, price: f64);
}

struct StockFeed {
    subs: HashMap<String, Vec<Box<dyn PriceObserver>>>,
}
impl StockFeed {
    fn new() -> Self { Self { subs: HashMap::new() } }
    fn subscribe(&mut self, ticker: &str, obs: Box<dyn PriceObserver>) {
        self.subs.entry(ticker.into()).or_default().push(obs);
    }
    fn on_price(&self, ticker: &str, price: f64) {
        if let Some(observers) = self.subs.get(ticker) {
            for o in observers { o.on_price_update(ticker, price); }
        }
    }
}

struct Dashboard;
impl PriceObserver for Dashboard {
    fn on_price_update(&self, t: &str, p: f64) { println!("[DASH] {}: \${:.2}", t, p); }
}

fn main() {
    let mut feed = StockFeed::new();
    feed.subscribe("AAPL", Box::new(Dashboard));
    feed.on_price("AAPL", 215.50);
}`,
      },
      considerations: [
        "High-frequency tickers may need throttling or batching to avoid overwhelming observers",
        "Consider backpressure mechanisms for slow consumers",
        "Topic filtering: subscribe by ticker, sector, or price threshold",
        "Thread safety for concurrent subscribe/emit operations",
        "Dead letter handling for failed observer notifications",
      ],
    },
    {
      id: 3,
      title: "Weather Station — Multi-Display System",
      domain: "IoT / Monitoring",
      problem:
        "A weather station reads sensor data (temperature, humidity, pressure) periodically. Multiple displays — current conditions, statistics, forecast — must update whenever new readings arrive.",
      solution:
        "WeatherStation is the Subject holding current readings. Each Display implements the Observer interface. When sensor data arrives, all displays receive the new readings.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="190" height="70" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">WeatherStation</text>
  <line x1="10" y1="32" x2="200" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-temp, humidity, pressure</text>
  <text x="18" y="62" class="s-member s-diagram-member">+register(display)</text>
  <text x="18" y="76" class="s-member s-diagram-member">+setReadings(t, h, p)</text>
  <rect x="250" y="10" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="330" y="28" text-anchor="middle" class="s-title s-diagram-title">WeatherDisplay</text>
  <line x1="250" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="258" y="48" class="s-member s-diagram-member">+update(readings)</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

@dataclass
class Readings:
    temp: float
    humidity: float
    pressure: float

class WeatherDisplay:
    def update(self, readings: Readings) -> None: ...

class WeatherStation:
    def __init__(self):
        self._displays: list[WeatherDisplay] = []
        self._readings = Readings(0, 0, 0)

    def register(self, display: WeatherDisplay) -> None:
        self._displays.append(display)

    def set_readings(self, temp: float, humidity: float, pressure: float) -> None:
        self._readings = Readings(temp, humidity, pressure)
        for d in self._displays:
            d.update(self._readings)

class CurrentConditions(WeatherDisplay):
    def update(self, r: Readings) -> None:
        print(f"Current: {r.temp}°F, {r.humidity}% humidity")

class StatisticsDisplay(WeatherDisplay):
    def __init__(self):
        self.temps: list[float] = []
    def update(self, r: Readings) -> None:
        self.temps.append(r.temp)
        avg = sum(self.temps) / len(self.temps)
        print(f"Stats: avg={avg:.1f}°F, max={max(self.temps)}°F")

station = WeatherStation()
station.register(CurrentConditions())
station.register(StatisticsDisplay())
station.set_readings(80, 65, 30.4)
station.set_readings(82, 70, 29.2)`,
        Go: `package main

import "fmt"

type Readings struct{ Temp, Humidity, Pressure float64 }

type WeatherDisplay interface {
	Update(r Readings)
}

type WeatherStation struct {
	displays []WeatherDisplay
}
func (ws *WeatherStation) Register(d WeatherDisplay) {
	ws.displays = append(ws.displays, d)
}
func (ws *WeatherStation) SetReadings(t, h, p float64) {
	r := Readings{t, h, p}
	for _, d := range ws.displays { d.Update(r) }
}

type CurrentConditions struct{}
func (c *CurrentConditions) Update(r Readings) {
	fmt.Printf("Current: %.1f°F, %.0f%% humidity\\n", r.Temp, r.Humidity)
}

func main() {
	ws := &WeatherStation{}
	ws.Register(&CurrentConditions{})
	ws.SetReadings(80, 65, 30.4)
}`,
        Java: `import java.util.*;

record Readings(double temp, double humidity, double pressure) {}

interface WeatherDisplay { void update(Readings r); }

class WeatherStation {
    private final List<WeatherDisplay> displays = new ArrayList<>();
    void register(WeatherDisplay d) { displays.add(d); }
    void setReadings(double t, double h, double p) {
        var r = new Readings(t, h, p);
        displays.forEach(d -> d.update(r));
    }
}

class CurrentConditions implements WeatherDisplay {
    public void update(Readings r) {
        System.out.printf("Current: %.1f°F, %.0f%% humidity%n", r.temp(), r.humidity());
    }
}`,
        TypeScript: `interface Readings { temp: number; humidity: number; pressure: number; }
interface WeatherDisplay { update(r: Readings): void; }

class WeatherStation {
  private displays: WeatherDisplay[] = [];
  register(d: WeatherDisplay) { this.displays.push(d); }
  setReadings(temp: number, humidity: number, pressure: number) {
    const r: Readings = { temp, humidity, pressure };
    this.displays.forEach(d => d.update(r));
  }
}

class CurrentConditions implements WeatherDisplay {
  update(r: Readings) {
    console.log(\`Current: \${r.temp}°F, \${r.humidity}% humidity\`);
  }
}

const station = new WeatherStation();
station.register(new CurrentConditions());
station.setReadings(80, 65, 30.4);`,
        Rust: `struct Readings { temp: f64, humidity: f64, pressure: f64 }

trait WeatherDisplay { fn update(&mut self, r: &Readings); }

struct WeatherStation { displays: Vec<Box<dyn WeatherDisplay>> }
impl WeatherStation {
    fn new() -> Self { Self { displays: vec![] } }
    fn register(&mut self, d: Box<dyn WeatherDisplay>) { self.displays.push(d); }
    fn set_readings(&mut self, temp: f64, humidity: f64, pressure: f64) {
        let r = Readings { temp, humidity, pressure };
        for d in &mut self.displays { d.update(&r); }
    }
}

struct CurrentConditions;
impl WeatherDisplay for CurrentConditions {
    fn update(&mut self, r: &Readings) {
        println!("Current: {:.1}°F, {:.0}% humidity", r.temp, r.humidity);
    }
}

fn main() {
    let mut ws = WeatherStation::new();
    ws.register(Box::new(CurrentConditions));
    ws.set_readings(80.0, 65.0, 30.4);
}`,
      },
      considerations: [
        "Sensor data arrives at different rates — batch or throttle notifications",
        "Historical data storage for trend analysis displays",
        "Different displays may need different data subsets (temp only vs. all readings)",
        "Consider async notification for expensive display rendering",
        "Handle sensor failures gracefully — notify observers of data quality issues",
      ],
    },
    {
      id: 4,
      title: "Chat Room — Real-Time Messaging",
      domain: "Messaging",
      problem:
        "A chat room has users who join and leave dynamically. When any user sends a message, all other connected users must receive it in real time. The system must handle users joining, leaving, and message broadcasting.",
      solution:
        "ChatRoom is the Subject. Each User is an Observer. Sending a message triggers notification to all participants except the sender.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="190" height="70" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">ChatRoom</text>
  <line x1="10" y1="32" x2="200" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-members: User[]</text>
  <text x="18" y="62" class="s-member s-diagram-member">+join(user)</text>
  <text x="18" y="76" class="s-member s-diagram-member">+send(msg, sender)</text>
  <rect x="250" y="10" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="330" y="28" text-anchor="middle" class="s-title s-diagram-title">User</text>
  <line x1="250" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="258" y="48" class="s-member s-diagram-member">+receive(msg, from)</text>
</svg>`,
      code: {
        Python: `class User:
    def __init__(self, name: str):
        self.name = name

    def receive(self, message: str, sender: str) -> None:
        print(f"[{self.name}] {sender}: {message}")

class ChatRoom:
    def __init__(self, name: str):
        self.name = name
        self._members: list[User] = []

    def join(self, user: User) -> None:
        self._members.append(user)
        self.broadcast(f"{user.name} joined", "SYSTEM")

    def leave(self, user: User) -> None:
        self._members.remove(user)
        self.broadcast(f"{user.name} left", "SYSTEM")

    def send(self, message: str, sender: User) -> None:
        for member in self._members:
            if member is not sender:
                member.receive(message, sender.name)

    def broadcast(self, message: str, system: str) -> None:
        for member in self._members:
            member.receive(message, system)

room = ChatRoom("general")
alice = User("Alice")
bob = User("Bob")
room.join(alice)
room.join(bob)
room.send("Hello everyone!", alice)`,
        Go: `package main

import "fmt"

type User struct{ Name string }
func (u *User) Receive(msg, from string) {
	fmt.Printf("[%s] %s: %s\\n", u.Name, from, msg)
}

type ChatRoom struct {
	Name    string
	Members []*User
}
func (r *ChatRoom) Join(u *User) {
	r.Members = append(r.Members, u)
}
func (r *ChatRoom) Send(msg string, sender *User) {
	for _, m := range r.Members {
		if m != sender { m.Receive(msg, sender.Name) }
	}
}

func main() {
	room := &ChatRoom{Name: "general"}
	alice := &User{Name: "Alice"}
	bob := &User{Name: "Bob"}
	room.Join(alice)
	room.Join(bob)
	room.Send("Hello!", alice)
}`,
        Java: `import java.util.*;

class User {
    String name;
    User(String name) { this.name = name; }
    void receive(String msg, String from) {
        System.out.printf("[%s] %s: %s%n", name, from, msg);
    }
}

class ChatRoom {
    List<User> members = new ArrayList<>();
    void join(User u) { members.add(u); }
    void send(String msg, User sender) {
        members.stream().filter(m -> m != sender).forEach(m -> m.receive(msg, sender.name));
    }
}`,
        TypeScript: `class User {
  constructor(public name: string) {}
  receive(message: string, from: string) {
    console.log(\`[\${this.name}] \${from}: \${message}\`);
  }
}

class ChatRoom {
  private members: User[] = [];
  constructor(public name: string) {}

  join(user: User) { this.members.push(user); }
  leave(user: User) { this.members = this.members.filter(m => m !== user); }

  send(message: string, sender: User) {
    this.members
      .filter(m => m !== sender)
      .forEach(m => m.receive(message, sender.name));
  }
}

const room = new ChatRoom("general");
const alice = new User("Alice");
const bob = new User("Bob");
room.join(alice);
room.join(bob);
room.send("Hello!", alice);`,
        Rust: `struct User { name: String }
impl User {
    fn receive(&self, msg: &str, from: &str) {
        println!("[{}] {}: {}", self.name, from, msg);
    }
}

struct ChatRoom { members: Vec<User> }
impl ChatRoom {
    fn new() -> Self { Self { members: vec![] } }
    fn join(&mut self, user: User) { self.members.push(user); }
    fn send(&self, msg: &str, sender_name: &str) {
        for m in &self.members {
            if m.name != sender_name { m.receive(msg, sender_name); }
        }
    }
}

fn main() {
    let mut room = ChatRoom::new();
    room.join(User { name: "Alice".into() });
    room.join(User { name: "Bob".into() });
    room.send("Hello!", "Alice");
}`,
      },
      considerations: [
        "Message ordering guarantees in concurrent environments",
        "Handle disconnected users gracefully (remove from members list)",
        "Message history for users who rejoin",
        "Rate limiting to prevent spam",
        "Consider async notification for large rooms",
      ],
    },
    {
      id: 5,
      title: "Reactive Data Binding — Observable Properties",
      domain: "Frontend Frameworks",
      problem:
        "A UI framework needs reactive data binding where changing a model property automatically updates all bound UI elements. Manual synchronization between model and views is error-prone and verbose.",
      solution:
        "Each model property is wrapped in an Observable (Subject). UI elements subscribe as Observers. Setting the observable's value triggers all bound elements to re-render.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="190" height="70" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">Observable&lt;T&gt;</text>
  <line x1="10" y1="32" x2="200" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-value: T</text>
  <text x="18" y="62" class="s-member s-diagram-member">+subscribe(fn): unsub</text>
  <text x="18" y="76" class="s-member s-diagram-member">+set(value: T): void</text>
  <rect x="250" y="10" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="330" y="28" text-anchor="middle" class="s-title s-diagram-title">Subscriber&lt;T&gt;</text>
  <line x1="250" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="258" y="48" class="s-member s-diagram-member">+(value: T) =&gt; void</text>
</svg>`,
      code: {
        Python: `from typing import TypeVar, Generic, Callable

T = TypeVar("T")

class Observable(Generic[T]):
    def __init__(self, value: T):
        self._value = value
        self._subscribers: list[Callable[[T], None]] = []

    @property
    def value(self) -> T:
        return self._value

    @value.setter
    def value(self, new_val: T) -> None:
        if new_val != self._value:
            self._value = new_val
            for sub in self._subscribers:
                sub(new_val)

    def subscribe(self, fn: Callable[[T], None]) -> Callable[[], None]:
        self._subscribers.append(fn)
        fn(self._value)  # immediate initial call
        return lambda: self._subscribers.remove(fn)

# ── Usage ──
name = Observable("Alice")
unsub = name.subscribe(lambda v: print(f"Name changed to: {v}"))
name.value = "Bob"   # Name changed to: Bob
name.value = "Carol"  # Name changed to: Carol
unsub()
name.value = "Dave"   # (no output — unsubscribed)`,
        Go: `package main

import "fmt"

type Observable struct {
	value       string
	subscribers []func(string)
}

func NewObservable(initial string) *Observable {
	return &Observable{value: initial}
}

func (o *Observable) Subscribe(fn func(string)) {
	o.subscribers = append(o.subscribers, fn)
	fn(o.value) // initial call
}

func (o *Observable) Set(value string) {
	if value != o.value {
		o.value = value
		for _, fn := range o.subscribers { fn(value) }
	}
}

func main() {
	name := NewObservable("Alice")
	name.Subscribe(func(v string) { fmt.Printf("Name: %s\\n", v) })
	name.Set("Bob")
	name.Set("Carol")
}`,
        Java: `import java.util.*;
import java.util.function.Consumer;

class Observable<T> {
    private T value;
    private final List<Consumer<T>> subscribers = new ArrayList<>();

    Observable(T initial) { this.value = initial; }

    Runnable subscribe(Consumer<T> fn) {
        subscribers.add(fn);
        fn.accept(value);
        return () -> subscribers.remove(fn);
    }

    void set(T newVal) {
        if (!Objects.equals(newVal, value)) {
            value = newVal;
            subscribers.forEach(s -> s.accept(newVal));
        }
    }

    T get() { return value; }

    public static void main(String[] args) {
        var name = new Observable<>("Alice");
        var unsub = name.subscribe(v -> System.out.println("Name: " + v));
        name.set("Bob");
        unsub.run();
        name.set("Carol"); // no output
    }
}`,
        TypeScript: `class Observable<T> {
  private subscribers: ((value: T) => void)[] = [];

  constructor(private _value: T) {}

  get value(): T { return this._value; }

  set(newValue: T): void {
    if (newValue !== this._value) {
      this._value = newValue;
      this.subscribers.forEach(fn => fn(newValue));
    }
  }

  subscribe(fn: (value: T) => void): () => void {
    this.subscribers.push(fn);
    fn(this._value);  // initial notification
    return () => { this.subscribers = this.subscribers.filter(s => s !== fn); };
  }
}

// ── Usage ──
const name = new Observable("Alice");
const unsub = name.subscribe(v => console.log(\`Name: \${v}\`));
name.set("Bob");    // Name: Bob
name.set("Carol");  // Name: Carol
unsub();
name.set("Dave");   // (no output)`,
        Rust: `use std::cell::RefCell;
use std::rc::Rc;

struct Observable<T: Clone + PartialEq> {
    value: T,
    subscribers: Vec<Box<dyn Fn(&T)>>,
}

impl<T: Clone + PartialEq> Observable<T> {
    fn new(value: T) -> Self { Self { value, subscribers: vec![] } }

    fn subscribe(&mut self, f: Box<dyn Fn(&T)>) {
        f(&self.value);
        self.subscribers.push(f);
    }

    fn set(&mut self, new_val: T) {
        if new_val != self.value {
            self.value = new_val;
            for s in &self.subscribers { s(&self.value); }
        }
    }
}

fn main() {
    let mut name = Observable::new("Alice".to_string());
    name.subscribe(Box::new(|v| println!("Name: {}", v)));
    name.set("Bob".to_string());
    name.set("Carol".to_string());
}`,
      },
      considerations: [
        "Prevent infinite loops from circular dependencies between observables",
        "Batch multiple changes into a single notification (like React batching)",
        "Computed observables that derive from other observables (like MobX)",
        "Memory management: subscriptions must be cleaned up to avoid leaks",
        "Equality check to skip notification when value hasn't actually changed",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Start with the Push Model for simple systems. Use Event Bus when you need to decouple subjects and observers completely. Use Pull Model when observers need to query selectively.",

  variants: [
    {
      id: 1,
      name: "Push Model",
      description:
        "The Subject pushes the complete new state to all observers through the update(state) method. Observers receive the data they need directly.",
      code: {
        Python: `class Subject:
    def __init__(self):
        self._observers: list = []
        self._state = None

    def subscribe(self, observer):
        self._observers.append(observer)

    def set_state(self, state):
        self._state = state
        self._notify()

    def _notify(self):
        for obs in self._observers:
            obs.update(self._state)  # push state directly

class Observer:
    def update(self, state):
        print(f"Received: {state}")`,
        Go: `type Observer interface{ Update(state interface{}) }

type Subject struct {
	observers []Observer
	state     interface{}
}
func (s *Subject) Subscribe(o Observer) { s.observers = append(s.observers, o) }
func (s *Subject) SetState(state interface{}) {
	s.state = state
	for _, o := range s.observers { o.Update(state) } // push
}`,
        Java: `interface Observer { void update(Object state); }

class Subject {
    private final List<Observer> observers = new ArrayList<>();
    private Object state;
    void subscribe(Observer o) { observers.add(o); }
    void setState(Object s) {
        state = s;
        observers.forEach(o -> o.update(state)); // push
    }
}`,
        TypeScript: `interface Observer<T> { update(state: T): void; }

class Subject<T> {
  private observers: Observer<T>[] = [];
  private state!: T;

  subscribe(o: Observer<T>) { this.observers.push(o); }

  setState(state: T) {
    this.state = state;
    this.observers.forEach(o => o.update(state)); // push
  }
}`,
        Rust: `trait Observer { fn update(&self, state: &str); }

struct Subject {
    observers: Vec<Box<dyn Observer>>,
    state: String,
}
impl Subject {
    fn set_state(&mut self, state: String) {
        self.state = state;
        for o in &self.observers { o.update(&self.state); }
    }
}`,
      },
      pros: [
        "Simple and straightforward — observers always get the latest state",
        "No back-reference to the subject needed in observers",
        "Predictable data flow — update always includes the state",
      ],
      cons: [
        "May send data observers don't need — wasteful for large states",
        "Observers can't choose what data to receive",
        "All observers get the same payload regardless of their needs",
      ],
    },
    {
      id: 2,
      name: "Pull Model",
      description:
        "The Subject notifies observers that something changed (with no data). Observers query the Subject for the specific data they need.",
      code: {
        Python: `class Subject:
    def __init__(self):
        self._observers = []
        self._temp = 0.0
        self._humidity = 0.0

    def subscribe(self, observer):
        self._observers.append(observer)

    def set_readings(self, temp, humidity):
        self._temp = temp
        self._humidity = humidity
        for obs in self._observers:
            obs.update(self)  # pass self — observer pulls what it needs

class TempDisplay:
    def update(self, subject):
        print(f"Temp: {subject._temp}")  # pulls only temp

class HumidityDisplay:
    def update(self, subject):
        print(f"Humidity: {subject._humidity}")  # pulls only humidity`,
        Go: `type Observer interface{ Update(subject *Subject) }

type Subject struct {
	observers             []Observer
	Temp, Humidity float64
}
func (s *Subject) SetReadings(t, h float64) {
	s.Temp = t
	s.Humidity = h
	for _, o := range s.observers { o.Update(s) } // pass self
}

type TempDisplay struct{}
func (d *TempDisplay) Update(s *Subject) {
	fmt.Printf("Temp: %.1f\\n", s.Temp) // pull only temp
}`,
        Java: `interface Observer { void update(Subject subject); }

class Subject {
    List<Observer> observers = new ArrayList<>();
    double temp, humidity;
    void setReadings(double t, double h) {
        temp = t; humidity = h;
        observers.forEach(o -> o.update(this)); // pass self
    }
}

class TempDisplay implements Observer {
    public void update(Subject s) {
        System.out.printf("Temp: %.1f%n", s.temp); // pull only temp
    }
}`,
        TypeScript: `interface Observer { update(subject: WeatherStation): void; }

class WeatherStation {
  observers: Observer[] = [];
  temp = 0; humidity = 0;

  setReadings(t: number, h: number) {
    this.temp = t; this.humidity = h;
    this.observers.forEach(o => o.update(this)); // pass this
  }
}

class TempDisplay implements Observer {
  update(station: WeatherStation) {
    console.log(\`Temp: \${station.temp}\`); // pull only temp
  }
}`,
        Rust: `trait Observer { fn update(&self, subject: &Subject); }

struct Subject { observers: Vec<Box<dyn Observer>>, pub temp: f64, pub humidity: f64 }
impl Subject {
    fn set_readings(&mut self, t: f64, h: f64) {
        self.temp = t; self.humidity = h;
        for o in &self.observers { o.update(self); }
    }
}`,
      },
      pros: [
        "Observers pull only the data they need — efficient for large states",
        "Subject doesn't need to know what data each observer wants",
        "More flexible — observers can query different aspects of state",
      ],
      cons: [
        "Creates coupling between observer and subject (observer needs subject reference)",
        "Observer must know the Subject's API to query it",
        "More complex — notify + query instead of just receive",
      ],
    },
    {
      id: 3,
      name: "Event Bus / Mediator",
      description:
        "Introduce a central Event Bus that decouples subjects and observers completely. Publishers emit events to the bus; subscribers listen to event types on the bus. Neither knows the other exists.",
      code: {
        Python: `from collections import defaultdict
from typing import Any, Callable

class EventBus:
    _listeners: dict[str, list[Callable]] = defaultdict(list)

    @classmethod
    def subscribe(cls, event: str, handler: Callable) -> None:
        cls._listeners[event].append(handler)

    @classmethod
    def publish(cls, event: str, data: Any = None) -> None:
        for handler in cls._listeners[event]:
            handler(data)

# Publisher (doesn't know about subscribers)
class OrderService:
    def place_order(self, order):
        # business logic
        EventBus.publish("order.placed", order)

# Subscriber (doesn't know about publisher)
EventBus.subscribe("order.placed", lambda o: print(f"Email: order {o}"))
EventBus.subscribe("order.placed", lambda o: print(f"Inventory: update for {o}"))`,
        Go: `package main

import "fmt"

type Handler func(data interface{})

var bus = map[string][]Handler{}

func Subscribe(event string, h Handler) {
	bus[event] = append(bus[event], h)
}

func Publish(event string, data interface{}) {
	for _, h := range bus[event] { h(data) }
}

func main() {
	Subscribe("order.placed", func(d interface{}) { fmt.Println("Email:", d) })
	Subscribe("order.placed", func(d interface{}) { fmt.Println("Inventory:", d) })
	Publish("order.placed", "ORD-123")
}`,
        Java: `import java.util.*;
import java.util.function.Consumer;

class EventBus {
    private static final Map<String, List<Consumer<Object>>> listeners = new HashMap<>();
    static void subscribe(String event, Consumer<Object> h) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(h);
    }
    static void publish(String event, Object data) {
        listeners.getOrDefault(event, List.of()).forEach(h -> h.accept(data));
    }
}

// Usage
// EventBus.subscribe("order.placed", o -> System.out.println("Email: " + o));
// EventBus.publish("order.placed", "ORD-123");`,
        TypeScript: `class EventBus {
  private static listeners = new Map<string, Function[]>();

  static subscribe(event: string, handler: Function): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push(handler);
    this.listeners.set(event, list);
    return () => this.listeners.set(event, list.filter(h => h !== handler));
  }

  static publish(event: string, data?: unknown): void {
    this.listeners.get(event)?.forEach(h => h(data));
  }
}

// Publisher
class OrderService {
  placeOrder(order: string) {
    EventBus.publish("order.placed", order);
  }
}

// Subscriber (completely decoupled)
EventBus.subscribe("order.placed", (o: string) => console.log(\`Email: \${o}\`));`,
        Rust: `use std::collections::HashMap;

type Handler = Box<dyn Fn(&str)>;

struct EventBus { listeners: HashMap<String, Vec<Handler>> }
impl EventBus {
    fn new() -> Self { Self { listeners: HashMap::new() } }
    fn subscribe(&mut self, event: &str, handler: Handler) {
        self.listeners.entry(event.into()).or_default().push(handler);
    }
    fn publish(&self, event: &str, data: &str) {
        if let Some(handlers) = self.listeners.get(event) {
            for h in handlers { h(data); }
        }
    }
}

fn main() {
    let mut bus = EventBus::new();
    bus.subscribe("order.placed", Box::new(|o| println!("Email: {}", o)));
    bus.publish("order.placed", "ORD-123");
}`,
      },
      pros: [
        "Maximum decoupling — publishers and subscribers don't know each other",
        "Easy to add new publishers or subscribers independently",
        "Scales well in large systems with many event types",
      ],
      cons: [
        "Event flow is implicit — harder to trace and debug",
        "Global bus can become a dumping ground for all events",
        "Risk of event name collisions without a naming convention",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Coupling", "Data Flow", "Complexity", "Best For",
  ],
  comparisonRows: [
    ["Push Model", "Low (interface)", "Subject → Observer", "Low", "Simple state broadcasting"],
    ["Pull Model", "Medium (reference)", "Observer → Subject", "Medium", "Large states, selective queries"],
    ["Event Bus", "None (fully decoupled)", "Publisher → Bus → Subscriber", "Medium", "Large systems, microservices"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Behavioral" },
    {
      aspect: "Key Benefit",
      detail:
        "Decouples the source of change from consumers — add new observers without modifying the subject. The subject broadcasts; observers react independently.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Memory leaks from forgotten subscriptions (lapsed listener problem). Always provide and call unsubscribe, especially in UI components that mount/unmount.",
    },
    {
      aspect: "vs. Mediator",
      detail:
        "Observer is one-to-many (one subject, many observers). Mediator is many-to-many (centralizes complex interactions between multiple objects).",
    },
    {
      aspect: "vs. Pub/Sub",
      detail:
        "Observer typically has direct references between subject and observer. Pub/Sub introduces a message broker/bus that fully decouples publishers from subscribers.",
    },
    {
      aspect: "When to Use",
      detail:
        "Event handling, data binding, real-time feeds, notification systems, any scenario where multiple objects need to react to state changes without tight coupling.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When only one consumer exists (just call it directly). When notification order matters critically. When the overhead of maintaining subscriber lists isn't justified.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Mediator (centralizes multi-object communication), Command (encapsulates the action to perform), Chain of Responsibility (passes along a chain instead of broadcasting)",
    },
  ],

  antiPatterns: [
    {
      name: "Lapsed Listener (Memory Leak)",
      description:
        "Observers subscribe but never unsubscribe, keeping references alive even after the observer is logically destroyed. Common in UI frameworks where components mount/unmount.",
      betterAlternative:
        "Always store and call the unsubscribe function. In React, return cleanup from useEffect. In Angular, use takeUntil or unsubscribe in ngOnDestroy.",
    },
    {
      name: "Notification Storm",
      description:
        "Rapid-fire state changes trigger notify() for each change, overwhelming observers with updates they can't process fast enough.",
      betterAlternative:
        "Debounce or batch notifications. Collect changes and notify once per frame/tick. Use requestAnimationFrame in browsers or a microtask queue.",
    },
    {
      name: "Observer Modifying Subject in update()",
      description:
        "An observer's update() method changes the subject's state, which triggers another notify(), creating infinite recursion.",
      betterAlternative:
        "Use a 'notifying' flag to prevent re-entrant notifications. Or queue state changes and process them after the current notification cycle completes.",
    },
    {
      name: "God Subject (Everything Observable)",
      description:
        "Making every object in the system a Subject, even when nobody observes it. Adds unnecessary complexity and performance overhead.",
      betterAlternative:
        "Only make objects observable when there are actual consumers. Use targeted observation on specific state properties rather than entire objects.",
    },
    {
      name: "Untyped Event Strings",
      description:
        "Using plain strings as event names ('user.login', 'usr.logn') leading to silent failures when event names are misspelled.",
      betterAlternative:
        "Use typed event enums or constants. In TypeScript, use template literal types or a typed EventMap generic to catch typos at compile time.",
    },
  ],
};

export default observerData;
