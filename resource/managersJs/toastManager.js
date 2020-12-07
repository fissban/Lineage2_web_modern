// Posicion del primer toast
const BASE_POS = 180;
// Incremento de la posicion de cada toast a partir de 'BASE_POS'
const MOVEMENT = 90;

/**
 * Se deja visible un determinado toast por su 'id'
 * - Se revisa la lista de toast en 'localStorage' y se agrega el toast por debajo del ultimo.
 * - Se agrega al listado de toast en 'localStorage'.
 * @param {string} name 
 */
function openToastFixed(name)
{
    if (isMovil())
    {
        return;
    }

    // se previene que se abran toast q se cerraron en las ultimas 24hs
    if (getCookie(name) != '')
    {
        return;
    }
    let newPos = BASE_POS;
    // se averigua la posicion del ultimo toast y se posiciona por debajo al q se abrira
    if (localStorage.getItem('toastInfo') != '' && localStorage.getItem('toastInfo') != null)
    {
        let toastInfoParse = localStorage.getItem('toastInfo').split(',');
        if (toastInfoParse.length > 1)
        {
            newPos += MOVEMENT * (toastInfoParse.length - 1);
        }
    }

    // se guarda el ultimo toast agregado
    localStorage.setItem('toastInfo', localStorage.getItem('toastInfo') + name + ',');

    // open new toast
    $('#' + name).toast({ show: true, autohide: false });
    $('#' + name).toast('show');

    // se define la posicion del objeto y con el '+=' se habilita la animacion.
    $('#' + name).css('top', '+=' + newPos + 'px');
}

/**
 * Se cierra un determinado toast segun su 'id'.
 * - Se borra del listado en localStorage el nombre de este toast.
 * - Se oculta el toast.
 * - Se revisa el listado de los toast visibles y se los ordena.
 * @param {string} name 
 * @param {boolean} preventOpen -> true = next open in 
 */
function closeToastFixed(name, preventOpen = true)
{
    if (isMovil())
    {
        return;
    }
    // se borra de la lista el toast oculto
    localStorage.setItem('toastInfo', localStorage.getItem('toastInfo').replace(name + ',', ''));

    // se guarda como cookie para evitar que se vuelva a abrir antes de las 24hs
    if (preventOpen)
    {
        setCookie(name, 'close', 1);
    }

    // se oculta el toast
    $('#' + name).toast('hide');

    // se desplazan todos los toast asi quedan juntos y en formacion.
    let toastInfoParse = localStorage.getItem('toastInfo').split(',');
    if (toastInfoParse.length > 1)
    {
        let posLasElement = BASE_POS;
        toastInfoParse.forEach((toastId) =>
        {
            // esta verificacion debe estar porq siempre devuelve un ultimo valor vacio el metodo 'split'
            if (toastId != '' && toastId != null)
            {
                let toast = document.getElementById(toastId);
                if (toast.style.top != posLasElement + "px")
                {
                    $('#' + toastId).css('top', '-=' + MOVEMENT);
                    posLasElement -= BASE_POS;
                }
            }
        });
    }
}