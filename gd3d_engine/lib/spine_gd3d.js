(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.spine_gd3d = {}));
}(this, (function (exports) { 'use strict';

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class IntSet {
        constructor() {
            this.array = new Array();
        }
        add(value) {
            let contains = this.contains(value);
            this.array[value | 0] = value | 0;
            return !contains;
        }
        contains(value) {
            return this.array[value | 0] != undefined;
        }
        remove(value) {
            this.array[value | 0] = undefined;
        }
        clear() {
            this.array.length = 0;
        }
    }
    class StringSet {
        constructor() {
            this.entries = {};
            this.size = 0;
        }
        add(value) {
            let contains = this.entries[value];
            this.entries[value] = true;
            if (!contains) {
                this.size++;
                return true;
            }
            return false;
        }
        addAll(values) {
            let oldSize = this.size;
            for (var i = 0, n = values.length; i < n; i++)
                this.add(values[i]);
            return oldSize != this.size;
        }
        contains(value) {
            return this.entries[value];
        }
        clear() {
            this.entries = {};
            this.size = 0;
        }
    }
    class Color {
        constructor(r = 0, g = 0, b = 0, a = 0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        set(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            return this.clamp();
        }
        setFromColor(c) {
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = c.a;
            return this;
        }
        setFromString(hex) {
            hex = hex.charAt(0) == '#' ? hex.substr(1) : hex;
            this.r = parseInt(hex.substr(0, 2), 16) / 255;
            this.g = parseInt(hex.substr(2, 2), 16) / 255;
            this.b = parseInt(hex.substr(4, 2), 16) / 255;
            this.a = hex.length != 8 ? 1 : parseInt(hex.substr(6, 2), 16) / 255;
            return this;
        }
        add(r, g, b, a) {
            this.r += r;
            this.g += g;
            this.b += b;
            this.a += a;
            return this.clamp();
        }
        clamp() {
            if (this.r < 0)
                this.r = 0;
            else if (this.r > 1)
                this.r = 1;
            if (this.g < 0)
                this.g = 0;
            else if (this.g > 1)
                this.g = 1;
            if (this.b < 0)
                this.b = 0;
            else if (this.b > 1)
                this.b = 1;
            if (this.a < 0)
                this.a = 0;
            else if (this.a > 1)
                this.a = 1;
            return this;
        }
        static rgba8888ToColor(color, value) {
            color.r = ((value & 0xff000000) >>> 24) / 255;
            color.g = ((value & 0x00ff0000) >>> 16) / 255;
            color.b = ((value & 0x0000ff00) >>> 8) / 255;
            color.a = ((value & 0x000000ff)) / 255;
        }
        static rgb888ToColor(color, value) {
            color.r = ((value & 0x00ff0000) >>> 16) / 255;
            color.g = ((value & 0x0000ff00) >>> 8) / 255;
            color.b = ((value & 0x000000ff)) / 255;
        }
        static fromString(hex) {
            return new Color().setFromString(hex);
        }
    }
    Color.WHITE = new Color(1, 1, 1, 1);
    Color.RED = new Color(1, 0, 0, 1);
    Color.GREEN = new Color(0, 1, 0, 1);
    Color.BLUE = new Color(0, 0, 1, 1);
    Color.MAGENTA = new Color(1, 0, 1, 1);
    class MathUtils {
        static clamp(value, min, max) {
            if (value < min)
                return min;
            if (value > max)
                return max;
            return value;
        }
        static cosDeg(degrees) {
            return Math.cos(degrees * MathUtils.degRad);
        }
        static sinDeg(degrees) {
            return Math.sin(degrees * MathUtils.degRad);
        }
        static signum(value) {
            return value > 0 ? 1 : value < 0 ? -1 : 0;
        }
        static toInt(x) {
            return x > 0 ? Math.floor(x) : Math.ceil(x);
        }
        static cbrt(x) {
            let y = Math.pow(Math.abs(x), 1 / 3);
            return x < 0 ? -y : y;
        }
        static randomTriangular(min, max) {
            return MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
        }
        static randomTriangularWith(min, max, mode) {
            let u = Math.random();
            let d = max - min;
            if (u <= (mode - min) / d)
                return min + Math.sqrt(u * d * (mode - min));
            return max - Math.sqrt((1 - u) * d * (max - mode));
        }
        static isPowerOfTwo(value) {
            return value && (value & (value - 1)) === 0;
        }
    }
    MathUtils.PI = 3.1415927;
    MathUtils.PI2 = MathUtils.PI * 2;
    MathUtils.radiansToDegrees = 180 / MathUtils.PI;
    MathUtils.radDeg = MathUtils.radiansToDegrees;
    MathUtils.degreesToRadians = MathUtils.PI / 180;
    MathUtils.degRad = MathUtils.degreesToRadians;
    class Interpolation {
        apply(start, end, a) {
            return start + (end - start) * this.applyInternal(a);
        }
    }
    class Pow extends Interpolation {
        constructor(power) {
            super();
            this.power = 2;
            this.power = power;
        }
        applyInternal(a) {
            if (a <= 0.5)
                return Math.pow(a * 2, this.power) / 2;
            return Math.pow((a - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
        }
    }
    class PowOut extends Pow {
        constructor(power) {
            super(power);
        }
        applyInternal(a) {
            return Math.pow(a - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
        }
    }
    class Utils {
        static arrayCopy(source, sourceStart, dest, destStart, numElements) {
            for (let i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
                dest[j] = source[i];
            }
        }
        static arrayFill(array, fromIndex, toIndex, value) {
            for (let i = fromIndex; i < toIndex; i++)
                array[i] = value;
        }
        static setArraySize(array, size, value = 0) {
            let oldSize = array.length;
            if (oldSize == size)
                return array;
            array.length = size;
            if (oldSize < size) {
                for (let i = oldSize; i < size; i++)
                    array[i] = value;
            }
            return array;
        }
        static ensureArrayCapacity(array, size, value = 0) {
            if (array.length >= size)
                return array;
            return Utils.setArraySize(array, size, value);
        }
        static newArray(size, defaultValue) {
            let array = new Array(size);
            for (let i = 0; i < size; i++)
                array[i] = defaultValue;
            return array;
        }
        static newFloatArray(size) {
            if (Utils.SUPPORTS_TYPED_ARRAYS)
                return new Float32Array(size);
            else {
                let array = new Array(size);
                for (let i = 0; i < array.length; i++)
                    array[i] = 0;
                return array;
            }
        }
        static newShortArray(size) {
            if (Utils.SUPPORTS_TYPED_ARRAYS)
                return new Int16Array(size);
            else {
                let array = new Array(size);
                for (let i = 0; i < array.length; i++)
                    array[i] = 0;
                return array;
            }
        }
        static toFloatArray(array) {
            return Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
        }
        static toSinglePrecision(value) {
            return Utils.SUPPORTS_TYPED_ARRAYS ? Math.fround(value) : value;
        }
        // This function is used to fix WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
        static webkit602BugfixHelper(alpha, blend) {
        }
        static contains(array, element, identity = true) {
            for (var i = 0; i < array.length; i++)
                if (array[i] == element)
                    return true;
            return false;
        }
        static enumValue(type, name) {
            return type[name[0].toUpperCase() + name.slice(1)];
        }
    }
    Utils.SUPPORTS_TYPED_ARRAYS = typeof (Float32Array) !== "undefined";
    class DebugUtils {
        static logBones(skeleton) {
            for (let i = 0; i < skeleton.bones.length; i++) {
                let bone = skeleton.bones[i];
                console.log(bone.data.name + ", " + bone.a + ", " + bone.b + ", " + bone.c + ", " + bone.d + ", " + bone.worldX + ", " + bone.worldY);
            }
        }
    }
    class Pool {
        constructor(instantiator) {
            this.items = new Array();
            this.instantiator = instantiator;
        }
        obtain() {
            return this.items.length > 0 ? this.items.pop() : this.instantiator();
        }
        free(item) {
            if (item.reset)
                item.reset();
            this.items.push(item);
        }
        freeAll(items) {
            for (let i = 0; i < items.length; i++)
                this.free(items[i]);
        }
        clear() {
            this.items.length = 0;
        }
    }
    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        set(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
        length() {
            let x = this.x;
            let y = this.y;
            return Math.sqrt(x * x + y * y);
        }
        normalize() {
            let len = this.length();
            if (len != 0) {
                this.x /= len;
                this.y /= len;
            }
            return this;
        }
    }
    class TimeKeeper {
        constructor() {
            this.maxDelta = 0.064;
            this.framesPerSecond = 0;
            this.delta = 0;
            this.totalTime = 0;
            this.lastTime = Date.now() / 1000;
            this.frameCount = 0;
            this.frameTime = 0;
        }
        update() {
            let now = Date.now() / 1000;
            this.delta = now - this.lastTime;
            this.frameTime += this.delta;
            this.totalTime += this.delta;
            if (this.delta > this.maxDelta)
                this.delta = this.maxDelta;
            this.lastTime = now;
            this.frameCount++;
            if (this.frameTime > 1) {
                this.framesPerSecond = this.frameCount / this.frameTime;
                this.frameTime = 0;
                this.frameCount = 0;
            }
        }
    }
    class WindowedMean {
        constructor(windowSize = 32) {
            this.addedValues = 0;
            this.lastValue = 0;
            this.mean = 0;
            this.dirty = true;
            this.values = new Array(windowSize);
        }
        hasEnoughData() {
            return this.addedValues >= this.values.length;
        }
        addValue(value) {
            if (this.addedValues < this.values.length)
                this.addedValues++;
            this.values[this.lastValue++] = value;
            if (this.lastValue > this.values.length - 1)
                this.lastValue = 0;
            this.dirty = true;
        }
        getMean() {
            if (this.hasEnoughData()) {
                if (this.dirty) {
                    let mean = 0;
                    for (let i = 0; i < this.values.length; i++)
                        mean += this.values[i];
                    this.mean = mean / this.values.length;
                    this.dirty = false;
                }
                return this.mean;
            }
            return 0;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** The base class for all attachments. */
    class Attachment {
        constructor(name) {
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
        }
    }
    /** Base class for an attachment with vertices that are transformed by one or more bones and can be deformed by a slot's
     * {@link Slot#deform}. */
    class VertexAttachment extends Attachment {
        constructor(name) {
            super(name);
            /** The unique ID for this attachment. */
            this.id = VertexAttachment.nextID++;
            /** The bones which affect the {@link #getVertices()}. The array entries are, for each vertex, the number of bones affecting
             * the vertex followed by that many bone indices, which is the index of the bone in {@link Skeleton#bones}. Will be null
             * if this attachment has no weights. */
            this.bones = null;
            /** The vertex positions in the bone's coordinate system. For a non-weighted attachment, the values are `x,y`
             * entries for each vertex. For a weighted attachment, the values are `x,y,weight` entries for each bone affecting
             * each vertex. */
            this.vertices = null;
            /** The maximum number of world vertex values that can be output by
             * {@link #computeWorldVertices()} using the `count` parameter. */
            this.worldVerticesLength = 0;
            /** Deform keys for the deform attachment are also applied to this attachment. May be null if no deform keys should be applied. */
            this.deformAttachment = this;
        }
        /** Transforms the attachment's local {@link #vertices} to world coordinates. If the slot's {@link Slot#deform} is
         * not empty, it is used to deform the vertices.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide.
         * @param start The index of the first {@link #vertices} value to transform. Each vertex has 2 values, x and y.
         * @param count The number of world vertex values to output. Must be <= {@link #worldVerticesLength} - `start`.
         * @param worldVertices The output world vertices. Must have a length >= `offset` + `count` *
         *           `stride` / 2.
         * @param offset The `worldVertices` index to begin writing values.
         * @param stride The number of `worldVertices` entries between the value pairs written. */
        computeWorldVertices(slot, start, count, worldVertices, offset, stride) {
            count = offset + (count >> 1) * stride;
            let skeleton = slot.bone.skeleton;
            let deformArray = slot.deform;
            let vertices = this.vertices;
            let bones = this.bones;
            if (!bones) {
                if (deformArray.length > 0)
                    vertices = deformArray;
                let bone = slot.bone;
                let x = bone.worldX;
                let y = bone.worldY;
                let a = bone.a, b = bone.b, c = bone.c, d = bone.d;
                for (let v = start, w = offset; w < count; v += 2, w += stride) {
                    let vx = vertices[v], vy = vertices[v + 1];
                    worldVertices[w] = vx * a + vy * b + x;
                    worldVertices[w + 1] = vx * c + vy * d + y;
                }
                return;
            }
            let v = 0, skip = 0;
            for (let i = 0; i < start; i += 2) {
                let n = bones[v];
                v += n + 1;
                skip += n;
            }
            let skeletonBones = skeleton.bones;
            if (deformArray.length == 0) {
                for (let w = offset, b = skip * 3; w < count; w += stride) {
                    let wx = 0, wy = 0;
                    let n = bones[v++];
                    n += v;
                    for (; v < n; v++, b += 3) {
                        let bone = skeletonBones[bones[v]];
                        let vx = vertices[b], vy = vertices[b + 1], weight = vertices[b + 2];
                        wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
                        wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
                    }
                    worldVertices[w] = wx;
                    worldVertices[w + 1] = wy;
                }
            }
            else {
                let deform = deformArray;
                for (let w = offset, b = skip * 3, f = skip << 1; w < count; w += stride) {
                    let wx = 0, wy = 0;
                    let n = bones[v++];
                    n += v;
                    for (; v < n; v++, b += 3, f += 2) {
                        let bone = skeletonBones[bones[v]];
                        let vx = vertices[b] + deform[f], vy = vertices[b + 1] + deform[f + 1], weight = vertices[b + 2];
                        wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
                        wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
                    }
                    worldVertices[w] = wx;
                    worldVertices[w + 1] = wy;
                }
            }
        }
        /** Does not copy id (generated) or name (set on construction). **/
        copyTo(attachment) {
            if (this.bones) {
                attachment.bones = new Array(this.bones.length);
                Utils.arrayCopy(this.bones, 0, attachment.bones, 0, this.bones.length);
            }
            else
                attachment.bones = null;
            if (this.vertices) {
                attachment.vertices = Utils.newFloatArray(this.vertices.length);
                Utils.arrayCopy(this.vertices, 0, attachment.vertices, 0, this.vertices.length);
            }
            else
                attachment.vertices = null;
            attachment.worldVerticesLength = this.worldVerticesLength;
            attachment.deformAttachment = this.deformAttachment;
        }
    }
    VertexAttachment.nextID = 0;

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** A simple container for a list of timelines and a name. */
    class Animation {
        constructor(name, timelines, duration) {
            this.timelines = null;
            this.timelineIds = null;
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
            this.setTimelines(timelines);
            this.duration = duration;
        }
        setTimelines(timelines) {
            if (!timelines)
                throw new Error("timelines cannot be null.");
            this.timelines = timelines;
            this.timelineIds = new StringSet();
            for (var i = 0; i < timelines.length; i++)
                this.timelineIds.addAll(timelines[i].getPropertyIds());
        }
        hasTimeline(ids) {
            for (let i = 0; i < ids.length; i++)
                if (this.timelineIds.contains(ids[i]))
                    return true;
            return false;
        }
        /** Applies all the animation's timelines to the specified skeleton.
         *
         * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
         * @param loop If true, the animation repeats after {@link #getDuration()}.
         * @param events May be null to ignore fired events. */
        apply(skeleton, lastTime, time, loop, events, alpha, blend, direction) {
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            if (loop && this.duration != 0) {
                time %= this.duration;
                if (lastTime > 0)
                    lastTime %= this.duration;
            }
            let timelines = this.timelines;
            for (let i = 0, n = timelines.length; i < n; i++)
                timelines[i].apply(skeleton, lastTime, time, events, alpha, blend, direction);
        }
    }
    (function (MixBlend) {
        /** Transitions from the setup value to the timeline value (the current value is not used). Before the first key, the setup
         * value is set. */
        MixBlend[MixBlend["setup"] = 0] = "setup";
        /** Transitions from the current value to the timeline value. Before the first key, transitions from the current value to
         * the setup value. Timelines which perform instant transitions, such as {@link DrawOrderTimeline} or
         * {@link AttachmentTimeline}, use the setup value before the first key.
         *
         * `first` is intended for the first animations applied, not for animations layered on top of those. */
        MixBlend[MixBlend["first"] = 1] = "first";
        /** Transitions from the current value to the timeline value. No change is made before the first key (the current value is
         * kept until the first key).
         *
         * `replace` is intended for animations layered on top of others, not for the first animations applied. */
        MixBlend[MixBlend["replace"] = 2] = "replace";
        /** Transitions from the current value to the current value plus the timeline value. No change is made before the first key
         * (the current value is kept until the first key).
         *
         * `add` is intended for animations layered on top of others, not for the first animations applied. Properties
         * keyed by additive animations must be set manually or by another animation before applying the additive animations, else
         * the property values will increase continually. */
        MixBlend[MixBlend["add"] = 3] = "add";
    })(exports.MixBlend || (exports.MixBlend = {}));
    (function (MixDirection) {
        MixDirection[MixDirection["mixIn"] = 0] = "mixIn";
        MixDirection[MixDirection["mixOut"] = 1] = "mixOut";
    })(exports.MixDirection || (exports.MixDirection = {}));
    const Property = {
        rotate: 0,
        x: 1,
        y: 2,
        scaleX: 3,
        scaleY: 4,
        shearX: 5,
        shearY: 6,
        rgb: 7,
        alpha: 8,
        rgb2: 9,
        attachment: 10,
        deform: 11,
        event: 12,
        drawOrder: 13,
        ikConstraint: 14,
        transformConstraint: 15,
        pathConstraintPosition: 16,
        pathConstraintSpacing: 17,
        pathConstraintMix: 18
    };
    /** The interface for all timelines. */
    class Timeline {
        constructor(frameCount, propertyIds) {
            this.propertyIds = null;
            this.frames = null;
            this.propertyIds = propertyIds;
            this.frames = Utils.newFloatArray(frameCount * this.getFrameEntries());
        }
        getPropertyIds() {
            return this.propertyIds;
        }
        getFrameEntries() {
            return 1;
        }
        getFrameCount() {
            return this.frames.length / this.getFrameEntries();
        }
        getDuration() {
            return this.frames[this.frames.length - this.getFrameEntries()];
        }
        static search1(frames, time) {
            let n = frames.length;
            for (let i = 1; i < n; i++)
                if (frames[i] > time)
                    return i - 1;
            return n - 1;
        }
        static search(frames, time, step) {
            let n = frames.length;
            for (let i = step; i < n; i += step)
                if (frames[i] > time)
                    return i - step;
            return n - step;
        }
    }
    /** The base class for timelines that use interpolation between key frame values. */
    class CurveTimeline extends Timeline {
        constructor(frameCount, bezierCount, propertyIds) {
            super(frameCount, propertyIds);
            this.curves = null; // type, x, y, ...
            this.curves = Utils.newFloatArray(frameCount + bezierCount * 18 /*BEZIER_SIZE*/);
            this.curves[frameCount - 1] = 1 /*STEPPED*/;
        }
        /** Sets the specified key frame to linear interpolation. */
        setLinear(frame) {
            this.curves[frame] = 0 /*LINEAR*/;
        }
        /** Sets the specified key frame to stepped interpolation. */
        setStepped(frame) {
            this.curves[frame] = 1 /*STEPPED*/;
        }
        /** Shrinks the storage for Bezier curves, for use when <code>bezierCount</code> (specified in the constructor) was larger
         * than the actual number of Bezier curves. */
        shrink(bezierCount) {
            let size = this.getFrameCount() + bezierCount * 18 /*BEZIER_SIZE*/;
            if (this.curves.length > size) {
                let newCurves = Utils.newFloatArray(size);
                Utils.arrayCopy(this.curves, 0, newCurves, 0, size);
                this.curves = newCurves;
            }
        }
        /** Stores the segments for the specified Bezier curve. For timelines that modify multiple values, there may be more than
         * one curve per frame.
         * @param bezier The ordinal of this Bezier curve for this timeline, between 0 and <code>bezierCount - 1</code> (specified
         *           in the constructor), inclusive.
         * @param frame Between 0 and <code>frameCount - 1</code>, inclusive.
         * @param value The index of the value for this frame that this curve is used for.
         * @param time1 The time for the first key.
         * @param value1 The value for the first key.
         * @param cx1 The time for the first Bezier handle.
         * @param cy1 The value for the first Bezier handle.
         * @param cx2 The time of the second Bezier handle.
         * @param cy2 The value for the second Bezier handle.
         * @param time2 The time for the second key.
         * @param value2 The value for the second key. */
        setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
            let curves = this.curves;
            let i = this.getFrameCount() + bezier * 18 /*BEZIER_SIZE*/;
            if (value == 0)
                curves[frame] = 2 /*BEZIER*/ + i;
            let tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = (value1 - cy1 * 2 + cy2) * 0.03;
            let dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = ((cy1 - cy2) * 3 - value1 + value2) * 0.006;
            let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
            let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = (cy1 - value1) * 0.3 + tmpy + dddy * 0.16666667;
            let x = time1 + dx, y = value1 + dy;
            for (let n = i + 18 /*BEZIER_SIZE*/; i < n; i += 2) {
                curves[i] = x;
                curves[i + 1] = y;
                dx += ddx;
                dy += ddy;
                ddx += dddx;
                ddy += dddy;
                x += dx;
                y += dy;
            }
        }
        /** Returns the Bezier interpolated value for the specified time.
         * @param frameIndex The index into {@link #getFrames()} for the values of the frame before <code>time</code>.
         * @param valueOffset The offset from <code>frameIndex</code> to the value this curve is used for.
         * @param i The index of the Bezier segments. See {@link #getCurveType(int)}. */
        getBezierValue(time, frameIndex, valueOffset, i) {
            let curves = this.curves;
            if (curves[i] > time) {
                let x = this.frames[frameIndex], y = this.frames[frameIndex + valueOffset];
                return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
            }
            let n = i + 18 /*BEZIER_SIZE*/;
            for (i += 2; i < n; i += 2) {
                if (curves[i] >= time) {
                    let x = curves[i - 2], y = curves[i - 1];
                    return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
                }
            }
            frameIndex += this.getFrameEntries();
            let x = curves[n - 2], y = curves[n - 1];
            return y + (time - x) / (this.frames[frameIndex] - x) * (this.frames[frameIndex + valueOffset] - y);
        }
    }
    class CurveTimeline1 extends CurveTimeline {
        constructor(frameCount, bezierCount, propertyId) {
            super(frameCount, bezierCount, [propertyId]);
        }
        getFrameEntries() {
            return 2 /*ENTRIES*/;
        }
        /** Sets the time and value for the specified frame.
         * @param frame Between 0 and <code>frameCount</code>, inclusive.
         * @param time The frame time in seconds. */
        setFrame(frame, time, value) {
            frame <<= 1;
            this.frames[frame] = time;
            this.frames[frame + 1 /*VALUE*/] = value;
        }
        /** Returns the interpolated value for the specified time. */
        getCurveValue(time) {
            let frames = this.frames;
            let i = frames.length - 2;
            for (let ii = 2; ii <= i; ii += 2) {
                if (frames[ii] > time) {
                    i = ii - 2;
                    break;
                }
            }
            let curveType = this.curves[i >> 1];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i], value = frames[i + 1 /*VALUE*/];
                    return value + (time - before) / (frames[i + 2 /*ENTRIES*/] - before) * (frames[i + 2 /*ENTRIES*/ + 1 /*VALUE*/] - value);
                case 1 /*STEPPED*/:
                    return frames[i + 1 /*VALUE*/];
            }
            return this.getBezierValue(time, i, 1 /*VALUE*/, curveType - 2 /*BEZIER*/);
        }
    }
    /** The base class for a {@link CurveTimeline} which sets two properties. */
    class CurveTimeline2 extends CurveTimeline {
        /** @param bezierCount The maximum number of Bezier curves. See {@link #shrink(int)}.
         * @param propertyIds Unique identifiers for the properties the timeline modifies. */
        constructor(frameCount, bezierCount, propertyId1, propertyId2) {
            super(frameCount, bezierCount, [propertyId1, propertyId2]);
        }
        getFrameEntries() {
            return 3 /*ENTRIES*/;
        }
        /** Sets the time and values for the specified frame.
         * @param frame Between 0 and <code>frameCount</code>, inclusive.
         * @param time The frame time in seconds. */
        setFrame(frame, time, value1, value2) {
            frame *= 3 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*VALUE1*/] = value1;
            this.frames[frame + 2 /*VALUE2*/] = value2;
        }
    }
    /** Changes a bone's local {@link Bone#rotation}. */
    class RotateTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.rotate + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.rotation = bone.data.rotation;
                        return;
                    case exports.MixBlend.first:
                        bone.rotation += (bone.data.rotation - bone.rotation) * alpha;
                }
                return;
            }
            let r = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.rotation = bone.data.rotation + r * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    r += bone.data.rotation - bone.rotation;
                case exports.MixBlend.add:
                    bone.rotation += r * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#x} and {@link Bone#y}. */
    class TranslateTimeline extends CurveTimeline2 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.x + "|" + boneIndex, Property.y + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.x = bone.data.x;
                        bone.y = bone.data.y;
                        return;
                    case exports.MixBlend.first:
                        bone.x += (bone.data.x - bone.x) * alpha;
                        bone.y += (bone.data.y - bone.y) * alpha;
                }
                return;
            }
            let x = 0, y = 0;
            let i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            let curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    let t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.x = bone.data.x + x * alpha;
                    bone.y = bone.data.y + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.x += (bone.data.x + x - bone.x) * alpha;
                    bone.y += (bone.data.y + y - bone.y) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.x += x * alpha;
                    bone.y += y * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#x}. */
    class TranslateXTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.x + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.x = bone.data.x;
                        return;
                    case exports.MixBlend.first:
                        bone.x += (bone.data.x - bone.x) * alpha;
                }
                return;
            }
            let x = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.x = bone.data.x + x * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.x += (bone.data.x + x - bone.x) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.x += x * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#x}. */
    class TranslateYTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.y + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.y = bone.data.y;
                        return;
                    case exports.MixBlend.first:
                        bone.y += (bone.data.y - bone.y) * alpha;
                }
                return;
            }
            let y = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.y = bone.data.y + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.y += (bone.data.y + y - bone.y) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.y += y * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}. */
    class ScaleTimeline extends CurveTimeline2 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.scaleX + "|" + boneIndex, Property.scaleY + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleX = bone.data.scaleX;
                        bone.scaleY = bone.data.scaleY;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
                        bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
                }
                return;
            }
            let x, y;
            let i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            let curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    let t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            x *= bone.data.scaleX;
            y *= bone.data.scaleY;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add) {
                    bone.scaleX += x - bone.data.scaleX;
                    bone.scaleY += y - bone.data.scaleY;
                }
                else {
                    bone.scaleX = x;
                    bone.scaleY = y;
                }
            }
            else {
                let bx = 0, by = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = bone.data.scaleX;
                            by = bone.data.scaleY;
                            bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                            bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = bone.scaleX;
                            by = bone.scaleY;
                            bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                            bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleX += (x - bone.data.scaleX) * alpha;
                            bone.scaleY += (y - bone.data.scaleY) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = Math.abs(bone.data.scaleX) * MathUtils.signum(x);
                            by = Math.abs(bone.data.scaleY) * MathUtils.signum(y);
                            bone.scaleX = bx + (x - bx) * alpha;
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = Math.abs(bone.scaleX) * MathUtils.signum(x);
                            by = Math.abs(bone.scaleY) * MathUtils.signum(y);
                            bone.scaleX = bx + (x - bx) * alpha;
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleX += (x - bone.data.scaleX) * alpha;
                            bone.scaleY += (y - bone.data.scaleY) * alpha;
                    }
                }
            }
        }
    }
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}. */
    class ScaleXTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.scaleX + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleX = bone.data.scaleX;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
                }
                return;
            }
            let x = this.getCurveValue(time) * bone.data.scaleX;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add)
                    bone.scaleX += x - bone.data.scaleX;
                else
                    bone.scaleX = x;
            }
            else {
                // Mixing out uses sign of setup or current pose, else use sign of key.
                let bx = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = bone.data.scaleX;
                            bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = bone.scaleX;
                            bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleX += (x - bone.data.scaleX) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = Math.abs(bone.data.scaleX) * MathUtils.signum(x);
                            bone.scaleX = bx + (x - bx) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = Math.abs(bone.scaleX) * MathUtils.signum(x);
                            bone.scaleX = bx + (x - bx) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleX += (x - bone.data.scaleX) * alpha;
                    }
                }
            }
        }
    }
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}. */
    class ScaleYTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.scaleY + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleY = bone.data.scaleY;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
                }
                return;
            }
            let y = this.getCurveValue(time) * bone.data.scaleY;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add)
                    bone.scaleY += y - bone.data.scaleY;
                else
                    bone.scaleY = y;
            }
            else {
                // Mixing out uses sign of setup or current pose, else use sign of key.
                let by = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            by = bone.data.scaleY;
                            bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            by = bone.scaleY;
                            bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleY += (y - bone.data.scaleY) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            by = Math.abs(bone.data.scaleY) * MathUtils.signum(y);
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            by = Math.abs(bone.scaleY) * MathUtils.signum(y);
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bone.scaleY += (y - bone.data.scaleY) * alpha;
                    }
                }
            }
        }
    }
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
    class ShearTimeline extends CurveTimeline2 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.shearX + "|" + boneIndex, Property.shearY + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearX = bone.data.shearX;
                        bone.shearY = bone.data.shearY;
                        return;
                    case exports.MixBlend.first:
                        bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
                        bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
                }
                return;
            }
            let x = 0, y = 0;
            let i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            let curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    let t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearX = bone.data.shearX + x * alpha;
                    bone.shearY = bone.data.shearY + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                    bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearX += x * alpha;
                    bone.shearY += y * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
    class ShearXTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.shearX + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearX = bone.data.shearX;
                        return;
                    case exports.MixBlend.first:
                        bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
                }
                return;
            }
            let x = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearX = bone.data.shearX + x * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearX += x * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
    class ShearYTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, boneIndex) {
            super(frameCount, bezierCount, Property.shearY + "|" + boneIndex);
            this.boneIndex = 0;
            this.boneIndex = boneIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearY = bone.data.shearY;
                        return;
                    case exports.MixBlend.first:
                        bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
                }
                return;
            }
            let y = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearY = bone.data.shearY + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearY += y * alpha;
            }
        }
    }
    /** Changes a slot's {@link Slot#color}. */
    class RGBATimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, slotIndex) {
            super(frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.alpha + "|" + slotIndex
            ]);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
        }
        getFrameEntries() {
            return 5 /*ENTRIES*/;
        }
        /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
        setFrame(frame, time, r, g, b, a) {
            frame *= 5 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*A*/] = a;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let frames = this.frames;
            let color = slot.color;
            if (time < frames[0]) {
                let setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.setFromColor(setup);
                        return;
                    case exports.MixBlend.first:
                        color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha, (setup.a - color.a) * alpha);
                }
                return;
            }
            let r = 0, g = 0, b = 0, a = 0;
            let i = Timeline.search(frames, time, 5 /*ENTRIES*/);
            let curveType = this.curves[i / 5 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    let t = (time - before) / (frames[i + 5 /*ENTRIES*/] - before);
                    r += (frames[i + 5 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 5 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 5 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    a += (frames[i + 5 /*ENTRIES*/ + 4 /*A*/] - a) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    a = this.getBezierValue(time, i, 4 /*A*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
            }
            if (alpha == 1)
                color.set(r, g, b, a);
            else {
                if (blend == exports.MixBlend.setup)
                    color.setFromColor(slot.data.color);
                color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
            }
        }
    }
    /** Changes a slot's {@link Slot#color}. */
    class RGBTimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, slotIndex) {
            super(frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex
            ]);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
        }
        getFrameEntries() {
            return 4 /*ENTRIES*/;
        }
        /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
        setFrame(frame, time, r, g, b) {
            frame <<= 2;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let frames = this.frames;
            let color = slot.color;
            if (time < frames[0]) {
                let setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.r = setup.r;
                        color.g = setup.g;
                        color.b = setup.b;
                        return;
                    case exports.MixBlend.first:
                        color.r += (setup.r - color.r) * alpha;
                        color.g += (setup.g - color.g) * alpha;
                        color.b += (setup.b - color.b) * alpha;
                }
                return;
            }
            let r = 0, g = 0, b = 0;
            let i = Timeline.search(frames, time, 4 /*ENTRIES*/);
            let curveType = this.curves[i >> 2];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    let t = (time - before) / (frames[i + 4 /*ENTRIES*/] - before);
                    r += (frames[i + 4 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 4 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 4 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                color.r = r;
                color.g = g;
                color.b = b;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    let setup = slot.data.color;
                    color.r = setup.r;
                    color.g = setup.g;
                    color.b = setup.b;
                }
                color.r += (r - color.r) * alpha;
                color.g += (g - color.g) * alpha;
                color.b += (b - color.b) * alpha;
            }
        }
    }
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
    class AlphaTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, slotIndex) {
            super(frameCount, bezierCount, Property.alpha + "|" + slotIndex);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let color = slot.color;
            if (time < this.frames[0]) { // Time is before first frame.
                let setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.a = setup.a;
                        return;
                    case exports.MixBlend.first:
                        color.a += (setup.a - color.a) * alpha;
                }
                return;
            }
            let a = this.getCurveValue(time);
            if (alpha == 1)
                color.a = a;
            else {
                if (blend == exports.MixBlend.setup)
                    color.a = slot.data.color.a;
                color.a += (a - color.a) * alpha;
            }
        }
    }
    /** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting. */
    class RGBA2Timeline extends CurveTimeline {
        constructor(frameCount, bezierCount, slotIndex) {
            super(frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.alpha + "|" + slotIndex,
                Property.rgb2 + "|" + slotIndex
            ]);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
        }
        getFrameEntries() {
            return 8 /*ENTRIES*/;
        }
        /** Sets the time in seconds, light, and dark colors for the specified key frame. */
        setFrame(frame, time, r, g, b, a, r2, g2, b2) {
            frame <<= 3;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*A*/] = a;
            this.frames[frame + 5 /*R2*/] = r2;
            this.frames[frame + 6 /*G2*/] = g2;
            this.frames[frame + 7 /*B2*/] = b2;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let frames = this.frames;
            let light = slot.color, dark = slot.darkColor;
            if (time < frames[0]) {
                let setupLight = slot.data.color, setupDark = slot.data.darkColor;
                switch (blend) {
                    case exports.MixBlend.setup:
                        light.setFromColor(setupLight);
                        dark.r = setupDark.r;
                        dark.g = setupDark.g;
                        dark.b = setupDark.b;
                        return;
                    case exports.MixBlend.first:
                        light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha, (setupLight.b - light.b) * alpha, (setupLight.a - light.a) * alpha);
                        dark.r += (setupDark.r - dark.r) * alpha;
                        dark.g += (setupDark.g - dark.g) * alpha;
                        dark.b += (setupDark.b - dark.b) * alpha;
                }
                return;
            }
            let r = 0, g = 0, b = 0, a = 0, r2 = 0, g2 = 0, b2 = 0;
            let i = Timeline.search(frames, time, 8 /*ENTRIES*/);
            let curveType = this.curves[i >> 3];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    r2 = frames[i + 5 /*R2*/];
                    g2 = frames[i + 6 /*G2*/];
                    b2 = frames[i + 7 /*B2*/];
                    let t = (time - before) / (frames[i + 8 /*ENTRIES*/] - before);
                    r += (frames[i + 8 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 8 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 8 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    a += (frames[i + 8 /*ENTRIES*/ + 4 /*A*/] - a) * t;
                    r2 += (frames[i + 8 /*ENTRIES*/ + 5 /*R2*/] - r2) * t;
                    g2 += (frames[i + 8 /*ENTRIES*/ + 6 /*G2*/] - g2) * t;
                    b2 += (frames[i + 8 /*ENTRIES*/ + 7 /*B2*/] - b2) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    r2 = frames[i + 5 /*R2*/];
                    g2 = frames[i + 6 /*G2*/];
                    b2 = frames[i + 7 /*B2*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    a = this.getBezierValue(time, i, 4 /*A*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    r2 = this.getBezierValue(time, i, 5 /*R2*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    g2 = this.getBezierValue(time, i, 6 /*G2*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
                    b2 = this.getBezierValue(time, i, 7 /*B2*/, curveType + 18 /*BEZIER_SIZE*/ * 6 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                light.set(r, g, b, a);
                dark.r = r2;
                dark.g = g2;
                dark.b = b2;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    light.setFromColor(slot.data.color);
                    let setupDark = slot.data.darkColor;
                    dark.r = setupDark.r;
                    dark.g = setupDark.g;
                    dark.b = setupDark.b;
                }
                light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
                dark.r += (r2 - dark.r) * alpha;
                dark.g += (g2 - dark.g) * alpha;
                dark.b += (b2 - dark.b) * alpha;
            }
        }
    }
    /** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting. */
    class RGB2Timeline extends CurveTimeline {
        constructor(frameCount, bezierCount, slotIndex) {
            super(frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.rgb2 + "|" + slotIndex
            ]);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
        }
        getFrameEntries() {
            return 7 /*ENTRIES*/;
        }
        /** Sets the time in seconds, light, and dark colors for the specified key frame. */
        setFrame(frame, time, r, g, b, r2, g2, b2) {
            frame *= 7 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*R2*/] = r2;
            this.frames[frame + 5 /*G2*/] = g2;
            this.frames[frame + 6 /*B2*/] = b2;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let frames = this.frames;
            let light = slot.color, dark = slot.darkColor;
            if (time < frames[0]) {
                let setupLight = slot.data.color, setupDark = slot.data.darkColor;
                switch (blend) {
                    case exports.MixBlend.setup:
                        light.r = setupLight.r;
                        light.g = setupLight.g;
                        light.b = setupLight.b;
                        dark.r = setupDark.r;
                        dark.g = setupDark.g;
                        dark.b = setupDark.b;
                        return;
                    case exports.MixBlend.first:
                        light.r += (setupLight.r - light.r) * alpha;
                        light.g += (setupLight.g - light.g) * alpha;
                        light.b += (setupLight.b - light.b) * alpha;
                        dark.r += (setupDark.r - dark.r) * alpha;
                        dark.g += (setupDark.g - dark.g) * alpha;
                        dark.b += (setupDark.b - dark.b) * alpha;
                }
                return;
            }
            let r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0;
            let i = Timeline.search(frames, time, 7 /*ENTRIES*/);
            let curveType = this.curves[i / 7 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    r2 = frames[i + 4 /*R2*/];
                    g2 = frames[i + 5 /*G2*/];
                    b2 = frames[i + 6 /*B2*/];
                    let t = (time - before) / (frames[i + 7 /*ENTRIES*/] - before);
                    r += (frames[i + 7 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 7 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 7 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    r2 += (frames[i + 7 /*ENTRIES*/ + 4 /*R2*/] - r2) * t;
                    g2 += (frames[i + 7 /*ENTRIES*/ + 5 /*G2*/] - g2) * t;
                    b2 += (frames[i + 7 /*ENTRIES*/ + 6 /*B2*/] - b2) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    r2 = frames[i + 4 /*R2*/];
                    g2 = frames[i + 5 /*G2*/];
                    b2 = frames[i + 6 /*B2*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    r2 = this.getBezierValue(time, i, 4 /*R2*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    g2 = this.getBezierValue(time, i, 5 /*G2*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    b2 = this.getBezierValue(time, i, 6 /*B2*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                light.r = r;
                light.g = g;
                light.b = b;
                dark.r = r2;
                dark.g = g2;
                dark.b = b2;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    let setupLight = slot.data.color, setupDark = slot.data.darkColor;
                    light.r = setupLight.r;
                    light.g = setupLight.g;
                    light.b = setupLight.b;
                    dark.r = setupDark.r;
                    dark.g = setupDark.g;
                    dark.b = setupDark.b;
                }
                light.r += (r - light.r) * alpha;
                light.g += (g - light.g) * alpha;
                light.b += (b - light.b) * alpha;
                dark.r += (r2 - dark.r) * alpha;
                dark.g += (g2 - dark.g) * alpha;
                dark.b += (b2 - dark.b) * alpha;
            }
        }
    }
    /** Changes a slot's {@link Slot#attachment}. */
    class AttachmentTimeline extends Timeline {
        constructor(frameCount, slotIndex) {
            super(frameCount, [
                Property.attachment + "|" + slotIndex
            ]);
            this.slotIndex = 0;
            this.slotIndex = slotIndex;
            this.attachmentNames = new Array(frameCount);
        }
        getFrameCount() {
            return this.frames.length;
        }
        /** Sets the time in seconds and the attachment name for the specified key frame. */
        setFrame(frame, time, attachmentName) {
            this.frames[frame] = time;
            this.attachmentNames[frame] = attachmentName;
        }
        apply(skeleton, lastTime, time, events, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            if (direction == exports.MixDirection.mixOut) {
                if (blend == exports.MixBlend.setup)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName);
                return;
            }
            if (time < this.frames[0]) {
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName);
                return;
            }
            this.setAttachment(skeleton, slot, this.attachmentNames[Timeline.search1(this.frames, time)]);
        }
        setAttachment(skeleton, slot, attachmentName) {
            slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
        }
    }
    /** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}. */
    class DeformTimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, slotIndex, attachment) {
            super(frameCount, bezierCount, [
                Property.deform + "|" + slotIndex + "|" + attachment.id
            ]);
            this.slotIndex = 0;
            /** The attachment that will be deformed. */
            this.attachment = null;
            /** The vertices for each key frame. */
            this.vertices = null;
            this.slotIndex = slotIndex;
            this.attachment = attachment;
            this.vertices = new Array(frameCount);
        }
        getFrameCount() {
            return this.frames.length;
        }
        /** Sets the time in seconds and the vertices for the specified key frame.
         * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
        setFrame(frame, time, vertices) {
            this.frames[frame] = time;
            this.vertices[frame] = vertices;
        }
        /** @param value1 Ignored (0 is used for a deform timeline).
         * @param value2 Ignored (1 is used for a deform timeline). */
        setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
            let curves = this.curves;
            let i = this.getFrameCount() + bezier * 18 /*BEZIER_SIZE*/;
            if (value == 0)
                curves[frame] = 2 /*BEZIER*/ + i;
            let tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = cy2 * 0.03 - cy1 * 0.06;
            let dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = (cy1 - cy2 + 0.33333333) * 0.018;
            let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
            let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = cy1 * 0.3 + tmpy + dddy * 0.16666667;
            let x = time1 + dx, y = dy;
            for (let n = i + 18 /*BEZIER_SIZE*/; i < n; i += 2) {
                curves[i] = x;
                curves[i + 1] = y;
                dx += ddx;
                dy += ddy;
                ddx += dddx;
                ddy += dddy;
                x += dx;
                y += dy;
            }
        }
        getCurvePercent(time, frame) {
            let curves = this.curves;
            let i = curves[frame];
            switch (i) {
                case 0 /*LINEAR*/:
                    let x = this.frames[frame];
                    return (time - x) / (this.frames[frame + this.getFrameEntries()] - x);
                case 1 /*STEPPED*/:
                    return 0;
            }
            i -= 2 /*BEZIER*/;
            if (curves[i] > time) {
                let x = this.frames[frame];
                return curves[i + 1] * (time - x) / (curves[i] - x);
            }
            let n = i + 18 /*BEZIER_SIZE*/;
            for (i += 2; i < n; i += 2) {
                if (curves[i] >= time) {
                    let x = curves[i - 2], y = curves[i - 1];
                    return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
                }
            }
            let x = curves[n - 2], y = curves[n - 1];
            return y + (1 - y) * (time - x) / (this.frames[frame + this.getFrameEntries()] - x);
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            let slotAttachment = slot.getAttachment();
            if (!(slotAttachment instanceof VertexAttachment) || slotAttachment.deformAttachment != this.attachment)
                return;
            let deform = slot.deform;
            if (deform.length == 0)
                blend = exports.MixBlend.setup;
            let vertices = this.vertices;
            let vertexCount = vertices[0].length;
            let frames = this.frames;
            if (time < frames[0]) {
                let vertexAttachment = slotAttachment;
                switch (blend) {
                    case exports.MixBlend.setup:
                        deform.length = 0;
                        return;
                    case exports.MixBlend.first:
                        if (alpha == 1) {
                            deform.length = 0;
                            return;
                        }
                        deform.length = vertexCount;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions.
                            let setupVertices = vertexAttachment.vertices;
                            for (var i = 0; i < vertexCount; i++)
                                deform[i] += (setupVertices[i] - deform[i]) * alpha;
                        }
                        else {
                            // Weighted deform offsets.
                            alpha = 1 - alpha;
                            for (var i = 0; i < vertexCount; i++)
                                deform[i] *= alpha;
                        }
                }
                return;
            }
            deform.length = vertexCount;
            if (time >= frames[frames.length - 1]) { // Time is after last frame.
                let lastVertices = vertices[frames.length - 1];
                if (alpha == 1) {
                    if (blend == exports.MixBlend.add) {
                        let vertexAttachment = slotAttachment;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions, with alpha.
                            let setupVertices = vertexAttachment.vertices;
                            for (let i = 0; i < vertexCount; i++)
                                deform[i] += lastVertices[i] - setupVertices[i];
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (let i = 0; i < vertexCount; i++)
                                deform[i] += lastVertices[i];
                        }
                    }
                    else
                        Utils.arrayCopy(lastVertices, 0, deform, 0, vertexCount);
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup: {
                            let vertexAttachment = slotAttachment;
                            if (!vertexAttachment.bones) {
                                // Unweighted vertex positions, with alpha.
                                let setupVertices = vertexAttachment.vertices;
                                for (let i = 0; i < vertexCount; i++) {
                                    let setup = setupVertices[i];
                                    deform[i] = setup + (lastVertices[i] - setup) * alpha;
                                }
                            }
                            else {
                                // Weighted deform offsets, with alpha.
                                for (let i = 0; i < vertexCount; i++)
                                    deform[i] = lastVertices[i] * alpha;
                            }
                            break;
                        }
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            for (let i = 0; i < vertexCount; i++)
                                deform[i] += (lastVertices[i] - deform[i]) * alpha;
                            break;
                        case exports.MixBlend.add:
                            let vertexAttachment = slotAttachment;
                            if (!vertexAttachment.bones) {
                                // Unweighted vertex positions, with alpha.
                                let setupVertices = vertexAttachment.vertices;
                                for (let i = 0; i < vertexCount; i++)
                                    deform[i] += (lastVertices[i] - setupVertices[i]) * alpha;
                            }
                            else {
                                // Weighted deform offsets, with alpha.
                                for (let i = 0; i < vertexCount; i++)
                                    deform[i] += lastVertices[i] * alpha;
                            }
                    }
                }
                return;
            }
            // Interpolate between the previous frame and the current frame.
            let frame = Timeline.search1(frames, time);
            let percent = this.getCurvePercent(time, frame);
            let prevVertices = vertices[frame];
            let nextVertices = vertices[frame + 1];
            if (alpha == 1) {
                if (blend == exports.MixBlend.add) {
                    let vertexAttachment = slotAttachment;
                    if (!vertexAttachment.bones) {
                        // Unweighted vertex positions, with alpha.
                        let setupVertices = vertexAttachment.vertices;
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] += prev + (nextVertices[i] - prev) * percent - setupVertices[i];
                        }
                    }
                    else {
                        // Weighted deform offsets, with alpha.
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] += prev + (nextVertices[i] - prev) * percent;
                        }
                    }
                }
                else {
                    for (let i = 0; i < vertexCount; i++) {
                        let prev = prevVertices[i];
                        deform[i] = prev + (nextVertices[i] - prev) * percent;
                    }
                }
            }
            else {
                switch (blend) {
                    case exports.MixBlend.setup: {
                        let vertexAttachment = slotAttachment;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions, with alpha.
                            let setupVertices = vertexAttachment.vertices;
                            for (let i = 0; i < vertexCount; i++) {
                                let prev = prevVertices[i], setup = setupVertices[i];
                                deform[i] = setup + (prev + (nextVertices[i] - prev) * percent - setup) * alpha;
                            }
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (let i = 0; i < vertexCount; i++) {
                                let prev = prevVertices[i];
                                deform[i] = (prev + (nextVertices[i] - prev) * percent) * alpha;
                            }
                        }
                        break;
                    }
                    case exports.MixBlend.first:
                    case exports.MixBlend.replace:
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] += (prev + (nextVertices[i] - prev) * percent - deform[i]) * alpha;
                        }
                        break;
                    case exports.MixBlend.add:
                        let vertexAttachment = slotAttachment;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions, with alpha.
                            let setupVertices = vertexAttachment.vertices;
                            for (let i = 0; i < vertexCount; i++) {
                                let prev = prevVertices[i];
                                deform[i] += (prev + (nextVertices[i] - prev) * percent - setupVertices[i]) * alpha;
                            }
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (let i = 0; i < vertexCount; i++) {
                                let prev = prevVertices[i];
                                deform[i] += (prev + (nextVertices[i] - prev) * percent) * alpha;
                            }
                        }
                }
            }
        }
    }
    /** Fires an {@link Event} when specific animation times are reached. */
    class EventTimeline extends Timeline {
        constructor(frameCount) {
            super(frameCount, EventTimeline.propertyIds);
            /** The event for each key frame. */
            this.events = null;
            this.events = new Array(frameCount);
        }
        getFrameCount() {
            return this.frames.length;
        }
        /** Sets the time in seconds and the event for the specified key frame. */
        setFrame(frame, event) {
            this.frames[frame] = event.time;
            this.events[frame] = event;
        }
        /** Fires events for frames > `lastTime` and <= `time`. */
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            if (!firedEvents)
                return;
            let frames = this.frames;
            let frameCount = this.frames.length;
            if (lastTime > time) { // Fire events after last time for looped animations.
                this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha, blend, direction);
                lastTime = -1;
            }
            else if (lastTime >= frames[frameCount - 1]) // Last time is after last frame.
                return;
            if (time < frames[0])
                return; // Time is before first frame.
            let i = 0;
            if (lastTime < frames[0])
                i = 0;
            else {
                i = Timeline.search1(frames, lastTime) + 1;
                let frameTime = frames[i];
                while (i > 0) { // Fire multiple events with the same frame.
                    if (frames[i - 1] != frameTime)
                        break;
                    i--;
                }
            }
            for (; i < frameCount && time >= frames[i]; i++)
                firedEvents.push(this.events[i]);
        }
    }
    EventTimeline.propertyIds = ["" + Property.event];
    /** Changes a skeleton's {@link Skeleton#drawOrder}. */
    class DrawOrderTimeline extends Timeline {
        constructor(frameCount) {
            super(frameCount, DrawOrderTimeline.propertyIds);
            /** The draw order for each key frame. See {@link #setFrame(int, float, int[])}. */
            this.drawOrders = null;
            this.drawOrders = new Array(frameCount);
        }
        getFrameCount() {
            return this.frames.length;
        }
        /** Sets the time in seconds and the draw order for the specified key frame.
         * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
         *           draw order. */
        setFrame(frame, time, drawOrder) {
            this.frames[frame] = time;
            this.drawOrders[frame] = drawOrder;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            if (direction == exports.MixDirection.mixOut) {
                if (blend == exports.MixBlend.setup)
                    Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
                return;
            }
            if (time < this.frames[0]) {
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
                return;
            }
            let drawOrderToSetupIndex = this.drawOrders[Timeline.search1(this.frames, time)];
            if (!drawOrderToSetupIndex)
                Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
            else {
                let drawOrder = skeleton.drawOrder;
                let slots = skeleton.slots;
                for (let i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                    drawOrder[i] = slots[drawOrderToSetupIndex[i]];
            }
        }
    }
    DrawOrderTimeline.propertyIds = ["" + Property.drawOrder];
    /** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
     * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}. */
    class IkConstraintTimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, ikConstraintIndex) {
            super(frameCount, bezierCount, [
                Property.ikConstraint + "|" + ikConstraintIndex
            ]);
            /** The index of the IK constraint slot in {@link Skeleton#ikConstraints} that will be changed. */
            this.ikConstraintIndex = 0;
            this.ikConstraintIndex = ikConstraintIndex;
        }
        getFrameEntries() {
            return 6 /*ENTRIES*/;
        }
        /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
        setFrame(frame, time, mix, softness, bendDirection, compress, stretch) {
            frame *= 6 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*MIX*/] = mix;
            this.frames[frame + 2 /*SOFTNESS*/] = softness;
            this.frames[frame + 3 /*BEND_DIRECTION*/] = bendDirection;
            this.frames[frame + 4 /*COMPRESS*/] = compress ? 1 : 0;
            this.frames[frame + 5 /*STRETCH*/] = stretch ? 1 : 0;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let constraint = skeleton.ikConstraints[this.ikConstraintIndex];
            if (!constraint.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mix = constraint.data.mix;
                        constraint.softness = constraint.data.softness;
                        constraint.bendDirection = constraint.data.bendDirection;
                        constraint.compress = constraint.data.compress;
                        constraint.stretch = constraint.data.stretch;
                        return;
                    case exports.MixBlend.first:
                        constraint.mix += (constraint.data.mix - constraint.mix) * alpha;
                        constraint.softness += (constraint.data.softness - constraint.softness) * alpha;
                        constraint.bendDirection = constraint.data.bendDirection;
                        constraint.compress = constraint.data.compress;
                        constraint.stretch = constraint.data.stretch;
                }
                return;
            }
            let mix = 0, softness = 0;
            let i = Timeline.search(frames, time, 6 /*ENTRIES*/);
            let curveType = this.curves[i / 6 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    mix = frames[i + 1 /*MIX*/];
                    softness = frames[i + 2 /*SOFTNESS*/];
                    let t = (time - before) / (frames[i + 6 /*ENTRIES*/] - before);
                    mix += (frames[i + 6 /*ENTRIES*/ + 1 /*MIX*/] - mix) * t;
                    softness += (frames[i + 6 /*ENTRIES*/ + 2 /*SOFTNESS*/] - softness) * t;
                    break;
                case 1 /*STEPPED*/:
                    mix = frames[i + 1 /*MIX*/];
                    softness = frames[i + 2 /*SOFTNESS*/];
                    break;
                default:
                    mix = this.getBezierValue(time, i, 1 /*MIX*/, curveType - 2 /*BEZIER*/);
                    softness = this.getBezierValue(time, i, 2 /*SOFTNESS*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                constraint.mix = constraint.data.mix + (mix - constraint.data.mix) * alpha;
                constraint.softness = constraint.data.softness + (softness - constraint.data.softness) * alpha;
                if (direction == exports.MixDirection.mixOut) {
                    constraint.bendDirection = constraint.data.bendDirection;
                    constraint.compress = constraint.data.compress;
                    constraint.stretch = constraint.data.stretch;
                }
                else {
                    constraint.bendDirection = frames[i + 3 /*BEND_DIRECTION*/];
                    constraint.compress = frames[i + 4 /*COMPRESS*/] != 0;
                    constraint.stretch = frames[i + 5 /*STRETCH*/] != 0;
                }
            }
            else {
                constraint.mix += (mix - constraint.mix) * alpha;
                constraint.softness += (softness - constraint.softness) * alpha;
                if (direction == exports.MixDirection.mixIn) {
                    constraint.bendDirection = frames[i + 3 /*BEND_DIRECTION*/];
                    constraint.compress = frames[i + 4 /*COMPRESS*/] != 0;
                    constraint.stretch = frames[i + 5 /*STRETCH*/] != 0;
                }
            }
        }
    }
    /** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
     * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}. */
    class TransformConstraintTimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, transformConstraintIndex) {
            super(frameCount, bezierCount, [
                Property.transformConstraint + "|" + transformConstraintIndex
            ]);
            /** The index of the transform constraint slot in {@link Skeleton#transformConstraints} that will be changed. */
            this.transformConstraintIndex = 0;
            this.transformConstraintIndex = transformConstraintIndex;
        }
        getFrameEntries() {
            return 7 /*ENTRIES*/;
        }
        /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
        setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY) {
            let frames = this.frames;
            frame *= 7 /*ENTRIES*/;
            frames[frame] = time;
            frames[frame + 1 /*ROTATE*/] = mixRotate;
            frames[frame + 2 /*X*/] = mixX;
            frames[frame + 3 /*Y*/] = mixY;
            frames[frame + 4 /*SCALEX*/] = mixScaleX;
            frames[frame + 5 /*SCALEY*/] = mixScaleY;
            frames[frame + 6 /*SHEARY*/] = mixShearY;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let constraint = skeleton.transformConstraints[this.transformConstraintIndex];
            if (!constraint.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                let data = constraint.data;
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mixRotate = data.mixRotate;
                        constraint.mixX = data.mixX;
                        constraint.mixY = data.mixY;
                        constraint.mixScaleX = data.mixScaleX;
                        constraint.mixScaleY = data.mixScaleY;
                        constraint.mixShearY = data.mixShearY;
                        return;
                    case exports.MixBlend.first:
                        constraint.mixRotate += (data.mixRotate - constraint.mixRotate) * alpha;
                        constraint.mixX += (data.mixX - constraint.mixX) * alpha;
                        constraint.mixY += (data.mixY - constraint.mixY) * alpha;
                        constraint.mixScaleX += (data.mixScaleX - constraint.mixScaleX) * alpha;
                        constraint.mixScaleY += (data.mixScaleY - constraint.mixScaleY) * alpha;
                        constraint.mixShearY += (data.mixShearY - constraint.mixShearY) * alpha;
                }
                return;
            }
            let rotate, x, y, scaleX, scaleY, shearY;
            let i = Timeline.search(frames, time, 7 /*ENTRIES*/);
            let curveType = this.curves[i / 7 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    scaleX = frames[i + 4 /*SCALEX*/];
                    scaleY = frames[i + 5 /*SCALEY*/];
                    shearY = frames[i + 6 /*SHEARY*/];
                    let t = (time - before) / (frames[i + 7 /*ENTRIES*/] - before);
                    rotate += (frames[i + 7 /*ENTRIES*/ + 1 /*ROTATE*/] - rotate) * t;
                    x += (frames[i + 7 /*ENTRIES*/ + 2 /*X*/] - x) * t;
                    y += (frames[i + 7 /*ENTRIES*/ + 3 /*Y*/] - y) * t;
                    scaleX += (frames[i + 7 /*ENTRIES*/ + 4 /*SCALEX*/] - scaleX) * t;
                    scaleY += (frames[i + 7 /*ENTRIES*/ + 5 /*SCALEY*/] - scaleY) * t;
                    shearY += (frames[i + 7 /*ENTRIES*/ + 6 /*SHEARY*/] - shearY) * t;
                    break;
                case 1 /*STEPPED*/:
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    scaleX = frames[i + 4 /*SCALEX*/];
                    scaleY = frames[i + 5 /*SCALEY*/];
                    shearY = frames[i + 6 /*SHEARY*/];
                    break;
                default:
                    rotate = this.getBezierValue(time, i, 1 /*ROTATE*/, curveType - 2 /*BEZIER*/);
                    x = this.getBezierValue(time, i, 2 /*X*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 3 /*Y*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    scaleX = this.getBezierValue(time, i, 4 /*SCALEX*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    scaleY = this.getBezierValue(time, i, 5 /*SCALEY*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    shearY = this.getBezierValue(time, i, 6 /*SHEARY*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                let data = constraint.data;
                constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
                constraint.mixX = data.mixX + (x - data.mixX) * alpha;
                constraint.mixY = data.mixY + (y - data.mixY) * alpha;
                constraint.mixScaleX = data.mixScaleX + (scaleX - data.mixScaleX) * alpha;
                constraint.mixScaleY = data.mixScaleY + (scaleY - data.mixScaleY) * alpha;
                constraint.mixShearY = data.mixShearY + (shearY - data.mixShearY) * alpha;
            }
            else {
                constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
                constraint.mixX += (x - constraint.mixX) * alpha;
                constraint.mixY += (y - constraint.mixY) * alpha;
                constraint.mixScaleX += (scaleX - constraint.mixScaleX) * alpha;
                constraint.mixScaleY += (scaleY - constraint.mixScaleY) * alpha;
                constraint.mixShearY += (shearY - constraint.mixShearY) * alpha;
            }
        }
    }
    /** Changes a path constraint's {@link PathConstraint#position}. */
    class PathConstraintPositionTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, pathConstraintIndex) {
            super(frameCount, bezierCount, Property.pathConstraintPosition + "|" + pathConstraintIndex);
            /** The index of the path constraint slot in {@link Skeleton#pathConstraints} that will be changed. */
            this.pathConstraintIndex = 0;
            this.pathConstraintIndex = pathConstraintIndex;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.position = constraint.data.position;
                        return;
                    case exports.MixBlend.first:
                        constraint.position += (constraint.data.position - constraint.position) * alpha;
                }
                return;
            }
            let position = this.getCurveValue(time);
            if (blend == exports.MixBlend.setup)
                constraint.position = constraint.data.position + (position - constraint.data.position) * alpha;
            else
                constraint.position += (position - constraint.position) * alpha;
        }
    }
    /** Changes a path constraint's {@link PathConstraint#spacing}. */
    class PathConstraintSpacingTimeline extends CurveTimeline1 {
        constructor(frameCount, bezierCount, pathConstraintIndex) {
            super(frameCount, bezierCount, Property.pathConstraintSpacing + "|" + pathConstraintIndex);
            /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
            this.pathConstraintIndex = 0;
            this.pathConstraintIndex = pathConstraintIndex;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.spacing = constraint.data.spacing;
                        return;
                    case exports.MixBlend.first:
                        constraint.spacing += (constraint.data.spacing - constraint.spacing) * alpha;
                }
                return;
            }
            let spacing = this.getCurveValue(time);
            if (blend == exports.MixBlend.setup)
                constraint.spacing = constraint.data.spacing + (spacing - constraint.data.spacing) * alpha;
            else
                constraint.spacing += (spacing - constraint.spacing) * alpha;
        }
    }
    /** Changes a transform constraint's {@link PathConstraint#getMixRotate()}, {@link PathConstraint#getMixX()}, and
     * {@link PathConstraint#getMixY()}. */
    class PathConstraintMixTimeline extends CurveTimeline {
        constructor(frameCount, bezierCount, pathConstraintIndex) {
            super(frameCount, bezierCount, [
                Property.pathConstraintMix + "|" + pathConstraintIndex
            ]);
            /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
            this.pathConstraintIndex = 0;
            this.pathConstraintIndex = pathConstraintIndex;
        }
        getFrameEntries() {
            return 4 /*ENTRIES*/;
        }
        setFrame(frame, time, mixRotate, mixX, mixY) {
            let frames = this.frames;
            frame <<= 2;
            frames[frame] = time;
            frames[frame + 1 /*ROTATE*/] = mixRotate;
            frames[frame + 2 /*X*/] = mixX;
            frames[frame + 3 /*Y*/] = mixY;
        }
        apply(skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            let frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mixRotate = constraint.data.mixRotate;
                        constraint.mixX = constraint.data.mixX;
                        constraint.mixY = constraint.data.mixY;
                        return;
                    case exports.MixBlend.first:
                        constraint.mixRotate += (constraint.data.mixRotate - constraint.mixRotate) * alpha;
                        constraint.mixX += (constraint.data.mixX - constraint.mixX) * alpha;
                        constraint.mixY += (constraint.data.mixY - constraint.mixY) * alpha;
                }
                return;
            }
            let rotate, x, y;
            let i = Timeline.search(frames, time, 4 /*ENTRIES*/);
            let curveType = this.curves[i >> 2];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    let before = frames[i];
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    let t = (time - before) / (frames[i + 4 /*ENTRIES*/] - before);
                    rotate += (frames[i + 4 /*ENTRIES*/ + 1 /*ROTATE*/] - rotate) * t;
                    x += (frames[i + 4 /*ENTRIES*/ + 2 /*X*/] - x) * t;
                    y += (frames[i + 4 /*ENTRIES*/ + 3 /*Y*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    break;
                default:
                    rotate = this.getBezierValue(time, i, 1 /*ROTATE*/, curveType - 2 /*BEZIER*/);
                    x = this.getBezierValue(time, i, 2 /*X*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 3 /*Y*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                let data = constraint.data;
                constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
                constraint.mixX = data.mixX + (x - data.mixX) * alpha;
                constraint.mixY = data.mixY + (y - data.mixY) * alpha;
            }
            else {
                constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
                constraint.mixX += (x - constraint.mixX) * alpha;
                constraint.mixY += (y - constraint.mixY) * alpha;
            }
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
     * multiple animations on top of each other (layering).
     *
     * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide. */
    class AnimationState {
        constructor(data) {
            /** The AnimationStateData to look up mix durations. */
            this.data = null;
            /** The list of tracks that currently have animations, which may contain null entries. */
            this.tracks = new Array();
            /** Multiplier for the delta time when the animation state is updated, causing time for all animations and mixes to play slower
             * or faster. Defaults to 1.
             *
             * See TrackEntry {@link TrackEntry#timeScale} for affecting a single animation. */
            this.timeScale = 1;
            this.unkeyedState = 0;
            this.events = new Array();
            this.listeners = new Array();
            this.queue = new EventQueue(this);
            this.propertyIDs = new StringSet();
            this.animationsChanged = false;
            this.trackEntryPool = new Pool(() => new TrackEntry());
            this.data = data;
        }
        static emptyAnimation() {
            if (!_emptyAnimation)
                _emptyAnimation = new Animation("<empty>", [], 0);
            return _emptyAnimation;
        }
        /** Increments each track entry {@link TrackEntry#trackTime()}, setting queued animations as current if needed. */
        update(delta) {
            delta *= this.timeScale;
            let tracks = this.tracks;
            for (let i = 0, n = tracks.length; i < n; i++) {
                let current = tracks[i];
                if (!current)
                    continue;
                current.animationLast = current.nextAnimationLast;
                current.trackLast = current.nextTrackLast;
                let currentDelta = delta * current.timeScale;
                if (current.delay > 0) {
                    current.delay -= currentDelta;
                    if (current.delay > 0)
                        continue;
                    currentDelta = -current.delay;
                    current.delay = 0;
                }
                let next = current.next;
                if (next) {
                    // When the next entry's delay is passed, change to the next entry, preserving leftover time.
                    let nextTime = current.trackLast - next.delay;
                    if (nextTime >= 0) {
                        next.delay = 0;
                        next.trackTime += current.timeScale == 0 ? 0 : (nextTime / current.timeScale + delta) * next.timeScale;
                        current.trackTime += currentDelta;
                        this.setCurrent(i, next, true);
                        while (next.mixingFrom) {
                            next.mixTime += delta;
                            next = next.mixingFrom;
                        }
                        continue;
                    }
                }
                else if (current.trackLast >= current.trackEnd && !current.mixingFrom) {
                    tracks[i] = null;
                    this.queue.end(current);
                    this.clearNext(current);
                    continue;
                }
                if (current.mixingFrom && this.updateMixingFrom(current, delta)) {
                    // End mixing from entries once all have completed.
                    let from = current.mixingFrom;
                    current.mixingFrom = null;
                    if (from)
                        from.mixingTo = null;
                    while (from) {
                        this.queue.end(from);
                        from = from.mixingFrom;
                    }
                }
                current.trackTime += currentDelta;
            }
            this.queue.drain();
        }
        /** Returns true when all mixing from entries are complete. */
        updateMixingFrom(to, delta) {
            let from = to.mixingFrom;
            if (!from)
                return true;
            let finished = this.updateMixingFrom(from, delta);
            from.animationLast = from.nextAnimationLast;
            from.trackLast = from.nextTrackLast;
            // Require mixTime > 0 to ensure the mixing from entry was applied at least once.
            if (to.mixTime > 0 && to.mixTime >= to.mixDuration) {
                // Require totalAlpha == 0 to ensure mixing is complete, unless mixDuration == 0 (the transition is a single frame).
                if (from.totalAlpha == 0 || to.mixDuration == 0) {
                    to.mixingFrom = from.mixingFrom;
                    if (from.mixingFrom)
                        from.mixingFrom.mixingTo = to;
                    to.interruptAlpha = from.interruptAlpha;
                    this.queue.end(from);
                }
                return finished;
            }
            from.trackTime += delta * from.timeScale;
            to.mixTime += delta;
            return false;
        }
        /** Poses the skeleton using the track entry animations. There are no side effects other than invoking listeners, so the
         * animation state can be applied to multiple skeletons to pose them identically.
         * @returns True if any animations were applied. */
        apply(skeleton) {
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            if (this.animationsChanged)
                this._animationsChanged();
            let events = this.events;
            let tracks = this.tracks;
            let applied = false;
            for (let i = 0, n = tracks.length; i < n; i++) {
                let current = tracks[i];
                if (!current || current.delay > 0)
                    continue;
                applied = true;
                let blend = i == 0 ? exports.MixBlend.first : current.mixBlend;
                // Apply mixing from entries first.
                let mix = current.alpha;
                if (current.mixingFrom)
                    mix *= this.applyMixingFrom(current, skeleton, blend);
                else if (current.trackTime >= current.trackEnd && !current.next)
                    mix = 0;
                // Apply current entry.
                let animationLast = current.animationLast, animationTime = current.getAnimationTime(), applyTime = animationTime;
                let applyEvents = events;
                if (current.reverse) {
                    applyTime = current.animation.duration - applyTime;
                    applyEvents = null;
                }
                let timelines = current.animation.timelines;
                let timelineCount = timelines.length;
                if ((i == 0 && mix == 1) || blend == exports.MixBlend.add) {
                    for (let ii = 0; ii < timelineCount; ii++) {
                        // Fixes issue #302 on IOS9 where mix, blend sometimes became undefined and caused assets
                        // to sometimes stop rendering when using color correction, as their RGBA values become NaN.
                        // (https://github.com/pixijs/pixi-spine/issues/302)
                        Utils.webkit602BugfixHelper(mix, blend);
                        var timeline = timelines[ii];
                        if (timeline instanceof AttachmentTimeline)
                            this.applyAttachmentTimeline(timeline, skeleton, applyTime, blend, true);
                        else
                            timeline.apply(skeleton, animationLast, applyTime, applyEvents, mix, blend, exports.MixDirection.mixIn);
                    }
                }
                else {
                    let timelineMode = current.timelineMode;
                    let firstFrame = current.timelinesRotation.length != timelineCount << 1;
                    if (firstFrame)
                        current.timelinesRotation.length = timelineCount << 1;
                    for (let ii = 0; ii < timelineCount; ii++) {
                        let timeline = timelines[ii];
                        let timelineBlend = timelineMode[ii] == SUBSEQUENT ? blend : exports.MixBlend.setup;
                        if (timeline instanceof RotateTimeline) {
                            this.applyRotateTimeline(timeline, skeleton, applyTime, mix, timelineBlend, current.timelinesRotation, ii << 1, firstFrame);
                        }
                        else if (timeline instanceof AttachmentTimeline) {
                            this.applyAttachmentTimeline(timeline, skeleton, applyTime, blend, true);
                        }
                        else {
                            // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                            Utils.webkit602BugfixHelper(mix, blend);
                            timeline.apply(skeleton, animationLast, applyTime, applyEvents, mix, timelineBlend, exports.MixDirection.mixIn);
                        }
                    }
                }
                this.queueEvents(current, animationTime);
                events.length = 0;
                current.nextAnimationLast = animationTime;
                current.nextTrackLast = current.trackTime;
            }
            // Set slots attachments to the setup pose, if needed. This occurs if an animation that is mixing out sets attachments so
            // subsequent timelines see any deform, but the subsequent timelines don't set an attachment (eg they are also mixing out or
            // the time is before the first key).
            var setupState = this.unkeyedState + SETUP;
            var slots = skeleton.slots;
            for (var i = 0, n = skeleton.slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.attachmentState == setupState) {
                    var attachmentName = slot.data.attachmentName;
                    slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(slot.data.index, attachmentName));
                }
            }
            this.unkeyedState += 2; // Increasing after each use avoids the need to reset attachmentState for every slot.
            this.queue.drain();
            return applied;
        }
        applyMixingFrom(to, skeleton, blend) {
            let from = to.mixingFrom;
            if (from.mixingFrom)
                this.applyMixingFrom(from, skeleton, blend);
            let mix = 0;
            if (to.mixDuration == 0) { // Single frame mix to undo mixingFrom changes.
                mix = 1;
                if (blend == exports.MixBlend.first)
                    blend = exports.MixBlend.setup;
            }
            else {
                mix = to.mixTime / to.mixDuration;
                if (mix > 1)
                    mix = 1;
                if (blend != exports.MixBlend.first)
                    blend = from.mixBlend;
            }
            let attachments = mix < from.attachmentThreshold, drawOrder = mix < from.drawOrderThreshold;
            let timelines = from.animation.timelines;
            let timelineCount = timelines.length;
            let alphaHold = from.alpha * to.interruptAlpha, alphaMix = alphaHold * (1 - mix);
            let animationLast = from.animationLast, animationTime = from.getAnimationTime(), applyTime = animationTime;
            let events = null;
            if (from.reverse)
                applyTime = from.animation.duration - applyTime;
            else if (mix < from.eventThreshold)
                events = this.events;
            if (blend == exports.MixBlend.add) {
                for (let i = 0; i < timelineCount; i++)
                    timelines[i].apply(skeleton, animationLast, applyTime, events, alphaMix, blend, exports.MixDirection.mixOut);
            }
            else {
                let timelineMode = from.timelineMode;
                let timelineHoldMix = from.timelineHoldMix;
                let firstFrame = from.timelinesRotation.length != timelineCount << 1;
                if (firstFrame)
                    from.timelinesRotation.length = timelineCount << 1;
                from.totalAlpha = 0;
                for (let i = 0; i < timelineCount; i++) {
                    let timeline = timelines[i];
                    let direction = exports.MixDirection.mixOut;
                    let timelineBlend;
                    let alpha = 0;
                    switch (timelineMode[i]) {
                        case SUBSEQUENT:
                            if (!drawOrder && timeline instanceof DrawOrderTimeline)
                                continue;
                            timelineBlend = blend;
                            alpha = alphaMix;
                            break;
                        case FIRST:
                            timelineBlend = exports.MixBlend.setup;
                            alpha = alphaMix;
                            break;
                        case HOLD_SUBSEQUENT:
                            timelineBlend = blend;
                            alpha = alphaHold;
                            break;
                        case HOLD_FIRST:
                            timelineBlend = exports.MixBlend.setup;
                            alpha = alphaHold;
                            break;
                        default:
                            timelineBlend = exports.MixBlend.setup;
                            let holdMix = timelineHoldMix[i];
                            alpha = alphaHold * Math.max(0, 1 - holdMix.mixTime / holdMix.mixDuration);
                            break;
                    }
                    from.totalAlpha += alpha;
                    if (timeline instanceof RotateTimeline)
                        this.applyRotateTimeline(timeline, skeleton, applyTime, alpha, timelineBlend, from.timelinesRotation, i << 1, firstFrame);
                    else if (timeline instanceof AttachmentTimeline)
                        this.applyAttachmentTimeline(timeline, skeleton, applyTime, timelineBlend, attachments);
                    else {
                        // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                        Utils.webkit602BugfixHelper(alpha, blend);
                        if (drawOrder && timeline instanceof DrawOrderTimeline && timelineBlend == exports.MixBlend.setup)
                            direction = exports.MixDirection.mixIn;
                        timeline.apply(skeleton, animationLast, applyTime, events, alpha, timelineBlend, direction);
                    }
                }
            }
            if (to.mixDuration > 0)
                this.queueEvents(from, animationTime);
            this.events.length = 0;
            from.nextAnimationLast = animationTime;
            from.nextTrackLast = from.trackTime;
            return mix;
        }
        applyAttachmentTimeline(timeline, skeleton, time, blend, attachments) {
            var slot = skeleton.slots[timeline.slotIndex];
            if (!slot.bone.active)
                return;
            if (time < timeline.frames[0]) { // Time is before first frame.
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName, attachments);
            }
            else
                this.setAttachment(skeleton, slot, timeline.attachmentNames[Timeline.search1(timeline.frames, time)], attachments);
            // If an attachment wasn't set (ie before the first frame or attachments is false), set the setup attachment later.
            if (slot.attachmentState <= this.unkeyedState)
                slot.attachmentState = this.unkeyedState + SETUP;
        }
        setAttachment(skeleton, slot, attachmentName, attachments) {
            slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(slot.data.index, attachmentName));
            if (attachments)
                slot.attachmentState = this.unkeyedState + CURRENT;
        }
        applyRotateTimeline(timeline, skeleton, time, alpha, blend, timelinesRotation, i, firstFrame) {
            if (firstFrame)
                timelinesRotation[i] = 0;
            if (alpha == 1) {
                timeline.apply(skeleton, 0, time, null, 1, blend, exports.MixDirection.mixIn);
                return;
            }
            let bone = skeleton.bones[timeline.boneIndex];
            if (!bone.active)
                return;
            let frames = timeline.frames;
            let r1 = 0, r2 = 0;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.rotation = bone.data.rotation;
                    default:
                        return;
                    case exports.MixBlend.first:
                        r1 = bone.rotation;
                        r2 = bone.data.rotation;
                }
            }
            else {
                r1 = blend == exports.MixBlend.setup ? bone.data.rotation : bone.rotation;
                r2 = bone.data.rotation + timeline.getCurveValue(time);
            }
            // Mix between rotations using the direction of the shortest route on the first frame while detecting crosses.
            let total = 0, diff = r2 - r1;
            diff -= (16384 - ((16384.499999999996 - diff / 360) | 0)) * 360;
            if (diff == 0) {
                total = timelinesRotation[i];
            }
            else {
                let lastTotal = 0, lastDiff = 0;
                if (firstFrame) {
                    lastTotal = 0;
                    lastDiff = diff;
                }
                else {
                    lastTotal = timelinesRotation[i]; // Angle and direction of mix, including loops.
                    lastDiff = timelinesRotation[i + 1]; // Difference between bones.
                }
                let current = diff > 0, dir = lastTotal >= 0;
                // Detect cross at 0 (not 180).
                if (MathUtils.signum(lastDiff) != MathUtils.signum(diff) && Math.abs(lastDiff) <= 90) {
                    // A cross after a 360 rotation is a loop.
                    if (Math.abs(lastTotal) > 180)
                        lastTotal += 360 * MathUtils.signum(lastTotal);
                    dir = current;
                }
                total = diff + lastTotal - lastTotal % 360; // Store loops as part of lastTotal.
                if (dir != current)
                    total += 360 * MathUtils.signum(lastTotal);
                timelinesRotation[i] = total;
            }
            timelinesRotation[i + 1] = diff;
            bone.rotation = r1 + total * alpha;
        }
        queueEvents(entry, animationTime) {
            let animationStart = entry.animationStart, animationEnd = entry.animationEnd;
            let duration = animationEnd - animationStart;
            let trackLastWrapped = entry.trackLast % duration;
            // Queue events before complete.
            let events = this.events;
            let i = 0, n = events.length;
            for (; i < n; i++) {
                let event = events[i];
                if (event.time < trackLastWrapped)
                    break;
                if (event.time > animationEnd)
                    continue; // Discard events outside animation start/end.
                this.queue.event(entry, event);
            }
            // Queue complete if completed a loop iteration or the animation.
            let complete = false;
            if (entry.loop)
                complete = duration == 0 || trackLastWrapped > entry.trackTime % duration;
            else
                complete = animationTime >= animationEnd && entry.animationLast < animationEnd;
            if (complete)
                this.queue.complete(entry);
            // Queue events after complete.
            for (; i < n; i++) {
                let event = events[i];
                if (event.time < animationStart)
                    continue; // Discard events outside animation start/end.
                this.queue.event(entry, event);
            }
        }
        /** Removes all animations from all tracks, leaving skeletons in their current pose.
         *
         * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
         * rather than leaving them in their current pose. */
        clearTracks() {
            let oldDrainDisabled = this.queue.drainDisabled;
            this.queue.drainDisabled = true;
            for (let i = 0, n = this.tracks.length; i < n; i++)
                this.clearTrack(i);
            this.tracks.length = 0;
            this.queue.drainDisabled = oldDrainDisabled;
            this.queue.drain();
        }
        /** Removes all animations from the track, leaving skeletons in their current pose.
         *
         * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
         * rather than leaving them in their current pose. */
        clearTrack(trackIndex) {
            if (trackIndex >= this.tracks.length)
                return;
            let current = this.tracks[trackIndex];
            if (!current)
                return;
            this.queue.end(current);
            this.clearNext(current);
            let entry = current;
            while (true) {
                let from = entry.mixingFrom;
                if (!from)
                    break;
                this.queue.end(from);
                entry.mixingFrom = null;
                entry.mixingTo = null;
                entry = from;
            }
            this.tracks[current.trackIndex] = null;
            this.queue.drain();
        }
        setCurrent(index, current, interrupt) {
            let from = this.expandToIndex(index);
            this.tracks[index] = current;
            current.previous = null;
            if (from) {
                if (interrupt)
                    this.queue.interrupt(from);
                current.mixingFrom = from;
                from.mixingTo = current;
                current.mixTime = 0;
                // Store the interrupted mix percentage.
                if (from.mixingFrom && from.mixDuration > 0)
                    current.interruptAlpha *= Math.min(1, from.mixTime / from.mixDuration);
                from.timelinesRotation.length = 0; // Reset rotation for mixing out, in case entry was mixed in.
            }
            this.queue.start(current);
        }
        /** Sets an animation by name.
          *
          * See {@link #setAnimationWith()}. */
        setAnimation(trackIndex, animationName, loop = false) {
            let animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation)
                throw new Error("Animation not found: " + animationName);
            return this.setAnimationWith(trackIndex, animation, loop);
        }
        /** Sets the current animation for a track, discarding any queued animations. If the formerly current track entry was never
         * applied to a skeleton, it is replaced (not mixed from).
         * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
         *           duration. In either case {@link TrackEntry#trackEnd} determines when the track is cleared.
         * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
         *         after the {@link AnimationStateListener#dispose()} event occurs. */
        setAnimationWith(trackIndex, animation, loop = false) {
            if (!animation)
                throw new Error("animation cannot be null.");
            let interrupt = true;
            let current = this.expandToIndex(trackIndex);
            if (current) {
                if (current.nextTrackLast == -1) {
                    // Don't mix from an entry that was never applied.
                    this.tracks[trackIndex] = current.mixingFrom;
                    this.queue.interrupt(current);
                    this.queue.end(current);
                    this.clearNext(current);
                    current = current.mixingFrom;
                    interrupt = false;
                }
                else
                    this.clearNext(current);
            }
            let entry = this.trackEntry(trackIndex, animation, loop, current);
            this.setCurrent(trackIndex, entry, interrupt);
            this.queue.drain();
            return entry;
        }
        /** Queues an animation by name.
         *
         * See {@link #addAnimationWith()}. */
        addAnimation(trackIndex, animationName, loop = false, delay = 0) {
            let animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation)
                throw new Error("Animation not found: " + animationName);
            return this.addAnimationWith(trackIndex, animation, loop, delay);
        }
        /** Adds an animation to be played after the current or last queued animation for a track. If the track is empty, it is
         * equivalent to calling {@link #setAnimationWith()}.
         * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
         *           minus any mix duration (from the {@link AnimationStateData}) plus the specified `delay` (ie the mix
         *           ends at (`delay` = 0) or before (`delay` < 0) the previous track entry duration). If the
         *           previous entry is looping, its next loop completion is used instead of its duration.
         * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
         *         after the {@link AnimationStateListener#dispose()} event occurs. */
        addAnimationWith(trackIndex, animation, loop = false, delay = 0) {
            if (!animation)
                throw new Error("animation cannot be null.");
            let last = this.expandToIndex(trackIndex);
            if (last) {
                while (last.next)
                    last = last.next;
            }
            let entry = this.trackEntry(trackIndex, animation, loop, last);
            if (!last) {
                this.setCurrent(trackIndex, entry, true);
                this.queue.drain();
            }
            else {
                last.next = entry;
                entry.previous = last;
                if (delay <= 0)
                    delay += last.getTrackComplete() - entry.mixDuration;
            }
            entry.delay = delay;
            return entry;
        }
        /** Sets an empty animation for a track, discarding any queued animations, and sets the track entry's
         * {@link TrackEntry#mixduration}. An empty animation has no timelines and serves as a placeholder for mixing in or out.
         *
         * Mixing out is done by setting an empty animation with a mix duration using either {@link #setEmptyAnimation()},
         * {@link #setEmptyAnimations()}, or {@link #addEmptyAnimation()}. Mixing to an empty animation causes
         * the previous animation to be applied less and less over the mix duration. Properties keyed in the previous animation
         * transition to the value from lower tracks or to the setup pose value if no lower tracks key the property. A mix duration of
         * 0 still mixes out over one frame.
         *
         * Mixing in is done by first setting an empty animation, then adding an animation using
         * {@link #addAnimation()} and on the returned track entry, set the
         * {@link TrackEntry#setMixDuration()}. Mixing from an empty animation causes the new animation to be applied more and
         * more over the mix duration. Properties keyed in the new animation transition from the value from lower tracks or from the
         * setup pose value if no lower tracks key the property to the value keyed in the new animation. */
        setEmptyAnimation(trackIndex, mixDuration = 0) {
            let entry = this.setAnimationWith(trackIndex, AnimationState.emptyAnimation(), false);
            entry.mixDuration = mixDuration;
            entry.trackEnd = mixDuration;
            return entry;
        }
        /** Adds an empty animation to be played after the current or last queued animation for a track, and sets the track entry's
         * {@link TrackEntry#mixDuration}. If the track is empty, it is equivalent to calling
         * {@link #setEmptyAnimation()}.
         *
         * See {@link #setEmptyAnimation()}.
         * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
         *           minus any mix duration plus the specified `delay` (ie the mix ends at (`delay` = 0) or
         *           before (`delay` < 0) the previous track entry duration). If the previous entry is looping, its next
         *           loop completion is used instead of its duration.
         * @return A track entry to allow further customization of animation playback. References to the track entry must not be kept
         *         after the {@link AnimationStateListener#dispose()} event occurs. */
        addEmptyAnimation(trackIndex, mixDuration = 0, delay = 0) {
            let entry = this.addAnimationWith(trackIndex, AnimationState.emptyAnimation(), false, delay);
            if (delay <= 0)
                entry.delay += entry.mixDuration - mixDuration;
            entry.mixDuration = mixDuration;
            entry.trackEnd = mixDuration;
            return entry;
        }
        /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix
          * duration. */
        setEmptyAnimations(mixDuration = 0) {
            let oldDrainDisabled = this.queue.drainDisabled;
            this.queue.drainDisabled = true;
            for (let i = 0, n = this.tracks.length; i < n; i++) {
                let current = this.tracks[i];
                if (current)
                    this.setEmptyAnimation(current.trackIndex, mixDuration);
            }
            this.queue.drainDisabled = oldDrainDisabled;
            this.queue.drain();
        }
        expandToIndex(index) {
            if (index < this.tracks.length)
                return this.tracks[index];
            Utils.ensureArrayCapacity(this.tracks, index + 1, null);
            this.tracks.length = index + 1;
            return null;
        }
        /** @param last May be null. */
        trackEntry(trackIndex, animation, loop, last) {
            let entry = this.trackEntryPool.obtain();
            entry.reset();
            entry.trackIndex = trackIndex;
            entry.animation = animation;
            entry.loop = loop;
            entry.holdPrevious = false;
            entry.eventThreshold = 0;
            entry.attachmentThreshold = 0;
            entry.drawOrderThreshold = 0;
            entry.animationStart = 0;
            entry.animationEnd = animation.duration;
            entry.animationLast = -1;
            entry.nextAnimationLast = -1;
            entry.delay = 0;
            entry.trackTime = 0;
            entry.trackLast = -1;
            entry.nextTrackLast = -1;
            entry.trackEnd = Number.MAX_VALUE;
            entry.timeScale = 1;
            entry.alpha = 1;
            entry.interruptAlpha = 1;
            entry.mixTime = 0;
            entry.mixDuration = !last ? 0 : this.data.getMix(last.animation, animation);
            entry.mixBlend = exports.MixBlend.replace;
            return entry;
        }
        /** Removes the {@link TrackEntry#getNext() next entry} and all entries after it for the specified entry. */
        clearNext(entry) {
            let next = entry.next;
            while (next) {
                this.queue.dispose(next);
                next = next.next;
            }
            entry.next = null;
        }
        _animationsChanged() {
            this.animationsChanged = false;
            this.propertyIDs.clear();
            let tracks = this.tracks;
            for (let i = 0, n = tracks.length; i < n; i++) {
                let entry = tracks[i];
                if (!entry)
                    continue;
                while (entry.mixingFrom)
                    entry = entry.mixingFrom;
                do {
                    if (!entry.mixingTo || entry.mixBlend != exports.MixBlend.add)
                        this.computeHold(entry);
                    entry = entry.mixingTo;
                } while (entry);
            }
        }
        computeHold(entry) {
            let to = entry.mixingTo;
            let timelines = entry.animation.timelines;
            let timelinesCount = entry.animation.timelines.length;
            let timelineMode = entry.timelineMode;
            timelineMode.length = timelinesCount;
            let timelineHoldMix = entry.timelineHoldMix;
            timelineHoldMix.length = 0;
            let propertyIDs = this.propertyIDs;
            if (to && to.holdPrevious) {
                for (let i = 0; i < timelinesCount; i++)
                    timelineMode[i] = propertyIDs.addAll(timelines[i].getPropertyIds()) ? HOLD_FIRST : HOLD_SUBSEQUENT;
                return;
            }
            outer: for (let i = 0; i < timelinesCount; i++) {
                let timeline = timelines[i];
                let ids = timeline.getPropertyIds();
                if (!propertyIDs.addAll(ids))
                    timelineMode[i] = SUBSEQUENT;
                else if (!to || timeline instanceof AttachmentTimeline || timeline instanceof DrawOrderTimeline
                    || timeline instanceof EventTimeline || !to.animation.hasTimeline(ids)) {
                    timelineMode[i] = FIRST;
                }
                else {
                    for (let next = to.mixingTo; next; next = next.mixingTo) {
                        if (next.animation.hasTimeline(ids))
                            continue;
                        if (entry.mixDuration > 0) {
                            timelineMode[i] = HOLD_MIX;
                            timelineHoldMix[i] = next;
                            continue outer;
                        }
                        break;
                    }
                    timelineMode[i] = HOLD_FIRST;
                }
            }
        }
        /** Returns the track entry for the animation currently playing on the track, or null if no animation is currently playing. */
        getCurrent(trackIndex) {
            if (trackIndex >= this.tracks.length)
                return null;
            return this.tracks[trackIndex];
        }
        /** Adds a listener to receive events for all track entries. */
        addListener(listener) {
            if (!listener)
                throw new Error("listener cannot be null.");
            this.listeners.push(listener);
        }
        /** Removes the listener added with {@link #addListener()}. */
        removeListener(listener) {
            let index = this.listeners.indexOf(listener);
            if (index >= 0)
                this.listeners.splice(index, 1);
        }
        /** Removes all listeners added with {@link #addListener()}. */
        clearListeners() {
            this.listeners.length = 0;
        }
        /** Discards all listener notifications that have not yet been delivered. This can be useful to call from an
         * {@link AnimationStateListener} when it is known that further notifications that may have been already queued for delivery
         * are not wanted because new animations are being set. */
        clearListenerNotifications() {
            this.queue.clear();
        }
    }
    /** Stores settings and other state for the playback of an animation on an {@link AnimationState} track.
     *
     * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs. */
    class TrackEntry {
        constructor() {
            /** The animation to apply for this track entry. */
            this.animation = null;
            this.previous = null;
            /** The animation queued to start after this animation, or null. `next` makes up a linked list. */
            this.next = null;
            /** The track entry for the previous animation when mixing from the previous animation to this animation, or null if no
             * mixing is currently occuring. When mixing from multiple animations, `mixingFrom` makes up a linked list. */
            this.mixingFrom = null;
            /** The track entry for the next animation when mixing from this animation to the next animation, or null if no mixing is
             * currently occuring. When mixing to multiple animations, `mixingTo` makes up a linked list. */
            this.mixingTo = null;
            /** The listener for events generated by this track entry, or null.
             *
             * A track entry returned from {@link AnimationState#setAnimation()} is already the current animation
             * for the track, so the track entry listener {@link AnimationStateListener#start()} will not be called. */
            this.listener = null;
            /** The index of the track where this track entry is either current or queued.
             *
             * See {@link AnimationState#getCurrent()}. */
            this.trackIndex = 0;
            /** If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
             * duration. */
            this.loop = false;
            /** If true, when mixing from the previous animation to this animation, the previous animation is applied as normal instead
             * of being mixed out.
             *
             * When mixing between animations that key the same property, if a lower track also keys that property then the value will
             * briefly dip toward the lower track value during the mix. This happens because the first animation mixes from 100% to 0%
             * while the second animation mixes from 0% to 100%. Setting `holdPrevious` to true applies the first animation
             * at 100% during the mix so the lower track value is overwritten. Such dipping does not occur on the lowest track which
             * keys the property, only when a higher track also keys the property.
             *
             * Snapping will occur if `holdPrevious` is true and this animation does not key all the same properties as the
             * previous animation. */
            this.holdPrevious = false;
            this.reverse = false;
            /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
             * `eventThreshold`, event timelines are applied while this animation is being mixed out. Defaults to 0, so event
             * timelines are not applied while this animation is being mixed out. */
            this.eventThreshold = 0;
            /** When the mix percentage ({@link #mixtime} / {@link #mixDuration}) is less than the
             * `attachmentThreshold`, attachment timelines are applied while this animation is being mixed out. Defaults to
             * 0, so attachment timelines are not applied while this animation is being mixed out. */
            this.attachmentThreshold = 0;
            /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
             * `drawOrderThreshold`, draw order timelines are applied while this animation is being mixed out. Defaults to 0,
             * so draw order timelines are not applied while this animation is being mixed out. */
            this.drawOrderThreshold = 0;
            /** Seconds when this animation starts, both initially and after looping. Defaults to 0.
             *
             * When changing the `animationStart` time, it often makes sense to set {@link #animationLast} to the same
             * value to prevent timeline keys before the start time from triggering. */
            this.animationStart = 0;
            /** Seconds for the last frame of this animation. Non-looping animations won't play past this time. Looping animations will
             * loop back to {@link #animationStart} at this time. Defaults to the animation {@link Animation#duration}. */
            this.animationEnd = 0;
            /** The time in seconds this animation was last applied. Some timelines use this for one-time triggers. Eg, when this
             * animation is applied, event timelines will fire all events between the `animationLast` time (exclusive) and
             * `animationTime` (inclusive). Defaults to -1 to ensure triggers on frame 0 happen the first time this animation
             * is applied. */
            this.animationLast = 0;
            this.nextAnimationLast = 0;
            /** Seconds to postpone playing the animation. When this track entry is the current track entry, `delay`
             * postpones incrementing the {@link #trackTime}. When this track entry is queued, `delay` is the time from
             * the start of the previous animation to when this track entry will become the current track entry (ie when the previous
             * track entry {@link TrackEntry#trackTime} >= this track entry's `delay`).
             *
             * {@link #timeScale} affects the delay. */
            this.delay = 0;
            /** Current time in seconds this track entry has been the current track entry. The track time determines
             * {@link #animationTime}. The track time can be set to start the animation at a time other than 0, without affecting
             * looping. */
            this.trackTime = 0;
            this.trackLast = 0;
            this.nextTrackLast = 0;
            /** The track time in seconds when this animation will be removed from the track. Defaults to the highest possible float
             * value, meaning the animation will be applied until a new animation is set or the track is cleared. If the track end time
             * is reached, no other animations are queued for playback, and mixing from any previous animations is complete, then the
             * properties keyed by the animation are set to the setup pose and the track is cleared.
             *
             * It may be desired to use {@link AnimationState#addEmptyAnimation()} rather than have the animation
             * abruptly cease being applied. */
            this.trackEnd = 0;
            /** Multiplier for the delta time when this track entry is updated, causing time for this animation to pass slower or
             * faster. Defaults to 1.
             *
             * {@link #mixTime} is not affected by track entry time scale, so {@link #mixDuration} may need to be adjusted to
             * match the animation speed.
             *
             * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
             * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, assuming time scale to be 1. If
             * the time scale is not 1, the delay may need to be adjusted.
             *
             * See AnimationState {@link AnimationState#timeScale} for affecting all animations. */
            this.timeScale = 0;
            /** Values < 1 mix this animation with the skeleton's current pose (usually the pose resulting from lower tracks). Defaults
             * to 1, which overwrites the skeleton's current pose with this animation.
             *
             * Typically track 0 is used to completely pose the skeleton, then alpha is used on higher tracks. It doesn't make sense to
             * use alpha on track 0 if the skeleton pose is from the last frame render. */
            this.alpha = 0;
            /** Seconds from 0 to the {@link #getMixDuration()} when mixing from the previous animation to this animation. May be
             * slightly more than `mixDuration` when the mix is complete. */
            this.mixTime = 0;
            /** Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData
             * {@link AnimationStateData#getMix()} based on the animation before this animation (if any).
             *
             * A mix duration of 0 still mixes out over one frame to provide the track entry being mixed out a chance to revert the
             * properties it was animating.
             *
             * The `mixDuration` can be set manually rather than use the value from
             * {@link AnimationStateData#getMix()}. In that case, the `mixDuration` can be set for a new
             * track entry only before {@link AnimationState#update(float)} is first called.
             *
             * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
             * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, not a mix duration set
             * afterward. */
            this.mixDuration = 0;
            this.interruptAlpha = 0;
            this.totalAlpha = 0;
            /** Controls how properties keyed in the animation are mixed with lower tracks. Defaults to {@link MixBlend#replace}, which
             * replaces the values from the lower tracks with the animation values. {@link MixBlend#add} adds the animation values to
             * the values from the lower tracks.
             *
             * The `mixBlend` can be set for a new track entry only before {@link AnimationState#apply()} is first
             * called. */
            this.mixBlend = exports.MixBlend.replace;
            this.timelineMode = new Array();
            this.timelineHoldMix = new Array();
            this.timelinesRotation = new Array();
        }
        reset() {
            this.next = null;
            this.previous = null;
            this.mixingFrom = null;
            this.mixingTo = null;
            this.animation = null;
            this.listener = null;
            this.timelineMode.length = 0;
            this.timelineHoldMix.length = 0;
            this.timelinesRotation.length = 0;
        }
        /** Uses {@link #trackTime} to compute the `animationTime`, which is between {@link #animationStart}
         * and {@link #animationEnd}. When the `trackTime` is 0, the `animationTime` is equal to the
         * `animationStart` time. */
        getAnimationTime() {
            if (this.loop) {
                let duration = this.animationEnd - this.animationStart;
                if (duration == 0)
                    return this.animationStart;
                return (this.trackTime % duration) + this.animationStart;
            }
            return Math.min(this.trackTime + this.animationStart, this.animationEnd);
        }
        setAnimationLast(animationLast) {
            this.animationLast = animationLast;
            this.nextAnimationLast = animationLast;
        }
        /** Returns true if at least one loop has been completed.
         *
         * See {@link AnimationStateListener#complete()}. */
        isComplete() {
            return this.trackTime >= this.animationEnd - this.animationStart;
        }
        /** Resets the rotation directions for mixing this entry's rotate timelines. This can be useful to avoid bones rotating the
         * long way around when using {@link #alpha} and starting animations on other tracks.
         *
         * Mixing with {@link MixBlend#replace} involves finding a rotation between two others, which has two possible solutions:
         * the short way or the long way around. The two rotations likely change over time, so which direction is the short or long
         * way also changes. If the short way was always chosen, bones would flip to the other side when that direction became the
         * long way. TrackEntry chooses the short way the first time it is applied and remembers that direction. */
        resetRotationDirections() {
            this.timelinesRotation.length = 0;
        }
        getTrackComplete() {
            let duration = this.animationEnd - this.animationStart;
            if (duration != 0) {
                if (this.loop)
                    return duration * (1 + ((this.trackTime / duration) | 0)); // Completion of next loop.
                if (this.trackTime < duration)
                    return duration; // Before duration.
            }
            return this.trackTime; // Next update.
        }
    }
    class EventQueue {
        constructor(animState) {
            this.objects = [];
            this.drainDisabled = false;
            this.animState = null;
            this.animState = animState;
        }
        start(entry) {
            this.objects.push(exports.EventType.start);
            this.objects.push(entry);
            this.animState.animationsChanged = true;
        }
        interrupt(entry) {
            this.objects.push(exports.EventType.interrupt);
            this.objects.push(entry);
        }
        end(entry) {
            this.objects.push(exports.EventType.end);
            this.objects.push(entry);
            this.animState.animationsChanged = true;
        }
        dispose(entry) {
            this.objects.push(exports.EventType.dispose);
            this.objects.push(entry);
        }
        complete(entry) {
            this.objects.push(exports.EventType.complete);
            this.objects.push(entry);
        }
        event(entry, event) {
            this.objects.push(exports.EventType.event);
            this.objects.push(entry);
            this.objects.push(event);
        }
        drain() {
            if (this.drainDisabled)
                return;
            this.drainDisabled = true;
            let objects = this.objects;
            let listeners = this.animState.listeners;
            for (let i = 0; i < objects.length; i += 2) {
                let type = objects[i];
                let entry = objects[i + 1];
                switch (type) {
                    case exports.EventType.start:
                        if (entry.listener && entry.listener.start)
                            entry.listener.start(entry);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].start)
                                listeners[ii].start(entry);
                        break;
                    case exports.EventType.interrupt:
                        if (entry.listener && entry.listener.interrupt)
                            entry.listener.interrupt(entry);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].interrupt)
                                listeners[ii].interrupt(entry);
                        break;
                    case exports.EventType.end:
                        if (entry.listener && entry.listener.end)
                            entry.listener.end(entry);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].end)
                                listeners[ii].end(entry);
                    // Fall through.
                    case exports.EventType.dispose:
                        if (entry.listener && entry.listener.dispose)
                            entry.listener.dispose(entry);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].dispose)
                                listeners[ii].dispose(entry);
                        this.animState.trackEntryPool.free(entry);
                        break;
                    case exports.EventType.complete:
                        if (entry.listener && entry.listener.complete)
                            entry.listener.complete(entry);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].complete)
                                listeners[ii].complete(entry);
                        break;
                    case exports.EventType.event:
                        let event = objects[i++ + 2];
                        if (entry.listener && entry.listener.event)
                            entry.listener.event(entry, event);
                        for (let ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].event)
                                listeners[ii].event(entry, event);
                        break;
                }
            }
            this.clear();
            this.drainDisabled = false;
        }
        clear() {
            this.objects.length = 0;
        }
    }
    (function (EventType) {
        EventType[EventType["start"] = 0] = "start";
        EventType[EventType["interrupt"] = 1] = "interrupt";
        EventType[EventType["end"] = 2] = "end";
        EventType[EventType["dispose"] = 3] = "dispose";
        EventType[EventType["complete"] = 4] = "complete";
        EventType[EventType["event"] = 5] = "event";
    })(exports.EventType || (exports.EventType = {}));
    class AnimationStateAdapter {
        start(entry) {
        }
        interrupt(entry) {
        }
        end(entry) {
        }
        dispose(entry) {
        }
        complete(entry) {
        }
        event(entry, event) {
        }
    }
    /** 1. A previously applied timeline has set this property.
     *
     * Result: Mix from the current pose to the timeline pose. */
    const SUBSEQUENT = 0;
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry applied after this one does not have a timeline to set this property.
     *
     * Result: Mix from the setup pose to the timeline pose. */
    const FIRST = 1;
    /** 1) A previously applied timeline has set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the current pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading
     * animations that key the same property. A subsequent timeline will set this property using a mix. */
    const HOLD_SUBSEQUENT = 2;
    /** 1) This is the first timeline to set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the setup pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading animations
     * that key the same property. A subsequent timeline will set this property using a mix. */
    const HOLD_FIRST = 3;
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry to be applied does have a timeline to set this property.
     * 3. The next track entry after that one does have a timeline to set this property.
     * 4. timelineHoldMix stores the first subsequent track entry that does not have a timeline to set this property.
     *
     * Result: The same as HOLD except the mix percentage from the timelineHoldMix track entry is used. This handles when more than
     * 2 track entries in a row have a timeline that sets the same property.
     *
     * Eg, A -> B -> C -> D where A, B, and C have a timeline setting same property, but D does not. When A is applied, to avoid
     * "dipping" A is not mixed out, however D (the first entry that doesn't set the property) mixing in is used to mix out A
     * (which affects B and C). Without using D to mix out, A would be applied fully until mixing completes, then snap into
     * place. */
    const HOLD_MIX = 4;
    const SETUP = 1;
    const CURRENT = 2;
    let _emptyAnimation = null;

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores mix (crossfade) durations to be applied when {@link AnimationState} animations are changed. */
    class AnimationStateData {
        constructor(skeletonData) {
            /** The SkeletonData to look up animations when they are specified by name. */
            this.skeletonData = null;
            this.animationToMixTime = {};
            /** The mix duration to use when no mix duration has been defined between two animations. */
            this.defaultMix = 0;
            if (!skeletonData)
                throw new Error("skeletonData cannot be null.");
            this.skeletonData = skeletonData;
        }
        /** Sets a mix duration by animation name.
         *
         * See {@link #setMixWith()}. */
        setMix(fromName, toName, duration) {
            let from = this.skeletonData.findAnimation(fromName);
            if (!from)
                throw new Error("Animation not found: " + fromName);
            let to = this.skeletonData.findAnimation(toName);
            if (!to)
                throw new Error("Animation not found: " + toName);
            this.setMixWith(from, to, duration);
        }
        /** Sets the mix duration when changing from the specified animation to the other.
         *
         * See {@link TrackEntry#mixDuration}. */
        setMixWith(from, to, duration) {
            if (!from)
                throw new Error("from cannot be null.");
            if (!to)
                throw new Error("to cannot be null.");
            let key = from.name + "." + to.name;
            this.animationToMixTime[key] = duration;
        }
        /** Returns the mix duration to use when changing from the specified animation to the other, or the {@link #defaultMix} if
          * no mix duration has been set. */
        getMix(from, to) {
            let key = from.name + "." + to.name;
            let value = this.animationToMixTime[key];
            return value === undefined ? this.defaultMix : value;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment with vertices that make up a polygon. Can be used for hit detection, creating physics bodies, spawning particle
     * effects, and more.
     *
     * See {@link SkeletonBounds} and [Bounding Boxes](http://esotericsoftware.com/spine-bounding-boxes) in the Spine User
     * Guide. */
    class BoundingBoxAttachment extends VertexAttachment {
        constructor(name) {
            super(name);
            this.color = new Color(1, 1, 1, 1);
        }
        copy() {
            let copy = new BoundingBoxAttachment(this.name);
            this.copyTo(copy);
            copy.color.setFromColor(this.color);
            return copy;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment with vertices that make up a polygon used for clipping the rendering of other attachments. */
    class ClippingAttachment extends VertexAttachment {
        constructor(name) {
            super(name);
            /** Clipping is performed between the clipping polygon's slot and the end slot. Returns null if clipping is done until the end of
             * the skeleton's rendering. */
            this.endSlot = null;
            // Nonessential.
            /** The color of the clipping polygon as it was in Spine. Available only when nonessential data was exported. Clipping polygons
             * are not usually rendered at runtime. */
            this.color = new Color(0.2275, 0.2275, 0.8078, 1); // ce3a3aff
        }
        copy() {
            let copy = new ClippingAttachment(this.name);
            this.copyTo(copy);
            copy.endSlot = this.endSlot;
            copy.color.setFromColor(this.color);
            return copy;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class Texture {
        constructor(image) {
            this._image = image;
        }
        getImage() {
            return this._image;
        }
    }
    (function (TextureFilter) {
        TextureFilter[TextureFilter["Nearest"] = 9728] = "Nearest";
        TextureFilter[TextureFilter["Linear"] = 9729] = "Linear";
        TextureFilter[TextureFilter["MipMap"] = 9987] = "MipMap";
        TextureFilter[TextureFilter["MipMapNearestNearest"] = 9984] = "MipMapNearestNearest";
        TextureFilter[TextureFilter["MipMapLinearNearest"] = 9985] = "MipMapLinearNearest";
        TextureFilter[TextureFilter["MipMapNearestLinear"] = 9986] = "MipMapNearestLinear";
        TextureFilter[TextureFilter["MipMapLinearLinear"] = 9987] = "MipMapLinearLinear"; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
    })(exports.TextureFilter || (exports.TextureFilter = {}));
    (function (TextureWrap) {
        TextureWrap[TextureWrap["MirroredRepeat"] = 33648] = "MirroredRepeat";
        TextureWrap[TextureWrap["ClampToEdge"] = 33071] = "ClampToEdge";
        TextureWrap[TextureWrap["Repeat"] = 10497] = "Repeat"; // WebGLRenderingContext.REPEAT
    })(exports.TextureWrap || (exports.TextureWrap = {}));
    class TextureRegion {
        constructor() {
            this.u = 0;
            this.v = 0;
            this.u2 = 0;
            this.v2 = 0;
            this.width = 0;
            this.height = 0;
            this.degrees = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.originalWidth = 0;
            this.originalHeight = 0;
        }
    }
    class FakeTexture extends Texture {
        setFilters(minFilter, magFilter) { }
        setWraps(uWrap, vWrap) { }
        dispose() { }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class TextureAtlas {
        constructor(atlasText) {
            this.pages = new Array();
            this.regions = new Array();
            let reader = new TextureAtlasReader(atlasText);
            let entry = new Array(4);
            let page = null;
            let region = null;
            let pageFields = {};
            pageFields["size"] = () => {
                page.width = parseInt(entry[1]);
                page.height = parseInt(entry[2]);
            };
            pageFields["format"] = () => {
                // page.format = Format[tuple[0]]; we don't need format in WebGL
            };
            pageFields["filter"] = () => {
                page.minFilter = Utils.enumValue(exports.TextureFilter, entry[1]);
                page.magFilter = Utils.enumValue(exports.TextureFilter, entry[2]);
            };
            pageFields["repeat"] = () => {
                if (entry[1].indexOf('x') != -1)
                    page.uWrap = exports.TextureWrap.Repeat;
                if (entry[1].indexOf('y') != -1)
                    page.vWrap = exports.TextureWrap.Repeat;
            };
            pageFields["pma"] = () => {
                page.pma = entry[1] == "true";
            };
            var regionFields = {};
            regionFields["xy"] = () => {
                region.x = parseInt(entry[1]);
                region.y = parseInt(entry[2]);
            };
            regionFields["size"] = () => {
                region.width = parseInt(entry[1]);
                region.height = parseInt(entry[2]);
            };
            regionFields["bounds"] = () => {
                region.x = parseInt(entry[1]);
                region.y = parseInt(entry[2]);
                region.width = parseInt(entry[3]);
                region.height = parseInt(entry[4]);
            };
            regionFields["offset"] = () => {
                region.offsetX = parseInt(entry[1]);
                region.offsetY = parseInt(entry[2]);
            };
            regionFields["orig"] = () => {
                region.originalWidth = parseInt(entry[1]);
                region.originalHeight = parseInt(entry[2]);
            };
            regionFields["offsets"] = () => {
                region.offsetX = parseInt(entry[1]);
                region.offsetY = parseInt(entry[2]);
                region.originalWidth = parseInt(entry[3]);
                region.originalHeight = parseInt(entry[4]);
            };
            regionFields["rotate"] = () => {
                let value = entry[1];
                if (value == "true")
                    region.degrees = 90;
                else if (value != "false")
                    region.degrees = parseInt(value);
            };
            regionFields["index"] = () => {
                region.index = parseInt(entry[1]);
            };
            let line = reader.readLine();
            // Ignore empty lines before first entry.
            while (line && line.trim().length == 0)
                line = reader.readLine();
            // Header entries.
            while (true) {
                if (!line || line.trim().length == 0)
                    break;
                if (reader.readEntry(entry, line) == 0)
                    break; // Silently ignore all header fields.
                line = reader.readLine();
            }
            // Page and region entries.
            let names = null;
            let values = null;
            while (true) {
                if (line === null)
                    break;
                if (line.trim().length == 0) {
                    page = null;
                    line = reader.readLine();
                }
                else if (!page) {
                    page = new TextureAtlasPage();
                    page.name = line.trim();
                    while (true) {
                        if (reader.readEntry(entry, line = reader.readLine()) == 0)
                            break;
                        let field = pageFields[entry[0]];
                        if (field)
                            field();
                    }
                    this.pages.push(page);
                }
                else {
                    region = new TextureAtlasRegion();
                    region.page = page;
                    region.name = line;
                    while (true) {
                        let count = reader.readEntry(entry, line = reader.readLine());
                        if (count == 0)
                            break;
                        let field = regionFields[entry[0]];
                        if (field)
                            field();
                        else {
                            if (!names) {
                                names = [];
                                values = [];
                            }
                            names.push(entry[0]);
                            let entryValues = [];
                            for (let i = 0; i < count; i++)
                                entryValues.push(parseInt(entry[i + 1]));
                            values.push(entryValues);
                        }
                    }
                    if (region.originalWidth == 0 && region.originalHeight == 0) {
                        region.originalWidth = region.width;
                        region.originalHeight = region.height;
                    }
                    if (names && names.length > 0) {
                        region.names = names;
                        region.values = values;
                        names = null;
                        values = null;
                    }
                    region.u = region.x / page.width;
                    region.v = region.y / page.height;
                    if (region.degrees == 90) {
                        region.u2 = (region.x + region.height) / page.width;
                        region.v2 = (region.y + region.width) / page.height;
                    }
                    else {
                        region.u2 = (region.x + region.width) / page.width;
                        region.v2 = (region.y + region.height) / page.height;
                    }
                    this.regions.push(region);
                }
            }
        }
        findRegion(name) {
            for (let i = 0; i < this.regions.length; i++) {
                if (this.regions[i].name == name) {
                    return this.regions[i];
                }
            }
            return null;
        }
        setTextures(assetManager, pathPrefix = "") {
            for (let page of this.pages)
                page.setTexture(assetManager.get(pathPrefix + page.name));
        }
        dispose() {
            for (let i = 0; i < this.pages.length; i++) {
                this.pages[i].texture.dispose();
            }
        }
    }
    class TextureAtlasReader {
        constructor(text) {
            this.lines = null;
            this.index = 0;
            this.lines = text.split(/\r\n|\r|\n/);
        }
        readLine() {
            if (this.index >= this.lines.length)
                return null;
            return this.lines[this.index++];
        }
        readEntry(entry, line) {
            if (!line)
                return 0;
            line = line.trim();
            if (line.length == 0)
                return 0;
            let colon = line.indexOf(':');
            if (colon == -1)
                return 0;
            entry[0] = line.substr(0, colon).trim();
            for (let i = 1, lastMatch = colon + 1;; i++) {
                let comma = line.indexOf(',', lastMatch);
                if (comma == -1) {
                    entry[i] = line.substr(lastMatch).trim();
                    return i;
                }
                entry[i] = line.substr(lastMatch, comma - lastMatch).trim();
                lastMatch = comma + 1;
                if (i == 4)
                    return 4;
            }
        }
    }
    class TextureAtlasPage {
        constructor() {
            this.name = null;
            this.minFilter = exports.TextureFilter.Nearest;
            this.magFilter = exports.TextureFilter.Nearest;
            this.uWrap = exports.TextureWrap.ClampToEdge;
            this.vWrap = exports.TextureWrap.ClampToEdge;
            this.texture = null;
            this.width = 0;
            this.height = 0;
            this.pma = false;
        }
        setTexture(texture) {
            this.texture = texture;
            texture.setFilters(this.minFilter, this.magFilter);
            texture.setWraps(this.uWrap, this.vWrap);
        }
    }
    class TextureAtlasRegion extends TextureRegion {
        constructor() {
            super(...arguments);
            this.page = null;
            this.name = null;
            this.x = 0;
            this.y = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.originalWidth = 0;
            this.originalHeight = 0;
            this.index = 0;
            this.degrees = 0;
            this.names = null;
            this.values = null;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment that displays a textured mesh. A mesh has hull vertices and internal vertices within the hull. Holes are not
     * supported. Each vertex has UVs (texture coordinates) and triangles are used to map an image on to the mesh.
     *
     * See [Mesh attachments](http://esotericsoftware.com/spine-meshes) in the Spine User Guide. */
    class MeshAttachment extends VertexAttachment {
        constructor(name) {
            super(name);
            this.region = null;
            /** The name of the texture region for this attachment. */
            this.path = null;
            /** The UV pair for each vertex, normalized within the texture region. */
            this.regionUVs = null;
            /** The UV pair for each vertex, normalized within the entire texture.
             *
             * See {@link #updateUVs}. */
            this.uvs = null;
            /** Triplets of vertex indices which describe the mesh's triangulation. */
            this.triangles = null;
            /** The color to tint the mesh. */
            this.color = new Color(1, 1, 1, 1);
            /** The width of the mesh's image. Available only when nonessential data was exported. */
            this.width = 0;
            /** The height of the mesh's image. Available only when nonessential data was exported. */
            this.height = 0;
            /** The number of entries at the beginning of {@link #vertices} that make up the mesh hull. */
            this.hullLength = 0;
            /** Vertex index pairs describing edges for controling triangulation. Mesh triangles will never cross edges. Only available if
             * nonessential data was exported. Triangulation is not performed at runtime. */
            this.edges = null;
            this.parentMesh = null;
            this.tempColor = new Color(0, 0, 0, 0);
        }
        /** Calculates {@link #uvs} using {@link #regionUVs} and the {@link #region}. Must be called after changing the region UVs or
         * region. */
        updateUVs() {
            let regionUVs = this.regionUVs;
            if (!this.uvs || this.uvs.length != regionUVs.length)
                this.uvs = Utils.newFloatArray(regionUVs.length);
            let uvs = this.uvs;
            let n = this.uvs.length;
            let u = this.region.u, v = this.region.v, width = 0, height = 0;
            if (this.region instanceof TextureAtlasRegion) {
                let region = this.region, image = region.page.texture.getImage();
                let textureWidth = image.width, textureHeight = image.height;
                switch (region.degrees) {
                    case 90:
                        u -= (region.originalHeight - region.offsetY - region.height) / textureWidth;
                        v -= (region.originalWidth - region.offsetX - region.width) / textureHeight;
                        width = region.originalHeight / textureWidth;
                        height = region.originalWidth / textureHeight;
                        for (let i = 0; i < n; i += 2) {
                            uvs[i] = u + regionUVs[i + 1] * width;
                            uvs[i + 1] = v + (1 - regionUVs[i]) * height;
                        }
                        return;
                    case 180:
                        u -= (region.originalWidth - region.offsetX - region.width) / textureWidth;
                        v -= region.offsetY / textureHeight;
                        width = region.originalWidth / textureWidth;
                        height = region.originalHeight / textureHeight;
                        for (let i = 0; i < n; i += 2) {
                            uvs[i] = u + (1 - regionUVs[i]) * width;
                            uvs[i + 1] = v + (1 - regionUVs[i + 1]) * height;
                        }
                        return;
                    case 270:
                        u -= region.offsetY / textureWidth;
                        v -= region.offsetX / textureHeight;
                        width = region.originalHeight / textureWidth;
                        height = region.originalWidth / textureHeight;
                        for (let i = 0; i < n; i += 2) {
                            uvs[i] = u + (1 - regionUVs[i + 1]) * width;
                            uvs[i + 1] = v + regionUVs[i] * height;
                        }
                        return;
                }
                u -= region.offsetX / textureWidth;
                v -= (region.originalHeight - region.offsetY - region.height) / textureHeight;
                width = region.originalWidth / textureWidth;
                height = region.originalHeight / textureHeight;
            }
            else if (!this.region) {
                u = v = 0;
                width = height = 1;
            }
            else {
                width = this.region.u2 - u;
                height = this.region.v2 - v;
            }
            for (let i = 0; i < n; i += 2) {
                uvs[i] = u + regionUVs[i] * width;
                uvs[i + 1] = v + regionUVs[i + 1] * height;
            }
        }
        /** The parent mesh if this is a linked mesh, else null. A linked mesh shares the {@link #bones}, {@link #vertices},
         * {@link #regionUVs}, {@link #triangles}, {@link #hullLength}, {@link #edges}, {@link #width}, and {@link #height} with the
         * parent mesh, but may have a different {@link #name} or {@link #path} (and therefore a different texture). */
        getParentMesh() {
            return this.parentMesh;
        }
        /** @param parentMesh May be null. */
        setParentMesh(parentMesh) {
            this.parentMesh = parentMesh;
            if (parentMesh) {
                this.bones = parentMesh.bones;
                this.vertices = parentMesh.vertices;
                this.worldVerticesLength = parentMesh.worldVerticesLength;
                this.regionUVs = parentMesh.regionUVs;
                this.triangles = parentMesh.triangles;
                this.hullLength = parentMesh.hullLength;
                this.worldVerticesLength = parentMesh.worldVerticesLength;
            }
        }
        copy() {
            if (this.parentMesh)
                return this.newLinkedMesh();
            let copy = new MeshAttachment(this.name);
            copy.region = this.region;
            copy.path = this.path;
            copy.color.setFromColor(this.color);
            this.copyTo(copy);
            copy.regionUVs = new Array(this.regionUVs.length);
            Utils.arrayCopy(this.regionUVs, 0, copy.regionUVs, 0, this.regionUVs.length);
            copy.uvs = new Array(this.uvs.length);
            Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, this.uvs.length);
            copy.triangles = new Array(this.triangles.length);
            Utils.arrayCopy(this.triangles, 0, copy.triangles, 0, this.triangles.length);
            copy.hullLength = this.hullLength;
            // Nonessential.
            if (this.edges) {
                copy.edges = new Array(this.edges.length);
                Utils.arrayCopy(this.edges, 0, copy.edges, 0, this.edges.length);
            }
            copy.width = this.width;
            copy.height = this.height;
            return copy;
        }
        /** Returns a new mesh with the {@link #parentMesh} set to this mesh's parent mesh, if any, else to this mesh. **/
        newLinkedMesh() {
            let copy = new MeshAttachment(this.name);
            copy.region = this.region;
            copy.path = this.path;
            copy.color.setFromColor(this.color);
            copy.deformAttachment = this.deformAttachment;
            copy.setParentMesh(this.parentMesh ? this.parentMesh : this);
            copy.updateUVs();
            return copy;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment whose vertices make up a composite Bezier curve.
     *
     * See {@link PathConstraint} and [Paths](http://esotericsoftware.com/spine-paths) in the Spine User Guide. */
    class PathAttachment extends VertexAttachment {
        constructor(name) {
            super(name);
            /** The lengths along the path in the setup pose from the start of the path to the end of each Bezier curve. */
            this.lengths = null;
            /** If true, the start and end knots are connected. */
            this.closed = false;
            /** If true, additional calculations are performed to make calculating positions along the path more accurate. If false, fewer
             * calculations are performed but calculating positions along the path is less accurate. */
            this.constantSpeed = false;
            /** The color of the path as it was in Spine. Available only when nonessential data was exported. Paths are not usually
             * rendered at runtime. */
            this.color = new Color(1, 1, 1, 1);
        }
        copy() {
            let copy = new PathAttachment(this.name);
            this.copyTo(copy);
            copy.lengths = new Array(this.lengths.length);
            Utils.arrayCopy(this.lengths, 0, copy.lengths, 0, this.lengths.length);
            copy.closed = closed;
            copy.constantSpeed = this.constantSpeed;
            copy.color.setFromColor(this.color);
            return copy;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment which is a single point and a rotation. This can be used to spawn projectiles, particles, etc. A bone can be
     * used in similar ways, but a PointAttachment is slightly less expensive to compute and can be hidden, shown, and placed in a
     * skin.
     *
     * See [Point Attachments](http://esotericsoftware.com/spine-point-attachments) in the Spine User Guide. */
    class PointAttachment extends VertexAttachment {
        constructor(name) {
            super(name);
            this.x = 0;
            this.y = 0;
            this.rotation = 0;
            /** The color of the point attachment as it was in Spine. Available only when nonessential data was exported. Point attachments
             * are not usually rendered at runtime. */
            this.color = new Color(0.38, 0.94, 0, 1);
        }
        computeWorldPosition(bone, point) {
            point.x = this.x * bone.a + this.y * bone.b + bone.worldX;
            point.y = this.x * bone.c + this.y * bone.d + bone.worldY;
            return point;
        }
        computeWorldRotation(bone) {
            let cos = MathUtils.cosDeg(this.rotation), sin = MathUtils.sinDeg(this.rotation);
            let x = cos * bone.a + sin * bone.b;
            let y = cos * bone.c + sin * bone.d;
            return Math.atan2(y, x) * MathUtils.radDeg;
        }
        copy() {
            let copy = new PointAttachment(this.name);
            copy.x = this.x;
            copy.y = this.y;
            copy.rotation = this.rotation;
            copy.color.setFromColor(this.color);
            return copy;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An attachment that displays a textured quadrilateral.
     *
     * See [Region attachments](http://esotericsoftware.com/spine-regions) in the Spine User Guide. */
    class RegionAttachment extends Attachment {
        constructor(name) {
            super(name);
            /** The local x translation. */
            this.x = 0;
            /** The local y translation. */
            this.y = 0;
            /** The local scaleX. */
            this.scaleX = 1;
            /** The local scaleY. */
            this.scaleY = 1;
            /** The local rotation. */
            this.rotation = 0;
            /** The width of the region attachment in Spine. */
            this.width = 0;
            /** The height of the region attachment in Spine. */
            this.height = 0;
            /** The color to tint the region attachment. */
            this.color = new Color(1, 1, 1, 1);
            /** The name of the texture region for this attachment. */
            this.path = null;
            this.rendererObject = null;
            this.region = null;
            /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
             *
             * See {@link #updateOffset()}. */
            this.offset = Utils.newFloatArray(8);
            this.uvs = Utils.newFloatArray(8);
            this.tempColor = new Color(1, 1, 1, 1);
        }
        /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
        updateOffset() {
            let region = this.region;
            let regionScaleX = this.width / this.region.originalWidth * this.scaleX;
            let regionScaleY = this.height / this.region.originalHeight * this.scaleY;
            let localX = -this.width / 2 * this.scaleX + this.region.offsetX * regionScaleX;
            let localY = -this.height / 2 * this.scaleY + this.region.offsetY * regionScaleY;
            let localX2 = localX + this.region.width * regionScaleX;
            let localY2 = localY + this.region.height * regionScaleY;
            let radians = this.rotation * Math.PI / 180;
            let cos = Math.cos(radians);
            let sin = Math.sin(radians);
            let x = this.x, y = this.y;
            let localXCos = localX * cos + x;
            let localXSin = localX * sin;
            let localYCos = localY * cos + y;
            let localYSin = localY * sin;
            let localX2Cos = localX2 * cos + x;
            let localX2Sin = localX2 * sin;
            let localY2Cos = localY2 * cos + y;
            let localY2Sin = localY2 * sin;
            let offset = this.offset;
            offset[0] = localXCos - localYSin;
            offset[1] = localYCos + localXSin;
            offset[2] = localXCos - localY2Sin;
            offset[3] = localY2Cos + localXSin;
            offset[4] = localX2Cos - localY2Sin;
            offset[5] = localY2Cos + localX2Sin;
            offset[6] = localX2Cos - localYSin;
            offset[7] = localYCos + localX2Sin;
        }
        setRegion(region) {
            this.region = region;
            let uvs = this.uvs;
            if (region.degrees == 90) {
                uvs[2] = region.u;
                uvs[3] = region.v2;
                uvs[4] = region.u;
                uvs[5] = region.v;
                uvs[6] = region.u2;
                uvs[7] = region.v;
                uvs[0] = region.u2;
                uvs[1] = region.v2;
            }
            else {
                uvs[0] = region.u;
                uvs[1] = region.v2;
                uvs[2] = region.u;
                uvs[3] = region.v;
                uvs[4] = region.u2;
                uvs[5] = region.v;
                uvs[6] = region.u2;
                uvs[7] = region.v2;
            }
        }
        /** Transforms the attachment's four vertices to world coordinates.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide.
         * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
         * @param offset The `worldVertices` index to begin writing values.
         * @param stride The number of `worldVertices` entries between the value pairs written. */
        computeWorldVertices(bone, worldVertices, offset, stride) {
            let vertexOffset = this.offset;
            let x = bone.worldX, y = bone.worldY;
            let a = bone.a, b = bone.b, c = bone.c, d = bone.d;
            let offsetX = 0, offsetY = 0;
            offsetX = vertexOffset[0];
            offsetY = vertexOffset[1];
            worldVertices[offset] = offsetX * a + offsetY * b + x; // br
            worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
            offset += stride;
            offsetX = vertexOffset[2];
            offsetY = vertexOffset[3];
            worldVertices[offset] = offsetX * a + offsetY * b + x; // bl
            worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
            offset += stride;
            offsetX = vertexOffset[4];
            offsetY = vertexOffset[5];
            worldVertices[offset] = offsetX * a + offsetY * b + x; // ul
            worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
            offset += stride;
            offsetX = vertexOffset[6];
            offsetY = vertexOffset[7];
            worldVertices[offset] = offsetX * a + offsetY * b + x; // ur
            worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        }
        copy() {
            let copy = new RegionAttachment(this.name);
            copy.region = this.region;
            copy.rendererObject = this.rendererObject;
            copy.path = this.path;
            copy.x = this.x;
            copy.y = this.y;
            copy.scaleX = this.scaleX;
            copy.scaleY = this.scaleY;
            copy.rotation = this.rotation;
            copy.width = this.width;
            copy.height = this.height;
            Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, 8);
            Utils.arrayCopy(this.offset, 0, copy.offset, 0, 8);
            copy.color.setFromColor(this.color);
            return copy;
        }
    }
    RegionAttachment.X1 = 0;
    RegionAttachment.Y1 = 1;
    RegionAttachment.C1R = 2;
    RegionAttachment.C1G = 3;
    RegionAttachment.C1B = 4;
    RegionAttachment.C1A = 5;
    RegionAttachment.U1 = 6;
    RegionAttachment.V1 = 7;
    RegionAttachment.X2 = 8;
    RegionAttachment.Y2 = 9;
    RegionAttachment.C2R = 10;
    RegionAttachment.C2G = 11;
    RegionAttachment.C2B = 12;
    RegionAttachment.C2A = 13;
    RegionAttachment.U2 = 14;
    RegionAttachment.V2 = 15;
    RegionAttachment.X3 = 16;
    RegionAttachment.Y3 = 17;
    RegionAttachment.C3R = 18;
    RegionAttachment.C3G = 19;
    RegionAttachment.C3B = 20;
    RegionAttachment.C3A = 21;
    RegionAttachment.U3 = 22;
    RegionAttachment.V3 = 23;
    RegionAttachment.X4 = 24;
    RegionAttachment.Y4 = 25;
    RegionAttachment.C4R = 26;
    RegionAttachment.C4G = 27;
    RegionAttachment.C4B = 28;
    RegionAttachment.C4A = 29;
    RegionAttachment.U4 = 30;
    RegionAttachment.V4 = 31;

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** An {@link AttachmentLoader} that configures attachments using texture regions from an {@link TextureAtlas}.
     *
     * See [Loading skeleton data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the
     * Spine Runtimes Guide. */
    class AtlasAttachmentLoader {
        constructor(atlas) {
            this.atlas = null;
            this.atlas = atlas;
        }
        newRegionAttachment(skin, name, path) {
            let region = this.atlas.findRegion(path);
            if (!region)
                throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
            region.renderObject = region;
            let attachment = new RegionAttachment(name);
            attachment.setRegion(region);
            return attachment;
        }
        newMeshAttachment(skin, name, path) {
            let region = this.atlas.findRegion(path);
            if (!region)
                throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
            region.renderObject = region;
            let attachment = new MeshAttachment(name);
            attachment.region = region;
            return attachment;
        }
        newBoundingBoxAttachment(skin, name) {
            return new BoundingBoxAttachment(name);
        }
        newPathAttachment(skin, name) {
            return new PathAttachment(name);
        }
        newPointAttachment(skin, name) {
            return new PointAttachment(name);
        }
        newClippingAttachment(skin, name) {
            return new ClippingAttachment(name);
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose for a {@link Bone}. */
    class BoneData {
        constructor(index, name, parent) {
            /** The index of the bone in {@link Skeleton#getBones()}. */
            this.index = 0;
            /** The name of the bone, which is unique across all bones in the skeleton. */
            this.name = null;
            /** @returns May be null. */
            this.parent = null;
            /** The bone's length. */
            this.length = 0;
            /** The local x translation. */
            this.x = 0;
            /** The local y translation. */
            this.y = 0;
            /** The local rotation. */
            this.rotation = 0;
            /** The local scaleX. */
            this.scaleX = 1;
            /** The local scaleY. */
            this.scaleY = 1;
            /** The local shearX. */
            this.shearX = 0;
            /** The local shearX. */
            this.shearY = 0;
            /** The transform mode for how parent world transforms affect this bone. */
            this.transformMode = exports.TransformMode.Normal;
            /** When true, {@link Skeleton#updateWorldTransform()} only updates this bone if the {@link Skeleton#skin} contains this
              * bone.
              * @see Skin#bones */
            this.skinRequired = false;
            /** The color of the bone as it was in Spine. Available only when nonessential data was exported. Bones are not usually
             * rendered at runtime. */
            this.color = new Color();
            if (index < 0)
                throw new Error("index must be >= 0.");
            if (!name)
                throw new Error("name cannot be null.");
            this.index = index;
            this.name = name;
            this.parent = parent;
        }
    }
    (function (TransformMode) {
        TransformMode[TransformMode["Normal"] = 0] = "Normal";
        TransformMode[TransformMode["OnlyTranslation"] = 1] = "OnlyTranslation";
        TransformMode[TransformMode["NoRotationOrReflection"] = 2] = "NoRotationOrReflection";
        TransformMode[TransformMode["NoScale"] = 3] = "NoScale";
        TransformMode[TransformMode["NoScaleOrReflection"] = 4] = "NoScaleOrReflection";
    })(exports.TransformMode || (exports.TransformMode = {}));

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores a bone's current pose.
     *
     * A bone has a local transform which is used to compute its world transform. A bone also has an applied transform, which is a
     * local transform that can be applied to compute the world transform. The local transform and applied transform may differ if a
     * constraint or application code modifies the world transform after it was computed from the local transform. */
    class Bone {
        /** @param parent May be null. */
        constructor(data, skeleton, parent) {
            /** The bone's setup pose data. */
            this.data = null;
            /** The skeleton this bone belongs to. */
            this.skeleton = null;
            /** The parent bone, or null if this is the root bone. */
            this.parent = null;
            /** The immediate children of this bone. */
            this.children = new Array();
            /** The local x translation. */
            this.x = 0;
            /** The local y translation. */
            this.y = 0;
            /** The local rotation in degrees, counter clockwise. */
            this.rotation = 0;
            /** The local scaleX. */
            this.scaleX = 0;
            /** The local scaleY. */
            this.scaleY = 0;
            /** The local shearX. */
            this.shearX = 0;
            /** The local shearY. */
            this.shearY = 0;
            /** The applied local x translation. */
            this.ax = 0;
            /** The applied local y translation. */
            this.ay = 0;
            /** The applied local rotation in degrees, counter clockwise. */
            this.arotation = 0;
            /** The applied local scaleX. */
            this.ascaleX = 0;
            /** The applied local scaleY. */
            this.ascaleY = 0;
            /** The applied local shearX. */
            this.ashearX = 0;
            /** The applied local shearY. */
            this.ashearY = 0;
            /** Part of the world transform matrix for the X axis. If changed, {@link #updateAppliedTransform()} should be called. */
            this.a = 0;
            /** Part of the world transform matrix for the Y axis. If changed, {@link #updateAppliedTransform()} should be called. */
            this.b = 0;
            /** Part of the world transform matrix for the X axis. If changed, {@link #updateAppliedTransform()} should be called. */
            this.c = 0;
            /** Part of the world transform matrix for the Y axis. If changed, {@link #updateAppliedTransform()} should be called. */
            this.d = 0;
            /** The world X position. If changed, {@link #updateAppliedTransform()} should be called. */
            this.worldY = 0;
            /** The world Y position. If changed, {@link #updateAppliedTransform()} should be called. */
            this.worldX = 0;
            this.sorted = false;
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.skeleton = skeleton;
            this.parent = parent;
            this.setToSetupPose();
        }
        /** Returns false when the bone has not been computed because {@link BoneData#skinRequired} is true and the
          * {@link Skeleton#skin active skin} does not {@link Skin#bones contain} this bone. */
        isActive() {
            return this.active;
        }
        /** Computes the world transform using the parent bone and this bone's local applied transform. */
        update() {
            this.updateWorldTransformWith(this.ax, this.ay, this.arotation, this.ascaleX, this.ascaleY, this.ashearX, this.ashearY);
        }
        /** Computes the world transform using the parent bone and this bone's local transform.
         *
         * See {@link #updateWorldTransformWith()}. */
        updateWorldTransform() {
            this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
        }
        /** Computes the world transform using the parent bone and the specified local transform. The applied transform is set to the
         * specified local transform. Child bones are not updated.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide. */
        updateWorldTransformWith(x, y, rotation, scaleX, scaleY, shearX, shearY) {
            this.ax = x;
            this.ay = y;
            this.arotation = rotation;
            this.ascaleX = scaleX;
            this.ascaleY = scaleY;
            this.ashearX = shearX;
            this.ashearY = shearY;
            let parent = this.parent;
            if (!parent) { // Root bone.
                let skeleton = this.skeleton;
                let rotationY = rotation + 90 + shearY;
                let sx = skeleton.scaleX;
                let sy = skeleton.scaleY;
                this.a = MathUtils.cosDeg(rotation + shearX) * scaleX * sx;
                this.b = MathUtils.cosDeg(rotationY) * scaleY * sx;
                this.c = MathUtils.sinDeg(rotation + shearX) * scaleX * sy;
                this.d = MathUtils.sinDeg(rotationY) * scaleY * sy;
                this.worldX = x * sx + skeleton.x;
                this.worldY = y * sy + skeleton.y;
                return;
            }
            let pa = parent.a, pb = parent.b, pc = parent.c, pd = parent.d;
            this.worldX = pa * x + pb * y + parent.worldX;
            this.worldY = pc * x + pd * y + parent.worldY;
            switch (this.data.transformMode) {
                case exports.TransformMode.Normal: {
                    let rotationY = rotation + 90 + shearY;
                    let la = MathUtils.cosDeg(rotation + shearX) * scaleX;
                    let lb = MathUtils.cosDeg(rotationY) * scaleY;
                    let lc = MathUtils.sinDeg(rotation + shearX) * scaleX;
                    let ld = MathUtils.sinDeg(rotationY) * scaleY;
                    this.a = pa * la + pb * lc;
                    this.b = pa * lb + pb * ld;
                    this.c = pc * la + pd * lc;
                    this.d = pc * lb + pd * ld;
                    return;
                }
                case exports.TransformMode.OnlyTranslation: {
                    let rotationY = rotation + 90 + shearY;
                    this.a = MathUtils.cosDeg(rotation + shearX) * scaleX;
                    this.b = MathUtils.cosDeg(rotationY) * scaleY;
                    this.c = MathUtils.sinDeg(rotation + shearX) * scaleX;
                    this.d = MathUtils.sinDeg(rotationY) * scaleY;
                    break;
                }
                case exports.TransformMode.NoRotationOrReflection: {
                    let s = pa * pa + pc * pc;
                    let prx = 0;
                    if (s > 0.0001) {
                        s = Math.abs(pa * pd - pb * pc) / s;
                        pa /= this.skeleton.scaleX;
                        pc /= this.skeleton.scaleY;
                        pb = pc * s;
                        pd = pa * s;
                        prx = Math.atan2(pc, pa) * MathUtils.radDeg;
                    }
                    else {
                        pa = 0;
                        pc = 0;
                        prx = 90 - Math.atan2(pd, pb) * MathUtils.radDeg;
                    }
                    let rx = rotation + shearX - prx;
                    let ry = rotation + shearY - prx + 90;
                    let la = MathUtils.cosDeg(rx) * scaleX;
                    let lb = MathUtils.cosDeg(ry) * scaleY;
                    let lc = MathUtils.sinDeg(rx) * scaleX;
                    let ld = MathUtils.sinDeg(ry) * scaleY;
                    this.a = pa * la - pb * lc;
                    this.b = pa * lb - pb * ld;
                    this.c = pc * la + pd * lc;
                    this.d = pc * lb + pd * ld;
                    break;
                }
                case exports.TransformMode.NoScale:
                case exports.TransformMode.NoScaleOrReflection: {
                    let cos = MathUtils.cosDeg(rotation);
                    let sin = MathUtils.sinDeg(rotation);
                    let za = (pa * cos + pb * sin) / this.skeleton.scaleX;
                    let zc = (pc * cos + pd * sin) / this.skeleton.scaleY;
                    let s = Math.sqrt(za * za + zc * zc);
                    if (s > 0.00001)
                        s = 1 / s;
                    za *= s;
                    zc *= s;
                    s = Math.sqrt(za * za + zc * zc);
                    if (this.data.transformMode == exports.TransformMode.NoScale
                        && (pa * pd - pb * pc < 0) != (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0))
                        s = -s;
                    let r = Math.PI / 2 + Math.atan2(zc, za);
                    let zb = Math.cos(r) * s;
                    let zd = Math.sin(r) * s;
                    let la = MathUtils.cosDeg(shearX) * scaleX;
                    let lb = MathUtils.cosDeg(90 + shearY) * scaleY;
                    let lc = MathUtils.sinDeg(shearX) * scaleX;
                    let ld = MathUtils.sinDeg(90 + shearY) * scaleY;
                    this.a = za * la + zb * lc;
                    this.b = za * lb + zb * ld;
                    this.c = zc * la + zd * lc;
                    this.d = zc * lb + zd * ld;
                    break;
                }
            }
            this.a *= this.skeleton.scaleX;
            this.b *= this.skeleton.scaleX;
            this.c *= this.skeleton.scaleY;
            this.d *= this.skeleton.scaleY;
        }
        /** Sets this bone's local transform to the setup pose. */
        setToSetupPose() {
            let data = this.data;
            this.x = data.x;
            this.y = data.y;
            this.rotation = data.rotation;
            this.scaleX = data.scaleX;
            this.scaleY = data.scaleY;
            this.shearX = data.shearX;
            this.shearY = data.shearY;
        }
        /** The world rotation for the X axis, calculated using {@link #a} and {@link #c}. */
        getWorldRotationX() {
            return Math.atan2(this.c, this.a) * MathUtils.radDeg;
        }
        /** The world rotation for the Y axis, calculated using {@link #b} and {@link #d}. */
        getWorldRotationY() {
            return Math.atan2(this.d, this.b) * MathUtils.radDeg;
        }
        /** The magnitude (always positive) of the world scale X, calculated using {@link #a} and {@link #c}. */
        getWorldScaleX() {
            return Math.sqrt(this.a * this.a + this.c * this.c);
        }
        /** The magnitude (always positive) of the world scale Y, calculated using {@link #b} and {@link #d}. */
        getWorldScaleY() {
            return Math.sqrt(this.b * this.b + this.d * this.d);
        }
        /** Computes the applied transform values from the world transform.
         *
         * If the world transform is modified (by a constraint, {@link #rotateWorld(float)}, etc) then this method should be called so
         * the applied transform matches the world transform. The applied transform may be needed by other code (eg to apply other
         * constraints).
         *
         * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. The applied transform after
         * calling this method is equivalent to the local transform used to compute the world transform, but may not be identical. */
        updateAppliedTransform() {
            let parent = this.parent;
            if (!parent) {
                this.ax = this.worldX - this.skeleton.x;
                this.ay = this.worldY - this.skeleton.y;
                this.arotation = Math.atan2(this.c, this.a) * MathUtils.radDeg;
                this.ascaleX = Math.sqrt(this.a * this.a + this.c * this.c);
                this.ascaleY = Math.sqrt(this.b * this.b + this.d * this.d);
                this.ashearX = 0;
                this.ashearY = Math.atan2(this.a * this.b + this.c * this.d, this.a * this.d - this.b * this.c) * MathUtils.radDeg;
                return;
            }
            let pa = parent.a, pb = parent.b, pc = parent.c, pd = parent.d;
            let pid = 1 / (pa * pd - pb * pc);
            let dx = this.worldX - parent.worldX, dy = this.worldY - parent.worldY;
            this.ax = (dx * pd * pid - dy * pb * pid);
            this.ay = (dy * pa * pid - dx * pc * pid);
            let ia = pid * pd;
            let id = pid * pa;
            let ib = pid * pb;
            let ic = pid * pc;
            let ra = ia * this.a - ib * this.c;
            let rb = ia * this.b - ib * this.d;
            let rc = id * this.c - ic * this.a;
            let rd = id * this.d - ic * this.b;
            this.ashearX = 0;
            this.ascaleX = Math.sqrt(ra * ra + rc * rc);
            if (this.ascaleX > 0.0001) {
                let det = ra * rd - rb * rc;
                this.ascaleY = det / this.ascaleX;
                this.ashearY = Math.atan2(ra * rb + rc * rd, det) * MathUtils.radDeg;
                this.arotation = Math.atan2(rc, ra) * MathUtils.radDeg;
            }
            else {
                this.ascaleX = 0;
                this.ascaleY = Math.sqrt(rb * rb + rd * rd);
                this.ashearY = 0;
                this.arotation = 90 - Math.atan2(rd, rb) * MathUtils.radDeg;
            }
        }
        /** Transforms a point from world coordinates to the bone's local coordinates. */
        worldToLocal(world) {
            let invDet = 1 / (this.a * this.d - this.b * this.c);
            let x = world.x - this.worldX, y = world.y - this.worldY;
            world.x = x * this.d * invDet - y * this.b * invDet;
            world.y = y * this.a * invDet - x * this.c * invDet;
            return world;
        }
        /** Transforms a point from the bone's local coordinates to world coordinates. */
        localToWorld(local) {
            let x = local.x, y = local.y;
            local.x = x * this.a + y * this.b + this.worldX;
            local.y = x * this.c + y * this.d + this.worldY;
            return local;
        }
        /** Transforms a world rotation to a local rotation. */
        worldToLocalRotation(worldRotation) {
            let sin = MathUtils.sinDeg(worldRotation), cos = MathUtils.cosDeg(worldRotation);
            return Math.atan2(this.a * sin - this.c * cos, this.d * cos - this.b * sin) * MathUtils.radDeg + this.rotation - this.shearX;
        }
        /** Transforms a local rotation to a world rotation. */
        localToWorldRotation(localRotation) {
            localRotation -= this.rotation - this.shearX;
            let sin = MathUtils.sinDeg(localRotation), cos = MathUtils.cosDeg(localRotation);
            return Math.atan2(cos * this.c + sin * this.d, cos * this.a + sin * this.b) * MathUtils.radDeg;
        }
        /** Rotates the world transform the specified amount.
         * <p>
         * After changes are made to the world transform, {@link #updateAppliedTransform()} should be called and {@link #update()} will
         * need to be called on any child bones, recursively. */
        rotateWorld(degrees) {
            let a = this.a, b = this.b, c = this.c, d = this.d;
            let cos = MathUtils.cosDeg(degrees), sin = MathUtils.sinDeg(degrees);
            this.a = cos * a - sin * c;
            this.b = cos * b - sin * d;
            this.c = sin * a + cos * c;
            this.d = sin * b + cos * d;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** The base class for all constraint datas. */
    class ConstraintData {
        constructor(name, order, skinRequired) {
            this.name = name;
            this.order = order;
            this.skinRequired = skinRequired;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class AssetManagerBase {
        constructor(textureLoader, pathPrefix = "", downloader = null) {
            this.pathPrefix = null;
            this.assets = {};
            this.errors = {};
            this.toLoad = 0;
            this.loaded = 0;
            this.textureLoader = textureLoader;
            this.pathPrefix = pathPrefix;
            this.downloader = downloader || new Downloader();
        }
        start(path) {
            this.toLoad++;
            return this.pathPrefix + path;
        }
        success(callback, path, asset) {
            this.toLoad--;
            this.loaded++;
            this.assets[path] = asset;
            if (callback)
                callback(path, asset);
        }
        error(callback, path, message) {
            this.toLoad--;
            this.loaded++;
            this.errors[path] = message;
            if (callback)
                callback(path, message);
        }
        setRawDataURI(path, data) {
            this.downloader.rawDataUris[this.pathPrefix + path] = data;
        }
        loadBinary(path, success = null, error = null) {
            path = this.start(path);
            this.downloader.downloadBinary(path, (data) => {
                this.success(success, path, data);
            }, (status, responseText) => {
                this.error(error, path, `Couldn't load binary ${path}: status ${status}, ${responseText}`);
            });
        }
        loadText(path, success = null, error = null) {
            path = this.start(path);
            this.downloader.downloadText(path, (data) => {
                this.success(success, path, data);
            }, (status, responseText) => {
                this.error(error, path, `Couldn't load text ${path}: status ${status}, ${responseText}`);
            });
        }
        loadJson(path, success = null, error = null) {
            path = this.start(path);
            this.downloader.downloadJson(path, (data) => {
                this.success(success, path, data);
            }, (status, responseText) => {
                this.error(error, path, `Couldn't load JSON ${path}: status ${status}, ${responseText}`);
            });
        }
        loadTexture(path, success = null, error = null) {
            path = this.start(path);
            let isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document);
            let isWebWorker = !isBrowser; // && typeof importScripts !== 'undefined';
            if (isWebWorker) {
                fetch(path, { mode: "cors" }).then((response) => {
                    if (response.ok)
                        return response.blob();
                    this.error(error, path, `Couldn't load image: ${path}`);
                    return null;
                }).then((blob) => {
                    return blob ? createImageBitmap(blob, { premultiplyAlpha: "none", colorSpaceConversion: "none" }) : null;
                }).then((bitmap) => {
                    if (bitmap)
                        this.success(success, path, this.textureLoader(bitmap));
                });
            }
            else {
                let image = new Image();
                image.crossOrigin = "anonymous";
                image.onload = () => {
                    this.success(success, path, this.textureLoader(image));
                };
                image.onerror = () => {
                    this.error(error, path, `Couldn't load image: ${path}`);
                };
                if (this.downloader.rawDataUris[path])
                    path = this.downloader.rawDataUris[path];
                image.src = path;
            }
        }
        loadTextureAtlas(path, success = null, error = null, fileAlias = null) {
            let index = path.lastIndexOf("/");
            let parent = index >= 0 ? path.substring(0, index + 1) : "";
            path = this.start(path);
            this.downloader.downloadText(path, (atlasText) => {
                try {
                    let atlas = new TextureAtlas(atlasText);
                    let toLoad = atlas.pages.length, abort = false;
                    for (let page of atlas.pages) {
                        this.loadTexture(fileAlias == null ? parent + page.name : fileAlias[page.name], (imagePath, texture) => {
                            if (!abort) {
                                page.setTexture(texture);
                                if (--toLoad == 0)
                                    this.success(success, path, atlas);
                            }
                        }, (imagePath, message) => {
                            if (!abort)
                                this.error(error, path, `Couldn't load texture atlas ${path} page image: ${imagePath}`);
                            abort = true;
                        });
                    }
                }
                catch (e) {
                    this.error(error, path, `Couldn't parse texture atlas ${path}: ${e.message}`);
                }
            }, (status, responseText) => {
                this.error(error, path, `Couldn't load texture atlas ${path}: status ${status}, ${responseText}`);
            });
        }
        get(path) {
            return this.assets[this.pathPrefix + path];
        }
        require(path) {
            path = this.pathPrefix + path;
            let asset = this.assets[path];
            if (asset)
                return asset;
            let error = this.errors[path];
            throw Error("Asset not found: " + path + (error ? "\n" + error : ""));
        }
        remove(path) {
            path = this.pathPrefix + path;
            let asset = this.assets[path];
            if (asset.dispose)
                asset.dispose();
            delete this.assets[path];
            return asset;
        }
        removeAll() {
            for (let key in this.assets) {
                let asset = this.assets[key];
                if (asset.dispose)
                    asset.dispose();
            }
            this.assets = {};
        }
        isLoadingComplete() {
            return this.toLoad == 0;
        }
        getToLoad() {
            return this.toLoad;
        }
        getLoaded() {
            return this.loaded;
        }
        dispose() {
            this.removeAll();
        }
        hasErrors() {
            return Object.keys(this.errors).length > 0;
        }
        getErrors() {
            return this.errors;
        }
    }
    class Downloader {
        constructor() {
            this.callbacks = {};
            this.rawDataUris = {};
        }
        dataUriToString(dataUri) {
            if (!dataUri.startsWith("data:")) {
                throw new Error("Not a data URI.");
            }
            let base64Idx = dataUri.indexOf("base64,");
            if (base64Idx != -1) {
                base64Idx += "base64,".length;
                return atob(dataUri.substr(base64Idx));
            }
            else {
                return dataUri.substr(dataUri.indexOf(",") + 1);
            }
        }
        base64ToUint8Array(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        }
        dataUriToUint8Array(dataUri) {
            if (!dataUri.startsWith("data:")) {
                throw new Error("Not a data URI.");
            }
            let base64Idx = dataUri.indexOf("base64,");
            if (base64Idx == -1)
                throw new Error("Not a binary data URI.");
            base64Idx += "base64,".length;
            return this.base64ToUint8Array(dataUri.substr(base64Idx));
        }
        downloadText(url, success, error) {
            if (this.start(url, success, error))
                return;
            if (this.rawDataUris[url]) {
                try {
                    let dataUri = this.rawDataUris[url];
                    this.finish(url, 200, this.dataUriToString(dataUri));
                }
                catch (e) {
                    this.finish(url, 400, JSON.stringify(e));
                }
                return;
            }
            let request = new XMLHttpRequest();
            request.overrideMimeType("text/html");
            request.open("GET", url, true);
            let done = () => {
                this.finish(url, request.status, request.responseText);
            };
            request.onload = done;
            request.onerror = done;
            request.send();
        }
        downloadJson(url, success, error) {
            this.downloadText(url, (data) => {
                success(JSON.parse(data));
            }, error);
        }
        downloadBinary(url, success, error) {
            if (this.start(url, success, error))
                return;
            if (this.rawDataUris[url]) {
                try {
                    let dataUri = this.rawDataUris[url];
                    this.finish(url, 200, this.dataUriToUint8Array(dataUri));
                }
                catch (e) {
                    this.finish(url, 400, JSON.stringify(e));
                }
                return;
            }
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            let onerror = () => {
                this.finish(url, request.status, request.response);
            };
            request.onload = () => {
                if (request.status == 200 || request.status == 0)
                    this.finish(url, 200, new Uint8Array(request.response));
                else
                    onerror();
            };
            request.onerror = onerror;
            request.send();
        }
        start(url, success, error) {
            let callbacks = this.callbacks[url];
            try {
                if (callbacks)
                    return true;
                this.callbacks[url] = callbacks = [];
            }
            finally {
                callbacks.push(success, error);
            }
        }
        finish(url, status, data) {
            let callbacks = this.callbacks[url];
            delete this.callbacks[url];
            let args = status == 200 || status == 0 ? [data] : [status, data];
            for (let i = args.length - 1, n = callbacks.length; i < n; i += 2)
                callbacks[i].apply(null, args);
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the current pose values for an {@link Event}.
     *
     * See Timeline {@link Timeline#apply()},
     * AnimationStateListener {@link AnimationStateListener#event()}, and
     * [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide. */
    class Event {
        constructor(time, data) {
            this.data = null;
            this.intValue = 0;
            this.floatValue = 0;
            this.stringValue = null;
            this.time = 0;
            this.volume = 0;
            this.balance = 0;
            if (!data)
                throw new Error("data cannot be null.");
            this.time = time;
            this.data = data;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose values for an {@link Event}.
     *
     * See [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide. */
    class EventData {
        constructor(name) {
            this.name = null;
            this.intValue = 0;
            this.floatValue = 0;
            this.stringValue = null;
            this.audioPath = null;
            this.volume = 0;
            this.balance = 0;
            this.name = name;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the current pose for an IK constraint. An IK constraint adjusts the rotation of 1 or 2 constrained bones so the tip of
     * the last bone is as close to the target bone as possible.
     *
     * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide. */
    class IkConstraint {
        constructor(data, skeleton) {
            /** The IK constraint's setup pose data. */
            this.data = null;
            /** The bones that will be modified by this IK constraint. */
            this.bones = null;
            /** The bone that is the IK target. */
            this.target = null;
            /** Controls the bend direction of the IK bones, either 1 or -1. */
            this.bendDirection = 0;
            /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
            this.compress = false;
            /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
             * and the parent bone has local nonuniform scale, stretch is not applied. */
            this.stretch = false;
            /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
            this.mix = 1;
            /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
            this.softness = 0;
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.mix = data.mix;
            this.softness = data.softness;
            this.bendDirection = data.bendDirection;
            this.compress = data.compress;
            this.stretch = data.stretch;
            this.bones = new Array();
            for (let i = 0; i < data.bones.length; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findBone(data.target.name);
        }
        isActive() {
            return this.active;
        }
        update() {
            if (this.mix == 0)
                return;
            let target = this.target;
            let bones = this.bones;
            switch (bones.length) {
                case 1:
                    this.apply1(bones[0], target.worldX, target.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
                    break;
                case 2:
                    this.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.stretch, this.data.uniform, this.softness, this.mix);
                    break;
            }
        }
        /** Applies 1 bone IK. The target is specified in the world coordinate system. */
        apply1(bone, targetX, targetY, compress, stretch, uniform, alpha) {
            let p = bone.parent;
            let pa = p.a, pb = p.b, pc = p.c, pd = p.d;
            let rotationIK = -bone.ashearX - bone.arotation, tx = 0, ty = 0;
            switch (bone.data.transformMode) {
                case exports.TransformMode.OnlyTranslation:
                    tx = targetX - bone.worldX;
                    ty = targetY - bone.worldY;
                    break;
                case exports.TransformMode.NoRotationOrReflection:
                    let s = Math.abs(pa * pd - pb * pc) / (pa * pa + pc * pc);
                    let sa = pa / bone.skeleton.scaleX;
                    let sc = pc / bone.skeleton.scaleY;
                    pb = -sc * s * bone.skeleton.scaleX;
                    pd = sa * s * bone.skeleton.scaleY;
                    rotationIK += Math.atan2(sc, sa) * MathUtils.radDeg;
                // Fall through
                default:
                    let x = targetX - p.worldX, y = targetY - p.worldY;
                    let d = pa * pd - pb * pc;
                    tx = (x * pd - y * pb) / d - bone.ax;
                    ty = (y * pa - x * pc) / d - bone.ay;
            }
            rotationIK += Math.atan2(ty, tx) * MathUtils.radDeg;
            if (bone.ascaleX < 0)
                rotationIK += 180;
            if (rotationIK > 180)
                rotationIK -= 360;
            else if (rotationIK < -180)
                rotationIK += 360;
            let sx = bone.ascaleX, sy = bone.ascaleY;
            if (compress || stretch) {
                switch (bone.data.transformMode) {
                    case exports.TransformMode.NoScale:
                    case exports.TransformMode.NoScaleOrReflection:
                        tx = targetX - bone.worldX;
                        ty = targetY - bone.worldY;
                }
                let b = bone.data.length * sx, dd = Math.sqrt(tx * tx + ty * ty);
                if ((compress && dd < b) || (stretch && dd > b) && b > 0.0001) {
                    let s = (dd / b - 1) * alpha + 1;
                    sx *= s;
                    if (uniform)
                        sy *= s;
                }
            }
            bone.updateWorldTransformWith(bone.ax, bone.ay, bone.arotation + rotationIK * alpha, sx, sy, bone.ashearX, bone.ashearY);
        }
        /** Applies 2 bone IK. The target is specified in the world coordinate system.
         * @param child A direct descendant of the parent bone. */
        apply2(parent, child, targetX, targetY, bendDir, stretch, uniform, softness, alpha) {
            let px = parent.ax, py = parent.ay, psx = parent.ascaleX, psy = parent.ascaleY, sx = psx, sy = psy, csx = child.ascaleX;
            let os1 = 0, os2 = 0, s2 = 0;
            if (psx < 0) {
                psx = -psx;
                os1 = 180;
                s2 = -1;
            }
            else {
                os1 = 0;
                s2 = 1;
            }
            if (psy < 0) {
                psy = -psy;
                s2 = -s2;
            }
            if (csx < 0) {
                csx = -csx;
                os2 = 180;
            }
            else
                os2 = 0;
            let cx = child.ax, cy = 0, cwx = 0, cwy = 0, a = parent.a, b = parent.b, c = parent.c, d = parent.d;
            let u = Math.abs(psx - psy) <= 0.0001;
            if (!u || stretch) {
                cy = 0;
                cwx = a * cx + parent.worldX;
                cwy = c * cx + parent.worldY;
            }
            else {
                cy = child.ay;
                cwx = a * cx + b * cy + parent.worldX;
                cwy = c * cx + d * cy + parent.worldY;
            }
            let pp = parent.parent;
            a = pp.a;
            b = pp.b;
            c = pp.c;
            d = pp.d;
            let id = 1 / (a * d - b * c), x = cwx - pp.worldX, y = cwy - pp.worldY;
            let dx = (x * d - y * b) * id - px, dy = (y * a - x * c) * id - py;
            let l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.data.length * csx, a1, a2;
            if (l1 < 0.0001) {
                this.apply1(parent, targetX, targetY, false, stretch, false, alpha);
                child.updateWorldTransformWith(cx, cy, 0, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
                return;
            }
            x = targetX - pp.worldX;
            y = targetY - pp.worldY;
            let tx = (x * d - y * b) * id - px, ty = (y * a - x * c) * id - py;
            let dd = tx * tx + ty * ty;
            if (softness != 0) {
                softness *= psx * (csx + 1) * 0.5;
                let td = Math.sqrt(dd), sd = td - l1 - l2 * psx + softness;
                if (sd > 0) {
                    let p = Math.min(1, sd / (softness * 2)) - 1;
                    p = (sd - softness * (1 - p * p)) / td;
                    tx -= p * tx;
                    ty -= p * ty;
                    dd = tx * tx + ty * ty;
                }
            }
            outer: if (u) {
                l2 *= psx;
                let cos = (dd - l1 * l1 - l2 * l2) / (2 * l1 * l2);
                if (cos < -1) {
                    cos = -1;
                    a2 = Math.PI * bendDir;
                }
                else if (cos > 1) {
                    cos = 1;
                    a2 = 0;
                    if (stretch) {
                        a = (Math.sqrt(dd) / (l1 + l2) - 1) * alpha + 1;
                        sx *= a;
                        if (uniform)
                            sy *= a;
                    }
                }
                else
                    a2 = Math.acos(cos) * bendDir;
                a = l1 + l2 * cos;
                b = l2 * Math.sin(a2);
                a1 = Math.atan2(ty * a - tx * b, tx * a + ty * b);
            }
            else {
                a = psx * l2;
                b = psy * l2;
                let aa = a * a, bb = b * b, ta = Math.atan2(ty, tx);
                c = bb * l1 * l1 + aa * dd - aa * bb;
                let c1 = -2 * bb * l1, c2 = bb - aa;
                d = c1 * c1 - 4 * c2 * c;
                if (d >= 0) {
                    let q = Math.sqrt(d);
                    if (c1 < 0)
                        q = -q;
                    q = -(c1 + q) * 0.5;
                    let r0 = q / c2, r1 = c / q;
                    let r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
                    if (r * r <= dd) {
                        y = Math.sqrt(dd - r * r) * bendDir;
                        a1 = ta - Math.atan2(y, r);
                        a2 = Math.atan2(y / psy, (r - l1) / psx);
                        break outer;
                    }
                }
                let minAngle = MathUtils.PI, minX = l1 - a, minDist = minX * minX, minY = 0;
                let maxAngle = 0, maxX = l1 + a, maxDist = maxX * maxX, maxY = 0;
                c = -a * l1 / (aa - bb);
                if (c >= -1 && c <= 1) {
                    c = Math.acos(c);
                    x = a * Math.cos(c) + l1;
                    y = b * Math.sin(c);
                    d = x * x + y * y;
                    if (d < minDist) {
                        minAngle = c;
                        minDist = d;
                        minX = x;
                        minY = y;
                    }
                    if (d > maxDist) {
                        maxAngle = c;
                        maxDist = d;
                        maxX = x;
                        maxY = y;
                    }
                }
                if (dd <= (minDist + maxDist) * 0.5) {
                    a1 = ta - Math.atan2(minY * bendDir, minX);
                    a2 = minAngle * bendDir;
                }
                else {
                    a1 = ta - Math.atan2(maxY * bendDir, maxX);
                    a2 = maxAngle * bendDir;
                }
            }
            let os = Math.atan2(cy, cx) * s2;
            let rotation = parent.arotation;
            a1 = (a1 - os) * MathUtils.radDeg + os1 - rotation;
            if (a1 > 180)
                a1 -= 360;
            else if (a1 < -180) //
                a1 += 360;
            parent.updateWorldTransformWith(px, py, rotation + a1 * alpha, sx, sy, 0, 0);
            rotation = child.arotation;
            a2 = ((a2 + os) * MathUtils.radDeg - child.ashearX) * s2 + os2 - rotation;
            if (a2 > 180)
                a2 -= 360;
            else if (a2 < -180) //
                a2 += 360;
            child.updateWorldTransformWith(cx, cy, rotation + a2 * alpha, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose for an {@link IkConstraint}.
     * <p>
     * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide. */
    class IkConstraintData extends ConstraintData {
        constructor(name) {
            super(name, 0, false);
            /** The bones that are constrained by this IK constraint. */
            this.bones = new Array();
            /** The bone that is the IK target. */
            this.target = null;
            /** Controls the bend direction of the IK bones, either 1 or -1. */
            this.bendDirection = 1;
            /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
            this.compress = false;
            /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
             * and the parent bone has local nonuniform scale, stretch is not applied. */
            this.stretch = false;
            /** When true, only a single bone is being constrained, and {@link #getCompress()} or {@link #getStretch()} is used, the bone
             * is scaled on both the X and Y axes. */
            this.uniform = false;
            /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
            this.mix = 1;
            /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
            this.softness = 0;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose for a {@link PathConstraint}.
     *
     * See [path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide. */
    class PathConstraintData extends ConstraintData {
        constructor(name) {
            super(name, 0, false);
            /** The bones that will be modified by this path constraint. */
            this.bones = new Array();
            /** The slot whose path attachment will be used to constrained the bones. */
            this.target = null;
            /** The mode for positioning the first bone on the path. */
            this.positionMode = null;
            /** The mode for positioning the bones after the first bone on the path. */
            this.spacingMode = null;
            /** The mode for adjusting the rotation of the bones. */
            this.rotateMode = null;
            /** An offset added to the constrained bone rotation. */
            this.offsetRotation = 0;
            /** The position along the path. */
            this.position = 0;
            /** The spacing between bones. */
            this.spacing = 0;
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
        }
    }
    (function (PositionMode) {
        PositionMode[PositionMode["Fixed"] = 0] = "Fixed";
        PositionMode[PositionMode["Percent"] = 1] = "Percent";
    })(exports.PositionMode || (exports.PositionMode = {}));
    (function (SpacingMode) {
        SpacingMode[SpacingMode["Length"] = 0] = "Length";
        SpacingMode[SpacingMode["Fixed"] = 1] = "Fixed";
        SpacingMode[SpacingMode["Percent"] = 2] = "Percent";
        SpacingMode[SpacingMode["Proportional"] = 3] = "Proportional";
    })(exports.SpacingMode || (exports.SpacingMode = {}));
    (function (RotateMode) {
        RotateMode[RotateMode["Tangent"] = 0] = "Tangent";
        RotateMode[RotateMode["Chain"] = 1] = "Chain";
        RotateMode[RotateMode["ChainScale"] = 2] = "ChainScale";
    })(exports.RotateMode || (exports.RotateMode = {}));

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the current pose for a path constraint. A path constraint adjusts the rotation, translation, and scale of the
     * constrained bones so they follow a {@link PathAttachment}.
     *
     * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide. */
    class PathConstraint {
        constructor(data, skeleton) {
            /** The path constraint's setup pose data. */
            this.data = null;
            /** The bones that will be modified by this path constraint. */
            this.bones = null;
            /** The slot whose path attachment will be used to constrained the bones. */
            this.target = null;
            /** The position along the path. */
            this.position = 0;
            /** The spacing between bones. */
            this.spacing = 0;
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
            this.spaces = new Array();
            this.positions = new Array();
            this.world = new Array();
            this.curves = new Array();
            this.lengths = new Array();
            this.segments = new Array();
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.bones = new Array();
            for (let i = 0, n = data.bones.length; i < n; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findSlot(data.target.name);
            this.position = data.position;
            this.spacing = data.spacing;
            this.mixRotate = data.mixRotate;
            this.mixX = data.mixX;
            this.mixY = data.mixY;
        }
        isActive() {
            return this.active;
        }
        update() {
            let attachment = this.target.getAttachment();
            if (!(attachment instanceof PathAttachment))
                return;
            let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY;
            if (mixRotate == 0 && mixX == 0 && mixY == 0)
                return;
            let data = this.data;
            let tangents = data.rotateMode == exports.RotateMode.Tangent, scale = data.rotateMode == exports.RotateMode.ChainScale;
            let bones = this.bones;
            let boneCount = bones.length, spacesCount = tangents ? boneCount : boneCount + 1;
            let spaces = Utils.setArraySize(this.spaces, spacesCount), lengths = scale ? this.lengths = Utils.setArraySize(this.lengths, boneCount) : null;
            let spacing = this.spacing;
            switch (data.spacingMode) {
                case exports.SpacingMode.Percent:
                    if (scale) {
                        for (let i = 0, n = spacesCount - 1; i < n; i++) {
                            let bone = bones[i];
                            let setupLength = bone.data.length;
                            if (setupLength < PathConstraint.epsilon)
                                lengths[i] = 0;
                            else {
                                let x = setupLength * bone.a, y = setupLength * bone.c;
                                lengths[i] = Math.sqrt(x * x + y * y);
                            }
                        }
                    }
                    Utils.arrayFill(spaces, 1, spacesCount, spacing);
                    break;
                case exports.SpacingMode.Proportional:
                    let sum = 0;
                    for (let i = 0, n = spacesCount - 1; i < n;) {
                        let bone = bones[i];
                        let setupLength = bone.data.length;
                        if (setupLength < PathConstraint.epsilon) {
                            if (scale)
                                lengths[i] = 0;
                            spaces[++i] = spacing;
                        }
                        else {
                            let x = setupLength * bone.a, y = setupLength * bone.c;
                            let length = Math.sqrt(x * x + y * y);
                            if (scale)
                                lengths[i] = length;
                            spaces[++i] = length;
                            sum += length;
                        }
                    }
                    if (sum > 0) {
                        sum = spacesCount / sum * spacing;
                        for (let i = 1; i < spacesCount; i++)
                            spaces[i] *= sum;
                    }
                    break;
                default:
                    let lengthSpacing = data.spacingMode == exports.SpacingMode.Length;
                    for (let i = 0, n = spacesCount - 1; i < n;) {
                        let bone = bones[i];
                        let setupLength = bone.data.length;
                        if (setupLength < PathConstraint.epsilon) {
                            if (scale)
                                lengths[i] = 0;
                            spaces[++i] = spacing;
                        }
                        else {
                            let x = setupLength * bone.a, y = setupLength * bone.c;
                            let length = Math.sqrt(x * x + y * y);
                            if (scale)
                                lengths[i] = length;
                            spaces[++i] = (lengthSpacing ? setupLength + spacing : spacing) * length / setupLength;
                        }
                    }
            }
            let positions = this.computeWorldPositions(attachment, spacesCount, tangents);
            let boneX = positions[0], boneY = positions[1], offsetRotation = data.offsetRotation;
            let tip = false;
            if (offsetRotation == 0)
                tip = data.rotateMode == exports.RotateMode.Chain;
            else {
                tip = false;
                let p = this.target.bone;
                offsetRotation *= p.a * p.d - p.b * p.c > 0 ? MathUtils.degRad : -MathUtils.degRad;
            }
            for (let i = 0, p = 3; i < boneCount; i++, p += 3) {
                let bone = bones[i];
                bone.worldX += (boneX - bone.worldX) * mixX;
                bone.worldY += (boneY - bone.worldY) * mixY;
                let x = positions[p], y = positions[p + 1], dx = x - boneX, dy = y - boneY;
                if (scale) {
                    let length = lengths[i];
                    if (length != 0) {
                        let s = (Math.sqrt(dx * dx + dy * dy) / length - 1) * mixRotate + 1;
                        bone.a *= s;
                        bone.c *= s;
                    }
                }
                boneX = x;
                boneY = y;
                if (mixRotate > 0) {
                    let a = bone.a, b = bone.b, c = bone.c, d = bone.d, r = 0, cos = 0, sin = 0;
                    if (tangents)
                        r = positions[p - 1];
                    else if (spaces[i + 1] == 0)
                        r = positions[p + 2];
                    else
                        r = Math.atan2(dy, dx);
                    r -= Math.atan2(c, a);
                    if (tip) {
                        cos = Math.cos(r);
                        sin = Math.sin(r);
                        let length = bone.data.length;
                        boneX += (length * (cos * a - sin * c) - dx) * mixRotate;
                        boneY += (length * (sin * a + cos * c) - dy) * mixRotate;
                    }
                    else {
                        r += offsetRotation;
                    }
                    if (r > MathUtils.PI)
                        r -= MathUtils.PI2;
                    else if (r < -MathUtils.PI) //
                        r += MathUtils.PI2;
                    r *= mixRotate;
                    cos = Math.cos(r);
                    sin = Math.sin(r);
                    bone.a = cos * a - sin * c;
                    bone.b = cos * b - sin * d;
                    bone.c = sin * a + cos * c;
                    bone.d = sin * b + cos * d;
                }
                bone.updateAppliedTransform();
            }
        }
        computeWorldPositions(path, spacesCount, tangents) {
            let target = this.target;
            let position = this.position;
            let spaces = this.spaces, out = Utils.setArraySize(this.positions, spacesCount * 3 + 2), world = null;
            let closed = path.closed;
            let verticesLength = path.worldVerticesLength, curveCount = verticesLength / 6, prevCurve = PathConstraint.NONE;
            if (!path.constantSpeed) {
                let lengths = path.lengths;
                curveCount -= closed ? 1 : 2;
                let pathLength = lengths[curveCount];
                if (this.data.positionMode == exports.PositionMode.Percent)
                    position *= pathLength;
                let multiplier;
                switch (this.data.spacingMode) {
                    case exports.SpacingMode.Percent:
                        multiplier = pathLength;
                        break;
                    case exports.SpacingMode.Proportional:
                        multiplier = pathLength / spacesCount;
                        break;
                    default:
                        multiplier = 1;
                }
                world = Utils.setArraySize(this.world, 8);
                for (let i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
                    let space = spaces[i] * multiplier;
                    position += space;
                    let p = position;
                    if (closed) {
                        p %= pathLength;
                        if (p < 0)
                            p += pathLength;
                        curve = 0;
                    }
                    else if (p < 0) {
                        if (prevCurve != PathConstraint.BEFORE) {
                            prevCurve = PathConstraint.BEFORE;
                            path.computeWorldVertices(target, 2, 4, world, 0, 2);
                        }
                        this.addBeforePosition(p, world, 0, out, o);
                        continue;
                    }
                    else if (p > pathLength) {
                        if (prevCurve != PathConstraint.AFTER) {
                            prevCurve = PathConstraint.AFTER;
                            path.computeWorldVertices(target, verticesLength - 6, 4, world, 0, 2);
                        }
                        this.addAfterPosition(p - pathLength, world, 0, out, o);
                        continue;
                    }
                    // Determine curve containing position.
                    for (;; curve++) {
                        let length = lengths[curve];
                        if (p > length)
                            continue;
                        if (curve == 0)
                            p /= length;
                        else {
                            let prev = lengths[curve - 1];
                            p = (p - prev) / (length - prev);
                        }
                        break;
                    }
                    if (curve != prevCurve) {
                        prevCurve = curve;
                        if (closed && curve == curveCount) {
                            path.computeWorldVertices(target, verticesLength - 4, 4, world, 0, 2);
                            path.computeWorldVertices(target, 0, 4, world, 4, 2);
                        }
                        else
                            path.computeWorldVertices(target, curve * 6 + 2, 8, world, 0, 2);
                    }
                    this.addCurvePosition(p, world[0], world[1], world[2], world[3], world[4], world[5], world[6], world[7], out, o, tangents || (i > 0 && space == 0));
                }
                return out;
            }
            // World vertices.
            if (closed) {
                verticesLength += 2;
                world = Utils.setArraySize(this.world, verticesLength);
                path.computeWorldVertices(target, 2, verticesLength - 4, world, 0, 2);
                path.computeWorldVertices(target, 0, 2, world, verticesLength - 4, 2);
                world[verticesLength - 2] = world[0];
                world[verticesLength - 1] = world[1];
            }
            else {
                curveCount--;
                verticesLength -= 4;
                world = Utils.setArraySize(this.world, verticesLength);
                path.computeWorldVertices(target, 2, verticesLength, world, 0, 2);
            }
            // Curve lengths.
            let curves = Utils.setArraySize(this.curves, curveCount);
            let pathLength = 0;
            let x1 = world[0], y1 = world[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
            let tmpx = 0, tmpy = 0, dddfx = 0, dddfy = 0, ddfx = 0, ddfy = 0, dfx = 0, dfy = 0;
            for (let i = 0, w = 2; i < curveCount; i++, w += 6) {
                cx1 = world[w];
                cy1 = world[w + 1];
                cx2 = world[w + 2];
                cy2 = world[w + 3];
                x2 = world[w + 4];
                y2 = world[w + 5];
                tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
                tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
                dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
                dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
                ddfx = tmpx * 2 + dddfx;
                ddfy = tmpy * 2 + dddfy;
                dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
                dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                ddfx += dddfx;
                ddfy += dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx;
                dfy += ddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                dfx += ddfx + dddfx;
                dfy += ddfy + dddfy;
                pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
                curves[i] = pathLength;
                x1 = x2;
                y1 = y2;
            }
            if (this.data.positionMode == exports.PositionMode.Percent)
                position *= pathLength;
            let multiplier;
            switch (this.data.spacingMode) {
                case exports.SpacingMode.Percent:
                    multiplier = pathLength;
                    break;
                case exports.SpacingMode.Proportional:
                    multiplier = pathLength / spacesCount;
                    break;
                default:
                    multiplier = 1;
            }
            let segments = this.segments;
            let curveLength = 0;
            for (let i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
                let space = spaces[i] * multiplier;
                position += space;
                let p = position;
                if (closed) {
                    p %= pathLength;
                    if (p < 0)
                        p += pathLength;
                    curve = 0;
                }
                else if (p < 0) {
                    this.addBeforePosition(p, world, 0, out, o);
                    continue;
                }
                else if (p > pathLength) {
                    this.addAfterPosition(p - pathLength, world, verticesLength - 4, out, o);
                    continue;
                }
                // Determine curve containing position.
                for (;; curve++) {
                    let length = curves[curve];
                    if (p > length)
                        continue;
                    if (curve == 0)
                        p /= length;
                    else {
                        let prev = curves[curve - 1];
                        p = (p - prev) / (length - prev);
                    }
                    break;
                }
                // Curve segment lengths.
                if (curve != prevCurve) {
                    prevCurve = curve;
                    let ii = curve * 6;
                    x1 = world[ii];
                    y1 = world[ii + 1];
                    cx1 = world[ii + 2];
                    cy1 = world[ii + 3];
                    cx2 = world[ii + 4];
                    cy2 = world[ii + 5];
                    x2 = world[ii + 6];
                    y2 = world[ii + 7];
                    tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
                    tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
                    dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.006;
                    dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.006;
                    ddfx = tmpx * 2 + dddfx;
                    ddfy = tmpy * 2 + dddfy;
                    dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
                    dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
                    curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[0] = curveLength;
                    for (ii = 1; ii < 8; ii++) {
                        dfx += ddfx;
                        dfy += ddfy;
                        ddfx += dddfx;
                        ddfy += dddfy;
                        curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                        segments[ii] = curveLength;
                    }
                    dfx += ddfx;
                    dfy += ddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[8] = curveLength;
                    dfx += ddfx + dddfx;
                    dfy += ddfy + dddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[9] = curveLength;
                    segment = 0;
                }
                // Weight by segment length.
                p *= curveLength;
                for (;; segment++) {
                    let length = segments[segment];
                    if (p > length)
                        continue;
                    if (segment == 0)
                        p /= length;
                    else {
                        let prev = segments[segment - 1];
                        p = segment + (p - prev) / (length - prev);
                    }
                    break;
                }
                this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents || (i > 0 && space == 0));
            }
            return out;
        }
        addBeforePosition(p, temp, i, out, o) {
            let x1 = temp[i], y1 = temp[i + 1], dx = temp[i + 2] - x1, dy = temp[i + 3] - y1, r = Math.atan2(dy, dx);
            out[o] = x1 + p * Math.cos(r);
            out[o + 1] = y1 + p * Math.sin(r);
            out[o + 2] = r;
        }
        addAfterPosition(p, temp, i, out, o) {
            let x1 = temp[i + 2], y1 = temp[i + 3], dx = x1 - temp[i], dy = y1 - temp[i + 1], r = Math.atan2(dy, dx);
            out[o] = x1 + p * Math.cos(r);
            out[o + 1] = y1 + p * Math.sin(r);
            out[o + 2] = r;
        }
        addCurvePosition(p, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents) {
            if (p == 0 || isNaN(p)) {
                out[o] = x1;
                out[o + 1] = y1;
                out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
                return;
            }
            let tt = p * p, ttt = tt * p, u = 1 - p, uu = u * u, uuu = uu * u;
            let ut = u * p, ut3 = ut * 3, uut3 = u * ut3, utt3 = ut3 * p;
            let x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt, y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
            out[o] = x;
            out[o + 1] = y;
            if (tangents) {
                if (p < 0.001)
                    out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
                else
                    out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
            }
        }
    }
    PathConstraint.NONE = -1;
    PathConstraint.BEFORE = -2;
    PathConstraint.AFTER = -3;
    PathConstraint.epsilon = 0.00001;

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores a slot's current pose. Slots organize attachments for {@link Skeleton#drawOrder} purposes and provide a place to store
     * state for an attachment. State cannot be stored in an attachment itself because attachments are stateless and may be shared
     * across multiple skeletons. */
    class Slot {
        constructor(data, bone) {
            /** The slot's setup pose data. */
            this.data = null;
            /** The bone this slot belongs to. */
            this.bone = null;
            /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
             * color tinting. */
            this.color = null;
            /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
             * color's alpha is not used. */
            this.darkColor = null;
            this.attachment = null;
            this.attachmentTime = 0;
            this.attachmentState = 0;
            /** Values to deform the slot's attachment. For an unweighted mesh, the entries are local positions for each vertex. For a
             * weighted mesh, the entries are an offset for each vertex which will be added to the mesh's local vertex positions.
             *
             * See {@link VertexAttachment#computeWorldVertices()} and {@link DeformTimeline}. */
            this.deform = new Array();
            if (!data)
                throw new Error("data cannot be null.");
            if (!bone)
                throw new Error("bone cannot be null.");
            this.data = data;
            this.bone = bone;
            this.color = new Color();
            this.darkColor = !data.darkColor ? null : new Color();
            this.setToSetupPose();
        }
        /** The skeleton this slot belongs to. */
        getSkeleton() {
            return this.bone.skeleton;
        }
        /** The current attachment for the slot, or null if the slot has no attachment. */
        getAttachment() {
            return this.attachment;
        }
        /** Sets the slot's attachment and, if the attachment changed, resets {@link #attachmentTime} and clears the {@link #deform}.
         * The deform is not cleared if the old attachment has the same {@link VertexAttachment#getDeformAttachment()} as the specified
         * attachment.
         * @param attachment May be null. */
        setAttachment(attachment) {
            if (this.attachment == attachment)
                return;
            if (!(attachment instanceof VertexAttachment) || !(this.attachment instanceof VertexAttachment)
                || attachment.deformAttachment != this.attachment.deformAttachment) {
                this.deform.length = 0;
            }
            this.attachment = attachment;
            this.attachmentTime = this.bone.skeleton.time;
        }
        setAttachmentTime(time) {
            this.attachmentTime = this.bone.skeleton.time - time;
        }
        /** The time that has elapsed since the last time the attachment was set or cleared. Relies on Skeleton
         * {@link Skeleton#time}. */
        getAttachmentTime() {
            return this.bone.skeleton.time - this.attachmentTime;
        }
        /** Sets this slot to the setup pose. */
        setToSetupPose() {
            this.color.setFromColor(this.data.color);
            if (this.darkColor)
                this.darkColor.setFromColor(this.data.darkColor);
            if (!this.data.attachmentName)
                this.attachment = null;
            else {
                this.attachment = null;
                this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName));
            }
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the current pose for a transform constraint. A transform constraint adjusts the world transform of the constrained
     * bones to match that of the target bone.
     *
     * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide. */
    class TransformConstraint {
        constructor(data, skeleton) {
            /** The transform constraint's setup pose data. */
            this.data = null;
            /** The bones that will be modified by this transform constraint. */
            this.bones = null;
            /** The target bone whose world transform will be copied to the constrained bones. */
            this.target = null;
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
            this.mixScaleX = 0;
            this.mixScaleY = 0;
            this.mixShearY = 0;
            this.temp = new Vector2();
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.mixRotate = data.mixRotate;
            this.mixX = data.mixX;
            this.mixY = data.mixY;
            this.mixScaleX = data.mixScaleX;
            this.mixScaleY = data.mixScaleY;
            this.mixShearY = data.mixShearY;
            this.bones = new Array();
            for (let i = 0; i < data.bones.length; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findBone(data.target.name);
        }
        isActive() {
            return this.active;
        }
        update() {
            if (this.mixRotate == 0 && this.mixX == 0 && this.mixY == 0 && this.mixScaleX == 0 && this.mixScaleX == 0 && this.mixShearY == 0)
                return;
            if (this.data.local) {
                if (this.data.relative)
                    this.applyRelativeLocal();
                else
                    this.applyAbsoluteLocal();
            }
            else {
                if (this.data.relative)
                    this.applyRelativeWorld();
                else
                    this.applyAbsoluteWorld();
            }
        }
        applyAbsoluteWorld() {
            let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            let translate = mixX != 0 || mixY != 0;
            let target = this.target;
            let ta = target.a, tb = target.b, tc = target.c, td = target.d;
            let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
            let offsetRotation = this.data.offsetRotation * degRadReflect;
            let offsetShearY = this.data.offsetShearY * degRadReflect;
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                if (mixRotate != 0) {
                    let a = bone.a, b = bone.b, c = bone.c, d = bone.d;
                    let r = Math.atan2(tc, ta) - Math.atan2(c, a) + offsetRotation;
                    if (r > MathUtils.PI)
                        r -= MathUtils.PI2;
                    else if (r < -MathUtils.PI) //
                        r += MathUtils.PI2;
                    r *= mixRotate;
                    let cos = Math.cos(r), sin = Math.sin(r);
                    bone.a = cos * a - sin * c;
                    bone.b = cos * b - sin * d;
                    bone.c = sin * a + cos * c;
                    bone.d = sin * b + cos * d;
                }
                if (translate) {
                    let temp = this.temp;
                    target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                    bone.worldX += (temp.x - bone.worldX) * mixX;
                    bone.worldY += (temp.y - bone.worldY) * mixY;
                }
                if (mixScaleX != 0) {
                    let s = Math.sqrt(bone.a * bone.a + bone.c * bone.c);
                    if (s != 0)
                        s = (s + (Math.sqrt(ta * ta + tc * tc) - s + this.data.offsetScaleX) * mixScaleX) / s;
                    bone.a *= s;
                    bone.c *= s;
                }
                if (mixScaleY != 0) {
                    let s = Math.sqrt(bone.b * bone.b + bone.d * bone.d);
                    if (s != 0)
                        s = (s + (Math.sqrt(tb * tb + td * td) - s + this.data.offsetScaleY) * mixScaleY) / s;
                    bone.b *= s;
                    bone.d *= s;
                }
                if (mixShearY > 0) {
                    let b = bone.b, d = bone.d;
                    let by = Math.atan2(d, b);
                    let r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(bone.c, bone.a));
                    if (r > MathUtils.PI)
                        r -= MathUtils.PI2;
                    else if (r < -MathUtils.PI) //
                        r += MathUtils.PI2;
                    r = by + (r + offsetShearY) * mixShearY;
                    let s = Math.sqrt(b * b + d * d);
                    bone.b = Math.cos(r) * s;
                    bone.d = Math.sin(r) * s;
                }
                bone.updateAppliedTransform();
            }
        }
        applyRelativeWorld() {
            let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            let translate = mixX != 0 || mixY != 0;
            let target = this.target;
            let ta = target.a, tb = target.b, tc = target.c, td = target.d;
            let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
            let offsetRotation = this.data.offsetRotation * degRadReflect, offsetShearY = this.data.offsetShearY * degRadReflect;
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                if (mixRotate != 0) {
                    let a = bone.a, b = bone.b, c = bone.c, d = bone.d;
                    let r = Math.atan2(tc, ta) + offsetRotation;
                    if (r > MathUtils.PI)
                        r -= MathUtils.PI2;
                    else if (r < -MathUtils.PI) //
                        r += MathUtils.PI2;
                    r *= mixRotate;
                    let cos = Math.cos(r), sin = Math.sin(r);
                    bone.a = cos * a - sin * c;
                    bone.b = cos * b - sin * d;
                    bone.c = sin * a + cos * c;
                    bone.d = sin * b + cos * d;
                }
                if (translate) {
                    let temp = this.temp;
                    target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                    bone.worldX += temp.x * mixX;
                    bone.worldY += temp.y * mixY;
                }
                if (mixScaleX != 0) {
                    let s = (Math.sqrt(ta * ta + tc * tc) - 1 + this.data.offsetScaleX) * mixScaleX + 1;
                    bone.a *= s;
                    bone.c *= s;
                }
                if (mixScaleY != 0) {
                    let s = (Math.sqrt(tb * tb + td * td) - 1 + this.data.offsetScaleY) * mixScaleY + 1;
                    bone.b *= s;
                    bone.d *= s;
                }
                if (mixShearY > 0) {
                    let r = Math.atan2(td, tb) - Math.atan2(tc, ta);
                    if (r > MathUtils.PI)
                        r -= MathUtils.PI2;
                    else if (r < -MathUtils.PI) //
                        r += MathUtils.PI2;
                    let b = bone.b, d = bone.d;
                    r = Math.atan2(d, b) + (r - MathUtils.PI / 2 + offsetShearY) * mixShearY;
                    let s = Math.sqrt(b * b + d * d);
                    bone.b = Math.cos(r) * s;
                    bone.d = Math.sin(r) * s;
                }
                bone.updateAppliedTransform();
            }
        }
        applyAbsoluteLocal() {
            let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            let target = this.target;
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                let rotation = bone.arotation;
                if (mixRotate != 0) {
                    let r = target.arotation - rotation + this.data.offsetRotation;
                    r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                    rotation += r * mixRotate;
                }
                let x = bone.ax, y = bone.ay;
                x += (target.ax - x + this.data.offsetX) * mixX;
                y += (target.ay - y + this.data.offsetY) * mixY;
                let scaleX = bone.ascaleX, scaleY = bone.ascaleY;
                if (mixScaleX != 0 && scaleX != 0)
                    scaleX = (scaleX + (target.ascaleX - scaleX + this.data.offsetScaleX) * mixScaleX) / scaleX;
                if (mixScaleY != 0 && scaleY != 0)
                    scaleY = (scaleY + (target.ascaleY - scaleY + this.data.offsetScaleY) * mixScaleY) / scaleY;
                let shearY = bone.ashearY;
                if (mixShearY != 0) {
                    let r = target.ashearY - shearY + this.data.offsetShearY;
                    r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                    shearY += r * mixShearY;
                }
                bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
            }
        }
        applyRelativeLocal() {
            let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            let target = this.target;
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                let rotation = bone.arotation + (target.arotation + this.data.offsetRotation) * mixRotate;
                let x = bone.ax + (target.ax + this.data.offsetX) * mixX;
                let y = bone.ay + (target.ay + this.data.offsetY) * mixY;
                let scaleX = bone.ascaleX * (((target.ascaleX - 1 + this.data.offsetScaleX) * mixScaleX) + 1);
                let scaleY = bone.ascaleY * (((target.ascaleY - 1 + this.data.offsetScaleY) * mixScaleY) + 1);
                let shearY = bone.ashearY + (target.ashearY + this.data.offsetShearY) * mixShearY;
                bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
            }
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the current pose for a skeleton.
     *
     * See [Instance objects](http://esotericsoftware.com/spine-runtime-architecture#Instance-objects) in the Spine Runtimes Guide. */
    class Skeleton {
        constructor(data) {
            /** The skeleton's setup pose data. */
            this.data = null;
            /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
            this.bones = null;
            /** The skeleton's slots. */
            this.slots = null;
            /** The skeleton's slots in the order they should be drawn. The returned array may be modified to change the draw order. */
            this.drawOrder = null;
            /** The skeleton's IK constraints. */
            this.ikConstraints = null;
            /** The skeleton's transform constraints. */
            this.transformConstraints = null;
            /** The skeleton's path constraints. */
            this.pathConstraints = null;
            /** The list of bones and constraints, sorted in the order they should be updated, as computed by {@link #updateCache()}. */
            this._updateCache = new Array();
            /** The skeleton's current skin. May be null. */
            this.skin = null;
            /** The color to tint all the skeleton's attachments. */
            this.color = null;
            /** Returns the skeleton's time. This can be used for tracking, such as with Slot {@link Slot#attachmentTime}.
             * <p>
             * See {@link #update()}. */
            this.time = 0;
            /** Scales the entire skeleton on the X axis. This affects all bones, even if the bone's transform mode disallows scale
              * inheritance. */
            this.scaleX = 1;
            /** Scales the entire skeleton on the Y axis. This affects all bones, even if the bone's transform mode disallows scale
              * inheritance. */
            this.scaleY = 1;
            /** Sets the skeleton X position, which is added to the root bone worldX position. */
            this.x = 0;
            /** Sets the skeleton Y position, which is added to the root bone worldY position. */
            this.y = 0;
            if (!data)
                throw new Error("data cannot be null.");
            this.data = data;
            this.bones = new Array();
            for (let i = 0; i < data.bones.length; i++) {
                let boneData = data.bones[i];
                let bone;
                if (!boneData.parent)
                    bone = new Bone(boneData, this, null);
                else {
                    let parent = this.bones[boneData.parent.index];
                    bone = new Bone(boneData, this, parent);
                    parent.children.push(bone);
                }
                this.bones.push(bone);
            }
            this.slots = new Array();
            this.drawOrder = new Array();
            for (let i = 0; i < data.slots.length; i++) {
                let slotData = data.slots[i];
                let bone = this.bones[slotData.boneData.index];
                let slot = new Slot(slotData, bone);
                this.slots.push(slot);
                this.drawOrder.push(slot);
            }
            this.ikConstraints = new Array();
            for (let i = 0; i < data.ikConstraints.length; i++) {
                let ikConstraintData = data.ikConstraints[i];
                this.ikConstraints.push(new IkConstraint(ikConstraintData, this));
            }
            this.transformConstraints = new Array();
            for (let i = 0; i < data.transformConstraints.length; i++) {
                let transformConstraintData = data.transformConstraints[i];
                this.transformConstraints.push(new TransformConstraint(transformConstraintData, this));
            }
            this.pathConstraints = new Array();
            for (let i = 0; i < data.pathConstraints.length; i++) {
                let pathConstraintData = data.pathConstraints[i];
                this.pathConstraints.push(new PathConstraint(pathConstraintData, this));
            }
            this.color = new Color(1, 1, 1, 1);
            this.updateCache();
        }
        /** Caches information about bones and constraints. Must be called if the {@link #getSkin()} is modified or if bones,
         * constraints, or weighted path attachments are added or removed. */
        updateCache() {
            let updateCache = this._updateCache;
            updateCache.length = 0;
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                bone.sorted = bone.data.skinRequired;
                bone.active = !bone.sorted;
            }
            if (this.skin) {
                let skinBones = this.skin.bones;
                for (let i = 0, n = this.skin.bones.length; i < n; i++) {
                    let bone = this.bones[skinBones[i].index];
                    do {
                        bone.sorted = false;
                        bone.active = true;
                        bone = bone.parent;
                    } while (bone);
                }
            }
            // IK first, lowest hierarchy depth first.
            let ikConstraints = this.ikConstraints;
            let transformConstraints = this.transformConstraints;
            let pathConstraints = this.pathConstraints;
            let ikCount = ikConstraints.length, transformCount = transformConstraints.length, pathCount = pathConstraints.length;
            let constraintCount = ikCount + transformCount + pathCount;
            outer: for (let i = 0; i < constraintCount; i++) {
                for (let ii = 0; ii < ikCount; ii++) {
                    let constraint = ikConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortIkConstraint(constraint);
                        continue outer;
                    }
                }
                for (let ii = 0; ii < transformCount; ii++) {
                    let constraint = transformConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortTransformConstraint(constraint);
                        continue outer;
                    }
                }
                for (let ii = 0; ii < pathCount; ii++) {
                    let constraint = pathConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortPathConstraint(constraint);
                        continue outer;
                    }
                }
            }
            for (let i = 0, n = bones.length; i < n; i++)
                this.sortBone(bones[i]);
        }
        sortIkConstraint(constraint) {
            constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin && Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            let target = constraint.target;
            this.sortBone(target);
            let constrained = constraint.bones;
            let parent = constrained[0];
            this.sortBone(parent);
            if (constrained.length == 1) {
                this._updateCache.push(constraint);
                this.sortReset(parent.children);
            }
            else {
                let child = constrained[constrained.length - 1];
                this.sortBone(child);
                this._updateCache.push(constraint);
                this.sortReset(parent.children);
                child.sorted = true;
            }
        }
        sortPathConstraint(constraint) {
            constraint.active = constraint.target.bone.isActive() && (!constraint.data.skinRequired || (this.skin && Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            let slot = constraint.target;
            let slotIndex = slot.data.index;
            let slotBone = slot.bone;
            if (this.skin)
                this.sortPathConstraintAttachment(this.skin, slotIndex, slotBone);
            if (this.data.defaultSkin && this.data.defaultSkin != this.skin)
                this.sortPathConstraintAttachment(this.data.defaultSkin, slotIndex, slotBone);
            for (let i = 0, n = this.data.skins.length; i < n; i++)
                this.sortPathConstraintAttachment(this.data.skins[i], slotIndex, slotBone);
            let attachment = slot.getAttachment();
            if (attachment instanceof PathAttachment)
                this.sortPathConstraintAttachmentWith(attachment, slotBone);
            let constrained = constraint.bones;
            let boneCount = constrained.length;
            for (let i = 0; i < boneCount; i++)
                this.sortBone(constrained[i]);
            this._updateCache.push(constraint);
            for (let i = 0; i < boneCount; i++)
                this.sortReset(constrained[i].children);
            for (let i = 0; i < boneCount; i++)
                constrained[i].sorted = true;
        }
        sortTransformConstraint(constraint) {
            constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin && Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            this.sortBone(constraint.target);
            let constrained = constraint.bones;
            let boneCount = constrained.length;
            if (constraint.data.local) {
                for (let i = 0; i < boneCount; i++) {
                    let child = constrained[i];
                    this.sortBone(child.parent);
                    this.sortBone(child);
                }
            }
            else {
                for (let i = 0; i < boneCount; i++) {
                    this.sortBone(constrained[i]);
                }
            }
            this._updateCache.push(constraint);
            for (let i = 0; i < boneCount; i++)
                this.sortReset(constrained[i].children);
            for (let i = 0; i < boneCount; i++)
                constrained[i].sorted = true;
        }
        sortPathConstraintAttachment(skin, slotIndex, slotBone) {
            let attachments = skin.attachments[slotIndex];
            if (!attachments)
                return;
            for (let key in attachments) {
                this.sortPathConstraintAttachmentWith(attachments[key], slotBone);
            }
        }
        sortPathConstraintAttachmentWith(attachment, slotBone) {
            if (!(attachment instanceof PathAttachment))
                return;
            let pathBones = attachment.bones;
            if (!pathBones)
                this.sortBone(slotBone);
            else {
                let bones = this.bones;
                for (let i = 0, n = pathBones.length; i < n;) {
                    let nn = pathBones[i++];
                    nn += i;
                    while (i < nn)
                        this.sortBone(bones[pathBones[i++]]);
                }
            }
        }
        sortBone(bone) {
            if (bone.sorted)
                return;
            let parent = bone.parent;
            if (parent)
                this.sortBone(parent);
            bone.sorted = true;
            this._updateCache.push(bone);
        }
        sortReset(bones) {
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                if (!bone.active)
                    continue;
                if (bone.sorted)
                    this.sortReset(bone.children);
                bone.sorted = false;
            }
        }
        /** Updates the world transform for each bone and applies all constraints.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide. */
        updateWorldTransform() {
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                bone.ax = bone.x;
                bone.ay = bone.y;
                bone.arotation = bone.rotation;
                bone.ascaleX = bone.scaleX;
                bone.ascaleY = bone.scaleY;
                bone.ashearX = bone.shearX;
                bone.ashearY = bone.shearY;
            }
            let updateCache = this._updateCache;
            for (let i = 0, n = updateCache.length; i < n; i++)
                updateCache[i].update();
        }
        updateWorldTransformWith(parent) {
            // Apply the parent bone transform to the root bone. The root bone always inherits scale, rotation and reflection.
            let rootBone = this.getRootBone();
            let pa = parent.a, pb = parent.b, pc = parent.c, pd = parent.d;
            rootBone.worldX = pa * this.x + pb * this.y + parent.worldX;
            rootBone.worldY = pc * this.x + pd * this.y + parent.worldY;
            let rotationY = rootBone.rotation + 90 + rootBone.shearY;
            let la = MathUtils.cosDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
            let lb = MathUtils.cosDeg(rotationY) * rootBone.scaleY;
            let lc = MathUtils.sinDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
            let ld = MathUtils.sinDeg(rotationY) * rootBone.scaleY;
            rootBone.a = (pa * la + pb * lc) * this.scaleX;
            rootBone.b = (pa * lb + pb * ld) * this.scaleX;
            rootBone.c = (pc * la + pd * lc) * this.scaleY;
            rootBone.d = (pc * lb + pd * ld) * this.scaleY;
            // Update everything except root bone.
            let updateCache = this._updateCache;
            for (let i = 0, n = updateCache.length; i < n; i++) {
                let updatable = updateCache[i];
                if (updatable != rootBone)
                    updatable.update();
            }
        }
        /** Sets the bones, constraints, and slots to their setup pose values. */
        setToSetupPose() {
            this.setBonesToSetupPose();
            this.setSlotsToSetupPose();
        }
        /** Sets the bones and constraints to their setup pose values. */
        setBonesToSetupPose() {
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++)
                bones[i].setToSetupPose();
            let ikConstraints = this.ikConstraints;
            for (let i = 0, n = ikConstraints.length; i < n; i++) {
                let constraint = ikConstraints[i];
                constraint.mix = constraint.data.mix;
                constraint.softness = constraint.data.softness;
                constraint.bendDirection = constraint.data.bendDirection;
                constraint.compress = constraint.data.compress;
                constraint.stretch = constraint.data.stretch;
            }
            let transformConstraints = this.transformConstraints;
            for (let i = 0, n = transformConstraints.length; i < n; i++) {
                let constraint = transformConstraints[i];
                let data = constraint.data;
                constraint.mixRotate = data.mixRotate;
                constraint.mixX = data.mixX;
                constraint.mixY = data.mixY;
                constraint.mixScaleX = data.mixScaleX;
                constraint.mixScaleY = data.mixScaleY;
                constraint.mixShearY = data.mixShearY;
            }
            let pathConstraints = this.pathConstraints;
            for (let i = 0, n = pathConstraints.length; i < n; i++) {
                let constraint = pathConstraints[i];
                let data = constraint.data;
                constraint.position = data.position;
                constraint.spacing = data.spacing;
                constraint.mixRotate = data.mixRotate;
                constraint.mixX = data.mixX;
                constraint.mixY = data.mixY;
            }
        }
        /** Sets the slots and draw order to their setup pose values. */
        setSlotsToSetupPose() {
            let slots = this.slots;
            Utils.arrayCopy(slots, 0, this.drawOrder, 0, slots.length);
            for (let i = 0, n = slots.length; i < n; i++)
                slots[i].setToSetupPose();
        }
        /** @returns May return null. */
        getRootBone() {
            if (this.bones.length == 0)
                return null;
            return this.bones[0];
        }
        /** @returns May be null. */
        findBone(boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                if (bone.data.name == boneName)
                    return bone;
            }
            return null;
        }
        /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
         * repeatedly.
         * @returns May be null. */
        findSlot(slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            let slots = this.slots;
            for (let i = 0, n = slots.length; i < n; i++) {
                let slot = slots[i];
                if (slot.data.name == slotName)
                    return slot;
            }
            return null;
        }
        /** Sets a skin by name.
         *
         * See {@link #setSkin()}. */
        setSkinByName(skinName) {
            let skin = this.data.findSkin(skinName);
            if (!skin)
                throw new Error("Skin not found: " + skinName);
            this.setSkin(skin);
        }
        /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#defaultSkin default skin}. If the
         * skin is changed, {@link #updateCache()} is called.
         *
         * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was no
         * old skin, each slot's setup mode attachment is attached from the new skin.
         *
         * After changing the skin, the visible attachments can be reset to those attached in the setup pose by calling
         * {@link #setSlotsToSetupPose()}. Also, often {@link AnimationState#apply()} is called before the next time the
         * skeleton is rendered to allow any attachment keys in the current animation(s) to hide or show attachments from the new skin.
         * @param newSkin May be null. */
        setSkin(newSkin) {
            if (newSkin == this.skin)
                return;
            if (newSkin) {
                if (this.skin)
                    newSkin.attachAll(this, this.skin);
                else {
                    let slots = this.slots;
                    for (let i = 0, n = slots.length; i < n; i++) {
                        let slot = slots[i];
                        let name = slot.data.attachmentName;
                        if (name) {
                            let attachment = newSkin.getAttachment(i, name);
                            if (attachment)
                                slot.setAttachment(attachment);
                        }
                    }
                }
            }
            this.skin = newSkin;
            this.updateCache();
        }
        /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot name and attachment
         * name.
         *
         * See {@link #getAttachment()}.
         * @returns May be null. */
        getAttachmentByName(slotName, attachmentName) {
            return this.getAttachment(this.data.findSlot(slotName).index, attachmentName);
        }
        /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot index and
         * attachment name. First the skin is checked and if the attachment was not found, the default skin is checked.
         *
         * See [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
         * @returns May be null. */
        getAttachment(slotIndex, attachmentName) {
            if (!attachmentName)
                throw new Error("attachmentName cannot be null.");
            if (this.skin) {
                let attachment = this.skin.getAttachment(slotIndex, attachmentName);
                if (attachment)
                    return attachment;
            }
            if (this.data.defaultSkin)
                return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
            return null;
        }
        /** A convenience method to set an attachment by finding the slot with {@link #findSlot()}, finding the attachment with
         * {@link #getAttachment()}, then setting the slot's {@link Slot#attachment}.
         * @param attachmentName May be null to clear the slot's attachment. */
        setAttachment(slotName, attachmentName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            let slots = this.slots;
            for (let i = 0, n = slots.length; i < n; i++) {
                let slot = slots[i];
                if (slot.data.name == slotName) {
                    let attachment = null;
                    if (attachmentName) {
                        attachment = this.getAttachment(i, attachmentName);
                        if (!attachment)
                            throw new Error("Attachment not found: " + attachmentName + ", for slot: " + slotName);
                    }
                    slot.setAttachment(attachment);
                    return;
                }
            }
            throw new Error("Slot not found: " + slotName);
        }
        /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
         * than to call it repeatedly.
         * @return May be null. */
        findIkConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let ikConstraints = this.ikConstraints;
            for (let i = 0, n = ikConstraints.length; i < n; i++) {
                let ikConstraint = ikConstraints[i];
                if (ikConstraint.data.name == constraintName)
                    return ikConstraint;
            }
            return null;
        }
        /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
         * this method than to call it repeatedly.
         * @return May be null. */
        findTransformConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let transformConstraints = this.transformConstraints;
            for (let i = 0, n = transformConstraints.length; i < n; i++) {
                let constraint = transformConstraints[i];
                if (constraint.data.name == constraintName)
                    return constraint;
            }
            return null;
        }
        /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
         * than to call it repeatedly.
         * @return May be null. */
        findPathConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let pathConstraints = this.pathConstraints;
            for (let i = 0, n = pathConstraints.length; i < n; i++) {
                let constraint = pathConstraints[i];
                if (constraint.data.name == constraintName)
                    return constraint;
            }
            return null;
        }
        /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
         * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
         * @param size An output value, the width and height of the AABB.
         * @param temp Working memory to temporarily store attachments' computed world vertices. */
        getBounds(offset, size, temp = new Array(2)) {
            if (!offset)
                throw new Error("offset cannot be null.");
            if (!size)
                throw new Error("size cannot be null.");
            let drawOrder = this.drawOrder;
            let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
            for (let i = 0, n = drawOrder.length; i < n; i++) {
                let slot = drawOrder[i];
                if (!slot.bone.active)
                    continue;
                let verticesLength = 0;
                let vertices = null;
                let attachment = slot.getAttachment();
                if (attachment instanceof RegionAttachment) {
                    verticesLength = 8;
                    vertices = Utils.setArraySize(temp, verticesLength, 0);
                    attachment.computeWorldVertices(slot.bone, vertices, 0, 2);
                }
                else if (attachment instanceof MeshAttachment) {
                    let mesh = attachment;
                    verticesLength = mesh.worldVerticesLength;
                    vertices = Utils.setArraySize(temp, verticesLength, 0);
                    mesh.computeWorldVertices(slot, 0, verticesLength, vertices, 0, 2);
                }
                if (vertices) {
                    for (let ii = 0, nn = vertices.length; ii < nn; ii += 2) {
                        let x = vertices[ii], y = vertices[ii + 1];
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            offset.set(minX, minY);
            size.set(maxX - minX, maxY - minY);
        }
        /** Increments the skeleton's {@link #time}. */
        update(delta) {
            this.time += delta;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose and all of the stateless data for a skeleton.
     *
     * See [Data objects](http://esotericsoftware.com/spine-runtime-architecture#Data-objects) in the Spine Runtimes
     * Guide. */
    class SkeletonData {
        constructor() {
            /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
            this.name = null;
            /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
            this.bones = new Array(); // Ordered parents first.
            /** The skeleton's slots. */
            this.slots = new Array(); // Setup pose draw order.
            this.skins = new Array();
            /** The skeleton's default skin. By default this skin contains all attachments that were not in a skin in Spine.
             *
             * See {@link Skeleton#getAttachmentByName()}.
             * May be null. */
            this.defaultSkin = null;
            /** The skeleton's events. */
            this.events = new Array();
            /** The skeleton's animations. */
            this.animations = new Array();
            /** The skeleton's IK constraints. */
            this.ikConstraints = new Array();
            /** The skeleton's transform constraints. */
            this.transformConstraints = new Array();
            /** The skeleton's path constraints. */
            this.pathConstraints = new Array();
            /** The X coordinate of the skeleton's axis aligned bounding box in the setup pose. */
            this.x = 0;
            /** The Y coordinate of the skeleton's axis aligned bounding box in the setup pose. */
            this.y = 0;
            /** The width of the skeleton's axis aligned bounding box in the setup pose. */
            this.width = 0;
            /** The height of the skeleton's axis aligned bounding box in the setup pose. */
            this.height = 0;
            /** The Spine version used to export the skeleton data, or null. */
            this.version = null;
            /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
            this.hash = null;
            // Nonessential
            /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
            this.fps = 0;
            /** The path to the images directory as defined in Spine. Available only when nonessential data was exported. May be null. */
            this.imagesPath = null;
            /** The path to the audio directory as defined in Spine. Available only when nonessential data was exported. May be null. */
            this.audioPath = null;
        }
        /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        findBone(boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            let bones = this.bones;
            for (let i = 0, n = bones.length; i < n; i++) {
                let bone = bones[i];
                if (bone.name == boneName)
                    return bone;
            }
            return null;
        }
        /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        findSlot(slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            let slots = this.slots;
            for (let i = 0, n = slots.length; i < n; i++) {
                let slot = slots[i];
                if (slot.name == slotName)
                    return slot;
            }
            return null;
        }
        /** Finds a skin by comparing each skin's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        findSkin(skinName) {
            if (!skinName)
                throw new Error("skinName cannot be null.");
            let skins = this.skins;
            for (let i = 0, n = skins.length; i < n; i++) {
                let skin = skins[i];
                if (skin.name == skinName)
                    return skin;
            }
            return null;
        }
        /** Finds an event by comparing each events's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        findEvent(eventDataName) {
            if (!eventDataName)
                throw new Error("eventDataName cannot be null.");
            let events = this.events;
            for (let i = 0, n = events.length; i < n; i++) {
                let event = events[i];
                if (event.name == eventDataName)
                    return event;
            }
            return null;
        }
        /** Finds an animation by comparing each animation's name. It is more efficient to cache the results of this method than to
         * call it multiple times.
         * @returns May be null. */
        findAnimation(animationName) {
            if (!animationName)
                throw new Error("animationName cannot be null.");
            let animations = this.animations;
            for (let i = 0, n = animations.length; i < n; i++) {
                let animation = animations[i];
                if (animation.name == animationName)
                    return animation;
            }
            return null;
        }
        /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
         * than to call it multiple times.
         * @return May be null. */
        findIkConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let ikConstraints = this.ikConstraints;
            for (let i = 0, n = ikConstraints.length; i < n; i++) {
                let constraint = ikConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        }
        /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
         * this method than to call it multiple times.
         * @return May be null. */
        findTransformConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let transformConstraints = this.transformConstraints;
            for (let i = 0, n = transformConstraints.length; i < n; i++) {
                let constraint = transformConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        }
        /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
         * than to call it multiple times.
         * @return May be null. */
        findPathConstraint(constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            let pathConstraints = this.pathConstraints;
            for (let i = 0, n = pathConstraints.length; i < n; i++) {
                let constraint = pathConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores an entry in the skin consisting of the slot index, name, and attachment **/
    class SkinEntry {
        constructor(slotIndex = 0, name = null, attachment = null) {
            this.slotIndex = slotIndex;
            this.name = name;
            this.attachment = attachment;
        }
    }
    /** Stores attachments by slot index and attachment name.
     *
     * See SkeletonData {@link SkeletonData#defaultSkin}, Skeleton {@link Skeleton#skin}, and
     * [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide. */
    class Skin {
        constructor(name) {
            /** The skin's name, which is unique across all skins in the skeleton. */
            this.name = null;
            this.attachments = new Array();
            this.bones = Array();
            this.constraints = new Array();
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
        }
        /** Adds an attachment to the skin for the specified slot index and name. */
        setAttachment(slotIndex, name, attachment) {
            if (!attachment)
                throw new Error("attachment cannot be null.");
            let attachments = this.attachments;
            if (slotIndex >= attachments.length)
                attachments.length = slotIndex + 1;
            if (!attachments[slotIndex])
                attachments[slotIndex] = {};
            attachments[slotIndex][name] = attachment;
        }
        /** Adds all attachments, bones, and constraints from the specified skin to this skin. */
        addSkin(skin) {
            for (let i = 0; i < skin.bones.length; i++) {
                let bone = skin.bones[i];
                let contained = false;
                for (let ii = 0; ii < this.bones.length; ii++) {
                    if (this.bones[ii] == bone) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.bones.push(bone);
            }
            for (let i = 0; i < skin.constraints.length; i++) {
                let constraint = skin.constraints[i];
                let contained = false;
                for (let ii = 0; ii < this.constraints.length; ii++) {
                    if (this.constraints[ii] == constraint) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.constraints.push(constraint);
            }
            let attachments = skin.getAttachments();
            for (let i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];
                this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
            }
        }
        /** Adds all bones and constraints and copies of all attachments from the specified skin to this skin. Mesh attachments are not
         * copied, instead a new linked mesh is created. The attachment copies can be modified without affecting the originals. */
        copySkin(skin) {
            for (let i = 0; i < skin.bones.length; i++) {
                let bone = skin.bones[i];
                let contained = false;
                for (let ii = 0; ii < this.bones.length; ii++) {
                    if (this.bones[ii] == bone) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.bones.push(bone);
            }
            for (let i = 0; i < skin.constraints.length; i++) {
                let constraint = skin.constraints[i];
                let contained = false;
                for (let ii = 0; ii < this.constraints.length; ii++) {
                    if (this.constraints[ii] == constraint) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.constraints.push(constraint);
            }
            let attachments = skin.getAttachments();
            for (let i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];
                if (!attachment.attachment)
                    continue;
                if (attachment.attachment instanceof MeshAttachment) {
                    attachment.attachment = attachment.attachment.newLinkedMesh();
                    this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
                }
                else {
                    attachment.attachment = attachment.attachment.copy();
                    this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
                }
            }
        }
        /** Returns the attachment for the specified slot index and name, or null. */
        getAttachment(slotIndex, name) {
            let dictionary = this.attachments[slotIndex];
            return dictionary ? dictionary[name] : null;
        }
        /** Removes the attachment in the skin for the specified slot index and name, if any. */
        removeAttachment(slotIndex, name) {
            let dictionary = this.attachments[slotIndex];
            if (dictionary)
                dictionary[name] = null;
        }
        /** Returns all attachments in this skin. */
        getAttachments() {
            let entries = new Array();
            for (var i = 0; i < this.attachments.length; i++) {
                let slotAttachments = this.attachments[i];
                if (slotAttachments) {
                    for (let name in slotAttachments) {
                        let attachment = slotAttachments[name];
                        if (attachment)
                            entries.push(new SkinEntry(i, name, attachment));
                    }
                }
            }
            return entries;
        }
        /** Returns all attachments in this skin for the specified slot index. */
        getAttachmentsForSlot(slotIndex, attachments) {
            let slotAttachments = this.attachments[slotIndex];
            if (slotAttachments) {
                for (let name in slotAttachments) {
                    let attachment = slotAttachments[name];
                    if (attachment)
                        attachments.push(new SkinEntry(slotIndex, name, attachment));
                }
            }
        }
        /** Clears all attachments, bones, and constraints. */
        clear() {
            this.attachments.length = 0;
            this.bones.length = 0;
            this.constraints.length = 0;
        }
        /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
        attachAll(skeleton, oldSkin) {
            let slotIndex = 0;
            for (let i = 0; i < skeleton.slots.length; i++) {
                let slot = skeleton.slots[i];
                let slotAttachment = slot.getAttachment();
                if (slotAttachment && slotIndex < oldSkin.attachments.length) {
                    let dictionary = oldSkin.attachments[slotIndex];
                    for (let key in dictionary) {
                        let skinAttachment = dictionary[key];
                        if (slotAttachment == skinAttachment) {
                            let attachment = this.getAttachment(slotIndex, key);
                            if (attachment)
                                slot.setAttachment(attachment);
                            break;
                        }
                    }
                }
                slotIndex++;
            }
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose for a {@link Slot}. */
    class SlotData {
        constructor(index, name, boneData) {
            /** The index of the slot in {@link Skeleton#getSlots()}. */
            this.index = 0;
            /** The name of the slot, which is unique across all slots in the skeleton. */
            this.name = null;
            /** The bone this slot belongs to. */
            this.boneData = null;
            /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
             * color tinting. */
            this.color = new Color(1, 1, 1, 1);
            /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
             * color's alpha is not used. */
            this.darkColor = null;
            /** The name of the attachment that is visible for this slot in the setup pose, or null if no attachment is visible. */
            this.attachmentName = null;
            /** The blend mode for drawing the slot's attachment. */
            this.blendMode = null;
            if (index < 0)
                throw new Error("index must be >= 0.");
            if (!name)
                throw new Error("name cannot be null.");
            if (!boneData)
                throw new Error("boneData cannot be null.");
            this.index = index;
            this.name = name;
            this.boneData = boneData;
        }
    }
    (function (BlendMode) {
        BlendMode[BlendMode["Normal"] = 0] = "Normal";
        BlendMode[BlendMode["Additive"] = 1] = "Additive";
        BlendMode[BlendMode["Multiply"] = 2] = "Multiply";
        BlendMode[BlendMode["Screen"] = 3] = "Screen";
    })(exports.BlendMode || (exports.BlendMode = {}));

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Stores the setup pose for a {@link TransformConstraint}.
     *
     * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide. */
    class TransformConstraintData extends ConstraintData {
        constructor(name) {
            super(name, 0, false);
            /** The bones that will be modified by this transform constraint. */
            this.bones = new Array();
            /** The target bone whose world transform will be copied to the constrained bones. */
            this.target = null;
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
            this.mixScaleX = 0;
            this.mixScaleY = 0;
            this.mixShearY = 0;
            /** An offset added to the constrained bone rotation. */
            this.offsetRotation = 0;
            /** An offset added to the constrained bone X translation. */
            this.offsetX = 0;
            /** An offset added to the constrained bone Y translation. */
            this.offsetY = 0;
            /** An offset added to the constrained bone scaleX. */
            this.offsetScaleX = 0;
            /** An offset added to the constrained bone scaleY. */
            this.offsetScaleY = 0;
            /** An offset added to the constrained bone shearY. */
            this.offsetShearY = 0;
            this.relative = false;
            this.local = false;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Loads skeleton data in the Spine binary format.
     *
     * See [Spine binary format](http://esotericsoftware.com/spine-binary-format) and
     * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
     * Runtimes Guide. */
    class SkeletonBinary {
        constructor(attachmentLoader) {
            /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
             * runtime than were used in Spine.
             *
             * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
            this.scale = 1;
            this.attachmentLoader = null;
            this.linkedMeshes = new Array();
            this.attachmentLoader = attachmentLoader;
        }
        readSkeletonData(binary) {
            let scale = this.scale;
            let skeletonData = new SkeletonData();
            skeletonData.name = ""; // BOZO
            let input = new BinaryInput(binary);
            let lowHash = input.readInt32();
            let highHash = input.readInt32();
            skeletonData.hash = highHash == 0 && lowHash == 0 ? null : highHash.toString(16) + lowHash.toString(16);
            skeletonData.version = input.readString();
            skeletonData.x = input.readFloat();
            skeletonData.y = input.readFloat();
            skeletonData.width = input.readFloat();
            skeletonData.height = input.readFloat();
            let nonessential = input.readBoolean();
            if (nonessential) {
                skeletonData.fps = input.readFloat();
                skeletonData.imagesPath = input.readString();
                skeletonData.audioPath = input.readString();
            }
            let n = 0;
            // Strings.
            n = input.readInt(true);
            for (let i = 0; i < n; i++)
                input.strings.push(input.readString());
            // Bones.
            n = input.readInt(true);
            for (let i = 0; i < n; i++) {
                let name = input.readString();
                let parent = i == 0 ? null : skeletonData.bones[input.readInt(true)];
                let data = new BoneData(i, name, parent);
                data.rotation = input.readFloat();
                data.x = input.readFloat() * scale;
                data.y = input.readFloat() * scale;
                data.scaleX = input.readFloat();
                data.scaleY = input.readFloat();
                data.shearX = input.readFloat();
                data.shearY = input.readFloat();
                data.length = input.readFloat() * scale;
                data.transformMode = input.readInt(true);
                data.skinRequired = input.readBoolean();
                if (nonessential)
                    Color.rgba8888ToColor(data.color, input.readInt32());
                skeletonData.bones.push(data);
            }
            // Slots.
            n = input.readInt(true);
            for (let i = 0; i < n; i++) {
                let slotName = input.readString();
                let boneData = skeletonData.bones[input.readInt(true)];
                let data = new SlotData(i, slotName, boneData);
                Color.rgba8888ToColor(data.color, input.readInt32());
                let darkColor = input.readInt32();
                if (darkColor != -1)
                    Color.rgb888ToColor(data.darkColor = new Color(), darkColor);
                data.attachmentName = input.readStringRef();
                data.blendMode = input.readInt(true);
                skeletonData.slots.push(data);
            }
            // IK constraints.
            n = input.readInt(true);
            for (let i = 0, nn; i < n; i++) {
                let data = new IkConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (let ii = 0; ii < nn; ii++)
                    data.bones.push(skeletonData.bones[input.readInt(true)]);
                data.target = skeletonData.bones[input.readInt(true)];
                data.mix = input.readFloat();
                data.softness = input.readFloat() * scale;
                data.bendDirection = input.readByte();
                data.compress = input.readBoolean();
                data.stretch = input.readBoolean();
                data.uniform = input.readBoolean();
                skeletonData.ikConstraints.push(data);
            }
            // Transform constraints.
            n = input.readInt(true);
            for (let i = 0, nn; i < n; i++) {
                let data = new TransformConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (let ii = 0; ii < nn; ii++)
                    data.bones.push(skeletonData.bones[input.readInt(true)]);
                data.target = skeletonData.bones[input.readInt(true)];
                data.local = input.readBoolean();
                data.relative = input.readBoolean();
                data.offsetRotation = input.readFloat();
                data.offsetX = input.readFloat() * scale;
                data.offsetY = input.readFloat() * scale;
                data.offsetScaleX = input.readFloat();
                data.offsetScaleY = input.readFloat();
                data.offsetShearY = input.readFloat();
                data.mixRotate = input.readFloat();
                data.mixX = input.readFloat();
                data.mixY = input.readFloat();
                data.mixScaleX = input.readFloat();
                data.mixScaleY = input.readFloat();
                data.mixShearY = input.readFloat();
                skeletonData.transformConstraints.push(data);
            }
            // Path constraints.
            n = input.readInt(true);
            for (let i = 0, nn; i < n; i++) {
                let data = new PathConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (let ii = 0; ii < nn; ii++)
                    data.bones.push(skeletonData.bones[input.readInt(true)]);
                data.target = skeletonData.slots[input.readInt(true)];
                data.positionMode = input.readInt(true);
                data.spacingMode = input.readInt(true);
                data.rotateMode = input.readInt(true);
                data.offsetRotation = input.readFloat();
                data.position = input.readFloat();
                if (data.positionMode == exports.PositionMode.Fixed)
                    data.position *= scale;
                data.spacing = input.readFloat();
                if (data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed)
                    data.spacing *= scale;
                data.mixRotate = input.readFloat();
                data.mixX = input.readFloat();
                data.mixY = input.readFloat();
                skeletonData.pathConstraints.push(data);
            }
            // Default skin.
            let defaultSkin = this.readSkin(input, skeletonData, true, nonessential);
            if (defaultSkin) {
                skeletonData.defaultSkin = defaultSkin;
                skeletonData.skins.push(defaultSkin);
            }
            // Skins.
            {
                let i = skeletonData.skins.length;
                Utils.setArraySize(skeletonData.skins, n = i + input.readInt(true));
                for (; i < n; i++)
                    skeletonData.skins[i] = this.readSkin(input, skeletonData, false, nonessential);
            }
            // Linked meshes.
            n = this.linkedMeshes.length;
            for (let i = 0; i < n; i++) {
                let linkedMesh = this.linkedMeshes[i];
                let skin = !linkedMesh.skin ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
                let parent = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
                linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent : linkedMesh.mesh;
                linkedMesh.mesh.setParentMesh(parent);
                linkedMesh.mesh.updateUVs();
            }
            this.linkedMeshes.length = 0;
            // Events.
            n = input.readInt(true);
            for (let i = 0; i < n; i++) {
                let data = new EventData(input.readStringRef());
                data.intValue = input.readInt(false);
                data.floatValue = input.readFloat();
                data.stringValue = input.readString();
                data.audioPath = input.readString();
                if (data.audioPath) {
                    data.volume = input.readFloat();
                    data.balance = input.readFloat();
                }
                skeletonData.events.push(data);
            }
            // Animations.
            n = input.readInt(true);
            for (let i = 0; i < n; i++)
                skeletonData.animations.push(this.readAnimation(input, input.readString(), skeletonData));
            return skeletonData;
        }
        readSkin(input, skeletonData, defaultSkin, nonessential) {
            let skin = null;
            let slotCount = 0;
            if (defaultSkin) {
                slotCount = input.readInt(true);
                if (slotCount == 0)
                    return null;
                skin = new Skin("default");
            }
            else {
                skin = new Skin(input.readStringRef());
                skin.bones.length = input.readInt(true);
                for (let i = 0, n = skin.bones.length; i < n; i++)
                    skin.bones[i] = skeletonData.bones[input.readInt(true)];
                for (let i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.ikConstraints[input.readInt(true)]);
                for (let i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.transformConstraints[input.readInt(true)]);
                for (let i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.pathConstraints[input.readInt(true)]);
                slotCount = input.readInt(true);
            }
            for (let i = 0; i < slotCount; i++) {
                let slotIndex = input.readInt(true);
                for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    let name = input.readStringRef();
                    let attachment = this.readAttachment(input, skeletonData, skin, slotIndex, name, nonessential);
                    if (attachment)
                        skin.setAttachment(slotIndex, name, attachment);
                }
            }
            return skin;
        }
        readAttachment(input, skeletonData, skin, slotIndex, attachmentName, nonessential) {
            let scale = this.scale;
            let name = input.readStringRef();
            if (!name)
                name = attachmentName;
            switch (input.readByte()) {
                case AttachmentType.Region: {
                    let path = input.readStringRef();
                    let rotation = input.readFloat();
                    let x = input.readFloat();
                    let y = input.readFloat();
                    let scaleX = input.readFloat();
                    let scaleY = input.readFloat();
                    let width = input.readFloat();
                    let height = input.readFloat();
                    let color = input.readInt32();
                    if (!path)
                        path = name;
                    let region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                    if (!region)
                        return null;
                    region.path = path;
                    region.x = x * scale;
                    region.y = y * scale;
                    region.scaleX = scaleX;
                    region.scaleY = scaleY;
                    region.rotation = rotation;
                    region.width = width * scale;
                    region.height = height * scale;
                    Color.rgba8888ToColor(region.color, color);
                    region.updateOffset();
                    return region;
                }
                case AttachmentType.BoundingBox: {
                    let vertexCount = input.readInt(true);
                    let vertices = this.readVertices(input, vertexCount);
                    let color = nonessential ? input.readInt32() : 0;
                    let box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                    if (!box)
                        return null;
                    box.worldVerticesLength = vertexCount << 1;
                    box.vertices = vertices.vertices;
                    box.bones = vertices.bones;
                    if (nonessential)
                        Color.rgba8888ToColor(box.color, color);
                    return box;
                }
                case AttachmentType.Mesh: {
                    let path = input.readStringRef();
                    let color = input.readInt32();
                    let vertexCount = input.readInt(true);
                    let uvs = this.readFloatArray(input, vertexCount << 1, 1);
                    let triangles = this.readShortArray(input);
                    let vertices = this.readVertices(input, vertexCount);
                    let hullLength = input.readInt(true);
                    let edges = null;
                    let width = 0, height = 0;
                    if (nonessential) {
                        edges = this.readShortArray(input);
                        width = input.readFloat();
                        height = input.readFloat();
                    }
                    if (!path)
                        path = name;
                    let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    Color.rgba8888ToColor(mesh.color, color);
                    mesh.bones = vertices.bones;
                    mesh.vertices = vertices.vertices;
                    mesh.worldVerticesLength = vertexCount << 1;
                    mesh.triangles = triangles;
                    mesh.regionUVs = uvs;
                    mesh.updateUVs();
                    mesh.hullLength = hullLength << 1;
                    if (nonessential) {
                        mesh.edges = edges;
                        mesh.width = width * scale;
                        mesh.height = height * scale;
                    }
                    return mesh;
                }
                case AttachmentType.LinkedMesh: {
                    let path = input.readStringRef();
                    let color = input.readInt32();
                    let skinName = input.readStringRef();
                    let parent = input.readStringRef();
                    let inheritDeform = input.readBoolean();
                    let width = 0, height = 0;
                    if (nonessential) {
                        width = input.readFloat();
                        height = input.readFloat();
                    }
                    if (!path)
                        path = name;
                    let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    Color.rgba8888ToColor(mesh.color, color);
                    if (nonessential) {
                        mesh.width = width * scale;
                        mesh.height = height * scale;
                    }
                    this.linkedMeshes.push(new LinkedMesh(mesh, skinName, slotIndex, parent, inheritDeform));
                    return mesh;
                }
                case AttachmentType.Path: {
                    let closed = input.readBoolean();
                    let constantSpeed = input.readBoolean();
                    let vertexCount = input.readInt(true);
                    let vertices = this.readVertices(input, vertexCount);
                    let lengths = Utils.newArray(vertexCount / 3, 0);
                    for (let i = 0, n = lengths.length; i < n; i++)
                        lengths[i] = input.readFloat() * scale;
                    let color = nonessential ? input.readInt32() : 0;
                    let path = this.attachmentLoader.newPathAttachment(skin, name);
                    if (!path)
                        return null;
                    path.closed = closed;
                    path.constantSpeed = constantSpeed;
                    path.worldVerticesLength = vertexCount << 1;
                    path.vertices = vertices.vertices;
                    path.bones = vertices.bones;
                    path.lengths = lengths;
                    if (nonessential)
                        Color.rgba8888ToColor(path.color, color);
                    return path;
                }
                case AttachmentType.Point: {
                    let rotation = input.readFloat();
                    let x = input.readFloat();
                    let y = input.readFloat();
                    let color = nonessential ? input.readInt32() : 0;
                    let point = this.attachmentLoader.newPointAttachment(skin, name);
                    if (!point)
                        return null;
                    point.x = x * scale;
                    point.y = y * scale;
                    point.rotation = rotation;
                    if (nonessential)
                        Color.rgba8888ToColor(point.color, color);
                    return point;
                }
                case AttachmentType.Clipping: {
                    let endSlotIndex = input.readInt(true);
                    let vertexCount = input.readInt(true);
                    let vertices = this.readVertices(input, vertexCount);
                    let color = nonessential ? input.readInt32() : 0;
                    let clip = this.attachmentLoader.newClippingAttachment(skin, name);
                    if (!clip)
                        return null;
                    clip.endSlot = skeletonData.slots[endSlotIndex];
                    clip.worldVerticesLength = vertexCount << 1;
                    clip.vertices = vertices.vertices;
                    clip.bones = vertices.bones;
                    if (nonessential)
                        Color.rgba8888ToColor(clip.color, color);
                    return clip;
                }
            }
            return null;
        }
        readVertices(input, vertexCount) {
            let scale = this.scale;
            let verticesLength = vertexCount << 1;
            let vertices = new Vertices();
            if (!input.readBoolean()) {
                vertices.vertices = this.readFloatArray(input, verticesLength, scale);
                return vertices;
            }
            let weights = new Array();
            let bonesArray = new Array();
            for (let i = 0; i < vertexCount; i++) {
                let boneCount = input.readInt(true);
                bonesArray.push(boneCount);
                for (let ii = 0; ii < boneCount; ii++) {
                    bonesArray.push(input.readInt(true));
                    weights.push(input.readFloat() * scale);
                    weights.push(input.readFloat() * scale);
                    weights.push(input.readFloat());
                }
            }
            vertices.vertices = Utils.toFloatArray(weights);
            vertices.bones = bonesArray;
            return vertices;
        }
        readFloatArray(input, n, scale) {
            let array = new Array(n);
            if (scale == 1) {
                for (let i = 0; i < n; i++)
                    array[i] = input.readFloat();
            }
            else {
                for (let i = 0; i < n; i++)
                    array[i] = input.readFloat() * scale;
            }
            return array;
        }
        readShortArray(input) {
            let n = input.readInt(true);
            let array = new Array(n);
            for (let i = 0; i < n; i++)
                array[i] = input.readShort();
            return array;
        }
        readAnimation(input, name, skeletonData) {
            input.readInt(true); // Number of timelines.
            let timelines = new Array();
            let scale = this.scale;
            // Slot timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let slotIndex = input.readInt(true);
                for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    let timelineType = input.readByte();
                    let frameCount = input.readInt(true);
                    let frameLast = frameCount - 1;
                    switch (timelineType) {
                        case SLOT_ATTACHMENT: {
                            let timeline = new AttachmentTimeline(frameCount, slotIndex);
                            for (let frame = 0; frame < frameCount; frame++)
                                timeline.setFrame(frame, input.readFloat(), input.readStringRef());
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGBA: {
                            let bezierCount = input.readInt(true);
                            let timeline = new RGBATimeline(frameCount, bezierCount, slotIndex);
                            let time = input.readFloat();
                            let r = input.readUnsignedByte() / 255.0;
                            let g = input.readUnsignedByte() / 255.0;
                            let b = input.readUnsignedByte() / 255.0;
                            let a = input.readUnsignedByte() / 255.0;
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, a);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat();
                                let r2 = input.readUnsignedByte() / 255.0;
                                let g2 = input.readUnsignedByte() / 255.0;
                                let b2 = input.readUnsignedByte() / 255.0;
                                let a2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, a, a2, 1);
                                }
                                time = time2;
                                r = r2;
                                g = g2;
                                b = b2;
                                a = a2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGB: {
                            let bezierCount = input.readInt(true);
                            let timeline = new RGBTimeline(frameCount, bezierCount, slotIndex);
                            let time = input.readFloat();
                            let r = input.readUnsignedByte() / 255.0;
                            let g = input.readUnsignedByte() / 255.0;
                            let b = input.readUnsignedByte() / 255.0;
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat();
                                let r2 = input.readUnsignedByte() / 255.0;
                                let g2 = input.readUnsignedByte() / 255.0;
                                let b2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                                }
                                time = time2;
                                r = r2;
                                g = g2;
                                b = b2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGBA2: {
                            let bezierCount = input.readInt(true);
                            let timeline = new RGBA2Timeline(frameCount, bezierCount, slotIndex);
                            let time = input.readFloat();
                            let r = input.readUnsignedByte() / 255.0;
                            let g = input.readUnsignedByte() / 255.0;
                            let b = input.readUnsignedByte() / 255.0;
                            let a = input.readUnsignedByte() / 255.0;
                            let r2 = input.readUnsignedByte() / 255.0;
                            let g2 = input.readUnsignedByte() / 255.0;
                            let b2 = input.readUnsignedByte() / 255.0;
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, a, r2, g2, b2);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat();
                                let nr = input.readUnsignedByte() / 255.0;
                                let ng = input.readUnsignedByte() / 255.0;
                                let nb = input.readUnsignedByte() / 255.0;
                                let na = input.readUnsignedByte() / 255.0;
                                let nr2 = input.readUnsignedByte() / 255.0;
                                let ng2 = input.readUnsignedByte() / 255.0;
                                let nb2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, a, na, 1);
                                        setBezier(input, timeline, bezier++, frame, 4, time, time2, r2, nr2, 1);
                                        setBezier(input, timeline, bezier++, frame, 5, time, time2, g2, ng2, 1);
                                        setBezier(input, timeline, bezier++, frame, 6, time, time2, b2, nb2, 1);
                                }
                                time = time2;
                                r = nr;
                                g = ng;
                                b = nb;
                                a = na;
                                r2 = nr2;
                                g2 = ng2;
                                b2 = nb2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGB2: {
                            let bezierCount = input.readInt(true);
                            let timeline = new RGB2Timeline(frameCount, bezierCount, slotIndex);
                            let time = input.readFloat();
                            let r = input.readUnsignedByte() / 255.0;
                            let g = input.readUnsignedByte() / 255.0;
                            let b = input.readUnsignedByte() / 255.0;
                            let r2 = input.readUnsignedByte() / 255.0;
                            let g2 = input.readUnsignedByte() / 255.0;
                            let b2 = input.readUnsignedByte() / 255.0;
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, r2, g2, b2);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat();
                                let nr = input.readUnsignedByte() / 255.0;
                                let ng = input.readUnsignedByte() / 255.0;
                                let nb = input.readUnsignedByte() / 255.0;
                                let nr2 = input.readUnsignedByte() / 255.0;
                                let ng2 = input.readUnsignedByte() / 255.0;
                                let nb2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, r2, nr2, 1);
                                        setBezier(input, timeline, bezier++, frame, 4, time, time2, g2, ng2, 1);
                                        setBezier(input, timeline, bezier++, frame, 5, time, time2, b2, nb2, 1);
                                }
                                time = time2;
                                r = nr;
                                g = ng;
                                b = nb;
                                r2 = nr2;
                                g2 = ng2;
                                b2 = nb2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_ALPHA: {
                            let timeline = new AlphaTimeline(frameCount, input.readInt(true), slotIndex);
                            let time = input.readFloat(), a = input.readUnsignedByte() / 255;
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, a);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat();
                                let a2 = input.readUnsignedByte() / 255;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, a, a2, 1);
                                }
                                time = time2;
                                a = a2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                    }
                }
            }
            // Bone timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let boneIndex = input.readInt(true);
                for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    let type = input.readByte(), frameCount = input.readInt(true), bezierCount = input.readInt(true);
                    switch (type) {
                        case BONE_ROTATE:
                            timelines.push(readTimeline1(input, new RotateTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_TRANSLATE:
                            timelines.push(readTimeline2(input, new TranslateTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_TRANSLATEX:
                            timelines.push(readTimeline1(input, new TranslateXTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_TRANSLATEY:
                            timelines.push(readTimeline1(input, new TranslateYTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_SCALE:
                            timelines.push(readTimeline2(input, new ScaleTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SCALEX:
                            timelines.push(readTimeline1(input, new ScaleXTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SCALEY:
                            timelines.push(readTimeline1(input, new ScaleYTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEAR:
                            timelines.push(readTimeline2(input, new ShearTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEARX:
                            timelines.push(readTimeline1(input, new ShearXTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEARY:
                            timelines.push(readTimeline1(input, new ShearYTimeline(frameCount, bezierCount, boneIndex), 1));
                    }
                }
            }
            // IK constraint timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
                let timeline = new IkConstraintTimeline(frameCount, input.readInt(true), index);
                let time = input.readFloat(), mix = input.readFloat(), softness = input.readFloat() * scale;
                for (let frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mix, softness, input.readByte(), input.readBoolean(), input.readBoolean());
                    if (frame == frameLast)
                        break;
                    let time2 = input.readFloat(), mix2 = input.readFloat(), softness2 = input.readFloat() * scale;
                    switch (input.readByte()) {
                        case CURVE_STEPPED:
                            timeline.setStepped(frame);
                            break;
                        case CURVE_BEZIER:
                            setBezier(input, timeline, bezier++, frame, 0, time, time2, mix, mix2, 1);
                            setBezier(input, timeline, bezier++, frame, 1, time, time2, softness, softness2, scale);
                    }
                    time = time2;
                    mix = mix2;
                    softness = softness2;
                }
                timelines.push(timeline);
            }
            // Transform constraint timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
                let timeline = new TransformConstraintTimeline(frameCount, input.readInt(true), index);
                let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat(), mixScaleX = input.readFloat(), mixScaleY = input.readFloat(), mixShearY = input.readFloat();
                for (let frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                    if (frame == frameLast)
                        break;
                    let time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat(), mixScaleX2 = input.readFloat(), mixScaleY2 = input.readFloat(), mixShearY2 = input.readFloat();
                    switch (input.readByte()) {
                        case CURVE_STEPPED:
                            timeline.setStepped(frame);
                            break;
                        case CURVE_BEZIER:
                            setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                            setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                            setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
                            setBezier(input, timeline, bezier++, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                            setBezier(input, timeline, bezier++, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                            setBezier(input, timeline, bezier++, frame, 5, time, time2, mixShearY, mixShearY2, 1);
                    }
                    time = time2;
                    mixRotate = mixRotate2;
                    mixX = mixX2;
                    mixY = mixY2;
                    mixScaleX = mixScaleX2;
                    mixScaleY = mixScaleY2;
                    mixShearY = mixShearY2;
                }
                timelines.push(timeline);
            }
            // Path constraint timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let index = input.readInt(true);
                let data = skeletonData.pathConstraints[index];
                for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    switch (input.readByte()) {
                        case PATH_POSITION:
                            timelines
                                .push(readTimeline1(input, new PathConstraintPositionTimeline(input.readInt(true), input.readInt(true), index), data.positionMode == exports.PositionMode.Fixed ? scale : 1));
                            break;
                        case PATH_SPACING:
                            timelines
                                .push(readTimeline1(input, new PathConstraintSpacingTimeline(input.readInt(true), input.readInt(true), index), data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed ? scale : 1));
                            break;
                        case PATH_MIX:
                            let timeline = new PathConstraintMixTimeline(input.readInt(true), input.readInt(true), index);
                            let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat();
                            for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
                                timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                                if (frame == frameLast)
                                    break;
                                let time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat();
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
                                }
                                time = time2;
                                mixRotate = mixRotate2;
                                mixX = mixX2;
                                mixY = mixY2;
                            }
                            timelines.push(timeline);
                    }
                }
            }
            // Deform timelines.
            for (let i = 0, n = input.readInt(true); i < n; i++) {
                let skin = skeletonData.skins[input.readInt(true)];
                for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    let slotIndex = input.readInt(true);
                    for (let iii = 0, nnn = input.readInt(true); iii < nnn; iii++) {
                        let attachmentName = input.readStringRef();
                        let attachment = skin.getAttachment(slotIndex, attachmentName);
                        let weighted = attachment.bones;
                        let vertices = attachment.vertices;
                        let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                        let frameCount = input.readInt(true);
                        let frameLast = frameCount - 1;
                        let bezierCount = input.readInt(true);
                        let timeline = new DeformTimeline(frameCount, bezierCount, slotIndex, attachment);
                        let time = input.readFloat();
                        for (let frame = 0, bezier = 0;; frame++) {
                            let deform;
                            let end = input.readInt(true);
                            if (end == 0)
                                deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                            else {
                                deform = Utils.newFloatArray(deformLength);
                                let start = input.readInt(true);
                                end += start;
                                if (scale == 1) {
                                    for (let v = start; v < end; v++)
                                        deform[v] = input.readFloat();
                                }
                                else {
                                    for (let v = start; v < end; v++)
                                        deform[v] = input.readFloat() * scale;
                                }
                                if (!weighted) {
                                    for (let v = 0, vn = deform.length; v < vn; v++)
                                        deform[v] += vertices[v];
                                }
                            }
                            timeline.setFrame(frame, time, deform);
                            if (frame == frameLast)
                                break;
                            let time2 = input.readFloat();
                            switch (input.readByte()) {
                                case CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case CURVE_BEZIER:
                                    setBezier(input, timeline, bezier++, frame, 0, time, time2, 0, 1, 1);
                            }
                            time = time2;
                        }
                        timelines.push(timeline);
                    }
                }
            }
            // Draw order timeline.
            let drawOrderCount = input.readInt(true);
            if (drawOrderCount > 0) {
                let timeline = new DrawOrderTimeline(drawOrderCount);
                let slotCount = skeletonData.slots.length;
                for (let i = 0; i < drawOrderCount; i++) {
                    let time = input.readFloat();
                    let offsetCount = input.readInt(true);
                    let drawOrder = Utils.newArray(slotCount, 0);
                    for (let ii = slotCount - 1; ii >= 0; ii--)
                        drawOrder[ii] = -1;
                    let unchanged = Utils.newArray(slotCount - offsetCount, 0);
                    let originalIndex = 0, unchangedIndex = 0;
                    for (let ii = 0; ii < offsetCount; ii++) {
                        let slotIndex = input.readInt(true);
                        // Collect unchanged items.
                        while (originalIndex != slotIndex)
                            unchanged[unchangedIndex++] = originalIndex++;
                        // Set changed items.
                        drawOrder[originalIndex + input.readInt(true)] = originalIndex++;
                    }
                    // Collect remaining unchanged items.
                    while (originalIndex < slotCount)
                        unchanged[unchangedIndex++] = originalIndex++;
                    // Fill in unchanged items.
                    for (let ii = slotCount - 1; ii >= 0; ii--)
                        if (drawOrder[ii] == -1)
                            drawOrder[ii] = unchanged[--unchangedIndex];
                    timeline.setFrame(i, time, drawOrder);
                }
                timelines.push(timeline);
            }
            // Event timeline.
            let eventCount = input.readInt(true);
            if (eventCount > 0) {
                let timeline = new EventTimeline(eventCount);
                for (let i = 0; i < eventCount; i++) {
                    let time = input.readFloat();
                    let eventData = skeletonData.events[input.readInt(true)];
                    let event = new Event(time, eventData);
                    event.intValue = input.readInt(false);
                    event.floatValue = input.readFloat();
                    event.stringValue = input.readBoolean() ? input.readString() : eventData.stringValue;
                    if (event.data.audioPath) {
                        event.volume = input.readFloat();
                        event.balance = input.readFloat();
                    }
                    timeline.setFrame(i, event);
                }
                timelines.push(timeline);
            }
            let duration = 0;
            for (let i = 0, n = timelines.length; i < n; i++)
                duration = Math.max(duration, timelines[i].getDuration());
            return new Animation(name, timelines, duration);
        }
    }
    class BinaryInput {
        constructor(data, strings = new Array(), index = 0, buffer = new DataView(data.buffer)) {
            this.strings = strings;
            this.index = index;
            this.buffer = buffer;
        }
        readByte() {
            return this.buffer.getInt8(this.index++);
        }
        readUnsignedByte() {
            return this.buffer.getUint8(this.index++);
        }
        readShort() {
            let value = this.buffer.getInt16(this.index);
            this.index += 2;
            return value;
        }
        readInt32() {
            let value = this.buffer.getInt32(this.index);
            this.index += 4;
            return value;
        }
        readInt(optimizePositive) {
            let b = this.readByte();
            let result = b & 0x7F;
            if ((b & 0x80) != 0) {
                b = this.readByte();
                result |= (b & 0x7F) << 7;
                if ((b & 0x80) != 0) {
                    b = this.readByte();
                    result |= (b & 0x7F) << 14;
                    if ((b & 0x80) != 0) {
                        b = this.readByte();
                        result |= (b & 0x7F) << 21;
                        if ((b & 0x80) != 0) {
                            b = this.readByte();
                            result |= (b & 0x7F) << 28;
                        }
                    }
                }
            }
            return optimizePositive ? result : ((result >>> 1) ^ -(result & 1));
        }
        readStringRef() {
            let index = this.readInt(true);
            return index == 0 ? null : this.strings[index - 1];
        }
        readString() {
            let byteCount = this.readInt(true);
            switch (byteCount) {
                case 0:
                    return null;
                case 1:
                    return "";
            }
            byteCount--;
            let chars = "";
            for (let i = 0; i < byteCount;) {
                let b = this.readByte();
                switch (b >> 4) {
                    case 12:
                    case 13:
                        chars += String.fromCharCode(((b & 0x1F) << 6 | this.readByte() & 0x3F));
                        i += 2;
                        break;
                    case 14:
                        chars += String.fromCharCode(((b & 0x0F) << 12 | (this.readByte() & 0x3F) << 6 | this.readByte() & 0x3F));
                        i += 3;
                        break;
                    default:
                        chars += String.fromCharCode(b);
                        i++;
                }
            }
            return chars;
        }
        readFloat() {
            let value = this.buffer.getFloat32(this.index);
            this.index += 4;
            return value;
        }
        readBoolean() {
            return this.readByte() != 0;
        }
    }
    class LinkedMesh {
        constructor(mesh, skin, slotIndex, parent, inheritDeform) {
            this.mesh = mesh;
            this.skin = skin;
            this.slotIndex = slotIndex;
            this.parent = parent;
            this.inheritDeform = inheritDeform;
        }
    }
    class Vertices {
        constructor(bones = null, vertices = null) {
            this.bones = bones;
            this.vertices = vertices;
        }
    }
    var AttachmentType;
    (function (AttachmentType) {
        AttachmentType[AttachmentType["Region"] = 0] = "Region";
        AttachmentType[AttachmentType["BoundingBox"] = 1] = "BoundingBox";
        AttachmentType[AttachmentType["Mesh"] = 2] = "Mesh";
        AttachmentType[AttachmentType["LinkedMesh"] = 3] = "LinkedMesh";
        AttachmentType[AttachmentType["Path"] = 4] = "Path";
        AttachmentType[AttachmentType["Point"] = 5] = "Point";
        AttachmentType[AttachmentType["Clipping"] = 6] = "Clipping";
    })(AttachmentType || (AttachmentType = {}));
    function readTimeline1(input, timeline, scale) {
        let time = input.readFloat(), value = input.readFloat() * scale;
        for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value);
            if (frame == frameLast)
                break;
            let time2 = input.readFloat(), value2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, value, value2, scale);
            }
            time = time2;
            value = value2;
        }
        return timeline;
    }
    function readTimeline2(input, timeline, scale) {
        let time = input.readFloat(), value1 = input.readFloat() * scale, value2 = input.readFloat() * scale;
        for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            if (frame == frameLast)
                break;
            let time2 = input.readFloat(), nvalue1 = input.readFloat() * scale, nvalue2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, value1, nvalue1, scale);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
        }
        return timeline;
    }
    function setBezier(input, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
        timeline.setBezier(bezier, frame, value, time1, value1, input.readFloat(), input.readFloat() * scale, input.readFloat(), input.readFloat() * scale, time2, value2);
    }
    const BONE_ROTATE = 0;
    const BONE_TRANSLATE = 1;
    const BONE_TRANSLATEX = 2;
    const BONE_TRANSLATEY = 3;
    const BONE_SCALE = 4;
    const BONE_SCALEX = 5;
    const BONE_SCALEY = 6;
    const BONE_SHEAR = 7;
    const BONE_SHEARX = 8;
    const BONE_SHEARY = 9;
    const SLOT_ATTACHMENT = 0;
    const SLOT_RGBA = 1;
    const SLOT_RGB = 2;
    const SLOT_RGBA2 = 3;
    const SLOT_RGB2 = 4;
    const SLOT_ALPHA = 5;
    const PATH_POSITION = 0;
    const PATH_SPACING = 1;
    const PATH_MIX = 2;
    const CURVE_STEPPED = 1;
    const CURVE_BEZIER = 2;

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Collects each visible {@link BoundingBoxAttachment} and computes the world vertices for its polygon. The polygon vertices are
     * provided along with convenience methods for doing hit detection. */
    class SkeletonBounds {
        constructor() {
            /** The left edge of the axis aligned bounding box. */
            this.minX = 0;
            /** The bottom edge of the axis aligned bounding box. */
            this.minY = 0;
            /** The right edge of the axis aligned bounding box. */
            this.maxX = 0;
            /** The top edge of the axis aligned bounding box. */
            this.maxY = 0;
            /** The visible bounding boxes. */
            this.boundingBoxes = new Array();
            /** The world vertices for the bounding box polygons. */
            this.polygons = new Array();
            this.polygonPool = new Pool(() => {
                return Utils.newFloatArray(16);
            });
        }
        /** Clears any previous polygons, finds all visible bounding box attachments, and computes the world vertices for each bounding
         * box's polygon.
         * @param updateAabb If true, the axis aligned bounding box containing all the polygons is computed. If false, the
         *           SkeletonBounds AABB methods will always return true. */
        update(skeleton, updateAabb) {
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            let boundingBoxes = this.boundingBoxes;
            let polygons = this.polygons;
            let polygonPool = this.polygonPool;
            let slots = skeleton.slots;
            let slotCount = slots.length;
            boundingBoxes.length = 0;
            polygonPool.freeAll(polygons);
            polygons.length = 0;
            for (let i = 0; i < slotCount; i++) {
                let slot = slots[i];
                if (!slot.bone.active)
                    continue;
                let attachment = slot.getAttachment();
                if (attachment instanceof BoundingBoxAttachment) {
                    let boundingBox = attachment;
                    boundingBoxes.push(boundingBox);
                    let polygon = polygonPool.obtain();
                    if (polygon.length != boundingBox.worldVerticesLength) {
                        polygon = Utils.newFloatArray(boundingBox.worldVerticesLength);
                    }
                    polygons.push(polygon);
                    boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, polygon, 0, 2);
                }
            }
            if (updateAabb) {
                this.aabbCompute();
            }
            else {
                this.minX = Number.POSITIVE_INFINITY;
                this.minY = Number.POSITIVE_INFINITY;
                this.maxX = Number.NEGATIVE_INFINITY;
                this.maxY = Number.NEGATIVE_INFINITY;
            }
        }
        aabbCompute() {
            let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
            let polygons = this.polygons;
            for (let i = 0, n = polygons.length; i < n; i++) {
                let polygon = polygons[i];
                let vertices = polygon;
                for (let ii = 0, nn = polygon.length; ii < nn; ii += 2) {
                    let x = vertices[ii];
                    let y = vertices[ii + 1];
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
        }
        /** Returns true if the axis aligned bounding box contains the point. */
        aabbContainsPoint(x, y) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
        }
        /** Returns true if the axis aligned bounding box intersects the line segment. */
        aabbIntersectsSegment(x1, y1, x2, y2) {
            let minX = this.minX;
            let minY = this.minY;
            let maxX = this.maxX;
            let maxY = this.maxY;
            if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
                return false;
            let m = (y2 - y1) / (x2 - x1);
            let y = m * (minX - x1) + y1;
            if (y > minY && y < maxY)
                return true;
            y = m * (maxX - x1) + y1;
            if (y > minY && y < maxY)
                return true;
            let x = (minY - y1) / m + x1;
            if (x > minX && x < maxX)
                return true;
            x = (maxY - y1) / m + x1;
            if (x > minX && x < maxX)
                return true;
            return false;
        }
        /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
        aabbIntersectsSkeleton(bounds) {
            return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
        }
        /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
         * efficient to only call this method if {@link #aabbContainsPoint(float, float)} returns true. */
        containsPoint(x, y) {
            let polygons = this.polygons;
            for (let i = 0, n = polygons.length; i < n; i++)
                if (this.containsPointPolygon(polygons[i], x, y))
                    return this.boundingBoxes[i];
            return null;
        }
        /** Returns true if the polygon contains the point. */
        containsPointPolygon(polygon, x, y) {
            let vertices = polygon;
            let nn = polygon.length;
            let prevIndex = nn - 2;
            let inside = false;
            for (let ii = 0; ii < nn; ii += 2) {
                let vertexY = vertices[ii + 1];
                let prevY = vertices[prevIndex + 1];
                if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                    let vertexX = vertices[ii];
                    if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x)
                        inside = !inside;
                }
                prevIndex = ii;
            }
            return inside;
        }
        /** Returns the first bounding box attachment that contains any part of the line segment, or null. When doing many checks, it
         * is usually more efficient to only call this method if {@link #aabbIntersectsSegment()} returns
         * true. */
        intersectsSegment(x1, y1, x2, y2) {
            let polygons = this.polygons;
            for (let i = 0, n = polygons.length; i < n; i++)
                if (this.intersectsSegmentPolygon(polygons[i], x1, y1, x2, y2))
                    return this.boundingBoxes[i];
            return null;
        }
        /** Returns true if the polygon contains any part of the line segment. */
        intersectsSegmentPolygon(polygon, x1, y1, x2, y2) {
            let vertices = polygon;
            let nn = polygon.length;
            let width12 = x1 - x2, height12 = y1 - y2;
            let det1 = x1 * y2 - y1 * x2;
            let x3 = vertices[nn - 2], y3 = vertices[nn - 1];
            for (let ii = 0; ii < nn; ii += 2) {
                let x4 = vertices[ii], y4 = vertices[ii + 1];
                let det2 = x3 * y4 - y3 * x4;
                let width34 = x3 - x4, height34 = y3 - y4;
                let det3 = width12 * height34 - height12 * width34;
                let x = (det1 * width34 - width12 * det2) / det3;
                if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
                    let y = (det1 * height34 - height12 * det2) / det3;
                    if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1)))
                        return true;
                }
                x3 = x4;
                y3 = y4;
            }
            return false;
        }
        /** Returns the polygon for the specified bounding box, or null. */
        getPolygon(boundingBox) {
            if (!boundingBox)
                throw new Error("boundingBox cannot be null.");
            let index = this.boundingBoxes.indexOf(boundingBox);
            return index == -1 ? null : this.polygons[index];
        }
        /** The width of the axis aligned bounding box. */
        getWidth() {
            return this.maxX - this.minX;
        }
        /** The height of the axis aligned bounding box. */
        getHeight() {
            return this.maxY - this.minY;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class Triangulator {
        constructor() {
            this.convexPolygons = new Array();
            this.convexPolygonsIndices = new Array();
            this.indicesArray = new Array();
            this.isConcaveArray = new Array();
            this.triangles = new Array();
            this.polygonPool = new Pool(() => {
                return new Array();
            });
            this.polygonIndicesPool = new Pool(() => {
                return new Array();
            });
        }
        triangulate(verticesArray) {
            let vertices = verticesArray;
            let vertexCount = verticesArray.length >> 1;
            let indices = this.indicesArray;
            indices.length = 0;
            for (let i = 0; i < vertexCount; i++)
                indices[i] = i;
            let isConcave = this.isConcaveArray;
            isConcave.length = 0;
            for (let i = 0, n = vertexCount; i < n; ++i)
                isConcave[i] = Triangulator.isConcave(i, vertexCount, vertices, indices);
            let triangles = this.triangles;
            triangles.length = 0;
            while (vertexCount > 3) {
                // Find ear tip.
                let previous = vertexCount - 1, i = 0, next = 1;
                while (true) {
                    outer: if (!isConcave[i]) {
                        let p1 = indices[previous] << 1, p2 = indices[i] << 1, p3 = indices[next] << 1;
                        let p1x = vertices[p1], p1y = vertices[p1 + 1];
                        let p2x = vertices[p2], p2y = vertices[p2 + 1];
                        let p3x = vertices[p3], p3y = vertices[p3 + 1];
                        for (let ii = (next + 1) % vertexCount; ii != previous; ii = (ii + 1) % vertexCount) {
                            if (!isConcave[ii])
                                continue;
                            let v = indices[ii] << 1;
                            let vx = vertices[v], vy = vertices[v + 1];
                            if (Triangulator.positiveArea(p3x, p3y, p1x, p1y, vx, vy)) {
                                if (Triangulator.positiveArea(p1x, p1y, p2x, p2y, vx, vy)) {
                                    if (Triangulator.positiveArea(p2x, p2y, p3x, p3y, vx, vy))
                                        break outer;
                                }
                            }
                        }
                        break;
                    }
                    if (next == 0) {
                        do {
                            if (!isConcave[i])
                                break;
                            i--;
                        } while (i > 0);
                        break;
                    }
                    previous = i;
                    i = next;
                    next = (next + 1) % vertexCount;
                }
                // Cut ear tip.
                triangles.push(indices[(vertexCount + i - 1) % vertexCount]);
                triangles.push(indices[i]);
                triangles.push(indices[(i + 1) % vertexCount]);
                indices.splice(i, 1);
                isConcave.splice(i, 1);
                vertexCount--;
                let previousIndex = (vertexCount + i - 1) % vertexCount;
                let nextIndex = i == vertexCount ? 0 : i;
                isConcave[previousIndex] = Triangulator.isConcave(previousIndex, vertexCount, vertices, indices);
                isConcave[nextIndex] = Triangulator.isConcave(nextIndex, vertexCount, vertices, indices);
            }
            if (vertexCount == 3) {
                triangles.push(indices[2]);
                triangles.push(indices[0]);
                triangles.push(indices[1]);
            }
            return triangles;
        }
        decompose(verticesArray, triangles) {
            let vertices = verticesArray;
            let convexPolygons = this.convexPolygons;
            this.polygonPool.freeAll(convexPolygons);
            convexPolygons.length = 0;
            let convexPolygonsIndices = this.convexPolygonsIndices;
            this.polygonIndicesPool.freeAll(convexPolygonsIndices);
            convexPolygonsIndices.length = 0;
            let polygonIndices = this.polygonIndicesPool.obtain();
            polygonIndices.length = 0;
            let polygon = this.polygonPool.obtain();
            polygon.length = 0;
            // Merge subsequent triangles if they form a triangle fan.
            let fanBaseIndex = -1, lastWinding = 0;
            for (let i = 0, n = triangles.length; i < n; i += 3) {
                let t1 = triangles[i] << 1, t2 = triangles[i + 1] << 1, t3 = triangles[i + 2] << 1;
                let x1 = vertices[t1], y1 = vertices[t1 + 1];
                let x2 = vertices[t2], y2 = vertices[t2 + 1];
                let x3 = vertices[t3], y3 = vertices[t3 + 1];
                // If the base of the last triangle is the same as this triangle, check if they form a convex polygon (triangle fan).
                let merged = false;
                if (fanBaseIndex == t1) {
                    let o = polygon.length - 4;
                    let winding1 = Triangulator.winding(polygon[o], polygon[o + 1], polygon[o + 2], polygon[o + 3], x3, y3);
                    let winding2 = Triangulator.winding(x3, y3, polygon[0], polygon[1], polygon[2], polygon[3]);
                    if (winding1 == lastWinding && winding2 == lastWinding) {
                        polygon.push(x3);
                        polygon.push(y3);
                        polygonIndices.push(t3);
                        merged = true;
                    }
                }
                // Otherwise make this triangle the new base.
                if (!merged) {
                    if (polygon.length > 0) {
                        convexPolygons.push(polygon);
                        convexPolygonsIndices.push(polygonIndices);
                    }
                    else {
                        this.polygonPool.free(polygon);
                        this.polygonIndicesPool.free(polygonIndices);
                    }
                    polygon = this.polygonPool.obtain();
                    polygon.length = 0;
                    polygon.push(x1);
                    polygon.push(y1);
                    polygon.push(x2);
                    polygon.push(y2);
                    polygon.push(x3);
                    polygon.push(y3);
                    polygonIndices = this.polygonIndicesPool.obtain();
                    polygonIndices.length = 0;
                    polygonIndices.push(t1);
                    polygonIndices.push(t2);
                    polygonIndices.push(t3);
                    lastWinding = Triangulator.winding(x1, y1, x2, y2, x3, y3);
                    fanBaseIndex = t1;
                }
            }
            if (polygon.length > 0) {
                convexPolygons.push(polygon);
                convexPolygonsIndices.push(polygonIndices);
            }
            // Go through the list of polygons and try to merge the remaining triangles with the found triangle fans.
            for (let i = 0, n = convexPolygons.length; i < n; i++) {
                polygonIndices = convexPolygonsIndices[i];
                if (polygonIndices.length == 0)
                    continue;
                let firstIndex = polygonIndices[0];
                let lastIndex = polygonIndices[polygonIndices.length - 1];
                polygon = convexPolygons[i];
                let o = polygon.length - 4;
                let prevPrevX = polygon[o], prevPrevY = polygon[o + 1];
                let prevX = polygon[o + 2], prevY = polygon[o + 3];
                let firstX = polygon[0], firstY = polygon[1];
                let secondX = polygon[2], secondY = polygon[3];
                let winding = Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, firstX, firstY);
                for (let ii = 0; ii < n; ii++) {
                    if (ii == i)
                        continue;
                    let otherIndices = convexPolygonsIndices[ii];
                    if (otherIndices.length != 3)
                        continue;
                    let otherFirstIndex = otherIndices[0];
                    let otherSecondIndex = otherIndices[1];
                    let otherLastIndex = otherIndices[2];
                    let otherPoly = convexPolygons[ii];
                    let x3 = otherPoly[otherPoly.length - 2], y3 = otherPoly[otherPoly.length - 1];
                    if (otherFirstIndex != firstIndex || otherSecondIndex != lastIndex)
                        continue;
                    let winding1 = Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, x3, y3);
                    let winding2 = Triangulator.winding(x3, y3, firstX, firstY, secondX, secondY);
                    if (winding1 == winding && winding2 == winding) {
                        otherPoly.length = 0;
                        otherIndices.length = 0;
                        polygon.push(x3);
                        polygon.push(y3);
                        polygonIndices.push(otherLastIndex);
                        prevPrevX = prevX;
                        prevPrevY = prevY;
                        prevX = x3;
                        prevY = y3;
                        ii = 0;
                    }
                }
            }
            // Remove empty polygons that resulted from the merge step above.
            for (let i = convexPolygons.length - 1; i >= 0; i--) {
                polygon = convexPolygons[i];
                if (polygon.length == 0) {
                    convexPolygons.splice(i, 1);
                    this.polygonPool.free(polygon);
                    polygonIndices = convexPolygonsIndices[i];
                    convexPolygonsIndices.splice(i, 1);
                    this.polygonIndicesPool.free(polygonIndices);
                }
            }
            return convexPolygons;
        }
        static isConcave(index, vertexCount, vertices, indices) {
            let previous = indices[(vertexCount + index - 1) % vertexCount] << 1;
            let current = indices[index] << 1;
            let next = indices[(index + 1) % vertexCount] << 1;
            return !this.positiveArea(vertices[previous], vertices[previous + 1], vertices[current], vertices[current + 1], vertices[next], vertices[next + 1]);
        }
        static positiveArea(p1x, p1y, p2x, p2y, p3x, p3y) {
            return p1x * (p3y - p2y) + p2x * (p1y - p3y) + p3x * (p2y - p1y) >= 0;
        }
        static winding(p1x, p1y, p2x, p2y, p3x, p3y) {
            let px = p2x - p1x, py = p2y - p1y;
            return p3x * py - p3y * px + px * p1y - p1x * py >= 0 ? 1 : -1;
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class SkeletonClipping {
        constructor() {
            this.triangulator = new Triangulator();
            this.clippingPolygon = new Array();
            this.clipOutput = new Array();
            this.clippedVertices = new Array();
            this.clippedTriangles = new Array();
            this.scratch = new Array();
        }
        clipStart(slot, clip) {
            if (this.clipAttachment)
                return 0;
            this.clipAttachment = clip;
            let n = clip.worldVerticesLength;
            let vertices = Utils.setArraySize(this.clippingPolygon, n);
            clip.computeWorldVertices(slot, 0, n, vertices, 0, 2);
            let clippingPolygon = this.clippingPolygon;
            SkeletonClipping.makeClockwise(clippingPolygon);
            let clippingPolygons = this.clippingPolygons = this.triangulator.decompose(clippingPolygon, this.triangulator.triangulate(clippingPolygon));
            for (let i = 0, n = clippingPolygons.length; i < n; i++) {
                let polygon = clippingPolygons[i];
                SkeletonClipping.makeClockwise(polygon);
                polygon.push(polygon[0]);
                polygon.push(polygon[1]);
            }
            return clippingPolygons.length;
        }
        clipEndWithSlot(slot) {
            if (this.clipAttachment && this.clipAttachment.endSlot == slot.data)
                this.clipEnd();
        }
        clipEnd() {
            if (!this.clipAttachment)
                return;
            this.clipAttachment = null;
            this.clippingPolygons = null;
            this.clippedVertices.length = 0;
            this.clippedTriangles.length = 0;
            this.clippingPolygon.length = 0;
        }
        isClipping() {
            return this.clipAttachment != null;
        }
        clipTriangles(vertices, verticesLength, triangles, trianglesLength, uvs, light, dark, twoColor) {
            let clipOutput = this.clipOutput, clippedVertices = this.clippedVertices;
            let clippedTriangles = this.clippedTriangles;
            let polygons = this.clippingPolygons;
            let polygonsCount = this.clippingPolygons.length;
            let vertexSize = twoColor ? 12 : 8;
            let index = 0;
            clippedVertices.length = 0;
            clippedTriangles.length = 0;
            outer: for (let i = 0; i < trianglesLength; i += 3) {
                let vertexOffset = triangles[i] << 1;
                let x1 = vertices[vertexOffset], y1 = vertices[vertexOffset + 1];
                let u1 = uvs[vertexOffset], v1 = uvs[vertexOffset + 1];
                vertexOffset = triangles[i + 1] << 1;
                let x2 = vertices[vertexOffset], y2 = vertices[vertexOffset + 1];
                let u2 = uvs[vertexOffset], v2 = uvs[vertexOffset + 1];
                vertexOffset = triangles[i + 2] << 1;
                let x3 = vertices[vertexOffset], y3 = vertices[vertexOffset + 1];
                let u3 = uvs[vertexOffset], v3 = uvs[vertexOffset + 1];
                for (let p = 0; p < polygonsCount; p++) {
                    let s = clippedVertices.length;
                    if (this.clip(x1, y1, x2, y2, x3, y3, polygons[p], clipOutput)) {
                        let clipOutputLength = clipOutput.length;
                        if (clipOutputLength == 0)
                            continue;
                        let d0 = y2 - y3, d1 = x3 - x2, d2 = x1 - x3, d4 = y3 - y1;
                        let d = 1 / (d0 * d2 + d1 * (y1 - y3));
                        let clipOutputCount = clipOutputLength >> 1;
                        let clipOutputItems = this.clipOutput;
                        let clippedVerticesItems = Utils.setArraySize(clippedVertices, s + clipOutputCount * vertexSize);
                        for (let ii = 0; ii < clipOutputLength; ii += 2) {
                            let x = clipOutputItems[ii], y = clipOutputItems[ii + 1];
                            clippedVerticesItems[s] = x;
                            clippedVerticesItems[s + 1] = y;
                            clippedVerticesItems[s + 2] = light.r;
                            clippedVerticesItems[s + 3] = light.g;
                            clippedVerticesItems[s + 4] = light.b;
                            clippedVerticesItems[s + 5] = light.a;
                            let c0 = x - x3, c1 = y - y3;
                            let a = (d0 * c0 + d1 * c1) * d;
                            let b = (d4 * c0 + d2 * c1) * d;
                            let c = 1 - a - b;
                            clippedVerticesItems[s + 6] = u1 * a + u2 * b + u3 * c;
                            clippedVerticesItems[s + 7] = v1 * a + v2 * b + v3 * c;
                            if (twoColor) {
                                clippedVerticesItems[s + 8] = dark.r;
                                clippedVerticesItems[s + 9] = dark.g;
                                clippedVerticesItems[s + 10] = dark.b;
                                clippedVerticesItems[s + 11] = dark.a;
                            }
                            s += vertexSize;
                        }
                        s = clippedTriangles.length;
                        let clippedTrianglesItems = Utils.setArraySize(clippedTriangles, s + 3 * (clipOutputCount - 2));
                        clipOutputCount--;
                        for (let ii = 1; ii < clipOutputCount; ii++) {
                            clippedTrianglesItems[s] = index;
                            clippedTrianglesItems[s + 1] = (index + ii);
                            clippedTrianglesItems[s + 2] = (index + ii + 1);
                            s += 3;
                        }
                        index += clipOutputCount + 1;
                    }
                    else {
                        let clippedVerticesItems = Utils.setArraySize(clippedVertices, s + 3 * vertexSize);
                        clippedVerticesItems[s] = x1;
                        clippedVerticesItems[s + 1] = y1;
                        clippedVerticesItems[s + 2] = light.r;
                        clippedVerticesItems[s + 3] = light.g;
                        clippedVerticesItems[s + 4] = light.b;
                        clippedVerticesItems[s + 5] = light.a;
                        if (!twoColor) {
                            clippedVerticesItems[s + 6] = u1;
                            clippedVerticesItems[s + 7] = v1;
                            clippedVerticesItems[s + 8] = x2;
                            clippedVerticesItems[s + 9] = y2;
                            clippedVerticesItems[s + 10] = light.r;
                            clippedVerticesItems[s + 11] = light.g;
                            clippedVerticesItems[s + 12] = light.b;
                            clippedVerticesItems[s + 13] = light.a;
                            clippedVerticesItems[s + 14] = u2;
                            clippedVerticesItems[s + 15] = v2;
                            clippedVerticesItems[s + 16] = x3;
                            clippedVerticesItems[s + 17] = y3;
                            clippedVerticesItems[s + 18] = light.r;
                            clippedVerticesItems[s + 19] = light.g;
                            clippedVerticesItems[s + 20] = light.b;
                            clippedVerticesItems[s + 21] = light.a;
                            clippedVerticesItems[s + 22] = u3;
                            clippedVerticesItems[s + 23] = v3;
                        }
                        else {
                            clippedVerticesItems[s + 6] = u1;
                            clippedVerticesItems[s + 7] = v1;
                            clippedVerticesItems[s + 8] = dark.r;
                            clippedVerticesItems[s + 9] = dark.g;
                            clippedVerticesItems[s + 10] = dark.b;
                            clippedVerticesItems[s + 11] = dark.a;
                            clippedVerticesItems[s + 12] = x2;
                            clippedVerticesItems[s + 13] = y2;
                            clippedVerticesItems[s + 14] = light.r;
                            clippedVerticesItems[s + 15] = light.g;
                            clippedVerticesItems[s + 16] = light.b;
                            clippedVerticesItems[s + 17] = light.a;
                            clippedVerticesItems[s + 18] = u2;
                            clippedVerticesItems[s + 19] = v2;
                            clippedVerticesItems[s + 20] = dark.r;
                            clippedVerticesItems[s + 21] = dark.g;
                            clippedVerticesItems[s + 22] = dark.b;
                            clippedVerticesItems[s + 23] = dark.a;
                            clippedVerticesItems[s + 24] = x3;
                            clippedVerticesItems[s + 25] = y3;
                            clippedVerticesItems[s + 26] = light.r;
                            clippedVerticesItems[s + 27] = light.g;
                            clippedVerticesItems[s + 28] = light.b;
                            clippedVerticesItems[s + 29] = light.a;
                            clippedVerticesItems[s + 30] = u3;
                            clippedVerticesItems[s + 31] = v3;
                            clippedVerticesItems[s + 32] = dark.r;
                            clippedVerticesItems[s + 33] = dark.g;
                            clippedVerticesItems[s + 34] = dark.b;
                            clippedVerticesItems[s + 35] = dark.a;
                        }
                        s = clippedTriangles.length;
                        let clippedTrianglesItems = Utils.setArraySize(clippedTriangles, s + 3);
                        clippedTrianglesItems[s] = index;
                        clippedTrianglesItems[s + 1] = (index + 1);
                        clippedTrianglesItems[s + 2] = (index + 2);
                        index += 3;
                        continue outer;
                    }
                }
            }
        }
        /** Clips the input triangle against the convex, clockwise clipping area. If the triangle lies entirely within the clipping
         * area, false is returned. The clipping area must duplicate the first vertex at the end of the vertices list. */
        clip(x1, y1, x2, y2, x3, y3, clippingArea, output) {
            let originalOutput = output;
            let clipped = false;
            // Avoid copy at the end.
            let input = null;
            if (clippingArea.length % 4 >= 2) {
                input = output;
                output = this.scratch;
            }
            else
                input = this.scratch;
            input.length = 0;
            input.push(x1);
            input.push(y1);
            input.push(x2);
            input.push(y2);
            input.push(x3);
            input.push(y3);
            input.push(x1);
            input.push(y1);
            output.length = 0;
            let clippingVertices = clippingArea;
            let clippingVerticesLast = clippingArea.length - 4;
            for (let i = 0;; i += 2) {
                let edgeX = clippingVertices[i], edgeY = clippingVertices[i + 1];
                let edgeX2 = clippingVertices[i + 2], edgeY2 = clippingVertices[i + 3];
                let deltaX = edgeX - edgeX2, deltaY = edgeY - edgeY2;
                let inputVertices = input;
                let inputVerticesLength = input.length - 2, outputStart = output.length;
                for (let ii = 0; ii < inputVerticesLength; ii += 2) {
                    let inputX = inputVertices[ii], inputY = inputVertices[ii + 1];
                    let inputX2 = inputVertices[ii + 2], inputY2 = inputVertices[ii + 3];
                    let side2 = deltaX * (inputY2 - edgeY2) - deltaY * (inputX2 - edgeX2) > 0;
                    if (deltaX * (inputY - edgeY2) - deltaY * (inputX - edgeX2) > 0) {
                        if (side2) { // v1 inside, v2 inside
                            output.push(inputX2);
                            output.push(inputY2);
                            continue;
                        }
                        // v1 inside, v2 outside
                        let c0 = inputY2 - inputY, c2 = inputX2 - inputX;
                        let s = c0 * (edgeX2 - edgeX) - c2 * (edgeY2 - edgeY);
                        if (Math.abs(s) > 0.000001) {
                            let ua = (c2 * (edgeY - inputY) - c0 * (edgeX - inputX)) / s;
                            output.push(edgeX + (edgeX2 - edgeX) * ua);
                            output.push(edgeY + (edgeY2 - edgeY) * ua);
                        }
                        else {
                            output.push(edgeX);
                            output.push(edgeY);
                        }
                    }
                    else if (side2) { // v1 outside, v2 inside
                        let c0 = inputY2 - inputY, c2 = inputX2 - inputX;
                        let s = c0 * (edgeX2 - edgeX) - c2 * (edgeY2 - edgeY);
                        if (Math.abs(s) > 0.000001) {
                            let ua = (c2 * (edgeY - inputY) - c0 * (edgeX - inputX)) / s;
                            output.push(edgeX + (edgeX2 - edgeX) * ua);
                            output.push(edgeY + (edgeY2 - edgeY) * ua);
                        }
                        else {
                            output.push(edgeX);
                            output.push(edgeY);
                        }
                        output.push(inputX2);
                        output.push(inputY2);
                    }
                    clipped = true;
                }
                if (outputStart == output.length) { // All edges outside.
                    originalOutput.length = 0;
                    return true;
                }
                output.push(output[0]);
                output.push(output[1]);
                if (i == clippingVerticesLast)
                    break;
                let temp = output;
                output = input;
                output.length = 0;
                input = temp;
            }
            if (originalOutput != output) {
                originalOutput.length = 0;
                for (let i = 0, n = output.length - 2; i < n; i++)
                    originalOutput[i] = output[i];
            }
            else
                originalOutput.length = originalOutput.length - 2;
            return clipped;
        }
        static makeClockwise(polygon) {
            let vertices = polygon;
            let verticeslength = polygon.length;
            let area = vertices[verticeslength - 2] * vertices[1] - vertices[0] * vertices[verticeslength - 1], p1x = 0, p1y = 0, p2x = 0, p2y = 0;
            for (let i = 0, n = verticeslength - 3; i < n; i += 2) {
                p1x = vertices[i];
                p1y = vertices[i + 1];
                p2x = vertices[i + 2];
                p2y = vertices[i + 3];
                area += p1x * p2y - p2x * p1y;
            }
            if (area < 0)
                return;
            for (let i = 0, lastX = verticeslength - 2, n = verticeslength >> 1; i < n; i += 2) {
                let x = vertices[i], y = vertices[i + 1];
                let other = lastX - i;
                vertices[i] = vertices[other];
                vertices[i + 1] = vertices[other + 1];
                vertices[other] = x;
                vertices[other + 1] = y;
            }
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    /** Loads skeleton data in the Spine JSON format.
     *
     * See [Spine JSON format](http://esotericsoftware.com/spine-json-format) and
     * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
     * Runtimes Guide. */
    class SkeletonJson {
        constructor(attachmentLoader) {
            this.attachmentLoader = null;
            /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
             * runtime than were used in Spine.
             *
             * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
            this.scale = 1;
            this.linkedMeshes = new Array();
            this.attachmentLoader = attachmentLoader;
        }
        readSkeletonData(json) {
            let scale = this.scale;
            let skeletonData = new SkeletonData();
            let root = typeof (json) === "string" ? JSON.parse(json) : json;
            // Skeleton
            let skeletonMap = root.skeleton;
            if (skeletonMap) {
                skeletonData.hash = skeletonMap.hash;
                skeletonData.version = skeletonMap.spine;
                skeletonData.x = skeletonMap.x;
                skeletonData.y = skeletonMap.y;
                skeletonData.width = skeletonMap.width;
                skeletonData.height = skeletonMap.height;
                skeletonData.fps = skeletonMap.fps;
                skeletonData.imagesPath = skeletonMap.images;
            }
            // Bones
            if (root.bones) {
                for (let i = 0; i < root.bones.length; i++) {
                    let boneMap = root.bones[i];
                    let parent = null;
                    let parentName = getValue(boneMap, "parent", null);
                    if (parentName)
                        parent = skeletonData.findBone(parentName);
                    let data = new BoneData(skeletonData.bones.length, boneMap.name, parent);
                    data.length = getValue(boneMap, "length", 0) * scale;
                    data.x = getValue(boneMap, "x", 0) * scale;
                    data.y = getValue(boneMap, "y", 0) * scale;
                    data.rotation = getValue(boneMap, "rotation", 0);
                    data.scaleX = getValue(boneMap, "scaleX", 1);
                    data.scaleY = getValue(boneMap, "scaleY", 1);
                    data.shearX = getValue(boneMap, "shearX", 0);
                    data.shearY = getValue(boneMap, "shearY", 0);
                    data.transformMode = Utils.enumValue(exports.TransformMode, getValue(boneMap, "transform", "Normal"));
                    data.skinRequired = getValue(boneMap, "skin", false);
                    let color = getValue(boneMap, "color", null);
                    if (color)
                        data.color.setFromString(color);
                    skeletonData.bones.push(data);
                }
            }
            // Slots.
            if (root.slots) {
                for (let i = 0; i < root.slots.length; i++) {
                    let slotMap = root.slots[i];
                    let boneData = skeletonData.findBone(slotMap.bone);
                    let data = new SlotData(skeletonData.slots.length, slotMap.name, boneData);
                    let color = getValue(slotMap, "color", null);
                    if (color)
                        data.color.setFromString(color);
                    let dark = getValue(slotMap, "dark", null);
                    if (dark)
                        data.darkColor = Color.fromString(dark);
                    data.attachmentName = getValue(slotMap, "attachment", null);
                    data.blendMode = Utils.enumValue(exports.BlendMode, getValue(slotMap, "blend", "normal"));
                    skeletonData.slots.push(data);
                }
            }
            // IK constraints
            if (root.ik) {
                for (let i = 0; i < root.ik.length; i++) {
                    let constraintMap = root.ik[i];
                    let data = new IkConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (let ii = 0; ii < constraintMap.bones.length; ii++)
                        data.bones.push(skeletonData.findBone(constraintMap.bones[ii]));
                    data.target = skeletonData.findBone(constraintMap.target);
                    data.mix = getValue(constraintMap, "mix", 1);
                    data.softness = getValue(constraintMap, "softness", 0) * scale;
                    data.bendDirection = getValue(constraintMap, "bendPositive", true) ? 1 : -1;
                    data.compress = getValue(constraintMap, "compress", false);
                    data.stretch = getValue(constraintMap, "stretch", false);
                    data.uniform = getValue(constraintMap, "uniform", false);
                    skeletonData.ikConstraints.push(data);
                }
            }
            // Transform constraints.
            if (root.transform) {
                for (let i = 0; i < root.transform.length; i++) {
                    let constraintMap = root.transform[i];
                    let data = new TransformConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (let ii = 0; ii < constraintMap.bones.length; ii++)
                        data.bones.push(skeletonData.findBone(constraintMap.bones[ii]));
                    let targetName = constraintMap.target;
                    data.target = skeletonData.findBone(targetName);
                    data.local = getValue(constraintMap, "local", false);
                    data.relative = getValue(constraintMap, "relative", false);
                    data.offsetRotation = getValue(constraintMap, "rotation", 0);
                    data.offsetX = getValue(constraintMap, "x", 0) * scale;
                    data.offsetY = getValue(constraintMap, "y", 0) * scale;
                    data.offsetScaleX = getValue(constraintMap, "scaleX", 0);
                    data.offsetScaleY = getValue(constraintMap, "scaleY", 0);
                    data.offsetShearY = getValue(constraintMap, "shearY", 0);
                    data.mixRotate = getValue(constraintMap, "mixRotate", 1);
                    data.mixX = getValue(constraintMap, "mixX", 1);
                    data.mixY = getValue(constraintMap, "mixY", data.mixX);
                    data.mixScaleX = getValue(constraintMap, "mixScaleX", 1);
                    data.mixScaleY = getValue(constraintMap, "mixScaleY", data.mixScaleX);
                    data.mixShearY = getValue(constraintMap, "mixShearY", 1);
                    skeletonData.transformConstraints.push(data);
                }
            }
            // Path constraints.
            if (root.path) {
                for (let i = 0; i < root.path.length; i++) {
                    let constraintMap = root.path[i];
                    let data = new PathConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (let ii = 0; ii < constraintMap.bones.length; ii++)
                        data.bones.push(skeletonData.findBone(constraintMap.bones[ii]));
                    let targetName = constraintMap.target;
                    data.target = skeletonData.findSlot(targetName);
                    data.positionMode = Utils.enumValue(exports.PositionMode, getValue(constraintMap, "positionMode", "Percent"));
                    data.spacingMode = Utils.enumValue(exports.SpacingMode, getValue(constraintMap, "spacingMode", "Length"));
                    data.rotateMode = Utils.enumValue(exports.RotateMode, getValue(constraintMap, "rotateMode", "Tangent"));
                    data.offsetRotation = getValue(constraintMap, "rotation", 0);
                    data.position = getValue(constraintMap, "position", 0);
                    if (data.positionMode == exports.PositionMode.Fixed)
                        data.position *= scale;
                    data.spacing = getValue(constraintMap, "spacing", 0);
                    if (data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed)
                        data.spacing *= scale;
                    data.mixRotate = getValue(constraintMap, "mixRotate", 1);
                    data.mixX = getValue(constraintMap, "mixX", 1);
                    data.mixY = getValue(constraintMap, "mixY", data.mixX);
                    skeletonData.pathConstraints.push(data);
                }
            }
            // Skins.
            if (root.skins) {
                for (let i = 0; i < root.skins.length; i++) {
                    let skinMap = root.skins[i];
                    let skin = new Skin(skinMap.name);
                    if (skinMap.bones) {
                        for (let ii = 0; ii < skinMap.bones.length; ii++)
                            skin.bones.push(skeletonData.findBone(skinMap.bones[ii]));
                    }
                    if (skinMap.ik) {
                        for (let ii = 0; ii < skinMap.ik.length; ii++)
                            skin.constraints.push(skeletonData.findIkConstraint(skinMap.ik[ii]));
                    }
                    if (skinMap.transform) {
                        for (let ii = 0; ii < skinMap.transform.length; ii++)
                            skin.constraints.push(skeletonData.findTransformConstraint(skinMap.transform[ii]));
                    }
                    if (skinMap.path) {
                        for (let ii = 0; ii < skinMap.path.length; ii++)
                            skin.constraints.push(skeletonData.findPathConstraint(skinMap.path[ii]));
                    }
                    for (let slotName in skinMap.attachments) {
                        let slot = skeletonData.findSlot(slotName);
                        let slotMap = skinMap.attachments[slotName];
                        for (let entryName in slotMap) {
                            let attachment = this.readAttachment(slotMap[entryName], skin, slot.index, entryName, skeletonData);
                            if (attachment)
                                skin.setAttachment(slot.index, entryName, attachment);
                        }
                    }
                    skeletonData.skins.push(skin);
                    if (skin.name == "default")
                        skeletonData.defaultSkin = skin;
                }
            }
            // Linked meshes.
            for (let i = 0, n = this.linkedMeshes.length; i < n; i++) {
                let linkedMesh = this.linkedMeshes[i];
                let skin = !linkedMesh.skin ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
                let parent = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
                linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent : linkedMesh.mesh;
                linkedMesh.mesh.setParentMesh(parent);
                linkedMesh.mesh.updateUVs();
            }
            this.linkedMeshes.length = 0;
            // Events.
            if (root.events) {
                for (let eventName in root.events) {
                    let eventMap = root.events[eventName];
                    let data = new EventData(eventName);
                    data.intValue = getValue(eventMap, "int", 0);
                    data.floatValue = getValue(eventMap, "float", 0);
                    data.stringValue = getValue(eventMap, "string", "");
                    data.audioPath = getValue(eventMap, "audio", null);
                    if (data.audioPath) {
                        data.volume = getValue(eventMap, "volume", 1);
                        data.balance = getValue(eventMap, "balance", 0);
                    }
                    skeletonData.events.push(data);
                }
            }
            // Animations.
            if (root.animations) {
                for (let animationName in root.animations) {
                    let animationMap = root.animations[animationName];
                    this.readAnimation(animationMap, animationName, skeletonData);
                }
            }
            return skeletonData;
        }
        readAttachment(map, skin, slotIndex, name, skeletonData) {
            let scale = this.scale;
            name = getValue(map, "name", name);
            switch (getValue(map, "type", "region")) {
                case "region": {
                    let path = getValue(map, "path", name);
                    let region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                    if (!region)
                        return null;
                    region.path = path;
                    region.x = getValue(map, "x", 0) * scale;
                    region.y = getValue(map, "y", 0) * scale;
                    region.scaleX = getValue(map, "scaleX", 1);
                    region.scaleY = getValue(map, "scaleY", 1);
                    region.rotation = getValue(map, "rotation", 0);
                    region.width = map.width * scale;
                    region.height = map.height * scale;
                    let color = getValue(map, "color", null);
                    if (color)
                        region.color.setFromString(color);
                    region.updateOffset();
                    return region;
                }
                case "boundingbox": {
                    let box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                    if (!box)
                        return null;
                    this.readVertices(map, box, map.vertexCount << 1);
                    let color = getValue(map, "color", null);
                    if (color)
                        box.color.setFromString(color);
                    return box;
                }
                case "mesh":
                case "linkedmesh": {
                    let path = getValue(map, "path", name);
                    let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    let color = getValue(map, "color", null);
                    if (color)
                        mesh.color.setFromString(color);
                    mesh.width = getValue(map, "width", 0) * scale;
                    mesh.height = getValue(map, "height", 0) * scale;
                    let parent = getValue(map, "parent", null);
                    if (parent) {
                        this.linkedMeshes.push(new LinkedMesh$1(mesh, getValue(map, "skin", null), slotIndex, parent, getValue(map, "deform", true)));
                        return mesh;
                    }
                    let uvs = map.uvs;
                    this.readVertices(map, mesh, uvs.length);
                    mesh.triangles = map.triangles;
                    mesh.regionUVs = uvs;
                    mesh.updateUVs();
                    mesh.edges = getValue(map, "edges", null);
                    mesh.hullLength = getValue(map, "hull", 0) * 2;
                    return mesh;
                }
                case "path": {
                    let path = this.attachmentLoader.newPathAttachment(skin, name);
                    if (!path)
                        return null;
                    path.closed = getValue(map, "closed", false);
                    path.constantSpeed = getValue(map, "constantSpeed", true);
                    let vertexCount = map.vertexCount;
                    this.readVertices(map, path, vertexCount << 1);
                    let lengths = Utils.newArray(vertexCount / 3, 0);
                    for (let i = 0; i < map.lengths.length; i++)
                        lengths[i] = map.lengths[i] * scale;
                    path.lengths = lengths;
                    let color = getValue(map, "color", null);
                    if (color)
                        path.color.setFromString(color);
                    return path;
                }
                case "point": {
                    let point = this.attachmentLoader.newPointAttachment(skin, name);
                    if (!point)
                        return null;
                    point.x = getValue(map, "x", 0) * scale;
                    point.y = getValue(map, "y", 0) * scale;
                    point.rotation = getValue(map, "rotation", 0);
                    let color = getValue(map, "color", null);
                    if (color)
                        point.color.setFromString(color);
                    return point;
                }
                case "clipping": {
                    let clip = this.attachmentLoader.newClippingAttachment(skin, name);
                    if (!clip)
                        return null;
                    let end = getValue(map, "end", null);
                    if (end)
                        clip.endSlot = skeletonData.findSlot(end);
                    let vertexCount = map.vertexCount;
                    this.readVertices(map, clip, vertexCount << 1);
                    let color = getValue(map, "color", null);
                    if (color)
                        clip.color.setFromString(color);
                    return clip;
                }
            }
            return null;
        }
        readVertices(map, attachment, verticesLength) {
            let scale = this.scale;
            attachment.worldVerticesLength = verticesLength;
            let vertices = map.vertices;
            if (verticesLength == vertices.length) {
                let scaledVertices = Utils.toFloatArray(vertices);
                if (scale != 1) {
                    for (let i = 0, n = vertices.length; i < n; i++)
                        scaledVertices[i] *= scale;
                }
                attachment.vertices = scaledVertices;
                return;
            }
            let weights = new Array();
            let bones = new Array();
            for (let i = 0, n = vertices.length; i < n;) {
                let boneCount = vertices[i++];
                bones.push(boneCount);
                for (let nn = i + boneCount * 4; i < nn; i += 4) {
                    bones.push(vertices[i]);
                    weights.push(vertices[i + 1] * scale);
                    weights.push(vertices[i + 2] * scale);
                    weights.push(vertices[i + 3]);
                }
            }
            attachment.bones = bones;
            attachment.vertices = Utils.toFloatArray(weights);
        }
        readAnimation(map, name, skeletonData) {
            let scale = this.scale;
            let timelines = new Array();
            // Slot timelines.
            if (map.slots) {
                for (let slotName in map.slots) {
                    let slotMap = map.slots[slotName];
                    let slotIndex = skeletonData.findSlot(slotName).index;
                    for (let timelineName in slotMap) {
                        let timelineMap = slotMap[timelineName];
                        if (!timelineMap)
                            continue;
                        let frames = timelineMap.length;
                        if (timelineName == "attachment") {
                            let timeline = new AttachmentTimeline(frames, slotIndex);
                            for (let frame = 0; frame < frames; frame++) {
                                let keyMap = timelineMap[frame];
                                timeline.setFrame(frame, getValue(keyMap, "time", 0), keyMap.name);
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgba") {
                            let timeline = new RGBATimeline(frames, frames << 2, slotIndex);
                            let keyMap = timelineMap[0];
                            let time = getValue(keyMap, "time", 0);
                            let color = Color.fromString(keyMap.color);
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color.a);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let newColor = Color.fromString(nextMap.color);
                                let curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                                }
                                time = time2;
                                color = newColor;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgb") {
                            let timeline = new RGBTimeline(frames, frames * 3, slotIndex);
                            let keyMap = timelineMap[0];
                            let time = getValue(keyMap, "time", 0);
                            let color = Color.fromString(keyMap.color);
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let newColor = Color.fromString(nextMap.color);
                                let curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "alpha") {
                            timelines.push(readTimeline1$1(timelineMap, new AlphaTimeline(frames, frames, slotIndex), 0, 1));
                        }
                        else if (timelineName == "rgba2") {
                            let timeline = new RGBA2Timeline(frames, frames * 7, slotIndex);
                            let keyMap = timelineMap[0];
                            let time = getValue(keyMap, "time", 0);
                            let color = Color.fromString(keyMap.light);
                            let color2 = Color.fromString(keyMap.dark);
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color.a, color2.r, color2.g, color2.b);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let newColor = Color.fromString(nextMap.light);
                                let newColor2 = Color.fromString(nextMap.dark);
                                let curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.r, newColor2.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.g, newColor2.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 6, time, time2, color2.b, newColor2.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                color2 = newColor2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgb2") {
                            let timeline = new RGB2Timeline(frames, frames * 6, slotIndex);
                            let keyMap = timelineMap[0];
                            let time = getValue(keyMap, "time", 0);
                            let color = Color.fromString(keyMap.light);
                            let color2 = Color.fromString(keyMap.dark);
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color2.r, color2.g, color2.b);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let newColor = Color.fromString(nextMap.light);
                                let newColor2 = Color.fromString(nextMap.dark);
                                let curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.r, newColor2.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.g, newColor2.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.b, newColor2.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                color2 = newColor2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                    }
                }
            }
            // Bone timelines.
            if (map.bones) {
                for (let boneName in map.bones) {
                    let boneMap = map.bones[boneName];
                    let boneIndex = skeletonData.findBone(boneName).index;
                    for (let timelineName in boneMap) {
                        let timelineMap = boneMap[timelineName];
                        let frames = timelineMap.length;
                        if (frames == 0)
                            continue;
                        if (timelineName === "rotate") {
                            timelines.push(readTimeline1$1(timelineMap, new RotateTimeline(frames, frames, boneIndex), 0, 1));
                        }
                        else if (timelineName === "translate") {
                            let timeline = new TranslateTimeline(frames, frames << 1, boneIndex);
                            timelines.push(readTimeline2$1(timelineMap, timeline, "x", "y", 0, scale));
                        }
                        else if (timelineName === "translatex") {
                            let timeline = new TranslateXTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, scale));
                        }
                        else if (timelineName === "translatey") {
                            let timeline = new TranslateYTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, scale));
                        }
                        else if (timelineName === "scale") {
                            let timeline = new ScaleTimeline(frames, frames << 1, boneIndex);
                            timelines.push(readTimeline2$1(timelineMap, timeline, "x", "y", 1, 1));
                        }
                        else if (timelineName === "scalex") {
                            let timeline = new ScaleXTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 1, 1));
                        }
                        else if (timelineName === "scaley") {
                            let timeline = new ScaleYTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 1, 1));
                        }
                        else if (timelineName === "shear") {
                            let timeline = new ShearTimeline(frames, frames << 1, boneIndex);
                            timelines.push(readTimeline2$1(timelineMap, timeline, "x", "y", 0, 1));
                        }
                        else if (timelineName === "shearx") {
                            let timeline = new ShearXTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, 1));
                        }
                        else if (timelineName === "sheary") {
                            let timeline = new ShearYTimeline(frames, frames, boneIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, 1));
                        }
                    }
                }
            }
            // IK constraint timelines.
            if (map.ik) {
                for (let constraintName in map.ik) {
                    let constraintMap = map.ik[constraintName];
                    let keyMap = constraintMap[0];
                    if (!keyMap)
                        continue;
                    let constraint = skeletonData.findIkConstraint(constraintName);
                    let constraintIndex = skeletonData.ikConstraints.indexOf(constraint);
                    let timeline = new IkConstraintTimeline(constraintMap.length, constraintMap.length << 1, constraintIndex);
                    let time = getValue(keyMap, "time", 0);
                    let mix = getValue(keyMap, "mix", 1);
                    let softness = getValue(keyMap, "softness", 0) * scale;
                    for (let frame = 0, bezier = 0;; frame++) {
                        timeline.setFrame(frame, time, mix, softness, getValue(keyMap, "bendPositive", true) ? 1 : -1, getValue(keyMap, "compress", false), getValue(keyMap, "stretch", false));
                        let nextMap = constraintMap[frame + 1];
                        if (!nextMap) {
                            timeline.shrink(bezier);
                            break;
                        }
                        let time2 = getValue(nextMap, "time", 0);
                        let mix2 = getValue(nextMap, "mix", 1);
                        let softness2 = getValue(nextMap, "softness", 0) * scale;
                        let curve = keyMap.curve;
                        if (curve) {
                            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, scale);
                        }
                        time = time2;
                        mix = mix2;
                        softness = softness2;
                        keyMap = nextMap;
                    }
                    timelines.push(timeline);
                }
            }
            // Transform constraint timelines.
            if (map.transform) {
                for (let constraintName in map.transform) {
                    let timelineMap = map.transform[constraintName];
                    let keyMap = timelineMap[0];
                    if (!keyMap)
                        continue;
                    let constraint = skeletonData.findTransformConstraint(constraintName);
                    let constraintIndex = skeletonData.transformConstraints.indexOf(constraint);
                    let timeline = new TransformConstraintTimeline(timelineMap.length, timelineMap.length * 6, constraintIndex);
                    let time = getValue(keyMap, "time", 0);
                    let mixRotate = getValue(keyMap, "mixRotate", 1);
                    let mixX = getValue(keyMap, "mixX", 1);
                    let mixY = getValue(keyMap, "mixY", mixX);
                    let mixScaleX = getValue(keyMap, "mixScaleX", 1);
                    let mixScaleY = getValue(keyMap, "mixScaleY", mixScaleX);
                    let mixShearY = getValue(keyMap, "mixShearY", 1);
                    for (let frame = 0, bezier = 0;; frame++) {
                        timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                        let nextMap = timelineMap[frame + 1];
                        if (!nextMap) {
                            timeline.shrink(bezier);
                            break;
                        }
                        let time2 = getValue(nextMap, "time", 0);
                        let mixRotate2 = getValue(nextMap, "mixRotate", 1);
                        let mixX2 = getValue(nextMap, "mixX", 1);
                        let mixY2 = getValue(nextMap, "mixY", mixX2);
                        let mixScaleX2 = getValue(nextMap, "mixScaleX", 1);
                        let mixScaleY2 = getValue(nextMap, "mixScaleY", mixScaleX2);
                        let mixShearY2 = getValue(nextMap, "mixShearY", 1);
                        let curve = keyMap.curve;
                        if (curve) {
                            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
                        }
                        time = time2;
                        mixRotate = mixRotate2;
                        mixX = mixX2;
                        mixY = mixY2;
                        mixScaleX = mixScaleX2;
                        mixScaleY = mixScaleY2;
                        mixScaleX = mixScaleX2;
                        keyMap = nextMap;
                    }
                    timelines.push(timeline);
                }
            }
            // Path constraint timelines.
            if (map.path) {
                for (let constraintName in map.path) {
                    let constraintMap = map.path[constraintName];
                    let constraint = skeletonData.findPathConstraint(constraintName);
                    let constraintIndex = skeletonData.pathConstraints.indexOf(constraint);
                    for (let timelineName in constraintMap) {
                        let timelineMap = constraintMap[timelineName];
                        let keyMap = timelineMap[0];
                        if (!keyMap)
                            continue;
                        let frames = timelineMap.length;
                        if (timelineName === "position") {
                            let timeline = new PathConstraintPositionTimeline(frames, frames, constraintIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, constraint.positionMode == exports.PositionMode.Fixed ? scale : 1));
                        }
                        else if (timelineName === "spacing") {
                            let timeline = new PathConstraintSpacingTimeline(frames, frames, constraintIndex);
                            timelines.push(readTimeline1$1(timelineMap, timeline, 0, constraint.spacingMode == exports.SpacingMode.Length || constraint.spacingMode == exports.SpacingMode.Fixed ? scale : 1));
                        }
                        else if (timelineName === "mix") {
                            let timeline = new PathConstraintMixTimeline(frames, frames * 3, constraintIndex);
                            let time = getValue(keyMap, "time", 0);
                            let mixRotate = getValue(keyMap, "mixRotate", 1);
                            let mixX = getValue(keyMap, "mixX", 1);
                            let mixY = getValue(keyMap, "mixY", mixX);
                            for (let frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let mixRotate2 = getValue(nextMap, "mixRotate", 1);
                                let mixX2 = getValue(nextMap, "mixX", 1);
                                let mixY2 = getValue(nextMap, "mixY", mixX2);
                                let curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                                }
                                time = time2;
                                mixRotate = mixRotate2;
                                mixX = mixX2;
                                mixY = mixY2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                    }
                }
            }
            // Deform timelines.
            if (map.deform) {
                for (let deformName in map.deform) {
                    let deformMap = map.deform[deformName];
                    let skin = skeletonData.findSkin(deformName);
                    for (let slotName in deformMap) {
                        let slotMap = deformMap[slotName];
                        let slotIndex = skeletonData.findSlot(slotName).index;
                        for (let timelineName in slotMap) {
                            let timelineMap = slotMap[timelineName];
                            let keyMap = timelineMap[0];
                            if (!keyMap)
                                continue;
                            let attachment = skin.getAttachment(slotIndex, timelineName);
                            let weighted = attachment.bones;
                            let vertices = attachment.vertices;
                            let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                            let timeline = new DeformTimeline(timelineMap.length, timelineMap.length, slotIndex, attachment);
                            let time = getValue(keyMap, "time", 0);
                            for (let frame = 0, bezier = 0;; frame++) {
                                let deform;
                                let verticesValue = getValue(keyMap, "vertices", null);
                                if (!verticesValue)
                                    deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                                else {
                                    deform = Utils.newFloatArray(deformLength);
                                    let start = getValue(keyMap, "offset", 0);
                                    Utils.arrayCopy(verticesValue, 0, deform, start, verticesValue.length);
                                    if (scale != 1) {
                                        for (let i = start, n = i + verticesValue.length; i < n; i++)
                                            deform[i] *= scale;
                                    }
                                    if (!weighted) {
                                        for (let i = 0; i < deformLength; i++)
                                            deform[i] += vertices[i];
                                    }
                                }
                                timeline.setFrame(frame, time, deform);
                                let nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                let time2 = getValue(nextMap, "time", 0);
                                let curve = keyMap.curve;
                                if (curve)
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
                                time = time2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                    }
                }
            }
            // Draw order timelines.
            if (map.drawOrder) {
                let timeline = new DrawOrderTimeline(map.drawOrder.length);
                let slotCount = skeletonData.slots.length;
                let frame = 0;
                for (let i = 0; i < map.drawOrder.length; i++, frame++) {
                    let drawOrderMap = map.drawOrder[i];
                    let drawOrder = null;
                    let offsets = getValue(drawOrderMap, "offsets", null);
                    if (offsets) {
                        drawOrder = Utils.newArray(slotCount, -1);
                        let unchanged = Utils.newArray(slotCount - offsets.length, 0);
                        let originalIndex = 0, unchangedIndex = 0;
                        for (let ii = 0; ii < offsets.length; ii++) {
                            let offsetMap = offsets[ii];
                            let slotIndex = skeletonData.findSlot(offsetMap.slot).index;
                            // Collect unchanged items.
                            while (originalIndex != slotIndex)
                                unchanged[unchangedIndex++] = originalIndex++;
                            // Set changed items.
                            drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
                        }
                        // Collect remaining unchanged items.
                        while (originalIndex < slotCount)
                            unchanged[unchangedIndex++] = originalIndex++;
                        // Fill in unchanged items.
                        for (let ii = slotCount - 1; ii >= 0; ii--)
                            if (drawOrder[ii] == -1)
                                drawOrder[ii] = unchanged[--unchangedIndex];
                    }
                    timeline.setFrame(frame, getValue(drawOrderMap, "time", 0), drawOrder);
                }
                timelines.push(timeline);
            }
            // Event timelines.
            if (map.events) {
                let timeline = new EventTimeline(map.events.length);
                let frame = 0;
                for (let i = 0; i < map.events.length; i++, frame++) {
                    let eventMap = map.events[i];
                    let eventData = skeletonData.findEvent(eventMap.name);
                    let event = new Event(Utils.toSinglePrecision(getValue(eventMap, "time", 0)), eventData);
                    event.intValue = getValue(eventMap, "int", eventData.intValue);
                    event.floatValue = getValue(eventMap, "float", eventData.floatValue);
                    event.stringValue = getValue(eventMap, "string", eventData.stringValue);
                    if (event.data.audioPath) {
                        event.volume = getValue(eventMap, "volume", 1);
                        event.balance = getValue(eventMap, "balance", 0);
                    }
                    timeline.setFrame(frame, event);
                }
                timelines.push(timeline);
            }
            let duration = 0;
            for (let i = 0, n = timelines.length; i < n; i++)
                duration = Math.max(duration, timelines[i].getDuration());
            skeletonData.animations.push(new Animation(name, timelines, duration));
        }
    }
    class LinkedMesh$1 {
        constructor(mesh, skin, slotIndex, parent, inheritDeform) {
            this.mesh = mesh;
            this.skin = skin;
            this.slotIndex = slotIndex;
            this.parent = parent;
            this.inheritDeform = inheritDeform;
        }
    }
    function readTimeline1$1(keys, timeline, defaultValue, scale) {
        let keyMap = keys[0];
        let time = getValue(keyMap, "time", 0);
        let value = getValue(keyMap, "value", defaultValue) * scale;
        let bezier = 0;
        for (let frame = 0;; frame++) {
            timeline.setFrame(frame, time, value);
            let nextMap = keys[frame + 1];
            if (!nextMap) {
                timeline.shrink(bezier);
                return timeline;
            }
            let time2 = getValue(nextMap, "time", 0);
            let value2 = getValue(nextMap, "value", defaultValue) * scale;
            if (keyMap.curve)
                bezier = readCurve(keyMap.curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
            time = time2;
            value = value2;
            keyMap = nextMap;
        }
    }
    function readTimeline2$1(keys, timeline, name1, name2, defaultValue, scale) {
        let keyMap = keys[0];
        let time = getValue(keyMap, "time", 0);
        let value1 = getValue(keyMap, name1, defaultValue) * scale;
        let value2 = getValue(keyMap, name2, defaultValue) * scale;
        let bezier = 0;
        for (let frame = 0;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            let nextMap = keys[frame + 1];
            if (!nextMap) {
                timeline.shrink(bezier);
                return timeline;
            }
            let time2 = getValue(nextMap, "time", 0);
            let nvalue1 = getValue(nextMap, name1, defaultValue) * scale;
            let nvalue2 = getValue(nextMap, name2, defaultValue) * scale;
            let curve = keyMap.curve;
            if (curve) {
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
            keyMap = nextMap;
        }
    }
    function readCurve(curve, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
        if (curve == "stepped") {
            timeline.setStepped(frame);
            return bezier;
        }
        let i = value << 2;
        let cx1 = curve[i];
        let cy1 = curve[i + 1] * scale;
        let cx2 = curve[i + 2];
        let cy2 = curve[i + 3] * scale;
        timeline.setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
        return bezier + 1;
    }
    function getValue(map, property, defaultValue) {
        return map[property] !== undefined ? map[property] : defaultValue;
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    (() => {
        if (typeof Math.fround === "undefined") {
            Math.fround = (function (array) {
                return function (x) {
                    return array[0] = x, array[0];
                };
            })(new Float32Array(1));
        }
    })();

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class JitterEffect {
        constructor(jitterX, jitterY) {
            this.jitterX = 0;
            this.jitterY = 0;
            this.jitterX = jitterX;
            this.jitterY = jitterY;
        }
        begin(skeleton) {
        }
        transform(position, uv, light, dark) {
            position.x += MathUtils.randomTriangular(-this.jitterX, this.jitterY);
            position.y += MathUtils.randomTriangular(-this.jitterX, this.jitterY);
        }
        end() {
        }
    }

    /******************************************************************************
     * Spine Runtimes License Agreement
     * Last updated January 1, 2020. Replaces all prior versions.
     *
     * Copyright (c) 2013-2020, Esoteric Software LLC
     *
     * Integration of the Spine Runtimes into software or otherwise creating
     * derivative works of the Spine Runtimes is permitted under the terms and
     * conditions of Section 2 of the Spine Editor License Agreement:
     * http://esotericsoftware.com/spine-editor-license
     *
     * Otherwise, it is permitted to integrate the Spine Runtimes into software
     * or otherwise create derivative works of the Spine Runtimes (collectively,
     * "Products"), provided that each user of the Products must obtain their own
     * Spine Editor license and redistribution of the Products in any form must
     * include this license and copyright notice.
     *
     * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
     * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
     * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
     * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *****************************************************************************/
    class SwirlEffect {
        constructor(radius) {
            this.centerX = 0;
            this.centerY = 0;
            this.radius = 0;
            this.angle = 0;
            this.worldX = 0;
            this.worldY = 0;
            this.radius = radius;
        }
        begin(skeleton) {
            this.worldX = skeleton.x + this.centerX;
            this.worldY = skeleton.y + this.centerY;
        }
        transform(position, uv, light, dark) {
            let radAngle = this.angle * MathUtils.degreesToRadians;
            let x = position.x - this.worldX;
            let y = position.y - this.worldY;
            let dist = Math.sqrt(x * x + y * y);
            if (dist < this.radius) {
                let theta = SwirlEffect.interpolation.apply(0, radAngle, (this.radius - dist) / this.radius);
                let cos = Math.cos(theta);
                let sin = Math.sin(theta);
                position.x = cos * x - sin * y + this.worldX;
                position.y = sin * x + cos * y + this.worldY;
            }
        }
        end() {
        }
    }
    SwirlEffect.interpolation = new PowOut(2);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    const ONE = 1;
    const SRC_ALPHA = 0x0302;
    const ONE_MINUS_SRC_ALPHA = 0x0303;
    const DST_COLOR = 0x0306;
    function BlendParamToName(param) {
        if (param == 1)
            return "ONE";
        if (param == 0x0301)
            return "ONE_MINUS_SRC_COLOR";
        if (param == 0x0302)
            return "SRC_ALPHA";
        if (param == 0x0303)
            return "ONE_MINUS_SRC_ALPHA";
        if (param == 0x0305)
            return "ONE_MINUS_DST_ALPHA";
        if (param == 0x0306)
            return "DST_COLOR";
    }
    class SpineMeshBatcher {
        constructor(shader, maxVertices = 10920) {
            this.verticesLength = 0;
            this.indicesLength = 0;
            this.drawParams = [];
            this._projectMat = new gd3d.math.matrix();
            this._mat = new gd3d.framework.material();
            if (maxVertices > 10920)
                throw new Error("Can't have more than 10920 triangles per batch: " + maxVertices);
            this.vertices = new Float32Array(maxVertices * SpineMeshBatcher.VERTEX_SIZE);
            this.indices = new Uint16Array(maxVertices * 3);
            this._shader = shader;
        }
        dispose() {
        }
        clear() {
            this.drawParams = [];
        }
        canBatch(verticesLength, indicesLength) {
            if (this.indicesLength + indicesLength >= this.indices.length)
                return false;
            if (this.verticesLength + verticesLength >= this.vertices.length)
                return false;
            return true;
        }
        begin() {
            this.verticesLength = 0;
            this.indicesLength = 0;
            this.drawParams = [];
        }
        batch(vertices, verticesLength, indices, indicesLength, z = 0, slotBlendMode, slotTexture) {
            let indexAdd = this.verticesLength / SpineMeshBatcher.VERTEX_SIZE;
            let indexStart = this.indicesLength;
            let i = this.verticesLength;
            let vertexBuffer = this.vertices;
            let j = 0;
            for (; j < verticesLength;) {
                vertexBuffer[i++] = vertices[j++]; //x
                vertexBuffer[i++] = vertices[j++]; //y
                vertexBuffer[i++] = z;
                vertexBuffer[i++] = vertices[j++]; //r
                vertexBuffer[i++] = vertices[j++]; //g
                vertexBuffer[i++] = vertices[j++]; //b
                vertexBuffer[i++] = vertices[j++]; //a
                vertexBuffer[i++] = vertices[j++]; //u
                vertexBuffer[i++] = vertices[j++]; //v
                vertexBuffer[i++] = vertices[j++]; //r
                vertexBuffer[i++] = vertices[j++]; //g
                vertexBuffer[i++] = vertices[j++]; //b
                vertexBuffer[i++] = vertices[j++]; //a
            }
            this.verticesLength = i;
            let indicesArray = this.indices;
            for (i = this.indicesLength, j = 0; j < indicesLength; i++, j++)
                indicesArray[i] = indices[j] + indexAdd;
            this.indicesLength += indicesLength;
            this.addDrawParams(indexStart, indicesLength, slotBlendMode, slotTexture);
        }
        addDrawParams(start, count, slotBlendMode, slotTexture) {
            if (this.drawParams.length > 0) {
                let last = this.drawParams[this.drawParams.length - 1];
                if (last.slotTexture == slotTexture && last.slotBlendMode == slotBlendMode) {
                    last.count += count;
                    return;
                }
            }
            let srcRgb, srcAlpha, dstRgb, dstAlpha;
            switch (slotBlendMode) {
                case exports.BlendMode.Normal:
                    srcRgb = exports.spineSkeleton.premultipliedAlpha ? ONE : SRC_ALPHA;
                    srcAlpha = ONE;
                    dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                    break;
                case exports.BlendMode.Additive:
                    srcRgb = exports.spineSkeleton.premultipliedAlpha ? ONE : SRC_ALPHA;
                    srcAlpha = ONE;
                    dstRgb = dstAlpha = ONE;
                    break;
                case exports.BlendMode.Multiply:
                    srcRgb = DST_COLOR;
                    srcAlpha = ONE_MINUS_SRC_ALPHA;
                    dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                    break;
                case exports.BlendMode.Screen:
                    srcRgb = ONE;
                    srcAlpha = ONE_MINUS_SRC_ALPHA;
                    dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                    break;
            }
            this.drawParams.push({ start, count, slotTexture, slotBlendMode, srcRgb, srcAlpha, dstRgb, dstAlpha });
        }
        end() {
            this._needUpdate = true;
        }
        render(context, app) {
            var _a;
            let { webgl } = context;
            if (this._needUpdate) {
                this._needUpdate = false;
                if (this.mesh == null) {
                    let mesh = new gd3d.render.glMesh();
                    let vf = gd3d.render.VertexFormatMask.Position
                        | gd3d.render.VertexFormatMask.Color
                        | gd3d.render.VertexFormatMask.UV0
                        | gd3d.render.VertexFormatMask.ColorEX;
                    mesh.initBuffer(webgl, vf, this.vertices.length / SpineMeshBatcher.VERTEX_SIZE, gd3d.render.MeshTypeEnum.Dynamic);
                    mesh.uploadVertexData(webgl, this.vertices);
                    mesh.addIndex(webgl, this.indices.length);
                    mesh.uploadIndexData(webgl, 0, this.indices);
                    this.mesh = mesh;
                }
                else {
                    this.mesh.uploadVertexData(webgl, this.vertices);
                    this.mesh.uploadIndexData(webgl, 0, this.indices);
                }
            }
            if (this.mesh) {
                let shader = (_a = this._shader) !== null && _a !== void 0 ? _a : app.getAssetMgr().getShader(defSpineShaderName);
                this._mat.setShader(shader);
                // ortho(0, app.width, 0, app.height, -1, 1, this._projectMat);
                // gd3d.math.matrixMakeIdentity(this._projectMat);
                this.mesh.bindVboBuffer(webgl);
                let pass = shader.passes["base"][0];
                this.mesh.bind(webgl, pass.program, 0);
                for (let i = 0; i < this.drawParams.length; i++) {
                    let { start, count, slotTexture, srcRgb, srcAlpha, dstAlpha, dstRgb } = this.drawParams[i];
                    pass.state_blend = true;
                    pass.state_blendEquation = gd3d.render.webglkit.FUNC_ADD;
                    pass.state_blendSrcRGB = srcRgb;
                    pass.state_blendSrcAlpha = srcAlpha;
                    pass.state_blendDestRGB = dstRgb;
                    pass.state_blendDestALpha = dstAlpha;
                    //强制blend
                    gd3d.render.glDrawPass["lastPassID"] = null;
                    pass.state_blendMode = 1;
                    gd3d.render.glDrawPass.lastBlendMode = null;
                    pass.use(webgl);
                    this._mat.setTexture("_MainTex", slotTexture.texture);
                    // this._mat.setMatrix("_SpineMvp", this._projectMat);
                    this._mat.uploadUnifoms(pass, context);
                    this.mesh.drawElementTris(webgl, start, count);
                }
            }
        }
    }
    SpineMeshBatcher.VERTEX_SIZE = 13;
    function ortho(left, right, bottom, top, near, far, out) {
        let x_orth = 2 / (right - left);
        let y_orth = 2 / (top - bottom);
        let z_orth = -2 / (far - near);
        let tx = -(right + left) / (right - left);
        let ty = -(top + bottom) / (top - bottom);
        let tz = -(far + near) / (far - near);
        out.rawData[0] = x_orth;
        out.rawData[1] = 0;
        out.rawData[2] = 0;
        out.rawData[3] = 0;
        out.rawData[4] = 0;
        out.rawData[5] = y_orth;
        out.rawData[6] = 0;
        out.rawData[7] = 0;
        out.rawData[8] = 0;
        out.rawData[9] = 0;
        out.rawData[10] = z_orth;
        out.rawData[11] = 0;
        out.rawData[12] = tx;
        out.rawData[13] = ty;
        out.rawData[14] = tz;
        out.rawData[15] = 1;
        return out;
    }

    var spineSkeleton_1;
    exports.spineSkeleton = spineSkeleton_1 = class spineSkeleton {
        constructor(skeletonData) {
            this._toTransFormMatrix = new gd3d.math.matrix3x2([1, 0, 0, -1, 0, 0]);
            this._spineToWorld = new gd3d.math.matrix3x2();
            this._spineToWorld2 = new gd3d.math.matrix();
            this.batches = new Array();
            this.nextBatchIndex = 0;
            this.clipper = new SkeletonClipping();
            this.tempPos = new Vector2();
            this.tempUv = new Vector2();
            this.tempLight = new Color();
            this.tempDark = new Color();
            this.tempColor = new Color();
            this.tempColor2 = new Color();
            this.vertices = new Float32Array(1024);
            this.zOffset = 0.1;
            this.skeleton = new Skeleton(skeletonData);
            this.animData = new AnimationStateData(skeletonData);
            this.state = new AnimationState(this.animData);
        }
        set shader(shader) {
            this._shader = shader;
        }
        start() {
        }
        onPlay() {
        }
        update(delta) {
            var _a;
            let state = this.state;
            let skeleton = this.skeleton;
            state.update(delta);
            state.apply(skeleton);
            skeleton.updateWorldTransform();
            this.updateGeometry();
            (_a = this.onUpdate) === null || _a === void 0 ? void 0 : _a.call(this, delta);
        }
        get toTransformMatrix() {
            return this._toTransFormMatrix;
        }
        getToCanvasMatrix(mat = new gd3d.math.matrix3x2()) {
            gd3d.math.matrix3x2Multiply(this.transform.getCanvasWorldMatrix(), this._toTransFormMatrix, mat);
            return mat;
        }
        render(canvas) {
            let app = canvas.scene.app;
            let context = canvas["context"];
            let worldMat = this.transform.getWorldMatrix();
            let spineToWorld = this._spineToWorld;
            gd3d.math.matrix3x2Multiply(worldMat, this._toTransFormMatrix, spineToWorld);
            let mat = this._spineToWorld2;
            mat.rawData[0] = spineToWorld.rawData[0];
            mat.rawData[1] = spineToWorld.rawData[1];
            mat.rawData[4] = spineToWorld.rawData[2];
            mat.rawData[5] = spineToWorld.rawData[3];
            mat.rawData[12] = spineToWorld.rawData[4];
            mat.rawData[13] = spineToWorld.rawData[5];
            context.matrixModel = mat;
            // let worldPos = this.transform.getWorldTranslate();
            // let worldRot = this.transform.getWorldRotate();
            // let worldScale = this.transform.getWorldScale();
            // gd3d.math.quatFromAxisAngle(gd3d.math.z_AXIS(), worldRot.v * 180 / Math.PI, this._quat)
            // gd3d.math.matrixMakeTransformRTS(new gd3d.math.vector3(worldPos.x, worldPos.y, 0), new gd3d.math.vector3(worldScale.x, worldScale.y, 1.0), this._quat, this._modelMat);
            // let pmat = new gd3d.math.matrix();
            // ortho(0, app.width, 0, app.height, -1, 1, pmat);
            // gd3d.math.matrixMultiply(pmat, this._modelMat, this._modelMat);
            // context.matrixModel = this._modelMat;
            for (let i = 0; i < this.batches.length; i++) {
                this.batches[i].render(context, app);
            }
        }
        updateGeometry() {
            this.clearBatches();
            let tempPos = this.tempPos;
            let tempUv = this.tempUv;
            let tempLight = this.tempLight;
            let tempDark = this.tempDark;
            let clipper = this.clipper;
            let vertices = this.vertices;
            let triangles = null;
            let uvs = null;
            let drawOrder = this.skeleton.drawOrder;
            let skeletonColor = this.skeleton.color;
            let batch = this.nextBatch();
            batch.begin();
            for (let i = 0, n = drawOrder.length; i < n; i++) {
                let vertexSize = clipper.isClipping() ? 2 : spineSkeleton_1.VERTEX_SIZE;
                let slot = drawOrder[i];
                if (!slot.bone.active)
                    continue;
                let attachment = slot.getAttachment();
                let texture = null;
                let attachmentColor = null;
                let numFloats = 0;
                if (attachment instanceof RegionAttachment) {
                    let region = attachment;
                    attachmentColor = region.color;
                    vertices = this.vertices;
                    numFloats = vertexSize * 4;
                    region.computeWorldVertices(slot.bone, vertices, 0, vertexSize);
                    triangles = spineSkeleton_1.QUAD_TRIANGLES;
                    uvs = region.uvs;
                    texture = region.region.renderObject.page.texture;
                }
                else if (attachment instanceof MeshAttachment) {
                    let mesh = attachment;
                    attachmentColor = mesh.color;
                    vertices = this.vertices;
                    numFloats = (mesh.worldVerticesLength >> 1) * vertexSize;
                    if (numFloats > vertices.length) {
                        vertices = this.vertices = new Float32Array(numFloats);
                    }
                    mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, vertexSize);
                    triangles = mesh.triangles;
                    uvs = mesh.uvs;
                    texture = mesh.region.renderObject.page.texture;
                }
                else if (attachment instanceof ClippingAttachment) {
                    let clip = (attachment);
                    clipper.clipStart(slot, clip);
                    continue;
                }
                else
                    continue;
                if (texture != null) {
                    let slotColor = slot.color;
                    let finalColor = this.tempColor;
                    finalColor.r = skeletonColor.r * slotColor.r * attachmentColor.r;
                    finalColor.g = skeletonColor.g * slotColor.g * attachmentColor.g;
                    finalColor.b = skeletonColor.b * slotColor.b * attachmentColor.b;
                    finalColor.a = skeletonColor.a * slotColor.a * attachmentColor.a;
                    if (spineSkeleton_1.premultipliedAlpha) {
                        finalColor.r *= finalColor.a;
                        finalColor.g *= finalColor.a;
                        finalColor.b *= finalColor.a;
                    }
                    let darkColor = this.tempColor2;
                    if (!slot.darkColor)
                        darkColor.set(0, 0, 0, 1.0);
                    else {
                        if (spineSkeleton_1.premultipliedAlpha) {
                            darkColor.r = slot.darkColor.r * finalColor.a;
                            darkColor.g = slot.darkColor.g * finalColor.a;
                            darkColor.b = slot.darkColor.b * finalColor.a;
                        }
                        else {
                            darkColor.setFromColor(slot.darkColor);
                        }
                        darkColor.a = spineSkeleton_1.premultipliedAlpha ? 1.0 : 0.0;
                    }
                    let finalVertices;
                    let finalVerticesLength;
                    let finalIndices;
                    let finalIndicesLength;
                    if (clipper.isClipping()) {
                        clipper.clipTriangles(vertices, numFloats, triangles, triangles.length, uvs, finalColor, darkColor, true);
                        let clippedVertices = clipper.clippedVertices;
                        let clippedTriangles = clipper.clippedTriangles;
                        if (this.vertexEffect != null) {
                            let vertexEffect = this.vertexEffect;
                            let verts = clippedVertices;
                            for (let v = 0, n = clippedVertices.length; v < n; v += vertexSize) {
                                tempPos.x = verts[v];
                                tempPos.y = verts[v + 1];
                                tempLight.set(verts[v + 2], verts[v + 3], verts[v + 4], verts[v + 5]);
                                tempUv.x = verts[v + 6];
                                tempUv.y = verts[v + 7];
                                tempDark.set(verts[v + 8], verts[v + 9], verts[v + 10], verts[v + 11]);
                                vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                                verts[v] = tempPos.x;
                                verts[v + 1] = tempPos.y;
                                verts[v + 2] = tempLight.r;
                                verts[v + 3] = tempLight.g;
                                verts[v + 4] = tempLight.b;
                                verts[v + 5] = tempLight.a;
                                verts[v + 6] = tempUv.x;
                                verts[v + 7] = tempUv.y;
                                verts[v + 8] = tempDark.r;
                                verts[v + 9] = tempDark.g;
                                verts[v + 10] = tempDark.b;
                                verts[v + 11] = tempDark.a;
                            }
                        }
                        finalVertices = clippedVertices;
                        finalVerticesLength = clippedVertices.length;
                        finalIndices = clippedTriangles;
                        finalIndicesLength = clippedTriangles.length;
                    }
                    else {
                        let verts = vertices;
                        if (this.vertexEffect != null) {
                            let vertexEffect = this.vertexEffect;
                            for (let v = 0, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                                tempPos.x = verts[v];
                                tempPos.y = verts[v + 1];
                                tempUv.x = uvs[u];
                                tempUv.y = uvs[u + 1];
                                tempLight.setFromColor(finalColor);
                                tempDark.setFromColor(darkColor);
                                vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                                verts[v] = tempPos.x;
                                verts[v + 1] = tempPos.y;
                                verts[v + 2] = tempLight.r;
                                verts[v + 3] = tempLight.g;
                                verts[v + 4] = tempLight.b;
                                verts[v + 5] = tempLight.a;
                                verts[v + 6] = tempUv.x;
                                verts[v + 7] = tempUv.y;
                                verts[v + 8] = tempDark.r;
                                verts[v + 9] = tempDark.g;
                                verts[v + 10] = tempDark.b;
                                verts[v + 11] = tempDark.a;
                            }
                        }
                        else {
                            for (let v = 2, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                                verts[v] = finalColor.r;
                                verts[v + 1] = finalColor.g;
                                verts[v + 2] = finalColor.b;
                                verts[v + 3] = finalColor.a;
                                verts[v + 4] = uvs[u];
                                verts[v + 5] = uvs[u + 1];
                                verts[v + 6] = darkColor.r;
                                verts[v + 7] = darkColor.g;
                                verts[v + 8] = darkColor.b;
                                verts[v + 9] = darkColor.a;
                            }
                        }
                        finalVertices = vertices;
                        finalVerticesLength = numFloats;
                        finalIndices = triangles;
                        finalIndicesLength = triangles.length;
                    }
                    if (finalVerticesLength == 0 || finalIndicesLength == 0)
                        continue;
                    if (!batch.canBatch(finalVerticesLength, finalIndicesLength)) {
                        batch.end();
                        batch = this.nextBatch();
                        batch.begin();
                    }
                    batch.batch(finalVertices, finalVerticesLength, finalIndices, finalIndicesLength, 0, slot.data.blendMode, texture);
                    // z += zOffset;
                }
                clipper.clipEndWithSlot(slot);
            }
            clipper.clipEnd();
            batch.end();
        }
        clearBatches() {
            for (var i = 0; i < this.batches.length; i++) {
                this.batches[i].clear();
            }
            this.nextBatchIndex = 0;
        }
        nextBatch() {
            if (this.batches.length == this.nextBatchIndex) {
                let batch = new SpineMeshBatcher(this._shader);
                this.batches.push(batch);
            }
            let batch = this.batches[this.nextBatchIndex++];
            return batch;
        }
        updateTran() {
            var m = this.transform.getWorldMatrix();
        }
        remove() {
            this.transform = null;
        }
    };
    exports.spineSkeleton.ClassName = "spineSkeleton";
    exports.spineSkeleton.premultipliedAlpha = false;
    exports.spineSkeleton.VERTEX_SIZE = 2 + 2 + 4 + 4;
    exports.spineSkeleton.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
    exports.spineSkeleton = spineSkeleton_1 = __decorate([
        gd3d.reflect.node2DComponent,
        gd3d.reflect.nodeRender
    ], exports.spineSkeleton);

    const defSpineShaderName = "shader/spine";
    class SpineAssetMgr extends AssetManagerBase {
        constructor(assetMgr, pathPrefix = "", downloader = null) {
            super((image) => new Gd3dTexture(image, assetMgr.webgl), pathPrefix, downloader);
            this._assetMgr = assetMgr;
            this.initShader();
        }
        initShader() {
            let vscodeUI = `
        attribute vec4 _glesVertex;    
        attribute vec4 _glesColor;
        attribute vec4 _glesColorEx;                   
        attribute vec4 _glesMultiTexCoord0;          
        uniform highp mat4 glstate_matrix_model;
        varying lowp vec4 v_light;  
        varying lowp vec4 v_dark;               
        varying highp vec2 xlv_TEXCOORD0;            
        void main()                                      
        {                                                
            highp vec4 tmpvar_1;                         
            tmpvar_1.w = 1.0;                            
            tmpvar_1.xyz = _glesVertex.xyz;              
            v_light = _glesColor;
            v_dark = _glesColorEx;                    
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,_glesMultiTexCoord0.y);      
            gl_Position = glstate_matrix_model* tmpvar_1;   
        }
        `;
            let fscodeUI = `
        uniform sampler2D _MainTex;
        varying lowp vec4 v_light;
        varying lowp vec4 v_dark;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 texColor = texture2D(_MainTex, xlv_TEXCOORD0);
            gl_FragColor.a = texColor.a * v_light.a;
            gl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;
        }`;
            let pool = this._assetMgr.shaderPool;
            pool.compileVS(this._assetMgr.webgl, "spine", vscodeUI);
            pool.compileFS(this._assetMgr.webgl, "spine", fscodeUI);
            let program = pool.linkProgram(this._assetMgr.webgl, "spine", "spine");
            var spineShader = new gd3d.framework.shader(defSpineShaderName);
            spineShader.passes["base"] = [];
            var p = new gd3d.render.glDrawPass();
            p.setProgram(program);
            spineShader.passes["base"].push(p);
            spineShader.fillUnDefUniform(p);
            p.state_ztest = false;
            p.state_zwrite = false;
            p.state_showface = gd3d.render.ShowFaceStateEnum.ALL;
            this._assetMgr.mapShader[spineShader.getName()] = spineShader;
        }
    }
    class Gd3dTexture extends Texture {
        constructor(image, webgl) {
            super(image);
            this._needUpdate = true;
            this._webgl = webgl;
            const tex = new gd3d.framework.texture();
            var _textureFormat = gd3d.render.TextureFormatEnum.RGBA;
            tex.glTexture = new gd3d.render.glTexture2D(webgl, _textureFormat);
            this._texture = tex;
        }
        get texture() {
            var _a, _b, _c, _d;
            if (this._needUpdate) {
                this._needUpdate = false;
                this._webgl.bindTexture(this._webgl.TEXTURE_2D, this._texture.glTexture.texture);
                this._webgl.pixelStorei(this._webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, exports.spineSkeleton.premultipliedAlpha ? 1 : 0);
                this._webgl.pixelStorei(this._webgl.UNPACK_FLIP_Y_WEBGL, 0);
                this._webgl.texImage2D(this._webgl.TEXTURE_2D, 0, this._webgl.RGBA, this._webgl.RGBA, this._webgl.UNSIGNED_BYTE, this.getImage());
                this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MAG_FILTER, (_a = this._magFilter) !== null && _a !== void 0 ? _a : this._webgl.LINEAR);
                this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MIN_FILTER, (_b = this._minFilter) !== null && _b !== void 0 ? _b : this._webgl.LINEAR);
                this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_S, (_c = this._uWrap) !== null && _c !== void 0 ? _c : this._webgl.CLAMP_TO_EDGE);
                this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_T, (_d = this._vWrap) !== null && _d !== void 0 ? _d : this._webgl.CLAMP_TO_EDGE);
            }
            return this._texture;
        }
        setFilters(minFilter, magFilter) {
            this._needUpdate = true;
            this._minFilter = minFilter;
            this._magFilter = magFilter;
        }
        setWraps(uWrap, vWrap) {
            this._needUpdate = true;
            this._uWrap = uWrap;
            this._vWrap = vWrap;
        }
        dispose() {
            throw new Error("Method not implemented.");
        }
    }

    exports.AlphaTimeline = AlphaTimeline;
    exports.Animation = Animation;
    exports.AnimationState = AnimationState;
    exports.AnimationStateAdapter = AnimationStateAdapter;
    exports.AnimationStateData = AnimationStateData;
    exports.AssetManagerBase = AssetManagerBase;
    exports.AtlasAttachmentLoader = AtlasAttachmentLoader;
    exports.Attachment = Attachment;
    exports.AttachmentTimeline = AttachmentTimeline;
    exports.BinaryInput = BinaryInput;
    exports.BlendParamToName = BlendParamToName;
    exports.Bone = Bone;
    exports.BoneData = BoneData;
    exports.BoundingBoxAttachment = BoundingBoxAttachment;
    exports.CURRENT = CURRENT;
    exports.ClippingAttachment = ClippingAttachment;
    exports.Color = Color;
    exports.ConstraintData = ConstraintData;
    exports.CurveTimeline = CurveTimeline;
    exports.CurveTimeline1 = CurveTimeline1;
    exports.CurveTimeline2 = CurveTimeline2;
    exports.DebugUtils = DebugUtils;
    exports.DeformTimeline = DeformTimeline;
    exports.Downloader = Downloader;
    exports.DrawOrderTimeline = DrawOrderTimeline;
    exports.Event = Event;
    exports.EventData = EventData;
    exports.EventQueue = EventQueue;
    exports.EventTimeline = EventTimeline;
    exports.FIRST = FIRST;
    exports.FakeTexture = FakeTexture;
    exports.Gd3dTexture = Gd3dTexture;
    exports.HOLD_FIRST = HOLD_FIRST;
    exports.HOLD_MIX = HOLD_MIX;
    exports.HOLD_SUBSEQUENT = HOLD_SUBSEQUENT;
    exports.IkConstraint = IkConstraint;
    exports.IkConstraintData = IkConstraintData;
    exports.IkConstraintTimeline = IkConstraintTimeline;
    exports.IntSet = IntSet;
    exports.Interpolation = Interpolation;
    exports.JitterEffect = JitterEffect;
    exports.MathUtils = MathUtils;
    exports.MeshAttachment = MeshAttachment;
    exports.PathAttachment = PathAttachment;
    exports.PathConstraint = PathConstraint;
    exports.PathConstraintData = PathConstraintData;
    exports.PathConstraintMixTimeline = PathConstraintMixTimeline;
    exports.PathConstraintPositionTimeline = PathConstraintPositionTimeline;
    exports.PathConstraintSpacingTimeline = PathConstraintSpacingTimeline;
    exports.PointAttachment = PointAttachment;
    exports.Pool = Pool;
    exports.Pow = Pow;
    exports.PowOut = PowOut;
    exports.RGB2Timeline = RGB2Timeline;
    exports.RGBA2Timeline = RGBA2Timeline;
    exports.RGBATimeline = RGBATimeline;
    exports.RGBTimeline = RGBTimeline;
    exports.RegionAttachment = RegionAttachment;
    exports.RotateTimeline = RotateTimeline;
    exports.SETUP = SETUP;
    exports.SUBSEQUENT = SUBSEQUENT;
    exports.ScaleTimeline = ScaleTimeline;
    exports.ScaleXTimeline = ScaleXTimeline;
    exports.ScaleYTimeline = ScaleYTimeline;
    exports.ShearTimeline = ShearTimeline;
    exports.ShearXTimeline = ShearXTimeline;
    exports.ShearYTimeline = ShearYTimeline;
    exports.Skeleton = Skeleton;
    exports.SkeletonBinary = SkeletonBinary;
    exports.SkeletonBounds = SkeletonBounds;
    exports.SkeletonClipping = SkeletonClipping;
    exports.SkeletonData = SkeletonData;
    exports.SkeletonJson = SkeletonJson;
    exports.Skin = Skin;
    exports.SkinEntry = SkinEntry;
    exports.Slot = Slot;
    exports.SlotData = SlotData;
    exports.SpineAssetMgr = SpineAssetMgr;
    exports.SpineMeshBatcher = SpineMeshBatcher;
    exports.StringSet = StringSet;
    exports.SwirlEffect = SwirlEffect;
    exports.Texture = Texture;
    exports.TextureAtlas = TextureAtlas;
    exports.TextureAtlasPage = TextureAtlasPage;
    exports.TextureAtlasRegion = TextureAtlasRegion;
    exports.TextureRegion = TextureRegion;
    exports.TimeKeeper = TimeKeeper;
    exports.Timeline = Timeline;
    exports.TrackEntry = TrackEntry;
    exports.TransformConstraint = TransformConstraint;
    exports.TransformConstraintData = TransformConstraintData;
    exports.TransformConstraintTimeline = TransformConstraintTimeline;
    exports.TranslateTimeline = TranslateTimeline;
    exports.TranslateXTimeline = TranslateXTimeline;
    exports.TranslateYTimeline = TranslateYTimeline;
    exports.Triangulator = Triangulator;
    exports.Utils = Utils;
    exports.Vector2 = Vector2;
    exports.VertexAttachment = VertexAttachment;
    exports.WindowedMean = WindowedMean;
    exports.defSpineShaderName = defSpineShaderName;
    exports.ortho = ortho;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=spine_gd3d.js.map
