// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Smart Job Tracker API Running');
// });

// module.exports = app;


const userRoutes = require("./routes/user.routes");
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');


const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/jobs', jobRoutes);


module.exports = app;