import { Button, List, Typography } from "antd";
import React from "react";
import { formatCurrency } from "../../../../utils";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface NumberComplementProps {
  title: string;
  onChange: (
    value: {
      item_id: string;
      item_title: string;
      item_price: string;
      quantity: number;
    }[]
  ) => void;
  max?: number;
  items: {
    item_id: string;
    item_title: string;
    item_price: string;
    quantity: number;
  }[];
}

export const NumberComplement: React.FC<NumberComplementProps> = ({
  title,
  items,
  max,
  onChange,
}) => {
  const handleOnChange = (value: typeof items) => {
    onChange(value);
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: "0.5rem",
          alignItems: "flex-start",
        }}
      >
        <List
          style={{
            width: "100%",
          }}
          size="large"
          header={<Typography.Title level={5}>{title}</Typography.Title>}
          bordered={false}
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <Typography.Title level={5}>
                {item.item_title} - {formatCurrency(Number(item.item_price))}
              </Typography.Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                }}
              >
                <Button
                  onClick={() => {
                    if (item.quantity > 0) {
                      handleOnChange([
                        ...items.filter((i) => i.item_id !== item.item_id),
                        {
                          ...item,
                          quantity: item.quantity - 1,
                        },
                      ]);
                    }
                  }}
                >
                  <MinusOutlined />
                </Button>
                <Typography.Text
                  style={{
                    width: "2rem",
                    textAlign: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  {item.quantity}
                </Typography.Text>
                <Button
                  onClick={() => {
                    if (max && item.quantity < max) {
                      handleOnChange([
                        ...items.filter((i) => i.item_id !== item.item_id),
                        {
                          ...item,
                          quantity: item.quantity + 1,
                        },
                      ]);
                    } else {
                      handleOnChange([
                        ...items.filter((i) => i.item_id !== item.item_id),
                        {
                          ...item,
                          quantity: item.quantity + 1,
                        },
                      ]);
                    }
                  }}
                >
                  <PlusOutlined />
                </Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
