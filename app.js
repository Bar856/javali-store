const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./routes");
const bodyParser = require('body-parser');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:false}))
// use & set
app.use('/',express.static('public'))
app.use('/',express.static('scripts'))
app.set('view engine','ejs')
initRoutes(app);
let port = 5000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
module.exports = appDir;