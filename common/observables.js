import { BehaviorSubject } from 'rxjs';

export class ObservableValue
{
    constructor(initial)
    {
        this.value = initial;
        this.subject = new BehaviorSubject();
    }

    set(val)
    {
        this.value = val;
        this.subject.next(val);
    }

    get()
    {
        return this.value;
    }

    sub(action)
    {
        return this.subject.subscribe({
            next: action
        });
    }
}


export class ObservableArray
{
    constructor(initial)
    {
        this.arr = initial;
        if (!initial)
            this.arr = [];
        this.subject = new BehaviorSubject();
    }

    set(i, val)
    {
        this.arr[i] = val;
        this.subject.next(
            new ArrayChangeEvent(
                this.arr,
                [val],
                []
            )
        );
    }

    setArr(a)
    {
        const old = this.arr;
        this.arr = a;
        this.subject.next(
            new ArrayChangeEvent(
                this.arr,
                this.arr,
                old
            )
        );
    }

    push(val)
    {
        this.arr.push(val);
        this.subject.next(
            new ArrayChangeEvent(
                this.arr,
                [val],
                []
            )
        );
    }

    get(i)
    {
        return this.arr[i];
    }

    getArr()
    { // should be readonly
        return this.arr;
    }

    remove(i)
    {
        const val = this.arr[i];
        this.arr.splice(i, 1);
        this.subject.next(
            new ArrayChangeEvent(
                this.arr,
                [],
                [val]
            )
        );
    }

    sub(action)
    {
        return this.subject.subscribe({
            next: action
        });
    }
}



export class ArrayChangeEvent
{
    constructor(arr, added, removed)
    {
        this.arr = arr;
        this.added = added;
        this.removed = removed;
    }
}