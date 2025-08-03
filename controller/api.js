
const Cube = require('../3X3/index');
Cube.initSolver();

const { redisClient, connectRedis } = require('../redis/redisClient');

module.exports.Path = async (req, res) => {
    try {
        let path = req.body.scramble;
        const key = encodeURIComponent(path);
        await connectRedis();
        const cached = await redisClient.get(key);
        if (cached) {
            // console.log("Cache hit for key:");
            return res.status(200).json({
                message: "Solution from cache",
                solution: JSON.parse(cached)
            });
        }

        // Solve if not in cache
        // console.log("Cache miss for key:");
        let cube = new Cube();
        cube.move(path);
        const solution = cube.solve();

        // Store in Redis with 2s expiry
        await redisClient.set(key, JSON.stringify(solution), { EX: 20 });

        res.status(200).json({
            message: "Solution computed",
            solution
        });
    } catch (err) {
        console.error("Error in /api/path:", err);
        res.status(400).json({ error: err.message });
    }
};
