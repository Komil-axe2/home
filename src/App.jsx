import { ContentCopy, Delete, Edit, Save } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, fetchTodos, removeTodo, updateTodo } from "./core/redux/todo/todoActions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch(
        addTodo({
          title: input,
          userId: 1,
          completed: false,
        })
      );
      setInput("");
      setSnackbarMessage("Todo added successfully");
      setSnackbarOpen(true);
    }
  };

  const handleRemoveTodo = (index) => {
    setDeleteIndex(index);
    setOpenDelete(true);
  };

  const confirmRemoveTodo = () => {
    dispatch(removeTodo(todos[deleteIndex].id));
    setSnackbarMessage("Todo deleted successfully");
    setSnackbarOpen(true);
    setOpenDelete(false);
  };

  const handleEditTodo = (index, title) => {
    setEditIndex(index);
    setEditInput(title);
    setOpenEdit(true);
  };

  const handleSaveTodo = () => {
    if (editInput.trim()) {
      dispatch(
        updateTodo({
          ...todos[editIndex],
          title: editInput,
        })
      );
      setEditIndex(null);
      setEditInput("");
      setOpenEdit(false);
      setSnackbarMessage("Todo saved successfully");
      setSnackbarOpen(true);
    }
  };

  const handleCopyTodo = (title) => {
    navigator.clipboard.writeText(title);
    setSnackbarMessage("Todo copied to clipboard");
    setSnackbarOpen(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditIndex(null);
    setEditInput("");
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteIndex(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        textAlign: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Todo App
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <TextField
            label="New Todo"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddTodo}>
            Add
          </Button>
        </Box>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">Error: {error}</Typography>}
        <List>
          {todos.map((todo, index) => (
            <ListItem key={todo.id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText primary={todo.title} />
              <Box>
                <IconButton color="primary" onClick={() => handleEditTodo(index, todo.title)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleRemoveTodo(index)}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Todo
          </Typography>
          <TextField
            id="edit-todo"
            label="Todo"
            variant="outlined"
            fullWidth
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSaveTodo} startIcon={<Save />}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCloseEdit} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Todo
          </Typography>
          {deleteIndex !== null && (
            <>
              <TextField
                id="delete-todo"
                label="Todo"
                variant="outlined"
                fullWidth
                value={todos[deleteIndex].title}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mt: 2, mb: 2 }}
              />
              <IconButton color="default" onClick={() => handleCopyTodo(todos[deleteIndex].title)}>
                <ContentCopy />
              </IconButton>
              <Button variant="contained" color="secondary" onClick={confirmRemoveTodo} startIcon={<Delete />}>
                Delete
              </Button>
              <Button variant="outlined" color="primary" onClick={handleCloseDelete} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
