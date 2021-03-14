async function getItemById(id)
{
    let itemData =
    {
        id: "9999",
        name: "N/A",
        img: "NOIMAGE",
        item_type: "NONE",
        item_grade: "NONE",
        item_slot: "NONE",
        weight: "0",
        dropable: "false",
        destroyable: "false",
        tradable: "false",
        depositable: "false"
    };

    let itemsJSON = await $.getJSON('./json/items.json');

    return itemsJSON.find(it => it.id == id);
    ;

}