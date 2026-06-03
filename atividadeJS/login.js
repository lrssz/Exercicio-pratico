function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400); 
  }, 3000);
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('error-box');

    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;

    errorBox.style.display = 'none';

    if (!emailVal || !passwordVal) {
      errorBox.textContent = 'Por favor, preencha todos os campos.';
      errorBox.style.display = 'block';
      return;
    }

    if (emailVal === 'admin' && passwordVal === 'admin') {
      sessionStorage.setItem('token', 'jwt123');
      showToast('Login realizado com sucesso! Redirecionando...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      errorBox.textContent = 'E-mail ou senha inválidos. Tente usar "admin".';
      errorBox.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const errorBox = document.getElementById('error-box');

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;

    errorBox.style.display = 'none';

    if (!nameVal || !emailVal || !passwordVal) {
      errorBox.textContent = 'Por favor, preencha todos os campos.';
      errorBox.style.display = 'block';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      errorBox.textContent = 'Por favor, insira um e-mail válido.';
      errorBox.style.display = 'block';
      emailInput.focus();
      return;
    }

    if (passwordVal.length < 5) {
      errorBox.textContent = 'A senha deve possuir pelo menos 5 caracteres.';
      errorBox.style.display = 'block';
      passwordInput.focus();
      return;
    }

    showToast('Conta criada com sucesso! Redirecionando para o login...', 'success');
    
    sessionStorage.setItem('registeredName', nameVal);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });
}
