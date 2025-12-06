
import { useState } from 'react'
import MenuItemModal from './MenuItemModal'

interface MenuItemsProps {
  items: any[]
  onAddToCart: (item: any, quantity: number, specialInstructions?: string) => void
}

const MenuItems = ({ items, onAddToCart }: MenuItemsProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const menuItems = [
    {
      id: 1,
      name: 'برجر كلاسيك',
      description: 'برجر لحم بقري طازج مع الخس والطماطم والجبن',
      price: 45,
      category: 'برجر',
      image: 'https://readdy.ai/api/search-image?query=Classic%20beef%20burger%20with%20lettuce%20tomato%20cheese%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20clean%20background%2C%20mouth-watering%20burger&width=300&height=200&seq=menu-1&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 2,
      name: 'بيتزا مارجريتا',
      description: 'بيتزا كلاسيكية مع صلصة الطماطم والموزاريلا والريحان الطازج',
      price: 55,
      category: 'بيتزا',
      image: 'https://readdy.ai/api/search-image?query=Margherita%20pizza%20with%20fresh%20basil%20mozzarella%20tomato%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation%2C%20appetizing%20pizza&width=300&height=200&seq=menu-2&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 3,
      name: 'سلطة سيزر',
      description: 'سلطة خضراء طازجة مع الدجاج المشوي وجبن البارميزان',
      price: 35,
      category: 'سلطات',
      image: 'https://readdy.ai/api/search-image?query=Caesar%20salad%20with%20grilled%20chicken%20parmesan%20cheese%20lettuce%20croutons%2C%20fresh%20healthy%20salad%2C%20professional%20food%20photography%2C%20restaurant%20quality%20presentation&width=300&height=200&seq=menu-3&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 4,
      name: 'ستيك مشوي',
      description: 'قطعة ستيك لحم بقري مشوية مع الخضار والبطاطس',
      price: 85,
      category: 'أطباق رئيسية',
      image: 'https://readdy.ai/api/search-image?query=Grilled%20beef%20steak%20with%20vegetables%20and%20potatoes%2C%20professional%20food%20photography%2C%20restaurant%20quality%20meat%2C%20appetizing%20presentation%2C%20fine%20dining&width=300&height=200&seq=menu-4&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 5,
      name: 'باستا الفريدو',
      description: 'معكرونة فيتوتشيني بصلصة الكريمة البيضاء والدجاج',
      price: 50,
      category: 'معكرونة',
      image: 'https://readdy.ai/api/search-image?query=Fettuccine%20alfredo%20pasta%20with%20chicken%20in%20creamy%20white%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation%2C%20appetizing%20pasta&width=300&height=200&seq=menu-5&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 6,
      name: 'دجاج مشوي',
      description: 'قطع دجاج مشوية مع الأرز والخضار المشكلة',
      price: 60,
      category: 'أطباق رئيسية',
      image: 'https://readdy.ai/api/search-image?query=Grilled%20chicken%20with%20rice%20and%20mixed%20vegetables%2C%20professional%20food%20photography%2C%20healthy%20meal%2C%20restaurant%20quality%20presentation%2C%20appetizing%20chicken&width=300&height=200&seq=menu-6&orientation=landscape',
      available: false,
      spicy: false
    },
    {
      id: 7,
      name: 'سمك مشوي',
      description: 'فيليه سمك مشوي مع الليمون والأعشاب',
      price: 70,
      category: 'أطباق رئيسية',
      image: 'https://readdy.ai/api/search-image?query=Grilled%20fish%20fillet%20with%20lemon%20and%20herbs%2C%20professional%20food%20photography%2C%20seafood%20cuisine%2C%20restaurant%20quality%20presentation%2C%20appetizing%20fish&width=300&height=200&seq=menu-7&orientation=landscape',
      available: true,
      spicy: false
    },
    {
      id: 8,
      name: 'عصير برتقال طازج',
      description: 'عصير برتقال طبيعي 100% بدون إضافات',
      price: 15,
      category: 'مشروبات',
      image: 'https://readdy.ai/api/search-image?query=Fresh%20orange%20juice%20in%20glass%2C%20natural%20100%25%20orange%20juice%2C%20professional%20beverage%20photography%2C%20refreshing%20drink%2C%20restaurant%20quality%20presentation&width=300&height=200&seq=menu-8&orientation=landscape',
      available: true,
      spicy: false
    }
  ];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 text-lg">لا توجد عناصر في هذه الفئة</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
                  <i className="ri-image-line text-4xl text-gray-400"></i>
                </div>
              )}
              
              {!item.is_available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    غير متوفر
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 flex-1">{item.name}</h3>
                <p className="text-lg font-bold text-orange-600">{item.price} ج.م</p>
              </div>
              
              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                  <i className="ri-time-line"></i>
                  <span>{item.preparation_time || 15} دقيقة</span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (item.is_available) {
                      onAddToCart(item, 1)
                    }
                  }}
                  disabled={!item.is_available}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    item.is_available
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className="ri-add-line ml-1"></i>
                  إضافة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  )
}

export default MenuItems
