

function start()
{
 var textArea = document.getElementById("textArea")
 textArea.addEventListener("keypress",function(event)
 {
   if(event.key === 'Enter' && textArea.value!=="")
   {
    
    event.preventDefault();
    var taskList = document.getElementById("taskContainer");
    
    var todo = {
      task : textArea.value,
      id : Math.floor(Math.random()*Date.now()),
      isTaskCompleted : false,
      createdBy:null
    }
    
    var request = new XMLHttpRequest();
    request.open("post","/save-todo");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(todo));

    request.addEventListener("load",function()
   {
     var parent = document.createElement("div");
     parent.setAttribute("id",todo.id);
     
     var task = document.createElement("p");
     task.innerHTML = todo.task;

     var checkBtn = document.createElement("button");
     var editBtn = document.createElement("button");
     var deleteBtn = document.createElement("button");

     checkBtn.innerHTML = "Check";
     editBtn.innerHTML = "Edit";
     deleteBtn.innerHTML = "Delete";

     checkBtn.addEventListener("click",checkTodo);
     editBtn.addEventListener("click",editTodo);
     deleteBtn.addEventListener("click",deleteTodo);

     parent.appendChild(task);
     parent.appendChild(checkBtn);
     parent.appendChild(editBtn);
     parent.appendChild(deleteBtn);

     taskList.appendChild(parent);
     textArea.value="";

   })


   }
 })
}

start();

getAllTodosFromServer(function(todos)
{
  todos.forEach(function(todo)
  {
    var taskList = document.getElementById("taskContainer");
    var parent = document.createElement("div");
    parent.setAttribute("id",todo.id);
     
    var task = document.createElement("p");
    task.innerHTML = todo.task;
    
    var checkBtn = document.createElement("button");
    var editBtn = document.createElement("button");
    var deleteBtn = document.createElement("button");

    checkBtn.innerHTML = "Check";
    editBtn.innerHTML = "Edit";
    deleteBtn.innerHTML = "Delete";

    if(todo.isTaskCompleted)
     {
       checkBtn.innerHTML = "Checked"
       task.style.textDecoration="line-through";
     }
     else
     {
       checkBtn.innerHTML = "Check"
       task.style.textDecoration="none";
     }

    checkBtn.addEventListener("click",checkTodo);
    editBtn.addEventListener("click",editTodo);
    deleteBtn.addEventListener("click",deleteTodo);

    parent.appendChild(task);
    parent.appendChild(checkBtn);
    parent.appendChild(editBtn);
    parent.appendChild(deleteBtn);

    taskList.appendChild(parent);
    textArea.value="";
  })
})


function getAllTodosFromServer(callback)
{
  var request = new XMLHttpRequest();
  request.open("get","/get-todo")
  request.send();
  request.addEventListener("load",function()
  {
    var response = request.responseText;
    var todos = [];
    if(response!="")
    {
      todos = JSON.parse(response);
    }
    callback(todos);
  })
}

function checkTodo(event)
{
  var checkBtn = event.target;
  var taskid = checkBtn.parentNode.id;
  var taskName = checkBtn.parentNode.children[0];
  if(checkBtn.innerHTML === "Check")
  {
    taskName.style.textDecoration="line-through";
    checkBtn.innerHTML = "Checked";
  }
  else
  {
    taskName.style.textDecoration="none";
    checkBtn.innerHTML = "Check";
  } 

  updateTodoOnserver(taskid); 
}


function editTodo(event)
{
  var newName = prompt("Edit your task here!");
  if(newName != null)
  {
    var editbtn = event.target;
    var id = editbtn.parentNode.id;
    var oldName = editbtn.parentNode.children[0];
    oldName.innerHTML = newName;
    editTodoFromServer(id,newName);
  }
}

function deleteTodo(event)
{
  var deletebtn = event.target;
  var taskid = deletebtn.parentNode.id;
  var parent = deletebtn.parentNode;
  parent.remove();
  deleteTodoFromServer(taskid);
}

function updateTodoOnserver(todoId)
{
  var request = new XMLHttpRequest();
  request.open("post" , "/check-todo");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify({id:todoId}));

  request.addEventListener("load",function()
  {
    if(request.status === 200)
    {
      console.log("todo is checked!");
    }
    else
    {
      console.log("error occurred!",request.responseText);
    }
  })
}

function editTodoFromServer(todoId,newName)
{
  var request = new XMLHttpRequest();
  request.open("post","/edit-todo");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify({id:todoId,name:newName}));

  request.addEventListener("load",function()
  {
    if(request.status === 200)
    {
      console.log("todo is edited!");
    }
    else
    {
      console.log("error occurred!",request.responseText);
    }
  })
}

function deleteTodoFromServer(todoId)
{
  var request = new XMLHttpRequest();
  request.open("post" , "/delete-todo");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify({id:todoId}));

  request.addEventListener("load",function()
  {
    if(request.status === 200)
    {
      console.log("todo is deleted!");
    }
    else
    {
      console.log("error occurred!",request.responseText);
    }
  })
}



function logout()
{
  
  var request1 = new XMLHttpRequest();
  request1.open("get","/getUserName");
  request1.send()
  request1.addEventListener("load",function()
  {
     var response = JSON.parse(request1.responseText);
     var heading = document.getElementById("header");
     heading.innerHTML = heading.innerHTML +" "+response.name ;
    
  })
  var logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click",function()
  {
    var request = new XMLHttpRequest();
    request.open("get","/logout");
    request.send();
    console.log("123");
    request.addEventListener("load",function()
    {
      console.log("123");
      if(request.status === 200)
      {
        window.location.href = "/";
      }
      else
      {
        console.log("error occurred!",request.responseText);
      }
    })
  })
}
logout();