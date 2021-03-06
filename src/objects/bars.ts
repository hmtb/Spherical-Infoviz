import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "../objects/object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";



export class Bars extends SceneObject {
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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number, data: any,color:boolean) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];

        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, val: float,r1:float,r2:float,r3:float,r4:float) {
              
                let size = 4.9;
                // all start at one point a bit randomised
                let cx = size *  sin(lon * PI/-180) * cos(lat * PI/180 );
                let cy = size *  sin(lat  * PI/180);
                let cz = size *  cos(lon * PI/-180) * cos(lat * PI/180 );

                //depending on t and speed the particle mooves on in the sphere
                //  Cube(Vector3(cx, cy, cz), 0.03, Color(1, 1, 1, 1));
                
                let w = 0.1;
                let l = val/9000000;
                let center = Vector3(cx, cy, cz);
              
                let normal = normalize(center);
                let up = Vector3(0, 1, 0);
                let eX = normalize(cross(normal, up))* w;
                let eY = normalize(cross(normal, eX))* w;
                let length = (normalize(Vector3(-cx,-cy,-cz))*-l )+ (eY*5);

                let radius = 0.04;
                let color = Color(r1, r2, r3, r4);

                let p000 = center;
                let p001 = center+ eX + eY;
                let p010 = center+ eX;
                let p011 = center+ eY;
                let p100 = center - length;
                let p101 = center - length+ eX + eY;
                let p110 = center -length+ eX ;
                let p111 = center -length+  eY;
                let nx = Vector3(1, 0, 0);
                let ny = Vector3(0, 1, 0);
                let nz = Vector3(0, 0, 1);
                emit [ { position: p000, color: color, normal: nz }, { position: p001, color: color, normal: nz }, { position: p011, color: color, normal: nz } ,
                 { position: p000, color: color, normal: nz }, { position: p010, color: color, normal: nz }, { position: p001, color: color, normal: nz } ,
                 { position: p000, color: color, normal: nz }, { position: p111, color: color, normal: nz }, { position: p100, color: color, normal: nz } ,
                 { position: p000, color: color, normal: nz }, { position: p011, color: color, normal: nz }, { position: p111, color: color, normal: nz } ,
                 { position: p000, color: color, normal: ny }, { position: p010, color: color, normal: ny }, { position: p100, color: color, normal: ny } ,
                 { position: p000, color: color, normal: ny }, { position: p101, color: color, normal: ny }, { position: p110, color: color, normal: ny } ,
                 { position: p011, color: color, normal: ny }, { position: p001, color: color, normal: ny }, { position: p101, color: color, normal: ny } ,
                 { position: p011, color: color, normal: ny }, { position: p101, color: color, normal: ny }, { position: p111, color: color, normal: ny } ,
                 { position: p010, color: color, normal: nx }, { position: p001, color: color, normal: nx }, { position: p101, color: color, normal: nx } ,
                 { position: p010, color: color, normal: nx }, { position: p101, color: color, normal: nx }, { position: p110, color: color, normal: nx } ,
                 { position: p100, color: color, normal: nx }, { position: p110, color: color, normal: nx }, { position: p101, color: color, normal: nx } ,
                 { position: p100, color: color, normal: nx }, { position: p101, color: color, normal: nx }, { position: p111, color: color, normal: nx } ];
            }
        `)["Mark"];




        for (let item of data) {

            this.currentText.push({
                lon: item.lon,
                lat: item.lat,
                val: item.val,
                name: item.name,
                r1: color? Math.random():1,
                r2:color? Math.random():1,
                r3:color? Math.random():1,
                r4:color? Math.random():1
            })
        }

        console.log(this.currentText)
        let cubes = Stardust.mark.create(this.cubeSpec, this.platform);
        cubes.attr("lon", d => d.lon);
        cubes.attr("lat", d => d.lat);
        cubes.attr("val", d => d.val);
        cubes.attr("r1", d => d.r1);
        cubes.attr("r2", d => d.r2);
        cubes.attr("r3", d => d.r3);
        cubes.attr("r4", d => d.r4);
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
                Math.sin((d.lat - 2) * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .compile(this.omni)
            .data(this.currentText);

    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {

        GL.depthMask(GL.FALSE);
        this.cubes.render();
        //  this.text.render(this.omni);

        GL.depthMask(GL.TRUE);

    }

    public frame(): void {

    }
}

