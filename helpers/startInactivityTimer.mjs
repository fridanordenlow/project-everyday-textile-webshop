let timer;

function startInactivityTimer(resetCallback) {
  clearTimeout(timer);
  timer = setTimeout(() => resetCallback(), 15 * 60 * 1000); // Timer for 15 min
  console.log('Timer started.'); // Log when the timer starts
}

export default startInactivityTimer;
