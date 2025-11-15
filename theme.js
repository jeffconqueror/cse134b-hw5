// Theme Toggle - Works on all pages
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.querySelector('.theme-icon');
        
        if (!themeToggle) return;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        
        // Toggle theme on button click
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            updateIcon(theme);
        }
        
        function updateIcon(theme) {
            if (themeIcon) {
                // Remove both classes first
                themeIcon.classList.remove('fa-moon', 'fa-sun');
                
                // Add the appropriate icon class
                if (theme === 'light') {
                    themeIcon.classList.add('fa-moon');
                    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                } else {
                    themeIcon.classList.add('fa-sun');
                    themeToggle.setAttribute('aria-label', 'Switch to light mode');
                }
            }
        }
    });
})();