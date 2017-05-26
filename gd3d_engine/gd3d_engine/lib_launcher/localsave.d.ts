declare namespace localsave {
    function stringToUtf8Array(str: string): number[];
    function file_str2blob(string: string): Blob;
    function file_u8array2blob(array: Uint8Array): Blob;
    function save(path: string, file: Blob | File): number;
    function saveStr(path: string, content: string): number;
    function startDirect(exec: string, path: string, argc: string): any;
    function start(path: string): any;
    function startnowait(path: string, fun?: (_txt: string, _err: Error) => void): any;
    function list(path: string): any;
    function listTree(path: string): any;
    function copy(from: string, to: string): any;
    function remove(path: string): any;
    function load(url: string, fun: (_url: string, _txt: string, _err: Error) => void): void;
}
