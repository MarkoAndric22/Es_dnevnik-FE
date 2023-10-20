import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio'; // Promenjen import na Radio
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MarkEnum from './MarkEnum';


const Diary = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState();
  const [rating, setRating] = useState('');
  const [selectedStudents, setSelectedStudents] = useState();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [mark,setMark] = useState();
  const MarkOption = [
    { value: MarkEnum.ONE, label: '1' },
    { value: MarkEnum.TWO, label: '2' },
    { value: MarkEnum.THREE, label: '3' },
    { value: MarkEnum.FOUR, label: '4' },
    { value: MarkEnum.FIVE, label: '5' },
  ];
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRating || !selectedStudents || !selectedSubject) {
      alert('Molimo popunite sva polja i izaberite učenike i predmete.');
      return;
    }

    onSubmit({ rating: selectedRating, selectedStudents, selectedSubject });

    setSelectedRating('');
    setSelectedStudents();
    setSelectedSubject();
  };

  const fetchStudentsFromServer = async () => {
    try {
      const response = await fetch('http://localhost:8080/es_dnevnik/student', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: JSON.parse(localStorage.getItem('user')).token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
       else {
        console.error('Greška pri dohvatanju podataka o učenicima');
      }
    } catch (error) {
      console.error('Greška pri dohvatanju podataka o učenicima', error);
    }
  };

  const handleStudentChange = async (studentId) => {
    // Ako je student već izabran, poništite izbor
    if (selectedStudents === studentId) {
      setSelectedStudents(null);
      setSubjects([]); // Resetujte listu predmeta kada se odznači učenik
    } else {
      setSelectedStudents(studentId);
  
      try {
        const response = await fetch(`http://localhost:8080/es_dnevnik/subject/subjectForStudent/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: JSON.parse(localStorage.getItem('user')).token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setSubjects(data); // Postavljanje podataka o predmetima za izabranog učenika u state
        } else {
          console.error('Greška pri dohvatanju podataka o predmetima za izabranog učenika');
        }
      } catch (error) {
        console.error('Greška pri dohvatanju podataka o predmetima za izabranog učenika', error);
      }
    }
  };

useEffect(() => {
    const fetchMark = async () => {
      try {
        if (!selectedRating) {
          return; 
        }

        const response = await fetch(`http://localhost:8080/es_dnevnik/mark/${selectedRating}`);
        
        if (!response.ok) {
            throw new Error("Mark data not available");
        }
        const data = await response.json();
        setMark(data);
      } catch (error) {
        console.error("Error fetching mark:", error);
      } 
    };

    fetchMark();
}, [selectedRating]); 

 

  // Pozivamo funkciju za dohvat učenika kada se komponenta montira
  useEffect(() => {
    fetchStudentsFromServer();
  }, []);


  // Frontend (React)
const sendRating = async () => {
    // Validacija unosa
    if (!selectedRating || !selectedStudents || !selectedSubject) {
      alert('Molimo popunite sva polja i izaberite učenike i predmete.');
      return;
    }
  
  
    try {
        const url = new URL('http://localhost:8080/es_dnevnik/teacher/teacherEvaluatesStudent');
        url.searchParams.append('studentId', selectedStudents);
        url.searchParams.append('markId', mark.id);
        
        url.searchParams.append('subjectId', selectedSubject);
      
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('user')).token,
          },
        };
        
        const response = await fetch(url, requestOptions);
    
        if (response.ok) {
          alert('Ocena uspešno poslata.');
          setRating('');
          setSelectedStudents('');
          setSelectedSubject('');
        } else {
          console.error('Greška pri slanju ocene na server', response);
        }
      } catch (error) {
        console.error('Greška pri slanju ocene na server', error);
      }
    }      
  

  return (
    <Container>
      <h2>Unesite ocenu</h2>
      <form onSubmit={handleSubmit}>

        <Grid container spacing={2}>
          <Grid item xs={12}>
  <Select
    label="Ocena"
    variant="outlined"
    fullWidth
    value={selectedRating}
    onChange={(e) => setSelectedRating(e.target.value)}
  >
    {MarkOption.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</Grid>
          <Grid item xs={12}>
            <FormGroup>
              <label>Izaberite predmete:</label>
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <FormControlLabel
                    control={
                      <Radio
                        value={subject.id}
                        checked={subject.id === selectedSubject}
                        onChange={() => setSelectedSubject(subject.id)}
                      />
                    }
                    label={subject.name}
                  />
                </div>
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <label>Izaberite učenika:</label>
              {students.map((student) => (
                <div key={student.id}>
                  <FormControlLabel
                    control={
                      <Radio
                        value={student.id}
                        checked={student.id === selectedStudents}
                        onChange={() => handleStudentChange(student.id)}
                      />
                    }
                    label={`${student.first_name} ${student.last_name}`}
                  />
                </div>
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={sendRating}>
              Potvrdi ocenu
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Diary;

