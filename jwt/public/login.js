async function login(){
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;
    const res = await fetch("/login",{
        method :"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,password})
    });
    const data = await res.json();
    if (res.ok){
        window.location.href = "dashboard.html"
    }
}