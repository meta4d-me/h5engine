namespace m4m.threading
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

        private worker: Worker;// = new Worker("lib/m4m.thread.js");
        private callID: number = 0;
        private callMap: { [id: number]: { callback: (result) => void } } = {};//new Map<number, { resolve: any }>();
        /**
         * 多线程
         */
        constructor()
        {
            if (!thread.workerInstance)
            {
                this.worker = new Worker("lib/th.js");
                this.worker.onmessage = (e: MessageEvent) =>
                {
                    //e.data.id
                    this.OnMessage(e);
                };

                this.worker.onerror = (e: ErrorEvent) =>
                {
                    console.error(e);
                };
            }
            else
            {
                this.worker = thread.workerInstance;
            }
        }

        /**
         * 当消息接收
         * @param e 
         */
        public OnMessage(e: MessageEvent)
        {
            if (e.data && this.callMap[e.data.id]){
                this.callMap[e.data.id].callback(e.data.result);
                delete this.callMap[e.data.id];
            }
        }

        /**
         * 执行
         * @param name 
         * @param data 
         * @param callback 
         */
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