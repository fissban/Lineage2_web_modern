$.get('../api/grandBossInfo.php', (result) =>
{
    let bosses = JSON.parse(result);

    sortJSON(bosses, 'level', 'asc');
    bosses.forEach(boss =>
    {
        $.getJSON('../json/npcs/' + boss.boss_id + '.json', (bossJSON) =>
        {
            let isDead = boss.respawn_time > 0 ? true : false;
            let respawn_time = boss.respawn_time == 0 ? 'N/A' : new Date(parseInt(boss.respawn_time)).toLocaleString();
            let html =
                `
                <tr>
                    <td class="td-boss">${bossJSON.name}</td>
                    <td class="td-boss">${bossJSON.level}</td>
                    <td class="td-boss ${isDead ? 'text-danger' : 'text-success'}">${isDead > 0 ? 'DEAD' : 'LIVE'}</td>
                    <td class="td-boss">${respawn_time}</td>
                </tr>
            `;
            $('#infoTable1').append(html);
        });

    });
});
$.get('../api/bossInfo.php', (result) =>
{
    let bosses = JSON.parse(result);

    bosses = sortJSON(bosses, 'level', 'desc');
    bosses.forEach(boss =>
    {
        $.getJSON('../json/npcs/' + boss.boss_id + '.json', (bossJSON) =>
        {
            let isDead = boss.respawn_time > 0 ? true : false;
            let respawn_time = boss.respawn_time == 0 ? 'N/A' : new Date(parseInt(boss.respawn_time)).toLocaleString();
            let html =
                `
                <tr>
                    <td class="td-boss">${bossJSON.name}</td>
                    <td class="td-boss">${bossJSON.level}</td>
                    <td class="td-boss ${isDead ? 'text-danger' : 'text-success'}">${isDead > 0 ? 'DEAD' : 'LIVE'}</td>
                    <td class="td-boss">${respawn_time}</td>
                </tr>
            `;
            $('#infoTable2').append(html);
        });

    });
});

/**
 * Ordenar JSON por medio del valor de una de sus propiedades
 * @author Fernando Magrosoto V. (@fmagrosoto)
 * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/sort
 * @example sortJSON(json, propiedad, el orden)
 * @licence MIT
 * @version 1.0
 * @copyleft 2016 - Fernando Magrosoto V.
 * 
 */
function sortJSON(data, key, orden)
{
    return data.sort(function (a, b)
    {
        let x = a[key];
        let y = b[key];

        if (orden === 'asc')
        {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc')
        {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}