function signup()
{
 var signupBtn = document.getElementById("signupBtn");
 if(signupBtn)
 {
   signupBtn.addEventListener("click",function()
   {
     var name = document.getElementById("signupName");
     var email = document.getElementById("signupId");
     var password = document.getElementById("signupPassword");
     var rePassword = document.getElementById("signupRePassword");
     if(name.value && email.value && password.value && rePassword.value)
     {
       var check = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
       if(check.test(email.value) === true)
      {
       if(password.value === rePassword.value)
       {
         addDetailsOnServer(name.value,email.value,password.value);
         console.log(name.value,email.value,password.value);
         
         
       }
       else
       {
         alert("password doesn't match!");
       }
      }
      else
      {
        alert("invalid Email-id! @domain.com is missing!")
      }
     }
     else
     {
       alert("please fill up all details!");
     }
   })
 }
}
signup();

function addDetailsOnServer(signupName,signupUserName,signupPassword)
{
  var details = {
    name : signupName,
    email : signupUserName,
    password : signupPassword
  }

  var request = new XMLHttpRequest();
  request.open("post","/signupDetails");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(details));

  request.addEventListener("load",function()
  {
    if(request.status === 200)
    {
      alert("You Have Registered Successfully!");
      window.location.href = "/";
    }
    else
    {
      alert("user already exist!");
      console.log("signup error occurred",request.responseText);
    }
  })
}

function loggedIn()
{ 
  var loginBtn = document.getElementById("loginBtn");
  if(loginBtn)
  {
    loginBtn.addEventListener("click",function()
    {
      var email = document.getElementById("userId");
      var password = document.getElementById("userPassword");
      if(email.value && password.value)
      { 
        checkLoginDetails(email.value,password.value);
        email.value = "";
        password.value = "";
      }
      else
      {
        alert("Please fill up username and password!");
      }
    })
  }
}
loggedIn();

function checkLoginDetails(userName,userPassword)
{
  var details = {
    email : userName,
    password : userPassword
  }
  var request = new XMLHttpRequest();
  request.open("post","/login");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(details));

  request.addEventListener("load",function()
  {
    if(request.status === 200)
    {
      window.location.href="/";
    }
    else
    {
      alert("email and password doesn't exist!");
      console.log("login failed!",request.responseText);
    }
  })
}