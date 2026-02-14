/**
 * Persist Phraseotomy game state to localStorage so players can resume after refresh/close.
 */

const STORAGE_KEY = 'phraseotomy-game-state'
const VERSION = 1

/**
 * @param {object} state - Current game state (plain data only)
 * @returns {void}
 */
export function saveGameState(state) {
  try {
    if (typeof localStorage === 'undefined') return

    const payload = {
      version: VERSION,
      players: state.players || [],
      playerOrder: state.playerOrder || [],
      screen: state.screen || 'PLAYER_ENTRY',
      currentRound: state.currentRound ?? 0,
      currentTurn: state.currentTurn ?? 0,
      selectedThemeId: state.selectedTheme ? state.selectedTheme.id : null,
      selectedIcons: state.selectedIcons || [],
      selectedString: state.selectedString || '',
      scores: state.scores || [],
      roundScores: state.roundScores || [],
      turnStartScores: state.turnStartScores || [],
      scoreHistory: state.scoreHistory || [],
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('Phraseotomy: Could not save game state (storage full)')
    } else {
      console.warn('Phraseotomy: Could not save game state', e)
    }
  }
}

/**
 * @param {Array<{id: string, name: string, folder: string}>} themes - THEMES array to resolve selectedTheme
 * @returns {object | null} Restored state (with selectedTheme object) or null if none/invalid
 */
export function loadGameState(themes = []) {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (!data || data.version !== VERSION) return null

    const theme = data.selectedThemeId && themes.length
      ? themes.find((t) => t.id === data.selectedThemeId) || null
      : null

    return {
      players: Array.isArray(data.players) ? data.players : [],
      playerOrder: Array.isArray(data.playerOrder) ? data.playerOrder : [],
      screen: typeof data.screen === 'string' ? data.screen : 'PLAYER_ENTRY',
      currentRound: typeof data.currentRound === 'number' ? data.currentRound : 0,
      currentTurn: typeof data.currentTurn === 'number' ? data.currentTurn : 0,
      selectedTheme: theme,
      selectedIcons: Array.isArray(data.selectedIcons) ? data.selectedIcons : [],
      selectedString: typeof data.selectedString === 'string' ? data.selectedString : '',
      scores: Array.isArray(data.scores) ? data.scores : [],
      roundScores: Array.isArray(data.roundScores) ? data.roundScores : [],
      turnStartScores: Array.isArray(data.turnStartScores) ? data.turnStartScores : [],
      scoreHistory: Array.isArray(data.scoreHistory) ? data.scoreHistory : [],
    }
  } catch (e) {
    console.warn('Phraseotomy: Could not load game state', e)
    return null
  }
}

/**
 * Quick check whether localStorage contains a valid saved game (same version).
 * Use this to enable/disable "Resume Game" without fully parsing state.
 */
export function hasValidGameState() {
  try {
    if (typeof localStorage === 'undefined') return false
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw)
    return !!(data && data.version === VERSION)
  } catch {
    return false
  }
}

/**
 * Clear persisted game state (e.g. on New game / Reset).
 */
export function clearGameState() {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Phraseotomy: Could not clear game state', e)
  }
}
