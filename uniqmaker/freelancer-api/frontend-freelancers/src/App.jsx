import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/freelancers');
        setFreelancers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFreelancers = React.useMemo(() => {
    if (!sortConfig.key) return freelancers;

    return [...freelancers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [freelancers, sortConfig]);

  const filteredFreelancers = sortedFreelancers.filter((freelancer) =>
    Object.values(freelancer).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    { key: 'prenom', label: 'Prénom' },
    { key: 'nom', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'dateNaissance', label: 'Date de Naissance' },
    { key: 'region', label: 'Région' },
    { key: 'profession', label: 'Profession' },
  ];

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Annuaire des xreelancers</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      <div className="table-responsive">
        <table className="freelancers-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className={`sortable ${sortConfig.key === column.key ? sortConfig.direction : ''}`}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="sort-icon">
                      {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={`${index}-${column.key}`}>
                      {freelancer[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-results">
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="app-footer">
        <p>Total: {filteredFreelancers.length} freelancers</p>
        <div className="pagination-controls">
          {/* Ici vous pourriez ajouter une pagination */}
        </div>
      </div>
    </div>
  );
}

export default App;