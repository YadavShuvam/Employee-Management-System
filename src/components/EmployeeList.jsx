import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', phone: '', age: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', form); // Log the form data
    axios.post('http://localhost:5000/employees', form)
      .then(response => {
        setEmployees([...employees, { ...form, id: response.data.id }]);
        setForm({ username: '', email: '', phone: '', age: '' });
      })
      .catch(error => {
        console.error('Error adding employee:', error.message);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(response => {
        setEmployees(employees.filter(employee => employee.id !== id));
      })
      .catch(error => {
        console.error('Error deleting employee:', error.message);
      });
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      <form onSubmit={handleSubmit} className="add-employee-form">
        <h2>Add New Employee</h2>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <button type="submit">Add Employee</button>
      </form>
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
