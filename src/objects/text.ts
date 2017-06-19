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
    instant = false;
    year: any;


    private texts: any;
    private time: number;

    private dataBuffer: any[];

    private text: any;
    private timer: number;
    private time_start: number;
    private platform: StardustAllofw.AllofwPlatform3D;
    private intens: number;
    first = true;
    frameCount = 0;
    private currentText: any[];
    private newText: any[];
    private transit = false;
    private switch = false;

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo, data: any, startTime: number) {
        super(omni)
        this.platform = new StardustAllofw.AllofwPlatform3D(window, omni);
        this.time_start = startTime;
        this.currentText = [];
        this.transit = true;
        this.switch = true;
        if (data == null) {
            data = {
                lat: 0,
                lon: 0,
                text: ''
            }
            this.transit = false;
            this.switch = false;
        }
        this.newText = [];
        this.newText.push({
            lon: data.lat,
            lat: data.lon,
            text: data.text,
            intens: { fill: [255, 255, 255, 1] },
            len: 10

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
            .data(this.currentText);
        this.text = lblText;
        this.intens = startTime;
        console.log(startTime);
    }

    public setTime(t: number) {
        this.time = t;
    }

    // public updateText(text: string, lat: number, lon: number) {
    //     this.transit = true
    //     this.transitFrame = 0;
    //     this.newText.push({
    //         lon: lat,
    //         lat: lon,
    //         text: text,
    //         intens: { fill: [255, 255, 255, 0] },
    //         len: 20
    //     })

    // }
    public setText(text: string, lat: number, lon: number, startTime: number) {
        this.transit = true
        this.switch = true;
        this.intens = startTime;
        this.newText = [];
        this.newText.push({
            lon: lat,
            lat: lon,
            text: text,
            intens: { fill: [255, 255, 255, 0] },
            len: 10
        })

    }
    public setTextInstant(text: string, lat: number, lon: number, startTime: number) {
        this.currentText = []
        this.currentText.push({
            lon: lat,
            lat: lon,
            text: text,
            intens: { fill: [255, 255, 255, 1] },
            len: 10
        })
        this.instant = true;
    }




    public render(): void {
        GL.depthMask(GL.FALSE);
        //   this.texts.render(this.omni);
        this.text.render(this.omni);

        GL.depthMask(GL.TRUE);
    }

    public frame(): void {
        var transition = (this.time - this.intens) * 2;
        if (this.transit && (transition) > Math.PI * 2) {
            this.transit = false;
            for (var item of this.currentText) {
                item.intens = { fill: [255, 255, 255, 1] }
            }
            this.text.data(this.currentText)
        }
        if (this.transit) {
            for (var item of this.currentText) {
                item.intens = { fill: [255, 255, 255, (Math.cos(transition) + 1) / 2] }
            }
            this.text.data(this.currentText)
            if (this.switch && (transition) > Math.PI) {
                this.currentText = this.newText;
                this.switch = false;
            }
        }

        if (this.intens <= 2) {
            for (var item of this.currentText) {
                item.intens = { fill: [255, 255, 255, this.intens / 2] }
            }

        }
        if (this.instant) {
            this.text.data(this.currentText)
            this.instant = false;
        }
    }
}

