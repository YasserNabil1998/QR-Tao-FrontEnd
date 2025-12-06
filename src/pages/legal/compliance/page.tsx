
import { Link } from 'react-router-dom'

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-scales-line text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-cairo">الامتثال القانوني</h1>
            <p className="text-xl text-teal-100 font-tajawal">
              نلتزم بجميع القوانين المحلية والدولية الخاصة بحماية البيانات والمعاملات الرقمية
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 space-x-reverse py-4">
            <Link to="/" className="text-gray-600 hover:text-teal-500 font-tajawal">الرئيسية</Link>
            <i className="ri-arrow-left-s-line text-gray-400"></i>
            <span className="text-teal-500 font-semibold font-tajawal">الامتثال القانوني</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 space-x-reverse">
              <i className="ri-calendar-line text-teal-500 text-xl"></i>
              <div>
                <h3 className="font-semibold text-gray-900 font-cairo">آخر تحديث</h3>
                <p className="text-gray-600 font-tajawal">15 ديسمبر 2024</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">التزامنا بالامتثال القانوني</h2>
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-8 mb-8">
              <div className="flex items-start space-x-4 space-x-reverse">
                <i className="ri-award-line text-teal-500 text-2xl mt-1"></i>
                <div>
                  <p className="text-gray-700 font-tajawal leading-relaxed mb-4">
                    في QTap، نضع الامتثال القانوني في المقدمة. نحن ملتزمون بالعمل وفقاً لجميع القوانين واللوائح المعمول بها في المملكة العربية السعودية والاتحاد الأوروبي والولايات المتحدة الأمريكية.
                  </p>
                  <p className="text-gray-700 font-tajawal leading-relaxed">
                    فريقنا القانوني يعمل باستمرار لضمان تحديث سياساتنا وإجراءاتنا لتتماشى مع أحدث التطورات القانونية والتنظيمية في مجال التكنولوجيا المالية وحماية البيانات.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Local Compliance */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الامتثال للقوانين المحلية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-government-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">البنك المركزي السعودي (SAMA)</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نلتزم بجميع لوائح وتعليمات البنك المركزي السعودي الخاصة بالخدمات المالية والمدفوعات الرقمية.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• لوائح نظام المدفوعات</li>
                  <li>• متطلبات مكافحة غسل الأموال</li>
                  <li>• ضوابط الأمان السيبراني</li>
                  <li>• معايير حماية المستهلك</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-shield-user-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">هيئة الذكاء الاصطناعي والبيانات (SDAIA)</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نطبق جميع متطلبات حماية البيانات الشخصية وفقاً للوائح المملكة العربية السعودية.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• نظام حماية البيانات الشخصية</li>
                  <li>• لوائح الذكاء الاصطناعي</li>
                  <li>• معايير أمان البيانات</li>
                  <li>• حقوق أصحاب البيانات</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-store-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">وزارة التجارة</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نلتزم بقوانين التجارة الإلكترونية وحماية المستهلك في المملكة العربية السعودية.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• نظام التجارة الإلكترونية</li>
                  <li>• لوائح حماية المستهلك</li>
                  <li>• متطلبات الإفصاح</li>
                  <li>• ضوابط الإعلان والتسويق</li>
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-file-text-line text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-cairo">هيئة الزكاة والضريبة والجمارك</h3>
                <p className="text-gray-700 font-tajawal mb-4">
                  نطبق جميع الأنظمة الضريبية والزكوية المعمول بها في المملكة.
                </p>
                <ul className="text-gray-700 space-y-2 font-tajawal text-sm">
                  <li>• ضريبة القيمة المضافة</li>
                  <li>• الزكاة الشرعية</li>
                  <li>• الفوترة الإلكترونية</li>
                  <li>• التقارير الضريبية</li>
                </ul>
              </div>
            </div>
          </section>

          {/* International Compliance */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الامتثال للقوانين الدولية</h2>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-global-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">اللائحة العامة لحماية البيانات (GDPR)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      نلتزم بجميع متطلبات GDPR لحماية بيانات المواطنين الأوروبيين وضمان حقوقهم في الخصوصية.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• الحصول على موافقة صريحة</li>
                        <li>• حق الوصول والتصحيح</li>
                        <li>• حق المحو والنسيان</li>
                      </ul>
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• نقل البيانات</li>
                        <li>• الإبلاغ عن خرق البيانات</li>
                        <li>• تقييم الأثر على الخصوصية</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-flag-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">قانون خصوصية المستهلك في كاليفورنيا (CCPA)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      نحترم حقوق المستهلكين في كاليفورنيا ونوفر لهم التحكم الكامل في بياناتهم الشخصية.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• الحق في معرفة البيانات المجمعة</li>
                        <li>• الحق في حذف البيانات</li>
                        <li>• الحق في عدم البيع</li>
                      </ul>
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• عدم التمييز</li>
                        <li>• الشفافية في جمع البيانات</li>
                        <li>• حماية القُصر</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-bank-line text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">معايير أمان بيانات الدفع (PCI DSS)</h3>
                    <p className="text-gray-700 font-tajawal mb-3">
                      نطبق أعلى معايير الأمان لحماية بيانات بطاقات الدفع وفقاً لمعايير PCI DSS العالمية.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• شبكة آمنة ومحمية</li>
                        <li>• حماية بيانات حاملي البطاقات</li>
                        <li>• برنامج إدارة الثغرات</li>
                      </ul>
                      <ul className="text-gray-700 space-y-1 font-tajawal text-sm">
                        <li>• تدابير التحكم في الوصول</li>
                        <li>• مراقبة واختبار الشبكات</li>
                        <li>• سياسة أمان المعلومات</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industry Standards */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">المعايير الصناعية</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-award-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">ISO 27001</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    معيار دولي لإدارة أمان المعلومات وحماية البيانات الحساسة
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shield-check-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">SOC 2 Type II</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    تقرير مراجعة مستقل يؤكد فعالية ضوابط الأمان والخصوصية
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-secure-payment-line text-white text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">ISO 22301</h3>
                  <p className="text-gray-700 text-sm font-tajawal">
                    معيار استمرارية الأعمال لضمان الخدمة المتواصلة
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance Monitoring */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">مراقبة الامتثال</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">المراجعة الداخلية</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">مراجعة دورية</h4>
                      <p className="text-gray-700 text-sm font-tajawal">مراجعة شهرية لجميع العمليات والإجراءات</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">تقييم المخاطر</h4>
                      <p className="text-gray-700 text-sm font-tajawal">تحليل مستمر للمخاطر القانونية والتنظيمية</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">التحديث المستمر</h4>
                      <p className="text-gray-700 text-sm font-tajawal">تحديث السياسات وفقاً للتغييرات القانونية</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 font-cairo">المراجعة الخارجية</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">مراجعون مستقلون</h4>
                      <p className="text-gray-700 text-sm font-tajawal">مراجعة سنوية من قبل خبراء قانونيين مستقلين</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">اختبارات الامتثال</h4>
                      <p className="text-gray-700 text-sm font-tajawal">اختبارات دورية للتأكد من الالتزام بالمعايير</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 space-x-reverse">
                    <i className="ri-check-line text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-gray-900 font-cairo">شهادات الامتثال</h4>
                      <p className="text-gray-700 text-sm font-tajawal">الحصول على شهادات معتمدة من جهات دولية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Team */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">الفريق القانوني</h2>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-team-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">خبراء قانونيون متخصصون</h3>
                  <p className="text-gray-700 font-tajawal">
                    فريقنا القانوني يضم خبراء في القانون التجاري، قانون التكنولوجيا، وحماية البيانات من مختلف الولايات القضائية.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-scales-line text-white"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">القانون التجاري</h4>
                  <p className="text-gray-700 text-sm font-tajawal">خبراء في قوانين التجارة الإلكترونية والعقود</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-shield-user-line text-white"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">حماية البيانات</h4>
                  <p className="text-gray-700 text-sm font-tajawal">متخصصون في قوانين الخصوصية وحماية البيانات</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-bank-line text-white"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 font-cairo">القانون المصرفي</h4>
                  <p className="text-gray-700 text-sm font-tajawal">خبراء في قوانين الخدمات المالية والمدفوعات</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reporting & Transparency */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">التقارير والشفافية</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <i className="ri-file-chart-line text-yellow-500 text-2xl mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-cairo">تقارير الامتثال الدورية</h3>
                  <p className="text-gray-700 font-tajawal">
                    نصدر تقارير دورية حول مستوى امتثالنا للقوانين واللوائح المختلفة:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">التقارير الداخلية:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• تقرير شهري للإدارة العليا</li>
                    <li>• تقييم ربع سنوي للمخاطر</li>
                    <li>• مراجعة سنوية شاملة</li>
                    <li>• تقارير الحوادث الفورية</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 font-cairo">التقارير الخارجية:</h4>
                  <ul className="text-gray-700 space-y-2 font-tajawal">
                    <li>• تقارير للجهات التنظيمية</li>
                    <li>• تقرير الشفافية السنوي</li>
                    <li>• تقارير خرق البيانات</li>
                    <li>• تقارير الامتثال للعملاء</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Legal Team */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-cairo">تواصل مع الفريق القانوني</h2>
            
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-cairo">هل لديك استفسارات قانونية أو تنظيمية؟</h3>
                <p className="text-gray-700 font-tajawal">فريقنا القانوني جاهز لمساعدتك والإجابة على جميع استفساراتك</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <i className="ri-mail-line text-teal-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">البريد القانوني</p>
                  <p className="text-gray-700 font-tajawal">legal@qtap.sa</p>
                </div>

                <div>
                  <i className="ri-phone-line text-teal-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">الخط المباشر</p>
                  <p className="text-gray-700 font-tajawal">+966 11 123 4570</p>
                </div>

                <div>
                  <i className="ri-time-line text-teal-500 text-2xl mb-2"></i>
                  <p className="font-semibold text-gray-900 font-cairo">ساعات العمل</p>
                  <p className="text-gray-700 font-tajawal">الأحد - الخميس: 8ص - 5م</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link
                  to="/contact"
                  className="bg-teal-500 text-white hover:bg-teal-600 font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap font-tajawal"
                >
                  <i className="ri-scales-line ml-2"></i>
                  تواصل مع الفريق القانوني
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
