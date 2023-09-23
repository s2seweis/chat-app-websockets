const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const console = require('console');
 
// const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`;

// const newImage = require('../../backend/image')

module.exports.userRegister = (req, res) => {

     console.log("line:1", req.body);

     const form = formidable();
     // console.log("line:2", form);

     form.parse(req, async (err, fields, files) => {
          console.log("line:3", fields);
          console.log("line:4", err);
          console.log("line:5", files);

     const {
          userName, email, password,confirmPassword
     } = fields;

     const {image} = files;
     console.log("line:6", files.image.originalFilename);
     const error = [];
     console.log("line:7", error);

     if(!userName){
          error.push('Please provide your user name');
     }
     if(!email){
          error.push('Please provide your Email');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(!password){
          error.push('Please provide your Password');
     }
     if(!confirmPassword){
          error.push('Please provide your confirm Password');
     }
     if(password && confirmPassword && password !== confirmPassword){
          error.push('Your Password and Confirm Password not same');
     }
     if(password && password.length < 6){
          error.push('Please provide password mush be 6 charecter');
     }
     if(Object.keys(files).length === 0){
          error.push('Please provide user image');
     }
     if(error.length > 0){
          console.log("line:9", error.length);
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     } else {
          const getImageName = files.image.originalFilename;
          const randNumber = Math.floor(Math.random() * 99999 );
          const newImageName = randNumber + getImageName;
          console.log("line:200", newImageName);
          files.image.originalFilename = newImageName;

          // const newPath = __dirname + + `../../frontend/public/image/${files.image.originalFilename}`;
          // const newPath = __dirname + `../../frontend/public/image/${files.image.originalFilename}`;
          // const newPath =`../../../frontend/public/image${files.image.originalFilename}`;
          // working !!!
          // const newPath = __dirname + `/controller${files.image.originalFilename}`;
          const newPath = `backend/controller/image/${files.image.originalFilename}`;
          console.log("line:500", newPath);
          // #
          // const newPath =`../controller/image/${files.image.originalFilename}`;
          // const newPath = 'uploads/' + files.image.originalFilename;

          console.log("line:10", newPath);

     try {
          const checkUser = await registerModel.findOne({
               email:email
          });
          console.log("line:15", checkUser);
          if(checkUser) {
               res.status(404).json({
                    error: {
                         errorMessage : ['Your email already exited']
                    }
               })
          }else{
               fs.copyFile(files.image.filepath, newPath, async(error) => {
                    console.log("line:19", error);
                    console.log("line:20", newPath);
                    console.log("line:21", files.image.filepath);
                    if(!error) {
                         const userCreate = await registerModel.create({
                              userName,
                              email,
                              password : await bcrypt.hash(password,10),
                              image: files.image.originalFilename
                         });

                         console.log("line:20", userCreate);

                         const token = jwt.sign({
                              id : userCreate._id,
                              email: userCreate.email,
                              userName: userCreate.userName,
                              image: userCreate.image,
                              registerTime : userCreate.createdAt
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 

const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}

     res.status(201).cookie('authToken',token, options).json({
          successMessage : 'Your Register Successful',token
     })

                          
                    } else {
                         res.status(500).json({
                              error: {
                                   errorMessage : ['Interanl Server Error100']
                              }
                         })
                    }
               })
          }

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage : ['Interanl Server Error200']
               }
          })

           } 

               
          } 
          
     }) // end Formidable  
    
}

module.exports.userLogin = async (req,res) => {
      const error = [];
      const {email,password} = req.body;
      console.log("line:1", req.body);
      if(!email){
          error.push('Please provide your Email');
     }
     if(!password){
          error.push('Please provide your Passowrd');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     }else {

          try{
               const checkUser = await registerModel.findOne({
                    email:email
               }).select('+password');

               if(checkUser){
                    const matchPassword = await bcrypt.compare(password, checkUser.password );

                    if(matchPassword) {
                         const token = jwt.sign({
                              id : checkUser._id,
                              email: checkUser.email,
                              userName: checkUser.userName,
                              image: checkUser.image,
                              registerTime : checkUser.createdAt
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 
      const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}

     res.status(200).cookie('authToken',token, options).json({
          successMessage : 'Your Login Successful',token
     })

                    } else{
                         res.status(400).json({
                              error: {
                                   errorMessage : ['Your Password not Valid']
                              }
                         })
                    }
               } else{
                    res.status(400).json({
                         error: {
                              errorMessage : ['Your Email Not Found']
                         }
                    })
               }
                

          } catch{
               res.status(404).json({
                    error: {
                         errorMessage : ['Internal Sever Error']
                    }
               })

          }
     }

}

module.exports.userLogout = (req,res) => {
     res.status(200).cookie('authToken', '').json({
          success : true
     })
}