/**
 * Lista de scripts cargados en el navegador
 */
let scripts = [];

console.log
/**
 * Esta clase es requerida para invocar scripts desde otros htmls para evitar que se recargen mas de una ves.
 * @param {String} path
 * @param {function} onInit 
 * @param {function} onRequired
 */
function loadScript(name, path, onInit, onRequired)
{
    if (!scripts.includes(name))
    {
        scripts.push(name);
        $.getScript(path + name + '.js', () => onInit());
    }
    else
    {
        onRequired();
    }
}