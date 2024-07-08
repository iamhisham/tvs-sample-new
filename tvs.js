const countryPopover = document.getElementById("countryPopover");
const selectedCountryElement = document.getElementById("selectedCountry");
const selectedFlagElement = document.getElementById("selectedFlag");
const errorText = document.getElementById("errorText");
const proceedButton = document.getElementById("proceedButton");
const countryListElement = document.getElementById("countryList");
const searchCountry = document.getElementById("searchCountry");
const selectedCountryLeftView = document.getElementById("selectedCountryLeftView");
const countryName = document.getElementById("countryName");
const notFound = document.getElementById("noResultFound");


//Default when screen load
errorText.style.display = "none";
selectedCountryLeftView.style.display = "none";
selectedFlagElement.style.display = "none";
proceedButton.style.opacity = "0.5";
notFound.style.display = "none";

let updatedFlag = {
    country: "",
    flag: ""
};
countryData = [];

//sample response  //TODO: This is hardcoded after api remove this
let response = [
    {
        "_id": { "$oid": "667d30a7e510cf75f2ac2888" },
        "region_name": "Asia",
        "country_name": "Bangladesh",
        "flag_url": "https://tvsmemsiddevdiag.blob.core.windows.net/images/bangladesh-flag.png",
        "app_url": "https://bd.tvsaccelerator.com",
        "created_at": "2024-06-25T09:15:20Z",
        "modified_at": "2024-06-25T09:15:20Z",
        "is_active": true
    },
    {
        "_id": { "$oid": "667d30a7e510cf75f2ac2888" },
        "region_name": "Asia",
        "country_name": "India",
        "flag_url": "https://tvsmemsiddevdiag.blob.core.windows.net/images/bangladesh-flag.png",
        "app_url": "https://bd.tvsaccelerator.com",
        "created_at": "2024-06-25T09:15:20Z",
        "modified_at": "2024-06-25T09:15:20Z",
        "is_active": true
    },
    {
        "_id": { "$oid": "667d30a7e510cf75f2ac2888" },
        "region_name": "Latin America",
        "country_name": "America",
        "flag_url": "https://tvsmemsiddevdiag.blob.core.windows.net/images/bangladesh-flag.png",
        "app_url": "https://bd.tvsaccelerator.com",
        "created_at": "2024-06-25T09:15:20Z",
        "modified_at": "2024-06-25T09:15:20Z",
        "is_active": true
    }
];

document.addEventListener('DOMContentLoaded', getExistingCountryAPI);

function getExistingCountryAPI() {
    fetch('YOUR_API_ENDPOINT')  // TODO: Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
        .then(response => response.json())
        .then(data => formatResponse(data))
        .catch(error => console.error('Error fetching country data:', error));
}

function formatResponse(response) {   //LIKE:   const countryData = [{ region: "Asia", countries: [ 
                                                                            // { name: "Bangladesh", flag: "https://tems...."  },                                                                                
    const regions = {};                                                     // { name: "India",      flag: "https://tvsme...." }]   }         ];

    response.forEach(data => {
        if (!regions[data.region_name]) {
            regions[data.region_name] = [];
        }
        regions[data.region_name].push({
            name: data.country_name,
            flag: data.flag_url
        });
    });

    countryData = Object.keys(regions).map(region => ({
        region: region,
        countries: regions[region]
    }));

    displayCountryList(countryData);
}

function displayCountryList(countryList, filter = '') {
    countryListElement.innerHTML = '';
    let countryFound = false;

    countryList.forEach(region => {
        const filteredCountries = region.countries.filter(country => country.name.toLowerCase().includes(filter));

        if (filteredCountries.length > 0) {
            countryFound = true;
            const regionTitle = document.createElement('div');
            regionTitle.textContent = region.region;
            regionTitle.classList.add('region-title');
            countryListElement.appendChild(regionTitle);

            filteredCountries.forEach(country => {
                const countryDiv = document.createElement('div');
                countryDiv.classList.add('country-item');

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'country';
                radioInput.value = country.name;

                if (updatedFlag.country === country.name) {
                    radioInput.checked = true;
                }

                const flagImg = document.createElement('img');
                flagImg.src = country.flag;
                flagImg.alt = `${country.name} Flag`;
                flagImg.classList.add('country-flag');

                const countryLabel = document.createElement('label');
                countryLabel.textContent = country.name;

                countryDiv.appendChild(radioInput);
                countryDiv.appendChild(flagImg);
                countryDiv.appendChild(countryLabel);

                // Select country on click
                countryDiv.onclick = () => {
                    radioInput.checked = true;
                    updatedFlag = {
                        country: country.name,
                        flag: country.flag
                    };
                };

                countryListElement.appendChild(countryDiv);
            });
        }
    });

    notFound.style.display = countryFound ? 'none' : 'block';
}

function populateCountryList() {
    displayCountryList(countryData);
}

function filterSearch(event) {
    displayCountryList(countryData, event.target.value.toLowerCase());
}

function presentPopover(show) {
    if (show) {
        populateCountryList();
        countryPopover.style.display = "block";
        document.getElementById('backdrop').style.display = "block";
        searchCountry.focus();
    } else {
        countryPopover.style.display = "none";
        document.getElementById('backdrop').style.display = "none";
        searchCountry.innerHTML = '';
    }
}

function dismissPopover(isSubmit) {
    if (isSubmit && updatedFlag.country) {
        selectedCountryElement.textContent = updatedFlag.country;
        selectedCountryElement.style.color = "black";
        selectedCountryElement.style.opacity = "1";
        selectedFlagElement.src = updatedFlag.flag;
        selectedFlagElement.style.display = "inline-block";
        proceedButton.disabled = false;
        proceedButton.style.opacity = "1";
        errorText.style.display = "none";
        selectedCountryLeftView.style.display = "flex";
        countryName.innerHTML = updatedFlag.country;
        searchCountry.focus();
    } else {
        selectedCountryElement.textContent = "Select the Country";
        selectedFlagElement.style.display = "none";
        proceedButton.disabled = true;
        proceedButton.style.opacity = "0.5";
        errorText.style.display = "block";
    }
    searchCountry.value = '';
    presentPopover(false);
}

function selectCountry(country) {
    updatedFlag = {
        country: country.name,
        flag: country.flag
    };
    dismissPopover(true);
}

function proceedToLogin() {
    alert("Proceed to login with selected country: " + updatedFlag.country);
}

//backrop for downdown
document.getElementById('backdrop').addEventListener('click', function () {
    document.getElementById('countryPopover').style.display = 'none';
    document.getElementById('backdrop').style.display = 'none';
    searchCountry.value = '';
});
