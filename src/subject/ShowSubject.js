import { useState, useEffect } from "react";
import SubjectDetails from "./SubjectDetails";

const Subject = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      let response = await fetch('http://localhost:8080/es_dnevnik/subject');
      let result = await response.json();
      const dataWithTeachers = await Promise.all(result.map(async (subject) => {
        let teacherResponse = await fetch(`http://localhost:8080/es_dnevnik/teacher/by-subject/${subject.id}`);
        let teachers = await teacherResponse.json();
        return {...subject, teachers};
      }));
      if (!ignore) {
        setData(dataWithTeachers);
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubjects = data.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <>
      <div className="center-container">
        <div className="search-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch}/>
        </div>

        <div className="subject-container">
          {filteredSubjects.map((item) => (
            <div key={item.id} className="subject">
              <h2>{item.name}</h2>
              <h4>Fond: {item.fond} casova</h4>
              
              <div className="teacher-container">
                <h4>Profesori:</h4>
                <div>
                  {item.teachers.map((teacher) => (
                    <li key={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </li>
                  ))}
                </div>
              </div>
              <a onClick={() => setSelectedSubjectId(item.id)}>Prikazi</a>
            </div>
          ))}
        </div>

        {selectedSubjectId && <SubjectDetails subjectId={selectedSubjectId} />}
      </div>
    </>
  );
};

export default Subject;

