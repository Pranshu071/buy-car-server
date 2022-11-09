require("dotenv").config();
const express = require("express");
const Mongoose = require("mongoose");
const router = express.Router();
const Form = Mongoose.model("Form");
const requireLogin = require("../middleware/requireLogin");

  router.post("/contact",requireLogin,(req,res)=>{
      const {email,name,message} = req.body;
      if(!email || !name || !message){
        res.status(422).json({error:"Please add all the details"});
    }
      
    const form = new Form({
                        name,
                        email,
                        message,
                    });
                    form.save()
                    .then(form=>{
                     res.json({message:"Successfully Added",success:true});
                    })
                    .catch(err=>{
                        console.log(err);
                    });

  });


module.exports = router;