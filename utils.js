import request from "requestV2"
import RenderLib from "RenderLib"
import renderBeaconBeam from "../BeaconBeam"

/**
 * Checks if an array made of smaller array includes a value at a specified index in the inner array.
 * @param {any} object1 The object to check for.
 * @param {Array[]} array The array to look through. 
 * @returns {bool} If the value exists.
 */
function isInArrayIdx(object1,array,index) {    
    let returnBool = false
    array.forEach(object2 => {
        if (object2[index] == object1) {
            returnBool = true
        }
    })
    return returnBool;
}

/**
 * A shorthand for requestv2
 * @param {url} url The url to request.
 * @returns The request body.
 */
const getrequest = function(url) {
    return request({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (ChatTriggers)'
        },
        json: true
    });
}


/**
 * Calculates a pet's level.
 * @param {Number} petExp The Current xp of a pet.
 * @param {String} offsetRarity The rarity of a pet.
 * @returns The level of a pet.
 */
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

/**
 * Calculate a player's cata level.
 * @param {Number} xp The cata xp of a player.
 * @returns The cata level of a player.
 */
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

/**
 * Gets a JSON Key by it's value.
 * @param {JSON} object The JSON object.
 * @param {any} value The value of they key to look for.
 * @returns The Key in which the value is held.
 */
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

/**
 * Uploads an image to Imgur.com
 * @param {Image} image 
 * @returns The request body including the link to the image.
 */
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

/**
 * Calculate the distance between 2 places in 3D Space.
 * @param {Number[3]} p1 Start Place.
 * @param {Number[3]} p2 End Place.
 * @returns The Distance between the 2 places.
 */
function calculateDistanceQuick(p1, p2) {
    var a = p2[0] - p1[0];
    var b = p2[1] - p1[1];
    var c = p2[2] - p1[2];

    let ret = a * a + b * b + c * c

    if (ret < 0) {
        ret *= -1
    }
    return ret;
}

/**
 * Lightens or Darkens a HEX colour.
 * @param num The HEX colour in number form.
 * @param amt The amount to darken (-) or lighten (+) it by.
 * @returns The new shifted colour.
 */
function LightenDarkenColor(num, amt) {
    var r = (num >> 16) + amt;
    var b = ((num >> 8) & 0x00FF) + amt;
    var g = (num & 0x0000FF) + amt;
    var newColor = g | (b << 8) | (r << 16);
    return newColor;
}

/**
 * Draws a waypoint in 3D Space
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Number} z The z coordinate.
 * @param {Number} w The width of the drawn box.
 * @param {Number} h The height of the drawn box.
 * @param {Number} r The red value of the drawn box's colour.
 * @param {Number} g The green value of the drawn box's colour.
 * @param {Number} b The blue value of the drawn box's colour.
 * @param {String} name The name of the waypoint
 * @param {Number} textColour The colour of the drawn text.
 * @param {Boolean} throughWalls If the waypoint can be seen through walls.
 * @param {Boolean} beacon If it should have a beacon.
 * @param {Boolean} distance If it should display the distacne to the player. (Inherits the colour of the above text but shifts it a little.) 
 */
function drawWaypoint(x, y, z, w, h, r, g, b, name, textColour, throughWalls, beacon, distance)
{
    let distToPlayer=Math.sqrt((x-Player.getRenderX())**2+(y-(Player.getRenderY()+Player.getPlayer()["func_70047_e"]()))**2+(z-Player.getRenderZ())**2);
    if (beacon) renderBeaconBeam(x,y,z,r,g,b,1,true)
    RenderLib.drawEspBox(x+0.5,y,z+0.5,w,h,r,g,b,1,throughWalls)
    Tessellator.drawString(name,x+0.5,y+2,z+0.5,textColour,false,0.09,false)
    if (distance) Tessellator.drawString("("+String(Math.round(distToPlayer))+"m)",x+0.5,y+1,z+0.5,LightenDarkenColor(textColour,+40),false,0.06,false)
}

export { isInArrayIdx, getrequest, getPetLevel, getCataLevel, getKeyByValue, upload, drawWaypoint, calculateDistanceQuick }