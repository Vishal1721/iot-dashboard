export const Esp32_ExampleCode = `#include "WiFiSetup.h"
#include "SensorData.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Define project-specific details
String projectName = "Health Glove";
String sensorName = "Distance";

// ultrasonic
#define TRIG_PIN 5
#define ECHO_PIN 18
#define SOUND_SPEED 0.034
long duration;
float distanceCm;

// DHT11
#define DHTPIN 4
#define DHTTYPE DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);
uint32_t delayMS;

// LED
#define LED_PIN 23
#define SWITCH_PIN 21

void setup() {
    Serial.begin(115200);

    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    dht.begin();
    sensor_t sensor;
    dht.temperature().getSensor(&sensor);
    delayMS = sensor.min_delay / 1000;

    pinMode(LED_PIN, OUTPUT);
    pinMode(SWITCH_PIN, INPUT_PULLUP);

    connectToWiFi();
}

void loop() {
    // 🔹 Ultrasonic
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    duration = pulseIn(ECHO_PIN, HIGH);
    distanceCm = duration * SOUND_SPEED / 2;

    Serial.print("Distance: ");
    Serial.println(distanceCm);

    // 🔹 Send to backend
    sendSensorData(projectName, sensorName, (int)distanceCm);

    // 🔹 Get control value (for LED)
    int value = getLatestSensorData(projectName, "LED");

    if (value == 1) digitalWrite(LED_PIN, HIGH);
    else digitalWrite(LED_PIN, LOW);

    delay(5000);
}`


export const RaspBerryPi_ExampleCode = `import RPi.GPIO as GPIO
import time
import requests

# =====================
# CONFIG
# =====================
BASE_URL = "https://iot-dashboard-v5ab.onrender.com"
PROJECT_NAME = "Health Glove"
DEVICE_KEY = "ESP32_SECRET_123"

HEADERS = {
    "Content-Type": "application/json",
    "x-device-key": DEVICE_KEY
}

# GPIO
TRIG_PIN = 5
ECHO_PIN = 18
LED_PIN = 23
SWITCH_PIN = 21

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG_PIN, GPIO.OUT)
GPIO.setup(ECHO_PIN, GPIO.IN)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.setup(SWITCH_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# =====================
# FUNCTIONS
# =====================
def get_distance():
    GPIO.output(TRIG_PIN, False)
    time.sleep(0.1)

    GPIO.output(TRIG_PIN, True)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, False)

    while GPIO.input(ECHO_PIN) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO_PIN) == 1:
        pulse_end = time.time()

    duration = pulse_end - pulse_start
    return round((duration * 34300) / 2, 2)


def send_sensor(sensor_name, value):
    url = f"{BASE_URL}/api/projects/{PROJECT_NAME}/sensor/{sensor_name}/sendValue"
    requests.post(url, headers=HEADERS, json={"value": value})


def get_sensor(sensor_name):
    url = f"{BASE_URL}/api/projects/{PROJECT_NAME}/sensor/{sensor_name}/getValue"
    res = requests.post(url, headers=HEADERS, json={})
    data = res.json()

    if data.get("data"):
        return data["data"][0]["value"]

    return -1


# =====================
# LOOP
# =====================
try:
    while True:
        distance = get_distance()
        print("Distance:", distance)

        # Send data
        send_sensor("Distance", distance)

        # Get LED control
        led_value = get_sensor("LED")

        if led_value == 1:
            GPIO.output(LED_PIN, GPIO.HIGH)
        else:
            GPIO.output(LED_PIN, GPIO.LOW)

        time.sleep(5)

except KeyboardInterrupt:
    GPIO.cleanup()`
