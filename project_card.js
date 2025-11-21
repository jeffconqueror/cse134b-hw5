class ProjectCard extends HTMLElement {
    constructor() {
        super();
        
        // Create shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        
        // Define the template
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--card-bg, #ffffff);
                    border-radius: 0.75rem;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: all 0.4s ease;
                    margin-bottom: var(--spacing-lg, 3rem);
                }
                
                :host(:hover) {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 40px rgba(44, 62, 80, 0.2);
                }
                
                .card-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;  
                    text-align: center;
                }
                
                .card-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    width: 100%;
                    margin-top: 1rem;  
                }
                
                h2 {
                    color: var(--primary-color, #2c3e50);
                    font-size: 1.75rem;
                    margin: 0;
                    font-weight: 600;
                    text-align: center;  /* Center title */
                    line-height: 1.3;
                    padding: 0 1rem;  /* Add horizontal padding */
                }
                
                .card-image {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    min-height: 200px;
                    object-fit: cover;
                    object-position: center;
                    border-radius: 0.5rem;
                    margin: 1.5rem 0;  
                    display: block;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                
                .card-image:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .description {
                    color: var(--text-color, #333);
                    line-height: 1.7; 
                    margin: 1.5rem 1rem; 
                    text-align: left;  
                    padding: 1.5rem;
                    font-size: 1rem;
                    box-sizing: border-box; 
                    
                    background: rgba(52, 152, 219, 0.05);
                    border-left: 4px solid var(--secondary-color, #3498db);
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .technologies {
                    font-weight: 600;
                    color: var(--secondary-color, #3498db);
                    margin: 1rem 0; 
                    text-align: center;
                    padding: 0 1rem;
                    font-size: 0.95rem;
                }
                
                .learn-more-link {
                    display: inline-block;
                    background: linear-gradient(135deg, var(--secondary-color, #3498db), var(--primary-color, #2c3e50));
                    color: white;
                    text-decoration: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    margin-top: 0.5rem;  
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    text-align: center;
                }
                
                .learn-more-link:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
                }
                
                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;  /* Increased gap */
                    justify-content: center;  /* Center tags */
                    margin: 1rem 0;
                    padding: 0 1rem;  /* Add horizontal padding */
                }
                
                .tag {
                    background: var(--secondary-color, #3498db);
                    color: white;
                    padding: 0.5rem 1rem;  /* Increased padding */
                    border-radius: 1.5rem;  /* More rounded */
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .tag:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    :host {
                        padding: var(--spacing-md, 1.5rem);  /* Slightly reduced on mobile */
                    }
                    
                    h2 {
                        font-size: 1.5rem;
                    }
                    
                    .card-image {
                        min-height: 180px;
                    }
                    
                    .description, .technologies {
                        padding: 0 0.5rem;  /* Reduced padding on mobile */
                    }
                }
                
                @media (max-width: 480px) {
                    h2 {
                        font-size: 1.25rem;
                    }
                    
                    .card-image {
                        min-height: 150px;
                    }
                    
                    .learn-more-link {
                        padding: 0.65rem 1.5rem;
                        font-size: 0.95rem;
                    }
                }
            </style>
            
            <article class="card-container">
                <div class="card-header">
                    <h2 id="project-title"></h2>
                    <div class="tags" id="project-tags"></div>
                </div>
                
                <picture>
                    <img class="card-image" id="project-image" alt="">
                </picture>
                
                <div class="description" id="project-description"></div>
                <div class="technologies" id="project-technologies"></div>
                
                <a class="learn-more-link" id="project-link" href="#" target="_blank">Learn More</a>
            </article>
        `;
    }
    
    connectedCallback() {
        this.updateContent();
    }
    
    static get observedAttributes() {
        return ['title', 'image', 'alt', 'description', 'technologies', 'link', 'tags'];
    }
    
    attributeChangedCallback() {
        this.updateContent();
    }
    
    updateContent() {
        const title = this.getAttribute('title') || 'Project Title';
        const image = this.getAttribute('image') || '';
        const alt = this.getAttribute('alt') || 'Project image';
        const description = this.getAttribute('description') || 'Project description';
        const technologies = this.getAttribute('technologies') || '';
        const link = this.getAttribute('link') || '#';
        const tags = this.getAttribute('tags') || '';
        
        // Update content
        this.shadowRoot.getElementById('project-title').textContent = title;
        this.shadowRoot.getElementById('project-image').src = image;
        this.shadowRoot.getElementById('project-image').alt = alt;
        this.shadowRoot.getElementById('project-description').textContent = description;
        this.shadowRoot.getElementById('project-technologies').textContent = technologies;
        this.shadowRoot.getElementById('project-link').href = link;
        
        // Update tags
        const tagsContainer = this.shadowRoot.getElementById('project-tags');
        tagsContainer.innerHTML = '';
        if (tags) {
            const tagList = tags.split(',').map(tag => tag.trim());
            tagList.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
    }
}

// Register the custom element
customElements.define('project-card', ProjectCard);