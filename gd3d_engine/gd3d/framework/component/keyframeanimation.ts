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
        //用来控制播放的速率
        private frameRate:number=0;   
       
        pathdata:{[pathid:string]:pathData}={};
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
            this.frameRate=keyframeanimationpathasset.frameRate;
            this.pathdata=keyframeanimationpathasset.pathdata;

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
            
            this.setChildTrans(this.mystrans);

            this.mystrans.markDirty();
     
        }

        //获取当前父物体的所有子物体的路径 和 transform
        childrentrans:{[pathname:string]: transform}={};
        childrenpaths:{child:transform,path:pathData}[]=[];
        
        setChildTrans(mytrans:transform)
        {
            if(mytrans.children)
            {
                for(let i=0;i<mytrans.children.length;i++)
                {
                    if(mytrans.children[i]!=this.mystrans)
                    {
                        var parent:transform=new gd3d.framework.transform();
                        parent = mytrans.children[i].parent;            
                        var name= mytrans.children[i].name;                       
                        while(parent!=this.mystrans)
                        {
                            name=parent.name+"/"+name;
                            parent=parent.parent;                          
                        }                
        
                        for(var key in this.pathdata)
                        {
                            if(name==key)
                            {
                                this.childrentrans[name]=mytrans.children[i];   
                                this.childrenpaths.push({child:this.childrentrans[name], path:this.pathdata[key]});                                      
                            }
                        }
                    } 
                    this.setChildTrans(mytrans.children[i]);
                }
            }            
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
                if(this.playingtime>=this.timelength)
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

                if( this.positions[lastpositionindex].time>(this.playingtime-delta) && this.positions[lastpositionindex].time-this.playingtime<0.016)
                {    
                    this.mystrans.localTranslate.x=this.positions[lastpositionindex].position.x;
                    this.mystrans.localTranslate.y=this.positions[lastpositionindex].position.y;
                    this.mystrans.localTranslate.z=this.positions[lastpositionindex].position.z;

                    this.mystrans.markDirty();
                    //this.playingtime=this.positions[lastpositionindex].time;                    
                }
                else if(this.positions[lastpositionindex].time>(this.playingtime-delta))
                {
                    let positionlerp:number=delta/(this.positions[lastpositionindex].time-(this.playingtime-delta));                
                    gd3d.math.vec3SLerp(this.mystrans.localTranslate,this.positions[lastpositionindex].position,positionlerp,this.mystrans.localTranslate);
                    this.mystrans.markDirty();
                }                
            }
            
            if(this.rotations[0]!=null)
            {                
                if(this.playingtime>=this.timelength)
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


                if(this.rotations[lastrotationindex].time>(this.playingtime-delta) && this.rotations[lastrotationindex].time-(this.playingtime-delta)<0.01)
                {    
                    this.mystrans.localRotate.x=this.rotations[lastrotationindex].rotation.x;
                    this.mystrans.localRotate.y=this.rotations[lastrotationindex].rotation.y;
                    this.mystrans.localRotate.z=this.rotations[lastrotationindex].rotation.z;
                    this.mystrans.localRotate.w=this.rotations[lastrotationindex].rotation.w;

                    this.mystrans.markDirty();
                   // this.playingtime=this.rotations[lastrotationindex].time;                    
                }
                else if(this.rotations[lastrotationindex].time>(this.playingtime-delta))
                {                
                    let rotationlerp:number=delta/(this.rotations[lastrotationindex].time-(this.playingtime-delta));
                    gd3d.math.quatLerp(this.mystrans.localRotate,this.rotations[lastrotationindex].rotation,this.mystrans.localRotate,rotationlerp);
                    this.mystrans.markDirty();
                }      
            }  
            
            this.childrenfollow(delta);
            
            this.lastpositionindex=lastpositionindex;
            this.lastrotationindex=lastrotationindex;         
        }


        private childrenfollow(delta:number)
        {
            var playingtime=this.playingtime;
            for(var i=0;i<this.childrenpaths.length;i++)
            {
                let item=this.childrenpaths[i];
                let childtrans:gd3d.framework.transform=item.child;
                let childpositions:keyframepathpositionitem[]=item.path.positions;
                let childrotations:keyframepathrotationitem[]=item.path.rotations;

                //位置的更新
                if(childpositions.length>0)
                {
                    let aheadpositionindex:number=0;
                    while(playingtime>childpositions[aheadpositionindex].time)
                    {
                        aheadpositionindex++;
                        if(aheadpositionindex==childpositions.length-1)
                        break;
                    }

                    if(playingtime<=childpositions[aheadpositionindex].time)
                    {
                        if(childpositions[aheadpositionindex].time-playingtime<0.016)
                        {
                            gd3d.math.vec3Clone(childpositions[aheadpositionindex].position,childtrans.localTranslate);
                            childtrans.markDirty();
                            //似乎不需要
                        }
                        else
                        {
                            let positionlerp:number=delta/(childpositions[aheadpositionindex].time-(playingtime-delta));  
                            gd3d.math.vec3SLerp(childtrans.localTranslate,childpositions[aheadpositionindex].position,positionlerp,childtrans.localTranslate);
                            childtrans.markDirty();
                        }
                    }
                }

                //旋转的更新

                if(childrotations.length>0)
                {
                    let aheadrotationindex:number=0;
                    while(playingtime>childrotations[aheadrotationindex].time)
                    {
                        aheadrotationindex++;
                        if(aheadrotationindex==childrotations.length-1)
                        break;
                    }

                    if(playingtime<=childrotations[aheadrotationindex].time)
                    {
                        if(childrotations[aheadrotationindex].time-playingtime<0.016)
                        {
                            gd3d.math.quatClone (childrotations[aheadrotationindex].rotation,childtrans.localRotate);
                            childtrans.markDirty();
                            //似乎不需要
                        }
                        else
                        {
                            let rotationlerp:number=delta/(childrotations[aheadrotationindex].time-(playingtime-delta));  
                            gd3d.math.quatLerp(childtrans.localRotate,childrotations[aheadrotationindex].rotation,childtrans.localRotate,rotationlerp);
                            childtrans.markDirty();
                        }
                    }
                }  
            }
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
                gd3d.math.vec3Clone(this.positions[0].position,this.mystrans.localTranslate);
                
            }
            if(this.rotations[0]!=null)
            {
                gd3d.math.quatClone(this.rotations[0].rotation,this.mystrans.localRotate);
             
            }
            this.isactived=true;
        }
    }
}