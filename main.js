//const MENU = ['home', 'features', 'downloads', 'donate', 'auction', 'bossinfo', 'rankings'];

//const MENU_LOGIN = ['characters', 'change_password'];

/**
 * Se previene advertencias de sincronizacion en la consolas
 */
// $.ajaxPrefilter(function (options, originalOptions, jqXHR)
// {
//     options.async = true;
// });

/**
 * Acciones al cargar la estructura del html
 */
$(document).ready(() =>
{
    // carga de los diferentes modulos base de la pag
    $('#status').load('./views/status.html');
    $('#vote').load('./views/vote.html');
    $('#facebook').load('./views/facebook.html');
    $('#discord').load('./views/discord.html');
    $('#footer').load('./views/footer.html');
    $('#players').load('./views/players.html');

    setTop();

    $.get('./api/islogin.php', null, (result) =>
    {
        if (result == 'false')
        {
            $('#top').load('./views/top-public.html');
        }
        else
        {
            $('#top').load('./views/top-login.html', null, () =>
            {
                // con jquery no cambia los valores
                document.getElementById('username').textContent = 'Hola ' + result;
            });
        }
    });
});

function setTop()
{
    $.get('./api/islogin.php', null, (result) =>
    {
        if (result == 'false')
        {
            $('#top').load('./views/top-public.html');
        }
        else
        {
            $('#top').load('./views/top-login.html', null, () =>
            {
                // con jquery no cambia los valores
                document.getElementById('username').textContent = 'Hola ' + result;
            });
        }
    });
}
