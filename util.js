

exports.tagsString2ptagsArray = function tagsString2ptagsArray(s) {

    // s = 'a, b'
    tagsArray = s.split(',').map((s)=>s.trim());

    const postgretagsArray = JSON.stringify(tagsArray).replace(/(\[|\])/g,function replacer(match) {
        if (match === '[') return '{'
        if (match === ']') return '}' 
    })

    return "'"+postgretagsArray+"'"
}

exports.toPostgreValues = function toPostgreValues(arr) {

    let res = [];

    for (obj of arr) {

        obj["tags"] = tagsString2ptagsArrayWithoutquotes(obj["tags"])
        res.push(Object.values(obj));
    }
    return res
}

function tagsString2ptagsArrayWithoutquotes(s) {

    // s = 'a, b'
    tagsArray = s.split(',').map((s)=>s.trim());

    const postgretagsArray = JSON.stringify(tagsArray).replace(/(\[|\])/g,function replacer(match) {
        if (match === '[') return '{'
        if (match === ']') return '}' 
    })

    return postgretagsArray
}