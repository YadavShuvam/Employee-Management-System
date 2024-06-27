import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [form, setForm] = useState({ username: '', email: '', phone: '', age: '', password: '' });
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:5000/employees`)
      .then(response => {
        const employee = response.data.find(emp => emp.id === parseInt(id));
        if (employee) setForm(employee);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/employees/${id}`, form)
      .then(response => {
        alert('Employee updated');
        history.push('/employees');
      })
      .catch(error => {
        console.error(error);
        alert('Update failed');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
};

export default EditEmployee;
