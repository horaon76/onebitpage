import { PatternData } from "@/lib/patterns/types";

const commandData: PatternData = {
  slug: "command",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Command Pattern",
  subtitle:
    "Encapsulate a request as an object, containing all the information needed to perform the action — enabling queuing, logging, undo/redo, and deferred execution.",

  intent:
    "Many systems need to issue requests without knowing anything about the operation being requested or the receiver. Hard-coding function calls creates tight coupling between the invoker and the receiver, and makes features like undo, queueing, logging, and macro commands impractical.\n\nThe Command pattern turns a request into a stand-alone object. The Invoker holds a reference to a Command and calls execute(). The Command encapsulates the receiver and the parameters. Since the request is now an object, it can be stored in a history for undo, placed in a queue for deferred execution, logged for auditing, or composed into macro commands.\n\nThis pattern is foundational for event sourcing, CQRS, transaction processing, text editor undo/redo, GUI button actions, and saga orchestration in microservices.",

  classDiagramSvg: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 11px 'JetBrains Mono', monospace; }
    .c-member { font: 10px 'JetBrains Mono', monospace; }
    .c-arr { stroke-width:1.2; fill:none; marker-end:url(#c-arr); }
    .c-dash { stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="c-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="c-arrow-head"/>
    </marker>
  </defs>
  <!-- Invoker -->
  <rect x="10" y="10" width="170" height="70" class="c-box c-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="c-title c-diagram-title">Invoker</text>
  <line x1="10" y1="32" x2="180" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-history: Command[]</text>
  <text x="18" y="63" class="c-member c-diagram-member">+execute(cmd): void</text>
  <text x="18" y="78" class="c-member c-diagram-member">+undo(): void</text>
  <!-- Command Interface -->
  <rect x="240" y="10" width="180" height="55" class="c-box c-diagram-box"/>
  <text x="330" y="28" text-anchor="middle" class="c-title c-diagram-title">&lt;&lt;interface&gt;&gt;</text>
  <text x="330" y="42" text-anchor="middle" class="c-title c-diagram-title">Command</text>
  <line x1="240" y1="45" x2="420" y2="45" class="c-diagram-line"/>
  <text x="248" y="60" class="c-member c-diagram-member">+execute(): void  +undo(): void</text>
  <!-- ConcreteCommand -->
  <rect x="230" y="120" width="140" height="55" class="c-box c-diagram-box"/>
  <text x="300" y="138" text-anchor="middle" class="c-title c-diagram-title">ConcreteCommand</text>
  <line x1="230" y1="142" x2="370" y2="142" class="c-diagram-line"/>
  <text x="238" y="158" class="c-member c-diagram-member">-receiver: Receiver</text>
  <text x="238" y="173" class="c-member c-diagram-member">+execute() +undo()</text>
  <!-- Receiver -->
  <rect x="400" y="120" width="110" height="45" class="c-box c-diagram-box"/>
  <text x="455" y="138" text-anchor="middle" class="c-title c-diagram-title">Receiver</text>
  <line x1="400" y1="142" x2="510" y2="142" class="c-diagram-line"/>
  <text x="408" y="158" class="c-member c-diagram-member">+action()</text>
  <!-- Arrows -->
  <line x1="180" y1="37" x2="240" y2="37" class="c-arr c-diagram-arrow"/>
  <line x1="300" y1="120" x2="330" y2="65" class="c-arr c-diagram-arrow c-dash"/>
  <line x1="370" y1="142" x2="400" y2="142" class="c-arr c-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "The Invoker stores and manages Command objects. The Command interface declares execute() and undo(). ConcreteCommand holds a reference to a Receiver and delegates the actual work to it. The Invoker never knows about the Receiver — it works entirely through the Command interface.",

  diagramComponents: [
    {
      name: "Invoker",
      description:
        "Stores a history of executed commands and triggers their execution. Does not know what the command does — it just calls execute(). Also supports undo() by popping the last command from history.",
    },
    {
      name: "Command (Interface)",
      description:
        "Declares execute() and optionally undo() methods. This is the contract that all concrete commands must fulfill. Enables the Invoker to work with any command polymorphically.",
    },
    {
      name: "ConcreteCommand",
      description:
        "Implements the Command interface. Holds a reference to a Receiver and stores any parameters needed. The execute() method delegates to the Receiver, and undo() reverses the action.",
    },
    {
      name: "Receiver",
      description:
        "The object that performs the actual work. It contains the business logic (e.g., Account.debit(), Document.insertText()). The Command calls Receiver methods; the Invoker never touches the Receiver directly.",
    },
  ],

  solutionDetail:
    "**The Problem:** A system needs to issue requests but shouldn't be coupled to the object performing the request. Features like undo, retry, logging, queuing, and macro commands are needed but hard to implement with direct method calls.\n\n**The Command Solution:** Wrap each request in a Command object that encapsulates the receiver, the method to call, and the arguments.\n\n**How It Works:**\n\n1. **Define the Command interface**: Declares `execute()` and `undo()` methods.\n\n2. **Create ConcreteCommands**: Each encapsulates a specific operation — `TransferFundsCommand`, `InsertTextCommand`, `TurnOnLightCommand`. Stores the receiver reference and any state needed for undo.\n\n3. **Invoker manages commands**: Calls `execute()`, optionally pushes to a history stack for undo, or places in a queue for deferred execution.\n\n4. **Undo**: The undo method reverses the effect by utilizing the saved state.\n\n**Key Insight:** Commands are first-class objects. They can be serialized, transmitted over networks, stored in databases, replayed, composed into macros, and retried on failure. This is the foundation of event sourcing and CQRS.",

  characteristics: [
    "Encapsulates a request as a self-contained object with all parameters",
    "Decouples invoker (who triggers) from receiver (who does the work)",
    "Supports undo/redo by storing command history and reversing effects",
    "Commands can be queued, scheduled, and executed later",
    "Enables macro commands — composing multiple commands into one",
    "Foundation for event sourcing, CQRS, and transaction logs",
    "Commands can be serialized and transmitted across network boundaries",
  ],

  useCases: [
    {
      id: 1,
      title: "Text Editor Undo/Redo",
      domain: "Desktop / IDE",
      description:
        "A text editor records every edit (insert, delete, format) as a command. Users can undo and redo any number of operations.",
      whySingleton:
        "Each edit is a Command with execute() and undo(). The editor's Invoker maintains a history stack for undo and a redo stack for reapplying.",
      code: `interface EditCommand { execute(): void; undo(): void; }
class InsertText implements EditCommand {
  constructor(private doc: Doc, private pos: number, private text: string) {}
  execute() { this.doc.insert(this.pos, this.text); }
  undo() { this.doc.delete(this.pos, this.text.length); }
}`,
    },
    {
      id: 2,
      title: "Transaction Processing Queue",
      domain: "Fintech",
      description:
        "Financial transactions (transfers, refunds, settlements) are queued as commands and processed in order. Failed commands are retried or rolled back.",
      whySingleton:
        "Each transaction type is a Command. The processor queue executes them sequentially. Failed ones go to a dead-letter queue for manual review or automatic retry.",
      code: `class TransferCommand implements Command {
  constructor(private from: Account, private to: Account, private amount: number) {}
  execute() { this.from.debit(this.amount); this.to.credit(this.amount); }
  undo() { this.to.debit(this.amount); this.from.credit(this.amount); }
}`,
    },
    {
      id: 3,
      title: "Smart Home Automation",
      domain: "IoT / Home Automation",
      description:
        "A smart home controller issues commands to devices: turn on lights, set thermostat, lock doors. Commands can be scheduled, grouped into scenes, or undone.",
      whySingleton:
        "Each device action is a Command. Scene commands compose multiple device commands into a macro. The controller executes the scene and can undo all actions at once.",
      code: `class TurnOnLight implements Command {
  constructor(private light: Light) {}
  execute() { this.light.on(); }
  undo() { this.light.off(); }
}
class SceneCommand implements Command {
  constructor(private commands: Command[]) {}
  execute() { this.commands.forEach(c => c.execute()); }
  undo() { this.commands.reverse().forEach(c => c.undo()); }
}`,
    },
    {
      id: 4,
      title: "Database Migration Runner",
      domain: "DevOps / Infrastructure",
      description:
        "Database migrations (add column, create index, alter table) are commands. Each migration has an up() and down() for rollback. The runner applies migrations in order.",
      whySingleton:
        "Each migration is a Command with execute() (apply) and undo() (rollback). The runner tracks which migrations have been applied and can roll back to any point.",
      code: `class AddColumnMigration implements Migration {
  execute() { db.query("ALTER TABLE users ADD COLUMN age INT"); }
  undo() { db.query("ALTER TABLE users DROP COLUMN age"); }
}
runner.applyPending(); // execute all
runner.rollback(2);    // undo last 2`,
    },
    {
      id: 5,
      title: "GUI Button / Menu Actions",
      domain: "Desktop / Web UI",
      description:
        "Toolbar buttons, menu items, and keyboard shortcuts all trigger the same action. Each action is a Command attached to the UI element.",
      whySingleton:
        "The same CopyCommand can be attached to Ctrl+C, the Edit menu, and the toolbar button. The UI elements are Invokers; the Command encapsulates the action.",
      code: `class CopyCommand implements Command {
  constructor(private editor: Editor) {}
  execute() { clipboard.set(this.editor.getSelection()); }
  undo() { /* copy is non-destructive, no undo needed */ }
}
toolbar.setCommand("copy", new CopyCommand(editor));
menu.setCommand("copy", new CopyCommand(editor));`,
    },
    {
      id: 6,
      title: "Saga Orchestration",
      domain: "Microservices",
      description:
        "A distributed saga coordinates steps across services: reserve inventory, charge payment, ship order. Each step is a command with a compensating undo action.",
      whySingleton:
        "Each saga step is a Command. If any step fails, the orchestrator calls undo() on each completed step in reverse order to maintain consistency.",
      code: `class ReserveInventory implements SagaStep {
  execute() { inventoryService.reserve(this.items); }
  undo() { inventoryService.release(this.items); }  // compensating action
}
class ChargePayment implements SagaStep {
  execute() { paymentService.charge(this.amount); }
  undo() { paymentService.refund(this.amount); }
}`,
    },
    {
      id: 7,
      title: "Batch Job Scheduler",
      domain: "Backend / ETL",
      description:
        "ETL jobs (extract, transform, load) are modeled as commands. The scheduler queues them, executes in dependency order, and can rerun failed jobs.",
      whySingleton:
        "Each ETL step is a Command. The scheduler manages a DAG of commands, executing them in topological order. Failed commands can be retried without re-running the entire pipeline.",
      code: `class ExtractCSV implements Command {
  execute() { this.data = readCSV(this.path); }
  undo() { this.data = null; }
}
class TransformData implements Command {
  execute() { this.result = transform(this.input); }
  undo() { this.result = null; }
}
scheduler.add(extract, transform, load);`,
    },
    {
      id: 8,
      title: "Game Action Replay",
      domain: "Gaming",
      description:
        "Player actions (move, attack, build) are recorded as commands. The game can replay actions for replays, synchronize multiplayer state, or undo moves in turn-based games.",
      whySingleton:
        "Each player action is a Command with a timestamp. The replay system re-executes commands in order. Undo rewinds the game state for turn-based corrections.",
      code: `class MoveUnitCommand implements GameCommand {
  constructor(private unit: Unit, private from: Pos, private to: Pos) {}
  execute() { this.unit.moveTo(this.to); }
  undo() { this.unit.moveTo(this.from); }
}
replay.play(commands); // re-execute all in order`,
    },
    {
      id: 9,
      title: "REST API Request Logging",
      domain: "API / Observability",
      description:
        "Every API request is wrapped in a command that logs the request, executes the handler, and records the result. Failed requests are retried from the log.",
      whySingleton:
        "The request handler is a Command. Middleware wraps each request, logging it before and after execution. Failed commands are persisted for retry or dead-letter processing.",
      code: `class APIRequestCommand implements Command {
  constructor(private handler: Handler, private req: Request) {}
  execute() { return this.handler.handle(this.req); }
  undo() { /* log reversal or compensating request */ }
}
logger.record(new APIRequestCommand(handler, req));`,
    },
    {
      id: 10,
      title: "Wizard / Multi-Step Form",
      domain: "Web UI",
      description:
        "A multi-step wizard records each step as a command. Users can go back to previous steps (undo) and re-apply them (redo) without losing data.",
      whySingleton:
        "Each wizard step is a Command that saves form data. Navigating back calls undo() to restore previous state. Forward calls redo() or execute() for new steps.",
      code: `class WizardStep implements Command {
  constructor(private form: FormState, private data: StepData) {}
  execute() { this.form.apply(this.data); }
  undo() { this.form.revert(this.data); }
}
wizard.next(new WizardStep(form, personalInfo));`,
    },
    {
      id: 11,
      title: "Drawing Application",
      domain: "Creative Tools",
      description:
        "A drawing app records every brush stroke, shape, and transform as a command. Full undo history enables reverting to any point in the editing session.",
      whySingleton:
        "Each drawing operation is a Command. The canvas manager maintains the history stack. Undo removes the last stroke; redo reapplies it.",
      code: `class DrawCircle implements Command {
  constructor(private canvas: Canvas, private x: number, private y: number, private r: number) {}
  execute() { this.canvas.drawCircle(this.x, this.y, this.r); }
  undo() { this.canvas.eraseCircle(this.x, this.y, this.r); }
}`,
    },
    {
      id: 12,
      title: "CI/CD Pipeline Steps",
      domain: "DevOps",
      description:
        "CI/CD pipeline stages (build, test, deploy, rollback) are commands. The pipeline runner executes them in sequence. Failed deployments trigger compensating rollback commands.",
      whySingleton:
        "Each pipeline stage is a Command. The runner executes stages in order. If deploy fails, it runs undo() on completed stages to roll back cleanly.",
      code: `class DeployCommand implements PipelineStep {
  execute() { k8s.apply(this.manifest); this.prevVersion = k8s.getCurrentVersion(); }
  undo() { k8s.rollback(this.prevVersion); }
}
pipeline.run([build, test, deploy]);`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Text Editor — Undo/Redo System",
      domain: "Desktop Application",
      problem:
        "A text editor must support unlimited undo and redo. Every operation (insert, delete, replace) must be reversible. The undo system must also support macro recording, where multiple edits are grouped into a single undoable action.",
      solution:
        "Each edit operation implements the Command interface with execute() and undo(). The Editor (Invoker) maintains undo and redo stacks. MacroCommand composes multiple commands into one undoable unit.",
      classDiagramSvg: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 10px 'JetBrains Mono', monospace; }
    .c-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="160" height="55" class="c-box c-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="c-title c-diagram-title">Editor (Invoker)</text>
  <line x1="10" y1="32" x2="170" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-undoStack: Command[]</text>
  <text x="18" y="60" class="c-member c-diagram-member">+execute(cmd)</text>
  <rect x="220" y="10" width="190" height="40" class="c-box c-diagram-box"/>
  <text x="315" y="34" text-anchor="middle" class="c-title c-diagram-title">EditCommand</text>
  <rect x="140" y="100" width="110" height="35" class="c-box c-diagram-box"/>
  <text x="195" y="122" text-anchor="middle" class="c-title c-diagram-title">InsertText</text>
  <rect x="270" y="100" width="110" height="35" class="c-box c-diagram-box"/>
  <text x="325" y="122" text-anchor="middle" class="c-title c-diagram-title">DeleteText</text>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field

class EditCommand(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class Document:
    def __init__(self):
        self.content = ""

    def insert(self, pos: int, text: str) -> None:
        self.content = self.content[:pos] + text + self.content[pos:]

    def delete(self, pos: int, length: int) -> str:
        removed = self.content[pos:pos + length]
        self.content = self.content[:pos] + self.content[pos + length:]
        return removed

@dataclass
class InsertCommand(EditCommand):
    doc: Document
    pos: int
    text: str

    def execute(self) -> None:
        self.doc.insert(self.pos, self.text)

    def undo(self) -> None:
        self.doc.delete(self.pos, len(self.text))

@dataclass
class DeleteCommand(EditCommand):
    doc: Document
    pos: int
    length: int
    deleted_text: str = ""

    def execute(self) -> None:
        self.deleted_text = self.doc.delete(self.pos, self.length)

    def undo(self) -> None:
        self.doc.insert(self.pos, self.deleted_text)

@dataclass
class MacroCommand(EditCommand):
    commands: list[EditCommand] = field(default_factory=list)

    def execute(self) -> None:
        for cmd in self.commands:
            cmd.execute()

    def undo(self) -> None:
        for cmd in reversed(self.commands):
            cmd.undo()

class Editor:
    def __init__(self, doc: Document):
        self.doc = doc
        self.undo_stack: list[EditCommand] = []
        self.redo_stack: list[EditCommand] = []

    def execute(self, cmd: EditCommand) -> None:
        cmd.execute()
        self.undo_stack.append(cmd)
        self.redo_stack.clear()

    def undo(self) -> None:
        if self.undo_stack:
            cmd = self.undo_stack.pop()
            cmd.undo()
            self.redo_stack.append(cmd)

    def redo(self) -> None:
        if self.redo_stack:
            cmd = self.redo_stack.pop()
            cmd.execute()
            self.undo_stack.append(cmd)

# ── Usage ──
doc = Document()
editor = Editor(doc)
editor.execute(InsertCommand(doc, 0, "Hello "))
editor.execute(InsertCommand(doc, 6, "World"))
print(doc.content)  # "Hello World"
editor.undo()
print(doc.content)  # "Hello "
editor.redo()
print(doc.content)  # "Hello World"`,
        Go: `package main

import "fmt"

type Command interface {
	Execute()
	Undo()
}

type Document struct{ Content string }

func (d *Document) Insert(pos int, text string) {
	d.Content = d.Content[:pos] + text + d.Content[pos:]
}
func (d *Document) Delete(pos, length int) string {
	removed := d.Content[pos : pos+length]
	d.Content = d.Content[:pos] + d.Content[pos+length:]
	return removed
}

type InsertCmd struct {
	Doc  *Document
	Pos  int
	Text string
}
func (c *InsertCmd) Execute() { c.Doc.Insert(c.Pos, c.Text) }
func (c *InsertCmd) Undo()    { c.Doc.Delete(c.Pos, len(c.Text)) }

type DeleteCmd struct {
	Doc     *Document
	Pos     int
	Length  int
	Deleted string
}
func (c *DeleteCmd) Execute() { c.Deleted = c.Doc.Delete(c.Pos, c.Length) }
func (c *DeleteCmd) Undo()    { c.Doc.Insert(c.Pos, c.Deleted) }

type Editor struct {
	Doc       *Document
	UndoStack []Command
	RedoStack []Command
}
func (e *Editor) Execute(cmd Command) {
	cmd.Execute()
	e.UndoStack = append(e.UndoStack, cmd)
	e.RedoStack = nil
}
func (e *Editor) Undo() {
	if n := len(e.UndoStack); n > 0 {
		cmd := e.UndoStack[n-1]
		e.UndoStack = e.UndoStack[:n-1]
		cmd.Undo()
		e.RedoStack = append(e.RedoStack, cmd)
	}
}

func main() {
	doc := &Document{}
	ed := &Editor{Doc: doc}
	ed.Execute(&InsertCmd{doc, 0, "Hello "})
	ed.Execute(&InsertCmd{doc, 6, "World"})
	fmt.Println(doc.Content) // "Hello World"
	ed.Undo()
	fmt.Println(doc.Content) // "Hello "
}`,
        Java: `import java.util.*;

interface EditCommand {
    void execute();
    void undo();
}

class Document {
    StringBuilder content = new StringBuilder();
    void insert(int pos, String text) { content.insert(pos, text); }
    String delete(int pos, int length) {
        String removed = content.substring(pos, pos + length);
        content.delete(pos, pos + length);
        return removed;
    }
}

class InsertCommand implements EditCommand {
    Document doc; int pos; String text;
    InsertCommand(Document d, int p, String t) { doc = d; pos = p; text = t; }
    public void execute() { doc.insert(pos, text); }
    public void undo() { doc.delete(pos, text.length()); }
}

class DeleteCommand implements EditCommand {
    Document doc; int pos; int length; String deleted = "";
    DeleteCommand(Document d, int p, int l) { doc = d; pos = p; length = l; }
    public void execute() { deleted = doc.delete(pos, length); }
    public void undo() { doc.insert(pos, deleted); }
}

class Editor {
    Deque<EditCommand> undoStack = new ArrayDeque<>();
    Deque<EditCommand> redoStack = new ArrayDeque<>();
    void execute(EditCommand cmd) {
        cmd.execute();
        undoStack.push(cmd);
        redoStack.clear();
    }
    void undo() {
        if (!undoStack.isEmpty()) {
            var cmd = undoStack.pop();
            cmd.undo();
            redoStack.push(cmd);
        }
    }
}`,
        TypeScript: `interface EditCommand {
  execute(): void;
  undo(): void;
}

class Document {
  content = "";
  insert(pos: number, text: string) {
    this.content = this.content.slice(0, pos) + text + this.content.slice(pos);
  }
  delete(pos: number, length: number): string {
    const removed = this.content.slice(pos, pos + length);
    this.content = this.content.slice(0, pos) + this.content.slice(pos + length);
    return removed;
  }
}

class InsertCommand implements EditCommand {
  constructor(private doc: Document, private pos: number, private text: string) {}
  execute() { this.doc.insert(this.pos, this.text); }
  undo() { this.doc.delete(this.pos, this.text.length); }
}

class DeleteCommand implements EditCommand {
  private deleted = "";
  constructor(private doc: Document, private pos: number, private length: number) {}
  execute() { this.deleted = this.doc.delete(this.pos, this.length); }
  undo() { this.doc.insert(this.pos, this.deleted); }
}

class Editor {
  private undoStack: EditCommand[] = [];
  private redoStack: EditCommand[] = [];
  constructor(private doc: Document) {}

  execute(cmd: EditCommand) {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack = [];
  }
  undo() {
    const cmd = this.undoStack.pop();
    if (cmd) { cmd.undo(); this.redoStack.push(cmd); }
  }
  redo() {
    const cmd = this.redoStack.pop();
    if (cmd) { cmd.execute(); this.undoStack.push(cmd); }
  }
}

// ── Usage ──
const doc = new Document();
const editor = new Editor(doc);
editor.execute(new InsertCommand(doc, 0, "Hello "));
editor.execute(new InsertCommand(doc, 6, "World"));
console.log(doc.content); // "Hello World"
editor.undo();
console.log(doc.content); // "Hello "`,
        Rust: `trait Command { fn execute(&mut self); fn undo(&mut self); }

struct Document { content: String }
impl Document {
    fn insert(&mut self, pos: usize, text: &str) {
        self.content.insert_str(pos, text);
    }
    fn delete(&mut self, pos: usize, len: usize) -> String {
        let removed: String = self.content[pos..pos + len].to_string();
        self.content = format!("{}{}", &self.content[..pos], &self.content[pos + len..]);
        removed
    }
}

struct InsertCmd { pos: usize, text: String }
struct DeleteCmd { pos: usize, len: usize, deleted: String }

// In Rust, Command pattern often uses enum dispatch or closures
// due to borrow checker constraints with shared mutable state.
// A common approach is using Rc<RefCell<Document>>.

enum EditCmd {
    Insert { pos: usize, text: String },
    Delete { pos: usize, len: usize, deleted: String },
}

impl EditCmd {
    fn execute(&mut self, doc: &mut Document) {
        match self {
            EditCmd::Insert { pos, text } => doc.insert(*pos, text),
            EditCmd::Delete { pos, len, deleted } => {
                *deleted = doc.delete(*pos, *len);
            }
        }
    }
    fn undo(&self, doc: &mut Document) {
        match self {
            EditCmd::Insert { pos, text } => { doc.delete(*pos, text.len()); }
            EditCmd::Delete { pos, deleted, .. } => doc.insert(*pos, deleted),
        }
    }
}

fn main() {
    let mut doc = Document { content: String::new() };
    let mut cmd = EditCmd::Insert { pos: 0, text: "Hello".into() };
    cmd.execute(&mut doc);
    println!("{}", doc.content); // "Hello"
    cmd.undo(&mut doc);
    println!("{}", doc.content); // ""
}`,
      },
      considerations: [
        "Undo stack can grow unbounded — consider limiting history size",
        "MacroCommand composes multiple commands into a single undoable unit",
        "Redo stack is cleared when a new command is executed after an undo",
        "Memento pattern can complement Command for state snapshots",
        "For collaborative editing, commands need conflict resolution (OT/CRDT)",
      ],
    },
    {
      id: 2,
      title: "Transaction Processing — Financial Commands",
      domain: "Fintech",
      problem:
        "A banking platform processes fund transfers, refunds, and batch settlements. Operations must be queued during peak load, support dispute-resolution undo, and provide a complete audit trail for regulatory compliance.",
      solution:
        "Each financial operation is a Command. The TransactionProcessor (Invoker) queues commands, executes them in order, and maintains a history for undo/dispute reversal.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 10px 'JetBrains Mono', monospace; }
    .c-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="160" height="55" class="c-box c-diagram-box"/>
  <text x="90" y="28" text-anchor="middle" class="c-title c-diagram-title">Processor</text>
  <line x1="10" y1="32" x2="170" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-history: TxCommand[]</text>
  <text x="18" y="60" class="c-member c-diagram-member">+submit(cmd)</text>
  <rect x="220" y="10" width="190" height="40" class="c-box c-diagram-box"/>
  <text x="315" y="34" text-anchor="middle" class="c-title c-diagram-title">TransactionCommand</text>
  <rect x="220" y="80" width="90" height="35" class="c-box c-diagram-box"/>
  <text x="265" y="102" text-anchor="middle" class="c-title c-diagram-title">Transfer</text>
  <rect x="330" y="80" width="90" height="35" class="c-box c-diagram-box"/>
  <text x="375" y="102" text-anchor="middle" class="c-title c-diagram-title">Refund</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass, field

class Account:
    def __init__(self, id: str, balance: float = 0):
        self.id = id
        self.balance = balance
    def debit(self, amount: float):
        if self.balance < amount:
            raise ValueError(f"Insufficient funds in {self.id}")
        self.balance -= amount
    def credit(self, amount: float):
        self.balance += amount

class TxCommand(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

@dataclass
class TransferCommand(TxCommand):
    source: Account
    dest: Account
    amount: float
    def execute(self):
        self.source.debit(self.amount)
        self.dest.credit(self.amount)
        print(f"Transfer \${self.amount:.2f}: {self.source.id} -> {self.dest.id}")
    def undo(self):
        self.dest.debit(self.amount)
        self.source.credit(self.amount)
        print(f"Reversed \${self.amount:.2f}")

class TransactionProcessor:
    def __init__(self):
        self.history: list[TxCommand] = []
    def submit(self, cmd: TxCommand):
        cmd.execute()
        self.history.append(cmd)
    def dispute_undo(self):
        if self.history:
            self.history.pop().undo()

checking = Account("CHK-1001", 5000)
merchant = Account("MER-2002", 0)
proc = TransactionProcessor()
proc.submit(TransferCommand(checking, merchant, 120.50))
proc.dispute_undo()`,
        Go: `package main

import "fmt"

type Account struct{ ID string; Balance float64 }
func (a *Account) Debit(amt float64) error {
	if a.Balance < amt { return fmt.Errorf("insufficient funds") }
	a.Balance -= amt; return nil
}
func (a *Account) Credit(amt float64) { a.Balance += amt }

type TxCommand interface { Execute() error; Undo() }

type TransferCmd struct{ From, To *Account; Amount float64 }
func (t *TransferCmd) Execute() error {
	if err := t.From.Debit(t.Amount); err != nil { return err }
	t.To.Credit(t.Amount)
	return nil
}
func (t *TransferCmd) Undo() { t.To.Debit(t.Amount); t.From.Credit(t.Amount) }

type Processor struct{ History []TxCommand }
func (p *Processor) Submit(cmd TxCommand) error {
	if err := cmd.Execute(); err != nil { return err }
	p.History = append(p.History, cmd)
	return nil
}
func (p *Processor) DisputeUndo() {
	if n := len(p.History); n > 0 {
		p.History[n-1].Undo()
		p.History = p.History[:n-1]
	}
}`,
        Java: `interface TxCommand { void execute(); void undo(); }

class TransferCommand implements TxCommand {
    Account from, to; double amount;
    TransferCommand(Account f, Account t, double a) { from = f; to = t; amount = a; }
    public void execute() { from.debit(amount); to.credit(amount); }
    public void undo() { to.debit(amount); from.credit(amount); }
}

class TransactionProcessor {
    Deque<TxCommand> history = new ArrayDeque<>();
    void submit(TxCommand cmd) { cmd.execute(); history.push(cmd); }
    void disputeUndo() { if (!history.isEmpty()) history.pop().undo(); }
}`,
        TypeScript: `interface TxCommand { execute(): void; undo(): void; }

class Account {
  constructor(public id: string, public balance = 0) {}
  debit(amount: number) {
    if (this.balance < amount) throw new Error("Insufficient funds");
    this.balance -= amount;
  }
  credit(amount: number) { this.balance += amount; }
}

class TransferCommand implements TxCommand {
  constructor(private from: Account, private to: Account, private amount: number) {}
  execute() { this.from.debit(this.amount); this.to.credit(this.amount); }
  undo() { this.to.debit(this.amount); this.from.credit(this.amount); }
}

class TransactionProcessor {
  private history: TxCommand[] = [];
  submit(cmd: TxCommand) { cmd.execute(); this.history.push(cmd); }
  disputeUndo() { this.history.pop()?.undo(); }
}

const checking = new Account("CHK-1001", 5000);
const merchant = new Account("MER-2002");
const proc = new TransactionProcessor();
proc.submit(new TransferCommand(checking, merchant, 120.50));
console.log(merchant.balance); // 120.50
proc.disputeUndo();
console.log(merchant.balance); // 0`,
        Rust: `trait TxCommand { fn execute(&mut self); fn undo(&mut self); }

struct Account { id: String, balance: f64 }
impl Account {
    fn debit(&mut self, amt: f64) { self.balance -= amt; }
    fn credit(&mut self, amt: f64) { self.balance += amt; }
}

// Rust: shared mutable state across commands requires Rc<RefCell<>>
use std::cell::RefCell;
use std::rc::Rc;

struct TransferCmd {
    from: Rc<RefCell<Account>>,
    to: Rc<RefCell<Account>>,
    amount: f64,
}
impl TxCommand for TransferCmd {
    fn execute(&mut self) {
        self.from.borrow_mut().debit(self.amount);
        self.to.borrow_mut().credit(self.amount);
    }
    fn undo(&mut self) {
        self.to.borrow_mut().debit(self.amount);
        self.from.borrow_mut().credit(self.amount);
    }
}`,
      },
      considerations: [
        "Idempotency: commands should be safe to retry without double-processing",
        "Compensating transactions for undo in distributed systems (vs. direct reversal)",
        "Command serialization for event sourcing and audit log replay",
        "Ordering guarantees: commands must execute in the correct sequence",
        "Dead-letter queues for commands that fail after retry limits",
      ],
    },
    {
      id: 3,
      title: "Smart Home — Scene Commands",
      domain: "IoT / Home Automation",
      problem:
        "A smart home system controls lights, thermostats, locks, and blinds. Users create scenes (e.g., 'Movie Night') that trigger multiple device actions at once. Each action must be individually undoable, and scenes must be undoable as a group.",
      solution:
        "Each device action is a Command. SceneCommand is a MacroCommand that composes multiple device commands. The controller (Invoker) manages execution and undo for individual and composite commands.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 10px 'JetBrains Mono', monospace; }
    .c-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="55" class="c-box c-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="c-title c-diagram-title">HomeController</text>
  <line x1="10" y1="32" x2="180" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-commands: DeviceCmd[]</text>
  <text x="18" y="60" class="c-member c-diagram-member">+execute(cmd)</text>
  <rect x="220" y="10" width="190" height="40" class="c-box c-diagram-box"/>
  <text x="315" y="34" text-anchor="middle" class="c-title c-diagram-title">DeviceCommand</text>
  <rect x="140" y="80" width="100" height="35" class="c-box c-diagram-box"/>
  <text x="190" y="102" text-anchor="middle" class="c-title c-diagram-title">LightOn</text>
  <rect x="260" y="80" width="100" height="35" class="c-box c-diagram-box"/>
  <text x="310" y="102" text-anchor="middle" class="c-title c-diagram-title">SceneCmd</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class DeviceCommand(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class Light:
    def __init__(self, name: str):
        self.name = name
        self.brightness = 0
    def set_brightness(self, level: int):
        self.brightness = level
        print(f"{self.name}: brightness={level}")

class SetBrightness(DeviceCommand):
    def __init__(self, light: Light, level: int):
        self.light = light
        self.level = level
        self.prev_level = 0
    def execute(self):
        self.prev_level = self.light.brightness
        self.light.set_brightness(self.level)
    def undo(self):
        self.light.set_brightness(self.prev_level)

class Thermostat:
    def __init__(self):
        self.temp = 72
    def set_temp(self, t: int):
        self.temp = t
        print(f"Thermostat: {t}°F")

class SetTemp(DeviceCommand):
    def __init__(self, thermo: Thermostat, temp: int):
        self.thermo = thermo
        self.temp = temp
        self.prev = 0
    def execute(self):
        self.prev = self.thermo.temp
        self.thermo.set_temp(self.temp)
    def undo(self):
        self.thermo.set_temp(self.prev)

class SceneCommand(DeviceCommand):
    def __init__(self, name: str, cmds: list[DeviceCommand]):
        self.name = name
        self.cmds = cmds
    def execute(self):
        print(f"Scene '{self.name}' ON")
        for c in self.cmds: c.execute()
    def undo(self):
        print(f"Scene '{self.name}' OFF")
        for c in reversed(self.cmds): c.undo()

# ── Movie Night Scene ──
living_light = Light("Living Room")
thermo = Thermostat()
movie = SceneCommand("Movie Night", [
    SetBrightness(living_light, 20),
    SetTemp(thermo, 68),
])
movie.execute()
movie.undo()`,
        Go: `package main

import "fmt"

type DeviceCmd interface { Execute(); Undo() }

type Light struct{ Name string; Brightness int }
func (l *Light) Set(b int) { l.Brightness = b; fmt.Printf("%s: %d\\n", l.Name, b) }

type SetBrightness struct{ Light *Light; Level, Prev int }
func (s *SetBrightness) Execute() { s.Prev = s.Light.Brightness; s.Light.Set(s.Level) }
func (s *SetBrightness) Undo()    { s.Light.Set(s.Prev) }

type SceneCmd struct{ Name string; Cmds []DeviceCmd }
func (sc *SceneCmd) Execute() {
	fmt.Printf("Scene '%s' ON\\n", sc.Name)
	for _, c := range sc.Cmds { c.Execute() }
}
func (sc *SceneCmd) Undo() {
	fmt.Printf("Scene '%s' OFF\\n", sc.Name)
	for i := len(sc.Cmds) - 1; i >= 0; i-- { sc.Cmds[i].Undo() }
}

func main() {
	light := &Light{"Living Room", 100}
	scene := &SceneCmd{"Movie Night", []DeviceCmd{
		&SetBrightness{light, 20, 0},
	}}
	scene.Execute()
	scene.Undo()
}`,
        Java: `interface DeviceCommand { void execute(); void undo(); }

class Light {
    String name; int brightness = 100;
    Light(String n) { name = n; }
    void set(int b) { brightness = b; System.out.printf("%s: %d%n", name, b); }
}

class SetBrightness implements DeviceCommand {
    Light light; int level, prev;
    SetBrightness(Light l, int lvl) { light = l; level = lvl; }
    public void execute() { prev = light.brightness; light.set(level); }
    public void undo() { light.set(prev); }
}

class SceneCommand implements DeviceCommand {
    String name; List<DeviceCommand> cmds;
    SceneCommand(String n, List<DeviceCommand> c) { name = n; cmds = c; }
    public void execute() { cmds.forEach(DeviceCommand::execute); }
    public void undo() {
        var reversed = new ArrayList<>(cmds);
        Collections.reverse(reversed);
        reversed.forEach(DeviceCommand::undo);
    }
}`,
        TypeScript: `interface DeviceCommand { execute(): void; undo(): void; }

class Light {
  constructor(public name: string, public brightness = 100) {}
  set(level: number) { this.brightness = level; console.log(\`\${this.name}: \${level}\`); }
}

class SetBrightness implements DeviceCommand {
  private prev = 0;
  constructor(private light: Light, private level: number) {}
  execute() { this.prev = this.light.brightness; this.light.set(this.level); }
  undo() { this.light.set(this.prev); }
}

class SceneCommand implements DeviceCommand {
  constructor(private name: string, private cmds: DeviceCommand[]) {}
  execute() {
    console.log(\`Scene '\${this.name}' ON\`);
    this.cmds.forEach(c => c.execute());
  }
  undo() {
    console.log(\`Scene '\${this.name}' OFF\`);
    [...this.cmds].reverse().forEach(c => c.undo());
  }
}

const light = new Light("Living Room");
const scene = new SceneCommand("Movie Night", [new SetBrightness(light, 20)]);
scene.execute();
scene.undo();`,
        Rust: `trait DeviceCommand { fn execute(&mut self); fn undo(&mut self); }

struct Light { name: String, brightness: u8 }
impl Light {
    fn set(&mut self, b: u8) { self.brightness = b; println!("{}: {}", self.name, b); }
}

struct SetBrightness { light_brightness: u8, level: u8, prev: u8 }
// In practice, you'd use Rc<RefCell<Light>> for shared ownership.
// Simplified here for illustration.

struct SceneCommand { name: String, cmds: Vec<Box<dyn DeviceCommand>> }
impl DeviceCommand for SceneCommand {
    fn execute(&mut self) {
        println!("Scene '{}' ON", self.name);
        for cmd in &mut self.cmds { cmd.execute(); }
    }
    fn undo(&mut self) {
        println!("Scene '{}' OFF", self.name);
        for cmd in self.cmds.iter_mut().rev() { cmd.undo(); }
    }
}`,
      },
      considerations: [
        "Scene commands are macro/composite commands composing device commands",
        "Device state must be captured before execute() for undo support",
        "Scheduling: scenes can be time-triggered (sunrise, sunset, bedtime)",
        "Network failures: device commands need retry with timeout",
        "Conflict resolution when two scenes affect the same device",
      ],
    },
    {
      id: 4,
      title: "Saga Orchestrator — Distributed Transactions",
      domain: "Microservices",
      problem:
        "An e-commerce order spans multiple services: inventory reservation, payment charging, and shipment scheduling. If payment fails after inventory is reserved, the reservation must be released. Direct service calls create tight coupling and make rollback complex.",
      solution:
        "Each saga step is a Command with execute() (forward action) and undo() (compensating action). The orchestrator runs steps in sequence and calls undo() on completed steps if any step fails.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 10px 'JetBrains Mono', monospace; }
    .c-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="55" class="c-box c-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="c-title c-diagram-title">SagaOrchestrator</text>
  <line x1="10" y1="32" x2="180" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-steps: SagaStep[]</text>
  <text x="18" y="60" class="c-member c-diagram-member">+run(): boolean</text>
  <rect x="220" y="10" width="190" height="40" class="c-box c-diagram-box"/>
  <text x="315" y="34" text-anchor="middle" class="c-title c-diagram-title">SagaStep</text>
  <rect x="140" y="80" width="110" height="35" class="c-box c-diagram-box"/>
  <text x="195" y="102" text-anchor="middle" class="c-title c-diagram-title">ReserveInv</text>
  <rect x="270" y="80" width="110" height="35" class="c-box c-diagram-box"/>
  <text x="325" y="102" text-anchor="middle" class="c-title c-diagram-title">ChargePaymt</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class SagaStep(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def compensate(self) -> None: ...

class ReserveInventory(SagaStep):
    def __init__(self, order_id: str, items: list[str]):
        self.order_id = order_id
        self.items = items
    def execute(self):
        print(f"Reserved {self.items} for order {self.order_id}")
    def compensate(self):
        print(f"Released {self.items} for order {self.order_id}")

class ChargePayment(SagaStep):
    def __init__(self, order_id: str, amount: float):
        self.order_id = order_id
        self.amount = amount
    def execute(self):
        print(f"Charged \${self.amount:.2f} for order {self.order_id}")
        # Simulate failure: raise Exception("Payment declined")
    def compensate(self):
        print(f"Refunded \${self.amount:.2f} for order {self.order_id}")

class SagaOrchestrator:
    def __init__(self, steps: list[SagaStep]):
        self.steps = steps
    def run(self) -> bool:
        completed: list[SagaStep] = []
        for step in self.steps:
            try:
                step.execute()
                completed.append(step)
            except Exception as e:
                print(f"SAGA FAILED: {e}. Compensating...")
                for s in reversed(completed):
                    s.compensate()
                return False
        return True

saga = SagaOrchestrator([
    ReserveInventory("ORD-100", ["SKU-A", "SKU-B"]),
    ChargePayment("ORD-100", 199.99),
])
saga.run()`,
        Go: `package main

import "fmt"

type SagaStep interface {
	Execute() error
	Compensate()
}

type ReserveInventory struct{ OrderID string; Items []string }
func (r *ReserveInventory) Execute() error {
	fmt.Printf("Reserved %v for %s\\n", r.Items, r.OrderID); return nil
}
func (r *ReserveInventory) Compensate() {
	fmt.Printf("Released %v for %s\\n", r.Items, r.OrderID)
}

type ChargePayment struct{ OrderID string; Amount float64 }
func (c *ChargePayment) Execute() error {
	fmt.Printf("Charged $%.2f for %s\\n", c.Amount, c.OrderID); return nil
}
func (c *ChargePayment) Compensate() {
	fmt.Printf("Refunded $%.2f for %s\\n", c.Amount, c.OrderID)
}

func RunSaga(steps []SagaStep) bool {
	var completed []SagaStep
	for _, step := range steps {
		if err := step.Execute(); err != nil {
			for i := len(completed) - 1; i >= 0; i-- { completed[i].Compensate() }
			return false
		}
		completed = append(completed, step)
	}
	return true
}`,
        Java: `interface SagaStep { void execute() throws Exception; void compensate(); }

class ReserveInventory implements SagaStep {
    String orderId; List<String> items;
    ReserveInventory(String id, List<String> i) { orderId = id; items = i; }
    public void execute() { System.out.printf("Reserved %s%n", items); }
    public void compensate() { System.out.printf("Released %s%n", items); }
}

class SagaOrchestrator {
    List<SagaStep> steps;
    SagaOrchestrator(List<SagaStep> s) { steps = s; }
    boolean run() {
        var completed = new ArrayList<SagaStep>();
        for (var step : steps) {
            try { step.execute(); completed.add(step); }
            catch (Exception e) {
                Collections.reverse(completed);
                completed.forEach(SagaStep::compensate);
                return false;
            }
        }
        return true;
    }
}`,
        TypeScript: `interface SagaStep {
  execute(): Promise<void>;
  compensate(): Promise<void>;
}

class ReserveInventory implements SagaStep {
  constructor(private orderId: string, private items: string[]) {}
  async execute() { console.log(\`Reserved \${this.items} for \${this.orderId}\`); }
  async compensate() { console.log(\`Released \${this.items} for \${this.orderId}\`); }
}

class ChargePayment implements SagaStep {
  constructor(private orderId: string, private amount: number) {}
  async execute() { console.log(\`Charged $\${this.amount} for \${this.orderId}\`); }
  async compensate() { console.log(\`Refunded $\${this.amount} for \${this.orderId}\`); }
}

async function runSaga(steps: SagaStep[]): Promise<boolean> {
  const completed: SagaStep[] = [];
  for (const step of steps) {
    try {
      await step.execute();
      completed.push(step);
    } catch (e) {
      for (const s of completed.reverse()) await s.compensate();
      return false;
    }
  }
  return true;
}

runSaga([
  new ReserveInventory("ORD-100", ["SKU-A", "SKU-B"]),
  new ChargePayment("ORD-100", 199.99),
]);`,
        Rust: `trait SagaStep {
    fn execute(&mut self) -> Result<(), String>;
    fn compensate(&self);
}

struct ReserveInventory { order_id: String, items: Vec<String> }
impl SagaStep for ReserveInventory {
    fn execute(&mut self) -> Result<(), String> {
        println!("Reserved {:?} for {}", self.items, self.order_id);
        Ok(())
    }
    fn compensate(&self) {
        println!("Released {:?} for {}", self.items, self.order_id);
    }
}

fn run_saga(steps: &mut [Box<dyn SagaStep>]) -> bool {
    let mut completed = 0;
    for step in steps.iter_mut() {
        match step.execute() {
            Ok(_) => completed += 1,
            Err(e) => {
                println!("SAGA FAILED: {}. Compensating...", e);
                for i in (0..completed).rev() {
                    steps[i].compensate();
                }
                return false;
            }
        }
    }
    true
}`,
      },
      considerations: [
        "Idempotency: both execute and compensate must be safe to call multiple times",
        "Compensating actions may need to be different from simple reversal (e.g., send apology email)",
        "Persistence: saga state must survive crashes — store step progress in DB",
        "Timeout handling: steps need deadlines. If a step hangs, compensate completed steps",
        "Event sourcing: commands can form the event log for full system replay",
      ],
    },
    {
      id: 5,
      title: "Database Migration — Versioned Commands",
      domain: "DevOps / Infrastructure",
      problem:
        "A database migration system applies schema changes (add column, create index, alter constraint) in version order. Each migration must be reversible for rollbacks. The system must track which migrations have been applied and apply only pending ones.",
      solution:
        "Each migration is a Command with up() (apply) and down() (rollback). The MigrationRunner tracks applied versions and supports apply-all and rollback-to-version operations.",
      classDiagramSvg: `<svg viewBox="0 0 420 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px">
  <style>
    .c-box { rx:6; }
    .c-title { font: bold 10px 'JetBrains Mono', monospace; }
    .c-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="10" y="10" width="170" height="55" class="c-box c-diagram-box"/>
  <text x="95" y="28" text-anchor="middle" class="c-title c-diagram-title">MigrationRunner</text>
  <line x1="10" y1="32" x2="180" y2="32" class="c-diagram-line"/>
  <text x="18" y="48" class="c-member c-diagram-member">-applied: Migration[]</text>
  <text x="18" y="60" class="c-member c-diagram-member">+applyPending()</text>
  <rect x="230" y="10" width="180" height="40" class="c-box c-diagram-box"/>
  <text x="320" y="34" text-anchor="middle" class="c-title c-diagram-title">Migration</text>
  <rect x="220" y="80" width="100" height="35" class="c-box c-diagram-box"/>
  <text x="270" y="102" text-anchor="middle" class="c-title c-diagram-title">AddColumn</text>
  <rect x="340" y="80" width="100" height="35" class="c-box c-diagram-box"/>
  <text x="390" y="102" text-anchor="middle" class="c-title c-diagram-title">CreateIndex</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class Migration(ABC):
    version: int
    name: str
    @abstractmethod
    def up(self) -> None: ...
    @abstractmethod
    def down(self) -> None: ...

class AddUserAge(Migration):
    version = 1
    name = "add_user_age_column"
    def up(self): print("ALTER TABLE users ADD COLUMN age INT")
    def down(self): print("ALTER TABLE users DROP COLUMN age")

class CreateEmailIndex(Migration):
    version = 2
    name = "create_email_index"
    def up(self): print("CREATE INDEX idx_email ON users(email)")
    def down(self): print("DROP INDEX idx_email")

class MigrationRunner:
    def __init__(self, migrations: list[Migration]):
        self.all = sorted(migrations, key=lambda m: m.version)
        self.applied: list[Migration] = []

    def apply_pending(self):
        applied_versions = {m.version for m in self.applied}
        for m in self.all:
            if m.version not in applied_versions:
                print(f"Applying v{m.version}: {m.name}")
                m.up()
                self.applied.append(m)

    def rollback(self, count: int = 1):
        for _ in range(count):
            if self.applied:
                m = self.applied.pop()
                print(f"Rolling back v{m.version}: {m.name}")
                m.down()

runner = MigrationRunner([AddUserAge(), CreateEmailIndex()])
runner.apply_pending()
runner.rollback(1)`,
        Go: `package main

import "fmt"

type Migration interface {
	Version() int
	Name() string
	Up()
	Down()
}

type AddAge struct{}
func (a *AddAge) Version() int { return 1 }
func (a *AddAge) Name() string { return "add_age" }
func (a *AddAge) Up()   { fmt.Println("ALTER TABLE users ADD COLUMN age INT") }
func (a *AddAge) Down() { fmt.Println("ALTER TABLE users DROP COLUMN age") }

type Runner struct {
	All     []Migration
	Applied []Migration
}
func (r *Runner) ApplyPending() {
	for _, m := range r.All {
		fmt.Printf("Applying v%d: %s\\n", m.Version(), m.Name())
		m.Up()
		r.Applied = append(r.Applied, m)
	}
}
func (r *Runner) Rollback(n int) {
	for i := 0; i < n && len(r.Applied) > 0; i++ {
		m := r.Applied[len(r.Applied)-1]
		r.Applied = r.Applied[:len(r.Applied)-1]
		fmt.Printf("Rollback v%d\\n", m.Version())
		m.Down()
	}
}`,
        Java: `interface Migration {
    int version();
    String name();
    void up();
    void down();
}

class AddAge implements Migration {
    public int version() { return 1; }
    public String name() { return "add_age"; }
    public void up() { System.out.println("ALTER TABLE users ADD COLUMN age INT"); }
    public void down() { System.out.println("ALTER TABLE users DROP COLUMN age"); }
}

class MigrationRunner {
    List<Migration> applied = new ArrayList<>();
    void applyPending(List<Migration> all) {
        for (var m : all) { m.up(); applied.add(m); }
    }
    void rollback(int n) {
        for (int i = 0; i < n && !applied.isEmpty(); i++) {
            var m = applied.remove(applied.size() - 1);
            m.down();
        }
    }
}`,
        TypeScript: `interface Migration {
  version: number;
  name: string;
  up(): void;
  down(): void;
}

const addAge: Migration = {
  version: 1, name: "add_age",
  up() { console.log("ALTER TABLE users ADD COLUMN age INT"); },
  down() { console.log("ALTER TABLE users DROP COLUMN age"); },
};

class MigrationRunner {
  private applied: Migration[] = [];
  constructor(private all: Migration[]) {}
  applyPending() {
    for (const m of this.all) {
      console.log(\`Applying v\${m.version}: \${m.name}\`);
      m.up();
      this.applied.push(m);
    }
  }
  rollback(n = 1) {
    for (let i = 0; i < n; i++) {
      const m = this.applied.pop();
      if (m) { console.log(\`Rollback v\${m.version}\`); m.down(); }
    }
  }
}`,
        Rust: `trait Migration {
    fn version(&self) -> u32;
    fn name(&self) -> &str;
    fn up(&self);
    fn down(&self);
}

struct AddAge;
impl Migration for AddAge {
    fn version(&self) -> u32 { 1 }
    fn name(&self) -> &str { "add_age" }
    fn up(&self) { println!("ALTER TABLE users ADD COLUMN age INT"); }
    fn down(&self) { println!("ALTER TABLE users DROP COLUMN age"); }
}

struct Runner { applied: Vec<Box<dyn Migration>> }
impl Runner {
    fn apply(&mut self, m: Box<dyn Migration>) {
        println!("Applying v{}: {}", m.version(), m.name());
        m.up();
        self.applied.push(m);
    }
    fn rollback(&mut self) {
        if let Some(m) = self.applied.pop() {
            println!("Rollback v{}", m.version());
            m.down();
        }
    }
}`,
      },
      considerations: [
        "Migrations must be idempotent — running up() twice should not break the schema",
        "down() must perfectly reverse up() — test with round-trip migrations",
        "Store applied migrations in a version table for persistence across restarts",
        "Locking: only one migration runner should execute at a time (advisory locks)",
        "Some migrations are irreversible (e.g., DROP TABLE) — mark them as non-reversible",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Use Classic Command (interface + class) when you need undo, history, and macro commands. Use Closure-based for simple, fire-and-forget commands. Use Event Sourcing Commands when you need full replay capability from persisted events.",

  variants: [
    {
      id: 1,
      name: "Classic Command (Class-based, Undo/Redo)",
      description:
        "Each command is a class implementing execute() and undo(). The invoker maintains a history stack. Best for applications requiring undo, redo, and macro commands (text editors, drawing apps, financial systems).",
      code: {
        Python: `class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...
    @abstractmethod
    def undo(self) -> None: ...

class Invoker:
    def __init__(self):
        self.history: list[Command] = []
    def run(self, cmd: Command):
        cmd.execute()
        self.history.append(cmd)
    def undo(self):
        if self.history:
            self.history.pop().undo()`,
        Go: `type Command interface { Execute(); Undo() }

type Invoker struct{ History []Command }
func (inv *Invoker) Run(cmd Command) {
	cmd.Execute()
	inv.History = append(inv.History, cmd)
}
func (inv *Invoker) Undo() {
	if n := len(inv.History); n > 0 {
		inv.History[n-1].Undo()
		inv.History = inv.History[:n-1]
	}
}`,
        Java: `interface Command { void execute(); void undo(); }

class Invoker {
    Deque<Command> history = new ArrayDeque<>();
    void run(Command cmd) { cmd.execute(); history.push(cmd); }
    void undo() { if (!history.isEmpty()) history.pop().undo(); }
}`,
        TypeScript: `interface Command { execute(): void; undo(): void; }

class Invoker {
  private history: Command[] = [];
  run(cmd: Command) { cmd.execute(); this.history.push(cmd); }
  undo() { this.history.pop()?.undo(); }
}`,
        Rust: `trait Command { fn execute(&mut self); fn undo(&mut self); }

struct Invoker { history: Vec<Box<dyn Command>> }
impl Invoker {
    fn run(&mut self, mut cmd: Box<dyn Command>) {
        cmd.execute();
        self.history.push(cmd);
    }
    fn undo(&mut self) {
        if let Some(mut cmd) = self.history.pop() { cmd.undo(); }
    }
}`,
      },
      pros: [
        "Full undo/redo and macro command support",
        "Commands are inspectable, loggable, and serializable",
        "Clear separation of invoker, command, and receiver",
      ],
      cons: [
        "More classes and boilerplate per operation",
        "Memory usage grows with history stack size",
        "Undo must be explicitly implemented for each command",
      ],
    },
    {
      id: 2,
      name: "Closure-based Command (Functional)",
      description:
        "Commands are closures or function pairs (execute, undo). Lightweight for simple scenarios without complex undo logic.",
      code: {
        Python: `from typing import Callable, NamedTuple

class Cmd(NamedTuple):
    execute: Callable[[], None]
    undo: Callable[[], None]

counter = [0]
increment = Cmd(
    execute=lambda: counter.__setitem__(0, counter[0] + 1),
    undo=lambda: counter.__setitem__(0, counter[0] - 1),
)
increment.execute()
print(counter[0])  # 1
increment.undo()
print(counter[0])  # 0`,
        Go: `type Cmd struct {
	Execute func()
	Undo    func()
}

counter := 0
inc := Cmd{
	Execute: func() { counter++ },
	Undo:    func() { counter-- },
}
inc.Execute()
fmt.Println(counter) // 1`,
        Java: `record Cmd(Runnable execute, Runnable undo) {
    void run() { execute.run(); }
    void rollback() { undo.run(); }
}

var counter = new int[]{0};
var inc = new Cmd(() -> counter[0]++, () -> counter[0]--);
inc.run();
System.out.println(counter[0]); // 1`,
        TypeScript: `type Cmd = { execute: () => void; undo: () => void; };

let counter = 0;
const inc: Cmd = { execute: () => counter++, undo: () => counter-- };
inc.execute();
console.log(counter); // 1
inc.undo();
console.log(counter); // 0`,
        Rust: `struct Cmd {
    execute: Box<dyn FnMut()>,
    undo: Box<dyn FnMut()>,
}

let mut counter = 0i32;
// In practice, use Rc<RefCell<i32>> for shared mutation in closures.`,
      },
      pros: [
        "Minimal boilerplate — no interface or class declarations",
        "Easy to create inline, one-off commands",
        "Natural in functional languages",
      ],
      cons: [
        "Hard to serialize or inspect closures",
        "No type name — debugging is harder",
        "Undo behavior must be manually provided",
      ],
    },
    {
      id: 3,
      name: "Event Sourcing Command",
      description:
        "Commands produce events that are persisted. System state is rebuilt by replaying events from the log. Used for audit trails, debugging, and distributed consistency.",
      code: {
        Python: `from dataclasses import dataclass
from datetime import datetime

@dataclass
class Event:
    type: str
    data: dict
    timestamp: datetime

class EventStore:
    def __init__(self):
        self.events: list[Event] = []
    def append(self, event: Event):
        self.events.append(event)
    def replay(self) -> list[Event]:
        return list(self.events)

class TransferCommand:
    def __init__(self, store: EventStore, from_id: str, to_id: str, amount: float):
        self.store = store
        self.from_id = from_id
        self.to_id = to_id
        self.amount = amount
    def execute(self):
        event = Event("TRANSFER", {
            "from": self.from_id, "to": self.to_id, "amount": self.amount
        }, datetime.utcnow())
        self.store.append(event)
        print(f"Event recorded: {event.type}")`,
        Go: `type Event struct {
	Type string
	Data map[string]interface{}
	Time time.Time
}
type EventStore struct{ Events []Event }
func (es *EventStore) Append(e Event) { es.Events = append(es.Events, e) }
func (es *EventStore) Replay() []Event { return es.Events }`,
        Java: `record Event(String type, Map<String, Object> data, Instant timestamp) {}

class EventStore {
    List<Event> events = new ArrayList<>();
    void append(Event e) { events.add(e); }
    List<Event> replay() { return List.copyOf(events); }
}`,
        TypeScript: `interface Event { type: string; data: Record<string, unknown>; timestamp: Date; }

class EventStore {
  private events: Event[] = [];
  append(e: Event) { this.events.push(e); }
  replay() { return [...this.events]; }
}

class TransferCommand {
  constructor(private store: EventStore, private from: string, private to: string, private amount: number) {}
  execute() {
    this.store.append({ type: "TRANSFER", data: { from: this.from, to: this.to, amount: this.amount }, timestamp: new Date() });
  }
}`,
        Rust: `use chrono::Utc;
use std::collections::HashMap;

struct Event { event_type: String, data: HashMap<String, String>, timestamp: String }
struct EventStore { events: Vec<Event> }
impl EventStore {
    fn append(&mut self, e: Event) { self.events.push(e); }
    fn replay(&self) -> &[Event] { &self.events }
}`,
      },
      pros: [
        "Complete audit trail — every change is recorded",
        "Time travel: rebuild state at any point in time",
        "Decouples command execution from state mutation (CQRS)",
      ],
      cons: [
        "Event store grows indefinitely — needs snapshots and compaction",
        "Rebuilding state from events can be slow for large histories",
        "Event schema evolution is challenging — versioning required",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Undo Support", "Persistence", "Complexity", "Best For",
  ],
  comparisonRows: [
    ["Class-based", "Full (undo/redo stacks)", "Serializable", "Medium", "Editors, transactions, GUIs"],
    ["Closure-based", "Manual (provide undo fn)", "Not serializable", "Low", "Simple fire-and-forget actions"],
    ["Event Sourcing", "Replay from events", "Built-in (event store)", "High", "Audit trails, CQRS, distributed systems"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Behavioral" },
    {
      aspect: "Key Benefit",
      detail:
        "Decouples invoker from receiver by wrapping requests as objects. Enables undo/redo, queuing, logging, macro commands, and deferred execution — all impossible with direct method calls.",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Using Command for simple, non-reversible operations that don't need queuing or logging. If you don't need undo, history, or deferred execution, a direct method call is simpler.",
    },
    {
      aspect: "vs. Strategy Pattern",
      detail:
        "Strategy encapsulates *how* to do something (algorithm selection). Command encapsulates *what* to do (a request). Strategies are usually stateless; Commands carry request-specific state.",
    },
    {
      aspect: "vs. Memento Pattern",
      detail:
        "Memento saves complete state snapshots for undo. Command records incremental operations for undo. Command is lighter when operations are simple; Memento is safer when undo logic is complex.",
    },
    {
      aspect: "When to Use",
      detail:
        "Undo/redo systems. Transaction queues and batch processing. Macro commands and composite actions. Event sourcing and audit trails. GUI action binding. Saga orchestration in microservices.",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "Simple, direct operations that don't need undo, logging, or queuing. When the overhead of wrapping every call in an object provides no benefit.",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Memento (state snapshots for undo), Composite (macro commands), Strategy (algorithm selection), Observer (event notification), Chain of Responsibility (command routing)",
    },
  ],

  antiPatterns: [
    {
      name: "God Command",
      description:
        "A single command class that handles multiple unrelated operations based on a type field, using if/else inside execute().",
      betterAlternative:
        "Create separate command classes for each operation. The whole point of Command is to encapsulate *one* request per object.",
    },
    {
      name: "Missing Undo State",
      description:
        "Commands implement undo() but don't save enough state to reverse the action — e.g., a delete command that doesn't remember what was deleted.",
      betterAlternative:
        "Capture all necessary state in execute() *before* performing the action. Store the previous value so undo() can restore it exactly.",
    },
    {
      name: "Leaky Receiver Coupling",
      description:
        "The invoker accesses the receiver directly instead of going through the command, bypassing the decoupling the pattern provides.",
      betterAlternative:
        "The invoker should only know the Command interface. All interaction with the receiver goes through ConcreteCommand.",
    },
    {
      name: "Unbounded History",
      description:
        "The history stack grows forever without any limit or compaction strategy, consuming unbounded memory.",
      betterAlternative:
        "Set a maximum history size. Use compaction (merge adjacent commands) or snapshots for long-running sessions.",
    },
  ],
};

export default commandData;
