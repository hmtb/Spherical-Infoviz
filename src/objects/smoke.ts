var shape3d = require("allofw-shape3d");
var allofwutils = require("allofw-utils");
var ParticleObject = function () {
    shape3d.ShapeObject.call(this);
};

ParticleObject.prototype = Object.create(shape3d.ShapeObject.prototype);
ParticleObject.prototype._vertexShader = function () {
    return `
    vec3 position;
    float radius;
    vec4 color;

    out vec3 s3_vo_position;
    out float s3_vo_radius;
    out vec4 s3_vo_color;
    __ATTRIBUTE_LINES__
    void main() {
        computeAttributes();
        s3_vo_position = position;
        s3_vo_radius = radius;
        s3_vo_color = color;
    }
`;
};

ParticleObject.prototype._geometryShader = function () {
    return `
    layout(points) in;
    layout(triangle_strip, max_vertices = 50) out;
    in vec3 s3_vo_position[1];
    in float s3_vo_radius[1];
    in vec4 s3_vo_color[1];

    out vec4 s3_go_color;
    out vec3 s3_go_position;
    out vec3 s3_go_center;
    out float s3_go_radius;

    #define PI 3.1415926535897932

    void main() {
        s3_go_color = s3_vo_color[0];
        s3_go_radius = s3_vo_radius[0];
        s3_go_center = s3_vo_position[0];

        int sides = 10;
        vec3 position = s3_vo_position[0];
        float radius = s3_vo_radius[0];
        vec3 normal = normalize(position - omni_position);
        vec3 ex = normalize(cross(vec3(0, 1, 0), normal));
        vec3 ey = normalize(cross(ex, normal));

        for(int i = 0; i <= sides; i++) {
            float theta = float(i) / float(sides) * PI * 2.0;
            vec3 dt = (ex * sin(theta) + ey * cos(theta)) * radius;

            s3_go_position = position + dt;
            gl_Position = omni_render(omni_transform(s3_go_position)); EmitVertex();

            s3_go_position = position;
            gl_Position = omni_render(omni_transform(s3_go_position)); EmitVertex();
        }
        EndPrimitive();
    }
`;
};

ParticleObject.prototype._fragmentShader = function () {
    return `
    uniform float specular_term = 20;

    in vec4 s3_go_color;
    in vec3 s3_go_position;
    in vec3 s3_go_center;
    in float s3_go_radius;

    layout(location = 0) out vec4 fragment_color;

    void main() {
        float r = length(s3_go_center - s3_go_position) / s3_go_radius;
        fragment_color = s3_go_color;
        fragment_color.a *= exp(-r * r * 5.0);
        fragment_color.rgb *= fragment_color.a;
    }
`;
};

ParticleObject.prototype.constructor = ParticleObject;

shape3d.particles = function () {
    return new (ParticleObject as any)();
};

var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;
var S3 = allofwutils.shape3d;

var FPlantsSmoke = function (omni: any, data: any) {

    // actual visualization code starts here
    // experimental code for creating 3D objects from data

    // Some global variables needed later
    // the maximum value in the data set
    var maxval = 20000000;
    // the radius of the Allosphere
    var aradius = 5.0;
    // the length of the longest cube
    var maxlen = 8.0;

    // the buffer containing the plant data
    // var data = [];
    var none = [];
    // Generate some random data.
    // for(var i = 1; i <= 0; i++) {
    //     data.push( {
    //  lat: Math.PI * (Math.random() - 0.5),
    //  lon: 2 * Math.PI * (Math.random()),
    //  val: maxval * Math.random()
    //     } );
    // }

    // read in plant data from a CSV file


    var RNG_Uniform = function (a: any, b: any) {
        return Math.random() * (b - a) + a;
    };

    // Generate particles with data.
    var particles = [];
    for (var d of data) {
        // Control: the number of particles is determined by the data value (from 0 to 500, quadratic relationship);
        var count = Math.ceil(Math.pow(d.val / maxval, 2) * 800);
        for (var i = 0; i < count; i++) {
            var p = new allofwutils.Vector3(
                Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
                Math.sin(d.lat * Math.PI / 180),
                Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)
            ).normalize().scale(5);
            var up = new allofwutils.Vector3(0, 1, 0);
            var e1 = p.cross(up).normalize();
            var e2 = e1.cross(p).normalize();
            var angle = RNG_Uniform(0, Math.PI * 2);
            var r = 0.4; // how much the smoke spread.
            var cp = p.add(e1.scale(Math.cos(angle) * r)).add(e2.scale(Math.sin(angle) * r));
            cp = cp.normalize().scale(2);
            particles.push({
                p_start: p,
                p_control: cp,
                p_end: new allofwutils.Vector3(0, -0.5, 0),
                speed: RNG_Uniform(0.1, 0.5),
                radius: RNG_Uniform(0.01, 0.05),
                phase: RNG_Uniform(0, 1)
            });
        }
    }

    var smoke = shape3d.particles()
        // Each particle follows a cubic spline.
        .attr("vec3", "position", "mix(mix(p_start, p_control, mod(phase + time * speed, t_near)), mix(p_control, p_end, mod(phase + time * speed, t_near)), mod(phase + time * speed, t_near))")
        // Color fades out when near the viewer.
        .attr("vec4", "color", "vec4(1, 1, 1, sqrt(t_near - mod(phase + time * speed, t_near)))")
        // Radius is randomized (see above).
        .attr("float", "radius", "rad")
        // Variables are bound to data.
        .variable("vec3", "p_start", (d: any) => [d.p_start.x, d.p_start.y, d.p_start.z])
        .variable("vec3", "p_control", (d: any) => [d.p_control.x, d.p_control.y, d.p_control.z])
        .variable("vec3", "p_end", (d: any) => [d.p_end.x, d.p_end.y, d.p_end.z])
        .variable("float", "speed", (d: any) => d.speed)
        .variable("float", "rad", (d: any) => d.radius)
        .variable("float", "phase", (d: any) => d.phase)
        .uniform("float", "time", 0)
        // Control: How near the particle is to the viewer.
        .uniform("float", "t_near", 0.8)
        // Compile after specifying everything.
        .compile(omni)
        // Put the data into it.
        .data(particles);

    var texts = shape3d.texts()
        //    .attr("vec3", "center", "5.0 * normalize(pos)")
        .attr("vec3", "center", "4.9 * normalize(pos)")
        .attr("vec3", "up", "vec3(0, 1, 0)")
        .attr("vec3", "normal", "-normalize(pos)")
        .attr("float", "scale", "0.0005 * len")
        .text((d: any) => (d.name))
        // Variables are bound to data.
        .variable("vec3", "pos", (d: any) => [
            Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
            Math.sin(d.lat * Math.PI / 180),
            Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
        .variable("float", "len", (d: any) => (maxlen * d.val / maxval))
        .compile(omni)
        .data(data);

    var current_time = 0;
    var time_start = new Date().getTime() / 1000;
    this.setTime = function (t: any) {
        current_time = t;
    };

    this.frame = function () { }
    this.render = function () {

        smoke.uniform("float", "time", current_time);
        GL.depthMask(GL.FALSE);
        smoke.render(omni);
        GL.depthMask(GL.TRUE);
        texts.render(omni);
    };


};

export let PlantsSmoke = function (omni: any, data: any) { return new (FPlantsSmoke as any)(omni, data); };
