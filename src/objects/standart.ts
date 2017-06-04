import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";



export class StandartView extends SceneObject {

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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.timer = 0;


        // var texts = shape3d.image
        //     //    .attr("vec3", "center", "5.0 * normalize(pos)")
        //     .attr("vec3", "center", "6.0 * normalize(pos)")
        //     .attr("vec3", "up", "vec3(0, 1, 0)")
        //     .attr("vec3", "normal", "-normalize(pos)")
        //     .attr("float", "scale", "0.0005 * len")
        //     .text((d: any) => (d.val))
        //     // Variables are bound to data.
        //     .variable("vec3", "pos", (d: any) => [
        //         Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
        //         Math.sin(d.lat * Math.PI / 180),
        //         Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
        //     .variable("float", "len", (d: any) => (maxlen * Math.pow(Math.round(d.val) / (maxval / 10), 0.5)))
        //     .compile(this.omni)
        //     .data(currentTextData);
        // this.texts = texts;

        // var imgs = shape3d.images("svg:image")
        //     .attr("xlink:href", "preprocessed/standart.png")
        //     .attr("x", "60")
        //     .attr("y", "60")
        //     .attr("width", "20")
        //     .attr("height", "20");

        let img = allofw.graphics.loadImageData(require("fs").readFileSync("preprocessed/standart.png"));

        var imgs = shape3d.images()
            .image(img, img.width(), img.height())
            .attr("vec3", "center", "3 * normalize(vec3(0, 1, 1))")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(vec3(0, 1, 1))")
            .attr("float", "scale", "0.001")
            .xywh((d: any) => {
                return { x: 0, y: 0, width: img.width(), height: img.height() }
            })
            .compile(this.omni)
            .data([0]);


        this.texts = imgs;
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

        console.log(maxval);


    }

    public render(): void {
        GL.depthMask(GL.FALSE);
        this.texts.render(this.omni);
        GL.depthMask(GL.TRUE);
    }

    public frame(): void {


    }

}

