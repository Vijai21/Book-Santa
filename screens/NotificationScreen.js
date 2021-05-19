import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class NotificationScreen extends Component{
  constructor(){
    super()
    this.state = {
      allNotifications : [],
      userId: firebase.auth().currentUser.email,
    }
  this.notificationRef= null
  }

  getallNotifications =()=>{
    this.notificationRef = db.collection("all_notifications").where('notification_status', '==', 'unread').where('targeted_user_id', '==', this.state.userId)
    .onSnapshot((snapshot)=>{
      var allNotifications = []
      snapshot.docs.map(document => {
          var notification = document.data()
        notification ['doc_id'] = doc.id
        allNotifications.push(notification)
        });
      this.setState({
        allNotifications : allNotifications
      });
    })
  }

  componentDidMount(){
    this.getallNotifications()
  }

  componentWillUnmount(){
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style = {{flex: 0.1}}>
            <MyHeader title="Notifications" navigation ={this.props.navigation}/>
        </View>
        <View style={{flex:0.9}}>
          {
            this.state.allNotifications.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}> You have no notifications </Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allNotifications}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
