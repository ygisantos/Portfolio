const awardDictionary = {
    "1": {
        name: "ORACLE",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/ORACLE.jpg"
    },
    "2": {
        name: "SYSTEM ADMINISTRATOR",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/SYSAD.jpg"
    },
    "3": {
        name: "CCDT",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/CCDT.jpg"
    },
    "4": {
        name: "DATA STRUCTURE AND ALGORITHM",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/DASTRAL.jpg"
    },
    "5": {
        name: "SAP BUSINESS ONE (BASIC)",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/SAP.jpg"
    },
    "6": {
        name: "SAP BUSINESS ONE (ADVANCE)",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/certificates/SAP_ADV.jpg"
    },
    "2.0": {
        name: "CODE FEST",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/Awards/CODE_FEST_2020.jpg",
        description: "A 2nd Runner-Up Certification for Local Competition held at STI College Balagtas"
    },
    "2.1": {
        name: "JAME GAM CHRISTMAS EDITION",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/Awards/JAM_GAME.png",
        description: "A 4TH Place Screenshot as a Solo Team for Online Game Jam Competition with over 90 Team Participants"
    },
    "2.2": {
        name: "SCORESPACE JAM #17",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/Awards/SCORE_SPACE17.png",
        description: "A 10TH Place Screenshot as a Solo Team for Online Game Jam Competition with over 140 Team Participants"
    },
    "2.3": {
        name: "CODEFEST (MOBILE APP HACKATHON)",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/Awards/HACKATHON.jpg",
        description: "A First Runner-up Certification for Local Competition held at STI College Balagtas"
    },
    "2.4": {
        name: "NATIONAL IT SKILLS COMPETITION (JAVA)",
        imageURL: "https://raw.githubusercontent.com/ygisantos/Portfolio/main/images/Awards/NATIONAL.jpg",
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

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 } // Adjust threshold as needed
    );
  
    sections.forEach((section) => observer.observe(section));
  });
  