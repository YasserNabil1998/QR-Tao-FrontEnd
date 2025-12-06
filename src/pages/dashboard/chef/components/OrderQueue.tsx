import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'

interface Order {
  id: string
  table_number: number
  items: any[]
  status: string
  created_at: string
  total_amount: number
  customer_notes?: string
}

interface OrderQueueProps {
  restaurantId: string
}

const OrderQueue = ({ restaurantId }: OrderQueueProps) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (restaurantId) {
      fetchOrders()
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('orders')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'orders',
            filter: `restaurant_id=eq.${restaurantId}`
          }, 
          () => {
            fetchOrders()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [restaurantId])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          tables(table_number)
        `)
        .eq('restaurant_id', restaurantId)
        .in('status', ['pending', 'preparing', 'ready'])
        .order('created_at', { ascending: true })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار'
      case 'preparing':
        return 'قيد التحضير'
      case 'ready':
        return 'جاهز'
      default:
        return status
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
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
        <h2 className="text-2xl font-bold text-gray-900">قائمة انتظار الطلبات</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="bg-yellow-100 px-3 py-1 rounded-full">
            <span className="text-yellow-800 text-sm font-medium">
              {orders.filter(o => o.status === 'pending').length} في الانتظار
            </span>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded-full">
            <span className="text-blue-800 text-sm font-medium">
              {orders.filter(o => o.status === 'preparing').length} قيد التحضير
            </span>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-800 text-sm font-medium">
              {orders.filter(o => o.status === 'ready').length} جاهز
            </span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500">ستظهر الطلبات الجديدة هنا</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <i className="ri-table-line text-gray-600"></i>
                  <span className="font-semibold text-gray-900">
                    طاولة {order.tables?.table_number || order.table_number}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">الوقت: {formatTime(order.created_at)}</p>
                <div className="space-y-2">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-600">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.customer_notes && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <i className="ri-chat-3-line ml-1"></i>
                    {order.customer_notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">
                  {order.total_amount} ر.س
                </span>
                <div className="flex space-x-2 space-x-reverse">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      بدء التحضير
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
                    >
                      جاهز للتقديم
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
                    >
                      تم التقديم
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderQueue