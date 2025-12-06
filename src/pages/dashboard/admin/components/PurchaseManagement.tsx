
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface Purchase {
  id: string;
  purchase_number: string;
  purchase_date: string;
  expected_delivery_date: string;
  actual_delivery_date?: string;
  status: 'pending' | 'approved' | 'ordered' | 'delivered' | 'rejected' | 'returned';
  total_amount: number;
  supplier: {
    name: string;
  };
  notes?: string;
  approved_by?: string;
  approved_date?: string;
  shipping_cost?: number;
  storage_cost?: number;
}

interface PurchaseItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  returned_quantity?: number;
  return_reason?: string;
}

interface QuoteComparison {
  supplier_id: string;
  supplier_name: string;
  quoted_price: number;
  delivery_time: number;
  notes: string;
}

// Mock data for display purposes
const mockPurchases: Purchase[] = [
  {
    id: '1',
    purchase_number: 'PO-2024-001',
    purchase_date: '2024-01-15',
    expected_delivery_date: '2024-01-18',
    status: 'pending',
    total_amount: 2500,
    supplier: { name: 'مزارع الخليج' },
    notes: 'طلب عاجل للمخزون',
    shipping_cost: 50,
    storage_cost: 0,
    approved_by: undefined,
    approved_date: undefined
  },
  {
    id: '2',
    purchase_number: 'PO-2024-002',
    purchase_date: '2024-01-14',
    expected_delivery_date: '2024-01-17',
    status: 'approved',
    total_amount: 1800,
    supplier: { name: 'شركة الحبوب المتحدة' },
    notes: 'طلب شهري للحبوب',
    shipping_cost: 30,
    storage_cost: 0,
    approved_by: 'أحمد محمد',
    approved_date: undefined
  }
];

export default function PurchaseManagement() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const [newPurchase, setNewPurchase] = useState({
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    notes: '',
    shipping_cost: 0,
    storage_cost: 0,
    items: [{ item_name: '', quantity: 1, unit: 'كيلو', unit_price: 0 }]
  });

  const [returnData, setReturnData] = useState({
    item_id: '',
    returned_quantity: 0,
    return_reason: ''
  });

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          supplier:suppliers(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('خطأ في جلب المشتريات:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('خطأ في جلب الموردين:', error);
    }
  };

  const fetchPurchaseItems = async (purchaseId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchase_items')
        .select('*')
        .eq('purchase_id', purchaseId);

      if (error) throw error;
      setPurchaseItems(data || []);
    } catch (error) {
      console.error('خطأ في جلب عناصر المشتريات:', error);
    }
  };

  const handleAddPurchase = async () => {
    try {
      const purchaseNumber = `PUR-${Date.now()}`;
      const subtotal = newPurchase.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const taxAmount = subtotal * 0.15;
      const totalAmount = subtotal + taxAmount + newPurchase.shipping_cost + newPurchase.storage_cost;

      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          purchase_number: purchaseNumber,
          supplier_id: newPurchase.supplier_id,
          purchase_date: newPurchase.purchase_date,
          expected_delivery_date: newPurchase.expected_delivery_date,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          shipping_cost: newPurchase.shipping_cost,
          storage_cost: newPurchase.storage_cost,
          notes: newPurchase.notes,
          status: 'pending',
          restaurant_id: '00000000-0000-0000-0000-000000000000'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      const itemsToInsert = newPurchase.items.map(item => ({
        purchase_id: purchaseData.id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setShowAddModal(false);
      resetNewPurchase();
      fetchPurchases();
    } catch (error) {
      console.error('خطأ في إضافة المشتريات:', error);
    }
  };

  const resetNewPurchase = () => {
    setNewPurchase({
      supplier_id: '',
      purchase_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: '',
      notes: '',
      shipping_cost: 0,
      storage_cost: 0,
      items: [{ item_name: '', quantity: 1, unit: 'كيلو', unit_price: 0 }]
    });
  };

  const updatePurchaseStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'delivered') {
        updateData.actual_delivery_date = new Date().toISOString().split('T')[0];
      }
      if (status === 'approved') {
        updateData.approved_by = 'المدير المالي';
        updateData.approved_date = new Date().toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('purchases')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      fetchPurchases();
    } catch (error) {
      console.error('خطأ في تحديث حالة المشتريات:', error);
    }
  };

  const handleReturn = async () => {
    try {
      const { error } = await supabase
        .from('purchase_items')
        .update({
          returned_quantity: returnData.returned_quantity,
          return_reason: returnData.return_reason
        })
        .eq('id', returnData.item_id);

      if (error) throw error;

      setShowReturnModal(false);
      setReturnData({ item_id: '', returned_quantity: 0, return_reason: '' });
      fetchPurchaseItems(selectedPurchase!);
    } catch (error) {
      console.error('خطأ في تسجيل المرتجعات:', error);
    }
  };

  const addPurchaseItem = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { item_name: '', quantity: 1, unit: 'كيلو', unit_price: 0 }]
    }));
  };

  const removePurchaseItem = (index: number) => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updatePurchaseItem = (index: number, field: string, value: any) => {
    setNewPurchase(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'ordered': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'approved': return 'معتمد';
      case 'ordered': return 'تم الطلب';
      case 'delivered': return 'تم التسليم';
      case 'rejected': return 'مرفوض';
      case 'returned': return 'مرتجع';
      default: return status;
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesStatus = filter === 'all' || purchase.status === filter;
    const matchesDate = !dateFilter || purchase.purchase_date.includes(dateFilter);
    return matchesStatus && matchesDate;
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
        <h2 className="text-2xl font-bold text-gray-900">إدارة المشتريات</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line"></i>
          إضافة طلب شراء جديد
        </button>
      </div>

      {/* إحصائيات المشتريات باستخدام بيانات mock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">إجمالي المشتريات</div>
            <div className="text-xl font-bold text-gray-900">
              {mockPurchases.reduce((total, purchase) => total + purchase.total_amount, 0).toLocaleString()} ج.م
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">قيمة المشتريات المنتظرة</div>
            <div className="text-xl font-bold text-gray-900">
              {mockPurchases.filter(p => p.status === 'pending').reduce((total, purchase) => total + purchase.total_amount, 0).toLocaleString()} ج.م
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">إجمالي الضريبة</div>
            <div className="text-xl font-bold text-gray-900">
              {mockPurchases.reduce((total, purchase) => total + purchase.tax_amount, 0).toLocaleString()} ج.م
            </div>
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
          <option value="all">جميع المشتريات</option>
          <option value="pending">في الانتظار</option>
          <option value="approved">معتمد</option>
          <option value="ordered">تم الطلب</option>
          <option value="delivered">تم التسليم</option>
          <option value="rejected">مرفوض</option>
          <option value="returned">مرتجع</option>
        </select>
        <input
          type="month"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="فلترة حسب الشهر"
        />
      </div>

      {/* جدول المشتريات */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم المشتريات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسليم المتوقع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {purchase.purchase_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.supplier?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(purchase.purchase_date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.expected_delivery_date ?
                      new Date(purchase.expected_delivery_date).toLocaleDateString('ar-SA') :
                      'غير محدد'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {purchase.total_amount.toLocaleString()} ج.م
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPurchase(purchase.id);
                          fetchPurchaseItems(purchase.id);
                          setShowItemsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="عرض التفاصيل"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      {purchase.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updatePurchaseStatus(purchase.id, 'approved')}
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            title="اعتماد الطلب"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                          <button
                            onClick={() => updatePurchaseStatus(purchase.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="رفض الطلب"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </>
                      )}
                      {purchase.status === 'approved' && (
                        <button
                          onClick={() => updatePurchaseStatus(purchase.id, 'ordered')}
                          className="text-purple-600 hover:text-purple-900 cursor-pointer"
                          title="تأكيد الطلب"
                        >
                          <i className="ri-shopping-bag-line"></i>
                        </button>
                      )}
                      {purchase.status === 'ordered' && (
                        <button
                          onClick={() => updatePurchaseStatus(purchase.id, 'delivered')}
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                          title="تأكيد الاستلام"
                        >
                          <i className="ri-truck-line"></i>
                        </button>
                      )}
                      {purchase.status === 'delivered' && (
                        <button
                          onClick={() => {
                            setSelectedPurchase(purchase.id);
                            fetchPurchaseItems(purchase.id);
                            setShowReturnModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-900 cursor-pointer"
                          title="إدارة المرتجعات"
                        >
                          <i className="ri-arrow-go-back-line"></i>
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

      {/* مودال إضافة مشتريات */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة مشتريات جديدة</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">المورد</label>
                  <select
                    value={newPurchase.supplier_id}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, supplier_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                    required
                  >
                    <option value="">اختر المورد</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الطلب</label>
                  <input
                    type="date"
                    value={newPurchase.purchase_date}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, purchase_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسليم المتوقع</label>
                  <input
                    type="date"
                    value={newPurchase.expected_delivery_date}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  value={newPurchase.notes}
                  onChange={(e) => setNewPurchase(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              {/* عناصر المشتريات */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium">عناصر المشتريات</h4>
                  <button
                    onClick={addPurchaseItem}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line"></i> إضافة عنصر
                  </button>
                </div>

                <div className="space-y-3">
                  {newPurchase.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div>
                        <input
                          type="text"
                          placeholder="اسم العنصر"
                          value={item.item_name}
                          onChange={(e) => updatePurchaseItem(index, 'item_name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="الكمية"
                          value={item.quantity}
                          onChange={(e) => updatePurchaseItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <select
                          value={item.unit}
                          onChange={(e) => updatePurchaseItem(index, 'unit', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-8"
                        >
                          <option value="كيلو">كيلو</option>
                          <option value="جرام">جرام</option>
                          <option value="لتر">لتر</option>
                          <option value="قطعة">قطعة</option>
                          <option value="علبة">علبة</option>
                          <option value="كيس">كيس</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="السعر للوحدة"
                          value={item.unit_price}
                          onChange={(e) => updatePurchaseItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {(item.quantity * item.unit_price).toFixed(2)} ر.س
                        </span>
                        {newPurchase.items.length > 1 && (
                          <button
                            onClick={() => removePurchaseItem(index)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* إجمالي المبلغ */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{newPurchase.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>الضريبة (15%):</span>
                    <span>{(newPurchase.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * 0.15).toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>الإجمالي:</span>
                    <span>{(newPurchase.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * 1.15).toFixed(2)} ر.س</span>
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
                  onClick={handleAddPurchase}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                >
                  إضافة المشتريات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال عرض عناصر المشتريات */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">عناصر المشتريات</h3>
              <button
                onClick={() => setShowItemsModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم العنصر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوحدة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      سعر الوحدة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجمالي
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unit_price} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.total_price} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* مودال إدارة المرتجعات */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إدارة المرتجعات</h3>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنصر</label>
                <select
                  value={returnData.item_id}
                  onChange={(e) => setReturnData(prev => ({ ...prev, item_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                  required
                >
                  <option value="">اختر العنصر</option>
                  {purchaseItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} - الكمية: {item.quantity} {item.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المرتجعة</label>
                <input
                  type="number"
                  value={returnData.returned_quantity}
                  onChange={(e) => setReturnData(prev => ({ ...prev, returned_quantity: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سبب الإرجاع</label>
                <textarea
                  value={returnData.return_reason}
                  onChange={(e) => setReturnData(prev => ({ ...prev, return_reason: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="اذكر سبب الإرجاع (تالف، زائد، غير مطابق للمواصفات...)"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                >
                  تسجيل الإرجاع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
