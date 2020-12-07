const MENU = ['home', 'features', 'downloads', 'donate', 'events', 'votes', 'register'];

const MENU_LOGIN = ['characters', 'change_password'];

let lastPage = '';
/**
 * Acciones al cargar la estructura del html
 */
$(document).ready(() =>
{
    // carga de los diferentes modulos base de la pag
    $('#status').load('./resource/views/status.html');
    $('#ranking-pvp').load('./resource/views/ranking-pvp.html');
    $('#ranking-pk').load('./resource/views/ranking-pk.html');
    $('#castles').load('./resource/views/castles.html');
    $('#footer').load('./resource/views/footer.html');

    setTop();

    $.get('../api/islogin.php', null, (result) =>
    {
        if (result == 'false')
        {
            $('#top').load('./resource/views/top-public.html');
        }
        else
        {
            $('#top').load('./resource/views/top-login.html', null, () =>
            {
                // con jquery no cambia los valores
                document.getElementById('username').textContent = 'Hola ' + result;

                MENU_LOGIN.forEach(link => addMenuAction(link));
            });
        }
    });

    MENU.forEach(link => addMenuAction(link));
});

function setTop()
{
    $.get('../api/islogin.php', null, (result) =>
    {
        if (result == 'false')
        {
            $('#top').load('./resource/views/top-public.html');
        }
        else
        {
            $('#top').load('./resource/views/top-login.html', null, () =>
            {
                // con jquery no cambia los valores
                document.getElementById('username').textContent = 'Hola ' + result;

                MENU_LOGIN.forEach(link => addMenuAction(link));
            });
        }
    });
}

/**
 * Acciones al cargar completamente la pagina
 */
$(window).on('load', (e) =>
{
    // carga del modulo ppal de acuerdo al hash
    loadBoardByHash();
});

function addMenuAction(page)
{
    $('#' + page).click((e) =>
    {
        // se obtiene la posicion original de la ventana
        let oldPos = $(window).scrollTop();

        e.preventDefault();
        // se carga en el board el html q queremos.
        //loadBoard(page);
        location.hash = page;

        // al darle click la ventana se mueve a la posicion del div donde se carga la pag
        // con esto hacemos parecer q nunca se movio
        $(window).scrollTop(oldPos);
    });
}

/**
 * Acciones al cambiar la URL
 */
$(window).on('hashchange', (e) =>
{
    // se carga en el board el html especificado en la URL.
    loadBoardByHash();
});

/**
 * Carga la pagina en el 'board' de acuerdo a lo especificado en la URL
 */
function loadBoardByHash()
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
    if (lastPage == page)
    {
        return;
    }

    lastPage = page;

    $('#board').load('./resource/views/' + page + '/' + page + '.html');

    // se define el link active
    if (MENU.includes(page))
    {
        MENU.forEach(link =>
        {
            $('#' + link).removeClass('menu-active');
            if (link == page)
            {
                $('#' + link).addClass('menu-active');
            }
        })
    }
}

function openModal(id)
{
    $('#modal-container').load('./resource/views/modals/' + id + '.html', () =>
    {
        // se ajusta la posicion de la ventana para q sea visible invocandolo desde cualquier punto.
        $('#modal').css('top', $(window).scrollTop() + 'px');
        // finalmente se abre el modal
        $('#modal').modal({ show: true, backdrop: true });
    });

}