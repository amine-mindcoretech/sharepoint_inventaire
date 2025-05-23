// src/App.js
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
// // export default App;
// import { Box, Typography } from '@mui/material';

// function App() {
//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4">Hello, SharePoint Sync!</Typography>
//     </Box>
//   );
// }

// export default App;