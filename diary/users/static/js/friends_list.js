const friendshipBtnsGroups = document.getElementsByClassName("friendship-buttons-group")
const searchForPeopleInput = document.querySelector('.search-input');
const peopleList = document.getElementById('people')
const csrftoken = getCookie('csrftoken');

for (const friendshipBtnGroup of friendshipBtnsGroups){
    adjustFriendshipBtnGroup(friendshipBtnGroup);
}

function adjustFriendshipBtnGroup(friendshipBtnGroup){
    const button = friendshipBtnGroup.children[0];
    const status = friendshipBtnGroup.getAttribute('data-friendship-status');

    switch (status){
        case 'pending':
            button.innerText = "Прийняти запит";     
            button.style.backgroundColor = 'limegreen';
            const rejectButton = document.createElement('button');
            rejectButton.className = 'friendship-button prevent-a';
            rejectButton.textContent = 'Відхилити запит';
            rejectButton.style.backgroundColor = 'red'; 
            friendshipBtnGroup.appendChild(rejectButton); 
            button.addEventListener('click',accept_friendship); 
            rejectButton.addEventListener('click',reject_friendship);    
            break;
        case 'accepted':
            button.innerText = "Видалити з близьких";   
            button.style.backgroundColor = 'red';
            button.addEventListener('click',remove_friendship);  
            break;
        case 'sent':
            button.innerText = "Скасувати запит";   
            button.style.backgroundColor = 'silver';  
            button.addEventListener('click',remove_friendship);  
            break;
        case 'no_friendship': 
            friendshipBtnGroup.children[0].innerText = "Надіслати запит";   
            friendshipBtnGroup.children[0].style.backgroundColor = 'blue';
            friendshipBtnGroup.children[0].addEventListener('click',send_friendship_request);     
            break;  
    }
}

function send_friendship_request(event){
    button = event.target;
    toUser = button.parentNode.getAttribute('data-user-id');
    button.removeEventListener('click', send_friendship_request);
    change_friendship_status('send', toUser,button);
}


function accept_friendship(event){
    acceptButton = event.target;
    fromUser = acceptButton.parentNode.getAttribute('data-user-id');
    acceptButton.nextElementSibling.remove();
    acceptButton.removeEventListener('click', accept_friendship);
    change_friendship_status('accept',fromUser,acceptButton);
}

function remove_friendship(event){
    button = event.target;
    user = button.parentNode.getAttribute('data-user-id');
    button.removeEventListener('click', remove_friendship);
    change_friendship_status('remove',user,button);
}

function reject_friendship(event){
    rejectButton = event.target;
    user = rejectButton.parentNode.getAttribute('data-user-id');
    rejectButton.previousElementSibling.remove();
    rejectButton.removeEventListener('click', reject_friendship);
    change_friendship_status('remove',user,rejectButton);    
}


function change_friendship_status(action,user,button){
    fetch(`${window.location.origin}/users/friendship/${action}/${user}`,{
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        button.parentNode.setAttribute('data-friendship-status', data['friendshipStatus']);
        adjustFriendshipBtnGroup(button.parentNode);
    })
    .catch(error => {
        console.error(error);
    });
}


searchForPeopleInput.addEventListener('input', (event) =>{
    const query = event.target.value;
    let alternative = ''; 
    const currentUrl = window.location.href;
    if (currentUrl.endsWith('/friends/')) {
        alternative='friends';
    } else {
        alternative='friend-requests';
    }
    fetch(`${window.location.origin}/users/search/?q=${query}&alt=${alternative}`,{
        method: 'GET',
        headers: {
            'X-CSRFToken': csrftoken
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        peopleList.innerHTML = '';
            data.people.forEach(person=>{
            const personPhoto = person.user.mainPhoto ? person.user.mainPhoto : "/static/images/no-profile-photo.png";
            const personElem = document.createElement('li');
            personElem.classList.add('person');
            personElem.innerHTML = `<a class="user-badge prevent-a" href="${window.location.origin}/profile/${person.user.username}">
            <img class="user-badge-photo" alt="👤" src="${personPhoto}">
                <div class="user-badge-names">
                    <span class="user-badge-name">${person.user.firstName} ${person.user.lastName}</span>
                    <span class="user-badge-username">@${person.user.username}</span>
                </div>
            </a>`;
            
            if (person.user.username !== currentUser){
                const buttonsGroup = document.createElement("div");
                buttonsGroup.classList.add("friendship-buttons-group");
                buttonsGroup.setAttribute('data-user-id',person.user.id);
                buttonsGroup.setAttribute('data-friendship-status',person.status);
                buttonsGroup.innerHTML = `<button class="friendship-button prevent-a"></button>`;
                personElem.appendChild(buttonsGroup);
            }
            peopleList.appendChild(personElem);
        });
        buttonsGroups = document.getElementsByClassName("friendship-buttons-group")
        for (const friendshipBtnGroup of buttonsGroups){
            adjustFriendshipBtnGroup(friendshipBtnGroup);
        }
    })
    .catch(error => {
        console.error(error);
    });
});


