import * as fs from "fs";
import * as zmq from "zmq";
import * as yaml from "js-yaml";
import * as repl from "repl";

import { GL3 as GL } from "allofw"; //http://localhost:10800/
import { IRendererRuntime, WindowNavigation, Vector3, Quaternion, Pose, ISimulatorRuntime } from "allofw-utils";

import { SceneObject, OBJMeshObject, Matterport3DModel, FOVBlockerObject } from "./objects/objects";
import { Logger } from "./logger";

import { PlantsSmoke } from "./objects/smoke";

// Import utility functions
import { randomRange, slerp, slerpDistance } from "./utils";

import { PlanetSteam } from "./objects/steam";

// The schema of the "config.yaml" file
export interface IConfig {
    // Specify the scene to use
    scene: string;
    // Specify participant ID
    participantID: string;

    // Specify condition
    condition: string;
    // Specify phases
    randomizePhases: string[];
}

//variables for the study
let currentID = 1;
let targetHeight = 1.65;
let duration = 60;

export class StudyScene {
    private app: IRendererRuntime;

    private nav: WindowNavigation;

    private world: SceneObject;
    private targetObject: OBJMeshObject;
    private targetObjectBaseRotation: Quaternion;
    private originObject: OBJMeshObject;

    private headPose: Pose;

    private config: IConfig;
    private logger: Logger;


    private soundSocket: zmq.Socket;

    private imageModels: { name: string, model: OBJMeshObject }[];
    private imageModelCurrent: number;
    private imageModelTSwitch: number;


    private smoke: any;
    private steam: PlanetSteam;

    private time: number;
    private visualisationTime: number;


    constructor(app: IRendererRuntime) {
        this.app = app;

        this.config = yaml.load(fs.readFileSync("config.yaml", "utf-8")) as IConfig;

        //   this.logger = new Logger(`logs/${this.config.participantID}.${this.config.condition}.log`, true);

        switch (this.config.scene) {
            case "world": {
                this.world = new OBJMeshObject(app.omni, "./3DModels/earth/earth.obj", { flipX: true });
                // this.room.pose.rotation = Quaternion.Rotation(new Vector3(1, 0, 0), -Math.PI / 2);

                this.world.pose.position = new Vector3(0, 0, 0);
                this.world.pose.scale = 0.02;
            } break;
        }
        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }

        //   this.smoke = PlantsSmoke(app.omni);

        this.steam = new PlanetSteam(app.window, app.omni);

        this.time = 0;

        this.app.networking.on("time", (t: number) => {
            this.time = t;
        });
    }


    public isRunningInVR() {
        return (this.app.config as any).OpenVR == true;
    }


    public frame() {
        if (this.isRunningInVR()) {
            let p = this.app.omni.getHeadPose();
            let headPosition = new Vector3(p[0], p[1], p[2]);
            let headOrientation = new Quaternion(new Vector3(p[3], p[4], p[5]), p[6]).normalize();
            this.headPose = new Pose(headPosition, headOrientation);
            this.nav.update();
        } else {
            this.nav.update();
            this.headPose = this.nav.pose;
        }

        //   this.smoke.setTime(this.time, 0);

        this.steam.setTime(this.time);
        this.steam.frame();
        this.world.frame();
    }

    public onClick() {
    }

    public render() {
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
        GL.enable(GL.DEPTH_TEST);
        this.world.render();

        //  this.smoke.render();
        this.steam.render();

        // console.log(GL.getError());

        GL.disable(GL.BLEND);

        GL.activeTexture(GL.TEXTURE0);
        GL.disable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }
}

export class Simulator {
    tStart: number;
    isRunning: boolean;
    app: ISimulatorRuntime;

    constructor(app: ISimulatorRuntime) {
        this.app = app;
        this.isRunning = false;

        this.tStart = new Date().getTime() / 1000;
        setInterval(() => {
            if (this.isRunning) {
                this.app.networking.broadcast("time", (new Date().getTime() / 1000 - this.tStart));
            }

        }, 5);

        app.server.on("start", () => {
            this.tStart = new Date().getTime() / 1000;
            this.isRunning = true;
            console.log("start");
        });
        app.server.on("stop", () => {
            this.isRunning = false;
            this.app.networking.broadcast("time", 0);
            console.log("stop");
        });

        app.server.rpc("test", (a: number, b: number) => {
            return a + b;
        })

        setInterval(() => {
            app.server.broadcast("hello");
        }, 1000);

    }
}

export let simulator = Simulator;
export let renderer = StudyScene;
