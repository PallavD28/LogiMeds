import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, Package, Truck, LogOut, Activity } from "lucide-react"

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <div className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col p-5 shadow-sm">

      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8 px-1">
        <div className="bg-sky-600 text-white p-1.5 rounded-lg">
          <Activity size={16} />
        </div>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">LogiMeds</h1>
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1">
        {[
          { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/orders",    label: "Orders",    icon: Package },
          { to: "/shipments", label: "Shipments", icon: Truck },
        ].map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-sky-50 text-sky-700 border border-sky-200 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-sky-600" : "text-slate-400"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 mt-4 border border-transparent hover:border-red-200"
      >
        <LogOut size={15} />
        Log out
      </button>
    </div>
  )
}
