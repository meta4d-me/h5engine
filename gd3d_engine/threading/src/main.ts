namespace gd3d.threading
{
    export function threadHandle()
    {
        return function (constructor)
        {
            handleMaps.set(constructor.name, new constructor());
        };
    }
}
var handleMaps = new Map<string, any>();

onmessage = function (ev: MessageEvent)
{
    if (handleMaps.has(ev.data.handle))
    {
        let result = handleMaps.get(ev.data.handle).handle(ev.data.data);
        let data = {
            result: result,
            id: ev.data.id
        };
        postMessage(data, undefined);
    }
}

