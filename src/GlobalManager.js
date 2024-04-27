import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

class GlobalManager {
    static _instance = null;
    scene = null;
    engine = null;
    animations = {};

    constructor() {
        if (GlobalManager._instance) {
            throw new Error("This class is a singleton and already has an instance!");
        }
        GlobalManager._instance = this;
    }

    static get instance() {
        if (!GlobalManager._instance) {
            GlobalManager._instance = new GlobalManager();
        }
        return GlobalManager._instance;
    }

    initialize(canvas) {
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.loadGlobalResources();
    }

    loadGlobalResources() {
        // Load global resources such as sounds, shared materials, etc.
        // Optionally, load animations here and store them in `this.animations`.
    }

    getScene() {
        return this.scene;
    }

    getEngine() {
        return this.engine;
    }

    // Utility function to load animations or other scene-specific resources
    loadSceneResources(url, onSuccess) {
        BABYLON.SceneLoader.ImportMesh("", url, "scene.babylon", this.scene, (newMeshes, particleSystems, skeletons) => {
            onSuccess(newMeshes, skeletons);
        });
    }

    // Animation access method
    getAnimation(name) {
        return this.animations[name];
    }

    // Example method to handle resizing
    handleResize() {
        this.engine.resize();
    }

    // Method to cleanup and dispose resources when needed
    dispose() {
        this.scene.dispose();
        this.engine.dispose();
    }
    update(delta) {

    }
}

const { instance } = GlobalManager;
export { instance as GlobalManager };