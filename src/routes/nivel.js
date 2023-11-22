const express = require("express");
const userSchema = require("../models/empresas");
const router = express.Router();
const { Nivel } = require('../models/empresas')
//crear nivel
router.post('/nivel', (req, res) => {
    const user = Nivel(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});
//obtener nivel 
router.get('/nivel', (req, res) => {
    Nivel
        .find()
        .populate('empresa', 'nombre')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//obtener 1 nivel 
router.get('/nivel/:id', (req, res) => {
    const { id } = req.params;
    Nivel
        .findById(id)
        .populate('empresa', 'nombre')
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//actualizar 
router.put('/nivel/:id', (req, res) => {
    const { id } = req.params;
    const { nivel, empresa } = req.body;
    Nivel
        .updateOne({ _id: id }, { $set: { nivel, empresa } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//eliminar
router.delete('/nivel/:id', (req, res) => {
    const { id } = req.params;
    Nivel
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});

module.exports = router