'use strict';

import components from './index.components';
import config from './index.config';
import run from './index.run';

import coreModule from './core/core.module';
import indexComponents from './index.components';

const App = angular.module(
  "fundboxChallenge", [
    // plugins
    "ngSanitize",

    // core
    coreModule.name,

    // components
    indexComponents.name,
  ]
);

App
  .config(config)
  .run(run);

export default App;
