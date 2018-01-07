import React from 'react';

import PrivateHeader from './../../PrivateHeader';
import Links from './../../Links';

import AddUser from './AddUser';
import UserList from './UserList';

export default () => {
  return (
    <div>
      <PrivateHeader title="Time Tracker"/>
      <div className="page-content">
        <div className="page-content__sidebar">
          <Links/>
        </div>
        <div className="page-content__main">
          <div className="content">
          	<h2 className="module-title">Manage Users</h2>
          	<AddUser/>
            <UserList/>
          </div>
        </div>
      </div>
    </div>
  );
};
