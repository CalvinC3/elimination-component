import {useEffect, useState} from 'react'
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';




function App() {
  
  // all logical stuff
  const [totalTiles, setTotalTiles] = useState(0)
  const [inputTile, setInputTile] = useState('')
  const [tiles, setTiles] = useState({
    hash: null,
    data: []
  })
  const [delayInterval, setDelayInterval] = useState(300)

  // useEffect(() => { 
  //   console.log('debug: Tiles value changed!')

  // }, [tiles])

  const statuses = {
    0: 'ACTIVE',
    1: 'ELIMINATED',
    2: 'WINNER'
  }

  // styles
  const StyledTileComponent = styled.div`

    height: 60px;
    width: 60px;
    background: white;
    color: black;
    border-radius: 20px;
    line-height: 60px;
    margin: 3px;
    @keyframes rollout {
      0% { transform: translateY(-100px); }
      100% { transform: none; }
    }
    
    .roll-out {
      animation: rollout 0.4s;
    }
    
  `

  const TileComponent = ({tileId, status}) => {

    return (
      <StyledTileComponent className={status.toLowerCase()} id={tileId} key={tileId}>
        {tileId}
      </StyledTileComponent>
    )
  }

  

  const generateTiles = () => {
    const tileMap = []
    // alert(`Yes! time to generate tiles! We will generate ${inputTile} tiles on the page`)
    for (let index = 0; index < parseInt(inputTile); index++) {
      tileMap.push({
        id: index+1,
        status: statuses[0]
      })
    }
    setTiles({hash: uuidv4(), data: tileMap})
    setTotalTiles(inputTile)
  }

  const delay = async (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms))

  const runElimination = async() => {
    if (tiles.length <= 0) {
      alert('no tiles generated yet')
      return
    }
    
    const newTileInstance = tiles.data.slice()


    for (let index = 0; index < parseInt(totalTiles); index++) {
      const availableTiles = newTileInstance.filter(tileInstance => tileInstance.status !== statuses[1])
      
      if(availableTiles.length === 1) {
        newTileInstance[availableTiles[0].id-1].status = statuses[2]
        setTiles({hash: uuidv4(), data: newTileInstance})
        return
      }

      const randomEliminated = availableTiles[Math.floor(Math.random() * availableTiles.length)];
      // console.log('debug test', {
      //   'new tile instance': newTileInstance,
      //   'available tiles': availableTiles,
      //   'eliminated': randomEliminated,
      //   'attempt': newTileInstance[randomEliminated.id-1]
      // })

      newTileInstance[randomEliminated.id-1].status = statuses[1]
      setTiles({hash: uuidv4(), data: newTileInstance})

      await delay(delayInterval)

    }
  }

  // JSX or the html - rendering
  return (
    <div className="App"> 
      <header className="App-header">
        <p>Proof of Concept - Elimination Animation</p>
        <p>current interval speed: {delayInterval}</p>
        <div>
          <input type='number' onChange={(e) => setInputTile(e.target.value)}></input>
          <button onClick={() => generateTiles() }>Generate Tiles!</button>
        </div>
        <div>
          <input name='speed' placeholder='animation speed in ms' type='number' onChange={(e) => setDelayInterval(e.target.value)} val={delayInterval} />
        </div>

        
      </header>
      <div style={{background: 'black'}}>
          <div className='tile-wrapper'
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}
          >
            {tiles.data.map((tile) => {console.log(tile)})}
            {tiles.data.map((tile) => (
              <TileComponent
              tileId={tile.id} 
              status={tile.status} />
            ))}
          </div>
      </div>
      <div>
        <button 
          style={{width: '100vw', height: '10vh', background: '#5ebf4c', color: 'white'}}
          onClick={() => runElimination()}
        >
          <span style={{fontSize: '2em', fontWeight: '600'}}>Start Elimination</span>
        </button>
      </div>
    </div>
  );
}

export default App;
