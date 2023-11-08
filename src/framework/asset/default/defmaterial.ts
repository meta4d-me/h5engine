namespace m4m.framework
{
    export class defmaterial
    {
        /**
         * 初始化默认材质
         * @param assetmgr 资源管理
         */
        static initDefaultMaterial(assetmgr: assetMgr){
            {
                let mat = new material();
                let sh = assetmgr.getShader("shader/defui");
                mat.setShader(sh);
                assetmgr.mapMaterial[sh.getName()] = mat;
            }
        }
    }
}