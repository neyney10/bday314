
export class BlessingConfig
{
    constructor()
    {
        this.candle = new CandleConfig();
        this.text = new BlessingTextConfig();
        this.uuid = undefined;
    }

    export()
    {
        return {
            candle: this.candle.export(),
            text: this.text.export()
        }
    }
}

export class CandleConfig
{
    constructor()
    {
        this.type = 'bicolor';
        this.colors = [undefined, undefined];
        this.pos = {x:0, y: 0, z: 0}
        this.obj = undefined;
    }

    export()
    {
        let data = {
            type: this.type,
            pos: this.pos
        };

        if (this.type == 'bicolor')
        {
            data.colors = this.colors;
        }
        
        return data;
    }
}

export class BlessingTextConfig
{
    constructor(title, body)
    {
        this.title = title? title : '';
        this.body = body? body: '';
    }

    export()
    {
        return {
            title: this.title,
            body: this.body
        };
    }
}