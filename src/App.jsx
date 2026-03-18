import { useState, useEffect, useRef } from 'react'
import DiceBox from "@3d-dice/dice-box";
import NumberSpinner from './components/NumberSpinner';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./App.css";
import Box from '@mui/material/Box';
import RollHistory from './components/RollHistory';

/*  --------------- DICE BOX -------------- */
// Note the dice-box assets in the public folder.
// Those files are all necessary for the web workers to function properly
// create new DiceBox class
const Dice = new DiceBox({
    assetPath: "/mage-dice-roller/assets/",
    throwForce: 8,
    themeColor: "#a21e15",
    offscreen: true
  }
);

function App() {
  const [rollResult, setRollResult] = useState();
  const [difficulty, setDifficulty] = useState(6);
  const [threshold, setThreshold] = useState(1);
  const [dicepool, setDicePool] = useState(3);
  const [rollHistory, setRollHistory] = useState([]);
  const [specialty, setSpecialty] = useState(false);

  // create a ref so the Dice Box doesn't try to reinitialize every time the App rerenders.
  const initialized = useRef(false)

  useEffect(()=> {
    if(!initialized.current){
      initialized.current = true
      Dice.init()
    }
  },[])

  // set up the callback for when the dice are finished rolling - https://fantasticdice.games/docs/usage/callbacks
  Dice.onRollComplete = (results) => {
    console.log('results', results)
    var rolls = results[0].rolls.map(r => r.value);
    let localRollHistory = rollHistory;
    const rollNumber = rollHistory.length + 1;
    localRollHistory.unshift({rollNumber, rolls, difficulty, threshold, specialty});
    setRollHistory(localRollHistory);
    const rollString = JSON.stringify(rolls);
    setRollResult(rollString)
  }

  const handleRoll = (e) => {
    e.preventDefault();
    console.log(`handleRoll: ${dicepool}`);
    Dice.roll(`${dicepool}d10`)
  }

  return (
    <div className="App">
      <h1>Mage Dice Roller</h1>
      <Stack spacing={2} direction="column" >
        <FormControlLabel sx={{justifyContent:"center"}} id="specialty-checkbox" control={<Checkbox checked={specialty} onChange={(e) => setSpecialty(e.target.checked)} />} label="Specialty (treat 9s as crits)" />
        <Stack sx={{justifyContent:"center"}} spacing={2} direction="row">
          <NumberSpinner id="difficulty-button" label="Difficulty" min={2} max={10} value={difficulty} onValueChange={setDifficulty} />
          <NumberSpinner id="threshold-button" label="Threshold" min={1} max={50} value={threshold} onValueChange={setThreshold} />
          <NumberSpinner id="dicepool-button" label="Dice Pool" min={1} max={20} value={dicepool} onValueChange={setDicePool} />
        </Stack>
        <Stack sx={{justifyContent:"center"}} spacing={2} direction="row">
          <Button variant='contained' onClick={handleRoll}>Roll</Button>
          <Button variant='contained' onClick={(e) => Dice.clear()}>Clear</Button>
        </Stack>
        <span id='result'>Result: {rollResult}</span>
        <Box component="section" sx={{ p: 2, border: 1, borderColor: 'primary.main', margin: 5 }}>
          <Stack spacing={1}>
          {rollHistory.map((r,idx) => (
            <RollHistory key={`rollhistory-${idx}`} roll={r}/>
          ))}
          </Stack>
        </Box>
      </Stack>
    </div>
  )
}

export default App
