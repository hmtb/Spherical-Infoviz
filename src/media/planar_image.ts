var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;

function MakePlaneMesh(divisions: any) {
    var triangles = [];
    for (var ix = 0; ix < divisions; ix++) {
        for (var iy = 0; iy < divisions; iy++) {
            triangles.push([
                [(ix + 0) / divisions, (iy + 0) / divisions],
                [(ix + 1) / divisions, (iy + 0) / divisions],
                [(ix + 1) / divisions, (iy + 1) / divisions]
            ]);
            triangles.push([
                [(ix + 0) / divisions, (iy + 0) / divisions],
                [(ix + 1) / divisions, (iy + 1) / divisions],
                [(ix + 0) / divisions, (iy + 1) / divisions]
            ]);
        }
    }

    var GL = require("allofw").GL3;
    var buffer = new Float32Array(triangles.length * 3 * 2);
    var ptr = 0;
    for (var i = 0; i < triangles.length; i++) {
        for (var a = 0; a < 3; a++) {
            for (var b = 0; b < 2; b++) {
                buffer[ptr++] = triangles[i][a][b];
            }
        }
    }
    var vertex_buffer = new GL.Buffer();
    var vertex_array = new GL.VertexArray();
    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    GL.bufferData(GL.ARRAY_BUFFER, buffer.length * 4, buffer, GL.STATIC_DRAW);
    GL.bindVertexArray(vertex_array);
    GL.enableVertexAttribArray(0);
    GL.bindBuffer(GL.ARRAY_BUFFER, vertex_buffer);
    GL.vertexAttribPointer(0, 2, GL.FLOAT, GL.FALSE, 8, 0);
    GL.bindVertexArray(0);
    GL.bindBuffer(GL.ARRAY_BUFFER, 0);
    var vertex_count = triangles.length * 3;
    return {
        vertex_array: vertex_array,
        vertex_buffer: vertex_buffer,
        render: function () {
            GL.bindVertexArray(vertex_array);
            GL.drawArrays(GL.TRIANGLES, 0, vertex_count);
            GL.bindVertexArray(0);
        }
    };
}

function FTexturedPlaneRenderer(omni: any) {
    var mesh = MakePlaneMesh(10);

    var program = allofwutils.compileShaders({
        vertex: "#version 330\n" + omni.getShaderCode() + `
            layout(location = 0) in vec2 position;
            out vec2 vo_texCoord;

            uniform vec3 center;
            uniform vec3 ex;
            uniform vec3 ey;
            uniform vec2 size;

            void main() {
                vec3 point = center + ex * (position.x - 0.5) * size.x + ey * (0.5 - position.y) * size.y;
                gl_Position = omni_render(omni_transform(point));
                vo_texCoord = position;
            }
        `,
        fragment: "#version 330\n" + omni.getShaderCode() + `
            uniform sampler2D texImage;

            in vec2 vo_texCoord;

            layout(location = 0) out vec4 fragment_color;
            void main() {
                fragment_color = texture(texImage, vo_texCoord);
            }
        `
    });

    var center = new allofwutils.Vector3(0, 0, -1);
    var ex = new allofwutils.Vector3(1, 0, 0);
    var ey = new allofwutils.Vector3(0, 1, 0);
    var width = 1;
    var height = 1;

    this.setLocation = function (center_: any, ex_: any, ey_: any, width_: any, height_: any) {
        center = center_;
        ex = ex_;
        ey = ey_;
        width = width_;
        height = height_;
    };

    this.render = function () {
        GL.useProgram(program);
        omni.setUniforms(program.id());
        GL.uniform3f(GL.getUniformLocation(program, "center"), center.x, center.y, center.z);
        GL.uniform3f(GL.getUniformLocation(program, "ex"), ex.x, ex.y, ex.z);
        GL.uniform3f(GL.getUniformLocation(program, "ey"), ey.x, ey.y, ey.z);
        GL.uniform2f(GL.getUniformLocation(program, "size"), width, height);
        GL.uniform1i(GL.getUniformLocation(program, "texImage"), 0);
        mesh.render();
        GL.useProgram(0);
        allofwutils.checkGLError("video");
    };
}

function FPlanarImage(omni: any, source: any) {
    var plane = new (FTexturedPlaneRenderer as any)(omni);
    var image = allofw.graphics.loadImageData(require("fs").readFileSync(source));
    var image_texture = new GL.Texture();
    GL.bindTexture(GL.TEXTURE_2D, image_texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, image.width(), image.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, image.pixels());
    GL.generateMipmap(GL.TEXTURE_2D);
    GL.bindTexture(GL.TEXTURE_2D, 0);


    this.render = function () {
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, image_texture);
        plane.render();
        GL.bindTexture(GL.TEXTURE_2D, 0);
    };

    this.setLocation = function (center: any, ex: any, ey: any, x_size: any) {
        plane.setLocation(center, ex, ey, x_size, x_size / image.width() * image.height());
    };

    this.setLocation(
        new allofwutils.Vector3(0, 0, -1),
        new allofwutils.Vector3(1, 0, 0),
        new allofwutils.Vector3(0, 1, 0),
        1
    );
}

export let PlanarImage = function (omni: any, source: any) {
    return new (FPlanarImage as any)(omni, source);
}
