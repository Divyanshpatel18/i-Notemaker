const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')
var fetchuser=require('../middleware/fetchuser')

const JWT_SECRET='my$123';

//ROUTE 1
// Create a user using: POST "/api/auth/createuser" doesnt require auth
router.post('/createuser',
// applying validation
   body('name', 'Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'password must be atleast 5 characters').isLength({ min: 5 })

   , async (req, res) => {
      let success=false;
      //if there are errors return bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({success, errors: errors.array() });
      }

      //check whether the useer with this email exists already
      try {
         let user = await User.findOne({ email: req.body.email })
         if (user) {
            return res.status(400).json({ error: "sorry a user with this email already exits" });
         }

         const salt= await bcrypt.genSalt(10);
         const secPass=await bcrypt.hash(req.body.password,salt);
         //create a new user
         user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
         }) 
         //   .then(user=>res.json(user))
         //   .catch(err=>console.log(err))
         //   res.json({error:"please enter a unique value for email"})
         
         const data={
            user:{
               id:user.id
            }
         }
         //creating a token which the existind g user will use for signin
         const authtoken=jwt.sign(data,JWT_SECRET);
         
         success=true;
         res.json({success,authtoken});
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error occured");
      }

   })


   //ROOUTE 2
   // Authenticate a user using: POST "/api/auth/login" no login required
   router.post('/login',
// applying validation
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'password cannot be blank').exists()

   , async (req, res) => {
      let success=false;
      //if there are errors return bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
    //in ideal scnerio getting the email and password of the logined user
      const {email,password}=req.body;
      try {
         let user= await User.findOne({email})
         if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"})
         }
         //first arguement is string that is entered and second is hash which is stored in the database
         const passwordCompare= await bcrypt.compare(password,user.password);
         if(!passwordCompare){
            success=false;
            return res.status(400).json({success,error:"Please try to login with correct credentials"})         
         }
          
         const data={
            user:{
               id:user.id
            }
         }
         const authtoken=jwt.sign(data,JWT_SECRET);
         success=true;
         res.json({success,authtoken})
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error occured");   
      }
   })

   //ROUTE 3
   //get logged in user details using :POST "/api/auth/getuser" login required
   router.post('/getuser' ,fetchuser , async (req, res) => {

   try {
      userId=req.user.id;
      const user=await User.findById(userId).select("-password")
      //getting all the fields except password by accessing through userId fetched from the token
      res.send(user);
   } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error occured");   
   }
})
module.exports = router;