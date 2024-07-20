const express = require('express');
var md5 = require('md5');
const app = express();
var router = express.Router();
const mongoose = require('mongoose');
const { response } = require('express');
const User = mongoose.model('User');
var _username = "";

router.get('/', (req, res) => {
    try {
       res.render("login", {
                layout: '',
                pageTitle: "",
                appversion: req.app.locals.appversion,
            });
        
        }
        catch (e) {
        res.render("erorrpage", {  errormessage: e.stack});
    }
});
router.get('/login', (req, res) => {
    try {

        console.log("============== LOGINPAGE from /login ============");
        res.render("login", {
            layout: '',
            pageTitle: "",
            user: req.app.locals.user,
            pwd: req.app.locals.pwd,
            appversion: req.app.locals.appversion,
        });
    }
    catch (e) {
        res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
});

router.post('/login', async function (req, res) {
            console.log("------------------" + req.body.username+"   ");
    var user =await User.findOne({ username: req.body.username.toLowerCase(), password: req.body.password });
    if(!user)
    {
        res.render('login', {layout: ''});
    }
    else
    {                console.log("---- wc page ---");
                res.redirect("wc");
    }   
});
router.get('/wc', async (req, res) => {
            console.log("welcome page  ");
            try {
                res.render("welcome", {layout:""});
            }
        catch (e) {
        res.render("erorrpage", { layout: '', errormessage: e.stack, });
    }
});
//------ update  or Delete user
router.post("/delete_update_user", async (req, res) => {
    try {
  
      var operation = req.body.operation;
      var userid = req.body.userid;
     
      if (operation == "delete") {
        try {
            var userobj = await User.deleteOne({ _id: userid });
                
          res.send("success");
        }
        catch (err) {
          res.send("Fail");
        }
  
      }
      else if (operation == "update") {
        try {

          res.send("success");
        }
        catch (err) {
          res.send("Fail");
        }
      }
  
    }
    catch (e) {
      
      res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
  });
router.get('/logout', async (req, res) => {
    try {
        res.redirect('/');
    }
    catch (e) {
        res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
});

router.get('/addUser', async (req, res) => {
    console.log("---------- Add user -------------");
    try {
                res.render('addUser',
                    {
                        layout: "",
                        pageTitle: "Add New User",
                        
                    });
    }
    catch (e) {
        res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
});

router.post('/addUser', async (req, res) => {
   try
   {
        if(req.body.uid=="")
        {
            insertUser(req,res);
        }
        else
        {
            updateUser(req,res);
        }
        res.redirect("/wc");
   }
   catch(e){
    console.log("error--")
   }
});


router.post('/addUser/:id', async (req, res) => {
    try
    {
         if(req.body.uid=="")
         {
             insertUser(req,res);
         }
         else
         {
             updateUser(req,res);
         }
         res.redirect("/wc");
    }
    catch(e){
     console.log("error--")
    }
 });
 
router.get('/addUser/:id', async (req, res) => {
    try {
        console.log("-------edit  ----"+req.params.id);
       var user =await User.findById(req.params.id);

        
        res.render('addUser',
            {
                layout: "",
                pageTitle: "Add New User",
                user:user,
            });
    }
    catch (e) {
        res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
});
async function insertUser(req, res) {
    try {

        // check user already exist
        var usr = new RegExp(["^", req.body.username.trim(), "$"].join(""), "i");
        var cnt = await User.countDocuments({ username: usr });
        if (cnt == 0) {
            var user = new User();
            user.username = req.body.username.toLowerCase();
            user.password = req.body.password.toLowerCase();
            user.surname = req.body.surname.toLowerCase();
            user.firstname = req.body.firstname.toLowerCase();
            user.email = req.body.email;
            user.address = req.body.address;
            await user.save()
            .then(function (models) {
                res.redirect("login");
            })
            .catch(function (err) {
            console.log(err);
            })
        }
        else {
            console.log("user Already exist");
        }
    }
    catch (e) {
        res.render("erorrpage", { layout: '', errormessage: e.stack, });
    }
}

async function updateUser(req, res) {

            var user = await User.findOne({"_id":req.body.uid});
            user.username=req.body.username;
            user.password=req.body.password;
            user.firstname=req.body.firstname;
            user.surname=req.body.surname;
            user.address=req.body.address;
            user.email=req.body.email;
            await user.save();
}

router.get('/list', async (req, res) => {
    try {

        //find({username:{$not:{$in:['admin','0bsoft']}}})
        var docs= await User.find({ username: { $not: { $in: ['admin', '0bsoft'] } } }, null, { sort: { status: 1, 'firstname': 1 } })
                        
        res.render("list", {
            layout: "",
            pageTitle: "User List",
            users: docs,
            
        });

    }
    catch (e) {
        res.render("erorrpage", { layout: 'mainlayout.hbs', errormessage: e.stack, });
    }
});

module.exports = router;
