'use strict';

import templateUrl from './player.html';

export const PlayerComponent = {
  templateUrl,
  controller: class PlayerComponent {
    constructor(PlayerService) {
      'ngInject';
      this.playerService = PlayerService;
    }

    $onInit() {
      this.playerService.getAlbum().then(album => this.album = album);
    }
  }
};
