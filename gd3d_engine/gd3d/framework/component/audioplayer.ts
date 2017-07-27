/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.nodeComponent
    export class AudioPlayer implements INodeComponent
    {
        public _volume: number;
        public audioChannel: AudioChannel;
        public buffer: AudioBuffer;
        public beLoop: boolean;
        public name: String;
        /**
         * 初始化声音播放器的播放
         * @param buffer 声音资源
         * @param volume 音量大小
         * @param beLoop 
         */
        public init(name: string, buffer: AudioBuffer, volume: number, beLoop: boolean = false)
        {
            this.name = name;
            this.buffer = buffer;
            this.volume = volume;
            this.beLoop = beLoop;
        }
        start()
        {

        }
        update(delta: number)
        {

        }
        gameObject: gameObject;
        remove()
        {

        }
        clone()
        {

        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放声音
         * @param x 音源在3D空间中的播放位置
         * @param y 音源在3D空间中的播放位置
         * @param z 音源在3D空间中的播放位置
         */
        play(onended: Function, x?: number, y?: number, z?: number)
        {
            if (this.audioChannel == null)
                return null;
            var c = this.audioChannel;
            c.source.loop = this.beLoop;
            c.source.buffer = this.buffer;
            c.volume = this.volume;
            c.source.start();
            if (x && y && z)
                c.pannerNode.setPosition(x, y, z);
            c.isplay = true;
            if (!this.beLoop)
            {
                c.source.onended = () =>
                {
                    c.isplay = false;
                    c.source = null;
                    if (onended != undefined)
                        onended();
                }
            }
        }
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 停止播放
        * @version egret-gd3d 1.0
        */
        stop()
        {
            if (this.audioChannel != null)
            {
                this.audioChannel.stop();
            }
        }
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取音量大小
        * @version egret-gd3d 1.0
        */
        get volume(): number
        {
            return this.audioChannel == null ? -1 : this.audioChannel.volume;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置音量大小
         * @param value 音量值
         * @version egret-gd3d 1.0
         */
        set volume(val: number)//-1~1
        {
            this.audioChannel == null ? 0 : this.audioChannel.volume = val;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获得当前音频播放器是否在播放
         * @version egret-gd3d 1.0
         */
        isPlaying()
        {
            return this.audioChannel == undefined ? false : this.audioChannel.isplay;
        }
    }

    export class AudioChannel
    {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
        pannerNode: PannerNode;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取音量大小
        * @version egret-gd3d 1.0
        */
        get volume(): number
        {
            return this.gainNode.gain.value;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置音量大小
         * @param value 音量值
         * @version egret-gd3d 1.0
         */
        set volume(val: number)//-1~1
        {
            val = val > 1 ? 1 : val;
            val = val <= -1 ? -0.999 : val;
            this.gainNode.gain.value = val;
        }
        isplay: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止播放声音
         * @version egret-gd3d 1.0
         */
        stop()
        {
            if (this.source != null)
            {
                this.source.stop();
                this.source = null;
            }
            this.isplay = false;
        }
    }
}

