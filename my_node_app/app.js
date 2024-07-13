const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/submit', (req, res) => {
    const { name, data } = req.body;

    // PDF oluşturma
    const doc = new PDFDocument();
    const filePath = `./public/${name}_data.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    doc.fontSize(25).text('User Data', {
        align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(18).text(`Name: ${name}`);
    doc.text(`Data: ${data}`);
    
    doc.end();
    
    stream.on('finish', () => {
        res.json({ message: 'Data saved successfully', pdf: `${name}_data.pdf` });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
