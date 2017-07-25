// Distortable panorama.

function MakeSphere(radius: number, subdivide: any) {
    radius = 10;
    if (subdivide === undefined) subdivide = 5;
    // Vertices for a icosahedron.
    var t = (1.0 + Math.sqrt(5.0)) / 2.0;
    var vertices = [
        [-1, t, 0],
        [1, t, 0],
        [-1, -t, 0],
        [1, -t, 0],
        [0, -1, t],
        [0, 1, t],
        [0, -1, -t],
        [0, 1, -t],
        [t, 0, -1],
        [t, 0, 1],
        [-t, 0, -1],
        [-t, 0, 1]
    ];
    var faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10],
        [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2],
        [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2],
        [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5],
        [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
    // Make a triangle list.
    var pointer = 0;
    var subdivided_triangles = [];
    var interp2 = function (v0: any, v1: any, t: any) {
        return [
            v0[0] * (1 - t) + v1[0] * t,
            v0[1] * (1 - t) + v1[1] * t,
            v0[2] * (1 - t) + v1[2] * t,
        ];
    };
    var interp = function (v0: any, v1: any, v2: any, t1: any, t2: any) {
        return interp2(interp2(v0, v1, t1), interp2(v0, v2, t1), t2);
    };
    var normalize = function (v: any) {
        var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / len * radius, v[1] / len * radius, v[2] / len * radius];
    };
    for (var f of faces) {
        var v0 = vertices[f[0]];
        var v1 = vertices[f[1]];
        var v2 = vertices[f[2]];
        for (var i = 0; i < subdivide; i++) {
            for (var j = 0; j <= i; j++) {
                subdivided_triangles.push([
                    normalize(interp(v0, v1, v2, i / subdivide, i == 0 ? 0 : j / i)),
                    normalize(interp(v0, v1, v2, (i + 1) / subdivide, j / (i + 1))),
                    normalize(interp(v0, v1, v2, (i + 1) / subdivide, (j + 1) / (i + 1)))
                ]);
                if (j < i) {
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

function MakeSphereMesh(radius: any, subdivide: any) {
    var triangles = MakeSphere(radius, subdivide);
    var GL = require("allofw").GL3;
    var buffer = new Float32Array(triangles.length * 3 * 3);
    var ptr = 0;
    for (var i = 0; i < triangles.length; i++) {
        for (var a = 0; a < 3; a++) {
            for (var b = 0; b < 3; b++) {
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
    GL.vertexAttribPointer(0, 3, GL.FLOAT, GL.FALSE, 12, 0);
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
};

exports.MakeSphereMesh = MakeSphereMesh;
exports.MakeSphere = MakeSphere;
