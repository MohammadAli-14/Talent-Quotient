import express from 'express';
import {ENV} from "./lib/env.js";

const app = express();

console.log('Environment Variables:', ENV.PORT)

app.get('/health', (req, res) => {
   res.status(200).json({ message: 'Api is up & running' });
});

app.listen(ENV.PORT, () => {
console.log('Server is listening on port:', ENV.PORT);
});
   