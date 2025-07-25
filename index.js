const cluster = require('cluster');
const os = require('os');
const express = require('express');

const solveRoutes = require('./routes/solve');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...\n`);

    for (let i = 0; i < numCPUs; i++) {
        setTimeout(() => {
            cluster.fork()
        }, i*90);
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new worker.`);
        cluster.fork();
    });

} else {
    const app = express();
    app.use(express.json());

    app.use('/solve', solveRoutes);
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started server on port ${PORT}`);
    });
}
