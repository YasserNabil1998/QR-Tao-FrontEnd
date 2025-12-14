import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDirection } from "../../../context/DirectionContext";

interface HeroProps {
    onNavigateToSection?: (section: string) => void;
}

export default function Hero({ onNavigateToSection }: HeroProps) {
    const { user, signOut } = useAuth();
    const { direction, toggleDirection } = useDirection();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        window.location.reload();
    };

    const handleSectionClick = (section: string) => {
        if (onNavigateToSection) {
            onNavigateToSection(section);
        }
    };

    return (
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20restaurant%20interior%20with%20elegant%20dining%20tables%2C%20warm%20lighting%2C%20contemporary%20design%2C%20professional%20food%20service%20atmosphere%2C%20clean%20minimalist%20style%2C%20high-end%20restaurant%20ambiance%20with%20digital%20technology%20integration&width=1920&height=1080&seq=hero-bg&orientation=landscape')`,
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Navigation */}
            <nav className="absolute top-0 left-0 right-0 z-30 px-3 sm:px-4 md:px-6 lg:px-8 pt-0 pb-3 sm:pb-4 md:pb-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/logo-Qr.svg"
                                alt="QTap Logo"
                                className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto"
                            />
                        </Link>
                        <div className="hidden lg:flex items-center gap-4 md:gap-6">
                            <button
                                onClick={() => {
                                    handleSectionClick("features");
                                    setMobileMenuOpen(false);
                                }}
                                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap text-base md:text-lg px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                            >
                                المميزات
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("restaurants");
                                    setMobileMenuOpen(false);
                                }}
                                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap text-base md:text-lg px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                            >
                                المطاعم
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("showcase");
                                    setMobileMenuOpen(false);
                                }}
                                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap text-base md:text-lg px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                            >
                                العرض التوضيحي
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("testimonials");
                                    setMobileMenuOpen(false);
                                }}
                                className="nav-link text-white hover:text-orange-400 cursor-pointer whitespace-nowrap text-base md:text-lg px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                            >
                                آراء العملاء
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleDirection}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white hover:text-orange-400 transition-colors rounded-lg hover:bg-white/10 border border-white/20 btn-touch"
                            title={
                                direction === "rtl"
                                    ? "Switch to English"
                                    : "التبديل إلى العربية"
                            }
                        >
                            <i className="ri-global-line text-base sm:text-lg md:text-xl"></i>
                            <span className="font-semibold text-xs sm:text-sm md:text-base">
                                {direction === "rtl" ? "ع" : "en"}
                            </span>
                        </button>

                        {user ? (
                            <div className="hidden md:flex items-center gap-3 md:gap-4">
                                <Link
                                    to={
                                        user.role === "restaurant_admin"
                                            ? "/admin"
                                            : user.role === "cashier"
                                            ? "/cashier"
                                            : "/chef"
                                    }
                                    className="nav-link text-white hover:text-orange-400 whitespace-nowrap text-sm md:text-base px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    لوحة التحكم
                                </Link>
                                <span className="text-gray-300 text-sm md:text-base hidden lg:inline">
                                    مرحباً، {user.full_name}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="text-red-400 hover:text-red-300 transition-colors whitespace-nowrap text-sm md:text-base px-3 md:px-4 py-2 rounded-lg hover:bg-white/10 btn-touch"
                                >
                                    <i className={`ri-logout-box-line ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}></i>
                                    <span className="hidden lg:inline">تسجيل الخروج</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/register"
                                className="hidden md:block bg-[#1B6EF3] hover:bg-[#0D5DD9] text-white font-semibold px-4 md:px-6 lg:px-8 py-2 md:py-2.5 rounded-lg shadow-lg transition-colors whitespace-nowrap text-sm md:text-base btn-touch"
                            >
                                ابدأ الآن
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-white hover:text-orange-400 transition-colors p-2 rounded-lg hover:bg-white/10 btn-touch"
                            aria-label="Menu"
                        >
                            <i className={`ri-${mobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-3 sm:mx-4 bg-black/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 overflow-hidden">
                        <div className="px-4 py-4 space-y-2">
                            <button
                                onClick={() => {
                                    handleSectionClick("features");
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-right text-white hover:text-orange-400 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                المميزات
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("restaurants");
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-right text-white hover:text-orange-400 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                المطاعم
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("showcase");
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-right text-white hover:text-orange-400 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                العرض التوضيحي
                            </button>
                            <button
                                onClick={() => {
                                    handleSectionClick("testimonials");
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-right text-white hover:text-orange-400 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                            >
                                آراء العملاء
                            </button>
                            {user ? (
                                <>
                                    <Link
                                        to={
                                            user.role === "restaurant_admin"
                                                ? "/admin"
                                                : user.role === "cashier"
                                                ? "/cashier"
                                                : "/chef"
                                        }
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full text-right text-white hover:text-orange-400 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        لوحة التحكم
                                    </Link>
                                    <div className="px-4 py-2 text-gray-300 text-sm">
                                        مرحباً، {user.full_name}
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full text-right text-red-400 hover:text-red-300 hover:bg-white/10 px-4 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        <i className={`ri-logout-box-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}></i>
                                        تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center bg-[#1B6EF3] hover:bg-[#0D5DD9] text-white font-semibold px-4 py-3 rounded-lg shadow-lg transition-colors mt-2"
                                >
                                    ابدأ الآن
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-tight font-cairo">
                    مستقبل المطاعم
                    <span className="block text-orange-400">الرقمية</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed font-tajawal px-2 sm:px-4">
                    حول مطعمك إلى تجربة رقمية متكاملة مع QTap
                </p>

                {/* Quick Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto px-2 sm:px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <i className="ri-qr-code-line text-white text-xl sm:text-2xl md:text-3xl"></i>
                        </div>
                        <h3 className="text-white font-semibold mb-2 sm:mb-3 font-cairo text-base sm:text-lg md:text-xl">
                            قوائم QR ذكية
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg font-tajawal">
                            قوائم رقمية تفاعلية
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <i className="ri-dashboard-line text-white text-xl sm:text-2xl md:text-3xl"></i>
                        </div>
                        <h3 className="text-white font-semibold mb-2 sm:mb-3 font-cairo text-base sm:text-lg md:text-xl">
                            إدارة شاملة
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg font-tajawal">
                            لوحة تحكم متكاملة
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 border border-white/20 sm:col-span-2 md:col-span-1 hover:bg-white/15 transition-all">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <i className="ri-line-chart-line text-white text-xl sm:text-2xl md:text-3xl"></i>
                        </div>
                        <h3 className="text-white font-semibold mb-2 sm:mb-3 font-cairo text-base sm:text-lg md:text-xl">
                            تحليلات ذكية
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg font-tajawal">
                            تقارير مفصلة ومباشرة
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                    {!user && (
                        <>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg shadow-lg transition-all hover:scale-105 whitespace-nowrap font-tajawal text-center"
                            >
                                ابدأ تجربتك المجانية
                            </Link>
                            <Link
                                to="/menu?restaurant=demo&table=1"
                                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg transition-all hover:scale-105 whitespace-nowrap font-tajawal text-center"
                            >
                                شاهد العرض التوضيحي
                            </Link>
                        </>
                    )}
                    {user && (
                        <Link
                            to={
                                user.role === "restaurant_admin"
                                    ? "/admin"
                                    : user.role === "cashier"
                                    ? "/cashier"
                                    : "/chef"
                            }
                            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg shadow-lg transition-all hover:scale-105 whitespace-nowrap font-tajawal text-center"
                        >
                            انتقل إلى لوحة التحكم
                        </Link>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 text-gray-300 px-4">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-400 font-cairo">
                            500+
                        </div>
                        <div className="text-xs sm:text-sm md:text-base font-tajawal">مطعم نشط</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-400 font-cairo">
                            50K+
                        </div>
                        <div className="text-xs sm:text-sm md:text-base font-tajawal">طلب يومي</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-orange-400 font-cairo">
                            99%
                        </div>
                        <div className="text-xs sm:text-sm md:text-base font-tajawal">رضا العملاء</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                <div className="animate-bounce">
                    <i className="ri-arrow-down-line text-white text-2xl"></i>
                </div>
            </div>
        </div>
    );
}
