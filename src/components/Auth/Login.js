import React, { useState } from 'react'
import firebase from '../../firebase'
import { Grid, Form, Segment, Button } from 'semantic-ui-react'
import { Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  function displayErrors(errors) {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
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

  function handleSubmit(event) {
    const {email, password} = user
    event.preventDefault()
    if (isFormValid(email, password)) {
      setErrors([])
      setLoading(true)
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          // console.log(signedInUser)
          setErrors([])
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setErrors(errors => errors.concat(err))
          setLoading(false)
        })
    }
  }

  function isFormValid(email, password) {
    return email && password
  }

  return (
    <Grid textAlign='center' className='app' style={{ marginTop: '150px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        {/* header */}
        <Header as='h1' icon color='violet' textAlign='center'>
          <Icon name='code branch' color='orange' />
          Login to DevChat
        </Header>
        {/* form */}
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            {/* email */}
            <Form.Input
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='Email Address'
              onChange={handleChange}
              value={user.email}
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
              value={user.password}
              className={handleInputError(errors, 'password')}
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
            {displayErrors(errors)}
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
