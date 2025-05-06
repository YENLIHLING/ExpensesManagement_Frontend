import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';
import './style/style.css';
import { useState, useEffect, useMemo } from 'react';
import axiosClient from './services/axiosInstance';
import { NumericFormat } from 'react-number-format';
import { PieChart } from '@mui/x-charts/PieChart';

interface IIncomesExpensesRepo {
  id: number;
  name: string;
  total_incomes: number;
  total_expenses: number;
  pctg_of_saving: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function DataGd() {
  const client = axiosClient();
  const [incomesExpenses, setIncomesExpenses] = useState<IIncomesExpensesRepo[]>([]);
  const [name, setTxtName] = useState('');
  const [totalIncomes, setTxtTotalIncomes] = useState(0);
  const [totalExpenses, setTxtTotalExpenses] = useState(0);
  const [recordChangesCount, setRecordChangesCount] = useState(0);

  const fetchIncomeExpenses = async () => {
    try {
      var response = await client.get('/ExpensesManagement/RetrieveIncomesExpenses');
      setIncomesExpenses(response.data);
    } catch (error) {
      console.error('Error fetchIncomeExpenses:', error);
    }
  };

  useEffect(() => {
    fetchIncomeExpenses();
  }, [recordChangesCount]);

  const onEditClick = (_e: any, row: any) => {
    setTxtName(row.name);
    setTxtTotalIncomes(row.total_incomes);
    setTxtTotalExpenses(row.total_expenses);
  };

  const onResetButtonClick = () => {
    setTxtName('');
    setTxtTotalIncomes(0);
    setTxtTotalExpenses(0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if ((event.target as HTMLFormElement).checkValidity()) {
      try {
        var response = await client.post('/ExpensesManagement/AddOrUpdateExpensesIncomes', {
          name: name,
          total_expenses: totalExpenses,
          total_incomes: totalIncomes,
        });
        if (response.data) {
          var result = JSON.parse(JSON.stringify(response.data));
          if (result.status > 0) {
            setRecordChangesCount(recordChangesCount + 1);
          } else {
            alert('Error: ' + result.message);
            return false;
          }
        }
      } catch (error) {
        console.error('Error post incomeExpenses:', error);
        return false;
      }

      alert('Record saved successfully!');
    } else {
      alert('Form is invalid! Please check the fields...');
      return false;
    }
  };

  const pieChartData = useMemo(() => {
    return incomesExpenses.map((incomeExpense) => ({
      id: incomeExpense.id,
      label: incomeExpense.name,
      value: incomeExpense.pctg_of_saving,
    }));
  }, [incomesExpenses]);

  const columns: GridColDef<(typeof incomesExpenses)[number]>[] = [
    { field: 'id', headerName: 'id', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
    {
      field: 'total_incomes',
      headerName: 'Total Incomes',
      type: 'number',
      width: 140,
      editable: true,
    },
    {
      field: 'total_expenses',
      headerName: 'Total Expenses',
      type: 'number',
      width: 200,
      editable: true,
    },
    {
      field: 'pctg_of_saving',
      headerName: 'Total Of Saving %',
      type: 'number',
      valueFormatter: (val) => `${val}%`,
      width: 250,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        return (
          <Button
            href="#text-buttons"
            onClick={(e) => onEditClick(e, params.row)}
            // variant="contained"
          >
            Edit
          </Button>
        );
      },
      disableExport: true,
    },
  ];

  return (
    <Box id="displayBox" sx={{ height: 400, width: '100%' }}>
      <Grid container spacing={2}>
        <Grid size={6} className="grid">
          <Box component={'form'} onSubmit={handleSubmit} noValidate>
            <Grid size={12} className="text-left-align">
              <h3>Save / Update</h3>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 4 }}>
              <Grid size={4} className="input-label">
                Name
              </Grid>
              <Grid size={8} className="text-left-align">
                <TextField
                  required
                  id="txtName"
                  label="Name"
                  onChange={(x) => setTxtName(x.target.value)}
                  value={name}
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 4 }}>
              <Grid size={4} className="input-label">
                Total Income
              </Grid>
              <Grid size={8} className="text-left-align">
                <NumericFormat
                  value={totalIncomes}
                  onChange={(x) => setTxtTotalIncomes(parseInt(x.target.value.replace(/,/g, '')))}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  variant="standard"
                  label="Total Income"
                  min="1"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 4 }}>
              <Grid size={4} className="input-label">
                Total Expenses
              </Grid>
              <Grid size={8} className="text-left-align">
                <NumericFormat
                  value={totalExpenses}
                  onChange={(x) => setTxtTotalExpenses(parseInt(x.target.value.replace(/,/g, '')))}
                  customInput={TextField}
                  thousandSeparator
                  valueIsNumericString
                  variant="standard"
                  label="Total Expenses"
                />
              </Grid>
            </Grid>
            <Grid size={12} sx={{ textAlign: 'right', marginTop: 4 }}>
              <Button type="submit" variant="contained">
                Save
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#7fc7c1', marginLeft: '20px' }}
                onClick={onResetButtonClick}>
                Reset
              </Button>
            </Grid>
          </Box>
        </Grid>
        <Grid size={6} className="grid pieChart">
          <Item id="pieChart">
            <PieChart
              series={[
                {
                  data: pieChartData,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={500}
              height={500}
            />
          </Item>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        <DataGrid
          className="dataGrid"
          rows={incomesExpenses}
          columns={columns}
          pagination
          pageSizeOptions={[10, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}
