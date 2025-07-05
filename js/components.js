// Component creation utilities
class ComponentFactory {
    static createToggleSwitch(isActive = false, onChange = null) {
        const toggle = document.createElement('div');
        toggle.className = `toggle-switch ${isActive ? 'active' : ''}`;
        
        const slider = document.createElement('div');
        slider.className = 'toggle-slider';
        toggle.appendChild(slider);
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            if (onChange) {
                onChange(toggle.classList.contains('active'));
            }
        });
        
        return toggle;
    }
    
    static createSlider(options = {}) {
        const {
            min = 0,
            max = 100,
            value = 50,
            step = 1,
            onChange = null
        } = options;
        
        const container = document.createElement('div');
        container.className = 'slider-container';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'custom-slider';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = value;
        
        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            valueDisplay.textContent = newValue;
            if (onChange) {
                onChange(newValue);
            }
        });
        
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        
        return container;
    }
    
    static createSelect(options = {}) {
        const {
            options: selectOptions = [],
            value = '',
            onChange = null
        } = options;
        
        const select = document.createElement('select');
        select.className = 'custom-select';
        
        selectOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
            if (option === value) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        
        select.addEventListener('change', (e) => {
            if (onChange) {
                onChange(e.target.value);
            }
        });
        
        return select;
    }
    
    static createCheckbox(isChecked = false, onChange = null) {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'custom-checkbox';
        checkbox.checked = isChecked;
        
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        
        checkbox.addEventListener('change', (e) => {
            if (onChange) {
                onChange(e.target.checked);
            }
        });
        
        container.appendChild(checkbox);
        container.appendChild(checkmark);
        
        return container;
    }
    
    static createColorPicker(color = '#ffffff', onChange = null) {
        const input = document.createElement('input');
        input.type = 'color';
        input.className = 'color-picker';
        input.value = color;
        
        input.addEventListener('change', (e) => {
            if (onChange) {
                onChange(e.target.value);
            }
        });
        
        return input;
    }
    
    static createModuleSettings(module) {
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'module-settings';
        
        Object.entries(module.settings).forEach(([key, setting]) => {
            const settingItem = document.createElement('div');
            settingItem.className = 'setting-item';
            
            const label = document.createElement('label');
            label.className = 'setting-label';
            label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            settingItem.appendChild(label);
            
            let control;
            
            switch (setting.type) {
                case 'slider':
                    control = this.createSlider({
                        min: setting.min,
                        max: setting.max,
                        value: setting.value,
                        step: setting.step,
                        onChange: (value) => {
                            module.settings[key].value = value;
                            this.saveModuleSettings(module.id, module.settings);
                        }
                    });
                    break;
                    
                case 'select':
                    control = this.createSelect({
                        options: setting.options,
                        value: setting.value,
                        onChange: (value) => {
                            module.settings[key].value = value;
                            this.saveModuleSettings(module.id, module.settings);
                        }
                    });
                    break;
                    
                case 'checkbox':
                    control = this.createCheckbox(setting.value, (checked) => {
                        module.settings[key].value = checked;
                        this.saveModuleSettings(module.id, module.settings);
                    });
                    break;
                    
                case 'color':
                    control = this.createColorPicker(setting.value, (color) => {
                        module.settings[key].value = color;
                        this.saveModuleSettings(module.id, module.settings);
                    });
                    break;
                    
                default:
                    control = document.createElement('span');
                    control.textContent = 'Unknown setting type';
            }
            
            settingItem.appendChild(control);
            settingsContainer.appendChild(settingItem);
        });
        
        return settingsContainer;
    }
    
    static saveModuleSettings(moduleId, settings) {
        const savedSettings = JSON.parse(localStorage.getItem('moduleSettings') || '{}');
        savedSettings[moduleId] = settings;
        localStorage.setItem('moduleSettings', JSON.stringify(savedSettings));
    }
    
    static loadModuleSettings() {
        return JSON.parse(localStorage.getItem('moduleSettings') || '{}');
    }
}

// Animation utilities
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideDown(element, duration = 300) {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (targetHeight * progress) + 'px';
            
            if (progress >= 1) {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideUp(element, duration = 300) {
        const startHeight = element.offsetHeight;
        const start = performance.now();
        
        element.style.overflow = 'hidden';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (startHeight * (1 - progress)) + 'px';
            
            if (progress >= 1) {
                element.style.display = 'none';
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Drag and drop utilities
class DragDropManager {
    constructor() {
        this.draggedElement = null;
        this.placeholder = null;
    }
    
    makeDraggable(element) {
        element.draggable = true;
        
        element.addEventListener('dragstart', (e) => {
            this.draggedElement = element;
            element.classList.add('dragging');
            
            // Create placeholder
            this.placeholder = element.cloneNode(true);
            this.placeholder.classList.add('placeholder');
            this.placeholder.style.opacity = '0.5';
            
            e.dataTransfer.effectAllowed = 'move';
        });
        
        element.addEventListener('dragend', (e) => {
            element.classList.remove('dragging');
            if (this.placeholder && this.placeholder.parentNode) {
                this.placeholder.parentNode.removeChild(this.placeholder);
            }
            this.draggedElement = null;
            this.placeholder = null;
        });
    }
    
    makeDropZone(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(element, e.clientY);
            if (afterElement == null) {
                element.appendChild(this.placeholder);
            } else {
                element.insertBefore(this.placeholder, afterElement);
            }
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (this.draggedElement && this.placeholder) {
                this.placeholder.parentNode.replaceChild(this.draggedElement, this.placeholder);
                this.saveOrder(element);
            }
        });
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.category-card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    saveOrder(container) {
        const order = [...container.querySelectorAll('.category-card')].map(card => 
            card.dataset.categoryId
        );
        localStorage.setItem('categoryOrder', JSON.stringify(order));
    }
    
    loadOrder() {
        return JSON.parse(localStorage.getItem('categoryOrder') || '[]');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ComponentFactory, AnimationUtils, DragDropManager };
}