namespace gd3d.framework
{
    //错误搜集类
    export class error
    {
        public static openQueue: boolean;
        public static onError: (err: Error) => void;
        public static push(err: Error)
        {
            if (this.openQueue && this.onError)
                this.onError(err);
            else
                console.error(err.stack);
        }
    }
}