'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const applyCoupon = () => {
    // Mock coupon logic
    if (coupon === 'CHOCO10') {
      setCouponDiscount(10);
    } else if (coupon === 'CHOCO20') {
      setCouponDiscount(20);
    } else {
      setCouponDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * (couponDiscount / 100);
  const giftWrapCost = giftWrap ? 5.99 : 0;
  const total = subtotal - discount + giftWrapCost + 4.99; // 4.99 shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-chocolate-dark mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Browse our collection and find your perfect chocolates</p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-chocolate-gold text-chocolate-dark font-medium rounded-md hover:bg-chocolate-dark/80 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-chocolate-dark mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
                <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-chocolate-dark">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 border border-gray-300 rounded-l hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                      className="w-16 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 border border-gray-300 rounded-r hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-lg font-medium text-chocolate-dark">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="mt-2 text-red-500 hover:text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-chocolate-dark mb-4">Order Summary</h2>
            
            {/* Coupon */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <div className="flex">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-chocolate-gold focus:border-chocolate-gold"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-chocolate-dark text-white rounded-r hover:bg-chocolate-dark/90"
                >
                  Apply
                </button>
              </div>
              {couponDiscount > 0 && (
                <p className="mt-1 text-green-600 text-sm">{couponDiscount}% discount applied</p>
              )}
            </div>

            {/* Gift Wrap */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={() => setGiftWrap(!giftWrap)}
                  className="rounded border-gray-300 text-chocolate-gold focus:ring-chocolate-gold"
                />
                <span className="text-sm text-gray-700">Gift Wrap (+$5.99)</span>
              </label>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-chocolate-dark">${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponDiscount}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-chocolate-dark">$4.99</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Gift Wrap</span>
                  <span className="text-chocolate-dark">$5.99</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
                <span className="text-chocolate-dark">Total</span>
                <span className="text-chocolate-dark">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-chocolate-gold text-chocolate-dark font-medium rounded-md hover:bg-chocolate-dark/80 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}