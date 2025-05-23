
// src/pages/Dashboard.jsx
import { Typography, Box } from '@mui/material';
import SyncCard from '../components/SyncCard';
import SequentialSync from '../components/SequentialSync';

function Dashboard() {
  const syncTasks = [
    { label: 'Upload the data from Genius and update the genius_tbl_invitemslocori table', endpoint: '/sync-genius-Tbl-InvItemsLocOri' },
    { label: 'Upload the data from Genius and update the genius_tbl_items table', endpoint: '/sync-genius-Tbl-Items' },
    { label: 'Upload the data from SharePoint and update the sharepoint_tbl_invitemslocori', endpoint: '/sync-sharepoint-Tbl-InvItemsLocOri' },
    { label: 'Upload the data from SharePoint and update the sharepoint_tbl_items table', endpoint: '/sync-sharepoint-Tbl-Items' },
    { label: 'Delete and Replace Tbl_InvItemsLocOri List with Genius', endpoint: '/replace-with-genius-Tbl-InvItemsLocOri' },
    { label: 'Delete and Replace Tbl_Items List with Genius', endpoint: '/replace-with-genius-Tbl-Items' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
        Synchronization Dashboard
      </Typography>
      <SequentialSync syncTasks={syncTasks} />
      <Box sx={{ mt: 4 }}>
        {syncTasks.map((task) => (
          <SyncCard key={task.label} title={task.label} endpoint={task.endpoint} />
        ))}
      </Box>
    </Box>
  );
}

export default Dashboard;