const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration for PDF files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// POST: Upload a new investor memo (Admin GUI action)
app.post('/api/memos', upload.single('pdf'), async (req, res) => {
  try {
    const { quarter, page_count } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const file_name = req.file.originalname;
    const file_path = req.file.path;

    const query = `
      INSERT INTO investor_memos (file_name, file_path, quarter, page_count)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const values = [file_name, file_path, quarter, page_count];
    const newMemo = await pool.query(query, values);

    res.status(201).json({
      message: 'Investor memo posted successfully',
      memo: newMemo.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while posting memo' });
  }
});

// GET: Fetch all investor memos for the frontend display
app.get('/api/memos', async (req, res) => {
  try {
    const memos = await pool.query('SELECT * FROM investor_memos ORDER BY id DESC');
    res.json(memos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while fetching memos' });
  }
});

// GET: Download a specific PDF file
app.get('/api/memos/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memo = await pool.query('SELECT * FROM investor_memos WHERE id = $1', [id]);

    if (memo.rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }

    const filePath = path.resolve(memo.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      res.download(filePath, memo.rows[0].file_name);
    } else {
      res.status(404).json({ error: 'File not found on server' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during download' });
  }
});

// DELETE: Remove an investor memo entry and its file
app.delete('/api/memos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memo = await pool.query('SELECT * FROM investor_memos WHERE id = $1', [id]);

    if (memo.rows.length === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }

    const filePath = path.resolve(memo.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM investor_memos WHERE id = $1', [id]);
    res.json({ message: 'Memo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while deleting memo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});