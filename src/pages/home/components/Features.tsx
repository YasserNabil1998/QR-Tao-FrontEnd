import { useState } from "react";

const Features = () => {
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const features = [
        {
            icon: "ri-qr-code-line",
            title: "قوائم QR ذكية",
            description:
                "قوائم طعام رقمية تفاعلية يمكن الوصول إليها عبر رمز QR",
            image: "https://readdy.ai/api/search-image?query=Modern%20restaurant%20QR%20code%20menu%20on%20smartphone%20screen%2C%20elegant%20digital%20menu%20interface%2C%20professional%20restaurant%20technology%2C%20clean%20minimalist%20design%20with%20orange%20and%20white%20color%20scheme%2C%20high-tech%20dining%20experience&width=400&height=300&seq=qr-menu-1&orientation=landscape",
        },
        {
            icon: "ri-smartphone-line",
            title: "طلب مباشر",
            description: "يمكن للعملاء الطلب مباشرة من هواتفهم دون انتظار",
            image: "https://readdy.ai/api/search-image?query=Customer%20ordering%20food%20on%20smartphone%20in%20restaurant%2C%20modern%20mobile%20ordering%20interface%2C%20seamless%20digital%20dining%20experience%2C%20orange%20and%20white%20UI%20design%2C%20professional%20restaurant%20app&width=400&height=300&seq=mobile-order-1&orientation=landscape",
        },
        {
            icon: "ri-shield-check-line",
            title: "دفع آمن",
            description: "نظام دفع متقدم وآمن مع حماية كاملة للبيانات",
            image: "https://readdy.ai/api/search-image?query=Secure%20mobile%20payment%20interface%20with%20orange%20and%20white%20color%20scheme%2C%20modern%20digital%20wallet%20design%2C%20payment%20security%20icons%2C%20professional%20fintech%20UI%2C%20clean%20minimalist%20payment%20screen%20with%20security%20badges&width=400&height=300&seq=secure-payment-2&orientation=landscape",
        },
        {
            icon: "ri-line-chart-line",
            title: "تحليلات متقدمة",
            description: "تقارير مفصلة وإحصائيات لمساعدتك في اتخاذ القرارات",
            image: "https://readdy.ai/api/search-image?query=Restaurant%20analytics%20dashboard%20with%20orange%20and%20white%20theme%2C%20modern%20data%20visualization%20charts%2C%20professional%20business%20intelligence%20interface%2C%20clean%20dashboard%20design%20with%20graphs%20and%20metrics&width=400&height=300&seq=analytics-1&orientation=landscape",
        },
    ];

    const dashboardFeatures = [
        {
            icon: "ri-admin-line",
            title: "لوحة الإدارة",
            description: "إدارة شاملة للمطعم مع تحليلات متقدمة وإعدادات النظام",
            color: "bg-orange-600",
        },
        {
            icon: "ri-restaurant-2-line",
            title: "إدارة القائمة",
            description: "إضافة وتعديل الأطباق والفئات مع الصور والأسعار",
            color: "bg-emerald-600",
        },
        {
            icon: "ri-group-line",
            title: "إدارة الموظفين",
            description: "تسجيل الموظفين وتحديد الأدوار والصلاحيات",
            color: "bg-blue-600",
        },
        {
            icon: "ri-money-dollar-circle-line",
            title: "إدارة المدفوعات",
            description: "تتبع المدفوعات وطرق الدفع والتقارير المالية",
            color: "bg-green-600",
        },
        {
            icon: "ri-file-list-3-line",
            title: "إدارة الفواتير",
            description: "إنشاء وإدارة الفواتير مع تتبع حالة الدفع",
            color: "bg-purple-600",
        },
        {
            icon: "ri-truck-line",
            title: "إدارة الموردين",
            description: "قاعدة بيانات الموردين وتتبع المشتريات والعقود",
            color: "bg-indigo-600",
        },
        {
            icon: "ri-shopping-cart-line",
            title: "إدارة المشتريات",
            description: "تسجيل المشتريات وتتبع التكاليف والمخزون",
            color: "bg-cyan-600",
        },
        {
            icon: "ri-bar-chart-box-line",
            title: "التحليلات المتقدمة",
            description: "تقارير مفصلة عن المبيعات والأرباح والأداء",
            color: "bg-rose-600",
        },
        {
            icon: "ri-archive-line",
            title: "إدارة المخزون",
            description: "تتبع المخزون والتنبيهات عند نفاد المواد",
            color: "bg-amber-600",
        },
        {
            icon: "ri-cash-line",
            title: "لوحة الكاشير",
            description: "واجهة سهلة لمعالجة الطلبات والمدفوعات اليومية",
            color: "bg-teal-600",
        },
        {
            icon: "ri-file-text-line",
            title: "التقارير اليومية",
            description: "تقارير شاملة عن مبيعات اليوم والأداء المالي",
            color: "bg-slate-600",
        },
        {
            icon: "ri-chef-hat-line",
            title: "لوحة الشيف",
            description: "إدارة طلبات المطبخ وحالة تحضير الأطباق",
            color: "bg-orange-700",
        },
    ];

    return (
        <section id="features" className="section-padding bg-gray-50">
            <div className="max-w-7xl mx-auto container-responsive">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        ميزات قوية لتجربة طعام عصرية
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                        يجمع QTap بين التكنولوجيا المتطورة والتصميم البديهي
                        لإنشاء تجربة طعام رقمية مثالية للمطاعم والعملاء.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-orange-100 hover:border-orange-200"
                        >
                            <div className="flex justify-center mb-4 sm:mb-6">
                                {/* No dedicated color in the feature data, using a default */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-4 border-orange-100/50 shadow-lg">
                                    <i
                                        className={`${feature.icon} text-white text-2xl sm:text-3xl`}
                                    ></i>
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Features Section - Hidden by default */}
                {showAllFeatures && (
                    <div className="mt-12 sm:mt-16 md:mt-20 animate-in slide-in-from-top duration-500">
                        <div className="text-center mb-8 sm:mb-12">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                                لوحات تحكم متخصصة
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                                أنظمة إدارة متكاملة مصممة خصيصاً لكل دور في
                                المطعم
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {dashboardFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-orange-100 hover:border-orange-200"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                >
                                    <div className="flex justify-center mb-3 sm:mb-4">
                                        <div
                                            className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-orange-100/5`}
                                        >
                                            <i
                                                className={`${feature.icon} text-white text-xl sm:text-2xl`}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                                            {feature.title}
                                        </h4>

                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 sm:mt-12 md:mt-16 text-center">
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer btn-touch"
                    >
                        {showAllFeatures
                            ? "إخفاء الميزات الإضافية"
                            : "استكشف جميع الميزات"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Features;
