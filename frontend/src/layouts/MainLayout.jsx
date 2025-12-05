import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
     <div className="bg-black min-h-screen text-white">

      <Sidebar />

      <div className="ml-[280px]">
        <Navbar />
        <div>{children}</div>
      </div>

    </div>
  );
}
