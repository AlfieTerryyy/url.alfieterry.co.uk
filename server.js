const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/create-redirect', (req, res) => {
    const originalUrl = req.body.original_url;
    const redirectUrl = req.body.redirect_url;

    // Store the redirect URLs in a file
    fs.appendFileSync('redirects.txt', `${originalUrl},${redirectUrl}\n`);
    res.send('Redirect created successfully!');
});

app.get('*', (req, res) => {
    const requestedUrl = req.originalUrl;
    const redirects = fs.readFileSync('redirects.txt', 'utf-8').split('\n');

    for (const redirect of redirects) {
        const [originalUrl, redirectUrl] = redirect.split(',');
        if (requestedUrl === originalUrl) {
            res.redirect(301, redirectUrl);
            return;
        }
    }

    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
