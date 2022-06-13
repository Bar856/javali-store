const mongoose = require("mongoose");
// schema - user 
const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    mail: String,
    password: String
});
const User =mongoose.model("user", userSchema);
// schema - item 
const itemSchema = mongoose.Schema({
    itemName: String,
    itemCategory: String,
    imgUrl:String,
    price: Number
  });
const Item =mongoose.model("item", itemSchema);
module.exports = {
    url: "mongodb://localhost:27017/",
    database: "javaliStore",
    imgBucket: "photos",
    User,
    Item
};