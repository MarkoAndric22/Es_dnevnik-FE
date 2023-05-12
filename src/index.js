import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import ShowSubject from './subject/ShowSubject';
import './Subject.css';
import SubjectError from './SubjectError';
// Marko Andric
// https://github.com/MarkoAndric22/Es_dnevik
const router = createBrowserRouter([
{
  
    path:'/',
  element:<ShowSubject/>,
  errorElement:<SubjectError/>,
  loader: async () => {
        return fetch('http://localhost:8080/es_dnevnik/subject');
      }
    } 
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

