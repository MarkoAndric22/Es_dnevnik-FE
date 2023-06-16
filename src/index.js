import React from 'react';
import ReactDOM from 'react-dom';
import ShowSubjects from './subject/ShowSubjects';
import ShowSubject from './subject/ShowSubject';
import ShowTeacher from './teacher/ShowTeacher';
import ShowTeacheres from './teacher/ShowTeacheres';
import NewTeacher from './teacher/NewTeacher';
import TeacherDetails from './teacher/TeacherDetails';

import './Subject.css';
import App from './App';
import { check_login, get_login } from './login_logic';
import { Navigate, RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { Box, Container, Icon, Stack, Typography } from '@mui/material';
import { Error } from '@mui/icons-material';
import SubjectDetails from './subject/SubjectDetails';
import NewSubject from './subject/NewSubject';

const ErrorDisplay = ({ entity }) => {
  const error = useRouteError();
  if (error.cause === 'login') {
    return <Navigate to="/" />;
  } else if (error.cause === 'security') {
    return (
      <Container>
        <Stack direction={'row'}>
          <Icon>
            <Error />
          </Icon>
          <Typography variant="h4">ACCESS DENIED</Typography>
          <Icon>
            <Error />
          </Icon>
        </Stack>
      </Container>
    );
  }
  return (
    <Container>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h4">Desila se greška u učitavanju {entity}</Typography>
        <Typography>Jako nam je žao. Da li ste pokrenuli back-end server, možda?</Typography>
        <Typography variant="h6">Interna greška je: </Typography>
        <Box>
          <pre>{error.message}</pre>
        </Box>
      </Stack>
    </Container>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "subjects",
        element: <ShowSubjects />,
        errorElement: <ErrorDisplay entity="predmet" />,
        loader: async () => {
          const user = get_login();
          let url;
          let url2;
          if(user.role.name === "ROLE_ADMIN"){
            url = 'http://localhost:8080/es_dnevnik/subject';
          }else if(user.role.name === "ROLE_TEACHER"){
            const teacherId = user.id;
            url = `http://localhost:8080/es_dnevnik/subject/by-teacher/${teacherId}`;
            url2 = `http://localhost:8080/es_dnevnik/subject/teacherDontHave/${teacherId}`;
          }
          const response = await fetch(url);
          const data = response.json();

          if (url2) {
            const response2 = await fetch(url2);
            const data2 = await response2.json();
          }
          return data;
        },
      },
      {
        path: "subjects/:id",
        element: <ShowSubject />,
        errorElement: <ErrorDisplay entity="predmet" />,
        loader: async ({ params }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}, {name: 'ROLE_TEACHER'}]);
          const response = await fetch(`http://localhost:8080/es_dnevnik/subject/${params.id}`);
          return response.json();
        },
        action: async ({ request, params}) => {
          const user = check_login([{name: 'ROLE_ADMIN'}, {name: 'ROLE_TEACHER'}]);
          if(user.role.name === "ROLE_TEACHER"){
            if (request.method === 'DELETE') {
              const url = new URL(`http://localhost:8080/es_dnevnik/admin/teacherSubjectDelete`);
              url.searchParams.append('teacherId', user.id);
              url.searchParams.append('subjectId', params.id);
              return fetch(url, {
                method: 'DELETE',
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': JSON.parse(localStorage.getItem('user')).token
                }
              });
            } 
            if (request.method === 'POST') {
              const url = new URL(`http://localhost:8080/es_dnevnik/admin/teacherSubject`);
              url.searchParams.append('teacherId', user.id);
              url.searchParams.append('subjectId', params.id);
              return fetch(url, {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': JSON.parse(localStorage.getItem('user')).token
                }
              });
            }
          
          }
          else if(user.role.name === "ROLE_ADMIN"){
            if (request.method === 'DELETE') {
              return fetch(`http://localhost:8080/es_dnevnik/subject/${params.id}`, {
                method: 'DELETE',
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': JSON.parse(localStorage.getItem('user')).token
                }
              });
            } else if (request.method === 'PUT') {
              const data = Object.fromEntries(await request.formData());
              return fetch(`http://localhost:8080/es_dnevnik/subject/${params.id}`, {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': JSON.parse(localStorage.getItem('user')).token
                },
                body: JSON.stringify(data)
              });
            }
          }
        }
      },
      {
        path: "subjectsDetails/:id",
        element: <SubjectDetails />,
        errorElement: <ErrorDisplay entity="predmet" />,
        loader: async ({ params }) => {
        const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_TEACHER'}]);
        const [subject_response, teacher_response] = await Promise.all([
        fetch(`http://localhost:8080/es_dnevnik/subject/${params.id}`),
        fetch(`http://localhost:8080/es_dnevnik/teacher/by-subject/${params.id}`)
      ]);
      const subject = await subject_response.json();
      const teachers = await teacher_response.json();
      return [subject, teachers];
        },
      },

      {
        path: "subjects/new",
        element: <NewSubject />,
        errorElement: <ErrorDisplay entity="predmet" />,
        loader: () => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          return user;
        },
        action: async ({ request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'POST') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/subject`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              },
              body: JSON.stringify(data)
            });
          }
        }
      },



      {
        path: "teachers",
        element: <ShowTeacheres />,
        errorElement: <ErrorDisplay entity="nastavnik" />,
        loader: async () => {
          
          const user = get_login();
          const response = await fetch('http://localhost:8080/es_dnevnik/teacher', {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              'Authorization': JSON.parse(localStorage.getItem('user')).token
            }
          });
          return response.json();
        },
      },
      {
        path: "teachers/:id",
        element: <ShowTeacher />,
        errorElement: <ErrorDisplay entity="nastavnik" />,
        loader: async ({ params }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          const response = await fetch(`http://localhost:8080/es_dnevnik/teacher/${params.id}`);
          return response.json();
        },
        action: async ({ params, request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'DELETE') {
            return fetch(`http://localhost:8080/es_dnevnik/teacher/${params.id}`, {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              }
            });
          } else if (request.method === 'PUT') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/teacher/${params.id}`, {
              method: 'PUT',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              },
              body: JSON.stringify(data)
            });
          }
        }
      },
      {
        path: "teachers/new",
        element: <NewTeacher />,
        errorElement: <ErrorDisplay entity="nastavnika" />,
        loader: () => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          return user;
        },
        action: async ({ request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'POST') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/teacher`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              },
              body: JSON.stringify(data)
            });
          }
        }
      },

      {
        path: "teachersDetails/:id",
        element: <TeacherDetails />,
        errorElement: <ErrorDisplay entity="nastavnik" />,
        loader: async ({ params }) => {
        const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_TEACHER'}]);
        const [teacher_response, subject_response] = await Promise.all([
        fetch(`http://localhost:8080/es_dnevnik/teacher/${params.id}`),
        fetch(`http://localhost:8080/es_dnevnik/subject/by-teacher/${params.id}`)
      ]);
      const teacher = await teacher_response.json();
      const subjects = await subject_response.json();
      return [teacher, subjects];
        },
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);