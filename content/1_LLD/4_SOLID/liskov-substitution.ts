import { PatternData } from "@/lib/patterns/types";

const liskovSubstitutionData: PatternData = {
  slug: "liskov-substitution",
  categorySlug: "solid",
  categoryLabel: "SOLID",
  title: "Liskov Substitution Principle (LSP)",
  subtitle:
    "Subtypes must be substitutable for their base types without altering the correctness of the program.",

  intent:
    "If a program uses a base type, any subtype should be usable in its place without breaking behavior. A SavingsAccount that throws an exception on withdraw() when the base Account promises withdraw() will work — that's a violation. Code that depends on Account will crash when given a SavingsAccount.\n\nThe Liskov Substitution Principle formalizes this: if S is a subtype of T, then objects of type T can be replaced with objects of type S without altering the desirable properties (correctness, task performed, etc.) of the program.\n\nLSP goes beyond syntax (implementing the right methods) to semantics (honoring the contract). A subtype must:\n- Accept at least the same range of inputs (same or weaker preconditions)\n- Return results within the expected range (same or stronger postconditions)\n- Not throw unexpected exceptions\n- Maintain the invariants of the base type\n\nViolating LSP leads to defensive instanceof checks, unexpected runtime exceptions, and code that's afraid to use polymorphism.",

  classDiagramSvg: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ls-box { rx:6; }
    .ls-title { font: bold 11px 'JetBrains Mono', monospace; }
    .ls-member { font: 10px 'JetBrains Mono', monospace; }
    .ls-arr { stroke-width:1.2; fill:none; stroke-dasharray:5,3; }
    .ls-note { font: italic 9px 'JetBrains Mono', monospace; }
  </style>
  <defs>
    <marker id="ls-tri" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
      <path d="M0,0 L0,8 L10,4 z" class="s-arrow-head"/>
    </marker>
  </defs>
  <!-- Good hierarchy -->
  <text x="130" y="15" text-anchor="middle" class="ls-note s-diagram-title">✓ LSP-Compliant</text>
  <rect x="50" y="25" width="160" height="50" class="ls-box s-diagram-box"/>
  <text x="130" y="42" text-anchor="middle" class="ls-title s-diagram-title">WithdrawableAccount</text>
  <line x1="50" y1="48" x2="210" y2="48" class="s-diagram-line"/>
  <text x="58" y="64" class="ls-member s-diagram-member">+withdraw(amount)</text>
  <rect x="10" y="110" width="100" height="35" class="ls-box s-diagram-box"/>
  <text x="60" y="132" text-anchor="middle" class="ls-title s-diagram-title">Checking</text>
  <rect x="120" y="110" width="100" height="35" class="ls-box s-diagram-box"/>
  <text x="170" y="132" text-anchor="middle" class="ls-title s-diagram-title">Savings</text>
  <line x1="60" y1="110" x2="120" y2="75" class="ls-arr s-diagram-arrow" marker-end="url(#ls-tri)"/>
  <line x1="170" y1="110" x2="140" y2="75" class="ls-arr s-diagram-arrow" marker-end="url(#ls-tri)"/>
  <!-- Bad hierarchy -->
  <text x="390" y="15" text-anchor="middle" class="ls-note s-diagram-title">✗ LSP Violation</text>
  <rect x="310" y="25" width="160" height="50" class="ls-box s-diagram-box"/>
  <text x="390" y="42" text-anchor="middle" class="ls-title s-diagram-title">Account</text>
  <line x1="310" y1="48" x2="470" y2="48" class="s-diagram-line"/>
  <text x="318" y="64" class="ls-member s-diagram-member">+withdraw(amount)</text>
  <rect x="310" y="110" width="160" height="50" class="ls-box s-diagram-box"/>
  <text x="390" y="128" text-anchor="middle" class="ls-title s-diagram-title">FixedDeposit</text>
  <line x1="310" y1="134" x2="470" y2="134" class="s-diagram-line"/>
  <text x="318" y="150" class="ls-member s-diagram-member">+withdraw(): THROWS!</text>
  <line x1="390" y1="110" x2="390" y2="75" class="ls-arr s-diagram-arrow" marker-end="url(#ls-tri)"/>
  <text x="390" y="185" text-anchor="middle" class="ls-note s-diagram-member">FixedDeposit breaks withdraw contract</text>
</svg>`,

  diagramExplanation:
    "Left: LSP-compliant hierarchy. WithdrawableAccount promises withdraw() works, and both Checking and Savings honor that contract. Right: LSP violation. Account promises withdraw(), but FixedDeposit throws an exception — breaking the contract. Code that calls withdraw() on an Account will crash when given a FixedDeposit. The fix: don't make FixedDeposit extend Account if it can't honor the withdraw() contract.",

  diagramComponents: [
    {
      name: "WithdrawableAccount (Good)",
      description:
        "The base type that promises withdraw() works. Only subtypes that can truly withdraw should extend this. The contract is: calling withdraw() with a valid amount will succeed.",
    },
    {
      name: "Checking / Savings (Good)",
      description:
        "Both honor the withdraw() contract. Savings may have limits (e.g., max 6/month) but the method still works. Withdrawals succeed within the stated constraints.",
    },
    {
      name: "FixedDeposit (Bad)",
      description:
        "Extends Account but throws on withdraw(). This breaks the Liskov contract. Code using Account polymorphism will fail when given a FixedDeposit. FixedDeposit should NOT extend a type that promises withdrawal.",
    },
  ],

  solutionDetail:
    "**The Problem:** Subclasses override base class methods with behavior that violates the contract — throwing exceptions, returning unexpected types, ignoring parameters, or changing invariants. Code that depends on the base type crashes at runtime.\n\n**The LSP Solution:** Design hierarchies so subtypes honor the base type's contract — not just its syntax, but its behavioral guarantees.\n\n**How It Works:**\n\n1. **Define the contract clearly**: What does the base type promise? Document preconditions (what inputs are accepted), postconditions (what the method guarantees on return), and invariants (what's always true about the type).\n\n2. **Subtypes strengthen postconditions, weaken preconditions**: A subtype can accept *more* inputs (weaker preconditions) and guarantee *more specific* results (stronger postconditions), but never the reverse.\n\n3. **Don't inherit just for code reuse**: Inheritance means 'is-a' — the subtype IS the base type in every behavioral sense. If FixedDeposit isn't a withdrawable account, don't make it one.\n\n4. **Prefer composition over inheritance**: If a type shares some but not all behavior, use composition to share the common parts rather than inheritance.\n\n5. **Redesign the hierarchy**: Split Account into WithdrawableAccount and NonWithdrawableAccount (or ReadOnlyAccount). FixedDeposit extends NonWithdrawableAccount.\n\n**Key Insight:** The \"is-a\" test must be behavioral, not lexical. A Square is NOT a Rectangle if setting width must also set height — it violates the Rectangle contract that width and height are independent.",

  characteristics: [
    "Subtypes honor the base type's behavioral contract, not just its type signature",
    "Preconditions can only be weakened (accept more), postconditions can only be strengthened (guarantee more)",
    "No surprise exceptions — if the base type doesn't throw, neither should the subtype",
    "Invariants of the base type must be preserved by all subtypes",
    "instanceof / type-checking in client code is a code smell suggesting LSP violation",
    "The 'is-a' relationship is behavioral, not taxonomic — a Square is NOT a Rectangle",
    "Composition over inheritance is often the fix for LSP violations",
  ],

  useCases: [
    {
      id: 1,
      title: "Bank Account Hierarchy",
      domain: "Fintech",
      description:
        "Checking, savings, and money market accounts all honor the withdraw() contract. Fixed deposits DON'T — so they extend a separate NonWithdrawableAccount type.",
      whySingleton:
        "Without LSP, code that loop-withdraws from Account[] will crash on FixedDeposit. Restructuring the hierarchy prevents this while keeping polymorphism safe.",
      code: `// BAD: FixedDeposit extends Account but throws on withdraw()
// GOOD: Split into WithdrawableAccount and NonWithdrawableAccount
interface WithdrawableAccount { withdraw(amount): void; }
class Checking implements WithdrawableAccount { withdraw(a) { ... } }
class FixedDeposit /* does NOT implement WithdrawableAccount */ { }`,
    },
    {
      id: 2,
      title: "Medical Document Rendering",
      domain: "Healthcare",
      description:
        "All document types (LabReport, DischargeSummary, ImagingReport) implement Document.render() returning HTML. None throws or returns null — the contract is honored uniformly.",
      whySingleton:
        "The document viewer calls render() on Document[]. If ImagingReport returned null or threw, the viewer would crash. LSP ensures every document renders correctly.",
      code: `interface Document { render(): string; /* always returns valid HTML */ }
class LabReport implements Document { render() { return "<h1>Lab</h1>..."; } }
class DischargeSummary implements Document { render() { return "<h1>Discharge</h1>..."; } }
class ImagingReport implements Document { render() { return "<h1>Imaging</h1>..."; } }`,
    },
    {
      id: 3,
      title: "Shape Area Calculation",
      domain: "Geometry / Education",
      description:
        "All shapes implement area(). A Square that overrides setWidth() to also set height violates the Rectangle contract. Instead, Square and Rectangle are siblings, not parent-child.",
      whySingleton:
        "If Rectangle.setWidth() promises height is unchanged, Square violating this breaks code that resizes rectangles. Making them siblings with a common Shape interface solves it.",
      code: `// BAD: Square extends Rectangle but setWidth() changes height too
// GOOD: Both implement Shape independently
interface Shape { area(): number; }
class Rectangle implements Shape { constructor(w, h) { } area() { return w * h; } }
class Square implements Shape { constructor(side) { } area() { return side * side; } }`,
    },
    {
      id: 4,
      title: "Collection Immutability",
      domain: "Data Structures",
      description:
        "An ImmutableList extending List but throwing on add() violates LSP. Instead, ImmutableList implements ReadOnlyList (no add/remove), and List extends ReadOnlyList.",
      whySingleton:
        "Code expecting List.add() to work will crash with ImmutableList. Restructuring: ReadOnlyList (read ops) ← List (read + write). ImmutableList implements ReadOnlyList only.",
      code: `interface ReadOnlyList<T> { get(i): T; size(): number; }
interface MutableList<T> extends ReadOnlyList<T> { add(item): void; }
class ImmutableList<T> implements ReadOnlyList<T> { get(i) {...} size() {...} }
class ArrayList<T> implements MutableList<T> { get(i) {...} add(item) {...} }`,
    },
    {
      id: 5,
      title: "File System Operations",
      domain: "Infrastructure",
      description:
        "A ReadOnlyFile that throws on write() violates LSP if it extends File. Instead, split into Readable and Writable interfaces.",
      whySingleton:
        "Backup scripts that call file.write() will fail on ReadOnlyFile. Split: Readable (read-only) and Writable (read + write). ReadOnlyFile implements Readable only.",
      code: `interface Readable { read(): Buffer; }
interface Writable extends Readable { write(data): void; }
class ReadOnlyFile implements Readable { read() { ... } }
class RegularFile implements Writable { read() { ... } write(d) { ... } }`,
    },
    {
      id: 6,
      title: "Notification Channels",
      domain: "Communication Platform",
      description:
        "All channels (Email, SMS, Push) implement send(). A BatchOnlyChannel that throws on individual send() violates LSP. It should implement a separate BatchChannel interface.",
      whySingleton:
        "The notification system calls channel.send() for each message. BatchOnlyChannel refusing individual sends breaks the consumer. Split interfaces: SingleChannel and BatchChannel.",
      code: `interface SingleChannel { send(recipient, msg): void; }
interface BatchChannel { sendBatch(messages): void; }
class Email implements SingleChannel, BatchChannel { send(r, m) {...} sendBatch(ms) {...} }
class BulkSMS implements BatchChannel { sendBatch(ms) {...} }`,
    },
    {
      id: 7,
      title: "Payment Gateway Refunds",
      domain: "Fintech",
      description:
        "If PaymentGateway promises refund(), but CryptoGateway can't refund (blockchain is immutable), CryptoGateway shouldn't extend PaymentGateway. Split into RefundableGateway and NonRefundableGateway.",
      whySingleton:
        "Refund processing code calls gateway.refund(). CryptoGateway throwing UnsupportedOperationException is a classic LSP violation. Split the interface.",
      code: `interface ChargeableGateway { charge(amount): Receipt; }
interface RefundableGateway extends ChargeableGateway { refund(txnId): void; }
class StripeGateway implements RefundableGateway { charge(a) {...} refund(id) {...} }
class CryptoGateway implements ChargeableGateway { charge(a) {...} /* no refund */ }`,
    },
    {
      id: 8,
      title: "Database Connections",
      domain: "Backend",
      description:
        "A ReadReplica that throws on write operations violates LSP if it extends DatabaseConnection. Split into ReadOnlyConnection and ReadWriteConnection.",
      whySingleton:
        "Code that uses DatabaseConnection.execute('INSERT...') will fail on ReadReplica. Split: ReadOnlyConnection (queries) and ReadWriteConnection (queries + mutations).",
      code: `interface ReadOnlyConnection { query(sql): ResultSet; }
interface ReadWriteConnection extends ReadOnlyConnection { execute(sql): void; }
class PrimaryDB implements ReadWriteConnection { query(s) {...} execute(s) {...} }
class ReadReplica implements ReadOnlyConnection { query(s) {...} }`,
    },
    {
      id: 9,
      title: "Iterator Contracts",
      domain: "Data Structures / Algorithms",
      description:
        "A SinglePassIterator that doesn't support reset() violates LSP if Iterator promises reset(). Split into Iterator (forward-only) and ResettableIterator.",
      whySingleton:
        "Algorithms that call iterator.reset() for multi-pass processing will fail on SinglePassIterator. Split the interface to match the actual capability.",
      code: `interface Iterator<T> { hasNext(): boolean; next(): T; }
interface ResettableIterator<T> extends Iterator<T> { reset(): void; }
class StreamIterator<T> implements Iterator<T> { hasNext() {...} next() {...} }
class ArrayIterator<T> implements ResettableIterator<T> { hasNext() {...} next() {...} reset() {...} }`,
    },
    {
      id: 10,
      title: "Logger Levels",
      domain: "Infrastructure",
      description:
        "A NullLogger that silently discards all messages honors LSP if Logger's contract says 'message is accepted' (not 'message is written'). This is actually LSP-compliant.",
      whySingleton:
        "NullLogger is a valid subtype because Logger's contract is 'accept the message', not 'persist it'. Understanding the contract precisely determines LSP compliance.",
      code: `interface Logger { log(level, msg): void; /* accepts the message */ }
class ConsoleLogger implements Logger { log(l, m) { console.log(m); } }
class NullLogger implements Logger { log(l, m) { /* discard — valid per contract */ } }`,
    },
    {
      id: 11,
      title: "Cache Implementations",
      domain: "Performance / Infrastructure",
      description:
        "A DistributedCache extends Cache but has different latency characteristics, potentially returning stale data. If Cache's contract promises 'returns last set value', DistributedCache with eventual consistency violates LSP.",
      whySingleton:
        "Code expecting immediate consistency will get stale data from DistributedCache. Either weaken Cache's contract or use separate interfaces: StrongCache and EventualCache.",
      code: `interface StrongCache<K, V> { get(key): V; /* returns exact last-set value */ }
interface EventualCache<K, V> { get(key): V; /* may return stale value */ }
class LocalCache<K, V> implements StrongCache<K, V> { get(k) {...} }
class RedisCache<K, V> implements EventualCache<K, V> { get(k) {...} }`,
    },
    {
      id: 12,
      title: "User Permissions",
      domain: "Identity / Security",
      description:
        "A GuestUser extending User but overriding updateProfile() to throw violates LSP. Guest users should implement a different interface: AuthenticatedUser vs. GuestUser.",
      whySingleton:
        "Admin panels that call user.updateProfile() crash on GuestUser. Split: Viewable (read profile) and Editable (update profile). GuestUser implements Viewable only.",
      code: `interface ViewableUser { getProfile(): Profile; }
interface EditableUser extends ViewableUser { updateProfile(data): void; }
class RegisteredUser implements EditableUser { getProfile() {...} updateProfile(d) {...} }
class GuestUser implements ViewableUser { getProfile() {...} }`,
    },
  ],

  examples: [
    {
      id: 1,
      title: "Bank Account Hierarchy Redesign",
      domain: "Fintech",
      problem:
        "Account base class promises withdraw(). FixedDeposit extends Account but throws UnsupportedOperationException on withdraw(). Any code iterating Account[] and calling withdraw() crashes on FixedDeposit — a classic LSP violation.",
      solution:
        "Redesign the hierarchy: Account is a base with common properties. WithdrawableAccount adds the withdraw() contract. FixedDeposit extends Account but NOT WithdrawableAccount. Code that needs withdrawal uses WithdrawableAccount type, not Account.",
      classDiagramSvg: `<svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ls-box { rx:6; }
    .ls-title { font: bold 10px 'JetBrains Mono', monospace; }
    .ls-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="170" y="5" width="160" height="50" class="ls-box s-diagram-box"/>
  <text x="250" y="22" text-anchor="middle" class="ls-title s-diagram-title">Account</text>
  <line x1="170" y1="26" x2="330" y2="26" class="s-diagram-line"/>
  <text x="178" y="42" class="ls-member s-diagram-member">+balance() +deposit()</text>
  <rect x="50" y="80" width="180" height="40" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="140" y="105" text-anchor="middle" class="ls-title s-diagram-title">WithdrawableAccount</text>
  <rect x="280" y="80" width="180" height="40" class="ls-box s-diagram-box"/>
  <text x="370" y="105" text-anchor="middle" class="ls-title s-diagram-title">FixedDeposit</text>
  <rect x="10" y="150" width="110" height="35" class="ls-box s-diagram-box"/>
  <text x="65" y="172" text-anchor="middle" class="ls-title s-diagram-title">Checking</text>
  <rect x="130" y="150" width="110" height="35" class="ls-box s-diagram-box"/>
  <text x="185" y="172" text-anchor="middle" class="ls-title s-diagram-title">Savings</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class Account(ABC):
    """Base: balance + deposit (all accounts can do this)."""
    def __init__(self, account_id: str, balance: float = 0):
        self._id = account_id
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float):
        if amount <= 0: raise ValueError("Deposit must be positive.")
        self._balance += amount

class WithdrawableAccount(Account):
    """Extends Account with withdraw(). Subtypes MUST honor this contract."""
    def withdraw(self, amount: float):
        if amount <= 0: raise ValueError("Amount must be positive.")
        if amount > self._balance: raise ValueError("Insufficient funds.")
        self._balance -= amount

class CheckingAccount(WithdrawableAccount):
    """Honors withdraw() — no limit on frequency."""
    pass

class SavingsAccount(WithdrawableAccount):
    """Honors withdraw() — may limit to 6/month but it still works."""
    def __init__(self, account_id: str, balance: float = 0):
        super().__init__(account_id, balance)
        self._monthly_withdrawals = 0

    def withdraw(self, amount: float):
        if self._monthly_withdrawals >= 6:
            raise ValueError("Monthly withdrawal limit reached (6).")
        super().withdraw(amount)
        self._monthly_withdrawals += 1

class FixedDeposit(Account):
    """Does NOT extend WithdrawableAccount — cannot withdraw."""
    def __init__(self, account_id: str, balance: float, maturity_months: int):
        super().__init__(account_id, balance)
        self._maturity_months = maturity_months

# Safe polymorphism: only WithdrawableAccount[] for withdrawal code
def process_withdrawals(accounts: list[WithdrawableAccount], amount: float):
    for acc in accounts:
        acc.withdraw(amount)  # guaranteed to work
        print(f"{acc._id}: withdrew {amount}, balance={acc.balance}")

checking = CheckingAccount("CHK-001", 5000)
savings = SavingsAccount("SAV-001", 10000)
fixed = FixedDeposit("FD-001", 50000, 12)

process_withdrawals([checking, savings], 500)
# fixed is NOT in the list — it's not a WithdrawableAccount`,
        Go: `package main

import "fmt"

type Account struct { ID string; Balance float64 }
func (a *Account) Deposit(amount float64) { a.Balance += amount }

type WithdrawableAccount interface {
	Withdraw(amount float64) error
	GetBalance() float64
}

type CheckingAccount struct { Account }
func (c *CheckingAccount) GetBalance() float64 { return c.Balance }
func (c *CheckingAccount) Withdraw(amount float64) error {
	if amount > c.Balance { return fmt.Errorf("insufficient funds") }
	c.Balance -= amount
	return nil
}

type SavingsAccount struct { Account; MonthlyWithdrawals int }
func (s *SavingsAccount) GetBalance() float64 { return s.Balance }
func (s *SavingsAccount) Withdraw(amount float64) error {
	if s.MonthlyWithdrawals >= 6 { return fmt.Errorf("monthly limit reached") }
	if amount > s.Balance { return fmt.Errorf("insufficient funds") }
	s.Balance -= amount
	s.MonthlyWithdrawals++
	return nil
}

type FixedDeposit struct { Account; MaturityMonths int }
// FixedDeposit does NOT implement WithdrawableAccount

func ProcessWithdrawals(accounts []WithdrawableAccount, amount float64) {
	for _, a := range accounts {
		if err := a.Withdraw(amount); err != nil { fmt.Println("Error:", err) }
		fmt.Printf("Balance: %.2f\\n", a.GetBalance())
	}
}

func main() {
	checking := &CheckingAccount{Account{"CHK-001", 5000}}
	savings := &SavingsAccount{Account: Account{"SAV-001", 10000}}
	ProcessWithdrawals([]WithdrawableAccount{checking, savings}, 500)
}`,
        Java: `abstract class Account {
    protected String id;
    protected double balance;
    Account(String id, double balance) { this.id = id; this.balance = balance; }
    double getBalance() { return balance; }
    void deposit(double amount) { balance += amount; }
}

interface Withdrawable {
    void withdraw(double amount);
}

class CheckingAccount extends Account implements Withdrawable {
    CheckingAccount(String id, double balance) { super(id, balance); }
    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds.");
        balance -= amount;
    }
}

class SavingsAccount extends Account implements Withdrawable {
    private int monthlyWithdrawals = 0;
    SavingsAccount(String id, double balance) { super(id, balance); }
    public void withdraw(double amount) {
        if (monthlyWithdrawals >= 6) throw new IllegalStateException("Monthly limit reached.");
        if (amount > balance) throw new IllegalArgumentException("Insufficient funds.");
        balance -= amount;
        monthlyWithdrawals++;
    }
}

class FixedDeposit extends Account {
    // Does NOT implement Withdrawable
    FixedDeposit(String id, double balance) { super(id, balance); }
}`,
        TypeScript: `abstract class Account {
  constructor(protected id: string, protected _balance: number) {}
  get balance() { return this._balance; }
  deposit(amount: number) { this._balance += amount; }
}

interface Withdrawable {
  withdraw(amount: number): void;
}

class CheckingAccount extends Account implements Withdrawable {
  withdraw(amount: number) {
    if (amount > this._balance) throw new Error("Insufficient funds.");
    this._balance -= amount;
  }
}

class SavingsAccount extends Account implements Withdrawable {
  private monthlyWithdrawals = 0;
  withdraw(amount: number) {
    if (this.monthlyWithdrawals >= 6) throw new Error("Monthly limit.");
    if (amount > this._balance) throw new Error("Insufficient funds.");
    this._balance -= amount;
    this.monthlyWithdrawals++;
  }
}

class FixedDeposit extends Account {
  // Does NOT implement Withdrawable
  constructor(id: string, balance: number, private maturityMonths: number) { super(id, balance); }
}

function processWithdrawals(accounts: Withdrawable[], amount: number) {
  for (const acc of accounts) { acc.withdraw(amount); }
}`,
        Rust: `trait Withdrawable {
    fn withdraw(&mut self, amount: f64) -> Result<(), String>;
    fn balance(&self) -> f64;
}

struct CheckingAccount { id: String, balance: f64 }
impl Withdrawable for CheckingAccount {
    fn withdraw(&mut self, amount: f64) -> Result<(), String> {
        if amount > self.balance { return Err("Insufficient funds.".into()); }
        self.balance -= amount;
        Ok(())
    }
    fn balance(&self) -> f64 { self.balance }
}

struct SavingsAccount { id: String, balance: f64, monthly_withdrawals: u32 }
impl Withdrawable for SavingsAccount {
    fn withdraw(&mut self, amount: f64) -> Result<(), String> {
        if self.monthly_withdrawals >= 6 { return Err("Monthly limit.".into()); }
        if amount > self.balance { return Err("Insufficient funds.".into()); }
        self.balance -= amount;
        self.monthly_withdrawals += 1;
        Ok(())
    }
    fn balance(&self) -> f64 { self.balance }
}

struct FixedDeposit { id: String, balance: f64 }
// FixedDeposit does NOT implement Withdrawable

fn process_withdrawals(accounts: &mut [&mut dyn Withdrawable], amount: f64) {
    for acc in accounts.iter_mut() {
        match acc.withdraw(amount) {
            Ok(()) => println!("Withdrew {:.2}, balance: {:.2}", amount, acc.balance()),
            Err(e) => println!("Error: {}", e),
        }
    }
}`,
      },
      considerations: [
        "FixedDeposit doesn't implement Withdrawable — it can't be passed to withdrawal code",
        "SavingsAccount honors the contract but with stricter limits — still substitutable",
        "The type system prevents LSP violations at compile time",
        "No instanceof checks needed — the hierarchy is clean",
      ],
    },
    {
      id: 2,
      title: "Medical Document Rendering",
      domain: "Healthcare",
      problem:
        "A Document base class promises render() returns HTML. An InternalMemo subclass overrides render() to return plain text, breaking the clinical document viewer that expects HTML for all Document types.",
      solution:
        "Define HTMLRenderable interface for documents that render to HTML. InternalMemo implements a separate TextRenderable interface. The viewer accepts only HTMLRenderable — type-safe and LSP-compliant.",
      classDiagramSvg: `<svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ls-box { rx:6; }
    .ls-title { font: bold 10px 'JetBrains Mono', monospace; }
    .ls-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="20" y="5" width="190" height="40" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="115" y="30" text-anchor="middle" class="ls-title s-diagram-title">HTMLRenderable</text>
  <rect x="290" y="5" width="190" height="40" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="385" y="30" text-anchor="middle" class="ls-title s-diagram-title">TextRenderable</text>
  <rect x="10" y="80" width="100" height="35" class="ls-box s-diagram-box"/>
  <text x="60" y="102" text-anchor="middle" class="ls-title s-diagram-title">LabReport</text>
  <rect x="120" y="80" width="110" height="35" class="ls-box s-diagram-box"/>
  <text x="175" y="102" text-anchor="middle" class="ls-title s-diagram-title">Discharge</text>
  <rect x="330" y="80" width="120" height="35" class="ls-box s-diagram-box"/>
  <text x="390" y="102" text-anchor="middle" class="ls-title s-diagram-title">InternalMemo</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod

class HTMLRenderable(ABC):
    """Contract: render() ALWAYS returns valid HTML."""
    @abstractmethod
    def render(self) -> str: ...

class TextRenderable(ABC):
    """Contract: render() returns plain text."""
    @abstractmethod
    def render_text(self) -> str: ...

class LabReport(HTMLRenderable):
    def __init__(self, patient: str, results: dict):
        self.patient = patient
        self.results = results

    def render(self) -> str:
        rows = "".join(f"<tr><td>{k}</td><td>{v}</td></tr>" for k, v in self.results.items())
        return f"<h1>Lab Report: {self.patient}</h1><table>{rows}</table>"

class DischargeSummary(HTMLRenderable):
    def __init__(self, patient: str, summary: str):
        self.patient = patient
        self.summary = summary

    def render(self) -> str:
        return f"<h1>Discharge: {self.patient}</h1><p>{self.summary}</p>"

class ImagingReport(HTMLRenderable):
    def __init__(self, patient: str, image_url: str, findings: str):
        self.patient = patient
        self.image_url = image_url
        self.findings = findings

    def render(self) -> str:
        return f'<h1>Imaging: {self.patient}</h1><img src="{self.image_url}"/><p>{self.findings}</p>'

class InternalMemo(TextRenderable):
    def __init__(self, subject: str, body: str):
        self.subject = subject
        self.body = body

    def render_text(self) -> str:
        return f"MEMO: {self.subject}\\n{self.body}"

# Document viewer only accepts HTMLRenderable — LSP safe
def render_documents(docs: list[HTMLRenderable]) -> str:
    return "\\n".join(doc.render() for doc in docs)

docs = [
    LabReport("Jane Doe", {"WBC": "7.5", "RBC": "4.8"}),
    DischargeSummary("Jane Doe", "Patient discharged in stable condition."),
    ImagingReport("Jane Doe", "/img/xray.png", "No abnormalities."),
]
print(render_documents(docs))`,
        Go: `package main

import "fmt"

type HTMLRenderable interface { Render() string }

type LabReport struct{ Patient string; Results map[string]string }
func (l LabReport) Render() string {
	return fmt.Sprintf("<h1>Lab: %s</h1>", l.Patient)
}

type DischargeSummary struct{ Patient, Summary string }
func (d DischargeSummary) Render() string {
	return fmt.Sprintf("<h1>Discharge: %s</h1><p>%s</p>", d.Patient, d.Summary)
}

type InternalMemo struct{ Subject, Body string }
// InternalMemo does NOT implement HTMLRenderable

func RenderDocs(docs []HTMLRenderable) string {
	result := ""
	for _, d := range docs { result += d.Render() + "\\n" }
	return result
}

func main() {
	docs := []HTMLRenderable{
		LabReport{"Jane Doe", map[string]string{"WBC": "7.5"}},
		DischargeSummary{"Jane Doe", "Stable."},
	}
	fmt.Println(RenderDocs(docs))
}`,
        Java: `interface HTMLRenderable { String render(); }
interface TextRenderable { String renderText(); }

class LabReport implements HTMLRenderable {
    private final String patient;
    LabReport(String patient) { this.patient = patient; }
    public String render() { return "<h1>Lab: " + patient + "</h1>"; }
}

class DischargeSummary implements HTMLRenderable {
    private final String patient, summary;
    DischargeSummary(String patient, String summary) { this.patient = patient; this.summary = summary; }
    public String render() { return "<h1>Discharge: " + patient + "</h1><p>" + summary + "</p>"; }
}

class InternalMemo implements TextRenderable {
    private final String subject, body;
    InternalMemo(String subject, String body) { this.subject = subject; this.body = body; }
    public String renderText() { return "MEMO: " + subject + "\\n" + body; }
}`,
        TypeScript: `interface HTMLRenderable { render(): string; }
interface TextRenderable { renderText(): string; }

class LabReport implements HTMLRenderable {
  constructor(private patient: string, private results: Record<string, string>) {}
  render(): string {
    const rows = Object.entries(this.results).map(([k, v]) => \`<tr><td>\${k}</td><td>\${v}</td></tr>\`).join("");
    return \`<h1>Lab: \${this.patient}</h1><table>\${rows}</table>\`;
  }
}

class DischargeSummary implements HTMLRenderable {
  constructor(private patient: string, private summary: string) {}
  render(): string { return \`<h1>Discharge: \${this.patient}</h1><p>\${this.summary}</p>\`; }
}

class InternalMemo implements TextRenderable {
  constructor(private subject: string, private body: string) {}
  renderText(): string { return \`MEMO: \${this.subject}\\n\${this.body}\`; }
}

function renderDocs(docs: HTMLRenderable[]): string {
  return docs.map(d => d.render()).join("\\n");
}`,
        Rust: `trait HtmlRenderable { fn render(&self) -> String; }
trait TextRenderable { fn render_text(&self) -> String; }

struct LabReport { patient: String }
impl HtmlRenderable for LabReport {
    fn render(&self) -> String { format!("<h1>Lab: {}</h1>", self.patient) }
}

struct DischargeSummary { patient: String, summary: String }
impl HtmlRenderable for DischargeSummary {
    fn render(&self) -> String { format!("<h1>Discharge: {}</h1><p>{}</p>", self.patient, self.summary) }
}

struct InternalMemo { subject: String, body: String }
impl TextRenderable for InternalMemo {
    fn render_text(&self) -> String { format!("MEMO: {}\\n{}", self.subject, self.body) }
}

fn render_docs(docs: &[&dyn HtmlRenderable]) -> String {
    docs.iter().map(|d| d.render()).collect::<Vec<_>>().join("\\n")
}`,
      },
      considerations: [
        "HTMLRenderable contract guarantees HTML output — all implementors honor this",
        "InternalMemo uses a separate TextRenderable interface — no LSP violation",
        "The document viewer only accepts HTMLRenderable — type-safe at compile time",
        "New document types implementing HTMLRenderable are automatically compatible",
      ],
    },
    {
      id: 3,
      title: "Shape Hierarchy (Square/Rectangle Problem)",
      domain: "Geometry / Education",
      problem:
        "Square extends Rectangle. Rectangle.setWidth() promises that only width changes (height remains the same). But Square.setWidth() must also change height to maintain the square invariant — breaking the Rectangle contract.",
      solution:
        "Make Square and Rectangle siblings implementing a common Shape interface, not parent-child. Each has its own constructor and area() implementation. No violated contracts.",
      classDiagramSvg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ls-box { rx:6; }
    .ls-title { font: bold 10px 'JetBrains Mono', monospace; }
  </style>
  <rect x="130" y="5" width="140" height="35" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="200" y="28" text-anchor="middle" class="ls-title s-diagram-title">Shape</text>
  <rect x="20" y="70" width="110" height="35" class="ls-box s-diagram-box"/>
  <text x="75" y="92" text-anchor="middle" class="ls-title s-diagram-title">Rectangle</text>
  <rect x="150" y="70" width="100" height="35" class="ls-box s-diagram-box"/>
  <text x="200" y="92" text-anchor="middle" class="ls-title s-diagram-title">Square</text>
  <rect x="270" y="70" width="100" height="35" class="ls-box s-diagram-box"/>
  <text x="320" y="92" text-anchor="middle" class="ls-title s-diagram-title">Circle</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

    @abstractmethod
    def perimeter(self) -> float: ...

class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    @property
    def width(self) -> float: return self._width
    @property
    def height(self) -> float: return self._height

    def area(self) -> float: return self._width * self._height
    def perimeter(self) -> float: return 2 * (self._width + self._height)

class Square(Shape):
    """NOT a Rectangle subtype — independent implementation."""
    def __init__(self, side: float):
        self._side = side

    @property
    def side(self) -> float: return self._side

    def area(self) -> float: return self._side ** 2
    def perimeter(self) -> float: return 4 * self._side

class Circle(Shape):
    def __init__(self, radius: float):
        self._radius = radius

    def area(self) -> float: return math.pi * self._radius ** 2
    def perimeter(self) -> float: return 2 * math.pi * self._radius

# All shapes honor the Shape contract — LSP satisfied
def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)

shapes = [Rectangle(3, 4), Square(5), Circle(7)]
print(f"Total area: {total_area(shapes):.2f}")`,
        Go: `package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Perimeter() float64
}

type Rectangle struct{ W, H float64 }
func (r Rectangle) Area() float64 { return r.W * r.H }
func (r Rectangle) Perimeter() float64 { return 2 * (r.W + r.H) }

type Square struct{ Side float64 }
func (s Square) Area() float64 { return s.Side * s.Side }
func (s Square) Perimeter() float64 { return 4 * s.Side }

type Circle struct{ Radius float64 }
func (c Circle) Area() float64 { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }

func TotalArea(shapes []Shape) float64 {
	sum := 0.0
	for _, s := range shapes { sum += s.Area() }
	return sum
}

func main() {
	fmt.Printf("Total: %.2f\\n", TotalArea([]Shape{Rectangle{3, 4}, Square{5}, Circle{7}}))
}`,
        Java: `interface Shape { double area(); double perimeter(); }

record Rectangle(double width, double height) implements Shape {
    public double area() { return width * height; }
    public double perimeter() { return 2 * (width + height); }
}

record Square(double side) implements Shape {
    public double area() { return side * side; }
    public double perimeter() { return 4 * side; }
}

record Circle(double radius) implements Shape {
    public double area() { return Math.PI * radius * radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
}`,
        TypeScript: `interface Shape { area(): number; perimeter(): number; }

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  area() { return this.width * this.height; }
  perimeter() { return 2 * (this.width + this.height); }
}

class Square implements Shape {
  constructor(private side: number) {}
  area() { return this.side ** 2; }
  perimeter() { return 4 * this.side; }
}

class Circle implements Shape {
  constructor(private radius: number) {}
  area() { return Math.PI * this.radius ** 2; }
  perimeter() { return 2 * Math.PI * this.radius; }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}`,
        Rust: `use std::f64::consts::PI;

trait Shape { fn area(&self) -> f64; fn perimeter(&self) -> f64; }

struct Rectangle { w: f64, h: f64 }
impl Shape for Rectangle {
    fn area(&self) -> f64 { self.w * self.h }
    fn perimeter(&self) -> f64 { 2.0 * (self.w + self.h) }
}

struct Square { side: f64 }
impl Shape for Square {
    fn area(&self) -> f64 { self.side * self.side }
    fn perimeter(&self) -> f64 { 4.0 * self.side }
}

struct Circle { radius: f64 }
impl Shape for Circle {
    fn area(&self) -> f64 { PI * self.radius * self.radius }
    fn perimeter(&self) -> f64 { 2.0 * PI * self.radius }
}

fn total_area(shapes: &[&dyn Shape]) -> f64 { shapes.iter().map(|s| s.area()).sum() }`,
      },
      considerations: [
        "Square is NOT a subtype of Rectangle — they're siblings implementing Shape",
        "No contract violations: area() and perimeter() work correctly for all shapes",
        "setWidth()/setHeight() don't exist on Shape — mutability is per-type, not polymorphic",
        "This is the canonical LSP example — teaches that 'is-a' is behavioral, not taxonomic",
      ],
    },
    {
      id: 4,
      title: "Read-Only vs. Read-Write Collections",
      domain: "Data Structures",
      problem:
        "ImmutableList extends List, but throws UnsupportedOperationException on add(), remove(), and clear(). Code using List type doesn't know it can't mutate — crashes at runtime.",
      solution:
        "Define ReadOnlyCollection (read operations only). MutableCollection extends it (adds write operations). ImmutableList implements ReadOnlyCollection — it never promises write capabilities.",
      classDiagramSvg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ls-box { rx:6; }
    .ls-title { font: bold 10px 'JetBrains Mono', monospace; }
    .ls-member { font: 9px 'JetBrains Mono', monospace; }
  </style>
  <rect x="100" y="5" width="200" height="45" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="200" y="22" text-anchor="middle" class="ls-title s-diagram-title">ReadOnlyCollection</text>
  <line x1="100" y1="26" x2="300" y2="26" class="s-diagram-line"/>
  <text x="108" y="42" class="ls-member s-diagram-member">get(), size(), contains()</text>
  <rect x="10" y="80" width="180" height="45" class="ls-box s-diagram-box" stroke-dasharray="5,3"/>
  <text x="100" y="97" text-anchor="middle" class="ls-title s-diagram-title">MutableCollection</text>
  <line x1="10" y1="101" x2="190" y2="101" class="s-diagram-line"/>
  <text x="18" y="117" class="ls-member s-diagram-member">add(), remove()</text>
  <rect x="220" y="80" width="170" height="45" class="ls-box s-diagram-box"/>
  <text x="305" y="97" text-anchor="middle" class="ls-title s-diagram-title">ImmutableList</text>
  <line x1="220" y1="101" x2="390" y2="101" class="s-diagram-line"/>
  <text x="228" y="117" class="ls-member s-diagram-member">(read-only, no write ops)</text>
</svg>`,
      code: {
        Python: `from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Iterator

T = TypeVar('T')

class ReadOnlyCollection(ABC, Generic[T]):
    """Read-only contract: get, size, contains, iterate."""
    @abstractmethod
    def get(self, index: int) -> T: ...
    @abstractmethod
    def size(self) -> int: ...
    @abstractmethod
    def contains(self, item: T) -> bool: ...
    @abstractmethod
    def __iter__(self) -> Iterator[T]: ...

class MutableCollection(ReadOnlyCollection[T]):
    """Extends read-only with write operations."""
    @abstractmethod
    def add(self, item: T): ...
    @abstractmethod
    def remove(self, item: T): ...

class ArrayList(MutableCollection[T]):
    def __init__(self):
        self._items: list[T] = []
    def get(self, index: int) -> T: return self._items[index]
    def size(self) -> int: return len(self._items)
    def contains(self, item: T) -> bool: return item in self._items
    def add(self, item: T): self._items.append(item)
    def remove(self, item: T): self._items.remove(item)
    def __iter__(self): return iter(self._items)

class ImmutableList(ReadOnlyCollection[T]):
    """Implements ONLY ReadOnlyCollection — no write ops, no LSP violation."""
    def __init__(self, items: list[T]):
        self._items = tuple(items)  # truly immutable
    def get(self, index: int) -> T: return self._items[index]
    def size(self) -> int: return len(self._items)
    def contains(self, item: T) -> bool: return item in self._items
    def __iter__(self): return iter(self._items)

# Type-safe: functions declare what they need
def print_all(collection: ReadOnlyCollection) -> None:
    for item in collection:
        print(item)

def add_defaults(collection: MutableCollection[str]) -> None:
    collection.add("default-1")
    collection.add("default-2")

immutable = ImmutableList(["a", "b", "c"])
print_all(immutable)  # works — only reads

mutable = ArrayList()
mutable.add("x")
add_defaults(mutable)  # works — can write
print_all(mutable)     # works — can also read`,
        Go: `package main

import "fmt"

type ReadOnlyCollection[T comparable] interface {
	Get(index int) T
	Size() int
	Contains(item T) bool
}

type MutableCollection[T comparable] interface {
	ReadOnlyCollection[T]
	Add(item T)
	Remove(item T)
}

type ArrayList[T comparable] struct{ items []T }
func (a *ArrayList[T]) Get(i int) T { return a.items[i] }
func (a *ArrayList[T]) Size() int { return len(a.items) }
func (a *ArrayList[T]) Contains(item T) bool {
	for _, v := range a.items { if v == item { return true } }
	return false
}
func (a *ArrayList[T]) Add(item T) { a.items = append(a.items, item) }
func (a *ArrayList[T]) Remove(item T) {
	for i, v := range a.items { if v == item { a.items = append(a.items[:i], a.items[i+1:]...); return } }
}

type ImmutableList[T comparable] struct{ items []T }
func (il ImmutableList[T]) Get(i int) T { return il.items[i] }
func (il ImmutableList[T]) Size() int { return len(il.items) }
func (il ImmutableList[T]) Contains(item T) bool {
	for _, v := range il.items { if v == item { return true } }
	return false
}

func PrintAll[T comparable](c ReadOnlyCollection[T]) {
	for i := 0; i < c.Size(); i++ { fmt.Println(c.Get(i)) }
}

func main() {
	il := ImmutableList[string]{items: []string{"a", "b", "c"}}
	PrintAll[string](il)
}`,
        Java: `interface ReadOnlyCollection<T> {
    T get(int index);
    int size();
    boolean contains(T item);
}

interface MutableCollection<T> extends ReadOnlyCollection<T> {
    void add(T item);
    void remove(T item);
}

class ArrayList<T> implements MutableCollection<T> {
    private final java.util.List<T> items = new java.util.ArrayList<>();
    public T get(int index) { return items.get(index); }
    public int size() { return items.size(); }
    public boolean contains(T item) { return items.contains(item); }
    public void add(T item) { items.add(item); }
    public void remove(T item) { items.remove(item); }
}

class ImmutableList<T> implements ReadOnlyCollection<T> {
    private final java.util.List<T> items;
    ImmutableList(java.util.List<T> items) { this.items = java.util.List.copyOf(items); }
    public T get(int index) { return items.get(index); }
    public int size() { return items.size(); }
    public boolean contains(T item) { return items.contains(item); }
}`,
        TypeScript: `interface ReadOnlyCollection<T> {
  get(index: number): T;
  size(): number;
  contains(item: T): boolean;
}

interface MutableCollection<T> extends ReadOnlyCollection<T> {
  add(item: T): void;
  remove(item: T): void;
}

class ImmutableList<T> implements ReadOnlyCollection<T> {
  private readonly items: readonly T[];
  constructor(items: T[]) { this.items = Object.freeze([...items]); }
  get(index: number) { return this.items[index]; }
  size() { return this.items.length; }
  contains(item: T) { return this.items.includes(item); }
}

class ArrayList<T> implements MutableCollection<T> {
  private items: T[] = [];
  get(index: number) { return this.items[index]; }
  size() { return this.items.length; }
  contains(item: T) { return this.items.includes(item); }
  add(item: T) { this.items.push(item); }
  remove(item: T) { this.items = this.items.filter(i => i !== item); }
}`,
        Rust: `trait ReadOnlyCollection<T> {
    fn get(&self, index: usize) -> &T;
    fn size(&self) -> usize;
    fn contains(&self, item: &T) -> bool where T: PartialEq;
}

struct ImmutableList<T> { items: Vec<T> }
impl<T: PartialEq> ReadOnlyCollection<T> for ImmutableList<T> {
    fn get(&self, index: usize) -> &T { &self.items[index] }
    fn size(&self) -> usize { self.items.len() }
    fn contains(&self, item: &T) -> bool { self.items.contains(item) }
}

// MutableList would implement a MutableCollection trait that extends ReadOnlyCollection`,
      },
      considerations: [
        "ImmutableList implements ReadOnlyCollection — no broken write contracts",
        "Functions declare exactly the capability they need (ReadOnly vs. Mutable)",
        "The type system prevents passing ImmutableList where MutableCollection is expected",
        "Kotlin's List vs. MutableList follows this exact pattern",
      ],
    },
  ],

  variants: [
    {
      id: 1,
      name: "Contract-Based Hierarchy Redesign",
      description:
        "The primary LSP approach: redesign type hierarchies so that subtypes honor the base type's behavioral contract. Split types that can't fulfill a contract into separate branches. This is the 'fix the hierarchy' approach.",
      code: {
        Python: `# BEFORE (violates LSP):
class Bird:
    def fly(self): ...
class Penguin(Bird):
    def fly(self): raise Exception("Can't fly!")  # LSP violation

# AFTER (LSP-compliant):
class Bird:
    def eat(self): ...
class FlyingBird(Bird):
    def fly(self): ...
class FlightlessBird(Bird):
    def walk(self): ...

class Eagle(FlyingBird):
    def fly(self): print("Soaring!")
class Penguin(FlightlessBird):
    def walk(self): print("Waddling!")`,
        Go: `// Bird with optional capability
type Bird interface { Eat() }
type Flyer interface { Fly() }

type Eagle struct{}
func (e Eagle) Eat() { fmt.Println("Eating") }
func (e Eagle) Fly() { fmt.Println("Soaring") }  // implements both

type Penguin struct{}
func (p Penguin) Eat() { fmt.Println("Eating fish") }
// Penguin does NOT implement Flyer`,
        Java: `interface Bird { void eat(); }
interface Flyer { void fly(); }

class Eagle implements Bird, Flyer {
    public void eat() { System.out.println("Eating"); }
    public void fly() { System.out.println("Soaring"); }
}

class Penguin implements Bird {
    public void eat() { System.out.println("Eating fish"); }
    // Does NOT implement Flyer
}`,
        TypeScript: `interface Bird { eat(): void; }
interface Flyer { fly(): void; }

class Eagle implements Bird, Flyer {
  eat() { console.log("Eating"); }
  fly() { console.log("Soaring"); }
}

class Penguin implements Bird {
  eat() { console.log("Eating fish"); }
  // Does NOT implement Flyer
}`,
        Rust: `trait Bird { fn eat(&self); }
trait Flyer { fn fly(&self); }

struct Eagle;
impl Bird for Eagle { fn eat(&self) { println!("Eating"); } }
impl Flyer for Eagle { fn fly(&self) { println!("Soaring"); } }

struct Penguin;
impl Bird for Penguin { fn eat(&self) { println!("Eating fish"); } }
// Penguin does NOT implement Flyer`,
      },
      pros: [
        "Clean hierarchy — each branch honors its contract",
        "Compile-time safety — can't pass Penguin where Flyer is expected",
        "Easy to reason about — the type tells you the capability",
      ],
      cons: [
        "May require significant refactoring of existing hierarchies",
        "Can lead to deeper hierarchies with more interfaces",
        "Requires understanding the full behavioral contract, not just method signatures",
      ],
    },
    {
      id: 2,
      name: "Composition Over Inheritance",
      description:
        "Instead of fixing the hierarchy, avoid inheritance altogether. Use composition to share behavior. Types implement only the interfaces they can honor, and delegate to composed objects for shared logic.",
      code: {
        Python: `from typing import Protocol

class CanCharge(Protocol):
    def charge(self, amount: float) -> str: ...

class CanRefund(Protocol):
    def refund(self, txn_id: str) -> str: ...

class ChargeProcessor:
    """Shared charge logic — composed, not inherited."""
    def process_charge(self, amount: float) -> str:
        return f"Charged \${amount:.2f}"

class StripeGateway:
    """Supports both charge and refund."""
    def __init__(self):
        self._charger = ChargeProcessor()
    def charge(self, amount: float) -> str:
        return self._charger.process_charge(amount)
    def refund(self, txn_id: str) -> str:
        return f"Refunded {txn_id}"

class CryptoGateway:
    """Supports only charge — no refund (blockchain is immutable)."""
    def __init__(self):
        self._charger = ChargeProcessor()
    def charge(self, amount: float) -> str:
        return self._charger.process_charge(amount)

# Functions declare what they need
def process_payment(gateway: CanCharge, amount: float):
    print(gateway.charge(amount))

def process_refund(gateway: CanRefund, txn_id: str):
    print(gateway.refund(txn_id))

stripe = StripeGateway()
crypto = CryptoGateway()
process_payment(stripe, 100)
process_payment(crypto, 50)
process_refund(stripe, "TXN-001")
# process_refund(crypto, ...) — type error! CryptoGateway doesn't implement CanRefund`,
        Go: `type Charger interface { Charge(amount float64) string }
type Refunder interface { Refund(txnID string) string }

type ChargeProcessor struct{}
func (cp ChargeProcessor) ProcessCharge(amount float64) string {
	return fmt.Sprintf("Charged $%.2f", amount)
}

type StripeGateway struct{ cp ChargeProcessor }
func (s StripeGateway) Charge(amount float64) string { return s.cp.ProcessCharge(amount) }
func (s StripeGateway) Refund(txnID string) string { return "Refunded " + txnID }

type CryptoGateway struct{ cp ChargeProcessor }
func (c CryptoGateway) Charge(amount float64) string { return c.cp.ProcessCharge(amount) }
// CryptoGateway does NOT implement Refunder`,
        Java: `interface Charger { String charge(double amount); }
interface Refunder { String refund(String txnId); }

class ChargeProcessor {
    String processCharge(double amount) { return String.format("Charged $%.2f", amount); }
}

class StripeGateway implements Charger, Refunder {
    private final ChargeProcessor cp = new ChargeProcessor();
    public String charge(double amount) { return cp.processCharge(amount); }
    public String refund(String txnId) { return "Refunded " + txnId; }
}

class CryptoGateway implements Charger {
    private final ChargeProcessor cp = new ChargeProcessor();
    public String charge(double amount) { return cp.processCharge(amount); }
    // Does NOT implement Refunder
}`,
        TypeScript: `interface Charger { charge(amount: number): string; }
interface Refunder { refund(txnId: string): string; }

class ChargeProcessor {
  processCharge(amount: number): string { return \`Charged $\${amount.toFixed(2)}\`; }
}

class StripeGateway implements Charger, Refunder {
  private cp = new ChargeProcessor();
  charge(amount: number) { return this.cp.processCharge(amount); }
  refund(txnId: string) { return \`Refunded \${txnId}\`; }
}

class CryptoGateway implements Charger {
  private cp = new ChargeProcessor();
  charge(amount: number) { return this.cp.processCharge(amount); }
  // Does NOT implement Refunder
}`,
        Rust: `trait Charger { fn charge(&self, amount: f64) -> String; }
trait Refunder { fn refund(&self, txn_id: &str) -> String; }

struct ChargeProcessor;
impl ChargeProcessor {
    fn process_charge(&self, amount: f64) -> String { format!("Charged \${:.2}", amount) }
}

struct StripeGateway { cp: ChargeProcessor }
impl Charger for StripeGateway { fn charge(&self, amount: f64) -> String { self.cp.process_charge(amount) } }
impl Refunder for StripeGateway { fn refund(&self, txn_id: &str) -> String { format!("Refunded {}", txn_id) } }

struct CryptoGateway { cp: ChargeProcessor }
impl Charger for CryptoGateway { fn charge(&self, amount: f64) -> String { self.cp.process_charge(amount) } }`,
      },
      pros: [
        "No inheritance to violate — types implement only what they support",
        "Shared logic via composition — no code duplication",
        "Maximum flexibility — interfaces are small and composable",
      ],
      cons: [
        "More boilerplate — each type must explicitly delegate to composed objects",
        "No automatic method forwarding (without helper frameworks)",
        "Can be verbose in languages without mixins or traits",
      ],
    },
    {
      id: 3,
      name: "Design by Contract (DbC)",
      description:
        "Explicitly document and enforce preconditions, postconditions, and invariants. Use assertions, type guards, or formal contracts to catch LSP violations at development time rather than discovering them in production.",
      code: {
        Python: `from abc import ABC, abstractmethod

class Stack(ABC):
    """
    Contract:
    - push(item): Precondition: item is not None. Postcondition: size increases by 1.
    - pop(): Precondition: size > 0. Postcondition: size decreases by 1.
    - Invariant: size >= 0
    """
    @abstractmethod
    def push(self, item) -> None: ...
    @abstractmethod
    def pop(self): ...
    @abstractmethod
    def size(self) -> int: ...

class ArrayStack(Stack):
    def __init__(self):
        self._items: list = []

    def push(self, item) -> None:
        assert item is not None, "Precondition: item must not be None"
        old_size = self.size()
        self._items.append(item)
        assert self.size() == old_size + 1, "Postcondition: size increased by 1"

    def pop(self):
        assert self.size() > 0, "Precondition: stack must not be empty"
        old_size = self.size()
        item = self._items.pop()
        assert self.size() == old_size - 1, "Postcondition: size decreased by 1"
        return item

    def size(self) -> int:
        result = len(self._items)
        assert result >= 0, "Invariant: size >= 0"
        return result

class BoundedStack(Stack):
    """LSP-compliant: strengthens precondition only acceptably."""
    def __init__(self, max_size: int):
        self._items: list = []
        self._max = max_size

    def push(self, item) -> None:
        assert item is not None
        if self.size() >= self._max:
            raise OverflowError(f"Stack full (max={self._max})")
        self._items.append(item)

    def pop(self):
        assert self.size() > 0
        return self._items.pop()

    def size(self) -> int:
        return len(self._items)`,
        Go: `// Design by Contract in Go using explicit checks
type Stack interface {
	Push(item interface{}) error
	Pop() (interface{}, error)
	Size() int
}

type ArrayStack struct{ items []interface{} }
func (s *ArrayStack) Push(item interface{}) error {
	if item == nil { return fmt.Errorf("precondition: item must not be nil") }
	s.items = append(s.items, item)
	return nil
}
func (s *ArrayStack) Pop() (interface{}, error) {
	if len(s.items) == 0 { return nil, fmt.Errorf("precondition: stack must not be empty") }
	item := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return item, nil
}
func (s *ArrayStack) Size() int { return len(s.items) }`,
        Java: `abstract class Stack<T> {
    abstract void push(T item);
    abstract T pop();
    abstract int size();

    // Contract documentation via Javadoc and assertions
    // Precondition push: item != null, Postcondition: size increases
    // Precondition pop: size > 0, Postcondition: size decreases
}

class ArrayStack<T> extends Stack<T> {
    private final List<T> items = new ArrayList<>();
    void push(T item) {
        assert item != null : "Precondition: item must not be null";
        int oldSize = size();
        items.add(item);
        assert size() == oldSize + 1 : "Postcondition: size increased";
    }
    T pop() {
        assert size() > 0 : "Precondition: stack not empty";
        return items.remove(items.size() - 1);
    }
    int size() { return items.size(); }
}`,
        TypeScript: `abstract class Stack<T> {
  abstract push(item: T): void;
  abstract pop(): T;
  abstract size(): number;
}

class ArrayStack<T> extends Stack<T> {
  private items: T[] = [];

  push(item: T) {
    if (item === null || item === undefined) throw new Error("Precondition: item required");
    const oldSize = this.size();
    this.items.push(item);
    console.assert(this.size() === oldSize + 1, "Postcondition: size increased");
  }

  pop(): T {
    console.assert(this.size() > 0, "Precondition: stack not empty");
    return this.items.pop()!;
  }

  size(): number { return this.items.length; }
}`,
        Rust: `trait Stack<T> {
    fn push(&mut self, item: T);
    fn pop(&mut self) -> T;
    fn size(&self) -> usize;
}

struct ArrayStack<T> { items: Vec<T> }
impl<T> Stack<T> for ArrayStack<T> {
    fn push(&mut self, item: T) {
        let old_size = self.size();
        self.items.push(item);
        debug_assert_eq!(self.size(), old_size + 1, "Postcondition: size increased");
    }
    fn pop(&mut self) -> T {
        assert!(self.size() > 0, "Precondition: stack not empty");
        self.items.pop().unwrap()
    }
    fn size(&self) -> usize { self.items.len() }
}`,
      },
      pros: [
        "Makes contracts explicit — developers understand what must be honored",
        "Catches violations early — assertions fail during development/testing",
        "Language-agnostic — works in any language with assertions",
      ],
      cons: [
        "Assertions don't run in production (often disabled for performance)",
        "Can't catch all behavioral violations — some are semantic, not assertable",
        "Requires discipline to write and maintain contracts for every method",
      ],
    },
  ],

  comparisonHeaders: [
    "Approach", "LSP Enforcement", "Refactoring Cost", "Safety Level", "Best For",
  ],
  comparisonRows: [
    ["Hierarchy Redesign", "Structural (type system)", "High", "Compile-time", "Major inheritance issues"],
    ["Composition over Inheritance", "Structural (interfaces)", "Medium", "Compile-time", "New designs, avoiding inheritance"],
    ["Design by Contract", "Runtime (assertions)", "Low", "Test-time", "Documenting/enforcing existing contracts"],
  ],

  summary: [
    { aspect: "Principle Type", detail: "SOLID — L" },
    {
      aspect: "Key Benefit",
      detail:
        "Code can use polymorphism safely. Functions that accept a base type work correctly with any subtype. No instanceof checks, no surprise exceptions, no defensive programming.",
    },
    {
      aspect: "Core Rule",
      detail:
        "Subtypes must honor the behavioral contract of the base type: same or weaker preconditions, same or stronger postconditions, preserved invariants, no unexpected exceptions.",
    },
    {
      aspect: "Classic Violations",
      detail:
        "Square extending Rectangle (violates independent width/height). ImmutableList extending List (throws on add). FixedDeposit extending Account (throws on withdraw). GuestUser extending User (throws on updateProfile).",
    },
    {
      aspect: "Detection",
      detail:
        "Look for: instanceof/type checks in client code, methods that throw UnsupportedOperationException, overridden methods that do nothing, subtypes that break unit tests written for the base type.",
    },
    {
      aspect: "Common Fix",
      detail:
        "Split the hierarchy. Create narrower interfaces that capture the actual capability. Use composition to share code without inheriting contracts you can't honor.",
    },
    {
      aspect: "Related Principles",
      detail:
        "ISP (narrower interfaces reduce LSP violations), OCP (LSP enables safe extension), DIP (depend on abstractions that subtypes honor). LSP is the safety guarantee that makes polymorphism work.",
    },
  ],

  antiPatterns: [
    {
      name: "Throw-on-Override",
      description:
        "Subclass overrides a base method to throw UnsupportedOperationException. The base type promises the method works; the subtype breaks that promise.",
      betterAlternative:
        "Don't extend the base type if you can't honor its contract. Use a narrower interface or a separate branch in the hierarchy.",
    },
    {
      name: "No-Op Override",
      description:
        "Subclass overrides a base method to do nothing (empty body). If the base type's contract guarantees a side effect, the no-op silently violates it.",
      betterAlternative:
        "Only use no-op if the base contract says 'may optionally perform action'. If the contract guarantees the action, the subtype must perform it.",
    },
    {
      name: "instanceof/Type-Checking in Client Code",
      description:
        "Client code checks `if (obj instanceof SpecificType)` to handle subtypes differently. This defeats the purpose of polymorphism and indicates the hierarchy violates LSP.",
      betterAlternative:
        "Fix the hierarchy so all subtypes work correctly when used as the base type. If behavior must vary, use the Template Method or Strategy pattern within the type itself.",
    },
    {
      name: "Strengthened Precondition",
      description:
        "Subtype adds restrictions the base type doesn't have: 'amount must be in multiples of 100' when the base type accepts any positive amount. Client code that sends 50 breaks.",
      betterAlternative:
        "Subtypes must accept at least the same range of inputs as the base type. If restrictions are needed, create a new type with the stricter interface.",
    },
  ],
};

export default liskovSubstitutionData;
