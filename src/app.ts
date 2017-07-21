import * as fs from "fs";
import * as zmq from "zmq";
import * as yaml from "js-yaml";
import * as repl from "repl";

import { GL3 as GL } from "allofw"; //http://localhost:10800/
import { IRendererRuntime, WindowNavigation, Vector3, Quaternion, Pose, ISimulatorRuntime } from "allofw-utils";
import { Logger } from "./logger";
import { PanoramaImage } from "./media/panorama_image";
import { PanoramaVideoPlayer } from "./media/panorama_video_player";

import { MyNavigator } from "./navigator";
import { StudyController } from "./studyController";
import { Text } from "./objects/text";
import { Scene1 } from "./objects/studyObject/scene1";
import { Scene2 } from "./objects/studyObject/scene2";
import { PlanarImage } from "./media/planar_image";
import { Scene3 } from "./objects/studyObject/scene3";
import { Scene3_2 } from "./objects/studyObject/scene3_2";
import { Scene4 } from "./objects/studyObject/scene4";
import { Scene5 } from "./objects/studyObject/scene5";
import { Scene6 } from "./objects/studyObject/scene6";
import { Scene7 } from "./objects/studyObject/scene7";
//variables for the study
let currentID = 1;
let targetHeight = 1.65;
let radius = 5;
var coreAudio = require("node-core-audio");
var Speaker = require('speaker');
var allofwutils = require("allofw-utils");
// Create the Speaker instance
var speaker = new Speaker({
  channels: 2,          // 2 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate

});
// PCM data from stdin gets piped into the speaker

export class MainScene {
    type: any;

    private app: IRendererRuntime;
    private nav: WindowNavigation;
    private headPose: Pose;
    private logger: Logger;
    private soundSocket: zmq.Socket;

    //SceneObjects
    private currentPanorama: any;
    private currentVisu: any;

    //Global Vars
    private time: number;
    private time_diff: number;
    private time_start: number;
    private currentYear: number;

    private navigator: MyNavigator;
    private studyController: StudyController;
    private tutorText: Text;
    public currentScene: number;
    


    constructor(app: IRendererRuntime) {
        this.app = app;

        //init default Values
        this.currentYear = 1980;
        this.time = 0;
        this.currentVisu = {};
        this.currentPanorama = PanoramaImage(this.app.omni, "preprocessed/img/earth.jpg")
        this.navigator = new MyNavigator(this.app, this.currentVisu, this.currentPanorama)
        this.studyController = new StudyController(this.app, this.currentVisu, this.currentPanorama)
        this.tutorText = new Text(this.app.window, this.app.omni, null, this.GetCurrentTime());
        this.currentScene = 0;
        this.type = {
            PANORAMIC_VIDEO: 'panorama-video',
            PLANAR_VIDEO: 'planar-video',
            PANORAMIC_IMAGE: 'panorama-image',
            PLANAR_IMAGE: 'planar-image',
            DATA_VISUALISATION: 'data-visu',
            TEXT: 'text'
        };
        //set  Mode
        if (this.isRunningInVR()) {
            this.app.window.setSwapInterval(0);
            this.nav = new WindowNavigation(app.window, app.omni);
            this.nav.setHomePosition(new Vector3(0, -targetHeight, 0));
            this.nav.setPosition(new Vector3(0, -targetHeight, 0));
        } else {
            this.nav = new WindowNavigation(app.window, app.omni);

        }
        this.app.networking.on("text/show", (text: any, startTime: number) => {

            this.tutorText.setText(text.text, text.lat, text.lon, startTime)
        });
        this.app.networking.on("text/hide", (text: any, startTime: number) => {
            this.tutorText.setText("", 0, 0, startTime)
        });

        //Navigaton
        this.app.networking.on("media/show", (media: any, startTime: number) => {
            this.navigator.loadVisualisation(media, this.GetCurrentTime(), startTime);
        });

        this.app.networking.on("media/hide", (media: any) => {
            this.navigator.hideVisualisation(media);
        });

         //Navigaton
        this.app.networking.on("scene/show", (sceneInfo: any, startTime: number) => {
            this.loadScene(sceneInfo, this.GetCurrentTime(), startTime);
        });

        this.app.networking.on("scene/hide", (sceneInfo: any) => {
            this.hideScene(sceneInfo);
        });


        //Navigaton
        this.app.networking.on("data/show", (media: any, startTime: number) => {
            this.navigator.loadVisualisation(media, this.GetCurrentTime(), startTime);
        });

        this.app.networking.on("data/hide", (media: any) => {
            this.navigator.hideVisualisation(media);
        });
        

        this.app.networking.on("panorama/show", (media: any, startTime: number) => {
            //Panorama 
            if (media.type == this.type.PANORAMIC_VIDEO) {
                let player = PanoramaVideoPlayer(this.app.omni, media.filename, media.fps);
                player.start(startTime);
                var visu: any = {
                    object: player,
                    renderMode: media.rendermode,
                    mode: media.mode
                }
                this.currentPanorama = player;
            }
            if (media.type == this.type.PANORAMIC_IMAGE) {
                this.currentPanorama = PanoramaImage(this.app.omni, media.filename);
            }
        });

        this.app.networking.on("panorama/hide", (media: any) => {
            this.currentPanorama = [];
        });
        //stop All Visualisation
        this.app.networking.on("stop", () => {
            this.currentPanorama = [];
            for (let key in this.currentVisu) {
                delete this.currentVisu[key];
            }
        });

        this.time_diff = 0;
        this.time_start = 0;
        app.networking.on("time", (time: number) => {
            this.time_diff = time - new Date().getTime() / 1000;
        });


        this.app.networking.on("year", (y: number) => {
            this.currentYear = y;
        });
    }
    processAudio = function( inputBuffer:any ) {
        // Just print the value of the first sample on the left channel 

    }

    public GetCurrentTime = function () {
        return new Date().getTime() / 1000 + this.time_diff;
    };


    public isRunningInVR() {
        return (this.app.config as any).OpenVR == true;
    }
   

       public loadScene(sceneInfo: any, time: number, startTime: number) {
        //if visualisation is already loaded return
        console.log("hallo",sceneInfo)
      //  if(this.currentScene == sceneInfo.Id)
         this.currentPanorama = [];
        switch(sceneInfo.id) { 
            case '1': { 
                 var visu: any = {
                    object: new Scene1(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break; 
            } 
            case '2': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene2(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                var pic: any = {
                        object: PlanarImage(this.app.omni, "studyData/img/planetBincome.png"),
                        renderMode: 'foreground'
                }
                var center = new allofwutils.Vector3(
                    Math.sin(-180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180),
                    Math.sin(0 * Math.PI / 180),
                    Math.cos(-180 * Math.PI / -180) * Math.cos(0 * Math.PI / 180)
                ).normalize().scale(5);
                var ex = center.cross(new allofwutils.Vector3(0, 1, 0)).normalize();
                var ey = ex.cross(center).normalize();
                pic.object.setLocation(center, ex, ey, 10);
            this.currentVisu[sceneInfo.id+pic] = pic ;
                break; 
            } 
            case '3.1': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene3(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break; 
            } 
              case '3.2': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene3_2(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break; 
            } 
            case '4': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene4(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break; 
            } 
             case '5': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene5(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break; 
            } 
             case '6': { 
                 this.currentPanorama = PanoramaImage(this.app.omni, "studyData/img/PlanetA.jpg");
                 var visu: any = {
                    object: new Scene6(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
                break;
             } 
            case '7': { 
                 var visu: any = {
                    object: new Scene7(this.app.window,this.app.omni,this.GetCurrentTime(),10),
                    renderMode: 'foreground'
                }
                this.currentVisu[sceneInfo.id] = visu;
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

    public frame() {
        if (this.isRunningInVR()) {
            let p = this.app.omni.getHeadPose();
            let headPosition = new Vector3(p[0], p[1], p[2]);
            let headOrientation = new Quaternion(new Vector3(p[3], p[4], p[5]), p[6]).normalize();
            this.headPose = new Pose(headPosition, headOrientation);
            this.nav.update();
        } else {
            this.nav.update();
            this.headPose = this.nav.pose;
        }


        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key];
            visu.object.setTime && visu.object.setTime(this.GetCurrentTime());
            visu.object.frame && visu.object.frame();
            visu.object.setYear && visu.object.setYear(this.currentYear);
            //add objects function if nesecesry
        }

        this.tutorText.setTime(this.GetCurrentTime());
        this.tutorText.frame();
    }


    public render() {
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.enable(GL.BLEND);
        GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
        GL.enable(GL.DEPTH_TEST);

        this.currentPanorama.render && this.currentPanorama.render();
process.stdin.pipe(speaker);
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            if (visu.renderMode == 'background') {
                visu.object.render && visu.object.render();
            }
        }
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            if (visu.renderMode == 'intermediate') {
                visu.object.render && visu.object.render();
            }
        }
        for (let key in this.currentVisu) {
            var visu: any = this.currentVisu[key]
            if (visu.renderMode == 'foreground') {
                visu.object.render && visu.object.render();
            }
        }
        this.tutorText.render();
        GL.disable(GL.BLEND);
        GL.activeTexture(GL.TEXTURE0);
        GL.disable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
    }
}

export class Simulator {
    tStart: number;
    time: number;
    isRunning: boolean;
    app: ISimulatorRuntime;

    constructor(app: ISimulatorRuntime) {
        this.app = app;
        this.isRunning = false;

        // audio
        var audio_connection = require("zmq").socket("pub");
    audio_connection.connect((app.config as any).audio.endpoint);
        function SendAudioMessage(type: number, filename: string, current_time: number, play_time: number, x: number, y: number, z: number) {
            var buffer = new Buffer(8 + 256 + 40);
            buffer.fill(0);
            var pos = 0;
            buffer.writeInt32LE(type, pos); pos += 8;
            buffer.write(filename, pos); pos += 256;
            buffer.writeDoubleLE(current_time, pos); pos += 8;
            buffer.writeDoubleLE(play_time, pos); pos += 8;
            buffer.writeDoubleLE(x, pos); pos += 8;
            buffer.writeDoubleLE(y, pos); pos += 8;
            buffer.writeDoubleLE(z, pos); pos += 8;
            audio_connection.send(buffer);
        }

        function AudioStart(filename: string, time: number, x: number, y: number, z: number) {
            SendAudioMessage(1, filename, GetCurrentTime(), time, x, y, z);
          }
        function AudioStop(filename: string) {
            SendAudioMessage(2, filename, GetCurrentTime(), 0, 0, 0, 0);
        }


        app.server.on("year", (year: number) => {
            console.log(year)
            this.app.networking.broadcast("year", year);
        });

        // app.server.on("scene/set", function (scene_id: string) {
        // });

        app.server.on("stop", () => {
            this.app.networking.broadcast("stop");
        });


        app.server.on("media/show", (media: any) => {
            //console.log("media/show", media);
            this.app.networking.broadcast("media/show", media, GetCurrentTime() + 1);
            if (media.audio) {
                AudioStart(media.audio.filename, GetCurrentTime() + 1, media.audio.x, media.audio.y, media.audio.z);
            }
        });
     


        app.server.on("media/hide", (media: any) => {
            //  console.log("media/hide", media);
            this.app.networking.broadcast("media/hide", media);
            if (media.audio) {
                AudioStop(media.audio.filename);
            }
        });

        app.server.on("panorama/show", (media: any) => {
            this.app.networking.broadcast("panorama/show", media, GetCurrentTime() + 1);
            if (media.audio) {
                AudioStart(media.audio.filename, GetCurrentTime() + 1, media.audio.x, media.audio.y, media.audio.z);
            }
        });


        app.server.on("panorama/hide", (media: any) => {
            this.app.networking.broadcast("panorama/hide", media);
            if (media.audio) {
                AudioStop(media.audio.filename);
            }
        });

        app.server.on("text/show", (text: any) => {
            //console.log("media/show", media);
            this.app.networking.broadcast("text/show", text, GetCurrentTime());
        });
        app.server.on("text/hide", (text: any) => {
            //console.log("media/show", media);
            this.app.networking.broadcast("text/hide", text, GetCurrentTime());
        });

        app.server.on("data/show", (simulation: any) => {
            this.app.networking.broadcast("data/show", simulation, GetCurrentTime() + 1);
        });
        app.server.on("data/hide", (simulation: any) => {
            this.app.networking.broadcast("data/hide", simulation);
        });

        app.server.on("scene/show", (sceneInfo: any) => {
            this.app.networking.broadcast("scene/show", sceneInfo, GetCurrentTime() + 1);
        });
        app.server.on("scene/hide", (sceneInfo: any) => {
            this.app.networking.broadcast("scene/hide", sceneInfo, GetCurrentTime() + 1);
        });

        var time_start = new Date().getTime() / 1000;
        var GetCurrentTime = function () {
            return new Date().getTime() / 1000 - time_start;
        };
        setInterval(() => {
            this.app.networking.broadcast("time", GetCurrentTime());
            SendAudioMessage(0, "", GetCurrentTime(), 0, 0, 0, 0);
        }, 20);
    }
}



export let simulator = Simulator;
export let renderer = MainScene;
