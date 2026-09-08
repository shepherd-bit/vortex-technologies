import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BlogDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/blogs/${id}`)
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blog detail:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-12 text-center text-gray-500 font-sans">Loading article...</div>;
    if (!data || !data.blog) return <div className="p-12 text-center text-gray-500 font-sans">Article not found.</div>;

    const { blog, tableOfContents, attachments } = data;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 font-sans text-gray-900">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 inline-flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors"
            >
                ← Back to Updates
            </button>

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{blog.date_posted}</span>
                    <span className="text-xs font-bold uppercase px-3 py-1 bg-lime-300 text-black rounded-full">
                        {blog.category}
                    </span>
                    <span className="text-xs text-gray-400">• {blog.read_time}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{blog.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{blog.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {blog.thumbnail_image && (
                        <img 
                            src={`http://localhost:5000/${blog.thumbnail_image}`} 
                            alt={blog.title}
                            className="w-full h-80 object-cover rounded-2xl border border-gray-200 shadow-md"
                        />
                    )}

                    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
                        <div dangerouslySetInnerHTML={{ __html: blog.body_content }} />
                    </div>

                    {/* Attachments Section */}
                    {attachments && attachments.length > 0 && (
                        <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Attached Documents & Media</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {attachments.map(att => (
                                    <a 
                                        key={att.id}
                                        href={`http://localhost:5000/${att.file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="truncate pr-2">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{att.file_name}</p>
                                            <p className="text-xs text-gray-500 uppercase">{att.file_type} • {att.file_size}</p>
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1 bg-black text-white rounded-lg">View</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Table of Contents Sidebar */}
                <div className="lg:col-span-1">
                    {tableOfContents && tableOfContents.length > 0 && (
                        <div className="sticky top-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Table of Contents</h4>
                            <ul className="space-y-3">
                                {tableOfContents.map(toc => (
                                    <li key={toc.id}>
                                        <a 
                                            href={`#${toc.anchor_link}`}
                                            className="text-sm text-gray-600 hover:text-black font-medium transition-colors block"
                                        >
                                            {toc.heading_text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}