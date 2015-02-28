var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hireMe');

var Applicant = mongoose.model('Applicant',{
	name:String,
	bio: String,
	skills: [String],
	years: Number,
	why: String
});

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(req, res) {
	res.render('index');
});

// displays a list of applicants
app.get('/applicants', function(req, res){
	Applicant.find(function(err,applicants) {
		console.log('applicants line28',applicants);
		if(err) {
			console.log('cannot find applicants');
		}
		else {
			res.render('applicants', {
				applicants: applicants
			})
		}

	});
	// res.render('applicants',{
	// 	data:data
	// });
});

// app.get('/application-viewer', function(req, res) {

// 	Applicant.find(function(err,applicants) {
		// console.log('applicants line28',applicants);
// 		if(err) {
// 			console.log('cannot find applicants');
// 		}
// 		else {
// 			res.render('applicants', {
// 				applicants: applicants
// 			})
// 		}

// 	});
// 	// res.send('hello');

// });


app.get('/view/:_id',function(req, res) {
	Applicant.findById(req.params.id,function(err,applicant) {
		if(err){
			console.log('cannot find applicants');
		}
		else {
			console.log('applicants id',applicant);
			res.render('application-viewer', {
				theApplicant: applicant
			})
		}
	})
})




// creates and applicant
app.post('/applicant', function(req, res){
	// Here is where you need to get the data
	// from the post body and store it in the database
	console.log('post line 40',req.body);
	// var newApplicant = new Applicant({
	// 	name: req.body.name,
	// 	bio: req.body.bio,
	// 	skills: req.body.skills,
	// 	years: req.body.years,
	// 	why: req.body.why

	// })

	var newApplicant = new Applicant(req.body);


	newApplicant.save(function(err,newApplicant){
		console.log('err',err);
		console.log('newApplicant',newApplicant);
		res.redirect('/applicants');
	});
	
});

app.post('/delete',function(req,res) {
	console.log('delete post',req.body) 
	Applicant.remove({_id: req.body._id},function(err,applicant) {
		if(err) {
			console.log('error',err);
		}
		else {
			return console.log('user deleted',applicant);
		}
	})
	res.redirect('/applicants');
})

var server = app.listen(8441, function() {
	console.log('Express server listening on port ' + server.address().port);
});
