namespace gd3d.threading
{
    export function threadHandle()
    {
        return function (constructor)
        {
            console.log(`注册多线程处理器:${constructor.name}`);
            // handleMaps.set(constructor.name, new constructor());
            handleMaps[constructor.name] = new constructor();
        };
    }
}
var handleMaps = {};//new Map<string, any>();

onmessage = function (ev: MessageEvent)
{
    let data: any = ev.data || ev;
    // if (handleMaps.has(data.handle))
    if(handleMaps[data.handle])
    {
        // let result = handleMaps.get(data.handle).handle(data.data);
        let result = handleMaps[data.handle].handle(data.data);
        let _data = {
            result: result,
            id: ev.data.id
        };
        postMessage(_data, undefined);
    }
}

