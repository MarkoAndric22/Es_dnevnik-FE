import React from 'react';
import ReactDOM from 'react-dom';
import ShowSubjects from './subject/ShowSubjects';
import ShowSubject from './subject/ShowSubject';
import ShowTeacher from './teacher/ShowTeacher';
import ShowTeacheres from './teacher/ShowTeacheres';
import NewTeacher from './teacher/NewTeacher';
import TeacherDetails from './teacher/TeacherDetails';
import ShowStudents from './student/ShowStudents';
import ShowStudent from './student/ShowStudent';
import NewStudent from './student/NewStudent';
import StudentDetails from './student/StudentDetails';
import NewParent from './parent/NewParent';
import ShowParent from './parent/ShowParent';
import ShowParents from './parent/ShowParents';
import ParentDetails from './parent/ParentDetails';
import Diary from './diary/Diary';

import './Subject.css';
import App from './App';
import { check_login, get_login } from './login_logic';
import { Navigate, RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { Box, Container, Icon, Stack, Typography } from '@mui/material';
import { Error } from '@mui/icons-material';
import SubjectDetails from './subject/SubjectDetails';
import NewSubject from './subject/NewSubject';
const rootElement = document.getElementById('root');

// Marko Andric
// putanja na gitu: https://github.com/MarkoAndric22/Es_dnevik

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
          if(user.role.name === "ROLE_ADMIN"){
            url = 'http://localhost:8080/es_dnevnik/subject';
          }else if(user.role.name === "ROLE_TEACHER"){
            const teacherId = user.id;
            url = `http://localhost:8080/es_dnevnik/subject/by-teacher/${teacherId}`;
          }
          const response = await fetch(url);
          const data = response.json();
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
        path: "diary/new",
        element: <Diary/>,
        errorElement: <ErrorDisplay entity="Diary" />,
        loader: () => {
          const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_TEACHER'}]);
          return user;
        },
        action: async ({ request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_TEACHER'}]);
          if (request.method === 'POST') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/teacher/teacherEvaluatesStudent`, {
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
          const user = check_login([{ name: 'ROLE_ADMIN' }, { name: 'ROLE_TEACHER' }]);
          const [teacher_response, subject_response,response_subjects] = await Promise.all([
            fetch(`http://localhost:8080/es_dnevnik/teacher/${params.id}`),
            fetch(`http://localhost:8080/es_dnevnik/subject/by-teacher/${params.id}`),
            fetch(`http://localhost:8080/es_dnevnik/subject`),
          ]);
          const teacher = await teacher_response.json();
          const subjects = await subject_response.json();
          const allSubjects= await response_subjects.json();
          return [teacher, subjects,allSubjects];
        },
        action: async ({ params, request }) => {
          const user = check_login([{ name: 'ROLE_ADMIN' }]);
          if (request.method === 'POST') {
            const formData = await request.formData();
            const subject =  formData.get('subjectId');
            const teacher = params.id;
            return fetch(`http://localhost:8080/es_dnevnik/subject/addSubjectTeacher?teacherId=${teacher}&subjectId=${subject}`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              },
             
            });
          }
        }
      },
      
      {
        path: "students",
        element: <ShowStudents/>,
        errorElement: <ErrorDisplay entity="ucenik" />,
        loader: async () => {
          
          const user = get_login();
          const response = await fetch('http://localhost:8080/es_dnevnik/student', {
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
        path: "student/:id",
        element: <ShowStudent />,
        errorElement: <ErrorDisplay entity="ucenik" />,
        loader: async ({ params }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          const response = await fetch(`http://localhost:8080/es_dnevnik/student/${params.id}`);
          return response.json();
        },
        action: async ({ params, request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'DELETE') {
            return fetch(`http://localhost:8080/es_dnevnik/student/${params.id}`, {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              }
            });
          } else if (request.method === 'PUT') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/student/${params.id}`, {
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
        path: "student/new",
        element: <NewStudent />,
        errorElement: <ErrorDisplay entity="ucenika" />,
        loader: () => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          return user;
        },
        action: async ({ request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'POST') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/student`, {
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
        path: "studentDetails/:id",
        element: <StudentDetails />,
        errorElement: <ErrorDisplay entity="student" />,
        loader: async ({ params }) => {
        const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_STUDENT'}]);
        const [response_student,student_response, mark_response,subject_response] = await Promise.all([
          fetch(`http://localhost:8080/es_dnevnik/student/${params.id}`),
          fetch(`http://localhost:8080/es_dnevnik/subject/subjectForStudent/${params.id}`),
          fetch(`http://localhost:8080/es_dnevnik/mark/studentMarks/${params.id}`),
          fetch(`http://localhost:8080/es_dnevnik/subject`),
        ]);
        const studentId= await response_student.json();
        const student= await student_response.json();
        const mark= await mark_response.json();

        const allSubjects= await subject_response.json();
       
        return [studentId,student, mark, allSubjects]
        },
        action: async ({ params, request }) => {
          const user = check_login([{ name: 'ROLE_ADMIN' }]);
          if (request.method === 'POST') {
            const formData = await request.formData();
            const subject =  formData.get('subjectId');
            const student = params.id;
            return fetch(`http://localhost:8080/es_dnevnik/subject/addSubjectStudent?studentId=${student}&subjectId=${subject}`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              },
             
            });
          }
        }
      },
      {
        path: "parents",
        element: <ShowParents/>,
        errorElement: <ErrorDisplay entity="roditelj" />,
        loader: async () => {
          
          const user = get_login();
          const response = await fetch('http://localhost:8080/es_dnevnik/parent', {
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
        path: "parent/new",
        element: <NewParent />,
        errorElement: <ErrorDisplay entity="roditelj" />,
        loader: () => {
          const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_PARENT'}]);
          return user;
        },
        action: async ({ request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'POST') {
            // const data = Object.fromEntries(await request.formData());
            const formData = await request.formData();
    const students = JSON.parse([...formData.getAll('students')]); 
    const data = Object.fromEntries(formData);
    data.students = students;
            return fetch(`http://localhost:8080/es_dnevnik/parent`, {
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
        path: "parent/:id",
        element: <ShowParent />,
        errorElement: <ErrorDisplay entity="roditelj" />,
        loader: async ({ params }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          const response = await fetch(`http://localhost:8080/es_dnevnik/parent/${params.id}`);
          return response.json();
        },
        action: async ({ params, request }) => {
          const user = check_login([{name: 'ROLE_ADMIN'}]);
          if (request.method === 'DELETE') {
            return fetch(`http://localhost:8080/es_dnevnik/parent/${params.id}`, {
              method: 'DELETE',
              headers: {
                "Content-Type": "application/json",
                'Authorization': JSON.parse(localStorage.getItem('user')).token
              }
            });
          } else if (request.method === 'PUT') {
            const data = Object.fromEntries(await request.formData());
            return fetch(`http://localhost:8080/es_dnevnik/parent/${params.id}`, {
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
        path: "parentDetails/:id",
        element: <ParentDetails />,
        errorElement: <ErrorDisplay entity="roditelj" />,
        loader: async ({ params }) => {
        const user = check_login([{name: 'ROLE_ADMIN'},{name: 'ROLE_PARENT'}]);
        const response = await fetch(`http://localhost:8080/es_dnevnik/parent/getMarks/${params.id}`
      );
      return response.json();
        },
      },
      
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);