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



export class Steam_Earth extends SceneObject {
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
    private dataText: any[];
    private newText: any[];
    private transit = false;
    private switch = false;
    private cubes: Stardust.Mark;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number,size:number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/data/emissionByCountry.csv", "utf-8"));
        this.currentPanorama = PanoramaImage(omni, "studyData/img/earth.jpg");
        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, random: float,randomx: float,randomy: float, t: float,speed: float,year:float,currentYear:float, position: float) {
              
                if(year == 2009){
                //static variables
                let duration = 20;
                let minsize = 4+randomx;
                let tduration= t/1;
                let maxRadius= 10;
                let size = maxRadius - (position + tduration)%(maxRadius-minsize);
                let spread = ((position + tduration)%(maxRadius-minsize))*0.2;
                let spread2 = ((position + tduration)%(maxRadius-minsize));
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
                        randomx: Math.random() - 0.5,
                        randomy: Math.random() - 0.5,
                        speed: Math.random() * 1000,
                        position: Math.random() * 3,
                        year: i
                    })
                }


            }
            let ilon: number = item.lon;
            let ilat: number = item.lat;
            let name: string = item.ISO;
            this.dataText.push({
                lon: ilon,
                lat: ilat,
                name: name
            })
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
        cubes.attr("year", d => d.year);
        cubes.attr("currentYear", 2009)
        cubes.data(this.dataBuffer);
        // console.log(this.dataBuffer);
        this.cubes = cubes;

        var texts = shape3d.texts()
            .attr("vec3", "center", "4.9 * normalize(pos)  + vec3(0.0, -0.2, 0.0) ")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(pos)")
            .attr("float", "scale", "0.0005 * len")
            .text((d: any) => (d.name))
            // Variables are bound to data.
            .variable("vec3", "pos", (d: any) => [
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin(d.lat * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .variable("float", "len", (d: any) => 5)
            .compile(this.omni)
            .data(this.dataText);
        this.texts = texts;
        console.log(this.texts)
    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
         if(this.time - this.time_start > 60) return;
       this.currentPanorama.render();
       
        GL.depthMask(GL.FALSE);
        if(this.texts)
             this.texts.render();

       this.cubes.render();
     
        GL.depthMask(GL.TRUE);
         
    }

    public frame(): void {
        this.cubes.attr("t", this.time);
    }
}

