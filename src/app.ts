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


    private panoramaVideoPlayer: any;
    private planarVideoPlayer: any;

    private smoke: any;
    private coastlines: any;
    private steam: PlanetSteam;
    private standart: StandartView;


    private currentVisualisation: any;
    private currentScene: any;


    private time: number;
    private currentYear: number;
    private visualisationTime: number;
    public data: any;

    private current_media: any;


    constructor(app: IRendererRuntime) {
        this.app = app;

        //init default Values
        this.config = yaml.load(fs.readFileSync("config.yaml", "utf-8")) as IConfig;
        this.currentYear = 1980;
        this.time = 0;

        //set navigation Mode
        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }

        //load default world
        this.world = new OBJMeshObject(app.omni, "./3DModels/earth/earth.obj", { flipX: true });
        this.world.pose.position = new Vector3(0, 0, 0);
        this.world.pose.scale = 0.02;
        // this.currentScene = this.world;
        this.current_media = {};
        this.currentScene = PanoramaImage(this.app.omni, "preprocessed/earth.jpg")

        this.app.networking.on("time", (t: number) => {
            this.time = t;
        });
        this.app.networking.on("year", (y: number) => {
            this.currentYear = y;
        });
        this.app.networking.on("media/show", (media: JSON) => {
            this.loadVisualisation(media);
        });
        this.app.networking.on("media/hide", (media: JSON) => {
            this.hideVisualisation(media);
        });

        //stop All Visualisation
        this.app.networking.on("stop", () => {
            this.currentVisualisation = [];
            this.currentScene = [];
            this.data = null;
        });
    }



    public loadVisualisation(media: any) {
        var key = media.type;
        if (this.current_media[key]) return;

        if (media.type == 'simulation_steam') {
            this.data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/emissionByCountry.csv", "utf-8"));
            var media: any = {
                object: new PlanetSteam(this.app.window, this.app.omni, this.data)
            }
            this.current_media[key] = media;
        }
        if (media.type == 'simulation_standart') {
            var media: any = {
                object: new StandartView(this.app.window, this.app.omni)
            }
            this.current_media['simulation_standart'] = media;
        }

        if (media.type == 'simulation_smoke') {
            var media: any = {
                object: PlantsSmoke(this.app.omni)
            }
            this.current_media[media.type] = media;
        }
        if (media.type == 'sphere_coastlines') {
            this.currentScene = Coastlines(this.app.omni);
        }
        if (media.type == 'panoramic-video') {
            //   this.panoramaVideoPlayer = PanoramaVideoPlayer(this.app.omni, media.filename, media.fps, stereo_mode)
        }
        if (media.type == 'video') {
            //    
        }
    }


    public hideVisualisation(media: any) {
        var key = media.type;
        if (!this.current_media[key]) return;
        delete this.current_media[key];
        // if (key == 'simulation_steam') {
        //     delete this.current_media[key];
        //     console.log(this.current_media)
        // }
        // if (key == 'simulation_standart') {
        //     delete this.current_media[key];
        // }

        // if (media.type == 'simulation_smoke') {
        //     this.smoke = null;

        // }
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
        if (this.currentScene != null) {
            this.currentScene.frame && this.currentScene.frame();
        }

        for (let v_key in this.current_media) {
            var visu: any = this.current_media[v_key]
            visu.object.setTime && visu.object.setTime(this.time);
            visu.object.setYear && visu.object.setYear(this.currentYear);
            visu.object.frame && visu.object.frame();
        }



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

        if (this.currentScene != null) {
            this.currentScene.render();
        }

        for (let v_key in this.current_media) {
            var visu: any = this.current_media[v_key]
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
            console.log("scene/set", scene_id)
            // Receive a message from the web interface, tell the renderers to switch scene.
            // app.networking.broadcast("scene/set", scene_id);
            // app.networking.broadcast("scene/start", this.GetCurrentTime() + 0.1);
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
export let renderer = StudyScene;
