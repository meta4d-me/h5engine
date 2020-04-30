namespace gd3d.plugins.remoteDebug
{
    export class WSConnect
    {

        private socket: WebSocket;

        public IsConnect: boolean = false;

        public OnRecv: (msg: string) => void;
        public OnClose: () => void;
        constructor(private host)
        {

        }


        Connect()
        {
            return new Promise<boolean>((resolve) =>
            {
                this.socket = new WebSocket(this.host);

                this.socket.onclose = () =>
                {                    
                    if (!this.IsConnect)
                        resolve(false);
                    this._Close();
                };

                this.socket.onmessage = (e) =>
                {
                    if (this.OnRecv)
                        this.OnRecv(e.data);
                };

                this.socket.onerror = () =>
                {
                    
                    if (!this.IsConnect)
                        resolve(false);
                    this._Close();
                };

                this.socket.onopen = () =>
                {
                    this.IsConnect = true;
                    resolve(true);
                };

            });
        }

        private _Close()
        {
            this.IsConnect = false;
            if (this.OnClose)
                this.OnClose();
        }

        Send(data: any)
        {
            if (this.IsConnect)
            {                
                this.socket.send(JSON.stringify(data));
            }
        }


    }
}