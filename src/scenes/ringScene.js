import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders'; // Ensure loaders are imported if not globally available
import * as CANNON from 'cannon';

class RingScene {
    constructor(engine) {
        this.engine = engine;
        this.scene = new BABYLON.Scene(engine);
        // Initialize Cannon.js and set it as the physics engine for the scene
        const physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, CANNON);
        this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), physicsPlugin);
    }

    async createScene() {
        const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, new BABYLON.Vector3(0, 1, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas(), true); // Use 'getRenderingCanvas' for safety

        // Light setup
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;

        // Load additional scene objects
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/models/scene.glb", "", this.scene);
        for (let mesh of result.meshes) {     // Assign physics impostors to imported meshes as needed
            if (mesh.getTotalVertices() > 0) { // Check if mesh has vertices
                mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9 }, this.scene);
            }
        }

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
