#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define PI          3.141592653589

uniform samplerCube u_sky;      // IBL
uniform sampler2D   brdf;       // BRDF LUT
uniform vec4        glstate_eyepos;
uniform highp mat4  glstate_matrix_world2object;

// PBR 材质贴图
uniform sampler2D   uv_Normal;
uniform sampler2D   uv_Basecolor;
uniform sampler2D   uv_MetallicRoughness;
uniform sampler2D   uv_AO;


varying vec3        v_normal;
varying vec3        v_pos;
varying vec2        xlv_TEXCOORD0;
varying mat4        v_w2o;

vec3 Fresnel(vec3 f0, float LoN, float roughness) {
    return f0 + (max(vec3(1.0 - roughness), f0) - f0) * pow(1.0 - LoN, 5.0);
}

float Distribution(float roughness, float NoH) {
    float alpha = roughness * roughness;
    float alphaSq = alpha * alpha;
    float NoHsqr = NoH * NoH;
    return alphaSq / (pow( NoHsqr * alphaSq - NoHsqr + 1.0, 2.0) * PI);;
}

float Geometric(float roughness, float NoL, float NoV) {
    float k = pow(roughness + 1.0, 2.0) / 8.0;
    float Gl = NoL / ((NoL - NoL * k) + k);
    float Gv = NoV / ((NoV - NoV * k) + k);
    return Gl * Gv;
}

mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv){
    // get edge vectors of the pixel triangle
    vec3 dp1 = dFdx( p );
    vec3 dp2 = dFdy( p );
    vec2 duv1 = dFdx( uv );
    vec2 duv2 = dFdy( uv );

    // solve the linear system
    vec3 dp2perp = cross( dp2, N );
    vec3 dp1perp = cross( N, dp1 );
    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

    // construct a scale-invariant frame
    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
    return mat3( T * invmax, B * invmax, N );
}

void main () {
    // PBR Material
    vec4 PBRBasecolor   = texture2D(uv_Basecolor, xlv_TEXCOORD0);
    vec4 PBRNormal      = texture2D(uv_Normal, xlv_TEXCOORD0);
    vec3 PBRMetallic    = texture2D(uv_MetallicRoughness, xlv_TEXCOORD0).rgb;
    float PBRRoughness  = texture2D(uv_MetallicRoughness, xlv_TEXCOORD0).a;
    vec4 PBRAO          = texture2D(uv_AO, xlv_TEXCOORD0);

    vec3 n = normalize(v_normal);
    vec3 v = normalize(glstate_eyepos.xyz - v_pos);
    mat3 TBN = cotangent_frame(n, v, xlv_TEXCOORD0);
    vec3 normalAddation = PBRNormal.rgb * 2.0 - 1.0;
    n = normalize(TBN * normalAddation);

    float NdotV = abs(dot(n, v));

    vec3 f0 = vec3(0.04);
    f0 = mix(f0, PBRBasecolor.xyz, PBRMetallic);

    vec3 envLight   = textureCube(u_sky, (glstate_matrix_world2object * vec4(reflect(-v,n), 1.0)).xyz).rgb;
    vec2 envBRDF    = texture2D(brdf, vec2(NdotV, PBRRoughness)).rg;

    vec3 F = Fresnel(f0, NdotV, PBRRoughness);
    vec3 indirectSpecular = envLight * (F * envBRDF.r + envBRDF.g);
    // vec3 indirectSpecular = envLight * (f0 * envBRDF.r + envBRDF.g);

    gl_FragColor = (vec4((1.0 - F) * (1.0 - PBRMetallic), 1.0) * PBRBasecolor + vec4(indirectSpecular, 1.0)) * PBRAO; // IBL+PBR
}