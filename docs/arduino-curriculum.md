# Arduino A–D curriculum

Website route: /iot/arduino. The track maps exactly 22 topics: A=5, B=7, C=6, D=4. Three canonical foundation lessons are enriched and reused; 19 specific Arduino labs are added. The core IoT/ESP32 material remains available.

Reference hardware: Arduino UNO R3 (ATmega328P, 5 V). Sketches are standalone; they must not be merged without pin/timer/power review. GPIO and ADC assumptions do not automatically apply to UNO R4 or ESP32. The ESP8266 internet path uses AT firmware as a modem; it does not overwrite the ESP with an independent sketch.

Every lab includes an analogy, concept explanation, components, a named-pin wiring/preparation table, practice sequence, expected result, troubleshooting, and a self-check. Code uses the shared terminal-style component with Copy. Button, LM35, and I2C have additional named-pin vector diagrams.

## Validation

- `python scripts/check-arduino-curriculum.py`
- `npm run build`
- All 17 C++ sketches compiled for `arduino:avr:uno` using Arduino AVR Boards 1.8.8.
- Libraries used for compilation: LiquidCrystal 1.0.7, Servo 1.3.0, Stepper 1.1.3, hd44780 1.3.2, RTClib 2.1.4, Adafruit BusIO 1.17.4, WiFiEspAT 1.5.0.
- The final web-control sketch uses a 2048-byte header budget and 8-second read deadline; its fixed request-line buffer remains 96 bytes. This sketch was compiled again after that adjustment.
- The Python receiver was exercised with valid telemetry, a browser GET, malformed JSON, an invalid device ID, and a boolean masquerading as a temperature. Valid data was displayed and invalid data rejected.

Compilation and software tests do not verify physical wiring, radio firmware compatibility, electrical performance, motor behavior, or sensor calibration. No live circuit or real ESP8266 was connected during verification. Follow exact module documentation and validate in a low-voltage lab.

Relay training uses a low-voltage DC lamp; the web-control example uses the built-in LED. These are not mains wiring instructions. Web examples are unencrypted, unauthenticated LAN-only labs, not production internet services. The receiver keeps only the latest value in memory, not durable history.
