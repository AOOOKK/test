// Module data structure
const moduleCategories = {
    combat: {
        name: 'Combat',
        icon: 'fas fa-sword',
        color: '#ef4444',
        modules: [
            {
                id: 'killaura',
                name: 'KillAura',
                description: 'Automatically attacks nearby entities',
                enabled: false,
                settings: {
                    range: { type: 'slider', value: 4.0, min: 1.0, max: 8.0, step: 0.1 },
                    delay: { type: 'slider', value: 100, min: 0, max: 1000, step: 10 },
                    targets: { type: 'select', value: 'players', options: ['players', 'mobs', 'all'] }
                }
            },
            {
                id: 'criticals',
                name: 'Criticals',
                description: 'Forces critical hits on attacks',
                enabled: false,
                settings: {
                    mode: { type: 'select', value: 'jump', options: ['jump', 'packet', 'mini'] }
                }
            },
            {
                id: 'velocity',
                name: 'Velocity',
                description: 'Reduces knockback taken',
                enabled: false,
                settings: {
                    horizontal: { type: 'slider', value: 90, min: 0, max: 100, step: 1 },
                    vertical: { type: 'slider', value: 100, min: 0, max: 100, step: 1 }
                }
            },
            {
                id: 'autoclicker',
                name: 'AutoClicker',
                description: 'Automatically clicks at set intervals',
                enabled: false,
                settings: {
                    cps: { type: 'slider', value: 12, min: 1, max: 20, step: 1 },
                    randomization: { type: 'slider', value: 2, min: 0, max: 5, step: 0.1 }
                }
            }
        ]
    },
    movement: {
        name: 'Movement',
        icon: 'fas fa-running',
        color: '#10b981',
        modules: [
            {
                id: 'speed',
                name: 'Speed',
                description: 'Increases movement speed',
                enabled: false,
                settings: {
                    mode: { type: 'select', value: 'vanilla', options: ['vanilla', 'strafe', 'bhop'] },
                    speed: { type: 'slider', value: 1.5, min: 0.1, max: 5.0, step: 0.1 }
                }
            },
            {
                id: 'fly',
                name: 'Fly',
                description: 'Allows flight in survival mode',
                enabled: false,
                settings: {
                    mode: { type: 'select', value: 'vanilla', options: ['vanilla', 'packet', 'creative'] },
                    speed: { type: 'slider', value: 1.0, min: 0.1, max: 10.0, step: 0.1 }
                }
            },
            {
                id: 'sprint',
                name: 'Sprint',
                description: 'Automatically sprints',
                enabled: false,
                settings: {
                    omnidirectional: { type: 'checkbox', value: true }
                }
            },
            {
                id: 'step',
                name: 'Step',
                description: 'Allows stepping up higher blocks',
                enabled: false,
                settings: {
                    height: { type: 'slider', value: 1.0, min: 0.5, max: 3.0, step: 0.1 }
                }
            }
        ]
    },
    render: {
        name: 'Render',
        icon: 'fas fa-eye',
        color: '#8b5cf6',
        modules: [
            {
                id: 'esp',
                name: 'ESP',
                description: 'Shows entities through walls',
                enabled: false,
                settings: {
                    players: { type: 'checkbox', value: true },
                    mobs: { type: 'checkbox', value: false },
                    items: { type: 'checkbox', value: false },
                    color: { type: 'color', value: '#ff0000' }
                }
            },
            {
                id: 'fullbright',
                name: 'Fullbright',
                description: 'Removes darkness and lighting',
                enabled: false,
                settings: {
                    gamma: { type: 'slider', value: 15.0, min: 1.0, max: 20.0, step: 0.1 }
                }
            },
            {
                id: 'nametags',
                name: 'NameTags',
                description: 'Shows enhanced player nametags',
                enabled: false,
                settings: {
                    health: { type: 'checkbox', value: true },
                    distance: { type: 'checkbox', value: true },
                    armor: { type: 'checkbox', value: false }
                }
            },
            {
                id: 'tracers',
                name: 'Tracers',
                description: 'Draws lines to entities',
                enabled: false,
                settings: {
                    players: { type: 'checkbox', value: true },
                    mobs: { type: 'checkbox', value: false },
                    width: { type: 'slider', value: 2, min: 1, max: 5, step: 1 }
                }
            }
        ]
    },
    world: {
        name: 'World',
        icon: 'fas fa-globe',
        color: '#f59e0b',
        modules: [
            {
                id: 'xray',
                name: 'X-Ray',
                description: 'See ores through blocks',
                enabled: false,
                settings: {
                    opacity: { type: 'slider', value: 50, min: 0, max: 100, step: 1 },
                    ores: { type: 'multiselect', value: ['diamond', 'gold', 'iron'], options: ['diamond', 'gold', 'iron', 'coal', 'redstone', 'lapis'] }
                }
            },
            {
                id: 'nuker',
                name: 'Nuker',
                description: 'Automatically breaks blocks around you',
                enabled: false,
                settings: {
                    range: { type: 'slider', value: 3, min: 1, max: 6, step: 1 },
                    delay: { type: 'slider', value: 50, min: 0, max: 500, step: 10 }
                }
            },
            {
                id: 'scaffold',
                name: 'Scaffold',
                description: 'Automatically places blocks under you',
                enabled: false,
                settings: {
                    tower: { type: 'checkbox', value: false },
                    safeWalk: { type: 'checkbox', value: true }
                }
            }
        ]
    },
    player: {
        name: 'Player',
        icon: 'fas fa-user',
        color: '#06b6d4',
        modules: [
            {
                id: 'nofall',
                name: 'NoFall',
                description: 'Prevents fall damage',
                enabled: false,
                settings: {
                    mode: { type: 'select', value: 'packet', options: ['packet', 'spoof', 'edit'] }
                }
            },
            {
                id: 'regen',
                name: 'Regen',
                description: 'Speeds up health regeneration',
                enabled: false,
                settings: {
                    speed: { type: 'slider', value: 2, min: 1, max: 10, step: 1 }
                }
            },
            {
                id: 'fasteat',
                name: 'FastEat',
                description: 'Eat food faster',
                enabled: false,
                settings: {
                    speed: { type: 'slider', value: 2, min: 1, max: 5, step: 0.1 }
                }
            },
            {
                id: 'inventorymove',
                name: 'InventoryMove',
                description: 'Move while in inventory',
                enabled: false,
                settings: {}
            }
        ]
    },
    misc: {
        name: 'Miscellaneous',
        icon: 'fas fa-cogs',
        color: '#64748b',
        modules: [
            {
                id: 'autototem',
                name: 'AutoTotem',
                description: 'Automatically equips totems',
                enabled: false,
                settings: {
                    health: { type: 'slider', value: 16, min: 1, max: 20, step: 1 }
                }
            },
            {
                id: 'middleclick',
                name: 'MiddleClick',
                description: 'Middle click actions',
                enabled: false,
                settings: {
                    friends: { type: 'checkbox', value: true },
                    pearl: { type: 'checkbox', value: false }
                }
            },
            {
                id: 'autorespawn',
                name: 'AutoRespawn',
                description: 'Automatically respawns on death',
                enabled: false,
                settings: {}
            }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { moduleCategories };
}