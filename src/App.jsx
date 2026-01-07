import { useState, useEffect, useRef } from 'react'
import { THEMES, THEME_ICONS, THEME_STRINGS, getRandomItems, getSVGPath, FEELING_ICONS, EVENT_ICONS } from './data/themes'


// Player Input Component with auto-focus
function PlayerInput({ index, value, onChange, onKeyDown, placeholder, isFocused, onFocus }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full p-4 border-2 border-gray-600 bg-gray-800 text-white rounded-xl focus:border-purple-500 focus:outline-none text-lg transition-colors placeholder-gray-400"
    />
  )
}

const TOTAL_ROUNDS = 4
const MAX_PLAYERS = 20
const MIN_PLAYERS = 4

function App() {
  const [screen, setScreen] = useState('PLAYER_ENTRY')
  const [players, setPlayers] = useState(['', '', '', ''])
  const [playerOrder, setPlayerOrder] = useState([])
  const [currentRound, setCurrentRound] = useState(0)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [selectedIcons, setSelectedIcons] = useState([])
  const [selectedString, setSelectedString] = useState('')
  const [isHoldingPhrase, setIsHoldingPhrase] = useState(false)
  const [draggedIconIndex, setDraggedIconIndex] = useState(null)
  const [scores, setScores] = useState([0, 0, 0, 0])
  const [roundScores, setRoundScores] = useState([0, 0, 0, 0]) // Subtotals for current round
  const [turnStartScores, setTurnStartScores] = useState([0, 0, 0, 0]) // Scores at start of current turn
  const [scoreHistory, setScoreHistory] = useState([]) // Array of {round, turn, scores: [player1, player2, ...]}
  const [focusedInputIndex, setFocusedInputIndex] = useState(0)

  // Get current storyteller
  const activePlayers = players.filter(p => p && p.trim().length > 0)
  const currentStorytellerIndex = playerOrder[currentTurn] ?? null
  const currentStoryteller = currentStorytellerIndex !== null && currentStorytellerIndex < players.length 
    ? players[currentStorytellerIndex] 
    : ''

  // Validate players - need at least MIN_PLAYERS
  const validPlayers = players.filter(p => p && p.trim().length > 0)
  const allPlayersValid = validPlayers.length >= MIN_PLAYERS
  
  // Check for duplicate player names (case-insensitive)
  const playerNamesLower = validPlayers.map(p => p.trim().toLowerCase())
  const hasDuplicates = new Set(playerNamesLower).size !== playerNamesLower.length
  const allPlayersUnique = !hasDuplicates

  // Start game
  const handleStart = () => {
    if (!allPlayersValid) {
      alert(`Please enter at least ${MIN_PLAYERS} player names`)
      return
    }
    
    if (!allPlayersUnique) {
      alert('All players must have unique names. Please change any duplicate names.')
      return
    }

    // Filter out empty players and update players state
    const activePlayers = players.filter(p => p && p.trim().length > 0)
    setPlayers(activePlayers) // Remove empty players from state
    
    // Randomize player order
    const order = activePlayers.map((_, i) => i).sort(() => Math.random() - 0.5)
    setPlayerOrder(order)
    setCurrentRound(1)
    setCurrentTurn(0)
    setScores(new Array(activePlayers.length).fill(0))
    setRoundScores(new Array(activePlayers.length).fill(0))
    setTurnStartScores(new Array(activePlayers.length).fill(0))
    setScoreHistory([])
    setScreen('THEME_SELECT')
  }

  // Select theme
  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme)
    
    // Store scores at start of turn
    setTurnStartScores([...scores])
    
    // Choose 3 theme icons, 1 feeling icon, and 1 event icon (randomly selected each turn)
    const themeIconList = getRandomItems(THEME_ICONS[theme.id], 3)
    const feelingIconList = getRandomItems(FEELING_ICONS, 1)
    const eventIconList = getRandomItems(EVENT_ICONS, 1)
    const icons = [
      ...themeIconList.map(icon => ({ icon, theme: theme.id })),
      ...feelingIconList.map(icon => ({ icon, theme: 'feeling' })),
      ...eventIconList.map(icon => ({ icon, theme: 'event' }))
    ]
    // shuffle
    const shuffledIcons = getRandomItems(icons, icons.length)
    setSelectedIcons(shuffledIcons)
    
    // Get 1 random string from theme
    const strings = getRandomItems(THEME_STRINGS[theme.id], 1)
    setSelectedString(strings[0] || '')
    
    // Reset hold state
    setIsHoldingPhrase(false)
    
    setScreen('GAME_DISPLAY')
  }

  // Continue from game display to points screen
  const handleContinueFromGame = () => {
    setScreen('POINTS_ADJUST')
  }

  // Update round scores (subtotals)
  const handleScoreChange = (playerIndex, delta) => {
    setRoundScores(prev => {
      const newScores = [...prev]
      newScores[playerIndex] = Math.max(0, newScores[playerIndex] + delta)
      return newScores
    })
  }

  // Continue from points to scoreboard
  const handleContinueFromPoints = () => {
    // Add round scores to total scores (for final total)
    const activePlayers = players.filter(p => p && p.trim().length > 0)
    const newScores = [...scores]
    roundScores.forEach((roundScore, index) => {
      if (index < newScores.length) {
        newScores[index] += roundScore
      }
    })
    setScores(newScores)
    
    // Save to history - store the round scores (points for this turn only, not cumulative)
    // Calculate turn number within round: turn = (currentTurn % activePlayers.length) + 1
    const turnInRound = (currentTurn % activePlayers.length) + 1
    const turnScores = roundScores.slice(0, activePlayers.length) // Points for this turn only
    setScoreHistory(prev => [...prev, {
      round: currentRound,
      turn: turnInRound,
      scores: [...turnScores] // Store points for this turn, not cumulative
    }])
    
    setScreen('SCOREBOARD')
  }

  // Continue from scoreboard to next turn
  const handleContinueFromScoreboard = () => {
    // Reset round scores for next turn
    const activePlayers = players.filter(p => p && p.trim().length > 0)
    setRoundScores(new Array(activePlayers.length).fill(0))
    
    // Calculate if we've completed the round (all players have had a turn)
    const nextTurn = currentTurn + 1
    const turnsInRound = nextTurn % activePlayers.length
    
    // If we've completed all turns in the round, move to next round
    if (turnsInRound === 0 && nextTurn > 0) {
      // Completed a round, check if we've completed all rounds
      const completedRounds = Math.floor(nextTurn / activePlayers.length)
      if (completedRounds >= TOTAL_ROUNDS) {
        // Game complete
        setScreen('SCOREBOARD')
        return
      }
      // Move to next round
      setCurrentRound(prev => prev + 1)
    }
    
    // Move to next turn
    setCurrentTurn(nextTurn)
    setSelectedTheme(null)
    setSelectedIcons([])
    setSelectedString('')
    setScreen('THEME_SELECT')
  }

  // Reset game
  const handleReset = () => {
    setPlayers(['', '', '', ''])
    setPlayerOrder([])
    setCurrentRound(1)
    setCurrentTurn(0)
    setSelectedTheme(null)
    setSelectedIcons([])
    setSelectedString('')
    setScores([0, 0, 0, 0])
    setRoundScores([0, 0, 0, 0])
    setTurnStartScores([0, 0, 0, 0])
    setScoreHistory([])
    setFocusedInputIndex(0)
    setScreen('PLAYER_ENTRY')
  }

  // Handle player input with Enter key
  const handlePlayerKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedValue = players[index].trim()
      if (trimmedValue) {
        // Move to next input or add new one if not at max
        if (index < players.length - 1) {
          setFocusedInputIndex(index + 1)
        } else if (players.length < MAX_PLAYERS) {
          // Add new input field
          setPlayers([...players, ''])
          setFocusedInputIndex(players.length)
        }
      }
    }
  }

  // Add new player input field
  const addPlayerField = () => {
    const validPlayers = players.filter(p => p && p.trim().length > 0)
    if (validPlayers.length < MAX_PLAYERS) {
      // Add a new empty player field
      setPlayers([...players, ''])
      setFocusedInputIndex(players.length)
    }
  }

  // Delete a player field
  const deletePlayerField = (index) => {
    const newPlayers = [...players]
    newPlayers.splice(index, 1)
    setPlayers(newPlayers)
    // Adjust focus if needed
    if (focusedInputIndex >= newPlayers.length) {
      setFocusedInputIndex(Math.max(0, newPlayers.length - 1))
    }
  }

  // Check if all existing fields are filled (for Add Player button)
  const allFieldsFilled = players.every(p => p && p.trim().length > 0)


  // Screen 1: Player Entry
  if (screen === 'PLAYER_ENTRY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-2xl bg-gray-900 rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">Phraseotomy</h1>
          <h2 className="text-2xl font-semibold mb-2 text-gray-200">
            Enter Player Names
          </h2>
          <div className="space-y-4">
            {players.map((player, index) => {
              // Only show if it has content or is one of the first MIN_PLAYERS
              // Also show if it's the last item (to allow adding more)
              const hasContent = player.trim().length > 0
              const isFirstMin = index < MIN_PLAYERS
              const isLastItem = index === players.length - 1
              const canDelete = players.length > MIN_PLAYERS && hasContent
              
              if (!hasContent && !isFirstMin && !isLastItem) {
                return null
              }
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <PlayerInput
                      index={index}
                      value={player}
                      onChange={(value) => {
                        const newPlayers = [...players]
                        newPlayers[index] = value
                        setPlayers(newPlayers)
                      }}
                      onKeyDown={(e) => handlePlayerKeyDown(e, index)}
                      placeholder={`Player ${index + 1}`}
                      isFocused={index === focusedInputIndex}
                      onFocus={() => setFocusedInputIndex(index)}
                    />
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => deletePlayerField(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                      title="Delete player"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
            {players.filter(p => p && p.trim().length > 0).length < MAX_PLAYERS && (
              <button
                onClick={addPlayerField}
                disabled={!allFieldsFilled}
                className={`w-full p-3 border-2 border-dashed rounded-xl transition-colors ${
                  allFieldsFilled
                    ? 'border-gray-600 text-gray-400 hover:border-purple-400 hover:text-purple-400'
                    : 'border-gray-700 text-gray-600 cursor-not-allowed'
                }`}
              >
                + Add Player ({players.filter(p => p && p.trim().length > 0).length}/{MAX_PLAYERS})
              </button>
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleStart}
              disabled={!allPlayersValid || !allPlayersUnique}
              className={`px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all ${
                allPlayersValid && allPlayersUnique
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              START GAME
            </button>
            {!allPlayersUnique && (
              <p className="text-red-400 text-sm mt-2 text-right">⚠️ All players must have unique names</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Helper function to get tile image path
  const getThemeTilePath = (theme) => {
    return `/themes/${theme.folder} tile.png`
  }

  // Screen 2: Theme Selection
  if (screen === 'THEME_SELECT') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-4xl bg-black rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentStoryteller}'s Turn
            </h2>
            <p className="text-lg text-gray-300">
              Round {currentRound} of {TOTAL_ROUNDS} • Turn {(currentTurn % (players.filter(p => p && p.trim().length > 0).length)) + 1} of {players.filter(p => p && p.trim().length > 0).length} in this round
            </p>
            <p className="text-xl font-semibold text-purple-400 mt-4">Choose a Theme</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className="relative aspect-square rounded-2xl overflow-hidden hover:scale-105 transition-transform hover:shadow-2xl border-2 border-transparent hover:border-purple-500"
              >
                <img
                  src={getThemeTilePath(theme)}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if tile doesn't load
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold text-lg">${theme.name}</div>`
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Handle icon drag and drop
  const handleDragStart = (e, index) => {
    setDraggedIconIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIconIndex === null || draggedIconIndex === dropIndex) {
      setDraggedIconIndex(null)
      return
    }

    const newIcons = [...selectedIcons]
    const draggedIcon = newIcons[draggedIconIndex]
    newIcons.splice(draggedIconIndex, 1)
    newIcons.splice(dropIndex, 0, draggedIcon)
    setSelectedIcons(newIcons)
    setDraggedIconIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIconIndex(null)
  }

  // Screen 3: Game Display (5 icons + 1 string)
  if (screen === 'GAME_DISPLAY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-5xl bg-gray-900 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStoryteller} - {selectedTheme?.name}
            </h2>
          </div>
          
          <p className="text-center text-lg text-gray-200 mb-2">Use these icons to tell a 60s story</p>
          <p className="text-center text-sm text-gray-400 mb-4">drag and drop to re-order the icons</p>
          
          {/* 5 SVG Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
            {selectedIcons.map((item, index) => {
              return (
                <div
                  key={item.icon+'-'+index}
                  className="flex flex-col"
                >
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`aspect-square border-2 rounded-xl p-1 sm:p-4 flex items-center justify-center transition-all cursor-move relative overflow-hidden ${
                      draggedIconIndex === index 
                        ? 'opacity-50 border-purple-500 bg-white' 
                        : draggedIconIndex !== null && draggedIconIndex !== index
                        ? 'border-purple-600 bg-white'
                        : 'border-gray-600 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={getSVGPath(item.theme, item.icon)}
                      alt={`Icon ${index + 1}`}
                      className="pointer-events-none select-none w-[90%] h-[90%] sm:w-[70%] sm:h-[70%] max-w-[200px] max-h-[200px] sm:max-w-[120px] sm:max-h-[120px]"
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'center',
                      }}
                      draggable={false}
                      onError={(e) => {
                        // Fallback if image doesn't load
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<div class="text-gray-400 text-sm flex items-center justify-center h-full">Icon ${index + 1}</div>`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Secret wisp text */}
          <p className="text-center text-lg text-gray-300 mb-4">Don't forget to also insert the secret wisp:</p>

          {/* String/Phrase - only visible when holding */}
          <div 
            className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6 mb-8 min-h-[80px] flex items-center justify-center border-2 border-purple-700"
            onMouseDown={() => setIsHoldingPhrase(true)}
            onMouseUp={() => setIsHoldingPhrase(false)}
            onMouseLeave={() => setIsHoldingPhrase(false)}
            onTouchStart={() => setIsHoldingPhrase(true)}
            onTouchEnd={() => setIsHoldingPhrase(false)}
          >
            {isHoldingPhrase ? (
              <p className="text-2xl font-semibold text-center text-white">
                {selectedString}
              </p>
            ) : (
              <p className="text-lg text-center text-gray-400 italic">
                Click and hold to reveal
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinueFromGame}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Screen 4: Points Add/Remove
  if (screen === 'POINTS_ADJUST') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-3xl bg-gray-900 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Adjust Points</h2>
            <p className="text-gray-300">The Storyteller receives 1 point for every player deceived</p>
          </div>
          
          <div className="space-y-4">
            {players.map((player, index) => {
              const startingScore = turnStartScores[index] || 0
              const currentTotal = startingScore + roundScores[index]
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-2 border-gray-700 rounded-xl bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-white">{player}</div>
                    <div className="text-sm text-gray-400">
                      Started with: {startingScore} points
                    </div>
                    {currentStorytellerIndex === index && (
                      <span className="text-sm text-purple-400 font-medium">(Storyteller)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleScoreChange(index, -1)}
                      className="w-10 h-10 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {roundScores[index]}
                      </div>
                      <div className="text-xs text-gray-400">
                        Total: {currentTotal}
                      </div>
                    </div>
                    <button
                      onClick={() => handleScoreChange(index, 1)}
                      className="w-10 h-10 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinueFromPoints}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Screen 5: Scoreboard
  if (screen === 'SCOREBOARD') {
    const activePlayers = players.filter(p => p && p.trim().length > 0)
    const turnsPerRound = activePlayers.length
    const currentTurnInRound = (currentTurn % turnsPerRound) + 1
    const totalTurns = TOTAL_ROUNDS * turnsPerRound
    const completedTurns = currentTurn + 1
    const isGameComplete = completedTurns >= totalTurns

    // Group score history by round
    const roundsData = []
    for (let round = 1; round <= TOTAL_ROUNDS; round++) {
      const roundTurns = scoreHistory.filter(h => h.round === round)
      if (roundTurns.length > 0) {
        roundsData.push({
          round,
          turns: roundTurns.sort((a, b) => a.turn - b.turn)
        })
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Scoreboard</h2>
            {isGameComplete ? (
              <p className="text-xl text-purple-400 font-semibold">Game Complete!</p>
            ) : (
              <p className="text-gray-300">
                Round {currentRound} of {TOTAL_ROUNDS} • Turn {currentTurnInRound} of {turnsPerRound} in this round
              </p>
            )}
          </div>

          {/* Score History Table */}
          {roundsData.length > 0 && (
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-white">Player</th>
                      {roundsData.map((roundData) => (
                        <th
                          key={roundData.round}
                          colSpan={roundData.turns.length}
                          className="border border-gray-600 px-4 py-2 text-center font-semibold bg-purple-900 text-white"
                        >
                          Round {roundData.round}
                        </th>
                      ))}
                      <th className="border border-gray-600 px-4 py-2 text-center font-semibold bg-blue-900 text-white">
                        Total
                      </th>
                    </tr>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-600 px-4 py-2 text-left text-sm text-gray-400"></th>
                      {roundsData.map((roundData) =>
                        roundData.turns.map((turn, idx) => (
                          <th
                            key={`${roundData.round}-${idx}`}
                            className="border border-gray-600 px-2 py-1 text-xs text-gray-400"
                          >
                            T{turn.turn}
                          </th>
                        ))
                      )}
                      <th className="border border-gray-600 px-4 py-2 text-center text-sm text-gray-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePlayers.map((player, playerIndex) => (
                      <tr key={playerIndex} className="hover:bg-gray-800">
                        <td className="border border-gray-600 px-4 py-2 font-medium text-white">{player}</td>
                        {roundsData.map((roundData) =>
                          roundData.turns.map((turn, turnIdx) => {
                            // Show points for this turn only (not cumulative)
                            const turnPoints = turn.scores[playerIndex] || 0
                            return (
                              <td
                                key={`${roundData.round}-${turnIdx}-${playerIndex}`}
                                className="border border-gray-600 px-2 py-2 text-center text-white"
                              >
                                <div className="font-semibold">{turnPoints}</div>
                              </td>
                            )
                          })
                        )}
                        <td className="border border-gray-600 px-4 py-2 text-center font-bold text-lg text-white">
                          {scores[playerIndex] || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {isGameComplete ? (
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                NEW GAME
              </button>
            ) : (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  RESET
                </button>
                <button
                  onClick={handleContinueFromScoreboard}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                  CONTINUE
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App

