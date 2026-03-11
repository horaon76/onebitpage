import { PatternData } from "@/lib/patterns/types";

const mementoData: PatternData = {
  slug: "memento",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Memento Pattern",
  subtitle:
    "Capture and externalise an object's internal state so it can be restored later, without violating encapsulation.",

  intent:
    "Sometimes you need to snapshot an object's state and roll it back later — undo/redo in editors, game save/load, database transaction rollback, or form wizard back-navigation. The naive approach is to expose all internal fields so an external caretaker can copy them. But this violates encapsulation: the object's private internals become part of the public API, and every client that stores snapshots must understand and depend on those internals.\n\nThe Memento pattern solves this by letting the Originator (the object whose state is being saved) create opaque snapshot objects (Mementos) itself. The Memento captures the full internal state but exposes no setters and hides implementation details from the outside world. A Caretaker (e.g., a history stack) stores and manages Mementos without ever inspecting their contents. When rollback is needed, the Caretaker hands the Memento back to the Originator, which restores its own state from it.\n\nThe critical invariant: the Caretaker treats Mementos as black boxes — it stores them and returns them, but never reads or modifies their contents. Only the Originator reads a Memento's internals (often via a friendship relationship or a nested class in statically typed languages like Java/C++).",

  classDiagramSvg: `<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box{rx:6;} .s-title{font:bold 11px 'JetBrains Mono',monospace;}
    .s-member{font:10px 'JetBrains Mono',monospace;}
    .s-arr{stroke-width:1.2;fill:none;marker-end:url(#mem-arr);}
    .s-dash{stroke-dasharray:5,3;}
  </style>
  <defs>
    <marker id="mem-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Originator -->
  <rect x="10" y="50" width="190" height="90" class="s-box s-diagram-box"/>
  <text x="105" y="68" text-anchor="middle" class="s-title s-diagram-title">Originator</text>
  <line x1="10" y1="73" x2="200" y2="73" class="s-diagram-line"/>
  <text x="20" y="89" class="s-member s-diagram-member">-state: State</text>
  <text x="20" y="103" class="s-member s-diagram-member">+save(): Memento</text>
  <text x="20" y="117" class="s-member s-diagram-member">+restore(m: Memento)</text>
  <text x="20" y="131" class="s-member s-diagram-member">+doSomething()</text>
  <!-- Memento -->
  <rect x="230" y="10" width="175" height="80" class="s-box s-diagram-box"/>
  <text x="317" y="28" text-anchor="middle" class="s-title s-diagram-title">Memento</text>
  <line x1="230" y1="33" x2="405" y2="33" class="s-diagram-line"/>
  <text x="240" y="49" class="s-member s-diagram-member">-state: State</text>
  <text x="240" y="63" class="s-member s-diagram-member">+getState(): State</text>
  <text x="240" y="77" class="s-member s-diagram-member">+getDate(): string</text>
  <!-- Caretaker -->
  <rect x="420" y="50" width="130" height="90" class="s-box s-diagram-box"/>
  <text x="485" y="68" text-anchor="middle" class="s-title s-diagram-title">Caretaker</text>
  <line x1="420" y1="73" x2="550" y2="73" class="s-diagram-line"/>
  <text x="428" y="89" class="s-member s-diagram-member">-history: Memento[]</text>
  <text x="428" y="103" class="s-member s-diagram-member">+backup()</text>
  <text x="428" y="117" class="s-member s-diagram-member">+undo()</text>
  <text x="428" y="131" class="s-member s-diagram-member">+showHistory()</text>
  <!-- Arrows -->
  <line x1="200" y1="80" x2="230" y2="50" class="s-arr s-diagram-arrow"/>
  <text x="195" y="60" class="s-member s-diagram-member" style="font-size:8px">creates</text>
  <line x1="420" y1="80" x2="405" y2="55" class="s-arr s-diagram-arrow s-dash"/>
  <text x="404" y="70" class="s-member s-diagram-member" style="font-size:8px">stores</text>
</svg>`,

  diagramExplanation:
    "The Originator holds the actual state being protected. Its save() method creates a new Memento by packaging its current state into it — returns a Memento. Its restore(m) method reads the state back from a Memento and applies it internally. The Memento holds the snapshot of state and exposes limited read access (getState() is available to the Originator; the Caretaker should only call getDate() for display purposes, never getState()). The Caretaker manages a history stack of Mementos — calling originator.save() to push checkpoints, and calling originator.restore(memento) to pop and apply them. The Caretaker never reads state from a Memento — it treats them as opaque tokens.",

  diagramComponents: [
    {
      name: "Originator",
      description:
        "The object whose state is being captured. Creates Mementos via save() which packages its private state. Restores itself from a Memento via restore() — only the Originator knows how to interpret the Memento's contents.",
    },
    {
      name: "Memento",
      description:
        "An immutable snapshot of the Originator's state at a point in time. Should be a value object — no setters, no mutation after construction. Caretakers store and return Mementos but never inspect their state.",
    },
    {
      name: "Caretaker",
      description:
        "Manages the undo/redo history stack. Calls originator.save() to push checkpoints and originator.restore(memento) to roll back. Treats Mementos as opaque tokens — never reads their internal state.",
    },
  ],

  solutionDetail:
    "**Encapsulation Preservation**: The Originator packages its own state into the Memento. Caretaker stores the Memento without knowing what's inside. Only the Originator can read a Memento's internals. Private state never becomes part of the public API.\n\n**Narrow vs Wide Memento**:\n- Wide Memento: stores the entire state object (simpler, safe for small state)\n- Narrow Memento: stores only the diff/delta since the last snapshot (more memory-efficient for large or frequent checkpoints)\n\n**Nested/Inner Class Pattern** (Java/C++): ConcreteMemento can be a private inner class of the Originator, ensuring only the Originator can instantiate or read it. The Caretaker receives it via the Memento interface which exposes no state-reading methods.\n\n**Command + Memento**: Often combined — each Command stores a Memento of pre-execution state. Undo = restore that Memento.\n\n**Serialization as Memento**: For persistence (save-to-file, network sync), snapshots are often serialised (JSON, binary). The Memento holds the serialised form. Restoring means deserialising — the same encapsulation principle applies.",

  characteristics: [
    "Preserves encapsulation — Originator's private state is never exposed to the Caretaker",
    "Snapshot semantics — Mementos are immutable; restoring one doesn't affect current state until restore() is called",
    "Caretaker manages lifecycle — decides when to snapshot and when to restore, without knowing state semantics",
    "History depth is externally controlled — easy to cap undo history at N steps",
    "Can be memory-intensive for large or frequently changing state — consider delta Mementos",
    "Natural fit for undo/redo, game saves, database transactions, and form navigation",
    "Combining with Command Pattern: each Command saves a Memento before executing; undo restores it",
  ],

  useCases: [
    {
      id: 1,
      title: "Text Editor Undo / Redo",
      domain: "Productivity Tools",
      description:
        "A text editor needs unlimited undo history. Each keystroke or paste creates a new state. Ctrl+Z restores the previous state. Ctrl+Y re-applies a previously undone state.",
      whySingleton:
        "Editor is the Originator. EditHistory is the Caretaker holding a stack of Mementos. Ctrl+Z pops a Memento from the history and calls editor.restore(memento).",
      code: `class Editor:  # Originator
    def __init__(self):
        self._text = ""
    def type(self, text: str):
        self._text += text
    def save(self) -> 'Snapshot':
        return Snapshot(self._text)  # create memento
    def restore(self, snapshot: 'Snapshot'):
        self._text = snapshot.get_state()  # restore from memento`,
    },
    {
      id: 2,
      title: "Game Save / Load",
      domain: "Gaming",
      description:
        "A video game saves player progress: position, health, inventory, level state. The player can load a previous save to retry a difficult section. The game engine shouldn't expose all player internals to the save system.",
      whySingleton:
        "Player is the Originator. SaveGameManager is the Caretaker. player.save() returns a GameStateMomento. SaveGameManager serialises and stores it. Loading calls player.restore(memento).",
      code: `class Player:  # Originator
    def save(self) -> 'GameSave':
        # Packages private internals into an opaque save object
        return GameSave(self._position, self._health, self._inventory)
    def restore(self, save: 'GameSave'):
        state = save.get_state()  # only Player reads Memento internals
        self._position  = state['position']
        self._health    = state['health']
        self._inventory = state['inventory']`,
    },
    {
      id: 3,
      title: "Database Transaction Rollback",
      domain: "Database / Persistence",
      description:
        "A local in-memory database or ORM unit-of-work records state before a transaction begins. If the transaction fails, all changes are rolled back to the pre-transaction snapshot.",
      whySingleton:
        "The database table/row is the Originator. TransactionManager is the Caretaker. BEGIN TRANSACTION → snapshot. ROLLBACK → restore from snapshot. COMMIT → discard snapshot.",
      code: `class InMemoryTable:  # Originator
    def __init__(self):
        self._rows: dict = {}
    def begin_transaction(self) -> 'TableSnapshot':
        import copy
        return TableSnapshot(copy.deepcopy(self._rows))
    def rollback(self, snapshot: 'TableSnapshot'):
        self._rows = snapshot.get_rows()  # restore to pre-transaction state`,
    },
    {
      id: 4,
      title: "Form Wizard Back-Navigation",
      domain: "Frontend / UX",
      description:
        "A multi-step form wizard allows users to navigate back to a previous step without losing their filled data. Each step completion creates a snapshot. Clicking 'Back' restores the previous step's state.",
      whySingleton:
        "WizardState is the Originator. WizardHistory is the Caretaker. Clicking 'Next' saves a snapshot. Clicking 'Back' pops and restores the last snapshot.",
      code: `class WizardState:  # Originator
    def save(self) -> 'StepSnapshot':
        return StepSnapshot({'step': self.current_step,
                             'data': dict(self.fields)})
    def restore(self, snapshot: 'StepSnapshot'):
        state = snapshot.get_state()
        self.current_step = state['step']
        self.fields = state['data']`,
    },
    {
      id: 5,
      title: "Configuration Change Rollback",
      domain: "DevOps / Platform Engineering",
      description:
        "A live configuration system allows hot-reloading config. Before applying new config, the system snapshots the current config. If the new config causes errors, it rolls back instantly.",
      whySingleton:
        "ConfigManager is the Originator. DeploymentSystem is the Caretaker. Before each config update: configManager.save() → apply new config → on error: configManager.restore(snapshot).",
      code: `class ConfigManager:  # Originator
    def save(self) -> 'ConfigSnapshot':
        return ConfigSnapshot(dict(self._config))  # deep copy current config
    def restore(self, snapshot: 'ConfigSnapshot'):
        self._config = snapshot.get_config()  # roll back to snapshot
        self._apply()  # re-apply the rolled-back config`,
    },
    {
      id: 6,
      title: "Compiler / Interpreter Parse State",
      domain: "Developer Tools",
      description:
        "A parser tries to parse using one grammar rule, saves a checkpoint, and if the rule fails, backtracks to the checkpoint and tries the next rule. Backtracking parsers use Memento to save/restore cursor position and parse stack.",
      whySingleton:
        "Parser is the Originator. ParseStream cursor position + partial AST is the state. When trying rule A fails, restore from the pre-A checkpoint and try rule B.",
      code: `class Parser:  # Originator
    def __init__(self, tokens: list):
        self._tokens = tokens
        self._cursor = 0
    def save(self) -> 'ParseState':
        return ParseState(self._cursor)  # snapshot cursor position
    def restore(self, state: 'ParseState'):
        self._cursor = state.cursor  # backtrack to saved position`,
    },
    {
      id: 7,
      title: "Drawing Canvas State (Undo Layers)",
      domain: "Creative Tools",
      description:
        "A drawing application saves canvas pixel data before each brush stroke. Undo restores the previous pixel state. History is capped at 50 states to limit memory usage.",
      whySingleton:
        "Canvas is the Originator. UndoStack is the Caretaker with a max-length deque. Each stroke: canvas.save() → push. If len > 50: pop oldest. Undo: pop latest → canvas.restore().",
      code: `from collections import deque

class UndoStack:  # Caretaker
    def __init__(self, canvas, max_history=50):
        self._canvas = canvas
        self._history: deque = deque(maxlen=max_history)  # auto-evicts oldest
    def checkpoint(self):
        self._history.append(self._canvas.save())
    def undo(self):
        if self._history:
            self._canvas.restore(self._history.pop())`,
    },
    {
      id: 8,
      title: "AI Agent State Snapshot",
      domain: "Artificial Intelligence",
      description:
        "An AI agent exploring a state space saves checkpoints before exploring risky branches. If a branch leads to a dead end, the agent restores the last checkpoint. The search algorithm doesn't know the agent's internal representation.",
      whySingleton:
        "AIAgent is the Originator — its belief state, knowledge graph, and goals are saved into an AgentMemento. The search algorithm (Caretaker) stores and restores snapshots without knowing their content.",
      code: `class AIAgent:  # Originator
    def save(self) -> 'AgentMemento':
        # Deep-copy complex internal state into opaque memento
        import copy
        return AgentMemento(copy.deepcopy(self._beliefs),
                            copy.deepcopy(self._goals))
    def restore(self, memento: 'AgentMemento'):
        state = memento.get_state()
        self._beliefs = state['beliefs']
        self._goals   = state['goals']`,
    },
    {
      id: 9,
      title: "HTTP Request Retry with Original State",
      domain: "Networking / Resilience",
      description:
        "An HTTP client with retry logic saves the request state before the first attempt. If the request fails with a retryable error, it restores the original request state (headers, body, auth token) and retries rather than re-building it.",
      whySingleton:
        "HttpRequest is the Originator. RetryMiddleware is the Caretaker. Before first attempt: request.save(). On retryable failure: request.restore(saved) and retry with fresh state.",
      code: `class HttpRequest:  # Originator - actually represents mutable request builder
    def save(self) -> 'RequestSnapshot':
        return RequestSnapshot(self._headers.copy(),
                               self._body,
                               self._auth_token)
    def restore(self, snapshot: 'RequestSnapshot'):
        state = snapshot.get()
        self._headers    = state['headers']
        self._body       = state['body']
        self._auth_token = state['auth_token']`,
    },
    {
      id: 10,
      title: "Financial Portfolio Simulation",
      domain: "Finance",
      description:
        "A portfolio simulation runs multiple 'what if' scenarios. Before each simulation, the portfolio state is snapshotted. After simulation (or on abort), the portfolio is restored to pre-simulation state.",
      whySingleton:
        "Portfolio is the Originator. SimulationRunner is the Caretaker. Before each scenario: portfolio.save(). After scenario completes (or errors): portfolio.restore(snapshot).",
      code: `class Portfolio:  # Originator
    def save(self) -> 'PortfolioSnapshot':
        import copy
        return PortfolioSnapshot(copy.deepcopy(self._positions),
                                 self._cash_balance)
    def restore(self, snapshot: 'PortfolioSnapshot'):
        state = snapshot.get_state()
        self._positions    = state['positions']
        self._cash_balance = state['cash_balance']`,
    },
    {
      id: 11,
      title: "Test Fixture State Reset",
      domain: "Testing / QA",
      description:
        "A test suite sets up expensive fixture state (database, in-memory cache) once before all tests. Between tests, the fixture is snapshotted then restored rather than re-initialised — keeping test isolation without re-setup cost.",
      whySingleton:
        "TestFixture is the Originator. TestRunner is the Caretaker. Before test suite: fixture.save(). Between each test: fixture.restore(snapshot) to reset to clean state.",
      code: `class TestFixture:  # Originator
    def save(self) -> 'FixtureSnapshot':
        import copy
        return FixtureSnapshot(copy.deepcopy(self._db_state),
                               copy.deepcopy(self._cache_state))
    def restore(self, snapshot: 'FixtureSnapshot'):
        state = snapshot.get()
        self._db_state    = state['db']
        self._cache_state = state['cache']`,
    },
    {
      id: 12,
      title: "RPC / Streaming Cursor Checkpoint",
      domain: "Distributed Systems",
      description:
        "A stream consumer checkpoints its cursor position after successfully processing each batch. On recovery from a crash, it restores the last checkpoint rather than reprocessing all messages from the beginning.",
      whySingleton:
        "StreamConsumer is the Originator. CheckpointStore (durable storage) is the Caretaker. Successful batch: consumer.save() → persist to disk. On restart: consumer.restore(load_from_disk()).",
      code: `class StreamConsumer:  # Originator
    def save(self) -> 'ConsumerCheckpoint':
        return ConsumerCheckpoint(self._topic,
                                  self._partition,
                                  self._offset)  # opaque snapshot
    def restore(self, checkpoint: 'ConsumerCheckpoint'):
        pos = checkpoint.get_position()
        self._topic     = pos['topic']
        self._partition = pos['partition']
        self._offset    = pos['offset']  # resume from saved offset`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Text Editor with Undo History",
      domain: "Productivity Tools",
      problem:
        "A text editor must support multi-level undo. Recording state externally would require exposing all editor internals (text buffer, cursor position, formatting marks) — any change to internal representation would break the history system. The history should not know the editor's internal format.",
      solution:
        "Editor is the Originator — it creates Snapshot objects internally with all needed state and knows how to restore from them. Snapshot is the Memento — immutable, carries state but nothing else. History is the Caretaker — holds a list of Snapshots and calls editor.save() / editor.restore(snapshot) at the right times. History never calls snapshot.getText() — it treats snapshots as opaque tokens.",
      classDiagramSvg: `<svg viewBox="0 0 480 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#mem-e1);}</style>
  <defs><marker id="mem-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="0" y="30" width="160" height="90" class="s-box s-diagram-box"/>
  <text x="80" y="48" text-anchor="middle" class="s-title s-diagram-title">Editor (Originator)</text>
  <line x1="0" y1="53" x2="160" y2="53" class="s-diagram-line"/>
  <text x="8" y="68" class="s-member s-diagram-member">-text: str</text>
  <text x="8" y="80" class="s-member s-diagram-member">+type(text)</text>
  <text x="8" y="92" class="s-member s-diagram-member">+save(): Snapshot</text>
  <text x="8" y="104" class="s-member s-diagram-member">+restore(Snapshot)</text>
  <rect x="180" y="10" width="150" height="65" class="s-box s-diagram-box"/>
  <text x="255" y="28" text-anchor="middle" class="s-title s-diagram-title">Snapshot (Memento)</text>
  <line x1="180" y1="33" x2="330" y2="33" class="s-diagram-line"/>
  <text x="188" y="48" class="s-member s-diagram-member">-text: str (private)</text>
  <text x="188" y="60" class="s-member s-diagram-member">+get_state(): str</text>
  <text x="188" y="72" class="s-member s-diagram-member">+get_date(): str</text>
  <rect x="350" y="30" width="120" height="70" class="s-box s-diagram-box"/>
  <text x="410" y="48" text-anchor="middle" class="s-title s-diagram-title">History (Caretaker)</text>
  <line x1="350" y1="53" x2="470" y2="53" class="s-diagram-line"/>
  <text x="358" y="68" class="s-member s-diagram-member">-snapshots: list</text>
  <text x="358" y="80" class="s-member s-diagram-member">+backup()</text>
  <text x="358" y="92" class="s-member s-diagram-member">+undo()</text>
  <line x1="160" y1="55" x2="180" y2="40" class="s-arr s-diagram-arrow"/>
  <text x="155" y="42" class="s-member s-diagram-member" style="font-size:8px">creates</text>
  <line x1="350" y1="60" x2="330" y2="50" class="s-arr s-diagram-arrow"/>
  <text x="324" y="44" class="s-member s-diagram-member" style="font-size:8px">stores</text>
</svg>`,
      code: {
        Python: `from datetime import datetime

# ── Snapshot (Memento) ─────────────────────────────────────────────────────────
# Immutable snapshot of Editor's state.
# ONLY Editor should read get_state() — Caretaker should only use get_date().
class Snapshot:
    def __init__(self, state: str):
        self._state: str = state                      # private — opaque to Caretaker
        self._date: str = datetime.now().isoformat()  # timestamp for display

    def get_state(self) -> str:
        """Returns the saved text — should only be called by Editor (Originator)."""
        return self._state

    def get_date(self) -> str:
        """Returns snapshot timestamp — safe for Caretaker to call (display only)."""
        return self._date[:19]  # trim microseconds for readability


# ── Editor (Originator) ────────────────────────────────────────────────────────
# Editor owns its state. It creates Snapshots AND restores from them.
# Internal format is fully hidden from History (Caretaker).
class Editor:
    def __init__(self):
        self._text: str = ""  # the private state being protected

    def type(self, text: str) -> None:
        """Append text to the buffer — a state-changing operation."""
        print(f"  Typing: '{text}'")
        self._text += text

    def backspace(self, n: int = 1) -> None:
        """Remove last n characters."""
        self._text = self._text[:-n]

    def save(self) -> Snapshot:
        """Originator creates its own Memento — packages private state internally.
        Returns a Snapshot that carries a copy of current state.
        History stores this opaque object without reading it."""
        return Snapshot(self._text)   # hand out an opaque snapshot

    def restore(self, snapshot: Snapshot) -> None:
        """Originator reads the Memento's state and applies it internally.
        This is the ONLY place that legitimately calls snapshot.get_state()."""
        self._text = snapshot.get_state()  # restore state from snapshot
        print(f"  [Restored to]: '{self._text}'")

    @property
    def text(self) -> str:
        return self._text


# ── History (Caretaker) ────────────────────────────────────────────────────────
# History knows WHEN to snapshot and undo — but NEVER inspects snapshot contents.
# It treats Snapshots as opaque tokens: stores them, returns them, that's it.
class History:
    def __init__(self, editor: Editor):
        self._editor = editor
        self._snapshots: list[Snapshot] = []  # the undo stack

    def backup(self) -> None:
        """Save a checkpoint BEFORE a state-changing operation."""
        snapshot = self._editor.save()  # Editor creates the Memento
        self._snapshots.append(snapshot)  # Caretaker stores it
        print(f"  [Checkpoint saved at {snapshot.get_date()}]")  # only reads date!

    def undo(self) -> None:
        """Pop the most recent checkpoint and restore Editor to it."""
        if not self._snapshots:
            print("  [Nothing to undo]")
            return
        snapshot = self._snapshots.pop()    # pop last Memento
        print(f"  [Undoing to checkpoint {snapshot.get_date()}]")
        self._editor.restore(snapshot)   # Editor restores itself from Memento

    def show_history(self) -> None:
        """Display all stored checkpoints by timestamp only (not state!)."""
        print("  Undo history:")
        for i, snap in enumerate(self._snapshots):
            print(f"    {i + 1}. {snap.get_date()}")  # only read safe metadata


# ── Client / Application ───────────────────────────────────────────────────────
print("=== Text Editor Undo Demo ===\\n")

editor  = Editor()
history = History(editor)         # Caretaker gets reference to Originator

# First typing session
history.backup()                  # save empty-state checkpoint
editor.type("Hello")
history.backup()                  # save after "Hello"
editor.type(", World")
history.backup()                  # save after "Hello, World"
editor.type("!")

print(f"\\nCurrent text: '{editor.text}'")

# Undo step by step
print("\\n-- Undo ---")
history.undo()                    # restores "Hello, World"
print(f"After undo 1: '{editor.text}'")

history.undo()                    # restores "Hello"
print(f"After undo 2: '{editor.text}'")

history.undo()                    # restores empty ""
print(f"After undo 3: '{editor.text}'")\

history.undo()                    # nothing to undo`,

        Go: `package main

import (
	"fmt"
	"time"
)

// ── Snapshot (Memento) ─────────────────────────────────────────────────────────
// Immutable value object — unexported fields ensure only Editor can create one.
type snapshot struct {
	text string    // private — Caretaker cannot access this
	date time.Time // timestamp for display
}

// GetDate returns safe metadata for Caretaker display — not the actual state
func (s *snapshot) GetDate() string { return s.date.Format("15:04:05") }

// ── Editor (Originator) ────────────────────────────────────────────────────────
// Editor creates and reads Snapshots. History can only store and return them.
type Editor struct {
	text string // private internal state
}

func (e *Editor) Type(text string) {
	fmt.Printf("  Typing: '%s'\\n", text)
	e.text += text // mutate state
}

func (e *Editor) Save() *snapshot {
	// Create a Memento with a copy of internal state
	return &snapshot{text: e.text, date: time.Now()}
}

func (e *Editor) Restore(s *snapshot) {
	// Only Editor reads the snapshot's private text field
	e.text = s.text
	fmt.Printf("  [Restored to]: '%s'\\n", e.text)
}

func (e *Editor) Text() string { return e.text }

// ── History (Caretaker) ────────────────────────────────────────────────────────
// Stores and manages Snapshots. Never reads snapshot.text — only snapshot.GetDate().
type History struct {
	editor    *Editor
	snapshots []*snapshot
}

func (h *History) Backup() {
	s := h.editor.Save() // Originator creates the Memento
	h.snapshots = append(h.snapshots, s)
	fmt.Printf("  [Checkpoint @ %s]\\n", s.GetDate())
}

func (h *History) Undo() {
	if len(h.snapshots) == 0 {
		fmt.Println("  [Nothing to undo]")
		return
	}
	last := h.snapshots[len(h.snapshots)-1]
	h.snapshots = h.snapshots[:len(h.snapshots)-1]
	h.editor.Restore(last) // Caretaker returns Memento to Originator
}

func main() {
	editor  := &Editor{}
	history := &History{editor: editor}

	history.Backup()
	editor.Type("Hello")
	history.Backup()
	editor.Type(", World")
	history.Backup()
	editor.Type("!")

	fmt.Printf("\\nCurrent: '%s'\\n", editor.Text())

	fmt.Println("\\n-- Undo --")
	history.Undo()
	fmt.Printf("After undo 1: '%s'\\n", editor.Text())
	history.Undo()
	fmt.Printf("After undo 2: '%s'\\n", editor.Text())
}`,

        Java: `import java.time.LocalTime;
import java.util.ArrayDeque;
import java.util.Deque;

// ── Snapshot (Memento) ─────────────────────────────────────────────────────────
// getDate() is public; getState() is package-private so Caretaker (different pkg) can't call it.
class Snapshot {
    private final String state;       // private — only Editor reads this
    private final LocalTime date;     // safe to expose for display

    Snapshot(String state) {           // package-private constructor — only Editor creates it
        this.state = state;
        this.date = LocalTime.now();
    }

    String getState() { return state; }  // package-private — Caretaker can't call this

    public String getDate() { return date.toString(); } // public — safe for Caretaker
}

// ── Editor (Originator) ────────────────────────────────────────────────────────
class Editor {
    private String text = ""; // the internal state being protected

    public void type(String text) {
        System.out.printf("  Typing: '%s'%n", text);
        this.text += text;
    }

    public Snapshot save() {
        // Editor creates a Memento — encapsulates its own state
        return new Snapshot(this.text);
    }

    public void restore(Snapshot snapshot) {
        // Only Editor legitimately reads the Memento's state
        this.text = snapshot.getState();
        System.out.printf("  [Restored to]: '%s'%n", this.text);
    }

    public String getText() { return text; }
}

// ── History (Caretaker) ────────────────────────────────────────────────────────
class History {
    private final Editor editor;
    private final Deque<Snapshot> stack = new ArrayDeque<>(); // undo stack

    History(Editor editor) { this.editor = editor; }

    public void backup() {
        Snapshot s = editor.save();      // Originator creates Memento
        stack.push(s);                   // Caretaker stores it
        System.out.printf("  [Checkpoint @ %s]%n", s.getDate()); // only reads date
    }

    public void undo() {
        if (stack.isEmpty()) { System.out.println("  [Nothing to undo]"); return; }
        editor.restore(stack.pop()); // return Memento to Originator
    }
}

class MementoDemo {
    public static void main(String[] args) {
        Editor editor = new Editor();
        History history = new History(editor);

        history.backup();
        editor.type("Hello");
        history.backup();
        editor.type(", World");
        history.backup();
        editor.type("!");

        System.out.printf("%nCurrent: '%s'%n%n-- Undo --%n", editor.getText());

        history.undo();
        System.out.printf("After undo 1: '%s'%n", editor.getText());
        history.undo();
        System.out.printf("After undo 2: '%s'%n", editor.getText());
    }
}`,

        TypeScript: `// ── Snapshot (Memento) ─────────────────────────────────────────────────────────
// Immutable snapshot. getDate() is public for Caretaker display;
// getState() should only be called by Editor (convention — use access modifiers in real code).
class Snapshot {
  private readonly state: string;   // private — only Editor reads this
  private readonly date: Date;

  constructor(state: string) {
    this.state = state;             // capture the state at this moment
    this.date = new Date();         // record the timestamp
  }

  /** Only the Originator (Editor) should call this. */
  getState(): string { return this.state; }

  /** Safe for Caretaker to call — exposes only metadata, not state. */
  getDate(): string { return this.date.toLocaleTimeString(); }
}

// ── Editor (Originator) ────────────────────────────────────────────────────────
class Editor {
  private text = ""; // the private state that gets snapshotted

  type(text: string): void {
    console.log(\`  Typing: '\${text}'\`);
    this.text += text; // state mutation
  }

  save(): Snapshot {
    // Editor creates its own Memento — state packaging stays internal
    return new Snapshot(this.text);
  }

  restore(snapshot: Snapshot): void {
    // ONLY Editor calls getState() — Caretaker never should
    this.text = snapshot.getState();
    console.log(\`  [Restored to]: '\${this.text}'\`);
  }

  getText(): string { return this.text; }
}

// ── History (Caretaker) ────────────────────────────────────────────────────────
// Manages the undo stack. Never calls snapshot.getState() — treats them as tokens.
class History {
  private snapshots: Snapshot[] = []; // undo stack

  constructor(private editor: Editor) {}

  backup(): void {
    const snapshot = this.editor.save();  // Originator creates Memento
    this.snapshots.push(snapshot);         // Caretaker stores it
    console.log(\`  [Checkpoint @ \${snapshot.getDate()}]\`); // safe: only reads date
  }

  undo(): void {
    const snapshot = this.snapshots.pop(); // pop last checkpoint
    if (!snapshot) { console.log("  [Nothing to undo]"); return; }
    this.editor.restore(snapshot); // return Memento to Originator for restoration
  }
}

// ── Client ─────────────────────────────────────────────────────────────────────
const editor  = new Editor();
const history = new History(editor);

history.backup();             // save empty state
editor.type("Hello");
history.backup();             // save "Hello"
editor.type(", World");
history.backup();             // save "Hello, World"
editor.type("!");

console.log(\`\\nCurrent: '\${editor.getText()}'\`);
console.log("\\n-- Undo --");

history.undo();
console.log(\`After undo 1: '\${editor.getText()}'\`); // "Hello, World"
history.undo();
console.log(\`After undo 2: '\${editor.getText()}'\`); // "Hello"`,

        Rust: `use std::time::{SystemTime, UNIX_EPOCH};

// ── Snapshot (Memento) ─────────────────────────────────────────────────────────
// Private fields — only Editor (same module) can read state.
// Caretaker in a different module can only call get_date().
struct Snapshot {
    state: String, // private — Caretaker must not access this
    ts: u64,       // unix timestamp for display
}

impl Snapshot {
    fn new(state: &str) -> Self {
        let ts = SystemTime::now().duration_since(UNIX_EPOCH)
            .unwrap_or_default().as_secs();
        Self { state: state.to_string(), ts }
    }

    // Safe metadata for Caretaker display
    fn get_date(&self) -> String { format!("t={}", self.ts) }
}

// ── Editor (Originator) ────────────────────────────────────────────────────────
struct Editor { text: String }

impl Editor {
    fn new() -> Self { Self { text: String::new() } }

    fn type_text(&mut self, text: &str) {
        println!("  Typing: '{}'", text);
        self.text.push_str(text); // mutate internal state
    }

    fn save(&self) -> Snapshot {
        Snapshot::new(&self.text) // Editor creates Memento from own state
    }

    fn restore(&mut self, snapshot: Snapshot) {
        self.text = snapshot.state.clone(); // only Originator reads .state
        println!("  [Restored to]: '{}'", self.text);
    }

    fn text(&self) -> &str { &self.text }
}

// ── History (Caretaker) ────────────────────────────────────────────────────────
struct History { snapshots: Vec<Snapshot> }

impl History {
    fn new() -> Self { Self { snapshots: vec![] } }

    fn backup(&mut self, editor: &Editor) {
        let s = editor.save();                   // Originator creates Memento
        println!("  [Checkpoint @ {}]", s.get_date());
        self.snapshots.push(s);                  // Caretaker stores opaque token
    }

    fn undo(&mut self, editor: &mut Editor) {
        match self.snapshots.pop() {
            Some(s) => editor.restore(s),  // return Memento to Originator
            None    => println!("  [Nothing to undo]"),
        }
    }
}

fn main() {
    let mut editor  = Editor::new();
    let mut history = History::new();

    history.backup(&editor);
    editor.type_text("Hello");
    history.backup(&editor);
    editor.type_text(", World");
    history.backup(&editor);
    editor.type_text("!");

    println!("\\nCurrent: '{}'\\n-- Undo --", editor.text());

    history.undo(&mut editor);
    println!("After undo 1: '{}'", editor.text());
    history.undo(&mut editor);
    println!("After undo 2: '{}'", editor.text());
}
`,
      },
      considerations: [
        "Memory: each Snapshot is a full copy of state — expensive for large objects; consider delta Mementos or copy-on-write strategies",
        "Immutability: Mementos should never be mutated after creation — use frozen/immutable types or deep copies",
        "Shallow vs deep copy: if state contains references to mutable objects, use deep copy in save() to avoid aliasing bugs",
        "Limiting history depth: cap the Caretaker's stack at N entries to prevent unbounded memory growth",
        "Serialisation: for persistent undo (survive crashes/restarts), serialise Mementos to disk; restore requires deserialisation logic in the Originator",
      ],
    },
  ],

  variantsTabLabel: "Snapshot Strategies",
  variantsBestPick:
    "Full-state Memento is simplest and safest. Use delta Mementos for objects that change frequently with large state (canvas pixels, game world).",

  variants: [
    {
      id: 1,
      name: "Full-State Memento",
      description:
        "Each Memento contains a complete deep copy of the Originator's state. Simple to implement and restore, but memory-intensive for large state or frequent snapshots.",
      code: {
        Python: `import copy

class FullStateMemento:
    """Stores a complete copy of state."""
    def __init__(self, state: dict):
        self._state = copy.deepcopy(state)  # deep copy — fully independent
    def get_state(self) -> dict:
        return copy.deepcopy(self._state)   # return copy to prevent aliasing

class Originator:
    def __init__(self):
        self._state = {}
    def save(self) -> FullStateMemento:
        return FullStateMemento(self._state)  # full snapshot
    def restore(self, m: FullStateMemento):
        self._state = m.get_state()`,
        Go: `type FullMemento struct { state map[string]interface{} }
func (o *Originator) Save() *FullMemento {
    // Deep copy state into memento
    cp := make(map[string]interface{})
    for k, v := range o.state { cp[k] = v }
    return &FullMemento{state: cp}
}
func (o *Originator) Restore(m *FullMemento) { o.state = m.state }`,
        Java: `record FullMemento(Map<String, Object> state) {
    FullMemento { state = Map.copyOf(state); } // immutable copy
}
class Originator {
    private Map<String, Object> state = new HashMap<>();
    FullMemento save() { return new FullMemento(state); }
    void restore(FullMemento m) { state = new HashMap<>(m.state()); }
}`,
        TypeScript: `class FullMemento {
  constructor(private readonly state: Record<string, unknown>) {
    this.state = structuredClone(state); // deep copy
  }
  getState() { return structuredClone(this.state); }
}`,
        Rust: `#[derive(Clone)]
struct FullMemento { state: HashMap<String, String> }
impl Originator {
    fn save(&self) -> FullMemento { FullMemento { state: self.state.clone() } }
    fn restore(&mut self, m: FullMemento) { self.state = m.state; }
}`,
      },
      pros: ["Simple, always correct", "Restore is O(state size) — predictable"],
      cons: ["Memory usage = N_snapshots × state_size", "Slow for large objects if snapshots are frequent"],
    },
    {
      id: 2,
      name: "Delta Memento (Incremental Snapshot)",
      description:
        "Each Memento stores only the diff between current state and previous state. Memory-efficient for frequent small changes, but restore requires replaying diffs from a base snapshot.",
      code: {
        Python: `class DeltaMemento:
    """Stores only the changed fields (delta)."""
    def __init__(self, changed_fields: dict):
        self._delta = changed_fields.copy()  # only what changed
    def get_delta(self) -> dict:
        return self._delta

class DeltaOriginator:
    def __init__(self):
        self._state = {}
        self._base_snapshot: dict = {}      # full base snapshot
        self._deltas: list[DeltaMemento] = []  # list of deltas

    def change(self, key: str, value):
        old = self._state.get(key)
        self._state[key] = value
        # Record only the reverse delta (what to revert)
        self._deltas.append(DeltaMemento({key: old}))

    def undo(self):
        if not self._deltas: return
        delta = self._deltas.pop()
        for k, v in delta.get_delta().items():
            if v is None: del self._state[k]   # key didn't exist before
            else: self._state[k] = v            # restore old value`,
        Go: `type DeltaMemento struct { reverseDelta map[string]interface{} }
type DeltaOriginator struct {
    state  map[string]interface{}
    deltas []DeltaMemento
}
func (o *DeltaOriginator) Set(key string, val interface{}) {
    old := o.state[key]
    o.state[key] = val
    o.deltas = append(o.deltas, DeltaMemento{reverseDelta: map[string]interface{}{key: old}})
}`,
        Java: `record DeltaMemento(Map<String, Object> reverseDelta) {}
class DeltaOriginator {
    private Map<String, Object> state = new HashMap<>();
    private Deque<DeltaMemento> deltas = new ArrayDeque<>();
    void set(String key, Object value) {
        Object old = state.get(key);
        state.put(key, value);
        deltas.push(new DeltaMemento(Map.of(key, old != null ? old : NULL_SENTINEL)));
    }
}`,
        TypeScript: `interface Delta { [key: string]: unknown }
class DeltaOriginator {
  private state: Record<string, unknown> = {};
  private deltas: Delta[] = [];
  set(key: string, value: unknown) {
    const old = this.state[key]; // capture old value for reverse delta
    this.state[key] = value;
    this.deltas.push({ [key]: old }); // store only the reverse delta
  }
  undo() {
    const delta = this.deltas.pop();
    if (delta) Object.assign(this.state, delta); // apply reverse delta
  }
}`,
        Rust: `struct DeltaMemento { key: String, old_value: Option<String> }
struct DeltaOriginator {
    state: HashMap<String, String>,
    deltas: Vec<DeltaMemento>,
}
impl DeltaOriginator {
    fn set(&mut self, key: &str, value: String) {
        let old = self.state.insert(key.to_string(), value);
        self.deltas.push(DeltaMemento { key: key.to_string(), old_value: old });
    }
}`,
      },
      pros: ["Memory-efficient — only changed fields stored", "Fast for small incremental changes"],
      cons: ["Restore requires replaying all deltas from base — potentially slow for long history", "Complex to implement correctly (null vs missing vs zero value edge cases)"],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Behavioral" },
    { aspect: "Intent", detail: "Capture and restore an object's internal state without exposing its private implementation" },
    { aspect: "Core Mechanism", detail: "Originator.save() → Memento (opaque). Caretaker stores Memento. Originator.restore(Memento) → state reverted." },
    { aspect: "Encapsulation", detail: "Only the Originator reads Memento internals. Caretaker treats Mementos as opaque tokens — never calls getState()." },
    { aspect: "Memory", detail: "Full-state Mementos are simple but O(N×state_size). Delta Mementos are efficient but complex. Cap history depth to bound memory." },
    { aspect: "Common Pairings", detail: "Command + Memento: each Command saves a Memento; undo restores it. Iterator over history: navigate forward/backward in snapshots." },
    { aspect: "Immutability", detail: "Mementos should be immutable value objects — no setters after construction to prevent history corruption" },
    { aspect: "When to Use", detail: "Undo/redo, game save/load, transaction rollback, state checkpoint, form back-navigation, parser backtracking" },
    { aspect: "Language Support", detail: "Languages with copy constructors, deepcopy, or record types make Memento natural. Use immutable records where possible." },
  ],

  antiPatterns: [
    {
      name: "Caretaker Reading Memento Internals",
      description:
        "The Caretaker calls memento.getState() to inspect or display state. This couples the Caretaker to the Originator's state format and breaks encapsulation.",
      betterAlternative:
        "Expose only metadata from Memento (timestamp, label, size). Keep state fields private or package-private. Only the Originator reads state fields via a trusted access channel.",
    },
    {
      name: "Mutable Mementos",
      description:
        "The Memento class has setters or allows state to be modified after creation. A Caretaker accidentally (or maliciously) modifies a Memento, corrupting the history.",
      betterAlternative:
        "Make Mementos immutable: no setters, final/readonly/const fields, deep copy in the constructor. Use record types (Java 16+, Python dataclass frozen=True, TypeScript readonly).",
    },
    {
      name: "Unbounded History Growth",
      description:
        "The Caretaker pushes snapshots indefinitely. A long-running application accumulates thousands of Mementos, exhausting heap memory — especially with large state objects.",
      betterAlternative:
        "Cap history depth (deque with maxlen, or evict oldest when limit exceeded). For large state, use delta Mementos or compress serialised snapshots. Make the history cap configurable.",
    },
  ],
};

export default mementoData;
