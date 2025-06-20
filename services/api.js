const API_URL = import.meta.env.VITE_API_URL;
//'https://bday314srv.neyney10.workers.dev'; //'http://127.0.0.1:8787';// //'http://192.168.1.112:3000';//'http://localhost:3000';

export async function getCake(id) {
    if (!id)
    {
        return null;
    }
    
    const url = API_URL + `/cake/${id}`;
    let res;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log("fetch res:", json);
        res = json;
    } catch (error) {
        console.error(error.message);
    }

    return res;
}

export async function createCake(cakeData, title) {
    const body = {
        meta: {title: title},
        cake: cakeData,
        blessings: []
    }

    const url = API_URL + "/cake";
    console.log('add cake', url, JSON.stringify(body));
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http:/127.0.0.1:8787"
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error(error.message);
    }

    return undefined;
}


export async function addBlessing(id, blessing) {
    const url = API_URL + `/cake/${id}/blessings`;
    console.log('add blessing', JSON.stringify(blessing));
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blessing),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('[API]', 'addBlesssing', json);
    return json;

}


export async function removeBlessing(id, admin_pin, blessing_id) {
    const url = API_URL + `/cake/${id}-${admin_pin}/blessings/${blessing_id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return 'success';

    } catch (error) {
        console.error(error.message);
    }

}

export default {
    getCake, 
    createCake,
    addBlessing,
    removeBlessing
}