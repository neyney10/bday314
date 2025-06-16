import { AnimationClip, Box3, Sphere, Vector3, VectorKeyframeTrack } from "three";

export function MoveAnimation(origin, distance, direction, duration) {
    const times = [0, duration];
    const endDeltaPos = origin.clone().add(direction.clone().multiplyScalar(distance));
    const values = [...origin.toArray(), ...endDeltaPos];

    const trackName = '.position';

    const track = new VectorKeyframeTrack( trackName, times, values );

    return new AnimationClip( 'MoveAnimation', duration, [ track ] );
}

export function RotateAnimation(origin, length, duration) {
    const times = [0, duration];
    const values = [origin, origin+length];

    const trackName = '.rotation[y]';

    const track = new VectorKeyframeTrack( trackName, times, values );

    return new AnimationClip( 'RotateAnimation', duration, [ track ] );
}

export function FocusAnimationClip(origin, obj, duration) {
    const times = [0, duration];
    const values = [...origin, obj.position.x, obj.position.y + 1, obj.position.z + 4];

    const trackName = '.position';

    const track = new VectorKeyframeTrack( trackName, times, values );

    return new AnimationClip( null, duration, [ track ] );
}




export function ShakeAnimationClip(origin, duration, shakeScale) {

    const times = [], values = [], tmp = new Vector3();

    for ( let i = 0; i < duration * 10; i ++ ) {

        times.push( i / 10 );

        tmp.set( Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0 )
            .multiplyScalar( shakeScale )
            .add(origin)
            .toArray( values, values.length );
    }

    const trackName = '.position';

    const track = new VectorKeyframeTrack( trackName, times, values );

    return new AnimationClip( null, duration, [ track ] );

}



export function BlinkAnimationClip(duration, min, max) {

    const times = [0, duration];
    const values = [max, min];

    const trackName = '.material.opacity';

    const track = new VectorKeyframeTrack( trackName, times, values );

    return new AnimationClip( null, duration, [ track ] );

}

