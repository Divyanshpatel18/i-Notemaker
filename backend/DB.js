const mongoose=require('mongoose');
const mongoURI="mongodb+srv://admin:admin@cluster0.aobui4w.mongodb.net/inotebook"
const connectToMongo = async()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("connected to Mongo successfully");
    })
}

module.exports=connectToMongo; //exporting our function