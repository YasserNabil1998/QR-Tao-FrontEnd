
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface DeliveryOrder {
  id: string;
  order_number: string;
  order_date: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  payment_method: 'cash' | 'visa' | 'mixed';
  total_amount: number;
  paid_amount: number;
  delivery_fee: number;
  delivery_time?: string;
  notes?: string;
  created_by: string;
}

interface DeliveryOrderItem {
  id: string;
  delivery_order_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

interface Payment {
  id: string;
  delivery_order_id: string;
  amount: number;
  payment_method: 'cash' | 'visa';
  payment_date: string;
  reference_number?: string;
  notes?: string;
}

export default function DeliveryOrders() {
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [orderItems, setOrderItems] = useState<DeliveryOrderItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    delivery_fee: 15,
    notes: '',
    items: [{ item_name: '', quantity: 1, unit_price: 0, notes: '' }]
  });

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    payment_method: 'cash' as const,
    reference_number: '',
    notes: ''
  });

  // Mock data for demonstration
  const mockDeliveryOrders: DeliveryOrder[] = [
    {
      id: '1',
      order_number: 'DEL-2024-001',
      order_date: '2024-01-15',
      customer_name: 'أحمد محمد علي',
      customer_phone: '01234567890',
      delivery_address: 'شارع النيل، المعادي، القاهرة',
      status: 'out_for_delivery',
      payment_status: 'paid',
      payment_method: 'visa',
      total_amount: 285,
      paid_amount: 285,
      delivery_fee: 15,
      delivery_time: '14:30',
      notes: 'طلب عاجل - يفضل التوصيل قبل المغرب',
      created_by: 'محمد أحمد'
    },
    {
      id: '2',
      order_number: 'DEL-2024-002',
      order_date: '2024-01-15',
      customer_name: 'فاطمة حسن',
      customer_phone: '01098765432',
      delivery_address: 'شارع التحرير، وسط البلد، القاهرة',
      status: 'preparing',
      payment_status: 'partial',
      payment_method: 'mixed',
      total_amount: 420,
      paid_amount: 200,
      delivery_fee: 20,
      notes: 'دفع جزئي - المتبقي عند الاستلام',
      created_by: 'سارة محمد'
    },
    {
      id: '3',
      order_number: 'DEL-2024-003',
      order_date: '2024-01-14',
      customer_name: 'خالد عبدالله',
      customer_phone: '01555444333',
      delivery_address: 'مدينة نصر، القاهرة الجديدة',
      status: 'delivered',
      payment_status: 'paid',
      payment_method: 'cash',
      total_amount: 350,
      paid_amount: 350,
      delivery_fee: 25,
      delivery_time: '19:45',
      created_by: 'أحمد علي'
    }
  ];

  const mockOrderItems: DeliveryOrderItem[] = [
    { id: '1', delivery_order_id: '1', item_name: 'برجر لحم مشوي', quantity: 2, unit_price: 85, total_price: 170, notes: 'بدون بصل' },
    { id: '2', delivery_order_id: '1', item_name: 'بطاطس مقلية كبيرة', quantity: 1, unit_price: 35, total_price: 35 },
    { id: '3', delivery_order_id: '1', item_name: 'كوكاكولا', quantity: 2, unit_price: 25, total_price: 50 },
    { id: '4', delivery_order_id: '1', item_name: 'رسوم التوصيل', quantity: 1, unit_price: 15, total_price: 15 }
  ];

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  const fetchDeliveryOrders = async () => {
    try {
      // في التطبيق الحقيقي، سيتم جلب البيانات من Supabase
      setDeliveryOrders(mockDeliveryOrders);
    } catch (error) {
      console.error('خطأ في جلب أوامر التوصيل:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    try {
      // في التطبيق الحقيقي، سيتم جلب البيانات من Supabase
      const items = mockOrderItems.filter(item => item.delivery_order_id === orderId);
      setOrderItems(items);
    } catch (error) {
      console.error('خطأ في جلب عناصر الطلب:', error);
    }
  };

  const fetchPaymentHistory = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('delivery_payments')
        .select('*')
        .eq('delivery_order_id', orderId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('خطأ في جلب تاريخ المدفوعات:', error);
      setPayments([]);
    }
  };

  const handleAddOrder = async () => {
    try {
      const orderNumber = `DEL-${Date.now()}`;
      const subtotal = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const totalAmount = subtotal + newOrder.delivery_fee;

      const { data: orderData, error: orderError } = await supabase
        .from('delivery_orders')
        .insert({
          order_number: orderNumber,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          delivery_address: newOrder.delivery_address,
          delivery_fee: newOrder.delivery_fee,
          total_amount: totalAmount,
          paid_amount: 0,
          status: 'pending',
          payment_status: 'unpaid',
          notes: newOrder.notes,
          created_by: 'المستخدم الحالي',
          restaurant_id: '00000000-0000-0000-0000-000000000000'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // إضافة عناصر الطلب
      const itemsToInsert = newOrder.items.map(item => ({
        delivery_order_id: orderData.id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        notes: item.notes
      }));

      const { error: itemsError } = await supabase
        .from('delivery_order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // إنشاء قيد محاسبي تلقائي
      await createAccountingEntry(orderData.id, 'order_created', totalAmount);

      setShowAddModal(false);
      resetNewOrder();
      fetchDeliveryOrders();
    } catch (error) {
      console.error('خطأ في إضافة طلب التوصيل:', error);
    }
  };

  const createAccountingEntry = async (orderId: string, type: string, amount: number, paymentMethod?: string) => {
    try {
      const entryNumber = `JE-DEL-${Date.now()}`;
      let description = '';
      let lines: any[] = [];

      switch (type) {
        case 'order_created':
          description = `طلب توصيل جديد - ${orderId}`;
          lines = [
            { account_code: '1300', debit_amount: amount, credit_amount: 0, description: 'عملاء - طلب توصيل' },
            { account_code: '4100', debit_amount: 0, credit_amount: amount, description: 'إيرادات المبيعات' }
          ];
          break;
        case 'payment_received':
          description = `استلام دفعة - طلب ${orderId}`;
          if (paymentMethod === 'cash') {
            lines = [
              { account_code: '1110', debit_amount: amount, credit_amount: 0, description: 'الصندوق' },
              { account_code: '1300', debit_amount: 0, credit_amount: amount, description: 'عملاء - طلب توصيل' }
            ];
          } else if (paymentMethod === 'visa') {
            lines = [
              { account_code: '1120', debit_amount: amount, credit_amount: 0, description: 'البنك - فيزا' },
              { account_code: '1300', debit_amount: 0, credit_amount: amount, description: 'عملاء - طلب توصيل' }
            ];
          }
          break;
      }

      // إنشاء القيد في دفتر اليومية
      const { data: entryData, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          entry_number: entryNumber,
          entry_date: new Date().toISOString().split('T')[0],
          description,
          reference_type: 'delivery',
          reference_id: orderId,
          total_amount: amount,
          created_by: 'المستخدم الحالي',
          status: 'approved',
          restaurant_id: '00000000-0000-0000-0000-000000000000'
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // إضافة تفاصيل القيد
      const entryLines = lines.map(line => ({
        journal_entry_id: entryData.id,
        account_id: line.account_code,
        debit_amount: line.debit_amount,
        credit_amount: line.credit_amount,
        description: line.description
      }));

      const { error: linesError } = await supabase
        .from('journal_entry_lines')
        .insert(entryLines);

      if (linesError) throw linesError;
    } catch (error) {
      console.error('خطأ في إنشاء القيد المحاسبي:', error);
    }
  };

  const resetNewOrder = () => {
    setNewOrder({
      customer_name: '',
      customer_phone: '',
      delivery_address: '',
      delivery_fee: 15,
      notes: '',
      items: [{ item_name: '', quantity: 1, unit_price: 0, notes: '' }]
    });
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'delivered') {
        updateData.delivery_time = new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }

      const { error } = await supabase
        .from('delivery_orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      fetchDeliveryOrders();
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;

    try {
      const newPaidAmount = selectedOrder.paid_amount + paymentData.amount;
      const newPaymentStatus = newPaidAmount >= selectedOrder.total_amount ? 'paid' : 'partial';

      // تحديث الطلب
      const { error: orderError } = await supabase
        .from('delivery_orders')
        .update({
          paid_amount: newPaidAmount,
          payment_status: newPaymentStatus
        })
        .eq('id', selectedOrder.id);

      if (orderError) throw orderError;

      // إضافة سجل الدفعة
      const { error: paymentError } = await supabase
        .from('delivery_payments')
        .insert({
          delivery_order_id: selectedOrder.id,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          payment_date: new Date().toISOString().split('T')[0],
          reference_number: paymentData.reference_number,
          notes: paymentData.notes
        });

      if (paymentError) throw paymentError;

      // إنشاء قيد محاسبي للدفعة
      await createAccountingEntry(selectedOrder.id, 'payment_received', paymentData.amount, paymentData.payment_method);

      setShowPaymentModal(false);
      setSelectedOrder(null);
      resetPaymentData();
      fetchDeliveryOrders();
    } catch (error) {
      console.error('خطأ في تسجيل الدفعة:', error);
    }
  };

  const resetPaymentData = () => {
    setPaymentData({
      amount: 0,
      payment_method: 'cash',
      reference_number: '',
      notes: ''
    });
  };

  const addOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { item_name: '', quantity: 1, unit_price: 0, notes: '' }]
    }));
  };

  const removeOrderItem = (index: number) => {
    if (newOrder.items.length > 1) {
      setNewOrder(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'preparing': return 'قيد التحضير';
      case 'out_for_delivery': return 'في الطريق';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوع';
      case 'partial': return 'مدفوع جزئياً';
      case 'unpaid': return 'غير مدفوع';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'نقدي';
      case 'visa': return 'فيزا';
      case 'mixed': return 'مختلط';
      default: return method;
    }
  };

  const filteredOrders = deliveryOrders.filter(order => {
    const matchesStatus = filter === 'all' || order.status === filter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    const matchesDate = !dateFilter || order.order_date.includes(dateFilter);
    return matchesStatus && matchesPayment && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">أوامر التوصيل</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line"></i>
          إضافة طلب توصيل
        </button>
      </div>

      {/* إحصائيات أوامر التوصيل */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <i className="ri-truck-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
              <p className="text-xl font-bold text-gray-900">{deliveryOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <i className="ri-time-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">في الانتظار</p>
              <p className="text-xl font-bold text-gray-900">
                {deliveryOrders.filter(order => order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <i className="ri-road-map-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">في الطريق</p>
              <p className="text-xl font-bold text-gray-900">
                {deliveryOrders.filter(order => order.status === 'out_for_delivery').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <i className="ri-check-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">تم التسليم</p>
              <p className="text-xl font-bold text-gray-900">
                {deliveryOrders.filter(order => order.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <i className="ri-close-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">ملغى</p>
              <p className="text-xl font-bold text-gray-900">
                {deliveryOrders.filter(order => order.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات المبيعات والدفع */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-gray-900">
              {deliveryOrders.reduce((total, order) => total + order.total_amount, 0).toLocaleString()} ج.م
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">المبالغ المحصلة</p>
            <p className="text-2xl font-bold text-green-600">
              {deliveryOrders.reduce((total, order) => total + order.paid_amount, 0).toLocaleString()} ج.م
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">المبالغ المستحقة</p>
            <p className="text-2xl font-bold text-red-600">
              {deliveryOrders.reduce((total, order) => total + (order.total_amount - order.paid_amount), 0).toLocaleString()} ج.م
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">رسوم التوصيل</p>
            <p className="text-2xl font-bold text-blue-600">
              {deliveryOrders.reduce((total, order) => total + order.delivery_fee, 0).toLocaleString()} ج.م
            </p>
          </div>
        </div>
      </div>

      {/* فلاتر */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 pr-8"
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">في الانتظار</option>
          <option value="preparing">قيد التحضير</option>
          <option value="out_for_delivery">في الطريق</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغى</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 pr-8"
        >
          <option value="all">جميع حالات الدفع</option>
          <option value="paid">مدفوع</option>
          <option value="partial">مدفوع جزئياً</option>
          <option value="unpaid">غير مدفوع</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="فلترة حسب التاريخ"
        />
      </div>

      {/* جدول أوامر التوصيل */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ المدفوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {order.delivery_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total_amount.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {order.paid_amount.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentMethodText(order.payment_method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {getPaymentStatusText(order.payment_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          fetchOrderItems(order.id);
                          setShowItemsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="عرض التفاصيل"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      {order.payment_status !== 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setPaymentData(prev => ({
                              ...prev,
                              amount: order.total_amount - order.paid_amount
                            }));
                            setShowPaymentModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                          title="تسجيل دفعة"
                        >
                          <i className="ri-money-dollar-circle-line"></i>
                        </button>
                      )}
                      {order.paid_amount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            fetchPaymentHistory(order.id);
                            setShowPaymentHistoryModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 cursor-pointer"
                          title="تاريخ المدفوعات"
                        >
                          <i className="ri-history-line"></i>
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="بدء التحضير"
                        >
                          <i className="ri-restaurant-line"></i>
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="text-purple-600 hover:text-purple-900 cursor-pointer"
                          title="إرسال للتوصيل"
                        >
                          <i className="ri-truck-line"></i>
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                          title="تأكيد التسليم"
                        >
                          <i className="ri-check-line"></i>
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          title="إلغاء الطلب"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال إضافة طلب توصيل */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة طلب توصيل جديد</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                  <input
                    type="text"
                    value={newOrder.customer_name}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, customer_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={newOrder.customer_phone}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, customer_phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="01xxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان التوصيل</label>
                <textarea
                  value={newOrder.delivery_address}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, delivery_address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={2}
                  placeholder="أدخل العنوان التفصيلي للتوصيل"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رسوم التوصيل</label>
                  <input
                    type="number"
                    value={newOrder.delivery_fee}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, delivery_fee: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                  <input
                    type="text"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="ملاحظات إضافية"
                  />
                </div>
              </div>

              {/* عناصر الطلب */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium">عناصر الطلب</h4>
                  <button
                    onClick={addOrderItem}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line"></i> إضافة عنصر
                  </button>
                </div>

                <div className="space-y-3">
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div>
                        <input
                          type="text"
                          placeholder="اسم الصنف"
                          value={item.item_name}
                          onChange={(e) => updateOrderItem(index, 'item_name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="الكمية"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="السعر"
                          value={item.unit_price}
                          onChange={(e) => updateOrderItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="ملاحظات"
                          value={item.notes}
                          onChange={(e) => updateOrderItem(index, 'notes', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {(item.quantity * item.unit_price).toFixed(2)} ج.م
                        </span>
                        {newOrder.items.length > 1 && (
                          <button
                            onClick={() => removeOrderItem(index)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* إجمالي الطلب */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>رسوم التوصيل:</span>
                    <span>{newOrder.delivery_fee.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>الإجمالي:</span>
                    <span>{(newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) + newOrder.delivery_fee).toFixed(2)} ج.م</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddOrder}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                >
                  إضافة الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال عرض تفاصيل الطلب */}
      {showItemsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تفاصيل الطلب - {selectedOrder.order_number}</h3>
              <button
                onClick={() => setShowItemsModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* معلومات العميل */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">معلومات العميل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">الاسم:</span> {selectedOrder.customer_name}
                  </div>
                  <div>
                    <span className="font-medium">الهاتف:</span> {selectedOrder.customer_phone}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">العنوان:</span> {selectedOrder.delivery_address}
                  </div>
                  {selectedOrder.notes && (
                    <div className="md:col-span-2">
                      <span className="font-medium">ملاحظات:</span> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* عناصر الطلب */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الصنف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكمية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        السعر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجمالي
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ملاحظات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.unit_price} ج.م
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.total_price} ج.م
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ملخص الطلب */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>المجموع الفرعي:</span>
                  <span>{(selectedOrder.total_amount - selectedOrder.delivery_fee).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>رسوم التوصيل:</span>
                  <span>{selectedOrder.delivery_fee.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>الإجمالي:</span>
                  <span>{selectedOrder.total_amount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 mt-2">
                  <span>المبلغ المدفوع:</span>
                  <span>{selectedOrder.paid_amount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>المبلغ المتبقي:</span>
                  <span>{(selectedOrder.total_amount - selectedOrder.paid_amount).toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تسجيل الدفع */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تسجيل دفعة</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">طلب رقم: {selectedOrder.order_number}</p>
                <p className="text-sm text-gray-600">العميل: {selectedOrder.customer_name}</p>
                <p className="text-lg font-bold text-gray-900">
                  الإجمالي: {selectedOrder.total_amount.toLocaleString()} ج.م
                </p>
                <p className="text-sm text-green-600">
                  المدفوع: {selectedOrder.paid_amount.toLocaleString()} ج.م
                </p>
                <p className="text-sm text-red-600 font-medium">
                  المتبقي: {(selectedOrder.total_amount - selectedOrder.paid_amount).toLocaleString()} ج.م
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ الدفعة</label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  max={selectedOrder.total_amount - selectedOrder.paid_amount}
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                <select
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value as 'cash' | 'visa' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                >
                  <option value="cash">نقدي</option>
                  <option value="visa">فيزا</option>
                </select>
              </div>

              {paymentData.payment_method === 'visa' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم المرجع</label>
                  <input
                    type="text"
                    value={paymentData.reference_number}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, reference_number: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="رقم العملية البنكية"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handlePayment}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap cursor-pointer"
                >
                  تسجيل الدفعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تاريخ المدفوعات */}
      {showPaymentHistoryModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تاريخ المدفوعات - {selectedOrder.order_number}</h3>
              <button
                onClick={() => setShowPaymentHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الطلب</p>
                    <p className="text-lg font-bold">{selectedOrder.total_amount.toFixed(2)} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                    <p className="text-lg font-bold text-green-600">{selectedOrder.paid_amount.toFixed(2)} ج.م</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                    <p className="text-lg font-bold text-red-600">{(selectedOrder.total_amount - selectedOrder.paid_amount).toFixed(2)} ج.م</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الدفع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        طريقة الدفع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم المرجع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ملاحظات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.amount.toFixed(2)} ج.م
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getPaymentMethodText(payment.payment_method)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.reference_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
