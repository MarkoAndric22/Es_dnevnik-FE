import { useState, useEffect, useContext } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { lc_match } from "./tekstAlati";
import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Menu, MenuItem } from "@mui/material";
import { valid_login } from "../login_logic";
import { Add, Delete, Edit, InfoOutlined  } from "@mui/icons-material";
import { UserContext } from "../App";


const Subject = () => {
  const subjects = useLoaderData();
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const fetcher = useFetcher();
  const  user  = useContext(UserContext); 
  const teacherId = user.user.id; 
  const [anchorEl, setAnchorEl] = useState(null);
  const [subjects2, setSubjects2] = useState(null);
   
  useEffect(() => {
    setCurrentSubjects(Array.isArray(subjects) ? subjects.filter((subject) => lc_match(subject.name, q)) : []);
  }, [q, subjects]);

  useEffect(() => {

    const fetchSubjects2 = async () => {
      const url2 = `http://localhost:8080/es_dnevnik/subject/teacherDontHave/${teacherId}`;
      const response = await fetch(url2);
      const data = await response.json();
      setSubjects2(data);
    };

    if (subjects2 === null) {
      fetchSubjects2(); 
    }
  }, [subjects2]);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

 return (
    <>
      <Stack direction="column" spacing={1} sx={{ padding: '40px' }}>
        <Stack direction="row" spacing={1}>
          <TextField placeholder="Pretraga..." value={q} onChange={e => setQ(e.target.value)} sx={{ flexGrow: 1 }} />
          {(valid_login([{ name: 'ROLE_ADMIN' }])) &&
              <IconButton onClick={() => nav('/subjects/new')}>
                <Add />
              </IconButton>}
              {(valid_login([{name: 'ROLE_TEACHER'}])) &&
              <>
              
              <IconButton onClick={handleMenuOpen}>
                <Add />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {subjects2 &&
                  subjects2.map((subject) => (
                  <MenuItem key={subject.id} 
                  onClick={async (e) => {
                    fetcher.submit({}, {
                      method: 'post',
                      action: `/subjects/${subject.id}`,
                      params: {
                        teacherId : teacherId,
                        subjectId: subject.id
                        }
                    });
                    window.location.reload();
                  }}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Menu>
            </>}
            
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ime</TableCell>
                {(valid_login([{name: 'ROLE_ADMIN'}, {name: 'ROLE_TEACHER'}])) && <TableCell>Komande</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton onClick={async (e) => {
                        fetcher.submit({}, {
                          method: 'delete',
                          action: `/subjects/${subject.id}`,
                          params: {
                            teacherId : teacherId,
                            subjectId: subject.id
                            }
                        });
                        window.location.reload();
                      }} >
                        <Delete />
                      </IconButton>
                      {(valid_login([{name: 'ROLE_ADMIN'}])) && <IconButton onClick={() => {
                        nav( `/subjects/${subject.id}`);
                      }}>
                        <Edit />
                      </IconButton>}
                      <IconButton onClick={() => {
                        nav(`/subjectsDetails/${subject.id}`)
                        
                      }}>
                        <InfoOutlined  />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
 

export default Subject;

