import { NavLink } from "react-router-dom";

export default function SidebarItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
        ${isActive ? "bg-[#27272f] text-white" : "text-gray-300 hover:bg-[#1e1e25]"}`
      }
    >
      {Icon && <Icon size={20} />}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
