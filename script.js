var allTodos=document.getElementById("alltodos");
var btn=document.getElementById("btn");
var textArea=document.getElementById("value");


function createTodo(elem,index,check){
        var containor=document.createElement("div");
        containor.setAttribute("class","containor");

        var contentPara=document.createElement("p");
        contentPara.setAttribute("id","para");
        contentPara.innerHTML=elem;
         
        var line=document.createElement("div");
        line.setAttribute("id",index);
        line.setAttribute("class","lines");
        line.style.display="none";
        containor.appendChild(line);

        var checkBox=document.createElement("input");
        checkBox.setAttribute("id",index);
        checkBox.setAttribute("type","checkbox");
        console.log(checkBox.checked);
        if(check){
          line.style.display="block";
        }else{
          line.style.display="none";
        }
        checkBox.checked=check;
        checkBox.onclick=checking;
        var edit=document.createElement("button");
        edit.innerHTML="Edit";
        edit.setAttribute("id",index)
        edit.setAttribute("class","btns");
        edit.onclick=editNode;

        var deleteBtn=document.createElement("button");
        deleteBtn.setAttribute("id",index);
        deleteBtn.setAttribute("class","deleteBtn");
        deleteBtn.innerHTML="X";
        deleteBtn.onclick=deleteNode;

        containor.appendChild(contentPara);
        containor.appendChild(checkBox);
        containor.appendChild(edit);
        containor.appendChild(deleteBtn);

        return containor; 
}



function checking(e){
var elem=e.target.checked;
var line=e.target.parentNode.children[0];
var id=e.target.id;
 if(elem){
   line.style.display="block";
 }else{
   line.style.display="none";
 }
 var checkObj={id:id,check:elem};
 console.log(checkObj);
 var request=new XMLHttpRequest();
 request.open("post","/saveCheck");
 request.setRequestHeader("Content-type","application/json");
 request.send(JSON.stringify(checkObj));
 request.addEventListener("load",function(){
   console.log("CheckBox Updated ");
 })
}

function editNode(e){
var id =e.target.parentNode.children[2].id;
var parent=e.target.parentNode;
let newTodo = prompt("Edit Your Stuff :");

  if (newTodo.trim()!=='') {

    var editText=newTodo;
    parent.children[1].innerHTML=editText;

    var content={id:id,text:editText};
      var editSave= new XMLHttpRequest();
      editSave.open("post","/saveEditTodo");
      editSave.setRequestHeader("Content-type","application/json");
      editSave.send(JSON.stringify(content));
      editSave.addEventListener("load",function(){
        console.log("Data saved SuccessFully");
      })

}

}



function deleteNode(e){
var elem=e.target.parentNode;
var id1= {id:e.target.id};
console.log(elem,id1,allTodos);
allTodos.removeChild(elem);
var deleteRequest=new XMLHttpRequest();
deleteRequest.open("post","/deleteTodo");
deleteRequest.setRequestHeader("Content-type","application/json");
deleteRequest.send(JSON.stringify(id1));
deleteRequest.addEventListener("load",function(){
 console.log("Deleted");
})

}

btn.addEventListener("click",function(){
    if(textArea.value.trim()!==''){
      var data={ 
        todo: textArea.value ,
        checked:false,
        name:null,
        todoId:Date.now()
        };
      var request=new XMLHttpRequest();
      request.open("post","/saveData");
      request.setRequestHeader("Content-type","application/json");
      request.send(JSON.stringify(data));
      request.addEventListener("load",function(){
          var stuff=createTodo(textArea.value,data.todoId,data.checked)
          allTodos.appendChild(stuff);
          textArea.value="";
      })
     
    }
})
function showData(){
    var getRequest=new XMLHttpRequest();
    getRequest.open("get","/getData");
    getRequest.send();
    getRequest.addEventListener("load",function(){
      if(getRequest.responseText.length){
        var data=JSON.parse(getRequest.responseText);
          console.log(data);
         length=data.length;
         data.forEach(function(elem){
            var stuff=createTodo(elem.todo,elem.todoId,elem.checked)
          allTodos.appendChild(stuff);
         })
      }
    })
}
showData();