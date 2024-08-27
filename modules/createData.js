/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

// Imports the systeminformation module which is the source of all the system information.

const sysin = require("systeminformation");

module.exports = createData;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Creates the data that will be shown.

async function createData(system) {
  // Raw system information.

  let sysinf;

  try {
    sysinf = {
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
    sysinf.cpu.load = (await sysin.currentLoad()).currentLoad;
  } catch (e) {
    system.handlers.errorHandler("01", "001", e.stack.split("\n"));

    process.exit();
  }

  // Returns the finished system information.

  try {
    return {
      hasBattery: sysinf.battery.hasBattery,
      system: function () {
        return (
          `Device: ${sysinf.sysinf.model}` +
          "\n" +
          `UUID: ${sysinf.sysinf.uuid}` +
          "\n" +
          `Platform: ${sysinf.os.platform}` +
          "\n" +
          `Distribution: ${sysinf.os.distro}` +
          "\n" +
          `Hostname: ${sysinf.os.hostname}`
        );
      },
      cpu: function () {
        return (
          `CPU: ${sysinf.cpu.manufacturer} ${sysinf.cpu.brand}` +
          "\n" +
          `Sockel: ${sysinf.cpu.socket}` +
          "\n" +
          `Cores: ${sysinf.cpu.cores}` +
          "\n" +
          `Physical: ${sysinf.cpu.physicalCores}` +
          "\n" +
          `Clock rate: ${sysinf.cpu.speed} GHz` +
          "\n" +
          `Load: ${Math.round(sysinf.cpu.load * 100) / 100}%`
        );
      },
      ram: function () {
        let ram =
          `Total: ${
            Math.round((sysinf.memory.total / 1024 / 1024 / 1024) * 100) / 100
          } GB` +
          "\n" +
          `Available: ${
            Math.round((sysinf.memory.free / 1024 / 1024 / 1024) * 100) / 100
          } GB`;

        sysinf.ram.forEach(
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
          `Display device: ${sysinf.graphics.controller.model}` +
          "\n" +
          `Chip manufacturer: ${sysinf.graphics.controller.vendor}` +
          "\n" +
          `VRAM: ${sysinf.graphics.controller.vram} MB` +
          "\n" +
          `Dynamic VRAM: ${
            sysinf.graphics.controller.vramDynamic ? "Yes" : "No"
          }` +
          "\n" +
          `Bus: ${sysinf.graphics.controller.bus}`
        );
      },
      displays: function () {
        let displays = "";

        sysinf.graphics.displays.forEach(
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
                sysinf.graphics.displays.length >
              n
                ? "\n\n"
                : "")
        );

        return displays;
      },
      battery: function () {
        return (
          `Battery charge: ${sysinf.battery.percent}%` +
          "\n" +
          `Charging: ${sysinf.battery.isCharging ? "Yes" : "No"}`
        );
      },
      network: function () {
        return (
          `Standard network interface: ${sysinf.network.iface}` +
          "\n" +
          `Name: ${sysinf.network.ifaceName}` +
          "\n" +
          `MAC adress: ${sysinf.network.mac}` +
          "\n" +
          `DNS suffix: ${
            sysinf.network.dnsSuffix ? sysinf.network.dnsSuffix : "/"
          }` +
          "\n" +
          `IPv4 adress: ${sysinf.network.ip4}` +
          "\n" +
          `IPv4 subnet mask: ${sysinf.network.ip4subnet}` +
          "\n" +
          `IPv6 adresse: ${sysinf.network.ip6}` +
          "\n" +
          `IPv6 subnet mask: ${sysinf.network.ip6subnet}` +
          "\n" +
          `Connection type: ${
            { wireless: "Wireless", wired: "Wired" }[sysinf.network.type]
          }` +
          "\n" +
          `Speed: ${sysinf.network.speed} Mbit/s`
        );
      },
    };
  } catch (e) {
    system.handlers.errorHandler("01", "002", e.stack.split("\n"));

    process.exit();
  }
}
