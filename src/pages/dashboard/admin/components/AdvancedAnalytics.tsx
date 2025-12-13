import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

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
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    if (!analytics) return null;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    التحليلات المتقدمة
                </h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="w-full sm:w-48">
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
                            className="w-full sm:w-48"
                        />
                    </div>
                    <button
                        onClick={() => {
                            showToast("ميزة تصدير التقرير قيد التطوير", "info");
                        }}
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                    >
                        <i className="ri-download-line"></i>
                        <span className="text-sm sm:text-base">تصدير التقرير</span>
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                            <i className="ri-money-dollar-circle-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الإيرادات
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
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
                            <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center font-tajawal">
                                <i className="ri-arrow-up-line ml-1"></i>
                                <span className="line-clamp-1">+12.5% من الأسبوع الماضي</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-shopping-cart-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الطلبات
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {analytics.orders.total}
                            </p>
                            <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center font-tajawal">
                                <i className="ri-arrow-up-line ml-1"></i>
                                <span className="line-clamp-1">+8.3% من الأسبوع الماضي</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                            <i className="ri-user-add-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                العملاء الجدد
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {analytics.customers.new}
                            </p>
                            <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center font-tajawal">
                                <i className="ri-arrow-up-line ml-1"></i>
                                <span className="line-clamp-1">+15.2% من الأسبوع الماضي</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                            <i className="ri-check-double-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                معدل الإكمال
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {(
                                    (analytics.orders.completed /
                                        analytics.orders.total) *
                                    100
                                ).toFixed(1)}
                                %
                            </p>
                            <p className="text-xs sm:text-sm text-green-600 mt-1 flex items-center font-tajawal">
                                <i className="ri-arrow-up-line ml-1"></i>
                                <span className="line-clamp-1">+2.1% من الأسبوع الماضي</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                        {timeRange === "day"
                            ? "الإيرادات بالساعة"
                            : timeRange === "week"
                            ? "الإيرادات اليومية"
                            : timeRange === "month"
                            ? "الإيرادات الأسبوعية"
                            : "الإيرادات الشهرية"}
                    </h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <div
                            className={`h-48 sm:h-64 flex items-end ${
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
                                    timeRange === "day" ? "w-4 sm:w-6" : "w-6 sm:w-8";
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
                                            className={`text-xs text-gray-500 mt-1 sm:mt-2 text-center ${
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
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                        ساعات الذروة
                    </h3>
                    <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 overflow-x-auto">
                        {analytics.peakHours.map((hour, index) => {
                            const maxOrders = Math.max(
                                ...analytics.peakHours.map((h) => h.orders)
                            );
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center flex-shrink-0"
                                >
                                    <div
                                        className="bg-blue-500 rounded-t w-6 sm:w-8 transition-all duration-300 hover:bg-blue-600"
                                        style={{
                                            height: `${
                                                (hour.orders / maxOrders) * 200
                                            }px`,
                                        }}
                                    ></div>
                                    <span className="text-xs text-gray-500 mt-1 sm:mt-2 font-tajawal">
                                        {hour.hour}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Popular Items and Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Popular Items */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                        الأطباق الأكثر طلباً
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        {analytics.popularItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-2 sm:gap-3"
                            >
                                <div className="flex items-center min-w-0 flex-1">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0">
                                        <span className="text-orange-600 font-semibold text-xs sm:text-sm font-cairo">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate font-cairo">
                                            {item.name}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 font-tajawal">
                                            {item.orders} طلب
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm sm:text-base font-semibold text-gray-900 font-cairo">
                                        {item.revenue.toLocaleString()} $
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                        حالة الطلبات
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-gray-700 font-tajawal truncate">مكتملة</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-sm sm:text-base text-gray-900 font-semibold font-cairo">
                                    {analytics.orders.completed}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 font-tajawal">
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

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-gray-700 font-tajawal truncate">
                                    قيد التحضير
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-sm sm:text-base text-gray-900 font-semibold font-cairo">
                                    {analytics.orders.pending}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 font-tajawal">
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

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-gray-700 font-tajawal truncate">ملغية</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className="text-sm sm:text-base text-gray-900 font-semibold font-cairo">
                                    {analytics.orders.cancelled}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 font-tajawal">
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
                        <div className="mt-4 sm:mt-6 space-y-3">
                            <div>
                                <div className="flex justify-between text-xs sm:text-sm mb-1 font-tajawal">
                                    <span>معدل الإكمال</span>
                                    <span className="font-cairo">
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
                                <div className="flex justify-between text-xs sm:text-sm mb-1 font-tajawal">
                                    <span>معدل الإلغاء</span>
                                    <span className="font-cairo">
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
            <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-5 lg:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                    تحليل العملاء
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <i className="ri-user-line text-blue-600 text-xl sm:text-2xl"></i>
                        </div>
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {analytics.customers.new}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal mt-1">عملاء جدد</p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <i className="ri-user-heart-line text-green-600 text-xl sm:text-2xl"></i>
                        </div>
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {analytics.customers.returning}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal mt-1">عملاء عائدون</p>
                    </div>

                    <div className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                            <i className="ri-team-line text-purple-600 text-xl sm:text-2xl"></i>
                        </div>
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                            {analytics.customers.total}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 font-tajawal mt-1">إجمالي العملاء</p>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
