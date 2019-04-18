//let helpv3 = new gd3d.math.vector2();
/** 表面贴花生成器 */
@gd3d.reflect.nodeComponent
class decalCreater extends gd3d.framework.behaviour
{
    private static helpv2 = new gd3d.math.vector2();
    private static helpv3 = new gd3d.math.vector3();
    private static helpv3_1 = new gd3d.math.vector3();
    private static helpv3_2 = new gd3d.math.vector3();
    private static helpv3_3 = new gd3d.math.vector3();
    private static helpqaut = new gd3d.math.quaternion();

    @gd3d.reflect.Field("number")
    sizeN = 3;
    @gd3d.reflect.Field("reference",null,"meshRenderer")
    tempTex : gd3d.framework.meshRenderer;
    @gd3d.reflect.Field("reference",null,"camera")
    camera : gd3d.framework.camera;
    @gd3d.reflect.Field("reference",null,"meshFilter")
    targetMF : gd3d.framework.meshFilter;
    private app : gd3d.framework.application;
    private scene : gd3d.framework.scene;
    private _assetMgr : gd3d.framework.assetMgr;
    private _offset = 0.05; //贴花 和 模型的间隔
    private tag_decalRoot = "__tag_decalRoot__"; //root 标记
    public onPlay() {
        if(!this.camera) return;
        
        let meshF = this.targetMF;
        let mTran = meshF.gameObject.transform;
        let mMtx = mTran.getWorldMatrix();
        //test
        this.scene = this.gameObject.transform.scene;
        let app = this.scene.app;
        this.app = app;
        this._assetMgr = app.getAssetMgr();
        let iptMgr = app.getInputMgr();
        let pinfo = new gd3d.framework.pickinfo();
        let tv2 = decalCreater.helpv2;
        //点击屏幕
        iptMgr.addPointListener(gd3d.event.PointEventEnum.PointDown,([x,y])=>{
            console.warn(` pos : ${x}_${y}`);
            gd3d.math.vec2Set(tv2,x,y);
            decalCreater.multipleViewFix(this.camera,app,tv2,tv2);
            let ray = this.camera.creatRayByScreen(tv2,app);
            let b = meshF.mesh.intersects(ray,mMtx,pinfo);
            if(!b) return;
            
            this.sprayDecal(pinfo);
            // //计算旋转
            // this.calecWorldNormal(pinfo,meshF,wdir);
            // this.calecRoation(wdir,pinfo,rotate);
            // let cc = this.print(meshF,pinfo.hitposition,rotate,size);
            // //偏移
            // gd3d.math.vec3ScaleByNum(wdir,this._offset,woffsetPos);
            // gd3d.math.vec3Add(cc.localPosition,woffsetPos,cc.localPosition);
            // scene.addChild(cc);
        },this);
    }
    public update(delta: number) {

    }
    public remove()
    {
        
    }

    /** 贴花最大数量限制（每个模型） */
    limitDecalMaxCount : number = 5;
    private size = new gd3d.math.vector3();
    private wdir = new gd3d.math.vector3();
    private rotate = new gd3d.math.quaternion();
    private woffsetPos = new gd3d.math.vector3();
    /** 喷贴花 */
    sprayDecal (pinfo : gd3d.framework.pickinfo){
        if(!pinfo || !this.targetMF) return;

        let meshF = this.targetMF;
        let mfTrans = meshF.gameObject.transform;
        let droot :gd3d.framework.transform;
        let len = mfTrans.children.length;
        for(let i = 0 ;i < len ;i++){
            let c = mfTrans.children[i];
            if(c && c[this.tag_decalRoot]){
                droot = c;
                break;
            }
            if(i == len - 1){
                droot = new gd3d.framework.transform();
                droot.name = "decalRoot";
                droot[this.tag_decalRoot] = true;
                mfTrans.addChildAt(droot,0);
            }
        }
        let wdir = this.wdir;
        //计算旋转
        this.calecWorldNormal(pinfo,meshF,wdir);
        this.calecRoation(wdir,pinfo,this.rotate);
        gd3d.math.vec3SetAll(this.size,this.sizeN);
        let cc = this.print(meshF,pinfo.hitposition,this.rotate,this.size);
        //偏移
        gd3d.math.vec3ScaleByNum(wdir,this._offset,this.woffsetPos);
        gd3d.math.vec3Add(cc.localPosition,this.woffsetPos,cc.localPosition);
        droot.addChild(cc);
        //设置到世界RTS
        cc.setWorldRotate(cc.localRotate);
        cc.setWorldScale(cc.localScale);
        cc.setWorldPosition(cc.localPosition);
        
        let clen = droot.children? droot.children.length : 0;
        let limiMC = this.limitDecalMaxCount < 0 ? 0 : this.limitDecalMaxCount; 
        if(clen > limiMC){
            //清理器之前的
            let fristT = droot.children[0];
            droot.removeChild(fristT);
            fristT.dispose();
        }
    }

    /**
     * 印制贴花到世界中
     */
    private print(meshF:gd3d.framework.meshFilter , position:gd3d.math.vector3, orientation:gd3d.math.quaternion, size:gd3d.math.vector3):gd3d.framework.transform{
        if(!this.app) return;
        let webgl = this.app.webgl;
        let d = new decalGeometry(meshF,position,orientation,size,webgl);
        d.meshF;
        let mr = d.meshF.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        mr.materials = [];
        let mat : gd3d.framework.material;
        if(this.tempTex){
            mat = this.tempTex.materials[0];
        }else{
            mr.materials[0] = new gd3d.framework.material();
            mr.materials[0].setShader(this.app.getAssetMgr().getShader("diffuse.shader.json"));
            mr.materials[0].setTexture("_MainTex",this._assetMgr.getDefaultTexture("grid"));
        }
        mr.materials[0] = mat;
        return d.meshF.gameObject.transform;
    }

    private calecWorldNormal(pinfo: gd3d.framework.pickinfo,mf:gd3d.framework.meshFilter,result:gd3d.math.vector3){
        let fid = pinfo.faceId;
        let md= mf.mesh.data;
        let trisIds = md.trisindex;
        let maseTran = mf.gameObject.transform; 
        //目标三角形
        let p1 = md.pos[trisIds[fid * 3]];
        let p2 = md.pos[trisIds[fid * 3 + 1]];
        let p3 = md.pos[trisIds[fid * 3 + 2]];
        //计算 法向量
        let line_a = decalCreater.helpv3;
        gd3d.math.vec3Subtract(p3,p1,line_a);
        let line_b = decalCreater.helpv3_1;
        gd3d.math.vec3Subtract(p2,p1,line_b);
        let nor = decalCreater.helpv3_2; 
        gd3d.math.vec3Cross(line_a,line_b,nor);
        // gd3d.math.vec3Normalize(nor,nor);
        let wmtx = maseTran.getWorldMatrix();
        //从mesh的方向 转到世界的方向
        gd3d.math.matrixTransformNormal(nor,wmtx,nor);
        gd3d.math.vec3Normalize(nor,result);
        // console.log(`nor  : ${nor.toString()}`);
    }
    
    private calecRoation(dir:gd3d.math.vector3,pinfo: gd3d.framework.pickinfo,result: gd3d.math.quaternion){
        let lookpoint = decalCreater.helpv3;
        gd3d.math.vec3Clone(dir,lookpoint);
        gd3d.math.vec3ScaleByNum(lookpoint,10,lookpoint);
        gd3d.math.vec3Add(lookpoint,pinfo.hitposition,lookpoint);
        //lookat
        gd3d.math.quatLookat(pinfo.hitposition,lookpoint,result);
        //随机一个 旋转
        let rAg = Math.random() * 360;
        gd3d.math.quatFromAxisAngle(dir,rAg,decalCreater.helpqaut);
        gd3d.math.quatMultiply(decalCreater.helpqaut,result,result);
    }

    private static multipleViewFix(_camera:gd3d.framework.camera , app : gd3d.framework.application, screenPos: gd3d.math.vector2,result:gd3d.math.vector2){
        let vp = _camera.viewport;
        let offset_x = app.width * vp.x;
        let offset_y = app.height * vp.y;

        gd3d.math.vec2Clone(screenPos,result);
        result.x -= offset_x;
        result.y -= offset_y;
    }
    
}

/**
 * 贴花几何体
 */
class decalGeometry{
    private static onlyPostion = false; //ignore more vertices data , example of normal ...
    mesh: gd3d.framework.mesh;
    meshF: gd3d.framework.meshFilter;
    private static id = 0;
    private static planes = [new gd3d.math.vector3(1, 0, 0),new gd3d.math.vector3( - 1, 0, 0),new gd3d.math.vector3(0, 1, 0),
                    new gd3d.math.vector3(0, - 1, 0),new gd3d.math.vector3(0, 0, 1),new gd3d.math.vector3(0, 0, - 1),];
    private projectorMatrix: gd3d.math.matrix;
    private projectorMatrixInverse: gd3d.math.matrix;
    private plane : gd3d.math.vector3;
    private vertices : gd3d.math.vector3 []= [];
    private normals : gd3d.math.vector3[]= [];
    private uvs : gd3d.math.vector2[] = [];
    constructor(public tragetMeshf: gd3d.framework.meshFilter , public position:gd3d.math.vector3, public orientation:gd3d.math.quaternion,public size:gd3d.math.vector3 , webgl : WebGLRenderingContext){
    	// THREE.BufferGeometry.call( this );
        decalGeometry.id++;
        this.mesh = new gd3d.framework.mesh(`decalGeometry_${decalGeometry.id}`);
		// buffers
		// this matrix represents the transformation of the decal projector
		let projectorMatrix = new gd3d.math.matrix();
        this.projectorMatrix = projectorMatrix;
        gd3d.math.quatToMatrix(orientation,projectorMatrix);
		// projectorMatrix.makeRotationFromEuler( orientation );
        projectorMatrix.rawData[12] = position.x;
        projectorMatrix.rawData[13] = position.y;
        projectorMatrix.rawData[14] = position.z;
		// projectorMatrix.setPosition( position );

		let projectorMatrixInverse = new gd3d.math.matrix();
        this.projectorMatrixInverse = projectorMatrixInverse;
        gd3d.math.matrixInverse(projectorMatrix,projectorMatrixInverse);
		// let projectorMatrixInverse = new gd3d.math.matrix().getInverse( projectorMatrix );

		// // generate buffers
		this.generate();

		// build geometry
        this.mesh.data = new gd3d.render.meshData();
        let vfm =gd3d.render.VertexFormatMask; 
        let vf = vfm.Position | vfm.UV0 | vfm.Color;
        if(!decalGeometry.onlyPostion){
            let vf = vfm.Position | vfm.Normal | vfm.UV0 | vfm.Color;
            this.mesh.data.normal = this.normals;
        }
        this.mesh.data.originVF = vf;
        this.mesh.data.pos = this.vertices;
        this.mesh.data.uv = this.uvs;
        this.mesh.data.trisindex = [];

        this.mesh.data.pos.forEach((p,i)=>{
            this.mesh.data.trisindex.push(i);
        });

        // this.mesh.data.trisindex = [0,1,2,2,1,3];
        

        let vertexs = this.mesh.data.genVertexDataArray(vf);
        let indices = this.mesh.data.genIndexDataArray();
        this.mesh.glMesh = new gd3d.render.glMesh();
        this.mesh.glMesh.initBuffer(webgl, vf, this.mesh.data.pos.length);
        this.mesh.glMesh.uploadVertexData(webgl, vertexs);
        this.mesh.glMesh.addIndex(webgl, indices.length);
        this.mesh.glMesh.uploadIndexData(webgl, 0, indices);

        //sub mesh
        this.mesh.submesh = [];
        let minfo = new gd3d.framework.subMeshInfo ();
        minfo = new gd3d.framework.subMeshInfo ();
        minfo.line = false;
        minfo.matIndex = 0;
        minfo.size = indices.length;
        minfo.start = 0;
        minfo.useVertexIndex = 0;
        this.mesh.submesh.push(minfo);

        let outTran = new gd3d.framework.transform;
        this.meshF = outTran.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        this.meshF.mesh = this.mesh;
    }

    private generate() {
        let decalVertices : DecalVertex [] = [];
        let vertex = new gd3d.math.vector3();
        let normal = new gd3d.math.vector3();
        // first, create an array of 'DecalVertex' objects
        // three consecutive 'DecalVertex' objects represent a single face
        //
        // this data structure will be later used to perform the clipping

        let meshData = this.tragetMeshf.mesh.data;
        let vLen = meshData.trisindex.length;
        for(let i=0 ; i < vLen ; i++){
            let idx = meshData.trisindex[i];
            let p = gd3d.math.pool.clone_vector3(meshData.pos[idx]);
            let n;
            if(!decalGeometry.onlyPostion)  n = gd3d.math.pool.clone_vector3(meshData.normal[idx]);

            this.pushDecalVertex(decalVertices,p,n);
        }
        

        // second, clip the geometry so that it doesn't extend out from the projector
        let len  = decalGeometry.planes.length;
        for(let i=0; i < len ;i++){
            let p = decalGeometry.planes[i];
            decalVertices = this.clipGeometry(decalVertices,p);
        }

        // third, generate final vertices, normals and uvs

        let dlen = decalVertices.length;
        for (let i = 0; i < dlen ; i ++ ) {

            let decalVertex = decalVertices[ i ];
            let dPos = decalVertex.position;
            let dNor;
            if(!decalGeometry.onlyPostion)  dNor = decalVertex.normal;

            // create texture coordinates (we are still in projector space)
            let uv = new gd3d.math.vector2(
                0.5 + ( dPos.x / this.size.x ),
                0.5 + ( dPos.y / this.size.y )
                );
            this.uvs.push(uv);

            // transform the vertex back to world space
            gd3d.math.matrixTransformVector3(decalVertex.position,this.projectorMatrix,decalVertex.position);
            // now create vertex and normal buffer data

            this.vertices.push( gd3d.math.pool.clone_vector3(dPos) );
            if(!decalGeometry.onlyPostion)  this.normals.push( gd3d.math.pool.clone_vector3(dNor) );

        }

    }

    private pushDecalVertex( decalVertices:DecalVertex[], vertex : gd3d.math.vector3, normal:gd3d.math.vector3 ) {
        let pos = gd3d.math.pool.clone_vector3(vertex);
        let nor;
        if(!decalGeometry.onlyPostion)   nor = gd3d.math.pool.clone_vector3(normal);

        // transform the vertex to world space, then to projector space
        let wmat = this.tragetMeshf.gameObject.transform.getWorldMatrix();
        gd3d.math.matrixTransformVector3(pos , wmat ,pos);
        
        gd3d.math.matrixTransformVector3(pos ,this.projectorMatrixInverse , pos);
        decalVertices.push( new DecalVertex( pos,nor ) );
    }

    private clipGeometry( inVertices : DecalVertex[], plane : gd3d.math.vector3) {

        let outVertices = [];

        let s = 0.5 * Math.abs( gd3d.math.vec3Dot(this.size,plane) );

        // a single iteration clips one face,
        // which consists of three consecutive 'DecalVertex' objects

        for ( let i = 0; i < inVertices.length; i += 3 ) {

            let v1Out, v2Out, v3Out, total = 0;
            let nV1, nV2, nV3, nV4;

            let d1 = gd3d.math.vec3Dot(inVertices[ i + 0 ].position,plane)- s;
            let d2 = gd3d.math.vec3Dot(inVertices[ i + 1 ].position,plane)- s;
            let d3 = gd3d.math.vec3Dot(inVertices[ i + 2 ].position,plane)- s;

            v1Out = d1 > 0;
            v2Out = d2 > 0;
            v3Out = d3 > 0;

            // calculate, how many vertices of the face lie outside of the clipping plane

            total = ( v1Out ? 1 : 0 ) + ( v2Out ? 1 : 0 ) + ( v3Out ? 1 : 0 );

            switch ( total ) {

                case 0: {

                    // the entire face lies inside of the plane, no clipping needed

                    outVertices.push( inVertices[ i ] );
                    outVertices.push( inVertices[ i + 1 ] );
                    outVertices.push( inVertices[ i + 2 ] );
                    break;

                }

                case 1: {

                    // one vertex lies outside of the plane, perform clipping

                    if ( v1Out ) {

                        nV1 = inVertices[ i + 1 ];
                        nV2 = inVertices[ i + 2 ];

                        nV3 = this.clip( inVertices[ i ], nV1, plane, s );
                        nV4 = this.clip( inVertices[ i ], nV2, plane, s );

                    }

                    if ( v2Out ) {

                        nV1 = inVertices[ i ];
                        nV2 = inVertices[ i + 2 ];
                        nV3 = this.clip( inVertices[ i + 1 ], nV1, plane, s );
                        nV4 = this.clip( inVertices[ i + 1 ], nV2, plane, s );

                        outVertices.push( nV3 );
                        outVertices.push( nV2.clone() );
                        outVertices.push( nV1.clone() );

                        outVertices.push( nV2.clone() );
                        outVertices.push( nV3.clone() );
                        outVertices.push( nV4 );
                        break;
                    }

                    if ( v3Out ) {

                        nV1 = inVertices[ i ];
                        nV2 = inVertices[ i + 1 ];
                        nV3 = this.clip( inVertices[ i + 2 ], nV1, plane, s );
                        nV4 = this.clip( inVertices[ i + 2 ], nV2, plane, s );
                    }

                    outVertices.push( nV1.clone() );
                    outVertices.push( nV2.clone() );
                    outVertices.push( nV3 );

                    outVertices.push( nV4 );
                    outVertices.push( nV3.clone() );
                    outVertices.push( nV2.clone() );
                    break;
                }

                case 2: {

                    // two vertices lies outside of the plane, perform clipping

                    if ( ! v1Out ) {
                        nV1 = inVertices[ i ].clone();
                        nV2 = this.clip( nV1, inVertices[ i + 1 ], plane, s );
                        nV3 = this.clip( nV1, inVertices[ i + 2 ], plane, s );
                        outVertices.push( nV1 );
                        outVertices.push( nV2 );
                        outVertices.push( nV3 );
                    }

                    if ( ! v2Out ) {
                        nV1 = inVertices[ i + 1 ].clone();
                        nV2 = this.clip( nV1, inVertices[ i + 2 ], plane, s );
                        nV3 = this.clip( nV1, inVertices[ i ], plane, s );
                        outVertices.push( nV1 );
                        outVertices.push( nV2 );
                        outVertices.push( nV3 );
                    }

                    if ( ! v3Out ) {
                        nV1 = inVertices[ i + 2 ].clone();
                        nV2 = this.clip( nV1, inVertices[ i ], plane, s );
                        nV3 = this.clip( nV1, inVertices[ i + 1 ], plane, s );
                        outVertices.push( nV1 );
                        outVertices.push( nV2 );
                        outVertices.push( nV3 );
                    }
                    break;
                }
                case 3: {
                    // the entire face lies outside of the plane, so let's discard the corresponding vertices
                    break;
                }
            }
        }

        return outVertices;

    }

    private clip( v0:DecalVertex, v1:DecalVertex, p:gd3d.math.vector3, s:number ) {

        let d0 = gd3d.math.vec3Dot(p,v0.position) - s;
        let d1 = gd3d.math.vec3Dot(p,v1.position) - s;

        let s0 = d0 / ( d0 - d1 );

        let pos = new gd3d.math.vector3(
                v0.position.x + s0 * ( v1.position.x - v0.position.x ),
                v0.position.y + s0 * ( v1.position.y - v0.position.y ),
                v0.position.z + s0 * ( v1.position.z - v0.position.z )
            );

        let nor ;
        if(!decalGeometry.onlyPostion){
            nor = new gd3d.math.vector3(
                v0.normal.x + s0 * ( v1.normal.x - v0.normal.x ),
                v0.normal.y + s0 * ( v1.normal.y - v0.normal.y ),
                v0.normal.z + s0 * ( v1.normal.z - v0.normal.z )
            );
        }
        let v = new DecalVertex(pos, nor);

        // need to clip more values (texture coordinates)? do it this way:

        return v;
    }
}


class DecalVertex{
    position : gd3d.math.vector3;
    normal : gd3d.math.vector3;
    constructor(position: gd3d.math.vector3, normal?:gd3d.math.vector3){
		this.position = position;
		this.normal = normal;
    }

    clone(){
        let pos = gd3d.math.pool.clone_vector3(this.position);
        let nor;
        if(this.normal)  nor = gd3d.math.pool.clone_vector3(this.normal);
        return new DecalVertex( pos, nor );
    }

}
