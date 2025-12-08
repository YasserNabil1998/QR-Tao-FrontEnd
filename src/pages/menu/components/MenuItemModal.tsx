import { useState } from "react";

interface MenuItemModalProps {
    item: any;
    onClose: () => void;
    onAddToCart: (
        item: any,
        quantity: number,
        specialInstructions?: string
    ) => void;
}

const MenuItemModal = ({ item, onClose, onAddToCart }: MenuItemModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [specialInstructions, setSpecialInstructions] = useState("");

    const handleAddToCart = () => {
        onAddToCart(item, quantity, specialInstructions);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-64 object-cover rounded-t-xl"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-t-xl flex items-center justify-center">
                            <i className="ri-image-line text-6xl text-gray-400"></i>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    >
                        <i className="ri-close-line text-xl text-gray-700"></i>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex-1">
                            {item.name}
                        </h2>
                        <span className="text-orange-500 font-bold text-2xl mr-4">
                            {item.price.toFixed(2)} $
                        </span>
                    </div>

                    {item.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            {item.description}
                        </p>
                    )}

                    <div className="flex items-center space-x-4 space-x-reverse mb-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <i className="ri-time-line"></i>
                            <span>{item.preparation_time || 15} دقيقة</span>
                        </div>
                        {item.calories && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <i className="ri-fire-line"></i>
                                <span>{item.calories} سعرة</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ملاحظات خاصة (اختياري)
                        </label>
                        <textarea
                            value={specialInstructions}
                            onChange={(e) =>
                                setSpecialInstructions(e.target.value)
                            }
                            placeholder="أي طلبات خاصة أو تعديلات..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {specialInstructions.length}/500 حرف
                        </p>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <span className="text-lg font-medium text-gray-900">
                            الكمية
                        </span>
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <button
                                onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <i className="ri-subtract-line text-lg"></i>
                            </button>
                            <span className="text-xl font-bold text-gray-900 w-8 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <i className="ri-add-line text-lg"></i>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                        <span className="text-lg font-medium text-gray-900">
                            المجموع
                        </span>
                        <span className="text-2xl font-bold text-orange-500">
                            {(item.price * quantity).toFixed(2)} $
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!item.is_available}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors whitespace-nowrap ${
                            item.is_available
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {item.is_available ? (
                            <>
                                <i className="ri-shopping-cart-line ml-2"></i>
                                إضافة إلى السلة
                            </>
                        ) : (
                            "غير متوفر"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemModal;
