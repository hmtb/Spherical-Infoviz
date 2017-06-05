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

import { PlanetSteam } from "./objects/steam";

import { StandartView } from "./objects/standart";

import { Coastlines } from "./panorama/coastlines";
import { PanoramaImage } from "./panorama/panorama_image";
import { PlanarVideoPlayer } from "./media/planar_video_player";


export class MyNavigator {
    public currentVisu: any;
    app: IRendererRuntime;


    constructor(app: IRendererRuntime, currentVisu: any) {
        this.app = app;
        this.currentVisu = currentVisu;

    }

    public loadPanorama(media: any) {
        if (media.id == 'dark_world') {
            var world = new OBJMeshObject(this.app.omni, "./3DModels/earth/earth.obj", { flipX: true });
            world.pose.position = new Vector3(0, 0, 0);
            world.pose.scale = 0.02;
            return world;
        }
        if (media.id == 'sphere_coastlines') {
            return Coastlines(this.app.omni);
        }
    }

    public loadVisualisation(media: any) {
        var id = media.id;
        if (this.currentVisu[id]) return;

        if (id == 'simulation_steam') {
            var data = require("d3").csv.parse(require("fs").readFileSync("preprocessed/emissionByCountry.csv", "utf-8"));
            var media: any = {
                object: new PlanetSteam(this.app.window, this.app.omni, data)
            }
            this.currentVisu[id] = media;
        }
        if (id == 'simulation_standart') {
            var media: any = {
                object: new StandartView(this.app.window, this.app.omni)
            }
            this.currentVisu[id] = media;
        }

        if (id == 'simulation_smoke') {
            var media: any = {
                object: PlantsSmoke(this.app.omni)
            }
            this.currentVisu[id] = media;
        }

    }

    public hideVisualisation(media: any) {
        var id = media.id;
        if (!this.currentVisu[id]) return;
        delete this.currentVisu[id];
    }


}