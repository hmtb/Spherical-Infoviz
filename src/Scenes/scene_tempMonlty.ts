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



export class scene_TA_Montly extends SceneObject {
    legendshow: boolean;
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
    private legend: any;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, startTime: number, size: number,legend:boolean) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];
        this.currentPanorama = PanoramaImage(omni, "studyData/img/earth.jpg");
        this.legendshow = legend;
        this.legend = PlanarImage(omni, "studyData/img/Legend1.png");
        var center = new allofwutils.Vector3(
                 Math.sin(-180 * Math.PI / -180) * Math.cos(-20 * Math.PI / 180),
                Math.sin(-20 * Math.PI / 180),
                Math.cos(-180 * Math.PI / -180) * Math.cos(-20 * Math.PI / 180)
            ).normalize().scale(2);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();

        this.legend.setLocation(center, ex, ey, 2);

        var data = require("d3").csv.parse(require("fs").readFileSync("studyData/data/tempMarch2016.csv", "utf-8"));

        this.cubeSpec = Stardust.mark.compile(`
            //import the object you wanna use see https://github.com/stardustjs/stardust-core/blob/master/src/core/library/primitives3d.ts
            import { Triangle, Cube } from P3D;

            //create mark and extend the constructor with the values you need

            mark Mark(lon: float, lat: float, val: float, t: float) {
              
                let size = 4.9;
                // all start at one point a bit randomised
                let cx = size *  sin(lon * PI/-180) * cos(lat * PI/180 );
                let cy = size *  sin(lat  * PI/180);
                let cz = size *  cos(lon * PI/-180) * cos(lat * PI/180 );

                //depending on t and speed the particle mooves on in the sphere


              //  Cube(Vector3(cx, cy, cz), 0.03, Color(val,val,val, val));


                let w = 0.01;
                let l = (val)*3;
                let center = Vector3(cx, cy, cz);
              
                let normal = normalize(center)*-3;
                let up = Vector3(0, 1, 0);
                let eX = normalize(cross(normal, up))* w;
                let eY = normalize(cross(normal, eX))* w;
                let length = Vector3(0, 1, 0);
                if(sin(t)>0){
                    length = ((normalize(Vector3(cx,cy,cz))*l -Vector3(1, 0, 0)) * sin(t) );
                }else{
                     length = ((normalize(Vector3(cx,cy,cz))*l -Vector3(1, 0, 0)) * -sin(t)  );
                }

                // length = (normalize(Vector3(cx,cy,cz))*l * abs(sin(t)));


                let color = Color( val, 0, 1-val, 1);
                if(val <0.25)
                {
                    color = Color( 0, val/0.25 ,1, 1);   
                }else if (val <0.5){
                     color = Color( (val-0.25)/0.25, 1 ,1, 1);  
                }
                else if (val <0.75){
                     color = Color( 1, 1 ,1-(val-0.5)/0.25, 1);  
                }
                 else{
                     color = Color( 1, 1-(val-0.75)/0.25 ,0, 1);  
                }
                

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


        let max = 0.0;
        let min = 0.0;
          for (let item of data) {

            for (let i = 1; i <= 360; i++) {
                if (item[i - 180.5] == 'NaN') continue;
                if(max < item[i - 180.5])
                {
                    max = item[i - 180.5];
                }
                if(min > item[i - 180.5])
                {
                    min = item[i - 180.5];
                }
            }
        }
        for (let item of data) {

            for (let i = 1; i <= 360; i++) {
                if (item[i - 180.5] == 'NaN') continue;
                this.currentText.push({
                    lon: i - 180.5,
                    lat: item.lat,
                    val: this.mymap(item[i - 180.5],-4,4),
                    name: item.name
                })
            }
        }

        let cubes = Stardust.mark.create(this.cubeSpec, this.platform);
        cubes.attr("lon", d => d.lon);
        cubes.attr("lat", d => d.lat);
        cubes.attr("val", d => d.val);
        cubes.attr("t", 0);
        -        cubes.data(this.currentText);
        this.cubes = cubes;

    }
    public mymap(int_myNumber: number,min:number,max:number) {
        return (int_myNumber - min) * (1 - 0) / (max - min) + 0;
    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        this.currentPanorama.render();
        if(  this.legendshow)
         this.legend.render();
       
        GL.depthMask(GL.FALSE);


        GL.depthMask(GL.TRUE);
        this.cubes.render();
    }

    public frame(): void {
        this.cubes.attr("t", this.time);
    }
}

