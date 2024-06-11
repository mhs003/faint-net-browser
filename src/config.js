const config = {};

config.protocol = "fatp://";
// config.dnsBase = "http://localhost:3000"; // with no tailing slash
config.dnsBase = "https://fainted-api-server.fly.dev"; // with no tailing slash
config.servePath = config.dnsBase + "/serve/";
config.tldsPath = config.dnsBase + "/available-tlds/";

module.exports = config;
