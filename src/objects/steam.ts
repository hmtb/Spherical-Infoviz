import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
import { SteamParticleObject } from "../utils/steamParticles";
var shape3d = require("allofw-shape3d");
// var Stardust = require("stardust-core");
// var StardustWebGL = require("stardust-webgl");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";

shape3d.particles = function () {
    return new (SteamParticleObject as any)();
};



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

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo) {
        super(omni)
        let platform = new StardustAllofw.AllofwPlatform3D(window, omni);

        let cubeSpec = Stardust.mark.compile(`
            import { Cube } from P3D;

            mark Mark(lon: float, lat: float, random: float, t: float) {
                // Calculate cx, cy, cz for the cube
                let cx = 4 * cos(lon + t + random * 0.2) * cos(lat);
                let cz = 4 * sin(lon + t + random * 0.2) * cos(lat);
                let cy = 4 * sin(lat);
                Cube(Vector3(cx, cy, cz), 0.05, Color(1, 1, 1, 0.1));
            }
        `)["Mark"];

        let cubes = Stardust.mark.create(cubeSpec, platform);

        var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/plants_data_50.csv", "utf-8"));
        let newData = [];
        for (let item of data) {
            for (let i = 0; i < 10; i++) {
                newData.push({
                    lon: item.lon,
                    lat: item.lat,
                    random: Math.random()
                })
            }
        }

        cubes.attr("lon", d => d.lon * Math.PI / 180);
        cubes.attr("lat", d => d.lat * Math.PI / 180);
        cubes.attr("random", d => d.random);
        cubes.attr("t", 0);
        cubes.data(newData);

        this.cubes = cubes;
        var maxlen = 4.0;
        var maxval = 20000000;
        var texts = shape3d.texts()
            //    .attr("vec3", "center", "5.0 * normalize(pos)")
            .attr("vec3", "center", "5.0 * normalize(pos)")
            .attr("vec3", "up", "vec3(0, 1, 0)")
            .attr("vec3", "normal", "-normalize(pos)")
            .attr("float", "scale", "0.0005 * len")
            .text((d: any) => (d.val))
            // Variables are bound to data.
            .variable("vec3", "pos", (d: any) => [
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin(d.lat * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
            .variable("float", "len", (d: any) => (maxlen * d.val / maxval))
            .compile(omni)
            .data(data);

        this.texts = texts;
    }

    public setTime(t: number) {
        this.time = t;
    }

    public render(): void {
        this.cubes.render();
        this.texts.render(this.omni);
    }

    public frame(): void {

        this.cubes.attr("t", this.time);
        ///transformation function over time


    }

}

