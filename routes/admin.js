const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", async (req, res) => {
  const { role } = req.token;
  if (role === "admin") {
    try {
      const users = await User.find({}).select("_id name role");
      return res.json({
        status: 200,
        msg: "List de utilisateurs récupérée",
        users
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur"
      });
    }
  }
  return res.status(401).json({
    status: 401,
    msg: "Vous n'êtes pas admin"
  });
});


router.get("/:_id", async (req, res) => {
  const { role, _id } = req.token;
  const userId = req.params._id;
  if (role === "admin" || (role === "member" && _id == userId)) {
    try {
      const user = await User.findById(userId).select("_id name role");
      return res.json({
        status: 200,
        msg: "Utilisateur récupéré",
        user
      });
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur"
      })
    }
  } else {
    return res.status(401).json({
      status: 401,
      msg: "Non autorisé"
    });
  }
});

router.put("/:_id", async (req, res) => {
  const { role, _id, name } = req.token;
  const userId = req.params._id;
  if (role === "admin" || (role === "member" && _id == userId)) {
    try {

      if (typeof req.body.name !== 'undefined') {
        const doublon = await User.find({ name : req.body.name});
        const userCible = await User.findById(userId);
        if (doublon.length > 0 && doublon[0].name !== userCible.name) {
          return res.status(400).json({
            status: 400,
            msg: "Un utilisateur avec ce nom existe déjà"
          })
        }
      }

      // Computing du nouveau rôle
      const newRole = role === "admin" ?
      req.body.role :
      "member";

      const user = await User.findOneAndUpdate({
        _id: userId
      }, {
        name: req.body.name,
        role: newRole
      }, {
        new: true,
        omitUndefined: true
      });

      return res.json({
        status: 200,
        msg: "Utilisateur modifié",
        user
      });
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur"
      })
    }
  } else {
    return res.status(401).json({
      status: 401,
      msg: "Non autorisé"
    });
  }
});


router.delete("/:_id", async (req, res) => {
  const { role, _id } = req.token;
  const userId = req.params._id;
  if (role === "admin" || (role === "member" && _id == userId)) {
    try {
      const user = await User.findByIdAndRemove(userId).select("_id name role");
      if (user != null) {
        return res.json({
          status: 200,
          msg: "Utilisateur supprimé",
          user
        });
      } else {
        return res.json({
          status: 404,
          msg: "Aucun utilisateur avec cet _id"
        })
      }
    }
    catch(err) {
      console.log(err)
      return res.status(500).json({
        status: 500,
        msg: "Erreur interne du serveur"
      })
    }
  } else {
    return res.status(401).json({
      status: 401,
      msg: "Non autorisé"
    });
  }
});

module.exports = router;
