const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json()); // req.body

// ROUTES
// Create to do
app.post('/todos', async(req,res) => {
    try{
        const { description } = req.body;
        const newTodo = await pool.query(
            'INSERT INTO todo (description) VALUES($1) RETURNING *'
            ,[description]);
        res.json(newTodo.rows[0]);
    } catch(err){
        console.log(err.message);
    }
});

// Get all todos 
app.get('/todos', async(req,res) => {
    try {
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows);
    } catch (error) {
        console.log(error.message);
    }
});

// Get a todo
app.get('/todos/:id', async(req,res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query(
            'SELECT * FROM todo WHERE todo_id = $1',
            [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
});


// Update to do
app.put('/todos/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateToDo = await pool.query(
            'UPDATE todo SET description = $1 WHERE todo_id = $2',
            [description, id]
            );
        res.json('Todo was updated!');
    } catch (error) {
        console.log(error.message);
    }
});


// delete to do
app.delete('/todos/:id',async(req,res) => {
    try {
        const {id} = req.params;
        const deleteTodo  = await pool.query(
            'DELETE FROM todo WHERE todo_id = $1',
            [id]
            );
        res.json(`Todo ${id} data is deleted`);
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(4000, () => {
    console.log(`server has started on port num 4000`);
});