from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Interval, Date, ForeignKey, Float
from sqlalchemy.types import TypeDecorator
from datetime import timedelta

Base = declarative_base()

class Account(Base):
    __tablename__ = 'accounts'
    account_id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(Integer)
    name = Column(String)
    account_type = Column(String)
    balance = Column(Float)

    def to_dict(self):
        return{
            'account_id': self.account_id
            'code': self.code,
            'name': self.name,
            'account_type': self.account_type,
            'balance': self.balance
        }

    def credit(self, amount):
        if self.account_type in ("Asset", "Expense"):
            self.balance -= amount
        else:
            self.balance += amount

    def __str__(self):
        return f"{self.code} - {self.name} ({self.account_type}): ${self.balance:.2f}"
        
        
class JournalEntry(Base):
    __tablename__ = 'journal_entries'

    id = Column(Integer, primary_key=True)
    date = Column(Date)
    description = Column(String)

    lines = relationship("JournalLine", back_populates="entry", cascade="all, delete-orphan")
    
    def to_dict(self):
        return{
            'id': self.id
            'date': self.date
            'description': self.description 
        }
        
        def __str__(self):
            return f"Entry #{self.id}: {self.description} on {self.date}"

class JournalLine(Base):
    __tablename__ = 'journal_lines'

    id = Column(Integer, primary_key=True)
    journal_entry_id = Column(Integer, ForeignKey("journal_entries.id"))
    account_id = Column(Integer, ForeignKey("accounts.account_id"))
    debit = Column(Float, default=0.0)
    credit = Column(Float, default=0.0)
    memo = Column(String, nullable=True)

    entry = relationship("JournalEntry", back_populates="lines")
    account = relationship("Account")

        
class Ledger(Base):
    def __init__(self):
        self.accounts = []
        self.entries = []

    def add_account(self, account):
        self.accounts.append(account)

    def post_entry(self, journal_entry):
        journal_entry.post()
        self.entries.append(journal_entry)
        
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    balance = Column(Float, default=0.0)

    invoices = relationship("Invoice", back_populates="customer")


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    date = Column(Date)
    amount = Column(Float)
    paid = Column(Integer, default=0)  # Use Boolean if supported
    journal_entry_id = Column(Integer, ForeignKey("journal_entries.id"), nullable=True)

    customer = relationship("Customer", back_populates="invoices")
    journal_entry = relationship("JournalEntry", foreign_keys=[journal_entry_id])
    
    def __init__(self, invoice_id, customer_name, amount, date):
        self.invoice_id = invoice_id
        self.customer_name = customer_name
        self.amount = amount
        self.date = date
        self.paid = False

    def mark_paid(self):
        self.paid = True

    def __str__(self):
        status = "Paid" if self.paid else "Unpaid"
        return f"Invoice {self.invoice_id} - {self.customer_name} - ${self.amount:.2f} - {status}"

        
class ChartOfAccounts(Base):
    def __init__(self):
        self.accounts = {}

    def add_account(self, code, name, account_type):
        if code in self.accounts:
            raise ValueError(f"Account {code} already exists.")
        self.accounts[code] = Account(code, name, account_type)

    def get_account(self, code):
        return self.accounts.get(code)

    def list_accounts(self):
        for code in sorted(self.accounts):
            print(self.accounts[code])
            
class TrialBalance(Base):
    def __init__(self, chart):
        self.chart = chart

    def generate(self):
        print("\n=== Trial Balance ===")
        total_debits = 0
        total_credits = 0
        for acc in self.chart.accounts.values():
            if acc.balance >= 0:
                print(f"{acc.name:<20} Debit: ${acc.balance:.2f}")
                total_debits += acc.balance
            else:
                print(f"{acc.name:<20} Credit: ${-acc.balance:.2f}")
                total_credits += -acc.balance
        print(f"\nTotal Debits: ${total_debits:.2f}")
        print(f"Total Credits: ${total_credits:.2f}")
        
chart_of_accounts = {
    # ASSETS (1000–1999)
    1000: {"name": "Cash", "type": "Asset"},
    1010: {"name": "Checking Account", "type": "Asset"},
    1020: {"name": "Accounts Receivable", "type": "Asset"},
    1030: {"name": "Inventory", "type": "Asset"},
    1040: {"name": "Prepaid Expenses", "type": "Asset"},
    1500: {"name": "Equipment", "type": "Asset"},
    1510: {"name": "Accumulated Depreciation", "type": "Contra-Asset"},

    # LIABILITIES (2000–2999)
    2000: {"name": "Accounts Payable", "type": "Liability"},
    2100: {"name": "Notes Payable", "type": "Liability"},
    2200: {"name": "Taxes Payable", "type": "Liability"},
    2300: {"name": "Unearned Revenue", "type": "Liability"},

    # EQUITY (3000–3999)
    3000: {"name": "Retained Earnings", "type": "Equity"},
    3100: {"name": "Owner's Capital", "type": "Equity"},
    3101: {"name": "Owner's Draw", "type": "Contra-Equity"},

    # REVENUE (4000–4999)
    4000: {"name": "Sales Revenue", "type": "Revenue"},
    4100: {"name": "Service Income", "type": "Revenue"},
    4200: {"name": "Interest Income", "type": "Revenue"},
    4300: {"name": "Sales Returns and Allowances", "type": "Contra-Revenue"},

    # EXPENSES (5000–5999)
    5000: {"name": "Rent Expense", "type": "Expense"},
    5100: {"name": "Utilities Expense", "type": "Expense"},
    5200: {"name": "Wages Expense", "type": "Expense"},
    5300: {"name": "Office Supplies", "type": "Expense"},
    5400: {"name": "Marketing Expense", "type": "Expense"},
    5500: {"name": "Depreciation Expense", "type": "Expense"},
    5600: {"name": "Bank Fees", "type": "Expense"},
    5700: {"name": "Insurance Expense", "type": "Expense"},
}

cash = Account(1000, "Cash", "Asset")
checking_account = Account(1010, "Checking Account", "Asset")
accounts_receivable = Account(1020, "Accounts Receivable", "Asset")
inventory = Account(1030, "Inventory", "Asset")
prepaid_expenses = Account(1040, "Prepaid Expenses", "Asset")
equipment = Account(1500, "Equipment", "Asset")
accumulated_depreciation = Account(1510, "Accumulated Depreciation", "Asset")

accounts_payable = Account(2000, "Accounts Payable", "Liability")
notes_payable = Account(2100, "Notes Payable", "Liability")
taxes_payable = Account(2200, "Taxes Payable", "Liability")
unearned_revenue = Account(2300, "Unearned Revenue", "Liability")


        
def issue_invoice(coa, invoices, invoice_id, customer_name, amount, date):
    invoice = Invoice(invoice_id, customer_name, amount, date)
    invoices.append(invoice)

    # Bookkeeping entry: Debit Accounts Receivable, Credit Revenue
    entry = JournalEntry(date, f"Issued invoice {invoice_id} to {customer_name}")
    entry.add_debit(coa.get_account(1020), amount)  # Accounts Receivable
    entry.add_credit(coa.get_account(4000), amount)  # Sales Revenue (example)
    entry.post()

    print(f"Invoice issued: {invoice}")
    return invoice

def record_payment(coa, invoices, invoice_id, payment_date):
    # Find invoice
    invoice = next((inv for inv in invoices if inv.invoice_id == invoice_id), None)
    if not invoice:
        print("Invoice not found!")
        return
    if invoice.paid:
        print("Invoice already paid!")
        return

    # Bookkeeping entry: Debit Cash, Credit Accounts Receivable
    entry = JournalEntry(payment_date, f"Payment received for invoice {invoice_id}")
    entry.add_debit(coa.get_account(1000), invoice.amount)       # Cash
    entry.add_credit(coa.get_account(1020), invoice.amount)      # Accounts Receivable
    entry.post()

    invoice.mark_paid()
    print(f"Payment recorded: {invoice}")
    
cash = Account(
    code: 1000
    name: 'Cash'
    account_type: 'Asset'
    balance: 0
)

db_session = LocalSession()
db_session.add(cash)
db_session.commit()
db_session.close()

@api_bp.route('/api/journals/debit', methods=['POST']):

def debit(): 
    db_session = LocalSession()
    data = request.form
    
    accout_id =data.get('account_id ')
    journal_entry_id = data.get()
    debit = data.get()
    memo = data.get()
    
    account = db_session.query(account).select(account_id)
    
    if account.accout_type == ("Asset" || "Expense"):
        account.balance += debit
    else:
        account.balance -= debit

    

    new_debit = JournalLine(
        journal_entry_id = journal_entry_id
        account_id  = account_id 
        debit = debit 
        memo = memo 
        account=account
    )
    
    db_session.add(new_debit)
    db_session.commit()
    
    db_session.close()
