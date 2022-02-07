/**
 * @Author: msc
 * @Date: 2021-12-09 20:02:05
 * @LastEditTime: 2021-12-09 20:38:58
 * @LastEditors: msc
 * @Description:
 */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoice, deleteInvoice } from "../data";
import { Button } from "antd";
export default function Invoice() {
  let navigate = useNavigate();
  let params = useParams();
  let invoice = getInvoice(parseInt(params.invoiceId, 10));
  const [show, setShow] = useState(true);
  return (
    <main style={{ padding: "1rem" }}>
      <h2 className="animate__animated  animate__pulse">
        Total Due: {invoice.amount}
      </h2>
      <p>
        {invoice.name}: {invoice.number}
      </p>
      <p>Due Date: {invoice.due}</p>

      <Button
        type="primary"
        onClick={() => {
          deleteInvoice(invoice.number);
          navigate("/invoices");
        }}
      >
        Delete
      </Button>

      <Button
        type="primary"
        // loading
        danger
        onClick={() => {
          setShow(!show);
          // console.log("first",show);
        }}
      >
        Loading
      </Button>

      {show && <h1 className="animate__animated  animate__pulse">Hello</h1>}
    </main>
  );
}
