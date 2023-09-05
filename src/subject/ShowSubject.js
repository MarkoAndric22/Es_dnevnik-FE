import { useState, useEffect } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { validateName, validateFond } from "../validacija";

const ShowSubject = () => {
  const subject = useLoaderData();
  const [name, setName] = useState("");
  const [fond, setFond] = useState("");
  const [errors, setErrors] = useState({});
  const fetcher = useFetcher();
  const nav = useNavigate();
  const navigate = useNavigate();

  useEffect(() => {
      setName(subject.name || "");
      setFond(subject.fond || "");

  }, [subject]);

 
  useEffect(() => {
    if(fetcher.data){
        nav('/subjects');
    }
}, [fetcher, nav]);

const handleValidation = () => {
  const nameValidation = validateName(name);
  const fondValidation = validateFond(fond);

  setErrors({
    name: !nameValidation.valid ? nameValidation.cause : "",
    fond: !fondValidation.valid ? fondValidation.cause : ""
  });

  return (
    nameValidation.valid &&
    fondValidation.valid
  );
};

  const handleSave =  async () => {
    if (handleValidation()) {
      const updatedData = {
        name: name,
        fond: fond
      };

      fetcher.submit(updatedData, {
        method: 'put',
        action: `/subjects/${subject.id}`
      });
    }
  };
  
  return (
    <Stack direction={"column"} spacing={1} sx={{ paddingLeft: '160px', paddingRight: '160px', paddingTop: '40px' }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>Nazad</Button> {/* Dugme za povratak unazad */}
      <Typography>Id: {subject.id}</Typography>
      <TextField label="Name" value={name} onChange={e => setName(e.target.value)} error={!!errors.name} helperText={errors.name}/>
      <TextField label="Fond" value={fond} onChange={e => setFond(e.target.value)} error={!!errors.fond} helperText={errors.fond}/>
      <Stack direction={"row-reverse"}>
      <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default ShowSubject;