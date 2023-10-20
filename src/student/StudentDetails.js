import { Card, CardContent, Button, Stack, TextField, Typography, List, ListItem,TableRow,TableCell, ListItemText,Autocomplete,Chip} from "@mui/material";
import { useLoaderData, useParams,useNavigate, useFetcher} from "react-router-dom";
import { useState, useEffect } from "react";
import '../Subject.css';


const StudentDetails = () => {
  const navigate= useNavigate();
  const fetcher = useFetcher();
  const data = useLoaderData();
    const studentId = data[0];
    const students=data[1];
    const mark = data[2];
    const allSubjects=data[3];
  const { id } = useParams();
  const [student,setStudent]=useState(null);
  const [subjectss, setSubjectss] = useState([]);

  if (!studentId) {
    return <p>Loading...</p>;
  }

  function mapEnumToInteger(enumValue) {
    switch (enumValue) {
        case "ONE":
            return 1;
        case "TWO":
            return 2;
        case "THREE":
            return 3;
        case "FOUR":
            return 4;
        case "FIVE":
            return 5;
        default:
            return 0; 
    }
}
const handleSubmit = (e) => {
  e.preventDefault();

const subjectIds = subjectss.map(subject => subject.id);
for (const subjectId of subjectIds) {console.log(subjectId)
    const formData = {
  studentId : studentId.id,
  subjectId : subjectId
};
fetcher.submit(formData, {
  method: 'post',
  action: `/studentDetails/${studentId.id}`, 
});

}
};

      return (
        <>
       <Card sx={{display: 'flex', flexDirection:'column', justifyContent: 'space-between', marginLeft:'120px', marginRight:'120px'}}>
       <Button variant="outlined" onClick={() => navigate(-1)}>Nazad</Button> {/* Dugme za povratak unazad */}
            <CardContent key={studentId.id}>
           
            <Typography variant="h4" component="div" sx={{color: 'green'}} >
            {studentId.first_name} {studentId.last_name}
            </Typography>
            <br />
            <Typography variant="h5">
              Predmeti:
             </Typography>
            
          
                                <List sx={{ maxWidth: 400, margin: "0 auto" }}>
  {mark.map((mark) => (
    <ListItem key={mark.id} sx={{ backgroundColor: "#f5f5f5", borderRadius: "4px", marginBottom: "8px", paddingLeft: "16px" }}>
      <ListItemText primary={mark.subject} secondary={mark.marks.map((mark) => mapEnumToInteger(mark.marks)).join(", ")} />
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
    }
export default StudentDetails;