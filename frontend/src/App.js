/* eslint-disable eqeqeq */
import web3 from './web3';
import lottery from './lottery';
import React, { useEffect, useState } from 'react';
import { Button, Grid, Header, Input, Message, Icon, Label, Segment, Menu } from 'semantic-ui-react'


const App = () => {
  let [manager, setManager] = useState('');
  let [players, setPlayers] = useState([]);
  let [balance, setBalance] = useState('');
  let [userAmount, setUserAmount] = useState(0.10);
  let [message, setMessage] = useState('');
  let [inputError, setInputError] = useState('');
  let [userAccount, setUserAccount] = useState('');
  useEffect(() => {
    getManager();
    getPlayers();
    getBalance();
    getUserAccount();
  }, []);
  const getManager = async () => {
    console.info("Get manager started!");
    const v_manager = await lottery.methods.manager().call();
    setManager(v_manager);
  }
  const getPlayers = async () => {
    const v_players = await lottery.methods.getPlayers().call();
    console.info("V_players:", v_players);
    setPlayers(v_players);
  }
  const getBalance = async () => {
    const v_balance = await web3.eth.getBalance(lottery.options.address);
    console.info("Balance:", v_balance);
    setBalance(v_balance);
  }
  const getUserAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setUserAccount(accounts[0]);
    }
  }
  const onEnter = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    try {
      let amountCopy = userAmount;
      let result = await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(userAmount, 'ether')
      });
      console.info(result);
      getPlayers();
      getBalance();
      setMessage(`You have been entered ${amountCopy} ether!`);
      setUserAmount(0.1);
    } catch (err) {
      console.info("Error:", err);
      setMessage(err.message || "error");
    }
  }
  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      let winnerAddress = await lottery.methods.getLastWinner().call();
      console.info("Last winner:", winnerAddress);
      setMessage(`A winner has been picked! Winner address: ${winnerAddress}`);
    } catch (err) {
      setMessage(err.message || "Error!");
    }
  }
  const userAmountAction = (e) => {
    setInputError("");
    let userInput = e.target.value;
    if (userInput == "") {
      setUserAmount("");
    } else if (userInput.match(/^[0-9.]+$/)) {
      setUserAmount(userInput);
      ErrorChecks(userInput);
    }
  }
  const ErrorChecks = (input) => {
    if (isNaN(input)) {
      setInputError("Input not a valid number.");
    } else if (Number(input) < 0.1) {
      setInputError("Input must be greater than 0.1.")
    }
  }
  function maskAccount(accountText) {
    return accountText.substr(0, 5) + "..." + accountText.substr(39, 42);
  }
  return (

    <React.Fragment>
      <Menu fluid fixed="top">
        <Menu.Item
          name='home'
          position="right"
        >
          {userAccount == "" ? "User not connected!" : maskAccount(userAccount)}
        </Menu.Item>
      </Menu>
      <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 700 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Lottery Application
          </Header>
          <Segment.Group>
            <Segment>
              <p> Manager address: <p style={{ fontWeight: 'bold' }}>
                <a alt="manager" href={`https://rinkeby.etherscan.io/address/${manager}`}>
                  {manager}
                </a>
              </p></p>
              <p>There are currently <span style={{ fontWeight: 'bold' }}>{players.length}</span> people entered, competing to win <span style={{ fontWeight: 'bold' }}> {web3.utils.fromWei(balance, 'ether')} </span> ether!</p>
            </Segment>
            <Segment>
              <h4>Want to try your luck?</h4>
              <div>
                <div>Amount of ether to enter</div>
                <div>
                  <Input
                    placeholder={0}
                    action={
                      <Button animated='vertical' onClick={onEnter}>
                        <Button.Content hidden>{userAmount}</Button.Content>
                        <Button.Content visible>
                          Enter <Icon name='arrow alternate circle right' />
                        </Button.Content>
                      </Button>
                    }
                    value={userAmount} onChange={userAmountAction} />
                </div>
                <div>{inputError}</div>
              </div>
            </Segment>
            <Segment>
              <h4>Ready to pick a winner?</h4>
              <Button as='div' labelPosition='right' onClick={pickWinner} disabled={players.length === 0}>
                <Button color='green'>
                  <Icon name='random' />
                  Pick a winner!
                </Button>
                <Label as='a' basic color='green' pointing='left'>
                  {players.length}
                </Label>
              </Button>
            </Segment>
          </Segment.Group>
          {message && <Message>
            {message}
          </Message>}
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
}

export default App;
