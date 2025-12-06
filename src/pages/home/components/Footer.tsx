import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitMessage('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);

      const response = await fetch('https://readdy.ai/api/form/d3mcqt5es84r01urdgv0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (response.ok) {
        setSubmitMessage('تم الاشتراك بنجاح! شكراً لك');
        setEmail('');
      } else {
        setSubmitMessage('حدث خطأ، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      setSubmitMessage('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white font-arabic">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-restaurant-line text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>QTap</span>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-body-large">
              نحن شركة تقنية متخصصة في رقمنة قطاع المطاعم من خلال حلول مبتكرة وسهلة الاستخدام.
              نقدم نظام الطلب المبتكر عبر رمز QR، والقوائم الرقمية القابلة للتخصيص، والمدفوعات السلسة على الطاولة.
            </p>

            <div className="flex space-x-4">
              <a href="https://facebook.com/qtap" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="https://twitter.com/qtap" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
              <a href="https://instagram.com/qtap" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a href="https://linkedin.com/company/qtap" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-lg"></i>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">المنتج</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">المميزات الأساسية</a></li>
              <li><a href="#pricing" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">خطط الأسعار</a></li>
              <li><Link to="/menu?restaurant=demo&table=1" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">العرض التوضيحي</Link></li>
              <li><a href="#integration" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">واجهة برمجة التطبيقات</a></li>
              <li><a href="#analytics" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">التحليلات والتقارير</a></li>
              <li><Link to="/register" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">التجربة المجانية</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الشركة</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">من نحن</Link></li>
              <li><a href="#careers" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">الوظائف المتاحة</a></li>
              <li><a href="#press" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">الأخبار والصحافة</a></li>
              <li><Link to="/contact" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">اتصل بنا</Link></li>
              <li><a href="#partners" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">شركاؤنا</a></li>
              <li><a href="#investors" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">المستثمرون</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الدعم</h3>
            <ul className="space-y-3">
              <li><a href="#help" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">مركز المساعدة</a></li>
              <li><a href="#docs" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">دليل الاستخدام</a></li>
              <li><a href="#training" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">التدريب والدورات</a></li>
              <li><a href="#status" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">حالة الخدمة</a></li>
              <li><a href="#community" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">المجتمع</a></li>
              <li><a href="#feedback" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">اقتراحاتك</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">قانوني</h3>
            <ul className="space-y-3">
              <li><Link to="/legal/privacy" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">سياسة الخصوصية</Link></li>
              <li><Link to="/legal/terms" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">شروط الاستخدام</Link></li>
              <li><Link to="/legal/cookies" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">سياسة ملفات تعريف الارتباط</Link></li>
              <li><Link to="/legal/gdpr" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">حماية البيانات GDPR</Link></li>
              <li><Link to="/legal/security" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">الأمان والحماية</Link></li>
              <li><Link to="/legal/compliance" className="footer-text text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">الامتثال القانوني</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">ابق على اطلاع دائم</h3>
              <p className="text-gray-400 text-body">احصل على آخر الأخبار والتحديثات والنصائح المفيدة حول QTap مباشرة في بريدك الإلكتروني</p>
            </div>
            
            <form 
              onSubmit={handleNewsletterSubmit}
              data-readdy-form
              className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
            >
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="input-field bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 flex-1 lg:w-80"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:bg-orange-400 whitespace-nowrap"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'اشترك الآن'}
              </button>
            </form>
          </div>
          
          {submitMessage && (
            <div className={`mt-4 text-center text-small ${submitMessage.includes('بنجاح') ? 'text-green-400' : 'text-red-400'}`}>
              {submitMessage}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 footer-text">
            © 2024 QTap. جميع الحقوق محفوظة. مسجل في المملكة العربية السعودية.
          </p>
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-400 footer-text">صُنع بـ ❤️ للمطاعم العربية</span>
            <a 
              href="https://readdy.ai/?origin=logo" 
              className="text-gray-400 hover:text-orange-400 footer-text transition-colors cursor-pointer"
            >
              مدعوم من Readdy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}