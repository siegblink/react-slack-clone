import React from 'react'
import firebase from '../../firebase'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'
import { Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  }

  displayErrors = errors => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
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

  handleSubmit = event => {
    const { email, password, errors } = this.state
    event.preventDefault()
    if (this.isFormValid({ email, password })) {
      this.setState({ errors: [], loading: true })
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          console.log(signedInUser)
          this.setState({ errors: [], loading: false })
        })
        .catch(err => {
          console.error(err)
          this.setState({
            errors: errors.concat(err),
            loading: false,
          })
        })
    }
  }

  isFormValid = ({ email, password }) => {
    return email && password
  }

  render() {
    const { email, password, errors, loading } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          {/* header */}
          <Header as='h1' icon color='violet' textAlign='center'>
            <Icon name='code branch' color='orange' />
            Login to DevChat
          </Header>
          {/* form */}
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
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
              {/* submit button */}
              <Button
                color='violet'
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
            Don't have an account? <Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
