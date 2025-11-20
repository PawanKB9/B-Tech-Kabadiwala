"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function OrderFeedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for rating ${rating} stars!`);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 text-center">
        Order Pickup Feedback
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Q1 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            1. How was the pickup person’s behavior?
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an option</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            2. Did you receive the full payment as expected?
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an option</option>
            <option>Yes, full payment received</option>
            <option>No, there was an issue</option>
          </select>
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            3. Was the weighing done in front of you, and did it seem fair?
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an option</option>
            <option>Yes, done honestly</option>
            <option>Yes, but I’m unsure about accuracy</option>
            <option>No, it wasn’t done in front of me</option>
          </select>
        </div>

        {/* Q4 - Improved interactive star rating */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            4. How would you rate your overall order experience?
          </label>
          <div className="flex gap-2 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                onMouseEnter={() => setHover(num)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(num)}
                className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                  (hover || rating) >= num
                    ? "text-yellow-400 fill-yellow-400 scale-110"
                    : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 active:scale-95 transition"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}
