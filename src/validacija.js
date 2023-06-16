//teacher
  export const validateFirstName = (firstName) => {
    if (!firstName) {
      return { valid: false, cause: "First name must be provided." };
    }
    if (firstName.length < 5 || firstName.length > 20) {
      return {
        valid: false,
        cause: "First name must be between 5 and 20 characters long.",
      };
    }
    return { valid: true, cause: "First name" };
  };
  
  export const validateLastName = (lastName) => {
    if (!lastName) {
      return { valid: false, cause: "Last name must be provided." };
    }
    if (lastName.length < 5 || lastName.length > 20) {
      return {
        valid: false,
        cause: "Last name must be between 5 and 20 characters long.",
      };
    }
    return { valid: true, cause: "Last name" };
  };

  export const validateUsername = (username) => {
    if (!username) {
      return { valid: false, cause: "Username must be provided." };
    }
    if (username.length < 5 || username.length > 20) {
      return {
        valid: false,
        cause: "Username must be between 5 and 20 characters long.",
      };
    }
    return { valid: true, cause: "Username" };
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return { valid: false, cause: "Password must be provided." };
    }
    if (password.length < 5) {
      return { valid: false, cause: "Password must have 5 or more characters." };
    }
    return { valid: true, cause: "Password" };
  };
  
  export const validateEmail = (email) => {
    if (!email) {
      return { valid: false, cause: "Email must be provided." };
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, cause: "Email is not valid." };
    }
    return { valid: true, cause: "Email" };
  };
  
  export const validateRepeatedPassword = (password, repeatedPassword) => {
    if (!password) {
      return { valid: false, cause: "Password must be provided." };
    }
    if (password !== repeatedPassword) {
      return { valid: false, cause: "Passwords do not match." };
    }
    return { valid: true, cause: "Password" };
  };

//subject

  export const validateName = (name) => {
    if (!name) {
      return { valid: false, cause: "Name must be provided." };
    }
    if (name.length < 2 || name.length > 30) {
      return {
        valid: false,
        cause: "Name must be between 2 and 30 characters long.",
      };
    }
    return { valid: true, cause: "Name" };
  };
  
  export const validateFond = (fond) => {
    if (!fond) {
      return { valid: false, cause: "Fond must be provided." };
    }
    if (fond > 40) {
      return { valid: false, cause: "Max number of classes is 40." };
    }
    return { valid: true, cause: "Fond" };
  };
  