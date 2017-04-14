import * as fs from "fs";
import * as path from "path";
import * as allofw from "allofw";
import * as allofwutils from "allofw-utils";
import { GL3 as GL } from "allofw";

import { SceneObject } from "./object";
import { IWavefrontOBJModel, loadWavefrontOBJModel, centerWavefrontOBJModel } from "./wavefrontOBJParser";

export interface IOBJMaterial {
    surface: allofw.graphics.Surface2D;
    faces: any[];
    data: Float32Array;
    vertex_count: number;
    vertex_buffer: GL.Buffer;
    vertex_array: GL.VertexArray;
}

export interface IOBJMeshOptions {
    centerModel?: boolean;
    flipX?: boolean;
}

export class OBJMeshObject extends SceneObject {
    private _program: GL.Program;
    private _materials: { [name: string]: IOBJMaterial };
    private _model: IWavefrontOBJModel;
    private _vertexArray: GL.VertexArray;
    private _buffer: GL.Buffer;
    private _lightPosition: allofwutils.Vector3;
    private _lightColor: allofwutils.Vector3;
    private _flipX: boolean;

    public get lightPosition(): allofwutils.Vector3 { return this._lightPosition; }
    public set lightPosition(pos: allofwutils.Vector3) { this._lightPosition = pos; }

    public get lightColor(): allofwutils.Vector3 { return this._lightColor; }
    public set lightColor(pos: allofwutils.Vector3) { this._lightColor = pos; }

    constructor(omni: allofw.IOmniStereo, filename: string, options: IOBJMeshOptions = {}) {
        super(omni);

        this._lightPosition = new allofwutils.Vector3();
        this._lightColor = new allofwutils.Vector3(0.7, 0.7, 0.7);

        this._model = loadWavefrontOBJModel(filename);
        if (options.centerModel) {
            centerWavefrontOBJModel(this._model);
        }
        if (options.flipX) {
            this._flipX = true;
        } else {
            this._flipX = false;
        }

        var program = allofwutils.compileShaders({
            vertex: "#version 330\n" + omni.getShaderCode() + `
                layout(location = 0) in vec3 position;
                layout(location = 1) in vec3 normal;
                layout(location = 2) in vec2 texCoord;

                uniform vec3 pose_position;
                uniform vec4 pose_rotation;
                uniform float pose_scale;
                uniform int flipX;

                out vec2 voTexCoord;
                out vec3 voNormal;
                out vec3 voPosition;

                void main() {
                    voTexCoord = vec2(texCoord.x, 1 - texCoord.y);
                    voNormal = omni_quat_rotate(pose_rotation, normal);
                    if(flipX == 1) {
                        voPosition = omni_quat_rotate(pose_rotation, vec3(-position.x, position.y, position.z) * pose_scale) + pose_position;
                    } else {
                        voPosition = omni_quat_rotate(pose_rotation, position * pose_scale) + pose_position;
                    }
                    
                    gl_Position = omni_render(omni_transform(voPosition));
                }
            `,
            fragment: "#version 330\n" + omni.getShaderCode() + `
                in vec2 voTexCoord;
                in vec3 voNormal;
                in vec3 voPosition;

                uniform sampler2D texKa;
                uniform sampler2D texKd;
                uniform sampler2D texKs;
                uniform sampler2D texD;

                uniform int texKa_enabled;
                uniform int texKd_enabled;
                uniform int texKs_enabled;
                uniform int texD_enabled;

                uniform vec3 Ka;
                uniform vec3 Kd;
                uniform vec3 Ks;
                uniform float Ns;
                uniform float Opacity;

                uniform vec3 lightPosition;
                uniform vec3 lightColor;

                layout(location = 0) out vec4 foFragmentColor;

                void main() {
                    vec3 rKa = Ka;
                    vec3 rKd = Kd;
                    vec3 rKs = Ks;
                    float rD = Opacity;
                    if(texKa_enabled == 1) rKa = texture(texKa, voTexCoord).rgb;
                    if(texKd_enabled == 1) rKd = texture(texKd, voTexCoord).rgb;
                    if(texKs_enabled == 1) rKs = texture(texKs, voTexCoord).rgb;
                    if(texD_enabled == 1) rD = texture(texD, voTexCoord).r;

                    vec3 lightDirection = normalize(lightPosition - voPosition);
                    vec3 eyeVector = normalize(lightPosition - voPosition);
                    vec3 R = reflect(-lightDirection, normalize(voNormal));
                    float diffuseStrength = clamp(dot(normalize(voNormal), lightDirection), 0, 1);
                    float specularStrength = pow(clamp(dot(eyeVector, R), 0, 1), Ns);

                    vec3 lightingOutput = rKa + rKd * lightColor * diffuseStrength + rKs * lightColor * specularStrength;
                    foFragmentColor = vec4(lightingOutput, rD);
                }
            `,
            geometry: null
        });

        this._program = program;

        let totalTriangles = 0;
        for (let g of this._model.groups) {
            totalTriangles += g.triangles.length;
        }
        let vertexData = new Float32Array(totalTriangles * 24);
        let currentPosition = 0;
        for (let g of this._model.groups) {
            for (let triangle of g.triangles) {
                for (let i = 0; i < 24; i++) {
                    vertexData[currentPosition++] = triangle[i];
                }
            }
        }

        let buffer = new GL.Buffer();
        let array = new GL.VertexArray();

        GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
        GL.bufferData(GL.ARRAY_BUFFER, vertexData.length * 4, vertexData, GL.STATIC_DRAW);

        GL.bindVertexArray(array);

        GL.enableVertexAttribArray(0);
        GL.enableVertexAttribArray(1);
        GL.enableVertexAttribArray(2);
        GL.vertexAttribPointer(0, 3, GL.FLOAT, GL.FALSE, 32, 0);
        GL.vertexAttribPointer(1, 3, GL.FLOAT, GL.FALSE, 32, 12);
        GL.vertexAttribPointer(2, 2, GL.FLOAT, GL.FALSE, 32, 24);
        GL.bindVertexArray(0);

        GL.bindBuffer(GL.ARRAY_BUFFER, 0);


        GL.useProgram(program);
        GL.uniform1i(GL.getUniformLocation(program, "texKa"), 0);
        GL.uniform1i(GL.getUniformLocation(program, "texKd"), 1);
        GL.uniform1i(GL.getUniformLocation(program, "texKs"), 2);
        GL.uniform1i(GL.getUniformLocation(program, "texD"), 3);
        GL.useProgram(0);

        this._vertexArray = array;
        this._buffer = buffer;
    }

    public frame() {

    }

    public render() {
        // GL.enable(GL.CULL_FACE);
        // GL.cullFace(GL.BACK);
        GL.useProgram(this._program);
        this.omni.setUniforms(this._program.id());
        GL.bindVertexArray(this._vertexArray);

        GL.uniform3f(GL.getUniformLocation(this._program, "lightPosition"), this._lightPosition.x, this._lightPosition.y, this._lightPosition.z);
        GL.uniform3f(GL.getUniformLocation(this._program, "lightColor"), this._lightColor.x, this._lightColor.y, this._lightColor.z);
        GL.uniform3f(GL.getUniformLocation(this._program, "pose_position"), this.pose.position.x, this.pose.position.y, this.pose.position.z);
        GL.uniform4f(GL.getUniformLocation(this._program, "pose_rotation"), this.pose.rotation.v.x, this.pose.rotation.v.y, this.pose.rotation.v.z, this.pose.rotation.w);
        GL.uniform1f(GL.getUniformLocation(this._program, "pose_scale"), this.pose.scale);
        GL.uniform1i(GL.getUniformLocation(this._program, "flipX"), this._flipX ? 1 : 0);

        let vertexIndexCurrent = 0;
        for (let g of this._model.groups) {
            let mtl = this._model.materials[g.materialName];

            GL.uniform3f(GL.getUniformLocation(this._program, "Ka"), mtl.Ka[0], mtl.Ka[1], mtl.Ka[2]);
            GL.uniform3f(GL.getUniformLocation(this._program, "Ks"), mtl.Ks[0], mtl.Ks[1], mtl.Ks[2]);
            GL.uniform3f(GL.getUniformLocation(this._program, "Kd"), mtl.Kd[0], mtl.Kd[1], mtl.Kd[2]);
            GL.uniform1f(GL.getUniformLocation(this._program, "Opacity"), mtl.d);
            GL.uniform1f(GL.getUniformLocation(this._program, "Ns"), mtl.Ns);

            if (mtl.map_Ka) {
                mtl.map_Ka.surface.bindTexture(0);
                GL.uniform1i(GL.getUniformLocation(this._program, "texKa_enabled"), 1);
            } else {
                GL.uniform1i(GL.getUniformLocation(this._program, "texKa_enabled"), 0);
            }
            if (mtl.map_Kd) {
                mtl.map_Kd.surface.bindTexture(1);
                GL.uniform1i(GL.getUniformLocation(this._program, "texKd_enabled"), 1);
            } else {
                GL.uniform1i(GL.getUniformLocation(this._program, "texKd_enabled"), 0);
            }
            if (mtl.map_Ks) {
                mtl.map_Ks.surface.bindTexture(2);
                GL.uniform1i(GL.getUniformLocation(this._program, "texKs_enabled"), 1);
            } else {
                GL.uniform1i(GL.getUniformLocation(this._program, "texKs_enabled"), 0);
            }
            if (mtl.map_D) {
                mtl.map_D.surface.bindTexture(3);
                GL.uniform1i(GL.getUniformLocation(this._program, "texD_enabled"), 1);
            } else {
                GL.uniform1i(GL.getUniformLocation(this._program, "texD_enabled"), 0);
            }

            GL.drawArrays(GL.TRIANGLES, vertexIndexCurrent, g.triangles.length * 3);

            if (mtl.map_Ka) {
                mtl.map_Ka.surface.unbindTexture(0);
            }
            if (mtl.map_Kd) {
                mtl.map_Kd.surface.unbindTexture(1);
            }
            if (mtl.map_Ks) {
                mtl.map_Ks.surface.unbindTexture(2);
            }
            if (mtl.map_D) {
                mtl.map_D.surface.unbindTexture(3);
            }

            vertexIndexCurrent += g.triangles.length * 3;
        }
        GL.bindVertexArray(0);
        GL.useProgram(0);
        // GL.disable(GL.CULL_FACE);
    }
}