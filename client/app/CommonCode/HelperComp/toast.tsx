import toast from "react-hot-toast";

export const showProgressSuccessToast = (
  message: string,
  duration = 3000
) => {
  toast.custom(
    (t) => (
      <div className="relative w-80 bg-white shadow-lg rounded-lg border p-4 overflow-hidden">
        <p className="text-gray-800 font-medium">{message}</p>

        {/* Linear Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-green-500 animate-linear-progress"
          style={{ "--toast-duration": `${duration}ms` } as React.CSSProperties}
        />
      </div>
    ),
    { duration }
  );
};
