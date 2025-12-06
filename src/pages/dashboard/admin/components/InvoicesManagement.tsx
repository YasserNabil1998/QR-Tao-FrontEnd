import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

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
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null
    );
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

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
            invoice_file_url: null,
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
            invoice_file_url: null,
            payment_method: "نقدي",
            notes: "دفعة جزئية - متبقي 1225 ج.م",
            approved_by: undefined,
            approved_date: undefined,
            payment_date: undefined,
        },
    ];

    useEffect(() => {
        fetchInvoices();
        fetchSuppliers();
    }, []);

    const fetchInvoices = async () => {
        try {
            const { data, error } = await supabase
                .from("invoices")
                .select(
                    `
          *,
          supplier:suppliers(name)
        `
                )
                .order("created_at", { ascending: false });

            if (error) throw error;
            setInvoices(data || []);
        } catch (error) {
            console.error("خطأ في جلب الفواتير:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const { data, error } = await supabase
                .from("suppliers")
                .select("*")
                .eq("is_active", true)
                .order("name");

            if (error) throw error;
            setSuppliers(data || []);
        } catch (error) {
            console.error("خطأ في جلب الموردين:", error);
        }
    };

    const fetchPaymentHistory = async (invoiceId: string) => {
        try {
            // هذا مثال - يجب إنشاء جدول payment_history في قاعدة البيانات
            const { data, error } = await supabase
                .from("payment_history")
                .select("*")
                .eq("invoice_id", invoiceId)
                .order("payment_date", { ascending: false });

            if (error) throw error;
            setPaymentHistory(data || []);
        } catch (error) {
            console.error("خطأ في جلب تاريخ المدفوعات:", error);
            setPaymentHistory([]);
        }
    };

    const handleAddInvoice = async () => {
        try {
            const invoiceNumber = `INV-${Date.now()}`;
            const totalAmount = newInvoice.subtotal + newInvoice.tax_amount;

            const { error } = await supabase.from("invoices").insert({
                invoice_number: invoiceNumber,
                supplier_id: newInvoice.supplier_id,
                invoice_date: newInvoice.invoice_date,
                due_date: newInvoice.due_date,
                subtotal: newInvoice.subtotal,
                tax_amount: newInvoice.tax_amount,
                total_amount: totalAmount,
                remaining_amount: totalAmount,
                paid_amount: 0,
                status: "pending",
                notes: newInvoice.notes,
                restaurant_id: "00000000-0000-0000-0000-000000000000",
            });

            if (error) throw error;

            setShowAddModal(false);
            resetNewInvoice();
            fetchInvoices();
        } catch (error) {
            console.error("خطأ في إضافة الفاتورة:", error);
        }
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

    const handlePayment = async () => {
        if (!selectedInvoice) return;

        try {
            const newPaidAmount =
                selectedInvoice.paid_amount + paymentData.amount;
            const newRemainingAmount =
                selectedInvoice.total_amount - newPaidAmount;
            let newStatus = "pending";

            if (newRemainingAmount <= 0) {
                newStatus = "paid";
            } else if (newPaidAmount > 0) {
                newStatus = "partial";
            }

            // تحديث الفاتورة
            const { error: invoiceError } = await supabase
                .from("invoices")
                .update({
                    paid_amount: newPaidAmount,
                    remaining_amount: newRemainingAmount,
                    status: newStatus,
                    payment_date: paymentData.payment_date,
                    payment_method: paymentData.payment_method,
                })
                .eq("id", selectedInvoice.id);

            if (invoiceError) throw invoiceError;

            // إضافة سجل في تاريخ المدفوعات
            const { error: historyError } = await supabase
                .from("payment_history")
                .insert({
                    invoice_id: selectedInvoice.id,
                    amount: paymentData.amount,
                    payment_date: paymentData.payment_date,
                    payment_method: paymentData.payment_method,
                    notes: paymentData.notes,
                });

            if (historyError)
                console.error("خطأ في حفظ تاريخ الدفع:", historyError);

            setShowPaymentModal(false);
            setSelectedInvoice(null);
            resetPaymentData();
            fetchInvoices();
        } catch (error) {
            console.error("خطأ في تسجيل الدفع:", error);
        }
    };

    const resetPaymentData = () => {
        setPaymentData({
            amount: 0,
            payment_method: "cash",
            payment_date: new Date().toISOString().split("T")[0],
            notes: "",
        });
    };

    const updateInvoiceStatus = async (id: string, status: string) => {
        try {
            const updateData: any = { status };
            if (status === "approved") {
                updateData.approved_by = "المدير المالي"; // يجب استبداله بالمستخدم الحالي
                updateData.approved_date = new Date()
                    .toISOString()
                    .split("T")[0];
            }

            const { error } = await supabase
                .from("invoices")
                .update(updateData)
                .eq("id", id);

            if (error) throw error;
            fetchInvoices();
        } catch (error) {
            console.error("خطأ في تحديث حالة الفاتورة:", error);
        }
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

    const handleFileUpload = async () => {
        if (!fileUpload || !selectedInvoice) return;

        try {
            // رفع الملف إلى Supabase Storage
            const fileExt = fileUpload.name.split(".").pop();
            const fileName = `${selectedInvoice.invoice_number}.${fileExt}`;

            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from("invoices")
                    .upload(fileName, fileUpload);

            if (uploadError) throw uploadError;

            // تحديث رابط الملف في الفاتورة
            const { error: updateError } = await supabase
                .from("invoices")
                .update({ invoice_file_url: uploadData.path })
                .eq("id", selectedInvoice.id);

            if (updateError) throw updateError;

            setShowFileUploadModal(false);
            setFileUpload(null);
            setSelectedInvoice(null);
            fetchInvoices();
        } catch (error) {
            console.error("خطأ في رفع الملف:", error);
        }
    };

    const sendPaymentReminder = async (invoice: Invoice) => {
        // هنا يمكن إضافة منطق إرسال تذكير تلقائي
        console.log(
            `إرسال تذكير للمورد ${invoice.supplier?.name} بخصوص الفاتورة ${invoice.invoice_number}`
        );
        // يمكن إضافة إرسال إيميل أو رسالة نصية
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة الفواتير
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                    <i className="ri-add-line"></i>
                    إضافة فاتورة جديدة
                </button>
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <i className="ri-file-list-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الفواتير
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {invoices.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <i className="ri-check-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                مدفوعة
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "paid"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                            <i className="ri-time-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                في الانتظار
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "pending"
                                    ).length
                                }
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
                                مدفوعة جزئياً
                            </p>
                            <p className="text-xl font-bold text-gray-900">
                                {
                                    invoices.filter(
                                        (inv) => inv.status === "partial"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-red-100 text-red-600">
                            <i className="ri-alarm-warning-line text-lg"></i>
                        </div>
                        <div className="mr-3">
                            <p className="text-sm font-medium text-gray-600">
                                متأخرة
                            </p>
                            <p className="text-xl font-bold text-gray-900">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        إجمالي المبالغ
                    </h3>
                    <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">
                            {mockInvoices
                                .reduce(
                                    (total, invoice) =>
                                        total + invoice.total_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        المبالغ المدفوعة
                    </h3>
                    <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">
                            {mockInvoices
                                .reduce(
                                    (total, invoice) =>
                                        total + invoice.paid_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        المبالغ المتبقية
                    </h3>
                    <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">
                            {mockInvoices
                                .reduce(
                                    (total, invoice) =>
                                        total +
                                        (invoice.total_amount -
                                            invoice.paid_amount),
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        متأخرة
                    </h3>
                    <div className="text-right">
                        <p className="text-2xl font-semibold text-gray-900">
                            {mockInvoices
                                .filter((i) => i.status === "overdue")
                                .reduce(
                                    (total, invoice) =>
                                        total +
                                        (invoice.total_amount -
                                            invoice.paid_amount),
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
            </div>

            {/* فلاتر وبحث */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="البحث في الفواتير..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10"
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 pr-8"
                >
                    <option value="all">جميع الفواتير</option>
                    <option value="pending">في الانتظار</option>
                    <option value="paid">مدفوعة</option>
                    <option value="partial">مدفوعة جزئياً</option>
                    <option value="overdue">متأخرة</option>
                    <option value="cancelled">ملغية</option>
                </select>
                <input
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="فلترة حسب الشهر"
                />
            </div>

            {/* جدول الفواتير */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم الفاتورة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المورد
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الفاتورة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الاستحقاق
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ الإجمالي
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ المدفوع
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ المتبقي
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
                            {filteredInvoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {invoice.invoice_number}
                                        {invoice.invoice_file_url && (
                                            <i
                                                className="ri-attachment-line text-blue-500 mr-1"
                                                title="يحتوي على ملف مرفق"
                                            ></i>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {invoice.supplier?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(
                                            invoice.invoice_date
                                        ).toLocaleDateString("ar-SA")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span
                                            className={
                                                isOverdue(
                                                    invoice.due_date,
                                                    invoice.status
                                                )
                                                    ? "text-red-600 font-semibold"
                                                    : ""
                                            }
                                        >
                                            {new Date(
                                                invoice.due_date
                                            ).toLocaleDateString("ar-SA")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {invoice.total_amount.toLocaleString()}{" "}
                                            ج.م
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {invoice.paid_amount.toLocaleString()}{" "}
                                            ج.م
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-red-600">
                                            {(
                                                invoice.total_amount -
                                                invoice.paid_amount
                                            ).toLocaleString()}{" "}
                                            ج.م
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
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
                                                        className="text-green-600 hover:text-green-900 cursor-pointer"
                                                        title="تسجيل دفعة"
                                                    >
                                                        <i className="ri-money-dollar-circle-line"></i>
                                                    </button>
                                                )}
                                            {invoice.paid_amount > 0 && (
                                                <button
                                                    onClick={() =>
                                                        openPaymentHistoryModal(
                                                            invoice
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                                    title="تاريخ المدفوعات"
                                                >
                                                    <i className="ri-history-line"></i>
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
                                                    className="text-purple-600 hover:text-purple-900 cursor-pointer"
                                                    title="رفع ملف الفاتورة"
                                                >
                                                    <i className="ri-upload-line"></i>
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
                                                    className="text-orange-600 hover:text-orange-900 cursor-pointer"
                                                    title="إرسال تذكير"
                                                >
                                                    <i className="ri-notification-line"></i>
                                                </button>
                                            )}
                                            {(invoice.status === "pending" ||
                                                invoice.status ===
                                                    "partial") && (
                                                <button
                                                    onClick={() =>
                                                        updateInvoiceStatus(
                                                            invoice.id,
                                                            "cancelled"
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                                    title="إلغاء الفاتورة"
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* مودال إضافة فاتورة */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                إضافة فاتورة جديدة
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        المورد
                                    </label>
                                    <select
                                        value={newInvoice.supplier_id}
                                        onChange={(e) =>
                                            setNewInvoice((prev) => ({
                                                ...prev,
                                                supplier_id: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                        required
                                    >
                                        <option value="">اختر المورد</option>
                                        {suppliers.map((supplier) => (
                                            <option
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows={3}
                                />
                            </div>

                            {/* معاينة المبالغ */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span>المبلغ الأساسي:</span>
                                    <span>
                                        {newInvoice.subtotal.toFixed(2)} ر.س
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>الضريبة:</span>
                                    <span>
                                        {newInvoice.tax_amount.toFixed(2)} ر.س
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>الإجمالي:</span>
                                    <span>
                                        {(
                                            newInvoice.subtotal +
                                            newInvoice.tax_amount
                                        ).toFixed(2)}{" "}
                                        ر.س
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddInvoice}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                                >
                                    إضافة الفاتورة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تسجيل الدفع */}
            {showPaymentModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                تسجيل دفعة
                            </h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-lg font-semibold text-gray-900">
                                    المبلغ الأساسي:{" "}
                                    {selectedInvoice.subtotal?.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-sm text-gray-600">
                                    الضريبة:{" "}
                                    {selectedInvoice.tax_amount?.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-xl font-bold text-gray-900 border-t pt-2">
                                    الإجمالي:{" "}
                                    {selectedInvoice.total_amount?.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-sm text-green-600">
                                    المدفوع:{" "}
                                    {selectedInvoice.paid_amount?.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-sm text-red-600 font-medium">
                                    المتبقي:{" "}
                                    {(
                                        selectedInvoice.total_amount -
                                        selectedInvoice.paid_amount
                                    ).toLocaleString()}{" "}
                                    ج.م
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    مبلغ الدفعة
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            amount:
                                                parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    min="0"
                                    max={selectedInvoice.remaining_amount}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    طريقة الدفع
                                </label>
                                <select
                                    value={paymentData.payment_method}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            payment_method: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                >
                                    <option value="cash">نقدي</option>
                                    <option value="bank_transfer">
                                        تحويل بنكي
                                    </option>
                                    <option value="check">شيك</option>
                                    <option value="credit_card">
                                        بطاقة ائتمان
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تاريخ الدفع
                                </label>
                                <input
                                    type="date"
                                    value={paymentData.payment_date}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            payment_date: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap cursor-pointer"
                                >
                                    تسجيل الدفعة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تاريخ المدفوعات */}
            {showPaymentHistoryModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                تاريخ المدفوعات -{" "}
                                {selectedInvoice.invoice_number}
                            </h3>
                            <button
                                onClick={() =>
                                    setShowPaymentHistoryModal(false)
                                }
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            إجمالي الفاتورة
                                        </p>
                                        <p className="text-lg font-bold">
                                            {selectedInvoice.total_amount.toFixed(
                                                2
                                            )}{" "}
                                            ر.س
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            المبلغ المدفوع
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {selectedInvoice.paid_amount.toFixed(
                                                2
                                            )}{" "}
                                            ر.س
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            المبلغ المتبقي
                                        </p>
                                        <p className="text-lg font-bold text-red-600">
                                            {selectedInvoice.remaining_amount.toFixed(
                                                2
                                            )}{" "}
                                            ر.س
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                تاريخ الدفع
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المبلغ
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                طريقة الدفع
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ملاحظات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(
                                                        payment.payment_date
                                                    ).toLocaleDateString(
                                                        "ar-SA"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {payment.amount.toFixed(2)}{" "}
                                                    ر.س
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {getPaymentMethodText(
                                                        payment.payment_method
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {payment.notes || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال رفع ملف */}
            {showFileUploadModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                رفع ملف الفاتورة
                            </h3>
                            <button
                                onClick={() => setShowFileUploadModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    فاتورة رقم: {selectedInvoice.invoice_number}
                                </p>
                                <p className="text-sm text-gray-600">
                                    المورد: {selectedInvoice.supplier?.name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    required
                                />
                                <p
                                    className="text-xs text-gray-5

                00 mt-1"
                                >
                                    الملفات المدعومة: PDF, JPG, PNG
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() =>
                                        setShowFileUploadModal(false)
                                    }
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!fileUpload}
                                    className="px-4 py-2 bg-purple-5

                00 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 whitespace-nowrap cursor-pointer"
                                >
                                    رفع الملف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
