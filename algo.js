import {sample, range, countBy} from "underscore";
import * as THREE from "three";


export function findPlacementsRandom(r, count, origin) 
{
    const angle = Math.random() * Math.PI*2; // radians
    const maxRadius = r * 0.9;
    const randRadius = (maxRadius*0.1) + (Math.random() * maxRadius*0.9);

    let points = [];
    for (let i = 0; i < count; i++)
    {
        points.push(getPointInCircle(randRadius, angle, origin));
    }

    return points;
}

export function findPlacements(r, count, size, origin) 
{
    const circularLayers = Math.floor(r/size);
    // divide each subcircle to sections
    const sectionsPerLayer = 8;


    let points = [];
    const selectedSections = sample(range(circularLayers*sectionsPerLayer), count);
    const sectionsByLayer = valueCountsArr(selectedSections.map(s => Math.floor(s/sectionsPerLayer)));
    let sectionsOccupiedByLayer = [];
    console.log('findplacements section count', circularLayers*(sectionsPerLayer-1)+1, sectionsByLayer);

    // fuzz locations by using the extra space
    const extraSpace = r - circularLayers*size;
    const fuzzAngle = THREE.MathUtils.randFloat(0, Math.PI*2)
    const fuzz = new THREE.Vector3(THREE.MathUtils.randFloatSpread(extraSpace*Math.sin(fuzzAngle)), 0, extraSpace*THREE.MathUtils.randFloatSpread(Math.cos(fuzzAngle)));
    const fuzzedOrigin = origin.clone().add(fuzz);
    for (let section of selectedSections)
    {
        let layer = Math.floor(section / sectionsPerLayer);
        let sectionNumInLayer = section % sectionsPerLayer;

        const a = getPointInCircle((layer/circularLayers)*r, 0);
        const b = getPointInCircle((layer/circularLayers)*r, (Math.PI/180)*1);
        const d = new THREE.Vector2(a[0],a[1]).distanceTo(new THREE.Vector2(b[0],b[1]));
        const dd = size/d;
        //console.log('findplacements exper', layer, a, b, d, dd);

        const minAngle = (Math.PI/180) * (360 * (sectionNumInLayer/sectionsPerLayer) + dd);
        const maxAngle = (Math.PI/180) * (360 * ((sectionNumInLayer+1)/sectionsPerLayer) - dd);
        const angle = THREE.MathUtils.randFloat(minAngle, maxAngle);// radians
        console.log('findplacements exper', layer, (180/Math.PI)*minAngle, (180/Math.PI)*angle, (180/Math.PI)*maxAngle);




        points.push(
            getPointInCircle((layer/circularLayers)*r, angle, fuzzedOrigin)
        );
        console.log('findplacements loop', section, layer, sectionNumInLayer, angle, points[points.length-1]);

    }

    return points;
}


function getPointInCircle(r, angle, origin=undefined) 
{
    let point = [
        r * Math.sin(angle), 
        r * Math.cos(angle)
    ];

    if (origin)
    {
        point[0] += origin.x;
        point[1] += origin.z;
    }

    return point;
};


function valueCountsArr(arr)
{
    const max = Math.max(...arr);
    const countsMap = countBy(arr, v => v);
    const countsArr = range(0, max+1);
    console.log('valueCountsArr countsMap', countsMap);

    for (const [k,v] of Object.entries(countsMap))
    {
        countsArr[k] = v;
    }

    return countsArr;
}