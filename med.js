export class Med {

    constructor() {
        this.subs = [];
    }

    emit(e) {
        for (const f of this.subs)
            f(e);
    }

    sub(f) {
        this.subs.push(f);
    }
}

export class ValueRef
{
    constructor(initial)
    {
        this.v = initial;
        this.subs = [];
    }

    set(newVal)
    {
        this.v = newVal;
        this.emit(this.v);
    }

    emit(e) {
        for (const f of this.subs)
            f(e);
    }

    sub(f) {
        this.subs.push(f);
    }


}