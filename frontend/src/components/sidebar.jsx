import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  FolderKanban,
  MapPin,
  BookOpen,
  User,
  LogOut,
  Users,
  Menu,
  X,
  Activity,
} from "lucide-react";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const role = user?.role?.toLowerCase();

  const userLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/liveTracking", icon: MapPin, label: "Live Tracking" },
    { to: "/tutorial", icon: BookOpen, label: "Tutorial" },
  ];

  const adminLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/manageProject", icon: FolderKanban, label: "Manage Projects" },
    { to: "/manageUser", icon: Users, label: "Manage Users" },
    { to: "/allTracking", icon: MapPin, label: "Live Tracking" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  const NavLink = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
          active
            ? "bg-slate-800 text-white"
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
        }`}
      >
        {/* active bar */}
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-teal-400 rounded-full" />
        )}
        <Icon
          className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
            active
              ? "text-teal-400"
              : "text-slate-600 group-hover:text-slate-400"
          }`}
          strokeWidth={active ? 2 : 1.5}
        />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-4 px-3">
      {/* logo */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        {/* <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
          <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div> */}
        <span className="text-sm font-semibold text-slate-200 tracking-tight">
          IoT<span className="text-teal-400">Hub</span>
        </span>
      </div>

      {/* user chip */}
      <div className="mx-1 mb-5 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800">
        <p className="text-xs font-medium text-slate-300 truncate">
          {user?.username || "Guest"}
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5 capitalize">
          {role || "user"}
        </p>
      </div>

      {/* nav label */}
      <p className="px-3 mb-1.5 text-[10px] font-mono text-slate-700 uppercase tracking-widest">
        Menu
      </p>

      {/* nav links */}
      <nav className="flex-1 space-y-0.5">
        {links.map((l) => (
          <NavLink key={l.to} {...l} />
        ))}
      </nav>

      {/* bottom */}
      <div className="space-y-0.5 pt-4 border-t border-slate-800/60">
        <NavLink to="/profile" icon={User} label="Profile" />
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all duration-150 group"
        >
          <LogOut
            className="w-4 h-4 shrink-0 text-slate-600 group-hover:text-red-400 transition-colors"
            strokeWidth={1.5}
          />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* mobile toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* mobile overlay */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-slate-950 border-r border-slate-800/60 z-40 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative sm:flex sm:flex-col`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
