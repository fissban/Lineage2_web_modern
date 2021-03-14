class Characters extends NavigationModel
{
    constructor()
    {
        super();
    }

    onInit()
    {
        this.getCharactersList();
    }

    onRequired()
    {
        this.getCharactersList();
    }

    getCharactersList()
    {
        $.get('./api/islogin.php', null, (result) =>
        {
            if (result == 'false')
            {
                return;
            }

            $.getJSON("./assets/json/clases.json", (clases) =>
            {
                $.get('./api/getCharacters.php', null, (result) =>
                {
                    let characters = JSON.parse(result);

                    characters.forEach(character =>
                    {
                        this.createPanelCharacter(character, clases);
                    });
                });
            });
        });
    }

    createPanelCharacter(character, clases)
    {
        let html =
            `
            <div class="row panel-border mt-3 p-1">
                <div class="col-12">
                    <div class="row mb-1">
                        <div class="col-4">
                            <span class="text-color-primary">Name:</span> ${character.char_name} (${character.title != '' ? character.title : 'N/A'})
                        </div>
                        <div class="col-8 text-right">
                            <span class="text-color-primary">Level:</span> ${character.level}
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col-12">
                            <span class="text-color-primary">Class:</span> ${clases[character.classid]}
                        </div>
                    </div>
                    <div class="row mb-1">
                        <div class="col-12">
                            <span class="text-color-primary">Clan:</span> ${character.clan_name}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1">
                            HP
                        </div>
                        <div class="col-11">
                            <div class="progress" style="height: 1rem;">
                                <div class="progress-bar bg-danger" role="progressbar" style="color:#000000 !important; width: ${character.curHp / character.maxHp * 100}%;" aria-valuenow="${character.curHp}" aria-valuemin="0" aria-valuemax="${character.maxHp}">${character.curHp}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1">
                            MP
                        </div>
                        <div class="col-11">
                            <div class="progress" style="height: 1rem;">
                                <div class="progress-bar bg-primary" role="progressbar" style="color:#000000 !important; width: ${character.curMp / character.maxMp * 100}%;" aria-valuenow="${character.curMp}" aria-valuemin="0" aria-valuemax="${character.maxMp}">${character.curMp}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-1">
                            CP
                        </div>
                        <div class="col-11">
                            <div class="progress" style="height: 1rem;">
                                <div class="progress-bar bg-warning" role="progressbar" style="color:#000000 !important; width: ${character.curCp / character.maxCp * 100}%;" aria-valuenow="${character.curMp}" aria-valuemin="0" aria-valuemax="${character.maxMp}">${character.curMp}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 text-center">
                            <ul class="menu-cha">
                                <li><button onclick="characters.viewInventory('${character.obj_Id}')" class="btn btn-sm btn-normal ml-3">Inventario</button></li>
                                <li><button onclick="characters.moveCharacter('${character.char_name}')" class="btn btn-sm btn-normal ml-3">Mover a zona segura</button></li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
        $('#characterList').append(html);
    }

    viewInventory(obj_id)
    {
        // no encontre otra manera xD
        sessionStorage.setItem('viewInventory', obj_id);

        // se abre el modal del inventario
        openModal('modalInventory');
    }

    moveCharacter(charName)
    {
        $.get('./api/moveCharacterSafeZone.php?charName=' + charName, (result) =>
        {
            displayAlert(result, 'SUCCESS');
        });
    }
}

characters = new Characters()
