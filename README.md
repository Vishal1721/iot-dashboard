# 🌐 IoT Dashboard for Multi-Sensor Monitoring 🚀

![IoT](https://img.shields.io/badge/IoT-Project-blueviolet)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack IoT system that enables **real-time monitoring and control of sensors** using ESP devices, Raspberry Pi, cloud backend, and a modern web dashboard.

---

## ✨ Features

* 📡 Real-time sensor data from ESP32 / ESP8266 / Raspberry Pi
* 🌍 Cloud-based backend APIs
* 📊 Live dashboard visualization
* 🔐 Secure device authentication using Device Key
* 💡 Remote device control (LED, switches)
* ⚡ Scalable architecture (Render deployment ready)

---

## 🏗️ System Architecture

```text
ESP32 / ESP8266 / Raspberry Pi
        ↓
     HTTP API
        ↓
 Node.js Backend (Render)
        ↓
   MongoDB Atlas
        ↓
 React Frontend (Vercel)
```

---

## 🧠 How It Works

1. Device reads sensor data
2. Sends data to backend using REST API
3. Backend stores data in MongoDB
4. Frontend fetches & displays data
5. User sends control command (LED toggle)
6. Device fetches command & updates hardware

---

## 🛠️ Tech Stack

### 🔹 Hardware

![ESP32](https://img.shields.io/badge/ESP32-black?style=for-the-badge\&logo=espressif)
![ESP8266](https://img.shields.io/badge/ESP8266-grey?style=for-the-badge)
![Raspberry Pi](https://img.shields.io/badge/RaspberryPi-red?style=for-the-badge\&logo=raspberrypi)

---

### 🔹 Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-black?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb)

---

### 🔹 Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge\&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwindcss)

---

### 🔹 Deployment

![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge\&logo=vercel)
![Render](https://img.shields.io/badge/Railway-purple?style=for-the-badge)

---

## 🔐 API Endpoints

### 📤 Send Sensor Data

```http
POST /api/projects/:projectName/sensor/:sensorName/sendValue
```

### 📥 Get Sensor Data

```http
POST /api/projects/:projectName/sensor/:sensorName/getValue
```

### Headers

```json
Content-Type: application/json
x-device-key: YOUR_DEVICE_KEY
```

---

## ⚙️ ESP / Raspberry Pi Setup

```cpp
String BASE_URL = "https://your-backend-url";
String projectName = "your-project";
String sensorName = "Distance";
```

✔ Works with:

* ESP32
* ESP8266
* Raspberry Pi

---

## 📦 Installation

### 🔹 Clone Repo

```bash
git clone https://github.com/your-username/iot-dashboard.git
```

---

### 🔹 Backend

```bash
cd backend
npm install
npm start
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

* 🚀 Backend → Render
* 🌐 Frontend → Vercel
* ☁️ Database → MongoDB Atlas

---

## 📈 Scalability

* Future-ready for:
  * Docker 🐳
  * Kubernetes ☸️
  * MQTT 📡

---

## ⚠️ Challenges Faced

* Handling real-time communication
* Fixing backend cold-start delays
* Managing device authentication securely
* Designing flexible API for multiple sensors

---

## 🚀 Future Improvements

* MQTT for real-time communication
* WebSockets integration
* Redis caching
* Advanced analytics dashboard

---

## 👨‍💻 Author

**Vishal R**

---

## 💡 Key Highlight

> This project demonstrates **end-to-end IoT system design**, integrating hardware, cloud backend, and frontend with real-time control and scalability.

---

⭐ Star this repo if you found it useful!
