import { useState, useEffect, useRef } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";
import { formatCurrency } from "../../../../utils/currency";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    is_available: boolean;
    preparation_time: number;
}

interface MenuCategory {
    id: string;
    name: string;
    display_order: number;
}

interface MenuItemsProps {
    restaurantId: string;
}

// بيانات محاكاة للفئات
const generateMockCategories = (): MenuCategory[] => {
    return [
        { id: "cat-1", name: "الأطباق الرئيسية", display_order: 1 },
        { id: "cat-2", name: "المشروبات", display_order: 2 },
        { id: "cat-3", name: "الحلويات", display_order: 3 },
        { id: "cat-4", name: "المقبلات", display_order: 4 },
    ];
};

// بيانات محاكاة لعناصر القائمة
const generateMockMenuItems = (): MenuItem[] => {
    return [
        {
            id: "item-1",
            name: "برجر كلاسيك",
            description: "برجر لحم طازج مع خضار طازجة وصلصة خاصة",
            price: 45.0,
            image_url:
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80",
            category_id: "cat-1",
            is_available: true,
            preparation_time: 15,
        },
        {
            id: "item-2",
            name: "بيتزا مارجريتا",
            description: "بيتزا إيطالية تقليدية مع جبن موتزاريلا وطماطم طازجة",
            price: 55.0,
            image_url:
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&q=80",
            category_id: "cat-1",
            is_available: true,
            preparation_time: 20,
        },
        {
            id: "item-3",
            name: "سلطة سيزر",
            description: "سلطة طازجة مع دجاج مشوي وصلصة سيزر",
            price: 35.0,
            image_url:
                "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80",
            category_id: "cat-4",
            is_available: true,
            preparation_time: 10,
        },
        {
            id: "item-4",
            name: "مشروب برتقال طازج",
            description: "عصير برتقال طبيعي 100%",
            price: 15.0,
            image_url:
                "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&q=80",
            category_id: "cat-2",
            is_available: true,
            preparation_time: 5,
        },
        {
            id: "item-5",
            name: "تشيز كيك",
            description: "تشيز كيك كريمي مع طبقة توت طازج",
            price: 30.0,
            image_url:
                "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop&q=80",
            category_id: "cat-3",
            is_available: true,
            preparation_time: 0,
        },
        {
            id: "item-6",
            name: "ستيك مشوي",
            description: "ستيك لحم بقري مشوي مع خضار مشكلة",
            price: 120.0,
            image_url:
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&q=80",
            category_id: "cat-1",
            is_available: false,
            preparation_time: 25,
        },
    ];
};

const MenuItems = ({ restaurantId }: MenuItemsProps) => {
    const { showToast, ToastContainer } = useToast();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

    useEffect(() => {
        fetchData();
    }, [restaurantId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockCategories = generateMockCategories();
            const mockMenuItems = generateMockMenuItems();
            setCategories(mockCategories);
            setMenuItems(mockMenuItems);
        } catch (error) {
            console.error("خطأ في جلب البيانات:", error);
            showToast("حدث خطأ في جلب البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleItemAvailability = (itemId: string, isAvailable: boolean) => {
        setMenuItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? { ...item, is_available: !isAvailable }
                    : item
            )
        );
        showToast(
            isAvailable ? "تم إيقاف العنصر" : "تم تفعيل العنصر",
            "success"
        );
    };

    const handleSaveItem = (itemData: any) => {
        try {
            if (editingItem) {
                setMenuItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === editingItem.id
                            ? { ...item, ...itemData }
                            : item
                    )
                );
                showToast("تم تحديث العنصر بنجاح", "success");
            } else {
                const newItem: MenuItem = {
                    id: `item-${Date.now()}`,
                    ...itemData,
                    is_available: true,
                };
                setMenuItems((prevItems) => [...prevItems, newItem]);
                showToast("تم إضافة العنصر بنجاح", "success");
            }
            setShowAddModal(false);
            setEditingItem(null);
        } catch (error) {
            console.error("Error saving item:", error);
            showToast("حدث خطأ في حفظ العنصر", "error");
        }
    };

    const handleDeleteItem = () => {
        if (itemToDelete) {
            setMenuItems((prevItems) =>
                prevItems.filter((item) => item.id !== itemToDelete.id)
            );
            showToast("تم حذف العنصر بنجاح", "success");
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const filteredItems = menuItems.filter((item) => {
        const matchesCategory =
            selectedCategory === "all" || item.category_id === selectedCategory;
        const matchesSearch =
            searchTerm === "" ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.name || "غير محدد";
    };

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
    }));

    if (loading && menuItems.length === 0) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل القائمة..." />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة عناصر المنيو
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowAddModal(true);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                    <i className="ri-add-line ml-2"></i>
                    إضافة عنصر جديد
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        selectedCategory === "all"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    جميع العناصر ({menuItems.length})
                </button>
                {categories.map((category) => {
                    const count = menuItems.filter(
                        (item) => item.category_id === category.id
                    ).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                selectedCategory === category.id
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {category.name} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            الأصناف ({filteredItems.length})
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                <input
                                    type="text"
                                    placeholder="البحث في الأصناف..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12">
                            <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                لا توجد عناصر
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || selectedCategory !== "all"
                                    ? "لا توجد عناصر تطابق معايير البحث"
                                    : "ابدأ بإضافة عناصر جديدة إلى المنيو"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            الصنف
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            الفئة
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            السعر
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            وقت التحضير
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            الحالة
                                        </th>
                                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                                            الإجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden ml-3 flex-shrink-0 bg-gray-100">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target =
                                                                    e.target as HTMLImageElement;
                                                                target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop&q=80`;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 truncate max-w-xs">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                    {getCategoryName(
                                                        item.category_id
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-medium text-gray-900">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">
                                                {item.preparation_time} دقيقة
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                        item.is_available
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.is_available
                                                        ? "متاح"
                                                        : "غير متاح"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingItem(
                                                                item
                                                            );
                                                            setShowAddModal(
                                                                true
                                                            );
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                        title="تعديل"
                                                    >
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            toggleItemAvailability(
                                                                item.id,
                                                                item.is_available
                                                            )
                                                        }
                                                        className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
                                                            item.is_available
                                                                ? "text-gray-400 hover:text-yellow-500"
                                                                : "text-gray-400 hover:text-green-500"
                                                        }`}
                                                        title={
                                                            item.is_available
                                                                ? "إيقاف"
                                                                : "تفعيل"
                                                        }
                                                    >
                                                        <i
                                                            className={`${
                                                                item.is_available
                                                                    ? "ri-pause-line"
                                                                    : "ri-play-line"
                                                            }`}
                                                        ></i>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(
                                                                item
                                                            );
                                                            setShowDeleteConfirm(
                                                                true
                                                            );
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                        title="حذف"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            {showAddModal && (
                <MenuItemModal
                    item={editingItem}
                    categories={categoryOptions}
                    onSave={handleSaveItem}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingItem(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && itemToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                تأكيد الحذف
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setItemToDelete(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <p className="text-gray-700 mb-6">
                            هل أنت متأكد من حذف العنصر "{itemToDelete.name}"؟ لا
                            يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setItemToDelete(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteItem}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
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

// Menu Item Modal Component
interface MenuItemModalProps {
    item: MenuItem | null;
    categories: { value: string; label: string }[];
    onSave: (itemData: any) => void;
    onClose: () => void;
}

const MenuItemModal = ({
    item,
    categories,
    onSave,
    onClose,
}: MenuItemModalProps) => {
    const [formData, setFormData] = useState({
        name: item?.name || "",
        description: item?.description || "",
        price: item?.price || 0,
        image_url: item?.image_url || "",
        category_id: item?.category_id || categories[0]?.value || "",
        preparation_time: item?.preparation_time || 0,
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(
        item?.image_url || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                image_url: item.image_url,
                category_id: item.category_id,
                preparation_time: item.preparation_time,
            });
            setSelectedImage(item.image_url);
        } else {
            setFormData({
                name: "",
                description: "",
                price: 0,
                image_url: "",
                category_id: categories[0]?.value || "",
                preparation_time: 0,
            });
            setSelectedImage(null);
        }
        setImageFile(null);
    }, [item, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.category_id) {
            showToast("يرجى ملء جميع الحقول المطلوبة", "error");
            return;
        }
        onSave({
            ...formData,
            image_url: selectedImage || formData.image_url || "",
        });
        setSelectedImage(null);
        setImageFile(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {item ? "تعديل العنصر" : "إضافة عنصر جديد"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                اسم العنصر *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الفئة *
                            </label>
                            <CustomSelect
                                options={categories}
                                value={formData.category_id}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        category_id: value,
                                    })
                                }
                                placeholder="اختر الفئة"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الوصف
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            placeholder="أدخل وصف العنصر"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                السعر ($) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                وقت التحضير (دقيقة)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.preparation_time}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        preparation_time:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            صورة العنصر
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files[0];
                                if (file && file.type.startsWith("image/")) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        showToast(
                                            "حجم الصورة يجب أن يكون أقل من 5MB",
                                            "error"
                                        );
                                        return;
                                    }
                                    setImageFile(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setSelectedImage(
                                            reader.result as string
                                        );
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    showToast(
                                        "يرجى اختيار ملف صورة صحيح",
                                        "error"
                                    );
                                }
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                        >
                            {selectedImage ? (
                                <div className="space-y-3">
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg mx-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(null);
                                            setImageFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        <i className="ri-delete-bin-line ml-1"></i>
                                        حذف الصورة
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <i className="ri-image-line text-3xl text-gray-400 mb-2"></i>
                                    <p className="text-gray-600 mb-2">
                                        اسحب الصورة هنا أو اضغط للاختيار
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF حتى 5MB
                                    </p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) {
                                            showToast(
                                                "حجم الصورة يجب أن يكون أقل من 5MB",
                                                "error"
                                            );
                                            return;
                                        }
                                        if (!file.type.startsWith("image/")) {
                                            showToast(
                                                "يرجى اختيار ملف صورة صحيح",
                                                "error"
                                            );
                                            return;
                                        }
                                        setImageFile(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setSelectedImage(
                                                reader.result as string
                                            );
                                            showToast(
                                                "تم اختيار الصورة بنجاح",
                                                "success"
                                            );
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        {selectedImage && imageFile && (
                            <p className="text-xs text-gray-500 mt-2">
                                <i className="ri-check-line ml-1 text-green-500"></i>
                                تم اختيار الصورة: {imageFile.name} (
                                {(imageFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                        >
                            {item ? "حفظ التعديلات" : "إضافة العنصر"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuItems;
