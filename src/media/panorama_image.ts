var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;
var S3 = allofwutils.shape3d;

function FPanoramaImage(omni: any, filename: any) {
    // Main shader.
    var program = allofwutils.compileShaders({
        vertex: "#version 330\n" + omni.getShaderCode() + `
            layout(location = 0) in vec3 position;
            out vec3 vo_position;
            void main() {
                gl_Position = omni_render(omni_transform(position));
                vo_position = position;
            }
        `,
        fragment: "#version 330\n" + omni.getShaderCode() + `
            #define PI 3.1415926535897932
            in vec3 vo_position;
            uniform sampler2D texImage;
            layout(location = 0) out vec4 fragment_color;
            void main() {
                // Compute lng, lat from the 3D position.
                vec3 position = normalize(vo_position);
                float lng = atan(position.x, position.z);
                float lat = atan(position.y, length(position.xz));
                // You can play with distrotion here by changing lat, lng.

                fragment_color = texture(texImage, vec2(
                    -lng / PI / 2.0 + 0.5,
                    -lat / PI + 0.5
                ));
            }
        `
    });

    // Uniform set to 1.
    GL.useProgram(program);
    GL.uniform1i(GL.getUniformLocation(program, "texImage"), 0);
    GL.useProgram(0);

    var image = allofw.graphics.loadImageData(require("fs").readFileSync(filename));
    // Create an OpenGL texture, set parameters.
    var texture_panorama = new GL.Texture();
    GL.bindTexture(GL.TEXTURE_2D, texture_panorama);

    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);  // longitude set to repeat to avoid seam on the border of the image.
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);   // latitude set to clamp.
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, image.width(), image.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, image.pixels());
    GL.bindTexture(GL.TEXTURE_2D, 0);

    // Make the cube. We render the earth on a cube surface.
    var sphere = require("./panorama.js").MakeSphereMesh(10, 20);

    this.render = function () {
        // Use the main program.
        GL.useProgram(program);
        // Set omnistereo uniforms (pose, eye separation, etc.)
        omni.setUniforms(program.id());
        // Use the earth texture.
        GL.bindTexture(GL.TEXTURE_2D, texture_panorama);
        // Use the cube's vertex array.
        sphere.render();
        // Cleanup.
        GL.bindTexture(GL.TEXTURE_2D, 0);
        GL.useProgram(0);
    }
};

export let PanoramaImage = function (omni: any, filename: any) {
    return new (FPanoramaImage as any)(omni, filename);
}
