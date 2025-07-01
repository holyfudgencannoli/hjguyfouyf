import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InnocForm() {
    const navigate = useNavigate();

    const [spec_labels, setSpecLabels] = useState('');
    const [innoculant, setInnoculant] = useState('');
    const [sol_sub, setSolSub] = useState('');
    const [type, setType] = useState('');
    const [data_log, setDataLog] = useState('');

    const location = useLocation();
    const innoc_date = location.state?.innoc_date;
    const batch_id = location.state?.batch_id;
    const agent_id = location.state?.agent_id;
    console.log(batch_id, agent_id)

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('batch_id', batch_id);
        formData.append('agent_id', agent_id);
        formData.append('innoc_date', innoc_date);
        formData.append('spec_labels', spec_labels);
        formData.append('innoculant', innoculant);
        formData.append('sol_sub', sol_sub);
        formData.append('type', type);
        formData.append('data_log', data_log);
        
        try {
        const response = await fetch('http://localhost:5000/create-innoc', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        
        const data = await response.json();

        if (data.success) {
            console.log("Navigating with batch_id and batch_date:", batch_id, agent_id);
            navigate('/prod-select-form')
        } else {
            alert('Innoculation log failed');
        }
        } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
        }
    }

    return (
        <>
            <div id="innoc-input" className="form">
                <div id="title">
                    <h1>INPUT INNOCULATION DATA</h1>
                </div>
                <section className="bg-stars">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </section>
                <div id="labor-input">
                    <form method="post" onSubmit={handleSubmit}>
                        <input
                            type="date"
                            name="innoc_date"
                            value={innoc_date || ''}
                            readOnly
                        />
                        <input
                            type="text"
                            name="spec_labels"
                            placeholder="Specimen Labels"
                            value={spec_labels}
                            onChange={e => setSpecLabels(e.target.value)}
                        />
                        <input
                            type="text"
                            name="innoculant"
                            placeholder="Innoculant"
                            value={innoculant}
                            onChange={e => setInnoculant(e.target.value)}
                        />
                        <input
                            type="text"
                            name="sol_sub"
                            placeholder="Solution or Substrate"
                            value={sol_sub}
                            onChange={e => setSolSub(e.target.value)}
                        />
                        <input
                            type="text"
                            name="type"
                            placeholder="Type"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        />
                        <textarea 
                            name="data_log" 
                            placeholder="Notes"
                            value={data_log}
                            onChange={e => setDataLog(e.target.value)}
                        ></textarea>
                        <input
                            type="number"
                            name="batch_id"
                            value={batch_id}
                        />
                        <input
                            type="number"
                            name="agent_id"
                            value={agent_id}
                        />
                        <button type="submit">Submit Innoculation</button>
                    </form>
                </div>
            </div>
        </>
    )
}

