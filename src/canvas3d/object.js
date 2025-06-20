import * as THREE from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';

import { BlinkAnimationClip, MoveAnimation } from './intro_animation.js';


export class Bday314Object
{
    constructor(threeObj, global, clone=true, name=undefined)
    {
        if (clone)
        {
            this.obj = cloneWithMeshes(threeObj);
        }
        else this.obj = threeObj;

        this.obj.userData = {meta: this};
        this.uuid = this.obj.uuid;
        if (name)
            this.name = name;
        else this.name = this.obj.name;
        this.position = this.obj.position;
        this.rotation = this.obj.rotation;
        this.animationMixer = new THREE.AnimationMixer(this.obj);
        this.children = [];
        this.parent = undefined;

        this.global = global;
    }

    onUpdate(deltaTime) 
    {

    }

    
    addChild(child)
    {
        if (child.parent)
            child.parent.removeChild(child);
        this.children.push(child);
        this.obj.add(child.obj);
        child.parent = this;
        child.onCreate();
    }

    removeChildByName(name)
    {
        const removed = this.children.filter(c => c.name == name) 
        this.children = this.children.filter(c => c.name != name) 

        const removedObjNames = [...new Set(removed.map(c => c.obj.name))];
        this.obj.children = this.obj.children.filter(c => !removedObjNames.includes(c.name));
        // todo: on destroy

        return removed;
    }

    removeChild(child)
    {
        // remove by id
        let index = this.children.findIndex(c => c.uuid == child.uuid);
        let removedChild;
        if (index != -1)
            removedChild = this.children.splice(index,1);

        this.obj.remove(child.obj);

        return removedChild;
        // todo: on destroy
    }

    childAnimationMixers()
    {
        const mixers = [];

        for (const child of this.children)
        {
            mixers.push(child.animationMixer);
            mixers.push(...child.childAnimationMixers());
        }

        return mixers;
    }

    onCreate()
    {}
    

    onDestroy()
    {
        this.animationMixer.stopAllAction();
    }

    setOpacity(value)
    {
        this.obj.traverse(object => {
            if (object.isMesh) {
                object.material.opacity = value;
                object.material.transparent = true;
            }
        });
    }
}


export class CakeObject extends Bday314Object
{
    constructor(threeobj, global)
    {
        super(threeobj, global);
        this.name = "cake";
        this.top = undefined;
        
        this.obj.traverse((child) => {
            if (child.name == 'top')
                this.top = child;

            if (child.isMesh) {
                const m = child;
                m.geometry.computeBoundsTree();
            }
        });

        if (!this.top) console.error("'top' wasn't found in the cake", this.obj);
        
        

    }

    onUpdate(deltaTime) {
        const rotationsPerMinute = 0.5;
        this.rotation.y += ((rotationsPerMinute/60)*Math.PI*2) * deltaTime;
    }

}


export class CandleObject extends Bday314Object
{
    constructor(threeobj, global)
    {
        super(threeobj, global);
        this.name = 'candle';
        this.obj.name = 'candle';
        this.colors = [0xFF0000, 0x00FF00];
    }

    onCreate()
    {

    }

    setColor1(color)
    {
        this.colors[0] = color;

        const body = this.obj.getObjectByName('body');
        let s1 = body.getObjectByName('Mesh_0');

        s1.material.color = new THREE.Color(this.colors[0]);
    }

    setColor2(color)
    {
        this.colors[1] = color;

        const body = this.obj.getObjectByName('body');
        let s2 = body.getObjectByName('Mesh_0_1');

        s2.material.color = new THREE.Color(this.colors[1]);
    }

    setColors(colors)
    {
        this.setColor1(colors[0]);
        this.setColor2(colors[1]);
    }

}


export class CandlePlacementObject extends Bday314Object
{
    constructor(threeobj, global)
    {
        super(threeobj, global);
        this.name = "candle_placement";
        this.obj.name = this.name;
    }

    onCreate()
    {
        const clip = BlinkAnimationClip(1, 0.45, 1);
        const clipAction = this.animationMixer.clipAction( clip );
        clipAction.setLoop(THREE.LoopPingPong);
        clipAction.play();  
    }

    onPointerOver(e)
    {
        this.obj.material.color.set('hotpink');
    }

    onPointerOut(e)
    {
        this.obj.material.color.set('white');
    }

    onPointerClick(e)
    {
        const selected_placement_pos = this.obj.position;
        console.log('selected pos:', selected_placement_pos);
        this.global.candleBlessingConfig.candle.pos = selected_placement_pos;

        // remove placements.
        const removed = this.global.cakeConfig.obj.removeChildByName("candle_placement");
        removed.map(r => r.onDestroy());

        console.log('CandlePlacement:onPointerClick candle', this.global.candleBlessingConfig.candle);
        this.global.addCandle(this.global.candleBlessingConfig.candle);
        this.global.menuActor.send({ type: 'placed' });
    }


}



export class FlameObject extends Bday314Object
{
    constructor(threeobj, global)
    {
        super(threeobj, global);
        this.name = "flame";
        this.obj.name = this.name;

        this.onCreate();
    }

    onCreate()
    {
        const clip = this.obj.animations[0];
        console.log('[debug]', 'FlameObject', 'clip', clip);
        this.animationMixer = new THREE.AnimationMixer(this.obj.children[1]);
        const action = this.animationMixer.clipAction(clip);
        action.setLoop(THREE.LoopPingPong);
        action.play();

    }



}


export class BalloonObject extends Bday314Object
{
    constructor(threeobj, global)
    {
        super(threeobj, global);
        this.name = "Balloon";
        this.obj.name = this.name;

    }

    startFlying(time)
    {
        const height = 5;
        const relativeHeight = height - this.position.y;
        const speed = 0.07;
        const duration = height/speed;
        const clip = MoveAnimation(this.position, relativeHeight, new THREE.Vector3(0,1,0), duration);
        const action = this.animationMixer.clipAction(clip);
        action.time = time * duration;
        action.play();
    }

}


export class BalloonsObject extends Bday314Object
{ 
    constructor(threeobj, count, global)
    {
        super(threeobj.children[0], global);
        this.name = "Balloons";
        this.obj.name = this.name;
        console.log("balloonsobject", this.obj);
        const geo = this.obj.geometry.clone();
        const mat = this.obj.material;
        const mesh = new THREE.InstancedMesh( geo, mat, count );

        let matrix = new THREE.Matrix4();

        for (let i = 0; i < count; i++)
        {
            this._randomizeMatrix(matrix, 5);
            mesh.setMatrixAt(i,matrix);
            const color = new THREE.Color(randFloat(0.1,1), randFloat(0.1,1), randFloat(0.1,1));
            mesh.setColorAt(i, color);
        }

        mesh.instanceMatrix.needsUpdate = true;
        this.obj = mesh;
        this.animationMixer = new THREE.AnimationMixer(this.obj);
    }

    startFlying(time)
    {
        const height = 5;
        const relativeHeight = height - this.position.y;
        const speed = 0.07;
        const duration = height/speed;
        const clip = MoveAnimation(this.position, relativeHeight, new THREE.Vector3(0,1,0), duration);
        const action = this.animationMixer.clipAction(clip);
        action.time = time * duration;
        action.play();
    }


    _randomizeMatrix(matrix, posSpread) 
    {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
    
        position.x = THREE.MathUtils.randFloatSpread(posSpread);
        position.y = THREE.MathUtils.randFloatSpread(posSpread);
        position.z = THREE.MathUtils.randFloatSpread(posSpread);
    
        //quaternion.random();
    
        //scale.x = scale.y = scale.z = Math.random() * 1;
        scale.x = scale.y = scale.z = 0.25;
    
        matrix.compose( position, quaternion, scale );
    }
}



/////////////////// UTILS

export function cloneWithMeshes(threeObj) {
    const obj = threeObj.clone(true);
    obj.uuid = THREE.MathUtils.generateUUID();
    obj.traverse(object => {
        if ( object.isMesh ) {
            object.material = object.material.clone();
        }
    });

    return obj;
}