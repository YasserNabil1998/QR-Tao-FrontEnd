import { useState, useEffect, useRef } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";

// Image component with fallback
interface ImageWithFallbackProps {
    src?: string;
    alt: string;
    className?: string;
}

const ImageWithFallback = ({ src, alt, className }: ImageWithFallbackProps) => {
    const [imgSrc, setImgSrc] = useState<string>(src || "");
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src || "");
        setHasError(false);
    }, [src]);

    const defaultImage = `https://readdy.ai/api/search-image?query=${encodeURIComponent(
        alt +
            " food dish, professional food photography, appetizing presentation, clean minimal background"
    )}&width=400&height=300&seq=${Date.now()}&orientation=landscape`;

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(defaultImage);
        } else {
            // If default image also fails, show placeholder
            setImgSrc("");
        }
    };

    if (!imgSrc && hasError) {
        return (
            <div
                className={`${className} bg-gray-100 flex items-center justify-center`}
            >
                <i className="ri-image-line text-4xl text-gray-400"></i>
            </div>
        );
    }

    return (
        <img
            src={imgSrc || defaultImage}
            alt={alt}
            className={className}
            onError={handleError}
            loading="lazy"
        />
    );
};

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

const MenuItems = ({ restaurantId }: MenuItemsProps) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const { showToast, ToastContainer } = useToast();

    // Mock data for demonstration
    const mockCategories = [
        { id: "cat-1", name: "الأطباق الرئيسية", display_order: 1 },
        { id: "cat-2", name: "المشروبات", display_order: 2 },
        { id: "cat-3", name: "الحلويات", display_order: 3 },
        { id: "cat-4", name: "المقبلات", display_order: 4 },
    ];

    const mockMenuItems = [
        {
            id: "item-1",
            name: "برجر كلاسيك",
            description: "برجر لحم طازج مع خضار طازجة وصلصة خاصة",
            price: 45,
            image_url:
                "https://readdy.ai/api/search-image?query=Classic%20beef%20burger%20with%20lettuce%20tomato%20cheese%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20clean%20background%2C%20mouth-watering%20burger&width=400&height=300&seq=menu-1&orientation=landscape",
            category_id: "cat-1",
            is_available: true,
            preparation_time: 15,
        },
        {
            id: "item-2",
            name: "بيتزا مارجريتا",
            description: "بيتزا إيطالية تقليدية مع جبن موتزاريلا وطماطم طازجة",
            price: 55,
            image_url:
                "https://readdy.ai/api/search-image?query=Margherita%20pizza%20with%20fresh%20basil%20mozzarella%20tomato%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation%2C%20appetizing%20pizza&width=400&height=300&seq=menu-2&orientation=landscape",
            category_id: "cat-1",
            is_available: true,
            preparation_time: 20,
        },
        {
            id: "item-3",
            name: "سلطة سيزر",
            description: "سلطة طازجة مع دجاج مشوي وصلصة سيزر",
            price: 35,
            image_url:
                "https://readdy.ai/api/search-image?query=Caesar%20salad%20with%20croutons%20parmesan%20cheese%20lettuce%2C%20fresh%20healthy%20salad%2C%20professional%20food%20photography%2C%20restaurant%20quality%20presentation%2C%20appetizing%20salad&width=400&height=300&seq=menu-3&orientation=landscape",
            category_id: "cat-4",
            is_available: true,
            preparation_time: 10,
        },
        {
            id: "item-4",
            name: "مشروب برتقال طازج",
            description: "عصير برتقال طبيعي 100%",
            price: 15,
            image_url:
                "https://readdy.ai/api/search-image?query=Fresh%20orange%20juice%20in%20glass%2C%20natural%20citrus%20drink%2C%20healthy%20beverage%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality&width=400&height=300&seq=menu-4&orientation=landscape",
            category_id: "cat-2",
            is_available: true,
            preparation_time: 5,
        },
        {
            id: "item-5",
            name: "تشيز كيك",
            description: "تشيز كيك كريمي مع طبقة توت طازج",
            price: 30,
            image_url:
                "https://readdy.ai/api/search-image?query=Cheesecake%20with%20fresh%20berries%20cream%20dessert%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20delicious%20sweet%20dessert&width=400&height=300&seq=menu-5&orientation=landscape",
            category_id: "cat-3",
            is_available: true,
            preparation_time: 0,
        },
        {
            id: "item-6",
            name: "ستيك مشوي",
            description: "ستيك لحم بقري مشوي مع خضار مشكلة",
            price: 120,
            image_url:
                "https://readdy.ai/api/search-image?query=Grilled%20steak%20with%20vegetables%2C%20professional%20food%20photography%2C%20restaurant%20quality%20meat%2C%20appetizing%20presentation%2C%20fine%20dining%2C%20cooked%20beef%20steak&width=400&height=300&seq=menu-6&orientation=landscape",
            category_id: "cat-1",
            is_available: false,
            preparation_time: 25,
        },
    ];

    useEffect(() => {
        // Use mock data for demonstration
        setTimeout(() => {
            setCategories(mockCategories);
            setMenuItems(mockMenuItems);
            setLoading(false);
        }, 500);
    }, [restaurantId]);

    const toggleItemAvailability = async (
        itemId: string,
        isAvailable: boolean
    ) => {
        try {
            // Update in mock data
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
        } catch (error) {
            console.error("Error updating item availability:", error);
            showToast("حدث خطأ في تحديث حالة العنصر", "error");
        }
    };

    const handleSaveItem = (itemData: any) => {
        try {
            if (editingItem) {
                // Update existing item
                setMenuItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === editingItem.id
                            ? { ...item, ...itemData }
                            : item
                    )
                );
                showToast("تم تحديث العنصر بنجاح", "success");
            } else {
                // Add new item
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

    const filteredItems =
        selectedCategory === "all"
            ? menuItems
            : menuItems.filter((item) => item.category_id === selectedCategory);

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.name || "غير محدد";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة عناصر المنيو
                </h2>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setShowAddModal(true);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 space-x-reverse whitespace-nowrap"
                >
                    <i className="ri-add-line"></i>
                    <span>إضافة عنصر جديد</span>
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        selectedCategory === "all"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    جميع العناصر
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                            selectedCategory === category.id
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Menu Items Grid */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                    <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد عناصر في المنيو
                    </h3>
                    <p className="text-gray-500">
                        ابدأ بإضافة عناصر جديدة إلى المنيو
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                        >
                            <div className="relative">
                                <ImageWithFallback
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-48 object-cover object-top"
                                />
                                <div className="absolute top-2 right-2">
                                    <button
                                        onClick={() =>
                                            toggleItemAvailability(
                                                item.id,
                                                item.is_available
                                            )
                                        }
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.is_available
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {item.is_available
                                            ? "متوفر"
                                            : "غير متوفر"}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        {item.name}
                                    </h3>
                                    <span className="font-bold text-orange-600">
                                        {item.price} ر.س
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span>
                                        الفئة:{" "}
                                        {getCategoryName(item.category_id)}
                                    </span>
                                    <span>
                                        وقت التحضير: {item.preparation_time}{" "}
                                        دقيقة
                                    </span>
                                </div>

                                <div className="flex space-x-2 space-x-reverse">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setShowAddModal(true);
                                        }}
                                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        onClick={() =>
                                            toggleItemAvailability(
                                                item.id,
                                                item.is_available
                                            )
                                        }
                                        className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap ${
                                            item.is_available
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                        }`}
                                    >
                                        {item.is_available ? "إيقاف" : "تفعيل"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Item Modal */}
            {showAddModal && (
                <MenuItemModal
                    item={editingItem}
                    categories={categories}
                    onSave={handleSaveItem}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingItem(null);
                    }}
                />
            )}

            <ToastContainer />
        </div>
    );
};

// Menu Item Modal Component
interface MenuItemModalProps {
    item: MenuItem | null;
    categories: MenuCategory[];
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
        category_id: item?.category_id || categories[0]?.id || "",
        preparation_time: item?.preparation_time || 0,
    });
    const [selectedImage, setSelectedImage] = useState<string | null>(
        item?.image_url || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast, ToastContainer: ModalToastContainer } = useToast();

    useEffect(() => {
        if (item?.image_url) {
            setSelectedImage(item.image_url);
        } else {
            setSelectedImage(null);
        }
        setImageFile(null);
    }, [item]);

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
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar-left"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {item ? "تعديل العنصر" : "إضافة عنصر جديد"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الفئة *
                            </label>
                            <CustomSelect
                                options={categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                }))}
                                value={formData.category_id}
                                onChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        category_id: value,
                                    })
                                }
                                placeholder="اختر الفئة"
                                className="w-full"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[80px] max-h-[80px]"
                            placeholder="أدخل وصف العنصر"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                السعر (ر.س) *
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                            onDragEnter={(e) => {
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

                    <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                        >
                            {item ? "حفظ التعديلات" : "إضافة العنصر"}
                        </button>
                    </div>
                </form>
                <ModalToastContainer />
            </div>
        </div>
    );
};

export default MenuItems;
