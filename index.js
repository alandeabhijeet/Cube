require('dotenv').config();

const cors = require('cors'); 
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const apiRoutes = require('./routes/api');
const { connectRedis } = require('./redis/redisClient');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...\n`);

    // Connect Redis once in master (optional, if you want to preload or check connection)
    (async () => {
        try {
            await connectRedis();
            console.log('✅ Redis connected in master');
        } catch (err) {
            console.error('❌ Redis connection failed in master:', err);
        }

        // Fork workers
        for (let i = 0; i < numCPUs; i++) {
            setTimeout(() => {
                cluster.fork();
            }, i * 50);
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Starting a new worker.`);
            cluster.fork();
        });
    })();

} else {
    const app = express();

    app.use(cors({
        origin: '*', // Can change this to your allowed domains
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));

    app.use(express.json());
    app.use('/api', apiRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Worker ${process.pid} started server on port ${PORT}`);
    });
}
