const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const ejs = require('ejs');
const url = dbConfig.url;
const baseUrl = "http://localhost:8080/files/";
const mongoClient = new MongoClient(url);
const mongoose = require("mongoose");
const Item = require("../config/db").Item;
mongoose.connect("mongodb://127.0.0.1:27017/javaliStore");
const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    if (req.file == undefined) {
      return res.render('adminMasseges',{
        message: "You must select a file"
      });
    }
    itemName = req.body.pruductName;
    itemCategory = req.body.itemCategory;
    imgUrl = req.file.filename;
    price = req.body.pruductPrice;
    if (price.length && itemName.length &&!(isNaN(price))){
      console.log(req.file);
      // insert new item to DB
      let newItem = new Item({
        itemName: itemName,
        itemCategory: itemCategory,
        imgUrl: imgUrl,
        price: price
      });
      newItem.save();
      return res.render('adminMasseges',{
        message: "Upload Successful!"
      });
    }else return;
  
  } catch (error) {
    console.log(error);
    return res.render('adminMasseges',{
      message: "Unknown Error"
    });
  }
};
const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");
    const cursor = images.find({});
    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }
    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });
    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const download = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });
    let downloadStream = bucket.openDownloadStreamByName(req.params.name);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });
    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
module.exports = {
  uploadFiles,
  getListFiles,
  download,
  Item
};