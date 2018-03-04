var express = require('express');
var bodyParser = require("body-parser");
var session = require('cookie-session');

var app = express();

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(session({secret: 'todotopsecret'}))
/* if there is no to do list in the seession,
we create an empty one int eh form of an array*/
.use(function(req, res, next){
	if( typeof(req.session.todolist) == 'undefined'){
		req.session.todolist = [];
	}
	next();
})

/* the todo list and form are displayed */
.get('/todo', function(req, res){
	res.render("page.ejs", {todolist: req.session.todolist});
})

// add item to todolist
.post('/todo/add/', urlencodedParser, function(req, res){
	if(req.body.newtodo != ''){
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
})

// deletes an item from the to do list
.get('/todo/delete/:id', function(req, res){
	if( req.params.id != ''){
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
})

//* redirects to the todolist if the page requested is not found
.use(function(req, res, next){
	res.redirect('/todo');
});

app.listen(8080);