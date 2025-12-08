import { useState, useRef, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import { formatCurrency } from "../../../../utils/currency";

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
    created_at: string;
}

// بيانات محاكاة للطلبات
const generateMockOrders = (): Order[] => {
    const now = new Date();
    const orders: Order[] = [
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
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "بطاقة ائتمان",
            paymentStatus: "غير مدفوع",
            notes: "بدون بصل في البرجر",
            created_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
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
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "نقداً",
            paymentStatus: "غير مدفوع",
            notes: "",
            created_at: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
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
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "بطاقة ائتمان",
            paymentStatus: "مدفوع",
            notes: "",
            created_at: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
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
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "في انتظار الدفع",
            paymentStatus: "غير مدفوع",
            notes: "الستيك متوسط النضج",
            created_at: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
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
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "ملغي",
            paymentStatus: "ملغي",
            notes: "طلب العميل الإلغاء",
            created_at: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        },
        {
            id: "#1239",
            table: "طاولة 7",
            customer: "ليلى حسن",
            items: [
                { name: "سوشي مكس", quantity: 1, price: 95.0 },
                { name: "مشروب ياباني", quantity: 1, price: 18.0 },
            ],
            total: 113.0,
            status: "جاري التحضير",
            statusColor: "yellow",
            time: now.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            paymentMethod: "دفع إلكتروني",
            paymentStatus: "غير مدفوع",
            notes: "",
            created_at: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        },
    ];

    return orders;
};

export default function OrdersList() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(
        new Set()
    );
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const actionsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // محاكاة التأخير
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockOrders = generateMockOrders();
            setOrders(mockOrders);
        } catch (error) {
            console.error("خطأ في جلب الطلبات:", error);
            showToast("حدث خطأ في جلب الطلبات", "error");
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = [
        { value: "all", label: "جميع الطلبات" },
        { value: "طلب جديد", label: "طلبات جديدة" },
        { value: "جاري التحضير", label: "جاري التحضير" },
        { value: "جاهز للتقديم", label: "جاهز للتقديم" },
        { value: "تم التسليم", label: "تم التسليم" },
        { value: "ملغي", label: "ملغي" },
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

    const getStatusColorClasses = (statusColor: string) => {
        switch (statusColor) {
            case "orange":
                return {
                    bg: "bg-orange-100",
                    text: "text-orange-600",
                    badge: "bg-orange-100 text-orange-800",
                };
            case "yellow":
                return {
                    bg: "bg-yellow-100",
                    text: "text-yellow-600",
                    badge: "bg-yellow-100 text-yellow-800",
                };
            case "green":
                return {
                    bg: "bg-green-100",
                    text: "text-green-600",
                    badge: "bg-green-100 text-green-800",
                };
            case "blue":
                return {
                    bg: "bg-blue-100",
                    text: "text-blue-600",
                    badge: "bg-blue-100 text-blue-800",
                };
            case "red":
                return {
                    bg: "bg-red-100",
                    text: "text-red-600",
                    badge: "bg-red-100 text-red-800",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    text: "text-gray-600",
                    badge: "bg-gray-100 text-gray-800",
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
        fetchOrders();
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

    const handleViewDetails = (order: Order) => {
        if (!order) {
            showToast("خطأ في عرض تفاصيل الطلب", "error");
            return;
        }
        setSelectedOrder(order);
        setShowDetailsModal(true);
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
        } else if (currentStatus === "طلب جديد") {
            newStatus = "جاري التحضير";
        }

        if (newStatus) {
            updateOrderStatus(orderId, newStatus);
            setShowActionsMenu(null);
        }
    };

    const handleCancelOrder = (order: Order) => {
        setOrderToCancel(order);
        setShowCancelConfirm(true);
        setShowActionsMenu(null);
    };

    const confirmCancelOrder = () => {
        if (orderToCancel) {
            updateOrderStatus(orderToCancel.id, "ملغي");
            setShowCancelConfirm(false);
            setOrderToCancel(null);
        }
    };

    const handlePrintInvoice = (order?: Order) => {
        const orderToPrint = order || selectedOrder;
        if (!orderToPrint) {
            showToast("لا يوجد طلب للطباعة", "error");
            return;
        }

        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            showToast(
                "فشل فتح نافذة الطباعة. يرجى التحقق من إعدادات المتصفح",
                "error"
            );
            return;
        }

        const tax = orderToPrint.total * 0.15;
        const totalWithTax = orderToPrint.total * 1.15;

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة ${orderToPrint.id}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    .order-info {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin-bottom: 30px;
                    }
                    .info-item {
                        padding: 10px;
                        background: #f9f9f9;
                        border-radius: 5px;
                    }
                    .info-item strong {
                        display: block;
                        margin-bottom: 5px;
                        color: #666;
                        font-size: 12px;
                    }
                    .info-item span {
                        font-size: 16px;
                        font-weight: bold;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table th,
                    table td {
                        padding: 12px;
                        text-align: right;
                        border: 1px solid #ddd;
                    }
                    table th {
                        background: #f5f5f5;
                        font-weight: bold;
                    }
                    .total-section {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 2px solid #333;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        font-size: 16px;
                    }
                    .total-row.final {
                        font-size: 20px;
                        font-weight: bold;
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #333;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>فاتورة الطلب</h1>
                    <p>${selectedOrder.id}</p>
                </div>

                <div class="order-info">
                    <div class="info-item">
                        <strong>الطاولة</strong>
                        <span>${selectedOrder.table}</span>
                    </div>
                    <div class="info-item">
                        <strong>العميل</strong>
                        <span>${selectedOrder.customer}</span>
                    </div>
                    <div class="info-item">
                        <strong>التاريخ</strong>
                        <span>${new Date(
                            selectedOrder.created_at
                        ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</span>
                    </div>
                    <div class="info-item">
                        <strong>حالة الطلب</strong>
                        <span>${selectedOrder.status}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>اسم الصنف</th>
                            <th>الكمية</th>
                            <th>السعر</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderToPrint.items
                            .map(
                                (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${item.price.toFixed(2)} $</td>
                                <td>${(item.price * item.quantity).toFixed(
                                    2
                                )} $</td>
                            </tr>
                        `
                            )
                            .join("")}
                    </tbody>
                </table>

                <div class="total-section">
                    <div class="total-row">
                        <span>المجموع الفرعي:</span>
                        <span>${orderToPrint.total.toFixed(2)} $</span>
                    </div>
                    <div class="total-row">
                        <span>الضريبة (15%):</span>
                        <span>${tax.toFixed(2)} $</span>
                    </div>
                    <div class="total-row final">
                        <span>الإجمالي:</span>
                        <span>${totalWithTax.toFixed(2)} $</span>
                    </div>
                </div>

                ${
                    orderToPrint.notes
                        ? `
                <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
                    <strong>ملاحظات:</strong>
                    <p>${orderToPrint.notes}</p>
                </div>
                `
                        : ""
                }

                <div class="footer">
                    <p>شكراً لزيارتك</p>
                    <p>تم إنشاء الفاتورة في ${new Date().toLocaleString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            try {
                printWindow.print();
                showToast("تم فتح نافذة الطباعة", "success");
            } catch (error) {
                console.error("خطأ في الطباعة:", error);
                showToast("حدث خطأ في الطباعة", "error");
            }
            // Don't close immediately, let user print first
            // printWindow.close();
        }, 500);
    };

    const handleSendInvoice = (order?: Order) => {
        const orderToSend = order || selectedOrder;
        if (!orderToSend) {
            showToast("لا يوجد طلب للإرسال", "error");
            return;
        }

        // محاكاة إرسال الفاتورة
        // في التطبيق الحقيقي، سيتم إرسال الفاتورة عبر البريد الإلكتروني أو الرسائل النصية
        showToast(`تم إرسال الفاتورة للطلب ${orderToSend.id} بنجاح`, "success");
    };

    // تنسيق التاريخ الميلادي
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            إدارة الطلبات
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            إجمالي الطلبات: {orders.length}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="البحث في الطلبات..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            title="تحديث"
                        >
                            <i className="ri-refresh-line text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => {
                        const count = orders.filter(
                            (o) =>
                                status.value === "all" ||
                                o.status === status.value
                        ).length;
                        return (
                            <button
                                key={status.value}
                                onClick={() => setSelectedStatus(status.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                    selectedStatus === status.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {status.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => {
                        const colorClasses = getStatusColorClasses(
                            order.statusColor
                        );
                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 flex-shrink-0 ${colorClasses.bg}`}
                                        >
                                            <i
                                                className={`${getStatusIcon(
                                                    order.status
                                                )} ${
                                                    colorClasses.text
                                                } text-lg`}
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
                                <div className="mb-4">
                                    <p className="font-medium text-gray-900 mb-2 truncate">
                                        {order.customer}
                                    </p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium w-fit ${colorClasses.badge}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4 min-h-[100px]">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        الأصناف:
                                    </h4>
                                    <div className="space-y-1.5">
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
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}{" "}
                                                    $
                                                </span>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleOrderExpansion(
                                                        order.id
                                                    );
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
                                <div className="border-t border-gray-100 pt-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-900 text-sm">
                                            الإجمالي:
                                        </span>
                                        <span className="font-bold text-lg text-gray-900">
                                            {order.total.toFixed(2)} $
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">
                                            الدفع:
                                        </span>
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
                                    {order.status === "طلب جديد" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChangeStatus(
                                                    order.id,
                                                    order.status
                                                );
                                            }}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            قبول الطلب
                                        </button>
                                    )}
                                    {order.status === "جاري التحضير" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChangeStatus(
                                                    order.id,
                                                    order.status
                                                );
                                            }}
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            جاهز للتقديم
                                        </button>
                                    )}
                                    {order.status === "جاهز للتقديم" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChangeStatus(
                                                    order.id,
                                                    order.status
                                                );
                                            }}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                                        >
                                            تم التسليم
                                        </button>
                                    )}
                                    {(order.status === "تم التسليم" ||
                                        order.status === "ملغي") && (
                                        <div
                                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-center ${
                                                order.status === "تم التسليم"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {order.status}
                                        </div>
                                    )}
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
                                            <i className="ri-more-2-fill text-lg"></i>
                                        </button>
                                        {showActionsMenu === order.id && (
                                            <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[180px] z-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetails(
                                                            order
                                                        );
                                                    }}
                                                    className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-end gap-2"
                                                >
                                                    <i className="ri-eye-line"></i>
                                                    <span>عرض التفاصيل</span>
                                                </button>

                                                {(order.status ===
                                                    "جاري التحضير" ||
                                                    order.status ===
                                                        "جاهز للتقديم" ||
                                                    order.status ===
                                                        "طلب جديد") && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleChangeStatus(
                                                                order.id,
                                                                order.status
                                                            );
                                                        }}
                                                        className="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-end gap-2"
                                                    >
                                                        <i className="ri-arrow-right-line"></i>
                                                        <span>
                                                            {order.status ===
                                                            "طلب جديد"
                                                                ? "قبول الطلب"
                                                                : order.status ===
                                                                  "جاري التحضير"
                                                                ? "جاهز للتقديم"
                                                                : "تم التسليم"}
                                                        </span>
                                                    </button>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopyOrderId(
                                                            order.id
                                                        );
                                                    }}
                                                    className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-end gap-2"
                                                >
                                                    <i className="ri-file-copy-line"></i>
                                                    <span>نسخ رقم الطلب</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrintInvoice(
                                                            order
                                                        );
                                                    }}
                                                    className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-end gap-2"
                                                >
                                                    <i className="ri-printer-line"></i>
                                                    <span>طباعة الفاتورة</span>
                                                </button>

                                                {order.status !== "ملغي" &&
                                                    order.status !==
                                                        "تم التسليم" && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCancelOrder(
                                                                    order
                                                                );
                                                            }}
                                                            className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-end gap-2"
                                                        >
                                                            <i className="ri-close-line"></i>
                                                            <span>
                                                                إلغاء الطلب
                                                            </span>
                                                        </button>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
                    <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد طلبات
                    </h3>
                    <p className="text-gray-600">
                        لا توجد طلبات تطابق الفلتر المحدد
                    </p>
                </div>
            )}

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                تفاصيل الطلب {selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
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
                                        {formatDate(selectedOrder.created_at)}
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
                                                    $
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {item.price.toFixed(2)} $
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
                                        {selectedOrder.total.toFixed(2)} $
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
                                        $
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                                    <span>الإجمالي:</span>
                                    <span>
                                        {(selectedOrder.total * 1.15).toFixed(
                                            2
                                        )}{" "}
                                        $
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
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handlePrintInvoice(selectedOrder);
                                    }}
                                    className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap cursor-pointer transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="ri-printer-line"></i>
                                    <span>طباعة الفاتورة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        handleSendInvoice();
                                    }}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap cursor-pointer transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="ri-mail-send-line"></i>
                                    <span>إرسال الفاتورة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && orderToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                تأكيد الإلغاء
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCancelConfirm(false);
                                    setOrderToCancel(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <p className="text-gray-700 mb-6">
                            هل أنت متأكد من إلغاء الطلب {orderToCancel.id}؟
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelConfirm(false);
                                    setOrderToCancel(null);
                                }}
                                className="flex-1 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                className="flex-1 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 whitespace-nowrap cursor-pointer transition-colors"
                            >
                                تأكيد الإلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
