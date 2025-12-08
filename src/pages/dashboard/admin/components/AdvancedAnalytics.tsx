import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";

interface AnalyticsData {
    revenue: {
        daily: number[];
        weekly: number[];
        monthly: number[];
    };
    orders: {
        total: number;
        completed: number;
        cancelled: number;
        pending: number;
    };
    customers: {
        new: number;
        returning: number;
        total: number;
    };
    popularItems: {
        name: string;
        orders: number;
        revenue: number;
    }[];
    peakHours: {
        hour: string;
        orders: number;
    }[];
}

interface AdvancedAnalyticsProps {
    restaurantId: string;
}

export default function AdvancedAnalytics({
    restaurantId: _restaurantId,
}: AdvancedAnalyticsProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("week");
    const { showToast, ToastContainer } = useToast();

    // Mock data for different time ranges
    const getAnalyticsData = (range: string): AnalyticsData => {
        const baseData = {
            daily: [1200, 1500, 1800, 2100, 1900, 2300, 2000],
            weekly: [8500, 9200, 8800, 9500],
            monthly: [35000, 38000, 42000],
        };

        switch (range) {
            case "day":
                return {
                    revenue: {
                        daily: [
                            200, 350, 450, 600, 550, 700, 650, 800, 750, 900,
                            850, 1000, 950, 1100, 1050, 1200, 1150, 1300, 1250,
                            1400, 1350, 1500, 1450, 1600,
                        ],
                        weekly: baseData.weekly,
                        monthly: baseData.monthly,
                    },
                    orders: {
                        total: 85,
                        completed: 80,
                        cancelled: 3,
                        pending: 2,
                    },
                    customers: {
                        new: 12,
                        returning: 25,
                        total: 37,
                    },
                    popularItems: [
                        { name: "برجر اللحم المشوي", orders: 10, revenue: 150 },
                        { name: "بيتزا مارجريتا", orders: 9, revenue: 135 },
                        { name: "سلطة قيصر", orders: 7, revenue: 70 },
                        { name: "باستا الفريدو", orders: 6, revenue: 90 },
                        { name: "دجاج مشوي", orders: 5, revenue: 75 },
                    ],
                    peakHours: [
                        { hour: "12:00", orders: 8 },
                        { hour: "13:00", orders: 12 },
                        { hour: "14:00", orders: 6 },
                        { hour: "19:00", orders: 10 },
                        { hour: "20:00", orders: 15 },
                        { hour: "21:00", orders: 11 },
                    ],
                };
            case "week":
                return {
                    revenue: {
                        daily: [1200, 1500, 1800, 2100, 1900, 2300, 2000],
                        weekly: [8500, 9200, 8800, 9500],
                        monthly: baseData.monthly,
                    },
                    orders: {
                        total: 1250,
                        completed: 1180,
                        cancelled: 45,
                        pending: 25,
                    },
                    customers: {
                        new: 180,
                        returning: 320,
                        total: 500,
                    },
                    popularItems: [
                        {
                            name: "برجر اللحم المشوي",
                            orders: 145,
                            revenue: 2175,
                        },
                        { name: "بيتزا مارجريتا", orders: 132, revenue: 1980 },
                        { name: "سلطة قيصر", orders: 98, revenue: 980 },
                        { name: "باستا الفريدو", orders: 87, revenue: 1305 },
                        { name: "دجاج مشوي", orders: 76, revenue: 1140 },
                    ],
                    peakHours: [
                        { hour: "12:00", orders: 45 },
                        { hour: "13:00", orders: 62 },
                        { hour: "14:00", orders: 38 },
                        { hour: "19:00", orders: 58 },
                        { hour: "20:00", orders: 71 },
                        { hour: "21:00", orders: 52 },
                    ],
                };
            case "month":
                return {
                    revenue: {
                        daily: baseData.daily,
                        weekly: [35000, 38000, 42000, 40000],
                        monthly: [150000, 165000, 180000],
                    },
                    orders: {
                        total: 5200,
                        completed: 4920,
                        cancelled: 180,
                        pending: 100,
                    },
                    customers: {
                        new: 750,
                        returning: 1350,
                        total: 2100,
                    },
                    popularItems: [
                        {
                            name: "برجر اللحم المشوي",
                            orders: 620,
                            revenue: 9300,
                        },
                        { name: "بيتزا مارجريتا", orders: 560, revenue: 8400 },
                        { name: "سلطة قيصر", orders: 420, revenue: 4200 },
                        { name: "باستا الفريدو", orders: 370, revenue: 5550 },
                        { name: "دجاج مشوي", orders: 320, revenue: 4800 },
                    ],
                    peakHours: [
                        { hour: "12:00", orders: 190 },
                        { hour: "13:00", orders: 260 },
                        { hour: "14:00", orders: 160 },
                        { hour: "19:00", orders: 240 },
                        { hour: "20:00", orders: 300 },
                        { hour: "21:00", orders: 220 },
                    ],
                };
            case "year":
                return {
                    revenue: {
                        daily: baseData.daily,
                        weekly: baseData.weekly,
                        monthly: [
                            1800000, 1950000, 2100000, 2250000, 2400000,
                            2550000, 2700000, 2850000, 3000000, 3150000,
                            3300000, 3450000,
                        ],
                    },
                    orders: {
                        total: 62500,
                        completed: 59000,
                        cancelled: 2200,
                        pending: 1300,
                    },
                    customers: {
                        new: 9000,
                        returning: 16200,
                        total: 25200,
                    },
                    popularItems: [
                        {
                            name: "برجر اللحم المشوي",
                            orders: 7400,
                            revenue: 111000,
                        },
                        {
                            name: "بيتزا مارجريتا",
                            orders: 6720,
                            revenue: 100800,
                        },
                        { name: "سلطة قيصر", orders: 5040, revenue: 50400 },
                        { name: "باستا الفريدو", orders: 4440, revenue: 66600 },
                        { name: "دجاج مشوي", orders: 3840, revenue: 57600 },
                    ],
                    peakHours: [
                        { hour: "12:00", orders: 2280 },
                        { hour: "13:00", orders: 3120 },
                        { hour: "14:00", orders: 1920 },
                        { hour: "19:00", orders: 2880 },
                        { hour: "20:00", orders: 3600 },
                        { hour: "21:00", orders: 2640 },
                    ],
                };
            default:
                return {
                    revenue: {
                        daily: baseData.daily,
                        weekly: baseData.weekly,
                        monthly: baseData.monthly,
                    },
                    orders: {
                        total: 1250,
                        completed: 1180,
                        cancelled: 45,
                        pending: 25,
                    },
                    customers: {
                        new: 180,
                        returning: 320,
                        total: 500,
                    },
                    popularItems: [
                        {
                            name: "برجر اللحم المشوي",
                            orders: 145,
                            revenue: 2175,
                        },
                        { name: "بيتزا مارجريتا", orders: 132, revenue: 1980 },
                        { name: "سلطة قيصر", orders: 98, revenue: 980 },
                        { name: "باستا الفريدو", orders: 87, revenue: 1305 },
                        { name: "دجاج مشوي", orders: 76, revenue: 1140 },
                    ],
                    peakHours: [
                        { hour: "12:00", orders: 45 },
                        { hour: "13:00", orders: 62 },
                        { hour: "14:00", orders: 38 },
                        { hour: "19:00", orders: 58 },
                        { hour: "20:00", orders: 71 },
                        { hour: "21:00", orders: 52 },
                    ],
                };
        }
    };

    useEffect(() => {
        // Simulate loading
        setLoading(true);
        setTimeout(() => {
            setAnalytics(getAnalyticsData(timeRange));
            setLoading(false);
        }, 300);
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    التحليلات المتقدمة
                </h2>
                <div className="flex items-center gap-3">
                    <div className="w-48">
                        <CustomSelect
                            value={timeRange}
                            onChange={(value) => setTimeRange(value)}
                            options={[
                                { value: "day", label: "اليوم" },
                                { value: "week", label: "الأسبوع" },
                                { value: "month", label: "الشهر" },
                                { value: "year", label: "السنة" },
                            ]}
                            placeholder="اختر الفترة"
                        />
                    </div>
                    <button
                        onClick={() => {
                            showToast("ميزة تصدير التقرير قيد التطوير", "info");
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
                    >
                        <i className="ri-download-line"></i>
                        تصدير التقرير
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الإيرادات
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {timeRange === "day"
                                    ? analytics.revenue.daily
                                          .reduce((a, b) => a + b, 0)
                                          .toLocaleString()
                                    : timeRange === "week"
                                    ? analytics.revenue.weekly
                                          .reduce((a, b) => a + b, 0)
                                          .toLocaleString()
                                    : timeRange === "month"
                                    ? analytics.revenue.monthly
                                          .reduce((a, b) => a + b, 0)
                                          .toLocaleString()
                                    : analytics.revenue.monthly
                                          .reduce((a, b) => a + b, 0)
                                          .toLocaleString()}{" "}
                                $
                            </p>
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <i className="ri-arrow-up-line ml-1"></i>
                                +12.5% من الأسبوع الماضي
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الطلبات
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.orders.total}
                            </p>
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <i className="ri-arrow-up-line ml-1"></i>
                                +8.3% من الأسبوع الماضي
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="ri-shopping-cart-line text-blue-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                العملاء الجدد
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics.customers.new}
                            </p>
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <i className="ri-arrow-up-line ml-1"></i>
                                +15.2% من الأسبوع الماضي
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="ri-user-add-line text-purple-600 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                معدل الإكمال
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(
                                    (analytics.orders.completed /
                                        analytics.orders.total) *
                                    100
                                ).toFixed(1)}
                                %
                            </p>
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <i className="ri-arrow-up-line ml-1"></i>
                                +2.1% من الأسبوع الماضي
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i className="ri-check-double-line text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {timeRange === "day"
                            ? "الإيرادات بالساعة"
                            : timeRange === "week"
                            ? "الإيرادات اليومية"
                            : timeRange === "month"
                            ? "الإيرادات الأسبوعية"
                            : "الإيرادات الشهرية"}
                    </h3>
                    <div className="overflow-x-auto">
                        <div
                            className={`h-64 flex items-end ${
                                timeRange === "day" ? "gap-1" : "gap-2"
                            } min-w-max`}
                        >
                            {(timeRange === "day"
                                ? analytics.revenue.daily
                                : timeRange === "week"
                                ? analytics.revenue.daily
                                : timeRange === "month"
                                ? analytics.revenue.weekly
                                : analytics.revenue.monthly
                            ).map((revenue, index) => {
                                const maxValue = Math.max(
                                    ...(timeRange === "day"
                                        ? analytics.revenue.daily
                                        : timeRange === "week"
                                        ? analytics.revenue.daily
                                        : timeRange === "month"
                                        ? analytics.revenue.weekly
                                        : analytics.revenue.monthly)
                                );
                                const labels =
                                    timeRange === "day"
                                        ? Array.from(
                                              { length: 24 },
                                              (_, i) =>
                                                  `${String(i).padStart(
                                                      2,
                                                      "0"
                                                  )}:00`
                                          )
                                        : timeRange === "week"
                                        ? [
                                              "الأحد",
                                              "الاثنين",
                                              "الثلاثاء",
                                              "الأربعاء",
                                              "الخميس",
                                              "الجمعة",
                                              "السبت",
                                          ]
                                        : timeRange === "month"
                                        ? [
                                              "الأسبوع 1",
                                              "الأسبوع 2",
                                              "الأسبوع 3",
                                              "الأسبوع 4",
                                          ]
                                        : [
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
                                const barWidth =
                                    timeRange === "day" ? "w-6" : "w-8";
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center"
                                        title={`${revenue.toLocaleString()} $`}
                                    >
                                        <div
                                            className={`bg-orange-500 rounded-t ${barWidth} transition-all duration-300 hover:bg-orange-600 cursor-pointer`}
                                            style={{
                                                height: `${
                                                    (revenue / maxValue) * 200
                                                }px`,
                                                minHeight:
                                                    revenue > 0 ? "4px" : "0px",
                                            }}
                                        ></div>
                                        <span
                                            className={`text-xs text-gray-500 mt-2 text-center ${
                                                timeRange === "day"
                                                    ? "transform -rotate-45 origin-top-right whitespace-nowrap"
                                                    : ""
                                            }`}
                                        >
                                            {labels[index] || `#${index + 1}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Peak Hours Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        ساعات الذروة
                    </h3>
                    <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
                        {analytics.peakHours.map((hour, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <div
                                    className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                                    style={{
                                        height: `${
                                            (hour.orders /
                                                Math.max(
                                                    ...analytics.peakHours.map(
                                                        (h) => h.orders
                                                    )
                                                )) *
                                            200
                                        }px`,
                                    }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-2">
                                    {hour.hour}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Popular Items and Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Items */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        الأطباق الأكثر طلباً
                    </h3>
                    <div className="space-y-4">
                        {analytics.popularItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ml-3">
                                        <span className="text-orange-600 font-semibold text-sm">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.orders} طلب
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {item.revenue} $
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        حالة الطلبات
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full ml-3"></div>
                                <span className="text-gray-700">مكتملة</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-semibold ml-2">
                                    {analytics.orders.completed}
                                </span>
                                <span className="text-sm text-gray-500">
                                    (
                                    {(
                                        (analytics.orders.completed /
                                            analytics.orders.total) *
                                        100
                                    ).toFixed(1)}
                                    %)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full ml-3"></div>
                                <span className="text-gray-700">
                                    قيد التحضير
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-semibold ml-2">
                                    {analytics.orders.pending}
                                </span>
                                <span className="text-sm text-gray-500">
                                    (
                                    {(
                                        (analytics.orders.pending /
                                            analytics.orders.total) *
                                        100
                                    ).toFixed(1)}
                                    %)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 rounded-full ml-3"></div>
                                <span className="text-gray-700">ملغية</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-semibold ml-2">
                                    {analytics.orders.cancelled}
                                </span>
                                <span className="text-sm text-gray-500">
                                    (
                                    {(
                                        (analytics.orders.cancelled /
                                            analytics.orders.total) *
                                        100
                                    ).toFixed(1)}
                                    %)
                                </span>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="mt-6 space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>معدل الإكمال</span>
                                    <span>
                                        {(
                                            (analytics.orders.completed /
                                                analytics.orders.total) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${
                                                (analytics.orders.completed /
                                                    analytics.orders.total) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>معدل الإلغاء</span>
                                    <span>
                                        {(
                                            (analytics.orders.cancelled /
                                                analytics.orders.total) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${
                                                (analytics.orders.cancelled /
                                                    analytics.orders.total) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Analytics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    تحليل العملاء
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-user-line text-blue-600 text-2xl"></i>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {analytics.customers.new}
                        </p>
                        <p className="text-sm text-gray-600">عملاء جدد</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-user-heart-line text-green-600 text-2xl"></i>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {analytics.customers.returning}
                        </p>
                        <p className="text-sm text-gray-600">عملاء عائدون</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="ri-team-line text-purple-600 text-2xl"></i>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                            {analytics.customers.total}
                        </p>
                        <p className="text-sm text-gray-600">إجمالي العملاء</p>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
