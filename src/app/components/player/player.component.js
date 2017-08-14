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
      this.elapsed = '00:00';
      this.remaining = '00:00';
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
        // TODO: separate audio controls into stateless component
        this.index = 0;
        this.tracks[0] = this._initializeCurrentTrack(this.tracks[0], 0);
      });
    }

    step() {
      /* updates seek bar and track timers, sets interval */
      const currentTrack = this.tracks[this.index];
      let seek = currentTrack.sound.seek() || 0;
      let duration = currentTrack.sound.duration();
      this.timer = this._formatTime(Math.round(seek));

      this.progressWidth = {
        width: (((seek / currentTrack.sound.duration()) * 100) || 0) + '%'
      };

      this.elapsed = this.timer;
      this.remaining = this._formatTime(Math.round(duration - seek));

      // if sound isn't playing, cancel the interval
      if (!currentTrack.sound.playing()) {
        this.$interval.cancel(this.timerInterval);
      }
    }

    changeTrack(index) {
      if (index < 0 || index > this.tracks.length - 1) return;

      const previousTrack = this.tracks[this.index];
      previousTrack.sound.stop();

      this.index = index;

      if (!this.tracks[index].sound) {
        this.tracks[index] = this._initializeCurrentTrack(this.tracks[index], index);
      }

      // for views
      this.playing = false; // for viewing pause/play button
      this.remaining = this._formatTime(Math.round(this.tracks[this.index].sound.duration()));
      this.elapsed = '00:00';
    }

    pause() {
      this.playing = false;
      this.tracks[this.index].sound.pause();
    }

    play() {
      this.playing = true;
      this.tracks[this.index].sound.play();
    }

    _initializeCurrentTrack(track, index) {
      // sets properties of track for rendering and sound
      const sound = new Howl({
        src: [track.url],
        onplay: () => {
          // Start upating the progress of the track.
          this.timerInterval = this.$interval(this.step.bind(this), 1000);
         },
         onload: () => {
           // sets timer for track length
           this.$scope.$apply(() => {
             this.remaining = this._formatTime(Math.round(this.tracks[this.index].sound.duration()));
           });
         },
         onend: () => {
           // resets seek bar and cancels interval
           this.$scope.$apply(() => this.progressWidth = { width: '0%' });
           this.$interval.cancel(this.timerInterval);

         },
         onpause: () => {
           this.$interval.cancel(this.timerInterval);
         },
         onstop: () => {
           // resets seek bar and cancels interval
           this.$scope.$apply(() => this.progressWidth = { width: '0%' });
           this.$interval.cancel(this.timerInterval);
         }
      });

      return {
        ...track,
        index,
        sound,
        coverImage: this.$sce.trustAsResourceUrl(track.cover_image),
      }
    }

    _formatTime(secs) {
      // helper function to format timers
      const minutes = Math.floor(secs / 60) || 0;
      const seconds = (secs - minutes * 60) || 0;

      return `${(minutes < 10 ? 0 : '')}${minutes}:${(seconds < 10 ? 0 : '')}${seconds}`;
    }
  }
};
