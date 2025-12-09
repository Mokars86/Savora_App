import React from 'react';
import { PlayCircle, BookOpen } from 'lucide-react';
import { LEARN_ARTICLES } from '../constants';

const Learn = () => {
  return (
    <div className="p-4 md:p-8 pb-24">
       <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy-900">Financial Hub</h1>
            <p className="text-gray-500">Learn how to grow your wealth</p>
       </div>

       {/* Featured Course */}
       <div className="relative h-64 rounded-3xl overflow-hidden mb-10 group cursor-pointer shadow-lg">
            <img 
                src="https://picsum.photos/800/400?grayscale" 
                alt="Featured" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent flex flex-col justify-end p-6">
                <span className="bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-xs font-bold w-fit mb-2">Featured Course</span>
                <h2 className="text-white text-2xl font-bold mb-2">Mastering Susu for Beginners</h2>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <PlayCircle size={16} /> 5 Video Lessons • 15 Mins
                </div>
            </div>
       </div>

       {/* Article Grid */}
       <h3 className="text-lg font-bold text-navy-900 mb-4">Latest Articles</h3>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {LEARN_ARTICLES.map((article) => (
               <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                   <div className="h-40 overflow-hidden">
                       <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="p-4">
                       <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{article.category}</span>
                           <span className="text-xs text-gray-400 flex items-center gap-1"><BookOpen size={12}/> {article.readTime}</span>
                       </div>
                       <h4 className="font-bold text-navy-900 mb-2 line-clamp-2">{article.title}</h4>
                       <button className="text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4">Read Now</button>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default Learn;
