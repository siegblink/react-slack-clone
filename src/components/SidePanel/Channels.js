import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel } from '../../actions'

function addListeners(state, props, setState) {
  console.log('running listeners')
  let loadedChannels = []
  state.channelsRef.on('child_added', snap => {
    loadedChannels.push(snap.val())
    props.setCurrentChannel(loadedChannels[0])
    setState({
      ...state,
      channels: loadedChannels,
      activeChannel: loadedChannels[0].id,
    })
  })
}

function removeListeners(state) {
  console.log('running clean up')
  state.channelsRef.off()
}

function Channels(props) {
  const [state, setState] = useState({
    activeChannel: '',
    user: props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false,
    firstLoad: true,
  })

  const executeEffect = useCallback(
    function() {
      addListeners(state, props, setState)
    },
    [state, props, setState]
  )

  const executeCleanUp = useCallback(
    function() {
      removeListeners(state)
    },
    [state]
  )

  useEffect(function() {
    executeEffect()

    return function() {
      executeCleanUp()
    }
  }, [])

  function addChannel() {
    const { channelsRef, channelName, channelDetails, user } = state
    const key = channelsRef.push().key
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    }
    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setState({
          ...state,
          channelName: '',
          channelDetails: '',
        })
        closeModal()
        console.log('channel added')
      })
      .catch(err => {
        console.error(err)
      })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (isFormValid(state)) {
      addChannel()
    }
  }

  function handleChange(event) {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    })
  }

  function changeChannel(channel) {
    setActiveChannel(channel)
    props.setCurrentChannel(channel)
  }

  function setActiveChannel(channel) {
    setState({ ...state, activeChannel: channel.id })
  }

  function isFormValid({ channelName, channelDetails }) {
    return channelName && channelDetails
  }

  function openModal() {
    setState({ ...state, modal: true })
  }

  function closeModal() {
    setState({ ...state, modal: false })
  }

  function displayChannels(channels) {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => changeChannel(channel)}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === state.activeChannel}
        >
          # {channel.name}
        </Menu.Item>
      ))
    )
  }

  const { channels, modal } = state
  return (
    <Fragment>
      {console.log('rendering component')}
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>{' '}
          ({channels.length}) <Icon name='add' onClick={openModal} />
        </Menu.Item>
        {displayChannels(channels)}
      </Menu.Menu>

      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label='Name of Channel'
                name='channelName'
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label='About the Channel'
                name='channelDetails'
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color='green' inverted onClick={handleSubmit}>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}

export default connect(
  null,
  { setCurrentChannel }
)(Channels)
