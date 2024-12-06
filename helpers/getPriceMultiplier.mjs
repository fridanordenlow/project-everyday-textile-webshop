const today = new Date();
const dayOfWeek = today.getDay();
const currentHour = today.getHours();

function getPriceMultiplier() {
  if (
    (dayOfWeek === 5 && currentHour >= 15) || // Friday after 15:00 (5)
    dayOfWeek === 6 || // All Saturday (6)
    dayOfWeek === 0 || // All Sunday (0)
    (dayOfWeek === 1 && currentHour < 3) // Monday before 03:00 (1)
  ) {
    return 1.15;
  }
  return 1;
}

export default getPriceMultiplier;
