/* global Fireadmin */
var firebaseUrl = 'https://abode.firebaseio.com/' // Replace with your own firebase url
var app = new Fireadmin(firebaseUrl)

console.log('fireadmin:', app)

// Set logged in status when dom is loaded
document.addEventListener('DOMContentLoaded', function (event) {
  setStatus()
})

// Set status styles
function setStatus () {
  var statusEl = document.getElementById('status')
  var logoutButton = document.getElementById('logout-btn')
  if (app.isAuthorized) {
    statusEl.innerHTML = 'True'
    statusEl.style.color = 'green'
    // statusEl.className = statusEl.className ? ' status-loggedIn' : 'status-loggedIn'
    logoutButton.style.display = 'inline'
  } else {
    statusEl.innerHTML = 'False'
    statusEl.style.color = 'red'
    logoutButton.style.display = 'none'
  }
}

// Login
function login () {
  var email = document.getElementById('login-email').value
  var password = document.getElementById('login-password').value
  app.emailAuth({ email, password }).then(function(res) {
    console.log('succesfully logged in', res)
    setStatus()
  })
}

// Signup
function signup () {
  var email = document.getElementById('signup-email').value
  var username = document.getElementById('signup-username').value
  var password = document.getElementById('signup-password').value
  var name = document.getElementById('signup-name').value
  console.log('calling with:', email, username, password)
  app.signup({ email, username, password, name }).then(function(res) {
    console.log('succesfully logged in', res)
    setStatus()
  })
}

// Logout
function logout () {
  console.log('logout called')
  app.logout().then(function() {
    console.log('succesfully logged out')
    setStatus()
  })
}

// Logout
function providerSignup (provider) {
  console.log('providerSignup called', provider)
  app.signup({ provider }).then(function() {
    console.log('succesfully logged out')

  })
}
