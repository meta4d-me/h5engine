namespace gd3d.framework
{
    /**
     * 粒子节点
     */
    export class ParticleNode
    {
        x: ValueData = new ValueData();
        y: ValueData = new ValueData();
        z: ValueData = new ValueData();
        key: number;

        constructor()
        {

        }
        getValue(): gd3d.math.vector3
        {
            return new gd3d.math.vector3(this.x.getValue(), this.y.getValue(), this.z.getValue());
        }
        getValueRandom(): gd3d.math.vector3
        {
            return new gd3d.math.vector3(this.x.getValueRandom(), this.y.getValueRandom(), this.z.getValueRandom());
        }
        clone()
        {
            let node = new ParticleNode();
            if (this.x != undefined)
                node.x = this.x.clone();
            if (this.y != undefined)
                node.y = this.y.clone();
            if (this.z != undefined)
                node.z = this.z.clone();
            if (this.key != undefined)
                node.key = this.key;
            return node;
        }
    }

    export class AlphaNode
    {
        alpha: ValueData = new ValueData();
        key: number;

        getValue(): number
        {
            return this.alpha.getValue();
        }

    }
    export class UVSpeedNode
    {
        u: ValueData = new ValueData();
        v: ValueData = new ValueData();
        key: number;

        getValue(): gd3d.math.vector2
        {
            return new gd3d.math.vector2(this.u.getValue(), this.v.getValue());
        }
        getValueRandom(): gd3d.math.vector2
        {
            return new gd3d.math.vector2(this.u.getValueRandom(), this.v.getValueRandom());
        }
        clone()
        {
            let node = new UVSpeedNode();
            node.u = this.u.clone();
            node.v = this.v.clone();
            if (this.key != undefined)
                node.key = this.key;
            return node;
        }
    }

    export class ParticleNodeVec2
    {
        x: ValueData = new ValueData();
        y: ValueData = new ValueData();
        key: number;

        getValue(): gd3d.math.vector2
        {
            return new gd3d.math.vector2(this.x.getValue(), this.y.getValue());
        }
        getValueRandom(): gd3d.math.vector2
        {
            return new gd3d.math.vector2(this.x.getValueRandom(), this.y.getValueRandom());
        }
        clone()
        {
            let vec = new ParticleNodeVec2();
            vec.x = this.x.clone();
            vec.y = this.y.clone();
            if (this.key != undefined)
                vec.key = this.key;
            return vec;
        }
    }

    export class ParticleNodeNumber
    {
        num: ValueData = new ValueData();
        key: number;
        getValue(): number
        {
            return this.num.getValue();
        }
        getValueRandom(): number
        {
            return this.num.getValueRandom();
        }
        clone()
        {
            let num = new ParticleNodeNumber();
            num.num = this.num.clone();
            if (this.key != undefined)
            {
                num.key = this.key;
            }
            return num;
        }
    }
}

