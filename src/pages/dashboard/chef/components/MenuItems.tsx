import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  is_available: boolean
  preparation_time: number
}

interface MenuCategory {
  id: string
  name: string
  display_order: number
}

interface MenuItemsProps {
  restaurantId: string
}

const MenuItems = ({ restaurantId }: MenuItemsProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    if (restaurantId) {
      fetchMenuData()
    }
  }, [restaurantId])

  const fetchMenuData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('name'),
        supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('display_order')
      ])

      if (itemsResponse.error) throw itemsResponse.error
      if (categoriesResponse.error) throw categoriesResponse.error

      setMenuItems(itemsResponse.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      console.error('Error fetching menu data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !isAvailable })
        .eq('id', itemId)

      if (error) throw error
      fetchMenuData()
    } catch (error) {
      console.error('Error updating item availability:', error)
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category_id === selectedCategory)

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'غير محدد'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إدارة عناصر المنيو</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 space-x-reverse whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          <span>إضافة عنصر جديد</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          جميع العناصر
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عناصر في المنيو</h3>
          <p className="text-gray-500">ابدأ بإضافة عناصر جديدة إلى المنيو</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={item.image_url || 'https://readdy.ai/api/search-image?query=delicious%20restaurant%20food%20dish%20on%20white%20background%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20clean%20minimal%20background&width=400&height=300&seq=menu-item&orientation=landscape'}
                  alt={item.name}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleItemAvailability(item.id, item.is_available)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.is_available ? 'متوفر' : 'غير متوفر'}
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="font-bold text-orange-600">{item.price} ر.س</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>الفئة: {getCategoryName(item.category_id)}</span>
                  <span>وقت التحضير: {item.preparation_time} دقيقة</span>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm whitespace-nowrap"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => toggleItemAvailability(item.id, item.is_available)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm whitespace-nowrap ${
                      item.is_available
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {item.is_available ? 'إيقاف' : 'تفعيل'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuItems