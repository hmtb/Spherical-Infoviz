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
import { PlanarImage } from "../media/planar_image";



export class Chart2DC02 extends SceneObject {
    private time_start: number;
    private platform: StardustAllofw.AllofwPlatform3D;
   
    chartTemperatur: any;
    chartCarbon: any;
    private time: number;


   

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number,size:number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;

        this.chartCarbon = PlanarImage(omni, "studyData/img/C02.png");
        var center = new allofwutils.Vector3(
                 Math.sin(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180),
                Math.sin(0 * Math.PI / 180),
                Math.cos(180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180)
            ).normalize().scale(3);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();
        this.chartCarbon.setLocation(center, ex, ey, 5);

    }
    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        if(this.time - this.time_start > 60) return;
        this.chartCarbon.render();
        GL.depthMask(GL.FALSE);
        GL.depthMask(GL.TRUE);
    }

    public frame(): void {
       
    }
}

