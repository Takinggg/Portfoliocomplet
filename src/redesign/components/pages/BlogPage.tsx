import React, { useEffect, useMemo, useState } from 'react';
import { Reveal } from '../Reveal';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { BlogPost } from '../../types';
import { useTranslation } from '../../../utils/i18n/useTranslation';

interface BlogPageProps {
    posts: BlogPost[];
    onPostClick: (slug: string) => void;
}

const BLOG_COPY = {
    fr: {
        title: 'Insights',
        featuredBadge: 'À la une',
        categoryAll: 'Tous',
        minRead: 'min de lecture',
        readArticle: 'Lire l’article',
        readMore: 'Lire plus',
        filterLabel: 'Filtre actif',
        filterEmpty: "Aucun article ne correspond à cette sélection.",
        emptyTitle: 'Aucun article disponible pour le moment.',
        emptySubtitle: 'Publiez votre premier article pour alimenter cette section.',
        blogLabel: 'Blog',
    },
    en: {
        title: 'Insights',
        featuredBadge: 'Featured',
        categoryAll: 'All',
        minRead: 'min read',
        readArticle: 'Read article',
        readMore: 'Read more',
        filterLabel: 'Active filter',
        filterEmpty: 'No articles match this selection.',
        emptyTitle: 'No articles available right now.',
        emptySubtitle: 'Publish your first post to populate this section.',
        blogLabel: 'Blog',
    },
} as const;

export const BlogRedesignPage: React.FC<BlogPageProps> = ({ posts, onPostClick }) => {
    const { language } = useTranslation();
    const copy = BLOG_COPY[language];
    const [filter, setFilter] = useState('all');
    const categories = useMemo(() => {
        const unique = new Set<string>();
        posts.forEach((post) => {
            if (post.category) unique.add(post.category);
        });
        return ['all', ...Array.from(unique)];
    }, [posts]);

    useEffect(() => {
        if (filter !== 'all' && !categories.includes(filter)) {
            setFilter('all');
        }
    }, [categories, filter]);

    const filteredPosts = useMemo(() => {
        if (filter === 'all') {
            return posts;
        }
        return posts.filter((post) => post.category === filter);
    }, [filter, posts]);

    const featuredPost = filteredPosts[0];
    const remainingPosts = filteredPosts.slice(1);

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <Reveal>
                        <h1 className="font-display font-bold text-6xl md:text-8xl text-white">
                            {copy.title}<span className="text-primary">.</span>
                        </h1>
                    </Reveal>
                    {categories.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`text-sm font-medium uppercase tracking-widest transition-all whitespace-nowrap px-4 py-2 rounded-full border ${
                                        filter === cat
                                            ? 'bg-white text-black border-white'
                                            : 'border-white/10 text-neutral-500 hover:border-white hover:text-white'
                                    }`}
                                >
                                    {cat === 'all' ? copy.categoryAll : cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {posts.length > 0 && !filteredPosts.length && (
                    <div className="py-24 text-center text-neutral-400 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">{copy.filterLabel}</p>
                        <p className="text-xl text-white">{copy.filterEmpty}</p>
                    </div>
                )}

                {!posts.length && (
                    <div className="py-32 text-center text-neutral-400 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-4">{copy.blogLabel}</p>
                        <p className="text-2xl text-white mb-2">{copy.emptyTitle}</p>
                        <p className="text-white/60">{copy.emptySubtitle}</p>
                    </div>
                )}

                {filteredPosts.length > 0 && featuredPost && (
                    <Reveal width="100%">
                        <div
                            onClick={() => onPostClick(featuredPost.slug)}
                            className="group relative overflow-hidden rounded-2xl cursor-pointer mb-24 border border-white/5 bg-[#0A0A0A]"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="relative h-[400px] md:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {copy.featuredBadge}
                                    </div>
                                </div>
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-6 font-mono">
                                        <span className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(featuredPost.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {featuredPost.readTime} {copy.minRead}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 group-hover:text-primary transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-neutral-400 text-lg mb-8 line-clamp-3">{featuredPost.excerpt}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-sm font-bold uppercase tracking-widest group-hover:underline">{copy.readArticle}</span>
                                        <ArrowUpRight size={16} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {filteredPosts.length > 1 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(featuredPost ? remainingPosts : filteredPosts).map((post) => (
                            <Reveal key={post.id} width="100%">
                                <div
                                    onClick={() => onPostClick(post.slug)}
                                    className="group relative flex flex-col h-full rounded-xl cursor-pointer border border-white/5 bg-[#0A0A0A] overflow-hidden hover:border-white/20 transition-colors"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4 font-mono">
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{post.readTime} {copy.minRead}</span>
                                        </div>

                                        <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>

                                        <div className="flex items-center gap-2 mt-auto">
                                            <span className="text-white text-xs font-bold uppercase tracking-widest">{copy.readMore}</span>
                                            <ArrowUpRight size={14} className="text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
