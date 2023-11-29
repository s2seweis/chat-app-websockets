const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async(req,res,next) => {
     const {authToken} = req.headers;
     console.log("line:800", authToken);
     if(authToken){
          const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
          req.myId = deCodeToken.id;
          next();
     }else{
          res.status(400).json({
               error:{
                    errorMessage: ['Please Loging First']
               }
          })
     } 
}