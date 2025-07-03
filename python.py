class Account:
    def __init__(self, code, name, account_type):
        self.code = code                # e.g., 1000
        self.name = name                # e.g., "Cash"
        self.account_type = account_type  # e.g., "Asset"
        self.balance = 0.0

    def debit(self, amount):
        if self.account_type in ("Asset", "Expense"):
            self.balance += amount
        else:
            self.balance -= amount

    def credit(self, amount):
        if self.account_type in ("Asset", "Expense"):
            self.balance -= amount
        else:
            self.balance += amount

    def __str__(self):
        return f"{self.code} - {self.name} ({self.account_type}): ${self.balance:.2f}"
        
class Transaction:
    def __init__(self, date, description):
        self.date = date
        self.description = description
        self.entries = []

    def add_entry(self, account, amount):
        self.entries.append((account, amount))
        
class JournalEntry:
    def __init__(self, date, description):
        self.date = date
        self.description = description
        self.debits = []
        self.credits = []

    def add_debit(self, account, amount):
        self.debits.append((account, amount))

    def add_credit(self, account, amount):
        self.credits.append((account, amount))

    def post(self):
        total_debit = sum(amount for _, amount in self.debits)
        total_credit = sum(amount for _, amount in self.credits)

        if abs(total_debit - total_credit) > 0.01:
            raise ValueError("Unbalanced entry: debits and credits must match.")

        for account, amount in self.debits:
            account.debit(amount)

        for account, amount in self.credits:
            account.credit(amount)

        print(f"Posted entry: {self.description}")
        
class Ledger:
    def __init__(self):
        self.accounts = []
        self.entries = []

    def add_account(self, account):
        self.accounts.append(account)

    def post_entry(self, journal_entry):
        journal_entry.post()
        self.entries.append(journal_entry)
        
class Customer:
    def __init__(self, name):
        self.name = name
        self.balance = 0

    def invoice(self, amount):
        self.balance += amount
        
class Invoice:
    def __init__(self, customer, amount, due_date):
        self.customer = customer
        self.amount = amount
        self.due_date = due_date
        self.paid = False
        
class ChartOfAccounts:
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
            
class TrialBalance:
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

class Invoice:
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
    
    
Account(1000, "Cash", "Asset").debit(100000)

print(Account(1000,"cash","Asset"))
