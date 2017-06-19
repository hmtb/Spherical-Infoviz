var shape3d = require("allofw-shape3d");
var allofwutils = require("allofw-utils");
var SpikeObject = function () {
    shape3d.ShapeObject.call(this);
};

SpikeObject.prototype = Object.create(shape3d.ShapeObject.prototype);
SpikeObject.prototype._vertexShader = function () {
    return `
    vec3 basement;
    float radius;
    vec3 tip;
    vec4 color;

    out vec4 _colors;
    out vec3 _basements;
    out float _radiuses;
    out vec3 _tips;
    __ATTRIBUTE_LINES__
    void main() {
        computeAttributes();
        _colors = color;
        _basements = basement;
        _tips = tip;
        _radiuses = radius;
    }
`;
};

SpikeObject.prototype._geometryShader = function () {
    return `
    layout(points) in;
    layout(triangle_strip, max_vertices = 50) out;
    in vec4 _colors[1];
    in vec3 _basements[1];
    in vec3 _tips[1];
    in float _radiuses[1];

    out vec4 color;
    out vec3 normal;
    out vec3 position;

    #define PI 3.1415926535897932

    void main() {
        color = _colors[0];

        int sides = 10;
        vec3 tip = _tips[0];
        vec3 basement = _basements[0];
        float radius = _radiuses[0];
        vec3 spike_normal = normalize(tip - basement);
        vec3 ex = normalize(cross(vec3(0, 1, 0), spike_normal));
        vec3 ey = normalize(cross(ex, spike_normal));

        for(int i = 0; i <= sides; i++) {
            float theta = float(i) / float(sides) * PI * 2.0;
            vec3 dt = (ex * sin(theta) + ey * cos(theta)) * radius;

            normal = normalize(cross(basement + dt - tip, cross(dt, basement + dt - tip)));
            normal = omni_transform_normal(normal);

            position = basement + dt;
            position = omni_transform(position);
            gl_Position = omni_render(position); EmitVertex();

            position = tip;
            position = omni_transform(position);
            gl_Position = omni_render(position); EmitVertex();
        }
        EndPrimitive();
    }
`;
};

SpikeObject.prototype._fragmentShader = function () {
    return `
    uniform float specular_term = 20;
    uniform vec3 light_position = vec3(0, 1, 0);
    uniform vec4 light_ambient = vec4(0.3, 0.3, 0.3, 1.0);
    uniform vec4 light_diffuse = vec4(0.7, 0.7, 0.7, 1.0);
    uniform vec4 light_specular = vec4(1.0, 1.0, 1.0, 1.0);

    in vec4 color;
    in vec3 normal;
    in vec3 position;

    layout(location = 0) out vec4 fragment_color;

    void main() {
        vec3 N = normalize(normal);
        vec3 L = normalize(omni_transform(light_position) - position);
        vec3 R = reflect(-L, N);

        vec4 colorMixed = color;
        vec4 final_color = colorMixed * light_ambient;

        float lambertTerm = max(dot(N, L), 0.0);
        final_color += light_diffuse * colorMixed * lambertTerm;
        vec3 E = normalize(-position);
        float spec = pow(max(dot(R, E), 0.0), specular_term);
        final_color += light_specular * spec;
        final_color.a = color.a;
        final_color.rgb *= final_color.a;
        fragment_color = final_color;
    }
`;
};

SpikeObject.prototype.constructor = SpikeObject;

shape3d.spikes = function () {
    return new (SpikeObject as any)();
};

var allofw = require("allofw");
var allofwutils = require("allofw-utils");
var GL = allofw.GL3;
var S3 = allofwutils.shape3d;



var FPlantsSpikes = function (omni: any) {


    var maxval = 36336000;
    // the radius of the Allosphere
    var aradius = 5.0;
    // the length of the longest cube
    var maxlen = 4.0;

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
    var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/AllPowerPlants.csv", "utf-8"));

    // Cube objects at given lat/lon with height = val
    // basic proportions are 0.25 * 0.25 * 1
    // what's missing right now is the orientation by lat and lon
    var spikes = shape3d.spikes()
        .attr("vec3", "tip", "(5.0 - len) * normalize(pos) + vec3(0.0, -0.5, 0.0)")
        .attr("vec3", "basement", "5.0 * normalize(pos)")
        .attr("vec4", "color", "vec4(1,1,1,1)")
        .attr("float", "radius", "rad")
        // Variables are bound to data.
        .variable("vec3", "pos", (d: any) => [
            Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
            Math.sin(d.lat * Math.PI / 180),
            Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
        .variable("float", "len", (d: any) => (maxlen * d.val / maxval))
        .variable("float", "rad", (d: any) => (0.5 * d.val / maxval))

        // .uniform("vec3", "light_position", "vec3(1, 0, 0)")
        // Compile after specifying everything.
        .compile(omni)
        // Put the data into it.
        .data(data);

    var texts = shape3d.texts()
        //    .attr("vec3", "center", "5.0 * normalize(pos)")
        .attr("vec3", "center", "(5.0 - len) * normalize(pos) + vec3(0.0, -0.5, 0.0)")
        .attr("vec3", "up", "vec3(0, 1, 0.001)")
        .attr("vec3", "normal", "-normalize(pos)")
        .attr("float", "scale", "0.001")
        .text((d: any) => (d.name))
        // Variables are bound to data.
        .variable("vec3", "pos", (d: any) => [
            Math.sin(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180),
            Math.sin(d.lat * Math.PI / 180),
            Math.cos(d.lon * Math.PI / -180) * Math.cos(d.lat * Math.PI / 180)])
        .variable("float", "len", (d: any) => (maxlen * d.val / maxval))
        .compile(omni)
        .data(data);

    this.render = function () {
        spikes.render(omni);
        texts.render(omni);
    };

};

export let PlanetSpikes = function (omni: any) { return new (FPlantsSpikes as any)(omni); };
