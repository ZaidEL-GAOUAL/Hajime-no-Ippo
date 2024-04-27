import { GamepadManager, KeyboardEventTypes, Scalar, Vector2, Vector3 } from "@babylonjs/core";
import { GlobalManager } from './GlobalManager';

class InputController {
    #gamepadManager;
    #axisP1 = new Vector2(0, 0);
    #bGamePadConnected = false;
    inputMap = {};
    actions = {};

    static get instance() {
        return (globalThis[Symbol.for(`PF_${InputController.name}`)] ||= new this());
    }

    constructor() {
        this.actionMap = {
            moveForward: ["ArrowUp", "KeyZ"],
            moveBackward: ["ArrowDown", "KeyS"],
            moveLeft: ["ArrowLeft", "KeyA"],
            moveRight: ["ArrowRight", "KeyD"],
            punch: ["KeyP"],
            guard: ["KeyG"]
            // Add more actions as needed
        };
        this.activeActions = new Set();
    }

    init() {

        this.#gamepadManager = new GamepadManager();

        GlobalManager.scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    //console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    //console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                    break;
            }
        });

        this.#gamepadManager.onGamepadConnectedObservable.add((gamepad, state) => {
            console.log("Connected: " + gamepad.id);
            this.bGamePadConnected = true;

            gamepad.onButtonDownObservable.add((button, state) => {
                //Button has been pressed
                this.actions["Space"] = true;
                console.log(button + " pressed");
            });
            gamepad.onButtonUpObservable.add((button, state) => {
                console.log(button + " released");
            });
            gamepad.onleftstickchanged((values) => {
                //Left stick has been moved
                //console.log("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3));

                this.#axisP1.x = values.x.toFixed(3);
                this.#axisP1.y = -values.y.toFixed(3);
            });

            gamepad.onrightstickchanged((values) => {
                //console.log("x:" + values.x.toFixed(3) + " y:" + values.y.toFixed(3));
            });
        });

        this.#gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state) => {
            console.log("Disconnected: " + gamepad.id);
            this.bGamePadConnected = false;
        });

    }

    update() {
        // Update activeActions based on the current state of inputMap
        for (const [action, keys] of Object.entries(this.actionMap)) {
            for (const key of keys) {
                if (this.inputMap[key]) {
                    this.activeActions.add(action);
                    break; // If any of the keys for the action is pressed, activate the action
                }
            }
        }
    }

    isActionActive(action) {
        return this.activeActions.has(action);
    }

    resetActions() {
        this.activeActions.clear();
    }

    getAxisVectorP1() {
        return this.#axisP1;
    }
}

const { instance } = InputController;
export { instance as InputController };
