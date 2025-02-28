require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const taskSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    completed: Boolean
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    
    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

app.post('/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.post('/tasks', authenticate, async (req, res) => {
    const task = new Task({ userId: req.user.userId, ...req.body });
    await task.save();
    res.status(201).json(task);
});

app.get('/tasks', authenticate, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
});

app.get('/tasks/:id', authenticate, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

app.put('/tasks/:id', authenticate, async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
});

app.listen(5000, () => console.log('Server running on port 5000'));