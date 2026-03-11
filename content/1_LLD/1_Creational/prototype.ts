import { PatternData } from "@/lib/patterns/types";

const prototypeData: PatternData = {
  slug: "prototype",
  categorySlug: "creational",
  categoryLabel: "Creational",
  title: "Prototype Pattern",
  subtitle:
    "Create new objects by cloning an existing instance (the prototype) rather than constructing from scratch, enabling cheap duplication of complex object graphs.",

  intent:
    "Provide a mechanism to copy existing objects without coupling code to their concrete classes. Cloning avoids the cost of full initialization — database queries, file parsing, network calls — when the resulting object differs only slightly from an existing one. The pattern is essential in systems that manage templates, configuration presets, or dynamic object registries where types are determined at runtime.",

  classDiagramSvg: `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-arr); }
  </style>
  <defs>
    <marker id="p-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Prototype interface -->
  <rect x="120" y="10" width="220" height="55" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Prototype</text>
  <line x1="120" y1="33" x2="340" y2="33" class="s-diagram-line"/>
  <text x="130" y="50" class="s-member s-diagram-member">+clone(): Prototype</text>
  <!-- ConcretePrototypeA -->
  <rect x="10" y="110" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="110" y="128" text-anchor="middle" class="s-title s-diagram-title">ConcretePrototypeA</text>
  <line x1="10" y1="133" x2="210" y2="133" class="s-diagram-line"/>
  <text x="20" y="150" class="s-member s-diagram-member">-field1: string</text>
  <text x="20" y="166" class="s-member s-diagram-member">+clone(): Prototype</text>
  <!-- ConcretePrototypeB -->
  <rect x="250" y="110" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="350" y="128" text-anchor="middle" class="s-title s-diagram-title">ConcretePrototypeB</text>
  <line x1="250" y1="133" x2="450" y2="133" class="s-diagram-line"/>
  <text x="260" y="150" class="s-member s-diagram-member">-field2: number</text>
  <text x="260" y="166" class="s-member s-diagram-member">+clone(): Prototype</text>
  <!-- Arrows -->
  <line x1="110" y1="110" x2="200" y2="65" class="s-arr s-diagram-arrow"/>
  <line x1="350" y1="110" x2="270" y2="65" class="s-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "The Prototype interface declares a clone() method that every concrete class must implement. ConcretePrototypeA and ConcretePrototypeB each maintain their own state and know how to produce a faithful copy of themselves. Client code calls clone() on any Prototype reference without knowing the concrete type — the polymorphic clone produces a new object with the same state, ready to be customized.",

  diagramComponents: [
    {
      name: "Prototype (interface)",
      description:
        "Declares the clone() method. Any object implementing this interface promises to produce a copy of itself. Client code depends only on this interface, not on concrete classes.",
    },
    {
      name: "ConcretePrototypeA",
      description:
        "A concrete class that stores its own state (field1) and implements clone() to produce a faithful copy. The clone may be shallow or deep depending on the field types.",
    },
    {
      name: "ConcretePrototypeB",
      description:
        "Another concrete implementation with different state (field2). Its clone() method independently handles its own copy semantics — proving that cloning is polymorphic.",
    },
  ],

  solutionDetail:
    "**The Problem:** Creating objects from scratch can be expensive — parsing configuration files, querying databases, computing initial state, or assembling complex object graphs. When you need many similar objects that differ only slightly, re-running the full initialization for each one is wasteful.\n\n**The Prototype Solution:** Start with a fully initialized 'prototype' object. When you need a new instance, clone the prototype and modify only the parts that differ. The clone() method encapsulates the copy logic, handling both shallow and deep copies as needed.\n\n**How It Works:**\n\n1. **Define the interface**: A Prototype interface with a clone() method.\n\n2. **Implement cloning**: Each concrete class implements clone() to duplicate its own state. Mutable nested objects must be deep-copied to avoid shared references.\n\n3. **Maintain a registry (optional)**: A prototype registry (Map<string, Prototype>) stores pre-configured prototypes by name. Clients request a clone by name instead of knowing the concrete class.\n\n4. **Customize the clone**: After cloning, the client modifies only the fields that differ from the prototype.\n\n**Why It Shines:** Prototype decouples clients from concrete classes, enables runtime object creation from dynamic types, and avoids expensive re-initialization. It's the pattern behind copy-on-write, template systems, and object pools.",

  characteristics: [
    "Avoids expensive initialization by copying pre-built objects",
    "Decouples client code from concrete product classes — clients only know the Prototype interface",
    "A prototype registry enables dynamic creation of objects by name/key without knowing the class",
    "Deep clone vs. shallow clone is a critical design decision — mutable nested objects need deep copies",
    "Works well with Composite and Decorator patterns to duplicate complex decorated object trees",
    "In languages with built-in clone support (Java Cloneable, Python copy), implementation is trivial",
    "Overkill when constructors are cheap and the object has no complex state to preserve",
  ],

  useCases: [
    {
      id: 1,
      title: "Document Template System",
      domain: "SaaS / Productivity",
      description:
        "A document editor provides templates (invoice, report, letter) that users clone and customize rather than building from scratch.",
      whySingleton:
        "Cloning preserves formatting, headers, footers, and styles. Users only change the content, not the structure.",
      code: `const invoice = templateRegistry.get("invoice").clone();
invoice.setCustomer("Acme Corp");
invoice.addLineItem("Widget", 10, 9.99);`,
    },
    {
      id: 2,
      title: "Game Entity Spawning",
      domain: "Gaming",
      description:
        "An RTS game spawns hundreds of identical units (soldiers, tanks). Cloning a prototype avoids re-loading sprite assets and computing pathfinding graphs for each unit.",
      whySingleton:
        "The prototype is loaded once from disk with all assets. Each spawn clones it and only changes position and health.",
      code: `const soldier = unitPrototypes["infantry"].clone();
soldier.position = { x: spawnX, y: spawnY };
soldier.health = soldier.maxHealth;`,
    },
    {
      id: 3,
      title: "Configuration Preset Manager",
      domain: "DevOps / Infrastructure",
      description:
        "Infrastructure configs have presets (dev, staging, prod). Each environment clones a preset and overrides a few values (endpoint URLs, log levels).",
      whySingleton:
        "Prototype avoids duplicating hundreds of config lines. Clone the preset, override 3-5 values.",
      code: `config = presets["production"].clone()
config.log_level = "DEBUG"
config.feature_flags["beta_ui"] = True`,
    },
    {
      id: 4,
      title: "Spreadsheet Cell Copying",
      domain: "Data / Analytics",
      description:
        "A spreadsheet app copies cells with their formatting, formulas, validation rules, and conditional formatting. The user then edits only the formula.",
      whySingleton:
        "Deep clone preserves all cell metadata. Without Prototype, copy-paste would lose formatting or share mutable state.",
      code: `const newCell = sourceCell.clone();
newCell.formula = "=B2*1.1"; // formatting preserved`,
    },
    {
      id: 5,
      title: "A/B Test Variant Creation",
      domain: "Marketing / Growth",
      description:
        "A/B testing creates experiment variants by cloning a control configuration and changing one variable (button color, headline text, CTA).",
      whySingleton:
        "Cloning guarantees variants are identical to control except for the single changed variable — essential for valid experiments.",
      code: `const variant = control.clone();
variant.headline = "Get Started Free";
variant.ctaColor = "#FF6600";`,
    },
    {
      id: 6,
      title: "Financial Instrument Cloning",
      domain: "Fintech",
      description:
        "A trading system templates financial instruments (bonds, options) with complex pricing models. New instruments clone a template and adjust maturity, strike, or coupon.",
      whySingleton:
        "Pricing models are expensive to initialize (Monte Carlo calibration). Cloning reuses the calibrated model.",
      code: `const newBond = bondTemplate.clone();
newBond.maturityDate = "2030-06-15";
newBond.couponRate = 0.045;`,
    },
    {
      id: 7,
      title: "UI Component Presets",
      domain: "Frontend / Design System",
      description:
        "A design system provides pre-styled component presets (primary button, danger button, ghost button). Each page clones a preset and binds its own event handler.",
      whySingleton:
        "Prototype ensures style consistency across the app. Cloning is faster than re-resolving theme tokens.",
      code: `const btn = presets.primaryButton.clone();
btn.label = "Submit Order";
btn.onClick = handleSubmit;`,
    },
    {
      id: 8,
      title: "Database Connection Pool",
      domain: "Backend Infrastructure",
      description:
        "A connection pool pre-configures connections with SSL certs, timeouts, and retry policies. New connections clone the template instead of re-negotiating SSL handshakes.",
      whySingleton:
        "SSL handshake is expensive. Cloning reuses the negotiated session parameters for subsequent connections.",
      code: `conn = connectionTemplate.clone()
conn.database = "analytics_db"
conn.readOnly = True`,
    },
    {
      id: 9,
      title: "3D Model Instancing",
      domain: "Graphics / VFX",
      description:
        "A 3D scene instances the same model (tree, rock) hundreds of times at different positions and scales. Cloning shares the mesh data while varying transforms.",
      whySingleton:
        "Prototype enables lightweight cloning that shares the heavy mesh/texture data and only copies the transform matrix.",
      code: `const tree = treePrototype.clone();
tree.transform = { x: 10, y: 0, z: 25, scale: 1.2 };`,
    },
    {
      id: 10,
      title: "Workflow Template Engine",
      domain: "Enterprise / BPM",
      description:
        "A BPM system templates approval workflows (expense report, PTO request, purchase order). New requests clone the workflow template and bind to the specific requester.",
      whySingleton:
        "Workflow templates have complex step graphs with conditions and escalation paths. Cloning is faster than re-building from the DSL.",
      code: `workflow = templates["expense_approval"].clone()
workflow.requester = current_user
workflow.amount = 5200.00`,
    },
    {
      id: 11,
      title: "Email Campaign Templates",
      domain: "Marketing",
      description:
        "A marketing platform clones email templates (welcome, promo, newsletter) and personalizes them for each recipient — name, recommendations, unsubscribe link.",
      whySingleton:
        "Templates have complex HTML layouts with embedded CSS. Cloning preserves the layout while injecting personalized content.",
      code: `const email = templates["promo_summer"].clone();
email.recipientName = "Jane";
email.recommendations = getRecsFor("Jane");`,
    },
    {
      id: 12,
      title: "Kubernetes Pod Template",
      domain: "Cloud Native",
      description:
        "Kubernetes PodTemplateSpec is literally the Prototype pattern — a template is defined once and cloned for every replica in a Deployment or StatefulSet.",
      whySingleton:
        "Each pod is a clone of the template, differing only in pod name and IP. The prototype avoids repeating the full spec for each replica.",
      code: `// K8s does this internally:
const pod = podTemplateSpec.clone();
pod.metadata.name = \`web-\${replicaIndex}\`;`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Trade Order Prototype Registry",
      domain: "Fintech",
      problem:
        "A trading desk frequently places similar orders: recurring limit orders, bracket orders, and stop-loss orders. Each order type has complex default configurations (routing instructions, regulatory tags, time-in-force). Re-configuring from scratch for each trade wastes time and risks errors.",
      solution:
        "A prototype registry stores pre-configured order templates by name. Traders clone a template, override the symbol and quantity, and submit. The complex defaults (regulatory tags, routing) are preserved without re-specification.",
      classDiagramSvg: `<svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-e1); }
  </style>
  <defs><marker id="p-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="200" height="60" class="s-box s-diagram-box"/>
  <text x="110" y="28" text-anchor="middle" class="s-title s-diagram-title">OrderPrototypeRegistry</text>
  <line x1="10" y1="33" x2="210" y2="33" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">+register(name, proto)</text>
  <text x="20" y="62" class="s-member s-diagram-member">+get(name): TradeOrder</text>
  <rect x="250" y="10" width="200" height="72" class="s-box s-diagram-box"/>
  <text x="350" y="28" text-anchor="middle" class="s-title s-diagram-title">TradeOrder</text>
  <line x1="250" y1="33" x2="450" y2="33" class="s-diagram-line"/>
  <text x="260" y="48" class="s-member s-diagram-member">-symbol, qty, routing</text>
  <text x="260" y="62" class="s-member s-diagram-member">-regulatoryTags[]</text>
  <text x="260" y="76" class="s-member s-diagram-member">+clone(): TradeOrder</text>
  <line x1="210" y1="40" x2="250" y2="40" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import copy
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class TradeOrder:
    symbol: str = ""
    side: str = "BUY"
    quantity: int = 0
    order_type: str = "LIMIT"
    limit_price: float = 0.0
    time_in_force: str = "DAY"
    routing: str = "SMART"
    regulatory_tags: List[str] = field(default_factory=list)

    def clone(self) -> "TradeOrder":
        return copy.deepcopy(self)

class OrderRegistry:
    def __init__(self):
        self._protos: Dict[str, TradeOrder] = {}

    def register(self, name: str, proto: TradeOrder):
        self._protos[name] = proto

    def get(self, name: str) -> TradeOrder:
        return self._protos[name].clone()

# ── Setup ──
registry = OrderRegistry()
registry.register("recurring_limit", TradeOrder(
    order_type="LIMIT", time_in_force="GTC",
    routing="SMART", regulatory_tags=["MiFID-II", "LEI-5493"]
))

# ── Usage ──
order = registry.get("recurring_limit")
order.symbol = "AAPL"
order.quantity = 100
order.limit_price = 150.00
print(order)`,
        Go: `package main

import "fmt"

type TradeOrder struct {
	Symbol, Side, OrderType, TimeInForce, Routing string
	Quantity                                       int
	LimitPrice                                     float64
	RegulatoryTags                                 []string
}

func (o *TradeOrder) Clone() *TradeOrder {
	clone := *o
	clone.RegulatoryTags = make([]string, len(o.RegulatoryTags))
	copy(clone.RegulatoryTags, o.RegulatoryTags)
	return &clone
}

type OrderRegistry struct {
	protos map[string]*TradeOrder
}

func NewOrderRegistry() *OrderRegistry {
	return &OrderRegistry{protos: map[string]*TradeOrder{}}
}
func (r *OrderRegistry) Register(name string, p *TradeOrder) { r.protos[name] = p }
func (r *OrderRegistry) Get(name string) *TradeOrder          { return r.protos[name].Clone() }

func main() {
	registry := NewOrderRegistry()
	registry.Register("recurring_limit", &TradeOrder{
		OrderType: "LIMIT", TimeInForce: "GTC", Routing: "SMART",
		RegulatoryTags: []string{"MiFID-II", "LEI-5493"},
	})

	order := registry.Get("recurring_limit")
	order.Symbol = "AAPL"
	order.Quantity = 100
	order.LimitPrice = 150.00
	fmt.Printf("%+v\\n", order)
}`,
        Java: `import java.util.*;

public class TradeOrder implements Cloneable {
    String symbol, side = "BUY", orderType = "LIMIT";
    String timeInForce = "DAY", routing = "SMART";
    int quantity;
    double limitPrice;
    List<String> regulatoryTags = new ArrayList<>();

    @Override
    public TradeOrder clone() {
        try {
            TradeOrder copy = (TradeOrder) super.clone();
            copy.regulatoryTags = new ArrayList<>(this.regulatoryTags);
            return copy;
        } catch (CloneNotSupportedException e) { throw new RuntimeException(e); }
    }
}

class OrderRegistry {
    private final Map<String, TradeOrder> protos = new HashMap<>();
    void register(String name, TradeOrder p) { protos.put(name, p); }
    TradeOrder get(String name) { return protos.get(name).clone(); }
}

// Usage:
// registry.register("recurring_limit", proto);
// var order = registry.get("recurring_limit");
// order.symbol = "AAPL"; order.quantity = 100;`,
        TypeScript: `interface Cloneable<T> {
  clone(): T;
}

class TradeOrder implements Cloneable<TradeOrder> {
  symbol = "";
  side = "BUY";
  quantity = 0;
  orderType = "LIMIT";
  limitPrice = 0;
  timeInForce = "DAY";
  routing = "SMART";
  regulatoryTags: string[] = [];

  clone(): TradeOrder {
    const copy = new TradeOrder();
    Object.assign(copy, this);
    copy.regulatoryTags = [...this.regulatoryTags]; // deep copy array
    return copy;
  }
}

class OrderRegistry {
  private protos = new Map<string, TradeOrder>();
  register(name: string, proto: TradeOrder): void { this.protos.set(name, proto); }
  get(name: string): TradeOrder { return this.protos.get(name)!.clone(); }
}

// ── Usage ──
const registry = new OrderRegistry();
const proto = new TradeOrder();
proto.orderType = "LIMIT"; proto.timeInForce = "GTC";
proto.routing = "SMART"; proto.regulatoryTags = ["MiFID-II"];
registry.register("recurring_limit", proto);

const order = registry.get("recurring_limit");
order.symbol = "AAPL"; order.quantity = 100;
console.log(order);`,
        Rust: `use std::collections::HashMap;

#[derive(Clone, Debug)]
struct TradeOrder {
    symbol: String, side: String, quantity: u32,
    order_type: String, limit_price: f64,
    time_in_force: String, routing: String,
    regulatory_tags: Vec<String>,
}

impl TradeOrder {
    fn new_template(order_type: &str, tif: &str, tags: Vec<&str>) -> Self {
        Self {
            symbol: String::new(), side: "BUY".into(), quantity: 0,
            order_type: order_type.into(), limit_price: 0.0,
            time_in_force: tif.into(), routing: "SMART".into(),
            regulatory_tags: tags.iter().map(|s| s.to_string()).collect(),
        }
    }
}

struct OrderRegistry { protos: HashMap<String, TradeOrder> }

impl OrderRegistry {
    fn new() -> Self { Self { protos: HashMap::new() } }
    fn register(&mut self, name: &str, p: TradeOrder) { self.protos.insert(name.into(), p); }
    fn get(&self, name: &str) -> TradeOrder { self.protos[name].clone() }
}

fn main() {
    let mut registry = OrderRegistry::new();
    registry.register("recurring_limit",
        TradeOrder::new_template("LIMIT", "GTC", vec!["MiFID-II", "LEI-5493"]));

    let mut order = registry.get("recurring_limit");
    order.symbol = "AAPL".into();
    order.quantity = 100;
    order.limit_price = 150.0;
    println!("{:?}", order);
}`,
      },
      considerations: [
        "Deep clone regulatory_tags to prevent shared references between cloned orders",
        "Registry initialization should happen once at startup from a config file or database",
        "Consider immutability for the template prototypes — only clones should be mutable",
        "Thread safety: cloning should not modify the original prototype",
        "Audit trail: log which template was cloned for compliance purposes",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Medical Form Template System",
      domain: "Healthcare",
      problem:
        "A hospital intake system uses dozens of form templates: admission forms, consent forms, discharge summaries. Each form has sections, fields, validation rules, and pre-filled instructions. Building forms from scratch for each patient wastes time and risks inconsistency.",
      solution:
        "A FormTemplateRegistry stores prototype forms. When a patient is admitted, the system clones the relevant templates, fills in patient demographics, and presents them for completion.",
      classDiagramSvg: `<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-e2); }
  </style>
  <defs><marker id="p-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="190" height="50" class="s-box s-diagram-box"/>
  <text x="105" y="28" text-anchor="middle" class="s-title s-diagram-title">FormRegistry</text>
  <line x1="10" y1="33" x2="200" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+get(name): MedicalForm</text>
  <rect x="250" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="350" y="28" text-anchor="middle" class="s-title s-diagram-title">MedicalForm</text>
  <line x1="250" y1="33" x2="450" y2="33" class="s-diagram-line"/>
  <text x="260" y="48" class="s-member s-diagram-member">-sections: Section[]</text>
  <text x="260" y="62" class="s-member s-diagram-member">-validationRules[]</text>
  <text x="260" y="76" class="s-member s-diagram-member">+clone(): MedicalForm</text>
  <line x1="200" y1="35" x2="250" y2="35" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import copy
from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass
class FormField:
    name: str
    label: str
    field_type: str = "text"
    required: bool = False
    value: Optional[str] = None

@dataclass
class FormSection:
    title: str
    fields: List[FormField] = field(default_factory=list)

@dataclass
class MedicalForm:
    name: str
    sections: List[FormSection] = field(default_factory=list)

    def clone(self) -> "MedicalForm":
        return copy.deepcopy(self)

class FormRegistry:
    _templates: Dict[str, MedicalForm] = {}

    @classmethod
    def register(cls, form: MedicalForm):
        cls._templates[form.name] = form

    @classmethod
    def get(cls, name: str) -> MedicalForm:
        return cls._templates[name].clone()

# ── Setup ──
admission = MedicalForm("admission", [
    FormSection("Demographics", [
        FormField("name", "Full Name", required=True),
        FormField("dob", "Date of Birth", "date", True),
    ]),
    FormSection("Insurance", [
        FormField("provider", "Insurance Provider"),
        FormField("policy", "Policy Number"),
    ]),
])
FormRegistry.register(admission)

# ── Usage ──
form = FormRegistry.get("admission")
form.sections[0].fields[0].value = "Jane Smith"
form.sections[0].fields[1].value = "1990-05-15"
print(form)`,
        Go: `package main

import "fmt"

type FormField struct {
	Name, Label, FieldType string
	Required               bool
	Value                  string
}

type FormSection struct {
	Title  string
	Fields []FormField
}

type MedicalForm struct {
	Name     string
	Sections []FormSection
}

func (f *MedicalForm) Clone() *MedicalForm {
	clone := &MedicalForm{Name: f.Name}
	for _, s := range f.Sections {
		cs := FormSection{Title: s.Title}
		cs.Fields = make([]FormField, len(s.Fields))
		copy(cs.Fields, s.Fields)
		clone.Sections = append(clone.Sections, cs)
	}
	return clone
}

var templates = map[string]*MedicalForm{}

func Register(f *MedicalForm) { templates[f.Name] = f }
func Get(name string) *MedicalForm { return templates[name].Clone() }

func main() {
	Register(&MedicalForm{Name: "admission", Sections: []FormSection{
		{Title: "Demographics", Fields: []FormField{
			{Name: "name", Label: "Full Name", Required: true},
		}},
	}})

	form := Get("admission")
	form.Sections[0].Fields[0].Value = "Jane Smith"
	fmt.Printf("%+v\\n", form)
}`,
        Java: `import java.util.*;
import java.util.stream.Collectors;

class MedicalForm implements Cloneable {
    String name;
    List<FormSection> sections;

    MedicalForm(String name, List<FormSection> sections) {
        this.name = name; this.sections = sections;
    }

    @Override
    public MedicalForm clone() {
        return new MedicalForm(name,
            sections.stream().map(FormSection::clone).collect(Collectors.toList()));
    }
}

class FormSection implements Cloneable {
    String title;
    List<FormField> fields;
    FormSection(String title, List<FormField> fields) { this.title = title; this.fields = fields; }

    @Override
    public FormSection clone() {
        return new FormSection(title,
            fields.stream().map(FormField::clone).collect(Collectors.toList()));
    }
}

class FormField implements Cloneable {
    String name, label, value;
    boolean required;
    FormField(String name, String label, boolean req) {
        this.name = name; this.label = label; this.required = req;
    }
    @Override public FormField clone() {
        try { return (FormField) super.clone(); } catch (Exception e) { throw new RuntimeException(e); }
    }
}`,
        TypeScript: `interface FormField { name: string; label: string; type: string; required: boolean; value?: string; }
interface FormSection { title: string; fields: FormField[]; }

class MedicalForm {
  constructor(public name: string, public sections: FormSection[]) {}

  clone(): MedicalForm {
    const clonedSections = this.sections.map(s => ({
      title: s.title,
      fields: s.fields.map(f => ({ ...f })),
    }));
    return new MedicalForm(this.name, clonedSections);
  }
}

class FormRegistry {
  private static templates = new Map<string, MedicalForm>();
  static register(form: MedicalForm): void { this.templates.set(form.name, form); }
  static get(name: string): MedicalForm { return this.templates.get(name)!.clone(); }
}

// Setup
FormRegistry.register(new MedicalForm("admission", [
  { title: "Demographics", fields: [
    { name: "name", label: "Full Name", type: "text", required: true },
  ]},
]));

// Usage
const form = FormRegistry.get("admission");
form.sections[0].fields[0].value = "Jane Smith";`,
        Rust: `#[derive(Clone, Debug)]
struct FormField { name: String, label: String, required: bool, value: Option<String> }

#[derive(Clone, Debug)]
struct FormSection { title: String, fields: Vec<FormField> }

#[derive(Clone, Debug)]
struct MedicalForm { name: String, sections: Vec<FormSection> }

use std::collections::HashMap;

struct FormRegistry { templates: HashMap<String, MedicalForm> }

impl FormRegistry {
    fn new() -> Self { Self { templates: HashMap::new() } }
    fn register(&mut self, form: MedicalForm) { self.templates.insert(form.name.clone(), form); }
    fn get(&self, name: &str) -> MedicalForm { self.templates[name].clone() }
}

fn main() {
    let mut registry = FormRegistry::new();
    registry.register(MedicalForm {
        name: "admission".into(),
        sections: vec![FormSection {
            title: "Demographics".into(),
            fields: vec![FormField {
                name: "name".into(), label: "Full Name".into(),
                required: true, value: None,
            }],
        }],
    });

    let mut form = registry.get("admission");
    form.sections[0].fields[0].value = Some("Jane Smith".into());
    println!("{:?}", form);
}`,
      },
      considerations: [
        "Deep cloning all sections and fields is critical — shared references would cause one patient's data to leak to another",
        "Consider serialization-based cloning (JSON round-trip) for complex nested structures as a simpler alternative",
        "Form templates should be versioned — regulatory changes require new templates while preserving old ones",
        "Read-only prototype templates should be frozen after registration to prevent accidental mutation",
        "Performance: for very large forms, consider copy-on-write sections instead of eager deep cloning",
      ],
    },
    {
      id: 3,
      title: "Gaming — Party Member Prototype System",
      domain: "Gaming",
      problem:
        "An RPG needs to spawn enemy parties from templates. Each template defines a party composition (2 warriors, 1 mage, 1 healer) with equipment, stats, and AI behavior. Creating hundreds of enemy parties from scratch is expensive and error-prone.",
      solution:
        "Party templates are registered as prototypes. Spawning clones the party template (deep-copying each member), then randomizes stats within a range and assigns positions on the battlefield.",
      classDiagramSvg: `<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-e3); }
  </style>
  <defs><marker id="p-e3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">PartyTemplate</text>
  <line x1="10" y1="33" x2="190" y2="33" class="s-diagram-line"/>
  <text x="20" y="48" class="s-member s-diagram-member">-members: Character[]</text>
  <text x="20" y="60" class="s-member s-diagram-member">+clone(): PartyTemplate</text>
  <rect x="250" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="350" y="28" text-anchor="middle" class="s-title s-diagram-title">Character</text>
  <line x1="250" y1="33" x2="450" y2="33" class="s-diagram-line"/>
  <text x="260" y="48" class="s-member s-diagram-member">-name, class, stats</text>
  <text x="260" y="62" class="s-member s-diagram-member">-equipment: Item[]</text>
  <text x="260" y="76" class="s-member s-diagram-member">+clone(): Character</text>
  <line x1="190" y1="40" x2="250" y2="40" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import copy
from dataclasses import dataclass, field
from typing import Dict, List
import random

@dataclass
class Character:
    name: str
    char_class: str
    hp: int
    attack: int
    equipment: List[str] = field(default_factory=list)

    def clone(self) -> "Character":
        return copy.deepcopy(self)

    def randomize(self, variance: float = 0.1):
        self.hp = int(self.hp * random.uniform(1 - variance, 1 + variance))
        self.attack = int(self.attack * random.uniform(1 - variance, 1 + variance))

@dataclass
class PartyTemplate:
    name: str
    members: List[Character] = field(default_factory=list)

    def clone(self) -> "PartyTemplate":
        cloned = PartyTemplate(name=self.name)
        cloned.members = [m.clone() for m in self.members]
        return cloned

# ── Registry ──
templates: Dict[str, PartyTemplate] = {}
templates["goblin_patrol"] = PartyTemplate("Goblin Patrol", [
    Character("Goblin Warrior", "warrior", 50, 12, ["rusty_sword"]),
    Character("Goblin Warrior", "warrior", 50, 12, ["rusty_sword"]),
    Character("Goblin Shaman", "mage", 30, 8, ["staff"]),
])

# ── Spawn ──
party = templates["goblin_patrol"].clone()
for m in party.members:
    m.randomize()
print(party)`,
        Go: `package main

import (
	"fmt"
	"math/rand"
)

type Character struct {
	Name, Class string
	HP, Attack  int
	Equipment   []string
}

func (c *Character) Clone() *Character {
	eq := make([]string, len(c.Equipment))
	copy(eq, c.Equipment)
	return &Character{c.Name, c.Class, c.HP, c.Attack, eq}
}

func (c *Character) Randomize(variance float64) {
	c.HP = int(float64(c.HP) * (1 + variance*(rand.Float64()*2-1)))
	c.Attack = int(float64(c.Attack) * (1 + variance*(rand.Float64()*2-1)))
}

type PartyTemplate struct {
	Name    string
	Members []*Character
}

func (p *PartyTemplate) Clone() *PartyTemplate {
	clone := &PartyTemplate{Name: p.Name}
	for _, m := range p.Members {
		clone.Members = append(clone.Members, m.Clone())
	}
	return clone
}

func main() {
	template := &PartyTemplate{Name: "Goblin Patrol", Members: []*Character{
		{Name: "Goblin Warrior", Class: "warrior", HP: 50, Attack: 12, Equipment: []string{"rusty_sword"}},
		{Name: "Goblin Shaman", Class: "mage", HP: 30, Attack: 8, Equipment: []string{"staff"}},
	}}

	party := template.Clone()
	for _, m := range party.Members {
		m.Randomize(0.1)
	}
	fmt.Printf("%+v\\n", party)
}`,
        Java: `import java.util.*;
import java.util.stream.Collectors;

class Character implements Cloneable {
    String name, charClass;
    int hp, attack;
    List<String> equipment;

    Character(String name, String cls, int hp, int atk, List<String> eq) {
        this.name = name; this.charClass = cls;
        this.hp = hp; this.attack = atk; this.equipment = new ArrayList<>(eq);
    }

    @Override public Character clone() {
        return new Character(name, charClass, hp, attack, new ArrayList<>(equipment));
    }

    void randomize(double variance) {
        var r = new Random();
        hp = (int)(hp * (1 + variance * (r.nextDouble() * 2 - 1)));
        attack = (int)(attack * (1 + variance * (r.nextDouble() * 2 - 1)));
    }
}

class PartyTemplate implements Cloneable {
    String name;
    List<Character> members;

    PartyTemplate(String name, List<Character> members) {
        this.name = name; this.members = members;
    }

    @Override public PartyTemplate clone() {
        return new PartyTemplate(name,
            members.stream().map(Character::clone).collect(Collectors.toList()));
    }
}`,
        TypeScript: `class GameCharacter {
  constructor(
    public name: string,
    public charClass: string,
    public hp: number,
    public attack: number,
    public equipment: string[] = [],
  ) {}

  clone(): GameCharacter {
    return new GameCharacter(
      this.name, this.charClass, this.hp, this.attack,
      [...this.equipment],
    );
  }

  randomize(variance = 0.1): void {
    const r = () => 1 + variance * (Math.random() * 2 - 1);
    this.hp = Math.round(this.hp * r());
    this.attack = Math.round(this.attack * r());
  }
}

class PartyTemplate {
  constructor(public name: string, public members: GameCharacter[] = []) {}

  clone(): PartyTemplate {
    return new PartyTemplate(this.name, this.members.map(m => m.clone()));
  }
}

// ── Usage ──
const template = new PartyTemplate("Goblin Patrol", [
  new GameCharacter("Goblin Warrior", "warrior", 50, 12, ["rusty_sword"]),
  new GameCharacter("Goblin Shaman", "mage", 30, 8, ["staff"]),
]);

const party = template.clone();
party.members.forEach(m => m.randomize());
console.log(party);`,
        Rust: `use rand::Rng;

#[derive(Clone, Debug)]
struct Character {
    name: String, class: String, hp: i32, attack: i32,
    equipment: Vec<String>,
}

impl Character {
    fn randomize(&mut self, variance: f64) {
        let mut rng = rand::thread_rng();
        let r = |base: i32| (base as f64 * (1.0 + variance * (rng.gen::<f64>() * 2.0 - 1.0))) as i32;
        self.hp = r(self.hp);
        self.attack = r(self.attack);
    }
}

#[derive(Clone, Debug)]
struct PartyTemplate { name: String, members: Vec<Character> }

fn main() {
    let template = PartyTemplate {
        name: "Goblin Patrol".into(),
        members: vec![
            Character { name: "Warrior".into(), class: "warrior".into(), hp: 50, attack: 12, equipment: vec!["rusty_sword".into()] },
            Character { name: "Shaman".into(), class: "mage".into(), hp: 30, attack: 8, equipment: vec!["staff".into()] },
        ],
    };

    let mut party = template.clone();
    party.members.iter_mut().for_each(|m| m.randomize(0.1));
    println!("{:?}", party);
}`,
      },
      considerations: [
        "Deep clone equipment lists per character — shared references cause equipment changes to affect all clones",
        "Randomization should happen after cloning, not on the prototype itself",
        "Consider a difficulty scaling parameter that adjusts stat ranges at clone time",
        "Object pooling can complement Prototype — recycle defeated enemies back into a pool for re-cloning",
        "Serialization: save/load party templates from JSON for modding support",
      ],
    },
    {
      id: 4,
      title: "DevOps — Pipeline Configuration Templates",
      domain: "DevOps / CI/CD",
      problem:
        "A CI/CD platform has pipeline templates for different project types (Node.js, Python, Java). Each template defines stages, steps, environment variables, caching rules, and notification hooks. Teams clone a template and customize only their specific repo settings.",
      solution:
        "Pipeline templates are stored as prototypes. Teams clone the relevant template and override repo-specific values (repo URL, branch, secrets). The deep clone ensures no shared state between team pipelines.",
      classDiagramSvg: `<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-e4); }
  </style>
  <defs><marker id="p-e4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">PipelineConfig</text>
  <line x1="130" y1="33" x2="330" y2="33" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">-stages: Stage[]</text>
  <text x="140" y="62" class="s-member s-diagram-member">-env: Map&lt;str,str&gt;</text>
  <text x="140" y="76" class="s-member s-diagram-member">+clone(): PipelineConfig</text>
</svg>`,
      code: {
        Python: `import copy
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class Stage:
    name: str
    commands: List[str]
    cache_key: str = ""

@dataclass
class PipelineConfig:
    name: str
    stages: List[Stage] = field(default_factory=list)
    env: Dict[str, str] = field(default_factory=dict)

    def clone(self) -> "PipelineConfig":
        return copy.deepcopy(self)

# ── Templates ──
templates: Dict[str, PipelineConfig] = {}
templates["nodejs"] = PipelineConfig("Node.js CI", [
    Stage("install", ["npm ci"], "node_modules"),
    Stage("lint", ["npm run lint"]),
    Stage("test", ["npm test"]),
    Stage("build", ["npm run build"]),
], env={"NODE_ENV": "test"})

# ── Usage ──
pipeline = templates["nodejs"].clone()
pipeline.name = "My App CI"
pipeline.env["NPM_TOKEN"] = "secret-123"
pipeline.stages.append(Stage("deploy", ["npm run deploy"]))
print(pipeline)`,
        Go: `package main

import "fmt"

type Stage struct {
	Name, CacheKey string
	Commands       []string
}

type PipelineConfig struct {
	Name   string
	Stages []Stage
	Env    map[string]string
}

func (p *PipelineConfig) Clone() *PipelineConfig {
	clone := &PipelineConfig{Name: p.Name, Env: map[string]string{}}
	for _, s := range p.Stages {
		cmds := make([]string, len(s.Commands))
		copy(cmds, s.Commands)
		clone.Stages = append(clone.Stages, Stage{s.Name, s.CacheKey, cmds})
	}
	for k, v := range p.Env { clone.Env[k] = v }
	return clone
}

func main() {
	template := &PipelineConfig{
		Name: "Node.js CI",
		Stages: []Stage{
			{"install", "node_modules", []string{"npm ci"}},
			{"test", "", []string{"npm test"}},
		},
		Env: map[string]string{"NODE_ENV": "test"},
	}

	pipeline := template.Clone()
	pipeline.Name = "My App CI"
	pipeline.Env["NPM_TOKEN"] = "secret"
	fmt.Printf("%+v\\n", pipeline)
}`,
        Java: `import java.util.*;
import java.util.stream.Collectors;

class PipelineConfig implements Cloneable {
    String name;
    List<Stage> stages;
    Map<String, String> env;

    PipelineConfig(String name, List<Stage> stages, Map<String, String> env) {
        this.name = name; this.stages = stages; this.env = new HashMap<>(env);
    }

    @Override public PipelineConfig clone() {
        return new PipelineConfig(name,
            stages.stream().map(Stage::clone).collect(Collectors.toList()),
            new HashMap<>(env));
    }
}

class Stage implements Cloneable {
    String name;
    List<String> commands;
    Stage(String name, List<String> cmds) { this.name = name; this.commands = cmds; }
    @Override public Stage clone() { return new Stage(name, new ArrayList<>(commands)); }
}`,
        TypeScript: `interface Stage { name: string; commands: string[]; cacheKey?: string; }

class PipelineConfig {
  constructor(
    public name: string,
    public stages: Stage[] = [],
    public env: Record<string, string> = {},
  ) {}

  clone(): PipelineConfig {
    return new PipelineConfig(
      this.name,
      this.stages.map(s => ({ ...s, commands: [...s.commands] })),
      { ...this.env },
    );
  }
}

// ── Usage ──
const templates = new Map<string, PipelineConfig>();
templates.set("nodejs", new PipelineConfig("Node.js CI", [
  { name: "install", commands: ["npm ci"], cacheKey: "node_modules" },
  { name: "test", commands: ["npm test"] },
], { NODE_ENV: "test" }));

const pipeline = templates.get("nodejs")!.clone();
pipeline.name = "My App CI";
pipeline.env.NPM_TOKEN = "secret-123";
console.log(pipeline);`,
        Rust: `use std::collections::HashMap;

#[derive(Clone, Debug)]
struct Stage { name: String, commands: Vec<String>, cache_key: Option<String> }

#[derive(Clone, Debug)]
struct PipelineConfig {
    name: String, stages: Vec<Stage>, env: HashMap<String, String>,
}

fn main() {
    let mut templates: HashMap<String, PipelineConfig> = HashMap::new();
    templates.insert("nodejs".into(), PipelineConfig {
        name: "Node.js CI".into(),
        stages: vec![
            Stage { name: "install".into(), commands: vec!["npm ci".into()], cache_key: Some("node_modules".into()) },
            Stage { name: "test".into(), commands: vec!["npm test".into()], cache_key: None },
        ],
        env: [("NODE_ENV".into(), "test".into())].into(),
    });

    let mut pipeline = templates["nodejs"].clone();
    pipeline.name = "My App CI".into();
    pipeline.env.insert("NPM_TOKEN".into(), "secret".into());
    println!("{:?}", pipeline);
}`,
      },
      considerations: [
        "Secrets should NOT be stored in prototype templates — inject them only into clones",
        "Template versioning: store template version for audit trails when teams clone",
        "Consider copy-on-write for large stage lists if most teams only add/change 1-2 stages",
        "Thread safety: templates should be read-only after initialization; only clones are mutated",
        "Validation: cloned pipelines should be validated before execution",
      ],
    },
    {
      id: 5,
      title: "E-Commerce — Product Variant Generator",
      domain: "E-Commerce",
      problem:
        "A product catalog has base products with complex descriptions, images, pricing rules, and SEO metadata. Each variant (size, color) shares 95% of the data but differs in SKU, price modifier, and available inventory. Duplicating the full product data for each variant wastes storage and risks inconsistency.",
      solution:
        "The base product is the prototype. Each variant clones the base and overrides only the differing fields (SKU, price modifier, inventory count). Deep clone ensures variant-specific changes don't affect the base or other variants.",
      classDiagramSvg: `<svg viewBox="0 0 460 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#p-e5); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs><marker id="p-e5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="10" width="200" height="80" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">Product</text>
  <line x1="130" y1="33" x2="330" y2="33" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">-sku, name, basePrice</text>
  <text x="140" y="62" class="s-member s-diagram-member">-images[], seoMeta</text>
  <text x="140" y="76" class="s-member s-diagram-member">+clone(): Product</text>
  <text x="140" y="88" class="s-member s-diagram-member">+withVariant(sku,mod)</text>
</svg>`,
      code: {
        Python: `import copy
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class Product:
    sku: str
    name: str
    description: str
    base_price: float
    images: List[str] = field(default_factory=list)
    seo_meta: Dict[str, str] = field(default_factory=dict)
    inventory: int = 0

    def clone(self) -> "Product":
        return copy.deepcopy(self)

    def with_variant(self, sku: str, price_mod: float, inventory: int) -> "Product":
        variant = self.clone()
        variant.sku = sku
        variant.base_price += price_mod
        variant.inventory = inventory
        return variant

# ── Usage ──
base = Product(
    sku="TSHIRT-BASE", name="Classic T-Shirt",
    description="Premium cotton tee", base_price=29.99,
    images=["front.jpg", "back.jpg"],
    seo_meta={"title": "Classic T-Shirt", "desc": "Premium cotton"},
)

small = base.with_variant("TSHIRT-S", -5.00, 150)
large = base.with_variant("TSHIRT-L", 0.00, 200)
xl = base.with_variant("TSHIRT-XL", 5.00, 75)

print(f"{small.sku}: \${small.base_price}")
print(f"{xl.sku}: \${xl.base_price}")`,
        Go: `package main

import "fmt"

type Product struct {
	SKU, Name, Description string
	BasePrice              float64
	Images                 []string
	SEOMeta                map[string]string
	Inventory              int
}

func (p *Product) Clone() *Product {
	clone := *p
	clone.Images = make([]string, len(p.Images))
	copy(clone.Images, p.Images)
	clone.SEOMeta = map[string]string{}
	for k, v := range p.SEOMeta { clone.SEOMeta[k] = v }
	return &clone
}

func (p *Product) WithVariant(sku string, priceMod float64, inv int) *Product {
	v := p.Clone()
	v.SKU = sku
	v.BasePrice += priceMod
	v.Inventory = inv
	return v
}

func main() {
	base := &Product{
		SKU: "TSHIRT-BASE", Name: "Classic T-Shirt",
		BasePrice: 29.99, Images: []string{"front.jpg"},
		SEOMeta: map[string]string{"title": "Classic T-Shirt"},
	}
	small := base.WithVariant("TSHIRT-S", -5.0, 150)
	xl := base.WithVariant("TSHIRT-XL", 5.0, 75)
	fmt.Printf("Small: %s $%.2f\\n", small.SKU, small.BasePrice)
	fmt.Printf("XL: %s $%.2f\\n", xl.SKU, xl.BasePrice)
}`,
        Java: `import java.util.*;

class Product implements Cloneable {
    String sku, name, description;
    double basePrice;
    List<String> images;
    Map<String, String> seoMeta;
    int inventory;

    Product(String sku, String name, double price) {
        this.sku = sku; this.name = name; this.basePrice = price;
        this.images = new ArrayList<>(); this.seoMeta = new HashMap<>();
    }

    @Override public Product clone() {
        try {
            Product copy = (Product) super.clone();
            copy.images = new ArrayList<>(images);
            copy.seoMeta = new HashMap<>(seoMeta);
            return copy;
        } catch (CloneNotSupportedException e) { throw new RuntimeException(e); }
    }

    Product withVariant(String sku, double priceMod, int inv) {
        Product v = clone();
        v.sku = sku; v.basePrice += priceMod; v.inventory = inv;
        return v;
    }
}`,
        TypeScript: `class Product {
  constructor(
    public sku: string,
    public name: string,
    public description: string,
    public basePrice: number,
    public images: string[] = [],
    public seoMeta: Record<string, string> = {},
    public inventory: number = 0,
  ) {}

  clone(): Product {
    return new Product(
      this.sku, this.name, this.description, this.basePrice,
      [...this.images], { ...this.seoMeta }, this.inventory,
    );
  }

  withVariant(sku: string, priceMod: number, inventory: number): Product {
    const v = this.clone();
    v.sku = sku;
    v.basePrice += priceMod;
    v.inventory = inventory;
    return v;
  }
}

// ── Usage ──
const base = new Product("TSHIRT-BASE", "Classic T-Shirt", "Premium cotton", 29.99,
  ["front.jpg"], { title: "Classic T-Shirt" });
const small = base.withVariant("TSHIRT-S", -5, 150);
const xl = base.withVariant("TSHIRT-XL", 5, 75);
console.log(small.sku, small.basePrice);`,
        Rust: `#[derive(Clone, Debug)]
struct Product {
    sku: String, name: String, description: String,
    base_price: f64, images: Vec<String>,
    seo_meta: std::collections::HashMap<String, String>,
    inventory: u32,
}

impl Product {
    fn with_variant(&self, sku: &str, price_mod: f64, inv: u32) -> Self {
        let mut v = self.clone();
        v.sku = sku.into();
        v.base_price += price_mod;
        v.inventory = inv;
        v
    }
}

fn main() {
    let base = Product {
        sku: "TSHIRT-BASE".into(), name: "Classic T-Shirt".into(),
        description: "Premium cotton".into(), base_price: 29.99,
        images: vec!["front.jpg".into()],
        seo_meta: [("title".into(), "Classic T-Shirt".into())].into(),
        inventory: 0,
    };
    let small = base.with_variant("TSHIRT-S", -5.0, 150);
    let xl = base.with_variant("TSHIRT-XL", 5.0, 75);
    println!("{}: \${:.2}", small.sku, small.base_price);
    println!("{}: \${:.2}", xl.sku, xl.base_price);
}`,
      },
      considerations: [
        "with_variant() creates a convenient API that combines clone + override in one call",
        "Images are shared across variants — consider shallow copying if images are immutable strings",
        "Variant-specific images (color photos) need to be overridden after cloning",
        "Pricing rules may be complex (percentage vs. fixed modifiers) — consider a pricing strategy",
        "Database: store only the variant diff, reconstruct full product by cloning base + applying diff",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "For most applications, use the Deep Clone with Registry pattern — it handles nested objects correctly and provides a clean API for accessing prototypes by name. Use Shallow Clone only when all nested objects are immutable. Use Serialization-based cloning for complex graphs where manual deep-copy code is error-prone.",

  variants: [
    {
      id: 1,
      name: "Deep Clone (Manual)",
      description:
        "Implement clone() manually by copying each field, recursively cloning mutable nested objects. Gives full control over what is shared vs. copied. Requires updating clone() when fields are added.",
      code: {
        Python: `import copy

class Document:
    def __init__(self, title: str, pages: list):
        self.title = title
        self.pages = pages

    def clone(self):
        return Document(self.title, [p.clone() for p in self.pages])

class Page:
    def __init__(self, content: str):
        self.content = content

    def clone(self):
        return Page(self.content)

doc = Document("Report", [Page("Intro"), Page("Data")])
clone = doc.clone()
clone.pages[0].content = "Modified Intro"
print(doc.pages[0].content)    # "Intro" — original unchanged`,
        Go: `type Document struct {
	Title string
	Pages []*Page
}

func (d *Document) Clone() *Document {
	clone := &Document{Title: d.Title}
	for _, p := range d.Pages {
		clone.Pages = append(clone.Pages, p.Clone())
	}
	return clone
}

type Page struct{ Content string }

func (p *Page) Clone() *Page { return &Page{Content: p.Content} }`,
        Java: `class Document implements Cloneable {
    String title;
    List<Page> pages;

    @Override public Document clone() {
        Document copy = new Document();
        copy.title = this.title;
        copy.pages = pages.stream()
            .map(Page::clone)
            .collect(Collectors.toList());
        return copy;
    }
}`,
        TypeScript: `class Document {
  constructor(public title: string, public pages: Page[]) {}
  clone(): Document {
    return new Document(this.title, this.pages.map(p => p.clone()));
  }
}

class Page {
  constructor(public content: string) {}
  clone(): Page { return new Page(this.content); }
}`,
        Rust: `#[derive(Clone)]
struct Document { title: String, pages: Vec<Page> }

#[derive(Clone)]
struct Page { content: String }

// Rust's derive(Clone) deep-clones by default`,
      },
      pros: [
        "Full control over copy semantics — choose what to share vs. copy",
        "No runtime overhead from serialization or reflection",
        "Explicit — code shows exactly what is being cloned",
      ],
      cons: [
        "Must update clone() when adding new fields — easy to forget",
        "More boilerplate for deeply nested object graphs",
        "Error-prone for complex structures with circular references",
      ],
    },
    {
      id: 2,
      name: "Serialization-Based Clone",
      description:
        "Clone by serializing the object to JSON/bytes and deserializing back into a new instance. Handles arbitrary nesting automatically but is slower and loses non-serializable data (functions, closures).",
      code: {
        Python: `import json

class Config:
    def __init__(self, data: dict):
        self.data = data

    def clone(self):
        return Config(json.loads(json.dumps(self.data)))

original = Config({"db": {"host": "localhost", "port": 5432}})
clone = original.clone()
clone.data["db"]["host"] = "remote-server"
print(original.data["db"]["host"])  # "localhost" — deep clone`,
        Go: `import (
	"encoding/json"
)

func DeepClone[T any](src T) T {
	data, _ := json.Marshal(src)
	var clone T
	json.Unmarshal(data, &clone)
	return clone
}`,
        Java: `import com.fasterxml.jackson.databind.ObjectMapper;

class CloneUtil {
    private static final ObjectMapper mapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    static <T> T deepClone(T obj) throws Exception {
        String json = mapper.writeValueAsString(obj);
        return (T) mapper.readValue(json, obj.getClass());
    }
}`,
        TypeScript: `function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Works for plain data objects
const original = { db: { host: "localhost", port: 5432 } };
const clone = deepClone(original);
clone.db.host = "remote";
console.log(original.db.host); // "localhost"`,
        Rust: `use serde::{Serialize, Deserialize};

fn deep_clone<T: Serialize + for<'de> Deserialize<'de>>(obj: &T) -> T {
    let json = serde_json::to_string(obj).unwrap();
    serde_json::from_str(&json).unwrap()
}`,
      },
      pros: [
        "Handles arbitrary nesting automatically — no manual field-by-field copying",
        "Works with any serializable structure, no special clone methods needed",
        "Easy to implement and maintain — adding new fields works automatically",
      ],
      cons: [
        "Slower than manual cloning due to serialization/deserialization overhead",
        "Loses non-serializable data: functions, closures, circular references",
        "Doesn't work with complex types like streams, connections, or file handles",
      ],
    },
    {
      id: 3,
      name: "Copy-on-Write (Structural Sharing)",
      description:
        "Clone shares the data with the original. Only when a mutation occurs is the affected portion actually copied. Extremely memory-efficient for large objects where few fields change.",
      code: {
        Python: `class CowDict:
    """Copy-on-Write dictionary wrapper."""
    def __init__(self, data: dict, parent=None):
        self._data = data
        self._parent = parent
        self._overrides = {}

    def get(self, key):
        if key in self._overrides:
            return self._overrides[key]
        return self._data.get(key)

    def set(self, key, value):
        self._overrides[key] = value
        return self

    def clone(self):
        return CowDict(self._data, parent=self)

# ── Usage ──
original = CowDict({"a": 1, "b": 2, "c": 3})
clone = original.clone()
clone.set("a", 999)           # only "a" is copied
print(original.get("a"))      # 1 — unchanged
print(clone.get("a"))         # 999 — overridden
print(clone.get("b"))         # 2 — shared with original`,
        Go: `type CowMap struct {
	base      map[string]any
	overrides map[string]any
}

func NewCowMap(data map[string]any) *CowMap {
	return &CowMap{base: data, overrides: map[string]any{}}
}
func (c *CowMap) Get(key string) any {
	if v, ok := c.overrides[key]; ok { return v }
	return c.base[key]
}
func (c *CowMap) Set(key string, val any) { c.overrides[key] = val }
func (c *CowMap) Clone() *CowMap {
	return &CowMap{base: c.base, overrides: map[string]any{}}
}`,
        Java: `class CowMap<K, V> {
    private final Map<K, V> base;
    private final Map<K, V> overrides = new HashMap<>();

    CowMap(Map<K, V> base) { this.base = base; }

    V get(K key) { return overrides.containsKey(key) ? overrides.get(key) : base.get(key); }
    void set(K key, V value) { overrides.put(key, value); }
    CowMap<K, V> cowClone() { return new CowMap<>(base); }
}`,
        TypeScript: `class CowMap<T extends Record<string, any>> {
  private overrides: Partial<T> = {};
  constructor(private readonly base: T) {}

  get<K extends keyof T>(key: K): T[K] {
    return key in this.overrides ? this.overrides[key]! : this.base[key];
  }
  set<K extends keyof T>(key: K, value: T[K]): void {
    this.overrides[key] = value;
  }
  clone(): CowMap<T> { return new CowMap(this.base); }
}`,
        Rust: `use std::collections::HashMap;
use std::sync::Arc;

struct CowMap {
    base: Arc<HashMap<String, String>>,
    overrides: HashMap<String, String>,
}

impl CowMap {
    fn new(data: HashMap<String, String>) -> Self {
        Self { base: Arc::new(data), overrides: HashMap::new() }
    }
    fn get(&self, key: &str) -> Option<&String> {
        self.overrides.get(key).or_else(|| self.base.get(key))
    }
    fn set(&mut self, key: &str, val: &str) {
        self.overrides.insert(key.into(), val.into());
    }
    fn cow_clone(&self) -> Self {
        Self { base: Arc::clone(&self.base), overrides: HashMap::new() }
    }
}`,
      },
      pros: [
        "Extremely memory-efficient — unchanged data is shared, not duplicated",
        "Clone is O(1) — no data is actually copied until mutation",
        "Ideal for immutable-heavy architectures and functional programming",
      ],
      cons: [
        "Adds complexity — reads must check overrides before base",
        "Not suitable when most fields change after cloning",
        "Garbage collection of shared base may be delayed if many clones exist",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Clone Speed", "Memory", "Complexity", "Best For",
  ],
  comparisonRows: [
    ["Deep Clone (Manual)", "Fast", "High (full copy)", "Medium", "Complex objects, full isolation"],
    ["Serialization-Based", "Slow", "High (full copy)", "Low", "Rapid prototyping, simple data"],
    ["Copy-on-Write", "O(1)", "Low (shared)", "High", "Large objects, few changes"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Creational" },
    {
      aspect: "Key Benefit",
      detail:
        "Creates new objects by copying existing ones, avoiding expensive initialization and decoupling clients from concrete classes",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Shallow clone of objects with mutable nested fields — changes to the clone affect the original",
    },
    {
      aspect: "Deep vs. Shallow",
      detail:
        "Shallow clone copies references; deep clone recursively copies all nested objects. Choose based on mutability of nested data.",
    },
    {
      aspect: "vs. Factory Method",
      detail:
        "Factory Method creates from scratch via a class; Prototype copies an existing instance. Use Prototype when initialization is expensive.",
    },
    {
      aspect: "Thread Safety",
      detail:
        "Prototypes must be immutable or synchronized. Clones are independent and safe to use in separate threads.",
    },
    {
      aspect: "When to Use",
      detail:
        "Expensive initialization, template/preset systems, dynamic type creation at runtime, or when constructors are complex",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Abstract Factory (can clone prototypes instead of constructing), Composite (clone complex trees), Memento (snapshot = clone of state)",
    },
  ],

  antiPatterns: [
    {
      name: "Shallow Clone of Mutable State",
      description:
        "Using shallow copy (Object.assign, spread) on objects with mutable nested references. Changes to the clone's nested objects affect the original.",
      betterAlternative:
        "Deep clone all mutable nested objects. Use structuredClone(), copy.deepcopy(), or manual recursive cloning. Only shallow-copy when all nested objects are immutable.",
    },
    {
      name: "Clone Without Registry",
      description:
        "Scattering prototype instances throughout the codebase with no central registry. Clients hold direct references to prototypes, making it hard to update templates.",
      betterAlternative:
        "Use a centralized prototype registry (Map<string, Prototype>). Clients request clones by name. Updating a template in the registry affects all future clones.",
    },
    {
      name: "Cloning When Constructor Is Cheap",
      description:
        "Using Prototype for simple objects that can be constructed quickly. Adding clone() infrastructure adds complexity without benefit.",
      betterAlternative:
        "Reserve Prototype for genuinely expensive initialization (DB queries, file parsing, calibration). For simple objects, use constructors or factories.",
    },
    {
      name: "Mutating the Prototype",
      description:
        "Accidentally modifying the prototype object instead of a clone. All subsequent clones inherit the corrupted state.",
      betterAlternative:
        "Make prototypes immutable after registration. Use frozen/sealed objects (Object.freeze, frozen=True, final fields). Only clones should be mutable.",
    },
    {
      name: "Ignoring Circular References",
      description:
        "Objects with circular references (parent→child→parent) cause infinite recursion during deep cloning, crashing the application.",
      betterAlternative:
        "Track visited objects during cloning using an identity set. When a circular reference is detected, reuse the already-cloned instance.",
    },
  ],
};

export default prototypeData;
