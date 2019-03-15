import { getRuntimeUrl, FlexPlugin } from 'flex-plugin';
import React from 'react';

import { LookupTab } from './LookupTab';
import { LookupIcon, LookupIconActive } from './LookupIcon'

export default class TwilioLookupPlugin extends FlexPlugin {
  pluginName = "TwilioLookupPlugin";

  init(flex, manager) {
    const functionsUrl = manager.configuration.functionsUrl
      ? manager.configuration.functionsUrl
      : getRuntimeUrl();
    flex.TaskCanvasTabs.Content.add(
      <LookupTab
        key="lookup-tab"
        functionsUrl={functionsUrl}
        icon={<LookupIcon />}
        iconActive={<LookupIconActive />}
        visible
      />,
      { if: props => !!props.task }
    );
  }
}
