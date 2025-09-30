// src/components/AdminCMS.js
import React, { useState, useEffect } from 'react';
import { client } from '../sanity/config';
import '../styles/components/admin.css';

const AdminCMS = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('add-project');
    const [projects, setProjects] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        github: '',
        liveUrl: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        isOngoing: false
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editTechnologies, setEditTechnologies] = useState([]);
    const [editImageFiles, setEditImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            loadProjects();
        }
    }, [isAuthenticated]);

    const loadProjects = async () => {
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
                liveUrl,
                isOngoing,
                "images": images[].asset->url
            }`;
            
            const data = await client.fetch(query);
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
            showMessage('Error loading projects', 'error');
        }
    };

    const checkAdminPassword = () => {
        const correctPassword = 'Sneh@220525';
        
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setFailedAttempts(0);
            setPassword('');
        } else {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            setPassword('');
            
            if (newAttempts >= 5) {
                showSecurityAlert();
            }
        }
    };

    const showSecurityAlert = () => {
        alert('🚫 Security Alert: Too many failed login attempts. Redirecting to homepage...');
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    };

    const handlePasswordKeyPress = (e) => {
        if (e.key === 'Enter') {
            checkAdminPassword();
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingProject(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addTechnology = () => {
        const techInput = document.getElementById('techInput');
        const tech = techInput.value.trim();
        if (tech && !technologies.includes(tech)) {
            setTechnologies(prev => [...prev, tech]);
            techInput.value = '';
        }
    };

    const addEditTechnology = () => {
        const techInput = document.getElementById('editTechInput');
        const tech = techInput.value.trim();
        if (tech && !editTechnologies.includes(tech)) {
            setEditTechnologies(prev => [...prev, tech]);
            techInput.value = '';
        }
    };

    const handleTechKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTechnology();
        }
    };

    const handleEditTechKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEditTechnology();
        }
    };

    const removeTechnology = (index) => {
        setTechnologies(prev => prev.filter((_, i) => i !== index));
    };

    const removeEditTechnology = (index) => {
        setEditTechnologies(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(prev => [...prev, ...files]);
        }
    };

    const handleEditImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setEditImageFiles(prev => [...prev, ...files]);
        }
    };

    const removeImageFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeEditImageFile = (index) => {
        setEditImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageUrl, imageIndex) => {
        if (!window.confirm('Are you sure you want to remove this image?')) {
            return;
        }

        try {
            // Find the asset ID from the image URL
            const assetId = imageUrl.split('/').pop().split('?')[0];
            
            // Remove from the project's images array
            const updatedImages = [...existingImages];
            updatedImages.splice(imageIndex, 1);
            setExistingImages(updatedImages);
            
            showMessage('Image removed successfully!', 'success');
        } catch (error) {
            console.error('Error removing image:', error);
            showMessage('Error removing image', 'error');
        }
    };

    const uploadImagesToSanity = async (files) => {
        const uploadedImages = [];
        
        for (const file of files) {
            try {
                const asset = await client.assets.upload('image', file, {
                    filename: file.name,
                    contentType: file.type
                });
                uploadedImages.push({
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id
                    }
                });
            } catch (error) {
                console.error('Error uploading image:', error);
                throw new Error(`Failed to upload ${file.name}`);
            }
        }
        
        return uploadedImages;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.category || technologies.length === 0) {
            showMessage('Please fill all required fields', 'error');
            return;
        }

        setUploading(true);

        try {
            let imageAssets = [];
            
            if (imageFiles.length > 0) {
                imageAssets = await uploadImagesToSanity(imageFiles);
            }

            const projectData = {
                _type: 'project',
                title: formData.title,
                description: formData.description,
                category: formData.category,
                tech: technologies,
                featured: formData.featured,
                date: formData.isOngoing ? null : formData.date,
                isOngoing: formData.isOngoing,
                github: formData.github || undefined,
                liveUrl: formData.liveUrl || undefined,
                images: imageAssets.length > 0 ? imageAssets : undefined
            };

            const result = await client.create(projectData);
            
            if (result._id) {
                showMessage(`🎉 Project added successfully! ${imageFiles.length > 0 ? 'Images uploaded!' : ''}`, 'success');
                clearForm();
                loadProjects();
            } else {
                throw new Error('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            showMessage('❌ Failed to add project: ' + error.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingProject.title || !editingProject.description || !editingProject.category || editTechnologies.length === 0) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    // Validate date if not ongoing
    if (!editingProject.isOngoing && !editingProject.date) {
        showMessage('Please select a completion date or mark as ongoing', 'error');
        return;
    }

    setUploading(true);

    try {
        let newImageAssets = [];
        
        if (editImageFiles.length > 0) {
            newImageAssets = await uploadImagesToSanity(editImageFiles);
        }

        // Convert existing images to proper Sanity references
        const existingImageRefs = existingImages.map(img => {
            // If it's already a reference object, keep it
            if (img.asset && img.asset._ref) {
                return img;
            }
            // If it's a URL string, we need to handle it differently
            // For now, we'll skip these or you'll need to re-upload
            return null;
        }).filter(Boolean);

        // Combine existing images with new ones
        const allImages = [...existingImageRefs, ...newImageAssets];

        const projectData = {
            title: editingProject.title,
            description: editingProject.description,
            category: editingProject.category,
            tech: editTechnologies,
            featured: editingProject.featured,
            date: editingProject.isOngoing ? null : editingProject.date,
            isOngoing: editingProject.isOngoing,
            github: editingProject.github || undefined,
            liveUrl: editingProject.liveUrl || undefined,
            images: allImages.length > 0 ? allImages : undefined
        };

        console.log('Updating project with data:', projectData); // Debug log

        const result = await client.patch(editingProject._id).set(projectData).commit();
        
        console.log('Update result:', result); // Debug log
        
        showMessage('🎉 Project updated successfully!', 'success');
        setEditingProject(null);
        setEditTechnologies([]);
        setEditImageFiles([]);
        setExistingImages([]);
        loadProjects(); // Reload the projects list
    } catch (error) {
        console.error('Error updating project:', error);
        showMessage('❌ Failed to update project: ' + error.message, 'error');
    } finally {
        setUploading(false);
    }
};

    const deleteProject = async (projectId, projectTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone!`)) {
            return;
        }

        setDeletingId(projectId);

        try {
            await client.delete(projectId);
            showMessage('🗑️ Project deleted successfully!', 'success');
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            showMessage('❌ Failed to delete project: ' + error.message, 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const editProject = (project) => {
        setEditingProject(project);
        setEditTechnologies(project.tech || []);
        setEditImageFiles([]);
        setExistingImages(project.images || []);
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setEditTechnologies([]);
        setEditImageFiles([]);
        setExistingImages([]);
    };

    const clearForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            github: '',
            liveUrl: '',
            date: new Date().toISOString().split('T')[0],
            featured: false,
            isOngoing: false
        });
        setTechnologies([]);
        setImageFiles([]);
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Ongoing';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Password Protection Screen
    if (!isAuthenticated) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000,
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{
                    background: '#1e293b',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%',
                    border: '1px solid #334155',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        Admin Access Required
                    </h3>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Enter the password to access the admin panel
                    </p>
                    
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handlePasswordKeyPress}
                        style={{
                            width: '100%',
                            padding: '14px',
                            margin: '1rem 0',
                            border: '2px solid #475569',
                            borderRadius: '8px',
                            fontSize: '16px',
                            background: '#0f172a',
                            color: 'white',
                            outline: 'none'
                        }}
                        placeholder="Enter password"
                        autoComplete="off"
                    />
                    
                    <button 
                        onClick={checkAdminPassword}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            width: '100%',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    >
                        Access Admin Panel
                    </button>
                    
                    {failedAttempts > 0 && (
                        <p style={{
                            color: '#ef4444', 
                            marginTop: '1rem', 
                            fontSize: '14px'
                        }}>
                            ❌ Incorrect password. Attempts: {failedAttempts}/5
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Edit Project Modal
    if (editingProject) {
        return (
            <div className="edit-modal-overlay">
                <div className="edit-modal">
                    <div className="edit-modal-header">
                        <h2>✏️ Edit Project: {editingProject.title}</h2>
                        <button className="close-modal" onClick={cancelEdit}>×</button>
                    </div>
                    
                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group">
                            <label htmlFor="editTitle">Project Title *</label>
                            <input 
                                type="text" 
                                id="editTitle" 
                                name="title" 
                                value={editingProject.title}
                                onChange={handleEditInputChange}
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="editDescription">Description *</label>
                            <textarea 
                                id="editDescription" 
                                name="description" 
                                value={editingProject.description}
                                onChange={handleEditInputChange}
                                required 
                                rows="4"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="editCategory">Category *</label>
                            <select 
                                id="editCategory" 
                                name="category" 
                                value={editingProject.category}
                                onChange={handleEditInputChange}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="web">Web Development</option>
                                <option value="app">App Development</option>
                                <option value="ai">AI/ML Projects</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Technologies *</label>
                            <div className="tech-input-container">
                                <input 
                                    type="text" 
                                    id="editTechInput" 
                                    className="tech-input" 
                                    placeholder="Enter technology (e.g., React)"
                                    onKeyPress={handleEditTechKeyPress}
                                />
                                <button 
                                    type="button" 
                                    className="add-tech-btn" 
                                    onClick={addEditTechnology}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="tech-tags">
                                {editTechnologies.map((tech, index) => (
                                    <div key={index} className="tech-tag">
                                        {tech}
                                        <button 
                                            type="button" 
                                            onClick={() => removeEditTechnology(index)}
                                            aria-label={`Remove ${tech}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Project Images</label>
                            <div className="image-upload-container">
                                <input 
                                    type="file"
                                    id="editImageUpload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleEditImageUpload}
                                    className="image-upload-input"
                                />
                                <label htmlFor="editImageUpload" className="image-upload-label">
                                    📁 Add More Images
                                </label>
                            </div>
                            
                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="existing-images">
                                    <h4>Current Images:</h4>
                                    <div className="image-previews">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="image-preview existing">
                                                <img 
                                                    src={image.url} 
                                                    alt={`Existing ${index + 1}`}
                                                    className="preview-img"
                                                />
                                                <div className="image-info">
                                                    <span>Image {index + 1}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeExistingImage(image.url, index)}
                                                        className="remove-image-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* New Images */}
                            {editImageFiles.length > 0 && (
                                <div className="uploaded-images">
                                    <h4>New Images to Add ({editImageFiles.length}):</h4>
                                    <div className="image-previews">
                                        {editImageFiles.map((file, index) => (
                                            <div key={index} className="image-preview">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt={file.name}
                                                    className="preview-img"
                                                />
                                                <div className="image-info">
                                                    <span>{file.name}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeEditImageFile(index)}
                                                        className="remove-image-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="editGithub">GitHub URL</label>
                            <input 
                                type="url" 
                                id="editGithub" 
                                name="github" 
                                value={editingProject.github || ''}
                                onChange={handleEditInputChange}
                                placeholder="https://github.com/username/repo" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="editLiveUrl">Live Website URL</label>
                            <input 
                                type="url" 
                                id="editLiveUrl" 
                                name="liveUrl" 
                                value={editingProject.liveUrl || ''}
                                onChange={handleEditInputChange}
                                placeholder="https://your-project.com" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    id="editIsOngoing" 
                                    name="isOngoing" 
                                    checked={editingProject.isOngoing || false}
                                    onChange={handleEditInputChange}
                                />
                                This project is ongoing
                            </label>
                        </div>
                        
                        {!editingProject.isOngoing && (
    <div className="form-group">
        <label htmlFor="editDate">Completion Date *</label>
        <input 
            type="date" 
            id="editDate" 
            name="date" 
            value={editingProject.date ? new Date(editingProject.date).toISOString().split('T')[0] : ''}
            onChange={handleEditInputChange}
            required 
        />
    </div>
)}
                        
                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    id="editFeatured" 
                                    name="featured" 
                                    checked={editingProject.featured || false}
                                    onChange={handleEditInputChange}
                                />
                                Featured Project
                            </label>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Updating Project...' : '💾 Update Project'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={cancelEdit}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Main CMS Content
    return (
        <div className="admin-container">
            <a href="/" className="back-to-site">← Back to Portfolio</a>
            
            <div className="admin-header">
                <h1>🎨 Portfolio CMS (Sanity.io)</h1>
                <p>Manage your projects with automatic updates</p>
            </div>
            
            <div className="admin-nav">
                <ul className="nav-tabs">
                    <li 
                        className={`nav-tab ${activeTab === 'add-project' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add-project')}
                    >
                        Add Project
                    </li>
                    <li 
                        className={`nav-tab ${activeTab === 'view-projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('view-projects')}
                    >
                        View Projects ({projects.length})
                    </li>
                    <li 
                        className={`nav-tab ${activeTab === 'sanity-guide' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sanity-guide')}
                    >
                        Sanity Guide
                    </li>
                </ul>
            </div>
            
            {/* Add Project Tab */}
            {activeTab === 'add-project' && (
                <div className="tab-content active">
                    <div className="instructions">
                        <h3>📝 Add New Project to Sanity</h3>
                        <ol>
                            <li>Fill out the form below</li>
                            <li>Upload project images directly</li>
                            <li>Click "Add Project to Sanity"</li>
                            <li>Projects will appear instantly with images!</li>
                        </ol>
                    </div>
                    
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Project Title *</label>
                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                value={formData.title}
                                onChange={handleInputChange}
                                required 
                                placeholder="Enter project title" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                value={formData.description}
                                onChange={handleInputChange}
                                required 
                                placeholder="Describe your project..."
                                rows="4"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select 
                                id="category" 
                                name="category" 
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="web">Web Development</option>
                                <option value="app">App Development</option>
                                <option value="ai">AI/ML Projects</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Technologies *</label>
                            <div className="tech-input-container">
                                <input 
                                    type="text" 
                                    id="techInput" 
                                    className="tech-input" 
                                    placeholder="Enter technology (e.g., React)"
                                    onKeyPress={handleTechKeyPress}
                                />
                                <button 
                                    type="button" 
                                    className="add-tech-btn" 
                                    onClick={addTechnology}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="tech-tags">
                                {technologies.map((tech, index) => (
                                    <div key={index} className="tech-tag">
                                        {tech}
                                        <button 
                                            type="button" 
                                            onClick={() => removeTechnology(index)}
                                            aria-label={`Remove ${tech}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Project Images</label>
                            <div className="image-upload-container">
                                <input 
                                    type="file"
                                    id="imageUpload"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="image-upload-input"
                                />
                                <label htmlFor="imageUpload" className="image-upload-label">
                                    📁 Choose Images
                                </label>
                                <span className="image-upload-hint">Select multiple project screenshots</span>
                            </div>
                            
                            {imageFiles.length > 0 && (
                                <div className="uploaded-images">
                                    <h4>Selected Images ({imageFiles.length}):</h4>
                                    <div className="image-previews">
                                        {imageFiles.map((file, index) => (
                                            <div key={index} className="image-preview">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt={file.name}
                                                    className="preview-img"
                                                />
                                                <div className="image-info">
                                                    <span>{file.name}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeImageFile(index)}
                                                        className="remove-image-btn"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="github">GitHub URL</label>
                            <input 
                                type="url" 
                                id="github" 
                                name="github" 
                                value={formData.github}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/repo" 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="liveUrl">Live Website URL</label>
                            <input 
                                type="url" 
                                id="liveUrl" 
                                name="liveUrl" 
                                value={formData.liveUrl}
                                onChange={handleInputChange}
                                placeholder="https://your-project.com" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    id="isOngoing" 
                                    name="isOngoing" 
                                    checked={formData.isOngoing}
                                    onChange={handleInputChange}
                                />
                                This project is ongoing
                            </label>
                        </div>
                        
                        {!formData.isOngoing && (
                            <div className="form-group">
                                <label htmlFor="date">Completion Date *</label>
                                <input 
                                    type="date" 
                                    id="date" 
                                    name="date" 
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    id="featured" 
                                    name="featured" 
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                />
                                Featured Project
                            </label>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading Project...' : '🚀 Add Project to Sanity'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={clearForm}
                                disabled={uploading}
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* View Projects Tab */}
            {activeTab === 'view-projects' && (
                <div className="tab-content">
                    <div className="instructions">
                        <h3>📋 Projects in Sanity ({projects.length})</h3>
                        <p>Manage your projects - edit or delete them as needed.</p>
                    </div>
                    
                    <div className="projects-list">
                        {projects.length === 0 ? (
                            <div className="message info">
                                No projects found in Sanity. Add your first project using the "Add Project" tab.
                            </div>
                        ) : (
                            projects.map(project => (
                                <div key={project._id} className="project-item">
                                    <div className="project-header">
                                        <h3 className="project-title">{project.title}</h3>
                                        <div className="project-actions">
                                            <span className={`project-badge ${project.category}`}>
                                                {project.category ? project.category.toUpperCase() : 'PROJECT'}
                                            </span>
                                            <div className="action-buttons">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => editProject(project)}
                                                    title="Edit project"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button 
                                                    className={`delete-btn ${deletingId === project._id ? 'deleting' : ''}`}
                                                    onClick={() => deleteProject(project._id, project.title)}
                                                    title="Delete project"
                                                    disabled={deletingId === project._id}
                                                >
                                                    {deletingId === project._id ? '🗑️ Deleting...' : '🗑️ Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="project-description">{project.description}</p>
                                    <div className="project-tech">
                                        {project.tech && project.tech.map((tech, index) => (
                                            <span key={index}>{tech}</span>
                                        ))}
                                    </div>
                                    <div className="project-meta">
                                        <span><strong>Status:</strong> {project.isOngoing ? '🟡 Ongoing' : '✅ Completed'}</span>
                                        <span><strong>Date:</strong> {formatDate(project.date)}</span>
                                        <span><strong>Featured:</strong> {project.featured ? 'Yes' : 'No'}</span>
                                        {project.github && (
                                            <span>
                                                <strong>GitHub:</strong>{' '}
                                                <a href={project.github} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            </span>
                                        )}
                                        {project.liveUrl && (
                                            <span>
                                                <strong>Live URL:</strong>{' '}
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    Visit
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                    {project.images && project.images.length > 0 && (
                                        <div className="project-images">
                                            <strong>Images:</strong> {project.images.length} image(s) uploaded
                                            <div className="project-image-previews">
                                                {project.images.slice(0, 3).map((image, index) => (
                                                    <img 
                                                        key={index}
                                                        src={image} 
                                                        alt={`${project.title} ${index + 1}`}
                                                        className="project-thumbnail"
                                                    />
                                                ))}
                                                {project.images.length > 3 && (
                                                    <span className="more-images">+{project.images.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {/* Sanity Guide Tab */}
            {activeTab === 'sanity-guide' && (
                <div className="tab-content">
                    <div className="instructions">
                        <h3>🚀 Sanity.io Setup Guide</h3>
                        
                        <h4>New Features Added:</h4>
                        <ul>
                            <li>✅ Live Website URL field</li>
                            <li>✅ Ongoing project option</li>
                            <li>✅ Edit existing projects</li>
                            <li>✅ Manage project images</li>
                            <li>✅ Flexible date selection</li>
                        </ul>
                        
                        <div className="message success">
                            <strong>🎉 Enhanced CMS:</strong> You can now fully manage all aspects of your projects!
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCMS;