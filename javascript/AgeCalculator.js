function calculateAge(inputDate) {
    const birthDate = new Date(inputDate);

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}

document.addEventListener('DOMContentLoaded', function() {
    const userInput = "2002-10-15";
    const age = calculateAge(userInput);
    console.log(`Age: ${age}`);

    const ageTxt = document.getElementById('age').innerText = age;
}, false);

