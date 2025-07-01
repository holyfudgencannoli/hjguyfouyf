import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmContamPage() {
  const [formData, setFormData] = useState({});
  const [prodIds, setProdIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('myFormData');
    if (stored) {
      const data = JSON.parse(stored);
      setFormData(data);
      setProdIds(data.prod_ids || []);
    }
  }, []);

  const handleBack = () => {
    navigate('/prod-select-form');
  };

  const handleConfirmSubmit = async () => {
    for (const prod_id of prodIds) {
      const submission = new FormData();

      // Append base form fields
      for (const key in formData) {
        if (key === 'prod_ids') continue; // skip this key
        if (Array.isArray(formData[key])) {
          formData[key].forEach(item => submission.append(`${key}[]`, item));
        } else {
          submission.append(key, formData[key]);
        }
      }

      submission.append('prod_id', prod_id);

      try {
        const res = await fetch('http://localhost:5000/create-contam', {
          method: 'POST',
          credentials: 'include',
          body: submission
        });

        const result = await res.json();
        console.log(`Submitted contam for product ${prod_id}`, result);
      } catch (err) {
        console.error(`Submission failed for product ${prod_id}`, err);
      }
    }

    alert("All contaminations logged!");
    navigate('/dashboard');
  };

  return (
    <div className="form">
      <h1>Confirm Contamination Entries</h1>

      <h3>Log Data:</h3>
      <ul>
        {Object.entries(formData).map(([key, value]) => {
          if (key === 'prod_ids') return null;
          return (
            <li key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </li>
          );
        })}
      </ul>

      <h3>Selected Products:</h3>
      <ul>
        {prodIds.map((pid) => (
          <li key={pid}>Product ID: {pid}</li>
        ))}
      </ul>

      <div className="buttons">
        <button onClick={handleBack}>Back</button>
        <button onClick={handleConfirmSubmit}>Confirm & Submit</button>
      </div>
    </div>
  );
}
