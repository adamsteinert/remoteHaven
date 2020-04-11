function fetchItems(route, addDataMethod, selectList) {
    fetch(route)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            addDataMethod(data, selectList);
        });
}

function addToSelectList(data, selectList) {
    var elm = document.getElementById(selectList);

    data.forEach(function (m) {
        var option = document.createElement("option");
        option.text = m.name;
        option.value = m.path;
        elm.add(option);
    })
}


function initItemLists() {
    fetchItems('/monsters', addToSelectList, "monsterSelect");
    fetchItems('/tiles', addToSelectList, "tileSelect");
}