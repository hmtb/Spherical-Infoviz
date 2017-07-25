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


export class StudyController {
    public currentVisu: any;
    public currentPanorama: any;
    public currentScene: any;
    app: IRendererRuntime;
    type: any

    constructor(app: IRendererRuntime, currentVisu: any, currentPanorama: any) {
        this.app = app;
        this.currentVisu = currentVisu;
        this.currentPanorama = currentPanorama;
        this.currentScene = 0;
        this.type = {
            PANORAMIC_VIDEO: 'panorama-video',
            PLANAR_VIDEO: 'planar-video',
            PANORAMIC_IMAGE: 'panorama-image',
            PLANAR_IMAGE: 'planar-image',
            DATA_VISUALISATION: 'data-visu',
            TEXT: 'text'
        };
    }


    public loadScene(sceneInfo: any, time: number, startTime: number) {
        //if visualisation is already loaded return
        console.log(sceneInfo)
        if(this.currentScene = sceneInfo.Id)


        switch(sceneInfo.Id) { 
            case 1: { 
                //Scene Basic Exploring
                this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/earth.jpg");
                break; 
            } 
            case 2: { 
                //statements; 
                break; 
            } 
            default: { 
                //statements; 
                break; 
            } 
            } 

        
    }

    public hideScene(media: any) {
        var id = media.id;
        if (!this.currentVisu[id]) return;
        delete this.currentVisu[id];
    }


}