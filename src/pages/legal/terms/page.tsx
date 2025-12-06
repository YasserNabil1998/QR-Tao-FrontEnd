
import { Link } from 'react-router-dom'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-file-text-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">شروط الخدمة</h1>
            <p className="text-xl text-blue-100 font-tajawal">
              تعرف على القواعد التي تنظم استخدامك لمنصة QTap وخدماتها
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-blue-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-blue-500 font-semibold font-tajawal">شروط الخدمة</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <i className="ri-calendar-line text-blue-500 text-xl"></i>
              <div>
                <h3 className="font-semibold text-gray-900 font-cairo">آخر تحديث</h3>
                <p className="text-gray-600 font-tajawal">15 ديسمبر 2024</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">مقدمة</h2>
            <div className="prose prose-lg max-w-none text-gray-700 font-tajawal leading-relaxed">
              <p className="mb-6">
                مرحباً بك في منصة QTap، وهي منصة رقمية تقدم خدمات إدارة الطلبات الرقمية للمطاعم عبر تقنية رموز QR والقوائم التفاعلية.
              </p>
              <p className="mb-6">
                يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا، إذ يُعدّ استخدامك للمنصة قبولًا صريحًا لهذه الشروط والأحكام.
              </p>
            </div>
          </section>

          {/* Service Usage */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">1. استخدام الخدمة</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يُسمح باستخدام منصة QTap فقط للأغراض التجارية الخاصة بالمطاعم والمقاهي المرخصة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يتحمل المستخدم مسؤولية دقة البيانات التي يقدمها أثناء التسجيل أو إدارة الطلبات.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      تحتفظ QTap بالحق في تعليق أو إلغاء الحسابات التي تخالف سياسات الاستخدام أو القوانين المحلية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Subscriptions and Payments */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">2. الاشتراكات والمدفوعات</h2>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-money-dollar-circle-line text-green-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      قد تُقدّم QTap خدمات مجانية وأخرى مدفوعة تختلف في المزايا والإمكانات.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-calculator-line text-green-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يتم احتساب أي رسوم اشتراك أو عمولات بشكل شفاف وفق الخطط المعلنة في الموقع.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-notification-line text-green-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يحق لـ QTap تعديل الأسعار أو الخطط مع إشعار مسبق للمستخدمين المسجلين.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">3. الملكية الفكرية</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-copyright-line text-orange-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      جميع حقوق العلامات التجارية والتصاميم والمحتوى النصي والبرمجي مملوكة لـ QTap أو مرخّصة لها.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-forbid-line text-orange-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يُمنع نسخ أو إعادة استخدام أي جزء من النظام دون إذن خطي مسبق.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">4. المسؤولية</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-alert-line text-red-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      تُقدّم المنصة كما هي ("As is") دون أي ضمانات مباشرة أو ضمنية.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-shield-cross-line text-red-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      لا تتحمل QTap أي مسؤولية عن خسائر مباشرة أو غير مباشرة ناتجة عن استخدام الخدمة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-user-line text-red-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يتحمل المستخدم المسؤولية الكاملة عن أي محتوى يتم إدخاله أو نشره عبر حسابه.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service Modifications */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">5. التعديلات على الخدمة</h2>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-refresh-line text-blue-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      يحق لـ QTap تحديث أو تعديل الخدمات من وقت لآخر لتحسين الأداء أو إضافة مزايا جديدة.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-mail-line text-blue-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو داخل لوحة التحكم.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Applicable Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">6. القانون المعمول به</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-scales-line text-green-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal">
                    تخضع هذه الشروط لأنظمة المملكة العربية السعودية، ويُعتبر أي نزاع ناشئ عنها من اختصاص الجهات القضائية في الرياض.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تواصل معنا</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">هل لديك أسئلة حول شروط الخدمة؟</h3>
                <p className="text-gray-700 font-tajawal">فريقنا القانوني جاهز لمساعدتك</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-blue-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد الإلكتروني</p>
                  <p className="text-gray-700 font-tajawal">legal@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-blue-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الهاتف</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4567</p>
                </div>

                <div>
                  <i className="ri-time-line text-blue-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">ساعات العمل</p>
                  <p className="text-gray-700 font-tajawal">الأحد - الخميس: 9ص - 6م</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
                >
                  <i className="ri-message-line ml-2"></i>
                  تواصل معنا
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
