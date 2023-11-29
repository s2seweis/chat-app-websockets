const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async(req,res,next) => {
     const {authToken} = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjMyOGQyMWY5Nzc4NWU2YWZiMDQyOSIsImVtYWlsIjoic2ViYXN0aWFuQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoiU2ViYXN0aWFuIiwiaW1hZ2UiOiI4NzY4NzIuanBlZyIsInJlZ2lzdGVyVGltZSI6IjIwMjMtMTEtMjZUMTE6MTU6MzAuOTM0WiIsImlhdCI6MTcwMTIyMzUwOCwiZXhwIjoxNzAxODI4MzA4fQ.VqlKX6IsUshJjMMAdzuE8MkGKA0Eqhqray9-FGckz3E'
     // const {authToken} = req.cookies;
     console.log("line:801", authToken);
     if(authToken){
          const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
          req.myId = deCodeToken.id;
          next();
     }else{
          res.status(400).json({
               error:{
                    errorMessage: ['Please Login First']
               }
          })
     } 
}