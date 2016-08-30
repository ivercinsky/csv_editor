var express = require("express");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var parse = require('csv-parse');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
app.use( bodyParser.json() ); 
function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done){
    	var source = fs.createReadStream(sourceFilePath);

    	var linesRead = 0;
	
	var parser = parse({
		delimiter: ',', 
		columns:columns
	});
	
	var records = [];

	parser.on("readable", function(){
		var record;
		while (record = parser.read()) {
	    		linesRead++;
			records.push(record);	
			onNewRecord(record);
		}
	});

    parser.on("error", function(error){
        handleError(error)
    });

    parser.on("end", function(){
        done(records);
    });

    source.pipe(parser);
}

app.use(express.static('public'));

app.get("/",function(req,res,next){
	res.redirect("/index.html");
})
app.post('/data_dic', upload.single('file'), function (req, res, next) {
	var filePath = req.file.path;
	console.log(filePath);
	function onNewRecord(record){
		console.log(record);
	}

	function onError(error){
		console.log(error)
	}

	function done(records){
		res.status(200).send(records);
	}

	var columns = true; 
	parseCSVFile(filePath, columns, onNewRecord, onError, done);

});

app.post("/guardar", function(req,res,next) {
   console.log(req.body);
	res.status(200).send("OK");
});
app.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/data/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});
app.listen(3000);
