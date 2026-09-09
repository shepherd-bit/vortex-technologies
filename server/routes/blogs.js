const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path to db.js if routes folder is nested

// GET all blogs (for the main card listing, sorted latest first)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM blogs ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET a single blog with its table of contents and attachments (for Detail View)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const blogQuery = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (blogQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        const tocQuery = await pool.query(
            'SELECT * FROM blog_table_of_contents WHERE blog_id = $1 ORDER BY display_order ASC',
            [id]
        );

        const attachmentsQuery = await pool.query(
            'SELECT * FROM blog_attachments WHERE blog_id = $1',
            [id]
        );

        res.json({
            blog: blogQuery.rows[0],
            tableOfContents: tocQuery.rows,
            attachments: attachmentsQuery.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new blog (supports inserting core info, table of contents, and attachments)
router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            category,
            date_posted,
            read_time,
            title,
            subtitle,
            body_content,
            thumbnail_image,
            tableOfContents, // Array of { heading_text, anchor_link, display_order }
            attachments     // Array of { file_name, file_type, file_size, file_path, is_inline }
        } = req.body;

        // 1. Insert into core blogs table
        const blogResult = await client.query(
            `INSERT INTO blogs (category, date_posted, read_time, title, subtitle, body_content, thumbnail_image) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [category, date_posted, read_time, title, subtitle, body_content, thumbnail_image]
        );
        const newBlog = blogResult.rows[0];
        const blogId = newBlog.id;

        // 2. Insert Table of Contents if provided
        if (tableOfContents && tableOfContents.length > 0) {
            for (const toc of tableOfContents) {
                await client.query(
                    `INSERT INTO blog_table_of_contents (blog_id, heading_text, anchor_link, display_order) 
                     VALUES ($1, $2, $3, $4)`,
                    [blogId, toc.heading_text, toc.anchor_link, toc.display_order]
                );
            }
        }

        // 3. Insert Attachments if provided
        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                await client.query(
                    `INSERT INTO blog_attachments (blog_id, file_name, file_type, file_size, file_path, is_inline) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [blogId, att.file_name, att.file_type, att.file_size, att.file_path, att.is_inline || false]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        client.release();
    }
});

// UPDATE an existing blog
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            category,
            date_posted,
            read_time,
            title,
            subtitle,
            body_content,
            thumbnail_image
        } = req.body;

        const updateResult = await pool.query(
            `UPDATE blogs 
             SET category = $1, date_posted = $2, read_time = $3, title = $4, subtitle = $5, body_content = $6, thumbnail_image = $7 
             WHERE id = $8 RETURNING *`,
            [category, date_posted, read_time, title, subtitle, body_content, thumbnail_image, id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json({ message: 'Blog updated successfully', blog: updateResult.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE a blog post (Cascade will automatically clean up TOC and attachments)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteResult = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;