import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AttendanceSearch = ({ onSearch }) => {
  const [subject, setSubject] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(subject);
  };

  return (
    <Form onSubmit={handleSearch} className="mb-4">
      <Form.Group controlId="subject">
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
  );
};

export default AttendanceSearch;
