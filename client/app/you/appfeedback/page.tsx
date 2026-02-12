"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function AppExperienceFeedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for your valuable feedback! Rated ${rating} stars.`);
  };

  return (
    <div className=" w-full max-w-3xl pb-24 sm:px-8 mx-auto bg-white p-4 text-gray-800 rounded-2xl shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-4 text-center">
        App Experience Feedback
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Q1 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            1. What do you dislike or find inconvenient about this app?
          </label>
          <textarea
            required
            placeholder="Write your thoughts here..."
            className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            2. How did you handle or solve that issue?
          </label>
          <textarea
            required
            placeholder="Describe how you managed it..."
            className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">
            3. Any additional suggestions to improve your experience?
          </label>
          <textarea
            placeholder="We’d love to hear your ideas..."
            className="w-full border border-gray-300 rounded-lg p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Q4 - star rating */}
        <div>
          <label className="block text-base font-medium text-gray-800 mb-3">
            4. How would you rate your overall experience with this app?
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
