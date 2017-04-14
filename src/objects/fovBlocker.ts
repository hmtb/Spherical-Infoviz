import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";

import { SceneObject } from "./object";
import { IWavefrontOBJModel, loadWavefrontOBJModel, centerWavefrontOBJModel } from "./wavefrontOBJParser";


function makeSphere(radius: number = 1, subdivide: number = 5) {
    // Vertices for a icosahedron.
    let t = (1.0 + Math.sqrt(5.0)) / 2.0;
    let vertices = [
        [-1,  t,  0],
        [ 1,  t,  0],
        [-1, -t,  0],
        [ 1, -t,  0],
        [ 0, -1,  t],
        [ 0,  1,  t],
        [ 0, -1, -t],
        [ 0,  1, -t],
        [ t,  0, -1],
        [ t,  0,  1],
        [-t,  0, -1],
        [-t,  0,  1]
    ];
    let faces = [
        [ 0, 11,  5], [ 0,  5,  1], [ 0,  1,  7], [ 0,  7, 10],
        [ 0, 10, 11], [ 1,  5,  9], [ 5, 11,  4], [11, 10,  2],
        [10,  7,  6], [ 7,  1,  8], [ 3,  9,  4], [ 3,  4,  2],
        [ 3,  2,  6], [ 3,  6,  8], [ 3,  8,  9], [ 4,  9,  5],
        [ 2,  4, 11], [ 6,  2, 10], [ 8,  6,  7], [ 9,  8,  1]
    ];
    // Make a triangle list.
    let pointer = 0;
    let subdivided_triangles = [];
    let interp2 = function(v0: number[], v1: number[], t: number) {
        return [
            v0[0] * (1 - t) + v1[0] * t,
            v0[1] * (1 - t) + v1[1] * t,
            v0[2] * (1 - t) + v1[2] * t,
        ];
    };
    let interp = function(v0: number[], v1: number[], v2: number[], t1: number, t2: number) {
        return interp2(interp2(v0, v1, t1), interp2(v0, v2, t1), t2);
    };
    let normalize = function(v: number[]) {
        var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [ v[0] / len * radius, v[1] / len * radius, v[2] / len * radius ];
    };
    for(let f of faces) {
        let v0 = vertices[f[0]];
        let v1 = vertices[f[1]];
        let v2 = vertices[f[2]];
        for(let i = 0; i < subdivide; i++) {
            for(let j = 0; j <= i; j++) {
                subdivided_triangles.push([
                    normalize(interp(v0, v1, v2, i / subdivide, i == 0 ? 0 : j / i)),
                    normalize(interp(v0, v1, v2, (i + 1) / subdivide, j / (i + 1))),
                    normalize(interp(v0, v1, v2, (i + 1) / subdivide, (j + 1) / (i + 1)))
                ]);
                if(j < i) {
                    subdivided_triangles.push([
                        normalize(interp(v0, v1, v2, i / subdivide, j / i)),
                        normalize(interp(v0, v1, v2, (i + 1) / subdivide, (j + 1) / (i + 1))),
                        normalize(interp(v0, v1, v2, i / subdivide, (j + 1) / i))
                    ]);
                }
            }
        }
    }
    return subdivided_triangles;
};

interface ISphereMesh {
    vertexArray: GL.VertexArray;
    vertexBuffer: GL.Buffer;
    vertexCount: number;
}

function makeSphereMesh(radius: number = 1, subdivide: number = 5): ISphereMesh {
    let triangles = makeSphere(radius, subdivide);
    let buffer = new Float32Array(triangles.length * 3 * 3);
    let ptr = 0;
    for(let i = 0; i < triangles.length; i++) {
        for(let a = 0; a < 3; a++) {
            for(let b = 0; b < 3; b++) {
                buffer[ptr++] = triangles[i][a][b];
            }
        }
    }
    let vertex_buffer = new GL.Buffer();
    let vertex_array = new GL.VertexArray();
    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    GL.bufferData(GL.ARRAY_BUFFER, buffer.length * 4, buffer, GL.STATIC_DRAW);
    GL.bindVertexArray(vertex_array);
    GL.enableVertexAttribArray(0);
    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    GL.vertexAttribPointer(0, 3, GL.FLOAT, GL.FALSE, 12, 0);
    GL.bindVertexArray(0);
    GL.bindBuffer(GL.ARRAY_BUFFER, 0);
    let vertex_count = triangles.length * 3;
    return {
        vertexArray: vertex_array,
        vertexBuffer: vertex_buffer,
        vertexCount: vertex_count
    };
};

export class FOVBlockerObject extends SceneObject {
    private _program: GL.Program;
    private _sphereMesh: ISphereMesh;
    private _fovX: number;
    private _fovY: number;
    private _blockColor: number[];
    private _viewColor: number[];
    private _borderColor: number[];

    constructor(omni: allofw.IOmniStereo, config: {
            fovX: number;
            fovY: number;
            blockColor: number[];
            viewColor: number[];
            borderColor: number[];
        }) {
        super(omni);

        this._fovX = config.fovX;
        this._fovY = config.fovY;
        this._blockColor = config.blockColor;
        this._viewColor = config.viewColor;
        this._borderColor = config.borderColor;
        this._sphereMesh = makeSphereMesh(2, 5);

        var program = allofwutils.compileShaders({
            vertex: "#version 330\n" + omni.getShaderCode() + `
                layout(location = 0) in vec3 position;

                uniform vec3 posePosition;
                uniform vec4 poseRotation;

                out vec3 voModelPosition;

                void main() {
                    voModelPosition = position;
                    vec3 pos = omni_quat_rotate(poseRotation, position) + posePosition;
                    gl_Position = omni_render(omni_transform(pos));
                }
            `,
            fragment: "#version 330\n" + omni.getShaderCode() + `
                layout(location = 0) out vec4 foFragmentColor;

                in vec3 voModelPosition;

                uniform vec2 fovXY;
                uniform vec4 blockColor;
                uniform vec4 viewColor;
                uniform vec4 borderColor;

                uniform int mode;

                void main() {
                    vec3 position = voModelPosition;

                    float cosXAngle = -normalize(position.xz).y;
                    float cosYAngle = -normalize(position.yz).y;

                    foFragmentColor = vec4(0, 0, 0, 0);

                    float borderAngle = 0.002;
                    float xMax = cos(fovXY.x / 2.0);
                    float xMaxBorder = cos(fovXY.x / 2.0 - borderAngle);
                    float yMax = cos(fovXY.y / 2.0);
                    float yMaxBorder = cos(fovXY.y / 2.0 - borderAngle);

                    if(cosXAngle > xMax && cosYAngle > yMax) {
                        // Is the point in border range?
                        if(mode == 0) {
                            if(cosXAngle < xMaxBorder || cosYAngle < yMaxBorder) {
                                foFragmentColor = borderColor;
                            } else {
                                foFragmentColor = viewColor;
                            }
                        } else {
                            discard;
                        }
                    } else {
                        if(mode == 0) {
                            foFragmentColor = blockColor;
                        } else {
                            gl_FragDepth = 0.0;
                        }
                    }

                }
            `,
            geometry: null
        });

        this._program = program;
    }

    public render() {
        GL.useProgram(this._program);
        this.omni.setUniforms(this._program.id());
        GL.bindVertexArray(this._sphereMesh.vertexArray);

        GL.uniform3f(GL.getUniformLocation(this._program, "posePosition"), this.pose.position.x, this.pose.position.y, this.pose.position.z);
        GL.uniform4f(GL.getUniformLocation(this._program, "poseRotation"), this.pose.rotation.v.x, this.pose.rotation.v.y, this.pose.rotation.v.z, this.pose.rotation.w);
        GL.uniform2f(GL.getUniformLocation(this._program, "fovXY"), this._fovX / 180 * Math.PI, this._fovY / 180 * Math.PI);
        GL.uniform4f(GL.getUniformLocation(this._program, "blockColor"), this._blockColor[0], this._blockColor[1], this._blockColor[2], this._blockColor[3]);
        GL.uniform4f(GL.getUniformLocation(this._program, "viewColor"), this._viewColor[0], this._viewColor[1], this._viewColor[2], this._viewColor[3]);
        GL.uniform4f(GL.getUniformLocation(this._program, "borderColor"), this._borderColor[0], this._borderColor[1], this._borderColor[2], this._borderColor[3]);

        GL.disable(GL.DEPTH_TEST);
        GL.uniform1i(GL.getUniformLocation(this._program, "mode"), 0);
        GL.drawArrays(GL.TRIANGLES, 0, this._sphereMesh.vertexCount);

        GL.enable(GL.DEPTH_TEST);
        GL.uniform1i(GL.getUniformLocation(this._program, "mode"), 1);
        GL.drawArrays(GL.TRIANGLES, 0, this._sphereMesh.vertexCount);

        GL.bindVertexArray(0);
        GL.useProgram(0);
    }
}