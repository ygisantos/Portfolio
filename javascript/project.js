const personalBtn = document.getElementById('personalBtn');
const commissionBtn = document.getElementById('commissionBtn');

const personalContainer = document.getElementById('personal');
const commissionContainer = document.getElementById('commission');

personalBtn.addEventListener('click', function() {
    personalBtn.classList.add('disabled');
    commissionBtn.classList.remove('disabled');

    personalContainer.classList.remove('invisible');
    commissionContainer.classList.add('invisible');
});

commissionBtn.addEventListener('click', function() {
    personalBtn.classList.remove('disabled');
    commissionBtn.classList.add('disabled');

    personalContainer.classList.add('invisible');
    commissionContainer.classList.remove('invisible');
});