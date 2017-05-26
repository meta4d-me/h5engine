/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.nodeComponent
    export class meshFilter implements INodeComponent
    {
        gameObject: gameObject;
        start()
        {

        }
        update(delta: number)
        {

        }

        private _mesh: mesh;

        //本意mesh filter 可以弄一点 模型处理，比如lod
        //先直进直出吧
        @gd3d.reflect.Field("mesh")
        @gd3d.reflect.UIStyle("WidgetDragSelect")
        get mesh()
        {
            return this._mesh;
        }
        set mesh(mesh: mesh)
        {
            if (this._mesh != null)
            {
                this._mesh.unuse();
            }
            this._mesh = mesh;
            if (this._mesh != null)
            {
                this._mesh.use();
            }
        }
        getMeshOutput()
        {
            return this._mesh;
        }

        remove()
        {
            if(this.mesh)
                this.mesh.unuse(true);
        }
        clone()
        {

        }
    }

}