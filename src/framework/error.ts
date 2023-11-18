namespace m4m.framework {
    //错误搜集类
    export class error {
        public static openQueue: boolean = true;
        /**
         * 当异常时
         */
        public static onError: (err: Error) => void;
        /**
         * 添加异常
         * @param err 异常
         */
        public static push(err: Error) {
            console.error(err.stack);
            if (this.openQueue && this.onError)
                this.onError(err);
        }
    }
}