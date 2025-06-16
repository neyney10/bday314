import * as THREE from 'three';
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";


export class Bday314Renderer
{
    constructor(width, height, devicePixelRatio, scene, camera, world)
    {
        this.renderLoop = renderLoop.bind(this);

        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
        });
        this.renderer.setPixelRatio(devicePixelRatio);

        this.clock = new THREE.Clock();
        this.scene = scene;
        this.camera = camera;
        this.controls = new CameraControls(this.camera, this.renderer.domElement);
        this.world = world;

        //this.controls.mouseButtons.left = CameraControls.ACTION[ CameraControls.ACTION.NONE ];


        this.resize(width, height);
    }

    domElement()
    {
        console.log('renderer.domElement', this.renderer.domElement);
        return this.renderer.domElement;
    }

    resize(width, height)
    {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }


    start()
    {
        this.renderer.setAnimationLoop(this.renderLoop);
    }
}

import Stats from 'stats.js';
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function renderLoop()
{
    stats.begin();
    const timeDelta = this.clock.getDelta();
    const hasControlsUpdated = this.controls.update( timeDelta );

    for (const objs of Object.values(this.world.objects))
    {
        for (const obj of objs)
        {
            obj.animationMixer?.update(timeDelta);
            for (const childMixer of obj.childAnimationMixers())
                childMixer?.update(timeDelta);

            obj.onUpdate(timeDelta);
        }

    }
    
    this.renderer.render(this.scene, this.camera);
    stats.end();
}