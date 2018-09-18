function load() { $('body').addClass('loading'); }
function loaded() { $('body').removeClass('loading'); }
window.onbeforeunload = load;
