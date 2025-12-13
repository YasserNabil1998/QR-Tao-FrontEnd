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
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    طرق الدفع داخل المطعم
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowDailyReportModal(true)}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                    >
                        <i className="ri-file-chart-line"></i>
                        <span className="text-sm sm:text-base">التقارير اليومية</span>
                    </button>
                    <button
                        onClick={() => setShowAddPaymentModal(true)}
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                    >
                        <i className="ri-add-line"></i>
                        <span className="text-sm sm:text-base">تسجيل دفعة</span>
                    </button>
                </div>
            </div>

            {/* إحصائيات اليوم */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                            <i className="ri-money-dollar-circle-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي اليوم
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {todayReport.total.toLocaleString()} $
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 font-tajawal mt-1">
                                {todayReport.totalCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-wallet-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                المدفوعات النقدية
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {todayReport.cashTotal.toLocaleString()} $
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 font-tajawal mt-1">
                                {todayReport.cashCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                            <i className="ri-bank-card-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                مدفوعات الفيزا
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {todayReport.visaTotal.toLocaleString()} $
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 font-tajawal mt-1">
                                {todayReport.visaCount} عملية
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
                            <i className="ri-pie-chart-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                نسبة الفيزا
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {todayReport.total > 0
                                    ? (
                                          (todayReport.visaTotal /
                                              todayReport.total) *
                                          100
                                      ).toFixed(1)
                                    : 0}
                                %
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 font-tajawal mt-1">من الإجمالي</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center">
                <div className="w-full sm:w-48">
                    <CustomSelect
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع طرق الدفع" },
                            { value: "cash", label: "نقدي" },
                            { value: "visa", label: "فيزا" },
                        ]}
                        placeholder="فلترة حسب طريقة الدفع"
                        className="w-full sm:w-48"
                    />
                </div>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>

            {/* جدول المدفوعات */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
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

                {/* Tablet Table (MD to LG) */}
                <div className="hidden md:block xl:hidden overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ والوقت</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">طريقة الدفع</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الطاولة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div>
                                            <div className="text-xs font-medium text-gray-900">{formatDate(payment.payment_date)}</div>
                                            <div className="text-xs text-gray-500">{payment.payment_time}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {payment.amount.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center">
                                            <i className={`${payment.payment_method === "cash" ? "ri-wallet-line text-green-600" : "ri-bank-card-line text-blue-600"} ml-1 text-xs`}></i>
                                            <span className="text-xs text-gray-900">{getPaymentMethodText(payment.payment_method)}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{payment.table_number || "-"}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{payment.customer_name || "-"}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                            {getStatusText(payment.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                        <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 font-cairo">
                                        {formatDate(payment.payment_date)} - {payment.payment_time}
                                    </h3>
                                    <p className="text-lg font-bold text-gray-900 font-cairo">
                                        {payment.amount.toLocaleString()} $
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                        {getStatusText(payment.status)}
                                    </span>
                                    <div className="flex items-center">
                                        <i className={`${payment.payment_method === "cash" ? "ri-wallet-line text-green-600" : "ri-bank-card-line text-blue-600"} text-base`}></i>
                                        <span className="text-xs text-gray-600 mr-1 font-tajawal">{getPaymentMethodText(payment.payment_method)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الطاولة:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block">{payment.table_number || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">العميل:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block truncate">{payment.customer_name || "-"}</span>
                                </div>
                                {payment.reference_number && (
                                    <div className="col-span-2">
                                        <span className="text-xs text-gray-600 font-tajawal">رقم المرجع:</span>
                                        <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block truncate">{payment.reference_number}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الكاشير:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block truncate">{payment.created_by}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredPayments.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-wallet-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد مدفوعات</p>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال إضافة دفعة */}
            {showAddPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
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

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="مثال: طاولة 5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="اختياري"
                                />
                            </div>

                            {newPayment.payment_method === "visa" && (
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="رقم العملية البنكية"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={2}
                                    placeholder="ملاحظات إضافية"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddPaymentModal(false);
                                        resetNewPayment();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddPayment}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                التقارير اليومية للمدفوعات
                            </h3>
                            <button
                                onClick={() => setShowDailyReportModal(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                التاريخ
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                المدفوعات النقدية
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                مدفوعات الفيزا
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                الإجمالي
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                عدد العمليات
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 font-cairo">
                                                        {formatDate(
                                                            report.date
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-medium text-green-600 font-cairo">
                                                            {report.cash_total.toLocaleString()}{" "}
                                                            $
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-tajawal">
                                                            {report.cash_count}{" "}
                                                            عملية
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-medium text-blue-600 font-cairo">
                                                            {report.visa_total.toLocaleString()}{" "}
                                                            $
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-tajawal">
                                                            {report.visa_count}{" "}
                                                            عملية
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm font-bold text-gray-900 font-cairo">
                                                        {report.total_amount.toLocaleString()}{" "}
                                                        $
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm text-gray-900 font-cairo">
                                                        {report.total_count}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2 ml-2">
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
                                                        <span className="text-xs sm:text-sm font-medium font-cairo">
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
                                            <td className="px-3 sm:px-6 py-4 text-right font-bold font-cairo">
                                                الإجمالي:
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="text-xs sm:text-sm font-bold text-green-600 font-cairo">
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
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="text-xs sm:text-sm font-bold text-blue-600 font-cairo">
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
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="text-xs sm:text-sm font-bold text-gray-900 font-cairo">
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
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="text-xs sm:text-sm font-bold font-cairo">
                                                    {dailyReports.reduce(
                                                        (sum, r) =>
                                                            sum + r.total_count,
                                                        0
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4"></td>
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
