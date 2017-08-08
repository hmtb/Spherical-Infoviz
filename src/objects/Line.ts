import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";
import { PanoramaImage } from "../media/panorama_image";



export class Line extends SceneObject {
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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number,data:any,size:number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];

         this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;
            import { Line } from P2D;
            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, val: float) {
              
                let size = 9.9;
                // all start at one point a bit randomised
                let cx = size *  sin(lon * PI/-180) * cos(lat * PI/180 );
                let cy = size *  sin(lat  * PI/180);
                let cz = size *  cos(lon * PI/-180) * cos(lat * PI/180 );

                //depending on t and speed the particle mooves on in the sphere
                let p1 = Vector3(cx, cy, cz);
                let p2 = Vector3(cy, cx, cz);
                let w = 0.01;
                let color = Color(1, 1, 1, 1);
                let up = Vector3(0, 1, 0);

                //p1
                let normalp1 = normalize(p1);
                let eXp1 = normalize(cross(normalp1, up))* (w/2);
                let eYp1 = normalize(cross(normalp1, eXp1))* (w/2);

                  let normalp2 = normalize(p2);
                let eXp2 = normalize(cross(normalp2, up))* (w/2);
                let eYp2 = normalize(cross(normalp2, eXp2))*(w/2);



                let width = 0.01;
                let d = normalize(p2 - p1);
                // let t = Vector3(d.y, -d.x) * (width / 2);
                emit [
                    { position: p1 + eXp1, color: color },
                    { position: p1 - eXp1, color: color },
                    { position: p2 + eXp2, color: color }
                ];
                emit [
                    { position: p1 - eXp1, color: color },
                    { position: p2 - eXp2, color: color },
                    { position: p2 + eXp2, color: color }
                ];
                emit [
                    { position: p1 + eYp1, color: color },
                    { position: p1 - eYp1, color: color },
                    { position: p2 + eYp2, color: color }
                ];
                emit [
                    { position: p1 - eYp1, color: color },
                    { position: p2 - eYp2, color: color },
                    { position: p2 + eYp2, color: color }
                ];

                    
            }
        `)["Mark"];



              
         for (let item of data) {
            this.currentText.push({
                            lon: item.lon,
                            lat: item.lat,
                            val: item.val,
                            name: item.name
                        })
         }


         let cubes = Stardust.mark.create(this.cubeSpec, this.platform);
         cubes.attr("lon", d => d.lon);
         cubes.attr("lat", d => d.lat );
-        cubes.data(this.currentText);
         this.cubes = cubes;

        this.text = shape3d.texts()
            .attr("vec3", "center", "9.8 * normalize(pos)")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(pos)")
            .attr("float", "scale", "0.006")
            .text((d: any) => (d.name))
            // Variables are bound to data.
            .variable("vec3", "pos", (d: any) => [
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin((d.lat-2) * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .compile(this.omni)
            .data(this.currentText);

    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        GL.depthMask(GL.FALSE);
        this.text.render(this.omni);
       
        GL.depthMask(GL.TRUE);
          this.cubes.render();
    }

    public frame(): void {
       
    }
}

