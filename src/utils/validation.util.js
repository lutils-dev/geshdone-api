export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUser = (userData) => {
  const errors = [];

  if (!userData.email) {
    errors.push("Email is required");
  } else if (!validateEmail(userData.email)) {
    errors.push("Invalid email format");
  }

  if (!userData.password) {
    errors.push("Password is required");
  } else if (userData.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return errors;
};
