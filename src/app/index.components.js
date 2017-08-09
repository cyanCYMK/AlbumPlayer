'use strict';

import footerModule from './components/footer/footer.module';
import { PlayerModule } from './components/player/player.module';

export default angular.module('index.components', [
	footerModule.name,
	PlayerModule,
]);
