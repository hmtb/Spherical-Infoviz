import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";
import { Text } from "./text";


export class PlanetSteamCity extends SceneObject {
    year: any;
    private text: any;
    private _program: GL.Program;
    private _vertexArray: GL.VertexArray;
    private _buffer: GL.Buffer;
    private _lightPosition: allofwutils.Vector3;
    private _lightColor: allofwutils.Vector3;
    private _flipX: boolean;


    public get lightPosition(): allofwutils.Vector3 { return this._lightPosition; }
    public set lightPosition(pos: allofwutils.Vector3) { this._lightPosition = pos; }

    public get lightColor(): allofwutils.Vector3 { return this._lightColor; }
    public set lightColor(pos: allofwutils.Vector3) { this._lightColor = pos; }

    private cubes: Stardust.Mark;
    private texts: any;
    private time: number;
    private currentYear: number;

    private dataBuffer: any[];

    private data: any;
    private dataText: any;
    private timer: number;
    private cubeSpec: Stardust.Specification.Mark;
    private platform: StardustAllofw.AllofwPlatform3D;
    private time_start: number;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, data: any, startTime: number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.timer = 0;
        this.time_start = startTime;
        this.currentYear = 2009;
        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, random: float,randomx: float,randomy: float, t: float,speed: float, position: float, rad: float) {
              
         

                //static variables
                let duration = 100;
                let minsize = 3+randomx;
                let tduration= t/3;
                let size = 5 - (position + tduration)%(6-rad);
                let spread = ((position + tduration)%(6-rad))*0.2;
                let spread2 = ((position + tduration)%(6-rad));
                let progress = (t*speed)%duration;
                
                
                // all start at one point a bit randomised
                let cx = size *  sin(lon * PI/-180) * cos(lat * PI/180 );
                let cy = size *  sin(lat  * PI/180);
                let cz = size *  cos(lon * PI/-180) * cos(lat * PI/180 );

                //depending on t and speed the particle mooves on in the sphere

                let center = Vector3(cx, cy, cz);
                let normal1 = normalize(center);
                let up1 = Vector3(0, 1, 0);
                let scale1 = random;
                let eX1 = normalize(cross(normal1, up1)) * (randomx*spread+(0.2*spread2*spread2));
                let eY1 = normalize(cross(normal1, eX1)) * randomy*spread;
                center = center + eX1 + eY1;
            
               

                 let normal = normalize(center);
                 let up = Vector3(0, 1, 0);
                 let scale = 0.01 + 0.05 * random;
                 let eX = normalize(cross(normal, up)) * scale;
                 let eY = normalize(cross(normal, eX)) * scale;
                 let alpha = 0.2;
                 let colorCenter = Color(1,1,1,alpha);
                 let colorEdge = Color(1,1,1,0);

                 emit [
                     { position: center, color: colorCenter, normal: normal },
                     { position: center + eX + eY, color: colorEdge, normal: normal },
                     { position: center - eX + eY, color: colorEdge, normal: normal },

                     { position: center, color: colorCenter, normal: normal },
                     { position: center - eX + eY, color: colorEdge, normal: normal },
                     { position: center - eX - eY, color: colorEdge, normal: normal },

                     { position: center, color: colorCenter, normal: normal },
                     { position: center - eX - eY, color: colorEdge, normal: normal },
                     { position: center + eX - eY, color: colorEdge, normal: normal },

                     { position: center, color: colorCenter, normal: normal },
                     { position: center + eX - eY, color: colorEdge, normal: normal },
                     { position: center + eX + eY, color: colorEdge, normal: normal }
                 ];

                //  Triangle(
                //      center + eX,
                //      center - eX * 0.5 + eY * 0.86602540378,
                //      center - eX * 0.5 - eY * 0.86602540378,
                //      Color(1, 1, 1, 0.2)
                // );
}
        `)["Mark"];





        this.dataBuffer = [];
        this.dataText = [];
        let highest: number = 0;
        let lowest: number = 1000000000;
        for (let item of data) {
            if (item.val > highest) highest = item.val;
            if (item.val < lowest) lowest = item.val;
        }
        console.log("highest " + highest);
        console.log("lowest " + lowest);



        for (let item of data) {
            let ilon: number = item.lon - ((Math.random() - 0.5));
            let ilat: number = item.lat - ((Math.random() - 0.5));
            let rad: number = this.mymap(item.val, lowest, highest, 5, 3)
            console.log("maxradius" + rad)
            for (let i = 0; i < item.val / 10; i++) {
                this.dataBuffer.push({
                    lon: ilon,
                    lat: ilat,
                    val: item.val,
                    random: Math.random(),
                    randomx: Math.random() - 0.5,
                    randomy: Math.random() - 0.5,
                    speed: Math.random() * 10,
                    position: Math.random() * 3,
                    rad: rad
                })
            }
        }
        let cubes = Stardust.mark.create(this.cubeSpec, this.platform);


        cubes.attr("lon", d => d.lon);
        cubes.attr("lat", d => d.lat);
        cubes.attr("random", d => d.random);
        cubes.attr("randomx", d => d.randomx);
        cubes.attr("randomy", d => d.randomy);
        cubes.attr("t", 0);
        cubes.attr("speed", d => d.speed);
        cubes.attr("position", d => d.position);
        cubes.attr("rad", d => d.rad);
        cubes.data(this.dataBuffer);
        // console.log(this.dataBuffer);
        this.cubes = cubes;


        this.year = new Text(window, omni, null, this.time_start);
    }

    public setTime(t: number) {
        this.time = t - this.time_start;
    }

    public mymap(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    private updateText(year: number) {

    }


    public render(): void {
        GL.depthMask(GL.FALSE);
        this.cubes.render();

        GL.depthMask(GL.TRUE);
        this.year.render();


    }

    public frame(): void {
        this.year.frame();
        this.cubes.attr("t", this.time);

    }

}

