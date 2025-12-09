import { useState } from "react";
import MenuItemModal from "./MenuItemModal";

interface MenuItemsProps {
    items: any[];
    onAddToCart: (
        item: any,
        quantity: number,
        specialInstructions?: string
    ) => void;
}

const MenuItems = ({ items, onAddToCart }: MenuItemsProps) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <i className="ri-restaurant-line text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">
                    لا توجد عناصر في هذه الفئة
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                    >
                        <div className="relative">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-t-xl"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center">
                                    <i className="ri-image-line text-4xl text-gray-400"></i>
                                </div>
                            )}

                            {!item.is_available && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        غير متوفر
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900 flex-1">
                                    {item.name}
                                </h3>
                                <p className="text-lg font-bold text-orange-600">
                                    {item.price} $
                                </p>
                            </div>

                            {item.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {item.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                                    <i className="ri-time-line"></i>
                                    <span>
                                        {item.preparation_time || 15} دقيقة
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.is_available) {
                                            onAddToCart(item, 1);
                                        }
                                    }}
                                    disabled={!item.is_available}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                        item.is_available
                                            ? "bg-orange-500 text-white hover:bg-orange-600"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    <i className="ri-add-line ml-1"></i>
                                    إضافة
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedItem && (
                <MenuItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAddToCart={onAddToCart}
                />
            )}
        </>
    );
};

export default MenuItems;
