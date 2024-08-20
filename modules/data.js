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
        return `Device: ${system.system.model}\nUUID: ${system.system.uuid}\nPlatform: ${system.os.platform}\nDistribution: ${system.os.distro}\nHostname: ${system.os.hostname}`;
      },
      cpu: function () {
        return `CPU: ${system.cpu.manufacturer} ${system.cpu.brand}\nSockel: ${
          system.cpu.socket
        }\nCores: ${system.cpu.cores}\nPhysical: ${
          system.cpu.physicalCores
        }\nClock rate: ${system.cpu.speed} GHz\nLoad: ${
          Math.round(system.cpu.load * 100) / 100
        }%`;
      },
      ram: function () {
        let ram = `Total: ${
          Math.round((system.memory.total / 1024 / 1024 / 1024) * 100) / 100
        } GB\nAvailable: ${
          Math.round((system.memory.free / 1024 / 1024 / 1024) * 100) / 100
        } GB`;

        system.ram.forEach(
          (i, n) =>
            (ram += `\n\n\nRAM-Stick ${++n}: ${i.bank}\nManufacturer: ${
              i.manufacturer
            }\nSerial number: ${i.serialNum}\nGröße: ${
              Math.round((i.size / 1024 / 1024 / 1024) * 100) / 100
            } GB\nTyp: ${i.type}\nForm factor: ${i.formFactor}\nClock rate: ${
              i.clockSpeed
            } MHz\nVoltage: ${i.voltageConfigured} V`)
        );

        return ram;
      },
      graphics: function () {
        return `Display device: ${
          system.graphics.controller.model
        }\nChip manufacturer: ${system.graphics.controller.vendor}\nVRAM: ${
          system.graphics.controller.vram
        } MB\nDynamic VRAM: ${
          system.graphics.controller.vramDynamic ? "Yes" : "No"
        }\nBus: ${system.graphics.controller.bus}`;
      },
      displays: function () {
        let displays = "";

        system.graphics.displays.forEach(
          (i, n) =>
            (displays += `Display ${++n}: ${i.deviceName}\nModel: ${
              i.model
            }\nMain display: ${i.main ? "Yes" : "No"}\nIntegrated: ${
              i.builtin ? "Yes" : "No"
            }\nConnected via: ${i.connection}\nResolution: ${i.resolutionX}x${
              i.resolutionY
            }\nRefresh rate: ${i.currentRefreshRate} Hz\n${
              system.graphics.displays.length > n ? "\n\n" : ""
            }`)
        );

        return displays;
      },
      battery: function () {
        return `Battery charge: ${system.battery.percent}%\nCharging: ${
          system.battery.isCharging ? "Yes" : "No"
        }`;
      },
      network: function () {
        return `Standard network interface: ${system.network.iface}\nName: ${
          system.network.ifaceName
        }\nMAC adress: ${system.network.mac}\nDNS suffix: ${
          system.network.dnsSuffix ? system.network.dnsSuffix : "/"
        }\nIPv4 adress: ${system.network.ip4}\nIPv4 subnet mask: ${
          system.network.ip4subnet
        }\nIPv6 adresse: ${system.network.ip6}\nIPv6 subnet mask: ${
          system.network.ip6subnet
        }\nConnection type: ${
          { wireless: "Wireless", wired: "Wired" }[system.network.type]
        }\nSpeed: ${system.network.speed} Mbit/s`;
      },
    };
  } catch (e) {
    handlers.errorHandler("01", "002", e.stack.split("\n"));

    process.exit();
  }
}
