import { PatternData } from "@/lib/patterns/types";

const bridgeData: PatternData = {
  slug: "bridge",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Bridge Pattern",
  subtitle:
    "Decouple an abstraction from its implementation so that the two can vary independently without one forcing changes on the other.",

  intent:
    "Imagine you have a Shape abstraction with Circle and Rectangle subclasses. Now you need to add color: RedCircle, BlueCircle, RedRectangle, BlueRectangle — that's 4 classes for 2 shapes × 2 colors, and it grows multiplicatively with each new dimension.\n\nThe Bridge pattern solves this combinatorial explosion by separating the orthogonal dimensions into two independent hierarchies connected by a 'bridge' (a reference/composition). The Abstraction holds a reference to the Implementor interface. The Abstraction hierarchy (Shape) and the Implementor hierarchy (Color/Renderer) evolve independently.\n\nBridge is especially powerful when both the abstraction and the implementation need to be extensible via subclassing, when you want to hide implementation details completely, or when you want to switch implementations at runtime.",

  classDiagramSvg: `<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#br-arr); }
    .s-dash { stroke-dasharray:5,3; }
  </style>
  <defs>
    <marker id="br-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Abstraction -->
  <rect x="10" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="110" y="28" text-anchor="middle" class="s-title s-diagram-title">Abstraction</text>
  <line x1="10" y1="33" x2="210" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">-impl: Implementor</text>
  <text x="20" y="65" class="s-member s-diagram-member">+operation(): void</text>
  <!-- RefinedAbstraction -->
  <rect x="10" y="130" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="110" y="148" text-anchor="middle" class="s-title s-diagram-title">RefinedAbstraction</text>
  <line x1="10" y1="153" x2="210" y2="153" class="s-diagram-line"/>
  <text x="20" y="170" class="s-member s-diagram-member">+operation(): void</text>
  <!-- Implementor -->
  <rect x="340" y="10" width="210" height="55" class="s-box s-diagram-box"/>
  <text x="445" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Implementor</text>
  <line x1="340" y1="33" x2="550" y2="33" class="s-diagram-line"/>
  <text x="350" y="50" class="s-member s-diagram-member">+operationImpl(): void</text>
  <!-- ConcreteImplA -->
  <rect x="310" y="130" width="110" height="50" class="s-box s-diagram-box"/>
  <text x="365" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteImplA</text>
  <line x1="310" y1="153" x2="420" y2="153" class="s-diagram-line"/>
  <text x="318" y="170" class="s-member s-diagram-member">+operationImpl()</text>
  <!-- ConcreteImplB -->
  <rect x="435" y="130" width="110" height="50" class="s-box s-diagram-box"/>
  <text x="490" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteImplB</text>
  <line x1="435" y1="153" x2="545" y2="153" class="s-diagram-line"/>
  <text x="443" y="170" class="s-member s-diagram-member">+operationImpl()</text>
  <!-- Arrows -->
  <line x1="110" y1="130" x2="110" y2="80" class="s-arr s-diagram-arrow"/>
  <line x1="210" y1="40" x2="340" y2="40" class="s-arr s-diagram-arrow"/>
  <line x1="365" y1="130" x2="400" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="490" y1="130" x2="460" y2="65" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Abstraction holds a reference to the Implementor interface — this reference is the 'bridge'. When Abstraction.operation() is called, it delegates part or all of the work to impl.operationImpl(). RefinedAbstraction extends the Abstraction hierarchy by adding higher-level behavior while still delegating to the Implementor. ConcreteImplA and ConcreteImplB are the two independent concrete implementations that the Abstraction can switch between. The key insight is that neither hierarchy knows about the other's concrete types — they communicate only through the Implementor interface.",

  diagramComponents: [
    {
      name: "Abstraction",
      description:
        "The high-level control layer. Defines the client-facing interface and holds a reference to an Implementor. Its methods delegate to the Implementor. Clients only interact with the Abstraction — they never touch the Implementor directly.",
    },
    {
      name: "RefinedAbstraction",
      description:
        "Extends the Abstraction by adding higher-level operations that compose Implementor calls. For example, a Shape (RefinedAbstraction) may implement draw() by calling impl.renderOutline() and impl.fillColor(). Multiple refined abstractions can share the same Implementor.",
    },
    {
      name: "Implementor (interface)",
      description:
        "Defines the interface for the implementation classes. This interface does NOT need to match the Abstraction's interface. Typically the Implementor defines primitive operations and the Abstraction builds higher-level operations on top of them.",
    },
    {
      name: "ConcreteImplementor",
      description:
        "Provides platform-specific, format-specific, or technology-specific implementation. Multiple ConcreteImplementors can exist alongside each other (e.g., OpenGLRenderer and DirectXRenderer). The Abstraction can hold any of them and switch at runtime.",
    },
  ],

  solutionDetail:
    "**The Problem:** You have two orthogonal dimensions of variation — for example, Shape (Circle, Rectangle) × Renderer (SVG, Canvas, WebGL). Inheritance alone explodes: CircleSVG, CircleCanvas, CircleWebGL, RectSVG, RectCanvas, RectWebGL = 6 classes for 2×3. Adding a Triangle or a new renderer means adding many more classes at once.\n\n**The Bridge Solution:** Extract the second dimension (Renderer) into a separate interface hierarchy. The first hierarchy (Shape) holds a reference to the Renderer interface — the bridge. Shape.draw() delegates rendering primitives to this.renderer.drawLine(), this.renderer.fillColor(), etc.\n\n**How It Works:**\n\n1. **Identify orthogonal dimensions**: Find the two (or more) independently-varying concerns. One becomes the Abstraction hierarchy, the other the Implementor hierarchy.\n\n2. **Define the Implementor interface**: Extract the primitive operations the Abstraction needs from the implementation side.\n\n3. **Abstraction holds Implementor reference**: Inject the Implementor at construction time (or via setter for runtime switching).\n\n4. **Abstraction delegates**: High-level Abstraction methods compose calls to Implementor primitive methods.\n\n5. **Extend independently**: Add new shapes without touching renderers, and add new renderers without touching shapes.\n\n**Key Insight:** Bridge is about composition replacing inheritance for one dimension. Instead of CircleSVG inheriting from both Circle and SVGRenderer, Circle has-a Renderer. The number of classes becomes M+N instead of M×N.",

  characteristics: [
    "Decouples abstraction from implementation — both can vary independently",
    "Eliminates combinatorial class explosion (M+N classes instead of M×N)",
    "Implementation can be switched at runtime by replacing the Implementor reference",
    "Abstraction and Implementor hierarchies can be extended independently",
    "Client code depends only on the Abstraction — implementation details are hidden",
    "Supports the Open/Closed Principle on two axes simultaneously",
    "Often used with Dependency Injection to provide the Implementor at runtime",
  ],

  useCases: [
    {
      id: 1,
      title: "Cross-Platform UI Rendering",
      domain: "Desktop / Mobile",
      description:
        "A UI toolkit has widgets (Button, CheckBox, Menu) that need to render differently on Mac, Windows, and Linux. Inheriting per-platform would create ButtonMac, ButtonWin, ButtonLinux, CheckBoxMac...",
      whySingleton:
        "Bridge separates the widget hierarchy (Abstraction) from the platform rendering (Implementor). Button delegates drawBackground(), drawText(), drawBorder() to the platform renderer.",
      code: `class Button {
  constructor(private renderer: UIRenderer) {}
  render() {
    this.renderer.drawBackground();
    this.renderer.drawText(this.label);
    this.renderer.drawBorder();
  }
}`,
    },
    {
      id: 2,
      title: "Database Driver Abstraction",
      domain: "Backend / Data Layer",
      description:
        "A repository layer needs to support PostgreSQL, MySQL, and MongoDB. Each database has completely different query APIs, connection models, and result formats.",
      whySingleton:
        "The Repository (Abstraction) delegates all database operations to a DBDriver (Implementor). Swapping databases means injecting a different driver without changing any repository code.",
      code: `class UserRepository {
  constructor(private db: DBDriver) {}
  findById(id: string): User {
    const row = this.db.execute(\`SELECT * FROM users WHERE id=?\`, [id]);
    return mapRowToUser(row);
  }
}`,
    },
    {
      id: 3,
      title: "Document Export (Multiple Formats)",
      domain: "Enterprise SaaS",
      description:
        "A document has sections (heading, paragraph, table, image). It must be exportable to PDF, HTML, and Markdown. Each section renders differently per format.",
      whySingleton:
        "Document is the Abstraction, ExportRenderer (PDFRenderer, HTMLRenderer) is the Implementor. Document.export() orchestrates calls to renderer.renderHeading(), renderer.renderTable(), etc.",
      code: `class Document {
  constructor(private renderer: DocRenderer) {}
  export() {
    for (const section of this.sections) {
      section.render(this.renderer);
    }
  }
}`,
    },
    {
      id: 4,
      title: "Payment Method × Gateway",
      domain: "Fintech",
      description:
        "A payment service supports CreditCard and BankTransfer payment types across Stripe, PayPal, and Braintree gateways. Without Bridge: 6 classes. With Bridge: 2 + 3 = 5 classes.",
      whySingleton:
        "PaymentMethod (Abstraction) holds a PaymentGateway (Implementor). process() delegates authorization and capture to the gateway's specific API.",
      code: `class CreditCardPayment {
  constructor(private gateway: PaymentGateway) {}
  process(amount: number, card: CardDetails) {
    const token = this.gateway.tokenize(card);
    return this.gateway.charge(token, amount);
  }
}`,
    },
    {
      id: 5,
      title: "Notification Channels",
      domain: "SaaS / Communication",
      description:
        "A notification system has types (OrderConfirm, PasswordReset, PromoAlert) that need to be sent via Email, SMS, and Push. Without Bridge: 9 classes. With Bridge: 3 + 3.",
      whySingleton:
        "Notification (Abstraction) holds a NotificationChannel (Implementor). send() delegates to channel.deliver(recipient, subject, body).",
      code: `class OrderConfirmNotification {
  constructor(private channel: NotificationChannel) {}
  send(order: Order) {
    this.channel.deliver(order.email, "Order Confirmed", \`Order #\${order.id}\`);
  }
}`,
    },
    {
      id: 6,
      title: "Shape Drawing with Renderers",
      domain: "Graphics / Games",
      description:
        "Classic Bridge example: shapes (Circle, Rectangle, Triangle) × renderers (SVG, Canvas, WebGL). Each shape uses renderer primitives but defines its own geometry logic.",
      whySingleton:
        "Shape holds a Renderer. Circle.draw() computes its geometry then calls renderer.drawEllipse(). RectAngle.draw() calls renderer.drawRect(). Adding WebGLRenderer doesn't change Shape code.",
      code: `class Circle extends Shape {
  constructor(private r: number, renderer: Renderer) {
    super(renderer);
  }
  draw() {
    // Circle defines geometry; renderer draws it
    this.renderer.drawEllipse(this.x, this.y, this.r, this.r);
  }
}`,
    },
    {
      id: 7,
      title: "Logging Framework × Transport",
      domain: "Backend Infrastructure",
      description:
        "A logger has levels (ErrorLogger, InfoLogger, DebugLogger) that write to different transports (File, Console, HTTP, Syslog). Bridge prevents 12 classes from forming.",
      whySingleton:
        "Logger is the Abstraction; LogTransport is the Implementor. ErrorLogger.log() formats the error record then delegates to transport.write(serialized).",
      code: `class ErrorLogger {
  constructor(private transport: LogTransport) {}
  log(error: Error) {
    const record = { level: "error", msg: error.message, stack: error.stack };
    this.transport.write(JSON.stringify(record));
  }
}`,
    },
    {
      id: 8,
      title: "Report Types × Themes",
      domain: "Analytics / BI",
      description:
        "An analytics platform has report types (SalesReport, InventoryReport, HRReport) that can be rendered with different visual themes (Dark, Light, PrintFriendly). Bridge prevents 9 combinations.",
      whySingleton:
        "Report (Abstraction) holds a Theme (Implementor). Report.render() calls theme.applyHeader(), theme.applyTable(), theme.applyFooter() for consistent theming across all report types.",
      code: `class SalesReport {
  constructor(private theme: ReportTheme) {}
  render(data: SalesData) {
    this.theme.applyHeader("Sales Report");
    this.theme.renderChart(data.chartData);
    this.theme.renderTable(data.rows);
  }
}`,
    },
    {
      id: 9,
      title: "Media Player × Codec",
      domain: "Multimedia",
      description:
        "A media player has playback modes (StreamingPlayer, LocalPlayer) that need to support multiple codecs (H264, VP9, AV1). Bridge decouples playback from decoding.",
      whySingleton:
        "MediaPlayer (Abstraction) holds a Codec (Implementor). play() reads raw bytes and delegates decoding to codec.decode(). Switching codecs is a one-line change.",
      code: `class StreamingPlayer {
  constructor(private codec: VideoCodec) {}
  play(url: string) {
    const stream = this.fetchStream(url);
    const frames = this.codec.decode(stream);
    this.renderFrames(frames);
  }
}`,
    },
    {
      id: 10,
      title: "Authentication × Identity Provider",
      domain: "SaaS / Identity",
      description:
        "An auth system supports SSO and MFA authentication methods across Google, GitHub, and Azure AD identity providers. Bridge prevents 6-class explosion.",
      whySingleton:
        "AuthMethod (Abstraction) holds an IdentityProvider (Implementor). authenticate() orchestrates the auth flow and delegates token exchange to provider.exchangeCode().",
      code: `class SSOAuthentication {
  constructor(private idp: IdentityProvider) {}
  authenticate(code: string): Session {
    const token = this.idp.exchangeCode(code);
    const user = this.idp.getUserInfo(token);
    return createSession(user);
  }
}`,
    },
    {
      id: 11,
      title: "Cache Strategy × Storage Backend",
      domain: "Backend / Performance",
      description:
        "A caching layer has strategies (LRU, LFU, TTL) that can store data in Redis, Memcached, or in-memory. Bridge decouples eviction strategy from storage mechanism.",
      whySingleton:
        "CacheStrategy (Abstraction) holds a CacheStorage (Implementor). LRUCache.get() implements LRU logic and delegates actual reads/writes to storage.get() / storage.set().",
      code: `class LRUCache {
  constructor(private storage: CacheStorage, private capacity: number) {}
  get(key: string): any {
    this.accessOrder.moveToFront(key);
    return this.storage.get(key);
  }
}`,
    },
    {
      id: 12,
      title: "Search Algorithm × Data Source",
      domain: "Data Engineering",
      description:
        "A search service has algorithms (FullTextSearch, FuzzySearch, SemanticSearch) that operate on different data sources (Elasticsearch, PostgreSQL, MongoDB).",
      whySingleton:
        "SearchAlgorithm (Abstraction) holds a DataSource (Implementor). FullTextSearch.search() applies tokenization and scoring logic then delegates data fetching to source.query().",
      code: `class FullTextSearch {
  constructor(private source: DataSource) {}
  search(query: string): Result[] {
    const tokens = tokenize(query);
    const raw = this.source.query({ tokens, type: "full_text" });
    return rankResults(raw, tokens);
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Shape × Renderer — Classic Bridge",
      domain: "Graphics",
      problem:
        "A drawing application has shapes (Circle, Rectangle) that must render on SVG and Canvas. Without Bridge, every combination (CircleSVG, CircleCanvas, RectSVG, RectCanvas) requires its own class. Adding a new shape or renderer multiplies the number of classes.",
      solution:
        "Bridge separates Shape (Abstraction) from Renderer (Implementor). Shape stores a Renderer reference. Each shape calls renderer primitive methods for drawing. New shapes and renderers can be added independently — the bridge (composition) replaces inheritance-based combination.",
      classDiagramSvg: `<svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#br-e1); }
  </style>
  <defs><marker id="br-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="160" height="65" class="s-box s-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="s-title s-diagram-title">Shape (abstract)</text>
  <line x1="10" y1="33" x2="170" y2="33" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-renderer: Renderer</text>
  <text x="18" y="62" class="s-member s-diagram-member">+draw(): void</text>
  <rect x="10" y="115" width="70" height="35" class="s-box s-diagram-box"/>
  <text x="45" y="133" text-anchor="middle" class="s-title s-diagram-title">Circle</text>
  <rect x="100" y="115" width="70" height="35" class="s-box s-diagram-box"/>
  <text x="135" y="133" text-anchor="middle" class="s-title s-diagram-title">Rectangle</text>
  <rect x="280" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="370" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Renderer</text>
  <line x1="280" y1="33" x2="460" y2="33" class="s-diagram-line"/>
  <text x="288" y="48" class="s-member s-diagram-member">+renderCircle(x,y,r)</text>
  <rect x="250" y="110" width="90" height="35" class="s-box s-diagram-box"/>
  <text x="295" y="128" text-anchor="middle" class="s-title s-diagram-title">SVGRenderer</text>
  <rect x="360" y="110" width="100" height="35" class="s-box s-diagram-box"/>
  <text x="410" y="128" text-anchor="middle" class="s-title s-diagram-title">CanvasRenderer</text>
  <line x1="45" y1="115" x2="70" y2="75" class="s-arr s-diagram-arrow"/>
  <line x1="135" y1="115" x2="110" y2="75" class="s-arr s-diagram-arrow"/>
  <line x1="170" y1="35" x2="280" y2="35" class="s-arr s-diagram-arrow"/>
  <line x1="295" y1="110" x2="340" y2="65" class="s-arr s-diagram-arrow"/>
  <line x1="410" y1="110" x2="390" y2="65" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
import math

# ── STEP 1: Define the Implementor interface ──────────────────────────────────
# Renderer declares primitive operations.
# Shape will call these — it never knows which concrete renderer is active.
class Renderer(ABC):
    @abstractmethod
    def render_circle(self, x: float, y: float, radius: float) -> None: ...

    @abstractmethod
    def render_rect(self, x: float, y: float, w: float, h: float) -> None: ...


# ── STEP 2: Concrete Implementors ─────────────────────────────────────────────
# SVGRenderer: emits SVG markup
class SVGRenderer(Renderer):
    def render_circle(self, x, y, r):
        # Translate to SVG <circle> tag — shape never sees this XML
        print(f'<circle cx="{x}" cy="{y}" r="{r}"/>')

    def render_rect(self, x, y, w, h):
        print(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>')


# CanvasRenderer: calls HTML Canvas 2D API
class CanvasRenderer(Renderer):
    def render_circle(self, x, y, r):
        # Shape calls this without knowing it's Canvas API
        print(f"ctx.arc({x}, {y}, {r}, 0, {2*math.pi}); ctx.stroke()")

    def render_rect(self, x, y, w, h):
        print(f"ctx.strokeRect({x}, {y}, {w}, {h})")


# ── STEP 3: Define the Abstraction ────────────────────────────────────────────
# Shape stores the bridge reference (renderer).
# It defines shape-level operations but delegates rendering to impl.
class Shape(ABC):
    def __init__(self, renderer: Renderer):
        # ← This reference IS the bridge — composition over inheritance
        self._renderer = renderer

    @abstractmethod
    def draw(self) -> None: ...

    def change_renderer(self, renderer: Renderer) -> None:
        # Runtime switching: swap the Implementor without recreating the shape
        self._renderer = renderer


# ── STEP 4: Refined Abstractions ──────────────────────────────────────────────
# Circle knows its geometry; delegates pixel-level rendering to the bridge
class Circle(Shape):
    def __init__(self, x: float, y: float, radius: float, renderer: Renderer):
        super().__init__(renderer)
        self.x, self.y, self.radius = x, y, radius

    def draw(self) -> None:
        # Circle computes geometry, then calls renderer — NOT render logic
        print(f"[Circle] Drawing at ({self.x},{self.y}) r={self.radius}")
        self._renderer.render_circle(self.x, self.y, self.radius)


class Rectangle(Shape):
    def __init__(self, x, y, w, h, renderer: Renderer):
        super().__init__(renderer)
        self.x, self.y, self.w, self.h = x, y, w, h

    def draw(self) -> None:
        # Rectangle computes geometry, bridge handles rendering
        print(f"[Rect] Drawing at ({self.x},{self.y}) {self.w}×{self.h}")
        self._renderer.render_rect(self.x, self.y, self.w, self.h)


# ── STEP 5: Client wires Abstraction + Implementor ───────────────────────────
# Pattern achieved: Circle and SVGRenderer are completely independent classes.
# The bridge (composition) connects them at runtime — not compile time.

svg = SVGRenderer()
canvas = CanvasRenderer()

# Same Circle — two renderers, zero extra classes
circle = Circle(50, 50, 30, svg)
circle.draw()
# [Circle] Drawing at (50,50) r=30
# <circle cx="50" cy="50" r="30"/>

circle.change_renderer(canvas)  # swap at runtime!
circle.draw()
# [Circle] Drawing at (50,50) r=30
# ctx.arc(50, 50, 30, 0, 6.28); ctx.stroke()

rect = Rectangle(10, 10, 100, 80, svg)
rect.draw()`,

        Go: `package main

import (
	"fmt"
	"math"
)

// ── Implementor interface ─────────────────────────────────────────────────────
// Renderer defines the low-level drawing primitives.
// Shape only depends on this interface — never on concrete renderers.
type Renderer interface {
	RenderCircle(x, y, r float64)
	RenderRect(x, y, w, h float64)
}

// ── Concrete Implementors ─────────────────────────────────────────────────────
// Each renderer provides platform-specific output.
type SVGRenderer struct{}

func (s *SVGRenderer) RenderCircle(x, y, r float64) {
	// Emits SVG markup — the Shape never sees this
	fmt.Printf("<circle cx=\"%.0f\" cy=\"%.0f\" r=\"%.0f\"/>\\n", x, y, r)
}
func (s *SVGRenderer) RenderRect(x, y, w, h float64) {
	fmt.Printf("<rect x=\"%.0f\" y=\"%.0f\" width=\"%.0f\" height=\"%.0f\"/>\\n", x, y, w, h)
}

type CanvasRenderer struct{}

func (c *CanvasRenderer) RenderCircle(x, y, r float64) {
	// Emits Canvas API calls — Shape doesn't care which output format
	fmt.Printf("ctx.arc(%.0f, %.0f, %.0f, 0, %.2f)\\n", x, y, r, 2*math.Pi)
}
func (c *CanvasRenderer) RenderRect(x, y, w, h float64) {
	fmt.Printf("ctx.strokeRect(%.0f, %.0f, %.0f, %.0f)\\n", x, y, w, h)
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Shape stores the bridge and defines the high-level shape interface.
type Shape struct {
	renderer Renderer // ← The bridge reference
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// Circle embeds Shape (gets the bridge) and adds circle-specific geometry.
type Circle struct {
	Shape
	X, Y, Radius float64
}

func NewCircle(x, y, r float64, renderer Renderer) *Circle {
	// Bridge injected at construction — can be swapped later
	return &Circle{Shape: Shape{renderer: renderer}, X: x, Y: y, Radius: r}
}

func (c *Circle) Draw() {
	// Circle: geometry decision is here; rendering decision is in the bridge
	fmt.Printf("[Circle] at (%.0f,%.0f) r=%.0f\\n", c.X, c.Y, c.Radius)
	c.renderer.RenderCircle(c.X, c.Y, c.Radius) // delegate to bridge
}

type Rectangle struct {
	Shape
	X, Y, W, H float64
}

func NewRectangle(x, y, w, h float64, renderer Renderer) *Rectangle {
	return &Rectangle{Shape: Shape{renderer: renderer}, X: x, Y: y, W: w, H: h}
}

func (r *Rectangle) Draw() {
	fmt.Printf("[Rect] at (%.0f,%.0f) %.0f×%.0f\\n", r.X, r.Y, r.W, r.H)
	r.renderer.RenderRect(r.X, r.Y, r.W, r.H)
}

func main() {
	svg := &SVGRenderer{}
	canvas := &CanvasRenderer{}

	// Pattern in action: same Circle, two renderers, no class explosion
	circle := NewCircle(50, 50, 30, svg)
	circle.Draw() // → SVG output

	circle.renderer = canvas // runtime switch — same object, different impl
	circle.Draw() // → Canvas output

	NewRectangle(10, 10, 100, 80, svg).Draw()
}`,

        Java: `import java.lang.Math;

// ── Implementor Interface ─────────────────────────────────────────────────────
// Renderer declares the primitive drawing operations.
// Shape only depends on this interface — completely decoupled from concrete classes.
interface Renderer {
    void renderCircle(double x, double y, double r);
    void renderRect(double x, double y, double w, double h);
}

// ── Concrete Implementors ─────────────────────────────────────────────────────
// SVGRenderer writes SVG markup — completely platform-specific code isolated here
class SVGRenderer implements Renderer {
    @Override
    public void renderCircle(double x, double y, double r) {
        System.out.printf("<circle cx=\"%.0f\" cy=\"%.0f\" r=\"%.0f\"/>%n", x, y, r);
    }
    @Override
    public void renderRect(double x, double y, double w, double h) {
        System.out.printf("<rect x=\"%.0f\" y=\"%.0f\" width=\"%.0f\" height=\"%.0f\"/>%n", x, y, w, h);
    }
}

// CanvasRenderer calls HTML5 Canvas API — totally different from SVG
class CanvasRenderer implements Renderer {
    @Override
    public void renderCircle(double x, double y, double r) {
        System.out.printf("ctx.arc(%.0f, %.0f, %.0f, 0, %.2f)%n", x, y, r, 2 * Math.PI);
    }
    @Override
    public void renderRect(double x, double y, double w, double h) {
        System.out.printf("ctx.strokeRect(%.0f, %.0f, %.0f, %.0f)%n", x, y, w, h);
    }
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Shape is the abstract base — holds the bridge reference (the Renderer).
// All shapes extend this; they all get the bridge for free.
abstract class Shape {
    protected Renderer renderer; // ← The bridge — composition, not inheritance

    Shape(Renderer renderer) { this.renderer = renderer; }

    abstract void draw();

    // Bridge can be swapped at runtime without recreating the shape
    void changeRenderer(Renderer r) { this.renderer = r; }
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// Circle knows its geometry; rendering is fully delegated to the bridge
class Circle extends Shape {
    private double x, y, radius;

    Circle(double x, double y, double radius, Renderer renderer) {
        super(renderer); // pass bridge up to Shape
        this.x = x; this.y = y; this.radius = radius;
    }

    @Override
    public void draw() {
        System.out.printf("[Circle] at (%.0f,%.0f) r=%.0f%n", x, y, radius);
        renderer.renderCircle(x, y, radius); // delegate to bridge
    }
}

class Rectangle extends Shape {
    private double x, y, w, h;

    Rectangle(double x, double y, double w, double h, Renderer renderer) {
        super(renderer);
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    @Override
    public void draw() {
        System.out.printf("[Rect] at (%.0f,%.0f) %.0f×%.0f%n", x, y, w, h);
        renderer.renderRect(x, y, w, h);
    }
}

// ── Client ────────────────────────────────────────────────────────────────────
class BridgeDemo {
    public static void main(String[] args) {
        Renderer svg = new SVGRenderer();
        Renderer canvas = new CanvasRenderer();

        // Pattern achieved: 2 shapes + 2 renderers = 4 combinations, 4 classes (not 4 subclasses)
        Shape circle = new Circle(50, 50, 30, svg);
        circle.draw(); // → <circle cx="50" cy="50" r="30"/>

        circle.changeRenderer(canvas); // ← Runtime bridge swap
        circle.draw(); // → ctx.arc(50, 50, 30, 0, 6.28)

        new Rectangle(10, 10, 100, 80, svg).draw();
    }
}`,

        TypeScript: `// ── Implementor Interface ────────────────────────────────────────────────────
// Renderer defines primitive drawing operations — the "low-level" side of the bridge.
// Shape hierarchy only depends on this interface, never on concrete classes.
interface Renderer {
  renderCircle(x: number, y: number, r: number): void;
  renderRect(x: number, y: number, w: number, h: number): void;
}

// ── Concrete Implementors ─────────────────────────────────────────────────────
// SVGRenderer: all SVG-specific code lives here, isolated from shape logic
class SVGRenderer implements Renderer {
  renderCircle(x: number, y: number, r: number) {
    // Shape calls this; it doesn't know it's SVG output
    console.log(\`<circle cx="\${x}" cy="\${y}" r="\${r}"/>\`);
  }
  renderRect(x: number, y: number, w: number, h: number) {
    console.log(\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}"/>\`);
  }
}

// CanvasRenderer: completely different API surface — same interface contract
class CanvasRenderer implements Renderer {
  renderCircle(x: number, y: number, r: number) {
    console.log(\`ctx.arc(\${x}, \${y}, \${r}, 0, \${(2 * Math.PI).toFixed(2)})\`);
  }
  renderRect(x: number, y: number, w: number, h: number) {
    console.log(\`ctx.strokeRect(\${x}, \${y}, \${w}, \${h})\`);
  }
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Shape base class holds the bridge (renderer reference).
// All shapes inherit the bridge — and can use or swap it.
abstract class Shape {
  constructor(protected renderer: Renderer) {} // ← bridge injected

  abstract draw(): void;

  // Runtime implementation swap — change renderer without recreating shape
  changeRenderer(renderer: Renderer) { this.renderer = renderer; }
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// Circle: knows x/y/radius geometry; calls renderer for actual pixels
class Circle extends Shape {
  constructor(private x: number, private y: number, private r: number, renderer: Renderer) {
    super(renderer);
  }

  draw() {
    console.log(\`[Circle] at (\${this.x},\${this.y}) r=\${this.r}\`);
    // Delegate rendering to bridge — Circle doesn't care which renderer it is
    this.renderer.renderCircle(this.x, this.y, this.r);
  }
}

// Rectangle: knows its own geometry; delegates drawing down the bridge
class Rectangle extends Shape {
  constructor(private x: number, private y: number, private w: number, private h: number, renderer: Renderer) {
    super(renderer);
  }

  draw() {
    console.log(\`[Rect] at (\${this.x},\${this.y}) \${this.w}×\${this.h}\`);
    this.renderer.renderRect(this.x, this.y, this.w, this.h);
  }
}

// ── Client ────────────────────────────────────────────────────────────────────
// Pattern achieved: 2+2 classes instead of 2×2=4 subclasses.
// Extending either side doesn't force changes on the other.
const svg = new SVGRenderer();
const canvas = new CanvasRenderer();

const circle = new Circle(50, 50, 30, svg);
circle.draw(); // [Circle] at (50,50) r=30  →  <circle cx="50" cy="50" r="30"/>

circle.changeRenderer(canvas); // ← swap bridge at runtime
circle.draw(); // [Circle] at (50,50) r=30  →  ctx.arc(50, 50, 30, 0, 6.28)

new Rectangle(10, 10, 100, 80, svg).draw();`,

        Rust: `// ── Implementor Trait ────────────────────────────────────────────────────────
// Renderer defines the primitive operations.
// Shape only depends on this trait — decoupled from concrete implementations.
trait Renderer {
    fn render_circle(&self, x: f64, y: f64, r: f64);
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64);
}

// ── Concrete Implementors ─────────────────────────────────────────────────────
struct SVGRenderer;

impl Renderer for SVGRenderer {
    fn render_circle(&self, x: f64, y: f64, r: f64) {
        // All SVG-specific output logic isolated here
        println!("<circle cx=\"{x:.0}\" cy=\"{y:.0}\" r=\"{r:.0}\"/>");
    }
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64) {
        println!("<rect x=\"{x:.0}\" y=\"{y:.0}\" width=\"{w:.0}\" height=\"{h:.0}\"/>");
    }
}

struct CanvasRenderer;

impl Renderer for CanvasRenderer {
    fn render_circle(&self, x: f64, y: f64, r: f64) {
        // Canvas-specific calls — completely different from SVG
        println!("ctx.arc({x:.0}, {y:.0}, {r:.0}, 0, {:.2})", 2.0 * std::f64::consts::PI);
    }
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64) {
        println!("ctx.strokeRect({x:.0}, {y:.0}, {w:.0}, {h:.0})");
    }
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// Circle holds a boxed Renderer (the bridge) — not a concrete type
struct Circle {
    x: f64, y: f64, radius: f64,
    renderer: Box<dyn Renderer>, // ← the bridge (trait object)
}

impl Circle {
    fn new(x: f64, y: f64, radius: f64, renderer: Box<dyn Renderer>) -> Self {
        Self { x, y, radius, renderer }
    }

    fn draw(&self) {
        println!("[Circle] at ({:.0},{:.0}) r={:.0}", self.x, self.y, self.radius);
        // Delegate to bridge — Circle never knows which renderer is active
        self.renderer.render_circle(self.x, self.y, self.radius);
    }
}

fn main() {
    // Same Circle geometry, two different renderers — zero extra classes
    let c1 = Circle::new(50.0, 50.0, 30.0, Box::new(SVGRenderer));
    c1.draw(); // → <circle .../>

    let c2 = Circle::new(50.0, 50.0, 30.0, Box::new(CanvasRenderer));
    c2.draw(); // → ctx.arc(...)
}`,
      },
      considerations: [
        "Constructor injection of the Implementor is preferred over setter injection for immutability",
        "Runtime switching of the Implementor is powerful but adds state complexity",
        "Bridge adds indirection — only introduce when you have or anticipate two varying dimensions",
        "Ensure the Implementor interface captures the right level of primitives (not too high, not too low)",
        "Bridge and Abstract Factory pair well: Abstract Factory creates the Implementor and injects it",
      ],
    },
    {
      id: 2,
      title: "Notification Type × Delivery Channel",
      domain: "SaaS / Communication",
      problem:
        "A SaaS platform sends multiple notification types (OrderConfirmed, PasswordReset, SecurityAlert) via multiple channels (Email, SMS, Push). Each notification type has distinct content formatting, but delivery mechanics belong to the channel. Without Bridge: 9 classes (3×3). With Bridge: 6 (3+3).",
      solution:
        "Notification (Abstraction) holds a NotificationChannel (Implementor). Each Notification subclass formats content and calls channel.send(). Channels handle delivery. Adding a new notification type doesn't require touching channel code, and adding Slack as a new channel doesn't require touching notification code.",
      classDiagramSvg: `<svg viewBox="0 0 460 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#br-e2);}</style>
  <defs><marker id="br-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="160" height="65" class="s-box s-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="s-title s-diagram-title">Notification</text>
  <line x1="10" y1="33" x2="170" y2="33" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-channel: Channel</text>
  <text x="18" y="62" class="s-member s-diagram-member">+send(user): void</text>
  <rect x="280" y="10" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="365" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;i&gt;&gt; Channel</text>
  <line x1="280" y1="33" x2="450" y2="33" class="s-diagram-line"/>
  <text x="288" y="48" class="s-member s-diagram-member">+deliver(to,subj,body)</text>
  <rect x="10" y="110" width="80" height="28" class="s-box s-diagram-box"/>
  <text x="50" y="124" text-anchor="middle" class="s-title s-diagram-title">OrderConfirm</text>
  <rect x="100" y="110" width="80" height="28" class="s-box s-diagram-box"/>
  <text x="140" y="124" text-anchor="middle" class="s-title s-diagram-title">SecurityAlert</text>
  <rect x="255" y="100" width="80" height="28" class="s-box s-diagram-box"/>
  <text x="295" y="114" text-anchor="middle" class="s-title s-diagram-title">EmailChannel</text>
  <rect x="355" y="100" width="80" height="28" class="s-box s-diagram-box"/>
  <text x="395" y="114" text-anchor="middle" class="s-title s-diagram-title">SMSChannel</text>
  <line x1="170" y1="38" x2="280" y2="38" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

# ── Implementor: NotificationChannel ─────────────────────────────────────────
# Channel defines how to physically deliver a message.
# It knows NOTHING about what notification type triggered it.
class NotificationChannel(ABC):
    @abstractmethod
    def deliver(self, recipient: str, subject: str, body: str) -> None: ...


class EmailChannel(NotificationChannel):
    def deliver(self, recipient: str, subject: str, body: str) -> None:
        # EmailChannel handles SMTP, templates, bounce-handling — all here
        print(f"[EMAIL → {recipient}] Subject: {subject}")
        print(f"  Body: {body[:80]}")


class SMSChannel(NotificationChannel):
    def deliver(self, recipient: str, subject: str, body: str) -> None:
        # SMS has its own length limits and provider integration
        sms_text = f"{subject}: {body}"[:160]  # SMS length limit
        print(f"[SMS → {recipient}] {sms_text}")


class PushChannel(NotificationChannel):
    def deliver(self, recipient: str, subject: str, body: str) -> None:
        # Push has its own device token management
        print(f"[PUSH → device:{recipient}] {subject} | {body[:50]}")


# ── Abstraction: Notification ─────────────────────────────────────────────────
# Notification holds the bridge to a channel.
# Each subclass formats content; channel handles delivery.
class Notification(ABC):
    def __init__(self, channel: NotificationChannel):
        # The bridge: Notification knows Channel only through the interface
        self._channel = channel

    @abstractmethod
    def send(self, recipient: str, data: dict) -> None: ...


# ── Refined Abstractions ──────────────────────────────────────────────────────
class OrderConfirmedNotification(Notification):
    def send(self, recipient: str, data: dict) -> None:
        # This class owns the business message format for order confirmation
        subject = f"Order #{data['order_id']} Confirmed"
        body = (f"Hi {data['name']}, your order of {data['items']} items "
                f"totalling \${data['total']:.2f} is confirmed.")
        # Bridge call: delegate delivery to whichever channel was injected
        self._channel.deliver(recipient, subject, body)


class SecurityAlertNotification(Notification):
    def send(self, recipient: str, data: dict) -> None:
        # Short, urgent message — format is different from order confirmation
        subject = "⚠ Security Alert"
        body = f"New login detected from {data['ip']} at {data['time']}. Not you? Reset password."
        self._channel.deliver(recipient, subject, body)


# ── Client: wires notification + channel ─────────────────────────────────────
# Pattern in action: each combination is just a constructor call, not a new class
email = EmailChannel()
sms = SMSChannel()
push = PushChannel()

# OrderConfirmed via email
OrderConfirmedNotification(email).send(
    "alice@example.com",
    {"order_id": "ORD-42", "name": "Alice", "items": 3, "total": 149.99}
)

# Same notification type, different channel — no new class needed
OrderConfirmedNotification(sms).send(
    "+15551234567",
    {"order_id": "ORD-42", "name": "Alice", "items": 3, "total": 149.99}
)

# Security alert via push — again, just a different constructor arg
SecurityAlertNotification(push).send(
    "device-token-xyz",
    {"ip": "192.168.1.5", "time": "14:32 UTC"}
)`,

        Go: `package main

import "fmt"

// ── Implementor Interface ─────────────────────────────────────────────────────
// Channel handles delivery mechanics — SMTP, Twilio, FCM, etc.
type NotificationChannel interface {
	Deliver(recipient, subject, body string)
}

// EmailChannel: all email-specific code (SMTP, templates) is here
type EmailChannel struct{}

func (e *EmailChannel) Deliver(to, subj, body string) {
	fmt.Printf("[EMAIL → %s] %s\\n  %s\\n", to, subj, body[:min(len(body), 80)])
}

// SMSChannel: SMS has 160-char limit — enforced here, not in Notification
type SMSChannel struct{}

func (s *SMSChannel) Deliver(to, subj, body string) {
	msg := subj + ": " + body
	if len(msg) > 160 { msg = msg[:160] }
	fmt.Printf("[SMS → %s] %s\\n", to, msg)
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Notification holds the channel bridge.
type Notification struct {
	channel NotificationChannel // ← the bridge
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
type OrderConfirmed struct {
	Notification
	OrderID string
	Total   float64
}

func (o *OrderConfirmed) Send(recipient string) {
	subj := fmt.Sprintf("Order %s Confirmed", o.OrderID)
	body := fmt.Sprintf("Your order totalling $%.2f is confirmed.", o.Total)
	// Delegate to bridge — OrderConfirmed doesn't know SMS vs email
	o.channel.Deliver(recipient, subj, body)
}

type SecurityAlert struct {
	Notification
	IP, Time string
}

func (s *SecurityAlert) Send(recipient string) {
	subj := "Security Alert"
	body := fmt.Sprintf("New login from %s at %s. Not you? Reset.", s.IP, s.Time)
	s.channel.Deliver(recipient, subj, body)
}

func min(a, b int) int { if a < b { return a }; return b }

func main() {
	email := &EmailChannel{}
	sms := &SMSChannel{}

	// Same notification type, different channel — just inject a different bridge
	order := &OrderConfirmed{Notification{email}, "ORD-42", 149.99}
	order.Send("alice@example.com")

	orderSMS := &OrderConfirmed{Notification{sms}, "ORD-42", 149.99}
	orderSMS.Send("+15551234567")

	alert := &SecurityAlert{Notification{email}, "192.168.1.5", "14:32 UTC"}
	alert.Send("bob@example.com")
}`,

        Java: `// ── Implementor Interface ─────────────────────────────────────────────────────
// Channel: how to deliver. Knows nothing about notification content.
interface NotificationChannel {
    void deliver(String recipient, String subject, String body);
}

// EmailChannel owns all email delivery concerns (SMTP, templates, bounces)
class EmailChannel implements NotificationChannel {
    @Override
    public void deliver(String to, String subj, String body) {
        System.out.printf("[EMAIL → %s] %s%n  %s%n", to, subj,
                body.substring(0, Math.min(body.length(), 80)));
    }
}

// SMSChannel enforces its own 160-char limit — shape code never sees this
class SMSChannel implements NotificationChannel {
    @Override
    public void deliver(String to, String subj, String body) {
        String msg = subj + ": " + body;
        System.out.printf("[SMS → %s] %s%n", to, msg.substring(0, Math.min(msg.length(), 160)));
    }
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Notification holds the bridge (channel reference) and defines the send contract.
abstract class Notification {
    protected final NotificationChannel channel; // ← the bridge

    Notification(NotificationChannel channel) { this.channel = channel; }

    abstract void send(String recipient);
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// OrderConfirmed formats order business messages; delegates delivery to bridge
class OrderConfirmed extends Notification {
    private final String orderId;
    private final double total;

    OrderConfirmed(String orderId, double total, NotificationChannel channel) {
        super(channel);
        this.orderId = orderId;
        this.total = total;
    }

    @Override
    void send(String recipient) {
        String subj = String.format("Order %s Confirmed", orderId);
        String body = String.format("Your order totalling $%.2f is confirmed.", total);
        channel.deliver(recipient, subj, body); // ← bridge call
    }
}

class SecurityAlert extends Notification {
    private final String ip, time;

    SecurityAlert(String ip, String time, NotificationChannel channel) {
        super(channel); this.ip = ip; this.time = time;
    }

    @Override
    void send(String recipient) {
        channel.deliver(recipient, "Security Alert",
                String.format("New login from %s at %s. Not you? Reset.", ip, time));
    }
}

class BridgeNotificationDemo {
    public static void main(String[] args) {
        var email = new EmailChannel();
        var sms = new SMSChannel();

        // Pattern: OrderConfirmed + EmailChannel  →  no OrderConfirmedEmail class
        new OrderConfirmed("ORD-42", 149.99, email).send("alice@example.com");
        new OrderConfirmed("ORD-42", 149.99, sms).send("+15551234567");
        new SecurityAlert("192.168.1.5", "14:32 UTC", email).send("bob@example.com");
    }
}`,

        TypeScript: `// ── Implementor Interface ────────────────────────────────────────────────────
// NotificationChannel handles delivery mechanics only.
// It has no idea what type of notification triggered it.
interface NotificationChannel {
  deliver(recipient: string, subject: string, body: string): void;
}

// EmailChannel: SMTP, template rendering, bounce handling all live here
class EmailChannel implements NotificationChannel {
  deliver(to: string, subject: string, body: string) {
    console.log(\`[EMAIL → \${to}] \${subject}\\n  \${body.slice(0, 80)}\`);
  }
}

// SMSChannel: enforces 160-char SMS limit — isolated from notification logic
class SMSChannel implements NotificationChannel {
  deliver(to: string, subject: string, body: string) {
    const msg = \`\${subject}: \${body}\`.slice(0, 160);
    console.log(\`[SMS → \${to}] \${msg}\`);
  }
}

// PushChannel: handles device token lookup, FCM calls
class PushChannel implements NotificationChannel {
  deliver(to: string, subject: string, body: string) {
    console.log(\`[PUSH → \${to}] \${subject} | \${body.slice(0, 50)}\`);
  }
}

// ── Abstraction ───────────────────────────────────────────────────────────────
// Notification base: owns the bridge reference, defines the send contract.
abstract class Notification {
  constructor(protected channel: NotificationChannel) {} // ← bridge injected

  abstract send(recipient: string, data: Record<string, unknown>): void;
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
// OrderConfirmed: formats the order confirmation message, bridges to channel
class OrderConfirmed extends Notification {
  send(recipient: string, data: { orderId: string; total: number; name: string }) {
    const subject = \`Order #\${data.orderId} Confirmed\`;
    const body = \`Hi \${data.name}, your order totalling $\${data.total.toFixed(2)} is confirmed.\`;
    // Bridge: delegate to channel — OrderConfirmed doesn't know SMS from email
    this.channel.deliver(recipient, subject, body);
  }
}

// SecurityAlert: short, urgent messages — different format from OrderConfirmed
class SecurityAlert extends Notification {
  send(recipient: string, data: { ip: string; time: string }) {
    this.channel.deliver(
      recipient,
      "⚠ Security Alert",
      \`New login from \${data.ip} at \${data.time}. Not you? Reset password.\`
    );
  }
}

// ── Client ─────────────────────────────────────────────────────────────────
// Pattern achieved: 3 notification types + 3 channels = 6 classes, not 9
const email = new EmailChannel();
const sms = new SMSChannel();
const push = new PushChannel();

new OrderConfirmed(email).send("alice@example.com", { orderId: "42", total: 149.99, name: "Alice" });
new OrderConfirmed(sms).send("+15551234567", { orderId: "42", total: 149.99, name: "Alice" });
new SecurityAlert(push).send("device-token-xyz", { ip: "192.168.1.5", time: "14:32 UTC" });`,

        Rust: `// ── Implementor Trait ────────────────────────────────────────────────────────
trait NotificationChannel {
    fn deliver(&self, recipient: &str, subject: &str, body: &str);
}

// EmailChannel: all email-specific delivery code isolated here
struct EmailChannel;
impl NotificationChannel for EmailChannel {
    fn deliver(&self, to: &str, subj: &str, body: &str) {
        println!("[EMAIL → {}] {}\\n  {}", to, subj, &body[..body.len().min(80)]);
    }
}

// SMSChannel: 160-char limit enforced here, not in notification logic
struct SMSChannel;
impl NotificationChannel for SMSChannel {
    fn deliver(&self, to: &str, subj: &str, body: &str) {
        let msg = format!("{}: {}", subj, body);
        println!("[SMS → {}] {}", to, &msg[..msg.len().min(160)]);
    }
}

// ── Refined Abstractions ──────────────────────────────────────────────────────
struct OrderConfirmed<'a> {
    order_id: &'a str,
    total: f64,
    channel: &'a dyn NotificationChannel, // ← bridge: trait object
}

impl<'a> OrderConfirmed<'a> {
    fn send(&self, recipient: &str) {
        let subj = format!("Order {} Confirmed", self.order_id);
        let body = format!("Your order totalling \${:.2} is confirmed.", self.total);
        // Bridge call — delegate to whichever channel is injected
        self.channel.deliver(recipient, &subj, &body);
    }
}

fn main() {
    let email = EmailChannel;
    let sms = SMSChannel;

    // Same notification, two channels — bridge switches without new classes
    OrderConfirmed { order_id: "ORD-42", total: 149.99, channel: &email }
        .send("alice@example.com");

    OrderConfirmed { order_id: "ORD-42", total: 149.99, channel: &sms }
        .send("+15551234567");
}`,
      },
      considerations: [
        "When adding a new channel (e.g., Slack), zero notification code changes",
        "When adding a new notification type, zero channel code changes",
        "Consider a NotificationChannelRouter that wraps multiple channels for multi-channel delivery",
        "Retry and error handling belong in each channel implementation",
        "Priority routing (SMS for critical, email for informational) can be built into a RouterChannel",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Object Bridge (composition) is the standard approach in all modern OOP. Use Class Bridge (multiple inheritance) only in C++ where it is idiomatic.",

  variants: [
    {
      id: 1,
      name: "Object Bridge (Composition)",
      description:
        "The standard Bridge: Abstraction holds a reference to the Implementor interface. The Implementor is injected via constructor or setter. This is the most flexible form.",
      code: {
        Python: `class Abstraction:
    def __init__(self, impl: Implementor):
        # Composition — holds a reference, not inheritance
        self._impl = impl

    def operation(self):
        # Abstraction delegates to implementation
        result = self._impl.operation_impl()
        return f"Abstraction: {result}"

class RefinedAbstraction(Abstraction):
    def operation(self):
        # Extended behavior that still uses the bridge
        result = self._impl.operation_impl()
        return f"RefinedAbstraction + {result}"`,
        Go: `type Abstraction struct {
    impl Implementor // composition — bridge
}

func (a *Abstraction) Operation() string {
    return "Abstraction: " + a.impl.OperationImpl()
}

type RefinedAbstraction struct {
    Abstraction
}

func (r *RefinedAbstraction) Operation() string {
    return "Refined: " + r.impl.OperationImpl()
}`,
        Java: `abstract class Abstraction {
    protected Implementor impl; // bridge reference

    Abstraction(Implementor impl) { this.impl = impl; }

    abstract String operation();
}

class RefinedAbstraction extends Abstraction {
    RefinedAbstraction(Implementor impl) { super(impl); }

    @Override
    public String operation() {
        return "Refined: " + impl.operationImpl();
    }
}`,
        TypeScript: `abstract class Abstraction {
  constructor(protected impl: Implementor) {} // bridge

  abstract operation(): string;
}

class RefinedAbstraction extends Abstraction {
  operation(): string {
    return "Refined: " + this.impl.operationImpl();
  }
}`,
        Rust: `trait Implementor { fn operation_impl(&self) -> String; }

struct Abstraction { impl_: Box<dyn Implementor> } // bridge

impl Abstraction {
    fn operation(&self) -> String {
        format!("Abstraction: {}", self.impl_.operation_impl())
    }
}`,
      },
      pros: [
        "Clean separation of concerns — Abstraction and Implementor change independently",
        "Implementor can be swapped at runtime",
        "Follows Dependency Inversion Principle",
      ],
      cons: [
        "Slightly more boilerplate than simple inheritance",
        "One extra level of indirection in call chain",
      ],
    },
    {
      id: 2,
      name: "Bridge with Abstract Factory",
      description:
        "An Abstract Factory creates the correct Implementor based on environment (platform, config) and injects it into the Abstraction. The client never manually selects an implementor.",
      code: {
        Python: `import platform

class RendererFactory:
    @staticmethod
    def create() -> Renderer:
        # Factory decides which renderer to inject — client is unaware
        if platform.system() == "Windows":
            return DirectXRenderer()
        elif platform.system() == "Darwin":
            return MetalRenderer()
        else:
            return OpenGLRenderer()

class Shape:
    def __init__(self):
        # Client never sees the renderer selection logic
        self._renderer = RendererFactory.create()

    def draw(self):
        self._renderer.render(self)`,
        Go: `func NewRenderer(platform string) Renderer {
    // Factory selects concrete Implementor
    switch platform {
    case "windows": return &DirectXRenderer{}
    case "darwin":  return &MetalRenderer{}
    default:        return &OpenGLRenderer{}
    }
}

func NewShape(platform string) *Shape {
    // Abstraction receives bridge from factory
    return &Shape{renderer: NewRenderer(platform)}
}`,
        Java: `class RendererFactory {
    static Renderer create(String platform) {
        return switch (platform) {
            case "windows" -> new DirectXRenderer();
            case "darwin" -> new MetalRenderer();
            default -> new OpenGLRenderer();
        };
    }
}

class ShapeFactory {
    static Shape createCircle(double r, String platform) {
        return new Circle(r, RendererFactory.create(platform));
    }
}`,
        TypeScript: `class RendererFactory {
  static create(platform: string): Renderer {
    if (platform === "windows") return new DirectXRenderer();
    if (platform === "darwin") return new MetalRenderer();
    return new OpenGLRenderer();
  }
}

class Circle {
  constructor(private r: number, private renderer = RendererFactory.create(process.platform)) {}
  draw() { this.renderer.renderCircle(0, 0, this.r); }
}`,
        Rust: `fn create_renderer(platform: &str) -> Box<dyn Renderer> {
    match platform {
        "windows" => Box::new(DirectXRenderer),
        "macos"   => Box::new(MetalRenderer),
        _          => Box::new(OpenGLRenderer),
    }
}

struct Circle { radius: f64, renderer: Box<dyn Renderer> }
impl Circle {
    fn new(r: f64) -> Self {
        Self { radius: r, renderer: create_renderer(std::env::consts::OS) }
    }
}`,
      },
      pros: [
        "Client code is completely isolated from both Abstraction and Implementor selection",
        "Easy to swap entire platform implementations by changing factory logic",
        "Follows Open/Closed Principle for new platforms",
      ],
      cons: [
        "Extra Factory abstraction layer adds complexity",
        "Factory must be updated when new implementors are added",
      ],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Structural" },
    { aspect: "Intent", detail: "Decouple abstraction from implementation so both can vary independently" },
    { aspect: "Also Known As", detail: "Handle/Body" },
    { aspect: "Problem Solved", detail: "Combinatorial class explosion from two orthogonal variation dimensions (M×N → M+N)" },
    { aspect: "Key Mechanism", detail: "Abstraction holds a reference (bridge) to an Implementor interface — composition replaces inheritance for one dimension" },
    { aspect: "Runtime Flexibility", detail: "Implementor can be swapped at runtime without recreating the Abstraction" },
    { aspect: "vs. Adapter", detail: "Adapter makes incompatible interfaces work together (post-hoc fix); Bridge is designed upfront to separate concerns" },
    { aspect: "vs. Strategy", detail: "Strategy swaps algorithms in one class; Bridge connects two whole class hierarchies" },
    { aspect: "Common Pairings", detail: "Abstract Factory (creates Implementors), Dependency Injection (injects Implementors)" },
    { aspect: "When to Use", detail: "When you have two orthogonal variation axes, when you want implementors to be hidden from clients, or when you need runtime implementation switching" },
  ],

  antiPatterns: [
    {
      name: "Premature Bridge",
      description:
        "Applying Bridge when there is only one variation dimension. If you only have shapes and no rendering concern, Bridge adds complexity for no benefit.",
      betterAlternative:
        "Use simple inheritance or Strategy for one-dimensional variation. Introduce Bridge later when a second orthogonal dimension genuinely appears.",
    },
    {
      name: "Fat Implementor Interface",
      description:
        "The Implementor interface exposes too many high-level methods, causing it to overlap with the Abstraction's responsibility. This defeats the layered structure.",
      betterAlternative:
        "Keep the Implementor interface at the primitive operations level (renderLine, write, send). The Abstraction composes these into higher-level operations.",
    },
    {
      name: "Leaking Implementors to Clients",
      description:
        "Client code holds references to concrete Implementors and passes them to Abstractions, creating tight coupling between clients and implementation classes.",
      betterAlternative:
        "Use a Factory or Dependency Injection container to resolve and inject Implementors. Clients should only interact with the Abstraction.",
    },
  ],
};

export default bridgeData;
