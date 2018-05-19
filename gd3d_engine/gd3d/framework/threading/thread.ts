namespace gd3d.threading
{
    export class thread
    {
        public static workerInstance: Worker;

        private static instance: thread;

        public static get Instance(): thread
        {
            if (!thread.instance)
                thread.instance = new thread();
            return thread.instance;
        }

        private worker: Worker;// = new Worker("lib/gd3d.thread.js");
        private callID: number = 0;
        private callMap: { [id: number]: { callback: (result) => void } } = {};//new Map<number, { resolve: any }>();
        constructor()
        {
            if (!thread.workerInstance)
                this.worker = new Worker("lib/gd3d.thread.js");
            else
                this.worker = thread.workerInstance;

            this.worker.onmessage = (e: MessageEvent) =>
            {
                //e.data.id
                if (e.data && this.callMap[e.data.id])
                    this.callMap[e.data.id].callback(e.data.result);
            };

            this.worker.onerror = (e: ErrorEvent) =>
            {
                console.error(e);
            };
        }

        public Call(name: string, data: any, callback: (result) => void)
        {
            this.worker.postMessage({
                handle: name,
                data: data,
                id: ++this.callID
            });
            this.callMap[this.callID] = { callback: callback };

        }


    }
}