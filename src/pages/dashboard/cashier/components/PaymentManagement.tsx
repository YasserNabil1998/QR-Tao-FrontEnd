import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";
import Loader from "../../../../components/common/Loader";

interface PaymentManagementProps {
    restaurantId: string;
}

interface Payment {
    id: string;
    order_id: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_id?: string;
    created_at: string;
    customer_name?: string;
    customer_phone?: string;
    notes?: string;
    orders?: {
        id: string;
        total_amount: number;
        tables?: {
            table_number: string;
        };
        customer_name?: string;
        customer_phone?: string;
        notes?: string;
    };
}

interface Order {
    id: string;
    table: string;
    customer: string;
    total: number;
    paymentStatus: string;
}

// بيانات محاكاة للطلبات (يجب أن تكون متطابقة مع OrdersList)
const mockOrders: Order[] = [
    {
        id: "#1234",
        table: "طاولة 5",
        customer: "أحمد محمد",
        total: 136.0,
        paymentStatus: "غير مدفوع",
    },
    {
        id: "#1235",
        table: "طاولة 12",
        customer: "فاطمة أحمد",
        total: 47.0,
        paymentStatus: "غير مدفوع",
    },
    {
        id: "#1236",
        table: "طاولة 3",
        customer: "محمد علي",
        total: 63.0,
        paymentStatus: "غير مدفوع",
    },
    {
        id: "#1237",
        table: "طاولة 8",
        customer: "سارة خالد",
        total: 128.0,
        paymentStatus: "غير مدفوع",
    },
    {
        id: "#1238",
        table: "طاولة 15",
        customer: "عبدالله سعد",
        total: 80.0,
        paymentStatus: "غير مدفوع",
    },
];

// بيانات محاكاة للمدفوعات
const generateMockPayments = (filter: string): Payment[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const allPayments: Payment[] = [
        {
            id: "pay-001",
            order_id: "#1234",
            amount: 125.5,
            payment_method: "cash",
            payment_status: "completed",
            transaction_id: "TXN-001",
            created_at: new Date(
                now.getTime() - 2 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1234",
                total_amount: 125.5,
                tables: { table_number: "5" },
            customer_name: "أحمد محمد",
            },
        },
        {
            id: "pay-002",
            order_id: "#1235",
            amount: 89.75,
            payment_method: "card",
            payment_status: "completed",
            transaction_id: "TXN-002",
            created_at: new Date(
                now.getTime() - 3 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1235",
                total_amount: 89.75,
                tables: { table_number: "12" },
            customer_name: "فاطمة علي",
            },
        },
        {
            id: "pay-003",
            order_id: "#1236",
            amount: 67.25,
            payment_method: "digital",
            payment_status: "pending",
            transaction_id: "TXN-003",
            created_at: new Date(
                now.getTime() - 4 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1236",
                total_amount: 67.25,
                tables: { table_number: "3" },
            customer_name: "محمد حسن",
            },
        },
        {
            id: "pay-004",
            order_id: "#1237",
            amount: 150.0,
            payment_method: "cash",
            payment_status: "completed",
            transaction_id: "TXN-004",
            created_at: new Date(
                now.getTime() - 5 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1237",
                total_amount: 150.0,
                tables: { table_number: "8" },
                customer_name: "سارة أحمد",
            },
        },
        {
            id: "pay-005",
            order_id: "#1238",
            amount: 200.5,
            payment_method: "visa",
            payment_status: "completed",
            transaction_id: "TXN-005",
            created_at: new Date(
                now.getTime() - 6 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1238",
                total_amount: 200.5,
                tables: { table_number: "15" },
                customer_name: "خالد علي",
            },
        },
        {
            id: "pay-006",
            order_id: "#1239",
            amount: 95.25,
            payment_method: "cash",
            payment_status: "failed",
            transaction_id: "TXN-006",
            created_at: new Date(
                now.getTime() - 7 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1239",
                total_amount: 95.25,
                tables: { table_number: "7" },
                customer_name: "نورا سعد",
            },
        },
        {
            id: "pay-007",
            order_id: "#1240",
            amount: 180.0,
            payment_method: "card",
            payment_status: "completed",
            transaction_id: "TXN-007",
            created_at: new Date(
                now.getTime() - 8 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1240",
                total_amount: 180.0,
                tables: { table_number: "10" },
                customer_name: "يوسف محمود",
            },
        },
        {
            id: "pay-008",
            order_id: "#1241",
            amount: 75.5,
            payment_method: "digital",
            payment_status: "completed",
            transaction_id: "TXN-008",
            created_at: new Date(
                now.getTime() - 9 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1241",
                total_amount: 75.5,
                tables: { table_number: "2" },
                customer_name: "ليلى كريم",
            },
        },
        {
            id: "pay-009",
            order_id: "#1242",
            amount: 220.0,
            payment_method: "cash",
            payment_status: "completed",
            transaction_id: "TXN-009",
            created_at: new Date(
                weekAgo.getTime() + 2 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1242",
                total_amount: 220.0,
                tables: { table_number: "20" },
                customer_name: "عمر خالد",
            },
        },
        {
            id: "pay-010",
            order_id: "#1243",
            amount: 135.75,
            payment_method: "visa",
            payment_status: "completed",
            transaction_id: "TXN-010",
            created_at: new Date(
                weekAgo.getTime() + 3 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1243",
                total_amount: 135.75,
                tables: { table_number: "14" },
                customer_name: "ريم فؤاد",
            },
        },
        {
            id: "pay-011",
            order_id: "#1244",
            amount: 300.0,
            payment_method: "card",
            payment_status: "completed",
            transaction_id: "TXN-011",
            created_at: new Date(
                monthAgo.getTime() + 5 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1244",
                total_amount: 300.0,
                tables: { table_number: "25" },
                customer_name: "طارق إبراهيم",
            },
        },
        {
            id: "pay-012",
            order_id: "#1245",
            amount: 110.25,
            payment_method: "cash",
            payment_status: "cancelled",
            transaction_id: "TXN-012",
            created_at: new Date(
                monthAgo.getTime() + 6 * 60 * 60 * 1000
            ).toISOString(),
            orders: {
                id: "#1245",
                total_amount: 110.25,
                tables: { table_number: "6" },
                customer_name: "هند محمد",
            },
        },
    ];

    return allPayments.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        if (filter === "today") {
            return paymentDate >= today;
        } else if (filter === "week") {
            return paymentDate >= weekAgo;
        } else if (filter === "month") {
            return paymentDate >= monthAgo;
        }
        return true;
    });
};

const PaymentManagement = ({ restaurantId }: PaymentManagementProps) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [addedPayments, setAddedPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("today");
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { showToast, ToastContainer } = useToast();

    const [newPayment, setNewPayment] = useState({
        order_id: "",
        amount: "",
        payment_method: "cash",
        payment_status: "completed",
        transaction_id: "",
        customer_name: "",
        customer_phone: "",
        notes: "",
        payment_date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        fetchPayments();
    }, [restaurantId, filter]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockData = generateMockPayments(filter);
            const allPayments = [...addedPayments, ...mockData];

            allPayments.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );
            setPayments(allPayments);
        } catch (error) {
            console.error("Error fetching payments:", error);
            showToast("حدث خطأ أثناء جلب المدفوعات", "error");
        } finally {
            setLoading(false);
        }
    };

    const getTotalAmount = () => {
        return filteredPayments.reduce(
            (total, payment) => total + (payment.amount || 0),
            0
        );
    };

    const getCompletedPaymentsCount = () => {
        return filteredPayments.filter((p) => p.payment_status === "completed")
            .length;
    };

    const getCompletedPaymentsAmount = () => {
        return filteredPayments
            .filter((p) => p.payment_status === "completed")
            .reduce((total, payment) => total + (payment.amount || 0), 0);
    };

    const getAverageTransaction = () => {
        const completed = filteredPayments.filter(
            (p) => p.payment_status === "completed"
        );
        if (completed.length === 0) return 0;
        return getCompletedPaymentsAmount() / completed.length;
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return "نقدي";
            case "card":
            case "visa":
                return "بطاقة";
            case "digital":
                return "محفظة رقمية";
            default:
                return method || "غير محدد";
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
            case "cancelled":
                return "bg-gray-100 text-gray-800";
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
            case "cancelled":
                return "ملغي";
            default:
                return status || "غير محدد";
        }
    };

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            searchTerm === "" ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transaction_id
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.orders?.id
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.orders?.tables?.table_number
                ?.toString()
                .includes(searchTerm) ||
            payment.orders?.customer_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesPaymentMethod =
            paymentMethodFilter === "all" ||
            payment.payment_method === paymentMethodFilter;

        const matchesStatus =
            statusFilter === "all" || payment.payment_status === statusFilter;

        const matchesDate =
            !dateFilter ||
            (() => {
                // تحويل payment.created_at إلى التاريخ المحلي
                const paymentDate = new Date(payment.created_at);
                // استخدام التاريخ المحلي بدون تحويل timezone
                const paymentDateStr = `${paymentDate.getFullYear()}-${String(
                    paymentDate.getMonth() + 1
                ).padStart(2, "0")}-${String(paymentDate.getDate()).padStart(
                    2,
                    "0"
                )}`;

                // استخدام dateFilter مباشرة (هو بالفعل بصيغة YYYY-MM-DD)
                return paymentDateStr === dateFilter;
            })();

        return (
            matchesSearch &&
            matchesPaymentMethod &&
            matchesStatus &&
            matchesDate
        );
    });

    const handleRefresh = () => {
        fetchPayments();
        showToast("تم تحديث قائمة المدفوعات", "success");
    };

    const handleViewDetails = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDetailsModal(true);
    };

    const handleEdit = (payment: Payment) => {
        setSelectedPayment(payment);
        // استخراج التاريخ المحلي من created_at
        let paymentDate = new Date().toISOString().split("T")[0];
        if (payment.created_at) {
            const date = new Date(payment.created_at);
            paymentDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        }
        setNewPayment({
            order_id: payment.order_id,
            amount: payment.amount.toString(),
            payment_method: payment.payment_method,
            payment_status: payment.payment_status,
            transaction_id: payment.transaction_id || "",
            customer_name:
                payment.customer_name || payment.orders?.customer_name || "",
            customer_phone:
                payment.customer_phone || payment.orders?.customer_phone || "",
            notes: payment.notes || payment.orders?.notes || "",
            payment_date: paymentDate,
        });
        setShowEditModal(true);
    };

    const handleDelete = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (selectedPayment) {
            setPayments((prev) =>
                prev.filter((p) => p.id !== selectedPayment.id)
            );
            setAddedPayments((prev) =>
                prev.filter((p) => p.id !== selectedPayment.id)
            );
            showToast("تم حذف المدفوعة بنجاح", "success");
            setShowDeleteConfirm(false);
            setSelectedPayment(null);
        }
    };

    const handlePrintReceipt = (payment?: Payment) => {
        const paymentToPrint = payment || selectedPayment;
        if (paymentToPrint) {
            const printWindow = window.open("", "_blank");
            if (printWindow) {
                printWindow.document.write(`
                    <html dir="rtl">
                        <head>
                            <title>إيصال دفع</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                .header { text-align: center; margin-bottom: 30px; }
                                .details { margin: 20px 0; }
                                .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
                                .total { font-size: 1.5em; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h1>إيصال دفع</h1>
            </div>
                            <div class="details">
                                <div class="detail-row">
                                    <span>رقم المعاملة:</span>
                                    <span>#${paymentToPrint.id.slice(-8)}</span>
                                </div>
                                <div class="detail-row">
                                    <span>رقم الطلب:</span>
                                    <span>${
                                        paymentToPrint.orders?.id || "غير محدد"
                                    }</span>
                                </div>
                                <div class="detail-row">
                                    <span>الطاولة:</span>
                                    <span>${
                                        paymentToPrint.orders?.tables
                                            ?.table_number || "غير محدد"
                                    }</span>
                                </div>
                                <div class="detail-row">
                                    <span>المبلغ:</span>
                                    <span>${paymentToPrint.amount.toFixed(
                                        2
                                    )} $</span>
                                </div>
                                <div class="detail-row">
                                    <span>طريقة الدفع:</span>
                                    <span>${getPaymentMethodText(
                                        paymentToPrint.payment_method
                                    )}</span>
                                </div>
                                <div class="detail-row">
                                    <span>الحالة:</span>
                                    <span>${getPaymentStatusText(
                                        paymentToPrint.payment_status
                                    )}</span>
                                </div>
                                <div class="detail-row">
                                    <span>التاريخ:</span>
                                    <span>${new Date(
                                        paymentToPrint.created_at
                                    ).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}</span>
                                </div>
                            </div>
                            <div class="total">
                                <div class="detail-row">
                                    <span>الإجمالي:</span>
                                    <span>${paymentToPrint.amount.toFixed(
                                        2
                                    )} $</span>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                setTimeout(() => {
                    printWindow.print();
                }, 250);
            }
            showToast("جاري طباعة الإيصال...", "info");
        }
    };

    const handleExportToCSV = () => {
        const csvContent = [
            [
                "رقم المعاملة",
                "رقم الطلب",
                "الطاولة",
                "المبلغ",
                "طريقة الدفع",
                "الحالة",
                "التاريخ",
            ],
            ...filteredPayments.map((payment) => [
                payment.id.slice(-8),
                payment.orders?.id || "غير محدد",
                payment.orders?.tables?.table_number || "غير محدد",
                payment.amount.toFixed(2),
                getPaymentMethodText(payment.payment_method),
                getPaymentStatusText(payment.payment_status),
                new Date(payment.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }),
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `المدفوعات_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("تم تصدير البيانات بنجاح", "success");
    };

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

    const getAvailableOrders = () => {
        return mockOrders.filter(
            (order) =>
                order.paymentStatus === "غير مدفوع" ||
                order.paymentStatus === "في انتظار الدفع"
        );
    };

    const handleOrderSelect = (orderId: string) => {
        const selectedOrder = mockOrders.find((o) => o.id === orderId);
        if (selectedOrder) {
            setNewPayment({
                ...newPayment,
                order_id: selectedOrder.id,
                amount: selectedOrder.total.toString(),
                customer_name: selectedOrder.customer,
            });
        }
    };

    const handleAddPayment = () => {
        if (!newPayment.order_id.trim()) {
            showToast("يرجى اختيار الطلب", "error");
            return;
        }
        if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
            showToast("يرجى إدخال مبلغ صحيح", "error");
            return;
        }

        const selectedOrder = mockOrders.find(
            (o) => o.id === newPayment.order_id
        );
        if (!selectedOrder) {
            showToast("الطلب المحدد غير موجود", "error");
            return;
        }

        // استخدام تاريخ الدفع المحدد أو التاريخ الحالي
        // إنشاء التاريخ المحلي من YYYY-MM-DD بدون مشاكل timezone
        let paymentDate: Date;
        if (newPayment.payment_date) {
            const [year, month, day] = newPayment.payment_date
                .split("-")
                .map(Number);
            const now = new Date();
            paymentDate = new Date(
                year,
                month - 1,
                day,
                now.getHours(),
                now.getMinutes(),
                now.getSeconds()
            );
        } else {
            paymentDate = new Date();
        }

        const payment: Payment = {
            id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            order_id: newPayment.order_id,
            amount: parseFloat(newPayment.amount),
            payment_method: newPayment.payment_method,
            payment_status: newPayment.payment_status,
            transaction_id: newPayment.transaction_id || `TXN-${Date.now()}`,
            created_at: paymentDate.toISOString(),
            customer_name: newPayment.customer_name || selectedOrder.customer,
            customer_phone: newPayment.customer_phone || "",
            notes: newPayment.notes || "",
            orders: {
                id: selectedOrder.id,
                total_amount: parseFloat(newPayment.amount),
                tables: {
                    table_number: selectedOrder.table.replace("طاولة ", ""),
                },
                customer_name:
                    newPayment.customer_name || selectedOrder.customer,
                customer_phone: newPayment.customer_phone || "",
                notes: newPayment.notes || "",
            },
        };

        setAddedPayments((prev) => [payment, ...prev]);
        setPayments((prev) => [payment, ...prev]);
        showToast("تم إضافة المدفوعة بنجاح", "success");

        resetNewPayment();
        setShowAddModal(false);
    };

    const handleUpdatePayment = () => {
        if (!selectedPayment) return;
        if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
            showToast("يرجى إدخال مبلغ صحيح", "error");
            return;
        }

        // إنشاء التاريخ المحلي من YYYY-MM-DD بدون مشاكل timezone
        let updatedPaymentDate: Date;
        if (newPayment.payment_date) {
            const [year, month, day] = newPayment.payment_date
                .split("-")
                .map(Number);
            const originalDate = new Date(selectedPayment.created_at);
            updatedPaymentDate = new Date(
                year,
                month - 1,
                day,
                originalDate.getHours(),
                originalDate.getMinutes(),
                originalDate.getSeconds()
            );
        } else {
            updatedPaymentDate = new Date(selectedPayment.created_at);
        }

        const updatedPayment: Payment = {
            ...selectedPayment,
            amount: parseFloat(newPayment.amount),
            payment_method: newPayment.payment_method,
            payment_status: newPayment.payment_status,
            transaction_id:
                newPayment.transaction_id || selectedPayment.transaction_id,
            customer_name:
                newPayment.customer_name || selectedPayment.customer_name,
            customer_phone:
                newPayment.customer_phone || selectedPayment.customer_phone,
            notes: newPayment.notes || selectedPayment.notes,
            created_at: updatedPaymentDate.toISOString(),
            orders: selectedPayment.orders
                ? {
                      id: selectedPayment.orders.id,
                      total_amount: selectedPayment.orders.total_amount,
                      tables: selectedPayment.orders.tables,
                      customer_name:
                          newPayment.customer_name ||
                          selectedPayment.orders.customer_name,
                      customer_phone:
                          newPayment.customer_phone ||
                          selectedPayment.orders.customer_phone,
                      notes: newPayment.notes || selectedPayment.orders.notes,
                  }
                : undefined,
        };

        setPayments((prev) =>
            prev.map((p) => (p.id === selectedPayment.id ? updatedPayment : p))
        );
        setAddedPayments((prev) =>
            prev.map((p) => (p.id === selectedPayment.id ? updatedPayment : p))
        );
        showToast("تم تحديث المدفوعة بنجاح", "success");

        resetNewPayment();
        setShowEditModal(false);
        setSelectedPayment(null);
    };

    const resetNewPayment = () => {
        setNewPayment({
            order_id: "",
            amount: "",
            payment_method: "cash",
            payment_status: "completed",
            transaction_id: "",
            customer_name: "",
            customer_phone: "",
            notes: "",
            payment_date: new Date().toISOString().split("T")[0],
        });
    };

    if (loading) {
    return (
            <Loader
                size="lg"
                variant="spinner"
                text="جاري تحميل المدفوعات..."
            />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة المدفوعات
                </h2>
                        <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors"
                >
                    <i className="ri-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة مدفوعة</span>
                        </button>
            </div>

            {/* إحصائيات المدفوعات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 md:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-money-dollar-circle-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg text-green-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm font-medium text-gray-600 mb-1 line-clamp-2 leading-tight font-tajawal">
                                إجمالي المدفوعات
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {getTotalAmount().toFixed(2)} $
                            </p>
                    </div>
                </div>
                        </div>

                <div className="bg-white p-4 sm:p-5 md:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-check-double-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg text-blue-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm font-medium text-gray-600 mb-1 line-clamp-2 leading-tight font-tajawal">
                                المعاملات المكتملة
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {getCompletedPaymentsCount()}
                            </p>
                            <p className="text-xs md:text-xs text-gray-500 mt-1">
                                {getCompletedPaymentsAmount().toFixed(2)} $
                            </p>
                    </div>
                </div>
                        </div>

                <div className="bg-white p-4 sm:p-5 md:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-calculator-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg text-purple-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm font-medium text-gray-600 mb-1 line-clamp-2 leading-tight font-tajawal">
                                متوسط المعاملة
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {getAverageTransaction().toFixed(2)} $
                            </p>
                    </div>
                </div>
            </div>

                <div className="bg-white p-4 sm:p-5 md:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-file-list-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg text-orange-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm font-medium text-gray-600 mb-1 line-clamp-2 leading-tight font-tajawal">
                                إجمالي المعاملات
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {filteredPayments.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر */}
            <div className="bg-white p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row md:flex-wrap lg:flex-wrap gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1 md:w-full md:max-w-full lg:flex-none lg:w-64">
                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            البحث
                        </label>
                        <div className="relative">
                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg md:text-lg lg:text-base"></i>
                            <input
                                type="text"
                                placeholder="البحث في المدفوعات..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 sm:py-2.5 md:py-2.5 lg:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-48 md:w-[calc(50%-0.5rem)] lg:w-44">
                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            الفترة الزمنية
                        </label>
                        <CustomSelect
                            options={[
                                { value: "today", label: "اليوم" },
                                { value: "week", label: "هذا الأسبوع" },
                                { value: "month", label: "هذا الشهر" },
                                { value: "all", label: "الكل" },
                            ]}
                            value={filter}
                            onChange={(value) => setFilter(value)}
                            placeholder="اختر الفترة"
                        />
                    </div>
                    <div className="w-full sm:w-48 md:w-[calc(50%-0.5rem)] lg:w-44">
                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            طريقة الدفع
                        </label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "جميع طرق الدفع" },
                                { value: "cash", label: "نقدي" },
                                { value: "card", label: "بطاقة" },
                                { value: "visa", label: "بطاقة ائتمان" },
                                { value: "digital", label: "محفظة رقمية" },
                            ]}
                            value={paymentMethodFilter}
                            onChange={(value) => setPaymentMethodFilter(value)}
                            placeholder="اختر طريقة الدفع"
                        />
                    </div>
                    <div className="w-full sm:w-48 md:w-[calc(50%-0.5rem)] lg:w-44">
                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            الحالة
                        </label>
                        <CustomSelect
                            options={[
                                { value: "all", label: "جميع الحالات" },
                                { value: "completed", label: "مكتمل" },
                                { value: "pending", label: "في الانتظار" },
                                { value: "failed", label: "فشل" },
                                { value: "cancelled", label: "ملغي" },
                            ]}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            placeholder="اختر الحالة"
                        />
                    </div>
                    <div className="w-full sm:w-48 md:w-[calc(50%-0.5rem)] lg:w-44 relative">
                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
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
                    <div className="flex gap-2 items-end md:w-full md:justify-end lg:w-auto">
                        <button
                            onClick={handleRefresh}
                            className="px-3 sm:px-4 md:px-4 lg:px-3 xl:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            title="تحديث"
                        >
                            <i className="ri-refresh-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg"></i>
                        </button>
                        <button
                            onClick={handleExportToCSV}
                            className="px-3 sm:px-4 md:px-4 lg:px-3 xl:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            title="تصدير"
                        >
                            <i className="ri-download-line text-base sm:text-lg md:text-lg lg:text-base xl:text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* جدول المدفوعات */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    رقم المعاملة
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    رقم الطلب
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الطاولة
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    المبلغ
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    طريقة الدفع
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    التاريخ
                                </th>
                                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-semibold text-gray-900 truncate">
                                        #{payment.id.slice(-8)}
                                    </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-900 truncate">
                                            {payment.orders?.id || "غير محدد"}
                                    </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-600 truncate">
                                            {payment.orders?.tables?.table_number
                                                ? `طاولة ${payment.orders.tables.table_number}`
                                                : "غير محدد"}
                                    </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-semibold text-gray-900 truncate">
                                            {payment.amount.toFixed(2)} $
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-600 truncate">
                                            {getPaymentMethodText(payment.payment_method)}
                                    </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4">
                                        <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                                payment.payment_status
                                            )}`}
                                        >
                                                {getPaymentStatusText(payment.payment_status)}
                                        </span>
                                    </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm text-gray-600 truncate">
                                            {formatDate(payment.created_at)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium">
                                            <div className="flex gap-1 justify-end flex-wrap">
                                                <button
                                                    onClick={() => handleViewDetails(payment)}
                                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="عرض التفاصيل"
                                                >
                                                    <i className="ri-eye-line text-base sm:text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handlePrintReceipt(payment)}
                                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="طباعة الإيصال"
                                                >
                                                    <i className="ri-printer-line text-base sm:text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(payment)}
                                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تعديل"
                                                >
                                                    <i className="ri-edit-line text-base sm:text-lg"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(payment)}
                                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="حذف"
                                                >
                                                    <i className="ri-delete-bin-line text-base sm:text-lg"></i>
                                                </button>
                                            </div>
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                                        <i className="ri-money-dollar-circle-line text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4 block"></i>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 font-cairo">
                                            لا توجد مدفوعات
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-500 px-4">
                                            لم يتم العثور على مدفوعات تطابق الفلتر المحدد
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tablet Table */}
                <div className="hidden md:block xl:hidden overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    رقم المعاملة
                                </th>
                                <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    رقم الطلب
                                </th>
                                <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    المبلغ
                                </th>
                                <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-3 lg:px-4 py-2 lg:py-3 text-right text-xs lg:text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-semibold text-gray-900 truncate">
                                            #{payment.id.slice(-8)}
                                        </td>
                                        <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-gray-900 truncate">
                                            {payment.orders?.id || "غير محدد"}
                                        </td>
                                        <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-semibold text-gray-900 truncate">
                                            {payment.amount.toFixed(2)} $
                                        </td>
                                        <td className="px-3 lg:px-4 py-2 lg:py-3">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                                    payment.payment_status
                                                )}`}
                                            >
                                                {getPaymentStatusText(payment.payment_status)}
                                            </span>
                                        </td>
                                        <td className="px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-medium">
                                            <div className="flex gap-1 lg:gap-1.5 justify-end flex-wrap">
                                                <button
                                                    onClick={() => handleViewDetails(payment)}
                                                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="عرض"
                                                >
                                                    <i className="ri-eye-line text-sm lg:text-base"></i>
                                                </button>
                                                <button
                                                    onClick={() => handlePrintReceipt(payment)}
                                                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="طباعة"
                                                >
                                                    <i className="ri-printer-line text-sm lg:text-base"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(payment)}
                                                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تعديل"
                                                >
                                                    <i className="ri-edit-line text-sm lg:text-base"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(payment)}
                                                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="حذف"
                                                >
                                                    <i className="ri-delete-bin-line text-sm lg:text-base"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 lg:px-6 py-8 lg:py-12 text-center">
                                        <i className="ri-money-dollar-circle-line text-4xl lg:text-6xl text-gray-300 mb-3 lg:mb-4 block"></i>
                                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2 font-cairo">
                                            لا توجد مدفوعات
                                        </h3>
                                        <p className="text-sm lg:text-base text-gray-500">
                                            لم يتم العثور على مدفوعات تطابق الفلتر المحدد
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3 p-3">
                    {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-gray-900">
                                                #{payment.id.slice(-8)}
                                            </span>
                                            <span
                                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getPaymentStatusColor(
                                                    payment.payment_status
                                                )}`}
                                            >
                                                {getPaymentStatusText(payment.payment_status)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-1">
                                            {payment.orders?.id || "غير محدد"}
                                        </p>
                                        {payment.orders?.tables?.table_number && (
                                            <p className="text-xs text-gray-500">
                                                طاولة {payment.orders.tables.table_number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-left flex-shrink-0">
                                        <p className="text-sm font-bold text-gray-900">
                                            {payment.amount.toFixed(2)} $
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {getPaymentMethodText(payment.payment_method)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        {formatDate(payment.created_at)}
                                    </p>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleViewDetails(payment)}
                                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="عرض"
                                        >
                                            <i className="ri-eye-line text-base"></i>
                                        </button>
                                        <button
                                            onClick={() => handlePrintReceipt(payment)}
                                            className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                            title="طباعة"
                                        >
                                            <i className="ri-printer-line text-base"></i>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(payment)}
                                            className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                            title="تعديل"
                                        >
                                            <i className="ri-edit-line text-base"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(payment)}
                                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="حذف"
                                        >
                                            <i className="ri-delete-bin-line text-base"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <i className="ri-money-dollar-circle-line text-4xl text-gray-300 mb-3 block"></i>
                            <h3 className="text-base font-medium text-gray-900 mb-2 font-cairo">
                                لا توجد مدفوعات
                            </h3>
                            <p className="text-sm text-gray-500 px-4">
                                لم يتم العثور على مدفوعات تطابق الفلتر المحدد
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Details Modal */}
            {showDetailsModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-cairo">
                                تفاصيل المعاملة
                    </h3>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedPayment(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        رقم المعاملة
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">
                                        #{selectedPayment.id.slice(-8)}
                    </p>
                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        رقم الطلب
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">
                                        {selectedPayment.orders?.id || "غير محدد"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        الطاولة
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">
                                        {selectedPayment.orders?.tables?.table_number
                                            ? `طاولة ${selectedPayment.orders.tables.table_number}`
                                            : "غير محدد"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                        العميل
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900">
                                        {selectedPayment.orders?.customer_name || "غير محدد"}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    تفاصيل الدفع
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            المبلغ:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {selectedPayment.amount.toFixed(2)}{" "}
                                            $
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            طريقة الدفع:
                                        </span>
                                        <span className="text-gray-900">
                                            {getPaymentMethodText(
                                                selectedPayment.payment_method
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            الحالة:
                                        </span>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                                                selectedPayment.payment_status
                                            )}`}
                                        >
                                            {getPaymentStatusText(
                                                selectedPayment.payment_status
                                            )}
                                        </span>
                                    </div>
                                    {selectedPayment.transaction_id && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                رقم المعاملة:
                                            </span>
                                            <span className="text-gray-900">
                                                {selectedPayment.transaction_id}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            التاريخ والوقت:
                                        </span>
                                        <span className="text-gray-900">
                                            {formatDate(
                                                selectedPayment.created_at
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {selectedPayment.orders && (
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>إجمالي الطلب:</span>
                                        <span>
                                            {selectedPayment.orders.total_amount?.toFixed(
                                                2
                                            ) ||
                                                selectedPayment.amount.toFixed(
                                                    2
                                                )}{" "}
                                            $
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 border-t border-gray-200 pt-4">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedPayment(null);
                                    }}
                                    className="w-full sm:w-auto flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    إغلاق
                                </button>
                                <button
                                    onClick={() => handlePrintReceipt(selectedPayment)}
                                    className="w-full sm:w-auto flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <i className="ri-printer-line"></i>
                                    طباعة الإيصال
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Payment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-cairo">
                                إضافة مدفوعة جديدة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewPayment();
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    اختيار الطلب{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <CustomSelect
                                    options={getAvailableOrders().map(
                                        (order) => ({
                                            value: order.id,
                                            label: `${order.id} - ${
                                                order.table
                                            } - ${
                                                order.customer
                                            } (${order.total.toFixed(2)} $)`,
                                        })
                                    )}
                                    value={newPayment.order_id}
                                    onChange={(value) =>
                                        handleOrderSelect(value)
                                    }
                                    placeholder="اختر الطلب"
                                />
                                {newPayment.order_id && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">
                                                المبلغ المطلوب:
                                            </span>{" "}
                                            {mockOrders
                                                .find(
                                                    (o) =>
                                                        o.id ===
                                                        newPayment.order_id
                                                )
                                                ?.total.toFixed(2) ||
                                                "0.00"}{" "}
                                            $
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المبلغ{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newPayment.amount}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                amount: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        طريقة الدفع{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        options={[
                                            { value: "cash", label: "نقدي" },
                                            { value: "card", label: "بطاقة" },
                                            {
                                                value: "visa",
                                                label: "بطاقة ائتمان",
                                            },
                                            {
                                                value: "digital",
                                                label: "محفظة رقمية",
                                            },
                                        ]}
                                        value={newPayment.payment_method}
                                        onChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                payment_method: value,
                                            })
                                        }
                                        placeholder="اختر طريقة الدفع"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الحالة{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        options={[
                                            {
                                                value: "completed",
                                                label: "مكتمل",
                                            },
                                            {
                                                value: "pending",
                                                label: "في الانتظار",
                                            },
                                            { value: "failed", label: "فشل" },
                                            {
                                                value: "cancelled",
                                                label: "ملغي",
                                            },
                                        ]}
                                        value={newPayment.payment_status}
                                        onChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                payment_status: value,
                                            })
                                        }
                                        placeholder="اختر الحالة"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم المعاملة
                                    </label>
                                    <input
                                        type="text"
                                        value={newPayment.transaction_id}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                transaction_id: e.target.value,
                                            })
                                        }
                                        placeholder="سيتم توليده تلقائياً إن لم يتم إدخاله"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم العميل
                                    </label>
                                    <input
                                        type="text"
                                        value={newPayment.customer_name}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                customer_name: e.target.value,
                                            })
                                        }
                                        placeholder="اسم العميل"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={newPayment.customer_phone}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                customer_phone: e.target.value,
                                            })
                                        }
                                        placeholder="رقم الهاتف"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تاريخ الدفع
                                </label>
                                <CustomDatePicker
                                    value={newPayment.payment_date}
                                    onChange={(date) =>
                                        setNewPayment({
                                            ...newPayment,
                                            payment_date: date,
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={newPayment.notes}
                                    onChange={(e) =>
                                        setNewPayment({
                                            ...newPayment,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="ملاحظات إضافية حول المدفوعة..."
                                    rows={3}
                                    className="w-full px-2.5 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 border-t border-gray-200 pt-4">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewPayment();
                                    }}
                                    className="w-full sm:w-auto flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddPayment}
                                    className="w-full sm:w-auto flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <i className="ri-check-line"></i>
                                    إضافة المدفوعة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Payment Modal */}
            {showEditModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-cairo">
                                تعديل المدفوعة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedPayment(null);
                                    resetNewPayment();
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المبلغ{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={newPayment.amount}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                amount: e.target.value,
                                            })
                                        }
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        طريقة الدفع{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        options={[
                                            { value: "cash", label: "نقدي" },
                                            { value: "card", label: "بطاقة" },
                                            {
                                                value: "visa",
                                                label: "بطاقة ائتمان",
                                            },
                                            {
                                                value: "digital",
                                                label: "محفظة رقمية",
                                            },
                                        ]}
                                        value={newPayment.payment_method}
                                        onChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                payment_method: value,
                                            })
                                        }
                                        placeholder="اختر طريقة الدفع"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الحالة{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        options={[
                                            {
                                                value: "completed",
                                                label: "مكتمل",
                                            },
                                            {
                                                value: "pending",
                                                label: "في الانتظار",
                                            },
                                            { value: "failed", label: "فشل" },
                                            {
                                                value: "cancelled",
                                                label: "ملغي",
                                            },
                                        ]}
                                        value={newPayment.payment_status}
                                        onChange={(value) =>
                                            setNewPayment({
                                                ...newPayment,
                                                payment_status: value,
                                            })
                                        }
                                        placeholder="اختر الحالة"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم المعاملة
                                    </label>
                                    <input
                                        type="text"
                                        value={newPayment.transaction_id}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                transaction_id: e.target.value,
                                            })
                                        }
                                        placeholder="رقم المعاملة"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم العميل
                                    </label>
                                    <input
                                        type="text"
                                        value={newPayment.customer_name}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                customer_name: e.target.value,
                                            })
                                        }
                                        placeholder="اسم العميل"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={newPayment.customer_phone}
                                        onChange={(e) =>
                                            setNewPayment({
                                                ...newPayment,
                                                customer_phone: e.target.value,
                                            })
                                        }
                                        placeholder="رقم الهاتف"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تاريخ الدفع
                                </label>
                                <CustomDatePicker
                                    value={newPayment.payment_date}
                                    onChange={(date) =>
                                        setNewPayment({
                                            ...newPayment,
                                            payment_date: date,
                                        })
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={newPayment.notes}
                                    onChange={(e) =>
                                        setNewPayment({
                                            ...newPayment,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="ملاحظات إضافية حول المدفوعة..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 border-t border-gray-200 pt-4">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedPayment(null);
                                        resetNewPayment();
                                    }}
                                    className="w-full sm:w-auto flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleUpdatePayment}
                                    className="w-full sm:w-auto flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <i className="ri-check-line"></i>
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold font-cairo">
                                تأكيد الحذف
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedPayment(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            هل أنت متأكد من حذف هذه المدفوعة؟ لا يمكن التراجع عن
                            هذا الإجراء.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedPayment(null);
                                }}
                                className="w-full sm:w-auto flex-1 border border-gray-300 text-gray-700 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="w-full sm:w-auto flex-1 bg-red-500 hover:bg-red-600 text-white py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default PaymentManagement;
