import { useState, useRef, useMemo } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";

interface Category {
    id: string;
    name: string;
    isActive: boolean;
}

export default function MenuManagement() {
    const [activeTab, setActiveTab] = useState("items");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast, ToastContainer } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    // دالة لمعالجة أخطاء الصور
    const handleImageError = (itemId: number) => {
        setImageErrors((prev) => new Set(prev).add(itemId));
    };

    // دالة للحصول على صورة بديلة
    const getImageUrl = (item: typeof initialMenuItems[0]) => {
        if (imageErrors.has(item.id) || !item.image) {
            // استخدام Unsplash كصورة بديلة
            const foodImages = {
                main: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=80",
                appetizers: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80",
                desserts: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop&q=80",
                beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop&q=80",
            };
            return foodImages[item.category as keyof typeof foodImages] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80";
        }
        return item.image;
    };

    const [categories, setCategories] = useState<Category[]>([
        { id: "appetizers", name: "المقبلات", isActive: true },
        { id: "main", name: "الأطباق الرئيسية", isActive: true },
        { id: "desserts", name: "الحلويات", isActive: true },
        { id: "beverages", name: "المشروبات", isActive: true },
    ]);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: "",
        isActive: true,
    });

    const initialMenuItems = [
        {
            id: 1,
            name: "برجر كلاسيك",
            category: "main",
            price: "45.00",
            description: "برجر لحم بقري مع الخس والطماطم والجبن",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&q=80",
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
            image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop&q=80",
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
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop&q=80",
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
            image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=200&h=200&fit=crop&q=80",
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
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop&q=80",
            status: "متاح",
            orders: 123,
            revenue: "1,845 $",
        },
    ];

    const [menuItems, setMenuItems] = useState(initialMenuItems);

    // حساب عدد الأصناف لكل فئة ديناميكياً
    const categoriesWithCount = useMemo(() => {
        const allCount = menuItems.length;
        const categoryCounts = categories.map((cat) => ({
            ...cat,
            count: menuItems.filter((item) => item.category === cat.id).length,
        }));
        return [
            { id: "all", name: "جميع الفئات", count: allCount, isActive: true },
            ...categoryCounts,
        ];
    }, [menuItems, categories]);

    // فلترة وترتيب الأصناف
    const filteredItems = useMemo(() => {
        let filtered = menuItems;

        // فلترة حسب الفئة
        if (selectedCategory !== "all") {
            filtered = filtered.filter((item) => item.category === selectedCategory);
        }

        // فلترة حسب البحث
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // ترتيب
        if (sortBy === "popular") {
            filtered = [...filtered].sort((a, b) => b.orders - a.orders);
        } else if (sortBy === "price-high") {
            filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === "price-low") {
            filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }

        return filtered;
    }, [menuItems, selectedCategory, searchTerm, sortBy]);

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
        // استخدام الصورة الصحيحة مع معالجة الأخطاء
        const imageUrl = getImageUrl(item);
        setSelectedImage(imageUrl);
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

    // وظائف إدارة الفئات
    const handleAddCategory = () => {
        setEditingCategoryId(null);
        setCategoryFormData({ name: "", isActive: true });
        setShowCategoryModal(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        setCategoryFormData({ name: category.name, isActive: category.isActive });
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (categoryId: string) => {
        const itemsInCategory = menuItems.filter((item) => item.category === categoryId);
        if (itemsInCategory.length > 0) {
            showToast("لا يمكن حذف الفئة لأنها تحتوي على أصناف", "error");
            return;
        }
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        showToast("تم حذف الفئة بنجاح", "success");
    };

    const handleToggleCategoryStatus = (categoryId: string) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
            )
        );
        showToast("تم تحديث حالة الفئة بنجاح", "success");
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryFormData.name.trim()) {
            showToast("يرجى إدخال اسم الفئة", "error");
            return;
        }

        if (editingCategoryId) {
            // تحديث فئة موجودة
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === editingCategoryId
                        ? { ...cat, name: categoryFormData.name, isActive: categoryFormData.isActive }
                        : cat
                )
            );
            // تحديث أصناف هذه الفئة
            setMenuItems((prev) =>
                prev.map((item) =>
                    item.category === editingCategoryId
                        ? { ...item, category: editingCategoryId }
                        : item
                )
            );
            showToast("تم تحديث الفئة بنجاح", "success");
        } else {
            // إضافة فئة جديدة
            const newCategoryId = categoryFormData.name.toLowerCase().replace(/\s+/g, "-");
            if (categories.find((cat) => cat.id === newCategoryId)) {
                showToast("هذه الفئة موجودة بالفعل", "error");
                return;
            }
            setCategories((prev) => [
                ...prev,
                {
                    id: newCategoryId,
                    name: categoryFormData.name,
                    isActive: categoryFormData.isActive,
                },
            ]);
            showToast("تم إضافة الفئة بنجاح", "success");
        }
        setShowCategoryModal(false);
        setCategoryFormData({ name: "", isActive: true });
        setEditingCategoryId(null);
    };

    // حساب بيانات التحليلات ديناميكياً
    const analyticsData = useMemo(() => {
        const totalItems = menuItems.length;
        const totalPrice = menuItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
        const avgPrice = totalItems > 0 ? totalPrice / totalItems : 0;
        const mostOrdered = menuItems.reduce(
            (max, item) => (item.orders > max.orders ? item : max),
            menuItems[0] || { name: "لا يوجد", orders: 0 }
        );
        const categoryStats = categories.map((cat) => {
            const itemsInCategory = menuItems.filter((item) => item.category === cat.id);
            const totalOrders = itemsInCategory.reduce((sum, item) => sum + item.orders, 0);
            const totalRevenue = itemsInCategory.reduce(
                (sum, item) => sum + parseFloat(item.revenue.replace(/[^0-9.]/g, "")),
                0
            );
            return {
                ...cat,
                count: itemsInCategory.length,
                totalOrders,
                totalRevenue,
            };
        });

        return {
            totalItems,
            avgPrice,
            mostOrdered,
            categoryStats,
        };
    }, [menuItems, categories]);

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
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&q=80",
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
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
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
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                    >
                        <i className="ri-add-line"></i>
                        <span className="text-sm sm:text-base">إضافة صنف جديد</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 overflow-x-auto">
                    <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <i className={`${tab.icon} ml-1 sm:ml-2 text-base sm:text-lg`}></i>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === "items" && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categoriesWithCount.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
                            <div className="p-3 sm:p-4 md:p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 font-cairo">
                                        الأصناف ({filteredItems.length})
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                        <div className="relative flex-1 sm:flex-initial">
                                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                            <input
                                                type="text"
                                                placeholder="البحث في الأصناف..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full sm:w-auto pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div className="w-full sm:w-48">
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
                                                value={sortBy}
                                                onChange={(value) => setSortBy(value)}
                                                placeholder="ترتيب حسب"
                                                className="w-full sm:w-48"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Table (XL and above) */}
                                <div className="hidden xl:block overflow-x-auto">
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
                                                            <div className="relative w-12 h-12 ml-3 flex-shrink-0">
                                                                <img
                                                                    src={getImageUrl(item)}
                                                                    alt={item.name}
                                                                    onError={() => handleImageError(item.id)}
                                                                    className="w-12 h-12 rounded-lg object-cover"
                                                                />
                                                                {imageErrors.has(item.id) && (
                                                                    <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                        <i className="ri-image-line text-gray-400 text-lg"></i>
                                                                    </div>
                                                                )}
                                                            </div>
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
                                                                )?.name || item.category
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

                                {/* Tablet Table (MD to LG) */}
                                <div className="hidden md:block xl:hidden overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-right py-3 px-3 font-medium text-gray-900">الصنف</th>
                                                <th className="text-right py-3 px-3 font-medium text-gray-900">الفئة</th>
                                                <th className="text-right py-3 px-3 font-medium text-gray-900">السعر</th>
                                                <th className="text-right py-3 px-3 font-medium text-gray-900">الحالة</th>
                                                <th className="text-right py-3 px-3 font-medium text-gray-900">الإجراءات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredItems.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center">
                                                            <div className="relative w-10 h-10 ml-2 flex-shrink-0">
                                                                <img
                                                                    src={getImageUrl(item)}
                                                                    alt={item.name}
                                                                    onError={() => handleImageError(item.id)}
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                                {item.status === "غير متاح" && (
                                                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-gray-900 truncate text-sm">{item.name}</div>
                                                                <div className="text-xs text-gray-500 truncate">{item.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3 text-sm text-gray-600">
                                                        {categories.find(c => c.id === item.category)?.name || item.category}
                                                    </td>
                                                    <td className="py-3 px-3 text-sm font-semibold text-orange-500">
                                                        {item.price} $
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                item.status === "متاح"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer rounded-lg hover:bg-blue-50"
                                                                title="تعديل"
                                                            >
                                                                <i className="ri-pencil-line text-lg"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(item.id)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
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
                                <div className="md:hidden space-y-4">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(item)}
                                                        alt={item.name}
                                                        onError={() => handleImageError(item.id)}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    {item.status === "غير متاح" && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-xs font-medium">غير متاح</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 truncate font-cairo">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 font-tajawal">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs sm:text-sm text-gray-500 font-tajawal">
                                                            {categories.find(c => c.id === item.category)?.name || item.category}
                                                        </span>
                                                        <span className="text-lg sm:text-xl font-bold text-orange-500 font-cairo">
                                                            {item.price} $
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 mb-3">
                                                <div>
                                                    <span className="text-xs text-gray-600 font-tajawal">الطلبات:</span>
                                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{item.orders}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-600 font-tajawal">الإيرادات:</span>
                                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{item.revenue}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                        item.status === "متاح"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer rounded-lg hover:bg-blue-50"
                                                        title="تعديل"
                                                    >
                                                        <i className="ri-pencil-line text-lg"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                                                        title="حذف"
                                                    >
                                                        <i className="ri-delete-bin-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <div className="p-8 text-center text-gray-500">
                                            <i className="ri-inbox-line text-4xl mb-2"></i>
                                            <p className="font-tajawal">لا توجد أصناف</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "categories" && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                إدارة الفئات
                            </h3>
                            <button
                                onClick={handleAddCategory}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                            >
                                <i className="ri-add-line ml-1"></i>
                                إضافة فئة
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {categories.map((category) => {
                                const categoryCount = menuItems.filter(
                                    (item) => item.category === category.id
                                ).length;
                                return (
                                    <div
                                        key={category.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-900">
                                                {category.name}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditCategory(category)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                    title="تعديل"
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="حذف"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {categoryCount} صنف
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                {category.isActive ? "نشط" : "غير نشط"}
                                            </span>
                                            <button
                                                onClick={() => handleToggleCategoryStatus(category.id)}
                                                className={`w-10 h-5 rounded-full flex items-center transition-colors cursor-pointer ${
                                                    category.isActive
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                                        category.isActive
                                                            ? "transform translate-x-5"
                                                            : "transform translate-x-0.5"
                                                    }`}
                                                ></div>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === "analytics" && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-cairo">
                                        إجمالي الأصناف
                                    </h3>
                                    <i className="ri-restaurant-line text-xl sm:text-2xl text-orange-500"></i>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-cairo">
                                    {analyticsData.totalItems}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                    {menuItems.filter((item) => item.status === "متاح").length} متاح
                                </p>
                            </div>

                            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-cairo">
                                        متوسط السعر
                                    </h3>
                                    <i className="ri-money-dollar-circle-line text-xl sm:text-2xl text-green-500"></i>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-cairo">
                                    {analyticsData.avgPrice.toFixed(2)} $
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                    من {analyticsData.totalItems} صنف
                                </p>
                            </div>

                            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 font-cairo">
                                        الأكثر طلباً
                                    </h3>
                                    <i className="ri-fire-line text-xl sm:text-2xl text-red-500"></i>
                                </div>
                                <p className="text-base sm:text-lg font-bold text-gray-900 font-cairo truncate">
                                    {analyticsData.mostOrdered.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 font-tajawal">
                                    {analyticsData.mostOrdered.orders} طلب
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-cairo">
                                    أداء الفئات
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {analyticsData.categoryStats.map((category, index) => {
                                        const maxCount = Math.max(
                                            ...analyticsData.categoryStats.map((c) => c.count),
                                            1
                                        );
                                        const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
                                        return (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center flex-1">
                                                    <div
                                                        className="w-4 h-4 rounded-full ml-3"
                                                        style={{
                                                            backgroundColor: colors[index % colors.length],
                                                        }}
                                                    ></div>
                                                    <span className="font-medium text-gray-900">
                                                        {category.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4 flex-1 justify-end">
                                                    <span className="text-sm text-gray-600">
                                                        {category.count} صنف
                                                    </span>
                                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="h-2 rounded-full"
                                                            style={{
                                                                width: `${(category.count / maxCount) * 100}%`,
                                                                backgroundColor: colors[index % colors.length],
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 w-12 text-left">
                                                        {analyticsData.totalItems > 0
                                                            ? Math.round(
                                                                  (category.count / analyticsData.totalItems) *
                                                                      100
                                                              )
                                                            : 0}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    إحصائيات الفئات
                                </h3>
                                <div className="space-y-4">
                                    {analyticsData.categoryStats.map((category, index) => {
                                        const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
                                        return (
                                            <div
                                                key={category.id}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full ml-2"
                                                            style={{
                                                                backgroundColor: colors[index % colors.length],
                                                            }}
                                                        ></div>
                                                        <span className="font-medium text-gray-900">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${
                                                            category.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {category.isActive ? "نشط" : "غير نشط"}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">الأصناف</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {category.count}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">الطلبات</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {category.totalOrders}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">الإيرادات</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {category.totalRevenue.toFixed(0)} $
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-cairo">
                                الأصناف الأكثر مبيعاً
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                {[...menuItems]
                                    .sort((a, b) => b.orders - a.orders)
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center flex-1">
                                                <span className="text-lg font-bold text-orange-500 ml-3 w-6">
                                                    {index + 1}
                                                </span>
                                                <div className="relative w-10 h-10 ml-3 flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(item)}
                                                        alt={item.name}
                                                        onError={() => handleImageError(item.id)}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                    {imageErrors.has(item.id) && (
                                                        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <i className="ri-image-line text-gray-400 text-xs"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            categories.find(
                                                                (c) => c.id === item.category
                                                            )?.name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.orders} طلب
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.revenue}
                                                    </p>
                                                </div>
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-orange-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${
                                                                (item.orders /
                                                                    analyticsData.mostOrdered.orders) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Item Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                        <div
                            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left"
                            dir="rtl"
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
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

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                            الفئة *
                                        </label>
                                        <CustomSelect
                                            options={categories
                                                .filter((cat) => cat.isActive)
                                                .map((cat) => ({
                                                    value: cat.id,
                                                    label: cat.name,
                                                }))}
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
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                                    >
                                        {selectedImage ? (
                                            <div className="space-y-3">
                                                <div className="relative w-full h-40 sm:h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        onError={(e) => {
                                                            // صورة بديلة حسب الفئة المختارة
                                                            const fallbackImages: Record<string, string> = {
                                                                main: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80",
                                                                appetizers: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80",
                                                                desserts: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&q=80",
                                                                beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&q=80",
                                                            };
                                                            const fallback = fallbackImages[formData.category] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80";
                                                            e.currentTarget.src = fallback;
                                                            e.currentTarget.onerror = null; // منع التكرار
                                                        }}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        style={{ maxHeight: '192px' }}
                                                    />
                                                </div>
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

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer font-medium"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium"
                                    >
                                        إضافة الصنف
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Category Modal */}
                {showCategoryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                    {editingCategoryId ? "تعديل الفئة" : "إضافة فئة جديدة"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setCategoryFormData({ name: "", isActive: true });
                                        setEditingCategoryId(null);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>

                            <form onSubmit={handleCategorySubmit} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        اسم الفئة *
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryFormData.name}
                                        onChange={(e) =>
                                            setCategoryFormData({
                                                ...categoryFormData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل اسم الفئة"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={categoryFormData.isActive}
                                            onChange={(e) =>
                                                setCategoryFormData({
                                                    ...categoryFormData,
                                                    isActive: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 ml-2"
                                        />
                                        <span className="text-sm text-gray-700">فئة نشطة</span>
                                    </label>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCategoryModal(false);
                                            setCategoryFormData({ name: "", isActive: true });
                                            setEditingCategoryId(null);
                                        }}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer font-medium"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium"
                                    >
                                        {editingCategoryId ? "تحديث" : "إضافة"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
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
                            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 font-tajawal">
                                هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع
                                عن هذه العملية.
                            </p>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={cancelDelete}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer font-medium"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium"
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
