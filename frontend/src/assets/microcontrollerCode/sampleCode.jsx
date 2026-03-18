export const esp_SampleCode =`#include "WiFiSetup.h"
#include "SensorData.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Define project-specific details
String projectName = "ProjectName";  // Replace with actual project name
String sensorName = "SensorName";    // Replace with actual sensor name

int sensorData = 0; // Example sensor value

void setup() {
    Serial.begin(115200);

    // YOUR SENSOR PINMODE DECLARATION & INITIALIZATION CODE HERE
    
    connectToWiFi(); // Connect to Wi-Fi
}

void loop() {
    // YOUR SENSOR DATA READING CODE HERE
    sensorData = random(0, 100); // Example data

    // Send sensor data to the cloud
    sendSensorData(projectName, sensorName, sensorData);

    // Get latest sensor data from the cloud
    int value = getLatestSensorData(projectName, sensorName);

    Serial.print("Received: ");
    Serial.println(value);

    delay(5000); // Set the delay as per your requirement
}
;`

export const python_Samplecode = `import time
from WiFiSetup import connect_to_wifi
from SensorData import send_sensor_data, get_latest_sensor_data

# Define project-specific details
project_name = "ProjectName"  # Replace with actual project name
sensor_name = "SensorName"    # Replace with actual sensor name

def setup():
    print("Initializing...")
    
    # YOUR SENSOR PINMODE DECLARATION & INITIALIZATION CODE HERE
    
    connect_to_wifi()  # Connect to Wi-Fi

def loop():
    while True:
        # YOUR SENSOR DATA READING CODE HERE
        sensor_data = 1  # Example value

        # Send sensor data to the cloud
        send_sensor_data(project_name, sensor_name, sensor_data)

        # Get latest sensor data from the cloud
        value = get_latest_sensor_data(project_name, sensor_name)

        print("Received:", value)

        time.sleep(5)

if __name__ == "__main__":
    setup()
    loop()
;`
