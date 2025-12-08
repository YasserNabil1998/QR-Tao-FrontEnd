import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";

interface Account {
    id: string;
    account_code: string;
    account_name: string;
    account_type: "assets" | "liabilities" | "equity" | "revenue" | "expenses";
    parent_account_id?: string;
    balance: number;
    is_active: boolean;
}

interface JournalEntry {
    id: string;
    entry_number: string;
    entry_date: string;
    description: string;
    reference_type: "purchase" | "invoice" | "payment" | "salary" | "manual";
    reference_id?: string;
    total_amount: number;
    created_by: string;
    approved_by?: string;
    approved_date?: string;
    status: "draft" | "approved" | "posted";
}

interface JournalEntryLine {
    id: string;
    journal_entry_id: string;
    account_id: string;
    account: Account;
    debit_amount: number;
    credit_amount: number;
    description: string;
}

export default function GeneralLedger() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [showTrialBalance, setShowTrialBalance] = useState(false);
    const [showProfitLoss, setShowProfitLoss] = useState(false);
    const [showCashFlow, setShowCashFlow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("accounts");
    const [dateFilter, setDateFilter] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0],
        to: new Date().toISOString().split("T")[0],
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(
        null
    );
    const [entryLines, setEntryLines] = useState<JournalEntryLine[]>([]);
    const [entryDetailsLines, setEntryDetailsLines] = useState<
        JournalEntryLine[]
    >([]);
    const [showEntryDetailsModal, setShowEntryDetailsModal] = useState(false);
    const { showToast, ToastContainer } = useToast();

    const [newAccount, setNewAccount] = useState({
        account_code: "",
        account_name: "",
        account_type: "assets" as const,
        parent_account_id: "",
        opening_balance: 0,
    });

    const [newEntry, setNewEntry] = useState({
        description: "",
        reference_type: "manual" as const,
        lines: [
            {
                account_id: "",
                debit_amount: 0,
                credit_amount: 0,
                description: "",
            },
            {
                account_id: "",
                debit_amount: 0,
                credit_amount: 0,
                description: "",
            },
        ],
    });

    // Mock data for demonstration
    const mockAccounts: Account[] = [
        // الأصول
        {
            id: "1",
            account_code: "1000",
            account_name: "الأصول المتداولة",
            account_type: "assets",
            balance: 0,
            is_active: true,
        },
        {
            id: "2",
            account_code: "1100",
            account_name: "النقدية والبنوك",
            account_type: "assets",
            parent_account_id: "1",
            balance: 150000,
            is_active: true,
        },
        {
            id: "3",
            account_code: "1110",
            account_name: "الصندوق",
            account_type: "assets",
            parent_account_id: "2",
            balance: 25000,
            is_active: true,
        },
        {
            id: "4",
            account_code: "1120",
            account_name: "البنك الأهلي",
            account_type: "assets",
            parent_account_id: "2",
            balance: 125000,
            is_active: true,
        },
        {
            id: "5",
            account_code: "1200",
            account_name: "المخزون",
            account_type: "assets",
            parent_account_id: "1",
            balance: 85000,
            is_active: true,
        },
        {
            id: "6",
            account_code: "1300",
            account_name: "العملاء",
            account_type: "assets",
            parent_account_id: "1",
            balance: 45000,
            is_active: true,
        },

        // الخصوم
        {
            id: "7",
            account_code: "2000",
            account_name: "الخصوم المتداولة",
            account_type: "liabilities",
            balance: 0,
            is_active: true,
        },
        {
            id: "8",
            account_code: "2100",
            account_name: "الموردين",
            account_type: "liabilities",
            parent_account_id: "7",
            balance: 65000,
            is_active: true,
        },
        {
            id: "9",
            account_code: "2200",
            account_name: "المصروفات المستحقة",
            account_type: "liabilities",
            parent_account_id: "7",
            balance: 15000,
            is_active: true,
        },

        // حقوق الملكية
        {
            id: "10",
            account_code: "3000",
            account_name: "حقوق الملكية",
            account_type: "equity",
            balance: 0,
            is_active: true,
        },
        {
            id: "11",
            account_code: "3100",
            account_name: "رأس المال",
            account_type: "equity",
            parent_account_id: "10",
            balance: 200000,
            is_active: true,
        },

        // الإيرادات
        {
            id: "12",
            account_code: "4000",
            account_name: "الإيرادات",
            account_type: "revenue",
            balance: 0,
            is_active: true,
        },
        {
            id: "13",
            account_code: "4100",
            account_name: "إيرادات المبيعات",
            account_type: "revenue",
            parent_account_id: "12",
            balance: 320000,
            is_active: true,
        },

        // المصروفات
        {
            id: "14",
            account_code: "5000",
            account_name: "المصروفات",
            account_type: "expenses",
            balance: 0,
            is_active: true,
        },
        {
            id: "15",
            account_code: "5100",
            account_name: "تكلفة البضاعة المباعة",
            account_type: "expenses",
            parent_account_id: "14",
            balance: 180000,
            is_active: true,
        },
        {
            id: "16",
            account_code: "5200",
            account_name: "الرواتب والأجور",
            account_type: "expenses",
            parent_account_id: "14",
            balance: 45000,
            is_active: true,
        },
        {
            id: "17",
            account_code: "5300",
            account_name: "مصروفات التشغيل",
            account_type: "expenses",
            parent_account_id: "14",
            balance: 25000,
            is_active: true,
        },
    ];

    const mockJournalEntries: JournalEntry[] = [
        {
            id: "1",
            entry_number: "JE-2024-001",
            entry_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                15
            )
                .toISOString()
                .split("T")[0],
            description: "شراء مواد خام من مزارع الخليج",
            reference_type: "purchase",
            reference_id: "PO-2024-001",
            total_amount: 5000,
            created_by: "أحمد محمد",
            approved_by: "المدير المالي",
            approved_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                15
            )
                .toISOString()
                .split("T")[0],
            status: "posted",
        },
        {
            id: "2",
            entry_number: "JE-2024-002",
            entry_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                16
            )
                .toISOString()
                .split("T")[0],
            description: "دفع راتب شهر يناير",
            reference_type: "salary",
            total_amount: 15000,
            created_by: "سارة أحمد",
            approved_by: "المدير المالي",
            approved_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                16
            )
                .toISOString()
                .split("T")[0],
            status: "posted",
        },
        {
            id: "3",
            entry_number: "JE-2024-003",
            entry_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                17
            )
                .toISOString()
                .split("T")[0],
            description: "مبيعات نقدية",
            reference_type: "invoice",
            total_amount: 8500,
            created_by: "محمد علي",
            status: "approved",
        },
        {
            id: "4",
            entry_number: "JE-2024-004",
            entry_date: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                18
            )
                .toISOString()
                .split("T")[0],
            description: "قيد محاسبي يدوي - تسوية",
            reference_type: "manual",
            total_amount: 3000,
            created_by: "محمد علي",
            status: "draft",
        },
    ];

    // Mock data for entry lines
    const mockEntryLines: JournalEntryLine[] = [
        {
            id: "1",
            journal_entry_id: "1",
            account_id: "5",
            account: mockAccounts.find((acc) => acc.id === "5")!,
            debit_amount: 5000,
            credit_amount: 0,
            description: "شراء مواد خام",
        },
        {
            id: "2",
            journal_entry_id: "1",
            account_id: "8",
            account: mockAccounts.find((acc) => acc.id === "8")!,
            debit_amount: 0,
            credit_amount: 5000,
            description: "دين على الموردين",
        },
        {
            id: "3",
            journal_entry_id: "2",
            account_id: "16",
            account: mockAccounts.find((acc) => acc.id === "16")!,
            debit_amount: 15000,
            credit_amount: 0,
            description: "دفع راتب",
        },
        {
            id: "4",
            journal_entry_id: "2",
            account_id: "2",
            account: mockAccounts.find((acc) => acc.id === "2")!,
            debit_amount: 0,
            credit_amount: 15000,
            description: "دفع من البنك",
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setAccounts(mockAccounts);
            setJournalEntries(mockJournalEntries);
            setEntryLines(mockEntryLines);
            setLoading(false);
        }, 300);
    }, []);

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleAddAccount = () => {
        // Validation
        if (!newAccount.account_code.trim()) {
            showToast("يرجى إدخال رمز الحساب", "error");
            return;
        }
        if (!newAccount.account_name.trim()) {
            showToast("يرجى إدخال اسم الحساب", "error");
            return;
        }
        if (
            accounts.some((acc) => acc.account_code === newAccount.account_code)
        ) {
            showToast("رمز الحساب موجود بالفعل", "error");
            return;
        }

        const newAccountData: Account = {
            id: `account-${Date.now()}`,
            account_code: newAccount.account_code,
            account_name: newAccount.account_name,
            account_type: newAccount.account_type,
            parent_account_id: newAccount.parent_account_id || undefined,
            balance: newAccount.opening_balance,
            is_active: true,
        };

        setAccounts((prev) => [...prev, newAccountData]);
        showToast("تم إضافة الحساب بنجاح", "success");
        setShowAddAccountModal(false);
        resetNewAccount();
    };

    const resetNewAccount = () => {
        setNewAccount({
            account_code: "",
            account_name: "",
            account_type: "assets",
            parent_account_id: "",
            opening_balance: 0,
        });
    };

    const handleAddJournalEntry = () => {
        // Validation
        if (!newEntry.description.trim()) {
            showToast("يرجى إدخال وصف القيد", "error");
            return;
        }

        const validLines = newEntry.lines.filter(
            (line) =>
                line.account_id &&
                (line.debit_amount > 0 || line.credit_amount > 0)
        );

        if (validLines.length < 2) {
            showToast("يرجى إضافة سطرين على الأقل", "error");
            return;
        }

        const totalDebit = validLines.reduce(
            (sum, line) => sum + line.debit_amount,
            0
        );
        const totalCredit = validLines.reduce(
            (sum, line) => sum + line.credit_amount,
            0
        );

        if (totalDebit !== totalCredit) {
            showToast("إجمالي المدين يجب أن يساوي إجمالي الدائن", "error");
            return;
        }

        const entryNumber = `JE-${new Date().getFullYear()}-${String(
            journalEntries.length + 1
        ).padStart(3, "0")}`;

        const entryId = `entry-${Date.now()}`;
        const newEntryData: JournalEntry = {
            id: entryId,
            entry_number: entryNumber,
            entry_date: new Date().toISOString().split("T")[0],
            description: newEntry.description,
            reference_type: newEntry.reference_type,
            total_amount: totalDebit,
            created_by: "المستخدم الحالي",
            status: "draft",
        };

        // Create entry lines for the new entry
        const newEntryLines: JournalEntryLine[] = validLines.map(
            (line, index) => {
                const account = accounts.find(
                    (acc) => acc.id === line.account_id
                );
                if (!account) {
                    throw new Error(`Account not found: ${line.account_id}`);
                }
                return {
                    id: `line-${entryId}-${index}`,
                    journal_entry_id: entryId,
                    account_id: line.account_id,
                    account: account,
                    debit_amount: line.debit_amount,
                    credit_amount: line.credit_amount,
                    description: line.description || "",
                };
            }
        );

        // Update state
        setJournalEntries((prev) => [newEntryData, ...prev]);
        setEntryLines((prev) => [...newEntryLines, ...prev]);
        showToast("تم إضافة القيد بنجاح", "success");
        setShowAddEntryModal(false);
        resetNewEntry();
    };

    const resetNewEntry = () => {
        setNewEntry({
            description: "",
            reference_type: "manual",
            lines: [
                {
                    account_id: "",
                    debit_amount: 0,
                    credit_amount: 0,
                    description: "",
                },
                {
                    account_id: "",
                    debit_amount: 0,
                    credit_amount: 0,
                    description: "",
                },
            ],
        });
    };

    const addEntryLine = () => {
        setNewEntry((prev) => ({
            ...prev,
            lines: [
                ...prev.lines,
                {
                    account_id: "",
                    debit_amount: 0,
                    credit_amount: 0,
                    description: "",
                },
            ],
        }));
    };

    const removeEntryLine = (index: number) => {
        if (newEntry.lines.length > 2) {
            setNewEntry((prev) => ({
                ...prev,
                lines: prev.lines.filter((_, i) => i !== index),
            }));
        }
    };

    const updateEntryLine = (index: number, field: string, value: any) => {
        setNewEntry((prev) => ({
            ...prev,
            lines: prev.lines.map((line, i) =>
                i === index ? { ...line, [field]: value } : line
            ),
        }));
    };

    const getAccountTypeText = (type: string) => {
        switch (type) {
            case "assets":
                return "الأصول";
            case "liabilities":
                return "الخصوم";
            case "equity":
                return "حقوق الملكية";
            case "revenue":
                return "الإيرادات";
            case "expenses":
                return "المصروفات";
            default:
                return type;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "draft":
                return "bg-gray-100 text-gray-800";
            case "approved":
                return "bg-blue-100 text-blue-800";
            case "posted":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "draft":
                return "مسودة";
            case "approved":
                return "معتمد";
            case "posted":
                return "مرحل";
            default:
                return status;
        }
    };

    // Filter journal entries
    const filteredJournalEntries = journalEntries.filter((entry) => {
        const entryDate = new Date(entry.entry_date);
        const fromDate = new Date(dateFilter.from);
        const toDate = new Date(dateFilter.to);
        toDate.setHours(23, 59, 59, 999);

        const matchesDate = entryDate >= fromDate && entryDate <= toDate;
        const matchesSearch =
            !searchQuery ||
            entry.entry_number
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            entry.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            entry.created_by.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || entry.status === statusFilter;

        return matchesDate && matchesSearch && matchesStatus;
    });

    const handleViewEntryDetails = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        // Get entry lines from state (which includes both mock and newly added entries)
        const linesFromState = entryLines.filter(
            (line) => line.journal_entry_id === entry.id
        );
        // If no lines found in state, try mockEntryLines (for initial mock data)
        const finalLines =
            linesFromState.length > 0
                ? linesFromState
                : mockEntryLines.filter(
                      (line) => line.journal_entry_id === entry.id
                  );
        setEntryDetailsLines(finalLines);
        setShowEntryDetailsModal(true);
    };

    const handleApproveEntry = (entry: JournalEntry) => {
        if (entry.status === "draft") {
            setJournalEntries((prev) =>
                prev.map((e) =>
                    e.id === entry.id
                        ? {
                              ...e,
                              status: "approved" as const,
                              approved_by: "المستخدم الحالي",
                              approved_date: new Date()
                                  .toISOString()
                                  .split("T")[0],
                          }
                        : e
                )
            );
            showToast("تم اعتماد القيد بنجاح", "success");
        }
    };

    const handlePostEntry = (entry: JournalEntry) => {
        if (entry.status === "approved") {
            setJournalEntries((prev) =>
                prev.map((e) =>
                    e.id === entry.id
                        ? {
                              ...e,
                              status: "posted" as const,
                          }
                        : e
                )
            );
            showToast("تم ترحيل القيد بنجاح", "success");
        }
    };

    const calculateTrialBalance = () => {
        return accounts.map((account) => {
            const debitBalance = ["assets", "expenses"].includes(
                account.account_type
            )
                ? account.balance
                : 0;
            const creditBalance = ["liabilities", "equity", "revenue"].includes(
                account.account_type
            )
                ? account.balance
                : 0;

            return {
                ...account,
                debit_balance: debitBalance,
                credit_balance: creditBalance,
            };
        });
    };

    const calculateProfitLoss = () => {
        const revenue = accounts
            .filter((acc) => acc.account_type === "revenue")
            .reduce((sum, acc) => sum + acc.balance, 0);
        const expenses = accounts
            .filter((acc) => acc.account_type === "expenses")
            .reduce((sum, acc) => sum + acc.balance, 0);
        const netIncome = revenue - expenses;

        return {
            revenue,
            expenses,
            netIncome,
            revenueAccounts: accounts.filter(
                (acc) => acc.account_type === "revenue"
            ),
            expenseAccounts: accounts.filter(
                (acc) => acc.account_type === "expenses"
            ),
        };
    };

    const calculateCashFlow = () => {
        // تدفقات نقدية تشغيلية
        const operatingCashFlow = {
            netIncome: 95000, // صافي الدخل
            depreciation: 5000, // الاستهلاك
            accountsReceivableChange: -10000, // تغيير في العملاء
            inventoryChange: -15000, // تغيير في المخزون
            accountsPayableChange: 8000, // تغيير في الموردين
            total: 83000,
        };

        // تدفقات نقدية استثمارية
        const investingCashFlow = {
            equipmentPurchase: -25000, // شراء معدات
            total: -25000,
        };

        // تدفقات نقدية تمويلية
        const financingCashFlow = {
            loanProceeds: 50000, // قروض جديدة
            dividendsPaid: -20000, // توزيعات أرباح
            total: 30000,
        };

        const netCashFlow =
            operatingCashFlow.total +
            investingCashFlow.total +
            financingCashFlow.total;

        return {
            operating: operatingCashFlow,
            investing: investingCashFlow,
            financing: financingCashFlow,
            netCashFlow,
            beginningCash: 62000,
            endingCash: 62000 + netCashFlow,
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    الحسابات العامة
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowTrialBalance(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-scales-line"></i>
                        ميزان المراجعة
                    </button>
                    <button
                        onClick={() => setShowProfitLoss(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-line-chart-line"></i>
                        الأرباح والخسائر
                    </button>
                    <button
                        onClick={() => setShowCashFlow(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-money-dollar-circle-line"></i>
                        التدفقات النقدية
                    </button>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <i className="ri-wallet-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الأصول
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {accounts
                                    .filter(
                                        (acc) => acc.account_type === "assets"
                                    )
                                    .reduce((sum, acc) => sum + acc.balance, 0)
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <i className="ri-bank-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الخصوم
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {accounts
                                    .filter(
                                        (acc) =>
                                            acc.account_type === "liabilities"
                                    )
                                    .reduce((sum, acc) => sum + acc.balance, 0)
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <i className="ri-pie-chart-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                حقوق الملكية
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {accounts
                                    .filter(
                                        (acc) => acc.account_type === "equity"
                                    )
                                    .reduce((sum, acc) => sum + acc.balance, 0)
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <i className="ri-arrow-up-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                الإيرادات
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {accounts
                                    .filter(
                                        (acc) => acc.account_type === "revenue"
                                    )
                                    .reduce((sum, acc) => sum + acc.balance, 0)
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <i className="ri-arrow-down-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                المصروفات
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {accounts
                                    .filter(
                                        (acc) => acc.account_type === "expenses"
                                    )
                                    .reduce((sum, acc) => sum + acc.balance, 0)
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* التبويبات */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab("accounts")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                                activeTab === "accounts"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            دليل الحسابات
                        </button>
                        <button
                            onClick={() => setActiveTab("journal")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                                activeTab === "journal"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            دفتر اليومية
                        </button>
                        <button
                            onClick={() => setActiveTab("ledger")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                                activeTab === "ledger"
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            دفتر الأستاذ
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "accounts" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    دليل الحسابات
                                </h3>
                                <button
                                    onClick={() => setShowAddAccountModal(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                                >
                                    <i className="ri-add-line"></i>
                                    إضافة حساب
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <colgroup>
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "30%" }} />
                                        <col style={{ width: "18%" }} />
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "20%" }} />
                                    </colgroup>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رمز الحساب
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                اسم الحساب
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                نوع الحساب
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الرصيد
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {accounts.map((account) => (
                                            <tr
                                                key={account.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {account.account_code}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="text-sm text-gray-900 truncate">
                                                        <span
                                                            className={
                                                                account.parent_account_id
                                                                    ? "mr-4"
                                                                    : ""
                                                            }
                                                        >
                                                            {
                                                                account.account_name
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {getAccountTypeText(
                                                            account.account_type
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="text-sm">
                                                        <span
                                                            className={
                                                                account.balance >=
                                                                0
                                                                    ? "text-green-600 font-medium"
                                                                    : "text-red-600 font-medium"
                                                            }
                                                        >
                                                            {Math.abs(
                                                                account.balance
                                                            ).toLocaleString()}{" "}
                                                            $
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            account.is_active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {account.is_active
                                                            ? "نشط"
                                                            : "غير نشط"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "journal" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    دفتر اليومية
                                </h3>
                                <button
                                    onClick={() => setShowAddEntryModal(true)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                                >
                                    <i className="ri-add-line"></i>
                                    إضافة قيد
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-4 items-end">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        من تاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter.from}
                                        onChange={(e) =>
                                            setDateFilter((prev) => ({
                                                ...prev,
                                                from: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        إلى تاريخ
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFilter.to}
                                        onChange={(e) =>
                                            setDateFilter((prev) => ({
                                                ...prev,
                                                to: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الحالة
                                    </label>
                                    <CustomSelect
                                        value={statusFilter}
                                        onChange={(value) =>
                                            setStatusFilter(value)
                                        }
                                        options={[
                                            { value: "all", label: "الكل" },
                                            { value: "draft", label: "مسودة" },
                                            {
                                                value: "approved",
                                                label: "معتمد",
                                            },
                                            { value: "posted", label: "مرحل" },
                                        ]}
                                        placeholder="اختر الحالة"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البحث
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="ابحث برقم القيد، الوصف، أو المنشئ..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <colgroup>
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "30%" }} />
                                        <col style={{ width: "15%" }} />
                                        <col style={{ width: "15%" }} />
                                        <col style={{ width: "16%" }} />
                                    </colgroup>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رقم القيد
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                التاريخ
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الوصف
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المبلغ
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredJournalEntries.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-3 py-8 text-center text-gray-500"
                                                >
                                                    لا توجد قيود محاسبية
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredJournalEntries.map(
                                                (entry) => (
                                                    <tr
                                                        key={entry.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-3 py-4">
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {
                                                                    entry.entry_number
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(
                                                                    entry.entry_date
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4">
                                                            <div className="text-sm text-gray-900 truncate">
                                                                {
                                                                    entry.description
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {entry.total_amount.toLocaleString()}{" "}
                                                                $
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4">
                                                            <span
                                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                                    entry.status
                                                                )}`}
                                                            >
                                                                {getStatusText(
                                                                    entry.status
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleViewEntryDetails(
                                                                            entry
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="عرض التفاصيل"
                                                                >
                                                                    <i className="ri-eye-line text-lg"></i>
                                                                </button>
                                                                {entry.status ===
                                                                    "draft" && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleApproveEntry(
                                                                                entry
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                                        title="اعتماد القيد"
                                                                    >
                                                                        <i className="ri-check-line text-lg"></i>
                                                                    </button>
                                                                )}
                                                                {entry.status ===
                                                                    "approved" && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handlePostEntry(
                                                                                entry
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                                        title="ترحيل القيد"
                                                                    >
                                                                        <i className="ri-arrow-right-line text-lg"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "ledger" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                دفتر الأستاذ العام
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    "assets",
                                    "liabilities",
                                    "equity",
                                    "revenue",
                                    "expenses",
                                ].map((type) => (
                                    <div
                                        key={type}
                                        className="bg-gray-50 p-4 rounded-lg"
                                    >
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            {getAccountTypeText(type)}
                                        </h4>
                                        <div className="space-y-2">
                                            {accounts
                                                .filter(
                                                    (acc) =>
                                                        acc.account_type ===
                                                            type &&
                                                        !acc.parent_account_id
                                                )
                                                .map((account) => (
                                                    <div
                                                        key={account.id}
                                                        className="bg-white p-3 rounded border"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    account.account_name
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {account.balance.toLocaleString()}{" "}
                                                                $
                                                            </span>
                                                        </div>
                                                        {accounts
                                                            .filter(
                                                                (acc) =>
                                                                    acc.parent_account_id ===
                                                                    account.id
                                                            )
                                                            .map(
                                                                (
                                                                    subAccount
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subAccount.id
                                                                        }
                                                                        className="mr-4 mt-2 flex justify-between items-center text-sm"
                                                                    >
                                                                        <span className="text-gray-600">
                                                                            {
                                                                                subAccount.account_name
                                                                            }
                                                                        </span>
                                                                        <span className="text-gray-600">
                                                                            {subAccount.balance.toLocaleString()}{" "}
                                                                            $
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال إضافة حساب */}
            {showAddAccountModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                إضافة حساب جديد
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddAccountModal(false);
                                    resetNewAccount();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رمز الحساب
                                </label>
                                <input
                                    type="text"
                                    value={newAccount.account_code}
                                    onChange={(e) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            account_code: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="مثال: 1100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم الحساب
                                </label>
                                <input
                                    type="text"
                                    value={newAccount.account_name}
                                    onChange={(e) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            account_name: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="مثال: النقدية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نوع الحساب
                                </label>
                                <CustomSelect
                                    value={newAccount.account_type}
                                    onChange={(value) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            account_type:
                                                value as Account["account_type"],
                                        }))
                                    }
                                    options={[
                                        { value: "assets", label: "الأصول" },
                                        {
                                            value: "liabilities",
                                            label: "الخصوم",
                                        },
                                        {
                                            value: "equity",
                                            label: "حقوق الملكية",
                                        },
                                        {
                                            value: "revenue",
                                            label: "الإيرادات",
                                        },
                                        {
                                            value: "expenses",
                                            label: "المصروفات",
                                        },
                                    ]}
                                    placeholder="اختر نوع الحساب"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الحساب الرئيسي
                                </label>
                                <CustomSelect
                                    value={newAccount.parent_account_id}
                                    onChange={(value) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            parent_account_id: value,
                                        }))
                                    }
                                    options={[
                                        { value: "", label: "لا يوجد" },
                                        ...accounts
                                            .filter(
                                                (acc) =>
                                                    acc.account_type ===
                                                        newAccount.account_type &&
                                                    !acc.parent_account_id
                                            )
                                            .map((account) => ({
                                                value: account.id,
                                                label: account.account_name,
                                            })),
                                    ]}
                                    placeholder="اختر الحساب الرئيسي"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الرصيد الافتتاحي
                                </label>
                                <input
                                    type="number"
                                    value={newAccount.opening_balance}
                                    onChange={(e) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            opening_balance:
                                                parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddAccountModal(false);
                                        resetNewAccount();
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddAccount}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إضافة الحساب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال إضافة قيد */}
            {showAddEntryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                إضافة قيد محاسبي
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddEntryModal(false);
                                    resetNewEntry();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    وصف القيد
                                </label>
                                <input
                                    type="text"
                                    value={newEntry.description}
                                    onChange={(e) =>
                                        setNewEntry((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="وصف العملية المحاسبية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نوع المرجع
                                </label>
                                <CustomSelect
                                    value={newEntry.reference_type}
                                    onChange={(value) =>
                                        setNewEntry((prev) => ({
                                            ...prev,
                                            reference_type:
                                                value as JournalEntry["reference_type"],
                                        }))
                                    }
                                    options={[
                                        { value: "manual", label: "قيد يدوي" },
                                        { value: "purchase", label: "مشتريات" },
                                        { value: "invoice", label: "فاتورة" },
                                        { value: "payment", label: "دفعة" },
                                        { value: "salary", label: "راتب" },
                                    ]}
                                    placeholder="اختر نوع المرجع"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium">
                                        تفاصيل القيد
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={addEntryLine}
                                        className="text-orange-600 hover:text-orange-800 cursor-pointer flex items-center gap-1 transition-colors"
                                    >
                                        <i className="ri-add-line"></i> إضافة
                                        سطر
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    الحساب
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    الوصف
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    مدين
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    دائن
                                                </th>
                                                <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">
                                                    إجراء
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newEntry.lines.map(
                                                (line, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-t"
                                                    >
                                                        <td className="px-3 py-2">
                                                            <select
                                                                value={
                                                                    line.account_id
                                                                }
                                                                onChange={(e) =>
                                                                    updateEntryLine(
                                                                        index,
                                                                        "account_id",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                            >
                                                                <option value="">
                                                                    اختر الحساب
                                                                </option>
                                                                {accounts.map(
                                                                    (
                                                                        account
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                account.id
                                                                            }
                                                                            value={
                                                                                account.id
                                                                            }
                                                                        >
                                                                            {
                                                                                account.account_code
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                account.account_name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    line.description
                                                                }
                                                                onChange={(e) =>
                                                                    updateEntryLine(
                                                                        index,
                                                                        "description",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                placeholder="وصف السطر"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="number"
                                                                value={
                                                                    line.debit_amount
                                                                }
                                                                onChange={(e) =>
                                                                    updateEntryLine(
                                                                        index,
                                                                        "debit_amount",
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                }
                                                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="0.00"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <input
                                                                type="number"
                                                                value={
                                                                    line.credit_amount
                                                                }
                                                                onChange={(e) =>
                                                                    updateEntryLine(
                                                                        index,
                                                                        "credit_amount",
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                }
                                                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="0.00"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 text-center">
                                                            {newEntry.lines
                                                                .length > 2 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeEntryLine(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="حذف السطر"
                                                                >
                                                                    <i className="ri-delete-bin-line text-lg"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td
                                                    colSpan={2}
                                                    className="px-3 py-2 text-right font-medium"
                                                >
                                                    الإجمالي:
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-gray-900">
                                                        {newEntry.lines
                                                            .reduce(
                                                                (sum, line) =>
                                                                    sum +
                                                                    line.debit_amount,
                                                                0
                                                            )
                                                            .toFixed(2)}{" "}
                                                        $
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-gray-900">
                                                        {newEntry.lines
                                                            .reduce(
                                                                (sum, line) =>
                                                                    sum +
                                                                    line.credit_amount,
                                                                0
                                                            )
                                                            .toFixed(2)}{" "}
                                                        $
                                                    </div>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {newEntry.lines.reduce(
                                    (sum, line) => sum + line.debit_amount,
                                    0
                                ) !==
                                    newEntry.lines.reduce(
                                        (sum, line) => sum + line.credit_amount,
                                        0
                                    ) && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm mt-2">
                                        <i className="ri-error-warning-line ml-1"></i>
                                        تحذير: إجمالي المدين لا يساوي إجمالي
                                        الدائن
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddEntryModal(false);
                                        resetNewEntry();
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddJournalEntry}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    حفظ القيد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال ميزان المراجعة */}
            {showTrialBalance && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                ميزان المراجعة
                            </h3>
                            <button
                                onClick={() => setShowTrialBalance(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed">
                                <colgroup>
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "35%" }} />
                                    <col style={{ width: "25%" }} />
                                    <col style={{ width: "25%" }} />
                                </colgroup>
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            رمز الحساب
                                        </th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            اسم الحساب
                                        </th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            مدين
                                        </th>
                                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            دائن
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calculateTrialBalance().map((account) => (
                                        <tr
                                            key={account.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {account.account_code}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="text-sm text-gray-900 truncate">
                                                    {account.account_name}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {account.debit_balance > 0
                                                        ? account.debit_balance.toLocaleString() +
                                                          " $"
                                                        : "-"}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {account.credit_balance > 0
                                                        ? account.credit_balance.toLocaleString() +
                                                          " $"
                                                        : "-"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-3 py-4 text-right font-bold"
                                        >
                                            الإجمالي:
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="font-bold text-gray-900">
                                                {calculateTrialBalance()
                                                    .reduce(
                                                        (sum, acc) =>
                                                            sum +
                                                            acc.debit_balance,
                                                        0
                                                    )
                                                    .toLocaleString()}{" "}
                                                $
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="font-bold text-gray-900">
                                                {calculateTrialBalance()
                                                    .reduce(
                                                        (sum, acc) =>
                                                            sum +
                                                            acc.credit_balance,
                                                        0
                                                    )
                                                    .toLocaleString()}{" "}
                                                $
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال الأرباح والخسائر */}
            {showProfitLoss && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                قائمة الأرباح والخسائر
                            </h3>
                            <button
                                onClick={() => setShowProfitLoss(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        {(() => {
                            const profitLoss = calculateProfitLoss();
                            return (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-green-600 mb-3">
                                            الإيرادات
                                        </h4>
                                        <div className="space-y-2">
                                            {profitLoss.revenueAccounts.map(
                                                (account) => (
                                                    <div
                                                        key={account.id}
                                                        className="flex justify-between"
                                                    >
                                                        <span>
                                                            {
                                                                account.account_name
                                                            }
                                                        </span>
                                                        <span>
                                                            {account.balance.toLocaleString()}{" "}
                                                            $
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>إجمالي الإيرادات</span>
                                                <span>
                                                    {profitLoss.revenue.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-red-600 mb-3">
                                            المصروفات
                                        </h4>
                                        <div className="space-y-2">
                                            {profitLoss.expenseAccounts.map(
                                                (account) => (
                                                    <div
                                                        key={account.id}
                                                        className="flex justify-between"
                                                    >
                                                        <span>
                                                            {
                                                                account.account_name
                                                            }
                                                        </span>
                                                        <span>
                                                            {account.balance.toLocaleString()}{" "}
                                                            $
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>إجمالي المصروفات</span>
                                                <span>
                                                    {profitLoss.expenses.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t-2 pt-4">
                                        <div
                                            className={`text-xl font-bold flex justify-between ${
                                                profitLoss.netIncome >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            <span>
                                                {profitLoss.netIncome >= 0
                                                    ? "صافي الربح"
                                                    : "صافي الخسارة"}
                                            </span>
                                            <span>
                                                {Math.abs(
                                                    profitLoss.netIncome
                                                ).toLocaleString()}{" "}
                                                $
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* مودال التدفقات النقدية */}
            {showCashFlow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                قائمة التدفقات النقدية
                            </h3>
                            <button
                                onClick={() => setShowCashFlow(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        {(() => {
                            const cashFlow = calculateCashFlow();
                            return (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-blue-600 mb-3">
                                            التدفقات النقدية التشغيلية
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>صافي الدخل</span>
                                                <span>
                                                    {cashFlow.operating.netIncome.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>الاستهلاك</span>
                                                <span>
                                                    {cashFlow.operating.depreciation.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>التغيير في العملاء</span>
                                                <span
                                                    className={
                                                        cashFlow.operating
                                                            .accountsReceivableChange <
                                                        0
                                                            ? "text-red-600"
                                                            : "text-green-600"
                                                    }
                                                >
                                                    {cashFlow.operating.accountsReceivableChange.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>التغيير في المخزون</span>
                                                <span
                                                    className={
                                                        cashFlow.operating
                                                            .inventoryChange < 0
                                                            ? "text-red-600"
                                                            : "text-green-600"
                                                    }
                                                >
                                                    {cashFlow.operating.inventoryChange.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>التغيير في الموردين</span>
                                                <span
                                                    className={
                                                        cashFlow.operating
                                                            .accountsPayableChange >
                                                        0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {cashFlow.operating.accountsPayableChange.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>
                                                    صافي التدفق التشغيلي
                                                </span>
                                                <span
                                                    className={
                                                        cashFlow.operating
                                                            .total >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {cashFlow.operating.total.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-purple-600 mb-3">
                                            التدفقات النقدية الاستثمارية
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>شراء معدات</span>
                                                <span className="text-red-600">
                                                    {cashFlow.investing.equipmentPurchase.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>
                                                    صافي التدفق الاستثماري
                                                </span>
                                                <span
                                                    className={
                                                        cashFlow.investing
                                                            .total >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {cashFlow.investing.total.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-orange-600 mb-3">
                                            التدفقات النقدية التمويلية
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>قروض جديدة</span>
                                                <span className="text-green-600">
                                                    {cashFlow.financing.loanProceeds.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>توزيعات أرباح</span>
                                                <span className="text-red-600">
                                                    {cashFlow.financing.dividendsPaid.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>
                                                    صافي التدفق التمويلي
                                                </span>
                                                <span
                                                    className={
                                                        cashFlow.financing
                                                            .total >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {cashFlow.financing.total.toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t-2 pt-4 space-y-2">
                                        <div className="flex justify-between font-semibold">
                                            <span>صافي التغيير في النقدية</span>
                                            <span
                                                className={
                                                    cashFlow.netCashFlow >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }
                                            >
                                                {cashFlow.netCashFlow.toLocaleString()}{" "}
                                                $
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>النقدية في بداية الفترة</span>
                                            <span>
                                                {cashFlow.beginningCash.toLocaleString()}{" "}
                                                $
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-blue-600">
                                            <span>النقدية في نهاية الفترة</span>
                                            <span>
                                                {cashFlow.endingCash.toLocaleString()}{" "}
                                                $
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* مودال تفاصيل القيد */}
            {showEntryDetailsModal && selectedEntry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                تفاصيل القيد: {selectedEntry.entry_number}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEntryDetailsModal(false);
                                    setSelectedEntry(null);
                                    setEntryDetailsLines([]);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رقم القيد
                                    </label>
                                    <div className="text-sm text-gray-900 font-medium">
                                        {selectedEntry.entry_number}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        التاريخ
                                    </label>
                                    <div className="text-sm text-gray-900">
                                        {formatDate(selectedEntry.entry_date)}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الوصف
                                    </label>
                                    <div className="text-sm text-gray-900">
                                        {selectedEntry.description}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نوع المرجع
                                    </label>
                                    <div className="text-sm text-gray-900">
                                        {selectedEntry.reference_type ===
                                            "manual" && "قيد يدوي"}
                                        {selectedEntry.reference_type ===
                                            "purchase" && "مشتريات"}
                                        {selectedEntry.reference_type ===
                                            "invoice" && "فاتورة"}
                                        {selectedEntry.reference_type ===
                                            "payment" && "دفعة"}
                                        {selectedEntry.reference_type ===
                                            "salary" && "راتب"}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الحالة
                                    </label>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                            selectedEntry.status
                                        )}`}
                                    >
                                        {getStatusText(selectedEntry.status)}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        المبلغ الإجمالي
                                    </label>
                                    <div className="text-sm font-bold text-gray-900">
                                        {selectedEntry.total_amount.toLocaleString()}{" "}
                                        $
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        المنشئ
                                    </label>
                                    <div className="text-sm text-gray-900">
                                        {selectedEntry.created_by}
                                    </div>
                                </div>
                                {selectedEntry.approved_by && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            المعتمد بواسطة
                                        </label>
                                        <div className="text-sm text-gray-900">
                                            {selectedEntry.approved_by}
                                        </div>
                                    </div>
                                )}
                                {selectedEntry.approved_date && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            تاريخ الاعتماد
                                        </label>
                                        <div className="text-sm text-gray-900">
                                            {formatDate(
                                                selectedEntry.approved_date
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    تفاصيل القيد
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed border border-gray-200 rounded-lg">
                                        <colgroup>
                                            <col style={{ width: "25%" }} />
                                            <col style={{ width: "35%" }} />
                                            <col style={{ width: "20%" }} />
                                            <col style={{ width: "20%" }} />
                                        </colgroup>
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    الحساب
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    الوصف
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    مدين
                                                </th>
                                                <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                                                    دائن
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {entryDetailsLines.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="px-3 py-4 text-center text-gray-500"
                                                    >
                                                        لا توجد تفاصيل
                                                    </td>
                                                </tr>
                                            ) : (
                                                entryDetailsLines.map(
                                                    (line) => (
                                                        <tr
                                                            key={line.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-3 py-2">
                                                                <div className="text-sm text-gray-900">
                                                                    {
                                                                        line
                                                                            .account
                                                                            .account_code
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        line
                                                                            .account
                                                                            .account_name
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <div className="text-sm text-gray-900 truncate">
                                                                    {
                                                                        line.description
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <div className="text-sm text-gray-900">
                                                                    {line.debit_amount >
                                                                    0
                                                                        ? line.debit_amount.toLocaleString() +
                                                                          " $"
                                                                        : "-"}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <div className="text-sm text-gray-900">
                                                                    {line.credit_amount >
                                                                    0
                                                                        ? line.credit_amount.toLocaleString() +
                                                                          " $"
                                                                        : "-"}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td
                                                    colSpan={2}
                                                    className="px-3 py-2 text-right font-medium"
                                                >
                                                    الإجمالي:
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-gray-900">
                                                        {entryDetailsLines
                                                            .reduce(
                                                                (sum, line) =>
                                                                    sum +
                                                                    line.debit_amount,
                                                                0
                                                            )
                                                            .toLocaleString()}{" "}
                                                        $
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-gray-900">
                                                        {entryDetailsLines
                                                            .reduce(
                                                                (sum, line) =>
                                                                    sum +
                                                                    line.credit_amount,
                                                                0
                                                            )
                                                            .toLocaleString()}{" "}
                                                        $
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEntryDetailsModal(false);
                                        setSelectedEntry(null);
                                        setEntryDetailsLines([]);
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
