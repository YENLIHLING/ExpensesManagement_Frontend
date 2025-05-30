import './App.css';
import { Box, Container } from '@mui/material';
import DataGd from './DataGd';

function App() {
  return (
    <>
      <Container
        id="mainContainer"
        maxWidth={false}
        sx={{
          width: '100%', // Full width
        }}>
        <Box id="boxInColor">
          <DataGd />
        </Box>
      </Container>
    </>
  );
}
export default App;
