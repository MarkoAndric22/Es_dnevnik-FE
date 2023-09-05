import { Card, CardContent, Button, Stack, TextField, Typography, List, ListItem } from "@mui/material";
import { useLoaderData, useParams, useNavigate } from  "react-router-dom";
import '../Subject.css';
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ParentDetails = () => {
    const navigate = useNavigate();
    const students = useLoaderData();
    const [parent, setParent] = useState(null);
     const [loading, setLoading] = useState(true); // Dodali smo stanje za praćenje učitavanja
    const { id} = useParams();

    

    useEffect(() => {
        const fetchStudent = async () => {
          try {
            const response = await fetch(`http://localhost:8080/es_dnevnik/parent/${id}`);
            if (!response.ok) {
                throw new Error("Parent data not available");
            }
            const data = await response.json();
            setParent(data);
          } catch (error) {
            console.error("Error fetching student:", error);
          } finally {
            setLoading(false); 
        }
        };
        fetchStudent();
      }, [id]);

      if (loading) {
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
    
   
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '120px', marginRight: '120px' }}>
            <CardContent>
            <Button variant="outlined" onClick={() => navigate(-1)}>Nazad</Button> {/* Dugme za povratak unazad */}
                <Typography variant="h3" component="div" sx={{ color: 'green' }}>
                    {parent ? `${parent.first_name} ${parent.last_name}` : "Loading..."}
                </Typography>
                <br />
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">
                                    Deca
                                </Typography></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <>
                                <TableRow key={student.name}>
                                    <TableCell colSpan={3} align="center">
                                    <strong>{student.name}</strong>
                                    </TableCell>
                                </TableRow>
                                {student.subjectMarks.map((subjectMark) => (
                                    <TableRow key={`${student.name}-${subjectMark.subject}`}>
                                    <TableCell></TableCell>
                                    <TableCell>{subjectMark.subject}</TableCell>
                                    <TableCell>{subjectMark.marks.map((mark) => mapEnumToInteger(mark.marks)).join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                                </>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
    
    
    }
export default ParentDetails;