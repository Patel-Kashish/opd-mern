import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Appointments() {
  const [patients, setPatients] = useState([]);
  const [today, setToday] = useState([]);

  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    dateTime: '',
  });

  const [error, setError] = useState('');

  const loadToday = async () => {
    setToday(await api('/appointments/today'));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const patientData = await api('/patients');
        setPatients(patientData);

        await loadToday();
      } catch (e) {
        setError(e.message);
      }
    };

    loadData();
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
      await api('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          dateTime: new Date(form.dateTime),
        }),
      });

      setForm({
        patient: '',
        doctor: '',
        dateTime: '',
      });

      loadToday();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="card">
        <h3>Book Appointment</h3>

        <form onSubmit={submit}>
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select patient</option>

            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>

          <input
  name="doctor"
  placeholder="Doctor name"
  value={form.doctor}
  onChange={handleChange}
  minLength={2}
  maxLength={100}
  pattern="[A-Za-z][A-Za-z .'-]*"
  required
/>

          <input
            name="dateTime"
            type="datetime-local"
            value={form.dateTime}
            onChange={handleChange}
            required
          />

          <button className="primary">Book</button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h3>Today's Appointments</h3>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {today.map((a) => (
              <tr key={a._id}>
                <td>
                  {new Date(a.dateTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                <td>{a.patient?.name}</td>

                <td>{a.doctor}</td>

                <td>
                  <span
                    className={`badge ${
                      a.status === 'Completed' ? 'done' : ''
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}