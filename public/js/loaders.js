import Level from './Level.js';
import SpriteSheet from './spriteSheets.js';
import {createBackgroundLayer, createSpriteLayer} from './layers.js';
import {loadBackgroundSprites} from './sprites.js';

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            // console.log('image;', image);
            resolve(image);
        });
        image.src = url;
    });
}

function loadJSON(url) {
    return fetch(url)
    .then(r => r.json());
}

function createTiles(level, backgrounds) {
    function applyRange(background, xStart, xLen, yStart, yLen) {
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;
        for (let x = xStart; x < xEnd; ++x) {
            for (let y = yStart; y < yEnd; ++y) {
                level.tiles.set(x, y, {
                    name: background.tile,
                });
            }
        }
    }

    backgrounds.forEach(background => {
        background.ranges.forEach(range => {
            if (range.length === 4) {
                const [xStart, xLen, yStart, yLen] = range;
                applyRange(background, xStart, xLen, yStart, yLen);
            } else if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                applyRange(background, xStart, xLen, yStart, 1);
            } else if (range.length === 2) {
                const [xStart, yStart] = range;
                applyRange(background, xStart, 1, yStart, 1);
            }
        });
    });
}

function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`)
    .then(sheetSpec => Promise.all([
       sheetSpec,
       loadImage(sheetSpec.imgageURL)
    ]))
    .then(([sheetSpec, image])=> {
        const sprites = new SpriteSheet(
            image,
            sheetSpec.tileW, 
            sheetSpec.tileH);

        sheetSpec.tiles.forEach(tileSpec => {
            sprites.defineTile(
                tileSpec.name,
                tileSpec.index[0],
                tileSpec.index[1]);
        });
        
        return sprites;
    });
}


// return loadImage('/img/tiles.png')
//     .then(image => {
//         const sprites = new SpriteSheet(image, 16, 16);
//         sprites.defineTile('ground', 0, 0);
//         sprites.defineTile('sky', 3, 23);
//         return sprites;
//     });

export function loadLevel(name) {
    return Promise.all([
        loadJSON(`/levels/${name}.json`),
        loadSpriteSheet('overworld'),
        // loadBackgroundSprites()
    ])
    .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        createTiles(level, levelSpec.backgrounds);
        
        const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
        level.comp.layers.push(backgroundLayer);

        const spriteLayer = createSpriteLayer(level.entities);
        level.comp.layers.push(spriteLayer);

        return level;
    });
}
