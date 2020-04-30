declare namespace gd3d.plugins.remoteDebug {
    enum HookEventType {
        initScene = 0,
        addChildAt = 1,
        removeChild = 2,
        removeAllChild = 3,
        addComponentDirect = 4,
        removeComponent = 5,
        dirtify = 6
    }
    type HookTransType = "2d" | "3d";
    class EngineHook {
        OnEvent: (transType: HookTransType, eventType: HookEventType, value: any) => void;
        private Event;
        private Hook3d;
        private Hook2d;
        Init(): void;
    }
}
declare namespace gd3d.plugins.remoteDebug {
    function init(host: string): void;
}
declare namespace gd3d.plugins.remoteDebug {
    abstract class Message {
        __ptlNum__: number;
    }
    abstract class ExecMessage extends Message {
        execTime: number;
        curTime: number;
        constructor();
    }
    class EngineEventMessage extends ExecMessage {
        transType: string;
        eventType: number;
        data: string;
        constructor();
    }
    class LogMessage extends ExecMessage {
        type: number;
        text: string;
        constructor();
    }
}
declare namespace gd3d.plugins.remoteDebug {
    class WSConnect {
        private host;
        private socket;
        IsConnect: boolean;
        OnRecv: (msg: string) => void;
        OnClose: () => void;
        constructor(host: any);
        Connect(): Promise<boolean>;
        private _Close;
        Send(data: any): void;
    }
}
//# sourceMappingURL=plug_remoteDebug.d.ts.map