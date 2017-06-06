import * as fs from "fs";
import * as zmq from "zmq";
import * as yaml from "js-yaml";
import * as repl from "repl";

import { GL3 as GL } from "allofw"; //http://localhost:10800/
import { IRendererRuntime, WindowNavigation, Vector3, Quaternion, Pose, ISimulatorRuntime } from "allofw-utils";
import { Logger } from "./logger";
import { PanoramaImage } from "./media/panorama_image";
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
    private time_diff: number;
    private time_start: number;
    private currentYear: number;

    private navigator: MyNavigator;


    constructor(app: IRendererRuntime) {
        this.app = app;

        //init default Values
        this.config = yaml.load(fs.readFileSync("config.yaml", "utf-8")) as IConfig;
        this.currentYear = 1980;
        this.time = 0;
        this.currentVisu = {};
        //     this.currentPanorama = PanoramaImage(this.app.omni, "preprocessed/earth.jpg")
        this.navigator = new MyNavigator(this.app, this.currentVisu)


        //set  Mode
        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }
        var rm = {
            BACKGROUND: 'background',
            INTERMEDIATE: 'intermediate',
            FOREGROUND: 'foreground'
        };

        var type = {
            PANORAMIC_VIDEO: 'panorama-video',
            PLANAR_VIDEO: 'planar-video',
            PANORAMIC_IMAGE: 'panorama-image'
        };

        //Navigaton
        this.app.networking.on("media/show", (media: any) => {
            this.navigator.loadVisualisation(media, this.GetCurrentTime());

        });

        this.app.networking.on("media/hide", (media: any) => {
            this.navigator.hideVisualisation(media);
        });

        //stop All Visualisation
        this.app.networking.on("stop", () => {
            this.currentVisu = [];
            this.currentPanorama = [];
        });

        //updateCall
        // this.app.networking.on("time", (t: number) => {
        //     this.time = t;
        // });

        this.time_diff = 0;
        this.time_start = 0;
        app.networking.on("time", (time: number) => {
            this.time_diff = time - new Date().getTime() / 1000;
        });


        this.app.networking.on("year", (y: number) => {
            this.currentYear = y;
        });

    }

    public GetCurrentTime = function () {
        return new Date().getTime() / 1000 + this.time_diff;
    };


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

        //REnderPipline

        //Background
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            visu.object.setTime && visu.object.setTime(this.GetCurrentTime());
            visu.object.setYear && visu.object.setYear(this.currentYear);
            visu.object.frame && visu.object.frame();
            //add objects function if nesecesry
        }

        //internmediate
        //Forground
        //update Panorama if available
        // if (this.currentPanorama) {
        //     this.currentPanorama.frame && this.currentPanorama.frame();
        //     this.currentPanorama.setTime && this.currentPanorama.setTime(this.GetCurrentTime());
        // }
    }


    public render() {
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
        GL.enable(GL.DEPTH_TEST);

        // //render Panorama
        // if (this.currentPanorama != null) {
        //     this.currentPanorama.render();
        // }

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


        app.server.on("year", (year: number) => {
            this.app.networking.broadcast("year", year);
        });

        app.server.on("scene/set", function (scene_id: string) {
        });

        app.server.on("media/show", (media: JSON) => {
            //console.log("media/show", media);
            this.app.networking.broadcast("media/show", media);
        });

        app.server.on("media/hide", (media: JSON) => {
            //  console.log("media/hide", media);
            this.app.networking.broadcast("media/hide", media);
        });

        var time_start = new Date().getTime() / 1000;
        var GetCurrentTime = function () {
            return new Date().getTime() / 1000 - time_start;
        };
        setInterval(() => {
            this.app.networking.broadcast("time", GetCurrentTime());
        }, 20);

    }
}



export let simulator = Simulator;
export let renderer = MainScene;
