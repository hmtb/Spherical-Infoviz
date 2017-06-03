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
    private currentVisualisation: SceneObject;

    private time: number;
    private currentYear: number;
    private visualisationTime: number;
    public data: any;


    constructor(app: IRendererRuntime) {
        this.app = app;

        this.config = yaml.load(fs.readFileSync("config.yaml", "utf-8")) as IConfig;
        this.world = new OBJMeshObject(app.omni, "./3DModels/earth/earth.obj", { flipX: true });
        this.world.pose.position = new Vector3(0, 0, 0);
        this.world.pose.scale = 0.02;
        this.currentYear = 1990;


        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }

        //   this.smoke = PlantsSmoke(app.omni);

        this.time = 0;
        this.app.networking.on("time", (t: number) => {
            this.time = t;
        });
        this.app.networking.on("year", (y: number) => {
            this.currentYear = y;
        });
        this.app.networking.on("load", (city: number, modality: string) => {
            this.loadVisualisation(city, modality);
        });

        //stop Current Visualisation
        this.app.networking.on("stop", () => {
            this.currentVisualisation = null;
            this.data = null;
        });



    }

    public loadVisualisation(city: number, modality: string) {
        if (modality == 'immense') {
            switch (city) {
                case 1:
                    this.data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/emissionByCountry.csv", "utf-8"));
                    this.currentVisualisation = new PlanetSteam(this.app.window, this.app.omni, this.data);
                    break;
                case 2:
                    this.currentVisualisation = null;
            }
        }
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

        //render only if there is a current visualisation selected
        if (this.currentVisualisation != null) {
            this.currentVisualisation.setTime(this.time);
            this.currentVisualisation.frame();
            this.currentVisualisation.setYear(this.currentYear);
        }


        this.world.frame();
    }

    public onClick() {
    }

    public setData(data: any) {
        this.data = data;
    }

    public render() {
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
        GL.enable(GL.DEPTH_TEST);
        this.world.render();

        //render only if there is a current visualisation selected
        if (this.currentVisualisation != null) {
            this.currentVisualisation.render();
        }


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
            this.app.networking.broadcast("time", (new Date().getTime() / 1000 - this.tStart));
        }, 5);

        app.server.on("start", (cityNumber: number, modality: string) => {
            console.log("start", cityNumber, modality);
            //broadcast needed Data
            this.app.networking.broadcast("load", cityNumber, modality);
            //set Timer
            this.tStart = new Date().getTime() / 1000;
        });

        app.server.on("stop", () => {
            this.app.networking.broadcast("stop");
            console.log("stop");
        });

        app.server.on("year", (year: number) => {
            this.app.networking.broadcast("year", year);
        });




        // app.server.rpc("test", (a: number, b: number) => {
        //     return a + b;
        // })
        // setInterval(() => {
        //     app.server.broadcast("hello");
        // }, 1000);

    }
}

export let simulator = Simulator;
export let renderer = StudyScene;
