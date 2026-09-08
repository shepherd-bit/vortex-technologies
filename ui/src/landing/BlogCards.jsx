import { useState, useEffect } from 'react';

export default function BlogCards({ category = 'all', onSelectBlog }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blogs:', err);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = category === 'all' 
        ? blogs 
        : blogs.filter(b => b.category.toLowerCase() === category.toLowerCase());

    if (loading) return <div className="p-8 text-center text-gray-500 font-sans">Loading updates...</div>;

    const heroPost = filteredBlogs[0];
    const gridPosts = filteredBlogs.slice(1);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
            {filteredBlogs.length === 0 ? (
                <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                    No updates found in this category.
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Hero Card (Index 0) */}
                    {heroPost && (
                        <div 
                            onClick={() => onSelectBlog(heroPost.id)}
                            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{heroPost.date_posted}</span>
                                    <span className="text-xs font-bold uppercase px-3 py-1 bg-lime-300 text-black rounded-full">
                                        {heroPost.category}
                                    </span>
                                    <span className="text-xs text-gray-400">• {heroPost.read_time}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                                    {heroPost.title}
                                </h1>
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                                    {heroPost.subtitle}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Grid Posts (Index > 0) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gridPosts.map(post => (
                            <div 
                                key={post.id}
                                onClick={() => onSelectBlog(post.id)}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{post.date_posted}</span>
                                        <span className="text-xs font-bold uppercase px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                                            {post.category}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {post.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}