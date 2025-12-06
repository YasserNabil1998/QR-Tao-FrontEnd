import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "../../../../hooks/useToast";

interface Order {
    id: string;
    table: string;
    customer: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: string;
    statusColor: string;
    time: string;
    paymentMethod: string;
    paymentStatus: string;
    notes: string;
}

export default function OrdersList() {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "#1234",
            table: "طاولة 5",
            customer: "أحمد محمد",
            items: [
                { name: "برجر كلاسيك", quantity: 2, price: 45.0 },
                { name: "بطاطس مقلية", quantity: 2, price: 15.0 },
                { name: "كوكا كولا", quantity: 2, price: 8.0 },
            ],
            total: 136.0,
            status: "جاري التحضير",
            statusColor: "yellow",
            time: "10:30 ص",
            paymentMethod: "بطاقة ائتمان",
            paymentStatus: "مدفوع",
            notes: "بدون بصل في البرجر",
        },
        {
            id: "#1235",
            table: "طاولة 12",
            customer: "فاطمة أحمد",
            items: [
                { name: "سلطة سيزر", quantity: 1, price: 32.0 },
                { name: "عصير برتقال", quantity: 1, price: 15.0 },
            ],
            total: 47.0,
            status: "جاهز للتقديم",
            statusColor: "green",
            time: "10:25 ص",
            paymentMethod: "نقداً",
            paymentStatus: "مدفوع",
            notes: "",
        },
        {
            id: "#1236",
            table: "طاولة 3",
            customer: "محمد علي",
            items: [
                { name: "بيتزا مارجريتا", quantity: 1, price: 55.0 },
                { name: "مشروب غازي", quantity: 1, price: 8.0 },
            ],
            total: 63.0,
            status: "تم التسليم",
            statusColor: "blue",
            time: "10:20 ص",
            paymentMethod: "بطاقة ائتمان",
            paymentStatus: "مدفوع",
            notes: "",
        },
        {
            id: "#1237",
            table: "طاولة 8",
            customer: "سارة خالد",
            items: [
                { name: "ستيك مشوي", quantity: 1, price: 85.0 },
                { name: "أرز بالخضار", quantity: 1, price: 25.0 },
                { name: "سلطة خضراء", quantity: 1, price: 18.0 },
            ],
            total: 128.0,
            status: "طلب جديد",
            statusColor: "orange",
            time: "10:35 ص",
            paymentMethod: "في انتظار الدفع",
            paymentStatus: "غير مدفوع",
            notes: "الستيك متوسط النضج",
        },
        {
            id: "#1238",
            table: "طاولة 15",
            customer: "عبدالله سعد",
            items: [
                { name: "تشيز كيك", quantity: 2, price: 28.0 },
                { name: "قهوة عربية", quantity: 2, price: 12.0 },
            ],
            total: 80.0,
            status: "ملغي",
            statusColor: "red",
            time: "10:15 ص",
            paymentMethod: "ملغي",
            paymentStatus: "ملغي",
            notes: "طلب العميل الإلغاء",
        },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(
        new Set()
    );
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
    const actionsMenuRef = useRef<HTMLDivElement>(null);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                actionsMenuRef.current &&
                !actionsMenuRef.current.contains(event.target as Node)
            ) {
                setShowActionsMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const statusOptions = [
        { value: "all", label: "جميع الطلبات", count: orders.length },
        {
            value: "طلب جديد",
            label: "طلبات جديدة",
            count: orders.filter((o) => o.status === "طلب جديد").length,
        },
        {
            value: "جاري التحضير",
            label: "جاري التحضير",
            count: orders.filter((o) => o.status === "جاري التحضير").length,
        },
        {
            value: "جاهز للتقديم",
            label: "جاهز للتقديم",
            count: orders.filter((o) => o.status === "جاهز للتقديم").length,
        },
        {
            value: "تم التسليم",
            label: "تم التسليم",
            count: orders.filter((o) => o.status === "تم التسليم").length,
        },
        {
            value: "ملغي",
            label: "ملغي",
            count: orders.filter((o) => o.status === "ملغي").length,
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            selectedStatus === "all" || order.status === selectedStatus;
        const matchesSearch =
            searchTerm === "" ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.table.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "طلب جديد":
                return "ri-notification-line";
            case "جاري التحضير":
                return "ri-timer-line";
            case "جاهز للتقديم":
                return "ri-check-line";
            case "تم التسليم":
                return "ri-check-double-line";
            case "ملغي":
                return "ri-close-line";
            default:
                return "ri-file-list-line";
        }
    };

    const getStatusButtonConfig = (status: string) => {
        switch (status) {
            case "طلب جديد":
                return {
                    text: "قبول الطلب",
                    bgColor: "bg-orange-500",
                    hoverColor: "hover:bg-orange-600",
                    onClick: (orderId: string) => {
                        updateOrderStatus(orderId, "جاري التحضير");
                    },
                };
            case "جاري التحضير":
                return {
                    text: "جاري التحضير",
                    bgColor: "bg-yellow-500",
                    hoverColor: "hover:bg-yellow-600",
                    onClick: null, // Display only, no action
                };
            case "جاهز للتقديم":
                return {
                    text: "جاهز للتقديم",
                    bgColor: "bg-green-500",
                    hoverColor: "hover:bg-green-600",
                    onClick: (orderId: string) => {
                        updateOrderStatus(orderId, "تم التسليم");
                    },
                };
            case "تم التسليم":
                return {
                    text: "تم التسليم",
                    bgColor: "bg-green-500",
                    hoverColor: "hover:bg-green-600",
                    onClick: null, // Display only, no action
                };
            case "ملغي":
                return {
                    text: "ملغي",
                    bgColor: "bg-red-500",
                    hoverColor: "hover:bg-red-600",
                    onClick: null, // Display only, no action
                };
            default:
                return {
                    text: status,
                    bgColor: "bg-gray-500",
                    hoverColor: "hover:bg-gray-600",
                    onClick: null,
                };
        }
    };

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === orderId) {
                    let statusColor = order.statusColor;
                    if (newStatus === "طلب جديد") statusColor = "orange";
                    else if (newStatus === "جاري التحضير")
                        statusColor = "yellow";
                    else if (newStatus === "جاهز للتقديم")
                        statusColor = "green";
                    else if (newStatus === "تم التسليم") statusColor = "blue";
                    else if (newStatus === "ملغي") statusColor = "red";

                    return { ...order, status: newStatus, statusColor };
                }
                return order;
            })
        );
        showToast(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`, "success");
        setShowActionsMenu(null);
    };

    const handleRefresh = () => {
        showToast("تم تحديث قائمة الطلبات", "success");
    };

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const handlePrintInvoice = (order?: Order) => {
        const orderToPrint = order || selectedOrder;
        if (orderToPrint) {
            // Open print dialog
            setTimeout(() => {
                window.print();
            }, 100);
            showToast("جاري طباعة الفاتورة...", "info");
            setShowActionsMenu(null);
        }
    };

    const handleSendInvoice = (order?: Order) => {
        const orderToSend = order || selectedOrder;
        if (orderToSend) {
            showToast(
                `تم إرسال الفاتورة للطلب ${orderToSend.id} بنجاح`,
                "success"
            );
            setShowActionsMenu(null);
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowActionsMenu(null);
    };

    const handleCopyOrderId = (orderId: string) => {
        navigator.clipboard.writeText(orderId);
        showToast("تم نسخ رقم الطلب", "success");
        setShowActionsMenu(null);
    };

    const handleChangeStatus = (orderId: string, currentStatus: string) => {
        let newStatus = "";
        if (currentStatus === "جاري التحضير") {
            newStatus = "جاهز للتقديم";
        } else if (currentStatus === "جاهز للتقديم") {
            newStatus = "تم التسليم";
        }

        if (newStatus) {
            updateOrderStatus(orderId, newStatus);
            setShowActionsMenu(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة الطلبات
                </h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="البحث في الطلبات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-refresh-line ml-1"></i>
                        تحديث
                    </button>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                    <button
                        key={status.value}
                        onClick={() => setSelectedStatus(status.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            selectedStatus === status.value
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {status.label} ({status.count})
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 flex-shrink-0 ${
                                        order.statusColor === "orange"
                                            ? "bg-orange-100"
                                            : order.statusColor === "yellow"
                                            ? "bg-yellow-100"
                                            : order.statusColor === "green"
                                            ? "bg-green-100"
                                            : order.statusColor === "blue"
                                            ? "bg-blue-100"
                                            : "bg-red-100"
                                    }`}
                                >
                                    <i
                                        className={`${getStatusIcon(
                                            order.status
                                        )} ${
                                            order.statusColor === "orange"
                                                ? "text-orange-500"
                                                : order.statusColor === "yellow"
                                                ? "text-yellow-500"
                                                : order.statusColor === "green"
                                                ? "text-green-500"
                                                : order.statusColor === "blue"
                                                ? "text-blue-500"
                                                : "text-red-500"
                                        }`}
                                    ></i>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-900 text-base truncate">
                                        {order.id}
                                    </h3>
                                    <p className="text-sm text-gray-600 truncate">
                                        {order.table}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                                {order.time}
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-4 min-h-[60px] flex flex-col justify-between">
                            <p className="font-medium text-gray-900 mb-2 truncate">
                                {order.customer}
                            </p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-fit ${
                                    order.statusColor === "orange"
                                        ? "bg-orange-100 text-orange-800"
                                        : order.statusColor === "yellow"
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

                        {/* Order Items */}
                        <div className="mb-4 min-h-[100px] flex flex-col">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                الأصناف:
                            </h4>
                            <div className="space-y-1.5 flex-1">
                                {(expandedOrders.has(order.id)
                                    ? order.items
                                    : order.items.slice(0, 2)
                                ).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span className="text-gray-600 truncate flex-1 mr-2">
                                            {item.quantity}x {item.name}
                                        </span>
                                        <span className="text-gray-900 font-medium whitespace-nowrap">
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}{" "}
                                            ر.س
                                        </span>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOrderExpansion(order.id);
                                        }}
                                        className="text-xs text-orange-500 hover:text-orange-600 font-medium cursor-pointer mt-1"
                                    >
                                        {expandedOrders.has(order.id)
                                            ? "عرض أقل"
                                            : `+${
                                                  order.items.length - 2
                                              } صنف آخر`}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Total and Payment */}
                        <div className="border-t border-gray-100 pt-4 mb-4 min-h-[70px] flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900 text-sm">
                                    الإجمالي:
                                </span>
                                <span className="font-bold text-lg text-gray-900">
                                    {order.total.toFixed(2)} ر.س
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">الدفع:</span>
                                <span
                                    className={`font-medium ${
                                        order.paymentStatus === "مدفوع"
                                            ? "text-green-600"
                                            : order.paymentStatus ===
                                              "غير مدفوع"
                                            ? "text-red-600"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            {(() => {
                                const buttonConfig = getStatusButtonConfig(
                                    order.status
                                );
                                return (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (buttonConfig.onClick) {
                                                buttonConfig.onClick(order.id);
                                            }
                                        }}
                                        className={`flex-1 ${
                                            buttonConfig.bgColor
                                        } ${
                                            buttonConfig.hoverColor
                                        } text-white py-2.5 px-4 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                            buttonConfig.onClick
                                                ? "cursor-pointer"
                                                : "cursor-default"
                                        }`}
                                    >
                                        {buttonConfig.text}
                                    </button>
                                );
                            })()}
                            <div
                                className="relative flex-shrink-0"
                                ref={actionsMenuRef}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowActionsMenu(
                                            showActionsMenu === order.id
                                                ? null
                                                : order.id
                                        );
                                    }}
                                    className="w-10 h-10 flex items-center justify-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <i className="ri-more-line text-lg"></i>
                                </button>
                                {showActionsMenu === order.id && (
                                    <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(order);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i className="ri-eye-line ml-2"></i>
                                            عرض التفاصيل
                                        </button>

                                        {(order.status === "جاري التحضير" ||
                                            order.status ===
                                                "جاهز للتقديم") && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChangeStatus(
                                                        order.id,
                                                        order.status
                                                    );
                                                }}
                                                className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                                <i className="ri-arrow-right-line ml-2"></i>
                                                {order.status === "جاري التحضير"
                                                    ? "جاهز للتقديم"
                                                    : "تم التسليم"}
                                </button>
                            )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyOrderId(order.id);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i className="ri-file-copy-line ml-2"></i>
                                            نسخ رقم الطلب
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(order);
                                                // Print after opening modal
                                                setTimeout(() => {
                                                    handlePrintInvoice(order);
                                                }, 300);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i className="ri-printer-line ml-2"></i>
                                            طباعة الفاتورة
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendInvoice(order);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <i className="ri-mail-send-line ml-2"></i>
                                            إرسال الفاتورة
                                        </button>

                                        {order.status !== "ملغي" &&
                                            order.status !== "تم التسليم" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateOrderStatus(
                                            order.id,
                                                            "ملغي"
                                        );
                                    }}
                                                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                                    <i className="ri-close-line ml-2"></i>
                                                    إلغاء الطلب
                                </button>
                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الوقت
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.time}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    أصناف الطلب
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <h5 className="font-medium text-gray-900">
                                                    {item.name}
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    الكمية: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}{" "}
                                                    ر.س
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {item.price.toFixed(2)} ر.س
                                                    للقطعة
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">
                                        المجموع الفرعي:
                                    </span>
                                    <span className="text-gray-900">
                                        {selectedOrder.total.toFixed(2)} ر.س
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">
                                        الضريبة (15%):
                                    </span>
                                    <span className="text-gray-900">
                                        {(selectedOrder.total * 0.15).toFixed(
                                            2
                                        )}{" "}
                                        ر.س
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                                    <span>الإجمالي:</span>
                                    <span>
                                        {(selectedOrder.total * 1.15).toFixed(
                                            2
                                        )}{" "}
                                        ر.س
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        طريقة الدفع
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedOrder.paymentMethod}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        حالة الدفع
                                    </label>
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            selectedOrder.paymentStatus ===
                                            "مدفوع"
                                                ? "bg-green-100 text-green-800"
                                                : selectedOrder.paymentStatus ===
                                                  "غير مدفوع"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ملاحظات
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handlePrintInvoice}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    طباعة الفاتورة
                                </button>
                                <button
                                    onClick={handleSendInvoice}
                                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إرسال الفاتورة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد طلبات
                    </h3>
                    <p className="text-gray-600">
                        لا توجد طلبات تطابق الفلتر المحدد
                    </p>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
