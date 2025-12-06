
import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shield-check-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">سياسة الخصوصية</h1>
            <p className="text-xl text-orange-100 font-tajawal">
              نلتزم بحماية بيانات مستخدمينا وفق أعلى معايير الأمان والشفافية
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-orange-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-orange-500 font-semibold font-tajawal">سياسة الخصوصية</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <i className="ri-calendar-line text-orange-500 text-xl"></i>
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
                نحن في QTap نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وفقًا لأعلى معايير الأمان والامتثال.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">1. المعلومات التي نجمعها</h2>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8 mb-8">
              <p className="text-gray-700 font-tajawal mb-6">
                نقوم بجمع المعلومات التالية عند استخدامك للخدمة:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <i className="ri-user-line text-orange-500 text-xl"></i>
                    <span className="font-tajawal">بيانات التسجيل (الاسم، البريد الإلكتروني، رقم الهاتف)</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <i className="ri-bar-chart-line text-orange-500 text-xl"></i>
                    <span className="font-tajawal">بيانات الاستخدام (الطلبات، الأنشطة داخل التطبيق، العروض المفضلة)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <i className="ri-credit-card-line text-orange-500 text-xl"></i>
                    <span className="font-tajawal">بيانات الدفع (عبر مزود الخدمة الآمن Paymob)</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <i className="ri-computer-line text-orange-500 text-xl"></i>
                    <span className="font-tajawal">معلومات تقنية مثل عنوان الـ IP ونوع الجهاز لتطوير الأداء</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">2. كيفية استخدام المعلومات</h2>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <p className="text-gray-700 font-tajawal mb-6">
                نستخدم بياناتك من أجل:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">تشغيل الخدمات وتحسين تجربة المستخدم.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">إرسال التحديثات والعروض الخاصة بالمطعم.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">دعم الأمان ومكافحة الاحتيال.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="ri-check-line text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-gray-700 font-tajawal">إنشاء تقارير تحليلية مجهولة الهوية لتحسين المنصة.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">3. مشاركة المعلومات</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-shield-check-line text-red-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      لا نقوم ببيع بيانات المستخدمين أو مشاركتها مع أطراف ثالثة إلا في الحالات الضرورية لتقديم الخدمة (مثل بوابات الدفع أو مزودي الاستضافة).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 space-x-reverse">
                  <i className="ri-scales-line text-red-500 text-2xl mt-1"></i>
                  <div>
                    <p className="text-gray-700 font-tajawal">
                      قد نشارك بيانات محدودة مع الجهات القانونية عند وجود التزام نظامي.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">4. حماية البيانات</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-lock-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">تشفير SSL</h3>
                  <p className="text-gray-700 text-sm font-tajawal">نستخدم تقنيات تشفير متقدمة (SSL) لحماية البيانات أثناء النقل والتخزين</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-server-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">خوادم آمنة</h3>
                  <p className="text-gray-700 text-sm font-tajawal">يتم تخزين المعلومات في خوادم آمنة داخل مراكز بيانات معتمدة</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-eye-off-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">وصول محدود</h3>
                  <p className="text-gray-700 text-sm font-tajawal">نطبق إجراءات وصول مقيدة مبنية على الصلاحيات</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">5. ملفات تعريف الارتباط (Cookies)</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-cookie-line text-yellow-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal">
                    نستخدم ملفات تعريف الارتباط لتحسين الأداء وتخصيص تجربة المستخدم. يمكنك تعطيلها من إعدادات المتصفح في أي وقت.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">6. حقوق المستخدم</h2>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <p className="text-gray-700 font-tajawal mb-6">يحق للمستخدم:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">الوصول والتعديل</h3>
                  <p className="text-gray-700 mb-4 font-tajawal">الوصول إلى بياناته أو طلب تعديلها.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">الحذف</h3>
                  <p className="text-gray-700 mb-4 font-tajawal">طلب حذف حسابه بشكل نهائي.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">إلغاء الاشتراك</h3>
                  <p className="text-gray-700 mb-4 font-tajawal">الانسحاب من الاشتراك في الرسائل الإعلانية.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">7. التحديثات</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-refresh-line text-green-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal">
                    قد نقوم بتحديث هذه السياسة من حين لآخر. سيتم إخطار المستخدمين بأي تعديل جوهري عبر البريد الإلكتروني أو إشعار داخل المنصة.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تواصل معنا</h2>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">هل لديك أسئلة حول سياسة الخصوصية؟</h3>
                <p className="text-gray-700 font-tajawal">نحن هنا لمساعدتك وتوضيح أي استفسارات</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-orange-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد الإلكتروني</p>
                  <p className="text-gray-700 font-tajawal">privacy@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-orange-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الهاتف</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4567</p>
                </div>

                <div>
                  <i className="ri-map-pin-line text-orange-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">العنوان</p>
                  <p className="text-gray-700 font-tajawal">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
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
