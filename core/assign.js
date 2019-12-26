// legal type: number string boolean array object null undefined
let obj_type = function (obj) {
    let type = typeof obj;
    if (type == 'object') {
        if (Array.isArray(obj)) {
            return 'array';
        }
        if (obj === null) {
            return 'null';
        }
    }
    return type;
}

let assign_array = function (dst, src) {
    for (let i = 0; i < src.length; i++) {
        let ts = typeof src[i];
        if (ts == 'object') {
            dst[i] = {};
            assign_object(dst[i], src[i]);
        } else if (ts == 'array') {
            dst[i] = [];
            assign_array(dst[i], src[i]);
        } else {
            dst[i] = src[i];
        }
    }
}

// from src to dst
let assign_object = function (dst, src) {
    for (let k in src) {
        let ts = obj_type(src[k]);
        let td = obj_type(dst[k]);

        if (ts == 'object') {
            if (td == 'undefined') { dst[k] = {}; td = 'object'; }
            if (td == 'object') {
                assign_object(dst[k], src[k]);
            }
        } else if (ts == 'array') {
            if (td == 'undefined') {
                dst[k] = [];
                assign_array(dst[k], src[k]);
            }
        } else if (ts == 'undefined') {
            delete dst[k];
        } else {
            if (td == 'undefined') {
                dst[k] = src[k];
            }
        }
    }
}


// ----------------------------------------------------------------------------
exports.assign_object = assign_object;