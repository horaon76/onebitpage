import { PatternData } from "@/lib/patterns/types";

const interpreterData: PatternData = {
  slug: "interpreter",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Interpreter Pattern",
  subtitle:
    "Define a grammar for a language and an interpreter that uses that grammar to evaluate sentences in the language.",

  intent:
    "Domain-specific problems often come with their own mini-languages: boolean search queries (`title:kafka AND year:2023`), mathematical expressions (`(a + b) * c`), rule engines (`IF age > 18 AND country == 'US' THEN eligible`), date patterns (`YYYY-MM-DD`), configuration templates (`{{env.PORT}}`). Hard-coding parsers and evaluators for these inside application logic results in brittle if-else chains scattered across the codebase.\n\nThe Interpreter pattern represents sentences in a language as a tree of Expression objects — an Abstract Syntax Tree (AST). Each node in the tree is a class that implements a common interpret(context) method. Leaf nodes (TerminalExpression) represent atomic tokens: literals, variable references, constants. Internal nodes (NonTerminalExpression) represent grammar rules that combine sub-expressions: addition, AND, OR, function application.\n\nEvaluating the sentence means calling interpret() on the root. The call recursively walks the tree. Each node evaluates its sub-expressions and combines their results according to its grammar rule.\n\nThe pattern is ideal when: the grammar is simple and stable, performance is secondary to extensibility, and developers benefit from being able to express domain rules declaratively.",

  classDiagramSvg: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px">
  <style>
    .s-box{rx:6;} .s-title{font:bold 11px 'JetBrains Mono',monospace;}
    .s-member{font:10px 'JetBrains Mono',monospace;}
    .s-arr{stroke-width:1.2;fill:none;marker-end:url(#int-arr);}
    .s-dash{stroke-dasharray:5,3;}
  </style>
  <defs>
    <marker id="int-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- AbstractExpression -->
  <rect x="195" y="10" width="210" height="55" class="s-box s-diagram-box"/>
  <text x="300" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;abstract&gt;&gt;</text>
  <text x="300" y="40" text-anchor="middle" class="s-title s-diagram-title">AbstractExpression</text>
  <line x1="195" y1="44" x2="405" y2="44" class="s-diagram-line"/>
  <text x="205" y="58" class="s-member s-diagram-member">+interpret(ctx: Context): any</text>
  <!-- TerminalExpression -->
  <rect x="10" y="140" width="200" height="60" class="s-box s-diagram-box"/>
  <text x="110" y="158" text-anchor="middle" class="s-title s-diagram-title">TerminalExpression</text>
  <line x1="10" y1="163" x2="210" y2="163" class="s-diagram-line"/>
  <text x="18" y="178" class="s-member s-diagram-member">-value: any</text>
  <text x="18" y="192" class="s-member s-diagram-member">+interpret(ctx): any</text>
  <!-- NonTerminalExpression -->
  <rect x="390" y="140" width="210" height="70" class="s-box s-diagram-box"/>
  <text x="495" y="158" text-anchor="middle" class="s-title s-diagram-title">NonTerminalExpression</text>
  <line x1="390" y1="163" x2="600" y2="163" class="s-diagram-line"/>
  <text x="398" y="178" class="s-member s-diagram-member">-left: AbstractExpression</text>
  <text x="398" y="192" class="s-member s-diagram-member">-right: AbstractExpression</text>
  <text x="398" y="206" class="s-member s-diagram-member">+interpret(ctx): any</text>
  <!-- Context -->
  <rect x="220" y="155" width="150" height="55" class="s-box s-diagram-box"/>
  <text x="295" y="173" text-anchor="middle" class="s-title s-diagram-title">Context</text>
  <line x1="220" y1="178" x2="370" y2="178" class="s-diagram-line"/>
  <text x="228" y="193" class="s-member s-diagram-member">variables: Map</text>
  <text x="228" y="205" class="s-member s-diagram-member">+lookup(name)</text>
  <!-- Arrows -->
  <line x1="110" y1="140" x2="260" y2="65" class="s-arr s-diagram-arrow"/>
  <line x1="495" y1="140" x2="340" y2="65" class="s-arr s-diagram-arrow"/>
  <!-- Self-reference on NonTerminal -->
  <path d="M 600 175 C 620 175 620 120 580 130 L 600 140" class="s-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "AbstractExpression declares the single interpret(context) method that all expression nodes share. TerminalExpression is a leaf — it holds a literal value or a variable name and returns it directly from the Context symbol table without recursion. NonTerminalExpression holds references to sub-expressions (children in the AST). Its interpret() calls each child's interpret() recursively, then combines results according to its grammar rule (add, multiply, AND, OR, etc.). Context is the symbol table passed across all recursive calls — it stores variable bindings so variable references resolve to their current values.",

  diagramComponents: [
    {
      name: "AbstractExpression",
      description:
        "The common interface every AST node implements. Declares interpret(context) — the single method that evaluates the expression represented by this node and returns a result.",
    },
    {
      name: "TerminalExpression (leaf node)",
      description:
        "Represents atomic tokens in the grammar: integer literals, string literals, variable references, boolean constants. interpret() returns the literal value directly or looks up the variable in Context. No children — recursion terminates here.",
    },
    {
      name: "NonTerminalExpression (composite node)",
      description:
        "Represents grammar rules that combine sub-expressions: addition, subtraction, AND, OR, function application. Holds references to child expressions and calls their interpret() recursively. The results are combined according to this node's rule.",
    },
    {
      name: "Context",
      description:
        "The shared symbol table passed to every interpret() call. Holds variable bindings (name → value). Variable expressions look up their name here. Can also carry execution state, output buffers, or diagnostic information across the traversal.",
    },
    {
      name: "Client / Parser",
      description:
        "Typically a parser that reads the input language and builds the AST from Expression objects. The parser knows the grammar; the Expression classes know how to evaluate it. After construction, the client calls root.interpret(context).",
    },
  ],

  solutionDetail:
    "**When to use Interpreter**: The grammar is simple (< ~10 rules), performance requirements are modest, and extensibility matters more than raw speed. For complex grammars (SQL, full programming languages), use a parser generator (ANTLR, PEG.js) instead.\n\n**Building the AST**: The parser reads input and creates Expression objects. Simple recursive descent parsing naturally maps grammar productions to NonTerminalExpression subclasses. Each grammar rule becomes one Expression subclass.\n\n**Context as environment**: The Context object serves as the execution environment. It stores variables bound before evaluation, handles lookup, and can hold output state (e.g. a rendered string buffer). Pass by reference so all nodes share the same context.\n\n**Combining with Composite**: Interpreter is essentially Composite pattern applied to language grammars. NonTerminalExpression corresponds to Composite; TerminalExpression to Leaf.\n\n**Combining with Visitor**: If you need multiple operations over the same AST without changing node classes (e.g. evaluate + pretty-print + type-check), add a Visitor layer on top. The Interpreter pattern builds the tree; Visitor traverses it.\n\n**Real-world examples**: Regex engines, jinja2 templates, Spring Expression Language (SpEL), Apache Commons JEXL, OGNL, JavaScript template literals (at compile time), Excel formula parser, Elasticsearch query DSL.",

  characteristics: [
    "Grammar rules map cleanly to class hierarchy — one class per grammar production",
    "Easy to extend: adding a new grammar rule = new Expression subclass",
    "Each node is responsible for evaluating exactly its own rule — maximal separation of concerns",
    "The AST can be reused across multiple evaluations with different Context values",
    "Combining with Visitor allows multiple operations (eval + print + validate) over the same AST",
    "Best suited for simple grammars; complex grammars lead to fragmented, hard-to-maintain class hierarchies",
    "Naturally handles recursive grammars (nested expressions) via recursive interpret() calls",
  ],

  useCases: [
    {
      id: 1,
      title: "Boolean Search Query Engine",
      domain: "Search / Information Retrieval",
      description:
        "A full-text search engine accepts queries like `title:kafka AND (author:kleppmann OR tag:distributed)`. The query must be parsed and evaluated against a document index.",
      whySingleton:
        "TerminalExpression wraps field:value predicates. AndExpression and OrExpression combine them. The AST is built once and evaluated against each document in the index.",
      code: `class AndExpression:
    def __init__(self, left, right): self.left, self.right = left, right
    def interpret(self, ctx):
        return self.left.interpret(ctx) and self.right.interpret(ctx)`,
    },
    {
      id: 2,
      title: "Arithmetic Expression Evaluator",
      domain: "Mathematics / Spreadsheet",
      description:
        "A spreadsheet engine evaluates cell formulas like `=A1 * (B2 + C3)`. The formula is parsed into an AST and evaluated with cell values as variables in the Context.",
      whySingleton:
        "Literal and CellReference are TerminalExpressions. Add, Subtract, Multiply are NonTerminalExpressions. Changing a cell value means updating Context and re-evaluating the same AST.",
      code: `class MultiplyExpression:
    def __init__(self, left, right): self.left, self.right = left, right
    def interpret(self, ctx: dict) -> float:
        return self.left.interpret(ctx) * self.right.interpret(ctx)`,
    },
    {
      id: 3,
      title: "Business Rule Engine",
      domain: "Insurance / Finance",
      description:
        "An insurance underwriting system evaluates eligibility rules like `age >= 18 AND income > 30000 AND country IN ['US','CA']`. Rules are configurable without code changes.",
      whySingleton:
        "ComparisonExpression, InExpression, AndExpression, OrExpression, NotExpression form the rule AST. Rules are stored as serialised ASTs in a database and restored at evaluation time.",
      code: `class ComparisonExpression:
    def __init__(self, field, op, value): self.field, self.op, self.value = field, op, value
    def interpret(self, ctx: dict) -> bool:
        actual = ctx[self.field]
        return {">=": actual >= self.value, "==": actual == self.value}.get(self.op, False)`,
    },
    {
      id: 4,
      title: "Template Engine",
      domain: "Web / Document Generation",
      description:
        "A report generator processes templates like `Hello, {{user.name}}! You have {{user.messages | count}} messages.` Each `{{ }}` block is a mini-expression evaluated against a data context.",
      whySingleton:
        "LiteralText and VariableExpression are terminals. FilterExpression (user.messages | count) is a non-terminal combining a variable lookup with a function call. Context holds the template data model.",
      code: `class VariableExpression:
    def __init__(self, path: str): self.path = path.split('.')
    def interpret(self, ctx: dict):
        result = ctx
        for key in self.path: result = result[key]
        return result`,
    },
    {
      id: 5,
      title: "Access Control Policy Evaluator",
      domain: "Security / IAM",
      description:
        "An IAM system evaluates policies like `resource == 's3://bucket' AND action IN ['read','list'] AND principal.role == 'admin'`. Each rule is an expression tree evaluated per API call.",
      whySingleton:
        "The policy AST is built once when the policy is uploaded. Per-request evaluation passes a context of (principal, action, resource) attributes. Zero parsing overhead at request time.",
      code: `class InExpression:
    def __init__(self, field: str, values: list): self.field, self.values = field, values
    def interpret(self, ctx: dict) -> bool:
        return ctx.get(self.field) in self.values`,
    },
    {
      id: 6,
      title: "Date / Time Format Interpreter",
      domain: "Data Engineering / ETL",
      description:
        "An ETL pipeline parses date format strings like `YYYY-MM-DD HH:mm:ss` and formats timestamps accordingly. Each format token (YYYY, MM, DD) is a TerminalExpression.",
      whySingleton:
        "LiteralToken (for separators like `-`) and FormatToken (for YYYY, MM, DD) are terminals. ConcatExpression combines them. The format AST is compiled once and applied to each date value.",
      code: `class FormatToken:
    FORMATS = {"YYYY": "%Y", "MM": "%m", "DD": "%d", "HH": "%H"}
    def __init__(self, token: str): self.fmt = self.FORMATS[token]
    def interpret(self, ctx: dict) -> str:
        return ctx["date"].strftime(self.fmt)`,
    },
    {
      id: 7,
      title: "SQL WHERE Clause Evaluator",
      domain: "Database / Analytics",
      description:
        "An in-memory query engine evaluates SQL-like WHERE clauses: `age > 25 AND salary BETWEEN 50000 AND 100000 AND department = 'Engineering'`. Applied as a filter predicate to rows.",
      whySingleton:
        "Each predicate is an expression. BetweenExpression, EqualExpression, LikeExpression are terminals. AndExpression and OrExpression combine them. Context is one data row.",
      code: `class BetweenExpression:
    def __init__(self, field: str, low: float, high: float):
        self.field, self.low, self.high = field, low, high
    def interpret(self, row: dict) -> bool:
        return self.low <= row[self.field] <= self.high`,
    },
    {
      id: 8,
      title: "Command-Line Argument Parser",
      domain: "CLI / Developer Tools",
      description:
        "A CLI tool processes command expressions like `build --target=release --features=ssl,async --no-tests`. Each flag and value is an expression that populates a config context.",
      whySingleton:
        "FlagExpression and ValueExpression are terminals. SequenceExpression chains multiple flags. The CLI grammar is fixed; new flags are new TerminalExpression subclasses.",
      code: `class FlagExpression:
    def __init__(self, name: str, default: bool = False):
        self.name, self.default = name, default
    def interpret(self, args: list) -> bool:
        return f'--{self.name}' in args or f'--no-{self.name}' not in args`,
    },
    {
      id: 9,
      title: "CSS Selector Evaluator",
      domain: "UI / Browser",
      description:
        "A UI framework evaluates CSS-selector-like expressions `div.container > h1.title:first-child` to match elements in a component tree.",
      whySingleton:
        "TagExpression, ClassExpression, PseudoExpression are terminals. DescendantCombinator and ChildCombinator are non-terminals. The selector AST is matched against each node in the component tree.",
      code: `class ClassExpression:
    def __init__(self, cls: str): self.cls = cls
    def interpret(self, element) -> bool:
        return self.cls in element.classes

class ChildCombinator:
    def __init__(self, parent, child): self.parent, self.child = parent, child
    def interpret(self, element) -> bool:
        return (self.child.interpret(element) and
                self.parent.interpret(element.parent))`,
    },
    {
      id: 10,
      title: "Notification Routing Rules",
      domain: "Platform Engineering",
      description:
        "An alerting system routes notifications using rules: `severity == 'critical' AND service IN ['payment','auth'] → pagerduty`. Rules are configurable by SREs without code deploys.",
      whySingleton:
        "Rules are serialised expression trees. Routing decisions evaluate the AST per alert with an alert-attribute Context. SREs write rules in a simple DSL; the parser generates the AST.",
      code: `class AndRoutingRule:
    def __init__(self, left, right): self.left, self.right = left, right
    def interpret(self, alert: dict) -> bool:
        return self.left.interpret(alert) and self.right.interpret(alert)`,
    },
    {
      id: 11,
      title: "Unit Conversion Expression",
      domain: "Engineering / Science",
      description:
        "A physical simulation tool evaluates unit expressions like `3.5 km/h * 2.0 h` to get `7.0 km`. Units and magnitudes are part of the expression tree with dimensional analysis.",
      whySingleton:
        "QuantityExpression (terminal: magnitude + unit) and BinaryUnitOp (non-terminal: multiply/divide with unit propagation) form the tree. Context carries defined unit conversions.",
      code: `class MultiplyQuantity:
    def __init__(self, left, right): self.left, self.right = left, right
    def interpret(self, ctx) -> tuple:
        lv, lu = self.left.interpret(ctx)
        rv, ru = self.right.interpret(ctx)
        return lv * rv, ctx.combine_units(lu, ru, '*')`,
    },
    {
      id: 12,
      title: "Feature Flag Condition Evaluator",
      domain: "Product Engineering",
      description:
        "A feature flag system enables features based on conditions: `user.betaTester == true OR (user.country == 'US' AND user.plan == 'pro')`. Conditions change frequently.",
      whySingleton:
        "The condition is stored as a serialised expression tree in the feature flag config. Evaluation passes the user attributes as Context. No code redeploy needed to change flag conditions.",
      code: `class OrExpression:
    def __init__(self, left, right): self.left, self.right = left, right
    def interpret(self, user_ctx: dict) -> bool:
        # Short-circuit: if left is True, don't evaluate right
        return self.left.interpret(user_ctx) or self.right.interpret(user_ctx)`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Arithmetic Expression Evaluator with Variables",
      domain: "Mathematics / Scripting",
      problem:
        "A calculator application must evaluate user-entered expressions like `(a + b) * (c - 2)` where `a`, `b`, `c` are variables defined by the user. The expression can be deeply nested, and the same expression should be re-evaluatable with different variable values without reparsing.",
      solution:
        "Build an AST from the expression. NumberLiteral and VariableRef are TerminalExpressions. AddExpr, SubtractExpr, MultiplyExpr, DivideExpr are NonTerminalExpressions with left/right children. A simple recursive descent parser constructs the AST. Context holds the variable bindings. Calling root.interpret(ctx) walks the tree recursively and returns the result. Changing variable values in Context and re-evaluating costs O(tree nodes) — no reparsing.",
      classDiagramSvg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#int-e1);}</style>
  <defs><marker id="int-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <!-- Abstract -->
  <rect x="195" y="10" width="170" height="45" class="s-box s-diagram-box"/>
  <text x="280" y="28" text-anchor="middle" class="s-title s-diagram-title">Expression (abs)</text>
  <line x1="195" y1="32" x2="365" y2="32" class="s-diagram-line"/>
  <text x="203" y="48" class="s-member s-diagram-member">+interpret(ctx): float</text>
  <!-- Terminals -->
  <rect x="10" y="130" width="130" height="50" class="s-box s-diagram-box"/>
  <text x="75" y="147" text-anchor="middle" class="s-title s-diagram-title">NumberLiteral</text>
  <line x1="10" y1="152" x2="140" y2="152" class="s-diagram-line"/>
  <text x="18" y="168" class="s-member s-diagram-member">-value: float</text>
  <rect x="160" y="130" width="130" height="50" class="s-box s-diagram-box"/>
  <text x="225" y="147" text-anchor="middle" class="s-title s-diagram-title">VariableRef</text>
  <line x1="160" y1="152" x2="290" y2="152" class="s-diagram-line"/>
  <text x="168" y="168" class="s-member s-diagram-member">-name: str</text>
  <!-- NonTerminals -->
  <rect x="310" y="130" width="120" height="50" class="s-box s-diagram-box"/>
  <text x="370" y="147" text-anchor="middle" class="s-title s-diagram-title">AddExpr</text>
  <line x1="310" y1="152" x2="430" y2="152" class="s-diagram-line"/>
  <text x="318" y="168" class="s-member s-diagram-member">left, right: Expr</text>
  <rect x="440" y="130" width="120" height="50" class="s-box s-diagram-box"/>
  <text x="500" y="147" text-anchor="middle" class="s-title s-diagram-title">MultiplyExpr</text>
  <line x1="440" y1="152" x2="560" y2="152" class="s-diagram-line"/>
  <text x="448" y="168" class="s-member s-diagram-member">left, right: Expr</text>
  <!-- Arrows -->
  <line x1="75"  y1="130" x2="240" y2="55" class="s-arr s-diagram-arrow"/>
  <line x1="225" y1="130" x2="265" y2="55" class="s-arr s-diagram-arrow"/>
  <line x1="370" y1="130" x2="295" y2="55" class="s-arr s-diagram-arrow"/>
  <line x1="500" y1="130" x2="330" y2="55" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict

# ── Context: the symbol table ─────────────────────────────────────────────────
# Carries variable bindings. Passed to every interpret() call.
# The same context can be updated between evaluations — no reparsing.
class Context:
    def __init__(self, variables: Dict[str, float] = None):
        self._vars: Dict[str, float] = variables or {}

    def set(self, name: str, value: float) -> None:
        self._vars[name] = value

    def get(self, name: str) -> float:
        if name not in self._vars:
            raise NameError(f"Undefined variable: '{name}'")
        return self._vars[name]


# ── AbstractExpression: the common interface ──────────────────────────────────
class Expression(ABC):
    @abstractmethod
    def interpret(self, ctx: Context) -> float:
        """Evaluate this expression node given the variable context."""
        ...

    def __repr__(self) -> str:
        return self.__class__.__name__


# ── TerminalExpression 1: Number Literal ──────────────────────────────────────
# Leaf node — no children. Always returns its fixed numeric value.
@dataclass
class NumberLiteral(Expression):
    value: float

    def interpret(self, ctx: Context) -> float:
        return self.value  # no context lookup needed for literals


# ── TerminalExpression 2: Variable Reference ──────────────────────────────────
# Leaf node — looks up its name in the context.
# If the variable changes in context, the same AST evaluates differently.
@dataclass
class VariableRef(Expression):
    name: str

    def interpret(self, ctx: Context) -> float:
        return ctx.get(self.name)  # fails fast if variable undefined


# ── NonTerminalExpression: Binary Arithmetic Operations ───────────────────────
# Each class represents one grammar rule: left OP right.
# interpret() recursively evaluates both sides, then combines results.

@dataclass
class AddExpr(Expression):
    left: Expression
    right: Expression

    def interpret(self, ctx: Context) -> float:
        return self.left.interpret(ctx) + self.right.interpret(ctx)


@dataclass
class SubtractExpr(Expression):
    left: Expression
    right: Expression

    def interpret(self, ctx: Context) -> float:
        return self.left.interpret(ctx) - self.right.interpret(ctx)


@dataclass
class MultiplyExpr(Expression):
    left: Expression
    right: Expression

    def interpret(self, ctx: Context) -> float:
        return self.left.interpret(ctx) * self.right.interpret(ctx)


@dataclass
class DivideExpr(Expression):
    left: Expression
    right: Expression

    def interpret(self, ctx: Context) -> float:
        divisor = self.right.interpret(ctx)
        if divisor == 0:
            raise ZeroDivisionError("Division by zero in expression")
        return self.left.interpret(ctx) / divisor


# ── Simple Recursive Descent Parser ──────────────────────────────────────────
# Builds the AST from an infix expression string.
# Grammar:
#   expr   = term (('+' | '-') term)*
#   term   = factor (('*' | '/') factor)*
#   factor = NUMBER | VARIABLE | '(' expr ')'
class Parser:
    def __init__(self, text: str):
        self._tokens = self._tokenize(text)
        self._pos = 0

    @staticmethod
    def _tokenize(text: str) -> list:
        import re
        return re.findall(r'[a-zA-Z_]\w*|\d+\.?\d*|[+\-*/()]', text.replace(' ', ''))

    def _peek(self) -> str | None:
        return self._tokens[self._pos] if self._pos < len(self._tokens) else None

    def _consume(self) -> str:
        token = self._tokens[self._pos]; self._pos += 1; return token

    def parse(self) -> Expression:
        return self._expr()

    def _expr(self) -> Expression:
        node = self._term()
        while self._peek() in ('+', '-'):
            op = self._consume()
            right = self._term()
            node = AddExpr(node, right) if op == '+' else SubtractExpr(node, right)
        return node

    def _term(self) -> Expression:
        node = self._factor()
        while self._peek() in ('*', '/'):
            op = self._consume()
            right = self._factor()
            node = MultiplyExpr(node, right) if op == '*' else DivideExpr(node, right)
        return node

    def _factor(self) -> Expression:
        token = self._consume()
        if token == '(':
            node = self._expr()
            self._consume()  # consume ')'
            return node
        try:
            return NumberLiteral(float(token))
        except ValueError:
            return VariableRef(token)


# ── Client code ───────────────────────────────────────────────────────────────
# Build the expression "(a + b) * (c - 2)" as an AST

# Manual construction (how you'd do it programmatically):
# (a + b) * (c - 2)
ast = MultiplyExpr(
    left=AddExpr(
        left=VariableRef("a"),       # terminal: looks up 'a' in context
        right=VariableRef("b"),      # terminal: looks up 'b' in context
    ),
    right=SubtractExpr(
        left=VariableRef("c"),       # terminal: looks up 'c' in context
        right=NumberLiteral(2.0),    # terminal: always 2
    ),
)

# First evaluation: a=3, b=4, c=10
ctx = Context({"a": 3.0, "b": 4.0, "c": 10.0})
result1 = ast.interpret(ctx)
print(f"(a + b) * (c - 2)  with a=3, b=4, c=10  =>  {result1}")  # (3+4)*(10-2)=56.0

# Same AST, different variable values — zero reparsing cost
ctx.set("a", 1.0); ctx.set("b", 2.0); ctx.set("c", 5.0)
result2 = ast.interpret(ctx)
print(f"(a + b) * (c - 2)  with a=1, b=2, c=5   =>  {result2}")  # (1+2)*(5-2)=9.0

# Using the parser for dynamic input
parser = Parser("(a + b) * (c - 2)")
parsed_ast = parser.parse()
result3 = parsed_ast.interpret(Context({"a": 10.0, "b": 5.0, "c": 7.0}))
print(f"Parsed & evaluated: {result3}")  # (10+5)*(7-2)=75.0
`,

        TypeScript: `// ── Context ────────────────────────────────────────────────────────────────────
class Context {
  private vars = new Map<string, number>();

  set(name: string, value: number): void { this.vars.set(name, value); }

  get(name: string): number {
    if (!this.vars.has(name)) throw new Error(\`Undefined variable: \${name}\`);
    return this.vars.get(name)!;
  }
}

// ── AbstractExpression ─────────────────────────────────────────────────────────
interface Expression {
  interpret(ctx: Context): number;
}

// ── Terminal Expressions ───────────────────────────────────────────────────────
class NumberLiteral implements Expression {
  constructor(private readonly value: number) {}
  interpret(_ctx: Context): number { return this.value; }
}

class VariableRef implements Expression {
  constructor(private readonly name: string) {}
  interpret(ctx: Context): number { return ctx.get(this.name); }
}

// ── Non-Terminal Expressions ───────────────────────────────────────────────────
class AddExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(ctx: Context): number {
    return this.left.interpret(ctx) + this.right.interpret(ctx);
  }
}

class SubtractExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(ctx: Context): number {
    return this.left.interpret(ctx) - this.right.interpret(ctx);
  }
}

class MultiplyExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(ctx: Context): number {
    return this.left.interpret(ctx) * this.right.interpret(ctx);
  }
}

class DivideExpr implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(ctx: Context): number {
    const divisor = this.right.interpret(ctx);
    if (divisor === 0) throw new Error("Division by zero");
    return this.left.interpret(ctx) / divisor;
  }
}

// ── Client: build (a + b) * (c - 2) manually ──────────────────────────────────
const ast = new MultiplyExpr(
  new AddExpr(new VariableRef("a"), new VariableRef("b")),
  new SubtractExpr(new VariableRef("c"), new NumberLiteral(2)),
);

const ctx = new Context();
ctx.set("a", 3); ctx.set("b", 4); ctx.set("c", 10);
console.log("Result:", ast.interpret(ctx));   // 56

ctx.set("a", 1); ctx.set("b", 2); ctx.set("c", 5);
console.log("Result:", ast.interpret(ctx));   // 9
`,

        Go: `package main

import "fmt"

// ── Context ────────────────────────────────────────────────────────────────────
type Context struct{ vars map[string]float64 }

func NewContext(v map[string]float64) *Context { return &Context{vars: v} }

func (c *Context) Get(name string) float64 {
	v, ok := c.vars[name]
	if !ok { panic("undefined variable: " + name) }
	return v
}

// ── Expression interface ───────────────────────────────────────────────────────
type Expression interface {
	Interpret(ctx *Context) float64
}

// ── Terminals ─────────────────────────────────────────────────────────────────
type NumberLiteral struct{ Value float64 }
func (n NumberLiteral) Interpret(_ *Context) float64 { return n.Value }

type VariableRef struct{ Name string }
func (v VariableRef) Interpret(ctx *Context) float64 { return ctx.Get(v.Name) }

// ── Non-Terminals ──────────────────────────────────────────────────────────────
type AddExpr      struct{ Left, Right Expression }
type SubtractExpr struct{ Left, Right Expression }
type MultiplyExpr struct{ Left, Right Expression }

func (e AddExpr) Interpret(ctx *Context) float64 {
	return e.Left.Interpret(ctx) + e.Right.Interpret(ctx)
}
func (e SubtractExpr) Interpret(ctx *Context) float64 {
	return e.Left.Interpret(ctx) - e.Right.Interpret(ctx)
}
func (e MultiplyExpr) Interpret(ctx *Context) float64 {
	return e.Left.Interpret(ctx) * e.Right.Interpret(ctx)
}

func main() {
	// (a + b) * (c - 2)
	ast := MultiplyExpr{
		Left:  AddExpr{Left: VariableRef{"a"}, Right: VariableRef{"b"}},
		Right: SubtractExpr{Left: VariableRef{"c"}, Right: NumberLiteral{2}},
	}

	ctx := NewContext(map[string]float64{"a": 3, "b": 4, "c": 10})
	fmt.Printf("a=3, b=4, c=10: %.1f\\n", ast.Interpret(ctx)) // 56.0

	ctx.vars["a"] = 1; ctx.vars["b"] = 2; ctx.vars["c"] = 5
	fmt.Printf("a=1, b=2, c=5:  %.1f\\n", ast.Interpret(ctx)) // 9.0
}
`,

        Java: `import java.util.*;

// ── Context ────────────────────────────────────────────────────────────────────
class Context {
    private final Map<String,Double> vars = new HashMap<>();
    public void set(String name, double value) { vars.put(name, value); }
    public double get(String name) {
        if (!vars.containsKey(name)) throw new RuntimeException("Undefined: " + name);
        return vars.get(name);
    }
}

// ── Expression interface ───────────────────────────────────────────────────────
interface Expression { double interpret(Context ctx); }

// ── Terminals ─────────────────────────────────────────────────────────────────
class NumberLiteral implements Expression {
    private final double value;
    NumberLiteral(double v) { this.value = v; }
    @Override public double interpret(Context ctx) { return value; }
}

class VariableRef implements Expression {
    private final String name;
    VariableRef(String n) { this.name = n; }
    @Override public double interpret(Context ctx) { return ctx.get(name); }
}

// ── Non-Terminals ──────────────────────────────────────────────────────────────
class AddExpr implements Expression {
    private final Expression left, right;
    AddExpr(Expression l, Expression r) { left=l; right=r; }
    @Override public double interpret(Context ctx) {
        return left.interpret(ctx) + right.interpret(ctx);
    }
}

class MultiplyExpr implements Expression {
    private final Expression left, right;
    MultiplyExpr(Expression l, Expression r) { left=l; right=r; }
    @Override public double interpret(Context ctx) {
        return left.interpret(ctx) * right.interpret(ctx);
    }
}

class SubtractExpr implements Expression {
    private final Expression left, right;
    SubtractExpr(Expression l, Expression r) { left=l; right=r; }
    @Override public double interpret(Context ctx) {
        return left.interpret(ctx) - right.interpret(ctx);
    }
}

// ── Main ───────────────────────────────────────────────────────────────────────
class Main {
    public static void main(String[] args) {
        // (a + b) * (c - 2)
        Expression ast = new MultiplyExpr(
            new AddExpr(new VariableRef("a"), new VariableRef("b")),
            new SubtractExpr(new VariableRef("c"), new NumberLiteral(2))
        );
        Context ctx = new Context();
        ctx.set("a", 3); ctx.set("b", 4); ctx.set("c", 10);
        System.out.println("Result: " + ast.interpret(ctx)); // 56.0
        ctx.set("a", 1); ctx.set("b", 2); ctx.set("c", 5);
        System.out.println("Result: " + ast.interpret(ctx)); // 9.0
    }
}
`,

        Rust: `use std::collections::HashMap;

// ── Context ────────────────────────────────────────────────────────────────────
struct Context { vars: HashMap<String, f64> }
impl Context {
    fn new(vars: HashMap<String, f64>) -> Self { Self { vars } }
    fn get(&self, name: &str) -> f64 {
        *self.vars.get(name).unwrap_or_else(|| panic!("Undefined: {}", name))
    }
}

// ── Expression — use Box<dyn Expr> for recursive tree ─────────────────────────
trait Expr { fn interpret(&self, ctx: &Context) -> f64; }

// ── Terminals ─────────────────────────────────────────────────────────────────
struct NumberLiteral(f64);
impl Expr for NumberLiteral { fn interpret(&self, _: &Context) -> f64 { self.0 } }

struct VariableRef(String);
impl Expr for VariableRef { fn interpret(&self, ctx: &Context) -> f64 { ctx.get(&self.0) } }

// ── Non-Terminals ──────────────────────────────────────────────────────────────
struct AddExpr      { left: Box<dyn Expr>, right: Box<dyn Expr> }
struct SubtractExpr { left: Box<dyn Expr>, right: Box<dyn Expr> }
struct MultiplyExpr { left: Box<dyn Expr>, right: Box<dyn Expr> }

impl Expr for AddExpr {
    fn interpret(&self, ctx: &Context) -> f64 {
        self.left.interpret(ctx) + self.right.interpret(ctx)
    }
}
impl Expr for SubtractExpr {
    fn interpret(&self, ctx: &Context) -> f64 {
        self.left.interpret(ctx) - self.right.interpret(ctx)
    }
}
impl Expr for MultiplyExpr {
    fn interpret(&self, ctx: &Context) -> f64 {
        self.left.interpret(ctx) * self.right.interpret(ctx)
    }
}

fn main() {
    // (a + b) * (c - 2)
    let ast: Box<dyn Expr> = Box::new(MultiplyExpr {
        left:  Box::new(AddExpr { left: Box::new(VariableRef("a".into())), right: Box::new(VariableRef("b".into())) }),
        right: Box::new(SubtractExpr { left: Box::new(VariableRef("c".into())), right: Box::new(NumberLiteral(2.0)) }),
    });

    let ctx = Context::new([("a", 3.0), ("b", 4.0), ("c", 10.0)]
        .into_iter().map(|(k, v)| (k.to_string(), v)).collect());
    println!("a=3,b=4,c=10: {}", ast.interpret(&ctx));  // 56

    let ctx2 = Context::new([("a", 1.0), ("b", 2.0), ("c", 5.0)]
        .into_iter().map(|(k, v)| (k.to_string(), v)).collect());
    println!("a=1,b=2,c=5:  {}", ast.interpret(&ctx2));  // 9
}
`,
      },
      considerations: [
        "Deep expression trees cause deep recursion — use an iterative evaluator with an explicit stack for very large expressions",
        "Caching / memoisation: if a sub-expression is pure and appears multiple times, cache its result in Context to avoid redundant evaluation",
        "Error reporting: include position information in TerminalExpressions (line, column from tokeniser) so runtime errors point to the source location",
        "Grammar changes require new Expression subclasses — existing code is untouched (Open/Closed principle)",
        "For complex grammars, consider ANTLR or PEG parsers which generate AST visitor code automatically and handle edge cases more robustly",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Tree-walking Interpreter",
      description:
        "Directly evaluates the AST by recursively calling interpret(). Simple to implement and extend. Slowest execution — each evaluation walks every node. Ideal for simple domain languages and rule engines.",
      code: {
        Python: `# Direct tree-walking — every interpret() call recurses
class AddExpr:
    def interpret(self, ctx):
        return self.left.interpret(ctx) + self.right.interpret(ctx)`,
        TypeScript: `class AddExpr implements Expr {
  interpret(ctx: Context): number {
    return this.left.interpret(ctx) + this.right.interpret(ctx);
  }
}`,
        Go: `func (e AddExpr) Interpret(ctx *Context) float64 {
  return e.Left.Interpret(ctx) + e.Right.Interpret(ctx)
}`,
        Java: `@Override public double interpret(Context ctx) {
    return left.interpret(ctx) + right.interpret(ctx);
}`,
        Rust: `fn interpret(&self, ctx: &Context) -> f64 {
    self.left.interpret(ctx) + self.right.interpret(ctx)
}`,
      },
      pros: ["Simple — one class per grammar rule", "Easy to add new grammar rules", "AST reusable across evaluations"],
      cons: ["Slowest — no compilation step", "Deep trees risk stack overflow"],
    },
    {
      id: 2,
      name: "Compiled Interpreter (AST → Bytecode)",
      description:
        "A compiler pass traverses the AST once and emits bytecode instructions into a flat array. A fast bytecode VM executes the array. Build the AST once, compile once, execute many times cheaply. Used in Python, Lua, JVM.",
      code: {
        Python: `class BytecodeCompiler:
    def compile(self, expr) -> list:
        """Visit AST, emit stack-based instructions."""
        instructions = []
        self._emit(expr, instructions)
        return instructions

    def _emit(self, expr, out: list):
        if isinstance(expr, NumberLiteral):
            out.append(('PUSH', expr.value))
        elif isinstance(expr, VariableRef):
            out.append(('LOAD', expr.name))
        elif isinstance(expr, AddExpr):
            self._emit(expr.left, out)
            self._emit(expr.right, out)
            out.append(('ADD',))

class VM:
    def execute(self, bytecode: list, ctx: dict) -> float:
        stack = []
        for instr in bytecode:
            match instr[0]:
                case 'PUSH': stack.append(instr[1])
                case 'LOAD': stack.append(ctx[instr[1]])
                case 'ADD':  stack.append(stack.pop() + stack.pop())
        return stack[-1]`,
        TypeScript: `// Compile AST to flat instruction array, execute with fast VM
type Instr = ['PUSH', number] | ['LOAD', string] | ['ADD'] | ['MUL'];
function compile(expr: Expr): Instr[] { /* emit instructions */ return []; }
function runVM(code: Instr[], vars: Record<string, number>): number {
  const stack: number[] = [];
  for (const [op, arg] of code) {
    if (op === 'PUSH') stack.push(arg as number);
    else if (op === 'LOAD') stack.push(vars[arg as string]);
    else if (op === 'ADD') { const b = stack.pop()!; stack.push(stack.pop()! + b); }
  }
  return stack[0];
}`,
        Go: `// Go: compile to []Instruction, run in loop instead of recursion`,
        Java: `// JVM languages: compile to bytecode array, use stack-based VM`,
        Rust: `// Rust: compile to Vec<Instruction> enum, execute with match loop`,
      },
      pros: ["Much faster repeated evaluations", "No recursion depth limits", "Still extensible — add new opcodes"],
      cons: ["More complex — need both compiler and VM", "Harder to debug", "Overkill for infrequent evaluations"],
    },
  ],
  variantsTabLabel: "Evaluation Strategies",
  variantsBestPick:
    "Use **Tree-walking** for rule engines, config DSLs, and prototypes where simplicity and extensibility matter more than speed. Use **Compiled Interpreter** when the same expression is evaluated thousands/millions of times (e.g. hot-path filtering in a streaming pipeline).",
  comparisonHeaders: ["Strategy", "Complexity", "Speed", "Memory", "Best For"],
  comparisonRows: [
    ["Tree-walking",           "Low",    "Slow (O(n) per eval)", "O(tree)",     "Rules, DSLs, infrequent eval"],
    ["Compiled + VM",          "Medium", "Fast (tight loop)",    "O(bytecode)", "Hot-path filters, formulas"],
  ],

  summary: [
    { aspect: "Intent",           detail: "Represent sentences in a language as an AST of Expression objects and evaluate them" },
    { aspect: "Pattern type",     detail: "Behavioral" },
    { aspect: "Key structure",    detail: "TerminalExpression (leaf) + NonTerminalExpression (composite) + Context (symbol table)" },
    { aspect: "Adding rules",     detail: "Easy — one new Expression subclass per new grammar rule" },
    { aspect: "Evaluation",       detail: "Recursive interpret(context) starting at the root node" },
    { aspect: "Context role",     detail: "Shared symbol table — passes variable bindings to all nodes" },
    { aspect: "Combines with",    detail: "Composite (NonTerminalExpression IS a Composite), Visitor (multiple operations on the same AST)" },
    { aspect: "Real-world use",   detail: "Rule engines, template engines, formula evaluators, boolean query parsers, SpEL, JEXL" },
    { aspect: "Limit",            detail: "Best for simple grammars (< ~10 rules); use ANTLR/PEG for complex languages" },
  ],

  antiPatterns: [
    {
      name: "Interpreter for complex grammars",
      description:
        "Applying the pattern to large, complex grammars (SQL, full programming languages) results in hundreds of Expression subclasses — a maintenance nightmare and a performance bottleneck.",
      betterAlternative:
        "Use a parser generator (ANTLR, PEG.js, tree-sitter) for complex grammars. These tools generate AST visitor infrastructure automatically and handle edge cases robustly.",
    },
    {
      name: "Reparsing on every evaluation",
      description:
        "Calling a full parser every time the same expression is evaluated wastes CPU. The value of the pattern is that the AST is built once and evaluated cheaply many times.",
      betterAlternative:
        "Parse once, cache the AST, evaluate N times by changing Context. For hot paths, compile the AST to bytecode and execute with a fast VM.",
    },
    {
      name: "Mutable Context shared across threads",
      description:
        "If the same Context object is shared across concurrent evaluations, race conditions corrupt variable lookup results.",
      betterAlternative:
        "Create one Context instance per evaluation (or per thread). Context is lightweight — a map copy is cheap.",
    },
  ],
};

export default interpreterData;
