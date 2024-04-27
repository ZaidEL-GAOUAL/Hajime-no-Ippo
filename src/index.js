import * as BABYLON from '@babylonjs/core';
import '@babylonjs/inspector';
import '@babylonjs/loaders';
import RingScene from './scenes/ringScene';
import Player from './characters/Player';
import { InputController } from './inputController';
import { GlobalManager } from './GlobalManager';

window.onload = async () => {
    const canvas = document.getElementById('renderCanvas');
    GlobalManager.initialize(canvas);
    const engine = GlobalManager.getEngine();
    InputController.init();



    let ringScene = new RingScene(engine);
    let scene = await ringScene.createScene();

    let ippo = new Player(scene, "./characters/BoxerAnimations.glb");
    await ippo.loadModel();

    scene.debugLayer.show({ overlay: true });


    engine.runRenderLoop(() => {
        scene.render();
        const deltaTime = engine.getDeltaTime() / 1000.0; // Convert ms to seconds
        InputController.update(deltaTime);
        GlobalManager.update(deltaTime);

        ippo.update(deltaTime); // Update the player's state based on inputs and animations
        InputController.resetActions(); // Reset actions for the next frame

    });

    window.addEventListener('resize', () => {
        engine.resize();
    });

    window.addEventListener('keydown', function (e) {


    });

};
