import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";

interface RestaurantSettingsProps {
    restaurant?: any;
    onUpdate?: () => void;
}

const RestaurantSettings = ({
    restaurant: propRestaurant,
    onUpdate,
}: RestaurantSettingsProps) => {
    const { showToast, ToastContainer } = useToast();
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);

    // Mock restaurant data
    const mockRestaurant = {
        id: "restaurant-1",
        name: "مطعم الشام",
        email: "info@alsham.com",
        phone: "+20 123 456 7890",
        address: "شارع التحرير، القاهرة، مصر",
        logo_url: "",
        subscription_plan: "premium",
        subscription_status: "active",
        trial_ends_at: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        theme_colors: {
            primary: "#f97316",
            secondary: "#1f2937",
            accent: "#10b981",
        },
        opening_hours: {
            monday: { open: "09:00", close: "22:00", closed: false },
            tuesday: { open: "09:00", close: "22:00", closed: false },
            wednesday: { open: "09:00", close: "22:00", closed: false },
            thursday: { open: "09:00", close: "22:00", closed: false },
            friday: { open: "09:00", close: "22:00", closed: false },
            saturday: { open: "09:00", close: "22:00", closed: false },
            sunday: { open: "09:00", close: "22:00", closed: false },
        },
    };

    const restaurant = propRestaurant || mockRestaurant;

    const [formData, setFormData] = useState({
        name: restaurant?.name || "",
        email: restaurant?.email || "",
        phone: restaurant?.phone || "",
        address: restaurant?.address || "",
        logo_url: restaurant?.logo_url || "",
        theme_colors: restaurant?.theme_colors || {
            primary: "#f97316",
            secondary: "#1f2937",
            accent: "#10b981",
        },
        opening_hours: restaurant?.opening_hours || {
            monday: { open: "09:00", close: "22:00", closed: false },
            tuesday: { open: "09:00", close: "22:00", closed: false },
            wednesday: { open: "09:00", close: "22:00", closed: false },
            thursday: { open: "09:00", close: "22:00", closed: false },
            friday: { open: "09:00", close: "22:00", closed: false },
            saturday: { open: "09:00", close: "22:00", closed: false },
            sunday: { open: "09:00", close: "22:00", closed: false },
        },
    });

    useEffect(() => {
        if (restaurant) {
            setFormData({
                name: restaurant.name || "",
                email: restaurant.email || "",
                phone: restaurant.phone || "",
                address: restaurant.address || "",
                logo_url: restaurant.logo_url || "",
                theme_colors: restaurant.theme_colors || {
                    primary: "#f97316",
                    secondary: "#1f2937",
                    accent: "#10b981",
                },
                opening_hours: restaurant.opening_hours || {
                    monday: { open: "09:00", close: "22:00", closed: false },
                    tuesday: { open: "09:00", close: "22:00", closed: false },
                    wednesday: { open: "09:00", close: "22:00", closed: false },
                    thursday: { open: "09:00", close: "22:00", closed: false },
                    friday: { open: "09:00", close: "22:00", closed: false },
                    saturday: { open: "09:00", close: "22:00", closed: false },
                    sunday: { open: "09:00", close: "22:00", closed: false },
                },
            });
        }
    }, [restaurant]);

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSaveGeneral = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            showToast("يرجى إدخال اسم المطعم", "error");
            return;
        }
        if (!formData.email.trim()) {
            showToast("يرجى إدخال البريد الإلكتروني", "error");
            return;
        }
        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            showToast("يرجى إدخال بريد إلكتروني صحيح", "error");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // In real app, this would update the database
            setLoading(false);
            showToast("تم حفظ الإعدادات العامة بنجاح", "success");
            if (onUpdate) onUpdate();
        }, 500);
    };

    const handleSaveTheme = () => {
        // Validation
        if (
            !formData.theme_colors.primary ||
            !formData.theme_colors.secondary ||
            !formData.theme_colors.accent
        ) {
            showToast("يرجى تحديد جميع الألوان", "error");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // In real app, this would update the database
            setLoading(false);
            showToast("تم حفظ ألوان المطعم بنجاح", "success");
            if (onUpdate) onUpdate();
        }, 500);
    };

    const handleSaveHours = () => {
        // Validation - check if at least one day is open
        const hasOpenDay = Object.values(formData.opening_hours).some(
            (day) => !day.closed
        );

        if (!hasOpenDay) {
            showToast("يرجى تحديد يوم عمل واحد على الأقل", "error");
            return;
        }

        // Validate time ranges
        const invalidDays = Object.entries(formData.opening_hours).filter(
            ([_, day]) => !day.closed && day.open >= day.close
        );

        if (invalidDays.length > 0) {
            showToast("وقت الفتح يجب أن يكون قبل وقت الإغلاق", "error");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // In real app, this would update the database
            setLoading(false);
            showToast("تم حفظ أوقات العمل بنجاح", "success");
            if (onUpdate) onUpdate();
        }, 500);
    };

    const tabs = [
        { id: "general", label: "الإعدادات العامة", icon: "ri-settings-line" },
        { id: "theme", label: "ألوان المطعم", icon: "ri-palette-line" },
        { id: "hours", label: "أوقات العمل", icon: "ri-time-line" },
        { id: "subscription", label: "الاشتراك", icon: "ri-vip-crown-line" },
    ];

    const days = [
        { key: "monday", label: "الاثنين" },
        { key: "tuesday", label: "الثلاثاء" },
        { key: "wednesday", label: "الأربعاء" },
        { key: "thursday", label: "الخميس" },
        { key: "friday", label: "الجمعة" },
        { key: "saturday", label: "السبت" },
        { key: "sunday", label: "الأحد" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إعدادات المطعم
                </h2>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-colors ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <i className={`${tab.icon} ml-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <form
                            onSubmit={handleSaveGeneral}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        اسم المطعم
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل اسم المطعم"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="+20 123 456 7890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رابط الشعار
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.logo_url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                logo_url: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    العنوان
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="أدخل عنوان المطعم"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                                >
                                    {loading
                                        ? "جاري الحفظ..."
                                        : "حفظ الإعدادات"}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Theme Settings */}
                    {activeTab === "theme" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    ألوان المطعم
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اللون الأساسي
                                        </label>
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <input
                                                type="color"
                                                value={
                                                    formData.theme_colors
                                                        .primary
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            primary:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    formData.theme_colors
                                                        .primary
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            primary:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اللون الثانوي
                                        </label>
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <input
                                                type="color"
                                                value={
                                                    formData.theme_colors
                                                        .secondary
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            secondary:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    formData.theme_colors
                                                        .secondary
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            secondary:
                                                                e.target.value,
                                                        },
                                                    })
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            لون التمييز
                                        </label>
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <input
                                                type="color"
                                                value={
                                                    formData.theme_colors.accent
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            accent: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={
                                                    formData.theme_colors.accent
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        theme_colors: {
                                                            ...formData.theme_colors,
                                                            accent: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleSaveTheme}
                                    disabled={loading}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                                >
                                    {loading ? "جاري الحفظ..." : "حفظ الألوان"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Opening Hours */}
                    {activeTab === "hours" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                أوقات العمل
                            </h3>
                            <div className="space-y-4">
                                {days.map((day) => (
                                    <div
                                        key={day.key}
                                        className="flex items-center space-x-4 space-x-reverse"
                                    >
                                        <div className="w-20">
                                            <span className="text-sm font-medium text-gray-700">
                                                {day.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !formData.opening_hours[
                                                        day.key
                                                    ]?.closed
                                                }
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        opening_hours: {
                                                            ...formData.opening_hours,
                                                            [day.key]: {
                                                                ...formData
                                                                    .opening_hours[
                                                                    day.key
                                                                ],
                                                                closed: !e
                                                                    .target
                                                                    .checked,
                                                            },
                                                        },
                                                    })
                                                }
                                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-600">
                                                مفتوح
                                            </span>
                                        </div>
                                        {!formData.opening_hours[day.key]
                                            ?.closed && (
                                            <>
                                                <div>
                                                    <input
                                                        type="time"
                                                        value={
                                                            formData
                                                                .opening_hours[
                                                                day.key
                                                            ]?.open || "09:00"
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                opening_hours: {
                                                                    ...formData.opening_hours,
                                                                    [day.key]: {
                                                                        ...formData
                                                                            .opening_hours[
                                                                            day
                                                                                .key
                                                                        ],
                                                                        open: e
                                                                            .target
                                                                            .value,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <span className="text-gray-500">
                                                    إلى
                                                </span>
                                                <div>
                                                    <input
                                                        type="time"
                                                        value={
                                                            formData
                                                                .opening_hours[
                                                                day.key
                                                            ]?.close || "22:00"
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                opening_hours: {
                                                                    ...formData.opening_hours,
                                                                    [day.key]: {
                                                                        ...formData
                                                                            .opening_hours[
                                                                            day
                                                                                .key
                                                                        ],
                                                                        close: e
                                                                            .target
                                                                            .value,
                                                                    },
                                                                },
                                                            })
                                                        }
                                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleSaveHours}
                                    disabled={loading}
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                                >
                                    {loading
                                        ? "جاري الحفظ..."
                                        : "حفظ أوقات العمل"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Subscription */}
                    {activeTab === "subscription" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                معلومات الاشتراك
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <i className="ri-vip-crown-line text-green-500 text-xl ml-2"></i>
                                        <h4 className="font-medium text-green-900">
                                            الخطة الحالية
                                        </h4>
                                    </div>
                                    <p className="text-sm text-green-800 capitalize">
                                        {restaurant.subscription_plan}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        الحالة:{" "}
                                        {restaurant.subscription_status ===
                                        "active"
                                            ? "نشط"
                                            : "غير نشط"}
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center mb-2">
                                        <i className="ri-calendar-line text-blue-500 text-xl ml-2"></i>
                                        <h4 className="font-medium text-blue-900">
                                            انتهاء التجربة
                                        </h4>
                                    </div>
                                    <p className="text-sm text-blue-800">
                                        {restaurant.trial_ends_at
                                            ? formatDate(
                                                  restaurant.trial_ends_at
                                              )
                                            : "غير محدد"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <i className="ri-information-line text-yellow-500 text-xl mt-1 ml-3"></i>
                                    <div>
                                        <h4 className="font-medium text-yellow-900 mb-2">
                                            معلومات مهمة
                                        </h4>
                                        <ul className="text-sm text-yellow-800 space-y-1">
                                            <li>
                                                • يمكنك ترقية خطتك في أي وقت
                                            </li>
                                            <li>
                                                • التجربة المجانية تشمل جميع
                                                الميزات لمدة 14 يوم
                                            </li>
                                            <li>
                                                • بعد انتهاء التجربة، ستحتاج
                                                لاختيار خطة مدفوعة
                                            </li>
                                            <li>
                                                • يمكنك إلغاء الاشتراك في أي وقت
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default RestaurantSettings;
