import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";

interface PaymentManagementProps {
    restaurantId: string;
}

interface Payment {
    id: string;
    order_id: string;
    table_number: string;
    amount: number;
    payment_method: string;
    status: string;
    transaction_id: string;
    created_at: string;
    customer_name: string;
}

const PaymentManagement = ({ restaurantId }: PaymentManagementProps) => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("today");

    const mockPayments: Payment[] = [
        {
            id: "1",
            order_id: "1",
            table_number: "طاولة 5",
            amount: 125.5,
            payment_method: "نقدي",
            status: "completed",
            transaction_id: "TXN-001",
            created_at: "2024-01-15 14:30:00",
            customer_name: "أحمد محمد",
        },
        {
            id: "2",
            order_id: "2",
            table_number: "طاولة 12",
            amount: 89.75,
            payment_method: "بطاقة ائتمان",
            status: "completed",
            transaction_id: "TXN-002",
            created_at: "2024-01-15 15:15:00",
            customer_name: "فاطمة علي",
        },
        {
            id: "3",
            order_id: "3",
            table_number: "طاولة 8",
            amount: 67.25,
            payment_method: "محفظة رقمية",
            status: "pending",
            transaction_id: "TXN-003",
            created_at: "2024-01-15 16:00:00",
            customer_name: "محمد حسن",
        },
    ];

    useEffect(() => {
        fetchPayments();
    }, [restaurantId, filter]);

    const fetchPayments = async () => {
        try {
            let query = supabase
                .from("payments")
                .select(
                    `
          *,
          orders (
            id,
            total_amount,
            tables (table_number)
          )
        `
                )
                .eq("restaurant_id", restaurantId)
                .order("created_at", { ascending: false });

            if (filter === "today") {
                const today = new Date().toISOString().split("T")[0];
                query = query.gte("created_at", today);
            } else if (filter === "week") {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                query = query.gte("created_at", weekAgo.toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;
            setPayments(data || []);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const _getTotalAmount = () => {
        return payments.reduce((total, payment) => total + payment.amount, 0);
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return "نقدي";
            case "card":
                return "بطاقة";
            case "digital":
                return "محفظة رقمية";
            default:
                return method;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "مكتمل";
            case "pending":
                return "في الانتظار";
            case "failed":
                return "فشل";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة المدفوعات
                </h2>
                <div className="flex space-x-2 space-x-reverse">
                    {["today", "week", "all"].map((period) => (
                        <button
                            key={period}
                            onClick={() => setFilter(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                filter === period
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {period === "today"
                                ? "اليوم"
                                : period === "week"
                                ? "هذا الأسبوع"
                                : "الكل"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="bg-green-500 rounded-lg p-3">
                            <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي المدفوعات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockPayments
                                    .reduce(
                                        (total, payment) =>
                                            total + payment.amount,
                                        0
                                    )
                                    .toFixed(2)}{" "}
                                ج.م
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="bg-blue-500 rounded-lg p-3">
                            <i className="ri-file-list-line text-white text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                عدد المعاملات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockPayments
                                    .filter((p) => p.status === "completed")
                                    .reduce(
                                        (total, payment) =>
                                            total + payment.amount,
                                        0
                                    )
                                    .toFixed(2)}{" "}
                                ج.م
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="bg-purple-500 rounded-lg p-3">
                            <i className="ri-calculator-line text-white text-xl"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                متوسط المعاملة
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockPayments
                                    .filter((p) => p.status === "pending")
                                    .reduce(
                                        (total, payment) =>
                                            total + payment.amount,
                                        0
                                    )
                                    .toFixed(2)}{" "}
                                ج.م
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        سجل المدفوعات
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم المعاملة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الطاولة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    طريقة الدفع
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التاريخ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{payment.id.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        طاولة{" "}
                                        {payment.orders?.tables?.table_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {payment.amount} ج.م
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getPaymentMethodText(
                                            payment.payment_method
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                                                payment.payment_status
                                            )}`}
                                        >
                                            {getPaymentStatusText(
                                                payment.payment_status
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(
                                            payment.created_at
                                        ).toLocaleString("ar-SA")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {payments.length === 0 && (
                <div className="text-center py-12">
                    <i className="ri-money-dollar-circle-line text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد مدفوعات
                    </h3>
                    <p className="text-gray-500">
                        لم يتم العثور على مدفوعات في الفترة المحددة
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
