const express = require('express')
const router = express.Router();
const Signup = require('../models/Signup_model')
const bcrypt = require('bcryptjs')
const {registerValidation} = require('../validation/validation')


router.post('/register' , async (req,res) =>{
    //Validation for registration
    const {error} =await registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    
    //checking if email already exist
    const checkEmail = await Signup.findOne({email : req.body.email})
    if(checkEmail) return res.status(400).send('Email already exist')

    //Hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(req.body.password, salt)

    const signup = new Signup({
        email : req.body.email,
        password : hashedpassword
    })
    //Saving Users in database
    try{
        const savedUser = await signup.save();
        const {password , ...data} = savedUser.toJSON()
        res.send(data)
    }
    catch(err){
        res.send(err)
    }

    
})

module.exports = router;