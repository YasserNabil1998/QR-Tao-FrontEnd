import { useState } from "react";
import { Link } from "react-router-dom";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            setSubmitMessage("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setSubmitMessage("يرجى إدخال بريد إلكتروني صحيح");
            return;
        }

        if (formData.message.length > 500) {
            setSubmitMessage("الرسالة يجب أن تكون أقل من 500 حرف");
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const submitData = new URLSearchParams();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            const response = await fetch(
                "https://readdy.ai/api/form/contact-form-qtap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: submitData,
                }
            );

            if (response.ok) {
                setSubmitMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    message: "",
                });
            } else {
                setSubmitMessage("حدث خطأ، يرجى المحاولة مرة أخرى");
            }
        } catch (error) {
            setSubmitMessage("حدث خطأ، يرجى المحاولة مرة أخرى");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-arabic">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/logo-Qr.svg"
                                alt="QTap Logo"
                                className="h-20 w-auto"
                            />
                        </Link>

                        <Link
                            to="/"
                            className="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
                        >
                            <i className="ri-home-line text-xl ml-2"></i>
                            العودة للرئيسية
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        اتصل بنا
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        نحن هنا لمساعدتك في كل خطوة من رحلتك الرقمية. تواصل معنا
                        وسنكون سعداء للإجابة على استفساراتك
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-phone-line text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                اتصل بنا
                            </h3>
                            <p className="text-gray-600 mb-2">
                                +966 11 123 4567
                            </p>
                            <p className="text-gray-600 mb-2">
                                +966 50 987 6543
                            </p>
                            <p className="text-gray-500 text-sm">
                                متاح 24/7 لخدمتك
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-mail-line text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                راسلنا
                            </h3>
                            <p className="text-gray-600 mb-2">
                                support@qtap.sa
                            </p>
                            <p className="text-gray-600 mb-2">sales@qtap.sa</p>
                            <p className="text-gray-500 text-sm">
                                نرد خلال 24 ساعة
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-map-pin-line text-white text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                زورنا
                            </h3>
                            <p className="text-gray-600 mb-2">
                                الرياض، المملكة العربية السعودية
                            </p>
                            <p className="text-gray-600 mb-2">
                                مركز الملك عبدالله المالي
                            </p>
                            <p className="text-gray-500 text-sm">
                                الأحد - الخميس: 9 ص - 6 م
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            أرسل لنا رسالة
                        </h2>
                        <p className="text-xl text-gray-600">
                            املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <form
                            onSubmit={handleSubmit}
                            data-readdy-form
                            id="contact-form"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        الاسم الكامل *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="أدخل اسمك الكامل"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        البريد الإلكتروني *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="أدخل بريدك الإلكتروني"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="أدخل رقم هاتفك"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="company"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        اسم المطعم/الشركة
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        placeholder="أدخل اسم مطعمك أو شركتك"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    الرسالة *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={6}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                                    placeholder="اكتب رسالتك هنا... (حد أقصى 500 حرف)"
                                    required
                                ></textarea>
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.message.length}/500 حرف
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors disabled:bg-orange-400 whitespace-nowrap"
                            >
                                {isSubmitting
                                    ? "جاري الإرسال..."
                                    : "إرسال الرسالة"}
                                <i className="ri-send-plane-line mr-2"></i>
                            </button>

                            {submitMessage && (
                                <div
                                    className={`mt-4 text-center text-sm ${
                                        submitMessage.includes("بنجاح")
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {submitMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            موقعنا
                        </h2>
                        <p className="text-xl text-gray-600">
                            تفضل بزيارتنا في مكتبنا الرئيسي في الرياض
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1234567890123!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1234567890123!5m2!1sen!2ssa"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="موقع QTap"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            الأسئلة الشائعة
                        </h2>
                        <p className="text-xl text-gray-600">
                            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                كم يستغرق تطبيق النظام في مطعمي؟
                            </h3>
                            <p className="text-gray-600">
                                عادة ما يستغرق التطبيق من 2-5 أيام عمل، حسب حجم
                                المطعم وتعقيد القائمة. فريقنا سيساعدك في كل خطوة
                                لضمان انتقال سلس.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                هل يمكنني تجربة النظام قبل الاشتراك؟
                            </h3>
                            <p className="text-gray-600">
                                نعم، نوفر تجربة مجانية لمدة 14 يوم مع إمكانية
                                الوصول لجميع المميزات. كما يمكنك مشاهدة العرض
                                التوضيحي المباشر على موقعنا.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                ما هي طرق الدفع المتاحة؟
                            </h3>
                            <p className="text-gray-600">
                                نقبل جميع طرق الدفع الرئيسية: البطاقات
                                الائتمانية، التحويل البنكي، والمحافظ الرقمية مثل
                                STC Pay و Apple Pay.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                هل تقدمون دعم فني على مدار الساعة؟
                            </h3>
                            <p className="text-gray-600">
                                نعم، نوفر دعم فني متاح 24/7 عبر الهاتف والبريد
                                الإلكتروني والدردشة المباشرة. فريق الدعم لدينا
                                مدرب ومتخصص في حل جميع المشاكل التقنية.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <img
                            src="/logo-Qr.svg"
                            alt="QTap Logo"
                            className="h-20 w-auto"
                        />
                    </div>

                    <p className="text-gray-400 mb-8">
                        © 2024 QTap. جميع الحقوق محفوظة.
                    </p>

                    <div className="flex justify-center space-x-6">
                        <a
                            href="https://facebook.com/qtap"
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-facebook-fill text-2xl"></i>
                        </a>
                        <a
                            href="https://twitter.com/qtap"
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-twitter-fill text-2xl"></i>
                        </a>
                        <a
                            href="https://instagram.com/qtap"
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-instagram-line text-2xl"></i>
                        </a>
                        <a
                            href="https://linkedin.com/company/qtap"
                            className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-linkedin-fill text-2xl"></i>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
