import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDirection } from "../../../context/DirectionContext";
import CashierSidebar from "./components/CashierSidebar";
import OrdersList from "./components/OrdersList";
import PaymentManagement from "./components/PaymentManagement";
import DailyReport from "./components/DailyReport";
import Loader from "../../../components/common/Loader";

export default function CashierDashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth();
    const { direction } = useDirection();
    const restaurantId = user?.restaurant_id || "";

    if (loading) {
        return (
            <Loader
                fullScreen
                size="xl"
                variant="spinner"
                text="جاري التحميل..."
            />
        );
    }

    return (
        <div className="dashboard-container">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <CashierSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="dashboard-content">
                {/* Mobile Header */}
                <div className={`lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center ${direction === 'rtl' ? 'justify-between' : 'flex-row-reverse justify-between'}`}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <i className={`ri-${sidebarOpen ? 'close' : 'menu'}-line text-2xl`}></i>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 font-cairo">لوحة الكاشير</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <div className="dashboard-main">
                    <div className="dashboard-wrapper">
                        {activeTab === "orders" && <OrdersList />}
                        {activeTab === "payments" && (
                            <PaymentManagement restaurantId={restaurantId} />
                        )}
                        {activeTab === "reports" && (
                            <DailyReport restaurantId={restaurantId} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
