namespace m4m.framework {
    @assetF(AssetTypeEnum.GLB)
    export class AssetFactory_GLB implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, data: ArrayBuffer) {
            //解析GLB 
            const HEADER_MAGIC = "glTF";
            const HEADER_LENGTH = 12;
            const CHUNK_TYPES_BIN = 0x004E4942;
            const CHUNK_TYPES_JSON = 0x4E4F534A;

            const headerView = new DataView(data, 0, HEADER_LENGTH);
            const header = {
                magic: StringUtil.decodeText(new Uint8Array(data.slice(0, 4))),
                version: headerView.getUint32(4, true),
                length: headerView.getUint32(8, true)
            };

            //检查 data 是否是有效的 GLB 格式 ，版本是否支持
            if (header.magic !== HEADER_MAGIC) {
                throw new Error('Unsupported glTF-Binary header. ');
            } else if (header.version < 2.0) {
                throw new Error('Legacy binary file detected.');
            }

            //分解块数据
            const chunkContentsLength = header.length - HEADER_LENGTH;
            const chunkView = new DataView(data, HEADER_LENGTH);
            let chunkIndex = 0;
            let gltfJsonText: string;
            let binData: ArrayBuffer;
            while (chunkIndex < chunkContentsLength) {
                const chunkLength = chunkView.getUint32(chunkIndex, true);
                chunkIndex += 4;
                const chunkType = chunkView.getUint32(chunkIndex, true);
                chunkIndex += 4;

                if (chunkType === CHUNK_TYPES_JSON) {

                    const contentArray = new Uint8Array(data, HEADER_LENGTH + chunkIndex, chunkLength);
                    gltfJsonText = StringUtil.decodeText(contentArray);

                } else if (chunkType === CHUNK_TYPES_BIN) {

                    const byteOffset = HEADER_LENGTH + chunkIndex;
                    binData = data.slice(byteOffset, byteOffset + chunkLength);

                } // Clients must ignore chunks with unknown types.

                chunkIndex += chunkLength;
            }

            //gltf 资源
            let bin = new m4m.framework.bin(`${filename}_bin`, binData);
            let reuslt: m4m.framework.gltf = new m4m.framework.gltf(filename, JSON.parse(gltfJsonText));
            reuslt.buffers = [bin];
            return reuslt;
        }
    }
}