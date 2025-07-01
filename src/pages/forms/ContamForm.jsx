import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContamForm() {
    const navigate = useNavigate();

    // const [contam_id, setContamId] = useState('')
    const [dispos_date, setDisposDate] = useState('')
    const [data_log, setDataLog] = useState('')
    // const [prod_id, setProdId] = useState('')
    const [dispose_agent_id, setDisposAgentId] = useState('')

    const location = useLocation();
    const batch_id = location.state?.batch_id;
    const log_date = location.state?.log_date;
    const agent_id = location.state?.agent_id;
    console.log(batch_id, agent_id)

    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            batch_id,
            agent_id,
            log_date,
            dispos_date,
            data_log,
            dispose_agent_id
        };

        localStorage.setItem('myFormData', JSON.stringify(payload));
        navigate('/prod-select-form');
    }

    // async function handleSubmit(e) {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append('batch_id', batch_id);
    //     formData.append('agent_id', agent_id);
    //     formData.append('log_date', log_date);
    //     formData.append('dispos_date', dispos_date);
    //     formData.append('data_log', data_log);
    //     formData.append('prod_id', prod_id);
    //     formData.append('dispose_agent_id', dispose_agent_id);
        
    //     localStorage.setItem('myFormData', JSON.stringify(formData));
    //     navigate('/prod-select-form')

    //     // try {
    //     // const response = await fetch('http://localhost:5000/create-contam', {
    //     //     method: 'POST',
    //     //     credentials: 'include',
    //     //     body: formData,
    //     // });
        
    //     // const data = await response.json();

    //     // if (data.success) {
    //     //     console.log("Navigating with batch_id and batch_date:", batch_id, agent_id);
    //     //     localStorage.setItem('myFormData', JSON.stringify(formData));
    //     //     navigate('/prod-select-form')
    //     // } else {
    //     //     alert('Contamination log failed');
    //     // }
    //     // } catch (error) {
    //     // console.error('Error:', error);
    //     // alert('Error submitting form');
    //     // }
    // }

    return (
        <>
            <div id="labor-input" className="form">
                <div id="title">
                    <h1>INPUT CONTAMINATION DATA</h1>
                </div>
                <section className="bg-stars">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </section>
                <form method="POST" onSubmit={handleSubmit}>
                    <input
                        type="date"
                        name="log_date"
                        value={log_date}
                        readOnly
                        required
                    />
                    <input
                        type="number"
                        name="agent_id"
                        value={agent_id} 
                        readOnly
                        required
                    />
                    <input
                        type="number"
                        name="batch_id"
                        value={batch_id}
                        readOnly
                        required
                    />
                    {/* <input
                        type='numeric'
                        name='prod_id'
                        placeholder='Product ID'
                        value={prod_id}
                        onChange={e => setProdId(e.target.value)}
                        
                    /> */}
                    <input
                        type="date"
                        name="dispos_date"
                        value={dispos_date}
                        onChange={e => setDisposDate(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        name="dispos_agent_id"
                        value={dispose_agent_id}
                        onChange={e => setDisposAgentId(e.target.value)}
                        required
                    />
                    <textarea
                        name="data_log"
                        placeholder="Notes"
                        value={data_log}
                        onChange={e => setDataLog(e.target.value)}
                    ></textarea>
                    <button type="submit">Submit Innoculation</button>
                </form>
            </div>
        </>
    )
}

