function deleteCookies() {
    let allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++)
        document.cookie = allCookies[i] + "=;expires="
            + new Date(0).toUTCString();
}
const loginbtn = document.getElementById('loginButton');
const userString = localStorage.getItem('curUser');
if(userString){
    loginbtn.innerText = "Log Out";
    loginbtn.href = '#';
    document.getElementById('badge').innerText = document.cookie.split(',')[1].split('=')[1];
} else{
    document.getElementById('cart').remove();
    loginbtn.innerText = "Log In";
    loginbtn.href = 'login.html';
}
loginbtn.addEventListener('click', () => {
    if(userString){
        let users = JSON.parse(localStorage.getItem('users'));
        let user = JSON.parse(userString);
        user.cart = document.cookie;
        const index = users.findIndex(item =>
            item.email === user.email && item.password === user.password
        );
        if (index !== -1) {
            users[index] = user;
        }
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('curUser');
        deleteCookies();
        window.location.reload();
        window.location.href = 'index.html';
    }
})