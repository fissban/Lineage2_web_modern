const MENU = ['home', 'features', 'downloads', 'donate', 'events', 'votes', 'register'];
/**
 * Acciones al cargar el html
 */
$(document).ready(() =>
{
    // carga de los diferentes modulos base de la pag
    $('#top').load('./resource/modules/top.html');
    $('#status').load('./resource/modules/status.html');
    $('#ranking-pvp').load('./resource/modules/ranking-pvp.html');
    $('#ranking-pk').load('./resource/modules/ranking-pk.html');
    $('#castles').load('./resource/modules/castles.html');
    $('#footer').load('./resource/modules/footer.html');
    // carga del modulo ppal de acuerdo al hash
    loadHash();

    MENU.forEach(link =>
    {
        $('#' + link).click((e) =>
        {
            // se obtiene la posicion original de la ventana
            let oldPos = $(window).scrollTop();

            e.preventDefault();
            // se carga en el board el html q queremos.
            loadBoard(link);

            // al darle click la ventana se mueve a la posicion del div donde se carga la pag
            // con esto hacemos parecer q nunca se movio
            $(window).scrollTop(oldPos);
        });
    })
});

/**
 * Acciones al cambiar la URL
 */
$(window).on('hashchange', (e) =>
{
    // se carga en el board el html especificado en la URL.
    loadHash();
});

/**
 * Carga la pagina en el 'board' de acuerdo a lo especificado en la URL
 */
function loadHash()
{
    let hash = location.hash;
    let page = hash ? hash.slice(1) : 'home';

    loadBoard(page);
}

/**
 * Carga la pagina en el 'board' de acuerdo a lo especificado en la URL
 */
function loadBoard(page)
{
    $('html,body').scrollTop(window.pageYOffset);

    location.hash = page;

    $('#board').load('./resource/modules/' + page + '/' + page + '.html');

    // se define el link active
    MENU.forEach(link =>
    {
        $('#' + link).removeClass('menu-active');
        if (link == page)
        {
            $('#' + link).addClass('menu-active');
        }
    })
}