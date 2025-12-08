import { useState } from "react";

interface DashboardStatsProps {
    setActiveTab?: (tab: string) => void;
}

export default function DashboardStats({ setActiveTab }: DashboardStatsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState("today");

    // Mock data based on period
    const getStatsByPeriod = (period: string) => {
        const statsData: Record<
            string,
            {
                orders: { value: string; change: string; changeType: string };
                sales: { value: string; change: string; changeType: string };
                avgOrder: { value: string; change: string; changeType: string };
                newCustomers: {
                    value: string;
                    change: string;
                    changeType: string;
                };
            }
        > = {
            today: {
                orders: {
                    value: "156",
                    change: "+12%",
                    changeType: "increase",
                },
                sales: {
                    value: "12,450 $",
                    change: "+8%",
                    changeType: "increase",
                },
                avgOrder: {
                    value: "79.80 $",
                    change: "-3%",
                    changeType: "decrease",
                },
                newCustomers: {
                    value: "23",
                    change: "+15%",
                    changeType: "increase",
                },
            },
            week: {
                orders: {
                    value: "1,089",
                    change: "+18%",
                    changeType: "increase",
                },
                sales: {
                    value: "87,150 $",
                    change: "+14%",
                    changeType: "increase",
                },
                avgOrder: {
                    value: "80.05 $",
                    change: "+2%",
                    changeType: "increase",
                },
                newCustomers: {
                    value: "156",
                    change: "+22%",
                    changeType: "increase",
                },
            },
            month: {
                orders: {
                    value: "4,680",
                    change: "+25%",
                    changeType: "increase",
                },
                sales: {
                    value: "373,680 $",
                    change: "+20%",
                    changeType: "increase",
                },
                avgOrder: {
                    value: "79.85 $",
                    change: "+1%",
                    changeType: "increase",
                },
                newCustomers: {
                    value: "672",
                    change: "+30%",
                    changeType: "increase",
                },
            },
            year: {
                orders: {
                    value: "56,160",
                    change: "+35%",
                    changeType: "increase",
                },
                sales: {
                    value: "4,484,160 $",
                    change: "+28%",
                    changeType: "increase",
                },
                avgOrder: {
                    value: "79.90 $",
                    change: "+3%",
                    changeType: "increase",
                },
                newCustomers: {
                    value: "8,064",
                    change: "+40%",
                    changeType: "increase",
                },
            },
        };

        return statsData[period] || statsData.today;
    };

    const baseStats = getStatsByPeriod(selectedPeriod);

    const stats = [
        {
            title: "إجمالي الطلبات",
            value: baseStats.orders.value,
            change: baseStats.orders.change,
            changeType: baseStats.orders.changeType,
            icon: "ri-shopping-bag-line",
            color: "blue",
        },
        {
            title: "إجمالي المبيعات",
            value: baseStats.sales.value,
            change: baseStats.sales.change,
            changeType: baseStats.sales.changeType,
            icon: "ri-money-dollar-circle-line",
            color: "green",
        },
        {
            title: "متوسط قيمة الطلب",
            value: baseStats.avgOrder.value,
            change: baseStats.avgOrder.change,
            changeType: baseStats.avgOrder.changeType,
            icon: "ri-calculator-line",
            color: "orange",
        },
        {
            title: "العملاء الجدد",
            value: baseStats.newCustomers.value,
            change: baseStats.newCustomers.change,
            changeType: baseStats.newCustomers.changeType,
            icon: "ri-user-add-line",
            color: "purple",
        },
    ];

    const recentOrders = [
        {
            id: "#1234",
            table: "طاولة 5",
            items: "برجر كلاسيك، بطاطس مقلية، كوكا كولا",
            amount: "85.50 $",
            status: "جاري التحضير",
            time: "10:30 ص",
            statusColor: "yellow",
        },
        {
            id: "#1235",
            table: "طاولة 12",
            items: "سلطة سيزر، عصير برتقال",
            amount: "45.00 $",
            status: "جاهز للتقديم",
            time: "10:25 ص",
            statusColor: "green",
        },
        {
            id: "#1236",
            table: "طاولة 3",
            items: "بيتزا مارجريتا، مشروب غازي",
            amount: "95.00 $",
            status: "تم التسليم",
            time: "10:20 ص",
            statusColor: "blue",
        },
        {
            id: "#1237",
            table: "طاولة 8",
            items: "ستيك مشوي، أرز، سلطة",
            amount: "125.00 $",
            status: "ملغي",
            time: "10:15 ص",
            statusColor: "red",
        },
    ];

    const topDishes = [
        {
            name: "برجر كلاسيك",
            orders: 45,
            revenue: "2,250 $",
            image: "https://readdy.ai/api/search-image?query=Classic%20beef%20burger%20with%20lettuce%20tomato%20cheese%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20clean%20background%2C%20mouth-watering%20burger&width=60&height=60&seq=dish-1&orientation=squarish",
        },
        {
            name: "بيتزا مارجريتا",
            orders: 38,
            revenue: "1,900 $",
            image: "https://readdy.ai/api/search-image?query=Margherita%20pizza%20with%20fresh%20basil%20mozzarella%20tomato%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation%2C%20appetizing%20pizza&width=60&height=60&seq=dish-2&orientation=squarish",
        },
        {
            name: "سلطة سيزر",
            orders: 32,
            revenue: "1,280 $",
            image: "https://readdy.ai/api/search-image?query=Caesar%20salad%20with%20croutons%20parmesan%20cheese%20lettuce%2C%20fresh%20healthy%20salad%2C%20professional%20food%20photography%2C%20restaurant%20quality%20presentation%2C%20appetizing%20salad&width=60&height=60&seq=dish-3&orientation=squarish",
        },
        {
            name: "ستيك مشوي",
            orders: 28,
            revenue: "2,800 $",
            image: "https://readdy.ai/api/search-image?query=Grilled%20steak%20with%20vegetables%2C%20professional%20food%20photography%2C%20restaurant%20quality%20meat%2C%20appetizing%20presentation%2C%20fine%20dining%2C%20cooked%20beef%20steak&width=60&height=60&seq=dish-4&orientation=squarish",
        },
    ];

    const periods = [
        { value: "today", label: "اليوم" },
        { value: "week", label: "هذا الأسبوع" },
        { value: "month", label: "هذا الشهر" },
        { value: "year", label: "هذا العام" },
    ];

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    لوحة المعلومات
                </h2>
                <div className="flex bg-gray-100 rounded-full p-1">
                    {periods.map((period) => (
                        <button
                            key={period.value}
                            onClick={() => setSelectedPeriod(period.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                selectedPeriod === period.value
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    stat.color === "blue"
                                        ? "bg-blue-100"
                                        : stat.color === "green"
                                        ? "bg-green-100"
                                        : stat.color === "orange"
                                        ? "bg-orange-100"
                                        : "bg-purple-100"
                                }`}
                            >
                                <i
                                    className={`${stat.icon} text-lg ${
                                        stat.color === "blue"
                                            ? "text-blue-500"
                                            : stat.color === "green"
                                            ? "text-green-500"
                                            : stat.color === "orange"
                                            ? "text-orange-500"
                                            : "text-purple-500"
                                    }`}
                                ></i>
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    stat.changeType === "increase"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">
                            {stat.title}
                        </h3>
                        <p className="text-xl font-bold text-gray-900">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            الطلبات الأخيرة
                        </h3>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium cursor-pointer">
                            عرض الكل
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900">
                                            {order.id}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {order.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {order.table}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {order.items}
                                    </p>
                                </div>
                                <div className="text-right mr-3">
                                    <p className="font-semibold text-gray-900 mb-1">
                                        {order.amount}
                                    </p>
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            order.statusColor === "yellow"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : order.statusColor === "green"
                                                ? "bg-green-100 text-green-800"
                                                : order.statusColor === "blue"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Dishes */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            الأطباق الأكثر طلباً
                        </h3>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium cursor-pointer">
                            عرض التقرير
                        </button>
                    </div>

                    <div className="space-y-3">
                        {topDishes.map((dish, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-10 h-10 rounded-lg object-cover object-top ml-3"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {dish.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {dish.orders} طلب
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {dish.revenue}
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-12 bg-gray-200 rounded-full h-2 ml-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (dish.orders / 45) * 100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {Math.round(
                                                (dish.orders / 45) * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    إجراءات سريعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => setActiveTab?.("menu")}
                        className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                            <i className="ri-add-line text-xl text-orange-500"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            إضافة طبق جديد
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab?.("qr-generator")}
                        className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                            <i className="ri-qr-code-line text-xl text-blue-500"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            إنشاء رمز QR
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab?.("analytics")}
                        className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                            <i className="ri-file-chart-line text-xl text-green-500"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            تقرير المبيعات
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab?.("settings")}
                        className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                            <i className="ri-settings-line text-xl text-purple-500"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            إعدادات المطعم
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
