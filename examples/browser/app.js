var firebaseUrl = 'https://http://pyro.firebaseio.com'; //Replace with your own firebase url
var fireadmin = new Fireadmin(firebaseUrl);

console.log('fireadmin:', fireadmin);
//Set logged in status when dom is loaded
document.addEventListener("DOMContentLoaded", function(event) {
  setStatus();
});
//Set status styles
function setStatus() {
  var statusEl = document.getElementById("status");
  var logoutButton = document.getElementById("logout-btn");

  if(fireadmin.auth){
    statusEl.innerHTML = "True";
    statusEl.style.color = 'green';
    // statusEl.className = statusEl.className ? ' status-loggedIn' : 'status-loggedIn';
    logoutButton.style.display='inline';
  } else {
    statusEl.innerHTML = "False";
    statusEl.style.color = 'red';
    logoutButton.style.display='none';
  }
}
