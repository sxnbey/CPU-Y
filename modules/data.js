/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

// Imports the client and the systeminformation modules which is the source of all the system information.

const sysin = require("systeminformation");
const handlers = require("../handlers/handler.js");

/************************************************************************************************\
*                                            EXPORTS                                             *
\************************************************************************************************/

// Exports the createData function so it can be used in ../index.js.

module.exports = createData;

/************************************************************************************************\
*                                          FUNCTIONS                                             *
\************************************************************************************************/

// Creates the data that will be shown.

async function createData() {
  // Raw system information.

  let system;

  try {
    system = {
      cpu: await sysin.cpu(),
      system: await sysin.system(),
      memory: await sysin.mem(),
      ram: await sysin.memLayout(),
      battery: await sysin.battery(),
      os: await sysin.osInfo(),
      network: (await sysin.networkInterfaces()).find((i) => i.default),
      graphics: {
        controller: (await sysin.graphics()).controllers.find((i) => i.bus),
        displays: (await sysin.graphics()).displays,
      },
    };
    system.cpu.load = (await sysin.currentLoad()).currentLoad;
  } catch (e) {
    handlers.errorHandler("01", "001", e.stack.split("\n"));

    process.exit();
  }

  // Returns the finished system information.

  try {
    return {
      hasBattery: system.battery.hasBattery,
      system: function () {
        return (
          `Device: ${system.system.model}` +
          "\n" +
          `UUID: ${system.system.uuid}` +
          "\n" +
          `Platform: ${system.os.platform}` +
          "\n" +
          `Distribution: ${system.os.distro}` +
          "\n" +
          `Hostname: ${system.os.hostname}`
        );
      },
      cpu: function () {
        return (
          `CPU: ${system.cpu.manufacturer} ${system.cpu.brand}` +
          "\n" +
          `Sockel: ${system.cpu.socket}` +
          "\n" +
          `Cores: ${system.cpu.cores}` +
          "\n" +
          `Physical: ${system.cpu.physicalCores}` +
          "\n" +
          `Clock rate: ${system.cpu.speed} GHz` +
          "\n" +
          `Load: ${Math.round(system.cpu.load * 100) / 100}%`
        );
      },
      ram: function () {
        let ram =
          `Total: ${
            Math.round((system.memory.total / 1024 / 1024 / 1024) * 100) / 100
          } GB` +
          "\n" +
          `Available: ${
            Math.round((system.memory.free / 1024 / 1024 / 1024) * 100) / 100
          } GB`;

        system.ram.forEach(
          (i, n) =>
            (ram +=
              `\n\n\nRAM-Stick ${++n}: ${i.bank}` +
              "\n" +
              `Manufacturer: ${i.manufacturer}` +
              "\n" +
              `Serial number: ${i.serialNum}` +
              "\n" +
              `Größe: ${
                Math.round((i.size / 1024 / 1024 / 1024) * 100) / 100
              } GB` +
              "\n" +
              `Typ: ${i.type}` +
              "\n" +
              `Form factor: ${i.formFactor}` +
              "\n" +
              `Clock rate: ${i.clockSpeed} MHz` +
              "\n" +
              `Voltage: ${i.voltageConfigured} V`)
        );

        return ram;
      },
      graphics: function () {
        return (
          `Display device: ${system.graphics.controller.model}` +
          "\n" +
          `Chip manufacturer: ${system.graphics.controller.vendor}` +
          "\n" +
          `VRAM: ${system.graphics.controller.vram} MB` +
          "\n" +
          `Dynamic VRAM: ${
            system.graphics.controller.vramDynamic ? "Yes" : "No"
          }` +
          "\n" +
          `Bus: ${system.graphics.controller.bus}`
        );
      },
      displays: function () {
        let displays = "";

        system.graphics.displays.forEach(
          (i, n) =>
            (displays +=
              `Display ${++n}: ${i.deviceName}` +
                "\n" +
                `Model: ${i.model}` +
                "\n" +
                `Main display: ${i.main ? "Yes" : "No"}` +
                "\n" +
                `Integrated: ${i.builtin ? "Yes" : "No"}` +
                "\n" +
                `Connected via: ${i.connection}` +
                "\n" +
                `Resolution: ${i.resolutionX}x${i.resolutionY}` +
                "\n" +
                `Refresh rate: ${i.currentRefreshRate} Hz` +
                "\n" +
                system.graphics.displays.length >
              n
                ? "\n\n"
                : "")
        );

        return displays;
      },
      battery: function () {
        return (
          `Battery charge: ${system.battery.percent}%` +
          "\n" +
          `Charging: ${system.battery.isCharging ? "Yes" : "No"}`
        );
      },
      network: function () {
        return (
          `Standard network interface: ${system.network.iface}` +
          "\n" +
          `Name: ${system.network.ifaceName}` +
          "\n" +
          `MAC adress: ${system.network.mac}` +
          "\n" +
          `DNS suffix: ${
            system.network.dnsSuffix ? system.network.dnsSuffix : "/"
          }` +
          "\n" +
          `IPv4 adress: ${system.network.ip4}` +
          "\n" +
          `IPv4 subnet mask: ${system.network.ip4subnet}` +
          "\n" +
          `IPv6 adresse: ${system.network.ip6}` +
          "\n" +
          `IPv6 subnet mask: ${system.network.ip6subnet}` +
          "\n" +
          `Connection type: ${
            { wireless: "Wireless", wired: "Wired" }[system.network.type]
          }` +
          "\n" +
          `Speed: ${system.network.speed} Mbit/s`
        );
      },
    };
  } catch (e) {
    handlers.errorHandler("01", "002", e.stack.split("\n"));

    process.exit();
  }
}
