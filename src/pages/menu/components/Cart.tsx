interface CartProps {
    cart: any[];
    onUpdateItem: (cartId: number, quantity: number) => void;
    onRemoveItem: (cartId: number) => void;
    onClose: () => void;
    onCheckout: () => void;
    totalAmount: number;
}

const Cart = ({
    cart,
    onUpdateItem,
    onRemoveItem,
    onClose,
    onCheckout,
    totalAmount,
}: CartProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
            <div className="bg-white rounded-t-xl md:rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        سلة الطلبات
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <i className="ri-close-line text-xl text-gray-600"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 max-h-96">
                    {cart.length === 0 ? (
                        <div className="text-center py-8">
                            <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500">السلة فارغة</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.cartId}
                                    className="flex items-center space-x-4 space-x-reverse bg-gray-50 rounded-lg p-3"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {item.name}
                                        </h3>
                                        <span className="text-gray-600">
                                            {item.price} ج.م × {item.quantity}
                                        </span>
                                        <span className="font-semibold">
                                            {item.price * item.quantity} ج.م
                                        </span>
                                        {item.specialInstructions && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                ملاحظة:{" "}
                                                {item.specialInstructions}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <button
                                            onClick={() =>
                                                onUpdateItem(
                                                    item.cartId,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors border"
                                        >
                                            <i className="ri-subtract-line text-sm"></i>
                                        </button>
                                        <span className="text-sm font-medium w-6 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                onUpdateItem(
                                                    item.cartId,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors border"
                                        >
                                            <i className="ri-add-line text-sm"></i>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() =>
                                            onRemoveItem(item.cartId)
                                        }
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <i className="ri-delete-bin-line text-sm"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-medium text-gray-900">
                                المجموع الكلي
                            </span>
                            <span className="text-xl font-bold">
                                {totalAmount} ج.م
                            </span>
                        </div>

                        <button
                            onClick={onCheckout}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
                        >
                            <i className="ri-check-line ml-2"></i>
                            تأكيد الطلب
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
