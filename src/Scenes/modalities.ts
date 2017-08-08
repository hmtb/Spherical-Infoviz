import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "../objects/object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";
import { PanoramaImage } from "../media/panorama_image";
import { PlanetSteam } from "../objects/steam";
import { PlanetSpikes } from "../objects/spikes";
import { PlantsSmoke } from "../objects/smoke";
import { Bars } from "../objects/Bars";



export class Modalities extends SceneObject {
    bars: Bars;
    smoke: any;
    spikes: any;
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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number,color:boolean) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];

        this.currentPanorama = PanoramaImage(omni, "studyData/img/earth.jpg");

        var dataSpikes = require("d3").csv.parse(require("fs").readFileSync("preprocessed/data/AllPowerPlantsv1.csv", "utf-8"));
        this.spikes = PlanetSpikes(omni, dataSpikes);
        var dataSmoke = require("d3").csv.parse(require("fs").readFileSync("preprocessed/data/plants_data_50.csv", "utf-8"));
        this.smoke = PlantsSmoke(omni, dataSmoke);
        var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/data/AllPowerPlantsv1.csv", "utf-8"));
        this.bars = new Bars(window, omni, startTime,data, color);



    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        this.currentPanorama.render();
        this.spikes.render();
        this.smoke.render();
        this.bars.render();
        GL.depthMask(GL.FALSE);

        GL.depthMask(GL.TRUE);

    }

    public frame(): void {
         this.smoke.setTime(this.time)
    }
}

