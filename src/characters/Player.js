import * as BABYLON from '@babylonjs/core';

import { InputController } from "../inputController";

class Player {
    constructor(scene, modelUrl) {
        this.scene = scene;
        this.modelUrl = modelUrl;
        this.character = null;
        this.skeleton = null;
        this.animations = {};
        this.movementSpeed = 0.0; // Define a suitable movement speed
        this.isWalking = false; // Track whether the player is walking
        this.isAnimating = false;

    }

    async loadModel() {
        // Adjusted from your createDummy function
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", "./characters/", "BoxerAnimations.glb", this.scene, (newMeshes, Skeletons, AnimationGroup) => {
                this.character = newMeshes[0];
                var skeleton = AnimationGroup[0];

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
        this.playAnimation('Boxing stance 2', true);
    }

    playAnimation(name, loop, blendingSpeed = 0.1) {
        var idleRange = this.scene.getAnimationGroupByName(name);
        if (idleRange) {
            this.isAnimating = true;
            idleRange.start(loop, 1.0, idleRange.from, idleRange.to, false);
            idleRange.targetedAnimations.forEach(ta => {
                ta.animation.enableBlending = true;
                ta.animation.blendingSpeed = blendingSpeed;
            });

            idleRange.onAnimationEndObservable.addOnce(() => {
                this.isAnimating = false;
                // Assuming the animation actually moves the character, apply this new position
                const lastAnimation = idleRange.targetedAnimations.find(ta => ta.target === this.character);
                const lastKey = lastAnimation?.animation.getKeys().slice(-1)[0];
                if (lastKey && 'position' in lastKey.value) {
                    // Apply the position from the animation to the character's actual position
                    this.character.position = this.character.position.add(lastKey.value.position);
                }
            });

            if (loop) {
                idleRange.onAnimationLoopObservable.addOnce(() => {
                    this.isAnimating = false;  // Reset only after one full loop if needed
                });
            }
        } else {
            console.error("Animation group not found:", name);
            this.isAnimating = false;
        }
    }



    move(direction, distance) {
        // Adjust the movement logic based on the direction
        let moveVec = new BABYLON.Vector3(0, 0, 0);
        switch (direction) {
            case 'up':
                moveVec.z -= distance;
                break;
            case 'down':
                moveVec.z += distance;
                break;
            case 'left':
                moveVec.x -= distance;
                break;
            case 'right':
                moveVec.x += distance;
                break;
        }
        this.character.moveWithCollisions(moveVec); // Assuming moveWithCollisions is available

        if (!this.isWalking) {
            this.isWalking = true;
        }
    }

    update(deltaTime) {
        if (this.isAnimating) return;  // Skip handling inputs if an animation is active

        let isMoving = false; // Track if there's any movement input

        if (InputController.isActionActive("moveForward")) {
            this.playAnimation('Step forward', false);

            this.move('up', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (InputController.isActionActive("moveBackward")) {
            this.playAnimation('step backward', false);
            this.move('down', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (InputController.isActionActive("moveLeft")) {
            this.move('left', this.movementSpeed * deltaTime);
            isMoving = true;
        }
        if (InputController.isActionActive("moveRight")) {
            this.move('left', this.movementSpeed * deltaTime);

            isMoving = true;
        }

        // If not moving and was previously walking, switch to idle animation
        if (!isMoving && this.isWalking) {
            this.playAnimation('Boxing stance 2', true);
            this.isWalking = false; // Update walking state
        }

        if (InputController.isActionActive("punch")) {
            this.playAnimation('Head hit', false);
        }
    }
}

export default Player;
