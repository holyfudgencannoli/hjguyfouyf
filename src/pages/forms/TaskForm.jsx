import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaskForm() {
  const navigate = useNavigate();

  const [task_desc, setTaskDesc] = useState('');
  const [task_date, setTaskDate] = useState('');
  const [time_spent, setTimeSpent] = useState('');
  const [agent_id, setAgentId] = useState('');
  const [batch_id, setBatchId] = useState('');
  const [task_notes, setTaskNotes] = useState('');
  const [type, setType] = useState('');  

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('task_desc', task_desc);
    formData.append('task_date', task_date);
    formData.append('time_spent', time_spent);
    formData.append('agent_id', agent_id);
    formData.append('batch_id', batch_id);
    formData.append('task_notes', task_notes);
    formData.append('type', type);



    try {
      const response = await fetch('http://localhost:5000/create-task', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        if (type === 'batch') {
            console.log("Navigating with batch_id and task_date:", batch_id, task_date);
            navigate('/batch-form', { state: { batch_id: batch_id, batch_date: task_date} });  // ← use batch_id directly
        } else if (type === 'contam') {
            navigate('/contam-form', { state: { batch_id: batch_id, agent_id: agent_id, log_date: task_date} });
        } else if (type === 'innoc') {
            navigate('/innoc-form', { state: { batch_id: batch_id, agent_id: agent_id, innoc_date: task_date} });
        } else if (type === 'harvest') {
            navigate('/harvest-form')
        } else {
            alert('Please specify type')
        }
      } else {
        alert('Task creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  }

  return (
    <div id="labor-input" className="form">
      <div id="title">
        <h1>INPUT TASK DATA</h1>
      </div>
      <section className="bg-stars">
        <span className="star"></span>
        <span className="star"></span>
        <span className="star"></span>
        <span className="star"></span>
      </section>
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          name="task_desc"
          placeholder="Description"
          value={task_desc}
          onChange={e => setTaskDesc(e.target.value)}
          required
        />
        <input
          type="date"
          name="task_date"
          value={task_date}
          onChange={e => setTaskDate(e.target.value)}
          required
        />
        <input
          type="number"
          name="time_spent"
          placeholder='Minutes'
          value={time_spent}
          onChange={e => setTimeSpent(e.target.value)}
          required
        />
        <input
          type="number"
          name="agent_id"
          placeholder='Agent ID'
          value={agent_id}
          onChange={e => setAgentId(e.target.value)}
          required
        />
        <input
          type="number"
          name="batch_id"
          placeholder='Batch ID'
          value={batch_id}
          onChange={e => setBatchId(e.target.value)}
          required
        />
        <input
          type="text"
          name="type"
          value={type}
          readOnly
          required
        />
        <label>
            <input
            type="radio"
            value="batch"
            checked={setType === 'batch'}
            onChange={e => setType(e.target.value)}
            />
        Batch
        </label>
        <label>
            <input
            type="radio"
            value="innoc"
            checked={setType === 'innoc'}
            onChange={e => setType(e.target.value)}
            />
        Innoc
        </label>
        <label>
            <input
            type="radio"
            value="contam"
            checked={setType === 'contam'}
            onChange={e => setType(e.target.value)}
            />
        Contam
        </label>
        <label>
            <input
            type="radio"
            value="harvest"
            checked={setType === 'harvest'}
            onChange={e => setType(e.target.value)}
            />
        Harvest
        </label>
        <textarea
          name="task_notes"
          placeholder="Notes"
          value={task_notes}
          onChange={e => setTaskNotes(e.target.value)}
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}
