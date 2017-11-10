/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.nodeComponent
    export class keyframeanimation implements INodeComponent
    {
        private _keyframeasset:keyframeAnimationPathAsset;

        private positions:gd3d.framework.keyframepathpositionitem[];
        private rotations:gd3d.framework.keyframepathrotationitem[];
        private timelength:number=0;
        private beloop:boolean=false;      

        playingtime:number=0;

        set keyframeasset(keyframeasset:keyframeAnimationPathAsset)
        {
            if(this._keyframeasset)
            {
                this._keyframeasset.unuse();
            }
            this._keyframeasset=keyframeasset;
            if(this._keyframeasset)
            {
                this._keyframeasset.use();
            }
        }               

        get keyframeasset()
        {
            return this._keyframeasset;
        }

        setkeyframeanimationasst(keyframeanimationpathasset:keyframeAnimationPathAsset)
        {
            this._keyframeasset=keyframeanimationpathasset;
            if(keyframeanimationpathasset==null)
            {
                console.log(this.gameObject.getName().toString()+":are you set the right keyframeanimationasset(error:null)?");
                return;
            }
            
            this.positions=keyframeanimationpathasset.positionitems;
            this.rotations=keyframeanimationpathasset.rotationitmes;
            this.timelength=keyframeanimationpathasset.timeLength;
            this.beloop=keyframeanimationpathasset.beloop;
            if(this.positions[0]!=null)
            {
                gd3d.math.vec3Clone(this.positions[0].position,this.gameObject.transform.localTranslate);                
            }
            if(this.rotations[0]!=null)
            {
                gd3d.math.quatClone(this.rotations[0].rotation,this.gameObject.transform.localRotate);                
            }
            //this.gameObject.transform.markDirty();
            this.mystrans=this.gameObject.transform;
            this.mystrans.markDirty();
        }


        isactived:boolean=false;

        start()
        {
            
        }
        update(delta: number)
        {
            if(!this.isactived ) return;
            this.followmove(delta);
        }


        lastpositionindex:number=0;
        lastrotationindex:number=0;
        private followmove(delta:number)
        {
             this.playingtime+=delta;
            
            let lastpositionindex=this.lastpositionindex;
            let lastrotationindex=this.lastrotationindex;

            if(this.positions[0]!=null)
            {
                if(this.playingtime>=this.positions[this.positions.length-1].time)
                {
                    if(!this.beloop)
                    {
                        this.isactived=false;
                    }
                    else
                    {
                        this.replay();
                    }
                }

                if(lastpositionindex<this.positions.length-1)
                {
                    while(this.playingtime>this.positions[lastpositionindex].time)
                    {                        
                        lastpositionindex++;                      
                        if(lastpositionindex==this.positions.length-1)
                            break;                   
                    } 
                }    

                if(this.positions[lastpositionindex].time-this.playingtime<0.016)
                {    
                    this.mystrans.localTranslate.x=this.positions[lastpositionindex].position.x;
                    this.mystrans.localTranslate.y=this.positions[lastpositionindex].position.y;
                    this.mystrans.localTranslate.z=this.positions[lastpositionindex].position.z;

                    this.mystrans.markDirty();
                    this.playingtime=this.positions[lastpositionindex].time;                    
                }
                else
                {
                    let positionlerp:number=delta/(this.positions[lastpositionindex].time-(this.playingtime-delta));                
                    gd3d.math.vec3SLerp(this.mystrans.localTranslate,this.positions[lastpositionindex].position,positionlerp,this.mystrans.localTranslate);
                    this.mystrans.markDirty();
                }                
            }
            
            if(this.rotations[0]!=null)
            {
                if(this.playingtime>=this.rotations[this.rotations.length-1].time)
                {
                    if(!this.beloop)
                    {
                        this.isactived=false;
                    }
                    else
                    {
                        this.replay();
                    }
                }

                if(lastrotationindex<this.rotations.length-1)
                {
                    while(this.playingtime>this.rotations[lastrotationindex].time)
                    {
                        lastrotationindex++;
                        if(lastrotationindex==this.rotations.length-1)
                            break;
                    }            
                }  


                if(this.rotations[lastrotationindex].time-this.playingtime<0.01)
                {    
                    this.mystrans.localRotate.x=this.rotations[lastrotationindex].rotation.x;
                    this.mystrans.localRotate.y=this.rotations[lastrotationindex].rotation.y;
                    this.mystrans.localRotate.z=this.rotations[lastrotationindex].rotation.z;
                    this.mystrans.localRotate.w=this.rotations[lastrotationindex].rotation.w;

                    this.mystrans.markDirty();
                    this.playingtime=this.rotations[lastrotationindex].time;                    
                }
                else
                {                
                    let rotationlerp:number=delta/(this.rotations[lastrotationindex].time-(this.playingtime-delta));
                    gd3d.math.quatLerp(this.mystrans.localRotate,this.rotations[lastrotationindex].rotation,this.mystrans.localRotate,rotationlerp);
                    this.mystrans.markDirty();
                }      
            }           
            this.lastpositionindex=lastpositionindex;
            this.lastrotationindex=lastrotationindex;         
        }

        gameObject: gameObject;
        private mystrans:transform;
        
        remove()
        {
            if(this._keyframeasset)
            {
                this._keyframeasset.unuse();
            }
        }
        clone()
        {

        }

        play()
        {
            this.isactived=true;
        }
        
        pause()
        {
            this.isactived=false;
        }

        stop()
        {
            this.isactived=false;
        }

        replay()
        {           
            this.playingtime=0;
            this.lastpositionindex=0;
            this.lastrotationindex=0;
            if(this.positions[0]!=null)
            {
                this.mystrans.localTranslate=this.positions[0].position;
            }
            if(this.rotations[0]!=null)
            {
                this.mystrans.localRotate=this.rotations[0].rotation;
            }
            this.isactived=true;
        }

    }


}