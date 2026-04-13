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
        const promises = [];
        let progress = {val: 0};


        for (let i = 0; i < modelPaths.length; i++)
        {
            const m = this.loadSingle(
                loader, 
                modelPaths[i], 
                progressCallback,
                progress,
                modelPaths.length
            );

            promises.push(m);
        }

        const modelArray = await Promise.all(promises);
        for (let i = 0; i < modelArray.length; i++)
        {
            const filename = modelPaths[i].replace(/^.*[\\/]/, '');
            models[filename] = modelArray[i];
        }

        return models;
    }

    async loadSingle(loader, path, progressCallback, progress, len)
    {
        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                progress.val++;
                progressCallback(progress.val/len);
                //console.log('[debug', path, gltf);
                gltf.scene.animations.push(...gltf.animations);

                resolve(gltf.scene);
            }, (xhr) => {
                progressCallback((progress.val + (xhr.loaded / xhr.total))/len)
            }, (err) => {
                console.log( 'An error loading a model',path , err );
                reject();
            });
        });
    }


}