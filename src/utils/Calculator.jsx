export function AgeCalculate() {
    const birthYear = 2002;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age;
}