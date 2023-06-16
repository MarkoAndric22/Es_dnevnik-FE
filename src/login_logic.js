import { useState } from "react";


export const useLogin = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
    const login = async (email, password) => {
      try {
        const url = new URL('http://localhost:8080/es_dnevnik/admin/login');
        url.searchParams.append('email', email);
        url.searchParams.append('password', password);
  
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
          }
        });
  
        if (response.ok) {
          const nuser = await response.json();
          const userDetailsResponse = await fetch(`http://localhost:8080/es_dnevnik/admin/findByEmail/${email}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (userDetailsResponse.ok) {
          const userDetails = await userDetailsResponse.json();
          nuser.id = userDetails.id; 
          nuser.name = userDetails.name; 
          nuser.lastName = userDetails.lastName;
          nuser.username = userDetails.username;
          nuser.role = userDetails.role;
        }

        setUser(nuser);
        localStorage.setItem('user', JSON.stringify(nuser));
        console.log(nuser);
        return nuser;
        } else {
          console.log('Pogrešni podaci za prijavu');
          return null;
        }
      } catch (error) {
        console.log('Greška prilikom prijavljivanja:', error);
        return null;
      }
    };
  
    const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };
  
    return [user, login, logout];
  };

export const get_login = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user || user === undefined){

        const err = {
            cause: "login",
            message: "Korisnik nije ulogovan"
        };
        throw err;
    }
    return user;
}

export const check_login = (roles) => {
    const user = get_login();

          if(user === null){
            const err = {
              cause: 'login',
              message: 'Korisnik nije logovan'
            };
            throw err;
          }else if(roles){
            if(!roles.find(role => role.name === user.role.name)){
                const err = {
                    cause: 'security',
                    message: 'Korisnik nema pravo pristupa'
                };
                throw err;
          }
        }
    return user;
}

export const valid_login = (roles) => {
    const user = get_login();
          if(user === null){
            return false;
          }else if(roles){
            if (!roles.find(role => role.name === user.role.name)) {
                return false;
          }
        }
    return true;
}