attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;   
attribute vec4 _glesColor;                   
uniform highp mat4 glstate_matrix_mvp;    
uniform highp float glstate_fog_start;
uniform highp float glstate_fog_end;

varying highp float factor;  
varying lowp vec4 xlv_COLOR;
varying highp vec2 xlv_TEXCOORD0;                
void main()                                     
{                                               
    highp vec4 tmpvar_1;                        
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;             
    xlv_COLOR = _glesColor;
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;            
    
    highp vec4 pos = (glstate_matrix_mvp * tmpvar_1);
    factor = (glstate_fog_end - abs(pos.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}