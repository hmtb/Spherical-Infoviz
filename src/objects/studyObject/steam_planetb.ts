import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "../object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";
import { PanoramaImage } from "../../media/panorama_image";
import { PlanetSteam } from "../steam";



export class Steam_PlanetB extends SceneObject {
    powerPlants: any;
    currentPanorama: any;
    instant = false;
    year: any;


    private texts: any;
    private time: number;

    private dataBuffer: any[];

    private text: any;
    private timer: number;
    private time_start: number;
    private platform: StardustAllofw.AllofwPlatform3D;
    private cubeSpec: Stardust.Specification.Mark;
    private intens: number;
    first = true;
    frameCount = 0;
    private currentText: any[];
    private newText: any[];
    private transit = false;
    private switch = false;
    private cubes: Stardust.Mark;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number,size:number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];
        var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/data/emissionByCountry.csv", "utf-8"));
        this.currentPanorama = PanoramaImage(omni, "studyData/img/PlanetB.png");
        this.powerPlants = new PlanetSteam(window, omni, data, startTime);


    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
       this.currentPanorama.render();
       this.powerPlants.render();
        GL.depthMask(GL.FALSE);
       
        GL.depthMask(GL.TRUE);
         
    }

    public frame(): void {
        this.powerPlants.setTime(this.time);
        this.powerPlants.frame();
    }
}

