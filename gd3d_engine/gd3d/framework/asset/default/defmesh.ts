namespace gd3d.framework
{
    export class defMesh
    {
        static readonly cube = "cube";
        static readonly quad = "quad";
        static readonly quad_particle = "quad_particle";
        static readonly plane = "plane";
        static readonly sphere = "sphere";
        static readonly sphere_quality = "sphere_quality";
        static readonly pyramid = "pyramid";
        static readonly cylinder = "cylinder";
        static readonly circleline = "circleline";

        static initDefaultMesh(assetmgr: assetMgr)
        {
            assetmgr.mapDefaultMesh[this.cube] = this.createDefaultMesh(this.cube, gd3d.render.meshData.genBoxCCW(1.0), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.quad] = this.createDefaultMesh(this.quad, gd3d.render.meshData.genQuad(1.0), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.quad_particle] = this.createDefaultMesh(this.quad_particle, gd3d.render.meshData.genQuad_forparticle(1.0), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.plane] = this.createDefaultMesh(this.plane, gd3d.render.meshData.genPlaneCCW(10), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.sphere] = this.createDefaultMesh(this.sphere, gd3d.render.meshData.genSphereCCW(), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.sphere_quality] = this.createDefaultMesh(this.sphere_quality, gd3d.render.meshData.genSphereCCW(2.58,40,40), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.pyramid] = this.createDefaultMesh(this.pyramid, gd3d.render.meshData.genPyramid(2,0.5), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.cylinder] = this.createDefaultMesh(this.cylinder, gd3d.render.meshData.genCylinderCCW(2, 0.5), assetmgr.webgl);
            assetmgr.mapDefaultMesh[this.circleline] = this.createDefaultMesh(this.circleline, gd3d.render.meshData.genCircleLineCCW(1), assetmgr.webgl);
        }

        private static createDefaultMesh(name: string, meshData: render.meshData, webgl: WebGLRenderingContext): mesh
        {
            var _mesh: gd3d.framework.mesh = new gd3d.framework.mesh(name + ".mesh.bin");
            _mesh.defaultAsset = true;
            _mesh.data = meshData;
            var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Normal| gd3d.render.VertexFormatMask.Tangent | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0;
            _mesh.data.originVF=vf;
            var v32 = _mesh.data.genVertexDataArray(vf);
            var i16 = _mesh.data.genIndexDataArray();

            _mesh.glMesh = new gd3d.render.glMesh();
            _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
            _mesh.glMesh.uploadVertexData(webgl, v32);

            _mesh.glMesh.addIndex(webgl, i16.length);
            _mesh.glMesh.uploadIndexData(webgl, 0, i16);
            _mesh.submesh = [];

            {
                var sm = new gd3d.framework.subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = false;
                _mesh.submesh.push(sm);
            }
            return _mesh;
        }
    }
}