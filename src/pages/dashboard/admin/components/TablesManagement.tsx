
import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase'
import { useAuth } from '../../../../hooks/useAuth'

const TablesManagement = () => {
  const { user } = useAuth()
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTable, setEditingTable] = useState<any>(null)

  useEffect(() => {
    if (user?.restaurant_id) {
      fetchTables()
    }
  }, [user?.restaurant_id])

  const fetchTables = async () => {
    if (!user?.restaurant_id) {
      console.error('No restaurant ID found')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', user.restaurant_id)
        .order('table_number')

      if (error) throw error
      setTables(data || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate QR code URL for table
  const generateQRCode = (restaurantId: string, tableId: string) => {
    const menuUrl = `${window.location.origin}/menu/${restaurantId}?table=${tableId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`
  }

  const handleSaveTable = async (tableData: any) => {
    if (!user?.restaurant_id) {
      alert('خطأ: لم يتم العثور على معرف المطعم')
      return
    }

    try {
      if (editingTable) {
        const { error } = await supabase
          .from('tables')
          .update(tableData)
          .eq('id', editingTable.id)
        if (error) throw error
      } else {
        // Generate a temporary ID for QR code generation
        const tempId = crypto.randomUUID()
        const qrCodeUrl = generateQRCode(user.restaurant_id, tempId)
        
        const { data, error } = await supabase
          .from('tables')
          .insert({
            ...tableData,
            restaurant_id: user.restaurant_id,
            qr_code: qrCodeUrl
          })
          .select()
          .single()
        
        if (error) throw error
        
        // Update with actual table ID in QR code
        if (data) {
          const actualQRCode = generateQRCode(user.restaurant_id, data.id)
          await supabase
            .from('tables')
            .update({ qr_code: actualQRCode })
            .eq('id', data.id)
        }
      }
      
      fetchTables()
      setShowModal(false)
      setEditingTable(null)
    } catch (error) {
      console.error('Error saving table:', error)
      alert('حدث خطأ في حفظ الطاولة. يرجى المحاولة مرة أخرى.')
    }
  }

  const handleDeleteTable = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الطاولة؟')) {
      try {
        const { error } = await supabase
          .from('tables')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        fetchTables()
      } catch (error) {
        console.error('Error deleting table:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'cleaning': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'متاحة'
      case 'occupied': return 'مشغولة'
      case 'reserved': return 'محجوزة'
      case 'cleaning': return 'قيد التنظيف'
      default: return status
    }
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
        <h2 className="text-2xl font-bold text-gray-900">إدارة الطاولات</h2>
        <button
          onClick={() => {
            setEditingTable(null)
            setShowModal(true)
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <i className="ri-add-line ml-2"></i>
          إضافة طاولة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                طاولة {table.table_number}
              </h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(table.status)}`}>
                {getStatusText(table.status)}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-group-line ml-2"></i>
                <span>السعة: {table.capacity} أشخاص</span>
              </div>
              {table.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-map-pin-line ml-2"></i>
                  <span>{table.location}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => {
                  setEditingTable(table)
                  setShowModal(true)
                }}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="px-3 py-2 bg-red-5
00 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>

            {/* QR Code Preview */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                {table.qr_code ? (
                  <img 
                    src={table.qr_code} 
                    alt="QR Code" 
                    className="w-16 h-16 mx-auto mb-2 rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <i className="ri-qr-code-line text-2xl text-gray-400"></i>
                  </div>
                )}
                <p className="text-xs text-gray-500">رمز QR للطاولة</p>
                {table.qr_code && (
                  <button
                    onClick={() => window.open(table.qr_code, '_blank')}
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                  >
                    عرض كامل
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-table-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طاولات</h3>
          <p className="text-gray-500">ابدأ بإضافة طاولات لمطعمك</p>
        </div>
      )}

      {/* Table Modal */}
      {showModal && (
        <TableModal
          table={editingTable}
          onSave={handleSaveTable}
          onClose={() => {
            setShowModal(false)
            setEditingTable(null)
          }}
        />
      )}
    </div>
  )
}

// Table Modal Component
const TableModal = ({ table, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    table_number: table?.table_number || '',
    capacity: table?.capacity || 4,
    location: table?.location || '',
    status: table?.status || 'available'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {table ? 'تعديل الطاولة' : 'إضافة طاولة جديدة'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الطاولة
            </label>
            <input
              type="text"
              value={formData.table_number}
              onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              السعة (عدد الأشخاص)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموقع (اختياري)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="مثال: الطابق الأول، بجانب النافذة"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="available">متاحة</option>
              <option value="occupied">مشغولة</option>
              <option value="reserved">محجوزة</option>
              <option value="cleaning">قيد التنظيف</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TablesManagement
