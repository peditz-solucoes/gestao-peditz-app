import { Button, Typography } from "antd";
import React from "react";
import { Bill } from "../../../../types";
import { useTerminal } from "../../../../hooks/useTerminal";

interface BillCardProps {
  bill: Bill;
}

export const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const { setCurrentTab, fetchBill } = useTerminal();
  const { loadingSelectedBill } = useTerminal();
  return (
    <Button
      style={{
        width: "230px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "140px",
      }}
      loading={loadingSelectedBill}
      onClick={() => {
        fetchBill(bill.id as string).then(() => {
          setCurrentTab("2");
        });
      }}
    >
      <Typography.Title
        style={{
          textAlign: "center",
          marginBottom: "0",
        }}
        level={3}
      >
        Comanda {bill.number}
      </Typography.Title>
      <Typography.Title
        style={{
          textAlign: "center",
          marginTop: "0",
          marginBottom: "0",
        }}
        level={4}
      >
        Mesa {bill.table_datail.title}
      </Typography.Title>
      <Typography.Title
        style={{
          textAlign: "center",
          marginTop: "0",
          marginBottom: "0",
          wordWrap: "break-word",
          wordBreak: "break-word",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        ellipsis={{ rows: 2, expandable: false }}
        level={4}
      >
        {bill?.client_name}
      </Typography.Title>
    </Button>
  );
};
