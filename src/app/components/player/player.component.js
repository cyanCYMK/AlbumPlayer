'use strict';

import templateUrl from './player.html';

export const PlayerComponent = {
  templateUrl,
  controller: class PlayerComponent {
    constructor(PlayerService, $sce, $element, $scope, $interval, Howl) {
      'ngInject';
      this.$sce = $sce;
      this.$element = $element;
      this.$scope = $scope;
      this.$interval = $interval;
      this.playerService = PlayerService;
      this.Howl = Howl;
    }

    $onInit() {
      this.loading = true;
      this.playing = false;
      this.playerService.getAlbum().then(({album_name, artist, tracks}) => {
        this.loading = false;
        this.tracks = tracks;
        this.albumName = album_name;
        this.artist = artist;

        // by default set current track to first track
        // TODO: separate this into $postLink and set initial track value there
        // TODO: separate audio controls into stateless component
        this.currentTrack = this._initializeCurrentTrack(this.tracks[0], 0);

console.log('src:', this.currentTrack.url)
        this.sound = new Howl({
          src: [this.currentTrack.url],
          onplay: function() {
             // Display the duration.
             duration.innerHTML = self.formatTime(Math.round(sound.duration()));

             // Start upating the progress of the track.
             requestAnimationFrame(self.step.bind(self));

             // Start the wave animation if we have already loaded
             wave.container.style.display = 'block';
             bar.style.display = 'none';
             pauseBtn.style.display = 'block';
           },
           onload: function() {
             // Start the wave animation.
             console.log('song loaded')
             console.log('duration?', this.duration)
           },
           onend: function() {
             // Stop the wave animation.
             console.log('song ended')
           },
           onpause: function() {
             // Stop the wave animation.
             console.log('paused')
           },
        });
      });
    }

    changeTrack(index) {
      // changes current track to index specified
      if (index < 0 || index > this.tracks.length - 1) return;
      this.currentTrack = this._initializeCurrentTrack(this.tracks[index], index);
      // don't play audio
      this.togglePlay(false);
      console.log(this.currentTrack)
      // get audio element and find attributes
      console.log('duration:', this.$element.find('audio').attr('duration'))
    }

    togglePlay(playing) {
      // access element and call .play() or .pause()
      // if playing specified, play or pause audio; otherwise toggle
      if (playing) {
        this.playing = playing;
      } else {
        this.playing = !this.playing;
      }
      let audio = this.$element.find('audio')[0];
      if (audio) {
        console.log('playing sound:', this.sound)
        this.playing === true ? this.sound.play() : this.sound.pause();
      }
    }

    checkPlayTime(playing) {
      // if playing, start intervals for checking times
      // get length of track and set to interval check, check every second
      this.$interval()
    }

    _initializeCurrentTrack(track, index) {
      // helper function to properties of track for rendering
      return {
        ...track,
        index,
        // url: this.$sce.trustAsResourceUrl(track.url),
        style: {
          'background-image': `url('${track.cover_image}')`,
        }
      }
    }
  }
};
