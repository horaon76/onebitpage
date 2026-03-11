import { PatternData } from "@/lib/patterns/types";

const flyweightData: PatternData = {
  slug: "flyweight",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Flyweight Pattern",
  subtitle:
    "Use sharing to support large numbers of fine-grained objects efficiently by separating shared intrinsic state from unique extrinsic state.",

  intent:
    "When your application creates thousands (or millions) of objects that share most of their data, the memory overhead becomes enormous. A forest of 1,000,000 trees — each storing its own species, color, and texture — would consume gigabytes. Yet most trees share the same species-level data.\n\nFlyweight solves this by splitting object state into two categories:\n- **Intrinsic state**: data that is identical across many objects (e.g., tree species, texture, color) — stored once in a shared Flyweight object\n- **Extrinsic state**: data unique to each instance (e.g., x/y position, age, health) — passed in from outside at runtime\n\nA FlyweightFactory caches and reuses Flyweight objects. Instead of 1,000,000 tree objects each with a full copy of species data, you have 3 Flyweight objects (species types) and 1,000,000 lightweight contexts holding only position data — a dramatic reduction in memory use.",

  classDiagramSvg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fw-arr); }
  </style>
  <defs>
    <marker id="fw-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="10" y="70" width="100" height="50" class="s-box s-diagram-box"/>
  <text x="60" y="90" text-anchor="middle" class="s-title s-diagram-title">Client</text>
  <line x1="10" y1="95" x2="110" y2="95" class="s-diagram-line"/>
  <text x="18" y="112" class="s-member s-diagram-member">+extrinsicState</text>
  <!-- FlyweightFactory -->
  <rect x="160" y="10" width="200" height="70" class="s-box s-diagram-box"/>
  <text x="260" y="28" text-anchor="middle" class="s-title s-diagram-title">FlyweightFactory</text>
  <line x1="160" y1="33" x2="360" y2="33" class="s-diagram-line"/>
  <text x="168" y="50" class="s-member s-diagram-member">-cache: Map</text>
  <text x="168" y="65" class="s-member s-diagram-member">+getFlyweight(key)</text>
  <!-- Flyweight Interface -->
  <rect x="160" y="120" width="200" height="60" class="s-box s-diagram-box"/>
  <text x="260" y="138" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Flyweight</text>
  <line x1="160" y1="143" x2="360" y2="143" class="s-diagram-line"/>
  <text x="168" y="160" class="s-member s-diagram-member">-intrinsicState</text>
  <text x="168" y="173" class="s-member s-diagram-member">+operation(extrinsic)</text>
  <!-- ConcreteFlyweight -->
  <rect x="400" y="120" width="150" height="60" class="s-box s-diagram-box"/>
  <text x="475" y="138" text-anchor="middle" class="s-title s-diagram-title">ConcreteFlyweight</text>
  <line x1="400" y1="143" x2="550" y2="143" class="s-diagram-line"/>
  <text x="408" y="160" class="s-member s-diagram-member">-intrinsicState</text>
  <text x="408" y="173" class="s-member s-diagram-member">+operation(extrinsic)</text>
  <!-- Arrows -->
  <line x1="110" y1="90" x2="160" y2="40" class="s-arr s-diagram-arrow"/>
  <line x1="110" y1="100" x2="160" y2="150" class="s-arr s-diagram-arrow"/>
  <line x1="360" y1="45" x2="360" y2="120" class="s-arr s-diagram-arrow"/>
  <line x1="400" y1="155" x2="360" y2="155" class="s-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "The Client holds extrinsic state (the unique per-instance data like coordinates or IDs). Before creating an object, the Client asks the FlyweightFactory for a Flyweight keyed by intrinsic state (e.g., a tree species name). The FlyweightFactory checks its internal cache: if a Flyweight with that key already exists, it returns the cached instance; otherwise, it creates a new one, caches it, and returns it. The Flyweight holds only the intrinsic (shared) state. Each call to operation() receives the extrinsic state as parameters — it doesn't store them. Many thousands of Client contexts can reference the same few Flyweight objects, achieving massive memory savings.",

  diagramComponents: [
    {
      name: "Flyweight (interface)",
      description:
        "Declares the operation() method that accepts extrinsic state as parameters. The intrinsic (shared) state is stored inside the Flyweight — it must be immutable since it is shared.",
    },
    {
      name: "ConcreteFlyweight",
      description:
        "Implements the Flyweight interface. Stores intrinsic state (shared, immutable data). Each unique combination of intrinsic data has exactly one ConcreteFlyweight instance in the cache.",
    },
    {
      name: "FlyweightFactory",
      description:
        "Manages the flyweight pool. Given a key (intrinsic state descriptor), it returns the existing flyweight or creates and caches a new one. The factory ensures sharing is enforced.",
    },
    {
      name: "Client",
      description:
        "Stores extrinsic state (unique per-instance data). Passes extrinsic state to flyweight.operation() calls. Never stores a full copy of shared data — only holds a reference to the Flyweight.",
    },
  ],

  solutionDetail:
    "**Identifying State Categories**: Before applying Flyweight, audit your object's fields:\n- Intrinsic: could this field be the same across thousands of instances? (e.g., texture, species, color scheme) → move to Flyweight\n- Extrinsic: is this field unique per instance? (e.g., position, name, ID) → keep in client context\n\n**The Factory Cache**: The FlyweightFactory uses a dictionary/map keyed by intrinsic state. Common key strategies:\n- Single string key (species name)\n- Composite key (color + texture + size)\n- Hash of the intrinsic state struct\n\n**Immutability Requirement**: Since multiple contexts share the same Flyweight, its intrinsic state MUST be immutable after creation. Any method that appears to 'modify' it must instead use the extrinsic state passed in.\n\n**Memory Analysis**: If N = number of unique intrinsic combinations and M = total instances:\n- Without Flyweight: M × (intrinsic_size + extrinsic_size) bytes\n- With Flyweight: N × intrinsic_size + M × (reference_size + extrinsic_size)\n- Benefit grows as M >> N (many instances sharing few types)\n\n**Trade-offs**: Flyweight trades memory for CPU (extrinsic state must be computed/looked up per call) and code complexity (the state split must be maintained).",

  characteristics: [
    "Separates object state into intrinsic (shared, immutable) and extrinsic (unique, passed-in)",
    "FlyweightFactory caches shared objects — same intrinsic state always returns the same instance",
    "Intrinsic state must be immutable — it is shared by many contexts simultaneously",
    "Extrinsic state is never stored inside the Flyweight; always passed as parameters",
    "Reduces memory footprint dramatically when many objects share most of their data",
    "May increase CPU usage since extrinsic state must be passed on each operation call",
    "Client code complexity increases — extrinsic state management moves to callers",
  ],

  useCases: [
    {
      id: 1,
      title: "Forest / Vegetation Rendering",
      domain: "Games / Simulation",
      description:
        "A game world has 500,000 trees. Each tree has a species (Oak, Pine, Birch) with an 8MB texture and geometric mesh, but unique x/y/z position and growth stage.",
      whySingleton:
        "Three TreeSpecies Flyweights hold the heavy texture data. 500,000 TreeContext objects hold only position + growth (≈12 bytes each). Memory drops from gigabytes to megabytes.",
      code: `class TreeContext:
    def __init__(self, species: TreeSpecies, x, y, z):
        self.species = species  # shared flyweight
        self.x, self.y, self.z = x, y, z
    def render(self):
        self.species.render(self.x, self.y, self.z)`,
    },
    {
      id: 2,
      title: "Text Editor Character Rendering",
      domain: "Productivity Software",
      description:
        "A rich text editor represents each character in a document as an object. A 1MB document has ~1,000,000 characters, but only ~256 unique glyph shapes (fonts × style variants).",
      whySingleton:
        "GlyphFlyweights store the rendered bitmap/vector for each character glyph. CharacterContext objects store only the index in text and formatting overrides.",
      code: `class GlyphFlyweight:
    def __init__(self, font, size, style):
        self.bitmap = render_glyph(font, size, style)  # heavy data

class CharacterContext:
    def __init__(self, glyph: GlyphFlyweight, row: int, col: int):
        self.glyph = glyph   # shared flyweight
        self.row, self.col = row, col`,
    },
    {
      id: 3,
      title: "Game Bullet / Particle System",
      domain: "Games",
      description:
        "A bullet-hell game spawns 10,000 particles per second. Each particle type (fire, smoke, spark) has shared color, texture, and physics properties but unique position and velocity.",
      whySingleton:
        "Three ParticleType Flyweights hold texture + physics constants. 10,000 active ParticleContext objects hold only x, y, vx, vy (16 bytes each) — enabling real-time performance.",
      code: `class ParticleType:       # Flyweight
    texture: bytes        # shared, heavy
    physics: PhysicsProps

class ParticleContext:    # extrinsic state
    def __init__(self, ptype: ParticleType, x, y, vx, vy):
        self.ptype = ptype
        self.x, self.y, self.vx, self.vy = x, y, vx, vy`,
    },
    {
      id: 4,
      title: "Icon / Sprite Cache in UI Framework",
      domain: "Frontend",
      description:
        "A UI table renders 10,000 rows each with status icons (success, warning, error). Without caching, 10,000 identical Image objects are allocated when only 3 unique icons exist.",
      whySingleton:
        "IconFlyweightFactory caches the decoded image data per icon name. Each row stores only the icon key (string reference) and calls flyweight.draw(x, y) with position as extrinsic state.",
      code: `class IconFlyweightFactory:
    _cache: dict = {}
    def get(self, name: str) -> Icon:
        if name not in self._cache:
            self._cache[name] = Icon(load_svg(name))
        return self._cache[name]`,
    },
    {
      id: 5,
      title: "Connection Pool (DB Connections)",
      domain: "Backend Infrastructure",
      description:
        "Database connections are expensive. Multiple queries share the same underlying TCP connection (intrinsic: host, credentials, pool config) but have unique query contexts (extrinsic).",
      whySingleton:
        "ConnectionFlyweight holds the established TCP socket. Multiple request contexts use the same connection object, passing query and transaction context per call.",
      code: `class ConnectionFlyweight:
    def __init__(self, host, user, password):
        self._conn = connect(host, user, password)  # expensive
    def execute(self, query: str, params: list):
        return self._conn.cursor().execute(query, params)`,
    },
    {
      id: 6,
      title: "Font Glyph Cache in PDF Engine",
      domain: "Document Rendering",
      description:
        "A PDF renderer draws the same 26 capital letters hundreds of times per page. Each glyph shape is expensive to compute but identical every time the same character appears.",
      whySingleton:
        "GlyphFlyweight caches the computed outline path for each character in each font. The draw() call takes x/y as extrinsic state, rendering the shared glyph at the specified position.",
      code: `class PDFGlyphFlyweight:
    def __init__(self, char: str, font: Font):
        self.path = font.compute_path(char)  # cached glyph outline
    def draw(self, canvas, x: float, y: float):
        canvas.draw_path(self.path, x, y)`,
    },
    {
      id: 7,
      title: "Map Tile Rendering",
      domain: "GIS / Maps",
      description:
        "A map view renders tiles. Many tiles share the same terrain type (ocean, forest, desert) with identical textures. Unique state is only the grid coordinate.",
      whySingleton:
        "TerrainFlyweight stores the texture bitmap. TileContext stores grid (row, col) and a reference to the shared terrain. Memory usage scales with terrain types, not map size.",
      code: `class TerrainFlyweight:
    def __init__(self, terrain_type: str):
        self.texture = load_texture(terrain_type)  # shared
    def render(self, row: int, col: int):
        draw_at(self.texture, row * TILE_SIZE, col * TILE_SIZE)`,
    },
    {
      id: 8,
      title: "String Interning",
      domain: "Language Runtimes",
      description:
        "In many programs, the same string values appear thousands of times (status codes, category names, enum-like strings). String interning ensures identical strings share one memory location.",
      whySingleton:
        "An intern pool maps string values to canonical instances. All code using the same string literal shares the same object — equality checks become pointer comparisons.",
      code: `class StringInterner:
    _pool: dict[str, str] = {}
    @classmethod
    def intern(cls, s: str) -> str:
        if s not in cls._pool:
            cls._pool[s] = s
        return cls._pool[s]`,
    },
    {
      id: 9,
      title: "CSS Class / Style Cache",
      domain: "Frontend Frameworks",
      description:
        "A CSS-in-JS framework generates class names for style objects. Many components share identical style objects (same color, padding, font). Without Flyweight, identical style objects multiply.",
      whySingleton:
        "StyleFlyweightFactory hashes style objects. Identical styles return the same generated class name without re-injecting CSS. Only unique styles create new DOM <style> entries.",
      code: `class StyleFlyweightFactory:
    _cache: dict = {}
    def get_class(self, style: dict) -> str:
        key = json.dumps(style, sort_keys=True)
        if key not in self._cache:
            self._cache[key] = inject_css(style)
        return self._cache[key]`,
    },
    {
      id: 10,
      title: "Network Packet Type Descriptors",
      domain: "Networking",
      description:
        "A packet processing pipeline handles millions of packets per second. Each packet type (HTTP, DNS, TCP) has shared metadata (protocol name, header structure, handler list) but unique payload.",
      whySingleton:
        "PacketTypeFlyweight holds immutable protocol metadata. PacketContext holds the raw payload and source IP. Processing throughput improves because metadata is not re-parsed per packet.",
      code: `class PacketTypeFlyweight:
    def __init__(self, protocol: str, header_def: list):
        self.protocol = protocol
        self.header_def = header_def  # shared, immutable
    def process(self, payload: bytes, src_ip: str):
        header = parse_header(self.header_def, payload)
        route_packet(header, payload, src_ip)`,
    },
    {
      id: 11,
      title: "Chess / Board Game Pieces",
      domain: "Games / Simulation",
      description:
        "A chess engine evaluates millions of positions. Each board position has 32 pieces. Piece type data (movement rules, value, unicode symbol) is shared; position is extrinsic.",
      whySingleton:
        "PieceFlyweight stores movement rules and value. Position (row, col) and color (white/black) are either stored in context or passed per query. Only 12 flyweights needed for all pieces.",
      code: `class PieceFlyweight:
    def __init__(self, piece_type: str):
        self.moves = load_moves(piece_type)  # shared
        self.value = PIECE_VALUES[piece_type]
    def valid_moves(self, row, col, board):
        return [m for m in self.moves if m.is_valid(row, col, board)]`,
    },
    {
      id: 12,
      title: "Log Level Descriptors",
      domain: "Observability",
      description:
        "A logging framework creates a log record for every log call. Each record stores the log level (DEBUG, INFO, WARN, ERROR) which has rich metadata (name, color, numeric value, severity handler).",
      whySingleton:
        "LogLevelFlyweight stores level metadata. Log records hold only a reference to the level flyweight plus the message and timestamp. With millions of log entries, this saves significant memory.",
      code: `class LogLevelFlyweight:
    def __init__(self, name: str, value: int, color: str):
        self.name, self.value, self.color = name, value, color

class LogRecord:
    def __init__(self, level: LogLevelFlyweight, msg: str, ts: float):
        self.level = level  # shared flyweight reference
        self.message = msg
        self.timestamp = ts`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Forest Tree Renderer",
      domain: "Games / Simulation",
      problem:
        "A game world simulation needs to render a forest with 500,000 trees. A naive implementation creates a Tree object per tree, storing species name, texture (8MB each), mesh data, and position. Total memory: ~4TB. The game crashes.",
      solution:
        "The Flyweight splits tree data: TreeSpecies (intrinsic) holds the texture and mesh — created once per species type. TreeContext (extrinsic) holds only x, y, z position and health. The TreeFactory ensures only one TreeSpecies per species name is ever created. The forest holds 500,000 TreeContext objects that reference just 3 shared TreeSpecies flyweights. Memory drops from TB to MB.",
      classDiagramSvg: `<svg viewBox="0 0 480 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:480px">
  <style>.s-box{rx:6;} .s-title{font:bold 10px 'JetBrains Mono',monospace;} .s-member{font:9px 'JetBrains Mono',monospace;} .s-arr{stroke-width:1.2;fill:none;marker-end:url(#fw-e1);}</style>
  <defs><marker id="fw-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="140" height="55" class="s-box s-diagram-box"/>
  <text x="80" y="28" text-anchor="middle" class="s-title s-diagram-title">TreeSpecies (Flyweight)</text>
  <line x1="10" y1="33" x2="150" y2="33" class="s-diagram-line"/>
  <text x="18" y="48" class="s-member s-diagram-member">name, texture, mesh</text>
  <text x="18" y="60" class="s-member s-diagram-member">+render(x,y,z)</text>
  <rect x="190" y="10" width="130" height="55" class="s-box s-diagram-box"/>
  <text x="255" y="28" text-anchor="middle" class="s-title s-diagram-title">TreeFactory</text>
  <line x1="190" y1="33" x2="320" y2="33" class="s-diagram-line"/>
  <text x="198" y="48" class="s-member s-diagram-member">-cache: dict</text>
  <text x="198" y="60" class="s-member s-diagram-member">+get(name)</text>
  <rect x="10" y="100" width="140" height="45" class="s-box s-diagram-box"/>
  <text x="80" y="118" text-anchor="middle" class="s-title s-diagram-title">TreeContext</text>
  <line x1="10" y1="123" x2="150" y2="123" class="s-diagram-line"/>
  <text x="18" y="138" class="s-member s-diagram-member">species, x, y, z, health</text>
  <rect x="360" y="40" width="110" height="30" class="s-box s-diagram-box"/>
  <text x="415" y="58" text-anchor="middle" class="s-title s-diagram-title">Forest (Client)</text>
  <line x1="190" y1="35" x2="150" y2="35" class="s-arr s-diagram-arrow"/>
  <line x1="150" y1="115" x2="190" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="360" y1="55" x2="320" y2="40" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `import random
from dataclasses import dataclass

# ── Flyweight: TreeSpecies ────────────────────────────────────────────────────
# Stores intrinsic (shared, immutable) state: texture and mesh geometry.
# Only 3-5 instances exist regardless of how many trees are planted.
@dataclass(frozen=True)  # frozen=True enforces immutability — required for flyweights
class TreeSpecies:
    name: str        # intrinsic: species identifier
    texture: bytes   # intrinsic: 8MB texture (shared across all trees of this species)
    mesh: bytes      # intrinsic: 3D mesh data

    def render(self, x: float, y: float, z: float, health: float) -> None:
        # extrinsic state (x, y, z, health) passed in per call — NOT stored here
        print(f"[{self.name}] at ({x:.1f},{y:.1f},{z:.1f}) health={health:.0%} "
              f"using {len(self.texture)//1024}KB texture")


# ── FlyweightFactory: TreeFactory ─────────────────────────────────────────────
# Ensures only ONE TreeSpecies instance per species name exists.
# Acts as the cache manager — clients never call TreeSpecies() directly.
class TreeFactory:
    _cache: dict[str, TreeSpecies] = {}  # the shared pool

    @classmethod
    def get_species(cls, name: str) -> TreeSpecies:
        # Cache hit: return the existing flyweight (the whole point!)
        if name not in cls._cache:
            # Cache miss: create once, store, reuse forever
            texture = _load_texture(name)   # expensive 8MB load
            mesh = _load_mesh(name)         # expensive geometry
            cls._cache[name] = TreeSpecies(name, texture, mesh)
            print(f"  [Factory] Created new TreeSpecies flyweight: {name}")
        return cls._cache[name]

    @classmethod
    def pool_size(cls) -> int:
        return len(cls._cache)  # should be tiny (3-5) even with millions of trees


def _load_texture(name: str) -> bytes:
    return b"x" * (8 * 1024)  # simulated 8KB texture per species


def _load_mesh(name: str) -> bytes:
    return b"m" * 1024  # simulated mesh data


# ── Extrinsic State: TreeContext ───────────────────────────────────────────────
# One instance per actual tree in the world.
# Stores ONLY what is unique to this specific tree — NOT textures or meshes.
@dataclass
class TreeContext:
    species: TreeSpecies  # reference to shared flyweight — NOT a copy!
    x: float              # extrinsic: world position
    y: float
    z: float
    health: float         # extrinsic: unique per-tree state

    def render(self) -> None:
        # Delegates rendering to the flyweight, passing extrinsic state as params
        self.species.render(self.x, self.y, self.z, self.health)


# ── Forest (Client) ───────────────────────────────────────────────────────────
# Client manages the collection of TreeContext objects.
# It asks the factory for flyweights — never constructs TreeSpecies directly.
class Forest:
    def __init__(self):
        self._trees: list[TreeContext] = []  # list of contexts (lightweight)

    def plant(self, species_name: str, x: float, y: float) -> None:
        # Get shared flyweight from factory — NOT a new full object
        species = TreeFactory.get_species(species_name)
        # Only allocate the thin context with unique extrinsic state
        self._trees.append(TreeContext(species, x, y, 0.0, random.uniform(0.5, 1.0)))

    def render_all(self) -> None:
        print(f"\nRendering {len(self._trees)} trees "
              f"({TreeFactory.pool_size()} species in flyweight pool):")
        for tree in self._trees:
            tree.render()


# ── Demo ──────────────────────────────────────────────────────────────────────
forest = Forest()

# Plant 10 trees of 3 species — only 3 TreeSpecies flyweights are created
for _ in range(4):
    forest.plant("Oak", random.uniform(0, 100), random.uniform(0, 100))
for _ in range(3):
    forest.plant("Pine", random.uniform(0, 100), random.uniform(0, 100))
for _ in range(3):
    forest.plant("Birch", random.uniform(0, 100), random.uniform(0, 100))

forest.render_all()
# Flyweight pool size: 3 (not 10)
# Memory: 3 × 9KB (shared) + 10 × ~64 bytes (contexts) ≈ 27KB total
# Without Flyweight: 10 × 9KB = 90KB (scales to 500K × 9KB = 4.5GB in real game)`,

        Go: `package main

import (
	"fmt"
	"math/rand"
	"strings"
)

// ── Flyweight: TreeSpecies ────────────────────────────────────────────────────
// Holds intrinsic (shared, immutable) state.
// One instance per species — shared by all tree contexts of that species.
type TreeSpecies struct {
	Name    string // intrinsic: species name
	Texture []byte // intrinsic: heavy texture data (shared)
	Mesh    []byte // intrinsic: geometry data (shared)
}

func (ts *TreeSpecies) Render(x, y, z, health float64) {
	// extrinsic state is passed in — NOT stored inside TreeSpecies
	fmt.Printf("[%s] at (%.1f,%.1f,%.1f) health=%.0f%% [%dKB texture]\\n",
		ts.Name, x, y, z, health*100, len(ts.Texture)/1024)
}

// ── FlyweightFactory: TreeFactory ────────────────────────────────────────────
// Manages the pool of shared TreeSpecies instances.
type TreeFactory struct {
	cache map[string]*TreeSpecies // the shared pool
}

func NewTreeFactory() *TreeFactory {
	return &TreeFactory{cache: make(map[string]*TreeSpecies)}
}

func (f *TreeFactory) GetSpecies(name string) *TreeSpecies {
	if _, exists := f.cache[name]; !exists {
		// Cache miss: create once, reuse forever
		fmt.Printf("  [Factory] Creating flyweight for species: %s\\n", name)
		f.cache[name] = &TreeSpecies{
			Name:    name,
			Texture: []byte(strings.Repeat("t", 8*1024)), // simulated 8KB texture
			Mesh:    []byte(strings.Repeat("m", 1024)),
		}
	}
	return f.cache[name] // cache hit: return existing flyweight
}

func (f *TreeFactory) PoolSize() int { return len(f.cache) }

// ── Extrinsic State: TreeContext ──────────────────────────────────────────────
// One instance per tree — holds only unique-per-tree data.
type TreeContext struct {
	Species *TreeSpecies // pointer to shared flyweight (not a copy!)
	X, Y, Z float64      // extrinsic: world coordinates
	Health  float64      // extrinsic: per-tree health value
}

func (tc *TreeContext) Render() {
	// Pass extrinsic state to flyweight — flyweight is stateless during this call
	tc.Species.Render(tc.X, tc.Y, tc.Z, tc.Health)
}

// ── Forest (Client) ───────────────────────────────────────────────────────────
type Forest struct {
	trees   []*TreeContext
	factory *TreeFactory
}

func NewForest() *Forest {
	return &Forest{factory: NewTreeFactory()}
}

func (f *Forest) Plant(speciesName string, x, y float64) {
	species := f.factory.GetSpecies(speciesName) // get/create flyweight
	ctx := &TreeContext{
		Species: species, // shared reference
		X: x, Y: y, Z: 0,
		Health: rand.Float64()*0.5 + 0.5,
	}
	f.trees = append(f.trees, ctx)
}

func (f *Forest) RenderAll() {
	fmt.Printf("\\nRendering %d trees (%d flyweights in pool):\\n",
		len(f.trees), f.factory.PoolSize())
	for _, t := range f.trees {
		t.Render()
	}
}

func main() {
	forest := NewForest()

	for i := 0; i < 4; i++ { forest.Plant("Oak", rand.Float64()*100, rand.Float64()*100) }
	for i := 0; i < 3; i++ { forest.Plant("Pine", rand.Float64()*100, rand.Float64()*100) }
	for i := 0; i < 3; i++ { forest.Plant("Birch", rand.Float64()*100, rand.Float64()*100) }

	forest.RenderAll()
	// 10 trees → 3 flyweights in pool
}`,

        Java: `import java.util.*;

// ── Flyweight: TreeSpecies ────────────────────────────────────────────────────
// Immutable intrinsic state — shared across all trees of the same species.
final class TreeSpecies {
    private final String name;      // intrinsic: species name
    private final byte[] texture;   // intrinsic: heavy texture (shared!)
    private final byte[] mesh;      // intrinsic: geometry data

    // Package-private: only TreeFactory creates instances
    TreeSpecies(String name) {
        this.name = name;
        this.texture = new byte[8 * 1024]; // simulated 8KB texture
        Arrays.fill(this.texture, (byte)'t');
        this.mesh = new byte[1024];
    }

    // extrinsic state (x, y, z, health) always passed in — never stored here
    void render(double x, double y, double z, double health) {
        System.out.printf("[%s] at (%.1f,%.1f,%.1f) health=%.0f%% [%dKB texture]%n",
                name, x, y, z, health * 100, texture.length / 1024);
    }
}

// ── FlyweightFactory: TreeFactory ─────────────────────────────────────────────
// The factory is the single point of truth for all flyweight instances.
class TreeFactory {
    private final Map<String, TreeSpecies> cache = new HashMap<>();

    TreeSpecies getSpecies(String name) {
        // computeIfAbsent: create once, cache forever
        return cache.computeIfAbsent(name, k -> {
            System.out.println("  [Factory] Creating flyweight: " + name);
            return new TreeSpecies(name);
        });
    }

    int poolSize() { return cache.size(); }
}

// ── Extrinsic State: TreeContext ──────────────────────────────────────────────
// One instance per actual tree — holds only the unique per-tree data.
class TreeContext {
    private final TreeSpecies species; // reference to shared flyweight
    private final double x, y, z;     // extrinsic: position
    private final double health;       // extrinsic: per-tree health

    TreeContext(TreeSpecies species, double x, double y, double z, double health) {
        this.species = species;
        this.x = x; this.y = y; this.z = z;
        this.health = health;
    }

    void render() {
        // Delegate to flyweight with extrinsic state as parameters
        species.render(x, y, z, health);
    }
}

// ── Forest (Client) ───────────────────────────────────────────────────────────
class Forest {
    private final List<TreeContext> trees = new ArrayList<>();
    private final TreeFactory factory = new TreeFactory();
    private final Random rng = new Random();

    void plant(String speciesName, double x, double y) {
        TreeSpecies species = factory.getSpecies(speciesName); // shared flyweight
        trees.add(new TreeContext(species, x, y, 0, rng.nextDouble() * 0.5 + 0.5));
    }

    void renderAll() {
        System.out.printf("%nRendering %d trees (%d flyweights in pool):%n",
                trees.size(), factory.poolSize());
        trees.forEach(TreeContext::render);
    }
}

class FlyweightForestDemo {
    public static void main(String[] args) {
        Forest forest = new Forest();
        Random rng = new Random();

        for (int i = 0; i < 4; i++) forest.plant("Oak", rng.nextDouble() * 100, rng.nextDouble() * 100);
        for (int i = 0; i < 3; i++) forest.plant("Pine", rng.nextDouble() * 100, rng.nextDouble() * 100);
        for (int i = 0; i < 3; i++) forest.plant("Birch", rng.nextDouble() * 100, rng.nextDouble() * 100);

        forest.renderAll();
        // Pool size: 3. Total tree objects: 10 (each only ~40 bytes + a pointer)
    }
}`,

        TypeScript: `// ── Flyweight: TreeSpecies ────────────────────────────────────────────────────
// Holds only intrinsic (shared, immutable) state.
// This class is shared by thousands of tree contexts — must be immutable.
class TreeSpecies {
  readonly texture: Uint8Array;  // intrinsic: heavy texture (shared)
  readonly mesh: Uint8Array;     // intrinsic: geometry (shared)

  constructor(readonly name: string) {
    // Simulate loading heavy data once
    this.texture = new Uint8Array(8 * 1024).fill(116); // 8KB texture
    this.mesh = new Uint8Array(1024).fill(109);
  }

  // extrinsic state always comes in as parameters — never stored here
  render(x: number, y: number, z: number, health: number) {
    console.log(\`[\${this.name}] at (\${x.toFixed(1)},\${y.toFixed(1)},\${z.toFixed(1)}) \` +
      \`health=\${(health * 100).toFixed(0)}% [\${this.texture.length / 1024}KB texture]\`);
  }
}

// ── FlyweightFactory: TreeFactory ─────────────────────────────────────────────
// Manages the shared pool of TreeSpecies instances.
// Never allows two instances with the same species name to exist.
class TreeFactory {
  private cache = new Map<string, TreeSpecies>(); // the flyweight pool

  getSpecies(name: string): TreeSpecies {
    if (!this.cache.has(name)) {
      // First time: create and cache the flyweight
      console.log(\`  [Factory] Creating flyweight: \${name}\`);
      this.cache.set(name, new TreeSpecies(name));
    }
    return this.cache.get(name)!; // subsequent calls return cached instance
  }

  get poolSize() { return this.cache.size; }
}

// ── Extrinsic State: TreeContext ──────────────────────────────────────────────
// One per actual tree. Stores only what is unique to this tree instance.
class TreeContext {
  constructor(
    private species: TreeSpecies, // shared reference — not a copy!
    private x: number,
    private y: number,
    private z: number,
    private health: number,
  ) {}

  render() {
    // Pass extrinsic state to flyweight — flyweight does the heavy lifting
    this.species.render(this.x, this.y, this.z, this.health);
  }
}

// ── Forest (Client) ───────────────────────────────────────────────────────────
class Forest {
  private trees: TreeContext[] = [];
  private factory = new TreeFactory();

  plant(speciesName: string, x: number, y: number) {
    const species = this.factory.getSpecies(speciesName); // get shared flyweight
    this.trees.push(new TreeContext(species, x, y, 0, Math.random() * 0.5 + 0.5));
  }

  renderAll() {
    console.log(\`\\nRendering \${this.trees.length} trees (\${this.factory.poolSize} flyweights):\`);
    this.trees.forEach(t => t.render());
  }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
const forest = new Forest();
for (let i = 0; i < 4; i++) forest.plant("Oak", Math.random() * 100, Math.random() * 100);
for (let i = 0; i < 3; i++) forest.plant("Pine", Math.random() * 100, Math.random() * 100);
for (let i = 0; i < 3; i++) forest.plant("Birch", Math.random() * 100, Math.random() * 100);
forest.renderAll();
// 10 trees → 3 flyweights  ← the core achievement`,

        Rust: `use std::collections::HashMap;

// ── Flyweight: TreeSpecies ────────────────────────────────────────────────────
// Immutable intrinsic state — shared via Arc<> in real Rust code.
// Here simplified for clarity with a direct reference.
struct TreeSpecies {
    name: String,         // intrinsic
    texture: Vec<u8>,     // intrinsic: heavy texture (shared)
    mesh: Vec<u8>,        // intrinsic: geometry (shared)
}

impl TreeSpecies {
    fn new(name: &str) -> Self {
        println!("  [Factory] Creating flyweight: {}", name);
        Self {
            name: name.to_string(),
            texture: vec![b't'; 8 * 1024], // simulated 8KB
            mesh: vec![b'm'; 1024],
        }
    }

    // extrinsic state passed in — NOT stored in the flyweight
    fn render(&self, x: f64, y: f64, health: f64) {
        println!("[{}] at ({:.1},{:.1}) health={:.0}% [{}KB texture]",
                 self.name, x, y, health * 100.0, self.texture.len() / 1024);
    }
}

// ── FlyweightFactory: TreeFactory ────────────────────────────────────────────
// Owns the shared pool of TreeSpecies instances.
struct TreeFactory {
    cache: HashMap<String, TreeSpecies>, // the flyweight pool
}

impl TreeFactory {
    fn new() -> Self { Self { cache: HashMap::new() } }

    fn get_species(&mut self, name: &str) -> &TreeSpecies {
        // entry API: create if absent, return reference either way
        self.cache.entry(name.to_string())
            .or_insert_with(|| TreeSpecies::new(name))
    }

    fn pool_size(&self) -> usize { self.cache.len() }
}

// ── TreeContext: extrinsic state ──────────────────────────────────────────────
// One per actual tree — stores only the unique per-tree fields.
struct TreeContext<'a> {
    species: &'a TreeSpecies, // reference to shared flyweight (not a clone!)
    x: f64,
    y: f64,
    health: f64,
}

impl<'a> TreeContext<'a> {
    fn render(&self) {
        self.species.render(self.x, self.y, self.health);
    }
}

fn main() {
    let mut factory = TreeFactory::new();
    
    // Pre-warm the cache with 3 species
    for name in &["Oak", "Pine", "Birch"] {
        factory.get_species(name);
    }

    // Build tree contexts — each holds a reference to a shared flyweight
    let positions = vec![
        ("Oak", 10.0, 20.0, 0.9), ("Oak", 55.0, 30.0, 0.7),
        ("Pine", 80.0, 15.0, 1.0), ("Birch", 40.0, 60.0, 0.8),
    ];

    let trees: Vec<TreeContext> = positions.iter().map(|(name, x, y, h)| {
        TreeContext { species: factory.get_species(name), x: *x, y: *y, health: *h }
    }).collect();

    println!("\\nRendering {} trees ({} flyweights in pool):", trees.len(), factory.pool_size());
    for t in &trees { t.render(); }
}`,
      },
      considerations: [
        "Flyweight objects MUST be immutable — any mutation would corrupt all sharing contexts",
        "The factory is the only place where flyweights are created — enforce this with access control",
        "Thread safety: the factory cache needs a mutex or lock in multithreaded environments",
        "Profile memory first — Flyweight adds complexity; only apply when memory is genuinely the bottleneck",
        "Extrinsic state collection (passing it in every call) may increase CPU complexity",
      ],
    },
  ],

  variantsTabLabel: "Cache Strategies",
  variantsBestPick:
    "HashMap Cache is the standard approach. Use Weak Reference Cache only when flyweights should be GC'd when unused, to avoid memory leaks in long-lived applications.",

  variants: [
    {
      id: 1,
      name: "HashMap (Dictionary) Cache",
      description:
        "The most common Flyweight factory implementation. A dictionary indexed by intrinsic key ensures O(1) lookup and creation. Simple and effective for most cases.",
      code: {
        Python: `class FlyweightFactory:
    def __init__(self):
        self._cache: dict[str, Flyweight] = {}

    def get(self, key: str) -> Flyweight:
        # O(1) lookup — key is the intrinsic state descriptor
        if key not in self._cache:
            self._cache[key] = Flyweight(key)
        return self._cache[key]

    def pool_stats(self) -> dict:
        return {"cached": len(self._cache), "keys": list(self._cache)}`,
        Go: `type FlyweightFactory struct {
    cache map[string]*Flyweight
    mu    sync.RWMutex // thread-safe cache
}

func (f *FlyweightFactory) Get(key string) *Flyweight {
    f.mu.RLock()
    fw, ok := f.cache[key]
    f.mu.RUnlock()
    if ok { return fw }

    f.mu.Lock()
    defer f.mu.Unlock()
    // Double-check after acquiring write lock
    if fw, ok := f.cache[key]; ok { return fw }
    fw = &Flyweight{key: key}
    f.cache[key] = fw
    return fw
}`,
        Java: `class FlyweightFactory {
    private final Map<String, Flyweight> cache
        = new ConcurrentHashMap<>();

    Flyweight get(String key) {
        // computeIfAbsent is atomic — thread-safe creation
        return cache.computeIfAbsent(key, Flyweight::new);
    }
}`,
        TypeScript: `class FlyweightFactory {
  private cache = new Map<string, Flyweight>();

  get(key: string): Flyweight {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Flyweight(key));
    }
    return this.cache.get(key)!;
  }
}`,
        Rust: `struct FlyweightFactory {
    cache: HashMap<String, Arc<Flyweight>>,
}
impl FlyweightFactory {
    fn get(&mut self, key: &str) -> Arc<Flyweight> {
        Arc::clone(self.cache.entry(key.to_string())
            .or_insert_with(|| Arc::new(Flyweight::new(key))))
    }
}`,
      },
      pros: ["O(1) average-case lookup", "Simple to implement", "Flyweights live as long as the factory"],
      cons: ["Flyweights are never GC'd while factory lives (potential memory leak for large pools)"],
    },
    {
      id: 2,
      name: "Composite Key Flyweight",
      description:
        "When intrinsic state has multiple fields (e.g., color + font + size), use a composite key. Ensures flyweights are uniquely identified by all their intrinsic properties.",
      code: {
        Python: `from dataclasses import dataclass

@dataclass(frozen=True)
class GlyphKey:
    char: str
    font: str
    size: int
    bold: bool

class GlyphFlyweightFactory:
    def __init__(self):
        self._cache: dict[GlyphKey, Glyph] = {}

    def get(self, char: str, font: str, size: int, bold: bool) -> Glyph:
        # Composite key ensures (char='A', font='Arial', size=12, bold=True)
        # is a different flyweight from (char='A', font='Arial', size=14, bold=True)
        key = GlyphKey(char, font, size, bold)
        if key not in self._cache:
            self._cache[key] = Glyph(char, font, size, bold)
        return self._cache[key]`,
        Go: `type GlyphKey struct {
    Char string; Font string; Size int; Bold bool
}

type GlyphFactory struct { cache map[GlyphKey]*Glyph }

func (f *GlyphFactory) Get(char, font string, size int, bold bool) *Glyph {
    key := GlyphKey{char, font, size, bold}
    if g, ok := f.cache[key]; ok { return g }
    f.cache[key] = &Glyph{Char: char, Font: font, Size: size, Bold: bold}
    return f.cache[key]
}`,
        Java: `record GlyphKey(String ch, String font, int size, boolean bold) {}

class GlyphFactory {
    private final Map<GlyphKey, Glyph> cache = new HashMap<>();

    Glyph get(String ch, String font, int size, boolean bold) {
        var key = new GlyphKey(ch, font, size, bold);
        return cache.computeIfAbsent(key, k ->
            new Glyph(k.ch(), k.font(), k.size(), k.bold()));
    }
}`,
        TypeScript: `type GlyphKey = \`\${string}:\${string}:\${number}:\${boolean}\`;

class GlyphFactory {
  private cache = new Map<GlyphKey, Glyph>();

  get(char: string, font: string, size: number, bold: boolean): Glyph {
    const key: GlyphKey = \`\${char}:\${font}:\${size}:\${bold}\`;
    if (!this.cache.has(key)) this.cache.set(key, new Glyph(char, font, size, bold));
    return this.cache.get(key)!;
  }
}`,
        Rust: `#[derive(Hash, Eq, PartialEq)]
struct GlyphKey { char: char, font: String, size: u32, bold: bool }

struct GlyphFactory { cache: HashMap<GlyphKey, Arc<Glyph>> }
impl GlyphFactory {
    fn get(&mut self, c: char, font: &str, size: u32, bold: bool) -> Arc<Glyph> {
        let key = GlyphKey { char: c, font: font.into(), size, bold };
        Arc::clone(self.cache.entry(key).or_insert_with(|| Arc::new(Glyph::new(c, font, size, bold))))
    }
}`,
      },
      pros: ["Exact intrinsic state matching", "No accidental sharing of different-parameter instances"],
      cons: ["Key construction overhead", "Key struct must implement Hash + Eq"],
    },
  ],

  summary: [
    { aspect: "Category", detail: "Structural" },
    { aspect: "Intent", detail: "Use sharing to support large numbers of fine-grained objects by separating intrinsic (shared) from extrinsic (unique) state" },
    { aspect: "Also Known As", detail: "Object Pool (partial similarity), String Interning (specific application)" },
    { aspect: "Core Insight", detail: "Intrinsic state is shared (immutable); extrinsic state is passed in per operation call" },
    { aspect: "Key Mechanism", detail: "FlyweightFactory maintains a pool — returns cached flyweights keyed by intrinsic state" },
    { aspect: "Memory Reduction", detail: "N instances with shared types → N × (extrinsic only) + num_types × (intrinsic). Massive savings when num_types << N" },
    { aspect: "Constraint", detail: "Flyweight objects must be immutable — mutation would corrupt all sharing contexts" },
    { aspect: "Trade-off", detail: "Saves memory at the cost of runtime complexity: extrinsic state must be computed and passed per call" },
    { aspect: "When to Use", detail: "When thousands+ of objects share most data, memory is the bottleneck, and objects can be clearly split into intrinsic/extrinsic state" },
    { aspect: "Common Pairings", detail: "Composite (tree structures of flyweights), Factory Method (FlyweightFactory), State pattern (when flyweight represents state)" },
  ],

  antiPatterns: [
    {
      name: "Mutable Flyweight",
      description:
        "Storing extrinsic state inside the Flyweight object. Since thousands of contexts share the same flyweight, any mutation affects all of them simultaneously — causing unpredictable, race-condition-like bugs.",
      betterAlternative:
        "Make flyweights immutable (frozen dataclasses, final fields, const structs). Extrinsic state must always be passed as parameters to operation methods, never stored.",
    },
    {
      name: "Overusing Flyweight",
      description:
        "Applying Flyweight to objects that are not actually duplicated or whose data is already extrinsic. This adds complexity (factory, state split) without memory benefit.",
      betterAlternative:
        "Profile first. Flyweight is justified when N (instances) >> unique types AND intrinsic data is significantly larger than extrinsic data per instance.",
    },
    {
      name: "Missing Factory Enforcement",
      description:
        "Allowing clients to create flyweights directly (new TreeSpecies() or TreeSpecies()) bypasses the cache. Multiple identical flyweights are created, defeating the purpose.",
      betterAlternative:
        "Make the Flyweight constructor private or package-private. Only the FlyweightFactory should instantiate flyweights. In Python, use a class method factory; in Java, use package access.",
    },
  ],
};

export default flyweightData;
