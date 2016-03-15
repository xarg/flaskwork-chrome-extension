export function ms(seconds) {
  if (seconds >= 1) {
    return seconds.toFixed(1) + ' s';
  }
  else if (seconds >= 0.001) {
    return Math.round(seconds * 1000) + ' ms';
  }
  else {
    return (seconds * 1000).toFixed(2) + ' ms';
  }
};