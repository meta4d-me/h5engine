namespace m4m.framework
{
    /**
     * @private
     */
    export class taskstate
    {
        finish: boolean = false;
        error: boolean = false;
        message: string = null;
        cancel: boolean = false;
        /**
         * 执行任务
         */
        taskCall: (taskstate, state: taskstate) => void = null;
        taskInterface: ITask = null;
    }
    /**
     * @private
     */
    export interface ITask
    {
        /**
         * 移动任务
         * @param delta 
         * @param laststate 
         * @param state 
         */
        move(delta: number, laststate: taskstate, state: taskstate);
    }
    /**
     * 任务管理器
     */
    export class taskMgr
    {
        tasks: taskstate[] = [];
        /**
         * 添加任务回调
         * @param task 任务回调函数
         */
        addTaskCall(task: (laststate: taskstate, state: taskstate) => void)
        {
            var st = new taskstate();
            st.taskCall = task;
            this.tasks.push(st);
        }
        /**
         * 添加任务
         * @param task 任务
         */
        addTask(task: ITask)
        {
            var st = new taskstate();
            st.taskInterface = task;
            this.tasks.push(st);
        }
        //lasttask: (laststate: taskstate, state: taskstate) => void;
        laststate: taskstate = null;

        /**
         * 任务移动
         * @param delta 
         */
        move(delta: number)
        {
            if (this.laststate != null && this.laststate.cancel)
            {
                return;
            }
            if (this.laststate != null && this.laststate.finish == false)
            {
                return;
            }
            var task = this.tasks.shift();
            if(task==null)
            {
                return;
            }
            var state = new taskstate();
            var laststate = this.laststate;
            this.laststate = state;
            if (task.taskInterface == null)
            {
                task.taskCall(laststate, state);
            }
            else
            {
                task.taskInterface.move(delta, laststate, state);
            }
        }
        /**
         * 取消
         */
        cancel()
        {
            if (this.laststate != null)
            {
                this.laststate.cancel = true;
            }
        }
    }
}