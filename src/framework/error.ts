namespace m4m.framework {
    //错误搜集类
    export class error {
        public static openQueue: boolean = true;
        public static onError: (err: Error) => void;
        public static push(err: Error) {
            console.error(err.stack);
            if (this.openQueue && this.onError)
                this.onError(err);
        }
    }
}