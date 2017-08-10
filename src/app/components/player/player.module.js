'use strict';

import angular from 'angular';
import { PlayerComponent } from './player.component';
import { PlayerService } from './player.service';
import './player.scss';

export const PlayerModule = angular
  .module('player', [])
  .constant('Howl', Howl) // Howl is global var from 3rd party library Howler
  .component('player', PlayerComponent)
  .service('PlayerService', PlayerService)
  .name;
