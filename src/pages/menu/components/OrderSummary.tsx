import { useState } from "react";
import { supabase } from "../../../lib/supabase";

interface OrderSummaryProps {
    restaurant: any;
    table: any;
    cart: any[];
    totalAmount: number;
    onClose: () => void;
    onOrderComplete: () => void;
}

const OrderSummary = ({
    restaurant,
    table,
    cart,
    totalAmount,
    onClose,
    onOrderComplete,
}: OrderSummaryProps) => {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate totals
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;

    const handleSubmitOrder = async () => {
        if (!customerName.trim()) {
            alert("يرجى إدخال اسم العميل");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order
            const { data: _orderData, error: orderError } = await supabase
                .from("orders")
                .insert({
                    restaurant_id: restaurant.id,
                    table_id: table.id,
                    customer_name: customerName.trim(),
                    customer_phone: customerPhone.trim() || null,
                    items: cart.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        special_instructions: item.specialInstructions || null,
                    })),
                    total_amount: totalAmount,
                    notes: orderNotes.trim() || null,
                    status: "pending",
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Update table status
            await supabase
                .from("tables")
                .update({ status: "occupied" })
                .eq("id", table.id);

            alert("تم إرسال الطلب بنجاح!");
            onOrderComplete();
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        تأكيد الطلب
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <i className="ri-close-line text-xl text-gray-600"></i>
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">
                            تفاصيل المطعم
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium">{restaurant.name}</p>
                            <p className="text-sm text-gray-600">
                                طاولة رقم {table.table_number}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-3">
                            عناصر الطلب
                        </h3>
                        <div className="space-y-2">
                            {cart.map((item) => (
                                <div
                                    key={item.cartId}
                                    className="flex justify-between items-center py-2 border-b border-gray-100"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            {item.name}
                                        </p>
                                        <span className="text-gray-600">
                                            {item.price} ج.م × {item.quantity}
                                        </span>
                                        {item.specialInstructions && (
                                            <p className="text-xs text-orange-600 mt-1">
                                                ملاحظة:{" "}
                                                {item.specialInstructions}
                                            </p>
                                        )}
                                    </div>
                                    <span className="font-semibold">
                                        {item.price * item.quantity} ج.م
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col pt-3 border-t-2 border-gray-200 space-y-2">
                            <span className="text-lg font-semibold">
                                {subtotal} ج.م
                            </span>
                            <span className="text-lg font-semibold">
                                {tax} ج.م
                            </span>
                            <span className="text-xl font-bold text-orange-600">
                                {total} ج.م
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسم العميل *
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                placeholder="أدخل اسمك"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رقم الهاتف (اختياري)
                            </label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) =>
                                    setCustomerPhone(e.target.value)
                                }
                                placeholder="05xxxxxxxx"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ملاحظات إضافية (اختياري)
                            </label>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                placeholder="أي ملاحظات أو طلبات خاصة..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={3}
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting || !customerName.trim()}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-colors whitespace-nowrap ${
                            isSubmitting || !customerName.trim()
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="ri-loader-4-line animate-spin ml-2"></i>
                                جاري الإرسال...
                            </>
                        ) : (
                            <>
                                <i className="ri-send-plane-line ml-2"></i>
                                إرسال الطلب
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
