import {
    getLineBetweenPoints,
    getIntersectionBetweenLines,
    pointsOnSameSideOfLine,
    segmentsIntersect,
    pointInPositiveSide,
    toProjective,
    toCartesian
} from './math.js'

export function pointInPolygon(point, edges) {
    let intersections = 0
    for (const edge of edges) {
        if (segmentsIntersect([...point, 1], [...point, 0], [...edge.first, 1], [...edge.second, 1])) {
            intersections++
        }
    }
    return (intersections % 2 === 1)
}

export function clippingSutherlandHodgman(clippingEdges, polygonEdges) {
    let clippedPolygonEdges = [...polygonEdges]

    for (const clippingEdge of clippingEdges) {
        let cA = toProjective(clippingEdge.first),
            cB = toProjective(clippingEdge.second),
            line = getLineBetweenPoints(cA, cB)

        let nextPolygonEdges = [],
            waitingPoint = null,
            lastPoint = null
        for (const polygonEdge of clippedPolygonEdges) {
            let pA = toProjective(polygonEdge.first)
            let pB = toProjective(polygonEdge.second)
            if (pointsOnSameSideOfLine(line, pA, pB)) {
                if (!pointInPositiveSide(line, pA)) {
                    nextPolygonEdges.push(polygonEdge)
                }
            } else {
                let segment = getLineBetweenPoints(pA, pB),
                    intersection = toCartesian(getIntersectionBetweenLines(segment, line))
                if (!pointInPositiveSide(line, pA)) {
                    nextPolygonEdges.push({ first: toCartesian(pA), second: intersection })
                    waitingPoint = intersection
                } else {
                    if (waitingPoint)
                        nextPolygonEdges.push({ first: waitingPoint, second: intersection })
                    else
                        lastPoint = intersection
                    nextPolygonEdges.push({ first: intersection, second: toCartesian(pB) })
                    waitingPoint = null
                }
            }
        }

        if (lastPoint && waitingPoint)
            nextPolygonEdges.push({ first: waitingPoint, second: lastPoint })

        clippedPolygonEdges = nextPolygonEdges
    }

    return clippedPolygonEdges
}


export function area(edges) {
    let area = 0
    for (const { first: a, second: b } of edges)
        area += (b[0] - a[0]) * (b[1] + a[1])
    return area / 2
}