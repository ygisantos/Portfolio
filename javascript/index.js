const awardDictionary = {
    1: {
        name: "ORACLE",
        imageURL: "./images/certificates/ORACLE.jpg"
    },
    2: {
        name: "SYSTEM ADMINISTRATOR",
        imageURL: "./images/certificates/SYSAD.jpg"
    },
    3: {
        name: "CCDT",
        imageURL: "../images/certificates/CCDT.jpg"
    },
    4: {
        name: "DATA STRUCTURE AND ALGORITHM",
        imageURL: "./images/certificates/DASTRAL.jpg"
    },
    5: {
        name: "SAP BUSINESS ONE",
        imageURL: "./images/certificates/SAP.jpg"
    },
    2.1: {
        name: "JAME GAM CHRISTMAS EDITION",
        imageURL: "./images/Awards/JAM_GAME.PNG",
        description: "A 4TH Place Screenshot as a Solo Team for Online Game Jam Competition with over 90 Team Participants"
    },
    2.2: {
        name: "SCORESPACE JAM #17",
        imageURL: "./images/Awards/SCORE_SPACE17.PNG",
        description: "A 10TH Place Screenshot as a Solo Team for Online Game Jam Competition with over 140 Team Participants"
    },
    2.3: {
        name: "CODEFEST (MOBILE APP HACKATHON)",
        imageURL: "./images/Awards/HACKATHON.jpg",
        description: "A First Runner-up Certification for Local Competition held at STI College Balagtas"
    },
    2.4: {
        name: "NATIONAL IT SKILLS COMPETITION (JAVA)",
        imageURL: "./images/Awards/NATIONAL.jpg",
        description: "A Participation Certificate for National Competition of Java Algorithm"
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

        const info = document.getElementById('award-info');
        if(!data.description) info.style.display = 'none';
        else {
            info.style.display = 'block';
            info.innerText = data.description;
        }
    });
});

document.getElementById('award-exit').addEventListener('click', function() {
    const popup = document.getElementById('award-popup');
    
    popup.classList.remove('visible');
    popup.classList.add('invisible');
});
