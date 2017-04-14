import { GL3 as GL, graphics } from "allofw";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

export interface IMTLMaterial {
    name: string;

    Ka: number[];
    Kd: number[];
    Ks: number[];
    d: number;
    Ns: number;
    illum: number;

    map_Ka?: ITextureMap;
    map_Kd?: ITextureMap;
    map_Ks?: ITextureMap;
    map_D?: ITextureMap;
    map_bump?: ITextureMap;
}

export interface ITextureMap {
    filename: string;
    texture?: GL.Texture;
    surface?: graphics.Surface2D;
}

export interface IWavefrontOBJModelGroup {
    materialName: string;
    triangles: number[][];
}

export interface IWavefrontOBJModel {
    materials: { [ name: string ]: IMTLMaterial };
    groups: IWavefrontOBJModelGroup[];
}

function readFileAsLines(filename: string): string[] {
    let fileContent = fs.readFileSync(filename, 'utf8');
    let lines = fileContent.split(/[\r\n]+/).map(function(x) { return x.trim(); });
    return lines.filter(l => l.length > 0 && l[0] != "#");
}

function getStringParameter(line: string) {
    let m = line.match(/[a-zA-Z\_0-9]+[ \t]+(.*?)[ \t]*$/i);
    if(m) {
        return m[1];
    } else {
        return null;
    }
}

function resolveIndex<ArrayType>(array: ArrayType[], index: number): ArrayType {
    if(index > 0) {
        return array[index - 1];
    } else {
        return array[array.length + index];
    }
}

export function loadMap(filename: string): ITextureMap {
    if(filename == null) return null;
    let surface = graphics.loadImageData(fs.readFileSync(filename));
    surface.uploadTexture();
    return {
        filename: filename,
        surface: surface
    };
}

export function createDefaultMaterial(name: string): IMTLMaterial {
    return {
        name: name,
        Ka: [ 0.1, 0.1, 0.1 ],
        Kd: [ 0.8, 0.8, 0.8 ],
        Ks: [ 0.0, 0.0, 0.0 ],
        d: 1,
        Ns: 10,
        illum: 2
    }
}

export function readMaterialFile(filename: string): IMTLMaterial[] {
    let lines = readFileAsLines(filename);
    let currentMaterial = null;
    let result: IMTLMaterial[] = [];
    for(let line of lines) {
        let args = line.split(/[ \t]+/g);
        switch(args[0].toLowerCase()) {
            case "newmtl": {
                if(currentMaterial) {
                    result.push(currentMaterial);
                }
                let name = getStringParameter(line);
                currentMaterial = createDefaultMaterial(name);
            } break;
            case "ka": {
                currentMaterial.Ka = [ +args[1], +args[2], +args[3] ];
            } break;
            case "kd": {
                currentMaterial.Kd = [ +args[1], +args[2], +args[3] ];
            } break;
            case "ks": {
                currentMaterial.Ks = [ +args[1], +args[2], +args[3] ];
            } break;
            case "d": {
                currentMaterial.d = +args[1];
            } break;
            case "ns": {
                currentMaterial.Ns = +args[1];
            } break;
            case "illum": {
                currentMaterial.illum = +args[1];
            } break;
            case "map_ka": {
                let p = getStringParameter(line);
                if(p != null) {
                    currentMaterial.map_Ka = loadMap(path.resolve(path.dirname(filename), p));
                }
            } break;
            case "map_kd": {
                let p = getStringParameter(line);
                if(p != null) {
                    currentMaterial.map_Kd = loadMap(path.resolve(path.dirname(filename), p));
                }
            } break;
            case "map_ks": {
                let p = getStringParameter(line);
                if(p != null) {
                    currentMaterial.map_Ks = loadMap(path.resolve(path.dirname(filename), p));
                }
            } break;
            case "map_d":
            case "map_opacity": {
                let p = getStringParameter(line);
                if(p != null) {
                    currentMaterial.map_D = loadMap(path.resolve(path.dirname(filename), p));
                }
            } break;
            case "map_bump":
            case "bump": {
                let p = getStringParameter(line);
                if(p != null) {
                    currentMaterial.map_bump = loadMap(path.resolve(path.dirname(filename), p));
                }
            } break;
            default: {
                console.log(args);
            } break;
        }
    }
    if(currentMaterial) {
        result.push(currentMaterial);
    }
    return result;
}

export function loadWavefrontOBJModel(filename: string): IWavefrontOBJModel {
    let materials: { [ name: string ]: IMTLMaterial } = {};
    let groups: IWavefrontOBJModelGroup[] = [];

    let lines = readFileAsLines(filename);

    let vertices: number[][] = [];
    let vertexNormals: number[][] = [];
    let textureCoordinates: number[][] = [];

    let materialGroups: { [ name: string ]: number[][] } = {};

    let currentMaterial = "__allofw_default__";

    materials[currentMaterial] = createDefaultMaterial(currentMaterial);

    for(let line of lines) {
        let args = line.split(/[ \t]+/g);

        switch(args[0].toLowerCase()) {
            case "mtllib": {
                let mtlName = getStringParameter(line);
                let mtlPath = path.resolve(path.dirname(filename), mtlName);
                let mtls = readMaterialFile(mtlPath);
                for(let mtl of mtls) {
                    materials[mtl.name] = mtl;
                }
            } break;
            case "usemtl": {
                currentMaterial = getStringParameter(line);
            } break;
            case "g": {
                // verticesGroupOffset = vertices.length;
                // vertexNormalsGroupOffset = vertexNormals.length;
                // textureCoordinatesGroupOffset = textureCoordinates.length;
            } break;
            case "v": {
                vertices.push([ +args[1], +args[2], +args[3] ]);
            } break;
            case "vn": {
                vertexNormals.push([ +args[1], +args[2], +args[3] ]);
            } break;
            case "vt": {
                textureCoordinates.push([ +args[1], +args[2] ]);
            } break;
            case "f": {
                let fvs = args.slice(1).map(arg => {
                    let params = arg.split("/");
                    let v = resolveIndex(vertices, +params[0]);
                    let vt = params[1] != null ? resolveIndex(textureCoordinates, +params[1]) : [ 0, 0 ];
                    let vn = params[2] != null ? resolveIndex(vertexNormals, +params[2]) : [ 0, 0, 1 ];
                    return v.concat(vn).concat(vt);
                });
                let triangles: number[][] = [];
                for(let i = 0; i < fvs.length - 2; i++) {
                    let triangle = fvs[0].concat(fvs[i + 1]).concat(fvs[i + 2]);
                    triangles.push(triangle);
                }
                if(materialGroups[currentMaterial] == null) {
                    materialGroups[currentMaterial] = triangles;
                } else {
                    let ts = materialGroups[currentMaterial];
                    for(let triangle of triangles) {
                        ts.push(triangle);
                    }
                }
            } break;
            case "s": {
                // TODO: Smoothing?
            } break;
            default: {
                console.log(args);
            } break;
        }
    }

    for(let groupName in materialGroups) {
        groups.push({
            materialName: groupName,
            triangles: materialGroups[groupName]
        });
    }

    return {
        materials: materials,
        groups: groups
    };
}

export function centerWavefrontOBJModel(model: IWavefrontOBJModel) {
    let minX = 1e10, maxX = -1e10;
    let minY = 1e10, maxY = -1e10;
    let minZ = 1e10, maxZ = -1e10;
    for(let g of model.groups) {
        for(let triangle of g.triangles) {
            for(let i = 0; i < 3; i++) {
                let x = triangle[i * 8];
                let y = triangle[i * 8 + 1];
                let z = triangle[i * 8 + 2];
                if(x < minX) minX = x;
                if(x > maxX) maxX = x;
                if(y < minY) minY = y;
                if(y > maxY) maxY = y;
                if(z < minZ) minZ = z;
                if(z > maxZ) maxZ = z;
            }
        }
    }
    let centerX = (minX + maxX) / 2;
    let centerY = (minY + maxY) / 2;
    let centerZ = (minZ + maxZ) / 2;
    let size = Math.max(maxX - centerX, maxY - centerY, maxZ - centerZ);
    for(let g of model.groups) {
        for(let triangle of g.triangles) {
            for(let i = 0; i < 3; i++) {
                triangle[i * 8] = (triangle[i * 8] - centerX) / size;
                triangle[i * 8 + 1] = (triangle[i * 8 + 1] - centerY) / size;
                triangle[i * 8 + 2] = (triangle[i * 8 + 2] - centerZ) / size;
            }
        }
    }
}

// loadWavefrontOBJModel("./3DModels/SOCCERBALL_OBJ/Soccer ball.obj");
// loadWavefrontOBJModel("./3DModels/BASKETBALL_BALL_OBJ/Basketball.obj");
// loadWavefrontOBJModel("./3DModels/earth/earth.obj");
// loadWavefrontOBJModel("./3DModels/angel_lucy/angel_lucy.obj");