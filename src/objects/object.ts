import * as allofw from "allofw";
import { Pose } from "allofw-utils";

export class SceneObject {
    private _pose: Pose;
    private _omni: allofw.IOmniStereo;

    constructor(omni: allofw.IOmniStereo) {
        this._pose = new Pose();
        this._omni = omni;
    }

    public get omni(): allofw.IOmniStereo {
        return this._omni;
    }

    public get pose(): Pose {
        return this._pose;
    }

    public set pose(pose: Pose) {
        this._pose = pose;
    }

    public render(): void {
    }

    public frame(): void {
    }
}