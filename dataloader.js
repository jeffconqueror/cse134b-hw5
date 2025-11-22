// Data Loader for HW5 Part 2
// Handles loading project data from localStorage and remote API

// Sample project data structures
const localStorageData = [
    {
        title: "3D Concept Learning & Asset Generation",
        image: "image/3d.jpg",
        alt: "3D interactable bicycle model showing automated pipeline workflow",
        description: "Developing a fully automated pipeline that takes a text prompt and produces an animated, segmented, and simulation-ready 3D asset in game engine. We aim to bridge the usability gap by creating a system that automatically makes static meshes functional.",
        technologies: "Technologies: Hunyuan3D-2, SAMPart3D, Blender, Unreal Engine",
        link: "https://github.com/jeffconqueror",
        tags: "Computer Vision,3D Graphics,Deep Learning,Pipeline Automation"
    },
    {
        title: "RSEND: Low Light Image Enhancement",
        image: "image/low_light_pic.jpg",
        alt: "Before and after comparison of low-light image enhancement results",
        description: "Published framework for enhancing low-light images using efficient Retinex theory. RSEND achieves PSNR improvements of 0.44-4.2 dB across datasets and outperforms transformer-based models on LOL-v2-real dataset.",
        technologies: "Technologies: PyTorch, Python, OpenCV, Squeeze-and-Excitation Networks",
        link: "https://arxiv.org/abs/2406.09656",
        tags: "Computer Vision,Deep Learning,IJCNN 2025,Publication"
    }
];

const remoteDataUrl = "https://api.jsonbin.io/v3/b/YOUR_BIN_ID"; // We'll update this

// Initialize localStorage with sample data
function initializeLocalStorage() {
    if (!localStorage.getItem('hw5-projects')) {
        localStorage.setItem('hw5-projects', JSON.stringify(localStorageData));
        console.log('Local storage initialized with sample data');
    }
}

// Clear all project cards from the container
function clearProjects() {
    const container = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    // Remove all project cards
    const projectCards = container.querySelectorAll('project-card');
    projectCards.forEach(card => card.remove());
    
    // Show empty state
    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

// Create and add project card to the container
function createProjectCard(projectData) {
    const container = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Create new project card element
    const projectCard = document.createElement('project-card');
    
    // Set all attributes
    projectCard.setAttribute('title', projectData.title || '');
    projectCard.setAttribute('image', projectData.image || '');
    projectCard.setAttribute('alt', projectData.alt || '');
    projectCard.setAttribute('description', projectData.description || '');
    projectCard.setAttribute('technologies', projectData.technologies || '');
    projectCard.setAttribute('link', projectData.link || '#');
    projectCard.setAttribute('tags', projectData.tags || '');
    
    // Add to container
    container.appendChild(projectCard);
}

// Load projects from localStorage
function loadLocalProjects() {
    try {
        // Show loading state
        setButtonState('load-local', true, 'Loading...');
        
        // Clear existing projects
        clearProjects();
        
        // Get data from localStorage
        const data = localStorage.getItem('hw5-projects');
        
        if (!data) {
            throw new Error('No local data found');
        }
        
        const projects = JSON.parse(data);
        
        // Create project cards
        projects.forEach(project => {
            createProjectCard(project);
        });
        
        console.log(`Loaded ${projects.length} projects from localStorage`);
        
        // Reset button state
        setTimeout(() => {
            setButtonState('load-local', false, 'Load Local');
        }, 500);
        
    } catch (error) {
        console.error('Error loading local projects:', error);
        alert('Error loading local projects: ' + error.message);
        setButtonState('load-local', false, 'Load Local');
    }
}

// Load projects from remote API
async function loadRemoteProjects() {
    try {
        // Show loading state
        setButtonState('load-remote', true, 'Loading...');
        
        // Clear existing projects
        clearProjects();
        
        // For now, we'll use a fallback dataset since JSONBin requires setup
        // TODO: Replace with actual JSONBin URL after setup
        const remoteData = [
            {
                title: "Hierarchical Video Understanding",
                image: "image/video_pipeline.jpg",
                alt: "Video analysis pipeline showing hierarchical understanding system",
                description: "AI system for hierarchical video understanding and temporal reasoning. Develops multi-scale approaches using agentic keyframe selection, achieving 70.3% accuracy on VideoMME benchmarks.",
                technologies: "Technologies: LLaVa-Video, Transformers, Multi-modal Learning",
                link: "https://www.techrxiv.org/doi/full/10.36227/techrxiv.176157871.19625717",
                tags: "Video Understanding,Temporal Reasoning,AAAI 2026,Multi-modal AI"
            },
            {
                title: "TG-NAS: Neural Architecture Search",
                image: "image/NAS.jpg",
                alt: "Neural architecture search visualization showing automated design process",
                description: "Universal model-based zero-cost proxy combining Transformer-based operator embedding with GCN to predict architecture performance. Achieves 300x search efficiency improvement and 74.9% ImageNet accuracy.",
                technologies: "Technologies: PyTorch, AutoML, Graph Neural Networks, Transformers",
                link: "https://arxiv.org/abs/2404.00271",
                tags: "AutoML,Neural Networks,Optimization,Co-author,Graph Networks"
            },
            {
                title: "Advanced 3D Scene Understanding",
                image: "image/3d_scene.jpg",
                alt: "3D scene understanding with multiple object detection and segmentation",
                description: "Comprehensive 3D scene understanding system that combines object detection, semantic segmentation, and spatial reasoning for autonomous navigation and robotics applications.",
                technologies: "Technologies: PointNet++, Open3D, ROS, CUDA",
                link: "#",
                tags: "3D Vision,Scene Understanding,Robotics,Point Clouds"
            }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create project cards
        remoteData.forEach(project => {
            createProjectCard(project);
        });
        
        console.log(`Loaded ${remoteData.length} projects from remote API`);
        
        // Reset button state
        setButtonState('load-remote', false, 'Load Remote');
        
    } catch (error) {
        console.error('Error loading remote projects:', error);
        alert('Error loading remote projects: ' + error.message);
        setButtonState('load-remote', false, 'Load Remote');
    }
}

// Helper function to manage button states
function setButtonState(buttonId, disabled, text) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = disabled;
        button.textContent = text;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage with sample data
    initializeLocalStorage();
    
    // Get button references
    const loadLocalBtn = document.getElementById('load-local');
    const loadRemoteBtn = document.getElementById('load-remote');
    
    // Add event listeners
    if (loadLocalBtn) {
        loadLocalBtn.addEventListener('click', loadLocalProjects);
    }
    
    if (loadRemoteBtn) {
        loadRemoteBtn.addEventListener('click', loadRemoteProjects);
    }
    
    console.log('Data loader initialized successfully');
    console.log('LocalStorage data available:', !!localStorage.getItem('hw5-projects'));
});

// Optional: Function to add new project to localStorage (for Part 3)
function addProjectToLocal(projectData) {
    try {
        const existing = JSON.parse(localStorage.getItem('hw5-projects') || '[]');
        existing.push(projectData);
        localStorage.setItem('hw5-projects', JSON.stringify(existing));
        console.log('Project added to localStorage');
        return true;
    } catch (error) {
        console.error('Error adding project to localStorage:', error);
        return false;
    }
}

// Export functions for potential use in Part 3
window.projectDataLoader = {
    loadLocalProjects,
    loadRemoteProjects,
    addProjectToLocal,
    clearProjects
};