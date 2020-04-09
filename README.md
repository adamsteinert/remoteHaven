# remoteHaven
A simple attempt at creating a shared Gloomhaven board with not a ton of effort. Source image material (tiles etc...) can be found at [BGG](https://boardgamegeek.com/thread/1733586/files-creation)

## Dependencies 
- Install node https://nodejs.org/en/
- Install yarn https://classic.yarnpkg.com/en/
- npm install -g typescript


## Setup
```bash
yarn install
```

## Run
```bash
# For the first run, build first. subsequently you just need to yarn watch
yarn build
yarn watch
```

## Plan
To finalize the 1st pass.. this is probably only a couple developer evenings worth of work.

### Bugs
- Initial add of bitmaps doesn't always refresh the canvas. Currently adding and then dragging the bitmap makes it display

### TODO
- Process / size images appropriately. Pick a good initial scale for images to be added. Resize from original bins.
- Collect images
  - Player characters
  - monsters
  - game tiles
- Create adorners
  - Add adorner circle (gray) & number to monster units that are added. Initially this could just be a global increment for simplicity. Future could add numbers by monster type, track what's out there etc... but that isn't necessary for a janky 1st pass.
  - Allow add of 'elite' units: Change adorner color to gold
  - Do we need adorners for terrain types or is that clear enough from their tiles?
- Review canvas perf tips Check out performance tips? https://toggl.com/blog/html-canvas-createjs
- Create state tracking/communication using web sockets
  - Track add/update/delete of tiles in the system & log on the server
  - replay state on initial page load
  - respond to remote state changes on the client

## Notes
favicon from: https://favicon.io/favicon-generator/
https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
https://www.createjs.com/docs/easeljs/modules/CreateJS.html
