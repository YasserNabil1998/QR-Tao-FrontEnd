import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "../../../../hooks/useToast";
import { useDirection } from "../../../../context/DirectionContext";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";
import { formatCurrency } from "../../../../utils/currency";

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    notes: string;
    category: string;
    cookTime: number; // in minutes
    status: "في الانتظار" | "جاري التحضير" | "جاهز";
    price: number;
}

interface KitchenOrder {
    id: string;
    table: string;
    customer: string;
    time: string;
    priority: "عالي" | "متوسط" | "منخفض";
    estimatedTime: number; // in minutes
    status: "طلب جديد" | "جاري التحضير" | "جاهز للتقديم";
    items: OrderItem[];
    orderTime: string;
    waitTime: number; // in minutes
    created_at: string;
    notes: string;
}

// بيانات محاكاة للطلبات
const generateMockKitchenOrders = (): KitchenOrder[] => {
    const now = new Date();
    const orders: KitchenOrder[] = [
        {
            id: "#1234",
            table: "طاولة 5",
            customer: "أحمد محمد",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            priority: "عالي",
            estimatedTime: 15,
            status: "جاري التحضير",
            items: [
                {
                    id: "item-1",
                    name: "برجر كلاسيك",
                    quantity: 2,
                    notes: "بدون بصل",
                    category: "رئيسي",
                    cookTime: 8,
                    status: "جاري التحضير",
                    price: 45.0,
                },
                {
                    id: "item-2",
                    name: "بطاطس مقلية",
                    quantity: 2,
                    notes: "",
                    category: "جانبي",
                    cookTime: 5,
                    status: "جاهز",
                    price: 15.0,
                },
            ],
            orderTime: new Date(now.getTime() - 5 * 60 * 1000).toLocaleString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }
            ),
            waitTime: 5,
            created_at: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
            notes: "بدون بصل في البرجر",
        },
        {
            id: "#1235",
            table: "طاولة 12",
            customer: "فاطمة أحمد",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            priority: "متوسط",
            estimatedTime: 10,
            status: "جاهز للتقديم",
            items: [
                {
                    id: "item-3",
                    name: "سلطة سيزر",
                    quantity: 1,
                    notes: "صوص إضافي",
                    category: "سلطات",
                    cookTime: 3,
                    status: "جاهز",
                    price: 32.0,
                },
            ],
            orderTime: new Date(now.getTime() - 10 * 60 * 1000).toLocaleString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }
            ),
            waitTime: 10,
            created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
            notes: "",
        },
        {
            id: "#1236",
            table: "طاولة 3",
            customer: "محمد علي",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            priority: "عالي",
            estimatedTime: 20,
            status: "طلب جديد",
            items: [
                {
                    id: "item-4",
                    name: "ستيك مشوي",
                    quantity: 1,
                    notes: "متوسط النضج",
                    category: "رئيسي",
                    cookTime: 12,
                    status: "في الانتظار",
                    price: 85.0,
                },
                {
                    id: "item-5",
                    name: "أرز بالخضار",
                    quantity: 1,
                    notes: "",
                    category: "جانبي",
                    cookTime: 8,
                    status: "في الانتظار",
                    price: 25.0,
                },
            ],
            orderTime: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            waitTime: 0,
            created_at: now.toISOString(),
            notes: "",
        },
        {
            id: "#1237",
            table: "طاولة 8",
            customer: "سارة خالد",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            priority: "منخفض",
            estimatedTime: 12,
            status: "جاري التحضير",
            items: [
                {
                    id: "item-6",
                    name: "بيتزا مارجريتا",
                    quantity: 1,
                    notes: "جبن إضافي",
                    category: "رئيسي",
                    cookTime: 10,
                    status: "جاري التحضير",
                    price: 55.0,
                },
            ],
            orderTime: new Date(now.getTime() - 15 * 60 * 1000).toLocaleString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }
            ),
            waitTime: 15,
            created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
            notes: "",
        },
        {
            id: "#1239",
            table: "طاولة 7",
            customer: "ليلى حسن",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            priority: "متوسط",
            estimatedTime: 18,
            status: "جاري التحضير",
            items: [
                {
                    id: "item-7",
                    name: "سوشي مكس",
                    quantity: 1,
                    notes: "",
                    category: "رئيسي",
                    cookTime: 15,
                    status: "جاري التحضير",
                    price: 95.0,
                },
                {
                    id: "item-8",
                    name: "مشروب ياباني",
                    quantity: 1,
                    notes: "",
                    category: "مشروبات",
                    cookTime: 2,
                    status: "جاهز",
                    price: 18.0,
                },
            ],
            orderTime: new Date(now.getTime() - 10 * 60 * 1000).toLocaleString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }
            ),
            waitTime: 10,
            created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
            notes: "",
        },
    ];

    return orders;
};

export default function KitchenOrders() {
    const { showToast, ToastContainer } = useToast();
    const { direction } = useDirection();
    const [orders, setOrders] = useState<KitchenOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(
        null
    );
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

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
            const mockOrders = generateMockKitchenOrders();
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
            showToast("تم تحديث الطلبات", "success");
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
            order.items.some((item) =>
                item.name.toLowerCase().includes(searchLower)
            )
        );
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "عالي":
                return "bg-red-100 text-red-800";
            case "متوسط":
                return "bg-yellow-100 text-yellow-800";
            case "منخفض":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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

    const getItemStatusColor = (status: string) => {
        switch (status) {
            case "في الانتظار":
                return "bg-gray-100 text-gray-800";
            case "جاري التحضير":
                return "bg-blue-100 text-blue-800";
            case "جاهز":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        status: newStatus as KitchenOrder["status"],
                    };
                }
                return order;
            })
        );
        showToast(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`, "success");
    };

    const updateItemStatus = (
        orderId: string,
        itemId: string,
        newStatus: "في الانتظار" | "جاري التحضير" | "جاهز"
    ) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    const updatedItems = order.items.map((item) =>
                        item.id === itemId
                            ? { ...item, status: newStatus }
                            : item
                    );

                    // إذا كانت جميع الأصناف جاهزة، تحديث حالة الطلب
                    const allItemsReady = updatedItems.every(
                        (item) => item.status === "جاهز"
                    );
                    const newOrderStatus = allItemsReady
                        ? ("جاهز للتقديم" as KitchenOrder["status"])
                        : order.status;

                    return {
                        ...order,
                        items: updatedItems,
                        status: newOrderStatus,
                    };
                }
                return order;
            })
        );
        showToast(`تم تحديث حالة الصنف`, "success");
    };

    const handlePrintKitchenTicket = () => {
        if (selectedOrder) {
            const printWindow = window.open("", "_blank");
            if (!printWindow) {
                showToast("يرجى السماح بالنوافذ المنبثقة للطباعة", "error");
                return;
            }

            const printContent = `
                <!DOCTYPE html>
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>تذكرة المطبخ - ${selectedOrder.id}</title>
                    <style>
                        body {
                            font-family: 'Cairo', Arial, sans-serif;
                            padding: 20px;
                            max-width: 400px;
                            margin: 0 auto;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 2px solid #f97316;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        .order-info {
                            margin-bottom: 15px;
                        }
                        .order-info p {
                            margin: 5px 0;
                        }
                        .items {
                            margin-top: 20px;
                        }
                        .item {
                            border-bottom: 1px solid #e5e7eb;
                            padding: 10px 0;
                        }
                        .item-name {
                            font-weight: bold;
                            font-size: 16px;
                        }
                        .item-details {
                            font-size: 14px;
                            color: #6b7280;
                            margin-top: 5px;
                        }
                        .notes {
                            background: #fef3c7;
                            padding: 10px;
                            border-right: 4px solid #f59e0b;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>تذكرة المطبخ</h1>
                        <p>${selectedOrder.id}</p>
                    </div>
                    <div class="order-info">
                        <p><strong>الطاولة:</strong> ${selectedOrder.table}</p>
                        <p><strong>العميل:</strong> ${
                            selectedOrder.customer
                        }</p>
                        <p><strong>الوقت:</strong> ${
                            selectedOrder.orderTime
                        }</p>
                        <p><strong>الأولوية:</strong> ${
                            selectedOrder.priority
                        }</p>
                    </div>
                    <div class="items">
                        <h2>الأصناف:</h2>
                        ${selectedOrder.items
                            .map(
                                (item) => `
                            <div class="item">
                                <div class="item-name">${item.name} × ${
                                    item.quantity
                                }</div>
                                <div class="item-details">
                                    الفئة: ${item.category} | وقت التحضير: ${
                                    item.cookTime
                                } دقيقة
                                </div>
                                ${
                                    item.notes
                                        ? `<div class="notes">ملاحظة: ${item.notes}</div>`
                                        : ""
                                }
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                    ${
                        selectedOrder.notes
                            ? `<div class="notes">ملاحظات الطلب: ${selectedOrder.notes}</div>`
                            : ""
                    }
                </body>
                </html>
            `;

            printWindow.document.write(printContent);
            printWindow.document.close();

            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
            showToast("جاري طباعة تذكرة المطبخ...", "info");
        }
    };

    const handleAddNote = () => {
        if (selectedOrder) {
            setShowNoteModal(true);
            setNoteText(selectedOrder.notes || "");
        }
    };

    const handleSaveNote = () => {
        if (selectedOrder && noteText.trim()) {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === selectedOrder.id
                        ? { ...order, notes: noteText.trim() }
                        : order
                )
            );
            showToast("تم إضافة الملاحظة بنجاح", "success");
            setShowNoteModal(false);
            setNoteText("");
            setSelectedOrder((prev) =>
                prev ? { ...prev, notes: noteText.trim() } : null
            );
        }
    };

    const handleCancelNote = () => {
        setShowNoteModal(false);
        setNoteText("");
    };

    // حساب متوسط وقت الانتظار
    const averageWaitTime =
        orders.length > 0
            ? Math.round(
                  orders.reduce((sum, order) => sum + order.waitTime, 0) /
                      orders.length
              )
            : 0;

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
                    طلبات المطبخ
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
                            className={`ri-refresh-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'} ${
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
                                متوسط الانتظار
                            </p>
                            <p className="text-2xl font-bold text-purple-500">
                                {averageWaitTime} دقيقة
                            </p>
                        </div>
                        <i className="ri-time-line text-2xl text-purple-500"></i>
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
                            : "لا توجد طلبات في المطبخ حالياً"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Order Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className={`w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center ${direction === 'rtl' ? 'ml-3' : 'mr-3'} flex-shrink-0`}>
                                        <i className="ri-restaurant-line text-orange-500"></i>
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
                                <div className={`${direction === 'rtl' ? 'text-right mr-2' : 'text-left ml-2'} flex-shrink-0 flex flex-col ${direction === 'rtl' ? 'items-end' : 'items-start'}`}>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-1 ${getPriorityColor(
                                            order.priority
                                        )}`}
                                    >
                                        {order.priority}
                                    </span>
                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                        {order.time}
                                    </p>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                                <div className={`${direction === 'rtl' ? 'text-right' : 'text-left'} flex-shrink-0`}>
                                    <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                        {order.estimatedTime} دقيقة
                                    </p>
                                    <p className="text-xs text-gray-500 whitespace-nowrap">
                                        وقت متوقع
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3 mb-4 flex-1">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-50 rounded-lg p-3"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`min-w-0 flex-1 ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    الكمية: {item.quantity}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getItemStatusColor(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-600 whitespace-nowrap">
                                                {item.cookTime} دقيقة
                                            </span>
                                            <span className="text-orange-600 font-medium whitespace-nowrap">
                                                {item.category}
                                            </span>
                                        </div>

                                        {item.notes && (
                                            <div className="mt-2 p-2 bg-yellow-50 rounded border-r-4 border-yellow-400">
                                                <p className="text-sm text-yellow-800 truncate">
                                                    <i className={`ri-information-line ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}></i>
                                                    {item.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Item Actions */}
                                        <div className="mt-3 flex gap-2">
                                            {item.status === "في الانتظار" && (
                                                <button
                                                    onClick={() =>
                                                        updateItemStatus(
                                                            order.id,
                                                            item.id,
                                                            "جاري التحضير"
                                                        )
                                                    }
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                                                >
                                                    بدء التحضير
                                                </button>
                                            )}
                                            {item.status === "جاري التحضير" && (
                                                <button
                                                    onClick={() =>
                                                        updateItemStatus(
                                                            order.id,
                                                            item.id,
                                                            "جاهز"
                                                        )
                                                    }
                                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                                                >
                                                    جاهز
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Actions */}
                            <div className="flex gap-2 mb-3">
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
                                        بدء التحضير
                                    </button>
                                )}
                                {order.status === "جاري التحضير" &&
                                    order.items.every(
                                        (item) => item.status === "جاهز"
                                    ) && (
                                        <button
                                            onClick={() =>
                                                updateOrderStatus(
                                                    order.id,
                                                    "جاهز للتقديم"
                                                )
                                            }
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            جاهز للتقديم
                                        </button>
                                    )}
                                {order.status === "جاري التحضير" &&
                                    !order.items.every(
                                        (item) => item.status === "جاهز"
                                    ) && (
                                        <button
                                            disabled
                                            className="flex-1 bg-gray-300 text-gray-500 py-2.5 px-4 rounded-lg text-sm font-medium cursor-not-allowed whitespace-nowrap"
                                        >
                                            جاري التحضير
                                        </button>
                                    )}
                                {order.status === "جاهز للتقديم" && (
                                    <button
                                        disabled
                                        className="flex-1 bg-green-300 text-green-700 py-2.5 px-4 rounded-lg text-sm font-medium cursor-default whitespace-nowrap"
                                    >
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

                            {/* Wait Time Indicator */}
                            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    وقت الانتظار:
                                </span>
                                <span
                                    className={`font-medium whitespace-nowrap ${
                                        order.waitTime > 15
                                            ? "text-red-600"
                                            : order.waitTime > 10
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {order.waitTime} دقيقة
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        وقت الطلب
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.orderTime}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الأولوية
                                    </label>
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                            selectedOrder.priority
                                        )}`}
                                    >
                                        {selectedOrder.priority}
                                    </span>
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
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-sm text-gray-600">
                                                        الكمية: {item.quantity}{" "}
                                                        | الفئة: {item.category}{" "}
                                                        | السعر:{" "}
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <span className="text-sm text-gray-600">
                                                        وقت التحضير:
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {item.cookTime} دقيقة
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-600">
                                                        الحالة:
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {item.status}
                                                    </p>
                                                </div>
                                            </div>

                                            {item.notes && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                                    <p className="text-sm text-yellow-800">
                                                        <i className={`ri-information-line ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}></i>
                                                        <strong>
                                                            ملاحظات:
                                                        </strong>{" "}
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
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

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrintKitchenTicket}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    <i className={`ri-printer-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}></i>
                                    طباعة تذكرة المطبخ
                                </button>
                                <button
                                    onClick={handleAddNote}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    <i className={`ri-file-add-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}></i>
                                    إضافة ملاحظة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showNoteModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                إضافة ملاحظة للطلب {selectedOrder.id}
                            </h3>
                            <button
                                onClick={handleCancelNote}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الملاحظة
                            </label>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="اكتب ملاحظتك هنا..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[100px]"
                                dir="rtl"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelNote}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSaveNote}
                                disabled={!noteText.trim()}
                                className={`flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium transition-colors ${
                                    noteText.trim()
                                        ? "hover:bg-orange-600 cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"
                                }`}
                            >
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
