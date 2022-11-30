export class Projector {
    constructor(camera, renderer) {
        this.camera = camera
        this.renderer = renderer
    }

    projectWindowIntoWorld(pos) {
        return this.projectCanvasIntoWorld(this.projectWindowIntoCanvas(pos))
    }

    projectWindowIntoCanvas(pos) {
        let canvasRect = this.renderer.domElement.getBoundingClientRect()
        return [pos[0] - canvasRect.left, pos[1] - canvasRect.top]
    }

    projectCanvasIntoWorld(pos) {
        this.camera.updateWorldMatrix()

        let canvasRect = this.renderer.domElement.getBoundingClientRect(),
            pointingRay = new THREE.Vector3(
                2 * pos[0] / canvasRect.width - 1,
                -2 * pos[1] / canvasRect.height + 1,
                this.camera.position.z,
            ).unproject(this.camera).sub(this.camera.position).normalize()
        pointingRay.multiplyScalar(-this.camera.position.z / pointingRay.z)
        let worldPos = new THREE.Vector3().copy(this.camera.position).add(pointingRay)
        return [worldPos.x, worldPos.y]
    }

    projectWorldIntoCanvas(pos) {
        this.camera.updateMatrixWorld()

        let ndcPos = new THREE.Vector3(pos.x, pos.y, pos.z).project(this.camera),
            canvasRect = this.renderer.domElement.getBoundingClientRect()
        return [(ndcPos.x + 1) * canvasRect.width / 2, (1 - ndcPos.y) * canvasRect.height / 2]
    }
}