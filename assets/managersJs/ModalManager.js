
function openModal(id, callback = null)
{
    $('#modal-container').load('./views/modals/' + id + '.html', () =>
    {
        // se ajusta la posicion de la ventana para q sea visible invocandolo desde cualquier punto.
        //$('#modal').css('top', $(window).scrollTop() + 'px');
        // finalmente se abre el modal
        $('#modal').modal({ show: true, backdrop: true });

        if (callback)
        {
            callback();
        }

    });
}