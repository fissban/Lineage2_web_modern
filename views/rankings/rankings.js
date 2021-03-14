class Rankings
{
    lastMenuAuctionActive = '';

    constructor()
    {
        //
    }

    onInit()
    {
        //
    }

    onRequired()
    {
        //
    }

    /**
     * Define como activa la pestaña que se indique del auction
     * @param {String} id 
     */
    setActive(id)
    {
        if (this.lastMenuAuctionActive != '')
        {
            if ($('#' + this.lastMenuAuctionActive).hasClass('nav-ranking-on'))
            {
                $('#' + this.lastMenuAuctionActive).removeClass('nav-ranking-on');
            }
            if (!$('#' + this.lastMenuAuctionActive).hasClass('nav-ranking-off'))
            {
                $('#' + this.lastMenuAuctionActive).addClass('nav-ranking-off');
            }
        }

        this.lastMenuAuctionActive = id;
        $('#' + id).removeClass('nav-ranking-off');
        $('#' + id).addClass('nav-ranking-on');
    }

    async getPvp()
    {
        this.setActive('topPvp');
        // se borra el viejo contenido
        $('#content').html('');

        let result = await $.get('./api/getpvp.php');
        let json = JSON.parse(result);
        let pos = 1;

        let clases = await $.getJSON("./assets/json/clases.json");

        let html =
            `
                <div class="table-responsive">
                    <table class="table text-light pt-2">
                        <thead>
                            <th></th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Clan</th>
                            <th>PVP</th>
                        </thead>
                        <tbody>
                `;
        json.forEach(character =>
        {
            html +=
                `
                    <tr>
                        <td class="td-ranking"><img src="./assets/img/texturesGame/l2ui_ch3/ps_sizecontrol2.png" width="16" alt="icon position">${pos}</td>
                        <td class="td-ranking">${character.char_name}</td>
                        <td class="td-ranking">${clases[character.classid]}</td>
                        <td class="td-ranking">${character.clan_name}</td>
                        <td class="td-ranking">${character.pvpkills}</td>
                    </tr>
                `;

            pos++;
        });

        html += '</table></tbody></div>';
        $('#content').append(html);
    }

    async getPk()
    {
        this.setActive('topPk');
        // se borra el viejo contenido
        $('#content').html('');

        let result = await $.get('./api/getpk.php');
        let json = JSON.parse(result);
        let pos = 1;

        let clases = await $.getJSON("./assets/json/clases.json");

        let html =
            `
                <div class="table-responsive">
                    <table class="table text-light pt-2">
                        <thead>
                            <th></th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Clan</th>
                            <th>PVP</th>
                        </thead>
                        <tbody>
                `;
        json.forEach(character =>
        {
            html +=
                `
                    <tr>
                        <td class="td-ranking"><img src="./assets/img/texturesGame/l2ui_ch3/ps_sizecontrol2.png" width="16" alt="icon position">${pos}</td>
                        <td class="td-ranking">${character.char_name}</td>
                        <td class="td-ranking">${clases[character.classid]}</td>
                        <td class="td-ranking">${character.clan_name}</td>
                        <td class="td-ranking">${character.pkkills}</td>
                    </tr>
                `;

            pos++;
        });

        html += '</table></tbody></div>';
        $('#content').append(html);
    }

    async getCastles()
    {
        this.setActive('castles');
        // se borra el viejo contenido
        $('#content').html('');

        let result = await $.get('./api/getcastlesowner.php');
        let json = JSON.parse(result);
        let html =
            `
                <div class="table-responsive">
                    <table class="table text-light pt-2">
                        <thead>
                            <th></th>
                            <th>Castle</th>
                            <th>Owner</th>
                            <th>Tax Rate</th>
                            <th>Siege Date</th>
                        </thead>
                        <tbody>
                `;
        json.forEach(castle =>
        {
            html +=
                `
                    <tr>
                        <td class="td-ranking"><img src="./assets/img/texturesGame/l2ui_ch3/ps_sizecontrol2.png" width="16" alt="icon position"></td>
                        <td class="td-ranking">${castle.castle}</td>
                        <td class="td-ranking">${castle.owner}</td>
                        <td class="td-ranking">${castle.taxPercent}</td>
                        <td class="td-ranking">${castle.siegeDate}</td>
                    </tr>
                `;
        });

        html += '</table></tbody></div>';
        $('#content').append(html);
    }
}

var rankings = new Rankings();