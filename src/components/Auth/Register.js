import React from 'react'
import firebase from '../../firebase'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'
import { Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = event => {
    const { email, password } = this.state
    event.preventDefault()
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(createdUser => {
        console.log(createdUser)
      })
      .catch(err => console.error(err.message))
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          {/* header */}
          <Header as='h2' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register for DevChat
          </Header>
          {/* form */}
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              {/* username */}
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                value={username}
                type='text'
              />
              {/* email */}
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                onChange={this.handleChange}
                value={email}
                type='email'
              />
              {/* password */}
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                value={password}
                type='password'
              />
              {/* password confirmation */}
              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                value={passwordConfirmation}
                type='password'
              />
              {/* submit button */}
              <Button color='orange' fluid size='large'>
                Submit
              </Button>
            </Segment>
          </Form>
          {/* message */}
          <Message>
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
