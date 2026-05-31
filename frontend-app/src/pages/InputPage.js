import React, { useState } from 'react';

const InputPage = () => {
  // Local-only list for now; will move to backend persistence later.
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', address: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addClient = (e) => {
    e.preventDefault();
    if (!form.name || !form.address) return;
    // Timestamp id is sufficient for temporary client-side entries.
    setClients((c) => [...c, { ...form, id: Date.now() }]);
    setForm({ name: '', address: '' });
  };

  return (
    <div>
      <h2>Input Client Addresses & Worker Schedules</h2>
      <form onSubmit={addClient} style={{ marginBottom: 16 }}>
        <input name="name" placeholder="Client name" value={form.name} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} style={{ marginLeft: 8 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Add</button>
      </form>

      <h3>Clients</h3>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>{c.name} — {c.address}</li>
        ))}
      </ul>
    </div>
  );
};

export default InputPage;
