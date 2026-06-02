// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Smart Job Tracker API Running');
// });

// module.exports = app;


// const userRoutes = require("./routes/user.routes");
// const express = require('express');
// const cors = require('cors');

// const authRoutes = require('./routes/auth.routes');
// const jobRoutes = require('./routes/job.routes');


// const app = express();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// app.use('/api/auth', authRoutes);
// app.use("/api/users", userRoutes);
// app.use('/api/jobs', jobRoutes);


// module.exports = app;




const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Job Tracker API Running 🚀'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;