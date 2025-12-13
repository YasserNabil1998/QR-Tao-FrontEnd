import { useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import RestaurantShowcase from "./components/RestaurantShowcase";
import RestaurantsList from "./components/RestaurantsList";
import Testimonials from "./components/Testimonials";
import Analytics from "./components/Analytics";
import Integration from "./components/Integration";
import Footer from "./components/Footer";

export default function HomePage() {
    const featuresRef = useRef<HTMLDivElement>(null);
    const showcaseRef = useRef<HTMLDivElement>(null);
    const restaurantsRef = useRef<HTMLDivElement>(null);
    const testimonialsRef = useRef<HTMLDivElement>(null);
    const analyticsRef = useRef<HTMLDivElement>(null);
    const howItWorksRef = useRef<HTMLDivElement>(null);
    const integrationRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (section: string) => {
        const refs = {
            features: featuresRef,
            showcase: showcaseRef,
            restaurants: restaurantsRef,
            testimonials: testimonialsRef,
            analytics: analyticsRef,
            howItWorks: howItWorksRef,
            integration: integrationRef,
        };

        const targetRef = refs[section as keyof typeof refs];
        if (targetRef?.current) {
            targetRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Hero onNavigateToSection={scrollToSection} />

            {/* Modified Features Section */}
            <div ref={featuresRef}>
                <Features />
            </div>

            {/* Step 5: Customer Experience Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-cairo">
                            تجربة عملاء استثنائية
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto font-tajawal px-2">
                            نحن نؤمن بأن تجربة العميل هي أساس نجاح أي مطعم. لذلك
                            صممنا QTap ليقدم تجربة سلسة ومميزة
                        </p>
                    </div>
                </div>
            </section>

            {/* Partnership Call to Action Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-orange-50 to-secondary-50">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] rounded-full text-white text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">
                            <i className="ri-shake-hands-line"></i>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-cairo px-2">
                            هل تريد الانضمام كشريك؟
                        </h2>

                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-tajawal px-2">
                            انضم إلى شبكة الشركاء الرائدة استفيد من نظام QTap
                            لتحسين تجربة عملائك وزيادة مبيعاتك
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <i className="ri-line-chart-line text-orange-500 text-xl sm:text-2xl"></i>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                                    زيادة المبيعات
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-tajawal">
                                    احصل على المزيد من الطلبات وزيد إيراداتك مع
                                    نظام الطلب الرقمي المتطور
                                </p>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <i className="ri-customer-service-line text-blue-500 text-xl sm:text-2xl"></i>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                                    تجربة عملاء مميزة
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-tajawal">
                                    قدم تجربة طعام حديثة ومريحة لعملائك مع
                                    القوائم الرقمية التفاعلية
                                </p>
                            </div>

                            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 md:col-span-1">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <i className="ri-dashboard-3-line text-green-500 text-xl sm:text-2xl"></i>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-cairo">
                                    إدارة محسنة
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-tajawal">
                                    تحكم كامل في مطعمك مع لوحة تحكم شاملة
                                    وتقارير تفصيلية
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 font-cairo">
                                ابدأ رحلتك الرقمية اليوم
                            </h3>
                            <p className="text-orange-100 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl font-tajawal">
                                انضم إلى أكثر من 500 مطعم يثق بنظام QTap لإدارة
                                أعمالهم
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto bg-white text-orange-500 hover:bg-orange-50 font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap font-tajawal text-center"
                                >
                                    <i className="ri-store-line ml-2"></i>
                                    سجل نشاطك الآن
                                </Link>

                                <Link
                                    to="/menu?restaurant=demo&table=1"
                                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-orange-500 font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg transition-all duration-300 whitespace-nowrap font-tajawal text-center"
                                >
                                    <i className="ri-eye-line ml-2"></i>
                                    شاهد العرض التوضيحي
                                </Link>
                            </div>
                        </div>

                        {/* Success Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12">
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-2 font-cairo">
                                    500+
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-tajawal">
                                    شريك نشط
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-2 font-cairo">
                                    50K+
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-tajawal">
                                    طلب يومي
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-2 font-cairo">
                                    40+
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-tajawal">
                                    مدينة
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-500 mb-2 font-cairo">
                                    99%
                                </div>
                                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-tajawal">
                                    رضا الشركاء
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div ref={howItWorksRef}>
                <HowItWorks />
            </div>

            <div ref={showcaseRef}>
                <RestaurantShowcase />
            </div>

            {/* Modified Restaurants List - Now after Restaurant Showcase */}
            <div ref={restaurantsRef}>
                <RestaurantsList />
            </div>

            <div ref={testimonialsRef}>
                <Testimonials />
            </div>

            <div ref={analyticsRef}>
                <Analytics />
            </div>

            <div ref={integrationRef}>
                <Integration />
            </div>

            <Footer />
        </div>
    );
}
