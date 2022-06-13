const path = require("path");
const home = (req, res) => {
  return res.sendFile(path.join(`${__dirname}/../routes/admin/adminUpload.html`));
};
module.exports = {
  getHome: home
};