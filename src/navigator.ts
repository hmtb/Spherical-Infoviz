import * as fs from "fs";
import * as zmq from "zmq";
import * as yaml from "js-yaml";
import * as repl from "repl";

import { GL3 as GL } from "allofw"; //http://localhost:10800/
import { IRendererRuntime, WindowNavigation, Vector3, Quaternion, Pose, ISimulatorRuntime } from "allofw-utils";

import { SceneObject, OBJMeshObject, Matterport3DModel, FOVBlockerObject } from "./objects/objects";
import { Logger } from "./logger";

import { PlantsSmoke } from "./objects/smoke";

// Import utility functions
import { randomRange, slerp, slerpDistance } from "./utils";

import { PlanetSteamText } from "./objects/steamWithText";
import { PlanetSteam } from "./objects/steam";
import { PlanetSteamOld } from "./objects/steamOld"


import { Text } from "./objects/text";

import { NormalCO } from "./objects/normal_co2";

import { StandartView } from "./objects/standart";
import { PlanetSpikes } from "./objects/spikes";
import { Coastlines } from "./media/coastlines";
import { PanoramaImage } from "./media/panorama_image";
import { PlanarVideoPlayer } from "./media/planar_video_player";
import { PanoramaVideoPlayer } from "./media/panorama_video_player";
import { PlanarImage } from "./media/planar_image";
var allofwutils = require("allofw-utils");


export class MyNavigator {
    public currentVisu: any;
    public currentPanorama: any;
    app: IRendererRuntime;
    type: any

    constructor(app: IRendererRuntime, currentVisu: any, currentPanorama: any) {
        this.app = app;
        this.currentVisu = currentVisu;
        this.currentPanorama = currentPanorama;
        this.type = {
            PANORAMIC_VIDEO: 'panorama-video',
            PLANAR_VIDEO: 'planar-video',
            PANORAMIC_IMAGE: 'panorama-image',
            PLANAR_IMAGE: 'planar-image',
            DATA_VISUALISATION: 'data-visu',
            TEXT: 'text'
        };
    }


    public loadVisualisation(media: any, time: number, startTime: number) {
        //if visualisation is already loaded return
        console.log(media)
        var id = media.id;
        if (this.currentVisu[id]) return;

        if (media.type == this.type.TEXT) {
            var visu: any = {
                object: new Text(this.app.window, this.app.omni, media.text, startTime),
                renderMode: media.rendermode,
                mode: media.mode
            }
            this.currentVisu[id] = visu;
        }
        if (media.type == this.type.PLANAR_VIDEO) {
            var visu: any = {
                object: PlanarVideoPlayer(this.app.omni, media.filename, media.fps),
                renderMode: media.rendermode
            }
            var center = new allofwutils.Vector3(
                Math.sin(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180),
                Math.sin(media.location.lat * Math.PI / 180),
                Math.cos(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180)
            ).normalize().scale(3.0);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();
            visu.object.setLocation(center, ex, ey, 2);
            visu.object.start(startTime);
            this.currentVisu[id] = visu;
        }
        if (media.type == this.type.PLANAR_IMAGE) {
            var visu: any = {
                object: PlanarImage(this.app.omni, media.filename),
                renderMode: media.rendermode
            }
            var center = new allofwutils.Vector3(
                Math.sin(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180),
                Math.sin(media.location.lat * Math.PI / 180),
                Math.cos(media.location.lon * Math.PI / -180) * Math.cos(media.location.lat * Math.PI / 180)
            ).normalize().scale(media.location.rad);
            var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
            var ey = ex.cross(center).normalize();
            visu.object.setLocation(center, ex, ey, 2);
            console.log(visu);
            this.currentVisu[id] = visu;
        }



        if (media.type == this.type.DATA_VISUALISATION) {
            if (id == 'simulation_smoke') {
                var data = require("d3").csv.parse(require("fs").readFileSync(media.filename, "utf-8"));
                var visu: any = {
                    object: PlantsSmoke(this.app.omni, data),
                    renderMode: media.rendermode
                }
                this.currentVisu[id] = visu;
            }
            else if (id == 'simulation_steam') {
                var data = require("d3").csv.parse(require("fs").readFileSync(media.filename, "utf-8"));
                var visu: any = {
                    object: new PlanetSteam(this.app.window, this.app.omni, data, startTime),
                    renderMode: media.rendermode

                }
                this.currentVisu[id] = visu;
            }
            else if (id == 'simulation_steam_text') {
                var data = require("d3").csv.parse(require("fs").readFileSync(media.filename, "utf-8"));
                var visu: any = {
                    object: new PlanetSteamText(this.app.window, this.app.omni, data, startTime),
                    renderMode: media.rendermode

                }
                this.currentVisu[id] = visu;
            }
            else if (id == 'simulation_steam_old') {
                var data = require("d3").csv.parse(require("fs").readFileSync(media.filename, "utf-8"));
                var visu: any = {
                    object: new PlanetSteamOld(this.app.window, this.app.omni, data, startTime, media.label == "on"),
                    renderMode: media.rendermode

                }
                this.currentVisu[id] = visu;
            }


            else if (id == 'simulation_standart') {
                var visu: any = {
                    object: new StandartView(this.app.window, this.app.omni),
                    renderMode: media.rendermode
                }
                this.currentVisu[id] = visu;
            }
            else if (id == 'simulation_normal') {
                var visu: any = {
                    object: new NormalCO(this.app.window, this.app.omni),
                    renderMode: media.rendermode
                }
                this.currentVisu[id] = visu;
            }
            else if (media.id == 'sphere_coastlines') {

                var visu: any = {
                    object: Coastlines(this.app.omni, info),
                    renderMode: media.rendermode
                }

                this.currentVisu[id] = visu;
            } else if (media.id == 'sphere_coastlines_distortion_A') {


                var info: any = {
                    distortion: `
                                 // Distrotion code.
                                    uniform vec3 distrotion_direction = vec3(0, 0, 1);
                                    uniform float distrotion_radius = 0.05;
                                    uniform float distrotion_strength = 3.0;
                                    vec3 do_distortion(vec3 p) {
                                        p = normalize(p);
                                        float cos_angle = dot(distrotion_direction, p);
                                        float distortion_kernel = max(0.0, 100.0 * (cos_angle - 0.99));
                                        //float distortion_kernel = cos_angle > 0.99 ? 1 : 0;
                                        // float distortion_kernel = exp(-(cos_angle - 1.0) * (cos_angle - 1.0) / distrotion_radius / distrotion_radius);
                                        float y_shift = 0.0 * distortion_kernel * distrotion_strength / 30.0;
                                        float new_radius = 5.0 - distortion_kernel * distrotion_strength;
                                        return p * new_radius + vec3(0, -y_shift, 0);
                                    }
                                    `
                }
                var visu: any = {
                    object: Coastlines(this.app.omni, info),
                    renderMode: media.rendermode
                }

                this.currentVisu[id] = visu;
            } else if (media.id == 'sphere_coastlines_distortion_B') {


                var info: any = {
                    distortion: `
                                // Distrotion code.
                                uniform vec3 distrotion_direction = vec3(0, 0, 1);
                                uniform float distrotion_radius = 0.05;
                                uniform float distrotion_strength = 3.0;
                                vec3 do_distortion(vec3 p) {
                                    p = normalize(p);
                                    float cos_angle = dot(distrotion_direction, p);
                                    float new_radius = 5.0 - exp(-(cos_angle - 1.0) * (cos_angle - 1.0) / distrotion_radius / distrotion_radius) * distrotion_strength;
                                    return p * new_radius;
                                }
                                `
                }
                var visu: any = {
                    object: Coastlines(this.app.omni, info),
                    renderMode: media.rendermode
                }

                this.currentVisu[id] = visu;
            }
            else if (media.id == 'simulation_spikes') {
                var data = require("d3").csv.parse(require("fs").readFileSync(media.filename, "utf-8"));
                var visu: any = {
                    object: PlanetSpikes(this.app.omni, data),
                    renderMode: media.rendermode
                }
                this.currentVisu[id] = visu;
            }
        }
    }

    public hideVisualisation(media: any) {
        var id = media.id;
        if (!this.currentVisu[id]) return;
        delete this.currentVisu[id];
    }


}