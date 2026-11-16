import { cachedFetch } from '../utils/asyncPatterns';

export async function fetchDashboardData(city) {
  const names = ['weather', 'forecast', 'news', 'alerts'];
  const results = await Promise.allSettled(
    names.map(name =>
      cachedFetch(
        `http://localhost:3001/${name}?city=${encodeURIComponent(city)}`,
        { timeout: 3000 }
      )
    )
  );

  const data = {};
  const errors = {};

  results.forEach((result, index) => {
    const name = names[index];

    if (result.status === 'fulfilled') {
      data[name] = result.value;
      errors[name] = null;
    } else {
      errors[name] = result.reason.message;
    }
  });

  return { data, errors };
}
