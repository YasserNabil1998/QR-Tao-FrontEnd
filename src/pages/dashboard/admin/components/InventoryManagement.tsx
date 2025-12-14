import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    current_stock: number;
    min_stock: number;
    unit: string;
    cost_per_unit: number;
    supplier: string;
    last_updated: string;
}

interface InventoryManagementProps {
    restaurantId: string;
}

export default function InventoryManagement({
    restaurantId: _restaurantId,
}: InventoryManagementProps) {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(
        null
    );
    const [formData, setFormData] = useState({
        name: "",
        category: "لحوم",
        current_stock: 0,
        min_stock: 0,
        unit: "كيلو",
        cost_per_unit: 0,
        supplier: "",
    });
    const [formErrors, setFormErrors] = useState<{
        [key: string]: string;
    }>({});
    const { showToast, ToastContainer } = useToast();

    // Mock data for demonstration
    const mockInventory: InventoryItem[] = [
        {
            id: "1",
            name: "دجاج طازج",
            category: "لحوم",
            current_stock: 25,
            min_stock: 10,
            unit: "كيلو",
            cost_per_unit: 18,
            supplier: "مزارع الخليج",
            last_updated: "2024-01-15",
        },
        {
            id: "2",
            name: "أرز بسمتي",
            category: "حبوب",
            current_stock: 50,
            min_stock: 20,
            unit: "كيلو",
            cost_per_unit: 8,
            supplier: "شركة الحبوب المتحدة",
            last_updated: "2024-01-14",
        },
        {
            id: "3",
            name: "طماطم",
            category: "خضروات",
            current_stock: 5,
            min_stock: 15,
            unit: "كيلو",
            cost_per_unit: 4,
            supplier: "مزارع الرياض",
            last_updated: "2024-01-13",
        },
        {
            id: "4",
            name: "زيت زيتون",
            category: "زيوت",
            current_stock: 12,
            min_stock: 5,
            unit: "لتر",
            cost_per_unit: 35,
            supplier: "شركة الزيوت الطبيعية",
            last_updated: "2024-01-12",
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setInventory(mockInventory);
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name || "",
                category: editingItem.category || "لحوم",
                current_stock: editingItem.current_stock || 0,
                min_stock: editingItem.min_stock || 0,
                unit: editingItem.unit || "كيلو",
                cost_per_unit: editingItem.cost_per_unit || 0,
                supplier: editingItem.supplier || "",
            });
            setShowAddModal(true);
        } else {
            resetForm();
        }
    }, [editingItem]);

    const resetForm = () => {
        setFormData({
            name: "",
            category: "لحوم",
            current_stock: 0,
            min_stock: 0,
            unit: "كيلو",
            cost_per_unit: 0,
            supplier: "",
        });
        setFormErrors({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Direct validation without relying on state update
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = "اسم الصنف مطلوب";
        }

        if (formData.current_stock < 0) {
            errors.current_stock = "المخزون الحالي لا يمكن أن يكون سالباً";
        }

        if (formData.min_stock < 0) {
            errors.min_stock = "الحد الأدنى لا يمكن أن يكون سالباً";
        }

        if (formData.cost_per_unit <= 0) {
            errors.cost_per_unit = "التكلفة يجب أن تكون أكبر من صفر";
        }

        // Check supplier - handle textarea (may have newlines and spaces)
        const supplierValue = formData.supplier
            ? formData.supplier
                  .trim()
                  .replace(/\n/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
            : "";
        if (!supplierValue) {
            errors.supplier = "اسم المورد مطلوب";
        }

        // Set errors and return if validation fails
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            const firstError = Object.values(errors)[0];
            if (firstError) {
                showToast(firstError, "error");
            }
            return;
        }

        if (editingItem) {
            // Update existing item - clean supplier text
            const cleanedSupplier = formData.supplier
                ? formData.supplier
                      .trim()
                      .replace(/\n/g, " ")
                      .replace(/\s+/g, " ")
                      .trim()
                : "";
            setInventory((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id
                        ? {
                              ...item,
                              name: formData.name.trim(),
                              category: formData.category,
                              current_stock: formData.current_stock,
                              min_stock: formData.min_stock,
                              unit: formData.unit,
                              cost_per_unit: formData.cost_per_unit,
                              supplier: cleanedSupplier,
                              last_updated: new Date()
                                  .toISOString()
                                  .split("T")[0],
                          }
                        : item
                )
            );
            showToast("تم تحديث بيانات الصنف بنجاح", "success");
        } else {
            // Add new item - clean supplier text (remove newlines and extra spaces)
            const cleanedSupplier = formData.supplier
                ? formData.supplier
                      .trim()
                      .replace(/\n/g, " ")
                      .replace(/\s+/g, " ")
                      .trim()
                : "";
            const newItem: InventoryItem = {
                id: `item-${Date.now()}`,
                name: formData.name.trim(),
                category: formData.category,
                current_stock: formData.current_stock,
                min_stock: formData.min_stock,
                unit: formData.unit,
                cost_per_unit: formData.cost_per_unit,
                supplier: cleanedSupplier,
                last_updated: new Date().toISOString().split("T")[0],
            };
            setInventory((prev) => {
                const updated = [...prev, newItem];
                return updated;
            });
            showToast("تم إضافة الصنف بنجاح", "success");
        }

        setShowAddModal(false);
        setEditingItem(null);
        resetForm();
    };

    const handleDelete = (item: InventoryItem) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setInventory((prev) =>
                prev.filter((item) => item.id !== itemToDelete.id)
            );
            showToast("تم حذف الصنف بنجاح", "success");
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const categories = [
        { value: "all", label: "جميع الفئات" },
        { value: "لحوم", label: "لحوم" },
        { value: "خضروات", label: "خضروات" },
        { value: "حبوب", label: "حبوب" },
        { value: "زيوت", label: "زيوت" },
        { value: "منتجات ألبان", label: "منتجات ألبان" },
        { value: "توابل", label: "توابل" },
    ];

    const units = [
        { value: "كيلو", label: "كيلو" },
        { value: "لتر", label: "لتر" },
        { value: "علبة", label: "علبة" },
        { value: "كيس", label: "كيس" },
        { value: "قطعة", label: "قطعة" },
    ];

    const filteredInventory = inventory.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            filterCategory === "all" || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryOptions = categories.filter((c) => c.value !== "all");

    const lowStockItems = inventory.filter(
        (item) => item.current_stock <= item.min_stock
    );

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة المخزون
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    <i className="ri-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة صنف جديد</span>
                </button>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center">
                        <i className="ri-alert-line text-red-500 text-lg sm:text-xl ml-2 sm:ml-3 flex-shrink-0"></i>
                        <div>
                            <h3 className="text-sm sm:text-base text-red-800 font-semibold font-cairo">
                                تنبيه: مخزون منخفض
                            </h3>
                            <p className="text-xs sm:text-sm text-red-600 font-tajawal">
                                {lowStockItems.length} صنف يحتاج إعادة تموين
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:w-full">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                            البحث
                        </label>
                        <div className="relative">
                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث عن صنف..."
                                className="w-full pr-10 pl-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                            الفئة
                        </label>
                        <CustomSelect
                            value={filterCategory}
                            onChange={(value) => setFilterCategory(value)}
                            options={categories}
                            placeholder="اختر الفئة"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "18%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "7%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الصنف
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الفئة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المخزون الحالي
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحد الأدنى
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التكلفة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المورد
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {item.current_stock} {item.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {item.min_stock} {item.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {item.cost_per_unit.toLocaleString()}{" "}
                                            $/{item.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {item.supplier}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        {item.current_stock <=
                                        item.min_stock ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-alert-line ml-1"></i>
                                                مخزون منخفض
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                متوفر
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() =>
                                                    setEditingItem(item)
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="حذف"
                                            >
                                                <i className="ri-delete-bin-line text-lg"></i>
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
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصنف</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المخزون</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التكلفة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900">
                                            {item.current_stock} {item.unit}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            حد أدنى: {item.min_stock} {item.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {item.cost_per_unit.toLocaleString()} $/{item.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {item.current_stock <= item.min_stock ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-alert-line ml-1"></i>
                                                منخفض
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                متوفر
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="حذف"
                                            >
                                                <i className="ri-delete-bin-line text-lg"></i>
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
                    {filteredInventory.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                        {item.name}
                                    </h3>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.category}
                                    </span>
                                </div>
                                {item.current_stock <= item.min_stock ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                                        <i className="ri-alert-line ml-1"></i>
                                        منخفض
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                                        <i className="ri-check-line ml-1"></i>
                                        متوفر
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">المخزون الحالي:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{item.current_stock} {item.unit}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الحد الأدنى:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo">{item.min_stock} {item.unit}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">التكلفة:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{item.cost_per_unit.toLocaleString()} $/{item.unit}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">المورد:</span>
                                    <span className="text-sm text-gray-900 mr-2 truncate font-tajawal">{item.supplier}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                    title="تعديل"
                                >
                                    <i className="ri-edit-line text-lg"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="حذف"
                                >
                                    <i className="ri-delete-bin-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredInventory.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-archive-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد أصناف</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="ri-archive-line text-blue-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                إجمالي الأصناف
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {inventory.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="ri-alert-line text-red-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                مخزون منخفض
                            </p>
                            <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-bold text-gray-900 font-cairo">
                                {lowStockItems.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="ri-money-dollar-circle-line text-green-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                قيمة المخزون
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {inventory
                                    .reduce(
                                        (total, item) =>
                                            total +
                                            item.current_stock *
                                                item.cost_per_unit,
                                        0
                                    )
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 lg:p-5 xl:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="ri-truck-line text-purple-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                الموردين
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    new Set(
                                        inventory.map((item) => item.supplier)
                                    ).size
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                {editingItem
                                    ? "تعديل بيانات الصنف"
                                    : "إضافة صنف جديد"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingItem(null);
                                    resetForm();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            {/* الصف الأول: اسم الصنف والفئة */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        اسم الصنف{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            });
                                            if (formErrors.name) {
                                                setFormErrors({
                                                    ...formErrors,
                                                    name: "",
                                                });
                                            }
                                        }}
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                            formErrors.name
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="أدخل اسم الصنف"
                                        required
                                    />
                                    {formErrors.name && (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <i className="ri-error-warning-line"></i>
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        الفئة{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={formData.category}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                category: value,
                                            })
                                        }
                                        options={categoryOptions}
                                        placeholder="اختر الفئة"
                                    />
                                </div>
                            </div>

                            {/* الصف الثاني: المخزون الحالي والحد الأدنى */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        المخزون الحالي{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.current_stock || ""}
                                        onChange={(e) => {
                                            const value =
                                                parseFloat(e.target.value) || 0;
                                            setFormData({
                                                ...formData,
                                                current_stock: value,
                                            });
                                            if (formErrors.current_stock) {
                                                setFormErrors({
                                                    ...formErrors,
                                                    current_stock: "",
                                                });
                                            }
                                        }}
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                            formErrors.current_stock
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    {formErrors.current_stock ? (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <i className="ri-error-warning-line"></i>
                                            {formErrors.current_stock}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            الكمية الحالية المتوفرة من الصنف
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        الحد الأدنى{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.min_stock || ""}
                                        onChange={(e) => {
                                            const value =
                                                parseFloat(e.target.value) || 0;
                                            setFormData({
                                                ...formData,
                                                min_stock: value,
                                            });
                                            if (formErrors.min_stock) {
                                                setFormErrors({
                                                    ...formErrors,
                                                    min_stock: "",
                                                });
                                            }
                                        }}
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                            formErrors.min_stock
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    {formErrors.min_stock ? (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <i className="ri-error-warning-line"></i>
                                            {formErrors.min_stock}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            الحد الأدنى قبل إعادة التموين
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* الصف الثالث: الوحدة والتكلفة */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        الوحدة{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={formData.unit}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                unit: value,
                                            })
                                        }
                                        options={units}
                                        placeholder="اختر الوحدة"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 font-tajawal">
                                        التكلفة لكل وحدة ($){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.cost_per_unit || ""}
                                            onChange={(e) => {
                                                const value =
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0;
                                                setFormData({
                                                    ...formData,
                                                    cost_per_unit: value,
                                                });
                                                if (formErrors.cost_per_unit) {
                                                    setFormErrors({
                                                        ...formErrors,
                                                        cost_per_unit: "",
                                                    });
                                                }
                                            }}
                                            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                                formErrors.cost_per_unit
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-gray-300"
                                            }`}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    {formErrors.cost_per_unit ? (
                                        <p className="text-xs text-red-600 flex items-center gap-1">
                                            <i className="ri-error-warning-line"></i>
                                            {formErrors.cost_per_unit}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-500">
                                            سعر شراء الوحدة الواحدة
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* الصف الرابع: المورد */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    المورد{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.supplier}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            supplier: e.target.value,
                                        });
                                        if (formErrors.supplier) {
                                            setFormErrors({
                                                ...formErrors,
                                                supplier: "",
                                            });
                                        }
                                    }}
                                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                                        formErrors.supplier
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="أدخل اسم المورد أو الشركة الموردة"
                                    rows={2}
                                    required
                                />
                                {formErrors.supplier ? (
                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                        <i className="ri-error-warning-line"></i>
                                        {formErrors.supplier}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        اسم المورد أو الشركة الموردة
                                    </p>
                                )}
                            </div>

                            {/* ملخص المعلومات */}
                            {formData.current_stock > 0 &&
                                formData.cost_per_unit > 0 && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <i className="ri-information-line text-orange-600"></i>
                                            <h4 className="text-sm font-semibold text-orange-900">
                                                ملخص القيمة
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-600">
                                                    قيمة المخزون:
                                                </span>
                                                <span className="mr-2 font-semibold text-gray-900">
                                                    {(
                                                        formData.current_stock *
                                                        formData.cost_per_unit
                                                    ).toLocaleString()}{" "}
                                                    $
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">
                                                    الوحدة:
                                                </span>
                                                <span className="mr-2 font-semibold text-gray-900">
                                                    {formData.unit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* الأزرار */}
                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                        resetForm();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    {editingItem
                                        ? "حفظ التعديلات"
                                        : "إضافة الصنف"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && itemToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="ri-error-warning-line text-2xl sm:text-3xl text-red-500"></i>
                            </div>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-2 font-cairo">
                            تأكيد الحذف
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-2 font-tajawal">
                            هل أنت متأكد من حذف الصنف{" "}
                            <span className="font-semibold text-gray-900">
                                {itemToDelete.name}
                            </span>
                            ؟
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6 font-tajawal">
                            لا يمكن التراجع عن هذه العملية.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
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
}
