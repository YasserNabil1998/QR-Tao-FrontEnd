
import { useState } from 'react';

export default function OrdersList() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: '#1234',
      table: 'طاولة 5',
      customer: 'أحمد محمد',
      items: [
        { name: 'برجر كلاسيك', quantity: 2, price: 45.00 },
        { name: 'بطاطس مقلية', quantity: 2, price: 15.00 },
        { name: 'كوكا كولا', quantity: 2, price: 8.00 }
      ],
      total: 136.00,
      status: 'جاري التحضير',
      statusColor: 'yellow',
      time: '10:30 ص',
      paymentMethod: 'بطاقة ائتمان',
      paymentStatus: 'مدفوع',
      notes: 'بدون بصل في البرجر'
    },
    {
      id: '#1235',
      table: 'طاولة 12',
      customer: 'فاطمة أحمد',
      items: [
        { name: 'سلطة سيزر', quantity: 1, price: 32.00 },
        { name: 'عصير برتقال', quantity: 1, price: 15.00 }
      ],
      total: 47.00,
      status: 'جاهز للتقديم',
      statusColor: 'green',
      time: '10:25 ص',
      paymentMethod: 'نقداً',
      paymentStatus: 'مدفوع',
      notes: ''
    },
    {
      id: '#1236',
      table: 'طاولة 3',
      customer: 'محمد علي',
      items: [
        { name: 'بيتزا مارجريتا', quantity: 1, price: 55.00 },
        { name: 'مشروب غازي', quantity: 1, price: 8.00 }
      ],
      total: 63.00,
      status: 'تم التسليم',
      statusColor: 'blue',
      time: '10:20 ص',
      paymentMethod: 'بطاقة ائتمان',
      paymentStatus: 'مدفوع',
      notes: ''
    },
    {
      id: '#1237',
      table: 'طاولة 8',
      customer: 'سارة خالد',
      items: [
        { name: 'ستيك مشوي', quantity: 1, price: 85.00 },
        { name: 'أرز بالخضار', quantity: 1, price: 25.00 },
        { name: 'سلطة خضراء', quantity: 1, price: 18.00 }
      ],
      total: 128.00,
      status: 'طلب جديد',
      statusColor: 'orange',
      time: '10:35 ص',
      paymentMethod: 'في انتظار الدفع',
      paymentStatus: 'غير مدفوع',
      notes: 'الستيك متوسط النضج'
    },
    {
      id: '#1238',
      table: 'طاولة 15',
      customer: 'عبدالله سعد',
      items: [
        { name: 'تشيز كيك', quantity: 2, price: 28.00 },
        { name: 'قهوة عربية', quantity: 2, price: 12.00 }
      ],
      total: 80.00,
      status: 'ملغي',
      statusColor: 'red',
      time: '10:15 ص',
      paymentMethod: 'ملغي',
      paymentStatus: 'ملغي',
      notes: 'طلب العميل الإلغاء'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الطلبات', count: orders.length },
    { value: 'طلب جديد', label: 'طلبات جديدة', count: orders.filter(o => o.status === 'طلب جديد').length },
    { value: 'جاري التحضير', label: 'جاري التحضير', count: orders.filter(o => o.status === 'جاري التحضير').length },
    { value: 'جاهز للتقديم', label: 'جاهز للتقديم', count: orders.filter(o => o.status === 'جاهز للتقديم').length },
    { value: 'تم التسليم', label: 'تم التسليم', count: orders.filter(o => o.status === 'تم التسليم').length },
    { value: 'ملغي', label: 'ملغي', count: orders.filter(o => o.status === 'ملغي').length }
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'طلب جديد': return 'ri-notification-line';
      case 'جاري التحضير': return 'ri-timer-line';
      case 'جاهز للتقديم': return 'ri-check-line';
      case 'تم التسليم': return 'ri-check-double-line';
      case 'ملغي': return 'ri-close-line';
      default: return 'ri-file-list-line';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // هنا يمكن إضافة منطق تحديث حالة الطلب
    console.log(`تحديث الطلب ${orderId} إلى ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-refresh-line ml-1"></i>
            تحديث
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedStatus === status.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 ${
                  order.statusColor === 'orange' ? 'bg-orange-100' :
                  order.statusColor === 'yellow' ? 'bg-yellow-100' :
                  order.statusColor === 'green' ? 'bg-green-100' :
                  order.statusColor === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                }`}>
                  <i className={`${getStatusIcon(order.status)} ${
                    order.statusColor === 'orange' ? 'text-orange-500' :
                    order.statusColor === 'yellow' ? 'text-yellow-500' :
                    order.statusColor === 'green' ? 'text-green-500' :
                    order.statusColor === 'blue' ? 'text-blue-500' : 'text-red-500'
                  }`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">{order.table}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{order.time}</span>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <p className="font-medium text-gray-900">{order.customer}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                order.statusColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                order.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                order.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                order.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">الأصناف:</h4>
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900">{item.price.toFixed(2)} ر.س</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-xs text-gray-500">+{order.items.length - 2} صنف آخر</p>
                )}
              </div>
            </div>

            {/* Total and Payment */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">الإجمالي:</span>
                <span className="font-bold text-lg text-gray-900">{order.total.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">الدفع:</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'مدفوع' ? 'text-green-600' : 
                  order.paymentStatus === 'غير مدفوع' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex space-x-2">
              {order.status === 'طلب جديد' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateOrderStatus(order.id, 'جاري التحضير');
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  قبول الطلب
                </button>
              )}
              {order.status === 'جاهز للتقديم' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    updateOrderStatus(order.id, 'تم التسليم');
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                >
                  تم التسليم
                </button>
              )}
              <button 
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-more-line"></i>
              </button>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">العميل</label>
                  <p className="text-gray-900">{selectedOrder.customer}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
                  <p className="text-gray-900">{selectedOrder.time}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">أصناف الطلب</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} ر.س</p>
                        <p className="text-sm text-gray-600">{item.price.toFixed(2)} ر.س للقطعة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="text-gray-900">{selectedOrder.total.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">الضريبة (15%):</span>
                  <span className="text-gray-900">{(selectedOrder.total * 0.15).toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
                  <span>الإجمالي:</span>
                  <span>{(selectedOrder.total * 1.15).toFixed(2)} ر.س</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                  <p className="text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حالة الدفع</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.paymentStatus === 'مدفوع' ? 'bg-green-100 text-green-800' : 
                    selectedOrder.paymentStatus === 'غير مدفوع' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer">
                  طباعة الفاتورة
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer">
                  إرسال الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-600">لا توجد طلبات تطابق الفلتر المحدد</p>
        </div>
      )}
    </div>
  );
}