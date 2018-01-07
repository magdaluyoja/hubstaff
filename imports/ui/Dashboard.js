import React from 'react';

import PrivateHeader from './PrivateHeader';
import Links from './Links';

export default () => {
  return (
    <div>
      <PrivateHeader title="Time Tracker"/>
      <div className="page-content">
        <div className="page-content__sidebar">
          <Links/>
        </div>
        <div className="page-content__main">
          <div className="editor">

          </div>
        </div>
      </div>
    </div>
  );
};
