import { Card, CardContent, Grid, TextField, Typography,InputLabel,Select,Chip,Autocomplete } from "@mui/material";
import { useEffect, useState} from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import { validateUsername, validateFirstName, validateLastName, validatePassword, validateEmail, validateRepeatedPassword} from "../validacija";

const NewParent = () =>{

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    
  
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const nav = useNavigate();
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    

    useEffect(() => {
      const fetchStudent = async () => {
        try {
          const response = await fetch(`http://localhost:8080/es_dnevnik/student`);
          const data = await response.json();
          console.log(data)
          setAllStudents(data);
        } catch (error) {
          console.error("Error fetching student:", error);
        }
      };
  
      fetchStudent();
    }, []);  
  
  
    useEffect(() => {
      if (fetcher.data) {
        nav("/parents");
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
          role_name: "ROLE_PARENT",
          email: email,
          students: JSON.stringify(students)
        
        };
        console.log(formData)
        
        fetcher.submit(formData, {
          method: "post",
          action: `/parent/new`,
        });
      }
    };

return(

    <Card style={{maxWidth:450, margin:"0 auto",padding:"20px 5px"}}>
        <CardContent>
        <Button variant="outlined" onClick={() => navigate(-1)}>Nazad</Button> {/* Dugme za povratak unazad */}
            <Typography gutterBottom variant="h5">Create parent</Typography>
            <form>
            <Grid container spacing={1}>
            <Grid xs={12} sm={6} item>
                    <TextField label="Username" 
                    value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
                    placeholder="Enter username" variant="outlined" fullWidth required/>
                </Grid>
                <Grid xs={12} sm={6} item>
                    <TextField label="First name" 
                    value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.first_Name}
            helperText={errors.first_Name}
                    placeholder="Enter first name" variant="outlined" fullWidth required/>
                </Grid>
                <Grid xs={12} sm={6} item>
                    <TextField label="Last name"
                     value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.last_Name}
            helperText={errors.last_Name}
                    placeholder="Enter last name" variant="outlined" fullWidth required/>
                </Grid>
                <Grid xs={12} sm={6} item>
                    <TextField type="password" label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
                    placeholder="Enter password" variant="outlined" fullWidth required/>
                </Grid>
                <Grid xs={12} sm={6} item>
                    <TextField label="Repeat password" 
                     value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            type="password"
            error={!!errors.repeatedPassword}
            helperText={errors.repeatedPassword}
                    placeholder="Enter repeat password" variant="outlined" fullWidth required/>
                </Grid>
                <Grid xs={12} item>
                    <TextField type="email" label="Email"
                     value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
                    placeholder="Enter email" variant="outlined" fullWidth required/>
                </Grid>

                
          <Autocomplete
            multiple
            id="students-autocomplete"
            options={allStudents}
            getOptionLabel={(student) => `${student.first_name} ${student.last_name}`}
            value={students}
            onChange={(_, newValue) => setStudents(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select students"
                variant="outlined"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((student, index) => (
                <Chip
                  label={`${student.first_name} ${student.last_name}`}
                  {...getTagProps({ index })}
                />
              ))
            }
            filterOptions={(options, state) => {
              return options.filter(
                (student) =>
                  student.first_name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  student.last_name.toLowerCase().includes(state.inputValue.toLowerCase())
              );
            }}
          />

  
                <Grid xs={12} item>
                    <Button type="sumbit" variant="contained" color="primary"
                    fullWidth onClick={handleSubmit}>submit</Button>
                </Grid>
            </Grid>
            </form>
        </CardContent>
    </Card>

)
            }

export default NewParent;