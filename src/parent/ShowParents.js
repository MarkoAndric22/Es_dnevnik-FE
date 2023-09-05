import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { lc_match } from "./tekstAlati";
import * as React from "react";
import {
  IconButton,Stack,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,TextField,} from "@mui/material";
import { Add, Delete, Edit, InfoOutlined  } from "@mui/icons-material";
import { valid_login } from "../login_logic";
const ShowParents = () => {

    const parents = useLoaderData();
    const [currentParents, setCurrentParents] = useState([]);
    const [q, setQ] = useState("");
    const nav = useNavigate();
    const fetcher = useFetcher();
  
    useEffect(() => {
      setCurrentParents(
        Array.isArray(parents)
          ? parents.filter(
              (parents) =>
                lc_match(parents.first_name, q) ||
                lc_match(parents.last_name, q)
            )
          : []
      );
    }, [q, parents]);
  
  
  
    return (
      <>
        <Stack direction="column" spacing={1} sx={{ padding: '40px' }}>
          <Stack direction="row" spacing={1}>
            <TextField placeholder="Pretraga..." value={q} onChange={e => setQ(e.target.value)} sx={{ flexGrow: 1 }} />
            {(valid_login([{name: 'ROLE_ADMIN'}])) && <IconButton onClick={() => nav('/parent/new')}>
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
                {currentParents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.id}</TableCell>
                    <TableCell>{parent.first_name} {parent.last_name}</TableCell>
                    <TableCell>
                      <Stack direction="row">
                      {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={async (e) => {
                          fetcher.submit({}, {
                            method: 'delete',
                            action: `/parent/${parent.id}`
                          });
                        }}>
                          <Delete />
                        </IconButton>}
                        {(valid_login([{name: 'ROLE_ADMIN'}])) &&  <IconButton onClick={() => {
                          nav(`/parent/${parent.id}`);
                        }}>
                          <Edit />
                        </IconButton>}
                        <IconButton onClick={() => {
                          nav(`/parentDetails/${parent.id}`)
                          
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

export default ShowParents;