// Replace these sample routes/stops with the official ST route data for your area.
export const routes = [
  { name: '', stops: ['Maliwada', 'Kedgaon', 'Railway Staion', 'Chandni Chawk', 'Khadki', 'Bingaragar'] },
  { name: '', stops: ['Maliwada', 'Wadgaon', 'Wakodi', 'Chandni Chawk','Sarola' ,'Khadki'] },
  { name: '', stops: ['Rahuri', 'Nimblak', 'supa ', 'Kamrgaon', 'Burhanagar'] }
];

export function isValidJourney(start, end) {
  return routes.some(route => {
    const a = route.stops.indexOf(start);
    const b = route.stops.indexOf(end);
    return a !== -1 && b !== -1 && a < b;
  });
}
