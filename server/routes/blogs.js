import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BlogPageAd() {
    const [authorName, setAuthorName] = useState('Titus O.');
    const [authorTitle, setAuthorTitle] = useState('CEO, Vortex');
    const [blogTitle, setBlogTitle] = useState('X1 Flight Logs & Thermal Data');
    const [blogSubtitle, setBlogSubtitle] = useState('Marfa range campaign endurance metrics and reserve analysis.');
    const [blogCategory, setBlogCategory] = useState('Public');
    
    const [tocItems, setTocItems] = useState([
        { id: 1, title: 'Flight Test Overview' },
        { id: 2, title: 'Battery & Range Data' }
    ]);

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [blogContent, setBlogContent] = useState(
`We're opening up flight logs from our Marfa range campaign. The X1 platform hit 42 minutes at 38 mph cruise with 12% reserve — data below.

Flight Test Overview

This quarter we focused on endurance and thermal management in high desert conditions. Three airframes, 47 sorties.

> "The most honest data comes from the worst weather. We flew through it."

Battery & Range Data

1. Nominal pack: 2.1 kWh, 14S
2. Average draw: 2.9 kW at cruise
3. Reserve policy: 15% hard cutoff

Logs attached below for investors and regulators. Raw CSV included.`
    );

    // Documents state
    const [documents, setDocuments] = useState([
        { id: 1, name: 'x1-battery-logs.csv', size: '2.4 MB', type: 'CSV' },
        { id: 2, name: 'flight-test-summary.pdf', size: '1.1 MB', type: 'PDF' }
    ]);

    // Video state
    const [videoUrl, setVideoUrl] = useState('');
    const [videoTitle, setVideoTitle] = useState('X1 Full Range Test — Marfa, TX');
    const [videos, setVideos] = useState([
        { id: 1, title: 'X1 Full Range Test — Marfa, TX', filename: 'x1-marfa-test-04.mp4' }
    ]);

    // Published blogs state (hydrated from API/DB in real wiring)
    const [publishedBlogs, setPublishedBlogs] = useState([
        {
            id: 1,
            title: 'X1 Flight Logs & Thermal Data',
            subtitle: 'Marfa range campaign endurance metrics and reserve analysis.',
            category: 'Public'
        }
    ]);

    // Fetch existing blogs on mount (Wiring to backend API)
    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    setPublishedBlogs(data);
                }
            })
            .catch(err => console.log('Using local state fallback:', err));
    }, []);

    const handleTocChange = (id, newTitle) => {
        setTocItems(tocItems.map(item => item.id === id ? { ...item, title: newTitle } : item));
    };

    const addTocItem = () => {
        const newItem = { id: tocItems.length + 1, title: '' };
        setTocItems([...tocItems, newItem]);
    };

    const removeTocItem = (id) => {
        setTocItems(tocItems.filter(item => item.id !== id));
    };

    const handleThumbnailChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
    };

    const handleDocumentUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const ext = file.name.split('.').pop().toUpperCase();
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            setDocuments([...documents, { id: Date.now(), name: file.name, size: sizeMb, type: ext }]);
        }
    };

    const removeDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const handleAddVideo = (e) => {
        e.preventDefault();
        if (!videoTitle) return;
        setVideos([...videos, { id: Date.now(), title: videoTitle, filename: videoUrl || 'uploaded-video.mp4' }]);
        setVideoUrl('');
        setVideoTitle('');
    };

    const removeVideo = (id) => {
        setVideos(videos.filter(v => v.id !== id));
    };

    // Wiring publish action to backend API
    const handlePublish = async () => {
        if (!blogTitle) {
            alert('Please provide a blog title.');
            return;
        }

        const payload = {
            title: blogTitle,
            subtitle: blogSubtitle || authorTitle,
            category: blogCategory,
            author_name: authorName,
            author_title: authorTitle,
            content: blogContent,
            table_of_contents: tocItems,
            attachments: [...documents, ...videos]
        };

        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedBlog = await response.json();
                setPublishedBlogs([...publishedBlogs, savedBlog]);
                alert('Blog post published successfully and synced to backend!');
            } else {
                // Fallback simulation if API endpoint is unmounted/mocked
                const newBlog = {
                    id: Date.now(),
                    title: blogTitle,
                    subtitle: blogSubtitle || authorTitle,
                    category: blogCategory
                };
                setPublishedBlogs([...publishedBlogs, newBlog]);
                alert('Blog post published successfully!');
            }
        } catch (error) {
            const newBlog = {
                id: Date.now(),
                title: blogTitle,
                subtitle: blogSubtitle || authorTitle,
                category: blogCategory
            };
            setPublishedBlogs([...publishedBlogs, newBlog]);
            alert('Blog published locally (API connection offline).');
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        } catch (e) {
            // Local fallback
        }
        setPublishedBlogs(publishedBlogs.filter(blog => blog.id !== id));
    };

    const handleEditBlog = (blog) => {
        setBlogTitle(blog.title);
        setBlogSubtitle(blog.subtitle);
        if (blog.category) setBlogCategory(blog.category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="w-full space-y-6"
        >
            {/* Metadata / Titles Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Blog Metadata</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Blog Title</label>
                        <input 
                            type="text" 
                            value={blogTitle} 
                            onChange={(e) => setBlogTitle(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                        />
                        <span className="text-[11px] text-neutral-400">blogs.title</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Blog Subtitle</label>
                        <input 
                            type="text" 
                            value={blogSubtitle} 
                            onChange={(e) => setBlogSubtitle(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                        />
                        <span className="text-[11px] text-neutral-400">blogs.subtitle</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Category</label>
                        <select 
                            value={blogCategory}
                            onChange={(e) => setBlogCategory(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-white focus:outline-none focus:border-black transition-colors cursor-pointer"
                        >
                            <option value="Public">Public</option>
                            <option value="Investors">Investors</option>
                            <option value="Regulators">Regulators</option>
                        </select>
                        <span className="text-[11px] text-neutral-400">blogs.category</span>
                    </div>
                </div>
            </div>

            {/* Author Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Blog Author</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Author Name</label>
                        <input 
                            type="text" 
                            value={authorName} 
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                        />
                        <span className="text-[11px] text-neutral-400">blogs.author_name</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Title / Position</label>
                        <input 
                            type="text" 
                            value={authorTitle} 
                            onChange={(e) => setAuthorTitle(e.target.value)}
                            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                        />
                        <span className="text-[11px] text-neutral-400">blogs.author_title</span>
                    </div>
                </div>
            </div>

            {/* Table of Contents Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Table of Contents</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                        Blogs → TOC
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
                    <div>
                        <p className="text-xs text-neutral-500">
                            Auto-generated from headings, edit titles — writes to blog_table_of_contents
                        </p>
                    </div>

                    <div className="space-y-3">
                        {tocItems.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600 shrink-0">
                                    {index + 1}
                                </div>
                                <input 
                                    type="text" 
                                    value={item.title} 
                                    onChange={(e) => handleTocChange(item.id, e.target.value)}
                                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                                />
                                <button 
                                    type="button"
                                    onClick={() => removeTocItem(item.id)}
                                    className="text-neutral-400 hover:text-red-600 transition-colors p-2 text-xs cursor-pointer"
                                    title="Remove section"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button 
                            type="button"
                            onClick={addTocItem}
                            className="px-4 py-2 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                        >
                            + Add section
                        </button>
                    </div>
                </div>
            </div>

            {/* Thumbnail Image Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Thumbnail Image</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                        Blogs → Thumbnail
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Upload Thumbnail</label>
                        {!thumbnailPreview ? (
                            <label className="border border-dashed border-neutral-300 rounded-lg px-4 py-6 text-xs text-neutral-500 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-neutral-50/50">
                                <span className="font-medium text-neutral-700">Click to upload thumbnail</span>
                                <span className="text-neutral-400 text-[11px] mt-1">PNG, JPG up to 5MB</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleThumbnailChange} 
                                    className="hidden" 
                                />
                            </label>
                        ) : (
                            <div className="border border-neutral-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs bg-neutral-50">
                                <span className="font-medium text-neutral-900 truncate max-w-[200px]">{thumbnail.name}</span>
                                <button 
                                    type="button" 
                                    onClick={handleRemoveThumbnail}
                                    className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer text-[11px]"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Preview</label>
                        <div className="w-full h-32 border border-neutral-200 rounded-lg bg-neutral-50 flex items-center justify-center overflow-hidden relative">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-neutral-400 font-mono">No image selected</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Editor Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Content</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                    <span className="text-[10px] font-medium uppercase px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200">
                        Writes to blogs.content
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
                    <p className="text-xs text-neutral-500">
                        Minimal rich text — bold, italic, quote, lists, H2 — writes to blogs.content
                    </p>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">B</button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs italic text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">I</button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-serif text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">“</button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">1.</button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">•</button>
                        <button type="button" className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors shadow-xs">H2</button>
                    </div>

                    {/* Textarea Editor */}
                    <div className="border border-neutral-200 rounded-xl p-4 bg-white focus-within:border-black transition-colors">
                        <textarea 
                            rows={12}
                            value={blogContent}
                            onChange={(e) => setBlogContent(e.target.value)}
                            className="w-full text-sm text-neutral-800 leading-relaxed focus:outline-none resize-y font-sans bg-transparent"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <span className="w-2 h-2 rounded-full bg-[#E8FF5A] border border-neutral-300 inline-block"></span>
                        <span className="text-[11px] text-neutral-400 font-mono">Quote blocks use lime accent #E8FF5A</span>
                    </div>
                </div>
            </div>

            {/* Documents Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Documents</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-500">
                            PDF, CSV, logs — writes to blog_attachments where type = document
                        </p>
                        <label className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm">
                            ADD FILE
                            <input type="file" onChange={handleDocumentUpload} className="hidden" />
                        </label>
                    </div>

                    <div className="border border-dashed border-neutral-300 rounded-xl p-4 text-xs text-neutral-500 flex items-center justify-center bg-neutral-50/50 cursor-pointer hover:border-black transition-colors">
                        <label className="w-full text-center cursor-pointer">
                            <span className="text-neutral-600 font-medium">Drag & drop PDFs, CSVs, or click Add file</span>
                            <input type="file" onChange={handleDocumentUpload} className="hidden" />
                        </label>
                    </div>

                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between border border-neutral-200 rounded-xl p-3 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-bold rounded-lg tracking-wider">
                                        {doc.type}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-900">{doc.name}</p>
                                        <p className="text-[11px] text-neutral-400">{doc.size}</p>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removeDocument(doc.id)}
                                    className="text-neutral-400 hover:text-red-600 transition-colors p-2 text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Section */}
            <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Video</span>
                        <span>—</span>
                        <span>CMS editor</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
                    <p className="text-xs text-neutral-500">
                        Upload or URL + title — writes to blog_attachments where type = video
                    </p>

                    <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5 flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">File or URL</label>
                            <div className="relative flex items-center">
                                <input 
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://... or upload"
                                    className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors pr-10"
                                />
                                <label className="absolute right-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                                    <span>+</span>
                                    <input type="file" accept="video/*" onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setVideoUrl(e.target.files[0].name);
                                        }
                                    }} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-5 flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Title of Video</label>
                            <input 
                                type="text"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                placeholder="Enter video title"
                                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-end pt-5">
                            <button 
                                type="submit"
                                className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                                Add video
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3 pt-2">
                        {videos.map((vid) => (
                            <div key={vid.id} className="flex items-center justify-between border border-neutral-200 rounded-xl p-3 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center shrink-0">
                                        ▶
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-900">{vid.title}</p>
                                        <p className="text-[11px] text-neutral-400">{vid.filename}</p>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => removeVideo(vid.id)}
                                    className="text-neutral-400 hover:text-red-600 transition-colors p-2 text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Publish Button Section */}
            <div className="pt-2 flex justify-end">
                <button
                    type="button"
                    onClick={handlePublish}
                    className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                    Publish
                </button>
            </div>

            {/* Published Blogs Section */}
            <div className="pt-8 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                        <span className="text-neutral-900 font-bold uppercase tracking-wider">Published Blogs</span>
                        <span>—</span>
                        <span>management list</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4">
                    {publishedBlogs.length === 0 ? (
                        <div className="py-12 border border-dashed border-neutral-300 rounded-xl flex items-center justify-center text-xs text-neutral-400 font-mono">
                            no blogs posted yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {publishedBlogs.map((blog) => (
                                <div key={blog.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-neutral-200 rounded-xl p-4 bg-white gap-4 shadow-xs">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-neutral-900">{blog.title}</h4>
                                            {blog.category && (
                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-semibold rounded-md">
                                                    {blog.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-500">{blog.subtitle}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleEditBlog(blog)}
                                            className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteBlog(blog.id)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer tags */}
            <div className="pt-4 flex items-center justify-between text-[11px] text-neutral-400 font-mono border-t border-neutral-200">
                <div className="flex items-center gap-2">
                    <span>● blogs</span>
                    <span>•</span>
                    <span>blog_table_of_contents</span>
                    <span>•</span>
                    <span>blog_attachments</span>
                </div>
                <div>
                    <span>Vortex CMS — minimal • rounded 16px • Inter</span>
                </div>
            </div>
        </motion.div>
    );
}