import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";
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

/* ─── fade-up helper ─── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
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
  {
    icon: Monitor,
    title: "Unified Dashboard",
    desc: "Central hub to monitor and manage multiple IoT projects with a clean, role-aware UI.",
  },
  {
    icon: Activity,
    title: "Real-Time Visualisation",
    desc: "Socket.IO + Recharts deliver live sensor updates as charts and gauges, zero delay.",
  },
  {
    icon: Globe,
    title: "Campus Network",
    desc: "Hosted on your college server — fully functional on the local campus network.",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    desc: "Role-based access using JWT tokens and bcrypt-hashed passwords for students and faculty.",
  },
  {
    icon: Bell,
    title: "Faculty Admin Panel",
    desc: "Faculty get real-time alerts via Nodemailer, sensor diagnostics, and full user control.",
  },
  {
    icon: Database,
    title: "Historical Insights",
    desc: "All sensor data stored in MongoDB for long-term monitoring, trend analysis, and export.",
  },
  {
    icon: Cpu,
    title: "Hardware Integration",
    desc: "Custom Arduino library and guides for ESP32 setup — beginner-friendly from day one.",
  },
  {
    icon: Layers,
    title: "Multi-Sensor Support",
    desc: "BME688, SCD41, MQ135, Rain, and Ultrasonic sensors all in one unified platform.",
  },
];

const STACK = [
  { label: "React.js", color: "text-cyan-400" },
  { label: "Node.js", color: "text-teal-400" },
  { label: "Express.js", color: "text-teal-400" },
  { label: "Socket.IO", color: "text-blue-400" },
  { label: "MongoDB", color: "text-amber-400" },
  { label: "JWT", color: "text-slate-400" },
  { label: "ESP32", color: "text-orange-400" },
  { label: "BME688", color: "text-slate-400" },
  { label: "SCD41", color: "text-slate-400" },
  { label: "MQ135", color: "text-slate-400" },
  { label: "Recharts", color: "text-cyan-400" },
  { label: "REST API", color: "text-teal-400" },
];

const ARCH = [
  {
    icon: Radio,
    label: "Input Layer",
    desc: "BME688, SCD41, MQ135, Ultrasonic sensors collect environmental data.",
  },
  {
    icon: Cpu,
    label: "Processing",
    desc: "ESP32 does threshold filtering and pushes via MQTT / WebSocket.",
  },
  {
    icon: Server,
    label: "Server Layer",
    desc: "Node.js + Express stores data to MongoDB and broadcasts updates via Socket.IO.",
  },
  {
    icon: Monitor,
    label: "Frontend",
    desc: "React + Recharts renders live visualisations and handles routing.",
  },
  {
    icon: Lock,
    label: "Auth & Control",
    desc: "JWT + bcrypt for secure role-based access. REST APIs throughout.",
  },
];

const FUTURE = [
  "Multi-user real-time collaboration",
  "2FA & OAuth login",
  "Cross-platform mobile app",
  "AWS / Google Cloud backup",
  "ML anomaly detection & trend prediction",
  "LoRa, Bluetooth & Zigbee support",
];

const BG_ICONS = [
  { Icon: Wifi, top: "16%", left: "8%", size: 80, dur: 6, delay: 0 },
  { Icon: Globe, top: "20%", right: "10%", size: 96, dur: 7.5, delay: 0.8 },
  { Icon: Database, top: "60%", left: "22%", size: 64, dur: 5.2, delay: 0.3 },
  { Icon: Monitor, top: "55%", right: "22%", size: 88, dur: 8, delay: 1.2 },
  { Icon: Radio, top: "40%", left: "4%", size: 56, dur: 6.5, delay: 0.6 },
  { Icon: Cpu, top: "36%", right: "4%", size: 72, dur: 7, delay: 1 },
];

/* ════════════════════════════════════════════ */
const Landing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const [stats, setStats] = useState({ projects: 0, mcus: 0, keys: 0 });

  useEffect(() => {
    if (!user?._id) return;
    getProjectsByUserId(user._id)
      .then((res) => {
        const projects = res?.projects || [];
        const mcus = new Set(
          projects.map((p) => p.MicroController).filter(Boolean),
        );
        setStats({
          projects: projects.length,
          mcus: mcus.size,
          keys: projects.filter((p) => p.deviceKey).length,
        });
      })
      .catch(() => {});
  }, [user?._id]);

  /* Three.js particle net */
  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 80;

    const N = 130;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      vel[i * 3] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    scene.add(
      new THREE.Points(
        ptGeo,
        new THREE.PointsMaterial({
          color: 0x67e8f9,
          size: 0.9,
          transparent: true,
          opacity: 0.8,
        }),
      ),
    );

    const MAX = N * N;
    const lBuf = new Float32Array(MAX * 6);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(lBuf, 3));
    lGeo.setDrawRange(0, 0);
    scene.add(
      new THREE.LineSegments(
        lGeo,
        new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.18,
        }),
      ),
    );

    const D = 30;
    let id;
    const animate = () => {
      id = requestAnimationFrame(animate);
      const p = ptGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        p[i * 3] += vel[i * 3];
        p[i * 3 + 1] += vel[i * 3 + 1];
        if (p[i * 3] > 100) p[i * 3] = -100;
        if (p[i * 3] < -100) p[i * 3] = 100;
        if (p[i * 3 + 1] > 60) p[i * 3 + 1] = -60;
        if (p[i * 3 + 1] < -60) p[i * 3 + 1] = 60;
      }
      ptGeo.attributes.position.needsUpdate = true;
      let lIdx = 0;
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          const dx = p[i * 3] - p[j * 3],
            dy = p[i * 3 + 1] - p[j * 3 + 1];
          if (dx * dx + dy * dy < D * D) {
            lBuf[lIdx++] = p[i * 3];
            lBuf[lIdx++] = p[i * 3 + 1];
            lBuf[lIdx++] = p[i * 3 + 2];
            lBuf[lIdx++] = p[j * 3];
            lBuf[lIdx++] = p[j * 3 + 1];
            lBuf[lIdx++] = p[j * 3 + 2];
          }
        }
      lGeo.attributes.position.array.set(lBuf);
      lGeo.attributes.position.needsUpdate = true;
      lGeo.setDrawRange(0, lIdx / 3);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const pc = useCounter(stats.projects);
  const mc = useCounter(stats.mcus);
  const kc = useCounter(stats.keys);

  return (
    <div
      className="bg-slate-950 text-slate-100 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.5, zIndex: 0 }}
        />

        {/* bg layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="g"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M48 0H0V48"
                  fill="none"
                  stroke="rgb(148 163 184)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* floating icons */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ zIndex: 2 }}
        >
          {BG_ICONS.map(({ Icon, top, left, right, size, dur, delay }) => (
            <motion.div
              key={`${dur}${delay}`}
              className="absolute"
              style={{ top, left, right }}
              animate={{ y: [0, -18, 0] }}
              transition={{
                duration: dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <Icon
                style={{ width: size, height: size }}
                className="text-cyan-300"
                strokeWidth={0.7}
              />
            </motion.div>
          ))}
        </div>

        {/* navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-8 py-5"
        >
          <div className="flex items-center gap-2.5">
            {/* <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div> */}
            <span
              className="text-sm font-semibold text-slate-200 tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              IoT<span className="text-teal-400">Hub</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.nav>

        {/* hero content */}
        <div className="relative z-10 max-w-5xl">
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
            className="mb-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-800/50 bg-cyan-950/50 text-cyan-400 text-xs font-mono tracking-widest uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Bannari Amman Institute of Technology
          </motion.div>

          <motion.h1
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Web-Based IoT Dashboard
            <br className="hidden md:block" /> for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              Multi-Sensor Monitoring
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp(0.35)}
            initial="hidden"
            animate="visible"
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          >
            A centralized IoT dashboard for academic projects that enables
            real-time sensor monitoring, project management, and seamless
            tracking of student IoT systems across the campus network.
          </motion.p>

          <motion.div
            variants={fadeUp(0.5)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="px-10 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-base rounded-xl shadow-2xl shadow-teal-900/40 transition-all duration-200"
            >
              Launch Dashboard →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/tutorial")}
              className="px-10 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-base rounded-xl transition-all duration-200 bg-slate-900/40"
            >
              View Tutorial
            </motion.button>
          </motion.div>
        </div>

        {/* live stats */}
        <motion.div
          variants={fadeUp(0.65)}
          initial="hidden"
          animate="visible"
          className="relative z-10 mt-20 w-full max-w-3xl grid grid-cols-3 gap-px bg-slate-800/40 rounded-2xl overflow-hidden border border-slate-700/50"
        >
          {[
            { label: "Your Projects", value: pc, suffix: "" },
            { label: "Microcontrollers", value: mc, suffix: "" },
            { label: "Device Keys", value: kc, suffix: "" },
          ].map(({ label, value, suffix }) => (
            <div
              key={label}
              className="flex flex-col items-center py-7 gap-1 bg-slate-900/70"
            >
              <span
                className="text-3xl font-bold text-teal-400 tabular-nums"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
                {suffix}
              </span>
              <span className="text-slate-500 text-xs uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="relative z-10 mt-14 flex flex-col items-center gap-1 text-slate-700 text-xs font-mono"
        >
          <span>scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══ PROBLEM / SOLUTION ══ */}
      <section className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-3">
              The Problem
            </p>
            <h2
              className="text-3xl font-bold text-white mb-4 leading-snug"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Fragmented IoT management in academia
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Modern campuses face fragmented IoT project management.
              <span className="text-white font-medium">
                {" "}
                Over 65% of academic IoT setups
              </span>{" "}
              lack real-time data access, sensor integration, or work only
              online — leading to delays, data loss, and inefficient
              decision-making.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-3">
              Our Solution
            </p>
            <h2
              className="text-3xl font-bold text-white mb-4 leading-snug"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              "Innovation begins where complexity ends."
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              A Web-Based IoT Dashboard that unifies multi-sensor monitoring and
              project tracking into one seamless platform. Real-time data via{" "}
              <span className="text-white">Socket.IO</span>, secured with
              role-based access, and powered by high-end sensors like BME688,
              SCD41, and MQ135 — all running on your campus server.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ KEY FEATURES ══ */}
      <section className="py-24 px-6 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">
              Platform
            </p>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Key Features
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp(0)}
                whileHover={{ y: -3 }}
                className="group p-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-teal-800/60 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-900 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
                </div>
                <p className="text-white font-semibold text-sm mb-1.5">
                  {title}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SYSTEM ARCHITECTURE ══ */}
      <section className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">
              How It Works
            </p>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              System Architecture
            </h2>
          </motion.div>
          <div className="relative">
            {/* connector line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-px bg-gradient-to-b from-teal-600/60 via-teal-800/30 to-transparent hidden sm:block" />
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {ARCH.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp(0)}
                  className="flex items-start gap-5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors bg-slate-900/40"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{label}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-mono text-slate-700 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ TECH STACK ══ */}
      <section className="py-20 px-6 border-t border-slate-800 bg-slate-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-8"
          >
            Technologies Used
          </motion.p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {STACK.map(({ label, color }) => (
              <motion.span
                key={label}
                variants={fadeUp(0)}
                className={`px-3.5 py-1.5 text-xs font-mono border border-slate-800 rounded-full bg-slate-900/60 ${color} hover:border-slate-600 transition-colors cursor-default`}
              >
                {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FUTURE VISION ══ */}
      <section className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-2">
              Roadmap
            </p>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Future Vision
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {FUTURE.map((item, i) => (
              <motion.div
                key={item}
                variants={fadeUp(0)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors"
              >
                <span className="text-xs font-mono text-teal-600 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-300 text-sm">{item}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 ml-auto shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-28 px-6 border-t border-slate-800 text-center">
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <div className="w-[500px] h-[200px] bg-teal-500/8 blur-3xl rounded-full" />
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mx-auto relative"
        >
          <motion.h2
            variants={fadeUp(0)}
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Ready to monitor your devices?
          </motion.h2>
          <motion.p
            variants={fadeUp(0.1)}
            className="text-slate-500 text-sm mb-8"
          >
            · Bannari Amman Institute of Technology
          </motion.p>
          <motion.div
            variants={fadeUp(0.2)}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="px-10 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-teal-950/50"
            >
              Open Dashboard →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/tutorial")}
              className="px-10 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-sm rounded-xl transition-all"
            >
              Getting Started Guide
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-800 py-6 px-8 text-center text-xs text-slate-700">
        IoTHub · Bannari Amman Institute of Technology
      </footer>
    </div>
  );
};

export default Landing;
