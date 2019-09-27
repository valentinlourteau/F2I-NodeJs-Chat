const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config");

module.exports = {
  setResponseHeaders: (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
      );
    res.header("Access-Control-Allow-Methods", "PUT, DELETE");
    next();
  },
  catchJsonError: (err, req, res, next) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({
        msg: "La requête est mal formulée, l’API n’accepte que du JSON valide"
      });
    }
    next();
  },
  decodeJWT: (req, res, next) => {
    try {
      if (!req.header("Authorization")) {
        throw { status: 401, msg: "Pas de header Authorization" };
      }
      const authorizationParts = req.header("Authorization").split(" ");
      let token = authorizationParts[1];
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          console.log(err)
          throw { status: 401, msg: "Mauvais token" };
        }
        req.token = decodedToken;
      });
      next();
    } catch (err) {
      res.status(401).json({ status: 401, msg: "Mauvaise authentification !" });
    }
  }
};
