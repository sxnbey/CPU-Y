const sysin = require("systeminformation");
const data = {
  system: function () {
    return `Gerät: ${system.system.model}\nUUID: ${system.system.uuid}\nPlattform: ${system.os.platform}\nDistribution: ${system.os.distro}\nHostname: ${system.os.hostname}`;
  },
  cpu: function () {
    return `CPU: ${system.cpu.manufacturer} ${system.cpu.brand}\nSockel: ${
      system.cpu.socket
    }\nKerne: ${system.cpu.cores}\nDavon physisch: ${
      system.cpu.physicalCores
    }\nTaktrate: ${system.cpu.speed} GHz\nAuslastung: ${
      Math.round(system.cpu.load * 100) / 100
    }%`;
  },
  ram: function () {
    let ram = `Insgesamt: ${
      Math.round((system.memory.total / 1024 / 1024 / 1024) * 100) / 100
    } GB\nDavon verfügbar: ${
      Math.round((system.memory.free / 1024 / 1024 / 1024) * 100) / 100
    } GB`;

    system.ram.forEach(
      (i, n) =>
        (ram += `\n\n\nRAM-Stick ${++n}: ${i.bank}\nHersteller: ${
          i.manufacturer
        }\nSeriennummer: ${i.serialNum}\nGröße: ${
          Math.round((i.size / 1024 / 1024 / 1024) * 100) / 100
        } GB\nTyp: ${i.type}\nFormfaktor: ${i.formFactor}\nTaktrate: ${
          i.clockSpeed
        } MHz\nSpannung: ${i.voltageConfigured} V`)
    );

    return ram;
  },
  graphics: function () {
    return `Anzeigegerät: ${
      system.graphics.controller.model
    }\nChip-Hersteller: ${system.graphics.controller.vendor}\nVRAM: ${
      system.graphics.controller.vram
    } MB\nDynamischer VRAM: ${
      system.graphics.controller.vramDynamic ? "Ja" : "Nein"
    }\nBus: ${system.graphics.controller.bus}`;
  },
  displays: function () {
    let displays = "";

    system.graphics.displays.forEach(
      (i, n) =>
        (displays += `Monitor ${++n}: ${i.deviceName}\nModell: ${
          i.model
        }\nHauptmonitor: ${i.main ? "Ja" : "Nein"}\nIntegriert: ${
          i.builtin ? "Ja" : "Nein"
        }\nAngeschlossen über: ${i.connection}\nAuflösung: ${i.resolutionX}x${
          i.resolutionY
        }\nBildwiederholrate: ${i.currentRefreshRate} Hz\n${
          system.graphics.displays.length > n ? "\n\n" : ""
        }`)
    );

    return displays;
  },
  battery: function () {
    return `Akkuladung: ${system.battery.percent}%\nLadend: ${
      system.battery.isCharging ? "Ja" : "Nein"
    }`;
  },
  network: function () {
    return `Standard-Netzwerkinterface: ${system.network.iface}\nName: ${
      system.network.ifaceName
    }\nMAC Adresse: ${system.network.mac}\nDNS-Suffix: ${
      system.network.dnsSuffix ? system.network.dnsSuffix : "/"
    }\nIPv4 Adresse: ${system.network.ip4}\nIPv4 Subnetzmaske: ${
      system.network.ip4subnet
    }\nIPv6 Adresse: ${system.network.ip6}\nIPv6 Subnetzmaske: ${
      system.network.ip6subnet
    }\nVerbindungstyp: ${
      { wireless: "Kabellos", wired: "Kabelgebunden" }[system.network.type]
    }\nGeschwindigkeit: ${system.network.speed} Mbit/s`;
  },
};
let system = {};

// Main.

run();

// Functions.

async function createData() {
  system = {
    cpu: await sysin.cpu(),
    system: await sysin.system(),
    memory: await sysin.mem(),
    ram: await sysin.memLayout(),
    battery: await sysin.battery(),
    os: await sysin.osInfo(),
    network: (await sysin.networkInterfaces()).find((i) => i.default),
    graphics: {
      controller: (await sysin.graphics()).controllers[0],
      displays: (await sysin.graphics()).displays,
    },
  };
  system.cpu.load = (await sysin.currentLoad()).currentLoad;
}

async function run() {
  await createData();

  console.log("-------------------------------------");
  console.log("-----------------CPU-Y---------------");
  console.log("-------------------------------------");
  console.log(data.system());
  console.log("\n");
  console.log("-------------------------------------");
  console.log("---------------Netzwerk--------------");
  console.log("-------------------------------------");
  console.log("\n");
  console.log(data.network());
  console.log("\n");
  console.log("-------------------------------------");
  console.log("------------------CPU----------------");
  console.log("-------------------------------------");
  console.log("\n");
  console.log(data.cpu());
  console.log("\n");
  console.log("-------------------------------------");
  console.log("-----------------RAM-----------------");
  console.log("-------------------------------------");
  console.log("\n");
  console.log(data.ram());
  console.log("\n");
  console.log("-------------------------------------");
  console.log("-------------Anzeigeräte-------------");
  console.log("-------------------------------------");
  console.log("\n");
  console.log(data.graphics());
  console.log("\n");
  console.log("-------------------------------------");
  console.log("-------------Bildschirme-------------");
  console.log("-------------------------------------");
  console.log("\n");
  console.log(data.displays());
  console.log("\n");
  if (system.battery.hasBattery) {
    console.log("-------------------------------------");
    console.log("----------------Akku-----------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.battery());
    console.log("\n");
  }
  console.log("-------------------------------------");
  console.log("-------------------------------------");
  console.log("-------------------------------------");
}
