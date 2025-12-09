import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface Payment {
    id: string;
    payment_date: string;
    payment_time: string;
    amount: number;
    payment_method: "cash" | "visa";
    order_id?: string;
    table_number?: string;
    customer_name?: string;
    reference_number?: string;
    notes?: string;
    created_by: string;
    status: "completed" | "pending" | "cancelled";
}

interface DailyReport {
    date: string;
    cash_total: number;
    visa_total: number;
    total_amount: number;
    cash_count: number;
    visa_count: number;
    total_count: number;
}

export default function PaymentMethods() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [showDailyReportModal, setShowDailyReportModal] = useState(false);
    const [_selectedDate, _setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState(
        new Date().toISOString().split("T")[0]
    );
    const { showToast, ToastContainer } = useToast();

    const [newPayment, setNewPayment] = useState<{
        amount: number;
        payment_method: "cash" | "visa";
        table_number: string;
        customer_name: string;
        reference_number: string;
        notes: string;
    }>({
        amount: 0,
        payment_method: "cash",
        table_number: "",
        customer_name: "",
        reference_number: "",
        notes: "",
    });

    // Mock data for demonstration
    const mockPayments: Payment[] = [
        {
            id: "1",
            payment_date: "2024-01-15",
            payment_time: "14:30",
            amount: 125.5,
            payment_method: "cash",
            table_number: "طاولة 5",
            customer_name: "أحمد محمد",
            created_by: "كاشير 1",
            status: "completed",
        },
        {
            id: "2",
            payment_date: "2024-01-15",
            payment_time: "15:45",
            amount: 89.75,
            payment_method: "visa",
            table_number: "طاولة 12",
            customer_name: "فاطمة أحمد",
            reference_number: "VISA-789456",
            created_by: "كاشير 2",
            status: "completed",
        },
        {
            id: "3",
            payment_date: "2024-01-15",
            payment_time: "16:20",
            amount: 245.0,
            payment_method: "cash",
            table_number: "طاولة 8",
            customer_name: "محمد علي",
            notes: "وجبة عائلية",
            created_by: "كاشير 1",
            status: "completed",
        },
        {
            id: "4",
            payment_date: "2024-01-15",
            payment_time: "17:10",
            amount: 156.25,
            payment_method: "visa",
            table_number: "طاولة 3",
            customer_name: "سارة حسن",
            reference_number: "VISA-123789",
            created_by: "كاشير 2",
            status: "completed",
        },
        {
            id: "5",
            payment_date: "2024-01-14",
            payment_time: "19:30",
            amount: 198.5,
            payment_method: "cash",
            table_number: "طاولة 15",
            customer_name: "خالد أحمد",
            created_by: "كاشير 1",
            status: "completed",
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setPayments(mockPayments);
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        if (payments.length > 0) {
            generateDailyReports();
        }
    }, [payments]);

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const generateDailyReports = () => {
        const reports: { [key: string]: DailyReport } = {};

        payments.forEach((payment) => {
            const date = payment.payment_date;
            if (!reports[date]) {
                reports[date] = {
                    date,
                    cash_total: 0,
                    visa_total: 0,
                    total_amount: 0,
                    cash_count: 0,
                    visa_count: 0,
                    total_count: 0,
                };
            }

            if (payment.payment_method === "cash") {
                reports[date].cash_total += payment.amount;
                reports[date].cash_count += 1;
            } else {
                reports[date].visa_total += payment.amount;
                reports[date].visa_count += 1;
            }

            reports[date].total_amount += payment.amount;
            reports[date].total_count += 1;
        });

        setDailyReports(
            Object.values(reports).sort((a, b) => b.date.localeCompare(a.date))
        );
    };

    const handleAddPayment = () => {
        // Validation
        if (newPayment.amount <= 0) {
            showToast("يرجى إدخال مبلغ صحيح", "error");
            return;
        }
        if (!newPayment.table_number.trim()) {
            showToast("يرجى إدخال رقم الطاولة", "error");
            return;
        }
        if (
            newPayment.payment_method === "visa" &&
            !newPayment.reference_number.trim()
        ) {
            showToast("يرجى إدخال رقم المرجع للدفعة بالفيزا", "error");
            return;
        }

        const currentTime = new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const newPaymentData: Payment = {
            id: `payment-${Date.now()}`,
            payment_date: new Date().toISOString().split("T")[0],
            payment_time: currentTime,
            amount: newPayment.amount,
            payment_method: newPayment.payment_method,
            table_number: newPayment.table_number,
            customer_name: newPayment.customer_name || undefined,
            reference_number: newPayment.reference_number || undefined,
            notes: newPayment.notes || undefined,
            created_by: "المستخدم الحالي",
            status: "completed",
        };

        setPayments((prev) => [newPaymentData, ...prev]);
        showToast("تم تسجيل الدفعة بنجاح", "success");
        setShowAddPaymentModal(false);
        resetNewPayment();
    };

    const resetNewPayment = () => {
        setNewPayment({
            amount: 0,
            payment_method: "cash",
            table_number: "",
            customer_name: "",
            reference_number: "",
            notes: "",
        });
    };

    const getPaymentMethodText = (method: string) => {
        return method === "cash" ? "نقدي" : "فيزا";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "مكتملة";
            case "pending":
                return "في الانتظار";
            case "cancelled":
                return "ملغية";
            default:
                return status;
        }
    };

    const getTodayReport = () => {
        const today = new Date().toISOString().split("T")[0];
        const todayPayments = payments.filter((p) => p.payment_date === today);

        const cashTotal = todayPayments
            .filter((p) => p.payment_method === "cash")
            .reduce((sum, p) => sum + p.amount, 0);
        const visaTotal = todayPayments
            .filter((p) => p.payment_method === "visa")
            .reduce((sum, p) => sum + p.amount, 0);
        const cashCount = todayPayments.filter(
            (p) => p.payment_method === "cash"
        ).length;
        const visaCount = todayPayments.filter(
            (p) => p.payment_method === "visa"
        ).length;

        return {
            cashTotal,
            visaTotal,
            total: cashTotal + visaTotal,
            cashCount,
            visaCount,
            totalCount: cashCount + visaCount,
        };
    };

    const filteredPayments = payments.filter((payment) => {
        const matchesMethod =
            filter === "all" || payment.payment_method === filter;
        const matchesDate = !dateFilter || payment.payment_date === dateFilter;
        return matchesMethod && matchesDate;
    });

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    const todayReport = getTodayReport();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    طرق الدفع داخل المطعم
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowDailyReportModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-file-chart-line"></i>
                        التقارير اليومية
                    </button>
                    <button
                        onClick={() => setShowAddPaymentModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-add-line"></i>
                        تسجيل دفعة
                    </button>
                </div>
            </div>

            {/* إحصائيات اليوم */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <i className="ri-money-dollar-circle-line text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي اليوم
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {todayReport.total.toLocaleString()} $
                            </p>
                            <p className="text-sm text-gray-500">
                                {todayReport.totalCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <i className="ri-wallet-line text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                المدفوعات النقدية
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {todayReport.cashTotal.toLocaleString()} $
                            </p>
                            <p className="text-sm text-gray-500">
                                {todayReport.cashCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <i className="ri-bank-card-line text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                مدفوعات الفيزا
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {todayReport.visaTotal.toLocaleString()} $
                            </p>
                            <p className="text-sm text-gray-500">
                                {todayReport.visaCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <i className="ri-pie-chart-line text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                نسبة الفيزا
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {todayReport.total > 0
                                    ? (
                                          (todayReport.visaTotal /
                                              todayReport.total) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </p>
                            <p className="text-sm text-gray-500">من الإجمالي</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر */}
            <div className="flex gap-4 mb-6 items-center">
                <div className="w-48">
                    <CustomSelect
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع طرق الدفع" },
                            { value: "cash", label: "نقدي" },
                            { value: "visa", label: "فيزا" },
                        ]}
                        placeholder="فلترة حسب طريقة الدفع"
                    />
                </div>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>

            {/* جدول المدفوعات */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التاريخ والوقت
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    طريقة الدفع
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الطاولة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    العميل
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم المرجع
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الكاشير
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatDate(
                                                    payment.payment_date
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {payment.payment_time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {payment.amount.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <i
                                                className={`${
                                                    payment.payment_method ===
                                                    "cash"
                                                        ? "ri-wallet-line text-green-600"
                                                        : "ri-bank-card-line text-blue-600"
                                                } ml-2`}
                                            ></i>
                                            <span className="text-sm text-gray-900">
                                                {getPaymentMethodText(
                                                    payment.payment_method
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {payment.table_number || "-"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {payment.customer_name || "-"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {payment.reference_number || "-"}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {payment.created_by}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                payment.status
                                            )}`}
                                        >
                                            {getStatusText(payment.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* مودال إضافة دفعة */}
            {showAddPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                تسجيل دفعة جديدة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddPaymentModal(false);
                                    resetNewPayment();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    المبلغ
                                </label>
                                <input
                                    type="number"
                                    value={newPayment.amount}
                                    onChange={(e) =>
                                        setNewPayment((prev) => ({
                                            ...prev,
                                            amount:
                                                parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    طريقة الدفع
                                </label>
                                <CustomSelect
                                    value={newPayment.payment_method}
                                    onChange={(value) =>
                                        setNewPayment((prev) => ({
                                            ...prev,
                                            payment_method: value as
                                                | "cash"
                                                | "visa",
                                        }))
                                    }
                                    options={[
                                        { value: "cash", label: "نقدي" },
                                        { value: "visa", label: "فيزا" },
                                    ]}
                                    placeholder="اختر طريقة الدفع"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    رقم الطاولة
                                </label>
                                <input
                                    type="text"
                                    value={newPayment.table_number}
                                    onChange={(e) =>
                                        setNewPayment((prev) => ({
                                            ...prev,
                                            table_number: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="مثال: طاولة 5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم العميل
                                </label>
                                <input
                                    type="text"
                                    value={newPayment.customer_name}
                                    onChange={(e) =>
                                        setNewPayment((prev) => ({
                                            ...prev,
                                            customer_name: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="اختياري"
                                />
                            </div>

                            {newPayment.payment_method === "visa" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم المرجع
                                    </label>
                                    <input
                                        type="text"
                                        value={newPayment.reference_number}
                                        onChange={(e) =>
                                            setNewPayment((prev) => ({
                                                ...prev,
                                                reference_number:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="رقم العملية البنكية"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={newPayment.notes}
                                    onChange={(e) =>
                                        setNewPayment((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={2}
                                    placeholder="ملاحظات إضافية"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddPaymentModal(false);
                                        resetNewPayment();
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddPayment}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    تسجيل الدفعة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال التقارير اليومية */}
            {showDailyReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                التقارير اليومية للمدفوعات
                            </h3>
                            <button
                                onClick={() => setShowDailyReportModal(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <colgroup>
                                        <col style={{ width: "15%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "17%" }} />
                                        <col style={{ width: "12%" }} />
                                        <col style={{ width: "22%" }} />
                                    </colgroup>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                التاريخ
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المدفوعات النقدية
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                مدفوعات الفيزا
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجمالي
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                عدد العمليات
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                نسبة الفيزا
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dailyReports.map((report) => (
                                            <tr
                                                key={report.date}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-3 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatDate(
                                                            report.date
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div>
                                                        <div className="font-medium text-green-600">
                                                            {report.cash_total.toLocaleString()}{" "}
                                                            $
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {report.cash_count}{" "}
                                                            عملية
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-blue-600">
                                                            {report.visa_total.toLocaleString()}{" "}
                                                            $
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {report.visa_count}{" "}
                                                            عملية
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="text-sm font-bold text-gray-900">
                                                        {report.total_amount.toLocaleString()}{" "}
                                                        $
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {report.total_count}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (report.visa_total /
                                                                            report.total_amount) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {(
                                                                (report.visa_total /
                                                                    report.total_amount) *
                                                                100
                                                            ).toFixed(1)}
                                                            %
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td className="px-3 py-4 text-right font-bold">
                                                الإجمالي:
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="font-bold text-green-600">
                                                    {dailyReports
                                                        .reduce(
                                                            (sum, r) =>
                                                                sum +
                                                                r.cash_total,
                                                            0
                                                        )
                                                        .toLocaleString()}{" "}
                                                    $
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="font-bold text-blue-600">
                                                    {dailyReports
                                                        .reduce(
                                                            (sum, r) =>
                                                                sum +
                                                                r.visa_total,
                                                            0
                                                        )
                                                        .toLocaleString()}{" "}
                                                    $
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="font-bold text-gray-900">
                                                    {dailyReports
                                                        .reduce(
                                                            (sum, r) =>
                                                                sum +
                                                                r.total_amount,
                                                            0
                                                        )
                                                        .toLocaleString()}{" "}
                                                    $
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="font-bold">
                                                    {dailyReports.reduce(
                                                        (sum, r) =>
                                                            sum + r.total_count,
                                                        0
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
