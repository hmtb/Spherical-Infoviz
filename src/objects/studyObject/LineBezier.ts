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



export class LineBezier extends SceneObject {
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
        this.currentPanorama = PanoramaImage(omni, "studyData/img/earth.jpg");
        var data = require("d3").csv.parse(require("fs").readFileSync("studyData/data/PowerPlants.csv", "utf-8"));

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
                let pStart = Vector3(cx, cy, cz);
                let pStartHelp = Vector3(cx, cy+3, cz)* 0.8;
                let pEnd = Vector3(cy, cx, cz);
                let pEndHelp = Vector3(cy, cx+3, cz)* 0.8; 


                let w = 0.02;
                let color = Color(1, 1, 1, 1);
                let up = Vector3(0, 1, 0);
                //p1
                let normalp1 = normalize(pStart);
                let eXp1 = normalize(cross(normalp1, up))* (w/2);
                let eYp1 = normalize(cross(normalp1, eXp1))* (w/2);
                let normalp2 = normalize(pEnd);
                let eXp2 = normalize(cross(normalp2, up))* (w/2);
                let eYp2 = normalize(cross(normalp2, eXp2))*(w/2);
              

                for(i in 1..10){

                      let t = (i-1)/10;
                      let tnew = i/10;

                      let p1 = ((1-t)*(1-t)*(1-t))*pStart+ 3*((1-t)*(1-t))*t*pStartHelp + 3*(1-t)*t*t*pEndHelp + t*t*t*pEnd;

                      let p2 =((1-tnew)*(1-tnew)*(1-tnew))*pStart+ 3*((1-tnew)*(1-tnew))*tnew*pStartHelp + 3*(1-tnew)*tnew*tnew*pEndHelp + tnew*tnew*tnew*pEnd ;


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
        this.currentPanorama.render();
        GL.depthMask(GL.FALSE);
        this.text.render(this.omni);
       
        GL.depthMask(GL.TRUE);
        
          this.cubes.render();
    }

    public frame(): void {
       
    }
}

