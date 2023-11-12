namespace m4m.framework
{
    @reflect.nodeComponent
    export class BeBillboard implements INodeComponent {
        static readonly ClassName:string="BeBillboard";

        start() {

        }

        onPlay()
        {

        }

        update(delta: number) {
            if(!this.beActive||this.target==null) return;
            this.gameObject.transform.lookat(this.target);
        }
        gameObject: gameObject;
        remove() {

        }
        clone() {

        }
        private beActive:boolean=true;
        /**
         * 设置是否激活
         * @param active 是否激活
         */
        setActive(active:boolean)
        {
            this.beActive=active;
        }
        private target:transform=null;
        /**
         * 设置目标
         * @param trans 目标
         */
        setTarget(trans:transform)
        {
            this.target=trans;
        }
    }
}