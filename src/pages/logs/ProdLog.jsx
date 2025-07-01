import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
// import './DataTable.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'prod_desc', headerName: 'Description', width: 200 },
  { field: 'prod_wght', headerName: 'Weight', width: 150 },
  { field: 'prod_wunit', headerName: 'Unit', width: 120 },
  { field: 'prod_vol', headerName: 'Volume', width: 120 },
  { field: 'prod_vunit', headerName: 'Unit', width: 120 },
  { field: 'spec_label', headerName: 'Label', width: 120 },
  { field: 'prod_date', headerName: 'Date', width: 120 },
  { field: 'batch_id', headerName: 'Batch ID', width: 120 },
];

export default function ProdLog({ products }) {
  // Convert batches into DataGrid-compatible rows
  const rows = products.map((product, index) => ({
    id: product.prod_id,
    prod_desc: product.prod_desc,
    prod_wght: product.prod_wght,
    prod_wunit: product.prod_wunit,
    prod_vol: product.prod_vol,
    prod_vunit: product.prod_vunit,
    spec_label: product.spec_label,
    prod_date: product.prod_date,
    batch_id: product.batch_id
  }));

  return (
    <div id="TaskLog">
        <h1>Product List</h1>
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
