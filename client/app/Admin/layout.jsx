import VerticalNavBar from "./Nav";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-y-auto scrollbar-hide bg-stone-300">
      <VerticalNavBar />
      <div className="flex-1 p-2 mt-10">
        {children}
      </div>
    </div>
  );
}

