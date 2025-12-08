import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Spinner from "../../components/common/Spinner";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        restaurantName: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const { signUp } = useAuth();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const validateStep1 = () => {
        return formData.restaurantName && formData.fullName && formData.email;
    };

    const validateStep2 = () => {
        return (
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword &&
            formData.password.length >= 6
        );
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            setError("");
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            setError("");
        } else {
            setError("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("كلمات المرور غير متطابقة");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            setLoading(false);
            return;
        }

        try {
            // Create restaurant first
            const restaurantSlug = generateSlug(formData.restaurantName);

            const { data: restaurant, error: restaurantError } = await supabase
                .from("restaurants")
                .insert({
                    name: formData.restaurantName,
                    slug: restaurantSlug,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                })
                .select()
                .single();

            if (restaurantError) {
                setError(restaurantError.message);
                setLoading(false);
                return;
            }

            // Create admin user
            const result = await signUp(
                formData.email,
                formData.password,
                formData.fullName,
                "restaurant_admin",
                restaurant.id
            );

            if (result.success) {
                window.location.href = "/dashboard";
            } else {
                setError(result.error || "فشل في إنشاء الحساب");
            }
        } catch (error) {
            setError("فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                        إنشاء حساب مطعم جديد
                    </h2>
                    <p className="text-gray-600">ابدأ رحلتك الرقمية مع QTap</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 1
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        }`}
                    >
                        1
                    </div>
                    <div
                        className={`w-12 h-1 ${
                            currentStep >= 2 ? "bg-orange-500" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 2
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        }`}
                    >
                        2
                    </div>
                    <div
                        className={`w-12 h-1 ${
                            currentStep >= 3 ? "bg-orange-500" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            currentStep >= 3
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-600"
                        }`}
                    >
                        3
                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <i className="ri-error-warning-line text-red-400 text-lg"></i>
                                    </div>
                                    <div className="mr-3">
                                        <p
                                            className="text-sm text-red-7

0"
                                        >
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        معلومات أساسية
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        أدخل معلومات المطعم الأساسية
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="restaurantName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        اسم المطعم *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-restaurant-line text-gray-400"></i>
                                        </div>
                                        <input
                                            id="restaurantName"
                                            name="restaurantName"
                                            type="text"
                                            required
                                            value={formData.restaurantName}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أدخل اسم المطعم"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        اسمك الكامل *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-user-line text-gray-400"></i>
                                        </div>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أدخل اسمك الكامل"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        البريد الإلكتروني *
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
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أدخل البريد الإلكتروني"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 whitespace-nowrap"
                                >
                                    التالي
                                    <i className="ri-arrow-left-line mr-2"></i>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Security */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        كلمة المرور
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        اختر كلمة مرور قوية لحسابك
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        كلمة المرور *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-lock-line text-gray-400"></i>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أدخل كلمة المرور"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        يجب أن تكون 6 أحرف على الأقل
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        تأكيد كلمة المرور *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-lock-2-line text-gray-400"></i>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أعد إدخال كلمة المرور"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 whitespace-nowrap"
                                    >
                                        <i className="ri-arrow-right-line ml-2"></i>
                                        السابق
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 whitespace-nowrap"
                                    >
                                        التالي
                                        <i className="ri-arrow-left-line mr-2"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Additional Info */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        معلومات إضافية
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        معلومات اختيارية لتحسين تجربتك
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        رقم الهاتف
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <i className="ri-phone-line text-gray-400"></i>
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                                            placeholder="أدخل رقم الهاتف"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        عنوان المطعم
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                                            <i className="ri-map-pin-line text-gray-400"></i>
                                        </div>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
                                            placeholder="أدخل عنوان المطعم"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 whitespace-nowrap"
                                    >
                                        <i className="ri-arrow-right-line ml-2"></i>
                                        السابق
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    size="sm"
                                                    color="white"
                                                    className="ml-2"
                                                />
                                                جاري إنشاء الحساب...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-check-line ml-2"></i>
                                                إنشاء الحساب
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            لديك حساب بالفعل؟{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
                            >
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        بإنشاء حساب، فإنك توافق على{" "}
                        <Link
                            to="/legal/terms"
                            className="text-orange-600 hover:text-orange-500"
                        >
                            شروط الخدمة
                        </Link>{" "}
                        و{" "}
                        <Link
                            to="/legal/privacy"
                            className="text-orange-600 hover:text-orange-500"
                        >
                            سياسة الخصوصية
                        </Link>
                        . ستحصل على تجربة مجانية لمدة 14 يوماً.
                    </p>
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
