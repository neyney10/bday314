export class Bday314World
{
    constructor(scene)
    {
        this.scene = scene;
        this.objects = {};
    }

    find(name)
    {
        return this.objects[name];
    }

    add(obj)
    {
        if (!this.objects[obj.name])
            this.objects[obj.name] = [];
        this.objects[obj.name].push(obj);
        this.scene.add(obj.obj);
        obj.onCreate();
    }

    remove(obj)
    {
        console.debug('[debug]', 'world:remove', obj);
        obj.onDestroy();
        // remove from scene.
        if (obj.parent) // todo
        {
            obj.parent.remove(obj);
        }
        else if (obj.obj.parent) // temp - this should be handled by the higher-level obj.parent.remove
        {
            obj.obj.parent.remove(obj.obj);
        }
    }
}