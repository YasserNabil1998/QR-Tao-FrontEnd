import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import ChefSidebar from "./components/ChefSidebar";
import KitchenOrders from "./components/KitchenOrders";
import OrderQueue from "./components/OrderQueue";
import MenuItems from "./components/MenuItems";
import Loader from "../../../components/common/Loader";

export default function ChefDashboard() {
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
            <ChefSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-content">
                <div className="dashboard-main">
                    <div className="dashboard-wrapper">
                        {activeTab === "orders" && <KitchenOrders />}
                        {activeTab === "queue" && (
                            <OrderQueue restaurantId={restaurantId} />
                        )}
                        {activeTab === "menu" && (
                            <MenuItems restaurantId={restaurantId} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
