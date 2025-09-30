// src/components/Projects.js
import React, { useState, useEffect } from 'react';
import { client } from '../sanity/config';
import '../styles/components/projects.css';

// Import your initial projects data
// import initialProjects from '../data/projects.json';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('latest');
    const [carouselStates, setCarouselStates] = useState({});
    const [usingSanity, setUsingSanity] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            initializeCarousels();
        }
    }, [projects]);

    // In your Projects.js, replace the loadProjects function with:
const loadProjects = async () => {
    try {
        setLoading(true);
        console.log('🔄 Loading projects from Sanity...');
        
        const query = `*[_type == "project"] | order(date desc) {
            _id,
            title,
            description,
            category,
            tech,
            featured,
            date,
            github,
            "images": images[].asset->url
        }`;
        
        const data = await client.fetch(query);
        console.log('Projects loaded from Sanity:', data);
        
        setProjects(data);
    } catch (error) {
        console.error('❌ Error loading projects from Sanity:', error);
        setProjects([]); // Don't fallback to JSON
    } finally {
        setLoading(false);
    }
};

    const loadFromSanity = async () => {
        try {
            const query = `*[_type == "project"] | order(date desc) {
                _id,
                title,
                description,
                category,
                tech,
                featured,
                date,
                github,
                "images": images[].asset->url
            }`;
            
            const data = await client.fetch(query);
            return data;
        } catch (error) {
            console.error('Error loading from Sanity:', error);
            return [];
        }
    };

    const migrateToSanity = async (projectsToMigrate) => {
        if (!projectsToMigrate || projectsToMigrate.length === 0) return;
        
        try {
            console.log('🔄 Attempting to migrate projects to Sanity...');
            
            for (const project of projectsToMigrate) {
                const sanityProject = {
                    _type: 'project',
                    title: project.title,
                    description: project.description,
                    category: project.category,
                    tech: project.tech || [],
                    featured: project.featured || false,
                    date: project.date || new Date().toISOString().split('T')[0],
                    github: project.github || ''
                };
                
                // Check if project already exists in Sanity
                const existing = await client.fetch(
                    `*[_type == "project" && title == $title][0]`, 
                    { title: project.title }
                );
                
                if (!existing) {
                    await client.create(sanityProject);
                    console.log(`✅ Migrated: ${project.title}`);
                }
            }
            console.log('🎉 Project migration completed!');
        } catch (error) {
            console.log('⚠️ Migration failed (this is OK for now):', error.message);
        }
    };

    const initializeCarousels = () => {
        const initialStates = {};
        projects.forEach(project => {
            const projectId = project._id || project.id;
            initialStates[projectId] = 0;
        });
        setCarouselStates(initialStates);
    };

    const moveSlide = (projectId, direction) => {
        const project = projects.find(p => (p._id || p.id) === projectId);
        if (!project || !project.images) return;

        const currentIndex = carouselStates[projectId] || 0;
        const slideCount = project.images.length;
        let newIndex = currentIndex + direction;

        if (newIndex < 0) newIndex = slideCount - 1;
        if (newIndex >= slideCount) newIndex = 0;

        setCarouselStates(prev => ({
            ...prev,
            [projectId]: newIndex
        }));
    };

    const showSlide = (projectId, index) => {
        setCarouselStates(prev => ({
            ...prev,
            [projectId]: index
        }));
    };

    const getFilteredProjects = () => {
        switch(filter) {
            case 'latest':
                return projects
                    .filter(project => project.featured)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 4);
            case 'web':
                return projects
                    .filter(project => project.category === 'web')
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'app':
                return projects
                    .filter(project => project.category === 'app')
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'ai':
                return projects
                    .filter(project => project.category === 'ai')
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'all':
                return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
            default:
                return projects;
        }
    };

    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <section id="projects" className="section">
                <div className="container">
                    <h2 className="section-title">My Projects</h2>
                    <div className="loading">Loading projects...</div>
                </div>
            </section>
        );
    }

    const filteredProjects = getFilteredProjects();

    return (
        <section id="projects" className="section">
            <div className="container">
                <h2 className="section-title">My Projects</h2>
                <p className="section-subtitle">Explore my work across different domains</p>
                
                {/* Data Source Indicator */}
                {/* <div style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: usingSanity ? '#10b981' : '#f59e0b'
                }}>
                    {usingSanity ? (
                        '✅ Connected to Sanity CMS'
                    ) : (
                        '⚠️ Using local projects data'
                    )}
                </div> */}
                
                <div className="project-filter">
                    <button 
                        className={`filter-btn ${filter === 'latest' ? 'active' : ''}`}
                        onClick={() => setFilter('latest')}
                    >
                        Latest Projects
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'web' ? 'active' : ''}`}
                        onClick={() => setFilter('web')}
                    >
                        Web Dev Projects
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'app' ? 'active' : ''}`}
                        onClick={() => setFilter('app')}
                    >
                        App Dev Projects
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'ai' ? 'active' : ''}`}
                        onClick={() => setFilter('ai')}
                    >
                        AI/ML Projects
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Projects
                    </button>
                </div>
                
                <div className="projects-grid" id="projectsGrid">
                    {filteredProjects.length === 0 ? (
                        <div className="no-projects">
                            <h3>No Projects Found</h3>
                            <p>There are no {getFilterDisplayName(filter)} available at the moment.</p>
                            <p>Check back soon for updates!</p>
                        </div>
                    ) : (
                        filteredProjects.map(project => {
                            const projectId = project._id || project.id;
                            const currentSlide = carouselStates[projectId] || 0;
                            const hasImages = project.images && project.images.length > 0;
                            
                            return (
                                <div key={projectId} className="project-card" data-category={project.category}>
                                    <div className="project-carousel">
                                        {hasImages ? (
                                            <>
                                                <div 
                                                    className="carousel-container" 
                                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                                >
                                                    {project.images.map((image, index) => (
                                                        <div 
                                                            key={index}
                                                            className="carousel-slide" 
                                                            style={{ backgroundImage: `url('${image}')` }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <button 
                                                    className="carousel-nav carousel-prev" 
                                                    onClick={() => moveSlide(projectId, -1)}
                                                >
                                                    ❮
                                                </button>
                                                <button 
                                                    className="carousel-nav carousel-next" 
                                                    onClick={() => moveSlide(projectId, 1)}
                                                >
                                                    ❯
                                                </button>
                                                <div className="carousel-controls">
                                                    {project.images.map((_, index) => (
                                                        <div 
                                                            key={index}
                                                            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                                            onClick={() => showSlide(projectId, index)}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <div className="placeholder-icon">📷</div>
                                                <span>Add project images in Sanity Studio</span>
                                            </div> 
                                        )}
                                        <span className={`project-badge ${project.category}`}>
                                            {project.category ? project.category.toUpperCase() : 'PROJECT'}
                                        </span>
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-desc">{project.description}</p>
                                        <div className="project-meta">
                                            <span className="project-date">Completed: {formatDisplayDate(project.date)}</span>
                                        </div>
                                        <div className="project-tech">
                                            {project.tech && project.tech.map((tech, index) => (
                                                <span key={index} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                        {project.github && (
                                            <a 
                                                href={project.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="project-github" 
                                                title="View on GitHub"
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

const getFilterDisplayName = (filter) => {
    const names = {
        'latest': 'Latest Projects',
        'web': 'Web Development Projects',
        'app': 'App Development Projects',
        'ai': 'AI/ML Projects',
        'all': 'Projects'
    };
    return names[filter] || 'Projects';
};

export default Projects;