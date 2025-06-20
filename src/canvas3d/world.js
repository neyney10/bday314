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
        if (obj.parent)
        {
            obj.parent.removeChild(obj);
        }
        else if (obj.obj.parent) // temp - in case of non-Bday314 object
        {
            obj.obj.parent.remove(obj.obj);
        }
    }
}