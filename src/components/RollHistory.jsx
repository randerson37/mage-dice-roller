

export default function RollHistory({roll})
{
  const {difficulty, threshold, rollNumber, rolls, specialty} = roll;
  console.log(`RollHistory difficulty: ${difficulty} threshold: ${threshold} roll: ${JSON.stringify(rolls)}`);
  if (!roll) {
    roll = {rollNumber: -1, rolls: [], difficulty: 6, threshold: 1}
  }
  let successes = 0;
  let ones = 0;
  let crits = 0;
  for(const r of rolls)
  {
    if (r >= difficulty) {
      successes += 1;
    }
    if (r === 1) {
      ones += 1;
    }
    if (r === 10) {
      successes += 1; // 10s are crits and double.
      crits += 1;
    }
    if (specialty && r === 9)
    {
      successes += 1;
      crits += 1;
    }
  }
  return (
    <span key={`roll-${rollNumber}`}>Roll {rollNumber}: {JSON.stringify(rolls)} Difficulty: {difficulty} = Successes: {Math.max(successes, 0)} Ones: {ones} Threshold: {threshold} : {((successes - ones) >= threshold) ? "Success!" : ((successes - ones) < 0) ? "Botched!" : "Failure!" }</span>
  )
}