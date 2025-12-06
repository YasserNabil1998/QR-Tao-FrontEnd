import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

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
    const [_selectedEntry, _setSelectedEntry] = useState<JournalEntry | null>(
        null
    );
    const [_entryLines, _setEntryLines] = useState<JournalEntryLine[]>([]);
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
            entry_date: "2024-01-15",
            description: "شراء مواد خام من مزارع الخليج",
            reference_type: "purchase",
            reference_id: "PO-2024-001",
            total_amount: 5000,
            created_by: "أحمد محمد",
            approved_by: "المدير المالي",
            approved_date: "2024-01-15",
            status: "posted",
        },
        {
            id: "2",
            entry_number: "JE-2024-002",
            entry_date: "2024-01-16",
            description: "دفع راتب شهر يناير",
            reference_type: "salary",
            total_amount: 15000,
            created_by: "سارة أحمد",
            approved_by: "المدير المالي",
            approved_date: "2024-01-16",
            status: "posted",
        },
        {
            id: "3",
            entry_number: "JE-2024-003",
            entry_date: "2024-01-17",
            description: "مبيعات نقدية",
            reference_type: "invoice",
            total_amount: 8500,
            created_by: "محمد علي",
            status: "approved",
        },
    ];

    useEffect(() => {
        fetchAccounts();
        fetchJournalEntries();
    }, []);

    const fetchAccounts = async () => {
        try {
            // في التطبيق الحقيقي، سيتم جلب البيانات من Supabase
            setAccounts(mockAccounts);
        } catch (error) {
            console.error("خطأ في جلب الحسابات:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJournalEntries = async () => {
        try {
            // في التطبيق الحقيقي، سيتم جلب البيانات من Supabase
            setJournalEntries(mockJournalEntries);
        } catch (error) {
            console.error("خطأ في جلب القيود:", error);
        }
    };

    const handleAddAccount = async () => {
        try {
            const accountCode = newAccount.account_code;
            const { error } = await supabase.from("chart_of_accounts").insert({
                account_code: accountCode,
                account_name: newAccount.account_name,
                account_type: newAccount.account_type,
                parent_account_id: newAccount.parent_account_id || null,
                balance: newAccount.opening_balance,
                is_active: true,
                restaurant_id: "00000000-0000-0000-0000-000000000000",
            });

            if (error) throw error;

            setShowAddAccountModal(false);
            resetNewAccount();
            fetchAccounts();
        } catch (error) {
            console.error("خطأ في إضافة الحساب:", error);
        }
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

    const handleAddJournalEntry = async () => {
        try {
            const totalDebit = newEntry.lines.reduce(
                (sum, line) => sum + line.debit_amount,
                0
            );
            const totalCredit = newEntry.lines.reduce(
                (sum, line) => sum + line.credit_amount,
                0
            );

            if (totalDebit !== totalCredit) {
                alert("إجمالي المدين يجب أن يساوي إجمالي الدائن");
                return;
            }

            const entryNumber = `JE-${Date.now()}`;

            const { data: entryData, error: entryError } = await supabase
                .from("journal_entries")
                .insert({
                    entry_number: entryNumber,
                    entry_date: new Date().toISOString().split("T")[0],
                    description: newEntry.description,
                    reference_type: newEntry.reference_type,
                    total_amount: totalDebit,
                    created_by: "المستخدم الحالي",
                    status: "draft",
                    restaurant_id: "00000000-0000-0000-0000-000000000000",
                })
                .select()
                .single();

            if (entryError) throw entryError;

            // إضافة تفاصيل القيد
            const entryLines = newEntry.lines
                .filter(
                    (line) =>
                        line.account_id &&
                        (line.debit_amount > 0 || line.credit_amount > 0)
                )
                .map((line) => ({
                    journal_entry_id: entryData.id,
                    account_id: line.account_id,
                    debit_amount: line.debit_amount,
                    credit_amount: line.credit_amount,
                    description: line.description,
                }));

            const { error: linesError } = await supabase
                .from("journal_entry_lines")
                .insert(entryLines);

            if (linesError) throw linesError;

            setShowAddEntryModal(false);
            resetNewEntry();
            fetchJournalEntries();
        } catch (error) {
            console.error("خطأ في إضافة القيد:", error);
        }
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
                                ج.م
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
                                ج.م
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
                                ج.م
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
                                ج.م
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
                                ج.م
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
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رمز الحساب
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                اسم الحساب
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                نوع الحساب
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الرصيد
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {account.account_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span
                                                        className={
                                                            account.parent_account_id
                                                                ? "mr-4"
                                                                : ""
                                                        }
                                                    >
                                                        {account.account_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getAccountTypeText(
                                                        account.account_type
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span
                                                        className={
                                                            account.balance >= 0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {Math.abs(
                                                            account.balance
                                                        ).toLocaleString()}{" "}
                                                        ج.م
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
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

                            <div className="flex gap-4 mb-4">
                                <input
                                    type="date"
                                    value={dateFilter.from}
                                    onChange={(e) =>
                                        setDateFilter((prev) => ({
                                            ...prev,
                                            from: e.target.value,
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                                <input
                                    type="date"
                                    value={dateFilter.to}
                                    onChange={(e) =>
                                        setDateFilter((prev) => ({
                                            ...prev,
                                            to: e.target.value,
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                رقم القيد
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                التاريخ
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الوصف
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المبلغ
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الحالة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجراءات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {journalEntries.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {entry.entry_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(
                                                        entry.entry_date
                                                    ).toLocaleDateString(
                                                        "ar-SA"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {entry.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.total_amount.toLocaleString()}{" "}
                                                    ج.م
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedEntry(
                                                                entry
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                                        title="عرض التفاصيل"
                                                    >
                                                        <i className="ri-eye-line"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                                                                ج.م
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
                                                                            ج.م
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                إضافة حساب جديد
                            </h3>
                            <button
                                onClick={() => setShowAddAccountModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="مثال: 1100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="مثال: النقدية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    نوع الحساب
                                </label>
                                <select
                                    value={newAccount.account_type}
                                    onChange={(e) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            account_type: e.target.value as any,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                >
                                    <option value="assets">الأصول</option>
                                    <option value="liabilities">الخصوم</option>
                                    <option value="equity">حقوق الملكية</option>
                                    <option value="revenue">الإيرادات</option>
                                    <option value="expenses">المصروفات</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الحساب الرئيسي
                                </label>
                                <select
                                    value={newAccount.parent_account_id}
                                    onChange={(e) =>
                                        setNewAccount((prev) => ({
                                            ...prev,
                                            parent_account_id: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                >
                                    <option value="">لا يوجد</option>
                                    {accounts
                                        .filter(
                                            (acc) =>
                                                acc.account_type ===
                                                    newAccount.account_type &&
                                                !acc.parent_account_id
                                        )
                                        .map((account) => (
                                            <option
                                                key={account.id}
                                                value={account.id}
                                            >
                                                {account.account_name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    step="0.01"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() =>
                                        setShowAddAccountModal(false)
                                    }
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddAccount}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                إضافة قيد محاسبي
                            </h3>
                            <button
                                onClick={() => setShowAddEntryModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="وصف العملية المحاسبية"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    نوع المرجع
                                </label>
                                <select
                                    value={newEntry.reference_type}
                                    onChange={(e) =>
                                        setNewEntry((prev) => ({
                                            ...prev,
                                            reference_type: e.target
                                                .value as any,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                >
                                    <option value="manual">قيد يدوي</option>
                                    <option value="purchase">مشتريات</option>
                                    <option value="invoice">فاتورة</option>
                                    <option value="payment">دفعة</option>
                                    <option value="salary">راتب</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium">
                                        تفاصيل القيد
                                    </h4>
                                    <button
                                        onClick={addEntryLine}
                                        className="text-orange-600 hover:text-orange-800 cursor-pointer"
                                    >
                                        <i className="ri-add-line"></i> إضافة
                                        سطر
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                                                    الحساب
                                                </th>
                                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                                                    الوصف
                                                </th>
                                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                                                    مدين
                                                </th>
                                                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                                                    دائن
                                                </th>
                                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
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
                                                        <td className="px-4 py-2">
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
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm pr-8"
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
                                                        <td className="px-4 py-2">
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
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                                placeholder="وصف السطر"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
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
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                                step="0.01"
                                                                min="0"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
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
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                                step="0.01"
                                                                min="0"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            {newEntry.lines
                                                                .length > 2 && (
                                                                <button
                                                                    onClick={() =>
                                                                        removeEntryLine(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800 cursor-pointer"
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
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
                                                    className="px-4 py-2 text-right font-medium"
                                                >
                                                    الإجمالي:
                                                </td>
                                                <td className="px-4 py-2 font-medium">
                                                    {newEntry.lines
                                                        .reduce(
                                                            (sum, line) =>
                                                                sum +
                                                                line.debit_amount,
                                                            0
                                                        )
                                                        .toFixed(2)}{" "}
                                                    ج.م
                                                </td>
                                                <td className="px-4 py-2 font-medium">
                                                    {newEntry.lines
                                                        .reduce(
                                                            (sum, line) =>
                                                                sum +
                                                                line.credit_amount,
                                                            0
                                                        )
                                                        .toFixed(2)}{" "}
                                                    ج.م
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
                                    <div className="text-red-600 text-sm mt-2">
                                        تحذير: إجمالي المدين لا يساوي إجمالي
                                        الدائن
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddEntryModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddJournalEntry}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                ميزان المراجعة
                            </h3>
                            <button
                                onClick={() => setShowTrialBalance(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            رمز الحساب
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            اسم الحساب
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            مدين
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            دائن
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {calculateTrialBalance().map((account) => (
                                        <tr key={account.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {account.account_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.account_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.debit_balance > 0
                                                    ? account.debit_balance.toLocaleString() +
                                                      " ج.م"
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {account.credit_balance > 0
                                                    ? account.credit_balance.toLocaleString() +
                                                      " ج.م"
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-6 py-4 text-right font-bold"
                                        >
                                            الإجمالي:
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {calculateTrialBalance()
                                                .reduce(
                                                    (sum, acc) =>
                                                        sum + acc.debit_balance,
                                                    0
                                                )
                                                .toLocaleString()}{" "}
                                            ج.م
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {calculateTrialBalance()
                                                .reduce(
                                                    (sum, acc) =>
                                                        sum +
                                                        acc.credit_balance,
                                                    0
                                                )
                                                .toLocaleString()}{" "}
                                            ج.م
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                قائمة الأرباح والخسائر
                            </h3>
                            <button
                                onClick={() => setShowProfitLoss(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
                                                            ج.م
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>إجمالي الإيرادات</span>
                                                <span>
                                                    {profitLoss.revenue.toLocaleString()}{" "}
                                                    ج.م
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
                                                            ج.م
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            <div className="border-t pt-2 font-semibold flex justify-between">
                                                <span>إجمالي المصروفات</span>
                                                <span>
                                                    {profitLoss.expenses.toLocaleString()}{" "}
                                                    ج.م
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
                                                ج.م
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
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                قائمة التدفقات النقدية
                            </h3>
                            <button
                                onClick={() => setShowCashFlow(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
                                                    ج.م
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>الاستهلاك</span>
                                                <span>
                                                    {cashFlow.operating.depreciation.toLocaleString()}{" "}
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
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
                                                    ج.م
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>توزيعات أرباح</span>
                                                <span className="text-red-600">
                                                    {cashFlow.financing.dividendsPaid.toLocaleString()}{" "}
                                                    ج.م
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
                                                    ج.م
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
                                                ج.م
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>النقدية في بداية الفترة</span>
                                            <span>
                                                {cashFlow.beginningCash.toLocaleString()}{" "}
                                                ج.م
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-blue-600">
                                            <span>النقدية في نهاية الفترة</span>
                                            <span>
                                                {cashFlow.endingCash.toLocaleString()}{" "}
                                                ج.م
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
