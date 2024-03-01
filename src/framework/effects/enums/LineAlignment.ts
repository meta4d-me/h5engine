/**
@license
Copyright 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
namespace m4m.framework
{
    /**
     * Control the direction lines face, when using the LineRenderer or TrailRenderer.
     * 
     * 使用LineRenderer或TrailRenderer时，控制方向线的面。
     */
    export enum LineAlignment
    {

        /**
         * Lines face the camera.
         * 
         * 线面向相机。
         */
        View,
        /**
         * Lines face the Z axis of the Transform Component.
         * 
         * 线面向变换组件的Z轴。
         */
        TransformZ,
    }
}