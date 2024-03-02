/**
@license
Copyright (c) 2022 meta4d.me Authors

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
/// <reference path="ParticleModule.ts" />

namespace m4m.framework
{
    /**
     * 粒子系统 颜色随时间变化模块
     * 
     * @author feng3d
     */
    export class ParticleColorOverLifetimeModule extends ParticleModule
    {
        /**
         * The gradient controlling the particle colors.
         * 控制粒子颜色的梯度。
         */

        color = new MinMaxGradient();

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            particle[_ColorOverLifetime_rate] = Math.random();
        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1)
        {
            if (!this.enabled) return;

            var color = this.color.getValue(particle.rateAtLifeTime, particle[_ColorOverLifetime_rate]);
            math.colorMultiply(particle.color, color, particle.color);
        }
    }

    var _ColorOverLifetime_rate = "_ColorOverLifetime_rate";

}