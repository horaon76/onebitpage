import { PatternData } from "@/lib/patterns/types";

const adapterData: PatternData = {
  slug: "adapter",
  categorySlug: "structural",
  categoryLabel: "Structural",
  title: "Adapter Pattern",
  subtitle:
    "Convert the interface of a class into another interface that clients expect, allowing incompatible classes to work together seamlessly.",

  intent:
    "Bridge the gap between two incompatible interfaces without modifying either side. An adapter wraps an existing class (the adaptee) and translates calls from the client's expected interface into calls the adaptee understands. This is essential when integrating third-party libraries, legacy systems, or APIs that evolved independently — the adapter is the diplomatic translator between the two.",

  classDiagramSvg: `<svg viewBox="0 0 520 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 11px 'JetBrains Mono', monospace; }
    .s-member { font: 10px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-arr); }
    .s-dash { stroke-dasharray: 5,3; }
  </style>
  <defs>
    <marker id="a-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Target Interface -->
  <rect x="10" y="10" width="180" height="55" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">&lt;&lt;interface&gt;&gt; Target</text>
  <line x1="10" y1="33" x2="190" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+request(): Result</text>
  <!-- Adapter -->
  <rect x="10" y="110" width="180" height="65" class="s-box s-diagram-box"/>
  <text x="100" y="128" text-anchor="middle" class="s-title s-diagram-title">Adapter</text>
  <line x1="10" y1="133" x2="190" y2="133" class="s-diagram-line"/>
  <text x="20" y="150" class="s-member s-diagram-member">-adaptee: Adaptee</text>
  <text x="20" y="166" class="s-member s-diagram-member">+request(): Result</text>
  <!-- Adaptee -->
  <rect x="300" y="110" width="200" height="55" class="s-box s-diagram-box"/>
  <text x="400" y="128" text-anchor="middle" class="s-title s-diagram-title">Adaptee</text>
  <line x1="300" y1="133" x2="500" y2="133" class="s-diagram-line"/>
  <text x="310" y="150" class="s-member s-diagram-member">+specificRequest(): Data</text>
  <!-- Arrows -->
  <line x1="100" y1="110" x2="100" y2="65" class="s-arr s-diagram-arrow"/>
  <line x1="190" y1="140" x2="300" y2="140" class="s-arr s-diagram-arrow"/>
</svg>`,

  diagramExplanation:
    "The Client depends on the Target interface. The Adaptee has the functionality the client needs but exposes it through an incompatible interface (specificRequest instead of request). The Adapter implements Target, holds a reference to the Adaptee, and translates request() calls into specificRequest() calls — converting parameters and return types as needed.",

  diagramComponents: [
    {
      name: "Target (interface)",
      description:
        "The interface the client code expects. It defines the contract (request()) that all collaborators must implement. The client never depends on the Adaptee directly.",
    },
    {
      name: "Adapter",
      description:
        "Implements the Target interface and wraps an Adaptee instance. Its request() method translates parameters, delegates to the Adaptee's specificRequest(), and converts the result back to the Target's expected format.",
    },
    {
      name: "Adaptee",
      description:
        "An existing class with useful functionality but an incompatible interface. It cannot be modified (third-party library, legacy code). The Adapter bridges the gap without touching its code.",
    },
  ],

  solutionDetail:
    "**The Problem:** You have client code that expects interface A, and a library/service that provides interface B. The two are incompatible — different method names, parameter types, or return formats. You can't modify the library (it's third-party) and shouldn't modify the client (it works with all other A-compatible collaborators).\n\n**The Adapter Solution:** Create a wrapper class that implements interface A and internally delegates to interface B. The adapter translates between the two worlds — converting method calls, parameters, and return values.\n\n**How It Works:**\n\n1. **Define the Target interface**: The interface your client code already depends on.\n\n2. **Identify the Adaptee**: The existing class with the functionality you need but the wrong interface.\n\n3. **Create the Adapter**: Implement Target, hold a reference to Adaptee, and translate each Target method into Adaptee calls.\n\n4. **Inject the Adapter**: Pass the adapter to the client where it expects a Target. The client never knows it's talking to a wrapper.\n\n**Why It Shines:** Adapter is one of the most frequently used patterns in practice. Every time you integrate a third-party API, wrap a legacy system, or normalize data providers to a common interface, you're using Adapter. It follows the Open/Closed Principle — extend behavior without changing existing code.",

  characteristics: [
    "Enables collaboration between classes with incompatible interfaces without modifying either",
    "Object Adapter (composition) is preferred over Class Adapter (inheritance) for flexibility",
    "Follows the Single Responsibility Principle — adaption logic is isolated in its own class",
    "Two flavors: Object Adapter wraps an instance; Class Adapter inherits from the adaptee (less common)",
    "Often used at system boundaries — API gateways, database drivers, logging frameworks",
    "Can translate not just method signatures but also data formats (XML↔JSON, metric↔imperial)",
    "Should be thin — complex business logic in the adapter is a smell; delegate it to the adaptee or a service",
  ],

  useCases: [
    {
      id: 1,
      title: "Payment Gateway Integration",
      domain: "Fintech",
      description:
        "Your payment service uses a PaymentProcessor interface. When switching from Stripe to PayPal, the PayPal SDK has different method names and parameter structures.",
      whySingleton:
        "Adapter wraps PayPal's API behind PaymentProcessor. The rest of the codebase doesn't know or care which gateway is active.",
      code: `class PayPalAdapter implements PaymentProcessor {
  charge(amount: number, currency: string): Receipt {
    return this.paypal.makePayment({
      value: amount, curr: currency
    });
  }
}`,
    },
    {
      id: 2,
      title: "Legacy Database Migration",
      domain: "Enterprise / Backend",
      description:
        "A legacy Oracle database returns data as XML strings. The new service layer expects typed JSON objects. An adapter converts between the two formats.",
      whySingleton:
        "Adapter implements the modern Repository interface, internally parsing Oracle's XML responses into typed domain objects.",
      code: `class OracleAdapter implements UserRepository {
  findById(id: string): User {
    const xml = this.oracle.execQuery(id);
    return parseXmlToUser(xml);
  }
}`,
    },
    {
      id: 3,
      title: "Logging Framework Normalization",
      domain: "Backend Infrastructure",
      description:
        "Different libraries use different logging APIs (Winston, Bunyan, console). Your codebase uses a unified Logger interface. Adapters normalize each library.",
      whySingleton:
        "Each adapter implements Logger and delegates to the specific library. Swapping log backends requires changing one adapter injection.",
      code: `class WinstonAdapter implements Logger {
  info(msg: string): void {
    this.winston.log("info", msg);
  }
  error(msg: string, err?: Error): void {
    this.winston.log("error", msg, { error: err });
  }
}`,
    },
    {
      id: 4,
      title: "Cloud Provider Abstraction",
      domain: "DevOps / Multi-Cloud",
      description:
        "Your deployment tool uses a CloudStorage interface. AWS S3, GCP Cloud Storage, and Azure Blob have completely different SDKs. Adapters normalize them.",
      whySingleton:
        "S3Adapter, GCSAdapter, and AzureBlobAdapter each implement CloudStorage. Switching providers means changing one adapter, not the entire application.",
      code: `class S3Adapter implements CloudStorage {
  upload(path: string, data: Buffer): string {
    return this.s3.putObject({
      Bucket: this.bucket, Key: path, Body: data
    }).Location;
  }
}`,
    },
    {
      id: 5,
      title: "Unit Conversion Adapter",
      domain: "IoT / Manufacturing",
      description:
        "European sensors report in Celsius and meters. The US dashboard expects Fahrenheit and feet. An adapter sits between the sensor feed and the dashboard.",
      whySingleton:
        "Adapter implements the same SensorReading interface but converts units in-flight. No code changes on either side.",
      code: `class MetricToImperialAdapter implements SensorReading {
  getTemperature(): number {
    return this.sensor.getTemperature() * 9/5 + 32;
  }
  getDistance(): number {
    return this.sensor.getDistance() * 3.28084;
  }
}`,
    },
    {
      id: 6,
      title: "Third-Party Auth Provider",
      domain: "SaaS / Identity",
      description:
        "Your app uses an AuthProvider interface. When adding Auth0 support alongside existing OAuth, Auth0's SDK has different method signatures and token formats.",
      whySingleton:
        "Auth0Adapter implements AuthProvider, translating login(), getUser(), and refreshToken() to Auth0's specific API calls.",
      code: `class Auth0Adapter implements AuthProvider {
  login(credentials: Credentials): Token {
    const auth0Token = this.auth0.authenticate(
      credentials.email, credentials.password
    );
    return { accessToken: auth0Token.id_token };
  }
}`,
    },
    {
      id: 7,
      title: "Email Service Wrapper",
      domain: "Communication Platform",
      description:
        "Your notification system uses an EmailSender interface. When migrating from SMTP to SendGrid, the SendGrid API uses different parameters and callback styles.",
      whySingleton:
        "SendGridAdapter implements EmailSender, converting synchronous send() to SendGrid's async API and mapping response codes.",
      code: `class SendGridAdapter implements EmailSender {
  send(to: string, subject: string, body: string): void {
    this.sendgrid.send({
      personalizations: [{ to: [{ email: to }] }],
      subject, content: [{ type: "text/html", value: body }],
    });
  }
}`,
    },
    {
      id: 8,
      title: "Data Format Bridge",
      domain: "Data Engineering",
      description:
        "A data pipeline consumes Avro records. A new data source provides Protobuf messages. An adapter converts Protobuf to Avro at the ingestion boundary.",
      whySingleton:
        "ProtobufToAvroAdapter implements AvroSource and internally deserializes Protobuf, maps fields, and re-serializes as Avro.",
      code: `class ProtobufToAvroAdapter implements AvroSource {
  read(): AvroRecord {
    const proto = this.source.readProto();
    return mapProtoToAvro(proto);
  }
}`,
    },
    {
      id: 9,
      title: "ORM Query Interface",
      domain: "Backend / Database",
      description:
        "A codebase uses a generic QueryInterface. When adding Redis as a cache layer, Redis commands (GET, HGETALL) don't match the query interface (findById, findAll).",
      whySingleton:
        "RedisAdapter implements QueryInterface and translates findById into GET, findAll into KEYS + MGET, maintaining the familiar API.",
      code: `class RedisAdapter implements QueryInterface<User> {
  findById(id: string): User | null {
    const json = this.redis.get(\`user:\${id}\`);
    return json ? JSON.parse(json) : null;
  }
}`,
    },
    {
      id: 10,
      title: "Charting Library Migration",
      domain: "Frontend / Visualization",
      description:
        "Your dashboard uses a ChartRenderer interface with D3.js. When migrating to Plotly, all chart components depend on the D3-style API. An adapter wraps Plotly behind the existing interface.",
      whySingleton:
        "PlotlyAdapter implements ChartRenderer. Existing components call render(data, config) and the adapter translates to Plotly.newPlot().",
      code: `class PlotlyAdapter implements ChartRenderer {
  render(el: HTMLElement, data: ChartData): void {
    Plotly.newPlot(el, this.mapTraces(data), {
      margin: { t: 30 }, responsive: true,
    });
  }
}`,
    },
    {
      id: 11,
      title: "Message Queue Adapter",
      domain: "Microservices",
      description:
        "Your event system uses a MessageBroker interface with publish/subscribe. When switching from RabbitMQ to Kafka, the connection model and API differ completely.",
      whySingleton:
        "KafkaAdapter implements MessageBroker, translating publish() to Kafka producer calls and subscribe() to consumer group setup.",
      code: `class KafkaAdapter implements MessageBroker {
  publish(topic: string, msg: Message): void {
    this.producer.send({
      topic, messages: [{ value: JSON.stringify(msg) }]
    });
  }
}`,
    },
    {
      id: 12,
      title: "Testing Mock Adapter",
      domain: "Testing / DevOps",
      description:
        "Integration tests need to replace real HTTP clients with mock responses. An adapter wraps the mock library behind the same HttpClient interface.",
      whySingleton:
        "MockHttpAdapter implements HttpClient, returning pre-configured responses. Tests inject the adapter instead of the real client.",
      code: `class MockHttpAdapter implements HttpClient {
  get(url: string): Response {
    return this.responses.get(url) ?? { status: 404 };
  }
}`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Fintech — Payment Gateway Adapter",
      domain: "Fintech",
      problem:
        "A payment service defines a PaymentProcessor interface with charge(amount, currency, card). When adding PayPal as an alternative to Stripe, PayPal's SDK uses makePayment({value, currency, payerEmail}) with a different parameter structure and return format.",
      solution:
        "A PayPalAdapter implements PaymentProcessor and translates charge() calls into PayPal's makePayment() format, mapping parameters and converting the response back to the expected Receipt type.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-e1); }
  </style>
  <defs><marker id="a-e1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">PaymentProcessor</text>
  <line x1="10" y1="33" x2="190" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+charge(amt, curr): Receipt</text>
  <rect x="10" y="90" width="180" height="60" class="s-box s-diagram-box"/>
  <text x="100" y="108" text-anchor="middle" class="s-title s-diagram-title">PayPalAdapter</text>
  <line x1="10" y1="113" x2="190" y2="113" class="s-diagram-line"/>
  <text x="20" y="128" class="s-member s-diagram-member">-sdk: PayPalSDK</text>
  <text x="20" y="142" class="s-member s-diagram-member">+charge(amt, curr): Receipt</text>
  <rect x="260" y="90" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="350" y="108" text-anchor="middle" class="s-title s-diagram-title">PayPalSDK</text>
  <line x1="260" y1="113" x2="440" y2="113" class="s-diagram-line"/>
  <text x="270" y="130" class="s-member s-diagram-member">+makePayment(opts): PPResult</text>
  <line x1="100" y1="90" x2="100" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="190" y1="115" x2="260" y2="115" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class Receipt:
    transaction_id: str
    amount: float
    status: str

class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float, currency: str) -> Receipt: ...

# ── Third-party SDK (can't modify) ──
class PayPalSDK:
    def make_payment(self, value: float, curr: str, payer: str) -> dict:
        return {"id": "PP-12345", "value": value, "state": "approved"}

# ── Adapter ──
class PayPalAdapter(PaymentProcessor):
    def __init__(self, sdk: PayPalSDK, default_payer: str = "system"):
        self._sdk = sdk
        self._payer = default_payer

    def charge(self, amount: float, currency: str) -> Receipt:
        result = self._sdk.make_payment(amount, currency, self._payer)
        return Receipt(
            transaction_id=result["id"],
            amount=result["value"],
            status="success" if result["state"] == "approved" else "failed",
        )

# ── Usage ──
processor: PaymentProcessor = PayPalAdapter(PayPalSDK())
receipt = processor.charge(99.99, "USD")
print(receipt)`,
        Go: `package main

import "fmt"

type Receipt struct {
	TransactionID string
	Amount        float64
	Status        string
}

type PaymentProcessor interface {
	Charge(amount float64, currency string) Receipt
}

// ── Third-party SDK ──
type PayPalSDK struct{}

func (p *PayPalSDK) MakePayment(value float64, curr, payer string) map[string]any {
	return map[string]any{"id": "PP-12345", "value": value, "state": "approved"}
}

// ── Adapter ──
type PayPalAdapter struct {
	sdk   *PayPalSDK
	payer string
}

func NewPayPalAdapter(sdk *PayPalSDK) *PayPalAdapter {
	return &PayPalAdapter{sdk: sdk, payer: "system"}
}

func (a *PayPalAdapter) Charge(amount float64, currency string) Receipt {
	result := a.sdk.MakePayment(amount, currency, a.payer)
	status := "failed"
	if result["state"] == "approved" {
		status = "success"
	}
	return Receipt{
		TransactionID: result["id"].(string),
		Amount:        result["value"].(float64),
		Status:        status,
	}
}

func main() {
	var processor PaymentProcessor = NewPayPalAdapter(&PayPalSDK{})
	receipt := processor.Charge(99.99, "USD")
	fmt.Printf("%+v\\n", receipt)
}`,
        Java: `interface PaymentProcessor {
    Receipt charge(double amount, String currency);
}

record Receipt(String transactionId, double amount, String status) {}

// Third-party SDK (can't modify)
class PayPalSDK {
    Map<String, Object> makePayment(double value, String curr, String payer) {
        return Map.of("id", "PP-12345", "value", value, "state", "approved");
    }
}

// Adapter
class PayPalAdapter implements PaymentProcessor {
    private final PayPalSDK sdk;
    PayPalAdapter(PayPalSDK sdk) { this.sdk = sdk; }

    @Override
    public Receipt charge(double amount, String currency) {
        var result = sdk.makePayment(amount, currency, "system");
        return new Receipt(
            (String) result.get("id"), (double) result.get("value"),
            "approved".equals(result.get("state")) ? "success" : "failed"
        );
    }
}`,
        TypeScript: `interface Receipt {
  transactionId: string;
  amount: number;
  status: string;
}

interface PaymentProcessor {
  charge(amount: number, currency: string): Receipt;
}

// Third-party SDK (can't modify)
class PayPalSDK {
  makePayment(value: number, curr: string, payer: string) {
    return { id: "PP-12345", value, state: "approved" };
  }
}

// Adapter
class PayPalAdapter implements PaymentProcessor {
  constructor(private sdk: PayPalSDK, private payer = "system") {}

  charge(amount: number, currency: string): Receipt {
    const result = this.sdk.makePayment(amount, currency, this.payer);
    return {
      transactionId: result.id,
      amount: result.value,
      status: result.state === "approved" ? "success" : "failed",
    };
  }
}

// ── Usage ──
const processor: PaymentProcessor = new PayPalAdapter(new PayPalSDK());
const receipt = processor.charge(99.99, "USD");
console.log(receipt);`,
        Rust: `trait PaymentProcessor {
    fn charge(&self, amount: f64, currency: &str) -> Receipt;
}

#[derive(Debug)]
struct Receipt { transaction_id: String, amount: f64, status: String }

// Third-party SDK
struct PayPalSDK;
impl PayPalSDK {
    fn make_payment(&self, value: f64, _curr: &str, _payer: &str) -> (String, f64, String) {
        ("PP-12345".into(), value, "approved".into())
    }
}

// Adapter
struct PayPalAdapter { sdk: PayPalSDK }

impl PaymentProcessor for PayPalAdapter {
    fn charge(&self, amount: f64, currency: &str) -> Receipt {
        let (id, val, state) = self.sdk.make_payment(amount, currency, "system");
        Receipt {
            transaction_id: id, amount: val,
            status: if state == "approved" { "success".into() } else { "failed".into() },
        }
    }
}

fn main() {
    let processor: Box<dyn PaymentProcessor> = Box::new(PayPalAdapter { sdk: PayPalSDK });
    let receipt = processor.charge(99.99, "USD");
    println!("{:?}", receipt);
}`,
      },
      considerations: [
        "Error handling: map PayPal's error codes to your application's error types",
        "Logging: the adapter is a good place to log requests/responses for debugging integration issues",
        "Rate limiting: the adapter can add retry logic without affecting client code",
        "Each payment provider gets its own adapter — never put multi-provider logic in one adapter",
        "Consider async adapters for I/O-bound payment calls",
      ],
    },
    {
      id: 2,
      title: "Healthcare — HL7 to FHIR Adapter",
      domain: "Healthcare",
      problem:
        "A hospital's new patient portal expects FHIR (JSON-based) patient records. Legacy systems emit HL7v2 pipe-delimited messages (PID|DOE^JOHN|...). Converting the message format is needed at every integration point.",
      solution:
        "An HL7ToFHIRAdapter implements the FHIRPatientSource interface, internally parsing HL7v2 messages and constructing FHIR Patient resources.",
      classDiagramSvg: `<svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-e2); }
  </style>
  <defs><marker id="a-e2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="100" y="28" text-anchor="middle" class="s-title s-diagram-title">FHIRPatientSource</text>
  <line x1="10" y1="33" x2="190" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">+getPatient(id): FHIRPatient</text>
  <rect x="10" y="85" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="100" y="103" text-anchor="middle" class="s-title s-diagram-title">HL7ToFHIRAdapter</text>
  <line x1="10" y1="108" x2="190" y2="108" class="s-diagram-line"/>
  <text x="20" y="125" class="s-member s-diagram-member">+getPatient(id): FHIRPatient</text>
  <rect x="260" y="85" width="180" height="50" class="s-box s-diagram-box"/>
  <text x="350" y="103" text-anchor="middle" class="s-title s-diagram-title">HL7LegacySystem</text>
  <line x1="260" y1="108" x2="440" y2="108" class="s-diagram-line"/>
  <text x="270" y="125" class="s-member s-diagram-member">+query(id): string (HL7)</text>
  <line x1="100" y1="85" x2="100" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="190" y1="110" x2="260" y2="110" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class FHIRPatient:
    id: str
    family_name: str
    given_name: str
    birth_date: str

class FHIRPatientSource(ABC):
    @abstractmethod
    def get_patient(self, patient_id: str) -> FHIRPatient: ...

class HL7LegacySystem:
    def query(self, patient_id: str) -> str:
        return f"PID|{patient_id}|DOE^JOHN||19850101"

class HL7ToFHIRAdapter(FHIRPatientSource):
    def __init__(self, legacy: HL7LegacySystem):
        self._legacy = legacy

    def get_patient(self, patient_id: str) -> FHIRPatient:
        hl7 = self._legacy.query(patient_id)
        segments = hl7.split("|")
        names = segments[2].split("^")
        dob = segments[4]
        return FHIRPatient(
            id=segments[1],
            family_name=names[0],
            given_name=names[1] if len(names) > 1 else "",
            birth_date=f"{dob[:4]}-{dob[4:6]}-{dob[6:8]}",
        )

# ── Usage ──
source: FHIRPatientSource = HL7ToFHIRAdapter(HL7LegacySystem())
patient = source.get_patient("P12345")
print(patient)`,
        Go: `package main

import (
	"fmt"
	"strings"
)

type FHIRPatient struct {
	ID, FamilyName, GivenName, BirthDate string
}

type FHIRPatientSource interface {
	GetPatient(id string) FHIRPatient
}

type HL7LegacySystem struct{}
func (h *HL7LegacySystem) Query(id string) string {
	return fmt.Sprintf("PID|%s|DOE^JOHN||19850101", id)
}

type HL7ToFHIRAdapter struct{ legacy *HL7LegacySystem }

func (a *HL7ToFHIRAdapter) GetPatient(id string) FHIRPatient {
	hl7 := a.legacy.Query(id)
	parts := strings.Split(hl7, "|")
	names := strings.Split(parts[2], "^")
	dob := parts[4]
	return FHIRPatient{
		ID: parts[1], FamilyName: names[0], GivenName: names[1],
		BirthDate: dob[:4] + "-" + dob[4:6] + "-" + dob[6:8],
	}
}

func main() {
	var source FHIRPatientSource = &HL7ToFHIRAdapter{legacy: &HL7LegacySystem{}}
	patient := source.GetPatient("P12345")
	fmt.Printf("%+v\\n", patient)
}`,
        Java: `interface FHIRPatientSource {
    FHIRPatient getPatient(String id);
}

record FHIRPatient(String id, String familyName, String givenName, String birthDate) {}

class HL7LegacySystem {
    String query(String id) { return "PID|" + id + "|DOE^JOHN||19850101"; }
}

class HL7ToFHIRAdapter implements FHIRPatientSource {
    private final HL7LegacySystem legacy;
    HL7ToFHIRAdapter(HL7LegacySystem legacy) { this.legacy = legacy; }

    @Override public FHIRPatient getPatient(String id) {
        String[] parts = legacy.query(id).split("\\\\|");
        String[] names = parts[2].split("\\\\^");
        String dob = parts[4];
        return new FHIRPatient(parts[1], names[0], names[1],
            dob.substring(0,4)+"-"+dob.substring(4,6)+"-"+dob.substring(6,8));
    }
}`,
        TypeScript: `interface FHIRPatient {
  id: string; familyName: string; givenName: string; birthDate: string;
}
interface FHIRPatientSource {
  getPatient(id: string): FHIRPatient;
}

class HL7LegacySystem {
  query(id: string): string { return \`PID|\${id}|DOE^JOHN||19850101\`; }
}

class HL7ToFHIRAdapter implements FHIRPatientSource {
  constructor(private legacy: HL7LegacySystem) {}

  getPatient(id: string): FHIRPatient {
    const parts = this.legacy.query(id).split("|");
    const names = parts[2].split("^");
    const dob = parts[4];
    return {
      id: parts[1], familyName: names[0], givenName: names[1],
      birthDate: \`\${dob.slice(0,4)}-\${dob.slice(4,6)}-\${dob.slice(6,8)}\`,
    };
  }
}

const source: FHIRPatientSource = new HL7ToFHIRAdapter(new HL7LegacySystem());
console.log(source.getPatient("P12345"));`,
        Rust: `trait FhirPatientSource {
    fn get_patient(&self, id: &str) -> FhirPatient;
}

#[derive(Debug)]
struct FhirPatient { id: String, family: String, given: String, birth_date: String }

struct Hl7Legacy;
impl Hl7Legacy {
    fn query(&self, id: &str) -> String { format!("PID|{}|DOE^JOHN||19850101", id) }
}

struct Hl7ToFhirAdapter { legacy: Hl7Legacy }

impl FhirPatientSource for Hl7ToFhirAdapter {
    fn get_patient(&self, id: &str) -> FhirPatient {
        let hl7 = self.legacy.query(id);
        let parts: Vec<&str> = hl7.split('|').collect();
        let names: Vec<&str> = parts[2].split('^').collect();
        let dob = parts[4];
        FhirPatient {
            id: parts[1].into(), family: names[0].into(), given: names[1].into(),
            birth_date: format!("{}-{}-{}", &dob[..4], &dob[4..6], &dob[6..8]),
        }
    }
}

fn main() {
    let source = Hl7ToFhirAdapter { legacy: Hl7Legacy };
    println!("{:?}", source.get_patient("P12345"));
}`,
      },
      considerations: [
        "HL7v2 parsing is complex — consider using a dedicated HL7 parser library instead of string splitting",
        "FHIR resources have strict schemas — validate the converted resource",
        "Character encoding differences between HL7 (ASCII) and FHIR (UTF-8) need handling",
        "Error handling: malformed HL7 messages should produce clear diagnostic errors",
        "Consider bi-directional adapters if the legacy system also needs to receive FHIR data",
      ],
    },
    {
      id: 3,
      title: "DevOps — Cloud Storage Adapter",
      domain: "DevOps / Cloud",
      problem:
        "A backup service uses a CloudStorage interface with upload(), download(), and list(). The service must support AWS S3, GCP Cloud Storage, and Azure Blob — each with a completely different SDK.",
      solution:
        "Each cloud provider gets its own adapter implementing CloudStorage. A factory selects the appropriate adapter based on configuration. The backup service never knows which provider is active.",
      classDiagramSvg: `<svg viewBox="0 0 460 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-e3); }
  </style>
  <defs><marker id="a-e3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="140" y="10" width="180" height="65" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">CloudStorage</text>
  <line x1="140" y1="33" x2="320" y2="33" class="s-diagram-line"/>
  <text x="150" y="48" class="s-member s-diagram-member">+upload(path, data): url</text>
  <text x="150" y="62" class="s-member s-diagram-member">+download(path): bytes</text>
  <rect x="10" y="120" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="75" y="143" text-anchor="middle" class="s-title s-diagram-title">S3Adapter</text>
  <rect x="165" y="120" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="230" y="143" text-anchor="middle" class="s-title s-diagram-title">GCSAdapter</text>
  <rect x="320" y="120" width="130" height="36" class="s-box s-diagram-box"/>
  <text x="385" y="143" text-anchor="middle" class="s-title s-diagram-title">AzureAdapter</text>
  <line x1="75" y1="120" x2="190" y2="75" class="s-arr s-diagram-arrow"/>
  <line x1="230" y1="120" x2="230" y2="75" class="s-arr s-diagram-arrow"/>
  <line x1="385" y1="120" x2="270" y2="75" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class CloudStorage(ABC):
    @abstractmethod
    def upload(self, path: str, data: bytes) -> str: ...
    @abstractmethod
    def download(self, path: str) -> bytes: ...

class S3Adapter(CloudStorage):
    def __init__(self, bucket: str):
        self._bucket = bucket
        # self._client = boto3.client("s3")

    def upload(self, path: str, data: bytes) -> str:
        # self._client.put_object(Bucket=self._bucket, Key=path, Body=data)
        return f"s3://{self._bucket}/{path}"

    def download(self, path: str) -> bytes:
        # return self._client.get_object(...)["Body"].read()
        return b"mock-data"

class GCSAdapter(CloudStorage):
    def __init__(self, bucket: str):
        self._bucket = bucket

    def upload(self, path: str, data: bytes) -> str:
        # blob = self._bucket.blob(path); blob.upload_from_string(data)
        return f"gs://{self._bucket}/{path}"

    def download(self, path: str) -> bytes:
        return b"mock-data"

def create_storage(provider: str, bucket: str) -> CloudStorage:
    if provider == "aws": return S3Adapter(bucket)
    if provider == "gcp": return GCSAdapter(bucket)
    raise ValueError(f"Unknown provider: {provider}")

# ── Usage ──
storage = create_storage("aws", "my-backup-bucket")
url = storage.upload("backups/db.sql.gz", b"compressed-data")
print(url)`,
        Go: `package main

import "fmt"

type CloudStorage interface {
	Upload(path string, data []byte) string
	Download(path string) []byte
}

type S3Adapter struct{ Bucket string }
func (s *S3Adapter) Upload(path string, data []byte) string {
	return fmt.Sprintf("s3://%s/%s", s.Bucket, path)
}
func (s *S3Adapter) Download(path string) []byte { return []byte("data") }

type GCSAdapter struct{ Bucket string }
func (g *GCSAdapter) Upload(path string, data []byte) string {
	return fmt.Sprintf("gs://%s/%s", g.Bucket, path)
}
func (g *GCSAdapter) Download(path string) []byte { return []byte("data") }

func CreateStorage(provider, bucket string) CloudStorage {
	switch provider {
	case "aws": return &S3Adapter{Bucket: bucket}
	case "gcp": return &GCSAdapter{Bucket: bucket}
	default: panic("unknown provider")
	}
}

func main() {
	storage := CreateStorage("aws", "my-backup")
	fmt.Println(storage.Upload("db.sql.gz", []byte("data")))
}`,
        Java: `interface CloudStorage {
    String upload(String path, byte[] data);
    byte[] download(String path);
}

class S3Adapter implements CloudStorage {
    private final String bucket;
    S3Adapter(String bucket) { this.bucket = bucket; }

    @Override public String upload(String path, byte[] data) {
        return "s3://" + bucket + "/" + path;
    }
    @Override public byte[] download(String path) { return new byte[0]; }
}

class GCSAdapter implements CloudStorage {
    private final String bucket;
    GCSAdapter(String bucket) { this.bucket = bucket; }

    @Override public String upload(String path, byte[] data) {
        return "gs://" + bucket + "/" + path;
    }
    @Override public byte[] download(String path) { return new byte[0]; }
}`,
        TypeScript: `interface CloudStorage {
  upload(path: string, data: Buffer): string;
  download(path: string): Buffer;
}

class S3Adapter implements CloudStorage {
  constructor(private bucket: string) {}
  upload(path: string, data: Buffer): string {
    // this.s3.putObject({ Bucket: this.bucket, Key: path, Body: data });
    return \`s3://\${this.bucket}/\${path}\`;
  }
  download(path: string): Buffer { return Buffer.from("data"); }
}

class GCSAdapter implements CloudStorage {
  constructor(private bucket: string) {}
  upload(path: string, data: Buffer): string {
    return \`gs://\${this.bucket}/\${path}\`;
  }
  download(path: string): Buffer { return Buffer.from("data"); }
}

function createStorage(provider: string, bucket: string): CloudStorage {
  if (provider === "aws") return new S3Adapter(bucket);
  if (provider === "gcp") return new GCSAdapter(bucket);
  throw new Error(\`Unknown provider: \${provider}\`);
}

const storage = createStorage("aws", "my-backup");
console.log(storage.upload("db.sql.gz", Buffer.from("data")));`,
        Rust: `trait CloudStorage {
    fn upload(&self, path: &str, data: &[u8]) -> String;
    fn download(&self, path: &str) -> Vec<u8>;
}

struct S3Adapter { bucket: String }
impl CloudStorage for S3Adapter {
    fn upload(&self, path: &str, _data: &[u8]) -> String {
        format!("s3://{}/{}", self.bucket, path)
    }
    fn download(&self, _path: &str) -> Vec<u8> { vec![] }
}

struct GCSAdapter { bucket: String }
impl CloudStorage for GCSAdapter {
    fn upload(&self, path: &str, _data: &[u8]) -> String {
        format!("gs://{}/{}", self.bucket, path)
    }
    fn download(&self, _path: &str) -> Vec<u8> { vec![] }
}

fn create_storage(provider: &str, bucket: &str) -> Box<dyn CloudStorage> {
    match provider {
        "aws" => Box::new(S3Adapter { bucket: bucket.into() }),
        "gcp" => Box::new(GCSAdapter { bucket: bucket.into() }),
        _ => panic!("Unknown provider"),
    }
}

fn main() {
    let storage = create_storage("aws", "my-backup");
    println!("{}", storage.upload("db.sql.gz", b"data"));
}`,
      },
      considerations: [
        "Adapter + Factory combination: factory selects the adapter, adapter normalizes the interface",
        "Error mapping: each cloud provider has different error codes — adapters should normalize them",
        "Consider async upload/download for large files",
        "Multipart upload support may require extending the CloudStorage interface",
        "Integration tests should run against each adapter with mock SDKs",
      ],
    },
    {
      id: 4,
      title: "E-Commerce — External Shipping API Adapter",
      domain: "E-Commerce / Logistics",
      problem:
        "An e-commerce platform calculates shipping rates via a ShippingCalculator interface. When adding FedEx rates alongside UPS, FedEx's SOAP API returns XML with nested rate structures completely different from the expected format.",
      solution:
        "A FedExAdapter implements ShippingCalculator, parses FedEx XML responses, and returns normalized ShippingRate objects matching the platform's interface.",
      classDiagramSvg: `<svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-e4); }
  </style>
  <defs><marker id="a-e4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="130" y="10" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="230" y="28" text-anchor="middle" class="s-title s-diagram-title">ShippingCalculator</text>
  <line x1="130" y1="33" x2="330" y2="33" class="s-diagram-line"/>
  <text x="140" y="50" class="s-member s-diagram-member">+getRate(pkg): ShippingRate[]</text>
  <rect x="30" y="100" width="160" height="36" class="s-box s-diagram-box"/>
  <text x="110" y="123" text-anchor="middle" class="s-title s-diagram-title">UPSAdapter</text>
  <rect x="270" y="100" width="160" height="36" class="s-box s-diagram-box"/>
  <text x="350" y="123" text-anchor="middle" class="s-title s-diagram-title">FedExAdapter</text>
  <line x1="110" y1="100" x2="200" y2="60" class="s-arr s-diagram-arrow"/>
  <line x1="350" y1="100" x2="260" y2="60" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List

@dataclass
class ShippingRate:
    carrier: str
    service: str
    price: float
    days: int

class ShippingCalculator(ABC):
    @abstractmethod
    def get_rates(self, weight_kg: float, dest_zip: str) -> List[ShippingRate]: ...

class FedExSOAPClient:
    def rate_request(self, weight: float, dest: str) -> str:
        return f"<rate><svc>GROUND</svc><amt>12.99</amt><transit>5</transit></rate>"

class FedExAdapter(ShippingCalculator):
    def __init__(self, client: FedExSOAPClient):
        self._client = client

    def get_rates(self, weight_kg: float, dest_zip: str) -> List[ShippingRate]:
        xml = self._client.rate_request(weight_kg * 2.205, dest_zip)  # kg→lb
        # Simplified XML parsing
        return [ShippingRate(carrier="FedEx", service="Ground", price=12.99, days=5)]

# ── Usage ──
calc: ShippingCalculator = FedExAdapter(FedExSOAPClient())
rates = calc.get_rates(5.0, "94105")
for r in rates: print(f"{r.carrier} {r.service}: \${r.price} ({r.days} days)")`,
        Go: `package main

import "fmt"

type ShippingRate struct {
	Carrier, Service string
	Price            float64
	Days             int
}

type ShippingCalculator interface {
	GetRates(weightKg float64, destZip string) []ShippingRate
}

type FedExSOAP struct{}
func (f *FedExSOAP) RateRequest(weightLb float64, dest string) string { return "<rate>...</rate>" }

type FedExAdapter struct{ client *FedExSOAP }
func (a *FedExAdapter) GetRates(weightKg float64, destZip string) []ShippingRate {
	_ = a.client.RateRequest(weightKg*2.205, destZip)
	return []ShippingRate{{Carrier: "FedEx", Service: "Ground", Price: 12.99, Days: 5}}
}

func main() {
	var calc ShippingCalculator = &FedExAdapter{client: &FedExSOAP{}}
	for _, r := range calc.GetRates(5.0, "94105") {
		fmt.Printf("%s %s: $%.2f (%d days)\\n", r.Carrier, r.Service, r.Price, r.Days)
	}
}`,
        Java: `interface ShippingCalculator {
    List<ShippingRate> getRates(double weightKg, String destZip);
}

record ShippingRate(String carrier, String service, double price, int days) {}

class FedExAdapter implements ShippingCalculator {
    private final FedExSOAPClient client;
    FedExAdapter(FedExSOAPClient client) { this.client = client; }

    @Override public List<ShippingRate> getRates(double weightKg, String destZip) {
        String xml = client.rateRequest(weightKg * 2.205, destZip);
        return List.of(new ShippingRate("FedEx", "Ground", 12.99, 5));
    }
}`,
        TypeScript: `interface ShippingRate { carrier: string; service: string; price: number; days: number; }
interface ShippingCalculator { getRates(weightKg: number, destZip: string): ShippingRate[]; }

class FedExSOAPClient {
  rateRequest(weightLb: number, dest: string): string { return "<rate>...</rate>"; }
}

class FedExAdapter implements ShippingCalculator {
  constructor(private client: FedExSOAPClient) {}

  getRates(weightKg: number, destZip: string): ShippingRate[] {
    const xml = this.client.rateRequest(weightKg * 2.205, destZip);
    return [{ carrier: "FedEx", service: "Ground", price: 12.99, days: 5 }];
  }
}

const calc: ShippingCalculator = new FedExAdapter(new FedExSOAPClient());
calc.getRates(5.0, "94105").forEach(r => console.log(\`\${r.carrier}: $\${r.price}\`));`,
        Rust: `trait ShippingCalculator {
    fn get_rates(&self, weight_kg: f64, dest_zip: &str) -> Vec<ShippingRate>;
}

#[derive(Debug)]
struct ShippingRate { carrier: String, service: String, price: f64, days: u32 }

struct FedExAdapter;
impl ShippingCalculator for FedExAdapter {
    fn get_rates(&self, weight_kg: f64, dest_zip: &str) -> Vec<ShippingRate> {
        let _weight_lb = weight_kg * 2.205;
        vec![ShippingRate {
            carrier: "FedEx".into(), service: "Ground".into(),
            price: 12.99, days: 5,
        }]
    }
}

fn main() {
    let calc: Box<dyn ShippingCalculator> = Box::new(FedExAdapter);
    for r in calc.get_rates(5.0, "94105") { println!("{:?}", r); }
}`,
      },
      considerations: [
        "Unit conversion (kg↔lb, cm↔in) is a common adaption concern for shipping APIs",
        "SOAP↔REST bridging: FedEx uses SOAP, UPS has REST — adapters hide this difference",
        "Caching: shipping rate requests are expensive; adapter can cache results by weight+destination",
        "Timeout handling: external API calls need configurable timeouts in the adapter",
        "Consider async adapters to query multiple carriers in parallel",
      ],
    },
    {
      id: 5,
      title: "Frontend — Legacy jQuery Plugin Adapter",
      domain: "Frontend / Migration",
      problem:
        "A React application needs to use a legacy jQuery datepicker plugin. React expects components with props and controlled state; jQuery plugins manipulate the DOM directly with $(el).datepicker({options}).",
      solution:
        "A React wrapper component (adapter) bridges the two worlds: it renders a container div, initializes the jQuery plugin in useEffect, and exposes the plugin's events as React prop callbacks.",
      classDiagramSvg: `<svg viewBox="0 0 460 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:460px">
  <style>
    .s-box { rx:6; }
    .s-title { font: bold 10px 'JetBrains Mono', monospace; }
    .s-member { font: 9px 'JetBrains Mono', monospace; }
    .s-arr { stroke-width:1.2; fill:none; marker-end:url(#a-e5); }
  </style>
  <defs><marker id="a-e5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" class="s-arrow-head"/></marker></defs>
  <rect x="10" y="10" width="200" height="50" class="s-box s-diagram-box"/>
  <text x="110" y="28" text-anchor="middle" class="s-title s-diagram-title">DatePickerAdapter</text>
  <line x1="10" y1="33" x2="210" y2="33" class="s-diagram-line"/>
  <text x="20" y="50" class="s-member s-diagram-member">Props: value, onChange</text>
  <rect x="260" y="10" width="190" height="50" class="s-box s-diagram-box"/>
  <text x="355" y="28" text-anchor="middle" class="s-title s-diagram-title">jQuery Datepicker</text>
  <line x1="260" y1="33" x2="450" y2="33" class="s-diagram-line"/>
  <text x="270" y="50" class="s-member s-diagram-member">$(el).datepicker(opts)</text>
  <line x1="210" y1="35" x2="260" y2="35" class="s-arr s-diagram-arrow"/>
</svg>`,
      code: {
        Python: `# N/A for Python — this is a frontend-specific example
# See TypeScript implementation below`,
        Go: `// N/A for Go — this is a frontend-specific example
// See TypeScript implementation below`,
        Java: `// N/A for Java — this is a frontend-specific example
// See TypeScript implementation below`,
        TypeScript: `import React, { useRef, useEffect, useCallback } from "react";

// Legacy jQuery plugin type (can't modify)
declare global {
  interface JQuery {
    datepicker(opts?: { onSelect?: (date: string) => void }): JQuery;
    datepicker(method: "setDate", date: string): JQuery;
    datepicker(method: "destroy"): JQuery;
  }
}

// Adapter: wraps jQuery plugin as a React component
interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  format?: string;
}

const DatePickerAdapter: React.FC<DatePickerProps> = ({ value, onChange, format = "yy-mm-dd" }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const $el = $(ref.current!);
    $el.datepicker({
      onSelect: (date: string) => onChange(date),
    });
    return () => { $el.datepicker("destroy"); };
  }, [onChange]);

  useEffect(() => {
    $(ref.current!).datepicker("setDate", value);
  }, [value]);

  return <input ref={ref} />;
};

// ── Usage in React ──
// <DatePickerAdapter value={date} onChange={setDate} />`,
        Rust: `// N/A for Rust — this is a frontend-specific example
// See TypeScript implementation above`,
      },
      considerations: [
        "useEffect cleanup must destroy the jQuery plugin to prevent memory leaks",
        "Prop changes (value) need to sync with the jQuery plugin's internal state",
        "Event bridging: jQuery events → React callbacks require careful wiring",
        "Consider creating a general-purpose jQuery plugin adapter HOC for multiple plugins",
        "Plan to eventually replace the adapter with a native React component",
      ],
    },
  ],

  variantsTabLabel: "Implementation Approaches",
  variantsBestPick:
    "Object Adapter (composition) is the standard choice for almost all situations. It's more flexible than Class Adapter because it can wrap any subclass of the adaptee. Use Class Adapter only when you need to override adaptee behavior and your language supports multiple inheritance.",

  variants: [
    {
      id: 1,
      name: "Object Adapter (Composition)",
      description:
        "The adapter holds a reference to the adaptee and delegates calls to it. This is the most common and flexible approach — the adapter can wrap any subclass of the adaptee without changes.",
      code: {
        Python: `class EuropeanSocket:
    def voltage(self) -> int: return 220
    def plug_type(self) -> str: return "Type C"

class USSocketAdapter:
    def __init__(self, socket: EuropeanSocket):
        self._socket = socket

    def voltage(self) -> int: return 110  # step-down
    def plug_type(self) -> str: return "Type A"`,
        Go: `type USSocket interface { Voltage() int }

type EuropeanSocket struct{}
func (e *EuropeanSocket) Voltage() int { return 220 }

type Adapter struct{ eu *EuropeanSocket }
func (a *Adapter) Voltage() int { return a.eu.Voltage() / 2 }`,
        Java: `class USSocketAdapter implements USSocket {
    private final EuropeanSocket eu;
    USSocketAdapter(EuropeanSocket eu) { this.eu = eu; }
    public int voltage() { return eu.voltage() / 2; }
}`,
        TypeScript: `class USSocketAdapter implements USSocket {
  constructor(private eu: EuropeanSocket) {}
  voltage(): number { return this.eu.voltage() / 2; }
}`,
        Rust: `struct Adapter { eu: EuropeanSocket }
impl USSocket for Adapter {
    fn voltage(&self) -> i32 { self.eu.voltage() / 2 }
}`,
      },
      pros: [
        "Works with any subclass of the adaptee — no inheritance coupling",
        "Can adapt multiple adaptees by holding multiple references",
        "Preferred in languages without multiple inheritance",
      ],
      cons: [
        "Requires forwarding each method explicitly — can be verbose for wide interfaces",
        "Cannot override adaptee methods directly — need wrapper logic",
      ],
    },
    {
      id: 2,
      name: "Class Adapter (Inheritance)",
      description:
        "The adapter inherits from both the Target interface and the Adaptee class. It overrides the Target's method to call inherited Adaptee methods. Only works in languages with multiple inheritance (C++, Python).",
      code: {
        Python: `from abc import ABC, abstractmethod

class Target(ABC):
    @abstractmethod
    def request(self) -> str: ...

class Adaptee:
    def specific_request(self) -> str:
        return "adaptee data"

class ClassAdapter(Adaptee, Target):
    def request(self) -> str:
        return self.specific_request().upper()

# Usage
adapter = ClassAdapter()
print(adapter.request())  # "ADAPTEE DATA"`,
        Go: `// Go doesn't support class adapter (no inheritance)
// Use object adapter with embedding instead
type Adaptee struct{}
func (a Adaptee) SpecificRequest() string { return "data" }

type Adapter struct{ Adaptee }
func (a Adapter) Request() string { return a.SpecificRequest() }`,
        Java: `// Java: single inheritance limits class adapters
// Use abstract class + interface
abstract class Adaptee {
    String specificRequest() { return "data"; }
}
interface Target { String request(); }

class ClassAdapter extends Adaptee implements Target {
    public String request() { return specificRequest().toUpperCase(); }
}`,
        TypeScript: `// TypeScript doesn't support multiple inheritance
// Use mixins or object adapter instead
class Adaptee { specificRequest(): string { return "data"; } }

class ClassAdapter extends Adaptee {
  request(): string { return this.specificRequest().toUpperCase(); }
}`,
        Rust: `// Rust doesn't support inheritance
// Use trait implementation with delegation
struct Adaptee;
impl Adaptee { fn specific_request(&self) -> String { "data".into() } }

struct Adapter(Adaptee);
impl Adapter { fn request(&self) -> String { self.0.specific_request().to_uppercase() } }`,
      },
      pros: [
        "No delegation boilerplate — directly inherits adaptee methods",
        "Can override adaptee behavior if needed",
        "Slightly less code than object adapter",
      ],
      cons: [
        "Requires multiple inheritance — not available in Java, C#, Go, Rust",
        "Tightly coupled to one specific adaptee class — can't adapt subclasses",
        "Fragile base class problem — changes to adaptee break the adapter",
      ],
    },
    {
      id: 3,
      name: "Functional Adapter (Lambda/Closure)",
      description:
        "When the interface is a single method (functional interface), use a lambda or function to adapt one signature to another. No class needed — just a function that wraps the call.",
      code: {
        Python: `from typing import Callable

# Target expects (str) -> int
Comparator = Callable[[str], int]

# Adaptee has different signature
def case_insensitive_length(s: str) -> int:
    return len(s.lower().strip())

# Adapter is just a lambda
adapter: Comparator = lambda s: case_insensitive_length(s)
print(adapter("  Hello  "))  # 5`,
        Go: `type Comparator func(string) int

func caseInsensitiveLen(s string) int {
	return len(strings.TrimSpace(strings.ToLower(s)))
}

// Adapter is just a function assignment
var adapter Comparator = func(s string) int {
	return caseInsensitiveLen(s)
}`,
        Java: `// Java functional interface — adapt with lambda
interface Comparator { int compare(String s); }

class Legacy { static int caseInsLen(String s) { return s.trim().toLowerCase().length(); } }

Comparator adapter = Legacy::caseInsLen;
System.out.println(adapter.compare("  Hello  ")); // 5`,
        TypeScript: `type Comparator = (s: string) => number;

function caseInsensitiveLength(s: string): number {
  return s.toLowerCase().trim().length;
}

// Adapter is just a function reference
const adapter: Comparator = caseInsensitiveLength;
console.log(adapter("  Hello  ")); // 5`,
        Rust: `fn case_insensitive_len(s: &str) -> usize {
    s.to_lowercase().trim().len()
}

// Adapter is a closure
let adapter: Box<dyn Fn(&str) -> usize> = Box::new(|s| case_insensitive_len(s));
println!("{}", adapter("  Hello  ")); // 5`,
      },
      pros: [
        "Zero boilerplate — no adapter class needed",
        "Perfect for single-method interfaces (SAM types, callbacks)",
        "Composes well with functional programming patterns",
      ],
      cons: [
        "Only works for single-method interfaces — multi-method interfaces need a class",
        "Less discoverable — no named class in the codebase",
        "Can't hold state unless using closures with captured variables",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "Flexibility", "Boilerplate", "Language Support", "Best For",
  ],
  comparisonRows: [
    ["Object Adapter", "High (any subclass)", "Medium", "All languages", "Standard choice for most cases"],
    ["Class Adapter", "Low (one class)", "Low", "Multiple inheritance only", "Overriding adaptee behavior"],
    ["Functional Adapter", "High", "Minimal", "Languages with lambdas", "Single-method interfaces"],
  ],

  summary: [
    { aspect: "Pattern Type", detail: "Structural" },
    {
      aspect: "Key Benefit",
      detail:
        "Enables incompatible interfaces to collaborate without modifying either side — essential for third-party integration",
    },
    {
      aspect: "Common Pitfall",
      detail:
        "Putting business logic in the adapter — it should only translate, not transform data or make decisions",
    },
    {
      aspect: "vs. Facade",
      detail:
        "Adapter makes an existing interface compatible; Facade creates a new simplified interface over a complex subsystem",
    },
    {
      aspect: "vs. Decorator",
      detail:
        "Adapter changes the interface; Decorator adds behavior while keeping the same interface",
    },
    {
      aspect: "When to Use",
      detail:
        "Integrating third-party libraries, wrapping legacy systems, normalizing multiple data sources, or migrating between APIs",
    },
    {
      aspect: "When NOT to Use",
      detail:
        "When you control both sides and can change one interface to match the other — an adapter adds unnecessary indirection",
    },
    {
      aspect: "Related Patterns",
      detail:
        "Bridge (designed up-front for abstraction/implementation separation), Decorator (same interface, added behavior), Proxy (same interface, controlled access)",
    },
  ],

  antiPatterns: [
    {
      name: "God Adapter",
      description:
        "A single adapter that wraps multiple unrelated adaptees, translating between several different interfaces. It becomes a large, tangled class that violates SRP.",
      betterAlternative:
        "One adapter per adaptee. If multiple adapters share logic, extract it into a utility class they both use.",
    },
    {
      name: "Business Logic in Adapter",
      description:
        "The adapter not only translates interfaces but also adds validation, transformation, or business rules. This makes the adapter a hidden service that's hard to test and maintain.",
      betterAlternative:
        "Keep adapters thin — translate only. Business logic belongs in services or domain models that sit between the client and the adapter.",
    },
    {
      name: "Adapting What You Own",
      description:
        "Creating an adapter for code you can modify. If you control both interfaces, just change one to match the other — the adapter adds unnecessary indirection.",
      betterAlternative:
        "Modify the adaptee's interface directly if you own it. Use Adapter only for code you can't change (third-party, legacy, external APIs).",
    },
    {
      name: "Leaky Adapter",
      description:
        "The adapter exposes adaptee-specific types, exceptions, or behavior through the Target interface. Clients become coupled to the adaptee despite the adapter.",
      betterAlternative:
        "Map all types fully — catch adaptee exceptions and wrap them in Target-compatible errors. Never let adaptee types leak through the adapter boundary.",
    },
    {
      name: "Adapter Instead of Strategy",
      description:
        "Using adapter to switch between interchangeable implementations that already share the same intent. If the implementations serve the same purpose, they should implement the same interface directly.",
      betterAlternative:
        "Use Strategy pattern when implementations are interchangeable and designed together. Use Adapter only when the interfaces were designed independently and are structurally incompatible.",
    },
  ],
};

export default adapterData;
