import * as BABYLON from '@babylonjs/core';
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas);
engine.enableOfflineSupport = false;
BABYLON.Animation.AllowMatricesInterpolation = true;

export const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 40, height: 40 }, scene);
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
    groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    ground.material = groundMat;
    ground.position = new BABYLON.Vector3(0, -1.7, 0);

    /*
        // Ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 7.8, height: 7.8 }, scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
        groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        ground.material = groundMat;
    
        // Corner Rectangles
        const cornerMat = new BABYLON.StandardMaterial('cornerMat', scene);
        cornerMat.diffuseColor = new BABYLON.Color3(1, 1, 1); // Set corner rectangle color to white
    
        const redCornerMat = new BABYLON.StandardMaterial('redCornerMat', scene);
        redCornerMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5); // Red color for one corner
    
        const blueCornerMat = new BABYLON.StandardMaterial('blueCornerMat', scene);
        blueCornerMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Blue color for opposite corner
    
        const cornerWidth = 0.2;
        const cornerHeight = 0.9;
    
        const cornerRects = [];
        const cornerPositions = [
            new BABYLON.Vector3(-3.05, cornerHeight / 2, 3.05),
            new BABYLON.Vector3(-3.05, cornerHeight / 2, -3.05),
            new BABYLON.Vector3(3.05, cornerHeight / 2, 3.05),
            new BABYLON.Vector3(3.05, cornerHeight / 2, -3.05)
        ];
    
        for (const position of cornerPositions) {
            const corner = BABYLON.MeshBuilder.CreateBox('corner', { width: cornerWidth, height: cornerHeight, depth: cornerWidth }, scene);
            corner.material = cornerMat;
            corner.position = position;
            cornerRects.push(corner);
        }
    
        cornerRects[0].material = redCornerMat; // Typically, the red corner
        cornerRects[3].material = blueCornerMat; // Opposite corner is blue
    
        const sideCornerWidth = 0.1;
        const sideCornerHeight = 0.9;
    
        const sideCornerRects = [];
        const sideCornerPositions = [
            new BABYLON.Vector3(-3.7, sideCornerHeight / 2, 3.7),
            new BABYLON.Vector3(-3.7, sideCornerHeight / 2, -3.7),
            new BABYLON.Vector3(3.7, sideCornerHeight / 2, 3.7),
            new BABYLON.Vector3(3.7, sideCornerHeight / 2, -3.7)
        ];
    
        for (const position of sideCornerPositions) {
            const corner = BABYLON.MeshBuilder.CreateBox('corner', { width: sideCornerWidth, height: sideCornerHeight, depth: sideCornerWidth }, scene);
            corner.material = cornerMat;
            corner.position = position;
            sideCornerRects.push(corner);
        }
    
        sideCornerRects[0].material = redCornerMat; // Side connected to the red corner
        sideCornerRects[3].material = blueCornerMat; // Side connected to the blue corner
        // Ropes
        const blueRopeMat = new BABYLON.StandardMaterial('blueRopeMat', scene);
        blueRopeMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Blue color for ropes
    
        const redRopeMat = new BABYLON.StandardMaterial('redRopeMat', scene);
        redRopeMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5); // Red color for ropes
    
        // Ropes
        const ropeRadius = 0.03;
        const ropeHeights = [0.2, 0.4, 0.6, 0.8]; // Heights for the four ropes
    
        // Function to create ropes with alternating colors
        const createRopes = (heights, radius) => {
            heights.forEach((height, index) => {
                var ropeColor;
                switch (index) {
                    case 0: ropeColor = groundMat;
                        break;
                    case 1: ropeColor = blueRopeMat;
                        break;
                    case 2: ropeColor = groundMat;
                        break;
                    case 3: ropeColor = redRopeMat;
                        break;
                }
                if (index % 2 === 0) { ropeColor = groundMat; }
                const ropePoints = [
                    new BABYLON.Vector3(-3.05, height, 3.05),
                    new BABYLON.Vector3(3.05, height, 3.05),
                    new BABYLON.Vector3(3.05, height, -3.05),
                    new BABYLON.Vector3(-3.05, height, -3.05),
                    new BABYLON.Vector3(-3.05, height, 3.05) // Closing the loop
                ];
    
                const rope = BABYLON.MeshBuilder.CreateTube(`rope-${index}`, {
                    path: ropePoints,
                    radius: radius,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                    updatable: false // No need to be updatable unless it will change during runtime
                }, scene);
                rope.material = ropeColor;
            });
        };
    
        createRopes(ropeHeights, ropeRadius);
    
        const ropeMat = new BABYLON.StandardMaterial('ropeMat', scene);
    
        const sideRopes = [];
        for (const height of ropeHeights) {
            const ropePoints = [
                [
                    new BABYLON.Vector3(-3.05, height, 3.05),
                    new BABYLON.Vector3(-3.7, height, 3.7)
                ],
                [
                    new BABYLON.Vector3(3.05, height, 3.05),
                    new BABYLON.Vector3(3.7, height, 3.7)
                ],
                [
                    new BABYLON.Vector3(3.05, height, -3.05),
                    new BABYLON.Vector3(3.7, height, -3.7)
                ],
                [
                    new BABYLON.Vector3(-3.05, height, -3.05),
                    new BABYLON.Vector3(-3.7, height, -3.7)
                ]
    
            ];
    
            for (const points of ropePoints) {
                const rope = BABYLON.MeshBuilder.CreateTube('rope', {
                    path: points,
                    radius: ropeRadius,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                    updatable: true
                }, scene);
                rope.material = ropeMat;
                sideRopes.push(rope);
            }
        }*/

    BABYLON.SceneLoader.ImportMesh("", "/assets/models/", "scene.gltf", scene, function (newMeshes, particleSystems, skeletons) {
    }
    );
    //Creating Stands on all four sides of the ring

    // Constants for the stands
    const standMat = new BABYLON.StandardMaterial('standMat', scene);
    standMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Grey color for stands

    const standDepth = 2; // Depth of each stand
    const standWidth = 2; // Width of each stand
    const standHeight = 0.3; // Height of each stand row
    const numberOfRows = 5; // Number of rows in the stand
    const standSpacing = 0.4; // Spacing between each stand
    const baseDistanceFromRing = 12; // Base distance from the edge of the ring to the first row of stands
    const distanceIncrement = 1; // Additional distance each higher row is from the ring compared to the one below

    // Function to create a single row of stands
    const createStand = (xPosition, yPosition, zPosition) => {
        const stand = BABYLON.MeshBuilder.CreateBox('stand', {
            width: standWidth,
            height: standHeight,
            depth: standDepth
        }, scene);

        stand.position = new BABYLON.Vector3(xPosition, yPosition, zPosition);
        stand.material = standMat;

        return stand; // Return the created stand
    };

    // Create stands on all four sides of the ring
    for (let i = 0; i < numberOfRows; i++) {
        const yPosition = standHeight / 2 + (i * (standHeight + standSpacing) - 1.7);
        const rowOffset = i * distanceIncrement;

        // Front and back stands
        for (let j = -2; j <= 2; j++) {
            if (j === 0) continue; // Skip the middle stand for an aisle

            const xPosition = j * (standWidth + standSpacing);
            const zFront = baseDistanceFromRing + standDepth / 2 + rowOffset;
            const zBack = -baseDistanceFromRing - standDepth / 2 - rowOffset;

            // Create front stand
            createStand(xPosition, yPosition, zFront);

            // Create back stand
            createStand(xPosition, yPosition, zBack);
        }

        // Side stands
        for (let j = -2; j <= 2; j++) {
            if (j === 0) continue; // Skip the middle stand for an aisle

            const zPosition = j * (standWidth + standSpacing); // Adjust z position for side stands
            const xLeft = -baseDistanceFromRing - standDepth / 2 - rowOffset;
            const xRight = baseDistanceFromRing + standDepth / 2 + rowOffset;

            // Create left side stand
            const leftStand = createStand(xLeft, yPosition, zPosition);
            leftStand.rotation.y = Math.PI / 2; // Rotate to face the ring

            // Create right side stand
            const rightStand = createStand(xRight, yPosition, zPosition);
            rightStand.rotation.y = -Math.PI / 2; // Rotate to face the ring
        }
    }



    // Create a ring


    return scene;
};

//const scene = createScene();
export function createDummy(scene) {
    BABYLON.SceneLoader.ImportMesh("", "/assets/models/", "dummy2.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        var skeleton = skeletons[0];

        shadowGenerator.addShadowCaster(scene.meshes[0], true);
        for (var index = 0; index < newMeshes.length; index++) {
            newMeshes[index].receiveShadows = false;;
        }

        var helper = scene.createDefaultEnvironment({
            enableGroundShadow: true
        });
        helper.setMainColor(BABYLON.Color3.Gray());
        helper.ground.position.y += 0.01;

        var idleAnim = scene.beginWeightedAnimation(skeleton, 0, 89, 1.0, true);
        var walkAnim = scene.beginWeightedAnimation(skeleton, 90, 118, 0, true);
        var runAnim = scene.beginWeightedAnimation(skeleton, 119, 135, 0, true);

        // UI
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var UiPanel = new BABYLON.GUI.StackPanel();
        UiPanel.width = "220px";
        UiPanel.fontSize = "14px";
        UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(UiPanel);
        var params = [
            { name: "Idle", anim: idleAnim },
            { name: "Walk", anim: walkAnim },
            { name: "Run", anim: runAnim }
        ]
        params.forEach((param) => {
            var header = new BABYLON.GUI.TextBlock();
            header.text = param.name + ":" + param.anim.weight.toFixed(2);
            header.height = "40px";
            header.color = "green";
            header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            header.paddingTop = "10px";
            UiPanel.addControl(header);
            var slider = new BABYLON.GUI.Slider();
            slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            slider.minimum = 0;
            slider.maximum = 1;
            slider.color = "green";
            slider.value = param.anim.weight;
            slider.height = "20px";
            slider.width = "205px";
            UiPanel.addControl(slider);
            slider.onValueChangedObservable.add((v) => {
                param.anim.weight = v;
                header.text = param.name + ":" + param.anim.weight.toFixed(2);
            })
            param.anim._slider = slider;
        });

        var button = BABYLON.GUI.Button.CreateSimpleButton("but0", "From idle to walk");
        button.paddingTop = "10px";
        button.width = "100px";
        button.height = "50px";
        button.color = "white";
        button.background = "green";
        button.onPointerDownObservable.add(function () {
            idleAnim._slider.value = 1.0;
            walkAnim._slider.value = 0;
            runAnim._slider.value = 0.0;
            // Synchronize animations
            walkAnim.syncWith(null);
            idleAnim.syncWith(walkAnim);
            let obs = scene.onBeforeAnimationsObservable.add(function () {
                idleAnim._slider.value -= 0.01;

                if (idleAnim._slider.value <= 0) {
                    scene.onBeforeAnimationsObservable.remove(obs);
                    idleAnim._slider.value = 0;
                    walkAnim._slider.value = 1.0;
                } else {
                    walkAnim._slider.value = 1.0 - idleAnim._slider.value;
                }
            })
        });
        UiPanel.addControl(button);

        button = BABYLON.GUI.Button.CreateSimpleButton("but0", "From walk to run");
        button.paddingTop = "10px";
        button.width = "100px";
        button.height = "50px";
        button.color = "white";
        button.background = "green";
        button.onPointerDownObservable.add(function () {
            walkAnim._slider.value = 1.0;
            idleAnim._slider.value = 0;
            runAnim._slider.value = 0.0;
            // Synchronize animations
            walkAnim.syncWith(runAnim);
            let obs = scene.onBeforeAnimationsObservable.add(function () {
                walkAnim._slider.value -= 0.01;

                if (walkAnim._slider.value <= 0) {
                    scene.onBeforeAnimationsObservable.remove(obs);
                    walkAnim._slider.value = 0;
                    runAnim._slider.value = 1.0;
                } else {
                    runAnim._slider.value = 1.0 - walkAnim._slider.value;
                }
            })
        });
        UiPanel.addControl(button);

        engine.hideLoadingUI();
    }, function (evt) {
    });

}



