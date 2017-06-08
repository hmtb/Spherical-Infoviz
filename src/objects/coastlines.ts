import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";
import { SceneObject } from "./object";
var shape3d = require("allofw-shape3d");

import * as Stardust from "stardust-core";
import * as StardustAllofw from "stardust-allofw";



export class Coastlines extends SceneObject {
    private total_points: number;
    private vertex_array: any;
    private _program: GL.Program;
    private _vertexArray: GL.VertexArray;
    private _buffer: GL.Buffer;
    private _lightPosition: allofwutils.Vector3;
    private _lightColor: allofwutils.Vector3;
    private _flipX: boolean;
    private dataBuffer: any[];

    private data: any;
    private dataText: any;
    private timer: number;
    private cubeSpec: Stardust.Specification.Mark;
    private platform: StardustAllofw.AllofwPlatform3D;
    private time_start: number;
    private program: any;


    //not working 

    constructor(window: allofw.OpenGLWindow, omni: allofw.IOmniStereo) {
        super(omni)
        var info: any = {};
        if (!info) info = {};
        if (!info.distortion) info.distortion = `vec3 do_distortion(vec3 p) { return p; }`;
        // Simple shader to draw points and lines.
        var vertex_shader = "#version 330\n" + omni.getShaderCode() + `
            layout(location = 0) in vec2 lnglat;
            __DISTORTION_CODE__
            void main() {
                vec3 position = vec3(
                    sin(-lnglat.x) * cos(lnglat.y),
                    sin(lnglat.y),
                    cos(-lnglat.x) * cos(lnglat.y)
                ) * 5.0;
                gl_Position = omni_render(omni_transform(do_distortion(position)));
            }
        `.replace("__DISTORTION_CODE__", info.distortion);
        var fragment_shader = "#version 330\n" + `
            layout(location = 0) out vec4 outputF;
            void main() {
                outputF = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `;


        this.program = allofwutils.compileShaders({
            vertex: vertex_shader,
            fragment: fragment_shader
        });

        // Vertex and line index buffers.
        var vertex_buffer = new GL.Buffer();
        var index_buffer = new GL.Buffer();
        this.vertex_array = new GL.VertexArray();

        GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
        var data = require("fs").readFileSync("preprocessed/coordinates.bin");
        GL.bufferData(GL.ARRAY_BUFFER, data.length, data, GL.STATIC_DRAW);
        this.total_points = data.length / 8;

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
        var data = require("fs").readFileSync("preprocessed/coordinates_indices.bin");
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, data.length, data, GL.STATIC_DRAW);
        var total_lines = data.length / 4;

        // Vertex array object.
        GL.bindVertexArray(this.vertex_array);
        GL.enableVertexAttribArray(0);
        GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
        GL.vertexAttribPointer(0, 2, GL.FLOAT, GL.FALSE, 8, 0);
        GL.bindVertexArray(0);
        omni.setUniforms = function (f: any) {
            GL.useProgram(this.program.id());
            f(this.program.id());
            GL.useProgram(0);
        };
    }

    public render(): void {
        // Use the shader above.
        GL.useProgram(this.program.id());

        // Set OmniStereo uniforms (pose, eye separation).
        this.omni.setUniforms(this.program.id());

        // Use the vertex array.
        GL.bindVertexArray(this.vertex_array);

        // Draw vertices as points.
        GL.pointSize(3);
        GL.drawArrays(GL.POINTS, 0, this.total_points);
        GL.pointSize(1);

        // Draw vertices as lines using the index array (not working properly right now).
        // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
        // GL.drawElements(GL.LINES, total_lines, GL.UNSIGNED_INT, 0);

        GL.bindVertexArray(0);
        GL.useProgram(0);
    }

    public frame(): void {

    }

}

