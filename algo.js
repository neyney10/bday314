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

    let maxLayerSectionCounts = []; // capacity
    let points = [];
    for (let i = 1; i <= circularLayers; i++)
    {
        const layerRadius = (i/circularLayers) * r;
        const circumference = 2 * Math.PI * layerRadius;
        const currMaxLayerSectionCount = Math.floor(circumference/size);
        maxLayerSectionCounts.push(currMaxLayerSectionCount);
    }

    const availableLayerSectionCounts = maxLayerSectionCounts.map(e => e); // clone;

    let layerSectionCounts = new Array(circularLayers).fill(0);
    for (let i = 0; i < count; i++)
    {
        const selectableLayers = availableLayerSectionCounts.map((lsc, index) => [lsc,index]).filter(e => e[0] > 0).map(e => e[1]);
        const layer = sample(selectableLayers, 1);
        
        layerSectionCounts[layer]++;
        availableLayerSectionCounts[layer]--;
    }

    // fuzz locations by using the extra space
    const extraSpace = r - circularLayers*size;
    const fuzzAngle = THREE.MathUtils.randFloat(0, Math.PI*2)
    const fuzz = new THREE.Vector3(THREE.MathUtils.randFloatSpread(extraSpace*Math.sin(fuzzAngle)), 0, extraSpace*THREE.MathUtils.randFloatSpread(Math.cos(fuzzAngle)));
    const fuzzedOrigin = origin.clone().add(fuzz);

    const angleOffset = THREE.MathUtils.randFloat(0, Math.PI);

    for (let i = 0; i < circularLayers; i++)
    {
        const sectionCount = layerSectionCounts[i];
        const sectionDegreeSize = 360 / maxLayerSectionCounts[i];
        const sectionAngleStart = range(maxLayerSectionCounts[i]).map(e => e * sectionDegreeSize);
        const sections = sample(sectionAngleStart, sectionCount);

        for (const section of sections)
        {
            const minAngle = section;
            const maxAngle = section + sectionDegreeSize;
            const angle = (Math.PI/180) * (minAngle + maxAngle) / 2 + angleOffset;
            points.push(
                getPointInCircle(((i+1)/circularLayers)*r, angle, fuzzedOrigin)
            );
        }
        
        
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
