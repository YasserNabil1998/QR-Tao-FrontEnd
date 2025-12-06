
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-arabic">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <i className="ri-restaurant-line text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>QTap</span>
            </Link>
            
            <Link 
              to="/"
              className="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
            >
              <i className="ri-home-line text-xl ml-2"></i>
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            نحن فريق متخصص في تطوير حلول تقنية مبتكرة لصناعة المطاعم والضيافة في المنطقة العربية
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">قصتنا</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  بدأت رحلة QTap في عام 2020 عندما لاحظنا التحديات التي تواجه المطاعم في المنطقة العربية، 
                  خاصة مع تزايد الطلب على الحلول الرقمية والتجارب اللاتلامسية.
                </p>
                <p>
                  أسسنا الشركة بهدف واضح: تمكين المطاعم من تقديم تجربة طعام حديثة ومريحة لعملائها، 
                  مع الحفاظ على الطابع الثقافي والاجتماعي المميز للمنطقة العربية.
                </p>
                <p>
                  اليوم، نفخر بخدمة أكثر من 500 مطعم في أكثر من 40 مدينة عربية، 
                  ونواصل الابتكار لتطوير حلول تقنية تلبي احتياجات السوق المحلي.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://readdy.ai/api/search-image?query=Modern%20Arabic%20restaurant%20team%20working%20together%20with%20digital%20technology%2C%20professional%20atmosphere%2C%20warm%20lighting%2C%20contemporary%20Middle%20Eastern%20office%20environment%2C%20teamwork%20and%20innovation&width=600&height=400&seq=about-story&orientation=landscape"
                alt="فريق QTap"
                className="rounded-2xl shadow-2xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                <i className="ri-target-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                تمكين المطاعم العربية من تحويل تجربة الطعام إلى رحلة رقمية مميزة، 
                من خلال توفير حلول تقنية مبتكرة وسهلة الاستخدام تحافظ على الهوية الثقافية 
                وتعزز من كفاءة العمليات التشغيلية.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <i className="ri-eye-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h3>
              <p className="text-gray-600 leading-relaxed">
                أن نكون الشريك التقني الأول للمطاعم في المنطقة العربية، 
                ونساهم في بناء مستقبل رقمي مستدام لصناعة الضيافة، 
                مع الحفاظ على التراث الثقافي والقيم الاجتماعية للمنطقة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">قيمنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              القيم التي توجه عملنا وتحدد طريقة تفاعلنا مع عملائنا وشركائنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-lightbulb-line text-orange-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الابتكار</h3>
              <p className="text-gray-600">
                نسعى دائماً لتطوير حلول مبتكرة تواكب التطورات التقنية وتلبي احتياجات السوق
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-blue-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الجودة</h3>
              <p className="text-gray-600">
                نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا لضمان رضا عملائنا
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-green-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الشراكة</h3>
              <p className="text-gray-600">
                نؤمن بقوة الشراكات طويلة المدى ونعمل مع عملائنا كفريق واحد لتحقيق النجاح
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-line text-purple-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">الشغف</h3>
              <p className="text-gray-600">
                نحب ما نعمل ونتفانى في تقديم أفضل الحلول التقنية لصناعة المطاعم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">فريقنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              فريق متنوع من الخبراء والمتخصصين في التقنية وصناعة المطاعم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20Arab%20businessman%20CEO%20portrait%2C%20confident%20smile%2C%20modern%20business%20attire%2C%20executive%20leadership%2C%20Middle%20Eastern%20professional%20headshot&width=200&height=200&seq=ceo-portrait&orientation=squarish"
                alt="أحمد المحمد"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">أحمد المحمد</h3>
              <p className="text-orange-500 font-semibold mb-4">الرئيس التنفيذي والمؤسس</p>
              <p className="text-gray-600 text-sm">
                خبرة 15 عاماً في مجال التقنية وريادة الأعمال، متخصص في تطوير الحلول الرقمية للشركات
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20Arab%20businesswoman%20CTO%20portrait%2C%20confident%20technology%20leader%2C%20modern%20professional%20attire%2C%20Middle%20Eastern%20female%20executive%20headshot&width=200&height=200&seq=cto-portrait&orientation=squarish"
                alt="فاطمة العلي"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">فاطمة العلي</h3>
              <p className="text-orange-500 font-semibold mb-4">مديرة التقنية</p>
              <p className="text-gray-600 text-sm">
                خبيرة في تطوير البرمجيات وأنظمة قواعد البيانات، حاصلة على ماجستير في علوم الحاسوب
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20Arab%20businessman%20marketing%20director%20portrait%2C%20friendly%20smile%2C%20business%20casual%20attire%2C%20Middle%20Eastern%20marketing%20professional%20headshot&width=200&height=200&seq=marketing-portrait&orientation=squarish"
                alt="محمد الخالد"
                className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">محمد الخالد</h3>
              <p className="text-orange-500 font-semibold mb-4">مدير التسويق</p>
              <p className="text-gray-600 text-sm">
                متخصص في التسويق الرقمي وإدارة العلاقات مع العملاء، خبرة 10 سنوات في السوق العربي
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">هل تريد معرفة المزيد؟</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتك ومساعدتك في اتخاذ القرار المناسب لمطعمك
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-white text-orange-500 hover:bg-orange-50 font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <i className="ri-phone-line ml-2"></i>
              اتصل بنا
            </Link>
            
            <Link
              to="/menu?restaurant=demo&table=1"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 whitespace-nowrap"
            >
              <i className="ri-eye-line ml-2"></i>
              جرب النظام
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <i className="ri-restaurant-line text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: '"Pacifico", serif' }}>QTap</span>
          </div>
          
          <p className="text-gray-400 mb-8">
            © 2024 QTap. جميع الحقوق محفوظة.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com/qtap" className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
              <i className="ri-facebook-fill text-2xl"></i>
            </a>
            <a href="https://twitter.com/qtap" className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
              <i className="ri-twitter-fill text-2xl"></i>
            </a>
            <a href="https://instagram.com/qtap" className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
              <i className="ri-instagram-line text-2xl"></i>
            </a>
            <a href="https://linkedin.com/company/qtap" className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
              <i className="ri-linkedin-fill text-2xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
