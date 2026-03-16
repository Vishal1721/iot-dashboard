import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getStatus } from "@/utils/status";
import { Bell } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Disconnected");
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (user) getStatus().then(setStatus);
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const statusColor =
    status === "Connected"
      ? "bg-teal-500"
      : status === "Connecting"
        ? "bg-amber-400"
        : "bg-slate-600";

  return (
    <header className="fixed top-0 left-0 sm:left-56 right-0 z-40 h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-5">
      {/* left */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-slate-200">
          {user?.username || "Guest"}
        </span>
        <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
          {isAdmin ? "Admin" : "User"}
        </span>
      </div>

      {/* right */}
      <div className="flex items-center gap-4">
        {/* status dot */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-xs text-slate-500 hidden sm:inline">
            {status}
          </span>
        </div>

        {/* quick action */}
        <button
          onClick={() => navigate(isAdmin ? "/manageProject" : "/projects")}
          className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors duration-150"
        >
          {isAdmin ? "Manage Projects" : "Quick Start"}
        </button>

        {/* bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif((p) => !p)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <span className="text-sm font-medium text-slate-200">
                  Notifications
                </span>
                <span className="text-xs text-slate-600">0 new</span>
              </div>
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-600">
                <Bell className="w-6 h-6 opacity-30" strokeWidth={1} />
                <p className="text-xs">No notifications yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
