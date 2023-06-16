import { Card, CardContent, Typography, List, ListItem } from "@mui/material";
import { useLoaderData } from "react-router-dom";

const SubjectDetails = () => {
  const data = useLoaderData();
  const subject = data[0];
  const teachers = data[1];
 
return (
  <>
 <Card sx={{display: 'flex', flexDirection:'column', justifyContent: 'space-between', marginLeft:'120px', marginRight:'120px'}}>
      <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      Id: {subject.id}
      </Typography>
      <Typography variant="h3" component="div" sx={{color: 'green'}}>
      {subject.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
         Fond: {subject.fond} 
        </Typography>
      <br />
      <Typography variant="h5">
        Profesori:
       </Typography>
      <List sx={{ maxWidth: 400, margin: "0 auto" }}>
        {teachers.map((teacher) => (
        <ListItem key={teacher.id} sx={{
          color: "green",
          borderRadius: "4px",
          marginBottom: "8px",
          paddingLeft: "16px",
        }}>{teacher.first_name} {teacher.last_name}</ListItem>
      ))}
      </List>
      
    </CardContent>
  </Card>
  </>
);
}

export default SubjectDetails;







// const SubjectDetails = ({ subjectId }) => {
// const [subject, setSubject] = useState(null);

// useEffect(() => {
// fetch(`http://localhost:8080/es_dnevnik/subject/${subjectId}`)
//     .then(response => response.json())
//       .then(data => {
//         console.log(data);
//         setSubject(data);
//       })
//       .catch(error => console.error(error));
//   }, [subjectId]);

//   if (!subject) {
//     return <div>Loading...</div>;
//   }

// return (
// <div className="details-container">
// <h2>Ime: {subject.name}</h2>
// <p>Fond: {subject.fond}</p>
// </div>
// );
// };

