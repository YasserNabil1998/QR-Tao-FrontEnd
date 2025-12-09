import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";
import { formatCurrency } from "../../../../utils/currency";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    special_instructions?: string;
}

interface Order {
    id: string;
    table: string;
    customer: string;
    items: OrderItem[];
    total_amount: number;
    status: "طلب جديد" | "جاري التحضير" | "جاهز للتقديم";
    created_at: string;
    notes?: string;
    customer_name?: string;
    customer_phone?: string;
}

interface OrderQueueProps {
    restaurantId: string;
}

// بيانات محاكاة للطلبات في قائمة الانتظار
const generateMockQueueOrders = (): Order[] => {
    const now = new Date();
    const orders: Order[] = [
        {
            id: "#1240",
            table: "طاولة 2",
            customer: "خالد أحمد",
            customer_name: "خالد أحمد",
            customer_phone: "0501234567",
            items: [
                {
                    id: "item-1",
                    name: "برجر كلاسيك",
                    quantity: 1,
                    price: 45.0,
                    special_instructions: "بدون بصل",
                },
                {
                    id: "item-2",
                    name: "بطاطس مقلية",
                    quantity: 1,
                    price: 15.0,
                },
            ],
            total_amount: 60.0,
            status: "طلب جديد",
            created_at: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
            notes: "",
        },
        {
            id: "#1241",
            table: "طاولة 9",
            customer: "نورا سعيد",
            customer_name: "نورا سعيد",
            customer_phone: "0502345678",
            items: [
                {
                    id: "item-3",
                    name: "سلطة سيزر",
                    quantity: 2,
                    price: 32.0,
                    special_instructions: "صوص إضافي",
                },
                {
                    id: "item-4",
                    name: "عصير برتقال",
                    quantity: 2,
                    price: 15.0,
                },
            ],
            total_amount: 94.0,
            status: "جاري التحضير",
            created_at: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
            notes: "",
        },
        {
            id: "#1242",
            table: "طاولة 4",
            customer: "عمر يوسف",
            customer_name: "عمر يوسف",
            customer_phone: "0503456789",
            items: [
                {
                    id: "item-5",
                    name: "ستيك مشوي",
                    quantity: 1,
                    price: 85.0,
                    special_instructions: "متوسط النضج",
                },
                {
                    id: "item-6",
                    name: "أرز بالخضار",
                    quantity: 1,
                    price: 25.0,
                },
            ],
            total_amount: 110.0,
            status: "جاهز للتقديم",
            created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
            notes: "",
        },
        {
            id: "#1243",
            table: "طاولة 11",
            customer: "ريم علي",
            customer_name: "ريم علي",
            customer_phone: "0504567890",
            items: [
                {
                    id: "item-7",
                    name: "بيتزا مارجريتا",
                    quantity: 1,
                    price: 55.0,
                    special_instructions: "جبن إضافي",
                },
            ],
            total_amount: 55.0,
            status: "طلب جديد",
            created_at: new Date(now.getTime() - 1 * 60 * 1000).toISOString(),
            notes: "يرجى التقديم بسرعة",
        },
        {
            id: "#1244",
            table: "طاولة 6",
            customer: "ياسر محمد",
            customer_name: "ياسر محمد",
            customer_phone: "0505678901",
            items: [
                {
                    id: "item-8",
                    name: "سوشي مكس",
                    quantity: 1,
                    price: 95.0,
                },
                {
                    id: "item-9",
                    name: "مشروب ياباني",
                    quantity: 1,
                    price: 18.0,
                },
            ],
            total_amount: 113.0,
            status: "جاري التحضير",
            created_at: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
            notes: "",
        },
    ];

    return orders;
};

const OrderQueue = ({ restaurantId }: OrderQueueProps) => {
    const { showToast, ToastContainer } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [restaurantId]);

    useEffect(() => {
        if (autoRefresh) {
            refreshIntervalRef.current = setInterval(() => {
                handleRefresh();
            }, 5000);
        } else {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [autoRefresh]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockOrders = generateMockQueueOrders();
            setOrders(mockOrders);
        } catch (error) {
            console.error("خطأ في جلب الطلبات:", error);
            showToast("حدث خطأ في جلب الطلبات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchOrders();
            showToast("تم تحديث قائمة الانتظار", "success");
        } catch (error) {
            showToast("حدث خطأ في تحديث الطلبات", "error");
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    const statusOptions = [
        { value: "all", label: "جميع الطلبات" },
        { value: "طلب جديد", label: "طلبات جديدة" },
        { value: "جاري التحضير", label: "جاري التحضير" },
        { value: "جاهز للتقديم", label: "جاهز للتقديم" },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            selectedStatus === "all" || order.status === selectedStatus;

        if (!matchesStatus) return false;

        if (searchTerm === "") return true;

        const searchLower = searchTerm.toLowerCase().trim();
        return (
            order.id.toLowerCase().includes(searchLower) ||
            order.table.toLowerCase().includes(searchLower) ||
            order.customer.toLowerCase().includes(searchLower) ||
            (order.customer_name &&
                order.customer_name.toLowerCase().includes(searchLower)) ||
            order.items.some((item) =>
                item.name.toLowerCase().includes(searchLower)
            )
        );
    });

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    return { ...order, status: newStatus as Order["status"] };
                }
                return order;
            })
        );
        showToast(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`, "success");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "طلب جديد":
                return "bg-orange-100 text-orange-800";
            case "جاري التحضير":
                return "bg-blue-100 text-blue-800";
            case "جاهز للتقديم":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const calculateWaitTime = (createdAt: string) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMinutes = Math.floor(
            (now.getTime() - created.getTime()) / (1000 * 60)
        );
        return diffMinutes;
    };

    if (loading && orders.length === 0) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل الطلبات..." />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    قائمة انتظار الطلبات
                </h2>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="بحث عن طلب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="w-full md:w-[200px]">
                        <CustomSelect
                            value={selectedStatus}
                            onChange={(value) => setSelectedStatus(value)}
                            options={statusOptions}
                            placeholder="فلترة حسب الحالة"
                        />
                    </div>

                    {/* Auto Refresh Toggle */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                                تحديث تلقائي:
                            </span>
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`w-8 h-4 rounded-full flex items-center justify-start transition-colors cursor-pointer p-0.5 ${
                                    autoRefresh ? "bg-green-100" : "bg-gray-200"
                                }`}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        autoRefresh
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                    }`}
                                ></div>
                            </button>
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap ${
                            isRefreshing
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                    >
                        <i
                            className={`ri-refresh-line ml-2 ${
                                isRefreshing ? "animate-spin" : ""
                            }`}
                        ></i>
                        تحديث
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">طلبات جديدة</p>
                            <p className="text-2xl font-bold text-orange-500">
                                {
                                    orders.filter(
                                        (o) => o.status === "طلب جديد"
                                    ).length
                                }
                            </p>
                        </div>
                        <i className="ri-notification-line text-2xl text-orange-500"></i>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                جاري التحضير
                            </p>
                            <p className="text-2xl font-bold text-blue-500">
                                {
                                    orders.filter(
                                        (o) => o.status === "جاري التحضير"
                                    ).length
                                }
                            </p>
                        </div>
                        <i className="ri-timer-line text-2xl text-blue-500"></i>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                جاهز للتقديم
                            </p>
                            <p className="text-2xl font-bold text-green-500">
                                {
                                    orders.filter(
                                        (o) => o.status === "جاهز للتقديم"
                                    ).length
                                }
                            </p>
                        </div>
                        <i className="ri-check-line text-2xl text-green-500"></i>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                إجمالي الطلبات
                            </p>
                            <p className="text-2xl font-bold text-purple-500">
                                {orders.length}
                            </p>
                        </div>
                        <i className="ri-file-list-line text-2xl text-purple-500"></i>
                    </div>
                </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl">
                    <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد طلبات
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm || selectedStatus !== "all"
                            ? "لا توجد طلبات تطابق معايير البحث"
                            : "لا توجد طلبات في قائمة الانتظار حالياً"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => {
                        const waitTime = calculateWaitTime(order.created_at);
                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                                            <i className="ri-table-line text-orange-500"></i>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-900 text-base truncate">
                                                {order.id}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">
                                                {order.table} - {order.customer}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* Order Time */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        <i className="ri-time-line ml-1"></i>
                                        الوقت: {formatTime(order.created_at)}
                                    </p>
                                    <p
                                        className={`text-sm font-medium mt-1 ${
                                            waitTime > 15
                                                ? "text-red-600"
                                                : waitTime > 10
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                        }`}
                                    >
                                        وقت الانتظار: {waitTime} دقيقة
                                    </p>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 rounded-lg p-3"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {item.name}
                                                </span>
                                                <span className="text-gray-600 text-sm">
                                                    ×{item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    {formatCurrency(item.price)}
                                                </span>
                                                {item.special_instructions && (
                                                    <span className="text-xs text-orange-600 truncate max-w-[60%]">
                                                        <i className="ri-information-line ml-1"></i>
                                                        {
                                                            item.special_instructions
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Notes */}
                                {order.notes && (
                                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-r-4 border-yellow-400">
                                        <p className="text-sm text-yellow-800">
                                            <i className="ri-chat-3-line ml-1"></i>
                                            {order.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Order Total */}
                                <div className="border-t border-gray-100 pt-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            الإجمالي:
                                        </span>
                                        <span className="font-bold text-lg text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="flex gap-2">
                                    {order.status === "طلب جديد" && (
                                        <button
                                            onClick={() =>
                                                updateOrderStatus(
                                                    order.id,
                                                    "جاري التحضير"
                                                )
                                            }
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            <i className="ri-play-line ml-2"></i>
                                            بدء التحضير
                                        </button>
                                    )}
                                    {order.status === "جاري التحضير" && (
                                        <button
                                            onClick={() =>
                                                updateOrderStatus(
                                                    order.id,
                                                    "جاهز للتقديم"
                                                )
                                            }
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            <i className="ri-check-line ml-2"></i>
                                            جاهز للتقديم
                                        </button>
                                    )}
                                    {order.status === "جاهز للتقديم" && (
                                        <button
                                            disabled
                                            className="flex-1 bg-green-300 text-green-700 py-2.5 px-4 rounded-lg text-sm font-medium cursor-default whitespace-nowrap"
                                        >
                                            <i className="ri-check-double-line ml-2"></i>
                                            جاهز للتقديم
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                                    >
                                        <i className="ri-eye-line text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                تفاصيل الطلب {selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رقم الطلب
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الطاولة
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.table}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        العميل
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.customer}
                                    </p>
                                </div>
                                {selectedOrder.customer_phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            رقم الهاتف
                                        </label>
                                        <p className="text-gray-900">
                                            {selectedOrder.customer_phone}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        وقت الطلب
                                    </label>
                                    <p className="text-gray-900">
                                        {formatTime(selectedOrder.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الحالة
                                    </label>
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            selectedOrder.status
                                        )}`}
                                    >
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Detailed Items */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    تفاصيل الأصناف
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-sm text-gray-600">
                                                        الكمية: {item.quantity}{" "}
                                                        | السعر:{" "}
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        item.price *
                                                            item.quantity
                                                    )}
                                                </span>
                                            </div>
                                            {item.special_instructions && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-2">
                                                    <p className="text-sm text-yellow-800">
                                                        <i className="ri-information-line ml-1"></i>
                                                        <strong>
                                                            ملاحظات:
                                                        </strong>{" "}
                                                        {
                                                            item.special_instructions
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        الإجمالي:
                                    </span>
                                    <span className="text-xl font-bold text-orange-600">
                                        {formatCurrency(
                                            selectedOrder.total_amount
                                        )}
                                    </span>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-900 mb-2">
                                        ملاحظات الطلب:
                                    </h5>
                                    <p className="text-sm text-gray-700">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                {selectedOrder.status === "طلب جديد" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateOrderStatus(
                                                selectedOrder.id,
                                                "جاري التحضير"
                                            );
                                            setSelectedOrder(null);
                                        }}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        <i className="ri-play-line ml-2"></i>
                                        بدء التحضير
                                    </button>
                                )}
                                {selectedOrder.status === "جاري التحضير" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateOrderStatus(
                                                selectedOrder.id,
                                                "جاهز للتقديم"
                                            );
                                            setSelectedOrder(null);
                                        }}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        <i className="ri-check-line ml-2"></i>
                                        جاهز للتقديم
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default OrderQueue;
