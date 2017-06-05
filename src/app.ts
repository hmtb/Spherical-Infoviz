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

import { StandartView } from "./objects/standart";

import { Coastlines } from "./panorama/coastlines";
import { PanoramaImage } from "./panorama/panorama_image";
import { PlanarVideoPlayer } from "./media/planar_video_player";

import { MyNavigator } from "./navigator";

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

export class MainScene {
    private app: IRendererRuntime;

    private nav: WindowNavigation;

    private headPose: Pose;
    private config: IConfig;
    private logger: Logger;
    private soundSocket: zmq.Socket;

    //SceneObjects
    private currentPanorama: any;
    private currentVisu: any;

    //Global Vars
    private time: number;
    private currentYear: number;

    private navigator: MyNavigator;


    constructor(app: IRendererRuntime) {
        this.app = app;

        //init default Values
        this.config = yaml.load(fs.readFileSync("config.yaml", "utf-8")) as IConfig;
        this.currentYear = 1980;
        this.time = 0;
        this.currentVisu = {};
        this.currentPanorama = PanoramaImage(this.app.omni, "preprocessed/earth.jpg")
        this.navigator = new MyNavigator(this.app, this.currentVisu)



        //set navigation Mode
        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }


        //Navigaton
        this.app.networking.on("media/show", (media: any) => {
            if (media.type == 'visu')
                this.navigator.loadVisualisation(media);
            if (media.type == 'panorama') {
                this.currentPanorama = this.navigator.loadPanorama(media);
            }
        });
        this.app.networking.on("media/hide", (media: any) => {
            if (media.type == 'visu')
                this.navigator.hideVisualisation(media);
            if (media.type == 'panorama')
                this.currentPanorama = null;
        });
        //stop All Visualisation
        this.app.networking.on("stop", () => {
            this.currentVisu = [];
            this.currentPanorama = [];
        });

        //updateCall
        this.app.networking.on("time", (t: number) => {
            this.time = t;
        });
        this.app.networking.on("year", (y: number) => {
            this.currentYear = y;
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
        //update Panorama if available
        if (this.currentPanorama != null) {
            this.currentPanorama.frame && this.currentPanorama.frame();
        }

        //update current Visualisation Objects
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            visu.object.setTime && visu.object.setTime(this.time);
            visu.object.setYear && visu.object.setYear(this.currentYear);
            visu.object.frame && visu.object.frame();
        }
    }


    public render() {
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
        GL.enable(GL.DEPTH_TEST);

        //render Panorama
        if (this.currentPanorama != null) {
            this.currentPanorama.render();
        }

        //render Visualisations
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            visu.object.render && visu.object.render();
        }


        GL.disable(GL.BLEND);
        GL.activeTexture(GL.TEXTURE0);
        GL.disable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }
}

export class Simulator {
    tStart: number;
    time: number;
    isRunning: boolean;
    app: ISimulatorRuntime;

    constructor(app: ISimulatorRuntime) {
        this.app = app;
        this.isRunning = false;
        setInterval(() => {
            this.app.networking.broadcast("time", (new Date().getTime() / 1000));
        }, 5);

        app.server.on("year", (year: number) => {
            this.app.networking.broadcast("year", year);
        });

        app.server.on("scene/set", function (scene_id: string) {
        });

        app.server.on("media/show", (media: JSON) => {
            console.log("media/show", media);
            this.app.networking.broadcast("media/show", media);
        });

        app.server.on("media/hide", (media: JSON) => {
            //  console.log("media/hide", media);
            this.app.networking.broadcast("media/hide", media);
        });


    }
}



export let simulator = Simulator;
export let renderer = MainScene;
