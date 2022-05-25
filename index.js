//start express server
var express = require('express');
var AdmZip = require("adm-zip");
const fileUpload = require("express-fileupload");
const path = require('path');
var shell = require('shelljs');
const api = require("asposeslidescloud");
require('dotenv').config()
const fs = require('fs');

var app = express();
var port = process.env.PORT || 3000;

const slidesApi = new api.SlidesApi(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

app.use(
  fileUpload()
);

app.get("/upload", (req, res) => {
  //console.log(req.ip);
  ip = req.ip
  ip = ip.slice(7);

  console.log(ip);
  if(ip === process.env.HOME_ || ip === process.env.WORK) {
    res.sendFile(path.join(__dirname, "upload.html"));
  }else{
    res.send("You are not authorized to access this page");
  }  

  });

app.get('/images', (req, res) => {
    const files = fs.readdirSync('./public/slides');
    res.send({
      slides: files,
      amount: files.length
    });
  });

app.use(express.static(path.join(__dirname, 'public')));

app.post("/upload", (req, res) => {

  shell.rm('-rf', './files/*');

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.myFile;
  file.name="input.pptx";
  const path = __dirname + "/files/" + file.name;

  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send({ status: "success", path: path });
  });

  const size = {
    height: 1080,
    width: 1920
  }

  console.log(file);

  const slideShow = fs.createReadStream("files/input.pptx");

  slidesApi.convert(slideShow, api.ExportFormat.Jpeg, null, null, null, null, size).then((response) => {
    console.log(response);
    try {

      shell.rm('-rf', 'public/slides/*');

      var zip = new AdmZip(response.body);

      zip.extractAllTo(/*target path*/ "public/slides", /*overwrite*/ true);

    } catch (err) {
      console.error(err);
    }
  }).catch((error) => {
    console.log(error);
  });
});


app.listen(port, function() {
  console.log('Server started on port ' + port);
});
