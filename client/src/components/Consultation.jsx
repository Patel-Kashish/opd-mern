import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Consultation() {
  const [today, setToday] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    bp: '',
    temperature: '',
    notes: '',
  });

  const [historyPatient, setHistoryPatient] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const loadToday = async () => {
    setToday(await api('/appointments/today'));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadToday();

        const patientData = await api('/patients');
        setPatients(patientData);
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

  const complete = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api(`/appointments/${selected._id}/consult`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });

      setSelected(null);

      setForm({
        bp: '',
        temperature: '',
        notes: '',
      });

      await loadToday();

      if (historyPatient) {
        await loadHistory(historyPatient);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadHistory = async (id) => {
    setHistoryPatient(id);

    if (!id) {
      setHistory([]);
      return;
    }

    setHistory(
      await api(`/appointments/patient/${id}/completed`)
    );
  };

  const pending = today.filter(
    (a) => a.status === 'Scheduled'
  );

  return (
    <>
      <div className="card">
        <h3>Pending Consultations (Today)</h3>

        {pending.length === 0 && (
          <p>No pending appointments.</p>
        )}

        <table>
          <tbody>
            {pending.map((a) => (
              <tr key={a._id}>
                <td>{a.patient?.name}</td>
                <td>{a.doctor}</td>
                <td>
                  <button
                    className="primary"
                    onClick={() => setSelected(a)}
                  >
                    Start
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="card">
          <h3>
            Consultation: {selected.patient?.name}
          </h3>

          <form onSubmit={complete}>
           <input
  name="bp"
  placeholder="BP (e.g. 120/80)"
  value={form.bp}
  onChange={handleChange}
  pattern="[0-9]{2,3}/[0-9]{2,3}"
  required
/>

            <input
  name="temperature"
  type="number"
  placeholder="Temperature (°F)"
  value={form.temperature}
  onChange={handleChange}
  min="80"
  max="110"
  step="0.1"
  required
/>

            <textarea
  name="notes"
  rows="3"
  placeholder="Notes"
  value={form.notes}
  onChange={handleChange}
  maxLength={1000}
  required
/>

            <button className="primary">
              Mark Complete
            </button>
          </form>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Completed Consultations by Patient</h3>

        <select
          value={historyPatient}
          onChange={(e) => loadHistory(e.target.value)}
        >
          <option value="">Select patient</option>

          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>BP</th>
              <th>Temp</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => (
              <tr key={h._id}>
                <td>
                  {new Date(
                    h.completedAt
                  ).toLocaleString()}
                </td>

                <td>{h.doctor}</td>
                <td>{h.vitals?.bp}</td>
                <td>{h.vitals?.temperature}</td>
                <td>{h.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}