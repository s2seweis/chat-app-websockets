// const jwt = require('jsonwebtoken');

// module.exports.authMiddleware = async(req,res,next) => {
//      const {authToken} = req.cookies;
// const authTokenHeader = req.headers.authorization;
//      console.log("line:800", authToken);
//      if(authToken){
//           const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
//           req.myId = deCodeToken.id;
//           next();
//      }else{
//           res.status(400).json({
//                error:{
//                     errorMessage: ['Please Loging First']
//                }
//           })
//      } 
// }

const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
  const authTokenHeader = req.headers.authorization;
  console.log("line:1900",authTokenHeader );

  if (authTokenHeader) {
    // Check if the header starts with 'Bearer'
    if (authTokenHeader.startsWith('Bearer')) {
      const authToken = authTokenHeader.slice(7); // Remove 'Bearer ' to get the token

      try {
        const decodedToken = jwt.verify(authToken, process.env.SECRET);
        req.myId = decodedToken.id;
        next();
      } catch (error) {
        res.status(401).json({
          error: {
            errorMessage: ['Invalid token'],
          },
        });
      }
    } else {
      res.status(401).json({
        error: {
          errorMessage: ['Invalid authorization header format'],
        },
      });
    }
  } else {
    res.status(401).json({
      error: {
        errorMessage: ['Authorization header missing'],
      },
    });
  }
};