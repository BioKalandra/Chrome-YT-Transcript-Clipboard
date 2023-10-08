window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            console.log(token);
        });
    });
};

window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            let init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            fetch(
                'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyDpsHaMb6LPfIov9yRfN9dzmmrhUkoERes',
                init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data)
                });
        });
    });
};

window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            let init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            fetch(
                'https://people.googleapis.com/v1/contactGroups/all?maxMembers=1000&key=AIzaSyDpsHaMb6LPfIov9yRfN9dzmmrhUkoERes',
                init)
                .then((response) => response.json())
                .then(function(data) {
                    let photoDiv = document.querySelector('#photoDiv');
                    let returnedContacts = data.memberResourceNames;
                    for (let i = 0; i < returnedContacts.length; i++) {
                        fetch(
                            'https://people.googleapis.com/v1/' + returnedContacts[i] +
                            '?personFields=photos&key=AIzaSyDpsHaMb6LPfIov9yRfN9dzmmrhUkoERes',
                            init)
                            .then((response) => response.json())
                            .then(function(data) {
                                let profileImg = document.createElement('img');
                                profileImg.src = data.photos[0].url;
                                photoDiv.appendChild(profileImg);
                            });
                    };
                });
        });
    });
};