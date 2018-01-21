const prefs_defaults = {
    what: "host",
    delimiter: " - ",
};

function get_prefs() {
    return browser.storage.sync.get(prefs_defaults);
}

function set_pref(pref, value) {
    if (prefs_defaults[pref] === value)
        return browser.storage.sync.remove(pref);
    else
        return browser.storage.sync.set({[pref]: value});
}
