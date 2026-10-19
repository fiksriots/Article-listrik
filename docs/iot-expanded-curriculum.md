# Expanded IoT curriculum

This update adds 28 lessons to the existing 47, for 75 canonical lessons in 15 groups. Existing slugs and progress IDs are preserved. Arduino A–D retains its 22-topic specialist index, with additional foundations and extensions available in the main course.

## Coverage

- Planning: requirements, component selection, test criteria, datasheet/pinout, adapter and battery estimates.
- Programming: variables/types/units, conditions/loops, functions/arrays, Serial debugging, `millis`, debounce, and state machines.
- Measurements: calibration, filtering, invalid/stale values.
- Device interfaces: UART, SPI, Preferences/NVS, UNO EEPROM introduction, and SD CSV.
- Reliability: reconnect, SQLite gateway outbox, stable message IDs, idempotence, TLS/CA, watchdog recovery.
- Maintenance: OTA preparation and recovery, deep sleep and whole-board energy use.
- Industrial introduction: RS485 versus Modbus, register maps, scaling, read-only simulated decoding.
- Applications: Firebase history/graph, alarm transitions and stale-data detection, command/request versus reported state, per-device access.
- Construction: connectors, enclosure, sensor/antenna placement, strain relief and records.
- Capstone: ESP32 + DHT22 + local hysteresis + low-voltage DC driver + MQTT telemetry, with incremental history/alarm/command development.

## Learning UX

The homepage now has starting points for beginners, UNO users and readers ready for ESP32; a system data-flow explanation; and a group map. Every catalog group shows prerequisites, goal, first lesson and progress. Search and group selection work with catalog metadata only, keeping full lesson bodies and examples out of the client module. Articles show their group context and follow one canonical previous/next sequence. Sidebars remain collapsed by default.

## Example scope

Every example identifies its environment. Complete small sketches are distinct from integration fragments, simulations and official-example workflows. UNO uses 5 V logic where documented; ESP32 examples are explicitly for a compatible classic board with 3.3 V signals. No mains wiring is introduced. The capstone starts with an LED and requires a documented 3.3 V active-high DC driver before connecting a fan; it does not drive a load directly from a GPIO.

Firebase history uses stable message IDs, input validation, transactions and a rules example for a separate lab. Retries preserve the first received timestamp, and older measured samples cannot overwrite a newer latest value. The command validator is a simulation, not a deployed remote-control service. Notification examples do not send external messages. OTA uses the installed official package example rather than embedding an unauthenticated updater. Watchdog simulation does not claim to exercise hardware watchdog APIs.

## Validation

- `python scripts/check-arduino-curriculum.py`: all canonical slugs and existing Arduino curriculum.
- `python scripts/check-mqtt-firebase.py` and `node scripts/check-firebase-dashboard.cjs`: previous MQTT/Firebase regressions.
- `python scripts/check-iot-expanded.py`: new coverage, syntax, XML, executed local Python examples, command rejection, duplicate-history and backlog ordering with an SDK-boundary substitute.
- SVG diagrams rendered for visual inspection.
- Next.js production build checks TS and statically generates all lesson pages; generated HTML checked for ordering, image references, copy controls and collapsed sidebars.

No live Firebase project, real broker, physical ESP32/fan, or new Arduino target-toolchain compilation was used. SDK/DOM substitutes cannot establish cloud rules enforcement or hardware behavior. Firmware and integration instructions require the reader's own board, credentials, compatible versions and the manual checks included in the lessons.
