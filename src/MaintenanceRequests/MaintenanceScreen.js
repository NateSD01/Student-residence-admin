import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  AsyncStorage
} from 'react-native';
import {
  Icon,
  Button,
  Fab,
  Container,
  Header,
  Left,
  Right,
  Body,
  Segment,
  Content,
  List,
  ListItem,
  Thumbnail,
  Spinner, 
  Badge,
} from 'native-base';
import axios from 'axios';
import qs from 'querystring';
import { env } from '../../env';

export default class addmaintain extends Component {
  state = {
    active: 'true',
    requests: null,
    viewType: 'all',
  }

  async componentWillMount() {
    // fixing native-base font problem
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });

    // getting the complaints
    const token = await AsyncStorage.getItem('token');
    axios.post(`${env.url}/getMaintenanceRequestsForStudent`, qs.stringify({token}))
    .then(async (response) => {
      console.log(response.data);
      this.setState({requests: response.data});
    })
    .catch(error => {
      console.log(error);
    });
  }

  refreshRequests = async () => {
    // getting the complaints
    const token = await AsyncStorage.getItem('token');
    axios.post(`${env.url}/getMaintenanceRequestsForStudent`, qs.stringify({token}))
    .then(async (response) => {
      this.setState({requests: response.data, });
    })
    .catch(error => {
      console.log(error);
    });
  }

  renderRequests = () => {
    if (this.state.requests != null) {
      if (this.state.requests.length == 0) {
        return (
          <Card>
            <CardItem>
              <Body>
                <Text>There are no complaints submitted by you yet. !</Text>
              </Body>
            </CardItem>
          </Card>
        );
      } else {
        return  this.state.requests.slice(0).reverse().map((request) => {
          const eImage = require('../img/flash.png');
          const cImage = require('../img/wrench.png');
          const pImage = require('../img/watering.png');

          if (request.status === 'in_process') {
            request.status = 'in process'
          }
          let image = '';
          switch (request.type) {
            case 'electricity':
              image = require('../img/flash.png');
              break;
            case 'plumbing':
              image = require('../img/watering.png');
              break;
            case 'carpentry':
              image = require('../img/wrench.png');
              break;
          }
          
          return (
            <ListItem key={request.id} avatar>
              <Left>
                <Thumbnail square style={{height: 30, width: 30,}} source={image}/>
              </Left>
              <Body>
                <Text style={{marginBottom: 5, paddingTop: 3}}>{request.title}</Text>
                <Text style={{marginBottom: 5, fontSize: 10}} note>{request.description}</Text>
              </Body>
              <Right>
                <Text style={{fontSize: 9, color: 'grey'}} note>{request.created_at}</Text>
                <Badge primary={request.status === 'in process'} danger={request.status === 'closed'} success={request.status === 'open'} style={{marginTop: 5, height: 22, opacity: 0.9}}><Text style={{color: 'white', fontSize: 11}}>{request.status}</Text></Badge>
              </Right>
            </ListItem>
          );
        });
      }
    } else {
      return <Spinner color="#4050B5" />
    }
  }

  render() {
    console.log(this.state);
    return (
      <Container>
        <Header hasSegment style={{paddingTop: -20, height: 50, backgroundColor: 'white'}}>
          <Body>
            <Segment style={{backgroundColor: 'white'}}>
              <Button 
                first  
                active={this.state.viewType == 'all'}
                onPress={() => {this.setState({viewType: 'all'})}}
              >
                <Icon name="list" />
              </Button>
              <Button
                active={this.state.viewType == 'electricity'}
                onPress={() => {this.setState({viewType: 'electricity'})}}
              >
                <Image
                  source={(this.state.viewType === 'electricity') ? require('../img/flash-2.png') : require('../img/flash.png')}
                  style={{ width: 20, height: 20, marginHorizontal: 10}}
                />
              </Button>
              <Button                
                active={this.state.viewType == 'plumbing'}
                onPress={() => {this.setState({viewType: 'plumbing'})}}
              >
                <Image
                  source={(this.state.viewType === 'plumbing') ? require('../img/watering-2.png') : require('../img/watering.png')}
                  style={{ width: 20, height: 20, marginHorizontal: 10}}
                />
              </Button>
              <Button 
                last
                active={this.state.viewType == 'carpentry'}
                onPress={() => {this.setState({viewType: 'carpentry'})}}
              >
                <Image
                  source={(this.state.viewType === 'carpentry') ? require('../img/wrench-2.png') : require('../img/wrench.png')}
                  style={{ width: 20, height: 20, marginHorizontal: 10}}
                />
              </Button>
            </Segment>
          </Body>
        </Header>

        <Content>
          <List>
            {this.renderRequests()}
          </List>
        </Content>

        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{ }}
          style={{ backgroundColor: '#8A6C99' }}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('CreateMaintenanceRequest')}
        >
          <Icon name="add" />
        </Fab>

      </Container>
    );
  }
}
const styles = StyleSheet.create({

}); 