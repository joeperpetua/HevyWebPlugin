const getAuthToken = () => {
    let cookiesArray = document.cookie.split(';');
    let authTokenKey = "auth-token=";
    let authTokenValue = cookiesArray.find((cookie) => cookie.includes(authTokenKey));
    authTokenValue = authTokenValue ? authTokenValue.split("=")[1] : null;

    return authTokenValue;
};

const fetchAPI = async (authToken, url) => {
 let headers = new Headers({
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "de-DE,de;q=0.9,en-GB;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5,ja-JP;q=0.4,ja;q=0.3,es-US;q=0.2,es;q=0.1,en-US;q=0.1",
        "Auth-Token": authToken,
        "Connection": "keep-alive",
        "Host": "api.hevyapp.com",
        "Origin": "https://hevy.com",
        "Referer": "https://hevy.com/",
        "Sec-Ch-Ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "\"Windows\"",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Api-Key": "shelobs_hevy_web"
    });

    let response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

const handleFollowingModal = (followers) => {
    const profileModal = document.querySelector('.sc-b72d297e-0.sc-57b4fc6c-1.dvaSzI.iAbdhS');
    let followingList = null;
    if (profileModal) {
        followingList = profileModal.parentElement.textContent.includes("Following") ? profileModal.querySelectorAll("p.sc-8f93c0b5-6.iXsLoN") : null;
    }
    if (followingList && followingList.length > 0) {
        followingList.forEach(followingUser => {
            if (followers.find(followerUser => followerUser.username === followingUser.textContent)){
                if (!followingUser.nextElementSibling.nextElementSibling){
                    let p = document.createElement('p');
                    p.className = "sc-8f93c0b5-8 iEJHhf";
                    p.style = "color: #558B2F;"
                    p.textContent = "Follows you";
                    followingUser.parentElement.appendChild(p);
                }
            } else {
                if (!followingUser.nextElementSibling.nextElementSibling){
                    let p = document.createElement('p');
                    p.className = "sc-8f93c0b5-8 iEJHhf";
                    p.style = "color: #E91E63;"
                    p.textContent = "Doesn't follow you";
                    followingUser.parentElement.appendChild(p);
                }
            }
        });
    }
}

const startDOMWatch = (followers) => {
        const observer = new MutationObserver(async mutations => {
            console.info('Body has changed');
            handleFollowingModal(followers);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
};

(async function() {
    'use strict';
    console.info("Active script");

    const authToken = getAuthToken();
    if (!authToken) {return};

    const user = await fetchAPI(authToken, `https://api.hevyapp.com/user/account`);
    const followers = await fetchAPI(authToken, `https://api.hevyapp.com/followers/${user.username}`);
    console.info(followers);
    startDOMWatch(followers);

})();
