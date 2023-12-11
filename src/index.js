const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mqtt = require('mqtt'); 

require("dotenv").config();
const empresaRoutes = require("./routes/empresa");
const nivelRoutes = require("./routes/nivel");
const parkingRoutes = require("./routes/parking");
const usuarioRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 9000;

app.use(cors())
//middleware
app.use('/public', express.static('public'));

app.use(express.json())
app.use('/api',empresaRoutes);
app.use('/api',nivelRoutes);
app.use('/api',parkingRoutes);
app.use('/api',usuarioRoutes);
app.use('/api',adminRoutes);
app.get('/', (req,res) =>{
    res.send('Hola mundo Api')
});

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a la base de datos');

        // Definir el modelo para la colección "parkings"
        const Parking = mongoose.model('Parkings', new mongoose.Schema({
            lugar: String,
            nivel: mongoose.Schema.Types.ObjectId,
            estado: Boolean
        }), 'parkings');

        // MQTT
        const client = mqtt.connect('mqtt://localhost:1883');

        client.on('connect', () => {
            client.subscribe('test');
        });

        client.on('message', async (topic, message) => {
            console.log(`Mensaje: ${message.toString()}`);
            
            try {
                // Extraer el ID de estacionamiento y el estado desde el mensaje
                const parts = message.toString().split(' ');
                const parkingId = parts[0];
                const newState = parts[1] === 'ocupado' ? false : true;

                // Actualizar el estado correspondiente en la base de datos
                await Parking.findByIdAndUpdate(parkingId, { estado: newState });

                console.log(`Estado actualizado para el estacionamiento ${parkingId}: ${newState}`);
            } catch (error) {
                console.error('Error al procesar el mensaje MQTT:', error);
            }
        });

        client.on('error', (err) => {
            console.log(err);
        });
    })
    .catch((error) => console.error(error));

app.listen(port, () => console.log('Servidor escuchando en ',port))