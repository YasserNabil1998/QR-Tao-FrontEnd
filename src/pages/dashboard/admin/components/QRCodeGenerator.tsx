
import { useState } from 'react'

interface QRCodeGeneratorProps {
  restaurant: any
}

const QRCodeGenerator = ({ restaurant }: QRCodeGeneratorProps) => {
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tables, setTables] = useState<any[]>([])

  const generateQRCode = (tableId: string) => {
    const baseUrl = window.location.origin
    const menuUrl = `${baseUrl}/menu?restaurant=${restaurant.slug}&table=${tableId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`
  }

  const downloadQRCode = (tableId: string, tableNumber: string) => {
    const qrUrl = generateQRCode(tableId)
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `table-${tableNumber}-qr.png`
    link.click()
  }

  const downloadAllQRCodes = () => {
    tables.forEach((table) => {
      setTimeout(() => {
        downloadQRCode(table.id, table.table_number)
      }, 100)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">مولد رموز QR</h2>
        <button
          onClick={downloadAllQRCodes}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <i className="ri-download-line ml-2"></i>
          تحميل جميع الرموز
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات المطعم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">اسم المطعم:</span>
              <span className="mr-2 text-gray-600">{restaurant.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">الرابط المختصر:</span>
              <span className="mr-2 text-gray-600">{restaurant.slug}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">البريد الإلكتروني:</span>
              <span className="mr-2 text-gray-600">{restaurant.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">الهاتف:</span>
              <span className="mr-2 text-gray-600">{restaurant.phone || 'غير محدد'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">رموز QR للطاولات</h3>
          
          {/* Sample QR Code Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                <img
                  src={generateQRCode('sample-table-id')}
                  alt="Sample QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="mt-2 text-sm font-medium text-gray-900">عينة من رمز QR</p>
                <p className="text-xs text-gray-500">طاولة رقم 1</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-500 text-xl mt-1 ml-3"></i>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">كيفية استخدام رموز QR:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• اطبع رموز QR وضعها على كل طاولة</li>
                    <li>• عندما يمسح العميل الرمز، سيتم توجيهه مباشرة لقائمة المطعم</li>
                    <li>• سيتم ربط الطلب تلقائياً برقم الطاولة الصحيح</li>
                    <li>• يمكن للعميل تصفح القائمة وتقديم الطلب والدفع من هاتفه</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="ri-lightbulb-line text-yellow-500 text-xl mt-1 ml-3"></i>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">نصائح للاستخدام الأمثل:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• ضع الرمز في مكان واضح ومرئي على الطاولة</li>
                    <li>• استخدم حامل أكريليك أو إطار لحماية الرمز</li>
                    <li>• تأكد من أن الرمز غير تالف أو مخدوش</li>
                    <li>• أضف تعليمات بسيطة للعملاء حول كيفية المسح</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions for printing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">تعليمات الطباعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">المواصفات المقترحة:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• حجم الرمز: 5×5 سم على الأقل</li>
              <li>• جودة الطباعة: 300 DPI أو أعلى</li>
              <li>• نوع الورق: ورق مقوى أو لامع</li>
              <li>• الألوان: أبيض وأسود للوضوح الأمثل</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">التصميم المقترح:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• أضف شعار المطعم أعلى الرمز</li>
              <li>• اكتب "امسح للطلب" تحت الرمز</li>
              <li>• أضف رقم الطاولة بخط واضح</li>
              <li>• استخدم إطار أو حدود للتميز</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator
