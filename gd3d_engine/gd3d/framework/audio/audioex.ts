﻿namespace gd3d.framework
{
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
        isAvailable(): boolean
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


        public createAudioChannel(): AudioChannel
        {
            var cc = new AudioChannel();
            cc.source = this.audioContext.createBufferSource();
            cc.pannerNode = this.audioContext.createPanner();

            // cc.source.connect(this.audioContext.destination);
            //3d音效
            cc.source.connect(cc.pannerNode);
            cc.pannerNode.connect(this.audioContext.destination);

            //声音调节
            cc.gainNode = this.audioContext.createGain();
            cc.source.connect(cc.gainNode);
            cc.gainNode.connect(this.audioContext.destination);
            cc.gainNode.gain.value = 1;
            return cc;
        }
    }
}