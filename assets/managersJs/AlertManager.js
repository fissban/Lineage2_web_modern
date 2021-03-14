// tiempo en que tardara en desaparecer la alerta
const TIME_DISAPPEAR = 7000;

/**
 * Se abre una alerta con un determinado tipo en la ezquina izquierda inferior.
 * @param {string} text 
 * @param {string} lavel (INFO, SUCCESS, WARNING)
 */
function displayAlert(text, lavel)
{
    let textId = '';
    let windowId = '';

    switch (lavel)
    {
        case 'INFO':
            textId = 'alertInfoText';
            windowId = 'windowAlertInfo';
            break;
        case 'SUCCESS':
            textId = 'alertSuccessText';
            windowId = 'windowAlertSuccess';
            break;
        case 'WARNING':
            textId = 'alertWarningText';
            windowId = 'windowAlertWarning';
            break;
    }

    // se ajusta el texto de la alert
    $('#' + textId).text(text);

    // se inicializa la animacion de la alert y se ubica en la posicion deseada.
    $('#' + windowId).css('bottom', '+50px');
    $('#' + windowId).css('visibility', 'visible');

    // se crea el task para cerrar la alert y volverlo a la posicion inicial
    setTimeout(() =>
    {
        $('#' + windowId).css('bottom', '-150px');
        $('#' + windowId).css('visibility', 'hidden');
    }, TIME_DISAPPEAR);
}