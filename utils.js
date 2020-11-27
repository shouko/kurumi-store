module.exports = {
  episodeKey: (data) => `${data.id}.${data.start.toString(36)}`,
};
