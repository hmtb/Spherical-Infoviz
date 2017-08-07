var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;
var S3 = allofwutils.shape3d;

function FPanoramaVideoPlayer(omni: any, filename: any, fps: any) {
    var stereo_mode: any;
    if (!stereo_mode) stereo_mode = "mono";
    // Main shader.
    var program = allofwutils.compileShaders({
        vertex: "#version 330\n" + omni.getShaderCode() + `
            layout(location = 0) in vec3 position;
            out vec3 vo_position;
            void main() {
                gl_Position = omni_project(omni_transform(position));
                vo_position = position;
            }
        `,
        fragment: "#version 330\n" + omni.getShaderCode() + `
            #define PI 3.1415926535897932
            in vec3 vo_position;
            uniform sampler2D texImageLeft;
            uniform sampler2D texImageRight;
            uniform float rotation;
            uniform vec4 rotation_quaternion;
            uniform int mirror;
            layout(location = 0) out vec4 fragment_color;
            void main() {
                // Compute lng, lat from the 3D position.
                vec3 position = normalize(vo_position);
                position = omni_quat_rotate(rotation_quaternion, position);
                float lng = atan(position.x, position.z);
                float lat = atan(position.y, length(position.xz));
                // You can play with distrotion here by changing lat, lng.

                if(omni_eye > 0) {
    				if(mirror == 0) {
    	                fragment_color = texture(texImageLeft, vec2(
                    	    (lng + rotation) / PI / 2.0 + 0.5,
                	        -lat / PI + 0.5
            	        ));
            	    } else {
        	            fragment_color = texture(texImageLeft, vec2(
    	                    -(lng + rotation) / PI / 2.0 + 0.5,
                        	-lat / PI + 0.5
                    	));
                    }
				} else {
                    if(mirror == 0) {
                        fragment_color = texture(texImageRight, vec2(
                            (lng + rotation) / PI / 2.0 + 0.5,
                            -lat / PI + 0.5
                        ));
                    } else {
                        fragment_color = texture(texImageRight, vec2(
                            -(lng + rotation) / PI / 2.0 + 0.5,
                            -lat / PI + 0.5
                        ));
                    }
                }
            }
        `
    });

    // Uniform set to 1.
    GL.useProgram(program);
    GL.uniform1i(GL.getUniformLocation(program, "texImageLeft"), 0);
    GL.uniform1i(GL.getUniformLocation(program, "texImageRight"), 1);
    GL.useProgram(0);

    //var color_map = allofw.graphics.loadImageData(require("fs").readFileSync("preprocessed/cm_temperature_-50_30.png"));

    var video = new allofw.graphics.VideoSurface2D(filename);
    // Create an OpenGL texture, set parameters.
    var texture_panorama_left = new GL.Texture();
    var texture_panorama_right = new GL.Texture();
    GL.bindTexture(GL.TEXTURE_2D, texture_panorama_left);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);  // longitude set to repeat to avoid seam on the border of the image.
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);   // latitude set to clamp.
    if (stereo_mode == "mono") {
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
    }
    if (stereo_mode == "top-bottom") {
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height() / 2, 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
    }
    GL.bindTexture(GL.TEXTURE_2D, 0);
    GL.bindTexture(GL.TEXTURE_2D, texture_panorama_right);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.REPEAT);  // longitude set to repeat to avoid seam on the border of the image.
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);   // latitude set to clamp.
    if (stereo_mode == "mono") {
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
    }
    if (stereo_mode == "top-bottom") {
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height() / 2, 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels().slice(video.width() * video.height() / 2 * 4));
    }
    GL.bindTexture(GL.TEXTURE_2D, 0);

    // Make the cube. We render the earth on a cube surface.
    var sphere = require("../media/panorama.js").MakeSphereMesh(5, 20);

    var current_frame_timestamp = 0;

    var did_upload_texture = false;

    var do_next_frame = function (desired_timestamp: any) {
        var updated = false;
        while (current_frame_timestamp < desired_timestamp) {
            current_frame_timestamp += 1.0 / fps;
            if (video.nextFrame()) {
                updated = true;
            }
        }
        if (updated) {
            did_upload_texture = true;
            GL.bindTexture(GL.TEXTURE_2D, texture_panorama_left);
            if (stereo_mode == "mono") {
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
            }
            if (stereo_mode == "top-bottom") {
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height() / 2, 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
            }
            GL.bindTexture(GL.TEXTURE_2D, 0);

            GL.bindTexture(GL.TEXTURE_2D, texture_panorama_right);
            if (stereo_mode == "mono") {
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height(), 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels());
            }
            if (stereo_mode == "top-bottom") {
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, video.width(), video.height() / 2, 0, GL.RGBA, GL.UNSIGNED_BYTE, video.pixels().slice(video.width() * video.height() / 2 * 4));
            }
            GL.bindTexture(GL.TEXTURE_2D, 0);
        }
    };

    var time = 0;
    var start_time = 0;
    var is_started = false;
    var rotation_angle = 0;
    var quaternion = [0, 0, 0, 1];
    var mirror = true;

    this.setTime = function (t: any) {
        time = t;
    };

    this.start = function (timestamp: any) {
        is_started = true;
        start_time = timestamp;
        video.seek(0);
        current_frame_timestamp = 0;
    };

    this.stop = function () {
        is_started = false;
    };

    this.setRotation = function (angle: any) {
        rotation_angle = angle;
    };

    this.setQuaternion = function (quat: any) {
        quaternion = [quat.v.x, quat.v.y, quat.v.z, quat.w];
    };

    this.setMirror = function (m: any) {
        mirror = m;
    };

    this.render = function () {
        if (!is_started) return;
        do_next_frame(time - start_time);
        if (!did_upload_texture) return;

        // Use the main program.
        GL.useProgram(program);
        // Set omnistereo uniforms (pose, eye separation, etc.)
        omni.setUniforms(program.id());
        GL.uniform1f(GL.getUniformLocation(program, "rotation"), rotation_angle);
        GL.uniform4f(GL.getUniformLocation(program, "rotation_quaternion"), quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
        if (mirror) {
            GL.uniform1i(GL.getUniformLocation(program, "mirror"), 1);
        } else {
            GL.uniform1i(GL.getUniformLocation(program, "mirror"), 0);
        }
        // Use the earth texture.
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, texture_panorama_left);
        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, texture_panorama_right);
        GL.activeTexture(GL.TEXTURE0);
        // Use the cube's vertex array.
        sphere.render();
        // Cleanup.
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, 0);
        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, 0);
        GL.activeTexture(GL.TEXTURE0);
        GL.useProgram(0);
    }
};

export let PanoramaVideoPlayer = function (omni: any, filename: any, fps: any) {
    return new (FPanoramaVideoPlayer as any)(omni, filename, fps);
}
