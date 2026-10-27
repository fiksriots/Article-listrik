# Wireless, integrations, resilience, and network-room monitoring

Eight lessons extend the course from 75 to 83 canonical articles while retaining all previous slugs and the 15-group structure:

- `esp-now-dua-esp32`: two classic ESP32 boards, matching channel and STA MAC, fixed-size simulated payload, short receive callback and queue; explicit distinction between queuing, radio delivery, and application acknowledgement.
- `ble-esp32-ponsel`: read-only custom GATT service, advertising and phone scanner workflow, ASCII versus hex, and separation of READ/Notify/pairing. Example targets Arduino-ESP32 3.x rather than the developing 4.x API.
- `lora-lorawan-sensor`: transceiver versus gateway, LoRaWAN architecture, regional configuration and OTAA, plus a four-byte decoder that can be tested without transmitting radio.
- `konfigurasi-wifi-tanpa-upload`: physical setup button, first-boot SoftAP, unique AP password, POST form and per-boot token, single NVS config blob, five-minute setup expiry and recovery path. It is explicitly a local lab HTTP demo, not secure production provisioning or an MQTT client.
- `home-assistant-mqtt`: least-privilege accounts and additive ACL, sensor discovery, stable unique ID, non-retained measurements, and expiry without requiring an unimplemented availability publisher.
- `node-red-alur-mqtt`: importable core-node flow, payload validation, context, Debug, and local HTTP monitor; localhost-only settings and no credential values in exported flow.
- `uji-ketahanan-perangkat`: isolated-lab fault matrix, detection versus recovery timing, repeatable evidence and long-duration limits.
- `proyek-monitor-ruang-jaringan`: DHT22 and dry-button door/leak prototypes, dedicated MQTT schema/topics, online/Last Will status, validity and age checks; no load actuation. It deliberately does not claim that the previous temperature-only bridge accepts the new schema.

## Illustrations and original photographs

Nine code-native SVGs show actual relationships rather than copying the same generic pipeline: ESP-NOW peers, BLE GATT exchanges, LoRaWAN components, local provisioning, MQTT discovery, Node-RED flow/context, fault recovery, NOC data path, and a named-GPIO reference schematic. They are concept/reference drawings, not screenshots or board physical pinouts.

Three unchanged original Wikimedia Commons JPEGs are referenced from their stable Wikimedia original URLs with full source, author, license, and intrinsic dimensions on their respective articles:

- `DHT22-Temperatur-Sensor.jpg`, Ubahnverleih, CC0 1.0.
- `Reed switch (aka).jpg`, André Karwath (Aka), CC BY-SA 2.5.
- `LoRa Module with antenna and SPI wires attached.jpg`, Cnd, CC0 1.0.

The existing Espressif ESP32 photograph is also reused on applicable new lessons. A photograph of a transceiver is not labeled as a gateway or used to infer legal frequency parameters. Photographs remain unedited; references and license links are rendered with each image.

## Verification scope

- Existing Arduino, MQTT/Firebase, and expanded-course regression scripts continue to validate the canonical course.
- `node scripts/check-iot-wireless.cjs` runs the actual decoder and Node-RED Function bodies, validates flow wiring and discovery fields, and checks fresh/stale/invalid behavior. Node-RED context is substituted; this is not a live Node-RED runtime or Home Assistant test.
- `python scripts/check-iot-wireless.py` checks coverage, prerequisite order, image dimensions, credits, SVG XML, Python syntax, and NOC normal/stale/invalid/multiple-alarm decisions.
- SVGs rendered and visually inspected; original photographs inspected without editing.
- Next.js production build checks types and generates lesson pages. Generated HTML inspected for links, image paths, credit text, copy controls and default-closed sidebar.

No physical board, BLE phone session, on-air LoRa link, live Home Assistant, broker/cloud deployment, or target firmware-toolchain compilation is claimed. The eight additions are educational website content. Readers provide their own compatible board/library versions, lab credentials and services, then perform the manual checks in each lesson.
