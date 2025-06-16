import * as THREE from 'three';
import { computeBoundsTree, acceleratedRaycast, disposeBoundsTree } from 'three-mesh-bvh';
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

import { Text as TrText } from 'troika-three-text';
import { CakeObject, CandleObject, CandlePlacementObject, Bday314Object, FlameObject, cloneWithMeshes, BalloonObject, BalloonsObject } from './object.js';
import { Bday314Renderer } from './renderer.js';
import { Bday314World } from './world.js';
import { randFloat } from 'three/src/math/MathUtils.js';
import { intersectPosTop2Bot, randomizeMatrix } from './threejs_util.js';
import { RotateAnimation } from './intro_animation.js';
import { findPlacements } from './algo.js';



export class Canvas3dApp 
{
    constructor() 
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1, 1);
        this.cameraStartTarget = new THREE.Vector3(0, 1.2, 0);
        this.cameraStartPosition = new THREE.Vector3(0, 2, 2.2);
        this.world = new Bday314World(this.scene);
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer = new Bday314Renderer(width, height, window.devicePixelRatio, this.scene, this.camera, this.world);
        this.domElement = this.renderer.domElement();
        this.controls = this.renderer.controls;
        // temp
        this.controls.disconnect();

        this.global = this;

        this.models = [];
    }

    init(models)
    {
        // light
        /*const light1 = new THREE.DirectionalLight(0x00ff00, 2.5);
        light1.position.z = 5;
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xff0000, 1.5);
        light2.position.z = 5;
        light2.position.x = 2;
        this.scene.add(light2);

        const light3 = new THREE.DirectionalLight(0x0000ff, 2.5);
        light3.position.z = 5;
        light3.position.x = 4;
        this.scene.add(light3);

        const light4 = new THREE.DirectionalLight(0xffffff, 3);
        light4.position.set(3, 0.5, 5);
        this.scene.add(light4);
        */

        const light5 = new THREE.DirectionalLight(0xffffff, 3);
        light5.position.set(-1, 0.5, 5);
        const targetObj = new THREE.Object3D();
        targetObj.position.set(1,0,-1);
        light5.target = targetObj;
        this.scene.add(targetObj);
        this.scene.add(light5);

        const lightAmbient = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(lightAmbient);


        /*const gridHelper = new THREE.GridHelper(10, 10, 0xff0000, 0x0000ff);
        this.scene.add(gridHelper);

        const gridHelper2 = new THREE.GridHelper(10, 10, 0x00ff00, 0x0000ff);
        gridHelper2.rotateX(Math.PI / 2);
        this.scene.add(gridHelper2);*/


        this.models = models;


        const bday314cake = new CakeObject(models['tempcake2.glb'], this.global); //candleless_cake3
        bday314cake.position.set(0,0.30,0);
        this.world.add(bday314cake);
        this.global.cakeConfig = {
            obj: bday314cake
        };


        this.controls.setTarget(
            this.cameraStartTarget.x,
            this.cameraStartTarget.y,
            this.cameraStartTarget.z,
            false
        );
        this.controls.setPosition(
            this.cameraStartPosition.x,
            this.cameraStartPosition.y,
            this.cameraStartPosition.z,
            true
        );
        
        

        const text = 'מזל טוב ל Niko מאחל הרבה'
        this.setTitleText(text);

        const particles = 100;
        const geo = new THREE.SphereGeometry(0.025);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const particleMesh = new THREE.InstancedMesh(geo, mat, particles);
        let matrix = new THREE.Matrix4();
        for (let i = 0; i < particles; i++)
        {
            randomizeMatrix(matrix, 8);
            particleMesh.setMatrixAt( i, matrix );
        }
        this.scene.add(particleMesh);



        // temp table
        const tblObj = new Bday314Object(models['table_colored.glb'], this.global);
        tblObj.obj.scale.setScalar(4);
        tblObj.obj.position.set(0,-1.7,0);
        this.world.add(tblObj);
        console.log('table', tblObj.obj);

        const cakeTurnTable = new Bday314Object(models['caketurntable.glb'], this.global);
        cakeTurnTable.obj.scale.setScalar(0.5);
        cakeTurnTable.obj.position.set(0,-0.3,0);
        this.world.add(cakeTurnTable);

        // temp cake
        /*console.log('tempcake2', models['pengucake.glb']);
        const tempCake = new CakeObject(models['pengucake.glb'], this.global);
        tempCake.position.set(2,0,2);
        this.world.add(tempCake);
        console.log("[debug]", "tempcake", tempCake.obj.children);
        console.log("[debug]", "tempcake", tempCake.top);*/


        // temp flame
        /*console.log('flame', models['tempflame.glb']);
        const flame = new FlameObject(models['tempflame.glb'], this.global);
        flame.position.set(1.5,1,1);
        console.log('[debug]', 'flame',  flame.obj);
        this.world.add(flame);*/



    
        // temp other
        const rotateCakeAndEnv = (distanceRatio) => {
            const cakeObj3 = this.global.cakeConfig.obj.obj;
            cakeObj3.rotateY((Math.PI/180)*360 * distanceRatio);
        }

        let startX, startY, isMouseDown;
        window.addEventListener('mousemove', (event) => {
            if (isMouseDown)
            {
                //startX = event.clientX;
                const xmove = event.movementX; 
                if (xmove != 0) {
                    rotateCakeAndEnv(xmove / window.innerWidth);
                }
            }
        });
        window.addEventListener('mousedown', (event) => {
            isMouseDown = true;
            //startX = event.clientX;
        });
        window.addEventListener('mouseup', (event) => {
            isMouseDown = false;

            /*const cake = this.global.cakeConfig.obj;
            const clip = RotateAnimation(cake.obj.rotation.y, Math.PI/2, 1);
            const action = cake.animationMixer.clipAction(clip);
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            console.log('rotation.y', cake.obj.rotation.y);
            action.play();*/
        });

        window.addEventListener('touchmove', (event) => {
            const xmove = event.touches[0].clientX - startX;
            startX = event.touches[0].clientX;
            if (xmove != 0) {
                    rotateCakeAndEnv(xmove / window.innerWidth);
                }
        });
        window.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });


        // main loop
        window.addEventListener( 'resize', () => this.renderer.resize( window.innerWidth, window.innerHeight ) );

        this.renderer.start();
    }


    selectedCandle(menuActor)
    {
        console.log('selected candle');
        // temp 
        if (this.global.candleBlessingConfig.candle.obj)
            this.world.remove(this.global.candleBlessingConfig.candle.obj);

        const cake = this.global.cakeConfig.obj;
        console.debug('selectedCandle', 'cake', cake);
        cake.top.geometry.computeBoundingBox();

        this.controls.fitToSphere(cake.top, true );
        this.controls.rotateTo(0, Math.PI / 4, true );

        let bbox = new THREE.Box3();
        bbox.setFromObject(cake.top, true);
        console.log('cakeTop bbox', bbox);
        // circular shape top
        const min = bbox.min;
        const max = bbox.max;
        let center = new THREE.Vector3();
        bbox.getCenter(center);

        const radius = new THREE.Vector2((min.x + max.x) / 2, min.z).distanceTo(new THREE.Vector2(center.x, center.z));
        console.log('circular shape top', center, radius);


        const sphereSize = 0.05;
        const candlePlacementOptions = 7
        const placementPoints = findPlacements(radius, candlePlacementOptions, sphereSize * 2.05, center);
        console.log('placementPoints', placementPoints);
        const cakeIntersectObjs = cake.obj.children.filter(c => !c.name.startsWith('candle'));

        for (let i = 0; i < candlePlacementOptions; i++)
        {
            const [x, z] = placementPoints[i];
            
            const intersects = intersectPosTop2Bot(cakeIntersectObjs, new THREE.Vector3(x, 5, z));
            const y = intersects.map(int => int.point.y).reduce((a, b) => Math.max(a, b), -Infinity) - cake.position.y;
            console.log("placement y", y);

            const placementMesh = new THREE.Mesh(
                new THREE.SphereGeometry(sphereSize),
                new THREE.MeshBasicMaterial({transparent: true, opacity: 0.55})
            );
            
            placementMesh.layers.enable(1);
            placementMesh.scale.y = 0.4;
            placementMesh.position.set(x, y, z);
            placementMesh.parent = cake.obj;
            const placementObj = new CandlePlacementObject(placementMesh, this.global);
            //placementObj.onCreate();
            
            cake.addChild(placementObj);
        }


        // events / other
        const raycaster = new THREE.Raycaster();
        raycaster.layers.set(1);
        const mouse = new THREE.Vector2();

        let intersects = [];
        let hovered = {};

        const objectsToCheck = cake.children.filter(c => c.name == 'candle_placement').map(o => o.obj);

        let onRaycastClick = function(e) {
            mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, this.camera);
            intersects = raycaster.intersectObjects(objectsToCheck, true);

            intersects.forEach((hit) => {
                if (hit.object.userData.meta?.onPointerClick) 
                {
                    hit.object.userData.meta.onPointerClick(hit);
                    window.removeEventListener('pointermove', onRaycastHover)
                    window.removeEventListener('click', onRaycastClick);
                }
                    
            })
        }

        let onRaycastHover = function(e) {
            mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
            raycaster.setFromCamera(mouse, this.camera);
            intersects = raycaster.intersectObjects(objectsToCheck, true);

            // If a previously hovered item is not among the hits we must call onPointerOut
            Object.keys(hovered).forEach((key) => {
                const hit = intersects.find((hit) => hit.object.uuid === key);
                if (hit === undefined) {
                    const hoveredItem = hovered[key];
                    if (hoveredItem.object.userData.meta?.onPointerOver)
                        hoveredItem.object.userData.meta.onPointerOut(hoveredItem);
                    delete hovered[key];
                }
            })

            intersects.forEach((hit) => {
                // If a hit has not been flagged as hovered we must call onPointerOver
                if (!hovered[hit.object.uuid]) {
                    hovered[hit.object.uuid] = hit;
                    if (hit.object.userData.meta?.onPointerOver) 
                        hit.object.userData.meta.onPointerOver(hit)
                }
                // Call onPointerMove
                if (hit.object.userData.meta?.onPointerMove) 
                    hit.object.userData.meta.onPointerMove(hit)
            });
        }

        onRaycastHover = onRaycastHover.bind(this);
        onRaycastClick = onRaycastClick.bind(this);

        window.addEventListener('pointermove', onRaycastHover)
        window.addEventListener('click', onRaycastClick);


        menuActor.send({ type: 'selected' });


    }

    addCandle(candleData)
    {
        console.debug('[debug]', 'addCandle', 'candleData', candleData);
        let candleObj;
        if (candleData.type == 'bicolor')
        {
            candleObj = new CandleObject(this.models['candle2.glb'], this.global);
            candleObj.setColors(candleData.colors);
        }
        else if (candleData.type == 'sparkler')
        {
            candleObj = new Bday314Object(this.models['sparkler.glb'], this.global);
        }
        this.global.candleBlessingConfig.candle.obj = candleObj;


        const cake = this.global.cakeConfig.obj;
        const pos = candleData.pos;
        candleObj.position.set(cake.top.position.x+pos.x, pos.y ,cake.top.position.z+pos.z);
        candleObj.obj.parent = cake.obj;
        console.log('candleObj', candleObj, pos);

        cake.obj.children.push(candleObj.obj);
    }


    setDecoration(decorationData)
    {
        // remove
        if (this.global.cakeConfig.decoration?.obj)
            this.world.remove(this.global.cakeConfig.decoration.obj);

        console.debug('[debug]', 'setDecoration', decorationData);
        const type = decorationData.type;
        
        switch(type) {
            case 'snow':
                break;
            case 'balloons':
                /*const balloons = new BalloonsObject(this.models['balloon3.glb'], 111, this.global);
                balloons.startFlying(THREE.MathUtils.randFloat(0,0.9));
                this.global.cakeConfig.decoration.obj = balloons;
                this.world.add(balloons);

                break;*/
                // add
                let newDecorationGroup = new Bday314Object(new THREE.Object3D(), this.global, false);
                const originPos = new THREE.Vector3(0, 0.5, -1);
                const balloonCount = 50;
                for (let i = 0; i < balloonCount; i++)
                {
                    const balloon = new BalloonObject(this.models['balloon3.glb'], this.global);
                    balloon.position.copy(originPos.clone().add(
                        new THREE.Vector3(
                            THREE.MathUtils.randFloatSpread(7),
                            -5,
                            THREE.MathUtils.randFloatSpread(0.5)
                        )
                    ));
                    const scale = randFloat(0.7,1) * 0.25;
                    balloon.obj.scale.setScalar(scale);
                    balloon.obj.rotateZ(THREE.MathUtils.randFloatSpread(Math.PI/8));
                    balloon.obj.children[0].material.color =  new THREE.Color(randFloat(0.1,1), randFloat(0.1,1), randFloat(0.1,1));
                    balloon.startFlying(THREE.MathUtils.randFloat(0,0.9));

                    newDecorationGroup.addChild(balloon);
                }

                console.log('balloons',newDecorationGroup.children.map(c => c.position));
                this.global.cakeConfig.decoration.obj = newDecorationGroup;
                this.world.add(newDecorationGroup);
                
                break;
        }
    }

    setTitleText(text) 
    {
        if (this.global.cakeConfig.titleObj)
        {
            this.global.cakeConfig.titleObj.obj.text = text;
            this.global.cakeConfig.titleObj.obj.sync();
        }
        else
        {
            const cakeTitleText = new TrText();

            const fontSize = 0.1;
            cakeTitleText.text = text;
            cakeTitleText.font = '/fonts/TrashimCLM-Bold.otf';
            cakeTitleText.fontSize = fontSize;
            cakeTitleText.anchorX = "center";
            cakeTitleText.anchorY = "middle";
            cakeTitleText.outlineWidth = fontSize/10;
            cakeTitleText.color = 0xff5588;
            cakeTitleText.outlineBlur = "5%";
            cakeTitleText.position.y = this.global.cakeConfig.obj.top.position.y + 0.9;
            cakeTitleText.maxWidth = 1.85;
            cakeTitleText.textAlign = 'center';
            cakeTitleText.sync();

            console.debug('[debug]', "cakeTitleText", cakeTitleText);
            const cakeTitleTextObj = new Bday314Object(cakeTitleText, this.global, false);
            this.global.cakeConfig.titleObj = cakeTitleTextObj;
            this.world.add(cakeTitleTextObj);
        }
    }
}