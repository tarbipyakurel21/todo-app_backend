const jwt = require("jsonwebtoken");

const authenticate=(req,res,next)=>{

    const token=req.header("Authorization");

    if(!token) return res.status(401).json({error:"Access denied"});


    try{
        // remove bearer prefix from the token

        const tokenWithoutBearer=token.replace("Bearer","");
        const decoded=jwt.verify(tokenWithoutBearer,process.env.JWT_SECRET);
        req.user=decoded;

        next();
    }

    catch(error){

        res.status(400).json({error:"Invalid token"});
    }



};

module.exports=authenticate;