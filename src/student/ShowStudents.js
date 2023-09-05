import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { lc_match } from "./tekstAlati";
import * as React from "react";
import {
  IconButton,Stack,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,TextField} from "@mui/material";
import { Add, Delete, Edit, InfoOutlined  } from "@mui/icons-material";
import { valid_login } from "../login_logic";

const ShowStudents = () => {
  const students = useLoaderData();
  const [currentStudents, setCurrentStudents] = useState([]);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    setCurrentStudents(
      Array.isArray(students)
        ? students.filter(
            (student) =>
              lc_match(student.first_name, q) ||
              lc_match(student.last_name, q)
          )
        : []
    );
  }, [q, students]);



  return (
    <>
      <Stack direction="column" spacing={1} sx={{ padding: '40px' }}>
        <Stack direction="row" spacing={1}>
          <TextField placeholder="Pretraga..." value={q} onChange={e => setQ(e.target.value)} sx={{ flexGrow: 1 }} />
          {(valid_login([{name: 'ROLE_ADMIN'}])) && <IconButton onClick={() => nav('/student/new')}>
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
              {currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.first_name} {student.last_name}</TableCell>
                  <TableCell>
                    <Stack direction="row">
                    {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={async (e) => {
                        fetcher.submit({}, {
                          method: 'delete',
                          action: `/student/${student.id}`
                        });
                      }}>
                        <Delete />
                      </IconButton>}
                      {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={() => {
                        nav(`/student/${student.id}`);
                      }}>
                        <Edit />
                      </IconButton>}
                      <IconButton onClick={() => {
                        nav(`/studentDetails/${student.id}`)
                        
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
};

export default ShowStudents;
