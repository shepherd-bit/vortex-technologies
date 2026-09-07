import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroAd() {
  const [quarter, setQuarter] = useState('Q2 2026');
  const [pages, setPages] = useState('12');
  const [file, setFile] = useState(null);
  const [memoId, setMemoId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch existing memo on component mount so refresh doesn't clear the view
  useEffect(() => {
    fetch('http://localhost:5000/api/memos')
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array or returns the latest memo object
        const latest = Array.isArray(data) ? data[data.length - 1] : data;
        if (latest) {
          setMemoId(latest.id);
          setQuarter(latest.quarter || 'Q2 2026');
          setPages(latest.page_count || '12');
          setFile({ name: latest.file_name || 'Existing-Memo.pdf' });
        }
      })
      .catch((err) => console.error('Failed to load existing memo:', err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsSaved(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!memoId) {
      setFile(null);
      setIsSaved(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/memos/${memoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFile(null);
        setMemoId(null);
        setIsSaved(false);
        setMessage('Memo deleted successfully from database.');
      } else {
        setMessage('Failed to delete memo from database.');
      }
    } catch (err) {
      console.error('Error deleting memo:', err);
      setMessage('Network error while deleting memo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || file.name.startsWith('Existing-')) {
      setMessage('Please select a new PDF file to save.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData();
    formData.append('quarter', quarter);
    formData.append('page_count', pages);
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:5000/api/memos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMemoId(data.id || data.memo?.id);
        setIsSaved(true);
        setMessage('Memo uploaded and saved successfully!');
      } else {
        const errData = await response.json();
        setMessage(`Error: ${errData.error || 'Failed to save memo'}`);
      }
    } catch (err) {
      console.error('Error uploading memo:', err);
      setMessage('Network error while saving memo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="text-neutral-900 font-bold uppercase tracking-wider">Hero</span>
          <span>—</span>
          <span>CMS editor</span>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Quarter</label>
          <input 
            type="text" 
            value={quarter} 
            onChange={(e) => { setQuarter(e.target.value); setIsSaved(false); }}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pages</label>
          <input 
            type="number" 
            value={pages} 
            onChange={(e) => { setPages(e.target.value); setIsSaved(false); }}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">PDF File</label>
          
          {!file ? (
            <label className="border border-dashed border-neutral-300 rounded-lg px-4 py-2 text-xs text-neutral-500 flex items-center justify-center cursor-pointer hover:border-black transition-colors bg-neutral-50/50">
              <span>Upload PDF <span className="text-neutral-400">or drop</span></span>
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          ) : (
            <div className="border border-neutral-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs bg-neutral-50">
              <span className="font-medium text-neutral-900 truncate max-w-[180px]">{file.name}</span>
              <button 
                type="button" 
                onClick={handleRemoveFile}
                disabled={isSubmitting}
                className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer text-[11px]"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex items-end h-full pt-5">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 text-white ${
              isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-neutral-800'
            }`}
          >
            {isSubmitting ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </motion.form>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs font-mono text-neutral-600"
        >
          {message}
        </motion.div>
      )}

      <div className="mt-2 text-[11px] text-neutral-400">
        Top toolbar editor — content preview below stays empty.
      </div>
    </motion.div>
  );
}