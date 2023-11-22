const express = require("express");
const router = express.Router();
const {Parking} = require('../models/empresas')
//crear parking
router.post('/parking', (req,res) =>{
    const user = Parking(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error)=>res.json({message:error}));
});
//obtener parking 
router.get('/parking', (req,res) =>{
    Parking
    .find()
    .populate('nivel','nivel')
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//obtener 1 nivel 
router.get('/parking/:id', (req,res) =>{
    const { id } = req.params;
    Parking
    .findById(id)
    .populate('nivel','nivel')
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//actualizar 
router.put('/parking/:id', (req,res) =>{
    const { id } = req.params;
    const { lugar,nivel,estado } = req.body;
    Parking
    .updateOne({_id:id },{ $set: {lugar,nivel,estado}})
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//eliminar
router.delete('/parking/:id', (req,res) =>{
    const { id } = req.params;
    Parking
    .deleteOne({_id:id })
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});

module.exports = router