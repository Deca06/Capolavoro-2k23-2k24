const baseUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1320";
const PokeContainer = document.getElementById("basePokeContainer");
ManagePokemonCards(baseUrl);

function ManagePokemonCards(baseUrl){
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            let PokeList = [];
            let PokeListSliced = [];
            let Alldata = data;
            PokeList = data.results;
            PokeListSliced = PokeList.slice(0, 500);

            const ImgSrc = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
            let cont = 1;
            let AllImg = [];

            PokeListSliced.forEach(PokeInfo => {
                const CreatePokemon = (PokeInfo) =>{
                    const Poke = document.createElement("div");
                    Poke.setAttribute("dataID", PokeInfo.order)
                    Poke.classList.add("Pokemon");
                    const PokeInfoURL = PokeInfo.url; 
                    const DividingUrl = PokeInfoURL.split("/");
                    let GetPokeID = DividingUrl[DividingUrl.length -2];
                    AllImg = ImgSrc + String(GetPokeID) + ".png";   
                    Poke.innerHTML = `
                    <div><img src=${AllImg}></div>
                    <div><h2><strong>${PokeInfo.name.charAt(0).toUpperCase() + PokeInfo.name.slice(1)}</strong></h2></div>
                    `;

                    const InfoBar = document.getElementById("LateralInfoBar");
                
                    Poke.addEventListener("click",() =>{  
                        InfoBar.style.display = "block"
                        const PokeInfoURL = PokeInfo.url; 
                        const DividingUrl = PokeInfoURL.split("/");
                        let GetPokeID = DividingUrl[DividingUrl.length -2];
                        fetchPokeDetails(GetPokeID, PokeInfo.name);
                        PokeStats(GetPokeID);
                        PokeType(GetPokeID);
                    });
                    return Poke;
                };
                
                let Poke = CreatePokemon(PokeInfo);
                PokeContainer.appendChild(Poke);
                cont = cont +1;
            })

        })
}

function fetchPokeDetails(PokeID, PokeName){
    const GetGifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${PokeID}.gif`;//id or name
    const GifContainer = document.getElementById("GifBox"); 
    GifContainer.innerHTML = `
    <div class="GifImageContainer"><img src="${GetGifUrl}"></div>  
    <div><h6>${PokeName.charAt(0).toUpperCase() + PokeName.slice(1)}</h6></div>
    `;
}

function PokeStats(ID){
    const BaseStatsURL = "https://pokeapi.co/api/v2/pokemon/" + String(ID);
    fetch(BaseStatsURL)
        .then(response => response.json())
        .then(stats =>{
            let PokeListStats =[];
            PokeListStats = stats;

            document.getElementById("SpanATK").innerHTML = PokeListStats.stats[0].base_stat;
            document.getElementById("SpanHP").innerHTML = PokeListStats.stats[1].base_stat;
            document.getElementById("SpanDEF").innerHTML = PokeListStats.stats[2].base_stat;
            document.getElementById("SpanSPA").innerHTML = PokeListStats.stats[3].base_stat;
            document.getElementById("SpanSPD").innerHTML = PokeListStats.stats[4].base_stat;
            document.getElementById("SpanSPEED").innerHTML = PokeListStats.stats[5].base_stat;
        })
}

function PokeType(ID){
    const BaseTypeURL = "https://pokeapi.co/api/v2/pokemon/" + String(ID);
    fetch(BaseTypeURL)
        .then(response => response.json())
        .then(type =>{
            let PokeType = [];
            PokeType = type;

            document.getElementById("Type1").innerHTML = '';
            document.getElementById("Type2").innerHTML = '';
            
            if(PokeType.types.length == 2){
                document.getElementById("Type1").innerHTML = PokeType.types[0].type.name.charAt(0).toUpperCase() + PokeType.types[0].type.name.slice(1);
                document.getElementById("Type2").innerHTML = PokeType.types[1].type.name.charAt(0).toUpperCase() + PokeType.types[1].type.name.slice(1);
            }
            else if(PokeType.types.length == 1){
                    document.getElementById("Type1").innerHTML = PokeType.types[0].type.name.charAt(0).toUpperCase() + PokeType.types[0].type.name.slice(1);
                    document.getElementById("Type2").innerHTML = "----";
            }
            else{
                    document.getElementById("Type1").innerHTML = "----";
                    document.getElementById("Type2").innerHTML = "----";
            }

        })
}

const UserInput = document.getElementById("Searcher");
const BasePokeURL = "https://pokeapi.co/api/v2/pokemon/"

UserInput.addEventListener('keypress', function(e){
    if(e.key === "Enter"){
        const SearcherURL = BasePokeURL + UserInput.value.toLowerCase();
        fetch(SearcherURL)
            .then(response => response.json())
            .then(allData => {
                const AllDataPick = allData;

                if(SearcherURL != BasePokeURL){
                    PokeContainer.innerHTML = `
                    <div>
                        <div><img src=${AllDataPick.sprites.front_default}></div>
                        <div><h2>${AllDataPick.name.charAt(0).toUpperCase() + AllDataPick.name.slice(1)}</h2></div>
                    </div>
                    `;
                    console.log(SearcherURL);
                    document.getElementById("basePokeContainer").style.justifyContent = "flex-start"
                    document.getElementById("basePokeContainer").style.backgroundColor = "transparent"
                    document.getElementById("LateralInfoBar").style.display = "block"
                    fetchPokeDetails(AllDataPick.id, AllDataPick.name);
                    PokeStats(AllDataPick.id);
                    PokeType(AllDataPick.id);
                }else{
                    PokeContainer.innerHTML = '';
                    //document.getElementById("LateralInfoBar").style.display = "none"
                    ManagePokemonCards(baseUrl);
                }  
                
        })
    }
})
