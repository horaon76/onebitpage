import { PatternData } from "@/lib/patterns/types";

const facadeData: PatternData = {
  slug: "facade",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Facade Pattern",
  subtitle:
    "Provide a unified, simplified interface to a complex subsystem of classes, hiding orchestration details from the client.",

  intent:
    "Complex subsystems often require coordinating multiple objects in specific sequences — validating, processing, notifying. The Facade pattern simplifies this by offering a high-level method that coordinates the subsystem internally. Clients interact with one clean API instead of managing multiple dependencies and call sequences themselves. Unlike Adapter (which changes an interface) or Proxy (which controls access), Facade's purpose is purely to simplify.",

  classDiagramSvg: `<svg viewBox="0 0 520 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fc-arr); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="fc-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Client -->
  <rect x="10" y="10" width="120" height="42" class="s-box s-diagram-box"/>
  <text x="70" y="28" text-anchor="middle" class="s-title s-diagram-title">Client</text>
  <line x1="10" y1="32" x2="130" y2="32" class="s-diagram-line"/>
  <text x="20" y="46" class="s-member s-diagram-member">+doWork(): void</text>
  <!-- Facade -->
  <rect x="180" y="10" width="220" height="75" class="s-box s-diagram-box"/>
  <text x="290" y="28" text-anchor="middle" class="s-title s-diagram-title">Facade</text>
  <line x1="180" y1="33" x2="400" y2="33" class="s-diagram-line"/>
  <text x="190" y="48" class="s-member s-diagram-member">-subsystemA: SubsystemA</text>
  <text x="190" y="62" class="s-member s-diagram-member">-subsystemB: SubsystemB</text>
  <text x="190" y="76" class="s-member s-diagram-member">+simpleOperation(): Result</text>
  <!-- SubsystemA -->
  <rect x="60" y="140" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="140" y="158" text-anchor="middle" class="s-title s-diagram-title">SubsystemA</text>
  <line x1="60" y1="162" x2="220" y2="162" class="s-diagram-line"/>
  <text x="70" y="178" class="s-member s-diagram-member">+operationA(): void</text>
  <!-- SubsystemB -->
  <rect x="260" y="140" width="160" height="50" class="s-box s-diagram-box"/>
  <text x="340" y="158" text-anchor="middle" class="s-title s-diagram-title">SubsystemB</text>
  <line x1="260" y1="162" x2="420" y2="162" class="s-diagram-line"/>
  <text x="270" y="178" class="s-member s-diagram-member">+operationB(): void</text>
  <!-- SubsystemC -->
  <rect x="160" y="220" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="260" y="238" text-anchor="middle" class="s-title s-diagram-title">SubsystemC</text>
  <line x1="160" y1="242" x2="360" y2="242" class="s-diagram-line"/>
  <text x="170" y="258" class="s-member s-diagram-member">+operationC(): void</text>
  <!-- Arrows -->
  <line x1="130" y1="30" x2="180" y2="30" class="s-arr s-diagram-arrow"/>
  <line x1="240" y1="85" x2="160" y2="140" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="340" y1="85" x2="340" y2="140" class="s-arr s-diagram-arrow s-dash"/>
  <line x1="290" y1="85" x2="270" y2="220" class="s-arr s-diagram-arrow s-dash"/>
</svg>`,

  diagramExplanation:
    "The Client depends only on the Facade, which exposes a single simpleOperation() method. Internally the Facade orchestrates SubsystemA, SubsystemB, and SubsystemC in the correct order. Clients never interact with the subsystems directly. The subsystems remain accessible for advanced use cases, but the Facade provides the 80% path.",

  diagramComponents: [
    {
      name: "Client",
      description:
        "The consumer that needs subsystem functionality but shouldn't manage the complexity of coordinating multiple subsystem classes. It calls only the Facade.",
    },
    {
      name: "Facade",
      description:
        "A high-level class that holds references to subsystem objects and exposes simplified methods. It orchestrates calls to subsystems in the correct order, handling error propagation and result aggregation.",
    },
    {
      name: "SubsystemA / SubsystemB / SubsystemC",
      description:
        "The individual classes that contain the real business logic. Each is independently functional but requires specific call ordering and parameter passing to work together. The Facade hides this complexity.",
    },
  ],

  solutionDetail:
    "**The Problem:** A complex operation requires calling multiple classes in a specific sequence — validate input with service A, process with service B, persist with service C, and notify with service D. Every client that needs this operation must duplicate the orchestration logic, leading to inconsistency and bugs when the sequence changes.\n\n**The Facade Solution:** Create a single class that encapsulates the multi-step orchestration. The Facade holds references to all required subsystem objects and exposes one (or a few) high-level methods that coordinate them.\n\n**How It Works:**\n\n1. **Identify the subsystem boundary**: Determine which group of classes forms a logical subsystem that clients frequently use together.\n\n2. **Design the simplified interface**: Define what operations clients actually need — often just 2-3 methods that cover the common use cases.\n\n3. **Implement coordination**: The Facade method calls subsystem objects in the correct order, handles errors at each step, and assembles the final result.\n\n4. **Keep subsystems accessible**: The Facade doesn't hide subsystems — advanced clients can still use them directly. It's a convenience layer, not a restriction.\n\n**Key Insight:** Facade differs from Adapter because it creates a new, simpler interface rather than translating between existing ones. It differs from Mediator because it provides one-directional simplification (client → subsystem) rather than managing bidirectional communication between peers.",

  characteristics: [
    "Provides a simple interface to a complex subsystem without restricting direct access",
    "Reduces coupling between clients and subsystem internals",
    "Coordinates multi-step operations into a single call",
    "Often serves as the entry point for a module, library, or service layer",
    "Does not add new functionality — only simplifies access to existing functionality",
    "Multiple facades can exist for different client needs on the same subsystem",
    "Commonly used in layered architectures as the service layer between controllers and domain logic",
  ],

  useCases: [
    {
      id: 1,
      title: "Payment Processing Pipeline",
      domain: "Fintech",
      description:
        "Processing a payment requires authentication, fraud checks, gateway calls, and notification dispatch. Each step is a separate service with its own API.",
      whySingleton:
        "A PaymentFacade reduces 5 sequential service calls into one processPayment() method, ensuring consistent ordering and error handling.",
      code: `class PaymentFacade {
  processPayment(order: Order): Receipt {
    this.auth.verify(order.merchant);
    this.fraud.check(order.amount, order.card);
    const txn = this.gateway.charge(order);
    this.notifier.send(order.customer, txn);
    return new Receipt(txn);
  }
}`,
    },
    {
      id: 2,
      title: "Patient Admission Workflow",
      domain: "Healthcare",
      description:
        "Admitting a patient requires insurance verification, bed assignment, EMR record creation, and pharmacy notification — all coordinated in sequence.",
      whySingleton:
        "An AdmissionFacade encapsulates the multi-system coordination so nurses interact with one form, not four separate systems.",
      code: `class AdmissionFacade {
  admit(patient: Patient, dept: string): Admission {
    this.insurance.verify(patient.policyId);
    const bed = this.bedMgr.assign(dept);
    const record = this.emr.create(patient, bed);
    this.pharmacy.notify(record.id);
    return new Admission(record, bed);
  }
}`,
    },
    {
      id: 3,
      title: "Order Fulfillment Engine",
      domain: "E-Commerce",
      description:
        "Fulfilling an order involves inventory reservation, payment capture, warehouse picking, shipping label generation, and customer notification.",
      whySingleton:
        "A FulfillmentFacade wraps the 5-step pipeline into fulfillOrder(), preventing inconsistencies when new steps are added.",
      code: `class FulfillmentFacade {
  fulfillOrder(order: Order): Shipment {
    this.inventory.reserve(order.items);
    this.payment.capture(order.paymentId);
    const pick = this.warehouse.createPick(order);
    const label = this.shipping.generateLabel(pick);
    this.notify.orderShipped(order.customer, label);
    return new Shipment(label);
  }
}`,
    },
    {
      id: 4,
      title: "CI/CD Deployment Pipeline",
      domain: "DevOps",
      description:
        "Deploying a service requires building, testing, security scanning, container registry push, Kubernetes rollout, and health check verification.",
      whySingleton:
        "A DeployFacade orchestrates the multi-tool pipeline (Docker, K8s, Trivy, Jest) behind a single deploy() call with rollback on failure.",
      code: `class DeployFacade {
  deploy(service: string, version: string): Result {
    this.builder.build(service);
    this.scanner.checkVulns(service);
    this.registry.push(service, version);
    this.k8s.rollout(service, version);
    return this.health.verify(service);
  }
}`,
    },
    {
      id: 5,
      title: "Video Transcoding Pipeline",
      domain: "Media Streaming",
      description:
        "Transcoding a video requires probe analysis, codec selection, actual transcoding, thumbnail generation, and CDN upload — each a separate library.",
      whySingleton:
        "A TranscodeFacade hides FFmpeg, ImageMagick, and S3 interactions behind transcode(), making it a single call for the upload service.",
      code: `class TranscodeFacade {
  transcode(input: VideoFile): TranscodeResult {
    const meta = this.probe.analyze(input);
    const codec = this.selector.pick(meta);
    const output = this.encoder.encode(input, codec);
    const thumb = this.thumbGen.generate(output);
    this.cdn.upload(output, thumb);
    return new TranscodeResult(output.url);
  }
}`,
    },
    {
      id: 6,
      title: "Game World Initialization",
      domain: "Gaming",
      description:
        "Loading a game level requires terrain generation, asset loading, physics engine init, AI spawning, and audio setup — each with specific ordering.",
      whySingleton:
        "A LevelFacade provides loadLevel() that coordinates all subsystems in the correct order, hiding engine complexity from the game logic.",
      code: `class LevelFacade {
  loadLevel(id: string): Level {
    const terrain = this.terrainGen.create(id);
    this.assets.preload(terrain.requiredAssets);
    this.physics.init(terrain.collisionMesh);
    this.ai.spawnEntities(terrain.spawnPoints);
    this.audio.loadAmbient(terrain.audioProfile);
    return new Level(terrain);
  }
}`,
    },
    {
      id: 7,
      title: "Smart Home Device Setup",
      domain: "IoT",
      description:
        "Setting up a smart device requires Wi-Fi pairing, cloud registration, firmware update, room assignment, and scene integration.",
      whySingleton:
        "A DeviceSetupFacade wraps the 5-step onboarding flow into a single setup() method for the mobile app to call.",
      code: `class DeviceSetupFacade {
  setup(device: Device, home: Home): void {
    this.wifi.pair(device);
    this.cloud.register(device, home.id);
    this.firmware.update(device);
    this.rooms.assign(device, home.defaultRoom);
    this.scenes.integrate(device);
  }
}`,
    },
    {
      id: 8,
      title: "SaaS Tenant Provisioning",
      domain: "SaaS",
      description:
        "Onboarding a new tenant requires database creation, schema migration, seed data, DNS setup, SSL cert, and welcome email.",
      whySingleton:
        "A TenantFacade coordinates provisioning across infrastructure and application layers with a single provisionTenant() call.",
      code: `class TenantFacade {
  provision(tenant: Tenant): Environment {
    const db = this.dbMgr.create(tenant.slug);
    this.migrator.run(db);
    this.seeder.loadDefaults(db);
    this.dns.createSubdomain(tenant.slug);
    this.ssl.issueCert(tenant.domain);
    this.mailer.sendWelcome(tenant.admin);
    return new Environment(db, tenant.domain);
  }
}`,
    },
    {
      id: 9,
      title: "Shipment Tracking Aggregation",
      domain: "Logistics",
      description:
        "Tracking a shipment across carriers requires querying FedEx, DHL, and UPS APIs, normalizing responses, and computing estimated delivery.",
      whySingleton:
        "A TrackingFacade queries all carriers and returns a unified TrackingStatus, hiding the complexity of multi-carrier integration.",
      code: `class TrackingFacade {
  track(trackingId: string): TrackingStatus {
    const carrier = this.resolver.identify(trackingId);
    const raw = this.carriers[carrier].query(trackingId);
    const normalized = this.normalizer.convert(raw);
    normalized.eta = this.etaCalc.estimate(normalized);
    return normalized;
  }
}`,
    },
    {
      id: 10,
      title: "Insurance Claim Submission",
      domain: "Insurance",
      description:
        "Filing a claim requires document upload, policy verification, damage assessment scheduling, adjuster assignment, and initial reserve calculation.",
      whySingleton:
        "A ClaimFacade handles the multi-department workflow in one submitClaim() call, ensuring no step is missed or misordered.",
      code: `class ClaimFacade {
  submitClaim(claim: Claim): ClaimRef {
    this.docs.upload(claim.evidence);
    this.policy.verify(claim.policyId);
    this.assessment.schedule(claim);
    const adjuster = this.adjusterPool.assign(claim);
    this.reserve.calculate(claim, adjuster);
    return new ClaimRef(claim.id, adjuster);
  }
}`,
    },
    {
      id: 11,
      title: "5G Network Slice Setup",
      domain: "Telecom",
      description:
        "Provisioning a 5G network slice requires resource allocation, QoS policy config, security setup, monitoring, and SLA binding.",
      whySingleton:
        "A SliceFacade orchestrates the multi-vendor provisioning stack behind a single createSlice() API for the self-service portal.",
      code: `class SliceFacade {
  createSlice(spec: SliceSpec): NetworkSlice {
    const resources = this.allocator.reserve(spec);
    this.qos.configure(resources, spec.sla);
    this.security.setupEncryption(resources);
    this.monitor.attach(resources);
    return new NetworkSlice(resources, spec.sla);
  }
}`,
    },
    {
      id: 12,
      title: "Course Enrollment System",
      domain: "Education",
      description:
        "Enrolling a student requires prerequisite check, seat availability, payment processing, LMS account creation, and schedule update.",
      whySingleton:
        "An EnrollmentFacade coordinates academic and financial systems into one enroll() method for the student portal.",
      code: `class EnrollmentFacade {
  enroll(student: Student, course: Course): Enrollment {
    this.prereqs.validate(student, course);
    this.seats.reserve(course);
    this.billing.charge(student, course.fee);
    this.lms.createAccess(student, course);
    this.scheduler.update(student, course.schedule);
    return new Enrollment(student, course);
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Payment Processing Facade",
      domain: "Fintech",
      problem:
        "Processing a payment requires coordinating authentication, fraud detection, payment gateway invocation, and notification dispatch. Every checkout flow must replicate this 4-step sequence, and if the order changes (e.g., fraud check before auth), every caller must be updated.",
      solution:
        "A PaymentFacade exposes a single processPayment() method that orchestrates all subsystems in the correct order and returns a consolidated result.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fc-e1); }
  </style>
  <defs><marker id="fc-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="10" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">PaymentFacade</text>
  <line x1="130" y1="32" x2="330" y2="32" class="s-diagram-line"/>
  <text x="140" y="46" class="s-member s-diagram-member">+processPayment(order): Receipt</text>
  <text x="140" y="58" class="s-member s-diagram-member">+refund(txnId): RefundResult</text>
  <rect x="10" y="120" width="100" height="40" class="s-box s-diagram-box"/>
  <text x="60" y="142" text-anchor="middle" class="s-title s-diagram-title">AuthService</text>
  <rect x="120" y="120" width="100" height="40" class="s-box s-diagram-box"/>
  <text x="170" y="142" text-anchor="middle" class="s-title s-diagram-title">FraudDetector</text>
  <rect x="230" y="120" width="110" height="40" class="s-box s-diagram-box"/>
  <text x="285" y="142" text-anchor="middle" class="s-title s-diagram-title">PaymentGateway</text>
  <rect x="350" y="120" width="100" height="40" class="s-box s-diagram-box"/>
  <text x="400" y="142" text-anchor="middle" class="s-title s-diagram-title">Notifier</text>
</svg>`,
      code: {
        Python: `from dataclasses import dataclass

@dataclass
class Receipt:
    transaction_id: str
    status: str

class AuthService:
    def verify_merchant(self, merchant_id: str) -> bool:
        return merchant_id.startswith("MRC-")

class FraudDetector:
    def check(self, amount: int, card_hash: str) -> bool:
        return amount < 1_000_000  # flag > $10k

class PaymentGateway:
    def charge(self, card: str, amount: int) -> str:
        return f"TXN-{abs(hash(card)) % 99999:05d}"

class Notifier:
    def send(self, customer_id: str, txn_id: str) -> None:
        print(f"Notification to {customer_id}: payment {txn_id}")

class PaymentFacade:
    def __init__(self):
        self._auth = AuthService()
        self._fraud = FraudDetector()
        self._gateway = PaymentGateway()
        self._notifier = Notifier()

    def process_payment(self, merchant: str, card: str,
                        amount: int, customer: str) -> Receipt:
        if not self._auth.verify_merchant(merchant):
            return Receipt("", "AUTH_FAILED")
        if not self._fraud.check(amount, card):
            return Receipt("", "FRAUD_BLOCKED")
        txn_id = self._gateway.charge(card, amount)
        self._notifier.send(customer, txn_id)
        return Receipt(txn_id, "SUCCESS")

# ── Usage ──
facade = PaymentFacade()
r = facade.process_payment("MRC-001", "card-hash", 5000, "CUST-42")
print(r)`,
        Go: `package main

import "fmt"

type AuthService struct{}
func (a AuthService) VerifyMerchant(id string) bool { return len(id) > 4 }

type FraudDetector struct{}
func (f FraudDetector) Check(amount int, card string) bool { return amount < 1000000 }

type PaymentGateway struct{}
func (g PaymentGateway) Charge(card string, amount int) string {
	return fmt.Sprintf("TXN-%05d", len(card)*amount%99999)
}

type Notifier struct{}
func (n Notifier) Send(customer, txnID string) {
	fmt.Printf("Notify %s: %s\\n", customer, txnID)
}

type PaymentFacade struct {
	auth    AuthService
	fraud   FraudDetector
	gateway PaymentGateway
	notify  Notifier
}

func (f *PaymentFacade) ProcessPayment(merchant, card string, amount int, customer string) (string, string) {
	if !f.auth.VerifyMerchant(merchant) { return "", "AUTH_FAILED" }
	if !f.fraud.Check(amount, card) { return "", "FRAUD_BLOCKED" }
	txn := f.gateway.Charge(card, amount)
	f.notify.Send(customer, txn)
	return txn, "SUCCESS"
}

func main() {
	facade := &PaymentFacade{}
	txn, status := facade.ProcessPayment("MRC-001", "card-hash", 5000, "CUST-42")
	fmt.Println(txn, status)
}`,
        Java: `class AuthService {
    boolean verifyMerchant(String id) { return id.startsWith("MRC-"); }
}
class FraudDetector {
    boolean check(int amount, String card) { return amount < 1_000_000; }
}
class PaymentGateway {
    String charge(String card, int amount) {
        return "TXN-" + String.format("%05d", Math.abs(card.hashCode()) % 99999);
    }
}
class Notifier {
    void send(String customer, String txn) {
        System.out.printf("Notify %s: %s%n", customer, txn);
    }
}

class PaymentFacade {
    private final AuthService auth = new AuthService();
    private final FraudDetector fraud = new FraudDetector();
    private final PaymentGateway gateway = new PaymentGateway();
    private final Notifier notifier = new Notifier();

    String processPayment(String merchant, String card, int amount, String customer) {
        if (!auth.verifyMerchant(merchant)) return "AUTH_FAILED";
        if (!fraud.check(amount, card)) return "FRAUD_BLOCKED";
        String txn = gateway.charge(card, amount);
        notifier.send(customer, txn);
        return txn;
    }
}`,
        TypeScript: `class AuthService {
  verifyMerchant(id: string): boolean { return id.startsWith("MRC-"); }
}
class FraudDetector {
  check(amount: number, card: string): boolean { return amount < 1_000_000; }
}
class PaymentGateway {
  charge(card: string, amount: number): string {
    return \`TXN-\${String(Math.abs(card.length * amount) % 99999).padStart(5, "0")}\`;
  }
}
class Notifier {
  send(customer: string, txn: string): void {
    console.log(\`Notify \${customer}: \${txn}\`);
  }
}

class PaymentFacade {
  private auth = new AuthService();
  private fraud = new FraudDetector();
  private gateway = new PaymentGateway();
  private notifier = new Notifier();

  processPayment(merchant: string, card: string, amount: number, customer: string): string {
    if (!this.auth.verifyMerchant(merchant)) return "AUTH_FAILED";
    if (!this.fraud.check(amount, card)) return "FRAUD_BLOCKED";
    const txn = this.gateway.charge(card, amount);
    this.notifier.send(customer, txn);
    return txn;
  }
}

// ── Usage ──
const facade = new PaymentFacade();
console.log(facade.processPayment("MRC-001", "card-hash", 5000, "CUST-42"));`,
        Rust: `struct AuthService;
impl AuthService {
    fn verify_merchant(&self, id: &str) -> bool { id.starts_with("MRC-") }
}
struct FraudDetector;
impl FraudDetector {
    fn check(&self, amount: u64, _card: &str) -> bool { amount < 1_000_000 }
}
struct PaymentGateway;
impl PaymentGateway {
    fn charge(&self, card: &str, amount: u64) -> String {
        format!("TXN-{:05}", (card.len() as u64 * amount) % 99999)
    }
}
struct Notifier;
impl Notifier {
    fn send(&self, customer: &str, txn: &str) {
        println!("Notify {}: {}", customer, txn);
    }
}

struct PaymentFacade {
    auth: AuthService,
    fraud: FraudDetector,
    gateway: PaymentGateway,
    notifier: Notifier,
}

impl PaymentFacade {
    fn new() -> Self {
        Self { auth: AuthService, fraud: FraudDetector, gateway: PaymentGateway, notifier: Notifier }
    }
    fn process_payment(&self, merchant: &str, card: &str, amount: u64, customer: &str) -> String {
        if !self.auth.verify_merchant(merchant) { return "AUTH_FAILED".into(); }
        if !self.fraud.check(amount, card) { return "FRAUD_BLOCKED".into(); }
        let txn = self.gateway.charge(card, amount);
        self.notifier.send(customer, &txn);
        txn
    }
}

fn main() {
    let facade = PaymentFacade::new();
    println!("{}", facade.process_payment("MRC-001", "card-hash", 5000, "CUST-42"));
}`,
      },
      considerations: [
        "Error handling at each step — if fraud check fails, don't charge the card",
        "Consider returning a Result/Either type so callers can distinguish failure modes",
        "The facade should be stateless — all state lives in the subsystems",
        "Logging/tracing should be added at the facade level for end-to-end observability",
        "Consider async variants for I/O-heavy subsystem calls",
      ],
    },
    {
      id: 2,
      title: "Healthcare — Patient Admission Facade",
      domain: "Healthcare",
      problem:
        "Admitting a patient to a hospital involves insurance verification, bed assignment, EMR record creation, pharmacy notification, and dietary order placement. Nurses currently navigate 5 different systems, increasing error rates and admission time.",
      solution:
        "An AdmissionFacade coordinates all subsystems behind a single admit() call, reducing the nurse's workflow to one form submission.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#fc-e2); }
  </style>
  <defs><marker id="fc-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="140" y="10" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">AdmissionFacade</text>
  <line x1="140" y1="32" x2="320" y2="32" class="s-diagram-line"/>
  <text x="150" y="48" class="s-member s-diagram-member">+admit(patient, dept): Admission</text>
  <rect x="10" y="120" width="90" height="40" class="s-box s-diagram-box"/>
  <text x="55" y="142" text-anchor="middle" class="s-title s-diagram-title">Insurance</text>
  <rect x="110" y="120" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="150" y="142" text-anchor="middle" class="s-title s-diagram-title">BedMgr</text>
  <rect x="200" y="120" width="70" height="40" class="s-box s-diagram-box"/>
  <text x="235" y="142" text-anchor="middle" class="s-title s-diagram-title">EMR</text>
  <rect x="280" y="120" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="320" y="142" text-anchor="middle" class="s-title s-diagram-title">Pharmacy</text>
  <rect x="370" y="120" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="410" y="142" text-anchor="middle" class="s-title s-diagram-title">Dietary</text>
</svg>`,
      code: {
        Python: `class InsuranceService:
    def verify(self, policy_id: str) -> bool:
        return policy_id.startswith("POL-")

class BedManager:
    def assign(self, department: str) -> str:
        return f"BED-{department}-101"

class EMRService:
    def create_record(self, patient_id: str, bed: str) -> str:
        return f"EMR-{patient_id}-{bed}"

class PharmacyService:
    def notify(self, emr_id: str) -> None:
        print(f"Pharmacy notified for {emr_id}")

class AdmissionFacade:
    def __init__(self):
        self._insurance = InsuranceService()
        self._beds = BedManager()
        self._emr = EMRService()
        self._pharmacy = PharmacyService()

    def admit(self, patient_id: str, policy_id: str, dept: str) -> dict:
        if not self._insurance.verify(policy_id):
            raise ValueError("Insurance verification failed")
        bed = self._beds.assign(dept)
        emr_id = self._emr.create_record(patient_id, bed)
        self._pharmacy.notify(emr_id)
        return {"bed": bed, "emr_id": emr_id, "status": "ADMITTED"}

# ── Usage ──
facade = AdmissionFacade()
print(facade.admit("PAT-001", "POL-12345", "cardiology"))`,
        Go: `package main

import "fmt"

type InsuranceService struct{}
func (i InsuranceService) Verify(policyID string) bool { return len(policyID) > 4 }

type BedManager struct{}
func (b BedManager) Assign(dept string) string { return fmt.Sprintf("BED-%s-101", dept) }

type EMRService struct{}
func (e EMRService) CreateRecord(patientID, bed string) string {
	return fmt.Sprintf("EMR-%s-%s", patientID, bed)
}

type PharmacyService struct{}
func (p PharmacyService) Notify(emrID string) { fmt.Println("Pharmacy:", emrID) }

type AdmissionFacade struct {
	insurance InsuranceService
	beds      BedManager
	emr       EMRService
	pharmacy  PharmacyService
}

func (f *AdmissionFacade) Admit(patientID, policyID, dept string) (string, error) {
	if !f.insurance.Verify(policyID) { return "", fmt.Errorf("insurance failed") }
	bed := f.beds.Assign(dept)
	emrID := f.emr.CreateRecord(patientID, bed)
	f.pharmacy.Notify(emrID)
	return emrID, nil
}

func main() {
	f := &AdmissionFacade{}
	emr, _ := f.Admit("PAT-001", "POL-12345", "cardiology")
	fmt.Println("Admitted:", emr)
}`,
        Java: `class AdmissionFacade {
    private final InsuranceService insurance = new InsuranceService();
    private final BedManager beds = new BedManager();
    private final EMRService emr = new EMRService();
    private final PharmacyService pharmacy = new PharmacyService();

    public String admit(String patientId, String policyId, String dept) {
        if (!insurance.verify(policyId))
            throw new RuntimeException("Insurance verification failed");
        String bed = beds.assign(dept);
        String emrId = emr.createRecord(patientId, bed);
        pharmacy.notify(emrId);
        return emrId;
    }
}

class InsuranceService { boolean verify(String id) { return id.startsWith("POL-"); } }
class BedManager { String assign(String dept) { return "BED-" + dept + "-101"; } }
class EMRService { String createRecord(String pid, String bed) { return "EMR-" + pid; } }
class PharmacyService { void notify(String emrId) { System.out.println("Pharmacy: " + emrId); } }`,
        TypeScript: `class InsuranceService {
  verify(policyId: string): boolean { return policyId.startsWith("POL-"); }
}
class BedManager {
  assign(dept: string): string { return \`BED-\${dept}-101\`; }
}
class EMRService {
  createRecord(patientId: string, bed: string): string { return \`EMR-\${patientId}\`; }
}
class PharmacyService {
  notify(emrId: string): void { console.log(\`Pharmacy notified: \${emrId}\`); }
}

class AdmissionFacade {
  private insurance = new InsuranceService();
  private beds = new BedManager();
  private emr = new EMRService();
  private pharmacy = new PharmacyService();

  admit(patientId: string, policyId: string, dept: string) {
    if (!this.insurance.verify(policyId)) throw new Error("Insurance failed");
    const bed = this.beds.assign(dept);
    const emrId = this.emr.createRecord(patientId, bed);
    this.pharmacy.notify(emrId);
    return { bed, emrId, status: "ADMITTED" };
  }
}

// ── Usage ──
const facade = new AdmissionFacade();
console.log(facade.admit("PAT-001", "POL-12345", "cardiology"));`,
        Rust: `struct InsuranceService;
impl InsuranceService { fn verify(&self, id: &str) -> bool { id.starts_with("POL-") } }

struct BedManager;
impl BedManager { fn assign(&self, dept: &str) -> String { format!("BED-{}-101", dept) } }

struct EMRService;
impl EMRService { fn create_record(&self, pid: &str, bed: &str) -> String { format!("EMR-{}-{}", pid, bed) } }

struct PharmacyService;
impl PharmacyService { fn notify(&self, emr_id: &str) { println!("Pharmacy: {}", emr_id); } }

struct AdmissionFacade {
    insurance: InsuranceService,
    beds: BedManager,
    emr: EMRService,
    pharmacy: PharmacyService,
}

impl AdmissionFacade {
    fn new() -> Self { Self { insurance: InsuranceService, beds: BedManager, emr: EMRService, pharmacy: PharmacyService } }
    fn admit(&self, patient_id: &str, policy_id: &str, dept: &str) -> Result<String, String> {
        if !self.insurance.verify(policy_id) { return Err("Insurance failed".into()); }
        let bed = self.beds.assign(dept);
        let emr_id = self.emr.create_record(patient_id, &bed);
        self.pharmacy.notify(&emr_id);
        Ok(emr_id)
    }
}

fn main() {
    let f = AdmissionFacade::new();
    println!("{:?}", f.admit("PAT-001", "POL-12345", "cardiology"));
}`,
      },
      considerations: [
        "HIPAA compliance requires audit logging at every step — the facade is the ideal place",
        "Insurance verification may be async — consider async facade variants",
        "Rollback logic if bed assignment succeeds but EMR creation fails",
        "The facade should validate all inputs before calling any subsystem",
        "Consider idempotency for retry scenarios",
      ],
    },
    {
      id: 3,
      title: "E-Commerce — Order Fulfillment Facade",
      domain: "E-Commerce",
      problem:
        "Fulfilling an order involves inventory reservation, payment capture, warehouse picking, shipping label generation, and customer notification. Each step is a separate microservice, and the calling sequence has changed 3 times in the past year.",
      solution:
        "A FulfillmentFacade encapsulates the multi-service pipeline behind a single fulfillOrder() method. When the sequence changes, only the facade is updated.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="10" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">FulfillmentFacade</text>
  <line x1="130" y1="32" x2="330" y2="32" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">+fulfillOrder(order): Shipment</text>
  <rect x="10" y="110" width="86" height="40" class="s-box s-diagram-box"/>
  <text x="53" y="134" text-anchor="middle" class="s-title s-diagram-title">Inventory</text>
  <rect x="104" y="110" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="144" y="134" text-anchor="middle" class="s-title s-diagram-title">Payment</text>
  <rect x="192" y="110" width="86" height="40" class="s-box s-diagram-box"/>
  <text x="235" y="134" text-anchor="middle" class="s-title s-diagram-title">Warehouse</text>
  <rect x="286" y="110" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="326" y="134" text-anchor="middle" class="s-title s-diagram-title">Shipping</text>
  <rect x="374" y="110" width="76" height="40" class="s-box s-diagram-box"/>
  <text x="412" y="134" text-anchor="middle" class="s-title s-diagram-title">Notifier</text>
</svg>`,
      code: {
        Python: `class InventoryService:
    def reserve(self, items: list[str]) -> bool:
        return all(len(i) > 0 for i in items)

class PaymentService:
    def capture(self, payment_id: str) -> str:
        return f"CAP-{payment_id}"

class WarehouseService:
    def create_pick(self, order_id: str) -> str:
        return f"PICK-{order_id}"

class ShippingService:
    def generate_label(self, pick_id: str) -> str:
        return f"LABEL-{pick_id}"

class FulfillmentFacade:
    def __init__(self):
        self._inventory = InventoryService()
        self._payment = PaymentService()
        self._warehouse = WarehouseService()
        self._shipping = ShippingService()

    def fulfill_order(self, order_id: str, items: list[str], payment_id: str) -> str:
        if not self._inventory.reserve(items):
            raise ValueError("Inventory insufficient")
        self._payment.capture(payment_id)
        pick = self._warehouse.create_pick(order_id)
        label = self._shipping.generate_label(pick)
        return label

# ── Usage ──
facade = FulfillmentFacade()
print(facade.fulfill_order("ORD-100", ["SKU-A", "SKU-B"], "PAY-001"))`,
        Go: `package main

import "fmt"

type InventoryService struct{}
func (i InventoryService) Reserve(items []string) bool { return len(items) > 0 }

type PaymentService struct{}
func (p PaymentService) Capture(payID string) string { return "CAP-" + payID }

type WarehouseService struct{}
func (w WarehouseService) CreatePick(orderID string) string { return "PICK-" + orderID }

type ShippingService struct{}
func (s ShippingService) GenerateLabel(pickID string) string { return "LABEL-" + pickID }

type FulfillmentFacade struct {
	inv  InventoryService
	pay  PaymentService
	wh   WarehouseService
	ship ShippingService
}

func (f *FulfillmentFacade) FulfillOrder(orderID string, items []string, payID string) string {
	if !f.inv.Reserve(items) { panic("inventory") }
	f.pay.Capture(payID)
	pick := f.wh.CreatePick(orderID)
	return f.ship.GenerateLabel(pick)
}

func main() {
	f := &FulfillmentFacade{}
	fmt.Println(f.FulfillOrder("ORD-100", []string{"SKU-A"}, "PAY-001"))
}`,
        Java: `class FulfillmentFacade {
    private final InventoryService inv = new InventoryService();
    private final PaymentService pay = new PaymentService();
    private final WarehouseService wh = new WarehouseService();
    private final ShippingService ship = new ShippingService();

    String fulfillOrder(String orderId, String[] items, String paymentId) {
        if (!inv.reserve(items)) throw new RuntimeException("Inventory insufficient");
        pay.capture(paymentId);
        String pick = wh.createPick(orderId);
        return ship.generateLabel(pick);
    }
}

class InventoryService { boolean reserve(String[] items) { return items.length > 0; } }
class PaymentService { String capture(String id) { return "CAP-" + id; } }
class WarehouseService { String createPick(String id) { return "PICK-" + id; } }
class ShippingService { String generateLabel(String pick) { return "LABEL-" + pick; } }`,
        TypeScript: `class InventoryService { reserve(items: string[]): boolean { return items.length > 0; } }
class PaymentService { capture(payId: string): string { return \`CAP-\${payId}\`; } }
class WarehouseService { createPick(orderId: string): string { return \`PICK-\${orderId}\`; } }
class ShippingService { generateLabel(pickId: string): string { return \`LABEL-\${pickId}\`; } }

class FulfillmentFacade {
  private inv = new InventoryService();
  private pay = new PaymentService();
  private wh = new WarehouseService();
  private ship = new ShippingService();

  fulfillOrder(orderId: string, items: string[], payId: string): string {
    if (!this.inv.reserve(items)) throw new Error("Inventory insufficient");
    this.pay.capture(payId);
    const pick = this.wh.createPick(orderId);
    return this.ship.generateLabel(pick);
  }
}

// ── Usage ──
const f = new FulfillmentFacade();
console.log(f.fulfillOrder("ORD-100", ["SKU-A", "SKU-B"], "PAY-001"));`,
        Rust: `struct InventoryService;
impl InventoryService { fn reserve(&self, items: &[&str]) -> bool { !items.is_empty() } }

struct PaymentService;
impl PaymentService { fn capture(&self, pay_id: &str) -> String { format!("CAP-{}", pay_id) } }

struct WarehouseService;
impl WarehouseService { fn create_pick(&self, order_id: &str) -> String { format!("PICK-{}", order_id) } }

struct ShippingService;
impl ShippingService { fn generate_label(&self, pick: &str) -> String { format!("LABEL-{}", pick) } }

struct FulfillmentFacade { inv: InventoryService, pay: PaymentService, wh: WarehouseService, ship: ShippingService }

impl FulfillmentFacade {
    fn new() -> Self {
        Self { inv: InventoryService, pay: PaymentService, wh: WarehouseService, ship: ShippingService }
    }
    fn fulfill_order(&self, order_id: &str, items: &[&str], pay_id: &str) -> String {
        assert!(self.inv.reserve(items), "Inventory insufficient");
        self.pay.capture(pay_id);
        let pick = self.wh.create_pick(order_id);
        self.ship.generate_label(&pick)
    }
}

fn main() {
    let f = FulfillmentFacade::new();
    println!("{}", f.fulfill_order("ORD-100", &["SKU-A"], "PAY-001"));
}`,
      },
      considerations: [
        "Compensating transactions (saga) if a mid-pipeline step fails — release inventory if payment fails",
        "Idempotency keys for safe retries of partial fulfillment",
        "Async facade variant for non-blocking fulfillment with status polling",
        "Event emission at each step for downstream analytics and real-time tracking",
        "Circuit breaker on external services (shipping carriers) to prevent cascade failures",
      ],
    },
    {
      id: 4,
      title: "DevOps — CI/CD Deployment Facade",
      domain: "DevOps",
      problem:
        "Deploying a microservice requires building Docker images, running tests, scanning for vulnerabilities, pushing to a container registry, rolling out to Kubernetes, and verifying health checks. Each team scripts this differently, creating inconsistent deployments.",
      solution:
        "A DeployFacade standardizes the pipeline behind a single deploy() call with built-in rollback on any step failure.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="10" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">DeployFacade</text>
  <line x1="130" y1="32" x2="330" y2="32" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">+deploy(svc, ver): DeployResult</text>
  <rect x="10" y="110" width="76" height="40" class="s-box s-diagram-box"/>
  <text x="48" y="134" text-anchor="middle" class="s-title s-diagram-title">Builder</text>
  <rect x="94" y="110" width="76" height="40" class="s-box s-diagram-box"/>
  <text x="132" y="134" text-anchor="middle" class="s-title s-diagram-title">Scanner</text>
  <rect x="178" y="110" width="76" height="40" class="s-box s-diagram-box"/>
  <text x="216" y="134" text-anchor="middle" class="s-title s-diagram-title">Registry</text>
  <rect x="262" y="110" width="64" height="40" class="s-box s-diagram-box"/>
  <text x="294" y="134" text-anchor="middle" class="s-title s-diagram-title">K8s</text>
  <rect x="334" y="110" width="76" height="40" class="s-box s-diagram-box"/>
  <text x="372" y="134" text-anchor="middle" class="s-title s-diagram-title">Health</text>
</svg>`,
      code: {
        Python: `class DockerBuilder:
    def build(self, svc: str) -> str: return f"img-{svc}:latest"

class SecurityScanner:
    def scan(self, image: str) -> bool: return True  # no vulns

class ContainerRegistry:
    def push(self, image: str, tag: str) -> str: return f"registry/{image}:{tag}"

class K8sClient:
    def rollout(self, svc: str, image: str) -> None: print(f"Rolling out {svc}")

class HealthChecker:
    def verify(self, svc: str) -> bool: return True

class DeployFacade:
    def __init__(self):
        self._builder = DockerBuilder()
        self._scanner = SecurityScanner()
        self._registry = ContainerRegistry()
        self._k8s = K8sClient()
        self._health = HealthChecker()

    def deploy(self, svc: str, version: str) -> str:
        image = self._builder.build(svc)
        if not self._scanner.scan(image):
            raise RuntimeError("Security scan failed")
        ref = self._registry.push(image, version)
        self._k8s.rollout(svc, ref)
        if not self._health.verify(svc):
            raise RuntimeError("Health check failed — initiating rollback")
        return f"DEPLOYED {svc}@{version}"

# ── Usage ──
facade = DeployFacade()
print(facade.deploy("payment-svc", "v2.3.1"))`,
        Go: `package main

import "fmt"

type DockerBuilder struct{}
func (d DockerBuilder) Build(svc string) string { return "img-" + svc }

type SecurityScanner struct{}
func (s SecurityScanner) Scan(image string) bool { return true }

type ContainerRegistry struct{}
func (r ContainerRegistry) Push(img, tag string) string { return "registry/" + img + ":" + tag }

type K8sClient struct{}
func (k K8sClient) Rollout(svc, ref string) { fmt.Println("Rolling out", svc) }

type HealthChecker struct{}
func (h HealthChecker) Verify(svc string) bool { return true }

type DeployFacade struct { b DockerBuilder; s SecurityScanner; r ContainerRegistry; k K8sClient; h HealthChecker }

func (f *DeployFacade) Deploy(svc, version string) string {
	img := f.b.Build(svc)
	if !f.s.Scan(img) { panic("scan failed") }
	ref := f.r.Push(img, version)
	f.k.Rollout(svc, ref)
	if !f.h.Verify(svc) { panic("health failed") }
	return fmt.Sprintf("DEPLOYED %s@%s", svc, version)
}

func main() {
	f := &DeployFacade{}
	fmt.Println(f.Deploy("payment-svc", "v2.3.1"))
}`,
        Java: `class DeployFacade {
    private final DockerBuilder builder = new DockerBuilder();
    private final SecurityScanner scanner = new SecurityScanner();
    private final ContainerRegistry registry = new ContainerRegistry();
    private final K8sClient k8s = new K8sClient();
    private final HealthChecker health = new HealthChecker();

    String deploy(String svc, String version) {
        String image = builder.build(svc);
        if (!scanner.scan(image)) throw new RuntimeException("Scan failed");
        String ref = registry.push(image, version);
        k8s.rollout(svc, ref);
        if (!health.verify(svc)) throw new RuntimeException("Health failed");
        return "DEPLOYED " + svc + "@" + version;
    }
}

class DockerBuilder { String build(String svc) { return "img-" + svc; } }
class SecurityScanner { boolean scan(String img) { return true; } }
class ContainerRegistry { String push(String img, String tag) { return "reg/" + img + ":" + tag; } }
class K8sClient { void rollout(String svc, String ref) { System.out.println("Rolling: " + svc); } }
class HealthChecker { boolean verify(String svc) { return true; } }`,
        TypeScript: `class DockerBuilder { build(svc: string) { return \`img-\${svc}\`; } }
class SecurityScanner { scan(img: string) { return true; } }
class ContainerRegistry { push(img: string, tag: string) { return \`registry/\${img}:\${tag}\`; } }
class K8sClient { rollout(svc: string, ref: string) { console.log(\`Rolling out \${svc}\`); } }
class HealthChecker { verify(svc: string) { return true; } }

class DeployFacade {
  private builder = new DockerBuilder();
  private scanner = new SecurityScanner();
  private registry = new ContainerRegistry();
  private k8s = new K8sClient();
  private health = new HealthChecker();

  deploy(svc: string, version: string): string {
    const img = this.builder.build(svc);
    if (!this.scanner.scan(img)) throw new Error("Scan failed");
    const ref = this.registry.push(img, version);
    this.k8s.rollout(svc, ref);
    if (!this.health.verify(svc)) throw new Error("Health failed");
    return \`DEPLOYED \${svc}@\${version}\`;
  }
}

// ── Usage ──
const deploy = new DeployFacade();
console.log(deploy.deploy("payment-svc", "v2.3.1"));`,
        Rust: `struct DockerBuilder;
impl DockerBuilder { fn build(&self, svc: &str) -> String { format!("img-{}", svc) } }
struct SecurityScanner;
impl SecurityScanner { fn scan(&self, _img: &str) -> bool { true } }
struct ContainerRegistry;
impl ContainerRegistry { fn push(&self, img: &str, tag: &str) -> String { format!("reg/{}:{}", img, tag) } }
struct K8sClient;
impl K8sClient { fn rollout(&self, svc: &str, _r: &str) { println!("Rolling out {}", svc); } }
struct HealthChecker;
impl HealthChecker { fn verify(&self, _svc: &str) -> bool { true } }

struct DeployFacade { b: DockerBuilder, s: SecurityScanner, r: ContainerRegistry, k: K8sClient, h: HealthChecker }

impl DeployFacade {
    fn new() -> Self { Self { b: DockerBuilder, s: SecurityScanner, r: ContainerRegistry, k: K8sClient, h: HealthChecker } }
    fn deploy(&self, svc: &str, ver: &str) -> String {
        let img = self.b.build(svc);
        assert!(self.s.scan(&img), "Scan failed");
        let rf = self.r.push(&img, ver);
        self.k.rollout(svc, &rf);
        assert!(self.h.verify(svc), "Health failed");
        format!("DEPLOYED {}@{}", svc, ver)
    }
}

fn main() {
    let f = DeployFacade::new();
    println!("{}", f.deploy("payment-svc", "v2.3.1"));
}`,
      },
      considerations: [
        "Rollback strategy for each step — if K8s rollout fails, clean up registry tag",
        "Progress callbacks for CI/CD dashboards showing which step is executing",
        "Dry-run mode that validates all steps without actually deploying",
        "Parallel step execution where possible (security scan + unit tests)",
        "Integration with notification systems (Slack, PagerDuty) for deploy status",
      ],
    },
    {
      id: 5,
      title: "Media — Video Transcoding Pipeline",
      domain: "Media Streaming",
      problem:
        "Transcoding a video requires probe analysis, codec selection, actual transcoding, thumbnail generation, DRM wrapping, and CDN upload. Using FFmpeg, ImageMagick, and cloud SDKs directly in upload handlers makes the code unmaintainable.",
      solution:
        "A TranscodeFacade wraps the entire pipeline. The upload service calls transcode(videoFile) and gets back a CDN URL.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="10" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">TranscodeFacade</text>
  <line x1="130" y1="32" x2="330" y2="32" class="s-diagram-line"/>
  <text x="140" y="48" class="s-member s-diagram-member">+transcode(video): CDNResult</text>
  <rect x="10" y="110" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="50" y="134" text-anchor="middle" class="s-title s-diagram-title">Probe</text>
  <rect x="100" y="110" width="80" height="40" class="s-box s-diagram-box"/>
  <text x="140" y="134" text-anchor="middle" class="s-title s-diagram-title">Encoder</text>
  <rect x="190" y="110" width="86" height="40" class="s-box s-diagram-box"/>
  <text x="233" y="134" text-anchor="middle" class="s-title s-diagram-title">ThumbGen</text>
  <rect x="286" y="110" width="70" height="40" class="s-box s-diagram-box"/>
  <text x="321" y="134" text-anchor="middle" class="s-title s-diagram-title">DRM</text>
  <rect x="366" y="110" width="70" height="40" class="s-box s-diagram-box"/>
  <text x="401" y="134" text-anchor="middle" class="s-title s-diagram-title">CDN</text>
</svg>`,
      code: {
        Python: `class VideoProbe:
    def analyze(self, path: str) -> dict:
        return {"codec": "h264", "duration": 3600, "resolution": "1920x1080"}

class Encoder:
    def encode(self, path: str, target_codec: str) -> str:
        return f"/tmp/encoded_{target_codec}.mp4"

class ThumbnailGenerator:
    def generate(self, video_path: str) -> str:
        return f"/tmp/thumb_{video_path.split('/')[-1]}.jpg"

class DRMWrapper:
    def wrap(self, path: str) -> str: return path + ".drm"

class CDNUploader:
    def upload(self, *paths: str) -> str: return f"https://cdn.example.com/{paths[0].split('/')[-1]}"

class TranscodeFacade:
    def __init__(self):
        self._probe = VideoProbe()
        self._encoder = Encoder()
        self._thumb = ThumbnailGenerator()
        self._drm = DRMWrapper()
        self._cdn = CDNUploader()

    def transcode(self, video_path: str) -> str:
        meta = self._probe.analyze(video_path)
        encoded = self._encoder.encode(video_path, "h265")
        thumb = self._thumb.generate(encoded)
        protected = self._drm.wrap(encoded)
        url = self._cdn.upload(protected, thumb)
        return url

# ── Usage ──
facade = TranscodeFacade()
print(facade.transcode("/uploads/movie.raw"))`,
        Go: `package main

import "fmt"

type VideoProbe struct{}
func (v VideoProbe) Analyze(path string) map[string]string { return map[string]string{"codec": "h264"} }

type Encoder struct{}
func (e Encoder) Encode(path, codec string) string { return "/tmp/encoded_" + codec + ".mp4" }

type ThumbnailGen struct{}
func (t ThumbnailGen) Generate(path string) string { return "/tmp/thumb.jpg" }

type DRMWrapper struct{}
func (d DRMWrapper) Wrap(path string) string { return path + ".drm" }

type CDNUploader struct{}
func (c CDNUploader) Upload(paths ...string) string { return "https://cdn.example.com/video" }

type TranscodeFacade struct { p VideoProbe; e Encoder; t ThumbnailGen; d DRMWrapper; c CDNUploader }

func (f *TranscodeFacade) Transcode(path string) string {
	f.p.Analyze(path)
	encoded := f.e.Encode(path, "h265")
	thumb := f.t.Generate(encoded)
	protected := f.d.Wrap(encoded)
	return f.c.Upload(protected, thumb)
}

func main() {
	f := &TranscodeFacade{}
	fmt.Println(f.Transcode("/uploads/movie.raw"))
}`,
        Java: `class TranscodeFacade {
    private final VideoProbe probe = new VideoProbe();
    private final Encoder encoder = new Encoder();
    private final ThumbnailGen thumbGen = new ThumbnailGen();
    private final DRMWrapper drm = new DRMWrapper();
    private final CDNUploader cdn = new CDNUploader();

    String transcode(String videoPath) {
        probe.analyze(videoPath);
        String encoded = encoder.encode(videoPath, "h265");
        String thumb = thumbGen.generate(encoded);
        String wrapped = drm.wrap(encoded);
        return cdn.upload(wrapped, thumb);
    }
}

class VideoProbe { void analyze(String p) {} }
class Encoder { String encode(String p, String c) { return "/tmp/encoded." + c; } }
class ThumbnailGen { String generate(String p) { return "/tmp/thumb.jpg"; } }
class DRMWrapper { String wrap(String p) { return p + ".drm"; } }
class CDNUploader { String upload(String... paths) { return "https://cdn.example.com/video"; } }`,
        TypeScript: `class VideoProbe { analyze(path: string) { return { codec: "h264", duration: 3600 }; } }
class Encoder { encode(path: string, codec: string) { return \`/tmp/encoded_\${codec}.mp4\`; } }
class ThumbnailGen { generate(path: string) { return "/tmp/thumb.jpg"; } }
class DRMWrapper { wrap(path: string) { return path + ".drm"; } }
class CDNUploader { upload(...paths: string[]) { return "https://cdn.example.com/video"; } }

class TranscodeFacade {
  private probe = new VideoProbe();
  private encoder = new Encoder();
  private thumb = new ThumbnailGen();
  private drm = new DRMWrapper();
  private cdn = new CDNUploader();

  transcode(videoPath: string): string {
    this.probe.analyze(videoPath);
    const encoded = this.encoder.encode(videoPath, "h265");
    const thumbnail = this.thumb.generate(encoded);
    const wrapped = this.drm.wrap(encoded);
    return this.cdn.upload(wrapped, thumbnail);
  }
}

// ── Usage ──
const tc = new TranscodeFacade();
console.log(tc.transcode("/uploads/movie.raw"));`,
        Rust: `struct VideoProbe;
impl VideoProbe { fn analyze(&self, _path: &str) -> String { "h264".into() } }
struct Encoder;
impl Encoder { fn encode(&self, _path: &str, codec: &str) -> String { format!("/tmp/encoded_{}.mp4", codec) } }
struct ThumbnailGen;
impl ThumbnailGen { fn generate(&self, _path: &str) -> String { "/tmp/thumb.jpg".into() } }
struct DRMWrapper;
impl DRMWrapper { fn wrap(&self, path: &str) -> String { format!("{}.drm", path) } }
struct CDNUploader;
impl CDNUploader { fn upload(&self, _paths: &[&str]) -> String { "https://cdn.example.com/video".into() } }

struct TranscodeFacade { p: VideoProbe, e: Encoder, t: ThumbnailGen, d: DRMWrapper, c: CDNUploader }

impl TranscodeFacade {
    fn new() -> Self { Self { p: VideoProbe, e: Encoder, t: ThumbnailGen, d: DRMWrapper, c: CDNUploader } }
    fn transcode(&self, path: &str) -> String {
        self.p.analyze(path);
        let enc = self.e.encode(path, "h265");
        let thumb = self.t.generate(&enc);
        let wrapped = self.d.wrap(&enc);
        self.c.upload(&[&wrapped, &thumb])
    }
}

fn main() {
    let f = TranscodeFacade::new();
    println!("{}", f.transcode("/uploads/movie.raw"));
}`,
      },
      considerations: [
        "Long-running operations — use job queues with the facade submitting async jobs",
        "Progress reporting through callbacks or event streams",
        "Cleanup on failure — delete partial encodes if DRM wrapping fails",
        "Support for multiple output profiles (720p, 1080p, 4K) from a single source",
        "Cost optimization — skip DRM for preview thumbnails",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Start with the Simple Facade for most cases — it covers the 80% use case. Use Multi-Facade when different client types need different levels of simplification. Use Async Facade for I/O-heavy subsystems.",

  variants: [
    {
      id: 1,
      name: "Simple Facade",
      description:
        "A single class with methods that orchestrate subsystem calls in sequence. The most common and straightforward approach.",
      code: {
        Python: `class OrderFacade:
    def __init__(self):
        self._inventory = InventoryService()
        self._payment = PaymentService()
        self._shipping = ShippingService()

    def place_order(self, order):
        self._inventory.reserve(order.items)
        self._payment.charge(order.total)
        return self._shipping.ship(order)

# ── Usage ──
facade = OrderFacade()
facade.place_order(order)`,
        Go: `type OrderFacade struct {
	inv  InventoryService
	pay  PaymentService
	ship ShippingService
}

func (f *OrderFacade) PlaceOrder(order Order) string {
	f.inv.Reserve(order.Items)
	f.pay.Charge(order.Total)
	return f.ship.Ship(order)
}`,
        Java: `class OrderFacade {
    private final InventoryService inv = new InventoryService();
    private final PaymentService pay = new PaymentService();
    private final ShippingService ship = new ShippingService();

    String placeOrder(Order order) {
        inv.reserve(order.items);
        pay.charge(order.total);
        return ship.ship(order);
    }
}`,
        TypeScript: `class OrderFacade {
  private inv = new InventoryService();
  private pay = new PaymentService();
  private ship = new ShippingService();

  placeOrder(order: Order): string {
    this.inv.reserve(order.items);
    this.pay.charge(order.total);
    return this.ship.ship(order);
  }
}`,
        Rust: `struct OrderFacade { inv: InventoryService, pay: PaymentService, ship: ShippingService }

impl OrderFacade {
    fn place_order(&self, order: &Order) -> String {
        self.inv.reserve(&order.items);
        self.pay.charge(order.total);
        self.ship.ship(order)
    }
}`,
      },
      pros: [
        "Simplest to implement and understand",
        "One class, obvious orchestration flow",
        "Easy to add logging and error handling at each step",
      ],
      cons: [
        "Can grow large if the subsystem is complex",
        "Single facade may not suit all client needs",
        "No async support by default",
      ],
    },
    {
      id: 2,
      name: "Multi-Facade (Layered)",
      description:
        "Multiple facade classes for different client audiences. An AdminFacade exposes advanced operations; a CustomerFacade exposes simplified flows. Both coordinate the same subsystems.",
      code: {
        Python: `class CustomerFacade:
    def place_order(self, items, card):
        """Simple API for customers"""
        return OrderPipeline().process(items, card)

class AdminFacade:
    def place_order_with_override(self, items, card, discount):
        """Advanced API for admins with discount override"""
        pipeline = OrderPipeline()
        pipeline.apply_discount(discount)
        return pipeline.process(items, card)`,
        Go: `type CustomerFacade struct{ pipeline OrderPipeline }
func (f *CustomerFacade) PlaceOrder(items []string, card string) string {
	return f.pipeline.Process(items, card)
}

type AdminFacade struct{ pipeline OrderPipeline }
func (f *AdminFacade) PlaceOrderWithOverride(items []string, card string, discount float64) string {
	f.pipeline.ApplyDiscount(discount)
	return f.pipeline.Process(items, card)
}`,
        Java: `class CustomerFacade {
    String placeOrder(String[] items, String card) {
        return new OrderPipeline().process(items, card);
    }
}

class AdminFacade {
    String placeOrderWithOverride(String[] items, String card, double discount) {
        OrderPipeline p = new OrderPipeline();
        p.applyDiscount(discount);
        return p.process(items, card);
    }
}`,
        TypeScript: `class CustomerFacade {
  placeOrder(items: string[], card: string): string {
    return new OrderPipeline().process(items, card);
  }
}

class AdminFacade {
  placeOrderWithOverride(items: string[], card: string, discount: number): string {
    const p = new OrderPipeline();
    p.applyDiscount(discount);
    return p.process(items, card);
  }
}`,
        Rust: `struct CustomerFacade;
impl CustomerFacade {
    fn place_order(&self, items: &[&str], card: &str) -> String {
        OrderPipeline::new().process(items, card)
    }
}

struct AdminFacade;
impl AdminFacade {
    fn place_order_with_override(&self, items: &[&str], card: &str, discount: f64) -> String {
        let mut p = OrderPipeline::new();
        p.apply_discount(discount);
        p.process(items, card)
    }
}`,
      },
      pros: [
        "Different client types get tailored APIs",
        "Enforces access boundaries — customers can't call admin operations",
        "Each facade stays small and focused",
      ],
      cons: [
        "More classes to maintain",
        "Shared subsystem changes affect multiple facades",
        "Risk of code duplication between facades — extract shared pipelines",
      ],
    },
    {
      id: 3,
      name: "Async Facade",
      description:
        "The facade coordinates async subsystem calls using promises/futures/channels. Ideal for I/O-heavy operations where sequential execution wastes time.",
      code: {
        Python: `import asyncio

class AsyncPaymentFacade:
    async def process(self, order):
        auth, fraud = await asyncio.gather(
            self._auth.verify(order.merchant),
            self._fraud.check(order.amount)
        )
        if not auth or not fraud:
            raise ValueError("Pre-check failed")
        txn = await self._gateway.charge(order)
        await self._notifier.send(order.customer, txn)
        return txn

# ── Usage ──
facade = AsyncPaymentFacade()
result = asyncio.run(facade.process(order))`,
        Go: `func (f *AsyncPaymentFacade) Process(order Order) (string, error) {
	var auth, fraud bool
	var wg sync.WaitGroup
	wg.Add(2)
	go func() { defer wg.Done(); auth = f.authSvc.Verify(order.Merchant) }()
	go func() { defer wg.Done(); fraud = f.fraudSvc.Check(order.Amount) }()
	wg.Wait()
	if !auth || !fraud { return "", fmt.Errorf("pre-check failed") }
	return f.gateway.Charge(order)
}`,
        Java: `CompletableFuture<String> process(Order order) {
    return CompletableFuture.allOf(
        CompletableFuture.runAsync(() -> auth.verify(order.merchant)),
        CompletableFuture.runAsync(() -> fraud.check(order.amount))
    ).thenApply(v -> gateway.charge(order));
}`,
        TypeScript: `class AsyncPaymentFacade {
  async process(order: Order): Promise<string> {
    const [auth, fraud] = await Promise.all([
      this.auth.verify(order.merchant),
      this.fraud.check(order.amount),
    ]);
    if (!auth || !fraud) throw new Error("Pre-check failed");
    const txn = await this.gateway.charge(order);
    await this.notifier.send(order.customer, txn);
    return txn;
  }
}`,
        Rust: `async fn process(&self, order: &Order) -> Result<String, String> {
    let (auth, fraud) = tokio::join!(
        self.auth.verify(&order.merchant),
        self.fraud.check(order.amount)
    );
    if !auth || !fraud { return Err("Pre-check failed".into()); }
    let txn = self.gateway.charge(order).await;
    self.notifier.send(&order.customer, &txn).await;
    Ok(txn)
}`,
      },
      pros: [
        "Parallel subsystem calls dramatically reduce latency",
        "Natural fit for web services and I/O-heavy pipelines",
        "Can use structured concurrency for clean error handling",
      ],
      cons: [
        "More complex error handling and cancellation logic",
        "Harder to debug — async stack traces are less readable",
        "Requires async runtime support in the language",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Complexity", "Client Types", "Async Support", "Best For",
  ],
  comparisonRows: [
    ["Simple Facade", "Low", "One", "Add manually", "Most applications — start here"],
    ["Multi-Facade", "Medium", "Multiple", "Per facade", "Role-based access (admin/customer)"],
    ["Async Facade", "Medium", "One", "Built-in", "I/O-heavy subsystems, web services"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Structural" },
    {
      aspect: "Key Benefit",
      detail:
        "Simplifies complex subsystem interactions into a single, clean entry point — reduces coupling and learning curve",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Making the facade the only way to access the subsystem — it should simplify, not restrict",
    },
    {
      aspect: "vs. Adapter",
      detail:
        "Adapter changes an interface to match what the client expects; Facade creates a new simplified interface over a complex subsystem",
    },
    {
      aspect: "vs. Mediator",
      detail:
        "Mediator manages bidirectional communication between peers; Facade provides one-directional simplification (client → subsystem)",
    },
    {
      aspect: "When to Use",
      detail:
        "When a subsystem has many classes, complex call sequences, or when different teams need a stable API over volatile internals",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When the subsystem is already simple, when clients need full control over individual subsystem components, or when the facade would just proxy a single class",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Adapter (interface translation), Mediator (peer coordination), Abstract Factory (often used behind a facade to create subsystem objects)",
    },
  ],

  antiPatterns: [
    {
      name: "God Facade",
      description:
        "A single facade that wraps every subsystem in the application — payments, users, inventory, shipping, analytics — becoming a 2000-line class that's hard to maintain.",
      betterAlternative:
        "One facade per subsystem or bounded context: PaymentFacade, InventoryFacade, ShippingFacade. Each stays focused and testable.",
    },
    {
      name: "Facade as Only Access",
      description:
        "Preventing clients from using subsystem classes directly by making them internal/private. The facade becomes a bottleneck and limits flexibility for power users.",
      betterAlternative:
        "Keep subsystems accessible. The facade is a convenience layer — advanced clients can bypass it when they need fine-grained control.",
    },
    {
      name: "Business Logic in Facade",
      description:
        "The facade adds validation, calculations, or transformation logic instead of just coordinating subsystem calls. It becomes an invisible service layer.",
      betterAlternative:
        "Business logic belongs in domain services or subsystem classes. The facade should only orchestrate — call A then B then C — not compute.",
    },
    {
      name: "Stateful Facade",
      description:
        "The facade stores state between calls (e.g., caching results, tracking call counts). This couples the facade's lifetime to the request lifecycle and breaks thread safety.",
      betterAlternative:
        "Keep facades stateless. State belongs in the subsystems. If you need request-scoped state, create a new facade per request or use thread-local storage.",
    },
    {
      name: "Facade Without Error Aggregation",
      description:
        "The facade lets subsystem exceptions propagate raw to the client, exposing subsystem implementation details (SQL exceptions, HTTP status codes).",
      betterAlternative:
        "Catch subsystem-specific exceptions inside the facade and re-throw domain-specific errors. Map SQL errors to 'PaymentStorageError', not 'PsqlException'.",
    },
  ],
};

export default facadeData;
