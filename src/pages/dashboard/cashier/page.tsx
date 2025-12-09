import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import CashierSidebar from "./components/CashierSidebar";
import OrdersList from "./components/OrdersList";
import PaymentManagement from "./components/PaymentManagement";
import DailyReport from "./components/DailyReport";
import Loader from "../../../components/common/Loader";

export default function CashierDashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const { user, loading } = useAuth();
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
            <CashierSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-content">
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
