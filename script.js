// --- Audio System ---
const sfx = {
    bgm: new Audio('sounds/bgm.mp3'),
    click: new Audio('sounds/click.mp3'),
    spin: new Audio('sounds/spin.mp3'),
    fruitSpin: new Audio('sounds/spin2.mp3'),
    win: new Audio('sounds/win.mp3'),
    craft: new Audio('sounds/craft.mp3'),
    open: new Audio('sounds/open.mp3')
};

Object.values(sfx).forEach(audio => audio.volume = 0.5);
sfx.bgm.volume = 0.2;
sfx.bgm.loop = true;

let bgmStarted = false;
const bgmSlider = document.getElementById('bgm-volume-slider');
if (bgmSlider) {
    sfx.bgm.volume = parseFloat(bgmSlider.value) || 0.2;
    bgmSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        sfx.bgm.volume = value;
    });
}
document.body.addEventListener('click', () => {
    if (!bgmStarted) {
        sfx.bgm.play().catch(() => {});
        bgmStarted = true;
    }
});

function playSound(type) {
    if (sfx[type]) {
        sfx[type].currentTime = 0;
        sfx[type].play().catch(() => {}); 
    }
}

// --- Constants & Data ---
const MAX_POKEMON = 1025;
const genBounds = {
    1: [1, 151], 2: [152, 251], 3: [252, 386],
    4: [387, 493], 5: [494, 649], 6: [650, 721],
    7: [722, 809], 8: [810, 905], 9: [906, 1025]
};
const legendaries = [
    144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251,
    377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
    480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
    494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
    716, 717, 718, 719, 720, 721,
    772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
    888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
    1001, 1002, 1003, 1004, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1024, 1025
];

const rarities = [
    { id: 'common', name: 'Common', color: '#b2bec3', chance: 0.85, pool: 'normal', next: 'rare' },
    { id: 'rare', name: 'Rare', color: '#74b9ff', chance: 0.10, pool: 'normal', next: 'epic' },
    { id: 'epic', name: 'Epic', color: '#a29bfe', chance: 0.04, pool: 'normal', next: 'legendary' },
    { id: 'legendary', name: 'Legendary', color: '#ff7675', chance: 0.01, pool: 'legendary', next: null }
];

const rarityTiers = {};
rarities.forEach(r => rarityTiers[r.id] = r);

const fruitTierDefs = {
    common: { name: 'Common', color: '#b2bec3', next: 'uncommon' },
    uncommon: { name: 'Uncommon', color: '#4ade80', next: 'rare' },
    rare: { name: 'Rare', color: '#60a5fa', next: 'epic' },
    epic: { name: 'Epic', color: '#8b5cf6', next: 'legendary' },
    legendary: { name: 'Legendary', color: '#ff7675', next: null }
};

const fruitPool = [
    { key: 'apple', emoji: '🍎', name: 'Apple' },
    { key: 'banana', emoji: '🍌', name: 'Banana' },
    { key: 'grapes', emoji: '🍇', name: 'Grapes' },
    { key: 'orange', emoji: '🍊', name: 'Orange' },
    { key: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    { key: 'pineapple', emoji: '🍍', name: 'Pineapple' },
    { key: 'watermelon', emoji: '🍉', name: 'Watermelon' },
    { key: 'cherry', emoji: '🍒', name: 'Cherry' },
    { key: 'pear', emoji: '🍐', name: 'Pear' },
    { key: 'mango', emoji: '🥭', name: 'Mango' },
    { key: 'peach', emoji: '🍑', name: 'Peach' },
    { key: 'kiwi', emoji: '🥝', name: 'Kiwi' },
    { key: 'lemon', emoji: '🍋', name: 'Lemon' },
    { key: 'lime', emoji: '🍋', name: 'Lime' },
    { key: 'blueberry', emoji: '🫐', name: 'Blueberry' },
    { key: 'plum', emoji: '🍑', name: 'Plum' },
    { key: 'coconut', emoji: '🥥', name: 'Coconut' },
    { key: 'pomegranate', emoji: '🔴', name: 'Pomegranate' }
];

const starterLineIds = new Set([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    152, 153, 154, 155, 156, 157, 158, 159, 160,
    252, 253, 254, 255, 256, 257, 258, 259, 260,
    387, 388, 389, 390, 391, 392, 393, 394, 395,
    495, 496, 497, 498, 499, 500, 501, 502, 503,
    650, 651, 652, 653, 654, 655, 656, 657, 658,
    722, 723, 724, 725, 726, 727, 728, 729, 730,
    810, 811, 812, 813, 814, 815, 816, 817, 818,
    906, 907, 908, 909, 910, 911, 912, 913, 914
]);

const pseudoLegendaryIds = new Set([148, 149, 248, 373, 376, 445, 635, 706, 784, 998]);
const paradoxIds = new Set([982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996]);

function getRewardTierKey(pokemonId, fallbackTierKey) {
    if (legendaries.includes(pokemonId)) {
        return 'legendary';
    }
    return fallbackTierKey;
}

function getRarityBorderClass(tierKey) {
    switch (tierKey) {
        case 'common': return 'rarity-border-common';
        case 'rare': return 'rarity-border-rare';
        case 'epic': return 'rarity-border-epic';
        case 'legendary': return 'rarity-border-legendary';
        default: return 'rarity-border-common';
    }
}

// --- Storage Systems ---
function normalizeInventory(rawInventory) {
    const baseInventory = { common: [], rare: [], epic: [], legendary: [] };
    const source = rawInventory || {};

    Object.entries(baseInventory).forEach(([tierKey]) => {
        const entries = source[tierKey] || [];
        baseInventory[tierKey] = Array.isArray(entries)
            ? entries.map(item => {
                if (typeof item === 'number') return { id: item, shiny: false };
                return { id: item?.id, shiny: Boolean(item?.shiny) };
            })
            : [];
    });

    return baseInventory;
}

let inventory = normalizeInventory(JSON.parse(localStorage.getItem('pokeInventory')) || { common: [], rare: [], epic: [], legendary: [] });
let favorites = JSON.parse(localStorage.getItem('pokeFavs')) || [];
let ownedSpecies = JSON.parse(localStorage.getItem('pokeSpecies')) || []; 
let fruitInventory = normalizeFruitInventory(JSON.parse(localStorage.getItem('fruitInventory')) || { common: [], uncommon: [], rare: [], epic: [], legendary: [] });

function saveInventory() { 
    localStorage.setItem('pokeInventory', JSON.stringify(inventory)); 
    localStorage.setItem('pokeSpecies', JSON.stringify(ownedSpecies));
    localStorage.setItem('fruitInventory', JSON.stringify(fruitInventory));
}

function normalizeFruitInventory(rawFruitInventory) {
    const baseInventory = { common: [], uncommon: [], rare: [], epic: [], legendary: [] };
    const source = rawFruitInventory || {};

    Object.entries(baseInventory).forEach(([tierKey]) => {
        const entries = source[tierKey] || [];
        baseInventory[tierKey] = Array.isArray(entries)
            ? entries.map(item => (typeof item === 'string' ? { key: item } : { key: item?.key }))
            : [];
    });

    return baseInventory;
}

function getFruitInventoryItems(tierKey) {
    return fruitInventory[tierKey] || [];
}

function addFruitToInventory(tierKey, fruitKey) {
    const existing = fruitInventory[tierKey].find(item => item.key === fruitKey);
    if (!existing) fruitInventory[tierKey].push({ key: fruitKey });
}

function getFruitTierBorderClass(tierKey) {
    switch (tierKey) {
        case 'common': return 'fruit-border-common';
        case 'uncommon': return 'fruit-border-uncommon';
        case 'rare': return 'fruit-border-rare';
        case 'epic': return 'fruit-border-epic';
        case 'legendary': return 'fruit-border-legendary';
        default: return 'fruit-border-common';
    }
}

function getFruitInfo(key) {
    return fruitPool.find(fruit => fruit.key === key) || fruitPool[0];
}

function getFruitTierForMatchCount(matchCount) {
    if (matchCount === 2) {
        const roll = Math.random();
        if (roll < 0.8) return 'common';
        if (roll < 0.9) return 'uncommon';
        return 'rare';
    }

    if (matchCount === 3) {
        const roll = Math.random();
        if (roll < 0.8) return 'rare';
        if (roll < 0.96) return 'epic';
        return 'legendary';
    }

    return null;
}

function isFruitOwned(fruitKey, tierKey) {
    return (fruitInventory[tierKey] || []).some(item => item.key === fruitKey);
}

function renderFruitDetailPanel(fruitKey) {
    const container = document.getElementById('fruit-details-content');
    if (!container) return;

    const fruit = getFruitInfo(fruitKey);
    const rarityRows = Object.keys(fruitTierDefs).map(tierKey => {
        const owned = isFruitOwned(fruit.key, tierKey);
        const tier = fruitTierDefs[tierKey];
        return `
            <div class="fruit-rarity-row ${owned ? 'owned' : 'unowned'}">
                <span>${tier.name}</span>
                <span>${owned ? 'Owned' : 'Not Owned'}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="fruit-detail-hero">
            <div class="fruit-emoji-large">${fruit.emoji}</div>
            <div>
                <div class="fruit-detail-name">${fruit.name}</div>
                <div class="fruit-detail-subtitle">Collection progress</div>
            </div>
        </div>
        <div class="fruit-rarity-list">${rarityRows}</div>
    `;
}

function renderFruitPokedex() {
    const grid = document.getElementById('fruit-pokedex-grid');
    if (!grid) return;

    grid.innerHTML = '';
    fruitPool.forEach((fruit, index) => {
        const card = document.createElement('div');
        card.className = 'fruit-pokedex-item';
        card.onclick = () => {
            document.querySelectorAll('.fruit-pokedex-item').forEach(item => item.classList.remove('active'));
            card.classList.add('active');
            renderFruitDetailPanel(fruit.key);
        };

        card.innerHTML = `
            <div class="fruit-emoji">${fruit.emoji}</div>
            <div class="fruit-name">${fruit.name}</div>
        `;
        grid.appendChild(card);

        if (index === 0) {
            card.classList.add('active');
            renderFruitDetailPanel(fruit.key);
        }
    });
}

function getInventoryItems(tierKey) {
    return inventory[tierKey] || [];
}

function addPokemonToInventory(tierKey, pokeId, shiny = false) {
    const existing = inventory[tierKey].find(item => item.id === pokeId && item.shiny === shiny);
    if (!existing) inventory[tierKey].push({ id: pokeId, shiny });
}

function getPokemonSpriteUrl(id, shiny = false) {
    return shiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function isPokemonOwned(id) { 
    return Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id)); 
}

function toggleFavorite(id) {
    playSound('click');
    if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
    else favorites.push(id);
    localStorage.setItem('pokeFavs', JSON.stringify(favorites));
    
    if (!document.getElementById('screen-inventory').classList.contains('hidden')) renderInventory();
    if (!document.getElementById('screen-pokedex').classList.contains('hidden')) renderPokedexGrid();
}

// --- Floating Background System ---
const bgSymbols = ['🍰', '🎂', '🍫', '🍓', '🍬'];
const bgContainer = document.getElementById('floating-background');

function spawnFloatingSweet() {
    const item = document.createElement('div');
    item.classList.add('floating-item');
    item.textContent = bgSymbols[Math.floor(Math.random() * bgSymbols.length)];
    const size = Math.random() * 25 + 20; 
    const leftPosition = Math.random() * 100; 
    const floatDuration = Math.random() * 10 + 12; 
    const startDelay = Math.random() * 5; 
    
    item.style.fontSize = `${size}px`;
    item.style.left = `${leftPosition}vw`;
    item.style.animationDuration = `${floatDuration}s`;
    item.style.animationDelay = `${startDelay}s`;
    
    bgContainer.appendChild(item);
    setTimeout(() => { item.remove(); }, (floatDuration + startDelay) * 1000);
}

for(let i = 0; i < 12; i++) spawnFloatingSweet();
setInterval(spawnFloatingSweet, 2000);

// --- Screen Navigation Logic ---
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('btn-bag').classList.remove('hidden');
        playSound('open');
    }, 2500);
});

function switchScreen(hideId, showId) {
    playSound('open');
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(showId).classList.remove('hidden');
    
    const btnBack = document.getElementById('btn-back');
    const btnBag = document.getElementById('btn-bag');
    
    if(showId === 'main-menu') {
        btnBack.classList.add('hidden');
        btnBag.classList.remove('hidden');
    } else if (showId === 'game-wheel') {
        btnBack.classList.remove('hidden');
        btnBag.classList.remove('hidden');
        btnBack.onclick = () => { playSound('click'); switchScreen('game-wheel', 'main-menu'); };
    } else if (showId === 'fruit-slots-screen') {
        btnBag.classList.remove('hidden');
        btnBack.classList.remove('hidden');
        btnBack.onclick = () => { playSound('click'); switchScreen('fruit-slots-screen', 'main-menu'); };
    } else if (showId === 'fruit-pokedex-screen') {
        btnBag.classList.remove('hidden');
        btnBack.classList.remove('hidden');
        btnBack.onclick = () => { playSound('click'); switchScreen('fruit-pokedex-screen', 'main-menu'); };
    } else if (showId === 'screen-inventory') {
        btnBag.classList.add('hidden');
        btnBack.classList.remove('hidden');
        btnBack.onclick = () => { playSound('click'); switchScreen('screen-inventory', 'main-menu'); };
        renderInventory();
    } else if (showId === 'screen-pokedex') {
        btnBag.classList.remove('hidden');
        btnBack.classList.remove('hidden');
        btnBack.onclick = () => { playSound('click'); switchScreen('screen-pokedex', 'main-menu'); };
        renderPokedexGrid();
    }
}

document.getElementById('btn-wheel').addEventListener('click', () => { switchScreen('main-menu', 'game-wheel'); resetGame(); });
document.getElementById('btn-fruit-slots').addEventListener('click', () => { switchScreen('main-menu', 'fruit-slots-screen'); resetFruitGame(); });
document.getElementById('btn-fruit-dex').addEventListener('click', () => { switchScreen('main-menu', 'fruit-pokedex-screen'); renderFruitPokedex(); });
document.getElementById('btn-bag').addEventListener('click', () => { switchScreen(null, 'screen-inventory'); });
document.getElementById('btn-pokedex').addEventListener('click', () => { switchScreen('main-menu', 'screen-pokedex'); });
document.getElementById('fruit-dex-btn').addEventListener('click', () => { switchScreen('fruit-slots-screen', 'fruit-pokedex-screen'); renderFruitPokedex(); });
document.getElementById('bag-tab-pokemon').addEventListener('click', () => renderInventory('pokemon'));
document.getElementById('bag-tab-fruit').addEventListener('click', () => renderInventory('fruit'));

// --- Selection Modal System (For Crafting & Sacrificing) ---
let pendingSelection = { type: '', tier: '', required: 0, callback: null, selectedIndices: [] };

function openSelectionModal(type, tier, requiredCount, callback) {
    playSound('open');
    const tierItems = getInventoryItems(tier);
    const availableItems = tierItems.map((item, index) => ({ ...item, index })).filter(item => !favorites.includes(item.id));
    
    if (availableItems.length < requiredCount) {
        alert(`You need ${requiredCount} unfavorited ${rarityTiers[tier].name} Pokémon to do this! Unfavorite some first. ❌`);
        return;
    }

    pendingSelection = { type, tier, required: requiredCount, callback, selectedIndices: [] };
    
    document.getElementById('select-modal-title').textContent = type === 'craft' ? 'Crafting Menu' : 'Sacrifice Menu';
    document.getElementById('select-modal-subtitle').textContent = `Pick ${requiredCount} ${rarityTiers[tier].name} Pokémon`;
    
    const grid = document.getElementById('select-grid');
    grid.innerHTML = '';
    
    tierItems.forEach((item, index) => {
        const isFav = favorites.includes(item.id);
        const box = document.createElement('div');
        box.classList.add('inv-item');
        box.style.borderColor = rarityTiers[tier].color;
        
        if (isFav) {
            box.classList.add('locked-item');
            box.innerHTML = `<span class="fav-lock">❤️</span><img src="${getPokemonSpriteUrl(item.id, item.shiny)}">`;
        } else {
            box.classList.add('selectable-item');
            box.onclick = () => toggleSelection(index, box);
            box.innerHTML = `${item.shiny ? '<span class="shiny-icon">✨</span>' : ''}<img src="${getPokemonSpriteUrl(item.id, item.shiny)}">`;
        }
        grid.appendChild(box);
    });
    
    updateSelectionConfirmBtn();
    
    const confirmBtn = document.getElementById('select-confirm-btn');
    confirmBtn.onclick = () => confirmSelection();
    
    document.getElementById('select-modal').classList.remove('hidden');
}

function toggleSelection(index, boxEl) {
    playSound('click');
    const pos = pendingSelection.selectedIndices.indexOf(index);
    if (pos > -1) {
        pendingSelection.selectedIndices.splice(pos, 1);
        boxEl.classList.remove('selected');
    } else {
        if (pendingSelection.selectedIndices.length < pendingSelection.required) {
            pendingSelection.selectedIndices.push(index);
            boxEl.classList.add('selected');
        }
    }
    updateSelectionConfirmBtn();
}

function updateSelectionConfirmBtn() {
    const btn = document.getElementById('select-confirm-btn');
    if (pendingSelection.selectedIndices.length === pendingSelection.required) {
        btn.disabled = false;
        btn.textContent = "Confirm Selection";
    } else {
        btn.disabled = true;
        btn.textContent = `Selected ${pendingSelection.selectedIndices.length} / ${pendingSelection.required}`;
    }
}

function confirmSelection() {
    playSound('click');
    document.getElementById('select-modal').classList.add('hidden');
    if (pendingSelection.callback) {
        pendingSelection.callback([...pendingSelection.selectedIndices]);
    }
}

function closeSelectModal() {
    playSound('click');
    document.getElementById('select-modal').classList.add('hidden');
}


// --- Wheel Data & Logic ---
const genSegments = [
    { label: 'Gen 1', color: '#ffb7b2', id: 1 }, { label: 'Gen 2', color: '#a8e6cf', id: 2 },
    { label: 'Gen 3', color: '#ffffff', id: 3 }, { label: 'Gen 4', color: '#ffb7b2', id: 4 },
    { label: 'Gen 5', color: '#a8e6cf', id: 5 }, { label: 'Gen 6', color: '#ffffff', id: 6 },
    { label: 'Gen 7', color: '#ffb7b2', id: 7 }, { label: 'Gen 8', color: '#a8e6cf', id: 8 },
    { label: 'Gen 9', color: '#ffffff', id: 9 }
];

const raritySegments = [
    { label: 'Common', color: '#b2bec3', id: 'common' }, { label: 'Rare', color: '#74b9ff', id: 'rare' },
    { label: 'Common', color: '#b2bec3', id: 'common' }, { label: 'Epic', color: '#a29bfe', id: 'epic' },
    { label: 'Common', color: '#b2bec3', id: 'common' }, { label: 'Rare', color: '#74b9ff', id: 'rare' },
    { label: 'Common', color: '#b2bec3', id: 'common' }, { label: 'Legendary', color: '#ff7675', id: 'legendary' }
];

let currentPhase = 'gen';
let currentRotation = 0;
let selectedGen = null;
let selectedRarity = null;
let devModeEnabled = false;
let devOverrides = {
    enabled: false,
    gen: null,
    rarity: null,
    shiny: false,
    pokemonId: null
};

function setupDeveloperMode() {
    const toggleBtn = document.getElementById('dev-toggle-btn');
    const panel = document.getElementById('dev-panel');
    const applyBtn = document.getElementById('dev-apply-btn');
    const clearBtn = document.getElementById('dev-clear-btn');

    if (!toggleBtn || !panel || !applyBtn || !clearBtn) return;

    toggleBtn.addEventListener('click', () => {
        devModeEnabled = !devModeEnabled;
        panel.classList.toggle('hidden', !devModeEnabled);
    });

    applyBtn.addEventListener('click', () => {
        devOverrides.enabled = document.getElementById('dev-enable-override').checked;
        devOverrides.gen = document.getElementById('dev-gen-select').value ? parseInt(document.getElementById('dev-gen-select').value, 10) : null;
        devOverrides.rarity = document.getElementById('dev-rarity-select').value || null;
        devOverrides.shiny = document.getElementById('dev-shiny-checkbox').checked;
        const pokemonInput = document.getElementById('dev-pokemon-id').value;
        devOverrides.pokemonId = pokemonInput ? parseInt(pokemonInput, 10) : null;
        updateDevStatus();
    });

    clearBtn.addEventListener('click', () => {
        devOverrides = { enabled: false, gen: null, rarity: null, shiny: false, pokemonId: null };
        document.getElementById('dev-enable-override').checked = false;
        document.getElementById('dev-gen-select').value = '';
        document.getElementById('dev-rarity-select').value = '';
        document.getElementById('dev-shiny-checkbox').checked = false;
        document.getElementById('dev-pokemon-id').value = '';
        updateDevStatus();
    });
}

function updateDevStatus() {
    const status = document.getElementById('dev-status');
    if (!status) return;

    if (!devModeEnabled) {
        status.textContent = 'Developer mode is hidden.';
        return;
    }

    if (!devOverrides.enabled) {
        status.textContent = 'Dev overrides are off.';
        return;
    }

    const parts = [];
    if (devOverrides.gen) parts.push(`Gen ${devOverrides.gen}`);
    if (devOverrides.rarity) parts.push(devOverrides.rarity.charAt(0).toUpperCase() + devOverrides.rarity.slice(1));
    if (devOverrides.shiny) parts.push('Shiny');
    if (devOverrides.pokemonId) parts.push(`Pokémon #${devOverrides.pokemonId}`);
    status.textContent = parts.length > 0 ? `Next spin: ${parts.join(' • ')}` : 'Next spin: random';
}

function getDevOverrideForSpin() {
    if (!devModeEnabled || !devOverrides.enabled) return null;
    return devOverrides;
}

function drawWheelOnCanvas(canvas, segments) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX;
    const arc = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((seg, i) => {
        const startAngle = i * arc - Math.PI / 2 - arc / 2;
        const endAngle = startAngle + arc;
        
        ctx.beginPath();
        ctx.fillStyle = seg.color;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fill();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke(); 

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * arc - Math.PI / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#4a4a4a";
        if(canvas.width > 150) { ctx.font = "bold 16px Fredoka"; ctx.fillText(seg.label, radius - 15, 6); } 
        else { ctx.font = "bold 12px Fredoka"; ctx.fillText(seg.label, radius - 12, 4); }
        ctx.restore();
    });
}

function resetGame() {
    currentPhase = 'gen';
    document.getElementById('wheel-title').textContent = `🎀 Gen Wheel 🎀`;
    document.getElementById('message').textContent = "Spin to pick a Generation!";
    document.getElementById('reward-area').classList.add('hidden');
    document.getElementById('multi-reward-area').classList.add('hidden');
    document.getElementById('multi-spin-controls').classList.remove('hidden');
    document.querySelector('.wheel-box').classList.remove('hidden');
    document.getElementById('multi-wheel-grid').classList.add('hidden');
    document.getElementById('gen-badge').classList.add('hidden');
    
    const canvas = document.getElementById('wheel-canvas');
    canvas.style.transition = 'none';
    canvas.style.transform = `rotate(0deg)`;
    currentRotation = 0;
    
    drawWheelOnCanvas(canvas, genSegments);
    
    const btn = document.getElementById('spinBtn');
    btn.textContent = "SPIN!";
    btn.disabled = false;
    btn.classList.remove('hidden');
    btn.onclick = spinWheel;
}

function getRandomRarity() {
    let rand = Math.random();
    let cumulative = 0;
    for (let r of rarities) {
        cumulative += r.chance;
        if (rand <= cumulative) return r;
    }
    return rarities[0];
}

function spinWheel() {
    playSound('spin');
    const btn = document.getElementById('spinBtn');
    const canvas = document.getElementById('wheel-canvas');
    const message = document.getElementById('message');
    const title = document.getElementById('wheel-title');
    const devSpin = getDevOverrideForSpin();
    
    btn.disabled = true;
    document.getElementById('multi-spin-controls').classList.add('hidden');
    
    let winningIndex;
    let winner;
    const segments = currentPhase === 'gen' ? genSegments : raritySegments;

    if (currentPhase === 'gen') {
        if (devSpin?.gen) {
            winningIndex = segments.findIndex(seg => seg.id === devSpin.gen);
            if (winningIndex === -1) winningIndex = Math.floor(Math.random() * segments.length);
        } else {
            winningIndex = Math.floor(Math.random() * segments.length);
        }
        winner = segments[winningIndex];
    } else {
        const chosenTier = devSpin?.rarity ? rarityTiers[devSpin.rarity] : getRandomRarity();
        const matchingIndices = segments.map((s, idx) => s.id === chosenTier.id ? idx : -1).filter(idx => idx !== -1);
        winningIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
        winner = segments[winningIndex];
    }
    
    const sliceAngle = 360 / segments.length;
    const extraSpins = 5 * 360; 
    const randomOffset = (Math.random() * sliceAngle * 0.8) - (sliceAngle * 0.4); 
    const targetRotation = currentRotation + extraSpins + (360 - (winningIndex * sliceAngle)) - (currentRotation % 360) + randomOffset;
    
    message.textContent = `Spinning for ${currentPhase === 'gen' ? 'Generation' : 'Rarity'}... ✨`;
    
    canvas.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    canvas.style.transform = `rotate(${targetRotation}deg)`;
    currentRotation = targetRotation;
    
    setTimeout(() => {
        if (currentPhase === 'gen') {
            selectedGen = winner.id;
            message.textContent = `Got ${winner.label}! Now spinning for Rarity... 🎀`;
            title.textContent = `🎀 Rarity Wheel 🎀`;
            
            currentPhase = 'rarity';
            playSound('open');
            
            setTimeout(() => {
                canvas.style.transition = 'none'; 
                canvas.style.transform = `rotate(0deg)`;
                currentRotation = 0;
                drawWheelOnCanvas(canvas, raritySegments);
                
                setTimeout(() => { spinWheel(); }, 100);
            }, 1500);
            
        } else {
            selectedRarity = winner.id; 
            message.textContent = `Jackpot! 💖`;
            playSound('win');
            generatePokemonReward();
            
            btn.disabled = false;
            btn.textContent = "PLAY AGAIN!";
            btn.onclick = () => { playSound('click'); resetGame(); };
        }
    }, 3000); 
}

function getRandomNormal(start, end, excludeList) {
    let id;
    do { id = Math.floor(Math.random() * (end - start + 1)) + start; } while (excludeList.includes(id));
    return id;
}

async function getRewardId(selectedRarity, selectedGen) {
    const tier = rarityTiers[selectedRarity];
    const [start, end] = genBounds[selectedGen];
    const genLegendaries = legendaries.filter(id => id >= start && id <= end);
    let baseId;
    
    if (tier.pool === 'legendary') {
        baseId = genLegendaries.length > 0 ? genLegendaries[Math.floor(Math.random() * genLegendaries.length)] : getRandomNormal(start, end, genLegendaries);
    } else {
        baseId = getRandomNormal(start, end, genLegendaries);
    }

    let finalId = baseId;
    if (Math.random() < 0.20) { 
        try {
            const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${baseId}`).then(r => r.json());
            const alts = speciesData.varieties.filter(v => !v.is_default);
            if (alts.length > 0) {
                const chosen = alts[Math.floor(Math.random() * alts.length)];
                finalId = parseInt(chosen.pokemon.url.split('/').slice(-2, -1)[0]);
            }
        } catch(e) {}
    }
    return { baseId, finalId };
}

async function generatePokemonReward() {
    const { baseId, finalId } = await getRewardId(selectedRarity, selectedGen);
    const devSpin = getDevOverrideForSpin();
    const isShinyReward = devSpin?.shiny ? true : Math.random() < 0.01;
    const rewardId = devSpin?.pokemonId || finalId;
    const rewardBaseId = devSpin?.pokemonId || baseId;
    const rewardTierKey = getRewardTierKey(rewardId, selectedRarity);
    const tier = rarityTiers[rewardTierKey];

    addPokemonToInventory(rewardTierKey, rewardId, isShinyReward);
    if (!ownedSpecies.includes(rewardBaseId)) ownedSpecies.push(rewardBaseId); 
    saveInventory();

    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${rewardId}`).then(r => r.json());

    document.getElementById('pokemon-img').src = getPokemonSpriteUrl(rewardId, isShinyReward);
    document.getElementById('cap-top').style.backgroundColor = tier.color;
    document.getElementById('gen-badge').classList.add('hidden');

    const rewardArea = document.getElementById('reward-area');
    const capsule = rewardArea.querySelector('.capsule');
    const borderClass = getRarityBorderClass(rewardTierKey);
    [rewardArea, capsule].forEach(el => {
        el.classList.remove('rarity-border-common', 'rarity-border-rare', 'rarity-border-epic', 'rarity-border-legendary');
        el.classList.add(borderClass);
    });
    
    const rarityBadge = document.getElementById('rarity-badge');
    rarityBadge.textContent = `${tier.name}${isShinyReward ? ' ✨' : ''}`;
    rarityBadge.style.backgroundColor = tier.color;
    rarityBadge.classList.toggle('shiny-badge', isShinyReward);

    const typesContainer = document.getElementById('reward-types');
    typesContainer.innerHTML = '';
    pokeData.types.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.backgroundColor = getTypeColor(t.type.name);
        span.textContent = t.type.name.toUpperCase();
        typesContainer.appendChild(span);
    });

    rewardArea.classList.remove('hidden');
    setTimeout(() => rewardArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

    if (devSpin?.enabled) {
        devOverrides.enabled = false;
        updateDevStatus();
    }
}


// --- Multi-Spin Feature ---
function attemptMultiSpin(count, costTier) {
    playSound('click');
    openSelectionModal('spin', costTier, 1, (selectedIndices) => {
        playSound('craft');
        
        selectedIndices.sort((a,b) => b - a).forEach(idx => {
            inventory[costTier].splice(idx, 1);
        });
        saveInventory();

        document.getElementById('spinBtn').classList.add('hidden');
        document.querySelector('.wheel-box').classList.add('hidden');
        document.getElementById('multi-spin-controls').classList.add('hidden');

        const grid = document.getElementById('multi-wheel-grid');
        grid.innerHTML = '';
        grid.classList.remove('hidden');

        const multiState = [];
        for (let i = 0; i < count; i++) {
            grid.innerHTML += `<div class="mini-wheel-box"><div class="mini-pointer">▼</div><canvas id="mini-wheel-${i}" width="140" height="140"></canvas></div>`;
            multiState.push({ rotation: 0, gen: null, rarity: null });
        }

        setTimeout(() => {
            for (let i = 0; i < count; i++) { drawWheelOnCanvas(document.getElementById(`mini-wheel-${i}`), genSegments); }
            executeMultiSpin(count, multiState, 'gen');
        }, 50);
    });
}

function executeMultiSpin(count, state, phase) {
    playSound('spin');
    const segments = phase === 'gen' ? genSegments : raritySegments;
    document.getElementById('message').textContent = `Spinning ${phase === 'gen' ? 'Generations' : 'Rarities'}... ✨`;
    document.getElementById('wheel-title').textContent = phase === 'gen' ? `🎀 Multi-Gen Wheels 🎀` : `🎀 Multi-Rarity Wheels 🎀`;

    for (let i = 0; i < count; i++) {
        const canvas = document.getElementById(`mini-wheel-${i}`);
        let winningIndex, winner;

        if (phase === 'gen') {
            winningIndex = Math.floor(Math.random() * segments.length);
            winner = segments[winningIndex];
            state[i].gen = winner.id;
        } else {
            const chosenTier = getRandomRarity();
            const matchingIndices = segments.map((s, idx) => s.id === chosenTier.id ? idx : -1).filter(idx => idx !== -1);
            winningIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
            winner = segments[winningIndex];
            state[i].rarity = winner.id;
        }

        const sliceAngle = 360 / segments.length;
        const extraSpins = (Math.floor(Math.random() * 3) + 3) * 360; 
        const targetRotation = state[i].rotation + extraSpins + (360 - (winningIndex * sliceAngle)) - (state[i].rotation % 360);

        canvas.style.transition = `transform ${2 + Math.random()}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        canvas.style.transform = `rotate(${targetRotation}deg)`;
        state[i].rotation = targetRotation;
    }

    setTimeout(() => {
        if (phase === 'gen') {
            playSound('open');
            for (let i = 0; i < count; i++) {
                const canvas = document.getElementById(`mini-wheel-${i}`);
                canvas.style.transition = 'none';
                canvas.style.transform = 'rotate(0deg)';
                state[i].rotation = 0;
                drawWheelOnCanvas(canvas, raritySegments);
            }
            setTimeout(() => executeMultiSpin(count, state, 'rarity'), 500);
        } else {
            generateMultiRewards(state);
        }
    }, 3500);
}

async function generateMultiRewards(state) {
    playSound('win');
    document.getElementById('message').textContent = `Mega Jackpot! 💖`;
    document.getElementById('multi-wheel-grid').classList.add('hidden');

    const rewardArea = document.getElementById('multi-reward-area');
    rewardArea.innerHTML = '';
    rewardArea.classList.remove('hidden');

    const rewardPromises = state.map(res => getRewardId(res.rarity, res.gen).then(async data => {
        const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.finalId}`).then(r => r.json());
        return { ...res, ...data, pokeData };
    }));
    const finalRewards = await Promise.all(rewardPromises);

    finalRewards.forEach(res => {
        const rewardTierKey = getRewardTierKey(res.finalId, res.rarity);
        const tier = rarityTiers[rewardTierKey];
        const isShinyReward = Math.random() < 0.01;
        addPokemonToInventory(rewardTierKey, res.finalId, isShinyReward);
        if (!ownedSpecies.includes(res.baseId)) ownedSpecies.push(res.baseId);

        let typesHTML = res.pokeData.types.map(t => `<span class="badge" style="background-color:${getTypeColor(t.type.name)}">${t.type.name.toUpperCase()}</span>`).join('');

        const borderClass = getRarityBorderClass(rewardTierKey);

        rewardArea.innerHTML += `
            <div class="mini-reward-card ${borderClass}">
                <div class="mini-capsule ${borderClass}">
                    <div class="mini-cap-top" style="background-color:${tier.color}"></div>
                    <div class="mini-cap-bottom"></div>
                    ${isShinyReward ? '<span class="shiny-icon">✨</span>' : ''}
                    <img src="${getPokemonSpriteUrl(res.finalId, isShinyReward)}">
                </div>
                <span class="badge ${isShinyReward ? 'shiny-badge' : ''}" style="background-color:${tier.color}; font-size:10px; margin: 2px 0;">${tier.name}${isShinyReward ? ' ✨' : ''}</span>
                <div class="mini-reward-types">${typesHTML}</div>
            </div>
        `;
    });
    saveInventory();
    setTimeout(() => rewardArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

    const btn = document.getElementById('spinBtn');
    btn.textContent = "PLAY AGAIN!";
    btn.disabled = false;
    btn.classList.remove('hidden');
    btn.onclick = () => { playSound('click'); resetGame(); };
}


// --- Fruit Slot Machine Logic ---
function resetFruitGame() {
    document.getElementById('fruit-reward-area').classList.add('hidden');
    document.getElementById('fruit-message').textContent = 'Spin for a fruity prize! ✨';
    document.getElementById('fruit-spin-btn').disabled = false;
    ['fruit-reel-0', 'fruit-reel-1', 'fruit-reel-2'].forEach((id, index) => {
        const reel = document.getElementById(id);
        reel.textContent = fruitPool[index % fruitPool.length].emoji;
    });
}

function spinFruitSlots() {
    playSound('fruitSpin');
    const btn = document.getElementById('fruit-spin-btn');
    const message = document.getElementById('fruit-message');
    const rewardArea = document.getElementById('fruit-reward-area');
    const reelEls = ['fruit-reel-0', 'fruit-reel-1', 'fruit-reel-2'].map(id => document.getElementById(id));

    btn.disabled = true;
    rewardArea.classList.add('hidden');
    message.textContent = 'Spinning... 🍀';

    const spinInterval = setInterval(() => {
        reelEls.forEach(reel => {
            const randomFruit = fruitPool[Math.floor(Math.random() * fruitPool.length)];
            reel.textContent = randomFruit.emoji;
        });
    }, 90);

    setTimeout(() => {
        clearInterval(spinInterval);

        const outcomeRoll = Math.random();
        let matchCount = 0;
        if (outcomeRoll < 0.5) matchCount = 2;
        else if (outcomeRoll < 0.75) matchCount = 3;

        let fruitKeys = [];
        if (matchCount === 3) {
            const fruit = fruitPool[Math.floor(Math.random() * fruitPool.length)];
            fruitKeys = [fruit.key, fruit.key, fruit.key];
        } else if (matchCount === 2) {
            const fruit = fruitPool[Math.floor(Math.random() * fruitPool.length)];
            const otherFruit = fruitPool.filter(f => f.key !== fruit.key)[Math.floor(Math.random() * (fruitPool.length - 1))];
            fruitKeys = [fruit.key, fruit.key, otherFruit.key];
        } else {
            const shuffled = [...fruitPool].sort(() => Math.random() - 0.5);
            fruitKeys = [shuffled[0].key, shuffled[1].key, shuffled[2].key];
        }

        fruitKeys.forEach((fruitKey, index) => {
            const fruitInfo = getFruitInfo(fruitKey);
            reelEls[index].textContent = fruitInfo.emoji;
        });

        if (matchCount === 0) {
            message.textContent = 'No match this round — try again!';
            btn.disabled = false;
            return;
        }

        const tierKey = getFruitTierForMatchCount(matchCount);
        const fruitInfo = getFruitInfo(fruitKeys[0]);
        addFruitToInventory(tierKey, fruitInfo.key);
        saveInventory();

        document.getElementById('fruit-cap-top').style.backgroundColor = fruitTierDefs[tierKey].color;
        document.getElementById('fruit-capsule').className = `fruit-capsule ${getFruitTierBorderClass(tierKey)}`;
        document.getElementById('fruit-capsule-symbol').textContent = fruitInfo.emoji;
        document.getElementById('fruit-tier-badge').textContent = fruitTierDefs[tierKey].name;
        document.getElementById('fruit-tier-badge').style.backgroundColor = fruitTierDefs[tierKey].color;
        document.getElementById('fruit-name-badge').textContent = fruitInfo.name;
        document.getElementById('fruit-name-badge').style.backgroundColor = '#ff7b89';
        rewardArea.classList.remove('hidden');
        message.textContent = matchCount === 2 ? 'Two matches! Your capsule is on the way!' : 'Three matches! Legendary fruit energy!';
        btn.disabled = false;
    }, 1800);
}

document.getElementById('fruit-spin-btn').addEventListener('click', spinFruitSlots);

// --- Inventory & Crafting Logic ---
let activeBagView = 'pokemon';

function renderInventory(view = activeBagView) {
    activeBagView = view;
    const content = document.getElementById('inventory-content');
    const subtitle = document.getElementById('inventory-subtitle');
    const pokemonTab = document.getElementById('bag-tab-pokemon');
    const fruitTab = document.getElementById('bag-tab-fruit');

    if (pokemonTab && fruitTab) {
        pokemonTab.classList.toggle('active', activeBagView === 'pokemon');
        fruitTab.classList.toggle('active', activeBagView === 'fruit');
    }

    if (subtitle) {
        subtitle.textContent = activeBagView === 'fruit'
            ? 'Your fruit capsules are sorted by rarity tier.'
            : 'Trade 5 of the same rarity for 1 of the next!';
    }

    content.innerHTML = '';

    if (activeBagView === 'fruit') {
        Object.keys(fruitInventory).forEach(tierKey => {
            const entries = fruitInventory[tierKey] || [];
            const section = document.createElement('div');
            section.classList.add('inv-tier-section');
            section.style.borderColor = fruitTierDefs[tierKey].color;

            const header = document.createElement('div');
            header.classList.add('inv-tier-header');
            header.innerHTML = `<h3><span class="badge" style="background-color:${fruitTierDefs[tierKey].color}">${fruitTierDefs[tierKey].name}</span> (${entries.length})</h3>`;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.classList.add('inv-grid');

            if (entries.length === 0) {
                grid.innerHTML = `<p style="color:#aaa; font-size:12px; grid-column: 1/-1; text-align:left;">No fruits in this tier yet...</p>`;
            } else {
                entries.forEach(entry => {
                    const fruitInfo = getFruitInfo(entry.key);
                    const box = document.createElement('div');
                    box.classList.add('inv-item', getFruitTierBorderClass(tierKey));
                    box.innerHTML = `<div style="font-size: 28px;">${fruitInfo.emoji}</div>`;
                    grid.appendChild(box);
                });
            }

            section.appendChild(grid);
            content.appendChild(section);
        });
        return;
    }

    Object.keys(rarityTiers).forEach(tierKey => {
        const tier = rarityTiers[tierKey];
        const items = getInventoryItems(tierKey);
        const unfavoritedCount = items.filter(item => !favorites.includes(item.id)).length;
        const canCraft = tier.next !== null && unfavoritedCount >= 5;

        const section = document.createElement('div');
        section.classList.add('inv-tier-section');
        section.style.borderColor = tier.color;

        const header = document.createElement('div');
        header.classList.add('inv-tier-header');
        
        let titleHTML = `<span class="badge" style="background-color:${tier.color}">${tier.name}</span> (${items.length})`;
        let btnHTML = tier.next ? `<button class="craft-btn" ${canCraft ? '' : 'disabled'} onclick="craftPokemon('${tierKey}')">Craft ${rarityTiers[tier.next].name} (5)</button>` : '';
        
        header.innerHTML = `<h3>${titleHTML}</h3> ${btnHTML}`;
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.classList.add('inv-grid');
        
        items.forEach(item => {
            const isFav = favorites.includes(item.id);
            const box = document.createElement('div');
            box.classList.add('inv-item', getRarityBorderClass(tierKey));
            box.style.cursor = 'pointer';
            box.onclick = () => {
                playSound('click');
                switchScreen('screen-inventory', 'screen-pokedex');
                setTimeout(() => openDexModal(item.id), 120);
            };
            box.innerHTML = `
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id})">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                ${item.shiny ? '<span class="shiny-icon">✨</span>' : ''}
                <img src="${getPokemonSpriteUrl(item.id, item.shiny)}" alt="poke">
            `;
            grid.appendChild(box);
        });

        if(items.length === 0) grid.innerHTML = `<p style="color:#aaa; font-size:12px; grid-column: 1/-1; text-align:left;">No Pokémon yet...</p>`;

        section.appendChild(grid);
        content.appendChild(section);
    });
}

function craftPokemon(fromTierKey) {
    openSelectionModal('craft', fromTierKey, 5, async (selectedIndices) => {
        playSound('craft');
        const inventoryScreen = document.getElementById('screen-inventory');
        inventoryScreen.classList.add('crafting-active');

        const toTierKey = rarityTiers[fromTierKey].next;
        const toTier = rarityTiers[toTierKey];
        
        const sacrificedIds = selectedIndices.map(idx => inventory[fromTierKey][idx].id);
        selectedIndices.sort((a,b) => b - a).forEach(idx => inventory[fromTierKey].splice(idx, 1));
        
        const randomGen = Math.floor(Math.random() * 9) + 1;
        const { baseId, finalId } = await getRewardId(toTierKey, randomGen);
        
        addPokemonToInventory(toTierKey, finalId, false);
        if (!ownedSpecies.includes(baseId)) ownedSpecies.push(baseId);
        saveInventory();
        
        const vortex = document.getElementById('craft-vortex');
        vortex.innerHTML = '';
        sacrificedIds.forEach(id => {
            vortex.innerHTML += `<img class="craft-particle" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">`;
        });
        
        document.getElementById('craft-anim-modal').classList.remove('hidden');

        setTimeout(() => {
            inventoryScreen.classList.remove('crafting-active');
            renderInventory();
            document.getElementById('craft-anim-modal').classList.add('hidden');
            playSound('win');
            
            document.getElementById('craft-tier-name').textContent = toTier.name;
            document.getElementById('craft-tier-name').style.color = toTier.color;
            document.getElementById('craft-cap-top').style.backgroundColor = toTier.color;
            document.getElementById('craft-pokemon-img').src = getPokemonSpriteUrl(finalId, false);
            
            document.getElementById('craft-modal').classList.remove('hidden');
        }, 2000);
    });
}

function closeCraftModal() {
    playSound('click');
    document.getElementById('craft-modal').classList.add('hidden');
    document.getElementById('screen-inventory').classList.remove('crafting-active');
}


// --- Pokédex Logic (With Shiny & Forms) ---
let isShinyView = false;
let currentPokeData = null;

document.getElementById('dex-gen-select').addEventListener('change', () => playSound('click'));

function renderPokedexGrid() {
    const gen = parseInt(document.getElementById('dex-gen-select').value);
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';
    
    const [start, end] = genBounds[gen];
    let ownedInGen = 0;
    
    for (let id = start; id <= end; id++) {
        const owned = ownedSpecies.includes(id) || isPokemonOwned(id);
        const isFav = favorites.includes(id); 
        if (owned) ownedInGen++;
        
        const box = document.createElement('div');
        box.className = `dex-item ${owned ? '' : 'unowned'}`;
        box.onclick = () => { playSound('click'); openDexModal(id); };
        
        box.innerHTML = `
            <span class="dex-id-label">#${id}</span>
            ${owned && isFav ? '<span class="dex-fav-heart">❤️</span>' : ''}
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="poke">
        `;
        grid.appendChild(box);
    }
    
    document.getElementById('dex-progress').textContent = `${ownedInGen} / ${end - start + 1} Owned`;
}

async function openDexModal(baseId) {
    document.getElementById('dex-modal').classList.remove('hidden');
    playSound('open');
    isShinyView = false; 
    document.getElementById('dex-loading').classList.remove('hidden');
    document.getElementById('dex-content').classList.add('hidden');
    
    try {
        const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${baseId}`).then(res => res.json());
        
        const formContainer = document.getElementById('dex-forms');
        formContainer.innerHTML = '';
        
        speciesData.varieties.forEach((v, idx) => {
            const vId = parseInt(v.pokemon.url.split('/').slice(-2, -1)[0]);
            const isBase = v.is_default;
            const ownsThisForm = isPokemonOwned(vId);
            const ownsAnyForm = ownedSpecies.includes(baseId) || isPokemonOwned(baseId);
            
            if (ownsThisForm || (isBase && ownsAnyForm) || !ownsAnyForm) {
                const btn = document.createElement('button');
                btn.className = `form-btn ${idx === 0 ? 'active' : ''}`;
                btn.textContent = v.pokemon.name.replace(speciesData.name + '-', '').replace(speciesData.name, 'Base').toUpperCase();
                btn.onclick = () => {
                    playSound('click');
                    document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    loadFormData(vId, ownsThisForm || (isBase && ownsAnyForm), speciesData);
                };
                formContainer.appendChild(btn);
            }
        });

        const defaultVariety = speciesData.varieties.find(v => v.is_default);
        const defaultId = parseInt(defaultVariety.pokemon.url.split('/').slice(-2, -1)[0]);
        
        await loadFormData(defaultId, isPokemonOwned(defaultId) || ownedSpecies.includes(baseId), speciesData);

        document.getElementById('dex-loading').classList.add('hidden');
        document.getElementById('dex-content').classList.remove('hidden');
    } catch(err) {
        document.getElementById('dex-loading').textContent = "Failed to load data 😢";
    }
}

async function loadFormData(id, isOwned, speciesData) {
    const pokeData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json());
    currentPokeData = pokeData;
    
    document.getElementById('dex-name').textContent = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1).replace('-', ' ');
    
    const badge = document.getElementById('dex-ownership-badge');
    if (isOwned) {
        badge.textContent = "Owned 💖";
        badge.style.backgroundColor = "#ff7b89";
    } else {
        badge.textContent = "Unowned 🔒";
        badge.style.backgroundColor = "#b2bec3";
    }

    const favBtn = document.getElementById('dex-fav-btn');
    if (isOwned) {
        favBtn.classList.remove('hidden');
        const isFav = favorites.includes(id);
        favBtn.innerHTML = isFav ? "❤️ Favorited" : "🤍 Favorite";
        if(isFav) favBtn.classList.add('active'); else favBtn.classList.remove('active');
        favBtn.onclick = () => { 
            toggleFavorite(id); 
            const updatedFav = favorites.includes(id);
            favBtn.innerHTML = updatedFav ? "❤️ Favorited" : "🤍 Favorite";
            if(updatedFav) favBtn.classList.add('active'); else favBtn.classList.remove('active');
        };
    } else {
        favBtn.classList.add('hidden');
    }
    
    updateDexImage();
    
    const typesContainer = document.getElementById('dex-types');
    typesContainer.innerHTML = '';
    pokeData.types.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.backgroundColor = getTypeColor(t.type.name);
        span.textContent = t.type.name.toUpperCase();
        typesContainer.appendChild(span);
    });
    
    const enEntry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
    document.getElementById('dex-desc').textContent = enEntry ? enEntry.flavor_text.replace(/[\n\f]/g, ' ') : "No description available.";
    
    const maxStat = 255; 
    const getStat = (name) => pokeData.stats.find(s => s.stat.name === name).base_stat;
    const stats = {
        'hp': getStat('hp'), 'atk': getStat('attack'), 'def': getStat('defense'),
        'spa': getStat('special-attack'), 'spd': getStat('special-defense'), 'spe': getStat('speed')
    };

    for (const [key, val] of Object.entries(stats)) {
        document.getElementById(`stat-${key}`).style.width = `${(val / maxStat) * 100}%`;
        document.getElementById(`val-${key}`).textContent = val;
    }
}

function toggleShiny() {
    playSound('click');
    isShinyView = !isShinyView;
    updateDexImage();
}

function updateDexImage() {
    if (!currentPokeData) return;
    const sprites = currentPokeData.sprites;
    const shinyBtn = document.getElementById('dex-shiny-btn');
    
    if (isShinyView) {
        shinyBtn.classList.add('active');
        const animated = sprites.other?.showdown?.front_shiny;
        const staticImg = sprites.front_shiny || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${currentPokeData.id}.png`;
        document.getElementById('dex-detail-img').src = animated || staticImg;
    } else {
        shinyBtn.classList.remove('active');
        const animated = sprites.other?.showdown?.front_default;
        const staticImg = sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokeData.id}.png`;
        document.getElementById('dex-detail-img').src = animated || staticImg;
    }
}

function closeDexModal() {
    playSound('click');
    document.getElementById('dex-modal').classList.add('hidden');
}

function getTypeColor(type) {
    const colors = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD' };
    return colors[type] || '#74b9ff';
}

setupDeveloperMode();