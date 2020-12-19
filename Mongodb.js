const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017";
const dbname = "empresaViajes";

const connect = (cb) =>{
    MongoClient.connect(url).then((client)=>{
        console.log('Conectado a mongo');
         db  = client.db(dbname);
        cb();
    })
    .catch((err) =>console.log(err));
}

const getKey = (_id)=>{
    return ObjectID(_id);
}

const returnBaseDatos = ()=>{
    return db;
}

module.exports = {returnBaseDatos,connect,getKey};