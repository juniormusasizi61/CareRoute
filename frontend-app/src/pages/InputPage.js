import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const InputPage = () => {
  const { user, fetchClients, createClient, deleteClient } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', notes: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Track the client currently being deleted so only that row shows a loading state.
  const [deletingClientId, setDeletingClientId] = useState(null);
  const [success, setSuccess] = useState(null);


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

  // Auto-dismiss success message after 3 seconds. The cleanup function ensures the timer
  // is cleared if the component unmounts or success changes before the timer fires, preventing
  // any memory leaks or "can't update unmounted component" warnings.
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Confirm, call the API, and optimistically remove the client from the local list.
  const deleteSavedClient = async (clientId, clientName) => {
    if (!window.confirm(`Delete ${clientName}?`)) return;

    try {
      setError(null);
      setDeletingClientId(clientId);
      await deleteClient(clientId);
      setClients((existing) => existing.filter((client) => client.id !== clientId));
      setSuccess(`${clientName} has been deleted.`);
    } catch (err) {
      setError(err.message || 'Unable to delete client');
    } finally {
      setDeletingClientId(null);
    }
  };

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
      // Show a brief success message to confirm the save.
      setSuccess(`${newClient.name} has been added successfully!`);
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
      {/* Display a non-intrusive success message in green when a client is added. 
          The message auto-dismisses after 3 seconds via the useEffect above. */}
      {success && <div style={{ color: 'green', marginBottom: 16, fontWeight: 'bold' }}>{success}</div>}

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
              <button
                onClick={() => deleteSavedClient(client.id, client.name)}
                // Disable only the row being deleted to keep the rest of the list interactive.
                disabled={deletingClientId === client.id}
                style={{ marginLeft: 8 }}
              >
                {deletingClientId === client.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputPage;
