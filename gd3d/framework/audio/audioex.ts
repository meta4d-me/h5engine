namespace gd3d.framework
{
    export class AudioChannel
    {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
        pannerNode: PannerNode;
        get volume(): number
        {
            return this.gainNode.gain.value;
        }
        set volume(val: number)//-1~1
        {
            val = val > 1 ? 1 : val;
            val = val <= -1 ? -0.999 : val;
            this.gainNode.gain.value = val;
        }
        isplay: boolean;
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
                throw new Error("!Your browser does not support AudioContext");
            }
        }
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

        public isAvailable(): boolean
        {
            return this.audioContext ? true : false;
        }

        //加载声音的api
        loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void
        {
            this.audioContext.decodeAudioData(ab, (audiobuffer) =>
            {
                fun(audiobuffer, null);
            });
        }
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

        //播放一次性声音，注意，别把长声音弄进来
        //如果要关闭，记住这个函数的返回值，里面有个stop函数
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
        //播放一个循环声音,并制定一个名字（测试通过）
        playLooped(name: string, buf: AudioBuffer): void
        {
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
        //通过名字停止一个循环声音
        stopLooped(name: string): void
        {
            if (this.channelLoop[name] == undefined || this.channelLoop[name] == null || this.channelLoop[name].source == null) return;
            this.channelLoop[name].source.stop();
            this.channelLoop[name].source = null;
            this.channelLoop[name].isplay = false;
        }

        private _soundVolume = 0;
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