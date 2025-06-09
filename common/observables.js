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