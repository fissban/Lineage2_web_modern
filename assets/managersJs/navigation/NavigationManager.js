// --------------------------------------- Listener sobre la carga de la pagina --------------------------------------- //

/**
 * Acciones al cargar la estructura del html
 */
$(document).ready(() =>
{
    // carga de los diferentes modulos base de la pag
    //MENU.forEach(link => addMenuAction(link));
});

/**
 * Acciones al cargar completamente la pagina
 */
$(window).on('load', (e) =>
{
    // carga del modulo ppal de acuerdo al hash
    loadBoard();
});

/**
 * Acciones al cambiar la URL
 */
$(window).on('hashchange', (e) =>
{
    // se carga en el board el html especificado en la URL.
    loadBoard();
});

// --------------------------------------- Acciones al ejecutar un link --------------------------------------- //

lastPage = '';
/**
 * Carga la pagina en el 'board' de acuerdo a lo especificado en la URL
 */
function loadBoard()
{
    parseUrl(location.hash ? location.hash : '#home:main');
}

function parseUrl(url)
{
    let allHash = url.slice(1).split('&')

    firstPage = '';
    if (Array.isArray(allHash))
    {

        allHash.forEach(h =>
        {
            let parseH = h.split(':');

            let component_name = parseH[0];
            let component_path = ROUTES.find(r => r.name == component_name).path;
            let component_view = parseH[1];

            // CSS
            $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', component_path + component_name + '.css'));
            // HTML
            $('#' + component_view).load(component_path + component_name + '.html', () =>
            {
                // JS
                $('#' + component_view).append($("<script>loadScript('" + component_name + "', '" + component_path + "', () => " + component_name + ".onInit(), () => " + component_name + ".onRequired());</script>"));
            });


            if (firstPage == '')
            {
                firstPage = component_name;
            }
        });
    }

    setMenuState(firstPage);
}

function setMenuState(firstPage)
{
    let allMenu = document.querySelectorAll('a[data-navMain=true]')
    allMenu.forEach(m =>
    {
        $('#' + m.id).removeClass('active');
        if (m.id == firstPage)
        {
            $('#' + firstPage).addClass('active');
        }
    })
}