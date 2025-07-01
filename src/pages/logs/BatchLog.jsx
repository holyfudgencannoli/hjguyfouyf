import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
// import './DataTable.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'batch_desc', headerName: 'Description', width: 200 },
  { field: 'batch_date', headerName: 'Date', width: 150 },
  { field: 'item_qty', headerName: 'Item Qty', width: 120 },
];

export default function BatchLog({ batches }) {
  // Convert batches into DataGrid-compatible rows
  const rows = batches.map((batch, index) => ({
    id: batch.batch_id,
    batch_desc: batch.batch_desc,
    batch_date: batch.batch_date,
    item_qty: batch.item_qty,
  }));

  return (
    <div id="TaskLog">
        <h1>Batch Log</h1>
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
