// for bright text on bright background workaround
function relative_luminance(css_color) {
    if (!css_color.startsWith('rgb('))
        throw new Error('not implemented');
    let color_array = css_color.substring(4, css_color.length - 1).split(',').map(s => parseInt(s, 10));
    let R = color_array[0] / 255;
    let G = color_array[1] / 255;
    let B = color_array[2] / 255;
    // https://en.wikipedia.org/wiki/Luma_(video)#Luma_versus_relative_luminance
    // coefficients defined by Rec. 601
    return 0.299 * R + 0.587 * G + 0.114 * B
}

get_prefs().then(prefs => {
    for (let pref in prefs) {
        let element = document.getElementById(pref);
        element.value = prefs[pref];
        element.addEventListener('change', event => {
            set_pref(pref, event.target.value);
        });

        // bright text on bright background (and vice-versa) workaround
        let computed = window.getComputedStyle(element);
        let bg_rl = relative_luminance(computed.getPropertyValue('background-color'));
        let fg_rl = relative_luminance(computed.getPropertyValue('color'));
        if ((fg_rl > 0.5 && bg_rl > 0.5) || (fg_rl < 0.5 && bg_rl < 0.5))
            element.style.setProperty('color', bg_rl > 0.5 ? '#000000' : '#FFFFFF');
    }
});
