import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Wifi,
  Database,
  Monitor,
  TrendingUp,
  Cpu,
  Radio,
  Shield,
  Server,
  Layers,
  Bell,
  ChevronRight,
  Globe,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProjectsByUserId } from "@/APIs/projectAPI";


const ThreeBackground = lazy(() => import("@/components/ThreeBackground"));

/* ─── fade-up helper ─── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── counter hook ─── */
function useCounter(target, duration = 1800) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = null;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);

  return v;
}

/* ─── data ─── */
const FEATURES = [
  { icon: Monitor, title: "Unified Dashboard", desc: "Central hub for IoT projects." },
  { icon: Activity, title: "Real-Time Visualisation", desc: "Live sensor updates." },
  { icon: Globe, title: "Campus Network", desc: "Runs locally on campus." },
  { icon: Shield, title: "Secure Auth", desc: "JWT + bcrypt security." },
  { icon: Bell, title: "Faculty Admin Panel", desc: "Real-time alerts." },
  { icon: Database, title: "Historical Insights", desc: "MongoDB storage." },
  { icon: Cpu, title: "Hardware Integration", desc: "ESP32 support." },
  { icon: Layers, title: "Multi-Sensor Support", desc: "Multiple sensors unified." },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({ projects: 0, mcus: 0, keys: 0 });

  useEffect(() => {
    if (!user?._id) return;

    getProjectsByUserId(user._id)
      .then((res) => {
        const projects = res?.projects || [];
        const mcus = new Set(projects.map((p) => p.MicroController));
        setStats({
          projects: projects.length,
          mcus: mcus.size,
          keys: projects.filter((p) => p.deviceKey).length,
        });
      })
      .catch(() => {});
  }, [user]);

  const pc = useCounter(stats.projects);
  const mc = useCounter(stats.mcus);
  const kc = useCounter(stats.keys);

  return (
    <div className="bg-slate-950 text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center">

    
        <Suspense fallback={null}>
          <ThreeBackground />
        </Suspense>

        <h1 className="text-5xl font-bold mb-4">
          Web-Based IoT Dashboard
        </h1>

        <p className="text-gray-400 mb-6">
          Monitor sensors in real-time across campus.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-teal-500 px-6 py-3 rounded-lg"
        >
          Get Started
        </button>

        {/* STATS */}
        <div className="mt-10 flex gap-10">
          <div>
            <h2>{pc}</h2>
            <p>Projects</p>
          </div>
          <div>
            <h2>{mc}</h2>
            <p>MCUs</p>
          </div>
          <div>
            <h2>{kc}</h2>
            <p>Keys</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="p-10 grid grid-cols-2 gap-6">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-4 border rounded-lg">
            <Icon />
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
};

export default Landing;
