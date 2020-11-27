const Store = require('../services/Store');
const { episodeKey } = require('../utils');

const buckets = {
  reserves: new Map(),
  recording: new Map(),
  recorded: new Store('recorded'),
};

const appends = new Set(['recorded']);

const hasBucket = (bucket) => typeof buckets[bucket] !== 'undefined';

module.exports = {
  get: (bucket, key) => {
    if (!hasBucket(bucket)) return [];
    return buckets[bucket].get(key);
  },

  getAll: (bucket) => {
    if (!hasBucket(bucket)) return [];
    const res = buckets[bucket].values();
    if (Array.isArray(res)) return res;
    return Array.from(res);
  },

  update: (bucket, data) => {
    if (!hasBucket(bucket)) return false;
    if (!Array.isArray(data)) return false;

    const entries = data.map((row) => {
      if (
        typeof row === 'undefined'
       || typeof row.id !== 'string'
       || typeof row.start !== 'number'
      ) return false;
      return [episodeKey(row), row];
    }).filter((x) => x);

    if (appends.has(bucket)) {
      entries.forEach(([key, val]) => {
        if (!buckets[bucket].has(key)) {
          buckets[bucket].set(key, val);
        }
      });
    } else {
      buckets[bucket] = new Map(entries);
    }
    return true;
  },

  save: async (bucket) => {
    if (!hasBucket(bucket)) return false;
    if (buckets[bucket] instanceof Store) {
      return buckets[bucket].save();
    }
    return false;
  },
};
