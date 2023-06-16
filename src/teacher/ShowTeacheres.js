import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { lc_match } from "./tekstAlati";
import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Add, Delete, Edit, InfoOutlined  } from "@mui/icons-material";
import { valid_login } from "../login_logic";

const ShowTeacher = () => {
  const teachers = useLoaderData();
  const [currentTeachers, setCurrentTeachers] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    setCurrentTeachers(Array.isArray(teachers) ? teachers.filter((teacher) => lc_match(teacher.first_name, q)
  || lc_match(teacher.last_name, q)) : []);
  }, [q, teachers]);

  return (
    <>
      <Stack direction="column" spacing={1} sx={{ padding: '40px' }}>
        <Stack direction="row" spacing={1}>
          <TextField placeholder="Pretraga..." value={q} onChange={e => setQ(e.target.value)} sx={{ flexGrow: 1 }} />
          {(valid_login([{name: 'ROLE_ADMIN'}])) && <IconButton onClick={() => nav('/teachers/new')}>
            <Add />
          </IconButton>}
        </Stack>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ime</TableCell>
                <TableCell>Komande</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell>{teacher.first_name} {teacher.last_name}</TableCell>
                  <TableCell>
                    <Stack direction="row">
                    {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={async (e) => {
                        fetcher.submit({}, {
                          method: 'delete',
                          action: `/teachers/${teacher.id}`
                        });
                      }}>
                        <Delete />
                      </IconButton>}
                      {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={() => {
                        nav(`/teachers/${teacher.id}`);
                      }}>
                        <Edit />
                      </IconButton>}
                      <IconButton onClick={() => {
                        nav(`/teachersDetails/${teacher.id}`)
                        
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

export default ShowTeacher;
