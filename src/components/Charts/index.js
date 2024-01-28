import { Line, Pie } from '@ant-design/charts';
import React from 'react';

function ChartComponent({sortedTransactions}) {
    const data =sortedTransactions.map((item)=>{
        return{date:item.date,amount:item.amount };
    });

    const spendingData=sortedTransactions.filter((transaction)=>{
        if(transaction.type==='expense'){
            return{tag:transaction.tag,amount:transaction.amount};
        }
    });

    let finalSpendings = spendingData. reduce ( (acc, obj) => {
        let key = obj.tag;
        if (!acc [key]) { 
        acc [key] = { tag: obj.tag, amount: obj.amount }; // create a new object with the same properties
        } else {
        acc [key].amount += obj.amount;
        }
        return acc;
        }, {});
      
        let newSpendings = [
            { tag: "food", amount: 0 },
            {tag: "education", amount: 0 },
            { tag: "office", amount: 0 },
            ];
            spendingData.forEach((item) => {
            if (item.tag == "food") {
            newSpendings [0].amount += item.amount;
            }else if (item. tag=="education"){
            newSpendings [1].amount += item.amount;
            }else{
            newSpendings[2].amount += item.amount;
            }
            });
    
      const config = {
        data:data,
        width:1200,
        xField: 'date',
        yField: 'amount',
        autoFit:true,
       
      };
      const spendingConfig = {
        data:newSpendings,
        width:600,
        autoFit:true,
       angleField:"amount",
       colorField:"tag",
       
      };

      let chart;
      let pieChart;

  return (
    <div className="charts-wrapper">
        <div>
            <h2 style={{ marginTop:0 }} >Your Analytics</h2>
      <Line 
       {...config} />
      </div>
      <div>
            <h2>Your Spendings</h2>
            <Pie {...spendingConfig} />
      </div>
    </div>
  )
}

export default ChartComponent;
