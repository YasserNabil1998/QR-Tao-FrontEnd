
const Integration = () => {
  const integrations = [
    {
      name: 'أنظمة نقاط البيع',
      description: 'تكامل سلس مع جميع أنظمة نقاط البيع الشائعة',
      icon: 'ri-cash-line'
    },
    {
      name: 'المدفوعات الرقمية',
      description: 'دعم جميع طرق الدفع المحلية والعالمية',
      icon: 'ri-bank-card-line'
    },
    {
      name: 'خدمات التوصيل',
      description: 'ربط مباشر مع منصات التوصيل الرائدة',
      icon: 'ri-truck-line'
    },
    {
      name: 'إدارة المخزون',
      description: 'مزامنة تلقائية مع أنظمة إدارة المخزون',
      icon: 'ri-database-line'
    },
    {
      name: 'التسويق الرقمي',
      description: 'تكامل مع أدوات التسويق والتحليلات',
      icon: 'ri-megaphone-line'
    },
    {
      name: 'إدارة العملاء',
      description: 'ربط مع أنظمة إدارة علاقات العملاء لتحسين الخدمة',
      icon: 'ri-customer-service-line'
    }
  ];

  const benefits = [
    {
      title: 'تكامل بنقرة واحدة',
      description: 'اربط جميع أنظمتك الحالية دون الحاجة لتغييرات معقدة',
      icon: 'ri-links-line'
    },
    {
      title: 'مزامنة في الوقت الفعلي',
      description: 'بيانات محدثة لحظياً عبر جميع المنصات والأنظمة',
      icon: 'ri-refresh-line'
    },
    {
      title: 'أمان عالي المستوى',
      description: 'حماية متقدمة للبيانات مع تشفير من الدرجة المصرفية',
      icon: 'ri-shield-check-line'
    },
    {
      title: 'دعم فني متخصص',
      description: 'فريق دعم متاح 24/7 لضمان سلاسة التكامل',
      icon: 'ri-customer-service-2-line'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-white shadow-lg">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20business%20handshake%20partnership%20collaboration%20agreement%20orange%20and%20white%20color%20scheme%20modern%20clean%20background%20representing%20successful%20business%20partnership%20and%20cooperation%20between%20companies&width=400&height=400&seq=partnership-handshake-001&orientation=squarish"
                alt="Partnership Handshake"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              هل تريد الانضمام كشريك؟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              انضم إلى شبكة QTap واستفد من حلولنا المتقدمة لإدارة مطعمك
            </p>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              تكامل مع جميع أنظمتك الحالية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              لا تبدأ من الصفر. QTap يتكامل بسلاسة مع الأنظمة والخدمات التي تستخدمها بالفعل
            </p>
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-600/20 hover:border-orange-600/40 group"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-600/30 group-hover:border-orange-600/50 transition-all duration-300 group-hover:scale-110">
                    <i className={`${integration.icon} text-orange-600 text-3xl`}></i>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {integration.name}
                </h3>

                <p className="text-gray-600 mb-6 text-center">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border-2 border-orange-600/20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                لماذا تختار تكامل QTap؟
              </h3>
              <p className="text-xl text-gray-600">
                نجعل عملية التكامل سهلة وآمنة وفعالة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-600/30 group-hover:border-orange-600/50 transition-all duration-300 group-hover:scale-110">
                      <i className={`${benefit.icon} text-orange-600 text-3xl`}></i>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                جاهز للبدء؟
              </h4>
              <p className="text-gray-600 mb-8">
                تحدث مع فريق الخبراء لدينا حول احتياجات التكامل الخاصة بك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-phone-line ml-2"></i>
                  تحدث مع خبير
                </button>
                <button className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-file-list-line ml-2"></i>
                  دليل التكامل
                </button>
              </div>
            </div>
          </div>

          {/* API Section */}
          <div className="mt-20 bg-white rounded-3xl p-8 lg:p-12 text-center border-2 border-orange-500/60 relative overflow-hidden">
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-3xl">
              <div className="absolute inset-0 rounded-3xl border-2 border-orange-600/70 animate-pulse"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/50 animate-ping"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                للمطورين: واجهة برمجية قوية ومرنة
              </h3>
              <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
                استخدم واجهة البرمجة الخاصة بنا لبناء تكاملات مخصصة وحلول متقدمة لمطعمك
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-code-line ml-2"></i>
                  وثائق واجهة البرمجة
                </button>
                <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
                  <i className="ri-github-line ml-2"></i>
                  أمثلة الكود
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Integration;
