import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
// import './DataTable.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'task_desc', headerName: 'Description', width: 200 },
  { field: 'task_date', headerName: 'Date', width: 150 },
  { field: 'time_spent', headerName: 'Minutes', width: 120 },
  { field: 'task_notes', headerName: 'Notes', width: 120 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'agent_id', headerName: 'Agent', width: 120 },
  { field: 'batch_id', headerName: 'Batch ID', width: 120 }
];

export default function TaskLog({ tasks }) {
  // Convert batches into DataGrid-compatible rows
  const rows = tasks.map((task, index) => ({
    id: task.task_id,
    task_desc: task.task_desc,
    task_date: task.task_date,
    time_spent: task.time_spent,
    task_notes: task.task_notes,
    type: task.type,
    agent_id: task.agent_id,
    batch_id: task.batch_id
  }));

  return (
    <div id="TaskLog">
        <h1>Task Log</h1>
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
            className="data-table"
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                paginationModel: {
                    pageSize: 5,
                },
                },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            />
        </Box>
    </div>
  );
}
