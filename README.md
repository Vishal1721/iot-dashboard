# 🌐 IoT Dashboard for Multi-Sensor Monitoring

A full-stack IoT system that enables real-time monitoring and control of sensors using ESP32, a cloud backend, and a modern web dashboard.

---

## 🚀 Features

* 📡 Real-time sensor data collection (ESP32)
* 🌍 Cloud-based backend (Node.js + Express)
* 📊 Live dashboard with data visualization (React)
* 🔐 Secure device authentication using Device Key
* 💡 Remote control of devices (LED toggle)
* ⚡ Scalable architecture (Railway deployment + load balancing ready)

---

## 🏗️ System Architecture

```
ESP32 Device
   ↓
HTTP API (WiFi)
   ↓
Node.js Backend (Railway)
   ↓
MongoDB Atlas (Database)
   ↓
React Frontend (Vercel)
```

---

## 🧠 How It Works

1. ESP32 reads sensor data (e.g., distance)
2. Sends data to backend via REST API
3. Backend stores data in MongoDB
4. Frontend fetches and displays data
5. User controls devices (e.g., LED) via dashboard
6. ESP32 polls backend and updates hardware state

---

## 🛠️ Tech Stack

### 🔹 Hardware

* ESP32

### 🔹 Backend

* Node.js
* Express.js
* MongoDB Atlas

### 🔹 Frontend

* React.js
* Tailwind CSS

### 🔹 Deployment

* Backend → Railway
* Frontend → Vercel

---

## 🔐 API Endpoints

### 📤 Send Sensor Data

```
POST /api/projects/:projectName/sensor/:sensorName/sendValue
```

### 📥 Get Sensor Data

```
POST /api/projects/:projectName/sensor/:sensorName/getValue
```

### Headers

```
Content-Type: application/json
x-device-key: YOUR_DEVICE_KEY
```

---

## ⚙️ ESP32 Configuration

```cpp
String BASE_URL = "https://your-backend-url";
String projectName = "your-project-name";
String sensorName = "Distance";
```

---

## 📦 Installation

### 1. Clone Repository

```
git clone https://github.com/your-username/iot-dashboard.git
```

### 2. Backend Setup

```
cd backend
npm install
npm start
```

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

* Backend deployed on Railway
* Frontend deployed on Vercel
* MongoDB Atlas used for cloud database

---

## 📈 Scaling Strategy

* Horizontal scaling using Railway replicas
* Load balancing handled by platform
* Future improvements:

  * MQTT for real-time communication
  * Kubernetes for large-scale deployment

---

## ⚠️ Challenges Faced

* Handling CORS between frontend and backend
* Managing real-time device communication
* Fixing backend cold-start delays (Render → Railway migration)
* Structuring API for both sensor input and device control

---

## 🚀 Future Improvements

* Replace polling with WebSockets / MQTT
* Add role-based authentication
* Improve performance with caching (Redis)
* Add analytics dashboard

---

## 👨‍💻 Author

**Vishal R**

---

## 💡 Key Learning

This project demonstrates end-to-end IoT system design, including hardware integration, backend APIs, cloud deployment, and frontend visualization.

---

⭐ If you like this project, give it a star!
