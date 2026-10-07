import { useEffect, useState } from 'react';
import { api } from '../api';

const empty = {
  name: '',
  gender: 'Male',
  age: '',
  phone: '',
};

export default function Patients() {
  const [form, setForm] = useState(empty);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = async (q = '') => {
    try {
      setPatients(
        await api(`/patients?search=${encodeURIComponent(q)}`)
      );
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
  const loadPatients = async () => {
    try {
      const data = await api('/patients');
      setPatients(data);
    } catch (e) {
      setError(e.message);
    }
  };

  loadPatients();
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      setForm(empty);
      load(search);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="card">
        <h3>Register Patient</h3>

        <form onSubmit={submit}>
          <input
  name="name"
  placeholder="Name"
  value={form.name}
  onChange={handleChange}
  minLength={2}
  maxLength={100}
  pattern="[A-Za-z][A-Za-z .'-]*"
  required
/>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
  name="age"
  type="number"
  placeholder="Age"
  value={form.age}
  onChange={handleChange}
  min="0"
  max="120"
  step="1"
  required
/>

  <input
  name="phone"
  placeholder="Phone"
  value={form.phone}
  onChange={handleChange}
  pattern="[0-9]{10}"
  maxLength={10}
  required
/>

          <button className="primary">Add</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h3>Patients</h3>

        <input
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            load(e.target.value);
          }}
        />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.gender}</td>
                <td>{p.age}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}