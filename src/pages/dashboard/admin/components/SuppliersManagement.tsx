
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms: string;
  credit_limit: number;
  current_balance: number;
  rating: number;
  is_active: boolean;
  contract_start_date?: string;
  contract_end_date?: string;
  discount_percentage: number;
  delivery_time_days: number;
  notes?: string;
  created_at: string;
}

interface SupplierPerformance {
  supplier_id: string;
  on_time_deliveries: number;
  total_deliveries: number;
  quality_rating: number;
  price_competitiveness: number;
  last_delivery_date?: string;
}

export default function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    payment_terms: '30',
    credit_limit: 0,
    rating: 5,
    contract_start_date: '',
    contract_end_date: '',
    discount_percentage: 0,
    delivery_time_days: 7,
    notes: ''
  });

  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'مزارع الخليج',
      contact_person: 'محمد أحمد',
      phone: '+20123456789',
      email: 'info@gulfarms.com',
      address: 'القاهرة، مصر',
      payment_terms: '30 يوم',
      credit_limit: 50000,
      current_balance: 15000,
      rating: 4.5,
      is_active: true,
      discount_percentage: 5,
      delivery_time_days: 7,
      notes: 'مورد موثوق للحوم الطازجة',
      created_at: '',
      contract_start_date: '',
      contract_end_date: '',
    },
    {
      id: '2',
      name: 'شركة الحبوب المتحدة',
      contact_person: 'فاطمة علي',
      phone: '+20987654321',
      email: 'sales@grains.com',
      address: 'الإسكندرية، مصر',
      payment_terms: '15 يوم',
      credit_limit: 30000,
      current_balance: 8500,
      rating: 4.2,
      is_active: true,
      discount_percentage: 3,
      delivery_time_days: 7,
      notes: 'أسعار تنافسية للحبوب',
      created_at: '',
      contract_start_date: '',
      contract_end_date: '',
    }
  ];

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('خطأ في جلب الموردين:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .insert({
          ...supplierForm,
          current_balance: 0,
          is_active: true,
          restaurant_id: '00000000-0000-0000-0000-000000000000'
        });

      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('خطأ في إضافة المورد:', error);
    }
  };

  const handleEditSupplier = async () => {
    if (!selectedSupplier) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .update(supplierForm)
        .eq('id', selectedSupplier.id);

      if (error) throw error;

      setShowEditModal(false);
      setSelectedSupplier(null);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('خطأ في تحديث المورد:', error);
    }
  };

  const toggleSupplierStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchSuppliers();
    } catch (error) {
      console.error('خطأ في تحديث حالة المورد:', error);
    }
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      payment_terms: supplier.payment_terms,
      credit_limit: supplier.credit_limit,
      rating: supplier.rating,
      contract_start_date: supplier.contract_start_date || '',
      contract_end_date: supplier.contract_end_date || '',
      discount_percentage: supplier.discount_percentage,
      delivery_time_days: supplier.delivery_time_days,
      notes: supplier.notes || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setSupplierForm({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      payment_terms: '30',
      credit_limit: 0,
      rating: 5,
      contract_start_date: '',
      contract_end_date: '',
      discount_percentage: 0,
      delivery_time_days: 7,
      notes: ''
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400`}
      ></i>
    ));
  };

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case '0': return 'فوري';
      case '15': return '15 يوم';
      case '30': return '30 يوم';
      case '60': return '60 يوم';
      case '90': return '90 يوم';
      default: return `${terms} يوم`;
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && supplier.is_active;
    if (filter === 'inactive') return matchesSearch && !supplier.is_active;
    if (filter === 'high_rating') return matchesSearch && supplier.rating >= 4;
    if (filter === 'contract_expiring') {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return matchesSearch && supplier.contract_end_date && 
             new Date(supplier.contract_end_date) <= thirtyDaysFromNow;
    }
    return matchesSearch;
  });

  // حساب الإحصائيات
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.is_active).length;
  const inactiveSuppliers = suppliers.filter(s => !s.is_active).length;
  const highRatedSuppliers = suppliers.filter(s => s.rating >= 4).length;

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
        <h2 className="text-2xl font-bold text-gray-900">إدارة الموردين</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line"></i>
          إضافة مورد جديد
        </button>
      </div>

      {/* إحصائيات الموردين */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <i className="ri-group-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي الموردين</p>
              <p className="text-xl font-bold text-gray-900">{totalSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <i className="ri-check-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">نشط</p>
              <p className="text-xl font-bold text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <i className="ri-close-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">غير نشط</p>
              <p className="text-xl font-bold text-gray-900">{inactiveSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <i className="ri-star-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">تقييم عالي</p>
              <p className="text-xl font-bold text-gray-900">{highRatedSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <i className="ri-money-dollar-circle-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي الرصيد</p>
              <p className="text-lg font-bold text-gray-900">{mockSuppliers.reduce((total, supplier) => total + supplier.current_balance, 0).toLocaleString()} ج.م</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
              <i className="ri-bank-line text-lg"></i>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-600">إجمالي الحد الائتماني</p>
              <p className="text-lg font-bold text-gray-900">{mockSuppliers.reduce((total, supplier) => total + supplier.credit_limit, 0).toLocaleString()} ج.م</p>
            </div>
          </div>
        </div>
      </div>

      {/* فلاتر وبحث */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="البحث في الموردين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 pr-8"
        >
          <option value="all">جميع الموردين</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
          <option value="high_rating">تقييم عالي</option>
          <option value="contract_expiring">عقود منتهية الصلاحية</option>
        </select>
      </div>

      {/* جدول الموردين */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الشخص المسؤول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شروط الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحد الائتماني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الرصيد الحالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقييم
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
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.contact_person}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentTermsText(supplier.payment_terms)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {supplier.credit_limit.toLocaleString()} ج.م
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      supplier.current_balance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {supplier.current_balance.toLocaleString()} ج.م
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex">
                      {getRatingStars(supplier.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(supplier)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="تعديل"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => toggleSupplierStatus(supplier.id, supplier.is_active)}
                        className={`${supplier.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} cursor-pointer`}
                        title={supplier.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                      >
                        <i className={`ri-${supplier.is_active ? 'close' : 'check'}-line`}></i>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setShowPerformanceModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 cursor-pointer"
                        title="تقييم الأداء"
                      >
                        <i className="ri-bar-chart-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال إضافة مورد */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة مورد جديد</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المورد</label>
                  <input
                    type="text"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشخص المسؤول</label>
                  <input
                    type="text"
                    value={supplierForm.contact_person}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contact_person: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <textarea
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شروط الدفع (بالأيام)</label>
                  <select
                    value={supplierForm.payment_terms}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                  >
                    <option value="0">فوري</option>
                    <option value="15">15 يوم</option>
                    <option value="30">30 يوم</option>
                    <option value="60">60 يوم</option>
                    <option value="90">90 يوم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الائتماني</label>
                  <input
                    type="number"
                    value={supplierForm.credit_limit}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, credit_limit: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ بداية العقد</label>
                  <input
                    type="date"
                    value={supplierForm.contract_start_date}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contract_start_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء العقد</label>
                  <input
                    type="date"
                    value={supplierForm.contract_end_date}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contract_end_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={supplierForm.discount_percentage}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدة التوريد (بالأيام)</label>
                  <input
                    type="number"
                    value={supplierForm.delivery_time_days}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, delivery_time_days: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التقييم</label>
                  <select
                    value={supplierForm.rating}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                  >
                    <option value={1}>⭐ (1)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                  <textarea
                    value={supplierForm.notes}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
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
                  onClick={handleAddSupplier}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                >
                  إضافة المورد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال تعديل مورد */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">تعديل بيانات المورد</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المورد</label>
                  <input
                    type="text"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشخص المسؤول</label>
                  <input
                    type="text"
                    value={supplierForm.contact_person}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contact_person: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <textarea
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شروط الدفع (بالأيام)</label>
                  <select
                    value={supplierForm.payment_terms}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, payment_terms: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                  >
                    <option value="0">فوري</option>
                    <option value="15">15 يوم</option>
                    <option value="30">30 يوم</option>
                    <option value="60">60 يوم</option>
                    <option value="90">90 يوم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحد الائتماني</label>
                  <input
                    type="number"
                    value={supplierForm.credit_limit}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, credit_limit: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ بداية العقد</label>
                  <input
                    type="date"
                    value={supplierForm.contract_start_date}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contract_start_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء العقد</label>
                  <input
                    type="date"
                    value={supplierForm.contract_end_date}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contract_end_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={supplierForm.discount_percentage}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">مدة التوريد (بالأيام)</label>
                  <input
                    type="number"
                    value={supplierForm.delivery_time_days}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, delivery_time_days: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التقييم</label>
                  <select
                    value={supplierForm.rating}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8"
                  >
                    <option value={1}>⭐ (1)</option>
                    <option value={2}>⭐⭐ (2)</option>
                    <option value={3}>⭐⭐⭐ (3)</option>
                    <option value={4}>⭐⭐⭐⭐ (4)</option>
                    <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                  <textarea
                    value={supplierForm.notes}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleEditSupplier}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 whitespace-nowrap cursor-pointer"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
