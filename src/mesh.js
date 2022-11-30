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
        edges.push({
            first: vertexes[0],
            second: vertexes[1],
        });
    }
    return edges;
}

export function createMesh(points, color, originX, originY) {
    let vectors = points.map(
        (p) => new THREE.Vector2(originX + p[0], originY + p[1])
    ),
        shape = new THREE.Shape(vectors),
        geometry = new THREE.ShapeGeometry(shape),
        material = new THREE.MeshBasicMaterial({ color: color });

    return new THREE.Mesh(geometry, material);
}
