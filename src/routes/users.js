const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Users } = require('../models/empresas')
const jwt = require('jsonwebtoken')
//crear parking
router.post('/register', (req, res) => {
    const user = Users(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.post('/login', async (req, res) => {
    const users = await Users
        .findOne({ usuario: req.body.usuario })
        .populate('empresa', 'nombre')
    console.log(users)
    const eq = bcrypt.compareSync(req.body.password, users.password);
    res.json({ success: 'Login correcto', token: createToken(users) })

})

//obtener parking 
router.get('/users', (req, res) => {
    Users
        .find()
        .populate('empresa', 'nombre')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//obtener 1 nivel 
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    Users
        .findById(id)
        .populate('empresa', 'nombre')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//actualizar 
router.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { usuario, password, empresa } = req.body;
    Users
        .updateOne({ _id: id }, { $set: { usuario, password, empresa } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//eliminar
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    Users
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});

function createToken(user) {
    const payload = {
        user_id: user._id,
        user_empresa: user.empresa
    }
    console.log(payload.user_id)
    console.log(payload.user_empresa)
    return jwt.sign(payload, 'en un lugar de la mancha ')
}

module.exports = router