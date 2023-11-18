namespace m4m.threading
{
    export class gdPromise<T>
    {
        private execQueue: Array<(value?: T) => void> = new Array<(value?: T) => void>();
        /** 异常捕获函数 */
        private catchMethod: (val: T) => void;
        // private thenCall: (val: T) => void;

        constructor(executor: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void)
        {
            setTimeout(() =>
            {
                executor(this.resolve.bind(this), this.reject.bind(this));
            }, 0);
        }

        /**
         * 执行决定
         * @param value 数据 
         */
        public resolve(value?: T)
        {
            try
            {
                // if (this.thenCall)
                //     this.thenCall(value);
                while (this.execQueue.length > 0)
                    this.execQueue.shift()(value);
            } catch (e)
            {
                this.reject(e);
            }


        }
        /**
         * 执行拒绝
         * @param reason 
         * @returns 
         */
        public reject(reason?: any)
        {
            console.error(reason);
            if (this.catchMethod)
                return this.catchMethod(reason);

        }

        /**
         * 执行完然后
         * @param thenCall 
         * @returns 
         */
        public then(thenCall: (value?: T) => void): gdPromise<T>
        {
            // this.thenCall = thenCall;
            this.execQueue.push(thenCall);
            return this;
        }

        /**
         * 异常捕获
         * @param callbcack 
         * @returns 
         */
        public catch(callbcack: (val: any) => void): gdPromise<T>
        {
            this.catchMethod = callbcack;
            return this;
        }
    }
}