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
        this.currentTrack = this._initializeCurrentTrack(this.tracks[0], 0);
        console.log(this.currentTrack)
      });
    }

    changeTrack(index) {
      // changes current track to index specified
      if (index < 0 || index > this.tracks.length - 1) return;
      this.currentTrack = this._initializeCurrentTrack(this.tracks[index], index);
      console.log(this.currentTrack)

    }

    _initializeCurrentTrack(track, index) {
      // helper function to properties of track for rendering
      return {
        ...track,
        index,
        url: this.$sce.trustAsResourceUrl(track.url),
        style: {
          'background-image': `url('${track.cover_image}')`,
        }
      }
    }
  }
};
