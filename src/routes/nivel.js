const express = require("express");
const userSchema = require("../models/empresas");
const router = express.Router();
const { Nivel, Empresa } = require('../models/empresas')

//crear nivel
router.post('/nivel',async (req, res) => {
    const user = Nivel(req.body);
    user
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});




//obtener nivel 
router.get('/nivel', async (req, res) => {
    try {
        // Obtener el _id de la empresa desde los parámetros de consulta
        const empresaId = req.query.empresaId;

        // Verificar si se proporcionó un ID de empresa en los parámetros de consulta
        if (empresaId) {
            // Verificar si la empresa existe
            const empresaExistente = await Empresa.findById(empresaId);
            if (!empresaExistente) {
                return res.status(404).json({ message: 'No se encontró la empresa con el ID proporcionado.' });
            }

            // Filtrar niveles por el ID de la empresa
            const niveles = await Nivel.find({ empresa: empresaId }).populate('empresa', ['_id', 'nombre']);
            return res.json(niveles);
        }

        // Si no se proporciona un empresaId, obtener todos los niveles
        const niveles = await Nivel.find().populate('empresa', ['_id', 'nombre']);
        res.json(niveles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






//obtener 1 nivel 
router.get('/nivel/:id',async (req, res) => {
    const { id } = req.params;
    Nivel
        .findById(id)
        .populate('empresa', ['_id', 'nombre'])
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});

  
  
//actualizar 
router.put('/nivel/:id',async (req, res) => {
    const { id } = req.params;
    const { nivel, imagen, empresa } = req.body;
    Nivel
        .updateOne({ _id: id }, { $set: { nivel, imagen, empresa } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});
//eliminar
router.delete('/nivel/:id',async (req, res) => {
    const { id } = req.params;
    Nivel
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));

});

module.exports = router