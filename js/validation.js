const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');
document.getElementById('loginButton').remove();
error_message.hidden = true;

function getSignupFormErrors(firstname, email, password, repeatPassword){
  let errors = []

  if(firstname === '' || firstname == null){
    errors.push('Firstname is required')
    firstname_input.parentElement.classList.add('incorrect')
  }
  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }
  if(password.length < 8){
    errors.push('Password must have at least 8 characters')
    password_input.parentElement.classList.add('incorrect')
  }
  if(password !== repeatPassword){
    errors.push('Password does not match repeated password')
    password_input.parentElement.classList.add('incorrect')
    repeat_password_input.parentElement.classList.add('incorrect')
  }
  
  return errors;
}

const checkUserExistence = (users) => {
  return users.find(user => user.email === email_input.value && user.password === password_input.value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  error_message.hidden = false;
  let errors = []
  errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value)
  if(errors.length !== 0){
    error_message.innerText  = errors.join(". ")
  } else{
    if(localStorage.getItem('users')){
      let users = JSON.parse(localStorage.getItem('users'));
      const user = checkUserExistence(users);
      if (!user){
        const newUser = {
          firstname: firstname_input.value,
          email: email_input.value,
          password: password_input.value,
          cart: ""
        }
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('curUser', JSON.stringify(newUser));
        window.location.href = 'index.html';
      } else{
        errors.push('Account with that email already exists.')
        error_message.innerText = errors.join(". ")
      }
    } else{
      const newUser = {
        firstname: firstname_input.value,
        email: email_input.value,
        password: password_input.value,
        cart: ""
      }
      localStorage.setItem('users', JSON.stringify([newUser]))
      localStorage.setItem('curUser', JSON.stringify(newUser));
      document.cookie = user.cart;
      window.location.href = 'index.html';
    }
  }
});