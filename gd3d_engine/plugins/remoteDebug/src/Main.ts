namespace gd3d.plugins.remoteDebug
{
    var conn: WSConnect;
    var failCount: number;
    const maxFailCount: number = 5;
    var hook: EngineHook;
    var log: (message?: any, ...optionalParams: any[]) => void;
    var warn: (message?: any, ...optionalParams: any[]) => void;
    var error: (message?: any, ...optionalParams: any[]) => void;
    var sendQueue: Message[] = [];

    function initConsole()
    {
        var log = console.log;
        var warn = console.warn;
        var error = console.error;
        console.log = (message?: any, ...optionalParams: any[]) =>
        {
            log(message, optionalParams);
            sendLog(1, message);
        };
        console.warn = (message?: any, ...optionalParams: any[]) =>
        {
            warn(message, optionalParams);
            sendLog(2, message);
        };
        console.error = (message?: any, ...optionalParams: any[]) =>
        {
            error(message, optionalParams);
            sendLog(3, message);
        };
    }

    async function initConn(host: string)
    {
        conn = new WSConnect(host);
        var success = await conn.Connect();

    }

    function sendEvent(transType: HookTransType, eventType: HookEventType, value: any)
    {
        let msg = new EngineEventMessage();
        msg.eventType = eventType;
        msg.transType = transType;
        msg.data = JSON.stringify(value);
        sendCmd(msg);
    }

    function sendLog(type: number, message: any)
    {
        var text = message;
        if (typeof (message) != "string")
            text = JSON.stringify(message);
        let msg = new LogMessage();
        msg.type = type;
        msg.text = text;
        sendCmd(msg);
    }

    function sendCmd(msg: Message)
    {
        if (!conn || !conn.IsConnect)
            sendQueue.push(msg);
        else
            conn.Send(msg);
    }

    async function checkConnect()
    {
        if (conn && !conn.IsConnect)
        {
            try
            {
                await conn.Connect();
            } catch (e)
            {
                error(e);
                ++failCount;
            }
        }
    }

    function update()
    {
        if (failCount > maxFailCount)
            return;
        checkConnect();
        if (conn && conn.IsConnect)
        {
            while (sendQueue.length > 0)
            {
                let msg = sendQueue.shift();
                conn.Send(msg);
            }
        }
    }

    export function init(host: string)
    {
        initConn(host);
        initConsole();
        hook = new EngineHook();
        hook.Init()
        hook.OnEvent = (tType, eType, value) =>
        {
            sendEvent(tType, eType, value);
        };

        setInterval(async () =>
        {
            update();
        }, 2000);
    }
}