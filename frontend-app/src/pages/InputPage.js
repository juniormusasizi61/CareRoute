import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const InputPage = () => {
  const { user, fetchClients, createClient } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', notes: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track whether a new client is currently being saved to prevent duplicate submits.
  const [saving, setSaving] = useState(false);

  // Load saved clients for the authenticated user.
  useEffect(() => {
    if (!user) return;

    const loadClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchClients();
        setClients(result);
      } catch (err) {
        setError(err.message || 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user, fetchClients]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addClient = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      setError('Please provide a client name and address.');
      return;
    }

    try {
      setError(null);
      // Mark the save request as in progress so the submit button can be disabled.
      setSaving(true);
      const newClient = await createClient({
        name: form.name,
        address: form.address,
        notes: form.notes,
      });
      setClients((existing) => [newClient, ...existing]);
      setForm({ name: '', address: '', notes: '' });
    } catch (err) {
      setError(err.message || 'Unable to save client');
    } finally {
      setSaving(false);
    }
  };

  // Simple UX improvement: surface the current saved client count to the user.
  const clientCount = clients.length;

  if (!user) {
    return (
      <div>
        <h2>Input Client Addresses & Worker Schedules</h2>
        <p>Please log in to save client data and connect it to your dispatcher account.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Input Client Addresses & Worker Schedules</h2>
      <p style={{ marginTop: 0, color: '#555' }}>
        You have {clientCount} saved client{clientCount === 1 ? '' : 's'}.
      </p>
      <form onSubmit={addClient} style={{ marginBottom: 16 }}>
        <input name="name" placeholder="Client name" value={form.name} onChange={handleChange} />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{ marginLeft: 8 }}
        />
        <input
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          style={{ marginLeft: 8 }}
        />
        <button
          type="submit"
          // Disable while saving or when required fields are missing.
          disabled={saving || !form.name || !form.address}
          style={{ marginLeft: 8 }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      <h3>Saved clients</h3>
      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <p>No saved clients yet.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <strong>{client.name}</strong> — {client.address}
              {client.notes ? ` (${client.notes})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputPage;
