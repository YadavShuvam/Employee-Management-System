import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(response => {
        setEmployees(employees.filter(employee => employee.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.username}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.age}</td>
              <td>
                <Link to={`/edit-employee/${employee.id}`} className="edit-button">Edit</Link>
                <button onClick={() => handleDelete(employee.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
