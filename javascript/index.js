const awardDictionary = {
    1: {
        name: "ORACLE",
        imageURL: "../images/certificates/ORACLE.jpg"
    },
    2: {
        name: "SYSTEM ADMINISTRATOR",
        imageURL: "../images/certificates/SYSAD.jpg"
    },
    3: {
        name: "CCDT",
        imageURL: "../images/certificates/CCDT.jpg"
    },
    4: {
        name: "DATA STRUCTURE AND ALGORITHM",
        imageURL: "../images/certificates/DASTRAL.jpg"
    },
    5: {
        name: "SAP BUSINESS ONE",
        imageURL: "../images/certificates/SAP.jpg"
    }
}

document.querySelectorAll('.award-btn').forEach(button => {
    button.addEventListener('click', function () {
        const popup = document.getElementById('award-popup');
        
        popup.classList.add('visible');
        popup.classList.remove('invisible');  

        const data = awardDictionary[button.value];
        document.getElementById('award-title').innerText = data.name;
        document.getElementById('award-img').src = data.imageURL;
    });
});

document.getElementById('award-exit').addEventListener('click', function() {
    const popup = document.getElementById('award-popup');
    
    popup.classList.remove('visible');
    popup.classList.add('invisible');
});
