import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProdForm() {
    const navigate = useNavigate();
    
        const [prod_desc, setProdDesc] = useState('')
        const [prod_wght, setProdWght] = useState('')
        const [prod_wunit, setProdWUnit] = useState('')
        const [prod_vol, setProdVol] = useState('')
        const [prod_vunit, setProdVUnit] = useState('')
        const [spec_label, setSpecLabel] = useState('')
        const [prod_notes, setProdNotes] = useState('')
    
        const location = useLocation();
        const batch_id = location.state?.batch_id;
        const prod_date = location.state?.prod_date;
        console.log(batch_id, prod_date)
    
        async function handleSubmit(e) {
            e.preventDefault();
    
            const formData = new FormData();
            formData.append('prod_desc', prod_desc);
            formData.append('prod_wght', prod_wght);
            formData.append('prod_wunit', prod_wunit);
            formData.append('prod_vol', prod_vol);
            formData.append('prod_vunit', prod_vunit);
            formData.append('spec_label', spec_label);
            formData.append('prod_date', prod_date);
            formData.append('batch_id', batch_id);
            formData.append('prod_notes', prod_notes);
            
            try {
            const response = await fetch('http://localhost:5000/create-prod', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            
            const data = await response.json();
    
            if (data.success) {
                console.log("Navigating with batch_id and prod_date:", batch_id, prod_date);
                setProdDesc('')
                setProdWght('')
                setProdWUnit('')
                setProdVol('')
                setProdVUnit('')
                setSpecLabel('')
                setProdNotes('')
                navigate('/prod-form', { state: { batch_id: batch_id, prod_date: prod_date} });
                
                  // ← use batch_id directly
            } else {
                alert('Product creation failed');
            }
            } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form');
            }
        }

    return(
        <>
            <div id="labor-input" className="form">
                <div id="title">
                    <h1>INPUT PRODUCT DATA</h1>
                </div>
                <section className="bg-stars">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </section>
                <form method='POST' onSubmit={handleSubmit} >
                    <input
                        type="text"
                        name="prod_desc"
                        value={prod_desc}
                        onChange={e => setProdDesc(e.target.value)}
                        placeholder='Description'
                        required
                    />
                    <input
                        type="numeric"
                        name="prod_wght"
                        value={prod_wght}
                        onChange={e => setProdWght(e.target.value)}
                        placeholder='Weight Value'
                        required
                    />
                    <input
                        type="text"
                        name="prod_wunit"
                        value={prod_wunit}
                        onChange={e => setProdWUnit(e.target.value)}
                        placeholder='Weight Unit'
                        required
                    />
                    <input
                        type="numeric"
                        name="prod_vol"
                        value={prod_vol}
                        onChange={e => setProdVol(e.target.value)}
                        placeholder='Volume Value'
                        required
                    />
                    <input
                        type="text"
                        name="prod_vunit"
                        value={prod_vunit}
                        onChange={e => setProdVUnit(e.target.value)}
                        placeholder='Volume Unit'
                        required
                    />
                    <input
                        type="text"
                        name="spec_label"
                        value={spec_label}
                        onChange={e => setSpecLabel(e.target.value)}
                        placeholder='Specimen Label'
                        required
                    />
                    <input
                        type="date"
                        name="prod_date"
                        value={prod_date || ''}
                        readOnly
                        required
                    />
                    <input
                        type="number"
                        name="batch_id"
                        value={batch_id || ''}
                        readOnly
                        required
                    />
                    <textarea
                        name="prod_notes"
                        value={prod_notes}
                        onChange={e => setProdNotes(e.target.value)}
                        placeholder='Product Notes'
                    />
                    <button type="submit">Create Product</button>
                </form>
            </div>
            <button><Link to={'/dashboard'}>Finished</Link></button>
        </>        
    );
}