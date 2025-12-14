import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useTablesContext } from "../../../../context/TablesContext";
import { useToast } from "../../../../hooks/useToast";
import Loader from "../../../../components/common/Loader";

interface QRCodeGeneratorProps {
    restaurant: any;
}

const QRCodeGenerator = ({ restaurant }: QRCodeGeneratorProps) => {
    const { user, loading: authLoading } = useAuth();
    const { showToast, ToastContainer } = useToast();
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    // Initialize local state for tables (fallback if context not available)
    const [localTables] = useState<any[]>([
        {
            id: "table-1",
            table_number: "1",
            capacity: 4,
            location: "الطابق الأول، بجانب النافذة",
            status: "available",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-1`
            )}`,
        },
        {
            id: "table-2",
            table_number: "2",
            capacity: 6,
            location: "الطابق الأول، وسط القاعة",
            status: "occupied",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-2`
            )}`,
        },
        {
            id: "table-3",
            table_number: "3",
            capacity: 2,
            location: "الطابق الثاني، ركن هادئ",
            status: "available",
            restaurant_id: "demo-restaurant",
            qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `${window.location.origin}/menu/demo-restaurant?table=table-3`
            )}`,
        },
    ]);

    // Try to get tables from context, or use local state
    let tablesContext: any = null;
    try {
        tablesContext = useTablesContext();
    } catch (error) {
        // Context not available, will use local state
    }

    // Use context if available, otherwise use local state
    const tables = tablesContext?.tables || localTables;

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        // Get restaurant ID from user or restaurant prop
        const userRestaurantId = user?.restaurant_id;
        const restaurantIdFromProp =
            restaurant?.id || restaurant?.restaurant_id;
        const finalRestaurantId =
            restaurantIdFromProp || userRestaurantId || "demo-restaurant";

        setRestaurantId(finalRestaurantId);

        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, [authLoading, user, restaurant]);

    const generateQRCode = (tableId: string) => {
        const restaurantIdToUse =
            restaurantId ||
            user?.restaurant_id ||
            restaurant?.id ||
            restaurant?.restaurant_id ||
            "demo-restaurant";
        const menuUrl = `${window.location.origin}/menu/${restaurantIdToUse}?table=${tableId}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            menuUrl
        )}`;
    };

    const downloadQRCode = async (tableId: string, tableNumber: string) => {
        try {
            const qrUrl = generateQRCode(tableId);
            const link = document.createElement("a");
            link.href = qrUrl;
            link.download = `table-${tableNumber}-qr.png`;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast(`تم تحميل رمز QR لطاولة رقم ${tableNumber}`, "success");
        } catch (error) {
            console.error("Error downloading QR code:", error);
            showToast("حدث خطأ أثناء تحميل رمز QR", "error");
        }
    };

    const downloadAllQRCodes = async () => {
        if (tables.length === 0) {
            showToast("لا توجد طاولات للتحميل", "warning");
            return;
        }

        try {
            showToast("جارٍ إنشاء الملف...", "info");

            // Create HTML content with all QR codes
            const restaurantName =
                restaurant?.name || user?.full_name || "مطعم تجريبي";
            const currentDate = new Date().toLocaleDateString("ar-SA");

            let htmlContent = `
                <!DOCTYPE html>
                <html dir="rtl" lang="ar">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>رموز QR للطاولات - ${restaurantName}</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            padding: 20px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header h1 {
                            color: #ea580c;
                            font-size: 28px;
                            margin-bottom: 10px;
                        }
                        .header p {
                            color: #666;
                            font-size: 14px;
                        }
                        .qr-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                            gap: 20px;
                            margin-bottom: 20px;
                        }
                        .qr-card {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            page-break-inside: avoid;
                        }
                        .qr-card img {
                            width: 150px;
                            height: 150px;
                            margin: 0 auto 10px;
                            display: block;
                        }
                        .qr-card h3 {
                            color: #333;
                            font-size: 18px;
                            margin-bottom: 5px;
                        }
                        .qr-card p {
                            color: #666;
                            font-size: 12px;
                            margin: 2px 0;
                        }
                        @media print {
                            body {
                                background: white;
                                padding: 10px;
                            }
                            .header {
                                margin-bottom: 20px;
                            }
                            .qr-grid {
                                gap: 15px;
                            }
                            @page {
                                margin: 1cm;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${restaurantName}</h1>
                        <p>رموز QR للطاولات - ${currentDate}</p>
                        <p>إجمالي الطاولات: ${tables.length}</p>
                    </div>
                    <div class="qr-grid">
            `;

            // Add each QR code to HTML
            tables.forEach((table: any) => {
                const qrUrl = generateQRCode(table.id);
                htmlContent += `
                    <div class="qr-card">
                        <img src="${qrUrl}" alt="QR Code for Table ${
                    table.table_number
                }" />
                        <h3>طاولة رقم ${table.table_number}</h3>
                        ${
                            table.capacity
                                ? `<p>السعة: ${table.capacity} أشخاص</p>`
                                : ""
                        }
                        ${table.location ? `<p>${table.location}</p>` : ""}
                    </div>
                `;
            });

            htmlContent += `
                    </div>
                </body>
                </html>
            `;

            // Create a blob and download it as HTML file
            const blob = new Blob([htmlContent], {
                type: "text/html;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `qr-codes-${restaurantName.replace(
                /\s+/g,
                "-"
            )}-${Date.now()}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Also open print dialog for PDF
            setTimeout(() => {
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                    printWindow.onload = () => {
                        printWindow.print();
                    };
                }
            }, 500);

            showToast(
                `تم إنشاء الملف بنجاح! يمكنك طباعته كـ PDF من نافذة الطباعة`,
                "success"
            );
        } catch (error) {
            console.error("Error creating QR codes file:", error);
            showToast("حدث خطأ أثناء إنشاء الملف", "error");
        }
    };

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                        مولد رموز QR
                    </h2>
                    {tables.length > 0 && (
                        <button
                            onClick={downloadAllQRCodes}
                            className="w-full sm:w-auto bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <i className="ri-download-line"></i>
                            <span className="text-sm sm:text-base">تحميل جميع الرموز</span>
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 font-cairo">
                            معلومات المطعم
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-gray-700 font-tajawal">
                                    اسم المطعم:
                                </span>
                                <span className="text-gray-600 font-cairo">
                                    {restaurant?.name ||
                                        user?.full_name ||
                                        "مطعم تجريبي"}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-gray-700 font-tajawal">
                                    الرابط المختصر:
                                </span>
                                <span className="text-gray-600 font-cairo break-all">
                                    {restaurantId ||
                                        user?.restaurant_id ||
                                        "demo-restaurant"}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-gray-700 font-tajawal">
                                    البريد الإلكتروني:
                                </span>
                                <span className="text-gray-600 font-cairo break-all">
                                    {restaurant?.email ||
                                        user?.email ||
                                        "demo@restaurant.com"}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-gray-700 font-tajawal">
                                    الهاتف:
                                </span>
                                <span className="text-gray-600 font-cairo">
                                    {restaurant?.phone || "0501234567"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 font-cairo">
                            رموز QR للطاولات
                        </h3>

                        {tables.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <i className="ri-table-line text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 font-cairo">
                                    لا توجد طاولات
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 mb-4 px-4 font-tajawal">
                                    {!restaurantId && !user?.restaurant_id
                                        ? "يرجى ربط حسابك بمطعم أولاً من صفحة الإعدادات"
                                        : "يرجى إضافة طاولات أولاً من صفحة إدارة الطاولات"}
                                </p>
                                {!restaurantId && !user?.restaurant_id && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
                                        <p className="text-xs sm:text-sm text-yellow-800 font-tajawal">
                                            <i className="ri-information-line ml-1"></i>
                                            يجب ربط حسابك بمطعم لعرض رموز QR.
                                            يمكنك إضافة مطعم من صفحة الإعدادات.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                {tables.map((table: any) => (
                                    <div
                                        key={table.id}
                                        className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                                    >
                                        <div className="text-center">
                                            <div className="inline-block p-3 sm:p-4 bg-white rounded-lg shadow-sm w-full max-w-[200px]">
                                                <img
                                                    src={generateQRCode(
                                                        table.id
                                                    )}
                                                    alt={`QR Code for Table ${table.table_number}`}
                                                    className="w-24 h-24 sm:w-32 sm:h-32 mx-auto"
                                                />
                                                <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900 font-cairo">
                                                    طاولة رقم{" "}
                                                    {table.table_number}
                                                </p>
                                                {table.capacity && (
                                                    <p className="text-xs text-gray-500 mt-1 font-tajawal">
                                                        السعة: {table.capacity}{" "}
                                                        أشخاص
                                                    </p>
                                                )}
                                                {table.location && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-tajawal">
                                                        {table.location}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        downloadQRCode(
                                                            table.id,
                                                            table.table_number
                                                        )
                                                    }
                                                    className="mt-2 text-xs sm:text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
                                                >
                                                    <i className="ri-download-line"></i>
                                                    تحميل
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <i className="ri-information-line text-blue-500 text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-1"></i>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2 font-cairo">
                                            كيفية استخدام رموز QR:
                                        </h4>
                                        <ul className="text-xs sm:text-sm text-blue-800 space-y-1 font-tajawal">
                                            <li>
                                                • اطبع رموز QR وضعها على كل
                                                طاولة
                                            </li>
                                            <li>
                                                • عندما يمسح العميل الرمز، سيتم
                                                توجيهه مباشرة لقائمة المطعم
                                            </li>
                                            <li>
                                                • سيتم ربط الطلب تلقائياً برقم
                                                الطاولة الصحيح
                                            </li>
                                            <li>
                                                • يمكن للعميل تصفح القائمة
                                                وتقديم الطلب والدفع من هاتفه
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <i className="ri-lightbulb-line text-yellow-500 text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-1"></i>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm sm:text-base font-medium text-yellow-900 mb-2 font-cairo">
                                            نصائح للاستخدام الأمثل:
                                        </h4>
                                        <ul className="text-xs sm:text-sm text-yellow-800 space-y-1 font-tajawal">
                                            <li>
                                                • ضع الرمز في مكان واضح ومرئي
                                                على الطاولة
                                            </li>
                                            <li>
                                                • استخدم حامل أكريليك أو إطار
                                                لحماية الرمز
                                            </li>
                                            <li>
                                                • تأكد من أن الرمز غير تالف أو
                                                مخدوش
                                            </li>
                                            <li>
                                                • أضف تعليمات بسيطة للعملاء حول
                                                كيفية المسح
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions for printing */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 font-cairo">
                        تعليمات الطباعة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 font-cairo">
                                المواصفات المقترحة:
                            </h4>
                            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 font-tajawal">
                                <li>• حجم الرمز: 5×5 سم على الأقل</li>
                                <li>• جودة الطباعة: 300 DPI أو أعلى</li>
                                <li>• نوع الورق: ورق مقوى أو لامع</li>
                                <li>• الألوان: أبيض وأسود للوضوح الأمثل</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 font-cairo">
                                التصميم المقترح:
                            </h4>
                            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 font-tajawal">
                                <li>• أضف شعار المطعم أعلى الرمز</li>
                                <li>• اكتب "امسح للطلب" تحت الرمز</li>
                                <li>• أضف رقم الطاولة بخط واضح</li>
                                <li>• استخدم إطار أو حدود للتميز</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QRCodeGenerator;
