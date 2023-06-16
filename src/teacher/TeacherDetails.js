import { Card, CardContent, Button, Stack, TextField, Typography, List, ListItem } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import '../Subject.css';

const TeacherDetails = () => {
    const data = useLoaderData();
    const teacher = data[0];
    const subjects = data[1];
   
      return (
        <>
       <Card sx={{display: 'flex', flexDirection:'column', justifyContent: 'space-between', marginLeft:'120px', marginRight:'120px'}}>
            <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Id: {teacher.id}
            </Typography>
            <Typography variant="h3" component="div" sx={{color: 'green'}}>
            {teacher.first_name} {teacher.last_name}
            </Typography>
            <br />
            <Typography variant="h5">
              Predmeti:
             </Typography>
            <List sx={{ maxWidth: 400, margin: "0 auto" }}>
              {subjects.map((subject) => (
              <ListItem key={subject.id} sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
                marginBottom: "8px",
                paddingLeft: "16px",
              }}>{subject.name}</ListItem>
            ))}
            </List>
            
          </CardContent>
        </Card>
        </>
      );
    }
export default TeacherDetails;