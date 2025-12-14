import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface Purchase {
    id: string;
    purchase_number: string;
    purchase_date: string;
    expected_delivery_date: string;
    actual_delivery_date?: string;
    status:
        | "pending"
        | "approved"
        | "ordered"
        | "delivered"
        | "rejected"
        | "returned";
    total_amount: number;
    supplier: {
        name: string;
    };
    notes?: string;
    approved_by?: string;
    approved_date?: string;
    shipping_cost?: number;
    storage_cost?: number;
}

interface PurchaseItem {
    id: string;
    item_name: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;
    returned_quantity?: number;
    return_reason?: string;
}

interface QuoteComparison {
    supplier_id: string;
    supplier_name: string;
    quoted_price: number;
    delivery_time: number;
    notes: string;
}

// Mock data for display purposes
const mockPurchases: Purchase[] = [
    {
        id: "1",
        purchase_number: "PO-2024-001",
        purchase_date: "2024-01-15",
        expected_delivery_date: "2024-01-18",
        status: "pending",
        total_amount: 2500,
        supplier: { name: "مزارع الخليج" },
        notes: "طلب عاجل للمخزون",
        shipping_cost: 50,
        storage_cost: 0,
        approved_by: undefined,
        approved_date: undefined,
    },
    {
        id: "2",
        purchase_number: "PO-2024-002",
        purchase_date: "2024-01-14",
        expected_delivery_date: "2024-01-17",
        status: "approved",
        total_amount: 1800,
        supplier: { name: "شركة الحبوب المتحدة" },
        notes: "طلب شهري للحبوب",
        shipping_cost: 30,
        storage_cost: 0,
        approved_by: "أحمد محمد",
        approved_date: undefined,
    },
];

const mockSuppliers = [
    { id: "1", name: "مزارع الخليج" },
    { id: "2", name: "شركة الحبوب المتحدة" },
];

const mockPurchaseItems: { [key: string]: PurchaseItem[] } = {
    "1": [
        {
            id: "1-1",
            item_name: "لحم بقري",
            quantity: 50,
            unit: "كيلو",
            unit_price: 120,
            total_price: 6000,
        },
        {
            id: "1-2",
            item_name: "دجاج",
            quantity: 30,
            unit: "كيلو",
            unit_price: 45,
            total_price: 1350,
        },
    ],
    "2": [
        {
            id: "2-1",
            item_name: "أرز",
            quantity: 100,
            unit: "كيلو",
            unit_price: 12,
            total_price: 1200,
        },
        {
            id: "2-2",
            item_name: "عدس",
            quantity: 50,
            unit: "كيلو",
            unit_price: 8,
            total_price: 400,
        },
    ],
};

export default function PurchaseManagement() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [_showQuotesModal, _setShowQuotesModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<string | null>(
        null
    );
    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
    const [_quotes, _setQuotes] = useState<QuoteComparison[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const { showToast, ToastContainer } = useToast();

    const [newPurchase, setNewPurchase] = useState({
        supplier_id: "",
        purchase_date: new Date().toISOString().split("T")[0],
        expected_delivery_date: "",
        notes: "",
        shipping_cost: 0,
        storage_cost: 0,
        items: [{ item_name: "", quantity: 1, unit: "كيلو", unit_price: 0 }],
    });

    const [returnData, setReturnData] = useState({
        item_id: "",
        returned_quantity: 0,
        return_reason: "",
    });

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setPurchases(mockPurchases);
            setSuppliers(mockSuppliers);
            setLoading(false);
        }, 300);
    }, []);

    const fetchPurchaseItems = (purchaseId: string) => {
        const items = mockPurchaseItems[purchaseId] || [];
        setPurchaseItems(items);
    };

    const handleAddPurchase = () => {
        // Validation
        if (!newPurchase.supplier_id) {
            showToast("يرجى اختيار المورد", "error");
            return;
        }
        if (!newPurchase.purchase_date) {
            showToast("يرجى إدخال تاريخ الطلب", "error");
            return;
        }
        if (newPurchase.items.length === 0) {
            showToast("يرجى إضافة عنصر واحد على الأقل", "error");
            return;
        }
        for (const item of newPurchase.items) {
            if (!item.item_name.trim()) {
                showToast("يرجى إدخال اسم العنصر", "error");
                return;
            }
            if (item.quantity <= 0) {
                showToast("يرجى إدخال كمية صحيحة", "error");
                return;
            }
            if (item.unit_price <= 0) {
                showToast("يرجى إدخال سعر صحيح", "error");
                return;
        }
        }

        const purchaseNumber = `PO-${new Date().getFullYear()}-${String(
            purchases.length + 1
        ).padStart(3, "0")}`;
            const subtotal = newPurchase.items.reduce(
                (sum, item) => sum + item.quantity * item.unit_price,
                0
            );
            const taxAmount = subtotal * 0.15;
            const totalAmount =
                subtotal +
                taxAmount +
            (newPurchase.shipping_cost || 0) +
            (newPurchase.storage_cost || 0);

        const selectedSupplier = suppliers.find(
            (s) => s.id === newPurchase.supplier_id
        );

        const newPurchaseData: Purchase = {
            id: `purchase-${Date.now()}`,
                    purchase_number: purchaseNumber,
                    purchase_date: newPurchase.purchase_date,
            expected_delivery_date: newPurchase.expected_delivery_date || "",
            status: "pending",
                    total_amount: totalAmount,
            supplier: { name: selectedSupplier?.name || "" },
            notes: newPurchase.notes,
                    shipping_cost: newPurchase.shipping_cost,
                    storage_cost: newPurchase.storage_cost,
        };

        setPurchases((prev) => [newPurchaseData, ...prev]);

        // Store items for this purchase
        const items = newPurchase.items.map((item, index) => ({
            id: `${newPurchaseData.id}-${index}`,
                item_name: item.item_name,
                quantity: item.quantity,
                unit: item.unit,
                unit_price: item.unit_price,
                total_price: item.quantity * item.unit_price,
            }));
        mockPurchaseItems[newPurchaseData.id] = items;

        showToast("تم إضافة طلب الشراء بنجاح", "success");
            setShowAddModal(false);
            resetNewPurchase();
    };

    const resetNewPurchase = () => {
        setNewPurchase({
            supplier_id: "",
            purchase_date: new Date().toISOString().split("T")[0],
            expected_delivery_date: "",
            notes: "",
            shipping_cost: 0,
            storage_cost: 0,
            items: [
                { item_name: "", quantity: 1, unit: "كيلو", unit_price: 0 },
            ],
        });
    };

    const updatePurchaseStatus = (
        id: string,
        status:
            | "pending"
            | "approved"
            | "ordered"
            | "delivered"
            | "rejected"
            | "returned"
    ) => {
        setPurchases((prev) =>
            prev.map((purchase) => {
                if (purchase.id === id) {
                    const updated: Purchase = {
                        ...purchase,
                        status: status as Purchase["status"],
                    };
            if (status === "delivered") {
                        updated.actual_delivery_date = new Date()
                    .toISOString()
                    .split("T")[0];
            }
            if (status === "approved") {
                        updated.approved_by = "المدير المالي";
                        updated.approved_date = new Date()
                    .toISOString()
                    .split("T")[0];
            }
                    return updated;
                }
                return purchase;
            })
        );
        showToast(
            `تم تحديث حالة الطلب إلى "${getStatusText(status)}" بنجاح`,
            "success"
        );
    };

    const handleReturn = () => {
        if (!returnData.item_id) {
            showToast("يرجى اختيار العنصر", "error");
            return;
        }
        if (returnData.returned_quantity <= 0) {
            showToast("يرجى إدخال كمية مرتجعة صحيحة", "error");
            return;
        }
        if (!returnData.return_reason.trim()) {
            showToast("يرجى إدخال سبب الإرجاع", "error");
            return;
        }

        setPurchaseItems((prev) =>
            prev.map((item) =>
                item.id === returnData.item_id
                    ? {
                          ...item,
                          returned_quantity: returnData.returned_quantity,
                          return_reason: returnData.return_reason,
                      }
                    : item
            )
        );

        if (selectedPurchase) {
            mockPurchaseItems[selectedPurchase] = purchaseItems.map((item) =>
                item.id === returnData.item_id
                    ? {
                          ...item,
                    returned_quantity: returnData.returned_quantity,
                    return_reason: returnData.return_reason,
                      }
                    : item
            );
        }

        showToast("تم تسجيل الإرجاع بنجاح", "success");
            setShowReturnModal(false);
            setReturnData({
                item_id: "",
                returned_quantity: 0,
                return_reason: "",
            });
        if (selectedPurchase) {
            fetchPurchaseItems(selectedPurchase);
        }
    };

    const addPurchaseItem = () => {
        setNewPurchase((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { item_name: "", quantity: 1, unit: "كيلو", unit_price: 0 },
            ],
        }));
    };

    const removePurchaseItem = (index: number) => {
        setNewPurchase((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const updatePurchaseItem = (index: number, field: string, value: any) => {
        setNewPurchase((prev) => ({
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
            case "approved":
                return "bg-blue-100 text-blue-800";
            case "ordered":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "returned":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "في الانتظار";
            case "approved":
                return "معتمد";
            case "ordered":
                return "تم الطلب";
            case "delivered":
                return "تم التسليم";
            case "rejected":
                return "مرفوض";
            case "returned":
                return "مرتجع";
            default:
                return status;
        }
    };

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const filteredPurchases = purchases.filter((purchase) => {
        const matchesStatus = filter === "all" || purchase.status === filter;
        const matchesDate =
            !dateFilter || purchase.purchase_date.includes(dateFilter);
        return matchesStatus && matchesDate;
    });

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة المشتريات
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    <i className="ri-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة طلب شراء جديد</span>
                </button>
            </div>

            {/* إحصائيات المشتريات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-shopping-cart-line text-lg sm:text-xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                إجمالي المشتريات
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {purchases
                                .reduce(
                                    (total, purchase) =>
                                        total + purchase.total_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                            <i className="ri-time-line text-lg sm:text-xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                قيمة المشتريات المنتظرة
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {purchases
                                .filter((p) => p.status === "pending")
                                .reduce(
                                    (total, purchase) =>
                                        total + purchase.total_amount,
                                    0
                                )
                                .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                            <i className="ri-file-list-3-line text-lg sm:text-xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                إجمالي الضريبة
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {purchases
                                .reduce(
                                    (total, purchase) =>
                                            total +
                                            purchase.total_amount * 0.15,
                                    0
                                )
                                .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center">
                <div className="w-full sm:w-48">
                    <CustomSelect
                    value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع المشتريات" },
                            { value: "pending", label: "في الانتظار" },
                            { value: "approved", label: "معتمد" },
                            { value: "ordered", label: "تم الطلب" },
                            { value: "delivered", label: "تم التسليم" },
                            { value: "rejected", label: "مرفوض" },
                            { value: "returned", label: "مرتجع" },
                        ]}
                        placeholder="اختر الحالة"
                        className="w-full sm:w-48"
                    />
                </div>
                <input
                    type="month"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="فلترة حسب الشهر"
                />
            </div>

            {/* جدول المشتريات */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "22%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم المشتريات
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المورد
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ الطلب
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    تاريخ التسليم المتوقع
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ الإجمالي
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPurchases.map((purchase) => (
                                <tr
                                    key={purchase.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                        {purchase.purchase_number}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                        {purchase.supplier?.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(purchase.purchase_date)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(
                                                  purchase.expected_delivery_date
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {purchase.total_amount.toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                purchase.status
                                            )}`}
                                        >
                                            {getStatusText(purchase.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedPurchase(
                                                        purchase.id
                                                    );
                                                    fetchPurchaseItems(
                                                        purchase.id
                                                    );
                                                    setShowItemsModal(true);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="عرض التفاصيل"
                                            >
                                                <i className="ri-eye-line text-lg"></i>
                                            </button>
                                            {purchase.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            updatePurchaseStatus(
                                                                purchase.id,
                                                                "approved"
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                        title="اعتماد الطلب"
                                                    >
                                                        <i className="ri-check-line text-lg"></i>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            updatePurchaseStatus(
                                                                purchase.id,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="رفض الطلب"
                                                    >
                                                        <i className="ri-close-line text-lg"></i>
                                                    </button>
                                                </>
                                            )}
                                            {purchase.status === "approved" && (
                                                <button
                                                    onClick={() =>
                                                        updatePurchaseStatus(
                                                            purchase.id,
                                                            "ordered"
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تأكيد الطلب"
                                                >
                                                    <i className="ri-shopping-bag-line text-lg"></i>
                                                </button>
                                            )}
                                            {purchase.status === "ordered" && (
                                                <button
                                                    onClick={() =>
                                                        updatePurchaseStatus(
                                                            purchase.id,
                                                            "delivered"
                                                        )
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تأكيد الاستلام"
                                                >
                                                    <i className="ri-truck-line text-lg"></i>
                                                </button>
                                            )}
                                            {purchase.status ===
                                                "delivered" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedPurchase(
                                                            purchase.id
                                                        );
                                                        fetchPurchaseItems(
                                                            purchase.id
                                                        );
                                                        setShowReturnModal(
                                                            true
                                                        );
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="إدارة المرتجعات"
                                                >
                                                    <i className="ri-arrow-go-back-line text-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tablet Table (MD to LG) */}
                <div className="hidden md:block xl:hidden overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المشتريات</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المورد</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الطلب</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPurchases.map((purchase) => (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900 truncate">{purchase.purchase_number}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{purchase.supplier?.name}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900">{formatDate(purchase.purchase_date)}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {purchase.total_amount.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                                            {getStatusText(purchase.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => {
                                                    setSelectedPurchase(purchase.id);
                                                    fetchPurchaseItems(purchase.id);
                                                    setShowItemsModal(true);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="عرض التفاصيل"
                                            >
                                                <i className="ri-eye-line text-lg"></i>
                                            </button>
                                            {purchase.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updatePurchaseStatus(purchase.id, "approved")}
                                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                        title="اعتماد"
                                                    >
                                                        <i className="ri-check-line text-lg"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => updatePurchaseStatus(purchase.id, "rejected")}
                                                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="رفض"
                                                    >
                                                        <i className="ri-close-line text-lg"></i>
                                                    </button>
                                                </>
                                            )}
                                            {purchase.status === "approved" && (
                                                <button
                                                    onClick={() => updatePurchaseStatus(purchase.id, "ordered")}
                                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                    title="تأكيد"
                                                >
                                                    <i className="ri-shopping-bag-line text-lg"></i>
                                                </button>
                                            )}
                                            {purchase.status === "ordered" && (
                                                <button
                                                    onClick={() => updatePurchaseStatus(purchase.id, "delivered")}
                                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                    title="استلام"
                                                >
                                                    <i className="ri-truck-line text-lg"></i>
                                                </button>
                                            )}
                                            {purchase.status === "delivered" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedPurchase(purchase.id);
                                                        fetchPurchaseItems(purchase.id);
                                                        setShowReturnModal(true);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                    title="مرتجعات"
                                                >
                                                    <i className="ri-arrow-go-back-line text-lg"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredPurchases.map((purchase) => (
                        <div key={purchase.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                        {purchase.purchase_number}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate font-tajawal">
                                        {purchase.supplier?.name}
                                    </p>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusColor(purchase.status)}`}>
                                    {getStatusText(purchase.status)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">تاريخ الطلب:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block">{formatDate(purchase.purchase_date)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">تاريخ التسليم:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo block">{formatDate(purchase.expected_delivery_date)}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-gray-600 font-tajawal">المبلغ الإجمالي:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{purchase.total_amount.toLocaleString()} $</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setSelectedPurchase(purchase.id);
                                        fetchPurchaseItems(purchase.id);
                                        setShowItemsModal(true);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="عرض التفاصيل"
                                >
                                    <i className="ri-eye-line text-lg"></i>
                                </button>
                                {purchase.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => updatePurchaseStatus(purchase.id, "approved")}
                                            className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                            title="اعتماد"
                                        >
                                            <i className="ri-check-line text-lg"></i>
                                        </button>
                                        <button
                                            onClick={() => updatePurchaseStatus(purchase.id, "rejected")}
                                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="رفض"
                                        >
                                            <i className="ri-close-line text-lg"></i>
                                        </button>
                                    </>
                                )}
                                {purchase.status === "approved" && (
                                    <button
                                        onClick={() => updatePurchaseStatus(purchase.id, "ordered")}
                                        className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                        title="تأكيد"
                                    >
                                        <i className="ri-shopping-bag-line text-lg"></i>
                                    </button>
                                )}
                                {purchase.status === "ordered" && (
                                    <button
                                        onClick={() => updatePurchaseStatus(purchase.id, "delivered")}
                                        className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                        title="استلام"
                                    >
                                        <i className="ri-truck-line text-lg"></i>
                                    </button>
                                )}
                                {purchase.status === "delivered" && (
                                    <button
                                        onClick={() => {
                                            setSelectedPurchase(purchase.id);
                                            fetchPurchaseItems(purchase.id);
                                            setShowReturnModal(true);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                        title="مرتجعات"
                                    >
                                        <i className="ri-arrow-go-back-line text-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredPurchases.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-shopping-cart-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد مشتريات</p>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال إضافة مشتريات */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                إضافة مشتريات جديدة
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewPurchase();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        المورد
                                    </label>
                                    <select
                                        value={newPurchase.supplier_id}
                                        onChange={(e) =>
                                            setNewPurchase((prev) => ({
                                                ...prev,
                                                supplier_id: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">اختر المورد</option>
                                        {suppliers.map((supplier) => (
                                            <option
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        تاريخ الطلب
                                    </label>
                                    <input
                                        type="date"
                                        value={newPurchase.purchase_date}
                                        onChange={(e) =>
                                            setNewPurchase((prev) => ({
                                                ...prev,
                                                purchase_date: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                        تاريخ التسليم المتوقع
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            newPurchase.expected_delivery_date
                                        }
                                        onChange={(e) =>
                                            setNewPurchase((prev) => ({
                                                ...prev,
                                                expected_delivery_date:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    ملاحظات
                                </label>
                                <textarea
                                    value={newPurchase.notes}
                                    onChange={(e) =>
                                        setNewPurchase((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="أدخل ملاحظات (اختياري)"
                                />
                            </div>

                            {/* عناصر المشتريات */}
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3">
                                    <h4 className="text-sm sm:text-base font-medium font-cairo">
                                        عناصر المشتريات
                                    </h4>
                                    <button
                                        onClick={addPurchaseItem}
                                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm whitespace-nowrap cursor-pointer flex items-center justify-center gap-1"
                                    >
                                        <i className="ri-add-line"></i> 
                                        <span>إضافة عنصر</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {newPurchase.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg"
                                        >
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="اسم العنصر"
                                                    value={item.item_name}
                                                    onChange={(e) =>
                                                        updatePurchaseItem(
                                                            index,
                                                            "item_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="الكمية"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updatePurchaseItem(
                                                            index,
                                                            "quantity",
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    value={item.unit}
                                                    onChange={(e) =>
                                                        updatePurchaseItem(
                                                            index,
                                                            "unit",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                >
                                                    <option value="كيلو">
                                                        كيلو
                                                    </option>
                                                    <option value="جرام">
                                                        جرام
                                                    </option>
                                                    <option value="لتر">
                                                        لتر
                                                    </option>
                                                    <option value="قطعة">
                                                        قطعة
                                                    </option>
                                                    <option value="علبة">
                                                        علبة
                                                    </option>
                                                    <option value="كيس">
                                                        كيس
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="السعر للوحدة"
                                                    value={item.unit_price}
                                                    onChange={(e) =>
                                                        updatePurchaseItem(
                                                            index,
                                                            "unit_price",
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    {(
                                                        item.quantity *
                                                        item.unit_price
                                                    ).toFixed(2)}{" "}
                                                    $
                                                </span>
                                                {newPurchase.items.length >
                                                    1 && (
                                                    <button
                                                        onClick={() =>
                                                            removePurchaseItem(
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

                                {/* إجمالي المبلغ */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between text-sm">
                                        <span>المجموع الفرعي:</span>
                                        <span>
                                            {newPurchase.items
                                                .reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.quantity *
                                                            item.unit_price,
                                                    0
                                                )
                                                .toFixed(2)}{" "}
                                            $
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>الضريبة (15%):</span>
                                        <span>
                                            {(
                                                newPurchase.items.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.quantity *
                                                            item.unit_price,
                                                    0
                                                ) * 0.15
                                            ).toFixed(2)}{" "}
                                            $
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                        <span>الإجمالي:</span>
                                        <span>
                                            {(
                                                newPurchase.items.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.quantity *
                                                            item.unit_price,
                                                    0
                                                ) * 1.15
                                            ).toFixed(2)}{" "}
                                            $
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetNewPurchase();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddPurchase}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إضافة المشتريات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال عرض عناصر المشتريات */}
            {showItemsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                عناصر المشتريات
                            </h3>
                            <button
                                onClick={() => setShowItemsModal(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            اسم العنصر
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الكمية
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الوحدة
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            سعر الوحدة
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الإجمالي
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchaseItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                                                {item.item_name}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                                                {item.unit}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                                                {item.unit_price} $
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                                                {item.total_price} $
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال إدارة المرتجعات */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                إدارة المرتجعات
                            </h3>
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setReturnData({
                                        item_id: "",
                                        returned_quantity: 0,
                                        return_reason: "",
                                    });
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    العنصر
                                </label>
                                <select
                                    value={returnData.item_id}
                                    onChange={(e) =>
                                        setReturnData((prev) => ({
                                            ...prev,
                                            item_id: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">اختر العنصر</option>
                                    {purchaseItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.item_name} - الكمية:{" "}
                                            {item.quantity} {item.unit}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    الكمية المرتجعة
                                </label>
                                <input
                                    type="number"
                                    value={returnData.returned_quantity}
                                    onChange={(e) =>
                                        setReturnData((prev) => ({
                                            ...prev,
                                            returned_quantity:
                                                parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="أدخل الكمية المرتجعة"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 font-tajawal">
                                    سبب الإرجاع
                                </label>
                                <textarea
                                    value={returnData.return_reason}
                                    onChange={(e) =>
                                        setReturnData((prev) => ({
                                            ...prev,
                                            return_reason: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="اذكر سبب الإرجاع (تالف، زائد، غير مطابق للمواصفات...)"
                                    required
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReturnModal(false);
                                        setReturnData({
                                            item_id: "",
                                            returned_quantity: 0,
                                            return_reason: "",
                                        });
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReturn}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    تسجيل الإرجاع
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
