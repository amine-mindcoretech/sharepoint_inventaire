// src/components/SequentialSync.jsx
import { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function SequentialSync({ syncTasks }) {
  const [running, setRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const MAX_RETRIES = 3;

  const addLog = (message, severity = 'info') => {
    setLogs((prev) => [...prev, { message, severity, timestamp: new Date() }]);
  };

  const runTask = async (task, attempt = 1) => {
    addLog(`Starting ${task.label} (Attempt ${attempt}/${MAX_RETRIES})...`);
    try {
      const response = await axios.get(`http://localhost:5000/api/sharepoint-tbl-invitems-locori${task.endpoint}`);
      addLog(`${task.label} completed successfully: ${response.data.message}`, 'success');
      return { success: true, response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      addLog(`${task.label} failed: ${errorMessage}`, 'error');
      if (attempt < MAX_RETRIES) {
        addLog(`Retrying ${task.label} (Attempt ${attempt + 1}/${MAX_RETRIES})...`, 'warning');
        return await runTask(task, attempt + 1);
      }
      addLog(`${task.label} failed after ${MAX_RETRIES} attempts.`, 'error');
      return { success: false, error: errorMessage };
    }
  };

  const runSequentialSync = async () => {
    setRunning(true);
    setLogs([]);
    setCurrentTask(null);

    for (const task of syncTasks) {
      setCurrentTask(task.label);
      const result = await runTask(task);
      if (!result.success) {
        addLog(`Stopping sequential sync due to failure in ${task.label}.`, 'error');
        break;
      }
    }

    setRunning(false);
    setCurrentTask(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={runSequentialSync}
        disabled={running}
        startIcon={running ? <CircularProgress size={20} /> : null}
        sx={{ mb: 2 }}
      >
        {running ? `Running: ${currentTask || '...'}` : 'Run Sequential Sync'}
      </Button>
      {logs.length > 0 && (
        <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 2 }}>
          {logs.map((log, index) => (
            <Alert key={index} severity={log.severity} sx={{ mb: 1 }}>
              [{log.timestamp.toLocaleTimeString()}] {log.message}
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SequentialSync;