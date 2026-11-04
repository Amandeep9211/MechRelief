// Paisay ko "Rs 1,500" format mein dikhata hai.
export const money = (n) => 'Rs ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
