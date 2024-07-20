

    const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/13indubaroda' , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((res)=>{
        console.log("MongoDb Connection Succeeded");
      })
      .catch((err)=> {
      
        console.log("error in DB connection" + err);
    });
require("./models/user.model");





