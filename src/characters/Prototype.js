import * as BABYLON from '@babylonjs/core';

export function createDummy(scene) {
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh("", "/assets/models/", "dummy2.babylon", scene, function (newMeshes, particleSystems, skeletons, animationsGroup) {
            var skeleton = skeletons[0];

            var idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1.0, true);
            var walkAnim = scene.beginWeightedAnimation(skeleton, 90, 118, 0, true);
            var runAnim = scene.beginWeightedAnimation(skeleton, 119, 135, 0, true);

            var character = newMeshes[0];
            console.log(character);
            character.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
            character.position = new BABYLON.Vector3(0, 0.3, 0);
            resolve(character);
        }, function (evt) {
            // Optionally handle progress or errors here
            // Reject the Promise on error
        });
    });
}
export function moveCharacter(direction, distance, dummy) {
    switch (direction) {
        case 'z':
            dummy.position.z -= distance;
            break;
        case 's':
            dummy.position.z += distance;
            break;
        case 'd':
            dummy.position.x -= distance;
            break;
        case 'q':
            dummy.position.x += distance;
            break;
    }
}
export async function loadCharacters(scene) {
    const character = await createDummy(scene);

    return character;
}
