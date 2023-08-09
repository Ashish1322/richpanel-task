import React, {useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../utils/AppContext";
import PlanCard from "../plan-card/PlanCard";
export default function Dashboard() {

  const {logout,user,baseUrl,showAlert} = useContext(AppContext)

  // state to store all transactions
  const [transactions,setTransactions] = useState([])

  // fetch all the transaction of the current user
  useEffect(() => {
    fetch(baseUrl+"/plans/subscriptions",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": user.token
      },
    })
    .then(res => res.json())
    .then(data => {
      if(data.success)
      {
        console.log(transactions)
        setTransactions(data.subscriptions)
      }
      else
      {
   
        showAlert(data.message,true)
      }
    })
    .catch(() => {
      showAlert("Failed to fetch transactions ",true)
    })
  })

  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ color: "white", textAlign: "center" }}> Welcome {user && user.name}</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={logout}
          className="btn"
          style={{
            backgroundColor: "white",
            color: "#1e4c91",
            width: "inherit",
            margin: "10px",
          }}
        >
          Log Out
        </button>
        <Link
          to="/plans"
          className="btn"
          style={{
            backgroundColor: "white",
            color: "#1e4c91",
            width: "inherit",
          }}
        >
          Browse Plans
        </Link>
        </div>

        <div style={{marginTop: 20}}>
        {
          transactions ? 
          <div style={{display:"flex",justifyContent:"center",flexWrap: "wrap",gap:"20px"}}>
            {
              transactions.map((item)=>   
              <PlanCard 
              key={item._id} 
              period={item.planDetails.period} 
              type={item.active ? "active" : null} 
              plan={item.planDetails.plan} 
              amount={item.planDetails.period == "month" ? item.planDetails.planInfo["Monthly-Price"] : 
              item.planDetails.planInfo["Yearly-Price"] }  
              data={item} />)
            }
     
      
        
        </div>:
          <h2 style={{textAlign:"center",color:"white",marginTop:"40px"}}> Please Wait, We are Fetching Data....</h2>
        }
        </div>

    </div>
  );
}
