// Main application class
class ClickGUI {
    constructor() {
        this.modules = moduleCategories;
        this.searchResults = [];
        this.dragDropManager = new DragDropManager();
        this.settings = this.loadSettings();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderCategories();
        this.applySettings();
        this.loadModuleStates();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        searchInput.addEventListener('focus', () => {
            if (this.searchResults.length > 0) {
                searchResults.style.display = 'block';
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
        
        // Settings modal
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
        
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
        
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
        
        // Settings controls
        this.setupSettingsControls();
        
        // Minimize functionality
        const minimizeBtn = document.getElementById('minimizeBtn');
        minimizeBtn.addEventListener('click', () => {
            this.toggleMinimize();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Tooltip system
        this.setupTooltips();
    }
    
    setupSettingsControls() {
        const themeSelect = document.getElementById('themeSelect');
        const animationSpeed = document.getElementById('animationSpeed');
        const gridColumns = document.getElementById('gridColumns');
        
        themeSelect.value = this.settings.theme;
        animationSpeed.value = this.settings.animationSpeed;
        gridColumns.value = this.settings.gridColumns;
        
        themeSelect.addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme(e.target.value);
            this.saveSettings();
        });
        
        animationSpeed.addEventListener('input', (e) => {
            this.settings.animationSpeed = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = e.target.value + 'x';
            this.applyAnimationSpeed(e.target.value);
            this.saveSettings();
        });
        
        gridColumns.addEventListener('input', (e) => {
            this.settings.gridColumns = parseInt(e.target.value);
            e.target.nextElementSibling.textContent = e.target.value;
            this.applyGridColumns(e.target.value);
            this.saveSettings();
        });
    }
    
    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.innerHTML = '';
        
        const savedOrder = this.dragDropManager.loadOrder();
        const orderedCategories = this.getOrderedCategories(savedOrder);
        
        orderedCategories.forEach(([categoryId, category]) => {
            const categoryCard = this.createCategoryCard(categoryId, category);
            categoriesGrid.appendChild(categoryCard);
            this.dragDropManager.makeDraggable(categoryCard);
        });
        
        this.dragDropManager.makeDropZone(categoriesGrid);
    }
    
    getOrderedCategories(savedOrder) {
        const categories = Object.entries(this.modules);
        
        if (savedOrder.length === 0) {
            return categories;
        }
        
        const ordered = [];
        const remaining = [...categories];
        
        savedOrder.forEach(categoryId => {
            const index = remaining.findIndex(([id]) => id === categoryId);
            if (index !== -1) {
                ordered.push(remaining.splice(index, 1)[0]);
            }
        });
        
        return [...ordered, ...remaining];
    }
    
    createCategoryCard(categoryId, category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.categoryId = categoryId;
        
        // Header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.style.background = `linear-gradient(135deg, ${category.color}, ${this.darkenColor(category.color, 20)})`;
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.innerHTML = `<i class="${category.icon}"></i> ${category.name}`;
        
        const toggle = document.createElement('button');
        toggle.className = 'category-toggle';
        toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        header.appendChild(title);
        header.appendChild(toggle);
        
        // Content
        const content = document.createElement('div');
        content.className = 'category-content';
        
        const modulesList = document.createElement('div');
        modulesList.className = 'modules-list';
        
        category.modules.forEach(module => {
            const moduleItem = this.createModuleItem(module);
            modulesList.appendChild(moduleItem);
        });
        
        content.appendChild(modulesList);
        
        // Toggle functionality
        header.addEventListener('click', () => {
            const isCollapsed = content.classList.contains('collapsed');
            
            if (isCollapsed) {
                content.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
                AnimationUtils.slideDown(content);
            } else {
                content.classList.add('collapsed');
                toggle.classList.add('collapsed');
                AnimationUtils.slideUp(content);
            }
        });
        
        card.appendChild(header);
        card.appendChild(content);
        
        return card;
    }
    
    createModuleItem(module) {
        const item = document.createElement('div');
        item.className = 'module-item';
        item.dataset.moduleId = module.id;
        
        if (module.enabled) {
            item.classList.add('active');
        }
        
        // Module info
        const info = document.createElement('div');
        info.className = 'module-info';
        
        const name = document.createElement('div');
        name.className = 'module-name';
        name.textContent = module.name;
        
        const description = document.createElement('div');
        description.className = 'module-description';
        description.textContent = module.description;
        
        info.appendChild(name);
        info.appendChild(description);
        
        // Controls
        const controls = document.createElement('div');
        controls.className = 'module-controls';
        
        // Settings button
        if (Object.keys(module.settings).length > 0) {
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'module-settings-btn';
            settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
            settingsBtn.title = 'Module Settings';
            
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleModuleSettings(item, module);
            });
            
            controls.appendChild(settingsBtn);
        }
        
        // Toggle switch
        const toggle = ComponentFactory.createToggleSwitch(module.enabled, (enabled) => {
            module.enabled = enabled;
            item.classList.toggle('active', enabled);
            this.saveModuleState(module.id, enabled);
            this.onModuleToggle(module, enabled);
        });
        
        controls.appendChild(toggle);
        
        // Click to toggle
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.module-controls')) {
                toggle.click();
            }
        });
        
        item.appendChild(info);
        item.appendChild(controls);
        
        return item;
    }
    
    toggleModuleSettings(moduleItem, module) {
        let settingsPanel = moduleItem.querySelector('.module-settings');
        
        if (settingsPanel) {
            if (settingsPanel.classList.contains('active')) {
                settingsPanel.classList.remove('active');
                AnimationUtils.slideUp(settingsPanel);
            } else {
                settingsPanel.classList.add('active');
                AnimationUtils.slideDown(settingsPanel);
            }
        } else {
            settingsPanel = ComponentFactory.createModuleSettings(module);
            moduleItem.appendChild(settingsPanel);
            settingsPanel.classList.add('active');
            AnimationUtils.slideDown(settingsPanel);
        }
    }
    
    handleSearch(query) {
        const searchResults = document.getElementById('searchResults');
        
        if (!query.trim()) {
            searchResults.style.display = 'none';
            this.searchResults = [];
            return;
        }
        
        this.searchResults = [];
        
        Object.entries(this.modules).forEach(([categoryId, category]) => {
            category.modules.forEach(module => {
                if (module.name.toLowerCase().includes(query.toLowerCase()) ||
                    module.description.toLowerCase().includes(query.toLowerCase())) {
                    this.searchResults.push({
                        module,
                        category: category.name,
                        categoryId
                    });
                }
            });
        });
        
        this.renderSearchResults();
    }
    
    renderSearchResults() {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        
        if (this.searchResults.length === 0) {
            searchResults.style.display = 'none';
            return;
        }
        
        this.searchResults.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            
            item.innerHTML = `
                <div style="font-weight: 500;">${result.module.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${result.category}</div>
            `;
            
            item.addEventListener('click', () => {
                this.scrollToModule(result.categoryId, result.module.id);
                searchResults.style.display = 'none';
                document.getElementById('searchInput').value = '';
            });
            
            searchResults.appendChild(item);
        });
        
        searchResults.style.display = 'block';
    }
    
    scrollToModule(categoryId, moduleId) {
        const categoryCard = document.querySelector(`[data-category-id="${categoryId}"]`);
        const moduleItem = categoryCard.querySelector(`[data-module-id="${moduleId}"]`);
        
        if (categoryCard && moduleItem) {
            // Expand category if collapsed
            const content = categoryCard.querySelector('.category-content');
            if (content.classList.contains('collapsed')) {
                categoryCard.querySelector('.category-header').click();
            }
            
            // Scroll to module
            setTimeout(() => {
                moduleItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                moduleItem.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    moduleItem.style.animation = '';
                }, 2000);
            }, 300);
        }
    }
    
    setupTooltips() {
        const tooltip = document.getElementById('tooltip');
        
        document.addEventListener('mouseover', (e) => {
            const element = e.target.closest('[title]');
            if (element) {
                const title = element.getAttribute('title');
                if (title) {
                    tooltip.textContent = title;
                    tooltip.classList.add('active');
                    this.updateTooltipPosition(e, tooltip);
                    element.removeAttribute('title');
                    element.dataset.originalTitle = title;
                }
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (tooltip.classList.contains('active')) {
                this.updateTooltipPosition(e, tooltip);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const element = e.target.closest('[data-original-title]');
            if (element) {
                tooltip.classList.remove('active');
                element.setAttribute('title', element.dataset.originalTitle);
                element.removeAttribute('data-original-title');
            }
        });
    }
    
    updateTooltipPosition(e, tooltip) {
        const x = e.clientX + 10;
        const y = e.clientY - 30;
        
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        
        // Adjust if tooltip goes off screen
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = (e.clientX - rect.width - 10) + 'px';
        }
        if (rect.top < 0) {
            tooltip.style.top = (e.clientY + 20) + 'px';
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    }
    
    toggleMinimize() {
        const guiMain = document.querySelector('.gui-main');
        const isMinimized = guiMain.style.display === 'none';
        
        if (isMinimized) {
            guiMain.style.display = 'block';
            AnimationUtils.fadeIn(guiMain);
        } else {
            AnimationUtils.fadeOut(guiMain);
        }
    }
    
    applySettings() {
        this.applyTheme(this.settings.theme);
        this.applyAnimationSpeed(this.settings.animationSpeed);
        this.applyGridColumns(this.settings.gridColumns);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    applyAnimationSpeed(speed) {
        document.documentElement.style.setProperty('--transition-fast', `${0.15 * speed}s ease-out`);
        document.documentElement.style.setProperty('--transition-normal', `${0.3 * speed}s ease-out`);
        document.documentElement.style.setProperty('--transition-slow', `${0.5 * speed}s ease-out`);
    }
    
    applyGridColumns(columns) {
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }
    
    onModuleToggle(module, enabled) {
        console.log(`Module ${module.name} ${enabled ? 'enabled' : 'disabled'}`);
        
        // Add visual feedback
        const moduleItem = document.querySelector(`[data-module-id="${module.id}"]`);
        if (moduleItem) {
            moduleItem.style.transform = 'scale(1.02)';
            setTimeout(() => {
                moduleItem.style.transform = '';
            }, 150);
        }
    }
    
    saveModuleState(moduleId, enabled) {
        const savedStates = JSON.parse(localStorage.getItem('moduleStates') || '{}');
        savedStates[moduleId] = enabled;
        localStorage.setItem('moduleStates', JSON.stringify(savedStates));
    }
    
    loadModuleStates() {
        const savedStates = JSON.parse(localStorage.getItem('moduleStates') || '{}');
        
        Object.entries(this.modules).forEach(([categoryId, category]) => {
            category.modules.forEach(module => {
                if (savedStates.hasOwnProperty(module.id)) {
                    module.enabled = savedStates[module.id];
                }
            });
        });
    }
    
    saveSettings() {
        localStorage.setItem('guiSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const defaultSettings = {
            theme: 'dark',
            animationSpeed: 1.0,
            gridColumns: 3
        };
        
        const saved = localStorage.getItem('guiSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClickGUI();
});