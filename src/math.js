function cross(a, b) {
    let c1 = a[1] * b[2] - a[2] * b[1]
    let c2 = a[2] * b[0] - a[0] * b[2]
    let c3 = a[0] * b[1] - a[1] * b[0]
    return [c1, c2, c3]
}

function dot(a, b) {
    let res = 0
    if (a.length !== b.length) {
        return 0
    }
    for (let i in a) {
        res += a[i] * b[i]
    }
    return res
}

function not(a) {
    return [-a[0], -a[1], -a[2]]
}

export function getLineBetweenPoints(a, b) {
    return cross(a, b)
}

export function getIntersectionBetweenLines(a, b) {
    return cross(a, b)
}

export function pointsOnSameSideOfLine(l, a, b) {
    let normA = [...a], normB = [...b]
    if (a[2] < 0) {
        normA = not(normA)
    }
    if (b[2] < 0) {
        normB = not(normB)
    }
    return (Math.sign(dot(l, normA)) * Math.sign(dot(l, normB)) >= 0)
}

export function pointBetweenPoints(p, a, b) {
    let edge = getLineBetweenPoints(a, b),
        perpendicularThroughA = getLineBetweenPoints(a, [edge[0], edge[1], 0]),
        perpendicularThroughB = getLineBetweenPoints(b, [edge[0], edge[1], 0])
    return (pointsOnSameSideOfLine(perpendicularThroughA, p, b) && pointsOnSameSideOfLine(perpendicularThroughB, p, a))
}

export function segmentsIntersect(a, b, m, n) {
    let ab = getLineBetweenPoints(a, b),
        mn = getLineBetweenPoints(m, n),
        intersection = getIntersectionBetweenLines(ab, mn)

    return (pointBetweenPoints(intersection, a, b) && pointBetweenPoints(intersection, m, n))
}

export function angleBetweenVectors(a, b) {
    const cos = (dot(a, b)) / Math.sqrt(dot(a, a) * dot(b, b))
    const signal = a[0] * b[1] - a[1] * b[0]

    return Math.sign(signal) * Math.acos(cos)
}

export function pointInPositiveSide(l, a) {
    return (dot(l, a) > 0)
}

export function toCartesian(p) {
    return [p[0] / p[2], p[1] / p[2]]
}

export function toProjective(p) {
    return [...p, 1]
}