'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

export default function ActionButtons() {
  const router = useRouter();

  const handleOrderPickup = () => {
    alert('Order Pickup initiated!'); // Replace with your order logic
  };

  const handleViewCart = () => {
    router.push('/orders/mycart'); // Navigate to your cart page
  };

  return (
    <div className='fixed bottom-16 w-full  flex gap-3 justify-center items-center p-2 rounded-2xl'>  
      {/* View Cart Button */}
      <button
        onClick={handleViewCart}
        className="flex w-[50%] max-w-[200px] items-center bg-green-600 hover:bg-green-700 text-white justify-evenly py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
      >
        <ShoppingCart size={28} />
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-lg">View Cart</span>
          <span className="text-sm">5 Items</span>
        </div>
      </button>
    </div>
  );
}
