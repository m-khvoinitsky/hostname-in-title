let title_element = document.querySelector('head > title');
let previous = null;

async function render() {
    let prefs = await get_prefs();
    switch (prefs.what) {
        case 'host':
            return `${prefs.delimiter}${window.location.host}`;
        case 'origin':
            return `${prefs.delimiter}${window.location.origin}`;
        case 'url_noqs':
            return `${prefs.delimiter}${window.location.origin}${window.location.pathname}`;
        default:
            throw new Error('not implemented');
    }
}

async function changeTitle() {
    try {
        let new_part = await render('host');
        /* using title_element.textContent is better than document.title
           because it preserves all whitespace characters as-is and
           it helps to avoid endless loop if configured delimiter contains more than one whitespace in a row */
        if (title_element.textContent.endsWith(new_part))
            return;
        let base = (previous !== null && title_element.textContent.endsWith(previous)) ?
            title_element.textContent.replace(previous, '') /*TODO: ensure replacement in the end?*/ :
            title_element.textContent;

        previous = new_part;
        title_element.textContent = `${base}${new_part}`;
    } catch (e) {console.error(e)}
}


let observer = new MutationObserver(changeTitle);
observer.observe(
    title_element,
    {
        subtree: true,
        characterData: true,
        childList: true
    }
);
browser.storage.onChanged.addListener(changeTitle);
changeTitle();
