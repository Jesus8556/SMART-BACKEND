const express = require("express");
const router = express.Router();
const {Users} = require('../models/empresas')
//crear parking
router.post('/users', (req,res) =>{
    const user = Users(req.body);
    user
    .save()
    .then((data) => res.json(data))
    .catch((error)=>res.json({message:error}));
});
//obtener parking 
router.get('/users', (req,res) =>{
    Users
    .find()
    .populate('empresa','nombre')
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//obtener 1 nivel 
router.get('/users/:id', (req,res) =>{
    const { id } = req.params;
    Users
    .findById(id)
    .populate('empresa','nombre')
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//actualizar 
router.put('/users/:id', (req,res) =>{
    const { id } = req.params;
    const { usuario,password,empresa } = req.body;
    Users
    .updateOne({_id:id },{ $set: {usuario,password,empresa}})
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//eliminar
router.delete('/users/:id', (req,res) =>{
    const { id } = req.params;
    Users
    .deleteOne({_id:id })
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});

module.exports = router