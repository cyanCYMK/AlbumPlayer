'use strict';

import templateUrl from './player.html';

export const PlayerComponent = {
  templateUrl,
  controller: class PlayerComponent {
    constructor(PlayerService, $sce) {
      'ngInject';
      this.$sce = $sce;
      this.playerService = PlayerService;
    }

    $onInit() {
      this.loading = true;
      this.playerService.getAlbum().then(({album_name, artist, tracks}) => {
        this.loading = false;
        this.tracks = tracks;
        this.albumName = album_name;
        this.artist = artist;

        // by default set current track to first track
        this.currentTrack = this._initializeCurrentTrack(this.tracks[0]);
        console.log(this.currentTrack)
      });
    }

    _initializeCurrentTrack(track) {
      return {
        ...track,
        url: this.$sce.trustAsResourceUrl(track.url),
        style: {
          'background-image': `url('${track.cover_image}')`,
          'background-repeat': 'no-repeat',
          'background-size': 'contain',
          width: '100vw',
          height: '100vh',
        }
      }
    }
  }
};
