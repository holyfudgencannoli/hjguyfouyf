import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BatchForm() {
    const navigate = useNavigate();

    // const [batch_id, setBatchId] = useState('');
    // const [batch_date, setBatchDate] = useState('');
    const [item_qty, setItemQty] = useState('');
    const [batch_desc, setBatchDesc] = useState('');
    const [batch_notes, setBatchNotes] = useState('');

    const location = useLocation();
    const batch_id = location.state?.batch_id;
    const batch_date = location.state?.batch_date;
    console.log(batch_id, batch_date)

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('batch_id', batch_id);
        formData.append('batch_date', batch_date);
        formData.append('item_qty', item_qty);
        formData.append('batch_desc', batch_desc);
        formData.append('batch_notes', batch_notes);
        
        try {
        const response = await fetch('http://localhost:5000/create-batch', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        
        const data = await response.json();

        if (data.success) {
            console.log("Navigating with batch_id and batch_date:", batch_id, batch_date);
            navigate('/prod-form', { state: { batch_id: batch_id, prod_date: batch_date} });  // ← use batch_id directly
        } else {
            alert('Batch creation failed');
        }
        } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
        }
    }

    return (
        <>
            <div id="batch-input" className="form">
                <div id="title">
                    <h1>INPUT BATCH DATA</h1>
                </div>
                <section className="bg-stars">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </section>
                <form method="post" onSubmit={handleSubmit}>
                    <input
                        type="number"
                        name="item_qty"
                        placeholder='Item Quantity'
                        value={item_qty}
                        onChange={e => setItemQty(e.target.value)}
                        required
                    />
                    <input type="number" name="batch_id" value={batch_id || ''} readOnly required/>
                    <input type="date" name="batch_date" value={batch_date || ''} readOnly required/>
                    {/* <input type="date" name="date"></input> */}
                    <input
                        type="text"
                        name="batch_desc"
                        placeholder='Batch Description'
                        value={batch_desc}
                        onChange={e => setBatchDesc(e.target.value)}
                        required
                    />
                    <textarea name="batch_notes" placeholder="Notes" value={batch_notes} onChange={e => setBatchNotes(e.target.value)}></textarea>
                    <button type="submit">Create Batch</button>
                </form>
            </div>
        </>
    )
}

