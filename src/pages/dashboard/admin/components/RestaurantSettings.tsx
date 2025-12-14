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
            (day) => !(day as { open: string; close: string; closed: boolean }).closed
        );

        if (!hasOpenDay) {
            showToast("يرجى تحديد يوم عمل واحد على الأقل", "error");
            return;
        }

        // Validate time ranges
        const invalidDays = Object.entries(formData.opening_hours).filter(
            ([_, day]) => {
                const dayObj = day as { open: string; close: string; closed: boolean };
                return !dayObj.closed && dayObj.open >= dayObj.close;
            }
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
        <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between w-full px-2 sm:px-0">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-cairo">
                    إعدادات المطعم
                </h2>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden w-full max-w-full">
                <div className="border-b border-gray-200 w-full">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 px-2 sm:px-3 md:px-6 overflow-x-auto w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`
                            nav::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2.5 sm:py-3 md:py-4 px-1 border-b-2 font-medium text-[10px] sm:text-xs md:text-sm whitespace-nowrap cursor-pointer transition-colors font-tajawal ${
                                    activeTab === tab.id
                                        ? "border-orange-500 text-orange-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <i className={`${tab.icon} ml-0.5 sm:ml-1 md:ml-2 text-xs sm:text-sm md:text-base`}></i>
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden text-[9px]">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-3 sm:p-4 md:p-6 w-full max-w-full overflow-x-hidden">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <form
                            onSubmit={handleSaveGeneral}
                            className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-full"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
                                <div className="w-full min-w-0">
                                    <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
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
                                        className="w-full min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل اسم المطعم"
                                        required
                                    />
                                </div>
                                <div className="w-full min-w-0">
                                    <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
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
                                        className="w-full min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                                <div className="w-full min-w-0">
                                    <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
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
                                        className="w-full min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="+20 123 456 7890"
                                    />
                                </div>
                                <div className="w-full min-w-0">
                                    <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
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
                                        className="w-full min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent break-all"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                            </div>
                            <div className="w-full min-w-0">
                                <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
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
                                    className="w-full min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="أدخل عنوان المطعم"
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-orange-500 text-white rounded-md sm:rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
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
                        <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-full">
                            <div className="w-full min-w-0">
                                <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-2.5 sm:mb-3 md:mb-4 font-cairo">
                                    ألوان المطعم
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
                                    <div className="w-full min-w-0">
                                        <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
                                            اللون الأساسي
                                        </label>
                                        <div className="flex items-center gap-2 sm:gap-3 w-full">
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
                                                className="w-10 h-9 sm:w-12 sm:h-10 md:w-14 md:h-12 border border-gray-300 rounded-md sm:rounded-lg cursor-pointer flex-shrink-0"
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
                                                className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full min-w-0">
                                        <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
                                            اللون الثانوي
                                        </label>
                                        <div className="flex items-center gap-2 sm:gap-3 w-full">
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
                                                className="w-10 h-9 sm:w-12 sm:h-10 md:w-14 md:h-12 border border-gray-300 rounded-md sm:rounded-lg cursor-pointer flex-shrink-0"
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
                                                className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full min-w-0">
                                        <label className="block text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 font-tajawal">
                                            لون التمييز
                                        </label>
                                        <div className="flex items-center gap-2 sm:gap-3 w-full">
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
                                                className="w-10 h-9 sm:w-12 sm:h-10 md:w-14 md:h-12 border border-gray-300 rounded-md sm:rounded-lg cursor-pointer flex-shrink-0"
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
                                                className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleSaveTheme}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-orange-500 text-white rounded-md sm:rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                                >
                                    {loading ? "جاري الحفظ..." : "حفظ الألوان"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Opening Hours */}
                    {activeTab === "hours" && (
                        <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-full">
                            <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 font-cairo">
                                أوقات العمل
                            </h3>
                            <div className="space-y-2.5 sm:space-y-3 md:space-y-4 w-full">
                                {days.map((day) => (
                                    <div
                                        key={day.key}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-md sm:rounded-lg w-full min-w-0"
                                    >
                                        <div className="w-full sm:w-20 flex-shrink-0 min-w-0">
                                            <span className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 font-tajawal">
                                                {day.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto min-w-0">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
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
                                                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                                            />
                                                <span className="text-[11px] sm:text-xs md:text-sm text-gray-600 font-tajawal">
                                                مفتوح
                                            </span>
                                        </div>
                                        {!formData.opening_hours[day.key]
                                            ?.closed && (
                                                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-1 sm:flex-initial">
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
                                                        className="flex-1 sm:flex-initial px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                    <span className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-tajawal">
                                                    إلى
                                                </span>
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
                                                        className="flex-1 sm:flex-initial px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                        )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleSaveHours}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium bg-orange-500 text-white rounded-md sm:rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
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
                        <div className="space-y-3 sm:space-y-4 md:space-y-6">
                            <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 font-cairo">
                                معلومات الاشتراك
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                <div className="bg-green-50 border border-green-200 rounded-md sm:rounded-lg p-2.5 sm:p-3 md:p-4">
                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                        <i className="ri-vip-crown-line text-green-500 text-base sm:text-lg md:text-xl ml-1.5 sm:ml-2 flex-shrink-0"></i>
                                        <h4 className="text-xs sm:text-sm md:text-base font-medium text-green-900 font-cairo">
                                            الخطة الحالية
                                        </h4>
                                    </div>
                                    <p className="text-[11px] sm:text-xs md:text-sm text-green-800 capitalize font-tajawal">
                                        {restaurant.subscription_plan}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-green-600 mt-1 font-tajawal">
                                        الحالة:{" "}
                                        {restaurant.subscription_status ===
                                        "active"
                                            ? "نشط"
                                            : "غير نشط"}
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-md sm:rounded-lg p-2.5 sm:p-3 md:p-4">
                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                        <i className="ri-calendar-line text-blue-500 text-base sm:text-lg md:text-xl ml-1.5 sm:ml-2 flex-shrink-0"></i>
                                        <h4 className="text-xs sm:text-sm md:text-base font-medium text-blue-900 font-cairo">
                                            انتهاء التجربة
                                        </h4>
                                    </div>
                                    <p className="text-[11px] sm:text-xs md:text-sm text-blue-800 font-tajawal">
                                        {restaurant.trial_ends_at
                                            ? formatDate(
                                                  restaurant.trial_ends_at
                                              )
                                            : "غير محدد"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md sm:rounded-lg p-2.5 sm:p-3 md:p-4">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <i className="ri-information-line text-yellow-500 text-base sm:text-lg md:text-xl flex-shrink-0 mt-0.5 sm:mt-1"></i>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs sm:text-sm md:text-base font-medium text-yellow-900 mb-1.5 sm:mb-2 font-cairo">
                                            معلومات مهمة
                                        </h4>
                                        <ul className="text-[11px] sm:text-xs md:text-sm text-yellow-800 space-y-0.5 sm:space-y-1 font-tajawal">
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
