import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";

interface DailyReportProps {
    restaurantId: string;
}

interface DailyReportData {
    date: string;
    total_sales: number;
    total_orders: number;
    cash_payments: number;
    card_payments: number;
    digital_payments: number;
    discounts_given: number;
    taxes_collected: number;
    opening_balance: number;
    closing_balance: number;
    hourly_sales: { hour: string; sales: number; orders: number }[];
    top_items: { name: string; quantity: number; revenue: number }[];
}

const DailyReport = ({ restaurantId }: DailyReportProps) => {
    const [reportData, setReportData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        averageOrderValue: 0,
        topItems: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    useEffect(() => {
        fetchDailyReport();
    }, [selectedDate, restaurantId]);

    const fetchDailyReport = async () => {
        try {
            setLoading(true);
            const startDate = new Date(selectedDate);
            const endDate = new Date(selectedDate);
            endDate.setDate(endDate.getDate() + 1);

            // جلب الطلبات اليومية
            const { data: orders, error } = await supabase
                .from("orders")
                .select("*")
                .eq("restaurant_id", restaurantId)
                .gte("created_at", startDate.toISOString())
                .lt("created_at", endDate.toISOString());

            if (error) throw error;

            const totalOrders = orders?.length || 0;
            const completedOrders =
                orders?.filter((order) => order.status === "completed")
                    .length || 0;
            const cancelledOrders =
                orders?.filter((order) => order.status === "cancelled")
                    .length || 0;
            const totalRevenue =
                orders?.reduce(
                    (sum, order) => sum + (order.total_amount || 0),
                    0
                ) || 0;
            const averageOrderValue =
                totalOrders > 0 ? totalRevenue / totalOrders : 0;

            setReportData({
                totalOrders,
                totalRevenue,
                completedOrders,
                cancelledOrders,
                averageOrderValue,
                topItems: [],
            });
        } catch (error) {
            console.error("خطأ في جلب التقرير اليومي:", error);
        } finally {
            setLoading(false);
        }
    };

    // mock data for development / testing
    const mockReport: DailyReportData = {
        date: "2024-01-15",
        total_sales: 2450.75,
        total_orders: 45,
        cash_payments: 1200.5,
        card_payments: 950.25,
        digital_payments: 300.0,
        discounts_given: 125.5,
        taxes_collected: 367.61,
        opening_balance: 500.0,
        closing_balance: 1700.5,
        hourly_sales: [
            { hour: "09:00", sales: 150.25, orders: 3 },
            { hour: "10:00", sales: 225.5, orders: 5 },
            { hour: "11:00", sales: 180.75, orders: 4 },
            { hour: "12:00", sales: 320.0, orders: 8 },
            { hour: "13:00", sales: 410.25, orders: 9 },
            { hour: "14:00", sales: 295.5, orders: 6 },
            { hour: "15:00", sales: 180.0, orders: 4 },
            { hour: "16:00", sales: 220.75, orders: 3 },
            { hour: "17:00", sales: 267.5, orders: 2 },
            { hour: "18:00", sales: 200.25, orders: 1 },
        ],
        top_items: [
            { name: "برجر كلاسيك", quantity: 12, revenue: 360.0 },
            { name: "بيتزا مارجريتا", quantity: 8, revenue: 320.0 },
            { name: "سلطة سيزر", quantity: 10, revenue: 250.0 },
        ],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = [
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
        ];
        const months = [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر",
        ];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName}، ${day} ${month} ${year}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        التقرير اليومي
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {formatDate(selectedDate)}
                    </p>
                </div>
                <CustomDatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="w-64"
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي المبيعات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockReport.total_sales.toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cash Payments */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                النقدية
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockReport.cash_payments.toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Payments */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <i className="ri-check-line text-2xl text-green-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                بطاقات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockReport.card_payments.toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                </div>

                {/* Digital Payments */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100">
                            <i className="ri-calculator-line text-2xl text-orange-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                دفع إلكتروني
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {mockReport.digital_payments.toFixed(2)} ج.م
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status & Sales Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        حالة الطلبات
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">مكتملة</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reportData.totalOrders > 0
                                                    ? (reportData.completedOrders /
                                                          reportData.totalOrders) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">
                                    {reportData.completedOrders}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">ملغية</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reportData.totalOrders > 0
                                                    ? (reportData.cancelledOrders /
                                                          reportData.totalOrders) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">
                                    {reportData.cancelledOrders}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ملخص المبيعات
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                الرصيد الافتتاحي:
                            </span>
                            <span>
                                {mockReport.opening_balance.toFixed(2)} ج.م
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                إجمالي المبيعات:
                            </span>
                            <span>{mockReport.total_sales.toFixed(2)} ج.م</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الخصومات:</span>
                            <span className="text-red-600">
                                -{mockReport.discounts_given.toFixed(2)} ج.م
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الضرائب:</span>
                            <span>
                                {mockReport.taxes_collected.toFixed(2)} ج.م
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>الرصيد الختامي:</span>
                            <span>
                                {mockReport.closing_balance.toFixed(2)} ج.م
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hourly Sales */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    المبيعات بالساعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockReport.hourly_sales.map((hour) => (
                        <div key={hour.hour} className="p-2 border rounded">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{hour.hour}</span>
                                <span className="font-medium">
                                    {hour.orders} طلب
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">
                                {hour.sales.toFixed(2)} ج.م
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    أعلى الأصناف مبيعًا
                </h3>
                <ul className="space-y-2">
                    {mockReport.top_items.map((item) => (
                        <li
                            key={item.name}
                            className="flex justify-between items-center"
                        >
                            <span>
                                {item.name} (×{item.quantity})
                            </span>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                    {item.revenue.toFixed(2)} ج.م
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DailyReport;
