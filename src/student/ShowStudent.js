import React, { useState, useEffect } from "react";
import { Button, Stack, TextField, Typography,MenuItem,Select } from "@mui/material";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import {
  validateFirstName,
  validateLastName,
  validatePassword,
  validateRepeatedPassword,
} from "../validacija";

const ShowStudent = () => {
  const student = useLoaderData();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState(student.first_name || "");
  const [lastName, setLastName] = useState(student.last_name || "");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [email, setEmail] = useState("");
  const [classs, setClasss]= useState([]);
  const [selectedClass, setSelectedClass]= useState(student.classes.name || "");
  const [errors, setErrors] = useState({});
  const fetcher = useFetcher();
  const nav = useNavigate();
  const navigate= useNavigate();

useEffect(() => {
    const getUserById = async (id) => {
      const response = await fetch(`http://localhost:8080/es_dnevnik/admin/${id}`);
      return response.json();
    };
    const fetchUser = async () => {
    const user = await getUserById(student.id);
    setUser(user);
    };

    fetchUser();
  }, [student.id]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPassword(user.password || "");
      setRepeatedPassword(user.password || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (fetcher.data) {
      nav('/students');
    }
  }, [fetcher, nav]);

 
  const handleValidation = () => {
    const firstNameValidation = validateFirstName(firstName);
    const lastNameValidation = validateLastName(lastName);
    const passwordValidation = validatePassword(password);
    const repeatedPasswordValidation = validateRepeatedPassword(
      password,
      repeatedPassword
    );

    setErrors({
      firstName: !firstNameValidation.valid ? firstNameValidation.cause : "",
      lastName: !lastNameValidation.valid ? lastNameValidation.cause : "",
      password: !passwordValidation.valid ? passwordValidation.cause : "",
      repeatedPassword: !repeatedPasswordValidation.valid
        ? repeatedPasswordValidation.cause
        : "",
    });

    return (
      firstNameValidation.valid &&
      lastNameValidation.valid &&
      passwordValidation.valid &&
      repeatedPasswordValidation.valid
    );
  };

  const handleSave = async () => {
    if (handleValidation()) {
      const updatedData = {
        username: username,
        first_name: firstName,
        lastName: lastName,
        password: password,
        repeatedPassword: repeatedPassword,
        role_name: "ROLE_PARENT",
        email: email,
        classs: selectedClass,
      };

      fetcher.submit(updatedData, {
        method: 'put',
        action: `/student/${student.id}`,
       
      });
  }
  };
  useEffect(() => {
    const fetchClass = async () => {
      try {

     
          const response = await fetch(`http://localhost:8080/es_dnevnik/class`);
          
          if (!response.ok) {
              throw new Error("Class data not available");
          }
          const data = await response.json();
          setClasss(data);
        
      } catch (error) {
        console.error("Error fetching class:", error);
      } 
    };

    fetchClass();
}, []);
  return (
    <Stack direction={"column"} spacing={1} sx={{ paddingLeft: '160px', paddingRight: '160px', paddingTop: '40px' }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Nazad</Button> {/* Dugme za povratak unazad */}
      <Typography>Id: {student.id}</Typography>
      <TextField label="Username" value={username} disabled />
      <TextField
        label="First name"
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
      <TextField label="Email" 
      value={email} disabled
       />
       
       <Select
        label="Choose class"
        variant="outlined"
        fullWidth
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)
        }
      >
        <MenuItem value="">
        </MenuItem>
        {classs.map((classItem) => (
          <MenuItem key={classItem.id} value={classItem.name}>
            {classItem.name}
          </MenuItem>
        ))}
      </Select>

      
      <Stack direction={"row-reverse"}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default ShowStudent;
