import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button1";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── data ─── */
const features = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          d="M3 12h4l3-9 4 18 3-9h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Live Data Streams",
    desc: "Real-time telemetry from every connected device — visualised as it arrives.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
        <path d="M17.5 16v1.5l1 1" strokeLinecap="round" />
      </svg>
    ),
    title: "Project Tracking",
    desc: "Group devices by project, assign ownership, and monitor status at a glance.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Unified Analytics",
    desc: "Cross-device dashboards with historical trends, anomaly alerts, and exports.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Campus Network",
    desc: "Operates entirely on your local campus network — no cloud dependency required.",
  },
];

const stats = [
  { value: "400+", label: "Devices Supported" },
  { value: "< 50ms", label: "Avg. Latency" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "12+", label: "Protocol Types" },
];

/* ─── animated grid background ─── */
function GridBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* dot grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      {/* glowing orbs — teal & amber, kept subtle */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full bg-amber-400/8 blur-3xl" />
    </div>
  );
}

/* ─── pulsing indicator ─── */
function PulseIndicator({ color = "teal" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}
      />
      <span
        className={`relative inline-flex rounded-full h-2 w-2 bg-${color}-500`}
      />
    </span>
  );
}

/* ─── component ─── */
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 py-28">
        <GridBackground />

        {/* status badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeIn}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-800/60 bg-teal-950/50 text-teal-400 text-xs font-mono tracking-widest uppercase"
        >
          <PulseIndicator color="teal" />
          System Online · Campus Network Active
        </motion.div>

        {/* headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.25}
          variants={fadeUp}
          className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
          style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
        >
          Centralised IoT{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
            Monitoring
          </span>{" "}
          for Your Campus
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.4}
          variants={fadeUp}
          className="mt-6 max-w-xl text-slate-400 text-base md:text-lg leading-relaxed"
        >
          One dashboard. Every device. Track live data streams, manage projects,
          and surface analytics — all within your secure campus network.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.55}
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/projects")}
            className="px-7 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-teal-900/40 hover:shadow-teal-700/40 hover:-translate-y-0.5"
          >
            Go to Projects →
          </button>
          <button
            onClick={() => navigate("/docs")}
            className="px-7 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            View Docs
          </button>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs"
        >
          <span>scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="border-y border-slate-800 bg-slate-900/60 backdrop-blur-sm"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              custom={0}
              className="flex flex-col items-center justify-center py-10 px-6 gap-1"
            >
              <span
                className="text-3xl font-bold text-teal-400 tabular-nums"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s.value}
              </span>
              <span className="text-slate-500 text-xs tracking-wide uppercase">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="relative py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="mb-16 text-center"
          >
            <p className="text-teal-500 text-xs font-mono tracking-widest uppercase mb-3">
              Platform Capabilities
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Everything you need in one place
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={0}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-teal-800/60 hover:bg-slate-900 transition-all duration-300 overflow-hidden"
              >
                {/* corner accent on hover */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 group-hover:bg-teal-500/10 rounded-bl-full transition-colors duration-300" />

                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-950 text-teal-400 mb-4 border border-teal-900">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ DEVICE PREVIEW STRIP ══════════ */}
      <section className="py-16 px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center text-slate-500 text-xs font-mono tracking-widest uppercase mb-10"
          >
            Compatible Protocols
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "MQTT",
              "HTTP/REST",
              "CoAP",
              "WebSocket",
              "Modbus",
              "BLE",
              "Zigbee",
              "LoRa",
              "OPC-UA",
              "AMQP",
              "gRPC",
              "SNMP",
            ].map((p) => (
              <motion.span
                key={p}
                variants={fadeIn}
                custom={0}
                className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 text-xs font-mono hover:border-teal-700 hover:text-teal-400 transition-colors duration-200 cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA FOOTER BAND ══════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/8 blur-3xl rounded-full" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="relative max-w-2xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Ready to monitor your devices?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={0.1}
            className="text-slate-400 mb-10 text-base"
          >
            {user
              ? `Welcome back, ${user.name ?? "there"}. Your projects are waiting.`
              : "Sign in or jump straight to your projects dashboard."}
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={0.2}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/projects")}
              className="px-8 py-3.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-xl shadow-teal-950/50 hover:-translate-y-0.5"
            >
              Open Dashboard →
            </button>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Sign In
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
