import { PatternData } from "@/lib/patterns/types";

const compositeData: PatternData = {
  slug: "composite",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Composite Pattern",
  subtitle:
    "Compose objects into tree structures so clients can treat individual objects and compositions uniformly through a shared interface.",

  intent:
    "Many domains have part-whole hierarchies — a file system has files and directories (which contain files and more directories), a UI has widgets and containers (which contain more widgets), an organization has employees and departments. The Composite pattern lets you build these recursive tree structures where leaves (individual objects) and composites (containers) share the same interface. Clients call the same method on a leaf or a branch — the branch recursively delegates to its children. This eliminates conditional 'is this a leaf or container?' checks throughout the codebase.",

  classDiagramSvg: `<svg viewBox="0 0 480 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#cp-arr); }
    .s-dash { stroke-dasharray: 5,3; }
    .s-ital { font-style: italic; }
  </style>
  <defs>
    <marker id="cp-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="10" y="10" width="100" height="35" class="s-box s-diagram-box"/>
  <text x="60" y="32" text-anchor="middle" class="s-title s-diagram-title">Client</text>
  <!-- Component -->
  <rect x="170" y="10" width="170" height="55" class="s-box s-diagram-box"/>
  <text x="255" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="255" y="42" text-anchor="middle" class="s-title s-diagram-title">Component</text>
  <line x1="170" y1="45" x2="340" y2="45" class="s-diagram-line"/>
  <text x="180" y="58" class="s-member s-diagram-member s-ital">+operation(): Result</text>
  <!-- Leaf -->
  <rect x="40" y="130" width="150" height="55" class="s-box s-diagram-box"/>
  <text x="115" y="148" text-anchor="middle" class="s-title s-diagram-title">Leaf</text>
  <line x1="40" y1="152" x2="190" y2="152" class="s-diagram-line"/>
  <text x="50" y="168" class="s-member s-diagram-member">-data: T</text>
  <text x="50" y="182" class="s-member s-diagram-member">+operation(): Result</text>
  <!-- Composite -->
  <rect x="260" y="130" width="200" height="85" class="s-box s-diagram-box"/>
  <text x="360" y="148" text-anchor="middle" class="s-title s-diagram-title">Composite</text>
  <line x1="260" y1="152" x2="460" y2="152" class="s-diagram-line"/>
  <text x="270" y="168" class="s-member s-diagram-member">-children: Component[]</text>
  <text x="270" y="183" class="s-member s-diagram-member">+operation(): Result</text>
  <text x="270" y="198" class="s-member s-diagram-member">+add(child): void</text>
  <text x="270" y="212" class="s-member s-diagram-member">+remove(child): void</text>
  <!-- Arrows -->
  <line x1="110" y1="28" x2="170" y2="28" class="s-arr s-diagram-arrow"/>
  <line x1="115" y1="130" x2="220" y2="65" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="360" y1="130" x2="300" y2="65" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Client works with the Component interface, which declares operation(). Leaf implements operation() directly for individual objects. Composite also implements operation() but delegates to its children — iterating through them and aggregating results. The Composite also has add()/remove() for managing children. Because both Leaf and Composite implement Component, the Client doesn't need to know which it's dealing with.",

  diagramComponents: [
    {
      name: "Component (Interface)",
      description:
        "The shared interface that both leaves and composites implement. Declares the operation() method that clients call. This is the key abstraction that enables uniform treatment.",
    },
    {
      name: "Leaf",
      description:
        "An individual object with no children. Implements operation() with actual business logic. Represents the terminal nodes in the tree — files in a file system, individual widgets in a UI.",
    },
    {
      name: "Composite",
      description:
        "A container that holds child Components (which can be Leaves or other Composites). Its operation() delegates to children recursively. Also provides add()/remove() for tree management.",
    },
  ],

  solutionDetail:
    "**The Problem:** You have a recursive tree structure where individual objects and groups of objects need to be treated uniformly. Without Composite, every client must check \"is this a leaf or a container?\" before calling methods, leading to branches of conditional logic.\n\n**The Composite Solution:** Define a Component interface with the shared operation. Both Leaf and Composite implement it. The Composite's implementation iterates over its children, calling their operation() recursively.\n\n**How It Works:**\n\n1. **Define the Component interface**: Declares the operations that both leaves and composites must support (e.g., `getSize()`, `render()`, `getPrice()`).\n\n2. **Implement Leaf**: Performs the actual operation on a single object.\n\n3. **Implement Composite**: Stores a list of children (Component[]). Its operation() iterates children, calls operation() on each, and aggregates the results (sum, concat, max, etc.).\n\n4. **Client uses Component**: The client holds a reference to Component and calls operation() — it works whether the reference is a leaf or a tree of thousands of nodes.\n\n**Key Insight:** The power of Composite is recursive delegation. A Composite can contain other Composites to any depth. Calling operation() on the root traverses the entire tree automatically.",

  characteristics: [
    "Part-whole hierarchy where individual and group objects share the same interface",
    "Recursive tree structure — composites contain components, which can be more composites",
    "Clients treat leaves and composites uniformly — no type-checking branches",
    "The composite delegates to children and aggregates results",
    "add() and remove() on the composite manage the tree structure",
    "Depth of nesting is unlimited — enables complex hierarchies",
    "Common aggregation operations: sum, concat, max, min, any, all",
  ],

  useCases: [
    {
      id: 1,
      title: "File System Navigation",
      domain: "Operating Systems",
      description:
        "A file system has files and directories. A directory can contain files and other directories. Computing total size must work for a single file or an entire directory tree.",
      whySingleton:
        "Both File and Directory implement a FileSystemEntry interface with getSize(). Directory sums its children's sizes recursively.",
      code: `interface Entry { getSize(): number; }
class File implements Entry { getSize() { return this.bytes; } }
class Dir implements Entry {
  children: Entry[] = [];
  getSize() { return this.children.reduce((s, c) => s + c.getSize(), 0); }
}`,
    },
    {
      id: 2,
      title: "UI Widget Layout",
      domain: "Frontend / Desktop UI",
      description:
        "A UI toolkit has atomic widgets (Button, Label) and containers (Panel, Window) that hold other widgets. Rendering must work at any level of the hierarchy.",
      whySingleton:
        "Both Widget and Container implement render(). Container iterates its children and renders each inside its bounds.",
      code: `interface Widget { render(ctx: Canvas): void; }
class Button implements Widget { render(ctx) { ctx.drawButton(this); } }
class Panel implements Widget {
  children: Widget[] = [];
  render(ctx) { this.children.forEach(c => c.render(ctx)); }
}`,
    },
    {
      id: 3,
      title: "Organization Chart Hierarchy",
      domain: "Human Resources",
      description:
        "An organization has employees and departments. A department can contain employees and sub-departments. Computing total salary budget must work at any level.",
      whySingleton:
        "Both Employee and Department implement OrgUnit with getCost(). Department sums all children's costs recursively.",
      code: `interface OrgUnit { getCost(): number; }
class Employee implements OrgUnit { getCost() { return this.salary; } }
class Department implements OrgUnit {
  units: OrgUnit[] = [];
  getCost() { return this.units.reduce((s, u) => s + u.getCost(), 0); }
}`,
    },
    {
      id: 4,
      title: "Menu / Navigation Tree",
      domain: "Web Application",
      description:
        "A navigation menu has menu items and submenus. Submenus contain more items and deeper submenus. Rendering and permission checks must work uniformly.",
      whySingleton:
        "Both MenuItem and SubMenu implement Navigable with render(). SubMenu recursively renders its children with indentation.",
      code: `interface Navigable { render(depth: number): string; }
class MenuItem implements Navigable {
  render(d) { return "  ".repeat(d) + this.label; }
}
class SubMenu implements Navigable {
  items: Navigable[] = [];
  render(d) { return this.items.map(i => i.render(d + 1)).join("\\n"); }
}`,
    },
    {
      id: 5,
      title: "Product Bundle Pricing",
      domain: "E-Commerce",
      description:
        "Products can be sold individually or in bundles (which may contain other bundles). getPrice() must work for a single product or a deeply nested bundle.",
      whySingleton:
        "Both Product and Bundle implement PriceItem with getPrice(). Bundle sums its children and optionally applies a discount.",
      code: `interface PriceItem { getPrice(): number; }
class Product implements PriceItem { getPrice() { return this.price; } }
class Bundle implements PriceItem {
  items: PriceItem[] = [];
  getPrice() {
    return this.items.reduce((s, i) => s + i.getPrice(), 0) * 0.9;
  }
}`,
    },
    {
      id: 6,
      title: "Graphics Scene Graph",
      domain: "Game / CAD",
      description:
        "A 2D scene has shapes (Circle, Rect) and groups of shapes. Transformations (translate, rotate) applied to a group affect all children recursively.",
      whySingleton:
        "Both Shape and Group implement Drawable. Group applies its transform, then recursively draws each child with the combined transform.",
      code: `interface Drawable { draw(transform: Matrix): void; }
class Circle implements Drawable { draw(t) { render(applyT(t, this)); } }
class Group implements Drawable {
  children: Drawable[] = [];
  draw(t) {
    const combined = multiply(t, this.localTransform);
    this.children.forEach(c => c.draw(combined));
  }
}`,
    },
    {
      id: 7,
      title: "Permission Tree (RBAC)",
      domain: "Security / IAM",
      description:
        "Permissions form a hierarchy: individual permissions (read, write) and permission groups (editor = read + write + comment). Checking hasPermission must resolve recursively.",
      whySingleton:
        "Both Permission and PermissionGroup implement Authorizable. The group checks if any child grants the requested operation.",
      code: `interface Authorizable { grants(action: string): boolean; }
class Permission implements Authorizable {
  grants(action) { return this.action === action; }
}
class PermissionGroup implements Authorizable {
  perms: Authorizable[] = [];
  grants(action) { return this.perms.some(p => p.grants(action)); }
}`,
    },
    {
      id: 8,
      title: "Test Suite Tree",
      domain: "Testing / DevOps",
      description:
        "A test runner has individual test cases and test suites (which contain cases and nested suites). Running and collecting results must work at any level.",
      whySingleton:
        "Both TestCase and TestSuite implement Runnable. TestSuite runs all children and aggregates pass/fail counts.",
      code: `interface Runnable { run(): TestResult; }
class TestCase implements Runnable {
  run() { return this.fn() ? pass(this.name) : fail(this.name); }
}
class TestSuite implements Runnable {
  tests: Runnable[] = [];
  run() { return merge(this.tests.map(t => t.run())); }
}`,
    },
    {
      id: 9,
      title: "Document Structure (HTML DOM)",
      domain: "Document Processing",
      description:
        "An HTML-like document has leaf nodes (Text, Image) and container nodes (Div, Section). Operations like toHTML(), wordCount(), or findById() must work on any node.",
      whySingleton:
        "Both LeafNode and ContainerNode implement DOMNode. Container concatenates children's output and wraps in its own tag.",
      code: `interface DOMNode { toHTML(): string; }
class TextNode implements DOMNode { toHTML() { return this.text; } }
class DivNode implements DOMNode {
  children: DOMNode[] = [];
  toHTML() {
    return \`<div>\${this.children.map(c => c.toHTML()).join("")}</div>\`;
  }
}`,
    },
    {
      id: 10,
      title: "Boolean Expression Tree",
      domain: "Rule Engines",
      description:
        "A rules engine has atomic conditions (price > 100) and composite conditions (AND, OR of other conditions). Evaluation must work recursively on complex expressions.",
      whySingleton:
        "Both AtomicCondition and CompositeCondition implement Expression with evaluate(). AND/OR delegates to children with appropriate short-circuit logic.",
      code: `interface Expression { evaluate(ctx: Context): boolean; }
class Condition implements Expression {
  evaluate(ctx) { return this.predicate(ctx); }
}
class AndExpr implements Expression {
  exprs: Expression[] = [];
  evaluate(ctx) { return this.exprs.every(e => e.evaluate(ctx)); }
}`,
    },
    {
      id: 11,
      title: "Military Unit Hierarchy",
      domain: "Simulation / Defense",
      description:
        "A military simulation has individual soldiers and units (squads, platoons, companies). Issuing an order to a company cascades to all soldiers within.",
      whySingleton:
        "Both Soldier and Unit implement MilitaryEntity with execute(order). A Unit propagates the order to all children.",
      code: `interface MilitaryEntity { execute(order: Order): void; }
class Soldier implements MilitaryEntity {
  execute(order) { this.performAction(order); }
}
class Platoon implements MilitaryEntity {
  members: MilitaryEntity[] = [];
  execute(order) { this.members.forEach(m => m.execute(order)); }
}`,
    },
    {
      id: 12,
      title: "Infrastructure Monitoring Tree",
      domain: "Cloud / SRE",
      description:
        "Monitoring covers individual services and service groups (clusters, regions, global). Health checks must aggregate from leaves to root with worst-status propagation.",
      whySingleton:
        "Both Service and ServiceGroup implement Monitorable. A group's health is the worst status among its children.",
      code: `interface Monitorable { health(): Status; }
class Service implements Monitorable {
  health() { return this.lastPing < 5000 ? "UP" : "DOWN"; }
}
class Cluster implements Monitorable {
  nodes: Monitorable[] = [];
  health() { return worst(this.nodes.map(n => n.health())); }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "File System — Directory Size Calculator",
      domain: "Operating Systems",
      problem:
        "A file system has files and directories. Computing the total size of a directory requires recursively summing all files within it and its subdirectories. Without Composite, the client must distinguish between files and directories at every level.",
      solution:
        "Both File and Directory implement FileSystemEntry with a getSize() method. Directory.getSize() sums its children's sizes recursively.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="10" width="160" height="40" class="s-box s-diagram-box"/>
  <text x="210" y="34" text-anchor="middle" class="s-title s-diagram-title">FileSystemEntry</text>
  <rect x="10" y="90" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="80" y="108" text-anchor="middle" class="s-title s-diagram-title">File</text>
  <line x1="10" y1="112" x2="150" y2="112" class="s-diagram-line"/>
  <text x="18" y="128" class="s-member s-diagram-member">-bytes: int</text>
  <text x="18" y="140" class="s-member s-diagram-member">+getSize(): int</text>
  <rect x="200" y="90" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="300" y="108" text-anchor="middle" class="s-title s-diagram-title">Directory</text>
  <line x1="200" y1="112" x2="400" y2="112" class="s-diagram-line"/>
  <text x="208" y="128" class="s-member s-diagram-member">-children: FileSystemEntry[]</text>
  <text x="208" y="140" class="s-member s-diagram-member">+getSize(): int</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class FileSystemEntry(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_size(self) -> int: ...

    @abstractmethod
    def display(self, indent: int = 0) -> str: ...

class File(FileSystemEntry):
    def __init__(self, name: str, size: int):
        super().__init__(name)
        self._size = size

    def get_size(self) -> int:
        return self._size

    def display(self, indent: int = 0) -> str:
        return f"{'  ' * indent}📄 {self.name} ({self._size}B)"

class Directory(FileSystemEntry):
    def __init__(self, name: str):
        super().__init__(name)
        self._children: list[FileSystemEntry] = []

    def add(self, entry: FileSystemEntry) -> None:
        self._children.append(entry)

    def remove(self, entry: FileSystemEntry) -> None:
        self._children.remove(entry)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self._children)

    def display(self, indent: int = 0) -> str:
        lines = [f"{'  ' * indent}📁 {self.name} ({self.get_size()}B)"]
        for child in self._children:
            lines.append(child.display(indent + 1))
        return "\\n".join(lines)

# ── Usage ──
root = Directory("src")
root.add(File("index.ts", 1200))
root.add(File("app.tsx", 3400))

components = Directory("components")
components.add(File("Button.tsx", 800))
components.add(File("Modal.tsx", 1500))
root.add(components)

print(root.display())
print(f"Total: {root.get_size()}B")  # 6900`,
        Go: `package main

import (
	"fmt"
	"strings"
)

type FileSystemEntry interface {
	GetSize() int
	Display(indent int) string
}

type File struct{ Name string; Size int }
func (f *File) GetSize() int { return f.Size }
func (f *File) Display(indent int) string {
	return fmt.Sprintf("%s📄 %s (%dB)", strings.Repeat("  ", indent), f.Name, f.Size)
}

type Directory struct {
	Name     string
	children []FileSystemEntry
}
func (d *Directory) Add(e FileSystemEntry) { d.children = append(d.children, e) }
func (d *Directory) GetSize() int {
	total := 0
	for _, c := range d.children { total += c.GetSize() }
	return total
}
func (d *Directory) Display(indent int) string {
	lines := []string{fmt.Sprintf("%s📁 %s (%dB)", strings.Repeat("  ", indent), d.Name, d.GetSize())}
	for _, c := range d.children { lines = append(lines, c.Display(indent+1)) }
	return strings.Join(lines, "\\n")
}

func main() {
	root := &Directory{Name: "src"}
	root.Add(&File{"index.ts", 1200})
	root.Add(&File{"app.tsx", 3400})
	comps := &Directory{Name: "components"}
	comps.Add(&File{"Button.tsx", 800})
	comps.Add(&File{"Modal.tsx", 1500})
	root.Add(comps)
	fmt.Println(root.Display(0))
	fmt.Printf("Total: %dB\\n", root.GetSize())
}`,
        Java: `import java.util.ArrayList;
import java.util.List;

interface FileSystemEntry {
    int getSize();
    String display(int indent);
}

class File implements FileSystemEntry {
    private final String name;
    private final int size;
    File(String name, int size) { this.name = name; this.size = size; }
    public int getSize() { return size; }
    public String display(int indent) {
        return "  ".repeat(indent) + "📄 " + name + " (" + size + "B)";
    }
}

class Directory implements FileSystemEntry {
    private final String name;
    private final List<FileSystemEntry> children = new ArrayList<>();
    Directory(String name) { this.name = name; }
    void add(FileSystemEntry e) { children.add(e); }
    public int getSize() { return children.stream().mapToInt(FileSystemEntry::getSize).sum(); }
    public String display(int indent) {
        var sb = new StringBuilder("  ".repeat(indent) + "📁 " + name + " (" + getSize() + "B)");
        for (var c : children) sb.append("\\n").append(c.display(indent + 1));
        return sb.toString();
    }
}`,
        TypeScript: `interface FileSystemEntry {
  getSize(): number;
  display(indent?: number): string;
}

class File implements FileSystemEntry {
  constructor(public name: string, private bytes: number) {}
  getSize() { return this.bytes; }
  display(indent = 0) { return "  ".repeat(indent) + \`📄 \${this.name} (\${this.bytes}B)\`; }
}

class Directory implements FileSystemEntry {
  private children: FileSystemEntry[] = [];
  constructor(public name: string) {}

  add(entry: FileSystemEntry) { this.children.push(entry); }
  getSize(): number { return this.children.reduce((s, c) => s + c.getSize(), 0); }
  display(indent = 0): string {
    const header = "  ".repeat(indent) + \`📁 \${this.name} (\${this.getSize()}B)\`;
    return [header, ...this.children.map(c => c.display(indent + 1))].join("\\n");
  }
}

// ── Usage ──
const root = new Directory("src");
root.add(new File("index.ts", 1200));
const comps = new Directory("components");
comps.add(new File("Button.tsx", 800));
root.add(comps);
console.log(root.display());`,
        Rust: `trait FileSystemEntry {
    fn get_size(&self) -> usize;
    fn display(&self, indent: usize) -> String;
}

struct File { name: String, size: usize }
impl FileSystemEntry for File {
    fn get_size(&self) -> usize { self.size }
    fn display(&self, indent: usize) -> String {
        format!("{}📄 {} ({}B)", "  ".repeat(indent), self.name, self.size)
    }
}

struct Directory { name: String, children: Vec<Box<dyn FileSystemEntry>> }
impl Directory {
    fn new(name: &str) -> Self { Self { name: name.into(), children: vec![] } }
    fn add(&mut self, entry: Box<dyn FileSystemEntry>) { self.children.push(entry); }
}
impl FileSystemEntry for Directory {
    fn get_size(&self) -> usize { self.children.iter().map(|c| c.get_size()).sum() }
    fn display(&self, indent: usize) -> String {
        let header = format!("{}📁 {} ({}B)", "  ".repeat(indent), self.name, self.get_size());
        let children: Vec<String> = self.children.iter().map(|c| c.display(indent + 1)).collect();
        if children.is_empty() { header } else { format!("{}\\n{}", header, children.join("\\n")) }
    }
}

fn main() {
    let mut root = Directory::new("src");
    root.add(Box::new(File { name: "index.ts".into(), size: 1200 }));
    let mut comps = Directory::new("components");
    comps.add(Box::new(File { name: "Button.tsx".into(), size: 800 }));
    root.add(Box::new(comps));
    println!("{}", root.display(0));
}`,
      },
      considerations: [
        "Thread safety for concurrent tree modifications — use read-write locks",
        "Consider implementing Iterator for tree traversal (DFS, BFS)",
        "Avoid cycles — directories pointing to their ancestors would cause infinite recursion",
        "Cache computed sizes for large trees — invalidate on add/remove",
        "Type-safe add() — only Composite should have add/remove; leaves should not",
      ],
    },
    {
      id: 2,
      title: "E-Commerce — Product Bundle Pricing",
      domain: "E-Commerce",
      problem:
        "Products can be sold individually or in bundles. Bundles can contain products and sub-bundles. Calculating total price, applying discounts, and rendering cart summaries must work uniformly regardless of nesting depth.",
      solution:
        "Both Product and Bundle implement PriceItem. Bundle.getPrice() sums children and applies a bundle discount. The cart just calls getPrice() on each item.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="140" y="10" width="140" height="40" class="s-box s-diagram-box"/>
  <text x="210" y="34" text-anchor="middle" class="s-title s-diagram-title">PriceItem</text>
  <rect x="10" y="90" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="80" y="108" text-anchor="middle" class="s-title s-diagram-title">Product</text>
  <line x1="10" y1="112" x2="150" y2="112" class="s-diagram-line"/>
  <text x="18" y="128" class="s-member s-diagram-member">-price: number</text>
  <text x="18" y="140" class="s-member s-diagram-member">+getPrice(): number</text>
  <rect x="200" y="90" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="300" y="108" text-anchor="middle" class="s-title s-diagram-title">Bundle</text>
  <line x1="200" y1="112" x2="400" y2="112" class="s-diagram-line"/>
  <text x="208" y="128" class="s-member s-diagram-member">-items: PriceItem[]</text>
  <text x="208" y="140" class="s-member s-diagram-member">+getPrice(): number</text>
</svg>`,
      code: {
        Python: `class PriceItem:
    def get_price(self) -> float: ...
    def describe(self, indent: int = 0) -> str: ...

class Product(PriceItem):
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    def get_price(self) -> float:
        return self.price

    def describe(self, indent: int = 0) -> str:
        return f"{'  ' * indent}{self.name}: \${self.price:.2f}"

class Bundle(PriceItem):
    def __init__(self, name: str, discount: float = 0.1):
        self.name = name
        self.discount = discount
        self._items: list[PriceItem] = []

    def add(self, item: PriceItem) -> None:
        self._items.append(item)

    def get_price(self) -> float:
        total = sum(item.get_price() for item in self._items)
        return total * (1 - self.discount)

    def describe(self, indent: int = 0) -> str:
        lines = [f"{'  ' * indent}📦 {self.name} (\${self.get_price():.2f})"]
        for item in self._items:
            lines.append(item.describe(indent + 1))
        return "\\n".join(lines)

# ── Usage ──
gaming = Bundle("Gaming Bundle", discount=0.15)
gaming.add(Product("Keyboard", 79.99))
gaming.add(Product("Mouse", 49.99))
gaming.add(Product("Headset", 89.99))

mega = Bundle("Mega Bundle", discount=0.05)
mega.add(gaming)
mega.add(Product("Monitor", 399.99))

print(mega.describe())
print(f"Total: \${mega.get_price():.2f}")`,
        Go: `package main

import "fmt"

type PriceItem interface {
	GetPrice() float64
	Describe(indent int) string
}

type Product struct{ Name string; Price float64 }
func (p *Product) GetPrice() float64 { return p.Price }
func (p *Product) Describe(indent int) string {
	return fmt.Sprintf("%*s%s: $%.2f", indent*2, "", p.Name, p.Price)
}

type Bundle struct {
	Name     string
	Discount float64
	Items    []PriceItem
}
func (b *Bundle) Add(item PriceItem) { b.Items = append(b.Items, item) }
func (b *Bundle) GetPrice() float64 {
	total := 0.0
	for _, i := range b.Items { total += i.GetPrice() }
	return total * (1 - b.Discount)
}
func (b *Bundle) Describe(indent int) string {
	s := fmt.Sprintf("%*s📦 %s ($%.2f)", indent*2, "", b.Name, b.GetPrice())
	for _, i := range b.Items { s += "\\n" + i.Describe(indent+1) }
	return s
}

func main() {
	gaming := &Bundle{Name: "Gaming", Discount: 0.15}
	gaming.Add(&Product{"Keyboard", 79.99})
	gaming.Add(&Product{"Mouse", 49.99})
	mega := &Bundle{Name: "Mega", Discount: 0.05}
	mega.Add(gaming)
	mega.Add(&Product{"Monitor", 399.99})
	fmt.Println(mega.Describe(0))
}`,
        Java: `import java.util.*;

interface PriceItem {
    double getPrice();
    String describe(int indent);
}

class Product implements PriceItem {
    String name; double price;
    Product(String name, double price) { this.name = name; this.price = price; }
    public double getPrice() { return price; }
    public String describe(int indent) {
        return "  ".repeat(indent) + name + ": $" + String.format("%.2f", price);
    }
}

class Bundle implements PriceItem {
    String name; double discount;
    List<PriceItem> items = new ArrayList<>();
    Bundle(String name, double discount) { this.name = name; this.discount = discount; }
    void add(PriceItem item) { items.add(item); }
    public double getPrice() {
        return items.stream().mapToDouble(PriceItem::getPrice).sum() * (1 - discount);
    }
    public String describe(int indent) {
        var sb = new StringBuilder("  ".repeat(indent) + "📦 " + name + " ($" + String.format("%.2f", getPrice()) + ")");
        for (var item : items) sb.append("\\n").append(item.describe(indent + 1));
        return sb.toString();
    }
}`,
        TypeScript: `interface PriceItem { getPrice(): number; describe(indent?: number): string; }

class Product implements PriceItem {
  constructor(public name: string, private price: number) {}
  getPrice() { return this.price; }
  describe(indent = 0) { return "  ".repeat(indent) + \`\${this.name}: $\${this.price.toFixed(2)}\`; }
}

class Bundle implements PriceItem {
  private items: PriceItem[] = [];
  constructor(public name: string, private discount = 0.1) {}
  add(item: PriceItem) { this.items.push(item); }
  getPrice() { return this.items.reduce((s, i) => s + i.getPrice(), 0) * (1 - this.discount); }
  describe(indent = 0) {
    return ["  ".repeat(indent) + \`📦 \${this.name} ($\${this.getPrice().toFixed(2)})\`,
      ...this.items.map(i => i.describe(indent + 1))].join("\\n");
  }
}

// ── Usage ──
const gaming = new Bundle("Gaming Bundle", 0.15);
gaming.add(new Product("Keyboard", 79.99));
gaming.add(new Product("Mouse", 49.99));
console.log(gaming.describe());`,
        Rust: `trait PriceItem {
    fn get_price(&self) -> f64;
    fn describe(&self, indent: usize) -> String;
}

struct Product { name: String, price: f64 }
impl PriceItem for Product {
    fn get_price(&self) -> f64 { self.price }
    fn describe(&self, indent: usize) -> String {
        format!("{}{}: \${:.2}", "  ".repeat(indent), self.name, self.price)
    }
}

struct Bundle { name: String, discount: f64, items: Vec<Box<dyn PriceItem>> }
impl Bundle {
    fn add(&mut self, item: Box<dyn PriceItem>) { self.items.push(item); }
}
impl PriceItem for Bundle {
    fn get_price(&self) -> f64 {
        self.items.iter().map(|i| i.get_price()).sum::<f64>() * (1.0 - self.discount)
    }
    fn describe(&self, indent: usize) -> String {
        let header = format!("{}📦 {} (\${:.2})", "  ".repeat(indent), self.name, self.get_price());
        let children: Vec<String> = self.items.iter().map(|i| i.describe(indent + 1)).collect();
        format!("{}\\n{}", header, children.join("\\n"))
    }
}

fn main() {
    let mut b = Bundle { name: "Gaming".into(), discount: 0.15, items: vec![] };
    b.add(Box::new(Product { name: "Keyboard".into(), price: 79.99 }));
    b.add(Box::new(Product { name: "Mouse".into(), price: 49.99 }));
    println!("{}", b.describe(0));
}`,
      },
      considerations: [
        "Discount stacking rules — should nested bundle discounts compound or be mutually exclusive?",
        "Tax calculation at the leaf vs. aggregate level",
        "Inventory: does a bundle reduce stock of individual products?",
        "Circular references — prevent a bundle from containing itself",
        "Serialization to JSON for cart persistence — needs type discriminator",
      ],
    },
    {
      id: 3,
      title: "Organization — Department Budget Calculator",
      domain: "Enterprise / HR",
      problem:
        "An organization has employees with salaries and departments that contain employees and sub-departments. Computing the total salary budget for any department must recursively include all nested sub-departments.",
      solution:
        "Both Employee and Department implement OrgUnit with getCost(). Department aggregates all children's costs.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="140" y="10" width="140" height="40" class="s-box s-diagram-box"/>
  <text x="210" y="34" text-anchor="middle" class="s-title s-diagram-title">OrgUnit</text>
  <rect x="10" y="90" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="80" y="108" text-anchor="middle" class="s-title s-diagram-title">Employee</text>
  <line x1="10" y1="112" x2="150" y2="112" class="s-diagram-line"/>
  <text x="18" y="128" class="s-member s-diagram-member">-salary: number</text>
  <text x="18" y="140" class="s-member s-diagram-member">+getCost(): number</text>
  <rect x="200" y="90" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="300" y="108" text-anchor="middle" class="s-title s-diagram-title">Department</text>
  <line x1="200" y1="112" x2="400" y2="112" class="s-diagram-line"/>
  <text x="208" y="128" class="s-member s-diagram-member">-members: OrgUnit[]</text>
  <text x="208" y="140" class="s-member s-diagram-member">+getCost(): number</text>
</svg>`,
      code: {
        Python: `class OrgUnit:
    def get_cost(self) -> float: ...
    def headcount(self) -> int: ...

class Employee(OrgUnit):
    def __init__(self, name: str, salary: float):
        self.name = name
        self.salary = salary
    def get_cost(self) -> float: return self.salary
    def headcount(self) -> int: return 1

class Department(OrgUnit):
    def __init__(self, name: str):
        self.name = name
        self._members: list[OrgUnit] = []
    def add(self, unit: OrgUnit) -> None: self._members.append(unit)
    def get_cost(self) -> float: return sum(m.get_cost() for m in self._members)
    def headcount(self) -> int: return sum(m.headcount() for m in self._members)

# ── Usage ──
eng = Department("Engineering")
eng.add(Employee("Alice", 150_000))
eng.add(Employee("Bob", 140_000))
fe = Department("Frontend")
fe.add(Employee("Carol", 130_000))
eng.add(fe)
print(f"Engineering budget: \${eng.get_cost():,.0f}")  # $420,000
print(f"Headcount: {eng.headcount()}")  # 3`,
        Go: `package main

import "fmt"

type OrgUnit interface {
	GetCost() float64
	Headcount() int
}

type Employee struct{ Name string; Salary float64 }
func (e *Employee) GetCost() float64 { return e.Salary }
func (e *Employee) Headcount() int { return 1 }

type Department struct{ Name string; Members []OrgUnit }
func (d *Department) Add(u OrgUnit) { d.Members = append(d.Members, u) }
func (d *Department) GetCost() float64 {
	total := 0.0
	for _, m := range d.Members { total += m.GetCost() }
	return total
}
func (d *Department) Headcount() int {
	n := 0
	for _, m := range d.Members { n += m.Headcount() }
	return n
}

func main() {
	eng := &Department{Name: "Engineering"}
	eng.Add(&Employee{"Alice", 150000})
	eng.Add(&Employee{"Bob", 140000})
	fmt.Printf("Budget: $%.0f, Headcount: %d\\n", eng.GetCost(), eng.Headcount())
}`,
        Java: `import java.util.*;

interface OrgUnit { double getCost(); int headcount(); }

class Employee implements OrgUnit {
    String name; double salary;
    Employee(String name, double salary) { this.name = name; this.salary = salary; }
    public double getCost() { return salary; }
    public int headcount() { return 1; }
}

class Department implements OrgUnit {
    String name;
    List<OrgUnit> members = new ArrayList<>();
    Department(String name) { this.name = name; }
    void add(OrgUnit u) { members.add(u); }
    public double getCost() { return members.stream().mapToDouble(OrgUnit::getCost).sum(); }
    public int headcount() { return members.stream().mapToInt(OrgUnit::headcount).sum(); }
}`,
        TypeScript: `interface OrgUnit { getCost(): number; headcount(): number; }

class Employee implements OrgUnit {
  constructor(public name: string, private salary: number) {}
  getCost() { return this.salary; }
  headcount() { return 1; }
}

class Department implements OrgUnit {
  private members: OrgUnit[] = [];
  constructor(public name: string) {}
  add(unit: OrgUnit) { this.members.push(unit); }
  getCost() { return this.members.reduce((s, m) => s + m.getCost(), 0); }
  headcount() { return this.members.reduce((s, m) => s + m.headcount(), 0); }
}

// ── Usage ──
const eng = new Department("Engineering");
eng.add(new Employee("Alice", 150_000));
const fe = new Department("Frontend");
fe.add(new Employee("Carol", 130_000));
eng.add(fe);
console.log(\`Budget: $\${eng.getCost().toLocaleString()}\`);`,
        Rust: `trait OrgUnit {
    fn get_cost(&self) -> f64;
    fn headcount(&self) -> usize;
}

struct Employee { name: String, salary: f64 }
impl OrgUnit for Employee {
    fn get_cost(&self) -> f64 { self.salary }
    fn headcount(&self) -> usize { 1 }
}

struct Department { name: String, members: Vec<Box<dyn OrgUnit>> }
impl Department {
    fn new(name: &str) -> Self { Self { name: name.into(), members: vec![] } }
    fn add(&mut self, unit: Box<dyn OrgUnit>) { self.members.push(unit); }
}
impl OrgUnit for Department {
    fn get_cost(&self) -> f64 { self.members.iter().map(|m| m.get_cost()).sum() }
    fn headcount(&self) -> usize { self.members.iter().map(|m| m.headcount()).sum() }
}

fn main() {
    let mut eng = Department::new("Engineering");
    eng.add(Box::new(Employee { name: "Alice".into(), salary: 150000.0 }));
    println!("Budget: \${:.0}, HC: {}", eng.get_cost(), eng.headcount());
}`,
      },
      considerations: [
        "An employee can belong to only one department (tree, not graph)",
        "Reporting should include breakdown by sub-department",
        "Consider additional aggregations: average salary, max salary per dept",
        "Real HR systems may need matrix reporting — this is strictly hierarchical",
        "Performance: cache aggregated costs and invalidate on structural changes",
      ],
    },
    {
      id: 4,
      title: "UI Library — Rendering Widget Trees",
      domain: "Frontend / Desktop",
      problem:
        "A UI framework has primitive widgets (Button, TextBox) and container widgets (Panel, ScrollView) that hold child widgets. render() must produce output for any subtree without the client knowing whether it's a leaf or a container.",
      solution:
        "Both Widget and Container implement Renderable. Container.render() renders itself then recursively renders children within its layout bounds.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="140" y="10" width="140" height="40" class="s-box s-diagram-box"/>
  <text x="210" y="34" text-anchor="middle" class="s-title s-diagram-title">Renderable</text>
  <rect x="10" y="90" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="75" y="108" text-anchor="middle" class="s-title s-diagram-title">Button</text>
  <line x1="10" y1="112" x2="140" y2="112" class="s-diagram-line"/>
  <text x="18" y="128" class="s-member s-diagram-member">-label: string</text>
  <text x="18" y="140" class="s-member s-diagram-member">+render(): HTML</text>
  <rect x="200" y="90" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="300" y="108" text-anchor="middle" class="s-title s-diagram-title">Panel</text>
  <line x1="200" y1="112" x2="400" y2="112" class="s-diagram-line"/>
  <text x="208" y="128" class="s-member s-diagram-member">-children: Renderable[]</text>
  <text x="208" y="140" class="s-member s-diagram-member">+render(): HTML</text>
</svg>`,
      code: {
        Python: `class Renderable:
    def render(self) -> str: ...

class Button(Renderable):
    def __init__(self, label: str):
        self.label = label
    def render(self) -> str:
        return f"<button>{self.label}</button>"

class TextBox(Renderable):
    def __init__(self, placeholder: str):
        self.placeholder = placeholder
    def render(self) -> str:
        return f'<input placeholder="{self.placeholder}"/>'

class Panel(Renderable):
    def __init__(self, css_class: str = "panel"):
        self.css_class = css_class
        self._children: list[Renderable] = []
    def add(self, child: Renderable) -> None:
        self._children.append(child)
    def render(self) -> str:
        inner = "".join(c.render() for c in self._children)
        return f'<div class="{self.css_class}">{inner}</div>'

# ── Usage ──
form = Panel("form")
form.add(TextBox("Name"))
form.add(TextBox("Email"))
form.add(Button("Submit"))
sidebar = Panel("sidebar")
sidebar.add(Button("Dashboard"))
sidebar.add(form)
print(sidebar.render())`,
        Go: `package main

import (
	"fmt"
	"strings"
)

type Renderable interface{ Render() string }

type Button struct{ Label string }
func (b *Button) Render() string { return "<button>" + b.Label + "</button>" }

type Panel struct {
	Class    string
	Children []Renderable
}
func (p *Panel) Add(c Renderable) { p.Children = append(p.Children, c) }
func (p *Panel) Render() string {
	var parts []string
	for _, c := range p.Children { parts = append(parts, c.Render()) }
	return fmt.Sprintf("<div class=\\"%s\\">%s</div>", p.Class, strings.Join(parts, ""))
}

func main() {
	form := &Panel{Class: "form"}
	form.Add(&Button{"Submit"})
	sidebar := &Panel{Class: "sidebar"}
	sidebar.Add(form)
	fmt.Println(sidebar.Render())
}`,
        Java: `import java.util.*;
import java.util.stream.*;

interface Renderable { String render(); }

class Button implements Renderable {
    String label;
    Button(String label) { this.label = label; }
    public String render() { return "<button>" + label + "</button>"; }
}

class Panel implements Renderable {
    String cssClass;
    List<Renderable> children = new ArrayList<>();
    Panel(String cssClass) { this.cssClass = cssClass; }
    void add(Renderable r) { children.add(r); }
    public String render() {
        String inner = children.stream().map(Renderable::render).collect(Collectors.joining());
        return "<div class=\\"" + cssClass + "\\">" + inner + "</div>";
    }
}`,
        TypeScript: `interface Renderable { render(): string; }

class Button implements Renderable {
  constructor(private label: string) {}
  render() { return \`<button>\${this.label}</button>\`; }
}

class Panel implements Renderable {
  private children: Renderable[] = [];
  constructor(private cssClass: string) {}
  add(child: Renderable) { this.children.push(child); }
  render() {
    const inner = this.children.map(c => c.render()).join("");
    return \`<div class="\${this.cssClass}">\${inner}</div>\`;
  }
}

// ── Usage ──
const form = new Panel("form");
form.add(new Button("Submit"));
const sidebar = new Panel("sidebar");
sidebar.add(form);
console.log(sidebar.render());`,
        Rust: `trait Renderable { fn render(&self) -> String; }

struct Button { label: String }
impl Renderable for Button {
    fn render(&self) -> String { format!("<button>{}</button>", self.label) }
}

struct Panel { class: String, children: Vec<Box<dyn Renderable>> }
impl Panel {
    fn new(class: &str) -> Self { Self { class: class.into(), children: vec![] } }
    fn add(&mut self, child: Box<dyn Renderable>) { self.children.push(child); }
}
impl Renderable for Panel {
    fn render(&self) -> String {
        let inner: String = self.children.iter().map(|c| c.render()).collect();
        format!("<div class=\\\"{}\\\">{}</div>", self.class, inner)
    }
}

fn main() {
    let mut panel = Panel::new("form");
    panel.add(Box::new(Button { label: "Submit".into() }));
    println!("{}", panel.render());
}`,
      },
      considerations: [
        "Layout algorithms (flex, grid) add complexity to composite rendering",
        "Event bubbling — clicks on a child should propagate up the tree",
        "Z-index ordering for overlapping widgets",
        "Lazy rendering — skip off-screen subtrees for performance",
        "Accessibility: composite must aggregate ARIA attributes from children",
      ],
    },
    {
      id: 5,
      title: "Rules Engine — Composite Boolean Expressions",
      domain: "Business Rules",
      problem:
        "A rules engine needs to evaluate complex conditions like (price > 100 AND (category = 'electronics' OR customer.isVIP)). Hard-coding nested if/else is rigid and can't be modified at runtime.",
      solution:
        "Atomic conditions and composite conditions (AND, OR, NOT) all implement Expression. Complex rules are built as trees of expressions and evaluated recursively.",
      classDiagramSvg: `<svg viewBox="0 0 450 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:450px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="140" y="10" width="170" height="40" class="s-box s-diagram-box"/>
  <text x="225" y="34" text-anchor="middle" class="s-title s-diagram-title">Expression</text>
  <rect x="10" y="90" width="120" height="55" class="s-box s-diagram-box"/>
  <text x="70" y="108" text-anchor="middle" class="s-title s-diagram-title">Condition</text>
  <line x1="10" y1="112" x2="130" y2="112" class="s-diagram-line"/>
  <text x="18" y="128" class="s-member s-diagram-member">-predicate: Fn</text>
  <text x="18" y="140" class="s-member s-diagram-member">+evaluate(): bool</text>
  <rect x="160" y="90" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="225" y="108" text-anchor="middle" class="s-title s-diagram-title">AndExpression</text>
  <line x1="160" y1="112" x2="290" y2="112" class="s-diagram-line"/>
  <text x="168" y="128" class="s-member s-diagram-member">-exprs: Expression[]</text>
  <text x="168" y="140" class="s-member s-diagram-member">+evaluate(): bool</text>
  <rect x="320" y="90" width="120" height="55" class="s-box s-diagram-box"/>
  <text x="380" y="108" text-anchor="middle" class="s-title s-diagram-title">OrExpression</text>
  <line x1="320" y1="112" x2="440" y2="112" class="s-diagram-line"/>
  <text x="328" y="128" class="s-member s-diagram-member">-exprs: Expression[]</text>
  <text x="328" y="140" class="s-member s-diagram-member">+evaluate(): bool</text>
</svg>`,
      code: {
        Python: `from typing import Any

class Expression:
    def evaluate(self, ctx: dict[str, Any]) -> bool: ...

class Condition(Expression):
    def __init__(self, field: str, op: str, value: Any):
        self.field = field
        self.op = op
        self.value = value

    def evaluate(self, ctx: dict[str, Any]) -> bool:
        actual = ctx.get(self.field)
        if self.op == "==": return actual == self.value
        if self.op == ">": return actual > self.value
        if self.op == "<": return actual < self.value
        return False

class AndExpression(Expression):
    def __init__(self, *exprs: Expression):
        self.exprs = list(exprs)
    def evaluate(self, ctx: dict[str, Any]) -> bool:
        return all(e.evaluate(ctx) for e in self.exprs)

class OrExpression(Expression):
    def __init__(self, *exprs: Expression):
        self.exprs = list(exprs)
    def evaluate(self, ctx: dict[str, Any]) -> bool:
        return any(e.evaluate(ctx) for e in self.exprs)

class NotExpression(Expression):
    def __init__(self, expr: Expression):
        self.expr = expr
    def evaluate(self, ctx: dict[str, Any]) -> bool:
        return not self.expr.evaluate(ctx)

# ── Usage: (price > 100 AND (category == "electronics" OR isVIP)) ──
rule = AndExpression(
    Condition("price", ">", 100),
    OrExpression(
        Condition("category", "==", "electronics"),
        Condition("isVIP", "==", True)
    )
)
ctx = {"price": 250, "category": "clothing", "isVIP": True}
print(rule.evaluate(ctx))  # True`,
        Go: `package main

import "fmt"

type Expression interface{ Evaluate(ctx map[string]interface{}) bool }

type Condition struct{ Field, Op string; Value interface{} }
func (c *Condition) Evaluate(ctx map[string]interface{}) bool {
	actual := ctx[c.Field]
	switch c.Op {
	case "==": return actual == c.Value
	case ">": return actual.(int) > c.Value.(int)
	default: return false
	}
}

type AndExpr struct{ Exprs []Expression }
func (a *AndExpr) Evaluate(ctx map[string]interface{}) bool {
	for _, e := range a.Exprs { if !e.Evaluate(ctx) { return false } }
	return true
}

type OrExpr struct{ Exprs []Expression }
func (o *OrExpr) Evaluate(ctx map[string]interface{}) bool {
	for _, e := range o.Exprs { if e.Evaluate(ctx) { return true } }
	return false
}

func main() {
	rule := &AndExpr{[]Expression{
		&Condition{"price", ">", 100},
		&OrExpr{[]Expression{
			&Condition{"category", "==", "electronics"},
			&Condition{"isVIP", "==", true},
		}},
	}}
	ctx := map[string]interface{}{"price": 250, "category": "clothing", "isVIP": true}
	fmt.Println(rule.Evaluate(ctx))
}`,
        Java: `import java.util.*;

interface Expression { boolean evaluate(Map<String, Object> ctx); }

class Condition implements Expression {
    String field, op; Object value;
    Condition(String f, String op, Object v) { this.field = f; this.op = op; this.value = v; }
    public boolean evaluate(Map<String, Object> ctx) {
        Object actual = ctx.get(field);
        if ("==".equals(op)) return value.equals(actual);
        if (">".equals(op)) return ((Integer) actual) > ((Integer) value);
        return false;
    }
}

class AndExpr implements Expression {
    List<Expression> exprs;
    AndExpr(Expression... e) { exprs = List.of(e); }
    public boolean evaluate(Map<String, Object> ctx) { return exprs.stream().allMatch(e -> e.evaluate(ctx)); }
}

class OrExpr implements Expression {
    List<Expression> exprs;
    OrExpr(Expression... e) { exprs = List.of(e); }
    public boolean evaluate(Map<String, Object> ctx) { return exprs.stream().anyMatch(e -> e.evaluate(ctx)); }
}`,
        TypeScript: `interface Expression { evaluate(ctx: Record<string, unknown>): boolean; }

class Condition implements Expression {
  constructor(private field: string, private op: string, private value: unknown) {}
  evaluate(ctx: Record<string, unknown>): boolean {
    const actual = ctx[this.field];
    if (this.op === "==") return actual === this.value;
    if (this.op === ">") return (actual as number) > (this.value as number);
    return false;
  }
}

class AndExpr implements Expression {
  constructor(private exprs: Expression[]) {}
  evaluate(ctx: Record<string, unknown>) { return this.exprs.every(e => e.evaluate(ctx)); }
}

class OrExpr implements Expression {
  constructor(private exprs: Expression[]) {}
  evaluate(ctx: Record<string, unknown>) { return this.exprs.some(e => e.evaluate(ctx)); }
}

// ── Usage ──
const rule = new AndExpr([
  new Condition("price", ">", 100),
  new OrExpr([new Condition("category", "==", "electronics"), new Condition("isVIP", "==", true)])
]);
console.log(rule.evaluate({ price: 250, category: "clothing", isVIP: true }));`,
        Rust: `use std::collections::HashMap;

trait Expression { fn evaluate(&self, ctx: &HashMap<String, String>) -> bool; }

struct Condition { field: String, op: String, value: String }
impl Expression for Condition {
    fn evaluate(&self, ctx: &HashMap<String, String>) -> bool {
        let actual = ctx.get(&self.field).map(|s| s.as_str()).unwrap_or("");
        match self.op.as_str() {
            "==" => actual == self.value,
            ">" => actual.parse::<i64>().unwrap_or(0) > self.value.parse::<i64>().unwrap_or(0),
            _ => false,
        }
    }
}

struct AndExpr { exprs: Vec<Box<dyn Expression>> }
impl Expression for AndExpr {
    fn evaluate(&self, ctx: &HashMap<String, String>) -> bool { self.exprs.iter().all(|e| e.evaluate(ctx)) }
}

struct OrExpr { exprs: Vec<Box<dyn Expression>> }
impl Expression for OrExpr {
    fn evaluate(&self, ctx: &HashMap<String, String>) -> bool { self.exprs.iter().any(|e| e.evaluate(ctx)) }
}

fn main() {
    let ctx = HashMap::from([("price".into(), "250".into()), ("isVIP".into(), "true".into())]);
    let rule = AndExpr { exprs: vec![
        Box::new(Condition { field: "price".into(), op: ">".into(), value: "100".into() }),
        Box::new(Condition { field: "isVIP".into(), op: "==".into(), value: "true".into() }),
    ]};
    println!("{}", rule.evaluate(&ctx));
}`,
      },
      considerations: [
        "Short-circuit evaluation for AND (stop on first false) and OR (stop on first true)",
        "Serialization to/from JSON for runtime rule configuration",
        "Expression visitor for optimization, pretty-printing, or compilation",
        "Guard against deeply nested expressions that could overflow the stack",
        "Consider caching evaluation results for immutable contexts",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Start with Transparent Composite when leaves and composites should be fully interchangeable. Use Safe Composite when you need compile-time safety that only composites have add/remove.",

  variants: [
    {
      id: 1,
      name: "Transparent Composite",
      description:
        "add() and remove() are declared on the Component interface. Both Leaf and Composite have them, but Leaf throws UnsupportedOperationException. Maximizes uniform treatment at the cost of runtime errors.",
      code: {
        Python: `class Component:
    def operation(self) -> int: ...
    def add(self, c: "Component") -> None:
        raise NotImplementedError("Leaf cannot have children")
    def remove(self, c: "Component") -> None:
        raise NotImplementedError("Leaf cannot have children")

class Leaf(Component):
    def __init__(self, value: int):
        self.value = value
    def operation(self) -> int:
        return self.value

class Composite(Component):
    def __init__(self):
        self._children: list[Component] = []
    def add(self, c: Component) -> None:
        self._children.append(c)
    def remove(self, c: Component) -> None:
        self._children.remove(c)
    def operation(self) -> int:
        return sum(c.operation() for c in self._children)`,
        Go: `type Component interface {
	Operation() int
	Add(c Component)
	Remove(c Component)
}

type Leaf struct{ Value int }
func (l *Leaf) Operation() int { return l.Value }
func (l *Leaf) Add(c Component)    { panic("leaf") }
func (l *Leaf) Remove(c Component) { panic("leaf") }

type Composite struct{ Children []Component }
func (c *Composite) Add(child Component)    { c.Children = append(c.Children, child) }
func (c *Composite) Remove(child Component) { /* remove logic */ }
func (c *Composite) Operation() int {
	total := 0
	for _, ch := range c.Children { total += ch.Operation() }
	return total
}`,
        Java: `interface Component {
    int operation();
    default void add(Component c) { throw new UnsupportedOperationException(); }
    default void remove(Component c) { throw new UnsupportedOperationException(); }
}

class Leaf implements Component {
    int value;
    Leaf(int value) { this.value = value; }
    public int operation() { return value; }
}

class Composite implements Component {
    List<Component> children = new ArrayList<>();
    public void add(Component c) { children.add(c); }
    public void remove(Component c) { children.remove(c); }
    public int operation() { return children.stream().mapToInt(Component::operation).sum(); }
}`,
        TypeScript: `interface Component {
  operation(): number;
  add?(child: Component): void;
  remove?(child: Component): void;
}

class Leaf implements Component {
  constructor(private value: number) {}
  operation() { return this.value; }
}

class Composite implements Component {
  private children: Component[] = [];
  add(child: Component) { this.children.push(child); }
  remove(child: Component) { this.children = this.children.filter(c => c !== child); }
  operation() { return this.children.reduce((s, c) => s + c.operation(), 0); }
}`,
        Rust: `trait Component {
    fn operation(&self) -> i32;
    fn add(&mut self, _c: Box<dyn Component>) { panic!("leaf") }
}

struct Leaf(i32);
impl Component for Leaf { fn operation(&self) -> i32 { self.0 } }

struct Composite { children: Vec<Box<dyn Component>> }
impl Component for Composite {
    fn operation(&self) -> i32 { self.children.iter().map(|c| c.operation()).sum() }
    fn add(&mut self, c: Box<dyn Component>) { self.children.push(c); }
}`,
      },
      pros: [
        "Maximum uniformity — clients treat all components identically",
        "No need for type checking or casting",
        "Simplifies client code significantly",
      ],
      cons: [
        "Leaf.add() exists but throws at runtime — violates type safety",
        "Potential for runtime errors that could have been compile-time errors",
        "add/remove on leaves is semantically meaningless",
      ],
    },
    {
      id: 2,
      name: "Safe Composite",
      description:
        "add() and remove() are defined only on the Composite class, not on the Component interface. Type-safe at compile time, but clients must downcast to add children.",
      code: {
        Python: `class Component:
    def operation(self) -> int: ...

class Leaf(Component):
    def __init__(self, value: int):
        self.value = value
    def operation(self) -> int:
        return self.value

class Composite(Component):
    def __init__(self):
        self._children: list[Component] = []
    def add(self, c: Component) -> None:
        self._children.append(c)
    def operation(self) -> int:
        return sum(c.operation() for c in self._children)

# Client must know it's a Composite to call add()
root = Composite()
root.add(Leaf(10))
root.add(Leaf(20))
print(root.operation())  # 30`,
        Go: `type Component interface { Operation() int }

type Leaf struct{ Value int }
func (l *Leaf) Operation() int { return l.Value }

type Composite struct{ children []Component }
func (c *Composite) Add(child Component) { c.children = append(c.children, child) }
func (c *Composite) Operation() int {
	total := 0
	for _, ch := range c.children { total += ch.Operation() }
	return total
}`,
        Java: `interface Component { int operation(); }

class Leaf implements Component {
    int value;
    public int operation() { return value; }
}

class Composite implements Component {
    List<Component> children = new ArrayList<>();
    void add(Component c) { children.add(c); }
    public int operation() { return children.stream().mapToInt(Component::operation).sum(); }
}`,
        TypeScript: `interface Component { operation(): number; }

class Leaf implements Component {
  constructor(private value: number) {}
  operation() { return this.value; }
}

class Composite implements Component {
  private children: Component[] = [];
  add(child: Component) { this.children.push(child); }
  operation() { return this.children.reduce((s, c) => s + c.operation(), 0); }
}`,
        Rust: `trait Component { fn operation(&self) -> i32; }

struct Leaf(i32);
impl Component for Leaf { fn operation(&self) -> i32 { self.0 } }

struct Composite { children: Vec<Box<dyn Component>> }
impl Composite { fn add(&mut self, c: Box<dyn Component>) { self.children.push(c); } }
impl Component for Composite {
    fn operation(&self) -> i32 { self.children.iter().map(|c| c.operation()).sum() }
}`,
      },
      pros: [
        "Compile-time safety — can't call add() on a Leaf",
        "Cleaner interface — no meaningless methods on Leaf",
        "Preferred in strongly-typed languages",
      ],
      cons: [
        "Client must know whether it has a Composite to build the tree",
        "Less uniform treatment during tree construction",
        "May need downcasting in generic tree-building code",
      ],
    },
    {
      id: 3,
      name: "Composite with Visitor",
      description:
        "Combine Composite with the Visitor pattern to add new operations without modifying the tree classes. The Visitor traverses the tree, performing different actions on leaves and composites.",
      code: {
        Python: `class Visitor:
    def visit_leaf(self, leaf: "Leaf") -> None: ...
    def visit_composite(self, composite: "Composite") -> None: ...

class Component:
    def accept(self, visitor: Visitor) -> None: ...

class Leaf(Component):
    def __init__(self, value: int):
        self.value = value
    def accept(self, visitor: Visitor) -> None:
        visitor.visit_leaf(self)

class Composite(Component):
    def __init__(self):
        self.children: list[Component] = []
    def accept(self, visitor: Visitor) -> None:
        visitor.visit_composite(self)
        for child in self.children:
            child.accept(visitor)

class SumVisitor(Visitor):
    def __init__(self):
        self.total = 0
    def visit_leaf(self, leaf):
        self.total += leaf.value
    def visit_composite(self, composite):
        pass  # just traverse

# ── Usage ──
root = Composite()
root.children = [Leaf(10), Leaf(20)]
v = SumVisitor()
root.accept(v)
print(v.total)  # 30`,
        Go: `type Visitor interface {
	VisitLeaf(l *Leaf)
	VisitComposite(c *Composite)
}

type Component interface{ Accept(v Visitor) }

type Leaf struct{ Value int }
func (l *Leaf) Accept(v Visitor) { v.VisitLeaf(l) }

type Composite struct{ Children []Component }
func (c *Composite) Accept(v Visitor) {
	v.VisitComposite(c)
	for _, ch := range c.Children { ch.Accept(v) }
}`,
        Java: `interface Visitor {
    void visitLeaf(Leaf l);
    void visitComposite(Composite c);
}

interface Component { void accept(Visitor v); }

class Leaf implements Component {
    int value;
    public void accept(Visitor v) { v.visitLeaf(this); }
}

class Composite implements Component {
    List<Component> children = new ArrayList<>();
    public void accept(Visitor v) {
        v.visitComposite(this);
        children.forEach(c -> c.accept(v));
    }
}`,
        TypeScript: `interface Visitor {
  visitLeaf(leaf: Leaf): void;
  visitComposite(composite: Composite): void;
}

interface Component { accept(visitor: Visitor): void; }

class Leaf implements Component {
  constructor(public value: number) {}
  accept(v: Visitor) { v.visitLeaf(this); }
}

class Composite implements Component {
  children: Component[] = [];
  accept(v: Visitor) {
    v.visitComposite(this);
    this.children.forEach(c => c.accept(v));
  }
}`,
        Rust: `trait Visitor {
    fn visit_leaf(&mut self, leaf: &Leaf);
    fn visit_composite(&mut self, composite: &Composite);
}

trait Component { fn accept(&self, visitor: &mut dyn Visitor); }

struct Leaf { value: i32 }
impl Component for Leaf { fn accept(&self, v: &mut dyn Visitor) { v.visit_leaf(self); } }

struct Composite { children: Vec<Box<dyn Component>> }
impl Component for Composite {
    fn accept(&self, v: &mut dyn Visitor) {
        v.visit_composite(self);
        for c in &self.children { c.accept(v); }
    }
}`,
      },
      pros: [
        "New operations added without modifying tree classes (Open/Closed Principle)",
        "Clean separation of traversal logic from tree structure",
        "Multiple visitors can extract different data from the same tree",
      ],
      cons: [
        "More complex — adds Visitor interface and double dispatch",
        "Adding new node types requires updating all visitors",
        "Overkill for trees with simple, fixed operations",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Type Safety", "Uniformity", "Complexity", "Best For",
  ],
  comparisonRows: [
    ["Transparent", "Runtime checks", "Maximum", "Low", "Dynamic trees, scripting"],
    ["Safe Composite", "Compile-time", "Moderate", "Low", "Strongly-typed codebases"],
    ["With Visitor", "Compile-time", "Moderate", "High", "Many operations on fixed tree structure"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Structural" },
    {
      aspect: "Key Benefit",
      detail:
        "Clients treat individual objects and compositions uniformly — call getSize() on a file or a directory tree and get the right answer without branching",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Overusing Composite for structures that aren't truly recursive trees. If there's no part-whole hierarchy, Composite adds unnecessary complexity.",
    },
    {
      aspect: "vs. Decorator",
      detail:
        "Decorator wraps a single object to add behaviour. Composite wraps multiple objects (children) to form a tree. They can be combined — a decorated composite.",
    },
    {
      aspect: "vs. Iterator",
      detail:
        "Iterator provides a way to traverse a collection. Composite defines the tree structure. Often used together — iterate over a composite tree.",
    },
    {
      aspect: "When to Use",
      detail:
        "Part-whole hierarchies: file systems, UI widget trees, org charts, menu trees, expression trees, product bundles — any recursive structure where leaves and groups share an interface.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Flat collections, graphs with cycles, or structures where leaves and composites have very different interfaces. Don't force a tree onto a non-hierarchical domain.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Iterator (traverse the tree), Visitor (add operations to the tree), Decorator (add behaviour to a node), Chain of Responsibility (event propagation up the tree)",
    },
  ],

  antiPatterns: [
    {
      name: "Forced Tree on Flat Data",
      description:
        "Using Composite for data that's naturally flat — a list of products or users that don't form a hierarchy. The Composite adds unnecessary nesting and complexity.",
      betterAlternative:
        "Use a simple collection (List, Array). Composite is for recursive hierarchies, not flat collections.",
    },
    {
      name: "Leaky Composite — Exposing Children",
      description:
        "The Composite returns its children list directly, allowing external code to modify the tree structure without going through add()/remove().",
      betterAlternative:
        "Return an immutable view or copy of children. Encapsulate all structural modifications behind add()/remove() methods.",
    },
    {
      name: "Missing Base Case",
      description:
        "A composite operation doesn't handle the empty children case, leading to incorrect results (e.g., sum of empty = undefined instead of 0).",
      betterAlternative:
        "Always define the identity value for aggregation: sum→0, product→1, concat→empty string, any→false, all→true.",
    },
    {
      name: "Circular References",
      description:
        "Adding a composite as a child of its own descendant creates an infinite loop during traversal. The tree becomes a graph with cycles.",
      betterAlternative:
        "Validate on add() that the child isn't an ancestor of the current composite. Maintain a parent reference or use visited-set during traversal.",
    },
    {
      name: "God Component Interface",
      description:
        "The Component interface includes methods specific to Composite (add, remove, getChildren) and methods specific to Leaf (setValue, getLabel). Every class must implement methods that don't apply to it.",
      betterAlternative:
        "Use the Safe Composite approach — keep the Component interface minimal with only shared operations. Add/remove belongs exclusively on Composite.",
    },
  ],
};

export default compositeData;
