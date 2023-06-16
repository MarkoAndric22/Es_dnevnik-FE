import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { Button, Container, Stack, TextField } from "@mui/material";
import { validateUsername, validateFirstName, validateLastName, validatePassword, validateEmail, validateRepeatedPassword} from "../validacija";

const NewTeacher = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
  
    const fetcher = useFetcher();
    const nav = useNavigate();
  
    useEffect(() => {
      if (fetcher.data) {
        nav(-1);
      }
    }, [fetcher, nav]);
  
    const handleValidation = () => {
      const usernameValidation = validateUsername(username);
      const firstNameValidation = validateFirstName(firstName);
      const lastNameValidation = validateLastName(lastName);
      const passwordValidation = validatePassword(password);
      const emailValidation = validateEmail(email);
      const repeatedPasswordValidation = validateRepeatedPassword(password, repeatedPassword);
  
      setErrors({
        username: !usernameValidation.valid ? usernameValidation.cause : "",
        firstName: !firstNameValidation.valid ? firstNameValidation.cause : "",
        lastName: !lastNameValidation.valid ? lastNameValidation.cause : "",
        password: !passwordValidation.valid ? passwordValidation.cause : "",
        email: !emailValidation.valid ? emailValidation.cause : "",
        repeatedPassword: !repeatedPasswordValidation.valid ? repeatedPasswordValidation.cause : ""
      });
  
      return (
        usernameValidation.valid &&
        firstNameValidation.valid &&
        lastNameValidation.valid &&
        passwordValidation.valid &&
        emailValidation.valid &&
        repeatedPasswordValidation.valid
      );
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (handleValidation()) {
        const formData = {
          username: username,
          first_name: firstName,
          lastName: lastName,
          password: password,
          repeatedPassword: repeatedPassword,
          role_name: "ROLE_TEACHER",
          email: email,
        };
  
        fetcher.submit(formData, {
          method: "post",
          action: `/teachers/new`,
        });
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Stack direction={"column"} spacing={1} sx={{ paddingTop: "40px" }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Repeat Password"
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            type="password"
            error={!!errors.repeatedPassword}
            helperText={errors.repeatedPassword}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <Stack direction={"row-reverse"}>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  };
  
  export default NewTeacher;
