export function fitObject(obj, w, h) {
    const kw = obj.width / w;
    const kh = obj.height / h;

    let k = 1;

    k = Math.max(kw, kh);

    obj.width /= k;
    obj.height /= k;
}

export function normalizeRadians(angle) {
    var PI = Math.PI;
    var PI2 = Math.PI * 2;

    angle %= PI2;
    if (angle < 0) angle += PI2;

    return angle;
}