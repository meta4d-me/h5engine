namespace gd3d.plugins.remoteDebug
{
    var startTime: number = Date.now();


    export abstract class Message
    {
        __ptlNum__: number;
    }

    export abstract class ExecMessage extends Message
    {
        execTime: number;
        curTime: number;
        constructor()
        {
            super();
            this.curTime = Date.now();
            this.execTime = this.curTime - startTime;
        }
    }

    export class EngineEventMessage extends ExecMessage
    {
        transType: string;
        eventType: number;
        data: string;

        constructor()
        {
            super();
            this.__ptlNum__ = 6;
        }
    }

    export class LogMessage extends ExecMessage
    {
        type: number;
        text: string;

        constructor()
        {
            super();
            this.__ptlNum__ = 7;
        }
    }
}