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
		console.log(req.body.newtodo);
	}
	res.redirect('/todo');
})

// deletes an item from the to do list
.get('/todo/delete/:id', function(req, res){
	if( req.params.id != ''){
		req.session.todolist.splice(req.params.id, 1);
		console.log("Delete number" + req.params.id);
	}
	res.redirect('/todo');
})

// to goto page to edit an element of the 
.get('/todo/edit/:id', function(req, res){
	res.render("editPage.ejs", {numTask: req.params.id});
})

//to actually edit the list
.post('/todo/appendedit/:id', urlencodedParser, function(req, res){
	if(req.params.id != ''){
		req.session.todolist[req.params.id] = req.body.editBox;
		console.log('editted list');
	}
	res.redirect('/todo');
})
//to reorder the list
.post('/todo/reorderList/:id', urlencodedParser, function(req, res){
	if(req.params.id != ''){
		temp = req.session.todolist[req.params.id];
		req.session.todolist.splice(req.params.id, 1);
		req.session.todolist.splice(req.body.newposition, 0, temp);
		console.log('Put element ' + req.params.id + ' at position ' + req.body.newposition);
	}
	res.redirect('/todo');
})
//* redirects to the todolist if the page requested is not found
.use(function(req, res, next){
	res.redirect('/todo');
});

app.listen(8080);
