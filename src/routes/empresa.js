const express = require("express");
const router = express.Router();
const { Empresa, Nivel } = require('../models/empresas');
const { subirImagen } = require("../models/Storage");
//crear empresa
router.post('/empresa',subirImagen.single('imagen'), async (req,res) =>{
    const { nombre, email,telefono, imagen } = req.body;
    const imagenUrl = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const user = Empresa({ nombre, email, telefono, imagen: imagenUrl });
    user
    .save()
    .then((data) => res.json(data))
    .catch((error)=>res.json({message:error}));
});

//obtener empresas 
router.get('/empresa',async (req,res) =>{
    Empresa
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//obtener 1 empresa 
router.get('/empresa/:id', (req,res) =>{
    const { id } = req.params;
    Empresa
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//actualizar 
router.put('/empresa/:id', (req,res) =>{
    const { id } = req.params;
    const { nombre,email,telefono } = req.body;
    Empresa
    .updateOne({_id:id },{ $set: {nombre, email, telefono}})
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});
//eliminar
router.delete('/empresa/:id', (req,res) =>{
    const { id } = req.params;
    Empresa
    .deleteOne({_id:id })
    .then((data) => res.json(data))
    .catch((error) => res.json({message:error}));
    
});

module.exports = router