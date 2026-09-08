
import { useNavigate } from 'react-router-dom';
import BlogCards from '../landing/BlogCards';

export default function BlogPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans">
            <div>
                <main className="py-12">
                    <div className="max-w-6xl mx-auto px-4 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Vortex Updates & Memos</h1>
                        <p className="text-gray-600 mt-2">Explore our latest engineering logs, financial milestones, and investor reports.</p>
                    </div>
                    <BlogCards onSelectBlog={(id) => navigate(`/blog/${id}`)} />
                </main>
            </div>
            
        </div>
    );
}