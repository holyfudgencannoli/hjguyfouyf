import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewAgentForm() {
    const navigate = useNavigate();

    const [agent_name, setAgentName] = useState('')
    const [agent_start, setAgentStart] = useState('')
    const [agent_fin, setAgentFin] = useState('')
    const [agent_notes, setAgentNotes] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('agent_name', agent_name)
        formData.append('agent_start', agent_start)
        formData.append('agent_fin', agent_fin)
        formData.append('agent_notes', agent_notes)

        console.log(formData)

        try{
            const response = await fetch('http://localhost:5000/new-agent', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                navigate('/dashboard')
            } else {
                alert('Agent Creation Failed')
            }
        }
        catch(error){
            console.log('Error: ', error)
            alert("Error submitting agent data")
        }
    }
    return(
        <>
        <div id="agent-input" className="form">
            <div id="title">
                <h1>INPUT NEW AGENT DATA</h1>
            </div>
            <section className="bg-stars">
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
                <span className="star"></span>
            </section>
            <form method="post" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="agent_name"
                    placeholder='Agent Name'
                    value={agent_name}
                    onChange={e => setAgentName(e.target.value)}
                />
                <input
                    type="date"
                    name="agent_start"
                    value={agent_start}
                    onChange={e => setAgentStart(e.target.value)}
                />
                <input
                    type="date"
                    name="agent_fin"
                    placeholder='Agent Fin'
                    value={agent_fin}
                    onChange={e => setAgentFin(e.target.value)}
                />
                <textarea
                    type="text"
                    name="agent_notes"
                    placeholder='Agent Notes'
                    value={agent_notes}
                    onChange={e => setAgentNotes(e.target.value)}
                />
                <button type="submit">Add Agent</button>

            </form>
        </div>    
        </>
    )
}