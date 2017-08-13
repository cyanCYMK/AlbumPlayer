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
        console.log('got album:', album_name)
        this.loading = false;
        this.tracks = tracks;
        this.albumName = album_name;
        this.artist = artist;

        // by default set current track to first track
        // TODO: separate this into $postLink and set initial track value there
        // TODO: separate audio controls into stateless component
        this.index = 0;
        this.tracks[0] = this._initializeCurrentTrack(this.tracks[0], 0);
      });
    }

    step() {
      // called with requestAnimationFrame to update playback position
      const currentTrack = this.tracks[this.index];
      let seek = currentTrack.sound.seek() || 0;
      let duration = currentTrack.sound.duration();
      this.timer = this._formatTime(Math.round(seek));
      this.progressWidth = (((seek / currentTrack.sound.duration()) * 100) || 0) + '%';
      this.elapsed = this.timer;
      this.remaining = this._formatTime(Math.round(duration - seek));

      // If the sound is still playing, continue stepping.
      if (!currentTrack.sound.playing()) {
        this.$interval.cancel(this.timerInterval);
      }
    }

    changeTrack(index) {
      if (index < 0 || index > this.tracks.length - 1) return;

      console.log('stopping track:', this.index)
      console.log('changing track to:', index)

      const previousTrack = this.tracks[this.index];
      previousTrack.sound.stop();

      // change state for intervals and index
      // this.$interval.cancel(this.timerInterval);
      this.index = index;

      if (!this.tracks[index].sound) {
        this.tracks[index] = this._initializeCurrentTrack(this.tracks[index], index);
      }

      // for views
      this.playing = false; // for viewing pause/play button
      this.remaining = this._formatTime(Math.round(this.tracks[this.index].sound.duration()));
      this.elapsed = '';
    }

    pause() {
      this.playing = false;
      this.tracks[this.index].sound.pause();
    }

    play() {
      this.playing = true;
      this.tracks[this.index].sound.play();
    }

    checkPlayTime(playing) {
      // if playing, start intervals for checking times
      // get length of track and set to interval check, check every second
      this.$interval()
    }

    _initializeCurrentTrack(track, index) {
      // helper function to properties of track for rendering
      const sound = new Howl({
        src: [track.url],
        onplay: () => {
          // Start upating the progress of the track.
          this.timerInterval = this.$interval(this.step.bind(this), 1000);
         },
         onload: () => {
           // Set remaining time.
           console.log('song loaded')
           this.$scope.$apply(() => {
             this.remaining = this._formatTime(Math.round(this.tracks[this.index].sound.duration()));
           });
         },
         onend: () => {
           // Stop the wave animation.
           console.log('song ended, canceling interval')
           this.$interval.cancel(this.timerInterval);

         },
         onpause: () => {
           // Stop the wave animation.
           console.log('paused, canceling interval')
           this.$interval.cancel(this.timerInterval);
         },
         onstop: () => {
           console.log('stopped, canceling interval')
           this.$interval.cancel(this.timerInterval);
         }
      });

      return {
        ...track,
        index,
        sound,
        style: {
          'background-image': `url('${track.cover_image}')`,
        }
      }
    }
    _formatTime(secs) {
      const minutes = Math.floor(secs / 60) || 0;
      const seconds = (secs - minutes * 60) || 0;

      return `${minutes}:${(seconds < 10 ? 0 : '')}${seconds}`;
    }
  }
};
