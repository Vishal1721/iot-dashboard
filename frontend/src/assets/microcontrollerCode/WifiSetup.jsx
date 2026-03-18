export const Esp32_WifiSetUp_code = `#ifndef WIFI_SETUP_H
#define WIFI_SETUP_H

#include <WiFi.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

void connectToWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");

    // Wait until connected
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nConnected to WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

#endif
`

export const RaspBerryPi_WifiSetUp_code = `import os
import time

# WiFi Credentials
SSID = "YOUR_WIFI_SSID"
PASSWORD = "YOUR_WIFI_PASSWORD"

def connect_to_wifi():
    print("Connecting to WiFi...")

    # Connect using nmcli
    os.system(f"nmcli dev wifi connect '{SSID}' password '{PASSWORD}'")

    # Check connection
    for _ in range(10):
        status = os.popen("nmcli -t -f ACTIVE,SSID dev wifi | grep '^yes'").read()

        if SSID in status:
            print("\nConnected to WiFi!")
            return True

        print(".", end="", flush=True)
        time.sleep(0.5)

    print("\nFailed to connect to WiFi.")
    return False

`
