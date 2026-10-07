import { useState } from 'react';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Consultation from './components/Consultation';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('patients');

  return (
    <div className="container">
      <h1>OPD Mini Module</h1>

      <nav>
        <button
          className={tab === 'patients' ? 'active' : ''}
          onClick={() => setTab('patients')}
        >
          Patients
        </button>

        <button
          className={tab === 'appointments' ? 'active' : ''}
          onClick={() => setTab('appointments')}
        >
          Appointments
        </button>

        <button
          className={tab === 'consult' ? 'active' : ''}
          onClick={() => setTab('consult')}
        >
          Consultation
        </button>
      </nav>

      {tab === 'patients' && <Patients />}
      {tab === 'appointments' && <Appointments />}
      {tab === 'consult' && <Consultation />}
    </div>
  );
}