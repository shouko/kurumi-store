const fs = require('fs');
const Queue = require('better-queue');
const { episodeKey } = require('../utils');
const logger = require('./logger');

class Store {
  constructor(name) {
    this.name = name;
    this.path = `./data/${name}.json`;
    let saved;
    try {
      saved = JSON.parse(fs.readFileSync(this.path)).map((row) => [episodeKey(row), row]);
    } catch (e) {
      logger.info(`New file for ${name}.`);
      saved = [];
    }
    this.data = new Map(saved);
    this.saveQueue = new Queue((_, callback) => {
      logger.info(`Saving ${name} to disk.`);
      fs.writeFile(this.path, JSON.stringify(this.values()), (err) => {
        callback(err);
      });
    });
  }

  set(key, val) {
    return this.data.set(key, val);
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  values() {
    return Array.from(this.data.values());
  }

  async save() {
    return new Promise((resolve, reject) => {
      this.saveQueue.push(true, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }
}

module.exports = Store;
