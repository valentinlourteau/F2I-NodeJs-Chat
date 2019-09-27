// Please rename this file config.js

module.exports = {
  dbUrl:
  "mongodb+srv://root:root@cluster0-pncfo.mongodb.net/test?retryWrites=true&w=majority",
  jwtSecret: "motus-et-bouche-cousue",
  server: {
    host: "http://locahost",
    port: {
      api: 3000,
      chat: 3001
    }
  }
};
