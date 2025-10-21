const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next) {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Please Login"
        })
    }

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        const user = await UserModel.findOne({
            _id:decode.id
        })
        
        req.user = user;
        next();
    }catch(err){
         res.status(401).json({
            message:"Unauthorized User"
        })
    }
}

module.exports = authMiddleware;
