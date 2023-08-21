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

function getPetLevel(petExp, offsetRarity, maxLevel) {
    const offset = {
        COMMON: 0,
        UNCOMMON: 6,
        RARE: 11,
        EPIC: 16,
        LEGENDARY: 20,
        MYTHIC: 20
      };
      
    const levellist = [
        100, 110, 120, 130, 145, 160, 175, 190, 210, 230, 250, 275, 300, 330, 360, 400, 440, 490, 540, 600, 660, 730, 800,
        880, 960, 1050, 1150, 1260, 1380, 1510, 1650, 1800, 1960, 2130, 2310, 2500, 2700, 2920, 3160, 3420, 3700, 4000, 4350,
        4750, 5200, 5700, 6300, 7000, 7800, 8700, 9700, 10800, 12000, 13300, 14700, 16200, 17800, 19500, 21300, 23200, 25200,
        27400, 29800, 32400, 35200, 38200, 41400, 44800, 48400, 52200, 56200, 60400, 64800, 69400, 74200, 79200, 84700, 90700,
        97200, 104200, 111700, 119700, 128200, 137200, 146700, 156700, 167700, 179700, 192700, 206700, 221700, 237700, 254700,
        272700, 291700, 311700, 333700, 357700, 383700, 411700, 441700, 476700, 516700, 561700, 611700, 666700, 726700,
        791700, 861700, 936700, 1016700, 1101700, 1191700, 1286700, 1386700, 1496700, 1616700, 1746700, 1886700, 0, 5555,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
        1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700
    ];

    const rarityOffset = offset[offsetRarity];
    const levels = levellist.slice(rarityOffset, rarityOffset + maxLevel - 1);

    let xpTotal = 0;
    let level = 1;
  
    for (let i = 0; i < maxLevel; i++) {
      xpTotal += levels[i];
  
      if (xpTotal > petExp) {
        xpTotal -= levels[i];
        break;
      } else {
        level++;
      }
    }
  
    if (level > maxLevel) {
      level	= maxLevel
    }
  
    return level
}

function getCataLevel(xp) {
    const cataLevelArray = [
        0, 50, 125, 235, 395, 625, 955, 1425, 2095, 3045, 4385, 6275, 8940, 12700, 17960, 25340,
        35640, 50040, 70040, 97640, 135640, 188140, 259640, 356640, 488640, 668640, 911640, 1239640,
        1684640, 2284640, 3084640, 4149640, 5559640, 7459640, 9959640, 13259640, 17559640, 23159640,
        30359640, 39559640, 51559640, 66559640, 85559640, 109559640, 139559640, 177559640, 225559640,
        285559640, 360559640, 453559640, 569809640
    ];

    let cata = -1
    for (let i = 0; i < cataLevelArray.length; i++) {
        if (cataLevelArray[i] <= xp) {
            cata += 1
        }
    }
    if (cata == 50) cata += Math.floor((xp-569809640)/200000000)
    return cata
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function upload(image) {
    return request({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        headers: {
            Authorization: `Client-ID d30c6dc9941b52b`,
        },
        body: {
            image
        },
        json: true
    });
};

export { isInArray, isInArrayIdx, getrequest, getPetLevel, getCataLevel, getKeyByValue, upload }