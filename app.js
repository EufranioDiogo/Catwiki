const { raw } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(201).sendFile('public/index.html', { root: __dirname })
})



app.listen(PORT)