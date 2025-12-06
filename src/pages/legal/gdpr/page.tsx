
import { Link } from 'react-router-dom'

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shield-user-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">حماية البيانات (GDPR)</h1>
            <p className="text-xl text-purple-100 font-tajawal">
              متوافقون مع لائحة حماية البيانات الأوروبية للحفاظ على خصوصيتك
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-purple-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-purple-500 font-semibold font-tajawal">حماية البيانات (GDPR)</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <i className="ri-calendar-line text-purple-500 text-xl"></i>
              <div>
                <h3 className="font-semibold text-gray-900 font-cairo">آخر تحديث</h3>
                <p className="text-gray-600 font-tajawal">15 ديسمبر 2024</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">ما هي لائحة GDPR؟</h2>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 mb-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-information-line text-purple-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal leading-relaxed mb-4">
                    اللائحة العامة لحماية البيانات (GDPR) هي قانون أوروبي شامل لحماية البيانات والخصوصية يطبق على جميع الأفراد داخل الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية.
                  </p>
                  <p className="text-gray-700 font-tajawal leading-relaxed">
                    في QTap، نحن ملتزمون بالامتثال الكامل لمتطلبات GDPR لضمان حماية بياناتك الشخصية وحقوقك في الخصوصية.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GDPR Principles */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">مبادئ GDPR التي نطبقها</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-check-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">الشرعية والعدالة</h3>
                <p className="text-gray-700 font-tajawal">
                  نعالج بياناتك بطريقة قانونية وعادلة وشفافة، ونحصل على موافقتك الصريحة قبل جمع أي بيانات شخصية.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-target-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">تحديد الغرض</h3>
                <p className="text-gray-700 font-tajawal">
                  نجمع البيانات لأغراض محددة ومشروعة وصريحة، ولا نستخدمها لأغراض أخرى غير متوافقة مع الغرض الأصلي.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-database-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">تقليل البيانات</h3>
                <p className="text-gray-700 font-tajawal">
                  نجمع فقط البيانات الضرورية والمناسبة لتحقيق الأغراض المحددة، ولا نجمع بيانات زائدة عن الحاجة.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-time-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">تحديد المدة</h3>
                <p className="text-gray-700 font-tajawal">
                  نحتفظ ببياناتك فقط للمدة اللازمة لتحقيق الأغراض المحددة، ونحذفها عند انتهاء الحاجة إليها.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">حقوقك تحت GDPR</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-eye-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق الوصول (المادة 15)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك الحصول على نسخة من بياناتك الشخصية التي نحتفظ بها ومعلومات حول كيفية معالجتها.
                    </p>
                    <button className="bg-blue-500 text-white hover:bg-blue-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      طلب الوصول للبيانات
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-edit-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق التصحيح (المادة 16)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك طلب تصحيح البيانات الشخصية غير الدقيقة أو إكمال البيانات الناقصة.
                    </p>
                    <button className="bg-green-500 text-white hover:bg-green-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      طلب تصحيح البيانات
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-delete-bin-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق المحو "الحق في النسيان" (المادة 17)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك طلب حذف بياناتك الشخصية في ظروف معينة، مثل سحب الموافقة أو عدم الحاجة للبيانات.
                    </p>
                    <button className="bg-red-500 text-white hover:bg-red-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      طلب حذف البيانات
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-pause-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق تقييد المعالجة (المادة 18)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك طلب تقييد معالجة بياناتك الشخصية في ظروف معينة، مثل الطعن في دقة البيانات.
                    </p>
                    <button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      طلب تقييد المعالجة
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-download-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق نقل البيانات (المادة 20)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك الحصول على بياناتك بتنسيق منظم ومقروء آلياً ونقلها إلى مراقب آخر.
                    </p>
                    <button className="bg-purple-500 text-white hover:bg-purple-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      طلب نقل البيانات
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-close-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حق الاعتراض (المادة 21)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      يحق لك الاعتراض على معالجة بياناتك الشخصية في ظروف معينة، بما في ذلك التسويق المباشر.
                    </p>
                    <button className="bg-gray-500 text-white hover:bg-gray-600 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap font-tajawal text-sm">
                      تقديم اعتراض
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Processing */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">أسس معالجة البيانات</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <p className="text-gray-700 font-tajawal mb-6">
                نعالج بياناتك الشخصية بناءً على الأسس القانونية التالية وفقاً للمادة 6 من GDPR:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">الموافقة</h4>
                      <p className="text-gray-700 text-sm font-tajawal">موافقتك الصريحة على معالجة بياناتك</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">تنفيذ العقد</h4>
                      <p className="text-gray-700 text-sm font-tajawal">ضرورية لتنفيذ عقد الخدمة معك</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">الالتزام القانوني</h4>
                      <p className="text-gray-700 text-sm font-tajawal">للامتثال للالتزامات القانونية</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">المصالح الحيوية</h4>
                      <p className="text-gray-700 text-sm font-tajawal">لحماية المصالح الحيوية لك أو لشخص آخر</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">المهمة العامة</h4>
                      <p className="text-gray-700 text-sm font-tajawal">لأداء مهمة تحقق المصلحة العامة</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 text-xl mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">المصالح المشروعة</h4>
                      <p className="text-gray-700 text-sm font-tajawal">لمصالحنا المشروعة أو مصالح طرف ثالث</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">أمان البيانات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lock-line text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">التشفير المتقدم</h3>
                <p className="text-gray-700 text-sm font-tajawal">
                  جميع البيانات محمية بتشفير AES-256 أثناء النقل والتخزين
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-shield-check-line text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">المراقبة المستمرة</h3>
                <p className="text-gray-700 text-sm font-tajawal">
                  مراقبة أمنية على مدار الساعة لاكتشاف أي تهديدات محتملة
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-settings-line text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-cairo">التحكم في الوصول</h3>
                <p className="text-gray-700 text-sm font-tajawal">
                  وصول محدود للموظفين المخولين فقط مع تسجيل جميع العمليات
                </p>
              </div>
            </div>
          </section>

          {/* Data Breach */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">إجراءات خرق البيانات</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <i className="ri-alert-line text-red-500 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">التزامنا في حالة خرق البيانات</h3>
                  <p className="text-gray-700 font-tajawal">
                    في حالة حدوث خرق للبيانات الشخصية، نلتزم بالإجراءات التالية وفقاً للمادة 33 و 34 من GDPR:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">الإبلاغ للسلطات:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• إبلاغ السلطة الإشرافية خلال 72 ساعة</li>
                    <li>• تقديم تفاصيل شاملة عن الخرق</li>
                    <li>• وصف الإجراءات المتخذة للمعالجة</li>
                    <li>• تقييم المخاطر المحتملة</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">إشعار المستخدمين:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• إشعار فوري للمستخدمين المتأثرين</li>
                    <li>• شرح طبيعة الخرق وتأثيره</li>
                    <li>• توضيح الإجراءات الوقائية المتخذة</li>
                    <li>• تقديم توصيات للحماية الذاتية</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact DPO */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">مسؤول حماية البيانات</h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-star-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">تواصل مع مسؤول حماية البيانات</h3>
                  <p className="text-gray-700 font-tajawal">
                    لدينا مسؤول مخصص لحماية البيانات (DPO) للإجابة على استفساراتك ومساعدتك في ممارسة حقوقك.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-purple-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد الإلكتروني</p>
                  <p className="text-gray-700 font-tajawal">dpo@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-purple-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الهاتف المباشر</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4568</p>
                </div>

                <div>
                  <i className="ri-map-pin-line text-purple-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">العنوان البريدي</p>
                  <p className="text-gray-700 font-tajawal">ص.ب 12345، الرياض 11564</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-purple-500 text-white hover:bg-purple-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
                >
                  <i className="ri-message-line ml-2"></i>
                  تواصل مع مسؤول حماية البيانات
                </Link>
              </div>
            </div>
          </section>

          {/* Complaint Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">حق تقديم الشكاوى</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <i className="ri-feedback-line text-yellow-500 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">حقك في تقديم شكوى</h3>
                  <p className="text-gray-700 font-tajawal mb-4">
                    إذا كنت تعتقد أننا لا نتعامل مع بياناتك الشخصية وفقاً لـ GDPR، يحق لك تقديم شكوى إلى:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 font-cairo">السلطات المحلية:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <i className="ri-government-line text-yellow-500"></i>
                      <span className="text-gray-700 font-tajawal">هيئة حماية البيانات السعودية</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <i className="ri-phone-line text-yellow-500"></i>
                      <span className="text-gray-700 font-tajawal">+966 11 456 7890</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <i className="ri-mail-line text-yellow-500"></i>
                      <span className="text-gray-700 font-tajawal">complaints@sdaia.gov.sa</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 font-cairo">السلطات الأوروبية:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <i className="ri-global-line text-yellow-500"></i>
                      <span className="text-gray-700 font-tajawal">السلطة الإشرافية في بلد إقامتك</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <i className="ri-external-link-line text-yellow-500"></i>
                      <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-tajawal">
                        قائمة السلطات الإشرافية الأوروبية
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
