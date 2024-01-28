import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import { Modal } from 'antd';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      name: values.name,
      date: values.date.format("YYYY-MM-DD"),
      tag: values.tag,
      amount: parseFloat(values.amount),
    };
    addTransaction(newTransaction);
  }

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transaction`),
        transaction
      );
      console.log("Document Written with ID:", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr=transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();

    } catch (e) {

      console.error("Error adding Document", e);

      if(!many) toast.error("Couldnt add Transaction");
    }
  }

  useEffect(() => {
    fetchTransaction();
  }, [user])

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    // Initialize variables for income and expenses
    let incomeTotal = 0;
    let expensesTotal = 0;

    // Iterate through transactions
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        // Add income amount to the total
        incomeTotal += transaction.amount;
      } else if (transaction.type === "expense") {
        // Add expense amount to the total
        expensesTotal += transaction.amount;
      }
    });

    // Update income and expenses state variables (assuming these functions exist)
    setIncome(incomeTotal);
    setExpense(expensesTotal);

    // Calculate and update the current balance
    setTotalBalance(incomeTotal - expensesTotal);

  };


  async function fetchTransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transaction`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("transaction Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions= transactions.sort ((a, b) => {
    return new Date(a.date) - new Date(b.date);
    })


  return (
    <div>
      <Header />

      {loading ? <p>Loading...</p> : (<>



        <Cards income={income} expense={expense} totalBalance={totalBalance} showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal} />
        {transactions && transactions.length!==0?<ChartComponent  sortedTransactions={sortedTransactions} />:<NoTransactions />}
        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />

        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransaction} />
      </>)}
    </div>

  );
}

export default Dashboard;
