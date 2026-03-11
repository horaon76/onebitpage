import { PatternData } from "@/lib/patterns/types";

const chainOfResponsibilityData: PatternData = {
  slug: "chain-of-responsibility",
  categorySlug: "behavioral",
  categoryLabel: "Behavioral",
  title: "Chain of Responsibility Pattern",
  subtitle:
    "Avoid coupling the sender of a request to its receiver by giving multiple handlers a chance to process the request, passing it along the chain until one handles it.",

  intent:
    "When a request needs to go through a series of processing steps — and you don't know at compile time which step will handle it — hardcoding the dispatch logic creates tight coupling and makes the pipeline rigid to change.\n\nChain of Responsibility organises handlers into a linked chain. Each handler decides: 'Can I handle this? If yes, process it. If no, pass it to the next handler.' The sender knows only the first handler; each handler knows only the next one.\n\nThis pattern is ubiquitous in real systems: HTTP middleware pipelines, event bubbling in the DOM, exception unwinding up a call stack, and support ticket escalation all follow the same structure. The chain can be assembled dynamically at runtime, handlers can be added/removed/reordered without touching request-sending code.",

  classDiagramSvg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#cor-arr); }
    .s-dash { stroke-dasharray:5,3; }
  </style>
  <defs>
    <marker id="cor-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="10" y="80" width="80" height="45" class="s-box s-diagram-box"/>
  <text x="50" y="100" text-anchor="middle" class="s-title s-diagram-title">Client</text>
  <!-- Handler Interface -->
  <rect x="140" y="10" width="200" height="75" class="s-box s-diagram-box"/>
  <text x="240" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Handler</text>
  <line x1="140" y1="33" x2="340" y2="33" class="s-diagram-line"/>
  <text x="150" y="50" class="s-member s-diagram-member">-next: Handler</text>
  <text x="150" y="64" class="s-member s-diagram-member">+setNext(h): Handler</text>
  <text x="150" y="78" class="s-member s-diagram-member">+handle(req): void</text>
  <!-- ConcreteHandlerA -->
  <rect x="140" y="130" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="205" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteHandlerA</text>
  <line x1="140" y1="153" x2="270" y2="153" class="s-diagram-line"/>
  <text x="148" y="170" class="s-member s-diagram-member">+handle(req)</text>
  <!-- ConcreteHandlerB -->
  <rect x="290" y="130" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="355" y="148" text-anchor="middle" class="s-title s-diagram-title">ConcreteHandlerB</text>
  <line x1="290" y1="153" x2="420" y2="153" class="s-diagram-line"/>
  <text x="298" y="170" class="s-member s-diagram-member">+handle(req)</text>
  <!-- Flow arrow -->
  <rect x="460" y="80" width="90" height="45" class="s-box s-diagram-box"/>
  <text x="505" y="100" text-anchor="middle" class="s-title s-diagram-title">Request</text>
  <!-- Arrows -->
  <line x1="90" y1="100" x2="140" y2="50" class="s-arr s-diagram-arrow"/>
  <line x1="205" y1="130" x2="205" y2="85" class="s-arr s-diagram-arrow"/>
  <line x1="355" y1="130" x2="310" y2="85" class="s-arr s-diagram-arrow"/>
  <line x1="270" y1="160" x2="290" y2="160" class="s-arr s-diagram-arrow"/>
  <text x="276" y="155" class="s-member s-diagram-member">next</text>
  <line x1="460" y1="100" x2="420" y2="160" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Client holds only a reference to the first Handler in the chain. When the Client sends a request, it calls handle(request) on that first handler. Each ConcreteHandler evaluates the request: if it can process it (based on level, type, condition), it does so and may choose to stop the chain. If it cannot, it calls this.next.handle(request) to pass the request to the next handler. The chain ends when a handler processes the request or when the last handler finds no next link. Handlers are assembled into the chain via setNext() calls, which can be done at application startup, from configuration, or even dynamically.",

  diagramComponents: [
    {
      name: "Handler (interface/abstract)",
      description:
        "Declares the handle() method. Often includes a default setNext() implementation and a passToNext() helper that handles the null-check. The common base class can implement the default 'pass along' behavior so concrete handlers only override handle().",
    },
    {
      name: "ConcreteHandler",
      description:
        "Implements handle() with two branches: (1) if it can handle the request, do so; (2) otherwise call super.handle(request) or this.next.handle(request). Each concrete handler encapsulates its own decision criteria and processing logic.",
    },
    {
      name: "Client",
      description:
        "Assembles the chain by linking handlers with setNext(). Sends requests to the first handler in the chain only — it has no knowledge of which handler will ultimately process the request.",
    },
  ],

  solutionDetail:
    "**Building the Chain**: Handlers are linked via their `next` reference. The typical pattern:\n```\nhandlerA.setNext(handlerB).setNext(handlerC);\n```\nsetNext() returns the handler it was called on, enabling fluent chaining.\n\n**Handling Logic**: Each handler follows this skeleton:\n```\nhandle(request):\n  if canHandle(request):\n    process(request)\n    // optionally stop the chain (handled)\n    // or continue: next.handle(request) for inspection chains\n  else:\n    next.handle(request)\n```\n\n**Two Flavors**:\n- **Exclusive handling**: Once a handler processes the request, the chain stops (support escalation, auth middleware)\n- **Pipeline / pipe-and-filter**: Every handler processes the request in sequence, each one potentially transforming it (HTTP middleware, logging pipelines)\n\n**Assembly Strategies**:\n- At startup from configuration (e.g., middleware pipeline in web framework)\n- From a list of handlers in priority order\n- Dynamically per request based on request type\n\n**Null Object at End**: Add a fallback 'DefaultHandler' at the end that handles any request not caught by earlier handlers, preventing null pointer errors.",

  characteristics: [
    "Decouples senders from receivers — sender only knows the first handler",
    "Single Responsibility: each handler handles exactly one kind of request",
    "Open/Closed: new handlers can be inserted without modifying existing ones",
    "Chain can be assembled and reordered at runtime",
    "Request may go unhandled if no handler in the chain can process it — always include a default",
    "Two modes: exclusive (first match wins) or pipeline (all handlers process)",
    "Used in middleware systems, event bubbling, exception propagation, and approval workflows",
  ],

  useCases: [
    {
      id: 1,
      title: "HTTP Middleware Pipeline",
      domain: "Web Framework",
      description:
        "Express/Koa/ASP.NET style: each HTTP request passes through authentication, rate limiting, request logging, body parsing, and route handling — each as a separate middleware.",
      whySingleton:
        "Each middleware is a handler. Auth middleware can reject before rate limiting runs. Logging always passes the request along. Route handler is the last handler in the chain.",
      code: `def auth_middleware(req, next_handler):
    if not req.headers.get("Authorization"):
        return Response(401)
    return next_handler(req)  # pass along if authenticated`,
    },
    {
      id: 2,
      title: "Support Ticket Escalation",
      domain: "Customer Service",
      description:
        "A support ticket goes to Level-1 support first. If unresolved, it escalates to Level-2, then to a senior engineer, then to the engineering manager.",
      whySingleton:
        "Each support level is a handler. L1Handler checks if the ticket is a known FAQ; if yes, handles it. If not, passes to L2Handler. This models real escalation without a central router.",
      code: `class L1SupportHandler(Handler):
    def handle(self, ticket: Ticket):
        if ticket.priority == Priority.LOW:
            return self.resolve(ticket)
        return super().handle(ticket)  # escalate`,
    },
    {
      id: 3,
      title: "Form Validation Pipeline",
      domain: "Frontend / Backend",
      description:
        "Form data passes through: NotEmpty → TypeCheck → RangeCheck → BusinessRuleCheck. Each validator stops the chain on failure and returns an error.",
      whySingleton:
        "Validation rules are handlers. Each validator runs independently and can short-circuit with an error. Adding a new rule is adding a new handler without touching others.",
      code: `class NotEmptyValidator(Validator):
    def validate(self, field, value, next_v):
        if not value:
            return ValidationError(f"{field} is required")
        return next_v(field, value)`,
    },
    {
      id: 4,
      title: "DOM Event Bubbling",
      domain: "Browser / Frontend",
      description:
        "Click events on a nested element bubble up through parent elements: button → div → section → body → document. Any element in the chain can handle or stop propagation.",
      whySingleton:
        "Each DOM element is a handler. Clicking a button first lets the button handle it; if not stopped (stopPropagation), the event bubbles up the chain to parent handlers.",
      code: `# Simulating event bubbling chain
def on_click(element, event):
    if element.has_listener('click'):
        element.fire_listener(event)
    if not event.stopped and element.parent:
        on_click(element.parent, event)`,
    },
    {
      id: 5,
      title: "Exception Handling / Try-Catch Unwinding",
      domain: "Language Runtimes",
      description:
        "When an exception is thrown, the runtime looks for a matching catch() handler, unwinding the call stack (chain of method calls). The first matching catch handles it.",
      whySingleton:
        "Each stack frame (method) is a handler. If it has a matching catch for the exception type, it handles it. Otherwise, the exception propagates (passes) to the caller's frame.",
      code: `# Modelling catch chain explicitly
class ExceptionHandler:
    def handle(self, exception, next_h):
        if isinstance(exception, self.handles_type):
            return self.catch(exception)
        return next_h(exception)`,
    },
    {
      id: 6,
      title: "Logging Level Filtering",
      domain: "Observability",
      description:
        "A log message passes through: ConsoleHandler (DEBUG+) → FileHandler (WARN+) → AlertingHandler (ERROR+). Each handler checks if the log level meets its threshold before acting.",
      whySingleton:
        "Each logging sink is a handler. DEBUG messages are handled by ConsoleHandler only. ERROR messages pass through all three handlers, being written to console, file, and triggering alerts.",
      code: `class FileLogHandler(LogHandler):
    def handle(self, record: LogRecord):
        if record.level >= Level.WARN:
            self._write_to_file(record)
        super().handle(record)  # always pass along`,
    },
    {
      id: 7,
      title: "Purchase Approval Workflow",
      domain: "Enterprise / ERP",
      description:
        "A purchase request is approved by team lead (<$1K), department head (<$10K), VP (<$100K), CFO (any amount). The request chains through approvers until the right level approves.",
      whySingleton:
        "Each approver is a handler. TeamLead can approve amounts under $1K. Otherwise passes to DeptHead. This is a textbook exclusive-handling chain.",
      code: `class TeamLeadApprover(Approver):
    LIMIT = 1_000
    def handle(self, request: PurchaseRequest):
        if request.amount <= self.LIMIT:
            print(f"TeamLead approves \${request.amount}")
        else:
            super().handle(request)  # escalate`,
    },
    {
      id: 8,
      title: "CORS Policy Check",
      domain: "Web Framework",
      description:
        "An incoming request passes through origin check → preflight handler → credentials check → actual request handler. Each CORS stage is a separate handler.",
      whySingleton:
        "CORS stages are chained handlers. Origin validator rejects forbidden origins. Preflight handler responds to OPTIONS requests early. Remaining handlers only run for valid cross-origin requests.",
      code: `class OriginCheckHandler(CORSHandler):
    def handle(self, req, next_h):
        if req.origin not in self.allowed_origins:
            return Response(403, "Origin not allowed")
        return next_h(req)`,
    },
    {
      id: 9,
      title: "Data Transformation Pipeline",
      domain: "ETL / Data Engineering",
      description:
        "A raw data record passes through: Schema Validation → Sanitization → Enrichment → Normalization → Storage. Each step transforms or validates the record.",
      whySingleton:
        "Each ETL step is a handler. Schema validator stops the chain with an error for invalid records. Enrichment adds derived fields. This is a pipeline variant where all steps run.",
      code: `class EnrichmentHandler(ETLHandler):
    def handle(self, record: dict):
        record['country'] = lookup_country(record['ip'])
        return super().handle(record)  # always pass along`,
    },
    {
      id: 10,
      title: "Plugin / Extension Hook System",
      domain: "Developer Tools",
      description:
        "An IDE's code formatter tries formatters in order: EditorConfig → Prettier → ESLint fixer → fallback. The first formatter that claims file ownership handles it.",
      whySingleton:
        "Each formatter plugin is a handler. EditorConfig checks for .editorconfig in the project. If found, formats and stops. Otherwise, Prettier tries next. New plugins slot in without touching others.",
      code: `class PrettierPlugin(FormatterPlugin):
    def handle(self, file: SourceFile):
        if self.has_prettier_config(file.dir):
            return self.format(file)
        super().handle(file)  # try next plugin`,
    },
    {
      id: 11,
      title: "API Rate Limiting (Tiered)",
      domain: "API Gateway",
      description:
        "An API request hits: IP-level rate limiter → User-level rate limiter → Plan-level rate limiter (Free/Pro/Enterprise) → request handler. Each limiter has its own threshold.",
      whySingleton:
        "Each rate limiter is a handler checking its own limit store. IP limiter is cheapest (Redis lookup) and runs first. Plan limiter is most expensive and runs last. Chain stops at first limit exceeded.",
      code: `class PlanRateLimiter(RateLimitHandler):
    def handle(self, req: APIRequest):
        plan_limit = PLAN_LIMITS[req.user.plan]
        if self.count(req.user.id) > plan_limit:
            return Response(429, "Plan rate limit exceeded")
        super().handle(req)`,
    },
    {
      id: 12,
      title: "Rendering Fallback Chain",
      domain: "Frontend / CDN",
      description:
        "When rendering a component, try: in-memory cache → Redis cache → database fetch → default placeholder. The first successful source stops the chain.",
      whySingleton:
        "Each source is a handler. Memory cache returns instantly on hit. Redis cache is tried on miss. DB fetch is the last real handler. Default placeholder catches when DB has no data.",
      code: `class RedisCacheHandler(RenderHandler):
    def handle(self, key: str):
        cached = self.redis.get(key)
        if cached:
            return cached  # cache hit — stop chain
        return super().handle(key)  # cache miss — try DB`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "HTTP Middleware Pipeline",
      domain: "Web Framework",
      problem:
        "An HTTP server needs to run every incoming request through several processing stages: rate limiting, authentication, request logging, and finally the actual route handler. Hardcoding these checks in a single method creates an unmaintainable if-else block and makes adding/removing stages difficult.",
      solution:
        "Each processing stage is a Handler. They are linked in a chain: RateLimiter → AuthHandler → Logger → RouteHandler. A request is sent to RateLimiter.handle(). RateLimiter checks the rate limit: if exceeded, it stops the chain (returns 429). Otherwise it calls next.handle(). AuthHandler checks the token: if invalid, stops (returns 401). Logger always logs then calls next. RouteHandler processes the business logic. The chain is assembled at startup and can be reconfigured per endpoint.",
      classDiagramSvg: `<svg viewBox="0 0 480 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#cor-e1);}</style>
  <defs><marker id="cor-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="45" width="80" height="35" class="s-box s-diagram-box"/>
  <text x="50" y="67" text-anchor="middle" class="s-title s-diagram-title">RateLimiter</text>
  <rect x="120" y="45" width="80" height="35" class="s-box s-diagram-box"/>
  <text x="160" y="67" text-anchor="middle" class="s-title s-diagram-title">AuthHandler</text>
  <rect x="230" y="45" width="80" height="35" class="s-box s-diagram-box"/>
  <text x="270" y="67" text-anchor="middle" class="s-title s-diagram-title">Logger</text>
  <rect x="340" y="45" width="100" height="35" class="s-box s-diagram-box"/>
  <text x="390" y="67" text-anchor="middle" class="s-title s-diagram-title">RouteHandler</text>
  <line x1="90" y1="62" x2="120" y2="62" class="s-arr s-diagram-arrow"/>
  <line x1="200" y1="62" x2="230" y2="62" class="s-arr s-diagram-arrow"/>
  <line x1="310" y1="62" x2="340" y2="62" class="s-arr s-diagram-arrow"/>
  <text x="95" y="57" class="s-member s-diagram-member">next</text>
  <text x="205" y="57" class="s-member s-diagram-member">next</text>
  <text x="315" y="57" class="s-member s-diagram-member">next</text>
</svg>`,
      code: {
        Python: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
from collections import defaultdict
from datetime import datetime

# ── Request / Response data structures ────────────────────────────────────────
@dataclass
class HTTPRequest:
    method: str          # GET, POST, etc.
    path: str            # /api/users
    ip_address: str      # client IP for rate limiting
    auth_token: str      # Bearer token for authentication
    body: dict           # request payload

@dataclass
class HTTPResponse:
    status: int          # HTTP status code
    body: str            # response body


# ── Abstract Handler ──────────────────────────────────────────────────────────
# BaseMiddleware provides the chain linking mechanism.
# Concrete middleware only needs to implement handle().
class BaseMiddleware(ABC):
    def __init__(self):
        self._next: Optional[BaseMiddleware] = None  # next handler in chain

    def set_next(self, handler: BaseMiddleware) -> BaseMiddleware:
        # Returns handler so calls can be chained fluently:
        # auth.set_next(logger).set_next(router)
        self._next = handler
        return handler

    def pass_to_next(self, request: HTTPRequest) -> HTTPResponse:
        # Helper: call next if exists; otherwise terminate with 404
        if self._next:
            return self._next.handle(request)
        return HTTPResponse(404, "No handler for this route")

    @abstractmethod
    def handle(self, request: HTTPRequest) -> HTTPResponse: ...


# ── Concrete Handlers ─────────────────────────────────────────────────────────
# RateLimiter: checks how many requests came from this IP in the last minute
class RateLimiterMiddleware(BaseMiddleware):
    LIMIT = 5  # max 5 requests per window

    def __init__(self):
        super().__init__()
        self._counts: dict[str, int] = defaultdict(int)  # IP → count

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        self._counts[request.ip_address] += 1
        if self._counts[request.ip_address] > self.LIMIT:
            # Stop the chain — too many requests from this IP
            print(f"[RateLimiter] ❌ {request.ip_address} exceeded limit")
            return HTTPResponse(429, "Too Many Requests")
        print(f"[RateLimiter] ✅ {request.ip_address} ({self._counts[request.ip_address]}/{self.LIMIT})")
        # Pass to next handler in the chain
        return self.pass_to_next(request)


# AuthMiddleware: validates the Bearer token
class AuthMiddleware(BaseMiddleware):
    VALID_TOKENS = {"secret-token-123", "admin-token-456"}

    def handle(self, request: HTTPRequest) -> HTTPResponse:
        token = request.auth_token
        if token not in self.VALID_TOKENS:
            # Stop the chain — not authenticated
            print(f"[Auth] ❌ Invalid token: {token!r}")
            return HTTPResponse(401, "Unauthorized")
        print(f"[Auth] ✅ Token valid")
        # Authenticated — pass along the chain to the next handler
        return self.pass_to_next(request)


# LoggingMiddleware: always logs then always passes along (pipeline style)
class LoggingMiddleware(BaseMiddleware):
    def handle(self, request: HTTPRequest) -> HTTPResponse:
        ts = datetime.now().strftime("%H:%M:%S")
        print(f"[Logger] {ts} {request.method} {request.path} from {request.ip_address}")
        # Always pass to next — logging never stops the chain
        response = self.pass_to_next(request)
        print(f"[Logger] → responded {response.status}")
        return response


# RouteHandler: actual business logic — last link in the chain
class RouteHandler(BaseMiddleware):
    def handle(self, request: HTTPRequest) -> HTTPResponse:
        print(f"[Router] Handling {request.method} {request.path}")
        if request.path == "/api/users" and request.method == "GET":
            return HTTPResponse(200, '{"users": ["alice", "bob"]}')
        return HTTPResponse(404, f"Route not found: {request.path}")


# ── Assemble the chain ────────────────────────────────────────────────────────
# Chain: RateLimiter → Auth → Logger → RouteHandler
# Each link is established with set_next() — chain order = processing order
limiter = RateLimiterMiddleware()
auth = AuthMiddleware()
logger = LoggingMiddleware()
router = RouteHandler()

# Fluent chain assembly — limiter is the entry point
limiter.set_next(auth).set_next(logger).set_next(router)

print("=== Request 1: Valid request ===")
req1 = HTTPRequest("GET", "/api/users", "192.168.1.1", "secret-token-123", {})
resp1 = limiter.handle(req1)  # enters chain at limiter
print(f"Response: {resp1.status} {resp1.body}\n")

print("=== Request 2: No auth token ===")
req2 = HTTPRequest("GET", "/api/users", "192.168.1.2", "bad-token", {})
resp2 = limiter.handle(req2)  # chain stops at Auth
print(f"Response: {resp2.status} {resp2.body}")`,

        Go: `package main

import (
	"fmt"
	"strings"
	"time"
)

// ── Request / Response ────────────────────────────────────────────────────────
type HTTPRequest struct {
	Method    string
	Path      string
	IPAddress string
	AuthToken string
}

type HTTPResponse struct {
	Status int
	Body   string
}

// ── Handler Interface ─────────────────────────────────────────────────────────
// All middleware must implement Handler.
// The default pass-along logic lives in BaseHandler (embedded struct).
type Handler interface {
	Handle(req *HTTPRequest) *HTTPResponse
	SetNext(h Handler) Handler
}

// BaseHandler: shared chain-linking logic — embedded in concrete handlers
type BaseHandler struct {
	next Handler // the next handler in the chain
}

func (b *BaseHandler) SetNext(h Handler) Handler {
	b.next = h
	return h // return h for fluent chaining
}

func (b *BaseHandler) PassToNext(req *HTTPRequest) *HTTPResponse {
	if b.next != nil {
		return b.next.Handle(req)
	}
	return &HTTPResponse{Status: 404, Body: "Not Found"}
}

// ── Rate Limiter ───────────────────────────────────────────────────────────────
type RateLimiter struct {
	BaseHandler
	counts map[string]int // IP → request count
	limit  int
}

func NewRateLimiter(limit int) *RateLimiter {
	return &RateLimiter{counts: make(map[string]int), limit: limit}
}

func (r *RateLimiter) Handle(req *HTTPRequest) *HTTPResponse {
	r.counts[req.IPAddress]++
	if r.counts[req.IPAddress] > r.limit {
		fmt.Printf("[RateLimiter] ❌ %s exceeded limit\\n", req.IPAddress)
		return &HTTPResponse{Status: 429, Body: "Too Many Requests"} // chain stops here
	}
	fmt.Printf("[RateLimiter] ✅ %s (%d/%d)\\n", req.IPAddress, r.counts[req.IPAddress], r.limit)
	return r.PassToNext(req) // pass along
}

// ── Auth Handler ───────────────────────────────────────────────────────────────
type AuthHandler struct{ BaseHandler }

func (a *AuthHandler) Handle(req *HTTPRequest) *HTTPResponse {
	valid := map[string]bool{"secret-token-123": true, "admin-token-456": true}
	if !valid[req.AuthToken] {
		fmt.Printf("[Auth] ❌ Bad token: %q\\n", req.AuthToken)
		return &HTTPResponse{Status: 401, Body: "Unauthorized"} // chain stops here
	}
	fmt.Println("[Auth] ✅ Token valid")
	return a.PassToNext(req)
}

// ── Logger (pipeline style — always passes) ───────────────────────────────────
type LoggingHandler struct{ BaseHandler }

func (l *LoggingHandler) Handle(req *HTTPRequest) *HTTPResponse {
	fmt.Printf("[Logger] %s %s %s\\n", time.Now().Format("15:04:05"), req.Method, req.Path)
	resp := l.PassToNext(req) // always passes along
	fmt.Printf("[Logger] → %d\\n", resp.Status)
	return resp
}

// ── Route Handler (end of chain) ──────────────────────────────────────────────
type RouteHandler struct{ BaseHandler }

func (r *RouteHandler) Handle(req *HTTPRequest) *HTTPResponse {
	fmt.Printf("[Router] Handling %s %s\\n", req.Method, req.Path)
	if req.Path == "/api/users" && req.Method == "GET" {
		return &HTTPResponse{Status: 200, Body: \`{"users":["alice","bob"]}\`}
	}
	return &HTTPResponse{Status: 404, Body: "Not Found"}
}

func main() {
	// Assemble the chain
	limiter := NewRateLimiter(5)
	auth := &AuthHandler{}
	logger := &LoggingHandler{}
	router := &RouteHandler{}

	limiter.SetNext(auth).SetNext(logger).SetNext(router)

	fmt.Println("=== Request 1: Valid ===")
	r1 := limiter.Handle(&HTTPRequest{"GET", "/api/users", "10.0.0.1", "secret-token-123"})
	fmt.Printf("Response: %d %s\\n\\n", r1.Status, r1.Body)

	fmt.Println("=== Request 2: Bad token ===")
	r2 := limiter.Handle(&HTTPRequest{"GET", "/api/users", "10.0.0.2", "bad"})
	fmt.Printf("Response: %d %s\\n", r2.Status, r2.Body)
	_ = strings.TrimSpace("") // avoid unused import lint
}`,

        Java: `import java.util.*;

// ── Request / Response ────────────────────────────────────────────────────────
record HTTPRequest(String method, String path, String ipAddress, String authToken) {}
record HTTPResponse(int status, String body) {}

// ── Handler Interface ─────────────────────────────────────────────────────────
// All middleware implements this. setNext() returns Handler for fluent chaining.
interface Handler {
    Handler setNext(Handler next);
    HTTPResponse handle(HTTPRequest request);
}

// ── Abstract Base Handler ──────────────────────────────────────────────────────
// Encapsulates the chain-linking logic so concrete handlers focus on their role.
abstract class BaseHandler implements Handler {
    private Handler next; // the next handler in the chain

    @Override
    public Handler setNext(Handler handler) {
        this.next = handler;
        return handler; // enables fluent: a.setNext(b).setNext(c)
    }

    // Subclasses call this to pass the request down the chain
    protected HTTPResponse passToNext(HTTPRequest request) {
        if (next != null) return next.handle(request);
        return new HTTPResponse(404, "Not Found");
    }
}

// ── Rate Limiter Handler ──────────────────────────────────────────────────────
class RateLimiterHandler extends BaseHandler {
    private final int limit;
    private final Map<String, Integer> counts = new HashMap<>();

    RateLimiterHandler(int limit) { this.limit = limit; }

    @Override
    public HTTPResponse handle(HTTPRequest req) {
        int count = counts.merge(req.ipAddress(), 1, Integer::sum);
        if (count > limit) {
            System.out.printf("[RateLimiter] ❌ %s exceeded%n", req.ipAddress());
            return new HTTPResponse(429, "Too Many Requests"); // stop chain
        }
        System.out.printf("[RateLimiter] ✅ %s (%d/%d)%n", req.ipAddress(), count, limit);
        return passToNext(req); // continue chain
    }
}

// ── Auth Handler ──────────────────────────────────────────────────────────────
class AuthHandler extends BaseHandler {
    private final Set<String> validTokens = Set.of("secret-token-123", "admin-token-456");

    @Override
    public HTTPResponse handle(HTTPRequest req) {
        if (!validTokens.contains(req.authToken())) {
            System.out.printf("[Auth] ❌ Bad token: %s%n", req.authToken());
            return new HTTPResponse(401, "Unauthorized"); // stop chain
        }
        System.out.println("[Auth] ✅ Token valid");
        return passToNext(req);
    }
}

// ── Logger Handler (pipeline — always passes) ─────────────────────────────────
class LoggingHandler extends BaseHandler {
    @Override
    public HTTPResponse handle(HTTPRequest req) {
        System.out.printf("[Logger] %s %s%n", req.method(), req.path());
        var resp = passToNext(req); // always continues
        System.out.printf("[Logger] → %d%n", resp.status());
        return resp;
    }
}

// ── Route Handler (end of chain) ──────────────────────────────────────────────
class RouteHandler extends BaseHandler {
    @Override
    public HTTPResponse handle(HTTPRequest req) {
        System.out.printf("[Router] %s %s%n", req.method(), req.path());
        if ("/api/users".equals(req.path()) && "GET".equals(req.method()))
            return new HTTPResponse(200, "{\"users\":[\"alice\",\"bob\"]}");
        return new HTTPResponse(404, "Not Found");
    }
}

class ChainDemo {
    public static void main(String[] args) {
        // Chain assembly: RateLimiter → Auth → Logger → Router
        var limiter = new RateLimiterHandler(5);
        limiter.setNext(new AuthHandler())
               .setNext(new LoggingHandler())
               .setNext(new RouteHandler());

        System.out.println("=== Request 1: Valid ===");
        var r1 = limiter.handle(new HTTPRequest("GET", "/api/users", "10.0.0.1", "secret-token-123"));
        System.out.printf("Response: %d %s%n%n", r1.status(), r1.body());

        System.out.println("=== Request 2: No auth ===");
        var r2 = limiter.handle(new HTTPRequest("GET", "/api/users", "10.0.0.2", "bad-token"));
        System.out.printf("Response: %d %s%n", r2.status(), r2.body());
    }
}`,

        TypeScript: `// ── Request / Response types ─────────────────────────────────────────────────
interface HTTPRequest {
  method: string;
  path: string;
  ipAddress: string;
  authToken: string;
}
interface HTTPResponse { status: number; body: string; }

// ── Handler Interface ─────────────────────────────────────────────────────────
// Every middleware must implement this contract.
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: HTTPRequest): HTTPResponse;
}

// ── Abstract Base Handler ─────────────────────────────────────────────────────
// Manages the chain link — concrete handlers focus only on their own logic.
abstract class BaseHandler implements Handler {
  private next?: Handler; // next in chain

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler; // enables fluent: a.setNext(b).setNext(c)
  }

  protected passToNext(req: HTTPRequest): HTTPResponse {
    return this.next?.handle(req) ?? { status: 404, body: "Not Found" };
  }

  abstract handle(request: HTTPRequest): HTTPResponse;
}

// ── Rate Limiter ──────────────────────────────────────────────────────────────
// First in chain: checks IP-level request count before anything else
class RateLimiterHandler extends BaseHandler {
  private counts = new Map<string, number>();

  constructor(private limit: number) { super(); }

  handle(req: HTTPRequest): HTTPResponse {
    const count = (this.counts.get(req.ipAddress) ?? 0) + 1;
    this.counts.set(req.ipAddress, count);

    if (count > this.limit) {
      console.log(\`[RateLimiter] ❌ \${req.ipAddress} exceeded\`);
      return { status: 429, body: "Too Many Requests" }; // stop chain
    }
    console.log(\`[RateLimiter] ✅ \${req.ipAddress} (\${count}/\${this.limit})\`);
    return this.passToNext(req); // continue to next handler
  }
}

// ── Auth Handler ──────────────────────────────────────────────────────────────
// Stops chain with 401 if token is invalid; passes to logger if valid
class AuthHandler extends BaseHandler {
  private validTokens = new Set(["secret-token-123", "admin-token-456"]);

  handle(req: HTTPRequest): HTTPResponse {
    if (!this.validTokens.has(req.authToken)) {
      console.log(\`[Auth] ❌ Bad token: \${req.authToken}\`);
      return { status: 401, body: "Unauthorized" }; // stop chain
    }
    console.log("[Auth] ✅ Token valid");
    return this.passToNext(req);
  }
}

// ── Logger Handler ────────────────────────────────────────────────────────────
// Pipeline style: always passes the request along after logging
class LoggingHandler extends BaseHandler {
  handle(req: HTTPRequest): HTTPResponse {
    const ts = new Date().toTimeString().slice(0, 8);
    console.log(\`[Logger] \${ts} \${req.method} \${req.path}\`);
    const resp = this.passToNext(req); // always continues
    console.log(\`[Logger] → \${resp.status}\`);
    return resp;
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
// Last in chain: actual business logic
class RouteHandler extends BaseHandler {
  handle(req: HTTPRequest): HTTPResponse {
    console.log(\`[Router] Handling \${req.method} \${req.path}\`);
    if (req.path === "/api/users" && req.method === "GET")
      return { status: 200, body: '{"users":["alice","bob"]}' };
    return { status: 404, body: "Not Found" };
  }
}

// ── Chain Assembly ────────────────────────────────────────────────────────────
const limiter = new RateLimiterHandler(5);
limiter.setNext(new AuthHandler()).setNext(new LoggingHandler()).setNext(new RouteHandler());

console.log("=== Request 1: Valid ===");
const r1 = limiter.handle({ method: "GET", path: "/api/users", ipAddress: "10.0.0.1", authToken: "secret-token-123" });
console.log(\`Response: \${r1.status} \${r1.body}\n\`);

console.log("=== Request 2: Bad token ===");
const r2 = limiter.handle({ method: "GET", path: "/api/users", ipAddress: "10.0.0.2", authToken: "bad-token" });
console.log(\`Response: \${r2.status} \${r2.body}\`);`,

        Rust: `// ── Request / Response ────────────────────────────────────────────────────────
#[derive(Debug, Clone)]
struct HTTPRequest {
    method: String,
    path: String,
    ip_address: String,
    auth_token: String,
}

#[derive(Debug)]
struct HTTPResponse { status: u16, body: String }

// ── Handler Trait ─────────────────────────────────────────────────────────────
// All middleware implements this trait.
trait Handler {
    fn handle(&self, req: &HTTPRequest) -> HTTPResponse;
}

// ── Rate Limiter ──────────────────────────────────────────────────────────────
use std::collections::HashMap;
use std::cell::RefCell;

struct RateLimiter {
    next: Option<Box<dyn Handler>>,
    limit: u32,
    counts: RefCell<HashMap<String, u32>>,
}

impl RateLimiter {
    fn new(limit: u32, next: Option<Box<dyn Handler>>) -> Self {
        Self { next, limit, counts: RefCell::new(HashMap::new()) }
    }
}

impl Handler for RateLimiter {
    fn handle(&self, req: &HTTPRequest) -> HTTPResponse {
        let mut counts = self.counts.borrow_mut();
        let count = counts.entry(req.ip_address.clone()).or_insert(0);
        *count += 1;
        if *count > self.limit {
            println!("[RateLimiter] ❌ {} exceeded", req.ip_address);
            return HTTPResponse { status: 429, body: "Too Many Requests".into() };
        }
        println!("[RateLimiter] ✅ {}", req.ip_address);
        drop(counts); // release borrow before calling next
        self.next.as_ref().map_or(
            HTTPResponse { status: 404, body: "Not Found".into() },
            |n| n.handle(req)
        )
    }
}

// ── Auth Handler ──────────────────────────────────────────────────────────────
struct AuthHandler { next: Option<Box<dyn Handler>> }

impl Handler for AuthHandler {
    fn handle(&self, req: &HTTPRequest) -> HTTPResponse {
        if req.auth_token != "secret-token-123" {
            println!("[Auth] ❌ Bad token");
            return HTTPResponse { status: 401, body: "Unauthorized".into() };
        }
        println!("[Auth] ✅ Token valid");
        self.next.as_ref().map_or(
            HTTPResponse { status: 404, body: "Not Found".into() },
            |n| n.handle(req)
        )
    }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
struct RouteHandler;

impl Handler for RouteHandler {
    fn handle(&self, req: &HTTPRequest) -> HTTPResponse {
        println!("[Router] {} {}", req.method, req.path);
        HTTPResponse { status: 200, body: r#"{"users":["alice","bob"]}"#.into() }
    }
}

fn main() {
    // Chain: RateLimiter → Auth → RouteHandler (built inside-out)
    let chain = RateLimiter::new(5, Some(Box::new(AuthHandler {
        next: Some(Box::new(RouteHandler))
    })));

    let req1 = HTTPRequest {
        method: "GET".into(), path: "/api/users".into(),
        ip_address: "10.0.0.1".into(), auth_token: "secret-token-123".into(),
    };
    println!("=== Request 1 ===");
    let r1 = chain.handle(&req1);
    println!("Response: {} {}\\n", r1.status, r1.body);

    let mut req2 = req1.clone();
    req2.auth_token = "bad".into();
    println!("=== Request 2 (bad token) ===");
    let r2 = chain.handle(&req2);
    println!("Response: {} {}", r2.status, r2.body);
}`,
      },
      considerations: [
        "Always handle the 'no handler matched' case — add a DefaultHandler at the end of the chain",
        "Log which handler processed the request in production for observability",
        "Handler order matters — put cheap checks (rate limiting) before expensive ones (auth)",
        "Stateful handlers (rate limiter) need thread-safe state if handling concurrent requests",
        "Pipeline variant (all handlers run) vs exclusive variant (first match wins) must be a deliberate design decision",
      ],
    },
  ],

  variantsTabLabel: "Chain Types",
  variantsBestPick:
    "Exclusive Chain is the standard GoF pattern. Pipeline Chain is more common in modern frameworks (HTTP middleware). Choose based on whether the chain should stop on first match or always run all handlers.",

  variants: [
    {
      id: 1,
      name: "Exclusive Chain (First Match Wins)",
      description:
        "The classic GoF variant. Once a handler processes the request, the chain stops. Used for approval workflows, support escalation, and routing.",
      code: {
        Python: `class ApprovalHandler(ABC):
    def set_next(self, h): self._next = h; return h

    def handle(self, amount: float):
        if self.can_approve(amount):
            print(f"{self.__class__.__name__} approves \${amount}")
            return True  # stop chain
        if self._next:
            return self._next.handle(amount)
        print("No approver found")
        return False

class TeamLead(ApprovalHandler):
    def can_approve(self, amount): return amount <= 1_000

class DeptHead(ApprovalHandler):
    def can_approve(self, amount): return amount <= 10_000`,
        Go: `type ApprovalHandler interface {
    Handle(amount float64) bool
    SetNext(h ApprovalHandler) ApprovalHandler
}

type TeamLead struct { next ApprovalHandler }
func (t *TeamLead) Handle(amount float64) bool {
    if amount <= 1_000 {
        fmt.Printf("TeamLead approves $%.0f\\n", amount); return true
    }
    if t.next != nil { return t.next.Handle(amount) }
    return false
}`,
        Java: `abstract class ApprovalHandler {
    protected ApprovalHandler next;
    ApprovalHandler setNext(ApprovalHandler h) { next = h; return h; }
    abstract boolean handle(double amount);
}

class TeamLead extends ApprovalHandler {
    boolean handle(double amount) {
        if (amount <= 1_000) { System.out.println("TeamLead approves"); return true; }
        return next != null && next.handle(amount);
    }
}`,
        TypeScript: `abstract class ApprovalHandler {
  protected next?: ApprovalHandler;
  setNext(h: ApprovalHandler) { this.next = h; return h; }
  abstract handle(amount: number): boolean;
  protected passOn(amount: number) { return this.next?.handle(amount) ?? false; }
}

class TeamLead extends ApprovalHandler {
  handle(amount: number) {
    if (amount <= 1_000) { console.log("TeamLead approves"); return true; }
    return this.passOn(amount);
  }
}`,
        Rust: `trait Approver { fn handle(&self, amount: f64) -> bool; }

struct TeamLead { next: Option<Box<dyn Approver>> }
impl Approver for TeamLead {
    fn handle(&self, amount: f64) -> bool {
        if amount <= 1_000.0 { println!("TeamLead approves"); return true; }
        self.next.as_ref().map_or(false, |n| n.handle(amount))
    }
}`,
      },
      pros: ["Clear single-handler ownership", "Short-circuits early for performance"],
      cons: ["A request can fall through the chain without being handled — always add a default"],
    },
    {
      id: 2,
      name: "Pipeline Chain (All Handlers Run)",
      description:
        "Every handler processes the request in sequence, often transforming it. Used for HTTP middleware, data transformation, and logging pipelines.",
      code: {
        Python: `class PipelineMiddleware(ABC):
    def set_next(self, h): self._next = h; return h

    def handle(self, request: dict) -> dict:
        request = self.process(request)  # each handler transforms
        if self._next:
            return self._next.handle(request)
        return request  # return final transformed request

    @abstractmethod
    def process(self, request: dict) -> dict: ...

class TimestampMiddleware(PipelineMiddleware):
    def process(self, req):
        req['timestamp'] = time.time()  # add field
        return req

class SanitizeMiddleware(PipelineMiddleware):
    def process(self, req):
        req['body'] = sanitize(req.get('body', ''))  # transform field
        return req`,
        Go: `type PipelineHandler interface {
    Process(req map[string]any) map[string]any
    SetNext(h PipelineHandler) PipelineHandler
    Handle(req map[string]any) map[string]any
}

type BasePipeline struct{ next PipelineHandler }
func (b *BasePipeline) Handle(req map[string]any) map[string]any {
    req = b.Process(req) // always process
    if b.next != nil { return b.next.Handle(req) }
    return req // all steps run
}`,
        Java: `abstract class PipelineMiddleware {
    protected PipelineMiddleware next;
    PipelineMiddleware setNext(PipelineMiddleware h) { next = h; return h; }
    abstract Map<String,Object> process(Map<String,Object> req);
    Map<String,Object> handle(Map<String,Object> req) {
        req = process(req); // always runs
        return next != null ? next.handle(req) : req;
    }
}`,
        TypeScript: `abstract class PipelineMiddleware {
  protected next?: PipelineMiddleware;
  setNext(h: PipelineMiddleware) { this.next = h; return h; }
  abstract process(req: Record<string, unknown>): Record<string, unknown>;
  handle(req: Record<string, unknown>): Record<string, unknown> {
    const transformed = this.process(req); // always processes
    return this.next ? this.next.handle(transformed) : transformed;
  }
}`,
        Rust: `trait PipelineHandler {
    fn process(&self, req: &mut std::collections::HashMap<String,String>);
    fn handle(&self, req: &mut std::collections::HashMap<String,String>);
}`,
      },
      pros: [
        "Each handler transforms the request — clean separation of transformation steps",
        "All handlers contribute regardless of earlier processing",
      ],
      cons: [
        "Cannot short-circuit on error without special mechanism (use Result return type)",
        "Handler order matters for correctness",
      ],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Behavioral" },
    { aspect: "Intent", detail: "Pass a request along a chain of handlers; each handler either processes it or passes it to the next" },
    { aspect: "Also Known As", detail: "Middleware Pipeline, Event Bubble" },
    { aspect: "Core Mechanism", detail: "Each handler holds a reference to the next handler; handle() either processes or delegates" },
    { aspect: "Exclusive vs Pipeline", detail: "Exclusive: first match handles (approval flow). Pipeline: all handlers run sequentially (HTTP middleware)" },
    { aspect: "Chain Assembly", detail: "Built via setNext() calls at startup or from configuration; order of linking = order of processing" },
    { aspect: "Risk", detail: "Request may go unhandled if no handler matches — always add a fallback DefaultHandler" },
    { aspect: "Real-World Examples", detail: "Express/Koa middleware, ASP.NET request pipeline, DOM event bubbling, try-catch stack unwinding" },
    { aspect: "When to Use", detail: "When more than one object may handle a request, when the handler set is dynamic, or when you want both sender and receiver decoupled" },
    { aspect: "Common Pairings", detail: "Composite (handlers with sub-handlers), Command (requests as commands), Decorator (wrapping handlers)" },
  ],

  antiPatterns: [
    {
      name: "No Default Handler",
      description:
        "The chain has no fallback at the end. If no handler processes the request, the call returns null or throws NullPointerException — a runtime surprise for the client.",
      betterAlternative:
        "Always add a DefaultHandler or NullHandler at the end that logs a warning and returns a safe default response. This prevents silent failures.",
    },
    {
      name: "Monolithic Handler",
      description:
        "A single ConcreteHandler checks for all request types internally using a giant if-else block, negating the pattern's benefit of separation of concerns.",
      betterAlternative:
        "Each ConcreteHandler should handle exactly one type/condition of request. If a handler is growing complex, split it into separate handlers and link them.",
    },
    {
      name: "Circular Chain",
      description:
        "A handler accidentally sets itself (or an ancestor) as the next handler, creating an infinite loop. There is no built-in cycle detection in the chain.",
      betterAlternative:
        "Track handlers added to the chain in the factory or builder. Assert no cycles when assembling the chain in tests. Use a maximum-depth counter as a guard in production.",
    },
  ],
};

export default chainOfResponsibilityData;
