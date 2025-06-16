import * as THREE from 'three';

export function intersectPosTop2Bot(objects, origin) {
    const direction = new THREE.Vector3(0, -1, 0);
    const raycaster = new THREE.Raycaster(origin, direction);
    raycaster.firstHitOnly = true;
    
    const intersects = raycaster.intersectObjects(objects, true);

    return intersects;
}

export function randomizeMatrix(matrix, posSpread) 
{
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    position.x = THREE.MathUtils.randFloatSpread(posSpread);
    position.y = THREE.MathUtils.randFloatSpread(posSpread);
    position.z = THREE.MathUtils.randFloatSpread(posSpread);

    quaternion.random();

    //scale.x = scale.y = scale.z = Math.random() * 1;
    scale.x = scale.y = scale.z = 1;

    matrix.compose( position, quaternion, scale );
}