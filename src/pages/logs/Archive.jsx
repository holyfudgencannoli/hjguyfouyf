import { useEffect, useState } from 'react';
import TaskLog from './TaskLog';
import ProdLog from './ProdLog';
import BatchLog from './BatchLog';

export default function Archive() {
  const [archiveData, setArchiveData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/archive-data');
        const data = await response.json();
        console.log('Data from Flask:', data);
        setArchiveData(data);  // store data in state
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className='TaskLog'>
      <h1>Archive Page</h1>
      {archiveData ? (
        <TaskLog tasks={archiveData.tasks}/>
      ) : (
        <p>Loading...</p>
      )}
      {archiveData ? (
        <BatchLog batches={archiveData.batches}/>
      ) : (
        <p>Loading...</p>
      )}
      {archiveData ? (
        <ProdLog products={archiveData.products}/>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
