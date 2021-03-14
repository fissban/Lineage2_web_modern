/**
 * Enviar forms con imagenes y cosas asi...se debe enviar el formulario completo
 * @param {*} url 
 * @param {*} method 
 * @param {*} form 
 * @param {*} resultCallBack 
 */
function requestApiForm(url, method, form, resultCallBack)
{
    $.ajax({
        url: url,
        type: method,
        data: form,
        dataType: 'json',// what to expect back from the PHP script, if anything

        success: (result) =>
        {
            resultCallBack(result);
        },
        error: (result) =>
        {
            console.log('error', result);
        },
        contentType: false,
        cache: false,
        processData: false,
    });
}

/**
 * Enviar informacion json a la base de datos.
 * - Se obtiene un json
 * @param {*} url 
 * @param {*} method 
 * @param {*} json 
 * @param {*} resultCallBack -> json
 */
function requestApi(url, method, json, resultCallBack)
{
    $.ajax({
        url: url,
        type: method,
        data: JSON.stringify(json),
        dataType: 'json',// what to expect back from the PHP script, if anything
        contentType: "application/json; charset=utf-8",
        cache: false,
        processData: false,
        success: (result) =>
        {
            resultCallBack(result);
        },
        error: (result) =>
        {
            console.log('error', result);
        },
    });
}