
module egret {

    /**
     * @language en_US
     * The Sound class lets you work with sound in an application.
     * The Sound class lets you create a Sound object, load and play an external audio file into that object.
     * More detailed control of the sound is performed through the SoundChannel
     *
     * @event egret.Event.COMPLETE Dispatch when the audio resource is loaded and ready to play
     * @event egret.IOErrorEvent.IO_ERROR Dispatch when the audio resource is failed to load
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    /**
     * @language zh_CN
     * Sound 允许您在应用程序中使用声音。使用 Sound 类可以创建 Sound 对象、将外部音频文件加载到该对象并播放该文件。
     * 可通过 SoundChannel 对声音执行更精细的控制，如控制音量和监控播放进度。
     * @see http://edn.egret.com/cn/docs/page/156 音频系统
     *
     * @event egret.Event.COMPLETE 音频加载完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 音频加载失败时抛出
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    export interface Sound extends EventDispatcher {

        /**
         * @language en_US
         * Initiates loading of an external audio file from the specified URL.
         * @param url Audio file URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 启动从指定 URL 加载外部音频文件的过程。
         * @param url 需要加载的音频文件URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url:string):void;

        /**
         * @language en_US
         * Generates a new SoundChannel object to play back the sound.
         * @param startTime The initial position in seconds at which playback should start, (default = 0)
         * @param loops Plays, the default value is 0. Greater than 0 to the number of plays, such as 1 to play 1, less than or equal to 0, to loop.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 生成一个新的 SoundChannel 对象来播放该声音。此方法返回 SoundChannel 对象，访问该对象可停止声音调整音量。
         * @param startTime 应开始播放的初始位置（以秒为单位），默认值是 0
         * @param loops 播放次数，默认值是 0，循环播放。 大于 0 为播放次数，如 1 为播放 1 次；小于等于 0，为循环播放。
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(startTime?:number, loops?:number):SoundChannel;

        /**
         * @language en_US
         * Closes the stream, causing any download of data to cease
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭该流，从而停止所有数据的下载。
         * @version Egret 2.4
         * @platform Web,Native
         */
        close():void;

        /**
         * @language en_US
         * Type, default is egret.Sound.EFFECT.
         * In the native and runtime environment, while only play a background music, sound length so as not to be too long.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 类型，默认为 egret.Sound.EFFECT。
         * 在 native 和 runtime 环境下，背景音乐同时只能播放一个，音效长度尽量不要太长。
         * @version Egret 2.4
         * @platform Web,Native
         */
        type:string;

        /**
         * @language en_US
         * Length of the current sound (in seconds).
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 当前声音的长度（以秒为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        length:number;
    }


    /**
     * @copy egret.Sound
     */
    export var Sound:{

        /**
         * @language en_US
         * Create Sound object, load an external audio file and play
         * @param url Audio file URL, Sound will start to load the media if url is not empty
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 Sound 对象、将外部音频文件加载到该对象并播放该文件
         * @param url 需要加载的音频文件URL,如果指定了 url, Sound会立即开始加载指定的媒体文件
         * @version Egret 2.4
         * @platform Web,Native
         */
        new():Sound

        /**
         * @language en_US
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 背景音乐
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         */
         MUSIC:string;

        /**
         * @language en_US
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音效
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         */
         EFFECT:string;
    };
}
