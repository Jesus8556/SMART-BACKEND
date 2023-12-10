const express = require("express");
const router = express.Router();
const {Parking, Nivel} = require('../models/empresas')
//crear parking
router.post('/parking', async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { lugar, nivel, estado } = req.body;

        // Verificar si se proporcionó el nombre del nivel
        if (!nivel) {
            return res.status(400).json({ message: 'Se requiere el nombre del nivel en el cuerpo de la solicitud.' });
        }

        // Buscar el nivel por nombre para obtener su _id
        const nivelEncontrado = await Nivel.findOne({ nivel: nivel });

        // Verificar si el nivel existe
        if (!nivelEncontrado) {
            return res.status(404).json({ message: 'No se encontró el nivel con el nombre proporcionado.' });
        }

        // Crear un nuevo espacio de estacionamiento con el _id del nivel
        const nuevoParking = new Parking({
            lugar: lugar,
            nivel: nivelEncontrado._id,
            estado: estado
        });

        // Guardar el nuevo espacio de estacionamiento en la base de datos
        const parkingGuardado = await nuevoParking.save();

        res.json(parkingGuardado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//obtener parking 
router.get('/parking', async (req, res) => {
    try {
        const { nivelId } = req.query;

        // Verificar si se proporcionó el ID de nivel en los parámetros de la consulta
        if (nivelId) {
            // Filtrar los espacios de estacionamiento por el ID de nivel
            const data = await Parking.find({ nivel: nivelId }).populate('nivel', 'nivel');
            return res.json(data);
        }

        // Si no se proporciona un nivelId, obtener todos los espacios de estacionamiento
        const data = await Parking.find().populate('nivel', 'nivel');
        return res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
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
router.put('/parking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { lugar, nivel, estado } = req.body;

        // Verificar si se proporciona el nombre del nivel
        if (nivel) {
            // Buscar el nivel por nombre para obtener su _id
            const nivelEncontrado = await Nivel.findOne({ nivel: nivel });

            // Verificar si el nivel existe
            if (!nivelEncontrado) {
                return res.status(404).json({ message: 'No se encontró el nivel con el nombre proporcionado.' });
            }

            // Objeto con los campos a actualizar
            const updateFields = {
                lugar: lugar,
                nivel: nivelEncontrado._id,
                estado: estado
            };

            // Actualizar el espacio de estacionamiento con el nuevo lugar, nivel e estado
            const parkingActualizado = await Parking.findByIdAndUpdate(id, updateFields, { new: true });

            return res.json(parkingActualizado);
        }

        // Si no se proporciona el nombre del nivel, solo actualizar el lugar y el estado
        const parkingActualizado = await Parking.findByIdAndUpdate(id, { lugar: lugar, estado: estado }, { new: true });

        res.json(parkingActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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