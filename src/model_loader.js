import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class ModelLoader
{
    async load(modelPaths, progressCallback)
    {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/draco/' );
        loader.setDRACOLoader( dracoLoader );
        const models = {};

        for (let i = 0; i < modelPaths.length; i++)
        {
            const m = await this.loadSingle(loader, modelPaths[i], progressCallback, i, modelPaths.length);
            const filename = modelPaths[i].replace(/^.*[\\/]/, '');
            models[filename] = m;
        }

        if (Object.keys(models).length == modelPaths.length)
        {
            return models;
        }
        else
        {
            throw new Error("Failed to load some models");
        }
    }

    async loadSingle(loader, path, progressCallback, index, len)
    {
        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                progressCallback((index+1)/len);
                //console.log('[debug', path, gltf);
                gltf.scene.animations.push(...gltf.animations);

                resolve(gltf.scene);
            }, (xhr) => {
                progressCallback(((xhr.loaded / xhr.total) + index)/len)
            }, (err) => {
                console.log( 'An error loading a model',path , err );
                reject();
            });
        });
    }


}