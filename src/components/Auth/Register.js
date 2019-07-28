import React, { useState } from 'react'
import firebase from '../../firebase'
import md5 from 'md5'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'
import { Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [usersRef] = useState(firebase.database().ref('users'))

  function displayErrors(errors) {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  function isFormEmpty({ username, email, password, passwordConfirmation }) {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    )
  }

  function isPasswordValid({ password, passwordConfirmation }) {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false
    } else if (password !== passwordConfirmation) {
      return false
    } else {
      return true
    }
  }

  function generateError(message) {
    let error = { message: message }
    setErrors(errors => errors.concat(error))
    return false
  }

  function isFormValid() {
    if (isFormEmpty(user)) {
      // throw error
      return generateError('Fill in all fields')
    } else if (!isPasswordValid(user)) {
      // throw error
      return generateError('Password is invalid')
    } else {
      // form valid
      return true
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  function handleInputError(errors, inputName) {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : ''
  }

  function saveUser(createdUser) {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  function handleSubmit(event) {
    const { username, email, password } = user
    event.preventDefault()
    if (isFormValid()) {
      setErrors([])
      setLoading(true)
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser)
          // update displayName and photoURL
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log('user saved')
              })
              setLoading(false)
            })
            .catch(err => {
              console.error(err.message)
              setErrors(errors => errors.concat(err))
              setLoading(false)
            })
        })
        .catch(err => {
          console.error(err.message)
          setErrors(errors => errors.concat(err))
          setLoading(false)
        })
    }
  }

  const { username, email, password, passwordConfirmation } = user
  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        {/* header */}
        <Header as='h1' icon color='orange' textAlign='center'>
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>
        {/* form */}
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            {/* username */}
            <Form.Input
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              onChange={handleChange}
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
              onChange={handleChange}
              value={email}
              className={handleInputError(errors, 'email')}
              type='email'
            />
            {/* password */}
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              onChange={handleChange}
              value={password}
              className={handleInputError(errors, 'password')}
              type='password'
            />
            {/* password confirmation */}
            <Form.Input
              fluid
              name='passwordConfirmation'
              icon='repeat'
              iconPosition='left'
              placeholder='Password Confirmation'
              onChange={handleChange}
              value={passwordConfirmation}
              className={handleInputError(errors, 'password')}
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
            {displayErrors(errors)}
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
