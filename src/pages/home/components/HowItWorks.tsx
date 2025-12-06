
import { useState } from 'react';

export default function HowItWorks() {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);

  const scrollToRestaurantShowcase = () => {
    const showcaseElement = document.getElementById('restaurant-showcase');
    if (showcaseElement) {
      showcaseElement.scrollIntoView({ behavior: 'smooth' });
      // تأخير قصير ثم تفعيل العرض التوضيحي
      setTimeout(() => {
        const showcaseButton = showcaseElement.querySelector('button');
        if (showcaseButton) {
          showcaseButton.click();
        }
      }, 800);
    }
  };

  const steps = [
    {
      number: '01',
      title: 'امسح رمز QR',
      description: 'يمسح العملاء رمز QR الفريد على طاولتهم للوصول الفوري للقائمة الرقمية',
      icon: 'ri-qr-scan-line',
      image: 'https://readdy.ai/api/search-image?query=Customer%20scanning%20QR%20code%20at%20restaurant%20table%20with%20smartphone%2C%20modern%20dining%20setting%2C%20digital%20menu%20access%2C%20contactless%20ordering%20experience%2C%20clean%20restaurant%20table%20setup%2C%20professional%20food%20service%20technology&width=500&height=400&seq=step-1&orientation=landscape',
      demoFeatures: [
        'مسح فوري بدون تطبيقات',
        'رمز QR فريد لكل طاولة',
        'وصول مباشر للقائمة الرقمية',
        'متوافق مع جميع الهواتف'
      ]
    },
    {
      number: '02',
      title: 'تصفح واطلب',
      description: 'استكشف القائمة المخصصة مع فيديوهات الأطباق والأوصاف والأسعار. أضف العناصر للسلة',
      icon: 'ri-restaurant-line',
      image: 'https://readdy.ai/api/search-image?query=Smartphone%20displaying%20beautiful%20digital%20restaurant%20menu%20interface%2C%20food%20photos%20and%20videos%2C%20modern%20app%20design%2C%20appetizing%20dish%20presentations%2C%20user-friendly%20mobile%20ordering%20experience%2C%20contemporary%20food%20photography&width=500&height=400&seq=step-2&orientation=landscape',
      demoFeatures: [
        'فيديوهات عالية الجودة للأطباق',
        'أوصاف مفصلة ومكونات',
        'أسعار واضحة ومحدثة',
        'إضافة سهلة للسلة'
      ]
    },
    {
      number: '03',
      title: 'دفع آمن',
      description: 'أكمل الدفع بأمان عبر التطبيق دون ترك طاولتك',
      icon: 'ri-secure-payment-line',
      image: 'https://readdy.ai/api/search-image?query=Mobile%20payment%20security%20interface%20with%20shield%20protection%2C%20encrypted%20transaction%20display%2C%20secure%20digital%20wallet%20on%20smartphone%2C%20modern%20fintech%20security%20design%2C%20contactless%20payment%20technology%2C%20professional%20banking%20app%20interface&width=500&height=400&seq=step-3-updated&orientation=landscape',
      demoFeatures: [
        'دفع آمن ومشفر',
        'طرق دفع متعددة',
        'بدون لمس أو نقد',
        'تأكيد فوري للطلب'
      ]
    },
    {
      number: '04',
      title: 'استمتع بوجبتك',
      description: 'استرخ بينما يتم تحضير طلبك وتوصيله مباشرة إلى طاولتك',
      icon: 'ri-emotion-happy-line',
      image: 'https://readdy.ai/api/search-image?query=Happy%20customers%20enjoying%20delicious%20meal%20at%20restaurant%20table%2C%20satisfied%20dining%20experience%2C%20professional%20food%20presentation%2C%20elegant%20restaurant%20atmosphere%2C%20quality%20service%20delivery%2C%20contemporary%20dining%20scene&width=500&height=400&seq=step-4&orientation=landscape',
      demoFeatures: [
        'تتبع حالة الطلب',
        'توصيل مباشر للطاولة',
        'خدمة سريعة ودقيقة',
        'تجربة طعام مميزة'
      ]
    }
  ];

  const demoStats = [
    { number: '95%', label: 'رضا العملاء', icon: 'ri-emotion-happy-line' },
    { number: '40%', label: 'توفير في الوقت', icon: 'ri-time-line' },
    { number: '60%', label: 'زيادة في الطلبات', icon: 'ri-arrow-up-line' },
    { number: '100%', label: 'بدون لمس', icon: 'ri-shield-check-line' }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            كيف يعمل QTap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اختبر تجربة طعام سلسة في أربع خطوات بسيطة فقط. 
            لا تطبيقات للتحميل، لا انتظار للخدمة.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <div className="relative">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-80 object-cover object-top rounded-2xl shadow-lg"
                  />
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <i className={`${step.icon} text-white text-2xl`}></i>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-2xl font-bold mb-6">
                  {step.number}
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {step.title}
                </h3>
                
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {step.description}
                </p>

                {/* Demo Features */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    <i className="ri-star-line text-orange-500 ml-2"></i>
                    ميزات هذه الخطوة:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.demoFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-gray-700">
                        <i className="ri-check-line text-green-500 ml-2"></i>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        {activeDemo !== null && (
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-xl border-2 border-orange-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                <i className="ri-smartphone-line text-orange-500 ml-2"></i>
                مرحباً بك في العرض التوضيحي لـ QTap
              </h3>
              <p className="text-gray-600">
                اختبر تجربة QTap الكاملة من خلال هذا العرض التوضيحي التفاعلي
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Demo Steps */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  <i className="ri-guide-line text-orange-500 ml-2"></i>
                  خطوات تجربة QTap:
                </h4>
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      activeDemo === index 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setActiveDemo(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 ${
                        activeDemo === index ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <i className={step.icon}></i>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{step.title}</h5>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo Preview */}
              <div className="bg-gray-100 rounded-xl p-6">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className={`${steps[activeDemo].icon} text-white text-2xl`}></i>
                    </div>
                    <h5 className="text-lg font-semibold text-gray-900">
                      QTap - {steps[activeDemo].title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-2">
                      تجربة {steps[activeDemo].title} مع نظام QTap الذكي
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {steps[activeDemo].demoFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <i className="ri-check-line text-green-500 ml-2"></i>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer">
                      <i className="ri-arrow-left-line ml-2"></i>
                      التالي في QTap: {steps[(activeDemo + 1) % steps.length].title}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <p className="text-orange-700 font-semibold">
                  <i className="ri-information-line ml-2"></i>
                  هذا عرض توضيحي لنظام QTap - جرب الآن وشاهد الفرق!
                </p>
              </div>
              <button 
                onClick={() => setActiveDemo(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <i className="ri-close-line ml-1"></i>
                إغلاق العرض التوضيحي
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
