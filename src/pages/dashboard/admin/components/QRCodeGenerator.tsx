import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useTablesContext } from "../../../../context/TablesContext";
import { useToast } from "../../../../hooks/useToast";
import { supabase } from "../../../../lib/supabase";

interface QRCodeGeneratorProps {
    restaurant: any;
}

const QRCodeGenerator = ({ restaurant }: QRCodeGeneratorProps) => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [restaurantData, setRestaurantData] = useState<any>(null);
    const [tables, setTables] = useState<any[]>([]);
    const { showToast, ToastContainer } = useToast();

    // Safely get tables from context
    let tablesContext;
    try {
        tablesContext = useTablesContext();
        if (tablesContext?.tables) {
            if (
                tables.length === 0 ||
                tables.length !== tablesContext.tables.length
            ) {
                setTables(tablesContext.tables);
            }
        }
    } catch (error) {
        // Context not available, use empty array
        console.warn("TablesContext not available, using empty tables array");
    }

    useEffect(() => {
        const fetchRestaurantData = async () => {
            if (authLoading) {
                setLoading(true);
                return;
            }

            try {
                // Get restaurant ID from user or restaurant prop
                const userRestaurantId = user?.restaurant_id;
                const restaurantIdFromProp =
                    restaurant?.id || restaurant?.restaurant_id;
                const finalRestaurantId =
                    restaurantIdFromProp ||
                    userRestaurantId ||
                    "demo-restaurant";

                setRestaurantId(finalRestaurantId);

                // If we have a restaurant ID (not demo), try to fetch restaurant data
                if (
                    finalRestaurantId &&
                    finalRestaurantId !== "demo-restaurant"
                ) {
                    try {
                        const { data, error } = await supabase
                            .from("restaurants")
                            .select("*")
                            .eq("id", finalRestaurantId)
                            .single();

                        if (!error && data) {
                            setRestaurantData(data);
                        } else {
                            // Use fallback if fetch fails
                            setRestaurantData({
                                id: finalRestaurantId,
                                name:
                                    user?.full_name ||
                                    restaurant?.name ||
                                    "مطعم تجريبي",
                                slug: restaurant?.slug || finalRestaurantId,
                                email:
                                    user?.email ||
                                    restaurant?.email ||
                                    "demo@restaurant.com",
                                phone: restaurant?.phone || null,
                            });
                        }
                    } catch (dbError) {
                        console.error("Database error:", dbError);
                        // Use fallback data
                        setRestaurantData({
                            id: finalRestaurantId,
                            name:
                                user?.full_name ||
                                restaurant?.name ||
                                "مطعم تجريبي",
                            slug: restaurant?.slug || finalRestaurantId,
                            email:
                                user?.email ||
                                restaurant?.email ||
                                "demo@restaurant.com",
                            phone: restaurant?.phone || null,
                        });
                    }
                } else {
                    // Use restaurant prop or user data as fallback
                    setRestaurantData(
                        restaurant || {
                            id: "demo-restaurant",
                            name: user?.full_name || "مطعم تجريبي",
                            slug: "demo-restaurant",
                            email: user?.email || "demo@restaurant.com",
                            phone: null,
                        }
                    );
                }
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
                // Use fallback data
                setRestaurantData(
                    restaurant || {
                        id: "demo-restaurant",
                        name: user?.full_name || "مطعم تجريبي",
                        slug: "demo-restaurant",
                        email: user?.email || "demo@restaurant.com",
                        phone: null,
                    }
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [user, authLoading, restaurant]);

    const generateQRCode = (tableId: string) => {
        const baseUrl = window.location.origin;
        const restaurantIdToUse =
            restaurantData?.id ||
            restaurant?.id ||
            restaurantId ||
            user?.restaurant_id ||
            restaurantData?.slug ||
            restaurant?.slug ||
            "demo-restaurant";
        const menuUrl = `${baseUrl}/menu/${restaurantIdToUse}?table=${tableId}`;
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

    const downloadAllQRCodes = () => {
        if (tables.length === 0) {
            showToast("لا توجد طاولات للتحميل", "warning");
            return;
        }

        tables.forEach((table, index) => {
            setTimeout(() => {
                try {
                    const qrUrl = generateQRCode(table.id);
                    const link = document.createElement("a");
                    link.href = qrUrl;
                    link.download = `table-${table.table_number}-qr.png`;
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (error) {
                    console.error(
                        `Error downloading QR code for table ${table.table_number}:`,
                        error
                    );
                }
            }, index * 200); // Increase delay to avoid browser blocking
        });

        showToast(`جارٍ تحميل ${tables.length} رمز QR...`, "info");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        مولد رموز QR
                    </h2>
                    {tables.length > 0 && (
                        <button
                            onClick={downloadAllQRCodes}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <i className="ri-download-line ml-2"></i>
                            تحميل جميع الرموز
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            معلومات المطعم
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">
                                    اسم المطعم:
                                </span>
                                <span className="mr-2 text-gray-600">
                                    {restaurantData?.name ||
                                        restaurant?.name ||
                                        user?.full_name ||
                                        "مطعم تجريبي"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    الرابط المختصر:
                                </span>
                                <span className="mr-2 text-gray-600">
                                    {restaurantData?.slug ||
                                        restaurant?.slug ||
                                        restaurantId ||
                                        "demo-restaurant"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    البريد الإلكتروني:
                                </span>
                                <span className="mr-2 text-gray-600">
                                    {restaurantData?.email ||
                                        restaurant?.email ||
                                        user?.email ||
                                        "demo@restaurant.com"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    الهاتف:
                                </span>
                                <span className="mr-2 text-gray-600">
                                    {restaurantData?.phone ||
                                        restaurant?.phone ||
                                        "0501234567"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            رموز QR للطاولات
                        </h3>

                        {tables.length === 0 ? (
                            <div className="text-center py-12">
                                <i className="ri-table-line text-6xl text-gray-300 mb-4"></i>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    لا توجد طاولات
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {!restaurantId && !user?.restaurant_id
                                        ? "يرجى ربط حسابك بمطعم أولاً من صفحة الإعدادات"
                                        : "يرجى إضافة طاولات أولاً من صفحة إدارة الطاولات"}
                                </p>
                                {!restaurantId && !user?.restaurant_id && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                                        <p className="text-sm text-yellow-800">
                                            <i className="ri-information-line ml-1"></i>
                                            يجب ربط حسابك بمطعم لعرض رموز QR.
                                            يمكنك إضافة مطعم من صفحة الإعدادات.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {tables.map((table) => (
                                    <div
                                        key={table.id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="text-center">
                                            <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                                                <img
                                                    src={generateQRCode(
                                                        table.id
                                                    )}
                                                    alt={`QR Code for Table ${table.table_number}`}
                                                    className="w-32 h-32 mx-auto"
                                                />
                                                <p className="mt-2 text-sm font-medium text-gray-900">
                                                    طاولة رقم{" "}
                                                    {table.table_number}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        downloadQRCode(
                                                            table.id,
                                                            table.table_number
                                                        )
                                                    }
                                                    className="mt-2 text-xs text-blue-500 hover:text-blue-700"
                                                >
                                                    <i className="ri-download-line ml-1"></i>
                                                    تحميل
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <i className="ri-information-line text-blue-500 text-xl mt-1 ml-3"></i>
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            كيفية استخدام رموز QR:
                                        </h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
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

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <i className="ri-lightbulb-line text-yellow-500 text-xl mt-1 ml-3"></i>
                                    <div>
                                        <h4 className="font-medium text-yellow-900 mb-2">
                                            نصائح للاستخدام الأمثل:
                                        </h4>
                                        <ul className="text-sm text-yellow-800 space-y-1">
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
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        تعليمات الطباعة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                                المواصفات المقترحة:
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• حجم الرمز: 5×5 سم على الأقل</li>
                                <li>• جودة الطباعة: 300 DPI أو أعلى</li>
                                <li>• نوع الورق: ورق مقوى أو لامع</li>
                                <li>• الألوان: أبيض وأسود للوضوح الأمثل</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                                التصميم المقترح:
                            </h4>
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
        </>
    );
};

export default QRCodeGenerator;
