export default function Analytics() {
    const stats = [
        {
            number: "500+",
            label: "مطعم يثق بنا",
            icon: "ri-restaurant-line",
            color: "orange",
        },
        {
            number: "2M+",
            label: "طلب تم تنفيذه",
            icon: "ri-shopping-bag-line",
            color: "blue",
        },
        {
            number: "98%",
            label: "رضا العملاء",
            icon: "ri-emotion-happy-line",
            color: "green",
        },
        {
            number: "45%",
            label: "زيادة في الإيرادات",
            icon: "ri-line-chart-line",
            color: "purple",
        },
    ];

    const features = [
        {
            title: "تحليلات في الوقت الفعلي",
            description:
                "راقب أداء مطعمك لحظة بلحظة مع لوحة تحكم شاملة تعرض جميع المقاييس المهمة",
            icon: "ri-dashboard-line",
            image: "https://readdy.ai/api/search-image?query=Modern%20restaurant%20analytics%20dashboard%20on%20computer%20screen%2C%20real-time%20data%20visualization%2C%20charts%20and%20graphs%2C%20professional%20business%20intelligence%20interface%2C%20clean%20modern%20design%2C%20restaurant%20management%20software&width=600&height=400&seq=analytics-1&orientation=landscape",
        },
        {
            title: "تقارير مفصلة",
            description:
                "احصل على تقارير شاملة عن المبيعات، الأطباق الأكثر طلباً، أوقات الذروة، وأداء الفريق",
            icon: "ri-file-chart-line",
            image: "https://readdy.ai/api/search-image?query=Detailed%20restaurant%20reports%20and%20analytics%2C%20sales%20charts%2C%20popular%20dishes%20analysis%2C%20peak%20hours%20data%2C%20professional%20business%20reports%20interface%2C%20modern%20data%20visualization%2C%20restaurant%20performance%20metrics&width=600&height=400&seq=analytics-2&orientation=landscape",
        },
        {
            title: "ذكاء اصطناعي للتنبؤات",
            description:
                "استخدم قوة الذكاء الاصطناعي للتنبؤ بالطلب، تحسين المخزون، واتخاذ قرارات مدروسة",
            icon: "ri-brain-line",
            image: "https://readdy.ai/api/search-image?query=AI-powered%20restaurant%20predictions%20interface%2C%20machine%20learning%20analytics%2C%20demand%20forecasting%2C%20inventory%20optimization%2C%20artificial%20intelligence%20dashboard%2C%20futuristic%20business%20intelligence%2C%20smart%20restaurant%20technology&width=600&height=400&seq=analytics-3&orientation=landscape",
        },
    ];

    return (
        <section
            id="analytics"
            className="py-20 bg-gradient-to-br from-gray-50 to-white"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Stats Section */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        أرقام تتحدث عن نفسها
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                        انضم إلى مجتمع متنامي من المطاعم الناجحة التي تستخدم
                        QTap لتحقيق نتائج استثنائية
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                                        stat.color === "orange"
                                            ? "bg-orange-100"
                                            : stat.color === "blue"
                                            ? "bg-blue-100"
                                            : stat.color === "green"
                                            ? "bg-green-100"
                                            : "bg-purple-100"
                                    }`}
                                >
                                    <i
                                        className={`${stat.icon} text-2xl ${
                                            stat.color === "orange"
                                                ? "text-orange-500"
                                                : stat.color === "blue"
                                                ? "text-blue-500"
                                                : stat.color === "green"
                                                ? "text-green-500"
                                                : "text-purple-500"
                                        }`}
                                    ></i>
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="space-y-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:flex-row items-center gap-12 ${
                                index % 2 === 1 ? "lg:flex-row-reverse" : ""
                            }`}
                        >
                            <div className="flex-1">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-80 object-cover object-top rounded-2xl shadow-lg"
                                />
                            </div>

                            <div className="flex-1 text-center lg:text-right">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                                    <i
                                        className={`${feature.icon} text-orange-500 text-2xl`}
                                    ></i>
                                </div>

                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                    {feature.title}
                                </h3>

                                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                    {feature.description}
                                </p>

                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                                    <i className="ri-arrow-left-line ml-2"></i>
                                    تعرف على المزيد
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            ابدأ في اتخاذ قرارات مدروسة اليوم
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            احصل على رؤى عميقة حول أداء مطعمك واتخذ قرارات تعتمد
                            على البيانات الحقيقية
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] hover:from-[#0D5DD9] hover:to-[#2A8DC4] text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                                <i className="ri-rocket-line ml-2"></i>
                                ابدأ التجربة المجانية
                            </button>
                            <button className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                                <i className="ri-calendar-line ml-2"></i>
                                احجز استشارة مجانية
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
