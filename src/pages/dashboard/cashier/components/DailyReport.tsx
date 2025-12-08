import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import CustomDatePicker from "../../../../components/common/CustomDatePicker";
import { formatCurrency } from "../../../../utils/currency";

interface DailyReportProps {
    restaurantId: string;
}

interface DailyReportData {
    date: string;
    total_sales: number;
    total_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    pending_orders: number;
    cash_payments: number;
    card_payments: number;
    digital_payments: number;
    discounts_given: number;
    taxes_collected: number;
    opening_balance: number;
    closing_balance: number;
    average_order_value: number;
    hourly_sales: { hour: string; sales: number; orders: number }[];
    top_items: { name: string; quantity: number; revenue: number }[];
    payment_methods_breakdown: {
        method: string;
        amount: number;
        count: number;
        percentage: number;
    }[];
}

// بيانات محاكاة شاملة
const generateMockReport = (date: string): DailyReportData => {
    const baseDate = new Date(date);
    const dayOfWeek = baseDate.getDay();

    // بيانات متغيرة حسب اليوم
    const dayMultiplier = dayOfWeek === 5 || dayOfWeek === 6 ? 1.5 : 1; // عطلة نهاية الأسبوع

    const totalOrders = Math.floor(35 + Math.random() * 20) * dayMultiplier;
    const completedOrders = Math.floor(totalOrders * 0.85);
    const cancelledOrders = Math.floor(totalOrders * 0.08);
    const pendingOrders = totalOrders - completedOrders - cancelledOrders;

    const totalSales = Math.floor(1800 + Math.random() * 800) * dayMultiplier;
    const cashPayments = Math.floor(totalSales * 0.5);
    const cardPayments = Math.floor(totalSales * 0.35);
    const digitalPayments = totalSales - cashPayments - cardPayments;
    const discountsGiven = Math.floor(totalSales * 0.05);
    const taxesCollected = Math.floor(totalSales * 0.15);
    const openingBalance = 500;
    const closingBalance = openingBalance + totalSales - discountsGiven;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // بيانات المبيعات بالساعة
    const hourlySales: { hour: string; sales: number; orders: number }[] = [];
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

    hours.forEach((hour) => {
        const isPeakHour =
            (hour >= 12 && hour <= 15) || (hour >= 19 && hour <= 21);
        const hourMultiplier = isPeakHour ? 1.8 : 0.6;
        const hourSales = Math.floor(
            (totalSales / hours.length) * hourMultiplier
        );
        const hourOrders = Math.floor(
            (totalOrders / hours.length) * hourMultiplier
        );

        hourlySales.push({
            hour: `${String(hour).padStart(2, "0")}:00`,
            sales: hourSales,
            orders: hourOrders,
        });
    });

    // أعلى الأصناف مبيعًا
    const topItems = [
        {
            name: "برجر كلاسيك",
            quantity: Math.floor(8 + Math.random() * 8),
            revenue: 0,
        },
        {
            name: "بيتزا مارجريتا",
            quantity: Math.floor(6 + Math.random() * 6),
            revenue: 0,
        },
        {
            name: "سلطة سيزر",
            quantity: Math.floor(5 + Math.random() * 8),
            revenue: 0,
        },
        {
            name: "دجاج مشوي",
            quantity: Math.floor(4 + Math.random() * 6),
            revenue: 0,
        },
        {
            name: "معكرونة بالبشاميل",
            quantity: Math.floor(3 + Math.random() * 5),
            revenue: 0,
        },
    ]
        .map((item) => ({
            ...item,
            revenue: item.quantity * (25 + Math.random() * 15),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // تفصيل طرق الدفع
    const paymentMethodsBreakdown = [
        {
            method: "نقدي",
            amount: cashPayments,
            count: Math.floor(completedOrders * 0.5),
            percentage: (cashPayments / totalSales) * 100,
        },
        {
            method: "بطاقة ائتمان",
            amount: cardPayments,
            count: Math.floor(completedOrders * 0.35),
            percentage: (cardPayments / totalSales) * 100,
        },
        {
            method: "دفع إلكتروني",
            amount: digitalPayments,
            count: Math.floor(completedOrders * 0.15),
            percentage: (digitalPayments / totalSales) * 100,
        },
    ];

    return {
        date,
        total_sales: totalSales,
        total_orders: totalOrders,
        completed_orders: completedOrders,
        cancelled_orders: cancelledOrders,
        pending_orders: pendingOrders,
        cash_payments: cashPayments,
        card_payments: cardPayments,
        digital_payments: digitalPayments,
        discounts_given: discountsGiven,
        taxes_collected: taxesCollected,
        opening_balance: openingBalance,
        closing_balance: closingBalance,
        average_order_value: averageOrderValue,
        hourly_sales: hourlySales,
        top_items: topItems,
        payment_methods_breakdown: paymentMethodsBreakdown,
    };
};

const DailyReport = ({ restaurantId }: DailyReportProps) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(today.getDate()).padStart(2, "0")}`;
    });
    const [reportData, setReportData] = useState<DailyReportData | null>(null);

    useEffect(() => {
        fetchDailyReport();
    }, [selectedDate]);

    const fetchDailyReport = async () => {
        try {
            setLoading(true);
            // محاكاة التأخير
            await new Promise((resolve) => setTimeout(resolve, 500));

            const report = generateMockReport(selectedDate);
            setReportData(report);
        } catch (error) {
            console.error("خطأ في جلب التقرير اليومي:", error);
            showToast("حدث خطأ في جلب التقرير", "error");
        } finally {
            setLoading(false);
        }
    };

    // تنسيق التاريخ الميلادي
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "long",
        });
    };

    // تصدير التقرير إلى CSV
    const handleExportToCSV = () => {
        if (!reportData) return;

        const csvRows = [
            ["التقرير اليومي", reportData.date],
            [],
            ["إجمالي المبيعات", `${reportData.total_sales.toFixed(2)} $`],
            ["إجمالي الطلبات", reportData.total_orders.toString()],
            ["الطلبات المكتملة", reportData.completed_orders.toString()],
            ["الطلبات الملغاة", reportData.cancelled_orders.toString()],
            ["الطلبات المعلقة", reportData.pending_orders.toString()],
            [],
            ["المدفوعات النقدية", `${reportData.cash_payments.toFixed(2)} $`],
            ["المدفوعات بالبطاقة", `${reportData.card_payments.toFixed(2)} $`],
            [
                "المدفوعات الإلكترونية",
                `${reportData.digital_payments.toFixed(2)} $`,
            ],
            [],
            ["الخصومات", `${reportData.discounts_given.toFixed(2)} $`],
            ["الضرائب", `${reportData.taxes_collected.toFixed(2)} $`],
            ["الرصيد الافتتاحي", `${reportData.opening_balance.toFixed(2)} $`],
            ["الرصيد الختامي", `${reportData.closing_balance.toFixed(2)} $`],
            [],
            ["المبيعات بالساعة"],
            ["الساعة", "المبيعات", "عدد الطلبات"],
            ...reportData.hourly_sales.map((h) => [
                h.hour,
                `${h.sales.toFixed(2)} $`,
                h.orders.toString(),
            ]),
            [],
            ["أعلى الأصناف مبيعًا"],
            ["اسم الصنف", "الكمية", "الإيرادات"],
            ...reportData.top_items.map((item) => [
                item.name,
                item.quantity.toString(),
                `${item.revenue.toFixed(2)} $`,
            ]),
        ];

        const csvContent = csvRows.map((row) => row.join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `التقرير_اليومي_${selectedDate}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("تم تصدير التقرير بنجاح", "success");
    };

    // تحديث التقرير
    const handleRefresh = () => {
        fetchDailyReport();
    };

    // طباعة التقرير
    const handlePrintReport = () => {
        if (!reportData) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>التقرير اليومي - ${reportData.date}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    .header p {
                        font-size: 14px;
                        color: #666;
                    }
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: avoid;
                    }
                    .section h2 {
                        font-size: 18px;
                        margin-bottom: 15px;
                        color: #333;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 5px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                        margin-bottom: 20px;
                    }
                    .summary-item {
                        padding: 10px;
                        background: #f9f9f9;
                        border-radius: 5px;
                    }
                    .summary-item strong {
                        display: block;
                        margin-bottom: 5px;
                        color: #666;
                        font-size: 12px;
                    }
                    .summary-item span {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table th,
                    table td {
                        padding: 10px;
                        text-align: right;
                        border: 1px solid #ddd;
                    }
                    table th {
                        background: #f5f5f5;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #333;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>التقرير اليومي</h1>
                    <p>${formatDate(reportData.date)}</p>
                </div>

                <div class="section">
                    <h2>ملخص المبيعات</h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <strong>إجمالي المبيعات</strong>
                            <span>${reportData.total_sales.toFixed(2)} $</span>
                        </div>
                        <div class="summary-item">
                            <strong>إجمالي الطلبات</strong>
                            <span>${reportData.total_orders}</span>
                        </div>
                        <div class="summary-item">
                            <strong>الطلبات المكتملة</strong>
                            <span>${reportData.completed_orders}</span>
                        </div>
                        <div class="summary-item">
                            <strong>متوسط قيمة الطلب</strong>
                            <span>${reportData.average_order_value.toFixed(
                                2
                            )} $</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>طرق الدفع</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>طريقة الدفع</th>
                                <th>المبلغ</th>
                                <th>عدد العمليات</th>
                                <th>النسبة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.payment_methods_breakdown
                                .map(
                                    (method) => `
                                <tr>
                                    <td>${method.method}</td>
                                    <td>${method.amount.toFixed(2)} $</td>
                                    <td>${method.count}</td>
                                    <td>${method.percentage.toFixed(1)}%</td>
                                </tr>
                            `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>المبيعات بالساعة</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>الساعة</th>
                                <th>المبيعات</th>
                                <th>عدد الطلبات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.hourly_sales
                                .map(
                                    (hour) => `
                                <tr>
                                    <td>${hour.hour}</td>
                                    <td>${hour.sales.toFixed(2)} $</td>
                                    <td>${hour.orders}</td>
                                </tr>
                            `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>أعلى الأصناف مبيعًا</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>اسم الصنف</th>
                                <th>الكمية</th>
                                <th>الإيرادات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.top_items
                                .map(
                                    (item) => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.revenue.toFixed(2)} $</td>
                                </tr>
                            `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    <p>تم إنشاء التقرير في ${new Date().toLocaleString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    if (loading && !reportData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">لا توجد بيانات للعرض</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            التقرير اليومي
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {formatDate(selectedDate)}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="w-64"
                        />
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            title="تحديث"
                        >
                            <i className="ri-refresh-line text-lg"></i>
                        </button>
                        <button
                            onClick={handleExportToCSV}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <i className="ri-download-line"></i>
                            <span>تصدير</span>
                        </button>
                        <button
                            onClick={handlePrintReport}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <i className="ri-printer-line"></i>
                            <span>طباعة</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي المبيعات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportData.total_sales.toFixed(2)} $
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <i className="ri-shopping-cart-line text-2xl text-purple-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                إجمالي الطلبات
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportData.total_orders}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                مكتملة
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportData.completed_orders}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100">
                            <i className="ri-money-dollar-circle-line text-2xl text-orange-600"></i>
                        </div>
                        <div className="mr-4">
                            <p className="text-sm font-medium text-gray-600">
                                متوسط قيمة الطلب
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportData.average_order_value.toFixed(2)} $
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cash Payments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">
                                    النقدية
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {reportData.cash_payments.toFixed(2)} $
                                </p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">
                                {reportData.payment_methods_breakdown.find(
                                    (m) => m.method === "نقدي"
                                )?.count || 0}{" "}
                                عملية
                            </p>
                            <p className="text-xs font-medium text-green-600">
                                {reportData.payment_methods_breakdown
                                    .find((m) => m.method === "نقدي")
                                    ?.percentage.toFixed(1) || 0}
                                %
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Payments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <i className="ri-bank-card-line text-2xl text-blue-600"></i>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">
                                    بطاقات
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {reportData.card_payments.toFixed(2)} $
                                </p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">
                                {reportData.payment_methods_breakdown.find(
                                    (m) => m.method === "بطاقة ائتمان"
                                )?.count || 0}{" "}
                                عملية
                            </p>
                            <p className="text-xs font-medium text-blue-600">
                                {reportData.payment_methods_breakdown
                                    .find((m) => m.method === "بطاقة ائتمان")
                                    ?.percentage.toFixed(1) || 0}
                                %
                            </p>
                        </div>
                    </div>
                </div>

                {/* Digital Payments */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100">
                                <i className="ri-smartphone-line text-2xl text-orange-600"></i>
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">
                                    دفع إلكتروني
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {reportData.digital_payments.toFixed(2)} $
                                </p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">
                                {reportData.payment_methods_breakdown.find(
                                    (m) => m.method === "دفع إلكتروني"
                                )?.count || 0}{" "}
                                عملية
                            </p>
                            <p className="text-xs font-medium text-orange-600">
                                {reportData.payment_methods_breakdown
                                    .find((m) => m.method === "دفع إلكتروني")
                                    ?.percentage.toFixed(1) || 0}
                                %
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Status & Sales Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        حالة الطلبات
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">مكتملة</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reportData.total_orders > 0
                                                    ? (reportData.completed_orders /
                                                          reportData.total_orders) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">
                                    {reportData.completed_orders}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">معلقة</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reportData.total_orders > 0
                                                    ? (reportData.pending_orders /
                                                          reportData.total_orders) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">
                                    {reportData.pending_orders}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">ملغية</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 ml-3">
                                    <div
                                        className="bg-red-500 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reportData.total_orders > 0
                                                    ? (reportData.cancelled_orders /
                                                          reportData.total_orders) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium">
                                    {reportData.cancelled_orders}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ملخص المبيعات
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                الرصيد الافتتاحي:
                            </span>
                            <span className="font-medium">
                                {reportData.opening_balance.toFixed(2)} $
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                إجمالي المبيعات:
                            </span>
                            <span className="font-medium">
                                {reportData.total_sales.toFixed(2)} $
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الخصومات:</span>
                            <span className="text-red-600 font-medium">
                                -{reportData.discounts_given.toFixed(2)} $
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">الضرائب:</span>
                            <span className="font-medium">
                                {reportData.taxes_collected.toFixed(2)} $
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                            <span>الرصيد الختامي:</span>
                            <span className="text-green-600">
                                {reportData.closing_balance.toFixed(2)} $
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hourly Sales */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    المبيعات بالساعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {reportData.hourly_sales.map((hour) => (
                        <div
                            key={hour.hour}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-gray-900 mb-1">
                                    {hour.hour}
                                </span>
                                <span className="text-sm font-semibold text-blue-600 mb-1">
                                    {hour.sales.toFixed(2)} $
                                </span>
                                <span className="text-xs text-gray-500">
                                    {hour.orders} طلب
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    أعلى الأصناف مبيعًا
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الترتيب
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    اسم الصنف
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الكمية
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإيرادات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.top_items.map((item, index) => (
                                <tr
                                    key={item.name}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {item.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.revenue.toFixed(2)} $
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailyReport;
