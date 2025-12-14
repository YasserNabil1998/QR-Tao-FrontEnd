import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface Supplier {
    id: string;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    payment_terms: string;
    credit_limit: number;
    current_balance: number;
    rating: number;
    is_active: boolean;
    contract_start_date?: string;
    contract_end_date?: string;
    discount_percentage: number;
    delivery_time_days: number;
    notes?: string;
    created_at: string;
}

// interface SupplierPerformance {
//     supplier_id: string;
//     on_time_deliveries: number;
//     total_deliveries: number;
//     quality_rating: number;
//     price_competitiveness: number;
//     last_delivery_date?: string;
// }

export default function SuppliersManagement() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPerformanceModal, setShowPerformanceModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null
    );
    const [supplierToDeactivate, setSupplierToDeactivate] =
        useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const { showToast, ToastContainer } = useToast();

    const [supplierForm, setSupplierForm] = useState({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        payment_terms: "30",
        credit_limit: 0,
        rating: 5,
        contract_start_date: "",
        contract_end_date: "",
        discount_percentage: 0,
        delivery_time_days: 7,
        notes: "",
    });

    // البيانات الوهمية للموردين
    // ملاحظة: في النظام الحقيقي، يجب حساب current_balance من:
    // 1. مجموع الفواتير غير المدفوعة (invoices) للمورد
    // 2. مجموع المشتريات غير المدفوعة (purchases) للمورد
    // 3. طرح المدفوعات المدفوعة (payments) للمورد
    // الصيغة: current_balance = (مجموع الفواتير + المشتريات) - المدفوعات
    const mockSuppliers: Supplier[] = [
        {
            id: "1",
            name: "مزارع الخليج",
            contact_person: "محمد أحمد",
            phone: "+20123456789",
            email: "info@gulfarms.com",
            address: "القاهرة، مصر",
            payment_terms: "30 يوم",
            credit_limit: 50000,
            current_balance: 15000, // قيمة وهمية - يجب حسابها من الفواتير والمشتريات
            rating: 4.5,
            is_active: true,
            discount_percentage: 5,
            delivery_time_days: 7,
            notes: "مورد موثوق للحوم الطازجة",
            created_at: "",
            contract_start_date: "",
            contract_end_date: "",
        },
        {
            id: "2",
            name: "شركة الحبوب المتحدة",
            contact_person: "فاطمة علي",
            phone: "+20987654321",
            email: "sales@grains.com",
            address: "الإسكندرية، مصر",
            payment_terms: "15 يوم",
            credit_limit: 30000,
            current_balance: 8500, // قيمة وهمية - يجب حسابها من الفواتير والمشتريات
            rating: 4.2,
            is_active: true,
            discount_percentage: 3,
            delivery_time_days: 7,
            notes: "أسعار تنافسية للحبوب",
            created_at: "",
            contract_start_date: "",
            contract_end_date: "",
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setSuppliers(mockSuppliers);
            setLoading(false);
        }, 300);
    }, []);

    const handleAddSupplier = () => {
        // Validation
        if (!supplierForm.name.trim()) {
            showToast("يرجى إدخال اسم المورد", "error");
            return;
        }
        if (!supplierForm.contact_person.trim()) {
            showToast("يرجى إدخال اسم الشخص المسؤول", "error");
            return;
        }
        if (!supplierForm.phone.trim()) {
            showToast("يرجى إدخال رقم الهاتف", "error");
            return;
        }

        // Add new supplier to local state
        const newSupplier: Supplier = {
            id: `supplier-${Date.now()}`,
            ...supplierForm,
            current_balance: 0,
            is_active: true,
            created_at: new Date().toISOString(),
        };
        setSuppliers((prev) => [newSupplier, ...prev]);
        showToast("تم إضافة المورد بنجاح", "success");
        setShowAddModal(false);
        resetForm();
    };

    const handleEditSupplier = () => {
        if (!selectedSupplier) return;

        // Validation
        if (!supplierForm.name.trim()) {
            showToast("يرجى إدخال اسم المورد", "error");
            return;
        }
        if (!supplierForm.contact_person.trim()) {
            showToast("يرجى إدخال اسم الشخص المسؤول", "error");
            return;
        }
        if (!supplierForm.phone.trim()) {
            showToast("يرجى إدخال رقم الهاتف", "error");
            return;
        }

        setSuppliers((prev) =>
            prev.map((supplier) =>
                supplier.id === selectedSupplier.id
                    ? { ...supplier, ...supplierForm }
                    : supplier
            )
        );
        showToast("تم تحديث بيانات المورد بنجاح", "success");
        setShowEditModal(false);
        setSelectedSupplier(null);
        resetForm();
    };

    const toggleSupplierStatus = (supplier: Supplier) => {
        if (supplier.is_active) {
            // Show confirmation modal for deactivation
            setSupplierToDeactivate(supplier);
            setShowDeactivateModal(true);
        } else {
            // Activate directly without confirmation
            setSuppliers((prev) =>
                prev.map((s) =>
                    s.id === supplier.id ? { ...s, is_active: true } : s
                )
            );
            showToast("تم تفعيل المورد بنجاح", "success");
        }
    };

    const confirmDeactivate = () => {
        if (supplierToDeactivate) {
            setSuppliers((prev) =>
                prev.map((supplier) =>
                    supplier.id === supplierToDeactivate.id
                        ? { ...supplier, is_active: false }
                        : supplier
                )
            );
            showToast("تم إلغاء تفعيل المورد بنجاح", "success");
            setShowDeactivateModal(false);
            setSupplierToDeactivate(null);
        }
    };

    const cancelDeactivate = () => {
        setShowDeactivateModal(false);
        setSupplierToDeactivate(null);
    };

    const openEditModal = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        // Extract payment terms number from text (e.g., "30 يوم" -> "30")
        const paymentTermsValue = supplier.payment_terms.includes("يوم")
            ? supplier.payment_terms.split(" ")[0]
            : supplier.payment_terms;

        setSupplierForm({
            name: supplier.name,
            contact_person: supplier.contact_person,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
            payment_terms: paymentTermsValue,
            credit_limit: supplier.credit_limit,
            rating: supplier.rating,
            contract_start_date: supplier.contract_start_date || "",
            contract_end_date: supplier.contract_end_date || "",
            discount_percentage: supplier.discount_percentage,
            delivery_time_days: supplier.delivery_time_days,
            notes: supplier.notes || "",
        });
        setShowEditModal(true);
    };

    const resetForm = () => {
        setSupplierForm({
            name: "",
            contact_person: "",
            phone: "",
            email: "",
            address: "",
            payment_terms: "30",
            credit_limit: 0,
            rating: 5,
            contract_start_date: "",
            contract_end_date: "",
            discount_percentage: 0,
            delivery_time_days: 7,
            notes: "",
        });
    };

    const getRatingStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`ri-star-${
                    i < rating ? "fill" : "line"
                } text-yellow-400`}
            ></i>
        ));
    };

    const getPaymentTermsText = (terms: string) => {
        switch (terms) {
            case "0":
                return "فوري";
            case "15":
                return "15 يوم";
            case "30":
                return "30 يوم";
            case "60":
                return "60 يوم";
            case "90":
                return "90 يوم";
            default:
                return `${terms} يوم`;
        }
    };

    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contact_person
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        if (filter === "all") return matchesSearch;
        if (filter === "active") return matchesSearch && supplier.is_active;
        if (filter === "inactive") return matchesSearch && !supplier.is_active;
        if (filter === "high_rating")
            return matchesSearch && supplier.rating >= 4;
        if (filter === "contract_expiring") {
            const today = new Date();
            const thirtyDaysFromNow = new Date(
                today.getTime() + 30 * 24 * 60 * 60 * 1000
            );
            return (
                matchesSearch &&
                supplier.contract_end_date &&
                new Date(supplier.contract_end_date) <= thirtyDaysFromNow
            );
        }
        return matchesSearch;
    });

    // حساب الإحصائيات من مصفوفة suppliers
    // هذه الإحصائيات تُحسب ديناميكياً من البيانات الحالية:
    const totalSuppliers = suppliers.length; // إجمالي عدد الموردين
    const activeSuppliers = suppliers.filter((s) => s.is_active).length; // الموردين النشطين
    const inactiveSuppliers = suppliers.filter((s) => !s.is_active).length; // الموردين غير النشطين
    const highRatedSuppliers = suppliers.filter((s) => s.rating >= 4).length; // الموردين بتقييم عالي (4+)

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة الموردين
                </h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    <i className="ri-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة مورد جديد</span>
                </button>
            </div>

            {/* إحصائيات الموردين */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-group-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الموردين
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {totalSuppliers}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                            <i className="ri-check-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                نشط
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {activeSuppliers}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                            <i className="ri-close-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                غير نشط
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {inactiveSuppliers}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                            <i className="ri-star-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                تقييم عالي
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo mt-1">
                                {highRatedSuppliers}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-5 xl:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
                            <i className="ri-money-dollar-circle-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الرصيد
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 font-cairo mt-1">
                                {suppliers
                                    .reduce(
                                        (total, supplier) =>
                                            total + supplier.current_balance,
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
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0">
                            <i className="ri-bank-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي الحد الائتماني
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 font-cairo mt-1">
                                {suppliers
                                    .reduce(
                                        (total, supplier) =>
                                            total + supplier.credit_limit,
                                        0
                                    )
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر وبحث */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <input
                        type="text"
                        placeholder="البحث في الموردين..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                <div className="w-full sm:w-48">
                    <CustomSelect
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع الموردين" },
                            { value: "active", label: "نشط" },
                            { value: "inactive", label: "غير نشط" },
                            { value: "high_rating", label: "تقييم عالي" },
                            {
                                value: "contract_expiring",
                                label: "عقود منتهية الصلاحية",
                            },
                        ]}
                        placeholder="اختر الفلتر"
                        className="w-full sm:w-48"
                    />
                </div>
            </div>

            {/* جدول الموردين */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "11%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "8%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    اسم المورد
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الشخص المسؤول
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الهاتف
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    شروط الدفع
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحد الائتماني
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الرصيد الحالي
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التقييم
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
                            {filteredSuppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {supplier.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {supplier.contact_person}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {supplier.phone}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {getPaymentTermsText(
                                                supplier.payment_terms
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {supplier.credit_limit.toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        {/* الرصيد الحالي: يُعرض من supplier.current_balance */}
                                        {/* في النظام الحقيقي يجب حسابها من: (الفواتير + المشتريات) - المدفوعات */}
                                        <div
                                            className={`text-sm font-medium ${
                                                supplier.current_balance > 0
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {supplier.current_balance.toLocaleString()}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex">
                                            {getRatingStars(supplier.rating)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                supplier.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {supplier.is_active
                                                ? "نشط"
                                                : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() =>
                                                    openEditModal(supplier)
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    toggleSupplierStatus(
                                                        supplier
                                                    )
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                                    supplier.is_active
                                                        ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                                }`}
                                                title={
                                                    supplier.is_active
                                                        ? "إلغاء التفعيل"
                                                        : "تفعيل"
                                                }
                                            >
                                                <i
                                                    className={`ri-${
                                                        supplier.is_active
                                                            ? "close"
                                                            : "check"
                                                    }-line text-lg`}
                                                ></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedSupplier(
                                                        supplier
                                                    );
                                                    setShowPerformanceModal(
                                                        true
                                                    );
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                title="تقييم الأداء"
                                            >
                                                <i className="ri-bar-chart-line text-lg"></i>
                                            </button>
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
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المورد</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الشخص المسؤول</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحد الائتماني</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرصيد</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900 truncate">{supplier.name}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{supplier.contact_person}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{supplier.phone}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {supplier.credit_limit.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {supplier.current_balance.toLocaleString()} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center">
                                            <span className="text-xs font-medium text-gray-900">{supplier.rating}</span>
                                            <i className="ri-star-fill text-yellow-400 text-xs mr-1"></i>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {supplier.is_active ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                نشط
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-close-line ml-1"></i>
                                                غير نشط
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => openEditModal(supplier)}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => toggleSupplierStatus(supplier)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                                    supplier.is_active
                                                        ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                                }`}
                                                title={supplier.is_active ? "إلغاء التفعيل" : "تفعيل"}
                                            >
                                                <i className={`ri-${supplier.is_active ? "close" : "check"}-line text-lg`}></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredSuppliers.map((supplier) => (
                        <div key={supplier.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                        {supplier.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 truncate font-tajawal">
                                        {supplier.contact_person}
                                    </p>
                                </div>
                                {supplier.is_active ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                                        <i className="ri-check-line ml-1"></i>
                                        نشط
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                                        <i className="ri-close-line ml-1"></i>
                                        غير نشط
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الهاتف:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo">{supplier.phone}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">البريد:</span>
                                    <span className="text-sm text-gray-900 mr-2 truncate font-tajawal">{supplier.email}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الحد الائتماني:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{supplier.credit_limit.toLocaleString()} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الرصيد الحالي:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{supplier.current_balance.toLocaleString()} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">شروط الدفع:</span>
                                    <span className="text-sm text-gray-900 mr-2 font-tajawal">{supplier.payment_terms}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">التقييم:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo flex items-center">
                                        {supplier.rating}
                                        <i className="ri-star-fill text-yellow-400 text-xs mr-1"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => openEditModal(supplier)}
                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="تعديل"
                                >
                                    <i className="ri-edit-line text-lg"></i>
                                </button>
                                <button
                                    onClick={() => toggleSupplierStatus(supplier)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                        supplier.is_active
                                            ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                    }`}
                                    title={supplier.is_active ? "إلغاء التفعيل" : "تفعيل"}
                                >
                                    <i className={`ri-${supplier.is_active ? "close" : "check"}-line text-lg`}></i>
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedSupplier(supplier);
                                        setShowPerformanceModal(true);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                    title="تقييم الأداء"
                                >
                                    <i className="ri-bar-chart-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredSuppliers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-truck-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد موردين</p>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال إضافة مورد */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                إضافة مورد جديد
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        اسم المورد
                                    </label>
                                    <input
                                        type="text"
                                        value={supplierForm.name}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        الشخص المسؤول
                                    </label>
                                    <input
                                        type="text"
                                        value={supplierForm.contact_person}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contact_person: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={supplierForm.phone}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={supplierForm.email}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        العنوان
                                    </label>
                                    <textarea
                                        value={supplierForm.address}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        شروط الدفع (بالأيام)
                                    </label>
                                    <CustomSelect
                                        value={supplierForm.payment_terms}
                                        onChange={(value) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                payment_terms: value,
                                            }))
                                        }
                                        options={[
                                            { value: "0", label: "فوري" },
                                            { value: "15", label: "15 يوم" },
                                            { value: "30", label: "30 يوم" },
                                            { value: "60", label: "60 يوم" },
                                            { value: "90", label: "90 يوم" },
                                        ]}
                                        placeholder="اختر شروط الدفع"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الحد الائتماني
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.credit_limit}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                credit_limit:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الحد الائتماني"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        تاريخ بداية العقد
                                    </label>
                                    <input
                                        type="date"
                                        value={supplierForm.contract_start_date}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contract_start_date:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        تاريخ انتهاء العقد
                                    </label>
                                    <input
                                        type="date"
                                        value={supplierForm.contract_end_date}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contract_end_date:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        نسبة الخصم (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.discount_percentage}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                discount_percentage:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل نسبة الخصم"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        مدة التوريد (بالأيام)
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.delivery_time_days}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                delivery_time_days:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل مدة التوريد"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        التقييم
                                    </label>
                                    <CustomSelect
                                        value={supplierForm.rating.toString()}
                                        onChange={(value) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                rating: parseInt(value),
                                            }))
                                        }
                                        options={[
                                            { value: "1", label: "⭐ (1)" },
                                            { value: "2", label: "⭐⭐ (2)" },
                                            { value: "3", label: "⭐⭐⭐ (3)" },
                                            {
                                                value: "4",
                                                label: "⭐⭐⭐⭐ (4)",
                                            },
                                            {
                                                value: "5",
                                                label: "⭐⭐⭐⭐⭐ (5)",
                                            },
                                        ]}
                                        placeholder="اختر التقييم"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        ملاحظات
                                    </label>
                                    <textarea
                                        value={supplierForm.notes}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="أدخل ملاحظات (اختياري)"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddSupplier}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إضافة المورد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تعديل مورد */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold font-cairo">
                                تعديل بيانات المورد
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        اسم المورد
                                    </label>
                                    <input
                                        type="text"
                                        value={supplierForm.name}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        الشخص المسؤول
                                    </label>
                                    <input
                                        type="text"
                                        value={supplierForm.contact_person}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contact_person: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={supplierForm.phone}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={supplierForm.email}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-tajawal">
                                        العنوان
                                    </label>
                                    <textarea
                                        value={supplierForm.address}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        شروط الدفع (بالأيام)
                                    </label>
                                    <CustomSelect
                                        value={supplierForm.payment_terms}
                                        onChange={(value) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                payment_terms: value,
                                            }))
                                        }
                                        options={[
                                            { value: "0", label: "فوري" },
                                            { value: "15", label: "15 يوم" },
                                            { value: "30", label: "30 يوم" },
                                            { value: "60", label: "60 يوم" },
                                            { value: "90", label: "90 يوم" },
                                        ]}
                                        placeholder="اختر شروط الدفع"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الحد الائتماني
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.credit_limit}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                credit_limit:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الحد الائتماني"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        تاريخ بداية العقد
                                    </label>
                                    <input
                                        type="date"
                                        value={supplierForm.contract_start_date}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contract_start_date:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        تاريخ انتهاء العقد
                                    </label>
                                    <input
                                        type="date"
                                        value={supplierForm.contract_end_date}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                contract_end_date:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        نسبة الخصم (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.discount_percentage}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                discount_percentage:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل نسبة الخصم"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        مدة التوريد (بالأيام)
                                    </label>
                                    <input
                                        type="number"
                                        value={supplierForm.delivery_time_days}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                delivery_time_days:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل مدة التوريد"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        التقييم
                                    </label>
                                    <CustomSelect
                                        value={supplierForm.rating.toString()}
                                        onChange={(value) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                rating: parseInt(value),
                                            }))
                                        }
                                        options={[
                                            { value: "1", label: "⭐ (1)" },
                                            { value: "2", label: "⭐⭐ (2)" },
                                            { value: "3", label: "⭐⭐⭐ (3)" },
                                            {
                                                value: "4",
                                                label: "⭐⭐⭐⭐ (4)",
                                            },
                                            {
                                                value: "5",
                                                label: "⭐⭐⭐⭐⭐ (5)",
                                            },
                                        ]}
                                        placeholder="اختر التقييم"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        ملاحظات
                                    </label>
                                    <textarea
                                        value={supplierForm.notes}
                                        onChange={(e) =>
                                            setSupplierForm((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="أدخل ملاحظات (اختياري)"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleEditSupplier}
                                    type="button"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                                >
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال تقييم الأداء */}
            {showPerformanceModal && selectedSupplier && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                تقييم أداء المورد - {selectedSupplier.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPerformanceModal(false);
                                    setSelectedSupplier(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">
                                        التقييم الحالي:
                                    </span>{" "}
                                    {getRatingStars(selectedSupplier.rating)}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">
                                        الحد الائتماني:
                                    </span>{" "}
                                    {selectedSupplier.credit_limit.toLocaleString()}{" "}
                                    $
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium">
                                        الرصيد الحالي:
                                    </span>{" "}
                                    <span
                                        className={
                                            selectedSupplier.current_balance > 0
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }
                                    >
                                        {selectedSupplier.current_balance.toLocaleString()}{" "}
                                        $
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        مدة التوريد:
                                    </span>{" "}
                                    {selectedSupplier.delivery_time_days} يوم
                                </p>
                            </div>
                            <div className="flex justify-start pt-4">
                                <button
                                    onClick={() => {
                                        setShowPerformanceModal(false);
                                        setSelectedSupplier(null);
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium bg-gray-500 text-white rounded-lg hover:bg-gray-600 whitespace-nowrap cursor-pointer"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة تأكيد إلغاء التفعيل */}
            {showDeactivateModal && supplierToDeactivate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                <i className="ri-error-warning-line text-2xl sm:text-3xl text-orange-500"></i>
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-2 font-cairo">
                            تأكيد إلغاء التفعيل
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-2 font-tajawal">
                            هل أنت متأكد من إلغاء تفعيل المورد{" "}
                            <span className="font-semibold text-gray-900">
                                {supplierToDeactivate.name}
                            </span>
                            ؟
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6 font-tajawal">
                            سيتم إلغاء تفعيل هذا المورد ولن يظهر في القائمة
                            النشطة.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                            <button
                                type="button"
                                onClick={cancelDeactivate}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeactivate}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                تأكيد إلغاء التفعيل
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
