///<reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{

    @gd3d.reflect.SerializeType
    export class keyframeAnimationPathAsset implements IAsset
    {  
        @gd3d.reflect.Field("ConstText")
        private name:constText;
        private id:resID=new resID();

        defaultAsset:boolean=false;//是否为系统默认资源      
        constructor(assetName:string=null)
        {
            if(!assetName)
            {
                assetName="keyframepath_"+this.getGUID();
            }
            this.name=new constText(assetName);
        }

        getName():string
        {
            return this.name.getText();
        }

        getGUID():number
        {
            return this.id.getID();
        }

        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }

        beloop:boolean=false;
        timeLength:number;
        positionitems:keyframepathpositionitem[]=[];
        rotationitmes:keyframepathrotationitem[]=[];
        Parse(json:JSON)
        {
            var isloop:string=json["isLoop"];
            if(isloop=="True")
            {
                this.beloop=true;
            }
            else
            {
                this.beloop=false;
            }   

            this.timeLength=json["timeLength"];

            var position=json["position"];
            for(var key in position)
            {
                var item=new keyframepathpositionitem();
                var pointnode=position[key];

                item.time=pointnode["time"];               
                var itemposition:string=pointnode["position"];
                var arr=itemposition.split(",");
                item.position=new gd3d.math.vector3(parseFloat(arr[0]),parseFloat(arr[1]),parseFloat(arr[2]));
                this.positionitems.push(item);
            }

            var rotation=json["rotation"];
            for(var key in rotation)
            {
                var item1=new keyframepathrotationitem();
                var rotationnode=rotation[key];

                item1.time=rotationnode["time"];
                var itemrotation:string = rotationnode["rotation"];
                var arr1=itemrotation.split(",");
                item1.rotation=new gd3d.math.quaternion(parseFloat(arr1[0]),parseFloat(arr1[1]),parseFloat(arr1[2]),parseFloat(arr1[3]));
                this.rotationitmes.push(item1);
            } 
        }

        unuse()
        {
            sceneMgr.app.getAssetMgr().unuse(this);
        }

        dispose()
        {
            this.positionitems.length=0;
            this.rotationitmes.length=0;
        }
       
        caclByteLength(): number
        {
            var number=0;
            if(this.positionitems)
            {
               number+= this.positionitems.length*16;
            }
            if(this.rotationitmes)
            {
                number+=this.rotationitmes.length*20;
            }
            return number;
        }

    }


    export class keyframepathpositionitem
    {
        position:gd3d.math.vector3;
        time:number;
    }
    
    export class keyframepathrotationitem
    {
        rotation:gd3d.math.quaternion;
        time:number;
    }
}