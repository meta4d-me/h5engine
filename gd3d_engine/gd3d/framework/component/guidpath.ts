namespace gd3d.framework
{
    @reflect.nodeComponent
    export class guidpath implements INodeComponent
    {
        private paths:gd3d.math.vector3[];
        public pathasset:pathasset;
        public speed:number=1;

        private isactived:boolean=false;
        public setActive(value:boolean=true)
        {
            this.isactived=value;
        }
        isactive():boolean
        {
            return this.isactived;
        }
        private mystrans:transform;
        private datasafe:boolean=false;
        private folowindex:number=0;
        public isloop:boolean=false;
        lookforward:boolean=false;
        setpathasset(pathasset:pathasset,speed:number=1)
        {
            this.pathasset=pathasset;
            if(pathasset==null)
            {
                console.log(this.gameObject.getName().toString+":are you sure set the right pathasset（error：null）");
                return;
            }
            this.paths=pathasset.paths;
            if(this.paths[0]!=null)
            {
                gd3d.math.vec3Clone(this.paths[0],this.gameObject.transform.localTranslate);
                this.gameObject.transform.markDirty();
                this.datasafe=true;
            }
            this.mystrans=this.gameObject.transform;
            this.speed=speed;
        }
        start() 
        {

        }
        update(delta: number) 
        {
            if(!this.isactived||!this.datasafe) return;
            this.followmove(delta);
            
        }
        private adjustDir:boolean=false;
        private followmove(delta: number)
        {
            var dist=gd3d.math.vec3Distance(this.mystrans.localTranslate,this.paths[this.folowindex]);
            
            if(dist<0.01)
            {
                if(this.folowindex<this.paths.length-1)
                {
                    
                    var dir=new gd3d.math.vector3();
                    gd3d.math.vec3Clone(this.paths[this.folowindex],this.mystrans.localTranslate);
                    this.folowindex++;
                    this.adjustDir=true;
                    this.mystrans.markDirty();
                }
                else
                {
                    this.folowindex=0;
                    if(!this.isloop)
                    {
                        this.isactived=false;
                    }
                }
            }
            else
            {
                var dir=new gd3d.math.vector3();
                gd3d.math.vec3Subtract(this.paths[this.folowindex],this.mystrans.localTranslate,dir);

                if(this.adjustDir)
                {
                    var targetpos=this.paths[this.folowindex];
                    var localppos=this.mystrans.localTranslate;
                    var quat=gd3d.math.pool.new_quaternion();
                    gd3d.math.quatLookat(localppos,targetpos,quat);
                    gd3d.math.quatClone(quat,this.mystrans.localRotate);
                    gd3d.math.pool.delete_quaternion(quat);
                    this.adjustDir=false;
                }

                var distadd=this.speed*delta;
                if(distadd>dist) distadd=dist;
                var lerp=distadd/dist;
                gd3d.math.vec3SLerp(this.mystrans.localTranslate,this.paths[this.folowindex],lerp,this.mystrans.localTranslate);
                this.mystrans.markDirty();
            }
        }
        gameObject: gameObject;
        remove() 
        {
            throw new Error('Method not implemented.');
        }
        clone() 
        {
            throw new Error('Method not implemented.');
        }
    }
}