import { AgonMath, Generator } from './common.mjs'

export interface CSSPropertyMapper {
    From(css_string: string): CSSPropertyMapper;
    GetProperty(): string;
    Add(other: CSSPropertyMapper): CSSPropertyMapper;
    Lerp(other: CSSPropertyMapper, t: number): CSSPropertyMapper;
}

export class CSSColor implements CSSPropertyMapper {
    public R: number;
    public G: number;
    public B: number;
    public A: number;

    private constructor(r: number, g: number, b: number, a: number) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }

    public From(css_string: string): CSSColor {
        let color_values = css_string.match(/[.?\d]+/g);
        if(color_values != null) {
            return new CSSColor(
                parseFloat(color_values[0]), 
                parseFloat(color_values[1]), 
                parseFloat(color_values[2]), 
                parseFloat(color_values[3])
            )
        } else {throw new Error(`failed to read css color property of ${css_string}`)}
    }

    public GetProperty(): string {
        return `rgba(${this.R}, ${this.G}, ${this.B}, ${this.A})`
    }

    public Add(other: CSSColor): CSSColor {
        return new CSSColor(this.R + other.R, this.G + other.G, this.B + other.B, this.A + other.A);
    }

    public Lerp(other: CSSColor, t: number): CSSColor {
        return new CSSColor(
            AgonMath.Lerp(this.R, other.R, t),
            AgonMath.Lerp(this.G, other.G, t),
            AgonMath.Lerp(this.B, other.B, t),
            AgonMath.Lerp(this.A, other.A, t),
            )
    }
}

export class CSSNumeric implements CSSPropertyMapper {
    public Postfix: string;
    public Value: number = 0;

    public constructor(postfix: string, value?: number) {
        this.Postfix = postfix;
        if(value != null) {this.Value = value;}
    }

    public From(css_string: string): CSSNumeric {
        return new CSSNumeric(this.Postfix, parseFloat(css_string.substring(0, css_string.length - this.Postfix.length)))
    }

    public GetProperty(): string {
        return this.Value + this.Postfix;
    }

    public Add(other: CSSNumeric): CSSNumeric {
        return new CSSNumeric(this.Postfix, this.Value + other.Value);
    }

    public Lerp(other: CSSNumeric, t: number): CSSNumeric {
        return new CSSNumeric(this.Postfix, AgonMath.Lerp(this.Value, other.Value, t))
    }
}

/**
 * A function called by {@link Tween} every tick
 */
type TweenCallback = (tween: Tween) => void;

type Easing = (t: number) => number;
type EasingModule = {In: Easing, Out: Easing, InOut: Easing}

/**
 * An object capable of animating a single CSS property of a provided {@link HTMLElement}
 */
export class Tween {

    static EasePropertyCallback<T extends CSSPropertyMapper>(prop: string, mapper: T): TweenCallback {
        return (tween: Tween) => {
        tween.Subject.style.setProperty(
            prop, 
            mapper.From(tween.EasingInterval[0]).Lerp(mapper.From(tween.EasingInterval[1]), tween.GetEasedValue()).GetProperty()
            );
        //console.log(tween.Subject.style.getPropertyValue(prop))
        }
    };

    public static readonly Easings: {[key: string]: EasingModule} = {
        Expo: {
            Out: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
            In: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
            InOut: (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2
        },
        Linear: {In: (x) => x, Out: (x) => x, InOut: (x) => x }
    };

    public Interval: NodeJS.Timeout;
    public Subject: HTMLElement;
    public Lifetime: number;
    public Easing: Easing;
    public EasingInterval: [string, string];
    public Finished: boolean = false;

    private Counter: number = 0;

    constructor(
        subject: HTMLElement, 
        property: string,
        callback: TweenCallback, 
        lifetime: number, 
        to: string | CSSPropertyMapper,
        easing: Easing = Tween.Easings.Linear.In,
        ) 
    {
        this.Interval = setInterval(
            () => {
                callback(this); 
                this.IncrementCounter();
            }, 10
            );
        this.Subject = subject;
        this.Lifetime = lifetime;
        this.Easing = easing;
        if(typeof to == 'string') {
            this.EasingInterval = [getComputedStyle(subject).getPropertyValue(property), to]
            console.log(getComputedStyle(subject).getPropertyValue(property))
        } else {
            this.EasingInterval = [getComputedStyle(subject).getPropertyValue(property), to.GetProperty()]
        }
        
    }

    public GetEasedValue(): number {
        return this.Easing(this.Counter / this.Lifetime)
    }

    private IncrementCounter() {
        this.Counter++;
        if(this.Counter >= this.Lifetime) {
            this.Finished = true;
            clearInterval(this.Interval)
        }
    }
}