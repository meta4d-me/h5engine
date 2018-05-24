namespace gd3d.threading
{
    @threadHandle()
    export class animiclipHandle implements IHandle
    {
        handle(buf: ArrayBuffer)
        {
            let read: gd3d.io.binReader = new gd3d.io.binReader(buf);
            let result = {
                fps: undefined,
                loop: undefined,
                boneCount: undefined,
                bones: undefined,
                subclipCount: undefined,
                subclips: undefined,

                frameCount: undefined,
                frames: undefined
            };
            //let _name = 
            read.readStringAnsi();//空读字符串

            result.fps = read.readFloat();
            result.loop = read.readBoolean();

            result.boneCount = read.readInt();
            result.bones = [];
            for (let i = 0; i < result.boneCount; ++i)
            {
                result.bones.push(read.readStringAnsi());
            }

            result.subclipCount = read.readInt();
            result.subclips = [];
            for (let i = 0; i < result.subclipCount; ++i)
            {
                let _subClip = { name: undefined, loop: undefined };
                _subClip.name = read.readStringAnsi();
                _subClip.loop = read.readBoolean();
                result.subclips.push(_subClip);
            }

            result.frameCount = read.readInt();
            result.frames = {};
            for (let i = 0; i < result.frameCount; ++i)
            {
                let _fid = read.readInt().toString();
                let _key = read.readBoolean();
                let _frame = Array<number>(result.boneCount * 7 + 1);//new Float32Array(result.boneCount * 7 + 1);
                _frame[0] = _key ? 1 : 0;

                let _boneInfo = { r: undefined, t: undefined }//new PoseBoneMatrix();

                for (let i = 0; i < result.boneCount; i++)
                {
                    // _boneInfo.load(read);
                    {
                        let x = read.readSingle();
                        let y = read.readSingle();
                        let z = read.readSingle();
                        let w = read.readSingle();
                        _boneInfo.r = new math.quaternion(x, y, z, w);
                    }
                    {
                        let x = read.readSingle();
                        let y = read.readSingle();
                        let z = read.readSingle();
                        _boneInfo.t = new math.vector3(x, y, z);
                    }
                    _frame[i * 7 + 1] = _boneInfo.r.x;
                    _frame[i * 7 + 2] = _boneInfo.r.y;
                    _frame[i * 7 + 3] = _boneInfo.r.z;
                    _frame[i * 7 + 4] = _boneInfo.r.w;
                    _frame[i * 7 + 5] = _boneInfo.t.x;
                    _frame[i * 7 + 6] = _boneInfo.t.y;
                    _frame[i * 7 + 7] = _boneInfo.t.z;
                }
                result.frames[_fid] = _frame;
            }

            return result;
        }
    }
}