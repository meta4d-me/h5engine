namespace gd3d.framework
{
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
    export class AudioEx
    {
        private constructor()
        {
            try
            {
                var _AudioContext = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
                this.audioContext = new _AudioContext();
                console.log("audio Context inited");
            }
            catch (e)
            {
                // throw new Error("!Your browser does not support AudioContext");
                console.error("!Your browser does not support AudioContext");
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
         * @version egret-gd3d 1.0
         */
        clickInit()
        {
            if (!this.isAvailable())
                return;
            // create empty buffer
            if (this.audioContext != null)
            {
                var buffer = this.audioContext.createBuffer(1, 1, 22050);
                var source = this.audioContext.createBufferSource();
                source.buffer = buffer;

                // connect to output (your speakers)
                source.connect(this.audioContext.destination);

                // play the file
                source.start();
            }
        }
        private static g_this: AudioEx;
        static instance(): AudioEx
        {
            if (AudioEx.g_this == null)
                AudioEx.g_this = new AudioEx();

            return AudioEx.g_this;
        }

        public audioContext: AudioContext;

        private static loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void
        {
            var req = new XMLHttpRequest();//ness

            req.open("GET", url);
            req.responseType = "arraybuffer";//ie 一定要在open之后修改responseType
            req.onreadystatechange = () =>
            {
                if (req.readyState == 4)
                {
                    if (req.status == 404)
                        fun(null, new Error("onerr 404"));
                    else
                        fun(req.response, null);
                }
            };
            req.onerror = () =>
            {
                fun(null, new Error("onerr in req:"));//ness
            };
            req.send();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
         * @version egret-gd3d 1.0
         */
        public isAvailable(): boolean
        {
            return this.audioContext ? true : false;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 从arraybuffer转成audiobuffer
         * @version egret-gd3d 1.0
         * @param ab  二进制声音数据
         * @param fun 
         */
        loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void
        {
            this.audioContext.decodeAudioData(ab, (audiobuffer) =>
            {
                fun(audiobuffer, null);
            });
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 从本地文件加载音频数据，返回audiobuffer
         * @version egret-gd3d 1.0
         * @param url  文件地址
         * @param fun 
         */
        loadAudioBuffer(url: string, fun: (buf: AudioBuffer, _err: Error) => void): void
        {
            AudioEx.loadArrayBuffer(url, (_ab, __err) =>
            {
                if (__err != null)
                    fun(null, __err);
                else
                {
                    this.audioContext.decodeAudioData(_ab, (audiobuffer) =>
                    {
                        fun(audiobuffer, null);
                    }
                    );
                }
            });
        }

        private getNewChannel(): AudioChannel
        {
            var cc = new AudioChannel();
            cc.source = this.audioContext.createBufferSource();
            cc.pannerNode = this.audioContext.createPanner();
            cc.source.connect(this.audioContext.destination);
            cc.gainNode = AudioEx.instance().audioContext.createGain();
            cc.source.connect(cc.gainNode);
            cc.gainNode.connect(AudioEx.instance().audioContext.destination);
            cc.gainNode.gain.value = 1;
            return cc;
        }

        private getFreeChannelOnce(): AudioChannel
        {
            for (let key in this.channelOnce)
            {
                if (this.channelOnce[key].isplay == false)
                {
                    let cc = this.getNewChannel();
                    this.channelOnce[key] = cc;
                    return this.channelOnce[key];
                }
            }

            let cc = this.getNewChannel();
            return cc;
        }

        private channelOnce: { [id: string]: AudioChannel } = {};

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放一次性声音,两个相同的声音可同时播放，注意，别把长声音弄进来，如果要关闭，记住这个函数的返回值，里面有个stop函数
         * @version egret-gd3d 1.0
         * @param name  声音文件名字
         * @param buf 声音数据
         * @param x 音源在3D空间中的播放位置
         * @param y 音源在3D空间中的播放位置
         * @param z 音源在3D空间中的播放位置
         */
        playOnce(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel
        {
            var c = this.getFreeChannelOnce();
            c.source.loop = false;
            c.source.buffer = buf;
            c.volume = this._soundVolume;
            c.source.start();
            if (x && y && z)
                c.pannerNode.setPosition(x, y, z);
            c.isplay = true;
            c.source.onended = () =>
            {
                c.isplay = false;
                c.source = null;
            }
            this.channelOnce[name] = c;
            return c;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放一次性声音，相同的声音一次只能播放一个，后播放的会把先播放的停掉，然后从头开始播放，注意，别把长声音弄进来，如果要关闭，记住这个函数的返回值，里面有个stop函数
         * @version egret-gd3d 1.0
         * @param name  声音文件名字
         * @param buf 声音数据
         * @param x 音源在3D空间中的播放位置
         * @param y 音源在3D空间中的播放位置
         * @param z 音源在3D空间中的播放位置
         */
        playOnceInterrupt(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel
        {
            for (let key in this.channelOnce)
            {
                if (key == name && this.channelOnce[key].isplay)
                {
                    this.channelOnce[key].stop();
                }
            }

            var cc = this.getFreeChannelOnce();
            cc.source.loop = false;
            cc.source.buffer = buf;
            cc.volume = this._soundVolume;
            if (x && y && z)
                cc.pannerNode.setPosition(x, y, z);
            cc.source.start();
            cc.isplay = true;
            cc.source.onended = () =>
            {
                cc.isplay = false;
                cc.source = null;
            }
            this.channelOnce[name] = cc;
            return cc;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放一次性声音，相同的声音一次只能播放一个，当一个声音开始播放时，如果有个相同的声音已经在播放了，则后播放的会被先播放的阻塞住不会播放。注意，别把长声音弄进来，如果要关闭，记住这个函数的返回值，里面有个stop函数
         * @version egret-gd3d 1.0
         * @param name  声音文件名字
         * @param buf 声音数据
         * @param x 音源在3D空间中的播放位置
         * @param y 音源在3D空间中的播放位置
         * @param z 音源在3D空间中的播放位置
         */
        playOnceBlocking(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel
        {
            for (let key in this.channelOnce)
            {
                if (key == name && this.channelOnce[key].isplay)
                {
                    return;
                }
            }

            var cc = this.getFreeChannelOnce();
            cc.source.loop = false;
            cc.source.buffer = buf;
            cc.volume = this._soundVolume;
            if (x && y && z)
                cc.pannerNode.setPosition(x, y, z);
            cc.source.start();
            cc.isplay = true;
            cc.source.onended = () =>
            {
                cc.isplay = false;
                cc.source = null;
            }
            this.channelOnce[name] = cc;
            return cc;
        }
        
        private channelLoop: { [id: string]: AudioChannel } = {};
         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 循环播放声音
         * @version egret-gd3d 1.0
         * @param name  声音文件名字
         * @param buf 声音数据
         */
        playLooped(name: string, buf: AudioBuffer): void
        {
            if(!(buf instanceof AudioBuffer))
            {
                console.log("error: audioex playloop failed! "+"resources of audio("+name+") is empty!");
                return;
            }
            if (this.channelLoop[name] != undefined)
            {
                if (this.channelLoop[name].isplay)
                {
                    this.channelLoop[name].source.stop();
                    this.channelLoop[name].isplay = false;
                }
            }

            var cc = this.getNewChannel();
            cc.source.loop = true;
            cc.volume = this._musicVolume;

            this.channelLoop[name] = cc;
            this.channelLoop[name].source.buffer = buf;
            this.channelLoop[name].source.start();
            this.channelLoop[name].isplay = true;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 通过名字停止一个循环声音
         * @version egret-gd3d 1.0
         * @param name  声音文件名字
         */
        stopLooped(name: string): void
        {
            if (this.channelLoop[name] == undefined || this.channelLoop[name] == null || this.channelLoop[name].source == null) return;
            this.channelLoop[name].source.stop();
            this.channelLoop[name].source = null;
            this.channelLoop[name].isplay = false;
        }

        private _soundVolume = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置音效大小
         * @version egret-gd3d 1.0
         * @param val  音效大小
         */
        setSoundVolume(val: number)
        {
            this._soundVolume = val;
            for (let key in this.channelOnce)
            {
                if (this.channelOnce[key])
                {
                    this.channelOnce[key].volume = this._soundVolume;
                }
            }
        }

        private _musicVolume = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置背景音乐大小
         * @version egret-gd3d 1.0
         * @param val  音乐声音大小
         */
        setMusicVolume(val: number)
        {
            this._musicVolume = val;
            for (let key in this.channelLoop)
            {
                if (this.channelLoop[key])
                {
                    this.channelLoop[key].volume = this._musicVolume;
                }
            }
        }
    }
}