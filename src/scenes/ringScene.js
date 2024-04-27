import * as BABYLON from '@babylonjs/core';

class RingScene {
    constructor(engine) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);

    }

    createScene() {

        const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, new BABYLON.Vector3(0, 1, 0), this.scene);
        camera.attachControl(this.engine.canvas, true);
        // Light setup
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;

        // Ground setup
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.material = groundMat;
        ground.position = new BABYLON.Vector3(0, -1.7, 0);
        BABYLON.SceneLoader.ImportMesh("", "assets/models/scene.glb", "", this.scene);
        // Further scene setup like importing meshes, creating objects, etc.

        // Since 'this.scene' is already initialized and used,
        // there's no need to return it from this method unless it's required for chaining or other purposes.
        return this.scene;
    }

    // Additional methods for further scene setup can be added here
}

// Usage example
/*const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const ringScene = new RingScene(engine);
ringScene.createScene(); // Setup the scene with lights, ground, etc.

engine.runRenderLoop(() => {
    ringScene.scene.render(); // Access the 'scene' property for rendering.
});*/


export default RingScene;
