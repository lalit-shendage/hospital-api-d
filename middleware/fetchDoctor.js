require('dotenv').config();
const { request } = require('express');
var jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchDoctor=(req, res, next)=>{
    // get the user from jwt token
    const token =req.header('auth-token');
    if (!token){
        res.status(401).send({error:"doctor not logged in"})
    }
    try {
        const data =jwt.verify(token,JWT_SECRET);
    request.doctor=data.doctor;
    next();
    } catch (error) {
        res.status(401).send({error:"user not logged in"})
    }
    
}

module.exports=fetchDoctor