class ProjectCRUD {
    constructor() {
        this.currentDataSource = 'local'; // 'local' or 'remote'
        this.localProjects = [];      // Separate array for local data
        this.remoteProjects = [];     // Separate array for remote data
        this.remoteDataUrl = "https://api.jsonbin.io/v3/b/6920fdafae596e708f6868be"; 
        this.apiKey = "$2a$10$HW4xZQu9YVbfMc/3bzOtuuzKbgeJfWXg4eqvbyZJObxGzw/iJgXyG"; 
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadProjects();
    }
    
    getCurrentProjects() {
        return this.currentDataSource === 'local' ? this.localProjects : this.remoteProjects;
    }
    
    setCurrentProjects(projects) {
        if (this.currentDataSource === 'local') {
            this.localProjects = projects;
        } else {
            this.remoteProjects = projects;
        }
    }
    
    setupEventListeners() {
        document.querySelectorAll('input[name="dataSource"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentDataSource = e.target.value;
                this.loadProjects();
            });
        });
        
        document.getElementById('create-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreate();
        });
        
        document.getElementById('update-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUpdate();
        });
        
        document.getElementById('project-selector').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadProjectForEdit(parseInt(e.target.value));
            } else {
                this.hideUpdateForm();
            }
        });
        
        document.getElementById('delete-selector').addEventListener('change', (e) => {
            if (e.target.value) {
                this.showDeletePreview(parseInt(e.target.value));
            } else {
                this.hideDeletePreview();
            }
        });
        
        document.getElementById('load-projects').addEventListener('click', () => {
            this.loadProjects();
        });
        
        document.getElementById('load-delete-projects').addEventListener('click', () => {
            this.loadProjects();
        });
        
        document.getElementById('cancel-update').addEventListener('click', () => {
            this.hideUpdateForm();
        });
        
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.handleDelete();
        });
        
        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.hideDeletePreview();
        });
    }
    
    async loadProjects() {
        try {
            this.showStatus('Loading projects...', 'warning');
            
            if (this.currentDataSource === 'local') {
                await this.loadLocalProjects();
            } else {
                await this.loadRemoteProjects();
            }
            
            this.updateProjectSelectors();
            this.showStatus('Projects loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showStatus('Error loading projects: ' + error.message, 'error');
        }
    }
    
    async loadLocalProjects() {
        const data = localStorage.getItem('hw5-projects');
        if (!data) {
            this.localProjects = [];
            localStorage.setItem('hw5-projects', JSON.stringify([]));
        } else {
            this.localProjects = JSON.parse(data);
        }
    }
    
    async loadRemoteProjects() {
        try {
            const response = await fetch(this.remoteDataUrl, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.remoteProjects = result.record || result;
        } catch (error) {
            console.warn('Failed to load from remote API, using fallback data:', error);
            this.remoteProjects = [
                {
                    title: "Remote Fallback Project 1",
                    image: "image/remote-fallback1.jpg",
                    alt: "Remote fallback project visualization",
                    description: "This is a fallback project for demonstration purposes when remote API is not available. This represents remote data source.",
                    technologies: "Technologies: JavaScript, REST API, JSON",
                    link: "#",
                    tags: "Remote,API,Fallback,Demo"
                },
                {
                    title: "Remote Fallback Project 2",
                    image: "image/remote-fallback2.jpg",
                    alt: "Another remote fallback project",
                    description: "Second fallback project to show multiple remote projects. This is completely separate from local storage data.",
                    technologies: "Technologies: Node.js, Express, MongoDB",
                    link: "#",
                    tags: "Backend,Database,Remote"
                }
            ];
        }
    }
    
    updateProjectSelectors() {
        const selectors = ['project-selector', 'delete-selector'];
        const currentProjects = this.getCurrentProjects();
        
        selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            selector.innerHTML = '<option value="">-- Select a project --</option>';
            
            currentProjects.forEach((project, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = project.title;
                selector.appendChild(option);
            });
        });
    }
    
    async handleCreate() {
        try {
            const formData = new FormData(document.getElementById('create-form'));
            const projectData = Object.fromEntries(formData.entries());
            
            if (!projectData.title || !projectData.image || !projectData.alt || !projectData.description) {
                throw new Error('Please fill in all required fields');
            }
            
            this.showStatus('Creating project...', 'warning');
            
            if (this.currentDataSource === 'local') {
                await this.createLocalProject(projectData);
            } else {
                await this.createRemoteProject(projectData);
            }
            
            document.getElementById('create-form').reset();
            await this.loadProjects();
            
            this.showStatus(`Project created successfully in ${this.currentDataSource} storage!`, 'success');
        } catch (error) {
            console.error('Error creating project:', error);
            this.showStatus('Error creating project: ' + error.message, 'error');
        }
    }
    
    async createLocalProject(projectData) {
        this.localProjects.push(projectData);
        localStorage.setItem('hw5-projects', JSON.stringify(this.localProjects));
    }
    
    async createRemoteProject(projectData) {
        const updatedProjects = [...this.remoteProjects, projectData];
        
        const response = await fetch(this.remoteDataUrl, {
            method: 'PUT',
            headers: {
                'X-Master-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProjects)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.remoteProjects = updatedProjects;
    }
    
    loadProjectForEdit(index) {
        const currentProjects = this.getCurrentProjects();
        const project = currentProjects[index];
        if (!project) return;
        
        document.getElementById('update-index').value = index;
        document.getElementById('update-title').value = project.title || '';
        document.getElementById('update-image').value = project.image || '';
        document.getElementById('update-alt').value = project.alt || '';
        document.getElementById('update-description').value = project.description || '';
        document.getElementById('update-technologies').value = project.technologies || '';
        document.getElementById('update-link').value = project.link || '';
        document.getElementById('update-tags').value = project.tags || '';
        
        document.getElementById('update-form').style.display = 'block';
    }
    
    async handleUpdate() {
        try {
            const formData = new FormData(document.getElementById('update-form'));
            const projectData = Object.fromEntries(formData.entries());
            const index = parseInt(projectData.index);
            
            delete projectData.index; 
            
            if (!projectData.title || !projectData.image || !projectData.alt || !projectData.description) {
                throw new Error('Please fill in all required fields');
            }
            
            this.showStatus('Updating project...', 'warning');
            
            if (this.currentDataSource === 'local') {
                await this.updateLocalProject(index, projectData);
            } else {
                await this.updateRemoteProject(index, projectData);
            }
            
            this.hideUpdateForm();
            await this.loadProjects();
            
            this.showStatus(`Project updated successfully in ${this.currentDataSource} storage!`, 'success');
        } catch (error) {
            console.error('Error updating project:', error);
            this.showStatus('Error updating project: ' + error.message, 'error');
        }
    }
    
    async updateLocalProject(index, projectData) {
        this.localProjects[index] = projectData;
        localStorage.setItem('hw5-projects', JSON.stringify(this.localProjects));
    }
    
    async updateRemoteProject(index, projectData) {
        this.remoteProjects[index] = projectData;
        
        const response = await fetch(this.remoteDataUrl, {
            method: 'PUT',
            headers: {
                'X-Master-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.remoteProjects)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    
    hideUpdateForm() {
        document.getElementById('update-form').style.display = 'none';
        document.getElementById('project-selector').value = '';
    }
    
    showDeletePreview(index) {
        const currentProjects = this.getCurrentProjects();
        const project = currentProjects[index];
        if (!project) return;
        
        const previewHtml = `
            <h4>${project.title}</h4>
            <p><strong>Data Source:</strong> ${this.currentDataSource.toUpperCase()}</p>
            <p><strong>Image:</strong> ${project.image}</p>
            <p><strong>Description:</strong> ${project.description.substring(0, 100)}...</p>
            <p><strong>Technologies:</strong> ${project.technologies || 'N/A'}</p>
            <p><strong>Tags:</strong> ${project.tags || 'N/A'}</p>
        `;
        
        document.getElementById('delete-project-info').innerHTML = previewHtml;
        document.getElementById('confirm-delete').dataset.index = index;
        document.getElementById('delete-preview').style.display = 'block';
    }
    
    async handleDelete() {
        try {
            const index = parseInt(document.getElementById('confirm-delete').dataset.index);
            
            this.showStatus('Deleting project...', 'warning');
            
            if (this.currentDataSource === 'local') {
                await this.deleteLocalProject(index);
            } else {
                await this.deleteRemoteProject(index);
            }
            
            this.hideDeletePreview();
            await this.loadProjects();
            
            this.showStatus(`Project deleted successfully from ${this.currentDataSource} storage!`, 'success');
        } catch (error) {
            console.error('Error deleting project:', error);
            this.showStatus('Error deleting project: ' + error.message, 'error');
        }
    }
    
    async deleteLocalProject(index) {
        this.localProjects.splice(index, 1);
        localStorage.setItem('hw5-projects', JSON.stringify(this.localProjects));
    }
    
    async deleteRemoteProject(index) {
        this.remoteProjects.splice(index, 1);
        
        const response = await fetch(this.remoteDataUrl, {
            method: 'PUT',
            headers: {
                'X-Master-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.remoteProjects)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    
    hideDeletePreview() {
        document.getElementById('delete-preview').style.display = 'none';
        document.getElementById('delete-selector').value = '';
    }
    
    showStatus(message, type) {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.projectCRUD = new ProjectCRUD();
    console.log('Project CRUD system initialized');
});


window.ProjectCRUD = ProjectCRUD;