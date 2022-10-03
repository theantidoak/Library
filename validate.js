(function init() {
  const form = document.getElementById('validation');
  const spans = document.querySelectorAll('.error');
  const inputs = document.querySelectorAll('input');
  const emailInput = document.getElementById('email');
  const emailError = document.querySelector('#email + .error');
  const countryInput = document.getElementById('country');
  const countryError = document.querySelector('#country + .error');
  const zipCodeInput = document.getElementById('zip-code');
  const zipCodeError = document.querySelector('#zip-code + .error');
  const passwordInput = document.getElementById('password');
  const passwordError = document.querySelector('#password + .error');
  const passwordConfirmationInput = document.getElementById('password-confirmation');
  const passwordConfirmationError = document.querySelector('#password-confirmation + .error');

  form.addEventListener('submit', validateForm);
  emailInput.addEventListener('blur', validateEmail);
  countryInput.addEventListener('blur', validateCountry);
  zipCodeInput.addEventListener('blur', valdiateZipCode);
  passwordInput.addEventListener('blur', validatePassword);
  passwordConfirmationInput.addEventListener('input', validateConfirmedPassword);

  function validateForm(event) {
    if (!emailInput.validity.valid) {
      validateEmail();
      event.preventDefault();
    } else if (!countryInput.validity.valid) {
      validateCountry();
      event.preventDefault();
    } else if (!zipCodeInput.validity.valid) {
      valdiateZipCode();
      event.preventDefault();
    } else if (!passwordInput.validity.valid) {
      validatePassword();
      event.preventDefault();
    } else if (!passwordConfirmationInput.validity.valid) {
      validateConfirmedPassword();
      event.preventDefault();
    }
  }
  
  function validateEmail() {
    if (emailInput.validity.valueMissing) {
      displayOneErrorMessage();
      emailError.textContent = "You need to enter an e-mail address.";
    } else if (emailInput.validity.typeMismatch) {
      displayOneErrorMessage();
      emailError.textContent = "Entered value needs to be an e-mail address.";
    } else if (email.validity.tooShort) {
      displayOneErrorMessage();
      emailError.textContent = `Your email should be at least ${emailInput.minLength} characters; you entered ${emailInput.value.length}.`;
    } else if (emailInput.validity.valid) {
      return;
    }
    
    emailError.className = "error active";
  }
  
  function validateCountry() {
    if (countryInput.validity.valueMissing) {
      displayOneErrorMessage();
      countryError.textContent = "You need to enter a country.";
    } else if (countryInput.validity.tooShort) {
      displayOneErrorMessage();
      countryError.textContent = `You country should be at least ${countryInput.minLength} characters; you entered ${countryInput.value.length}.`;
    } else if (countryInput.validity.valid) {
      return;
    }
    
    countryError.className = "error active";
  }
  
  function valdiateZipCode() {
    if (zipCodeInput.validity.valueMissing) {
      displayOneErrorMessage();
      zipCodeError.textContent = "You need to enter a zip code.";
    } else if (zipCodeInput.validity.tooShort) {
      displayOneErrorMessage();
      zipCodeError.textContent = `Your zip code should be at least ${zipCodeInput.minLength} characters; you entered ${zipCodeInput.value.length}.`;
    } else if (zipCodeInput.validity.valid) {
      return;
    }
    
    zipCodeError.className = "error active";
  }
  
  function validatePassword() {
    if (passwordInput.validity.valueMissing) {
      displayOneErrorMessage();
      passwordError.textContent = "You need to enter a password.";
    } else if (passwordInput.validity.tooShort) {
      displayOneErrorMessage();
      passwordError.textContent = `Your password should be at least ${passwordInput.minLength} characters; you entered ${passwordInput.value.length}.`;
    } else if (passwordInput.validity.patternMismatch ) {
      displayOneErrorMessage();
      passwordError.textContent = `Your password must contain at least 1 Uppercase, 1 Lowercase, 1 Number, and one Symbol.`;
    } else if (passwordInput.validity.valid) {
      return;
    }
    
    passwordError.className = "error active";
  }
  
  function validateConfirmedPassword() {
    if (passwordInput.validity.valueMissing) {
      displayOneErrorMessage();
      passwordConfirmationError.textContent = "You need to enter a password.";
    } else if (passwordConfirmationInput.value !== passwordInput.value && passwordInput.value.length > 1) {
      displayOneErrorMessage();
      passwordConfirmationInput.style.outline = '1px solid red';
      passwordConfirmationError.textContent = "Passwords must match.";
    } else if (passwordConfirmationInput.validity.valid) {
      passwordConfirmationInput.style.outline = '1px solid green';
      passwordConfirmationError.textContent = '';
      passwordConfirmationError.classList.remove('active');
      return;
    }
    
    passwordConfirmationError.className = "error active";
  }

  function displayOneErrorMessage() {
    spans.forEach((span) => {
      span.classList.remove('active');
      span.textContent = '';
    })
  }
})();
