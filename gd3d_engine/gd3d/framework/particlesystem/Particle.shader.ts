namespace feng3d
{

    export interface UniformsMap { particle: ParticleUniforms }

    export class ParticleUniforms
    {
        __class__: "feng3d.ParticleUniforms" = "feng3d.ParticleUniforms";

        /**
         * 点绘制时点的尺寸
         */
        u_PointSize = 1;

        /**
         * 漫反射纹理
         */
        s_diffuse = Texture2D.defaultParticle;

        /**
         * 基本颜色
         */
        u_diffuse = new Color4(1, 1, 1, 1);

        /**
         * 透明阈值，透明度小于该值的像素被片段着色器丢弃
         */
        u_alphaThreshold = 0;
    }

    shaderConfig.shaders["particle"].cls = ParticleUniforms;
    shaderConfig.shaders["particle"].renderParams = { enableBlend: true, depthMask: false, sfactor: BlendFactor.ONE, dfactor: BlendFactor.ONE_MINUS_SRC_COLOR, cullFace: CullFace.NONE };

    Material.particle = AssetData.addAssetData("Particle-Material", serialization.setValue(Material.create("particle"), {
        name: "Particle-Material", assetId: "Particle-Material", hideFlags: HideFlags.NotEditable,
    }));
}