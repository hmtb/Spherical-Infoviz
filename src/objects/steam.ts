import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";



export class PlanetSteam extends SceneObject {

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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, data: any) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.timer = 0;
        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, random: float, t: float,speed: float,year:float,currentYear:float) {
              
            


                if(year == currentYear){

                //static variables
                let duration = 100;
                let size = 6;

                
                // all start at one point a bit randomised
                let cx = size *  sin(lon * PI/-180) * cos(lat * PI/180 );
                let cy = size *  sin(lat  * PI/180);
                let cz = size *  cos(lon * PI/-180) * cos(lat * PI/180 );
                //depending on t and speed the particle mooves on in the sphere
                let progress = (t*speed)%duration;

                    //  cx = (size-progress/4) *  sin(lon * PI/-180) * cos(lat * PI/180 );
                    // cy = (size-progress/4) *  sin(lat  * PI/180);
                    // cz = (size-progress/4) *  cos(lon * PI/-180) * cos(lat * PI/180 );

                 if(progress < 2){
                    cx = (size-progress/4) *  sin(lon * PI/-180) * cos(lat * PI/180 );
                    cy = (size-progress/4) *  sin(lat  * PI/180);
                    cz = (size-progress/4) *  cos(lon * PI/-180) * cos(lat * PI/180 );
                 } else if(progress < 20 ){
                    cx = (size-progress/4)* sin(lon* PI/-180 + (progress-2)/20 ) * cos(lat * PI/180);
                    cy = (size-progress/4)* sin(lat  * PI/180);
                    cz = (size-progress/4) * cos(lon * PI/180 + (progress-2)/20 ) * cos(lat * PI/180); 
                 } else {
                    cx = (3)  * sin( lon* PI/-180 + (progress-2)/20 ) * cos(lat * PI/180 );
                    cy = (3)  * sin(lat   * PI/180);
                    cz = (3)  * cos(lon   * PI/180 + (progress-2)/20 ) * cos(lat * PI/180); 
                 }

               

                 
                 let center = Vector3(cx, cy, cz);
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
}
        `)["Mark"];





        this.dataBuffer = [];
        this.dataText = [];
        for (let item of data) {
            for (let i = 1980; i < 2010; i++) {
                let value: number = item[i.toString()];
                for (let y = 0; y < value; y++) {

                    let ilon: number = item.lon - ((Math.random() - 0.5));
                    let ilat: number = item.lat - ((Math.random() - 0.5));
                    this.dataBuffer.push({
                        lon: ilon,
                        lat: ilat,
                        random: Math.random(),
                        speed: Math.random() * 10,
                        year: i
                    })
                }
                let ilon: number = item.lon - ((Math.random() - 0.5));
                let ilat: number = item.lat - ((Math.random() - 0.5));
                this.dataText.push({
                    lon: ilon,
                    lat: ilat,
                    random: Math.random(),
                    speed: Math.random() * 10,
                    year: i,
                    val: value

                })
            }
        }
        let cubes = Stardust.mark.create(this.cubeSpec, this.platform);
        cubes.attr("lon", d => d.lon);
        cubes.attr("lat", d => d.lat);
        cubes.attr("random", d => d.random);
        cubes.attr("t", 0);
        cubes.attr("speed", d => d.speed);
        cubes.attr("year", d => d.year);
        cubes.attr("currentYear", 1990)
        cubes.data(this.dataBuffer);
        // console.log(this.dataBuffer);
        this.cubes = cubes;



    }

    public setTime(t: number) {
        this.time = t;
    }

    public setYear(y: number) {
        if (y == this.currentYear) return;
        this.currentYear = y;
        this.updateText(y);
    }

    private updateText(year: number) {

        var maxlen = 4.0;
        var maxval = 1000.00; //13448000.13 //7710.5


        let currentTextData = [];
        for (let item of this.dataText) {
            if (item.year == year && item.val != undefined) {
                currentTextData.push(item);
                if (item.val > maxval) {
                    maxval = Math.round(item.val);
                }
            }
        }
        console.log(maxval);

        var texts = shape3d.texts()
            //    .attr("vec3", "center", "5.0 * normalize(pos)")
            .attr("vec3", "center", "6.0 * normalize(pos)")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(pos)")
            .attr("float", "scale", "0.0005 * len")
            .text((d: any) => (d.val))
            // Variables are bound to data.
            .variable("vec3", "pos", (d: any) => [
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin(d.lat * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .variable("float", "len", (d: any) => (maxlen * Math.pow(Math.round(d.val) / (maxval / 10), 0.5)))
            .compile(this.omni)
            .data(currentTextData);
        this.texts = texts;
    }

    public render(): void {
        GL.depthMask(GL.FALSE);
        this.cubes.render();
        this.texts.render(this.omni);
        GL.depthMask(GL.TRUE);
    }

    public frame(): void {

        this.cubes.attr("t", this.time);

        this.cubes.attr("currentYear", this.currentYear);

    }

}

