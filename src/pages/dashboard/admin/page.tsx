import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import AdminSidebar from "./components/AdminSidebar";
import DashboardStats from "./components/DashboardStats";
import MenuManagement from "./components/MenuManagement";
import TablesManagement from "./components/TablesManagement";
import StaffManagement from "./components/StaffManagement";
import InventoryManagement from "./components/InventoryManagement";
import SuppliersManagement from "./components/SuppliersManagement";
import PurchaseManagement from "./components/PurchaseManagement";
import PurchaseProductsManagement from "./components/PurchaseProductsManagement";
import InvoicesManagement from "./components/InvoicesManagement";
import GeneralLedger from "./components/GeneralLedger";
import PaymentMethods from "./components/PaymentMethods";
import DeliveryOrders from "./components/DeliveryOrders";
import QRCodeGenerator from "./components/QRCodeGenerator";
import RestaurantSettings from "./components/RestaurantSettings";
import AdvancedAnalytics from "./components/AdvancedAnalytics";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { user, loading } = useAuth();
    const restaurantId = user?.restaurant_id || "";

    // Show loading state only while checking auth
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "1.5rem",
                    color: "#4F46E5",
                }}
            >
                Loading...
            </div>
        );
    }

    // Allow access even without login for demo purposes
    return (
        <div className="dashboard-container">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-content">
                <div className="dashboard-main">
                    <div className="dashboard-wrapper">
                        {activeTab === "dashboard" && <DashboardStats />}
                        {activeTab === "menu" && <MenuManagement />}
                        {activeTab === "orders" && <DeliveryOrders />}
                        {activeTab === "tables" && <TablesManagement />}
                        {activeTab === "staff" && (
                            <StaffManagement restaurantId={restaurantId} />
                        )}
                        {activeTab === "inventory" && (
                            <InventoryManagement restaurantId={restaurantId} />
                        )}
                        {activeTab === "suppliers" && <SuppliersManagement />}
                        {activeTab === "purchases" && <PurchaseManagement />}
                        {activeTab === "purchase-products" && (
                            <PurchaseProductsManagement />
                        )}
                        {activeTab === "invoices" && <InvoicesManagement />}
                        {activeTab === "payments" && <PaymentMethods />}
                        {activeTab === "ledger" && <GeneralLedger />}
                        {activeTab === "analytics" && (
                            <AdvancedAnalytics restaurantId={restaurantId} />
                        )}
                        {activeTab === "qr-codes" && (
                            <QRCodeGenerator restaurant={user || {}} />
                        )}
                        {activeTab === "settings" && (
                            <RestaurantSettings
                                restaurant={user || {}}
                                onUpdate={() => {}}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
