// namespace m4m.render
// {
//     /**
//      * @private
//      */
//     export class glWindow
//     {
//         renderTarget: m4m.render.glRenderTarget;
//         clearop_Color: boolean = false;
//         backColor: m4m.math.color = new m4m.math.color(1, 0, 1, 1);
//         clearop_Depth: boolean = false;
//         clearop_Stencil: boolean = false;
//         viewport: m4m.math.rect = new m4m.math.rect(0, 0, 1, 1);
//         use(webgl: WebGL2RenderingContext)
//         {
//             //rendertarget
//             if (this.renderTarget != null)
//             {
//                 this.renderTarget.use(webgl);
//             }
//             else
//             {
//                 m4m.render.glRenderTarget.useNull(webgl);
//             }

//             //clear
//             if (this.backColor != null)
//                 webgl.clearColor(this.backColor.r, this.backColor.g, this.backColor.b, this.backColor.a);
//             var n = 0;
//             if (this.clearop_Color) n |= webgl.COLOR_BUFFER_BIT;
//             if (this.clearop_Depth) n |= webgl.DEPTH_BUFFER_BIT;
//             if (this.clearop_Stencil) n |= webgl.STENCIL_BUFFER_BIT;
//             webgl.clear(n);

//             //viewport
//             if (this.renderTarget != null)
//             {
//                 webgl.viewport(this.renderTarget.width * this.viewport.x, this.renderTarget.height * this.viewport.y,
//                     this.renderTarget.width * this.viewport.w, this.renderTarget.height * this.viewport.h);
//             }
//             else
//             {
//                 webgl.viewport(webgl.canvas.width * this.viewport.x, webgl.canvas.height * this.viewport.y,
//                     webgl.canvas.width * this.viewport.w, webgl.canvas.height * this.viewport.h);
//             }
//         }
//     }
// }