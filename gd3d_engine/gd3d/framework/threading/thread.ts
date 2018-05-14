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
        private callMap = new Map<number, { resolve: any }>();
        constructor()
        {   
            if(!thread.workerInstance)
                this.worker = new Worker("lib/gd3d.thread.js");
            else
                this.worker = thread.workerInstance;

            this.worker.onmessage = (e: MessageEvent) =>
            {
                //e.data.id
                if (e.data && this.callMap.has(e.data.id))
                    this.callMap.get(e.data.id).resolve(e.data.result);
            };

            this.worker.onerror = (e: ErrorEvent) =>
            {
                console.error(e);
            };
        }

        public async Call(name: string, data: any)
        {
            this.worker.postMessage({
                handle: name,
                data: data,
                id: ++this.callID
            });


            return new Promise<any>((resolve) =>
            {
                this.callMap.set(this.callID, { resolve: resolve });
            });
        }


    }
}