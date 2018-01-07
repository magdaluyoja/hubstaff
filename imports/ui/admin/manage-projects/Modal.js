import { Meteor } from 'meteor/meteor';
import React from 'react';
import Modal from 'react-modal';
import Select from 'react-select';


export default class projectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            msgClass: '',
            modalLabel: '',
            isOpen:false,
            project:[],
            id:"",
            name:"",
            members:null,
            selmanagers:[],
            selmembers:[],
            selobservers:[]
        };
    }
    componentDidMount() {
        this.UserTracker = Tracker.autorun(() => {

            Meteor.subscribe('Users');

            let mem = Meteor.users.find({"profile.userType":"User"}).fetch();

            mem = mem.map(function (item,index) {
                var member = {value:item._id,label:item.profile.name};
                return member;
            });

            this.setState({members:mem})
        });

        this.setState({
            isOpen:this.props.openModal,
            modalLabel:this.props.modalLabel,
            project:this.props.project,
            id:this.props.project ? this.props.project._id : "",
            name:this.props.project ? this.props.project.name  : "",
            selmanagers:this.props.project ? this.props.project.managers : null,
            selmembers:this.props.project ? this.props.project.members : null,
            selobservers:this.props.project ? this.props.project.observers : null
        });
    }

    componentWillUnmount() {
        this.UserTracker.stop();
    }
    onSubmit(e) {
        e.preventDefault();

        let name = this.refs.name.value.trim();
        let managers = this.state.selmanagers ? this.state.selmanagers : [];
        let members = this.state.selmembers ? this.state.selmembers : [] ;
        let observers = this.state.selobservers ? this.state.selobservers : [];
        let that = this;

        if(name === ""){
            this.setState({msg: 'Project name must not be empty.'});  
            this.setState({msgClass: "err-msg"});
            return;
        }
        if(managers.length === 0){
            this.setState({msg: 'Managers must not be empty.'});  
            this.setState({msgClass: "err-msg"});
            return;
        }
        if(members.length === 0){
            this.setState({msg: 'Members must not be empty.'});  
            this.setState({msgClass: "err-msg"});
            return;
        }
        if(observers.length === 0){
            this.setState({msg: 'Observers must not be empty.'});  
            this.setState({msgClass: "err-msg"});
            return;
        }
        let methodName = "", endMsg = "";
        if(!this.state.id){
            methodName = "project.create";
            endMsg = "saved.";
        }else{
            methodName = "project.update";
            endMsg = "updated.";
        }
        Meteor.call(methodName,this.state.id,name, managers, members, observers,function (err,res) {
            if (err) {
                that.setState({msg: err.reason});
                that.setState({msgClass: "err-msg"});
            } else {
                that.setState({msg: 'Project was successfully '+endMsg});
                that.setState({msgClass: "succ-msg"});
                that.clearFields();
            }
        });
    }
    logManagers(val) {
        this.setState({
            selmanagers: val
        });
    }
    logMembers(val) {
        this.setState({
            selmembers: val
        });
    }
    logObservers(val) {
        this.setState({
            selobservers: val
        });
    }
    clearFields(){
        this.refs.name.value="";
        this.setState({
            selmanagers: null,
            selmembers: null,
            selobservers: null
        });
    }
    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.isOpen}
                    contentLabel={this.state.modalLabel}
                    onAfterOpen={() => this.refs.name.focus()}
                    onRequestClose={this.props.ModalClose}
                    className="boxed-view__box_big"
                    overlayClassName="boxed-view boxed-view--modal"
                    ariaHideApp={false}>

                        <h1 className="module-title">{this.state.modalLabel}</h1>

                        {this.state.msg ? <p className={this.state.msgClass}>{this.state.msg}</p> : undefined}

                        <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form frmProject">
                            <label>Project Name:</label>
                            <input type="text" ref="name" name="name" placeholder="Project Name" defaultValue={this.state.name}/>
                            <label>Managers:</label>
                            <Select className="r-select" name="managers" ref="managers" value={this.state.selmanagers} multi joinValues options={this.state.members} onChange={this.logManagers.bind(this)} placeholder="Managers" rtl={false}/>
                            <label>Members:</label>
                            <Select className="r-select" name="members" ref="members" value={this.state.selmembers} multi joinValues options={this.state.members} onChange={this.logMembers.bind(this)} placeholder="Members"/>
                            <label>Observers:</label>
                            <Select className="r-select" name="observers" ref="observers" value={this.state.selobservers} multi joinValues options={this.state.members} onChange={this.logObservers.bind(this)} placeholder="Observers"/>
                            <button className="button">{this.state.modalLabel}</button>
                        </form>
                </Modal>
            </div>
        );
    }
}
