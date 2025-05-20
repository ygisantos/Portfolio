// Simple test for priority sorting logic
console.log('Testing priority sorting logic...');

// Mock getPriorityNum function from Projects.jsx
const getPriorityNum = (work) => {
  if (!work?.priority) return Infinity;
  const num = parseInt(work.priority);
  return isNaN(num) ? Infinity : num;
};

// Sample data with various priority scenarios
const testWorks = [
  { id: 1, title: "Project A", priority: "3", year: "2023" },
  { id: 2, title: "Project B", priority: "1", year: "2020" },
  { id: 3, title: "Project C", priority: null, year: "2024" },
  { id: 4, title: "Project D", priority: "2", year: "2022" },
  { id: 5, title: "Project E", priority: "invalid", year: "2021" },
  { id: 6, title: "Project F", priority: "", year: "2023" },
  { id: 7, title: "Project G", priority: "1", year: "2023" }, // Same priority as B but different year
];

// Test priority-first sorting
const prioritySortedWorks = [...testWorks].sort((a, b) => {
  const priorityA = getPriorityNum(a);
  const priorityB = getPriorityNum(b);
  
  // If priorities are different, sort by priority
  if (priorityA !== priorityB) {
    return priorityA - priorityB; // Ascending order (1,2,3...)
  }
  
  // If priorities are the same (or both missing), sort by year
  return parseInt(b.year) - parseInt(a.year);
});

console.log('Original works:', testWorks.map(w => `${w.title} (Priority: ${w.priority}, Year: ${w.year})`));
console.log('Sorted works:', prioritySortedWorks.map(w => `${w.title} (Priority: ${w.priority}, Year: ${w.year})`));

// Expected output should be:
// B (Priority: 1) and G (Priority: 1) first, with G before B because of year
// D (Priority: 2) next
// A (Priority: 3) next
// Then C (no priority), E (invalid priority), and F (empty priority)
