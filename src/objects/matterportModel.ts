import * as fs from "fs";
import * as path from "path";

import * as allofw from "allofw";
import { GL3 as GL, graphics } from "allofw";
import * as allofwutils from "allofw-utils";

import { SceneObject } from "./object";

// Load the 3D model to memory.
export class Matterport3DModel extends SceneObject {
    constructor(omni: allofw.IOmniStereo, modelDirectory: string, variant: string = "") {
        super(omni);

        var sweeps = { };
        var materials: any = { };

        var info = JSON.parse(fs.readFileSync(path.join(modelDirectory, "info.json"), "utf8"));
        var jobid = info.job.uuid;
        var damfile = fs.readFileSync(path.join(modelDirectory, jobid + variant + ".dam.bin"));
        var pos = 0;
        while(pos < damfile.length) {
            var len_material_name = damfile.readUInt32LE(pos); pos += 4;
            var material = damfile.slice(pos, pos + len_material_name).toString("utf8"); pos += len_material_name;
            var len_chunkdata = damfile.readUInt32LE(pos); pos += 4;
            var chunk = damfile.slice(pos, pos + len_chunkdata); pos += len_chunkdata;
            var m: any = materials[material] = { };

            console.log("Loading texture: " + material);

            var texture = path.join(modelDirectory, jobid + variant + "_texture_jpg_high", material);
            var data = fs.readFileSync(texture);
            m.surface = graphics.loadImageData(data);
            m.surface.uploadTexture();

            var vertex_buffer = new GL.Buffer();
            var vertex_array = new GL.VertexArray();
            GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
            GL.bufferData(GL.ARRAY_BUFFER, chunk.length, chunk, GL.STATIC_DRAW);
            GL.bindVertexArray(vertex_array);
            GL.enableVertexAttribArray(0);
            GL.enableVertexAttribArray(1);
            GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
            GL.vertexAttribPointer(0, 3, GL.FLOAT, GL.FALSE, 20, 0);
            GL.vertexAttribPointer(1, 2, GL.FLOAT, GL.FALSE, 20, 12);
            m.vertex_buffer = vertex_buffer;
            m.vertex_array = vertex_array;
            m.vertex_count = chunk.length / 4 / 5;
        }

        let program = allofwutils.compileShaders({
            vertex: "#version 330\n" + omni.getShaderCode() + `
                layout(location = 0) in vec3 position;
                layout(location = 1) in vec2 texture_coords;

                uniform vec3 pose_position;
                uniform vec4 pose_rotation;
                uniform float pose_scale;

                out vec2 texCoord;

                void main() {
                    vec3 pos = omni_quat_rotate(pose_rotation, position.yzx * pose_scale) + pose_position;
                    gl_Position = omni_render(omni_transform(pos));
                    texCoord = vec2(texture_coords.x, 1.0 - texture_coords.y);
                }
            `,
            fragment: "#version 330\n" + omni.getShaderCode() + `
                in vec2 texCoord;
                uniform sampler2D texImage;
                layout(location = 0) out vec4 fragment_color;
                void main() {
                    fragment_color = texture(texImage, texCoord);
                }
            `,
            geometry: ""
        });

        this.program = program;
        GL.useProgram(program);
        GL.uniform1i(GL.getUniformLocation(program, "texImage"), 0);
        GL.useProgram(0);

        GL.useProgram(0);

        this.materials = materials;
    }
    public render() {
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.useProgram(this.program);
        this.omni.setUniforms(this.program.id());

        GL.uniform3f(GL.getUniformLocation(this.program, "pose_position"), this.pose.position.x, this.pose.position.y, this.pose.position.z);
        GL.uniform4f(GL.getUniformLocation(this.program, "pose_rotation"), this.pose.rotation.v.x, this.pose.rotation.v.y, this.pose.rotation.v.z, this.pose.rotation.w);
        GL.uniform1f(GL.getUniformLocation(this.program, "pose_scale"), this.pose.scale);

        for(var name in this.materials) {
            var m = this.materials[name];
            m.surface.bindTexture(0);
            GL.bindVertexArray(m.vertex_array);
            GL.drawArrays(GL.TRIANGLES, 0, m.vertex_count);
            m.surface.unbindTexture(0);
        }
        GL.useProgram(0);
        GL.disable(GL.CULL_FACE);
    }

    private program: any;
    private materials: any;
}
