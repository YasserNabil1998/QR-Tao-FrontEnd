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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<{ id: string; table_number: string } | null>(null);

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

    const handleDeleteClick = (id: string) => {
        const table = tables.find((t: { id: string }) => t.id === id);
        if (table) {
            setTableToDelete({ id, table_number: table.table_number });
            setShowDeleteModal(true);
        }
    };

    const confirmDelete = async () => {
        if (tableToDelete) {
            try {
                deleteTable(tableToDelete.id);
                showToast("تم حذف الطاولة بنجاح", "success");
                setShowDeleteModal(false);
                setTableToDelete(null);
            } catch (error) {
                console.error("Error deleting table:", error);
                showToast("حدث خطأ في حذف الطاولة", "error");
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setTableToDelete(null);
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
            <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                        إدارة الطاولات
                    </h2>
                    <button
                        onClick={() => {
                            setEditingTable(null);
                            setShowModal(true);
                        }}
                        className="w-full sm:w-auto bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <i className="ri-add-line"></i>
                        <span className="text-sm sm:text-base">إضافة طاولة</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {tables.map((table: { id: string; table_number: string; capacity: number; location?: string; status: string; restaurant_id: string; qr_code?: string }) => (
                        <div
                            key={table.id}
                            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 font-cairo">
                                    طاولة {table.table_number}
                                </h3>
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                                        table.status
                                    )}`}
                                >
                                    {getStatusText(table.status)}
                                </span>
                            </div>

                            <div className="space-y-2 mb-3 sm:mb-4">
                                <div className="flex items-center text-xs sm:text-sm text-gray-600 font-tajawal">
                                    <i className="ri-group-line ml-2 text-base"></i>
                                    <span>السعة: {table.capacity} أشخاص</span>
                                </div>
                                {table.location && (
                                    <div className="flex items-start text-xs sm:text-sm text-gray-600 font-tajawal">
                                        <i className="ri-map-pin-line ml-2 mt-0.5 text-base flex-shrink-0"></i>
                                        <span className="line-clamp-2">{table.location}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 mb-3 sm:mb-4">
                                <button
                                    onClick={() => {
                                        setEditingTable(table);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium"
                                >
                                    تعديل
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(table.id)}
                                    className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base flex items-center justify-center"
                                    title="حذف"
                                >
                                    <i className="ri-delete-bin-line"></i>
                                </button>
                            </div>

                            {/* QR Code Preview */}
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    {table.qr_code ? (
                                        <img
                                            src={table.qr_code}
                                            alt="QR Code"
                                            className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2 rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <i className="ri-qr-code-line text-xl sm:text-2xl text-gray-400"></i>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 font-tajawal">
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
                                            className="text-xs text-blue-500 hover:text-blue-700 mt-1 font-medium transition-colors"
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
                    <div className="text-center py-8 sm:py-12 px-4">
                        <i className="ri-table-line text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
                        <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 mb-2 font-cairo">
                            لا توجد طاولات
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-4 font-tajawal">
                            {!restaurantId && !user?.restaurant_id
                                ? "يرجى ربط حسابك بمطعم أولاً من صفحة الإعدادات"
                                : "ابدأ بإضافة طاولات لمطعمك"}
                        </p>
                        {!restaurantId && !user?.restaurant_id && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
                                <p className="text-xs sm:text-sm text-yellow-800 font-tajawal">
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

                {/* Delete Confirmation Modal */}
                {showDeleteModal && tableToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <i className="ri-error-warning-line text-2xl sm:text-3xl text-red-500"></i>
                                </div>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-2 font-cairo">
                                تأكيد الحذف
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6 font-tajawal">
                                هل أنت متأكد من حذف طاولة رقم <span className="font-semibold text-gray-900">{tableToDelete.table_number}</span>؟ لا يمكن التراجع عن هذه العملية.
                            </p>
                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={cancelDelete}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-md shadow-xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 font-cairo">
                        {table ? "تعديل الطاولة" : "إضافة طاولة جديدة"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="مثال: الطابق الأول، بجانب النافذة"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
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
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="available">متاحة</option>
                            <option value="occupied">مشغولة</option>
                            <option value="reserved">محجوزة</option>
                            <option value="cleaning">قيد التنظيف</option>
                        </select>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
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
