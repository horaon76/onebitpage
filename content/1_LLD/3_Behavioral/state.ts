import { PatternData } from "@/lib/patterns/types";

const stateData: PatternData = {
  slug: "state",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "State Pattern",
  subtitle:
    "Allow an object to alter its behaviour when its internal state changes — the object will appear to change its class at runtime.",

  intent:
    "Many objects have behaviour that depends on their current state — a TCP connection behaves differently when it's Open vs. Closed vs. Listening, an order acts differently when it's Pending vs. Shipped vs. Delivered, a vending machine responds differently when it has items vs. is empty. Without a pattern, this leads to sprawling switch/case or if/else chains scattered across every method.\n\nThe State pattern encapsulates each state as a separate class implementing a common interface. The context object delegates behaviour to the current state object. When the state changes, the context swaps its state reference to a different implementation — and all subsequent behaviour changes automatically.\n\nUnlike raw conditionals, adding a new state means adding a new class (Open/Closed Principle). Each state class contains only the logic for that state, making it easy to understand, test, and modify independently.",

  classDiagramSvg: `<svg viewBox="0 0 500 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px">
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
  <rect x="10" y="10" width="180" height="75" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">Context</text>
  <line x1="10" y1="32" x2="190" y2="32" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">-state: State</text>
  <text x="20" y="63" class="s-member s-diagram-member">+request(): void</text>
  <text x="20" y="78" class="s-member s-diagram-member">+setState(s: State)</text>
  <!-- State Interface -->
  <rect x="270" y="10" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="370" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; State</text>
  <line x1="270" y1="40" x2="470" y2="40" class="s-diagram-line"/>
  <text x="280" y="56" class="s-member s-diagram-member s-ital">+handle(ctx: Context): void</text>
  <!-- ConcreteStateA -->
  <rect x="230" y="120" width="120" height="45" class="s-box s-diagram-box"/>
  <text x="290" y="138" text-anchor="middle" class="s-title s-diagram-title">StateA</text>
  <line x1="230" y1="142" x2="350" y2="142" class="s-diagram-line"/>
  <text x="238" y="158" class="s-member s-diagram-member">+handle(ctx)</text>
  <!-- ConcreteStateB -->
  <rect x="370" y="120" width="120" height="45" class="s-box s-diagram-box"/>
  <text x="430" y="138" text-anchor="middle" class="s-title s-diagram-title">StateB</text>
  <line x1="370" y1="142" x2="490" y2="142" class="s-diagram-line"/>
  <text x="378" y="158" class="s-member s-diagram-member">+handle(ctx)</text>
  <!-- Arrows -->
  <line x1="190" y1="30" x2="270" y2="30" class="s-arr s-diagram-arrow"/>
  <line x1="290" y1="120" x2="340" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="430" y1="120" x2="410" y2="65" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Context holds a reference to a State object and delegates behaviour to it via request() → state.handle(ctx). Each ConcreteState implements handle() with logic specific to that state. When a transition occurs, the state calls ctx.setState(new NextState()), swapping the active behaviour. The Context's public API stays the same; only the internal state object changes.",

  diagramComponents: [
    {
      name: "Context",
      description:
        "The object whose behaviour varies by state. It holds a current State reference and delegates all state-dependent operations to it. It exposes setState() so states can trigger transitions.",
    },
    {
      name: "State (Interface)",
      description:
        "Declares the handle() method (or multiple methods) that encapsulate state-specific behaviour. Each concrete state provides its own implementation.",
    },
    {
      name: "ConcreteState",
      description:
        "Implements the State interface for one specific state. Contains the logic for that state and triggers transitions by calling context.setState(nextState). Examples: IdleState, ProcessingState, CompletedState.",
    },
  ],

  solutionDetail:
    "**The Problem:** An object's methods contain sprawling if/else or switch statements checking the current state. Every method must handle every state, and adding a new state means editing every method.\n\n**The State Solution:** Extract each state's behaviour into its own class.\n\n**How It Works:**\n\n1. **Define the State interface**: Declares methods for all state-dependent operations.\n\n2. **Implement ConcreteStates**: Each state class implements the interface with behaviour specific to that state. It can trigger transitions by calling context.setState(newState).\n\n3. **Context delegates to state**: The Context holds a current State reference. Its public methods delegate to state.handle(this).\n\n4. **Transitions swap the state**: When a transition occurs, the current state calls context.setState(nextState). All subsequent calls go to the new state.\n\n**Key Insight:** State objects themselves decide the transitions. Each state knows which state to transition to, keeping the state machine logic distributed across small, focused classes rather than centralized in one massive conditional block.",

  characteristics: [
    "Eliminates conditional statements (if/switch) for state-dependent behaviour",
    "Each state is a separate class — focused, testable, single-responsibility",
    "State transitions are explicit — triggered by states calling setState()",
    "Adding new states is easy — add a class, no existing code changes",
    "The context's public API is stable — behaviour changes internally",
    "States can be shared (flyweight) if they hold no instance-specific data",
    "Models finite state machines (FSM) cleanly in object-oriented code",
  ],

  useCases: [
    {
      id: 1,
      title: "TCP Connection Lifecycle",
      domain: "Networking",
      description:
        "A TCP connection transitions through Listen → Established → Closed. Each state handles open(), send(), close() differently.",
      whySingleton:
        "Each state (Listen, Established, Closed) is a class. The Connection delegates to its current state. Calling close() on Established transitions to Closed; calling close() on Closed is a no-op.",
      code: `interface TCPState { open(ctx): void; close(ctx): void; send(ctx, data): void; }
class Established implements TCPState {
  close(ctx) { ctx.setState(new Closed()); }
  send(ctx, data) { transmit(data); }
}`,
    },
    {
      id: 2,
      title: "Order Processing Pipeline",
      domain: "E-Commerce",
      description:
        "An order moves through Pending → Paid → Shipped → Delivered. Each state determines which actions are valid (cancel, ship, confirm delivery).",
      whySingleton:
        "PendingState allows cancel() and pay(). PaidState allows ship(). ShippedState allows deliver(). Each transition swaps the state.",
      code: `class PendingState implements OrderState {
  pay(ctx) { processPayment(); ctx.setState(new PaidState()); }
  cancel(ctx) { refund(); ctx.setState(new CancelledState()); }
  ship(ctx) { throw new Error("Cannot ship unpaid order"); }
}`,
    },
    {
      id: 3,
      title: "Vending Machine",
      domain: "Embedded Systems",
      description:
        "A vending machine has states: NoCoin, HasCoin, Dispensing, SoldOut. Inserting a coin, selecting a product, and dispensing have different effects in each state.",
      whySingleton:
        "NoCoin.insertCoin() transitions to HasCoin. HasCoin.selectProduct() transitions to Dispensing. SoldOut rejects all inputs.",
      code: `class HasCoinState implements VendingState {
  select(ctx, product) {
    if (ctx.inventory[product] > 0) {
      ctx.setState(new DispensingState(product));
    }
  }
  insertCoin(ctx) { /* already has coin - return it */ }
}`,
    },
    {
      id: 4,
      title: "Media Player Controls",
      domain: "Multimedia",
      description:
        "A media player has Playing, Paused, and Stopped states. The play/pause/stop buttons behave differently in each state.",
      whySingleton:
        "Playing.pause() transitions to Paused. Paused.play() resumes and transitions to Playing. Stopped.play() starts from the beginning.",
      code: `class PlayingState implements PlayerState {
  pause(ctx) { ctx.audio.pause(); ctx.setState(new PausedState()); }
  play(ctx) { /* already playing */ }
  stop(ctx) { ctx.audio.stop(); ctx.setState(new StoppedState()); }
}`,
    },
    {
      id: 5,
      title: "Document Workflow (Draft → Review → Published)",
      domain: "CMS / Publishing",
      description:
        "A document transitions through Draft → Review → Published. Editing is only allowed in Draft, approval only in Review, and Published is read-only.",
      whySingleton:
        "DraftState.edit() works normally. ReviewState.edit() throws 'Cannot edit during review'. PublishedState.edit() throws 'Cannot edit published content'.",
      code: `class DraftState implements DocState {
  edit(ctx, content) { ctx.content = content; }
  submit(ctx) { ctx.setState(new ReviewState()); }
  publish(ctx) { throw new Error("Must submit for review first"); }
}`,
    },
    {
      id: 6,
      title: "Authentication Session",
      domain: "Security",
      description:
        "A user session has Anonymous, Authenticated, and Locked states. API access, login attempts, and session operations behave differently in each state.",
      whySingleton:
        "Anonymous.login() validates credentials and transitions to Authenticated. Authenticated.access() works. Locked rejects everything until timeout.",
      code: `class AnonymousState implements SessionState {
  login(ctx, creds) {
    if (validate(creds)) ctx.setState(new AuthenticatedState(creds.user));
    else { ctx.failedAttempts++; if (ctx.failedAttempts > 3) ctx.setState(new LockedState()); }
  }
  access(ctx) { throw new Error("Not authenticated"); }
}`,
    },
    {
      id: 7,
      title: "Traffic Light Controller",
      domain: "IoT / Civil Engineering",
      description:
        "A traffic light cycles through Red → Green → Yellow → Red. Each state has a different duration and determines which direction has right-of-way.",
      whySingleton:
        "RedState.tick() counts down and transitions to GreenState. GreenState.tick() transitions to YellowState. Each state knows its duration.",
      code: `class RedState implements LightState {
  duration = 30;
  tick(ctx) {
    ctx.timer--;
    if (ctx.timer <= 0) { ctx.timer = new GreenState().duration; ctx.setState(new GreenState()); }
  }
  canCross() { return false; }
}`,
    },
    {
      id: 8,
      title: "Game Character Modes",
      domain: "Game Development",
      description:
        "A game character has Normal, Powered-Up, and Invincible states. Taking damage, collecting power-ups, and attacks behave differently in each mode.",
      whySingleton:
        "NormalState.takeDamage() reduces health. InvincibleState.takeDamage() is a no-op. PoweredUpState.attack() deals double damage.",
      code: `class InvincibleState implements CharState {
  takeDamage(ctx, amount) { /* no-op — invincible */ }
  attack(ctx, target) { target.takeDamage(ctx.baseDamage * 3); }
  tick(ctx) { ctx.invTimer--; if (ctx.invTimer <= 0) ctx.setState(new NormalState()); }
}`,
    },
    {
      id: 9,
      title: "CI/CD Pipeline Stage",
      domain: "DevOps",
      description:
        "A CI pipeline has Building, Testing, Deploying, and Failed states. Each stage allows different actions (retry, skip, rollback).",
      whySingleton:
        "BuildingState.onSuccess() transitions to TestingState. TestingState.onFailure() transitions to FailedState. FailedState.retry() restarts from Building.",
      code: `class TestingState implements PipeState {
  onSuccess(ctx) { ctx.setState(new DeployingState()); }
  onFailure(ctx, error) { ctx.log(error); ctx.setState(new FailedState(error)); }
  retry(ctx) { throw new Error("Tests still running"); }
}`,
    },
    {
      id: 10,
      title: "Elevator Controller",
      domain: "Building Automation",
      description:
        "An elevator has Idle, MovingUp, MovingDown, and DoorOpen states. Floor requests, door operations, and movement differ per state.",
      whySingleton:
        "IdleState.requestFloor() decides direction and transitions to MovingUp or MovingDown. DoorOpenState.close() transitions back to Idle.",
      code: `class IdleState implements ElevatorState {
  request(ctx, floor) {
    if (floor > ctx.currentFloor) ctx.setState(new MovingUpState(floor));
    else if (floor < ctx.currentFloor) ctx.setState(new MovingDownState(floor));
    else ctx.setState(new DoorOpenState());
  }
}`,
    },
    {
      id: 11,
      title: "Subscription Billing Cycle",
      domain: "SaaS / Finance",
      description:
        "A subscription has Trial, Active, PastDue, and Cancelled states. Billing, feature access, and upgrade options vary per state.",
      whySingleton:
        "TrialState.expire() transitions to Active (if card on file) or Cancelled. PastDueState restricts features and sends reminders.",
      code: `class PastDueState implements SubState {
  accessFeature(ctx, feature) {
    if (feature.tier === "premium") throw new Error("Payment required");
    return feature.execute();
  }
  charge(ctx) {
    if (processPayment(ctx)) ctx.setState(new ActiveState());
    else if (daysPastDue(ctx) > 30) ctx.setState(new CancelledState());
  }
}`,
    },
    {
      id: 12,
      title: "Circuit Breaker Pattern",
      domain: "Microservices / Resilience",
      description:
        "A circuit breaker has Closed, Open, and HalfOpen states. Each state handles call() and recordFailure() differently to protect downstream services.",
      whySingleton:
        "ClosedState counts failures and trips to Open when threshold is exceeded. OpenState rejects calls until timeout, then transitions to HalfOpen for a test call.",
      code: `class OpenState implements CBState {
  call(ctx, fn) { throw new Error("Circuit open — fast fail"); }
  tick(ctx) {
    ctx.timer--;
    if (ctx.timer <= 0) ctx.setState(new HalfOpenState());
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Order Lifecycle — E-Commerce",
      domain: "E-Commerce",
      problem:
        "An order moves through Pending → Paid → Shipped → Delivered → (optionally Cancelled). Each state allows different operations and transitions. Without the State pattern, every order method contains a switch on the current status string.",
      solution:
        "Each state is a class implementing OrderState. The Order delegates to its current state. States trigger transitions by calling order.setState(nextState).",
      classDiagramSvg: `<svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="70" class="s-box s-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="s-title s-diagram-title">Order</text>
  <line x1="10" y1="32" x2="180" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-state: OrderState</text>
  <text x="18" y="62" class="s-member s-diagram-member">+pay(), ship(), deliver()</text>
  <text x="18" y="76" class="s-member s-diagram-member">+cancel()</text>
  <rect x="230" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="28" text-anchor="middle" class="s-title s-diagram-title">OrderState</text>
  <line x1="230" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="238" y="48" class="s-member s-diagram-member">+pay(order)</text>
  <text x="238" y="62" class="s-member s-diagram-member">+ship(order), cancel(order)</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class OrderState(ABC):
    @abstractmethod
    def pay(self, order: "Order") -> None: ...
    @abstractmethod
    def ship(self, order: "Order") -> None: ...
    @abstractmethod
    def cancel(self, order: "Order") -> None: ...
    @abstractmethod
    def status(self) -> str: ...

class PendingState(OrderState):
    def pay(self, order):
        print("Payment processed")
        order.set_state(PaidState())
    def ship(self, order):
        raise Exception("Cannot ship unpaid order")
    def cancel(self, order):
        print("Order cancelled")
        order.set_state(CancelledState())
    def status(self): return "PENDING"

class PaidState(OrderState):
    def pay(self, order):
        raise Exception("Already paid")
    def ship(self, order):
        print("Order shipped")
        order.set_state(ShippedState())
    def cancel(self, order):
        print("Refund issued, order cancelled")
        order.set_state(CancelledState())
    def status(self): return "PAID"

class ShippedState(OrderState):
    def pay(self, order): raise Exception("Already paid")
    def ship(self, order): raise Exception("Already shipped")
    def cancel(self, order): raise Exception("Cannot cancel shipped order")
    def status(self): return "SHIPPED"

class CancelledState(OrderState):
    def pay(self, order): raise Exception("Order is cancelled")
    def ship(self, order): raise Exception("Order is cancelled")
    def cancel(self, order): raise Exception("Already cancelled")
    def status(self): return "CANCELLED"

class Order:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self._state: OrderState = PendingState()

    def set_state(self, state: OrderState) -> None:
        print(f"  [{self._state.status()} → {state.status()}]")
        self._state = state

    def pay(self) -> None: self._state.pay(self)
    def ship(self) -> None: self._state.ship(self)
    def cancel(self) -> None: self._state.cancel(self)
    def status(self) -> str: return self._state.status()

# ── Usage ──
order = Order("ORD-001")
order.pay()     # Payment processed  [PENDING → PAID]
order.ship()    # Order shipped      [PAID → SHIPPED]`,
        Go: `package main

import "fmt"

type OrderState interface {
	Pay(o *Order)
	Ship(o *Order)
	Cancel(o *Order)
	Status() string
}

type Order struct {
	ID    string
	state OrderState
}

func NewOrder(id string) *Order { return &Order{ID: id, state: &PendingState{}} }
func (o *Order) SetState(s OrderState) {
	fmt.Printf("  [%s → %s]\\n", o.state.Status(), s.Status())
	o.state = s
}
func (o *Order) Pay()    { o.state.Pay(o) }
func (o *Order) Ship()   { o.state.Ship(o) }
func (o *Order) Cancel() { o.state.Cancel(o) }

type PendingState struct{}
func (s *PendingState) Pay(o *Order)    { fmt.Println("Payment processed"); o.SetState(&PaidState{}) }
func (s *PendingState) Ship(o *Order)   { panic("cannot ship unpaid") }
func (s *PendingState) Cancel(o *Order) { fmt.Println("Cancelled"); o.SetState(&CancelledState{}) }
func (s *PendingState) Status() string  { return "PENDING" }

type PaidState struct{}
func (s *PaidState) Pay(o *Order)    { panic("already paid") }
func (s *PaidState) Ship(o *Order)   { fmt.Println("Shipped"); o.SetState(&ShippedState{}) }
func (s *PaidState) Cancel(o *Order) { fmt.Println("Refunded"); o.SetState(&CancelledState{}) }
func (s *PaidState) Status() string  { return "PAID" }

type ShippedState struct{}
func (s *ShippedState) Pay(o *Order)    { panic("already paid") }
func (s *ShippedState) Ship(o *Order)   { panic("already shipped") }
func (s *ShippedState) Cancel(o *Order) { panic("cannot cancel shipped") }
func (s *ShippedState) Status() string  { return "SHIPPED" }

type CancelledState struct{}
func (s *CancelledState) Pay(o *Order)    { panic("cancelled") }
func (s *CancelledState) Ship(o *Order)   { panic("cancelled") }
func (s *CancelledState) Cancel(o *Order) { panic("already cancelled") }
func (s *CancelledState) Status() string  { return "CANCELLED" }

func main() {
	o := NewOrder("ORD-001")
	o.Pay()
	o.Ship()
}`,
        Java: `interface OrderState {
    void pay(Order o);
    void ship(Order o);
    void cancel(Order o);
    String status();
}

class Order {
    private OrderState state = new PendingState();
    final String id;
    Order(String id) { this.id = id; }
    void setState(OrderState s) {
        System.out.printf("  [%s → %s]%n", state.status(), s.status());
        state = s;
    }
    void pay() { state.pay(this); }
    void ship() { state.ship(this); }
    void cancel() { state.cancel(this); }
}

class PendingState implements OrderState {
    public void pay(Order o) { System.out.println("Payment processed"); o.setState(new PaidState()); }
    public void ship(Order o) { throw new IllegalStateException("Cannot ship unpaid"); }
    public void cancel(Order o) { System.out.println("Cancelled"); o.setState(new CancelledState()); }
    public String status() { return "PENDING"; }
}

class PaidState implements OrderState {
    public void pay(Order o) { throw new IllegalStateException("Already paid"); }
    public void ship(Order o) { System.out.println("Shipped"); o.setState(new ShippedState()); }
    public void cancel(Order o) { System.out.println("Refunded"); o.setState(new CancelledState()); }
    public String status() { return "PAID"; }
}

class ShippedState implements OrderState {
    public void pay(Order o) { throw new IllegalStateException("Already paid"); }
    public void ship(Order o) { throw new IllegalStateException("Already shipped"); }
    public void cancel(Order o) { throw new IllegalStateException("Cannot cancel shipped order"); }
    public String status() { return "SHIPPED"; }
}

class CancelledState implements OrderState {
    public void pay(Order o) { throw new IllegalStateException("Cancelled"); }
    public void ship(Order o) { throw new IllegalStateException("Cancelled"); }
    public void cancel(Order o) { throw new IllegalStateException("Already cancelled"); }
    public String status() { return "CANCELLED"; }
}`,
        TypeScript: `interface OrderState {
  pay(order: Order): void;
  ship(order: Order): void;
  cancel(order: Order): void;
  status(): string;
}

class Order {
  private state: OrderState = new PendingState();
  constructor(public readonly id: string) {}

  setState(s: OrderState) {
    console.log(\`  [\${this.state.status()} → \${s.status()}]\`);
    this.state = s;
  }
  pay() { this.state.pay(this); }
  ship() { this.state.ship(this); }
  cancel() { this.state.cancel(this); }
}

class PendingState implements OrderState {
  pay(o: Order) { console.log("Payment processed"); o.setState(new PaidState()); }
  ship(_o: Order) { throw new Error("Cannot ship unpaid"); }
  cancel(o: Order) { console.log("Cancelled"); o.setState(new CancelledState()); }
  status() { return "PENDING"; }
}

class PaidState implements OrderState {
  pay(_o: Order) { throw new Error("Already paid"); }
  ship(o: Order) { console.log("Shipped"); o.setState(new ShippedState()); }
  cancel(o: Order) { console.log("Refunded"); o.setState(new CancelledState()); }
  status() { return "PAID"; }
}

class ShippedState implements OrderState {
  pay() { throw new Error("Already paid"); }
  ship() { throw new Error("Already shipped"); }
  cancel() { throw new Error("Cannot cancel shipped"); }
  status() { return "SHIPPED"; }
}

class CancelledState implements OrderState {
  pay() { throw new Error("Cancelled"); }
  ship() { throw new Error("Cancelled"); }
  cancel() { throw new Error("Already cancelled"); }
  status() { return "CANCELLED"; }
}

const order = new Order("ORD-001");
order.pay();
order.ship();`,
        Rust: `trait OrderState {
    fn pay(&self, order: &mut Order);
    fn ship(&self, order: &mut Order);
    fn cancel(&self, order: &mut Order);
    fn status(&self) -> &str;
}

struct Order { id: String, state: Box<dyn OrderState> }
impl Order {
    fn new(id: &str) -> Self { Self { id: id.into(), state: Box::new(PendingState) } }
    fn set_state(&mut self, s: Box<dyn OrderState>) {
        println!("  [{} → {}]", self.state.status(), s.status());
        self.state = s;
    }
}

struct PendingState;
impl OrderState for PendingState {
    fn pay(&self, o: &mut Order) { println!("Payment processed"); o.set_state(Box::new(PaidState)); }
    fn ship(&self, _o: &mut Order) { panic!("Cannot ship unpaid"); }
    fn cancel(&self, o: &mut Order) { println!("Cancelled"); o.set_state(Box::new(CancelledState)); }
    fn status(&self) -> &str { "PENDING" }
}

struct PaidState;
impl OrderState for PaidState {
    fn pay(&self, _o: &mut Order) { panic!("Already paid"); }
    fn ship(&self, o: &mut Order) { println!("Shipped"); o.set_state(Box::new(ShippedState)); }
    fn cancel(&self, o: &mut Order) { println!("Refunded"); o.set_state(Box::new(CancelledState)); }
    fn status(&self) -> &str { "PAID" }
}

struct ShippedState;
impl OrderState for ShippedState {
    fn pay(&self, _: &mut Order) { panic!("Already paid"); }
    fn ship(&self, _: &mut Order) { panic!("Already shipped"); }
    fn cancel(&self, _: &mut Order) { panic!("Cannot cancel shipped"); }
    fn status(&self) -> &str { "SHIPPED" }
}

struct CancelledState;
impl OrderState for CancelledState {
    fn pay(&self, _: &mut Order) { panic!("Cancelled"); }
    fn ship(&self, _: &mut Order) { panic!("Cancelled"); }
    fn cancel(&self, _: &mut Order) { panic!("Already cancelled"); }
    fn status(&self) -> &str { "CANCELLED" }
}

fn main() {
    let mut o = Order::new("ORD-001");
    o.state.pay(&mut o); // won't compile — need to take state out
}`,
      },
      considerations: [
        "Invalid transitions should throw clear error messages",
        "Add a transition log for auditing",
        "Consider making states flyweight (shared) if they carry no order-specific data",
        "Persistence: serialize state as a string, reconstruct state object on load",
        "Guard against concurrent transitions in multithreaded environments",
      ],
    },
    {
      id: 2,
      title: "Media Player — Play/Pause/Stop",
      domain: "Multimedia",
      problem:
        "A media player needs to respond to play, pause, and stop commands differently depending on whether it's currently playing, paused, or stopped. Without State, every command handler has a three-way if/else.",
      solution:
        "PlayingState, PausedState, and StoppedState each implement PlayerState. The Player delegates button presses to its current state.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="65" class="s-box s-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="s-title s-diagram-title">Player</text>
  <line x1="10" y1="32" x2="180" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-state: PlayerState</text>
  <text x="18" y="62" class="s-member s-diagram-member">+play(), pause(), stop()</text>
  <rect x="230" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="28" text-anchor="middle" class="s-title s-diagram-title">PlayerState</text>
  <line x1="230" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="238" y="48" class="s-member s-diagram-member">+play(p), pause(p), stop(p)</text>
</svg>`,
      code: {
        Python: `class PlayerState:
    def play(self, player): ...
    def pause(self, player): ...
    def stop(self, player): ...

class StoppedState(PlayerState):
    def play(self, player):
        player.audio.play_from_start()
        player.set_state(PlayingState())
    def pause(self, player): pass  # no-op
    def stop(self, player): pass   # already stopped

class PlayingState(PlayerState):
    def play(self, player): pass  # already playing
    def pause(self, player):
        player.audio.pause()
        player.set_state(PausedState())
    def stop(self, player):
        player.audio.stop()
        player.set_state(StoppedState())

class PausedState(PlayerState):
    def play(self, player):
        player.audio.resume()
        player.set_state(PlayingState())
    def pause(self, player): pass  # already paused
    def stop(self, player):
        player.audio.stop()
        player.set_state(StoppedState())

class Player:
    def __init__(self):
        self._state = StoppedState()
    def set_state(self, s): self._state = s
    def play(self): self._state.play(self)
    def pause(self): self._state.pause(self)
    def stop(self): self._state.stop(self)`,
        Go: `package main

import "fmt"

type PlayerState interface {
	Play(p *Player)
	Pause(p *Player)
	Stop(p *Player)
	Name() string
}

type Player struct{ state PlayerState }
func (p *Player) SetState(s PlayerState) {
	fmt.Printf("[%s → %s]\\n", p.state.Name(), s.Name())
	p.state = s
}
func (p *Player) Play()  { p.state.Play(p) }
func (p *Player) Pause() { p.state.Pause(p) }

type StoppedState struct{}
func (s *StoppedState) Play(p *Player)  { fmt.Println("▶ Playing"); p.SetState(&PlayingState{}) }
func (s *StoppedState) Pause(p *Player) {}
func (s *StoppedState) Stop(p *Player)  {}
func (s *StoppedState) Name() string    { return "Stopped" }

type PlayingState struct{}
func (s *PlayingState) Play(p *Player)  {}
func (s *PlayingState) Pause(p *Player) { fmt.Println("⏸ Paused"); p.SetState(&PausedState{}) }
func (s *PlayingState) Stop(p *Player)  { fmt.Println("⏹ Stopped"); p.SetState(&StoppedState{}) }
func (s *PlayingState) Name() string    { return "Playing" }

type PausedState struct{}
func (s *PausedState) Play(p *Player)  { fmt.Println("▶ Resumed"); p.SetState(&PlayingState{}) }
func (s *PausedState) Pause(p *Player) {}
func (s *PausedState) Stop(p *Player)  { fmt.Println("⏹ Stopped"); p.SetState(&StoppedState{}) }
func (s *PausedState) Name() string    { return "Paused" }

func main() {
	p := &Player{state: &StoppedState{}}
	p.Play()
	p.Pause()
	p.Play()
}`,
        Java: `interface PlayerState {
    void play(Player p);
    void pause(Player p);
    void stop(Player p);
}

class Player {
    private PlayerState state = new StoppedState();
    void setState(PlayerState s) { state = s; }
    void play() { state.play(this); }
    void pause() { state.pause(this); }
    void stop() { state.stop(this); }
}

class StoppedState implements PlayerState {
    public void play(Player p) { System.out.println("▶ Playing"); p.setState(new PlayingState()); }
    public void pause(Player p) { }
    public void stop(Player p) { }
}

class PlayingState implements PlayerState {
    public void play(Player p) { }
    public void pause(Player p) { System.out.println("⏸ Paused"); p.setState(new PausedState()); }
    public void stop(Player p) { System.out.println("⏹ Stopped"); p.setState(new StoppedState()); }
}

class PausedState implements PlayerState {
    public void play(Player p) { System.out.println("▶ Resumed"); p.setState(new PlayingState()); }
    public void pause(Player p) { }
    public void stop(Player p) { System.out.println("⏹ Stopped"); p.setState(new StoppedState()); }
}`,
        TypeScript: `interface PlayerState {
  play(player: Player): void;
  pause(player: Player): void;
  stop(player: Player): void;
}

class Player {
  private state: PlayerState = new StoppedState();
  setState(s: PlayerState) { this.state = s; }
  play() { this.state.play(this); }
  pause() { this.state.pause(this); }
  stop() { this.state.stop(this); }
}

class StoppedState implements PlayerState {
  play(p: Player) { console.log("▶ Playing"); p.setState(new PlayingState()); }
  pause(_p: Player) {}
  stop(_p: Player) {}
}

class PlayingState implements PlayerState {
  play(_p: Player) {}
  pause(p: Player) { console.log("⏸ Paused"); p.setState(new PausedState()); }
  stop(p: Player) { console.log("⏹ Stopped"); p.setState(new StoppedState()); }
}

class PausedState implements PlayerState {
  play(p: Player) { console.log("▶ Resumed"); p.setState(new PlayingState()); }
  pause(_p: Player) {}
  stop(p: Player) { console.log("⏹ Stopped"); p.setState(new StoppedState()); }
}

const player = new Player();
player.play();   // ▶ Playing
player.pause();  // ⏸ Paused
player.play();   // ▶ Resumed`,
        Rust: `trait PlayerState {
    fn play(&self, p: &mut Player);
    fn pause(&self, p: &mut Player);
    fn stop(&self, p: &mut Player);
    fn name(&self) -> &str;
}

struct Player { state: Box<dyn PlayerState> }
impl Player {
    fn new() -> Self { Self { state: Box::new(StoppedState) } }
    fn set_state(&mut self, s: Box<dyn PlayerState>) {
        println!("[{} → {}]", self.state.name(), s.name());
        self.state = s;
    }
}

struct StoppedState;
impl PlayerState for StoppedState {
    fn play(&self, p: &mut Player) { println!("▶ Playing"); p.set_state(Box::new(PlayingState)); }
    fn pause(&self, _p: &mut Player) {}
    fn stop(&self, _p: &mut Player) {}
    fn name(&self) -> &str { "Stopped" }
}

struct PlayingState;
impl PlayerState for PlayingState {
    fn play(&self, _p: &mut Player) {}
    fn pause(&self, p: &mut Player) { println!("⏸ Paused"); p.set_state(Box::new(PausedState)); }
    fn stop(&self, p: &mut Player) { println!("⏹ Stopped"); p.set_state(Box::new(StoppedState)); }
    fn name(&self) -> &str { "Playing" }
}

struct PausedState;
impl PlayerState for PausedState {
    fn play(&self, p: &mut Player) { println!("▶ Resumed"); p.set_state(Box::new(PlayingState)); }
    fn pause(&self, _p: &mut Player) {}
    fn stop(&self, p: &mut Player) { println!("⏹ Stopped"); p.set_state(Box::new(StoppedState)); }
    fn name(&self) -> &str { "Paused" }
}`,
      },
      considerations: [
        "Seekbar interaction adds complexity — position tracking across states",
        "End-of-track auto-transition from Playing to Stopped",
        "Playlist management interacts with state (auto-play next track)",
        "Consider buffering state for streaming media",
        "Volume/mute state is orthogonal — don't mix into playback state",
      ],
    },
    {
      id: 3,
      title: "Document Workflow — CMS Publishing",
      domain: "CMS / Publishing",
      problem:
        "A document in a CMS moves through Draft → InReview → Published. Editing, submitting for review, and publishing are only valid in certain states. Administrators can also reject a document back to Draft.",
      solution:
        "DraftState, InReviewState, and PublishedState implement DocState. The Document delegates edit/submit/publish to its current state.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="65" class="s-box s-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="s-title s-diagram-title">Document</text>
  <line x1="10" y1="32" x2="180" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-state: DocState</text>
  <text x="18" y="62" class="s-member s-diagram-member">+edit(), submit(), publish()</text>
  <rect x="230" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="28" text-anchor="middle" class="s-title s-diagram-title">DocState</text>
  <line x1="230" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="238" y="48" class="s-member s-diagram-member">+edit(doc), submit(doc)</text>
  <text x="238" y="62" class="s-member s-diagram-member">+publish(doc), reject(doc)</text>
</svg>`,
      code: {
        Python: `class DocState:
    def edit(self, doc, content): raise Exception(f"Cannot edit in {self.name()}")
    def submit(self, doc): raise Exception(f"Cannot submit in {self.name()}")
    def publish(self, doc): raise Exception(f"Cannot publish in {self.name()}")
    def reject(self, doc, reason): raise Exception(f"Cannot reject in {self.name()}")
    def name(self) -> str: ...

class DraftState(DocState):
    def edit(self, doc, content):
        doc.content = content
        print(f"Content updated: {content[:50]}")
    def submit(self, doc):
        print("Submitted for review")
        doc.set_state(InReviewState())
    def name(self): return "Draft"

class InReviewState(DocState):
    def publish(self, doc):
        print("Document published!")
        doc.set_state(PublishedState())
    def reject(self, doc, reason):
        print(f"Rejected: {reason}")
        doc.set_state(DraftState())
    def name(self): return "InReview"

class PublishedState(DocState):
    def name(self): return "Published"

class Document:
    def __init__(self, title):
        self.title = title
        self.content = ""
        self._state = DraftState()
    def set_state(self, s): self._state = s
    def edit(self, content): self._state.edit(self, content)
    def submit(self): self._state.submit(self)
    def publish(self): self._state.publish(self)

doc = Document("Article")
doc.edit("Hello World")
doc.submit()
doc.publish()`,
        Go: `package main

import "fmt"

type DocState interface {
	Edit(d *Document, content string)
	Submit(d *Document)
	Publish(d *Document)
	Name() string
}

type Document struct {
	Title   string
	Content string
	state   DocState
}
func (d *Document) SetState(s DocState) {
	fmt.Printf("[%s → %s]\\n", d.state.Name(), s.Name())
	d.state = s
}
func (d *Document) Edit(c string) { d.state.Edit(d, c) }
func (d *Document) Submit()       { d.state.Submit(d) }
func (d *Document) Publish()      { d.state.Publish(d) }

type DraftState struct{}
func (s *DraftState) Edit(d *Document, c string) { d.Content = c; fmt.Println("Edited") }
func (s *DraftState) Submit(d *Document) { fmt.Println("Submitted"); d.SetState(&InReviewState{}) }
func (s *DraftState) Publish(d *Document) { panic("must submit first") }
func (s *DraftState) Name() string { return "Draft" }

type InReviewState struct{}
func (s *InReviewState) Edit(d *Document, c string) { panic("cannot edit in review") }
func (s *InReviewState) Submit(d *Document) { panic("already submitted") }
func (s *InReviewState) Publish(d *Document) { fmt.Println("Published!"); d.SetState(&PublishedState{}) }
func (s *InReviewState) Name() string { return "InReview" }

type PublishedState struct{}
func (s *PublishedState) Edit(d *Document, c string) { panic("read-only") }
func (s *PublishedState) Submit(d *Document) { panic("already published") }
func (s *PublishedState) Publish(d *Document) { panic("already published") }
func (s *PublishedState) Name() string { return "Published" }

func main() {
	d := &Document{Title: "Article", state: &DraftState{}}
	d.Edit("Hello")
	d.Submit()
	d.Publish()
}`,
        Java: `interface DocState {
    default void edit(Document d, String content) { throw new IllegalStateException("Cannot edit"); }
    default void submit(Document d) { throw new IllegalStateException("Cannot submit"); }
    default void publish(Document d) { throw new IllegalStateException("Cannot publish"); }
    String name();
}

class Document {
    String title, content;
    DocState state = new DraftState();
    Document(String title) { this.title = title; }
    void setState(DocState s) { System.out.printf("[%s → %s]%n", state.name(), s.name()); state = s; }
    void edit(String c) { state.edit(this, c); }
    void submit() { state.submit(this); }
    void publish() { state.publish(this); }
}

class DraftState implements DocState {
    public void edit(Document d, String c) { d.content = c; }
    public void submit(Document d) { d.setState(new InReviewState()); }
    public String name() { return "Draft"; }
}

class InReviewState implements DocState {
    public void publish(Document d) { d.setState(new PublishedState()); }
    public String name() { return "InReview"; }
}

class PublishedState implements DocState {
    public String name() { return "Published"; }
}`,
        TypeScript: `interface DocState {
  edit(doc: Document, content: string): void;
  submit(doc: Document): void;
  publish(doc: Document): void;
  name(): string;
}

class Document {
  content = "";
  private state: DocState = new DraftState();
  constructor(public title: string) {}

  setState(s: DocState) { this.state = s; }
  edit(content: string) { this.state.edit(this, content); }
  submit() { this.state.submit(this); }
  publish() { this.state.publish(this); }
}

class DraftState implements DocState {
  edit(doc: Document, content: string) { doc.content = content; }
  submit(doc: Document) { doc.setState(new InReviewState()); }
  publish() { throw new Error("Must submit for review first"); }
  name() { return "Draft"; }
}

class InReviewState implements DocState {
  edit() { throw new Error("Cannot edit during review"); }
  submit() { throw new Error("Already submitted"); }
  publish(doc: Document) { doc.setState(new PublishedState()); }
  name() { return "InReview"; }
}

class PublishedState implements DocState {
  edit() { throw new Error("Read-only"); }
  submit() { throw new Error("Already published"); }
  publish() { throw new Error("Already published"); }
  name() { return "Published"; }
}`,
        Rust: `trait DocState {
    fn edit(&self, doc: &mut Document, content: &str) { panic!("Cannot edit in {}", self.name()); }
    fn submit(&self, doc: &mut Document) { panic!("Cannot submit"); }
    fn publish(&self, doc: &mut Document) { panic!("Cannot publish"); }
    fn name(&self) -> &str;
}

struct Document { title: String, content: String, state: Box<dyn DocState> }
impl Document {
    fn new(title: &str) -> Self {
        Self { title: title.into(), content: String::new(), state: Box::new(DraftState) }
    }
    fn set_state(&mut self, s: Box<dyn DocState>) { self.state = s; }
}

struct DraftState;
impl DocState for DraftState {
    fn edit(&self, doc: &mut Document, content: &str) { doc.content = content.into(); }
    fn submit(&self, doc: &mut Document) { doc.set_state(Box::new(InReviewState)); }
    fn name(&self) -> &str { "Draft" }
}

struct InReviewState;
impl DocState for InReviewState {
    fn publish(&self, doc: &mut Document) { doc.set_state(Box::new(PublishedState)); }
    fn name(&self) -> &str { "InReview" }
}

struct PublishedState;
impl DocState for PublishedState {
    fn name(&self) -> &str { "Published" }
}`,
      },
      considerations: [
        "Role-based access: only editors can edit, only reviewers can publish/reject",
        "Version history for each state transition",
        "Scheduled publishing — auto-transition from InReview to Published at a given time",
        "Consider an Archived state for removing content without deleting",
        "Notification system for state changes (email reviewers on submit)",
      ],
    },
    {
      id: 4,
      title: "Vending Machine — Coin/Dispense FSM",
      domain: "Embedded Systems",
      problem:
        "A vending machine accepts coins, allows product selection, dispenses products, and must handle edge cases (no change, sold out, return coins). Each operation depends on the current machine state.",
      solution:
        "NoCoinState, HasCoinState, DispensingState, and SoldOutState implement VendingState. The machine delegates insertCoin, select, and dispense to its current state.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="180" height="65" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">VendingMachine</text>
  <line x1="10" y1="32" x2="190" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-state: VendingState</text>
  <text x="18" y="62" class="s-member s-diagram-member">+insertCoin(), select()</text>
  <rect x="230" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="28" text-anchor="middle" class="s-title s-diagram-title">VendingState</text>
  <line x1="230" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="238" y="48" class="s-member s-diagram-member">+insertCoin(vm)</text>
  <text x="238" y="62" class="s-member s-diagram-member">+select(vm, product)</text>
</svg>`,
      code: {
        Python: `class VendingState:
    def insert_coin(self, vm): ...
    def select(self, vm, product): ...
    def dispense(self, vm): ...

class NoCoinState(VendingState):
    def insert_coin(self, vm):
        print("Coin accepted")
        vm.set_state(HasCoinState())
    def select(self, vm, product):
        print("Insert coin first")
    def dispense(self, vm):
        print("Insert coin first")

class HasCoinState(VendingState):
    def insert_coin(self, vm):
        print("Coin already inserted")
    def select(self, vm, product):
        if vm.inventory.get(product, 0) > 0:
            vm.selected = product
            vm.set_state(DispensingState())
        else:
            print(f"{product} sold out")
    def dispense(self, vm):
        print("Select a product first")

class DispensingState(VendingState):
    def insert_coin(self, vm): print("Please wait")
    def select(self, vm, product): print("Please wait")
    def dispense(self, vm):
        print(f"Dispensing {vm.selected}")
        vm.inventory[vm.selected] -= 1
        if any(v > 0 for v in vm.inventory.values()):
            vm.set_state(NoCoinState())
        else:
            vm.set_state(SoldOutState())

class SoldOutState(VendingState):
    def insert_coin(self, vm): print("Machine sold out — returning coin")
    def select(self, vm, product): print("Sold out")
    def dispense(self, vm): print("Sold out")

class VendingMachine:
    def __init__(self):
        self.inventory = {"Cola": 2, "Chips": 1}
        self.selected = None
        self._state = NoCoinState()
    def set_state(self, s): self._state = s
    def insert_coin(self): self._state.insert_coin(self)
    def select(self, p): self._state.select(self, p)
    def dispense(self): self._state.dispense(self)

vm = VendingMachine()
vm.insert_coin()
vm.select("Cola")
vm.dispense()`,
        Go: `package main

import "fmt"

type VendingState interface {
	InsertCoin(vm *VendingMachine)
	Select(vm *VendingMachine, product string)
	Dispense(vm *VendingMachine)
}

type VendingMachine struct {
	Inventory map[string]int
	Selected  string
	state     VendingState
}
func (vm *VendingMachine) SetState(s VendingState) { vm.state = s }
func (vm *VendingMachine) InsertCoin() { vm.state.InsertCoin(vm) }
func (vm *VendingMachine) Select(p string) { vm.state.Select(vm, p) }
func (vm *VendingMachine) Dispense() { vm.state.Dispense(vm) }

type NoCoinState struct{}
func (s *NoCoinState) InsertCoin(vm *VendingMachine) {
	fmt.Println("Coin accepted")
	vm.SetState(&HasCoinState{})
}
func (s *NoCoinState) Select(vm *VendingMachine, p string) { fmt.Println("Insert coin first") }
func (s *NoCoinState) Dispense(vm *VendingMachine) { fmt.Println("Insert coin first") }

type HasCoinState struct{}
func (s *HasCoinState) InsertCoin(vm *VendingMachine) { fmt.Println("Already has coin") }
func (s *HasCoinState) Select(vm *VendingMachine, p string) {
	if vm.Inventory[p] > 0 {
		vm.Selected = p
		vm.SetState(&DispensingState{})
	} else {
		fmt.Printf("%s sold out\\n", p)
	}
}
func (s *HasCoinState) Dispense(vm *VendingMachine) { fmt.Println("Select product first") }

type DispensingState struct{}
func (s *DispensingState) InsertCoin(vm *VendingMachine) { fmt.Println("Wait") }
func (s *DispensingState) Select(vm *VendingMachine, p string) { fmt.Println("Wait") }
func (s *DispensingState) Dispense(vm *VendingMachine) {
	fmt.Printf("Dispensing %s\\n", vm.Selected)
	vm.Inventory[vm.Selected]--
	vm.SetState(&NoCoinState{})
}

func main() {
	vm := &VendingMachine{Inventory: map[string]int{"Cola": 2}, state: &NoCoinState{}}
	vm.InsertCoin()
	vm.Select("Cola")
	vm.Dispense()
}`,
        Java: `import java.util.*;

interface VendingState {
    void insertCoin(VendingMachine vm);
    void select(VendingMachine vm, String product);
    void dispense(VendingMachine vm);
}

class VendingMachine {
    Map<String, Integer> inventory = new HashMap<>();
    String selected;
    VendingState state;
    VendingMachine() { inventory.put("Cola", 2); state = new NoCoinState(); }
    void setState(VendingState s) { state = s; }
    void insertCoin() { state.insertCoin(this); }
    void select(String p) { state.select(this, p); }
    void dispense() { state.dispense(this); }
}

class NoCoinState implements VendingState {
    public void insertCoin(VendingMachine vm) {
        System.out.println("Coin accepted"); vm.setState(new HasCoinState());
    }
    public void select(VendingMachine vm, String p) { System.out.println("Insert coin first"); }
    public void dispense(VendingMachine vm) { System.out.println("Insert coin first"); }
}

class HasCoinState implements VendingState {
    public void insertCoin(VendingMachine vm) { System.out.println("Already has coin"); }
    public void select(VendingMachine vm, String p) {
        if (vm.inventory.getOrDefault(p, 0) > 0) { vm.selected = p; vm.setState(new DispensingState()); }
        else System.out.println(p + " sold out");
    }
    public void dispense(VendingMachine vm) { System.out.println("Select product first"); }
}

class DispensingState implements VendingState {
    public void insertCoin(VendingMachine vm) { System.out.println("Wait"); }
    public void select(VendingMachine vm, String p) { System.out.println("Wait"); }
    public void dispense(VendingMachine vm) {
        System.out.println("Dispensing " + vm.selected);
        vm.inventory.merge(vm.selected, -1, Integer::sum);
        vm.setState(new NoCoinState());
    }
}`,
        TypeScript: `interface VendingState {
  insertCoin(vm: VendingMachine): void;
  select(vm: VendingMachine, product: string): void;
  dispense(vm: VendingMachine): void;
}

class VendingMachine {
  inventory: Record<string, number> = { Cola: 2, Chips: 1 };
  selected = "";
  private state: VendingState = new NoCoinState();

  setState(s: VendingState) { this.state = s; }
  insertCoin() { this.state.insertCoin(this); }
  select(p: string) { this.state.select(this, p); }
  dispense() { this.state.dispense(this); }
}

class NoCoinState implements VendingState {
  insertCoin(vm: VendingMachine) { console.log("Coin accepted"); vm.setState(new HasCoinState()); }
  select() { console.log("Insert coin first"); }
  dispense() { console.log("Insert coin first"); }
}

class HasCoinState implements VendingState {
  insertCoin() { console.log("Already has coin"); }
  select(vm: VendingMachine, p: string) {
    if ((vm.inventory[p] ?? 0) > 0) { vm.selected = p; vm.setState(new DispensingState()); }
    else console.log(\`\${p} sold out\`);
  }
  dispense() { console.log("Select product first"); }
}

class DispensingState implements VendingState {
  insertCoin() { console.log("Wait"); }
  select() { console.log("Wait"); }
  dispense(vm: VendingMachine) {
    console.log(\`Dispensing \${vm.selected}\`);
    vm.inventory[vm.selected]--;
    vm.setState(new NoCoinState());
  }
}`,
        Rust: `trait VendingState {
    fn insert_coin(&self, vm: &mut VendingMachine);
    fn select(&self, vm: &mut VendingMachine, product: &str);
    fn dispense(&self, vm: &mut VendingMachine);
}

struct VendingMachine {
    inventory: std::collections::HashMap<String, u32>,
    selected: String,
    state: Box<dyn VendingState>,
}
impl VendingMachine {
    fn set_state(&mut self, s: Box<dyn VendingState>) { self.state = s; }
}

struct NoCoinState;
impl VendingState for NoCoinState {
    fn insert_coin(&self, vm: &mut VendingMachine) {
        println!("Coin accepted");
        vm.set_state(Box::new(HasCoinState));
    }
    fn select(&self, _: &mut VendingMachine, _: &str) { println!("Insert coin first"); }
    fn dispense(&self, _: &mut VendingMachine) { println!("Insert coin first"); }
}

struct HasCoinState;
impl VendingState for HasCoinState {
    fn insert_coin(&self, _: &mut VendingMachine) { println!("Already has coin"); }
    fn select(&self, vm: &mut VendingMachine, p: &str) {
        if *vm.inventory.get(p).unwrap_or(&0) > 0 {
            vm.selected = p.into();
            vm.set_state(Box::new(DispensingState));
        }
    }
    fn dispense(&self, _: &mut VendingMachine) { println!("Select first"); }
}

struct DispensingState;
impl VendingState for DispensingState {
    fn insert_coin(&self, _: &mut VendingMachine) { println!("Wait"); }
    fn select(&self, _: &mut VendingMachine, _: &str) { println!("Wait"); }
    fn dispense(&self, vm: &mut VendingMachine) {
        println!("Dispensing {}", vm.selected);
        *vm.inventory.get_mut(&vm.selected).unwrap() -= 1;
        vm.set_state(Box::new(NoCoinState));
    }
}`,
      },
      considerations: [
        "Coin tracking: handle multiple denominations and make change",
        "Concurrent access: multiple users pressing buttons simultaneously",
        "Hardware integration: motor control, coin sensor, display updates",
        "Restocking transitions: maintenance mode state",
        "Error recovery: stuck product, jammed coin mechanism",
      ],
    },
    {
      id: 5,
      title: "Circuit Breaker — Service Resilience",
      domain: "Microservices",
      problem:
        "A circuit breaker protects against cascading failures in microservices. It has three states: Closed (normal), Open (rejecting calls), and HalfOpen (testing if service recovered). Each state handles call() and failure recording differently.",
      solution:
        "ClosedState, OpenState, and HalfOpenState implement CBState. The CircuitBreaker delegates call() to its current state, which handles successes, failures, and transitions.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="190" height="65" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">CircuitBreaker</text>
  <line x1="10" y1="32" x2="200" y2="32" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-state: CBState</text>
  <text x="18" y="62" class="s-member s-diagram-member">+call(fn): Result</text>
  <rect x="230" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="320" y="28" text-anchor="middle" class="s-title s-diagram-title">CBState</text>
  <line x1="230" y1="32" x2="410" y2="32" class="s-diagram-line"/>
  <text x="238" y="48" class="s-member s-diagram-member">+call(cb, fn): Result</text>
  <text x="238" y="62" class="s-member s-diagram-member">+onSuccess(cb), onFailure(cb)</text>
</svg>`,
      code: {
        Python: `import time

class CBState:
    def call(self, cb, fn): ...
    def on_success(self, cb): ...
    def on_failure(self, cb): ...

class ClosedState(CBState):
    def __init__(self):
        self.failure_count = 0

    def call(self, cb, fn):
        try:
            result = fn()
            self.on_success(cb)
            return result
        except Exception as e:
            self.on_failure(cb)
            raise

    def on_success(self, cb):
        self.failure_count = 0

    def on_failure(self, cb):
        self.failure_count += 1
        if self.failure_count >= cb.threshold:
            print(f"Circuit OPEN after {self.failure_count} failures")
            cb.set_state(OpenState())

class OpenState(CBState):
    def __init__(self):
        self.opened_at = time.time()

    def call(self, cb, fn):
        if time.time() - self.opened_at > cb.timeout:
            cb.set_state(HalfOpenState())
            return cb.call(fn)
        raise Exception("Circuit breaker is OPEN")

    def on_success(self, cb): pass
    def on_failure(self, cb): pass

class HalfOpenState(CBState):
    def call(self, cb, fn):
        try:
            result = fn()
            self.on_success(cb)
            return result
        except Exception:
            self.on_failure(cb)
            raise

    def on_success(self, cb):
        print("Circuit CLOSED — service recovered")
        cb.set_state(ClosedState())

    def on_failure(self, cb):
        print("Circuit OPEN — still failing")
        cb.set_state(OpenState())

class CircuitBreaker:
    def __init__(self, threshold=3, timeout=30):
        self.threshold = threshold
        self.timeout = timeout
        self._state = ClosedState()
    def set_state(self, s): self._state = s
    def call(self, fn): return self._state.call(self, fn)`,
        Go: `package main

import (
	"errors"
	"fmt"
	"time"
)

type CBState interface {
	Call(cb *CircuitBreaker, fn func() (interface{}, error)) (interface{}, error)
}

type CircuitBreaker struct {
	Threshold int
	Timeout   time.Duration
	state     CBState
}
func (cb *CircuitBreaker) SetState(s CBState) { cb.state = s }
func (cb *CircuitBreaker) Call(fn func() (interface{}, error)) (interface{}, error) {
	return cb.state.Call(cb, fn)
}

type ClosedState struct{ failures int }
func (s *ClosedState) Call(cb *CircuitBreaker, fn func() (interface{}, error)) (interface{}, error) {
	result, err := fn()
	if err != nil {
		s.failures++
		if s.failures >= cb.Threshold {
			fmt.Println("Circuit OPEN")
			cb.SetState(&OpenState{openedAt: time.Now()})
		}
		return nil, err
	}
	s.failures = 0
	return result, nil
}

type OpenState struct{ openedAt time.Time }
func (s *OpenState) Call(cb *CircuitBreaker, fn func() (interface{}, error)) (interface{}, error) {
	if time.Since(s.openedAt) > cb.Timeout {
		cb.SetState(&HalfOpenState{})
		return cb.Call(fn)
	}
	return nil, errors.New("circuit open")
}

type HalfOpenState struct{}
func (s *HalfOpenState) Call(cb *CircuitBreaker, fn func() (interface{}, error)) (interface{}, error) {
	result, err := fn()
	if err != nil {
		cb.SetState(&OpenState{openedAt: time.Now()})
		return nil, err
	}
	fmt.Println("Circuit CLOSED")
	cb.SetState(&ClosedState{})
	return result, nil
}

func main() {
	cb := &CircuitBreaker{Threshold: 3, Timeout: 30 * time.Second, state: &ClosedState{}}
	_, _ = cb.Call(func() (interface{}, error) { return "ok", nil })
}`,
        Java: `interface CBState {
    <T> T call(CircuitBreaker cb, java.util.function.Supplier<T> fn);
}

class CircuitBreaker {
    int threshold = 3;
    long timeoutMs = 30_000;
    CBState state = new ClosedState();
    void setState(CBState s) { state = s; }
    <T> T call(java.util.function.Supplier<T> fn) { return state.call(this, fn); }
}

class ClosedState implements CBState {
    int failures = 0;
    public <T> T call(CircuitBreaker cb, java.util.function.Supplier<T> fn) {
        try {
            T result = fn.get();
            failures = 0;
            return result;
        } catch (RuntimeException e) {
            failures++;
            if (failures >= cb.threshold) cb.setState(new OpenState());
            throw e;
        }
    }
}

class OpenState implements CBState {
    long openedAt = System.currentTimeMillis();
    public <T> T call(CircuitBreaker cb, java.util.function.Supplier<T> fn) {
        if (System.currentTimeMillis() - openedAt > cb.timeoutMs) {
            cb.setState(new HalfOpenState());
            return cb.call(fn);
        }
        throw new RuntimeException("Circuit OPEN");
    }
}

class HalfOpenState implements CBState {
    public <T> T call(CircuitBreaker cb, java.util.function.Supplier<T> fn) {
        try {
            T result = fn.get();
            cb.setState(new ClosedState());
            return result;
        } catch (RuntimeException e) {
            cb.setState(new OpenState());
            throw e;
        }
    }
}`,
        TypeScript: `interface CBState {
  call<T>(cb: CircuitBreaker, fn: () => T): T;
}

class CircuitBreaker {
  private state: CBState = new ClosedState();
  constructor(public threshold = 3, public timeoutMs = 30_000) {}
  setState(s: CBState) { this.state = s; }
  call<T>(fn: () => T): T { return this.state.call(this, fn); }
}

class ClosedState implements CBState {
  private failures = 0;
  call<T>(cb: CircuitBreaker, fn: () => T): T {
    try {
      const result = fn();
      this.failures = 0;
      return result;
    } catch (e) {
      this.failures++;
      if (this.failures >= cb.threshold) cb.setState(new OpenState());
      throw e;
    }
  }
}

class OpenState implements CBState {
  private openedAt = Date.now();
  call<T>(cb: CircuitBreaker, fn: () => T): T {
    if (Date.now() - this.openedAt > cb.timeoutMs) {
      cb.setState(new HalfOpenState());
      return cb.call(fn);
    }
    throw new Error("Circuit breaker is OPEN");
  }
}

class HalfOpenState implements CBState {
  call<T>(cb: CircuitBreaker, fn: () => T): T {
    try {
      const result = fn();
      cb.setState(new ClosedState());
      return result;
    } catch (e) {
      cb.setState(new OpenState());
      throw e;
    }
  }
}`,
        Rust: `use std::time::{Duration, Instant};

trait CBState {
    fn call(&self, cb: &mut CircuitBreaker, f: &dyn Fn() -> Result<String, String>) -> Result<String, String>;
}

struct CircuitBreaker { threshold: u32, timeout: Duration, state: Box<dyn CBState> }
impl CircuitBreaker {
    fn set_state(&mut self, s: Box<dyn CBState>) { self.state = s; }
}

struct ClosedState { failures: u32 }
impl CBState for ClosedState {
    fn call(&self, cb: &mut CircuitBreaker, f: &dyn Fn() -> Result<String, String>) -> Result<String, String> {
        match f() {
            Ok(r) => Ok(r),
            Err(e) => {
                let new_failures = self.failures + 1;
                if new_failures >= cb.threshold {
                    cb.set_state(Box::new(OpenState { opened: Instant::now() }));
                }
                Err(e)
            }
        }
    }
}

struct OpenState { opened: Instant }
impl CBState for OpenState {
    fn call(&self, cb: &mut CircuitBreaker, f: &dyn Fn() -> Result<String, String>) -> Result<String, String> {
        if self.opened.elapsed() > cb.timeout {
            cb.set_state(Box::new(HalfOpenState));
            return f();
        }
        Err("Circuit OPEN".into())
    }
}

struct HalfOpenState;
impl CBState for HalfOpenState {
    fn call(&self, cb: &mut CircuitBreaker, f: &dyn Fn() -> Result<String, String>) -> Result<String, String> {
        match f() {
            Ok(r) => { cb.set_state(Box::new(ClosedState { failures: 0 })); Ok(r) }
            Err(e) => { cb.set_state(Box::new(OpenState { opened: Instant::now() })); Err(e) }
        }
    }
}`,
      },
      considerations: [
        "Thread safety: state transitions must be atomic in concurrent environments",
        "Metrics: track failure counts, open durations, and half-open success rates",
        "Configurable thresholds per service endpoint",
        "Sliding window vs. count-based failure tracking",
        "Health check endpoint integration for proactive half-open testing",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Start with State Objects (classic GoF) for most cases. Use State Tables for configuration-driven state machines. Use Enum + Match for simple FSMs with few states.",

  variants: [
    {
      id: 1,
      name: "Classic State Objects (GoF)",
      description:
        "Each state is a class implementing a State interface. The context delegates to the current state object. States trigger transitions by calling context.setState().",
      code: {
        Python: `class State:
    def handle(self, ctx): ...

class IdleState(State):
    def handle(self, ctx):
        print("Processing...")
        ctx.set_state(ActiveState())

class ActiveState(State):
    def handle(self, ctx):
        print("Done!")
        ctx.set_state(IdleState())

class Context:
    def __init__(self):
        self._state = IdleState()
    def set_state(self, s): self._state = s
    def request(self): self._state.handle(self)`,
        Go: `type State interface{ Handle(ctx *Context) }
type Context struct{ state State }
func (c *Context) SetState(s State) { c.state = s }
func (c *Context) Request() { c.state.Handle(c) }

type IdleState struct{}
func (s *IdleState) Handle(ctx *Context) {
	fmt.Println("Processing...")
	ctx.SetState(&ActiveState{})
}`,
        Java: `interface State { void handle(Context ctx); }
class Context {
    State state = new IdleState();
    void setState(State s) { state = s; }
    void request() { state.handle(this); }
}
class IdleState implements State {
    public void handle(Context ctx) { ctx.setState(new ActiveState()); }
}`,
        TypeScript: `interface State { handle(ctx: Context): void; }
class Context {
  private state: State = new IdleState();
  setState(s: State) { this.state = s; }
  request() { this.state.handle(this); }
}
class IdleState implements State {
  handle(ctx: Context) { ctx.setState(new ActiveState()); }
}`,
        Rust: `trait State { fn handle(&self, ctx: &mut Context); }
struct Context { state: Box<dyn State> }
impl Context {
    fn set_state(&mut self, s: Box<dyn State>) { self.state = s; }
    fn request(&mut self) { /* take state, call handle, put back */ }
}`,
      },
      pros: [
        "Clean separation — each state is a focused, testable class",
        "Open/Closed — new states added without modifying existing code",
        "State-specific data can live in state objects",
      ],
      cons: [
        "Many small classes for simple state machines",
        "Transitions are distributed across state classes — hard to see the full FSM at a glance",
        "Object creation overhead for state transitions",
      ],
    },
    {
      id: 2,
      name: "State Transition Table",
      description:
        "Define the state machine as a data structure (table/map) that maps (currentState, event) → (nextState, action). Transitions are declarative and configurable.",
      code: {
        Python: `transitions = {
    ("IDLE", "start"):    ("RUNNING", lambda: print("Started")),
    ("RUNNING", "pause"): ("PAUSED",  lambda: print("Paused")),
    ("PAUSED", "resume"): ("RUNNING", lambda: print("Resumed")),
    ("RUNNING", "stop"):  ("IDLE",    lambda: print("Stopped")),
    ("PAUSED", "stop"):   ("IDLE",    lambda: print("Stopped")),
}

class StateMachine:
    def __init__(self, initial: str):
        self.state = initial

    def trigger(self, event: str) -> None:
        key = (self.state, event)
        if key not in transitions:
            raise ValueError(f"No transition for {key}")
        next_state, action = transitions[key]
        action()
        self.state = next_state

sm = StateMachine("IDLE")
sm.trigger("start")   # Started
sm.trigger("pause")   # Paused
sm.trigger("resume")  # Resumed
sm.trigger("stop")    # Stopped`,
        Go: `package main

import "fmt"

type Transition struct {
	Next   string
	Action func()
}

var table = map[[2]string]Transition{
	{"IDLE", "start"}:    {"RUNNING", func() { fmt.Println("Started") }},
	{"RUNNING", "pause"}: {"PAUSED", func() { fmt.Println("Paused") }},
	{"RUNNING", "stop"}:  {"IDLE", func() { fmt.Println("Stopped") }},
}

type SM struct{ State string }
func (sm *SM) Trigger(event string) {
	t, ok := table[[2]string{sm.State, event}]
	if !ok { panic("invalid transition") }
	t.Action()
	sm.State = t.Next
}`,
        Java: `Map<String, Map<String, String[]>> transitions = Map.of(
    "IDLE", Map.of("start", new String[]{"RUNNING", "Started"}),
    "RUNNING", Map.of("pause", new String[]{"PAUSED", "Paused"},
                      "stop", new String[]{"IDLE", "Stopped"})
);

String state = "IDLE";
void trigger(String event) {
    var t = transitions.get(state).get(event);
    System.out.println(t[1]);
    state = t[0];
}`,
        TypeScript: `type Transition = { next: string; action: () => void };
const table: Record<string, Record<string, Transition>> = {
  IDLE:    { start:  { next: "RUNNING", action: () => console.log("Started") } },
  RUNNING: { pause:  { next: "PAUSED",  action: () => console.log("Paused") },
             stop:   { next: "IDLE",     action: () => console.log("Stopped") } },
  PAUSED:  { resume: { next: "RUNNING", action: () => console.log("Resumed") } },
};

class SM {
  state = "IDLE";
  trigger(event: string) {
    const t = table[this.state]?.[event];
    if (!t) throw new Error(\`No transition: \${this.state} + \${event}\`);
    t.action();
    this.state = t.next;
  }
}`,
        Rust: `use std::collections::HashMap;

fn main() {
    let mut table: HashMap<(&str, &str), (&str, fn())> = HashMap::new();
    table.insert(("IDLE", "start"), ("RUNNING", || println!("Started")));
    table.insert(("RUNNING", "stop"), ("IDLE", || println!("Stopped")));

    let mut state = "IDLE";
    let trigger = |s: &mut &str, event: &str| {
        let (next, action) = table.get(&(*s, event)).expect("invalid");
        action();
        *s = next;
    };
    trigger(&mut state, "start");
}`,
      },
      pros: [
        "Entire FSM visible at a glance — easy to review and validate",
        "Data-driven — transitions can be loaded from config / JSON / database",
        "Easy to generate state diagrams from the table",
      ],
      cons: [
        "Complex state-specific logic doesn't fit neatly in a table",
        "Actions are limited to simple functions — hard to model rich behaviour",
        "Less type-safe than State Objects in statically typed languages",
      ],
    },
    {
      id: 3,
      name: "Enum + Match (Algebraic States)",
      description:
        "Use an enum for states and a match/switch statement to dispatch behaviour. Simple and flat — works well for FSMs with few states and simple logic.",
      code: {
        Python: `from enum import Enum, auto

class LightState(Enum):
    RED = auto()
    GREEN = auto()
    YELLOW = auto()

class TrafficLight:
    def __init__(self):
        self.state = LightState.RED

    def next(self):
        match self.state:
            case LightState.RED:
                self.state = LightState.GREEN
            case LightState.GREEN:
                self.state = LightState.YELLOW
            case LightState.YELLOW:
                self.state = LightState.RED
        print(f"Light: {self.state.name}")

light = TrafficLight()
light.next()  # GREEN
light.next()  # YELLOW
light.next()  # RED`,
        Go: `package main

import "fmt"

type Light int
const (
	Red Light = iota
	Green
	Yellow
)

func next(l Light) Light {
	switch l {
	case Red: fmt.Println("→ Green"); return Green
	case Green: fmt.Println("→ Yellow"); return Yellow
	case Yellow: fmt.Println("→ Red"); return Red
	}
	return Red
}

func main() {
	l := Red
	l = next(l)
	l = next(l)
	l = next(l)
}`,
        Java: `enum Light {
    RED { Light next() { return GREEN; } },
    GREEN { Light next() { return YELLOW; } },
    YELLOW { Light next() { return RED; } };
    abstract Light next();
}

// Usage
Light l = Light.RED;
l = l.next(); // GREEN`,
        TypeScript: `enum Light { Red, Green, Yellow }

function next(state: Light): Light {
  switch (state) {
    case Light.Red: return Light.Green;
    case Light.Green: return Light.Yellow;
    case Light.Yellow: return Light.Red;
  }
}

let light = Light.Red;
light = next(light); // Green`,
        Rust: `enum Light { Red, Green, Yellow }

impl Light {
    fn next(self) -> Self {
        match self {
            Light::Red => Light::Green,
            Light::Green => Light::Yellow,
            Light::Yellow => Light::Red,
        }
    }
}

fn main() {
    let mut l = Light::Red;
    l = l.next(); // Green
    l = l.next(); // Yellow
}`,
      },
      pros: [
        "Simplest approach — minimal boilerplate",
        "All transitions visible in one match/switch block",
        "Exhaustiveness checking catches missing states at compile time",
      ],
      cons: [
        "Logic for all states lives in one function — grows unwieldy",
        "Adding a new state requires editing every match block",
        "Violates Open/Closed Principle for complex state machines",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Complexity", "Extensibility", "Visibility", "Best For",
  ],
  comparisonRows: [
    ["State Objects", "Medium", "Excellent (OCP)", "Distributed", "Complex FSMs with rich behaviour"],
    ["State Table", "Low", "Good (data-driven)", "Centralized", "Configuration-driven, simple actions"],
    ["Enum + Match", "Low", "Poor (edit all)", "Centralized", "Simple FSMs with few states"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Behavioral" },
    {
      aspect: "Key Benefit",
      detail:
        "Eliminates state-dependent conditionals by encapsulating each state's behaviour in its own class. Adding new states doesn't touch existing code.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Overusing State for objects with only 2-3 states and simple logic. A simple if/else or enum may be clearer.",
    },
    {
      aspect: "vs. Strategy",
      detail:
        "Strategy swaps algorithms chosen by the client. State swaps behaviour automatically based on internal transitions. States know about each other; Strategies don't.",
    },
    {
      aspect: "vs. Finite State Machine libraries",
      detail:
        "State pattern is a code-level OOP pattern. FSM libraries (XState, Statecharts) provide declarative state machines with tools, visualizations, and hierarchical states.",
    },
    {
      aspect: "When to Use",
      detail:
        "Objects with many states and state-dependent behaviour: order processing, connections, UI modes, game entity states, workflow engines, protocol implementations.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Simple boolean flags (active/inactive). Objects with few states and trivial logic. When state transitions are not well-defined.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Strategy (same structure, different intent), Singleton (states can be shared singletons), Flyweight (reuse state objects), Command (encapsulate transition actions)",
    },
  ],

  antiPatterns: [
    {
      name: "State Explosion",
      description:
        "Creating a separate class for every possible state combination in a system with orthogonal state dimensions (e.g., connection × authentication × encryption = 8 classes).",
      betterAlternative:
        "Use hierarchical states (Statecharts) or separate orthogonal state machines that compose independently.",
    },
    {
      name: "God Context",
      description:
        "The Context class accumulates state-specific fields used only by certain states, becoming bloated with data that's irrelevant to most states.",
      betterAlternative:
        "Move state-specific data into the state objects themselves. The context holds only shared, cross-state data.",
    },
    {
      name: "Implicit Transitions",
      description:
        "State transitions happen as side effects deep within method chains, making it impossible to trace state flow or debug transition issues.",
      betterAlternative:
        "Make transitions explicit: log them, fire events on transition, and ensure transition logic is clearly visible at the top of handle() methods.",
    },
    {
      name: "Two-Way Context-State Coupling",
      description:
        "States directly modify context internals (not just calling setState), creating tight coupling between state implementations and context structure.",
      betterAlternative:
        "Expose minimal, well-defined methods on the Context for states to call. States should only know the Context's public transition API.",
    },
    {
      name: "Missing Default/Error State",
      description:
        "No fallback for unexpected events in a given state. The system silently ignores invalid operations or crashes with null pointer exceptions.",
      betterAlternative:
        "Define a default handler in the base State that throws an explicit 'invalid operation in state X' error. Or use a dedicated ErrorState for recovery.",
    },
  ],
};

export default stateData;
