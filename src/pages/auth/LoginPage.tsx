import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // توجيه المستخدم حسب دوره
            switch (user.role) {
                case "super_admin":
                    navigate("/dashboard/admin");
                    break;
                case "restaurant_admin":
                    navigate("/dashboard/admin");
                    break;
                case "cashier":
                    navigate("/dashboard/cashier");
                    break;
                case "chef":
                    navigate("/dashboard/chef");
                    break;
                case "waiter":
                    navigate("/dashboard/waiter");
                    break;
                default:
                    navigate("/dashboard/admin");
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn(email, password);

        if (!result.success) {
            setError(result.error || "فشل في تسجيل الدخول");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex justify-center">
                        <img
                            src="/logo-login.svg"
                            alt="QTap Logo"
                            className="h-36 w-auto"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        مرحباً بك مرة أخرى
                    </h2>
                    <p className="text-gray-600">
                        سجل دخولك للوصول إلى لوحة التحكم
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <i className="ri-error-warning-line text-red-400 text-lg"></i>
                                    </div>
                                    <div className="mr-3">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-400"></i>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                    placeholder="أدخل بريدك الإلكتروني"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-gray-400"></i>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                    placeholder="أدخل كلمة المرور"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="mr-2 block text-sm text-gray-700"
                                >
                                    تذكرني
                                </label>
                            </div>

                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                >
                                    نسيت كلمة المرور؟
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                <>
                                    <i className="ri-login-circle-line ml-2"></i>
                                    تسجيل الدخول
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">
                                    حسابات تجريبية
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-blue-900 text-sm">
                                            مدير المطعم
                                        </p>
                                        <p className="text-blue-700 text-xs">
                                            admin@restaurant.com
                                        </p>
                                    </div>
                                    <div className="text-blue-600">
                                        <i className="ri-admin-line text-lg"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-green-900 text-sm">
                                            الكاشير
                                        </p>
                                        <p className="text-green-700 text-xs">
                                            cashier@restaurant.com
                                        </p>
                                    </div>
                                    <div className="text-green-600">
                                        <i className="ri-money-dollar-circle-line text-lg"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-purple-900 text-sm">
                                            الشيف
                                        </p>
                                        <p className="text-purple-700 text-xs">
                                            chef@restaurant.com
                                        </p>
                                    </div>
                                    <div className="text-purple-600">
                                        <i className="ri-restaurant-line text-lg"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            كلمة المرور لجميع الحسابات:{" "}
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                123456
                            </span>
                        </p>
                    </div>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ليس لديك حساب؟{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                إنشاء حساب مطعم جديد
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
                    >
                        <i className="ri-arrow-right-line ml-1"></i>
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}
