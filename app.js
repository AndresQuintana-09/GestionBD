const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const Task = require('./task');
const Joi = require('joi');
const db = require("./Mongodb");
const collection = "empresa";
const app = express();


const schema = Joi.object().keys({
    empresa : Joi.string().required()
});

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/consultar',(req,res)=>{
    db.returnBaseDatos().collection(collection).find({}).toArray((err,resultado)=>{
        if(err)
            console.log(err);
        else{
            res.json(resultado);
        }
    });
});

app.put('/:id',(req,res)=>{
    const empresaID = req.params.id;
    const userInput = req.body;
    db.returnBaseDatos().collection(collection).findOneAndUpdate({_id : db.getKey(empresaID)},{$set : {empresa : userInput.empresa}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.json(result);
        }      
    });
});


app.post('/',(req,res,next)=>{
    const userInput = req.body;
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Campos invalidos");
            error.status = 400;
            next(error);
        }
        else{
            db.returnBaseDatos().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Fallo de insercion");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({result : result, document : result.ops[0],error : null});
            });
        }
    })    
});



app.delete('/:id',(req,res)=>{
    const empresaID = req.params.id;
    db.returnBaseDatos().collection(collection).findOneAndDelete({_id : db.getKey(empresaID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});

app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error : {
            message : err.message
        }
    });
})

async function conectar() {
    await db.connect(function(err){
      if(err){
        console.log('err')
        return
      }
      console.log('Conectado a mongo')
    })
}

conectar();
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () =>{
    console.log(`Mi app corriendo en el puerto ${app.get('port')}`);
})

