import { Tracker } from "./tracker.js";
import { Projector } from "./projector.js";
import { createMesh } from "./mesh.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF)

let clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 180;

const geometry1 = new THREE.PlaneGeometry(180, 180);
const material1 = new THREE.MeshBasicMaterial({
    color: 0x81876e,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry1, material1);
scene.add(plane);

const originY = -90;
const originX = -90;

const v = 10
let shapes = [
    createMesh([[0, 0], [90, 0], [45, 45]], 0xfcefb4, originX, originY, v),
    createMesh([[0, 0], [0, 180], [90, 90]], 0xf2ab7e, originX, originY, v - 0.001),
    createMesh([[0, 180], [180, 180], [90, 90]], 0xfcd888, originX, originY, v + 0.001),
    createMesh([[90, 0], [180, 0], [180, 90]], 0xa9a875, originX, originY, v - 0.002),
    createMesh([[90, 90], [135, 135], [135, 45]], 0xb1be9d, originX, originY, v + 0.002),
    createMesh([[45, 45], [90, 90], [135, 45], [90, 0]], 0xfae588, originX, originY, v - 0.003),
    createMesh([[135, 135], [180, 180], [180, 90], [135, 45]], 0xffcb69, originX, originY, v + 0.003)
];

for (let shape of shapes)
    scene.add(shape);

for (let currentMesh of shapes) {
    let center = new THREE.Vector3();
    currentMesh.geometry.computeBoundingBox();
    currentMesh.geometry.boundingBox.getCenter(center);
    currentMesh.geometry.center();
    currentMesh.position.copy(center);
}

let tracker = new Tracker(shapes, plane, new Projector(camera, renderer));

document.addEventListener("mouseup", (event) => {
    tracker.disable();
}, false);

document.addEventListener("mousedown", (event) => {
    tracker.enable([event.clientX, event.clientY], false);
}, false);

document.addEventListener("mousemove", (event) => {
    tracker.track([event.clientX, event.clientY]);
}, false);

document.addEventListener("keydown", (event) => {
    if (event.key == "r") {
        tracker.enableRotation();
    }
}, false);

document.addEventListener("keyup", (event) => {
    if (event.key == "r") {
        tracker.disableRotation();
    }
}, false);


tracker.randomizer(200)

function animate() {
    requestAnimationFrame(animate);
    camera.position.setX(30*Math.cos(clock.getElapsedTime()));
    camera.position.setY(30*Math.sin(clock.getElapsedTime()));
    camera.lookAt(0, 0, 0);

    let coveredArea = tracker.area()
    // console.log(coveredArea)
    if (0.97 < coveredArea && coveredArea <= 1) {
        alert("You rock!")
        tracker.randomizer(200)
    }
    renderer.render(scene, camera);
}
animate();
