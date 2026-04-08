// Valider un email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valider un mot de passe (min 6 caractères)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Valider un nom d'utilisateur (3-50 caractères)
export const isValidUsername = (username) => {
  return username && username.trim().length >= 3 && username.trim().length <= 50;
};

// Valider un formulaire d'inscription
export const validateRegisterForm = (username, email, password, confirmPassword) => {
  const errors = [];

  if (!isValidUsername(username)) {
    errors.push('Le nom d\'utilisateur doit contenir entre 3 et 50 caractères.');
  }
  if (!isValidEmail(email)) {
    errors.push('Veuillez entrer un email valide.');
  }
  if (!isValidPassword(password)) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères.');
  }
  if (password !== confirmPassword) {
    errors.push('Les mots de passe ne correspondent pas.');
  }

  return errors;
};

// Valider un formulaire de connexion
export const validateLoginForm = (email, password) => {
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('L\'email est requis.');
  }
  if (!password || !password.trim()) {
    errors.push('Le mot de passe est requis.');
  }

  return errors;
};
