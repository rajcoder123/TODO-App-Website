const express = require('express')
const app = express()
const port = 3000
var session = require('express-session');
var fs = require("fs");

app.use(express.static("todo"));

app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true
}))

app.get("/",function(req,res)
{
	if(req.session.isLoggedIn)
	{
     res.sendFile(__dirname+"/todo/home.html")
	}
	else
	{
    res.redirect("/login.html")
	}
	
})

function readFile(url,callback)
{
	fs.readFile(url,"utf-8",function(err,data)
	{
		if(err)
		{
			callback(err,null);
		}
		else
		{
			callback(null,data);
		}
	})
}

function writeFile (url,data,callback)
{
	fs.writeFile(url,JSON.stringify(data),function(err)
	{
		if(err)
		{
			console.log("error occurred while writing file!");
		}
		else
		{
			callback();
		}
	})
}


function parseData(data)
{
	var newTodo = [];

	if(data.length>0)
	{
		newTodo = JSON.parse(data);
	}
	return newTodo;
}

app.post("/signupDetails",function(req,res)
{
  readFile( "./db.txt",function(err,data)
	{
		if(err)
		{
			res.status(404);
			res.end("error occurred!");
		}
		else
		{
			var details = [];
			details = parseData(data);
			var checkFind = false;
			for(var i = 0 ; i < details.length; i++)
			{
         if(details[i].email === req.body.email)
				 {
					 
           checkFind = true;
					 res.status(404)
				   res.end("email already exist!");
					 break;
				 }
			}
			if(checkFind === false)
			{
        req.session.user = req.body.name;
				
			  details.push(req.body);
				console.log(details);
			  writeFile( "./db.txt",details,function()
			  {	
				  
				  res.status(200);
				  res.end("signup successfull!");
			  })

		  }
		}
	})
})

app.post("/login",function(req,res)
{
    var email = req.body.email;
	  var password = req.body.password;

	  readFile("./db.txt",function(err,data)
	 {
		 if(err)
		 {
			 res.status(404);
			 res.end("error occurred!");
		 }
		 else
		 {
			  var details = [];
			  details = parseData(data);
				var checkFind = false;
			  for(var i=0;i<details.length;i++)
		    {
          if(details[i].email === email && details[i].password === password)
			    {
				    req.session.isLoggedIn = true;
				    req.session.user = details[i].name;
						console.log(req.session.user);
				    checkFind = true;
				    res.status(200);
				    res.end("logged in successfully!");
						break;
			    }
		    }
		   if(checkFind === false)
		    {
			   res.status(404)
			   res.end("username and password doesn't exist!");
		    }
		  }
    })
})

app.get("/getUserName",function(req,res)
{
	var name = req.session.user;
	console.log(name);
	res.json({name:name});
})

app.get("/logout",function(req,res)
{
	req.session.destroy();
	res.status(200);
	res.end();
})

app.post("/save-todo",function(req,res)
{
	readFile("./todo.txt",function(err,data)
	{
		if(err)
		{
			res.status(404)
			res.end("error occurred while saving todo!");
		}
		else
		{
			var todos = [];
			todos = parseData(data);
			req.body.createdBy = req.session.user;
			let newtodo = req.body;
			todos.push(newtodo);
			
			writeFile("./todo.txt",todos,function()
			{
				res.status(200);
				res.end("todo is saved successfully!");
			})

		}
	})
})

app.get("/get-todo",function(req,res)
{
	readFile("./todo.txt",function(err,data)
	{
		if(err)
		{
			res.status(404);
			res.end("error occurred!");
		}
		else
		{
			var newdata = parseData(data);
			var newtodo = newdata.filter(function(todo)
			{
				if(todo.createdBy === req.session.user)
				{
					return true;
				}
				else
				{
					return false;
				}
			})
      
			res.json(newtodo);
		}
})
})


app.post("/check-todo",function(req,res)
{
	
	readFile("./todo.txt",function(err,data)
	{
		if(err)
		{
			res.status(404)
			res.end("error occurred while saving todo!");
		}
		else
		{
			var updatedTodo = [];

		  updatedTodo = parseData(data);
		  
			updatedTodo.forEach(function(todo)
		  {
        if(todo.id == req.body.id)
			  {
				 
				 todo.isTaskCompleted =! todo.isTaskCompleted;
				 
			  }
		  })
      
			writeFile("./todo.txt",updatedTodo,function()
			{
				res.status(200);
				res.end("todo is updated!");
			})
		}
})
})

app.post("/edit-todo",function(req,res)
{
  readFile("./todo.txt",function(err,data)
	{
		if(err)
		{
			res.status(404)
			res.end("error occurred while saving todo!");
		}
		else
		{
			var editedTodo = [];

		  editedTodo  = parseData(data);

		  for( var i = 0 ; i < editedTodo.length ; i++ )
		  {
			  if(editedTodo[i].id == req.body.id)
			  {
				  todo.task = req.body.name;
			  }
				
		  }

		  writeFile("./todo.txt",editedTodo,function()
			{
				res.status(200);
				res.end("todo is edited!");
			})
		}

})
})

app.post("/delete-todo",function(req,res)
{
	readFile("./todo.txt",function(err,data)
	{
		if(err)
		{
			res.status(404)
			res.end("error occurred while saving todo!");
		}
		else
		{
      var newTodo =[];
		
		  newTodo = parseData(data);

		  for( var i = 0 ; i < newTodo.length ; i++ )
		  {
			  if(newTodo[i].id == req.body.id)
			  {
				  var index = newTodo.indexOf(newTodo[i]);
				  newTodo.splice(index,1);
		  	}
				
		  }
			
			writeFile("./todo.txt",newTodo,function()
			{
				res.status(200);
				res.end("todo is deleted!");
			})
		}
	})
})


app.listen(port, () => {
	console.log(`Authentication app listening at http://localhost:${port}`)
})
