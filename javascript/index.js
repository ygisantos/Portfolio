const awardDictionary = {
    1: {
        name: "testing name",
        imageURL: "/projects/bhasa/images/tutorial.png",
        description: "testing desc"
    },
    2: {
        name: "testing name123",
        imageURL: "/projects/bhasa/images/tutorial.png123",
        description: "testi123ng desc"
    }
}

document.querySelectorAll('.award-btn').forEach(button => {
    button.addEventListener('click', function () {
        const popup = document.getElementById('award-popup');
        
        popup.classList.add('visible');
        popup.classList.remove('invisible');  

        const data = awardDictionary[button.value];
        document.getElementById('award-title').innerText = data.name;
        document.getElementById('award-img').src = window.location.origin + data.imageURL;
        document.getElementById('award-info').innerText = data.description;
    });
});

document.getElementById('award-exit').addEventListener('click', function() {
    const popup = document.getElementById('award-popup');
    
    popup.classList.remove('visible');
    popup.classList.add('invisible');
});
