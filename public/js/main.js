import Camera from './Camera.js';
import Timer from './Timer.js';
import {loadLevel} from './loaders.js';
import {createMario} from './entities.js';
import {createCollisionLayer} from './layers.js';
import {setupKeyboard} from './input.js';
import {setUpMouseControl} from './debug.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    createMario(),
    loadLevel('1-1'),
])
.then(([mario,level]) => {
    const camera = new Camera();
    window.Camera = camera;

    mario.pos.set(64, 64);
    // LEVEL DEBUGGER
    level.comp.layers.push(createCollisionLayer(level));

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setUpMouseControl(canvas, mario, camera);

    const timer = new Timer(1/60);
    timer.update = function(deltaTime) {
        level.update(deltaTime);
        level.comp.draw(context, camera);
    };

    timer.start();
});
