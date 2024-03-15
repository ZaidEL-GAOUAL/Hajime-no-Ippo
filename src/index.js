import * as BABYLON from '@babylonjs/core';
import '@babylonjs/inspector';
import '@babylonjs/loaders';
import RingScene from './scenes/ringScene';
import Player from './characters/Player';

window.onload = async () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas);


    let ringScene = new RingScene(engine);
    let scene = await ringScene.createScene(); // Now 'scene' is a Babylon.js Scene object

    let ippo = new Player(scene, "./characters/BoxerAnimations.glb");
    await ippo.loadModel();

    scene.debugLayer.show({ overlay: true });


    engine.runRenderLoop(() => {
        scene.render();


    });

    window.addEventListener('resize', () => {
        engine.resize();
    });

    window.addEventListener('keydown', function (e) {

        switch (e.key) {
            case 'z': // Move character forward
                ippo.move("up", 0.2);
                break;
            case 's': // Move character backward
                ippo.move("down", 0.2);
                break;
            case 'd': // Move character left
                ippo.move("left", 0.2);
                break;
            case 'q': // Move character right
                ippo.move("right", 0.2);
                break;
        }
    });

};
