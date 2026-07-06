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
const bgmVolInput = document.getElementById('bgm-volume-input');
if (bgmSlider) {
    sfx.bgm.volume = parseFloat(bgmSlider.value) || 0.2;
    if (bgmVolInput) bgmVolInput.value = bgmSlider.value;
    
    bgmSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        sfx.bgm.volume = value;
        if (bgmVolInput) bgmVolInput.value = value;
    });
    
    if (bgmVolInput) {
        bgmVolInput.addEventListener('input', (event) => {
            let value = parseFloat(event.target.value);
            value = Math.max(0, Math.min(1, value));
            sfx.bgm.volume = value;
            bgmSlider.value = value;
            bgmVolInput.value = value;
        });
    }
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
const APP_VERSION = '3.0';
const STORAGE_VERSION_KEY = 'appVersion';
const STORAGE_KEYS = ['pokeInventory', 'pokeSpecies', 'fruitInventory', 'pokeFavs'];
const STORAGE_SPRITE_MODE_KEY = 'spriteMode';
const STORAGE_USER_NAME_KEY = 'userName';
const STORAGE_USER_THEME_KEY = 'userTheme';
const SPRITE_MODES = { NORMAL: 'normal', ANIMATED_2D: 'animated-2d', SHOWDOWN: 'showdown' };
const THEME_GROUPS = {
    SPECIAL: 'special',
    MODERN: 'modern'
};
const DEFAULT_THEME_PRESETS = {
    SPECIAL: 'special-cotton',
    MODERN: 'modern-aurora'
};
const THEME_PALETTES = {
    [THEME_GROUPS.SPECIAL]: {
        'special-cotton': { label: 'Cotton Cloud', bgPrimary: '#fff7f4', bgSecondary: '#ffe9ea', textPrimary: '#5a3d3f', accentPrimary: '#ff7b89', accentSecondary: '#ffb6c1', shadowLight: '#f3d0d5', surfacePanel: 'rgba(255, 248, 245, 0.94)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fffdfb', surfaceMuted: 'rgba(255, 241, 239, 0.88)', borderSoft: '#ffd7dc', borderStrong: '#ff9fb0', textMuted: '#8a676b', textInverse: '#ffffff' },
        'special-sakura': { label: 'Sakura Bloom', bgPrimary: '#fff3f7', bgSecondary: '#ffe0e8', textPrimary: '#6a3542', accentPrimary: '#ff6f91', accentSecondary: '#f7b7c8', shadowLight: '#f8dce7', surfacePanel: 'rgba(255, 245, 248, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fffdfd', surfaceMuted: 'rgba(255, 239, 245, 0.9)', borderSoft: '#f6c9d8', borderStrong: '#ff8cb0', textMuted: '#8d6070', textInverse: '#ffffff' },
        'special-lilac': { label: 'Lilac Dream', bgPrimary: '#f8f2ff', bgSecondary: '#efe2ff', textPrimary: '#5f4b6f', accentPrimary: '#b58cff', accentSecondary: '#d6b8ff', shadowLight: '#e9d9ff', surfacePanel: 'rgba(248, 242, 255, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#ffffff', surfaceMuted: 'rgba(239, 226, 255, 0.88)', borderSoft: '#e2cfff', borderStrong: '#c79aff', textMuted: '#7d6a90', textInverse: '#ffffff' },
        'special-bubble': { label: 'Bubblegum Pop', bgPrimary: '#fff7fc', bgSecondary: '#ffe6f3', textPrimary: '#6b3f5a', accentPrimary: '#ff7fb3', accentSecondary: '#ffd0e7', shadowLight: '#f9d5ea', surfacePanel: 'rgba(255, 247, 250, 0.96)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fffcfe', surfaceMuted: 'rgba(255, 230, 243, 0.86)', borderSoft: '#ffd8ec', borderStrong: '#ff9ec9', textMuted: '#8b6480', textInverse: '#ffffff' },
        'special-berry': { label: 'Berry Charm', bgPrimary: '#fcf0ff', bgSecondary: '#f4dcff', textPrimary: '#593b61', accentPrimary: '#a14dff', accentSecondary: '#e0b2ff', shadowLight: '#ead1ff', surfacePanel: 'rgba(252, 240, 255, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#ffffff', surfaceMuted: 'rgba(244, 220, 255, 0.88)', borderSoft: '#ecd2ff', borderStrong: '#c487ff', textMuted: '#7c638b', textInverse: '#ffffff' },
        'special-caramel': { label: 'Caramel Glow', bgPrimary: '#fff7eb', bgSecondary: '#ffe6c7', textPrimary: '#6b4827', accentPrimary: '#d08b3f', accentSecondary: '#ffc97c', shadowLight: '#f7e0be', surfacePanel: 'rgba(255, 247, 235, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fffdf9', surfaceMuted: 'rgba(255, 230, 199, 0.88)', borderSoft: '#f8dcb2', borderStrong: '#f0b467', textMuted: '#8b6b43', textInverse: '#ffffff' },
        'special-mint': { label: 'Mint Breeze', bgPrimary: '#f4fff8', bgSecondary: '#dcffe7', textPrimary: '#355844', accentPrimary: '#4ecb8f', accentSecondary: '#91edbe', shadowLight: '#d2f3de', surfacePanel: 'rgba(244, 255, 248, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fcfffd', surfaceMuted: 'rgba(220, 255, 231, 0.86)', borderSoft: '#cdeed7', borderStrong: '#74cf9d', textMuted: '#5f7d6b', textInverse: '#ffffff' },
        'special-starlight': { label: 'Starlight Lace', bgPrimary: '#f4f7ff', bgSecondary: '#e0ebff', textPrimary: '#455574', accentPrimary: '#5e8cff', accentSecondary: '#a8c4ff', shadowLight: '#dce8ff', surfacePanel: 'rgba(244, 247, 255, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fcfdff', surfaceMuted: 'rgba(224, 235, 255, 0.88)', borderSoft: '#dce7ff', borderStrong: '#8fb4ff', textMuted: '#667797', textInverse: '#ffffff' },
        'special-rainbow': { label: 'Rainbow Sprinkles', bgPrimary: '#fffef2', bgSecondary: '#fff0b3', textPrimary: '#6e4f3a', accentPrimary: '#ff7f50', accentSecondary: '#ffbf69', shadowLight: '#fce9b9', surfacePanel: 'rgba(255, 254, 242, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#fffefc', surfaceMuted: 'rgba(255, 240, 179, 0.88)', borderSoft: '#fff0ba', borderStrong: '#ffb96e', textMuted: '#8a6d53', textInverse: '#ffffff' },
        'special-dream': { label: 'Dreamy Mauve', bgPrimary: '#fcf3ff', bgSecondary: '#f5dbff', textPrimary: '#6a3e65', accentPrimary: '#c46edb', accentSecondary: '#e8b7ff', shadowLight: '#f0d5ff', surfacePanel: 'rgba(252, 243, 255, 0.95)', surfaceElevated: 'rgba(255, 255, 255, 0.98)', surfaceCard: '#ffffff', surfaceMuted: 'rgba(245, 219, 255, 0.88)', borderSoft: '#edd1ff', borderStrong: '#d191eb', textMuted: '#805c81', textInverse: '#ffffff' }
    },
    [THEME_GROUPS.MODERN]: {
        'modern-aurora': { label: 'Aurora', bgPrimary: '#07111f', bgSecondary: '#0f172a', textPrimary: '#e2e8f0', accentPrimary: '#7dd3fc', accentSecondary: '#38bdf8', shadowLight: '#1e293b', surfacePanel: 'rgba(10, 19, 34, 0.96)', surfaceElevated: 'rgba(15, 23, 42, 0.98)', surfaceCard: '#111c2f', surfaceMuted: 'rgba(125, 211, 252, 0.08)', borderSoft: 'rgba(125, 211, 252, 0.18)', borderStrong: 'rgba(125, 211, 252, 0.28)', textMuted: '#cbd5e1', textInverse: '#ffffff' },
        'modern-obsidian': { label: 'Obsidian', bgPrimary: '#020202', bgSecondary: '#0d0d0d', textPrimary: '#f3f4f6', accentPrimary: '#f3f4f6', accentSecondary: '#6b7280', shadowLight: '#2a2a2a', surfacePanel: 'rgba(18, 18, 18, 0.97)', surfaceElevated: 'rgba(24, 24, 24, 0.98)', surfaceCard: '#1b1b1b', surfaceMuted: 'rgba(255, 255, 255, 0.05)', borderSoft: 'rgba(255, 255, 255, 0.12)', borderStrong: 'rgba(255, 255, 255, 0.2)', textMuted: '#b7bec7', textInverse: '#ffffff' },
        'modern-ember': { label: 'Ember', bgPrimary: '#1b0f0f', bgSecondary: '#291111', textPrimary: '#fef2f2', accentPrimary: '#fb923c', accentSecondary: '#f43f5e', shadowLight: '#3f1d1d', surfacePanel: 'rgba(29, 14, 14, 0.96)', surfaceElevated: 'rgba(41, 17, 17, 0.98)', surfaceCard: '#2b1717', surfaceMuted: 'rgba(251, 146, 60, 0.08)', borderSoft: 'rgba(251, 146, 60, 0.2)', borderStrong: 'rgba(244, 63, 94, 0.24)', textMuted: '#f7c8c8', textInverse: '#ffffff' },
        'modern-ice': { label: 'Iceglass', bgPrimary: '#f4f7fb', bgSecondary: '#e9eef6', textPrimary: '#1f2937', accentPrimary: '#0f766e', accentSecondary: '#38bdf8', shadowLight: '#d4dce7', surfacePanel: 'rgba(255, 255, 255, 0.96)', surfaceElevated: 'rgba(248, 250, 252, 0.98)', surfaceCard: '#ffffff', surfaceMuted: 'rgba(15, 23, 42, 0.04)', borderSoft: 'rgba(15, 23, 42, 0.1)', borderStrong: 'rgba(15, 23, 42, 0.16)', textMuted: '#64748b', textInverse: '#ffffff' },
        'modern-sage': { label: 'Sage', bgPrimary: '#111815', bgSecondary: '#17231f', textPrimary: '#f2f8f2', accentPrimary: '#8bc34a', accentSecondary: '#4caf50', shadowLight: '#253529', surfacePanel: 'rgba(20, 29, 24, 0.96)', surfaceElevated: 'rgba(24, 33, 28, 0.98)', surfaceCard: '#1d2922', surfaceMuted: 'rgba(139, 195, 74, 0.08)', borderSoft: 'rgba(139, 195, 74, 0.18)', borderStrong: 'rgba(76, 175, 80, 0.22)', textMuted: '#b8cdb7', textInverse: '#ffffff' },
        'modern-ocean': { label: 'Ocean', bgPrimary: '#071b24', bgSecondary: '#0d2a33', textPrimary: '#f4fbff', accentPrimary: '#2dd4bf', accentSecondary: '#38bdf8', shadowLight: '#113847', surfacePanel: 'rgba(8, 24, 32, 0.96)', surfaceElevated: 'rgba(13, 34, 44, 0.98)', surfaceCard: '#112b35', surfaceMuted: 'rgba(45, 212, 191, 0.09)', borderSoft: 'rgba(45, 212, 191, 0.18)', borderStrong: 'rgba(56, 189, 248, 0.22)', textMuted: '#c5e7eb', textInverse: '#ffffff' },
        'modern-violet': { label: 'Violet', bgPrimary: '#17111f', bgSecondary: '#22152f', textPrimary: '#f5efff', accentPrimary: '#a78bfa', accentSecondary: '#c084fc', shadowLight: '#372946', surfacePanel: 'rgba(25, 18, 33, 0.96)', surfaceElevated: 'rgba(34, 21, 47, 0.98)', surfaceCard: '#24182e', surfaceMuted: 'rgba(167, 139, 250, 0.08)', borderSoft: 'rgba(167, 139, 250, 0.18)', borderStrong: 'rgba(192, 132, 252, 0.24)', textMuted: '#e0d0ff', textInverse: '#ffffff' },
        'modern-coral': { label: 'Coral', bgPrimary: '#191111', bgSecondary: '#241313', textPrimary: '#fef2f2', accentPrimary: '#ff7d7d', accentSecondary: '#f59e0b', shadowLight: '#4a2525', surfacePanel: 'rgba(29, 17, 17, 0.96)', surfaceElevated: 'rgba(36, 19, 19, 0.98)', surfaceCard: '#2c1919', surfaceMuted: 'rgba(255, 125, 125, 0.08)', borderSoft: 'rgba(255, 125, 125, 0.2)', borderStrong: 'rgba(245, 158, 11, 0.24)', textMuted: '#f5c3c3', textInverse: '#ffffff' },
        'modern-sunset': { label: 'Sunset', bgPrimary: '#18110d', bgSecondary: '#24160d', textPrimary: '#fff7ed', accentPrimary: '#fdba74', accentSecondary: '#fb923c', shadowLight: '#3a2417', surfacePanel: 'rgba(29, 18, 13, 0.96)', surfaceElevated: 'rgba(36, 22, 13, 0.98)', surfaceCard: '#2b1c13', surfaceMuted: 'rgba(253, 186, 116, 0.08)', borderSoft: 'rgba(253, 186, 116, 0.2)', borderStrong: 'rgba(251, 146, 60, 0.24)', textMuted: '#f8dac3', textInverse: '#ffffff' },
        'modern-forest': { label: 'Forest', bgPrimary: '#0d1511', bgSecondary: '#132017', textPrimary: '#effcf2', accentPrimary: '#6ee7b7', accentSecondary: '#4ade80', shadowLight: '#223626', surfacePanel: 'rgba(14, 23, 17, 0.96)', surfaceElevated: 'rgba(19, 32, 23, 0.98)', surfaceCard: '#15231b', surfaceMuted: 'rgba(110, 231, 183, 0.08)', borderSoft: 'rgba(110, 231, 183, 0.18)', borderStrong: 'rgba(74, 222, 128, 0.24)', textMuted: '#cbead7', textInverse: '#ffffff' }
    }
};

// Hidden special names that trigger password prompt
const SPECIAL_NAMES = ['leen', 'harleen', 'darling', 'bebsy', 'honey', 'baby', 'cupcake', 'muffin'];
const SPECIAL_PASSWORD = 'march21';
const DEV_MENU_PASSWORD = 'july4';

let spriteMode = localStorage.getItem(STORAGE_SPRITE_MODE_KEY) || SPRITE_MODES.NORMAL;
let userName = localStorage.getItem(STORAGE_USER_NAME_KEY) || '';
let userTheme = normalizeThemePreset(localStorage.getItem(STORAGE_USER_THEME_KEY));

const pokemonDataCache = new Map();
const speciesDataCache = new Map();
const spriteUrlCache = new Map();
const pendingSpriteLoads = new Map();

async function fetchJsonWithTimeout(url, { timeout = 4000, signal } = {}) {
    const controller = signal ? null : new AbortController();
    const activeSignal = signal || controller.signal;
    const timer = setTimeout(() => controller?.abort(), timeout);

    try {
        const response = await fetch(url, { signal: activeSignal });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

async function fetchPokemonData(id, { timeout = 4000 } = {}) {
    const cacheKey = `pokemon:${id}`;
    if (pokemonDataCache.has(cacheKey)) {
        return pokemonDataCache.get(cacheKey);
    }

    const promise = fetchJsonWithTimeout(`https://pokeapi.co/api/v2/pokemon/${id}`, { timeout })
        .then(data => {
            pokemonDataCache.set(cacheKey, data);
            return data;
        })
        .catch(error => {
            pokemonDataCache.delete(cacheKey);
            throw error;
        });

    pokemonDataCache.set(cacheKey, promise);
    return promise;
}

async function fetchSpeciesData(id, { timeout = 4000 } = {}) {
    const cacheKey = `species:${id}`;
    if (speciesDataCache.has(cacheKey)) {
        return speciesDataCache.get(cacheKey);
    }

    const promise = fetchJsonWithTimeout(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { timeout })
        .then(data => {
            speciesDataCache.set(cacheKey, data);
            return data;
        })
        .catch(error => {
            speciesDataCache.delete(cacheKey);
            throw error;
        });

    speciesDataCache.set(cacheKey, promise);
    return promise;
}

function loadSpriteImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';

        const timeoutId = window.setTimeout(() => {
            img.onload = null;
            img.onerror = null;
            reject(new Error(`Sprite timed out: ${url}`));
        }, 2500);

        img.onload = () => {
            window.clearTimeout(timeoutId);
            resolve(url);
        };
        img.onerror = () => {
            window.clearTimeout(timeoutId);
            reject(new Error(`Sprite failed: ${url}`));
        };
        img.src = url;
    });
}

function createSpriteUrlCandidates(id, shiny = false) {
    const candidates = [];
    const addCandidate = (url) => {
        if (url && !candidates.includes(url)) candidates.push(url);
    };

    const rawBase = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    const jsDelivrBase = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon';
    const shinyPrefix = shiny ? 'shiny/' : '';

    if (spriteMode === SPRITE_MODES.SHOWDOWN) {
        addCandidate(`${rawBase}/other/showdown/${shinyPrefix}${id}.gif`);
        addCandidate(`${jsDelivrBase}/other/showdown/${shinyPrefix}${id}.gif`);
        addCandidate(`${rawBase}/other/showdown/${shinyPrefix}${id}.png`);
        addCandidate(`${jsDelivrBase}/other/showdown/${shinyPrefix}${id}.png`);
    } else if (spriteMode === SPRITE_MODES.ANIMATED_2D) {
        if (id <= 649) {
            addCandidate(`${rawBase}/versions/generation-v/black-white/animated/${shinyPrefix}${id}.gif`);
            addCandidate(`${jsDelivrBase}/versions/generation-v/black-white/animated/${shinyPrefix}${id}.gif`);
        }
        addCandidate(`${rawBase}/other/showdown/${shinyPrefix}${id}.gif`);
        addCandidate(`${jsDelivrBase}/other/showdown/${shinyPrefix}${id}.gif`);
        addCandidate(`${rawBase}/${shinyPrefix}${id}.png`);
        addCandidate(`${jsDelivrBase}/${shinyPrefix}${id}.png`);
    } else {
        addCandidate(`${rawBase}/${shinyPrefix}${id}.png`);
        addCandidate(`${jsDelivrBase}/${shinyPrefix}${id}.png`);
        addCandidate(`${rawBase}/other/showdown/${shinyPrefix}${id}.gif`);
        addCandidate(`${jsDelivrBase}/other/showdown/${shinyPrefix}${id}.gif`);
    }

    return candidates;
}

function getPokemonSpriteUrl(id, shiny = false) {
    const cacheKey = `${spriteMode}:${id}:${shiny ? 'shiny' : 'normal'}`;
    if (spriteUrlCache.has(cacheKey)) {
        return spriteUrlCache.get(cacheKey);
    }
    const [primaryUrl] = createSpriteUrlCandidates(id, shiny);
    return primaryUrl || '';
}

function setSpriteImage(imgEl, id, shiny = false) {
    if (!imgEl) return;

    imgEl.setAttribute('loading', 'lazy');
    imgEl.setAttribute('decoding', 'async');

    const cacheKey = `${spriteMode}:${id}:${shiny ? 'shiny' : 'normal'}`;
    const cachedUrl = spriteUrlCache.get(cacheKey);
    if (cachedUrl) {
        imgEl.src = cachedUrl;
        return;
    }

    const pending = pendingSpriteLoads.get(cacheKey) || (async () => {
        const urls = createSpriteUrlCandidates(id, shiny);
        for (const url of urls) {
            try {
                const resolvedUrl = await loadSpriteImage(url);
                spriteUrlCache.set(cacheKey, resolvedUrl);
                return resolvedUrl;
            } catch (error) {
                // Try the next candidate.
            }
        }
        return null;
    })();

    pendingSpriteLoads.set(cacheKey, pending);
    pending.then((resolvedUrl) => {
        if (resolvedUrl && imgEl) {
            spriteUrlCache.set(cacheKey, resolvedUrl);
            imgEl.src = resolvedUrl;
        } else if (imgEl) {
            imgEl.src = createSpriteUrlCandidates(id, shiny)[0] || '';
        }
        pendingSpriteLoads.delete(cacheKey);
    }).catch(() => {
        pendingSpriteLoads.delete(cacheKey);
    });
}

function getDexSpriteUrl(pokeData, shiny = false) {
    if (!pokeData) return '';
    if (spriteMode === SPRITE_MODES.SHOWDOWN) {
        return getPokemonSpriteUrl(pokeData.id, shiny);
    }

    if (spriteMode === SPRITE_MODES.ANIMATED_2D) {
        return getPokemonSpriteUrl(pokeData.id, shiny);
    }

    return shiny
        ? pokeData.sprites?.front_shiny || getPokemonSpriteUrl(pokeData.id, true)
        : pokeData.sprites?.front_default || getPokemonSpriteUrl(pokeData.id, false);
}

function setSpriteMode(mode) {
    if (!Object.values(SPRITE_MODES).includes(mode)) {
        mode = SPRITE_MODES.NORMAL;
    }
    spriteMode = mode;
    localStorage.setItem(STORAGE_SPRITE_MODE_KEY, spriteMode);

    const showdownToggle = document.getElementById('sprite-mode-showdown-toggle');
    const animated2dToggle = document.getElementById('sprite-mode-2d-toggle');

    if (showdownToggle) showdownToggle.checked = spriteMode === SPRITE_MODES.SHOWDOWN;
    if (animated2dToggle) animated2dToggle.checked = spriteMode === SPRITE_MODES.ANIMATED_2D;

    if (!document.getElementById('screen-inventory').classList.contains('hidden')) renderInventory();
    if (!document.getElementById('screen-pokedex').classList.contains('hidden')) renderPokedexGrid();
    if (typeof updateDexImage === 'function') updateDexImage();
}

function updateSpriteModeToggle() {
    const showdownToggle = document.getElementById('sprite-mode-showdown-toggle');
    const animated2dToggle = document.getElementById('sprite-mode-2d-toggle');

    if (showdownToggle) showdownToggle.checked = spriteMode === SPRITE_MODES.SHOWDOWN;
    if (animated2dToggle) animated2dToggle.checked = spriteMode === SPRITE_MODES.ANIMATED_2D;
}

const genBounds = {
    1: [1, 151], 2: [152, 251], 3: [252, 386],
    4: [387, 493], 5: [494, 649], 6: [650, 721],
    7: [722, 809], 8: [810, 905], 9: [906, 1025]
};
const legendaries = [
    144, 145, 146, 150, 243, 244, 245, 249, 250,
    377, 378, 379, 380, 381, 382, 383, 384,
    480, 481, 482, 483, 484, 485, 486, 487, 488,
    638, 639, 640, 641, 642, 643, 644, 645, 646,
    716, 717, 718, 772, 773,
    785, 786, 787, 788, 789, 790, 791, 792, 800,
    891, 892, 894, 895, 896, 897, 898,
    1001, 1002, 1003, 1004, 1007, 1008, 1017, 1024
];
const mythicalIds = [151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 905, 1025];

const rarities = [
    { id: 'common', name: 'Common', color: '#b2bec3', chance: 0.55, pool: 'normal', next: 'uncommon' },
    { id: 'uncommon', name: 'Uncommon', color: '#6ddf8f', chance: 0.25, pool: 'normal', next: 'rare' },
    { id: 'rare', name: 'Rare', color: '#74b9ff', chance: 0.12, pool: 'normal', next: 'epic' },
    { id: 'epic', name: 'Epic', color: '#a29bfe', chance: 0.06, pool: 'normal', next: 'legendary' },
    { id: 'legendary', name: 'Legendary', color: '#ff7675', chance: 0.017, pool: 'legendary', next: 'mythical' },
    { id: 'mythical', name: 'Mythical', color: '#ff8a00', chance: 0.003, pool: 'mythical', next: null },
    { id: 'umbra', name: 'Umbra', color: '#2d1b69', chance: 0, pool: 'legendary', next: null }
];

const rarityTiers = {};
rarities.forEach(r => rarityTiers[r.id] = r);
const speciesPointValues = { common: 1, uncommon: 5, rare: 25, epic: 125 };
const pointUpgradeCosts = { common: 5, uncommon: 25, rare: 125, epic: 625 };
const craftRequirements = { common: 3, uncommon: 4, rare: 5, epic: 6, legendary: 8 };

const mutationDefs = {
    sakura: { name: 'Sakura', color: '#ff6b9a', icon: '🌸', filter: 'hue-rotate(320deg) saturate(1.5) brightness(1.12) contrast(1.05)' },
    winter: { name: 'Winter', color: '#60a5fa', icon: '❄️', filter: 'hue-rotate(190deg) saturate(1.45) brightness(1.14) contrast(1.08)' },
    molten: { name: 'Molten', color: '#ff6b3d', icon: '🔥', filter: 'sepia(0.45) saturate(1.55) brightness(1.12) contrast(1.05)' },
    nuclear: { name: 'Nuclear', color: '#22c55e', icon: '☢️', filter: 'hue-rotate(100deg) saturate(1.7) brightness(1.18) contrast(1.1)' },
    galaxy: { name: 'Galaxy', color: '#a855f7', icon: '🌌', filter: 'hue-rotate(270deg) saturate(1.55) brightness(1.05) contrast(1.18)' },
    silver: { name: 'Silver', color: '#d1d5db', icon: '✨', filter: 'grayscale(100%) brightness(1.25) contrast(1.2)' },
    shadow: { name: 'Shadow', color: '#0f172a', icon: '🌑', filter: 'brightness(0.28) contrast(1.4) saturate(0.35)' },
    gay: { name: 'Rainbow', color: '#ff00ff', icon: '🌈', filter: 'hue-rotate(60deg) saturate(2) brightness(1.12) contrast(1.08)' }
};
const mutationOrder = ['sakura', 'winter', 'molten', 'nuclear', 'galaxy', 'silver', 'shadow', 'gay'];

const pokedexNameMap = {};
let pokedexNamesLoaded = false;

function normalizePokedexQuery(value) {
    return value.trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
}

function extractPokedexId(url) {
    const parts = url.split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1], 10);
}

async function loadAllPokedexNames() {
    if (pokedexNamesLoaded) return;
    try {
        const data = await fetchJsonWithTimeout('https://pokeapi.co/api/v2/pokemon?limit=10000', { timeout: 5000 });
        data.results.forEach(entry => {
            const id = extractPokedexId(entry.url);
            if (id && entry.name) pokedexNameMap[id] = entry.name;
        });
    } catch (err) {
        console.warn('Pokedex name lookup failed', err);
    }
    pokedexNamesLoaded = true;
}

function getPokedexName(id) {
    return pokedexNameMap[id] || '';
}

function getLevenshteinDistance(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
            );
        }
    }
    return matrix[b.length][a.length];
}

function fuzzyMatchQuery(query, text) {
    if (!query || !text) return false;
    if (text.includes(query) || query.includes(text)) return true;
    const distance = getLevenshteinDistance(query, text);
    const threshold = Math.max(1, Math.floor(Math.min(query.length, text.length) * 0.25));
    return distance <= threshold;
}

function capitalizeWords(value) {
    return value.replace(/\b[a-z]/g, char => char.toUpperCase()).replace(/-/g, ' ');
}

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
    if (mythicalIds.includes(pokemonId)) {
        return 'mythical';
    }
    if (legendaries.includes(pokemonId) && !mythicalIds.includes(pokemonId)) {
        return 'legendary';
    }

    const normalizedFallback = fallbackTierKey || 'common';
    if (['legendary', 'mythical', 'umbra'].includes(normalizedFallback)) {
        return 'epic';
    }

    return normalizedFallback;
}

function getRarityBorderClass(tierKey) {
    switch (tierKey) {
        case 'common': return 'rarity-card-common';
        case 'uncommon': return 'rarity-card-uncommon';
        case 'rare': return 'rarity-card-rare';
        case 'epic': return 'rarity-card-epic';
        case 'legendary': return 'rarity-card-legendary';
        case 'mythical': return 'rarity-card-mythical';
        case 'umbra': return 'rarity-card-umbra';
        default: return 'rarity-card-common';
    }
}

function getCraftRequirementForTier(tierKey) {
    return craftRequirements[tierKey] || 3;
}

function getPointUpgradeCost(tierKey) {
    return pointUpgradeCosts[tierKey] || null;
}

function getUpgradeTargetTier(tierKey) {
    switch (tierKey) {
        case 'common': return 'uncommon';
        case 'uncommon': return 'rare';
        case 'rare': return 'epic';
        case 'epic': return 'umbra';
        default: return null;
    }
}

function normalizeMutations(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(key => mutationDefs[key]);
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function getRandomMutations() {
    if (Math.random() >= 0.10) return [];
    
    const mutationDistribution = [
        { count: 1, chance: 0.50 },
        { count: 2, chance: 0.22 },
        { count: 3, chance: 0.12 },
        { count: 4, chance: 0.07 },
        { count: 5, chance: 0.04 },
        { count: 6, chance: 0.025 },
        { count: 7, chance: 0.015 },
        { count: 8, chance: 0.007 },
        { count: 9, chance: 0.003 }
    ];
    
    let rand = Math.random();
    let mutationCount = 1;
    for (const dist of mutationDistribution) {
        if (rand < dist.chance) {
            mutationCount = dist.count;
            break;
        }
        rand -= dist.chance;
    }
    
    const mutations = [];
    const availableMutations = [...mutationOrder];
    for (let i = 0; i < mutationCount && availableMutations.length > 0; i++) {
        const idx = Math.floor(Math.random() * availableMutations.length);
        mutations.push(availableMutations[idx]);
        availableMutations.splice(idx, 1);
    }
    return mutations;
}

function parseCsvList(value) {
    return (value || '')
        .split(',')
        .map(item => item.trim().toLowerCase())
        .filter(Boolean);
}

function getMutationListFromInput(value) {
    return parseCsvList(value).filter(key => mutationDefs[key]);
}

function getMutationBadgeHtml(mutations = [], compact = false) {
    const normalized = normalizeMutations(mutations);
    if (!normalized.length) return '';

    const badgeClass = compact ? 'mutation-badge compact' : 'mutation-badge';
    const badges = normalized.map(key => {
        const def = mutationDefs[key];
        return `<span class="${badgeClass}" style="background:${def.color};">${def.icon} ${def.name}</span>`;
    }).join('');

    return `<div class="mutation-badges">${badges}</div>`;
}

function getFormBadgeInfo(pokemonData = null) {
    const text = [
        pokemonData?.name || '',
        (pokemonData?.forms || []).map(form => form.name).join(' '),
        pokemonData?.species?.name || ''
    ].join(' ').toLowerCase();

    const formDefs = [
        { key: 'mega', label: 'Mega', color: '#ff6b81' },
        { key: 'gigantamax', label: 'Gigantamax', color: '#8b5cf6' },
        { key: 'gmax', label: 'Gigantamax', color: '#8b5cf6' },
        { key: 'alola', label: 'Alolan', color: '#f59e0b' },
        { key: 'alolan', label: 'Alolan', color: '#f59e0b' },
        { key: 'galar', label: 'Galarian', color: '#2563eb' },
        { key: 'galarian', label: 'Galarian', color: '#2563eb' },
        { key: 'hisui', label: 'Hisuian', color: '#dc2626' },
        { key: 'hisuian', label: 'Hisuian', color: '#dc2626' },
        { key: 'paldea', label: 'Paldean', color: '#16a34a' },
        { key: 'paldean', label: 'Paldean', color: '#16a34a' },
        { key: 'kanto', label: 'Kantonian', color: '#84cc16' },
        { key: 'kantonian', label: 'Kantonian', color: '#84cc16' },
        { key: 'primal', label: 'Primal', color: '#0f766e' },
        { key: 'origin', label: 'Origin', color: '#7c3aed' },
        { key: 'totem', label: 'Totem', color: '#fb923c' },
        { key: 'partner', label: 'Partner', color: '#ec4899' },
        { key: 'armor', label: 'Armor', color: '#64748b' }
    ];

    return formDefs.find(def => text.includes(def.key)) || null;
}

function getFormBadgeHtml(formInfo) {
    if (!formInfo) return '';
    return `<span class="form-badge" style="background:${formInfo.color};">${formInfo.label}</span>`;
}

function getMutationFilterStyle(mutations = []) {
    const normalized = normalizeMutations(mutations);
    if (!normalized.length) return '';

    const hasRainbow = normalized.includes('gay');
    const filters = normalized.map(key => {
        // Skip rainbow's filter in the static chain since it's animated
        if (key === 'gay' && hasRainbow) return null;
        return mutationDefs[key].filter;
    }).filter(Boolean).join(' ');
    
    let style = '';
    if (filters) style += `filter: ${filters}; -webkit-filter: ${filters};`;
    if (hasRainbow) style += ` animation: rainbowShift 4s linear infinite;`;
    return style;
}

function getOwnedMutationsForPokemon(id) {
    const combined = [];
    Object.values(inventory).forEach(tierArray => {
        tierArray.forEach(item => {
            if (item.id === id) {
                normalizeMutations(item.mutations).forEach(mutation => {
                    if (!combined.includes(mutation)) combined.push(mutation);
                });
            }
        });
    });
    return combined;
}

function getOwnedMutationsGlobally() {
    const combined = [];
    Object.values(inventory).forEach(tierArray => {
        tierArray.forEach(item => {
            normalizeMutations(item.mutations).forEach(mutation => {
                if (!combined.includes(mutation)) combined.push(mutation);
            });
        });
    });
    return combined;
}

function getVariantOwnershipForPokemon(id) {
    return {
        base: Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id)),
        shiny: Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id && item.shiny)),
        sakura: Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id && normalizeMutations(item.mutations).includes('sakura'))),
        winter: Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id && normalizeMutations(item.mutations).includes('winter'))),
        molten: Object.values(inventory).some(tierArray => tierArray.some(item => item.id === id && normalizeMutations(item.mutations).includes('molten')))
    };
}

// --- Storage Systems ---
function normalizeInventory(rawInventory) {
    const baseInventory = { common: [], uncommon: [], rare: [], epic: [], legendary: [], mythical: [], umbra: [] };
    const source = rawInventory || {};

    Object.entries(baseInventory).forEach(([tierKey]) => {
        const entries = source[tierKey] || [];
        baseInventory[tierKey] = Array.isArray(entries)
            ? entries.map(item => {
                if (typeof item === 'number') return { id: item, shiny: false, mutations: [], count: 1, speciesId: item };
                return {
                    id: item?.id,
                    shiny: Boolean(item?.shiny),
                    mutations: normalizeMutations(item?.mutations),
                    count: Number.isInteger(item?.count) ? item.count : 1,
                    speciesId: item?.speciesId || item?.id
                };
            })
            : [];
    });

    return baseInventory;
}

let inventory = normalizeInventory(JSON.parse(localStorage.getItem('pokeInventory')) || { common: [], uncommon: [], rare: [], epic: [], legendary: [], mythical: [], umbra: [] });
let favorites = JSON.parse(localStorage.getItem('pokeFavs')) || [];
let ownedSpecies = JSON.parse(localStorage.getItem('pokeSpecies')) || []; 
let speciesPoints = normalizeSpeciesPoints(JSON.parse(localStorage.getItem('pokeSpeciesPoints')) || {});
let fruitInventory = normalizeFruitInventory(JSON.parse(localStorage.getItem('fruitInventory')) || { common: [], uncommon: [], rare: [], epic: [], legendary: [] });

function normalizeSpeciesPoints(rawPoints) {
    if (!rawPoints || typeof rawPoints !== 'object') return {};
    const normalized = {};
    Object.entries(rawPoints).forEach(([speciesId, value]) => {
        const parsedId = parseInt(speciesId, 10);
        const numeric = Number(value) || 0;
        if (Number.isInteger(parsedId) && parsedId > 0 && numeric > 0) normalized[parsedId] = numeric;
    });
    return normalized;
}

function saveInventory() { 
    localStorage.setItem('pokeInventory', JSON.stringify(inventory)); 
    localStorage.setItem('pokeSpecies', JSON.stringify(ownedSpecies));
    localStorage.setItem('pokeSpeciesPoints', JSON.stringify(speciesPoints));
    localStorage.setItem('fruitInventory', JSON.stringify(fruitInventory));
}

function markVersionInstalled() {
    localStorage.setItem(STORAGE_VERSION_KEY, APP_VERSION);
}

function hasExistingSaveData() {
    return STORAGE_KEYS.some(key => localStorage.getItem(key) !== null);
}

function showWelcomeModal() {
    document.getElementById('welcome-modal')?.classList.remove('hidden');
}

function showResetModal() {
    document.getElementById('reset-modal')?.classList.remove('hidden');
}

function hideVersionModals() {
    document.getElementById('welcome-modal')?.classList.add('hidden');
    document.getElementById('reset-modal')?.classList.add('hidden');
}

function handleVersionCheck() {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    const hasData = hasExistingSaveData();

    if (storedVersion === APP_VERSION) {
        return;
    }

    if (!storedVersion && !hasData) {
        showWelcomeModal();
        return;
    }

    showResetModal();
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

function addPokemonToInventory(tierKey, pokeId, shiny = false, mutations = [], formInfo = null, speciesId = pokeId, awardSpeciesPoints = true) {
    const normalizedMutations = normalizeMutations(mutations);
    const existing = inventory[tierKey].find(item => item.id === pokeId && item.shiny === shiny && arraysEqual(normalizeMutations(item.mutations), normalizedMutations) && (item.speciesId || item.id) === speciesId);
    if (existing) {
        existing.count = (existing.count || 1) + 1;
        if (formInfo && !existing.form) existing.form = formInfo;
    } else {
        inventory[tierKey].push({ id: pokeId, shiny, mutations: normalizedMutations, count: 1, form: formInfo || null, speciesId: speciesId || pokeId });
    }

    if (awardSpeciesPoints && speciesPointValues[tierKey] && speciesId) {
        speciesPoints[speciesId] = (speciesPoints[speciesId] || 0) + speciesPointValues[tierKey];
    }
}

function getPokemonSpriteUrl(id, shiny = false) {
    const cacheKey = `${spriteMode}:${id}:${shiny ? 'shiny' : 'normal'}`;
    if (spriteUrlCache.has(cacheKey)) {
        return spriteUrlCache.get(cacheKey);
    }
    const [primaryUrl] = createSpriteUrlCandidates(id, shiny);
    return primaryUrl || '';
}

function getDexSpriteUrl(pokeData, shiny = false) {
    if (!pokeData) return '';
    if (spriteMode === SPRITE_MODES.SHOWDOWN || spriteMode === SPRITE_MODES.ANIMATED_2D) {
        return getPokemonSpriteUrl(pokeData.id, shiny);
    }

    return shiny
        ? pokeData.sprites?.front_shiny || getPokemonSpriteUrl(pokeData.id, true)
        : pokeData.sprites?.front_default || getPokemonSpriteUrl(pokeData.id, false);
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

function isSpecialName(name) {
    return SPECIAL_NAMES.includes(name.toLowerCase());
}

function normalizeThemePreset(preset) {
    const normalizedPreset = String(preset || '').toLowerCase();

    if (Object.prototype.hasOwnProperty.call(THEME_PALETTES[THEME_GROUPS.SPECIAL], normalizedPreset)) {
        return normalizedPreset;
    }

    if (Object.prototype.hasOwnProperty.call(THEME_PALETTES[THEME_GROUPS.MODERN], normalizedPreset)) {
        return normalizedPreset;
    }

    if (['cozy', 'personalized', 'special'].includes(normalizedPreset)) {
        return DEFAULT_THEME_PRESETS.SPECIAL;
    }

    if (['modern', 'default', 'light', 'slate', 'frost', 'modern-dark'].includes(normalizedPreset)) {
        return DEFAULT_THEME_PRESETS.MODERN;
    }

    return isSpecialName(userName || '') ? DEFAULT_THEME_PRESETS.SPECIAL : DEFAULT_THEME_PRESETS.MODERN;
}

function getThemeGroupForUser() {
    return isSpecialName(userName || '') ? THEME_GROUPS.SPECIAL : THEME_GROUPS.MODERN;
}

function getAvailableThemePresets() {
    return Object.entries(THEME_PALETTES[getThemeGroupForUser()]).map(([value, theme]) => ({ value, label: theme.label }));
}

function updateThemePresetSelector() {
    const selector = document.getElementById('theme-preset-select');
    if (!selector) return;

    const availablePresets = getAvailableThemePresets();
    const currentPreset = normalizeThemePreset(userTheme);
    selector.innerHTML = availablePresets.map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');
    selector.value = availablePresets.some((preset) => preset.value === currentPreset) ? currentPreset : availablePresets[0]?.value || '';
}

function setThemePreset(preset, persist = true) {
    const normalizedPreset = normalizeThemePreset(preset);
    userTheme = normalizedPreset;

    if (persist) {
        localStorage.setItem(STORAGE_USER_THEME_KEY, userTheme);
    }

    const themeGroup = Object.prototype.hasOwnProperty.call(THEME_PALETTES[THEME_GROUPS.SPECIAL], normalizedPreset) ? THEME_GROUPS.SPECIAL : THEME_GROUPS.MODERN;
    const palette = THEME_PALETTES[themeGroup][normalizedPreset];
    const html = document.documentElement;

    html.setAttribute('data-theme', themeGroup);
    html.setAttribute('data-theme-preset', normalizedPreset);

    const cssVariables = {
        'bg-primary': palette.bgPrimary,
        'bg-secondary': palette.bgSecondary,
        'text-primary': palette.textPrimary,
        'accent-primary': palette.accentPrimary,
        'accent-secondary': palette.accentSecondary,
        'shadow-light': palette.shadowLight,
        'surface-panel': palette.surfacePanel,
        'surface-elevated': palette.surfaceElevated,
        'surface-card': palette.surfaceCard,
        'surface-muted': palette.surfaceMuted,
        'border-soft': palette.borderSoft,
        'border-strong': palette.borderStrong,
        'text-muted': palette.textMuted,
        'text-inverse': palette.textInverse
    };

    Object.entries(cssVariables).forEach(([name, value]) => {
        html.style.setProperty(`--${name}`, value);
    });

    updateThemePresetSelector();
}

function applyTheme() {
    setThemePreset(userTheme, false);
}

function handleLoginSubmit() {
    const nameInput = document.getElementById('login-name-input');
    const name = nameInput.value.trim();
    
    if (!name) {
        const msg = document.getElementById('login-message');
        msg.textContent = 'Please enter a name!';
        msg.classList.add('error');
        return;
    }
    
    if (isSpecialName(name)) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('password-screen').classList.remove('hidden');
        document.getElementById('password-input').focus();
    } else {
        userName = name;
        localStorage.setItem(STORAGE_USER_NAME_KEY, userName);
        setThemePreset(DEFAULT_THEME_PRESETS.MODERN);
        document.getElementById('login-screen').classList.add('hidden');
        proceedToLoading();
    }
}

function handlePasswordSubmit() {
    const passwordInput = document.getElementById('password-input');
    const password = passwordInput.value;
    
    if (password === SPECIAL_PASSWORD) {
        const nameInput = document.getElementById('login-name-input');
        userName = nameInput.value.trim();
        localStorage.setItem(STORAGE_USER_NAME_KEY, userName);
        setThemePreset(DEFAULT_THEME_PRESETS.SPECIAL);
        document.getElementById('password-screen').classList.add('hidden');
        proceedToLoading();
    } else {
        const msg = document.getElementById('password-message');
        msg.textContent = 'Incorrect password.';
        msg.classList.add('error');
        passwordInput.value = '';
    }
}

function proceedToLoading() {
    const loadingTitle = document.getElementById('loading-title');
    if (loadingTitle) {
        loadingTitle.textContent = getThemeGroupForUser() === THEME_GROUPS.SPECIAL ? 'Happy 2 Year Anniversary!' : 'Get Ready...';
    }
    
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        document.getElementById('btn-bag').classList.remove('hidden');
        playSound('open');
        handleVersionCheck();
        updateSpriteModeToggle();

        const settingsBtn = document.getElementById('settings-toggle-btn');
        const settingsPanel = document.getElementById('settings-panel');
        const settingsClose = document.getElementById('settings-close-btn');
        const showdownToggle = document.getElementById('sprite-mode-showdown-toggle');
        const animated2dToggle = document.getElementById('sprite-mode-2d-toggle');
        const themePresetSelect = document.getElementById('theme-preset-select');

        settingsBtn?.addEventListener('click', () => {
            settingsPanel?.classList.toggle('hidden');
        });

        settingsClose?.addEventListener('click', () => {
            settingsPanel?.classList.add('hidden');
        });

        showdownToggle?.addEventListener('change', (event) => {
            setSpriteMode(event.target.checked ? SPRITE_MODES.SHOWDOWN : SPRITE_MODES.NORMAL);
        });

        animated2dToggle?.addEventListener('change', (event) => {
            setSpriteMode(event.target.checked ? SPRITE_MODES.ANIMATED_2D : SPRITE_MODES.NORMAL);
        });

        themePresetSelect?.addEventListener('change', (event) => {
            setThemePreset(event.target.value);
        });

        updateThemePresetSelector();

        if (spriteMode === SPRITE_MODES.SHOWDOWN || spriteMode === SPRITE_MODES.ANIMATED_2D) {
            settingsPanel?.classList.remove('hidden');
        }
    }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    updateThemePresetSelector();
    
    if (userName) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('loading-screen').classList.remove('hidden');
        proceedToLoading();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        const loginSubmitBtn = document.getElementById('login-submit-btn');
        const loginNameInput = document.getElementById('login-name-input');
        const passwordSubmitBtn = document.getElementById('password-submit-btn');
        const passwordInput = document.getElementById('password-input');
        
        loginSubmitBtn?.addEventListener('click', handleLoginSubmit);
        loginNameInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLoginSubmit();
        });
        
        passwordSubmitBtn?.addEventListener('click', handlePasswordSubmit);
        passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlePasswordSubmit();
        });
        
        loginNameInput?.focus();
    }
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
let pendingSelection = { type: '', tier: '', required: 0, callback: null, selectedIndices: [], availableItems: [] };

function renderSelectionGrid() {
    const grid = document.getElementById('select-grid');
    if (!grid) return;

    grid.innerHTML = '';
    (pendingSelection.availableItems || []).forEach(item => {
        const isSelected = pendingSelection.selectedIndices.includes(item.index);
        const box = document.createElement('div');
        box.classList.add('inv-item', 'selectable-item', getRarityBorderClass(pendingSelection.tier));
        box.classList.toggle('selected', isSelected);
        box.style.cursor = 'pointer';
        box.onclick = () => toggleSelection(item.index, box);
        box.innerHTML = `
            <div class="inventory-card-sprite">
                <img loading="lazy" decoding="async" src="${getPokemonSpriteUrl(item.id, item.shiny)}" alt="poke" style="${getMutationFilterStyle(item.mutations)}">
            </div>
            <div class="inventory-card-meta">
                <span class="badge" style="background-color:${rarityTiers[pendingSelection.tier].color}; font-size:10px; padding:3px 6px; margin:0;">${rarityTiers[pendingSelection.tier].name}</span>
                <div class="selection-mutations">
                    ${item.mutations && item.mutations.length ? getMutationBadgeHtml(item.mutations, true) : '<span class="mutation-none">No mutation</span>'}
                </div>
            </div>
        `;
        grid.appendChild(box);
        setSpriteImage(box.querySelector('img'), item.id, item.shiny);
    });

    updateSelectionConfirmBtn();
}

function openSelectionModal(type, tier, requiredCount, callback) {
    playSound('open');
    const tierItems = getInventoryItems(tier);
    const availableItems = tierItems
        .map((item, index) => ({ ...item, index }))
        .filter(item => !favorites.includes(item.id));

    if (availableItems.length < requiredCount) {
        alert(`You need ${requiredCount} unfavorited ${rarityTiers[tier].name} Pokémon to do this! Unfavorite some first. ❌`);
        return;
    }

    pendingSelection = { type, tier, required: requiredCount, callback, selectedIndices: [], availableItems };

    document.getElementById('select-modal-title').textContent = type === 'craft' ? 'Crafting Menu' : 'Sacrifice Menu';
    document.getElementById('select-modal-subtitle').textContent = `Pick ${requiredCount} ${rarityTiers[tier].name} Pokémon`;

    renderSelectionGrid();

    const confirmBtn = document.getElementById('select-confirm-btn');
    confirmBtn.onclick = () => confirmSelection();

    const randomBtn = document.getElementById('select-random-btn');
    randomBtn.onclick = () => selectRandomItems();

    const clearBtn = document.getElementById('select-clear-btn');
    clearBtn.onclick = () => {
        pendingSelection.selectedIndices = [];
        renderSelectionGrid();
    };

    document.getElementById('select-modal').classList.remove('hidden');
}

function toggleSelection(index, boxEl) {
    playSound('click');
    const pos = pendingSelection.selectedIndices.indexOf(index);
    if (pos > -1) {
        pendingSelection.selectedIndices.splice(pos, 1);
    } else if (pendingSelection.selectedIndices.length < pendingSelection.required) {
        pendingSelection.selectedIndices.push(index);
    }
    renderSelectionGrid();
}

function selectRandomItems() {
    const shuffled = [...pendingSelection.availableItems].sort(() => Math.random() - 0.5);
    pendingSelection.selectedIndices = shuffled.slice(0, pendingSelection.required).map(item => item.index);
    renderSelectionGrid();
}

function updateSelectionConfirmBtn() {
    const btn = document.getElementById('select-confirm-btn');
    if (pendingSelection.selectedIndices.length === pendingSelection.required) {
        btn.disabled = false;
        btn.textContent = `Confirm Selection (${pendingSelection.selectedIndices.length})`;
    } else {
        btn.disabled = true;
        btn.textContent = `Confirm Selection (${pendingSelection.selectedIndices.length}/${pendingSelection.required})`;
    }
}

function confirmSelection() {
    playSound('click');
    document.getElementById('select-modal').classList.add('hidden');
    if (pendingSelection.callback) {
        pendingSelection.callback([...pendingSelection.selectedIndices]);
    }
    pendingSelection = { type: '', tier: '', required: 0, callback: null, selectedIndices: [], availableItems: [] };
}

function closeSelectModal() {
    playSound('click');
    document.getElementById('select-modal').classList.add('hidden');
    pendingSelection = { type: '', tier: '', required: 0, callback: null, selectedIndices: [], availableItems: [] };
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
    { label: 'Common', color: '#b2bec3', id: 'common' },
    { label: 'Uncommon', color: '#6ddf8f', id: 'uncommon' },
    { label: 'Rare', color: '#74b9ff', id: 'rare' },
    { label: 'Epic', color: '#a29bfe', id: 'epic' },
    { label: 'Legendary', color: '#ff7675', id: 'legendary' },
    { label: 'Mythical', color: '#ff8a00', id: 'mythical' }
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
    pokemonId: null,
    mutations: [],
    multiGenOverrides: [],
    multiRarityOverrides: []
};

function resetAllPersistentData() {
    localStorage.clear();
    inventory = normalizeInventory({ common: [], uncommon: [], rare: [], epic: [], legendary: [], mythical: [], umbra: [] });
    ownedSpecies = [];
    speciesPoints = {};
    fruitInventory = normalizeFruitInventory({ common: [], uncommon: [], rare: [], epic: [], legendary: [] });
    favorites = [];
    userName = '';
    userTheme = DEFAULT_THEME_PRESETS.MODERN;
    spriteMode = SPRITE_MODES.NORMAL;
    localStorage.setItem(STORAGE_VERSION_KEY, APP_VERSION);
    localStorage.setItem(STORAGE_USER_NAME_KEY, userName);
    localStorage.setItem(STORAGE_USER_THEME_KEY, userTheme);
    localStorage.setItem(STORAGE_SPRITE_MODE_KEY, spriteMode);
    saveInventory();
    applyTheme();
}

function setupDeveloperMode() {
    const toggleBtn = document.getElementById('dev-toggle-btn');
    const welcomeStartBtn = document.getElementById('welcome-start-btn');
    const resetStorageBtn = document.getElementById('reset-storage-btn');
    const panel = document.getElementById('dev-panel');
    const applyBtn = document.getElementById('dev-apply-btn');
    const clearBtn = document.getElementById('dev-clear-btn');
    const clearDataBtn = document.getElementById('dev-clear-data-btn');
    const injectBtn = document.getElementById('dev-inject-btn');

    if (!toggleBtn || !panel || !applyBtn || !clearBtn) return;

    welcomeStartBtn?.addEventListener('click', () => {
        markVersionInstalled();
        hideVersionModals();
    });

    resetStorageBtn?.addEventListener('click', () => {
        resetAllPersistentData();
        markVersionInstalled();
        hideVersionModals();
    });

    toggleBtn.addEventListener('click', () => {
        const enteredPassword = window.prompt('Enter dev password');
        if (enteredPassword === null) return;

        if (enteredPassword !== DEV_MENU_PASSWORD) {
            document.getElementById('dev-status').textContent = 'Access denied.';
            return;
        }

        devModeEnabled = !devModeEnabled;
        panel.classList.toggle('hidden', !devModeEnabled);
        if (devModeEnabled) updateDevStatus();
    });

    applyBtn.addEventListener('click', () => {
        devOverrides.enabled = document.getElementById('dev-enable-override').checked;
        devOverrides.gen = document.getElementById('dev-gen-select').value ? parseInt(document.getElementById('dev-gen-select').value, 10) : null;
        devOverrides.rarity = document.getElementById('dev-rarity-select').value || null;
        devOverrides.shiny = document.getElementById('dev-shiny-checkbox').checked;
        const pokemonInput = document.getElementById('dev-pokemon-id').value;
        devOverrides.pokemonId = pokemonInput ? parseInt(pokemonInput, 10) : null;
        const checkedMutations = Array.from(document.querySelectorAll('input[name="dev-mutation-override"]:checked')).map(cb => cb.value);
        devOverrides.mutations = checkedMutations;
        devOverrides.multiGenOverrides = (document.getElementById('dev-multi-gen-input').value || '')
            .split(',')
            .map(value => value.trim())
            .filter(Boolean)
            .map(value => parseInt(value.replace(/^gen/i, ''), 10))
            .filter(value => Number.isInteger(value) && value >= 1 && value <= 9);
        devOverrides.multiRarityOverrides = parseCsvList(document.getElementById('dev-multi-rarity-input').value)
            .filter(value => rarityTiers[value]);
        updateDevStatus();
    });

    clearBtn.addEventListener('click', () => {
        devOverrides = { enabled: false, gen: null, rarity: null, shiny: false, pokemonId: null, mutations: [], multiGenOverrides: [], multiRarityOverrides: [] };
        document.getElementById('dev-enable-override').checked = false;
        document.getElementById('dev-gen-select').value = '';
        document.getElementById('dev-rarity-select').value = '';
        document.getElementById('dev-shiny-checkbox').checked = false;
        document.getElementById('dev-pokemon-id').value = '';
        document.querySelectorAll('input[name="dev-mutation-override"]').forEach(cb => cb.checked = false);
        document.getElementById('dev-multi-gen-input').value = '';
        document.getElementById('dev-multi-rarity-input').value = '';
        updateDevStatus();
    });

    injectBtn?.addEventListener('click', () => {
        const pokemonIdInput = document.getElementById('dev-inject-pokemon-id');
        const tierSelect = document.getElementById('dev-inject-tier-select');
        const speciesIdInput = document.getElementById('dev-inject-species-id');
        const shinyCheckbox = document.getElementById('dev-inject-shiny-checkbox');
        const pokemonId = parseInt(pokemonIdInput?.value || '', 10);
        const speciesId = speciesIdInput?.value ? parseInt(speciesIdInput.value, 10) : pokemonId;
        const tierKey = tierSelect?.value || 'common';
        const checkedMutations = Array.from(document.querySelectorAll('input[name="dev-mutation-inject"]:checked')).map(cb => cb.value);

        if (!Number.isInteger(pokemonId) || pokemonId < 1 || pokemonId > MAX_POKEMON) {
            document.getElementById('dev-status').textContent = 'Enter a valid Pokémon ID first.';
            return;
        }

        if (!Number.isInteger(speciesId) || speciesId < 1 || speciesId > MAX_POKEMON) {
            document.getElementById('dev-status').textContent = 'Enter a valid species ID first.';
            return;
        }

        addPokemonToInventory(tierKey, pokemonId, shinyCheckbox?.checked || false, checkedMutations, null, speciesId, true);
        if (!ownedSpecies.includes(speciesId)) ownedSpecies.push(speciesId);
        saveInventory();
        renderInventory();
        renderPokedexGrid();
        document.getElementById('dev-status').textContent = `✅ Added #${pokemonId} to the ${tierKey} bag${shinyCheckbox?.checked ? ' as shiny' : ''}${checkedMutations.length ? ` with ${checkedMutations.join(', ')}` : ''}.`;
    });

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('\u26a0\ufe0f This will clear ALL saved data, including inventory, favorites, and theme settings. Continue?')) {
                resetAllPersistentData();
                markVersionInstalled();
                updateDevStatus();
                document.getElementById('dev-status').textContent = '✅ All local data cleared. Reload the page to fully reset the app.';
            }
        });
    }
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
    if (devOverrides.mutations.length > 0) parts.push(`Mutations: ${devOverrides.mutations.join(', ')}`);
    if (devOverrides.multiGenOverrides.length > 0) parts.push(`Multi Gen: ${devOverrides.multiGenOverrides.join(', ')}`);
    if (devOverrides.multiRarityOverrides.length > 0) parts.push(`Multi Rarity: ${devOverrides.multiRarityOverrides.join(', ')}`);
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
    const weightedRarities = [
        { id: 'common', chance: 0.55 },
        { id: 'uncommon', chance: 0.25 },
        { id: 'rare', chance: 0.12 },
        { id: 'epic', chance: 0.06 },
        { id: 'legendary', chance: 0.017 },
        { id: 'mythical', chance: 0.003 }
    ];
    let rand = Math.random();
    let cumulative = 0;
    for (let r of weightedRarities) {
        cumulative += r.chance;
        if (rand <= cumulative) return rarityTiers[r.id];
    }
    return rarityTiers.common;
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
    const genLegendaries = legendaries.filter(id => id >= start && id <= end && !mythicalIds.includes(id));
    const genMythicals = mythicalIds.filter(id => id >= start && id <= end);
    let baseId;
    
    if (tier.pool === 'mythical') {
        baseId = genMythicals.length > 0 ? genMythicals[Math.floor(Math.random() * genMythicals.length)] : getRandomNormal(start, end, []);
    } else if (tier.pool === 'legendary') {
        baseId = genLegendaries.length > 0 ? genLegendaries[Math.floor(Math.random() * genLegendaries.length)] : getRandomNormal(start, end, genLegendaries);
    } else {
        baseId = getRandomNormal(start, end, genLegendaries);
    }

    let finalId = baseId;
    if (Math.random() < 0.20) {
        try {
            const speciesData = await fetchSpeciesData(baseId);
            if (speciesData.varieties && speciesData.varieties.length > 1) {
                const chosenVariety = speciesData.varieties[Math.floor(Math.random() * speciesData.varieties.length)];
                finalId = parseInt(chosenVariety.pokemon.url.split('/').slice(-2, -1)[0]);
            }
        } catch (e) {}
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
    const mutations = devSpin?.mutations?.length ? devSpin.mutations : getRandomMutations();

    const pokeData = await fetchPokemonData(rewardId);
    const formInfo = getFormBadgeInfo(pokeData);

    addPokemonToInventory(rewardTierKey, rewardId, isShinyReward, mutations, formInfo, rewardBaseId);
    if (!ownedSpecies.includes(rewardBaseId)) ownedSpecies.push(rewardBaseId); 
    saveInventory();

    const rewardImg = document.getElementById('pokemon-img');
    setSpriteImage(rewardImg, rewardId, isShinyReward);
    rewardImg.style.cssText = getMutationFilterStyle(mutations);
    document.getElementById('gen-badge').classList.add('hidden');

    const rewardArea = document.getElementById('reward-area');
    const card = rewardArea.querySelector('.pokemon-reward-card');
    const rarityBadge = document.getElementById('rarity-badge');
    const typeBadges = document.getElementById('reward-types');
    const cardGlow = document.getElementById('reward-card-glow');
    const mutationContainer = document.getElementById('reward-mutation-badges');
    const formBadgeContainer = document.getElementById('reward-form-badges');
    const borderClass = getRarityBorderClass(rewardTierKey);

    [rewardArea, card, cardGlow].forEach(el => {
        el.classList.remove('rarity-card-common', 'rarity-card-uncommon', 'rarity-card-rare', 'rarity-card-epic', 'rarity-card-legendary', 'rarity-card-mythical', 'rarity-card-umbra');
        el.classList.add(borderClass);
    });

    rarityBadge.textContent = `${tier.name}${isShinyReward ? ' ✨' : ''}`;
    rarityBadge.style.backgroundColor = tier.color;
    rarityBadge.classList.toggle('shiny-badge', isShinyReward);
    if (formBadgeContainer) {
        formBadgeContainer.innerHTML = getFormBadgeHtml(formInfo);
    } else if (formInfo) {
        const container = document.createElement('div');
        container.id = 'reward-form-badges';
        container.className = 'form-badges';
        container.innerHTML = getFormBadgeHtml(formInfo);
        rewardArea.querySelector('.reward-info').appendChild(container);
    } else if (formBadgeContainer) {
        formBadgeContainer.innerHTML = '';
    }

    if (mutationContainer) {
        mutationContainer.innerHTML = getMutationBadgeHtml(mutations);
    } else {
        const container = document.createElement('div');
        container.id = 'reward-mutation-badges';
        container.className = 'mutation-badges';
        container.innerHTML = getMutationBadgeHtml(mutations);
        rewardArea.querySelector('.reward-info').appendChild(container);
    }

    typeBadges.innerHTML = '';
    pokeData.types.forEach(t => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.backgroundColor = getTypeColor(t.type.name);
        span.textContent = t.type.name.toUpperCase();
        typeBadges.appendChild(span);
    });

    rewardArea.classList.remove('hidden');
    setTimeout(() => rewardArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    updateDevStatus();
}


// --- Multi-Spin Feature ---
function attemptMultiSpin(count, costTier) {
    playSound('click');
    openSelectionModal('spin', costTier, 1, (selectedIndices) => {
        playSound('click');
        
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
            const devSpin = getDevOverrideForSpin();
            const overrideGen = devSpin?.multiGenOverrides?.[i];
            if (overrideGen) {
                winningIndex = segments.findIndex(seg => seg.id === overrideGen);
                if (winningIndex === -1) winningIndex = Math.floor(Math.random() * segments.length);
            } else {
                winningIndex = Math.floor(Math.random() * segments.length);
            }
            winner = segments[winningIndex];
            state[i].gen = winner.id;
        } else {
            const devSpin = getDevOverrideForSpin();
            const overrideRarity = devSpin?.multiRarityOverrides?.[i];
            const chosenTier = overrideRarity ? rarityTiers[overrideRarity] : getRandomRarity();
            if (!chosenTier) {
                const fallbackTier = getRandomRarity();
                const matchingIndices = segments.map((s, idx) => s.id === fallbackTier.id ? idx : -1).filter(idx => idx !== -1);
                winningIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
                winner = segments[winningIndex];
            } else {
                const matchingIndices = segments.map((s, idx) => s.id === chosenTier.id ? idx : -1).filter(idx => idx !== -1);
                winningIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
                winner = segments[winningIndex];
            }
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
        const pokeData = await fetchPokemonData(data.finalId);
        return { ...res, ...data, pokeData };
    }));
    const finalRewards = await Promise.all(rewardPromises);

    finalRewards.forEach(res => {
        const rewardTierKey = getRewardTierKey(res.finalId, res.rarity);
        const tier = rarityTiers[rewardTierKey];
        const isShinyReward = Math.random() < 0.01;
        const mutations = getRandomMutations();
        const formInfo = getFormBadgeInfo(res.pokeData);
        addPokemonToInventory(rewardTierKey, res.finalId, isShinyReward, mutations, formInfo, res.baseId);
        if (!ownedSpecies.includes(res.baseId)) ownedSpecies.push(res.baseId);

        let typesHTML = res.pokeData.types.map(t => `<span class="badge" style="background-color:${getTypeColor(t.type.name)}">${t.type.name.toUpperCase()}</span>`).join('');

        const borderClass = getRarityBorderClass(rewardTierKey);

        rewardArea.insertAdjacentHTML('beforeend', `
            <div class="mini-reward-card">
                <div class="pokemon-reward-card ${borderClass}">
                    <div class="pokemon-reward-sprite">
                        ${isShinyReward ? '<span class="shiny-icon">✨</span>' : ''}
                        <img loading="lazy" decoding="async" src="${getPokemonSpriteUrl(res.finalId, isShinyReward)}" style="${getMutationFilterStyle(mutations)}">
                    </div>
                    <div class="reward-info">
                        <span class="badge ${isShinyReward ? 'shiny-badge' : ''}" style="background-color:${tier.color};">${tier.name}${isShinyReward ? ' ✨' : ''}</span>
                        ${getFormBadgeHtml(formInfo) ? `<div class="form-badges">${getFormBadgeHtml(formInfo)}</div>` : ''}
                        ${getMutationBadgeHtml(mutations)}
                    </div>
                    <div class="reward-types-row">${typesHTML}</div>
                </div>
            </div>
        `);
        const insertedImg = rewardArea.querySelectorAll('.pokemon-reward-sprite img');
        const latestImg = insertedImg[insertedImg.length - 1];
        setSpriteImage(latestImg, res.finalId, isShinyReward);
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
let currentSpeciesDetail = null;

function getSpeciesOwnedEntries(speciesId) {
    const results = [];
    Object.entries(inventory).forEach(([tierKey, tierItems]) => {
        tierItems.forEach(item => {
            if ((item.speciesId || item.id) === speciesId) {
                results.push({ tierKey, ...item });
            }
        });
    });
    return results;
}

function getSpeciesOwnedCopyCount(speciesId) {
    return getSpeciesOwnedEntries(speciesId).reduce((total, entry) => total + (Number(entry.count) || 1), 0);
}

async function openSpeciesDetailModal(item, tierKey) {
    const speciesId = item.speciesId || item.id;
    currentSpeciesDetail = { speciesId, tierKey };

    const modal = document.getElementById('species-detail-modal');
    const nameEl = document.getElementById('species-detail-name');
    const tierEl = document.getElementById('species-detail-tier');
    const summaryEl = document.getElementById('species-detail-summary');
    const imgEl = document.getElementById('species-detail-img');
    const craftBtn = document.getElementById('species-craft-btn');
    const upgradeBtn = document.getElementById('species-upgrade-btn');
    const pokedexBtn = document.getElementById('species-pokedex-btn');

    try {
        const speciesData = await fetchPokemonData(speciesId);
        nameEl.textContent = speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1).replace('-', ' ');
    } catch (error) {
        nameEl.textContent = `#${speciesId}`;
    }

    const ownedEntries = getSpeciesOwnedEntries(speciesId);
    const ownedCopyCount = getSpeciesOwnedCopyCount(speciesId);
    const tierName = rarityTiers[tierKey]?.name || 'Unknown';
    const upgradeTargetTier = getUpgradeTargetTier(tierKey);
    const upgradeCost = getPointUpgradeCost(tierKey);
    const currentPoints = speciesPoints[speciesId] || 0;
    const upgradeCandidate = ownedEntries.find(entry => entry.tierKey === tierKey && !favorites.includes(entry.id));
    const canCraft = Boolean(rarityTiers[tierKey]?.next);
    const canUpgrade = tierKey !== 'mythical' && tierKey !== 'umbra' && upgradeTargetTier && upgradeCandidate && currentPoints >= upgradeCost;

    tierEl.textContent = `${tierName} • ${ownedCopyCount} owned`;
    setSpriteImage(imgEl, speciesId, item.shiny);
    imgEl.style.cssText = getMutationFilterStyle(item.mutations);

    summaryEl.innerHTML = `
        <div class="species-detail-card"><strong>Current tier:</strong> ${tierName}</div>
        <div class="species-detail-card"><strong>Owned copies:</strong> ${ownedCopyCount}</div>
        <div class="species-detail-card"><strong>Species points:</strong> ${currentPoints}</div>
        <div class="species-detail-card"><strong>Mutations:</strong> ${item.mutations && item.mutations.length ? getMutationBadgeHtml(item.mutations, true) : 'None yet'}</div>
    `;

    craftBtn.disabled = !canCraft;
    craftBtn.onclick = () => {
        playSound('click');
        closeSpeciesDetailModal();
        craftPokemon(tierKey);
    };

    upgradeBtn.disabled = !canUpgrade;
    upgradeBtn.onclick = () => {
        playSound('click');
        closeSpeciesDetailModal();
        upgradePokemonTier(tierKey, speciesId);
    };

    pokedexBtn.onclick = () => {
        playSound('click');
        closeSpeciesDetailModal();
        openDexModal(speciesId);
    };

    modal.classList.remove('hidden');
}

function closeSpeciesDetailModal() {
    playSound('click');
    document.getElementById('species-detail-modal').classList.add('hidden');
}

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
            : 'Craft higher rarities from matching Pokémon or use species points to upgrade existing ones.';
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
        const canCraft = tier.next !== null && unfavoritedCount >= getCraftRequirementForTier(tierKey);
        const upgradeTargetTier = getUpgradeTargetTier(tierKey);
        const upgradeCost = getPointUpgradeCost(tierKey);
        const upgradeCandidate = items.find(item => !favorites.includes(item.id));
        const canUpgrade = tierKey !== 'mythical' && tierKey !== 'umbra' && upgradeTargetTier && upgradeCandidate && (speciesPoints[upgradeCandidate.speciesId || upgradeCandidate.id] || 0) >= upgradeCost;

        const section = document.createElement('div');
        section.classList.add('inv-tier-section');
        section.style.borderColor = tier.color;

        const header = document.createElement('div');
        header.classList.add('inv-tier-header');
        
        let titleHTML = `<span class="badge" style="background-color:${tier.color}">${tier.name}</span> (${items.length})`;
        let btnHTML = '';
        if (tier.next) {
            btnHTML += `
                <div class="craft-controls">
                    <input class="craft-amount-input" type="number" min="1" max="10" value="1" aria-label="Craft amount">
                    <button class="craft-btn" ${canCraft ? '' : 'disabled'} onclick="craftPokemon('${tierKey}', this.previousElementSibling.value)">Craft ${rarityTiers[tier.next].name}</button>
                </div>
            `;
        }
        if (upgradeTargetTier && upgradeCost) {
            btnHTML += `
                <div class="craft-controls">
                    <button class="craft-btn" ${canUpgrade ? '' : 'disabled'} onclick="upgradePokemonTier('${tierKey}')">Upgrade (${upgradeCost} pts)</button>
                </div>
            `;
        }
        
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
                openSpeciesDetailModal(item, tierKey);
            };
            box.innerHTML = `
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id})">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                ${item.shiny ? '<span class="shiny-icon">✨</span>' : ''}
                ${item.count > 1 ? `<span class="inv-count-badge">x${item.count}</span>` : ''}
                <div class="inventory-card-sprite">
                    <img loading="lazy" decoding="async" src="${getPokemonSpriteUrl(item.id, item.shiny)}" alt="poke" style="${getMutationFilterStyle(item.mutations)}">
                </div>
                <div class="inventory-card-meta">
                    <span class="badge" style="background-color:${tier.color}; font-size:10px; padding:3px 6px; margin:0;">${tier.name}</span>
                    ${item.form ? `<div class="form-badges">${getFormBadgeHtml(item.form)}</div>` : ''}
                    ${getMutationBadgeHtml(item.mutations, true)}
                </div>
            `;
            grid.appendChild(box);
            setSpriteImage(box.querySelector('img'), item.id, item.shiny);
        });

        if(items.length === 0) grid.innerHTML = `<p style="color:#aaa; font-size:12px; grid-column: 1/-1; text-align:left;">No Pokémon yet...</p>`;

        section.appendChild(grid);
        content.appendChild(section);
    });
}

function craftPokemon(fromTierKey, batchCountInput = 1) {
    const batchCount = Math.max(1, Math.min(10, parseInt(batchCountInput, 10) || 1));
    const requiredCount = getCraftRequirementForTier(fromTierKey) * batchCount;

    openSelectionModal('craft', fromTierKey, requiredCount, async (selectedIndices) => {
        playSound('craft');
        const inventoryScreen = document.getElementById('screen-inventory');
        inventoryScreen.classList.add('crafting-active');

        const toTierKey = rarityTiers[fromTierKey].next;
        if (!toTierKey) return;
        const toTier = rarityTiers[toTierKey];

        const selectedItems = selectedIndices.map(idx => inventory[fromTierKey][idx]).filter(Boolean);
        const sameSpecies = selectedItems.length > 0 && selectedItems.every(item => (item.speciesId || item.id) === (selectedItems[0].speciesId || selectedItems[0].id));
        const targetSpeciesId = sameSpecies ? (selectedItems[0].speciesId || selectedItems[0].id) : null;
        const targetTierKey = sameSpecies && fromTierKey === 'epic' ? 'umbra' : toTierKey;

        const sacrificedIds = selectedItems.map(item => item.id);
        selectedIndices.sort((a, b) => b - a).forEach(idx => inventory[fromTierKey].splice(idx, 1));

        const craftedIds = [];
        for (let i = 0; i < batchCount; i += 1) {
            let baseId = targetSpeciesId;
            let finalId = targetSpeciesId || null;
            if (!baseId) {
                const randomGen = Math.floor(Math.random() * 9) + 1;
                const reward = await getRewardId(targetTierKey, randomGen);
                baseId = reward.baseId;
                finalId = reward.finalId;
            }
            const mutations = getRandomMutations();
            craftedIds.push({ baseId, finalId, mutations });
            addPokemonToInventory(targetTierKey, finalId || baseId, false, mutations, null, targetSpeciesId || baseId);
            if (!ownedSpecies.includes(baseId)) ownedSpecies.push(baseId);
        }

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

            const craftGrid = document.getElementById('craft-pokemon-grid');
            const craftModal = document.getElementById('craft-modal');
            const craftTierName = document.getElementById('craft-tier-name');

            if (craftGrid) {
                craftGrid.innerHTML = craftedIds.map(craft => `<img src="${getPokemonSpriteUrl(craft.finalId || craft.baseId, false)}" alt="crafted pokemon" style="${getMutationFilterStyle(craft.mutations)}">`).join('');
            }
            if (craftTierName) {
                craftTierName.textContent = batchCount > 1 ? `${batchCount} ${rarityTiers[targetTierKey].name}` : rarityTiers[targetTierKey].name;
                craftTierName.style.color = rarityTiers[targetTierKey].color;
            }
            if (craftModal) {
                craftModal.classList.remove('hidden');
            }
        }, 2000);
    });
}

function upgradePokemonTier(fromTierKey, selectedSpeciesId = null) {
    const upgradeTargetTier = getUpgradeTargetTier(fromTierKey);
    const upgradeCost = getPointUpgradeCost(fromTierKey);
    if (!upgradeTargetTier || !upgradeCost) return;

    const items = inventory[fromTierKey] || [];
    const candidate = (selectedSpeciesId
        ? items.find(item => (item.speciesId || item.id) === selectedSpeciesId && !favorites.includes(item.id))
        : null) || items.find(item => !favorites.includes(item.id));
    if (!candidate) {
        alert('You need at least one unfavorited Pokémon in this tier to upgrade it.');
        return;
    }

    const speciesId = candidate.speciesId || candidate.id;
    const currentPoints = speciesPoints[speciesId] || 0;
    if (currentPoints < upgradeCost) {
        alert(`You need ${upgradeCost} species points for this upgrade. Currently you have ${currentPoints}.`);
        return;
    }

    speciesPoints[speciesId] = currentPoints - upgradeCost;
    const index = inventory[fromTierKey].findIndex(item => item.id === candidate.id && item.shiny === candidate.shiny && arraysEqual(normalizeMutations(item.mutations), normalizeMutations(candidate.mutations)) && (item.speciesId || item.id) === speciesId);
    if (index >= 0) {
        inventory[fromTierKey].splice(index, 1);
    }

    const targetTierItems = inventory[upgradeTargetTier] || [];
    const existingTargetItem = targetTierItems.find(item => item.id === candidate.id && item.shiny === candidate.shiny && arraysEqual(normalizeMutations(item.mutations), normalizeMutations(candidate.mutations)) && (item.speciesId || item.id) === speciesId);
    if (existingTargetItem) {
        existingTargetItem.count = (existingTargetItem.count || 1) + 1;
        if (candidate.form && !existingTargetItem.form) {
            existingTargetItem.form = candidate.form;
        }
    } else {
        inventory[upgradeTargetTier].push({
            id: candidate.id,
            shiny: candidate.shiny,
            mutations: normalizeMutations(candidate.mutations),
            count: 1,
            form: candidate.form || null,
            speciesId
        });
    }
    if (!ownedSpecies.includes(speciesId)) ownedSpecies.push(speciesId);
    saveInventory();
    renderInventory();
    playSound('craft');
}

function closeCraftModal() {
    playSound('click');
    document.getElementById('craft-modal').classList.add('hidden');
    document.getElementById('screen-inventory').classList.remove('crafting-active');
}


// --- Pokédex Logic (With Shiny & Forms) ---
let isShinyView = false;
let currentPokeData = null;
let currentDisplayMutations = [];
let previewMutations = [];
let currentPokemonOwned = false;

document.getElementById('dex-gen-select').addEventListener('change', () => playSound('click'));

async function renderPokedexGrid() {
    const gen = parseInt(document.getElementById('dex-gen-select').value);
    const searchInput = document.getElementById('dex-search-input');
    const searchQuery = normalizePokedexQuery(searchInput?.value || '');
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';

    const [start, end] = genBounds[gen];
    let ownedInGen = 0;
    const needsNameSearch = searchQuery && /[a-z]/.test(searchQuery) && !pokedexNamesLoaded;
    if (needsNameSearch) await loadAllPokedexNames();

    for (let id = start; id <= end; id++) {
        const name = getPokedexName(id);
        const owned = ownedSpecies.includes(id) || isPokemonOwned(id);
        const isFav = favorites.includes(id);
        
        let shouldRender = true;
        if (searchQuery) {
            const idMatch = id.toString().includes(searchQuery);
            const nameMatch = fuzzyMatchQuery(searchQuery, normalizePokedexQuery(name));
            shouldRender = idMatch || nameMatch;
        }
        if (!shouldRender) continue;

        if (owned) ownedInGen++;
        
        const box = document.createElement('div');
        box.className = `dex-item ${owned ? '' : 'unowned'}`;
        box.onclick = () => { playSound('click'); openDexModal(id); };
        
        box.innerHTML = `
            <span class="dex-id-label">#${id}</span>
            ${owned && isFav ? '<span class="dex-fav-heart">❤️</span>' : ''}
            <img loading="lazy" decoding="async" src="${getPokemonSpriteUrl(id)}" alt="poke">
            ${name ? `<div class="dex-name">${capitalizeWords(name)}</div>` : ''}
        `;
        grid.appendChild(box);
        setSpriteImage(box.querySelector('img'), id, false);
    }
    
    document.getElementById('dex-progress').textContent = `${ownedInGen} / ${end - start + 1} Owned`;
}

async function openDexModal(baseId) {
    document.getElementById('dex-modal').classList.remove('hidden');
    playSound('open');
    isShinyView = false; 
    previewMutations = [];
    document.getElementById('dex-loading').classList.remove('hidden');
    document.getElementById('dex-content').classList.add('hidden');
    
    try {
        const speciesData = await fetchSpeciesData(baseId);
        
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
    const pokeData = await fetchPokemonData(id);
    currentPokeData = pokeData;
    currentDisplayMutations = getOwnedMutationsForPokemon(id);
    currentPokemonOwned = Boolean(isOwned);
    previewMutations = [];
    
    document.getElementById('dex-name').textContent = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1).replace('-', ' ');

    const variantContainer = document.getElementById('dex-variant-ownership');
    const ownership = getVariantOwnershipForPokemon(id);
    if (variantContainer) {
        variantContainer.innerHTML = `
            <div class="dex-variant-chip ${ownership.base ? '' : 'unowned'}">🌱 Base</div>
            <div class="dex-variant-chip ${ownership.shiny ? '' : 'unowned'}">✨ Shiny</div>
            <div class="dex-variant-chip ${ownership.sakura ? '' : 'unowned'}">🌸 Sakura</div>
            <div class="dex-variant-chip ${ownership.winter ? '' : 'unowned'}">❄️ Winter</div>
            <div class="dex-variant-chip ${ownership.molten ? '' : 'unowned'}">🔥 Molten</div>
        `;
    } else {
        const container = document.createElement('div');
        container.id = 'dex-variant-ownership';
        container.className = 'dex-variant-ownership';
        container.innerHTML = `
            <div class="dex-variant-chip ${ownership.base ? '' : 'unowned'}">🌱 Base</div>
            <div class="dex-variant-chip ${ownership.shiny ? '' : 'unowned'}">✨ Shiny</div>
            <div class="dex-variant-chip ${ownership.sakura ? '' : 'unowned'}">🌸 Sakura</div>
            <div class="dex-variant-chip ${ownership.winter ? '' : 'unowned'}">❄️ Winter</div>
            <div class="dex-variant-chip ${ownership.molten ? '' : 'unowned'}">🔥 Molten</div>
        `;
        const content = document.getElementById('dex-content');
        const actions = document.getElementById('dex-actions');
        content.insertBefore(container, actions);
    }
    
    const badge = document.getElementById('dex-ownership-badge');
    if (isOwned) {
        badge.textContent = "Owned 💖";
        badge.style.backgroundColor = "#ff7b89";
    } else {
        badge.textContent = "Unowned 🔒";
        badge.style.backgroundColor = "#b2bec3";
    }

    const mutationContainer = document.getElementById('dex-mutation-badges');
    if (mutationContainer) {
        mutationContainer.innerHTML = getMutationBadgeHtml(currentDisplayMutations);
    } else {
        const container = document.createElement('div');
        container.id = 'dex-mutation-badges';
        container.className = 'mutation-badges';
        container.innerHTML = getMutationBadgeHtml(currentDisplayMutations);
        const content = document.getElementById('dex-content');
        const actions = document.getElementById('dex-actions');
        content.insertBefore(container, actions);
    }

    const mutationPreviewContainer = document.getElementById('dex-mutation-preview');
    const ownedMutationsForCurrentPokemon = currentDisplayMutations.filter(m => m && mutationDefs[m]);
    if (mutationPreviewContainer) {
        mutationPreviewContainer.innerHTML = '';
        if (isOwned) {
            const title = document.createElement('div');
            title.className = 'dex-variant-chip';
            title.textContent = 'Preview mutations';
            mutationPreviewContainer.appendChild(title);
            mutationOrder.forEach(mutationKey => {
                const mutationIsOwned = ownedMutationsForCurrentPokemon.includes(mutationKey);
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `dex-action-btn dex-mutation-btn ${previewMutations.includes(mutationKey) ? 'active' : ''} ${!mutationIsOwned ? 'disabled-btn' : ''}`;
                btn.dataset.mutationKey = mutationKey;
                btn.disabled = !mutationIsOwned;
                btn.textContent = `${mutationDefs[mutationKey].icon} ${mutationDefs[mutationKey].name}`;
                btn.onclick = () => toggleMutationPreview(mutationKey);
                btn.title = mutationIsOwned ? `Preview ${mutationDefs[mutationKey].name}` : `Own a ${mutationDefs[mutationKey].name} mutation to preview`;
                mutationPreviewContainer.appendChild(btn);
            });
        }
    } else {
        const container = document.createElement('div');
        container.id = 'dex-mutation-preview';
        container.className = 'dex-mutation-preview';
        const content = document.getElementById('dex-content');
        const actions = document.getElementById('dex-actions');
        content.insertBefore(container, actions);
        if (isOwned) {
            const title = document.createElement('div');
            title.className = 'dex-variant-chip';
            title.textContent = 'Preview mutations';
            container.appendChild(title);
            mutationOrder.forEach(mutationKey => {
                const mutationIsOwned = ownedMutationsForCurrentPokemon.includes(mutationKey);
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `dex-action-btn dex-mutation-btn ${previewMutations.includes(mutationKey) ? 'active' : ''} ${!mutationIsOwned ? 'disabled-btn' : ''}`;
                btn.dataset.mutationKey = mutationKey;
                btn.disabled = !mutationIsOwned;
                btn.textContent = `${mutationDefs[mutationKey].icon} ${mutationDefs[mutationKey].name}`;
                btn.onclick = () => toggleMutationPreview(mutationKey);
                btn.title = mutationIsOwned ? `Preview ${mutationDefs[mutationKey].name}` : `Own a ${mutationDefs[mutationKey].name} mutation to preview`;
                container.appendChild(btn);
            });
        }
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

    const shinyBtn = document.getElementById('dex-shiny-btn');
    const hasOwnedShiny = getVariantOwnershipForPokemon(id).shiny;
    shinyBtn.disabled = !isOwned || !hasOwnedShiny;
    shinyBtn.title = isOwned && hasOwnedShiny ? 'Preview the shiny form' : 'You need to own a shiny version first';
    if (!isOwned || !hasOwnedShiny) {
        isShinyView = false;
    }
    
    updateDexImage();
    
    const typesContainer = document.getElementById('dex-types');
    typesContainer.innerHTML = '';
    if (isOwned) {
        pokeData.types.forEach(t => {
            const span = document.createElement('span');
            span.className = 'badge';
            span.style.backgroundColor = getTypeColor(t.type.name);
            span.textContent = t.type.name.toUpperCase();
            typesContainer.appendChild(span);
        });
    } else {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.backgroundColor = '#b2bec3';
        span.textContent = '???';
        typesContainer.appendChild(span);
    }
    
    const enEntry = speciesData.flavor_text_entries.find(e => e.language.name === 'en');
    document.getElementById('dex-desc').textContent = isOwned ? (enEntry ? enEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.') : '???';
    
    const maxStat = 255; 
    const getStat = (name) => pokeData.stats.find(s => s.stat.name === name).base_stat;
    const stats = {
        'hp': getStat('hp'), 'atk': getStat('attack'), 'def': getStat('defense'),
        'spa': getStat('special-attack'), 'spd': getStat('special-defense'), 'spe': getStat('speed')
    };

    for (const [key, val] of Object.entries(stats)) {
        document.getElementById(`stat-${key}`).style.width = isOwned ? `${(val / maxStat) * 100}%` : '0%';
        document.getElementById(`val-${key}`).textContent = isOwned ? val : '???';
    }
}

function toggleShiny() {
    if (!currentPokemonOwned) return;
    const ownership = getVariantOwnershipForPokemon(currentPokeData?.id || 0);
    if (!ownership.shiny) return;
    playSound('click');
    isShinyView = !isShinyView;
    updateDexImage();
}

function toggleMutationPreview(mutationKey) {
    if (!currentPokemonOwned || !mutationDefs[mutationKey] || !currentDisplayMutations.includes(mutationKey)) return;
    playSound('click');
    if (previewMutations.includes(mutationKey)) {
        previewMutations = previewMutations.filter(key => key !== mutationKey);
    } else {
        previewMutations = [...previewMutations, mutationKey];
    }
    const container = document.getElementById('dex-mutation-preview');
    if (container) {
        Array.from(container.children).forEach(child => {
            if (child.tagName === 'BUTTON') {
                const key = child.dataset.mutationKey;
                child.classList.toggle('active', previewMutations.includes(key));
            }
        });
    }
    updateDexImage();
}

function updateDexImage() {
    if (!currentPokeData) return;
    const shinyBtn = document.getElementById('dex-shiny-btn');
    const dexImg = document.getElementById('dex-detail-img');
    const imageUrl = getDexSpriteUrl(currentPokeData, isShinyView && currentPokemonOwned);

    if (isShinyView && currentPokemonOwned) {
        shinyBtn.classList.add('active');
    } else {
        shinyBtn.classList.remove('active');
    }

    setSpriteImage(dexImg, currentPokeData.id, isShinyView && currentPokemonOwned);

    if (!currentPokemonOwned) {
        dexImg.classList.add('dex-silhouette');
        dexImg.style.cssText = 'filter: brightness(0) saturate(0); -webkit-filter: brightness(0) saturate(0);';
        shinyBtn.classList.remove('active');
        return;
    }

    dexImg.classList.remove('dex-silhouette');
    dexImg.style.cssText = getMutationFilterStyle(previewMutations);
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