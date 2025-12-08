import { useState, useRef } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";

export default function MenuManagement() {
    const [activeTab, setActiveTab] = useState("items");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast, ToastContainer } = useToast();

    const categories = [
        { id: "all", name: "جميع الفئات", count: 45 },
        { id: "appetizers", name: "المقبلات", count: 8 },
        { id: "main", name: "الأطباق الرئيسية", count: 15 },
        { id: "desserts", name: "الحلويات", count: 10 },
        { id: "beverages", name: "المشروبات", count: 12 },
    ];

    const initialMenuItems = [
        {
            id: 1,
            name: "برجر كلاسيك",
            category: "main",
            price: "45.00",
            description: "برجر لحم بقري مع الخس والطماطم والجبن",
            image: "https://readdy.ai/api/search-image?query=Classic%20beef%20burger%20with%20lettuce%20tomato%20cheese%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20clean%20background%2C%20mouth-watering%20burger&width=80&height=80&seq=menu-1&orientation=squarish",
            status: "متاح",
            orders: 156,
            revenue: "7,020 $",
        },
        {
            id: 2,
            name: "سلطة سيزر",
            category: "appetizers",
            price: "32.00",
            description: "سلطة خضراء مع الدجاج المشوي وجبن البارميزان",
            image: "https://readdy.ai/api/search-image?query=Caesar%20salad%20with%20grilled%20chicken%20parmesan%20cheese%20croutons%2C%20fresh%20healthy%20salad%2C%20professional%20food%20photography%2C%20restaurant%20quality%20presentation&width=80&height=80&seq=menu-2&orientation=squarish",
            status: "متاح",
            orders: 89,
            revenue: "2,848 $",
        },
        {
            id: 3,
            name: "بيتزا مارجريتا",
            category: "main",
            price: "55.00",
            description:
                "بيتزا إيطالية كلاسيكية مع الطماطم والموزاريلا والريحان",
            image: "https://readdy.ai/api/search-image?query=Margherita%20pizza%20with%20fresh%20basil%20mozzarella%20tomato%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation&width=80&height=80&seq=menu-3&orientation=squarish",
            status: "غير متاح",
            orders: 67,
            revenue: "3,685 $",
        },
        {
            id: 4,
            name: "تشيز كيك",
            category: "desserts",
            price: "28.00",
            description: "تشيز كيك كريمي مع صوص التوت الأزرق",
            image: "https://readdy.ai/api/search-image?query=Creamy%20cheesecake%20with%20blueberry%20sauce%2C%20professional%20dessert%20photography%2C%20elegant%20presentation%2C%20restaurant%20quality%20dessert%2C%20appetizing%20sweet&width=80&height=80&seq=menu-4&orientation=squarish",
            status: "متاح",
            orders: 45,
            revenue: "1,260 $",
        },
        {
            id: 5,
            name: "عصير برتقال طازج",
            category: "beverages",
            price: "15.00",
            description: "عصير برتقال طبيعي 100% بدون إضافات",
            image: "https://readdy.ai/api/search-image?query=Fresh%20orange%20juice%20in%20glass%2C%20natural%20fruit%20beverage%2C%20professional%20drink%20photography%2C%20refreshing%20citrus%20drink%2C%20restaurant%20quality%20presentation&width=80&height=80&seq=menu-5&orientation=squarish",
            status: "متاح",
            orders: 123,
            revenue: "1,845 $",
        },
    ];

    const [menuItems, setMenuItems] = useState(initialMenuItems);

    const filteredItems =
        selectedCategory === "all"
            ? menuItems
            : menuItems.filter((item) => item.category === selectedCategory);

    const tabs = [
        { id: "items", name: "الأصناف", icon: "ri-restaurant-line" },
        { id: "categories", name: "الفئات", icon: "ri-folder-line" },
        { id: "analytics", name: "التحليلات", icon: "ri-bar-chart-line" },
    ];

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        status: "متاح",
    });
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleEdit = (item: (typeof initialMenuItems)[0]) => {
        setEditingItemId(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            status: item.status,
        });
        setSelectedImage(item.image);
        setShowAddModal(true);
    };

    const handleDeleteClick = (itemId: number) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setMenuItems((prev) =>
                prev.filter((item) => item.id !== itemToDelete)
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.category || !formData.price) {
            showToast("يرجى ملء جميع الحقول المطلوبة", "error");
            return;
        }

        if (editingItemId) {
            // تحديث عنصر موجود
            setMenuItems((prev) =>
                prev.map((item) =>
                    item.id === editingItemId
                        ? {
                              ...item,
                              name: formData.name,
                              category: formData.category,
                              price: parseFloat(formData.price).toFixed(2),
                              description: formData.description,
                              image: selectedImage || item.image,
                              status: formData.status,
                          }
                        : item
                )
            );
            showToast("تم تحديث الصنف بنجاح", "success");
        } else {
            // إضافة عنصر جديد
            const newItem = {
                id: Date.now(),
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price).toFixed(2),
                description: formData.description,
                image:
                    selectedImage ||
                    "https://readdy.ai/api/search-image?query=delicious%20restaurant%20food%20dish%20on%20white%20background%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20clean%20minimal%20background&width=80&height=80&seq=menu-item&orientation=squarish",
                status: formData.status,
                orders: 0,
                revenue: "0.00 $",
            };

            setMenuItems((prev) => [...prev, newItem]);
            showToast("تم إضافة الصنف بنجاح", "success");
        }

        setShowAddModal(false);
        setSelectedImage(null);
        setImageFile(null);
        setEditingItemId(null);
        setFormData({
            name: "",
            category: "",
            price: "",
            description: "",
            status: "متاح",
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        إدارة القائمة
                    </h2>
                    <button
                        onClick={() => {
                            setEditingItemId(null);
                            setFormData({
                                name: "",
                                category: "",
                                price: "",
                                description: "",
                                status: "متاح",
                            });
                            setSelectedImage(null);
                            setImageFile(null);
                            setShowAddModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <i className="ri-add-line ml-2"></i>
                        إضافة صنف جديد
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <i className={`${tab.icon} ml-2`}></i>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === "items" && (
                    <div className="space-y-6">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                        selectedCategory === category.id
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category.name} ({category.count})
                                </button>
                            ))}
                        </div>

                        {/* Menu Items */}
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
                                                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <CustomSelect
                                            options={[
                                                {
                                                    value: "popular",
                                                    label: "الأكثر طلباً",
                                                },
                                                {
                                                    value: "price-high",
                                                    label: "الأعلى سعراً",
                                                },
                                                {
                                                    value: "price-low",
                                                    label: "الأقل سعراً",
                                                },
                                            ]}
                                            placeholder="ترتيب حسب"
                                            className="w-48"
                                        />
                                    </div>
                                </div>

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
                                                    الطلبات
                                                </th>
                                                <th className="text-right py-3 px-4 font-medium text-gray-900">
                                                    الإيرادات
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
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover object-top ml-3"
                                                            />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                            {
                                                                categories.find(
                                                                    (c) =>
                                                                        c.id ===
                                                                        item.category
                                                                )?.name
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-medium text-gray-900">
                                                        {item.price} $
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600">
                                                        {item.orders}
                                                    </td>
                                                    <td className="py-4 px-4 font-medium text-gray-900">
                                                        {item.revenue}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span
                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                                item.status ===
                                                                "متاح"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item
                                                                    )
                                                                }
                                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                                title="تعديل"
                                                            >
                                                                <i className="ri-edit-line"></i>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        item.id
                                                                    )
                                                                }
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
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                إدارة الفئات
                            </h3>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer">
                                <i className="ri-add-line ml-1"></i>
                                إضافة فئة
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories
                                .filter((c) => c.id !== "all")
                                .map((category) => (
                                    <div
                                        key={category.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">
                                                {category.name}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {category.count} صنف
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                نشط
                                            </span>
                                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        إجمالي الأصناف
                                    </h3>
                                    <i className="ri-restaurant-line text-2xl text-orange-500"></i>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    45
                                </p>
                                <p className="text-sm text-green-600">
                                    +3 هذا الشهر
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        متوسط السعر
                                    </h3>
                                    <i className="ri-money-dollar-circle-line text-2xl text-green-500"></i>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">
                                    42.50 $
                                </p>
                                <p className="text-sm text-blue-600">
                                    +5% من الشهر الماضي
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        الأكثر طلباً
                                    </h3>
                                    <i className="ri-fire-line text-2xl text-red-500"></i>
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                    برجر كلاسيك
                                </p>
                                <p className="text-sm text-gray-600">
                                    156 طلب هذا الشهر
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                أداء الفئات
                            </h3>
                            <div className="space-y-4">
                                {categories
                                    .filter((c) => c.id !== "all")
                                    .map((category, index) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className="w-4 h-4 bg-orange-500 rounded-full ml-3"
                                                    style={{
                                                        backgroundColor: [
                                                            "#f97316",
                                                            "#3b82f6",
                                                            "#10b981",
                                                            "#8b5cf6",
                                                        ][index],
                                                    }}
                                                ></div>
                                                <span className="font-medium text-gray-900">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600">
                                                    {category.count} صنف
                                                </span>
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                (category.count /
                                                                    15) *
                                                                100
                                                            }%`,
                                                            backgroundColor: [
                                                                "#f97316",
                                                                "#3b82f6",
                                                                "#10b981",
                                                                "#8b5cf6",
                                                            ][index],
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {Math.round(
                                                        (category.count / 45) *
                                                            100
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Item Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div
                            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar-left"
                            dir="rtl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingItemId
                                        ? "تعديل الصنف"
                                        : "إضافة صنف جديد"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedImage(null);
                                        setImageFile(null);
                                        setEditingItemId(null);
                                        setFormData({
                                            name: "",
                                            category: "",
                                            price: "",
                                            description: "",
                                            status: "متاح",
                                        });
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الفئة *
                                        </label>
                                        <CustomSelect
                                            options={[
                                                {
                                                    value: "appetizers",
                                                    label: "المقبلات",
                                                },
                                                {
                                                    value: "main",
                                                    label: "الأطباق الرئيسية",
                                                },
                                                {
                                                    value: "desserts",
                                                    label: "الحلويات",
                                                },
                                                {
                                                    value: "beverages",
                                                    label: "المشروبات",
                                                },
                                            ]}
                                            value={formData.category}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    category: value,
                                                })
                                            }
                                            placeholder="اختر الفئة"
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اسم الصنف *
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
                                            placeholder="أدخل اسم الصنف"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الوصف
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[80px] max-h-[80px]"
                                        placeholder="أدخل وصف الصنف"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            السعر ($) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    price: e.target.value,
                                                })
                                            }
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الحالة
                                        </label>
                                        <CustomSelect
                                            options={[
                                                {
                                                    value: "متاح",
                                                    label: "متاح",
                                                },
                                                {
                                                    value: "غير متاح",
                                                    label: "غير متاح",
                                                },
                                            ]}
                                            value={formData.status}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    status: value,
                                                })
                                            }
                                            placeholder="اختر الحالة"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        صورة الصنف
                                    </label>
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const file =
                                                e.dataTransfer.files[0];
                                            if (
                                                file &&
                                                file.type.startsWith("image/")
                                            ) {
                                                if (
                                                    file.size >
                                                    5 * 1024 * 1024
                                                ) {
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
                                                        if (
                                                            fileInputRef.current
                                                        ) {
                                                            fileInputRef.current.value =
                                                                "";
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
                                                    اسحب الصورة هنا أو اضغط
                                                    للاختيار
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
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    if (
                                                        file.size >
                                                        5 * 1024 * 1024
                                                    ) {
                                                        showToast(
                                                            "حجم الصورة يجب أن يكون أقل من 5MB",
                                                            "error"
                                                        );
                                                        return;
                                                    }
                                                    if (
                                                        !file.type.startsWith(
                                                            "image/"
                                                        )
                                                    ) {
                                                        showToast(
                                                            "يرجى اختيار ملف صورة صحيح",
                                                            "error"
                                                        );
                                                        return;
                                                    }
                                                    setImageFile(file);
                                                    const reader =
                                                        new FileReader();
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
                                            {(imageFile.size / 1024).toFixed(2)}{" "}
                                            KB)
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        إضافة الصنف
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
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
                            <p className="text-gray-600 text-center mb-6">
                                هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع
                                عن هذه العملية.
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
            </div>
        </>
    );
}
