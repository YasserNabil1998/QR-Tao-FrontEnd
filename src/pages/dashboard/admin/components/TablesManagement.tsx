import { useState, useEffect } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useTablesContext } from "../../../../context/TablesContext";
import { useToast } from "../../../../hooks/useToast";
import Loader from "../../../../components/common/Loader";

const TablesManagement = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast, ToastContainer } = useToast();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState<any>(null);
    const [restaurantId] = useState<string | null>(null);

    // Initialize local state for tables (fallback if context not available)
    const [localTables, setLocalTables] = useState<any[]>([
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
    const addTable =
        tablesContext?.addTable ||
        ((table: any) => {
            setLocalTables((prev) => [...prev, table]);
        });
    const updateTable =
        tablesContext?.updateTable ||
        ((id: string, updates: Partial<any>) => {
            setLocalTables((prev) =>
                prev.map((table) =>
                    table.id === id ? { ...table, ...updates } : table
                )
            );
        });
    const deleteTable =
        tablesContext?.deleteTable ||
        ((id: string) => {
            setLocalTables((prev) => prev.filter((table) => table.id !== id));
        });

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 300);
    }, [authLoading]);

    // Generate QR code URL for table
    const generateQRCode = (restaurantId: string, tableId: string) => {
        const menuUrl = `${window.location.origin}/menu/${restaurantId}?table=${tableId}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            menuUrl
        )}`;
    };

    const handleSaveTable = async (tableData: any) => {
        const restaurantIdToUse =
            restaurantId || user?.restaurant_id || "demo-restaurant";

        try {
            if (editingTable) {
                // Update existing table
                const updatedTable = {
                    ...editingTable,
                    ...tableData,
                    qr_code: generateQRCode(restaurantIdToUse, editingTable.id),
                };
                updateTable(editingTable.id, updatedTable);
                showToast("تم تحديث الطاولة بنجاح", "success");
            } else {
                // Add new table
                const newTableId = `table-${Date.now()}`;
                const newTable = {
                    id: newTableId,
                    ...tableData,
                    restaurant_id: restaurantIdToUse,
                    qr_code: generateQRCode(restaurantIdToUse, newTableId),
                };
                addTable(newTable);
                showToast("تم إضافة الطاولة بنجاح", "success");
            }

            setShowModal(false);
            setEditingTable(null);
        } catch (error) {
            console.error("Error saving table:", error);
            showToast(
                "حدث خطأ في حفظ الطاولة. يرجى المحاولة مرة أخرى.",
                "error"
            );
        }
    };

    const handleDeleteTable = async (id: string) => {
        const table = tables.find((t: { id: string }) => t.id === id);
        if (
            window.confirm(
                `هل أنت متأكد من حذف طاولة رقم ${table?.table_number}؟`
            )
        ) {
            try {
                deleteTable(id);
                showToast("تم حذف الطاولة بنجاح", "success");
            } catch (error) {
                console.error("Error deleting table:", error);
                showToast("حدث خطأ في حذف الطاولة", "error");
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800";
            case "occupied":
                return "bg-red-100 text-red-800";
            case "reserved":
                return "bg-yellow-100 text-yellow-800";
            case "cleaning":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "available":
                return "متاحة";
            case "occupied":
                return "مشغولة";
            case "reserved":
                return "محجوزة";
            case "cleaning":
                return "قيد التنظيف";
            default:
                return status;
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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        إدارة الطاولات
                    </h2>
                    <button
                        onClick={() => {
                            setEditingTable(null);
                            setShowModal(true);
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                        <i className="ri-add-line ml-2"></i>
                        إضافة طاولة
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tables.map((table: { id: string; table_number: string; capacity: number; location?: string; status: string; restaurant_id: string; qr_code?: string }) => (
                        <div
                            key={table.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    طاولة {table.table_number}
                                </h3>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        table.status
                                    )}`}
                                >
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
                                        setEditingTable(table);
                                        setShowModal(true);
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
                                    <p className="text-xs text-gray-500">
                                        رمز QR للطاولة
                                    </p>
                                    {table.qr_code && (
                                        <button
                                            onClick={() =>
                                                window.open(
                                                    table.qr_code,
                                                    "_blank"
                                                )
                                            }
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            لا توجد طاولات
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {!restaurantId && !user?.restaurant_id
                                ? "يرجى ربط حسابك بمطعم أولاً من صفحة الإعدادات"
                                : "ابدأ بإضافة طاولات لمطعمك"}
                        </p>
                        {!restaurantId && !user?.restaurant_id && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                                <p className="text-sm text-yellow-800">
                                    <i className="ri-information-line ml-1"></i>
                                    يجب ربط حسابك بمطعم لإضافة الطاولات. يمكنك
                                    إضافة مطعم من صفحة الإعدادات.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Table Modal */}
                {showModal && (
                    <TableModal
                        table={editingTable}
                        onSave={handleSaveTable}
                        onClose={() => {
                            setShowModal(false);
                            setEditingTable(null);
                        }}
                    />
                )}
            </div>
        </>
    );
};

// Table Modal Component
const TableModal = ({ table, onSave, onClose }: any) => {
    const [formData, setFormData] = useState({
        table_number: table?.table_number || "",
        capacity: table?.capacity || 4,
        location: table?.location || "",
        status: table?.status || "available",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {table ? "تعديل الطاولة" : "إضافة طاولة جديدة"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الطاولة
                        </label>
                        <input
                            type="text"
                            value={formData.table_number}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    table_number: e.target.value,
                                })
                            }
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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    capacity: parseInt(e.target.value),
                                })
                            }
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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                })
                            }
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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
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
    );
};

export default TablesManagement;
