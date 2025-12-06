
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import MenuHeader from './components/MenuHeader'
import CategoryTabs from './components/CategoryTabs'
import MenuItems from './components/MenuItems'
import Cart from './components/Cart'
import OrderSummary from './components/OrderSummary'

const MenuPage = () => {
  const [searchParams] = useSearchParams()
  const tableId = searchParams.get('table')
  const restaurantSlug = searchParams.get('restaurant')

  const [restaurant, setRestaurant] = useState<any>(null)
  const [table, setTable] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [cart, setCart] = useState<any[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurantData()
  }, [restaurantSlug, tableId])

  const fetchRestaurantData = async () => {
    try {
      // تحميل سريع متوازي لجميع البيانات
      const [restaurantResult, categoriesResult, itemsResult] = await Promise.all([
        // جلب المطعم
        restaurantSlug 
          ? supabase.from('restaurants').select('*').eq('slug', restaurantSlug).eq('is_active', true).maybeSingle()
          : supabase.from('restaurants').select('*').eq('is_active', true).limit(1).single(),
        
        // جلب الفئات مباشرة (سنحدث restaurant_id لاحقاً)
        supabase.from('menu_categories').select('*').eq('is_active', true).order('display_order').limit(20),
        
        // جلب عناصر القائمة مباشرة
        supabase.from('menu_items').select('*').eq('is_available', true).order('display_order').limit(50)
      ])

      const restaurantData = restaurantResult.data
      if (!restaurantData) throw new Error('لم يتم العثور على مطعم نشط')

      setRestaurant(restaurantData)

      // تحديد الطاولة بسرعة
      let tableData = null
      if (tableId) {
        const tableResult = await supabase
          .from('tables')
          .select('*')
          .eq('id', tableId)
          .eq('restaurant_id', restaurantData.id)
          .maybeSingle()
        tableData = tableResult.data
      }

      if (!tableData) {
        tableData = {
          id: tableId || 'default-table',
          table_number: tableId || '1',
          restaurant_id: restaurantData.id,
          qr_code: '',
          is_active: true
        }
      }
      setTable(tableData)

      // تصفية البيانات حسب المطعم
      const filteredCategories = categoriesResult.data?.filter(cat => cat.restaurant_id === restaurantData.id) || []
      const filteredItems = itemsResult.data?.filter(item => item.restaurant_id === restaurantData.id) || []

      setCategories(filteredCategories)
      setMenuItems(filteredItems)
      
      if (filteredCategories.length > 0) {
        setActiveCategory(filteredCategories[0].id)
      }

    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error)
      
      // بيانات تجريبية سريعة
      const mockRestaurant = {
        id: 'demo-restaurant',
        name: 'مطعم تجريبي',
        slug: 'demo',
        description: 'مطعم للعرض التوضيحي',
        is_active: true
      }
      
      const mockTable = {
        id: 'demo-table',
        table_number: '1',
        restaurant_id: 'demo-restaurant',
        qr_code: '',
        is_active: true
      }

      const mockCategories = [
        { id: 'cat-1', name: 'الأطباق الرئيسية', restaurant_id: 'demo-restaurant', is_active: true, display_order: 1 },
        { id: 'cat-2', name: 'المشروبات', restaurant_id: 'demo-restaurant', is_active: true, display_order: 2 },
        { id: 'cat-3', name: 'الحلويات', restaurant_id: 'demo-restaurant', is_active: true, display_order: 3 }
      ]

      const mockItems = [
        {
          id: 'item-1',
          name: 'برجر كلاسيك',
          description: 'برجر لحم بقري طازج مع الخس والطماطم والجبن',
          price: 45,
          category_id: 'cat-1',
          restaurant_id: 'demo-restaurant',
          is_available: true,
          preparation_time: 15,
          image_url: 'https://readdy.ai/api/search-image?query=Classic%20beef%20burger%20with%20lettuce%20tomato%20cheese%2C%20professional%20food%20photography%2C%20appetizing%20presentation%2C%20restaurant%20quality%2C%20clean%20background%2C%20mouth-watering%20burger&width=300&height=200&seq=menu-1&orientation=landscape'
        },
        {
          id: 'item-2',
          name: 'بيتزا مارجريتا',
          description: 'بيتزا كلاسيكية مع صلصة الطماطم والموزاريلا والريحان الطازج',
          price: 55,
          category_id: 'cat-1',
          restaurant_id: 'demo-restaurant',
          is_available: true,
          preparation_time: 20,
          image_url: 'https://readdy.ai/api/search-image?query=Margherita%20pizza%20with%20fresh%20basil%20mozzarella%20tomato%20sauce%2C%20professional%20food%20photography%2C%20Italian%20cuisine%2C%20restaurant%20presentation%2C%20appetizing%20pizza&width=300&height=200&seq=menu-2&orientation=landscape'
        },
        {
          id: 'item-3',
          name: 'عصير برتقال طازج',
          description: 'عصير برتقال طبيعي 100% بدون إضافات',
          price: 15,
          category_id: 'cat-2',
          restaurant_id: 'demo-restaurant',
          is_available: true,
          preparation_time: 5,
          image_url: 'https://readdy.ai/api/search-image?query=Fresh%20orange%20juice%20in%20glass%2C%20natural%20100%25%20orange%20juice%2C%20professional%20beverage%20photography%2C%20refreshing%20drink%2C%20restaurant%20quality%20presentation&width=300&height=200&seq=menu-8&orientation=landscape'
        }
      ]

      setRestaurant(mockRestaurant)
      setTable(mockTable)
      setCategories(mockCategories)
      setMenuItems(mockItems)
      setActiveCategory('cat-1')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Cart helpers ----------
  const addToCart = (item: any, quantity: number = 1, specialInstructions?: string) => {
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.specialInstructions === specialInstructions
    )

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.specialInstructions === specialInstructions
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      )
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity,
          specialInstructions: specialInstructions || '',
          cartId: Date.now() + Math.random()
        }
      ])
    }
  }

  const updateCartItem = (cartId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.cartId !== cartId))
    } else {
      setCart(
        cart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
      )
    }
  }

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter((item) => item.cartId !== cartId))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const filteredItems = menuItems.filter((item) => item.category_id === activeCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!restaurant || !table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في الوصول</h2>
          <p className="text-gray-600">لم يتم العثور على المطعم أو الطاولة المطلوبة</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader restaurant={restaurant} table={table} />

      <div className="container mx-auto px-4 py-6">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <MenuItems items={filteredItems} onAddToCart={addToCart} />
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="bg-orange-500 text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition-colors"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="font-medium">{getTotalItems()}</span>
              <span className="text-sm">|</span>
              <span className="font-bold">{getTotalAmount().toFixed(2)} ج.م</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {getTotalItems()}
            </div>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false)
            setShowOrderSummary(true)
          }}
          totalAmount={getTotalAmount()}
        />
      )}

      {/* Order Summary Modal */}
      {showOrderSummary && (
        <OrderSummary
          restaurant={restaurant}
          table={table}
          cart={cart}
          totalAmount={getTotalAmount()}
          onClose={() => setShowOrderSummary(false)}
          onOrderComplete={() => {
            setCart([])
            setShowOrderSummary(false)
          }}
        />
      )}
    </div>
  )
}

export default MenuPage
