import express from 'express';
import morgan from 'morgan';
import path from 'path';
import queryEngine from './queryEngine/init';


const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/query', (req, res) => {
    console.log(new queryEngine());
    console.log(req.query);
    res.send('hello world from query engine');
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;