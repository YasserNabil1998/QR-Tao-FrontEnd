
import { useState } from 'react';

const RestaurantShowcase = () => {
  const [showDemo, setShowDemo] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const demoSteps = [
    {
      id: 1,
      title: "شاشة الترحيب",
      icon: "ri-smartphone-line",
      description: "عند فتح التطبيق لأول مرة، تظهر شاشة ترحيبية تحمل شعار المطعم",
      features: [
        "شعار المطعم الجذاب",
        "اختيار اللغة (عربية / إنجليزية)",
        "انتقال سلس للصفحة الرئيسية",
        "تصميم أنيق ومرحب"
      ],
      color: "from-blue-500 to-purple-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20welcome%20screen%20with%20restaurant%20logo%2C%20language%20selection%20Arabic%20English%2C%20modern%20smartphone%20interface%2C%20clean%20design%2C%20professional%20mobile%20app%20UI&width=300&height=600&seq=demo-welcome&orientation=portrait"
    },
    {
      id: 2,
      title: "تصفح المنيو",
      icon: "ri-restaurant-line",
      description: "قائمة طعام مقسمة إلى فئات مع صور عالية الجودة وأوصاف مفصلة",
      features: [
        "فئات منظمة (مقبلات، أطباق رئيسية، حلويات، مشروبات)",
        "صور عالية الجودة لكل صنف",
        "أوصاف تفصيلية وأسعار واضحة",
        "محرك بحث وفلاتر ذكية"
      ],
      color: "from-green-500 to-teal-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20menu%20browsing%20interface%2C%20food%20categories%2C%20high%20quality%20food%20images%2C%20Arabic%20text%2C%20modern%20restaurant%20app%20design%2C%20appetizing%20food%20display&width=300&height=600&seq=demo-menu&orientation=portrait"
    },
    {
      id: 3,
      title: "مسح QR",
      icon: "ri-qr-scan-line",
      description: "مسح رمز QR بالكاميرا المدمجة للوصول المباشر للمنيو ورقم الطاولة",
      features: [
        "كاميرا مدمجة في التطبيق",
        "مسح فوري ودقيق",
        "تحديد رقم الطاولة تلقائياً",
        "فتح المنيو مباشرة بعد المسح"
      ],
      color: "from-orange-500 to-red-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20QR%20code%20scanner%20interface%2C%20camera%20viewfinder%2C%20QR%20code%20scanning%2C%20modern%20smartphone%20camera%20UI%2C%20restaurant%20table%20QR%20code&width=300&height=600&seq=demo-qr&orientation=portrait"
    },
    {
      id: 4,
      title: "اختيار نوع الطلب",
      icon: "ri-truck-line",
      description: "تحديد طريقة الخدمة المناسبة مع خيارات متعددة للراحة",
      features: [
        "🍴 Dine-in: للأكل داخل المطعم",
        "🥡 Takeaway: لاستلام الطلب ذاتياً",
        "🚚 Delivery: للتوصيل إلى المنزل",
        "تحديد العنوان عبر الخريطة للتوصيل"
      ],
      color: "from-purple-500 to-pink-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20order%20type%20selection%2C%20dine-in%20takeaway%20delivery%20options%2C%20modern%20UI%20design%2C%20restaurant%20service%20types%2C%20Arabic%20interface&width=300&height=600&seq=demo-order&orientation=portrait"
    },
    {
      id: 5,
      title: "الدفع الإلكتروني",
      icon: "ri-bank-card-line",
      description: "دفع آمن ومشفر مع طرق دفع متعددة وتأكيد فوري",
      features: [
        "💵 كاش عند الاستلام",
        "💳 بطاقة ائتمان / مدى",
        "📱 Apple Pay أو STC Pay",
        "رسالة تأكيد فورية بالطلب والفاتورة"
      ],
      color: "from-indigo-500 to-blue-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20payment%20interface%2C%20credit%20card%20payment%2C%20Apple%20Pay%2C%20secure%20payment%20methods%2C%20modern%20payment%20UI%2C%20Arabic%20text&width=300&height=600&seq=demo-payment&orientation=portrait"
    },
    {
      id: 6,
      title: "التوصيات الذكية",
      icon: "ri-lightbulb-line",
      description: "اقتراحات ذكية مبنية على سلوك الشراء والأصناف الرائجة",
      features: [
        "\"قد يعجبك أيضاً...\"",
        "\"العملاء الذين طلبوا هذا اشتروا أيضاً...\"",
        "توصيات مبنية على السلوك السابق",
        "عرض الأصناف الرائجة والمميزة"
      ],
      color: "from-yellow-500 to-orange-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20smart%20recommendations%20interface%2C%20AI%20suggestions%2C%20recommended%20products%2C%20personalized%20food%20recommendations%2C%20modern%20app%20design&width=300&height=600&seq=demo-ai&orientation=portrait"
    },
    {
      id: 7,
      title: "حجز الطاولة",
      icon: "ri-calendar-line",
      description: "حجز مسبق للطاولات مع تخصيص التفاصيل والمتطلبات الخاصة",
      features: [
        "اختيار التاريخ والوقت",
        "تحديد عدد الأشخاص",
        "ملاحظات خاصة (ركن عائلي، بجانب النافذة)",
        "تأكيد الحجز عبر التطبيق والبريد الإلكتروني"
      ],
      color: "from-teal-500 to-green-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20table%20reservation%20interface%2C%20calendar%20booking%2C%20restaurant%20table%20selection%2C%20date%20time%20picker%2C%20modern%20booking%20UI&width=300&height=600&seq=demo-booking&orientation=portrait"
    },
    {
      id: 8,
      title: "العروض والتنبيهات",
      icon: "ri-notification-line",
      description: "إشعارات فورية للعروض وحالة الطلب مع إمكانية التخصيص",
      features: [
        "العروض الجديدة والخصومات الموسمية",
        "تتبع حالة الطلب (تجهيز - في الطريق - تم التسليم)",
        "إشعارات قابلة للتخصيص",
        "تنبيهات عبر التطبيق والبريد الإلكتروني"
      ],
      color: "from-red-500 to-pink-600",
      image: "https://readdy.ai/api/search-image?query=Mobile%20app%20notifications%20interface%2C%20push%20notifications%2C%20order%20status%20updates%2C%20promotional%20offers%2C%20modern%20notification%20UI%20design&width=300&height=600&seq=demo-notifications&orientation=portrait"
    }
  ]

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length)
  }

  const currentDemo = demoSteps[currentStep]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-2xl font-bold mb-6">
            05
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            جرب العرض التوضيحي
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            اكتشف كيف يعمل نظامنا من خلال عرض تفاعلي لتطبيق العملاء المحمول
          </p>
          
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
          >
            <i className="ri-smartphone-line ml-2"></i>
            {showDemo ? 'إخفاء العرض التوضيحي' : 'عرض تطبيق العملاء المحمول'}
          </button>
        </div>

        {showDemo && (
          <div className="animate-in slide-in-from-top duration-500">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Phone Mockup */}
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                        <img
                          src={currentDemo.image}
                          alt={currentDemo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 right-0 h-8 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="w-16 h-1 bg-white bg-opacity-50 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-white mb-4 bg-gradient-to-r ${currentDemo.color}`}>
                    <i className={`${currentDemo.icon} ml-2`}></i>
                    <span className="font-medium">الخطوة {currentDemo.id}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentDemo.title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {currentDemo.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {currentDemo.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 space-x-reverse">
                        <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${currentDemo.color}`}></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={prevStep}
                      className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <i className="ri-arrow-right-line"></i>
                      <span>السابق</span>
                    </button>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      {demoSteps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                            index === currentStep ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <span>التالي</span>
                      <i className="ri-arrow-left-line"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">رضا العملاء</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">40%</div>
                    <div className="text-sm text-gray-600">توفير في الوقت</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">60%</div>
                    <div className="text-sm text-gray-600">زيادة في الطلبات</div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">بدون لمس</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default RestaurantShowcase