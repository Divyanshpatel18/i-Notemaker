const mongoose=require('mongoose');
const {Schema}=mongoose
const UserSchema=new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now
        // don't call the now() ,it will be called only when the function will run
    }

});
const User=mongoose.model('user',UserSchema);
User.createIndexes();
module.exports=User;
//converting the schema into model,user is model name,then schema is passed