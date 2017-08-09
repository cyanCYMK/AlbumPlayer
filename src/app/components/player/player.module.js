'use strict';

import angular from 'angular';
import { PlayerComponent } from './player.component';
import { PlayerService } from './player.service';

export const PlayerModule = angular
  .module('player', [])
  .component('player', PlayerComponent)
  .service('PlayerService', PlayerService)
  .name;
