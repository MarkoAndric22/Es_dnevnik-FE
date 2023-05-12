import React, { useState, useEffect } from 'react';

const SubjectDetails = ({ subjectId }) => {
const [subject, setSubject] = useState(null);

useEffect(() => {
fetch(`http://localhost:8080/es_dnevnik/subject/${subjectId}`)
    .then(response => response.json())
      .then(data => {
        console.log(data);
        setSubject(data);
      })
      .catch(error => console.error(error));
  }, [subjectId]);

  if (!subject) {
    return <div>Loading...</div>;
  }

return (
<div className="details-container">
<h2>Name: {subject.name}</h2>
<p>Fond: {subject.fond}</p>
</div>
);
};

export default SubjectDetails;