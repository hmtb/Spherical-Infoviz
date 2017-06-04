// import * as fs from "fs";
// import * as zmq from "zmq";
// import * as yaml from "js-yaml";
// import * as repl from "repl";

// import { GL3 as GL } from "allofw"; //http://localhost:10800/
// import { IRendererRuntime, WindowNavigation, Vector3, Quaternion, Pose, ISimulatorRuntime } from "allofw-utils";

// import { SceneObject, OBJMeshObject, Matterport3DModel, FOVBlockerObject } from "../objects/objects";
// import { Logger } from "../logger";

// import { PlantsSmoke } from "../objects/smoke";

// // Import utility functions
// import { randomRange, slerp, slerpDistance } from "../utils";

// import { PlanetSteam } from "../objects/steam";

// import { StandartView } from "../objects/standart";




// export class Media {
//     tStart: number;
//     isRunning: boolean;
//     app: ISimulatorRuntime;
//     constructor(app: ISimulatorRuntime) {
//         this.app = app;
//     }

//     public loadMedia(media: any) {

//         if (media.type == "video") {
//             this.app.networking.broadcast("video/load", media.filename, media.fps);
//             this.app.networking.broadcast("video/start", media.filename, video_start_time);
//             TransitionControl(0.4, function (t) {
//                 var center = new allofwutils.math.Vector3(
//                     Math.sin(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180),
//                     Math.sin(media.location.lat * Math.PI / 180),
//                     Math.cos(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180)
//                 ).normalize().scale(5.0 - 3.0 * t);
//                 var ex = center.cross(new allofwutils.math.Vector3(0, 1, 0)).normalize();
//                 var ey = ex.cross(center).normalize();
//                 this.app.networking.broadcast("video/location", media.filename, center, ex, ey, t);
//             });
//         }
//         if (media.type == "panoramic-video") {
//             this.app.networking.broadcast("panovideo/load", media.filename, media.fps);
//             this.app.networking.broadcast("panovideo/start", media.filename, video_start_time);
//         }
//         if (media.type == "image") {
//             this.app.networking.broadcast("image/load", media.filename);
//             TransitionControl(0.4, function (t) {
//                 var center = new allofwutils.math.Vector3(
//                     Math.sin(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180),
//                     Math.sin(media.location.lat * Math.PI / 180),
//                     Math.cos(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180)
//                 ).normalize().scale(5.0 - 3.0 * t);
//                 var ex = center.cross(new allofwutils.math.Vector3(0, 1, 0)).normalize();
//                 var ey = ex.cross(center).normalize();
//                 this.app.networking.broadcast("image/location", media.filename, center, ex, ey, t);
//             });
//         }
//         if (media.type == "panoramic-image") {
//             this.app.networking.broadcast("panoimage/load", media.filename);
//             this.app.networking.broadcast("panoimage/show", media.filename);
//         }
//         if (media.filename_audio) {
//             var audio_position = new allofwutils.math.Vector3(
//                 Math.sin(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180),
//                 Math.sin(media.location.lat * Math.PI / 180),
//                 Math.cos(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180)
//             );
//             AudioStart(media.filename_audio, video_start_time, audio_position.x, audio_position.y, audio_position.z);
//         }
//     }
// }