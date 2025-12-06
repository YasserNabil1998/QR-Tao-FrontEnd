
import { Link } from 'react-router-dom'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shield-check-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">الأمان والحماية</h1>
            <p className="text-xl text-red-100 font-tajawal">
              نطبّق أنظمة تشفير وتحقق متقدمة لحماية معلوماتك وعملياتك
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-red-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-red-500 font-semibold font-tajawal">الأمان والحماية</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Security Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">التزامنا بالأمان</h2>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 mb-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-shield-star-line text-red-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal leading-relaxed mb-4">
                    في QTap، نضع أمان بياناتك ومعلوماتك في المقدمة. نستخدم أحدث التقنيات والبروتوكولات الأمنية لضمان حماية شاملة لجميع العمليات والمعاملات.
                  </p>
                  <p className="text-gray-700 font-tajawal leading-relaxed">
                    فريقنا الأمني يعمل على مدار الساعة لمراقبة وحماية منصتنا من أي تهديدات محتملة، مع التحديث المستمر لأنظمة الحماية.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">ميزات الأمان المتقدمة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-lock-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">تشفير متقدم</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نستخدم تشفير AES-256 لحماية جميع البيانات أثناء النقل والتخزين.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• تشفير SSL/TLS للاتصالات</li>
                  <li>• تشفير قاعدة البيانات</li>
                  <li>• تشفير النسخ الاحتياطية</li>
                  <li>• مفاتيح تشفير محدثة دورياً</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-user-settings-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">المصادقة المتعددة</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نظام مصادقة متعدد العوامل لضمان أمان الوصول للحسابات.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• رموز SMS التحقق</li>
                  <li>• تطبيقات المصادقة</li>
                  <li>• البصمة الحيوية</li>
                  <li>• مفاتيح الأمان الفيزيائية</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-eye-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">المراقبة المستمرة</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  مراقبة أمنية على مدار الساعة لاكتشاف أي أنشطة مشبوهة.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• كشف التسلل المتقدم</li>
                  <li>• تحليل السلوك الشاذ</li>
                  <li>• تنبيهات فورية للتهديدات</li>
                  <li>• سجلات مفصلة للأنشطة</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-shield-flash-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">الحماية من الهجمات</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  أنظمة متقدمة للحماية من جميع أنواع الهجمات الإلكترونية.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• حماية من DDoS</li>
                  <li>• منع هجمات SQL Injection</li>
                  <li>• حماية من XSS</li>
                  <li>• جدار حماية متقدم</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Infrastructure Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">أمان البنية التحتية</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-cloud-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">خوادم آمنة</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    خوادم معتمدة من AWS مع أعلى معايير الأمان العالمية
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-database-2-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">نسخ احتياطية</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    نسخ احتياطية مشفرة ومتعددة المواقع لضمان استمرارية الخدمة
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-global-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">شبكة CDN</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    شبكة توزيع محتوى عالمية لضمان الأداء والحماية
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance & Certifications */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الشهادات والامتثال</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">الشهادات الأمنية</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-award-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">ISO 27001</h4>
                      <p className="text-gray-600 text-sm font-tajawal">إدارة أمان المعلومات</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-shield-check-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">SOC 2 Type II</h4>
                      <p className="text-gray-600 text-sm font-tajawal">ضوابط الأمان والتوفر</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <i className="ri-lock-2-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">PCI DSS</h4>
                      <p className="text-gray-600 text-sm font-tajawal">أمان بيانات بطاقات الدفع</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">الامتثال القانوني</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <i className="ri-government-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">GDPR</h4>
                      <p className="text-gray-600 text-sm font-tajawal">لائحة حماية البيانات الأوروبية</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <i className="ri-flag-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">قانون حماية البيانات السعودي</h4>
                      <p className="text-gray-600 text-sm font-tajawal">الامتثال للقوانين المحلية</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <i className="ri-bank-line text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">معايير البنك المركزي</h4>
                      <p className="text-gray-600 text-sm font-tajawal">متطلبات الخدمات المالية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Practices */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الممارسات الأمنية</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-code-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">التطوير الآمن</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      نتبع أفضل الممارسات في التطوير الآمن مع مراجعة دورية للكود ومسح الثغرات الأمنية.
                    </p>
                    <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                      <li>• مراجعة الكود من قبل خبراء الأمان</li>
                      <li>• اختبارات الاختراق الدورية</li>
                      <li>• تحديثات أمنية منتظمة</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-team-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">تدريب الموظفين</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      جميع موظفينا يخضعون لتدريب مكثف على الأمان السيبراني وحماية البيانات.
                    </p>
                    <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                      <li>• تدريب دوري على الأمان السيبراني</li>
                      <li>• اختبارات التصيد الاحتيالي</li>
                      <li>• سياسات صارمة للوصول للبيانات</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-refresh-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">التحديث المستمر</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      نحدث أنظمتنا الأمنية باستمرار لمواجهة التهديدات الجديدة والناشئة.
                    </p>
                    <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                      <li>• تحديثات أمنية تلقائية</li>
                      <li>• مراقبة التهديدات العالمية</li>
                      <li>• تطوير دفاعات جديدة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Incident Response */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الاستجابة للحوادث</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <i className="ri-alarm-warning-line text-red-500 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">خطة الاستجابة السريعة</h3>
                  <p className="text-gray-700 font-tajawal">
                    لدينا خطة شاملة للاستجابة السريعة لأي حوادث أمنية محتملة:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">الكشف</h4>
                  <p className="text-gray-700 text-sm font-tajawal">كشف فوري للتهديدات</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">الاحتواء</h4>
                  <p className="text-gray-700 text-sm font-tajawal">عزل التهديد فوراً</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">المعالجة</h4>
                  <p className="text-gray-700 text-sm font-tajawal">إصلاح الثغرات</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">الاستعادة</h4>
                  <p className="text-gray-700 text-sm font-tajawal">استعادة الخدمة الطبيعية</p>
                </div>
              </div>
            </div>
          </section>

          {/* User Security Tips */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">نصائح الأمان للمستخدمين</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">حماية حسابك</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">استخدم كلمة مرور قوية وفريدة</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">فعّل المصادقة الثنائية</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">لا تشارك معلومات الدخول</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">سجّل الخروج من الأجهزة العامة</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">تصفح آمن</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">تأكد من رابط الموقع الصحيح</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">ابحث عن رمز القفل في المتصفح</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">احذر من الرسائل المشبوهة</span>
                    </li>
                    <li className="flex items-start space-x-3 space-x-reverse">
                      <i className="ri-check-line text-green-500 mt-1"></i>
                      <span className="text-gray-700 font-tajawal">حدّث متصفحك بانتظام</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Security Team */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تواصل مع فريق الأمان</h2>
            
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">هل اكتشفت مشكلة أمنية؟</h3>
                <p className="text-gray-700 font-tajawal">نحن نقدر جهودك في الحفاظ على أمان منصتنا</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-red-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد الأمني</p>
                  <p className="text-gray-700 font-tajawal">security@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-red-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الخط الساخن</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4569</p>
                </div>

                <div>
                  <i className="ri-time-line text-red-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الاستجابة</p>
                  <p className="text-gray-700 font-tajawal">خلال 24 ساعة</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-red-500 text-white hover:bg-red-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
                >
                  <i className="ri-shield-line ml-2"></i>
                  الإبلاغ عن مشكلة أمنية
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
