import request from "requestV2"
function isInArray(object1,array) {    
    let returnBool = false
    array.forEach(object2 => {
        if (object2 == object1) {
            returnBool = true
        }
    })
    return returnBool;
}

function isInArrayIdx(object1,array,index) {    
    let returnBool = false
    array.forEach(object2 => {
        if (object2[index] == object1) {
            returnBool = true
        }
    })
    return returnBool;
}

const getrequest = function(url) {
    return request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (ChatTriggers)'
        },
        json: true
    });
}

export { isInArray, isInArrayIdx, getrequest }