import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface Staff {
    id: string;
    full_name: string;
    email: string;
    role: "admin" | "chef" | "cashier" | "waiter";
    phone: string;
    hire_date: string;
    salary: number;
    status: "active" | "inactive";
    shift: "morning" | "evening" | "night";
    avatar?: string;
}

interface StaffManagementProps {
    restaurantId: string;
}

export default function StaffManagement({
    restaurantId: _restaurantId,
}: StaffManagementProps) {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        role: "waiter" as "admin" | "chef" | "cashier" | "waiter",
        salary: 0,
        shift: "morning" as "morning" | "evening" | "night",
        hire_date: new Date().toISOString().split("T")[0],
        status: "active" as "active" | "inactive",
    });
    const { showToast, ToastContainer } = useToast();

    // Mock data for demonstration - fixed to match Staff interface
    const mockStaff: Staff[] = [
        {
            id: "1",
            full_name: "أحمد محمد",
            email: "ahmed@restaurant.com",
            role: "admin",
            phone: "+20123456789",
            hire_date: "2023-01-15",
            salary: 8000,
            status: "active",
            shift: "morning",
        },
        {
            id: "2",
            full_name: "سارة أحمد",
            email: "sara@restaurant.com",
            role: "chef",
            phone: "+20987654321",
            hire_date: "2023-03-20",
            salary: 6000,
            status: "active",
            shift: "evening",
        },
        {
            id: "3",
            full_name: "محمد علي",
            email: "mohamed@restaurant.com",
            role: "waiter",
            phone: "+20555666777",
            hire_date: "2023-06-10",
            salary: 4000,
            status: "active",
            shift: "morning",
        },
        {
            id: "4",
            full_name: "فاطمة حسن",
            email: "fatma@restaurant.com",
            role: "cashier",
            phone: "+20444555666",
            hire_date: "2023-05-01",
            salary: 4500,
            status: "active",
            shift: "evening",
        },
        {
            id: "5",
            full_name: "عمر خالد",
            email: "omar@restaurant.com",
            role: "chef",
            phone: "+20333444555",
            hire_date: "2023-02-10",
            salary: 5500,
            status: "inactive",
            shift: "night",
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setStaff(mockStaff);
            setLoading(false);
        }, 300);
    }, []);

    useEffect(() => {
        if (editingStaff) {
            setFormData({
                full_name: editingStaff.full_name || "",
                email: editingStaff.email || "",
                phone: editingStaff.phone || "",
                role: editingStaff.role || "waiter",
                salary: editingStaff.salary || 0,
                shift: editingStaff.shift || "morning",
                hire_date:
                    editingStaff.hire_date ||
                    new Date().toISOString().split("T")[0],
                status: editingStaff.status || "active",
            });
            setShowAddModal(true);
        } else {
            resetForm();
        }
    }, [editingStaff]);

    const resetForm = () => {
        setFormData({
            full_name: "",
            email: "",
            phone: "",
            role: "waiter",
            salary: 0,
            shift: "morning",
            hire_date: new Date().toISOString().split("T")[0],
            status: "active",
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.full_name.trim()) {
            showToast("يرجى إدخال الاسم الكامل", "error");
            return;
        }
        if (!formData.email.trim()) {
            showToast("يرجى إدخال البريد الإلكتروني", "error");
            return;
        }
        if (!formData.phone.trim()) {
            showToast("يرجى إدخال رقم الهاتف", "error");
            return;
        }
        if (formData.salary <= 0) {
            showToast("يرجى إدخال راتب صحيح", "error");
            return;
        }

        if (editingStaff) {
            // Update existing staff
            setStaff((prev) =>
                prev.map((s) =>
                    s.id === editingStaff.id ? { ...s, ...formData } : s
                )
            );
            showToast("تم تحديث بيانات الموظف بنجاح", "success");
        } else {
            // Add new staff
            const newStaff: Staff = {
                id: `staff-${Date.now()}`,
                ...formData,
            };
            setStaff((prev) => [...prev, newStaff]);
            showToast("تم إضافة الموظف بنجاح", "success");
        }

        setShowAddModal(false);
        setEditingStaff(null);
        resetForm();
    };

    const handleDelete = (member: Staff) => {
        setStaffToDelete(member);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (staffToDelete) {
            setStaff((prev) => prev.filter((s) => s.id !== staffToDelete.id));
            showToast("تم حذف الموظف بنجاح", "success");
            setShowDeleteModal(false);
            setStaffToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setStaffToDelete(null);
    };

    const roles = [
        { value: "all", label: "جميع الأدوار" },
        { value: "admin", label: "مدير" },
        { value: "chef", label: "شيف" },
        { value: "cashier", label: "كاشير" },
        { value: "waiter", label: "نادل" },
    ];

    const _shifts = [
        { value: "morning", label: "صباحي" },
        { value: "evening", label: "مسائي" },
        { value: "night", label: "ليلي" },
    ];

    const filteredStaff = staff.filter((member) => {
        const matchesSearch =
            (member.full_name?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            ) ||
            (member.email?.toLowerCase() || "").includes(
                searchTerm.toLowerCase()
            );
        const matchesRole = filterRole === "all" || member.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleLabel = (role: string) => {
        const roleMap: { [key: string]: string } = {
            admin: "مدير",
            chef: "شيف",
            cashier: "كاشير",
            waiter: "نادل",
        };
        return roleMap[role] || role;
    };

    const getShiftLabel = (shift: string) => {
        const shiftMap: { [key: string]: string } = {
            morning: "صباحي",
            evening: "مسائي",
            night: "ليلي",
        };
        return shiftMap[shift] || shift;
    };

    const getRoleColor = (role: string) => {
        const colorMap: { [key: string]: string } = {
            admin: "bg-purple-100 text-purple-800",
            chef: "bg-red-100 text-red-800",
            cashier: "bg-green-100 text-green-800",
            waiter: "bg-blue-100 text-blue-800",
        };
        return colorMap[role] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    إدارة الموظفين
                </h2>
                <button
                    onClick={() => {
                        setEditingStaff(null);
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                >
                    <i className="ri-user-add-line"></i>
                    <span className="text-sm sm:text-base">إضافة موظف جديد</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="ri-team-line text-blue-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                إجمالي الموظفين
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                                {staff.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="ri-user-line text-green-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                نشط
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                                {
                                    staff.filter((s) => s.status === "active")
                                        .length
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="ri-restaurant-line text-red-600 text-base sm:text-lg"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                الشيفات
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                                {staff.filter((s) => s.role === "chef").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-5 md:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="ri-money-dollar-circle-line text-purple-600"></i>
                            </div>
                        </div>
                        <div className="mr-3 sm:mr-4">
                            <p className="text-xs sm:text-sm font-medium text-gray-600 font-tajawal">
                                إجمالي الرواتب
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-cairo">
                                {staff
                                    .reduce(
                                        (total, member) =>
                                            total + member.salary,
                                        0
                                    )
                                    .toLocaleString()}{" "}
                                $
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            البحث
                        </label>
                        <div className="relative">
                            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث عن موظف..."
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الدور
                        </label>
                        <CustomSelect
                            value={filterRole}
                            onChange={(value) => setFilterRole(value)}
                            options={roles}
                            placeholder="اختر الدور"
                        />
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "14%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الموظف
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الدور
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الهاتف
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الراتب
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الوردية
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStaff.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div className="flex items-center min-w-0">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <span className="text-orange-600 font-semibold text-sm">
                                                        {member.full_name?.charAt(
                                                            0
                                                        ) || "م"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mr-3 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {member.full_name}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                                member.role
                                            )}`}
                                        >
                                            {getRoleLabel(member.role)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900 truncate">
                                            {member.phone}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {member.salary?.toLocaleString() ||
                                                0}{" "}
                                            $
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {getShiftLabel(member.shift)}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        {member.status === "active" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                نشط
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-close-line ml-1"></i>
                                                غير نشط
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() =>
                                                    setEditingStaff(member)
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(member)
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="حذف"
                                            >
                                                <i className="ri-delete-bin-line text-lg"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tablet Table (MD to LG) */}
                <div className="hidden md:block xl:hidden overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموظف</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الراتب</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStaff.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="flex items-center min-w-0">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <span className="text-orange-600 font-semibold text-xs">
                                                        {member.full_name?.charAt(0) || "م"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mr-2 min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">{member.full_name}</div>
                                                <div className="text-xs text-gray-500 truncate">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                                            {getRoleLabel(member.role)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs text-gray-900 truncate">{member.phone}</div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {member.salary?.toLocaleString() || 0} $
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        {member.status === "active" ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                نشط
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-close-line ml-1"></i>
                                                غير نشط
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => setEditingStaff(member)}
                                                className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                                title="تعديل"
                                            >
                                                <i className="ri-edit-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member)}
                                                className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="حذف"
                                            >
                                                <i className="ri-delete-bin-line text-lg"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                    {filteredStaff.map((member) => (
                        <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                                            <span className="text-orange-600 font-semibold text-base">
                                                {member.full_name?.charAt(0) || "م"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mr-3 flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                            {member.full_name}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate font-tajawal">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRoleColor(member.role)}`}>
                                    {getRoleLabel(member.role)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الهاتف:</span>
                                    <span className="text-sm font-medium text-gray-900 mr-2 font-cairo">{member.phone}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الراتب:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{member.salary?.toLocaleString() || 0} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الوردية:</span>
                                    <span className="text-sm text-gray-900 mr-2 font-tajawal">{getShiftLabel(member.shift)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الحالة:</span>
                                    {member.status === "active" ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                                            <i className="ri-check-line ml-1"></i>
                                            نشط
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                                            <i className="ri-close-line ml-1"></i>
                                            غير نشط
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => setEditingStaff(member)}
                                    className="w-8 h-8 flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                    title="تعديل"
                                >
                                    <i className="ri-edit-line text-lg"></i>
                                </button>
                                <button
                                    onClick={() => handleDelete(member)}
                                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="حذف"
                                >
                                    <i className="ri-delete-bin-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredStaff.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-user-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد موظفين</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                {editingStaff
                                    ? "تعديل بيانات الموظف"
                                    : "إضافة موظف جديد"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingStaff(null);
                                    resetForm();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                full_name: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الاسم الكامل"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل البريد الإلكتروني"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل رقم الهاتف"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الدور
                                    </label>
                                    <CustomSelect
                                        value={formData.role}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                role: value as any,
                                            })
                                        }
                                        options={roles.filter(
                                            (r) => r.value !== "all"
                                        )}
                                        placeholder="اختر الدور"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الراتب ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                salary:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الراتب"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الوردية
                                    </label>
                                    <CustomSelect
                                        value={formData.shift}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                shift: value as any,
                                            })
                                        }
                                        options={_shifts}
                                        placeholder="اختر الوردية"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        تاريخ التوظيف
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.hire_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                hire_date: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 font-tajawal">
                                        الحالة
                                    </label>
                                    <CustomSelect
                                        value={formData.status}
                                        onChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                status: value as any,
                                            })
                                        }
                                        options={[
                                            { value: "active", label: "نشط" },
                                            {
                                                value: "inactive",
                                                label: "غير نشط",
                                            },
                                        ]}
                                        placeholder="اختر الحالة"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingStaff(null);
                                        resetForm();
                                    }}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    {editingStaff
                                        ? "حفظ التعديلات"
                                        : "إضافة الموظف"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && staffToDelete && (
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
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-2 font-tajawal">
                            هل أنت متأكد من حذف الموظف{" "}
                            <span className="font-semibold text-gray-900">
                                {staffToDelete.full_name}
                            </span>
                            ؟
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6 font-tajawal">
                            لا يمكن التراجع عن هذه العملية.
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-start gap-2 sm:gap-3 pt-4">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
