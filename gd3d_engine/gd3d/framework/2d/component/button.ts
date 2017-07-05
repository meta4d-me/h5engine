/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 按钮变换类型
     * @version egret-gd3d 1.0
     */
    export enum TransitionType
    {
        None,
        ColorTint,
        SpriteSwap
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d按钮组件
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    export class button implements IRectRenderer
    {
        private _transition: TransitionType = TransitionType.ColorTint;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按钮变换类型
         * @version egret-gd3d 1.0
         */
        @reflect.Field("number")
        get transition()
        {
            return this._transition;
        }
        set transition(transition: TransitionType)
        {
            this._transition = transition;
            if (this._targetImage != null)
            {
                if (transition == TransitionType.ColorTint)
                {
                    this._targetImage.color = this.normalColor;
                }
                else
                {
                    this._targetImage.color = this._originalColor;
                }
            }
        }

        private _originalColor: math.color;
        private _originalSprite: sprite;
        private _targetImage: image2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 默认显示图像
         * @version egret-gd3d 1.0
         */
        get targetImage()
        {
            return this._targetImage;
        }
        set targetImage(graphic: image2D)
        {
            if (this._targetImage != null)
            {
                this._targetImage.color = this._originalColor;
            }
            if (graphic != null)
            {
                this._originalColor = graphic.color;
                this._originalSprite = graphic.sprite;
                if (this._transition = TransitionType.ColorTint)
                {
                    graphic.color = this.normalColor;
                }
            }
            else
            {
                this._originalColor = null;
                this._originalSprite = null;
            }
            this._targetImage = graphic;
        }

        private _pressedSprite: sprite;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按下时要显示的sprite
         * @version egret-gd3d 1.0
         */
        get pressedGraphic()
        {
            return this._pressedSprite;
        }
        set pressedGraphic(sprite: sprite)
        {
            this._pressedSprite = sprite;
        }

        private _normalColor: math.color = new math.color(1, 1, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 正常的显示颜色
         * @version egret-gd3d 1.0
         */
        @reflect.Field("color")
        get normalColor()
        {
            return this._normalColor;
        }
        set normalColor(color: math.color)
        {
            this._normalColor = color;
            if (this._targetImage != null && this.transition == TransitionType.ColorTint)
            {
                this._targetImage.color = color;
            }
        }

        private _pressedColor: math.color = new math.color(0.5, 0.5, 0.5, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按下后的颜色
         * @version egret-gd3d 1.0
         */
        get pressedColor()
        {
            return this._pressedColor;
        }
        set pressedColor(color: math.color)
        {
            this._pressedColor = color;
        }

        private _fadeDuration: number = 0.1;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 颜色淡出持续时间
         * @version egret-gd3d 1.0
         */
        @reflect.Field("number")
        get fadeDuration()
        {
            return this._fadeDuration;
        }
        set fadeDuration(duration: number)
        {
            this._fadeDuration = duration;
        }

        /**
         * @private
         */
        render(canvas: canvas)
        {
        }
        /**
         * @private
         */
        updateTran()
        {
        }
        /**
         * @private
         */
        start()
        {
        }
        /**
         * @private
         */
        update(delta: number)
        {
            // math.colorLerp();
        }
        transform: transform2D;
        /**
         * @private
         */
        remove()
        {

        }
        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {
            //oncap==true 是捕获阶段，一般的行为，只在pop阶段处理
            if (oncap == false)
            {
                var b = this.transform.ContainsCanvasPoint(new math.vector2(ev.x, ev.y));

                if (b)
                {
                    if (ev.type == PointEventEnum.PointDown)
                    {
                        this._downInThis = true;
                        this.showPress();
                    }
                    else if (ev.type == PointEventEnum.PointHold && this._downInThis)
                    {
                        if (this._dragOut == true)
                        {
                            this._dragOut = false;
                            this.showPress();
                        }
                    }
                    else if (ev.type == PointEventEnum.PointUp && this._downInThis)
                    {
                        this._downInThis = false;
                        this.showNormal();
                        this.onClick.excute();
                    }
                }
                else
                {
                    if (ev.type == PointEventEnum.PointUp)
                    {//在区域外抬起
                        this._downInThis = false;
                    }
                    else if (ev.type == PointEventEnum.PointHold && this._downInThis)
                    {
                        if (this._dragOut == false)
                        {
                            this._dragOut = true;
                            this.showNormal();
                        }
                    }
                }
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 点击事件
         * @version egret-gd3d 1.0
         */
        onClick: UIEvent = new UIEvent();

        private _downInThis = false;
        private _dragOut = false;

        /**
         * @private
         */
        private showNormal()
        {
            if (this.transition == TransitionType.ColorTint)
            {
                this.changeColor(this._normalColor);
            }
            else if (this.transition == TransitionType.SpriteSwap)
            {
                this.changeSprite(this._originalSprite);
            }
        }

        /**
         * @private
         */
        private showPress()
        {
            if (this.transition == TransitionType.ColorTint)
            {
                this.changeColor(this._pressedColor);
            }
            else if (this.transition == TransitionType.SpriteSwap)
            {
                if (this._targetImage != null && this._targetImage.sprite != null && this._originalSprite == null){
                    this._originalSprite = this._targetImage.sprite;
                }
                this.changeSprite(this._pressedSprite);
            }
        }

        /**
         * @private
         */
        private changeColor(targetColor: math.color): void
        {
            if (this._targetImage != null)
            {
                this._targetImage.color = targetColor;
                this._targetImage.transform.markDirty();
            }
        }

        /**
         * @private
         */
        private changeSprite(sprite: sprite)
        {
            if(sprite == null) return;
            if (this._targetImage != null)
            {
                this._targetImage.sprite = sprite;
                this._targetImage.transform.markDirty();
            }
        }
    }
}