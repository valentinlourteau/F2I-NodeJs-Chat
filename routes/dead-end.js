const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(404).json({msg: 'Cette requête n’existe pas !'})
})
router.post('/', (req, res) => {
    res.status(404).json({msg: 'Cette requête n’existe pas !'})
})
router.put('/', (req, res) => {
    res.status(404).json({msg: 'Cette requête n’existe pas !'})
})
router.delete('/', (req, res) => {
    res.status(404).json({msg: 'Cette requête n’existe pas !'})
})

module.exports = router;
