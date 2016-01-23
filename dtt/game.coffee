gameInitialState =
  started: false
  tasks: []

game = (state = gameInitialState, action) ->
  switch action.type
    when 'startGame'
      newState(state, started: true, target: calculateTargetTime())
    when 'startCountdown'
      newState(state, countdown: 3)
    when 'decreaseCountdown'
      newState(state, countdown: state.countdown - 1, running: state.countdown == 1)
    when 'nextTask'
      task = generateTask()
      newState(state, tasks: [task].concat(state.tasks))
    else
      state

timer = ->
  game = store.getState().game
  return unless game.started
  if game.countdown
    store.dispatch(type: 'decreaseCountdown')
  else if game.running
    store.dispatch(type: 'nextTask')

setInterval(timer, 1000)