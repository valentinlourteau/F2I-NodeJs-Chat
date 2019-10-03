const express = require("express");
const cors = require('cors')
const api = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");

const User = require("./models/user");

const {
  server: { port },
  dbUrl
} = require("./config");
const {
  catchJsonError,
  setResponseHeaders,
  decodeJWT
} = require("./middlewares");

const admin = require("./routes/admin");
const auth = require("./routes/auth");
const deadEnd = require("./routes/dead-end");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "ERROR: CANNOT CONNECT TO MONGO-DB")
);
db.once("open", () => {
  console.log("SUCCESS: CONNECTED TO MONGO-DB");
});

User.estimatedDocumentCount(async (err, count) => {
  if (err) {
    console.error("Count error: ", err);
  }
  if (count === 0) {
    const name = "root";
    const password = "root";
    const role = "admin";
    const firstUser = new User({ name, role });
    firstUser.setPassword(password);
    try {
      const userSaved = await firstUser.save();
      console.log(
        `Le premier utilisateur ${userSaved.name} est enregistré, son mot de passe est ${password}`
      );
    } catch (err) {
      console.log("First user saving error: ", err);
    }
  }
});

api.use(helmet());
api.use(setResponseHeaders);
api.use(cors())
api.use(bodyParser.json());
api.use(catchJsonError);

api.use("/admin", decodeJWT, admin);
api.use("/auth", auth);
api.use("*", deadEnd);

api.listen(port.api, () =>
  console.log(`Serveur lancé sur le port ${port.api}`)
);
