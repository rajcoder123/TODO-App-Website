const express = require('express')
var fs = require("fs");
const session = require('express-session')
const app = express();
app.use(express.json());
app.listen(3000, function () {
	console.log("Server is running at port no.  3000");
})
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}))
app.use(express.static("todopublic"));


app.get("/", function (req, res) {
	console.log(req.session.loggedin);
	if (req.session.loggedin) {
		res.sendFile(__dirname + "/todopublic/home.html")
	} else {
		res.redirect("/login.html")
	}
})


app.post("/saveData", function (req, res) {
	fs.readFile("./todos.txt", "utf-8", function (err, todo) {
		if (err) {
			res.end("error");
		} else {
			var allData = [];
			if (todo.length > 0) {
				allData = JSON.parse(todo);
			}
			req.body.name = req.session.name;
			// console.log(req.body);
			allData.push(req.body);
			writeTheFile("./todos.txt",allData,res,"Save todo SuccessFull","Error in saving the Todo");
		}
	})
})
app.get("/getData", function (req, res) {
	fs.readFile("./todos.txt", "utf-8", function (err, todo) {
		if (err) {
			res.end("error");
		} else {
			if (todo.length) {
				todo = JSON.parse(todo);
				var userData = todo.filter(function (user) {
					if (user.name === req.session.name) {
						return true;
					}
				})
				res.end(JSON.stringify(userData));
			} else {
				res.end(JSON.stringify([]));
			}

		}
	})
})

app.post("/saveEditTodo", function (req, res) {
	var newData = req.body;
	console.log(newData)
	fs.readFile("./todos.txt", "utf-8", function (err, data) {
		var allData = JSON.parse(data);
		var len = allData.length;
		for (var i = 0; i < len; i++) {
			if (allData[i].todoId === parseInt(newData.id) && allData[i].name === req.session.name) {
				allData[i].todo = newData.text;
				break;
			}
		}
		console.log("all", allData);
		writeTheFile("./todos.txt",allData,res,"Edit todo SuccessFull","Error in Editing the Todo");
	})
})
app.post("/deleteTodo", function (req, res) {
	var id = req.body.id;
	fs.readFile("./todos.txt", "utf-8", function (err, data) {
		if (data.length) {
			var allData = JSON.parse(data);
			console.log(id);
			var len = allData.length;
			for (var i = 0; i < len; i++) {
				if (allData[i].todoId === parseInt(id) && allData[i].name === req.session.name) {
					allData.splice(i, 1);
					break;
				}
			}
			console.log("all", allData);
			writeTheFile("./todos.txt",allData,res,"Delete todo SuccessFull","Error in Deleting todo");
		} else {
			res.end("No todo Available");
		}
	})


})

app.post("/saveCheck", function (req, res) {
	var newData = req.body;
	console.log(newData.id)
	fs.readFile("./todos.txt", "utf-8", function (err, data) {
		if (data.length) {
			var allData = JSON.parse(data);

			console.log("all", allData);
			allData.forEach(function (elem) {
				if (elem.todoId === parseInt(newData.id) && elem.name === req.session.name) {
					elem.checked = newData.check;
				}
			})

			writeTheFile("./todos.txt",allData,res,"toggled CheckBox","Error in toggle Checkbox");
			
		} else {
			console.log("check nhi hua")
			res.end("No todo Available");
		}
	})

})

function writeTheFile(path,allData,res,resMessage,errMessage){
   fs.writeFile(path, JSON.stringify(allData), function (err) {
				if (err) {
					res.status(404);
					res.end(errMessage);
				}else{
					res.status(200);
					res.end(resMessage)
				}
			})
}


//  server of login page
app.post("/getUsers", function (req, res) {
	var userName = req.body.name;
	var password = req.body.password;
	fileReader(function (err, users) {
		if (err) {
			console.log(err);
		} else {

			var currentUser = users.filter(function (user) {
				if (user.name === userName && user.password === password) {
					return true;
				}
			})
			if (currentUser.length) {
				req.session.name = currentUser[0].name;
				req.session.loggedin = true;
				res.status(200);
				res.end("successfully Login");
			} else {
				res.status(404);
				res.end("login failed");
			}
		}
	})
})
app.post("/saveUser", function (req, res) {
	fileReader(function (err, allUsers) {
		if (err) {
			console.log("error", err);
		} else {
			console.log(req.body);
			var newUser = req.body;

			var flag = true;
			allUsers.forEach(function (elem) {
				if (elem.name === newUser.name) {
					flag = false;
				}
			})
			if (flag) {
				allUsers.push(newUser);
			}
			console.log(allUsers);
			fs.writeFile("./users.txt", JSON.stringify(allUsers), function (err) {
				if (err) {
					res.status(404);
					res.end("Error in saving");
				} else {
					if (flag) {
						res.status(200);
						res.end();
					} else {
						res.status(404);
						res.end("Duplicate Entry not allowed");
					}

				}
			})
		}
	})
})



function fileReader(callback) {
	fs.readFile("./users.txt", "utf-8", function (err, data) {
		if (err) {
			callback(err, null);
		} else {
			if (data.length) {
				var allUsers = JSON.parse(data);
				callback(null, allUsers);
			} else {
				callback(null, []);
			}
		}
	})
}
app.get("/logout", function (req, res) {
	req.session.destroy();
	res.redirect("/");
})