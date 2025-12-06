
import { Link } from 'react-router-dom'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-cookie-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">سياسة ملفات تعريف الارتباط</h1>
            <p className="text-xl text-green-100 font-tajawal">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتخصيص خدماتنا لك
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-green-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-green-500 font-semibold font-tajawal">سياسة ملفات تعريف الارتباط</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <i className="ri-calendar-line text-green-500 text-xl"></i>
              <div>
                <h3 className="font-semibold text-gray-900 font-cairo">آخر تحديث</h3>
                <p className="text-gray-600 font-tajawal">15 ديسمبر 2024</p>
              </div>
            </div>
          </div>

          {/* What are Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">ما هي ملفات تعريف الارتباط؟</h2>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8 mb-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-information-line text-green-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal leading-relaxed mb-4">
                    ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم حفظها على جهازك عند زيارة موقعنا الإلكتروني. تساعدنا هذه الملفات في تذكر تفضيلاتك وتحسين تجربة استخدامك للمنصة.
                  </p>
                  <p className="text-gray-700 font-tajawal leading-relaxed">
                    نحن نستخدم ملفات تعريف الارتباط لجعل موقعنا يعمل بشكل أفضل وأكثر أماناً، وتقديم تجربة مخصصة لكل مستخدم.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">أنواع ملفات تعريف الارتباط</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-settings-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">ملفات ضرورية</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  ضرورية لتشغيل الموقع بشكل صحيح ولا يمكن تعطيلها.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• تسجيل الدخول والمصادقة</li>
                  <li>• حفظ إعدادات الأمان</li>
                  <li>• تذكر اللغة المختارة</li>
                  <li>• حماية من الهجمات الإلكترونية</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-bar-chart-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">ملفات تحليلية</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  تساعدنا في فهم كيفية استخدام الزوار للموقع.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• عدد الزوار والصفحات المشاهدة</li>
                  <li>• مدة البقاء في الموقع</li>
                  <li>• مصادر الزيارات</li>
                  <li>• تحسين أداء الموقع</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-user-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">ملفات وظيفية</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  تحسن من وظائف الموقع وتخصص التجربة.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• تذكر التفضيلات الشخصية</li>
                  <li>• حفظ إعدادات العرض</li>
                  <li>• تخصيص المحتوى</li>
                  <li>• تحسين سرعة التحميل</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-advertisement-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">ملفات تسويقية</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  تستخدم لعرض إعلانات مناسبة لاهتماماتك.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• تتبع سلوك التصفح</li>
                  <li>• عرض إعلانات مخصصة</li>
                  <li>• قياس فعالية الحملات</li>
                  <li>• تحسين الاستهداف</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">كيف نستخدم ملفات تعريف الارتباط</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">تحسين الأداء</h3>
                  <p className="text-gray-700 font-tajawal">نستخدم ملفات تعريف الارتباط لتسريع تحميل الصفحات وتحسين استجابة الموقع.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">تخصيص التجربة</h3>
                  <p className="text-gray-700 font-tajawal">حفظ تفضيلاتك مثل اللغة والعملة وإعدادات العرض لتوفير تجربة مخصصة.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">الأمان</h3>
                  <p className="text-gray-700 font-tajawal">حماية حسابك من الوصول غير المصرح به والحفاظ على أمان جلسة العمل.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">التحليل والتطوير</h3>
                  <p className="text-gray-700 font-tajawal">فهم كيفية استخدام المنصة لتطوير ميزات جديدة وتحسين الخدمات الحالية.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">إدارة ملفات تعريف الارتباط</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">التحكم في المتصفح</h3>
                  <p className="text-gray-700 font-tajawal mb-4">
                    يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك:
                  </p>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• قبول أو رفض ملفات تعريف الارتباط</li>
                    <li>• حذف ملفات تعريف الارتباط الموجودة</li>
                    <li>• تلقي تنبيهات عند إنشاء ملفات جديدة</li>
                    <li>• تعطيل ملفات تعريف الارتباط نهائياً</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">إعدادات المنصة</h3>
                  <p className="text-gray-700 font-tajawal mb-4">
                    نوفر لك خيارات للتحكم في ملفات تعريف الارتباط:
                  </p>
                  <div className="space-y-3">
                    <button className="w-full bg-green-500 text-white hover:bg-green-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal">
                      <i className="ri-settings-line ml-2"></i>
                      إعدادات ملفات تعريف الارتباط
                    </button>
                    <button className="w-full bg-gray-500 text-white hover:bg-gray-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal">
                      <i className="ri-delete-bin-line ml-2"></i>
                      حذف جميع ملفات تعريف الارتباط
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Browser Instructions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تعليمات المتصفحات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-chrome-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">Google Chrome</h3>
                <p className="text-gray-700 text-sm font-tajawal mb-4">
                  الإعدادات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط
                </p>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 text-sm font-tajawal">
                  تعليمات مفصلة
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-firefox-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">Mozilla Firefox</h3>
                <p className="text-gray-700 text-sm font-tajawal mb-4">
                  الخيارات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط
                </p>
                <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 text-sm font-tajawal">
                  تعليمات مفصلة
                </a>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-safari-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">Safari</h3>
                <p className="text-gray-700 text-sm font-tajawal mb-4">
                  التفضيلات &gt; الخصوصية &gt; إدارة بيانات الموقع
                </p>
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 text-sm font-tajawal">
                  تعليمات مفصلة
                </a>
              </div>
            </div>
          </section>

          {/* Third Party Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">ملفات تعريف الارتباط من طرف ثالث</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <i className="ri-alert-line text-yellow-500 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">خدمات الطرف الثالث</h3>
                  <p className="text-gray-700 font-tajawal">
                    نستخدم خدمات من أطراف ثالثة قد تضع ملفات تعريف الارتباط الخاصة بها:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">خدمات التحليل:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• Google Analytics</li>
                    <li>• Hotjar</li>
                    <li>• Mixpanel</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">خدمات الدعم:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• Intercom</li>
                    <li>• Zendesk</li>
                    <li>• Crisp Chat</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 font-tajawal mt-6">
                هذه الخدمات لها سياسات خصوصية منفصلة ونشجعك على مراجعتها لفهم كيفية استخدامها لملفات تعريف الارتباط.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تواصل معنا</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">هل لديك أسئلة حول ملفات تعريف الارتباط؟</h3>
                <p className="text-gray-700 font-tajawal">نحن هنا لمساعدتك في فهم وإدارة ملفات تعريف الارتباط</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-green-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد الإلكتروني</p>
                  <p className="text-gray-700 font-tajawal">cookies@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-green-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الهاتف</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4567</p>
                </div>

                <div>
                  <i className="ri-customer-service-line text-green-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الدعم الفني</p>
                  <p className="text-gray-700 font-tajawal">متاح 24/7</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-green-500 text-white hover:bg-green-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
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
