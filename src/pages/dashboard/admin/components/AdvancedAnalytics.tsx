
import { useState, useEffect } from 'react'

interface AnalyticsData {
  revenue: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  orders: {
    total: number
    completed: number
    cancelled: number
    pending: number
  }
  customers: {
    new: number
    returning: number
    total: number
  }
  popularItems: {
    name: string
    orders: number
    revenue: number
  }[]
  peakHours: {
    hour: string
    orders: number
  }[]
}

interface AdvancedAnalyticsProps {
  restaurantId: string
}

export default function AdvancedAnalytics({ restaurantId }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  // Mock data for demonstration
  const mockAnalytics: AnalyticsData = {
    revenue: {
      daily: [1200, 1500, 1800, 2100, 1900, 2300, 2000],
      weekly: [8500, 9200, 8800, 9500],
      monthly: [35000, 38000, 42000]
    },
    orders: {
      total: 1250,
      completed: 1180,
      cancelled: 45,
      pending: 25
    },
    customers: {
      new: 180,
      returning: 320,
      total: 500
    },
    popularItems: [
      { name: 'برجر اللحم المشوي', orders: 145, revenue: 2175 },
      { name: 'بيتزا مارجريتا', orders: 132, revenue: 1980 },
      { name: 'سلطة قيصر', orders: 98, revenue: 980 },
      { name: 'باستا الفريدو', orders: 87, revenue: 1305 },
      { name: 'دجاج مشوي', orders: 76, revenue: 1140 }
    ],
    peakHours: [
      { hour: '12:00', orders: 45 },
      { hour: '13:00', orders: 62 },
      { hour: '14:00', orders: 38 },
      { hour: '19:00', orders: 58 },
      { hour: '20:00', orders: 71 },
      { hour: '21:00', orders: 52 }
    ]
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1000)
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">التحليلات المتقدمة</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="day">اليوم</option>
            <option value="week">الأسبوع</option>
            <option value="month">الشهر</option>
            <option value="year">السنة</option>
          </select>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center ml-2 inline-block">
              <i className="ri-download-line"></i>
            </div>
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.revenue.weekly.reduce((a, b) => a + b, 0).toLocaleString()} ج.م
              </p>
              <p className="text-sm text-green-600 mt-1">
                <div className="w-4 h-4 flex items-center justify-center ml-1 inline-block">
                  <i className="ri-arrow-up-line"></i>
                </div>
                +12.5% من الأسبوع الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.orders.total}</p>
              <p className="text-sm text-green-600 mt-1">
                <div className="w-4 h-4 flex items-center justify-center ml-1 inline-block">
                  <i className="ri-arrow-up-line"></i>
                </div>
                +8.3% من الأسبوع الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-shopping-cart-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العملاء الجدد</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.customers.new}</p>
              <p className="text-sm text-green-600 mt-1">
                <div className="w-4 h-4 flex items-center justify-center ml-1 inline-block">
                  <i className="ri-arrow-up-line"></i>
                </div>
                +15.2% من الأسبوع الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-add-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الإكمال</p>
              <p className="text-2xl font-semibold text-gray-900">
                {((analytics.orders.completed / analytics.orders.total) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-green-600 mt-1">
                <div className="w-4 h-4 flex items-center justify-center ml-1 inline-block">
                  <i className="ri-arrow-up-line"></i>
                </div>
                +2.1% من الأسبوع الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-double-line text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات اليومية</h3>
          <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
            {analytics.revenue.daily.map((revenue, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-orange-500 rounded-t w-8 transition-all duration-300 hover:bg-orange-600"
                  style={{ height: `${(revenue / Math.max(...analytics.revenue.daily)) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ساعات الذروة</h3>
          <div className="h-64 flex items-end justify-between space-x-2 space-x-reverse">
            {analytics.peakHours.map((hour, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${(hour.orders / Math.max(...analytics.peakHours.map(h => h.orders))) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{hour.hour}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items and Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الأطباق الأكثر طلباً</h3>
          <div className="space-y-4">
            {analytics.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ml-3">
                    <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.orders} طلب</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.revenue} ج.م</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة الطلبات</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full ml-3"></div>
                <span className="text-gray-700">مكتملة</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-900 font-semibold ml-2">{analytics.orders.completed}</span>
                <span className="text-sm text-gray-500">
                  ({((analytics.orders.completed / analytics.orders.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full ml-3"></div>
                <span className="text-gray-700">قيد التحضير</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-900 font-semibold ml-2">{analytics.orders.pending}</span>
                <span className="text-sm text-gray-500">
                  ({((analytics.orders.pending / analytics.orders.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full ml-3"></div>
                <span className="text-gray-700">ملغية</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-900 font-semibold ml-2">{analytics.orders.cancelled}</span>
                <span className="text-sm text-gray-500">
                  ({((analytics.orders.cancelled / analytics.orders.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>معدل الإكمال</span>
                  <span>{((analytics.orders.completed / analytics.orders.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(analytics.orders.completed / analytics.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>معدل الإلغاء</span>
                  <span>{((analytics.orders.cancelled / analytics.orders.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(analytics.orders.cancelled / analytics.orders.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تحليل العملاء</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-user-line text-blue-600 text-2xl"></i>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{analytics.customers.new}</p>
            <p className="text-sm text-gray-600">عملاء جدد</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-user-heart-line text-green-600 text-2xl"></i>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{analytics.customers.returning}</p>
            <p className="text-sm text-gray-600">عملاء عائدون</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-team-line text-purple-600 text-2xl"></i>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{analytics.customers.total}</p>
            <p className="text-sm text-gray-600">إجمالي العملاء</p>
          </div>
        </div>
      </div>
    </div>
  )
}
