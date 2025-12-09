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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة المخزون
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                    <i className="ri-add-line ml-2"></i>
                    إضافة صنف جديد
                </button>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <i className="ri-alert-line text-red-500 text-xl ml-3"></i>
                        <div>
                            <h3 className="text-red-800 font-semibold">
                                تنبيه: مخزون منخفض
                            </h3>
                            <p className="text-red-600">
                                {lowStockItems.length} صنف يحتاج إعادة تموين
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:w-2/3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            البحث
                        </label>
                        <div className="relative">
                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث عن صنف..."
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الفئة
                        </label>
                        <CustomSelect
                            value={filterCategory}
                            onChange={(value) => setFilterCategory(value)}
                            options={categories}
                            placeholder="اختر الفئة"
                        />
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
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
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="ri-archive-line text-blue-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الأصناف
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {inventory.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="ri-alert-line text-red-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                مخزون منخفض
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {lowStockItems.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="ri-money-dollar-circle-line text-green-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
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

                <div className="bg-white rounded-lg shadow-sm p-6">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* الصف الأول: اسم الصنف والفئة */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
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
                                    <label className="block text-sm font-medium text-gray-700">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
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
                                    <label className="block text-sm font-medium text-gray-700">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
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
                                    <label className="block text-sm font-medium text-gray-700">
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
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer font-medium text-sm"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium text-sm shadow-sm hover:shadow"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <i className="ri-error-warning-line text-3xl text-red-500"></i>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            تأكيد الحذف
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            هل أنت متأكد من حذف الصنف{" "}
                            <span className="font-semibold">
                                {itemToDelete.name}
                            </span>
                            ؟
                        </p>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            لا يمكن التراجع عن هذه العملية.
                        </p>
                        <div className="flex justify-start gap-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
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
