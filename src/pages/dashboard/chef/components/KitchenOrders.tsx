
import { useState } from 'react';

export default function KitchenOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: '#1234',
      table: 'طاولة 5',
      time: '10:30 ص',
      priority: 'عالي',
      estimatedTime: '15 دقيقة',
      status: 'جاري التحضير',
      items: [
        { 
          name: 'برجر كلاسيك', 
          quantity: 2, 
          notes: 'بدون بصل',
          category: 'رئيسي',
          cookTime: '8 دقائق',
          status: 'جاري التحضير'
        },
        { 
          name: 'بطاطس مقلية', 
          quantity: 2, 
          notes: '',
          category: 'جانبي',
          cookTime: '5 دقائق',
          status: 'جاهز'
        }
      ],
      orderTime: '10:30 ص',
      waitTime: '5 دقائق'
    },
    {
      id: '#1235',
      table: 'طاولة 12',
      time: '10:25 ص',
      priority: 'متوسط',
      estimatedTime: '10 دقائق',
      status: 'جاهز للتقديم',
      items: [
        { 
          name: 'سلطة سيزر', 
          quantity: 1, 
          notes: 'صوص إضافي',
          category: 'سلطات',
          cookTime: '3 دقائق',
          status: 'جاهز'
        }
      ],
      orderTime: '10:25 ص',
      waitTime: '10 دقائق'
    },
    {
      id: '#1236',
      table: 'طاولة 3',
      time: '10:35 ص',
      priority: 'عالي',
      estimatedTime: '20 دقيقة',
      status: 'طلب جديد',
      items: [
        { 
          name: 'ستيك مشوي', 
          quantity: 1, 
          notes: 'متوسط النضج',
          category: 'رئيسي',
          cookTime: '12 دقيقة',
          status: 'في الانتظار'
        },
        { 
          name: 'أرز بالخضار', 
          quantity: 1, 
          notes: '',
          category: 'جانبي',
          cookTime: '8 دقائق',
          status: 'في الانتظار'
        }
      ],
      orderTime: '10:35 ص',
      waitTime: '0 دقائق'
    },
    {
      id: '#1237',
      table: 'طاولة 8',
      time: '10:20 ص',
      priority: 'منخفض',
      estimatedTime: '12 دقيقة',
      status: 'جاري التحضير',
      items: [
        { 
          name: 'بيتزا مارجريتا', 
          quantity: 1, 
          notes: 'جبن إضافي',
          category: 'رئيسي',
          cookTime: '10 دقائق',
          status: 'جاري التحضير'
        }
      ],
      orderTime: '10:20 ص',
      waitTime: '15 دقيقة'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'منخفض': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'طلب جديد': return 'bg-orange-100 text-orange-800';
      case 'جاري التحضير': return 'bg-blue-100 text-blue-800';
      case 'جاهز للتقديم': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemStatusColor = (status) => {
    switch (status) {
      case 'في الانتظار': return 'bg-gray-100 text-gray-800';
      case 'جاري التحضير': return 'bg-blue-100 text-blue-800';
      case 'جاهز': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`تحديث الطلب ${orderId} إلى ${newStatus}`);
  };

  const updateItemStatus = (orderId, itemIndex, newStatus) => {
    console.log(`تحديث الصنف ${itemIndex} في الطلب ${orderId} إلى ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">طلبات المطبخ</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">تحديث تلقائي:</span>
            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            </div>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-refresh-line ml-1"></i>
            تحديث
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات جديدة</p>
              <p className="text-2xl font-bold text-orange-500">
                {orders.filter(o => o.status === 'طلب جديد').length}
              </p>
            </div>
            <i className="ri-notification-line text-2xl text-orange-500"></i>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">جاري التحضير</p>
              <p className="text-2xl font-bold text-blue-500">
                {orders.filter(o => o.status === 'جاري التحضير').length}
              </p>
            </div>
            <i className="ri-timer-line text-2xl text-blue-500"></i>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">جاهز للتقديم</p>
              <p className="text-2xl font-bold text-green-500">
                {orders.filter(o => o.status === 'جاهز للتقديم').length}
              </p>
            </div>
            <i className="ri-check-line text-2xl text-green-500"></i>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">متوسط الانتظار</p>
              <p className="text-2xl font-bold text-purple-500">8 دقائق</p>
            </div>
            <i className="ri-time-line text-2xl text-purple-500"></i>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center ml-3">
                  <i className="ri-restaurant-line text-orange-500"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.table}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
                <p className="text-xs text-gray-500 mt-1">{order.time}</p>
              </div>
            </div>

            {/* Order Status */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.estimatedTime}</p>
                <p className="text-xs text-gray-500">وقت متوقع</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.cookTime}</span>
                    <span className="text-orange-600">{item.category}</span>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border-r-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        <i className="ri-information-line ml-1"></i>
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {/* Item Actions */}
                  <div className="mt-3 flex space-x-2">
                    {item.status === 'في الانتظار' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, index, 'جاري التحضير')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                      >
                        بدء التحضير
                      </button>
                    )}
                    {item.status === 'جاري التحضير' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, index, 'جاهز')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
                      >
                        جاهز
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Actions */}
            <div className="flex space-x-2">
              {order.status === 'طلب جديد' && (
                <button 
                  onClick={() => updateOrderStatus(order.id, 'جاري التحضير')}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  بدء التحضير
                </button>
              )}
              {order.status === 'جاري التحضير' && order.items.every(item => item.status === 'جاهز') && (
                <button 
                  onClick={() => updateOrderStatus(order.id, 'جاهز للتقديم')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  جاهز للتقديم
                </button>
              )}
              <button 
                onClick={() => setSelectedOrder(order)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-eye-line"></i>
              </button>
            </div>

            {/* Wait Time Indicator */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">وقت الانتظار:</span>
              <span className={`font-medium ${
                parseInt(order.waitTime) > 15 ? 'text-red-600' : 
                parseInt(order.waitTime) > 10 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {order.waitTime}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">تفاصيل الطلب {selectedOrder.id}</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الطلب</label>
                  <p className="text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الطاولة</label>
                  <p className="text-gray-900">{selectedOrder.table}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وقت الطلب</label>
                  <p className="text-gray-900">{selectedOrder.orderTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}>
                    {selectedOrder.priority}
                  </span>
                </div>
              </div>

              {/* Detailed Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الأصناف</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600">الكمية: {item.quantity} | الفئة: {item.category}</p>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">وقت التحضير:</span>
                          <p className="font-medium text-gray-900">{item.cookTime}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">الحالة:</span>
                          <p className="font-medium text-gray-900">{item.status}</p>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-sm text-yellow-800">
                            <i className="ri-information-line ml-1"></i>
                            <strong>ملاحظات:</strong> {item.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
                  طباعة تذكرة المطبخ
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                  إضافة ملاحظة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-600">لا توجد طلبات في المطبخ حالياً</p>
        </div>
      )}
    </div>
  );
}