# MQTT → Firebase learning sequence

The existing `mqtt-topic` lesson now explains broker/client roles, CONNECT, publish/subscribe, topic filters, QoS, retained messages, clean-session reconnection, and the distinction between MQTT and database storage.

Four guided lessons are integrated into the canonical IoT order:

1. `mqtt-broker-lokal`: Ubuntu/Debian Mosquitto 2.x, per-user topic ACLs, and terminal publish/subscribe verification.
2. `esp32-mqtt`: classic ESP32 Arduino + PubSubClient, five-second simulated telemetry, Serial-only incoming commands, reconnect and resubscribe.
3. `mqtt-firebase`: Paho Python subscriber, payload validation, bounded latest-value queue, Firebase Admin database auth override and restricted Realtime Database rules.
4. `firebase-dashboard`: standalone Vite + Firebase Web SDK example, reader login, live latest-value updates, logout cleanup and stale-data indication.

There are 47 canonical IoT lessons; existing slugs and progress identifiers are preserved. Arduino A–D remains 22 topics with shared foundations. UNO and ESP32 code remain distinct.

## Scope

This change publishes educational content. It does not provision a Firebase project, configure website authentication, run a broker on the website, or connect readers' devices. Readers supply their own lab project and credentials. Service-account keys stay outside repositories and browsers.

The local MQTT exercise uses unencrypted port 1883 only on a controlled private lab LAN. The lesson explicitly distinguishes password authentication from transport encryption and explains the TLS requirements for shared/cloud networks. Firebase connections use HTTPS.

Telemetry is clearly marked simulated. Firebase stores only `devices/esp32-01/latest`, not history. The bounded in-memory worker deliberately drops old pending samples and can skip writes after three failures; it is not a durable recorder. Command examples only print to Serial and do not actuate hardware.

## Validation

- `python scripts/check-arduino-curriculum.py`: canonical coverage plus existing Arduino course checks.
- `python scripts/check-mqtt-firebase.py`: ordered prerequisites, JSON/Python syntax, diagram XML and rejected malformed/range/identity payloads.
- `node scripts/check-firebase-dashboard.cjs`: actual tutorial JavaScript exercised with SDK/DOM substitutes for fresh/stale data, simulation labels, logout cleanup, denied reads and invalid values.
- Tutorial imports and callback setup exercised with Paho MQTT 2.1.0 and Firebase Admin Python 7.7.0. Server timestamp uses the Realtime Database `{ ".sv": "timestamp" }` placeholder.
- Next.js production build validates types and renders all lesson routes.

No physical ESP32, live Firebase project or Firebase rules emulator was used. Mocked checks do not establish hardware behavior, cloud credentials, or actual deployed Firebase rule enforcement. The tutorial includes manual end-to-end and rules checks for the reader's own lab.
