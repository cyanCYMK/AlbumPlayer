'use strict';

export class PlayerService {
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  getAlbum() {
    return this.$http.get('https://s3-us-west-1.amazonaws.com/fbx-fed-homework/fed_home_assignment_api.json')
      .then(({data}) => data);
  }
}
