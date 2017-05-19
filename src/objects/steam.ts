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

    private dataBuffer: any[];

    private data: any;
    private dataText: any;
    private timer: number;
    private cubeSpec: Stardust.Specification.Mark;
    private platform: StardustAllofw.AllofwPlatform3D;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.timer = 0;
        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, random: float, t: float,spanTime: float, random2: float, speed: float) {

                let duration = 60;
                let size = 5;
                let cx = 0;
                let cy = 0;
                let cz = 0;
                let progress = (t%duration) - spanTime;


                 if(progress < 2){
                    cx = (size-progress/4) * sin(lon + random * 0.2) * cos(lat );
                    cy = (size-progress/4) * sin(lat + random * 0.2);
                    cz = (size-progress/4) * cos(lon + random * 0.2) * cos(lat );
                 } else if(progress < 16 ){
                    cx = (size-progress/4)* sin( lon + (progress-2)/2 + random * 0.2) * cos(lat);
                    cy = (size-progress/4)* sin(lat );
                    cz = (size-progress/4) * cos(lon + (progress-2)/2 + random * 0.2) * cos(lat); 
                 } else {
                    cx = 1 * sin( lon + (progress-2)/2 + random * 0.2) * cos(lat);
                    cy = 1 * sin(lat );
                    cz = 1 * cos(lon + (progress-2)/2 + random * 0.2) * cos(lat); 
                 }

                // let cubeTime = t-spanTime;
                // let size = 5;
                // Calculate cx, cy, cz for the cube

                 
                 let center = Vector3(cx, cy, cz);
                 let normal = normalize(center);
                 let up = Vector3(0, 1, 0);
                 let scale = 0.1 + 0.05 * random2;
                 let eX = normalize(cross(normal, up)) * scale;
                 let eY = normalize(cross(normal, eX)) * scale;
                 let alpha = 0.2;

                 emit [
                     { position: center, color: Color(1, 1, 1, alpha), normal: normal },
                     { position: center + eX + eY, color: Color(1, 1, 1, 0), normal: normal },
                     { position: center - eX + eY, color: Color(1, 1, 1, 0), normal: normal },

                     { position: center, color: Color(1, 1, 1, alpha), normal: normal },
                     { position: center - eX + eY, color: Color(1, 1, 1, 0), normal: normal },
                     { position: center - eX - eY, color: Color(1, 1, 1, 0), normal: normal },

                     { position: center, color: Color(1, 1, 1, alpha), normal: normal },
                     { position: center - eX - eY, color: Color(1, 1, 1, 0), normal: normal },
                     { position: center + eX - eY, color: Color(1, 1, 1, 0), normal: normal },

                     { position: center, color: Color(1, 1, 1, alpha), normal: normal },
                     { position: center + eX - eY, color: Color(1, 1, 1, 0), normal: normal },
                     { position: center + eX + eY, color: Color(1, 1, 1, 0), normal: normal }
                 ];

                //  Triangle(
                //      center + eX,
                //      center - eX * 0.5 + eY * 0.86602540378,
                //      center - eX * 0.5 - eY * 0.86602540378,
                //      Color(1, 1, 1, 0.2)
                // );



            }
        `)["Mark"];



        //get csv data
        this.data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/emissionByCountry2009.csv", "utf-8"));

        this.dataBuffer = [];
        for (let item of this.data) {
            for (let i = 0; i < 200; i++) {
                this.dataBuffer.push({
                    lon: item.lon,
                    lat: item.lat,
                    random: Math.random(),
                    random2: Math.random(),
                    speed: i,
                    spanTime: i
                })
            }

        }
        let cubes = Stardust.mark.create(this.cubeSpec, this.platform);
        cubes.attr("lon", d => d.lon * Math.PI / 180);
        cubes.attr("lat", d => d.lat * Math.PI / 180);
        cubes.attr("random", d => d.random);
        cubes.attr("random2", d => d.random2);
        cubes.attr("t", 0);
        cubes.attr("spanTime", d => d.spanTime);
        cubes.data(this.dataBuffer);
        this.cubes = cubes;


        this.dataText = require("d3").csv.parse(require("fs").readFileSync("preprocessed/emissionByCountry2009Top50.csv", "utf-8"));
        //text
        var maxlen = 4.0;
        var maxval = 1000; //13448000.13 //7710.5
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
            .variable("float", "len", (d: any) => (maxlen * Math.pow(d.val / maxval, 0.5)))
            .compile(omni)
            .data(this.dataText);
        this.texts = texts;
    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        GL.disable(GL.DEPTH_TEST);
        this.cubes.render();
        this.texts.render(this.omni);
        GL.enable(GL.DEPTH_TEST);
    }

    public frame(): void {

        this.cubes.attr("t", this.time);

    }

}

