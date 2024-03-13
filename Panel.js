const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

const user = {
  username: 'admin',
  password: 'emin11'
};
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === user.username && password === user.password) {
    message.textContent = 'Kakalandın Emin';
    setTimeout(() => {
      message.textContent = '';
      // Redirect to another page or perform some action
    }, 2000);
  } else {
    message.textContent = 'Invalid credentials!';
  }
});
