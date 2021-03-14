// ------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------- Registro de Modulos --------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------- //
let ROUTES = [];
/**
 * @param {String} name nombre del componente
 * @param {String} path direccion del componente
 */
ROUTES.push
    (
        { name: 'home', path: './views/home/' },
        { name: 'features', path: './views/features/' },
        { name: 'downloads', path: './views/downloads/' },
        { name: 'donations', path: './views/donations/' },
        { name: 'auction', path: './views/auction/' },
        { name: 'bossinfo', path: './views/bossinfo/' },
        { name: 'rankings', path: './views/rankings/' },
        // menu top
        { name: 'characters', path: './views/characters/' },
        //{ name: 'rankings', path: './views/change_password/' },
    );
