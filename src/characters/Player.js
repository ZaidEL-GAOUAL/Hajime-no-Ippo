import * as BABYLON from '@babylonjs/core';

import { InputController } from "../inputController";

class Player {
    constructor(scene, modelUrl) {
        this.scene = scene;
        this.modelUrl = modelUrl;
        this.character = null;
        this.skeleton = null;
        this.animations = {};
        this.movementSpeed = 1.0; // Define a suitable movement speed
        this.isWalking = false; // Track whether the player is walking
    }

    async loadModel() {
        // Adjusted from your createDummy function
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", this.modelUrl, "", this.scene, (newMeshes, skeletons) => {
                this.character = newMeshes[0];
                this.skeleton = skeletons[0];

                // Adjusted from your createDummy function
                //this.animations['idle'] = this.scene.beginWeightedAnimation(this.skeleton, 0, 89, 1.0, true);
                //this.animations['walk'] = this.scene.beginWeightedAnimation(this.skeleton, 90, 118, 0, true);
                //this.animations['run'] = this.scene.beginWeightedAnimation(this.skeleton, 119, 135, 0, true);

                this.initializeCharacterProperties();
                resolve(this.character);
            }, function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded * 100 / evt.total);
                    console.log("percentComplete: " + percentComplete + "%");
                } else {
                    console.log("Loading...");
                }
            }
            )
        });
    }

    initializeCharacterProperties() {
        // Set initial character properties like scale and position
        this.character.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
        this.character.position = new BABYLON.Vector3(0, 5.6, 0);
    }

    playAnimation(name, loop = true) {
        const animation = this.animations[name];
        if (animation && !animation.isPlaying) {
            animation.restart();
            animation.weight = 1.0; // Ensure full animation weight
            animation.loop = loop;
        }
    }

    move(direction, distance) {
        // Adjust the movement logic based on the direction
        let moveVec = new BABYLON.Vector3(0, 0, 0);
        switch (direction) {
            case 'up':
                moveVec.z += distance;
                break;
            case 'down':
                moveVec.z -= distance;
                break;
            case 'left':
                moveVec.x -= distance;
                break;
            case 'right':
                moveVec.x += distance;
                break;
        }
        this.character.position.addInPlace(moveVec);

        if (!this.isWalking) {
            this.playAnimation('walk'); // Start walking animation
            this.isWalking = true;
        }
    }

    update(deltaTime) {
        const inputInstance = InputController.instance; // Access the singleton instance
        let isMoving = false; // Track if there's any movement input

        if (inputInstance.isActionActive("moveForward")) {
            this.move('up', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (inputInstance.isActionActive("moveBackward")) {
            this.move('down', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (inputInstance.isActionActive("moveLeft")) {
            this.move('left', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (inputInstance.isActionActive("moveRight")) {
            this.move('right', this.movementSpeed * deltaTime);
            isMoving = true;
        }

        // If not moving and was previously walking, switch to idle animation
        if (!isMoving && this.isWalking) {
            this.playAnimation('idle');
            this.isWalking = false; // Update walking state
        }

        if (inputInstance.isActionActive("punch")) {
            this.playAnimation('punch', false);
        }
    }
}

export default Player;
