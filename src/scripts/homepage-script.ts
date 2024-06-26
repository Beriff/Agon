import { Tween, CSSNumeric } from './animation.mjs'

const $id = (id: string) => document.getElementById(id)!;

window.addEventListener('DOMContentLoaded', () => {

    new Tween(
        $id('intro-logo'), 
        'width',
        Tween.EasePropertyCallback<CSSNumeric>('width', new CSSNumeric('px', 200)),
        70, 
        '200px',
        Tween.Easings.Expo.Out)

    .Then( () => {

    new Tween(
        $id('intro-logo'),
        'opacity',
        Tween.EasePropertyCallback<CSSNumeric>('opacity', new CSSNumeric('', 0)),
        50,
        '0',
        Tween.Easings.Linear.In)
        
        .Then(() => $id('intro').style.display = 'none')

    }, 0.4)
    

})