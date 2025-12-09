export default function Testimonials() {
    const testimonials = [
        {
            name: "أحمد المالكي",
            position: "مدير مطعم الأصالة",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20restaurant%20manager%20in%20business%20attire%2C%20confident%20smile%2C%20modern%20restaurant%20background%2C%20professional%20headshot%20photography%2C%20warm%20lighting%2C%20contemporary%20business%20portrait&width=100&height=100&seq=testimonial-1&orientation=squarish",
            content:
                "QTap غيّر طريقة عمل مطعمنا بالكامل. زادت الطلبات بنسبة 40% وقل وقت الانتظار بشكل كبير. العملاء يحبون سهولة الطلب عبر الهاتف.",
            rating: 5,
            restaurant: "مطعم الأصالة - الرياض",
        },
        {
            name: "فاطمة الزهراني",
            position: "مالكة مقهى الورد",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20businesswoman%20cafe%20owner%2C%20warm%20smile%2C%20modern%20cafe%20background%2C%20professional%20portrait%20photography%2C%20elegant%20appearance%2C%20contemporary%20business%20setting&width=100&height=100&seq=testimonial-2&orientation=squarish",
            content:
                "منذ استخدام QTap، أصبح بإمكان عملائنا الطلب بسهولة دون انتظار النادل. النظام سهل الاستخدام ووفر علينا الكثير من الوقت والجهد.",
            rating: 5,
            restaurant: "مقهى الورد - جدة",
        },
        {
            name: "محمد العتيبي",
            position: "مدير سلسلة مطاعم البحر",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20restaurant%20chain%20manager%2C%20confident%20expression%2C%20upscale%20restaurant%20environment%2C%20business%20portrait%20photography%2C%20modern%20professional%20attire%2C%20sophisticated%20setting&width=100&height=100&seq=testimonial-3&orientation=squarish",
            content:
                "نستخدم QTap في جميع فروعنا الـ 8. النظام موحد ويساعدنا في إدارة العمليات بكفاءة. التقارير التفصيلية تساعدنا في اتخاذ قرارات أفضل.",
            rating: 5,
            restaurant: "سلسلة مطاعم البحر",
        },
        {
            name: "سارة القحطاني",
            position: "مديرة مطعم الحديقة",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20restaurant%20manager%20woman%2C%20friendly%20smile%2C%20elegant%20restaurant%20background%2C%20professional%20headshot%20photography%2C%20modern%20business%20attire%2C%20welcoming%20atmosphere&width=100&height=100&seq=testimonial-4&orientation=squarish",
            content:
                "أفضل استثمار قمنا به! QTap ساعدنا في تحسين تجربة العملاء وزيادة الإيرادات. الدعم الفني ممتاز والنظام لا يتوقف أبداً.",
            rating: 5,
            restaurant: "مطعم الحديقة - الدمام",
        },
        {
            name: "خالد الشمري",
            position: "مالك مطعم التراث",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20restaurant%20owner%2C%20traditional%20yet%20modern%20appearance%2C%20authentic%20restaurant%20setting%2C%20professional%20portrait%20photography%2C%20confident%20businessman%2C%20cultural%20heritage%20background&width=100&height=100&seq=testimonial-5&orientation=squarish",
            content:
                "كنت متردداً في البداية، لكن بعد تجربة QTap لمدة شهر، لا أستطيع تخيل العمل بدونه. العملاء سعداء والعمليات أصبحت أكثر تنظيماً.",
            rating: 5,
            restaurant: "مطعم التراث - المدينة المنورة",
        },
        {
            name: "نورا الدوسري",
            position: "مديرة كافيه الفن",
            image: "https://readdy.ai/api/search-image?query=Professional%20Middle%20Eastern%20cafe%20manager%20woman%2C%20artistic%20background%2C%20modern%20cafe%20setting%2C%20creative%20professional%20portrait%2C%20contemporary%20business%20attire%2C%20inspiring%20atmosphere&width=100&height=100&seq=testimonial-6&orientation=squarish",
            content:
                "QTap ليس مجرد نظام طلبات، بل شريك في النجاح. ساعدنا في فهم تفضيلات العملاء وتحسين قائمة الطعام بناءً على البيانات الحقيقية.",
            rating: 5,
            restaurant: "كافيه الفن - الخبر",
        },
    ];

    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        ماذا يقول عملاؤنا
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        انضم إلى مئات المطاعم التي تثق في QTap لتحسين عملياتها
                        وزيادة أرباحها
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow text-center"
                        >
                            <div className="flex items-center justify-center mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <i
                                        key={i}
                                        className="ri-star-fill text-yellow-500 text-lg"
                                    ></i>
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center justify-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover object-top ml-4"
                                />
                                <div className="text-right">
                                    <h4 className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.position}
                                    </p>
                                    <p className="text-xs text-orange-600">
                                        {testimonial.restaurant}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] rounded-2xl p-8 text-white">
                        <h3 className="text-3xl font-bold mb-4">
                            انضم إلى عائلة QTap اليوم
                        </h3>
                        <p className="text-xl mb-8 opacity-90">
                            ابدأ رحلتك نحو مطعم أكثر كفاءة وربحية
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                                جرب مجاناً لمدة 30 يوم
                            </button>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                                احجز عرض توضيحي
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
