import React from 'react';
import Modal from 'react-modal';
import FlipMove from 'react-flip-move';

import { Mytime } from '../../../api/timeTracker';
import {PDF} from './PDF-dtld';

export default class UserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:false,
            alltimes:[],
        };
    }
    componentDidMount() {
        
        this.setState({
            isOpen:this.props.openModal,
            modalLabel:this.props.modalLabel
        });

        Meteor.subscribe('AllTime');

        const alltimes = Mytime.find({dateStarted:this.props.dateStarted, userId:this.props.userId, "project.value":this.props.projectId}).fetch();
        this.setState({ alltimes });
    }
    renderMapping(){
        return this.state.alltimes.map((mytime) => {
            return (
                <tr key={mytime._id}>
                    <td>{this.props.user}</td>
                    <td>{mytime.dateStarted}</td>
                    <td>{mytime.dateEnded}</td>
                    <td>{mytime.totalTime}</td>
                </tr>
            );
        });
    }
    renderAll() {
        
        if (this.state.alltimes.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">No Records Found</p>
                </div>
            );
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Date Started</th>
                        <th>Date Ended</th>
                        <th>Total Time</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderMapping()}
                </tbody>
            </table>
        )
    }
    getPDF(){
        Meteor.pdf.save(PDF(this.state.alltimes,this.state.modalLabel, this.props.user), 'User Activities on '+this.state.modalLabel);
    }
    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.isOpen}
                    contentLabel={this.state.modalLabel}
                    onRequestClose={this.props.ModalClose}
                    className="boxed-view__box_big"
                    overlayClassName="boxed-view boxed-view--modal"
                    ariaHideApp={false}>

                    <h1 className="module-title">{this.state.modalLabel}</h1>
                    <FlipMove maintainContainerHeight={true}>
                        <div className="tbl-container">
                            {this.renderAll()}
                        </div>
                    </FlipMove>
                    {this.state.alltimes.length > 0?
                        <button className="button button-wide" onClick={this.getPDF.bind(this)}>Download PDF</button>
                    : null }

                </Modal>
            </div>
        );
    }
}
