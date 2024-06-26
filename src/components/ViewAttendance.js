import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Alert } from 'react-bootstrap';
import AttendanceSearch from './AttendanceSearch';
import '../compCss/ViewAttendance.css'; 

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceData = async (subject = '') => {
    setLoading(true);
    setError(null);
    // const apiUrl='http://localhost:8080/api/viewattendance'
    const apiUrl='https://decd-103-124-140-173.ngrok-free.app/api/viewattendance'   //8080 port
    try {
    const response = await axios.get(apiUrl,{  //  PORT 8080
        params : {subject},
        headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420' // Add your custom header here
          },

      });
      console.log("Frontend records response : ",response.data)

      if (Array.isArray(response.data)) {
        setAttendanceData(response.data);
      } else {
        throw new Error('Expected an array but got something else');
      }

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Attendance Records</h1>
      <AttendanceSearch onSearch={fetchAttendanceData} />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <Alert variant="danger">Error: {error.message}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Day</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record._id}>
                <td>{record.student_name}</td>
                <td>{record.subject}</td>
                <td>{record.date}</td>
                <td>{record.day}</td>
                <td>{record.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AttendanceList;
