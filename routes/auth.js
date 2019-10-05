const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/signin", async (req, res) => {
  const { name, password } = req.body;
  try {
    const userFound = await User.findOne({ name });
    if (!userFound) {
      throw {
        status: 400,
        msg: "Utilisateur non trouvé"
      };
    }
    if (!userFound.validPassword(password)) {
      throw { status: 400, msg: "Mauvais mot de passe" };
    }
    const token = userFound.generateJwt();

    res.json({
      status: 200,
      msg: `Bienvenu ${userFound.name}`,
      token: token,
      id: userFound._id,
      role: userFound.role
    });
  } catch (err) {
    console.log(err);
    const { status, msg } = err;
    if (status === 400) {
      return res.status(400).json({
        status,
        msg
      });
    }
    res.status(500).json({
      msg: "Erreur interne du serveur"
    });
  }
});
router.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  try {
    const userFound = await User.findOne({ name });
    if (userFound) {
      throw { status: 400, msg: "Veuillez choisir un autre nom" };
    }
  } catch (err) {
    console.log(err);
    const { status, msg } = err;
    if (status === 400) {
      return res.status(400).json({ status, msg });
    }
    return res.status(500).json({
      msg: "Erreur interne du serveur"
    });
  }
  try {
    const role = "member";
    const newUser = new User({ name, role });
    newUser.setPassword(password);
    const userSaved = await newUser.save();
    res.status(201).json({
      status: 201,
      msg: "Utilisateur crée",
      user: userSaved
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Erreur interne du serveur"
    });
  }
});

module.exports = router;
