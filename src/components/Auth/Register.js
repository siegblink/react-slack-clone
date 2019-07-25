import React from 'react'
import firebase from '../../firebase'
import md5 from 'md5'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'
import { Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  }

  displayErrors = errors => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    )
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false
    } else if (password !== passwordConfirmation) {
      return false
    } else {
      return true
    }
  }

  generateError = message => {
    let errors = []
    let error = { message: message }
    this.setState({ errors: errors.concat(error) })
    return false
  }

  isFormValid = () => {
    if (this.isFormEmpty(this.state)) {
      // throw error
      return generateError('Fill in all fields')
    } else if (!this.isPasswordValid(this.state)) {
      // throw error
      return generateError('Password is invalid')
    } else {
      // form valid
      return true
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : ''
  }

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  handleSubmit = event => {
    const { email, password } = this.state
    event.preventDefault()
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser)
          // update displayName and photoURL
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved')
              })
              this.setState({ loading: false })
            })
            .catch(err => {
              console.error(err.message)
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              })
            })
        })
        .catch(err => {
          console.error(err.message)
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          })
        })
    }
  }

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          {/* header */}
          <Header as='h1' icon color='orange' textAlign='center'>
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
                className={this.handleInputError(errors, 'email')}
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
                className={this.handleInputError(errors, 'password')}
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
                className={this.handleInputError(errors, 'password')}
                type='password'
              />
              {/* submit button */}
              <Button
                color='orange'
                fluid
                size='large'
                className={loading ? 'loading' : ''}
                disabled={loading}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {/* error message */}
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          {/* message */}
          <Message>
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
