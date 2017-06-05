var shape3d = require("allofw-shape3d");

var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;
var S3 = allofwutils.shape3d;

var FCoastlinesRenderer = function (omni: any) {
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
    // Compile and link the shader program.
    var program = allofwutils.compileShaders({
        vertex: vertex_shader,
        fragment: fragment_shader
    });

    // Vertex and line index buffers.
    var vertex_buffer = new GL.Buffer();
    var index_buffer = new GL.Buffer();
    var vertex_array = new GL.VertexArray();

    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    var data = require("fs").readFileSync("preprocessed/coordinates.bin");
    GL.bufferData(GL.ARRAY_BUFFER, data.length, data, GL.STATIC_DRAW);
    var total_points = data.length / 8;

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
    var data = require("fs").readFileSync("preprocessed/coordinates_indices.bin");
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, data.length, data, GL.STATIC_DRAW);
    var total_lines = data.length / 4;

    // Vertex array object.
    GL.bindVertexArray(vertex_array);
    GL.enableVertexAttribArray(0);
    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    GL.vertexAttribPointer(0, 2, GL.FLOAT, GL.FALSE, 8, 0);
    GL.bindVertexArray(0);
    this.setUniforms = function (f: any) {
        GL.useProgram(program.id());
        f(program.id());
        GL.useProgram(0);
    };
    this.frame = function () { }
    this.render = function () {
        // Use the shader above.
        GL.useProgram(program.id());

        // Set OmniStereo uniforms (pose, eye separation).
        omni.setUniforms(program.id());

        // Use the vertex array.
        GL.bindVertexArray(vertex_array);

        // Draw vertices as points.
        GL.pointSize(3);
        GL.drawArrays(GL.POINTS, 0, total_points);
        GL.pointSize(1);

        // Draw vertices as lines using the index array (not working properly right now).
        // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, index_buffer);
        // GL.drawElements(GL.LINES, total_lines, GL.UNSIGNED_INT, 0);

        GL.bindVertexArray(0);
        GL.useProgram(0);
    };
};

export let Coastlines = function (omni: any) {
    return new (FCoastlinesRenderer as any)(omni);
};

