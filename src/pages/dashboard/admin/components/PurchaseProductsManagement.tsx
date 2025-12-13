import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomSelect from "../../../../components/common/CustomSelect";
import Loader from "../../../../components/common/Loader";

interface PurchaseProduct {
    id: string;
    item_name: string;
    category: string;
    unit: string;
    current_price: number;
    previous_price: number;
    price_change_percentage: number;
    last_purchase_date: string;
    total_purchased_quantity: number;
    average_price: number;
    supplier_name: string;
    price_trend: "up" | "down" | "stable";
    created_at: string;
    updated_at: string;
}

interface PriceHistory {
    id: string;
    product_id: string;
    price: number;
    purchase_date: string;
    supplier_name: string;
    quantity: number;
}

export default function PurchaseProductsManagement() {
    const [products, setProducts] = useState<PurchaseProduct[]>([]);
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
    const [showPriceHistoryModal, setShowPriceHistoryModal] = useState(false);
    const [_selectedProduct, _setSelectedProduct] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const { showToast, ToastContainer } = useToast();

    // بيانات تجريبية للمنتجات
    const mockProducts: PurchaseProduct[] = [
        {
            id: "1",
            item_name: "دجاج طازج",
            category: "لحوم",
            unit: "كيلو",
            current_price: 22,
            previous_price: 18,
            price_change_percentage: 22.22,
            last_purchase_date: "2024-01-15",
            total_purchased_quantity: 150,
            average_price: 20,
            supplier_name: "مزارع الخليج",
            price_trend: "up",
            created_at: "2024-01-01",
            updated_at: "2024-01-15",
        },
        {
            id: "2",
            item_name: "أرز بسمتي",
            category: "حبوب",
            unit: "كيلو",
            current_price: 7,
            previous_price: 8,
            price_change_percentage: -12.5,
            last_purchase_date: "2024-01-14",
            total_purchased_quantity: 200,
            average_price: 7.5,
            supplier_name: "شركة الحبوب المتحدة",
            price_trend: "down",
            created_at: "2024-01-01",
            updated_at: "2024-01-14",
        },
        {
            id: "3",
            item_name: "طماطم",
            category: "خضروات",
            unit: "كيلو",
            current_price: 4,
            previous_price: 4,
            price_change_percentage: 0,
            last_purchase_date: "2024-01-13",
            total_purchased_quantity: 80,
            average_price: 4,
            supplier_name: "مزارع الرياض",
            price_trend: "stable",
            created_at: "2024-01-01",
            updated_at: "2024-01-13",
        },
        {
            id: "4",
            item_name: "زيت زيتون",
            category: "زيوت",
            unit: "لتر",
            current_price: 40,
            previous_price: 35,
            price_change_percentage: 14.29,
            last_purchase_date: "2024-01-12",
            total_purchased_quantity: 25,
            average_price: 37.5,
            supplier_name: "شركة الزيوت الطبيعية",
            price_trend: "up",
            created_at: "2024-01-01",
            updated_at: "2024-01-12",
        },
        {
            id: "5",
            item_name: "بصل",
            category: "خضروات",
            unit: "كيلو",
            current_price: 3,
            previous_price: 3.5,
            price_change_percentage: -14.29,
            last_purchase_date: "2024-01-11",
            total_purchased_quantity: 60,
            average_price: 3.25,
            supplier_name: "مزارع الرياض",
            price_trend: "down",
            created_at: "2024-01-01",
            updated_at: "2024-01-11",
        },
        {
            id: "6",
            item_name: "دقيق",
            category: "حبوب",
            unit: "كيلو",
            current_price: 5,
            previous_price: 4.5,
            price_change_percentage: 11.11,
            last_purchase_date: "2024-01-10",
            total_purchased_quantity: 100,
            average_price: 4.75,
            supplier_name: "شركة الحبوب المتحدة",
            price_trend: "up",
            created_at: "2024-01-01",
            updated_at: "2024-01-10",
        },
    ];

    // بيانات تجريبية لتاريخ الأسعار
    const mockPriceHistory: { [key: string]: PriceHistory[] } = {
        "1": [
            {
                id: "1",
                product_id: "1",
                price: 18,
                purchase_date: "2024-01-01",
                supplier_name: "مزارع الخليج",
                quantity: 50,
            },
            {
                id: "2",
                product_id: "1",
                price: 19,
                purchase_date: "2024-01-05",
                supplier_name: "مزارع الخليج",
                quantity: 40,
            },
            {
                id: "3",
                product_id: "1",
                price: 20,
                purchase_date: "2024-01-10",
                supplier_name: "مزارع الخليج",
                quantity: 35,
            },
            {
                id: "4",
                product_id: "1",
                price: 22,
                purchase_date: "2024-01-15",
                supplier_name: "مزارع الخليج",
                quantity: 25,
            },
        ],
        "2": [
            {
                id: "5",
                product_id: "2",
                price: 8,
                purchase_date: "2024-01-01",
                supplier_name: "شركة الحبوب المتحدة",
                quantity: 100,
            },
            {
                id: "6",
                product_id: "2",
                price: 7.5,
                purchase_date: "2024-01-08",
                supplier_name: "شركة الحبوب المتحدة",
                quantity: 50,
            },
            {
                id: "7",
                product_id: "2",
                price: 7,
                purchase_date: "2024-01-14",
                supplier_name: "شركة الحبوب المتحدة",
                quantity: 50,
            },
        ],
    };

    const fetchProducts = () => {
        setLoading(true);
        // Simulate loading
        setTimeout(() => {
            setProducts(mockProducts);
            setLoading(false);
        }, 300);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchPriceHistory = (productId: string) => {
        const history = mockPriceHistory[productId] || [];
        setPriceHistory(history);
    };

    // دالة لتنسيق التاريخ بالميلادي
    const formatDate = (dateString: string): string => {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getPriceChangeColor = (percentage: number) => {
        if (percentage > 0) return "text-red-600";
        if (percentage < 0) return "text-green-600";
        return "text-gray-600";
    };

    const getPriceChangeIcon = (trend: string) => {
        switch (trend) {
            case "up":
                return "ri-arrow-up-line text-red-500";
            case "down":
                return "ri-arrow-down-line text-green-500";
            case "stable":
                return "ri-subtract-line text-gray-500";
            default:
                return "ri-subtract-line text-gray-500";
        }
    };

    const getTrendBadgeColor = (trend: string) => {
        switch (trend) {
            case "up":
                return "bg-red-100 text-red-800";
            case "down":
                return "bg-green-100 text-green-800";
            case "stable":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case "up":
                return "ارتفاع";
            case "down":
                return "انخفاض";
            case "stable":
                return "ثابت";
            default:
                return "غير محدد";
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.item_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.supplier_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        if (filter === "all") return matchesSearch;
        if (filter === "price_up")
            return matchesSearch && product.price_trend === "up";
        if (filter === "price_down")
            return matchesSearch && product.price_trend === "down";
        if (filter === "price_stable")
            return matchesSearch && product.price_trend === "stable";
        if (filter === "high_change")
            return (
                matchesSearch && Math.abs(product.price_change_percentage) > 10
            );
        return matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.item_name.localeCompare(b.item_name);
            case "price_current":
                return b.current_price - a.current_price;
            case "price_change":
                return (
                    Math.abs(b.price_change_percentage) -
                    Math.abs(a.price_change_percentage)
                );
            case "last_purchase":
                return (
                    new Date(b.last_purchase_date).getTime() -
                    new Date(a.last_purchase_date).getTime()
                );
            case "quantity":
                return b.total_purchased_quantity - a.total_purchased_quantity;
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <Loader size="lg" variant="spinner" text="جاري تحميل البيانات..." />
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-cairo">
                    قائمة منتجات المشتريات
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => {
                            showToast("ميزة تصدير التقرير قيد التطوير", "info");
                        }}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors text-sm sm:text-base"
                    >
                        <i className="ri-download-line"></i>
                        <span>تصدير التقرير</span>
                    </button>
                    <button
                        onClick={() => {
                            fetchProducts();
                            showToast("تم تحديث الأسعار بنجاح", "success");
                        }}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer transition-colors text-sm sm:text-base"
                    >
                        <i className="ri-refresh-line"></i>
                        <span>تحديث الأسعار</span>
                    </button>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <i className="ri-shopping-basket-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                إجمالي المنتجات
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {products.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                            <i className="ri-arrow-up-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                أسعار مرتفعة
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    products.filter(
                                        (p) => p.price_trend === "up"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                            <i className="ri-arrow-down-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                أسعار منخفضة
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    products.filter(
                                        (p) => p.price_trend === "down"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                            <i className="ri-subtract-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                أسعار ثابتة
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    products.filter(
                                        (p) => p.price_trend === "stable"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="p-2.5 sm:p-3 lg:p-3.5 rounded-full bg-yellow-100 text-yellow-600 flex-shrink-0">
                            <i className="ri-alert-line text-lg sm:text-xl lg:text-2xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-600 font-tajawal line-clamp-2 leading-tight">
                                تغيير كبير
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-gray-900 font-cairo mt-1">
                                {
                                    products.filter(
                                        (p) =>
                                            Math.abs(
                                                p.price_change_percentage
                                            ) > 10
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* فلاتر وبحث */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <input
                        type="text"
                        placeholder="البحث في المنتجات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>
                <div className="w-full sm:w-48">
                    <CustomSelect
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: "all", label: "جميع المنتجات" },
                            { value: "price_up", label: "أسعار مرتفعة" },
                            { value: "price_down", label: "أسعار منخفضة" },
                            { value: "price_stable", label: "أسعار ثابتة" },
                            {
                                value: "high_change",
                                label: "تغيير كبير (>10%)",
                            },
                        ]}
                        placeholder="فلترة حسب الاتجاه"
                        className="w-full sm:w-48"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <CustomSelect
                        value={sortBy}
                        onChange={(value) => setSortBy(value)}
                        options={[
                            { value: "name", label: "الاسم" },
                            { value: "price_current", label: "السعر الحالي" },
                            { value: "price_change", label: "نسبة التغيير" },
                            { value: "last_purchase", label: "آخر شراء" },
                            { value: "quantity", label: "الكمية المشتراة" },
                        ]}
                        placeholder="ترتيب حسب"
                        className="w-full sm:w-48"
                    />
                </div>
            </div>

            {/* جدول المنتجات */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col style={{ width: "18%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "12%" }} />
                        </colgroup>
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المنتج
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الفئة
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    السعر الحالي
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    السعر السابق
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التغيير
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الاتجاه
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المتوسط
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الكمية الإجمالية
                                </th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    آخر شراء
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center ml-3 flex-shrink-0">
                                                <i className="ri-shopping-basket-line text-orange-600"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {product.item_name}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {product.supplier_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.current_price} $/
                                            {product.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-600">
                                            {product.previous_price} $/
                                            {product.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div
                                            className={`text-sm font-medium flex items-center ${getPriceChangeColor(
                                                product.price_change_percentage
                                            )}`}
                                        >
                                            <i
                                                className={`${getPriceChangeIcon(
                                                    product.price_trend
                                                )} ml-1`}
                                            ></i>
                                            {product.price_change_percentage > 0
                                                ? "+"
                                                : ""}
                                            {product.price_change_percentage.toFixed(
                                                2
                                            )}
                                            %
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrendBadgeColor(
                                                product.price_trend
                                            )}`}
                                        >
                                            {getTrendText(product.price_trend)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {product.average_price} $/
                                            {product.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {product.total_purchased_quantity}{" "}
                                            {product.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(
                                                product.last_purchase_date
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => {
                                                    _setSelectedProduct(
                                                        product.id
                                                    );
                                                    fetchPriceHistory(
                                                        product.id
                                                    );
                                                    setShowPriceHistoryModal(
                                                        true
                                                    );
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="تاريخ الأسعار"
                                            >
                                                <i className="ri-line-chart-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    showToast(
                                                        "ميزة تحليل السعر قيد التطوير",
                                                        "info"
                                                    );
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                title="تحليل السعر"
                                            >
                                                <i className="ri-bar-chart-line text-lg"></i>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    showToast(
                                                        "ميزة مقارنة الموردين قيد التطوير",
                                                        "info"
                                                    );
                                                }}
                                                className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                title="مقارنة الموردين"
                                            >
                                                <i className="ri-scales-line text-lg"></i>
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
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر الحالي</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التغيير</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاتجاه</th>
                                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-3">
                                        <div className="flex items-center">
                                            <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center ml-2 flex-shrink-0">
                                                <i className="ri-shopping-basket-line text-orange-600 text-xs"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-medium text-gray-900 truncate">{product.item_name}</div>
                                                <div className="text-xs text-gray-500 truncate">{product.supplier_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="text-xs font-medium text-gray-900">
                                            {product.current_price} $/{product.unit}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className={`text-xs font-medium flex items-center ${getPriceChangeColor(product.price_change_percentage)}`}>
                                            <i className={`${getPriceChangeIcon(product.price_trend)} ml-1 text-xs`}></i>
                                            {product.price_change_percentage > 0 ? "+" : ""}
                                            {product.price_change_percentage.toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrendBadgeColor(product.price_trend)}`}>
                                            {getTrendText(product.price_trend)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => {
                                                    _setSelectedProduct(product.id);
                                                    fetchPriceHistory(product.id);
                                                    setShowPriceHistoryModal(true);
                                                }}
                                                className="w-7 h-7 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="تاريخ"
                                            >
                                                <i className="ri-line-chart-line text-base"></i>
                                            </button>
                                            <button
                                                onClick={() => showToast("ميزة تحليل السعر قيد التطوير", "info")}
                                                className="w-7 h-7 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                title="تحليل"
                                            >
                                                <i className="ri-bar-chart-line text-base"></i>
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
                    {sortedProducts.map((product) => (
                        <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center ml-3 flex-shrink-0">
                                        <i className="ri-shopping-basket-line text-orange-600"></i>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate font-cairo">
                                            {product.item_name}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate font-tajawal">
                                            {product.supplier_name}
                                        </p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getTrendBadgeColor(product.price_trend)}`}>
                                    {getTrendText(product.price_trend)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الفئة:</span>
                                    <span className="text-xs font-medium text-gray-900 mr-2 font-cairo inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                        {product.category}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الوحدة:</span>
                                    <span className="text-xs font-medium text-gray-900 mr-2 font-cairo">{product.unit}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">السعر الحالي:</span>
                                    <span className="text-sm font-semibold text-gray-900 mr-2 font-cairo">{product.current_price} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">السعر السابق:</span>
                                    <span className="text-xs text-gray-600 mr-2 font-tajawal">{product.previous_price} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">التغيير:</span>
                                    <span className={`text-xs font-medium mr-2 font-cairo flex items-center ${getPriceChangeColor(product.price_change_percentage)}`}>
                                        <i className={`${getPriceChangeIcon(product.price_trend)} ml-1 text-xs`}></i>
                                        {product.price_change_percentage > 0 ? "+" : ""}
                                        {product.price_change_percentage.toFixed(2)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">المتوسط:</span>
                                    <span className="text-xs font-medium text-gray-900 mr-2 font-cairo">{product.average_price} $</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">الكمية الإجمالية:</span>
                                    <span className="text-xs font-medium text-gray-900 mr-2 font-cairo">{product.total_purchased_quantity} {product.unit}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-600 font-tajawal">آخر شراء:</span>
                                    <span className="text-xs text-gray-900 mr-2 font-tajawal">{formatDate(product.last_purchase_date)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        _setSelectedProduct(product.id);
                                        fetchPriceHistory(product.id);
                                        setShowPriceHistoryModal(true);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="تاريخ الأسعار"
                                >
                                    <i className="ri-line-chart-line text-lg"></i>
                                </button>
                                <button
                                    onClick={() => showToast("ميزة تحليل السعر قيد التطوير", "info")}
                                    className="w-8 h-8 flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                    title="تحليل السعر"
                                >
                                    <i className="ri-bar-chart-line text-lg"></i>
                                </button>
                                <button
                                    onClick={() => showToast("ميزة مقارنة الموردين قيد التطوير", "info")}
                                    className="w-8 h-8 flex items-center justify-center text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                    title="مقارنة الموردين"
                                >
                                    <i className="ri-scales-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                    {sortedProducts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <i className="ri-shopping-basket-line text-4xl mb-2"></i>
                            <p className="font-tajawal">لا توجد منتجات</p>
                        </div>
                    )}
                </div>
            </div>

            {/* مودال تاريخ الأسعار */}
            {showPriceHistoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar-left">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-cairo">
                                تاريخ أسعار المنتج
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPriceHistoryModal(false);
                                    _setSelectedProduct(null);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        {/* رسم بياني بسيط لتطور السعر */}
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm sm:text-base font-medium mb-3 font-cairo">
                                تطور السعر عبر الزمن
                            </h4>
                            <div className="flex items-end justify-between h-24 sm:h-32 space-x-1 sm:space-x-2 space-x-reverse overflow-x-auto">
                                {priceHistory.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="flex flex-col items-center flex-shrink-0"
                                    >
                                        <div
                                            className="bg-orange-500 rounded-t"
                                            style={{
                                                height: `${
                                                    (entry.price /
                                                        Math.max(
                                                            ...priceHistory.map(
                                                                (h) => h.price
                                                            )
                                                        )) *
                                                    100
                                                }px`,
                                                width: "20px",
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-top-right whitespace-nowrap">
                                            {formatDate(entry.purchase_date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* جدول تاريخ الأسعار */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            تاريخ الشراء
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            السعر
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الكمية
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            المورد
                                        </th>
                                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            التغيير
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {priceHistory.map((entry, index) => {
                                        const previousPrice =
                                            index > 0
                                                ? priceHistory[index - 1].price
                                                : entry.price;
                                        const priceChange =
                                            ((entry.price - previousPrice) /
                                                previousPrice) *
                                            100;

                                        return (
                                            <tr
                                                key={entry.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm text-gray-900">
                                                        {formatDate(
                                                            entry.purchase_date
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                        {entry.price} $
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm text-gray-900">
                                                        {entry.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm text-gray-900 truncate">
                                                        {entry.supplier_name}
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    {index === 0 ? (
                                                        <span className="text-xs sm:text-sm text-gray-500">
                                                            -
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={`text-xs sm:text-sm font-medium ${getPriceChangeColor(
                                                                priceChange
                                                            )}`}
                                                        >
                                                            {priceChange > 0
                                                                ? "+"
                                                                : ""}
                                                            {priceChange.toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
