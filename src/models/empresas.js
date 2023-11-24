const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        telefono: {
            type: Number,
            required: true
        },
        imagen: {
            type: String
        }
    }

);

const loginSchema = mongoose.Schema(
    {
        usuario:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required: true
        },
        empresa:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Empresa'
        }
    }
)

loginSchema.pre('save', async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }catch(error){
        next(error)
    }
})

loginSchema.post('save', async function (next){
    try{
        console.log("Called after saving a user")
    }catch(error){
        next(error)
    }
})



const nivelSchema = mongoose.Schema(
    {
        nivel:{
            type: String,
            required:true
        },
        empresa:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Empresa'
        }

    }
);

const parkingSchema = mongoose.Schema(
    {
        lugar:{
            type:String,
        },
        nivel:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Nivel'
        },
        estado:{
            type:Boolean,
        }
    }
)


const Empresa = mongoose.model('Empresa',userSchema);
const Users = mongoose.model('User', loginSchema);
const Nivel = mongoose.model('Nivel',nivelSchema);
const Parking = mongoose.model('Parking', parkingSchema); 
module.exports = {Empresa,Nivel, Parking, Users};
