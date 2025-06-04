// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Modal,
  TextField,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const statuses = ['in progress', 'complete', 'finish'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
};

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'in progress',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId || userId === 'undefined') {
      navigate('/');
      return;
    }
    setUsername(localStorage.getItem('username') || '');
    fetchTasks();
  }, [navigate, sortBy]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks?userId=${userId}&sortBy=${sortBy}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      const formattedDueDate = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '';
      setForm({ ...task, dueDate: formattedDueDate });
    } else {
      setEditingTask(null);
      setForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'in progress' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const formattedForm = {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };

      if (editingTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, formattedForm);
      } else {
        await axios.post(`http://localhost:5000/api/tasks`, { ...formattedForm, userId });
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Your Tasks</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="createdAt">Created</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => openModal()}>
            Add Task
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {statuses.map((status) => (
            <Grid item xs={12} md={4} key={status}>
              <Typography variant="h6" textAlign="center" gutterBottom>
                {status.toUpperCase()}
              </Typography>
              <Droppable droppableId={status}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 300, backgroundColor: '#f4f4f4', p: 2, borderRadius: 1 }}
                  >
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Typography fontWeight="bold">{task.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {task.description}
                                </Typography>
                                <Typography variant="caption">Priority: {task.priority}</Typography>
                                <Typography variant="caption" display="block">
                                  Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Not set'}
                                </Typography>
                                <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
                                  <IconButton size="small" onClick={() => openModal(task)}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => deleteTask(task._id)}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" gutterBottom>
            {editingTask ? 'Edit Task' : 'New Task'}
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Due Date"
            type="datetime-local"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
            {editingTask ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default Dashboard;