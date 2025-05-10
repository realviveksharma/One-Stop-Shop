const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const error_message = document.getElementById('error-message')
error_message.hidden = true;

document.getElementById('loginButton').remove();
document.getElementById('cart').remove();
document.getElementById('shop').href = 'index.html';
document.getElementById('contact').href = 'index.html';
document.getElementById('about').href = 'index.html';

function getErrors(email, password){
    let errors = []
    if(email === '' || email == null){
      errors.push('Email is required')
      email_input.parentElement.classList.add('incorrect')
      error_message.innerText = errors.join(". ");
    }
    if(password === '' || password == null){
      errors.push('Password is required')
      password_input.parentElement.classList.add('incorrect')
      error_message.innerText = errors.join(". ");
    }
    return errors;
}

function getUser(email, password) {
    if(localStorage.getItem('users')){
      let users = JSON.parse(localStorage.getItem('users'));
      let user = users.find(user => user.email === email && user.password === password);
      return user;
    }
    return null;
}

function chalja() {
    let errors =[]
    error_message.hidden = false;
    errors = getErrors(email_input.value, password_input.value)

    if (errors.length === 0) {
        const user = getUser(email_input.value, password_input.value);

        if (!user) {
          errors.push('Invalid login credentials');
          email_input.parentElement.classList.add('incorrect');
          password_input.parentElement.classList.add('incorrect');
          error_message.innerText = errors.join(". ");
        } else {
          localStorage.setItem('curUser', JSON.stringify(user));
          user.cart.length === 0 ? document.cookie = ' ' : document.cookie = user.cart
          window.location.href="./index.html";
        }
      }
}