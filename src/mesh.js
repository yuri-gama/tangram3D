export function extractEdgesFromMesh(mesh) {
    let edgeArray = new THREE.EdgesGeometry(mesh.geometry).attributes.position.array;

    let edges = [];
    for (let i = 0; i < edgeArray.length; i += 6) {
        let vertexes = [
            new THREE.Vector3(edgeArray[i], edgeArray[i + 1], edgeArray[i + 2]),
            new THREE.Vector3(edgeArray[i + 3], edgeArray[i + 4], edgeArray[i + 5]),
        ];
        for (let v of vertexes) {
            mesh.localToWorld(v);
        }
        if (Math.abs(vertexes[0].z) > 0.1 || Math.abs(vertexes[1].z) > 0.1) {
            continue;
        }
        edges.push({
            first: vertexes[0],
            second: vertexes[1],
        });
    }
    return edges;
}

export function createMesh(points, color, originX, originY, v) {
    let vectors = points.map(
        (p) => new THREE.Vector2(originX + p[0], originY + p[1])
    ),
        shape = new THREE.Shape(vectors);
        // geometry = new THREE.ShapeGeometry(shape),

    const extrudeSettings = {
        steps: 1,
        depth: v
    }


    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let material = new THREE.MeshPhongMaterial({ color: color });

    return new THREE.Mesh(geometry, material);
}
