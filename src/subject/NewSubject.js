import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";
import { Button, Container, Stack, TextField } from "@mui/material";
import { validateName, validateFond } from "../validacija";

const NewSubject = () => {
    const [name, setName] = useState("");
    const [fond, setFond] = useState("");
    const fetcher = useFetcher();
    const nav = useNavigate();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(fetcher.data){
            nav(-1);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (handleValidation()) {
            const formData = {
                name: name,
                fond: fond
            };

            fetcher.submit(formData, {
                method: 'post',
                action: `/subjects/new`
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Stack direction={"column"} spacing={1} sx={{ paddingTop: '40px'}}>
                <TextField
                label="Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                error={!!errors.name}
                helperText={errors.name}/>
                <TextField 
                label="Fond" 
                value={fond} 
                onChange={e => setFond(e.target.value)} 
                error={!!errors.fond}
                helperText={errors.fond}/>
                <Stack direction={"row-reverse"}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default NewSubject;