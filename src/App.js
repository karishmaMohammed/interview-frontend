import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [studentData, setStudentData] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    marks: {
      subject1: 0,
      subject2: 0,
      subject3: 0,
      subject4: 0,
    },
  });

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students/all");
      console.log(response.data.data.student);
      setStudentData(response.data.data.student);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  const handleSubjectChange = (subject, value) => {
    setNewStudent({
      ...newStudent,
      marks: {
        ...newStudent.marks,
        [subject]: value,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const totalMarks =
        parseInt(newStudent.marks.subject1) +
        parseInt(newStudent.marks.subject2) +
        parseInt(newStudent.marks.subject3) +
        parseInt(newStudent.marks.subject4);

      const percentage = (totalMarks / 400) * 100;

      const updatedStudent = {
        ...newStudent,
        total_Marks: totalMarks,
        percentage: isNaN(percentage) ? 0 : percentage,
      };

      await axios.post("http://localhost:5000/students/add", updatedStudent);

      setNewStudent({
        name: "",
        marks: {
          subject1: 0,
          subject2: 0,
          subject3: 0,
          subject4: 0,
        },
      });
      fetchStudentData();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const sortStudentsByTotalMarks = () => {
    const sortedStudents = [...studentData].sort(
      (a, b) => b.total_Marks - a.total_Marks
    );

    setStudentData(sortedStudents);
  };

  const handleDeleteClick = async (studentId) => {
    console.log(studentId);

    try {
      await axios.delete(`http://localhost:5000/students/delete/${studentId}`);
      fetchStudentData();
      console.log(`Delete clicked for student with ID: ${studentId}`);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEditClick = (studentId) => {
    setStudentData((prevData) =>
      prevData.map((student) =>
        student._id === studentId
          ? { ...student, isEditing: !student.isEditing }
          : student
      )
    );
  };

  const [editedMarks, setEditedMarks] = useState({
    subject1: 0,
    subject2: 0,
    subject3: 0,
    subject4: 0,
  });
  const handleSubjectChangeediting = (subject, value) => {
    console.log(subject, value);
    setEditedMarks((prevMarks) => ({
      ...prevMarks,
      [subject]: value === "" ? "" : parseInt(value) || "",
    }));
  };
  const handleUpdateClick = async (studentId) => {
    console.log(studentId._id);
    try {
      const totalMarks =
        parseInt(editedMarks.subject1) +
        parseInt(editedMarks.subject2) +
        parseInt(editedMarks.subject3) +
        parseInt(editedMarks.subject4);

      const percentage = (totalMarks / 400) * 100;

      // const updatedStudent = {
      //   name: studentId.name,
      //   marks: editedMarks,
      //   // total_Marks:totalMarks1,
      //   // percentage:percentage1,
      //   // studentId:studentId
      // };

      const letter = await axios.put(
        `http://localhost:5000/students/update/${studentId._id}`,
        {
          name: studentId.name,
          marks: editedMarks,
          total_Marks: totalMarks,
          percentage: percentage,
        }
      );
      console.log(letter);

      setNewStudent({
        name: "",
        marks: {
          subject1: 0,
          subject2: 0,
          subject3: 0,
          subject4: 0,
        },
      });

      fetchStudentData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  return (
    <div>
      <h1>School Dashboard for Teacher</h1>
      <div>
        <h2>Enter Student Marks</h2>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newStudent.name}
          onChange={handleInputChange}
        />
        <br />
        <label>Subject 1:</label>
        <input
          type="number"
          value={newStudent.marks.subject1}
          onChange={(e) => handleSubjectChange("subject1", e.target.value)}
        />
        <br />
        <label>Subject 2:</label>
        <input
          type="number"
          value={newStudent.marks.subject2}
          onChange={(e) => handleSubjectChange("subject2", e.target.value)}
        />
        <br />
        <label>Subject 3:</label>
        <input
          type="number"
          value={newStudent.marks.subject3}
          onChange={(e) => handleSubjectChange("subject3", e.target.value)}
        />
        <br />
        <label>Subject 4:</label>
        <input
          type="number"
          value={newStudent.marks.subject4}
          onChange={(e) => handleSubjectChange("subject4", e.target.value)}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <ul>
        {studentData.map((student) => (
          <li key={student._id}>
            <p>Name: {student.name}</p>
            {student.isEditing ? (
              <div>
                <label>Subject 1:</label>
                <input
                  type="number"
                  value={editedMarks.subject1}
                  onChange={(e) =>
                    handleSubjectChangeediting("subject1", e.target.value)
                  }
                />
                <br />
                <label>Subject 2:</label>
                <input
                  type="number"
                  value={editedMarks.subject2}
                  onChange={(e) =>
                    handleSubjectChangeediting("subject2", e.target.value)
                  }
                />
                <br />
                <label>Subject 3:</label>
                <input
                  type="number"
                  value={editedMarks.subject3}
                  onChange={(e) =>
                    handleSubjectChangeediting("subject3", e.target.value)
                  }
                />
                <br />
                <label>Subject 4:</label>
                <input
                  type="number"
                  value={editedMarks.subject4}
                  onChange={(e) =>
                    handleSubjectChangeediting("subject4", e.target.value)
                  }
                />
                <br />
                <button onClick={() => handleUpdateClick(student)}>Save</button>
              </div>
            ) : (
              <div>
                <p>Marks: {JSON.stringify(student.marks)}</p>
                <button onClick={() => handleEditClick(student._id)}>
                  Edit
                </button>
              </div>
            )}
            <button onClick={() => handleDeleteClick(student._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <div>
        <h2>Student Data for Head Master</h2>
        <button onClick={sortStudentsByTotalMarks}>
          Sort by Total Marks (Descending)
        </button>
        <ul>
          {studentData.map((student) => (
            <li key={student._id}>
              <p>Name: {student.name}</p>
              <p>Total Marks: {student.total_Marks}</p>
              <p>Percentage: {student.percentage}%</p>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
