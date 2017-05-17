// var shape3d = require("allofwutils").shape3d;


export class SteamParticleObject {


}




// var SteamParticleObject = function () {
//     shape3d.ShapeObject.call(this);
// };

// SteamParticleObject.prototype = Object.create(shape3d.ShapeObject.prototype);
// SteamParticleObject.prototype._vertexShader = function () {
//     return `
//     vec3 position;
//     float radius;
//     vec4 color;

//     out vec3 s3_vo_position;
//     out float s3_vo_radius;
//     out vec4 s3_vo_color;
//     __ATTRIBUTE_LINES__
//     void main() {
//         computeAttributes();
//         s3_vo_position = position;
//         s3_vo_radius = radius;
//         s3_vo_color = color;
//     }
// `;
// };

// SteamParticleObject.prototype._geometryShader = function () {
//     return `
//     layout(points) in;
//     layout(triangle_strip, max_vertices = 50) out;
//     in vec3 s3_vo_position[1];
//     in float s3_vo_radius[1];
//     in vec4 s3_vo_color[1];

//     out vec4 s3_go_color;
//     out vec3 s3_go_position;
//     out vec3 s3_go_center;
//     out float s3_go_radius;

//     #define PI 3.1415926535897932

//     void main() {
//         s3_go_color = s3_vo_color[0];
//         s3_go_radius = s3_vo_radius[0];
//         s3_go_center = s3_vo_position[0];

//         int sides = 10;
//         vec3 position = s3_vo_position[0];
//         float radius = s3_vo_radius[0];
//         vec3 normal = normalize(position - omni_position);
//         vec3 ex = normalize(cross(vec3(0, 1, 0), normal));
//         vec3 ey = normalize(cross(ex, normal));

//         for(int i = 0; i <= sides; i++) {
//             float theta = float(i) / float(sides) * PI * 2.0;
//             vec3 dt = (ex * sin(theta) + ey * cos(theta)) * radius;

//             s3_go_position = position + dt;
//             gl_Position = omni_render(omni_transform(s3_go_position)); EmitVertex();

//             s3_go_position = position;
//             gl_Position = omni_render(omni_transform(s3_go_position)); EmitVertex();
//         }
//         EndPrimitive();
//     }
// `;
// };

// SteamParticleObject.prototype._fragmentShader = function () {
//     return `
//     uniform float specular_term = 20;

//     in vec4 s3_go_color;
//     in vec3 s3_go_position;
//     in vec3 s3_go_center;
//     in float s3_go_radius;

//     layout(location = 0) out vec4 fragment_color;

//     void main() {
//         float r = length(s3_go_center - s3_go_position) / s3_go_radius;
//         fragment_color = s3_go_color;
//         fragment_color.a *= exp(-r * r * 5.0);
//         fragment_color.rgb *= fragment_color.a;
//     }
// `;
// };

// SteamParticleObject.prototype.constructor = SteamParticleObject;

// shape3d.particles = function () {
//     return new SteamParticleObject();
// };
