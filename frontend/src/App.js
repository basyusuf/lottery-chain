import web3 from './web3';
import lottery from './lottery';
import { useEffect, useState } from 'react';


const App = () => {
  console.info(web3.version);
  console.info(lottery);
  let [manager, setManager] = useState('');
  let [players, setPlayers] = useState([]);
  let [balance, setBalance] = useState('');
  let [userAmount, setUserAmount] = useState('');
  let [message, setMessage] = useState('');
  useEffect(() => {
    getManager();
    getPlayers();
    getBalance();
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
  const onEnter = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');
    try {
      let result = await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(userAmount, 'ether')
      });
      console.info(result);
      getPlayers();
      getBalance();
      setMessage('You have been entered!');
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
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p> Manager address: {manager}</p>
      <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>
      <hr />
      <form onSubmit={onEnter}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={userAmount} onChange={(e) => setUserAmount(e.target.value)} />
        </div>
        <div>
          <button>Enter</button>
        </div>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner!</button>
      <hr />
      <div>
        {message}
      </div>
    </div >
  );
}

export default App;
