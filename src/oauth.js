window.onload = function () {

    document.querySelector('#token').addEventListener('click', function () {
        console.log('hola')
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            console.log(token);
            document.querySelector('#tokenId').innerHTML = token;
        });
    });


    document.querySelector('#authButton').addEventListener('click', function () {
        console.log('hola jan')
        return gapi.auth2.getAuthInstance()
            .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
            .then(function () {
                console.log("Sign-in successful");
            }, function (err) {
                console.error("Error signing in", err);
            });
    })

    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            let init = {
                method: 'GET', async: true, headers: {
                    Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'
                }, 'contentType': 'json'
            };
            fetch('https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=', init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data)
                });
        });
    });

    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({interactive: true}, function (token) {
            let init = {
                method: 'GET', async: true, headers: {
                    Authorization: 'Bearer ' + token, 'Content-Type': 'application/json'
                }, 'contentType': 'json'
            };
            fetch('https://people.googleapis.com/v1/contactGroups/all?maxMembers=1000&key=', init)
                .then((response) => response.json())
                .then(function (data) {
                    let photoDiv = document.querySelector('#photoDiv');
                    let returnedContacts = data.memberResourceNames;
                    for (let i = 0; i < returnedContacts.length; i++) {
                        fetch('https://people.googleapis.com/v1/' + returnedContacts[i] + '?personFields=photos&key=', init)
                            .then((response) => response.json())
                            .then(function (data) {
                                let profileImg = document.createElement('img');
                                profileImg.src = data.photos[0].url;
                                photoDiv.appendChild(profileImg);
                            });
                    };
                });
        });
    });
};
