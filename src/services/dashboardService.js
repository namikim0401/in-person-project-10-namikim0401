import { cachedFetch } from '../utils/asyncPatterns';

export async function fetchDashboardData(city, onSettled = () => {}) {
  const names = ['weather', 'forecast', 'news', 'alerts'];
  const results = await Promise.allSettled(
    names.map(name =>
      cachedFetch(
        `http://localhost:3001/${name}?city=${encodeURIComponent(city)}`,
        { timeout: 3000 }
      )
        .then(data => {
          onSettled(name, data, null);
          return data;
        })
        .catch(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          onSettled(name, null, errorMessage);
          throw error;
        })
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
      errors[name] = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
    }
  });

  return { data, errors };
}
