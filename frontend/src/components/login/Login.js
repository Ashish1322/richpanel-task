import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../utils/AppContext";


export default function Login() {
  const {login,loading} = useContext(AppContext)

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  return (
    <div className="card">

      <div className="card__content">
        <h3>Login to your account </h3>
        <form onSubmit={ (e) => {
            e.preventDefault();
            login(email,password)
        }}>
          <label htmlFor="email">Email</label>
          <input value={email} onChange={e => setEmail(e.currentTarget.value)} required type="email" name="email" id="email" />

          <label htmlFor="password">Password</label>
          <input value={password} onChange={e => setPassword(e.currentTarget.value)} required type="password" name="password" id="password" />

          <input disabled={loading} className="btn" id="btn" type="submit" value={loading? "Loading..." :"Login"} />

          <p className="formfooter">New to RichPanel? <Link to="/signup">Register Now</Link> </p>
        </form>
      </div>
    </div>
  );
}
