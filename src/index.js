import * as BABYLON from '@babylonjs/core';
import '@babylonjs/inspector';
import '@babylonjs/loaders';
import { createScene } from './scenes/ringScene';
import { moveCharacter } from './characters/Prototype';

window.onload = () => {

    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas);

    const scene = createScene(engine, canvas);
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);
    scene.debugLayer.show({ overlay: true });


    engine.runRenderLoop(() => {
        scene.render();


    });

    window.addEventListener('resize', () => {
        engine.resize();
    });

    window.addEventListener('keydown', function (e) {
        let prototyp = scene.getMeshByName("Third Person");

        switch (e.key) {
            case 'z': // Move character forward
                moveCharacter("z", 0.2, prototyp);
                break;
            case 's': // Move character backward
                moveCharacter("s", 0.2, prototyp);
                break;
            case 'd': // Move character left
                moveCharacter("d", 0.2, prototyp);
                break;
            case 'q': // Move character right
                moveCharacter("q", 0.2, prototyp);
                break;
        }
    });

};
