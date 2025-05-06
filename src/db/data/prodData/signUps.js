const signUps = [];
const totalSignUps = 50;
const userIds = Array.from({ length: 20 }, (_, i) => i + 1).filter(id => id > 2); // skip owner/admin
const eventIds = Array.from({ length: 15 }, (_, i) => i + 1);

const usedCombinations = new Set();

while (signUps.length < totalSignUps) {
  const user_id = userIds[Math.floor(Math.random() * userIds.length)];
  const event_id = eventIds[Math.floor(Math.random() * eventIds.length)];
  const key = `${user_id}-${event_id}`;

  if (!usedCombinations.has(key)) {
    signUps.push({
      user_id,
      event_id,
      added_to_calendar: false,
    });
    usedCombinations.add(key);
  }
}

module.exports = signUps;
