import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { createScene } from './scenes/ringScene';
import { createDummy } from './scenes/ringScene';

window.onload = () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas);

    const scene = createScene(engine, canvas);
    createDummy(scene);


    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
};
