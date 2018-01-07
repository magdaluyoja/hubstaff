import React from 'react';
import Modal from 'react-modal';

export default class UserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            msgClass: '',
            modalLabel: '',
            isOpen:false,
            user:[],
            id:"",
            name:"",
            email:"",
            password:"",
            position:"",
            readOnly:false
        };
    }
    componentDidMount() {
        
        this.setState({
            isOpen:this.props.openModal,
            modalLabel:this.props.modalLabel,
            user:this.props.user,
            id:this.props.user ? this.props.user._id : "",
            name:this.props.user ? this.props.user.profile.name  : "",
            email:this.props.user ? this.props.user.emails[0].address : "",
            position:this.props.user ? this.props.user.profile.position : "",
            readOnly:this.props.user ? true : "",
        });
    }
    onSubmit(e) {
        e.preventDefault();

        let name = this.refs.name.value.trim();
        let email = this.refs.email.value.trim();
        let password = this.refs.password.value.trim();
        let conpassword = this.refs.conpassword.value.trim();
        let position = this.refs.position.value.trim();
        let that = this;

        if(!this.state.id){
            if (password.length < 9) {
                this.setState({msg: 'Password must be more than 8 characters long'});
                this.setState({msgClass: "err-msg"});
                return;
            }
        }
        if (password.length > 0) {
            if(conpassword !== password){
                this.setState({msg: 'Passwords did not match.'});  
                this.setState({msgClass: "err-msg"});
                return;
            }
        }

        let methodName = "", endMsg = "";
        if(!this.state.id){
            methodName = "user.create";
            endMsg = "saved.";
        }else{
            methodName = "user.update";
            endMsg = "updated.";
        }
        Meteor.call(methodName,this.state.id,name,email,password, position,this.state.email,function (err,res) {
            if (err) {
                that.setState({msg: err.reason});
                that.setState({msgClass: "err-msg"});
            } else {
                that.setState({msg: 'User was successfully '+endMsg});
                that.setState({msgClass: "succ-msg"});
                that.clearFields();
            }
        });
    }
    clearFields(){
        this.refs.name.value="";
        this.refs.email.value="";
        this.refs.password.value="";
        this.refs.conpassword.value="";
        this.refs.position.value="";
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

                        <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                            <label>Fullname:</label>
                            <input type="text" ref="name" name="name" placeholder="Fullname" defaultValue={this.state.name} />
                            <label>Email:</label>
                            <input type="email" ref="email" name="email" placeholder="Email" defaultValue={this.state.email} readOnly={this.state.readOnly} />
                            <label>Password:</label>
                            <input type="password" ref="password" name="password" placeholder="Password" defaultValue={this.state.password} />
                            <label>Confirm Password:</label>
                            <input type="password" ref="conpassword" name="conpassword" placeholder="Confirm Password" defaultValue={this.state.password}/>
                            <label>Position:</label>
                            <input type="text" ref="position" name="position" placeholder="Position"  defaultValue={this.state.position} />
                            <button className="button">{this.state.modalLabel}</button>
                        </form>
                </Modal>
            </div>
        );
    }
}
