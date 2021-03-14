class Auction extends NavigationModel
{
    lastMenuAuctionActive = '';

    constructor()
    {
        super();
    }

    onInit()
    {
        this.getAuctions();
    }

    onRequired()
    {
        this.getAuctions();
    }

    viewItemsFromCharacter(objectId)
    {
        // se borra el viejo contenido
        $('#content').html('');

        $.get('./api/getInventory.php?objectid=' + objectId, (result) =>
        {
            let inventory = JSON.parse(result);

            $.getJSON('./assets/json/items.json', (itemsJSON) =>
            {
                let html =
                    `
                        <div class="table-responsive">
                        <table class="table-dark table-borderless" style="width:100%;font-size: medium;">
                        <thead class="text-center">
                            <th></th>
                            <th>Name</th>
                            <th>Count</th>
                            <th>Price <img src="./assets/img/texturesGame/l2ui_ct1/Icon_DF_Common_Adena.png" width="36" alt="adena icon" title="adena icon"></th>
                            <th>Coin</th>
                            <th></th>
                        </thead>
                        <tbody>
                    `;
                let count = 0;
                inventory.forEach(itemInv =>
                {
                    if (itemInv.item_id == 57)// Ignore sell Adena
                    {
                        return true;
                    }
                    // se obtiene el nombre del item de acuerdo a su id
                    let itemJSON = itemsJSON.find(it => it.id == itemInv.item_id);

                    let img = './assets/img/texturesGame/icons/' + itemJSON.img + '.png';

                    let classRow = (count % 2 == 0) ? 'row-light' : 'row-dark';
                    html +=
                        `
                        <tr class="${classRow}">
                            <td style="width: 40px;">
                                <img src="${img}" width="32">
                            </td>
                            <td>
                                ${itemJSON.name} ${itemInv.enchant_level > 0 ? ('<span class="text-warning">+' + itemInv.enchant_level + '</span>') : ''}
                            </td>
                            <td>
                                <input type="number" class="form-control form-control-sm custom-form" style="max-width: 90%" value="${itemInv.count}" min="1" max="${itemInv.count}" id="formCount_${itemInv.object_id}" oninput="checkInputMaxValue(this)">
                            </td>
                            <td style="width:80px">
                                <input type="number" class="form-control form-control-sm custom-form" style="max-width: 90%" value="1" min="1" max="2147483647" id="formPrice_${itemInv.object_id}" oninput="checkInputMaxValue(this)">
                            </td>
                            <td>
                                <div class="col-sm-12">
                                    <select class="form-select form-control-sm custom-form" id="formCoin_${itemInv.object_id}" style="width: 100%">
                                        <option value="57" selected>Adena</option>
                                        <option value="2807">Gold Bar</option>
                                        <option value="3435">Nvidia</option>
                                        <option value="3434">Coke</option>
                                    </select>
                                </div>
                                
                            </td>
                            <td class="">
                                <button class="btn btn-sm btn-block btn-normal" onclick="auction.sell(${objectId}, ${itemInv.item_id}, ${itemInv.enchant_level}, ${itemInv.object_id})">Sell</button>
                            </td>
                        </tr>
                    `;
                    count++;
                });

                html += '</tbody></table></div>';
                $('#content').append(html);
            });
        });
    }

    sell(owner_id, item_id, item_enchant_level, object_id)
    {
        $.getJSON('./assets/json/items.json', (itemsJSON) =>
        {
            itemsJSON.forEach(itemJson =>
            {
                if (itemJson.id == item_id)
                {
                    let sendValues =
                    {
                        owner_id: owner_id,
                        item_id: item_id,
                        item_object_id: object_id,
                        item_count: $('#formCount_' + object_id).val(),
                        item_enchant_level: item_enchant_level,

                        item_type: itemJson.item_type,
                        item_grade: itemJson.item_grade,
                        item_slot: itemJson.item_slot,

                        price_count: $('#formPrice_' + object_id).val(),
                        price_id: $('#formCoin_' + object_id).val(),
                    };

                    $.post('./api/auctionAddItem.php', sendValues, (result) =>
                    {
                        let json = JSON.parse(result);
                        displayAlert(json.message, json.type);

                        if (json.type == 'SUCCESS')
                        {
                            this.viewItemsFromCharacter(owner_id);
                        }
                    });


                    return; // prevent more iterations
                }
            });
        });

    }

    async addAuction()
    {
        this.setActive('addAuction');

        // se borra el viejo contenido
        $('#content').html('');

        let result = await $.get('./api/islogin.php');
        if (result == 'false')
        {
            return;
        }

        $.get('./api/getCharacters.php', null, (result) =>
        {
            let characters = JSON.parse(result);

            let html = '';
            characters.forEach(character =>
            {
                let charTitle = character.title == '' ? 'N/A' : character.title;
                html +=
                    `
                        <div class="row pb-2 pt-2 row-add-auction">
                            <div class="col-6">
                                 ${character.char_name}  ( ${charTitle} )
                            </div>
                            <div class="col-6">
                                <button class="btn btn-sm btn-block btn-normal" onclick="auction.viewItemsFromCharacter(${character.obj_Id})">Ver items</button>
                            </div>
                        </div>
                    `;
            });

            $('#content').append(html);
        });
    }

    getAuctions()
    {
        this.setActive('auctionList');

        // se borra el viejo contenido
        $('#content').html('');

        //
        let htmlBase =
            `
        <div class="row">
            <div class="col-3 pb-2" style="border-right: 1px solid #d2c38d;">
                <ul class="nav flex-column">
                    <li class="nav-item pt-1" id="ALL">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'ALL', 'ALL')">All</a>
                    </li>
                </ul>
                <div class="row">
                    <div class="col-12 bg-color-primary text-center">
                        Armors
                    </div>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item pt-1" id="SLOT_HEAD">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_HEAD')">Head</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_FULL_ARMOR">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_FULL_ARMOR')">Full Armor</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_CHEST">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_CHEST')">Armor</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_LEGS">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_LEGS')">Pants</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_FEET">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_FEET')">Boats</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_GLOVES">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_GLOVES')">Gloves</a>
                    </li>
                    <li class="nav-item pt-1" id="SHIELD">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'SHIELD')">Shields</a>
                    </li>
                </ul>
                <div class="row pt-2">
                    <div class="col-12 bg-color-primary text-center">
                        Weapons
                    </div>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item pt-1" id="DAGGER">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'DAGGER')">Daggers</a>
                    </li>
                    <li class="nav-item pt-1" id="BLUNT">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'BLUNT')">Blunts</a>
                    </li>
                    <li class="nav-item pt-1" id="BIGBLUNT">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'BIGBLUNT')">Big Blunts</a>
                    </li>
                    <li class="nav-item pt-1" id="SWORD">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'SWORD')">Swords</a>
                    </li>
                    <li class="nav-item pt-1" id="DUAL">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'DUAL')">Dual Swords</a>
                    </li>
                    <li class="nav-item pt-1" id="BOW">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'BOW')">Bows</a>
                    </li>
                    <li class="nav-item pt-1" id="POLEARM">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'POLEARM')">Polearms</a>
                    </li>
                    <li class="nav-item pt-1" id="FIST">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'FIST')">Fist</a>
                    </li>
                    <li class="nav-item pt-1" id="DUALFIST">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'DUALFIST')">Dual Fist</a>
                    </li>
                </ul>
                <div class="row pt-2">
                    <div class="col-12 bg-color-primary text-center">
                        Others
                    </div>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item pt-1" id="SCRL_ENCHANT_AM">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'SCRL_ENCHANT_AM')">Enchant Armor</a>
                    </li>
                    <li class="nav-item pt-1" id="SCRL_ENCHANT_WP">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'TYPE', 'SCRL_ENCHANT_WP')">Enchant Weapon</a>
                    </li>
                    <li class="nav-item pt-1" id="SLOT_NONE">
                        <img src="./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png" width="16" alt="icon position">
                        <a class="text-menu" onclick="auction.searchItem(1, 'SLOT', 'SLOT_NONE')">Others</a>
                    </li>
                </ul>
            </div>
            <div class="col-9 pb-2 pt-1" id="content-items">
                <!-- panel derecho -->
            </div>
        </div>
        `;

        $('#content').append(htmlBase);
    }

    displaySearchItems(result)
    {
        // se limpia el contenido del div con los items
        $('#content-items').html('');

        // se inicializa la base del html
        let html =
            `
            <div class="table-responsive">
                <table class="table table-sm fs-6 table-dark table-borderless" style="width:100%;font-size: medium;">
                <thead>
                    <th></th>
                    <th>Name</th>
                    <th>Count</th>
                    <th>Grade</th>
                    <th>Price</th>
                    <th>Coin</th>
                    <th></th>
                </thead>
                <tbody>
            
            `;

        // se convierte a json los resultados traidos desde la DB
        let items = JSON.parse(result);
        // se leen las propiedades de los items creados por nosotros
        $.getJSON('./assets/json/items.json', (itemsJSON) =>
        {
            let sortOrderItems = ['S', 'A', 'B', 'C', 'D', 'NONE'];
            // custom shorted list
            items.data.sort(function (a, b)
            {
                return sortOrderItems.indexOf(a.item_grade) - sortOrderItems.indexOf(b.item_grade);
            })

            let count = 0;
            let nf = Intl.NumberFormat();
            // se recorren los items generando la estructura del html
            items.data.forEach(item =>
            {
                let coin = itemsJSON.find(it => it.id == item.price_id);
                let itemJSON = itemsJSON.find(it => it.id == item.item_id);
                let img = './assets/img/texturesGame/icons/' + itemJSON.img + '.png';

                let classRow = (count % 2 == 0) ? 'row-light' : 'row-dark';
                html +=
                    `
                    <tr class="${classRow}">
                        <td style="width: 40px;">
                            <img src="${img}" width="32">
                        </td>
                        <td>
                            ${itemJSON.name} ${item.item_enchant_level > 0 ? ('<span class="text-warning">+' + item.item_enchant_level + '</span>') : ''}
                        </td>
                        <td>
                            <input type="number" id="input_count_${count}" class="form-control form-control-sm custom-form" style="max-width: 90%" value="${item.item_count}" min="1" max="${item.item_count}" oninput="checkInputMaxValue(this)">
                        </td>
                        <td style="">
                            ${item.item_grade}
                        </td>
                        <td style="">
                            ${nf.format(item.price_count)}
                        </td>
                        <td style="">
                            ${coin.name}
                        </td>
                        <td class="mt-3">
                            <button class="btn btn-sm btn-block btn-normal" onclick="auction.generateBuyModal(${count}, '${itemJSON.name}', ${item.id}, ${item.item_enchant_level}, ${item.price_count}, '${itemJSON.img}', '${coin.name}')">Buy</button>
                        </td>
                    </tr> 
                `;
                count++;
            });

            html +=
                `
                    </tbody>
                </table>
            </div>
            `;
            $('#content-items').append(html);
        });
    }

    async generateBuyModal(position, item_name, row_id, item_enchant_level, price_count, itemImg, coin)
    {
        let result = await $.get('./api/islogin.php');
        if (result == 'false')
        {
            displayAlert('Need login to buy', 'INFO');
            return;
        }

        openModal('modalBuyConfirmItem', () =>
        {
            $.get('./api/getCharacters.php', null, (result) =>
            {
                let characters = JSON.parse(result);

                let count_buy = $('#input_count_' + position).val();

                $('#itemCountBuy').text(count_buy);
                $('#itemNameBuy').text(item_name + (item_enchant_level > 0 ? (' +' + item_enchant_level) : ''));
                $('#itemPriceBuy').text(Intl.NumberFormat().format(count_buy * price_count));
                $('#itemImgBuy').attr('src', './assets/img/texturesGame/icons/' + itemImg + '.png');
                $('#itemCoin').text(coin);

                characters.forEach(cha =>
                {
                    $('#buyerBuy').append($('<option>').val(cha.obj_Id).text(cha.char_name))
                });

                $('#itemButtonBuy').bind('click', () =>
                {
                    let sendValues =
                    {
                        id: row_id,
                        item_count: count_buy,
                        buyer_obj_id: $('#buyerBuy').val(),
                    };
                    $.post('./api/auctionBuyItem.php', sendValues, (result) =>
                    {
                        let m = JSON.parse(result);

                        displayAlert(m.message, m.type);
                    });
                });
            });

        });
    }


    /**
     * Define como activa el submenu de busqueda de items.
     * @param {String} id 
     */
    setMenuAuctionActive(id)
    {
        document.getElementById(id).childNodes[1].src = "./assets/img/texturesGame/l2ui_ch3/questwndplusbtn_over.png";
        document.getElementById(id).childNodes[3].classList.add('text-warning');

        if (this.lastMenuAuctionActive != '')
        {
            document.getElementById(this.lastMenuAuctionActive).childNodes[1].src = "./assets/img/texturesGame/l2ui_ch3/questwndminusbtn_over.png";
            document.getElementById(this.lastMenuAuctionActive).childNodes[3].classList.remove('text-warning');
        }

        this.lastMenuAuctionActive = id;
    }

    /**
     * Se realiza la busqueda de items en la DB de acuerdo a los params definidos.
     * @param {String} page
     * @param {String} action
     * @param {String} value
     */
    searchItem(page = 1, action, value = 'none')
    {
        this.setMenuAuctionActive(value);
        $.get('./api/auctionGetItems.php?action=' + action + '&value=' + value + '&page=' + page, (result) => 
        {
            this.displaySearchItems(result);
        });
    }

    /**
     * Define como activa la pestaña que se indique del auction
     * @param {String} id 
     */
    setActive(id)
    {
        let list = ['auctionList', 'yourAuction', 'addAuction'];

        list.forEach(element =>
        {
            if ($('#' + element).hasClass('nav-auction-on'))
            {
                $('#' + element).removeClass('nav-auction-on');
            }

            if (!$('#' + element).hasClass('nav-auction-off'))
            {
                $('#' + element).addClass('nav-auction-off');
            }
        });

        $('#' + id).removeClass('nav-auction-off');
        $('#' + id).addClass('nav-auction-on');
    }

    /**
     * Se chequea y se evita poner en los inputs valores mayores a los definidos
     * @param {*} object 
     */
    checkInputMaxValue(object)
    {
        // si se supera el maximo, se definira el mismo en el input
        if (object.value > object.max)
        {
            object.value = object.max;
        }
    }

    // --------------------------------------------------------------------------------------------------------------------

    HTML_ON_SALE =
        `
        <div class="row">
            <div class="col-12 bg-color-title text-center">
                ITEMS ON SALE
            </div>
        </div>
        <div class="table-responsive">
        <table class="table-dark table-borderless" style="width:100%;font-size: medium;">
            <thead>
                <th></th>
                <th>Name</th>
                <th>Count</th>
                <th>Grade</th>
                <th>Price</th>
                <th>Coin</th>
                <th></th>
            </thead>
        `;

    HTML_SOLD =
        `
        <div class="row">
            <div class="col-12 bg-color-title text-center">
                ITEMS SOLD
            </div>
        </div>
        <div class="table-responsive">
        <table class="table-dark table-borderless" style="width:100%;font-size: medium;">
            <thead>
                <th></th>
                <th>Name</th>
                <th>Count</th>
                <th>Price Sold</th>
                <th>Coin</th>
                <th></th>
            </thead>
        `;

    async getMyAuctions()
    {
        this.setActive('yourAuction');

        $('#content').html('');

        let result = await $.get('./api/islogin.php');
        if (result == 'false')
        {
            return;
        }
        let html = '';
        // ITEMS A LA VENTA -----------------------------------------------
        let resultSale = await $.get('./api/auctionGetItemsOnSale.php');

        html += this.HTML_ON_SALE;

        if (resultSale == '')
        {
            html += '<tbody>'
            html += '</tbody></table>'
        }
        else
        {
            let items = JSON.parse(resultSale);

            html += '<tbody>'

            let count = 0;
            let nf = Intl.NumberFormat();
            let itemsJSON = await $.getJSON('./assets/json/items.json');

            items.data.forEach(async item =>
            {
                let coin = itemsJSON.find(it => it.id == item.price_id);
                let itemJSON = itemsJSON.find(it => it.id == item.item_id);
                let img = './assets/img/texturesGame/icons/' + itemJSON.img + '.png';
                let classRow = (count % 2 == 0) ? 'row-light' : 'row-dark';
                html +=
                    `
                    <tr class="${classRow}">
                        <td style="width: 40px;"><img src="${img}" width="32"></td>
                        <td>${itemJSON.name} ${item.item_enchant_level > 0 ? ('<span class="text-warning">+' + item.item_enchant_level + '</span>') : ''}</td>
                        <td>${item.item_count}</td>
                        <td>${item.item_grade}</td>
                        <td>${nf.format(item.price_count)}</td>
                        <td>${coin.name}</td>
                        <td class="mt-3"><button class="btn btn-sm btn-block btn-normal" onclick="auction.cancelAuction(${item.id})">Delete</button></td>
                    </tr> 
                    `;
                count++;
            });
            html += '</tbody></table></div>'
        }
        // ITEMS VENDIDOS -----------------------------------------------
        let resultSold = await $.get('./api/auctionGetItemsSold.php');

        html += this.HTML_SOLD;

        if (resultSold == '')
        {
            html += '<tbody>'
            html += '</tbody></table>'
        }
        else
        {
            let items = JSON.parse(resultSold);

            html += '<tbody>'

            let characters = JSON.parse(await $.get('./api/getCharacters.php'));
            characters.forEach(cha =>
            {
                $('#buyerBuy').append($('<option>').val(cha.obj_Id).text(cha.char_name))
            });


            let count = 0;
            let nf = Intl.NumberFormat();
            let itemsJSON = await $.getJSON('./assets/json/items.json');
            items.data.forEach(async item =>
            {
                let coin = itemsJSON.find(it => it.id == item.price_id);
                let itemJSON = itemsJSON.find(it => it.id == item.item_id);
                let img = './assets/img/texturesGame/icons/' + itemJSON.img + '.png';
                let itemName = itemJSON.name + item.item_enchant_level > 0 ? ('<span class="text-warning">+' + item.item_enchant_level + '</span>') : '';
                let classRow = (count % 2 == 0) ? 'row-light' : 'row-dark';
                html +=
                    `
                    <tr class="${classRow}">
                        <td style="width: 40px;"><img src="${img}" width="32"></td>
                        <td>${itemName}</td>
                        <td>${item.item_count}</td>
                        <td>${nf.format(item.item_count * item.price_count)}</td>
                        <td>${coin.name}</td>
                        <td class="mt-3"><button class="btn btn-sm btn-block btn-normal" onclick="auction.openModalClaimItem(${item.id}, '${img}', '${itemName}', ${item.item_count}, ${item.item_count * item.price_count}, '${coin.name}')">Claim</button></td>
                    </tr>
                    `;
                count++;
            });
            html += '</tbody></table>'
        }

        $('#content').html(html);
    }

    openModalClaimItem(row_id, img, name, count, price, coin)
    {
        openModal('modalClaimConfirm', () =>
        {
            $.get('./api/getCharacters.php', null, (result) =>
            {
                let characters = JSON.parse(result);

                $('#itemCountClaim').text(count);
                $('#itemNameClaim').text(name);
                $('#itemPriceClaim').text(Intl.NumberFormat().format(price));
                $('#itemImgClaim').attr('src', img);

                $('#itemCoin').text(coin);

                characters.forEach(cha =>
                {
                    $('#claimerBuy').append($('<option>').val(cha.obj_Id).text(cha.char_name))
                });

                $('#itemButtonClaim').bind('click', () =>
                {
                    let sendValues =
                    {
                        id: row_id,
                        claimer_id: $('#claimerBuy').val(),
                    };
                    $.post('./api/auctionClaimItem.php', sendValues, (resultClaim) =>
                    {
                        let m = JSON.parse(resultClaim);
                        // alerta informando el resultado
                        displayAlert(m.message, m.type);

                        // si esta todo ok se actualiza la pestaña
                        if (m.type == 'SUCCESS')
                        {
                            this.getMyAuctions();
                        }
                    });
                });
            });

        });
    }

    cancelAuction(id)
    {
        let sendValues =
        {
            id: id,
        };

        $.post('./api/auctionCancelItem.php', sendValues, (result) =>
        {
            let m = JSON.parse(result);
            // alerta informando el resultado
            displayAlert(m.message, m.type);

            // si esta todo ok se actualiza la pestaña
            if (m.type == 'SUCCESS')
            {
                this.getMyAuctions();
            }
        });
    }
}

var auction = new Auction();

