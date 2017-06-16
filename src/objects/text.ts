import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";



export class Text extends SceneObject {
    year: any;


    private texts: any;
    private time: number;

    private dataBuffer: any[];

    private text: any;
    private timer: number;
    private time_start: number;
    private platform: StardustAllofw.AllofwPlatform3D;
    private intens: number;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, data: any) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = new Date().getTime() / 1000;

        console.log("hier");
        var currentText = [];
        currentText.push({
            lon: data.lat,
            lat: data.lon,
            text: data.text,
            intens: { fill: [255, 0, 0, 0.1] },
            len: 20

        })
        var lblText = shape3d.texts()
            .attr("vec3", "center", "3.0 * normalize(pos)")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(pos)")
            .attr("float", "scale", "0.0005 * len")
            .text((d: any) => (d.text))
            .style((d: any) => (d.intens))
            // Variables are bound to data.
            .variable("vec3", "pos", (d: any) => [
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin(d.lat * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .variable("float", "len", (d: any) => (d.len))
            .variable("float", "intens", (d: any) => (d.intens))
            .compile(this.omni)
            .data(currentText);

        this.text = lblText;
    }

    public setTime(t: number) {
        this.time = t;
        this.intens = t / 10;
    }

    private updateText(text: string, lat: number, lon: number) {
    }



    public render(): void {
        GL.depthMask(GL.FALSE);
        //   this.texts.render(this.omni);
        this.text.render(this.omni);

        GL.depthMask(GL.TRUE);
    }

    public frame(): void {
        this.text.variable("len", this.time);
        console.log(this.time)
    }
}

