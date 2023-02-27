import React from 'react'
import styles from "../styles/mainapp.module.css";

function profile() {
  return (
    <div className={styles.ProfileDiv}>
        <div className={styles.Profile}>
            <div className={styles.left}>
            <div style={{"display":"flex","flexDirection":"column"}}>
                <h4>Profile Type</h4>
                <span>Applicant</span>
            </div>

            <div style={{"width":"200px","height":"100px","display":"flex","flexDirection":"column","justifyContent":"space-around"}}>
                <button style={{"backgroundColor":"black","color":"white","border":"0","width":"100px","height":"30px"}} >Apply Tresury</button>
                <button style={{"backgroundColor":"black","color":"white","border":"0","width":"100px","height":"30px"}}>Apply Grant</button>
            </div>
            </div>

            <div className={styles.right}>
                    <h3>hello</h3>
            </div>
        </div>
    </div>
  )
}

export default profile