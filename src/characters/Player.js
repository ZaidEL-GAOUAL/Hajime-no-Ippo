import * as BABYLON from '@babylonjs/core';
import { InputController } from "../inputController";

class Player {
    constructor(scene, modelUrl) {
        this.scene = scene;
        this.modelUrl = modelUrl;
        this.character = null;
        this.skeleton = null;
        this.animations = {};
        this.movementSpeed = 0.9; // Define a suitable movement speed
        this.isAnimating = false;
    }

    async loadModel() {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", "./characters/", "BoxerAnimations.glb", this.scene, (newMeshes, Skeletons) => {
                this.character = newMeshes[0];
                this.scene.stopAllAnimations();
                this.animations['idle'] = this.scene.getAnimationGroupByName('Boxing stance 2');
                this.animations['walk'] = this.scene.getAnimationGroupByName('Step forward');
                this.animations['backward'] = this.scene.getAnimationGroupByName('step backward');
                this.animations['punch'] = this.scene.getAnimationGroupByName('Jab body');
                this.animations['left'] = this.scene.getAnimationGroupByName('Left pivot');
                this.animations['right'] = this.scene.getAnimationGroupByName('Right pivot');

                this.initializeCharacterProperties();

                resolve(this.character);
            });
        });
    }

    initializeCharacterProperties() {
        this.character.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
        this.character.position = new BABYLON.Vector3(0, 5.9, 0);
        this.character.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.character,
            BABYLON.PhysicsImpostor.BoxImpostor, // Consider changing if the shape doesn't match
            { mass: 0, restitution: 0.1 }, // Lower restitution to avoid bouncy effects
            this.scene
        );
        this.playAnimation('idle', null, true);
    }

    playAnimation(name, movement, loop, blendingSpeed = 0.1) {
        var animation = this.animations[name];
        if (animation) {
            // Stop and clear any current animation that's not the one we want to play
            if (this.currentAnimation && this.currentAnimation !== animation) {
                this.currentAnimation.onAnimationEndObservable.clear();
                this.currentAnimation.stop();
            }

            this.currentAnimation = animation;

            //if (name !== 'idle') {
            animation.enableBlending = true;
            animation.blendingSpeed = blendingSpeed;
            // }
            animation.start(loop);

            if (!loop) {
                // Listen for the end of the animation to then trigger movement
                animation.onAnimationEndObservable.addOnce(() => {
                    this.isAnimating = false;
                    // Check if a movement direction is defined to then move
                    if (movement) {
                        this.move(movement);
                    }
                    // After the action, revert to idle unless another action is triggered
                    this.playAnimation('idle', null, true);
                });
            }
        } else {
            console.error("Animation group not found:", name);
            this.isAnimating = false;
        }
    }


    move(direction) {
        let velocity = new BABYLON.Vector3(0, 0, 0);
        let distance = this.movementSpeed;  // Adjust speed as necessary

        switch (direction) {
            case 'forward':
                velocity.z += distance;
                break;
            case 'backward':
                velocity.z -= distance;
                break;
            case 'left':
                velocity.x -= distance;
                break;
            case 'right':
                velocity.x += distance;
                break;
        }

        // Apply velocity based on the character's orientation
        velocity.rotateByQuaternionToRef(this.character.rotationQuaternion, velocity);
        if (this.character.physicsImpostor) {
            this.character.physicsImpostor.setLinearVelocity(velocity);
        }
    }


    update(deltaTime) {
        if (this.isAnimating) return;

        if (InputController.isActionActive("moveForward")) {
            this.playAnimation('walk', 'up', false);
        }
        if (InputController.isActionActive("moveBackward")) {
            this.playAnimation('backward', 'down', false);
        }
        if (InputController.isActionActive("moveLeft")) {
            this.playAnimation('left', 'left', false);
        }
        if (InputController.isActionActive("moveRight")) {
            this.playAnimation('right', 'right', false);
        }



        if (InputController.isActionActive("punch")) {
            this.playAnimation('punch', null, false);
        }
    }
}

export default Player;
