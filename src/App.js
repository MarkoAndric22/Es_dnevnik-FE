import { NavLink, Outlet,useNavigate} from "react-router-dom";
import { AppBar, Box, Divider, Drawer, IconButton, Stack, Toolbar, Typography, Button, createTheme, ThemeProvider, CssBaseline, FormGroup, FormControlLabel, Switch} from "@mui/material";
import { ChevronLeft, Menu } from "@mui/icons-material";
import { createContext, useMemo, useState,useEffect} from "react";
import { prvo_veliko } from "./teacher/tekstAlati";
import { useLogin } from "./login_logic";
import LoginControl from "./LoginControl";
import jwt_decode from "jwt-decode";



const create_palette = (mode) => {
  let r = {};
  if(mode === 'light'){
    r = {
      mode: mode,
      primary: {
        main: "#009127"
      },
      divider: "#00300d",
      text: {
        primary: "#00000",
        secondary: "#424242"
      }
    }
  }else{
    r = {
      mode: mode,
      primary: {
        main: "#e68e00"
      },
      divider: "#663f00",
      text: {
        primary: "#EEEEEE",
        secondary: "#A0A0A0"
      }
    }
  }
  return {
    palette: r
  }
}

export const UserContext = createContext(null);

function App() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme(create_palette(mode)), [mode]);
  const [user, login, logout] = useLogin();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const checkTokenExpiration = () => {
  //     const token = localStorage.getItem("user").token;
  
  //     if (token) {
  //       try {
  //         const decodedToken = jwt_decode(token);
  //         console.log("Decoded token:", decodedToken);
  //         const currentTime = Math.floor(Date.now() / 1000);
  //         if (decodedToken.exp < currentTime) {
  //           logout();
  //           navigate("/login");
  //         }
  //       } catch (error) {
  //         console.error("Error decoding token:", error);
  //       }
  //     }
  //   };
  
  //   const interval = setInterval(checkTokenExpiration, 60000);
  
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [navigate]);
  


  return <>
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{user, login, logout}}>
      <CssBaseline/>
      <Stack direction="column">
        <AppBar sx={{ height: "60px", flexDirection: "row" }}>
          <Toolbar>
            <IconButton
              onClick={e => {
                setOtvoreno(!otvoreno);
              }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', lineHeight: 2.5 }}>es_dnevnik  </Typography>
          <Typography sx={{lineHeight: 2.5, paddingRight: "30px"}}>{(user) ? `Zdravo ${user.name}` : "Molimo ulogujte se"}</Typography>
        </AppBar>
        <Drawer
          anchor="left"
          open={otvoreno}
          onClose={e => setOtvoreno(false)}
        >
          <Box>
            <IconButton onClick={e => setOtvoreno(false)}>
              <ChevronLeft />
            </IconButton>
          </Box>
          <Divider />
              <LoginControl safePath="/" defaultPath="/teachers"/>

          <Divider />
              <Box>
                <FormGroup>
                  <FormControlLabel 
                    label={prvo_veliko(mode)} 
                    control={<Switch checked={mode === 'dark'} onChange={e => {
                      if(e.target.checked){
                        setMode('dark');
                      }else{
                        setMode('light');
                      }
                    }}/>}
                  />
                </FormGroup>
              </Box>
          <Divider />
          <Stack direction="column" spacing={1}>
            <Button component={NavLink} to={'subjects'}>predmet</Button>
            <Button component={NavLink} to={'teachers'}>nastavnik</Button>
            <Button component={NavLink} to={'students'}>student</Button>
            <Button component={NavLink} to={'parents'}>roditelji</Button>
          </Stack>
        </Drawer>
        <Box sx={{ paddingTop: "60px" }}>
          <Outlet />
        </Box>
      </Stack>
      </UserContext.Provider>
    </ThemeProvider>
  </>;
}

export default App;
