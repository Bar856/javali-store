const { exitCode } = require('process');
const mongoose = require("mongoose");
const fs = require('fs');
const ejs = require('ejs');
const PORT = 5000;
const myfunctions =require("../scripts/functions.js")
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const User = require("../config/db").User;
const Item = require("../config/db").Item;
// connect to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/javaliStore");
// check connections
const con = mongoose.connection;
con.on('error',() => console.log("connection error"));
con.once('open',()=>console.log("connected"));
let routes = app => {
  //            requests
  //   gets
  router.get('/',(req,res)=>{
    res.sendFile(__dirname + '/pages/entryPage.html')
  });
  router.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/pages/login.html')
  });
  router.get('/changePassword',(req,res)=>{
    res.sendFile(__dirname + '/pages/changePassword.html')
  });
  router.get('/register',(req,res)=>{
    res.sendFile(__dirname + '/pages/register.html')
  });
  router.get('/store',(req,res)=>{
    try{
      Item.find({},function(err,items){
          res.render('store',{
              itemsList: items
          })
      })
    }catch (err){
      return res.render('userMasseges',{
        message: err
      });
    }
  });
  //post
  router.post('/store',(req,res)=>{
    try{
      selectedCategory = req.body.selectedCategory;
      if (selectedCategory == 'All'){
        Item.find({},function(err,items){
          res.render('store',{
              itemsList: items
          })
        })
      }else{
        Item.find({itemCategory: selectedCategory},function(err,items){
            res.render('store',{
                itemsList: items,
            })
        })
      }
    }catch(err){
      return res.render('userMasseges',{
        message: err
      });
    }
  });
  router.post('/register',(req,res)=>{
    try{
      let firstname = req.body.firstname;
      let lastname = req.body.lastname;
      let mail = req.body.mail;
      let password = req.body.password;
      let userFound = false;
        const getFromDb = async () =>{
          const user = await User.find({mail:mail});
          if (user.length){
            userFound = true
            return res.render('userSignUpMsgs',{
              message: "User with the same mail already existing!"
            });
          }else if(myfunctions.checkValues(firstname,lastname,mail,password)){
            let newUser = new User({
              firstname: firstname,
              lastname: lastname,
              mail: mail,
              password: password
            });
            newUser.save();
            res.sendFile(__dirname + '/pages/login.html')
          }
        }
        getFromDb();
    }catch (err){
      return res.render('userMasseges',{
        message: err
      });
    }
    });
  router.post('/login',(req,res)=>{
    try{
      let mail = req.body.mail;
      let password = req.body.password;
      if (mail == 'admin' && password == 'admin'){
        return res.sendFile(__dirname + '/admin/adminPanel.html')
      }else{
        let userFound = false;
        const getFromDb = async () =>{
          const user = await User.find({mail:mail, password:password});
          if (user.length){
            userFound = true
          }
          userFound ? res.redirect('/store') : res.redirect("/register");
        }
        getFromDb();
      }
    }catch (err){
      return res.render('userMasseges',{
        message: err
      });
    }
  });
  router.post('/changePasswordApi',(req,res)=>{
    try{
      let mail = req.body.mail;
      let password = req.body.password;
      let newPassword = req.body.newPassword;
      let userChanged = false;
      if (newPassword==password){
        return res.render('userMasseges',{
          message: "Old Password and new Password are match"
        });
      }
      User.updateOne({mail:mail,password:password} , {password:newPassword},(err)=>{
        if(err){
          throw err;
        }else{
          userChanged = true;
        }
        if (userChanged){
          return res.render('userMasseges',{
            message: "Password Changed Succesfully"
          });
        }
        else{
          return res.render('userMasseges',{
            message: "User not existing/unknown error"
          });
        }
      }); 
    } catch(err){
        return res.render('userMasseges',{
          message: err
        });
      }    
  });
  // Admin
  router.post('/adminStoreEditor',(req,res)=>{
    try{
      Item.find({},function(err,items){
          res.render('adminStoreEditor',{
              itemsList: items
          })
      })
    }catch(err){
      return res.render('userMasseges',{
        message: err
      });
    }
  });
  router.post('/AdminUsersManager',(req,res)=>{
    try{
      User.find({},function(err,users){
          res.render('AdminUsersManager',{
              usersList: users
          })
      })
    }catch (err){
      return res.render('userMasseges',{
        message: err
      });
    }
  });
  router.post('/deleteApi',(req,res)=>{
    try{
      deleteTable = req.body.deleteTable;
      delArr = req.body.objectIDToDelete;
      newdelArr = delArr.split(',');
      if (deleteTable == 'Items'){
        newdelArr.forEach(item =>{
          Item.deleteOne({_id:item},(err=>{
            if (err){
              return res.render('adminMasseges',{
                message: `Error: ${err}`
              });
            }
            else{
              return res.render('adminMasseges',{
                message: "Item/s Deleted Succesfully"
              });
            }
          }))
        })
      }
      else if (deleteTable == 'Users'){
        newdelArr.forEach(user =>{
          User.deleteOne({_id:user},(err=>{
            if (err){
              return res.render('adminMasseges',{
                message: `Error: ${err}`
              });
            }
            else{
              return res.render('adminMasseges',{
                message: "User/s Deleted Succesfully"
              });
            }
          }))
        })
      }
    }
    catch(error){
      return res.render('adminMasseges',{
        message: `Error: ${error}`
      });
    }
  });
  router.post("/adminUpload", homeController.getHome);
  // uploads
  router.post("/upload", uploadController.uploadFiles);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.download);
  router.get('*',(req,res)=>{
    res.sendFile(__dirname + '/pages/404Page.html')
  });
  return app.use("/", router);
  };
module.exports = routes;