import { PatternData } from "@/lib/patterns/types";

const iteratorData: PatternData = {
  slug: "iterator",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Iterator Pattern",
  subtitle:
    "Provide a way to sequentially access elements of a collection without exposing its underlying representation.",

  intent:
    "Collections — arrays, trees, graphs, hash maps, linked lists — store their elements in completely different ways. Yet clients often just want to iterate over them. If clients access the collection's internals directly (e.g., using array indices, pointer following, or key enumeration), they become tightly coupled to the data structure's implementation.\n\nThe Iterator pattern extracts the traversal logic into a separate Iterator object. The collection exposes a createIterator() method that returns an iterator. The client uses the iterator's standard interface (hasNext(), next()) without knowing anything about how elements are stored.\n\nThis enables: multiple simultaneous traversals of the same collection (each iterator has its own cursor), traversals in different orders (forward, reverse, depth-first, breadth-first) without changing the collection, and uniform iteration over any collection type including lazy/infinite sequences.",

  classDiagramSvg: `<svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#it-arr); }
    .s-dash { stroke-dasharray:5,3; }
  </style>
  <defs>
    <marker id="it-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Iterator Interface -->
  <rect x="10" y="10" width="210" height="75" class="s-box s-diagram-box"/>
  <text x="115" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Iterator</text>
  <line x1="10" y1="33" x2="220" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+hasNext(): bool</text>
  <text x="20" y="64" class="s-member s-diagram-member">+next(): T</text>
  <text x="20" y="78" class="s-member s-diagram-member">+reset(): void</text>
  <!-- ConcreteIterator -->
  <rect x="10" y="140" width="210" height="60" class="s-box s-diagram-box"/>
  <text x="115" y="158" text-anchor="middle" class="s-title s-diagram-title">ConcreteIterator</text>
  <line x1="10" y1="163" x2="220" y2="163" class="s-diagram-line"/>
  <text x="20" y="180" class="s-member s-diagram-member">-collection: ConcreteCollection</text>
  <text x="20" y="194" class="s-member s-diagram-member">-cursor: int</text>
  <!-- Iterable Interface -->
  <rect x="330" y="10" width="220" height="60" class="s-box s-diagram-box"/>
  <text x="440" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Iterable</text>
  <line x1="330" y1="33" x2="550" y2="33" class="s-diagram-line"/>
  <text x="340" y="50" class="s-member s-diagram-member">+createIterator(): Iterator</text>
  <!-- ConcreteCollection -->
  <rect x="330" y="130" width="220" height="70" class="s-box s-diagram-box"/>
  <text x="440" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteCollection</text>
  <line x1="330" y1="153" x2="550" y2="153" class="s-diagram-line"/>
  <text x="340" y="170" class="s-member s-diagram-member">-items: T[]</text>
  <text x="340" y="184" class="s-member s-diagram-member">+createIterator(): Iterator</text>
  <!-- Arrows -->
  <line x1="115" y1="140" x2="115" y2="85" class="s-arr s-diagram-arrow"/>
  <line x1="440" y1="130" x2="440" y2="70" class="s-arr s-diagram-arrow"/>
  <line x1="220" y1="170" x2="330" y2="165" class="s-arr s-diagram-arrow s-dash"/>
  <text x="248" y="162" class="s-member s-diagram-member">creates</text>
</svg>`,

  diagramExplanation:
    "The Iterator interface declares hasNext(), next(), and optionally reset(). The Iterable (Collection) interface declares createIterator() — the factory method that produces an iterator. ConcreteCollection implements Iterable and returns a ConcreteIterator pointing to itself. ConcreteIterator holds a reference to the collection and a cursor (current position). When next() is called, it returns the item at cursor and advances cursor. ConcreteIterator can be instantiated multiple times from the same collection, with each instance maintaining its own independent cursor — enabling parallel traversals.",

  diagramComponents: [
    {
      name: "Iterator (interface)",
      description:
        "Declares the traversal interface: hasNext() to check if more elements exist, next() to return the current element and advance, and optionally reset() to restart. Clients only depend on this interface.",
    },
    {
      name: "ConcreteIterator",
      description:
        "Holds the actual traversal state (cursor/pointer into the collection). Implements the traversal algorithm — forward, reverse, tree DFS/BFS, filtered iteration, etc. References the collection to access its elements.",
    },
    {
      name: "Iterable / Collection (interface)",
      description:
        "Declares createIterator() which acts as a factory method. Any collection that implements this can be iterated by any client without exposing its internal structure.",
    },
    {
      name: "ConcreteCollection",
      description:
        "Implements the Iterable interface. Returns a ConcreteIterator configured for the collection's specific data structure. May return different iterator types for different traversal orders.",
    },
  ],

  solutionDetail:
    "**Standard Iterator Protocol**: Nearly all modern languages have built-in iterator protocols:\n- Python: `__iter__` returns self, `__next__` returns next item or raises StopIteration\n- JavaScript/TypeScript: Symbol.iterator returns `{next(): {value, done}}`\n- Java: Iterable<T> + Iterator<T> with hasNext()/next()\n- Rust: Iterator trait with next() -> Option<Item>\n- Go: No built-in iterator; convention-based channel or struct pattern\n\n**External vs Internal Iterator**:\n- External: Client drives iteration (calls next() explicitly). More flexible — client controls loop, can pause, combine multiple iterators\n- Internal: Collection drives iteration (collection.forEach(callback)). Simpler for caller but less control over loop flow\n\n**Lazy Iterators / Generators**: Modern languages support generator functions that yield items on demand — infinite sequences, on-demand computation, memory-efficient processing of large datasets.\n\n**Composite + Iterator**: Often combined with Composite pattern for traversing tree structures. A tree iterator can implement DFS or BFS traversal of a composite tree without the client knowing the difference.",

  characteristics: [
    "Decouples traversal algorithm from the collection's data structure",
    "Multiple simultaneous iterators on the same collection — each has its own cursor",
    "Uniform interface over different collection types (List, Tree, Graph, etc.)",
    "Iterator encapsulates traversal state — client doesn't manage indices or pointers",
    "Supports different traversal orders via different ConcreteIterator implementations",
    "Lazy evaluation possible — items computed on demand (generators, streams)",
    "Built into the stdlib of virtually all modern languages",
  ],

  useCases: [
    {
      id: 1,
      title: "Paginated API Result Traversal",
      domain: "Backend / API",
      description:
        "An API returns paginated results. The caller wants to iterate over all records without managing page tokens, offset calculations, or fetching logic.",
      whySingleton:
        "PaginatedIterator encapsulates page fetching and token management. Client calls next() and gets the next record — no knowledge of pages needed.",
      code: `class PaginatedIterator:
    def __init__(self, url: str):
        self._url, self._buffer, self._token = url, [], None
    def __next__(self):
        if not self._buffer: self._fetch_page()
        if not self._buffer: raise StopIteration
        return self._buffer.pop(0)`,
    },
    {
      id: 2,
      title: "File System Tree Traversal",
      domain: "OS / Tools",
      description:
        "A backup tool needs to traverse a directory tree, visiting every file. The traversal could be DFS or BFS, and the tree structure should be hidden from the backup logic.",
      whySingleton:
        "FileSystemIterator provides DFS traversal. Client calls next() and gets the next file path. Switching to BFS is creating a different iterator — zero client code changes.",
      code: `class DFSFileIterator:
    def __init__(self, root: Path):
        self._stack = [root]  # DFS uses stack
    def __next__(self):
        while self._stack:
            path = self._stack.pop()
            if path.is_dir():
                self._stack.extend(path.iterdir())
            else: return path
        raise StopIteration`,
    },
    {
      id: 3,
      title: "Database Result Set Cursor",
      domain: "Backend / Data Layer",
      description:
        "A database query returns potentially millions of rows. Loading all rows into memory is infeasible. The client wants to iterate one row at a time using a cursor.",
      whySingleton:
        "DatabaseCursorIterator wraps the DB cursor. Client iterates over rows with next() without knowing about result set buffering, fetch sizes, or cursor management.",
      code: `class DBCursorIterator:
    def __init__(self, cursor):
        self._cursor = cursor
    def __next__(self):
        row = self._cursor.fetchone()
        if row is None: raise StopIteration
        return row`,
    },
    {
      id: 4,
      title: "Binary Search Tree In-Order",
      domain: "Computer Science / Algorithms",
      description:
        "A BST needs to be traversed in sorted (in-order) sequence. The traversal algorithm (left-root-right with an explicit stack) should be hidden from the client.",
      whySingleton:
        "InOrderIterator encapsulates the stack-based DFS traversal. Client iterates with next() and gets elements in sorted order without knowing the tree structure.",
      code: `class InOrderBSTIterator:
    def __init__(self, root):
        self._stack = []
        self._push_left(root)
    def _push_left(self, node):
        while node:
            self._stack.append(node)
            node = node.left`,
    },
    {
      id: 5,
      title: "CSV / Log File Line Iterator",
      domain: "Data Processing / ETL",
      description:
        "A log analysis tool processes millions of log lines. Reading all lines into memory would exhaust RAM. The tool iterates line by line lazily.",
      whySingleton:
        "FileLineIterator reads one line at a time from disk. Client iterates without knowing about file handles, buffering, or EOF detection.",
      code: `class FileLineIterator:
    def __init__(self, path: str):
        self._file = open(path, 'r')
    def __next__(self) -> str:
        line = self._file.readline()
        if not line: self._file.close(); raise StopIteration
        return line.rstrip()`,
    },
    {
      id: 6,
      title: "Graph BFS / DFS Traversal",
      domain: "Computer Science / Algorithms",
      description:
        "A social network analysis tool needs to traverse a user graph. Depending on the use case, BFS (shortest path) or DFS (deep exploration) is required without changing client code.",
      whySingleton:
        "BFSIterator and DFSIterator both implement the Iterator interface. Client code doesn't change — only the iterator type changes to switch traversal algorithm.",
      code: `class BFSGraphIterator:
    def __init__(self, start_node, graph):
        from collections import deque
        self._queue = deque([start_node])
        self._visited = {start_node}
        self._graph = graph`,
    },
    {
      id: 7,
      title: "Infinite Sequence Generator",
      domain: "Mathematics / Streaming",
      description:
        "A Fibonacci number generator produces an infinite sequence. Client consumes as many numbers as needed without the generator knowing how many to produce.",
      whySingleton:
        "FibonacciIterator is a lazy iterator that computes the next value on demand. It never terminates — client decides when to stop consuming by breaking the loop.",
      code: `class FibonacciIterator:
    def __init__(self):
        self._a, self._b = 0, 1
    def __next__(self) -> int:
        value = self._a
        self._a, self._b = self._b, self._a + self._b
        return value`,
    },
    {
      id: 8,
      title: "Filtered / Transformed Data Stream",
      domain: "Functional Programming",
      description:
        "A data pipeline filters and transforms records. FilterIterator and MapIterator wrap other iterators — composing transformations without materialising intermediate collections.",
      whySingleton:
        "FilterIterator wraps another iterator and skips elements that don't match a predicate. MapIterator transforms each element. Both are lazy — no intermediate lists are created.",
      code: `class FilterIterator:
    def __init__(self, source, predicate):
        self._source = iter(source)
        self._pred = predicate
    def __next__(self):
        while True:
            item = next(self._source)  # raises StopIteration when done
            if self._pred(item): return item`,
    },
    {
      id: 9,
      title: "Inventory / Catalog Browsing",
      domain: "E-Commerce",
      description:
        "An e-commerce catalog has products organised in multiple categories stored in different data structures. A universal product iterator allows a shopping cart to enumerate all products uniformly.",
      whySingleton:
        "Each category collection returns its own ConcreteIterator. A CompositeIterator chains multiple iterators together, presenting one unified sequence to the shopping cart viewer.",
      code: `class CompositeIterator:
    def __init__(self, iterators: list):
        self._iters = iter(iterators)
        self._current = next(self._iters)
    def __next__(self):
        try: return next(self._current)
        except StopIteration:
            self._current = next(self._iters)
            return next(self._current)`,
    },
    {
      id: 10,
      title: "Configuration Key Enumeration",
      domain: "DevOps / Platform Engineering",
      description:
        "Application config can come from files, environment variables, or a secrets manager. A unified config iterator enumerates all keys from all sources.",
      whySingleton:
        "Each config source implements Iterable. A merged ConfigIterator transparently sequences through all sources. Client code enumerates config keys universally.",
      code: `class MergedConfigIterator:
    def __init__(self, sources: list):
        self._chain = itertools.chain(*sources)
    def __next__(self):
        return next(self._chain)`,
    },
    {
      id: 11,
      title: "Event History Replay",
      domain: "Event Sourcing / CQRS",
      description:
        "An event store holds millions of domain events. Replaying events to rebuild state requires iterating the event history chronologically without loading all events into memory.",
      whySingleton:
        "EventStoreIterator fetches events in batches from the database, presenting one event at a time. The replay engine sees a clean sequential iterator — no pagination logic.",
      code: `class EventStoreIterator:
    def __init__(self, aggregate_id: str, from_seq: int = 0):
        self._id = aggregate_id
        self._seq = from_seq
        self._buffer: list = []
    def __next__(self):
        if not self._buffer: self._fetch_batch()
        if not self._buffer: raise StopIteration
        return self._buffer.pop(0)`,
    },
    {
      id: 12,
      title: "Regex Match Iterator",
      domain: "Text Processing",
      description:
        "A text analyser needs to extract all matches of a regular expression from a large document one at a time, without finding all matches upfront.",
      whySingleton:
        "RegexMatchIterator returns the next match on each next() call, resuming from where the last match ended. Memory is O(1) in match objects regardless of document size.",
      code: `class RegexMatchIterator:
    def __init__(self, pattern: str, text: str):
        import re
        self._matches = re.finditer(pattern, text)
    def __next__(self):
        return next(self._matches)  # raises StopIteration at end`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Custom Linked List Iterator",
      domain: "Data Structures",
      problem:
        "A custom singly-linked list is used throughout an application. Client code needs to iterate over it, but directly working with node.next pointers couples clients to the storage structure. If the structure changes (e.g., to a doubly-linked list), all client traversal code breaks.",
      solution:
        "LinkedList implements Iterable and returns a LinkedListIterator. The iterator holds a pointer to the current node (cursor). hasNext() checks if the current node is not null. next() returns current node's value and advances the cursor to node.next. The client iterates with a standard for-each or while(hasNext()) loop — no knowledge of nodes or pointers needed.",
      classDiagramSvg: `<svg viewBox="0 0 480 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#it-e1);}</style>
  <defs><marker id="it-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="150" height="55" class="s-box s-diagram-box"/>
  <text x="85" y="28" text-anchor="middle" class="s-title s-diagram-title">LinkedList</text>
  <line x1="10" y1="33" x2="160" y2="33" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">-head: Node</text>
  <text x="18" y="60" class="s-member s-diagram-member">+createIterator()</text>
  <rect x="240" y="10" width="220" height="70" class="s-box s-diagram-box"/>
  <text x="350" y="28" text-anchor="middle" class="s-title s-diagram-title">LinkedListIterator</text>
  <line x1="240" y1="33" x2="460" y2="33" class="s-diagram-line"/>
  <text x="248" y="48" class="s-member s-diagram-member">-current: Node</text>
  <text x="248" y="60" class="s-member s-diagram-member">+hasNext(): bool</text>
  <text x="248" y="72" class="s-member s-diagram-member">+next(): T</text>
  <rect x="10" y="105" width="150" height="30" class="s-box s-diagram-box"/>
  <text x="85" y="118" text-anchor="middle" class="s-title s-diagram-title">Node (inner)</text>
  <text x="18" y="130" class="s-member s-diagram-member">value, next: Node</text>
  <line x1="160" y1="38" x2="240" y2="38" class="s-arr s-diagram-arrow"/>
  <text x="178" y="33" class="s-member s-diagram-member">creates</text>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from typing import TypeVar, Generic, Optional, Iterator

T = TypeVar('T')

# ── Node: internal building block of the linked list ──────────────────────────
# Node is an implementation detail — clients never interact with it directly.
class Node(Generic[T]):
    def __init__(self, value: T):
        self.value: T = value          # the data held by this node
        self.next: Optional[Node[T]] = None  # link to next node


# ── LinkedListIterator: encapsulates traversal state ─────────────────────────
# This class owns the traversal cursor — clients don't track current nodes.
class LinkedListIterator(Generic[T]):
    def __init__(self, head: Optional[Node[T]]):
        self._current: Optional[Node[T]] = head  # cursor points to current node

    def __iter__(self) -> LinkedListIterator[T]:
        return self  # iterator is its own iterable (Python protocol)

    def __next__(self) -> T:
        if self._current is None:
            raise StopIteration  # signals end of collection to for-loops
        value = self._current.value   # capture current node's value
        self._current = self._current.next  # advance cursor to next node
        return value


# ── LinkedList: the collection — implements the Iterable protocol ─────────────
# LinkedList manages nodes internally. It exposes createIterator (via __iter__).
# Clients iterate without ever knowing about Node or next pointers.
class LinkedList(Generic[T]):
    def __init__(self):
        self._head: Optional[Node[T]] = None  # head of the list
        self._tail: Optional[Node[T]] = None  # tail for O(1) append
        self._size: int = 0

    def append(self, value: T) -> None:
        # Add new node at tail
        new_node = Node(value)
        if self._tail is None:
            self._head = self._tail = new_node  # first element
        else:
            self._tail.next = new_node  # link old tail to new node
            self._tail = new_node       # update tail pointer
        self._size += 1

    def __iter__(self) -> LinkedListIterator[T]:
        # Factory method: creates a fresh iterator starting from the head
        # Each call returns a NEW iterator with its own cursor — enabling
        # multiple simultaneous traversals on the same list.
        return LinkedListIterator(self._head)

    def __len__(self) -> int:
        return self._size


# ── Client code ───────────────────────────────────────────────────────────────
# Client uses standard Python iteration — no knowledge of Node structure.
names = LinkedList[str]()
names.append("Alice")
names.append("Bob")
names.append("Carol")

print("Forward iteration:")
for name in names:  # Python calls names.__iter__() automatically
    print(f"  {name}")

# Demonstrate two simultaneous iterators
print("\\nSimultaneous iterators:")
it1 = iter(names)  # first cursor
it2 = iter(names)  # second cursor — completely independent
print(f"  it1: {next(it1)}")  # Alice (cursor 1 advances)
print(f"  it2: {next(it2)}")  # Alice (cursor 2 is at start, untouched)
print(f"  it1: {next(it1)}")  # Bob

# Filter using iterator — no linked list knowledge needed
print("\\nFiltered iteration (names starting with 'A' or 'C'):")
filtered = [name for name in names if name[0] in ('A', 'C')]
print(f"  {filtered}")`,

        Go: `package main

import "fmt"

// ── Node: internal linked list node ──────────────────────────────────────────
// Node is NOT exported — it's an implementation detail of LinkedList.
type node[T any] struct {
	value T
	next  *node[T]
}

// ── Iterator Interface ────────────────────────────────────────────────────────
// All iterators implement this — client code depends only on this interface.
type Iterator[T any] interface {
	HasNext() bool
	Next() T
}

// ── LinkedListIterator: holds the traversal cursor ───────────────────────────
// Independent per-creation: each call to CreateIterator() gives a new cursor.
type linkedListIterator[T any] struct {
	current *node[T] // cursor: points to the next node to be returned
}

func (it *linkedListIterator[T]) HasNext() bool {
	return it.current != nil // true if there are more nodes to return
}

func (it *linkedListIterator[T]) Next() T {
	// Return current value then advance cursor
	value := it.current.value
	it.current = it.current.next // move cursor forward
	return value
}

// ── LinkedList: the collection ────────────────────────────────────────────────
// Clients never access head/tail. They iterate via CreateIterator().
type LinkedList[T any] struct {
	head *node[T] // first node (or nil if empty)
	tail *node[T] // last node for O(1) append
	size int
}

func (l *LinkedList[T]) Append(value T) {
	n := &node[T]{value: value}
	if l.tail == nil {
		l.head = n; l.tail = n // empty list
	} else {
		l.tail.next = n // link old tail to new node
		l.tail = n      // update tail
	}
	l.size++
}

// CreateIterator is the Iterator factory method.
// Returns a fresh iterator — each call gets its own independent cursor.
func (l *LinkedList[T]) CreateIterator() Iterator[T] {
	return &linkedListIterator[T]{current: l.head}
}

func main() {
	list := &LinkedList[string]{}
	list.Append("Alice")
	list.Append("Bob")
	list.Append("Carol")

	fmt.Println("Forward iteration:")
	it := list.CreateIterator()
	for it.HasNext() { // client drives via standard hasNext/next
		fmt.Printf("  %s\\n", it.Next())
	}

	// Two simultaneous traversals — each iterator is independent
	fmt.Println("\\nSimultaneous iterators:")
	it1 := list.CreateIterator()
	it2 := list.CreateIterator()
	fmt.Printf("  it1: %s\\n", it1.Next()) // Alice
	fmt.Printf("  it2: %s\\n", it2.Next()) // Alice (it2 started over)
	fmt.Printf("  it1: %s\\n", it1.Next()) // Bob  (it1 advanced)
}`,

        Java: `import java.util.Iterator;
import java.util.NoSuchElementException;

// ── Node: internal implementation detail ─────────────────────────────────────
// Package-private — clients never see or touch Node objects.
class Node<T> {
    T value;          // the element stored in this node
    Node<T> next;     // link to the next node in the chain

    Node(T value) { this.value = value; }
}

// ── LinkedList: Iterable collection ──────────────────────────────────────────
// Implements Iterable<T> — enables for-each loops and Stream support.
// Clients interact with the list through this class only.
class LinkedList<T> implements Iterable<T> {
    private Node<T> head; // first node
    private Node<T> tail; // last node (for O(1) append)
    private int size;

    public void append(T value) {
        Node<T> newNode = new Node<>(value);
        if (tail == null) { head = tail = newNode; } // empty list
        else { tail.next = newNode; tail = newNode; } // link and update tail
        size++;
    }

    // Iterator factory method — each call returns a new independent cursor
    @Override
    public Iterator<T> iterator() {
        return new LinkedListIterator<>(head);
    }

    public int size() { return size; }
}

// ── LinkedListIterator: encapsulates traversal state ─────────────────────────
// Implements java.util.Iterator<T> — works with for-each, Stream, etc.
class LinkedListIterator<T> implements Iterator<T> {
    private Node<T> current; // cursor: the node whose value will be returned next

    LinkedListIterator(Node<T> head) {
        this.current = head; // cursor starts at head
    }

    @Override
    public boolean hasNext() {
        return current != null; // true while cursor hasn't gone past the end
    }

    @Override
    public T next() {
        if (!hasNext()) throw new NoSuchElementException();
        T value = current.value;    // capture value at cursor
        current = current.next;     // advance cursor to next node
        return value;
    }
}

class IteratorDemo {
    public static void main(String[] args) {
        var list = new LinkedList<String>();
        list.append("Alice");
        list.append("Bob");
        list.append("Carol");

        // Java for-each calls list.iterator() automatically
        System.out.println("Forward iteration:");
        for (String name : list) {
            System.out.println("  " + name);
        }

        // Two simultaneous traversals — independent cursors
        System.out.println("\\nSimultaneous iterators:");
        var it1 = list.iterator();
        var it2 = list.iterator();
        System.out.println("  it1: " + it1.next()); // Alice
        System.out.println("  it2: " + it2.next()); // Alice (independent)
        System.out.println("  it1: " + it1.next()); // Bob
    }
}`,

        TypeScript: `// ── Node: internal linked list implementation detail ─────────────────────────
// Node is NOT exported — clients should never access nodes directly.
class Node<T> {
  value: T;
  next: Node<T> | null = null; // pointer to next node

  constructor(value: T) { this.value = value; }
}

// ── LinkedListIterator: owns the traversal cursor ────────────────────────────
// Implements JavaScript's iterator protocol ({value, done}).
// Each instance has its own cursor — parallel traversals are safe.
class LinkedListIterator<T> implements Iterator<T> {
  private current: Node<T> | null; // cursor

  constructor(head: Node<T> | null) {
    this.current = head; // cursor starts at the head
  }

  next(): IteratorResult<T> {
    if (this.current === null) {
      return { value: undefined as unknown as T, done: true }; // sentinel
    }
    const value = this.current.value; // capture current value
    this.current = this.current.next; // advance cursor
    return { value, done: false };
  }
}

// ── LinkedList: iterable collection ──────────────────────────────────────────
// Implements the Symbol.iterator protocol — enables for-of loops natively.
class LinkedList<T> implements Iterable<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private _size = 0;

  append(value: T): void {
    const newNode = new Node(value);
    if (this.tail === null) {
      this.head = this.tail = newNode; // first element
    } else {
      this.tail.next = newNode; // link to tail
      this.tail = newNode;      // update tail
    }
    this._size++;
  }

  // Iterator factory: each call creates a fresh iterator with its own cursor
  [Symbol.iterator](): Iterator<T> {
    return new LinkedListIterator<T>(this.head);
  }

  get size() { return this._size; }
}

// ── Client code ───────────────────────────────────────────────────────────────
// Uses standard for-of — no knowledge of Node or pointers.
const list = new LinkedList<string>();
list.append("Alice");
list.append("Bob");
list.append("Carol");

console.log("Forward iteration:");
for (const name of list) { // TS calls list[Symbol.iterator]() automatically
  console.log(\`  \${name}\`);
}

// Multiple simultaneous iterators
console.log("\\nSimultaneous iterators:");
const it1 = list[Symbol.iterator]();
const it2 = list[Symbol.iterator]();
console.log("  it1:", it1.next().value); // Alice
console.log("  it2:", it2.next().value); // Alice (independent)
console.log("  it1:", it1.next().value); // Bob   (cursor 1 advanced)

// Spread operator uses the iterator protocol
const aliceFirst = [...list].filter(n => n.startsWith("A") || n.startsWith("C"));
console.log("\\nFiltered:", aliceFirst);`,

        Rust: `// Rust's Iterator trait is built into the standard library.
// We implement it on our LinkedList for native for-loop and iterator adapter support.

// ── Node: internal linked list node ──────────────────────────────────────────
struct Node<T> {
    value: T,
    next: Option<Box<Node<T>>>, // Box to avoid infinite-size type
}

// ── LinkedList: the collection ────────────────────────────────────────────────
struct LinkedList<T> {
    head: Option<Box<Node<T>>>, // first node or None if empty
}

impl<T> LinkedList<T> {
    fn new() -> Self { Self { head: None } }

    fn push_front(&mut self, value: T) {
        // O(1) insert at front — simplest form for illustration
        let new_node = Box::new(Node {
            value,
            next: self.head.take(), // new node points to old head
        });
        self.head = Some(new_node);
    }

    // Returns an iterator over references to values
    fn iter(&self) -> LinkedListIter<T> {
        LinkedListIter { current: self.head.as_deref() }
    }
}

// ── LinkedListIter: iterator with its own cursor ─────────────────────────────
// Holds an optional reference to the current node.
// 'a lifetime ties the iterator to the list's lifetime.
struct LinkedListIter<'a, T> {
    current: Option<&'a Node<T>>, // cursor: reference to current node
}

// Implement the standard Iterator trait — enables for-in loops + all adapters
impl<'a, T> Iterator for LinkedListIter<'a, T> {
    type Item = &'a T; // yields references to values

    fn next(&mut self) -> Option<Self::Item> {
        // Take current node, advance cursor, return value
        self.current.map(|node| {
            self.current = node.next.as_deref(); // advance cursor
            &node.value                          // return value reference
        })
    }
}

fn main() {
    let mut list = LinkedList::new();
    list.push_front("Carol");
    list.push_front("Bob");
    list.push_front("Alice"); // Alice is now at head

    println!("Forward iteration:");
    for name in list.iter() {
        println!("  {}", name);
    }

    // Iterator adapters work automatically via the Iterator trait
    let filtered: Vec<&&str> = list.iter().filter(|n| n.starts_with('A')).collect();
    println!("\\nFiltered: {:?}", filtered);

    let count = list.iter().count();
    println!("Count: {}", count);
}
`,
      },
      considerations: [
        "Concurrent modification: if the collection changes during iteration, the iterator may behave unexpectedly — either throw ConcurrentModificationException or produce stale data",
        "Stateful iterators are not thread-safe by default — create separate iterators per thread",
        "Lazy iterators (generators) are more memory-efficient for large datasets but cannot be reset or re-iterated without re-creation",
        "Consider implementing both forward and backward iterators for doubly-linked structures",
        "In languages with built-in iterator protocols, always prefer implementing them over custom interfaces",
      ],
    },
  ],

  variantsTabLabel: "Traversal Strategies",
  variantsBestPick:
    "External Iterator is the most flexible form and the GoF standard. Use Internal Iterator (forEach) when traversal control is not needed by the client.",

  variants: [
    {
      id: 1,
      name: "External Iterator (Client-Driven)",
      description:
        "The client drives iteration by calling hasNext() and next() explicitly. Offers maximum control — the client can pause, combine iterators, or stop early.",
      code: {
        Python: `class ExternalIterator:
    """Client drives iteration step by step."""
    def __init__(self, items: list):
        self._items = items
        self._index = 0  # client-visible cursor

    def has_next(self) -> bool:
        return self._index < len(self._items)

    def next(self):
        if not self.has_next():
            raise StopIteration
        item = self._items[self._index]
        self._index += 1  # advance after reading
        return item

# Client drives iteration
it = ExternalIterator([1, 2, 3])
while it.has_next():
    print(it.next())`,
        Go: `type ExternalIterator[T any] struct {
    items []T
    index int
}
func (it *ExternalIterator[T]) HasNext() bool { return it.index < len(it.items) }
func (it *ExternalIterator[T]) Next() T {
    item := it.items[it.index]
    it.index++
    return item
}
// Client drives
it := &ExternalIterator[int]{items: []int{1, 2, 3}}
for it.HasNext() { fmt.Println(it.Next()) }`,
        Java: `class ExternalIterator<T> implements Iterator<T> {
    private final List<T> items;
    private int index = 0;
    ExternalIterator(List<T> items) { this.items = items; }
    public boolean hasNext() { return index < items.size(); }
    public T next() {
        if (!hasNext()) throw new NoSuchElementException();
        return items.get(index++);
    }
}`,
        TypeScript: `class ExternalIterator<T> {
  private index = 0;
  constructor(private items: T[]) {}
  hasNext() { return this.index < this.items.length; }
  next(): T {
    if (!this.hasNext()) throw new Error("No more elements");
    return this.items[this.index++]; // return then advance
  }
}`,
        Rust: `struct ExternalIterator<T> { items: Vec<T>, index: usize }
impl<T: Clone> Iterator for ExternalIterator<T> {
    type Item = T;
    fn next(&mut self) -> Option<T> {
        if self.index < self.items.len() {
            let item = self.items[self.index].clone();
            self.index += 1;
            Some(item)
        } else { None }
    }
}`,
      },
      pros: [
        "Client controls loop logic — can stop early, combine iterators, pause and resume",
        "Two iterators on same collection are trivially independent",
      ],
      cons: ["More verbose for simple cases", "Client is responsible for not skipping hasNext() check"],
    },
    {
      id: 2,
      name: "Internal Iterator (Collection-Driven)",
      description:
        "The collection drives iteration internally, calling a client-provided callback for each element. Simpler for callers but loses control — the caller cannot pause or skip.",
      code: {
        Python: `class InternalIterableList:
    def __init__(self, items: list):
        self._items = items

    def for_each(self, callback):
        # Collection drives — calls callback for every element
        for item in self._items:
            callback(item)

# Client provides callback — doesn't manage loop
InternalIterableList([1, 2, 3]).for_each(print)`,
        Go: `type InternalIterable[T any] struct { items []T }

func (l *InternalIterable[T]) ForEach(callback func(T)) {
    // Collection drives the loop internally
    for _, item := range l.items { callback(item) }
}

// Client just provides a callback
l := &InternalIterable[int]{items: []int{1, 2, 3}}
l.ForEach(func(v int) { fmt.Println(v) })`,
        Java: `class InternalIterableList<T> {
    private final List<T> items;
    InternalIterableList(List<T> items) { this.items = items; }
    void forEach(Consumer<T> action) {
        for (T item : items) action.accept(item); // collection drives
    }
}`,
        TypeScript: `class InternalIterableList<T> {
  constructor(private items: T[]) {}
  forEach(callback: (item: T) => void) {
    // Collection drives iteration
    for (const item of this.items) callback(item);
  }
}`,
        Rust: `struct InternalList<T>(Vec<T>);
impl<T> InternalList<T> {
    fn for_each(&self, mut callback: impl FnMut(&T)) {
        for item in &self.0 { callback(item); }
    }
}`,
      },
      pros: ["Simpler client code for full traversals", "Collection can apply optimisations internally"],
      cons: ["Cannot pause/stop/combine traversals", "Not compatible with built-in for-each syntax"],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Behavioral" },
    { aspect: "Intent", detail: "Provide sequential access to a collection's elements without exposing its internal structure" },
    { aspect: "Core Mechanism", detail: "Iterator holds a cursor; hasNext()/next() advance the cursor; collection returns a fresh iterator via createIterator()" },
    { aspect: "Multiple Traversals", detail: "Each call to createIterator() returns a new, independent cursor — enables parallel traversals on the same collection" },
    { aspect: "Built-in Support", detail: "Python __iter__/__next__, JS Symbol.iterator, Java Iterable/Iterator, Rust Iterator trait — all implement this pattern natively" },
    { aspect: "External vs Internal", detail: "External: client calls next() (more control). Internal: collection calls callback (simpler code). Both are valid Iterator variants." },
    { aspect: "Lazy Evaluation", detail: "Iterators produce items on demand — infinite sequences and large datasets processed with O(1) memory" },
    { aspect: "Common Pairings", detail: "Composite (tree iterators), Factory Method (createIterator), Memento (savepoint for cursor reset)" },
    { aspect: "When to Use", detail: "When clients need uniform traversal over different collection types, or when collection internals must be hidden from traversal code" },
  ],

  antiPatterns: [
    {
      name: "Exposing Indices or Nodes",
      description:
        "Clients access the collection using get(index) or by following node.next pointers directly. This leaks the internal structure — changing from array to linked list breaks all client code.",
      betterAlternative:
        "Always iterate through the Iterator interface. If random access is truly needed, keep it in the collection but access elements via a dedicated method, not raw index arithmetic.",
    },
    {
      name: "Mutable Collection During Iteration",
      description:
        "The collection is modified (items added/removed) while an iterator is active. The iterator's cursor may become invalid, skip elements, or double-visit elements.",
      betterAlternative:
        "Either (1) take a snapshot of the collection at iterator creation time, (2) throw ConcurrentModificationException on structural modification during iteration, or (3) use a thread-safe concurrent collection.",
    },
    {
      name: "Iterator Holding Heavy Resources",
      description:
        "An iterator opens a database connection or file handle in its constructor and relies on the client to call close() or dispose() when done. If iteration is abandoned, resources leak.",
      betterAlternative:
        "Use try-with-resources (Java), context managers (Python with statement), or RAII (Rust) to ensure iterators are properly closed. Alternatively, use lazy buffering to defer resource acquisition.",
    },
  ],
};

export default iteratorData;
