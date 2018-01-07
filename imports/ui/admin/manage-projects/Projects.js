import React from 'react';

import PrivateHeader from './../../PrivateHeader';
import Links from './../../Links';

import AddProject from './AddProject';
import ProjectList from './ProjectList';

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
		          	<h2 className="module-title">Manage Projects</h2>
		          	<AddProject/>
		            <ProjectList/>
		          </div>
		        </div>
		    </div>
        </div>
    );
};
