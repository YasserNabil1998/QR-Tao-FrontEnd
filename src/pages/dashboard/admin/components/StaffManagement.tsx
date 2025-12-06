import { useState, useEffect } from "react";

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
        }, 1000);
    }, []);

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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                    إدارة الموظفين
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                    <i className="ri-user-add-line ml-2"></i>
                    إضافة موظف جديد
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="ri-team-line text-blue-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الموظفين
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {staff.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="ri-user-line text-green-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                نشط
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {
                                    staff.filter((s) => s.status === "active")
                                        .length
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="ri-restaurant-line text-red-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                الشيفات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {staff.filter((s) => s.role === "chef").length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="ri-money-dollar-circle-line text-purple-600"></i>
                            </div>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الرواتب
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {staff
                                    .reduce(
                                        (total, member) =>
                                            total + member.salary,
                                        0
                                    )
                                    .toLocaleString()}{" "}
                                ج.م
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
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الموظف
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الدور
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الهاتف
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الراتب
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الوردية
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
                            {filteredStaff.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <span className="text-orange-600 font-semibold">
                                                        {member.full_name?.charAt(
                                                            0
                                                        ) || "م"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mr-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {member.full_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                                member.role
                                            )}`}
                                        >
                                            {getRoleLabel(member.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {member.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {member.salary?.toLocaleString() ||
                                                0}{" "}
                                            ج.م
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {getShiftLabel(member.shift)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {member.status === "active" ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <i className="ri-check-line ml-1"></i>
                                                نشط
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <i className="ri-close-line ml-1"></i>
                                                غير نشط
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <button
                                                onClick={() =>
                                                    setEditingStaff(member)
                                                }
                                                className="text-orange-600 hover:text-orange-900 cursor-pointer"
                                            >
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 cursor-pointer">
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                إضافة موظف جديد
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الاسم الكامل
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الاسم الكامل"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل البريد الإلكتروني"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الهاتف
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل رقم الهاتف"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الدور
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-8">
                                        <option>اختر الدور</option>
                                        <option value="admin">مدير</option>
                                        <option value="chef">شيف</option>
                                        <option value="cashier">كاشير</option>
                                        <option value="waiter">نادل</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الراتب (ج.م)
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="أدخل الراتب"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الوردية
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-8">
                                        <option>اختر الوردية</option>
                                        <option value="morning">صباحي</option>
                                        <option value="evening">مسائي</option>
                                        <option value="night">ليلي</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تاريخ التوظيف
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    إضافة الموظف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
