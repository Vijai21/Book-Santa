import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {Card} from 'react-native-elements';

export default class ReceiverDetailsScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            userName: '',
            receiverId: this.props.navigation.getParam('details')['user_id'],
            requestId: this.props.navigation.getParam('details')['request_id'],
            bookName: this.props.navigation.getParam('details')['book_name'],
            reason: this.props.navigation.getParam('details')['reason_to_request'],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: '',
        }
    }

    getReceiverDetails(){
        db.collection('users').where('email_id','==',this.state.receiverId).get()
        .then(snapshot => {
        snapshot.forEach(doc => {
        var data = doc.data()
            this.setState({
            receiverName : data.first_name,
            receiverAddress   : data.address,
            receiverContact   : data.contact,
            })
        });
        })
        db.collection('requested_books').where('request_id','==',this.state.requestId).get()
        .then(snapshot => {
        snapshot.forEach(doc => {
        var data = doc.data()
            this.setState({
              receiverRequestDocId: doc.id
            })
        });
        })
    }

    getUserDetails=(userId)=>{
        db.collection('users').where('email_id','==',userId).get()
        .then(snapshot => {
          snapshot.forEach(doc => {
          var data = doc.data()
            this.setState({
              userName: doc.data().first_name+' '+doc.data().last_name
            })
          });
        })
      }

      updateBookStatus=()=>{
          db.collection('all_donations').add({
              book_name: this.state.bookName,
              request_id: this.state.requestId,
              requested_by: this.state.receiverName,
              donor_id: this.state.userId,
              request_status: 'Donor Interested',
          })
      }

      addNotification=()=>{
          var message = this.state.userName+' has shown interest in donating the book'
          db.collection('all_notifications').add({
              targeted_user_id: this.state.receiverId,
              donor_id: this.state.userId,
              request_id: this.state.requestId,
              book_name: this.state.bookName,
              date: firebase.firestore.FieldValue.serverTimestamp(),
              notification_status: 'unread',
              message: message,
          })
      }

    componentDidMount(){
        this.getReceiverDetails();
        this.getUserDetails(this.state.userId);
    }

    render(){
        return(
            <View style = {{flex: 1}}>
                <View style = {{flex: 0.1}}>
                    <MyHeader title = 'Donate Books' />
                </View>
                <View style = {{flex: 0.3}}>
                    <Card title = {'Book Information'} titleStyle = {{fontSize: 20}} > 
                        <Card> 
                            <Text style = {{fontWeight: 'bold'}}> Name: {this.state.bookName} </Text>
                        </Card>
                        <Card> 
                            <Text style = {{fontWeight: 'bold'}}> Reason: {this.state.reason} </Text>
                        </Card>
                    </Card>
                </View>

                <View style = {{flex: 0.3}}>
                    <Card title = {'Receiver Information'} titleStyle = {{fontSize: 20}} > 
                        <Card> 
                            <Text style = {{fontWeight: 'bold'}}> Name: {this.state.receiverName} </Text>
                        </Card>
                        <Card> 
                            <Text style = {{fontWeight: 'bold'}}> Contact: {this.state.contact} </Text>
                        </Card>
                        <Card> 
                            <Text style = {{fontWeight: 'bold'}}> Address: {this.state.address} </Text>
                        </Card>
                    </Card>
                </View>
                <View style = {styles.buttonContainer}>
                    {this.state.receiverId!== this.state.userId ?(
                        <TouchableOpacity style = {styles.button} onPress = {()=>{
                            this.updateBookStatus()
                            this.addNotification()
                            this.props.navigation.navigate('MyDonation')
                        }}>
                            <Text> I want to Donate </Text>
                        </TouchableOpacity>
                    ): null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff9800",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 10
      },
      buttonContainer: {
          flex: 0.3,
          justifyContent: 'center',
          alignItems: 'center',
      }
})