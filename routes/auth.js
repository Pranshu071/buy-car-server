require("dotenv").config();
const express = require("express");
const Mongoose = require("mongoose");
const router = express.Router();
const User = Mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

router.post("/signup",(req,res)=>{
  const {name,email,password} = req.body;

  if(!email || !password || !name){
      res.status(422).json({error:"Please add all fields"});
      return
  }
  if(!validator.isEmail(email)){
    res.status(422).json({error:"Invalid Email"});
    return
  }
  User.findOne({email:email},function(err,user){

      if(!err){
        if(user){
             return res.status(422).json({error:"Already Exists"});
           }else{
               bcrypt.hash(password,10,function(err,hash){
                   if(err){
                       console.log(err);
                   }
                   else{
                    const user = new User({
                        name,
                        email,
                        password:hash,
                    });
                    user.save()
                    .then(user=>{
                     res.json({message:"Successfully Added",success:true});
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                   }
               }); 
           }
      }else{
          console.log(err);
      } 
    });
});

  router.post("/signin",(req,res)=>{
      const {email,password} = req.body;
      if(!email || !password){
        res.status(422).json({error:"Please add email or password"});
    }
      User.findOne({email:email})
      .then(foundUser=>{
          if(!foundUser){
            return res.status(422).json({error:"Wrong email or password"});
          }else{
              bcrypt.compare(password,foundUser.password)
              .then(doMatch=>{
                  if(doMatch){
                      const {_id,name,email} = foundUser;
                      const token =jwt.sign({_id:foundUser._id},process.env.JWT_KEY);
                      res.status(200).send({token,user:{_id,name,email},message:"Signed In",success:true});
                  }else{
                    return res.status(422).json({error:"Wrong email or password"});
                  }
              })
              .catch(err=>{
                  console.log(err);
              });
          }

      }).catch(err=>{
          console.log(err);
      });

  });

module.exports = router;