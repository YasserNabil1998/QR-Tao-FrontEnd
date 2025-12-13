import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface Invoice {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    status: "pending" | "paid" | "overdue" | "cancelled" | "partial";
    total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    payment_date?: string;
    payment_method?: string;
    supplier: {
        name: string;
    };
    notes?: string;
    invoice_file_url?: string;
    approved_by?: string;
    approved_date?: string;
    tax_amount: number;
    subtotal: number;
}

interface PaymentHistory {
    id: string;
    invoice_id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    notes?: string;
}

export default function InvoicesManagement() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentHistoryModal, setShowPaymentHistoryModal] =
        useState(false);
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null
    );
    const [invoiceToCancel, setInvoiceToCancel] = useState<Invoice | null>(
        null
    );
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const { showToast, ToastContainer } = useToast();

    // Mock payment history - using state to allow updates
    const [paymentHistoryData, setPaymentHistoryData] = useState<{
        [key: string]: PaymentHistory[];
    }>({
        "2": [
            {
                id: "1",
                invoice_id: "2",
                amount: 2070,
                payment_date: "2024-01-14",
                payment_method: "bank_transfer",
                notes: "تم الدفع كاملاً",
            },
        ],
        "3": [
            {
                id: "2",
                invoice_id: "3",
                amount: 500,
                payment_date: "2024-01-12",
                payment_method: "cash",
                notes: "دفعة جزئية",
            },
        ],
    });

    const [newInvoice, setNewInvoice] = useState({
        supplier_id: "",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: "",
        subtotal: 0,
        tax_amount: 0,
        notes: "",
    });

    const [paymentData, setPaymentData] = useState({
        amount: 0,
        payment_method: "cash",
        payment_date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const [fileUpload, setFileUpload] = useState<File | null>(null);

    // Mock data
    const mockSuppliers = [
        { id: "1", name: "مزارع الخليج" },
        { id: "2", name: "شركة الحبوب المتحدة" },
        { id: "3", name: "مزارع الرياض" },
    ];

    const mockInvoices: Invoice[] = [
        {
            id: "1",
            invoice_number: "INV-2024-001",
            invoice_date: "2024-01-15",
            due_date: "2024-02-15",
            status: "pending",
            total_amount: 3300,
            paid_amount: 0,
            remaining_amount: 3300,
            supplier: { name: "مزارع الخليج" },
            tax_amount: 375,
            subtotal: 2925,
            invoice_file_url: undefined,
            payment_method: undefined,
            notes: "فاتورة طلب شراء رقم PO-2024-001",
            approved_by: undefined,
            approved_date: undefined,
            payment_date: undefined,
        },
        {
            id: "2",
            invoice_number: "INV-2024-002",
            invoice_date: "2024-01-14",
            due_date: "2024-01-29",
            status: "paid",
            total_amount: 2070,
            paid_amount: 2070,
            remaining_amount: 0,
            supplier: { name: "شركة الحبوب المتحدة" },
            tax_amount: 270,
            subtotal: 1800,
            invoice_file_url: undefined,
            payment_method: "تحويل بنكي",
            notes: "تم الدفع كاملاً",
            approved_by: undefined,
            approved_date: undefined,
            payment_date: undefined,
        },
        {
            id: "3",
            invoice_number: "INV-2024-003",
            invoice_date: "2024-01-10",
            due_date: "2024-01-20",
            status: "overdue",
            total_amount: 1725,
            paid_amount: 500,
            remaining_amount: 1225,
            supplier: { name: "مزارع الخليج" },
            tax_amount: 225,
            subtotal: 1500,
            invoice_file_url: undefined,
            payment_method: "نقدي",
            notes: "دفعة جزئية - متبقي 1225 $",
            approved_by: undefined,
            approved_date: undefined,
            payment_date: undefined,
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setInvoices(mockInvoices);
            setSuppliers(mockSuppliers);
            setLoading(false);
        }, 300);
    }, []);

    const fetchPaymentHistory = (invoiceId: string) => {
        const history = paymentHistoryData[invoiceId] || [];
        setPaymentHistory(history);
    };

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleAddInvoice = () => {
        // Validation
        if (!newInvoice.supplier_id) {
            showToast("يرجى اختيار المورد", "error");
            return;
        }
        if (!newInvoice.invoice_date) {
            showToast("يرجى إدخال تاريخ الفاتورة", "error");
            return;
        }
        if (!newInvoice.due_date) {
            showToast("يرجى إدخال تاريخ الاستحقاق", "error");
            return;
        }
        if (newInvoice.subtotal <= 0) {
            showToast("يرجى إدخال مبلغ أساسي صحيح", "error");
            return;
        }
        if (newInvoice.tax_amount < 0) {
            showToast("مبلغ الضريبة يجب أن يكون أكبر من أو يساوي صفر", "error");
            return;
        }

        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
            invoices.length + 1
        ).padStart(3, "0")}`;
        const totalAmount = newInvoice.subtotal + newInvoice.tax_amount;

        const selectedSupplier = suppliers.find(
            (s) => s.id === newInvoice.supplier_id
        );

        const newInvoiceData: Invoice = {
            id: `invoice-${Date.now()}`,
            invoice_number: invoiceNumber,
            invoice_date: newInvoice.invoice_date,
            due_date: newInvoice.due_date,
            status: "pending",
            total_amount: totalAmount,
            paid_amount: 0,
            remaining_amount: totalAmount,
            supplier: { name: selectedSupplier?.name || "" },
            notes: newInvoice.notes,
            tax_amount: newInvoice.tax_amount,
            subtotal: newInvoice.subtotal,
        };

        setInvoices((prev) => [newInvoiceData, ...prev]);
        showToast("تم إضافة الفاتورة بنجاح", "success");
        setShowAddModal(false);
        resetNewInvoice();
    };

    const resetNewInvoice = () => {
        setNewInvoice({
            supplier_id: "",
            invoice_date: new Date().toISOString().split("T")[0],
            due_date: "",
            subtotal: 0,
            tax_amount: 0,
            notes: "",
        });
    };

    const handlePayment = () => {
        if (!selectedInvoice) return;

        // Validation
        if (paymentData.amount <= 0) {
            showToast("يرجى إدخال مبلغ صحيح", "error");
            return;
        }
        if (paymentData.amount > selectedInvoice.remaining_amount) {
            showToast("المبلغ المدخل أكبر من المبلغ المتبقي", "error");
            return;
        }
        if (!paymentData.payment_date) {
            showToast("يرجى إدخال تاريخ الدفع", "error");
            return;
        }

        const newPaidAmount = selectedInvoice.paid_amount + paymentData.amount;
        const newRemainingAmount = selectedInvoice.total_amount - newPaidAmount;
        let newStatus: Invoice["status"] = "pending";

        if (newRemainingAmount <= 0) {
            newStatus = "paid";
        } else if (newPaidAmount > 0) {
            newStatus = "partial";
        }

        // Update invoice
        setInvoices((prev) =>
            prev.map((inv) =>
                inv.id === selectedInvoice.id
                    ? {
                          ...inv,
                          paid_amount: newPaidAmount,
                          remaining_amount: newRemainingAmount,
                          status: newStatus,
                          payment_date: paymentData.payment_date,
                          payment_method: paymentData.payment_method,
                      }
                    : inv
            )
        );

        // Add to payment history
        const newPayment: PaymentHistory = {
            id: `payment-${Date.now()}`,
            invoice_id: selectedInvoice.id,
            amount: paymentData.amount,
            payment_date: paymentData.payment_date,
            payment_method: paymentData.payment_method,
            notes: paymentData.notes,
        };

        setPaymentHistoryData((prev) => {
            const current = prev[selectedInvoice.id] || [];
            return {
                ...prev,
                [selectedInvoice.id]: [...current, newPayment],
            };
        });

        // Show success message
        showToast("تم تسجيل الدفعة بنجاح", "success");

        // Reset payment data first
        resetPaymentData();

        // Close modal immediately
        setShowPaymentModal(false);

        // Clear selected invoice immediately after closing modal
        setSelectedInvoice(null);
    };

    const resetPaymentData = () => {
        setPaymentData({
            amount: 0,
            payment_method: "cash",
            payment_date: new Date().toISOString().split("T")[0],
            notes: "",
        });
    };

    const updateInvoiceStatus = (id: string, status: Invoice["status"]) => {
        setInvoices((prev) =>
            prev.map((inv) => {
                if (inv.id === id) {
                    const updated: Invoice = {
                        ...inv,
                        status,
                    };
                    if (status === "cancelled") {
                        showToast("تم إلغاء الفاتورة بنجاح", "success");
                    }
                    return updated;
                }
                return inv;
            })
        );
    };

    const handleCancelInvoice = () => {
        if (invoiceToCancel) {
            updateInvoiceStatus(invoiceToCancel.id, "cancelled");
            setShowCancelModal(false);
            setInvoiceToCancel(null);
        }
    };

    const openCancelModal = (invoice: Invoice) => {
        setInvoiceToCancel(invoice);
        setShowCancelModal(true);
    };

    const openPaymentModal = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setPaymentData({
            amount: invoice.remaining_amount,
            payment_method: "cash",
            payment_date: new Date().toISOString().split("T")[0],
            notes: "",
        });
        setShowPaymentModal(true);
    };

    const openPaymentHistoryModal = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        fetchPaymentHistory(invoice.id);
        setShowPaymentHistoryModal(true);
    };

    const handleFileUpload = () => {
        if (!fileUpload || !selectedInvoice) {
            showToast("يرجى اختيار ملف", "error");
            return;
        }

        // Simulate file upload
        const fileUrl = `invoices/${
            selectedInvoice.invoice_number
        }.${fileUpload.name.split(".").pop()}`;

        setInvoices((prev) =>
            prev.map((inv) =>
                inv.id === selectedInvoice.id
                    ? { ...inv, invoice_file_url: fileUrl }
                    : inv
            )
        );

        showToast("تم رفع الملف بنجاح", "success");
        setShowFileUploadModal(false);
        setFileUpload(null);
        setSelectedInvoice(null);
    };

    const sendPaymentReminder = (invoice: Invoice) => {
        showToast(
            `تم إرسال تذكير للمورد ${invoice.supplier?.name} بخصوص الفاتورة ${invoice.invoice_number}`,
            "success"
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "paid":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-blue-100 text-blue-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "في الانتظار";
            case "paid":
                return "مدفوعة";
            case "partial":
                return "مدفوعة جزئياً";
            case "overdue":
                return "متأخرة";
            case "cancelled":
                return "ملغية";
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return "نقدي";
            case "bank_transfer":
                return "تحويل بنكي";
            case "check":
                return "شيك";
            case "credit_card":
                return "بطاقة ائتمان";
            default:
                return method;
        }
    };

    const isOverdue = (dueDate: string, status: string) => {
        return (
            (status === "pending" || status === "partial") &&
            new Date(dueDate) < new Date()
        );
    };

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.invoice_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            invoice.supplier?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDate =
            !dateFilter || invoice.invoice_date.startsWith(dateFilter);

        let matchesStatus = true;
        if (filter === "overdue") {
            matchesStatus = isOverdue(invoice.due_date, invoice.status);
        } else if (filter !== "all") {
            matchesStatus = invoice.status === filter;
        }

        return matchesSearch && matchesDate && matchesStatus;
    });

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة الفواتير
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    <i className="ri-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة فاتورة جديدة</span>
                </button>
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-file-list-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الفواتير
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {invoices.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                            <i className="ri-check-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                مدفوعة
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "paid"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                            <i className="ri-time-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                في الانتظار
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "pending"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-pie-chart-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                مدفوعة جزئياً
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "partial"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                            <i className="ri-alarm-warning-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                متأخرة
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    invoices.filter((inv) =>
                                        isOverdue(inv.due_date, inv.status)
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* إحصائيات المبالغ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 font-cairo">
                        إجمالي المبالغ
                    </h3>
                    <div className="text-right">
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {invoices
                                .reduce(
                                    (total, invoice) =>
                                        total + invoice.total_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            $
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 font-cairo">
                        المبالغ المدفوعة
                    </h3>
                    <div className="text-right">
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {invoices
                                .reduce(
                                    (total, invoice) =>
                                        total + invoice.paid_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            $
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 font-cairo">
                        المبالغ المتبقية
                    </h3>
                    <div className="text-right">
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {invoices
                                .reduce(
                                    (total, invoice) =>
                                        total +
                                        (invoice.total_amount -
                                            invoice.paid_amount),
                                    0
                                )
                                .toLocaleString()}{" "}
                            $
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-2 font-cairo">
                        متأخرة
                    </h3>
                    <div className="text-right">
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {invoices
                                .filter((i) => isOverdue(i.due_date, i.status))
                                .reduce(
                                    (total, invoice) =>
                                        total +
                                        (invoice.total_amount -
                                            invoice.paid_amount),
                                    0
                                )
                                .toLocaleString()}{" "}
                            $
                        </p>
                    </div>
                </div>
            </div>

            {/* فلاتر وبحث */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <input
                        type="text"
                        placeholder="البحث في الفواتير..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                <div className="w-full sm:w-48">
                    <CustomSelect
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع الفواتير" },
                            { value: "pending", label: "في الانتظار" },
                            { value: "paid", label: "مدفوعة" },
                            { value: "partial", label: "مدفوعة جزئياً" },
                            { value: "overdue", label: "متأخرة" },
                            { value: "cancelled", label: "ملغية" },
                        ]}
                        placeholder="فلترة حسب الحالة"
                        className="w-full sm:w-48"
                    />
                </div>
                <input
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="فلترة حسب الشهر"
                />
            </div>

            {/* جدول الفواتير */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "16%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم الفاتورة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المورد
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الفاتورة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الاستحقاق
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ الإجمالي
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ المدفوع
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ المتبقي
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
                            {filteredInvoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {invoice.invoice_number}
                                            {invoice.invoice_file_url && (
                                                <i
                                                    className="ri-attachment-line text-blue-500 mr-1"
                                                    title="يحتوي على ملف مرفق"
                                                ></i>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {invoice.supplier?.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(invoice.invoice_date)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div
                                            className={`text-sm ${
                                                isOverdue(
                                                    invoice.due_date,
                                                    invoice.status
                                                )
                                                    ? "text-red-600 font-semibold"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {formatDate(invoice.due_date)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {invoice.total_amount.toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {invoice.paid_amount.toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-red-600">
                                            {(
                                                invoice.total_amount -
                                                invoice.paid_amount
                                            ).toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                isOverdue(
                                                    invoice.due_date,
                                                    invoice.status
                                                )
                                                    ? "bg-red-100 text-red-800"
                                                    : getStatusColor(
                                                          invoice.status
                                                      )
                                            }`}
                                        >
                                            {isOverdue(
                                                invoice.due_date,
                                                invoice.status
                                            )
                                                ? "متأخرة"
                                                : getStatusText(invoice.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            {(invoice.status === "pending" ||
                                                invoice.status === "partial") &&
                                                invoice.remaining_amount >
                                                    0 && (
                                                    <button
                                                        onClick={() =>
                                                            openPaymentModal(
                                                                invoice
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                        title="تسجيل دفعة"
                                                    >
                                                        <i className="ri-money-dollar-circle-line text-lg"></i>
                                                    </button>
                                                )}
                                            {invoice.paid_amount > 0 && (
                                                <button
                                                    onClick={() =>
                                                        openPaymentHistoryModal(
                                                            invoice
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تاريخ المدفوعات"
                                                >
                                                    <i className="ri-history-line text-lg"></i>
                                                </button>
                                            )}
                                            {!invoice.invoice_file_url && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedInvoice(
                                                            invoice
                                                        );
                                                        setShowFileUploadModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="رفع ملف الفاتورة"
                                                >
                                                    <i className="ri-upload-line text-lg"></i>
                                                </button>
                                            )}
                                            {isOverdue(
                                                invoice.due_date,
                                                invoice.status
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        sendPaymentReminder(
                                                            invoice
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="إرسال تذكير"
                                                >
                                                    <i className="ri-notification-line text-lg"></i>
                                                </button>
                                            )}
                                            {(invoice.status === "pending" ||
                                                invoice.status ===
                                                    "partial") && (
                                                <button
                                                    onClick={() =>
                                                        openCancelModal(invoice)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="إلغاء الفاتورة"
                                                >
                                                    <i className="ri-close-line text-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tablet Table (MD to LG) */}
                <div className="hidden md:block xl:hidden overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الفاتورة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المورد</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاستحقاق</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ الإجمالي</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المتبقي</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {invoice.invoice_number}
                                            {invoice.invoice_file_url && (
                                                <i className="ri-attachment-line text-blue-500 mr-1 text-xs" title="ملف"></i>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{invoice.supplier?.name}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className={`text-xs ${isOverdue(invoice.due_date, invoice.status) ? "text-red-600 font-semibold" : "text-gray-900"}`}>
                                            {formatDate(invoice.due_date)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {invoice.total_amount.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-red-600">
                                            {(invoice.total_amount - invoice.paid_amount).toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isOverdue(invoice.due_date, invoice.status) ? "bg-red-100 text-red-800" : getStatusColor(invoice.status)}`}>
                                            {isOverdue(invoice.due_date, invoice.status) ? "متأخرة" : getStatusText(invoice.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            {(invoice.status === "pending" || invoice.status === "partial") && invoice.remaining_amount > 0 && (
                                                <button
                                                    onClick={() => openPaymentModal(invoice)}
                                                    className="w-7 h-7 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="دفعة"
                                                >
                                                    <i className="ri-money-dollar-circle-line text-base"></i>
                                                </button>
                                            )}
                                            {invoice.paid_amount > 0 && (
                                                <button
                                                    onClick={() => openPaymentHistoryModal(invoice)}
                                                    className="w-7 h-7 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تاريخ"
                                                >
                                                    <i className="ri-history-line text-base"></i>
                                                </button>
                                            )}
                                            {!invoice.invoice_file_url && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice);
                                                        setShowFileUploadModal(true);
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="رفع"
                                                >
                                                    <i className="ri-upload-line text-base"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                        {invoice.invoice_number}
                                        {invoice.invoice_file_url && (
                                            <i className="ri-attachment-line text-blue-500 mr-1 text-xs" title="ملف"></i>
                                        )}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate font-tajawal">
                                        {invoice.supplier?.name}
                                    </p>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${isOverdue(invoice.due_date, invoice.status) ? "bg-red-100 text-red-800" : getStatusColor(invoice.status)}`}>
                                    {isOverdue(invoice.due_date, invoice.status) ? "متأخرة" : getStatusText(invoice.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">تاريخ الفاتورة:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block">{formatDate(invoice.invoice_date)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">تاريخ الاستحقاق:</span>
                                    <span className={`text-sm font-medium mr-2 font-cairo block ${isOverdue(invoice.due_date, invoice.status) ? "text-red-600" : "text-gray-900"}`}>
                                        {formatDate(invoice.due_date)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">المبلغ الإجمالي:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{invoice.total_amount.toLocaleString()} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">المبلغ المدفوع:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo">{invoice.paid_amount.toLocaleString()} $</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-gray-600 font-tajawal">المبلغ المتبقي:</span>
                                    <span className="text-sm font-semibold text-red-600 mr-2 font-cairo">{(invoice.total_amount - invoice.paid_amount).toLocaleString()} $</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                {(invoice.status === "pending" || invoice.status === "partial") && invoice.remaining_amount > 0 && (
                                    <button
                                        onClick={() => openPaymentModal(invoice)}
                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                        title="تسجيل دفعة"
                                    >
                                        <i className="ri-money-dollar-circle-line text-lg"></i>
                                    </button>
                                )}
                                {invoice.paid_amount > 0 && (
                                    <button
                                        onClick={() => openPaymentHistoryModal(invoice)}
                                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        title="تاريخ المدفوعات"
                                    >
                                        <i className="ri-history-line text-lg"></i>
                                    </button>
                                )}
                                {!invoice.invoice_file_url && (
                                    <button
                                        onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setShowFileUploadModal(true);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                        title="رفع ملف"
                                    >
                                        <i className="ri-upload-line text-lg"></i>
                                    </button>
                                )}
                                {isOverdue(invoice.due_date, invoice.status) && (
                                    <button
                                        onClick={() => sendPaymentReminder(invoice)}
                                        className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                        title="تذكير"
                                    >
                                        <i className="ri-notification-line text-lg"></i>
                                    </button>
                                )}
                                {(invoice.status === "pending" || invoice.status === "partial") && (
                                    <button
                                        onClick={() => openCancelModal(invoice)}
                                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="إلغاء"
                                    >
                                        <i className="ri-close-line text-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredInvoices.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-file-list-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد فواتير</p>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال إضافة فاتورة */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                إضافة فاتورة جديدة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewInvoice();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        المورد
                                    </label>
                                    <CustomSelect
                                        value={newInvoice.supplier_id}
                                        onChange={(value) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                supplier_id: value,
                                            }))
                                        }
                                        options={suppliers.map((supplier) => ({
                                            value: supplier.id,
                                            label: supplier.name,
                                        }))}
                                        placeholder="اختر المورد"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        تاريخ الفاتورة
                                    </label>
                                    <input
                                        type="date"
                                        value={newInvoice.invoice_date}
                                        onChange={(e) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                invoice_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        تاريخ الاستحقاق
                                    </label>
                                    <input
                                        type="date"
                                        value={newInvoice.due_date}
                                        onChange={(e) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                due_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        المبلغ الأساسي
                                    </label>
                                    <input
                                        type="number"
                                        value={newInvoice.subtotal}
                                        onChange={(e) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                subtotal:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        مبلغ الضريبة
                                    </label>
                                    <input
                                        type="number"
                                        value={newInvoice.tax_amount}
                                        onChange={(e) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                tax_amount:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={newInvoice.notes}
                                    onChange={(e) =>
                                        setNewInvoice((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="أدخل ملاحظات إضافية..."
                                />
                            </div>

                            {/* معاينة المبالغ */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">
                                        المبلغ الأساسي:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {newInvoice.subtotal.toFixed(2)} $
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">
                                        الضريبة:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {newInvoice.tax_amount.toFixed(2)} $
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                                    <span className="text-gray-900">
                                        الإجمالي:
                                    </span>
                                    <span className="text-gray-900">
                                        {(
                                            newInvoice.subtotal +
                                            newInvoice.tax_amount
                                        ).toFixed(2)}{" "}
                                        $
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewInvoice();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddInvoice}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إضافة الفاتورة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تسجيل الدفع */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                تسجيل دفعة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    resetPaymentData();
                                    setSelectedInvoice(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {selectedInvoice && (
                                <>
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 font-cairo">
                                            المبلغ الأساسي:{" "}
                                            {selectedInvoice.subtotal?.toLocaleString()}{" "}
                                            $
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal mt-1">
                                            الضريبة:{" "}
                                            {selectedInvoice.tax_amount?.toLocaleString()}{" "}
                                            $
                                        </p>
                                        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 border-t pt-2 mt-2 font-cairo">
                                            الإجمالي:{" "}
                                            {selectedInvoice.total_amount?.toLocaleString()}{" "}
                                            $
                                        </p>
                                        <p className="text-xs sm:text-sm text-green-600 font-tajawal mt-1">
                                            المدفوع:{" "}
                                            {selectedInvoice.paid_amount?.toLocaleString()}{" "}
                                            $
                                        </p>
                                        <p className="text-xs sm:text-sm text-red-600 font-medium font-tajawal mt-1">
                                            المتبقي:{" "}
                                            {(
                                                selectedInvoice.total_amount -
                                                selectedInvoice.paid_amount
                                            ).toLocaleString()}{" "}
                                            $
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                            مبلغ الدفعة
                                        </label>
                                        <input
                                            type="number"
                                            value={paymentData.amount}
                                            onChange={(e) =>
                                                setPaymentData((prev) => ({
                                                    ...prev,
                                                    amount:
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0,
                                                }))
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            min="0"
                                            max={
                                                selectedInvoice.remaining_amount
                                            }
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                            طريقة الدفع
                                        </label>
                                        <CustomSelect
                                            value={paymentData.payment_method}
                                            onChange={(value) =>
                                                setPaymentData((prev) => ({
                                                    ...prev,
                                                    payment_method: value,
                                                }))
                                            }
                                            options={[
                                                {
                                                    value: "cash",
                                                    label: "نقدي",
                                                },
                                                {
                                                    value: "bank_transfer",
                                                    label: "تحويل بنكي",
                                                },
                                                {
                                                    value: "check",
                                                    label: "شيك",
                                                },
                                                {
                                                    value: "credit_card",
                                                    label: "بطاقة ائتمان",
                                                },
                                            ]}
                                            placeholder="اختر طريقة الدفع"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                            تاريخ الدفع
                                        </label>
                                        <input
                                            type="date"
                                            value={paymentData.payment_date}
                                            onChange={(e) =>
                                                setPaymentData((prev) => ({
                                                    ...prev,
                                                    payment_date:
                                                        e.target.value,
                                                }))
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                            ملاحظات
                                        </label>
                                        <textarea
                                            value={paymentData.notes}
                                            onChange={(e) =>
                                                setPaymentData((prev) => ({
                                                    ...prev,
                                                    notes: e.target.value,
                                                }))
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            rows={2}
                                            placeholder="أدخل ملاحظات إضافية..."
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPaymentModal(false);
                                                resetPaymentData();
                                                setSelectedInvoice(null);
                                            }}
                                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePayment}
                                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            تسجيل الدفعة
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تاريخ المدفوعات */}
            {showPaymentHistoryModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                تاريخ المدفوعات -{" "}
                                {selectedInvoice.invoice_number}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPaymentHistoryModal(false);
                                    setSelectedInvoice(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                            إجمالي الفاتورة
                                        </p>
                                        <p className="text-base sm:text-lg font-bold font-cairo mt-1">
                                            {selectedInvoice.total_amount.toLocaleString()}{" "}
                                            $
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                            المبلغ المدفوع
                                        </p>
                                        <p className="text-base sm:text-lg font-bold text-green-600 font-cairo mt-1">
                                            {selectedInvoice.paid_amount.toLocaleString()}{" "}
                                            $
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                            المبلغ المتبقي
                                        </p>
                                        <p className="text-base sm:text-lg font-bold text-red-600 font-cairo mt-1">
                                            {selectedInvoice.remaining_amount.toLocaleString()}{" "}
                                            $
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                تاريخ الدفع
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المبلغ
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                طريقة الدفع
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ملاحظات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentHistory.length > 0 ? (
                                            paymentHistory.map((payment) => (
                                                <tr
                                                    key={payment.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <div className="text-xs sm:text-sm text-gray-900">
                                                            {formatDate(
                                                                payment.payment_date
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                            {payment.amount.toLocaleString()}{" "}
                                                            $
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <div className="text-xs sm:text-sm text-gray-900">
                                                            {getPaymentMethodText(
                                                                payment.payment_method
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        <div className="text-xs sm:text-sm text-gray-900 truncate">
                                                            {payment.notes ||
                                                                "-"}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-3 sm:px-6 py-8 text-center text-xs sm:text-sm text-gray-500 font-tajawal"
                                                >
                                                    لا توجد مدفوعات مسجلة
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال رفع ملف */}
            {showFileUploadModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                رفع ملف الفاتورة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowFileUploadModal(false);
                                    setFileUpload(null);
                                    setSelectedInvoice(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                    فاتورة رقم: {selectedInvoice.invoice_number}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 font-tajawal mt-1">
                                    المورد: {selectedInvoice.supplier?.name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    اختر ملف الفاتورة
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setFileUpload(
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1 font-tajawal">
                                    الملفات المدعومة: PDF, JPG, PNG
                                </p>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFileUploadModal(false);
                                        setFileUpload(null);
                                        setSelectedInvoice(null);
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFileUpload}
                                    disabled={!fileUpload}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    رفع الملف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تأكيد إلغاء الفاتورة */}
            {showCancelModal && invoiceToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="ri-error-warning-line text-2xl sm:text-3xl text-red-500"></i>
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-2 font-cairo">
                            تأكيد إلغاء الفاتورة
                        </h3>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                            <p className="text-xs sm:text-sm font-medium text-red-900 mb-2 font-tajawal">
                                هل أنت متأكد من إلغاء هذه الفاتورة؟
                            </p>
                            <p className="text-xs sm:text-sm text-red-700 font-tajawal">
                                رقم الفاتورة:{" "}
                                <span className="font-semibold font-cairo">
                                    {invoiceToCancel.invoice_number}
                                </span>
                            </p>
                            <p className="text-xs sm:text-sm text-red-700 font-tajawal mt-1">
                                المورد:{" "}
                                <span className="font-semibold font-cairo">
                                    {invoiceToCancel.supplier?.name}
                                </span>
                            </p>
                            <p className="text-xs sm:text-sm text-red-700 font-tajawal mt-1">
                                المبلغ الإجمالي:{" "}
                                <span className="font-semibold font-cairo">
                                    {invoiceToCancel.total_amount.toLocaleString()}{" "}
                                    $
                                </span>
                            </p>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6 font-tajawal">
                            لا يمكن التراجع عن هذا الإجراء بعد التنفيذ.
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setInvoiceToCancel(null);
                                }}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelInvoice}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                تأكيد الإلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
