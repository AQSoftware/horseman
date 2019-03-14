// @flow
import MiniApp from './components/MiniApp';
import HorsemanGame from './HorsemanGame';

const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const DEVT = true;

/**
 * shouldWin - Tells the MiniApp to force the current game iteration to win
 * winImage - Optional. Image URL of item won. Only present if shouldWin is true.
 * source - User info of current user playing the MiniApp
 * engagementSource - User info of user who created the instance of the MiniApp
 * engagementInfo - Data specific to the MiniApp.
 */
let data = {
  shouldWin: false,
  winImage: "https://s3.amazonaws.com/famers/720/F1040881145111POSYEB.png",
  engagementInfo: {
    background: "https://s3.amazonaws.com/famers/720/F1040881145112DFY3HK.jpg"
  },
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  difficultyLevel: 1,
  hasTargetScore: true,
  startCaption: "Hit #ts skulls",
  winCaption: "You did it",
  loseCaption: "Not quite",
  speed: [1.5 * .09, 1.25 * .09, 1 * .09, 0.75 * .09, 0.5 * .09],
  targetScore: [10, 10, 10, 15, 20],
  allowHitFrom: [-180, -200, -210, -230, -230],
  allowHitTo: [-270, -270, -270, -260, -260]
}

const miniApp = new MiniApp({
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  game: HorsemanGame,
  devt: true,
  data: data
});

