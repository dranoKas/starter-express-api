const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('docx'), async (req, res) => {
  try {
     const buffer = req.file.buffer;
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    const words = text.split(/\s+/).filter(Boolean).length;

    res.json({ wordCount: words });
  } catch (error) {
    console.error('Error parsing the DOCX file:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
