const localStorageData = [
    {
        title: "3D Concept Learning & Asset Generation",
        image: "image/3d.jpg",
        alt: "3D interactable bicycle model showing automated pipeline workflow",
        description: "Developing a fully automated pipeline that takes a text prompt and produces an animated, segmented, and simulation-ready 3D asset in game engine. Most text-to-3D models generate a single, monolithic mesh, which has the right shape, but no functional parts. We aim to bridge this Usability gap by creating a system that automatically makes these static meshes usable, and also fix the time-consuming problem of manually animating characters and setting up their interactions in game engine.",
        technologies: "Hunyuan3D-2, SAMPart3D, Blender, Unreal Engine",
        link: "https://github.com/jeffconqueror",
        tags: "Computer Vision,3D Graphics,Deep Learning,Pipeline Automation"
    },
    {
        title: "RSEND: Low Light Image Enhancement",
        image: "image/low_light_pic.jpg",
        alt: "Before and after comparison of low-light image enhancement results",
        description: "We propose a more accurate, concise, and one-stage Retinex theory based framework, RSEND. RSEND first divides the low-light image into the illumination map and reflectance map, then captures the important details in the illumination map and performs light enhancement. After this step, it refines the enhanced gray-scale image and does element-wise matrix multiplication with the reflectance map. By denoising the output it has from the previous step, it obtains the final result. In all the steps, RSEND utilizes Squeeze and Excitation network to better capture the details. Comprehensive quantitative and qualitative experiments show that our Efficient Retinex model significantly outperforms other CNN-based models, achieving a PSNR improvement ranging from 0.44 dB to 4.2 dB in different datasets and even outperforms transformer-based models in the LOL-v2-real dataset.",
        technologies: "PyTorch, Python, OpenCV, Squeeze-and-Excitation Networks",
        link: "https://arxiv.org/abs/2406.09656",
        tags: "Computer Vision,Deep Learning,IJCNN 2025"
    }
];
const remoteDataUrl = "https://api.jsonbin.io/v3/b/6920fdafae596e708f6868be"; 

function initializeLocalStorage() {
    if (!localStorage.getItem('hw5-projects')) {
        localStorage.setItem('hw5-projects', JSON.stringify(localStorageData));
        console.log('Local storage initialized with sample data');
    }
}

function clearProjects() {
    const container = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    const projectCards = container.querySelectorAll('project-card');
    projectCards.forEach(card => card.remove());
    
    if (emptyState) {
        emptyState.style.display = 'block';
    }
}

// Create and add project card to the container
function createProjectCard(projectData) {
    const container = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const projectCard = document.createElement('project-card');
    
    projectCard.setAttribute('title', projectData.title || '');
    projectCard.setAttribute('image', projectData.image || '');
    projectCard.setAttribute('alt', projectData.alt || '');
    projectCard.setAttribute('description', projectData.description || '');
    projectCard.setAttribute('technologies', projectData.technologies || '');
    projectCard.setAttribute('link', projectData.link || '#');
    projectCard.setAttribute('tags', projectData.tags || '');
    
    container.appendChild(projectCard);
}

function loadLocalProjects() {
    try {
        setButtonState('load-local', true, 'Loading...');
        
        clearProjects();
        
        const data = localStorage.getItem('hw5-projects');
        
        if (!data) {
            throw new Error('No local data found');
        }
        
        const projects = JSON.parse(data);
        
        projects.forEach(project => {
            createProjectCard(project);
        });
        
        console.log(`Loaded ${projects.length} projects from localStorage`);
        
        setTimeout(() => {
            setButtonState('load-local', false, 'Load Local');
        }, 500);
        
    } catch (error) {
        console.error('Error loading local projects:', error);
        alert('Error loading local projects: ' + error.message);
        setButtonState('load-local', false, 'Load Local');
    }
}

async function loadRemoteProjects() {
    try {
        setButtonState('load-remote', true, 'Loading...');
        
        clearProjects();
        
        const response = await fetch(remoteDataUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': "$2a$10$HW4xZQu9YVbfMc/3bzOtuuzKbgeJfWXg4eqvbyZJObxGzw/iJgXyG", 
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        const remoteData = result.record || result;
        
        if (!Array.isArray(remoteData)) {
            throw new Error('Invalid data format from remote API');
        }
        
        remoteData.forEach(project => {
            createProjectCard(project);
        });
        
        console.log(`Loaded ${remoteData.length} projects from remote API`);
        
        setButtonState('load-remote', false, 'Load Remote');
        
    } catch (error) {
        console.error('Error loading remote projects:', error);
        alert('Error loading remote projects: ' + error.message);
        setButtonState('load-remote', false, 'Load Remote');
    }
}

function setButtonState(buttonId, disabled, text) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = disabled;
        button.textContent = text;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    
    const loadLocalBtn = document.getElementById('load-local');
    const loadRemoteBtn = document.getElementById('load-remote');
    
    if (loadLocalBtn) {
        loadLocalBtn.addEventListener('click', loadLocalProjects);
    }
    
    if (loadRemoteBtn) {
        loadRemoteBtn.addEventListener('click', loadRemoteProjects);
    }
    
    console.log('Data loader initialized successfully');
    console.log('LocalStorage data available:', !!localStorage.getItem('hw5-projects'));
});

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

window.projectDataLoader = {
    loadLocalProjects,
    loadRemoteProjects,
    addProjectToLocal,
    clearProjects
};