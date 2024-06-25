import { Tween, CSSNumeric } from './animation.mjs'

window.addEventListener('DOMContentLoaded', () => {

    new Tween(
        document.getElementById('intro-logo')!, 
        'width',
        Tween.EasePropertyCallback<CSSNumeric>('width', new CSSNumeric('px', 200)),
        70, 
        '200px',
        Tween.Easings.Expo.Out)

})