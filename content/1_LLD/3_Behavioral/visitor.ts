import { PatternData } from "@/lib/patterns/types";

const visitorData: PatternData = {
  slug: "visitor",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Visitor Pattern",
  subtitle:
    "Separate an algorithm from the object structure it operates on by letting a visitor object carry the operation across elements.",

  intent:
    "Object-oriented hierarchies — ASTs, DOM trees, composite file systems, type hierarchies — are stable and rarely change. But the operations you want to perform over them grow constantly: add a printer, then an optimiser, then a serialiser, then a type-checker. If you add each operation as a method to every node class, you pollute those classes with unrelated responsibilities and must recompile them all every time a new operation is needed.\n\nThe Visitor pattern extracts operations into separate Visitor objects. Each element in the hierarchy declares a single accept(visitor) method. The visitor implements a visit(ConcreteElementA), visit(ConcreteElementB) overload for each node type. When accept() is called, it calls back visitor.visit(this) — a technique called double dispatch — so the correct overload executes based on both the visitor type and the element type, entirely through polymorphism.\n\nNew operations = new Visitor class. Zero changes to the element hierarchy. The trade-off: adding a new element type requires adding a method to every Visitor class.",

  classDiagramSvg: `<svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:620px">
  <style>
    .s-box{rx:6;} .s-title{font:bold 11px 'JetBrains Mono',monospace;}
    .s-member{font:10px 'JetBrains Mono',monospace;}
    .s-arr{stroke-width:1.2;fill:none;marker-end:url(#vis-arr);}
    .s-dash{stroke-dasharray:5,3;}
  </style>
  <defs>
    <marker id="vis-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Visitor interface -->
  <rect x="10" y="10" width="230" height="80" class="s-box s-diagram-box"/>
  <text x="125" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Visitor</text>
  <line x1="10" y1="33" x2="240" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+visit(e: ConcreteElementA)</text>
  <text x="20" y="64" class="s-member s-diagram-member">+visit(e: ConcreteElementB)</text>
  <text x="20" y="78" class="s-member s-diagram-member">+visit(e: ConcreteElementC)</text>
  <!-- ConcreteVisitor -->
  <rect x="10" y="150" width="230" height="70" class="s-box s-diagram-box"/>
  <text x="125" y="168" text-anchor="middle" class="s-title s-diagram-title">ConcreteVisitor</text>
  <line x1="10" y1="173" x2="240" y2="173" class="s-diagram-line"/>
  <text x="20" y="190" class="s-member s-diagram-member">+visit(e: ConcreteElementA)</text>
  <text x="20" y="204" class="s-member s-diagram-member">+visit(e: ConcreteElementB)</text>
  <!-- Element interface -->
  <rect x="380" y="10" width="230" height="60" class="s-box s-diagram-box"/>
  <text x="495" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Element</text>
  <line x1="380" y1="33" x2="610" y2="33" class="s-diagram-line"/>
  <text x="390" y="50" class="s-member s-diagram-member">+accept(v: Visitor): void</text>
  <!-- ConcreteElementA -->
  <rect x="380" y="120" width="110" height="55" class="s-box s-diagram-box"/>
  <text x="435" y="138" text-anchor="middle" class="s-title s-diagram-title">Elem A</text>
  <line x1="380" y1="143" x2="490" y2="143" class="s-diagram-line"/>
  <text x="388" y="160" class="s-member s-diagram-member">+accept(v)</text>
  <text x="388" y="170" class="s-member s-diagram-member">// v.visit(this)</text>
  <!-- ConcreteElementB -->
  <rect x="500" y="120" width="110" height="55" class="s-box s-diagram-box"/>
  <text x="555" y="138" text-anchor="middle" class="s-title s-diagram-title">Elem B</text>
  <line x1="500" y1="143" x2="610" y2="143" class="s-diagram-line"/>
  <text x="508" y="160" class="s-member s-diagram-member">+accept(v)</text>
  <text x="508" y="170" class="s-member s-diagram-member">// v.visit(this)</text>
  <!-- Arrows -->
  <line x1="125" y1="150" x2="125" y2="90" class="s-arr s-diagram-arrow"/>
  <line x1="435" y1="120" x2="435" y2="70" class="s-arr s-diagram-arrow"/>
  <line x1="555" y1="120" x2="555" y2="70" class="s-arr s-diagram-arrow"/>
  <!-- double-dispatch arrow -->
  <line x1="240" y1="175" x2="380" y2="150" class="s-arr s-diagram-arrow s-dash"/>
  <text x="285" y="155" class="s-member s-diagram-member">calls visit(this)</text>
</svg>`,

  diagramExplanation:
    "The Visitor interface declares one overloaded visit() method per concrete element type. ConcreteVisitor implements the full suite of visit() methods — each encoding a specific operation for a specific element type. The Element interface declares a single accept(visitor) method. Each ConcreteElement's accept() body is always just visitor.visit(this) — this one-liner is the double dispatch trick: the runtime type of this selects the concrete accept() implementation, which then uses visitor's overload resolution to call the right visit() method. Client code calls element.accept(concreteVisitor) and the correct combination fires automatically.",

  diagramComponents: [
    {
      name: "Visitor (interface)",
      description:
        "Declares a visit(ElementType) overload for every concrete element type in the hierarchy. In languages without overloading (Python, Go), these are named methods: visitElementA(), visitElementB().",
    },
    {
      name: "ConcreteVisitor",
      description:
        "Implements all visit() overloads, encoding one complete algorithm across all element types. You create a new ConcreteVisitor for each new operation (printer, optimiser, serialiser) without touching element classes.",
    },
    {
      name: "Element (interface)",
      description:
        "Declares accept(visitor). This is the only method element classes need to add. It is always implemented identically: call visitor.visit(this).",
    },
    {
      name: "ConcreteElement",
      description:
        "Implements accept(v) { v.visit(this); }. The this reference typed to the concrete class triggers the right visit() overload — the second dispatch. May also expose read-only accessor methods for visitors to read state.",
    },
    {
      name: "Double Dispatch",
      description:
        "Two virtual calls: (1) element.accept(visitor) selects the concrete element type; (2) visitor.visit(this) inside accept() selects the concrete visitor type. The combination routes to exactly one visit() implementation.",
    },
  ],

  solutionDetail:
    "**Double Dispatch Mechanics**: Single dispatch (the default in OOP) chooses a method based on one receiver type. Visitor achieves double dispatch via two sequential single dispatches. Call 1: `element.accept(visitor)` — dispatch on element type. Call 2: inside accept(), `visitor.visit(this)` — dispatch on visitor type. The cross-product of (visitor type × element type) maps to a specific algorithm fragment.\n\n**When Visitor shines**: The element hierarchy is closed (rarely gains new types) but operations grow freely. Examples: compiler AST passes (parse → type-check → optimise → emit), document object models (render → serialise → validate → index), game entity processing (render → physics → AI → serialise).\n\n**Composite + Visitor**: Often combined. The composite tree calls accept() recursively. The visitor accumulates results as it traverses. This cleanly separates traversal logic (in composite) from operation logic (in visitor).\n\n**Visitor vs Strategy**: Strategy replaces the algorithm for a single object. Visitor applies different algorithms across an entire heterogeneous object hierarchy.\n\n**Visitor vs Command**: Command encapsulates one request. Visitor encapsulates one operation applied to many different types.\n\n**Functional equivalent**: In functional languages, Visitor is just pattern matching (match element with | ElemA a -> ... | ElemB b -> ...). Visitor is the OOP equivalent of a function that pattern-matches on a sum type.",

  characteristics: [
    "Open/Closed for operations: add new operations without modifying element classes",
    "Accumulates state across the whole traversal (running totals, collections, etc.)",
    "Separates unrelated operations into distinct Visitor classes — each class has one reason to change",
    "Double dispatch selects the correct algorithm fragment based on both visitor and element type",
    "Hard to add new element types — requires updating every existing visitor",
    "Visitors can access private state only if elements expose accessor methods",
    "Naturally composable with Composite for tree traversals",
  ],

  useCases: [
    {
      id: 1,
      title: "AST Compiler Passes",
      domain: "Compiler / Interpreter",
      description:
        "A compiler has an Abstract Syntax Tree with dozens of node types. Multiple independent passes must traverse the tree: type-checking, constant folding, dead code elimination, code generation.",
      whySingleton:
        "Each compiler pass is a ConcreteVisitor. The AST node hierarchy never changes. Adding a new pass = one new Visitor class. Zero AST node changes.",
      code: `class TypeCheckVisitor:
    def visit_binary_expr(self, node: BinaryExpr):
        left_t = node.left.accept(self)
        right_t = node.right.accept(self)
        return self._check_compatible(node.op, left_t, right_t)`,
    },
    {
      id: 2,
      title: "Shopping Cart Pricing Engine",
      domain: "E-Commerce",
      description:
        "A cart contains Products, Bundles, and SubscriptionItems. Tax rules, discount logic, and shipping cost calculations are all different for each item type.",
      whySingleton:
        "TaxVisitor, DiscountVisitor, and ShippingVisitor each implement visit() for all 3 item types. Adding a new promotion rule = new visitor, not changes to item classes.",
      code: `class TaxVisitor:
    def visit_product(self, p: Product) -> float:
        return p.price * TAX_RATE[p.category]
    def visit_bundle(self, b: Bundle) -> float:
        return sum(item.accept(self) for item in b.items)
    def visit_subscription(self, s: Subscription) -> float:
        return 0.0  # subscriptions are tax-exempt`,
    },
    {
      id: 3,
      title: "Document Export (PDF / HTML / Markdown)",
      domain: "Content Management",
      description:
        "A document model has Paragraph, Heading, Table, Image, and CodeBlock nodes. Each can be exported to PDF, HTML, or Markdown — very different rendering logic per type.",
      whySingleton:
        "HtmlVisitor, PdfVisitor, and MarkdownVisitor each implement all node visit() methods. Switching export format = swap the visitor. No document model changes.",
      code: `class HtmlVisitor:
    def visit_heading(self, h: Heading) -> str:
        return f'<h{h.level}>{h.text}</h{h.level}>'
    def visit_code_block(self, c: CodeBlock) -> str:
        return f'<pre><code class="{c.lang}">{escape(c.code)}</code></pre>'`,
    },
    {
      id: 4,
      title: "GUI Component Inspector",
      domain: "UI Framework",
      description:
        "A UI tree has Button, TextInput, Panel, and Canvas nodes. Different tools visit the tree: an accessibility auditor, a theme-applicator, a layout-calculator, and a serialiser for drag-and-drop.",
      whySingleton:
        "Each tool is a Visitor. The component class hierarchy is stable (rarely gains new types). New tooling = new Visitor class, no component class changes.",
      code: `class AccessibilityVisitor:
    def visit_button(self, btn: Button):
        if not btn.aria_label:
            self.issues.append(f"Button missing aria-label: {btn.id}")
    def visit_text_input(self, inp: TextInput):
        if not inp.label:
            self.issues.append(f"Input missing label: {inp.id}")`,
    },
    {
      id: 5,
      title: "SQL Query Plan Optimiser",
      domain: "Database Internals",
      description:
        "A query planner builds a logical plan tree (Scan, Join, Filter, Aggregate, Project). Multiple optimisation passes rewrite the tree: push down predicates, eliminate redundant projections, choose join algorithms.",
      whySingleton:
        "Each optimisation rule is a Visitor. The logical plan nodes are stable. Adding a new rewrite rule = new Visitor, no plan node changes.",
      code: `class PredicatePushdownVisitor:
    def visit_filter(self, node: Filter) -> PlanNode:
        # Try to push filter below join/scan
        if isinstance(node.child, Join):
            return self._push_through_join(node, node.child)
        return node`,
    },
    {
      id: 6,
      title: "File System Analyser",
      domain: "OS / Developer Tools",
      description:
        "A composite file system tree has File, Directory, and Symlink nodes. Different operations visit the tree: disk usage calculator, virus scanner, permission auditor, duplicate finder.",
      whySingleton:
        "Each analysis is a Visitor. The file system node types are fixed. Adding a new analysis tool = new Visitor class.",
      code: `class DiskUsageVisitor:
    def __init__(self): self.total_bytes = 0
    def visit_file(self, f: File):
        self.total_bytes += f.size_bytes
    def visit_directory(self, d: Directory):
        for child in d.children: child.accept(self)
    def visit_symlink(self, s: Symlink): pass`,
    },
    {
      id: 7,
      title: "Game Entity Processing Pipeline",
      domain: "Game Development",
      description:
        "A game world has Player, Enemy, Projectile, and Trigger entities. Each frame, multiple systems visit all entities: physics update, render, collision detection, AI tick, network sync.",
      whySingleton:
        "Each game system is a Visitor. Entity types are stable. Adding a new system (e.g. an audio cue system) = new Visitor class, no entity class changes.",
      code: `class PhysicsVisitor:
    def visit_player(self, p: Player):
        p.position += p.velocity * dt
    def visit_projectile(self, proj: Projectile):
        proj.position += proj.velocity * dt
        if proj.position.y < 0: proj.destroy()
    def visit_trigger(self, t: Trigger): pass`,
    },
    {
      id: 8,
      title: "Expression Tree Differentiation",
      domain: "Mathematics / CAS",
      description:
        "A symbolic maths library has expression nodes: Constant, Variable, Add, Multiply, Power. Operations: evaluate, differentiate, simplify, LaTeX-render — each applies different rules per node type.",
      whySingleton:
        "Each operation is a Visitor. The expression node types are stable. A DifferentiateVisitor implements the derivative rule for each node type (d/dx constant = 0, d/dx x = 1, product rule for Multiply, etc.).",
      code: `class DifferentiateVisitor:
    def __init__(self, var: str): self.var = var
    def visit_constant(self, c: Constant): return Constant(0)
    def visit_variable(self, v: Variable):
        return Constant(1) if v.name == self.var else Constant(0)
    def visit_multiply(self, m: Multiply):
        # product rule: (f*g)' = f'*g + f*g'
        f_prime = m.left.accept(self)
        g_prime = m.right.accept(self)
        return Add(Multiply(f_prime, m.right), Multiply(m.left, g_prime))`,
    },
    {
      id: 9,
      title: "Configuration Validation & Migration",
      domain: "DevOps / Platform Engineering",
      description:
        "A config object model has StringField, NumberField, ListField, and SectionField nodes. A ValidatorVisitor checks all constraints. A MigrationVisitor transforms old config schemas to new ones.",
      whySingleton:
        "Both validator and migrator are Visitors. The config field type hierarchy is stable. New validation rulesets = new Visitor, no field class changes.",
      code: `class ValidatorVisitor:
    def __init__(self): self.errors = []
    def visit_number_field(self, f: NumberField):
        if f.value < f.min or f.value > f.max:
            self.errors.append(f"{f.name}: {f.value} out of range [{f.min},{f.max}]")
    def visit_string_field(self, f: StringField):
        if f.required and not f.value:
            self.errors.append(f"{f.name}: required field is empty")`,
    },
    {
      id: 10,
      title: "Insurance Policy Premium Calculator",
      domain: "Insurance / Fintech",
      description:
        "A policy can include AutoCoverage, HomeCoverage, LifeCoverage, and RiderItems. Premium calculation, claims-eligibility checks, and regulatory-reporting extraction are three separate operations over the same policy tree.",
      whySingleton:
        "PremiumVisitor, EligibilityVisitor, and ReportingVisitor each implement visit() for all 4 coverage types. Regulatory changes = update one Visitor class, not all coverage classes.",
      code: `class PremiumVisitor:
    def __init__(self, customer: Customer): self.customer = customer; self.total = 0
    def visit_auto(self, c: AutoCoverage):
        rating = AUTO_BASE * c.vehicle_age_factor * self.customer.risk_score
        self.total += rating
    def visit_life(self, c: LifeCoverage):
        self.total += LIFE_BASE * c.sum_assured / 100_000`,
    },
    {
      id: 11,
      title: "Network Packet Processing Pipeline",
      domain: "Networking / Security",
      description:
        "A captured network packet can be EthernetFrame, IPPacket, TCPSegment, or UDPDatagram. Operations: protocol decoder, anomaly detector, bandwidth meter, pcap exporter.",
      whySingleton:
        "Each processing stage is a Visitor. Packet type hierarchy is stable. Adding a new analysis (e.g. TLS fingerprinting) = new Visitor, no packet class changes.",
      code: `class AnomalyDetectorVisitor:
    def visit_tcp_segment(self, seg: TCPSegment):
        if seg.flags & SYN and not seg.flags & ACK:
            if self._syn_rate_exceeded(seg.src_ip):
                self.alerts.append(SYNFloodAlert(seg.src_ip))
    def visit_udp_datagram(self, dgram: UDPDatagram):
        if dgram.length > 65000:
            self.alerts.append(OversizedUDPAlert(dgram.src_ip))`,
    },
    {
      id: 12,
      title: "Serialisation / Deserialisation",
      domain: "Data Engineering",
      description:
        "A data model has IntField, StringField, ListField, MapField, and NullableField nodes. A JsonSerialiserVisitor, a ProtobufSerialiserVisitor, and an AvroSerialiserVisitor each encode the model to a different wire format.",
      whySingleton:
        "Each wire format is a Visitor. The field type hierarchy is stable. Adding a new format (CBOR, MessagePack) = new Visitor class, no field class changes.",
      code: `class JsonSerialiserVisitor:
    def visit_int_field(self, f: IntField) -> int: return f.value
    def visit_string_field(self, f: StringField) -> str: return f.value
    def visit_list_field(self, f: ListField) -> list:
        return [item.accept(self) for item in f.items]
    def visit_map_field(self, f: MapField) -> dict:
        return {k: v.accept(self) for k, v in f.pairs.items()}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Shopping Cart Tax & Discount Engine",
      domain: "E-Commerce",
      problem:
        "An e-commerce cart contains three item kinds: PhysicalProduct (taxed, shippable), DigitalProduct (taxed differently, not shippable), and GiftCard (tax-free). Tax calculation, discount application, and shipping cost are three separate operations. Adding each operation as methods to product classes mixes unrelated concerns and makes each promotion rule launch a full edit across all product types.",
      solution:
        "Each item kind implements CartItem with accept(visitor). TaxVisitor, DiscountVisitor, and ShippingVisitor each implement visit() for all three item types with the correct rule per type. The cart calls item.accept(visitor) for each item. The visitor accumulates the running total. Adding a new promotional rule (e.g. LoyaltyPointsVisitor) = one new class, zero changes to item classes.",
      classDiagramSvg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#v-e1);}</style>
  <defs><marker id="v-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <!-- CartItem -->
  <rect x="210" y="10" width="140" height="50" class="s-box s-diagram-box"/>
  <text x="280" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="280" y="40" text-anchor="middle" class="s-title s-diagram-title">CartItem</text>
  <line x1="210" y1="44" x2="350" y2="44" class="s-diagram-line"/>
  <text x="218" y="58" class="s-member s-diagram-member">+accept(v: Visitor)</text>
  <!-- Physical -->
  <rect x="10" y="110" width="160" height="45" class="s-box s-diagram-box"/>
  <text x="90" y="128" text-anchor="middle" class="s-title s-diagram-title">PhysicalProduct</text>
  <line x1="10" y1="133" x2="170" y2="133" class="s-diagram-line"/>
  <text x="18" y="148" class="s-member s-diagram-member">+accept(v) { v.visitPhysical(this) }</text>
  <!-- Digital -->
  <rect x="200" y="110" width="160" height="45" class="s-box s-diagram-box"/>
  <text x="280" y="128" text-anchor="middle" class="s-title s-diagram-title">DigitalProduct</text>
  <line x1="200" y1="133" x2="360" y2="133" class="s-diagram-line"/>
  <text x="208" y="148" class="s-member s-diagram-member">+accept(v) { v.visitDigital(this) }</text>
  <!-- GiftCard -->
  <rect x="390" y="110" width="160" height="45" class="s-box s-diagram-box"/>
  <text x="470" y="128" text-anchor="middle" class="s-title s-diagram-title">GiftCard</text>
  <line x1="390" y1="133" x2="550" y2="133" class="s-diagram-line"/>
  <text x="398" y="148" class="s-member s-diagram-member">+accept(v) { v.visitGiftCard(this) }</text>
  <!-- arrows -->
  <line x1="90" y1="110" x2="240" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="280" y1="110" x2="280" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="470" y1="110" x2="320" y2="60" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Protocol

# ── Visitor interface ─────────────────────────────────────────────────────────
# One visit method per concrete element type.
# Python uses named methods instead of overloads.
class CartVisitor(ABC):
    @abstractmethod
    def visit_physical(self, item: PhysicalProduct) -> float: ...
    @abstractmethod
    def visit_digital(self, item: DigitalProduct) -> float: ...
    @abstractmethod
    def visit_gift_card(self, item: GiftCard) -> float: ...


# ── Element interface ─────────────────────────────────────────────────────────
class CartItem(ABC):
    @abstractmethod
    def accept(self, visitor: CartVisitor) -> float: ...


# ── Concrete Elements ─────────────────────────────────────────────────────────
@dataclass
class PhysicalProduct(CartItem):
    name: str
    price: float
    category: str               # e.g. "electronics", "clothing"
    weight_kg: float            # used by ShippingVisitor

    def accept(self, visitor: CartVisitor) -> float:
        # Double dispatch: exact type of 'visitor' triggers correct overload
        return visitor.visit_physical(self)


@dataclass
class DigitalProduct(CartItem):
    name: str
    price: float
    is_software: bool           # software taxed differently in some regions

    def accept(self, visitor: CartVisitor) -> float:
        return visitor.visit_digital(self)


@dataclass
class GiftCard(CartItem):
    code: str
    face_value: float

    def accept(self, visitor: CartVisitor) -> float:
        return visitor.visit_gift_card(self)


# ── ConcreteVisitor 1: Tax Calculator ────────────────────────────────────────
# Encodes all tax rules in one place. Physical goods, digital goods, and gift
# cards all have different tax treatment under most jurisdictions.
class TaxVisitor(CartVisitor):
    PHYSICAL_TAX = {"electronics": 0.10, "clothing": 0.05, "default": 0.08}
    DIGITAL_SOFTWARE_TAX = 0.0    # software licences exempt
    DIGITAL_MEDIA_TAX = 0.05

    def visit_physical(self, item: PhysicalProduct) -> float:
        rate = self.PHYSICAL_TAX.get(item.category, self.PHYSICAL_TAX["default"])
        return item.price * rate

    def visit_digital(self, item: DigitalProduct) -> float:
        # Software-as-a-service is typically exempt; media content is not
        rate = self.DIGITAL_SOFTWARE_TAX if item.is_software else self.DIGITAL_MEDIA_TAX
        return item.price * rate

    def visit_gift_card(self, item: GiftCard) -> float:
        return 0.0  # gift cards are never taxed on purchase


# ── ConcreteVisitor 2: Shipping Cost Calculator ───────────────────────────────
# Physical goods incur shipping weight charges. Digital goods and gift cards
# are delivered electronically — zero shipping cost.
class ShippingVisitor(CartVisitor):
    RATE_PER_KG = 3.50   # dollars per kilogram

    def visit_physical(self, item: PhysicalProduct) -> float:
        return item.weight_kg * self.RATE_PER_KG

    def visit_digital(self, item: DigitalProduct) -> float:
        return 0.0   # instant download — no shipping

    def visit_gift_card(self, item: GiftCard) -> float:
        return 0.0   # emailed — no shipping


# ── ConcreteVisitor 3: Holiday Discount Calculator ───────────────────────────
# Adding a new promotion = new Visitor class. Zero changes to product classes.
class HolidayDiscountVisitor(CartVisitor):
    PHYSICAL_DISCOUNT = 0.15   # 15% off physical goods
    DIGITAL_DISCOUNT  = 0.10   # 10% off digital goods
    GIFT_DISCOUNT     = 0.0    # gift cards never discounted

    def visit_physical(self, item: PhysicalProduct) -> float:
        return item.price * self.PHYSICAL_DISCOUNT

    def visit_digital(self, item: DigitalProduct) -> float:
        return item.price * self.DIGITAL_DISCOUNT

    def visit_gift_card(self, item: GiftCard) -> float:
        return 0.0


# ── ShoppingCart: applies visitors across all items ──────────────────────────
class ShoppingCart:
    def __init__(self):
        self._items: list[CartItem] = []

    def add(self, item: CartItem) -> None:
        self._items.append(item)

    def calculate(self, visitor: CartVisitor) -> float:
        """Apply visitor to every item, return accumulated result."""
        return sum(item.accept(visitor) for item in self._items)

    @property
    def subtotal(self) -> float:
        return sum(
            getattr(i, "price", getattr(i, "face_value", 0))
            for i in self._items
        )


# ── Client code ───────────────────────────────────────────────────────────────
cart = ShoppingCart()
cart.add(PhysicalProduct("Laptop",       1_200.0, "electronics", 2.1))
cart.add(PhysicalProduct("T-Shirt",         29.0, "clothing",    0.3))
cart.add(DigitalProduct("VS Code Pro",      99.0, is_software=True))
cart.add(DigitalProduct("Album Download",   14.0, is_software=False))
cart.add(GiftCard("XMAS2024",              50.0))

subtotal = cart.subtotal
tax      = cart.calculate(TaxVisitor())
shipping = cart.calculate(ShippingVisitor())
discount = cart.calculate(HolidayDiscountVisitor())

print(f"Subtotal:  \${subtotal:.2f}")
print(f"Tax:       \${tax:.2f}")
print(f"Shipping:  \${shipping:.2f}")
print(f"Discount: -\${discount:.2f}")
print(f"Total:     \${subtotal + tax + shipping - discount:.2f}")

# Adding LoyaltyPointsVisitor tomorrow = 1 new class, 0 existing changes
`,
        TypeScript: `// ── Visitor interface ─────────────────────────────────────────────────────────
interface CartVisitor {
  visitPhysical(item: PhysicalProduct): number;
  visitDigital(item: DigitalProduct): number;
  visitGiftCard(item: GiftCard): number;
}

// ── Element interface ─────────────────────────────────────────────────────────
interface CartItem {
  accept(visitor: CartVisitor): number;
}

// ── Concrete Elements ─────────────────────────────────────────────────────────
class PhysicalProduct implements CartItem {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public readonly weightKg: number,
  ) {}

  accept(visitor: CartVisitor): number {
    return visitor.visitPhysical(this);  // double dispatch
  }
}

class DigitalProduct implements CartItem {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly isSoftware: boolean,
  ) {}

  accept(visitor: CartVisitor): number {
    return visitor.visitDigital(this);
  }
}

class GiftCard implements CartItem {
  constructor(
    public readonly code: string,
    public readonly faceValue: number,
  ) {}

  accept(visitor: CartVisitor): number {
    return visitor.visitGiftCard(this);
  }
}

// ── ConcreteVisitors ───────────────────────────────────────────────────────────
class TaxVisitor implements CartVisitor {
  private readonly PHYSICAL_TAX: Record<string, number> = {
    electronics: 0.10, clothing: 0.05, default: 0.08,
  };

  visitPhysical(item: PhysicalProduct): number {
    const rate = this.PHYSICAL_TAX[item.category] ?? this.PHYSICAL_TAX.default;
    return item.price * rate;
  }

  visitDigital(item: DigitalProduct): number {
    return item.isSoftware ? 0 : item.price * 0.05;
  }

  visitGiftCard(_item: GiftCard): number {
    return 0;  // gift cards are not taxed
  }
}

class ShippingVisitor implements CartVisitor {
  private readonly RATE_PER_KG = 3.50;

  visitPhysical(item: PhysicalProduct): number {
    return item.weightKg * this.RATE_PER_KG;
  }

  visitDigital(_item: DigitalProduct): number { return 0; }

  visitGiftCard(_item: GiftCard): number { return 0; }
}

class HolidayDiscountVisitor implements CartVisitor {
  visitPhysical(item: PhysicalProduct): number { return item.price * 0.15; }
  visitDigital(item: DigitalProduct): number   { return item.price * 0.10; }
  visitGiftCard(_item: GiftCard): number       { return 0; }
}

// ── ShoppingCart ───────────────────────────────────────────────────────────────
class ShoppingCart {
  private items: CartItem[] = [];

  add(item: CartItem): this { this.items.push(item); return this; }

  calculate(visitor: CartVisitor): number {
    return this.items.reduce((sum, item) => sum + item.accept(visitor), 0);
  }
}

// ── Usage ──────────────────────────────────────────────────────────────────────
const cart = new ShoppingCart();
cart
  .add(new PhysicalProduct("Laptop",         1200, "electronics", 2.1))
  .add(new PhysicalProduct("T-Shirt",          29, "clothing",    0.3))
  .add(new DigitalProduct("VS Code Pro",       99, true))
  .add(new DigitalProduct("Album Download",    14, false))
  .add(new GiftCard("XMAS2024",                50));

const tax      = cart.calculate(new TaxVisitor());
const shipping = cart.calculate(new ShippingVisitor());
const discount = cart.calculate(new HolidayDiscountVisitor());

console.log("Tax:      $" + tax.toFixed(2));
console.log("Shipping: $" + shipping.toFixed(2));
console.log("Discount: $" + discount.toFixed(2));
`,
        Go: `package main

import "fmt"

// ── Visitor interface ─────────────────────────────────────────────────────────
type CartVisitor interface {
	VisitPhysical(item *PhysicalProduct) float64
	VisitDigital(item *DigitalProduct) float64
	VisitGiftCard(item *GiftCard) float64
}

// ── Element interface ─────────────────────────────────────────────────────────
type CartItem interface {
	Accept(visitor CartVisitor) float64
}

// ── Concrete Elements ─────────────────────────────────────────────────────────
type PhysicalProduct struct {
	Name     string
	Price    float64
	Category string
	WeightKg float64
}

func (p *PhysicalProduct) Accept(v CartVisitor) float64 {
	return v.VisitPhysical(p) // double dispatch
}

type DigitalProduct struct {
	Name       string
	Price      float64
	IsSoftware bool
}

func (d *DigitalProduct) Accept(v CartVisitor) float64 {
	return v.VisitDigital(d)
}

type GiftCard struct {
	Code      string
	FaceValue float64
}

func (g *GiftCard) Accept(v CartVisitor) float64 {
	return v.VisitGiftCard(g)
}

// ── TaxVisitor ────────────────────────────────────────────────────────────────
type TaxVisitor struct{}

var physicalTax = map[string]float64{
	"electronics": 0.10, "clothing": 0.05,
}

func (t *TaxVisitor) VisitPhysical(p *PhysicalProduct) float64 {
	rate, ok := physicalTax[p.Category]
	if !ok { rate = 0.08 }
	return p.Price * rate
}
func (t *TaxVisitor) VisitDigital(d *DigitalProduct) float64 {
	if d.IsSoftware { return 0 }
	return d.Price * 0.05
}
func (t *TaxVisitor) VisitGiftCard(*GiftCard) float64 { return 0 }

// ── ShippingVisitor ────────────────────────────────────────────────────────────
type ShippingVisitor struct{}

func (s *ShippingVisitor) VisitPhysical(p *PhysicalProduct) float64 {
	return p.WeightKg * 3.50
}
func (s *ShippingVisitor) VisitDigital(*DigitalProduct) float64 { return 0 }
func (s *ShippingVisitor) VisitGiftCard(*GiftCard) float64      { return 0 }

// ── ShoppingCart ──────────────────────────────────────────────────────────────
type ShoppingCart struct{ items []CartItem }

func (c *ShoppingCart) Add(item CartItem)                    { c.items = append(c.items, item) }
func (c *ShoppingCart) Calculate(v CartVisitor) float64 {
	var total float64
	for _, item := range c.items { total += item.Accept(v) }
	return total
}

func main() {
	cart := &ShoppingCart{}
	cart.Add(&PhysicalProduct{"Laptop", 1200, "electronics", 2.1})
	cart.Add(&PhysicalProduct{"T-Shirt", 29, "clothing", 0.3})
	cart.Add(&DigitalProduct{"VS Code Pro", 99, true})
	cart.Add(&DigitalProduct{"Album", 14, false})
	cart.Add(&GiftCard{"XMAS2024", 50})

	fmt.Printf("Tax:      %.2f\\n", cart.Calculate(&TaxVisitor{}))
	fmt.Printf("Shipping: %.2f\\n", cart.Calculate(&ShippingVisitor{}))
}
`,
        Java: `import java.util.*;

// ── Visitor interface ─────────────────────────────────────────────────────────
interface CartVisitor {
    double visitPhysical(PhysicalProduct item);
    double visitDigital(DigitalProduct item);
    double visitGiftCard(GiftCard item);
}

// ── Element interface ─────────────────────────────────────────────────────────
interface CartItem {
    double accept(CartVisitor visitor);
}

// ── Concrete Elements ─────────────────────────────────────────────────────────
class PhysicalProduct implements CartItem {
    final String name, category;
    final double price, weightKg;
    PhysicalProduct(String name, double price, String category, double weightKg) {
        this.name = name; this.price = price;
        this.category = category; this.weightKg = weightKg;
    }
    @Override public double accept(CartVisitor v) { return v.visitPhysical(this); }
}

class DigitalProduct implements CartItem {
    final String name; final double price; final boolean isSoftware;
    DigitalProduct(String n, double p, boolean s) { name=n; price=p; isSoftware=s; }
    @Override public double accept(CartVisitor v) { return v.visitDigital(this); }
}

class GiftCard implements CartItem {
    final String code; final double faceValue;
    GiftCard(String c, double f) { code=c; faceValue=f; }
    @Override public double accept(CartVisitor v) { return v.visitGiftCard(this); }
}

// ── TaxVisitor ────────────────────────────────────────────────────────────────
class TaxVisitor implements CartVisitor {
    private static final Map<String,Double> RATES = Map.of(
        "electronics", 0.10, "clothing", 0.05);
    @Override public double visitPhysical(PhysicalProduct p) {
        return p.price * RATES.getOrDefault(p.category, 0.08);
    }
    @Override public double visitDigital(DigitalProduct d) {
        return d.isSoftware ? 0 : d.price * 0.05;
    }
    @Override public double visitGiftCard(GiftCard g) { return 0; }
}

// ── ShoppingCart ──────────────────────────────────────────────────────────────
class ShoppingCart {
    private final List<CartItem> items = new ArrayList<>();
    void add(CartItem item) { items.add(item); }
    double calculate(CartVisitor v) {
        return items.stream().mapToDouble(i -> i.accept(v)).sum();
    }
}
`,
        Rust: `// ── Concrete elements (defined first; Rust needs forward-compatible types) ────
#[derive(Debug)]
struct PhysicalProduct { name: String, price: f64, category: String, weight_kg: f64 }
#[derive(Debug)]
struct DigitalProduct  { name: String, price: f64, is_software: bool }
#[derive(Debug)]
struct GiftCard        { code: String, face_value: f64 }

// ── Element enum (Rust uses enums + match instead of class hierarchy) ─────────
enum CartItem {
    Physical(PhysicalProduct),
    Digital(DigitalProduct),
    Gift(GiftCard),
}

// ── CartVisitor trait ─────────────────────────────────────────────────────────
trait CartVisitor {
    fn visit_physical(&self, item: &PhysicalProduct) -> f64;
    fn visit_digital (&self, item: &DigitalProduct)  -> f64;
    fn visit_gift    (&self, item: &GiftCard)         -> f64;
}

impl CartItem {
    fn accept(&self, visitor: &dyn CartVisitor) -> f64 {
        match self {
            CartItem::Physical(p) => visitor.visit_physical(p),
            CartItem::Digital(d)  => visitor.visit_digital(d),
            CartItem::Gift(g)     => visitor.visit_gift(g),
        }
    }
}

// ── TaxVisitor ────────────────────────────────────────────────────────────────
struct TaxVisitor;
impl CartVisitor for TaxVisitor {
    fn visit_physical(&self, p: &PhysicalProduct) -> f64 {
        let rate = match p.category.as_str() {
            "electronics" => 0.10, "clothing" => 0.05, _ => 0.08,
        };
        p.price * rate
    }
    fn visit_digital(&self, d: &DigitalProduct) -> f64 {
        if d.is_software { 0.0 } else { d.price * 0.05 }
    }
    fn visit_gift(&self, _: &GiftCard) -> f64 { 0.0 }
}

// ── ShoppingCart ──────────────────────────────────────────────────────────────
struct ShoppingCart { items: Vec<CartItem> }
impl ShoppingCart {
    fn new() -> Self { Self { items: Vec::new() } }
    fn add(&mut self, item: CartItem) { self.items.push(item); }
    fn calculate(&self, visitor: &dyn CartVisitor) -> f64 {
        self.items.iter().map(|i| i.accept(visitor)).sum()
    }
}

fn main() {
    let mut cart = ShoppingCart::new();
    cart.add(CartItem::Physical(PhysicalProduct { name: "Laptop".into(), price: 1200.0, category: "electronics".into(), weight_kg: 2.1 }));
    cart.add(CartItem::Digital(DigitalProduct   { name: "VS Code Pro".into(), price: 99.0, is_software: true }));
    cart.add(CartItem::Gift(GiftCard             { code: "XMAS2024".into(), face_value: 50.0 }));

    println!("Tax: {:.2}", cart.calculate(&TaxVisitor));
}
`,
      },
      considerations: [
        "Add a new item type (e.g. PhysicalBundle) → must add visit() method to every existing CartVisitor class",
        "Visitors should only access public state from elements — avoid making elements expose internals just for visitor access",
        "In dynamically typed languages (Python, JS), the visitor can use isinstance checks instead of method dispatch, but this re-introduces the fragility the pattern was designed to avoid",
        "Stateful visitors (running totals, error lists) should be recreated per cart traversal to avoid stale state across calls",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Classic Double Dispatch",
      description:
        "Each concrete element's accept() calls visitor.visit(this). The correct overload fires based on the concrete element type. Works in Java/C++/C# with method overloading. In Python/Go/JS, use named methods (visitElementA, visitElementB).",
      code: {
        Python: `class BinaryExpr:
    def accept(self, visitor):
        return visitor.visit_binary_expr(self)

class Literal:
    def accept(self, visitor):
        return visitor.visit_literal(self)`,
        TypeScript: `class BinaryExpr implements Expr {
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}`,
        Go: `func (b *BinaryExpr) Accept(v ExprVisitor) any {
  return v.VisitBinaryExpr(b)
}`,
        Java: `@Override
public <T> T accept(ExprVisitor<T> v) {
    return v.visitBinaryExpr(this);
}`,
        Rust: `// Use enum + match — idiomatic Rust equivalent of visitor
match expr {
    Expr::Binary(b) => visitor.visit_binary(b),
    Expr::Literal(l) => visitor.visit_literal(l),
}`,
      },
      pros: ["Compile-time type safety", "Easy to add new visitors", "Zero runtime type checks"],
      cons: [
        "Hard to add new element types — all visitors must be updated",
        "Verbose boilerplate accept() in every element class",
      ],
    },
    {
      id: 2,
      name: "Reflective Visitor (dispatch map)",
      description:
        "Instead of overloaded methods, a registry maps element type → handler function. New handlers registered at runtime. Useful when the element hierarchy is unknown at compile time.",
      code: {
        Python: `class ReflectiveVisitor:
    def __init__(self):
        self._handlers = {}
    def register(self, elem_type, handler):
        self._handlers[elem_type] = handler
    def visit(self, element):
        handler = self._handlers.get(type(element))
        if handler: return handler(element)
        raise NotImplementedError(type(element))`,
        TypeScript: `class ReflectiveVisitor {
  private handlers = new Map<Function, (e: any) => any>();
  register<T>(type: new (...a: any[]) => T, fn: (e: T) => any) {
    this.handlers.set(type, fn);
  }
  visit(element: object) {
    const fn = this.handlers.get(element.constructor);
    if (!fn) throw Error("No handler for " + element.constructor.name);
    return fn(element);
  }
}`,
        Go: `// Go: use a map[reflect.Type]func(any)any
import "reflect"
type ReflectiveVisitor struct {
    handlers map[reflect.Type]func(any) any
}`,
        Java: `// Java: Map<Class<?>, Function<Object, Object>> handlers`,
        Rust: `// Rust: use trait objects or TypeId-keyed HashMaps`,
      },
      pros: ["Element types can be registered at runtime", "No boilerplate accept() in elements", "Extensible without changing visitor interface"],
      cons: ["No compile-time type safety", "Runtime errors for missing handlers", "Less readable"],
    },
  ],
  variantsTabLabel: "Visitor Variants",
  variantsBestPick:
    "Use **Classic Double Dispatch** when the element hierarchy is stable and you want compile-time guarantees. Use **Reflective Visitor** for plugin architectures where element types arrive at runtime.",
  comparisonHeaders: ["Variant", "Type Safety", "New Elements", "New Visitors", "Boilerplate"],
  comparisonRows: [
    ["Classic Double Dispatch", "Compile-time", "Hard — update all visitors", "Easy — new class", "accept() in each element"],
    ["Reflective / Registry",   "Runtime",      "Easy — register handler",  "Easy — new class", "Minimal"],
  ],

  summary: [
    { aspect: "Intent",          detail: "Separate an algorithm from the object structure it operates on" },
    { aspect: "Pattern type",    detail: "Behavioral" },
    { aspect: "Key mechanism",   detail: "Double dispatch — accept(visitor) calls visitor.visit(this)" },
    { aspect: "Adding ops",      detail: "Easy — one new Visitor class, zero element class changes" },
    { aspect: "Adding elements", detail: "Hard — every existing Visitor must add a new visit() overload" },
    { aspect: "Language support",detail: "Java/C++/C# use overloads; Python/Go use named methods" },
    { aspect: "Combines with",   detail: "Composite (tree traversal), Iterator (linear traversal)" },
    { aspect: "Real-world use",  detail: "Compiler AST passes, document export, GUI inspectors, game systems" },
  ],

  antiPatterns: [
    {
      name: "Visitor for one element type",
      description:
        "Using Visitor when there is only one ConcreteElement. The double dispatch indirection brings complexity with no benefit — a simple method call or Strategy pattern is clearer.",
      betterAlternative:
        "Use a Strategy or plain polymorphic method when there is only one element type to dispatch on.",
    },
    {
      name: "Visitors that modify element state",
      description:
        "Visitors that write to elements' private fields via exposing setters break encapsulation and create hidden side-effects that are hard to reason about and test.",
      betterAlternative:
        "Visitors should be read-only — they compute a result from element state, not mutate it. Use a dedicated mutation method or factory for state changes.",
    },
    {
      name: "Using Visitor with a frequently-changing hierarchy",
      description:
        "If new element types are added often, every visitor must be updated in lockstep. The maintenance burden inverts the pattern's benefit.",
      betterAlternative:
        "Use polymorphic dispatch (virtual methods) when the hierarchy changes frequently and operations are stable. Visitor is ideal for the opposite situation.",
    },
  ],
};

export default visitorData;
