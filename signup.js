var register=document.getElementById("Register");
var result=document.getElementById("success");
register.addEventListener("click",function(){
  var username=document.getElementById("userName");
  var password=document.getElementById("password");

  if(username.value.trim()!=='' && password.value.trim()!==''){

    var obj={
      name:username.value,
      password:password.value
    }

    var request=new XMLHttpRequest();
    request.open("post","/saveUser");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify(obj));
    request.addEventListener("load",function(){
      console.log("Data Saved ");
      if(request.status===200){
       window.location.href="/";
      }else{
         result.style.display="flex";

         setTimeout(function(){
         result.style.display="none";
         window.location.href="/login.html";
         },3000)
      }
    })
    username.value="";
    password.value="";
  }
})