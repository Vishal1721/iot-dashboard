export const esp32_SensorData =`#ifndef SENSOR_DATA_H
#define SENSOR_DATA_H

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* deviceKey = "YOUR_DEVICE_SECRET";
String BASE_URL = "https://iot-dashboard-v5ab.onrender.com";

// GET LATEST SENSOR DATA

int getLatestSensorData(String projectName, String sensorName) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi Disconnected!");
        return -1;
    }

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;

    String serverUrl = BASE_URL + "/api/projects/" + 
                       projectName + "/sensor/" + sensorName + "/getValue";

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", deviceKey);

    int httpResponseCode = http.POST("{}");

    if (httpResponseCode <= 0) {
        Serial.print("HTTP Error: ");
        Serial.println(httpResponseCode);
        http.end();
        return -1;
    }

    String response = http.getString();
    Serial.println("Response: " + response);

    http.end();

    DynamicJsonDocument jsonDoc(2048);
    DeserializationError error = deserializeJson(jsonDoc, response);

    if (!error && jsonDoc["data"].size() > 0) {
     
        int value = jsonDoc["data"][0]["value"];
        return value;
    }

    Serial.println("Invalid JSON or no data");
    return -1;
}

// SEND SENSOR DATA

void sendSensorData(String projectName, String sensorName, int value) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi Disconnected!");
        return;
    }

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;

    String serverUrl = BASE_URL + "/api/projects/" + 
                       projectName + "/sensor/" + sensorName + "/sendValue";

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-device-key", deviceKey);

    String body = "{\\"value\\":" + String(value) + "}";

    int httpResponseCode = http.POST(body);

    Serial.print("Send Status: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {
        Serial.println(http.getString());
    }

    http.end();
}

#endif
`;

export const RaspberryPi_SensorData = `import requests

DEVICE_KEY = "YOUR_DEVICE_SECRET"
BASE_URL = "https://iot-dashboard-v5ab.onrender.com"

HEADERS = {
    "Content-Type": "application/json",
    "x-device-key": DEVICE_KEY
}

# GET LATEST SENSOR DATA
def get_latest_sensor_data(project_name, sensor_name):
    url = f"{BASE_URL}/api/projects/{project_name}/sensor/{sensor_name}/getValue"

    try:
        response = requests.post(url, headers=HEADERS, json={})
        data = response.json()

        print("Response:", data)

        if "data" in data and len(data["data"]) > 0:
            return data["data"][0]["value"]

        return -1

    except Exception as e:
        print("Error:", e)
        return -1

# SEND SENSOR DATA
def send_sensor_data(project_name, sensor_name, value):
    url = f"{BASE_URL}/api/projects/{project_name}/sensor/{sensor_name}/sendValue"

    try:
        response = requests.post(
            url,
            headers=HEADERS,
            json={"value": value}
        )

        print("Send Status:", response.status_code)

    except Exception as e:
        print("Error:", e)
`;
