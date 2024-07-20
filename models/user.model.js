const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    timestamp: { 
        type: Date, default: Date.now
    },
    username:{
        type: String,
        trim: true,
    },
    password:{
        type: String,
        trim: true,
    },
    surname:{
        type: String,
        trim: true,
    },
    firstname:{
        type: String,
        trim:true,
    },
    address:{
        type: String,
    },
    email:{
        type: String,
    },
    status:
    {
        type:String,
        default:"Active",
    },   
});
mongoose.model('User', userSchema);
