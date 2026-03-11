import { PatternData } from "@/lib/patterns/types";

const mediatorData: PatternData = {
  slug: "mediator",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Mediator Pattern",
  subtitle:
    "Define an object that encapsulates how a set of objects interact, promoting loose coupling by keeping objects from referring to each other explicitly.",

  intent:
    "In complex systems, objects often need to coordinate with each other. The naive approach is to give each object direct references to all the objects it must communicate with. With N components this creates N×(N-1) direct connections — a tangled web that is hard to understand, extend, or test.\n\nThe Mediator pattern introduces a single mediator object. Instead of talking to each other directly, components talk only to the mediator. The mediator receives notifications from components and decides which other components need to react and how. Components are now decoupled from each other — they only know about the mediator interface.\n\nThis mirrors real-world coordination hubs: an air traffic control tower (planes never communicate directly), a chat room server (users message the room, not each other), or a UI form mediator (a field change triggers the mediator to update related fields, enable buttons, etc.).\n\nMediator vs Observer: Both decouple senders from receivers. Observer is a one-to-many broadcast where the subject doesn't know which observers it has. Mediator is a many-to-many coordination hub where the mediator knows all components and orchestrates complex interactions between them.",

  classDiagramSvg: `<svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box{rx:6;} .s-title{font:bold 11px 'JetBrains Mono',monospace;}
    .s-member{font:10px 'JetBrains Mono',monospace;}
    .s-arr{stroke-width:1.2;fill:none;marker-end:url(#med-arr);}
    .s-dash{stroke-dasharray:5,3;}
  </style>
  <defs>
    <marker id="med-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Mediator interface -->
  <rect x="185" y="10" width="190" height="60" class="s-box s-diagram-box"/>
  <text x="280" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Mediator</text>
  <line x1="185" y1="33" x2="375" y2="33" class="s-diagram-line"/>
  <text x="195" y="50" class="s-member s-diagram-member">+notify(sender, event)</text>
  <!-- ConcreteMediator -->
  <rect x="185" y="130" width="190" height="65" class="s-box s-diagram-box"/>
  <text x="280" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteMediator</text>
  <line x1="185" y1="153" x2="375" y2="153" class="s-diagram-line"/>
  <text x="195" y="168" class="s-member s-diagram-member">-componentA: ComponentA</text>
  <text x="195" y="181" class="s-member s-diagram-member">-componentB: ComponentB</text>
  <text x="195" y="194" class="s-member s-diagram-member">+notify(sender, event)</text>
  <!-- ComponentA -->
  <rect x="10" y="70" width="150" height="55" class="s-box s-diagram-box"/>
  <text x="85" y="88" text-anchor="middle" class="s-title s-diagram-title">ComponentA</text>
  <line x1="10" y1="93" x2="160" y2="93" class="s-diagram-line"/>
  <text x="18" y="108" class="s-member s-diagram-member">-mediator: Mediator</text>
  <text x="18" y="120" class="s-member s-diagram-member">+operationA()</text>
  <!-- ComponentB -->
  <rect x="400" y="70" width="150" height="55" class="s-box s-diagram-box"/>
  <text x="475" y="88" text-anchor="middle" class="s-title s-diagram-title">ComponentB</text>
  <line x1="400" y1="93" x2="550" y2="93" class="s-diagram-line"/>
  <text x="408" y="108" class="s-member s-diagram-member">-mediator: Mediator</text>
  <text x="408" y="120" class="s-member s-diagram-member">+operationB()</text>
  <!-- Arrows -->
  <line x1="280" y1="130" x2="280" y2="70" class="s-arr s-diagram-arrow"/>
  <line x1="160" y1="95" x2="185" y2="50" class="s-arr s-diagram-arrow s-dash"/>
  <text x="155" y="72" class="s-member s-diagram-member" style="font-size:8px">notify</text>
  <line x1="400" y1="95" x2="375" y2="50" class="s-arr s-diagram-arrow s-dash"/>
  <text x="380" y="72" class="s-member s-diagram-member" style="font-size:8px">notify</text>
</svg>`,

  diagramExplanation:
    "The Mediator interface declares notify(sender, event) — the single entry point for all component notifications. ConcreteMediator implements Mediator and holds references to all components it orchestrates. When it receives a notify() call, it inspects the sender and event and decides which other components to trigger. ComponentA and ComponentB each hold a single mediator reference (never a reference to each other). When ComponentA performs operationA(), it calls mediator.notify(this, 'A') at the end. The ConcreteMediator's notify() method then calls componentB.operationB() if appropriate. No direct A→B or B→A link exists.",

  diagramComponents: [
    {
      name: "Mediator (interface)",
      description:
        "Declares the notify() method that components call to signal events. All components depend only on this interface — insulating them from the concrete mediator implementation.",
    },
    {
      name: "ConcreteMediator",
      description:
        "Implements the orchestration logic. Holds references to all components and wires their interactions together. When notified by component X of event Y, it decides which other components to trigger and how.",
    },
    {
      name: "Component (BaseComponent)",
      description:
        "Abstract base class or interface for components. Holds a mediator reference. Calls mediator.notify(this, event) at the end of each significant operation instead of calling other components directly.",
    },
    {
      name: "ConcreteComponent (A / B / C)",
      description:
        "Implements domain-specific behaviour. Completely unaware of other components — only knows how to perform its own operations and how to notify the mediator. Reusable in different mediator configurations.",
    },
  ],

  solutionDetail:
    "**Components → Mediator Communication**: Every component holds one reference: the mediator. When an event occurs, the component calls `mediator.notify(this, eventName)`. The component doesn't know who will react.\n\n**Mediator → Components Communication**: The ConcreteMediator inspects the sender and event, then directly calls methods on the target components. The mediator is the only place that knows the relationships between components.\n\n**Reducing Coupling**: With 5 components, removing direct cross-communication reduces connections from 20 (fully connected graph) to 5 (hub and spoke). Adding a new component requires only: implement the component, add it to the mediator — no changes to existing components.\n\n**Event-Based Variant**: Instead of `notify(sender, event)`, the mediator can use typed events or a dictionary of event→[handlers] for more extensibility. This approaches the pub-sub pattern but with a centralised coordinator that can veto, transform, or sequence events.\n\n**UI Form Mediator**: The classic UI use-case — a form mediator receives change events from checkboxes, text fields, and dropdown selectors. It enables/disables buttons, shows/hides controls, and resets dependent fields without any field knowing about any other field.",

  characteristics: [
    "Replaces a many-to-many network of dependencies with a one-to-many hub-and-spoke topology",
    "Components become reusable — they only depend on the abstract Mediator interface",
    "Centralises complex coordination logic in one place — easier to understand and change",
    "Simplifies component testing — mock the mediator to test any component in isolation",
    "Adding a new component doesn't change existing components — open/closed principle",
    "The mediator itself can become complex ('God object') if not carefully bounded",
    "Distinct from Observer: Observer is passive broadcast; Mediator is active bilateral coordination",
  ],

  useCases: [
    {
      id: 1,
      title: "Chat Room Server",
      domain: "Messaging / Social",
      description:
        "Users in a chat room send messages to other users. Instead of users holding references to every other user, they each register with a ChatRoom mediator. Sending a message posts to the ChatRoom, which distributes it to all other members.",
      whySingleton:
        "ChatRoom is the mediator. Users are components. A user only knows chatRoom.send(this, message) — no direct user-to-user references exist.",
      code: `class ChatRoom:  # Mediator
    def __init__(self):
        self._users: list['User'] = []
    def register(self, user: 'User'):
        self._users.append(user)
    def broadcast(self, sender: 'User', message: str):
        for user in self._users:
            if user is not sender:  # don't echo back
                user.receive(sender.name, message)`,
    },
    {
      id: 2,
      title: "Air Traffic Control Tower",
      domain: "Aviation / Simulation",
      description:
        "Aircraft must coordinate landing/takeoff sequences. If planes communicated directly, the combinatorics would be chaotic. The ATC Tower mediates — every plane reports to the tower, the tower decides who can land.",
      whySingleton:
        "ATCTower is the mediator — it holds state (runway availability) and coordinates permissions. Aircraft only ever call tower.request(this, action) and never radio each other.",
      code: `class ATCTower:  # Mediator
    def __init__(self):
        self._runway_free = True
        self._waiting: list = []
    def request(self, aircraft, action: str):
        if action == 'land':
            if self._runway_free:
                self._runway_free = False
                aircraft.confirm_land()
            else:
                self._waiting.append(aircraft)`,
    },
    {
      id: 3,
      title: "Smart Home Hub",
      domain: "IoT / Home Automation",
      description:
        "A motion sensor triggers lights to turn on, the HVAC to boost, and sends a phone notification. Without a mediator, the motion sensor would need direct references to the light controller, HVAC, and notification service.",
      whySingleton:
        "HomeHub mediates all device events. The motion sensor calls hub.notify(this, 'motion_detected'). The hub then coordinates the appropriate devices.",
      code: `class HomeHub:  # Mediator
    def __init__(self, lights, hvac, phone):
        self._lights, self._hvac, self._phone = lights, hvac, phone
    def notify(self, sender, event: str):
        if event == 'motion_detected':
            self._lights.turn_on()    # coordinate lights
            self._hvac.boost()        # coordinate HVAC
            self._phone.notify("Motion detected")  # and phone`,
    },
    {
      id: 4,
      title: "UI Form Validation Coordinator",
      domain: "Frontend / UX",
      description:
        "A registration form: checking 'Business account' should show company fields and change the password policy hint. Without a mediator, the checkbox component would need direct DOM references to many other controls.",
      whySingleton:
        "FormMediator receives change events from each field and decides how to update all other components — enables button, shows fields, resets dependents — all in one place.",
      code: `class FormMediator:
    def notify(self, component: str, event: str):
        if component == 'business_checkbox' and event == 'checked':
            self.company_field.show()
            self.password_hint.set("Corporate policy: 16+ chars")
            self.submit_button.set_label("Create Business Account")`,
    },
    {
      id: 5,
      title: "Workflow / Process Engine",
      domain: "Business Process Management",
      description:
        "An order processing workflow: payment confirmation → inventory reservation → shipping label generation → email confirmation. Each step notifies the workflow mediator, which triggers the next step.",
      whySingleton:
        "WorkflowEngine is the mediator. PaymentService, InventoryService, ShippingService, and EmailService are all components. None calls the others — they all call workflowEngine.notify().",
      code: `class OrderWorkflow:  # Mediator
    def notify(self, service: str, event: str):
        if event == 'payment_confirmed':
            self.inventory.reserve()
        elif event == 'inventory_reserved':
            self.shipping.create_label()
        elif event == 'label_created':
            self.email.send_confirmation()`,
    },
    {
      id: 6,
      title: "Multiplayer Game Event Bus",
      domain: "Gaming",
      description:
        "A game session: a player scores → the scoreboard updates, other players see a notification, and if it's the winning score, the game ends. The GameSession mediates all these cross-component effects.",
      whySingleton:
        "GameSession holds all player and UI component references. Player.score() calls session.notify(this, 'scored', points). Session orchestrates scoreboard, notification, and win-check.",
      code: `class GameSession:  # Mediator
    def notify(self, player, event: str, data=None):
        if event == 'scored':
            self.scoreboard.update(player.name, data)
            self.broadcast_notification(f"{player.name} scored!")
            if self.scoreboard.is_winning_score(data):
                self.end_game(winner=player)`,
    },
    {
      id: 7,
      title: "Pub-Sub Event Router",
      domain: "Backend / Messaging",
      description:
        "Microservices publish events. Other services subscribe to specific event types. A central EventRouter routes events from publishers to the correct subscribers without publishers knowing about subscribers.",
      whySingleton:
        "EventRouter is the mediator — it maintains topic→[subscriber] mappings. Publishers call router.publish(topic, event). Router dispatches to all subscribers of that topic.",
      code: `class EventRouter:  # Mediator
    def __init__(self):
        self._subscribers: dict[str, list] = {}
    def subscribe(self, topic: str, handler):
        self._subscribers.setdefault(topic, []).append(handler)
    def publish(self, topic: str, event):
        for handler in self._subscribers.get(topic, []):
            handler(event)`,
    },
    {
      id: 8,
      title: "Transport Layer Session Manager",
      domain: "Networking",
      description:
        "A TCP session manager coordinates: connection established → allocate buffer → start heartbeat → register with load balancer. Each sub-component notifies the session manager which coordinates the rest.",
      whySingleton:
        "SessionManager mediates buffer, heartbeat, and load balancer components. Each component only calls sessionManager.notify() — none knows the others.",
      code: `class SessionManager:  # Mediator
    def notify(self, component: str, event: str, data=None):
        if event == 'connection_established':
            self.buffer_pool.allocate(data.session_id)
            self.heartbeat.start(data.session_id)
            self.load_balancer.register(data.session_id)`,
    },
    {
      id: 9,
      title: "IDE Component Coordinator",
      domain: "Developer Tools",
      description:
        "In a code editor: file tree selection → editor opens file, breadcrumb updates, outline panel refreshes, search scope resets. Without a mediator, the file tree would need 4 direct references and know about each panel.",
      whySingleton:
        "IDEWorkspace is the mediator. All panels (file tree, editor, breadcrumb, outline) notify the workspace of their actions. Workspace coordinates the responses.",
      code: `class IDEWorkspace:  # Mediator
    def notify(self, component: str, event: str, data=None):
        if event == 'file_selected':
            self.editor.open(data.path)
            self.breadcrumb.update(data.path)
            self.outline.refresh(data.path)
            self.search.reset_scope(data.path)`,
    },
    {
      id: 10,
      title: "Neural Network Layer Coordinator",
      domain: "Machine Learning Platform",
      description:
        "During backpropagation, gradient updates must be coordinated between layers. A TrainingCoordinator mediates: each layer reports its gradients to the coordinator, which normalises them and distributes updates.",
      whySingleton:
        "TrainingCoordinator prevents layers from directly exchanging gradient tensors. Each layer calls coordinator.report_gradients() and receives coordinator.apply_update().",
      code: `class TrainingCoordinator:  # Mediator
    def __init__(self, optimizer, layers: list):
        self._optimizer = optimizer
        self._layers = layers
    def report_gradients(self, layer, gradients):
        clipped = self._optimizer.clip(gradients)
        self._optimizer.step(layer, clipped)`,
    },
    {
      id: 11,
      title: "Ride-Hailing Dispatcher",
      domain: "Marketplace / Logistics",
      description:
        "A ride-hailing service: rider requests ride → dispatcher finds nearest driver → driver receives assignment → rider receives ETA. The Dispatcher mediates between Rider and Driver objects.",
      whySingleton:
        "RideDispatcher holds driver availability and location data. Rider calls dispatcher.request_ride(). Dispatcher finds a match and calls driver.assign() and rider.confirm(driver).",
      code: `class RideDispatcher:  # Mediator
    def request_ride(self, rider, location):
        driver = self._find_nearest_driver(location)
        if driver:
            driver.assign(rider, location)
            rider.confirm(driver)
        else:
            rider.no_drivers_available()`,
    },
    {
      id: 12,
      title: "Cache Invalidation Coordinator",
      domain: "Backend / Caching",
      description:
        "Multiple caching layers (L1 in-process, L2 Redis, L3 CDN) must invalidate in coordination when data changes. Without a mediator, each service updating data would need to directly call each cache layer.",
      whySingleton:
        "CacheCoordinator mediates invalidation. Services call coordinator.invalidate(key). Coordinator propagates to all cache layers in the correct order.",
      code: `class CacheCoordinator:  # Mediator
    def __init__(self, l1, l2, l3):
        self._caches = [l1, l2, l3]  # ordered innermost to outermost
    def invalidate(self, key: str):
        for cache in self._caches:  # coordinator drives the sequence
            cache.evict(key)`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Chat Room (classic Mediator)",
      domain: "Messaging",
      problem:
        "A chat application has multiple User objects. When a user sends a message, all other online users should receive it. If User A holds references to User B, C, D…, then adding User E requires User A to be updated. With N users, there are N*(N-1) direct links.",
      solution:
        "ChatRoom is the ConcreteMediator. User is the Component base class. Every User holds a chatRoom reference (the mediator). When a user sends a message, it calls chatRoom.broadcast(self, message). ChatRoom iterates all registered users and calls receive() on each one except the sender. Users A, B, C have NO knowledge of each other — they only know the ChatRoom interface.",
      classDiagramSvg: `<svg viewBox="0 0 460 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#med-e1);}</style>
  <defs><marker id="med-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="160" y="10" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">ChatRoom (Mediator)</text>
  <line x1="160" y1="33" x2="300" y2="33" class="s-diagram-line"/>
  <text x="168" y="48" class="s-member s-diagram-member">-users: list[User]</text>
  <text x="168" y="60" class="s-member s-diagram-member">+broadcast(sender, msg)</text>
  <rect x="0" y="75" width="140" height="50" class="s-box s-diagram-box"/>
  <text x="70" y="93" text-anchor="middle" class="s-title s-diagram-title">User</text>
  <line x1="0" y1="98" x2="140" y2="98" class="s-diagram-line"/>
  <text x="8" y="112" class="s-member s-diagram-member">-mediator: ChatRoom</text>
  <text x="8" y="124" class="s-member s-diagram-member">+send(msg) +receive(msg)</text>
  <rect x="320" y="75" width="140" height="50" class="s-box s-diagram-box"/>
  <text x="390" y="93" text-anchor="middle" class="s-title s-diagram-title">User (another)</text>
  <line x1="320" y1="98" x2="460" y2="98" class="s-diagram-line"/>
  <text x="328" y="112" class="s-member s-diagram-member">-mediator: ChatRoom</text>
  <text x="328" y="124" class="s-member s-diagram-member">+send(msg) +receive(msg)</text>
  <line x1="70" y1="75" x2="175" y2="65" class="s-arr s-diagram-arrow"/>
  <line x1="390" y1="75" x2="285" y2="65" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Optional

# ── Mediator Interface ─────────────────────────────────────────────────────────
# All components depend only on this — not on ChatRoom directly.
class Mediator(ABC):
    @abstractmethod
    def broadcast(self, sender: 'User', message: str) -> None:
        """Component calls this to send a message through the mediator."""
        pass

    @abstractmethod
    def register(self, user: 'User') -> None:
        """Enrol a component with the mediator."""
        pass


# ── User: Component base class ─────────────────────────────────────────────────
# User holds ONE reference: the mediator.
# It NEVER references other User objects directly.
class User:
    def __init__(self, name: str):
        self.name: str = name
        self._mediator: Optional[Mediator] = None  # the mediator link

    def join(self, mediator: Mediator) -> None:
        """Register this user with the chat room (set the mediator link)."""
        self._mediator = mediator
        mediator.register(self)      # mediator adds us to the participant list

    def send(self, message: str) -> None:
        """Trigger an event: hand message to the mediator for distribution."""
        print(f"[{self.name}] → room: {message}")
        # Component → Mediator: user does NOT know who will receive this
        self._mediator.broadcast(self, message)

    def receive(self, sender_name: str, message: str) -> None:
        """Called by the mediator when another user sends a message."""
        # Mediator → Component: mediator calls this on all other users
        print(f"  [{self.name}] received from {sender_name}: {message}")


# ── ChatRoom: ConcreteMediator ─────────────────────────────────────────────────
# ChatRoom knows all users. It orchestrates the broadcast logic.
# If this logic changes (e.g., add mute/block), ONLY this class changes.
class ChatRoom(Mediator):
    def __init__(self, name: str):
        self._name: str = name
        self._users: list[User] = []  # all registered participants

    def register(self, user: User) -> None:
        """Add a participant. ChatRoom maintains the full participant list."""
        self._users.append(user)
        print(f"  [{user.name}] joined '{self._name}'")

    def broadcast(self, sender: User, message: str) -> None:
        """Orchestration logic: deliver message to all users except the sender."""
        for user in self._users:
            if user is not sender:  # don't echo back to sender
                user.receive(sender.name, message)


# ── Client / Application ───────────────────────────────────────────────────────
# Client creates the mediator and components, then wires them together.
print("=== Chat Room Demo ===")
room = ChatRoom("General")          # Step 1: create the mediator

alice = User("Alice")               # Step 2: create components
bob   = User("Bob")
carol = User("Carol")

alice.join(room)                     # Step 3: connect components to mediator
bob.join(room)
carol.join(room)

print()
alice.send("Hello everyone!")       # Alice → room → Bob + Carol
print()
bob.send("Hey Alice!")              # Bob → room → Alice + Carol
# Notice: NO User ever calls any other User's method directly.`,

        Go: `package main

import "fmt"

// ── Mediator Interface ─────────────────────────────────────────────────────────
type Mediator interface {
	Register(user *User)
	Broadcast(sender *User, message string)
}

// ── User: Component ────────────────────────────────────────────────────────────
// User knows ONLY the Mediator interface — not other Users.
type User struct {
	Name     string
	mediator Mediator // the single mediator reference
}

func NewUser(name string) *User { return &User{Name: name} }

func (u *User) Join(m Mediator) {
	u.mediator = m  // store the mediator link
	m.Register(u)  // tell mediator this user has joined
}

func (u *User) Send(message string) {
	fmt.Printf("[%s] → room: %s\n", u.Name, message)
	// Component notifies mediator — never contacts other users directly
	u.mediator.Broadcast(u, message)
}

func (u *User) Receive(senderName, message string) {
	// Called by mediator — component just displays the message
	fmt.Printf("  [%s] received from %s: %s\n", u.Name, senderName, message)
}

// ── ChatRoom: ConcreteMediator ─────────────────────────────────────────────────
// ChatRoom holds all users and orchestrates broadcast logic.
type ChatRoom struct {
	name  string
	users []*User
}

func NewChatRoom(name string) *ChatRoom { return &ChatRoom{name: name} }

func (c *ChatRoom) Register(user *User) {
	c.users = append(c.users, user)
	fmt.Printf("  [%s] joined '%s'\n", user.Name, c.name)
}

func (c *ChatRoom) Broadcast(sender *User, message string) {
	// Mediator orchestrates: deliver to all except sender
	for _, user := range c.users {
		if user != sender {
			user.Receive(sender.Name, message)
		}
	}
}

func main() {
	room := NewChatRoom("General")
	alice := NewUser("Alice")
	bob := NewUser("Bob")
	carol := NewUser("Carol")

	alice.Join(room)
	bob.Join(room)
	carol.Join(room)

	fmt.Println()
	alice.Send("Hello everyone!")
	fmt.Println()
	bob.Send("Hey Alice!")
}`,

        Java: `import java.util.ArrayList;
import java.util.List;

// ── Mediator Interface ─────────────────────────────────────────────────────────
interface ChatMediator {
    void register(User user);
    void broadcast(User sender, String message);
}

// ── User: Component ────────────────────────────────────────────────────────────
// User only holds a ChatMediator reference — not other Users.
class User {
    private final String name;
    private ChatMediator mediator; // the single mediator link

    public User(String name) { this.name = name; }

    public void join(ChatMediator mediator) {
        this.mediator = mediator; // set mediator link
        mediator.register(this); // enrol with the mediator
    }

    public void send(String message) {
        System.out.printf("[%s] → room: %s%n", name, message);
        mediator.broadcast(this, message); // hand off to mediator
    }

    public void receive(String senderName, String message) {
        // Mediator calls this on each target user
        System.out.printf("  [%s] received from %s: %s%n", name, senderName, message);
    }

    public String getName() { return name; }
}

// ── ChatRoom: ConcreteMediator ─────────────────────────────────────────────────
class ChatRoom implements ChatMediator {
    private final String name;
    private final List<User> users = new ArrayList<>(); // all participants

    public ChatRoom(String name) { this.name = name; }

    @Override
    public void register(User user) {
        users.add(user); // add to participant list
        System.out.printf("  [%s] joined '%s'%n", user.getName(), name);
    }

    @Override
    public void broadcast(User sender, String message) {
        // Orchestration: deliver to all except sender
        for (User user : users) {
            if (user != sender) {
                user.receive(sender.getName(), message);
            }
        }
    }
}

class MediatorDemo {
    public static void main(String[] args) {
        ChatRoom room = new ChatRoom("General");
        User alice = new User("Alice");
        User bob   = new User("Bob");
        User carol = new User("Carol");

        alice.join(room);
        bob.join(room);
        carol.join(room);

        System.out.println();
        alice.send("Hello everyone!"); // mediator routes to Bob + Carol
        System.out.println();
        bob.send("Hey Alice!");       // mediator routes to Alice + Carol
    }
}`,

        TypeScript: `// ── Mediator Interface ─────────────────────────────────────────────────────────
// All components depend only on this interface — not on ChatRoom.
interface ChatMediator {
  register(user: User): void;
  broadcast(sender: User, message: string): void;
}

// ── User: Component ────────────────────────────────────────────────────────────
// User never references other Users. Only the mediator reference is stored.
class User {
  private mediator!: ChatMediator; // set when join() is called

  constructor(public readonly name: string) {}

  join(mediator: ChatMediator): void {
    this.mediator = mediator; // store mediator link
    mediator.register(this);  // enrol with the mediator
  }

  send(message: string): void {
    console.log(\`[\${this.name}] → room: \${message}\`);
    this.mediator.broadcast(this, message); // Component → Mediator
  }

  receive(senderName: string, message: string): void {
    // Mediator → Component: mediator drives this call
    console.log(\`  [\${this.name}] received from \${senderName}: \${message}\`);
  }
}

// ── ChatRoom: ConcreteMediator ─────────────────────────────────────────────────
// Contains ALL the coordination logic. Users don't know about each other.
class ChatRoom implements ChatMediator {
  private users: User[] = []; // all registered participants

  constructor(private name: string) {}

  register(user: User): void {
    this.users.push(user);
    console.log(\`  [\${user.name}] joined '\${this.name}'\`);
  }

  broadcast(sender: User, message: string): void {
    // Mediator orchestrates delivery: all users except the sender
    this.users
      .filter(u => u !== sender) // exclude sender
      .forEach(u => u.receive(sender.name, message)); // deliver to each
  }
}

// ── Client ─────────────────────────────────────────────────────────────────────
const room = new ChatRoom("General");
const alice = new User("Alice");
const bob   = new User("Bob");
const carol = new User("Carol");

alice.join(room);
bob.join(room);
carol.join(room);

console.log();
alice.send("Hello everyone!"); // goes through room → Bob + Carol
console.log();
bob.send("Hey Alice!");        // goes through room → Alice + Carol`,

        Rust: `use std::cell::RefCell;
use std::rc::Rc;

// ── Mediator Trait ─────────────────────────────────────────────────────────────
trait Mediator {
    fn broadcast(&self, sender_name: &str, message: &str);
}

// ── ChatRoom: ConcreteMediator ─────────────────────────────────────────────────
struct ChatRoom {
    name: String,
    // Rc<RefCell<>> for shared ownership + interior mutability
    users: RefCell<Vec<Rc<User>>>,
}

impl ChatRoom {
    fn new(name: &str) -> Rc<Self> {
        Rc::new(Self { name: name.to_string(), users: RefCell::new(vec![]) })
    }

    fn register(&self, user: Rc<User>) {
        println!("  [{}] joined '{}'", user.name, self.name);
        self.users.borrow_mut().push(user); // add to participant list
    }
}

impl Mediator for ChatRoom {
    fn broadcast(&self, sender_name: &str, message: &str) {
        // Deliver to all users except the sender
        for user in self.users.borrow().iter() {
            if user.name != sender_name {
                user.receive(sender_name, message);
            }
        }
    }
}

// ── User: Component ────────────────────────────────────────────────────────────
struct User {
    name: String,
    mediator: Rc<dyn Mediator>, // only knows the mediator
}

impl User {
    fn new(name: &str, mediator: Rc<dyn Mediator>) -> Rc<Self> {
        Rc::new(Self { name: name.to_string(), mediator })
    }

    fn send(&self, message: &str) {
        println!("[{}] → room: {}", self.name, message);
        self.mediator.broadcast(&self.name, message); // delegate to mediator
    }

    fn receive(&self, sender_name: &str, message: &str) {
        println!("  [{}] received from {}: {}", self.name, sender_name, message);
    }
}

fn main() {
    let room = ChatRoom::new("General");
    let alice = User::new("Alice", room.clone());
    let bob   = User::new("Bob",   room.clone());
    let carol = User::new("Carol", room.clone());

    room.register(alice.clone());
    room.register(bob.clone());
    room.register(carol.clone());

    println!();
    alice.send("Hello everyone!"); // → Bob + Carol via room
    println!();
    bob.send("Hey Alice!");        // → Alice + Carol via room
}
`,
      },
      considerations: [
        "The ConcreteMediator can become a 'God object' — consider splitting into domain-specific mediators if coordination logic grows large",
        "Avoid bidirectional dependencies: the mediator calls component methods, but components should not call mediator methods that return component references",
        "For very large systems, consider event-based mediators with typed events rather than a single notify(sender, event) interface",
        "Mediator is centralised — it becomes a single point of failure; ensure it is well-tested",
        "Mediator vs Facade: Facade simplifies an interface to a subsystem (one-way). Mediator coordinates bidirectional interactions between components.",
      ],
    },
  ],

  variantsTabLabel: "Coordination Styles",
  variantsBestPick:
    "The event-based mediator (typed events dictionary) scales better for larger systems. The classic notify(sender, event) is simplest for small component sets.",

  variants: [
    {
      id: 1,
      name: "Classic Notify Mediator",
      description:
        "Components call mediator.notify(this, eventName). The mediator uses if/elif to dispatch based on sender type and event name. Simple but scales poorly as the number of events grows.",
      code: {
        Python: `class DialogMediator:
    """Classic mediator: single notify method dispatches all events."""
    def __init__(self, checkbox, text_field, button):
        self._checkbox = checkbox
        self._text_field = text_field
        self._button = button

    def notify(self, sender, event: str):
        # All coordination logic in one place
        if sender is self._checkbox and event == 'change':
            if self._checkbox.checked:
                self._text_field.show()
                self._button.set_label("Submit Business")
            else:
                self._text_field.hide()
                self._button.set_label("Submit")`,
        Go: `type DialogMediator struct {
    checkbox  *Checkbox
    textField *TextField
    button    *Button
}
func (m *DialogMediator) Notify(sender interface{}, event string) {
    if sender == m.checkbox && event == "change" {
        if m.checkbox.Checked {
            m.textField.Show()
            m.button.SetLabel("Submit Business")
        }
    }
}`,
        Java: `class DialogMediator {
    private Checkbox checkbox; private TextField textField; private Button button;
    void notify(Object sender, String event) {
        if (sender == checkbox && "change".equals(event)) {
            if (checkbox.isChecked()) {
                textField.show();
                button.setLabel("Submit Business");
            }
        }
    }
}`,
        TypeScript: `class DialogMediator {
  constructor(
    private checkbox: Checkbox,
    private textField: TextField,
    private button: Button
  ) {}
  notify(sender: object, event: string) {
    if (sender === this.checkbox && event === 'change') {
      if (this.checkbox.checked) {
        this.textField.show();
        this.button.setLabel("Submit Business");
      }
    }
  }
}`,
        Rust: `struct DialogMediator { /* fields */ }
impl DialogMediator {
    fn notify(&mut self, sender_id: &str, event: &str) {
        if sender_id == "checkbox" && event == "change" {
            self.text_field.show();
            self.button.set_label("Submit Business");
        }
    }
}`,
      },
      pros: ["Simple", "All coordination in one visible place"],
      cons: ["notify() grows into a long if/elif chain", "Hard to unit-test individual event handlers"],
    },
    {
      id: 2,
      name: "Event-Based Mediator (Handler Registry)",
      description:
        "The mediator maintains a dictionary of event-type → [handlers]. Components subscribe to event types. The mediator dispatches to all subscribers. More scalable and testable.",
      code: {
        Python: `from collections import defaultdict
from typing import Callable

class EventMediator:
    """Event-based mediator: components subscribe to typed events."""
    def __init__(self):
        # Each event name maps to a list of handler callables
        self._handlers: dict[str, list[Callable]] = defaultdict(list)

    def on(self, event: str, handler: Callable) -> None:
        """Subscribe a handler to an event type."""
        self._handlers[event].append(handler)

    def emit(self, event: str, data=None) -> None:
        """Publish an event — mediator dispatches to all subscribers."""
        for handler in self._handlers[event]:
            handler(data)  # call each registered handler

# Usage
mediator = EventMediator()
mediator.on("user_joined", lambda d: print(f"{d} joined"))
mediator.on("user_joined", lambda d: print(f"Welcome, {d}!"))
mediator.emit("user_joined", "Alice")`,
        Go: `type EventMediator struct {
    handlers map[string][]func(interface{})
}
func (m *EventMediator) On(event string, h func(interface{})) {
    m.handlers[event] = append(m.handlers[event], h)
}
func (m *EventMediator) Emit(event string, data interface{}) {
    for _, h := range m.handlers[event] { h(data) }
}`,
        Java: `import java.util.*;function
class EventMediator {
    private Map<String, List<Consumer<Object>>> handlers = new HashMap<>();
    public void on(String event, Consumer<Object> handler) {
        handlers.computeIfAbsent(event, k -> new ArrayList<>()).add(handler);
    }
    public void emit(String event, Object data) {
        handlers.getOrDefault(event, List.of()).forEach(h -> h.accept(data));
    }
}`,
        TypeScript: `class EventMediator {
  private handlers = new Map<string, Array<(data?: unknown) => void>>();
  on(event: string, handler: (data?: unknown) => void) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
  }
  emit(event: string, data?: unknown) {
    this.handlers.get(event)?.forEach(h => h(data));
  }
}`,
        Rust: `use std::collections::HashMap;
type Handler = Box<dyn Fn(&str)>;
struct EventMediator { handlers: HashMap<String, Vec<Handler>> }
impl EventMediator {
    fn on(&mut self, event: &str, h: impl Fn(&str) + 'static) {
        self.handlers.entry(event.to_string()).or_default().push(Box::new(h));
    }
    fn emit(&self, event: &str, data: &str) {
        if let Some(hs) = self.handlers.get(event) {
            for h in hs { h(data); }
        }
    }
}`,
      },
      pros: ["Scales to many event types without if/elif chains", "Handlers can be added/removed at runtime"],
      cons: ["Event name strings are untyped — typos cause silent misses", "Harder to track which components respond to which events"],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Behavioral" },
    { aspect: "Intent", detail: "Replace a many-to-many component network with a hub-and-spoke topology via a central mediator" },
    { aspect: "Core Mechanism", detail: "Components call mediator.notify(). Mediator orchestrates responses by calling methods on target components." },
    { aspect: "Coupling Reduction", detail: "N components: N*(N-1) direct links → N mediator links. Adding a component touches only the mediator." },
    { aspect: "Mediator vs Observer", detail: "Observer: one-to-many passive broadcast. Mediator: many-to-many active coordination. Mediator can veto, transform, and sequence events." },
    { aspect: "Mediator vs Facade", detail: "Facade simplifies access to a subsystem (unidirectional). Mediator coordinates bidirectional interactions between peers." },
    { aspect: "Risk", detail: "The ConcreteMediator can become a God Object — split large mediators by domain or use the event-handler registry variant" },
    { aspect: "Testability", detail: "Components are easily unit-tested by injecting a mock mediator. The mediator itself is tested by driving its notify() method." },
    { aspect: "When to Use", detail: "When multiple components must interact and direct coupling creates a tangled dependency graph — UI forms, workflow engines, multiplayer games" },
  ],

  antiPatterns: [
    {
      name: "God Mediator",
      description:
        "The ConcreteMediator grows to hundreds of lines with every component interaction in one class. It becomes the hardest-to-maintain class in the system and a single point of failure.",
      betterAlternative:
        "Split the mediator by domain (UIFormMediator, DataLayerMediator). Use the event-handler registry variant so each feature area registers its own handlers independently.",
    },
    {
      name: "Components Bypassing the Mediator",
      description:
        "A component stores a reference to another component 'just for this one case'. This re-introduces direct coupling and makes the mediator's model inconsistent.",
      betterAlternative:
        "Enforce the rule: components may only hold a mediator reference, never peer references. Code review and linting rules can enforce this.",
    },
    {
      name: "Using Mediator for Simple One-to-One Interactions",
      description:
        "A payment button that only calls PaymentService gets routed through a mediator for no benefit. The extra indirection adds complexity with no decoupling value.",
      betterAlternative:
        "Use Mediator when you have 3+ components that need N*(N-1) interactions. For simple one-to-one or one-to-few interactions, prefer direct dependency injection.",
    },
  ],
};

export default mediatorData;
