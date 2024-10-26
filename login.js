// login.js

// Get the login form and button elements
const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');

// Add an event listener to the login button
loginButton.addEventListener('click', (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the email and password input values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // You can add your own login validation logic here
  // For this example, we'll just assume the login is successful
  if (email && password) {
    // Redirect to the interface.html page
    window.location.href = 'interface.html';
  } else {
    alert('Invalid email or password');
  }
});