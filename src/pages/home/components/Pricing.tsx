
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
  const navigate = useNavigate()
  
  const handleStartNow = () => {
    navigate('/register')
  }

  const plans = [
    {
      name: 'الأساسي',
      price: '99',
      period: 'شهرياً',
      description: 'مثالي للمطاعم الصغيرة والمقاهي',
      features: [
        'حتى 10 طاولات',
        'قائمة رقمية واحدة',
        'رموز QR مخصصة',
        'تقارير أساسية',
        'دعم عبر البريد الإلكتروني',
        'مدفوعات آمنة'
      ],
      popular: false,
      color: 'gray'
    },
    {
      name: 'المتقدم',
      price: '199',
      period: 'شهرياً',
      description: 'الأفضل للمطاعم متوسطة الحجم',
      features: [
        'حتى 50 طاولة',
        'قوائم متعددة',
        'فيديوهات الأطباق',
        'تحليلات متقدمة',
        'إدارة المخزون',
        'دعم هاتفي 24/7',
        'تكامل نقاط البيع',
        'تقارير مفصلة'
      ],
      popular: true,
      color: 'orange'
    },
    {
      name: 'المؤسسي',
      price: '399',
      period: 'شهرياً',
      description: 'للسلاسل والمطاعم الكبيرة',
      features: [
        'طاولات غير محدودة',
        'فروع متعددة',
        'تخصيص كامل',
        'API مخصص',
        'مدير حساب مخصص',
        'تدريب فريق العمل',
        'تكامل متقدم',
        'نسخ احتياطية يومية'
      ],
      popular: false,
      color: 'purple'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            خطط أسعار مرنة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اختر الخطة المناسبة لحجم مطعمك واحتياجاتك. جميع الخطط تشمل ضمان استرداد المال لمدة 30 يوماً
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 ${
                plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    الأكثر شعبية
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-xl text-gray-600 mr-2">ر.س</span>
                </div>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className="ri-check-line text-green-500 text-xl ml-3"></i>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={handleStartNow}
                className={`w-full py-4 rounded-full font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  plan.popular 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                ابدأ الآن
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              هل تحتاج خطة مخصصة؟
            </h3>
            <p className="text-gray-600 mb-6">
              تواصل معنا لمناقشة احتياجاتك الخاصة والحصول على عرض مخصص
            </p>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-phone-line ml-2"></i>
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
