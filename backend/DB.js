const mongoose=require('mongoose');
const mongoURI=""
//mongo URI not public 
const connectToMongo = async()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connected to Mongo successfully");
    })
}

module.exports=connectToMongo; //exporting our function
