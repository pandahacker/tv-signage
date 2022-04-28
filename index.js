//start express server
var express = require('express');
const { promises: fs } = require('fs');
var app = express();
var port = process.env.PORT || 3000;

app.get('/slides', async function(req, res) {
    const files = await fs.readdir('./public/slides');
    res.send({
        slides: files,
        amount: files.length
    });
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
