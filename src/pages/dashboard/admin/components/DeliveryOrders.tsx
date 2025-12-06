import { useState, useEffect } from "react";
import CustomSelect from "../../../../components/common/CustomSelect";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";
import { useToast } from "../../../../hooks/useToast";

interface DeliveryOrder {
    id: string;
    order_number: string;
    order_date: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    status:
        | "pending"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "cancelled";
    payment_status: "unpaid" | "partial" | "paid";
    payment_method: "cash" | "visa" | "mixed";
    total_amount: number;
    paid_amount: number;
    delivery_fee: number;
    delivery_time?: string;
    notes?: string;
    created_by: string;
}

interface DeliveryOrderItem {
    id: string;
    delivery_order_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;
}

interface Payment {
    id: string;
    delivery_order_id: string;
    amount: number;
    payment_method: "cash" | "visa";
    payment_date: string;
    reference_number?: string;
    notes?: string;
}

export default function DeliveryOrders() {
    const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(
        null
    );
    const [orderItems, setOrderItems] = useState<DeliveryOrderItem[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentHistoryModal, setShowPaymentHistoryModal] =
        useState(false);
    const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<DeliveryOrder | null>(
        null
    );
    const [filter, setFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const { showToast, ToastContainer } = useToast();

    const [newOrder, setNewOrder] = useState({
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        delivery_fee: 15,
        notes: "",
        items: [{ item_name: "", quantity: 1, unit_price: 0, notes: "" }],
    });

    const [paymentData, setPaymentData] = useState<{
        amount: number;
        payment_method: "cash" | "visa";
        reference_number: string;
        notes: string;
    }>({
        amount: 0,
        payment_method: "cash",
        reference_number: "",
        notes: "",
    });

    // Mock data for demonstration
    const initialMockOrders: DeliveryOrder[] = [
        {
            id: "1",
            order_number: "DEL-2024-001",
            order_date: "2024-01-15",
            customer_name: "أحمد محمد علي",
            customer_phone: "01234567890",
            delivery_address: "شارع النيل، المعادي، القاهرة",
            status: "out_for_delivery",
            payment_status: "paid",
            payment_method: "visa",
            total_amount: 285,
            paid_amount: 285,
            delivery_fee: 15,
            delivery_time: "14:30",
            notes: "طلب عاجل - يفضل التوصيل قبل المغرب",
            created_by: "محمد أحمد",
        },
        {
            id: "2",
            order_number: "DEL-2024-002",
            order_date: "2024-01-15",
            customer_name: "فاطمة حسن",
            customer_phone: "01098765432",
            delivery_address: "شارع التحرير، وسط البلد، القاهرة",
            status: "preparing",
            payment_status: "partial",
            payment_method: "mixed",
            total_amount: 420,
            paid_amount: 200,
            delivery_fee: 20,
            notes: "دفع جزئي - المتبقي عند الاستلام",
            created_by: "سارة محمد",
        },
        {
            id: "3",
            order_number: "DEL-2024-003",
            order_date: "2024-01-14",
            customer_name: "خالد عبدالله",
            customer_phone: "01555444333",
            delivery_address: "مدينة نصر، القاهرة الجديدة",
            status: "delivered",
            payment_status: "paid",
            payment_method: "cash",
            total_amount: 350,
            paid_amount: 350,
            delivery_fee: 25,
            delivery_time: "19:45",
            created_by: "أحمد علي",
        },
    ];

    const mockOrderItems: DeliveryOrderItem[] = [
        {
            id: "1",
            delivery_order_id: "1",
            item_name: "برجر لحم مشوي",
            quantity: 2,
            unit_price: 85,
            total_price: 170,
            notes: "بدون بصل",
        },
        {
            id: "2",
            delivery_order_id: "1",
            item_name: "بطاطس مقلية كبيرة",
            quantity: 1,
            unit_price: 35,
            total_price: 35,
        },
        {
            id: "3",
            delivery_order_id: "1",
            item_name: "كوكاكولا",
            quantity: 2,
            unit_price: 25,
            total_price: 50,
        },
        {
            id: "4",
            delivery_order_id: "1",
            item_name: "رسوم التوصيل",
            quantity: 1,
            unit_price: 15,
            total_price: 15,
        },
    ];

    useEffect(() => {
        if (deliveryOrders.length === 0) {
            setDeliveryOrders(initialMockOrders);
        }
    }, []);

    const fetchOrderItems = (orderId: string) => {
        try {
            // في التطبيق الحقيقي، سيتم جلب البيانات من Supabase
            const items = mockOrderItems.filter(
                (item) => item.delivery_order_id === orderId
            );
            // إذا لم توجد عناصر، أنشئ عناصر وهمية للطلب الجديد
            if (items.length === 0) {
                // البحث عن الطلب في القائمة لاستخراج العناصر إذا كانت محفوظة
                const order = deliveryOrders.find((o) => o.id === orderId);
                if (order) {
                    // إنشاء عناصر وهمية بناءً على بيانات الطلب
                    setOrderItems([
                        {
                            id: `item-${orderId}-1`,
                            delivery_order_id: orderId,
                            item_name: "عناصر الطلب",
                            quantity: 1,
                            unit_price: order.total_amount - order.delivery_fee,
                            total_price:
                                order.total_amount - order.delivery_fee,
                            notes: order.notes || "",
                        },
                        {
                            id: `item-${orderId}-2`,
                            delivery_order_id: orderId,
                            item_name: "رسوم التوصيل",
                            quantity: 1,
                            unit_price: order.delivery_fee,
                            total_price: order.delivery_fee,
                            notes: "",
                        },
                    ]);
                } else {
                    setOrderItems([
                        {
                            id: `item-${orderId}-1`,
                            delivery_order_id: orderId,
                            item_name: "عنصر الطلب",
                            quantity: 1,
                            unit_price: 0,
                            total_price: 0,
                            notes: "",
                        },
                    ]);
                }
            } else {
                setOrderItems(items);
            }
        } catch (error) {
            console.error("خطأ في جلب عناصر الطلب:", error);
            setOrderItems([]);
        }
    };

    const fetchPaymentHistory = (orderId: string) => {
        try {
            // البحث عن المدفوعات المحفوظة في state أو استخدام بيانات وهمية
            const order = deliveryOrders.find((o) => o.id === orderId);
            if (order && order.paid_amount > 0) {
                // إنشاء سجل دفعة وهمي بناءً على المبلغ المدفوع
                const paymentMethod =
                    order.payment_method === "mixed"
                        ? "cash"
                        : order.payment_method === "visa"
                        ? "visa"
                        : "cash";
                const mockPayments: Payment[] = [
                    {
                        id: `payment-${orderId}-1`,
                        delivery_order_id: orderId,
                        amount: order.paid_amount,
                        payment_method: paymentMethod,
                        payment_date: order.order_date,
                        reference_number:
                            order.payment_method === "visa"
                                ? "REF-001"
                                : undefined,
                        notes: "دفعة مسجلة",
                    },
                ];
                setPayments(mockPayments);
            } else {
                setPayments([]);
            }
        } catch (error) {
            console.error("خطأ في جلب تاريخ المدفوعات:", error);
            setPayments([]);
        }
    };

    const handleAddOrder = () => {
        // التحقق من صحة البيانات
        if (!newOrder.customer_name.trim()) {
            showToast("يرجى إدخال اسم العميل", "error");
            return;
        }
        if (!newOrder.customer_phone.trim()) {
            showToast("يرجى إدخال رقم الهاتف", "error");
            return;
        }
        if (!newOrder.delivery_address.trim()) {
            showToast("يرجى إدخال عنوان التوصيل", "error");
            return;
        }
        if (newOrder.items.some((item) => !item.item_name.trim())) {
            showToast("يرجى إدخال اسم الصنف لجميع العناصر", "error");
            return;
        }
        if (newOrder.items.some((item) => item.unit_price <= 0)) {
            showToast("يرجى إدخال سعر صحيح لجميع العناصر", "error");
            return;
        }

        try {
            const orderNumber = `DEL-${Date.now()}`;
            const subtotal = newOrder.items.reduce(
                (sum, item) => sum + item.quantity * item.unit_price,
                0
            );
            const totalAmount = subtotal + newOrder.delivery_fee;

            const newDeliveryOrder: DeliveryOrder = {
                id: `order-${Date.now()}`,
                order_number: orderNumber,
                order_date: new Date().toISOString().split("T")[0],
                customer_name: newOrder.customer_name,
                customer_phone: newOrder.customer_phone,
                delivery_address: newOrder.delivery_address,
                status: "pending",
                payment_status: "unpaid",
                payment_method: "cash",
                total_amount: totalAmount,
                paid_amount: 0,
                delivery_fee: newOrder.delivery_fee,
                notes: newOrder.notes,
                created_by: "admin",
            };

            // إضافة الطلب إلى القائمة
            setDeliveryOrders((prev) => [newDeliveryOrder, ...prev]);

            showToast(`تم إضافة الطلب ${orderNumber} بنجاح`, "success");
            setShowAddModal(false);
            resetNewOrder();
        } catch (error) {
            console.error("خطأ في إضافة طلب التوصيل:", error);
            showToast("حدث خطأ أثناء إضافة الطلب", "error");
        }
    };

    const resetNewOrder = () => {
        setNewOrder({
            customer_name: "",
            customer_phone: "",
            delivery_address: "",
            delivery_fee: 15,
            notes: "",
            items: [{ item_name: "", quantity: 1, unit_price: 0, notes: "" }],
        });
    };

    const updateOrderStatus = (id: string, status: string) => {
        try {
            setDeliveryOrders((prev) =>
                prev.map((order) => {
                    if (order.id === id) {
                        const updatedOrder: DeliveryOrder = {
                            ...order,
                            status: status as any,
                        };
                        if (status === "delivered") {
                            updatedOrder.delivery_time =
                                new Date().toLocaleTimeString("ar-SA", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });
                        }
                        return updatedOrder;
                    }
                    return order;
                })
            );

            const statusText = getStatusText(status);
            showToast(`تم تحديث حالة الطلب إلى: ${statusText}`, "success");
        } catch (error) {
            console.error("خطأ في تحديث حالة الطلب:", error);
            showToast("حدث خطأ أثناء تحديث حالة الطلب", "error");
        }
    };

    const handlePayment = () => {
        if (!selectedOrder) return;

        // التحقق من صحة البيانات
        if (paymentData.amount <= 0) {
            showToast("يرجى إدخال مبلغ الدفعة", "error");
            return;
        }

        const remainingAmount =
            selectedOrder.total_amount - selectedOrder.paid_amount;
        if (paymentData.amount > remainingAmount) {
            showToast(
                `المبلغ المدخل أكبر من المتبقي (${remainingAmount.toLocaleString()} ج.م)`,
                "error"
            );
            return;
        }

        try {
            const newPaidAmount =
                selectedOrder.paid_amount + paymentData.amount;
            const newPaymentStatus =
                newPaidAmount >= selectedOrder.total_amount
                    ? "paid"
                    : "partial";

            // تحديث الطلب
            setDeliveryOrders((prev) =>
                prev.map((order) => {
                    if (order.id === selectedOrder.id) {
                        return {
                            ...order,
                            paid_amount: newPaidAmount,
                            payment_status: newPaymentStatus,
                        };
                    }
                    return order;
                })
            );

            // إضافة سجل الدفعة إلى قائمة المدفوعات
            const newPayment: Payment = {
                id: `payment-${selectedOrder.id}-${Date.now()}`,
                delivery_order_id: selectedOrder.id,
                amount: paymentData.amount,
                payment_method: paymentData.payment_method as "cash" | "visa",
                payment_date: new Date().toISOString().split("T")[0],
                reference_number: paymentData.reference_number,
                notes: paymentData.notes,
            };

            // تحديث قائمة المدفوعات إذا كان المودال مفتوح
            setPayments((prev) => [newPayment, ...prev]);

            showToast(
                `تم تسجيل دفعة بقيمة ${paymentData.amount.toLocaleString()} ج.م بنجاح`,
                "success"
            );

            setShowPaymentModal(false);
            setSelectedOrder(null);
            resetPaymentData();
        } catch (error) {
            console.error("خطأ في تسجيل الدفعة:", error);
            showToast("حدث خطأ أثناء تسجيل الدفعة", "error");
        }
    };

    const resetPaymentData = () => {
        setPaymentData({
            amount: 0,
            payment_method: "cash",
            reference_number: "",
            notes: "",
        });
    };

    const addOrderItem = () => {
        setNewOrder((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { item_name: "", quantity: 1, unit_price: 0, notes: "" },
            ],
        }));
    };

    const removeOrderItem = (index: number) => {
        if (newOrder.items.length > 1) {
            setNewOrder((prev) => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
        }
    };

    const updateOrderItem = (index: number, field: string, value: any) => {
        setNewOrder((prev) => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "preparing":
                return "bg-blue-100 text-blue-800";
            case "out_for_delivery":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "في الانتظار";
            case "preparing":
                return "قيد التحضير";
            case "out_for_delivery":
                return "في الطريق";
            case "delivered":
                return "تم التسليم";
            case "cancelled":
                return "ملغى";
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-yellow-100 text-yellow-800";
            case "unpaid":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case "paid":
                return "مدفوع";
            case "partial":
                return "مدفوع جزئياً";
            case "unpaid":
                return "غير مدفوع";
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return "نقدي";
            case "visa":
                return "فيزا";
            case "mixed":
                return "مختلط";
            default:
                return method;
        }
    };

    // Initialize with mock data
    useEffect(() => {
        if (deliveryOrders.length === 0) {
            setDeliveryOrders(initialMockOrders);
        }
    }, []);

    const filteredOrders = deliveryOrders.filter((order) => {
        const matchesStatus = filter === "all" || order.status === filter;
        const matchesPayment =
            paymentFilter === "all" || order.payment_status === paymentFilter;
        const matchesDate =
            !dateFilter || order.order_date.includes(dateFilter);
        return matchesStatus && matchesPayment && matchesDate;
    });

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    أوامر التوصيل
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                    <i className="ri-add-line"></i>
                    إضافة طلب توصيل
                </button>
            </div>

            {/* إحصائيات أوامر التوصيل */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                إجمالي الطلبات
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {deliveryOrders.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-truck-line text-xl text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                في الانتظار
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    deliveryOrders.filter(
                                        (order) => order.status === "pending"
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-time-line text-xl text-yellow-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                في الطريق
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    deliveryOrders.filter(
                                        (order) =>
                                            order.status === "out_for_delivery"
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-road-map-line text-xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                تم التسليم
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    deliveryOrders.filter(
                                        (order) => order.status === "delivered"
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-check-line text-xl text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                                ملغى
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    deliveryOrders.filter(
                                        (order) => order.status === "cancelled"
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-close-line text-xl text-red-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* إحصائيات المبيعات والدفع */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            إجمالي المبيعات
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {deliveryOrders
                                .reduce(
                                    (total, order) =>
                                        total + order.total_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            المبالغ المحصلة
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                            {deliveryOrders
                                .reduce(
                                    (total, order) => total + order.paid_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            المبالغ المستحقة
                        </p>
                        <p className="text-2xl font-bold text-red-600">
                            {deliveryOrders
                                .reduce(
                                    (total, order) =>
                                        total +
                                        (order.total_amount -
                                            order.paid_amount),
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            رسوم التوصيل
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                            {deliveryOrders
                                .reduce(
                                    (total, order) =>
                                        total + order.delivery_fee,
                                    0
                                )
                                .toLocaleString()}{" "}
                            ج.م
                        </p>
                    </div>
                </div>
            </div>

            {/* فلاتر */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            حالة الطلب
                        </label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "جميع الطلبات" },
                                { value: "pending", label: "في الانتظار" },
                                { value: "preparing", label: "قيد التحضير" },
                                {
                                    value: "out_for_delivery",
                                    label: "في الطريق",
                                },
                                { value: "delivered", label: "تم التسليم" },
                                { value: "cancelled", label: "ملغى" },
                            ]}
                            value={filter}
                            onChange={(value) => setFilter(value)}
                            placeholder="اختر حالة الطلب"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            حالة الدفع
                        </label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "جميع حالات الدفع" },
                                { value: "paid", label: "مدفوع" },
                                { value: "partial", label: "مدفوع جزئياً" },
                                { value: "unpaid", label: "غير مدفوع" },
                            ]}
                            value={paymentFilter}
                            onChange={(value) => setPaymentFilter(value)}
                            placeholder="اختر حالة الدفع"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            التاريخ
                        </label>
                        <CustomDatePicker
                            value={
                                dateFilter ||
                                new Date().toISOString().split("T")[0]
                            }
                            onChange={(date) => setDateFilter(date)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* جدول أوامر التوصيل */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-hidden w-full">
                    <table className="w-full divide-y divide-gray-200">
                        <colgroup>
                            <col className="w-[8%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[15%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[9%]" />
                            <col className="w-[10%]" />
                            <col className="w-[9%]" />
                            <col className="w-[11%]" />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    رقم الطلب
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    العميل
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الهاتف
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    العنوان
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الإجمالي
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    المدفوع
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    طريقة الدفع
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    حالة الطلب
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    حالة الدفع
                                </th>
                                <th className="px-2 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-2 py-4 text-sm font-semibold text-gray-900 truncate">
                                        {order.order_number}
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-900 truncate">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-600 truncate">
                                        {order.customer_phone}
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-600 truncate">
                                        {order.delivery_address}
                                    </td>
                                    <td className="px-2 py-4 text-sm font-semibold text-gray-900 truncate">
                                        {order.total_amount.toLocaleString()}{" "}
                                        ج.م
                                    </td>
                                    <td className="px-2 py-4 text-sm font-medium text-green-600 truncate">
                                        {order.paid_amount.toLocaleString()} ج.م
                                    </td>
                                    <td className="px-2 py-4 text-sm text-gray-600 truncate">
                                        {getPaymentMethodText(
                                            order.payment_method
                                        )}
                                    </td>
                                    <td className="px-2 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                                order.payment_status
                                            )}`}
                                        >
                                            {getPaymentStatusText(
                                                order.payment_status
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-2 py-4 text-sm font-medium">
                                        <div className="flex gap-1 justify-end flex-wrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    fetchOrderItems(order.id);
                                                    setShowItemsModal(true);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="عرض التفاصيل"
                                            >
                                                <i className="ri-eye-line text-lg"></i>
                                            </button>
                                            {order.payment_status !==
                                                "paid" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setPaymentData(
                                                            (prev) => ({
                                                                ...prev,
                                                                amount:
                                                                    order.total_amount -
                                                                    order.paid_amount,
                                                            })
                                                        );
                                                        setShowPaymentModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تسجيل دفعة"
                                                >
                                                    <i className="ri-money-dollar-circle-line text-lg"></i>
                                                </button>
                                            )}
                                            {order.paid_amount > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        fetchPaymentHistory(
                                                            order.id
                                                        );
                                                        setShowPaymentHistoryModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تاريخ المدفوعات"
                                                >
                                                    <i className="ri-history-line text-lg"></i>
                                                </button>
                                            )}
                                            {order.status === "pending" && (
                                                <button
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            "preparing"
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="بدء التحضير"
                                                >
                                                    <i className="ri-restaurant-line text-lg"></i>
                                                </button>
                                            )}
                                            {order.status === "preparing" && (
                                                <button
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            "out_for_delivery"
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="إرسال للتوصيل"
                                                >
                                                    <i className="ri-truck-line text-lg"></i>
                                                </button>
                                            )}
                                            {order.status ===
                                                "out_for_delivery" && (
                                                <button
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            "delivered"
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تأكيد التسليم"
                                                >
                                                    <i className="ri-check-line text-lg"></i>
                                                </button>
                                            )}
                                            {(order.status === "pending" ||
                                                order.status ===
                                                    "preparing") && (
                                                <button
                                                    onClick={() => {
                                                        setOrderToCancel(order);
                                                        setShowCancelConfirmModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="إلغاء الطلب"
                                                >
                                                    <i className="ri-close-line text-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* مودال إضافة طلب توصيل */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                إضافة طلب توصيل جديد
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        اسم العميل
                                    </label>
                                    <input
                                        type="text"
                                        value={newOrder.customer_name}
                                        onChange={(e) =>
                                            setNewOrder((prev) => ({
                                                ...prev,
                                                customer_name: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="أدخل اسم العميل"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={newOrder.customer_phone}
                                        onChange={(e) =>
                                            setNewOrder((prev) => ({
                                                ...prev,
                                                customer_phone: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="01xxxxxxxxx"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    عنوان التوصيل
                                </label>
                                <textarea
                                    value={newOrder.delivery_address}
                                    onChange={(e) =>
                                        setNewOrder((prev) => ({
                                            ...prev,
                                            delivery_address: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows={2}
                                    placeholder="أدخل العنوان التفصيلي للتوصيل"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رسوم التوصيل
                                    </label>
                                    <input
                                        type="number"
                                        value={newOrder.delivery_fee}
                                        onChange={(e) =>
                                            setNewOrder((prev) => ({
                                                ...prev,
                                                delivery_fee:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ملاحظات
                                    </label>
                                    <input
                                        type="text"
                                        value={newOrder.notes}
                                        onChange={(e) =>
                                            setNewOrder((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="ملاحظات إضافية"
                                    />
                                </div>
                            </div>

                            {/* عناصر الطلب */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-md font-medium">
                                        عناصر الطلب
                                    </h4>
                                    <button
                                        onClick={addOrderItem}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap cursor-pointer"
                                    >
                                        <i className="ri-add-line"></i> إضافة
                                        عنصر
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {newOrder.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg"
                                        >
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="اسم الصنف"
                                                    value={item.item_name}
                                                    onChange={(e) =>
                                                        updateOrderItem(
                                                            index,
                                                            "item_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="الكمية"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateOrderItem(
                                                            index,
                                                            "quantity",
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="السعر"
                                                    value={item.unit_price}
                                                    onChange={(e) =>
                                                        updateOrderItem(
                                                            index,
                                                            "unit_price",
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="ملاحظات"
                                                    value={item.notes}
                                                    onChange={(e) =>
                                                        updateOrderItem(
                                                            index,
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    {(
                                                        item.quantity *
                                                        item.unit_price
                                                    ).toFixed(2)}{" "}
                                                    ج.م
                                                </span>
                                                {newOrder.items.length > 1 && (
                                                    <button
                                                        onClick={() =>
                                                            removeOrderItem(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* إجمالي الطلب */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span>المجموع الفرعي:</span>
                                        <span>
                                            {newOrder.items
                                                .reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.quantity *
                                                            item.unit_price,
                                                    0
                                                )
                                                .toFixed(2)}{" "}
                                            ج.م
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>رسوم التوصيل:</span>
                                        <span>
                                            {newOrder.delivery_fee.toFixed(2)}{" "}
                                            ج.م
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                        <span>الإجمالي:</span>
                                        <span>
                                            {(
                                                newOrder.items.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.quantity *
                                                            item.unit_price,
                                                    0
                                                ) + newOrder.delivery_fee
                                            ).toFixed(2)}{" "}
                                            ج.م
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddOrder}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                                >
                                    إضافة الطلب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال عرض تفاصيل الطلب */}
            {showItemsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                تفاصيل الطلب - {selectedOrder.order_number}
                            </h3>
                            <button
                                onClick={() => setShowItemsModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* معلومات العميل */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">
                                    معلومات العميل
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">
                                            الاسم:
                                        </span>{" "}
                                        {selectedOrder.customer_name}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            الهاتف:
                                        </span>{" "}
                                        {selectedOrder.customer_phone}
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className="font-medium">
                                            العنوان:
                                        </span>{" "}
                                        {selectedOrder.delivery_address}
                                    </div>
                                    {selectedOrder.notes && (
                                        <div className="md:col-span-2">
                                            <span className="font-medium">
                                                ملاحظات:
                                            </span>{" "}
                                            {selectedOrder.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* عناصر الطلب */}
                            <div className="overflow-hidden">
                                <table className="w-full divide-y divide-gray-200 table-fixed">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                                                الصنف
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                                الكمية
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                                السعر
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                                الإجمالي
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                                                ملاحظات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {item.item_name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {item.unit_price} ج.م
                                                </td>
                                                <td className="px-3 py-4 text-sm font-medium text-gray-900 truncate">
                                                    {item.total_price} ج.م
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500 truncate">
                                                    {item.notes || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ملخص الطلب */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>المجموع الفرعي:</span>
                                    <span>
                                        {(
                                            selectedOrder.total_amount -
                                            selectedOrder.delivery_fee
                                        ).toLocaleString()}{" "}
                                        ج.م
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>رسوم التوصيل:</span>
                                    <span>
                                        {selectedOrder.delivery_fee.toLocaleString()}{" "}
                                        ج.م
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>الإجمالي:</span>
                                    <span>
                                        {selectedOrder.total_amount.toLocaleString()}{" "}
                                        ج.م
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 mt-2">
                                    <span>المبلغ المدفوع:</span>
                                    <span>
                                        {selectedOrder.paid_amount.toLocaleString()}{" "}
                                        ج.م
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>المبلغ المتبقي:</span>
                                    <span>
                                        {(
                                            selectedOrder.total_amount -
                                            selectedOrder.paid_amount
                                        ).toLocaleString()}{" "}
                                        ج.م
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تسجيل الدفع */}
            {showPaymentModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                تسجيل دفعة
                            </h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    طلب رقم: {selectedOrder.order_number}
                                </p>
                                <p className="text-sm text-gray-600">
                                    العميل: {selectedOrder.customer_name}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    الإجمالي:{" "}
                                    {selectedOrder.total_amount.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-sm text-green-600">
                                    المدفوع:{" "}
                                    {selectedOrder.paid_amount.toLocaleString()}{" "}
                                    ج.م
                                </p>
                                <p className="text-sm text-red-600 font-medium">
                                    المتبقي:{" "}
                                    {(
                                        selectedOrder.total_amount -
                                        selectedOrder.paid_amount
                                    ).toLocaleString()}{" "}
                                    ج.م
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    مبلغ الدفعة
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            amount:
                                                parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    min="0"
                                    max={
                                        selectedOrder.total_amount -
                                        selectedOrder.paid_amount
                                    }
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    طريقة الدفع
                                </label>
                                <select
                                    value={paymentData.payment_method}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            payment_method: e.target.value as
                                                | "cash"
                                                | "visa",
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                                >
                                    <option value="cash">نقدي</option>
                                    <option value="visa">فيزا</option>
                                </select>
                            </div>

                            {paymentData.payment_method === "visa" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        رقم المرجع
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.reference_number}
                                        onChange={(e) =>
                                            setPaymentData((prev) => ({
                                                ...prev,
                                                reference_number:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="رقم العملية البنكية"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={paymentData.notes}
                                    onChange={(e) =>
                                        setPaymentData((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap cursor-pointer"
                                >
                                    تسجيل الدفعة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تاريخ المدفوعات */}
            {showPaymentHistoryModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                تاريخ المدفوعات - {selectedOrder.order_number}
                            </h3>
                            <button
                                onClick={() =>
                                    setShowPaymentHistoryModal(false)
                                }
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            إجمالي الطلب
                                        </p>
                                        <p className="text-lg font-bold">
                                            {selectedOrder.total_amount.toFixed(
                                                2
                                            )}{" "}
                                            ج.م
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            المبلغ المدفوع
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {selectedOrder.paid_amount.toFixed(
                                                2
                                            )}{" "}
                                            ج.م
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            المبلغ المتبقي
                                        </p>
                                        <p className="text-lg font-bold text-red-600">
                                            {(
                                                selectedOrder.total_amount -
                                                selectedOrder.paid_amount
                                            ).toFixed(2)}{" "}
                                            ج.م
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden">
                                <table className="w-full divide-y divide-gray-200 table-fixed">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                                تاريخ الدفع
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                                المبلغ
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                                طريقة الدفع
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                                رقم المرجع
                                            </th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                                                ملاحظات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {new Date(
                                                        payment.payment_date
                                                    ).toLocaleDateString(
                                                        "ar-SA"
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {payment.amount.toFixed(2)}{" "}
                                                    ج.م
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {getPaymentMethodText(
                                                        payment.payment_method
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {payment.reference_number ||
                                                        "-"}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 truncate">
                                                    {payment.notes || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تأكيد إلغاء الطلب */}
            {showCancelConfirmModal && orderToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="ri-error-warning-line text-3xl text-red-500"></i>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            تأكيد إلغاء الطلب
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            هل أنت متأكد من إلغاء الطلب رقم{" "}
                            <span className="font-semibold">
                                {orderToCancel.order_number}
                            </span>
                            ؟
                        </p>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            لا يمكن التراجع عن هذه العملية.
                        </p>
                        <div className="flex justify-start gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCancelConfirmModal(false);
                                    setOrderToCancel(null);
                                }}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (orderToCancel) {
                                        updateOrderStatus(
                                            orderToCancel.id,
                                            "cancelled"
                                        );
                                        setShowCancelConfirmModal(false);
                                        setOrderToCancel(null);
                                    }
                                }}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                            >
                                تأكيد الإلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
