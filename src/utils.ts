import { Vector3 } from "allofw-utils";

export function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function slerp(start: Vector3, end: Vector3, percent: number): Vector3 {
    let v0 = start.normalize();
    let v1 = end.normalize();
    let dot = v0.dot(v1);
    let omega = Math.acos(dot);
    let so = Math.sin(omega);
    let term0 = Math.sin((1.0 - percent) * omega) / so;
    let term1 = Math.sin(percent * omega) / so;
    return start.scale(term0).add(end.scale(term1));
}

export function slerpDistance(start: Vector3, end: Vector3) {
    // An approximation...
    let distance = 0.0;
    let current: Vector3 = start;
    for (var i = 0.0; i <= 1.0; i += 0.05) {
        let next: Vector3 = slerp(start, end, i);
        distance += current.distance(next);
        current = next;
    }
    return distance;
}