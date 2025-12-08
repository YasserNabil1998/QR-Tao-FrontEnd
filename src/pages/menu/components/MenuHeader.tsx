import { useState } from "react";
import { useDirection } from "../../../context/DirectionContext";

interface MenuHeaderProps {
    restaurant: any;
    table: any;
}

const MenuHeader = ({ restaurant, table }: MenuHeaderProps) => {
    const [showInfo, setShowInfo] = useState(false);
    const { direction, toggleDirection } = useDirection();

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {restaurant?.name?.charAt(0) || "R"}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {restaurant?.name}
                            </h1>
                            <p className="text-sm text-gray-600">
                                طاولة رقم {table?.table_number}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                            onClick={toggleDirection}
                            className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-100 border border-gray-200 font-medium"
                            title={
                                direction === "rtl"
                                    ? "Switch to English"
                                    : "التبديل إلى العربية"
                            }
                        >
                            <i className="ri-global-line text-lg"></i>
                            <span className="font-semibold text-sm">
                                {direction === "rtl" ? "ع" : "en"}
                            </span>
                        </button>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <i className="ri-information-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {showInfo && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-900">
                                    العنوان:
                                </p>
                                <p className="text-gray-600">
                                    {restaurant?.address || "غير محدد"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    الهاتف:
                                </p>
                                <p className="text-gray-600">
                                    {restaurant?.phone || "غير محدد"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    ساعات العمل:
                                </p>
                                <p className="text-gray-600">
                                    {restaurant?.opening_hours || "غير محدد"}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    الوصف:
                                </p>
                                <p className="text-gray-600">
                                    {restaurant?.description ||
                                        "مرحباً بكم في مطعمنا"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuHeader;
