import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  List,
  ListItem,
  Chip,
  Autocomplete,
  TextField
} from "@mui/material";
import { useLoaderData, useNavigate, useFetcher } from "react-router-dom";
import '../Subject.css';


const TeacherDetails = () => {
  const data = useLoaderData();
  const teacher = data[0];
  const subjects = data[1];
  const allSubjects = data[2];
  const nav = useNavigate();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [errors, setErrors] = useState({});
  const [first_name, setFirst_Name] = useState("");
  const [name, setName] = useState("");
  const [subjectss, setSubjectss] = useState([]);

  useEffect(() => {
    if (fetcher.data) {
      nav(-1);
    }
  }, [fetcher, nav]);




  const handleSubmit = (e) => {
    e.preventDefault();

const subjectIds = subjectss.map(subject => subject.id);
for (const subjectId of subjectIds) {console.log(subjectId)
      const formData = {
        teacherId : teacher.id,
        subjectId : subjectId
      };

      fetcher.submit(formData, {
        method: 'post',
        action: `/teachersDetails/${teacher.id}`, 
      });
      
}
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginLeft: '120px',
          marginRight: '120px',
        }}
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Nazad
        </Button>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Id: {teacher.id}
          </Typography>
          <Typography variant="h3" component="div" sx={{ color: 'green' }}>
            {teacher.first_name} {teacher.last_name}
          </Typography>
          <br />
          <Typography variant="h5">Predmeti:</Typography>
          <List sx={{ maxWidth: 400, margin: "0 auto" }}>
            {subjects.map((subject) => (
              <ListItem
                key={subject.id}
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  paddingLeft: "16px",
                }}
              >
                {subject.name}
              </ListItem>
            ))}
          </List>
          <Autocomplete
            multiple
            id="subjects-autocomplete"
            options={allSubjects}
            getOptionLabel={(subject) => subject.name}
            value={subjectss}
            onChange={(_, newValue) => setSubjectss(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select subjects"
                variant="outlined"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((subject, index) => (
                <Chip
                  label={subject.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherDetails;
