module.exports = {
  type: "command",
  value: run,
  config: {
    aliases: [],
    desc: "test",
    listed: true,
  },
};

const fetch = require("node-fetch");

async function run(system, args) {
  system.RenderState.setBody(["hi aus command"]);

  return;

  system.functions.banner();

  console.log("hier:" + system.apikey);
  const API_TOKEN = system.apikey;
  const PLAYER_TAG = "#QU9LPQQV";

  const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(
    PLAYER_TAG,
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error("API Fehler:", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();

  const crAccount = {
    name: data.name,
    tag: data.tag,
    clan: data.clan,
    role: data.role,
    wins: data.wins,
    losses: data.losses,
    winrate: (data.wins / (data.wins + data.losses)) * 100,
  };

  console.log(crAccount);
}
