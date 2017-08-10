import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "../objects/object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";
import { PlanarImage } from "../media/planar_image";



export class Scene42D extends SceneObject {
    normalchart: any;
    recallChart: any;
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
      
        this.recallChart = PlanarImage(omni, "studyData/img/PlanetARecall.jpg");
        var center = new allofwutils.Vector3(
                 Math.sin(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180),
                Math.sin(0 * Math.PI / 180),
                Math.cos(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180)
            ).normalize().scale(3);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();
        this.recallChart.setLocation(center, ex, ey, 5);

       this.normalchart = PlanarImage(omni, "studyData/img/PlanetA.jpg");
        var center = new allofwutils.Vector3(
                 Math.sin(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180),
                Math.sin(0 * Math.PI / 180),
                Math.cos(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180)
            ).normalize().scale(3);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();
        this.normalchart.setLocation(center, ex, ey, 5);


    }
    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        if(this.time - this.time_start > 30) {
         this.normalchart.render();
        }else{
            
        this.recallChart.render();
        }
        GL.depthMask(GL.FALSE);
       
        GL.depthMask(GL.TRUE);
         
    }

    public frame(): void {
       
    }
}

