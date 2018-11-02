import React, { Component } from 'react';
import { View, StyleSheet, AsyncStorage, ToastAndroid, ActivityIndicator } from 'react-native';
import { Container, Content, Input, Item, Form, Textarea, Button, Text, Icon } from 'native-base';
import axios from 'axios';
import qs from 'querystring';
import { env } from '../../env';

class AddComplaintTap extends Component {
  state = {
    isFetching: false,
    isSubmitted: false,
    title: '',
    description: '',
    showToast: false,
  }

  submitComplaint = async () => {
    this.setState({isFetching: true});
    const token = await AsyncStorage.getItem('token');
    const {title, description} = this.state;
    if (title.length == 0 || description == 0) {
      ToastAndroid.show('Please fill the title and the description !', 4000);
      this.setState({isFetching: false});
    } else {
      axios.post(`${env.url}/createComplaint`, qs.stringify({token, title, description}))
      .then(async (response) => {
        this.setState({isFetching: false, isSubmitted: true});
        setTimeout(() => {
          this.setState({isSubmitted: false});
        }, 2000)
      })
      .catch(error => {
        console.log(error);
        ToastAndroid.show('Something wrong happened !', 4000);
        this.setState({isFetching: false});
      });
    }
  }

  renderButtonContent = () => {
    if (this.state.isFetching) {
      return <ActivityIndicator color="white" />
    } else if (this.state.isSubmitted) {
      return <Icon style={{color: 'white'}} name="md-checkmark" />
    } else {
      return <Text>Add Complaint</Text> 
    }
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Item regular>
              <Input 
                value={this.state.title} 
                onChangeText={(title) => {this.setState({title})}} 
                selectionColor="#4050B5" 
                placeholder='Title' 
              />
            </Item>
            <Textarea 
              value={this.state.description} 
              onChangeText={(description) => {this.setState({description})}} 
              selectionColor="#4050B5" 
              style={{paddingVertical: 5}} 
              rowSpan={5} 
              bordered 
              placeholder="Description" 
            />
            <Button onPress={() => {this.submitComplaint()}} style={{marginTop: 10}} block success={this.state.isSubmitted} >
              {this.renderButtonContent()}
            </Button>
          </Form>
          <View alignItems="cetner" style={styles.infoBox}>
            <Icon style={{color: 'white'}} name="warning" />
            <Text style={{color: 'white', fontSize: 12}}>
              Housing adminstraion will recieve your complaint and replay to it soon after you submit it.
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  infoBox: {
    backgroundColor: '#B23636',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center', 
    opacity: 0.8
  }
}); 

export default AddComplaintTap;